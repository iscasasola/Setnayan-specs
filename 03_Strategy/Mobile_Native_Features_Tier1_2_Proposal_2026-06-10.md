# Mobile Native Features — Tier 1 + Tier 2 Proposal

> **Status: PROPOSAL · audit-first · NO code · Phase 2 / V1.5+.** Drafted 2026-06-10.
> Seven native-mobile features that maximize new device tech, lean on Setnayan's existing moats
> (Papic produced-output layer · day-of-guest · GCash-PH · no-expiry · privacy), and degrade
> gracefully to the browser. **Nothing here is in V1 scope.** Four decisions need owner sign-off (§5).

---

## 0. The one fact that shapes everything

Setnayan's app is a **Capacitor remote-URL shell** — the native app loads the hosted `www.setnayan.com`
inside a native WebView (per `0052_native_apps_delivery` § 2 + `project_setnayan_native_shell_capacitor`).
Papic is the one piece slated to become a **true-native** binary launched via deep-link.

Consequence: **"app-exclusive" is automatic** for anything hardware-bound (a browser can't touch it), **but the
WebView shell can't touch it either** unless we (a) wrap it in a **Capacitor plugin** or (b) ship the
**true-native Papic module**. So the question isn't "is it exclusive" — almost all of it is. It's
*"which native capability is worth a plugin, given the PH wedding market."*

The design pattern for every feature below is the same: **native-enhanced inside the app · flat fallback in the browser** — exactly the "graceful-degrade, never forced-install" principle in the app-linking contract (`0052 §16`).

> ⚠ **Naming collision, read first:** "Apple Wallet / Google Wallet pass" (feature #5) is the phone OS's
> pass holder (boarding-pass style). It is **NOT** the retired Setnayan customer **token wallet** (iteration 0003,
> retired 2026-05-11). The "NO wallet UI" guardrail refers to the token wallet and is **not violated** by #5.

---

## 1. Audit baseline (what's real today, 2026-06-10)

| Host surface | Spec | Built? | Implication for this proposal |
|---|---|---|---|
| **Native shell** (0052, Capacitor 7) | Locked V1.5+ | 🟡 Android scaffold + deep-link intent-filters shipped (PR #1044/#1048); **iOS NOT generated** (needs Xcode); Tauri desktop not started | iOS-exclusive features (App Clips, Live Activities, native depth) are gated on the iOS build |
| **Native Papic** (0012) | Locked V1.5+ | ⚠ **Web slice only**; native iOS/Android = **zero code** | The host for on-device face, P2P mesh, depth capture, NFC-tag. The biggest gating dependency. |
| **Guest QR + join** (0000/0002) | Shipped | ✅ `guests.qr_token` (32-hex) · `event_join_tokens` · `tables`/`seating_charts` (0008) | App Clips / NFC / Wallet passes plug straight into this |
| **`.well-known` deep-link scaffolds** | — | ✅ `assetlinks.json` + `apple-app-site-association` exist, **but no URL prefixes wired** | Universal Links / App Links are half-plumbed — finish here |
| **Day-of-guest** (0031) | Locked (6 cards) | ⚠ PWA Phase 1 = couple-dashboard cards only; **guest LIVE single-scroll page + offline PWA shell NOT built**; mode router simplified to 3-state | Host for Live Activities; needs the guest LIVE page finished |
| **Face enrollment** (0012) | Locked (schema, 128-d vector, 3 sources, 0.85/0.65 tiers) | ❌ **schema not shipped** | Host for on-device face clustering — schema lands first |
| **P2P mesh + offline queue** (0052/0012) | Locked (MultipeerConnectivity / Nearby Connections; SQLite WAL, 7-day TTL) | ❌ not built | Scoped as a Capacitor plugin already; hardest of the 7 |
| Wallet / NFC / Live Activities / App Clips / depth-LiDAR | — | ❌ **all greenfield**, no collisions | Clean slate |

---

## 2. The seven features

Each: *what it is (plain English) · the user win · how it maps to what we have · native/web split · dependency · effort (Claude Code time + calendar-bound externals) · key risk/decision.*

### Tier 1

#### T1-1 · App Clips (iOS) / Instant Apps (Android) for guest capture
- **What it is.** A "try without installing" mini-app. A guest scans the table/event QR and gets the Papic capture experience instantly — no App Store download, no account.
- **User win.** Removes the single biggest drop-off at a wedding: "install our app, now, on venue wifi." This is the purest expression of the "never forced-install" principle.
- **Maps to.** The existing scan-to-join + `guests.qr_token` flow (0000/0002) and the half-wired `.well-known` deep-link scaffolds. The App Clip/Instant App just opens a **stripped guest-capture web experience** we already have (the Papic web slice) and offers "get the full app" afterward.
- **Native/web split.** App Clip/Instant App is native-only; the browser already does the same job via the web slice — so this is a *polish* on an existing fallback, not a new capability.
- **Dependency.** iOS App Clip target needs the **iOS shell** (not built). Android Instant App can proceed on the built Android scaffold.
- **Effort.** Claude Code: deep-link routing + stripped capture entry = ~days; native wrappers ~days each. Calendar-bound: App Store / Play review, Associated-Domains entitlement, 10 MB App Clip size budget.
- **Risk/decision.** Android-Instant-App-first (shell exists) vs wait for iOS parity. See §5.

#### T1-2 · On-device face clustering & tagging
- **What it is.** Group photos by who's in them, computed **on the phone** — faces never leave the device; only the resulting tags sync.
- **User win + moat.** A genuine **RA 10173 privacy headline** ("your guests' faces never touch our servers"), it works **offline** at the venue, and server inference cost is **zero**. Privacy is a top-protection class for us (`behavioral_data_edge`), so this is marketing *and* margin.
- **Maps to.** The locked-but-unbuilt `face_enrollments` schema (0012: 128-d vector, sources `rsvp_profile`/`guest_portal`/`checkin_kiosk`, 0.85 auto / 0.65 suggest tiers) and the existing `photo_tags` write path. We ship the schema, then a native ML plugin (Apple Vision / Android ML Kit) does clustering locally and only writes **tags** (not vectors) to the server.
- **Native/web split.** On-device clustering is native-only. Browser falls back to the spec'd server-side path (or no auto-tag) — honest degradation.
- **Dependency.** Native Papic (not built) + face schema (not built).
- **Effort.** Claude Code: schema migration + tag-write = ~1–2 days; native plugin + on-device clustering = ~weeks (the real work). Calendar-bound: real-device testing across PH-common Android models.
- **Risk/decision.** On-device (privacy moat, harder, native-only) vs server-side (easier, contradicts the pitch). See §5.

#### T1-3 · Local peer-to-peer mesh sync
- **What it is.** Paparazzi phones pass photos to each other directly over a local radio link, so captures survive and spread even when the venue wifi/cell is dead, then upload opportunistically when a connection returns.
- **User win.** PH venues are notorious for weak signal; this solves a real day-of failure mode **no competitor solves** (`papic_competitive_strategy`).
- **Maps to.** Already scoped as a Capacitor plugin in `0052 §4/§5` (MultipeerConnectivity / Nearby Connections) and the `0012` offline SQLite-WAL queue (7-day TTL, exponential backoff).
- **Native/web split.** Native-only (no Web API). Browser falls back to the plain offline-queue + retry.
- **Dependency.** Native Papic (not built).
- **Effort.** Claude Code: sync/dedup/conflict protocol + plugin = ~weeks (**hardest of the seven** — distributed state). Calendar-bound: multi-device venue testing.
- **Risk/decision.** Full mesh (hard) vs offline-queue-only (covers ~80% of the pain for a fraction of the cost). See §5.

#### T1-4 · Live Activities / Dynamic Island (iOS) + Live Updates (Android 16)
- **What it is.** A live, glanceable card on the lock screen / Dynamic Island during the event: *"142 photos captured · livestream LIVE · up next: First Dance."*
- **User win.** Turns the day-of-guest surface (0031) into an ambient, always-visible companion — high delight, drives re-engagement back into the gallery and livestream.
- **Maps to.** The 0031 LIVE cards (segment + countdown, live photo wall, live schedule, coordinator broadcast). Coordinator-broadcast (a coordinator-role action) and segment changes are the natural update triggers.
- **Native/web split.** Native widget is iOS/Android-only; browser shows the normal LIVE page.
- **Dependency.** iOS shell (not built) for the iOS widget; the **guest LIVE page itself isn't finished** (0031), so that lands first either way.
- **Effort.** Claude Code: finish guest LIVE page + push-driven state updates = ~days; native Live Activity widget = ~days. Calendar-bound: APNs Live-Activity push tokens.
- **Risk/decision.** Updates must be **push/event-driven, not polled** — we are cron-free (`project_setnayan_cron_free`); drive from event-state changes via `after()`/`waitUntil`, never a scheduler.

### Tier 2

#### T2-5 · Apple Wallet / Google Wallet passes
> **📄 Deep-spec'd 2026-06-10 → [Wallet_Passes_Deep_Spec_2026-06-10.md](Wallet_Passes_Deep_Spec_2026-06-10.md)** (implementation-grade; 5 owner decisions in its §13).
- **What it is.** The guest adds their **invite QR + table assignment** to their phone's Wallet — surfaces automatically by time/location at the venue, works fully offline.
- **User win.** Best-in-class day-of UX: no email-digging for the QR; the pass *finds them* when they arrive. Couples love the polish.
- **Maps to.** Server-generates a pass from `guests.qr_token` + `table_id` (0008). An "Add to Wallet" button on the personal landing page (0002).
- **Native/web split.** **Least gated of all seven** — "Add to Wallet" is a signed file / browser deep-link that works from the **mobile browser** on both platforms, *no native shell required.* This is why it's a strong early pick despite being Tier 2.
- **Dependency.** None on our native shells. Needs **owner-side credentials**: Apple PassType-ID cert + Google Wallet API enrollment.
- **Effort.** Claude Code: pass templates + signing + button + pass-update push = ~days. Calendar-bound: certificate/API enrollment (owner ops, ~days).
- **Cross-actor.** Couple issues → guest adds → admin/coordinator can **push a pass update** (e.g., table change, time change) — pass updates are the day-of "broadcast" in physical form. RA 10173: pass holds only QR + table, no sensitive PII.

#### T2-6 · Depth / subject-aware capture for reels
- **What it is.** Two halves. (a) **Subject-aware 9:16 crop** — the reel keeps the people centered instead of a dumb center-crop. (b) **Depth bokeh** — portrait-style background blur on candid clips.
- **User win.** Makes our **owned-music template reels** (the produced-output moat) visibly more premium than a flat crop — a direct quality lever on the thing competitors can't copy.
- **Maps to.** The template-driven 9:16 render pipeline (0012 personal reels / Auto-Recap).
- **Native/web split.** (a) Subject-aware crop can run **on-device ML or even server-side** — *largely ungated, ships early.* (b) Depth bokeh needs native capture (AVFoundation portrait / Camera2 depth) — gated on native Papic.
- **Dependency.** (a) none / minimal; (b) native Papic.
- **Effort.** Claude Code: subject-aware crop in the renderer = ~days; depth-capture plugin = ~weeks (gated).
- **Risk/decision.** Could be a premium reel tier (SKU) — **owner to price, do not invent.**

#### T2-7 · NFC tap-to-tag / tap-to-join
- **What it is.** An NFC sticker on each table; a guest **taps** instead of scanning a QR to join the event or tag a photo to that table.
- **User win.** Marginally faster than QR for some guests; a tactile "premium venue" touch. **Complements QR, does not replace it.**
- **Maps to.** Same join/tag routes QR already drives (0000/0002/0012 table-QR tagging).
- **Native/web split.** **Partial browser support** — Android Chrome has **Web NFC**, so an Android-only tap-to-join pilot can ship *without* the native shell. iOS NFC read needs the native shell + a plugin.
- **Dependency.** iOS: native shell. Android: Web NFC works in-browser today. **Owner ops:** buying + programming physical NFC stickers.
- **Effort.** Claude Code: NDEF read handler → existing routes = ~days. Calendar-bound: physical-tag procurement/programming (owner ops).
- **Risk/decision.** Is the owner willing to produce/program physical table stickers? See §5.

---

## 3. Effort vs payoff + recommended sequencing

| # | Feature | Payoff | Claude Code effort | Gating dependency |
|---|---|---|---|---|
| T2-5 | Wallet passes | High (day-of) | Low–med | **None** (web deep-link) |
| T2-6a | Subject-aware reel crop | Med–high (moat) | Low–med | None / minimal |
| T1-1 | App Clips / Instant Apps | **High** | Med | iOS shell (Android can go now) |
| T1-4 | Live Activities / Live Updates | High (delight) | Med | guest LIVE page + iOS shell |
| T2-7 | NFC tap | Med | Low–med | iOS shell (Android Web NFC now) |
| T1-2 | On-device face clustering | **High** (privacy moat + margin) | High | native Papic + face schema |
| T2-6b | Depth bokeh | Med | High | native Papic |
| T1-3 | P2P mesh | Med–high (PH wifi) | **Highest** | native Papic |

**Recommended order — three waves keyed to real dependencies:**

- **Wave 0 — ship before either native shell (web + browser deep-link):** Wallet passes (T2-5) · subject-aware reel crop (T2-6a) · Android-only Web-NFC tap-to-join pilot (T2-7 partial). These prove value with the least blockers.
- **Wave 1 — after the iOS Capacitor shell builds (finish 0052 iOS):** App Clips / Instant Apps (T1-1) · Live Activities / Live Updates (T1-4, after the 0031 guest LIVE page is finished).
- **Wave 2 — after native Papic ships (0012 V1.5):** on-device face clustering (T1-2) · depth bokeh (T2-6b) · P2P mesh (T1-3, last — hardest).

> **Per `feedback_setnayan_claude_code_timeline_units`:** effort is Claude Code time (hours/days/weeks), not engineer-months. The *calendar* gates are the externals — App Store / Play review, Apple/Google Wallet credential enrollment, real-device testing across PH Android models, and owner-side NFC-tag ops — and those, not coding time, set the real timeline.

---

## 4. Cross-actor wiring (architect mandate)

These are mostly **guest + couple + coordinator** features (event-day surfaces); vendors are largely uninvolved — stating that honestly rather than forcing a vendor touchpoint.

- **Admin/governance:** deep-link + Associated-Domains config and App-Clip/Instant-App analytics live in the admin console (0023); face-data revocation already exists in Settings → Privacy & Data (0025) and must cover on-device vectors; Wallet-pass revocation/update is an admin/coordinator action.
- **Coordinator:** Live Activities updates and Wallet-pass updates are the physical form of the existing coordinator-broadcast (0031).
- **Couple:** issues Wallet passes, shares the App-Clip/NFC entry, owns the gallery the reels render into.
- **Guest:** the primary actor for all seven.

---

## 5. Decisions pending owner sign-off

1. **Platform order for the gated waves.** Android shell is built; iOS is not — yet the marquee items (App Clips, Live Activities, native depth/NFC) are richest on iOS. Do we **fund the iOS Capacitor build first**, or ship the Android-native equivalents (Instant Apps, Live Updates, Web-NFC) while iOS catches up?
2. **On-device vs server face recognition.** On-device is the privacy moat + zero inference cost but is native-only and harder; server-side is easier but undercuts the "faces never leave your phone" pitch. Which do we commit to?
3. **P2P mesh: full build or offline-queue-only?** The mesh is the hardest of the seven; an offline-queue + opportunistic upload covers most of the venue-wifi pain for a fraction of the effort. UX-best is the mesh; pragmatic-best may be the queue.
4. **NFC physical-tag ops + any new SKUs.** Is the owner willing to produce/program physical NFC table stickers? And are any of these paid tiers (premium depth reels, a Wallet-pass add-on) vs included? **Prices owner-to-set — none invented here.**

---

## 6. App-store fee strategy — payments stay off-platform

> Added 2026-06-11. Plain-English rule: **app stores only take a cut when money flows through *their* checkout, and only for *digital* goods.** The one rule that keeps Setnayan at 0%: **collect every payment on the web (the apply-then-pay GCash/BDO flow), never through in-app billing.**

### 6.1 The fee landscape (2026)

| Platform | Standard | Small biz / <$1M | Subscriptions |
|---|---|---|---|
| Apple App Store | 30% | 15% (Small Business Program) | 30% yr 1 → 15% after 12 months |
| Google Play | 30% | 15% on first $1M/yr | 15% → **20% one-time / 10% subs** from 30 Jun 2026 (US/UK/EEA), global by Sep 2027 |

- **Exempt at 0% — and *forbidden* from using in-app billing:** physical goods + real-world services. Stores require external payment for these.
- The "just link out to your website to pay for digital goods" escape hatch is **US-only** (Epic v. Apple). It does **not** apply in the Philippines yet.

### 6.2 Where Setnayan's catalog sits

| Bucket | Examples | Store can tax it? |
|---|---|---|
| **Real-world wedding services** | vendor bookings, Papic, Panood, planning, printed QR cards | **No — exempt (0%)**, even in-app. Vendor↔customer money is off-platform anyway (RA 11967). |
| **First-party digital SKUs** | couple-side Setnayan AI, Animated Monogram, digital templates, AI highlight | Only if sold through in-app billing |
| **Vendor recurring digital** | **Pro / Enterprise subscriptions on 28-day + 1-year cadences** (owner-confirmed 2026-06-11) **+ vendor token packs** | Only if sold through in-app billing — **but this is the single largest exposure**: subscriptions + in-app currency are the textbook IAP categories, and the revenue is recurring + high-value |

Only the bottom two buckets are taxable at all, and only if the **checkout itself** runs through the store.

### 6.3 The rule (design once, applies everywhere): buy on the web, app only authenticates

Outside payment for digital goods is **explicitly permitted** — Apple's own guideline **3.1.1** states you *may* let users buy digital goods outside the app for use in the app, **provided the app does not promote, advertise, or link to those external payment options.** This is the standard, decade-old "Netflix / Spotify" pattern — not a loophole. (Netflix removed in-app signup in 2018 and has never been penalized.)

- **Vendors** subscribe (28-day or annual) and buy token packs **on the web vendor dashboard** via GCash/BDO. A future native vendor app just lets them **sign in** with the subscription they already own — it never *sells* it in-app, so there's no IAP and no commission.
- **Couples** buy the AI plan + digital SKUs on the web; the native app unlocks what they already own.
- **Real-world services** (bookings, Papic, Panood, planning) route to external payment — which the stores *require* anyway (Apple **3.1.3**, Google Play Payments policy).

→ Result: **0% store fee across the entire catalog — including the vendor 28-day + annual subscriptions** — as long as the checkout never lives inside in-app billing.

### 6.4 Compliance ruleset (this is what we must abide by)

> **🔒 LOCKED — owner-approved 2026-06-11** ("for as long as we do not violate, then yes. lock what can be locked"). Conditioned on compliance: this is the standing design contract unless a store-rule change makes it unnecessary or a better-compliant pattern appears. Design to **Apple's stricter bar** — clear it and Google Play is automatically satisfied. PH baseline (the US external-link allowance does **not** apply here).

**The penalty is never "having outside transactions."** Apple penalizes exactly two behaviors — engineer the native shell so neither can occur:

**✅ DO**
- Sell **all** digital goods on the **responsive web** (browser, not the app) via GCash/BDO — your own website in a browser is unrestricted; anti-steering rules apply only *inside the app*.
- In the native app: let users **sign in** and **use/unlock** what they already bought.
- In the native app: transact **real-world services** via external payment (exempt, and Apple **requires** external for these — 3.1.3).
- Show **neutral account status** only — "Pro plan active until 12 Jul", "Manage your account" — with **no purchase CTA and no outbound buy link**.

**❌ DON'T (inside the native app shell)**
- ❌ Embed any **non-Apple/Google payment sheet** for a digital good (AI plan, vendor sub, tokens, monogram, templates). → straight 3.1.1 violation.
- ❌ Show a **"Subscribe / Renew / Upgrade to Pro / Buy tokens"** button that starts a purchase.
- ❌ Show any **link, banner, or CTA steering to the web to pay** ("cheaper at setnayan.com"). → anti-steering, **still banned in PH**.
- ❌ Even **display a price + buy affordance** for a digital SKU in the native shell (Apple can read that alone as steering).
- ❌ **Block app functionality** behind a "go pay on our website" prompt.

**Per-surface enforcement (native shell):**

| Surface | In native app? |
|---|---|
| Real-world service checkout (vendor booking, Papic, Panood) | ✅ allowed (external payment) |
| Digital-SKU purchase (AI plan, monogram, templates) | ❌ web-only; native shows unlock/status |
| Vendor subscription + token purchase | ❌ web-only; native is **sign-in / unlock only** |
| "Add to Wallet" pass (T2-5) | ✅ allowed — not a purchase |
| Neutral account/plan status (no CTA, no link) | ✅ allowed |
| Any steer-to-web-to-pay link/banner | ❌ forbidden (PH) |

**Guideline anchors:** Apple **3.1.1** (digital goods → IAP, but external purchase for in-app use allowed if not promoted/linked), **3.1.3** (physical + real-world / person-to-person services may use other payment), **3.1.3(b)** multiplatform sign-in, **4.2** minimum functionality (Setnayan clears this — Papic/day-of/galleries/QR are real native function, not a thin wrapper). Google Play **Payments policy** mirrors all of this.

### 6.5 Making it enforceable + build-time gates

- **Native purchase-surface guard (build deliverable):** the native shell must render **no digital-SKU checkout or purchase CTA**. Enforce with a route allowlist + a CI/lint check (analogous to the existing ESLint import-boundary rule in `0052 §16`), so a stray "Subscribe" button fails the build, not App Review.
- **Vendor app = sign-in-only for billing from day one** — the highest-stakes case; never add a native subscription/token purchase path.
- **Pre-submission checklist:** run the ✅/❌ list above before every App Store / Play submission.
- **Owner / external actions:** PH counsel reviews the final native purchase/sign-in flows; re-read the **live** App Store Review Guidelines + Play Payments policy at native-build time (these rules moved twice in 2025 — treat as living).
- **🔒 Owner-confirmed 2026-06-11:** vendors buy + manage subscriptions (28-day + annual) and token packs on the **web only** — no native purchase path. The native app is sign-in / unlock only for billing. Minor one-screen UX cost on iOS, accepted.

### 6.6 Lock status (owner-approved 2026-06-11)

**🔒 Locked now (in our control — the standing design contract):**
1. All payments — incl. vendor 28-day + annual subscriptions, token packs, and every digital SKU — are collected on the **web** (apply-then-pay GCash/BDO). **Never** through in-app billing.
2. Native apps are **sign-in / unlock only** for digital goods: no in-app payment sheet, no Subscribe/Renew/Buy-tokens CTA, no steer-to-web purchase link.
3. The **per-surface matrix (§6.4)** is the design contract for what any native shell may show.
4. Enforcement is a **build-time native purchase-surface guard** (route allowlist + CI/lint), so a violating button fails the build.
5. Design to **Apple's stricter bar**; Google Play follows.

**🔓 Stays open (cannot be locked by us — external/conditional):**
- Final **PH-counsel review** of the native purchase/sign-in flows (gates actual store submission).
- **Re-read the live** App Store Review Guidelines + Google Play Payments policy at native-build time (rules moved twice in 2025 — treat as living).
- If PH ever gains an external-link allowance, or a store rule changes, **revisit** — the lock is conditioned on continued compliance, never on freezing the rules in place.

## 7. Store-compliance remedies (beyond payments)

> Added 2026-06-11. The non-payment rules that can get an app pulled — each with **current shipped state → remedy → effort** (Claude Code time). Verified against the corpus status docs; guideline numbers are the real Apple/Google ones. These are pre-launch build items (not V1). Good news: the foundations mostly exist — the gaps are additive, not greenfield.
>
> **✅ EXECUTION UPDATE (same day, 2026-06-11):** rows **#1 deletion + #2 UGC + #3 push/offline SHIPPED + prod-verified** (PRs #1229 #1230 #1231+#1234; migrations 20261106/07/08 applied; see DECISION_LOG). Row #4 privacy labels → ready-to-paste answers in **`Store_Privacy_Labels_Answer_Sheet_2026-06-11.md`**. **NEW gap found while shipping #2:** the NSFW *filter* the corpus claimed shipped did not exist in the capture path — built same-day as the screening engine (`compliance/nsfw-screen`; reuses Salamisim's `moderation_state`). Remaining: #5 SIWA (at the 0052 iOS build) · #6 AI-report path. Developer-account lead-times → `API_Integration_Checklist.md` #21a–e.

### 7.1 Remedy table

| # | Issue (guideline) | Current state | Remedy | Effort |
|---|---|---|---|---|
| 1 | **In-app account deletion** (Apple 5.1.1(v) · Google data-deletion) | Soft+hard-delete schema + admin-side delete shipped (PR #9); user path = "contact support", blocked for active events | User-initiated in-app **"Request account deletion"** → queued → admin reviews ≤24h (keeps the active-event guard, makes it self-serve + transparent) | ~1–2 CC-days |
| 2 | **UGC moderation** (Apple 1.2 · Google UGC) | Per-photo "Report" + NSFW filter shipped; reports **dead-end at the couple**; no block-user, no upload EULA, no per-comment report | Add **"Block this user"**, an upload **terms-acceptance** gate, per-comment report; **route reports to a new admin queue** (§7.4) | ~2–3 CC-days |
| 3 | **Minimum functionality** (Apple 4.2) | Email-only (0028); web/native **push NOT wired**; PWA service worker ~50 LOC partial | Ship PWA offline Phase 1 (precache shell + schedule/table/floorplan) + **web push** (the #1 "real-app" signal) + background-sync for guestbook | ~3–5 CC-days |
| 4 | **Privacy labels / Data Safety** (Apple 5.1.1 · Google) | Full data inventory already enumerated in the 0025 data-export (incl. `face_vectors.json` **biometric**, photo geo, payment history) | Fill both stores' privacy forms from that inventory; declare **face vectors = biometric**, photo geo (stripped on share), apply-then-pay (no card data stored) | ~0.5 CC-day + owner |
| 5 | **Sign in with Apple** (Apple 4.8 — iOS only) | Email magic-link/password + Google/Facebook OAuth; no SIWA; no native iOS app yet | If social login is offered to *users as sign-in*, add **Sign in with Apple** at the iOS build (0052, V1.5+); web app needs nothing now | ~1 CC-day @ native |
| 6 | **AI content safety** (Google 2025 AI policy) | AI is contained (monogram/music/planning), not open generation | Add a **report path for AI outputs** + confirm the safety filter blocks restricted content | ~1 CC-day |

### 7.2 The three that need design changes NOW (not just at submission)

- **In-app account deletion** — the most concrete known rejection; "contact support" fails Apple 5.1.1(v). Build a self-serve *request* flow; the admin can still gate on active events/balances.
- **UGC report → block → admin routing** — the report button exists but stops at the couple's dashboard; close the loop to a Setnayan admin queue, and add **block-user** + an **upload EULA**.
- **App-like shell (push + offline)** — a bare WebView wrapper gets rejected (4.2); **push notifications + offline** are what make it pass, and neither is built yet.

### 7.3 The rest is "fill the forms + don't be careless"

Privacy labels / Data Safety (you already have the data inventory), Sign in with Apple (iOS-only, defers to the native build), and the AI-report path — all low effort, mostly forms + small flows.

### 7.4 New surfaces these remedies imply

- `user_reports` table + an admin **"User reports"** queue in 0023 (reporter · target photo/comment · reason · context · actions: hide / warn / ban / escalate to Concierge-abuse).
- `blocked_users` state (couple- or event-scoped) on the Papic gallery — distinct from the existing "hide from my view."
- A one-time **terms-acceptance** gate at photo upload (per user per event).
- A user-facing **"Request account deletion"** flow in 0025 feeding the existing admin delete action.

### 7.5 Calendar-bound (owner / external)

PH-counsel review of the moderation + deletion + privacy flows; accurate store privacy forms; App Store / Play review. **Total coding effort ≈ 1.5–2.5 CC-weeks** — the timeline is set by review + counsel, not the code. Remedies fold into host iterations 0025 (deletion), 0012 / 0031 (UGC + offline), 0023 (admin reports), 0028 (push), 0052 (SIWA).

## 8. What this does NOT change

- **V1 scope stays locked.** Everything above is Phase 2 / V1.5+ and needs the sign-offs in §5 before any code.
- **No new prices** are asserted; no SKUs created.
- **No customer token-wallet UI** is introduced (#5 is the phone OS Wallet, a different thing — see §0 warning).
- **Cron-free** is preserved — Live Activities and pass updates are push/event-driven, never polled.
- If owner ratifies any item, it folds into its host iteration (0012 / 0031 / 0052) via the Cowork sequence at that point; this doc is the upstream proposal, not a ratified spec.
