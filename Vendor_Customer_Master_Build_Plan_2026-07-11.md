# Vendor ↔ Customer — Master Build Plan (inquiry → payments complete)

> Dated 2026-07-11. The definitive, ordered build sequence for the whole vendor↔couple lifecycle. Consolidates the three detailed specs: [Proposal Maker](Vendor_Proposal_Maker_2026-07-10.md) · [Relationship Workspace + Appointments](Relationship_Workspace_and_Appointments_2026-07-11.md) · [Connection Build Plan](Vendor_Customer_Connection_Build_Plan_2026-07-10.md). Code repo: `~/apps` (PR workflow, auto-merge). Corpus = specs only.
>
> Legend: ✅ shipped · 🟩 built (needs wiring into new UI) · 🟦 new build.

## The lifecycle

`Inquiry (masked) → Accept for X tokens → Quote (proposal maker) → Workspace activates → Accept quote → Lock (downpayment) → Appointments → Payments round-trip → Service complete → Confirm → Review/galleries.`

---

## Phase 0 — Already in place (no build)

| Piece | State | Notes |
|---|---|---|
| Chat (thread) | 🟩 built | realtime, two-sided (`chat_messages` + Supabase Realtime) |
| Token unlock | 🟩 built · ⚠ reprice pending | `unlock_vendor_event` — **flat 1 token, all regions (owner-locked 2026-07-11)**; code still region-bands 1–3 via `token_burn_bands` → flatten pending |
| Proposals / quotes | 🟩 built | `vendor_proposals` + `respond_vendor_proposal`; in-chat card |
| Change orders | 🟩 built | `vendor_change_orders` propose→accept, settles into ledger |
| Deposit reservation / lock | 🟩 built | record deposit → `acknowledge_vendor_deposit` → date held |
| Payment plan + confirm | 🟩 built | `event_vendor_payment_plan` both sides · `logPayment`+receipt → `confirm_vendor_payment` → pending→paid · `computeStepper` |
| Payment-plan default-seed at lock | ✅ shipped | repo [PR #3023](https://github.com/iscasasola/setnayan-platform/pull/3023) — 50/50 estimate when vendor set no schedule |
| Completion handshake | 🟩 built | vendor marks complete → couple confirms (7-day auto) → unlocks review/galleries |
| Free P2P call transport (prototype) | ✅ shipped | repo [PR #3024](https://github.com/iscasasola/setnayan-platform/pull/3024) — `lib/call-webrtc.ts` + `/prototype/call` |

---

## Phase 1 — The gated inquiry 🟦 ✅ SHIPPED (#3071)

> ✅ **OWNER-APPROVED + BUILT 2026-07-11 (#3071).** Owner: "we have that gate — provide inquiry info first; once they pay tokens all info unlocks." Built `get_pending_inquiry_basics` (SECURITY DEFINER, pending-thread + own-vendor gated, returns ONLY date/region/event_type/AI-status — never name/contact/venue) + the masked-lead chips. Fail-soft. Supersedes only the pre-accept-blank aspect of the 2026-07-03 ladder.

> ⛔ **BLOCKED 2026-07-11 — owner decision needed.** Vendors are NOT `event_members` at inquiry time, so RLS blocks reading the `events` row while `pending`; and `get_vendor_event_brief` deliberately raises `not_booked` until accept — an **owner-locked disclosure ladder** (approved 2026-07-03). Showing event_type/region/`setnayan_ai_active` on the masked (pre-accept) lead would **reverse that lock**. **Decision:** move `event_type` + `region` (city-grain) + `event_date` + `setnayan_ai_active` earlier on the ladder? If YES → build a `SECURITY DEFINER` RPC `get_pending_inquiry_basics(thread_id)` gated to the pending-thread's vendor, returning only those 4 non-identifying fields (name/email/phone stay hidden). If NO → masked lead stays minimal; basics + AI badge appear only post-accept (Details tab, already permitted). The load-bearing change is "region before accept."

**PR 1 · Masked-lead enhancement (deferred).** Today the masked lead is nearly blank ("New inquiry"). Surface decision-useful basics so the token spend is informed.
- Show: date · pax · location · event type · services-asked + **Setnayan AI status** (`events.setnayan_ai_active`) + a blurred "unlocks on accept" preview (name/contact/mood board/locked vendors).
- Cost on the button: **"Accept for 1 token"** (flat, all locations — owner-locked 2026-07-11; supersedes the region band).
- Reuse: `unlock_vendor_event`, `thread.pax_at_inquiry`. New: the masked-view UI + AI-status/basics surfacing.
- Files: `app/vendor-dashboard/messages/[threadId]/page.tsx` (pending branch).

---

## Phase 2 — The proposal maker (quote-first) 🟦

**PR 2 · Schema + resolver.** Bring per-line pricing into bundles.
- Add to `vendor_package_items`: `pricing_basis (fixed|per_pax|per_hour)` + per-pax (`per_pax_price`, `min_pax`) + per-hour (`hour_base`, `min_hours`, `extra_hour`) + crew/transport fields. (Mirrors columns already on `vendor_services`.)
- Resolver computes each line vs the event's **pax + coverage hours**; **crew-meal offset → credit applied to the final `seq`**; self-balanced schedule persisted (auto Final balance = last `seq`).
- `event_appointments`/methods tables already exist; `vendor_service_payment_schedules` + `vendor_payment_methods` reused.

**PR 3 · Proposal maker UI** (prototype saved: `prototypes/vendor_proposal_maker_2026-07-10.html`).
- The editor in the thread: line items (flat / per-pax / per-hour) · freebies (₱0) · bundles · **6-dot drag-reorder** · crew meal (included / charge / **offset-credit-to-final-payment**) · transportation (included / flat / by-distance) · discount · **self-balancing payment schedule** (auto Final balance, pays to ₱0, downpayment protected) · payment methods.
- **Seeded from the couple's requested pax** (`thread.pax_at_inquiry`); AI-drafted opening quote; "reset to request" when the vendor changes the count.
- Send → `vendor_proposals` row (`line_items` jsonb) + `chat_messages.proposal_id` card. Re-quote supported.

---

## Phase 3 — The relationship workspace 🟦

**PR 4 · Consolidation shell.** One two-sided page per relationship.
- Merge the thread into the card as the default **Chat** tab; add the tab bar **Chat · Quote · Payments · Files · Call · Details** on both sides.
- Landing = pinned **context header** (each side's own next action) + live chat.
- Routing: couple home = Vendor Workspace (`/dashboard/…/vendors/[id]/workspace`), vendor home = Customer Card (`/vendor-dashboard/clients/[eventId]`); the old `/messages/[threadId]` becomes the Chat tab.
- SSR shell + context header + first chat batch; **lazy per-tab**; one realtime channel.

**PR 5 · Details tab.** The this-event profile hub.
- **Quick-action bar**: Chat · Files · Call · Video · **Quote** (mulberry). Payments stays a tab.
- This-event only: request · services · locked vendors · mood board · downpayment-to-lock (from `event_vendors` + event).
- **"Worked together N×" returning-client marker** + **Past-events links** (each to its own card).
- **Private notes** (`vendor_client_notes`, vendor-org-only).

**PR 6 · Responsive + performance.** Desktop 3-pane (inbox · chat · context rail); mobile chat-first + tools-as-full-screen-sheets; **density switch** (compact desktop / comfortable mobile); code-split tabs; **call dynamically imported on tap**; virtualize long lists; prefetch-on-intent.

---

## Phase 4 — Accept → Lock → Payments (mostly wiring) 🟩

**PR 7 · Accept + guest-side Lock in the new UI.**
- Couple accepts the quote (`respond_vendor_proposal` — built) → prices `event_vendors`.
- **Guest-side Lock screen** — "₱X downpayment to lock" (seq-0), the deposit-reservation flow (built) → vendor `acknowledge_vendor_deposit` → date held. Surface it in the context strip + Payments tab.

**PR 8 · Payments tab UI.** The stepper over the existing two-sided plan.
- Progress summary (paid / pending / due) · installment stepper (due→pending→paid from `computeStepper`) · **how-to-pay** (`vendor_payment_methods`) · **receipt upload** (`event_vendor_payments.proof_r2_key`) · **crew-meal credit on the final installment** · vendor **Confirm received** (`confirm_vendor_payment`). Round-trip already built — this is the tab presentation + credit display.

---

## Phase 5 — Files + Calls 🟦

**PR 9 · Files tab.** Attach any file (photo/PDF/doc) in the thread → R2 (`uploadPublicAsset`, handover precedent). New attachment columns on `chat_messages`; composer paperclip; attachment render; realtime carries it.

**PR 10 · Call (ad-hoc).** Wire the saved `lib/call-webrtc.ts` prototype into the Call tab: free P2P **voice/video** (camera toggle), gated to accepted threads, rung via `emitNotification`. STUN-only (₱0, like the demo); TURN optional later.

---

## Phase 6 — Appointments 🟦

**PR 11 · Appointments schema + catalog.**
- `event_appointments` — `kind (in_person|video|voice) · type · location · scheduled_at · duration · status (proposed|confirmed|done) · initiated_by`.
- `appointment_type_catalog` — `category · type · default_mode · default_duration`, seeded from the **category→meeting map** (caterer=Food tasting, venue=Site visit, couturier=fittings, HMU=trial, cake=tasting, coordinator=kickoff/walkthrough/rehearsal, officiant=counseling/rehearsal, …).

**PR 12 · Appointments scheduler + cards.**
- Modes **In-person / Video / Voice**; **category-aware type presets** + a **Custom option always available to both sides** (free-text name).
- **Propose→confirm either direction** (vendor from own free slots / couple from vendor's `vendor_calendar_blocks`) — reuses the `event_schedule_suggestions`/change-order pattern.
- In-person → **location + Directions**; video/voice → **Join** (reuses PR 10's call), gated to `scheduled_at`.
- On confirm: `.ics` + new **`appointment_reminder`** email (0028).
- Un-retires the 2026-05-16 video-meeting retirement, scoped to free P2P + scheduled.

---

## Phase 7 — Completion 🟩

**PR 13 · Completion in the workspace.** Surface the built handshake in the tabs: vendor **Mark complete** → couple **Confirm received** (7-day auto-confirm) → unlocks the **review** + galleries. Reuses `vendorMarkServiceComplete` + the review-request emit; this is the tab wiring + the review prompt.

---

## Dependency order (build in this sequence)

1. **PR 1** masked lead (independent).
2. **PR 2 → PR 3** proposal maker (schema before UI).
3. **PR 4 → PR 5 → PR 6** workspace shell → Details → responsive/perf.
4. **PR 7 → PR 8** accept/lock + Payments tab (need the shell).
5. **PR 9** Files, **PR 10** Call (need the shell; Call before Appointments' Join).
6. **PR 11 → PR 12** Appointments (need Call for Join).
7. **PR 13** completion (last; needs the workspace).

Each PR: changelog.d fragment + `SPEC IMPACT` line, auto-merge on, tsc + lint green. PR #3023 (default-seed) already shipped; PR #3024 (call prototype) is the seed for PR 10.

---

## Build progress (autonomous wave · 2026-07-11)

Shipped this session (all additive, CI-green, auto-merged; all graceful-degrade pre-migration):

| PR | # | State | Notes |
|---|---|---|---|
| PR 2 · package pricing schema + resolver | #3034 | ✅ merged | additive cols on `vendor_package_items` + pure `lib/package-line-pricing.ts` (+14 tests) |
| PR 11 · appointments schema + catalog | #3033 | ✅ merged | `event_appointments` + `appointment_type_catalog` (28 seeded types) |
| PR 9 · chat file sharing | #3038 | ✅ merged | attach → R2 in the thread composer; text path unchanged |
| PR 10 · voice/video call | #3046 | ✅ merged | free P2P in accepted threads (`thread_calls` + reuses `lib/call-webrtc.ts`) |
| PR 12 · appointments UI | #3048 | ✅ merged/merging | category-aware scheduler + propose/confirm, on customer-card + workspace |

**PR 1 · masked-lead — ⛔ OWNER-GATED** (disclosure-ladder decision above).

### 🔧 OWNER ACTION REQUIRED — apply migrations
The feature CODE is live, but the tables live only in migration files (not auto-applied). Run `supabase db push --db-url "$SUPABASE_DB_URL"` to light up: `vendor_package_items` pricing cols · `event_appointments` + `appointment_type_catalog` · `thread_calls` · `chat_messages` attachment cols. Until then every feature graceful-degrades to empty/no-op (verified — no page breaks).

### Remaining (large, not yet built)
- **PR 3 · Proposal maker UI** — the rich in-thread quote editor (pricing bases · freebies · crew/transport · self-balancing schedule · methods) persisting `vendor_proposals`. Schema ready (#3034). Large build.
- **PR 4–8 · Workspace shell + Details/Payments tabs + accept-lock** — unify the thread + customer-card/workspace into one chat-first tabbed page. Recommend **flag-gated** (new experience off in prod). Design-sensitive; large.
- **PR 13 · Completion surfacing** — the built mark-complete→confirm→review handshake, surfaced in the workspace. Small.

### Update — PR 3 shipped
- **PR 3 · Proposal-maker editor UI** — [#3061](https://github.com/iscasasola/setnayan-platform/pull/3061) (auto-merge, CI). The in-thread rich quote editor (pricing bases · freebies · bundle seed · 6-dot reorder · crew/transport · discount · seeded from requested pax), persisting via a new `sendCustomProposalCore` that shares the existing gate. Deferred: the self-balancing schedule + methods editor (proposal-level persistence; the lock flow already reads `vendor_service_payment_schedules`).

### Update — SECOND autonomous wave (2026-07-11 · owner "yes/yes/yes" + "full redesign now")

| Item | # | State | Notes |
|---|---|---|---|
| Search facets + service-date availability | [#3089](https://github.com/iscasasola/setnayan-platform/pull/3089) | ✅ merged | facet chips (seeded from saved prefs) + "booked your date" down-rank; additive, graceful-degrade. Availability half **dormant** until a couple-readable `vendor_calendar_blocks` RLS policy (privacy decision — chip filed) |
| PR 7/8 · **Payment-gated lock** | [#3090](https://github.com/iscasasola/setnayan-platform/pull/3090) | ✅ merged | reverses Lock-Free: Lock → mandatory downpayment modal via vendor's **published** method + **required** screenshot → vendor confirms. `finalizeVendor` untouched (modal post-lock). Flag `NEXT_PUBLIC_PAYMENT_GATED_LOCK_ENABLED` (OFF) |
| **Lock exclusivity** | [#3091](https://github.com/iscasasola/setnayan-platform/pull/3091) | ✅ merged | hard-single lock → losing vendors' inquiries `displaced` + notified; hidden both inbox sides. Same flag |
| PR 4 · **Couple-side shell** | [#3093](https://github.com/iscasasola/setnayan-platform/pull/3093) | ✅ merged | `RelationshipTabShell` primitive + couple workspace → tabs Chat/Quote/Payments/Files/Schedule/Call/Details, chat embedded. Flag `NEXT_PUBLIC_RELATIONSHIP_WORKSPACE_ENABLED` (OFF) |
| PR 4 · **Vendor-side shell (mirror)** | [#3096](https://github.com/iscasasola/setnayan-platform/pull/3096) | ✅ merged/merging | Customer Card through the same shell; reuses existing tab bodies; embeds vendor thread preserving the accept-gate. Same flag |

Both shells **adversarially verified** via 5-dimension verification workflows (byte-identity · RSC boundary · chat auth/RLS + accept-gate · content coverage · build hygiene); findings fixed pre-merge.

**Feature substance = COMPLETE, incl. the two-sided tabbed SHELL (both sides, flag-gated).** 🔧 OWNER to activate: set `NEXT_PUBLIC_PAYMENT_GATED_LOCK_ENABLED=true` (lock+exclusivity) and `NEXT_PUBLIC_RELATIONSHIP_WORKSPACE_ENABLED=true` (shell) + `supabase db push`. **Remaining = polish only:** PR 5/6 desktop 3-pane context rail (primitive supports `contextRail`) · realtime tab badges · lazy-per-tab (couple renders all tabs server-side vs vendor's old lazy `?tab=` — reconcile) · couple-side mark-read parity (LOW) · PR 13 completion surfacing (small) · PR 1 masked-lead ⛔ owner-gated · proposal-maker self-balancing-schedule+methods editor.
