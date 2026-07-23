# Container App Strategy — Model Council Verdict (2026-07-13)

> **Question (owner):** "Our app runs as a website. Can we *continue* it into installable
> desktop/mobile apps by wrapping the **same web codebase in a container** — not by building
> a whole separate native app? And does the container work with **all** our features?"
>
> **Method:** 5-lens design council (Capacitor architect · native-capture skeptic · PWA/web-platform
> expert · desktop/Tauri + cost · App Store compliance) grounded in the real repo, synthesized by a chair.
> Verdicts unanimous on architecture; one lens flagged App Store *policy* (not capability).

---

## Verdict: **YES — and it is already the committed architecture, already scaffolded.**

One hosted web codebase + three container shells reaches **every notable feature**. Exactly **two**
capabilities need isolated native plugins (never a separate app). The real gate to an iOS ship is
**Apple policy** (in-app-purchase + privacy label), **not** the container.

The repo already proves the pattern is real, not theoretical:

| Shell | What it is | State |
|---|---|---|
| **PWA** | `apps/web/public/manifest.json` + `sw.js` — installable, offline SW | Wired, ships today |
| **Desktop** | `src-tauri/` Tauri (macOS `.dmg` + Windows `.msi`), in `build-desktop.yml` | Wired, publishing |
| **Mobile** | `apps/mobile/` Capacitor v8 **remote-URL** shell (iOS + Android added) loading `www.setnayan.com` | Scaffolded, compile-verified, **not device-tested** |

All three render the **same hosted `setnayan.com`**, so ~99% of the product — every Server Action,
API route, UI change — ships with **one `git push` to Vercel, no rebuild, no store resubmit.** That
live-reload benefit is the whole reason for the remote-URL model (the app is `output: 'standalone'`
with 111 Server Actions + 60 API routes + Supabase-middleware auth, so it **cannot** be static-exported).
This is the locked architecture in the mobile README's own words: **"true-native Papic + Capacitor shell
for the rest."**

---

## Feature coverage matrix

**Delivery layer** = the lowest layer that can serve it. **Status** = works today / needs wiring / needs native code / true gap.

### Works today, inside the WebView / PWA (no native code)
- **Papic capture** — rear cam + gesture shutter + **5-second hard-cap** clips — `lib/use-papic-camera.ts` (`getUserMedia` + `MediaRecorder` 5000 ms). Runs unchanged in WKWebView/Android WebView.
- **QR tagging** — `lib/qr-scan.ts` prefers `BarcodeDetector` (Android), falls back to bundled **jsQR** on iOS off the same stream. Slower on old iPhones, fully functional.
- **Face-enroll selfie** — `selfie-capture.tsx` on-device `face-api`; only 128-d vectors leave the device (RA 10173-friendly). Dormant until `NEXT_PUBLIC_FACE_MODEL_URL` is hosted (asset gap, not container gap).
- **Panood livestream publish** — WebRTC rear-cam publish, owner-flag-gated.
- **Foreground upload queue → R2** — durable IndexedDB queue (`papic-drain.ts`, 7-day TTL), drains on reconnect. **No data loss.**
- **Live-reload across all 3 shells · SSO cookie persistence · service-worker offline · account deletion (Apple 5.1.1(v)) · PWA install · iOS camera/mic/photo permission strings · desktop `.dmg`/`.msi` · desktop OAuth via system browser · Guideline 4.2 app-first entry** — all wired.

### Needs wiring (web-layer or provisioning, reaches all shells at once)
- **Capture metadata (`geo_*`, `device_model`)** — schema + columns exist but the capture path never calls `getCurrentPosition`/stamps device. Pure web fix, container-independent. *(RA 10173 relevance.)*
- **Deep links / App Links** — handler + real `apple-app-site-association` wired, but `public/.well-known/assetlinks.json` still has a **placeholder SHA256** → Android autoVerify fails until the release cert fingerprint is filled in.
- **Web Push (VAPID)** — `lib/web-push.ts` + `sw.js` ready; no-ops until `NEXT_PUBLIC_VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` are set (iOS web push only in an **installed** PWA).
- **Android `.aab` lane** — `build-android.yml` produces a signed bundle; needs keystore secrets + `POST_NOTIFICATIONS` permission.
- **macOS notarization** — logic present, gated on 6 `APPLE_*` secrets.

### Needs native code (isolable to a plugin)
- **Native push end-to-end (FCM/APNs)** — `apps/mobile/src/push.ts` written but never imported by web; `app/api/notify` **stubs** native. Not a review blocker (push optional) but a primary native-app justification.
- **Offline fallback page wiring** — branded `www/index.html` exists; per-platform error hook unfinished.

### True gaps (genuinely native — still NOT a separate app)
- **True background upload (app suspended)** — WKWebView has no Background Sync. Isolable to **one** background-transfer plugin draining the existing IDB queue. **Non-blocking** (durable queue + foreground drain is the everyday path).
- **DSLR Camera Bridge (Canon/Nikon/Sony/Fujifilm WiFi-SDK)** — no JS API drives a vendor camera SDK. Isolable to **one** native plugin behind the already-locked CameraBridge protocol. Phone-camera fallback ships all of Papic without it; paid ₱499/day Phase-2 add-on.
- **iOS in-app digital purchases** — see owner decision #1 below (Apple 3.1.1). **This is the real iOS gate.**
- **Windows/macOS signing** — provisioning + cost, no architecture change.

---

## Most efficient build path (from current scaffold to shipping)

| Phase | Goal | Effort |
|---|---|---|
| **0 · Sync + on-device QA** | `npm install` + `npx cap sync` in `apps/mobile`; then prove capture/clip/QR/selfie/back-nav/cookie-survival on a **real iPhone + Android** (currently compile-verified only) | M |
| **1 · PWA launch** | Ship the installable **PWA today, zero store dependency** — core Papic + planning already work with coded fallbacks. Add an iOS "Add to Home Screen" sheet | S |
| **2 · Web-layer gaps** | Set VAPID keys · wire geo/device metadata in the capture path · hook the offline error page — reaches all shells at once | M |
| **3 · Native push** | Import `push.ts` from a native-only effect · implement FCM+APNs send in `/api/notify` · add `google-services.json` + APNs key + `POST_NOTIFICATIONS` | M |
| **4 · Android store lane** | Real assetlinks SHA256 · keystore secrets · Play Data Safety form | M |
| **5 · iOS compliance + submit** *(owner-gated)* | **Make the 3.1.1 call first** · add `NSLocationWhenInUseUsageDescription` · reconcile `/privacy` biometrics + nutrition label · add `build-ios.yml` (Mac runner) · reviewer notes + demo account for the 4.2 wrapper risk | L |
| **6 · Desktop hardening** | Notarization secrets · Windows OV/EV cert · path-filter the publish job · decide update policy | M |
| **7 · Deferred native plugins** | Background-to-R2 plugin + DSLR CameraBridge native side — **if** event-scale demands. Do **not** build a separate app | XL |

---

## Owner decisions (surfaced — not silently made)

1. **Apple Guideline 3.1.1 posture for iOS digital SKUs** *(the single decision that dictates the whole iOS submission)*: Setnayan AI ₱499, Animated Monogram ₱999, Papic seats, Save-the-Date openings, Editorial Pro are unlocked in-app via **external GCash/BDO** with no StoreKit. Choose (a) integrate StoreKit IAP, (b) hide in-app buy CTAs/prices in the Capacitor build (UA-detectable "reader" posture — fast, fragile), or (c) apply for the External-Purchase-Link entitlement. **Real-world vendor bookings (0% commission, off-platform) are IAP-exempt and stay.**
2. **Privacy reconciliation** — the live `/privacy` currently **denies biometrics** while face-enroll ships. Both stores reject inaccurate privacy declarations, and it is an RA 10173 disclosure gap (the DPO is the owner). Approve updating `/privacy` + both store privacy forms before enabling face detection in any store build. *(Ties to the 2026-07-13 privacy gap register.)*
3. **Paid credentials** — Apple Developer membership (iOS + macOS notarization) + Windows OV/EV cert (~$200–500/yr) + confirm the Android keystore. One-time cost, no architecture change.
4. **Desktop update policy** — `tauri-plugin-updater` (silent) vs documented "re-download from `desktop-latest`" (recommended; the shell is near-static because the app is remote).
5. **Background upload** — build the native plugin now, or accept foreground-only (durable queue) for launch. Does **not** block shipping.
6. **DSLR Camera Bridge** — confirm it stays Phase-2 and the ₱499/day SKU is **gated/hidden** until the plugin ships (only internal + mock bridges exist today).

---

## Top risks

| Sev | Risk | Mitigation |
|---|---|---|
| High | Apple 3.1.1 — external-pay digital SKUs, no IAP | Owner call #1 before submit; reader-posture is cheapest |
| High | Privacy-label/behavior mismatch (biometrics) | Reconcile `/privacy` + store forms before face detection ships |
| High | Native push stubbed + VAPID unset → zero push on device | Set VAPID now; complete FCM/APNs; email + Realtime are fallbacks |
| High | Android App Links placeholder SHA256 → deep links open browser | Insert real release cert SHA256, redeploy, verify with Google's tester |
| Med | Guideline 4.2 "just a website" | Native camera + App Links + app-first login; reviewer notes + demo account; PWA fallback |
| Med | Shell compile-verified, **not device-tested** | Mandatory Phase-0 on-device QA before any store push |
| Med | iOS geo silently denied (no `NSLocation` string) | Add the string now; geo best-effort + outbound-strip |
| Med | Background upload stalls on a pocketed iPhone at a weak-WiFi venue | Durable 7-day queue = no loss; add "N shots still uploading" banner; Phase-7 plugin if needed |
| Low | Remote-code ↔ native-shell version skew | Capability-**detect** every bridge, never version-assume; treat plugin changes as coordinated shell releases |

---

## Lens disagreements (reconciled)

- **Architecture verdict unanimous** among the 4 capability lenses (all "works-with-native-plugins"); the compliance lens alone said "partial" — strictly about passing App Store *review*, not feature reach. **The container reaches all features; store policy is a separate, decision-gated gate.**
- **Background upload — hard blocker or plugin gap?** Chair: genuinely native (WebView can't background-execute) but isolable to one plugin and **non-blocking** for launch thanks to the durable queue.
- **Geo-metadata gap weight** — Chair sides with PWA/compliance lenses: a real spec-compliance hole, but a **web-layer** fix independent of the container decision.
- **DSLR bridge maturity** — Chair adopts the skeptic's honesty: no brand bridge is implemented (only internal + mock), so "works with ALL features" over-promises the Camera Bridge SKU until a plugin ships. **Gate/hide the SKU until then.**

---

*Council run: 5 lenses + chair, 6 agents, grounded in `apps/web` + `apps/mobile` + `src-tauri` @ `main` c6a5f1e03.*
