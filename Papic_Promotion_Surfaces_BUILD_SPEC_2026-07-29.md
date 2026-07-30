<!-- Owner session 2026-07-29 (evening). Owner directive: "place it alongside what's next and all our other things to do. make sure to document everything we need for this so all builds will be correct and smooth." Source = full read-only audit of origin/main (post-#3875), agent-swept, surface by surface. Registered in WHATS_NEXT_INDEX.md. -->

# Papic Promotion Surfaces — BUILD SPEC (2026-07-29)

> **What this is.** The two-type Papic model (Pool + One) shipped completely on 2026-07-29
> (#3868 #3869 #3872 #3873 #3874 #3875 — see the DONE table in `WHATS_NEXT_INDEX.md`'s Papic
> register entry). This spec is the **follow-up wave**: every surface that still *advertises the
> retired model*, plus the places the new model should be promoted and isn't. **Nothing here is
> built.** Audit verified against `origin/main` on 2026-07-29; re-verify file:line before editing —
> the repo moves fast.

---

## §0 · The canonical model (copy NOTHING from memory — derive from these)

| Fact | Value | Source of truth |
|---|---|---|
| Papic Pool | unlimited cameras, SHARED shots · 50 pts free · top-ups **+3,000 ₱1,000 · +6,000 ₱2,000 · +10,000 ₱3,000**, repeatable | catalog rows `PAPIC_GUEST` / `_6K` / `_10K` (active) · `papic_pass_tiers` |
| Papic One | dedicated camera + own QR + unshared balance · **1 free camera @ 5 pts** · per camera **50 pts ₱50 · 100 pts ₱100** · reloadable · **no seat cap** · ₱1 = 1 shot | `PAPIC_CAMERA_MINI_DAY` / `PAPIC_ONE_100` (active) · `papic_one_tiers` |
| Currency | **1 photo = 1 pt · 10-sec clip = 8 pts** | `PAPIC_POINTS_PER_CLIP` in `apps/web/lib/papic-cameras.ts` |
| Free tier | 50-pt shared pool + 1 free One camera, auto-armed on EVERY event | `ensureFreePapicPoolGrantAdmin` / `ensureFreePapicOneCameraAdmin` |
| Guest buy | pool top-ups + own-camera One reloads, anonymous, admin-approval-gated | PR #3874 · flag `NEXT_PUBLIC_PAPIC_GUEST_BUY` (ON in prod since 2026-07-29) |
| Copy helpers | `papicPoolRungPhrase` / `papicOneRungPhrase` / `papicBucketPhrase` / `papicPointCurrencyTerms` | `apps/web/lib/papic-tier-copy.ts` — **the ONE place claims derive from** |
| RETIRED (never print) | "Papic 5 Seats ₱2,999" · pax-priced "from ₱2,999" · 250 pts/camera · clip = 7 pts · "first 3 cameras free" · "unlimited shots per day" · per-guest-per-day rates · "seat links" vocabulary · "Native iOS/Android app" | — |

**The iron rule of this wave: DERIVE, never hardcode.** Every price/points figure renders through
the helpers above or a live catalog read. The onboarding guardrail test blocks peso literals —
extend that pattern to any file you touch.

---

## §1 · Already correct — DO NOT touch (verified 2026-07-29)

`/pricing` (+ estimator) · onboarding services step + `onboarding-pricing.ts` · the Papic studio
(`HostPoolMeterCard`, `PapicOneCard`, crew page) · the guest buy sheet (`papic-buy-shell.tsx`,
fully derived) · budget line items (catalog titles flow through) · `/papic` landing page **model
copy** (two-type section is right; only economics/JSON-LD missing, → PR-F) · homepage narrative
(`pillars.tsx`, `HomeReskin.tsx:854`) · help articles: tagging, downloads, face, guest-camera.

---

## §2 · The build list — 7 PRs, ordered. Collision notes per item.

> Schema fields per §3 of `WHATS_NEXT_INDEX.md`. All are `parallel_safe: yes` against each other
> EXCEPT where noted — files are disjoint. None needs a migration. None needs a new flag.

### ~~PR-A 🔴 MONEY FIRST — the Maya billing fallback charges retired prices~~ → ✅ FALSE ALARM (closed 2026-07-30, no code)
- **The claim below is wrong, and this is the record of why.** `PRICING_BOOK` is a
  **demo-only** book, not a charge fallback. `readSkuPrice` (same file, line 355) is
  `if (DEMO_MODE) return PRICING_BOOK[serviceCode] ?? null;` and otherwise reads
  `platform_retail_catalog_v2` **honoring `is_active`**, returning `null` — i.e. refusing —
  when no active row answers. `readBundlePrice` (line 371) does the same. The constant's own
  comment (line 42) already says it: *"a REAL charge must NEVER fall back to a hardcoded
  number… Used solely when DEMO_MODE=1… Values here are stale on purpose-of-record; they
  never bill."* So the ₱2,999 literals cannot reach a real charge, and the "no active row ⇒
  REFUSE" behaviour the fix asked for **already ships**. Nothing to build.
- **Why the audit flagged it anyway** — and the lesson: a peso literal keyed by SKU in a
  billing route *looks* exactly like trap §3-4, and the file's top doc comment (line 9) still
  describes `PRICING_BOOK` as the fallback "if DB is unavailable", which is a stale
  self-description of code that was later hardened. The literal was read; the reader was not.
  **Check the consumer before believing the constant.**
- ~~`id: papic-promo#A` · `type: code` · `gate: NONE` · `depends_on: []`~~
- **`apps/web/app/api/v1/billing/initialize-maya/route.ts:48-59`** hardcodes `PAPIC_GUEST: 2999.0`
  and `PAPIC_SEATS: 2999.0` as pricing fallbacks. The live row is ₱1,000. This is a **charge
  path**, not copy — the `resolveRetailChargeCentavos`-class trap (charge paths don't filter
  `is_active`). Fix: derive from the catalog server-side; a code with no active row must REFUSE,
  never fall back to a stale constant. Sweep the whole fallback map, not just Papic.
- Verify: unit test pinning "no active row ⇒ refuse"; grep the file for any remaining literal.

### ~~PR-B 🔴 Homepage pricing block — three false claims on the highest-traffic surface~~ → ✅ DONE 2026-07-30 · PR #3880 · **but by DELETION, not by porting**
- **The three false claims were real. "Highest-traffic surface" was not.** `PricingData.groups`
  and `PricingData.freeChips` are **rendered nowhere**: `grep -rn "PriceRow\|PriceGroup\|
  freeChips\|perGuestDay"` over `apps/web` returns `pricing-data.ts` and nothing else. The
  2026-07-04 overlay redesign turned the Prices popup into a summary + one line-link out to
  `/pricing` (`HomeOverlays.tsx:177` says so in its own doc comment), and the only fields any
  consumer has read since are `aiPrice`, `aiIntroPhp`, `vendor`. The rows were rebuilt on every
  homepage request and published verbatim by `/api/home-pricing` — but nobody saw them.
- **That invisibility IS the mechanism.** Unrendered code has no witness. Every surface a couple
  can see was updated when the two-type model landed on 2026-07-29; this payload was not, and
  went on emitting the retired per-day meter, the POOL's free shared-seat count quoted as a
  Papic **One** allowance, and a `₱50/guest·day` rate for a product that is now flat per camera
  ("unlimited" only because prod's `mini.points_per_day` is NULL, which every copy helper reads
  as unlimited).
- **So porting was the wrong fix.** A second derived ladder that still nobody reads cannot be
  kept honest — it can only drift, invisibly, exactly as this one did. `/pricing` owns the real
  ladder. Shipped instead: `groups` · `freeChips` · `PriceModel`/`PriceRow`/`PriceGroup` ·
  `priceOf`/`freeOrPrice` · the per-request `readPapicTierConfig()` round-trip — all deleted.
  What remains is what is consumed (Setnayan AI price + vendor tiers).
- Also shipped as specced: the four retired per-day **display** helpers are gone
  (`publicPapicLadder`, `papicCapacityShort` — whose null branch *was* the string "unlimited
  shots per day" — `papicCapLadderPhrase`, `papicTierSummary`), plus the dead
  `papic-seats.ts` `PAPIC_SEATS_PRICE_PHP = 2999` footgun. `papicCapacityPhrase` **stays**: the
  studio's guest-camera picker is a live consumer.
- **Two CI guards moved with it, both stronger:** `papic-copy-guardrails.test.ts` now pins the
  homepage payload clean of Papic claims (`/papic/i` · `guest·day` · `unlimited shots` ·
  `papic_tier_config`) over **comment-stripped** source, with a failure message that points the
  next ladder at `papic_pass_tiers`/`papic_one_tiers` + the rung phrasers;
  `panood-retirement.test.ts` went from "the drop-the-row conditional is present" to "there is
  no table, so no ₱/day rate can be quoted".
- Verified: `tsc` clean · `next lint` clean · `lint:retired` 0/1,939 · **`test:unit` 5,380/5,380**.
- ⚠ **Consequence for PR-F:** its `depends_on: [B]` is void — B deleted the plumbing F was to
  reuse rather than building it. F now derives its own anchor straight from the helpers (which is
  what its own doc comment wanted anyway) and is **parallel-safe with C/D/E**.
- ~~`id: papic-promo#B` · `type: code` · `gate: NONE` · `depends_on: []`~~
- **`apps/web/app/_components/home/pricing-data.ts:177-228`** still renders via the RETIRED
  helpers (`publicPapicLadder`, `papicCapacityShort`, `papicFreeCameraCount`): "First 3 cameras ·
  unlimited shots per day — Free" and "Papic One · unlimited shots per day — ₱50/guest·day". Port
  to the two-type sources exactly as `app/pricing/page.tsx` did (it documents the same bug it
  fixed at lines 235-241). Feeds homepage + nav pricing peek + `app/api/home-pricing/route.ts`.
- Same PR: delete/deprecate the retired helpers in `papic-tier-copy.ts` (lines ~288-326, per-day
  phrasing) once their last consumer is gone, and the dead footgun
  `apps/web/lib/papic-seats.ts:41` (`PAPIC_SEATS_PRICE_PHP = 2999`, currently unreferenced).
- Verify: guardrail-style test that the block contains no "per day", no "unlimited", no peso
  literal; visual check of homepage pricing section.

### PR-C 🟠 Suite + Studio — the flagship Pool card is a fake door
- `id: papic-promo#C` · `type: code` · `gate: NONE` (the owner's 2026-07-29 lock *is* the
  authorization — pool is deliberately on sale; the card's own comment names blockers "0b
  repricing / 0c points pool", BOTH shipped in `20271019231590` + #3847/#3848)
- **`apps/web/lib/add-ons-catalog.ts`** — ONE file, fixes Suite and Studio grid together:
  - `papic-guest` (line ~594): flip `status: 'coming_soon'` → live; rewrite blurb from the
    retired pax pass ("every guest on the list gets a camera, all day") to the top-up truth
    ("one shared pool for the whole celebration — start free, add shots any time"); route to the
    Papic studio (purchases happen there; the Suite card is a doorway, not a checkout).
  - `papic` (line ~546): repoint `serviceKey` off dead `PAPIC_SEATS` so the price pill stops
    degrading to a bare "View"; blurb stays benefit-led, price/free-tier line derived.
  - `apps/web/app/dashboard/[eventId]/studio/page.tsx:162-175`: remove the `papicGuestPassAccess`
    dark-gate + its "This does NOT make anything purchasable" comment (it now does).
- ⚠ Side effect to verify deliberately: `[slug]/_components/site-body.tsx:1035-1048` inline guest
  camera keys on an active approved `PAPIC_GUEST` pack — buying a pool top-up now activates it.
  Confirm that's the intended doorway (it is, per the two-type model) and test the path.
- Verify: Suite + Studio render live cards with derived prices; `add-ons-detail.ts` copy still
  truthful ("Try it free before you commit" → state the real free tier).

### PR-D 🟠 Retire the PAPIC_SEATS gates — four surfaces permanently dark for every new couple
- `id: papic-promo#D` · `type: code` · `gate: NONE` · `depends_on: []`
- All gate on a SKU nobody can buy, so they never light up — while every event already holds a
  free pool grant + free One camera:
  - `apps/web/app/dashboard/[eventId]/launch/page.tsx:58,108-120` — day-of launcher card; copy
    hardcodes "share these 5 seat links" / "Share the 5 links".
  - `apps/web/app/dashboard/[eventId]/galleries/page.tsx:69,101-111` — Papic gallery card.
  - `apps/web/app/[slug]/_lib/loaders.ts:793` + `apps/web/app/[slug]/hub/page.tsx:320` — guest
    face-enroll prompt gating.
- Replace the predicate with the truth of the two-type model: an event "has Papic" when its pool
  grant exists (it always does now) — i.e. these surfaces become **always-on** for events, with
  copy derived from what the event actually holds (pool + N One cameras). Delete "seat" vocabulary.
- ⚠ Face-enroll copy: auto-tagging is DORMANT (no hosted model). Enrollment copy may promise
  "ready for tagging", never "you will be auto-tagged". See §5-4.
- Verify: create-event smoke — new event shows the day-of Papic card, gallery card, and enroll
  prompt without any purchase.

### PR-E 🟡 Copy sweep — stale strings, one PR
- `id: papic-promo#E` · `type: code` · `gate: NONE` · `depends_on: []`
- **`apps/web/lib/help.ts`**: rewrite `turn-on-papic` (line ~471 — "first 5 guest cameras free…
  crew seats" is the most wrong sentence in the help center) + soften `what-is-papic` (papic
  topic, ~466) and `papic-crew-how-to-shoot` (~501, seat vocabulary). ADD two articles:
  "Papic Pool vs Papic One — which do I want?" and "How shots work (1 photo = 1 pt · 10-sec
  clip = 8 pts) and how to add more". Topic label "Papic — candid photos" → keep or refresh.
- **`apps/web/app/features/_sections/_DayOfApparatus.tsx`** (Papic card, EN + Taglish twin):
  kill "Native iOS/Android app" (contradicts the no-install promise everywhere else); pitch the
  two types in one line.
- **`apps/web/app/_components/home/papic-demo-overlay.tsx:238`**: "The real Papic is unlimited,
  every guest, all day" → truthful line (unlimited CAMERAS, metered shots, free to start).
- Cosmetic, same PR: `app-store/studio-card-demo.tsx:70-78` ("PAPIC · SEAT 2", fictional "/8"
  cap) · `[slug]/_components/photo-moments-widget.tsx:110` ("Our paparazzo" singular) ·
  `[slug]/_components/editorial/data.ts` "5-second clips" comments (5s → 10s) + the
  `PAPIC_SEATS: 'Papic'` label-map key.
- Verify: repo lint guards (retired-strings) + grep for the §0 RETIRED list over touched files.

### PR-F 🟡 Promote where it's missing — public side
- `id: papic-promo#F` · `type: code` · `gate: NONE` · ~~`depends_on: [B]`~~ → **`depends_on: []`
  as of 2026-07-30**: B deleted the homepage pricing plumbing instead of porting it, so there is
  nothing to reuse. Derive the anchor here from `papic-tier-copy.ts`'s rung phrasers + the live
  catalog directly (the pattern `app/pricing/page.tsx` uses). F is now parallel-safe with C/D/E.
- `/papic` landing (`apps/web/app/papic/page.tsx`): add a **derived** price anchor (free-tier
  line + "top-ups from ₱X" via the helpers — its own doc comment resisted hardcoding, which
  derivation satisfies); name Pool + One in the `SoftwareApplication` JSON-LD `featureList`.
- Site-wide SEO strings (`app/page.tsx:127,136`, `app/layout.tsx:379`): "paid add-on" →
  mention the free tier ("free shared pool for every event; paid top-ups").
- `/realstories` gallery: cross-link Papic where services list it.
- Guest pitch: `[slug]/_components/tier-comparison-widget.tsx` — the guest-facing "two ways to
  celebrate" card pitches capture without ever saying "Papic"; name the product, link the camera.
- Verify: JSON-LD validates; no hardcoded pesos.

### PR-G ⏸ OWNER_DECISION — Papic presence on the couple's home surfaces
- `id: papic-promo#G` · `type: decision → code` · `gate: OWNER_DECISION` · `depends_on: [C]`
- `dashboard/[eventId]/page.tsx` (overview), `today/page.tsx`, `for-you/page.tsx` have **zero**
  Papic presence — a couple whose event already holds a free camera is never told from home.
- Decide the SHAPE first (owner): a needs-decision-style card? a launcher tile? a one-time
  "your free camera is ready" nudge? Show the owner 2-3 mockups before building — this is a
  home-surface design call, and home real estate is contested. See
  [[project_setnayan_launcher_needs_decision]] + the Overview council redesign memory.

---

## §2.1 · Build log

| PR | State | Landed |
|---|---|---|
| A | ✅ **FALSE ALARM** — already fails closed, no code | 2026-07-30 |
| B | ✅ **DONE by deletion** — the payload rendered nowhere | 2026-07-30 · [#3880](https://github.com/iscasasola/setnayan-platform/pull/3880) |
| C · D · E · F | ⏭ open · all four now parallel-safe (F unblocked by B) | — |
| G | ⏸ OWNER_DECISION — home-surface shape, mockups first | — |

## §3 · Traps (each has burned a session — treat as law)

0. **⚠ VERIFY THE SURFACE RENDERS BEFORE DESIGNING ITS FIX** (added 2026-07-30 — it changed
   both of the first two PRs in this wave). A file:line target is evidence that a *string*
   exists; it is not evidence that a *user reads it*, nor that the constant beside it is
   reachable. One grep for the consumer settled both: PR-A's peso literals turned out to be
   demo-only behind a hardened reader (no work), and PR-B's "highest-traffic surface" turned out
   to render nothing (deletion, not a port). **The audit's file:line targets in §2 are sound —
   its claims about which surface SHOWS them are audit-time inferences.** Grep the consumer
   (`grep -rn "<TypeName>\|<fieldName>"`), then decide the fix. And note the corollary the B
   session exposed: *unrendered code is where stale claims survive a lock*, because nothing
   catches them — when you find dead display code carrying a retired claim, deleting it is
   usually the fix, not updating it.

1. **Derive, never hardcode** — `papic-tier-copy.ts` helpers or live catalog reads. A peso
   literal in copy is a defect even when currently correct.
2. **`npm run build` cannot run locally** (7 GB heap, SIGTERM 143). Typecheck + lint + unit
   tests; never pipe an exit-code-you-trust command into `tail`/`head`.
3. **Grep the ref, not the working tree** — the main checkout sits wherever a prior session left
   it. `git grep … origin/main`.
4. **Charge paths don't filter `is_active`** (PR-A is this trap made flesh). "Invisible in the
   UI" ≠ "cannot be ordered/charged".
5. **Auto face-tagging is DORMANT** (no hosted model; enrollment ships, QR tagging carries the
   load). No surface may promise auto-tagging as live. The `/privacy` page biometrics
   contradiction (§5-4) gates loud promotion of face registration.
6. **Fresh worktree per PR off latest `origin/main`**, explicit staging (never `git add .` from
   home-root checkouts), changelog fragment in ROOT `changelog.d/`, arm auto-merge only after
   self-verification, prune the worktree after merge.
7. **Parallelism:** A–E are file-disjoint and safe in parallel; F depends on B; G is gated.
   None adds a migration.

## §4 · Verification recipes

- Retired-claims sweep (run over the DIFF and over each touched surface's rendered copy):
  `git grep -inE "5 seats|seat link|2,?999|250 (pts|points)|unlimited shots|per day|first (3|5)|native iOS|5-second" origin/main -- apps/web` — expect only §0-documented survivors (comments naming the bug they fixed).
- Live checks post-merge: homepage pricing block · Suite Papic cards clickable with prices ·
  new-event smoke (day-of card + gallery card + enroll prompt present with zero purchases) ·
  `/papic` JSON-LD.
- The repo's `lint retired strings` CI guard — add the newly-retired strings to it if the guard
  is pattern-based (check `.github/workflows/ci.yml` for the script it runs).

## §5 · Adjacent open items (NOT this wave — tracked so nothing is lost)

| # | Item | Gate |
|---|---|---|
| 1 | **Papic One roster** — guest × camera × shots-left on /crew, reload inline, fix the "Free camera 11" label for seat 110 | AUTO-OK (offered, owner hasn't said go) |
| 2 | **Clip compression + photo purge** — the storage guardrail the owner knowingly overrode when putting Pool rungs on sale; build before real volume | AUTO-OK to build, owner should prioritize |
| 3 | **Instant payment rail (PayMongo/GCash API)** — guest mid-event reloads currently wait on manual admin approval | OWNER_DECISION (roadmap V1.5) |
| 4 | **`/privacy` biometrics disclosure** — live page denies biometrics while face enrollment ships; disclose-then-enable gate before promoting face registration | AUTO-OK (small, compliance-critical) |
| 5 | **Face-matching model hosting** — makes auto-tagging real; cost + DPO angle | OWNER_DECISION + DPO_COUNSEL |
| 6 | **AI-card CTA in onboarding** — no event row exists yet, card states-not-links; `aiHref` prop ready | OWNER_DECISION |
| 7 | **Papic compare-at anchors** — removed (old ₱75k/₱32k sized against dead products); owner supplies numbers if wanted | OWNER_DECISION |
| 8 | **BIR: "Guest of <event>" receipts** — accountant sign-off | OWNER (document-not-block) |
| 9 | **Vendor capture in card copy** ("every camera at your event") | DPO_COUNSEL (`vendor_papic_capture` OFF, route 403s) |
| 10 | **4 dirty `panood-*` worktrees (~19.6 GB)** — merged branches, uncommitted local edits; owner reviews keep-or-kill | OWNER |
