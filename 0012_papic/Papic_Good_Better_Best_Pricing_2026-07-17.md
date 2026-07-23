# Papic — Good / Better / Best + Display-vs-Download Storage (2026-07-17)

> **🔒 2026-07-20 — READ § 0 FIRST.** Owner locked the **product structure**: **Papic Lite = NON-LIFE events · Mini/Ltd/Unli = LIFE events** (4 products), and the ₱30 rung is **Mini** (resolving the live "two SKUs both titled Papic Ltd" collision). § 0 also records what the shipped life-vs-non-life predicate actually is (it is fuzzier than the framing), what the widening changes for Lite's pool/pricing/consent posture, and the **live capacity-vs-enforcement defect**. Everything below § 0 is the 2026-07-17 lock, unchanged.
>
> **Status:** owner-locked this session (2026-07-17). Dated sibling to `0012_papic.md` — the canonical statement of the current Papic model. **Supersedes** conflicting specifics in `Pricing.md` § 00.B / § 2.1 (2026-07-10/11 locks) and the 2026-06-26 strategy doc.
>
> **Source of truth for code:** all amounts are admin-editable catalog/`events` values in `apps/web` — this doc is the decision record, not the runtime. Code lands via the repo PR workflow (not checked out in the corpus).
>
> **Supersedes these live/owner-locked values (with owner sign-off this session):** free cameras **5 → 3** · full-res free window **3 → 6 months** · Ltd **₱30 → ₱50** / **30 → 36 photos** · adds **Papic Mini ₱30** · per-tier caps **Mini ₱6,000 / Ltd ₱10,000 / Unli ₱15,000** (Ltd was ₱9,000). **Kept from live:** Unli ₱100 · couple's-Drive-full-res-never-touched · born-AVIF single pass · no 40 GB governor. **RETIRED 2026-07-17:** Keep Full-Res (no paid full-res hosting) · Unlock-all bundle · Papic SLR/camera-bridge (shelved). **Add-ons now FREE with tiers:** Kwento · Pabati · Guest Stories (Thank You ₱2,500 the only paid one; Photo Wall hidden).

---

## 0. 🔒 2026-07-20 — PRODUCT STRUCTURE LOCK (owner) · 4 products, 2 audiences

> **Owner decision 2026-07-20:** **Papic Lite is for NON-LIFE events. The Mini / Ltd / Unli camera ladder serves LIFE events.**
> This is the organizing fork for every Papic surface — setup UI, catalog, caps, add-ons. It supersedes the narrower "Lite's natural home is `simple_event`, also fits corporate/tournament/celebration/reunion" mapping in `Pricing.md` § 2.1a and the `simple_event family = Lite` line in `Papic_Build_Brief_2026-07-17.md` § "Owner decisions".

**The four products:**

| # | Product | Audience | Unit | Media | Price |
|---|---|---|---|---|---|
| 1 | **Papic Lite** | **NON-LIFE (lifestyle) events** | one shared **photo pool** per event | **photos only**, High-Efficiency ~4 MP | volume ladder 200 = ₱100 … 100,000 = ₱15,000 (`Pricing.md` § 2.1a) |
| 2 | **Papic Mini** | **LIFE events** | per camera · per day | photos + 5s clips (points) | **₱30** · 20 pts |
| 3 | **Papic Ltd** | **LIFE events** | per camera · per day | photos + 5s clips (points) | **₱50** · 70 pts |
| 4 | **Papic Unli** | **LIFE events** | per camera · per day | photos + 5s clips (points) | **₱100** · ∞ pts |

*(Free — 3 seats × 20 pts — is the LIFE-event taste at the head of the ladder, not a fifth product. See § 0.3.)*

### 0.1 Naming — the ₱30 rung is **Mini**, and only the ₱50 rung is **Ltd**

**RESOLVED (owner 2026-07-20):** the live pricing page shows **two SKUs both titled "Papic Ltd"** — the ₱30 rung and the ₱50 rung. **The ₱30 rung is Papic MINI.** "Papic Ltd" refers to the ₱50 / 70-point rung **only**, everywhere, on every surface.

The collision is a data + copy artifact of the roll → Mini remap, not a design ambiguity:

- `platform_retail_catalog_v2` carries **two live rows**: `PAPIC_CAMERA_ROLL_DAY` ₱30 (seeded title *"Papic Camera — Roll (per camera, per day)"*, migration `20270301225458`) and `PAPIC_CAMERA_MINI_DAY` ₱30 + `PAPIC_CAMERA_LTD_DAY` ₱50 (migration `20270821110000`). The **₱30 row has evidently been re-titled "Papic Ltd" in the live DB**, so it now renders beside the real ₱50 "Papic Ltd".
- The pricing-page copy independently hardcodes the ₱30 rung as *"Ltd"* (`apps/web/app/pricing/page.tsx`), which is the pre-remap vocabulary.
- `papic_tier_config` already carries the correct mapping: `mini` → `PAPIC_CAMERA_MINI_DAY`, `roll` → `PAPIC_CAMERA_ROLL_DAY` labelled *"Papic Mini (legacy roll)"*, `ltd` → `PAPIC_CAMERA_LTD_DAY`.

**Never-rename lock still holds:** the technical ids `'roll'` / `PAPIC_CAMERA_ROLL_DAY` stay as-is. Only the **display title** is wrong. See § 0.4 for the live defect + the pending owner DB action.

### 0.2 What "life" vs "non-life" means in the shipped code — ⚠ read before building the fork

The owner's framing is clean; **the code is fuzzier than it sounds.** There is no single `is_life_event` flag. Three independent predicates exist, and **they disagree on the wedding**:

| Predicate | Where | Life side | Non-life side | Verdict |
|---|---|---|---|---|
| `isGatedLifeType()` | `apps/web/lib/life-event-gate.ts:71-73` (map at `:62-68`) | debut · christening · birthday · graduation · gender_reveal | **everything else — INCLUDING WEDDING** | **🚫 DO NOT USE for the Papic fork.** Wedding is *deliberately excluded* (it has its own `create-event/wedding-guard.ts`). Forking Papic on this predicate routes **every wedding to Lite** — the exact inverse of the decision. |
| `event_type_profiles.event_class` | `apps/web/lib/event-type-profile.ts:62` · seed `supabase/migrations/20270807254184_composable_event_foundation.sql:60-64` · backstop CHECK `20270808218211_samahan_communities_foundation.sql` (`events_community_class_consistency`) | `personal` = **wedding** · debut · christening · birthday · graduation · gender_reveal *(+ any type with no profile row, which defaults `personal`)* | `community_eligible` = simple_event · corporate · travel · celebration · tournament · reunion · **anniversary** | ✅ **The only shipped predicate whose life side includes the wedding.** Use this — but see the coupling hazard below. |
| `isPapicUncapped(eventType)` | `apps/web/lib/papic-cameras.ts` (shipped PR #3407) | — | — | Binary `!== 'wedding'`. Caps-only; **not** a life/non-life axis. |

**Three things the owner needs to decide, because the code cannot infer them:**

1. **`event_class` is semantically the wrong question, even though the answer is right today.** It means *"may a Samahan own this event type?"* — an ownership question, not a life question. The migration comment says widening that list is *"one small migration, same as the profile seed it mirrors."* If Papic's money fork rides on it, **a future Samahan-ownership decision silently reprices Papic for that type.** Recommendation: introduce a dedicated `event_type_profiles.papic_mode` (`ladder` | `lite`) column seeded from today's `event_class` split, so the two decisions can diverge. *(Owner call.)*
2. **`anniversary` flips sides.** `event_class` puts anniversary in `community_eligible` → **Lite**. But `Pricing.md` § 2.1a *and* the build brief both explicitly list anniversary among the **premium per-camera** life types. An anniversary is also auto-created by a wedding. **Which is it?**
3. **`gala_night` has no profile row** → falls back to `GENERIC_PROFILE.eventClass = 'personal'` → would land on the **LIFE** side. An awards night / fundraiser is lifestyle. Latent misclassification (currently harmless — `gala_night` is `enabled=FALSE` in the create picker), but it must be seeded before that type launches.

### 0.3 Consequences of the widening — what LIFE-vs-NON-LIFE changes vs the old `simple_event`-only Lite

Scoping Lite from *"`simple_event` + 4 types"* to *"**all** non-life types"* is a real widening: it adds **travel** and (per `event_class`) **anniversary**. The following now need answers.

- **Feature amputation across 7 of 14 types.** Lite has, by design, **no video · no face-sort · no personal reels · no Kwento · no Pabati · no Guest Stories · no Drive sync · no guest list · 4 MP only**. Under this decision every corporate, travel, celebration, tournament, reunion, anniversary and simple event **loses all of it**. Travel in particular is a memory-precious type where photos-only/4 MP/no-reels is a poor fit. **Is that the intent, or is Lite the DEFAULT with the ladder still purchasable on a non-life event?** (This is the brief's unresolved *"fork-vs-auto-route"* question, now load-bearing.)
- **The corporate revenue line in § 1 becomes unreachable.** § 1 justifies uncapped non-wedding pricing with *"300 Unli cams = ₱30,000 vs a wedding's ₱15,000."* Corporate is non-life → Lite, which tops out at **₱15,000 for 100,000 photos**. Either § 1's example is retired or Lite must not be exclusive on corporate.
- **The free tier needs an event-type branch.** `provisionFreeCamerasAdmin` (shipped #3407) provisions 3 `tier='free'` ladder seats **render-time, event-type-blind**. Under this decision a non-life event would get 3 free ladder cameras it is not supposed to have. Concrete build consequence: either gate provisioning on the life side, or define the non-life free taste as **Lite's free preview budget** instead.
- **Caps simplify.** `isPapicUncapped` (non-wedding = uncapped) now only ever applies to *life* non-wedding types (debut/christening/birthday/graduation/gender_reveal ± anniversary). The § 6 *"non-wedding uncapped → BIR/VAT on a larger base"* risk shrinks accordingly.
- **⚠ Name collision — "Papic Lite" is already shipped, meaning something else.** `apps/web/lib/vendor-papic-tier.ts:51` defines **Papic Lite = the VENDOR on-the-day free tier** (20 points, photos-only, earned by a non-token accept). That is a per-vendor points allowance on a booked event — *not* the shared crowd pool. Two live products named "Papic Lite," both photos-only, both ~20-unit budgets. **Rename one** (owner call) before either surfaces publicly.

### 0.4 Consent / CSAM posture — non-life events are samahan- and lifestyle-owned (**needs a fresh DPO answer**)

The Lite privacy design (`Papic_v3_Compliance_and_Admin_Delta_2026-07-17.md`, `Pricing.md` § 2.1a) was drawn for an **anonymous crowd at a concert/festival**: open QR, no gate, bystander consent at join, magic-link claim, public no-face-search takedown, NSFW + a **net-new CSAM known-hash matcher**. Scoping Lite to *all* non-life events changes the guest population and, in one case, the **controller**:

1. **A Lite pool can be owned by a COMMUNITY, not a person.** The Lite-eligible set is exactly the `community_eligible` set — so `events.community_id` may be non-NULL, and `community_member_can_read_events` (migration `20270808218211`) lets **every Samahan member read the event**. The PR-9/10/11 design assumes a single human *host* and reuses `event_members(member_type='couple')` for host-moderation RLS. **Open: who is the RA 10173 personal-information controller for a Samahan-owned Lite pool — the Samahan or the creating account? Does host moderation resolve when the owner is a community, and can any member moderate?** This is net-new; it is not answered anywhere in the current brief.
2. **Known-guest gatherings now fall under Lite.** Reunion, celebration, anniversary and travel are small, **invite-list** events that already have a guest list — the very thing Lite's "no guest list, no gate" model discards. **Open: should Lite reuse the event's guest list for a stronger consent basis when one exists**, rather than treating every participant as an anonymous walk-up?
3. **Minors exposure changes shape, not size.** The brief flags *"minors-in-crowd (concerts/reunions/tournaments)"*. Family-shaped types (celebration, anniversary, travel, reunion) reliably contain children **with an identifiable guardian present** — which makes guardian consent *possible* where a stadium crowd made it impossible. **Open (DPO): does an identifiable-guardian context raise the standard for Lite** (i.e. Lite may not be adequate for family events without a guardian-consent step)?
4. **CSAM matcher scope is unchanged and still net-new.** Widening Lite raises volume and the number of public QR surfaces, but not the control: the matcher remains mandatory and counsel-gated before `NEXT_PUBLIC_PAPIC_LITE_ENABLED` goes public.

**Nothing in § 0.4 blocks building PR-9/10/11 flag-dark.** All four items block the **public flag flip**.

### 0.5 ⚠ LIVE DEFECT (recorded 2026-07-20) — advertised capacity exceeds shipped enforcement

The public pricing page advertises a capacity the shipped fail-closed points gate **refuses**:

| Surface | Says | Truth (shipped) |
|---|---|---|
| `apps/web/app/pricing/page.tsx` (Papic Cameras synthetic SKU) | *"Ltd ₱30 (**30 photos + 10 videos**) … **first 5 free** … (Ltd **₱9,000** · Unli ₱15,000)"* | ₱30 = **Mini**, budget **20 points**. 30 photos + 10 clips = 30 + (10 × 3) = **60 points** — a buyer is cut off at 20. Free count is **3**, not 5. The ₱30 rung's wedding cap is **₱6,000**, not ₱9,000 (₱9,000 was the pre-#3407 uniform `papic_ltd_cap_php`; the real Ltd cap is now ₱10,000). |
| `apps/web/app/_components/home/pricing-data.ts` | *"Papic Ltd · 30 photos + 10×5s"* | same — 60 points advertised, 20 enforced, wrong tier name. |
| `apps/web/app/dashboard/[eventId]/studio/papic/guest-camera-tier-picker.tsx` | *"30 photos + 10 clips each, per day"* | same. |
| `apps/web/public/llms.txt` | *"Papic Ltd — ₱30 per camera per day (capped at ₱9,000)"* | wrong name, wrong cap; feeds answer engines. |
| `apps/web/lib/v2-catalog.ts` comment | *"₱30 · 30 photos + 10 videos"* | stale lineage comment. |

Root cause: the copy was written against the **retired per-kind quota model** (`PAPIC_TIER_QUOTA.roll = {photos: 30, videos: 10}`, now `@deprecated` in `lib/papic-cameras.ts`) and was never recut when brief-PR-1/PR-3 replaced it with the unified **capture-points** budget (`papic_tier_config`: free 20 · mini 20 · roll 20 · ltd 70 · unli ∞). Because #3407 shipped the gate **fail-CLOSED**, the mismatch is now user-visible as a hard **409 `camera_points_exhausted`** at 20 points.

- **Copy fix: in flight via a code PR** (repo-side; corpus records it here for traceability).
- **⏳ OWNER ACTION — pending, DB-side:** reconcile the **roll vs mini** rows in the live database. `papic_tier_config` carries both `roll` (legacy) and `mini` at identical 20 pts / ₱6,000; `platform_retail_catalog_v2` carries both `PAPIC_CAMERA_ROLL_DAY` ₱30 and `PAPIC_CAMERA_MINI_DAY` ₱30, and the ₱30 row's **live title reads "Papic Ltd"** and must be re-titled to **"Papic Mini"**. Decide whether `PAPIC_CAMERA_MINI_DAY` becomes the sole ₱30 SKU (deactivate/hide `..._ROLL_DAY`, keeping the id for lineage) or the two stay dual-listed. Copy cannot be fully correct until this lands.

---

## 1. Capture ladder — good / better / best (per camera · day)

| Tier | Price | Capture points | Daily cap (weddings only) | Role |
|---|---|---|---|---|
| **Free** — always **3 seats / event** | ₱0 | **20** | — | The taste. Face-sort + personal reels ON. |
| **Papic Mini** *(good)* | **₱30** | **20** | **₱6,000** (~200 cams) | **Width** — a 4th+ shooter at entry allowance |
| **Papic Ltd** *(better)* | **₱50** | **70** | **₱10,000** (~200 cams) | **Depth** — more capacity per shooter |
| **Papic Unli** *(best)* | **₱100** | **∞** | **₱15,000** (~150 cams) | Unlimited; full-res download / Drive archive |

> **Capture points (unified currency, owner 2026-07-17):** **1 photo = 1 point · 1 five-second video = 3 points.** The 3× weighting mirrors a video's ~3× storage, so a guest spends their points flexibly (all photos, all video, or any mix) and the pool cost stays bounded either way. **This unifies the wedding tiers AND Papic Open on ONE currency** — and **reverses** the old "two separate counters, never a unified shots currency" principle (2026-06-26, now stubbed): that made sense before Open existed; capture-points is the consistent model now. (Exact conversion of the old allowances was 19/66; rounded to clean **20/70**.)

- **Free and Mini share the 20-point allowance** by design: Mini is an *"add more cameras"* SKU (width); Ltd/Unli are *"more capacity"* SKUs (depth). No capacity reason to buy Mini within the first 3 free seats — its only job is a 4th+ shooter.
- **Ladder = 30 / 50 / 100.** Unli at 2× Ltd is a deliberate upsell — full galleries are the flywheel (face-sort → reels → shares → retention).
- **Upgrade = the tier difference:** Free→Mini/Ltd = ₱30/₱50 · Ltd→Unli = ₱50 · **Free→Unli = full ₱100** (no cheap backdoor from a free camera).
- **Minimum paid order: 1 camera** (was 5; retired now that the per-camera entry is cheap).
- **Caps bound per-camera CAPTURE only** — add-ons (Live Photo Wall ₱2,500, Camera Bridge ₱500, etc.) bill ON TOP.
- **Daily caps apply to WEDDINGS ONLY.** All other event types have **no daily cap** — per-camera pricing runs uncapped. (The cap rarely binds on smaller non-wedding events anyway; a large non-wedding event — e.g. corporate — pays full per-camera and *can exceed* the wedding cap: 300 Unli cams = ₱30,000 vs a wedding's ₱15,000.) **Cap logic must be `event_type`-aware** (apply only when `event_type = 'wedding'`). ⚠ **2026-07-20:** under the § 0 lock the ladder only sells on **life** events, so this uncapped path now only ever fires for *life non-wedding* types — and the corporate example above is **unreachable if Lite is exclusive on non-life events** (see § 0.3, open owner question).

---

## 2. Display vs download — the core architecture

The site only ever loads the **compressed AVIF** copy; **full-res is a download, never streamed.** This keeps galleries fast on venue wifi/mobile data and pushes the storage cost near zero.

| Layer | Where | Lifetime |
|---|---|---|
| **Compressed AVIF gallery** (~8% of original, born-AVIF single pass) | **R2** (Standard hot → IA cold ~1 yr) | **Kept indefinitely** — displayed on the website forever |
| **Full-res originals** | **R2 hot** during the window; then per §4 | **6 months** free window |

**Full-res download — three granularities (offer all; different jobs):**

| Level | How | Use case |
|---|---|---|
| **Per photo** | "Download original" in the lightbox — instant **presigned R2 URL** (egress-free) | "I want *this* shot to print." |
| **Per event** | "Download all" → **ZIP** (background job, emailed link) **or** automated via **Google Drive sync** | "Give me my whole wedding." |
| **Per account** | "Export everything" across all events | Full backup · also the **RA 10173 data export** |

---

## 3. Preserve — RETIRED

**Keep Full-Res is RETIRED entirely (owner 2026-07-17).** There is **no paid full-res hosting.** Full-res lives in exactly one of two places:

- **The couple's Google Drive** (free, if connected) — theirs forever, never touched by us; **or**
- **A download within the 6-month window** — per photo · per event · per account.

After 6 months only the **compressed gallery** remains (kept forever). ⚠ **A couple who neither Drive-syncs nor downloads within 6 months loses their originals from our side** — the gallery must surface this clearly and nudge Drive-connect / download well before the window closes. The old "pick specific / select-all" preserve selector, the ₱999/50 GB SKU, and the ×3.2 "Preservation DB" idea are all retired with it.

---

## 4. Storage lifecycle

1. **Capture** → R2 hot (compressed AVIF + full-res original) + Google Drive sync if connected.
2. **Months 0–6:** full-res on R2 hot (downloads served free via presigned URLs; Drive sync continuous).
3. **At 6 months**, **two** outcomes for full-res — **photos AND 5-sec clips alike** (owner 2026-07-17: clips compress at 6 mo too, so the clip-video storage tail is bounded, not unbounded):
   - **Drive-synced** → originals (photos + clips) live in the couple's Drive (₱0 to us; theirs forever).
   - **Not synced** → full-res **drops from R2** (the compressed gallery — photos + a compressed clip copy — stays forever).
4. **Compressed gallery:** kept **indefinitely** on R2 (Standard → IA) — compressed AVIF photos **+ compressed clip copies** (720p-class). No media type has an unbounded full-res tail anymore.

**Cold tier now applies ONLY to the compressed 5-yr gallery** — full-res is no longer hosted long-term, so the deep-cold apparatus shrinks a lot. R2 Standard while hot → **R2-IA** as galleries go quiet → **Backblaze B2 once the aggregate cold pile hits ~tens of TB** (S3-compatible + free egress via the Cloudflare Bandwidth Alliance; **not** Hetzner — EU-only + not S3). Do **not** self-host / build a NAS (3–10× costlier + catastrophic-loss risk). Net: our full-res storage burden is essentially gone — it rides the couple's Drive or a 6-month window, then drops.

---

## 5. Quality — FIXED per product (owner 2026-07-17, simplified)

**No per-event quality picker.** Quality is fixed by product — one less choice, and it removes the Full-Res/destructive-ingest complexity:

| Product | Quality | Long edge · ~MP · size | Video |
|---|---|---|---|
| **Wedding tiers** (Mini / Ltd / Unli) | **Optimal** | ~4256px · **~12 MP** · 3–5 MB — sharp to **A3** | clips 1080p |
| **Papic Lite** *(non-life events — § 0)* | **High Efficiency** | ~2560px · ~4 MP · 0.3–0.8 MB — screen/social/crowd | photos-only (no video) |

- **Wedding = Optimal 12 MP.** For phone-shot Papic (guests' phones ≈ 12 MP) this is essentially **native** — negligible loss. The 12 MP copy IS the "6-month high-res" that downloads / Drive-syncs. Market print capability as **A3, not A1.**
- **Full Res (1:1 / higher-MP) and the 3-way picker are DROPPED** — a photo ingests straight to Optimal. Since it's fixed (not a user choice) and ≈ phone-native, no destructive-choice confirm is needed.
- **Lite = High-Efficiency only**, photos-only.
- *Build simplification:* quality is derived from the mode/tier (wedding→`optimal`, lite→`high_efficiency`), not a per-event column the user sets. Simplifies PR-4 (no picker UI).

---

## 6. Retention & the year-5 question (final)

- **Compressed gallery: kept indefinitely** — no purge (aligns with the live "forever web copy" lock). Couples never lose their gallery, and never pay to keep it.
- **Only the per-event face-recognition vectors expire at ~5 years** — that's the real RA 10173 liability, not the photos. Keep the memories, expire the biometrics.
- **No year-5 pop-up-or-lose mechanic.** (The earlier "5-yr renewal → purge" idea is retired; a single missed prompt must never cost a couple their gallery.)
- **Ads considered + REJECTED** to fund old data: old galleries have ~zero traffic → ~₱0 yield, it torches the premium brand, and AdSense was already retired 2026-05-19. Storage is ~₱2/album — funded many times over by anniversary re-engagement + vendor subscriptions, not banners.

---

## 7. Free full-res preservation via Google Drive

The **default, always-offered** path — ~₱0 to Setnayan (R2 egress is free → Drive ingest is free).

- **Per-event Drive registration** — dedicated page + event-dashboard widget (extend `papic-drive.ts` / `DriveSafetyPanel`).
- **Least-privilege OAuth `drive.file`** (writes only to a folder it creates; can't read the rest of the Drive) — correct for RA 10173 + Google OAuth verification.
- **Up to 2 Drives per event** (overflow) · encrypted refresh tokens, RLS-scoped to the event owner.
- **Honesty:** free to us, but their Drive is 15 GB free → a full-res wedding may need Google One (~₱149/mo/100 GB) or a 2nd free Drive. Surfaced via `DriveSafetyPanel`, never hidden.

---

## Open owner sign-offs

**All resolved 2026-07-17.** Optimal = **12 MP** · Unlock-all bundle = **RETIRED** · Keep Full-Res = **RETIRED** · Patiktok = unaffected · add-ons (Kwento/Pabati/Stories) = **free with tiers**, Thank You ₱2,500 paid, Photo Wall hidden · Papic SLR/camera-bridge = **shelved**. Nothing outstanding — spec is build-complete.

## Build dependencies (apps/web — not corpus)

- Catalog/`events`: Mini row + Ltd reprice (₱50) + per-tier caps (₱6,000/₱10,000/₱15,000, **weddings-only**) + free tier 5→3.
- **Capture-points ledger** (photo=1, 5s video=3; atomic decrement; stop-at-zero) replacing photo+clip counters in `lib/papic-cameras.ts`.
- Full-res drop window 3 → 6 mo (`papic-fullres-drop`); **Keep Full-Res path REMOVED** (drop-or-Drive only).
- Optimal quality = **12 MP** ingest; 3-fidelity tier + video parity.
- Display-vs-download: per-photo / per-event ZIP (background job) / per-account export; presigned-URL delivery.
- **Papic Lite:** single shared pool, no gate, photos-only High-Eff, photo-metered billing, host moderation, join consent + email/magic-link claim, optional concurrency cap + fair-use sub-cap.
- Add-ons: Kwento/Pabati/Stories flip to included-with-tier; Thank You ₱2,500 paid (Mini/Ltd/Unli only); Photo Wall + Unlock bundle + Keep Full-Res deactivated in catalog.
- Cold-tier: R2-IA now; B2 adapter behind a flag for scale (compressed gallery only).
- Per-event Drive registration page + widget.
- Face-vector expiry sweep at ~5 yr (cron-free `claim_periodic_job`).
