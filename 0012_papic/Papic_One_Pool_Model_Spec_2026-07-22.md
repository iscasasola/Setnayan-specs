<!-- Council-produced (ground+design+red-team, 8 agents, 22 findings/6 blockers), owner session 2026-07-22. Owner-decided model; several prices PROVISIONAL + 3 owner sign-offs + a DPO gate open. Supersedes the pricing half of Papic_Pricing_Lock_2026-07-20.md § 2.3 per § 5. -->

# Papic — FINAL Build-Ready Spec (red-team-hardened)

> **🔄 OWNER OVERRIDE 2026-07-23 — PAPIC ONE POINTS ARE DEDICATED, NOT POOLED.** "Papic One does not share their points to the pool. They get their own dedicated points and their own QR code." Each ₱100 Papic One camera carries its OWN 250-pt budget bound to its `paparazzi_seats` row (its claim QR is its identity) — the 250 pts are NOT granted into the shared event pool, and guest-phone captures can never drain a dedicated camera's budget. This supersedes §0's "uniform pool / no per-seat reserve / one budget to bind" clause FOR PAPIC ONE ONLY (Free keeps its 90-pt pool w/ per-seat reserve; Pool tiers + top-ups stay the one shared pool). Engineering shape: the per-seat reserve accounting §2.1 already specs for Free is the same primitive — the capture gate meters seat-scoped grants for One seats and the shared grant for everything else. The product logic: a dedicated camera's guarantee is the reason it's bought.


> Supersedes the architect's draft plan. Every red-team blocker and high is folded in as either a **resolved change** or an **explicit gate**. Prices below carry a hard caveat: several rungs are **provisionally priced** and blocked from real-data sale until the storage-purge machinery exists (see §1.4 and Residual Risks). Buildable on `origin/main` (`/Users/icecasasola/setnayan-platform-recovered`). Never-rename lock is honored throughout: **display-title + price + metering only, zero `service_code`/`tier_code` moves, deactivate never drop.**

---

## 0. OWNER OVERRIDE — FINAL LOCKED NUMBERS (2026-07-22)

> **BUILD THESE. Where any figure in §1+ conflicts, this section wins.** The owner reviewed the council's cannibalization-guarded prices (§1.1) and overrode two, and reshaped Papic One from "1 non-repeatable seat" to a **per-camera** add-on.

| Product | Points (window-total) | Price | Shape |
|---|---|---|---|
| **Free** | **50** | ₱0 | **Papic Pool @ 50 pts — the POOL model, free per event** (owner 2026-07-22: *"Free is Papic pool with just 50 points"*). One shared 50-pt event pool, unlimited guest phones via the event QR; **NO dedicated-seat reserve** — "just 50 points" is a plain shared budget, first-come accepted (it's free). Supersedes the council's 90 **and** my earlier "3 seats + per-seat-reserve" framing: Free is the Pool product capped at 50 pts, not a seat tier. |
| **Papic One** | **250 per camera** | **₱100 / camera** | **Per-camera, repeatable.** Each ₱100 camera grants **250 pts to the shared event pool + 1 `paparazzi_seats` row**. Face-tag bundled (available via the §3 gate). Positioned as the **small-event** option for couples who don't need a 3,000-pt Pool. Overrides the council's ₱150 / 300-pt / 1-non-repeatable-seat design. |
| **Papic Pool** | 3,000 / 6,000 / 10,000 / +10,000 | **₱999 / ₱1,999 / ₱2,999 / ₱2,999** | Unlimited guest phones, one shared pool. Prices already shipped (PR #3486); they supersede the stale ₱500/₱1,000/₱1,500 in §1.1's table. |

**Ladder still holds — owner override applied with eyes open.** On the *shipped* Pool price, Pool = ₱999/3,000 = **₱0.333/pt**; One = ₱100/250 = **₱0.400/pt**. One is priced **above** Pool per point, so a handful of ₱100 cameras can **never beat the event pass on points** (12 Ones = ₱1,200 for 3,000 pts + seats vs Pool ₱999 for 3,000 pts + unlimited phones) — the ladder's core invariant survives. What the owner **knowingly overrides** is the council's *cushion*: One clears Pool by only **1.2×**, not the council's preferred **≥2×**, and sits below the ₱150 manual-rail floor. Accepted: One is the cheap small-event entry ticket, Pool is the volume play. **Still merchandise One as "add a dedicated camera," never as a Free→Pool ladder rung.**

**Uniform pool (owner 2026-07-22, "Free is Papic pool"):** Free (50 pts), One (250 pts/camera), and Pool (3k/6k/10k+) all do the same thing — grant points to **ONE shared `papic_event_point_grants` pool per event** — and **every** capture (guest phone via event QR *or* a dedicated Papic One seat) meters that one pool through the same reserve RPC. One model, one gate, no per-seat reserve. This is what makes the fence-safe metering tractable: there is exactly one budget to bind.

**Pool meter binds photos AND videos (owner item 2):** the point pool is the *single* ceiling for total captures — every photo (1 pt) and every clip decrements the same event grant, fail-closed at 0 (409 `camera_points_exhausted`). There is no separate uncapped path for either. This is the PR4 fence-safe metering + its **mandatory binding test** (§4-PR4 / Residual Risk R4) — the riskiest build, last to trust.

**Video currency = 10s / 7 pts — LOCKED (owner override 2026-07-22, reverses the council deferral AND the CLAUDE.md 5-second lock).** The owner directed the clip model up from the shipped **5s / 3 pts** to **10s / 7 pts**. This is **load-bearing** and ships as its OWN isolated PR *after* the metering PR (the clip-point value is a hardcoded constant on the **fail-closed capture path**, per lineage "must ship alone"). That PR: (a) raises the client capture cap **5s → 10s** — this **reverses the CLAUDE.md "5-second hard cap on video clips … not configurable" hard-constraint lock**, which must be updated in lockstep; (b) raises the clip point value **3 → 7**; (c) audits reel/template slot durations (longer source clips only give reels *more* to trim — low risk, but verify no manifest assumes an exact 5s source); (d) updates the copy-guardrail figures ("about N photos, or M videos" — a 3,000-pt Pool = ~428 clips at 7pt); (e) notes the **storage impact — 10s clips are ~2× the bytes and clips do not compress yet, so this raises the urgency of the clip-web-copy storage PR** (owner accepts, staying on R2). The metering PR is unaffected (it meters whatever the constant is); the currency PR bumps the constant + any metering test that asserted 3pt.

**Face tagging = an OPT-IN QUESTION, never required (owner 2026-07-22).** A guest is *asked* whether they want face tagging; they choose yes (opt in → enroll their own face) or no (skip). It is **never a requirement to participate** — declining still delivers every one of their photos, untagged (the untagged-still-delivered guarantee). This is the **guest-consent layer** and sits under the **event-mode layer** (mode_a = face-sort available for the event; mode_b = off). Both must be true to face-print: the event offers it (mode_a) AND the guest opts in (consent). The §3 gate + the enrollment-hole fix enforce exactly this — mode_b (or a guest who declines) stores no descriptor. Copy must frame it as an optional question ("Want your photos auto-sorted by face? Opt in / Skip"), **default-unchecked**, never a gate.

---

## 1. The model

### 1.1 Lineup + prices (revised for cannibalization + the ₱150 floor)

| Product | Seats | Meter | Points | Price | ₱/1,000 pts | Window | Maps to shipped code |
|---|---|---|---|---|---|---|---|
| **Free** | 3 (per-seat reserve) | window-total | **90** (30/seat reserved) | ₱0 | — | 6-mo access | `papic_tier_config.free` + `PAPIC_CAMERA_FREE` |
| **Papic One** | **1**, non-repeatable | window-total, flat | **300** | **₱150** | **₱500** | 6-mo access | `PAPIC_CAMERA_MINI_DAY` (`tier_code 'mini'`), redefined |
| **Papic Pool** | unlimited guest phones | window-total, flat | **3,000** | **₱500** | ₱167 | 6-mo access | `PAPIC_GUEST` |
| Papic Pool 6k | unlimited | window-total | 6,000 | ₱1,000 | ₱167 | 6-mo access | `PAPIC_GUEST_6K` |
| Papic Pool 10k | unlimited | window-total | 10,000 | ₱1,500 | ₱150 | 6-mo access | `PAPIC_GUEST_10K` |
| Papic Pool +10k top-up | unlimited | window-total | +10,000 | ₱1,500 | ₱150 | 6-mo access | `PAPIC_GUEST_TOPUP` |

**Two changes from the draft, both red-team-forced:**

- **Papic One is ₱150 / 300 pts, not ₱100 / 500.** The draft's ₱100 violated the **₱150 manual-rail floor** set in the same 2026-07-20 session, and ₱0.20/pt sat at only **1.2× the Pool per-point rate** — the lock deliberately keeps the dedicated-shooter tier at **≥2× the pass rate** so a handful of cameras can never beat the event pass and collapse the ladder. At 300 pts / ₱150, One is **₱500/1,000 = 3.0× the Pool rate** — gap restored. One is **one non-repeatable purchase per event, exactly 1 `paparazzi_seats` row**, merchandised as "add one dedicated shooter," **never as a rung between Free and Pool.**
- **Currency: SUPERSEDED by §0 (owner override 2026-07-22) — clip = 10s / 7 pts is now LOCKED and shipping** as a dedicated post-metering PR that also reverses the CLAUDE.md 5-second lock (see §0). The "deferred" framing below is lineage. ⚠ **Cost caveat still stands and is the coupling the owner accepted:** 7 pts is cost-fair only at a genuine 6-month retention (clips don't compress + no purge is built), so until the **clip-web-copy storage PR** lands, 10s/7pt clips are stored ~perpetually and under-priced — that storage PR is the mandatory mitigation, prioritized because of this decision.

**Pool ≠ seats.** "Unlimited" for Pool = unbounded guest-phone shooters (`papic_guest_captures`, keyed by `guest_id`) drawing one shared point pool — **not** `paparazzi_seats` rows. Papic One's "1 seat" is one real `paparazzi_seats` row whose capture gate reads the same event pool (§4-PR4). Two subsystems, kept separate.

### 1.2 One meter for everything

Free, One, and Pool all meter **window-total against the event point pool** (`papic_event_point_grants` → `papic_reserve_event_points`), fail-closed at 0 (409 `camera_points_exhausted`). No per-camera·day math survives in any live path. This kills the draft's meter-mismatch bug where One granted to a pool its own seat never read.

### 1.3 Currency — clip weight and cap held at shipped values

Photo = 1 pt · clip = **3 pts** · **5-second hard cap retained.** The owner model (clip = 7, 10s) is **conditionally deferred to a later PR (§4-PR6)** and does **not** ship in this cycle:

- 7 pts is cost-fair **only at a genuine 6-month retention** because clips never compress; with **no purge machinery built** retention is effectively perpetual, where cost-fair is ~30 pts. Shipping clip=7 alone under-prices video.
- 10s **doubles clip byte size** (~2×) on top of that, and **reverses the "5-second hard cap" lock** documented in both `CLAUDE.md` files.
- **Therefore PR6 is coupled to the clip-compression + purge build (Residual Risk R1); it does not ship on its own.** No lock reversal is requested this cycle.

### 1.4 The 6-month "window" is an ACCESS window, not a deletion promise

Encode 120-days-before / 60-days-after (`event_date − 120` → `event_date + 60`) as a **capture/access validity gate only** — never a billing input, never a storage bound.

- `resolvePapicWindow()` non-travel branch (`lib/papic-window.ts:159-179`): clamp `startDate` to `max(requested, event_date − 120)`; **move the end pin from `event_date` to `event_date + 60`** (remove the `end_after_event_date` hard error for the +60 span). Travel/multi-day keeps its wider branch.
- Stamp `paparazzi_seats.valid_from/valid_until`; capture gate refuses outside the span. Pool close ties to `event_date + 60`, consistent with PR #3430's "the pass shuts when the gallery does."
- **`days` MUST NOT feed price.** Under flat pricing (PR3/PR4) `days` stops being a multiplier — otherwise a 180-day window bills 180× (₱150 × 180 = ₱27,000). Columns `events.papic_window_start/end` already exist; **no new column.**

> **⚠ Blocker R1 (storage) — the window frees ZERO bytes.** A `valid_until` capture gate deletes nothing. Lock §4.3 is explicit: no wholesale purge exists, nothing cascades off `papic_photos`, clips are excluded from the only drop path, and the sweep runs ~1,000 obj/wk against 15k–100k obj/event. **Every price here rests on the lock's 6-month ₱0.023/pt cost basis, which assumes deletion at window end.** That deletion is not built and this plan does not build it.
> **Consequence:** (a) after 12–18 months of sales, realized cost accrues perpetually while stickers were set on a 6-mo-deletion basis → blended margin drifts below the modeled 84–85% every quarter; (b) **publicly advertising "6-month retention" as a deletion deadline the machinery cannot execute is materially worse under RA 10173 storage-limitation than promising nothing.**
> **Mandatory guardrails baked into this spec:** (1) Public copy says **"6-month access window,"** never "we delete your photos at 6 months," until purge ships. (2) **Do not GA the paid rungs on the 6-mo cost basis** until the purge machinery (lock §8 item 3) **and** clip compression (lock §8 item 8) actually ship; treat current prices as **provisional** and re-validate margin against real retention once purge lands. (3) Clips stay 5s/3pt (§1.3) precisely because their perpetual-retention cost-fair weight is ~30pt, not 7.

---

## 2. Free tier — resolved number

**Shipped reality:** `papic_tier_config.free` = 3 seats × 20 pts/day, reset daily (owner cut 5→3 seats 2026-07-17). Metered per-day while paid rungs are window-total → broken, non-monotonic ladder.

**Resolved: free = 90 points window-total, 3 seats, with a per-seat reserve of 30.** Owner confirms the number.

- **Why 90, not the draft's 150:** the draft tripled the owner's lock-decided 50 unreconciled, and on a **one-day wedding** 150 window-total is **2.5× more generous** than shipped (60) while shrinking the free→One step to ~3.3×. 90 keeps free modestly above the shipped one-day baseline, sits at a clean **3.3× step to One's 300**, and stays well below One's per-point value.
- **Why a per-seat reserve (red-team medium):** the draft's single shared 150-pt pool across 3 seats **kept the shared-pool race** — the first guest could burn the whole grant and free cameras 2 and 3 hit an immediate 409 on the exact acquisition funnel free exists to feed. Reserve **30 pts/seat**; the remainder is first-come. This carries the lock's open eng item #5 (per-seat floor) that the draft dropped.
- **Implementation:** seed one `papic_event_point_grants` row (`source 'free_grant'`, 90 pts) at event creation, plus per-seat reserve accounting in the capture gate; point free seats at the event pool (same plumbing as One/Pool). Guardrail test cross-checks copy == config (`lib/papic-copy-guardrails.test.ts:145`) — update copy in lockstep.
- **Reconcile:** this **supersedes the lock's owner-decided 50** — flag as an owner sign-off (§6).

---

## 3. QR face-tag consent

**Model:** custom (per-guest) QR = opt-in enroll with a biometric-consent artifact → face vectored → auto-tagged (**Mode A**). Generic/shared QR = **no vector computed, transmitted, or stored** → untagged-but-delivered (**Mode B**). Only consented faces are ever embedded.

### 3.1 Custom QR = FREE (owner confirms)

The identity/consent-bearing token is `guests.qr_token`, **already minted free per guest** (`20260513010000_...guests.sql:125`). The paid `CUSTOM_QR_GUEST` SKU (**₱999**, not ₱1,499 — repriced 2026-06-08; stale doc-comment at `app/[slug]/seat/page.tsx:24`) is only the **branded printable + seat-pass** cosmetic. **Keep it paid as the print/seat-pass upgrade; the consent-bearing scan is free** — gating the RA 10173 opt-in doorway behind a paywall is the wrong incentive.

### 3.2 Consent is the checkbox+selfie, NOT the QR (red-team high, corrected)

**The QR is the doorway; the checkbox + selfie is the consent artifact.** Scanning the custom QR only signs a guest session (`redeem/route.ts:38`, `seat/claim/route.ts:60-82`) — it must **never** be treated as opt-in. Freely-given, specific consent requires:

- A guest can scan their QR to find their table / view their gallery **with zero enrollment pressure**.
- The enrollment selfie step is **skippable with no loss of seat-finding or gallery function**.
- **Both checkboxes (biometric consent + 18+) default unchecked.** No path treats "has custom QR" or "scanned" as consented.
- Rename in all copy/spec: "custom QR = the doorway; consent = the explicit selfie+checkbox step."

### 3.3 Columns

- **No new column for consent storage.** `guest_face_enrollments` already makes consent structural: `consent_at NOT NULL` (no row without consent), `face_vector JSONB` (NULL until computed), `revoked_at` (matcher excludes), `consent_source TEXT` free-text (`'custom_qr'` needs no migration). Withdrawal is real erasure (`withdrawFaceConsent` nulls vector, deletes R2 selfie, sets `revoked_at`).
- **One new column: `guest_face_enrollments.consent_copy_version`** (red-team medium — consent evidence). Today the row records *that* a box was ticked but not *what disclosure* was shown; the account path already pins `ACCOUNT_FACE_CONSENT_VERSION` (`account-face-profile.ts:41`), the per-event path has no equivalent. Add the column, stamp it at enroll on **all** paths (RSVP, day-of, custom-QR), bump on material copy changes to force re-consent.
- **One new column: `events.papic_face_mode`** (enum `mode_a` / `mode_b`, default `mode_b`) — the per-event switch that gates *whether faces are embedded at all*. This is the hinge of the blocker fix in §3.4.

### 3.4 Mode gate is a HARD prerequisite before any face activation (blocker)

> **⚠ Blocker: "generic QR = never vectored" is FALSE at the compute+transmission layer today.** `embedFaces(canvas)` is called **unconditionally** on every shutter (`papic-seat-capture.tsx:417`, `papic-guest-capture.tsx:269`, `booth-capture.tsx:390`); descriptors are POSTed to the server (`guest-capture/route.ts:319-327`, `autoTagSeatCapture actions.ts:575-622`). The only consent gate is at the matcher's **storage fetch** (`face-match.ts:44-50`) — nothing gates whether a descriptor is **computed or transmitted**. There is no `papic_face_mode` column today. **The instant `NEXT_PUBLIC_FACE_MODEL_URL` is set on prod, every event — including Mode-B / generic-QR events promised zero biometric processing, plus opt-out guests, minors, and bystanders — computes a 128-d descriptor of every face in every frame and POSTs it to Setnayan.**

**Mandatory, merge-blocking sequence — the env var must NOT be set on prod until all of this ships and is verified there:**

1. **Guard `embedFaces` at all three client capture call sites**, keyed on resolved `events.papic_face_mode`. Mode B → `embedFaces` is **not called** (no descriptor computed, nothing transmitted). Only Mode A with a consented roster runs it.
2. **CI/test assertion:** no capture component may call `embedFaces` without a resolved Mode-A event. Add to the guardrail test suite.
3. **Enforce `isDataPrivacyControlActive('face_enrollment')` at the matcher** (`autoTagCapture`) — today it has **zero runtime callers** (only `vendor_papic_capture`/`vendor_guest_delivery` are checked), so the admin board flag is a paper record.
4. **Prefer on-device matching for Mode A** (red-team high — bystander processing). Even in Mode A, a group photo embeds bystanders/opt-outs whose probe vectors currently transit to the server. Move the match on-device so **raw probe vectors of non-enrolled faces never leave the device**; the server receives only resolved `guest_id` tags. If on-device match is not feasible this cycle, **it becomes a DPO deliverable** (§7): the ROPA must document transient on-device embedding + immediate discard, and DPO must rule it defensible — **do not GA Mode A on real data without that ruling.**
5. **Scrub `face_vectors` from all observability** (red-team medium): Sentry `beforeSend` denylist, no request-body capture on `/api/papic/guest-capture`, redact the `autoTagSeatCapture` action arg. Assert in tests. On-device matching (step 4) removes this surface entirely.

**Activation is a double-lock recorded event:** `NEXT_PUBLIC_FACE_MODEL_URL` set **AND** `/admin/data-privacy` `face_enrollment` flipped — and only after steps 1-5 are verified in prod. Build/test on demo accounts is normal dev.

### 3.5 Minors — server-enforced age gate (blocker)

> **⚠ Blocker: the 18+ affirmation the plan relies on is client-only.** Both server enrollment paths omit it: `submitRsvp` gates on `selfieRef && biometricConsent && !faceExcluded` (`app/[slug]/actions.ts:158` — no age field read), `enrollGuestFace` gates on `!selfieRef || !consent` then `face_recognition_excluded` only (`app/papic/face-enroll-actions.ts:30-45`). A crafted/replayed POST with `biometric_consent=1` and no age field enrolls a minor's biometric vector. Christening/debut events are full of unmarked minors; the couple-set `guests.face_recognition_excluded` flag is the only server-side protection and requires proactive marking.

**Mandatory:**
1. **Enforce `age_affirmation` server-side on both `submitRsvp` and `enrollGuestFace`** as a hard precondition alongside `biometric_consent`, and on the new custom-QR path.
2. **For minor-honoree/guardian event types (christening, debut): force Mode B** (no embedding) unless a guardian-consent workflow exists. The open "minors standard" question (DPIA BV-8) is a **blocker for those event types**, not an open item.

---

## 4. Build plan — ordered, flag-gated PRs

**Never-rename lock respected everywhere: display-title + price + metering only, `is_active=FALSE` never drop.** Three independent title layers must all move together (a catalog retitle alone won't reach the hardcoded surfaces):

- **A. Catalog** `platform_retail_catalog_v2.title` → `/pricing` + JSON-LD (`app/pricing/page.tsx:353,385,409,600`)
- **B. Camera ladder** `papic_tier_config.display_title` → `publicPapicLadder()`
- **C. Doorway cards** — hardcoded in `lib/add-ons-catalog.ts:568,614`
- **D. Marketing + AI-facing surfaces (red-team blockers — were missing):** `app/papic/page.tsx` (hardcodes the **opposite** mapping: line 112 "Papic One — like handing each table a digital disposable camera," h3 "Papic One" at 252/257 describing the every-guest pass), `app/papic/guest/page.tsx` (Buong Araw copy), `public/llms.txt` (names "Papic Mini ₱30 / Papic Ltd ₱50 / Papic Unli ₱100," the ₱6k/₱10k/₱15k caps, "5-second clip = 3 points"), `lib/llms-price-fixture.ts` (hardcodes ₱30 Mini/₱6,000 cap), the public estimator (`app/pricing/_papic-estimator.tsx` + `estimatorRates` in `pricing/page.tsx`), and the studio picker (`app/dashboard/[eventId]/studio/papic/extra-cameras-picker.tsx`).
- Plus two dormant hardcoded maps: `initialize-maya/route.ts:56,80`, `editorial/data.ts:100`.

### PR1 — Retitles + all name-collision surfaces (safe, invisible until flip)
- 4× `PAPIC_GUEST*` catalog titles `Papic One — N shots` → **`Papic Pool — N shots`** (prices already ₱500/1000/1500/+1500; no price change).
- `papic_tier_config.display_title`: `mini`/`roll` `Papic Mini` → **`Papic One`**; mirror `PAPIC_TIER_CONFIG_FALLBACK.mini/roll` (`lib/papic-tier-copy.ts:60-140`).
- Doorway card `lib/add-ons-catalog.ts:614` `'Papic Buong Araw'` → **`'Papic Pool'`**; `:568` verify → `'Papic One'`.
- **Rewrite the opposite-mapping prose in `app/papic/page.tsx` (112, 252, 257) and `app/papic/guest/page.tsx`** so "Papic One" = the 1-seat crew camera and "Papic Pool" = the every-guest pass — in lockstep, or the same guest pass reads "Papic One" on `/papic` and "Papic Pool" on `/pricing`.
- **Update `public/llms.txt` + `lib/llms-price-fixture.ts` together** — remove `₱30 Mini / ₱6,000 cap / Papic Max/Unli / per-camera-day` figures, add the flat figures, so **both directions of `lib/llms-price-drift.test.ts`** (unapproved-figure AND unused-entry) pass. Otherwise CI red blocks auto-merge, or stale ₱30/Max pricing stays public to answer engines.
- Optional dormant maps (Maya, editorial) for consistency.
- Respect the **duplicate-active-title RAISE** (`20270828150000:962`) — drop "per camera, per day" wording from the mini catalog title so it doesn't collide.

### PR2 — Remove Papic Max + retire legacy tiers
- `UPDATE papic_tier_config SET is_active=FALSE WHERE tier_code IN ('unlimited','roll')` + catalog `PAPIC_CAMERA_UNLIMITED_DAY is_active=FALSE` + mirror `PAPIC_TIER_CONFIG_FALLBACK.unlimited.isActive=false`, `.roll.isActive=false`. `publicPapicLadder().filter(isActive)` drops them everywhere. (`ltd` already inactive.)
- **`roll` MUST be deactivated here** (red-team medium): PR1 retitles it to "Papic One" but it stays a per-camera·day tier routed through `computeCameraQuote` — leaving it active creates a **second, divergent "Papic One"** billing per-day×window under the flat name. Deactivate, don't leave a live meter contradicting the flat promise.
- Buong Araw was a doorway not a SKU (PR #3423 reused `PAPIC_GUEST`) — PR1's label rename retires the name; `papicGuestPassAccess()` predicate stays. All `PAPIC_GUEST*` rows are `is_active=FALSE` + `coming_soon`, so invisible until flip.
- **Rework/remove the public estimator** (blocker): `app/pricing/_papic-estimator.tsx:47` computes `cameras * rate * days` with hardcoded `capPerDay:15000` and reads `PAPIC_CAMERA_UNLIMITED_DAY` — it does **not** go through `computeCameraQuote`, so "caps go inert" and "drop the `*d` multiplier" don't reach it. After PR2, `rateOf('PAPIC_CAMERA_UNLIMITED_DAY')` falls back to 100 → estimator keeps quoting a **removed** Max, and for a 6-month window quotes `1 × ₱100 × 180 = ₱18,000` for the flat product **live on `/pricing`**. Replace with flat-price cards; delete the days multiplier and the hardcoded 15000 cap in `estimatorRates`.

### PR3 — Redefine Papic One = flat, window-total, 1 seat (⚠ metering-model change — owner sign-off)
- `platform_retail_catalog_v2`: `UPDATE … SET retail_price_php=150, billing_period='one_time', is_pax_priced=FALSE, title='Papic One' WHERE service_code='PAPIC_CAMERA_MINI_DAY'`.
- **Grant 300 window points via a dedicated seat-grant path — NOT via `papic_pass_tiers`** (red-team low): inserting a camera code into `papic_pass_tiers` trips the 4-tier count assertion (`20270828140000:146`) and conflates the seat and guest subsystems the fence guard reads. Instead grant 300 pts directly to `papic_event_point_grants` from `sku-activation.ts` keyed on `PAPIC_CAMERA_MINI_DAY`.
- Provision exactly **1** `paparazzi_seats` row; **re-point that seat's capture gate at the event pool** (drop its per-day `papic_tier_config` budget) so One's 300-pt ceiling actually binds — resolves the draft's meter-mismatch. Route this rung **OUT of `computeCameraQuote`** (sidesteps the `days` multiplier).
- **Hard-cap One to one non-repeatable purchase per event** (cannibalization fix). Merchandise as "add one shooter," not a Free→Pool rung.
- **Supersede the applied guard assertion `mini.points_per_day=200`** (`20270828150000:942`) in the new migration — never edit the applied file.
- **Gate the studio picker** (`extra-cameras-picker.tsx`, blocker): it's a second client-side `count × rate × days` implementation (line 22, 113) hardcoding "₱30/camera/day." For the flat One rung, render a fixed 1-seat / flat ₱150 card and drop the days multiplier, or in-dashboard it quotes ~₱27,000 while the server charges ₱150.

### PR4 — Wire Pool + One consumption via a fence-safe guest-pool path (⚠ the riskiest build)
> **⚠ Blocker: PR4's draft wording self-contradicts.** To meter Pool, `papic_event_has_flat_pass()` must recognize `PAPIC_GUEST*`, whose only membership is `papic_event_pool_config.pass_service_codes` — but `20270828140000:151-160` **RAISEs** if any `papic_pass_tiers` code (which the `PAPIC_GUEST*` rows are) appears there. Adding them aborts the migration; not adding them leaves `papic_event_points_remaining` returning MAXINT → **Pool ships unmetered (free unlimited shots)** and the 3,000/6,000/10,000 ceilings the whole product is priced on never bind.

- **Add a distinct column `papic_event_pool_config.guest_pool_service_codes`** (or predicate `papic_event_has_guest_pool()`) that recognizes `PAPIC_GUEST*` **and** `PAPIC_CAMERA_MINI_DAY` (One) **without** touching `pass_service_codes` — fence RAISE intact.
- Extend `papic_event_points_remaining` / `papic_reserve_event_points` to read this guest-pool path; wire the guest capture route **and** One's seat gate to `papic_reserve_event_points` through it.
- 409-exhausted contract already exists (`upload/route.ts:428`, `papic/actions.ts:449`, fail-closed `resolvePointsGate`).
- **Go-live gate:** an end-to-end test proving `papic_reserve_event_points` **decrements a Pool event's pool and returns 409 at 0** on a real capture. **Do not flip `PAPIC_GUEST*`/One `is_active` until the meter is observed binding.** A flat price with an unbound meter is an unlimited-capture product.

### PR5 — Free tier to window-total + per-seat reserve (owner confirms 90)
- Seed one `papic_event_point_grants` free grant (90 pts) at event creation; keep 3 seats; **reserve 30 pts/seat** in the capture gate before the first-come remainder (kills the shared-pool 409-race). Update copy in lockstep (`papic-copy-guardrails.test.ts:145`). Reconciles/supersedes the lock's 50 — owner sign-off.

### PR6 — Currency + clip cap (⚠ DEFERRED — coupled to purge + compression, NOT this cycle)
- `PAPIC_POINTS_PER_CLIP` 3→7, `MAX_CLIP_MS` 5000→10000 + RPC bodies + copy + guardrail tests. **Ships only after clip compression (lock §8 item 8) and the purge machinery (lock §8 item 3) land**, because 7pt is cost-fair only at real 6-month retention and 10s ~doubles bytes. Reverses the 5-second hard cap lock in both `CLAUDE.md` files — **do not ship standalone.**

### PR7 (DPO-gated) — Custom-QR consent + Mode gate + minors enforcement
- Attach the **skippable** selfie + two-checkbox (biometric + 18+, default unchecked) consent to the custom-QR claim flow (`source='guest_portal'`/new enum, `consent_source='custom_qr'`, stamp `consent_copy_version`).
- Add `events.papic_face_mode` + guard `embedFaces` at all three capture call sites (Mode B → no embed) + CI assertion + matcher `isDataPrivacyControlActive` enforcement + `face_vectors` observability scrub + prefer on-device match (§3.4).
- **Server-enforce `age_affirmation` on `submitRsvp` + `enrollGuestFace` + custom-QR; force Mode B for christening/debut** (§3.5).
- **Blocked from real-data activation until the DPO deliverables in §7 clear.**

**Sequence:** PR1 (retitles + all collision surfaces, safe) → PR2 (removals + estimator, safe) → PR3 (One flat, owner-gated) → PR4 (fence-safe metering, go-live gated on the binding test) → PR5 (free, owner number) → **PR7 (consent, DPO-gated)** → PR6 (currency, deferred to compression+purge). PR1/PR2 land first (invisible until flip). PR6 does not ship this cycle.

**Migration filename (blocker):** the draft's `20270829xxxxxx` sorts **before** applied migrations `20270830038893` / `20270830256997` → out-of-order push, non-deterministic guard-supersede ordering, deploy failure. **Use `20270831000000_papic_pool_one_rename.sql` or later; re-check `git ls-tree origin/main -- supabase/migrations | tail` at authoring time** since main moves. Respect both RAISEs (`20270828150000:962` duplicate-title, `20270828140000:158` pass-tier fence); supersede applied guard assertions in the new file, never edit applied migrations.

---

## 5. What this supersedes in `Papic_Pricing_Lock_2026-07-20.md`

1. **Per-camera·day pricing for Papic One** → flat **₱150 window-total, 300 pts, 1 seat non-repeatable** (draft's ₱100/500 rejected: below the ₱150 floor + <2× the pass rate).
2. **Papic Max / unlimited tier** → removed (`unlimited` + `roll` deactivated).
3. **"Papic Buong Araw" as a product name** → folded into "Papic Pool."
4. **Per-day point budgets (200/day Mini, 20/day free)** → window-total grants (300 One / 90 free).
5. **Per-event peso caps (₱6,000/₱15,000)** as active controls → inert under flat pricing (columns left dormant; dropping hits a guard trigger).
6. **Free-tier baseline** → 3 seats + **90-pt window grant with 30/seat reserve**, superseding the lock's owner-decided **50** (owner re-confirm).
7. **The 6-month retention framing** → an **access window**, explicitly **not** a deletion promise, until purge machinery ships.
8. **Clip currency** → **held at 3pt/5s** (the lock's own 7pt-at-6-months basis is void without purge); the clip=7/10s change is deferred and re-scoped to the compression+purge build.

Naming crosswalk to record (never-rename, display only): shipped `PAPIC_GUEST*` ("Papic One" titles) → **"Papic Pool"**; shipped `PAPIC_CAMERA_MINI_DAY` ("Papic Mini") → **"Papic One."**

---

## 6. Owner sign-offs (resolved-with-default)

1. **Papic One flat pricing (PR3)** — confirm **₱150 / 300 pts / 1 seat non-repeatable**, grant via dedicated seat-path (not `papic_pass_tiers`), 300 = window total.
2. **Free-tier number (PR5)** — confirm **90 window-total + 30/seat reserve**, superseding the lock's 50.
3. **Currency deferral (PR6)** — confirm clip stays **3pt/5s this cycle**; clip=7/10s (and its 5-second-lock reversal) waits for clip compression + purge.
4. **QR consent defaults** — confirm **custom QR free** (keep `CUSTOM_QR_GUEST` ₱999 as print/seat-pass only); **generic QR = Mode B = zero embedding computed** (not merely zero storage).
5. **Provisional-pricing acknowledgment (R1)** — confirm the paid rungs are **provisionally priced on an unbuilt-purge basis** and will be re-validated once purge + compression land; and that public copy uses **"6-month access window," never a deletion promise,** until then.

## 7. DPO / counsel sign-offs (the face/QR path — blocks real-data GA)

1. **Guest-media ROPA row (gate 0d)** — a Record of Processing for guest-phone-captured **photographs** (existing ROPA row 13 = RSVP prefs, row 11 = biometrics; neither names candid photos). This, not code, keeps `PAPIC_GUEST*` at `is_active=FALSE`.
2. **On-device transient-embedding ruling (bystanders)** — if the Mode-A match is not moved fully on-device (§3.4 step 4), DPO must rule that **transient on-device embedding of non-consenting bystanders, matched then immediately discarded, is defensible**, and the ROPA must document it. "We never stored it" does **not** cover the processing act. Drop the "no stored vector = compliant" framing.
3. **RSVP/consent text (gate 0e)** — copy must explicitly name **guest-phone capture AND face-sorted delivery**; the custom-QR artifact carries the same two gates (biometric + 18+), both default-unchecked, skippable.
4. **`face_enrollment` control disclosure** — deployed `origin/main` `/privacy` must name biometrics as sensitive PI (RA 10173) and offer face-data revocation (`withdrawFaceConsent` exists). Verify the live notice, not a stale local checkout.
5. **Minors standard (blocker for christening/debut)** — server-enforced 18+ on all enrollment paths (§3.5); DPO ruling on whether identifiable-guardian family events force Mode B / a guardian-consent workflow. This is a **ship blocker for those event types**, not an open item.
6. **Paid retention beyond 6 months** — storage-limitation vs. a customer-bought retention dial is DPO-gated and **not yet requested.** 6-month access window (§1.4) is the default; anything longer needs the ruling.
7. **Account-face-profile cross-event reuse (surface as its own gate)** — `account_face_profiles`/`accountSeedsForEvent` reuses a consented profile across **other couples' events** if `NEXT_PUBLIC_ACCOUNT_FACE_PROFILE_ENABLED` flips, contradicting both the "per-event-scoped, never reused" `CLAUDE.md` lock and the per-event consent copy that says "only for this event." Own owner+DPO sign-off; align consent copy before that flag is ever flipped.
8. **Double-lock activation** — even with `NEXT_PUBLIC_FACE_MODEL_URL` set and `/admin/data-privacy` flipped, real-data go-live is the recorded gated event **and requires §3.4 steps 1-5 verified in prod first.**

---

## 8. Residual risks (do not soften)

- **R1 — margin rests on an unbuilt purge (BLOCKER, accepted as a gate).** Every price uses the lock's 6-mo ₱0.023/pt basis, which assumes deletion at window end. No wholesale purge exists, nothing cascades off `papic_photos`, clips are excluded from the only drop path, and the sweep does ~1,000 obj/wk vs 15k–100k obj/event. **After 12–18 months, realized cost accrues perpetually → blended margin drifts below 84–85% each quarter.** Mitigation baked in: clips held at 5s/3pt, prices flagged provisional, "access window" copy. **Not resolved — resolved only when purge + clip compression ship.**
- **R2 — biometric compute/transmission of non-consenting subjects (BLOCKER until PR7 lands + on-device match or DPO ruling).** Today `embedFaces` fires unconditionally and probe vectors reach the server for everyone in frame. A 128-d embedding *is* processing under RA 10173 regardless of retention. Fully closed only when the Mode gate ships, matching moves on-device (or DPO rules transient embedding defensible), and observability scrub lands — all before the env var is set on prod.
- **R3 — minors enrollable via direct POST (BLOCKER until server-side age gate ships).** Client-only 18+ checkbox; `submitRsvp`/`enrollGuestFace` don't read an age field. Christening/debut are full of unmarked minors. Closed by §3.5 server enforcement + forced Mode B for those types.
- **R4 — PR4 metering is the single point where "flat price" could become "unlimited free."** The fence-safe guest-pool path is hand-wired around a guard that blocks the obvious route. If the reserve gate doesn't bind, a ₱500 Pool event shoots unbounded captures and margin inverts. Mitigated by the mandatory binding test before flip — but it is the riskiest build and the last thing to trust.
- **R5 — consent-evidence gap until `consent_copy_version` ships.** Without the version pin, Setnayan cannot prove *what* a guest was shown on a given date if copy changed — informed-consent defect on the whole roster. Closed by §3.3 column.
- **R6 — provisional prices will need a public re-quote.** Because prices are gated on the purge that isn't built, a later margin re-validation may move stickers; communicate as "launch pricing," not a permanent lock.

---

**Files that will change (no `service_code`/`tier_code` moves):** new migration `20270831000000_papic_pool_one_rename.sql` (verify tail of `origin/main` migrations at authoring); `lib/papic-tier-copy.ts`, `lib/add-ons-catalog.ts`, `lib/papic-cameras.ts`, `lib/papic-window.ts`, `lib/papic-pass-tiers.ts`, `lib/face-match.ts`, `lib/sku-activation.ts`, `lib/llms-price-fixture.ts`; `public/llms.txt`; `app/pricing/page.tsx` + `app/pricing/_papic-estimator.tsx`; `app/papic/page.tsx` + `app/papic/guest/page.tsx`; `app/dashboard/[eventId]/studio/papic/actions.ts` + `page.tsx` + `extra-cameras-picker.tsx`; `app/[slug]/redeem/route.ts` + `seat/claim/route.ts` + `app/[slug]/actions.ts`; `app/papic/actions.ts` + `face-enroll-actions.ts`; the three capture components (`papic-seat-capture.tsx`, `papic-guest-capture.tsx`, `booth-capture.tsx`) + `guest-capture/route.ts`; copy + drift guardrail tests (`papic-copy-guardrails.test.ts`, `llms-price-drift.test.ts`). Respect both migration RAISEs; supersede applied guard assertions in the new file; never edit applied migrations.