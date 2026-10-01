# Cloud prompts — Thursday account, 2026-10-01 (controller)

**Why this file:** the builders the controller started at ~14:10 PHT ran on the owner's Mac, not in the cloud (the Agent tool's "remote" option ran them locally). Each one pushed its work-in-progress to a branch with a `docs/PROGRESS_*.md` note. These prompts continue those branches in **real cloud sessions** (Claude app → New session → Cloud → repo iscasasola/setnayan-platform → pick the model shown → paste ONE block).

Credit plan: 5 sessions (C1–C5) ≈ the $250. Model per session is chosen to spend Opus only where it pays (database, money, Maker, multi-file features).

## §0 · COMMON RULES (every cloud builder reads this section first)
READING THE SPECS: a cloud session can only attach iscasasola/setnayan-platform. The specs repo is PUBLIC — read any file over HTTPS, read-only: `curl -sL https://raw.githubusercontent.com/iscasasola/Setnayan-specs/main/<path>` (DECISION_LOG.md, BUILD_PROMPTS_THU_2026-10-01.md, INTERACTION_RULES.md, CONTROLLER_QUEUE.md, prototypes/<name>.html …). Never try to attach or push to the specs repo.
You are a builder in iscasasola/setnayan-platform (Next.js monorepo, apps/web). Read CLAUDE.md at the repo root and obey it. Read (via the raw URLs above) INTERACTION_RULES.md (one way to ask/choose/navigate/search/do; two looks) plus every DECISION_LOG row named in your prompt before coding. Install node_modules before trusting tsc/tests (a tree without them "passes" while resolving nothing).
RULE 0: find and extend what exists — open the named shipped files first; never a second registry, resolver or mechanism; a flag/filter flip beats new schema. Plain English; "Event Hub" never "website"; "supplier" never "vendor" in UI copy; no casual greetings on guest pages; 3+ choices = ONE PickMenu dropdown, never a pill row; no "edit elsewhere ↗"; Pro is ◆ and never blocks trying; no confirm dialogs unless destructive. Phone first (390 px): title ≤5 words + one line ≤12 words, details behind ⓘ, first real thing in the top third.
BUDGETS (all at the ceiling — measure before/after, never raise): shared client bundle ≤206,848 B (apps/web/scripts/check-bundle-size.mjs — ~18 B spare: server components, lazy-load at the tap); Maker first load ≤517,120 B (scripts/check-maker-js-budget.mjs, needs a production build; CI's "bundle size check" job also runs it); server actions ≤1225 (scripts/lint-server-action-budget.mjs — NO new exported "use server" function without retiring one; add an intent branch to an existing action or use a route handler). Migrations only via `pnpm migration:new`, RLS at CREATE TABLE, pipeline only — never apply to prod; if you touch supabase/migrations the Ugat map must keep up (UGAT_TYPES in lib/ugat/graph.ts, claims; or one reasoned line in tests/db/ugat-concept.baseline.txt). Regenerate generated baselines with their generators, never hand-merge.
CHECKS from apps/web: typecheck, lint, every `node scripts/lint-*.mjs` step in .github/workflows/ci.yml, the touched tests (bracketed paths file by file — a bracketed glob matches nothing and passes). Every rule you add gets a guard; sabotage-check each guard once (revert the fix → RED → restore) and say so in the PR. Changelog fragment only: changelog.d/<branch>.md with a SPEC IMPACT line (CHANGELOG.md/STATUS.md untouched).
CONTINUING A BRANCH: check out the named branch, read its docs/PROGRESS_*.md first, then the spec. Merge origin/main into it if behind (keep history). Delete the docs/PROGRESS_*.md file (and any docs/FEATURE-BRIEF.md) in the last commit before `gh pr ready`.
CREDITS: don't fan out helper agents; one builder per session. Don't re-run the full unit suite more than once; let CI be the gate for the slow jobs.
PR ROUTINE: `gh pr create --base main --draft`; then `gh pr edit <n> --add-label do-not-auto-merge`; when every check is green `gh pr ready <n>`; then `gh pr view <n> --json autoMergeRequest` and if not null `gh pr merge <n> --disable-auto`. Never merge, never `gh pr merge` without --disable-auto, never --admin. Final report: PR number · what moved · bundle/Maker/action numbers before and after · a 3-step phone check card (link · 3 taps · what the owner should see).

---

## C1 · P2 onboarding engine — model **Opus**
```
Read §0 of Setnayan-specs/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md and obey it. Continue branch rd/onboarding-engine. Spec: Setnayan-specs/BUILD_PROMPTS_THU_2026-10-01.md section "P2 — Event onboarding engine" (read it in full). changelog.d/rd-onboarding-engine.md — SPEC IMPACT: None.
```

## C2 · P5a admin "do it from admin" — model **Opus**
```
Read §0 of Setnayan-specs/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md and obey it. Continue branches rd/admin-do-it-from-admin (money: Record a payment received + receiving accounts become a list) and then rd/admin-do-it-from-admin-2 (data export for someone else, supplier record page, digest last-sent, rows 25/22/31/37) — one PR each, in that order, one at a time. Spec: Setnayan-specs/BUILD_PROMPTS_THU_2026-10-01.md section "P5 — Admin step 5" part P5a + the "P5a addendum" at the bottom; DECISION_LOG 2026-10-01 "ADMIN APP + EVENT HUB PER TYPE — OWNER ANSWERS" (Confirm only when Setnayan AI matched amount + reference) and "\"REOPEN GUEST LIST\" STAYS IN ADMIN ON THE PHONE". Do NOT do the vendor→supplier admin string sweep or Ugat→Setup (that is P5b, later). Receiving-accounts list: find where today's BDO/GCash fields live first; a list inside an existing settings home beats a new table; checkout must still work with an empty list.
```

## C3 · P3 supplier inbox + Find a supplier — model **Opus**
```
Read §0 of Setnayan-specs/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md and obey it. Continue branch rd/supplier-inbox-and-find. Spec: Setnayan-specs/BUILD_PROMPTS_THU_2026-10-01.md section "P3 — Supplier inbox + Find a supplier by event type". A wedding's supplier list must stay exactly as today. Expect to rebase lib/ugat/graph.ts if P2 lands first.
```

## C4 · P4 supplier phone app — model **Opus**
```
Read §0 of Setnayan-specs/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md and obey it. Continue branch rd/supplier-app-simple. Spec: Setnayan-specs/BUILD_PROMPTS_THU_2026-10-01.md section "P4 — The supplier phone app" + DECISION_LOG 2026-10-01 "THE SUPPLIER PHONE APP — APPROVED, WITH THE THREE RECOMMENDED ANSWERS": Messages lives in More (bar Today · Customers · Shop · More; Insights + Event Hub + Messages in More) · "Run the day" is a Next card on event days · + on Customers adds an outside client (find the shipped way suppliers record an off-platform client first; if none exists, stop and report what is needed rather than inventing schema).
```

## C5 · P10 /features hub + one page per feature + search tagging — model **Sonnet**
```
Read §0 of Setnayan-specs/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md and obey it. Continue branch rd/features-pages (read docs/FEATURE-BRIEF.md + docs/PROGRESS_*.md on it). Spec: Setnayan-specs/BUILD_PROMPTS_THU_2026-10-01.md section "P10" slices (c) + (d) and the P10 addenda on tagging + "what makes it different / works with the rest of Setnayan". NOT in this PR: (a) sidebar collapse, (b) label sweep, (e) Try-it sample events, the /blog regroup. Server components only; one dynamic route /features/[slug] (+ app/tl twin) — check the route-budget guard; prices only from platform_retail_catalog_v2; only what ships (extend features-page-says-what-ships.test.ts).
```

## C6 · Font dropdown (#6160) — NOT NEEDED as a cloud session
The merge with main was finished before the stop; the controller pushed it to #6160 (a343bdc9e) and GitHub CI is the gate. Only if CI fails will it need a session.

## C7 · Palette styles — NOT NEEDED as a cloud session
Merge with main finished before the stop; the controller opened draft PR #6226 from rd/palette-styles-merge and GitHub CI is the gate.

## C8 · Venue styles (3 looks for the venue scene) — model **Opus**
```
Read §0 of https://raw.githubusercontent.com/iscasasola/Setnayan-specs/main/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md (curl it) and obey it. New branch rd/venue-styles off origin/main. Spec: DECISION_LOG 2026-09-30 "VENUE STYLES APPROVED" (read in full) + design prototypes/venue_styles_2026-09-30_fable.html (+ .png): three looks for the venue scene — Photo card (default = today's look, so live pages don't change) · Full photo · The journey — picked with the scene's existing Style ▾ (the shipped scene-styles registry from #6156/#6187; never a second picker). Extend the shipped venue cards (#6185-era "venue cards readable with photos": venue photo from the booked supplier's photos, ≥4.5:1 text). Maker budget ~514 KB / 517,120 B with other Maker PRs in flight — styles are CSS + server-rendered markup; find bytes at the source if over. The ten THEMES are frozen until after the Apple check — don't change any theme. Don't touch type-in-place.tsx or font pickers (other PRs). One PR, PR routine per §0.
```

## C9 · Pro themes open to every event type (still Pro) — model **Sonnet**
```
Read §0 of https://raw.githubusercontent.com/iscasasola/Setnayan-specs/main/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md (curl it) and obey it. New branch rd/pro-themes-every-type off origin/main. Spec: DECISION_LOG 2026-10-01 "PRO THEMES OPEN TO EVERY EVENT TYPE (STILL PRO) · ONBOARDING PRE-SELECTS A FREE THEME" — do part (1) only: today the Pro themes are offered to weddings only; offer them to every event type, still Pro (◆, never blocking trying; Apply asks to pay). Find the wedding-only gate first (grep lib/invite-themes.ts, lib/hub-look-pro.ts, the theme picker and any event-type filter) and flip it — no theme itself changes (the ten themes are frozen until after the Apple check). Part (2), onboarding pre-selecting a free theme, is in the onboarding PR (C1) — don't do it. Guard: a birthday / hangout / wake can pick every Pro theme; sabotage-check. One PR, PR routine per §0.
```

## C10 · The simplified Event Hub Maker (Maker core part 3) — model **Opus**
```
curl -sL https://raw.githubusercontent.com/iscasasola/Setnayan-specs/main/CLOUD_PROMPTS_CONTROLLER_2026-10-01.md — read §0 and obey it, then do this. New branch rd/maker-simple-top-menu off origin/main.
SPEC (read all, via raw URLs): DECISION_LOG 2026-09-30 "THE MAKER RE-PLAN IS CUT TO ITS CORE" (what is KEPT: instant editing · tap-to-type + Wording ▾ + Format ▾ · the top menu (Details | stages | Prints) with a slim Details · the RSVP stage · one font dropdown · Theme sets background + fonts + colours — and everything REMOVED: Search, Quick setup, presets, Opening strips, Mood Board rebuild, Logo extras, palette animation, Prints reorganisation), "THE MAKER IN 4 IS A DIRECTION, NOT A COUNT" (the test: a first-time host understands what to do; often-used controls may stay visible), "APPROVED — THE MAKER RE-PLAN PROTOTYPE v2…" (only the parts the cut kept); MAKER_REPLAN_PLAN_2026-09-30.md; designs prototypes/maker_in_four_2026-09-30_fable.html (+ .png) and prototypes/maker_replan_2026-09-30.html.
RULE 0 FIRST (paste the inventory into the PR body): much of this already shipped — the Page ▾ dropdown (#6181), the Stage D event menu (#6187), the RSVP stage, tap-to-type + Wording/Format ▾ (#6209), names/date wait for Apply (#6230), one font dropdown (#6160), palette styles (#6226), venue styles (#6239 if merged), Both view (#6164). Open app/dashboard/[eventId]/website/editor/** and app/dashboard/[eventId]/launch/** and list: what exists · what's missing vs the kept list · the delta. Build ONLY the delta.
LIKELY DELTA (confirm by reading): (1) ONE simple top menu in the Maker: Details | the stages (Invitation · RSVP · The Day · Post Event, as one dropdown on phone) | Prints — replacing whatever crowded toolbar/tab row is there now; (2) a SLIM Details (only what isn't edited by tapping the page: who · when · where · theme; everything else lives on the page or its stage); (3) Theme = ONE pick that sets background + fonts + colours together (the theme's own defaults; the couple can still override each after). The ten themes are FROZEN until after the Apple check — never change a theme itself, only how picking one applies it.
LIMITS: Maker first load ≤517,120 B (main ~514,130 B — find bytes at the source if over; CI's bundle job measures); shared bundle ~22 B headroom — no new async chunk outside the Maker; server actions 1225 — none new (hubDraftAction carries patches). Every edit stays instant and waits for Apply. Phone 390 first, desktop same structure. Don't touch app/onboarding/** or the supplier pages.
TESTS: a guard that the Maker's top level offers exactly Details · stages · Prints (count, per component); a guard that picking a theme writes background + fonts + colours in ONE draft patch; sabotage each. One PR (split into two if large: top menu + slim Details, then theme-sets-all). PR routine per §0; report with a 3-step phone check card.
```
