# App Store Launch Checklist (Apple App Store · Google Play) — 2026-06-10

**Status:** DESIGN / PREP ONLY · no code · forward checklist. **Native apps are V1.5+ DEFERRED** — Android shell is *built (debug)*, iOS is *not generated* (needs Xcode/CocoaPods) per 0052. This is the owner-side + engineering-side runbook for submitting the **app to the stores** when that time comes.

> **Distinct from `Verified_App_Submission_Runbook.md`** (in this folder), which covers the **OAuth API scope reviews** (Google Drive · YouTube · TikTok). Those are *third-party API* reviews; this is the *app-store* review. Both gate a full native launch; they're independent submissions.
>
> **Companion economics:** the IAP commission stance + the channel-aware price model live in `Global_Readiness_Groundwork_2026-06-10.md` §§ 9–10.

---

## 0 · The shape of the app (why review is even passable)

Setnayan's mobile app is a **Capacitor remote-URL WebView** loading `setnayan.com`, that **launches into login** (not the marketing site) and bridges native hardware (camera, deep links, network) via plugins (0052 · DESIGN ADDITION 2026-06-10). That posture is deliberately chosen to clear the two stickiest review gates below.

---

## 1 · The two policy gates (decide BEFORE submission)

### 🚦 Guideline 4.2 — Minimum Functionality ("is this just a website?")
A thin webview of a *website* gets rejected. Setnayan clears it by being **app-like**:
- [ ] App **boots into login + the product**, not the marketing brochure (0052).
- [ ] **Native bridges demonstrably wired** — Papic camera, deep links (App Links + `setnayan://`), push, network/offline fallback — so the app shows native value a browser can't.
- [ ] Native **Papic capture** path (the true-native surface, 0012) present on the build under review.

### 🚦 Guideline 3.1.1 — In-App Purchase for digital goods
The decision that **must be settled per SKU × country** before submission (model in Groundwork §10):
- [ ] Each **digital SKU** (Papic · Animated Monogram · Save-the-Date · Pakanta · Panood) has a channel policy: **IAP**, or **web-only with link-out** where allowed.
- [ ] **Vendor bookings are NOT IAP** — real-world services, off-platform (RA 11967). Confirm the build never routes a vendor payment through IAP (would be both wrong and a rejection vector).
- [ ] **Anti-steering compliance:** do **not** tell users "cheaper on the web" / link out to buy **except** where `external_link_allowed` (US post-2025 Epic ruling · EU DMA). Elsewhere, digital SKUs sold in-app must use IAP.
- [ ] If using IAP: products created in App Store Connect / Play Console, prices snapped to store tiers (§10).

---

## 2 · Submission prerequisites

| Item | Side | Notes / status |
|---|---|---|
| Apple Developer Program enrollment | Owner | Pending (0052) — required before any iOS submission |
| Google Play Console account | Owner | Verify enrollment |
| Release signing — iOS cert/profile · Android keystore | Eng/Owner | Android keystore scaffold gitignored (0052); iOS not generated |
| `.well-known/assetlinks.json` (Android) + `apple-app-site-association` (iOS) with **real** hashes | Eng | Scaffolds exist; **real fingerprints pending** (0052) — gates verified deep links |
| **In-app account deletion** | Eng | **Apple-required** when account creation exists → already shipped (0025 Privacy & Data: soft/hard delete + RA 10173). Confirm reachable in-app. |
| **App Privacy labels** (Apple) + **Data Safety** form (Google) | Owner/Eng | Declare collection: account data, photos (Papic), analytics (PostHog/Sentry, 0035). Align with `setnayan.com/privacy`. |
| **Sign in with Apple** | Eng | **Required if** any 3rd-party social login (Google) is offered. Decide alongside the OAuth-in-system-browser fix. |
| **OAuth via system browser** | Eng | ⚠ Embedded-WebView OAuth is **blocked** (0052) — must move to system browser before social login ships in the shell. |
| Permission usage strings (camera, location) | Eng | iOS `Info.plist` NSCamera/NSLocation usage descriptions — Papic capture + geo metadata (0012). |
| **Reviewer demo account** | Owner | Use the virtual test accounts (`couple/vendor/admin.test@setnayan.com`) so reviewers reach the product behind login. |
| Age rating / content questionnaire | Owner | Wedding content — straightforward. |
| Export-compliance (encryption) declaration | Owner | Standard HTTPS-only → usual exemption. |
| Screenshots + store metadata + privacy policy + ToS URLs | Owner | `setnayan.com/privacy` shipped; **verify `/terms`** before submission (already flagged in the OAuth runbook). |

---

## 3 · Per-country overlay

App-store rules are not uniform — the same submission can need different stances per storefront:
- **USA / EU:** external-purchase link-out allowed → digital SKUs *may* sell on web at ~0 store fee (set `external_link_allowed = true`, Groundwork §10b).
- **Philippines + most of SEA:** legacy IAP rules → digital SKUs sold in-app must use IAP at 15–30%.
- [ ] Set `channel_take_rate.external_link_allowed` per launch country **before** that storefront goes live.

---

## 4 · Sequence when native launch is greenlit

1. Resolve the §1 policy gates (4.2 readiness + per-SKU 3.1.1 stance).
2. Owner enrolls Apple Developer + verifies Play Console.
3. Eng lands real `.well-known` hashes + signing + OAuth-system-browser fix + Sign in with Apple.
4. Set channel pricing/policy config (Groundwork §10) per launch country.
5. Generate the iOS project (Xcode), build, internal test.
6. Fill privacy/data-safety labels + screenshots + reviewer demo account.
7. Submit; iterate against rejections (portals accept updates without resetting the queue).

---

## 5 · Web-side prep — the "what to upload / add now" answer

These are `apps/web` items that *could* start before the native build because they help today's web/PWA users too. **All are CODE changes that auto-deploy to production on merge** (and `/terms` is legal copy needing owner review) → do them as a **deliberate PR at build kickoff**, not casually. **Status: not started — parked for build time** (owner 2026-06-11: "talk about these when we start creating the app").

> **Reminder on the stack (owner Q, 2026-06-11):** the whole app is **React/Next.js**. **PWA** = that same React site made installable — *not* a different codebase. **Papic capture stays TRUE NATIVE** (Swift/Kotlin) precisely because PWA/webview cameras are too weak for it — so none of the PWA items below touch the camera-serious path. PWA scope = the non-camera app (planning, dashboard, marketplace).

| Item | What | Notes |
|---|---|---|
| **PWA manifest + icons** | Complete `manifest.webmanifest`: maskable icons (192/512), `start_url`, `display: standalone`, theme color | PWA is the locked V1 mobile surface (0052). Brand favicon/icon already shipped (2026-06-10) — manifest is the remaining piece. Camera-free. |
| **`/privacy` app-data disclosure** | Ensure privacy page lists app-relevant collection: camera/photos (Papic), analytics (PostHog/Sentry, 0035) | Store-required URL; must match the App Privacy / Data Safety labels (§2). |
| **`/terms` complete** | Confirm `/terms` exists and is complete | Flagged "verify before submission" in the OAuth runbook. **Legal copy → owner review.** |
| **`.well-known` path structure** | Lock *which URL patterns the app claims* in `assetlinks.json` + `apple-app-site-association`: **claim** product (`/dashboard/*`, `setnayan://`); **do NOT claim** public/guest URLs (per 0052 deep-link decision) | Files already scaffolded. **Crypto fingerprints stay TODO** until signing keys + Apple Team ID exist (§2). |
| **Install prompt** | Add a PWA "Add to Home Screen" affordance; optionally a "native app coming soon — notify me" capture | Works today, no native app needed. **iOS Smart App Banner deferred** (needs an App Store ID that doesn't exist until the iOS app is built). |

**Cannot start until the app / store accounts exist** (see §2): real `assetlinks`/`AASA` fingerprints · iOS Smart App Banner meta · IAP product setup.

---

*Design-only capture, 2026-06-10 (web-side prep § 5 added 2026-06-11). Nothing here changes V1 scope — native apps remain V1.5+ deferred. Cross-refs: 0052 (shell + launch-into-login), 0025 (account deletion + privacy), 0035 (analytics → data-safety labels), `Verified_App_Submission_Runbook.md` (OAuth API reviews), `Global_Readiness_Groundwork_2026-06-10.md` §§ 9–10 (IAP economics + channel price model).*
