# WHATS_NEXT_INDEX — master compilation for the "run all what's-next" session (2026-07-18)

> **Purpose.** A future session will pick this up to execute the outstanding work across ALL "What's Next" docs — **in parallel where safe, sequential where dependent, and never auto-running anything gated** — then **check gaps and fix them**. This index is the operating manual + the register of every active handoff. **Read this whole file before touching any task.**
>
> Owner intent (2026-07-18): *"one session do all what's next in parallel and sequential safely, and check gaps and fix them."*

---


## 2026-08-07 · Build-integrity sweep — READ FIRST if you touch CI guards, migrations, or an open PR

**[`WHATS_NEXT_Session_Handoff_2026-08-07.md`](WHATS_NEXT_Session_Handoff_2026-08-07.md)**

6 PRs merged, 1 closed as superseded. **One was a live user-facing bug: every guest
who wrote a message on a Papic photo got `save_failed`, for weeks, with green CI** —
the route sent an RPC argument the production function did not accept, and a rejected
query is not a thrown error. Its migration had been written into an **orphan
`apps/supabase/migrations/` directory that `supabase db push` never reads**, so the
app half went live and the schema half went nowhere. Both halves looked done.

**Three new CI guards, all mutation-tested — do not weaken or delete:**
`lint-server-only-boundary.mjs` · `lint-migrations-dir.mjs` ·
`rpc-argument-names.db.test.ts`. 🔑 Wiring a guard into `ci.yml` takes **three** edits
(step + env binding + `check` line); missing any one makes it decorative.

⚠️ **TWO OPERATIONAL WARNINGS FOR A COLD START:**
1. **Another session works this repo concurrently.** A force-push of mine was rejected,
   and that rejection is the *only* reason I noticed it had pushed the same fix minutes
   earlier — forcing would have erased its work. Check `origin/<branch>` vs `ORIG_HEAD`
   before any force, and verify the push actually landed afterwards.
2. **The shared main checkout holds 96 uncommitted files** (29 added, 67 modified) from
   that session and is 122+ commits behind. **Do not stash or discard them.** Read
   current main via `git worktree add --detach /tmp/wt-read origin/main`.
   🔴 **OWNER DECISION: keep or discard that uncommitted work.**

🚨 **A "verified" task brief can still be wrong.** The orphan-directory brief said all
three findings were checked and instructed *delete both files*; **finding 3 was false**,
and obeying it would have destroyed the only remaining record of schema a live feature
needed. Re-verify a brief's claims before running its destructive step.

⚠️ **#4004 (CSAM known-hash hook) MERGED** despite `DECISION_LOG.md` 2026-08-04 saying it
must not. **Verified inert** — it needs `CSAM_HASH_MATCH_ENABLED`, default off — but
**the gate moved from a draft PR to an environment variable.** The condition is
unchanged: enrol with a provider and sign the NPC Circular 16-02 agreement first.

---

## 2026-08-06 · Cleanliness findings — the work register

**[`WHATS_NEXT_Cleanliness_Findings_2026-08-06.md`](WHATS_NEXT_Cleanliness_Findings_2026-08-06.md)**

11 PRs shipped that day; **14 findings remain, priced by who they hurt.** Every
finding survived a skeptic agent instructed to refute it.

⚠ **P1 is three items:** six shipped features with no doorway · the app
disagreeing with itself about when the wedding day is (12h out at the start, 36h
at the end, both definitions consumed in the SAME component) · the admin Samahan
tab throwing because one allow-list has 8 of 9 members.

🔑 **The shape of nearly every one: two places holding the same fact, and one
never got the update.** Ask "does this fact live in more than one place, and do
the copies agree?" — not "is this correct?".

⛔ **A NOT-WORK list is included and is load-bearing** — 18 files parked on
purpose, 3 reached by CI rather than imports, and a 4,100-line "dead" wizard that
is LIVE. An audit recommended deleting it; that would have broken a working
screen for couples.

## 0 · THE OWNER'S QUEUE — VERIFIED AGAINST LIVE REALITY 2026-08-06

> 🛑 **VERIFY EVERY ROW BEFORE YOU READ THIS LIST TO THE OWNER.** Owner, 2026-08-06:
> *"before i address the other 5. check it first. this has been repetitive."*
>
> By that date he had been handed **three** tasks he had already completed — reviewing prototypes he
> approved on 08-04, deleting ID files already deleted, and deciding a privacy-page question the live
> page had already stopped asking. **A row here is a CLAIM about the past, not a fact about now.**
> Check the live site → the shipped code → the production DB, in that order. The corpus is history.
>
> 🔑 **`NEXT_PUBLIC_*` flags are readable WITHOUT dashboard access** — inlined into the client bundle at
> build time, so fetch the live page's JS chunks and grep. "I can't check that" is usually false.
> 🔑 A row that genuinely **cannot** be checked from here must SAY SO on its face, or the next session
> re-lists it as though somebody forgot to look.
> 🔑 **Tick a row the moment it is done — including on the owner's word**, saying that is what closed it.
>
> **2026-08-06 full re-verification (13 agents, every verdict independently attacked):
> of 22 rows, 6 were ALREADY DONE, 4 are UNVERIFIABLE from here, 1 was never his decision.
> 11 genuinely need him.** Several rows were not just stale but WRONG about the reason — recorded below.

### ✅ CLOSED 2026-08-06 — do not re-ask

| # | Item | What closed it |
|---|---|---|
| 1 | ~~Look at the design prototypes~~ | **Approved all 19 on 2026-08-04**, no changes. |
| 2 | ~~Delete 2 government-ID files~~ | **Owner's own word, 2026-08-06.** Object storage is unreachable from a session, so nobody here can verify either way — recorded as his account, not our verification. The admin screen that lists and deletes those files is live, and **no vendor record points at an identity file**. |
| 4 | ~~Decide the privacy page's country answer~~ | **Verified on the live page.** It now names Singapore (database + biometric vectors), APAC (media), the US (AI + Google integrations), and says outright *"none of them is in the Philippines"*. Nothing to decide. |
| 7 | ~~What Papic looks like on a couple's home screen~~ | **Decided 2026-07-30 and built** — both the tile and the one-time "your free camera is ready" note are on the home screen, ungated. |
| 8 | ~~Who sends the emergency day-of message~~ | **Settled and live 2026-08-05**: the coordinator sends it and types freely. The fixed-phrase version was only ever a drawing — there were never two built things to compare. |
| 12 | ~~The new monogram maker~~ | **Read off the live site: visitors already get the new version.** |
| 14 | ~~Coordinator consent gate~~ | **Switched on by the owner 2026-07-22** from the privacy screen; six surfaces genuinely ask for it. Never a hosting-settings flag. |
| 23 | ~~Guest website navigation menu~~ | **A real couple's guest site is serving the menu now**, and since 2026-08-05 it renders regardless of the switch. |

### 🔴 GENUINELY OPEN — and three of these had the WRONG REASON on file

| # | What to do | If it waits | ⚠ correction to the old row |
|---|---|---|---|
| 5 | **Confirm the vendor booking fee should stay ON, or say turn it off.** | The charging path stays armed having never once run. | **Nobody has been charged a peso — zero fee charges exist in prod.** Far less urgent than "real couples are being charged". |
| 22 | **Sign up with a child-safety image-matching service.** | Uploads go live with no check for known illegal images. | 🚫 **Do NOT re-check the storage provider — that was already investigated and the answer is no**, their scanner needs traffic proxied through them and ours is not. The adult-content filter IS on but has never had a real photo to judge. |
| 20 | **Decide: take live streaming off sale, or create a Setnayan channel.** | A couple can buy a broadcast we cannot deliver. | **The Google suspension is NOT the blocker — nobody ever created a channel.** Two separate problems, and only one is Google's. |
| 21 | **Five privacy rulings — these are YOURS, not a lawyer's.** Your own compliance record names you as DPO. Sharpest: **a guest's real name currently publishes with their written message BY DEFAULT.** | Nothing is exposed today, but the riskier default is already coded in with no ruling on record. | **"Blocked on the lawyer" was false**, and so was "three features running live without paperwork" — the shared pool 404s, and there are **zero** guest columns, guest photos or chat threads in prod. |
| 24 | **Say which processor list is right** so the public page and the compliance file agree. | The two drift further apart; a regulator gets the older one. | **PostHog is ALREADY on the internal list — the old row was wrong.** Real omissions: **Sentry, Google, TikTok**, and that our storage provider also relays live call video. ⚠ **The gap runs BOTH ways** — the internal manual names two services the public page never mentions. |
| 9 | **Two calls on the band/song desk**: should the couple see the band's finished song list, and should every booked supplier be able to read the couple's song picks? | Nothing breaks today — only the band has a linked account. | — |
| 15 | **Shared 3D room — say whether to switch it on.** | Two guests walking the same 3D venue stay invisible to each other. | — |
| 19 | **Search-traffic numbers.** | You keep planning blind to what people search. | **Probably NOT the suspension.** The locked account is a brand-new one from late July; the older Google login you already use for photo storage and video works today. Likely unfinished setup. |
| 16 | **Bing — sign in to their webmaster tools and IMPORT from Google.** | Bing never reports your traffic. | Do not paste a code — Google was verified via DNS, not the site. |
| 10 | **Say yes to permanently deleting one leftover database record.** The tidying is ours. | Nothing. Unread, marketing settings only. | — |
| 18 | **LinkedIn company page** *(optional)*. | Nothing — genuinely fine to skip. | — |

### ❓ CANNOT BE CHECKED FROM HERE — say so, don't re-list as forgotten

| # | Item | Why it is unverifiable |
|---|---|---|
| 3 | Re-send the legacy-preservation brief to counsel | **The rewrite and export both really happened 2026-07-30** — nothing left to write. Whether it was *emailed* leaves no trace in code, corpus or DB. ⚠ The old "no lawyer is engaged" claim came from a **seeded checklist nobody has ever ticked** (all 15 rows share one microsecond timestamp) — that is not evidence in either direction. |
| 11 | Service details pages | Server-only switch; never reaches a browser. Moot regardless — **no vendor shop is viewable by anyone today**, not even its owner. |
| 13 | Vendor auto-reply assistant | Server-only switch. And there is **not one message in the system** for it to reply to. |
| 17 | Clear two abandoned video folders | No storage credentials, and the service answers identically for a real and a fake key, so existence cannot be probed. Only the owner's dashboard or the media screen can say. The one-press clear button does cover exactly those two folders. |

### 🔧 NOT THE OWNER'S JOB — was wrongly on his list

| # | Item | Why |
|---|---|---|
| 6 | The Filipino-memory wording on the front page | **He approved the words and named the pages on 2026-07-31.** It is not live because nobody typed it in. The "decide again" note was a later misreading of his own ruling. ⏭ Engineering work. |
| — | Media screen's homepage-videos section looks in the wrong place and will always read empty | Engineering. |
| — | The daily site check keeps demanding Google verification that is already done via DNS | Engineering. |

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
| [`ROPA_Drafted_Rows_2026-07-30.md`](ROPA_Drafted_Rows_2026-07-30.md) | **NPC filing — the coverage-drift gate.** Three ROPA rows drafted in the dossier's own format: **row 21 refreshed** (the 2026-07-20 draft says "≤5-second clips" — the cap is **10 s** since 2026-07-22, so the old text would misstate a category to the regulator), **new row 22** guest-authored public columns, **new row 23** in-app calls (owes a **Cloudflare TURN** subprocessor line — "never recorded" is true of our storage, silent about the transit hop). | no branch — corpus only; **do NOT edit `privacy-coverage.ts` `declaredIn`** (that mutes the drift tab without the filing changing) | 📝 **DRAFTED, NOT ADOPTED** — 6 owner/DPO actions in § 4 | `DPO_COUNSEL` ×5 rulings · `OWNER_DECISION` on `same_date_demand` (no per-couple opt-out). 🔴 `papic_pool_gallery` + `guest_columns` are **ACTIVE in prod since 2026-07-27** while undeclared — live processing, no filing row; their "held fail-closed" notes are stale on the control half. |
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

## 2026-08-02 · STORAGE HYGIENE — `/admin/website-media` SHIPPED · sign-in hero RETIRED (newest stream · build list EMPTY)

**All three PRs MERGED and verified on prod 2026-08-02** — `origin/main` at the time `58a16af21`.
Nothing here needs building. What remains is **owner actions + traps that must not be relearned.**
No separate contract file: this section IS the record.

| | |
|---|---|
| ✅ DONE | **`/admin/website-media`** (PR [#4050](https://github.com/iscasasola/setnayan-platform/pull/4050)) — the READ side of the media bucket. Lists site furniture, marks each object `In use` / `Left over` / `Not sure`, Download + single-file Delete. **Verified live:** `/admin/website-media` → 307 to login. |
| ✅ DONE | **The replace-sweep** (same PR) — `saveBackgroundVideo` / `saveHeroVideo` now delete what they replaced. Before this, every replace stranded its predecessor forever. |
| ✅ DONE | **Download actually downloads** (PR [#4052](https://github.com/iscasasola/setnayan-platform/pull/4052)) — the presigned GET had no `Content-Disposition`, so it *played the clip in a tab* and saved nothing. |
| ✅ DONE | **Sign-in hero RETIRED** (PR [#4055](https://github.com/iscasasola/setnayan-platform/pull/4055)) — deleted, not flagged off. **Verified live:** `/admin/hero-video` → 404. |
| ⏭ OWNER | **Clear the two `(retired)` folders** on the page — `hero-videos/` + `hero-frames/`. Every upload wrote a new `hero-frames/<sessionId>/` folder of **73–361 stills** for a screen that never rendered. **Biggest single reclaim available.** |
| ⏭ OWNER | **2 orphaned government-ID files** in `setnayan-vendor-verification` — personal data; owner downloads + deletes from the Cloudflare dashboard. Claude does not touch these. |
| 🔴 `OWNER_DECISION` | **`homepage_hero_config` is still in prod, inert and unread** (same posture as retired `token_burn_bands`). Dropping a production table is owner-gated, not a side effect of deleting a screen — and it would need the CI-enforced **exposure baseline + prod-schema snapshot** regenerated in the same PR. |

### 🪤 Traps this stream paid for — do NOT relearn them

- 🔑 **PREFIXES COME FROM THE UPLOAD CALL SITES, NEVER A MODULE NAME.** Revision 1 guessed
  `homepage-background-videos/` from `lib/background-videos.ts`; the uploader writes
  `homepage-bg/slot-N/`. `brand/` is not an R2 prefix at all. **The allowlist matched ZERO
  objects** and the page would have rendered "nothing stored" over a full bucket. Grep the
  `presignAndPut` / `pathPrefix` argument. Real set: `homepage-bg/` · `hero-videos/` ·
  `hero-frames/` · `onboarding/` · `brand-icon/` · `nav-icons/`.
- 🔑 **PROSE IS NOT A SAFETY MECHANISM.** Revision 1 put the **live** onboarding background
  music under a blurb reading *"probably left over"* with **Delete enabled**. Fixed twice
  over: the folder got a resolver, and `unknown` is now undeletable under any wording.
- 🔑 **AFTER FIXING A MISSING RESOLVER, ASK IF THE ONE YOU WROTE IS COMPLETE.** The music is
  recorded in **two** columns — `onboarding_bg_music_r2_key` *and*
  `onboarding_bg_music_r2_keys` (TEXT[], migration `20271011873973`). Reading one made a
  track referenced only by the other deletable. Same defect class, one column over.
- 🪤 **A PRESIGNED LINK WITHOUT `Content-Disposition` DOES NOT DOWNLOAD** — R2 serves the real
  media type, so `.mp4`/`.jpg` renders inline and nothing hits disk. `lib/content-disposition.ts`
  lives in its own module because `lib/r2.ts` imports `server-only`, which **cannot resolve
  under `tsx --test`** — a pure helper parked there is untestable.
- 🚨 **`~/Documents/Claude/Projects/setnayan-platform` IS HOSTILE TO IN-PLACE WORK.** It was
  switched to `main` under this session **three times** (twice by Bash-enabled review agents,
  once with no workflow running ⇒ another session shares it). Commits landed on `main` instead
  of the feature branch; recovered each time via `git reflog` + `git branch -f`.
  **Branch, then `git worktree add` immediately, and verify branch tips after every workflow.**
- 🪤 **RUN THE WHOLE SUITE, NOT YOUR FILES.** Deleting `lib/hero-video.ts` broke
  `presign-ttl-vs-resign.test.ts` — a table-driven test that read the file off disk. Three test
  files said "29 pass"; CI runs `lib/**/*.test.ts` + `app/**/*.test.ts` = **6195 tests**.
  A deletion's breakage is never in the files you edited.
- ⚠ **`readHeroRefs()` returns a HARD-CODED EMPTY SET** — the only hand-asserted "nothing
  references this" in the module, and the exact shape that deletes live files once the world
  changes. It is **machine-checked** by `apps/web/lib/website-media-retired-hero.test.ts`
  (verified to actually fail by reintroducing the module). **Restore the hero ⇒ write a real
  resolver first.**

**Measured:** 3 adversarial reviews, **82 findings attacked, 46 confirmed**. Revision 1 passed
typecheck, lint and 11 unit tests and was substantially wrong — including a `lucideName` absent
from `NAV_ICON_NAMES` that would have failed a required CI check. **Every serious defect was in
code that passed its own tests.**

## 2026-08-02 · SEO / GEO — code side DONE (4 PRs) · 2 owner actions · 1 approved-but-unshipped copy change

**No separate contract file: this section IS the record.** Triggered by the owner 2026-07-31:
*"our data is still old and the old ones never retired and it feels like my app never got SEO and GEO optimization."*

**The reframe that matters:** it *was* optimized — 6 sitemaps, `robots.ts`, **29 JSON-LD emitters**, GEO phases
G2–G5, a vendor AEO offer graph on `/v/[slug]`, a help sitemap. It was **un-maintained and un-measured**.

| | |
|---|---|
| ✅ DONE | **`llms.txt` is GENERATED** (PR [#3952](https://github.com/iscasasola/setnayan-platform/pull/3952)) — `app/llms.txt/route.ts` renders from `platform_retail_catalog_v2` + `vendor_billing_catalog`; `public/llms.txt` DELETED (`public/` shadows route handlers). Audit went **`fail 2 → 0`, `ok 0 → 2`**. Verified live. |
| ✅ DONE | **"Re-run audit now" button** + **price-literal guard** (PR [#3960](https://github.com/iscasasola/setnayan-platform/pull/3960)) — `/admin/app-performance?tab=seo` had **no control at all**; the audit only fired from `after()` in the admin layout, claim-gated ~daily, and `after()` runs post-response so the page always showed the PREVIOUS snapshot. Also fixed 2 genuinely stale customer-facing prices (monogram **₱2,499→₱1,000**, Pakanta **₱3,499→₱2,500**). |
| ✅ DONE | **The audit was grading two sources nothing else read** (PR [#3973](https://github.com/iscasasola/setnayan-platform/pull/3973)) — see traps. `lib/seo/org-same-as.ts` is now the single source. All 7 SEO env vars documented in `.env.example`; none were. |
| ✅ RESOLVED | **`Organization.sameAs` — the nag was FALSE.** The Facebook Page has shipped in the JSON-LD since 2026-07-10. **Do not create one.** Optional only: a LinkedIn Company Page (one line in `lib/seo/org-same-as.ts`, or additive env `SETNAYAN_ORG_SAMEAS`). |
| ✅ RESOLVED 08-03 | **GOOGLE NEEDS NOTHING — IT WAS ALREADY VERIFIED.** The owner opened GSC on 2026-08-03: a live `setnayan.com` property with **32 clicks charted from 05-13** and 133 indexed / 479 not-indexed pages. GSC does not render performance for an unverified property ⇒ ownership was proven long ago, almost certainly a **DNS/Domain property** (better than a meta tag: covers www + subdomains). **`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is REDUNDANT — do not set it, do not re-list it.** ⏭ **BING alone remains** (~5 min, `NEXT_PUBLIC_BING_SITE_VERIFICATION`, HTML-tag method, ⚠ `NEXT_PUBLIC_*` inlines at BUILD time so redeploy, and click Verify only AFTER the redeploy is green). 🪤 **This item claimed for weeks that no data existed. It was inferred from `seo_metrics = 0 rows` — a fact about OUR table, never about Google's.** An empty local mirror is not evidence about the upstream source. |
| 🔴 BLOCKED | **The Search Console DATA pull** — needs `GSC_CLIENT_ID` / `GSC_CLIENT_SECRET` / `GSC_REFRESH_TOKEN` / `GSC_SITE_URL` (OAuth, scope `webmasters.readonly`, obtainable via the OAuth Playground). Requires a **Google Cloud project** — and that account is **SUSPENDED**, appeal `73857927`. Until all four are set, `runSeoGscPull()` no-ops and **`seo_metrics` stays at 0 rows.** ⚠ Search Console **does not backfill** — it collects only from the verification date forward, so the meta-tag half is worth doing even while this half is blocked. |
| ⏸ NOT SHIPPED | **The Filipino-memory USP copy.** Owner approved BOTH scope questions 2026-07-31 — *full front repositioning* + *non-sectarian at the top, faith rites only on deeper pages* — and the copy was drafted, but **it never entered code.** The hero sub on `main` is still the culturally neutral `'The independent hub to keep a lifetime of memories, and plan any event, free.'` Approved copy is **§5 of [`03_Strategy/Claude_Design_Brief_2026-07-31.md`](03_Strategy/Claude_Design_Brief_2026-07-31.md)** — ⚠ that brief's **§1 palette is SUPERSEDED** (terracotta lock, 2026-08-01) but **§5 COPY is still valid**. |
| 🔴 `OWNER_DECISION` | **Seam:** the USP copy targets `/` (hero · manifesto · pillars) — and the Design Programme **explicitly excludes `/`** as the owner-approved ELN reskin. So the copy change is currently in nobody's scope. Decide: fold it into the design programme, ship it as its own copy-only PR, or drop it. |

### 🪤 Traps this stream paid for — do NOT relearn them

- **🔑 A guard comparing TWO HAND-TYPED things is not a guard.** `llms-price-drift.test.ts` asserted a hand-typed `llms.txt` matched a hand-typed fixture. Neither side ever touched the DB, so both drifted together and **CI stayed green for three weeks** while the live audit screamed `2 FAIL` daily into a surface with no button on it. **Prefer GENERATION over checking.**
- **🔑 A set-membership check cannot catch a price on the WRONG product.** "Does ₱2,499 exist anywhere in the catalog?" passed while Live Studio was sold as a **retired** Mobile/Desktop device split and Camera Bridge was advertised at `is_active=false`. Guard the **structure** (product names, tier shape), not just numbers.
- **🔑 `is_active=false` ≠ retired.** Setnayan AI tiers B/C/D are deliberately inactive **price-source** rows (`setnayan-ai-type-pricing.ts`). Filtering them out flattens the ladder to one price — the exact bug — and makes the audit report ₱899/₱499/₱99 as orphans.
- **🔑 A check pointed at a different source than the thing it describes MANUFACTURES WORK.** The audit read env `SETNAYAN_ORG_SAMEAS` (consumed by nothing) while the JSON-LD shipped a hardcoded FB Page ⇒ a daily "create FB Page" nag for a Page that already existed. And it read `GOOGLE_SITE_VERIFICATION` while `layout.tsx` renders from `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` ⇒ **no value of those vars produced both a verified domain and a green check.**
- **🔑 The verification META TAG and the Search Console DATA PULL are DIFFERENT credentials.** Verifying ownership does not grant API access. This is why `seo_metrics` can stay empty after a successful verification.
- **🪤 Split a guard across CI and runtime by what each can SEE.** CI has no prod credentials ⇒ it can only catch *new hardcoding* (`lib/public-price-literals.test.ts`); only the runtime audit sees the catalog ⇒ it catches *drift* (`runSeoHealthChecks` Check 5). Never let one pretend to do the other's job.
- **🪤 Watch a new check FAIL before trusting it.** Check 5 was verified failing (`studio-card-demo.tsx says ₱1,000 but ANIMATED_MONOGRAM is ₱1,750`) before it was believed.
- **⚠ Two scoping claims I made were WRONG and got corrected:** "19 of ~40 llms.txt figures are stale" counted the **changelog footer** (legitimately historical) — body-only it was **1**; and "~60 public files hardcode a price" counted **comments** — stripped, it is **10**, most legitimate (pillar mocks are an illustrative budget; `₱100,000` is the commission threshold; `onboarding-pricing.ts` is already fully catalog-driven). **Strip comments before counting.**
- **📈 Reference:** the acronym in this codebase is **AEO**, not APO. Its ladder ships (`lib/vendor-seo-tier.ts`) but `NEXT_PUBLIC_VENDOR_SEO_TIER_GATE` stays **OFF on purpose** — every vendor is free-tier during launch, so flipping it strips the offer graph from the whole marketplace and takes weeks to re-enrich.

---
## 2026-08-01 · DESIGN PROGRAMME — palette SHIPPED, archetypes DRAFTED, ~40 units to port (ACTIVE)

**CONTRACT:** [`WHATS_NEXT_Design_Programme_2026-08-01.md`](WHATS_NEXT_Design_Programme_2026-08-01.md) — read it before any design/UI work.
Supporting: [`03_Strategy/Design_Gap_Pass_2026-08-01.md`](03_Strategy/Design_Gap_Pass_2026-08-01.md) (the ~40-unit list) · [`03_Strategy/Public_Website_Design_Foundation_2026-08-01.md`](03_Strategy/Public_Website_Design_Foundation_2026-08-01.md) (why + frame inventory).

| | |
|---|---|
| ✅ DONE | **Colour on all 401 routes** (PR #3988) — resolves from CSS vars ⇒ 1,263 call sites, zero component edits. Locked by `apps/web/lib/palette-lock.test.ts`, **merged 2026-08-02 (PR #4030)** after a day stuck on a CI-only `noUncheckedIndexedAccess` failure. 🪤 **"auto-merge armed" ≠ "will merge" — read `gh pr checks`, not the PR state.** |
| ✅ DONE | **12 archetypes + 7 overlay types** drafted → `prototypes/archetype_*_2026-08-01.html` (5 files, ~8,900 lines). |
| ▶ STARTED | **The port — `design#1` + `design#2` DONE 2026-08-02 (PRs #4064 + #4065), do NOT rebuild.** Six-state primitives live at `apps/web/app/_components/states/` (⚠ built but **not mounted on any route yet**). 🔑 **`design#2`'s premise was WRONG**: it claimed ~55 ad-hoc dialogs; **43 of 53 already used the shipped primitives**, so the work was adoption + a guard, not new primitives. **▶ NEXT: `design#3`, the shell.** |
| ✅ GATE | **`design#0-GATE` — CLOSED 2026-08-04. The owner reviewed all 19 and approved every one, no changes.** Nothing in the programme is owner-gated any more; #4 #5 #6 #8 #9 are all open work, and #1/#2 already shipped (#4064/#4065). |

**Start with `design#1` (six-state system) + `design#2` (overlay grammar) — parallel-safe, disjoint files, no owner gate, both close live defects.**

🔑 **401 routes ≠ 401 designs.** 190 are dynamic; the big groups repeat one shape (`studio`'s 35 = ~20 instances of one SKU page). **Design the ARCHETYPE, never the screen.**
🪤 Stream traps: Empty ≠ Locked ≠ **Denied** (an RLS denial and an empty read are the same `count: 0`) · size the CTA against **CREAM not white** · **no "tech blue" exists** · the app is **LIGHT-ONLY** · marketing=top nav / app=bottom nav, never crossed · never write a literal SETNAYAN price · **the 28 existing per-surface prototypes are right about COMPOSITION but carry the OLD palette — reconcile, never redraw.**
⛔ Excluded, not gaps: `/` (owner-approved ELN reskin) · guest sites `/[slug]` · seat plan 2D/3D · the four-surface home (#3240) · typography.

---
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
| ~~**1b**~~ | ✅ **DONE 2026-07-30 — PR [#3891](https://github.com/iscasasola/setnayan-platform/pull/3891)**, migration `20271020224218`. Always-on (gate function inverted, not just the DEFAULT — the table is sparse) + the booked-vendor leg removed from both request policies; the act reads via entitlement-checked service_role. **Do not rebuild.** | — |
| ~~**1c**~~ | ✅ **DONE 2026-07-30 — PR [#3893](https://github.com/iscasasola/setnayan-platform/pull/3893)**, migration `20271020710612`. Crew + day-of grantees now read both song tables (grantee leg in SQL, NOT an admin client in props; playlist leg keeps the vendor binding); `anon` revoked off both tables; `fetchPlaylistPicks` returns `{rows, failed}` so a denied read stops rendering as a claim about the couple. **Do not rebuild.** | — |
| 3 | Join the two song-pick systems (onboarding ↔ playlist studio) | ✅ **ANSWERED** — onboarding feeds the studio ("Unsorted" tray); matcher reads both |
| 4 | Vibes per slot (artwork exists, concept does NOT) | ✅ **ANSWERED** — six names FROZEN as drawn (acoustic·classical·jazz·opm·pop·showband) |
| 5 | Sets (`vendor_event_sets`) | ✅ **ANSWERED ×2** — requests always-on (no "chosen sets" mode) · Accept ≠ filed into a set |
| 6 | Extend the slot list (Entrance / Post-Ceremony missing) | ✅ **ANSWERED** — add all three: `prelude` · `grand_entrance` · `recessional` (11 slots) |
| 7 | Guest-facing request button + guest song search | owner-DEPRIORITISED |

**Order (revised 2026-07-30):** 1 ✅ → 2 ✅ → 1b ✅ → 1c ✅ → **(6+4 together, same file
`lib/playlist.ts`)** → 3 → 5. **Every security/gap item is CLOSED; all that remains is ungated feature work.** PR 5 keys to the slot vocabulary, so 6 must land first.

⚠ **Standing correction for every policy edit here:** the exposure freeze fails on **any**
policy-predicate change, narrowing included — it fingerprints predicates and will not guess.
Regenerate `exposure-surface.baseline.txt` in the same PR and read the diff. The previously
recorded "removals never fail that guard" was wrong, and cost a red build to discover.
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
2. **Twin-prefix migrations.** `20271017100000` collided with a twin and **silently never applied** — `schema_migrations` is not proof. Allocate the prefix properly and **verify the OBJECT** in prod after merge. ⚠ This is a **DUPLICATE** prefix, which is real and CI-guarded. Do **not** generalize it into "a LOW prefix never applies" — that claim is FALSE (corrected 2026-08-04; `db push --include-all` applies out-of-order migrations). See the 2026-08-04 open-PR section below.
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
| ~~papic-promo#D~~ | ✅ **DONE 2026-07-30, PR [#3887](https://github.com/iscasasola/setnayan-platform/pull/3887)** — launcher + galleries repointed at the EXISTING `eventPapicActive()`; "5 seat links" copy gone; crew page's "five seats" derived from the roster. ⚠ face-enroll dead operand removed but **NOT widened** — it collects a selfie while the matcher is dormant, `/privacy` denies biometrics, and 0d/0e are open (§5-11). One line to widen when they close. | — | — |
| ~~papic-promo#E~~ | ✅ **DONE 2026-07-30, PR [#3890](https://github.com/iscasasola/setnayan-platform/pull/3890)** — help center rewritten + the 2 new articles (shot weights DERIVED via `papicPointCurrencyTerms()`, so the 7→8 clip move can't strand prose again); "Native iOS/Android app" killed in EN **and** Taglish; the demo tile's invented `3 / 8` cap gone. | — | — |
| ~~papic-promo#F~~ | ✅ **DONE 2026-07-30, PR [#3892](https://github.com/iscasasola/setnayan-platform/pull/3892)** — derived price anchor + Pool/One in the JSON-LD + SEO free-tier + the guest pitch finally says "Papic". 🔴 **Also caught `/papic` promising LIVE auto face-matching in 3 places, one inside the FAQPage JSON-LD.** ⛔ realstories cross-link NOT done (badges sit inside the card's own `<Link>` — invalid nested anchor). | — | — |
| ~~papic-promo#G~~ | ✅ **DONE 2026-07-30, PR [#3895](https://github.com/iscasasola/setnayan-platform/pull/3895)** — owner picked **A + B**. Tile + nudge share one resolver; `MAX_MINIS = 4` added because the bento is a budgeted 2×2 (the mockup drew 3-across). ⚠ `today`/`for-you` were retired stubs ⇒ ONE surface, not three. Mockup kept for lineage: ⏸ ~~**MOCKUPS DELIVERED** — [`06_Prototypes/Papic_Home_Presence_2026-07-30.html`](06_Prototypes/Papic_Home_Presence_2026-07-30.html) (artifact `50889ae8`). ⚠ It is **ONE** surface, not three: `today` + `for-you` are retired redirect stubs. Options: **A** bento tile (permanent) · **B** `slotAfterBento` nudge (dismissible) · **C** decisions row (⛔ argued against — Papic is a capability, not a decision). **Recommendation: A + B** — chosen.~~ | — | — |

No migrations, no new flags. A–E parallel-safe (disjoint files). Face-tagging copy law: auto-tag is DORMANT — never promise it live (spec §3-5; /privacy biometrics fix is §5-4).

**✅✅ THE WAVE IS COMPLETE — ALL 7 CLOSED 2026-07-30.** G shipped as [#3895](https://github.com/iscasasola/setnayan-platform/pull/3895) (owner picked **A + B**: a bento mini-tile + a one-time "your free camera is ready" nudge, one shared resolver, `MAX_MINIS` cap added because the real bento is a budgeted 2×2 the mockup had drawn as a 3-across). **Three of the seven premises were stale** — A, B and G — every one caught by checking the consumer / the database / the component instead of the spec (§3-0).

_(superseded status line:)_ ~~THE WAVE IS CLOSED EXCEPT G — 6 of 7 done 2026-07-30~~ (A needed no code). The one item left is
**papic-promo#G**, and it is an `OWNER_DECISION`: what shape should Papic take on the couple's home
surfaces (`dashboard/[eventId]/page.tsx`, `today`, `for-you`), which have zero Papic presence today —
a needs-decision card? a launcher tile? a one-time "your free camera is ready" nudge? Show 2–3 mockups
before building; home real estate is contested. See spec §2-G.

**⚠ THE ONE THING THAT GOT LOUDER, NOT QUIETER, AS THE WAVE PROGRESSED: §5 item 11 (gates 0d/0e).**
PR-F just promoted Papic publicly (derived price anchor + JSON-LD + SEO), which is exactly the
condition under which an undisclosed guest-media processing activity matters most. Two paragraphs of
drafting already exist at `Papic_Compliance_Delta_2026-07-20.md` §2.2 + a DPO yes/no.

_(superseded next-up pointer:)_ ~~papic-promo#D~~ (four surfaces gate on the unbuyable `PAPIC_SEATS` and so stay permanently dark for every new couple — day-of launcher · galleries card · face-enroll ×2 — plus the "share these 5 seat links" copy). **D · E · F are all open and parallel-safe**; F needs nothing from B any more. G stays owner-gated on the home-surface shape.

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

---

## 2026-08-04 · THE OPEN-PR BACKLOG — 7 stuck PRs triaged, 5 unstuck, **6 MERGED**

**Trigger:** owner — *"the what's next session was overlapped with another task… complete the
pending sessions."* Nothing here was a new feature. Every item was **work already written that
could not land**. ⚠ The first write-up of this session blamed rotted migration prefixes; that
diagnosis was wrong and is corrected immediately below. The REAL blockers were stale merge
conflicts, a guard asserting the very hold the PR releases, and three genuine defects.

### ⚠ CORRECTED 2026-08-04 — the "rotted migration" finding was WRONG

**What this section first claimed:** that 4 of 5 PRs carried a migration whose prefix had fallen
below prod's applied head, and would therefore *"merge with green CI and create nothing."*
**That is false, and it was corrected the same day, before it could mislead anyone.**

**Why:** `deploy-prod.yml:184` and `supabase-migrations.yml:203` both run
`supabase db push --include-all --yes`. `--include-all` exists precisely to apply migrations dated
before the remote head.

**Evidence — 13 data points, not inference:**
- 12 migrations were historically added out of order (each file's first-commit date diffed against
  the max prefix existing at that moment; e.g. `20271032407062` added 2026-08-02 when the head was
  already `20271033104200`). **All 12 are applied in prod.**
- The open-browse launch migration `20271102765509` was merged on 08-04 while the head was
  `20271103100614` — **two above it** — and it applied. `column_default` reads `true` in prod.

🔑 **How the error was made:** a `count(*) WHERE version = <prefix>` on an OPEN PR's migration
returned **0**, read as *"it will be skipped."* Zero was because the PR had not merged yet. The
fact was right; the consequence was invented.

🦠 **HOW FAR IT SPREAD — SIX merged migration headers, not two (counted 2026-08-04).** The false
claim is written into `20271102603681` · `20271102765509` · `20271102810371` · `20271103100614` ·
`20271104090000` · `20271106090000`, plus the emcee stream's trap list, the explore/marketplace
trap list, and `DECISION_LOG.md`'s 08-02 / 08-03 rows. **Both `20271104090000` and `20271106090000` were written by
OTHER sessions, and `20271106090000` landed AFTER the correction did** (#4084 merged 05:03 UTC;
that migration was committed 10:48 UTC. ⚠ `20271104090000` was committed 03:16 UTC — BEFORE it, by
under two hours. An earlier draft of this line claimed both postdated the fix; that was an
overstatement, caught by an adversarial check, and it is the same correct-fact/invented-consequence
shape this whole section is about), which is the
whole point: a corrected doc does not reach a session that never opened it, and a migration comment
is the one place nobody re-reads. Those migrations are APPLIED, so they are **not** edited —
**disregard every one of those headers.** The auto-loaded corpus `CLAUDE.md` is the correction.

### What IS true about a low prefix

**The PGlite replay harness applies migrations in FILENAME order** —
`apps/web/tests/db/replay-migrations.ts:268-271` is `readdirSync(...).filter('.sql').sort()`. A
low-prefixed migration that DEPENDS on an object created by a higher-prefixed, already-merged one
will fail **every** `*.db.test.ts` while prod is perfectly fine. Prod applies in merge order; the
tests apply in prefix order, and only one of those is the filename.

So allocating forward with `node scripts/new-migration.mjs` stays the right habit — for
**replay-order correctness and the UNIQUE guard**, not for "it won't apply." The prefix
re-allocations done in this session were harmless and mildly beneficial, but **not** the safety
fix they were first described as.

`check-migration-timestamps.mjs` enforces exactly two rules, neither of which is ordering: UNIQUE
prefixes, and no hand-typed `YYYYMMDD000000`. **Do not describe it as an ordering guard.**
Verifying the OBJECT after merge (`to_regclass`, `column_default`) remains correct advice — just
not for the reason first given.

### 🔴 Three real defects found, none of which was the reported problem

1. **#3659 would have WIDENED the policy it was fixing.** Written in July against
   `current_event_ids()`; prod had since narrowed that arm to
   `current_couple_or_coordinator_event_ids()`. A `DROP POLICY / CREATE POLICY` pair is a **full
   overwrite, not a patch** — replaying it verbatim would have handed **every guest** the couple's
   whole order history (amounts, reference codes) *while* fixing the vendor leak. Caught by reading
   `pg_policy` in live prod, not the migration text. Its 9 tests all passed: they seeded only
   `couple` and `coordinator`, the two member types **both** helpers admit.
2. **#3651's new table shipped OPEN TO `anon`** — RLS on, three policies all `TO authenticated`,
   but no `REVOKE`. Anon held table-level `SIUD` on vendors' quoted prices. Only the regenerated
   exposure baseline showed it (`anon=SIU`). Confirms: **`REVOKE ALL` in every migration.**
3. **#3651's `requested_by_user_id` had no foreign key at all** — `NOT NULL`, no `REFERENCES`.
   Dangling uuid on deletion, no verdict for G6 to read, table unclassifiable. It is an **actor
   stamp** → nullable + `ON DELETE SET NULL`, covered as de-identify-in-place, and now exported
   author-scoped (RA 10173 T1). It also closed a latent defect: both consumers used it only to
   address a notification, so an erased person could have been emailed.

### ✅ Landed

- **#3946 MERGED — the public `/privacy` page no longer contradicts itself.** It claimed the US
  **and** the Philippines at once; now Singapore (Supabase) + **APAC** (R2), and *"none of them is
  in the Philippines"*. **Closes owner-queue item #4.** Also fixed the propagation source: two code
  comments said *"the four PH-region buckets"* — wrong twice (there are **five**, none in PH).
  ⚠ It auto-merged: auto-merge had been armed on it by the owner's own account on 08-01, and the
  CI fix turned it green before it could be disarmed. Outcome is a live page going false → true.
- **#3659 MERGED — the couple can no longer see the vendor's booking-fee order.** Confirmed live
  in prod first; the fee is armed, so this was a live leak.
- **#3653 MERGED — open-browse LAUNCHED** (owner merged it the same day; see the verification table
  at the end of this section). Every newly-created event now ships with the guest website on.
  Carried the missing **no-backfill** test — an in-flight wedding must not reshape overnight;
  nothing had asserted the council rule before. ⏭ leaves ONE owner action:
  `NEXT_PUBLIC_WEBSITE_MENU_ENABLED`.
- **#3994 MERGED — the emcee's "My Lines".** Recorded nowhere as merged until this correction.
- **#3651 MERGED — reusable bookings.** Carried the two real defects listed above (anon-open table,
  missing FK on `requested_by_user_id`), both fixed before it landed. Also recorded nowhere until
  this correction.
- **#4084 MERGED — the correction PR itself.** ⚠ It touched exactly TWO files —
  `scripts/check-migration-timestamps.mjs` and `changelog.d/prefix-guard-ordering-note.md`. It did
  **NOT** edit any auto-loaded instruction file, and it is in a different repo from the corpus
  `CLAUDE.md` besides. Putting the correction only in a script docblock is precisely **why the
  belief kept spreading** — two more sessions wrote it into fresh migrations afterwards. The
  auto-loaded corpus `CLAUDE.md` block was added separately on 2026-08-04. Absent from every
  earlier version of this list.

### ⏭ Left for the owner

- ~~#3653 open-browse LAUNCH — green, mergeable, auto-merge deliberately OFF.~~ ⛔ **CORRECTED
  2026-08-04: #3653 IS MERGED AND LAUNCHED** — the owner merged it. It is listed under ✅ Landed
  above; this row contradicted the verification table ~30 lines below it and is retired.
- **#1180 onboarding music playlist — NOT revived. 5,382 commits behind**, 4 content conflicts in
  live files. Reviving it is a real merge job with regression risk, not a rebase. Owner call:
  redo or close.
- **#4004 CSAM hook — still a draft, all checks green.** Parked pending the owner checking whether
  Cloudflare's own tool covers known-hash matching.

### 🪤 Traps

- 🔑 **A guard you have not watched fail is not a guard.** Every new test here was verified red
  before being trusted — re-widening the helper turns the new guest test red, restoring it green.
- 🪤 **Your own suite passing means you seeded the cases you were already thinking about.** The
  first version of #3659's narrowing keyed purely on membership and passed 10/10 — while breaking
  host visibility of **account-less guest purchases** (`user_id IS NULL`). CI's
  `papic-guest-orders.db.test.ts` caught it, a test written precisely to catch a future narrowing
  of that arm. It worked.
- 🪤 **The exposure baseline is a conflict magnet and re-conflicts every time a sibling merges.**
  Take main's version, then **REGENERATE**. Never hand-merge a generated file.
- 🪤 **Local `tsc` OOMs (~7 GB) — CI is the only typecheck.** Do not read a crashed run as clean.
- 🪤 **A fresh worktree with no `node_modules` silently resolves to the home-dir checkout** and
  fails with `MODULE_NOT_FOUND`. `pnpm install` first.
- **Housekeeping:** 11 merged worktrees pruned, **13.7 GB** reclaimed.

### ✅ 2026-08-04 — OPEN-BROWSE IS LAUNCHED (owner merged #3653)

Verified in prod after `deploy-prod` went green:

| check | result |
|---|---|
| `events.website_open_browse` `column_default` | **`true`** ✅ |
| launch migration `20271102765509` applied | yes ✅ (and it applied **out of order**, two prefixes below the head — the direct disproof of the claim above) |
| existing events backfilled? | **NO** ✅ — 4 of 5 still `false`; only the sample (`maria-and-jose`) is `true`, and it opted in earlier |
| live sample guest site | HTTP 200, browse menu renders |

⏭ **THE ONE REMAINING OWNER ACTION: `NEXT_PUBLIC_WEBSITE_MENU_ENABLED`.**
`siteMenuEnabled()` returns `opts.isSample || opts.flag === 'true'`. The sample event forces the
menu ON, which is why the live check above looks right — **it proves nothing about real events.**
`site-body.tsx` is a SERVER component, so the value never reaches the browser bundle and **cannot
be read from outside**; it has to be checked in the Vercel dashboard. If it is not `'true'`, every
newly-created event now ships the open-browse site **with no menu to browse it**.
⚠ `NEXT_PUBLIC_*` inlines at BUILD time — set it, then **redeploy**.
