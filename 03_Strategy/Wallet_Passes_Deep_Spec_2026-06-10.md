# Apple Wallet / Google Wallet Passes — Deep Spec (Proposal)

> **Status: PROPOSAL · implementation-grade · NO code yet · Phase 2 (Wave 0).** Drafted 2026-06-10.
> Deep-spec of feature **T2-5** from [Mobile_Native_Features_Tier1_2_Proposal_2026-06-10.md](Mobile_Native_Features_Tier1_2_Proposal_2026-06-10.md).
> **Host iteration: 0002** (personal QR + landing page) · **touchpoints:** 0008 seating · 0028 email · 0023 admin · 0031 day-of · 0025 privacy · 0037 monogram.
> A digital pass that holds a guest's **personal QR + table + event info**, lives in their phone's Wallet, surfaces by time/place at the venue, and is push-updatable + revocable.
>
> ⚠ **Naming guard:** "Wallet pass" here = the **phone OS** pass (Apple Wallet / Google Wallet, boarding-pass style). It is **NOT** the retired Setnayan customer **token wallet** (iteration 0003). The "NO wallet UI" guardrail is *not* violated.
>
> ⚠ **Field-name caveat:** column names below are taken from the corpus iteration specs. Per the ground-truth ordering, **shipped `apps/web` @ `origin/main` is canonical** — reconcile every field name against the live schema before coding (specs are known to have drifted).

---

## 0. TL;DR

- **What ships:** an "Add to Wallet" action on the guest's landing page (and invite/reminder emails) that issues an **Apple `.pkpass`** or a **Google Wallet object**. The pass shows couple names, date/time, venue, the guest's table, and a **QR barcode that is byte-identical to the guest's existing personal QR** — so every existing scanner (Papic tagging, check-in, landing page) works with zero change.
- **Why it's Wave 0:** delivery is a **signed file / save-link over HTTPS** that the **mobile browser** hands to Wallet natively. **No iOS Capacitor shell, no native Papic required.** This is the least-blocked of the 7 features.
- **Marginal cost ≈ ₱0** (generation + a few KB on R2; issuing is free on both platforms) → recommend **free / included**, not a paid SKU. Owner decides (§13).
- **The real timeline is calendar-bound, not code-bound:** owner must provision an Apple Pass Type ID + signing cert and a Google Wallet Issuer + service account before anything can be issued (§12).

---

## 1. Why this is Wave 0 (the delivery mechanism, plain English)

A wallet pass isn't an app — it's a **signed data file** the operating system knows how to display.

- **Apple:** we generate a `.pkpass` file (a zip of JSON + images + a cryptographic signature) and serve it over HTTPS. Safari/iOS recognizes the file type and shows "Add to Apple Wallet" automatically. **Works from the mobile browser** — no app install.
- **Google:** we create a pass "object" via Google's API and hand the browser a **"Save to Google Wallet" link** (a signed token). Chrome/Android opens Wallet and saves it. Also **browser-only**.

So this ships on the **web today**, and simply *also* works inside the Capacitor shell later (same web link). That's why a Tier-2 feature jumps to the front of the build queue.

---

## 2. Scope & non-goals

**In scope (V1.5 / Wave 0):**
- One pass per guest per platform, holding QR + table + core event info.
- "Add to Wallet" on the personal landing page QR widget + in emails.
- Issue-early-with-"TBD"-table, then push the table when seating publishes.
- Push updates on table / time / venue change + coordinator broadcast.
- Per-guest revoke + auto-void on account deletion.
- Admin issuance/health view.

**Non-goals (explicitly out):**
- No NFC tap on the pass (that's feature **T2-7**, separate).
- No payment/loyalty on the pass (it's not the token wallet).
- No vendor-side passes in V1.5 (guest + couple only).
- No spatial/3D media (parked — see Tier proposal).
- No automatic issuance before the couple enables it (opt-in per event, §10).

---

## 3. Data model

### 3.1 Reused (no duplication — bind, don't copy)

| Need | Source (corpus spec — reconcile vs code) |
|---|---|
| Guest QR token | `guests.qr_token` — 32-hex (`encode(gen_random_bytes(16),'hex')`), per-guest unique, **not rotated** (tag history is keyed by `guest_id`, not the token) — 0001/0002 |
| Guest identity | `guests.first_name`/`last_name`/`display_name`, `role`, `rsvp_status`, `email`, `photo_url`, `photo_consent`, `plus_one_*` — 0001 |
| Table | `guests.table_assignment_id` → `tables(table_id, label, …)`; tables get `qr_token` only at **seating publish** — 0008 |
| Event + branding | `events`: couple display name, `event_date`, ceremony/reception time, `timezone` (IANA, e.g. `Asia/Manila`), `slug`; venue name/address/`maps_url` — 0002/0031 |
| Monogram logo | `bespoke_monogram_orders.final_png_r2_key` (use **PNG**, not SVG — see §5) at `setnayan-media/{event_id}/monogram/` — 0037 |

### 3.2 New table — `wallet_passes`

```
wallet_passes
  pass_id        TEXT PK   DEFAULT public.generate_public_id('W')   -- S89W-XXXXXXXXXX  (see §13 #1)
  guest_id       bigserial/uuid FK guests   NOT NULL
  event_id       FK events                  NOT NULL
  platform       TEXT CHECK (platform IN ('apple','google'))  NOT NULL
  external_ref   TEXT NOT NULL              -- Apple serialNumber | Google objectId
  auth_token     TEXT                       -- Apple web-service per-pass secret (NULL for google)
  pass_version   INT  NOT NULL DEFAULT 1    -- bump on every push update
  status         TEXT CHECK (status IN ('active','revoked','expired')) NOT NULL DEFAULT 'active'
  issued_at      timestamptz NOT NULL DEFAULT now()
  last_pushed_at timestamptz
  expires_at     timestamptz                -- ≈ event_date + archive window
  revoked_at     timestamptz
  UNIQUE (guest_id, platform)
```

### 3.3 New table — `wallet_pass_devices` (Apple only)

Apple's update model requires us to track which devices registered a pass so we can push refreshes. Google manages this for us, so Google passes don't register devices.

```
wallet_pass_devices
  id                 PK
  pass_id            FK wallet_passes ON DELETE CASCADE  NOT NULL
  device_library_id  TEXT NOT NULL     -- Apple device identifier
  apns_push_token    TEXT NOT NULL     -- where to send the "refresh me" ping
  registered_at      timestamptz NOT NULL DEFAULT now()
  UNIQUE (pass_id, device_library_id)
```

### 3.4 RLS

Both tables are RLS-enabled at `CREATE TABLE` time. Apply the canonical patterns from `RLS_Policy_Pattern.md § 5` — do **not** invent new ones:
- **Guest** reads their own pass rows (own `guest_id`).
- **Couple** reads/manages passes for events in `current_event_ids()`.
- **Admin** via `is_admin()`.
- Writes (issue / version-bump / revoke) go through server actions; `wallet_pass_devices` is service-write only (populated by the Apple web service endpoints).

---

## 4. What goes on the pass

### 4.1 The barcode contract (the most important line in this doc)

The pass barcode **must encode the exact same string the guest's printed/personal QR already encodes:**

```
https://setnayan.com/{event-slug}?invite={guests.qr_token}
```

Because it's identical, **every existing consumer keeps working with no change** — the Papic paparazzi scanner (0012, `source='individual_qr'` → resolves `guest_id`), venue check-in, and the magic-link landing page (0002). The pass is just another surface that carries the same token.

- Apple: `barcodes[]` → `{ format: "PKBarcodeFormatQR", message: <url>, messageEncoding: "iso-8859-1" }`
- Google: `barcode` → `{ type: "QR_CODE", value: <url> }`

### 4.2 Apple — Event Ticket field map

`pass.json` is style `eventTicket`:

| Region | Content | Source |
|---|---|---|
| `logoText` / logo image | Setnayan mark + couple monogram | brand + 0037 PNG |
| `headerFields` | Date (short, in event tz) | `event_date` |
| `primaryFields` | Couple names — "Aira & Boy" | `events` couple display name |
| `secondaryFields` | Guest name · Role (if not plain guest) | `guests` |
| `auxiliaryFields` | **Table** (or "TBD") · Time | `tables.label` · ceremony time |
| `backFields` | Ceremony + reception venue, address + maps link, dress code, RSVP status, plus-one status, schedule link, "Your QR is your check-in & photo tag", coordinator contact, RA 10173 privacy note | `venues`, `guests`, 0031 |
| `relevantDate` | Ceremony start (event tz) | drives lock-screen surfacing |
| `locations[]` | Venue lat/long | drives location surfacing |
| colors | `backgroundColor` / `foregroundColor` / `labelColor` | Clean Editorial palette (§5) |
| `webServiceURL` + `authenticationToken` | our update endpoint + per-pass token | §6 |

### 4.3 Google — EventTicket class/object field map

- One `EventTicketClass` per event (issuer-scoped), reused by all that event's objects.
- One `EventTicketObject` per guest: `ticketHolderName`, `seatInfo.seat` (= table), `barcode` (§4.1), `venue`, `dateTime` (`start` in event tz), `hexBackgroundColor`, `logo`, `heroImage` (monogram), `validTimeInterval`, `locations[]`.
- Updates = `PATCH` the object via the API (Google propagates to devices).

---

## 5. Branding & assets

- **Apple requires raster PNGs** at @1x/@2x/@3x for `icon`, `logo`, and optionally `strip`/`thumbnail` — **SVG is not accepted.** So the pass logo uses `bespoke_monogram_orders.final_png_r2_key`, not the SVG. If the couple hasn't bought the Animated Monogram (0037), fall back to the Setnayan brand mark PNG.
- **Palette = Clean Editorial** (`project_setnayan_palette`): background Deep Obsidian `#1E2229` (or Warm Alabaster `#FBFBFA`), labels/foreground Royal Champagne Gold `#C5A059` / Rich Mulberry `#5C2542`. Match the live brand; do not invent colors.
- Assets are generated server-side and cached on R2 (`setnayan-media`); the pass binary itself is transient (regenerated on demand / 30-day expiry), so we don't hoard `.pkpass` files.

---

## 6. Apple Wallet implementation

**One-time (owner-side, calendar-bound):** Apple Developer account → create a **Pass Type ID** + **signing certificate** + obtain the WWDR intermediate cert. Stored as deployment secrets (see §12).

**Generation:** server builds `pass.json` + images + `manifest.json` (SHA1 of each file) + `signature` (PKCS#7 over the manifest, using the Pass Type cert) → zips to `.pkpass`. Use a maintained pkpass signing library (vendor-neutral; pick at build time).

**Updates (the "push a table change" path):** implement Apple's PassKit Web Service REST endpoints:
- `POST   …/v1/devices/{deviceLibraryId}/registrations/{passTypeId}/{serial}` — register (writes `wallet_pass_devices`)
- `DELETE …/…/{serial}` — unregister
- `GET    …/v1/devices/{deviceLibraryId}/registrations/{passTypeId}?passesUpdatedSince=…` — list serials needing update
- `GET    …/v1/passes/{passTypeId}/{serial}` — return the latest `.pkpass`
- `POST   …/v1/log` — error log

When event data changes, bump `pass_version` and send an **APNs push** to each registered device's `apns_push_token`; the device then re-fetches the latest pass.

> **Cron-free (`project_setnayan_cron_free`):** the APNs push is **event-driven** — fired from the seating-publish / table-change / broadcast action via Next's `after()`/`waitUntil`. **No poller.** (An empty push payload just says "come refresh," which is why there's no scheduled job.)

---

## 7. Google Wallet implementation

**One-time (owner-side, calendar-bound):** enroll in the Google Wallet API → get an **Issuer ID** + a **service-account key**.

**Generation:** create/ensure the per-event `EventTicketClass`, then create the per-guest `EventTicketObject`; sign a **JWT** (with the service account) referencing the object → that JWT becomes the **"Save to Google Wallet" link/button**.

**Updates:** `PATCH` the `EventTicketObject` (e.g., new `seatInfo.seat`); Google pushes the change to the guest's device. **No device registry, no APNs** — simpler than Apple.

---

## 8. Lifecycle & state machine

UX-best is **issue early, fill in later** — let the guest add the pass the moment they RSVP, even before seating exists, then auto-complete it.

| Phase (from 0002 auto-lifecycle on `event_date`) | Pass behavior |
|---|---|
| Save-the-Date (T-90→T-30) | Button visible but pass issuance can be deferred (couple opt-in, §10); if issued, table shows **"To be assigned."** |
| **Invitation (T-30→T-1)** | Primary add window. Pass active. On **seating publish** (0008 atomic mint) → **push update** fills the table from `guests.table_assignment_id`. |
| Final logistics (T-1d→T-1h) | Couple/coordinator changes (table reassignment, time, venue, directions) → **push update**. |
| Post-event | Pass becomes a **keepsake** (Wallet shows "past event"); optional future "souvenir pass" linking the gallery/reel. `expires_at` ≈ event + archive window. |

**Revocation triggers:** guest removed from list · event cancelled · account deletion (0025) · explicit guest "remove my pass." Apple → set `voided: true` + push; Google → object `state: INACTIVE/EXPIRED`. Set `wallet_passes.status='revoked'`, `revoked_at=now()`.

**Lost-phone / re-issue:** **do not rotate `qr_token` by default** — it's the key the existing scanners + magic-link cookie + printed place cards rely on; rotating invalidates all of those. Default = void the old pass, re-issue a new pass carrying the **same** token. Only rotate the token if the owner wants true revocation of the old QR, accepting that printed QR + cookie reset (per 0002, tag *history* survives rotation because tags are keyed by `guest_id`). Owner decision (§13 #3).

---

## 9. Surfaces — where "Add to Wallet" lives

1. **Personal landing page (0002), QR Code Widget** — the spec **already lists three buttons there: `Save to phone` · `Copy link` · `Add to wallet` (disabled in V1)**. This feature simply **enables that button** behind a flag (`WALLET_PASS_ENABLED`) and platform-detects Apple vs Google.
2. **Email (0028)** — add the CTA to guest-facing templates `save_the_date_sent`, `payment_confirmed` (when a pass-eligible SKU is bought), `wedding_day_reminder` ("Update your pass"). Link → `…/{slug}?invite={token}&action=add_to_wallet`.
3. **Day-of guest LIVE page (0031)** — re-surface "Add to Wallet" for guests who haven't added it.

---

## 10. Cross-actor wiring (architect mandate)

These are **guest + couple + coordinator + admin** features — vendors are not involved (stated honestly, not forced).

- **Couple** — a per-event toggle **"Issue Wallet passes to guests"** (Settings, 0025) + an adoption count ("38 of 120 guests added their pass"). Publishing seating (0008) is the couple action that **triggers** the table push.
- **Guest** — adds, views, receives push updates; can remove their own pass (0025).
- **Coordinator** — the existing day-of broadcast (0031, `event_broadcasts` + Realtime) gains a "also push a pass update" option — the pass is the *physical* form of a broadcast ("tables updated — check your pass").
- **Admin (0023)** — a per-event/per-guest **Passes** view (issued / active / revoked / last-pushed), with **revoke / re-issue** behind the existing **two-admin sensitive-action gate**; credential rotation (Apple cert / Google key) is an admin-gated action.
- **The connections:** couple publishes seating → guest's pass auto-updates · coordinator broadcasts → optional pass push · admin revokes → pass voids on device · account deletion (0025) → passes auto-void.

---

## 11. Privacy & RA 10173

- The pass holds **only the guest's own** data (their name, their table, the public event info) + their QR. **No other guests' data** on the pass (tablemate names are **opt-in**, default off).
- Avatar on the pass only if `photo_consent = TRUE`.
- `locations[]` is the **venue**, used solely for the guest's own lock-screen surfacing — not tracking.
- "Remove my pass" + auto-void on account deletion mirror the **face-data-revocation / deletion pattern in 0025**; pass metadata is included in the 0025 **data-export** ZIP.
- Adding a pass is **guest-initiated** → consent is explicit.

---

## 12. Effort & dependencies

**Claude Code time** (per `feedback_setnayan_claude_code_timeline_units` — not engineer-months):
- Pass templates + Google class/object + JWT save-link + landing-page button enable + email CTAs: ~**1–2 CC-days**.
- Apple `.pkpass` signing + the PassKit **web service + APNs push**: ~**2–3 CC-days** (the chunky part).
- Admin Passes view + revoke/re-issue + couple toggle: ~**1 CC-day**.
- Schema + RLS + event-driven push wiring: ~**1 CC-day**.
- → roughly **~1 CC-week** of build.

**Dependencies:**
- **None on the native shell. None on native Papic.** (This is the point.)
- **Owner-provisioned credentials (the real gate, calendar-bound):** Apple Pass Type ID + signing cert + WWDR; Google Wallet Issuer ID + service-account key. Add to `API_Integration_Checklist.md`.
- Real-device testing on a few iOS + Android handsets.
- Best paired with seating (0008, shipped) + a monogram (0037) for the prettiest pass, but neither blocks issuance.

---

## 13. Decisions for owner sign-off

1. **Entity-ID letter (load-bearing — canonical IDs are locked).** ~~Proposed `S89W-`~~ **`W` was claimed 2026-06-11 by `user_reports` (UGC moderation, PR #1230)** — the letter audit of shipped migrations now shows taken: A B C D E F G H I K L M O P Q R S T U V **W** **X** (X = `account_deletion_requests`). **New proposal: `S89J-` for `wallet_passes`** (free pool: J · N · Y · Z). Re-confirm against the migrations grep at build time.
2. **Free/included vs paid SKU.** Marginal cost ≈ ₱0; recommend **free/included** as a retention + polish feature. If a SKU, **price is owner-to-set — none invented here.**
3. **Lost-phone re-issue:** keep the same `qr_token` (default, safe) or rotate it (true old-QR revocation, but resets printed QR + cookie)?
4. **Issue-early-with-"TBD" pass** (UX-best) vs only-after-seating-publish?
5. **Owner credentials:** willing to set up the Apple Pass Type cert + Google Wallet Issuer now? (Gates the build.)

---

## 14. Test plan (tests.md-style checklist)

- [ ] Generated `.pkpass` passes Apple's validator and adds to Apple Wallet from mobile Safari.
- [ ] Google JWT "Save to Google Wallet" adds the object from mobile Chrome.
- [ ] **Pass QR scans identically** to the printed/personal QR in the Papic tagging flow (resolves the right `guest_id`) and at check-in.
- [ ] Adding before seating shows table "TBD"; publishing seating pushes the real table within the update window (Apple via APNs, Google via PATCH).
- [ ] Table reassignment / time change / venue change each push an update.
- [ ] Coordinator broadcast can trigger a pass push.
- [ ] Per-guest revoke voids the pass on device (Apple `voided`, Google `INACTIVE`).
- [ ] Account deletion (0025) auto-voids all of that user's passes.
- [ ] `relevantDate` + `locations[]` surface the pass on the lock screen near event time/place.
- [ ] Tablemate names hidden unless opt-in; avatar shown only if `photo_consent`.
- [ ] RLS: guest sees only own pass; couple sees only own event's; admin sees all; `wallet_pass_devices` is service-write only.
- [ ] No scheduled job exists — every push traces to an event-state change (`after()`/`waitUntil`).
- [ ] Pass metadata appears in the 0025 data-export ZIP.

---

## 15. What this does NOT change

- V1 scope stays locked; this is V1.5 / Wave 0, gated on §13 sign-off.
- No customer **token-wallet** UI (this is the phone OS Wallet — see §0).
- **Cron-free** preserved (event-driven pushes only).
- **No prices invented**; no SKU created unless owner decides (§13 #2).
- Folds into host iteration **0002** (+ 0008/0028/0023/0031/0025/0037 touchpoints) via the Cowork sequence **only if** owner ratifies.
