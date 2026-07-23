# Vendor ↔ Customer Connection — Build Plan

> Dated 2026-07-10. Three builds on the shared **thread** surface: (1) payment-deadline fix, (2) file sharing in chat, (3) split-screen video call. Grounded in the shipped `apps/web` code (main worktree), not specs. Code repo: `~/apps` · corpus: `~/Documents/Claude/Projects/Setnayan`.

## The shared surface

Everything lands on the one thread that both sides already share:

- Customer view — `app/dashboard/[eventId]/messages/[threadId]/page.tsx`
- Vendor view — `app/vendor-dashboard/messages/[threadId]/page.tsx`
- Composer — `app/_components/chat-send-form.tsx` (text-only today)
- Send logic — `lib/chat-actions.ts` (`sendChatMessage`), `lib/chat-send.ts`
- Live stream — `app/_components/chat-message-stream.tsx` (Supabase Realtime, already subscribed)
- Table — `chat_messages(message_id, thread_id, event_id, vendor_profile_id, sender_user_id, sender_role, body, created_at, proposal_id)`
- Notifications — `lib/notification-emit.ts` (`emitNotification`)
- Gate — `threads.inquiry_status` (`pending` → masked lead; `accepted` after the vendor spends 1 token via `unlock_vendor_event`)

## Build order

1. **Payment-deadline fix** — smallest, backend-only, no new infra, highest value.
2. **File sharing** — medium; new column + R2 upload + composer + render.
3. **Split-screen call** — largest, but reuses the demo transport wholesale; ships behind the accepted-thread gate.

Each PR gets a `changelog.d/<slug>.md` fragment with a `SPEC IMPACT:` line (per repo CLAUDE.md). Do NOT edit `CHANGELOG.md`/`STATUS.md` in the feature PR. Enable auto-merge right after `gh pr create`.

---

## PR 1 — Payment-deadline fix (auto-seed schedule at lock)

**Problem.** Deadlines only appear when the couple *locks* the vendor (`finalizeVendor`, `app/dashboard/[eventId]/vendors/actions.ts` ~597, snapshot 1356–1435). Lock reads the booked service's `vendor_service_payment_schedules`, runs `computePlanInstances`, and upserts `event_vendor_payment_plan.instances_json`. If the vendor set **no** schedule, the couple gets an **empty plan → silent "pay directly" fallback** (actions.ts:1346, 1430–1432). Silent quality cliff.

**Fix.** In `finalizeVendor`, when the resolved schedule is empty, synthesize a default before `computePlanInstances`:
- Reuse the 50/50 logic already in `addSuggestedMilestones` (`app/dashboard/[eventId]/budget/actions.ts:245–355`) — factor it into a shared pure helper (e.g. `lib/payment-schedule-default.ts`) so both call sites share one definition.
- Default: `seq 0` = 50% `due_anchor='on_lock'`; `seq 1` = 50% `due_anchor='before_event'`, `due_offset_days=14`.
- Stamp the plan as `is_default_seeded=true` (new boolean on `event_vendor_payment_plan`) so the UI can show "estimated — confirm with your vendor" and the vendor can override later.

**Schema.** One additive column: `event_vendor_payment_plan.is_default_seeded boolean not null default false`. No RLS change (existing plan policies apply).

**UI.** In the couple budget/workspace plan card, when `is_default_seeded`, render a muted "Estimated schedule — your vendor hasn't set terms yet" note. No new screens.

**Verify.** Lock a marketplace vendor that has no `vendor_service_payment_schedules` row → confirm `event_vendor_payment_plan.instances_json` has two dated 50/50 installments and the note renders.

**Spec impact.** DECISION_LOG row: "lock auto-seeds a 50/50 default payment plan when the vendor set no schedule."

---

## PR 2 — File sharing in chat (attach → R2)

> ✅ **BUILT 2026-07-11** (branch `feat/chat-file-sharing`). Migration `20270713300000_chat_message_attachments.sql` (4 additive nullable columns, RLS untouched); `sendChatMessageCore` takes an optional `File` (MIME allowlist + 25 MB, upload AFTER accept-gates, graceful non-throwing failure); `uploadPublicAsset` gained optional `allowedMime`/`maxBytes` overrides (defaults keep every existing caller image-only/6 MB); composer paperclip + filename chip; stream renders image thumbnails / file chips. Public R2 URL for v1 — signed-URL hardening remains the tracked follow-up below.

**Problem.** Composer is text-only. Files move only through structured surfaces (payment receipts, `booking_handovers`). The 0019 spec promised general doc/image sharing in threads.

**Schema.** Additive columns on `chat_messages` (mirror the `proposal_id` payload pattern):
- `attachment_url text`, `attachment_name text`, `attachment_mime text`, `attachment_size_bytes int`.
- A message is either a text body OR carries an attachment (or both, like a caption).

**Storage.** Reuse `uploadPublicAsset` (`lib/storage.ts` → R2, 4-bucket routing) with `pathPrefix = chat/${threadId}` — this matches the existing `vendorPostHandover` precedent (unguessable public URL). Validate MIME (image/*, application/pdf, common doc types) + size cap (e.g. 25 MB) server-side.
- *Hardening (follow-up, not v1):* swap to RLS-checked signed URLs so only the two thread parties can fetch. Note it, don't block v1.

**Server action.** Extend `sendChatMessage` (`lib/chat-actions.ts`) / `lib/chat-send.ts` to accept an optional `File` in the FormData: upload → insert the message with attachment columns. Keep the same thread-membership authorization already there.

**UI.**
- `app/_components/chat-send-form.tsx` — add a paperclip `<input type="file">` (accept list), show a pending-file chip before send.
- `app/_components/chat-message-stream.tsx` — render an attachment bubble: image → inline thumbnail; PDF/doc → file chip with name + size + download. Realtime already carries the new rows.

**Verify.** Couple attaches a PDF; vendor sees it in the same thread live and can open it. Reverse direction. Oversized/blocked MIME rejected.

**Spec impact.** 0019 "file sharing" moves from promised → shipped (text + attachment). Note the public-URL-vs-signed-URL follow-up.

---

## PR 3 — Split-screen video call (reuse the demo transport)

**Concept (owner-confirmed).** A call = the Live Studio demo run in both directions. Media is peer-to-peer (never hits a server), STUN-only, **₱0 marginal cost — identical to the demo**, including the demo's connect-or-fail-gracefully behavior. No per-minute SDK (no Twilio/Agora/LiveKit). TURN is an optional later reliability top-up for the rare both-sides-hard-NAT case — NOT required, NOT part of matching the demo.

**Reuse (already built).**
- Transport — `lib/demo-webrtc.ts`: `publishDemoCamera` (camera+mic, offers), `watchDemoCameras`/`subscribeToDemoCamera` (renders feeds), `CamSlot`.
- Split-screen viewer — `app/_components/home/panood-demo-overlay.tsx`: `VideoTile` + the `['a','b']` tile grid (this IS the two-videos-side-by-side surface).

**Delta.**
1. **Both parties run both roles** — each publishes its own slot (vendor=`a`, couple=`b`) AND views the tile grid. New thin client component `thread-call-room.tsx` composing `publishDemoCamera(ownSlot)` + the tile grid.
2. **Audio** — in the call, unmute the *other* tile, mute your own (kills echo). One-line change vs. the demo's on-air monitor.
3. **Signaling room** — key the Supabase Realtime broadcast channel `call:{threadId}` (demo uses `demo-rtc:{sessionId}`). Same infra, authenticated sessions.
4. **Ring / join** — "Start call" button on the thread → `emitNotification` to the other party (reuse the change-order/handover notify pattern) + a lightweight `thread_calls(thread_id, started_by, status, started_at, ended_at)` row for state + presence. Other side taps → joins the room.
5. **Presence + fallback** — use the Realtime presence the demo channel already supports; if the callee is offline, show "they're not online — leave a message."

**Voice / video toggle.** Both modes on the same transport:
- *Voice call* = `getUserMedia({ audio: true, video: false })` — mic only, no tiles. Strict subset; less work, lower bandwidth, and connects through **more** networks than video (smaller stream hole-punches more easily) — so voice is the safer default, video the upgrade.
- *Video call* = camera + mic + split-screen tiles.
- *Mid-call toggle* = flip the video track's `enabled` (`track.enabled = false/true`) to drop to voice or bring video back — no renegotiation, no extra plumbing.
- "Start call" offers Voice / Video; a camera on/off button lives in the call room.

**Gate.** Call button only on `inquiry_status='accepted'` threads (post-token-unlock). Keeps it consistent with "pay for the doorway."

**Schema.** `thread_calls` (state only; no media). RLS: the two thread parties (reuse `current_thread_ids` helper).

**UI.** Call button in both thread pages; `thread-call-room.tsx` overlay (in-flow, not `position:fixed`) with two tiles + mute/hangup.

**Verify.** Two devices on different networks (as already tested on the demo): start call from an accepted thread, both feeds render side by side, both hear each other, hangup ends cleanly. Offline-callee fallback shows.

**Spec impact.** Un-retires vendor↔couple video, scoped as free P2P split-screen call on the demo transport (supersedes the 2026-05-16 "use external tools" for this surface). TURN flagged optional v1.1.

---

## Cost summary

| Build | Marginal cost | New infra |
|---|---|---|
| PR 1 payment-deadline fix | ₱0 | none |
| PR 2 file sharing | R2 storage only (pennies/GB, already have R2) | none |
| PR 3 split-screen call | **₱0 per call — like the demo** | none (TURN optional, later) |
