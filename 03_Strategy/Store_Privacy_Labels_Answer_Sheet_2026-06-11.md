# Store Privacy Labels — Answer Sheet (Apple Privacy Label + Google Play Data Safety)

> **Status: READY-TO-PASTE · drafted 2026-06-11.** Pre-fills the two store privacy questionnaires from the verified data inventory (0025 data-export spec + the shipped schema as of 2026-06-11). Completes the "privacy labels" remedy in `Mobile_Native_Features_Tier1_2_Proposal_2026-06-10.md` §7.1 #4.
> **Re-verify before each submission** — these forms must match *actual* practice at submission time, and the codebase moves fast. Mis-declared labels are themselves a removal-grade violation on both stores.
> Scope: the customer/guest-facing Setnayan app (Capacitor shell over setnayan.com). A future separate vendor or Papic binary re-uses this sheet, minus what that binary doesn't touch.

---

## 0. The data inventory (ground truth — what Setnayan actually collects)

| Data | Where it lives | Notes that shape the answers |
|---|---|---|
| Name, email | `users`, `guests` | account + RSVP contact |
| Phone (optional) | `users`/vendor profiles | only if provided |
| Photos + video clips | Papic captures → R2 | UGC; NSFW screen on by default; report/block shipped 2026-06-11 |
| **Face vectors (biometric)** | `face_enrollments` (spec'd; verify shipped state at submission) | per-event scoped, consent-gated, revocable (0025), 5-yr deletion |
| **Precise location** | `geo_lat/lon` EXIF on captures | capture-time only; **stripped on outbound shares**; no background location |
| Purchase history | `orders` + reference codes + BIR ORs | apply-then-pay; **no card/payment-instrument data stored** |
| User ID / device push endpoint | `users.user_id`, `push_subscriptions` | push is opt-in, owner-only RLS |
| Messages | `chat_messages` (couple↔vendor) | in-app support/communication |
| Crash data | Sentry (0035) | no PII in logs per 0035 |
| Product-interaction analytics | PostHog (0035) | session recordings disabled, opt-out toggle, no PII |
| **NOT collected:** card numbers · contacts upload · browsing history · health · cross-app tracking identifiers (no ads SDKs — 0039 retired; no ATT prompt needed) | | |

**Account deletion:** in-app self-serve request flow shipped 2026-06-11 (PR #1231) — satisfies Apple 5.1.1(v) and Google's account-deletion requirement. Google also wants a **web link** for deletion requests: use `https://www.setnayan.com/dashboard/profile` (login-gated is allowed) — or `/help` article URL if a public-facing page is preferred.

---

## 1. Apple App Privacy ("nutrition label") — App Store Connect answers

**Q: Do you or your third-party partners collect data from this app?** → **Yes**

| Apple category | Collected? | Linked to identity? | Used for tracking? | Purposes to tick |
|---|---|---|---|---|
| Contact Info → Name | ✅ | Linked | No | App Functionality |
| Contact Info → Email Address | ✅ | Linked | No | App Functionality |
| Contact Info → Phone Number | ✅ (optional) | Linked | No | App Functionality |
| User Content → Photos or Videos | ✅ | Linked | No | App Functionality |
| User Content → Other UGC (messages, Kwento captions) | ✅ | Linked | No | App Functionality |
| **Sensitive Info** (biometric face data) | ✅ | Linked | No | App Functionality |
| Location → Precise Location | ✅ (capture-time EXIF only) | Linked | No | App Functionality |
| Purchases → Purchase History | ✅ | Linked | No | App Functionality |
| Identifiers → User ID | ✅ | Linked | No | App Functionality |
| Usage Data → Product Interaction | ✅ (PostHog) | **Not linked** (no-PII config per 0035) | No | Analytics |
| Diagnostics → Crash Data | ✅ (Sentry) | **Not linked** | No | App Functionality |
| Financial Info → Payment Info | ❌ Not collected (external GCash/BDO; no instrument data stored) | — | — | — |
| Contacts / Browsing / Health / Search history | ❌ Not collected | — | — | — |

- **Tracking (ATT):** **No data used for tracking** — no ads, no data brokers, no cross-app identifiers. Do NOT add an ATT prompt; none is needed.
- **Privacy policy URL:** `https://www.setnayan.com/privacy` (verify live before submit).
- Per-permission purpose strings (Info.plist) must each name the in-app reason: camera (Papic capture), photo library (uploads), location (photo memories stamped to captures), notifications (event updates).

## 2. Google Play Data Safety — Play Console answers

**Collects data?** Yes · **Shares data?** **No** (Sentry/PostHog are service providers processing on Setnayan's behalf — that's "collection," not "sharing," under Play's definitions; no data sold, no third-party advertising) · **All network transmission encrypted?** Yes (HTTPS everywhere) · **Provides a deletion mechanism?** **Yes** (in-app request flow + web URL above).

| Play category | Collected | Optional? | Purpose |
|---|---|---|---|
| Personal info → Name, Email | ✅ | Required for account | Account management, App functionality |
| Personal info → Phone | ✅ | Optional | App functionality |
| Photos and videos | ✅ | Optional (guest chooses to capture) | App functionality |
| **Personal info → "Race/ethnicity, religious beliefs…"**: do NOT tick — faith fields describe the *event*, not profiled user belief; re-confirm with counsel | — | — | — |
| **Biometric data** (face vectors) | ✅ | **Optional (consent-gated)** | App functionality |
| Location → Precise | ✅ | Optional (geo-stamp can be unavailable/off) | App functionality |
| Financial info → Purchase history | ✅ | — | App functionality |
| App activity → App interactions | ✅ (PostHog) | Optional (opt-out) | Analytics |
| App info and performance → Crash logs | ✅ (Sentry) | — | Analytics |
| Device or other IDs | ✅ (push endpoint, user ID) | Optional (push is opt-in) | App functionality |

- **Target audience:** 18+ primary (event planners/guests); **not child-directed** — do not enroll in the Families program even though children appear in wedding photos.
- **UGC declaration:** Yes — and the Play UGC policy boxes are now truthfully checkable: terms-acceptance gate ✅, in-app report ✅, block ✅, NSFW screen ✅ (2026-06-11), moderator queues ✅.
- **Account deletion URL:** required field — use the web URL in §0.

## 3. Both stores — the three claims that must stay true

1. **No tracking / no ads** — stays true while 0039 (display ads) stays retired. If ads ever return, BOTH labels must be redone first.
2. **No payment-instrument data** — stays true under apply-then-pay + the locked payments-off-platform contract (proposal §6).
3. **Biometric = consent-gated + revocable + per-event** — the Settings → Privacy & Data revocation flow (0025) is the evidence; keep it working.
