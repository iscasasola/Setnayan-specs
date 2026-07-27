# Explore Replan — BUILD SPEC
**Date:** 2026-07-27 · **Status:** BUILD-READY · **Execute in:** a fresh session (this spec is the cold-start contract)
**Design:** [`Explore_IA_Replan_2026-07-27.md`](Explore_IA_Replan_2026-07-27.md) (+ §5 owner additions) · **Behavioral spec = the playable prototype:** [`Design_Explore_Replan_2026-07-27/explore_replan_playable_2026-07-27.html`](Design_Explore_Replan_2026-07-27/explore_replan_playable_2026-07-27.html) (artifact fb168bd2 mirrors it). When prose and prototype disagree, the prototype wins — the owner iterated on it five rounds.

## 0 · Read first (in order)
1. This file, fully. 2. The playable prototype (open it, click through one lock loop). 3. `Explore_IA_Replan_2026-07-27.md` §0–§5. 4. DECISION_LOG 2026-07-27 rows: multi-pick floor · IA replan · §5 additions · SERVICE-CARD RECONCILIATION · stateful-inquiry amendment. 5. Repo rules: worktree off `origin/main` per PR · changelog fragment in ROOT `changelog.d/` · `gh pr merge --auto --merge` · verify BEFORE arming auto-merge · prune worktree after merge · `pnpm install --frozen-lockfile --prefer-offline` in fresh worktrees.

## 1 · The target surface (all of it already exists — this wave EXTENDS)
Live path `/dashboard/[eventId]/vendors` (BUDGET_BUILD ON in prod): single-scroll `ServicesTakeover` — bench (`shortlist-categories.tsx`, folder accordion + carousel rails) · Build (`Build3StateControl`+`BuildLocked`) · Budget (`MerkadoBudgetLens`) · Compare (`build-compare.tsx`). ⚠ `PlanBudgetAccordion` is the legacy kill-switch path — do NOT build on it (PR #3789's UI affordances live there; carry them here, PR-D/PR-A).

## 2 · Decisions in force
| # | Decision | Source |
|---|---|---|
| 1 | Multi-lock everywhere except `HARD_SINGLE_PICK_GROUPS` (6); "at least 1 is the floor" | #3789 + log row |
| 2 | Post-lock in multi-pick: toast asks "done with this service, or add another?" → `'complete'` / stay open. Hard-single auto-completes | design §1.3 |
| 3 | Incompatible-after-anchors cards: DIM + booking-DISABLED + SINK behind "Not available" divider, never removed; **"Ask anyway"** keeps the thread path (dimmed-but-viewable, per prototype — owner played it 5 rounds without objection) | design §1.2 |
| 4 | "I'm done" collapse = one-line "✓ Covered — reopen" row (per prototype) | design §1.3 |
| 5 | Coverage Strip = ICON tiles (Lucide in production, NOT emoji) + state ring/badge + NEXT flag + progress ring; urgency-ordered; in-plan categories only | §5 + prototype |
| 6 | Adaptive category set: in-plan vs "＋ Add to your plan" pool per folder; "Not needed? Remove"; a category with a locked vendor is NOT removable | §5.2 |
| 7 | ⓘ per tile → plan-group `hint` via the tile→group bridge; finer tiles need copy (Taxonomy Studio later; ship group hint as fallback) | §5.1 |
| 8 | Lock summaries: collapsed rows show locked vendor names; folder heads show "● N locked · N to decide · ＋N more"; Your team gets "Still needs your decision" | §5.3 |
| 9 | **Three-action card:** "＋ Add to build" (primary, `event_build_picks` ◕) · **Inquire / 💬 Check inquiry (STATEFUL on thread existence)** · "Lock now — it's final" (quiet secondary). Hard-single build holds ONE candidate (add swaps). Locking removes the pick from build | reconciliation rows |
| 10 | Plans (Compare renamed): locked picks PINNED identical in every column; columns vary build candidates; "Save current as a plan" from Your team | design §2.4 + prototype |
| 11 | Your team: locked + candidates ("ready to lock" per-row Lock ✓) + anchors + Locked/In-build/Budget/**Buffer** tiles | prototype |

**⛔ One hard owner gate (blocks PR-G only):** lock-reserves-nothing (DECISION_LOG 2026-07-26) — greying options on a lock that holds no date isn't credible. Owner must pick (a) pool-acquire at `contracted` + ~7-day unpaid expiry (recommended) or (b) "Lock is a claim" labeling. **Also prereq for G:** the `/find-date` dead vendor pool (42703, two non-existent columns) must be fixed.

## 3 · PR slices (each = one worktree · one PR · flag-dark; build in order, A→F are unblocked TODAY)
**Flag:** everything user-visible behind `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` (new, default OFF; helper `lib/explore-replan-flag.ts` mirroring `payment-gated-lock.ts`). Never flip in prod — owner flips after preview.

### PR-A — 'complete' decision + done-or-add-more toast (S)
- Migration: extend `event_category_decisions` CHECK to `('excluded','deferred','complete')` (drop + re-add constraint; RLS/ACL untouched). Ledger rule: dispatch + verify the OBJECT (constraint), not just the ledger.
- `lib/checklist-state.ts`: type + resolution for `'complete'` (reversible).
- Post-lock toast: `_components/lock-milestone.tsx:122` (`LockMilestoneToast`) + `accordion-lock.tsx:271-299` — multi-pick lock adds the two-button question ("✓ I'm done" writes `complete` via a new server action next to `flagCategory`; "＋ Add another" no-op keeps rail). Hard-single: auto-write `complete` in `finalizeVendor` (`vendors/actions.ts:650` family) after the existing milestone block. Undo (`revertVendorToConsidering`) must clear `complete`.
- Bench: "✓ Covered — reopen" row state in `shortlist-categories.tsx` tile body.

### PR-B — Coverage Strip v2 + folder summaries (M)
- Upgrade the plan-strip (`shortlist-categories.tsx:628-648`, `openPlan` machinery stays) → icon tiles: Lucide icon per tile (add an `ICON` map beside `WEDDING_TILE_LABEL` in `lib/taxonomy.ts`), state derived empty/explore/picked(build)/locked/done, count badges, NEXT flag, "Covered X of Y" + SVG progress ring.
- Urgency order: `timelineStatusOf` (`lib/vendors-plan-budget.ts:470`) via the tile→group bridge (`catalogTile` on plan groups / `canonicalServicesForTile` in `lib/vendor-counts.ts`); done sink right.
- Folder heads: "● N locked · N to decide · ＋N more" pills.

### PR-C — Adaptive category set + ⓘ (M)
- Schema: nullable `tile text` column + partial UNIQUE `(event_id, tile)` on `event_category_decisions` (tile-level exclude; plan-group rows keep working). REVOKE-check per default-ACL rule if any new object.
- In-plan set = onboarding-planned tiles (`ShortlistTile.planned`) ∪ tiles with picks/locks − tile-excluded. Folder bottom: "＋ Add to your plan" chips (clears exclusion / adds); per-tile "Not needed? Remove" (writes exclusion; GUARD: refuse if any locked vendor in the tile's categories — toast "unlock first").
- ⓘ on tile rows → group `hint` (`wedding-plan-groups.ts` hints; bridge as PR-B).

### PR-D — Three-action card + lock-on-bench (L)
- Bench `VendorCard` (`shortlist-categories.tsx:810-853` rails): "＋ Add to build" → `setBuildPick` (`build-pick-actions.ts`; multi already supported; hard-single swap = existing `replacesSiblingsOnPin` rules in `lib/build-pick-rules.ts`) · stateful Inquire/"💬 Check inquiry" (thread-existence probe — the `InquiryComposer` existing-thread guard's query, surfaced onto the card; fresh → composer, exists → open thread) · "Lock now — it's final" → reuse `AccordionLockButton` (`accordion-lock.tsx:135`) so conflict gate/date-modal/milestone/undo all carry.
- Collapsed tile rows: locked-vendor-names line; rail-end card: "＋ Add another {tile}" when locked && !hard-single (carries #3789's affordance to the live bench).
- ⚠ SERIALIZE with the Booking session — it owns Card→Details→Inquiry and `v/[slug]` surfaces; `vendors/page.tsx` + card components are HOT. Check `gh pr list` + message that session before starting D.

### PR-E — "Your team" merge (M)
- Right rail: extend `BuildLocked` (`build-locked.tsx`) → locked rows + "In your build — ready to lock" candidate rows (per-row Lock ✓ = `AccordionLockButton`; ✕ = `removeBuildPick`) + "Still needs your decision" list (urgency-ordered `openPlan` doorways) + tiles Date/Location/Locked/In-build/Budget/**Buffer** (buffer = estimated − locked − candidates; estimate from `events.estimated_budget_centavos`).

### PR-F — Plans (M)
- `build-compare.tsx`: rename section "Plans" (`TAB_META` in `lib/budget-build.ts` — label only, key stays `compare`); pinned locked rows identical per column (build on `PlanBuildSnapshot`; `applyBuildToWorking` must not touch locked rows); columns render build candidates; "Save current as a plan" button on Your team (calls `savePlanBuildNamed`). `clearBuildPicks` (currently caller-less — flagged in PR #3790) becomes the "reset candidates" action; if unused after F, delete it then.

### PR-G — Compatibility DIM+DISABLE+SINK (M · ⛔ GATED, see §2)
- Reuse `FitBadges` verdicts (`dateFit==='booked'` ∨ `reachesVenue===false`); stable pre-partition compatible-first (pattern: `category-search.ts:1099`); divider + dim + disable Add-to-build/Lock; "Ask anyway" = the thread path. Budget-over stays soft. Fail-open stance preserved.

## 4 · Verification (every PR) + definition of done
`tsc --noEmit` clean · `next lint` no new warnings · `pnpm run test:unit` (apps/web) green · add/extend unit tests beside the pure libs touched (`checklist-state`, sort partition, in-plan resolution). Runtime: preview link + `testnayan1..5@test.com`/`12345` — **NEVER the owner account** (is_internal comps everything → false-green paywalls). Done = A–F merged flag-dark, owner previews on a flipped preview env, THEN owner flips prod flag; G ships only after the §2 gate.

## 5 · Coordination + hygiene
- Booking session (`local_46eb5ee5…`, "Booking") owns the service Details/Inquiry screens + the `package_item_id→service_id` blocker — already synced via 2 session messages + log rows. Serialize any shared-file work.
- Corpus after each PR: changelog fragment (root `changelog.d/`), DECISION_LOG row on landings worth recording; update `[[project_setnayan_explore_ia_replan]]` memory status as slices land.

## 6 · Amendment (owner, same day): BUILD-CANDIDATE SCHEDULE CONVERGENCE
> Owner: "when they add someone to the build, the options on the bench change — some become
> incompatible to the schedules of the service chosen. the goal is to bring everything down to
> one choice." Confirmed NOT previously in effect; now specced + in the prototype.

**Decision #12 — compatibility has TWO tiers:**
- **SOFT (build tier, reversible):** the build's **shared-date window** = intersection of every
  locked + candidate vendor's calendar (`getCommonAvailableDays` — the exact engine behind the
  Compare availability footer and `VendorAvailabilityIntersection`). A bench vendor with no free
  day inside the window gets an **amber** "No shared date with {candidate}" badge, disabled
  Add-to-build/Lock, and sinks behind a **"Doesn't fit your build"** divider (before the red
  "Not available" one). Removing the clashing candidate restores it instantly.
- **HARD (anchor tier):** unchanged §1.2 — locked date/venue → red, "Booked on your date" /
  "Beyond reach".
- **The convergence banner** (between strip and bench + mirrored in Your team): open → hidden ·
  narrowing → "📅 Your build's shared dates: Sep 12 · Sep 26" · one left → "🎯 Only {day} works
  for everyone — lock the venue to make it official" · empty → "⚠ No single date fits — swap a
  candidate" (the shipped Compare conflict copy). Cards grow a tiny "Free: {days}" mono line.

**Build-order impact — PR-G SPLITS:**
- **PR-G1 (soft tier + banner + card date-line) — UNBLOCKED:** no reservation promise is made
  (it reasons over vendor-declared calendars, display-only), so it does NOT wait on the
  lock-reserves-date gate. Needs the availability read path healthy — fix the `/find-date` 42703
  dead pool first (same query family). Feeds off `getBatchVendorAvailableDays` (already batched
  on the bench, `page.tsx:894-926`) extended from the single event-date probe to the window set.
- **PR-G2 (hard anchor grey-out) — stays ⛔ GATED** on the 2026-07-26 lock-reserves-date owner
  decision.

## 7 · Amendment (owner, same day): THE LOCK HANDSHAKE — mostly ALREADY BUILT; one missing step
> Owner: "locking will only apply once vendor receives handshakes… when a customer locks, it is
> still not yet locked until vendor agrees. vendor sends payment request, customer receives it —
> still not locked. once customer settles the payment and sends the screenshot, vendor will be
> billed for the syncing fee alongside accepting it. when vendor accepts the payment, the
> schedule is now locked." Owner then (correctly) flagged this was "already done or partially
> done — check our documents." **Verified: substantially TRUE.** The canonical lifecycle was
> specced 2026-06-20 (DECISION_LOG:1362 — "Lock → vendor sends payment info → couple pays +
> proof → vendor accepts transaction") and most steps are code:

| Step (owner's words) | Exists? | Where |
|---|---|---|
| 1 Customer locks → not yet locked | ⚠ shipped lock is UNILATERAL (`contracted` immediately) — becomes a REQUEST state | `finalizeVendor` |
| 2 **Vendor agrees to the lock** | 🚫 **MISSING — the ONLY unbuilt step** (recorded absent: DECISION_LOG:2494 + :2681 "no vendor acknowledgement in between") | new |
| 3 Vendor sends payment request | ✅ Proposal Maker + published payment methods + payment-plan snapshot | `proposal-send.ts`, methods tables |
| 4 Customer pays + screenshot | ✅ SHIPPED FLAG-DARK — `NEXT_PUBLIC_PAYMENT_GATED_LOCK_ENABLED` (PR #3090): required screenshot, methods-validated, atomic with the lock write, ledger row "awaiting vendor confirmation" | `vendors/actions.ts:1008-1087, 2052-2122` |
| 5 Vendor accepts payment → LOCKED | ✅ SHIPPED LIVE — the vendor "Lock request" card → `vendorAcknowledgeDeposit` / `vendorRejectDeposit`; couple notified "Your date is locked in" | `vendor-dashboard/clients/[eventId]/actions.ts:105/167` |
| Schedule actually reserved | ✅ pool-acquire exists — fires at `deposit_paid`; **wire it to the acknowledge step** | `acquireSchedulePools` |

**Rulings this encodes (DECISION_LOG 2026-07-27 handshake row):**
- **RESOLVES the open 2026-07-26 "does Lock reserve the date?" decision (line 2681):** neither (a) nor (b) — Lock is a REQUEST; the reservation lands at vendor payment-acceptance (step 5). PR-G2's gate is therefore **RESOLVED**: the hard grey-out tier keys off schedule-locked bookings (acknowledged + pool-consuming), and all customer-facing lock UI must say "requested / in progress" until step 5. The card label drops "— it's final".
- **Syncing-fee trigger moves: couple-lock-time → vendor-payment-acceptance** ("billed alongside accepting"). Rate/base/sourced-only/free-5-per-event all UNCHANGED (5%→1% taper on `total_cost_php`, PR #3755 schedule). ⚠ SURFACED, not silent: this supersedes the 2026-07-24 "trigger = finalizeVendor lock" placement — 5th fee-trigger ruling in the lineage; `collectBookingFeeAtLock`'s call moves from the lock write to the acknowledge transition.
- The vendor-side accept/reject machinery for step 2 should MIRROR the shipped step-5 pattern (single-winner RPC + Overview card + notification), and the request states live in NEW columns/rows — **never repurpose `event_vendors.status`** (the code's own rule, `actions.ts:3578`).

**New slices:**
- **PR-H — the vendor-agrees step + request-state UI (M/L):** `lock_requested_at` / `lock_agreed_at` columns (or a `vendor_lock_requests` table mirroring `vendor_lock_proposals`), vendor Overview "Lock request — agree?" card BEFORE payment, customer-side "⏳ waiting for vendor" states on card/team/strip, expiry for stale requests (recommend ~7 days), Undo = cancel request. Hard-single conflict gate counts pending requests.
- **PR-I — fee + pool at acknowledge (S/M):** move `collectBookingFeeAtLock` call to `vendorAcknowledgeDeposit`'s transition; fire `acquireSchedulePools` there too (supersedes deposit_paid as the acquire point for handshake bookings); keep both flag-gated (`BOOKING_FEE_RAIL_LIVE` two-key unchanged).
- **PR-G2 — now UNBLOCKED** (gate resolved above); hard tier keys off acknowledged bookings.
- The prototype's Your-team "handshake tracker" (4-step stepper) is the reference UI.

**Also verified for the record (owner asked):** "bench filters as you add to build" was never shipped — but the *reverse* direction ALREADY EXISTS and the owner remembered it correctly: `getAvailableDaysForVendorSet` ("a saved build's picks — possibly not yet booked") powers the Compare availability footer ("No single date works — swap one"), and `candidate-dates.ts` is the "dates shrink as you lock" engine on `/date-selection`. §6's PR-G1 completes the loop (team → window → filter the bench), reusing exactly those engines.

## 8 · Plan lifecycle Q&A (owner, same day) — all four map to shipped machinery
1. **Saving = they NAME it.** "Save current as a plan" opens a name dialog (≤60 chars — the shipped
   `MAX_BUILD_TITLE_LEN` in `lib/named-builds.ts`; `savePlanBuildNamed` + `planSaveAs`
   create/overwrite already handle names + untitled fallbacks "Plan A/Build N").
2. **Loading = the Compare column's "Modify" action, promoted.** `applyBuildToWorking`
   (`build-pick-actions.ts:88`) already loads a saved plan's picks into the working build
   (clears current candidates, re-inserts the snapshot's; vendors that left the shortlist
   FK-skip). Surface it as a **Load** button on each plan row in the Plans panel — locked
   vendors are untouched (they're pinned in every plan by §2 #10).
3. **Clearing the team = `clearBuildPicks`** (`build-pick-actions.ts` — flagged caller-less in
   PR #3790; this is its job). "Clear candidates" in Your team empties the BUILD only: locked
   vendors stay (they're contracts) and in-progress handshakes stay (cancel those individually).
4. **Yes — the TEAM is the filtering basis (ruled).** The §6 shared-date window derives from
   **locked + pending-handshake + build candidates** — everything in "Your team". Load a plan →
   the bench refilters to that team's window; clear candidates → the window reopens to
   locked-only. One team, one lens.

## 9 · Add-manually (owner spotted it missing from the prototype — it's SHIPPED; keep it)
Every rail keeps its **"✎ Add manually"** card beside Find/Add-another (and in the empty state) —
the shipped `NewManualVendorModal` (two-step submit auto-creates the **claim-QR invite** the
vendor scans to sync). Rules the demo + build must honor: a manual vendor is **off-platform** →
no inquiry thread (no Check-inquiry button), **calendar unknown → NEVER greys out** (fail-open,
"syncs when they claim"), and **skips the lock handshake** (no dashboard to accept from — the
shipped payment-gated gate already exempts vendors without `marketplace_vendor_id`; they lock
directly via the Lock-Free `recordDeposit` path). Slice: part of PR-D (card variants).

## 10 · "Found-you" attribution on manual imports (owner, same day) — NEW slice PR-J
> Owner: a couple who finds a business here, contacts them outside the app, and manually imports
> them is NOT a free own-client import. **Threshold: "found" = the couple OPENED the vendor's card
> or clicked through to their website/profile.** "If they were just part of the searches and the
> card was not opened… they are still not found by the couple."

- **Found-record:** minimal per-(event, vendor_profile) row — `first_found_at` + source
  (`card_open` | `website_click`). Impressions/search results NEVER write it. ⚠ Behavioral data →
  most-protected class: couple-scoped RLS, no cross-event reuse, retention per DPO policy.
- **Manual-add match check (extends the shipped `NewManualVendorModal`):** name-match against
  marketplace vendors. If matched AND found → (a) couple sees the **link-instead nudge** ("real
  calendar · chat · handshake") with clear disclosure that the vendor is notified; (b) the vendor
  gets the **found-you lead alert**: "You were found on Setnayan on {date · time} by {couple
  display name} for their {event-type, event-date} event — added off-platform"; (c) attribution =
  **setnayan_sourced** — extends `booking_fee_attribution_for`; the fee (at handshake acceptance,
  §7) applies. If matched but NEVER found → genuine own-client import: **free**, **no
  notification** (the existing "unknown ⇒ import ⇒ free" fail-safe stands).
- **Privacy (standing default: document-not-block, disclose-then-enable):** notification payload
  is data-minimal (couple display name + event type + event date — no contact details); the
  couple-side modal discloses the notification BEFORE they proceed; flag the notification content
  + found-record retention for DPO review on `/admin/data-privacy`. Aligns with the 2026-07-22
  leakage strategy (dissolve with self-interest — the lead alert makes routing through Setnayan
  the vendor's own preference) and the chat off-platform-contact filter (#3606).
- Prototype: the manual-add match modal + both toasts are the reference copy.
- **Timing (owner clarification):** yes — for as long as the card was never opened and the website
  never clicked, the vendor is NOT found: import free, no notification, indefinitely. The
  found-record stamps on the FIRST open/click (per event). Attribution is judged **at import
  time** — `first_found_at` must PRECEDE the manual add; a later card-open never retroactively
  converts an already-free import (they demonstrably knew the vendor before finding them here).
- **What IS and ISN'T recorded (owner: "this means we record their searches and views?"):**
  Recorded: **ONE row per (event × vendor)** — the FIRST card-open or website click-through,
  timestamp + source. That's the entire record: no search queries, no impressions, no view
  counts, no repeat-view trail, no dwell time, no browsing history. It is the receipt that makes
  the found rule enforceable, nothing more. NOT recorded: searches (never), rail impressions
  (never), subsequent views (no-op — the row already exists). Backing out of the match modal
  ("Cancel — don't add, don't notify") imports nothing and notifies no one; the found-record
  itself stays private to the couple unless/until they import that vendor manually. Retention:
  recommend auto-purge at event completion + the standard export/delete rights; DPO review
  covers payload + retention. Alternative if the owner prefers ZERO view-recording: judge
  "found" by thread-existence only (inquired = found) — weaker (card-viewed-but-never-inquired
  imports leak free) but recording-free; owner's call at DPO review.
- **AMENDED (owner): record a VIEW COUNTER, not just the first open.** The found-record becomes
  ONE row per (event × vendor): `view_count` (card opens + website click-throughs, incremented
  until the vendor is added to the event — locked, imported, or shortlisted; frozen after) +
  `first_found_at` + `last_viewed_at` + sources. Still NOT a browsing trail: no per-view event
  log, no dwell time, no searches, no impressions. **Purpose = import adjudication:** a "free
  import" attempt of a vendor with view history is identified on the spot — the couple-side
  match modal and the vendor lead alert both cite the receipts ("viewed your card and website
  5 times between {first} and {last}"), and the same row is the evidence if a vendor disputes
  fee attribution. Zero-view match → still a clean free import. DPO review now covers the
  counter's retention alongside the payload.
- **Dispute ladder (owner):** vendors CAN dispute a found-you / syncing-fee attribution.
  **First dispute (per vendor, lifetime): AUTO-ACCEPTED** — fee waived instantly, no admin
  touch — paired with the positioning reminder: *"This one's on us. A note though: this couple
  found you on Setnayan — they viewed your card and website {N} times before booking. That's
  the power and reach of a Setnayan presence: couples find you easier and faster here. Future
  disputes are reviewed by our team."* **Second and later disputes: ADMIN REVIEW** (reuse the
  shipped disputes rails — the admin console disputes queue + the event `disputes` route);
  admin sees the view-count receipts row as evidence; verdicts upheld/rejected. State:
  `attribution_disputes` (vendor_profile_id, booking ref, status auto_accepted → under_review →
  upheld/rejected, created_at); the auto-accept check is a simple per-vendor count. Part of
  PR-J.
- **CLAIM-SYNC is the AUTHORITATIVE attribution checkpoint (owner).** Two outcomes when the
  claim QR is scanned:
  1. **Vendor has NO Setnayan account → sync is FREE, always.** They onboard through the claim
     (acquisition funnel) — genuinely the couple's own vendor brought INTO the app; the
     "unknown ⇒ import ⇒ free" fail-safe made flesh.
  2. **Vendor claims with an ACTIVE EXISTING account whose profile the couple had already
     viewed** (found-record: `view_count > 0`, `first_found_at` before the manual add — the §10
     timing guard applies unchanged) → **they have been found**: attribution flips to
     setnayan_sourced at claim time, the lead alert + receipts fire, the syncing fee applies at
     handshake acceptance, and the dispute ladder is available.
  This makes the add-time NAME match the early *nudge* (best-effort) and the claim-time ACCOUNT
  match the *authoritative* check — a couple renaming "Casa Amara" to "CA Catering" to dodge the
  nudge changes nothing: the moment the real account claims, identity is exact and the
  found-record is consulted. No found-record on the claiming account → the sync stays free.

## 11 · The ⓘ pattern — documentation contract (owner: "make sure (i) is well documented")
The replan leans on ⓘ toggles to keep surfaces clean ("We want this out, but Explore can be kept
with an (i) to hide the other information"). Rules for the build:
1. **Page-level ⓘ** beside the Explore title replaces ALL explanatory chrome. Its panel must
   cover: what this page does (browse folders → categories → vendor carousels) · the state-glyph
   legend (○ not started · ◔ exploring · ◕ in build/pending · ● locked · ✓ covered · – skipped) ·
   the 4-step lock handshake in one line · what the Coverage Strip and convergence banner mean.
2. **Per-category ⓘ** → the plan-group `hint` (bridge per §5.1); tile-level overrides are
   authored in the Taxonomy Studio, which becomes the single editing home for that copy.
3. **Every ⓘ copy string lives in ONE module** (`lib/explore-info-copy.ts`), not scattered in
   JSX — so copy edits are one-file PRs and the corpus can mirror it. The module header links
   back to this spec section.
4. **Corpus mirror:** the shipped ⓘ texts get a dated reference doc in
   `Design_Explore_Replan_2026-07-27/` on first landing (and on any copy change), so the
   documented copy and the live copy can't silently diverge.
5. Accessibility: each ⓘ is a real button (aria-label, focus ring); the panel is dismissible;
   state is not persisted (always starts closed — it's help, not a setting).

## 11a · ⛔ Content-gate + blank-name rules (contract §7a/§7b — binding on ALL slices)
1. **A blank name NEVER blocks a save — auto-name it** (owner: "saving builds blank will make
   us autocreate a name for the build"). Applies to the couple's saved **plan/build** name
   (slice F) and the **manual-vendor name** (slice D): reuse the shipped `autoBuildTitle`
   (`lib/named-builds.ts`) / an equivalent group+position namer, show the auto-name as the
   field PLACEHOLDER before save, and confirm after ("we named it {X} — tap to change").
   No required-field errors, no disabled Save.
2. **NEVER call the #3606 contact detector RAW on non-chat text.** Measured by the Booking
   session's 27-agent review (7 findings confirmed by executing the shipped `evaluateMessage`):
   the chat rules refuse honest text — a date range reads as a phone number, "Coverage
   @Tagaytay" as an @handle, "Instagram teaser reel" as an app name, and "Message me on
   Setnayan…" as off-platform solicitation. The detector must be called through a **PROFILE**
   (`chat` = today's rules; `card` = Booking is specifying it) in ONE module — never a second
   detector, never a fork.
   - **This wave's verdict:** plan names + manual-vendor names are **couple-private text →
     NO content gate** (trim + length cap only). The found-you notification payload is
     system-authored → no gate, but it must NOT interpolate raw vendor/plan free-text.
     Anything that later renders couple-authored text TO A VENDOR must wait for the profile.
3. Do not flip `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` while the Booking session's publish-gate
   blockers stand (package editor discards `res.problems`; publish/activate never re-runs the
   gate) — ours is a separate flag but the surfaces meet.
## 12 · Integration seams (Booking × Explore) — code-verified 2026-07-27

> Every claim below was re-read against `origin/main` on 2026-07-27. Where the Integration Contract (`Integration_Contract_Booking_x_Explore_2026-07-27.md`) is wrong about shipped code, the ⚠ line says so — **fix the contract in the same commit as the slice, and log the DECISION_LOG row first** (contract §6/§7 self-rule).
>
> **⚠ Branch from `origin/main` @ `2ce0f7cb2` (#3794).** The local checkout at `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` is on `claude/retire-pilot-mode-dead-pricing` @ `1a12bab00` and is stale on **every** file §12.2 touches.

### Fail-safe invariants — verbatim, non-negotiable, all four seams

1. **Any resolution error or unknown state bills NOTHING** (fail-safe to import / free). A vendor must never be charged by a bug.
2. **Covered rows carry no money, no fee, no request state.** The RPC refusal `covered_row_no_fee` is the **backstop, not the design** — resolve the anchor before calling.
3. **The button contract (what it's called, when it renders, what it opens) never changes with Booking's flag — only the sheet's content does.**
4. **A blank never blocks — auto-name it** (§7a). Nothing in this wave may refuse a save on empty text.

---

### 12.1 · Inquiry-button seam — **OWNER: slice D (Explore)**

⚠ **Contract §2 says** the stateful Inquire button is "resolved by the shipped `InquiryComposer` existing-thread guard — that guard is the SINGLE source of truth." **Code says** `apps/web/app/v/[slug]/_components/inquiry-composer.tsx` contains **no guard at all** — it is a pure prop consumer (`existingThreadId`/`existingThreadHref`, :126/:131, branch at :546). The real guard lives in the server component at `apps/web/app/v/[slug]/page.tsx:1108-1123` and is scoped to `coupleEventId = events[0]` (:1106) — the couple's **primary** event, which the event-scoped bench cannot reuse as-is. There are four divergent "does a thread exist" implementations in the repo today.

⚠ **Contract §2 line 28 ("Manual-added vendors with no thread keep 'Inquire' even on the bench") is WRONG** — `contactShortlistVendor` returns `{status:'not_marketplace'}` for a null `marketplace_vendor_id` (`_actions/contact-shortlist-vendor.ts:61-64`) and the client renders the dead end "This vendor can't be messaged here." (`_components/contact-shortlist-vendor-button.tsx:44-46`). Delete that line.

**Build it exactly like this.**

1. **Do NOT mount `InquiryComposer` on a bench card.** It needs `vendorProfileId` + `initialServiceId` + `linked` + `alsoOptions` + `requirementsFields` + `savedRequirements` + `aiActive` + `inquiryPax` — none of which the bench loads. Contract §1 also forbids a second composer.
2. **Reuse the shipped primitive:** `ContactShortlistVendorButton` — `apps/web/app/dashboard/[eventId]/vendors/_components/contact-shortlist-vendor-button.tsx:20-74`, props `{ eventId: string; vendorId: string }`. `vendorId` **is** `ShortlistVendor.vendorId` (= `event_vendors.vendor_id`). Server: `contactShortlistVendor({eventId, vendorId})` (`_actions/contact-shortlist-vendor.ts:33-104`) → `startServiceInquiry(..., inquirySource:'shortlist')`. Result union: `'ok'{threadId,eventId,isExisting} | 'not_signed_in' | 'not_secured' | 'no_event' | 'not_marketplace' | 'error'`. It is currently rendered from exactly one place — the legacy kill-switch surface `plan-budget-accordion.tsx:1717` — so slice D is a **port**, not new code.
3. **One column, zero new queries.** Extend the existing batched select at `apps/web/app/dashboard/[eventId]/vendors/page.tsx:304` to `'thread_id, vendor_profile_id, inquiry_status, created_at'` and build `threadIdByProfile` in the same loop as `inquiryByProfile` (:339-352). **No per-card `.maybeSingle()` probe** — a rail holds dozens of cards.
4. **Thread it through the pipe that already exists:** add `thread_id?: string | null` to `VendorEnrichment` (`apps/web/lib/vendors-plan-budget.ts:244-276`) → populate at `page.tsx:464-481` beside the existing `inquiry_status` (:479) → read as `ext` in `buildShortlistFolders` (`apps/web/lib/shortlist-taxonomy.ts:313`) → project onto `ShortlistVendor` (:152-191 / :335-366):
   ```ts
   marketplaceVendorId: string | null;   // = v.marketplace_vendor_id ?? null  (wedding-plan-groups.ts:956, set at page.tsx:522)
   threadId: string | null;              // = ext?.thread_id ?? null
   inquiryStatus: 'pending' | 'accepted' | 'declined' | null;
   ```
5. **THE canonical predicate** — export from `lib/shortlist-taxonomy.ts`, and **refactor `/v/[slug]/page.tsx:1120` to call it** so the two surfaces are provably identical:
   ```ts
   export function hasLiveInquiry(v: Pick<ShortlistVendor,'threadId'|'inquiryStatus'>): boolean {
     return v.threadId != null && v.inquiryStatus !== 'declined';
   }
   ```
   ⚠ The bench's existing map at `page.tsx:302-306` does **not** exclude `declined`; `/v/[slug]` does. Ship the predicate or the same vendor reads "💬 Check inquiry" on the bench and "Inquire" on their profile.
6. **Card render rule** (`shortlist-categories.tsx:259-305`, today a bare `<InspectorTrigger inspectId={\`v:${v.vendorId}\`} href={v.href}>` at :260):
   - `marketplaceVendorId != null && !hasLiveInquiry(v)` → **"Inquire"** → `<ContactShortlistVendorButton eventId vendorId={v.vendorId} />`
   - `marketplaceVendorId != null && hasLiveInquiry(v)` → **"💬 Check inquiry"** → `<Link href={\`/dashboard/${eventId}/messages/${v.threadId}\`} prefetch={false}>`. No server call, no transition. If `threadId` is null while `inquiryStatus` is set, **fall back to "Inquire"** — never link to the bare `/messages` list.
   - `marketplaceVendorId == null` → **no inquiry button.** Fall through to `v.href` (the workspace, where the couple's own `contact_email`/`contact_phone` already render — `workspace/page.tsx:1018-1024`).
   - **Gate on `marketplaceVendorId != null`, never on a manual/source heuristic** — `NewManualVendorModal`'s LINKED mode writes a real `marketplace_vendor_id` (`new-manual-vendor-modal.tsx:385-395`), so a linked manual add IS bookable.
7. **Lock leg on the same card:** resolve `groupId = planGroupForCategory(categoryForTile(tile))` (`wedding-plan-groups.ts:712-719` + `shortlist-taxonomy.ts:147`). It returns `null` for unbucketable categories — **hide Lock, never pass null** into `AccordionLockButton` (`accordion-lock.tsx:135-151`) or `setBuildPick({eventId, planGroupId, vendorId})` (`build-pick-actions.ts:28-32`). That is the #3466 class of bug.
8. **Flag:** `apps/web/lib/explore-replan-flag.ts` + `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` **do not exist** — Explore creates them, mirroring `lib/payment-gated-lock.ts`. Flag OFF ⇒ the card renders byte-identically to today.
9. **Do not touch** `inquiry-composer.tsx` or `inquiry-actions.ts` (Booking owns them) beyond the one-line predicate refactor in step 5 — ping Booking first.
10. **Test:** unit test asserting `declined` ⇒ false, `pending`/`accepted` ⇒ true. Manual pass on `testnayan1..5@test.com` / `12345` — **never the owner account** (internal grants every SKU). Verify degradation: Explore-flag ON + Booking-flag OFF ⇒ Inquire lands on the thread exactly as `plan-budget-accordion.tsx:1717` does today.

**Booking-side promises this relies on:** `startServiceInquiry` keeps its upsert `onConflict:'event_id,vendor_profile_id'` (`inquiry-actions.ts:276` — the real dedupe, backed by `UNIQUE(event_id, vendor_profile_id)` on `chat_threads`, migration `20260513130000:58`); the composer's existing-thread branch stays prop-driven; any change to declined/archived semantics updates `hasLiveInquiry` in ONE place plus a ping.

---

### 12.2 · Lock / fee / pool seam — **OWNER: PR-I (Explore)** — the one real hazard

⚠ **Contract §4 says** the fee call sits behind a "two-key `BOOKING_FEE_RAIL_LIVE` gate." **Code says** `collectBookingFeeAtLock` gates on `isBookingFeeEnabled()` **alone** — `apps/web/lib/booking-fee-lock.server.ts:55-57`, with the comment "the manual QR rail is always live, so — unlike the PayMongo send-gate — it needs no RAIL_LIVE." `isBookingFeeEnforced()` gates the dormant proposal-send path only. **Do not add a second key.** One flag flip mints real vendor-payer `orders` + `payments` rows (`booking-fee-lock.server.ts:129-160`).

⚠ **Contract §4 cites "BUILD_SPEC §4"** for the one-anchor-N-covered model. Correct citation: **`Vendor_Package_Credit_BUILD_SPEC_2026-07-26.md § 0`** (which is what the migration headers themselves cite).

⚠ **Contract §4 says** "If an acknowledge path ever holds a covered row…" — it **does, today**. `fetchLockRequests` (`apps/web/lib/vendor-overview.ts:469-499`) queries with the **service-role** client, filtered only on `marketplace_vendor_id` + `deposit_recorded_at NOT NULL` + `deposit_acknowledged_at NULL` — **no `package_role` filter, no `archived_at` filter** — and `LockBody` posts that raw id into `vendorAcknowledgeDeposit` (`overview-sections.tsx:631`). `package_role` is read **nowhere** in `apps/web` outside `lockPackage` itself.

**Facts to build against.**
- Discriminator: `event_vendors.package_role TEXT` ∈ `NULL | 'anchor' | 'covered'` (`supabase/migrations/20271009160000_package_anchor_role_and_cascade_indexes.sql:49-60`). Anchor uniqueness: `event_vendors_one_anchor_per_booking_uniq` (:70-72) — makes a single-row anchor lookup safe. Role/price immutability is trigger-enforced (:179-237).
- The no-money CHECK (`:64-67`) constrains **only** `total_cost_php` and `deposit_paid_php` — **not** `deposit_recorded_at` / `deposit_acknowledged_at`. Nothing at the DB layer stops a covered row entering the lock-request state.
- `booking_fee_open_lock_charge`'s covered refusal: `20271009180000_booking_fee_refuses_covered_rows.sql:62-65` → `{'skipped':'covered_row_no_fee'}`. Asserted at `apps/web/tests/db/first-user-journey.db.test.ts:293-302`.
- **Attribution freezes on first ledger insert** — the upsert's `ON CONFLICT (vendor_profile_id, event_id) DO UPDATE` never rewrites `attribution` (`20271009180000:83-89`). Ordering is load-bearing.
- `event_vendor_packages` RLS is **couple-only** (`20260604110000_vendor_packages.sql:280-292`) — a vendor session cannot read it. All resolution runs on the service-role client.

**Build it exactly like this.**

1. **New helper**, in `apps/web/lib/booking-fee-lock.server.ts` beside the collector:
   ```ts
   /** Anchor for a covered row; the row itself for anchor/ordinary; NULL = BILL NOTHING. */
   export async function resolveFeeAnchorRowId(admin: SupabaseClient, eventVendorId: string): Promise<string|null> {
     const { data: row } = await admin.from('event_vendors')
       .select('vendor_id, package_role, event_vendor_package_id').eq('vendor_id', eventVendorId).maybeSingle();
     if (!row) return null;                                   // row vanished → bill nothing
     if (row.package_role !== 'covered') return row.vendor_id; // NULL (ordinary) or 'anchor' → it IS the money row
     if (!row.event_vendor_package_id) return null;            // orphaned (FK is ON DELETE SET NULL) → bill nothing
     const { data: anchor } = await admin.from('event_vendors').select('vendor_id')
       .eq('event_vendor_package_id', row.event_vendor_package_id)
       .eq('package_role', 'anchor').is('archived_at', null).maybeSingle();
     return anchor?.vendor_id ?? null;                         // anchor gone → bill nothing
   }
   ```
   **Never** fall back to the covered row's own id. Skipping the fee is correct; billing the wrong row is not. Do **not** resolve via `event_vendor_packages.primary_event_vendor_id` — it is `ON DELETE SET NULL` (`20260604110000:241-242`) and couple-RLS'd. Second query is index-served by `event_vendors_package_idx` (:305-307).
2. **Call site:** inside the existing `if (!error && env.status === 'ok')` branch of `vendorAcknowledgeDeposit` — `apps/web/app/vendor-dashboard/clients/[eventId]/actions.ts:122-150`. That is the single-winner edge (`acknowledge_vendor_deposit` returns `status:'already'` on re-call, `20270320429117:100-117`), so idempotency is free. Use `createAdminClient()` (already imported, :6) — the RPC is GRANTed to `service_role` only (`20271009180000:182-183`). Wrap in try/catch + `console.error`; the acknowledge already committed and must never roll back or throw before the `redirect` at :154.
3. **⛔ HARD BLOCKER — ship a migration or the pool acquire is a guaranteed silent no-op.** `public.acquire_schedule_pools` opens with `IF p_event_id NOT IN (SELECT public.current_couple_event_ids()) THEN RETURN 'not_authorized'` (`20270403356945_vendor_calendar_day_states_6_state_taxonomy.sql:214-216`). The caller here is the **vendor**; service-role has no `auth.uid()` either — both resolve to the empty set, and both existing callers swallow `not_authorized` as degrade-open (`vendors/actions.ts:323-325`, `:3778-3780`). `CREATE OR REPLACE` the function in full, widening the refusal to `AND p_event_vendor_id NOT IN (SELECT public.current_vendor_event_vendor_ids()) AND NOT public.is_admin()`, re-issue `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated` (:318-319), then **verify the function body in prod** after dispatching `supabase-migrations.yml` (schema_migrations lies).
4. **Do NOT delete the existing acquires** — `updateVendorStatus` (`vendors/actions.ts:277-327`, acquire at :301) and `recordDeposit` (`:3744-3782`, acquire at :3753). ⚠ The BUILD_SPEC §7 table's "pool-acquire fires at deposit_paid" is **incomplete**: `recordDeposit` already acquires one step *before* acknowledge.
5. **Prevent the double-consume.** Occupancy counts every `pb.event_vendor_id <> p_event_vendor_id` (`20270403356945:288-292`), so an anchor-scoped acquire + an earlier covered-row acquire = **two live `vendor_schedule_pool_bookings` for one package** → the vendor's daily capacity is eaten twice and a real second couple gets "fully booked". Fix: **route ALL pool acquires through `resolveFeeAnchorRowId`** (change `recordDeposit:3753` and `updateVendorStatus:301` to acquire on the resolved anchor id). Re-acquiring the *same* row id is idempotent (`ON CONFLICT (pool_id, event_vendor_id) WHERE released_at IS NULL DO NOTHING`, :305-311).
6. **Resolve pool ids from the ANCHOR row:** `resolvePoolIdsForService(admin, anchor.marketplace_vendor_id, anchor.service_id)` when `service_id` is set, else `resolvePoolIdsForCategory(admin, anchor.marketplace_vendor_id, anchor.category)` (`lib/schedule-pools.ts:142-151`). Package cascade rows carry a `category` and **no** `service_id`, so the category branch is the one that fires.
7. **Close the `not_contracted` money leak.** `recordDeposit` has **no** status precondition (`vendors/actions.ts:3652-3807`), and the RPC skips any row not in `('contracted','deposit_paid','delivered','complete')` (`20271009180000:70-72`). A deposit recorded on a `considering` row ⇒ acknowledge ⇒ fee silently skipped ⇒ **that booking is free forever** (the ordinal is computed once and never recovers). Either add a status precondition to the acknowledge wrapper, or `console.error` loudly on `{status:'skipped', reason:'not_contracted'}`. Today's call site cannot hit this (`finalizeVendor:2184` fires one line after writing `contracted`).
8. **Fix the row-picker or the slice is dead on the clients page.** `apps/web/app/vendor-dashboard/clients/[eventId]/page.tsx:455-460` uses `.maybeSingle()` on `.eq('event_id').eq('marketplace_vendor_id')` — a package is N>1 such rows ⇒ error ⇒ `eventVendorId` null (:528) ⇒ the acknowledge form at :2101-2103 **never renders**. Prefer `package_role IS NULL OR 'anchor'`, `.is('archived_at', null)`, `.limit(1)`. Same latent pattern at `clients/[eventId]/actions.ts:54-59`, `:500-506`, `:640-646` — fix the acknowledge path, spawn the rest.
9. **Filter the lock-request feed:** add `.neq('package_role','covered')` (or `.or('package_role.is.null,package_role.eq.anchor')`) **and** `.is('archived_at', null)` to `fetchLockRequests` (`lib/vendor-overview.ts:473-481`).
10. **Stop covered rows entering the state at source:** resolve to the anchor inside `recordDeposit` (read `:3706-3713`, write `:3788-3798`) and suppress `<DepositReservation>` on the couple workspace for covered rows (`workspace/page.tsx:1245-1252`). Consider extending the CHECK at `20271009160000:64-67` with `deposit_recorded_at IS NULL AND deposit_acknowledged_at IS NULL` in the same migration as step 3.
11. **Tests** (extend `apps/web/tests/db/first-user-journey.db.test.ts`): (i) acknowledge on a covered row ⇒ fee lands on the **anchor**, `count(*)` of `booking_fee_charges` for the booking is still exactly **1**; (ii) acquire-then-acknowledge on one package ⇒ exactly **one** live `vendor_schedule_pool_bookings`; (iii) `acquire_schedule_pools` called as the booked vendor returns `'ok'`, not `not_authorized` — **this test fails on `origin/main` today and is the proof step 3 is required.**

---

### 12.3 · FOUND-YOU × fee attribution — **OWNER: PR-J (Explore)**

⚠ **Contract §5 says** attribution "is read AT acknowledge time" and the resolver merely consumes found-state. **True as far as it goes — but there is NO fee call at claim time anywhere in the repo.** `applyClaimAutoLink` (`apps/web/lib/vendor-invite-actions.ts:281-458`) writes `marketplace_vendor_id` (:329-332, cascade :350-355) and never calls `collectBookingFeeAtLock`. A manual vendor's first lock returned `skipped:'not_verified_vendor'` (`20271009180000:67-69`), so **no ledger and no charge row exist**, and the only automatic re-entry — trigger `event_vendors_booking_fee_rederive` (`20270930120000:412-417`) — requires a pre-existing primary charge. **Without an explicit fee call at claim, PR-J ships and bills ₱0 forever.**

**Facts.** Resolver: `public.booking_fee_attribution_for(p_vendor_profile_id UUID, p_event_id UUID) RETURNS TEXT` — `supabase/migrations/20271009140000_booking_fee_sourced_only_at_lock.sql:65-84`, `service_role` only (:265-269). Sourced surfaces: `booking_fee_is_sourced_surface` (:42-53). Fail-safe tail, verbatim: `) THEN 'sourced'` / `ELSE 'import'` / `END;` (:81-83), post-condition-asserted at :291-295. **Zero TypeScript call sites** — the only live path is `collectBookingFeeAtLock` → `.rpc('booking_fee_open_lock_charge')` (`booking-fee-lock.server.ts:59`), called from `vendors/actions.ts:2156`, `vendors/packages/actions.ts:396`, `lib/chat-lock-booking.server.ts:121`.

**Build it exactly like this.**

1. **Extend the SAME function, keep the SAME 2-arg signature.** A third parameter forces each caller to compute found-state — which is exactly the re-derivation §5 forbids.
   ```sql
   SELECT CASE
     WHEN EXISTS (SELECT 1 FROM public.chat_threads t
                  WHERE t.event_id = p_event_id AND t.vendor_profile_id = p_vendor_profile_id
                    AND public.booking_fee_is_sourced_surface(t.inquiry_source))
       THEN 'sourced'                                    -- UNCHANGED, still FIRST
     WHEN EXISTS (SELECT 1 FROM public.vendor_found_records f
                  WHERE f.event_id = p_event_id AND f.vendor_profile_id = p_vendor_profile_id
                    AND f.adjudicated_attribution = 'sourced')
       THEN 'sourced'                                    -- NEW, strict fallback
     ELSE 'import'                                       -- UNCHANGED fail-safe
   END;
   ```
   Both arms are `EXISTS(...)` (false on absence, missing row, NULL) and the `ELSE` is untouched, so **"any resolution error or unknown state bills NOTHING"** survives structurally, not by care. The found branch may only ever **widen** to sourced; it can never turn a sourced thread into an import.
2. **The judgment lives in the WRITE path, not the resolver.** All §10 logic (`view_count > 0`, `first_found_at` precedes the manual add, claim-time identity match) runs at write time and is frozen into `adjudicated_attribution` + `adjudicated_at`. Never let the resolver evaluate live counts — a retention purge, a backfill, or a post-import card-open would flip a settled free import into a billable one at the next lock.
3. **New table PR-J owns**, RLS at `CREATE TABLE`, `REVOKE ALL … FROM PUBLIC, anon, authenticated` (copy `20271009140000:262-269`), **no** INSERT/UPDATE policy for `authenticated` (copy `20270323312048:86-90`), writes service-role only. A forgeable found-record is a forgeable **invoice**.
   `public.vendor_found_records(found_id UUID PK, event_id UUID NOT NULL REFERENCES events, vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles, view_count INT NOT NULL DEFAULT 0, first_found_at TIMESTAMPTZ NOT NULL, last_viewed_at TIMESTAMPTZ, found_sources TEXT[] CHECK (found_sources <@ ARRAY['card_open','website_click']), adjudicated_attribution TEXT CHECK (adjudicated_attribution IN ('sourced')), adjudicated_at TIMESTAMPTZ, frozen_at TIMESTAMPTZ, UNIQUE(event_id, vendor_profile_id))`
4. **Claim-sync order is load-bearing** — in `applyClaimAutoLink` (`vendor-invite-actions.ts:281`), between the id write (:329-355) and the thread upsert (:423-431): **(1)** link → **(2)** adjudicate the found-record for (`parent.event_id`, `args.claimedVendorProfileId`) → **(3)** *then* `collectBookingFeeAtLock`. Reversing (2) and (3) freezes `import` permanently (`20271009180000:83-89`, UNIQUE per (vendor,event) at `20270916909942:56`). No found-record ⇒ write nothing ⇒ second arm false ⇒ import ⇒ **free**, with zero new code.
5. **Add the missing fee call at claim** (step 4.3). Gate on `event_vendors.marketplace_vendor_id IS NOT NULL` and on the row not being `package_role='covered'`.
6. **⛔ Do NOT use `vendor_profile_views` as the resolver's input.** It exists (`20270323312048_vendor_profile_views_funnel.sql:34-55`, written by `lib/record-vendor-view.ts:45-107` from `/v/[slug]` at `page.tsx:1512-1534`) but its `event_id` is `events[0]` — the user's **first** event, not the event in context (:1106, :1526). Write found-records from the Explore route's own `[eventId]` segment, and **refuse to write when no unambiguous event is in scope.** Ship a DB test: a found-record on event A must never make event B `sourced`.
7. **Suppress self-inflicted records:** skip when the viewer owns the vendor (`current_vendor_profile_ids()`) or the event is internal — precedents at `lib/inquiry-attribution.ts` ("guard 1") and the demo-vendor skip at `v/[slug]/page.tsx:1512`.
8. **Own flag, default off, independent of `NEXT_PUBLIC_BOOKING_FEE_ENABLED`** — so found-records can be written and verdicts observed before a single peso can move.
9. **Do not touch the ledger upsert's ON CONFLICT** to "refresh" attribution. Re-adjudication belongs in the dispute ladder, acting on the **ledger** after the fact (§5).
10. **Tests** beside `apps/web/tests/db/booking-fee-lock.db.test.ts:305-347`: (a) `first_found_at` at/after `event_vendors.created_at` ⇒ NOT sourced; (b) found-record on a different event ⇒ no bill; (c) table empty ⇒ still `import`; (d) a couple-forged INSERT is denied to `authenticated`.
11. **⚠ Known hole to design around:** `applyClaimAutoLink` upserts a `chat_threads` row with **no** `inquiry_source` (:423-431), and `startServiceInquiry` only stamps `if (!isExisting)` (`inquiry-actions.ts:302`). A couple who claims a manual vendor and *later* discovers them via Explore stays `import` forever. It fails **safe** (under-bills) — do not "fix" it by loosening the stamp guard; just never assume thread-existence implies un-stamped.
12. **Correct BUILD_SPEC §10's privacy paragraph before DPO review** — it claims "no per-view event log", but `vendor_profile_views` logs one row per `/v/[slug]` view today.

---

### 12.4 · Publish-integrity / contact-detector seam — **OWNER: slice C (and D / F / PR-J: explicit no-op)**

⚠ **The pointer "§4 line about no-blanks" is WRONG** — the rule is **§7** (lines 89-95, amended by **§7a** and **§7b**); §4 is the lock/fee seam and says nothing about text.
⚠ **§7's original line "Booking enforces it in the service/package save actions" describes code that does not exist.** `apps/web/app/vendor-dashboard/services/actions.ts` has only length/blank-row validation (`:169`, `:205`, `:215`, `:249`) — no `evaluateMessage` import anywhere under `vendor-dashboard/services/`. It is a **to-BUILD obligation on Booking**, not prod. Reword to future tense.
⚠ **§7b already retires the raw-detector rule** — this audit independently confirms it: `containsPhone` (`lib/chat-contact-filter.ts:106-132`) blocks exactly what the manual-add form's **required** `contact_number` field is for (`new-manual-vendor-modal.tsx:509-520`).

**Verdict for this wave: the Explore slices carry ZERO detector obligation.** Every new write is enum-valued or couple-private:

| Slice | New text? | Verdict |
|---|---|---|
| **C** — plan chips / "Not needed? Remove" | none — `tile` from the closed `WeddingTile` union (`lib/taxonomy.ts:143`), `decision` a CHECK enum (`20270110320013:5`) | detector **does not apply** |
| **F** — plan names | `budget_builds.title`, couple-authored and **couple-private on all four verbs** (`20260929000000_budget_builds_rls_couple_only.sql:17-54`); no vendor/export/API reader | detector **does not apply** — gating it would false-block the couple's own notes |
| **D** — manual-vendor name | SHIPPED, couple-authored, not new (`new-manual-vendor-modal.tsx:454-471` → `vendors/actions.ts:2520` → `event_vendors.vendor_name:2759`) | seam wording ("new **vendor-authored** field") **does not bind** |
| **J** — found-you payload | Setnayan-authored template + `couple_display_name` (already on 4 vendor surfaces) + event type + date | detector **does not apply** |

**Instructions.**

1. **Do NOT add any `evaluateMessage()` call in PR-C, PR-D, PR-F or PR-J.**
2. **PR-C:** keep the chips driven by the closed `WeddingTile` union — **never** add an "Other / type your own category" free-text input. That single addition is the first thing in this wave that could trip the seam.
3. **PR-F:** leave plan names at `normalizeBuildTitle()` + `MAX_BUILD_TITLE_LEN = 60` (`lib/named-builds.ts:14/:36-42`). Per §7a, a blank **auto-names** (`Item N` / `Choice N` / …) shown as the placeholder before saving — it never refuses.
4. **PR-D:** reuse `NewManualVendorModal` untouched. Do not gate its fields — `contact_number` and `contact_person` are required by design.
5. **PR-J:** keep the payload to §10's fixed set. No free-text note, couple message, or vendor-composed field in the alert or the dispute record.
6. **If any Explore field ever DOES need the gate**, call it through a **profile** (§7b), never raw, and add the profile beside `card` in **one** module — never a second detector. Precedent for unconditional wiring (published/served text): `lib/vendor-voice-profile.ts:106`. Precedent for flag-gated wiring (human chat): `lib/chat-send.ts:236-269`.
7. **Hygiene, in PR-A/PR-C's path anyway:** `supabase/migrations/20270110320013_event_category_decisions.sql` shipped with **no** `REVOKE ALL … FROM anon, authenticated` — it relies on RLS alone. Add `REVOKE ALL ON public.event_category_decisions FROM anon, authenticated;` when altering the table (§6, default-ACL trap).
8. **Tripwire (not a defect today):** couple-typed `business_name` already reaches a stranger vendor's screen with only `maxLength=128` (`vendor/claim/[token]/page.tsx:124`, `:331`). If a future PR adds a couple-authored **note** to the manual-add card, or surfaces plan names in a proposal/inquiry/export, that PR owns wiring the right profile and logs a DECISION_LOG row first.

---

### 12.5 · Cross-session obligations (Explore → Booking)

| When | Ping / notify Booking about |
|---|---|
| **Before slice D opens a branch** | Card/inquiry entry point (contract §6 ping protocol) — and specifically the one-line refactor of `apps/web/app/v/[slug]/page.tsx:1120` to call the exported `hasLiveInquiry`. Booking owns that file. |
| **With slice D's PR** | The contract corrections in §12.1: §2's "InquiryComposer guard is the single source of truth" → `hasLiveInquiry` in `lib/shortlist-taxonomy.ts`; delete §2 line 28 (manual vendors do **not** keep "Inquire"). Booking must not re-add either claim. |
| **With slice D's PR** | Confirmation that the button contract is flag-stable: Explore-ON + Booking-OFF opens today's shipped composer; Booking-ON opens the extended sheet; name/visibility/target unchanged. Booking must not change the meaning of `existingThreadId` / `existingThreadHref` when its flag lands. |
| **Before PR-I merges** | The §4 corrections: single-key `NEXT_PUBLIC_BOOKING_FEE_ENABLED` (not two-key), citation → `Vendor_Package_Credit_BUILD_SPEC_2026-07-26.md § 0`, and the **new fourth bullet** recording the `acquire_schedule_pools` couple-only auth blocker. Both sessions need that fact. |
| **Before PR-I merges** | PR-I touches `lockPackage`-adjacent money machinery only at the **call site**; it also ships a `CREATE OR REPLACE` of `acquire_schedule_pools` and (optionally) an extended `event_vendors_covered_rows_carry_no_money` CHECK. Booking must know a migration lands on shared package tables — whoever merges second **rebases**, never hand-picks a stale-tree merge (#3668). |
| **After PR-H lands** | Booking adopts request-state wording in `LockPackageModal` / `chat-lock` (contract §1). |
| **Before PR-J's resolver migration** | Booking's fee attribution **consumes** found-state and never re-derives it — the resolver keeps its 2-arg signature and its `ELSE 'import'` tail. Notify that a second `EXISTS` arm lands and that PR-J adds the previously-missing fee call inside `applyClaimAutoLink`. |
| **Whenever "existing thread" semantics change** (declined, archived, re-open) | Either session updates `hasLiveInquiry` in ONE place and pings the other the same day. |
| **Explore does NOT ping about** | `vendor-dashboard/services/actions.ts` — Explore has no branch there this wave (§12.4). Booking pings Explore before touching it. |
### 12.6 · Ownership + verification conditions agreed with the Booking session (2026-07-27)
1. **The `/v/[slug]` declined-predicate edit is OURS to make** (one predicate, one author) under two
   binding conditions from the surface's owner:
   - **Share the PREDICATE, never the SCOPING.** The shared thing is exactly "a thread exists AND
     `inquiry_status != 'declined'`". `/v/[slug]` MUST keep resolving the couple's PRIMARY event
     (`events[0]`, `page.tsx:1106`); the bench keeps its CURRENT event. A refactor that unifies
     event resolution would silently change which event the public profile page speaks about —
     do not do it.
   - **Ping the Booking session with the diff** for review of the `/v/[slug]` side (review, not a
     merge gate).
2. **Assert POSITIVE post-conditions, not "no error" — for both 8b and 8c.** These bugs return
   success while doing nothing, so a test that checks "the call didn't throw" proves nothing:
   - PR-I: assert **a schedule-pool row EXISTS for the event/vendor after acknowledge**, not that
     `acquireSchedulePools` returned.
   - PR-J: assert **a ledger/charge row exists with the expected attribution after claim-sync**,
     not that the resolver returned a value.
   Same rule for any future call whose failure mode is a silent non-fatal return.

### 12.7 · PR-J hard requirements from the money-path verification (Booking session, agreed)
1. **Adjudicate BEFORE the first ledger write — and pin the negative with a test.** Attribution
   freezes on the first ledger insert (`20271009180000:83-89` sets only
   `highest_declared_centavos, source, updated_at` — never `attribution`). So found-you is
   strictly-before-first-write or never. **Required test (Booking's explicit ask):** insert a
   ledger row as `import` → run the found-you path → assert attribution is **STILL `import`**.
   The point is that a future refactor which "helpfully" updates attribution `ON CONFLICT` must
   fail loudly rather than silently repricing history.
2. **Assert POSITIVE post-conditions** (§12.6.2): a ledger/charge row EXISTS with the expected
   attribution after claim-sync — never merely that a call returned without error. Both 8b and
   8c are bugs that succeed while doing nothing.
3. **KNOWN GAP — the un-billable-forever hole (logged so it is not rediscovered as a bug).**
   `applyClaimAutoLink` (`lib/vendor-invite-actions.ts:423-431`) upserts a `chat_threads` row for
   (event, claimed vendor) with **NULL `inquiry_source`**, and `startServiceInquiry` stamps
   provenance only `if (!isExisting)` (`inquiry-actions.ts:302`). Plain terms: **a couple who adds
   their own vendor manually and LATER genuinely discovers them through Explore is permanently
   un-billable.** Fails safe (under-bills), not urgent — but it is a revenue hole, not a data wart.
   **Fix shape (either):** stamp provenance on the claim-created row at claim time, OR allow a
   one-time stamp when the existing row's `inquiry_source IS NULL`. PR-J may close it or leave it;
   it must not silently depend on it.

### 12.8 · Exemption-scope audit of PR-J (applying the Booking session's rule to ourselves)
> Their rule, earned the hard way: **"an exemption must be scoped to the thing that earns it — a
> whole-body test for a phrase-level fact is a laundering vector."** Their first Setnayan-
> solicitation exemption tested the WHOLE body, so *"Message me on Viber, not on Setnayan"* saved
> cleanly with all 48 tests green; it was found by probing the exemption adversarially, not by
> running the suite. PR-J has four exemptions. Audited below — **three are mis-scoped.**

| # | Exemption | What EARNS it | What we'd actually TEST | Verdict |
|---|---|---|---|---|
| 1 | free import when no found-record | *this couple never discovered this vendor on Setnayan* | no found-record **for this event** | ⚠ **MIS-SCOPED (too narrow)** |
| 2 | later view never converts an earlier import | *they knew the vendor before we showed them* | `first_found_at > imported_at` | ✅ correctly scoped |
| 3 | claim-sync free when the vendor has no account | *this business was genuinely not on Setnayan* | *the claiming ACCOUNT is new* | ⚠ **MIS-SCOPED (wrong subject)** |
| 4 | first dispute auto-accepted | *first-time grace, per business* | per `vendor_profile_id`, lifetime | ✅ correctly scoped |

**⚠ 1 — event-hop laundering.** Found-records are per (event × vendor) for privacy. But the fact
that earns the free import is about the COUPLE, not the event: view vendor X while planning event
A, then import X into event B → no record for B → free. **Fix:** adjudicate the found-check across
the couple's own events (same user/couple, any event) while keeping the STORED record per-event —
i.e. widen the *query*, not the *storage*. Do not widen it beyond the couple (no cross-account
inference, ever).

**⚠ 3 — new-account laundering (the exact inverse of their bug: exemption too NARROW / wrong
subject).** "Vendor has no Setnayan account → free forever" tests the claiming ACCOUNT, but the
thing that earns it is whether the BUSINESS was on Setnayan. A vendor who already has a viewed
profile can claim with a **fresh account** and convert a sourced booking into a free one. **Fix:**
at claim time, if a found-record exists for a profile that plausibly matches the claimed business,
do NOT auto-free — route to adjudication (the dispute ladder already exists and is grace-first, so
the honest case still resolves in the vendor's favour on first contact). Never auto-charge on a
fuzzy match; the fail-safe direction stays FREE, but the decision stops being automatic.

**⚠ 1b — the impressions blind spot, stated honestly.** Because search impressions are deliberately
not recorded (owner rule), a couple can read vendor NAMES off a rail without opening a card and
import them all free. This is accepted, not fixed: a name alone is not a booking, and recording
impressions to close it would cost more privacy than the leak is worth. **Documented so it is a
decision, not an oversight.**

**Test requirement:** each of the four exemptions gets an adversarial test that tries to LAUNDER it
(event-hop · new-account claim · import-then-browse · second dispute), not merely a happy-path test.

#### 12.8a · ✅ RULED BY OWNER 2026-07-27: **NO — found-state stays PER EVENT.** (was owner-gated)
> Owner's answer to *"if a couple saw a vendor on Setnayan while planning their wedding, and a
> year later adds that vendor to their kid's christening from their own contacts — do we
> charge?"* → **No. Keep it per event.**
>
> **BUILD INSTRUCTION: found-records stay scoped per (event × vendor). Do NOT widen the query
> across the couple's events. No recency window is needed — the question it answered is closed.**
> A vendor is "found on Setnayan" only for the event where the couple actually browsed them.
> Rationale (owner's option): simplest to explain to a vendor, and it never charges for stale
> history. The event-hop vector is therefore an **ACCEPTED TRADE, documented — not an oversight**
> (same class as the impressions trade in §12.8): a couple could browse under one event and
> import free under another. The resolver keeps ONE scope; the two-scope asymmetry warning below
> is now moot and retained only as history.
>
> _Original gating note, kept for lineage:_
The Booking session (fee-machinery owner) flagged this before it was built, correctly:
**widening the found-check to the couple's other events converts bookings that are FREE today
into billable ones.** It is a redefinition of "sourced", and it runs against the direction of the
last two owner rulings (sourced-only lock 2026-07-25; `website` closed to import 2026-07-26 —
both NARROWED what we charge for).

- **DO NOT BUILD IT on engineering judgement.** PR-J ships with found-records scoped per
  (event × vendor) — today's behaviour — until the owner rules.
- **Owner question, plain terms:** *"If a couple saw a vendor on Setnayan while planning their
  wedding, and a year later adds that same vendor to their kid's christening from their own
  contacts — do we charge a fee?"*
- **If the answer is yes, ask for a RECENCY WINDOW.** Unbounded, an 18-month-old view on an
  unrelated event makes today's manual import billable — precisely the booking a vendor would
  dispute, and they'd be right. (The grace-first ladder makes a wrong call recoverable, which
  lowers the risk — but recoverable-after-a-dispute is worse than never-wrong.)
- **If built, the resolver ends up with TWO scopes** — thread branch event-scoped, found branch
  couple-scoped. That asymmetry is legitimate but is exactly what a future reader flattens "for
  consistency", silently repricing history. Required if built: state the asymmetry in the
  function's COMMENT **and** pin it with a test that FAILS if the thread branch is ever widened
  to match.

**The new-account fix (§12.8 ⚠3) is NOT gated** — routing a fuzzy business match to adjudication
instead of auto-freeing charges nobody automatically; fail-safe stays FREE. Build it.

## 13 · Sort by distance + sort persistence (owner asked 2026-07-27) — READY, not yet built
**Q: "can we also add sort by distance? and is this settable?"** Grounded answers:

### 13.1 · Distance sort — YES, and the data is already on the page (zero new queries)
`haversineKm(venueLat, venueLng, vendor.hq_latitude, vendor.hq_longitude)` is ALREADY computed on
the vendors page (`page.tsx:438-443`) and stored in the enrichment map as `distance_km` (`:469`).
It is simply **never projected onto the bench card** — `ShortlistVendor` carries `serviceRadiusKm`
+ `reachesVenue` (boolean) but not the km. Identical shape to the `thread_id` gap in §12.1.
**Build:** ① project `distanceKm: ext?.distance_km ?? null` onto `ShortlistVendor`
(`shortlist-taxonomy.ts` ~:356, beside `serviceRadiusKm`); ② add `'distance'` to `BenchSort` +
`BENCH_SORTS` (`lib/bench-sort.ts:15-21`) with label **"Nearest"**; ③ comparator
`(a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)` and a reason pill ("3.2 km from your
venue"); ④ extend `fitScore`? **No** — leave the fit lens alone (reach is already a fit input;
adding raw km would double-count).

### 13.2 · ⚠ The anchor caveat — distance from WHAT
Origin is `events.venue_latitude/longitude` (migration `20260525010000`), populated at event
creation from onboarding capture, by `saveVendorToPicks` when the couple saves a `category='venue'`
vendor with coordinates, or by admin override. **If it is NULL, every distance is NULL and the lens
is meaningless.** Required: **hide (or disable with an honest reason) the "Nearest" chip when there
is no anchor** — never show a sort that silently no-ops. Copy when disabled: *"Add your venue to
sort by distance."*

### 13.3 · "Settable?" — three different questions, three honest answers
| Sense | Today | Recommendation |
|---|---|---|
| Can the couple change the sort? | **Yes** — segmented control (`shortlist-categories.tsx:659`) | unchanged |
| Is their choice REMEMBERED? | **No** — `useState<BenchSort>('fit')` (`:426`), component state only. Tab away or reload → snaps back to "Best fit" | **Fix in the same PR** — persist per event (URL `?sort=` or localStorage keyed by event). Arguably a bigger daily annoyance than the missing lens. |
| Is the sort LIST admin-configurable? | No — hardcoded `BENCH_SORTS` | **Leave hardcoded.** Four lenses is a considered set, not a catalog; a configurable sort list is a maintenance liability with no user demand. |
| Is the distance ORIGIN settable (venue vs the couple's home)? | No — always the venue anchor | **Defer.** "From our home" needs a couple home address we don't collect; revisit only if asked. |

**Slice:** small, self-contained, no schema — fold into PR-B's follow-up or ship standalone as
**PR-K**. Unit-test the comparator (null km sorts last, never first) + the anchor-absent hide rule.

### 13.4 · Is "Best fit" already optimal? — audited; it is GOOD but has one real DEFECT
`fitScore` (`lib/bench-sort.ts:31-37`) = `reach(1) + budgetFit(1) + dateFit(1)`, tie-broken
rating → price. Honest, explainable, and a better default than most marketplaces. Three findings:

**⚠ 1 · LIVE DEFECT — the badge fails OPEN, the sort fails CLOSED.** `withinRadius` is `null`
whenever distance is unknown **or the radius is not finite/positive** (`page.tsx:451-455`), and the
code deliberately hides the badge then ("never a false 'out of range'"). But `fitScore` scores
`reachesVenue === true ? 1 : 0` — so that same `null` **loses a point**. Consequences, all silent:
- **FREE tier has `serviceRadiusKm: 0`** (`vendor-tier-caps.ts:185`) ⇒ `hasFiniteRadius` false ⇒
  `null` ⇒ **every free-tier vendor is ranked down on every bench, forever, no matter how close.**
- Any vendor without geocoded coordinates is ranked down identically.
The UI refuses to *say* they are far; the ranking *assumes* they are. **Fix: treat `null` reach as
neutral, not a penalty** — either score `null` as the mid value or normalise the score by the
number of KNOWN signals. Matches the badge's own fail-open rule. Hits hardest exactly the
free-tier vendors a thin launch marketplace needs most.

**⚠ 2 · The threshold is the VENDOR's tier, not the couple's need.** Radii: free 0 · verified 20 ·
solo 20 · pro 50 · enterprise/custom 100. So a **Pro vendor 45 km away scores the reach point while
a Verified vendor 25 km away does not** — the more distant vendor ranks higher because their tier
is bigger. That is tier buying rank under a label that says "fit". Defensible as "they declared
they travel that far", but it should be a *conscious* product position, not an accident. Owner call.

**3 · Distance is binarised — 2 km and 19 km score identically.** Distance is the one axis where
"how much" matters continuously (travel fees, crew meals, call times, day-of risk).
**Cheapest high-value fix: use actual `distance_km` as a TIE-BREAK within equal fit scores**
(before or after rating) — most of the benefit of a distance lens, no new chip, no new data.

**Recommended order:** (1) fix the null-reach penalty [correctness] → (2) distance as fit
tie-break [cheap, invisible, better results] → (3) the standalone "Nearest" lens + sort
persistence [§13.1/§13.3, genuinely useful but the smallest win of the three].

## 14 · Combination sorting (owner: *"I don't want it linear only — a combination of sorting"*)
**RULE-0 RESULT: the combination scorer ALREADY EXISTS and is production-grade —
`apps/web/lib/compat-score.ts`. The bench simply does not use it.**

### 14.1 · What exists
`computeCompatScore()` (`compat-score.ts:154`) — a **7-dimension weighted composite**, weights
summing to 1 (`COMPAT_WEIGHTS`, `:31-53`), built to
`Customer_Vendor_Marketplace_Architecture_2026-06-04.md §2` ("GATE + SCORE" — the gate decides who
is eligible and never hides; the score only ranks + displays):

| Dimension | Weight | Notes |
|---|---|---|
| refinement (style/preference/song overlap) | 0.22 | strongest "is this what I want" signal |
| budgetFit | 0.20 | continuous ratio, not a yes/no |
| distance | 0.18 | **continuous decay, scaled by the vendor's own travel radius** so wide-coverage vendors aren't punished; `DEFAULT_RADIUS_KM = 25` when absent |
| reviews | 0.18 | **Bayesian-adjusted** — one 5★ review ≠ fifty |
| dateHeadroom | 0.08 | free on more candidate dates = lower risk |
| faithFit | 0.07 | lift for declared specialists, never a penalty for generalists |
| trust | 0.07 | verified / boosted / profile completeness |

**`NEUTRAL = 0.6` for any missing input (`:57`) — "never 0".** That is *exactly* the admit-unknown
rule `fitScore` violates (§13.4 defect). The architecture already mandates it; the bench just
doesn't follow it.

### 14.2 · Who uses it — and who doesn't
USES: `_actions/category-search.ts:925-939` (the category-search overlay, which sits on the LEGACY
`plan-budget-accordion` path), `build-3state-actions.ts`, `build-3state-fallback-actions.ts`,
`app/tour/vendors/page.tsx`.
**DOES NOT USE IT: the live bench** (`shortlist-categories.tsx` → `lib/bench-sort.ts`), which ranks
on `fitScore` — **3 binary flags, so only 4 possible scores (0–3)**. In a 6-vendor category most
cards tie, and the real order is decided by the tie-breaks — i.e. "Best fit" degenerates into
"sort by rating" much of the time.

### 14.3 · ⚠ The inputs are ALREADY computed on the bench page
`vendors/page.tsx` already resolves, per candidate, for the compat dims — its own comments say so:
budget-fit ratio (`:357` *"for the per-candidate compat %"*), faith fit (`:383-391`), haversine
distance (`:438-443`), rating + review_count + verified + is_setnayan_service (`:464-470`).
**Everything `computeCompatScore` needs is in scope; the call is simply never made.**

### 14.4 · Recommended shape (build order)
1. **Call the existing scorer on the bench** — replace `fitScore` as the "Best fit" lens with
   `computeCompatScore`. Do NOT write a second scorer. This single change delivers the combination
   ranking, fixes the §13.4 null-reach defect (NEUTRAL 0.6), makes distance continuous (§13.1), and
   de-binarises budget — all at once.
2. **Keep the linear lenses** — "Lowest price" and "Top rated" are jobs ("just show me the
   cheapest"), not defaults. Composite is the default; linear lenses stay as explicit overrides.
3. **Explainability is mandatory.** A weighted score is a black box unless each card says why —
   keep the shipped reason pill, driven by the **top-contributing dimension** ("Closest to your
   venue" · "Best value here" · "Most reviewed"). Never show a bare %.
4. **Per-category weights (owner's call).** One global weight vector is wrong: distance dominates
   for catering / crew meals / booths / transport (they physically travel with equipment) and
   barely matters for a gown designer or a monogram. Recommend a small per-plan-group weight
   override on top of `COMPAT_WEIGHTS`, defaulting to the global vector.
5. **Admin-tunable weights** — already named as intended in the module header ("§2 calls for these
   to be admin-tunable; that admin surface is a later PR"). Sequence it AFTER (1)–(3); tuning a
   scorer nobody has used yet is premature.
6. ⚠ **Watch the `trust`/`boosted` dims** — `boosted` and `is_setnayan_service` feed rank. That is
   defensible but it is paid placement inside a "best fit" default; it must be a conscious owner
   position (same class as §13.4's tier-radius finding) and arguably disclosed.
