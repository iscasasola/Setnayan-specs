# Camera Bridge — Build Plan (2026-06-11)

> Owner-extended scope (2026-06-11): the bridge serves THREE capture surfaces — **Papic + Panood + Patiktok**. Planned via an 18-agent grounded/judged/adversarially-verified workflow against shipped `origin/main` + real vendor-SDK research. Supersedes the optimistic parts of the 0012 "Pro Camera Bridge" section (symmetric 4-brand matrix · Sprint 4-5 order · the Panood WebRTC→SFU target).
>
> **✅ SHIPPED 2026-06-11 — C1+C2 (PR #1239) AND the M1 chain S0+O1+U1 (PR #1243), both merged.** `apps/web/lib/camera-bridge/`: the core protocol + `MockBridge` + the pairing FSM + **`papic-sink.ts`** (S0 — DI'd deliverCapture over the SHIPPED seat pipeline; infra failures queue offline, server rejections never do) + **`internal-bridge.ts`** (the phone camera as the real 5th impl/fallback); the **real `camera_bridge` offline drain** (O1 — Phase-G stub replaced); the **dark-launched seat-page bridge panel** (U1 — `?bridge=demo`: pair Demo DSLR → live view → still/5s-clip → real gallery → simulate drop → instant phone-fallback + null-stamped gap shots → restore). **29/29 deterministic unit tests**; transport correction (BLE→WiFi) landed with #1239. ⭐ **The M1 "demoable, no hardware" milestone is reached in code.** Remaining now-track: K1a SKU schema (owner Q1–Q3) + the Patiktok/Panood mock adapters; the gated track (Canon SDK · EOS body · N1 native binary · field test) starts on owner sign-offs.

## Camera Bridge — Build Plan (DSLR phone-as-bridge × Papic · Panood · Patiktok)

### 0. The one-paragraph reality (read first)

Camera Bridge is **NOT BUILT** — verified shipped = scaffolding only: 3 inactive SKU rows (`sku-catalog.ts:236-272`, all `isActive:false`, ₱99/day · ₱249/day · ₱2,499/yr), a 16-line offline stub (`camera-bridge-handler.ts:11-16` returns `{ok:false, error:'V1.x post-pilot'}`), `v2-catalog.ts:106` = `CAMERA_BRIDGE: 'not_built'`, plus telemetry/IndexedDB plumbing. The shipped "native" app is a **Capacitor remote-URL WebView** (`capacitor.config.ts` loads `www.setnayan.com`) with **zero native capture code** — vendor SDKs are native libraries with no browser API, so the WebView **cannot host Camera Bridge**. To ship you need four things that don't exist: a **real native capture binary**, the **brand-agnostic `CameraBridge` core**, **per-brand WiFi-SDK adapters**, and the **per-surface sink pipelines** (Papic/Patiktok/Panood — themselves stubs). Estimates below are **Claude-Code time** only; **calendar-bound externals** (vendor approvals, hardware, store review) are split into their own track and are NOT compressible by agent time. **No price is invented** (§6).

> **Two corpus-overriding findings.** (1) The 4-brand parallel axis is a trap — only **Canon** is buildable as phone-over-WiFi today; the corpus "Sprint 4 Canon+Sony / Sprint 5 Nikon+Fuji" would burn effort on 3 unbuildable lanes. (2) "Reuse the existing pipeline" is **false** — all three surface pipelines are stubs, so Camera Bridge has no built consumer; the per-surface sinks are **prerequisites layered under** the bridge, not parallel siblings. (3) Note the cited 0012 Sprint 4-5 build order is denominated in **human-engineer-weeks across 2 engineers** (`0012_papic.md:844` ≈16 wks) — all estimates HERE are re-expressed as single-agent Claude-Code time and are not derived from that headcount figure.

---

### 1. Per-brand feasibility (research-verified — this drives everything)

| Brand | Verdict | Reality | V1 action |
|---|---|---|---|
| **Canon** | 🟢 **GREEN** | CCAPI = HTTP-over-WiFi REST, genuinely cross-platform (iOS+Android), stills + live-view JPEG-pull + movie start/stop. The only true mobile-WiFi capture API. | **Build first, alone, as the reference brand.** Body: **Canon EOS R6 Mark II** (or R8). |
| **Fujifilm** | 🟡 **YELLOW (conditional)** | Camera Control SDK added **Android only** in v1.32 (Jan 2025), **USB-only (not WiFi)**, **no iOS**, and the EULA **voids the camera warranty** (vendors pair their own/rented bodies). | Defer; pursue only if owner accepts Android-only + warranty-waiver legal track. Body: **Fuji X-T5**. Fuji×iOS is **impossible at the SDK level** — never reaches iOS parity. |
| **Sony** | 🔴 **RED** | Camera Remote SDK (CrSDK) is **desktop-only** — Win/macOS/Linux-ARM binaries; **no iOS/Android**. | **Not a scheduling delay — a capability gap.** No mobile SDK exists to license. V2 only via a Linux/SBC venue sidecar (a different product — breaks phone-as-bridge; unscoped/uncosted). |
| **Nikon** | 🔴 **RED** | **No public mobile capture SDK.** SnapBridge is a closed consumer app; the developer SDK (MAID/Mobile) is USB/desktop. | Same as Sony — capability gap, not a delay. |

> **Headline caveat:** V1 Camera Bridge = **Canon bodies only**. A vendor arriving with Sony/Nikon/Fuji gets nothing in V1. The owner's "runs on all three surfaces" is a SURFACE promise, not a brand promise. (Sources: Canon developercommunity.usa.canon.com CCAPI; Sony support.d-imaging.sony.co.jp CrSDK platform page; Fujifilm fujifilm-x.com camera-control-sdk warranty statement + v1.32 changelog.)

---

### 2. Architecture — the two-sided plug

Adopt the corpus protocol verbatim (`0012_papic_sdk_notes.md:9-24`). The key invariant makes brands × surfaces **additive (1+3), not multiplicative (4×3)** — but ONLY because surfaces dispatch by **OUTPUT TYPE, not brand**:

```
   SOURCE side (brands)              CORE                          SINK side (surfaces)
 ┌────────────────────────┐  ┌──────────────────────────┐  ┌───────────────────────────────┐
 │ CanonBridge (CCAPI) 🟢 │  │ CameraBridge protocol     │  │ PapicSink   files → gallery   │
 │ InternalBridge (AVF/   │─►│  + DslrPairing FSM        │─►│ PatiktokSink stream → record  │
 │   CamX) = fallback +   │  │  + transit/WAL + overlay  │  │ PanoodSink  stream → publish  │
 │   THE 5th impl         │  │  + 3s disconnect-fallback │  │             (target = §5)      │
 │ MockBridge (CI/dev)    │  └──────────────────────────┘  └───────────────────────────────┘
 │ [Fuji 🟡 Android-USB]  │   gesture→trigger map:
 │ [Sony/Nikon 🔴 V2 only]│   Tap=still · Drag-up=still+flash · Drag-right=5s clip
 └────────────────────────┘            │
                  ┌────────────────────┴─────────────────────┐
        triggerStill/triggerClip → FILE          livePreview() → STREAM
                  │                                      │
                  ▼                          ┌───────────┴───────────┐
            PAPIC (files)                PATIKTOK (record)      PANOOD (publish)
```

**The load-bearing dispatch boundary (lock as invariant):** file-producing methods (`triggerStill`/`triggerClip`) feed the **Papic sink**; the `livePreview()` stream feeds the **Panood and Patiktok sinks**. A new brand implements only `CameraBridge` (one class) and inherits all 3 sinks; a new surface implements only a sink and inherits all viable brands. Neither axis may silently become multiplicative.

- **`InternalCameraBridge`** (phone's own AVFoundation/CameraX sensor) is a first-class 5th impl: it IS the disconnect-fallback target AND lets the full pipeline+UI be CI-tested before any DSLR/SDK exists.
- **`MockBridge`** (CI+dev) emits canned 720p frames + fixture JPEG/MP4 so the entire now-track runs with zero hardware.

---

### 3. Workstream breakdown

Labels: **C** core · **S0/Sx** sinks · **N** native · **B** brand · **K** catalog/SKU · **O** offline · **U** UI.

#### NOW-TRACK — software-only, build today against MockBridge (zero hardware, zero approvals)

| ID | Workstream | Claude time | Depends on |
|---|---|---|---|
| **C1** | `CameraBridge` interface + **MockBridge** — protocol per `0012_papic_sdk_notes.md:9-24`: `connect/disconnect/livePreview()→AsyncStream<VideoFrame>/triggerStill(flash)/triggerClip(durationMs,light)/setFocusPoint/readSettings` + capabilities + `status{disconnected\|pairing\|live\|recording}`. Mock emits canned frames + fixtures. **Root of the now-track; lands solo first.** | **3–5 d** | — |
| **S0** | **Minimal Papic sink** — file → WAL → R2 → `papic_photos` INSERT → gallery render. **TRUE prerequisite for the M1 demo** (the shipped Papic pipeline is a getUserMedia stub — there is no built consumer). | **3–5 d** | C1 (file type only) |
| **C2** | `DslrPairing` **state machine** — `disconnected→pairing→live→recording→fallback`; auto-retry 5s; **fallback to `InternalCameraBridge` within 3s**; gap-captures stamped `paired_camera_brand=null`. **Per-surface fallback semantics** (see §5b). | **2–3 d** | C1 |
| **O1** | **Transit-upload handler** — replace the stub: file "arriving from a paired body" → WAL → S0 → R2 + `papic_photos`. **Fix WiFi-only drift** (stub says "USB/WiFi tether"; USB is V2). | **2–3 d** | C1, S0 |
| **U1** | **Pairing UI + Live-View overlay + disconnect banner** — brand picker → SSID scan → SDK handshake → capability download → test shot (≤90s); viewfinder chrome (storage/upload chips, tag drawer, gesture shutter); "Camera disconnected — switching to phone camera" banner. Mock-driven. **Plus the 1:1 guard UX** (§3b). | **2–3 d** | C1 |
| **K1a** | **SKU schema + plumbing** (now-buildable half): rewrite `dslr_pairings_one_target_chk` to a **3-way XOR** {papic_seat_id, panood_camera_id, **patiktok_booth_id**}; add `patiktok_booth_id` col+index; **repoint `bridge_unlock_id` from the RETIRED `token_transactions` to `service_orders`** (0034 spine); **land/confirm the `panood_cameras` table** that `panood_camera_id` dangles against (bare UUID, no FK today); cart→checkout plumbing. Migration applied in-session via `supabase db push`. | **2–3 d** | owner Q1/Q2/Q3 |
| **S-Papic-adapter** | Route Mock stills/clips into S0. **Lowest-risk surface; reference adapter.** | **2 d** | C1, S0 |
| **S-Patiktok-adapter** | Route Mock take into booth record. **Mock-buildable for plumbing only;** real output gated on the unbuilt Patiktok render pipeline (booth record + face-anchor crop + 3s compile) — list as explicit prerequisite, NOT reuse. | **2–3 d** | C1 (+ Patiktok render pipeline) |
| **S-Panood-adapter** | Route Mock live-preview into a live-publish path. **Buildable on mock; real arch UNRESOLVED (§5).** | **2–4 d** | C1 (+ §5 decision + Panood broadcaster) |

> **NOW-track total: ~20–29 Claude-Code days.** After C1+S0 land serially (the head), C2/O1/U1/S-adapters/K1a fan out across **parallel agents** → ~**2.5–3 calendar weeks** of Claude-Code time. The 2.5–3wk figure depends on multi-agent dispatch; without it, widen to ~4 weeks.

#### GATED-TRACK — native runtime + hardware + vendor approval (own calendar clock, start day one)

| ID | Workstream | Claude time | Calendar-bound external |
|---|---|---|---|
| **N1** | **Android true-native capture binary** (Kotlin/CameraX) = `InternalCameraBridge`, proves the pipeline with **zero DSLR**. Decompose: (a) project scaffold ~2d · (b) CameraX viewfinder + gesture shutter + last-5 strip ~4d · (c) SQLite WAL + EXIF/geo/NTP stamp + adaptive compress ~4d · (d) ML Kit on-device face detect ~3d · (e) WorkManager R2 upload ~3d. **Fix manifest: BLE→WiFi perms** (`ACCESS_WIFI_STATE/CHANGE_WIFI_STATE/CHANGE_NETWORK_STATE/NEARBY_WIFI_DEVICES`), drop `@capacitor-community/bluetooth-le`, plan **dual-AP** (control-AP + cellular/venue-WiFi upload). | **~2–3 wk** | Real Android device (all native code compile-verified only, never device-run). Toolchain at `~/.setnayan-toolchain` (JDK21+SDK36). |
| **N2** | **iOS true-native binary** (Swift/AVFoundation), mirror of N1 with same sub-decomposition. **Off the V1 critical path — Android-first.** `ios/` does not exist. | **+~1.5–2 wk** | macOS+Xcode+CocoaPods to scaffold `ios/`; Apple Developer Program ($99/yr + D-U-N-S). Canon×iOS works; **Fuji×iOS impossible.** |
| **B-Canon** | `CanonBridge` over CCAPI (HTTP-over-WiFi). Stills + live-view JPEG-pull + movie start/stop. **The reference brand.** | **3–5 d** behind C1+N1 | **Canon Developer Programme** (account 3–5 biz days · CCAPI access ~2–3 wk · NDA). **Body: Canon EOS R6 Mark II.** |
| **B-Fuji** | `FujifilmBridge` — **conditional** (R3). Android-USB-only, no iOS, warranty-void. | **3–5 d** | Fuji SDK + signed commercial license before public launch + warranty-waiver legal track. Body: **Fuji X-T5.** |
| **G-Field-test** | **Field Test Protocol** (first-class deliverable, §4). | — (Claude builds harness) | Real EOS body in a venue RF environment. |
| **G-Review** | **App-store review of the native binary** (distinct from the Capacitor-shell review). Terminal gate — Apple Guideline 4.2 / Google minimum-functionality. | — | 1 review cycle each post-feature-complete + possible reject-and-resubmit. |

#### K1b — activation half (gated behind real fulfillment)

Flip `isActive:true` + bind-to-fulfillment is gated behind **M3** (real fulfillment exists). Do NOT ship a buyable SKU with no fulfillment. K1b is NOT now-track.

---

### 4. Field Test Protocol (first-class, calendar-gated, runs at M3)

A dedicated protocol with explicit pass/fail bars — these numbers decide whether the product ships:
- **Pairing reliability:** ≥95% pair success within 90s, in a congested 2.4/5GHz wedding-venue RF environment.
- **Still/clip transit latency:** p50/p95 targets per artifact over WiFi.
- **Live-view quality (go/no-go for Patiktok + Panood):** sustained fps + glass-to-YouTube latency bar. CCAPI live-view is a **low-fps JPEG-pull, not broadcast H.264** — this is the make-or-break test.
- **Dual-AP:** camera-control AP simultaneous with cellular/venue-WiFi upload.
- **Resilience:** survive 30+ reconnect cycles; battery-drain ceiling.
- **Live-view framing for Papic (UX, not just streaming):** if fps is too low to frame candids, ship a "point-and-fire" mode using the phone's own preview as a rough framing aid — validate as part of M3, not deferred.

---

### 5. Panood live-video — DIFFERENT model, currently UNRESOLVED (owner decision)

**Panood is the least-feasible claim in the spec — two failures stack:**
1. **Stale target architecture.** The 0011 bridge diagram (`0011_panood.md:425-443`) routes DSLR→phone→WebRTC→Cloudflare Stream Live SFU→ffmpeg compositor→RTMP-to-master. **That entire stack was RETIRED** in the 2026-05-16 BYO-YouTube pivot (`0011:21,116`). V1 = couple OAuths their own YouTube; Setnayan hands one feed via RTMP — and even that broadcaster is `TODO(0011)`. The phone-as-bridge target the Camera Bridge section assumes **no longer exists.**
2. **Physics.** Real DSLR livestreaming is HDMI-capture/USB-webcam, never a vendor WiFi SDK to a phone. Even Canon CCAPI live-view is a low-fps JPEG viewfinder pull. "DSLR → phone WiFi → RTMP → YouTube" may be unachievable at acceptable quality/latency on **any** brand.

**Recommendation:** build the Panood adapter on mock to prove plumbing, but (a) owner defines the BYO-YouTube ingest path (most plausibly: phone re-encodes the DSLR live-view and pushes RTMP **directly to the couple's YouTube**, no SFU), and (b) gate real go/no-go on the **M3 live-view field test**. If it fails the bar, the honest V1 outcome is "phone-internal camera for Panood live; DSLR for Papic stills/clips + Patiktok takes only." **Panood ships LAST.**

**5b. Per-surface disconnect fallback (the single FSM is not enough):**
- **Papic:** seamless swap to phone sensor, captures stamped `paired_camera_brand=null` (handled).
- **Patiktok:** a take in progress when the DSLR drops — **keep recording on the phone sensor with a seam marker, never lose the take.**
- **Panood:** a LIVE broadcast cannot 3s-gap silently — viewers see a freeze. The fallback **MUST maintain stream continuity** (phone re-encode keeps RTMP alive) or show a "technical difficulties" card. This raises the Panood feasibility bar further and feeds the §5 go/no-go.

**5c. Stream-surface coupling:** Patiktok AND Panood are **both** live-source surfaces sharing one unvalidated assumption (CCAPI live-view quality). So 1 file-surface (Papic) is independently shippable; **2 stream-surfaces are a single coupled bet** gated on one field test. Pull that test into M3, not M5 — know the Patiktok/Panood go/no-go before sinking adapter effort into both.

---

### 6. SKU / catalog reconciliation — owner sign-off BEFORE any checkout wiring

**Five contradictory representations coexist. Do NOT invent a price.**

| Family | Where | Price | Model |
|---|---|---|---|
| A. Legacy shared | `pro_camera_bridge_addon` (0012/0011) | ₱1,499–1,500 | one purchase, any surface |
| B. Papic 3-tier (SHIPPED, `isActive:false`) | `sku-catalog.ts:236-272` | ₱99/day · ₱249/day · ₱2,499/yr | per-surface, Papic-only |
| C. Panood-specific | 0011 / Pricing.md:167 | ₱199/slot/day | per-surface |
| D. Patiktok-specific | 0017:172-173 | ₱49/day + ₱249/yr | per-surface |
| E. Live-site flat | Pricing.md:67, `v2-catalog.ts` | ₱1,999 "Connect DSLR to Papic and Panood" | one flat SKU |

The **2026-05-17 lock** (`0012_papic.md:126`) explicitly **de-shared** the SKU into per-surface tiers — contradicting family A AND the flat ₱1,999 live SKU. **Plus a 6th schema contradiction:** `dslr_pairings.bridge_unlock_id` references the **RETIRED `token_transactions`** (customer wallet 0003 is dead) — must repoint to `service_orders` (0034), part of K1a. **Three questions to lock (M0):**
- **Q1 (model):** one cross-surface unlock (family A — matches owner's "all three" framing · recommended default) **vs** per-surface SKUs (2026-05-17 lock)?
- **Q2 (price):** canonical price — ₱1,999 flat / ₱1,499 legacy / the ₱99–₱2,499 tiers? **No authoritative price exists — do not invent one.**
- **Q3 (Patiktok):** live SKU says "Papic and Panood" only → Patiktok must be added as a target (schema fix in K1a).

---

### 7. Live Wall — correct the brief premise

`v2-catalog.ts:107` = `LIVE_WALL: 'not_built'` ("WebSocket display surface not built"). There is **no automatic DSLR→wall path** to slot against. Real relationship: Camera Bridge → S0 writes the canonical `papic_photos` row; Live Wall, when later built, subscribes to that same table. **Camera Bridge has zero net-new Live Wall work** IF S0 writes the canonical row with the same `event_id`/seat tagging the wall query filters on. Flag Live Wall as a downstream consumer to coordinate, not a shipped integration.

---

### 8. Dependency graph — critical path vs parallel tracks

```
  ┌──── DAY-ONE CALENDAR TRACK (start immediately, parallel) ────────────────────────┐
  │ Canon Dev Programme + CCAPI (~3-5 biz days acct → ~2-3 wk SDK, NDA) ≈ 4-6 wk      │
  │ Fuji SDK + commercial license + warranty-waiver legal [conditional, indeterminate]│
  │ Sony/Nikon = NO mobile SDK → owner fork (R1), don't engineer                      │
  │ Hardware: Canon EOS R6 II FIRST (serializing resource) · Fuji X-T5 (if forked)    │
  │ iOS env: macOS + Xcode + CocoaPods + Apple Developer Program ($99 + D-U-N-S)       │
  └───────────────────────────────────────────────────────────────────────────────────┘
                                   │ feeds B-Canon / B-Fuji / G-Review / G-Field-test
  K1a (owner Q1/Q2/Q3) ─┐         ▼
                        ▼  ╔══════════════ CRITICAL PATH (single serial chain) ══════════════╗
                           ║ C1 core+Mock ─► S0 Papic sink ─► N1 Android native ─► B-Canon   ║
                           ║ (~4d)          (~4d)            (~2.5wk, THE bottleneck) (~4d)   ║
                           ╚════╪══════════════╪════════════════════════╪════════════════════╝
                    mock-backed │              │ real-device runtime     │ real hardware
        ┌───────────────────────┼──────────────┼──────────┬─────────────┴────────┐
        ▼                       ▼              ▼          ▼                        ▼
  C2 fallback FSM        S-Patiktok      S-Panood    ⭐ M1 DEMO          ⭐⭐ M3 THIN VERTICAL
  O1 transit             (+render        (§5 +        (mock, no HW)      Canon × Papic stills,
  U1 overlay/1:1 guard    pipeline)       broadcaster) │                  real EOS body + field test
        │                                              │                        │
        └──────────────────────────────────────────────┘                        ▼
                                                                M4 Canon×Patiktok → M5 Canon×Panood
   N2 iOS (parallel, longer pole, OFF crit-path) ──► iOS adapters ──► G-Review ──► LAUNCH
```

**Honest critical path = a single serial chain: C1 (~4d) → S0 (~4d) → N1 Android (~2.5wk) → B-Canon (~4d) → M3** ≈ **5–6 Claude-Code weeks before ANY real-hardware parallelism exists.** Everything else parallelizes only AFTER this chain or only on mock. **N1 is the chokepoint** — it gates all brands, all real-hardware surface validation, AND the fallback mechanism.

**Genuine parallel axes (corrected):** (1) surfaces over shared core+mock — but 2 of 3 (Patiktok+Panood) are one coupled stream-bet; (2) NOW-buildable (mock) ∥ GATED (hardware/SDK); (3) calendar tracks alongside all software work; (4) brands parallelize only across brands with a mobile SDK = effectively **Canon (+ maybe Fuji)**, not four.

**Shared-hardware contention:** one EOS body **serializes all real-hardware work** (M3/M4/M5 + iOS device runs + the field test). Either budget 2 bodies to parallelize Android-Papic vs the live-view field test, or accept strict serialization on one body.

---

### 9. Native shell — what's actually needed

`apps/mobile` is a **Capacitor remote-URL WebView** loading `setnayan.com` (`capacitor.config.ts`) with zero native capture code. Vendor SDKs are native libs with no browser API → the shell **cannot host Camera Bridge**. Per the locked hybrid (owner 2026-05-29) the answer is a **true-native capture binary** (Swift + Kotlin); `server.url` mode is explicitly "INSUFFICIENT" for at-venue offline capture. Per the **0052 app-independence model**, this is the **independent native Papic app (category A)**, not the shell — wire the 4-pillar linking contract (SSO via setnayan-platform · deep-link back Universal/App-Links/`setnayan://` for pairing-purchase + gallery · one-backend-thin-client · graceful-degrade). This scopes N1/N2 as the Papic-app capture module with Panood/Patiktok adapters as sinks inside it.

**Transport-correction (own day-one workstream — correctness landmine, not cleanup):** THREE shipped artifacts disagree on transport — `capacitor.config.ts` names "Bluetooth LE" as the bridged hardware, `AndroidManifest.xml:66-73` declares BLE perms "for DSLR pairing" with **zero WiFi perms**, and the offline stub says "USB/WiFi tether." The **locked transport is WiFi-SDK** (USB is V2; BLE cannot carry image/video at all). Correct all three BEFORE N1 starts so the binary is built against WiFi from line one; remove `@capacitor-community/bluetooth-le` entirely.

---

### 10. Milestones + first demo

| Milestone | Contents | Gate | Time |
|---|---|---|---|
| **M0 — Decisions locked** | Owner answers Q1/Q2/Q3 (SKU), §5 (Panood path), R1 (brand fork: Canon-only vs sidecar), DSLR ownership, iOS-vs-Android-first, 0052 packaging | owner | — |
| **M1 — DEMOABLE, no hardware ⭐** | C1+S0+C2+O1+U1+S-Papic on MockBridge. **Demo:** "Pair camera" → mock handshake → fake live-view in overlay → gesture-fire → fixture JPEG flows through S0 → lands in gallery → yank the mock → auto-fallback banner within 3s. *Proves the architecture with zero cameras/SDKs.* | now-track only | **~2.5–3 cal. wks** |
| **M2 — SKU live + transit wired** | K1a migration (3-way XOR + Patiktok target + bridge_unlock_id→service_orders + panood_cameras landed); real transit handler; cart→checkout→bind | K1a + owner | **+~3–4 d** |
| **M3 — THIN VERTICAL ⭐⭐** | N1 Android binary + CanonBridge (CCAPI) + EOS R6 II: pair → gesture shutter fires the DSLR → JPEG/clip over WiFi → tagged in gallery. **Runs the Field Test Protocol** (incl. live-view go/no-go for Patiktok+Panood). **The headline de-risk — validates pairing, transit latency, CCAPI behavior, the binary, AND the stream-surface feasibility all at once.** | N1 + Canon SDK + EOS body | **~5–6 wk crit-path** |
| **M4 — Canon × Patiktok** | DSLR recorded take → booth/face-anchor/3s-compile (Patiktok render pipeline as prerequisite). **Only if M3 live-view passes.** | M3 field test + Patiktok pipeline | **+~1 wk** |
| **M5 — Canon × Panood (gated)** | Live feed → couple's YouTube via RTMP — **only if §5 field test passes** + stream-continuity fallback works | §5 + broadcaster + field test | **+~1 wk** |
| **M6 — iOS parity (Canon) + Fuji (if forked) + store-reviewed launch** | N2 iOS binary (Canon only — Fuji never reaches iOS); Fuji license if in scope; Apple + Google review | G-Review (terminal) + Fuji legal | calendar-gated |

**First deliverable = M1** (entirely Claude-Code time, simulator-only). **First de-risk gate = M3** thin vertical (one feasible brand × Papic stills on real hardware + the field test), built AFTER the full mock chain so the only new variables at M3 are the real SDK + body + RF environment.

---

### 11. Risks + de-risking order (cheapest/most-blocking first)

| # | Risk | Sev | De-risk |
|---|---|---|---|
| R1 | **Only Canon is buildable phone-as-bridge.** Sony/Nikon = no mobile SDK (capability gap, not delay); Fuji = Android-USB-only + warranty-void + no iOS. | **Critical** | **FIRST: owner fork** — Canon-only V1, defer the rest to V2; the only non-Canon path is a Linux/SBC venue sidecar = a different, unscoped product. Don't engineer non-Canon until resolved. |
| R2 | **Panood-via-bridge** — retired SFU target + DSLR-livestream physics + low-fps CCAPI live-view. Patiktok shares the same wall. | **High** | Resolve §5 ingest path; build on mock only; **field-test live-view at M3** before committing Patiktok/Panood scope. Panood ships last. |
| R3 | **Fuji EULA voids warranty** (vendors pair rented bodies). | **High** | Start commercial-agreement + warranty-waiver legal track day one if Fuji is in scope; explicit consent copy — or drop Fuji. |
| R4 | **"Reuse existing pipeline" is false** — all 3 sinks are stubs; M1's gallery-landing silently assumes a Papic sink that doesn't exist. | **High** | S0 (minimal Papic sink) is the TRUE now-track root, ahead of O1/S-Papic. Patiktok/Panood adapters wait on their own render/publish pipelines (explicit prerequisites, not reuse). |
| R5 | **Native binary is the bottleneck** (WebView can't host SDKs; iOS unscaffolded). | **High** | C1+MockBridge first so all UI/adapter work proceeds hardware-free; start N1 Android immediately; iOS off the critical path (Android-first). |
| R6 | **SKU drift (5 families + dead token FK)** blocks checkout; no authoritative price. | **Med** | Lock Q1/Q2/Q3 in M0 + repoint bridge_unlock_id→service_orders in K1a before any binding. **Do not invent a price.** |
| R7 | **Vendor approvals + body procurement = the long calendar pole**, not compressible. Corpus 2-6wk are optimistic floors. | **Med** | Start all registrations + Canon body acquisition day one. Launch is bounded by the slowest of {Canon SDK ~4-6wk, Fuji license, body in hand, store review}, never by code-complete. |
| R8 | **Patiktok newly in scope, under-specced** — schema CHECK actively rejects a 3rd target; no render pipeline. | **Low–Med** | 3-way XOR + patiktok_booth_id in K1a; Patiktok render pipeline as explicit prerequisite; inherits R2 live-view risk. |
| R9 | **App-store review of the native binary** (distinct from shell review) — Apple 4.2 / Google min-functionality may reject after feature-complete. | **Low–Med** | The native capture+pairing flow is what justifies the binary; budget a full cycle + possible reject-resubmit. |
| R10 | **All native code is compile-verified only, never device-run**; one body serializes hardware work. | **Low** | Every native deliverable carries an un-discounted real-device gate; budget 2 bodies or accept serial hardware milestones. |
| R11 | **DSLR ownership unresolved** (couple-owned vs Setnayan-staffed). Couple-owned + Canon-only means non-Canon owners get nothing. | **Med** | M0 decision — recommend Setnayan-blessed-body (one known EOS) so SDK+field-test surface collapses to one model; pairing UI tells incompatible-body users "bring a supported Canon or use phone-internal." |

---

### TL;DR

- **V1 Camera Bridge = CANON bodies only** — on Papic (stills/clips, confirmed) + Patiktok/Panood pending one CCAPI live-view field test. Sony/Nikon/Fuji bodies are unsupported in V1 (no mobile SDK exists for Sony/Nikon; Fuji is Android-USB-only + warranty-void). The corpus 4-brand parallelism is optimistic and would waste effort on 3 unbuildable lanes.
- **The real parallel axis is SURFACES, not brands** — and even there, Patiktok+Panood are one coupled stream-bet gated on a single live-view field test. The two-sided plug makes brands×surfaces additive (1+3) only because surfaces dispatch by output type (file vs stream).
- **Critical path / bottleneck = the true-native capture binary + the shared CameraBridge core.** A single serial chain (C1→S0→N1→B-Canon→M3) ≈ 5–6 Claude-Code weeks before any hardware parallelism exists. Camera Bridge **cannot be parallelized first.**
- **Buildable NOW (~2.5–3 wks, zero gates):** CameraBridge interface + MockBridge + minimal Papic sink + pairing FSM + Live-View overlay + disconnect-fallback + transit handler + SKU/schema plumbing + all 3 mock adapters → a **fully interactive, demoable Camera Bridge in a simulator (M1)** before a single DSLR is bought or a vendor account approved.
- **Where the 0012 spec is optimistic:** the symmetric 4-brand SDK matrix · the 2-6wk approval timelines · Panood's retired WebRTC→SFU pipeline · the "reuse existing pipeline" premise (the per-surface pipelines are themselves unbuilt) · the cited Sprint 4-5 order is in human-engineer-weeks (≈16wk/2 engineers), not Claude-Code time.

**Key files (absolute):** `/tmp/setnayan-read2/apps/web/lib/offline/service-handlers/camera-bridge-handler.ts:11-16` (stub, wrong "USB/WiFi tether" comment) · `/tmp/setnayan-read2/apps/web/lib/sku-catalog.ts:236-272` (3 `isActive:false` SKUs ₱99/₱249/₱2,499) · `/tmp/setnayan-read2/apps/web/lib/v2-catalog.ts:106-107` (`CAMERA_BRIDGE` + `LIVE_WALL` both `not_built`) · `/tmp/setnayan-read2/apps/mobile/capacitor.config.ts` (remote-URL WebView, names "Bluetooth LE") · `/tmp/setnayan-read2/apps/mobile/android/app/src/main/AndroidManifest.xml:66-73` (BLE perms, no WiFi perms) · `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0012_papic/0012_papic_sdk_notes.md:9-24` (CameraBridge protocol) · `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0012_papic/0012_papic_migration.sql:135-165` (dslr_pairings — 2-way XOR CHECK rejects Patiktok; bridge_unlock_id → RETIRED token_transactions; panood_camera_id has no FK) · `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0012_papic/0012_papic.md:126,844` (per-surface SKU lock; 16-human-week build order) · `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0011_panood/0011_panood.md:21,116,425-443` (retired SFU pipeline) · `/Users/icecasasola/Documents/Claude/Projects/Setnayan/0017_patiktok/0017_patiktok.md:172-173` (Patiktok SKUs) · `/Users/icecasasola/Documents/Claude/Projects/Setnayan/Pricing.md:67` (flat ₱1,999 SKU).

---

## Now-buildable batch (zero hardware · zero approvals)

- C1 — CameraBridge interface + MockBridge (root of the now-track; lands solo first; emits canned 720p frames + fixture JPEG/MP4 so everything downstream runs hardware-free)
- S0 — minimal Papic sink (file → WAL → R2 → papic_photos INSERT → gallery render); the TRUE now-track root the M1 gallery-landing demo depends on (shipped Papic is a getUserMedia stub with no built consumer)
- C2 — DslrPairing state machine (disconnected→pairing→live→recording→fallback; 5s auto-retry; 3s fallback to InternalCameraBridge; gap-captures stamped paired_camera_brand=null) WITH per-surface fallback semantics (Papic seamless / Patiktok keep-take-on-phone+seam / Panood stream-continuity)
- O1 — transit-upload handler (replace the {ok:false,'V1.x post-pilot'} stub; file-from-paired-body → WAL → S0 → R2 + papic_photos; FIX the WiFi-only drift, drop the 'USB tether' comment)
- U1 — pairing UI + Live-View overlay + disconnect-fallback banner (brand picker → SSID scan → handshake → capability download → ≤90s test shot; viewfinder chrome; 'switching to phone camera' banner; 1-phone:1-DSLR guard UX) — all mock-driven
- K1a — SKU schema + plumbing: rewrite dslr_pairings_one_target_chk to a 3-way XOR {papic_seat_id, panood_camera_id, patiktok_booth_id}; add patiktok_booth_id col+index; repoint bridge_unlock_id from the RETIRED token_transactions to service_orders (0034); land/confirm the panood_cameras table; cart→checkout plumbing (apply via supabase db push in-session) — gated only on owner Q1/Q2/Q3, no wall-clock
- S-Papic-adapter — route Mock stills/clips into S0 (lowest-risk surface; reference adapter)
- S-Patiktok-adapter — route Mock take into booth record (mock plumbing only; real output gated on the unbuilt Patiktok render pipeline, listed as explicit prerequisite)
- S-Panood-adapter — route Mock live-preview into a live-publish path (mock plumbing only; real arch unresolved per §5)
- Transport-correction workstream — replace BLE perms with WiFi perms (ACCESS_WIFI_STATE/CHANGE_WIFI_STATE/CHANGE_NETWORK_STATE/NEARBY_WIFI_DEVICES) in AndroidManifest.xml, remove @capacitor-community/bluetooth-le, fix the capacitor.config.ts 'Bluetooth LE' comment — must land before N1 starts

## Calendar-bound externals (start day one; not compressible by agent time)

- Canon Developer Programme registration + CCAPI/SDK access — account approval ~3-5 business days, SDK access ~2-3 weeks, NDA → allow ~4-6 weeks wall-clock to first real Canon capture (START DAY ONE)
- Canon EOS R6 Mark II (or R8) body — procurement lead time; this single body SERIALIZES all real-hardware work (M3/M4/M5 + iOS device runs + field test) — budget a 2nd body to parallelize Android-Papic vs the live-view field test
- Fujifilm Camera Control SDK — CONDITIONAL: signed commercial license required before public launch + warranty-waiver legal track (EULA voids the camera body warranty); Android-only, no iOS — indeterminate lead time; Fuji X-T5 body if forked
- Sony / Nikon — NO mobile capture SDK exists to register for or license (Sony CrSDK desktop-only; Nikon SDK USB/desktop) — capability gap, not a procurement item; do not schedule
- iOS toolchain — macOS + Xcode + CocoaPods to scaffold the non-existent ios/ directory + Apple Developer Program ($99/yr + D-U-N-S number) — confirm a true-native iOS build env exists before committing a parallel iOS schedule
- Real Android device for N1 (all native code is currently compile-verified only, never device-run); toolchain reusable at ~/.setnayan-toolchain (JDK21 + Android SDK36)
- App-store review of the native capture binary (distinct from the existing Capacitor-shell review) — Apple Guideline 4.2 + Google minimum-functionality, ~1 review cycle each AFTER feature-complete, budget a possible reject-and-resubmit
- Venue RF field test — a real wedding-venue-grade congested 2.4/5GHz environment to validate pairing reliability, transit latency, dual-AP, and (critically) CCAPI live-view fps/latency for the Patiktok+Panood go/no-go

## Owner sign-offs pending

- BRAND FORK (most load-bearing): lock V1 = Canon-only phone-as-bridge. Sony/Nikon have NO mobile capture SDK and Fuji is Android-USB-only + warranty-void — engineering any non-Canon brand before this decision is wasted effort. The only non-Canon path is a Linux/SBC venue sidecar = a DIFFERENT, unscoped/uncosted product that breaks the phone-as-bridge architecture.
- SKU reconciliation — 3 questions, no authoritative price exists (DO NOT let me invent one): Q1 model = one cross-surface unlock (matches your 'runs on all three' framing) vs per-surface SKUs (the 2026-05-17 de-share lock); Q2 canonical price = ₱1,999 flat / ₱1,499 legacy / the ₱99-₱2,499 shipped tiers; Q3 Patiktok must be added as a 3rd target (live SKU text says 'Papic and Panood' only).
- Panood BYO-YouTube ingest path — the 0011 WebRTC→SFU target was retired; define the replacement (most plausibly phone re-encodes the DSLR live-view and pushes RTMP directly to the couple's YouTube, no SFU). Panood real go/no-go is gated on a CCAPI live-view field test on a real EOS body — it may be infeasible at acceptable quality on any brand; honest fallback = phone-internal camera for Panood live, DSLR only for Papic + Patiktok.
- DSLR ownership — couple-owned/guest-brought bodies vs a Setnayan-blessed body. Given Canon-only feasibility, recommend a Setnayan-blessed single EOS model so the SDK + field-test surface collapses to one body and incompatible-body users get a clear 'bring a supported Canon or use phone-internal' message.
- iOS-vs-Android-first — recommend Android-first (a built shell + reusable toolchain exist; ios/ doesn't and needs macOS+Xcode+CocoaPods to scaffold). Confirm a true-native iOS build env before committing a parallel iOS schedule. Note Fuji×iOS is impossible at the SDK level — 'iOS parity' = Canon-on-iOS only.
- Budget for devices + approvals — at least one Canon EOS R6 Mark II (a 2nd body parallelizes hardware milestones vs the serial single-body bottleneck), Apple Developer Program ($99/yr + D-U-N-S), and the Fuji commercial license + warranty-waiver legal track if Fuji is in V1 scope.
- 0052 packaging — confirm Camera Bridge ships inside the INDEPENDENT native Papic capture app (category A) with the 4-pillar linking contract (SSO + deep-link back + one-backend-thin-client + graceful-degrade), not the Capacitor shell.

## Open questions

- Panood-over-WiFi feasibility per brand: can a DSLR live feed reach broadcast quality/latency through a phone WiFi-SDK bridge to RTMP→YouTube at all? Even Canon CCAPI live-view is a low-fps JPEG-pull, not broadcast H.264. Real DSLR livestreaming is normally HDMI-capture/USB-webcam. Resolvable ONLY by a hardware field test on a real EOS body — not by code review.
- Does the same CCAPI live-view-quality ceiling also kill Patiktok (also a live-source surface), and does it even degrade the Papic framing/viewfinder UX (a paparazzo can't frame candids through a stuttery JPEG pull)? Validate all three live-view uses at M3.
- Panood live-broadcast disconnect fallback: can a phone-re-encode path keep the couple's YouTube RTMP stream alive through a 3s DSLR drop (a live broadcast can't silently gap), or is a 'technical difficulties' card the best achievable? Feeds the §5 go/no-go.
- Is the Fujifilm warranty-void + Android-USB-only + no-iOS reality acceptable enough to pursue Fuji at all in V1, or is Canon the sole V1 brand? (Sony/Nikon are already out — no mobile SDK.)
- Multi-network/dual-AP behavior: can the native binary hold the camera-control AP and a cellular/venue-WiFi upload path simultaneously on the target Android/iOS hardware? Flagged in the SDK notes as a known platform quirk; needs device validation in N1.
- Does the now-track 2.5-3 week calendar figure hold? It depends on multi-agent parallel dispatch after the serial C1→S0 head; without it, widen to ~4 weeks.
- Will the native capture binary clear app-store review (Apple Guideline 4.2 / Google minimum-functionality) on the first cycle, given the existing app is a thin WebView shell? The native capture+pairing flow is the justification, but budget a reject-and-resubmit.
