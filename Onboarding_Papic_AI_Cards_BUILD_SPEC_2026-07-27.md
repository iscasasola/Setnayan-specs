<!-- Owner session 2026-07-27. Owner-decided; build-ready. Supersedes nothing — this is the first spec for the onboarding services step. -->

# Onboarding — the Papic + Setnayan AI step (BUILD SPEC)

> **Owner directive 2026-07-27:** *"all events need Papic and secondary most important is Setnayan AI to help them, the rest are third in importance."* Papic is first **because it is the source that creates their memories**. Add both to **every** onboarding flow.

---

## 0. THE DECISION (owner-locked 2026-07-27)

| | Shape |
|---|---|
| **Papic** | **Switched ON, free.** Every new event finishes onboarding with its free point pool + guest QR already live. Nothing to pay, nothing to click. The card shows what's free and what the upgrade covers. |
| **Setnayan AI** | **Introduced, never given away.** Owner: *"Setnayan AI cannot be free."* The card shows **what it provides them** and routes to the existing purchase surface. |
| **Checkout** | **None in onboarding.** The 2026-06-21 "no paywall in onboarding" lock STANDS. Papic is switched on; AI is introduced and routed. Neither takes payment in the flow. |
| **Scope** | **Papic → ALL 16 types**, all three flows. **Setnayan AI → every type EXCEPT vendor-free ones** (owner 2026-07-27: *"setnayan AI will not be available on simple event since it does not have vendors"*). So `/onboarding/simple` gets a **one-card** step (Papic only). |

### The vendor-free rule — DERIVE it, never name the type

`simple_event` is already marked vendor-free by an existing column: **`SIMPLE_PROFILE.marketplaceEnabled = false`** (`lib/event-type-profile.ts` — *"a vendor-free event whose only purpose is to exercise the in-app Setnayan services"*). The codebase already has a house pattern for this exact exclusion — `lib/papic-event-access.ts:154`: *"this is how `simple_event` is excluded — **for the right reason, not by name**."* Follow it.

**Gate: show the AI card only when `profile.marketplaceEnabled === true` AND the type's tier resolves to a SKU.** Both, because they fail closed on different axes — `marketplaceEnabled` catches a *future* vendor-free type, while the SKU check catches a type with no sellable row. A brand-new type defaults to tier C (which *has* a SKU), so the SKU check alone would wrongly offer it.

✅ **This is already decided in shipped code.** `lib/setnayan-ai-type-pricing.ts` maps `simple_event: 'E'` with the comment *"simple_event = E (no vendors)"*, and `AI_TIER_SKU` states: **"Tier E has no SKU — Setnayan AI isn't present, so there's nothing to charge."** The owner's instruction confirms the existing lock rather than changing it. ⚠ Note the wording in `sku-activation.ts:783` ("free simple_event") is loose shorthand and reads as if tier E were a ₱0 offer — it is **not offered at all**, which is what keeps it consistent with *"Setnayan AI cannot be free."*

### The Papic pitch (owner's words, 2026-07-27)

> *"show what's free but they can upgrade — this covers their memory creation starting X until their event date. Why is this perfect? **Store all your photos as you prepare until your wedding day.**"*

Papic is **not** day-of capture. It is the memory vault for the **entire planning runway** — from the day they create the event until the event date.

### Who shoots into it (owner Q, 2026-07-27: *"vendors too, or just guests?"*)

**Both — from different wallets.** Answered by the shipped architecture and kept:

- **Guests** draw the couple's shared pool (`papic_event_point_grants`). Their shots are the couple's memories, on the couple's budget.
- **Vendors** shoot into their OWN lane (`vendor_papic_captures`) against their OWN gifted budget (50-pt floor scaling to 200 with the booking fee they paid — `lib/vendor-papic-tier.ts`, owner-locked 2026-07-18 / 2026-07-22). **Vendor shots never drain the couple's pool.**

**Why the separation is load-bearing:** the pool is a budget the couple *paid for*. If a photographer's 400 frames drew it down, the couple's guests would hit `camera_points_exhausted` at the reception because a vendor was doing the job they were hired for — the person who paid loses the thing they paid for. Vendor capture is already funded on the vendor side; merging the pools would make the couple subsidize the vendor's portfolio.

**Card copy: "every camera at your event."** Never surface the two-wallet mechanic — it is plumbing the couple must never think about.

⚠ **But not yet.** Vendor capture is **counsel-gated and OFF in prod** — `isVendorPapicCaptureEnabled()` reads the admin Data Privacy control `vendor_papic_capture` (default OFF) and `/api/vendor/papic-capture` 403s until the DPO/NPC ruling. **Until that flips the card says GUESTS ONLY.** Claiming vendor shots today is a promise the code refuses.

---

## 1. WHAT ALREADY EXISTS (do not rebuild — verified 2026-07-27)

### 1.1 Both products are built and live

- Papic studio → `apps/web/app/dashboard/[eventId]/studio/papic/`
- Setnayan AI → `apps/web/app/dashboard/[eventId]/studio/setnayan-ai/`

### 1.2 The wedding flow already HAS these screens — they are switched off

`onboarding-shell.tsx` (4,652 lines) contains a `plan` screen (the "Keep Setnayan AI" card, ~line 4467), a `services` à-la-carte carousel (`papic_seats` · `papic_guest` · `guest_stories` · `thank_you`) and a `summary`. All three are in `PAYWALL_SCREENS` and are **filtered out whenever `EXPERIENCE_QUIZ_ENABLED` is true** (owner 2026-06-21, "no paywall in onboarding").

**That flag is ON in prod** — verified live 2026-07-27: `/onboarding/birthday` → **200**, `/onboarding/notatype` → **404**. So the Papic carousel and the AI card are **dead code on the live wedding funnel**. Nothing sells them today.

### 1.3 The generic flow derives Papic already — and throws it away

`lib/onboarding/persona-packs.ts` authors `servicesByPersona` per event type with `papic_seats` / `papic_guest` across birthday, debut, gender_reveal, christening and more. `generic-onboarding.tsx` computes `planServices` and passes it to commit — **it is never rendered.** The couple never sees the word Papic.

~~🚨 **`style_preferences.interested_services` is WRITE-ONLY.**~~ ✅ **CLOSED 2026-07-29 (#3873).** Written by 3 onboarding files and read by zero since PR #2137 — it now has one reader: the services step ORDERS the two Papic products by the persona's derived list (`papic_guest` → Pool, `papic_seats` → One). Presentation only, deliberately: both products always render at their real prices, because a derived guess may change what a couple reads first but must not change what they are offered.

### 1.4 The Setnayan AI benefit list is already written — REUSE IT

`studio/setnayan-ai/_components/setnayan-ai-value.tsx` exports `SetnayanAiValue` with **`mode="preview"` — the pitch mode, exactly what an onboarding card needs.** Nine wired capabilities in 3 groups (every row is a running capability; owner rule "no fake doors"):

| Group | Capabilities |
|---|---|
| **Finds the right people** — *turns the whole vendor directory into a shortlist made for your day* | Ranks every vendor by how well they fit · Sorts by distance to your reception · Sends your first inquiry to the best fit |
| **The quiet secretary that never loses the thread** | Tracks every deadline for you · Chases the vendors who go quiet · Tells you the one thing to do next |
| **Practically impossible to keep by hand** | Flags a payment before it's due · Warns you before you go over budget · Notices when someone eyes your date |

**Do NOT author new AI copy.** Mount the component.

### 1.5 The window model already does what the owner wants

`lib/papic-window.ts` · `resolvePapicWindow()`, anchored (non-travel) branch: the end is **pinned to `event_date`**, and the start **may extend arbitrarily far back** — the only rule is `start ≤ event_date`. A couple 14 months out can start today. ✅

**A longer window costs nothing.** The window is explicitly **not a price input** — Papic is flat per camera (`cameras × rate`; the per-day bill engine was retired 2026-07-22). So *"store everything from today until your wedding day"* is **free to promise and true**.

---

## 2. BLOCKERS — fix before or with the cards

### 2.0 ⛔ SUPERSEDED 2026-07-29 — the owner put the Pool BACK ON SALE. Read §2.0-NEW first.

> **🔄 THIS SECTION IS HISTORY. Do NOT build from it.** On **2026-07-29** the owner locked the **Papic two-type model** in a separate prototype session (`DECISION_LOG.md` row 2026-07-29 · prototype artifact `de2cf612`), which **explicitly supersedes both** this section's "Pool is not sellable" conclusion **and** the 2026-07-22 GA guardrail #2 it rested on. The owner priced the Pool rungs for sale **knowingly**; the R1 storage risk now rides on the paid rungs. The analysis below was correct on 2026-07-28 and is kept only so nobody re-derives it.

### 2.0-NEW 🔒 THE PAPIC MODEL — owner-locked 2026-07-29 (BUILD FROM THIS)

Two types. Both meter the same event point pool primitives; what differs is whether the shots are **shared** or **dedicated**.

| | **Papic Pool** — shared | **Papic One** — dedicated |
|---|---|---|
| Cameras | **unlimited**, any guest phone via the event QR | one physical camera, **its own QR** |
| Shots | **shared** across everyone | **dedicated**, unshared |
| Free tier | **50 pts** (already armed — PR1) | **ONE free camera with 5 pts** ⬅ *new mechanic, NOT built* |
| Paid rungs | **+3,000 pts ₱1,000** · **+6,000 pts ₱2,000** · **+10,000 pts ₱3,000** | per camera: **50 pts ₱50** · **100 pts ₱100** |
| Rule | volume buy | flat **₱1 = 1 shot** (~3× Pool's per-point rate — you pay for the guarantee) |

- **Reload: YES.** Owner: *"yes they can reload."* The same One rungs top up an **existing** camera, including the free one. **No new QR mid-event.**
- **No seat cap.** Owner: *"they can also buy as many seats as they want."* Unlimited One cameras per event.
- **Point currency: 1 photo = 1 pt · 10-second clip = 8 pts.** ⚠ The shipped constant is **`PAPIC_POINTS_PER_CLIP = 7`** (`lib/papic-cameras.ts:735`) — the lock raises it **7 → 8** on the **fail-closed capture path**, so it ships as its own isolated PR (same "must ship alone" lineage as the 5s→10s change). An interim "photo = 10 pts" was floated and **withdrawn** — it made the free One camera unusable and priced video below photos.

**What this supersedes:** the inactive ₱999/₱1,999/₱2,999 charm rows (→ round ₱1,000/₱2,000/₱3,000), the flat `PAPIC_CAMERA_MINI_DAY` ₱100 = 250 pts (→ ₱1 = 1 shot), the 2026-07-22 guardrail #2, and this spec's own §2.0 below.

**Card 1's upgrade line may now offer the Pool** — that was the open question on 2026-07-28 and it is answered.

<details>
<summary>§2.0 (2026-07-28) — the superseded "Pool is not sellable" analysis, kept for lineage</summary>

**Discovered 2026-07-28 while building PR2. This decided what Card 1's upgrade line could say — until the 2026-07-29 lock reversed it.**

All four Papic Pool rungs — `PAPIC_GUEST` (₱999 / 3,000 shots), `_6K` (₱1,999), `_10K` (₱2,999), `_TOPUP` (₱2,999) — are **`is_active = false`** in the live catalog, and `fetchV2CustomerCatalog()` filters `.eq('is_active', true)`. Worse, `fetchPapicPassTiers()` is read by **exactly one module — `lib/sku-activation.ts`** — i.e. only to convert an *already-paid* order into points. **No UI reads it.** There is no surface anywhere in the app that sells a Papic Pool.

**This is deliberate, not a bug.** `Papic_One_Pool_Model_Spec_2026-07-22.md` guardrail #2: *"**Do not GA the paid rungs** on the 6-mo cost basis until the purge machinery **and** clip compression actually ship; treat current prices as **provisional**."* Residual Risk R1 is logged as *"Not resolved — resolved only when purge + clip compression ship."*

**Therefore the only purchasable Papic upgrade today is `PAPIC_CAMERA_MINI_DAY` — "Papic One", ₱100 per camera, 250 dedicated points each** (owner override 2026-07-23: One's points are dedicated to that camera + its own QR, never pooled).

**Card 1's upgrade line must offer Papic One and nothing else.** Naming the Pool would be a fake door — the couple cannot buy it at any price. Revisit when purge + compression land.

⚠ Separately noted, **not fixed here:** `resolveRetailChargeCentavos()` selects by `service_code` **without** filtering `is_active`, so the charge path would still price a retired SKU that the display path hides. That is the known catalog-`is_active` trap; it is pre-existing and out of scope for this spec, but it means "invisible in the UI" is not the same as "cannot be ordered". **(Still true and still unfixed after the 2026-07-29 lock.)**

</details>

### 2.1 🚨 The onboarding Papic map points at RETIRED SKUs

`INAPP_TO_SERVICE_CODE` (onboarding-pricing.ts) maps `papic_seats → PAPIC_SEATS` and `papic_guest → PAPIC_GUEST`. **Both are `is_active = false` in prod**, as are `PAPIC_GUEST_6K` / `_10K` / `_TOPUP`.

Live Papic catalog (verified 2026-07-27):

| Code | Title | Price | Active |
|---|---|---|---|
| `PAPIC_CAMERA_MINI_DAY` | Papic One | ₱100 / camera | ✅ |
| `PAPIC_ADDON_STORIES` | Stories (Papic Add-on) | ₱2,000 | ✅ |
| `PAPIC_ADDON_THANK_YOU` | Thank You (Papic Add-on) | ₱2,499 | ✅ |
| `PAPIC_SEATS` · `PAPIC_GUEST` · `_6K` · `_10K` · `_TOPUP` | — | — | ❌ |

The 2026-07-21 fix correctly zeroes price + label + market anchor for an inactive SKU, so **every Papic card renders BLANK today.** Remap to the [One-Pool model](0012_papic/Papic_One_Pool_Model_Spec_2026-07-22.md) — Free 50-pt pool · Papic One ₱100/camera — **before** the card ships.

### 2.2 🚨 The unbuilt 120-day clamp would KILL the pitch

`Papic_One_Pool_Model_Spec_2026-07-22.md` §1.4 proposes clamping the start to `max(requested, event_date − 120)`. **It is not built** (verified: no lower bound exists in `papic-window.ts`).

**If anyone builds it, the owner's core promise dies** — a couple planning 14 months out gets cut to the last 4 months, and *"store all your photos as you prepare"* becomes false. **AMEND OR KILL §1.4's start-clamp.** The `+60` end extension in the same section is independent and may still proceed.

### 2.3 ⚠ The AI capability copy is wedding-only

`GROUPS` in `setnayan-ai-value.tsx` is a static const. One body hardcodes *"your PH marriage paperwork — license, Pre-Cana, PSA"*. `eventWord` only templates two closing sentences. **Mounted as-is on a birthday, it promises Pre-Cana tracking for a birthday.** That row must become type-aware or be dropped for non-weddings.

### 2.4 ⚠ Free Papic is provisioned LAZILY

`provisionFreeCamerasAdmin` fires only when someone first opens `/dashboard/[eventId]/studio/papic` (page.tsx:318). "On from onboarding" is a **real behaviour change**, not a display change. Prod `papic_event_point_grants` is **empty (0 rows)** — nothing to migrate.

### 2.5 🚨 THE FREE POOL IS NOT WIRED — free Papic is currently UNMETERED

**This is the most important finding, and it gates the whole feature.** Traced through the live DB 2026-07-27:

- `papic_event_pool_status(event_id)` — *"Applies when a flat pass exists (legacy) OR the event holds ANY grant (Free / One / Pool). **No grant + no pass → fence absent.**"*
- `papic_reserve_event_points(...)` — *"Fence absent (non-pass event) → **RETURN TRUE**, ledger untouched."*
- `provisionFreeCamerasAdmin` creates the 3 free seats (`seat_index` 100–102, `tier='free'`) **but inserts NO grant row.**
- Prod `papic_event_point_grants` = **0 rows, all sources.**

**So an event on the free tier has no fence at all: capture is UNCAPPED.** The owner's 2026-07-22 "Free = 50-pt pool" lock is **designed and half-built but never armed** — the DB branch explicitly names "Free", and nothing ever writes the row.

**Why this blocks the cards:** the plan is to switch Papic on for *every* new event across *all 16 types*. Doing that while free is unmetered hands every signup **unlimited free photo + video storage** — a cost that scales directly with growth, on a product whose storage sustainability is already an open concern, and with 10s clips at ~2× the bytes and no compression or purge built.

The card also cannot honestly say anything today: **"50 free shots"** is a figure the meter won't enforce, and **"unlimited"** is an accident, not an offer.

**➡ Wiring the free grant is PROMOTED to PR1 and is a hard prerequisite.** Insert one `papic_event_point_grants` row (`source='free_grant'`, the locked free points) at event commit. Nothing to migrate — prod is empty. Confirm the point count against `Papic_One_Pool_Model_Spec_2026-07-22.md` §0 (50) before printing it; `papic_tier_config.free.points_per_day` is NULL and is not the source.

---

## 3. THE CARDS

One shared component, `app/onboarding/_shared/services-step.tsx`, mounted by all three flows. Placed **after** the persona reveal / plan and **before** `congrats`. Papic always renders; the AI card renders only when the vendor-free gate in §0 passes — so the step is **two cards** on the 15 vendor-bearing types and **one card** on `simple_event`.

⚠ `/onboarding/simple` is **not** a multi-screen wizard — it's a single server-rendered name+date form (`app/onboarding/simple/page.tsx`, 112 lines). "Adding the step" there means adding the Papic card to that page, not inserting a screen. Its own copy already promises *"everything else is Setnayan's in-app services"* and then offers none — this closes that.

### Card 1 — Papic (first; it creates the memories)

- **Headline:** the runway promise — *store every photo as you prepare, right through to the event day.*
- **What's free:** the point pool + guest QR, live now. State the real number only once §2.5 is settled.
- **What the upgrade covers:** more points, dedicated cameras (Papic One ₱100/camera). Frame as *more of the same thing*, never as a locked door.
- **The window:** from today → their event date. True per §1.5, free per §1.5.
- **Who shoots:** guests. Add vendors **only** when §0's DPO gate flips.
- **Action:** none. It is already on. The card informs.

### Card 2 — Setnayan AI (second; it helps them · **hidden on vendor-free types**)

- **Gate first** — `profile.marketplaceEnabled === true` AND the tier resolves to a SKU (§0). On `simple_event` this card does not render at all. Every one of its nine capabilities is about vendors (rank them, route the first inquiry, chase the quiet ones, flag their payments) — on a vendor-free event it would be a fake door, which the codebase forbids.
- Mount `<SetnayanAiValue mode="preview" eventWord={…} />` — do not re-author (§1.4).
- Fix the wedding-only row first (§2.3).
- **Price:** read live. Active row = flat `SETNAYAN_AI` **₱1,499**. Per-type tiers `SETNAYAN_AI_B/C/D` (₱899 / ₱499 / ₱99) exist but are **all `is_active = false`** and ride a separate flag through `resolveSetnayanAiTypeChargeCentavos`. Never hardcode.
- **Action:** route to `/dashboard/[eventId]/studio/setnayan-ai`. **No checkout in the flow.**

---

## 4. BUILD SEQUENCE

**Status verified against live prod + `origin/main` on 2026-07-29. Do not re-derive — re-verify only if the dates look stale.**

| PR | What | State |
|---|---|---|
| **1** | Arm the free pool (§2.5) — `free_grant` row at event commit, all 5 insert paths + a self-heal on the Papic studio. | ✅ **DONE + LIVE** — PR [#3847](https://github.com/iscasasola/setnayan-platform/pull/3847), migration reissued as `20271017567807` via [#3848](https://github.com/iscasasola/setnayan-platform/pull/3848) after a twin-prefix collision. **Verified in prod:** index `papic_event_point_grants_one_free_per_event` exists · 2 events × 50 pts · `papic_event_pool_config.free_grant_points = 50`. |
| **1b** | Grant reads the **admin-editable** allowance, not a hardcoded 50; 3 duplicate constants → 1. | ✅ **DONE** — PR [#3860](https://github.com/iscasasola/setnayan-platform/pull/3860) merged. |
| **3** | `SetnayanAiValue` type-aware — the PH-marriage / "another couple" / "reception" wedding-isms (§2.3). | ✅ **DONE** — PR [#3865](https://github.com/iscasasola/setnayan-platform/pull/3865) merged. |
| **NEW-A** | 🔴 **Catalog migration for the 2026-07-29 model** — reactivate + reprice the Pool rungs to ₱1,000 / ₱2,000 / ₱3,000; restructure Papic One to ₱1 = 1 shot (50 pts ₱50 · 100 pts ₱100); add the **reload** path and the **1 free One camera @ 5 pts**. | ⛔ **NOT STARTED** — the new first step. Everything below depends on it. |
| **2** | Remap `INAPP_TO_SERVICE_CODE` (§2.1) so the cards stop rendering blank. | ⛔ **NOT STARTED** — was blocked on "what is the live upgrade?", which §2.0-NEW now answers. Do it **after NEW-A**, against the reactivated codes. |
| **NEW-B** | Clip currency **7 → 8 pts** (`PAPIC_POINTS_PER_CLIP`, `lib/papic-cameras.ts:735`). | ⛔ **NOT STARTED** — **ships ALONE**: it is a hardcoded constant on the **fail-closed capture path**. Independent of the cards; do not bundle. |
| **4** | `services-step.tsx` — the two cards. Mount in `/onboarding/[type]` first (14 types, biggest gap). | ✅ **DONE** — PR [#3873](https://github.com/iscasasola/setnayan-platform/pull/3873), shipped **flag-dark** behind `NEXT_PUBLIC_ONBOARDING_SERVICES_STEP`. Built to the prototype (artifact `de2cf612`), restyled in the app's own design system. |
| **5** | Mount in `/onboarding/wedding` (before `congrats`; do **NOT** un-filter `PAYWALL_SCREENS` — the lock stands) and `/onboarding/simple` (**Papic card only** — the AI gate hides card 2). Give `interested_services` its first reader (§1.3). | ✅ **DONE** — same PR [#3873](https://github.com/iscasasola/setnayan-platform/pull/3873). `PAYWALL_SCREENS` untouched. `interested_services` now ORDERS the two Papic products (presentation only — both always render). |
| **—** | Amend or kill the §1.4 start-clamp (§2.2). | ✅ **Treated as dead** — the owner's 2026-07-27 runway directive supersedes the unbuilt 2026-07-22 proposal. Just don't build a lower bound. |
| **—** | Vendor shots in the card copy. | ⛔ **DPO/NPC gate** — `vendor_papic_capture` control is OFF and the route 403s. Card says **guests only** until it flips. |

**Order: NEW-A → 2 → 4 → 5.** ✅ All four landed (NEW-A = #3868/#3869 · 2 = #3872 · 4 + 5 = #3873).
**NEW-B (clip 7 → 8) is the only card-adjacent row left** — independent, ships alone.

⚠ **The owner's remaining action is a FLAG FLIP**, not a build: set
`NEXT_PUBLIC_ONBOARDING_SERVICES_STEP=true` in Vercel **and redeploy** (NEXT_PUBLIC_ vars are
build-time inlined, so a bare env change does nothing). Until then all three flows render
exactly as they did before #3873.

---

## 5. OPEN — owner / counsel

1. ~~Confirm the free point number~~ ✅ **ANSWERED 2026-07-27: 50.** Armed and live; `papic_event_pool_config.free_grant_points` is now the admin control.
2. **DPO gate on vendor capture** (§0) — until it flips, the card says guests only. *(Still open.)*
3. ~~Card 1's free line must describe BOTH free things~~ ✅ **ANSWERED + SHIPPED** (#3873). Both rungs render, each read from its own admin column — `free_grant_points` for the shared Pool, `free_one_camera_points` for the dedicated camera. A zeroed column removes its rung rather than promising a camera the meter never mints. The free-camera COUNT is structural (one per event, `papic_ensure_free_one_camera` + two unique constraints) and lives in ONE place: `PAPIC_FREE_ONE_CAMERA_COUNT`.

**Treated as already answered — not re-asked:** the §1.4 `event_date − 120` start-clamp (§2.2) is **dead**. The owner's 2026-07-27 directive — *"starting X until their event date … store all your photos as you prepare"* — supersedes an unbuilt 2026-07-22 proposal that contradicts it. PR1 must not introduce a lower bound.
