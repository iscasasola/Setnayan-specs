# Papic v3 — What's Next (2026-07-18) · resume-from-here handoff

> **Why this exists:** the Papic v3 build was **paused mid-flight** (owner: "pause the build safely, save the rest for What's next"). This doc is the single resume point — it records exactly what shipped, what is committed-but-paused, and every remaining step so a cold session or the owner can pick up without re-deriving anything.
>
> **Canonical model:** [`Papic_Good_Better_Best_Pricing_2026-07-17.md`](Papic_Good_Better_Best_Pricing_2026-07-17.md) (decisions) · [`Papic_Build_Brief_2026-07-17.md`](Papic_Build_Brief_2026-07-17.md) (the 12-PR plan) · [`Papic_v3_Compliance_and_Admin_Delta_2026-07-17.md`](Papic_v3_Compliance_and_Admin_Delta_2026-07-17.md) (compliance + admin). Pricing reconciled in `Pricing.md` § 2.1 / § 2.1a.
>
> **Repo:** `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` (`apps/web`). Corpus-edit rights do **not** extend to repo code — every code step is a PR + auto-merge.

---

## 0. TL;DR — state at pause

> **🔒 2026-07-20 OWNER DECISION — Papic Lite is for NON-LIFE events; the Mini/Ltd/Unli ladder serves LIFE events (4 products).** The ₱30 rung is **Mini** (resolves the live "two SKUs both titled Papic Ltd" collision). Scope lock + the code predicate + the new DPO questions are in **§ 3 → "SCOPE LOCK on brief-PR-9/10/11"**; § 4's `event_type → mode map` line is answered. Canonical record: [`Papic_Good_Better_Best_Pricing_2026-07-17.md` § 0](Papic_Good_Better_Best_Pricing_2026-07-17.md).
>
> **⚠ LIVE DEFECT (same date):** the public pricing page advertises **30 photos + 10 videos = 60 capture points** on the ₱30 rung, which the shipped fail-CLOSED gate (#3407) **refuses at 20 points** (409 `camera_points_exhausted`); free-count ("first 5 free" → 3) and cap ("₱9,000" → Mini ₱6,000 / Ltd ₱10,000) figures are also stale, incl. in `public/llms.txt`. **Copy fix in flight via a code PR; the roll-vs-mini DB reconciliation is an OWNER ACTION still pending** — see `Papic_GBB § 0.5`.

> **🔄 2026-07-19 UPDATE — §2 (caps-consumption recut) AND §3 brief-PR-3 (points enforcement + free provisioning) both SHIPPED as ONE atomic PR: [#3407](https://github.com/iscasasola/setnayan-platform/pull/3407), merged 2026-07-19 (merge `45fcbae53`), per the owner's land-together decision so the advertised "3 free cameras" was never display-only.** `papic-v3#1` + `papic-v3#2` in §8 are DONE. Implementation notes: free seats = `tier='free'`/sku `PAPIC_CAMERA_FREE` at fixed indexes **100..102** (pack 1–5 · paid ≥ 200), provisioned render-time from the couple's Papic studio page; both seams cut to the PR-1 points RPCs; fail-CLOSED except fn-not-found via the shared `resolvePointsGate` (unit-tested); presign exhaustion = **409 `camera_points_exhausted`**. Surfaced: `eventPapicActive` is now satisfied by the free seats (add-on prerequisite loosens until brief PR-7's `eventHasPaidPapicTier`). Resume from `papic-v3#3` onward.

- ✅ **Shipped to prod:** the two schema migrations (capture-points ledger + tier vocab + tier config + rate SKUs · Mini per-event cap column + caps admin-only trigger). **PLUS (2026-07-19) the §2 recut + brief-PR-3 enforcement — PR #3407, see the update banner above.**
- ~~⏸ **Paused (committed, NOT shipped):**~~ **SHIPPED 2026-07-19 in #3407** — the caps-**consumption** code — roll→Mini cap remap, wedding-only vs uncapped billing across both the charge path and the picker display, and the `Free 5→3` / `min-paid 5→1` constant flips. ~~Lives on branch `claude/papic-v3-pr3` @ commit `cd4d89bc2`, 12/12 unit tests green, **not pushed, no PR**.~~
- ⬜ **Not started:** ~~the free-tier **point enforcement + per-camera provisioning** (the top correctness item),~~ *(shipped in #3407)* quality/fidelity tier, 6-month full-res drop + face-vector expiry, full-res download, catalog/add-on changes, setup UI, all of Papic Lite (3 PRs, flag-dark), retired-SKU sweep.

---

## 1. ✅ Shipped to prod

| Piece | Migration file(s) | Merge commit | What it does |
|---|---|---|---|
| **PR-1** — capture-points ledger + tier vocab + config | `20270821110000_papic_v3_tier_vocab_config_points.sql`, `20270821110100_papic_v3_points_rpcs.sql` | `8c09fa831` | Widens `paparazzi_seats.tier` CHECK to `('free','roll','unlimited','mini','ltd')` (kept legacy ids, added mini/ltd — never-rename lock). Creates admin-editable `papic_tier_config` (Pattern H, RLS at create). Seeds rate SKUs `PAPIC_CAMERA_MINI_DAY ₱30` + `PAPIC_CAMERA_LTD_DAY ₱50`. Adds `papic_seat_day_usage.points_used` (backfilled `photos_used + videos_used*3`, old cols kept for lineage). RPCs `papic_reserve_camera_points(seat,event,cost)` (atomic wallet-spend pattern, budget from config, `unlimited`=NULL passthrough) + `papic_camera_points_remaining(seat)`. |
| **PR-2** — Mini cap column + money-integrity trigger | `20270821110200_papic_mini_cap_and_caps_guard.sql` | `db2c2640a` | `events.papic_mini_cap_php DEFAULT 6000` (Mini / legacy-roll per-event WEDDING cap). `events_papic_caps_admin_only` BEFORE-UPDATE trigger — blocks an **authenticated non-admin** from changing any `papic_*_cap_php` (couples have unrestricted row UPDATE → could self-discount). Safe by construction: service-role (`auth.uid() IS NULL`) + admins pass; `IS DISTINCT FROM` so unchanged caps never trip. |

Both merged to `main` → applied to prod by the migration CI (`supabase-migrations.yml`).

**Verified prod facts (during the build):** live caps were uniform `papic_ltd_cap_php = 9000`, `papic_unli_cap_php = 15000` before PR-2; `papic_mini_cap_php` now defaults 6000. Latest applied migration stamp was `20270821100000` (hence the `1100xx` stamps).

---

## 2. ~~⏸ PAUSED~~ ✅ SHIPPED 2026-07-19 — caps-consumption code (merged in atomic PR #3407 together with brief-PR-3, see §0 banner)

**Branch:** `claude/papic-v3-pr3` · ~~**commit:** `cd4d89bc2` · **base:** `main` @ `dde1ed03f` · **not pushed.**~~ **rebased onto post-#2431 main, enforcement commit added, merged as #3407 (`45fcbae53`).**

> ⚠ **Note 2026-07-19:** this branch is **LOCAL-ONLY** — it was never pushed, so `gh` (and any remote-side tooling) cannot see it; it exists only in the local checkout/worktree. Its base `dde1ed03f` is now **behind `origin/main`** — a rebase is needed on resume, and per the repo-backlog serialization rule, **merge PR #2431 (Papic Tier-2 auto-reframe) first, then rebase this branch** before pushing.

Code-only (no migration — it consumes PR-2's already-applied column). Four files + one changelog fragment:

| File | Change |
|---|---|
| `apps/web/lib/papic-cameras.ts` | `CameraCaps` now `{ mini, ltd, unli }`. The `'roll'`/Mini tier clamps to the **Mini cap** (₱6,000 fallback), not the dormant Ltd cap (`caps.ltd` reserved for the distinct Ltd tier in a later PR). New `isPapicUncapped(eventType)` = `true` for every non-`wedding` type. `computeCameraQuote(..., { uncapped })`: uncapped → charge = raw subtotal, `capped=false`. Constants: `PAPIC_FREE_CAMERA_COUNT` 5→3, `PAPIC_MIN_PAID_CAMERAS` 5→1, `PAPIC_MINI_CAP_FALLBACK_PHP=6000`, `PAPIC_LTD_CAP_FALLBACK_PHP=10000`. |
| `apps/web/app/dashboard/[eventId]/studio/papic/actions.ts` | Both charge paths (`computeCameraQuote` extras + `computeLimitedQuote` guest-list) select `papic_mini_cap_php` + `event_type` and pass `uncapped` / `MAX_SAFE_INTEGER`. Weddings clamp; every other type bills raw. |
| `apps/web/app/dashboard/[eventId]/studio/papic/page.tsx` | Picker **display** reads the Mini cap for the guest-list Limited tier and uncaps for non-weddings — mirrors the charge path so quote == bill in all cases (closes a would-be **overcharge-vs-quote** for non-wedding events). `ExtraCamerasPicker` receives `MAX_SAFE_INTEGER` for non-weddings → `Math.min(raw, MAX)=raw` and its "caps at ₱X" banner never renders. |
| `apps/web/lib/papic-cameras.test.ts` | Fixture gains `mini`; +3 uncapped-path tests (raw subtotal, `capped:false`, unlocks still free) + wedding-still-clamps. **12/12 pass** (`npx tsx --test lib/papic-cameras.test.ts`). |
| `apps/web/changelog.d/papic-v3-pr3.md` | Fragment (SPEC IMPACT: None). |

### Resume steps (exactly)
```bash
cd /Users/icecasasola/Documents/Claude/Projects/setnayan-platform   # or the setnayan-pr1 worktree
git checkout claude/papic-v3-pr3
git rebase origin/main        # only if main moved; expect no conflicts (Papic-scoped)
git push -u origin claude/papic-v3-pr3
gh pr create --base main --title "feat(papic): roll→Mini cap remap + wedding-only caps (PR-3/12)" --body "<from changelog.d/papic-v3-pr3.md>"
gh pr merge <PR#> --auto --merge
```
CI runs the real `tsc --noEmit` (this worktree has no `node_modules`, so local typecheck was skipped — the change is a plain additive interface field + fn signature, callers all updated: only `lib/papic-cameras.ts`, `actions.ts`, `page.tsx`, and the test reference `CameraCaps`/`computeCameraQuote`).

### Shippability + the one caveat
This commit is a **coherent, independently-shippable** increment: caps become billing-correct and the advertised free count drops 5→3, min-paid 5→1. It does **NOT** provision or point-enforce free cameras — "3 free" remains a display allowance exactly as "5 free" was, until **§ 3 PR-3 (points enforcement + free-seat provisioning)** lands. Shipping this alone does not create the free-cap fake door (it already exists); it only changes the advertised number. When resuming, re-verify nothing downstream assumed the old **5-camera minimum**.

---

## 3. ⬜ Remaining build — brief PRs 3–12

> ⚠ **Numbering note:** the paused commit in § 2 was git-labeled "PR-3," but it is really the **code half of the brief's PR-2** (caps consumption + the 5→3/5→1 flips the brief filed under PR-2) plus the roll→Mini remap. **The brief's PR-3 below (points enforcement + free provisioning) is a DIFFERENT, still-unstarted PR.** This section uses the **build brief's** numbering as canonical.

| PR | Title | Depends | Flag | Priority |
|---|---|---|---|---|
| **3** | ~~Points enforcement wiring + **free-tier per-camera provisioning**~~ ✅ **SHIPPED 2026-07-19 · PR #3407** (atomic with the §2 recut) | 1,2 | none | ~~🔴 **top correctness**~~ DONE |
| **4** | Per-event quality/fidelity tier (one column, UI+ingest reconciled) | 1 | none | |
| **5** | 6-month Drive-aware full-res drop + 5yr face-vector expiry + Keep-Full-Res retirement | — | `PAPIC_FULLRES_DROP_ENABLED` + Drive-live + buyer-disposition | |
| **6** | Full-res download (per-photo / event-ZIP / account-export) + Drive widgets | 5 | none | |
| **7** | Catalog: Thank You ₱2,500, add-on inclusion helper, retire Unlock bundles | 1,3 | none | |
| **8** | Setup UI: Papic-vs-Lite fork, camera builder, quality picker, included add-ons | 2,3,4,7 | Lite branch behind flag | |
| **9** | Papic Lite — canonical schema (5 tables + RLS at create + ladder seed) | 1 | `NEXT_PUBLIC_PAPIC_LITE_ENABLED` off | |
| **10** | Papic Lite — atomic shared-pool RPCs + join/capture/claim/report routes | 9 | flag off | |
| **11** | Papic Lite — host dashboard + participant capture UI | 9,10 | flag off; public blocked on gates | |
| **12** | Retired-SKU surface sweep (Unlock / Keep-Full-Res / Photo-Wall everywhere) | 7 | none | |

**Per-PR build notes (from the brief):**
- **PR-3 (top priority):** provision 3 free cameras as `tier='free'` seats (today free cameras are never provisioned per-camera, so the "3 free × 20 pts" cap has nothing to bind to — free capture stays unlimited = pure fake door). Presign gate → 409 `camera_points_exhausted` (no orphan bytes); record layer authoritative, **fail-CLOSED except function-not-found during the seam cutover**; cut BOTH seams (presign in `app/api/upload/route.ts` + record in `app/papic/actions.ts`) to points in ONE PR.
- **PR-4:** ONE column `events.papic_quality_tier` (`full_res`|`optimal`|`high_efficiency`) written by setup UI, read by ingest. *(Corrected 2026-07-19: this was earlier described as killing an EXISTING "write-`papic_quality` / read-`papic_quality_tier` fake door" — grep shows NEITHER string exists in the code; there is no live column mismatch. PR-4 is **net-new** work — introduce the column + both seams fresh — not a repair of a shipped bug.)* New type `PapicFidelityTier` distinct from adaptive-quality's network-tier `PapicQualityTier`. Wedding=Optimal 12 MP · Lite=High-Efficiency (fixed per product, no picker).
- **PR-5:** `DEFAULT_FULL_RES_RETENTION_DAYS 90→180`; **Drive-aware defer guard mandatory** (never delete an R2 original for a Drive-connected event until `copied_high_res` confirmed); remove `HIGH_RES_ARCHIVE` skip + deactivate SKU (owner-gated); rewrite the 30-day drop-warning to two-outcome copy; `guest_face_enrollments.vector_expired_at` + `runFaceVectorExpirySweep` (anchor `GREATEST(event_date,created_at)+1825d`, **never touch `user_face_profiles`** — pin with a test) on `claimPeriodicJob`. Compressed gallery (photos + compressed clip copies) kept **indefinitely**; clips also compress at 6 mo.
- **PR-7:** `eventHasPaidPapicTier` **fail-CLOSED, ACTIVE-only**, excludes Free+Lite → gates Kwento/Pabati/Guest-Stories (free WITH a paid wedding tier); add a **server-side** entitlement gate on the Thank You (₱2,500 — the only paid add-on) order path (UI-gated only today); do NOT deactivate the KWENTO/PABATI/STORIES SKUs (runtime helper is the gate).
- **PR-10:** `papic_lite_reserve_capture` atomic CAS on the single pool row + per-participant fair-use with **compensating decrement on subcap rejection** (parenthesize the WHERE — a draft had an operator-precedence bug matching across pools); fast pool-full pre-read **before** the R2 PUT; `after()` chain = NSFW (non-disableable) → **CSAM hash (counsel-gated stub before public)** → derivatives; never call face/reels/Kwento/Drive paths.
- **PR-9 schema:** dedicated `papic_lite_captures` + standalone `papic_lite_participants` (never `papic_photos`, never a `paparazzi_seats` `tier='lite'` — that breaches the feature-loss firewall). Lite pools key on **UUID** (no `generate_public_id` — `'L'` collides with `event_playlist_picks`). Volume-discount ladder 200/₱100 … 100,000/₱15,000.

### 🔒 2026-07-20 — SCOPE LOCK on brief-PR-9/10/11 (Papic Lite): NON-LIFE EVENTS ONLY

> **Owner decision 2026-07-20:** **Papic Lite is for NON-LIFE events. The Mini/Ltd/Unli camera ladder serves LIFE events.** 4 products total. Full record + rationale: [`Papic_Good_Better_Best_Pricing_2026-07-17.md` § 0](Papic_Good_Better_Best_Pricing_2026-07-17.md). **Also locked:** the ₱30 rung is **Papic Mini** — "Papic Ltd" means the ₱50/70-pt rung only (resolves the live *two SKUs both titled "Papic Ltd"* collision).

**This SUPERSEDES** the `event_type → mode map` line in § 4 below (*"life-non-wedding … = full Papic uncapped; `simple_event` family = Lite"*) and the equivalent `Pricing.md` § 2.1a mapping. Lite widens from `simple_event` + 4 types to **every non-life type** — which adds **travel** and (by the shipped predicate) **anniversary**.

**⚠ The predicate is fuzzier in code than the framing implies — do NOT pick one by intuition.**

| Predicate | Location | Verdict for this fork |
|---|---|---|
| `isGatedLifeType()` | `apps/web/lib/life-event-gate.ts:71-73`, map `:62-68` | **🚫 NEVER USE.** Life = debut·christening·birthday·graduation·gender_reveal; **wedding is deliberately EXCLUDED** (own guard `create-event/wedding-guard.ts`). Forking on this sends **every wedding to Lite.** |
| `event_type_profiles.event_class` | `apps/web/lib/event-type-profile.ts:62` · seed `20270807254184_composable_event_foundation.sql:60-64` · CHECK `events_community_class_consistency` in `20270808218211` | ✅ **The only shipped predicate whose life side includes the wedding.** `personal` = wedding·debut·christening·birthday·graduation·gender_reveal (+ rowless types default `personal`); `community_eligible` = simple_event·corporate·travel·celebration·tournament·reunion·**anniversary**. |
| `isPapicUncapped(eventType)` | `apps/web/lib/papic-cameras.ts` (#3407) | Caps only — binary `!== 'wedding'`. Not a life axis. |

**Build guidance:** `event_class` answers *"may a Samahan own this?"*, not *"is this a life event?"* — it happens to coincide today, and the migration comment says widening it is *"one small migration."* **Recommend a dedicated `event_type_profiles.papic_mode` (`ladder`|`lite`) column seeded from today's `event_class` split** so a future Samahan-ownership decision cannot silently reprice Papic. **Owner call — see § 4.**

**Brief-PR annotations:**

- **PR-8 (`papic-v3#7`, setup UI fork)** — the "Papic-vs-Lite fork" is now **decided by event type**, not chosen by the host. Add: read the life/non-life predicate; **life → camera builder (Free/Mini/Ltd/Unli); non-life → Lite pool builder.** Open: is Lite *exclusive* on a non-life event, or the default with the ladder still purchasable (see `Papic_GBB § 0.3` — this determines whether the § 1 *"300 corporate Unli cams = ₱30,000"* revenue line survives).
- **PR-9 (schema)** — `papic_lite_pools` must carry the **owning event's `community_id` reality**: every Lite-eligible type is exactly the `community_eligible` set, so a pool can be **Samahan-owned**. RLS cannot assume a single human host via `event_members(member_type='couple')` alone; `community_member_can_read_events` already grants read to **every community member**. Decide the moderation principal before writing the policies.
- **PR-10 (RPCs/routes)** — pool model, ladder, photos-only and the `never call face/reels/Kwento/Drive` firewall are **unchanged** by this decision. Unchanged too: atomic CAS + compensating decrement, pool-full pre-read before the R2 PUT, NSFW → CSAM(stub) → derivatives.
- **PR-11 (host/participant UI)** — the "host" may be a community. Copy + moderation affordances need a Samahan-owned variant.
- **PR-3 side-effect (already shipped, #3407)** — `provisionFreeCamerasAdmin` provisions 3 `tier='free'` **ladder** seats render-time and is **event-type-blind**. Under this decision a non-life event gets 3 free ladder cameras it should not have. **Either gate provisioning to the life side, or define the non-life free taste as Lite's free preview budget.** Concrete follow-up, not covered by any existing PR.
- **Caps** — `isPapicUncapped` now only ever fires for *life* non-wedding types, shrinking the § 6 "non-wedding uncapped → BIR/VAT on a larger base" risk.

**⚠ Name collision (pre-existing, now urgent):** `apps/web/lib/vendor-papic-tier.ts:51` already ships **"Papic Lite" = the VENDOR on-the-day free tier** (20 points, photos-only, earned by a non-token accept) — a completely different product from the shared crowd pool. Two live products named "Papic Lite," both photos-only, both ~20-unit budgets. **Rename one before either goes public.**

**Fresh DPO/counsel questions this decision opens (all block the public flag flip, none block flag-dark build):**
1. **Controller for a Samahan-owned Lite pool** — the Samahan or the creating account? Does host moderation resolve when the owner is a community, and may any member moderate?
2. **Known-guest gatherings now fall under Lite** (reunion · celebration · anniversary · travel are invite-list events with an existing guest list). Should Lite **reuse the guest list for a stronger consent basis** where one exists, instead of treating everyone as an anonymous walk-up?
3. **Minors with an identifiable guardian present** (family-shaped types) — does that context **raise** the standard vs the stadium-crowd case the design was drawn for?
4. **Feature amputation** — Lite has no video/face-sort/reels/Kwento/Pabati/Stories/Drive/guest-list and is 4 MP. Under this decision 7 of 14 event types lose all of it, **travel** most painfully. Confirm intent (product, not privacy — but it is the biggest user-visible consequence).

**Reuse map (extend, don't rebuild):** `lib/papic-cameras.ts`, migrations `20270301349537` (`papic_reserve_camera_capture`/`wallet_spend` atomic pattern), `20270301225458` (`paparazzi_seats`+`papic_seat_day_usage`+RLS template), `20270302361811` (per-tier cap cols); `app/api/upload/route.ts` + `app/papic/actions.ts` (enforcement seams); `lib/papic-derivatives.ts` (`toAvif` #3082, `stripPhotoMetadata`); `lib/papic-fullres-drop*` #3110; `lib/papic-drive*` + `drive_copy_artifacts` + `DriveConnectCard`/`DriveSafetyPanel`; `lib/periodic-jobs.ts` `claimPeriodicJob` (Vercel crons stay `[]`); `lib/papic-storage-telemetry.ts` #3063 (Lite metering); `lib/guest-session.ts` (Lite participant JWT); `lib/nsfw-screen.ts` + `ugc_moderation`. RLS: `is_admin()` + `event_members(member_type='couple')`; Pattern H for config/tier tables. **No invented patterns.**

---

## 4. ⚠ Needs-before-build (the irreducible list)

**Verify on prod before each migration** (`supabase db query --db-url "$SUPABASE_DB_URL"` / `supabase migration list`):
- Latest applied migration timestamp (use `20270821+`).
- The auto-gen `paparazzi_seats_tier_check` constraint name before any further widen (PR-1 already did this).
- Live order counts for `HIGH_RES_ARCHIVE` and `PAPIC_UNLOCK`/`PAPIC_UNLOCK_LTD` **before deactivating** (PR-5/PR-7).
- Confirm no real couple photos already aged past the live 90-day drop before widening to 180 (PR-5).

**Owner decisions (change existing customers / money):**
- **Wedding cap semantics:** per-**order-total** ceiling (brief's assumption) vs per-day×days. *(The paused § 2 code clamps the per-order subtotal — confirm this is the intended semantics.)*
- **Grandfather / refund** for existing Keep-Full-Res + Unlock buyers (highest data-loss risk; before PR-5/PR-7 enable).
- ~~**event_type → mode map:** life-non-wedding (birthday/debut/christening/gender_reveal/anniversary/graduation) = full Papic **uncapped**; `simple_event` family = Lite. Confirm reunion placement + fork-vs-auto-route.~~ **✅ ANSWERED 2026-07-20 (owner): LIFE events = Mini/Ltd/Unli ladder · NON-LIFE events = Papic Lite.** Reunion → Lite (it is `community_eligible`). See the § 3 scope-lock block. **Still open from it:** (a) ratify **`event_class` as the predicate** vs adding a dedicated `event_type_profiles.papic_mode` column (recommended — `event_class` really means "Samahan-ownable"); (b) **`anniversary`** — `event_class` says non-life → Lite, but `Pricing.md` § 2.1a *and* this brief previously listed it as premium per-camera. **Which?** (c) **`gala_night`** has no profile row → defaults `personal` → lands on the LIFE side; an awards night is lifestyle — seed it before that type launches; (d) **fork-vs-both** — is Lite *exclusive* on a non-life event, or the default with the ladder still buyable? (e) rename one of the **two live "Papic Lite" products**. *(The § 2 code treats every non-`wedding` type as uncapped — that now only ever fires for life non-wedding types.)*
- **Guest-list Limited snapshot path** (`papic_limited_snapshots`): keep auto-provision (brief) vs retire.
- **Lite defaults:** per-participant fair-use sub-cap + free `preview_budget` size.
- **`Free = reels ON`** = the personal-reel builder (yes), NOT the Guest Stories add-on (no) — nail copy before PR-7/8.
- Ratify **UUID-only** `papic_lite_pools` (no public_id).
- *(Legacy `'roll'` remap → **Mini** already LOCKED + built in PR-1/§ 2.)*

**Owner actions (infra / env):**
- Set `RESEND_API_KEY` / `RESEND_FROM` in Vercel (export links + drop-warning emails no-op without them). Email system is fully built (`lib/email.ts`, Resend); app already sends other mail, so likely set — **verify in Vercel, no build work.**
- Complete **Google OAuth verified-app review** (`drive.file`) — Drive is the ONLY surviving-originals path, so **gate the drop-enable on Drive being live in prod.**
- Decide the **instant-pay rail** (PayMongo eval) — Lite same-day PAID activation blocks on it; ship the free-preview bridge + fast manual approval first. (Wedding Papic uses the standard 0034 apply-then-pay — no new rail needed.)
- Add `@aws-sdk/lib-storage` to `apps/web/package.json` (streaming large export ZIPs, PR-6). B2 cold tier stays flag-gated/deferred.

**Counsel + DPO (block flipping `NEXT_PUBLIC_PAPIC_LITE_ENABLED` public):**
- **CSAM known-hash matcher is NET-NEW** (no PhotoDNA/NCMEC integration today) + mandatory-reporting review — an open, public-QR, no-gate pool materially raises exposure.
- RA 10173: bystander/subject consent at QR-join; public takedown/complaint (no face-search in Lite); magic-link consent + Sybil record; minors-in-crowd (concerts/reunions/tournaments); `/privacy` corpus must cover the Lite flow.
- **DPO:** face-vector expiry anchor + whether the enrollment **selfie** biometric is purged at expiry; `user_face_profiles` retention proportionality.
- **Security/DPO:** `oauth_grants.refresh_token` is **PLAINTEXT today** — decide app-layer envelope encryption vs service-role-RLS + at-rest before Drive GA. *(This is also an open finding in the NPC dossier — reconcile before filing.)*

---

## 5. Compliance + admin deltas outstanding

Full list in [`Papic_v3_Compliance_and_Admin_Delta_2026-07-17.md`](Papic_v3_Compliance_and_Admin_Delta_2026-07-17.md). Already **documented into the NPC dossier this session** (ROPA row 20 Papic Lite, row 11 biometric 5-yr expiry, § 7 subprocessors B2 + CSAM, § 8a retention lifecycle, § 11 open items). Still to action:

**Privacy docs / `/privacy` page** — capture points (no new PI, billing/quota unit only); face-vector 5-yr expiry retention control; 6-month full-res window + drop; Google Drive `drive.file` least-privilege scope + token storage; Papic Lite crowd-capture (bystander consent, no-face-search takedown path, minors notice, NSFW+CSAM pipeline, magic-link consent record).

**Admin console (0023):**
1. **Papic caps editor — add the 3rd (Mini) field.** The event editor exposes Ltd + Unli; PR-2 added `papic_mini_cap_php` → **un-editable in the UI until this field is added** (admin-only trigger already blocks non-admins).
2. `papic_tier_config` editor (per-tier point budgets + caps + rate SKUs) — admin surface or leave to SQL initially.
3. Papic Lite moderation panel — host hide/remove/block + admin escalation (CSAM/NSFW queue, public-takedown queue) reusing the `ugc_moderation` stack.
4. Enterprise Lite pool (>100k photos) — two-admin approval gate.
5. Retired-SKU hygiene — Unlock-all + Keep-Full-Res deactivated, Live Photo Wall hidden on every Papic buy path.

---

## 6. Open risks / must-hold invariants

Free-cap fake door (**brief PR-3 must land WITH the 3-seat display change** — § 2 flipped the count but not the enforcement) · record-layer reserve fail-CLOSED except fn-not-found · Lite single-hot-row throughput (fast pre-read + accepts/sec limiter, not advisory-lock-per-event; load-test) · Drive-aware drop-defer mandatory + stuck-copy escape valve (attempt ≥5 → admin alert) · caps self-edit trigger same-release (✅ shipped PR-2) · irreversible fidelity downscale confirm · **non-wedding uncapped → BIR/VAT on a larger base** (consider a sanity max) · **clip-video storage tail unbounded** (nobody owns clip retention) · orphan-AVIF drain must reject not silently succeed · **biometric-expiry sweep has no cron SLA** on a low-traffic solo-admin platform (manual trigger + monitoring; flag to DPO).

---

## 7. Shelved (not in this build)

**Papic SLR / camera-bridge** — wireless DSLR/mirrorless sync (Canon CCAPI, Nikon/Sony) was researched ([`Camera_Connectivity_Research_2026-07-17.md`](Camera_Connectivity_Research_2026-07-17.md)) and **shelved** after vendor SDK claims proved overstated (Fujifilm=false, Canon=real-but-misnamed, Nikon/Sony=unverified). Revisit later; not a v3 dependency.

---

## 8. Execution metadata (conforms to `WHATS_NEXT_INDEX.md` §3)

> For the orchestration session. `type`: code|migration|spec|decision|verify · `parallel_safe:no` ⇒ shares Papic-pipeline files/migration-seq → serialize (see index §6 + `Whats_Next_Repo_Backlog_2026-07-18.md` §E). Papic-domain migrations serialize with the shipped vendor-Papic-capture work.

```
- id: papic-v3#1  (resume the paused caps-consumption code)   # ✅ DONE 2026-07-19 · PR #3407 (atomic with papic-v3#2)
  title: push + PR + merge branch claude/papic-v3-pr3 @ cd4d89bc2
  type: code
  depends_on: []              # PR-1/PR-2 migrations already in prod
  parallel_safe: no           # Papic quote code — serialize with repo #2431 (merge #2431 first, rebase)
  safety_gate: OWNER_DECISION # confirm §4: non-wedding = uncapped for ALL non-wedding life types; Papic GBB pricing sign-off
  touches: lib/papic-cameras.ts, app/dashboard/[eventId]/studio/papic/{actions,page}.tsx, branch claude/papic-v3-pr3
  verify: tsc + lint + build + 12/12 unit tests (done) + live picker quote==bill check
  gap: closed a would-be overcharge-vs-quote for non-wedding events (display now mirrors charge)

- id: papic-v3#2  (brief-PR-3 — THE top correctness item)   # ✅ DONE 2026-07-19 · PR #3407 (atomic with papic-v3#1; NO migration needed — consumed the PR-1 RPCs)
  title: free-tier point enforcement + provision 3 free cameras as tier='free' seats
  type: code + migration
  depends_on: [papic-v3#1]
  parallel_safe: no           # edits both enforcement seams (upload presign + record) + Papic tables
  safety_gate: NONE
  touches: app/api/upload/route.ts, app/papic/actions.ts, paparazzi_seats, papic_seat_day_usage
  verify: presign->409 camera_points_exhausted (no orphan bytes); free cap actually binds; fail-CLOSED except fn-not-found
  gap: "3 free" is displayed but NOT enforced today — free capture is effectively unlimited (fake door)

- id: papic-v3#3  (brief-PR-4)   # ✅ DONE 2026-07-20 · PR #3416 (auto-merge armed, all guard checks green at handoff)
  title: per-event quality/fidelity tier — one column events.papic_quality_tier (UI writes, ingest reads)
  type: code + migration
  depends_on: []
  parallel_safe: no           # migration
  safety_gate: NONE
  touches: events.papic_quality_tier, setup UI, ingest; new type PapicFidelityTier
  verify: single column written by UI and read by ingest (net-new — see §3 PR-4 correction 2026-07-19); wedding=Optimal12MPrecommended, Lite=High-Efficiency
  gap: none live — NET-NEW work (2026-07-19 grep: neither papic_quality nor papic_quality_tier exists in code; earlier "fake door" framing was wrong)
  # ⚠ SUPERSEDED 2026-08-10 — THE DEFAULT IS NOW 'optimal'. Owner: "photo quality starts at
  #   optimal and not full resolution." Migration 20271127772092 does ALTER COLUMN … SET DEFAULT
  #   'optimal'; the CHECK is untouched and all three tiers stay selectable. The column is NOT NULL,
  #   so no existing row moves — the five prod events keep full_res. The migration is therefore no
  #   longer INERT for NEW events. 🔑 The TS constant was SPLIT, not flipped: the ingest's error
  #   path (papic-ingest-fidelity.ts) keeps FIDELITY_READ_FAILSAFE='full_res' because a failed READ
  #   must never downscale someone's originals, while NEW_EVENT_PAPIC_FIDELITY='optimal' mirrors the
  #   DB default. The two lines below are the 2026-07-20 history, not current truth.
  # Shipped shape (2026-07-20): migration 20270825539466 = events.papic_quality_tier TEXT NOT NULL
  #   DEFAULT 'full_res' CHECK (full_res|optimal|high_efficiency) — INERT on apply (default = the
  #   pre-PR-4 behavior: originals stored 1:1). WRITE seam = "Photo quality" QualityPicker on
  #   studio/papic (StylePicker idiom) → setPapicQualityTier; weddings badge Optimal (~4256px/12MP)
  #   as Recommended; downscale picks confirm first (irreversible-downscale invariant). READ seam =
  #   lib/papic-ingest-fidelity.ts applyEventFidelityToOriginal, called FIRST in BOTH capture after()
  #   chains (app/papic/actions.ts seats + app/api/papic/guest-capture/route.ts guests): a downscaling
  #   tier replaces the still's R2 original IN PLACE (same key, refs stay valid) as a long-edge-capped
  #   JPEG, EXIF+GPS retained (.withMetadata — geo strips OUTBOUND only). STILLS only (no server
  #   ffmpeg); at/below-cap = verbatim; best-effort never-throws; legacy/pre-migration = full_res no-op.
  #   Shared vocab lib/papic-fidelity.ts: PapicFidelityTier + fidelityIngestParams (unit-pinned, 6 tests).
  #   ⚠ Owner note: GBB §5's later "fixed per product, NO picker" simplification vs the brief's
  #   column+picker — this build followed the brief; DB default stays full_res (inert), so flipping to
  #   fixed-per-product later is a picker-section swap, no column/ingest change.

- id: papic-v3#4  (brief-PR-5)
  title: 6-mo Drive-aware full-res drop + 5yr face-vector expiry + Keep-Full-Res retirement
  type: code + migration
  depends_on: []
  parallel_safe: no
  safety_gate: FLAG_FLIP_PROD + OWNER_DECISION + DPO_COUNSEL   # PAPIC_FULLRES_DROP_ENABLED + Drive-live gate + grandfather Keep-Full-Res buyers + selfie-purge-at-expiry ruling
  touches: DEFAULT_FULL_RES_RETENTION_DAYS 90->180, guest_face_enrollments.vector_expired_at, runFaceVectorExpirySweep (claimPeriodicJob), HIGH_RES_ARCHIVE deactivate
  verify: Drive-aware defer guard (never drop an R2 original for a Drive event pre-copy); NEVER touch user_face_profiles (pin with a test)
  gap: none (new retention control)

- id: papic-v3#5  (brief-PR-6)
  title: full-res download — per-photo / event-ZIP / account-export + Drive widgets
  type: code
  depends_on: [papic-v3#4]
  parallel_safe: yes
  safety_gate: NONE           # needs @aws-sdk/lib-storage added to apps/web/package.json
  touches: download routes, Drive widgets
  verify: presigned R2 per-photo; streaming ZIP; account export = RA 10173 export

- id: papic-v3#6  (brief-PR-7)
  title: catalog — Thank You ₱2,500 (only paid add-on) + server-side add-on inclusion gate + retire Unlock bundles
  type: code + migration
  depends_on: [papic-v3#2]
  parallel_safe: no
  safety_gate: OWNER_DECISION # grandfather/refund existing Unlock buyers before deactivating
  touches: eventHasPaidPapicTier (fail-CLOSED, ACTIVE-only, excludes Free+Lite), Kwento/Pabati/Guest-Stories gate, Thank You order path
  verify: server-side gate (today UI-only); do NOT deactivate KWENTO/PABATI/STORIES SKUs

- id: papic-v3#7  (brief-PR-8)
  title: setup UI — Papic-vs-Lite fork, camera builder, quality picker, included add-ons
  type: code
  depends_on: [papic-v3#3, papic-v3#6]      # + brief-PR-2/PR-3
  parallel_safe: no
  safety_gate: FLAG_FLIP_PROD               # Lite branch behind NEXT_PUBLIC_PAPIC_LITE_ENABLED
  touches: studio/papic setup surface
  verify: reconcile the guest-list Limited display with the enforced free/paid tiers

- id: papic-v3#8  (brief-PR-9/10/11 — Papic Lite)
  title: Papic Lite — schema (5 tables + RLS-at-create) + atomic shared-pool RPCs + host/participant UI
  type: code + migration
  depends_on: []              # (brief-PR-1); UI depends on schema+RPCs internally
  parallel_safe: no
  safety_gate: DPO_COUNSEL + FLAG_FLIP_PROD + OWNER_DECISION # NET-NEW CSAM matcher + RA 10173 consent; NEXT_PUBLIC_PAPIC_LITE_ENABLED stays OFF until counsel/DPO clear. OWNER_DECISION added 2026-07-20: ratify the life/non-life predicate (event_class vs new papic_mode column) + anniversary placement + fork-vs-both + the two-"Papic Lite" rename.
  touches: papic_lite_pools(UUID)/participants/captures, ugc_moderation, guest-session JWT
  verify: atomic CAS on single pool row + compensating decrement on subcap reject; NSFW->CSAM(stub)->derivatives; never call face/reels/Kwento/Drive
  # SCOPE LOCK 2026-07-20 (owner): Papic Lite = NON-LIFE events ONLY; Mini/Ltd/Unli = LIFE events. 4 products.
  #   Predicate: use event_type_profiles.event_class ('personal'=life incl. WEDDING | 'community_eligible'=non-life).
  #   🚫 NEVER isGatedLifeType() — it EXCLUDES wedding (lib/life-event-gate.ts:71-73) and would route every wedding to Lite.
  #   Pool model / photo ladder / photos-only / never-call-face-reels-Kwento-Drive: UNCHANGED by this decision.
  #   NEW: a Lite pool can be SAMAHAN-owned (Lite-eligible set == community_eligible set) -> RLS/controller/moderation
  #   principal is an open DPO+schema question; community_member_can_read_events already grants read to all members.
  #   Follow-up outside this id: provisionFreeCamerasAdmin (#3407) is event-type-blind -> non-life events currently
  #   get 3 free LADDER seats they should not have. Gate it, or define the non-life taste as Lite's free preview.

- id: papic-v3#9  (brief-PR-12)
  title: retired-SKU surface sweep — Unlock / Keep-Full-Res deactivated, Photo-Wall hidden everywhere
  type: code
  depends_on: [papic-v3#6]
  parallel_safe: yes
  safety_gate: NONE
  touches: every Papic buy path
  verify: no retired SKU surfaces on any Papic buy surface
```

**Bottom line:** `papic-v3#1` is resumable now (owner confirms the uncapped-non-wedding semantics + pricing); `papic-v3#2` is the highest-priority correctness fix; the rest sequence per `depends_on`. All Papic migrations serialize with each other and with the vendor-Papic-capture domain. Route every non-`NONE` gate to the human queue.
