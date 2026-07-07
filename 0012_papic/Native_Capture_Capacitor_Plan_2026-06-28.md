# Papic Native Capture — Capacitor Plan (2026-06-28)

> **Group C of the Papic completion program.** Recommendation: **Capacitor** (not the parallel Expo app). ⚠ The Capacitor-vs-Expo fork is load-bearing — flagged for owner sign-off (see [[project_setnayan_native_app]] + [[project_setnayan_native_shell_capacitor]]).

## Why Capacitor (the recommendation)

The Capacitor shell **already exists and wraps the hosted site** (`apps/mobile`; Android built, iOS pending Xcode — [[project_setnayan_native_shell_capacitor]]). Crucially:

- The **web Papic capture already runs in the Capacitor webview** (gesture shutter, QR tagging, the locked event look).
- **A1's offline queue (IndexedDB + foreground drain) works in the webview too** — so a venue WiFi blip is already handled inside the native shell on Android.

That means the **core of "native capture" is effectively already delivered on Android** by reusing everything we shipped. The Expo app would be a from-scratch RN rewrite that throws that reuse away. Capacitor keeps one codebase and adds only the genuinely-native deltas as plugins.

## What's actually left (the native-only deltas)

These need native plugin code + on-device iteration + a store binary — owner-gated on Apple/Google accounts + review ([[project_setnayan_app_store_submission]]):

- **C1 — true background upload.** The webview foreground drain (A1) covers "app open during the event." A native plugin (Android `WorkManager` / iOS `BGProcessingTask`) drains the queue while the app is backgrounded/screen-locked. Reuses A1's queue contract directly.
- **C1 — native camera quality.** Optional: a native capture plugin for higher fidelity / faster shutter than `getUserMedia` in the webview. Lower priority — the webview path is already shipping.
- **C2 — Canon native-Android Camera Bridge.** The Canon CCAPI bridge core shipped (#1239, [[project_setnayan_camera_bridge]]); native-Android wiring rides on the Capacitor app. Nikon/Sony/Fuji stay V2 (no usable mobile-WiFi SDK — research-locked).

## Owner-action gate

1. **Confirm Capacitor** over Expo (one word) — unblocks all of C and lets me retire the Expo track ambiguity.
2. **Store review accounts** are already activated ([[project_setnayan_app_store_submission]]); each C ship = a store binary → review (flag native-shell resubmissions per [[feedback_setnayan_flag_appstore_resubmission]]).

## Sequence once confirmed

C1 background-upload plugin (reuses A1 queue) → optional native camera plugin → C2 Canon native-Android bridge. Each is a native binary → store review, called out as an App Store/Play resubmission.
