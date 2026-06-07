# AS-BUILT GROUND TRUTH — 2026-06-07

> **THIS IS THE CANONICAL REFERENCE.** Source of truth = the **live site (https://www.setnayan.com)** + the **shipped code** (`Setnayan-App` / `apps/web` on `origin/main`). The iteration spec folders (`0000_*`…`0052_*`) and the dated handoffs are **reconciled TO this document**, not the other way around. When an old spec disagrees with this file, this file (and the live site / code) wins. Built during the 2026-06-07 full-resync directive.

---

## 0. Source-of-truth order (read this first)

1. **Live site** `www.setnayan.com` — authoritative for SKUs, prices, public copy, vendor offering.
2. **Shipped code** `apps/web` @ `origin/main` — authoritative for surfaces, flows, schema, behavior.
3. **Live prod DB** (Supabase Singapore) — authoritative for data shape + what's actually deployed.
4. This ground-truth doc — the reconciliation of the above.
5. Iteration specs / handoffs — **reference + history only; may be stale.**

---

## 1. Customer / couple SKU catalog (live site · 2026-06-07)

**Live (5):**
| SKU | Price | Note |
|---|---|---|
| Animated Monogram | ₱2,499 | Bespoke monogram WITH animation |
| Custom QR per Guest | ₱1,499 | 1 QR/guest, up to 250 pax |
| Indoor Blueprint | ₱1,499 | Guided entrance→table |
| Papic (5 Seats) | ₱2,999 | Unlimited photos + video, 5 hrs |
| Papic Guest (Disposable Camera) | from ₱2,999 | 24 photos + 10×5s clips |

**In build (5):** High Res Archive ₱2,999/yr · Live Background ₱2,499 · Panood (Website Add-on) ₱3,499/day · Patiktok ₱2,499 (up to 250 recordings) · Pro Website ₱5,499.

**Coming soon (9):** Call-Time Escalator ₱1,999 · Camera Bridge ₱1,999 · Guest Stories ₱1,999 · Live Venue Photo Wall ₱2,499 · Pabati ₱999 · **Pakanta ₱2,499 (SINGLE SKU)** · Pakulay ₱0 · SDE ₱3,499 · Thank You Video ₱5,499.

**Bundles:** Setnayan Guided Planner Suite ₱11,999/event · Setnayan Comprehensive Media Pack ₱16,999/event.

**Today's Focus** (AI-assisted planner) ₱1,499 — the planner SKU. (Supersedes the old "Setnayan Concierge ₱4,999".) Note: the couple-app Today's Focus *wizard* is retired in code; the SKU/branding persists on the site.

**18 free planning tools** for couples (guest list, RSVP, seating, mood board, budget, QR invites, microsite, etc.).

---

## 2. Vendor offering + economy (live site · 2026-06-07)

**Tiers (28-day prepaid):**
- **Free** ₱0 — verified profile, in-app chat, pipeline, service packages, ≤15 photos, calendar+.ics, ≤10 bids/wk, 10km radius.
- **Pro** ₱2,499/28d (or ₱24,999/yr, save 23%) — 1 category, 5 accounts, unlimited photos + bids, 20km radius, video calls, star ratings, hybrid scheduling, AI proposal builder, demand pulse, benchmarks.
- **Enterprise** ₱5,499/28d (or ₱54,999/yr) — multi-category, unlimited accounts, 50km radius.
- **Additional Branch** ₱999/28d.
- **Verification badge** ₱1,499 (standalone).

**Commission: 0% — "0% commission, ever."** Vendor keeps 100%; Setnayan never sits between vendor and couple at checkout. **(Supersedes any "Setnayan Pay 3%/5% commission" language in old specs — that is RETIRED.)**

**Tokens (bidding economy, persists — distinct from the retired customer wallet 0003):** spend tokens to accept couple inquiries; earn by recommending Productions services that get used. Founder bonus **100 free tokens on verification** (valid until 31 Jan 2027). Packs: 4/₱1,000 · 10/₱2,400 · 25/₱5,500 · 50/₱10,000 · 100/₱18,000. Burn is one idempotent unlock per (vendor, event). **Burn-on-answer is now WIRED (PR #1057):** accepting an inquiry burns **1–3 tokens (₱100/200/300) banded by the wedding's region** via the admin-editable `token_burn_bands` table (`/admin/token-bands`; the band→region map is seeded but **pending owner ratification**). Insufficient balance blocks the accept (pay-to-answer; the 100 founder tokens cushion new vendors). Login-driven ghosting nudges (PR #1059) replace the never-built 48h cron. The public site leads with "0% commission" + token packs.

**Vendor onboarding:** register in ~3 min (profile/photos/services/calendar) → verification in 24h → first proposal next week. Path `/signup?as=vendor`.

---

## 3. Shipped surfaces (from the 2026-06-07 dashboard audit)

**Couple dashboard** — event-scoped `/dashboard/[eventId]/...`: Overview/Guests/Vendors/Schedule/Services/Seat-plan/Landing/QR/Gallery + add-ons. Vendor search is in-dashboard (`/vendors` tab).

**Vendor dashboard** (`/vendor-dashboard`) — **24 routes**, desktop **4-group sidebar** (Home / Work / Grow / Business) + mobile **5-tab bottom-nav** (Home·Bookings·Messages·Earnings·More) + `/more` overflow. Surfaces: overview, profile, bookings, messages, services, contracts, repertoire, attributes, marketing, verify, reviews, moodboard-library, earnings, payment-options, tokens, redeem-code, team, branches, manpower, notifications, tax-documents, more. **Known gaps:** Tokens "Buy" CTA non-functional (no `/tokens/buy`); no calendar/availability block-entry UI; moodboard-library 404s for dual-role users (audit-flagged, fix batch pending).

**Admin console** (`/admin`) — **51 routes at the `04931de5` audit baseline; +`/admin/notifications` + `/admin/token-bands` since (PRs #1054/#1057) → ~53**, desktop **6-group sidebar** (Home / Queues / Directory / Money / Insights / Manage) + mobile **5-tab bottom-nav** (Home·Queues·Directory·Money·More) + 4 overflow landings. **Known gaps:** `/admin/payment-options` + `/admin/connection-logs` desktop-only (no mobile path — fix batch pending); telemetry/offline are pilot stubs. **Disputes are now resolvable inline** (PR #1054 added `resolveDispute` + the admin notifications bell/reader). **BIR is retired** (`bir/2307` tombstone + stale nav refs removed per 2026-06-07 owner authorization).

---

## 4. Payment model (no automated charge anywhere in V1)

- **In-app SKUs (iteration 0034):** apply-then-pay. Customer → InlineCheckoutDrawer → `submitOrderAction` writes `orders(status='submitted')` + `payments(status='pending')`; BDO/GCash details are **instructional only** (admin-uploaded name/number/QR from `platform_settings`); customer uploads a screenshot. **Admin approves** at `/admin/payments` (`approvePayment`, `promote_order` ON) → `payments='matched'` + `orders='paid'`. That admin click is the only "paid" lever — **zero real money moves**. On paid: notifications (`payment_matched`/`order_paid`), `receipts` row, PostHog `order_paid`, payout dispatch only if `orders.vendor_profile_id` set.
- **Vendor↔customer money is OFF-PLATFORM** (RA 11967) — Setnayan shows the vendor's link/QR/bank at settlement but never holds or charges it. Every vendor-payment surface must disclose "Setnayan does not hold the money" + a vigilance caution.
- Comp grants + internal/team flags exist but do **not** auto-pay an add-on order (the inline drawer ignores them); only `createSelfCompOrder` (vendor team owners) mints a comp'd paid order.

---

## 5. The 4 actors + dev sandbox (prod test accounts)

`SetnayanTest!2026` for all. Seeded/reset by `apps/web/scripts/seed-test-accounts.sql` (+ `seed-inquiry.sql`, `reset-test-accounts.sql`) over `$SUPABASE_DB_URL`.
- **Customer** `couple.test@setnayan.com` — gets event `test-maria-and-jose` (wedding 2026-12-12, catholic/garden) via the seed.
- **Vendor** `vendor.test@setnayan.com` — `[TEST] Liwanag Photography`, NCR photographer, `is_demo=true`, `public_visibility='coming_soon'`. Already matches the couple's in-dashboard photographer search (demo not filtered there); hidden from the public `/vendors` browse (demo excluded for non-admins).
- **Admin** `admin.test@setnayan.com` — `account_type=customer` + `is_team_member=true` → passes the `/admin` gate ("Team Pool").
- **Guest** — NOT an account: a `public.guests` row on the couple's event; "logs in" via magic invite URL `/{slug}?invite={qr_token}` → 60-day guest-session cookie, hard-scoped to that event. Guest→couple (RSVP) fires `rsvp_received`; guest→vendor has no path today (guest reviews unbuilt); guest gallery/reel surfaces not wired in this checkout.

Interaction loop (RLS-isolated): couple follows → `chat_threads` upsert (UNIQUE per event,vendor) → first couple message fires `vendor_inquiry_received` → vendor accept/decline (notifies couple). `vendor.test` (real `user_id`) is the only live 2-way thread; demo vendors can only "respond" via the admin demo-responder.

---

## 6. Connection-audit fixes shipped (PR #1049, 2026-06-07)

`event_software_activations` → `_v2` (3 manpower routes + `verify_and_activate_manual_payment` DB fn, applied to prod) · onboarding BYO "Add your own vendor" now persists to `event_vendors` (truthful copy) · supplies-cart + site-editor `/orders/new` dead-ends neutralized. Full map in repo `apps/web/CONNECTION_MATRIX.md`.

---

## 7. Retired / deferred (don't build, don't follow old specs that say otherwise)

- **RETIRED:** customer token wallet (0003) · Setnayan Pay commission (now 0%) · BIR tax surface (0026 — retiring 2026-06-07) · Today's Focus wizard (couple-app; SKU persists) · the old charm-ladder SKU set.
- **DEFERRED (V1.x):** Supplies marketplace (0018, mock) · vendor in-app tier-upgrade + buy-token checkout + calendar block-entry UI · Pro-tier widget purchase (`monogram_hero_upgrade`/`pro_widget_schedule`) · native apps (0052, Capacitor remote-URL shell; Android built). *(NO LONGER deferred — shipped since the audit baseline: admin disputes inline-resolve + admin notifications [PR #1054]; vendor token burn-on-answer + ghosting [PR #1057/#1059].)*

> **⚠ Moving-target note:** this snapshot was taken at code baseline `04931de5`. `origin/main` advances several times/day via parallel sessions — PRs #1054 / #1057 / #1059 already landed after the baseline. The per-iteration re-sync (next phase) must re-baseline to the *current* `origin/main`, not this commit. Always cross-check `DECISION_LOG.md` (bottom) for the latest.

---

## 8. Open contradictions to settle (owner)

- **Pakanta:** live site = single SKU ₱2,499; old `0036` spec = 3-tier (₱1,999/₱3,999/₱9,999). Re-sync to single SKU unless owner re-confirms tiers.
- **Folder collision:** two `0037_*` folders (`0037_bespoke_monogram` + `0037_event_day_preload`) — renumber one.
- **Vendor Pro price history:** old specs cite ₱1,999/₱499-wk variants; live = ₱2,499/28d. Live wins.
