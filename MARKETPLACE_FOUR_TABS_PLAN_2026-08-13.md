# Marketplace four tabs — redesign plan · 2026-08-13

**Status: PLAN ONLY — no code changed.**
Planned by Fable against `origin/main` `3ca1af296` and live Supabase `njrupjnvkjkitfctetvi`.
The production deployment (`dpl_EXJpPqzBzT3WDKprL9XESZerX3TT`, www.setnayan.com) builds **exactly**
commit `3ca1af296` — so for once, reading the ref IS reading production.

Surface: `/dashboard/[eventId]/vendors` — the couple Marketplace takeover. Shell context:
`ONE_SHELL_PLAN_2026-08-13.md` (persistent rail, tabs live in the page, desktop ≥1024 only).

---

> ## 🛑 0 · RULE 0 FAILED ON THE PLAN ITSELF — owner, 2026-08-14
>
> *"we already had plans for the guests, overview, marketplace and studio."* **Correct, and this
> document should not have been commissioned without reading them first.** RULE 0 says assume the
> thing already exists — that applies to a PLAN as much as to a component.
>
> **[`Explore_IA_Replan_2026-07-27.md`](Explore_IA_Replan_2026-07-27.md) § 0 already stated, on
> 27 July, the exact ground truth Fable spent this session re-deriving from code:** *"a
> **single-scroll takeover**, not tab-switching — four stacked sections … Desktop: bench left, the
> other three in a sticky 380px right rail."* One grep of the corpus would have produced it.
>
> **What this document is still worth:** it is a *verification* pass, not a design. It caught two
> live errors in MY prototype (a tab strip that no longer exists; the Plans/Payments rename drawn
> as an open question two weeks after the owner decided it), measured the surface against prod, and
> produced the slice order. The DESIGN was already settled in July. Read this as "what is true now
> and what is left", and read the July docs for "what it should be".
>
> ### The four plans, and their real state (checked 2026-08-14)
>
> | Surface | The plan that already existed | State |
> |---|---|---|
> | **Overview** | [`Event_Overview_Council_Verdict_2026-07-12.md`](Event_Overview_Council_Verdict_2026-07-12.md) · prototype `prototypes/event_dashboard_v2_2026-07-15.html` | Phase 1 **SHIPPED**. **Phases 4–7 are staged follow-ups, not done.** |
> | **Guests** | [`Guests_Search_Consolidation_Council_Verdict_2026-07-13.md`](Guests_Search_Consolidation_Council_Verdict_2026-07-13.md) · prototype `prototypes/guests_living_roster_2026-07-10.html` | 🔴 **NOT BUILT. Three owner sign-offs open since 13 July** — one of them supersedes a lock that was two days old at the time. |
> | **Studio** | [`Event_Studio_Replot_Council_Verdict_2026-07-17.md`](Event_Studio_Replot_Council_Verdict_2026-07-17.md) | 5 duplicate cards found. **Sign-off #1 approved** (tab composition). **Sign-off #2 — the website consolidation, 5 doorways for 1 product — never answered**, and the Tab-1 refile it gates never shipped. |
> | **Marketplace** | [`Explore_IA_Replan_2026-07-27.md`](Explore_IA_Replan_2026-07-27.md) → `Explore_Replan_BUILD_SPEC_2026-07-27.md` → `Explore_Integration_BUILD_SPEC_2026-07-29.md` | **Designed, built, wave CLOSED 2026-07-30.** The only one of the four that finished. |
>
> 🔑 **The bottleneck on three of these four is not design and not engineering — it is unanswered
> owner questions.** Guests has three, a month old. Studio has one. Nothing was blocked on more
> planning.

## 1 · What the brief (and the prototype) got wrong

**1.1 · The four "tabs" are not tabs.** Since 2026-07-09 the surface is ONE SCROLL of four stacked
sections (`#svc-shortlist` · `#svc-build` · `#svc-budget` · `#svc-compare`). Desktop is two columns:
the bench left, a sticky **380px** right rail holding team → plans → payments (plans + payments
collapsed by default). The desktop tab strip was REMOVED 2026-07-15 (owner: it duplicated what the
eye can see); the mobile 4-chip dock was REMOVED under the replan flag (#3877), replaced by the
Coverage Strip + the floating team summary chip. `?tab=` and the `BB_TAB_EVENT` bus still work but
now **scroll**, never swap panels (`services-takeover.tsx`). Any plan that rebuilds switchable
panels is the paid-twice mistake this project already made once.

**1.2 · The rename is NOT an open owner call — it is live.** `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED`
was flipped ON in production by the owner on **2026-07-28**
(`WHATS_NEXT_Explore_Marketplace_2026-07-29.md:35`, `WHATS_NEXT_INDEX.md:426`,
`Explore_Integration_BUILD_SPEC_2026-07-29.md:9`, plus the `DECISION_LOG.md` slice rows; PR #3889
later verified live behaviour against flag-ON). **Directly measurable from a session? No** — the
Vercel MCP exposes no env listing (confirmed by calling `get_project`: it returns no `env`), and
the surface is behind auth; App Router serves no public build manifest, so the inlined constant
cannot be read out of a chunk the way `NEXT_PUBLIC_PLAN3D_SHARED_ROOM` once was. The claim rests
on **four mutually consistent corpus records**, every PR merged since, and no record of a reversal.
Production today therefore reads: *Browse the bench → Your team → Your plans → Payments*, honest
inquiry-floored demand counts, no mobile dock.

🔴 **The prototype `prototypes/one_shell_2026-08-13.html` drew the rename as an undecided toggle
defaulting OFF** ("Two of these four have a second name waiting. Your call") **and drew a tab
strip that no longer exists.** The prototype was behind production, not ahead of it — a session
building from it would have rebuilt the flag-OFF world. Corrected in slice 0, same day.

**1.3 · Stale names in the brief.** `vendors-section-subnav.tsx` no longer exists — folded into the
config-driven `customer-section-subnav.tsx` (`apps/web/app/dashboard/[eventId]/_components/`), which
renders **nothing** on `/vendors` while the flag is on (`lib/customer-menu.ts` emits no explore
children flag-ON).

**1.4 · "nav slots all unchanged" is stale** — and `lib/budget-build.ts:92` carries the same stale
claim in its own docblock. The `customer.budget-subnav.*` registry AREA was deleted 2026-07-30
(#3882; `lib/nav-registry-defaults.ts:1038`; `nav_slot_override` checked — zero rows). Flag-OFF dock
children still function (registry miss → code default), but admin renaming of those four chips via
`/admin/menus` is gone.

**1.5 · "2 vendors (both hidden)"** — now 1 of 2 vendor profiles is publicly visible
(`vendor_market_stats.public_visibility='verified'`), and 1 of 45 `event_vendors` rows is
marketplace-linked (was 0 on 2026-07-29). Still effectively pre-launch.

**1.6 · The quoted blurbs are the flag-OFF strings.** With the flag on, `tabBlurb('budget')` returns
"What's paid, what's due — and the doorway to your full budget."

**1.7 · Two spec claims already corrected in code** (do not re-import them): the Integration spec's
"the server action keeps its `BUILD_3STATE_ENABLED` guard" — **that flag never existed**;
`build-3state-actions.ts:472-478` records the correction. And `event_category_build_state` is
READ-ONLY legacy since #3867 — 4 prod rows, no writer, only explicit `'excluded'` still honoured.
A *documented, deliberate* dead table, not a new gate-with-no-handle.

**1.8 · The 2026-07-29 integration wave is CLOSED (2026-07-30).** #3866 · #3867 · #3870 · #3871 ·
#3877 · #3878 · #3879 · #3882 · #3883 · #3886 · #3889 · #3894 all landed; the five owner decisions
of that wave are settled. This is a fresh redesign pass over a finished surface, not a resumption.

**1.9 · Compare's "dates that work" footer is unreachable on current prod data.** ✅ **ANSWERED 2026-08-14 (slice 5, PR [#4436](https://github.com/iscasasola/setnayan-platform/pull/4436)):** the window row is left exactly as-is and a SECOND row now covers day-precision — *"Everyone here is free" / "{who} booked that day"* — so a committed date finally gets an answer. The two are mutually exclusive by precision.
 It renders only
for `event_date_precision` = year/month; both real wedding events are now `'day'` (verified live).
Dormant, not broken. See §3.4 / §7 slice 5.

**1.10 · The same-date demand DPO gate is APPROVED + ACTIVE** in prod
(`data_privacy_controls.same_date_demand = active, approved`) — predecessor docs still call it
seeded-inactive. The demand chip can render the moment ≥3 same-date inquiries exist.

**Correct premises worth re-affirming:** "solid menu with no submenus" is real and enforced
(`customer-nav-config.ts` — Marketplace is a plain leaf; Plan / Go live / Also-in-this-event groups
exactly as briefed); `?tab=` / `?open=` / `?inspect=` deep links all live;
`bench-marketplace-search.ts` and the workspace folder (`vendors/[vendorId]/workspace/` —
quote-bridge, deposit-reservation, change-order-trail, handover-inbox, vendor-proposals) exist as
described.

---

## 2 · Ground truth — what the page IS (verified at `3ca1af296`)

`vendors/page.tsx` (2101 lines, server) resolves everything and hands four slots to
`ServicesTakeover` (`_components/services-takeover.tsx`, 460 lines):

| slot | contents |
|---|---|
| shortlistSlot | `InspectorLayout` ( `WaitingForQuotes` + `PendingLockProposals` + `ShortlistCategories` (2092 lines) · inspector = `VendorQuickViewInspector` via `?inspect=v:<vendorId>` ) |
| buildSlot | `MerkadoGuardBanner` (AI-gated) + `BuildLocked` (472 lines — locked list · ready-to-lock · `QuoteFillRow` · decision doorways · six tiles · `TeamSavePlan` · `TeamSummaryChip`) + `ReuseBookingsPanel` (dark, `NEXT_PUBLIC_REUSABLE_BOOKINGS_ENABLED`) |
| budgetSlot | `MerkadoBudgetLens` (115 lines — payments lens) |
| compareSlot | `BuildCompare` (708 lines — plans list · pinned locked rows · matrix · availability footer) |

Kill-switch: `BUDGET_BUILD_ENABLED=false` → legacy `PlanBudgetAccordion` (2117 lines, still compiled).
Cross-surface buses: `BB_TAB_EVENT` (tab scroll) and `BB_RENAME_PLAN_EVENT` (plans → team save bar);
listener verified in `team-controls.tsx:173-181`.

**Live data (2026-08-14):** 5 events · 45 `event_vendors` (13 locked, 13 priced, 3 with deposits,
1 marketplace-linked) · 18 `event_vendor_line_items` · 3 `event_vendor_payments` · 0 `chat_threads`
· **0 `budget_builds` · 0 `event_build_picks` · 0 `event_category_decisions`** · 2 vendor profiles
(1 visible) · 2 `vendor_services` · 0 orders. ⇒ **Build and Plans have never been used by a real
person; Payments is the only section with real data.** Every "empty" table above was traced to a
live writer (quote-fill → `proposeBuildFromQuotes`; save-plan → `savePlanBuildNamed`; decisions →
`category-decision-actions.ts`; picks → `build-pick-actions.ts`) — **empty means unused, not
broken.**

Flag map for this surface: `BUDGET_BUILD_ENABLED` (server, default ON) ·
`NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` (ON since 07-28) · `NEXT_PUBLIC_BUDGET_TRUTH_ENABLED` (state
**undetermined**) · `NEXT_PUBLIC_PAYMENT_GATED_LOCK_ENABLED`,
`NEXT_PUBLIC_COORDINATOR_PROPOSE_LOCK_ENABLED`, `NEXT_PUBLIC_REUSABLE_BOOKINGS_ENABLED` (all default
OFF, deliberate dark launches).

---

## 3 · Per section

### 3.1 · Shortlist — the bench
**A person is trying to:** see every service their event could need, what they already have per
category, and who they could still ask — without leaving the page.
**Already ships:** Coverage Strip v2 (icon tiles + NEXT); two-level single-open folder accordion
(~10 folders / ~53 tiles, taxonomy icons); three-action vendor cards (Add to build · Inquire /
"💬 Check inquiry" with thread link · Lock now) with FitBadges (reach · budget · date); five ranking
lenses + price/rating with reason pills, persisted per event; `CategorySearchOverlay` (#3871 —
tile-scoped, add-and-stay); adaptive category set ("Not needed? Remove" → "＋ Add to your event");
per-tile saved-requirement icons; "✓ Covered — Reopen"; Waiting-for-quotes strip; coordinator
lock-proposal confirm strip (flag-off today); desktop quick-view inspector column; G1 convergence
banner + "Doesn't fit your build" sinking; `?tab=shortlist&open=<tile>` landing on the exact tile
(#3870 `bench-anchors.ts`).
**Genuinely missing:** presentation, not function. (a) The bench never received the 2026-08-08
warm-editorial pass the Overview got. (b) Cold-start: with 1 visible vendor most rails are empty;
the overlay's empty copy is fixed, the rail-end "Find more" cards are not equally curated. (c) The
premium crest tells every couple "your Marketplace is on the premium tier" — while the AI paywall
is OFF, `aiActive` is true for **all** events, so free-for-now reads as "premium". One string.
**Delta:** re-skin to the flat-cream grammar; per-folder cold-start empty state that names the real
pool; crest copy variant for paywall-off. **No mechanics change.**
**Defect (adjacent, already logged 2026-08-12 — do not re-find):** `max_soft_holds_per_date` is
enforced in `vendors/actions.ts` at lock but has **zero writers**, and the vendor-settings route its
column comment names does not exist — the recurring gate-with-no-handle, sitting on the lock path
this bench feeds. Do not surface "N holds left" UI until a writer exists.

### 3.2 · Build — "Your team"
**A person is trying to:** hold their chosen people in one place — locked, still deciding,
undecided — and see what the set does to their money.
**Already ships:** locked list; "In your build — ready to lock" rows with per-row Lock ✓
(`AccordionLockButton` → `finalizeVendor`: hard-single conflict gate · soft-hold gate ·
auto-archive · cascade · claim-invite) and ✕ remove; `QuoteFillRow` (0 → null · 1 · 2+ · after-run +
relocated FallbackPanel); "Still needs your decision" urgency doorways onto the bench; six tiles
(Date · Location · Locked · In build · Budget · Buffer); `TeamSavePlan` (save / overwrite /
rename-bus receiver); Clear candidates; mobile `TeamSummaryChip` (portals to body, suppressed at
0/0); AI guard banner.
**Genuinely missing — the one functional hole on the whole surface:** the vendor-agrees step. Owner
ruled 2026-07-27 that a lock is a REQUEST; handshake steps 1·3·4·5 ship, **step 2 does not exist** —
a couple's Lock books outright. PR-H is fully designed
(`PR_H_Lock_Request_Handshake_BUILD_SPEC_2026-08-04.md`, all 4 owner answers in) but **BUILD NOT
STARTED**, with 14 HIGH plan defects open from its own adversarial review (first: the vendor cannot
reach the page the agree card was specced onto). `build-locked.tsx` carries the literal empty slot
comment: *"handshake-in-progress — the slot PR-H's tracker lands in."*
Also pending by design: deposit-at-lock (flag off) · Buffer/tiles on legacy money until BUD-8.
**Delta:** re-skin only; schedule PR-H as its own specced build (§7 slice 6); **do not let redesign
copy promise a handshake that is not there.**

### 3.3 · Budget — "Payments"
**A person is trying to:** see what they have paid, what is due next, and where the full budget
lives.
**Already ships:** payment progress (paid / to-go / %), next-3 milestones with "Next" chip (past-due
sorts first), one doorway — "Open budget & payments" → `/dashboard/[eventId]/budget`. Flag-ON
heading + blurb say Payments.
**Genuinely missing:** (a) **BUD-8.** The lens computes from legacy `buildBudgetLiveSummary`
(`lib/budget.ts`) while `/budget` reads `resolveEventMoney` (`lib/budget-truth.ts`) behind
`NEXT_PUBLIC_BUDGET_TRUTH_ENABLED` — **if that flag goes on, two surfaces both called "budget money"
print different numbers for the same event.** Resolver status verified: BUD-1/2/3 shipped; BUD-4..10
unbuilt (live check: `event_vendor_line_items.vendor_id` is still NOT NULL — no vendor-less costs).
(b) No per-vendor drill, no overdue tone beyond sort order.
**Delta:** slice 4 (§7). Everything else belongs to `/budget`, not here.

> ✅ **BUD-8 IS BUILT — PR [#4435](https://github.com/iscasasola/setnayan-platform/pull/4435), opened 2026-08-14, auto-merge armed. Do NOT build it again.** The lens now reads
> `resolveEventMoney` behind `NEXT_PUBLIC_BUDGET_TRUTH_ENABLED` through the SAME pure core
> `/budget` uses (`budgetLiveSummaryMoney`), with the same degrade-to-legacy rule.
> 🔴 **It had to land before the flag flips, and the reason is now MEASURED, not argued:** on
> live prod event `044f7e64…` (re-verified against the database 2026-08-14, not just the July
> capture — the ₱80,000 `considering` vendor is still there, unarchived, with 0 line items and
> 0 payments) the lens prints **₱80,000 to go** where `/budget` reports **committed ₱0** with
> ₱80,000 labelled an estimate. Flipping the flag without this slice put two screens
> **₱80,000 apart on the same wedding**.
> 🔑 **RULE 0 paid: no arithmetic was written.** `budgetLiveSummaryMoney` already existed from
> BUD-2 and already did exactly this job — the slice was WIRING, not maths.
> 🪤 **`scripts/budget-parity.ts` prints IDENTICAL output before and after, and that is
> correct** — it transcribes the legacy arithmetic verbatim and deliberately does not import
> the surfaces, so it cannot observe the change. Its rows for wired surfaces are now labelled
> as *the jump that happens when the flag is switched on*, not as unfixed surfaces. **No figure
> in it was edited** — changing the measuring stick to agree with the code would have destroyed
> the only reason to run it.
> ⏭ **ONE THING TO DECIDE BEFORE THE FLIP, named not built:** with the flag ON that same event
> has `committed = 0`, so the lens falls to its existing empty state — *"Set your budget and
> itemize vendor costs to start tracking payments"* — addressed to a couple who HAS set
> ₱2,250,000 and simply committed none of it. Numbers right, sentence slightly wrong. Left
> alone deliberately: session 7 owns this component's look.

### 3.4 · Compare — "Your plans"
**A person is trying to:** keep more than one named version of the team and see them side by side —
including which dates survive each version.
**Already ships:** named-plans list (Rename → bus → team's save bar with scroll · Load with
locked-group protection, server-enforced · Delete); pinned locked rows spanning all columns; matrix
with expandable inclusions; per-column totals vs budget ("over" / "to spare"); per-column
availability footer (year/month precision only); "Current" column; explanatory legend.
**Genuinely missing / smells:** (a) **It renders inside the 380px sticky rail on desktop** — a
many-column table in 380px with `overflow-x-auto` is the wrong home; the one layout change worth an
owner look. (b) Availability footer unreachable for day-precision events (all current prod events);
for an anchored date the useful sentence is different — "everyone in this plan is free on your date
/ {X} is booked that day" — and the per-vendor day data is already computed for the bench
(`dateFitByVendorId`) but not per plan column. (c) Zero prod usage — presentation can change freely,
nothing to migrate.
**Delta:** slices 3 + 5 (§7). Mechanics unchanged.

> ⚖ **AMENDED 2026-08-14 — slice 3 shipped, and it MOVED PLANS AFTER PAYMENTS AT EVERY WIDTH.**
> `Explore_Integration_BUILD_SPEC_2026-07-29.md` §3 ordered the sections Bench → Your team →
> Your plans → Payments, reasoning that Plans "sits next to the team it branches from" and that
> Payments "closes the journey rather than interrupting it". Moving Plans full-width under both
> columns necessarily reorders it on **desktop** — that is the requested change. Leaving **mobile**
> on the old order would have required rendering Plans in two places, and `lg:hidden` +
> `hidden lg:block` is `display`, not conditional rendering: **both copies stay in the DOM**,
> giving duplicate `#svc-compare` ids and two mounts of the panel's client state. So mobile
> follows desktop rather than the two disagreeing.
> 🔑 The §3 order is superseded for Plans only, and deliberately: a side-by-side table that does
> not fit its column is worse than a table in the "wrong" position. **The owner is judging exactly
> this.** If he wants the old order back, the honest options are (a) accept Plans in the rail, or
> (b) split Payments out of the rail — not a second mount.

---

## 4 · The seams between the sections

**Working:** bench "Add to build" → team candidate + bench refilters (convergence) · team "Save
current as a plan" → plans list · plans Load → team (locked survive; stale-candidate hole closed in
`plans-panel.ts`) · plans Rename → `BB_RENAME_PLAN_EVENT` → team bar · lock → Payments dues →
`/budget` doorway.

**Broken or at-risk:**

- **S1 · Mobile reach of Plans/Payments.** With the dock gone, both sit BELOW the very long bench
  behind collapsed disclosures; the team chip jumps to the team only; the Coverage Strip navigates
  the bench only. A couple on a phone scrolls the whole bench to reach money. Slice 1 closes this
  without resurrecting the dock.
- **S2 · Lock finality.** The couple's Lock books outright while surrounding copy hedges ("Lock to
  confirm" chosen because *a lock is a REQUEST*). Until PR-H lands, that is the one dishonest note
  on the page. Land PR-H, or keep redesign copy strictly booking-shaped.
- **S3 · The money-number seam.** Naming is now clean (Payments vs Budget); the NUMBER seam (legacy
  vs resolver, §3.3a) is the live risk. Slice 4 must land before anyone flips the budget-truth flag.
- **S4 · Ghost `?tab=` values.** The page docblock still lists `summary` and `lock`; both fall back
  to shortlist. Harmless — do not copy the docblock forward.
- **S5 · The kill-switch path.** The legacy `PlanBudgetAccordion` drifts further from the live
  surface with every slice. Decide its retirement only after the one-shell event-tree slice is
  judged — it is also the last mount of the accordion-era search call site.

---

## 5 · Budget tab vs Budget link — two surfaces, one word, settled ownership

- **In-page "Payments"** owns: paid so far · % progress · next dues (+ overdue tone) · ONE doorway.
  Read-only, always.
- **`/dashboard/[eventId]/budget`** (canonical editor; sidebar *Also in this event → Budget*) owns:
  the target · allotments/planner · per-vendor itemization · manual line items · logging payments ·
  export.
- Rules to hold: the lens never re-declares an editor control (the quote-fill "Set a budget" subline
  already links out — keep that pattern); both surfaces read ONE resolver before the resolver flag
  ever flips; the phone gets no fourth Budget doorway (owner-settled 2026-07-30, decision 5).

> ⏭ **The same shape exists on the guest side and is NOT yet ruled:** journey stage 4 **Seat** and
> the sidebar's *Also in this event → **Seat plan*** are the same room (`/seating`). One ruling
> should cover both overlaps. Surfaced 2026-08-13; not decided.

---

## 6 · The rename — recommendation

**Adopt "Plans" and "Payments" as canon.** They have been production reality since 2026-07-28; the
reasoning is already recorded (Compare named the looking, not the thing kept; on this page Budget is
the payments lens while the money target lives at `/budget`); and the same flag carries behavioural
honesty (inquiry-floored demand counts) that must not be toggled for label reasons.

Sequence: (1) one `DECISION_LOG` row — labels are canon, the prototype's toggle is historical;
(2) slice 0 corrects the prototype so no future session builds the flag-OFF world; (3) **do NOT fold
the flag yet** — it kill-switches the entire replan wave (slices A–J), not just two labels; schedule
the fold as its own retirement slice after the one-shell event tree ships and is judged (update
`flag-chokepoint-scan.test.ts` in the same PR).

**Flag state, stated plainly:** not directly measurable from a session (no Vercel env listing — the
MCP's `get_project` returns none; the surface is behind auth; App Router serves no public build
manifest). Four independent corpus records say the owner flipped it ON on 2026-07-28; subsequent
merged work verified prod behaviour consistent with ON; nothing records a reversal. **Treat as ON;
one glance at Vercel → Settings → Environment Variables (Production) confirms it** before building
any flag-adjacent slice.

---

## 7 · Build order — each slice ships alone and is judgeable

| # | Size | Files (≈) | What ships | Owner judges |
|---|---|---|---|---|
| 0 | XS | 2 + log | **Truth alignment**: fix the prototype's Marketplace (one scroll, two columns, Plans/Payments canon, no toggle); fix the stale nav-slot claim in `lib/budget-build.ts:92`; `DECISION_LOG` row for label canon | nothing visible — but the next session builds the right world |
| 1 | S | ~3 | ✅ **DONE 2026-08-14 · PR [#4436](https://github.com/iscasasola/setnayan-platform/pull/4436).** The page mounted **no `<h1>` at all** (the only h1s under `vendors/` are its SUB-routes) — so this landed the shipped `<PageMasthead>` plus four chips driving the EXISTING bus. Original scope: **Masthead + section chips, in page**: crumb · H1 "Marketplace" · sub-line · four chips reading `tabLabel()`, wired to the EXISTING bus/anchors (scroll, never swap). Desktop above the two columns; mobile above the bench (team chip stays). Closes S1 | the wayfinding row, on desktop and phone |
| 2 | M–L | ~6 | ✅ **DONE 2026-08-14 · PR [#4436](https://github.com/iscasasola/setnayan-platform/pull/4436).** Root cause found: the 2026-08-08 pass was ONE edit to `.sn-tile`/`.sn-card`, and this surface carried **zero** of those classes, so it was never reached. Original scope: **Warm-editorial re-skin** (class-level, no logic): `shortlist-categories` · `build-locked` · `build-compare` · `merkado-budget-lens` · `quote-fill` · `team-controls` to the flat-cream grammar Overview got 2026-08-08; + the crest honesty string | the look, side by side with Overview |
| 3 | M | ~3 | ✅ **DONE 2026-08-14 · PR [#4436](https://github.com/iscasasola/setnayan-platform/pull/4436) — ⚖ STILL THE OWNER LOOK.** Original scope: **Plans out of the rail (desktop)** — THE ONE OWNER LOOK: `compareSlot` renders full-width under the bench column at lg+ (rail keeps team + payments), or expands-in-place to full width. Anchors/bus/keys unchanged (they resolve by id, not DOM position) | a side-by-side that actually fits |
| 4 | S | ~3 | ✅ **DONE 2026-08-14 · PR [#4435](https://github.com/iscasasola/setnayan-platform/pull/4435) — do NOT rebuild.** **Payments onto the resolver**: `MerkadoBudgetLens` reads `resolveEventMoney` behind `NEXT_PUBLIC_BUDGET_TRUTH_ENABLED` through the same pure core + degrade-to-legacy rule `budget/page.tsx` uses. Gap it closed, measured live: **₱80,000** on prod event `044f7e64…`. See §3.3 for the parity-harness caveat and the one copy call left open | same numbers on both money surfaces (flag preview) |
| 5 | S | ~2 | ✅ **DONE 2026-08-14 · PR [#4436](https://github.com/iscasasola/setnayan-platform/pull/4436).** Pure core `lib/compare-anchored-date.ts`, reusing `dateFitByVendorId` — no new query. Original scope: **Anchored-date line for Plans**: per-column verdict for day-precision events ("free on your date" / names the booked vendor), reusing `getBatchVendorAvailableDays` | the sentence appears on his real event |
| 6 | L | own spec | **PR-H vendor-agrees** — build ONLY from `PR_H_Lock_Request_Handshake_BUILD_SPEC_2026-08-04.md` after its 14 HIGH plan defects are re-planned; lands in the team's reserved slot. Separate wave; named here because the Build section's honesty depends on it | a lock that asks the vendor |

**Deliberately NOT sliced:** retiring the kill-switch/legacy accordion; folding the replan flag; any
bench mechanic; restoring any dock or sidebar submenu.

---

## 8 · Traps for whoever builds it

1. **Grep the ref, never the shared checkout** — `/Users/icecasasola` holds ~96 uncommitted files
   from another session. Use `git -C /Users/icecasasola show origin/main:<path>` / `git grep …
   origin/main`. This exact trap already cost a wasted run (2026-07-28).
2. **The tabs are not tabs.** The bus scrolls. Do not rebuild panel swap; do not move sections into
   the rail as submenus (owner lock, twice).
3. **Everything merged here is immediately visible** (flag ON in prod, no preview buffer). Ride
   `isExploreReplanEnabled()` branches; flag-OFF must stay byte-identical;
   `flag-chokepoint-scan.test.ts` enforces single-reader + helper-call discipline.
4. **Keys never change.** `?tab=` values, `#svc-*` anchors, `BB_TAB_EVENT`, `?open=`, `?inspect=`
   are all load-bearing. Labels go through `tabLabel()` / `tabBlurb()` only.
5. **Do not add `.sn-col` to this page** — asked twice, refused twice; the 380px rail makes the cap
   subtract from the bench (`services-takeover.tsx` carries the arithmetic).
6. **One lock path.** `AccordionLockButton` → `finalizeVendor` is the only lock; every gate rides it.
7. **The team chip is not a `<SubNav>`** — SubNav increments the docked-count store and collapses the
   bottom nav; the chip deliberately borrows only geometry, portals to body, and uses its own
   `html.teamchip-docked` class. A test forbids the import.
8. **`?open=` mechanics (#3870) look redundant and are not**: the bench re-keys on `?open=` flag-ON;
   folder-target on `openPlan` and the willRemount-derived scroll are each load-bearing. Do not
   "simplify".
9. **`pnpm build` cannot run on this machine** (~7 GB heap). CI is the only valid build claim.
10. **Migrations: verify the OBJECT** (`information_schema`), never `schema_migrations`.
11. **The two test events are not interchangeable** — `044f7e64…` (sparse, has venue coords) vs
    `947e7bab…` (~41 vendors, no coords). "Looks empty" screenshots are usually the sparse one. The
    owner account is `is_internal = TRUE` and comps every SKU — never judge a paywall on it.
12. **Compare lives in 380px** until slice 3 — any matrix redesign before the move must survive that
    width.
13. **Prototype visuals are not authoritative** — emoji glyphs must become Lucide (CI guard), and the
    prototype's Marketplace body is a schematic, not a drawing of the bench.
14. **The registry rows for the old dock are deleted** — a flag-OFF revert keeps the dock working but
    not admin-editable. Known, accepted.
