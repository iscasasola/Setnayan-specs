# Iteration 0019 — Communications (Chat + ~~Video Meetings~~ + File Sharing + Coordinator Join)

> **⚠️ AMENDMENT 2026-05-16 — Video meetings RETIRED.** The Daily.co-backed video meetings feature originally speced in this iteration has been **removed entirely from V1+**. Couples and vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp) for video. The chat + file sharing + in-app file viewers + coordinator-join + force-majeure flow all remain in force. Sections below that mention 1:1 / group video meetings, Daily.co SFU, screen share, recording, and in-meeting chat are **historical context only** — they describe a feature that was speced but never shipped. The vendor Pro Weekly "Video meetings via Daily.co" benefit is also removed. See `CLAUDE.md` 2026-05-16 marketplace/payment/verification lock row for full rationale.

**Iteration number:** 0019
**Topic:** In-app communications between couples and vendors. Threaded text chat (Messenger-class), file sharing with dedicated in-app readers, and a coordinator role permission to join existing client-vendor threads. ~~1:1 and group video meetings (Zoom-class) attached to those threads~~ retired 2026-05-16.
**Surface:** All three role surfaces (customer / vendor / admin) inside the same Setnayan app per the one-app-three-doorways architecture (decision 2026-05-11).
**URL pattern:** `setnayan.com/dashboard/[role]/messages/[thread_id]` ~~, `setnayan.com/dashboard/[role]/meet/[meeting_id]`~~ (meeting routes retired 2026-05-16)
**Builds on:** 0000 (auth + role-router), 0006 (vendor records), 0013 (Supabase + R2 platform stack), 0015 (forward-references this iteration in marketing copy).
**Status:** Drafted 2026-05-11 · vendor identity masking added 2026-05-12 · **video meetings RETIRED 2026-05-16**.
**Phase:** V1 launch-blocking for the vendor side of 0015 marketing site (the marketing copy promises in-app chat + file sharing + coordinator-join; if 0019 doesn't ship, those promises become aspirational). Video meeting promises in marketing copy are also retired 2026-05-16.

---

## Why this iteration exists

Couples and vendors currently coordinate over a stack of third-party apps — WhatsApp, Messenger, Viber, SMS. The conversation history sits outside Setnayan, attached to nothing in particular. Coordinators get pulled into group chats they can't archive, can't search, and can't hand off cleanly when their job ends.

**Pulling chat in-app:**
- Conversation history attaches to the booking record. Search by vendor, by date, by topic.
- Coordinators can be invited to a thread per-thread, not blanket-CC'd into every group chat.
- Files (contracts, mood boards, sample photos) live next to the messages they were discussed in.
- Notifications use the same delivery layer as the rest of the app — one notification stream, not seven.

**Adding video meetings:**
- Same thread context. The discovery call, the post-meeting summary, and the follow-up shoot quote all live in one continuous record.
- No "here's the Zoom link" context-switching at the start of every meeting.
- Recording (with consent) attaches to the thread for later review.

**Coordinator-join permission:**
- Couples often hire planners after they've already booked some vendors. The planner needs to read what's already been discussed and join the active threads — but only the threads the couple grants access to.
- Vendors don't get a planner shoved into their thread without notice; the couple authorizes the join, the vendor sees the planner appear in the participant list with a notification.

---

## Reference designs

| Surface | Reference | Why |
|---|---|---|
| Text chat | **Facebook Messenger** | Threads, presence, typing, reactions, attachments, voice notes, group chats. Universally understood UX in PH; couples and vendors already know how to use it. |
| Video meetings | **Zoom** | 1:1 + group, gallery view, screen share, mute/cam controls, recording, in-meeting chat. Zoom's UX is the lingua franca for business video in PH. |
| Coordinator join model | **Slack channel invite** | Per-channel join permission, visible participant list, notification when a new participant joins. |

We are NOT cloning Messenger or Zoom feature-for-feature. We are matching their **interaction grammar** so the learning curve is zero, then adding Setnayan-native context (booking record attachment, vendor service category routing, post-meeting AI summary).

---

## Scope (V1 — launch-blocking for 0015 vendor promises)

**In scope:**

- 1:1 text chat threads (couple ↔ vendor)
- Group text chat threads (couple ↔ vendor + coordinator(s))
- **Follow-before-message gate** — customer must follow the vendor before opening a thread (locked 2026-05-14, see § Gate)
- **Privacy notice (pinned system message)** at the top of every thread (non-dismissible, locked 2026-05-14, see § Gate)
- Presence (online / away / offline / last seen)
- Typing indicators
- Read receipts (per-message)
- Reactions (emoji, single-tap)
- Attachments: image, PDF, voice note (≤ 60s)
- Threaded replies (Messenger-style "reply to message" anchored to the original)
- ~~1:1 video meetings, Zoom-class controls (mute / cam off / leave)~~ **RETIRED 2026-05-16**
- ~~Group video meetings (≤ 8 participants in V1; raises to 16 in V1.1)~~ **RETIRED 2026-05-16**
- ~~Screen share (desktop browser only in V1; mobile screen share in V1.1)~~ **RETIRED 2026-05-16**
- ~~In-meeting chat (separate from the parent thread, persists into the parent thread on meeting end)~~ **RETIRED 2026-05-16**
- ~~Recording (with explicit consent banner; recording lands on R2, link posts to the parent thread)~~ **RETIRED 2026-05-16**
- Coordinator join permission (per-thread; couple authorizes, vendor + coordinator notified)
- Notifications: in-app (always), push (V1.1), email digest (V1.1)
- **External video tool handoff:** when a video call is needed, the in-app chat composer surfaces a "Share meeting link" affordance — the couple or vendor pastes a Google Meet / Zoom / Messenger / WhatsApp URL into the thread (auto-detected, rendered as a tappable card with title + time-range hint). Setnayan does NOT host the video — the parties use whichever external rail they already use.

**Out of scope (deferred to V1.1+):**

- Voice-only calls (covered by video meeting with cam off in V1)
- Auto-translation (the EN/TL/CEB locale work in 0015 doesn't extend to chat translation in V1)
- AI post-meeting summary (queued for V1.1)
- File annotations / collaborative editing on attachments
- Custom emoji
- Message scheduling
- Whiteboard / collaborative canvas inside meetings
- Breakout rooms
- Live captions
- Vendor-to-vendor chat (vendors talking to other vendors — out of scope by privacy invariant; couples mediate)

---

## Pricing — free use (locked 2026-05-11)

Every capability shipped in this iteration is **free for every Setnayan account** — couples, vendors, and coordinators alike. No per-feature charge, no per-meeting fee, no per-GB attachment surcharge, no premium tier behind chat or video.

**What "free use" covers:**

- Unlimited 1:1 and group chat threads between any pair (or trio with coordinator)
- Unlimited messages, reactions, replies, edits
- File attachments up to the per-file and per-thread caps (image 25 MB, pdf 50 MB, doc/sheet 25 MB, voice 60s; thread cap 5 GB rolling)
- In-app doc / spreadsheet / pdf / image readers — no download required
- ~~Unlimited 1:1 video meetings (Zoom-class)~~ **RETIRED 2026-05-16 — use external tools (Google Meet / Zoom / Messenger / WhatsApp)**
- ~~Group video meetings up to 8 participants (raises to 16 in V1.1)~~ **RETIRED 2026-05-16**
- ~~Screen share + recording (with consent)~~ **RETIRED 2026-05-16**
- Coordinator-join permission

**Why free:** Communication is the connective tissue of the entire platform. Gating it behind a paywall would push couples and vendors back to WhatsApp / Messenger and gut the in-app value-prop. The marginal cost is small (chat + R2 storage measured in fractions of a peso per thread per month) and is absorbed into the platform's general operating budget — not passed through. ~~Video meetings via Daily.co (~₱6 per 60-min 1:1) were also part of the free-use bundle until retired 2026-05-16.~~

**What this means for marketing:**

- 0015 marketing copy ~~calls out "free in-app chat, video meetings, and file sharing"~~ now reads "free in-app chat & file sharing" (video meetings reference removed 2026-05-16) as a baseline benefit on both the customer and vendor sides — it's not a feature you "unlock," it's just how the platform works.
- Vendor-side hero already says "no commission, no monthly bill" — free communications is implicit in that promise; reinforce explicitly in the vendor perks list.

**What free use does NOT cover (and never will, per scope):**

- Vendor-to-vendor private messaging (out of scope by privacy invariant — couples mediate)
- Public profile messaging (DMs from random visitors to vendors — not a feature; couples must follow the vendor first per § Gate, then open a thread)
- Vendor-initiated cold threads (vendors cannot DM customers who haven't started a thread; vendors can only reply within existing threads — preserves the customer-mediated invariant)
- Email / SMS routed through Setnayan (V2; for V1, Setnayan messages stay in-app)

**Cost model for finance reconciliation:** even though the user sees free, finance still tracks per-GB R2 cost per event. These show up in the platform's internal cost-per-event reporting, not on any user-facing receipt. Use this data to size the operating budget, not to introduce a paywall. ~~Per-meeting Daily.co cost was previously tracked here — retired 2026-05-16 with the video-meetings feature.~~

---

## Gate: follow-before-message + privacy notice (locked 2026-05-14)

**The rule.** A customer cannot open a chat thread with a vendor unless they have first followed that vendor. This is the single anti-spam + intent gate on the customer → vendor channel. The vendor side is unrestricted: once any thread exists, the vendor can reply normally, and if the customer un-follows later, the existing thread remains usable (only the creation of *new* threads is blocked until they re-follow).

**Why follow, not booking.**

- Booking is a downstream commitment. Follow is the lightweight discovery signal — couples shortlist vendors well before they're ready to book.
- Follow is a one-tap public-side action on the vendor's `/v/[slug]` profile. No vendor approval needed (one-way follow).
- Symmetric to the existing 0006/0022 vendor-side privacy invariant (couples mediate). The follow gate makes "couples message vendors after viewing the profile" enforceable instead of advisory.

**Not a paywall.** The follow gate is a relationship gate, not a payment gate. The "Pricing — free use" section above still holds; nothing about messaging costs the customer.

**Where the gate is enforced:**

1. **UI** — the `Message` button on the vendor profile (`/v/[slug]`) and on any vendor-card surface is disabled with a `Follow first` affordance until `vendor_follows(follower_user_id=auth.uid(), vendor_profile_id=:vendor_profile_id)` exists.
2. **API** — the create-thread server action (`POST /api/v1/messages/threads`) verifies the follow row exists for the authenticated couple before INSERT into `chat_threads`. Returns `403 FOLLOW_REQUIRED` otherwise.
3. **RLS** — Postgres RLS policy on `chat_threads INSERT` requires the follow row (defense in depth; the API check is the user-facing failure, RLS is the backstop).

**Privacy notice — pinned system message at the top of every thread.**

The notice is rendered as the first row of every chat thread, before any user message. It is non-dismissible, does not count toward unread counts, and is not sender-attributable (no avatar, no sender label).

Canonical copy (locale-resolved per 0015, EN shown):

> *All your event info is already in Setnayan — your vendor sees what they need from your profile. Please don't share private info (government IDs, card numbers, full addresses, OTPs, passwords) in chat. If a vendor asks for these, report it via Help.*

**Vendor-side view.** The vendor sees the same notice as a read-only mirror at the top of their thread view, so they know not to ask for restricted info. Reporting flows to the 0023 admin Help inbox queue.

**Acceptance criteria for this gate** (added to § Acceptance):

- Couple visiting `/v/[slug]` while unauthenticated sees the Follow button → tap → sign-in modal → return to profile with Follow active.
- Couple authenticated, not following: `Message` button shows `Follow to message` hint and is disabled.
- Couple follows: `Message` button enables in-place (no full reload).
- Couple un-follows a vendor with an existing thread: thread remains usable in `/dashboard/[eventId]/messages/[thread_id]`; only the New-thread action is gated.
- POST to create-thread API without a follow row returns `403 FOLLOW_REQUIRED` with a `next_action: "follow"` body.
- Privacy notice appears once per thread (idempotent rendering), is not in `chat_messages`, and is locale-resolved.

---

## Architecture

**Chat infrastructure:** Supabase Realtime + Postgres (already in the platform stack from 0013). Messages stored in `messages` table with `thread_id` foreign key. Presence + typing managed via Supabase Realtime channels. Push notifications via Expo for the native iOS/Android Papic app + web push for the browser.

**Video infrastructure:** **Daily.co** (recommended) or LiveKit (alternative). Both expose a simple JS SDK + REST API; both run on a per-minute SFU billing model that scales linearly with usage. Setnayan's per-meeting cost: ~$0.001/participant-minute = ~₱0.05/participant-minute. A 60-min 1:1 call costs ~₱6. Folded into the relevant SKU pricing or absorbed as a free baseline (decision deferred to pricing review).

**Why not roll our own video stack:** WebRTC SFUs are notoriously expensive to build and maintain (TURN servers, recording infrastructure, NAT traversal, mobile reliability). Daily.co's hosted SFU is purpose-built and battle-tested; the make-vs-buy tradeoff is overwhelmingly buy.

**Why not WhatsApp Business API:** Routes the conversation outside Setnayan, defeating the whole point of pulling chat in-app.

---

## Data model

```sql
-- Follow relationship — couple must follow vendor before opening a thread (see § Gate).
-- One-way: vendor approval not required. Symmetric un-follow does not destroy existing threads.
-- Note: FK targets `vendor_profiles(vendor_profile_id)` (the actual codebase identity)
-- not `vendors(vendor_id)` — match the existing chat_threads.vendor_profile_id FK.
CREATE TABLE vendor_follows (
  follower_user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles (vendor_profile_id) ON DELETE CASCADE,
  followed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_user_id, vendor_profile_id)
);
CREATE INDEX vendor_follows_by_vendor ON vendor_follows (vendor_profile_id, followed_at DESC);

-- A thread is a conversation context. 1:1 by default, group when coordinator joins.
-- INSERT is RLS-gated: a row in vendor_follows must exist for (auth.uid(), vendor_profile_id).
CREATE TABLE chat_threads (
  thread_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events (event_id),  -- every thread is event-scoped
  vendor_id UUID NOT NULL REFERENCES vendors (vendor_id),
  created_by UUID NOT NULL REFERENCES users (user_id),
  topic TEXT,                                            -- optional thread name (e.g. "Pre-nup shoot")
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_thread_participants (
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users (user_id),
  role TEXT NOT NULL CHECK (role IN ('couple','vendor','coordinator')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  invited_by UUID REFERENCES users (user_id),           -- who added this participant
  last_read_message_id UUID,                             -- for read-receipt + unread-count
  notification_pref TEXT NOT NULL DEFAULT 'all'
    CHECK (notification_pref IN ('all','mentions','none')),
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE chat_messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users (user_id),
  body TEXT,                                             -- nullable for attachment-only messages
  reply_to_message_id UUID REFERENCES chat_messages (message_id),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,                                -- soft delete; "Message deleted" placeholder shown
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_attachments (
  attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES chat_messages (message_id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('image','pdf','doc','spreadsheet','voice')),
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  r2_object_key TEXT NOT NULL,                           -- under thread-scoped prefix (see "Dedicated storage" below)
  bytes BIGINT NOT NULL,
  duration_sec INT,                                      -- voice notes only
  preview_r2_key TEXT,                                   -- generated thumbnail / first-page render for doc / sheet
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chat_reactions (
  message_id UUID NOT NULL REFERENCES chat_messages (message_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users (user_id),
  emoji TEXT NOT NULL,                                   -- e.g. "❤️"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id, emoji)
);

-- Video meetings attach to a thread.
CREATE TABLE video_meetings (
  meeting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id),
  scheduled_for TIMESTAMPTZ,                             -- null = ad-hoc "join now"
  daily_room_url TEXT NOT NULL,                          -- the Daily.co room URL
  daily_room_name TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  recording_consent BOOLEAN NOT NULL DEFAULT FALSE,
  recording_r2_key TEXT,                                 -- populated when recording finishes
  created_by UUID NOT NULL REFERENCES users (user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE video_meeting_participants (
  meeting_id UUID NOT NULL REFERENCES video_meetings (meeting_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users (user_id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  PRIMARY KEY (meeting_id, user_id, joined_at)
);

-- Coordinator-join authorization records (per-thread audit trail).
CREATE TABLE thread_join_authorizations (
  authorization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads (thread_id),
  authorized_user_id UUID NOT NULL REFERENCES users (user_id),  -- who's being granted join
  authorized_role TEXT NOT NULL DEFAULT 'coordinator',
  authorized_by UUID NOT NULL REFERENCES users (user_id),       -- who granted (must be a 'couple' role on the thread)
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_messages_thread_idx ON chat_messages (thread_id, created_at DESC);
CREATE INDEX chat_thread_participants_user_idx ON chat_thread_participants (user_id);
CREATE INDEX video_meetings_thread_idx ON video_meetings (thread_id, scheduled_for);
```

**RLS policies:** A user can read messages in a thread only if they're a row in `chat_thread_participants` for that thread. A user can write a message to a thread only if they're a participant AND the thread isn't archived. Coordinator role can join a thread only if a `thread_join_authorizations` row exists granting them — written by the couple via the "Add coordinator to this thread" flow.

---

## Dedicated file storage + in-app readers

**Storage model.** Files attached to chat threads live in a **dedicated R2 bucket** (`setnayan-thread-files`), separate from the existing photo / video buckets used by 0009 / 0011 / 0012. Object key pattern enforces thread scope:

```
threads/{thread_id}/{attachment_id}/{filename}
threads/{thread_id}/{attachment_id}/preview.png   ← generated preview (doc / sheet first-page render)
```

The `{thread_id}` prefix is the access-control boundary: signed URLs are minted only for users whose `chat_thread_participants` row exists for that thread. R2 bucket policy denies public reads — every download goes through an authenticated Setnayan endpoint that resolves the requesting user's participant row before issuing the signed URL.

**Access model (locked):**

- **Default:** files in a thread are accessible to the **customer (couple) and the vendor** participants of that thread — and no one else.
- **Coordinator secondary access:** when the couple authorizes a coordinator to join the thread (`thread_join_authorizations` row), that coordinator gains **secondary access to all files in the thread** — past, present, and future. Same access model as messages: if you can read the thread, you can read its files.
- **Removal:** when the couple removes a coordinator (revokes `thread_join_authorizations`), the coordinator's read access to thread files revokes within the next signed-URL window (max 15 minutes for in-flight URLs; new URLs deny immediately).
- **Cross-event:** files NEVER cross thread boundaries. A vendor active on multiple weddings sees a separate file shelf per thread; nothing global.

**Supported file kinds + in-app readers (V1):**

| Kind | Extensions | Reader | Notes |
|---|---|---|---|
| `image` | jpg, jpeg, png, webp, gif (no autoplay) | Native `<img>` viewer with pinch-zoom on mobile, click-to-zoom on desktop | Inline thumbnail in the chat bubble, full-screen lightbox on tap |
| `pdf` | pdf | `pdf.js` (Mozilla) — page navigation, zoom, search, no download required | Inline first-page preview in the chat bubble; tap → full-screen reader |
| `doc` | docx (also: doc auto-converted to docx server-side) | First-page render → PNG preview via LibreOffice headless on the upload pipeline; full doc renders inline via `mammoth.js` (already in the artifact stack) — read-only HTML | Read-only inline viewer; download for editing if the recipient wants the source |
| `spreadsheet` | xlsx, csv | First-sheet render → preview via `SheetJS`; full file renders inline as a virtualized table (`SheetJS` + `react-virtualized`) — read-only, sortable | Read-only inline viewer; download for editing |
| `voice` | webm/opus (recorded in-app), mp3 (uploaded) | Native `<audio>` element with custom waveform UI | Already covered by the chat composer hold-to-record |

**Preview generation pipeline.** On upload to R2:
1. The Setnayan upload endpoint detects the kind by mime + extension sniff
2. Writes the source file to `threads/{thread_id}/{attachment_id}/{filename}`
3. Enqueues a preview job (Cloudflare Queue) for `pdf` / `doc` / `spreadsheet`
4. Worker runs LibreOffice headless → PNG of first page → writes to `threads/{thread_id}/{attachment_id}/preview.png`
5. `chat_attachments.preview_r2_key` populated; the chat bubble re-renders with the preview

**Per-file size limits (V1):**

- Image: 25 MB
- PDF: 50 MB
- Doc: 25 MB
- Spreadsheet: 25 MB
- Voice: 60 seconds (≈ 1 MB at typical compression)

**Per-thread storage cap (V1):** 5 GB rolling. When approaching cap, oldest attachments are flagged for archive (couple is notified, can opt to download originals before archive). Archived files move to R2 cold tier (still accessible, slower retrieval).

**Privacy invariants:**

- File contents are NEVER scanned by Setnayan staff or AI without explicit per-thread consent (e.g., for the V1.1 AI post-meeting summary feature).
- Coordinator removal revokes file access within 15 minutes (signed-URL TTL).
- Files never appear in admin search / global indexing — they're scoped to the thread, full stop.
- Public links are NEVER generated for thread files; even "share this file" only works between thread participants.

**Why not just use Google Drive / OneDrive integrations?** Three reasons: (1) the moment a file leaves Setnayan into Drive, the access-control boundary becomes the user's Google permissions — we can't enforce coordinator-revocation. (2) Vendors / couples don't want to manage two file systems. (3) Drive previews require auth flows that break the "log in once, everything works" promise. Native in-app readers with R2 storage keep the boundary clean.

---

## UI surfaces (Messenger-class chat)

### Inbox view

`/dashboard/[role]/messages/`

Three-column layout on desktop (sidebar nav · thread list · active thread). Single-column on mobile (thread list, tap to open active thread, back-button to return).

**Thread list item shows:**
- Vendor logo (for couple-side) or couple's profile avatar (for vendor-side)
- Vendor business name / couple's wedding name
- Last message preview (one line, truncated)
- Unread count pill
- Last message timestamp
- Online presence dot (green = online now)

**Sort order:** unread first, then by last-message timestamp descending. "Archived" tab as a sibling toggle.

### Active thread view

Standard Messenger pattern:
- Top bar: vendor name + business + verified badge + presence + "Schedule meeting" + "Add coordinator" + thread settings menu
- Message scroll area: messages bottom-up, sender bubbles right-aligned for self, left-aligned for others
- Avatar + sender name above each non-self bubble (for group threads)
- Reply-to anchor: tap a message to "reply to it"; the reply renders with a small quoted snippet of the original
- Reaction picker: long-press / hover-press a message to add a reaction
- Composer bar: text input + emoji picker + attach (image / PDF / voice) + send
- Voice note: hold-to-record button, max 60s, real-time waveform during recording
- Typing indicator: "[Sender] is typing…" appears below the latest message

### Coordinator-join flow

From the couple-side thread settings menu:
1. Couple taps "Add coordinator to this thread"
2. Modal lists coordinators registered on the couple's event (from 0006 vendor records, role = 'coordinator')
3. Couple taps a coordinator → confirmation dialog (the vendor will be notified that [Coordinator] joined)
4. Confirm → `thread_join_authorizations` row written, `chat_thread_participants` row added, system message posts to the thread: "[Couple] added [Coordinator] to this conversation."
5. Coordinator gets a push + email notification + the thread appears in their inbox

Vendor and coordinator can both LEAVE the thread at any time (their participant row gets soft-deleted, system message posts). Only the couple can REMOVE a coordinator — the vendor can't kick a coordinator the couple invited.

### Vendor identity in chat — logo always, never personal photo (locked 2026-05-12)

When a vendor-side account sends a message in any thread, the **customer always sees the vendor's company logo + business name as the sender** — never the individual team member's personal profile photo or name — regardless of which team member typed the reply. The audit trail underneath retains the actual sender for accountability; the customer surface masks to a single brand identity.

**Why this rule exists:**

A vendor like "Aurora Studios" might have a booking team, a principal photographer, and a scheduling assistant all replying to the same customer thread across the planning lifecycle. From the customer's perspective, they're talking to **"Aurora Studios"** — not to three different humans whose faces and names they don't recognize. Brand consistency on vendor-side messages is the entire point of the vendor's company presence on Setnayan. Leaking individual team members' identities to customers would (a) confuse the customer about who they're actually talking to, (b) expose individual team members publicly without their consent, and (c) break the vendor's professional brand presentation.

**The rule (binding):**

- **Customer-facing display name** = `vendors.business_name` (always)
- **Customer-facing avatar** = the vendor's company logo, resolved from `vendors.logo_r2_key` (always)
- **NEVER displayed to customers:** the actual sender's `users.first_name`, `users.last_name`, or `users.profile_photo_r2_key` on a vendor-side message
- **Audit retention:** `chat_messages.sender_id` is preserved on every row for admin audit + vendor-internal analytics. The masking happens at the read-time resolver layer, not by stripping data at write-time.

**Optional vendor-controlled team-tag (per thread):**

Vendor admin can toggle a "Replied by [team-name]" subtle label on a per-thread basis (e.g., "Booking team" / "Lead photographer" / "Scheduling assistant"). When enabled, the customer sees:

```
[Aurora Studios logo]  Aurora Studios          14:32
                       Replied by Lead photographer
                       "Here are the proofs from..."
```

When disabled (default), the customer sees just:

```
[Aurora Studios logo]  Aurora Studios          14:32
                       "Here are the proofs from..."
```

The team-tag is a vendor-side opt-in for transparency — never customer-controlled, never required, never showing the team member's real name. The label is a vendor-defined string (free text, max 32 chars) per `vendor_users.team_label` column; defaults to NULL (masked).

**Vendor-internal view is unmasked.** When the vendor team looks at the same thread on their dashboard, they see the actual team member's name and photo on each message bubble for internal accountability ("who said what to which customer"). The masking applies ONLY to the customer-facing view.

**Group thread with coordinator:** the coordinator's identity is unmasked (they appear as the actual person — name + photo) because the coordinator is acting in their own professional capacity, not under a vendor brand. Coordinators are typically wedding planners working independently or for a planning agency; their personal brand is what the couple hired.

**Customer-side identity is unmodified.** Customers always show their personal profile photo + name as the sender of THEIR messages. Only vendor-side accounts mask to a logo.

**Resolver pseudocode (read-time):**

```ts
function resolveMessageSender(message, viewer) {
  const sender = users.find(message.sender_id);
  const senderIsVendor = sender.account_type === 'vendor';
  const viewerIsVendorOrAdmin = viewer.account_type === 'vendor' || viewer.account_type === 'admin';

  if (senderIsVendor && !viewerIsVendorOrAdmin) {
    // mask to vendor brand identity
    const vendor = vendors.find(sender.vendor_id);
    return {
      display_name: vendor.business_name,
      avatar_url: r2_signed_url(vendor.logo_r2_key),
      team_label: vendor.show_team_labels_in_chat ? sender.team_label : null,
    };
  }
  // unmasked (customer-side message, OR vendor/admin viewing internal)
  return {
    display_name: `${sender.first_name} ${sender.last_name}`,
    avatar_url: r2_signed_url(sender.profile_photo_r2_key),
    team_label: null,
  };
}
```

**Schema additions for this rule:**

```sql
ALTER TABLE vendors
  ADD COLUMN logo_r2_key TEXT NOT NULL,                  -- mandatory at registration
  ADD COLUMN show_team_labels_in_chat BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE vendor_users
  ADD COLUMN team_label TEXT;                            -- nullable; "Booking team" / "Lead photographer" / etc.
```

**Acceptance tests for the masking:**

- [ ] Customer in a vendor thread sees the vendor's logo + business_name on every vendor-side message, regardless of which team member sent it.
- [ ] Customer never sees a vendor team member's first name, last name, or profile photo in any chat surface.
- [ ] When `show_team_labels_in_chat = TRUE`, the customer sees the vendor's team label below the business name; when FALSE, no team label appears.
- [ ] Vendor team member viewing the same thread internally sees the real sender name + photo for each message bubble.
- [ ] Coordinator in a 3-way thread (couple + vendor + coordinator) shows as themselves (real name + photo) to both other parties.
- [ ] `chat_messages.sender_id` retains the actual sender across all surfaces; an admin audit log query can answer "who at Vendor X replied to Customer Y on date Z".

---

### Force majeure flag flow (locked 2026-05-12)

Either the customer OR the vendor can flag a booking as a **force majeure event** from within the chat thread or the booking detail. The flag triggers a structured mediation workflow.

**The trigger:** in any active customer ↔ vendor chat thread, both parties see a `Flag force majeure` option in the thread settings menu. Tapping it opens a modal:

1. **Type picker (required):** Typhoon / Natural disaster · Severe illness · Family emergency · Government order (e.g., lockdown) · Venue cancellation · Other (describe)
2. **Date occurred (required):** Date picker, defaults to today
3. **Evidence (optional):** Up to 5 photo / PDF uploads
4. **Submit** → creates a `force_majeure_flag` row tied to the booking
5. The other party gets immediate notification (in-app + email via 0028) — "[Name] has flagged this booking as force majeure. Please respond within 7 days."

**The 4-option resolution path:**

Both parties enter a mediation modal showing 4 outcome cards:

| Outcome | What it does |
|---|---|
| **Reschedule** | Both pick a new date together; calendar swap is automatic; original booking moves to new date |
| **Partial refund** | Both negotiate an amount (vendor proposes, customer accepts/counters); on agreement → admin processes |
| **Full refund** | Vendor agrees, customer accepts; booking is cancelled; refund processed within 5 business days |
| **Switch vendor** | Customer wants a replacement; Setnayan helps find one; original vendor refunds proportionally |

Both parties must agree to ONE outcome within 7 days for auto-resolution. If no agreement within 7 days → escalates to **Disputes Handler** (admin). Disputes Handler reviews evidence + chat history + 4-option discussion + decides; outcome is final.

**Schema:**

```sql
CREATE TABLE force_majeure_flags (
  flag_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id       UUID NOT NULL,  -- references the underlying booking
  flagged_by_user_id UUID NOT NULL REFERENCES users(user_id),
  flagged_role     TEXT NOT NULL CHECK (flagged_role IN ('customer','vendor')),
  fm_type          TEXT NOT NULL,  -- typhoon / illness / family_emergency / government_order / venue_cancellation / other
  fm_description   TEXT,
  occurred_at      DATE NOT NULL,
  evidence_r2_keys TEXT[],
  resolution_type  TEXT CHECK (resolution_type IN ('reschedule','partial_refund','full_refund','switch_vendor','admin_mediated','rejected')),
  resolution_details JSONB,
  resolution_amount_php INT,
  agreed_by_customer_at TIMESTAMPTZ,
  agreed_by_vendor_at   TIMESTAMPTZ,
  resolved_at      TIMESTAMPTZ,
  escalated_to_admin_at TIMESTAMPTZ,
  admin_decision_user_id UUID REFERENCES users(user_id),
  admin_decision_notes   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## UI surfaces (Zoom-class video meetings)

### Schedule a meeting

From the active thread top bar → "Schedule meeting" → modal:
- Title (defaults to "Discovery call with [Vendor]")
- Date + time (or "Start now")
- Duration estimate
- Recording on / off toggle (default off; consent banner appears in-meeting)
- Participants (defaults to all current thread participants; couple can add/remove)
- Agenda (optional rich text)

On schedule: a `video_meetings` row is written, `daily_room_url` is provisioned via Daily.co API, a calendar invite (.ics) is generated and attached to the thread as a system message: "Meeting scheduled: [Title] on [Date]. [Join button]."

### In-meeting view

Standard Zoom-class layout:
- Gallery view (default for ≤ 4 participants) or speaker view (default for 5+) — toggle in top-right
- Self-view picture-in-picture, draggable
- Bottom controls: mute / cam off / share screen / chat / participants / leave
- In-meeting chat panel (separate scroll, persists into parent thread on meeting end via system message: "Meeting ended. Chat archived to thread.")
- Recording indicator (red dot top-left) + consent banner ("This meeting is being recorded") if recording is on
- Participant tile shows: name, role badge (couple / vendor / coordinator), mute indicator
- Reactions overlay (Zoom-style 👏 ❤️ 😂 floating up from sender's tile)

### Post-meeting

- `ended_at` timestamp written
- If recording: Daily.co webhook fires → server downloads recording → uploads to R2 → `recording_r2_key` populated → system message posts to thread with playback link
- In-meeting chat appended to parent thread as a system block ("Meeting chat (8 messages) — view")

---

## Performance targets — Messenger-class chat, Zoom-class video

Locked answer to "can we match the speed of Messenger and Zoom?": **yes**, with the right infrastructure choices and engineering discipline. Both are achievable benchmarks because the underlying tech is well-understood and the same building blocks Messenger and Zoom use are available to us.

**Locked targets (V1):**

| Surface | Metric | Target | Reference |
|---|---|---|---|
| Chat | Message-send round-trip p50 | < 150 ms | Messenger is typically 80–200 ms |
| Chat | Message-send round-trip p99 | < 500 ms | Messenger is typically 300–800 ms |
| Chat | Typing indicator latency | < 100 ms | At parity with Messenger |
| Chat | Read-receipt propagation | < 200 ms | At parity with Messenger |
| Chat | Thread initial-paint (50 messages) | < 600 ms cold, < 200 ms warm | Messenger is ~400 ms cold |
| Video | Call setup (tap "Meet now" → first video frame) | < 3 s | Zoom is 1–2 s; we accept slightly slower for V1 |
| Video | One-way audio/video latency | < 200 ms | Zoom is 100–150 ms in good conditions |
| Video | Reconnect-after-network-drop | < 5 s | At parity with Zoom |
| Video | Audio quality at 64 kbps | Comparable to Zoom | Both use Opus codec |

**Why these are achievable:**

1. **Chat = Messenger pattern.** Supabase Realtime is built on PostgreSQL logical replication + WebSocket fanout — the same architectural pattern Messenger uses (proprietary, but conceptually identical). Stack matures quickly with the right discipline:
   - Keep message payloads small (< 4 KB typical)
   - Optimistic UI on send (render the bubble in the sender's view immediately, mark it "sent" when the server confirms — exactly like Messenger)
   - Virtualized scroll in the thread view (`react-window` or equivalent) so a thread with 5,000 messages doesn't kill the DOM
   - Indexed `thread_id, created_at DESC` query for the initial 50-message paint
   - Presence + typing on ephemeral Supabase Realtime channels (NOT persisted writes — those are 10× slower)

2. **Video = Zoom pattern.** Daily.co (and LiveKit, Twilio) are built on the same underlying architecture as Zoom: an SFU (Selective Forwarding Unit) + adaptive bitrate + Opus audio + VP8/VP9/H.264 video. Daily.co specifically benchmarks within 10–15% of Zoom's perceived quality on equivalent network conditions. We won't match Zoom's years of proprietary network optimization, but we'll hit "feels just as smooth" for the 1:1 + small-group calls that dominate vendor discovery.

**What would break the targets (and how we avoid it):**

| Risk | Mitigation |
|---|---|
| Wrong-region hosting | Host Supabase in **Singapore** region (closest to PH; ~50 ms RTT from Manila / Cebu / Davao). Use Daily.co's Singapore SFU. R2 buckets already in PH region per 0013. |
| Heavy payloads | Strip server-side rendering for message bodies; ship plain text + minimal metadata. Attachments stay separate (signed-URL fetch on tap). |
| N+1 queries | Single query per thread paint with a `JOIN` to `chat_thread_participants` for presence; never one-query-per-message. |
| Unwarmed Daily.co rooms | Pre-create the Daily room when the meeting is scheduled (not when the user clicks "Join"). For ad-hoc "Meet now," the room provisions in parallel with the user's media-permission grant — typically the slower of the two paths is the user grant, not the room creation. |
| Mobile network jitter | TURN servers in APAC region (Daily.co handles this); audio prioritized over video when bandwidth drops. |
| React over-rendering | Memoize message bubbles by `message_id`; only re-render on edit / delete / reaction change. |
| Cold WebSocket connection | Keep the WebSocket open while the user is in any Setnayan tab; reconnect on tab focus + offline → online events. |

**What we explicitly accept as worse than Zoom in V1:**

- 1–2s slower call setup (we're not doing aggressive room pre-warming for ad-hoc calls)
- No proprietary "magic" reconnect heuristics (Zoom has years of tuning here)
- ≤ 8 participants per group call in V1 (Zoom does 1,000 — but the use case here is vendor discovery calls, not all-hands)

**Engineering discipline checklist:**

- [ ] Supabase + Daily.co both in Singapore region
- [ ] Index `chat_messages (thread_id, created_at DESC)` exists and is verified by `EXPLAIN ANALYZE`
- [ ] Optimistic-send pattern in the chat composer (render before server-confirm)
- [ ] Virtualized scroll in the thread view
- [ ] Presence + typing on ephemeral channels, never persisted writes
- [ ] Memoized message bubbles
- [ ] Daily room pre-creation on `scheduled_for` write
- [ ] WebSocket kept open while any Setnayan tab is focused
- [ ] Performance test in CI: 500-message thread paint < 600 ms p95 on a throttled 4G profile

**Honest caveat:** speed at this level is an ongoing engineering investment, not a one-time build. We will hit the V1 targets at launch with the architecture above. Maintaining them as the platform scales (10K → 100K → 1M concurrent threads) requires discipline on every PR — performance regressions are easier to ship than performance improvements. CI perf budgets are a hard requirement.

---

## Notifications

**V1:**
- In-app notification bell + unread badge on the Messages tab
- Per-thread unread count
- Browser tab title flash on new message ("(3) Setnayan — Messages")

**V1.1:**
- Push notifications via Expo (iOS / Android)
- Web push (browser)
- Email digest (daily summary of unread threads)

**V2:**
- SMS fallback (only for time-sensitive vendor confirmations)

The deferred-fallback-channels memory rule (2026-05-09) applies — V1 ships in-UI surfacing only.

---

## Acceptance criteria

This iteration is shippable when all of the following are true:

- [ ] A couple can start a 1:1 chat thread with any verified vendor by tapping "Message" on the vendor profile.
- [ ] A vendor can reply to that thread from their vendor dashboard.
- [ ] Both parties see real-time presence (online / away / offline) and typing indicators.
- [ ] Read receipts update per-message; the sender sees "Read" under the most-recently-read message.
- [ ] Reactions (emoji) work via long-press on mobile and hover-press on desktop.
- [ ] Attachments work for image (≤ 10 MB), PDF (≤ 25 MB), and voice notes (≤ 60s, hold-to-record).
- [ ] Reply-to-message anchoring works (Messenger-style quoted snippet above the reply).
- [ ] A couple can add a coordinator to an existing thread via the thread settings menu; both vendor and coordinator are notified.
- [ ] A coordinator can read all messages in a thread they've been added to and write new messages.
- [ ] Only the couple can remove a coordinator from a thread.
- [ ] Either party can schedule a video meeting from the thread top bar; calendar invite (.ics) generates automatically and attaches to the thread.
- [ ] Either party can start an ad-hoc "Meet now" call.
- [ ] Video meeting supports up to 8 participants with mute / cam-off / screen-share controls.
- [ ] In-meeting chat persists into the parent thread on meeting end.
- [ ] Recording (with explicit consent banner) lands on R2 and posts to the thread with a playback link.
- [ ] All chat + meeting data is event-scoped via `chat_threads.event_id`; RLS enforces participant-only access.
- [ ] Couple can archive a thread; archived threads move to the "Archived" tab.
- [ ] Inbox sorts unread first, then by last-message timestamp descending.
- [ ] Mobile thumb-friendly: composer is bottom-fixed with adequate tap targets (≥ 44pt).
- [ ] Daily.co integration cost is logged per-meeting for finance reconciliation.

---

## Build order

1. **Sprint 1** — Schema migration + RLS policies. `chat_threads` / `chat_thread_participants` / `chat_messages` / `chat_attachments` / `chat_reactions` tables. Supabase Realtime channel-per-thread setup.
2. **Sprint 2** — Inbox view (web + mobile). Thread list, unread counts, sort order, "Archived" tab.
3. **Sprint 3** — Active thread view. Message bubbles, composer, send, real-time receive via Supabase Realtime.
4. **Sprint 4** — Presence + typing indicators (Supabase Realtime presence channels). Read receipts.
5. **Sprint 5** — Reactions + reply-to-message anchoring + edit / delete.
6. **Sprint 6** — Attachments (image / PDF / voice) → R2 upload pipeline. Thumbnail rendering for images, audio waveform for voice notes.
7. **Sprint 7** — Coordinator-join flow. `thread_join_authorizations` table, "Add coordinator" modal, system messages, notification routing.
8. **Sprint 8** — Daily.co integration. `video_meetings` schema. Schedule-meeting modal + .ics generation. Ad-hoc "Meet now" button.
9. **Sprint 9** — In-meeting UI (web + mobile). Gallery / speaker view, controls, in-meeting chat, screen share.
10. **Sprint 10** — Recording pipeline (Daily.co webhook → R2 → thread system message).
11. **Sprint 11** — Acceptance test pass + load test (50 concurrent threads per Realtime channel; 8-participant meeting stress).

Roughly 8–10 weeks at 1 dev. 5–6 weeks at 2 devs.

---

## Open questions

- **Daily.co vs LiveKit vs Twilio?** Recommendation: Daily.co. Cleanest API, best per-minute pricing, recording out of the box. LiveKit if we ever need to self-host (we don't, in V1). Twilio is over-priced for this use case.
- **Per-meeting cost: absorb or pass through?** **DECIDED 2026-05-11: ABSORB. Free use across the board.** Per-feature paywalls would gut the in-app value-prop and push communications back to WhatsApp. Cost (~₱6 per 60-min 1:1, fractions of a peso for chat) is absorbed into the platform's operating budget. Revisited only if a single event exceeds 500 hrs/month sustained, at which point we'd consider per-event throttles, not paywalls.
- **Voice-only calls in V1?** Recommendation: defer. A video meeting with cam off is functionally a voice call; building a separate voice-only surface is engineering tax for marginal UX gain.
- **AI post-meeting summary?** Recommendation: V1.1. The Anthropic API call to summarize a 60-min Daily.co transcript is cheap (~₱5) and high-value, but not launch-blocking.
- **Vendor-to-vendor chat?** Recommendation: never in V1 product line. Privacy invariant — vendors talk through couples, not directly. If two vendors need to coordinate (e.g., florist + venue), they can be added to a group thread by the couple.

---

## Companion specs and cross-references

- `0000_app_shell_and_navigation/` — Messages tab in the bottom-nav (or sidebar on desktop) for both customer and vendor surfaces.
- `0006_vendors_management/` — vendor records that "Message" buttons attach to.
- `0013_platform_stack_and_sync/` — Supabase Realtime is the chat transport; R2 is the attachment + recording store.
- `0015_main_website/` — forward-references this iteration in the vendor section ("In-app chat & video meetings" / "you can pull a coordinator into a vendor chat"). Marketing copy must be revised in lockstep if 0019 scope changes materially.
- `CLAUDE.md` — decision log entry 2026-05-11 "0019 Communications iteration queued."

---

[View this iteration's HTML mockup](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0019_communications/0019_communications.html)

[View this iteration's Word document](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan%20App/0019_communications/0019_communications.docx)

---

## V1.2 Amendment — Multi-Moderator Vendor Chat (added 2026-05-19)

Per [0048 Multi-Moderator Event Access](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md), vendor chat threads gain moderator-aware visibility in V1.2.

### Memory rule update (APPROVED 2026-05-19)

Updated memory rule: **"Customer-side actor (couple OR authorized moderator) initiates vendor chat"** ([feedback_setnayan_customer_initiates_chat.md](../../../.claude/projects/-Users-icecasasola/memory/feedback_setnayan_customer_initiates_chat.md)) — owner-approved 2026-05-19, superseding the prior couple-only rule.

**V1.2 framing:** Couple OR authorized moderator initiates vendor chat. Moderator must have `can_message_vendors=TRUE` permission per their `event_moderators.permissions_json` from [0048](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md). Defaults: couple (bride + groom) + parents of bride/groom + wedding_planner_external = YES; sponsors (ninong/ninang) / family helpers / viewers / maid_of_honor / best_man = NO. Couple can override per individual moderator. Vendor sees the event context (not the moderator's personal context); replies route to all moderators in the thread with chat-read access, respecting visibility tags.

This unblocks parents of bride/groom + wedding planner moderators from messaging vendors directly (a real PH pattern — parents often coordinate with caterers / venues without bride/groom intermediation).

### Schema additions to `vendor_chat_threads`

```sql
ALTER TABLE vendor_chat_threads
  ADD COLUMN initiated_by_user_id UUID NOT NULL REFERENCES users(user_id),
  ADD COLUMN initiated_by_role_subtype TEXT,             -- snapshot of role at thread creation
  ADD COLUMN private_to_role TEXT[],
  ADD COLUMN hidden_from_role TEXT[],
  ADD COLUMN surprise_for_role TEXT;
```

### Behavior changes

- **Thread visibility** — chat threads tagged with `private_to_role` / `hidden_from_role` / `surprise_for_role` filter per viewer. Bridal-gown chat thread auto-hides from groom by default (per [0048 § Default-hide rules](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md)).
- **Reply routing** — vendor sends a reply → in-app notifications + emails route to moderators with chat-read access for that thread (visibility-filtered).
- **Vendor sees event context** — vendor's view of the thread shows the event name + couple, not the specific moderator's name. Moderator's name appears on individual messages, but the thread identity is the event itself.
- **Coordinator-join** — existing coordinator-join flow extends: a Setnayan-vendor wedding coordinator can be invited into a thread by the couple OR a moderator with `can_add_moderators=TRUE`. Per-thread join scope respects [0048](../0048_multi_moderator_event_access/0048_multi_moderator_event_access.md) visibility tags.

### Force-majeure flow

Force-majeure dispute flow per existing [0019 spec](#) gains per-payer scope from [0049 § Edge cases](../0049_multi_payer_cart/0049_multi_payer_cart.md). Only the specific payer can dispute their share of a split-cost item; the couple can always escalate any dispute.
