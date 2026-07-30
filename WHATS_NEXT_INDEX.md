# WHATS_NEXT_INDEX — master compilation for the "run all what's-next" session (2026-07-18)

> **Purpose.** A future session will pick this up to execute the outstanding work across ALL "What's Next" docs — **in parallel where safe, sequential where dependent, and never auto-running anything gated** — then **check gaps and fix them**. This index is the operating manual + the register of every active handoff. **Read this whole file before touching any task.**
>
> Owner intent (2026-07-18): *"one session do all what's next in parallel and sequential safely, and check gaps and fix them."*

---

## 1 · Global safety rules — DO NOT auto-execute these

An item is **HUMAN-GATED** and must be surfaced for owner/DPO, never done autonomously, if it is any of:

| Gate | Meaning | Examples in the register |
|---|---|---|
| `OWNER_DECISION` | a product/pricing/scope choice only the owner makes | Suite nav doorway; pricing § 00 open questions; rich-layer photo-scope |
| `DPO_COUNSEL` | RA 10173 / NPC-filing / consent-basis ruling | vendor "feature my wedding" rich layer; vendor Papic capture go-live; personalization; faith graph |
| `FLAG_FLIP_PROD` | flipping a prod env var / admin Data Privacy control that makes a dark feature live | `NEXT_PUBLIC_SUITE`, `vendor_papic_capture` control, any `NEXT_PUBLIC_*_V1` |
| `COUNSEL_GATED_MIGRATION` | a committed-but-unpushed migration that must NOT `db push` until counsel signs | `20270811377742_vendor_papic_capture_counsel_gated.sql` |

Everything else (write code behind a default-OFF flag, add tests, fix gaps, edit the corpus) is **AUTO-OK** under the standing worktree+PR workflow.

**The rule:** build up to the gate, stop at it, list it. Shipping a flag-dark, fail-closed PR is fine; *activating* it is the human's call.

---

## 2 · Repo + worktree rules (the collision-avoidance keystone)

⚠️ **GAP found while compiling this index:** the four docs cite **three different local repo roots** for the *same* GitHub repo (`github.com/iscasasola/setnayan-platform`):
- `/Users/icecasasola` (git root; `apps/web` subdir; migrations at `/Users/icecasasola/supabase/migrations/`) — Front-Desk doc.
- `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform` — Papic v3 doc.
- `/Users/icecasasola/setnayan-platform-recovered` (+ worktree `setnayan-wt-papic-onday`) — Featured-Weddings doc (this session).

**Before any code work, confirm the ONE canonical checkout** (whichever has `origin` = the GitHub repo and a current `main`). Then, for EVERY task:
- **Fresh worktree off latest `origin/main`:** `git -C <canonical> fetch origin main && git -C <canonical> worktree add -b claude/<task> <path> origin/main` → `pnpm -C <path> install --frozen-lockfile`.
- **NEVER `git add .`** (home root has GBs of untracked junk). Stage explicit paths.
- **Migrations MUST be allocated:** `pnpm -C <path> migration:new "<name>"` — a pre-push hook **rejects round `YYYYMMDD000000` prefixes** (cross-branch collision guard). The main tip moves fast.
- **One task = one branch = one PR**, then `gh pr merge <#> --auto --merge` (repo standing default).
- Layout note: git-root holds BOTH `apps/web/` and `supabase/migrations/` (migrations are repo-root, not under apps/web).

**Parallelism is safe only across DISJOINT files + DISJOINT migration needs.** Two tasks that both add a migration, or both edit the same file, will collide → **serialize them**, and **re-fetch `origin/main` before the second** (so its worktree has the first's merge).

---

## 3 · Standard per-item execution schema

Each actionable item (in each doc's "execution metadata" section) should carry:

```
- id:            <doc-slug>#<n>
  title:         <what>
  type:          code | migration | spec | decision | verify
  depends_on:    [<ids>]          # hard order
  parallel_safe: yes | no         # no ⇒ shares files/migration-seq with a sibling; serialize
  safety_gate:   NONE | OWNER_DECISION | DPO_COUNSEL | FLAG_FLIP_PROD | COUNSEL_GATED_MIGRATION
  touches:       <files / flag / branch / table>   # collision key
  verify:        <tsc | lint | tests | build | live-check + how>
  gap:           <if this item IS a gap-fix, what was wrong>
```

The orchestrator builds one graph from all docs' items, topologically orders `depends_on`, fans out `parallel_safe: yes` items on separate worktrees, serializes the rest, and **routes every non-`NONE` `safety_gate` to a human queue instead of executing it.**

---

## 4 · Gap-check protocol (the "check gaps and fix them" half)

For each doc + its claimed state, verify against reality and fix-or-flag:
1. **Doc-vs-code drift** — does the shipped claim match `origin/main`? (`git -C … ls-tree`, grep the flag/route/table). Fix stale docs.
2. **Orphaned surfaces (wayfinding rule)** — any shipped route/flag with no doorway (e.g. Suite is live but nav-less; a page reachable only by URL). Fix = wire the doorway or mark it.
3. **Missing verification** — code claimed "done" but never exercised (e.g. safe-layer gallery not rendered live; server-action DB paths not run). Fix = add the verify step.
4. **Fail-open holes** — a gate that should fail-closed but doesn't; a flag defaulting ON; a migration pushed that shouldn't be.
5. **Cross-doc contradictions** — two docs editing the same SKU/flag/price differently (see §6). Fix = reconcile, log the decision.
6. Fixes that are code → PR (auto-OK if no gate); fixes that are decisions → the human queue.

---

## 5 · Register of active What's-Next docs (2026-07-18 cohort)

| Doc | Scope | Flag / branch / PRs | State | Top gates |
|---|---|---|---|---|
| [`Whats_Next_Suite_AI_Pricing_2026-07-18.md`](Whats_Next_Suite_AI_Pricing_2026-07-18.md) | Suite (guided services surface) · Setnayan AI · pricing § 00 · personalization | ✅ **shipped code = "Suite"** — the Silid→Suite rename MERGED (`/dashboard/[eventId]/suite` · `SUITE_NAME` · `NEXT_PUBLIC_SUITE`); `NEXT_PUBLIC_SUITE="true"` LIVE in prod (verified 2026-07-22). Suite PR-1 + PR-2 (vignette cards #3413) shipped; compare-doorway fix #3482. **Pricing § 00 all shipped 2026-07-22** (PRs #3559 + #3564, migrations pushed to prod). | Suite is LIVE; nav replaces Studio (flag-gated). Remaining = the AI-per-type build + personalization (DPO/counsel/NPC), tracked separately. | ✅ all Suite/pricing `OWNER_DECISION`s RESOLVED; `FLAG_FLIP_PROD` done. |
| [`0012_papic/Papic_v3_Whats_Next_2026-07-18.md`](0012_papic/Papic_v3_Whats_Next_2026-07-18.md) | ⚠ **LARGELY SUPERSEDED 2026-07-29 by the two-type lock** (Pool ₱1k/2k/3k + One ₱1=1shot, SHIPPED #3868-#3875 — see the Papic register entry below). The v3 caps/Lite/quality-tier recut predates it; the unpushed branch `claude/papic-v3-pr3` must NOT land without reconciling against the shipped two-type mechanics (dedicated ledger, `papic_one_tiers`, clip=8). Treat as REFERENCE until reconciled. | branch `claude/papic-v3-pr3` @ `cd4d89bc2` (12/12 tests, unpushed — now stale vs main) | PR-1/PR-2 migrations shipped to prod; caps-consumption code PAUSED; enforcement/Lite not started. **2026-07-19 owner decision: PR-3 (caps consumption) + free-tier/points enforcement land as ONE atomic PR — land-together in flight** (collapses the § 00.0 dual states: 5-free vs 3-free · legacy ₱9k/₱15k caps vs v3 ₱6k/₱10k/₱15k) | shares **papic tables/tier + Pricing.md** with vendor-Papic work → serialize |
| [`Vendor_Front_Desk_Chatbot_Whats_Next_2026-07-18.md`](Vendor_Front_Desk_Chatbot_Whats_Next_2026-07-18.md) | Vendor AI auto-reply assistant | `NEXT_PUBLIC_VENDOR_AUTOREPLY_V1` (OFF); PR #3397 merged, #3399 open | Phase 1 merged, 2/3a in #3399; 3b+ not built | mostly `AUTO-OK` (flag-dark); `FLAG_FLIP_PROD` to go live |
| [`Vendor_Featured_Weddings_Whats_Next_2026-07-18.md`](Vendor_Featured_Weddings_Whats_Next_2026-07-18.md) | Vendor on-the-day Papic capture (done) + past-events gallery safe layer (done) + **rich layer** (planned) | `vendor_papic_capture` control (OFF); PRs #3388/#3396/#3400 merged | safe layer LIVE; rich layer planned, gated | `DPO_COUNSEL` (rich layer, capture go-live), `COUNSEL_GATED_MIGRATION` | 
| [`Coordinator_Whats_Next_2026-07-18.md`](Coordinator_Whats_Next_2026-07-18.md) | Coordinator role — consent gate on invite (done) + propose-a-lock (done) + prep-then-release / filtered run-of-show / day-of broadcast / vendor folder (planned) + follow-ups | `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` + `NEXT_PUBLIC_COORDINATOR_PROPOSE_LOCK_ENABLED` (both OFF); PRs #3390 + #3401 merged; consent follow-ups #3402 (export) + #3403 (revoked_at) merged | consent + propose-lock flag-off; **P2/P3/P4 SHIPPED flag-dark 2026-07-20** (verified on `main`), only **P1 (DPO-gated)** + follow-ups remain; **§8 carries conforming execution metadata**. **2026-07-19 owner decision: the blanket money wall is SUPERSEDED → CONSENT-SCOPED — lock + checkout allowed when the couple/host has approved that scope in the access limitations** (✅ approver CONFIRMED = couple/host 2026-07-21; DPO sub-decisions ✅ **TEMP-APPROVED 2026-07-21**, provisional). Propose-lock flag **permanent-OFF (dormant)** | `DPO_COUNSEL` (consent flip · P1 parity · autoinvite basis), `OWNER_DECISION` (~~propose-lock flip~~ dormant per 2026-07-19 · checkout audit re-scoped to consent-scoped model · 5 sign-offs), `FLAG_FLIP_PROD` (consent flag) |
| [`Whats_Next_Repo_Backlog_2026-07-18.md`](Whats_Next_Repo_Backlog_2026-07-18.md) | **The repo axis** (co-equal to this index's doc axis): every open PR (29 · verified live), merged-but-flag-dark feature, owner launch-gate, + repo-specific serialize/gap rules | 29 open PRs (18 ready/11 draft) · ~25 flag-dark features · 6 owner infra gates | verified 2026-07-18; re-`gh pr list` before acting | resolves §7.1 (canonical checkout) · carries the "never flip a public flag" + migration-serialize + dependency-chain rules |
| [`Competitor_Kuha_Teardown_2026-07-20.md`](Competitor_Kuha_Teardown_2026-07-20.md) | **REFERENCE — not an execution stream.** Code-level teardown of Kuha (kuha.app): the PH white-label rival named as risk #9 in `Papic_Access_Scope_Council_Verdict_2026-07-20.md:229`. Their tiers, their reseller economics, and a feature-by-feature match against Setnayan | none — no branch, no PR, no code | Research complete + self-contained. **Adds no tasks.** Its §7 is **6 owner DECISIONS**; each spawns its own What's-Next item only *after* a ruling | `OWNER_DECISION` ×5 (white-label answer · Seat Finder placement · Live Wall un-hide · Photo Game · event-day packaging); 1 marketing-copy-only item needs no gate. Items 2/3/5 would touch **`Pricing.md` § 00** + seating/Live-Wall → §6 serialization applies |
| [`3D_Plan_Whats_Next_2026-07-23.md`](3D_Plan_Whats_Next_2026-07-23.md) | **3D Plan** — the integrative product (2D Seat Plan + Guest List + Indoor Blueprint + Mood Board + avatar makers & booths). Host price **₱1,500** (owner 2026-07-23; ₱2,999 + interim ₱1,000 + #3526 couple-discount all retired) | shared-room code shipped flag-OFF `NEXT_PUBLIC_PLAN3D_SHARED_ROOM` (#3041–#3050); 3D booth shipped flag-dark (#3526). **5 build items:** SEATING_3D reprice migration · Mood-Board palette recolour · shared-room flag-flip · 250-pax LOD · actor-layer makers | reprice/recolour/LOD/makers UNBUILT | `FLAG_FLIP_PROD` (shared-room), `OWNER_DECISION` (250-pax LOD alters locked look), **Pricing.md + migration → serialize §6** |
| [`Indoor_Blueprint_Free_Handoff_2026-07-23.md`](Indoor_Blueprint_Free_Handoff_2026-07-23.md) | **Indoor Blueprint → FREE** (owner 2026-07-23 "indoor blueprint is free and uses the 2D Plan for free"). Retired ₱1,499 SKU → free capability delivered by the free 2D seat plan; one of the 3D Plan's four inputs | ✅ **code SHIPPED** PR [#3593](https://github.com/iscasasola/setnayan-platform/pull/3593) (`claude/indoor-blueprint-free`, auto-merge armed) · no migration · corpus reclassified (Pricing.md §0.A/§00.C · AS_BUILT · DECISION_LOG ×2) | **essentially DONE.** Remaining: ⏳ confirm #3593 merged · optional Maya demo-book scrub (non-billing) · verify the `Seat_Plan_2D3D_Alignment_Directive` "integrative product" section exists | `NONE` (owner-decided, shipped) |
| Supporting: [`Whats_Next_Suite…§7`], `Pricing_Reprocess_Handoff_2026-06-14.md`, `App_Build_Status.md`, `V1_Gap_Analysis_Status.md`, and ~40 `project_setnayan_*` memories tagged "NOT built"/"resume point" | reference | — | background | — |

> Older handoffs live in `07_Archive/` — historical, do not action.

---

## 6 · Cross-doc collision & dependency matrix (must serialize)

- **`Pricing.md` § 00 / § 2.1** — edited by Suite/AI-pricing **and** Papic v3 **and** (indirectly) vendor Papic tiers. **Serialize all Pricing.md edits; re-fetch between them.** Do not let two parallel tasks both write § 00.
- **Papic tables + `paparazzi_seats.tier` + `papic_*` migrations** — Papic v3 (`claude/papic-v3-pr3`) and the merged vendor-Papic-capture both touch this area. Any new Papic migration must allocate its prefix AFTER both; serialize Papic-domain migrations.
- **Migration prefix sequence (global)** — ANY two tasks that add a migration collide on the sequence guard. Treat "adds a migration" as a mutex: allocate + merge one before starting the next, re-fetching main.
- **`app/v/[slug]/page.tsx`** — the vendor rich layer edits it; if any other task also does, serialize.
- **DPO/counsel queue (shared human gate)** — rich layer, vendor Papic capture go-live, personalization, faith graph **+ coordinator (consent-flip · P1 prep-release guest-PII parity · autoinvite-consent basis)** all wait on the same DPO. Batch them into ONE counsel packet rather than N.
- **`app/api/profile/export/route.ts`** — `coordinator#gap-export` AND `featured-weddings#2` both add a consent table to it → **serialize** (this is the §7.4 export gap, now for two tables).
- **`event_schedule_blocks`** — coordinator `#P2-filtered-ros` + `#P3-broadcast` share the schedule / day-of domain → serialize.
- **Vendors domain (`app/dashboard/[eventId]/vendors/*`, `finalizeVendor`, `v/[slug]`)** — coordinator `#P4-vendor-folder` + `#checkout-audit` + the merged propose-lock all touch it; `vendors/page.tsx` is a HOT file (already conflicted #3401 ↔ merkado). Serialize coordinator vendor-domain tasks with any other vendor task.

---

## 7 · Known cross-cutting gaps (fix or flag)

1. **Repo-root inconsistency** (§2) — ✅ **RESOLVED 2026-07-18** (see `Whats_Next_Repo_Backlog_2026-07-18.md` §A): GitHub is canonical; the **`/Users/icecasasola/Documents/Claude/Projects/setnayan-platform`** clone hosts the live worktree fleet → use it. The 3 local clones don't share objects, so cross-clone "already built?" checks must go through `gh pr list`, not local `git branch`.
2. **Suite — ✅ RESOLVED + LIVE (2026-07-22).** The Silid→Suite rename merged, nav REPLACES Studio (flag-gated), and `NEXT_PUBLIC_SUITE="true"` is set in prod. The legacy `/studio` hub now redirects to `/suite` (PR #3559). No open Suite naming/nav/flag items remain.
3. **Safe-layer gallery + several server-action paths never run live** — need staged live verification with seeded data.
4. **Consent tables missing from the data export** (`app/api/profile/export/route.ts`) — ✅ **CLOSED 2026-07-19: PR #3402 merged** (both `marketing_share_consents` + `coordinator_access_consents` now in the RA 10173 export), plus **PR #3403 merged** (revoked_at stamped on coordinator access consents when a host is removed). The standing rule remains: any future consent table (e.g. featured-weddings rich layer) must land in the export in the same PR.
5. **Pricing § 00 not finalized** — ✅ **RESOLVED 2026-07-19 (owner decision #3: "follow what we will code" — the CODE is canonical).** `Pricing.md` § 00 rewritten as a code-sync sheet (§ 00.0, verified vs `origin/main` + live prod DB — in sync through `20270823141500`); the residual open questions (§ 00.G, from the Suite doc § 3) resolve by WRITING CODE (migration/PR first, doc mirrors after) — no longer a doc-blocking `OWNER_DECISION`.
6. **Counsel/DPO backlog** — multiple gated features stalled on one ruling; batch. **Coordinator consent = ✅ TEMP-APPROVED 2026-07-21** (owner-as-DPO, provisional — biometric scope-out + decline-path=consent); its flag now blocks only on the migration push + making the approval permanent. Others (featured-weddings rich layer, vendor Papic go-live, personalization, faith graph) still await the ruling.
7. **Coordinator money-scope approver — ✅ RESOLVED 2026-07-21 (owner: "follow your recommendations") = COUPLE/HOST.** The consent-scoped money model (live on `main` behind `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED`, OFF) lets a coordinator lock + checkout **iff the couple/host granted that scope** at invite time. The owner's earlier "guests approval" wording is confirmed to mean the **couple/host** (guests have no standing over event money) — which **matches the shipped code** (couple-approval-based), so **no code change needed**. The flag flip stays **DPO-gated** (item 6 / spec §3a), but the approver ambiguity no longer blocks it. (DECISION_LOG 2026-07-21.)
8. **PR-number drift in the coordinator rows (§5/§7.4) — trust `gh`, not the cited numbers.** The 2026-07-19 entries cite coordinator PRs **#3401–#3405**; verified vs GitHub, those don't all resolve — the real merged export fixes are **#3467** (export the two missing consent tables + coverage guardrail) + **#3475** (bug-fix: author-scoped export reads returned EMPTY under RLS). The *code* is verified-correct on `main`; only the numbers are off. Per §2, cross-check "already built?" via `gh pr list`, never the doc's PR numbers.

---

## 8 · Per-doc execution-metadata status

- ✅ **This doc's own stream** — `Vendor_Featured_Weddings_Whats_Next_2026-07-18.md` carries a conforming **"Execution metadata"** section (worked example of §3).
- ⬜ The other three docs predate this schema. When compiling, do a light pass to tag each doc's items with the §3 fields (most facts are already in their tables) — or the orchestrator reads them and builds the graph on the fly.

**Bottom line for the orchestrator:** build the task graph from §5's docs using §3's schema; obey §2 (worktrees/migrations) and §6 (serialize shared files); fan out only `parallel_safe: yes && safety_gate: NONE`; route every gate from §1 to the human queue; run §4 gap-checks continuously and fix-via-PR or flag.

## 2026-07-29 · EMCEE SCRIPT SYSTEM — 🔵 **BUILD SPEC, contract-grade** (start here for this stream)
**→ [`Emcee_Script_System_BUILD_SPEC_2026-07-29.md`](Emcee_Script_System_BUILD_SPEC_2026-07-29.md)** — per `CLAUDE.md` Rule 0 §4 a dated `*_BUILD_SPEC_*` **outranks any handoff**; where it disagrees with a handoff or a memory, **it wins**. Concept + the *why*: [`Emcee_Script_System_Concept_2026-07-29.md`](Emcee_Script_System_Concept_2026-07-29.md).

**The idea:** the emcee does not write a document — he fills in a **layer** over the couple's night, and the script assembles itself (printable while he prepares, live on his phone on the night). Because his line attaches to a **block**, the couple moves dinner and his script moves with it.

**🟡 WORK IN PROGRESS, on a branch, NOT a PR — continue from it, do not start over:** branch **`claude/emcee-script-layer`** (`2011b6c9d`) already contains the migration (`vendor_block_scripts` — VENDOR-PRIVATE, one policy, no couple/coordinator read, `REVOKE ALL`, cascade-on-block-delete) and the pure lib (`lib/emcee-script-layer.ts` — `buildScriptWorkbook` + `compileScriptText`). **Owed:** its tests, the **script page** (`/vendor-dashboard/clients/[eventId]/script` — the Customer Card is the vendor's per-booking home and **every other trade already has a sub-page there; the emcee is the only one without**), day-of wiring, then the questionnaire and the schedule grant.

**⚠ Read §1 first — 10 traps, every one of which already cost a build cycle**, incl. `test:db:ci` being a SECOND suite (skipping it pushed a broken PR), the `_host_`-named-policy trap that would have let a guest write the couple's picks, never running `supabase db push` (auto-applies; migrations apply ONCE so editing one after it lands leaves prod silently stale), and the exposure freeze failing every schema PR by design.

**Open, unanswered ×3:** *"activities which **GUESTS** can pick"* — everything built assumes the **couple** picks. Do not build either reading on a guess.

## 2026-07-29 · DAY-OF SPECIALIST DESKS + the emcee's activity catalogue (ACTIVE — 3 of 4 items are AUTO-OK)
**→ [`Whats_Next_Day_Of_Desks_And_Emcee_Catalogue_2026-07-29.md`](Whats_Next_Day_Of_Desks_And_Emcee_Catalogue_2026-07-29.md)** — cold-start handover, zero context assumed.

**SHIPPED + VERIFIED IN PROD 2026-07-29 — do NOT rebuild:** all three vendor day-of specializations (`song_desk` · `stage_script` · `floor_command`, all three registry lines live) · the host/MC "Script & cues" desk (PR **#3812**) · the emcee **activity catalogue** end to end — migration `20271015817050` **applied and object-verified in prod**, authoring screen, couple's picker, and the picks→timeline bridge (PR **#3831**). Testing already written as `TEST_SCRIPT_E2E_2026-07-27.md` **§15/§16/§17** (180 checks total) — **append there, do not start a new list.**

**Remaining: 4 items.** 🔴 **Emergency bubble** (`OWNER_DECISION` — who can send, presets or free text; **prototyped both ways**, artifact + `0022_vendor_dashboard/MC_Desk_Prototype_2026-07-27.html`) · 🟢 coordinator's **inbox inline** on the live console (spec = closed PR **#3822**) · 🟢 the emcee's **questionnaire** (model already owner-decided) · acknowledge-back on the bubble.

**⚠ Carries the heaviest traps section in the register — read §1 before any code.** Four cost real time last session: the canonical checkout was **1,455 commits stale** and made shipped files look absent · **two sessions built `floor_command` in parallel** and only found out at merge (one PR closed) · **`test:db:ci` is a SEPARATE suite from `test:unit`** and skipping it pushed a broken PR · a policy named `_host_` wired to the member-wide `current_event_ids()` would have let **an invited guest write the couple's picks** (caught by a DB guard, fixed before merge). Also: **never run `supabase db push`** — it auto-applies on merge, and migrations apply ONCE so editing one after it lands leaves prod on the old version silently.

## 2026-07-29 · EXPLORE / MARKETPLACE integration wave (✅ BUILD LIST EMPTY 2026-07-30 — owner decisions only)
**→ [`WHATS_NEXT_Explore_Marketplace_2026-07-29.md`](WHATS_NEXT_Explore_Marketplace_2026-07-29.md)** — cold-start handover, zero context assumed. Design contract = [`Explore_Integration_BUILD_SPEC_2026-07-29.md`](Explore_Integration_BUILD_SPEC_2026-07-29.md).

**⚠ `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` is ON in production** (owner flipped 2026-07-28) — everything merged on this surface is **immediately visible**, there is no preview buffer. Changes must still ride `isExploreReplanEnabled()` so the flag stays an honest kill-switch.

**8 PRs merged 2026-07-28/29** (#3845 #3850 #3855 #3856 #3858 #3859 #3866 #3867): the vendor-verification P0, the swallowed `events_host` wrong-column query that left **date/budget/venue/AI dark**, bench visual parity + icons, the app ground → flat warm white with glass carrying its own edge, 64 invisible borders, and the **team merge** that deleted the 727-line Lock/Auto/Hidden grid for a quote-fill row.

**✅ THE BUILD LIST IS NOW EMPTY — 7 more PRs closed it out (#3870 #3871 #3877 #3878 #3879 #3882 #3883 #3886).** The doorway anchor · the already-built `CategorySearchOverlay` wired into the bench · **the mobile 4-chip dock removed** (the Coverage Strip is the navigator; the bottom nav un-collapses back to icons+labels, so mobile drops from two stacked bars to one) · **the mobile team summary chip** that replaced the dock's one job with information (*"2 locked · 3 in build · ₱82,000 to spare"*) · the cleanup (dead `build-pin-mode.tsx` + the zero-caller `build-anchors-actions.ts`, the four orphan `customer.budget-subnav.*` registry slots — `nav_slot_override` queried first, **0 rows** — and "plan" → "event" across all five strings incl. the aria-labels) · **both fixable live defects**.

**⚠ Two sessions overlapped on the cleanup** (#3878 and #3882 the same morning). #3878 also introduced a half-rename that #3882 finished: a screen reader announced *"Add Catering to your plan"* over a pool the eye read as *"＋ Add to your event"*. If you are picking this stream up, `git -C <repo> grep` the ref before assuming anything is unbuilt.

**Nothing to build. What is left is OWNER-ONLY:** §5.4's two unbacked scarcity claims (`studio-card-demo.tsx:839` "3 also eyeing your date"; `vendor-grow-sections.tsx:230`) · the **5 decisions in §6** (the `TEST Floor Co (seed)` row + `VALIDATE CONSTRAINT` · annual re-verification · the demand-lens privacy legs · restoring a phone "Budget & payments" item) · and **one prod data correction**: §5.1's two rows still read `event_date_precision = 'year'`, and flipping them turns on countdown behaviour dark since 2026-06-18 on events whose `date_status` is `'undecided'` — the one-line SQL is in §5.1, deliberately not run.

**Still read §1's five traps** — they are about the surface, not the backlog, and all five hold: grep the ref not the tree · `pnpm build` can't run locally · `schema_migrations` lies · prod is pre-launch-empty and the owner account comps every SKU · the two events are not interchangeable.

## 2026-07-29 · LIVE STUDIO + GOOGLE OAUTH (ACTIVE — the newest stream, start here)
**→ [`WHATS_NEXT_Live_Studio_2026-07-29.md`](WHATS_NEXT_Live_Studio_2026-07-29.md)** — cold-start handover for a session with ZERO context. 10 PRs merged (#3770/#3774/#3776/#3780/#3786/#3787/#3791/#3792/#3817/#3820). Live Studio's recording handoff, the paid-day anchor, the public-copy realignment (LIVE), and the **pool-only switch that removes Google OAuth verification entirely**.

**⛔ EVERYTHING IS BLOCKED ON ONE 15-MINUTE OWNER TEST** — Cloud Identity Free → *Admin → Apps → Additional Google services → is YouTube listed?* Full owner sequence in [`Live_Studio_Internal_Consent_Cutover_2026-07-27.md`](Live_Studio_Internal_Consent_Cutover_2026-07-27.md). ⏰ The Google Cloud **trial** also needs upgrading (free; was 6 days left on 07-27).

**Work queue when unblocked:** the legacy-Cast retirement, PR-1 → PR-8, ordered, with a hard GATE before any deletion (nothing has ever broadcast). **5 known-open defects** and **5 owner decisions** are listed in the handover. Carries its own traps section — read § 0 and § 5 before touching code.

## 2026-07-23 · Open-Browse guest-site program (ACTIVE — resume here)
**→ [`WHATS_NEXT_Open_Browse_Handoff_2026-07-23.md`](WHATS_NEXT_Open_Browse_Handoff_2026-07-23.md)** — 14 PRs merged (5-tab program PR1-3 done, page.tsx 4,351→608); PR4/PR5 possibly in flight at handoff (§ 2 = first action); PR6-11 briefs + all owner decisions + appointments + flip levers inside. Supersedes older open items where they overlap.

---

## 2026-07-29 · Card-family handoff + the "what's next" TRIGGER (cross-account continuation)

**Owner directive (2026-07-29):** the session hit its usage limit; work continues on a DIFFERENT
Claude Code account. **The trigger line is "what's next"** — when the owner says it, THIS index
activates: read §1's gates, then execute the register's active docs per their own rules.

**New register entry — [`WHATS_NEXT_Card_Family_Handoff_2026-07-29.md`](WHATS_NEXT_Card_Family_Handoff_2026-07-29.md)**
(maker · card · details · customization/inquiry). Eleven PRs DONE and verified (#3848–#3864,
anchored at `origin/main` = `441779c1f`); the file carries: the done-table + flag inventory
(one pending owner flip: `NEXT_PUBLIC_SERVICE_DETAILS_ENABLED`), the LOCKED principles
(frozen-at-lock · visibility-bounds-chargeability · shared refusals · K=3 privacy floor ·
truthful delivery), the unfinished build list with per-item gates (card-duplicate ·
most-picked schema `event_vendor_item_options` · reply-time/Papic badges · flywheel(BLOCKED) ·
Explore mount handoff · epilogue items), and the 48-hour trap list (twin-prefix migrations,
verify-the-object, byte-scan, agent-stream recovery, landed-but-timed-out pushes).

**Also outstanding from other 2026-07-27/29 sessions (contracts elsewhere, pointers only):**
Song Desk (`Song_Desk_BUILD_ORDER_2026-07-27.md`) · the Papic two-type model locked 2026-07-29
(Pool rungs ₱1k/2k/3k + One ₱1=1shot reloadable — DECISION_LOG row 2026-07-29, build not
started) · Explore replan flag gates · everything in §5's 2026-07-18 cohort still open.

---

## 2026-07-29 · Song desk / song requests / sets — REGISTER ENTRY (upgraded from a pointer)

**Contract:** [`Song_Desk_BUILD_ORDER_2026-07-27.md`](Song_Desk_BUILD_ORDER_2026-07-27.md).
Reasoning: the song-desk rows in `DECISION_LOG.md` — find them with `grep -in "song desk\|song request\|playlist-slot\|song-pick system\|set composition" DECISION_LOG.md` (15 rows, 2026-07-27).
Prototype: [`06_Prototypes/Song_Desk_Sets_2026-07-27.html`](06_Prototypes/Song_Desk_Sets_2026-07-27.html)
— open it in a browser; the three buttons under "Allow requests" ARE the two blocking questions.

### DONE — verified against LIVE PROD 2026-07-27, do NOT rebuild

| Shipped | Where | Proof |
|---|---|---|
| Song desk (repertoire × couple's requests) | `.../on-the-day/live/[eventId]/_components/song-desk/` | PR **#3803** merged |
| Guest song requests — 2 lanes, rate caps, block lever | `event_song_requests` + 2 service-role RPCs | PR **#3813** merged |
| Act's open/close window | `vendor_dayof_configs.song_requests_open` (default FALSE) | PR #3813 |
| `anon` narrowed off `vendor_dayof_configs` | pre-existing exposure, closed in #3813 | baseline diff |
| Host playlist UI, per moment + "don't play these" | `/dashboard/[eventId]/studio/playlist/` | route + `event_playlist_picks` live |
| **Music-vendor read on host playlist** | `event_playlist_picks_music_vendor_read` | **already exists — NO new policy needed** |
| Song matching → "% match" on vendor cards | `songOverlapRatio`, `category-search.ts:915` | live |

⚠️ Two features the owner asked for on 2026-07-27 **already shipped** (the song matcher; the
music-vendor read policy). **Grep before building anything here.**

### The 7 PRs and their gates

| PR | What | Gate |
|---|---|---|
| ~~**1**~~ | ✅ **DONE 2026-07-30 — PR [#3876](https://github.com/iscasasola/setnayan-platform/pull/3876)**, migration `20271020159662`. Column privilege withdrawn from `authenticated`; sole write path is `setSongRequestsOpen` (entitlement-checked, service_role). **Do not rebuild.** | — |
| ~~**2**~~ | ✅ **DONE 2026-07-30 — PR [#3885](https://github.com/iscasasola/setnayan-platform/pull/3885).** Band reads the host's playlist per moment, notes included, `banned_songs` crossed the other way up (hazard = a banned song they DO play). Pure read, no migration. **Do not rebuild.** ⚠ It surfaced PR 6's real trap: `groupPicksBySlot` indexes a hardcoded 8-slot Record and **throws** on an unknown slot. | — |
| **1b** | **NEW 2026-07-30** — always-on requests + move the paid gate to the inbox read | **AUTO-OK now** (was the owner call) · 🔴 security-shaped · **NEXT** |
| 3 | Join the two song-pick systems (onboarding ↔ playlist studio) | ✅ **ANSWERED** — onboarding feeds the studio ("Unsorted" tray); matcher reads both |
| 4 | Vibes per slot (artwork exists, concept does NOT) | ✅ **ANSWERED** — six names FROZEN as drawn (acoustic·classical·jazz·opm·pop·showband) |
| 5 | Sets (`vendor_event_sets`) | ✅ **ANSWERED ×2** — requests always-on (no "chosen sets" mode) · Accept ≠ filed into a set |
| 6 | Extend the slot list (Entrance / Post-Ceremony missing) | ✅ **ANSWERED** — add all three: `prelude` · `grand_entrance` · `recessional` (11 slots) |
| 7 | Guest-facing request button + guest song search | owner-DEPRIORITISED |

**Order (revised 2026-07-30):** 1 ✅ → 2 → **1b** → (6+4 together, same file `lib/playlist.ts`) → 3
→ 5. PR 5 keys to the slot vocabulary, so 6 must land first; **1b must land before any requests UI**
(always-on without the inbox gate hands every free-tier band the thing we just decided to sell).
**One PR per session** — the owner's stated failure mode is sessions that start six things and land
none.

> ### ✅ 2026-07-30 — the six owner gates are CLOSED. Nothing in this stream is blocked.
> All six answered in one sitting. Full reasoning + the trap each answer creates:
> `DECISION_LOG.md` 2026-07-30 (🎼 row) and the per-PR bodies in the contract.
> ⚠ Two answers **reversed a lock from 2026-07-27** (the band's open/close window) and **changed
> what PR 1 shipped hours earlier** — hence the new **PR 1b**. Do not read PR 1's migration comments
> as current on the *default*; its column-privilege gate is still correct and still load-bearing
> (the pause is a paid control).

### ✅ The one live defect — CLOSED 2026-07-30

`song_requests_open` was **not entitlement-gated server-side**: `vendor_dayof_configs` RLS checked
only row ownership, and `resolveVendorSpecializationAccess` was imported ONLY by the render path,
so a free-tier band could flip it via the API. **Fixed in PR
[#3876](https://github.com/iscasasola/setnayan-platform/pull/3876)** (migration `20271020159662`):
`authenticated` holds no INSERT/UPDATE column privilege on that column, and the only write path is
`setSongRequestsOpen`, which checks `holdsSpecialization(access, 'song_desk')` before writing as
service_role.

⚠ **Trap it surfaced, for anyone touching `vendor_dayof_configs` next:** a fresh row defaults
`enabled_modules` to `'[]'`, which `resolveModules` reads as an authoritative **"every module
off"** — so a naive upsert of a new column silently darkens the vendor's entire day-of console.
Update-if-exists, seed-defaults-if-not.

### Blocking owner questions (nothing below PR 2 can start without these)

1. **"Allow requests (anytime)"** — a MODE beside "only during the sets I choose", or always-on?
   (Always-on retires the open/close control the owner locked one message earlier — do not assume.)
2. **An accepted request** — lands in a set the band picks, or is just accepted?
3. **Slots to add** — Entrance/prelude? grand entrance? recessional? (`processional`, `ceremony`,
   `cocktail_hour`, `first_dance`, `parents_dance`, `dinner`, `open_floor`, `banned_songs` exist.)
4. **The six vibe names** — acoustic · classical · jazz · OPM · pop · showband?
5. **Pre-fill direction** for PR 3 (recommended: onboarding → unsorted tray; matcher reads both).
6. Should the `event_song_picks` booked-vendor read be **narrowed to music vendors**? (Deliberately
   not narrowed — narrowing hardcodes taxonomy keys into SQL where they drift from `MUSIC_CANONICALS`.)

### Traps specific to this stream

- **Any new RLS read policy trips THE FREEZE.** Regenerate the baseline **in the same PR**
  (`pnpm --filter @setnayan/web exposure:baseline`) and read your own diff. It fails inside the
  **`typecheck + lint`** check, whose name does not sound like a security guard.
- **The exposure baseline is a conflict magnet** (many PRs touch it). On conflict: take main's
  version, then **REGENERATE** — never hand-merge a generated file.
- **Every new table in `public` ships OPEN** — `REVOKE ALL … FROM PUBLIC, anon, authenticated`
  before any GRANT.
- **Verify the OBJECT, not `schema_migrations`.** Migrations auto-apply but the workflow can lag
  minutes behind the merge; a "missing" table may just be timing. Check `pg_policy`/`to_regclass`.
- **Prod is pre-launch-empty** — 1 vendor profile, 2 events, 0 playlist rows, 0 song picks.
  Tests prove correctness; nothing here is exercisable against real data. A green suite is NOT
  "proven in the field."
- **Sets must key to the existing `PlaylistSlotType`** — never a second vocabulary, or the host's
  picks and the band's sets can never be compared, which is the whole point.

---

**New register entry — [`WHATS_NEXT_Pahina_and_Role_Surfaces_2026-07-29.md`](WHATS_NEXT_Pahina_and_Role_Surfaces_2026-07-29.md)**
(the guest event website + the vendor/host/coordinator day-of surfaces). Same 2026-07-29
cross-account continuation, same **"what's next"** trigger as the card-family entry above.

**13 items DONE and verified against `origin/main` on 2026-07-29 — do NOT rebuild.** The Pahina
guest-site reskin is **LIVE in production** (Wave A, 7 PRs, merged as #3760); the owner-tier gate
(#3764), owner ribbon (#3766) and editor "RSVP'd" preview tab (#3773) are live; the vendor day-of
frame (#3796) plus **all three** specialization surfaces — song desk #3803/#3813, script & cues
#3812/#3831, floor command #3819 — are registered and live; requests inbox + vendor status #3810.

**NOT built, and this is the queue:** (4A) the **coordinator → guest messaging layer** — the only
remaining piece needing new schema, and the thing that makes the day feel connected, since the
schedule already syncs across roles but no role can message another; (4B) the Papic **allowance
economy** (owner-locked formula, 4 grant sources, both SKUs seeded inert); (4C) the 3D booth
doorway; (4D) owner-layer controls beyond wayfinding; (4E) console restyle tails + the empty
`ceremony_venue` taxonomy tile.

**Human-gated, do not auto-run:** ① **nobody has ever looked at the guest site on a phone** — 7 PRs
of visual change verified only by tsc/lint/tests/build, which already shipped a **broken hero photo
to production for ~half a day** while every gate stayed green; ② whether to **switch the
specialization gate ON** (#3778 ships unwired on purpose — enforcing it REMOVES tooling free vendors
have today, and free-during-launch is active); ③ the unreviewed cover-plate aspect ratio.

Already ruled, do NOT re-open: specialization tier floor = **Solo and up**; memento presence =
**`arrived` OR `attending`**.

The file carries the full done-table with PR numbers, ten repo traps that already caused real
defects (gild≡terracotta on light surfaces · gild fails small-text contrast · `.pahina-*` are
`.sn-editorial`-scoped and unreachable from dashboards · the colour exile · no generated Supabase
types so `.eq()`/`.or()` column names are unchecked · new relations ship OPEN · new columns must be
added to explicit select lists · migrations auto-apply unreliably · `git add -A` in a shared
checkout · one session at a time in the guest tree), the specialization plug-in recipe, a
definition-of-done checklist, and the standing verify-before-auto-merge workflow.

---

## 2026-07-29 · Onboarding Papic + Setnayan AI cards — REGISTER ENTRY

**Contract:** [`Onboarding_Papic_AI_Cards_BUILD_SPEC_2026-07-27.md`](Onboarding_Papic_AI_Cards_BUILD_SPEC_2026-07-27.md).
Read **§2.0-NEW** before anything — §2.0 is superseded and collapsed into a `<details>` block on purpose.
Reasoning rows: `grep -n "2026-07-2[789]" DECISION_LOG.md | grep -i "papic\|onboarding"`.

**Owner intent.** Every event gets **Papic** (it creates the memories — ranked #1) and **Setnayan AI**
(ranked #2) offered during onboarding. Papic is **switched ON free**; Setnayan AI is **introduced,
never given away** (owner: *"Setnayan AI cannot be free"*). **No checkout in onboarding** — the
2026-06-21 "no paywall in onboarding" lock stands. AI is **hidden on vendor-free types**
(`simple_event`), gated on `profile.marketplaceEnabled` **and** a resolving SKU — derived, never
`=== 'simple_event'`.

### DONE — verified against LIVE PROD 2026-07-29, do NOT rebuild

| Shipped | Proof |
|---|---|
| Free Papic pool **ARMED** (was silently UNMETERED: no grant ⇒ `applies=FALSE` ⇒ `papic_reserve_event_points` allowed every capture) | PR **#3847** + reissued migration `20271017567807` (**#3848**). Prod: index `papic_event_point_grants_one_free_per_event` present · 2 events × 50 pts · `free_grant_points = 50` |
| Grant reads the **admin-editable** allowance; 3 duplicate "50"s → 1 | PR **#3860** merged |
| `SetnayanAiValue` type-aware (no more Pre-Cana on a birthday) | PR **#3865** ✅ **MERGED** |

⚠ **Do not "fix" the free pool again.** It is armed. Re-arming would stack grants — though the
partial unique index `(event_id) WHERE source='free_grant'` will reject the duplicate (23505),
which the code correctly reads as "already armed".

### ✅ BUILT — the entire list above SHIPPED 2026-07-29 (same day as the lock). Verified on origin/main + live prod.

| # | What | Shipped as |
|---|---|---|
| NEW-A | Two-type catalog + mechanics (Pool rungs ₱1,000/₱2,000/₱3,000 · One ₱1=1shot · reload · free One camera · dedicated per-seat ledger) | **#3868** + pgcrypto fix **#3869** · migration `20271019231590` OBJECT-VERIFIED in prod |
| 2 | `INAPP_TO_SERVICE_CODE` remap + /pricing truth fixes | **#3872** |
| 4+5 | `services-step.tsx` in ALL THREE flows + first `interested_services` reader | **#3873** · flag `NEXT_PUBLIC_ONBOARDING_SERVICES_STEP` **ON in prod** (redeploy verified) |
| NEW-B | Clip 7 → 8 pts | shipped inside **#3868** (`PAPIC_POINTS_PER_CLIP = 8`, `lib/papic-cameras.ts:770`) — the "ships alone" note is moot |
| + | **Guest-side purchases** (pool top-ups + own-camera reloads, anonymous, admin-approval-gated) — owner reversed "hosts only" same day | **#3874** · migration `20271019639608` verified · flag `NEXT_PUBLIC_PAPIC_GUEST_BUY` **ON in prod** |
| + | Out-of-shots panel reachable on pack seats | **#3875** |

⚠ Twin traps that fired during this build, for the next reader: the migration auto-apply
workflow **silently skipped both merges** (dispatch `supabase-migrations.yml` manually + verify
the OBJECT), and `gen_random_bytes` under `SET search_path = public` cannot resolve on Supabase
(pgcrypto lives in `extensions.` — house fix per `20260513030000`).

**➡ THE FOLLOW-UP WAVE IS REGISTERED BELOW:** "Papic promotion surfaces" — the stale/missing
promo surfaces audit. Contract: [`Papic_Promotion_Surfaces_BUILD_SPEC_2026-07-29.md`](Papic_Promotion_Surfaces_BUILD_SPEC_2026-07-29.md).

**Prototype for #4/#5:** artifact **`de2cf612`** (`papic-onboarding-prototype`) — Atelier/glass, two-card step, built to §3.

### Traps specific to this wave

1. **§2.0 of the spec is SUPERSEDED.** It concluded "Papic Pool is not sellable" (true on 07-28: all rungs `is_active=false`, no UI reads `papic_pass_tiers`). The **2026-07-29 owner lock reverses it** and also supersedes `Papic_One_Pool_Model_Spec_2026-07-22.md` guardrail #2 ("don't GA the paid rungs until purge + clip compression ship") — priced for sale **knowingly**; R1 storage risk now rides on the paid rungs. Build from **§2.0-NEW**.
2. **Twin-prefix migrations.** `20271017100000` collided with a twin and **silently never applied** — `schema_migrations` is not proof. Allocate the prefix properly and **verify the OBJECT** in prod after merge.
3. **Never `| tail` a command whose exit code you trust** — it masks failures. Capture `$?` directly. (`npm run build` also cannot run locally: ~7 GB heap.)
4. **`resolveRetailChargeCentavos()` does NOT filter `is_active`** — the *display* path does. "Invisible in the UI" ≠ "cannot be ordered". Pre-existing; out of scope here but do not assume a deactivated SKU is unbuyable.
5. **`style_preferences.interested_services` is WRITE-ONLY** — 3 onboarding writers, zero readers, dead since #2137. PR 5 gives it its first reader.
6. **Extend, never re-draw.** The wedding flow **already has** `plan` / `services` / `summary` screens — they are dead code, filtered out by `PAYWALL_SCREENS` whenever `EXPERIENCE_QUIZ_ENABLED` is true, **and that flag is ON in prod** (`/onboarding/birthday` → 200 vs a bogus type → 404). Do not rebuild them.
7. **Do not re-author the AI capability copy.** `SetnayanAiValue` `mode="preview"` is the pitch, 9 wired capabilities. After #3865 the words live in `setnayan-ai-value-copy.ts` and vary by `statutoryPackKey` + `organizerNoun`.

---

## 2026-07-29 · PAPIC PROMOTION SURFACES — REGISTER ENTRY (2 of 7 closed 2026-07-30)

**Contract: [`Papic_Promotion_Surfaces_BUILD_SPEC_2026-07-29.md`](Papic_Promotion_Surfaces_BUILD_SPEC_2026-07-29.md)** — read it whole before touching anything; it carries the canonical model table (§0), the do-not-touch list (§1), per-PR file:line targets (§2), traps (§3), verification recipes (§4), and the adjacent-items queue (§5).

**Why it exists.** The two-type Papic model shipped 2026-07-29, but a full-surface audit (same day, agent-swept against origin/main) found the OLD model still advertised in high-traffic places and the new one missing where it should be promoted. Worst: the homepage pricing block claims "First 3 cameras · unlimited shots per day — Free" (three false claims), a Maya billing fallback hardcodes ₱2,999 against the ₱1,000 row (a CHARGE path), and the flagship Papic Pool card is a dead "Soon" pill in Suite + Studio whose stated blockers both shipped.

| id | What | Gate | parallel_safe |
|---|---|---|---|
| ~~papic-promo#A~~ | ✅ **FALSE ALARM, closed 2026-07-30 no code.** `readSkuPrice` (`initialize-maya/route.ts:355`) returns `PRICING_BOOK` **only** under `DEMO_MODE`; otherwise it reads the admin catalog honoring `is_active` and fails closed. The ₱2,999 literals are a demo-only book, documented as such at line 42. Nothing to fix. | — | — |
| ~~papic-promo#B~~ | ✅ **DONE 2026-07-30, PR [#3880](https://github.com/iscasasola/setnayan-platform/pull/3880)** — but NOT as specced: `PricingData.groups`/`freeChips` are **rendered nowhere** (2026-07-04 overlay redesign → summary + link to `/pricing`; only `aiPrice`/`aiIntroPhp`/`vendor` are read), so the false rows were built every request and published by `/api/home-pricing` while invisible — *which is why they survived the two-type lock.* Fix = **delete the dead payload**, not port it. Also retired the 4 per-day display helpers (`publicPapicLadder`, `papicCapacityShort`, `papicCapLadderPhrase`, `papicTierSummary`) + `PAPIC_SEATS_PRICE_PHP`. Both CI guards strengthened. 5,380/5,380 unit tests. | — | — |
| ~~papic-promo#C~~ | ✅ **DONE 2026-07-30, PR [#3884](https://github.com/iscasasola/setnayan-platform/pull/3884)** — Pool card `coming_soon`→live with pax-pass blurb replaced; `papic`'s dead `PAPIC_SEATS` serviceKey **removed** (not repointed — it made the card coordinator-recommendable for an unbuyable SKU); `papicGuestPassAccess()` **kept** (event-type eligibility, not a darkness switch); detail + moderation + editorial-label copy fixed under the owner's naming lock. Prod-verified first. 5,385/5,385 tests. ⚠ **gates 0d/0e still open → spec §5 item 11.** | — | — |
| papic-promo#D | 🟠 Retire `PAPIC_SEATS` gates (day-of launcher · galleries · face-enroll ×2); kill "seat links" copy | NONE | yes |
| papic-promo#E | 🟡 Copy sweep: help.ts rewrite + 2 new articles · features "Native app" lie · demo overlay "unlimited" · cosmetics | NONE | yes |
| papic-promo#F | 🟡 /papic price anchor + JSON-LD · SEO free-tier mention · realstories cross-link · guest pitch names Papic | NONE | after B |
| papic-promo#G | ⏸ Papic on couple home/today/for-you — mockups first | **OWNER_DECISION** | after C |

No migrations, no new flags. A–E parallel-safe (disjoint files). Face-tagging copy law: auto-tag is DORMANT — never promise it live (spec §3-5; /privacy biometrics fix is §5-4).

**➡ NEXT UP: papic-promo#D** (four surfaces gate on the unbuyable `PAPIC_SEATS` and so stay permanently dark for every new couple — day-of launcher · galleries card · face-enroll ×2 — plus the "share these 5 seat links" copy). **D · E · F are all open and parallel-safe**; F needs nothing from B any more. G stays owner-gated on the home-surface shape.

**🔒 Read §0's NAMES row before writing any Papic copy in D/E/F.** Owner naming lock 2026-07-30: **"we do not have papic guests — we only have Papic Pool and Papic One."** Technical ids (`PAPIC_GUEST`, `papic-guest`, `papicGuestPassAccess`) are frozen and stay; no *display* surface may print "Papic Guest", "Guest Pass" or "Guest Camera Pack". PR-C fixed the two it could reach; **PR-F still owns `app/page.tsx:127` + `layout.tsx` ("Papic guest photo-and-video capture")**.

**Two lessons from B and C, worth carrying into D–F:**
1. *Verify the surface actually renders before designing its fix.* One grep for the consumer (`PriceRow`/`freeChips`) turned a port into a deletion — and explained the drift. The spec's file:line targets are sound; its claims about which surface **shows** them are audit-time inferences.
2. *Read the blocker comment in full, then check prod.* PR-C's card named **four** gates; the spec listed two. Two were genuinely closed (prod query, not inference), and the other two were **DPO** items that the 2026-07-29 sale had already overtaken. Neither "the spec says NONE" nor "the comment says blocked" was the answer — the database was.

---

## 2026-07-29 · BOARD SYNTHESIS — the prioritized read across ALL register entries

> Compiled at the end of the 2026-07-29 Papic session, owner-directed ("add all of that to our
> what's next"). Visual board: [`06_Prototypes/Whats_Next_Board_2026-07-29.html`](06_Prototypes/Whats_Next_Board_2026-07-29.html)
> (also artifact `f62f7d86`). This section is the board's content in text — a snapshot; the
> register entries above stay canonical per stream.

### The single highest-leverage owner action (15 minutes)
**Live Studio Cloud Identity test** — Admin → Apps → Additional Google services → *is YouTube
listed?* (+ upgrade the free Cloud trial). Unblocks the fully-built 8-PR Live Studio queue.
Sequence: `Live_Studio_Internal_Consent_Cutover_2026-07-27.md`.

### 🔴 Red items — no gate, start cold, in this order
1. ~~**Song Desk PR 1**~~ — ✅ **CLOSED 2026-07-30, PR [#3876](https://github.com/iscasasola/setnayan-platform/pull/3876).** ✅ **And all six owner gates answered the same day — the whole stream is now cold-startable.** Next: **PR 2** (band sees the host's playlist, pure read) then **PR 1b** (always-on requests + the paid gate moves to the inbox read — 🔴 security-shaped, must precede any requests UI).
2. ~~**papic-promo#A**~~ — ✅ **FALSE ALARM 2026-07-30, no code.** The Maya `PRICING_BOOK` is demo-only; `readSkuPrice` honors `is_active` and fails closed for real charges.
3. ~~**papic-promo#B**~~ — ✅ **CLOSED 2026-07-30, PR [#3880](https://github.com/iscasasola/setnayan-platform/pull/3880).** The three false claims were real but invisible (payload rendered nowhere since 2026-07-04) — deleted rather than ported. **Next red-item Papic work: papic-promo#C** (Pool card fake door in Suite + Studio).
4. **Admin "Delete user" broken** — throws for any user with activity (41 NO-ACTION FKs).
5. **Ceremony Venue taxonomy tile EMPTY** — 0 canonicals, live defect on Explore.

### ⛔ The owner decision queue (one question each — see the board / each contract)
Live Studio test (above) · ~~Song Desk's 6 questions~~ ✅ **ALL SIX ANSWERED 2026-07-30** ·
emergency-bubble sender+format ·
Explore wave's 5 decisions · flip `NEXT_PUBLIC_SERVICE_DETAILS_ENABLED` · **look at the live
guest site on a phone** (never done; 7 visual PRs shipped sight-unseen) · papic-promo#G
home-surface shape (mockups first) · Kuha's 6 answers · 3D-Plan LOD + shared-room flip ·
the small pile: AI-card CTA · Papic compare-at anchors · One-roster go · PayMongo priority ·
accountant on "Guest of <event>" receipts · 4 dirty panood worktrees (~19.6 GB) keep-or-kill.

### 🟣 ONE counsel/DPO packet (batch, don't drip)
Vendor Papic capture go-live · featured-weddings rich layer · coordinator consent-flip
permanence + P1 · personalization · faith graph · face-model hosting. Six items, one gate,
one sitting.

### 🟢 Ready-to-build backlog (no gate; each names its contract)
Explore tails (dock PR-3 · team chip PR-4 · cleanup PR-5 · 2 logged live defects) · day-of
tails (coordinator inbox inline · emcee questionnaire) · card-family tails (card-duplicate ·
most-picked schema) · Pahina 4A messaging schema / 4C booth doorway / 4D owner controls / 4E
tails · Open-Browse PR 4–11 (check in-flight first) · Papic follow-ups (One roster ·
`/privacy` biometrics disclosure · clip compression + purge) · vendor chatbot 3b+ ·
papic-promo C–F.

### ⚠ Reconcile-before-building
Papic v3 recut (flagged SUPERSEDED in §5 above — branch `claude/papic-v3-pr3` must not land
as-is) · the 29-open-PR repo backlog (re-verify via `gh pr list`; doc PR numbers drift).
