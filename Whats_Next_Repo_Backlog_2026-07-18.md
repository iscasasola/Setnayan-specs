# WHATS_NEXT — Repo Backlog Register (2026-07-18) · the "repo axis" of the orchestration

> **What this is.** A **supporting register** for [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) (link me from its §5 "Supporting" row). The index is doc-centric — it registers the five 2026-07-18 "What's Next" docs. This file supplies the **other axis**: the actual, verified **code-repo backlog** — every open PR, every merged-but-flag-dark feature, and every owner launch-gate — plus the **repo-specific gap/serialize rules** an autonomous "run it all" session must obey.
>
> **Provenance.** Built from a 5-agent discovery+gap sweep (2026-07-18), then **ground-truthed live**: `gh pr list` confirmed **29 open PRs (18 ready · 11 draft)**, all matching the inventory. Flag-dark + owner-gate rows are grep/`OWNER_ACTIONS.md`-derived and stable.
>
> ⚠ **SNAPSHOT — the open-PR list is volatile** (main moves fast). **Re-run `gh pr list --state open` before acting.** Obey the index's §1 safety rules and §2 worktree rules; this register only classifies and sequences.

---

## A. Canonical checkout — index §7.1 gap **RESOLVED** (verified 2026-07-18)

The true canonical is **GitHub `github.com/iscasasola/setnayan-platform`** — all local dirs are clones of it; all PRs/merges land there. Locally there are **three independent clones** (they do NOT share git objects, so a branch in one is invisible to the others):

| Local clone | State | Role |
|---|---|---|
| **`/Users/icecasasola/Documents/Claude/Projects/setnayan-platform`** | hosts the live worktree fleet (~10 `claude/*` worktrees incl. `setnayan-pr1`, `…-wt-paymongo`, `…-wt-silid`, `…-wt-3d-*`) | ✅ **USE THIS as the working clone** — `git -C … worktree add` here |
| `/Users/icecasasola` (home root) | separate clone on `main`; migrations at `/Users/icecasasola/supabase/migrations/` | secondary; a Front-Desk doc cited it — don't split work across clones |
| `/Users/icecasasola/setnayan-platform-recovered` | separate clone on a feature branch | secondary ("recovered"); a Featured-Weddings doc cited it |

**Rules for the orchestrator:**
1. **Pick ONE clone — the Projects clone above — and add every worktree off it.** Worktrees only share within a clone; mixing clones = duplicate/lost work.
2. **Cross-clone "did we already build X?" checks MUST go through GitHub** (`gh pr list`, `gh pr view`), never local `git branch` — the clones don't see each other's branches.
3. Layout: git-root holds BOTH `apps/web/` and `supabase/migrations/` (migrations are repo-root, not under `apps/web`).

---

## B. Open-PR backlog (29 · verified live)

`gate` uses the index §1 vocabulary. `parallel_safe:no` ⇒ shares files/migration-seq/flag with a sibling → serialize.

### B1. Autonomous-safe — mergeable after review+verify (no gate)
These are the **only** items an orchestrator may advance without a human decision. Each still needs `tsc`+lint+build green and a live check.

> ⚠ **STATUS DECAY — verified 2026-07-19 vs `origin/main@2eb35144`:** none of the 10 PRs below is cleanly mergeable anymore. **CONFLICTING (need rebase first):** #3194 · #2788 · #2608 · #1725 · #1987 · #3151 · #1180 (and #3151 + #1180 *also* have a failing check). **MERGEABLE but BLOCKED on failing required checks:** #3057 · #1472 · #2431. Treat "mergeable after review+verify" as "rebase/fix-CI, then review+verify" for every row; the table itself is kept as-written for the what/watch-out content.

| PR | What | Watch-out |
|---|---|---|
| [#3194](https://github.com/iscasasola/setnayan-platform/pull/3194) | recurrence "Plan next year" clones event forward | verify no migration collision |
| [#3151](https://github.com/iscasasola/setnayan-platform/pull/3151) | generic checklist fallback (typeless event types) | small, clean |
| [#3057](https://github.com/iscasasola/setnayan-platform/pull/3057) | Postgres rate-limiting + timing-safe secret compares | pure hardening |
| [#2788](https://github.com/iscasasola/setnayan-platform/pull/2788) | Ugat Console live entity map (admin, slice 1) | admin-only |
| [#2608](https://github.com/iscasasola/setnayan-platform/pull/2608) | vendor "My Shop" website card personalization | cosmetic; serialize vs #3399 if same components |
| [#1725](https://github.com/iscasasola/setnayan-platform/pull/1725) | "payment under review" on remaining buy pages | UI state only, no money movement |
| [#1472](https://github.com/iscasasola/setnayan-platform/pull/1472) | disable browser zoom app-wide (native feel) | **re-verify the seat-plan-canvas zoom exception** post-merge |
| [#1180](https://github.com/iscasasola/setnayan-platform/pull/1180) | onboarding background-music playlist + admin view | **oldest PR (2026-06-09) — rebase first, likely stale** |
| [#2431](https://github.com/iscasasola/setnayan-platform/pull/2431) | Papic Tier-2 auto-reframe (subject_center) | **Papic-pipeline → serialize with `claude/papic-v3-pr3`; merge #2431 FIRST, then rebase the v3 branch** |
| [#1987](https://github.com/iscasasola/setnayan-platform/pull/1987) | studio-only full-bleed Monogram Maker | **serialize with Monogram Studio v2 (same flag/components); decide v1-vs-v2 target first** |

### B2. Gated open PRs — build/verify OK, but do NOT merge-to-activate without the gate
| PR | What | Gate |
|---|---|---|
| [#3399](https://github.com/iscasasola/setnayan-platform/pull/3399) | vendor auto-reply Phase 2 (deterministic engine) | `FLAG_FLIP_PROD` (`NEXT_PUBLIC_VENDOR_AUTOREPLY_V1`) + owner §9 sign-offs + single-tenant isolation verify |
| [#2562](https://github.com/iscasasola/setnayan-platform/pull/2562) | website manual/auto launch mode + host bar | ties to `WEBSITE_PHASES_ENABLED`; serialize with public-routing items |
| [#2410](https://github.com/iscasasola/setnayan-platform/pull/2410) | Papic walk-up self-register (anon capture) | `FLAG_FLIP_PROD` + `DPO_COUNSEL` (anon-capture consent/retention) |
| [#2377](https://github.com/iscasasola/setnayan-platform/pull/2377) | vendor per-guest delivery scanning | `DPO_COUNSEL` (vendor↔guest exposure + RLS); shares the vendor-guest-data gate |
| [#2374](https://github.com/iscasasola/setnayan-platform/pull/2374) | homepage 5-focus reframe (Phase 1) | `OWNER_DECISION` (brand) — **deploys LIVE on merge** |
| [#2294](https://github.com/iscasasola/setnayan-platform/pull/2294) | owner all-services comp grant | `OWNER_DECISION` — reconcile vs shipped founder-seats comp (#3324); may be redundant → close |
| [#1690](https://github.com/iscasasola/setnayan-platform/pull/1690) | Panood broadcast lifecycle (P1 web half) | owner infra (YouTube/OBS) + `PANOOD_STREAMING` flags |
| [#1689](https://github.com/iscasasola/setnayan-platform/pull/1689) | full Alaala pillar (orb/story/clip pipeline) | `FLAG_FLIP_PROD` (`NEXT_PUBLIC_LIFE_STORY`) + Alaala PR-5; serialize the flag |

### B3. Draft chains — owner/counsel-blocked at the ROOT (never batch)
- **Admin account-access program (STRICT LINEAR):** [#2048](https://github.com/iscasasola/setnayan-platform/pull/2048) audit-trail *(root; autonomous-safe once un-drafted)* → [#2056](https://github.com/iscasasola/setnayan-platform/pull/2056) consent-to-fix CORE → fan-out [#2058](https://github.com/iscasasola/setnayan-platform/pull/2058)/[#2075](https://github.com/iscasasola/setnayan-platform/pull/2075)/[#2070](https://github.com/iscasasola/setnayan-platform/pull/2070)/[#2078](https://github.com/iscasasola/setnayan-platform/pull/2078) → [#2068](https://github.com/iscasasola/setnayan-platform/pull/2068). **BLOCKER gap:** merging any child before #2056 ships act-as / two-admin code with no consent handshake underneath. Only #2048 is eligible now; the rest are owner-review + `DPO_COUNSEL`.
- **Gift program (3-PR):** [#2027](https://github.com/iscasasola/setnayan-platform/pull/2027) fulfillment bridge → … → [#2042](https://github.com/iscasasola/setnayan-platform/pull/2042) request-a-review. Root-blocked on an `OWNER_DECISION` (gift/comp policy); serialize #2027 before #2042.
- **[#3150](https://github.com/iscasasola/setnayan-platform/pull/3150) (draft)** keep free "% match" preview when AI paywall ON — **mislabeled autonomous-safe;** it depends on the (owner-gated) `SETNAYAN_AI_PAYWALL_ENABLED` decision. Land only as dead defensive code with a paywall-ON test, or hold.
- **[#3146](https://github.com/iscasasola/setnayan-platform/pull/3146) (draft)** PayMongo automated gateway — **contradicts the locked V1 "manual apply-then-pay, 0% commission" model** + blocked on business-identity gate + no PayMongo keys. `OWNER_DECISION` (activate automated gateway).

---

## C. Merged-but-flag-dark features (flip-to-activate) — **never flip a public flag autonomously**

Each is built + merged, sitting behind a default-OFF flag. Activation is a **human** call (index §1 `FLAG_FLIP_PROD`). Grouped by what unblocks them:

- **Policy-LOCKED OFF — do NOT flip:** Public API `PUBLIC_API_ENABLED` (V1 forbids public endpoints); Vendor-tier gates `VENDOR_FAVORITES_SUBSCRIPTION_GATE`/`VENDOR_TIER_FEATURE_GATE`/`VENDOR_TIER_SEARCH_GATE` (must stay OFF during free-during-launch).
- **Owner revenue/policy decision pending:** `SETNAYAN_AI_PAYWALL_ENABLED` (₱499 charge), `NEXT_PUBLIC_PAYMENT_GATED_LOCK_ENABLED` (deposit-on-lock), `NEXT_PUBLIC_PLAN3D_BOOTH_ADS`/`_SHOWCASE`/`_DEMO_ADS` (in-venue ads), `NEXT_PUBLIC_SMART_SORT_ENABLED` (changes locked sort ladder), Camera Bridge `NEXT_PUBLIC_CAMERA_BRIDGE_ENABLED` (₱499/day SKU).
- **Counsel/DPO gate:** Faith-aware person graph (`NEXT_PUBLIC_PEOPLE_CONNECTIONS`/`_DEPENDENT_PEOPLE`/`_STEWARDED_ACCOUNTS`/`_PERSON_LIFE_STORIES`), Biometric account face-profile + device-fingerprint (`NEXT_PUBLIC_ACCOUNT_FACE_PROFILE_ENABLED`/`_DEVICE_FINGERPRINT_ENABLED`), Bazi birthdata (`NEXT_PUBLIC_BAZI_BIRTHDATA_ENABLED`), Vendor day-of Papic capture (`VENDOR_PAPIC_CAPTURE_ENABLED`), Anon walk-up capture (`NEXT_PUBLIC_PAPIC_SEAT_ANON_ENABLED`).
- **Owner sign-offs pending:** Fake-inquiry protection + token settlement (`NEXT_PUBLIC_INQUIRY_GATE_ENABLED`/`_LEAD_TRUST_BADGE_ENABLED`/`_LEAD_TOKEN_HOLD_ENABLED` — 4 sign-offs + needs Proposal-Maker view-tracking).
- **Owner infra needed first:** Panood streaming (`NEXT_PUBLIC_PANOOD_STREAMING_ENABLED`/`_CAM_ANON_ENABLED` — YouTube/OBS), 3D shared room (`NEXT_PUBLIC_PLAN3D_SHARED_ROOM` — Realtime capacity), OAuth social login (`NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED`/`_APPLE_ENABLED` — provider wiring), Offline daemon (`NEXT_PUBLIC_OFFLINE_DAEMON_ENABLED` — smoke test), Anon-draft onboarding (`NEXT_PUBLIC_ANON_ONBOARDING_ENABLED` — Supabase anon-auth + Turnstile + DPO), Public URL nesting cutover (`NEXT_PUBLIC_U_NESTING_CUTOVER` — data migration).
- **Owner "just flip it" (built, low-risk, awaiting go):** Monogram Studio v2 `NEXT_PUBLIC_MONOGRAM_STUDIO_V2` (owed Android touch-pass), Suite `NEXT_PUBLIC_SUITE`, Onboarding V2 brief `NEXT_PUBLIC_ONBOARDING_V2_BRIEF_ENABLED`, Pabuya e-gift `PABUYA_PUBLIC_ROUTE_ENABLED`, Save-the-Date reveal `NEXT_PUBLIC_STD_REVEAL`, the minor UX experiment cluster (`NEXT_PUBLIC_EXPERIENCE_QUIZ_ENABLED`/`_SETNAYAN_AI_COCKPIT`/`FEATURE_ACCOUNT_AUTOSURFACE`/`NEXT_PUBLIC_REGISTER_GATES_ENABLED`/`SETNAYAN_DEMO_MODE`).

⚠ **Flag-ownership collision:** `NEXT_PUBLIC_REGISTER_GATES_ENABLED` is claimed by BOTH the anon-onboarding hardening AND the "minor experiments" cluster. Assign it to anon-onboarding (its hardening dep); don't let two items flip it.

---

## D. Owner launch-gates (hard blockers — infra/env/business, not code)

A code session **cannot** satisfy these; surface them, don't attempt them.

1. **4 crypto secrets in Vercel** — `ENCRYPTION_KEY`, `CRON_SECRET`, `OAUTH_REFRESH_CRON_SECRET`, `INTERNAL_WORKER_SECRET` (originals leaked via PR #291). OAuth-decrypt + all cron endpoints 401 until set. **Prereq for OAuth + any cron/encryption feature (token settlement, retention sweep, papic-fullres-drop).**
2. **Business identity + payment accounts** — real business name + TIN (placeholder `000-000-000-000` is LIVE), BDO + GCash details, merchant QR images. No order or BIR receipt exists until filled. **Prereq for #3146 PayMongo.**
3. **R2 CORS + `R2_PUBLIC_URL`** — every browser upload + public image (incl. Papic/Patiktok) fails without it.
4. **`dpo@setnayan.com` routes to a real inbox** — RA 10173 requires reachability before any PII is collected.
5. **`RESEND_API_KEY`** — no automated email (payment instructions, vendor messages, reel-ready, security alerts, gift notifications) until set. **Soft dep for every notify-bearing feature.**
6. **Supabase JWT expiry bump** (persistent login) · **Sentry DSN + PostHog keys** (0035 observability dormant until set).

---

## E. Repo-axis gap & serialize rules (the "check gaps" half — 15 findings distilled)

**Mutex / serialize (never in the same parallel wave):**
- **Any two migration-bearing branches** — Supabase timestamped migrations collide; the pre-push hook rejects round `YYYYMMDD000000`. Merge one, re-fetch `origin/main`, then the next. (Affects #3194, #3057, #2048, URL-nesting cutover, etc.)
- **Papic pipeline** — `claude/papic-v3-pr3` (paused) ↔ #2431 ↔ vendor day-of capture. Merge #2431 first, rebase the v3 branch after.
- **Monogram** — #1987 ↔ Monogram Studio v2 (same flag/components).
- **`NEXT_PUBLIC_LIFE_STORY`** — #1689 Alaala build ↔ the Life-Story flag-flip (single-owner flag; finish PR-5 first, then flip).
- **Public couple-website/routing** — #2562 ↔ URL-nesting cutover ↔ #2374 homepage (do the cutover isolated, then #2562, then #2374).
- **Vendor dashboard** — #2608 ↔ #3399 if same components; keep the 3 vendor-tier gates OFF throughout free-during-launch.

**Serialized dependency chains:** admin account-access (#2048→#2056→fan-out→#2068) · gift (#2027→#2042). Never advance a child before its parent ships.

**Do-NOT-autonomously-do:**
- **Flip any public flag** without a per-flag owner instruction in chat (§C). Split "policy-locked OFF" from "owner-decision-pending".
- **Action `COWORK_INBOX.md` rows** — the [PENDING] sync mandate is RELAXED and iteration specs are GUTTED stubs; walking it risks re-writing retired prices/SKUs (Setnayan AI ₱499 one-time is canonical, NOT ₱1,499/₱3,999; monogram ₱999; Camera Bridge ₱499/day). Live code + `AS_BUILT_GROUND_TRUTH` win.
- **Merge #3316's stale table-delete fix** — the seat-plan editor was rewritten (#3051-#3120); reproduce on main first, else close as superseded.
- **Un-draft #3150 / advance #3146** — both owner/decision-blocked (see B3).

**Reconcile (contradictions):** #2294 owner-comp vs shipped founder-seats comp (may be redundant → close) · #3146 PayMongo vs locked V1 manual-reconciliation model.

---

## F. Suggested safe execution waves

1. **Wave 1 (autonomous, parallel across disjoint files):** the §B1 gate-free ready PRs — but **each migration-bearing one serialized** and the Papic/Monogram overlaps serialized. Start with the truly-isolated: #3151, #3057, #2788, #2608, #1725, #1472 (verify seat-plan exception). Rebase #1180 before touching.
2. **Wave 2 (serialized singles):** #2431 (then rebase+PR the paused `claude/papic-v3-pr3`) · #1987-vs-v2 reconcile · #3194 (migration) · un-draft #2048 (migration, root of admin chain).
3. **Human queue (route, don't execute):** every §B2/§B3 gate, every §C flag flip, every §D owner action. **Batch the DPO/counsel items into ONE packet** (person-graph, biometric, Bazi, vendor Papic capture, anon capture, vendor delivery, admin account-access).
4. **Continuous:** run the index §4 gap-checks; fix doc-vs-code drift and orphaned surfaces via PR (auto-OK if gate-free), flag the rest.

---

## G. Cross-reference

Pairs with [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) (operating manual + doc register) and the five 2026-07-18 What's-Next docs it lists. This register is the **repo axis**; the index is the **doc axis**. Together they are the full "what's next" surface. Re-verify §B against `gh pr list` before any run.
