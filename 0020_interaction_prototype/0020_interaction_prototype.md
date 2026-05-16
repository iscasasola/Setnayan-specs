# 0020 — Setnayan Cross-Iteration Interaction Prototype

> **Purpose.** Walk the end-to-end interaction surface — Vendor → Customer → Papic operator → Guest — across every paid-feature activation in V1, so we can find misconnections between iterations before any of this turns into code. This is not a new feature spec; it is a **wiring check** over the iterations already drafted (0000–0019).
>
> **Status:** drafted 2026-05-11
> **Companions:** `0020_interaction_prototype.html` (interactive walkthrough), `0020_interaction_prototype.docx` (stakeholder mirror)

---

## 1. Actors in scope

| Actor | Surface | Auth model | Role in this prototype |
|---|---|---|---|
| **Vendor** (e.g., photographer) | Web (desktop) + Web (mobile) on `setnayan.com` | `users.account_type = 'vendor'` | Registers, gets verified, manages bookings, chats with couples |
| **Customer / Couple** | Web (desktop + mobile) on `setnayan.com` | `users.account_type = 'customer'` | Creates event, books vendors, activates paid features, manages everything |
| **Papic Operator** (designated friend) | Native iOS / Android (Papic app) | Wedding-scoped ephemeral session token via QR claim | Captures photos & 5-sec clips, tags via QR scan / face / table fan-out |
| **Guest** | Web (mobile-first) on couple's landing page | Personal QR token | RSVPs, optionally uploads face for auto-tag, views tagged photos, builds Personal Reel |
| **Setnayan Team Admin** (off-stage) | Internal admin surface | `users.account_type = 'admin'` | Verifies vendor registrations, confirms PayMongo / bank-transfer payments |

The prototype's persona switcher exposes four (Vendor, Customer, Operator, Guest); Admin is shown as inline annotations because no end-user lives there.

---

## 2. The 8 phases at a glance

| # | Phase | Iterations touched | Primary actors |
|---|---|---|---|
| 1 | **Discovery & Onboarding** | 0015 marketing, 0000 app shell | Vendor, Customer |
| 2 | **Vendor Booking** | 0006 vendors, 0015 marketing | Customer, Vendor |
| 3 | **Communications** | 0019 chat + video + file sharing | Customer, Vendor, (Coordinator) |
| 4 | **Foundational Customer Setup** | 0001 guests, 0002 invites, 0004 widgets, 0008 seating, 0010 mood board | Customer, Guest |
| 5 | **Apparatus Activation (paid features)** | 0011 live stream, 0012 papic, 0011/0012 monogram pack, 0005 LED, 0011 broadcast style, 0011 AI highlight | Customer (+ Admin confirm) |
| 6 | **Operator Onboarding** | 0012 papic seat claim, DSLR pairing | Operator |
| 7 | **Event-Day Capture** | 0012 papic capture, 0011 live stream, 0008 table QR fan-out | Operator, Customer, Guest |
| 8 | **Post-Event Delivery** | 0012 review window, 0012 personal reels, 0011 AI Edited Highlight, 30-day compression rule | Customer, Guest |

Each phase decomposes into 2–6 scenes in the HTML prototype, with both web and mobile frames where relevant.

---

## 3. Cross-iteration data handoffs (the wiring map)

These are the joins that have to be right. Every arrow below corresponds to an interaction-surface that the HTML walks through.

```
0015 marketing form  →  vendor_registrations  →  Admin queue  →  users (vendor) + vendors record  →  visible in 0006 catalog
0000 event create    →  events row            →  event_join_tokens (QR)  →  event_members rows  →  consumed everywhere
0006 vendor booking  →  vendor row attached to event  →  vendor_meetings + vendor milestones  →  consumed by 0007 budget
0006 booking         →  auto-create 0019 chat_thread (couple ↔ vendor)
0007 budget calendar →  .ics export (vendor_meetings + line items + Setnayan platform spend)
0008 seating publish →  mint table_qr_tokens on all tables  →  print_pack PDF
0008 guests + chairs →  guest face enrollment from 0001 profile photo + 0002 portal upload  →  face_enrollments
Apply-then-pay (any paid SKU) →  service_application row  →  payment_instructions email  →  Admin confirms  →  service_activations row flips active
  ↳ Papic activation  →  N × paparazzi_seats with claim_qr_tokens (3 or 5)
  ↳ Live Stream activation  →  live_stream_event row + 3 camera slots (+ add-ons)
  ↳ Custom Monogram Pack  →  events.monogram_pack_active = TRUE  (event-wide flag consumed by Papic + Live Stream + Reels + gallery chrome)
  ↳ Broadcast Style Pack  →  live_stream_event.style_pack_active = TRUE
  ↳ Pro Camera Bridge  →  dslr_pairings slot reserved (bound to one paparazzi_seat or one live_stream_camera)
  ↳ LED Background     →  led_render job  →  USB delivery
  ↳ AI Video / Edited Highlight  →  ai_highlight_job  →  render queue
0012 papic capture   →  photos row + photo_tags row (auto_face | individual_qr | table_qr | manual_pick)
0012 table QR scan   →  fan-out to all guests assigned to that table_id (capped at 10 total tags per photo)
0012 review window   →  events.public_unlock_at = capture_complete + 7d  →  guest galleries unlock
0012 personal reel   →  reels_jobs  →  template manifest + music manifest  →  FFmpeg render  →  R2 output  →  guest download
30-day post-download rule  →  scheduler job per photo  →  compress original in place 30 days after first download
```

Anywhere a row in this map crosses a boundary between two iterations, **a misconnection is possible**. The HTML flags those junctions with red badges.

---

## 4. Apply-then-pay (locked 2026-05-11) — how the prototype models it

All paid SKUs run through the same flow. The prototype demonstrates Papic, Live Stream Base, Custom Monogram Pack, Broadcast Style Pack, LED Background, and Pro Camera Bridge all going through the same pipe.

**V1 payment model (locked).** Two static Setnayan accounts only — **BDO bank transfer** and **GCash**. No automated payment gateway (PayMongo / Stripe / direct GCash API) in V1. Every payment is matched manually by Setnayan Team within 24 hours, against the screenshot + order confirmation the customer submits.

```
Customer  →  Add-ons tab  →  picks SKU
         →  /apply form (event_id, sku_code, quantity, notes)
         →  service_applications.status = 'pending_payment'
         →  payment-instructions email sent
            (two static accounts listed: BDO bank transfer + GCash)
            (reference code: application's human-readable code, e.g. app_papic5_x9h2)
         →  Customer pays externally (BDO transfer OR GCash to the static Setnayan numbers)
         →  Customer replies to email OR uploads via the app:
              (1) screenshot of payment receipt
              (2) short order confirmation (the application ref + service name)
         →  Notification fires to Setnayan Team (admin payment-verification queue + Slack webhook)
         →  Admin opens the verification queue
              → cross-checks the screenshot against Setnayan's BDO statement / GCash inbox
              → if the deposit really pushed through:
                  click "Verified · activate service"
                  service_applications.status = 'active'
                  per-SKU activation hook fires (idempotent):
                    - Papic 5-seat       →  insert 5 × paparazzi_seats with claim QRs
                    - Live Stream Base   →  insert live_stream_event + 3 camera slots
                    - Custom Monogram    →  UPDATE events SET monogram_pack_active = TRUE
                    - Broadcast Style    →  UPDATE live_stream_event SET style_pack_active = TRUE
                    - Pro Camera Bridge  →  INSERT pro_camera_bridge_grant
                    - LED Background     →  INSERT led_render_job
                    - AI Highlight       →  INSERT ai_highlight_job (multi-purchase tolerated)
              → if the deposit didn't push through (amount/ref mismatch, no deposit):
                  click "Mismatch — contact customer"
                  Setnayan sends customer a follow-up email asking for clarification
         →  Customer sees "active" on the Add-ons tab
         →  In-app notification to all paparazzi crew if Papic was just activated
```

**Why no automated gateway in V1.** Keeps complexity low, fees at 0%, and the apply-then-pay model is a deliberate trust-building flow with early customers — Setnayan Team is in the loop for every activation, which catches misapplied payments before they cause downstream confusion. Automated gateway is a V1.5+ scope expansion when transaction volume justifies the integration work.

**Misconnection hotspot.** The activation hook is the most error-prone surface. Anything that depends on the event-wide monogram flag (Papic photo exports, Live Stream broadcast, Reels render, gallery chrome) has to **re-check the flag at the moment of asset generation**, not cache it at app start. The HTML flags this at scenes 5e and 7f.

---

## 5. Misconnection log

Each row below is something the HTML highlights with a clickable red flag. The flag opens a sidebar note with the same body text.

| # | Where | Risk | Mitigation in spec |
|---|---|---|---|
| **MC-01** | Phase 1, scene 1b | Vendor registers but admin queue is empty / unstaffed → vendor sits in `pending_verification` forever, never appears in 0006 catalog. | 3-business-day verification SLA must page Setnayan Team. Auto-email vendor at 48h "still under review." |
| **MC-02** | Phase 1, scene 1c | Customer's first event auto-jump (1-active rule from 0000) collides with no events existing yet. New customers must land on event-create wizard, NOT picker. | 0000 spec says `events.length === 0 → /onboarding/create-event`. Verify the router branch. |
| **MC-03** | Phase 2, scene 2c | Booking flow creates vendor_meetings BEFORE chat_thread, so first chat appears empty of context. Chat thread should backfill a system message with booking summary on creation. | Make `chat_thread_create_on_booking` a single transactional unit with `vendor_milestone_insert` + `system_message_insert`. |
| **MC-04** | Phase 3, scene 3d | Coordinator added to thread → file-access TTL on signed URLs (15 min per 0019) means previously-issued URLs in the coordinator's older browser tabs may still resolve for ~15 min after revocation. Acceptable but document it. | Spec already accepts the 15-min window. Surface it in admin UI when granting/revoking. |
| **MC-05** | Phase 4, scene 4b | Seating chart published but couple later edits the chart → table_qr_tokens are **idempotent on re-publish** (existing tokens unchanged, new tables get fresh tokens). Need to ensure removed tables have their tokens revoked, not orphaned. | 0008 spec says re-publish is idempotent for unchanged tables. Add explicit revoke step for deleted tables. |
| **MC-06** | Phase 4, scene 4e | Guest uploads face photo via 0002 portal → vector goes into `face_enrollments`. If guest later revokes ("Delete my face data"), the 5-min refresh cycle means up to 5 min of capture activity could still auto-tag them. | 0012 spec accepts the 5-min window. Confirm there is no path for an already-tagged photo to re-emerge after revoke. |
| **MC-07** | Phase 5, all activation scenes | The activation hook fan-out (Papic seats / Live Stream slots / Monogram flag / etc.) must be **idempotent** — Admin double-clicking "Confirm payment" must not insert 10 paparazzi seats instead of 5. | DB-level unique constraint on `(service_application_id, slot_index)`. The HTML flags this at scene 5d. |
| **MC-08** | Phase 5, scene 5e | Customer applies for Custom Monogram Pack AFTER 30 photos have already been captured and exported. Old exports were watermarked with Setnayan's mark. Does buying the pack rewrite past exports, only future, or both? | **Decision:** monogram applies forward-only. Past exports remain. Past photos can be **re-exported** with monogram if explicitly requested (re-export endpoint). Add note to 0011/0012 spec. |
| **MC-09** | Phase 5, scene 5g | Pro Camera Bridge purchase is multi-purchase. Customer buys 2. The grant binds to a `paparazzi_seat_id` OR `live_stream_camera_id`. What stops a customer from binding both grants to the same Live Stream camera and leaving zero coverage on Papic? | **Decision:** the customer chooses binding at activation, and unbinding requires explicit action. Surface a "2 of 2 bound" indicator with which seat each is on. UI prevents same-target double-bind. |
| **MC-10** | Phase 6, scene 6a | Operator's claim QR is a one-shot — once consumed, it can't be re-used. If operator loses their phone mid-event, they need a re-issue path. | **Decision (already in spec):** battery-handoff QR pattern from 0012 doubles as the lost-phone path. Couple's dashboard exposes "re-issue claim QR" for any seat. Issuance revokes the prior session token. |
| **MC-11** | Phase 7, scene 7d | Table-QR fan-out is capped at 10 total tags per photo. Family-head table seats 16. Truncation rule (alphabetize by RSVP'd name, take first 10) plus a paparazzo-facing warning. | Existing CLAUDE.md gotcha #3. Verify the warning fires at scan time, not silently. |
| **MC-12** | Phase 7, scene 7e | "Untagged-still-delivered" guarantee — but a face-match fallback at confidence 0.65–0.85 produces a *suggested* tag. If the operator dismisses the suggestion and the photo stays untagged, does it still land in couple's gallery? **Yes.** Confirm couple's gallery view doesn't filter by tag presence. | Existing CLAUDE.md gotcha #4. The HTML scene confirms gallery shows all photos regardless of tag state. |
| **MC-13** | Phase 7, scene 7f | Live Stream broadcaster opens the WebApp client. If Custom Monogram Pack was activated mid-stream, the broadcast composite needs to pick up the flag mid-event without restarting the stream. | Composite worker polls the event row every 30s and swaps the overlay asset on the next keyframe. Document this in 0011. |
| **MC-14** | Phase 8, scene 8a | 7-day review window blocks public unlock. But Papic operators see "their own contributions" view per spec (opt-in personal copy). Does that view also wait 7 days? | **Decision:** the operator's "my contributions" view is theirs immediately (it's their photographic output). Guest-facing personal galleries wait 7 days. Couple's gallery is immediate. |
| **MC-15** | Phase 8, scene 8d | Personal Reel render — guest selects 4 photos from their tagged set. One of those photos was hidden by the couple during the 7-day review. Render-time validator must reject the hidden photo. | `/reels/render` validator already checks `photo.couple_review_state != 'hidden'`. The HTML scene shows the rejection surface. |
| **MC-16** | Phase 8, scene 8f | 30-day post-download compression rule — applies on a per-file basis. If multiple guests download the same photo, which download timestamp anchors the 30-day timer? | **Decision:** **first** download anchors. Once compressed, subsequent guests still see/download the compressed version. Document in 0009 + 0012. |
| **MC-17** | Phase 8, scene 8g | AI Edited Highlight (₱5,000, 3-min) — pulls from broadcast clips + Papic photos. If the couple hid photos in review, the AI render must respect that. Same rule as MC-15 but at the AI-input layer. | The render pipeline reuses the same `couple_review_state` filter. One source of truth. |

The HTML maps every MC-NN to a red flag badge placed directly on the scene where it surfaces.

---

## 6. What the HTML actually shows

The prototype is one file: `0020_interaction_prototype.html`. It opens to **Phase 1, Scene 1a**. Top of the page has:

- **Phase tabs** (1–8) for jumping between phases
- **Scene stepper** for moving within a phase
- **Viewport toggle** (Desktop / Mobile / Both)
- **Misconnection Watch** sidebar (collapsible) listing MC-01 through MC-17 with click-jump

Each scene shows:

- **Actor frames** (browser-chrome desktop and / or iPhone-shaped mobile) for whichever actors are active in that scene
- **Inline annotations** explaining what just happened server-side
- **Data-flow arrows** between frames where the scene crosses an actor boundary
- **Red flag badges** at any junction that maps to a row in §5

The pattern follows the established 0001 canvas convention: dark `#2B2825` canvas, cream `#FAF6F0` page surfaces inside the frames, accent terracotta `#C97B4B`, Cormorant Garamond display + Manrope body + DM Mono mono.

---

## 7. How to use this for the wiring check

1. Open the HTML. Walk Phase 1 → 8 in order, end-to-end. **Don't skip scenes.**
2. Each red flag, open the sidebar note. Verify the mitigation matches what the relevant iteration's spec already says.
3. Anywhere mitigation is incomplete or absent in the spec, update the spec **before** code begins.
4. After the walk, the misconnection log in §5 should have zero open items.

The point of the prototype is to surface gaps **before** the codebase commits to a wiring choice that's expensive to undo. Treat any red flag still open as a blocker for that iteration's first PR.

---

## 8. What this prototype intentionally does NOT show

- Internal admin tooling (vendor verification queue UI, payment-confirmation UI) — those land in their own iteration when admin tooling formalizes.
- Failure modes for PayMongo / bank-transfer disputes — payment failure is a backend concern, not an interaction-wiring concern.
- Din (Phase 3 supplier app) — V2 scope per existing memory.
- Coordinator full surface — coordinator app is deferred per existing CLAUDE.md decision log (only `0019` per-thread join permission ships in V1).
- All-Guest Unlock tier, Native Pro Capture Pack, AI Top-50, Live Photo Wall, Photo Mission, cross-paparazzo dedup, BYO music — all explicitly V2 per CLAUDE.md "What's NOT in V1."

---

## 9. The wiring architecture — how to connect everything properly

The misconnection log (§5) is the defensive half of this document. This section is the prescriptive half: the architectural rules that, if followed across iterations 0000–0019, keep every feature reachable, every action traceable, and every cross-iteration handoff predictable.

### 9.1 The 10 wiring principles

**P1 — One canonical entry per actor.** Customer = `setnayan.com/dashboard/[event_id]/...`. Vendor = `setnayan.com/dashboard/vendor/...`. Operator = Papic native app. Guest = `[couple-slug].setnayan.com/me/[guest_token]`. Every feature is reachable in ≤ 3 clicks from the actor's home. Buried features are an architecture leak.

**P2 — One canonical key: `event_id`.** Every action that affects an event writes a row carrying `event_id`. This is the spine. If a record doesn't know what event it belongs to, the wiring is wrong. Cross-iteration queries are joins on event_id, never search-and-hope.

**P3 — One append-only activity log.** Table `event_activity_log(event_id, actor_id, actor_type, action_type, ref_table, ref_id, payload_json, correlation_id, created_at)`. Every meaningful action — booking, application, payment, activation, capture, tag, render, unlock — appends one row. The couple sees their timeline; admin sees the audit trail; ops can reconstruct any incident.

**P4 — One apply-then-pay rail.** Every paid SKU goes through `service_applications` → admin confirm → SKU-specific activation hook. No bespoke payment paths. Pro Bundle, Papic, Live Stream, Monogram Pack, Broadcast Style Pack, LED Background, AI Highlights — all the same pipe.

**P5 — Activation hooks live in one registry.** Table `sku_activation_registry(sku_code, handler_fn_name)`. Admin's "Confirm payment" button calls `handler_fn_name` by SKU code. New SKUs add one row + one function — no scattered if-else trees. Each hook is idempotent via DB unique constraint on `(application_id, slot_index)`.

**P6 — Event-scoped feature flags.** Flags live on the `events` row: `monogram_pack_active`, `widget_pro_bundle_active`, `broadcast_style_pack_active`, etc. Every consumer (Papic exporter, Live Stream compositor, Reels renderer, gallery chrome) re-checks the flag at asset-generation time, never caches at app start.

**P7 — One chat thread per pair, per event.** Couple ↔ vendor gets exactly one `chat_threads` row per event. All file sharing, video meetings, coordinator-joins anchor here. No DMs outside threads. Permissions resolve through `chat_thread_participants` only.

**P8 — Three canonical access tiers.** Per asset: **owner** (full), **participant** (read scoped to role), **public** (after explicit unlock event). Every gallery query, signed-URL issuance, render-request resolves through this single ladder. No fourth tier.

**P9 — Correlation IDs trace cross-iteration flows.** When customer applies for Papic 5-seat, the `service_applications` row generates a `correlation_id`. Every derived record — the 5 seats, 287 photos, 14 tags, 1 Personal Reel render — carries the same correlation_id. One query returns the full lineage. See §9.2.

**P10 — Every home surface lists every feature.** Customer's home lists every customer feature with its status (active / pending / locked / not purchased). Vendor's home lists every vendor feature. Hidden or undiscoverable features are an architecture failure. If a feature exists, the actor home knows about it — even when greyed out.

### 9.2 Correlation-ID traceability example

One query, full lineage:

```sql
SELECT *
FROM service_applications a
LEFT JOIN paparazzi_seats s USING(correlation_id)
LEFT JOIN photos          p USING(correlation_id)
LEFT JOIN photo_tags      t USING(correlation_id)
LEFT JOIN reels_jobs      r USING(correlation_id)
WHERE correlation_id = 'corr_8f3a2e91';
```

That single query returns: 1 application · 5 paparazzi seats · 287 photos · 412 tags · 1 reel render — the full lineage of one ₱2,500 Papic purchase. Operations, support, audit, refund: all answered without hunting across iterations.

The pattern naturally produces a **refund-and-revoke primitive**: refund the application → reverse-cascade through the correlation_id chain.

### 9.3 Feature accessibility matrix

The HTML (Phase 9 · Scene 9c) contains the full matrix. Summary:

- Every feature × every actor cell is explicitly **owner / read / not-available**.
- Every cell labeled "owner" or "read" carries a real URL path that must exist in code.
- CI tests that every accessible-cell path returns 200 for the right actor and 403 for the wrong one.
- If a feature is added without a row in this matrix, the iteration is incomplete.

### 9.4 What this gives you operationally

- **Discoverability** — P10 guarantees no feature is buried. Anyone landing on an actor home sees the full catalog of what's available to them.
- **Traceability** — P3 + P9 mean every action and every cascaded effect can be reconstructed from one query.
- **Auditability** — P3's append-only log is the audit trail. P8's three-tier access is the permission model. Together they answer "who saw what, when."
- **Refundability** — P4 + P5 + P9 mean every purchase is one row in `service_applications` carrying a correlation_id, and every effect of that purchase is reachable by joining on it. Refunds are surgical, not detective work.
- **Iteration cleanliness** — P2 + P4 + P5 + P6 push new features into the same shapes. Adding a future Wedding Challenges iteration, a Coordinator full app, or a Live Photo Wall reuses the rails — no new payment plumbing, no new permission model, no new activity-log scheme.

### 9.5 How to use this when starting a new iteration

Every new iteration spec opens with a one-pager confirming which of these 10 principles it inherits and which (if any) it extends. If a new iteration needs to break one, the breakage must surface here AND in CLAUDE.md's decision log before code begins.

The 10 principles are the **architectural contract** between iterations. The misconnection log (§5) is what the contract protects against.

---

## 10. Companions and next steps

- **`0020_interaction_prototype.html`** — open in any browser. The wiring walk lives here.
- **`0020_interaction_prototype.docx`** — stakeholder mirror of this file.
- **Next iteration:** Sprint 0 (iteration 0013) builds the platform stack. The HTML is the contract this prototype is checking against — any structural change in 0013 that contradicts a scene here must update both the iteration spec AND this document in the same PR.
