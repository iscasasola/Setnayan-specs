# AS-BUILT GROUND TRUTH — 2026-06-07 (§§ 1, 2, 8, 9 re-synced 2026-06-18)

> **THIS IS THE CANONICAL REFERENCE.** Source of truth = the **live site (https://www.setnayan.com)** + the **shipped code** (`Setnayan-App` / `apps/web` on `origin/main`). The iteration spec folders (`0000_*`…`0052_*`) and the dated handoffs are **reconciled TO this document**, not the other way around. When an old spec disagrees with this file, this file (and the live site / code) wins. Built during the 2026-06-07 full-resync directive. **§§ 1, 2, 8 updated + § 9 added 2026-06-18** via live-site crawl (setnayan.com homepage, /pricing, /for-vendors, /help, /our-story, /vendors).

---

## 0. Source-of-truth order (read this first)

1. **Live site** `www.setnayan.com` — authoritative for SKUs, prices, public copy, vendor offering.
2. **Shipped code** `apps/web` @ `origin/main` — authoritative for surfaces, flows, schema, behavior.
3. **Live prod DB** (Supabase Singapore) — authoritative for data shape + what's actually deployed.
4. This ground-truth doc — the reconciliation of the above.
5. Iteration specs / handoffs — **reference + history only; may be stale.**

---

## 1. Customer / couple SKU catalog (live site · 2026-06-18 re-sync · ⚠ supersedes 2026-06-07 snapshot)

> Canonical prices are from **Pricing.md § 00** (owner-locked 2026-06-07) — confirmed against live site 2026-06-18.
>
> **⚠ 2026-06-29 live-site delta (supersedes the § 00.B mirror below where they disagree):** the public `/pricing` à-la-carte catalog has moved to the **2026-06-14 website-collapse addendum — now LIVE.** Standalone **RSVP · RSVP Pro · Event Website · Editorial Website** are **gone** from à la carte; the only website SKU is **Couple Website PRO ₱1,999** (Live). Free tier keeps the 4-in-1 couple website + unlimited RSVP; the single ₱1,999 PRO unlock is the upgrade. **Save-the-Date Cinematic Openings / Cinematic Reveal ₱1,499** is the priced reveal opening. The two bundles (Essentials ₱12,999 / Complete ₱27,999) were **REMOVED 2026-06-29** — there are now no bundles, only Free + Setnayan AI (₱499 one-time) + à-la-carte SKUs. The table below is corrected to the live site.

**Free tools (8 — homepage feature grid 2026-06-18):** Guest List · Seat Plan · Budget · Timeline · Mood Board · Checklist · Save the Date (base content film, free) · Website (4-in-1 couple website · see 2026-06-14 free-website addendum). ⚠ Pricing page § 00 describes Free as "schedule, budget, guest list, seat plan, mood board" only — homepage and pricing page are not fully reconciled; owner to confirm final free-tier copy.

**Paywall (couple · Pricing.md § 00.A · bundles REMOVED 2026-06-29):**

| Tier | Price | Includes |
|---|---|---|
| Free — Explore | ₱0 | Free tools above + marketplace browse + match preview |
| **Setnayan AI** | **₱499 one-time (permanent unlock)** | Full matchmaking (date ↔ availability · budget · venue · pax · religion · reviews) + guided planning workspace |

> The **Essentials ₱12,999** and **Complete ₱27,999** bundles were **REMOVED 2026-06-29**. There are no bundles — couples pay Free ₱0 or Setnayan AI (₱499 one-time) plus individual à-la-carte SKUs below.

**À la carte software (live `/pricing` catalog · corrected 2026-06-29 to prod DB):**

| SKU | Price | Build state (live /pricing) |
|---|---|---|
| Setnayan AI | ₱499 one-time | Live (first paywall) |
| Animated Monogram | ₱999 | Live (repriced 2026-07-10, was ₱1,999/₱2,499) |
| ~~Couple Website PRO~~ | **UNBUNDLED** | Umbrella **deactivated 2026-07-10** — Editorial PRO ₱2,999 + Cinematic Reveal ₱999 now sell standalone; no umbrella SKU |
| Custom QR per Guest | FREE | Live |
| Pabati | ₱1,299/day | Live |
| Pakanta | ₱2,499 | Live (ONE SKU — old 3-tier ₱1,999/₱3,999/₱9,999 retired) |
| 3D Plan | ₱2,999 | Live (repriced 2026-07-10, was ₱2,499) |
| Editorial PRO | ₱2,999 | Live (standalone editorial-authoring unlock) |
| Kwento | ₱299 (whole event) | Live |
| Live Background | ₱499 | In build |
| Live Studio (`LIVE_STUDIO`) | **₱2,999 / event-day** (owner-locked 2026-07-25 · unified Cast + Roam; migration `20271001110000`, `is_active=true`) | Live on `/pricing` (chip: In build). **Free = broadcast ONE camera; paid = broadcast all, ceiling 12 per event (`MAX_ROAM_ZONES`); no device split.** ⚠ Both per-day device SKUs `PANOOD_SYSTEM` ₱2,500 / `PANOOD_SYSTEM_MOBILE` ₱1,500 are RETIRED (`is_active=false`, migration `20271005180040`); zero orders ever. Canon: `Live_Studio_Unified_Spec_2026-07-25.md` § 1 |
| Camera Bridge (DSLR · independent) | ₱500/day | Coming soon (flat, event-wide · independent `CAMERA_BRIDGE`, decoupled from Papic + Live Studio · owner 2026-07-08, rounded ₱499→₱500 2026-07-11; consolidates "Pro Camera Sync") |
| Guest Stories | cap ₱2,000/day (₱20/cam·day) | Coming soon |
| Live Photo Wall | ₱2,500/day | Coming soon |
| Cinematic Reveal / STD openings | ₱999 | Live (repriced 2026-07-10, was ₱1,499/₱799) |
| Patiktok | ₱1,499/day | Live (reactivated 2026-07-10 "all features active"; no longer retired) |
| Thank You Video | ₱2,499 | Coming soon |
| Papic Unli | ₱100/cam·day (cap ₱15,000/day) | Live |
| Papic Ltd | ₱30/cam·day (cap ₱9,000/day) | Live |

> **RETIRED — must NOT read as live/priced:** Same Day Edit (SDE) · High Res Archive · Call-Time Escalator · Pro Website · Papic 5-Seats · Papic Guest · standalone RSVP / RSVP Pro · standalone Event Website / Editorial Website · customer token wallet · "Setnayan Concierge" (→ Setnayan AI ₱499 one-time). _(Patiktok is NO LONGER retired — reactivated 2026-07-10, live ₱1,499/day. **Indoor Blueprint is NO LONGER retired-as-priced — reclassified FREE 2026-07-23**, delivered by the free 2D Plan; the ₱1,499 paid SKU is retired, the feature is free.)_

**Tombstoned SKUs (do not implement):** Call-Time Escalator · Pro Website · High Res Archive · the Essentials ₱12,999 + Complete ₱27,999 bundles (REMOVED 2026-06-29). Mood Board kept — free. **Indoor Blueprint is NOT tombstoned — it is FREE (owner 2026-07-23), delivered by the free 2D Plan** (skeletal seat-plan blueprint · `Seat_Plan_2D3D_Alignment_Directive_2026-07-15.md`); the 3D Plan (`SEATING_3D`) INTEGRATES it as one of its four inputs — owner ₱1,500 (⚠ live catalog still ₱2,999; reprice `3dplan#1` · `3D_Plan_Whats_Next_2026-07-23.md`). ✅ Code fix SHIPPED (PR #3593, auto-merge armed 2026-07-23) — free-ifies the card + studio + both guest surfaces, removing the ₱1,499 buy funnel (`Sell_vs_Deliver_Gap_Audit_2026-07-21.md`). See DECISION_LOG 2026-07-23.

**Homepage premium feature grid (confirmed live 2026-06-18):** Setnayan AI · Monogram · Papic · Live Studio · Pakanta · **Contracts** · **Cinematic Reveal**. ("Contracts" = couple-facing contract management per 0032 — price TBD, was ₱199/contract in old spec; "Cinematic Reveal" = premium Save-the-Date opening per 0024 redesign 2026-06-17, priced **₱999** (repriced 2026-07-10, was ₱1,499); owner to confirm Contracts price.)

**Pakulay** — free mood board, "included free with every couple account" per help center 2026-06-18 (matches § 00.C: tombstoned as standalone SKU; merged into free tier).

---

## 2. Vendor offering + economy (live site · 2026-06-18 re-sync · ⚠ supersedes 2026-06-07 snapshot)

**Tiers (28-day prepaid / annual · corrected 2026-06-29 to prod DB):**
- **Free (Verified)** ₱0 — verified profile, in-app chat, bid pipeline, service packages, calendar+.ics, 1 category, 1 team account, 10km boost radius, up to 10 free couple unlocks/wk.
- **Solo** ₱999/28d (or ₱9,999/yr).
- **Pro** ₱2,499/28d (or ₱24,999/yr) — 3 categories, 3 sub-seats, 20km radius, AI Proposal Builder, Demand Pulse, Category Benchmarks, Reverse-Image Theft Monitoring, custom microsite slug, priority support (sub-4h).
- **Enterprise** ₱7,999/28d (or ₱79,999/yr · repriced 2026-07-10, was ₱4,999) — BOUNDED tier: all categories, up to 10 team accounts, 100km radius, Market Intel (Demand Radar + Price-Position · Pro-and-up), quarterly business review, co-listing with Setnayan Productions.
- **Custom** from ₱8,999/28d + à-la-carte add-ons — the truly-unlimited "talk to us" tier above Enterprise.
- **Additional Branch** ₱999/28d.
- **Verification badge** FREE (₱1,499 fee retired — PR #1316; owner 2026-06-04 authorization).

**Commission: 0% — "0% commission, forever."** Vendor keeps 100%; Setnayan never sits between vendor and couple at checkout.

> **🚨 SUPERSEDED 2026-07-24 (owner) — the forward model is a 5% COMMISSION. Read before quoting "0% forever."** 0% is **still true in production today** — the fee system is double-flag-dark (`NEXT_PUBLIC_BOOKING_FEE_ENABLED` + `RAIL_LIVE`, both OFF) and the PayMongo checkout is unbuilt, so nothing is collected. The **locked forward model** = a **5% vendor commission on the FINAL AGREED PRICE** (accepted proposal + accepted amendments, computed at lock), **sourced-only** (imported + own-brought clients stay free forever), activating when PayMongo KYC clears. Public framing: *"0% while we launch → flat 5% on sourced bookings."* ✅ **The "forever" promise is RETIRED (owner 2026-07-24, grandfathering resolved): EVERYONE moves to 5% — no permanent 0% — BUT every vendor's FIRST 5 booked customers are FREE (the observation window; launch-era vendors included).** Chain: **verified (requires DTI + permit) → can book customers → first 5 free → then 5% on the final agreed price.** Manual GCash/BDO QR collection shows *"up for verification, confirmation within 24 hrs."* Canonical: DECISION_LOG 2026-07-24 + `Vendor_Value_Proposition_2026-07-24.md`.

**Token economy (bidding — distinct from retired customer wallet 0003):** 100 free tokens on verification. Burn **a flat 1 token to accept a couple inquiry, uniform across all regions — owner-locked** (flat-1 on 2026-07-11; token unit price raised **₱100 → ₱200 on 2026-07-12**, so the effective lead fee is ₱200/unlock — pending a `vendor_billing_catalog` migration) (supersedes the earlier 1–3 region-banded burn). ⚠ **Shipped code still bands by region** via the admin-editable `token_burn_bands` table read by `unlock_vendor_event` — making the flat-1 lock live = set every band to 1 (or collapse the band lookup to a constant); pending. One idempotent unlock per (vendor, event). Burn-on-answer WIRED (PR #1057). Ghosting nudges WIRED (PR #1059). Token-back mechanic **RETIRED 2026-06-15** (owner: "we will retire this idea"; never wired). Founder 100-free-token deadline promo (31 Jan 2027) pulled from `/for-vendors` copy.

**Token packs (flat ₱100/token · confirmed /pricing 2026-06-18):**

| Pack | Price |
|---|---|
| 4 tokens | ₱400 |
| 10 tokens | ₱1,000 |
| 25 tokens | ₱2,500 |
| 50 tokens | ₱5,000 |
| 100 tokens | ₱10,000 |

**Vendor onboarding:** register in ~3 min (profile/photos/services/calendar) → verification in 3–5 business days → first proposal next week. Path `/signup?as=vendor`. CTA on /for-vendors: "Register your business — free" · "Book a 15-min demo".

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

- **RETIRED:** customer token wallet (0003) · Setnayan Pay commission (now 0%) · BIR tax surface (0026 — retiring 2026-06-07) · Setnayan AI wizard (couple-app; SKU persists) · the old charm-ladder SKU set.
- **DEFERRED (V1.x):** Supplies marketplace (0018, mock) · vendor in-app tier-upgrade + buy-token checkout + calendar block-entry UI · Pro-tier widget purchase (`monogram_hero_upgrade`/`pro_widget_schedule`) · native apps (0052, Capacitor remote-URL shell; Android built). *(NO LONGER deferred — shipped since the audit baseline: admin disputes inline-resolve + admin notifications [PR #1054]; vendor token burn-on-answer + ghosting [PR #1057/#1059].)*

> **⚠ Moving-target note:** this snapshot was taken at code baseline `04931de5`. `origin/main` advances several times/day via parallel sessions — PRs #1054 / #1057 / #1059 already landed after the baseline. The per-iteration re-sync (next phase) must re-baseline to the *current* `origin/main`, not this commit. Always cross-check `DECISION_LOG.md` (bottom) for the latest.

---

## 8. Open contradictions / owner-call items (updated 2026-06-18)

- **Pakanta: ✅ RESOLVED** — single SKU ₱2,499 confirmed on live site (help center 2026-06-18). Old 0036 3-tier spec (₱1,999/₱3,999/₱9,999) is superseded.
- **Folder collision:** two `0037_*` folders (`0037_bespoke_monogram` + `0037_event_day_preload`) — renumber one.
- **Website free vs paid: ✅ RESOLVED on public surface (2026-06-23).** The 2026-06-14 addendum is **live**: free 4-in-1 couple website (incl. unlimited RSVP) + a single **Couple Website PRO ₱1,999** upgrade. À-la-carte no longer sells RSVP / Event Website / Editorial Website separately.
- **Cinematic Reveal price: ✅ RESOLVED.** The premium Save-the-Date opening (homepage "Cinematic Reveal") is **₱1,499**. Buy flow shipped #1705/#1709/#1718.
- **Contracts (couple-side) price: ⏳ STILL OPEN.** "Contracts" listed as a premium couple feature on the homepage. No price shown on `/pricing` (not a public à-la-carte SKU). Old 0032 spec: ₱199/contract or free unlimited with Vendor Pro. Owner to confirm current price and tier placement.
- **RSVP SKU collision (from § 00.E): ✅ RESOLVED on public surface.** RSVP is no longer a standalone à-la-carte SKU on `/pricing` (folded into the free website + Couple Website PRO ₱1,999). *Residual:* any stale prod-DB RSVP catalog rows may still need a cleanup pass so DB matches the collapsed public model.
- **Vendor Pro price / commission / verification / AI-vs-Concierge: ✅ RESOLVED.** Every page (`/`, `/pricing`, `/for-vendors`, `/how-it-works`) shows uniform **Solo ₱999/28d · Pro ₱2,499/28d · Enterprise ₱4,999/28d · 0% commission · free verification**, and the planner is **Setnayan AI** everywhere (now ₱499 one-time; no "Concierge", no ₱1,499).

---

## 10. Post-baseline features shipped since 2026-06-07 (notable additions · 2026-06-18 audit)

### 10a. Kwento — Narrative infrastructure layer (Phases 1 + 2 shipped 2026-06-18)

Kwento began as a ≤280-char photo-message box. Phases 1+2 upgrade it to the **narrative infrastructure layer** of the event.

| Phase | What shipped | PR |
|---|---|---|
| Phase 1 | `FaceBlock` serve-path guard — `getWallSnapshot()` fetches `guests.faceblock_enabled` at serve-time; suppresses caption if true. Fixed TS2367 narrowing error. | #1721 |
| Phase 2 | **Flash tier (≤50 chars)** — migration `20270115000000_kwento_voice_depth.sql` adds `voice_depth ∈ {flash, story}` on `photo_messages` + `kwento_flash_auto_wall` on `events`. Flash auto-walls after 5s when clean (coordinator kill-switch). Story stays in couple-review queue. Notifications debounced (one `kwento_story_batch` email / 10 min / event). Admin Flash auto-wall toggle in console. | #1722 |
| Phase 2 (density) | **Density Map** — `lib/kwento-density.ts` aggregates Kwento counts per photo; Alaala hub shows "Most storied moments" row + "Mga Boses" pull-quotes when data exists; gallery thumbnails get density dots (gold ≥3, amber 2, grey). | #1724 |

**Three voice depths (shipped/spec'd):**
- **Flash** ≤50 chars — Live Wall lower-third caption; venue projection feed; fires immediately after shutter.
- **Story** ≤280 chars — existing shipped format; couple review queue → Magazine pull-quote → Auto-Recap voices.
- **Column** 200–400 words — invite-only; couple-selected contributors write byline editorial pieces; surfaces in Alaala editorial page. *(Phases 3–4 queued.)*

**Phases 3–6 queued:** Assignment Board · Column tier · Editorial assembly engine · Vendor voice.

**Spec:** `02_Specifications/Kwento_Monumental_Upgrade_2026-06-18.md` · `02_Specifications/Kwento_Automation_Failproof_2026-06-18.md`

---

### 10b. Save-the-Date — Redesigned 2026-06-17 · Reveals SHIPPED

The original ₱99/₱199 video-render SKU is **RETIRED**. The entire 0024 iteration was redesigned 2026-06-17.

**Current model:**
- **FREE = the content film** — a continuous, scrubbable 7-beat multi-slide film (auto-advances: monogram → names+date → ceremony venue → reception venue → message/media → "formal invitation to follow" → add-to-calendar). Mood Board colours auto-inherit. Part of the free 4-in-1 couple website.
- **PREMIUM = the reveal "filter"** — a cinematic opening layered ON TOP of the free film (reveal plays → lifts → content film auto-plays). Currently ₱1,499/event (first unlock per event). Priced via admin catalog.

**Five reveal templates:**
1. **Sheer veil** — WebGL Verlet cloth simulation; owner-approved physics (47-iteration interactive loop); `veil-reveal.tsx`
2. **Two-flap (vertical split)** — cathedral/church doors
3. **Two-flap (horizontal split)** — top/bottom
4. **Four-flap** — envelope-style
5. **Church doors** — rigid hinged

**Build state:**
- Veil reveal: ✅ PORTED PR #1671 (flag-gated `NEXT_PUBLIC_STD_REVEAL=1`)
- STD openings ₱1,499 buy flow: ✅ SHIPPED PRs #1705 / #1709 (fail-proofed) / #1718 (handshake gate)
- Content film (PR4 — the 7-beat free film): 🟡 **in build**
- Invite-launch-date field + add-to-calendar dual-event: 🟡 in build
- Mood Board colour auto-inherit for reveals: ✅ wired via `site-palette.ts`

**Spec:** `0024_save_the_date/0024_Save_the_Date_Content_and_Customization_2026-06-17.md` · `0024_Veil_Reveal_Spec_2026-06-17.md` · `0024_Reveal_Tuning_and_Door_Spec_2026-06-17.md`

---

### 10c. Adaptive Checklist — Foundation shipped 2026-06-17 (PR #1646)

The couple-side Checklist is no longer static; it adapts to the couple's event type, vendor picks, and budget signals.

**Core philosophy:** wedding date is the **OUTPUT** of vendor discovery (not the input). Checklist guides "start with what matters → explore venues → let priorities find your date."

**Three-layer structure:**
| Layer | What it contains |
|---|---|
| Layer 1 — Static backbone | Paperwork · Attire · Guests · Logistics — same for every couple, fixed order |
| Layer 2 — Taxonomy-driven vendor tasks | Auto-seeded from event type + `interested_categories` onboarding picks; different event types → different task lists |
| Layer 3 — Adaptive state machine | Per-category state: `not_started → searching → in_progress → done` (or `excluded/deferred`). Seeded from `event_vendors` signals in Explore. |

**Onboarding pre-fill:** by the time the couple opens the checklist, guest count, budget, ceremony type, and vendor picks are already set → `guest_estimate` and `set_budget` tasks auto-complete.

**Phase 1 ordering (reception-first):** reception venue shortlisting comes before ceremony venue → leads to `/find-date` Schedule Matrix → date locked.

**Budget health-check:** `buffer = total − committed − projected(min..max) − paperwork`. Shown as a best-case / worst-case range.

**Build state (⚠ CODE-VERIFIED 2026-07-08 — earlier "foundation" wording overstated reality):** Only **Layer 1 fires.** `ensureChecklistSeeded()` is called on checklist page + home-card render (`checklist-actions.ts:40`) and reliably seeds a **single hardcoded PH-wedding template** branched only on `ceremony_type` (catholic/muslim/inc). The "adaptive" apparatus is **present but DEAD CODE with zero callers**: `lib/checklist-taxonomy.ts` (Layer 2) is a 28-line stub that reads `interested_categories` and is imported by nobody; `lib/checklist-state.ts` (Layer 3 state machine) and `lib/checklist-budget.ts` `computeBudgetHealth` (budget health-check + Tier-3 derivation) have **0 callers repo-wide** — they never execute. **Nothing reads `event_type`.** 🔴 **Live bug:** `isChurchCeremony(null) === true` (`checklist.ts:81-82`) → any non-wedding event (null `ceremony_type`) renders the **full Catholic-wedding checklist** — marriage license, CENOMAR, pre-Cana, ninong/ninang. Not a crash; confidently wrong. This is the de-hardcode target of the per-type spec below.

**Per-event-type expansion (2026-07-08, owner "generate the checklist for each event"):** the wedding-shaped checklist is being de-hardcoded into an `EventTypeChecklistDef` (date-model · anchor · backbone · statutory pack · phase order per type) with all 8 enabled non-wedding types defined — advances past the V1 wedding-only lock (deliberate owner decision). Spec-only so far; repo PR pending.

**Spec:** `02_Specifications/Adaptive_Checklist_Design_2026-06-17.md` (wedding-shaped design) + `02_Specifications/Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md` (per-event-type framework + all 9 type defs)

---

## 9. Public site navigation + messaging (live 2026-06-18)

**Header nav:** Explore · For vendors · Our story · Journal · Real Stories
**Auth CTAs:** Sign in · Start planning
**Hero headline (live 2026-06-23):** "A thousand choices. The same questions, over and over." / sub: "Say it once — and find your perfect fit."
**Primary hero CTA:** "Start your wedding planning here — free" · "0% commission · always"
**Brand wordmark:** SET NA 'YAN · tagline "Filipino wedding planning + verified vendors"
**Homepage feature grid (16, live 2026-06-23):** Guest List · Seat Plan · Budget · Timeline · Mood Board · Checklist · Save the Date · Website (8 free) — Setnayan AI · Papic · Monogram · Live Studio · Pakanta · Contracts · Cinematic Reveal · Patiktok (8 premium).
**Footer:** Help · Real Stories · Journal · Monogram maker · For vendors · Mac app · Privacy · Terms · Sign in · © 2026 Setnayan · "Made in the Philippines"

**Brand + mission (from /our-story):**
- Four pillars (live /our-story 2026-06-23): **Papic** (guest-captured candids) · **Live Studio** (livestream / remote attendance) · **Kwento** (guest-contributed stories paired with photos) · **Editorial** (a printed page with an embedded code linking back to the living digital memory)
- Positioning: "Everyone gives you a record. We give you an Alaala."
- "Weddings have always been planned for the couple. We built the first platform where every guest is part of it."

**Launch dates (from help center 2026-06-18):** Pilot June 1, 2026 · Public December 1, 2026.

**192 verified vendor categories** searchable across the Philippines (from /for-vendors copy).
