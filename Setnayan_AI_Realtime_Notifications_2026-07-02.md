# Setnayan AI — Real-Time Notification Layer

**Date:** 2026-07-02 · **Status:** PROPOSED spec (owner asked "daily or real-time?" → build real-time). Grounded in a 4-reader recon of `origin/main` — this builds on SHIPPED infrastructure, not new pipes.
**Related:** `Setnayan_AI_Market_Intelligence_2026-07-02.md` (the Wave-1 guard this delivers) · `Setnayan_AI_GTM_Content_2026-07-02.md` (guardrail 7 — what "real-time" may claim) · [[project_setnayan_cron_free]] · [[project_setnayan_ai_subscription_redesign]]

---

## 1. What this is

Today Setnayan AI's data is live and its analysis is computed fresh at read time, but its *outreach* is a weekly digest + interrupts seen on next open. This layer makes the tap-on-the-shoulder **real-time**: the moment a watched vendor's availability or price moves — or a payment window opens — the affected, entitled couples get notified within seconds/minutes, not at Sunday's digest.

**Strategic payoff:** it makes the GTM positioning literally true ("it taps you the moment something moves") and lifts guardrail 7's constraint; it's also the single strongest justifier of the ₱799 step-up.

## 2. Key recon finding — the pipes already exist

| Piece | State |
|---|---|
| `public.notifications` table + RLS + bell w/ live Realtime unread counts (couple/vendor/admin share one component) | ✅ shipped |
| **`emitNotification()`** (`lib/notification-emit.ts`) — ONE dispatcher for in-app + email + web push, with per-type allowlists (27 email / 4 push types), fire-and-forget | ✅ shipped |
| **Web push fully wired** — `sw.js` v4 push handlers · VAPID · `push_subscriptions` (couple) + `vendor_push_tokens` · `PushToggle` opt-in in profile settings · stale-endpoint pruning | ✅ shipped |
| **The exact real-time pattern** — DB trigger on `chat_messages` → webhook `/api/notify` → Next `after()` processing → push, with a 10-min dedup guard (`last_push_notified_at`) | ✅ shipped (chat) |
| ~~The 42-type notification enum already includes the Setnayan AI template types~~ | 🔴 **FALSE (code-verified 2026-07-08)** — the `NotificationType` union (`lib/notifications.ts`) has **no** AI/guard/watch/price-change/payment-due member; the GRD-01/GRD-03 ids are *template* ids, never notification types. AI notifications are excluded structurally, not just off the allowlist. Adding the types is part of the build, not a given. |
| The 33-template deterministic library + trigger engine + restraint + weekly digest | ✅ shipped **but DORMANT (verified 2026-07-08)** — `setnayan-ai-triggers.ts` → `runTriggers` has exactly ONE consumer, `computeUserAiDigest` (`setnayan-ai-snapshot.ts:166`), which renders on the account page only, behind an OFF flag + active sub. The snapshot adapter does **not** import `emitNotification`; no cron/webhook/DB-trigger invokes it. It cannot fire a proactive notification today. |
| ~~Booking → auto-block DB trigger on `event_vendors` calls an AI trigger~~ | 🔴 **GAP (verified 2026-07-08)** — the auto-block may exist, but **no** booking-confirm / `event_vendors` / DB-trigger / webhook path calls any AI trigger or the snapshot builder. The snapshot is **budget-only** (`snapshot.ts:114`); `priceChanges`/`contracts`/`dateClusters` are not populated, so most triggers are unreachable with real data even when the digest renders. The event-driven watch path does not exist. |

**Gaps (the actual build):** AI triggers aren't wired to `emitNotification()`; the AI types aren't on the email/push allowlists; no per-type notification-preferences UI; no vendor **price-change log** (net-new, from the MI spec); native FCM/APNs push stubbed (web push only); no quiet-hours/caps machinery for real-time.

## 3. Architecture (cron-free, ~₱0/couple)

```
watched table changes                    (booking trigger ✅ · availability edit · price-change log*)
  └─ AFTER INSERT/UPDATE trigger → webhook /api/notify-ai        (mirrors shipped /api/notify)
       └─ returns 200 · processing in after():
            1. resolve AFFECTED couples  (shortlisted/locked this vendor + date overlap)
            2. entitlement gate          (Setnayan AI active for the event — paid feature)
            3. RESTRAINT (real-time)     (dedup key · per-couple cap · quiet hours)
            4. renderTemplate()          (stored variants — GRD-09/GRD-10/GRD-03 already written)
            5. emitNotification()        (in-app always · email/push per allowlist + opt-in)
```
*price-change log = the MI spec's net-new table; availability + booking sources exist today.

- **No polling, no cron** — pure trigger → webhook → `after()`, the shipped chat pattern (honors the cron-free lock).
- **Time-based events** (payment due, statutory windows) don't fit triggers. Recommendation: **Resend scheduled sends** (`scheduledAt`) stamped when the due-dated line item is written, re-scheduled on edit — cron-free, real, email-first. In-app/push versions stay lazy-at-read + digest until V1.1 of this layer.
- **Cost:** DB trigger + one webhook + web push ≈ ₱0; an email ≈ ₱0.15. Messages stay stored deterministic templates — no LLM, margins intact.

## 4. Restraint, made real-time-safe (the premium feel)

1. **Push-worthy = guard-critical only:** booked-out on your date (GRD-09/GRD-10) · price change on a shortlisted/locked vendor (GRD-03) · payment due soon (GRD-01, email). Everything else stays in the weekly digest.
2. **Persistent dedup** — generalize chat's `last_push_notified_at` guard: one notification per (couple, vendor, event-type) per cooldown window; never the same alert twice.
3. **Per-couple interrupt cap** (propose ≤3 pushes/week) — overflow folds into the digest.
4. **PH quiet hours** (propose 21:00–08:00 Asia/Manila): detected at 2am → *delivered* at 8am (scheduled send / deferred processing). The 2am catch is real; the 2am buzz is not.
5. **Entitled couples only** — proactive = paid (the locked boundary). Free couples see nothing new.

## 5. Build slices (flag-gated + inert, house pattern)

1. **PR-1 · Wire the booked-out path (highest value, all pieces exist):** add the AI types to the email/push allowlists · new `/api/notify-ai` webhook + trigger on the booking/auto-block path · affected-couple resolution + entitlement + dedup · emit GRD-09/GRD-10 via `emitNotification()`. Default-OFF flag.
2. **PR-2 · Price-change log + trigger** (the MI spec's net-new table) → GRD-03 real-time.
3. **PR-3 · Payment-due scheduled emails** (Resend `scheduledAt`, stamped at line-item write, re-stamped on edit) → GRD-01.
4. **PR-4 · Restraint polish + prefs:** per-type notification toggles UI (recon gap), quiet-hours delivery, the weekly cap.
5. *(later)* Native FCM/APNs via the Capacitor shell — web push covers PWA installs today.

## 6. Honesty + compliance rails

- **Copy may claim real-time only for what PR-1..3 actually deliver** — update GTM guardrail 7 as each slice ships, not before.
- These are **transactional service notifications** for a paid feature (not marketing) — but per-type opt-outs (PR-4) + the existing push opt-in keep it RA 10173-clean. No Inference/Trend content in any notification until DPO sign-off.
- Never notify on data the couple can't act on — every push carries its action (the GRD templates already do).

## 7. Open owner calls

1. Cap + quiet-hours values (proposed: ≤3 pushes/wk · 21:00–08:00).
2. Payment-due email timing (proposed: 7 days + 1 day before).
3. Whether PR-1 waits for the Wave-1 guard bundle or ships first (they overlap — PR-1 *is* MI-2's push upgrade, "V1.1 (push)" in the MI spec, arriving early because the recon showed the pipes exist).

---

## 8. BUILD NOTE 2026-07-09 — guards notify SHIPPED (the sweep-sourced floor)

Owner-greenlit "make guards notify" (the held PR-5) landed in `apps/web` (branch `feat/guards-notify`). What shipped vs this spec:

- **§ 2 gap rows CLOSED for the sweep path:** `NotificationType` now has `ai_payment_due` (GRD-01, email-allowlisted per § 4.1) + `ai_guard_alert` (GRD-02/GRD-05, in-app only); the trigger engine is wired to `emitNotification()` via `lib/setnayan-ai-guard-plan.ts` (pure planner) + `lib/setnayan-ai-notify.ts` (sweep); the snapshot is no longer budget-only (per-line payment settlement · Overview committed-formula budget · paperwork-pipeline statutory · name-masked vendor-quiet). ⚠ **CORRECTED 2026-09-03 (BA8): "Overview committed-formula budget" is no longer true and must not be rebuilt.** GRD-05's money now comes from `resolveEventMoney` (`apps/web/lib/budget-truth.ts`) via `budgetFromEventMoney`, the same calculator `/budget` renders — on BOTH surfaces that run the trigger (the sweep here, and the Overview's "Sai on watch" rail, which had a third assembly of its own). The Overview formula was the NARROWER of two books: blind to locked-package totals, catalogue line items, manual lines on off-platform suppliers, credits, transport, crew meals and `event_costs`. The `pending`/`submitted` half is deleted rather than moved — see the BA8 note in `Setnayan_AI_Template_Library.md`. Delivery is unchanged: `ai_guard_alert`, in-app only.
- **Restraint § 4, made persistent:** new table `setnayan_ai_guard_log` (migration `20270527224949`) — 7-day per-key cooldown, ≤3 emissions per sweep, guard-category-only (secretary stays in the digest). Entitlement gate = `isSetnayanAiActiveForUser` incl. the per-event window fix (a lapsed ₱799 window now locks — the `eventOwnsSetnayanAi` early-return bug is fixed, window is authoritative).
- **Invocation deviates from § 3's DB-trigger→webhook picture (deliberately):** the shipped sources are all *time-based/ledger-state* (payment due · statutory · over-budget), for which § 3 itself prescribes non-trigger delivery. Implementation = the house **lazy sweep** (`after()` in the event dashboard layout, throttled 6h/event via the `__sweep__` ledger row) + the spec's **Resend `scheduledAt`** day-before GRD-01 email (09:00 Asia/Manila, stamped once per due date) for coverage between visits. The § 3 real-time trigger→`/api/notify-ai` path remains UNBUILT because its sources (price-change log, availability log) don't exist — GRD-03/09/10 still can't fire (§ 5 PR-1/PR-2 remain open; this build ≈ PR-3 + the restraint core).
- **Deviation from § 3's stamp-at-write:** the `scheduledAt` reminder is stamped at first sweep detection, not at line-item write (the ledger write sites were owned by another workstream this round); a payment logged after scheduling doesn't cancel the send — the email copy carries an "already settled? ignore" line. Re-stamp/cancel-on-edit = follow-up.
- **Security fix alongside:** `/api/notify` now fails CLOSED when `NOTIFY_WEBHOOK_SECRET` is unset (was fail-open).
