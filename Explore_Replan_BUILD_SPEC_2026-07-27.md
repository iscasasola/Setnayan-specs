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
