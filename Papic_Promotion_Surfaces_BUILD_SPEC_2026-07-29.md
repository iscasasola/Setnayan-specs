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
| **NAMES — there are exactly TWO** | **Papic Pool** · **Papic One**. Nothing else is a Papic product. 🔒 **Owner naming lock 2026-07-30: _"we do not have papic guests — we only have Papic Pool and Papic One."_** `PAPIC_GUEST` / `papic-guest` / `papicGuestPassAccess` / `PapicGuestCapture` are FROZEN TECHNICAL IDS predating the naming and must not be renamed — but no display surface may print "Papic Guest", "Guest Pass", "Guest Camera Pack" or any other invented product name. A guest's phone shooting from the pool may be *described* as a camera; it is not a product. | owner, 2026-07-30 |
| RETIRED (never print) | "Papic 5 Seats ₱2,999" · pax-priced "from ₱2,999" · 250 pts/camera · clip = 7 pts · "first 3 cameras free" · "unlimited shots per day" · per-guest-per-day rates · "seat links" vocabulary · "Native iOS/Android app" · **"Papic Guest" / "Premium Guest Camera Pack" as PRODUCT NAMES** (added 2026-07-30 — the second one never existed under any pricing model) | — |

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

### ~~PR-C 🟠 Suite + Studio — the flagship Pool card is a fake door~~ → ✅ DONE 2026-07-30 · PR #3884
- **Shipped as specced on the flip; two details differed, both verified against prod first**
  (`PAPIC_GUEST` ₱1,000 · `_6K` ₱2,000 · `_10K` ₱3,000 all `is_active`; the pax-priced ₱2,999 row
  is the *superseded* `PAPIC_GUEST_TOPUP`; `PAPIC_SEATS` inactive; **zero `PAPIC_*` orders ever**;
  both prod events hold a `free_grant` row):
  - **`papic`'s `serviceKey` was REMOVED, not repointed.** The predicted "price pill degrades to a
    bare View" does not happen — `freeTrial` short-circuits `pillFor()` first. The actual defect was
    `isRecommendable()`, which needs only `Boolean(serviceKey)`: a coordinator could **recommend a
    SKU nobody can buy**. Papic has no single representative SKU (two products, five active rows) —
    `variablePricing` already declares that. Repointing at a Pool or One row would name one rung as
    "the" Papic price.
  - **`papicGuestPassAccess()` was KEPT.** It is event-type **eligibility** (permanent travel deny ·
    anniversary controller split · phase ladder), not a darkness switch; it fails closed for a new
    type, and widening it is an owner/DPO call by the module's own rule. Only the stale ⚠ comment
    ("does NOT make anything purchasable… all four rows are `is_active = false`" — false in both
    halves) was rewritten.
- Also: Pool card `coming_soon` → `web_v1` · `Soon` tag → `Shared` · `freeTrial: 'Free to start'`
  (honest: the ₱1,000 cheapest top-up as a headline misprices a product whose entry cost is zero) ·
  blurb off the pax pass ("every guest on the list gets a camera, all day") onto the shot pool ·
  `add-ons-detail` "Try it free before you commit" → "Your first shots are already free — no card" ·
  `papic-guest` added to `STUDIO_RECOMMEND_EXCLUDED` (a rung must not be auto-pushed beside its own
  umbrella; still browsable + coordinator-recommendable).
- **Owner naming lock applied here too** (see §0): the guest-site label map's `'Papic Guest'` →
  `'Papic Pool'`, and the moderation empty state stopped telling couples to add *"the Premium Guest
  Camera Pack"* — a product that has never existed. ⏭ Remaining display strings: `app/page.tsx:127`
  + `layout.tsx` SEO copy → **PR-F**; `initialize-maya` `TITLE_BOOK` → demo-only, never bills.
- Three guards moved in the same PR: the catalog gate test flipped **as its own comment instructed**
  and now also forbids pax language + literals in the blurb; the free-or-paid invariant accepts
  `freeTrial` (it guards `pillFor()`, which resolves a trial chip before the bare "View"); the Studio
  drift guard satisfied explicitly.
- ⚠ **The side effect verified, and it predates this PR:** `[slug]/_components/site-body.tsx` mounts
  the inline guest camera on an active approved `PAPIC_GUEST` pack — already reachable from the
  studio + guest-buy surfaces, so the card flip adds a doorway, not a capability.
- ⚠⚠ **GATES 0d/0e WERE NOT CLOSED BY THIS PR — see §5 item 11.** The card's comment named FOUR
  blockers, not the two the spec listed. 0b/0c are closed; **0d (guest-media ROPA row) and 0e (DPO
  sign-off that the RSVP consent text names guest-phone capture + face-sorted delivery) are still
  `[PENDING DPO]` from 2026-07-20.** They were correctly *not* treated as blockers — the sale they
  gate went live 2026-07-29 through the studio and the guest buy sheet — but that means the gate was
  crossed by the sale, not by the card. Escalated as its own owner item so a "Soon"-pill deletion
  cannot launder a compliance decision.
- ~~`id: papic-promo#C`~~

### ~~PR-C (original text, for the record)~~
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

### ~~PR-D 🟠 Retire the PAPIC_SEATS gates~~ → ✅ DONE 2026-07-30 · PR #3887 · **3 of 4 surfaces; the 4th deliberately not widened**
- Prod-verified premise: `PAPIC_SEATS` `is_active=false`, **zero `PAPIC_*` orders ever**, and both prod
  events carry live `paparazzi_seats` rows + `free_grant:50` + `camera_grant:5`.
- **Day-of launcher + galleries hub** → both repointed at **`eventPapicActive()`** (RULE 0: the
  canonical predicate already existed — any live seat row OR an active Papic-inclusive SKU — so no new
  predicate was invented, and it reads true from real rows rather than a hardcoded `true`, because both
  free allowances arm at event creation and the free camera IS a seat row).
  ⚠ The galleries case was worse than a missing upsell: photos **already in** `papic_photos` /
  `papic_guest_captures` had **no card on the couple's own gallery hub** — real captured media
  unreachable from the surface built to reach it.
- **Copy:** "share these 5 seat links" · "Share the 5 links" · "shooter seats" all deleted — they state
  a count the app cannot honour (One has no seat cap, Pool cameras are unbounded). Also fixed the
  **crew page the new CTA lands on** ("Your five seats are ready" → derived from the roster,
  singular-aware; "seat link"/"seats claimed"/"Seat reissued" → cameras), because fixing a doorway
  whose destination still says "five seats" is half a fix.
- **⚠ FACE-ENROLL (`[slug]/_lib/loaders.ts` + `hub/page.tsx`): dead operand REMOVED, gate NOT widened.**
  `eventOwnsPapicSeats` could never be true, so every guest page-load bought an extra `orders` read for
  a guaranteed `false` on a PUBLIC route — deleted (behaviour-identical, one less round-trip). But the
  spec's "make it always-on" was **declined**: this prompt collects a **selfie** (RA 10173 §13(b)
  sensitive PI) while (1) auto face-matching is DORMANT so an enrollment gains the guest nothing today,
  (2) the live `/privacy` page still DENIES biometrics, and (3) **gates 0d/0e — including DPO sign-off
  that the RSVP consent text names face-sorted delivery, i.e. precisely this prompt — are open**
  (§5-11). Document-not-block with a **disclose-then-enable** guardrail argues against collecting more
  biometrics from more people for a dormant feature. **One line to widen the day 0d/0e close**; both
  files carry a twin comment saying so.
- **Left alone deliberately:** `papic/actions.ts:280` + `api/upload/route.ts:297` call
  `eventOwnsPapicSeats` to **authorize a seat upload**. Widening those would be a security change
  wearing a copy change's clothes.
- ~~`id: papic-promo#D`~~

### ~~PR-D (original text)~~
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

### ~~PR-E 🟡 Copy sweep~~ → ✅ DONE 2026-07-30 · PR #3890
- **help.ts** — `turn-on-papic` rewritten (it was the wave's worst sentence: no 5-camera free tier, no
  seat count to pick, no seat) · `what-is-papic` names the two products for the first time and drops
  "if you add it, every guest can snap photos too" (guest capture is not an add-on purchase now) ·
  `papic-crew-how-to-shoot` de-seated + answers the crew member's likeliest question (own balance,
  top-ups). **TWO NEW ARTICLES** as specced: `papic-pool-vs-papic-one` ("the Pool covers the room but
  everyone draws from one purse; a One covers a person whose balance is safe regardless") and
  `how-papic-shots-work` (one purse for photos AND clips — which is *why* we never promise an exact
  "N photos + M clips" — and top-ups STACK, never replace).
  🔑 **The shot weights are DERIVED** via `papicPointCurrencyTerms()`: the clip weight moved 7 → 8 on
  2026-07-29, and typed prose would have gone quietly wrong that day on the one surface a confused
  couple reads.
- **features `_DayOfApparatus`** — "Native iOS/Android app" killed in **both** the EN and Taglish twins
  (they drift independently) · **demo overlay** — "unlimited, every guest, all day" was three retired
  claims in six words · **`studio-card-demo`** — `PAPIC · SEAT 2` + a `3 / 8` counter: no seats, and no
  per-camera cap of 8 anything has ever existed (a demo tile must not invent a limit the product lacks)
  · **`photo-moments-widget`** — "Our paparazzo" singular · **`editorial/data.ts`** — six "5-second
  clip" comments → 10-second, sitting next to the clip-selection code.
- ~~`id: papic-promo#E`~~

### ~~PR-E (original text)~~
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

### ~~PR-F 🟡 Promote where it's missing — public side~~ → ✅ DONE 2026-07-30 · PR #3892
- 🔴 **THE FINDING, not in this spec: `/papic` promised LIVE auto face-matching in three places** — a
  FAQ answer ("Papic recognises faces… automatically"), step 02 ("automatically, in real time") and the
  comparison table ("sorted by face"). The first was **inside the `FAQPage` JSON-LD**, i.e. served to
  answer engines as a quotable fact about a capability that does not exist. All three now lead with the
  mechanic that IS instant — hold a place-card QR, or a table sign for the whole table, in frame.
  Enrollment appears once as "ready to be matched", never as a promise a guest WILL be found. **This is
  §3-5 enforced on the surface most likely to be cited.**
- **Derived price anchor** — the page quoted no price at all ("prices are admin-managed + provisional"):
  right about hardcoding, wrong about silence, because the highest-intent Papic page never told a couple
  Papic starts FREE. `resolvePapicAnchor()` reads `papic_pass_tiers` / `papic_one_tiers` /
  `papic_event_pool_config` + the active catalog and renders through the `papic-tier-copy` helpers.
  **Zero literals.** Fails quiet: an unpriceable rung is DROPPED (₱0 on a price list reads as "free"),
  and if nothing resolves the block is omitted and the page is byte-identical to before. Stays
  `force-static` + `revalidate 3600`.
- **JSON-LD featureList** leads with Pool + One, adds the free tier + the QR-tag line, drops "every
  photo automatically finds the people in it" · **SEO**: `app/page.tsx` called Papic a "(paid add-on)"
  full stop and its meta description carried the retired name **"Papic guest photo-and-video capture"**
  (the string PR-C logged for here) — both fixed, plus `layout.tsx`'s Organization description ·
  **guest pitch**: `tier-comparison-widget` sold capture as "Shutter" and never said "Papic" — the
  flagship product pitched anonymously to the exact person who uses it.
- ⛔ **NOT DONE — the `/realstories` service-badge cross-link.** Those badges sit **inside** the story
  card's own `<Link>` (`gallery.tsx:192-316`); nesting an anchor is invalid HTML and would break the
  card's click target. That is a gallery-interaction restructure, not a copy change. Badges remain
  accurate, just inert. Whoever owns that component should decide.
- ~~`id: papic-promo#F`~~

### ~~PR-F (original text)~~
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

### ~~PR-G ⏸ OWNER_DECISION~~ → ✅ **DONE 2026-07-30 · PR #3895 · owner picked A + B**
- **Shipped:** `lib/papic-home-tile.ts` — ONE resolver behind both surfaces (shots from
  `papic_event_pool_status`, the same RPC the capture path meters against, so tile and fence cannot
  disagree; cameras from live `paparazzi_seats`; photos from both capture tables). Rides
  `<EventDashboard>`'s existing `Promise.all`; returns `null` ⇒ **neither** surface renders.
  `preCapture` is the single switch dividing the two jobs.
- **A · the tile** — pre-capture "shots ready · N cameras out", flipping to "photos gathered ·
  N shots left" on the first capture (owner default, question 2).
  ⚠⚠ **THE MOCKUP MISSED A DOCUMENTED BUDGET AND THE BUILD HAD TO FIX IT:** the mockup drew a
  3-across bento, but the real block is a **capped 2×2** whose own comment budgets *"focal(1) +
  digest(1) + ≤4 minis + chrome(2) ≤ 8 above fold"* (`backdrop-filter` is the expensive part) — and
  four minis already exist. An unconditional fifth would have quietly broken a performance budget.
  So `MAX_MINIS = 4` is now explicit, push order is priority, and the ONE deliberate re-order is
  that **once photos are landing** Papic outranks unread threads (which keep their own nav badge).
  Before the first photo it stays last and appears only if a slot is free — the nudge introduces it
  instead, which is why A **and** B were both worth shipping.
- **B · the nudge** (`_components/papic-ready-nudge.tsx`) — a deliberate SIBLING of `SetDateNudge`
  (same geometry/hairline/shape/`localStorage`), because a second nudge style in one slot reads as
  a second kind of message. Retires three ways: dismissed · first photo · the tile taking over.
  **Waits its turn behind the set-date nudge** (owner default, question 3) and costs a date-less
  event **zero** queries. No number in its copy.
- **Tests:** `lib/papic-home-tile.test.ts`, 9 cases. ⚠ First run failed 5/9 and **the STUB was
  wrong, not the code** — the resolver reads in parallel, so one shared query builder had every
  `then()` read whichever table `from()` was called with LAST. Fresh chain per `from()`, reason
  commented. Any future stub for a parallel reader needs that shape.
- ⏭ **Noted, not touched:** `ADD_ON_SKU_MAP.papic` is still `[]` though five Papic rows are active.
  **Dormant, not live** (nothing calls `resolveAddOnState('papic')` — grep-verified), but it is the
  identical shape of the `panood` bug that map's own comment records fixing on 2026-07-21, where a
  stale entry locked a paying couple out. Close it before anything routes Papic through
  `resolveAddOnState`.
- ~~`id: papic-promo#G`~~

### ~~PR-G (mockup stage, for the record)~~
- **Prototype: [`06_Prototypes/Papic_Home_Presence_2026-07-30.html`](06_Prototypes/Papic_Home_Presence_2026-07-30.html)** ·
  artifact `50889ae8`. Three placements drawn IN their real insertion slots using the shipped
  `--sn-*` tokens, the real `.sn-tile` / `.sn-eye` / `.sn-row` styles and the real `SetDateNudge`
  structure — verified in-browser (no overlap · no collapsed elements · no horizontal scroll).
- ⚠ **SCOPE CORRECTION — this is ONE surface, not three.** `today/page.tsx` was RETIRED 2026-06-03
  (a 36-line redirect to event-home) and `for-you/page.tsx` RETIRED 2026-06-04 (redirects to
  `/vendors`). Both are bookmark-keeping stubs. Only `dashboard/[eventId]/page.tsx` exists — the
  same class of stale premise as PR-A and PR-B in this wave.
- **A · a bento mini-tile** (`event-dashboard.tsx` → the `miniTiles` array) — permanent status,
  beside Guests / Budget / Team. Passes the bento's own "real-data-or-nothing" law because every
  event holds a live pool grant. Cost: one grid cell, forever.
- **B · a `slotAfterBento` nudge** (`page.tsx` → the existing slot that already carries
  `SetDateNudge` + `NikahEssentialsCard`) — "Your free camera is ready", dismissible, remembered
  per event in `localStorage`. Cost: one band, once.
- **C · a decisions-board row** — ⛔ recommended AGAINST. Papic is a **capability the couple already
  owns**, not a decision awaiting them; the row's own subtitle has to admit "nothing is waiting on
  you" while sitting in a list titled *Needs your call*. A board that cries wolf about a free camera
  teaches couples to skim the board the photographer deadline lives on. It becomes right the day
  Papic gains a real deadline (pool expiring · shots projected to run out mid-reception).
- **RECOMMENDATION: ship A + B, skip C.** They answer different questions — the nudge says *you
  already have this* and leaves; the tile says *where it stands* and stays. Smallest footprint that
  closes the gap.
- ⏭ **Three questions for the owner** (in the prototype's closing section): ① A, B, both or C?
  ② what should the tile count before anyone shoots — shots-ready or cameras-out? ③ does the Papic
  nudge queue behind the set-date nudge on a date-less event?
- Every figure in the built version derives (`papic_event_pool_config` readers +
  `papicPointCurrencyTerms()`); no shot or peso literal.

### ~~PR-G (original text)~~
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
| C | ✅ **DONE** — Pool card live; umbrella card's dead SKU removed; owner naming lock applied | 2026-07-30 · [#3884](https://github.com/iscasasola/setnayan-platform/pull/3884) |
| D | ✅ **DONE** — seat gates retired on 3 of 4 surfaces; face-enroll gate de-deadened but **NOT widened** (biometrics · §5-11) | 2026-07-30 · [#3887](https://github.com/iscasasola/setnayan-platform/pull/3887) |
| E | ✅ **DONE** — help center rewritten + 2 new articles (shot weights DERIVED); "Native app" and the demo's fake cap killed | 2026-07-30 · [#3890](https://github.com/iscasasola/setnayan-platform/pull/3890) |
| F | ✅ **DONE** — derived price anchor + JSON-LD on /papic; **and it stopped promising live auto face-matching in 3 places** | 2026-07-30 · [#3892](https://github.com/iscasasola/setnayan-platform/pull/3892) |
| G | ✅ **DONE** — owner picked A + B; bento tile + one-time nudge, one shared resolver | 2026-07-30 · [#3895](https://github.com/iscasasola/setnayan-platform/pull/3895) |

## ✅ THE WAVE IS COMPLETE — all 7 closed on 2026-07-30 (A needed no code).

**Three of the seven premises were stale**, all found by checking the consumer / the database / the
component rather than the spec: A (demo-only price book, already fails closed) · B (the payload
renders nowhere) · G (two of its three named surfaces are retired redirect stubs). That is the
§3-0 trap earning its place.

**What outlived the wave** — the one open item is **§5-11: DPO gates 0d/0e**, and PR-F made it
louder by promoting Papic publicly.
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
| 11 | 🔴 **Verdict gates 0d/0e are OPEN while the product SELLS** (surfaced 2026-07-30 building PR-C). `Papic_Access_Scope_Council_Verdict_2026-07-20.md` §0.5 + `Papic_Compliance_Delta_2026-07-20.md` §2.2: **0d** = a ROPA row covering guest-phone captured MEDIA (the 20 filed rows cover RSVP *preferences*, biometric vectors, and generic "event data" — **none names photographs**), **0e** = DPO confirmation that the RSVP consent text names guest-phone capture AND face-sorted delivery. Both `[PENDING DPO]` since 2026-07-20. **The sale they were written to gate went live 2026-07-29** (3 Pool rows active + anonymous guest buy, flag ON) — so this is no longer "before we launch", it is "while we bill". Not a blocker on any build (owner's standing *document-not-block* default), but it is the one item in this wave that gets WORSE with every surface we promote, and PR-F promotes it publicly. Two paragraphs of drafting + a DPO yes/no. | **DPO_COUNSEL** (drafts exist · owner decides when to file) |
