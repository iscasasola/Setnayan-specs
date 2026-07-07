# App Store Submission Runbook — Google Play + Apple App Store

> Created 2026-06-15. Owner-action checklist + ready-to-paste listing assets for
> getting the Setnayan native shell (`com.setnayan.app`) onto both stores.
> The app is a **Capacitor remote-URL shell** — a thin native wrapper that loads
> `https://www.setnayan.com`. One codebase, two store wrappers.

> ## ✅ STATUS UPDATE 2026-06-16 — iOS BUILD UPLOADED
> **iOS build `1.0 (1)` is UPLOADED to App Store Connect** ("Uploaded to Apple", 2:25 PM).
> Signing: auto-manage, Team **Indalecio Casasola**, cert **Apple Development: Ice
> Casasola (433RB5777B)**. The app record **"Setnayan"** already existed (an earlier
> attempt had succeeded despite appearing to fail) — Xcode's `error 0` meant it was
> trying to create a *duplicate*; a fresh **Distribute** attempt found the existing
> record and uploaded. **The 1024² icon was already present + compliant** (see B4 — the
> ⚠ below is stale). **Remaining iOS:** answer Export Compliance → add to TestFlight →
> fill listing → submit for review. Android (Part A) still pending.

## Snapshot — where we stand

| Piece | State |
|---|---|
| App ID (both stores) | `com.setnayan.app` ✅ |
| Version | versionCode `1` / versionName `1.0` (correct for first upload) ✅ |
| Privacy policy URL | `https://www.setnayan.com/privacy` — RA 10173-compliant, store-ready ✅ |
| Android upload keystore | Generated → `/Users/Shared/setnayan-keys/setnayan-upload.jks` ✅ |
| Android CI build | `.github/workflows/build-android.yml` — builds signed `.aab` in cloud ✅ |
| Xcode toolchain | **Xcode 26.5 installed**, selected, licensed; iOS 26.5 SDK + Simulator present ✅ (verified 2026-06-15) |
| CocoaPods | **1.16.2 installed** via Homebrew ✅ — but Capacitor 8 uses SPM, so it was unneeded (harmless) |
| iOS project | **Generated** ✅ 2026-06-15 at `~/apps/mobile/ios` (SPM, `App.xcodeproj`, bundle `com.setnayan.app`). Open in Xcode. Next = signing + archive (B2→B5) |
| App icon | ✅ 1024×1024 present + compliant (`AppIcon-512@2x.png` = 1024px, no alpha, RGB) — `@capacitor/assets` already generated it |
| Apple App Store Connect record | ✅ "Setnayan" exists (iOS, was "Prepare for Submission") |
| **iOS build upload** | ✅ **1.0 (1) Uploaded to Apple 2026-06-16** |
| Google Play developer account | **You register — Personal account** ⛔ |
| Apple Developer Program | **Activated** ✅ |

**The slow, do-it-now gates:**
1. ~~Install Xcode.app + CocoaPods~~ ✅ **Done 2026-06-15** — Xcode 26.5 + CocoaPods
   1.16.2 (via Homebrew) both installed. iOS toolchain fully ready; next iOS step
   is B2 (generate the project). _Remaining iOS gate is now just B2 onward._
2. **Register the Google Play developer account** ($25) and start identity
   verification — there's a multi-day lag, and new personal accounts must run a
   **closed test (~12 testers, 14 continuous days)** before production is unlocked.
   Starting that clock today is the single biggest time-saver.

---

## PART A — Google Play

### A1. Register the developer account (do now)

1. Go to **play.google.com/console** → sign in with the Google account that will
   own the app (use a durable business inbox, not a throwaway).
2. Pick **Personal** account type → pay the **$25 one-time** fee.
3. Complete **identity verification** (government ID; can take a few days).
4. Set a **public developer name** so the store shows a brand-ish name rather
   than your bare legal name (e.g. `Setnayan`).

### A2. Add the keystore to GitHub (so CI can sign the build) ✅ DONE 2026-06-15

> ✅ **Already done.** Both secrets are set on the **active repo
> `iscasasola/setnayan-platform`** (set 2026-06-14): `ANDROID_KEYSTORE_BASE64` +
> `ANDROID_KEYSTORE_PASSWORD`. The `build-android` workflow lives there too.
> ⚠️ Note: the CI + secrets are on **`setnayan-platform`** — *not* on
> `iscasasola/Setnayan-App` (which has neither). Use setnayan-platform for the
> Android build. Keystore files confirmed present at `/Users/Shared/setnayan-keys/`.

The commands used (kept for reference / if you ever need to rotate):

```bash
gh secret set ANDROID_KEYSTORE_BASE64   -R iscasasola/setnayan-platform < /Users/Shared/setnayan-keys/setnayan-upload.jks.base64
gh secret set ANDROID_KEYSTORE_PASSWORD -R iscasasola/setnayan-platform < /Users/Shared/setnayan-keys/UPLOAD_KEYSTORE_PASSWORD.txt
```

> Back up `/Users/Shared/setnayan-keys/` to a password manager. With Google Play
> App Signing (enabled at app creation, step A4) even losing the upload key is
> recoverable — so this is important, not catastrophic.

### A3. Build the signed `.aab` ✅ DONE 2026-06-15

> ✅ **Built + verified.** Workflow run succeeded (after JDK-21 fix **PR #1453** —
> Capacitor 8 compiles at Java 21, not 17). Signed `.aab` (`jar verified`,
> CN=Setnayan, ~6 MB) downloaded to **`/Users/Shared/setnayan-keys/aab-out/app-release.aab`**.
> Re-run anytime via GitHub → **Actions → build-android → Run workflow** (it's
> versionCode 1, so a re-run is identical until you bump the version).

### A4. Create the app + enable Play App Signing

In Play Console → **Create app** → name `Setnayan`, type **App**, **Free**,
accept declarations. On first release upload, **opt into Play App Signing**
(default — let Google manage the app signing key; you keep the upload key).

### A5. Closed testing (the 14-day gate)

1. **Testing → Closed testing → Create track.**
2. Upload the `.aab`.
3. Add **≥12 testers** by email (friends, the pilot households, a tester Google
   Group). They must **opt in via the test link and keep the app installed**.
4. After **14 continuous days** with the required testers, Play unlocks the
   **"Apply for production access"** button. Submit that application.

### A6. Store listing (paste from "Listing assets" below)

**Main store listing:** app name, short + full description, app icon (512×512),
feature graphic (1024×500), ≥2 phone screenshots. **Privacy policy:**
`https://www.setnayan.com/privacy`. **App category:** Lifestyle (or Events).
**Content rating:** complete the questionnaire (→ Everyone). **Data safety:**
fill from the table below. **Target audience:** 18+.

---

## PART B — Apple App Store

### B1. Install the toolchain (do now)

1. ~~Xcode.app from the Mac App Store~~ ✅ **Done** — Xcode 26.5 installed,
   selected, and licensed (verified 2026-06-15). `xcode-select -p` →
   `/Applications/Xcode.app/Contents/Developer`.
2. ~~CocoaPods~~ ✅ **Done 2026-06-15** — installed **1.16.2** via Homebrew
   (`brew install cocoapods`). Note for posterity: `sudo gem install cocoapods`
   would have failed here because system Ruby is **2.6.10** (< the 2.7 CocoaPods
   requires); Homebrew bundles its own modern Ruby, which is why this path worked.
   Harmless `LANG`/UTF-8 warning silenced via `export LANG=en_US.UTF-8` in `~/.zprofile`.

### B2. Generate the iOS project ✅ DONE 2026-06-15

Generated locally at **`/Users/icecasasola/apps/mobile/ios`** via:

```bash
cd apps/mobile
npm ci                   # 420 pkgs
npm run add:ios          # cap add ios
npm run sync             # cap sync
npm run open:ios         # cap open ios → opens Xcode
```

> ⚠️ **Capacitor 8 uses Swift Package Manager, NOT CocoaPods.** The output wrote a
> `Package.swift` and created **`ios/App/App.xcodeproj`** + a local SPM package
> **`CapApp-SPM`** — there is **no `Podfile`, no `Pods/`, no `.xcworkspace`**. So
> CocoaPods (installed in B1) turned out to be *unnecessary* for this shell — kept
> anyway, harmless. Open the project via **`App.xcodeproj`** (cap open ios does this).
> 7 plugins wired: bluetooth-le, app, **camera**, keyboard, network, splash-screen,
> status-bar. (Camera reachable = the Guideline 4.2 mitigation lever.)
> Bundle id confirmed in `project.pbxproj`: **`com.setnayan.app`** ✅.

**Next (in Xcode — owner GUI step):** target **App** → **Signing & Capabilities**
→ check **Automatically manage signing** → select your **Team** (visible now the
Developer Program is active). On first open Xcode auto-resolves the Swift packages
(CapApp-SPM) — let it finish before archiving.

### B3. App Store Connect record

**appstoreconnect.apple.com → Apps → +** → New App. Platform **iOS**, name
**Setnayan**, primary language **English (U.S.)**, bundle ID **com.setnayan.app**,
SKU `setnayan-app`.

### B4. Generate the 1024×1024 icon

App Store requires a 1024×1024 marketing icon with **no alpha/transparency**.
Generate it from the brand vector (`apps/web/public/brand/setnayan-app-icon.svg`)
and run `npx @capacitor/assets generate --ios` to populate the app icon set.

### B5. Archive + upload

Xcode → **Product → Archive** → **Distribute App → App Store Connect → Upload**.
The build appears in App Store Connect after processing (~15–60 min).

### B6. TestFlight, then submit

Add the build to **TestFlight** for internal testing first. Then complete the
listing (assets below) + **App Privacy** labels (table below) and **Submit for
Review**.

> ⚠️ **Guideline 4.2 (minimum functionality) is the real risk.** Apple rejects
> apps that are "just a repackaged website." Mitigations, in order of weight:
> (1) make sure native **Camera** (Papic capture) is reachable and demoed in the
> build, not just web pages; (2) in **App Review notes**, state plainly that the
> app provides native camera capture + at-venue capabilities beyond the website;
> (3) be ready to add push notifications / native share before a resubmission if
> the first pass bounces. Don't assume the first submission clears.

---

## Listing assets (paste-ready, both stores)

**App name:** `Setnayan`

**Subtitle (Apple, 30 char) / Short description (Google, 80 char):**
`Plan your whole wedding, free.`

**Promotional text (Apple, optional):**
`Filipino-first wedding planning. Free to start. 0% commission on verified vendors.`

**Full description:**
```
Set na 'yan. Setnayan is the Philippines-first wedding planning app — plan your
whole wedding in one place, free to start.

START FREE — YOUR PLANNING WORKSPACE
• Guest list with RSVP tracking and QR invitations
• Seating chart editor
• Budget and vendor payment ledger
• Mood board — palette, dress codes, and venue feel

A VERIFIED VENDOR MARKETPLACE — 0% COMMISSION
Browse and message verified Filipino wedding suppliers across Metro Manila,
Cebu, Davao, Tagaytay, and nationwide. Setnayan takes 0% commission on bookings.

MOMENTS THAT SET THE DAY APART
• Papic — turn your guests' phones into a coordinated photo-and-video crew, with
  auto-tagged galleries and personal highlight reels
• Panood — livestream your ceremony right on your event page for family who
  can't be there
• Setnayan AI planner, a published event website with RSVP, a custom Pakanta
  wedding song, and an Animated Monogram

Set na 'yan — that's all set.
```

**Keywords (Apple, 100 char):**
`planner,Filipino,kasal,kasalan,vendor,supplier,RSVP,guest,list,seating,budget,debut,ninang,ninong`

> ASO note (2026-06-28): this field is **97/100 chars, no spaces** (Apple counts
> spaces, so commas only). It deliberately **omits** `wedding`, `plan`, and `free`
> — those already live in the app name + subtitle ("Plan your whole wedding,
> free."), which Apple indexes and cross-combines, so repeating them wastes the
> 100-char budget. Single tokens (`guest`,`list`) let Apple auto-combine phrases
> ("guest list", "list seating"). Adds Filipino high-intent terms (`kasal`,
> `kasalan`, `debut`, `ninang`, `ninong`) and `supplier` (the PH-common synonym
> for vendor). **Google Play has no keyword field** — instead it indexes the full
> 4,000-char long description, so on Play the long description can run longer and
> naturally repeat the high-value terms above (city names, "kasal", "supplier",
> "RSVP") a few times in prose.

**Category:** Lifestyle (primary). Apple secondary: Productivity or Events.

**Visual assets:**
- App icon 512×512 (Google — have it) + 1024×1024 (Apple — generate, no alpha) — _still needed_
- Feature graphic 1024×500 (Google, required) — **base generated 2026-06-28**:
  `0052_native_apps_delivery/setnayan_feature_graphic_1024x500.png` (mulberry-ribbon
  flat-lay) + `…_alt.png` (blush/roses). Brand-clean alabaster editorial still-life,
  exact 1024×500. **Final step is a design overlay** of the `SETNAYAN` wordmark +
  "Set na 'yan." into the open negative space (AI image gen can't render reliable
  lettering, so text is intentionally left off the base).
- ≥2 phone screenshots per store (6.5" iPhone + Android phone) — _still needed_.
  Capture from the live app: homepage, guest list, vendor marketplace, an event website.

---

## Google Data Safety form

Grounded in `setnayan.com/privacy`. **⚠ Corrected 2026-06-28 — the earlier
"Camera + Network only · no location · no biometrics" line was wrong.** The shipped
shell's manifests actually declare more, and the wrapped web app collects location
signals: iOS `Info.plist` declares Camera + **Microphone** + **Photo Library
(read + add)**; Android `AndroidManifest` declares Camera + WiFi state +
**NEARBY_WIFI_DEVICES** (`neverForLocation`) + **ACCESS_FINE_LOCATION**
(`maxSdkVersion=32`, WiFi-scan only). On top of that the app collects **IP
address** (waitlist stores full IP; join stores last-octet-anonymized) and **Papic
photo EXIF geo** (lat/lon per capture). So location IS in scope. (Biometrics are
still defensibly *not collected* today — face descriptors are computed on-device
and `guest_face_enrollments.face_vector` is dormant; this flips the moment
server-side face vectors are written.)

| Data type | Collected? | Linked to user? | Purpose | Optional? |
|---|---|---|---|---|
| Name | Yes | Yes | Account management, app functionality | Required |
| Email address | Yes | Yes | Account management | Required |
| Phone number | Yes | Yes | Account management | Optional |
| User IDs | Yes | Yes | App functionality | Required |
| Photos | Yes | Yes | App functionality (profile, payment proof, event photos) | Optional |
| Messages (in-app) | Yes | Yes | App functionality | Optional |
| Purchase history | Yes | Yes | App functionality (order/reference metadata) | Optional |
| **Approximate location** | **Yes** | **Yes** | App functionality / security (IP-derived; onboarding "near me" prompt) | Optional |
| **Precise location** | **Yes** (Papic) | **Yes** | App functionality (photo EXIF geo on captures) — **owner: confirm retention posture** | Optional |
| App interactions | Yes | **No** (anonymized, PostHog, opt-out) | Analytics | Optional |
| Crash logs / Diagnostics | Yes | No | App functionality (Sentry) | Required |

**Not collected:** financial card numbers (payment is external bank/GCash),
contacts, calendar, health, **biometrics (on-device only today — re-check before
enabling server-side face vectors)**, ad IDs.

**Security section:** data encrypted in transit = **Yes**. Users can request data
deletion = **Yes** (Settings → Privacy & Data; `setnayan.com/privacy`). App is
**not** directed at children.

### ⚠ Owner decisions before submitting (each is the owner's legal call)

1. **Third-party "processed on our behalf" vs "shared"** — recommendation: all are
   *processed*, none *shared* (each acts on our instructions): **PostHog**
   (analytics, anonymized, opt-out), **Sentry** (diagnostics), **Supabase** (the
   data store/auth), **Resend** (transactional email). Confirm.
2. **Anthropic** — listed in the privacy policy as a cross-border processor, but
   **no `api.anthropic.com` call exists in code** (Setnayan AI is deterministic
   matchmaking). Decide: wire it, or **drop it from the privacy policy + omit from
   the forms** until it's live. (RA 10173 accuracy — see flag below.)
3. **Persona (identity verification)** — disclosed in the privacy policy, but
   **not wired**: vendor verification today is manual admin review of an uploaded
   gov-ID image + selfie + Google Meet. The ID image + selfie ARE collected (as
   User Content / Sensitive Info). Decide whether to declare an
   identity-verification category now or after Persona ships.
4. **Push notifications** — `@capacitor/push-notifications` is a dependency. If
   push is enabled in the shipped build, a device/notification token must be
   declared (Identifiers / Device IDs). Confirm whether it's live.
5. **Papic geo retention** — does the server record keep EXIF `geo_lat/geo_lon`,
   or is it stripped on outbound shares per spec? This flips **Precise location**
   on/off in both stores' forms.

---

## Apple App Privacy labels (App Store Connect → App Privacy)

- **Data used to track you:** **None.** (No ad IDs, no cross-site tracking.)
- **Data linked to you:**
  - Contact Info — Name, Email, Phone (App Functionality)
  - User Content — Photos/Videos, Messages, **Audio Data** (clip recording), Other (App Functionality)
  - Purchases — Purchase History (App Functionality)
  - Identifiers — User ID (App Functionality)
  - **Location — Coarse Location** (IP-derived; App Functionality / Security)
  - **Location — Precise Location** (Papic photo EXIF geo — declare only if retained server-side; App Functionality) ⚠ owner decision #5 above
  - **Sensitive Info** — government-ID image + selfie for vendor identity verification (App Functionality) ⚠ owner decision #3 above
- **Data not linked to you:**
  - Usage Data — Product Interaction (Analytics)
  - Diagnostics — Crash Data, Performance Data (App Functionality)

> ⚠ Reconcile `Info.plist` requests with these labels: the binary declares
> **Microphone** (clip audio → Audio Data) and **Photo Library read+add** (photo
> picker → User Content). If **push** is enabled, add Identifiers — Device ID.
> Export Compliance is already answered in-binary (`ITSAppUsesNonExemptEncryption=false`).

---

## Content rating questionnaire (both stores) — paste-ready answers

| Item | Answer |
|---|---|
| Violence | None |
| Sexual content / nudity | None (NSFW filter on by default, **cannot** be disabled) |
| Profanity | None |
| Controlled substances / alcohol / tobacco | None |
| Gambling / simulated gambling | None |
| **User-generated content** | **Yes** — Papic galleries + couple↔vendor uploads |
| **User-to-user communication** | **Yes** — in-app chat (couple ↔ vendor) |
| Shares user location | Yes **if** Papic geo is declared (owner decision #5) |
| Personal info collection | Yes |
| Digital purchases | Yes (in-app paid SKUs; paid externally via bank/GCash) |
| Target age | 18+ |

Expect an IARC outcome of Everyone–Teen driven by the UGC + communication flags.

## Store URLs + social (`sameAs`)

- **Fill NOW (all live):** Support URL `https://www.setnayan.com/help` · Marketing
  URL `https://www.setnayan.com` · Privacy `https://www.setnayan.com/privacy`.
  Neither store requires a social URL to ship.
- **`Organization.sameAs` (web JSON-LD) + footer social icons are empty** — there
  are **no Setnayan-owned social accounts anywhere** in code. ⚠ **Owner action:**
  create at least a Facebook Page + Instagram and/or LinkedIn Company Page, then
  the URLs drop into `app/layout.tsx` (`organizationJsonLd.sameAs[]`, already
  stubbed) + `_SiteFooter.tsx` in a one-line follow-up.

---

## Owner action summary (in order)

**Build/toolchain — all done 2026-06-15:**
- [x] ~~Xcode.app download~~ — **Xcode 26.5 installed + active**.
- [x] ~~Install CocoaPods~~ — 1.16.2 via Homebrew (turned out unneeded; Capacitor 8 = SPM).
- [x] ~~Add keystore GitHub secrets (A2)~~ — set on **setnayan-platform** (2026-06-14).
- [x] ~~Run build-android → download `.aab` (A3)~~ — **signed `.aab` built + verified** at `/Users/Shared/setnayan-keys/aab-out/app-release.aab` (JDK-21 fix #1453).
- [x] ~~Generate iOS project (B2)~~ — `~/apps/mobile/ios` (SPM, `App.xcodeproj`, bundle `com.setnayan.app`).

**Still owner-blocked (in priority order — iOS first, no device wall):**
- [x] ~~**iOS:** Xcode signing → App Store Connect record → 1024² icon → Archive + Upload~~ — **DONE 2026-06-16, build 1.0 (1) Uploaded to Apple.**
- [ ] **iOS remaining:** answer Export Compliance (HTTPS-only → exempt) → add build to **TestFlight** → fill listing (screenshots/desc/privacy labels) → **submit for review** (Guideline 4.2 risk).
- [ ] **⚠ Android device gate:** owner has **no Android phone**. Borrow ANY Android ~5 min → install **Google Play Console** app → sign in as `iscasasolaii@gmail.com` (registers the account's required real-device attestation; emulator does NOT pass) → sign out.
- [ ] **Google Play account:** register Personal ($25) + finish **ID verification** (check status in Console).
- [ ] Create Play app, Play App Signing, upload `.aab` to **closed testing**, recruit **≥12 testers** (need real Android phones), start the **14-day** clock (A4–A5).
- [ ] Fill Play listing + Data Safety + content rating (A6 + tables above).
- [ ] Create App Store Connect record + App Privacy labels + submit (B3–B6).
- [ ] Design: 1024×1024 icon (no alpha); **wordmark overlay** on the generated
      1024×500 feature-graphic base (`setnayan_feature_graphic_1024x500.png`);
      ≥2 phone screenshots per store from the live app.
