# Iteration 0052 — Native Apps Delivery (iOS · iPadOS · Android · macOS · Windows)

**Iteration number:** 0052 (originally proposed as 0043 per CLAUDE.md 2026-05-15 lock · renumbered 2026-05-29 because 0043 was already taken by V1.1 Wedding Type Picker per CLAUDE.md 2026-05-19 row 425 · owner picked Option B from OQ-1 resolution turn on 2026-05-29 to minimize corpus churn)
**Topic:** V1.5+ multi-platform native app rollout — true native Papic shells (Swift on iOS, Kotlin on Android) + Capacitor mobile wrapper (iOS + Android) + Tauri desktop wrappers (macOS + Windows) shipped end-to-end so Setnayan runs as a first-class app on every surface a Filipino couple, vendor, or operator touches.
**Surface:** Cross-cutting · instruments every couple-facing + vendor-facing + admin-facing route the web build serves, plus offline-only native surfaces for Papic capture (iteration 0012) and Patiktok booth (iteration 0017) and day-of guest (iteration 0031).
**Distribution paths:** Apple App Store (iOS + iPadOS) · Mac App Store (macOS) · Google Play (Android) · Microsoft Store (Windows) · direct downloads at `setnayan.com/download` (.dmg for macOS · .exe for Windows · TestFlight for iOS beta).
**Builds on:** 0012 (Papic native architecture lock) · 0017 (Patiktok booth offline behavior) · 0031 (day-of guest PWA shell baseline) · 0037 (Event-Day Pre-load CTA + IndexedDB cache) · 0035 (Sentry SDK is per-runtime · adds Capacitor + Tauri runtimes) · V2 Phase G (IndexedDB + service-worker offline daemon — `NEXT_PUBLIC_OFFLINE_DAEMON_ENABLED` env-flag · DEFAULT OFF for pilot per CLAUDE.md V2 Cutover Round 2 row 2026-05-29).
**Status:** Drafted 2026-05-29 · scope **V1.5+** post-pilot (zero pilot impact per § Pilot risk assessment below).
**Canonical ID prefix:** S43-

---

## 1. Scope statement

This iteration produces ready-to-sign-and-upload native app builds for **5 platforms** (iOS · iPadOS · Android · macOS · Windows) exposing **6 capability surfaces** (camera · geo · face recognition · face tagging · albums · local peer-to-peer mesh) with **offline-first execution at the venue** for Papic + Patiktok + day-of guest flows.

Architecture is **hybrid by design**:

1. **True native shells** (Swift on iOS / iPadOS · Kotlin on Android) for the Papic capture surface + at-venue P2P mesh (iteration 0012's architecture lock already specs this).
2. **Capacitor wrapper** (iOS + Android) for marketing site + wizard + dashboard + marketplace + Patiktok admin booth UI — the non-capture, non-mesh surfaces that benefit from the existing Next.js codebase running as a mobile app.
3. **Tauri wrapper** (macOS + Windows) for desktop versions of the same Next.js surfaces with native window chrome, system tray integration, and file-system access for vendor + admin power users.

Engineering ships builds + spec corpus + store metadata packages. **Owner uploads to stores when the admin chain completes** (~4–5 weeks calendar per § Owner-side admin chain). The engineering surface "parks at ready-to-sign-and-upload" so pilot 2026-06-01 is **completely unaffected** by this work — it lives on a separate worktree branched off `iscasasola/setnayan-platform` and never touches `apps/web/` production code.

---

## 2. Locked architecture + reasoning

| Decision | Status | Rationale |
|---|---|---|
| Hybrid (native Papic + Capacitor mobile shell + Tauri desktop shells) | LOCKED 2026-05-29 | Pure native everywhere = two new codebases (Swift + Kotlin) for surfaces that already work as Next.js · 5+ weeks Claude Code time + ongoing maintenance burden. Pure Capacitor with `server.url` mode = fails the offline constraint (every page load needs WiFi). Pure Capacitor with `output: 'export'` = breaks Server Components + Server Actions + ISR which most of the surface depends on. Hybrid lets Papic stay native (where offline + P2P + DSLR SDK matter) while the rest of the app rides on top of the existing web build. |
| iOS + iPadOS + Android + macOS + Windows all in V1.5+ | LOCKED 2026-05-29 ("go all 5") | Owner directive · supersedes the CLAUDE.md 2026-05-15 row's open scope question. All 5 ship together so couples + vendors + admins experience Setnayan as a unified product surface from the V1.5+ cutover day forward. |
| 6 capabilities supported on every platform with platform-appropriate fidelity | LOCKED 2026-05-29 (see [[project_setnayan_native_app_features]]) | Camera + geo + face recognition + face tagging + albums + local P2P mesh — these are the hardware-binding surfaces that distinguish native from web. Offline-first execution is non-negotiable at the venue. |
| Capacitor for mobile shells (iOS + Android non-Papic surfaces) | LOCKED 2026-05-29 | Capacitor 7 is the most mature React Native alternative for wrapping Next.js apps · TypeScript-native plugin API · solid offline support via local web assets + IndexedDB. React Native would force a rewrite of every screen; Capacitor reuses 100% of the Next.js surface where the surface is online-tolerant. |
| Tauri 2.0 for desktop shells (macOS + Windows) | LOCKED 2026-05-29 (pending pin confirmation — see OQ-2) | Tauri ships native shells at ~5MB vs Electron's ~100MB · Rust runtime · uses system WebView (WKWebView on macOS · WebView2 on Windows) so the app inherits OS security updates · multi-window support · system tray + file system APIs. Tauri 2.0 ships mobile builds too but iOS + Android already covered by Capacitor; using Tauri only for desktop keeps the per-platform tooling minimal. |
| iPadOS gets an iPad-optimized layout INSIDE the iOS app, NOT Apple Catalyst | RECOMMENDED 2026-05-29 (pending owner ratification — see OQ-3) | Capacitor projects compile to universal iOS binaries; iPadOS picks up the iOS build automatically · iPad-optimized layout via responsive CSS breakpoints (the Next.js build already handles desktop layouts well). Apple Catalyst would force a separate macOS variant which Tauri already covers more cleanly. |
| Park-at-ready-to-sign-and-upload model | LOCKED 2026-05-29 | Engineering completes builds + spec + store metadata · owner uploads when DTI + DUNS + Apple Developer Program + Google Play Console + Microsoft Store + signing certs are all live (~4–5 weeks calendar). Zero pilot impact (separate worktree). |
| Direct `.dmg` (macOS) + `.exe` (Windows) downloads at `setnayan.com/download` IN ADDITION to store distribution | RECOMMENDED 2026-05-29 (pending owner ratification — see OQ-4 + OQ-5) | Mac App Store rejection rates on Electron/Tauri-style apps are non-trivial · Microsoft Store discoverability is weak for B2B software. Direct downloads (notarized .dmg + code-signed .exe) give vendor + admin users a frictionless install path while we wait on store reviews. Stores are the primary path for consumer-facing iOS + Android. |

---

## 3. Per-platform breakdown

### 3.1 iOS (iPhone)

| Item | Lock |
|---|---|
| Minimum OS | iOS 16.0 (matches 0012 Papic native lock — pending owner ratification, see OQ-6) |
| Build tool | Capacitor 7 + Xcode 15+ · `npx cap add ios` · `npx cap sync ios` |
| Native code (Papic only) | Swift 5.9 + SwiftUI 4 · AVFoundation for capture · BGTaskScheduler for background sync · SQLite WAL via GRDB.swift · Apple Vision for face vectors · MultipeerConnectivity for at-venue mesh |
| Capacitor wrapper code (non-Papic surfaces) | TypeScript plugin code reusing Next.js routes · `output: 'standalone'` + bundled web assets for offline-tolerant reads · Server Components + Server Actions still hit production server when online |
| UI framework | Capacitor's WKWebView renders the Next.js surface · custom SwiftUI surfaces for Papic capture only |
| Distribution paths | Apple App Store (primary) · TestFlight (beta) · Apple Enterprise distribution (not pursued V1.5+) |
| Capability fidelity | All 6 — see § 4 matrix below |

### 3.2 iPadOS (iPad)

| Item | Lock |
|---|---|
| Minimum OS | iPadOS 16.0 |
| Build tool | Same Xcode project as iOS · universal binary · iPad gets iPad-optimized layout via responsive CSS (Capacitor renders the Next.js desktop-tier layout at ≥1024pt width) |
| Native code | Same as iOS · Papic capture UI stretches to iPad form factor · DSLR SDK bridging benefits from larger viewfinder real estate |
| Capacitor wrapper code | Same as iOS · responsive breakpoints adopt Next.js desktop layouts |
| UI framework | Same as iOS · Stage Manager + multi-window support via Capacitor's iPad multi-instance flag (V1.5+ enables one Setnayan window per event) |
| Distribution paths | Apple App Store (same iOS binary, iPad-marked) |
| Capability fidelity | All 6 — see § 4 matrix below |

### 3.3 Android

| Item | Lock |
|---|---|
| Minimum OS | Android 11 (API 30) — matches 0012 Papic native lock — pending owner ratification, see OQ-7 |
| Build tool | Capacitor 7 + Android Studio Giraffe+ · Gradle 8.x · `npx cap add android` · `npx cap sync android` |
| Native code (Papic only) | Kotlin 1.9 + Jetpack Compose · CameraX for capture · WorkManager for background sync · Room ORM (SQLite WAL) · ML Kit Face Detection · Google Nearby Connections API for at-venue mesh |
| Capacitor wrapper code (non-Papic surfaces) | TypeScript plugin code reusing Next.js routes · custom WebView config for offline asset loading |
| UI framework | Capacitor's WebView renders the Next.js surface · custom Jetpack Compose surfaces for Papic capture only |
| Distribution paths | Google Play (primary) · Google Play Internal Testing (beta) · APK sideload (developer only, NOT advertised to users) |
| Capability fidelity | All 6 — see § 4 matrix below |

### 3.4 macOS

| Item | Lock |
|---|---|
| Minimum OS | macOS 13 Ventura (Tauri 2.0 minimum target for WKWebView2 API parity) |
| Build tool | Tauri 2.0 · Rust toolchain 1.74+ · `cargo tauri init` · `cargo tauri build` |
| Native code | Rust bindings for system tray + file system + camera permission requests + push notifications · most of the surface runs in the bundled WKWebView |
| UI framework | Tauri's WKWebView renders the Next.js surface · system-native window chrome + menu bar + tray icon |
| Distribution paths | Direct download (.dmg, notarized via Apple Notary Service — primary for V1.5+ launch) · Mac App Store (deferred — see OQ-4) |
| Capability fidelity | Camera (low — desktop webcams) · Geo (low — no GPS, IP-only) · Face recognition (medium — on-device Vision via Rust bridge OR cloud fallback) · Face tagging (full — same DB substrate) · Albums (full — file system access enables direct R2 sync from desktop) · P2P mesh (NOT supported — desktop macOS doesn't ship MultipeerConnectivity in a usable Tauri-bindable form for at-venue mesh; falls back to WiFi LAN discovery via local mDNS) |

### 3.5 Windows

| Item | Lock |
|---|---|
| Minimum OS | Windows 10 21H2 (Tauri 2.0 minimum target for WebView2 runtime) · Windows 11 fully supported |
| Build tool | Tauri 2.0 · same Rust toolchain · `cargo tauri build --target x86_64-pc-windows-msvc` (primary) · `cargo tauri build --target aarch64-pc-windows-msvc` (ARM64 build for Surface Pro X-class devices, V1.5+ optional) |
| Native code | Rust bindings for system tray + file system + camera permission requests + push notifications · WebView2 runtime hosts the Next.js surface |
| UI framework | Tauri's WebView2 renders the Next.js surface · system-native window chrome + Windows-native title bar (acrylic + Mica on Windows 11) + system tray |
| Distribution paths | Direct download (.exe, code-signed via DigiCert or Sectigo — primary for V1.5+ launch) · Microsoft Store (deferred — see OQ-5) |
| Capability fidelity | Camera (low — desktop webcams) · Geo (low — no GPS) · Face recognition (medium — Rust ONNX runtime for face vectors OR cloud fallback) · Face tagging (full — same DB substrate) · Albums (full — file system enables direct R2 sync) · P2P mesh (NOT supported — Windows Nearby Sharing is consumer-facing and not Tauri-bindable; falls back to WiFi LAN via mDNS / Bonjour-for-Windows) |

---

## 4. Per-capability × per-platform fidelity matrix

| Capability | iOS | iPadOS | Android | macOS | Windows |
|---|---|---|---|---|---|
| **Camera** (Papic + Patiktok) | **Full** · AVFoundation + DSLR SDK | **Full** · same | **Full** · CameraX + DSLR SDK | **Low** · webcam only · no DSLR SDK | **Low** · webcam only · no DSLR SDK |
| **Geo mapping** | **Full** · Core Location · venue map | **Full** · same | **Full** · FusedLocationProvider · venue map | **Low** · IP-based only · no map UI | **Low** · IP-based only · no map UI |
| **Face recognition** | **Full** · Apple Vision (on-device, ≥0.85 confidence auto-tag) | **Full** · same | **Full** · ML Kit Face Detection (on-device, ≥0.85 confidence auto-tag) | **Medium** · Rust bridge to ONNX runtime for face vectors · same confidence thresholds · slower (~3× iOS latency, acceptable for desktop-only flows) | **Medium** · same Rust ONNX bridge · same confidence thresholds |
| **Face tagging** | **Full** · `photo_tags.source` enum: `auto_face` + `individual_qr` + `table_qr` + `manual_pick` per 0012 | **Full** · same | **Full** · same | **Full** · same DB substrate · no QR scanner on desktop (the source enum covers manual_pick + auto_face only on desktop) | **Full** · same |
| **Albums** | **Full** · 5 album surfaces (guest gallery + couple archive + Phase 4 editorial + Personal Reels + Drive sync) | **Full** · same | **Full** · same | **Full** · file system access enables couple to browse the R2 archive locally + sync to local Drive folder | **Full** · same |
| **Local P2P mesh at venue** | **Full** · MultipeerConnectivity · iOS↔iOS native bandwidth | **Full** · same · iPad↔iPhone bandwidth | **Full** · Nearby Connections API · Android↔Android native bandwidth | **NOT supported** · falls back to WiFi LAN mDNS discovery (online required) | **NOT supported** · falls back to mDNS / Bonjour-for-Windows (online required) |

**Cross-platform mesh** (iOS↔Android at the same venue): WiFi Direct (Android side) + multipeer Bonjour service (iOS side) over a shared SSID — lower bandwidth than same-platform same-OS mesh but functional for tag-sync + small thumbnails. Full original-resolution media transfer is **same-platform same-OS only** in V1.5+.

---

## 5. Custom Capacitor plugins inventory

These plugins wrap native iOS Swift + Android Kotlin APIs and expose a TypeScript interface to the Next.js Capacitor surface. All implement the existing `setnayan-platform` web build's expected API contract (e.g., `getUserMedia` shape for camera) so the same component code runs on web + iOS + Android with feature detection.

| Plugin | iOS implementation | Android implementation | Notes |
|---|---|---|---|
| `@setnayan/capacitor-camera` | AVFoundation `AVCaptureSession` + `AVCapturePhotoOutput` + `AVCaptureMovieFileOutput` | CameraX `ImageCapture` + `VideoCapture` | Wraps existing 0012 Papic native camera code · TypeScript API matches `MediaRecorder` shape so web fallback works |
| `@setnayan/capacitor-geo` | Core Location · `CLLocationManager` · `kCLLocationAccuracyBest` | FusedLocationProvider · `LocationServices.getFusedLocationProviderClient` · `Priority.PRIORITY_HIGH_ACCURACY` | Stamps `geo_lat` + `geo_lon` + `geo_accuracy_m` per 0012 metadata fields |
| `@setnayan/capacitor-biometric` | Apple Vision `VNFaceObservation` + `VNGenerateImageFeaturePrintRequest` | ML Kit Face Detection + Face Mesh | 128-d face vector extraction per 0012 § Face detection. Includes confidence-threshold computation (≥0.85 / 0.65–0.85 / <0.65) |
| `@setnayan/capacitor-multipeer` | MultipeerConnectivity framework · `MCSession` + `MCBrowserViewController` + `MCAdvertiserAssistant` | Google Nearby Connections API · `Nearby.getConnectionsClient(context)` + `Strategy.P2P_STAR` | Cross-platform fallback to WiFi Direct (Android) + Bonjour (iOS) for iOS↔Android · supports photo + tag + sync state transfer |
| `@setnayan/capacitor-dslr-canon` | EOS Camera Connect SDK (Mobile) | Same SDK Android port | One plugin per brand · supports Live View pass-through + shutter trigger + file transfer per 0012 Pro Camera Bridge spec |
| `@setnayan/capacitor-dslr-nikon` | SnapBridge SDK (legacy MTP-WiFi fallback) | Same | |
| `@setnayan/capacitor-dslr-sony` | Sony Camera Remote SDK | Same | |
| `@setnayan/capacitor-dslr-fujifilm` | Fujifilm Camera Remote SDK | Same | |
| `@setnayan/capacitor-secure-storage` | Keychain Services | Android Keystore | Stores OAuth refresh tokens + 5-cap crew device fingerprint per CLAUDE.md 2026-05-22 row 11 Unified QR Code Lifecycle Model |
| `@setnayan/capacitor-background-sync` | BGTaskScheduler · `BGProcessingTaskRequest` | WorkManager · `OneTimeWorkRequest` + `PeriodicWorkRequest` | Drains the SQLite WAL upload queue when WiFi returns · matches 0012 + 0037 Event-Day Pre-load offline daemon contract |

**Plugin count: 9** · Claude Code time per plugin: 1–3 days each · Total Claude Code time for the plugin tier: ~2 weeks.

---

## 6. Tauri configuration inventory (macOS + Windows)

| Configuration item | macOS | Windows | Notes |
|---|---|---|---|
| `tauri.conf.json` allowlist | `fs.scope: ["$HOME/Setnayan/**"]` + `notification: true` + `systemTray: true` + `globalShortcut: true` + `path: true` | Same | Tight allowlist · Setnayan only touches `~/Setnayan/` for Drive sync mirroring |
| Window config | `decorations: true` · `titleBarStyle: "Overlay"` · `transparent: false` · acrylic disabled | `decorations: true` · Mica + acrylic on Windows 11 · `decorations: true` on Windows 10 | Native chrome · system-respecting dark mode |
| System tray | Setnayan logo icon · right-click menu (Open · Switch event · Settings · Quit) | Same tray menu | Tray persists when window closed · double-click tray icon to reopen main window |
| Auto-updater | Tauri's built-in updater · signed update manifest hosted at `updates.setnayan.com/<platform>/latest.json` · key pair generated at first build (private key kept in 1Password) | Same | Updates delivered over HTTPS · signed binary verification · user prompted on next launch when update available |
| Push notifications | Apple Push Notification Service (APNs) via Tauri's notification plugin + a small Rust bridge to UNUserNotificationCenter | Windows Push Notification Service (WNS) via Tauri's notification plugin + WinRT bindings | Both wired into the same notification routing rules per iteration 0028 |
| File system access | macOS: standard NSFileManager via Rust bindings · sandboxed read/write to `~/Setnayan/` only | Windows: standard file APIs via Rust bindings · same scope | Couple's Drive-sync archive lives at `~/Setnayan/<event-slug>/` matching 0012 § 6 folder structure |
| Code signing | macOS: Developer ID Application certificate · `codesign --options runtime --sign "Developer ID Application: <Setnayan>" <app>.app` + notarytool submission | Windows: Authenticode signing via DigiCert or Sectigo cert · `signtool sign /f cert.pfx /p <password> /tr http://timestamp.digicert.com /td sha256 /fd sha256 <app>.exe` | Both certs ~$200/yr · owner-side admin chain |

**Tauri Claude Code time: ~1 week** (per-platform shells + system tray + auto-updater + push notification bridges + code-signing scripts).

---

## 7. Five-week engineering plan (Claude Code units · NOT human-engineer months)

The plan headers match TaskList Tasks #2–#6 verbatim so the spec and tasks stay in lockstep. All numbers are **Claude Code time** (engineering work Claude can do directly); calendar-bound externals are separately enumerated in § Owner-side admin chain table below.

### Week 1 — Capacitor mobile shell + Tauri desktop shells + 3 basic plugins (Claude Code time ~5 days)

| Deliverable | Claude Code time |
|---|---|
| Initialize Capacitor 7 project in a new worktree `~/Setnayan/.claude/worktrees/0052-native-apps/` off `iscasasola/setnayan-platform` main · `npx cap init Setnayan com.setnayan.app` · `npx cap add ios` + `npx cap add android` | 0.5 day |
| Configure Capacitor build to consume the existing Next.js production build · `output: 'standalone'` with bundled offline assets for the day-of + Papic + Patiktok routes · `server.url` fallback for online surfaces · feature-flag controlled via `NEXT_PUBLIC_NATIVE_SHELL_ENABLED='ios'` / `'android'` | 1 day |
| Initialize Tauri 2.0 project in same worktree under `desktop/` · `cargo tauri init` for macOS + Windows targets · base `tauri.conf.json` with allowlist + window config + system tray scaffolding | 1 day |
| Implement 3 basic Capacitor plugins (camera + geo + biometric stubs) · TypeScript plugin shells + Swift + Kotlin native skeletons that compile cleanly · plugin permission requests wired to `Info.plist` (iOS) + `AndroidManifest.xml` (Android) | 2 days |
| Smoke-test all 4 shells in simulators: iOS Simulator + Android Emulator + macOS native + Windows VM · verify Next.js production build renders + plugins respond to method calls + basic offline asset loading works | 0.5 day |

**Week 1 acceptance:** all 4 shells build cleanly · all 3 plugins respond in simulators · offline asset loading verified for at least one route · zero changes to `apps/web/` production code · pilot 2026-06-01 still completely unaffected.

### Week 2 — Face recognition plugins + P2P mesh plugins (Claude Code time ~5 days)

| Deliverable | Claude Code time |
|---|---|
| Custom Apple Vision face recognition plugin · Swift bridge for `VNGenerateImageFeaturePrintRequest` · 128-d vector extraction + confidence-threshold computation per 0012 spec · TypeScript wrapper matching the web build's face matcher API | 2 days |
| ML Kit Face Detection plugin · Kotlin bridge for ML Kit's `FaceDetector` + Face Mesh · same 128-d vector extraction + thresholds · TypeScript wrapper API matches iOS plugin | 1.5 days |
| MultipeerConnectivity plugin (iOS) · Swift bridge for `MCSession` + advertiser + browser · TypeScript API for `connect()` + `broadcast(payload)` + `subscribe(handler)` matching the existing web build's offline daemon postMessage shape | 1.5 days |
| Google Nearby Connections plugin (Android) · Kotlin bridge for `ConnectionsClient` + `Strategy.P2P_STAR` · same TypeScript API as iOS plugin so the Next.js layer code is platform-agnostic | 1.5 days |
| Smoke-test face recognition in simulators (use mock face images) + smoke-test mesh on 2 simulators paired locally (iOS Simulator + Android Emulator on same LAN) | 0.5 day |

**Week 2 acceptance:** face recognition plugins respond + emit 128-d vectors · mesh plugins discover peers in simulator + exchange test payloads · TypeScript API contracts match across iOS + Android + the web build's offline daemon.

### Week 3 — Native Papic Swift + Kotlin shells + DSLR SDK scaffolds (Claude Code time ~5 days)

| Deliverable | Claude Code time |
|---|---|
| Native Papic iOS Swift shell · port the 0012 native architecture spec to actual Swift code · SwiftUI gesture shutter + AVFoundation capture + BGTaskScheduler + GRDB SQLite WAL · runs as a separate target within the same Capacitor Xcode project · launched via deep-link from the Capacitor shell when host opens Papic | 1.5 days |
| Native Papic Android Kotlin shell · port 0012 to Jetpack Compose + CameraX + WorkManager + Room ORM · same deep-link pattern · launched from Capacitor when host opens Papic | 1.5 days |
| DSLR SDK plugin scaffolds (Canon · Nikon · Sony · Fujifilm × iOS + Android) · stub plugins that compile + respond to plugin method calls but return "SDK approval pending" until brand Pro programs approve · TypeScript wrapper API matches existing 0012 `CameraBridge` interface | 1 day (8 stubs collectively · they're shells not full implementations) |
| Wire native Papic shells to the existing Capacitor secure-storage plugin for seat token + crew device fingerprint | 0.5 day |
| Smoke-test native Papic capture in simulators (phone camera path only, DSLR SDKs are stubs) + smoke-test the deep-link handoff from Capacitor shell → native Papic shell + back | 0.5 day |

**Week 3 acceptance:** native Papic Swift + Kotlin shells build cleanly · gesture shutter works in simulator · DSLR SDK plugin scaffolds compile + respond (stubbed) · deep-link handoff iOS Capacitor → iOS Native Papic verified · same on Android.

### Week 4 — iPadOS layout + macOS/Windows UI polish + Simulator/Emulator testing (Claude Code time ~5 days)

| Deliverable | Claude Code time |
|---|---|
| iPadOS layout pass · responsive CSS breakpoints tuned for ≥1024pt width · multi-column layouts on event-home + Plan grid + marketplace + Papic capture (larger viewfinder + side-panel tag drawer) · iPad Stage Manager multi-window flag enabled (V1.5+ feature: one Setnayan window per event) | 1.5 days |
| macOS UI polish · native menu bar (File · Edit · View · Window · Help) wired via Tauri menu API · system tray icon + right-click menu (Open · Switch event · Settings · Quit) · acrylic disabled on macOS 13+ to match Setnayan editorial palette per CLAUDE.md 2026-05-29 row "Clean Editorial palette" | 1 day |
| Windows UI polish · native title bar (Windows 11 Mica + acrylic where supported) · system tray icon + same right-click menu · WebView2 dark mode auto-switch wired to OS theme | 1 day |
| Simulator + Emulator + VM testing pass · run all 4 shells through canonical pilot scenarios: sign in · open event home · run wizard Card 01 · open marketplace · open Papic + capture photo + view in album · simulate offline mode + verify cached routes still render | 1.5 days |

**Week 4 acceptance:** iPadOS layout looks coherent at iPad dimensions · macOS + Windows look like native apps not "browser-in-a-window" · simulator + VM testing pass shows all routes work in online + offline modes.

### Week 5 — Store metadata packages + final spec polish + status anchors + decision-log row + .docx mirror (Claude Code time ~5 days)

| Deliverable | Claude Code time |
|---|---|
| App Store Connect metadata package · screenshots (5 required sizes × iPhone + iPad) · app description (EN + TL) · keywords · age rating · privacy nutrition labels per Apple App Tracking Transparency · all packaged into a single ZIP for owner to upload when Apple Developer Program completes | 1.5 days |
| Google Play Console metadata package · same screenshots in Google's required dimensions + 1024×500 feature graphic + 512×512 hi-res icon + app description (EN + TL) + content rating questionnaire answers · packaged as ZIP | 1 day |
| Microsoft Store metadata package · same screenshots in Microsoft's required dimensions + app description + age rating · packaged as ZIP | 0.5 day |
| Mac App Store metadata package · ditto · packaged as ZIP (held until owner picks Mac App Store path per OQ-4) | 0.5 day |
| Direct-download infrastructure at `setnayan.com/download` · download page already exists per 2026-05-14 CLAUDE.md row · update to surface .dmg + .exe download buttons + checksums + signing certificate fingerprint · auto-generated from build artifacts | 0.5 day |
| Final spec polish (this file) · status anchor updates (V1_Gap_Analysis_Status.md · App_Build_Status.md · Installed_Stack_Inventory.md · API_Integration_Checklist.md) · decision-log row landed · .docx mirror regenerated via pandoc | 1 day |

**Week 5 acceptance:** all 4 store metadata packages ready to upload · direct-download page updated · spec + status anchors + decision-log all current · `.docx` mirror generated.

**Total Claude Code time: 5 weeks (~25 working days).** Calendar wall-clock will run longer because of parallel admin chain — see § Owner-side admin chain below.

---

## 8. Owner-side admin chain (parallel calendar work)

These are externals Claude Code cannot accelerate. The chain runs in **parallel** with Weeks 1–5 above so the total calendar to "ready to ship to first user" is the max of Claude Code time + the longest admin chain item, not the sum.

| Admin item | Claude Code time | Calendar time (owner-side) | Notes |
|---|---|---|---|
| DTI Business Name Registration (Setnayan) | 0 | 1 day online via BNRS | Required for D-U-N-S which Apple Developer requires |
| D-U-N-S Number (Dun & Bradstreet) | 0 | 1–14 days (free request via Apple's dunsRequest portal) | Apple Developer Program enrollment blocker · free if requested via Apple's dunsRequest URL · paid ~₱500 if requested direct from D&B |
| Apple Developer Program enrollment ($99/yr) | 0 | 1–7 days after D-U-N-S lands | Required for App Store + Mac App Store + Apple Notary Service for direct .dmg distribution |
| Google Play Console one-time signup ($25) | 0 | 1–2 days | Required for Google Play distribution |
| Microsoft Store one-time signup ($19) | 0 | 1–2 days | Required for Microsoft Store distribution |
| Apple Notary Service (for direct .dmg) | 0 | 0 calendar (instant via notarytool API) | Per-build signing · owner runs once Apple Developer Program is live |
| DigiCert OR Sectigo code-signing cert (for direct .exe) | 0 | 1–3 days for cert issuance after KYC | ~₱11,000/yr (~$200/yr) · DigiCert is faster issuance · Sectigo is cheaper |
| Apple App Store review | 0 | 1–7 days (typical · longer for first submission) | Per submission · owner uploads metadata package + binary via App Store Connect |
| Google Play review | 0 | 1–2 days (typical) | Per submission · owner uploads via Google Play Console |
| Microsoft Store review | 0 | 1–3 days (typical) | Per submission · owner uploads via Microsoft Partner Center |
| Mac App Store review | 0 | 1–7 days (typical · higher rejection rate for Tauri/Electron-style apps) | Optional · direct .dmg distribution is the primary path |
| DSLR SDK Pro program approvals (Canon · Nikon · Sony · Fujifilm) | 1–2 days per brand for plugin wire-up after SDK access granted | **4–12 weeks per brand** for Pro program approval (slowest chain item) | NOT a launch blocker · DSLR SDK plugins ship as stubs in V1.5+ initial cut · Pro Camera Bridge feature lights up per brand as approvals land |

**Calendar bottom line for V1.5+ launch:** ~4–5 weeks wall-clock if owner starts the admin chain on day 1 of Week 1 above. DSLR SDK Pro program approvals run in parallel and light up post-launch as they land.

---

## 9. Distribution paths summary

| Platform | Primary path | Secondary path | Beta path |
|---|---|---|---|
| iOS / iPadOS | Apple App Store | — | TestFlight |
| Android | Google Play | — | Google Play Internal Testing |
| macOS | Direct .dmg at `setnayan.com/download` (notarized via Apple Notary Service) | Mac App Store (deferred — see OQ-4) | — |
| Windows | Direct .exe at `setnayan.com/download` (code-signed via DigiCert/Sectigo) | Microsoft Store (deferred — see OQ-5) | — |

---

## 10. Park-at-ready-to-sign-and-upload model

Engineering produces:

1. **Builds** — iOS `.ipa` (App Store Connect upload format), Android `.aab` (Google Play upload format), macOS `.dmg` (notarized, ready for direct distribution), Windows `.exe` (code-signed, ready for direct distribution).
2. **Spec corpus** — this iteration file (`0052_native_apps_delivery.md`) + `.docx` mirror.
3. **Store metadata packages** — 4 zips (App Store · Google Play · Microsoft Store · Mac App Store) per § 7 Week 5.
4. **Direct-download surface** — updated `setnayan.com/download` page with platform-detected download CTAs.

Engineering **does not**:

- Submit any binary to any store (owner action gated on admin chain completion).
- Upload any metadata package to any store dashboard.
- Generate or rotate any signing certificate (owner-side cert procurement).
- Touch `apps/web/` production code (separate worktree).
- Push or modify any migration on `setnayan-prod` (V1.5+ schema additions, if any, ship via dedicated push after pilot stabilizes).

This separation lets engineering run independently of admin calendar. When admin chain completes (~4–5 weeks calendar), owner uploads the prepared binaries + metadata packages and announces availability via existing 0028 email channels + the marketing site `setnayan.com/download` page.

---

## 11. Pilot risk assessment

**Zero pilot impact.** Reasoning:

1. All engineering work runs on a **separate worktree** branched off `iscasasola/setnayan-platform` main at the start of Week 1. The worktree is at `~/Setnayan/.claude/worktrees/0052-native-apps/` and does not feed back into `apps/web/` production until V1.5+ cutover day (post-pilot).
2. The Capacitor + Tauri shells consume the existing Next.js production build via `output: 'standalone'` — they are **downstream consumers** of the web build, not modifiers of it.
3. The new Capacitor plugins are isolated TypeScript + Swift + Kotlin code in the worktree; they do not ship to the web build until the web build's feature-detection layer is wired to them (also post-pilot).
4. The 6 capabilities the V1 web build already supports (camera via `getUserMedia` · geo via `navigator.geolocation` · face recognition via MediaPipe · etc.) continue to work in V1 pilot exactly as today; the native plugin tier is **additive fidelity upgrade** for V1.5+, not a V1 dependency.
5. Pilot cohort (5–20 personal/family per [[project_setnayan_pilot_timeline]]) exercises the web build through their browsers; they do not need (and will not see) the native shells.
6. Pilot launches 2026-06-01 · V1.5+ native shells cutover targeted ~6–8 weeks later after admin chain + 5-week Claude Code engineering complete.

**Worst-case pilot failure modes this iteration could introduce:** none. The worktree is fully isolated.

---

## 12. Cross-references

| Iteration | Cross-reference |
|---|---|
| **0012 Papic** | Native architecture lock at § Architecture Lock (Swift + Kotlin · SQLite WAL · BGTaskScheduler/WorkManager · Apple Vision / ML Kit · DSLR SDK matrix) — this iteration ports the lock to actual code in Week 3 |
| **0017 Patiktok** | Booth offline behavior — Capacitor shell hosts the booth UI · capture goes through the camera plugin · video files queue in IndexedDB until WiFi returns |
| **0031 Day-of guest** | PWA shell shipped via PR #284 · iteration 0052 inherits the same offline contract for guest landing page when launched from the native Capacitor shell |
| **0037 Event-Day Pre-load** | IndexedDB cache + service-worker offline daemon — Capacitor shell reuses the same `prefetchEventBundle()` + `PRELOAD_ASSETS` postMessage shape · native plugins wire into the same offline daemon contract |
| **0035 Observability** | Sentry SDK per-runtime · this iteration adds Capacitor + Tauri runtimes · DSN injected via Capacitor env config + Tauri config |
| **V2 Phase G** | IndexedDB + service-worker offline daemon (`NEXT_PUBLIC_OFFLINE_DAEMON_ENABLED` env-flag · DEFAULT OFF for pilot per CLAUDE.md 2026-05-29 row "V2 Cutover Round 2") · this iteration is the native-app surface that benefits most from Phase G's offline scaffolding |
| **CLAUDE.md 2026-05-15 row** | "V1 platform expansion — native apps on Windows · macOS · iOS · iPadOS · Android added to launch scope" — this iteration is the V1.5+ engineering deliverable for that lock |
| **CLAUDE.md 2026-05-18 row 8** | "V1 launches as personal/family pilot first" — this iteration explicitly stays deferred per the pilot-first posture · zero pilot impact |
| **CLAUDE.md 2026-05-22 row 11** | "Unified QR Code Lifecycle Model" — native shells consume the same QR architecture · 5-cap crew device fingerprint per native shell |
| **CLAUDE.md 2026-05-29 row "Clean Editorial palette"** | All 5 native shells consume the `--m-*` tokens · iOS + iPadOS + Android via Capacitor's WebView · macOS + Windows via Tauri's WebView2 / WKWebView |
| [[project_setnayan_native_app_features]] | Canonical 6-capability spec + offline-first constraint + hybrid architecture rationale |
| [[feedback_setnayan_claude_code_timeline_units]] | Timeline format convention — all numbers in this spec are Claude Code units, NOT human-engineer months |
| [[project_setnayan_pilot_timeline]] | Pilot-then-cutover sequencing · 2026-06-01 pilot launch · V1.5+ cutover post-stabilization |
| [[project_setnayan_v2_1_canonical]] | V1.5+ scope discipline · v2.1 brief is canon for product surface decisions native shells must match |

---

## 13. Acceptance criteria

Per-platform smoke-test contract verifying the iteration delivers a usable native build on every platform:

### iOS (iPhone)

- [ ] `npx cap sync ios && npx cap open ios` opens a working Xcode project that builds cleanly for `iPhone 15 Pro` simulator
- [ ] App launches in simulator · renders Next.js production build · sign-in flow works
- [ ] Camera plugin responds to `getUserMedia`-equivalent call · simulator returns the mock front camera feed
- [ ] Geo plugin responds with simulated location · `geo_lat` + `geo_lon` populated
- [ ] Face recognition plugin emits a 128-d vector for a test image fed via the simulator's photo library
- [ ] MultipeerConnectivity plugin advertises a service · discoverable by a second simulator running the same build on the same LAN
- [ ] Offline-mode smoke test: disable simulator network · open day-of guest route · cached HTML + assets render
- [ ] Native Papic Swift shell launches via deep-link from Capacitor shell · gesture shutter responds to taps · capture lands in SQLite WAL
- [ ] DSLR SDK Canon plugin scaffold responds to method calls with "pending SDK approval" placeholder result

### iPadOS (iPad)

- [ ] Same Xcode project builds cleanly for `iPad Pro 12.9-inch (6th generation)` simulator
- [ ] App renders iPad-optimized layout · multi-column Plan grid · larger Papic viewfinder · side-panel tag drawer
- [ ] Stage Manager multi-window flag enabled · second instance launches for second event (verified in simulator)
- [ ] All 6 capability plugins respond identically to iOS smoke tests

### Android

- [ ] `npx cap sync android && npx cap open android` opens a working Android Studio project that builds cleanly for `Pixel 7 Pro` emulator (API 34)
- [ ] App launches in emulator · renders Next.js production build · sign-in flow works
- [ ] CameraX plugin responds to capture method · emulator returns the mock camera feed
- [ ] FusedLocationProvider plugin responds with simulated location
- [ ] ML Kit Face Detection plugin emits a 128-d vector
- [ ] Nearby Connections plugin advertises a service · discoverable by a second emulator on the same virtual network
- [ ] Offline-mode smoke test passes · cached routes render
- [ ] Native Papic Kotlin shell launches via deep-link · Jetpack Compose gesture shutter responds · capture lands in Room SQLite WAL
- [ ] DSLR SDK plugin scaffolds respond with placeholder result

### macOS

- [ ] `cargo tauri build` produces a notarizable `.dmg` for macOS 13+
- [ ] App launches on macOS · renders Next.js production build · sign-in flow works
- [ ] System tray icon appears · right-click menu (Open · Switch event · Settings · Quit) works
- [ ] Camera permission request fires on first camera-using route · webcam feed renders
- [ ] File system access lets Setnayan write to `~/Setnayan/<event-slug>/` only · attempting other paths fails the allowlist
- [ ] Push notification test fires via Tauri notification plugin
- [ ] Auto-updater test: launch with mock outdated version · update prompt appears · update applies + relaunches

### Windows

- [ ] `cargo tauri build --target x86_64-pc-windows-msvc` produces a code-signable `.exe` for Windows 10 21H2+
- [ ] App launches in Windows VM · renders Next.js production build · sign-in flow works · WebView2 runtime auto-installs if absent
- [ ] System tray icon appears · right-click menu works
- [ ] Mica + acrylic title bar renders on Windows 11 · standard title bar on Windows 10
- [ ] Camera permission request + webcam feed work
- [ ] File system access scoped to `%USERPROFILE%\Setnayan\` only
- [ ] WNS push notification test fires
- [ ] Auto-updater test passes

### Capability matrix verification (per § 4)

- [ ] All 6 capabilities × 5 platforms tested per the fidelity matrix · "Full" cells produce expected output · "Medium" + "Low" cells fall back to documented behavior · "NOT supported" cells fall back to web-build defaults

### Store metadata packages

- [ ] App Store Connect ZIP contains all required screenshots (iPhone + iPad sizes) + descriptions + privacy labels
- [ ] Google Play ZIP contains all required screenshots + feature graphic + content rating answers
- [ ] Microsoft Store ZIP contains required screenshots + descriptions
- [ ] Mac App Store ZIP contains required screenshots + descriptions (held until OQ-4 resolved)

---

## 14. Open questions / decisions surfaced during drafting

These need owner ratification **before Week 1 engineering starts**. Defaults (recommendations) are documented inline so the engineering agent can proceed with the lean defaults if owner is silent at start-of-Week-1.

| ID | Question | Recommended default | Block? |
|---|---|---|---|
| **OQ-1** | ✅ **RESOLVED 2026-05-29.** Iteration number collision — CLAUDE.md 2026-05-15 row proposed `0043_native_apps_delivery` for native apps, but CLAUDE.md 2026-05-19 row 425 (V1.1 content engine) actually used 0043 for Wedding Type Picker first. Owner picked **Option B** on resolution turn: renumber native apps to **0052** (next free slot after the V1.1 + V1.2 iterations · `0043_wedding_type_picker.md` stays unchanged). Native apps spec folder + file renamed from `0043_native_apps_delivery/` → `0052_native_apps_delivery/` · all internal references updated · lower corpus churn than the alternative (renaming Wedding Type Picker would have touched 0044/0045/0046/0047/0048 cross-references in the locked V1.1 content engine spec set). | N/A · resolved | No · resolved |
| **OQ-2** | Tauri version pin — Tauri 2.0 was released April 2026 · ships mobile builds (which we don't need · Capacitor covers mobile) + desktop. Tauri 1.x is the LTS line through end-2026. Recommended: pin Tauri 2.0 for desktop because the WebView2 + WKWebView APIs are more current and the auto-updater is improved. | Tauri 2.0 | No · default OK |
| **OQ-3** | iPadOS layout via responsive CSS inside iOS app OR Apple Catalyst variant? Recommended: responsive CSS inside iOS Capacitor build. Catalyst would force a separate macOS variant that Tauri already covers more cleanly. | Responsive CSS inside iOS Capacitor build | No · default OK |
| **OQ-4** | macOS distribution — direct .dmg only, OR direct .dmg + Mac App Store? Recommended: direct .dmg only for V1.5+ initial cut. Mac App Store rejection rates on Tauri-style apps are non-trivial and the direct download via `setnayan.com/download` is more frictionless for the target B2B audience (vendors + admins). Mac App Store can ship in V1.5+1 once we have a stable direct-download baseline. | Direct .dmg only | No · default OK · revisit V1.5+1 |
| **OQ-5** | Windows distribution — direct .exe only, OR direct .exe + Microsoft Store? Recommended: direct .exe only for V1.5+ initial cut. Microsoft Store discoverability is weak for B2B software and the certification process adds friction. | Direct .exe only | No · default OK · revisit V1.5+1 |
| **OQ-6** | iOS minimum OS — iOS 16.0 (matches 0012 Papic native lock) or iOS 17.0 (more current Vision + MultipeerConnectivity APIs)? Recommended: iOS 16.0 to match 0012 and capture the broadest device base. iOS 17 features are not load-bearing for V1.5+. | iOS 16.0 | No · default OK |
| **OQ-7** | Android minimum OS — Android 11 (API 30 · matches 0012 Papic native lock) or Android 12 (API 31, slightly larger Compose surface)? Recommended: Android 11 to match 0012 and PH market device base (Android 11 still dominant in PH). | Android 11 (API 30) | No · default OK |
| **OQ-8** | Cross-platform iOS↔Android mesh fidelity — full-resolution media transfer OR thumbnail + tag-sync only? Recommended: thumbnail + tag-sync only for V1.5+. Full-resolution iOS↔Android transfer is unreliable across vendor SDKs; same-OS mesh handles the high-bandwidth case. Couples needing cross-platform full-res mesh wait for V1.6+ which can revisit once we have pilot mesh-usage data. | Thumbnail + tag-sync only · same-OS mesh handles full-res | No · default OK |
| **OQ-9** | Native shell cutover day — coordinate with V2 publisher cutover (target ~2026-06-15 to 2026-06-25 per CLAUDE.md V2 Cutover Round 2 row) OR ship as a separate post-V2-stabilization milestone? Recommended: ship as separate post-V2-stabilization milestone · target ~6–8 weeks after pilot launch · gives V2 publisher surface time to stabilize before adding new native-shell surface. | Separate post-V2-stabilization milestone | No · default OK |
| **OQ-10** | Setnayan Productions video calls (Daily.co OR Twilio Video per v2.1 brief § 11) on native shells — wrap existing JS SDK via Capacitor or use native SDK? Recommended: wrap the JS SDK via Capacitor for V1.5+ initial cut · native SDK integration is a V1.6+ polish item if pilot data shows JS SDK performance issues on mobile. | Wrap JS SDK via Capacitor | No · default OK |

**Owner action requested:** none blocking. OQ-1 resolved 2026-05-29 (Option B · native apps renumbered to 0052). OQ-2 through OQ-10 ride their recommended defaults unless owner objects before respective deliverable date.

---

## 15. Companion files

| Path | Purpose |
|---|---|
| `0052_native_apps_delivery.md` | This file — engineering spec corpus |
| `0052_native_apps_delivery.docx` | `.docx` mirror — regenerate via pandoc once owner ratifies OQ-1 + at Week 5 status-anchor pass per established convention |
| `tests.md` | Per-platform acceptance criteria mirror of § 13 — to be added at Week 5 |
| `fixtures.json` | Sample build metadata + signing certificate fingerprints — to be added at Week 5 |
