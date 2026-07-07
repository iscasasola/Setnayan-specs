# Setnayan iOS App Store Submission-Readiness Checklist (2026-06-25)

> Produced by a 15-agent adversarially-verified workflow (`ios-appstore-readiness`, run `wf_0b0ed7f2-ede`). Companion to `Google_Play_Org_Launch_Runbook_2026-06-25.md` (Google side) + 0052.

**Architecture:** Capacitor 8 remote-URL WKWebView shell loading `https://www.setnayan.com`. Bundle id `com.setnayan.app`. **Individual** Apple Developer account ("Indalecio Casasola II"). Build SDK mandate: **Xcode 26 / iOS 26 SDK** (in force since 2026-04-28).

## ⚠ Post-audit corrections (verified against origin/main after the run)
1. **The iOS project is NOT committed** to `apps/mobile/ios` on `origin/main` (0 files). The agents' "ios/ is already tracked, just edit Info.plist" is **wrong** — they mistook their own `cap add ios` worktree output for tracked files. **The PR must GENERATE the iOS project (`cap add ios`) and commit the whole `ios/` folder** (the iOS analog of Android's PR #1044), *then* apply the Info.plist/privacy-manifest/entitlements edits below.
2. **Real icon source exists:** `apps/web/public/brand/setnayan-app-icon.svg` (scalable → 1024px) + `setnayan-app-icon-512.png`. A7 is resolvable via `npx @capacitor/assets generate --ios` from the SVG.

---

## Ruled out (refuted by adversarial verification — do NOT do these)
- ❌ **Custom `SetnayanViewController` + storyboard `customClass` for `requestMediaCapturePermissionFor`.** Capacitor 8's bundled `WebViewDelegationHandler.swift` already implements the WKUIDelegate media-capture method and returns `.grant`. getUserMedia camera+mic already works.
- ❌ **Capacitor-config "ios privacy block."** Capacitor has no config field for usage strings — edit Info.plist directly.
- ❌ **"ITMS-90078 push warning fires by default."** Default `cap add ios` AppDelegate has NO push hooks and doesn't link APNs. No warning unless push is manually wired.
- ❌ **`applinks:setnayan.com` (apex).** Apex 307-redirects `/.well-known/...` to www; an applinks domain whose AASA redirects fails association. Scope the entitlement to **www only**.
- ❌ **Next.js header rule for AASA Content-Type.** Already shipped in `next.config.ts` and live (`200`, `application/json`, no redirect). Only the Team ID value inside is wrong.
- ❌ **`appUrlOpen` listener "missing."** Already present in `apps/web/app/_components/native-bridge.tsx`, routing https + `setnayan://`.

---

## (A) 🔴 BLOCKERS — auto-reject at upload, runtime crash, or guaranteed review rejection

**A1. Camera usage string** — `apps/mobile/ios/App/App/Info.plist`
```xml
<key>NSCameraUsageDescription</key>
<string>Setnayan uses your camera so you can capture photos and short clips at the event and add them to the couple's shared gallery.</string>
```
Missing → SIGABRT on first capture + App Store Connect static analyzer rejects the upload (AVFoundation linked by `@capacitor/camera@8.2.0`).

**A2. Microphone usage string** — `Info.plist`
```xml
<key>NSMicrophoneUsageDescription</key>
<string>Setnayan uses your microphone to record sound with the short video clips you capture at the event.</string>
```
5-second Papic clips are audio+video.

**A3. Photo library ADD (write)** — `Info.plist`
```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Setnayan saves the photos, clips, and reels you create to your photo library so you can keep and share them.</string>
```

**A4. Photo library READ** — `Info.plist`
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Setnayan needs access to your photos so you can pick images to include in your personal reels and memories.</string>
```
`@capacitor/camera` links the Photos framework.

**A5. Export-compliance key** — `Info.plist` (else every upload parks in "Missing Compliance")
```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

**A6. App-target privacy manifest** — NEW FILE `apps/mobile/ios/App/App/PrivacyInfo.xcprivacy`. Missing → **ITMS-91053 rejection at upload**. Add to the **App target's Copy Bundle Resources**.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>NSPrivacyTracking</key><false/>
  <key>NSPrivacyTrackingDomains</key><array/>
  <key>NSPrivacyAccessedAPITypes</key><array>
    <dict>
      <key>NSPrivacyAccessedAPIType</key><string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key><array><string>CA92.1</string></array>
    </dict>
    <dict>
      <key>NSPrivacyAccessedAPIType</key><string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
      <key>NSPrivacyAccessedAPITypeReasons</key><array><string>C617.1</string></array>
    </dict>
  </dict></array>
  <key>NSPrivacyCollectedDataTypes</key><array><!-- B8 rows --></array>
</dict></plist>
```
- `CA92.1` (UserDefaults) **mandatory** (matches Capacitor's published sample). `C617.1` (FileTimestamp) high-likelihood — include.
- If the ITMS-91053 email names `DiskSpace (E174.1)` or `SystemBootTime (35F9.1)`, add exactly those + re-upload. Don't over-declare.
- Validate: `plutil -lint …/PrivacyInfo.xcprivacy`; after build confirm `Payload/App.app/PrivacyInfo.xcprivacy` exists at bundle root.

**A7. Real App Icon** — `apps/mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset/`. Slot structure is fine; the shipped PNG is the **Capacitor placeholder** → 4.x design rejection. Replace via `npx @capacitor/assets generate --ios` from `apps/web/public/brand/setnayan-app-icon.svg` (opaque, square, no alpha, no rounded corners).

**A8. Guideline 4.2 — Minimum Functionality** (top rejection risk for a remote-URL shell). No file change — assemble the defense: demo path must **reach a screen where the native camera permission prompt fires** (Papic); native chrome visibly active (Splash/StatusBar/Keyboard); offline `www` fallback renders a branded screen not a white WKWebView; state native capabilities + tap-path in Review Notes (O7).

**A9. Guideline 3.1.1 — no in-app sale of Setnayan's OWN digital SKUs.** ⚠️ **OWNER DECISION.** Web-side, **UA-gated on `SetnayanApp`**: suppress checkout / apply-then-pay / buy CTAs for the platform's own digital SKUs (Setnayan AI, Animated Monogram, Papic, Couple Website PRO, STD openings, Pakanta) inside in-app views. PH storefront has **no anti-steering exception** (US-only), so even the BDO/GCash reference-code flow must be hidden in-app. **Keep** vendor-booking payments for real-world third-party services (3.1.3(e)/3.1.5(a) exempt). Alternative = Apple IAP on digital SKUs (commission breaks PHP-direct economics) → business decision.

> **✅ DECIDED 2026-06-25 — FULL Apple IAP (v1.1 end-state).** Owner chose full IAP over web-first. **Sequencing:** iOS **v1 ships with in-app digital-SKU checkout HIDDEN** (this UA-gated suppression — required to pass review since IAP isn't built yet); **v1.1 = build the IAP subsystem** (StoreKit/plugin + ~19 App Store Connect IAP products + server receipt validation + per-channel pricing per Groundwork §10). **Channel-markup rule:** iOS-IAP price = **web price ÷ 0.85** (≈ **+17.6%**, NOT +15%) snapped **up** to the nearest Apple PHP tier → nets ≈ web price after Apple's 15% Small Business commission (use ÷0.70 / +42.9% if ever on the 30% tier). Per-SKU, per-channel, **admin-managed** (never hardcoded); actual numbers in the holistic pricing pass.

**A10. Guideline 5.1.1(v) — in-app account deletion reachable.** Shipped on web (Profile → Delete my account). Verify on-device that the UA=`SetnayanApp` middleware doesn't strip Settings/Profile, the flow fully **deletes** (not deactivates), no external Safari hop. Note path in Review Notes.

**A11. Guideline 1.2 — UGC safety controls.** Papic guest photos/clips + vendor chat = UGC. Reachable in-app: (a) upload filter — NSFW always-on ✅; (b) **report** control on guest photos/clips + chat; (c) **block** abusive users; (d) published contact path (Help Center ✅). Build (b)/(c) on web if missing before submitting. Pairs with Age-Rating UGC declaration (O5).

**A12. Build with Xcode 26 / iOS 26 SDK** (toolchain mandate). Owner build Mac: install **Xcode 26+** (needs compatible macOS — confirm). Verify `xcodebuild -version` = 26.x before archiving. *(Note: this machine had Xcode 26.5 at audit time — confirm on the actual build Mac.)* Deployment target may stay low.

**A13. Reviewer demo account + backend on** (Guideline 2.1). App is login-first. App Store Connect → App Review Information: Sign-In Yes · `couple.test@setnayan.com` / `SetnayanTest!2026` · test event `fba4a392-…`. Keep prod backend up + account un-rate-limited across the multi-day review.

**A14. App ID registered + App Store Connect app record created** — manual prerequisite before any upload (O1).

---

## (B) 🟡 RECOMMENDED

**B1. Lock iPhone to portrait** — `Info.plist` (web UX is portrait-only):
```xml
<key>UISupportedInterfaceOrientations</key>
<array><string>UIInterfaceOrientationPortrait</string></array>
```
**B2. iPad multitasking decision** — `UIRequiresFullScreen` absent + iPad allows 4 orientations → treated Stage-Manager/Split-View capable; narrow widths may break mobile-first layout. Either restrict `~ipad` array + add `<key>UIRequiresFullScreen</key><true/>`, or test responsive layout at Split-View widths. Owner decision.
**B3. Remove stale `armv7`** — DELETE the whole `UIRequiredDeviceCapabilities` armv7 block (arm64 implied; don't replace with explicit arm64).
**B4. AASA Team ID** — `apps/web/public/.well-known/apple-app-site-association`: replace `TEAMID` with the real 10-char Team ID (candidate `P95JPDWWB3` — **VERIFY** at developer.apple.com → Membership). Field name is `appID` (singular):
```json
{ "applinks": { "apps": [], "details": [ { "appID": "TEAMID.com.setnayan.app", "paths": ["/dashboard/*"] } ] } }
```
Redeploy; validate via `https://app-site-association.cdn-apple.com/a/v1/www.setnayan.com`. Either finish it or delete the placeholder before review.
**B5. Associated Domains capability** — Xcode → App target → Signing & Capabilities → + Associated Domains → `applinks:www.setnayan.com` → creates `apps/mobile/ios/App/App/App.entitlements`. Commit it + the `CODE_SIGN_ENTITLEMENTS` change.
**B6. Custom URL scheme `setnayan://`** — `Info.plist` (Android parity; AppDelegate already forwards `open:options:`):
```xml
<key>CFBundleURLTypes</key>
<array><dict>
  <key>CFBundleURLName</key><string>com.setnayan.app</string>
  <key>CFBundleURLSchemes</key><array><string>setnayan</string></array>
</dict></array>
```
**B7. Geolocation — ship WITHOUT it for v1.** WKWebView doesn't service web `navigator.geolocation` on a remote origin + `@capacitor/geolocation` not installed → geo silently dead; spec tolerates `geo_unavailable`. **OMIT `NSLocationWhenInUseUsageDescription`** (no declared-but-unused permission). To add later: install `@capacitor/geolocation` + usage string + a UA-gated `apps/web` bridge through `Geolocation.getCurrentPosition()`.
**B8. Privacy-manifest collected-data rows** — add `NSPrivacyCollectedDataTypes` (Email, Name, PhotosorVideos, PreciseLocation if geo, CrashData/ProductInteraction if Sentry/PostHog run in-WebView; Linked=true, Tracking=false, AppFunctionality). Not upload-gating; binding surface is the ASC questionnaire (O6).
**B9. Audit analytics identifiers** before ASC labels — if PostHog sets a persistent `distinct_id`/surfaces Supabase user id in native sessions, declare `UserID`; else document + omit.
**B10. TestFlight on a physical device** before public review (simulator can't validate getUserMedia camera). Exercise camera+mic, photo save/pick, account deletion, 2nd-cold-launch capture.
**B11. Build-number scheme** — `MARKETING_VERSION=1.0`/`CURRENT_PROJECT_VERSION=1` fine; agree a monotonic build scheme to avoid "redundant binary."
**B12. Verify push dormant + hide dead UI** (2.3.1) — push is deferred (inert on iOS until manually wired; no ITMS-90078). But the vendor Web Push opt-in banner runs in WKWebView (unreliable) → gate on `isPushSupported()` so it hides. Don't list push in description/screenshots. (Or `npm rm @capacitor/push-notifications` + `cap sync ios`.)

---

## (C) ⚪ INFO / NO ACTION (correct as-is)
- `requestMediaCapturePermissionFor` handled by Capacitor 8 — no custom VC.
- `allowsInlineMediaPlayback=true` + `mediaTypesRequiringUserActionForPlayback=[]` — keep.
- `ios.limitsNavigationsToAppBoundDomains:false` — correct; do NOT flip true / add `WKAppBoundDomains` (breaks Papic camera/mic).
- Secure context (`https://`, `cleartext:false`) → getUserMedia precondition met. Never archive with `CAP_SERVER_URL=http://`.
- No `NSAppTransportSecurity` dict — secure-by-default; don't add `NSAllowsArbitraryLoads`.
- `UIViewControllerBasedStatusBarAppearance=true`, `CFBundleDisplayName=Setnayan`, `CFBundleDevelopmentRegion=en`, `UILaunchStoryboardName=LaunchScreen` — correct.
- AppDelegate `continue userActivity` + `open:options:` — present; don't delete.
- **Do NOT add** Calendars/Contacts/Reminders/FaceID/Bluetooth/Motion/LocalNetwork/UserTracking strings, ATT, or `UIBackgroundModes` — unused → 5.1.1(iii)/2.5.4 rejection. (DSLR `NSLocalNetwork`+Bonjour is Phase 2.)
- No `apple-developer-merchantid-domain-association` (Apple Pay web only).
- **Individual account** → listing shows "Indalecio Casasola II", not "Setnayan" (allowed; org upgrade needs D-U-N-S tied to the DTI sole prop — later). In-app brand + `CFBundleDisplayName` unaffected.
- `IPHONEOS_DEPLOYMENT_TARGET` 15.0 accepted; optional bump to 16.0 to de-risk getUserMedia on iOS 15.

---

## PR CONTENTS — `apps/mobile` (+ `apps/web` AASA)
> **✅ SHIPPED in PR [#2165](https://github.com/iscasasola/setnayan-platform/pull/2165) (2026-06-25, auto-merge armed)** — all items 0–5 below done + verified (`xcodebuild` simulator BUILD SUCCEEDED, privacy manifest confirmed in the bundle, Team ID `P95JPDWWB3` in the AASA). Items 6–7 (web-side A9 checkout-hiding = v1.1; B12 push-banner gate; A11 report/block) are NOT in this PR — separate follow-ups. The owner-side actions below remain.
0. **GENERATE the iOS project** (`cap add ios`) and commit the whole `ios/` folder *(corrected — it is NOT yet on origin/main)*. Do all edits below AFTER generation; do not re-run `cap add ios` after editing.
1. `Info.plist`: ADD A1–A5 + B6 (`setnayan://`); REPLACE iPhone orientations → portrait (B1); DELETE armv7 (B3); OMIT location string (B7); optional B2.
2. NEW `PrivacyInfo.xcprivacy` (A6) + App-target membership; `plutil -lint`.
3. NEW `App.entitlements` (B5) with `applinks:www.setnayan.com` + `CODE_SIGN_ENTITLEMENTS` in pbxproj.
4. REPLACE AppIcon placeholder with real brand icon (A7) from `setnayan-app-icon.svg`.
5. `apps/web/public/.well-known/apple-app-site-association`: real Team ID (B4) → redeploy.
6. Web-side UA-gated digital-SKU checkout suppression (A9) — ⚠ owner sign-off first.
7. Web-side: gate vendor Web Push banner on `isPushSupported()` (B12); add report/block UGC controls if missing (A11).
8. **Commit hygiene:** NO `CHANGELOG.md`/`STATUS.md` edits in the PR → use a `changelog.d/<slug>.md` fragment.

## OWNER-SIDE ACTIONS — Apple Developer Portal + App Store Connect + build Mac
1. Confirm **$99 membership active**; accept all Program License + Paid Apps agreements (unaccepted silently block uploads).
2. **Team ID** — developer.apple.com → Membership → copy 10-char ID → into AASA (B4) + confirm = Xcode signing team.
3. **App ID** `com.setnayan.app` (explicit) — auto-created on first archive with Automatic signing; confirm Associated Domains service enabled after.
4. **App Store Connect app record** — New App: iOS, bundle `com.setnayan.app`, SKU `setnayan-ios-001`, name `Setnayan`.
5. **Age Rating** — declare UGC (Papic + chat) + AI chatbot (Setnayan AI); expect 13+ floor.
6. **App Privacy questionnaire** — Email, Name, Photos/Videos, Precise Location (if geo), Crash/Product-Interaction (if analytics in-WebView); account creation+deletion = Yes; Privacy Policy URL. Match the `.xcprivacy`.
7. **App Review Information** — Sign-In Yes + demo creds (A13) + Notes (native capabilities, camera tap-path, delete-account path).
8. **Export compliance** — auto-cleared by `ITSAppUsesNonExemptEncryption=false`.
9. **Build Mac** — Xcode 26+; `xcodebuild -version`=26.x; `npx cap sync ios` before archiving.
10. **Archive + upload** — "Any iOS Device (arm64)", Release → Archive → Distribute → App Store Connect → Upload.
11. **Privacy Report** (Organizer) — reconcile any extra API categories before submitting.
12. **TestFlight** internal → physical device (B10) → promote to App Review.
13. **Listing assets** — 1024² opaque icon, 6.9"/6.7" iPhone screenshots of real in-app screens, Support URL `https://www.setnayan.com/help`, Privacy Policy URL.
14. Keep backend up across review.
15. **Push (deferred)** — no portal action.
16. ⚠️ **Owner decision A9 (3.1.1)** — hide in-app digital-SKU checkout vs adopt Apple IAP. Gates the web-side PR change.

---

*Source: workflow `ios-appstore-readiness` (15 agents, adversarially verified), 2026-06-25. Corrections verified against origin/main. Recorded in DECISION_LOG.md.*
