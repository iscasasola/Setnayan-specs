# Google Play — Organization-Account Launch Runbook (2026-06-25)

> **Chosen path (owner, 2026-06-25):** publish the Android app from a Google Play **Organization** developer account verified via **D-U-N-S** (under **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** — the owner's DTI sole-prop trade name, see §1; **NOT** "ICASA", which is a *separate* business of the owner), NOT a personal account.
> **Why:** a new *personal* account hits two Android-hardware gates the owner can't clear (no Android phone) — both **waived for organization accounts**.
> Companion docs: `App_Store_Launch_Checklist_2026-06-10.md` (full design checklist) · `Global_Readiness_Groundwork_2026-06-10.md §§9–10` (IAP economics) · `0052_native_apps_delivery.md` (shell architecture).

---

## 0 · Why the org route (the two gates it skips)

New **personal** Play accounts created after **Nov 13, 2023** must:
1. **Device verification** — prove access to a real **non-rooted Android 10+** device via the Play Console *mobile app* (an iPhone can't do this). [support 14316361]
2. **Closed testing** — run a **12-tester / 14-continuous-day** closed test on real Android devices before applying for production. [support 14151465]

Both are **waived for organization accounts**, which verify via a **D-U-N-S number** instead. [support thread 398243168]
Confirmed: a **sole proprietorship** (here, the SETNAYAN SOFTWARE DEVELOPMENT SERVICE trade name — §1) qualifies for a Play org account, and D-U-N-S issues to sole props (free via D&B). [support 13628312]

---

## 1 · ✅ Canonical legal identity = "SETNAYAN SOFTWARE DEVELOPMENT SERVICE" (National)

**Owner registered a new National-scope DTI BN on 2026-06-25: "SETNAYAN SOFTWARE DEVELOPMENT SERVICE"** — **BN No. 8297508**, valid **2026-06-25 → 2031-06-25** (owner Indalecio Sacdalan Casasola II, TIN 300003455000), classified under **PSIC Information and Communication → Computer programming, consultancy and related activities → Software Development Service** (Division 62 / Class 6201). All 8 BNRS validations PASSED. Fee ₱2,000 + ₱30 DST. **Cert + receipt + application on file** (ref `TFWR279119337448`).

**This is now THE canonical legal identity** for the D-U-N-S request and the Google Play + Apple org accounts — use this exact name + a single consistent business address everywhere so verification matches cleanly.

Two notes:
- **It does NOT replace** the older barangay BN **"SETNAYAN EVENTS MANAGEMENT SERVICE"** (BN 8267788) — that's a *separate* legacy trade name. A sole prop (one TIN) can hold multiple trade names. **Recommended: let the barangay events name lapse** (don't renew) and run everything under the national software name. Keeping both is also valid if an events-branded receipt name is wanted.
- The **software/IT classification is the right umbrella for a multi-app studio** (covers building *any* app) and carries **no professional-license requirement** (computer/software engineering is not a PRC-regulated profession in PH).

→ **Step 1 (DTI) is essentially DONE** — the national software-dev BN is registered. Next is the D-U-N-S against this name.

---

## 2 · The owner admin chain (calendar — start the D-U-N-S ASAP, it's the long pole)

| # | Action | Cost | Time | Notes |
|---|---|---|---|---|
| 1 | **DTI → National scope** | ₱2,030 | **✅ DONE 2026-06-25** | Registered "SETNAYAN SOFTWARE DEVELOPMENT SERVICE" (National, software/IT class). Canonical identity for everything below. |
| 2 | **Request free D-U-N-S** for "SETNAYAN SOFTWARE DEVELOPMENT SERVICE" — **from D&B directly** (CRIF D&B Philippines / dnb.com.ph), NOT Apple's tool (§6a) | Free | 🟡 **REQUESTED 2026-06-25** (CRIF "Get In Touch" web form) · awaiting reply · up to ~30 days | Submitted with the §6b details; reply to CRIF promptly with the DTI cert (BN 8297508) when they ask. ⚠ Apple = separate (sole prop → **individual** enrollment; org needs incorporation — §6a). |
| 3 | **Create a Play Console *organization* account** — enter legal name = "SETNAYAN SOFTWARE DEVELOPMENT SERVICE", same address, D-U-N-S | $25 (~₱1,400) | ~1–3 days verify | ⚠ Personal→org is **not a conversion** — it's a **new** account; the existing personal account's $25 doesn't transfer. Nothing to migrate (no app published yet). |
| 4 | Set **public developer name** = "Setnayan" (separate from the legal entity name) | — | — | The legal/verified name stays "SETNAYAN SOFTWARE DEVELOPMENT SERVICE"; the store-facing name is "Setnayan". One org account → **unlimited apps**. |

**Net:** ~₱3,400 + ~1–4 weeks (dominated by the free D-U-N-S). Expedited D-U-N-S compresses it to ~1 week.

---

## 3 · ✅ Engineering side — already VERIFIED working & safe (2026-06-25)

The Android **release pipeline is proven end-to-end** (isolated worktree off `origin/main`, throwaway keystore, nothing pushed/uploaded):

- `npm install` → `npx cap sync android` (Capacitor 8, 7 plugins) → `./gradlew bundleRelease` → **BUILD SUCCESSFUL**.
- Artifact: **`app-release.aab` (6.8 MB)**, `jarsigner -verify` → **"jar verified"**.
- Manifest: `com.setnayan.app`, deep-link intent-filters (`https://…/dashboard` + `setnayan://`, autoVerify), HTTPS-only (no cleartext), reasonable permissions.
- **Live runtime entry confirmed:** app-origin request (`SetnayanApp` UA) → **307 → /login**; browser → **200** (web unaffected); `/login` → **200**.

→ A real signed `.aab` is producible in **~2 minutes** once the production upload key exists. The store gate is purely on Google's side, not ours.

**iOS pipeline ALSO verified (2026-06-25, isolated worktree, nothing pushed):** Xcode **26.5** is installed → `npx cap add ios` generates the project (**Capacitor 8 uses Swift Package Manager, no CocoaPods** → the Ruby-4.0 issue is moot) → `xcodebuild … -sdk iphonesimulator … CODE_SIGNING_ALLOWED=NO` → **BUILD SUCCEEDED**. SPM resolved all 7 plugins; `server.url=https://www.setnayan.com` + `appendUserAgent=SetnayanApp` → same login-first entry as Android. **A signed archive/`.ipa` still needs the Apple Developer account (cert/profile).**

⚠ **iOS gap found — Info.plist is missing ALL permission usage strings** (`NSCameraUsageDescription`, `NSMicrophoneUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`). Without them iOS **crashes** when the WebView calls camera/geo (Papic) and **App Store auto-rejects**. Must be added when the iOS project lands in the repo. *(The iOS project is NOT yet committed to `apps/mobile` — it needs a PR to add `ios/` + the usage strings, the iOS analog of Android's PR #1044.)*

---

## 4 · Remaining gates after the org account exists (shorter for org accounts — no 12-tester wait)

### Apple / iOS track (owner chose **Individual enrollment**, 2026-06-25 — reversible, no D-U-N-S needed)
- **Owner: enroll Apple Developer Program (Individual)** — $99/yr at `developer.apple.com/programs/enroll` (Apple ID + ID verification). ⚠ Shows owner's **personal name** as the App Store developer, not "Setnayan"; transfer the app to an org account later if a One Person Corporation is formed.
- **Eng: land the iOS project in the repo via PR** — `cap add ios` output + **add the 5 Info.plist usage strings** + AASA `apple-app-site-association` real Team ID. Then a signed archive (Xcode-managed signing once the account is added) → App Store Connect / **TestFlight**.
- **App Store Connect** app record + same listing/privacy/screenshots as Play.
- ⚠ Apple is stricter on **4.2 (webview)** + **3.1.1 (IAP)** — the login-first entry helps 4.2; the IAP stance (Groundwork §§9–10) matters more here.

### Google / Android track

1. **Production upload key** (owner mints, holds password — irreversible):
   `keytool -genkeypair -v -keystore setnayan-upload.jks -alias setnayan-upload -keyalg RSA -keysize 2048 -validity 10000`
   Then **opt into Play App Signing** at first upload (default; makes a lost upload key *recoverable* rather than fatal).
2. **Internal Testing upload** — push the signed `.aab`, install on a device via the tester link → on-device smoke test (sign-in, back button, camera permission, deep links). *(Org accounts can then go to production via normal review — no 12-tester/14-day requirement.)*
3. **`assetlinks.json` real fingerprint** — use the **app-signing key** SHA-256 from Play Console (*Test and release → App integrity → App signing key certificate*), NOT the upload key (common mistake that silently breaks App Links). Best practice: list **both** upload-key and app-signing-key SHA-256.
4. **FCM** — add `apps/mobile/android/app/google-services.json` or push notifications won't fire (plugin present but unconfigured).
5. **`versionCode`** must increment on every upload (currently `1`).
6. **Data Safety form + store listing** — draft in §5.
7. **IAP / Guideline 3.1.1 stance** — still owner-gated (see Groundwork §§9–10); shapes whether the app sells Setnayan's own digital SKUs at all.

**✅ Web-side prerequisites — VERIFIED present on `origin/main` (2026-06-25 read-only audit):**
- `/privacy` (569 lines) — covers camera/photos/location/analytics (PostHog/Sentry)/face-biometric + RA 10173 + retention + deletion → maps onto the §5 Data Safety form.
- `/terms` (192 lines) — substantial, not a stub. *(Still worth a final legal read before submit.)*
- **In-app account deletion** — `dashboard/(account)/profile` → "Delete my account" (`requestAccountDeletion` → `account_deletion_requests` admin queue) + one-click data export. Satisfies Apple 5.1.1(v) + Google (user can *initiate* deletion in-app; request-then-review model is acceptable).
- **PWA manifest** (`public/manifest.json`) — complete: standalone, theme `#FBFBFA`, maskable 512 PNG icon, categories. Store-ready.

→ These were the common rejection-triggers; none is a blocker. Remaining web fill-ins are only the **real `.well-known` fingerprint** (post first upload) + **FCM** (push).

---

## 5 · Data Safety form + store listing — starter draft (verify against `apps/web` /privacy before submitting)

**Data Safety — declared collection** (all encrypted in transit · all user-deletable via in-app account deletion, 0025 / RA 10173 · none "sold"):

| Data type | Collected | Shared | Required? | Purpose |
|---|---|---|---|---|
| Name, Email | Yes | No | Required | Account management (Supabase auth) |
| Photos & videos | Yes | Within the event gallery (tagged guests see them) | Optional (Papic only) | App functionality |
| Location (approx + precise) | Yes | No (stripped on outbound shares) | Optional | App functionality (Papic capture metadata) |
| Purchase history + payment-proof images | Yes | No | Optional | App functionality (apply-then-pay). **No card/bank numbers collected in-app.** |
| App interactions | Yes | No | Optional (opt-out toggle) | Analytics (PostHog) |
| Crash logs + diagnostics | Yes | No | — | App functionality / analytics (Sentry) |
| Push token (FCM) | Yes (if push enabled) | No | Optional | Messaging |

**Store listing essentials (owner to finalize):**
- **App name:** Setnayan · **Short description** (≤80 chars) · **Full description** (≤4000) · **Category:** Events / Lifestyle.
- **Graphics:** 512×512 hi-res icon · 1024×500 feature graphic · ≥2 phone screenshots (capture from Internal Testing build or PWA).
- **Content rating** questionnaire (wedding content — straightforward, no sensitive categories).
- **Privacy policy URL:** `setnayan.com/privacy` (live) · **verify `/terms`** is complete (flagged elsewhere).
- **Reviewer demo account:** `couple.test@setnayan.com` / `SetnayanTest!2026` (so review reaches the product behind login).

---

## 6 · D-U-N-S request sheet + BIR Form 1905 wording (copy-paste)

### 6a · Route — request the D-U-N-S from D&B directly (NOT Apple's tool — it rejects sole props)

⚠ **Corrected 2026-06-25:** Apple's D-U-N-S tool + Apple *organization* enrollment **do not accept sole proprietorships** (only corporations / LLCs / LPs; sole props "must enroll as **individual**" — [Apple D-U-N-S support](https://developer.apple.com/support/D-U-N-S/)). Setnayan is a sole prop → **Apple's tool is the wrong route.** Get the D-U-N-S from **D&B directly** — D&B *does* issue D-U-N-S to sole props, and **Google Play accepts a sole-prop organization account** with it (confirmed).

**Steps:**
1. Contact **CRIF D&B Philippines** (the licensed D&B partner in PH) — the D-U-N-S page ([crif.com.ph](https://www.crif.com.ph/our-offerings/dun-and-bradstreet-world-wide-network/d-u-n-s-number/) → "Get In Touch") or **dnb.com.ph**; alt = D&B global request at [dnb.com](https://www.dnb.com/duns-number/get-a-duns.html) (routes international requests to the local bureau). Ask for a **free** D-U-N-S for the sole proprietorship.
2. Give them the §6b sheet + the **National DTI cert (BN 8297508)** as proof; legal structure = **Sole Proprietorship**, name = the DTI business name, proprietor = owner.
3. D&B may contact you to verify — have the DTI cert + a government ID ready.
4. **Free → up to ~30 days** (paid expedite ~5 business days, ~US$229, if you want speed). They email the 9-digit D-U-N-S.
5. Use the number for the **Google Play *organization* account** ($25, same name + address).

**Apple (later, separate — does NOT block Google):** as a sole prop you'd enroll on Apple as an **individual** ($99/yr, no D-U-N-S) — but Apple individual accounts display your **personal name** as the developer, not "Setnayan." To get "Setnayan" as the Apple developer name you'd need a corporation (e.g., a PH **One Person Corporation**) — a bigger, later step.

### 6b · Field sheet (pre-filled — `[FILL]` = copy exactly from the new National DTI certificate so records match)

| Field | Value (from the National DTI cert + application, 2026-06-25) |
|---|---|
| Legal / registered business name | **SETNAYAN SOFTWARE DEVELOPMENT SERVICE** |
| DTI Business Name No. | **8297508** (National · valid **2026-06-25 → 2031-06-25** · ref `TFWR279119337448`) |
| Legal structure | **Sole Proprietorship** |
| Owner / Principal | **Indalecio Sacdalan Casasola II** (TIN **300003455000** · DOB 1986-12-16) |
| Physical business address (no P.O. boxes) | **76 Sampaguita Ave, Pasong Tamo, Quezon City, NCR (Metro Manila), Philippines** — ZIP `[FILL your actual postal code]` |
| Business phone | Landline **+63 2 8931 3789** · Mobile **+63 917 880 7163** |
| Email | `iscasasolaii@gmail.com` (better: a `@setnayan.com` address if available — Apple prefers email to match the org domain) |
| Website | **https://www.setnayan.com** (public, on the org domain ✓) |
| Line of business / what it does | **Software / application development and digital services** |
| Number of employees | **1** · **Year started** 2026 |

**Consistency rule:** the **name + address** here must be **byte-identical** to the National DTI certificate and to the Play/Apple org profile — mismatches are the #1 cause of verification delays. The only item not printed on the DTI cert/app is the **ZIP code** — fill in your actual postal code before submitting.

### 6c · BIR Form 1905 — line-of-business wording (broad, copy-paste)

Update the existing TIN **300003455000** (the owner's personal sole-prop TIN) — **add trade name "Setnayan Software Development Service"** and set/expand the line(s) of business below. Keep **NON-VAT · 8% income-tax option** (already configured — never add 12% VAT). Bring the National DTI cert (BN 8297508) to the RDO.

- **Primary:** Software / application development and information technology services *(PSIC 6201 / Division 62)*
- **Secondary:**
  - Online platform / web portal & information service activities *(PSIC 6312 / Division 63)*
  - Events management & related services *(PSIC 8230 / Division 82)*
  - Digital media production — photo / video & related creative services *(PSIC 5912 / 74200)*

Rationale: invoicing breadth is governed by the **BIR line of business**, not the DTI trade name — so registering all four lets receipts validly cover apps, subscriptions, the marketplace, media renders (Papic/monogram/video), and the events side. [[project_setnayan_launch_bootstrap_entity]]

---

## 7 · Play Store listing — draft copy (benefit-only, per public-surface hygiene; no implementation details)

> Voice = luxurious-Filipino-modern, EN-primary. Sells benefits, never the stack. Final owner review before submit. TL/CEB localized listings = later.

**App title** (≤30 chars): `Setnayan: Wedding Planner` *(25)*

**Short description** (≤80 chars): `Plan your wedding free — guests, RSVP, vendors, budget & seating in one app.` *(~75)*

**Full description** (≤4000 chars):

```
SETNAYAN — Set na 'yan. (That's all set.)

Plan your entire wedding in one beautiful app, free. Setnayan brings every part of your big day together — your guest list, RSVPs, vendors, budget, seating, and timeline — so nothing falls through the cracks.

PLAN EVERYTHING, FREE
• Build your guest list and track RSVPs in real time
• Share a stunning wedding website and invitations
• Manage your vendors, contracts, and payments in one place
• Keep your budget on track with a clear running total
• Design your seating chart with easy drag-and-drop
• See your whole wedding timeline at a glance

FIND THE RIGHT VENDORS
Browse a curated marketplace of Philippine wedding suppliers — photographers, caterers, venues, stylists, and more. Compare, message, and book the team that fits your style and your budget.

MAKE IT UNFORGETTABLE
Turn your celebration into keepsakes your guests will love:
• Candid photos and clips captured by your guests, delivered to one shared gallery
• A bespoke animated monogram that's uniquely yours
• A cinematic save-the-date to share your news
• Your wedding's very own custom song
• Live-stream your ceremony to loved ones who can't be there

PLANNING, MADE EFFORTLESS
Let Setnayan AI guide you step by step — personalized recommendations, timelines, and reminders tuned to your wedding.

Whether you've just gotten engaged or you're counting down the final days, Setnayan helps you plan with less stress and more joy.

Start planning free — set na 'yan.

setnayan.com
```

**Screenshots** (phone, capture 6–8 from the Internal Testing build or PWA; add a short benefit caption to each):
1. Event dashboard / overview — monogram + live countdown + venue → *"Your whole wedding, at a glance"*
2. Guest list + RSVP tracking → *"Track every RSVP in real time"*
3. Vendor marketplace browse → *"Find your dream team"*
4. Budget tracker → *"Stay on budget, stress-free"*
5. Seating chart editor → *"Seat everyone with a tap"*
6. Couple website / save-the-date → *"Share your story beautifully"*
7. Papic shared gallery → *"Every candid moment, captured"*
8. Setnayan AI planning view → *"Your wedding, guided"*

**Other store assets / answers:**
- **App icon** 512×512 (brand mark — shipped) · **Feature graphic** 1024×500 (brand + tagline).
- **Category:** Lifestyle (alt: Events). **Tags:** wedding, planner, RSVP, events.
- **Content rating:** wedding content → **Everyone / PEGI 3**; answer "no" to violence/sexual/gambling/etc.
- **Privacy policy URL:** `setnayan.com/privacy` · **verify `/terms`** is complete.
- **Contact:** `iscasasolaii@gmail.com` (or a `@setnayan.com` support address).
- ⚠ **Don't** advertise "cheaper on the web" or link out to web checkout inside the app (3.1.1 / Play anti-steering); keep digital-SKU purchases per the web-first stance (§4.7 / Groundwork §§9–10).

---

*Recorded in DECISION_LOG.md 2026-06-25. Engineering pipeline verification done this session; the rest is the owner admin chain (§§1–2) + the small fill-ins (§4) + the D-U-N-S/BIR sheet (§6) + the listing draft (§7). Cross-refs: 0052, App_Store_Launch_Checklist_2026-06-10, Global_Readiness_Groundwork §§9–10, launch-bootstrap entity memory.*
