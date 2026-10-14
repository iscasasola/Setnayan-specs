# HANDOFF — Thu 15 Oct 2026 ~00:30 PHT · the old account hit its SESSION LIMIT (resets 3:20 am) — START HERE

Owner, verbatim: *"continue building until 98% and document everything so we can transfer to a new account"* ·
*"Make sure we can continue our builds on the new account"*.

**Live:** `4b2bc68` (card-fields live fix #6534 on top of batch 6 #6531). Check:
`curl -s https://www.setnayan.com/api/health`.

**Every in-flight branch is on GitHub** (pushed 15 Oct 00:20, local = remote verified for all 15). Each
worktree is at `~/Documents/Claude/Projects/<worktree>`; if a worktree is gone, `git worktree add
~/Documents/Claude/Projects/<wt> <branch>` from any checkout. Read `COMMON-BUILDER-BRIEF.md` (same folder) and hand
it to every builder. Rulings: corpus `~/Documents/Claude/Projects/Setnayan/DECISION_LOG.md`, rows dated 2026-10-14
(all pushed). Builders' own notes: `handovers/<name>.md` and `handovers/inflight-2026-10-15/`.

## 0 · Before restarting builders — the Mac
- Background lock waiters and requeue scripts from the dead builders may STILL be running (they run preflights with
  nobody to read them). Look: `~/Documents/Claude/Projects/heavy-lock.sh status`. Their logs are in
  `controller-2026-10-12/<build>/` — read them instead of re-running. Kill a waiter only if its builder is gone
  (`ps -axo pid,etime,command | /usr/bin/grep "[h]eavy-lock.sh acquire"`); a held lock older than 1 h is stale.
- Known still-running watchers: `supplier-easy-3/scripts/requeue.sh` (runs se3's db test + whole preflight, then
  stops — it does NOT push) · `supplier-easy-4/scripts/requeue-preflight.sh` (re-queues se4's preflight after the two
  live fixes held the lock). Their logs: `supplier-easy-3/requeue.out`, `supplier-easy-4/requeue.log`.
- The heavy lane is the bottleneck (~30 min per whole preflight, ~10 queued tonight). **LIVE FIXES FIRST** — the queue
  is strict FIFO by ticket name and cannot be reordered safely (renaming a ticket strands its waiter); ask feature
  builders to drop their waiting ticket and re-queue after the live fix has held the lock.

## 1 · LIVE FIXES — ship each ALONE on green (owner's go already given)
| Branch (worktree) | State | Next |
|---|---|---|
| `rd/march-drag-keeps-everyone` (wt-march-keep) | fix + property guard committed (d24aa957a2: a drag never loses or doubles anyone, drop/draft/Undo) | walk (`walk:march-keep`) → whole preflight → draft PR + label → CI → release |
| `rd/reply-back-320` (wt-rsvp-open-close) | fix committed (dfb2c4e411: under 600 px tall the reply page's bottom bar stays in the page); 519/519 reply tests, quick preflight clear | 320/375 Back walk (Chromium + WebKit) → whole preflight → draft PR + label → CI → release |
| `rd/stage-size-resizes` (wt-stage-size) | **NOTHING BUILT** — the builder only read code before the limit. Owner: *"when we where changing size, the text did not shrink, the highlight just moved"* | restart from the brief below (§5 "Size") |

Release = `gh pr ready N` → `gh pr edit N --remove-label do-not-auto-merge` → `gh pr merge N --merge --auto
--match-head-commit <sha>` → `gh workflow run deploy-prod.yml --ref main` → wait for `/api/health` version → curl
smoke (`/`, `/cale-ice`, `/login`) → prune the worktree.

## 2 · FEATURES BUILT, NOT YET CHECKED (each: finish → whole preflight → draft PR + `do-not-auto-merge`)
| Branch (worktree) | Owner ruling | State | Left |
|---|---|---|---|
| `rd/maker-look-fixes` (wt-maker-look) | Maker issues 1, 2, 4 (Look › Background "hero video" row; focus; Elements colours show on preview, type rows show colour, font previews in the dropdown) | 7 commits + fragment | walk (`walk:makerlook`) → whole preflight → PR. It stepped aside in the heavy line for the live fixes |
| `rd/maker-effects-attire` (wt-effects-attire) | effects premium (keep Light leak + Film grain, drop Capiz) · attire two picks for mixed roles · no entourage · **the 13 AI-drawn figures** (`controller-2026-10-12/attire-figures/`) | AI figures INTEGRATED (WebP + garment mask, multiply-dyed, shirt fronts cut) + Studio role blocks + guards | walk → whole preflight → PR; show the owner side-by-sides at 375 before merge |
| `rd/march-guest-card` (wt-march-card) | tap a Wedding March name → their guest card opens in place | built + guard + fragment | the card guard's sabotage run → walk → whole preflight → PR |
| `rd/rollcall-pairs-two-columns` (wt-rollcall) | pairs in two columns, no "&", two columns kept at 375 (supersedes 2026-09-30 option 1) | built + fragment + port baseline; lab sample pairs WIP-committed | screenshots 375/1280 → whole preflight → PR → screenshots to the owner before merge |
| `rd/egifts-inline-on-welcome` (wt-egifts-inline) | E-Gifts content on the invitation, not a door; same gates as /pabuya | built, baselines, sabotage written | screenshots incl. a not-allowed viewer → payload before/after → whole preflight → PR → owner sees screenshots |
| `rd/prints-previews` (wt-prints-previews) | APPROVED prototype `Setnayan/prototypes/maker_prints_previews_2026-10-14_fable.html` + chart its own row | built + guards + fragment | side-by-sides (`walk:prints-previews`) → whole preflight → PR |
| `rd/stage-text-width` (wt-stage-text-width) | APPROVED `maker_text_width_2026-10-14_fable.html` — drop the word "Colour" on phones, parts as drawn, 60/90/100 % · 32/60/76 ch, free | built + real guest-page test | ⚠ meant to STACK on the Size live fix (same files) — rebase onto `rd/stage-size-resizes` once that exists → side-by-sides → whole preflight → PR |
| `rd/services-home-rows` (wt-services-rows) | "Your services" rows + bands (paid + Event Hub Pro), approved prototype | built, lab walk done, quick half green, main merged | whole preflight → push → PR. Stepped aside for the live fixes |
| supplier-easy steps 1–6 (wt-se-1 … wt-se-6) | the simpler supplier dashboard, approved prototype `supplier_easy_dashboard_2026-10-14_fable.html` + halls | **#6533 (step 2 halls) and #6535 (step 6) are draft PRs, CI green**; 1, 3, 4, 5 built, not PR'd | per step: walk → whole preflight → draft PR. Then ONE supplier batch → two testers → ship → a real church-helper test |

Supplier step notes: step 3 rebuilds the card maker without sheets → it CONFLICTS with the merged card-fields fix in
`canvas-maker.tsx` — take step 3's side (the fields live in in-page folds). Step 3 also leaves the time-slot plan
gate to step 2. Step 6's free Helper is OWNER-CONFIRMED (one view-only Helper per shop on top of every plan;
`FREE_HELPER_SEATS`), and Sign out stays avatar-only. Step 3 product calls the owner has NOT seen: the Setnayan gift is
NOT pre-filled on; no peso amount / schedule % pre-filled — say so in the batch PR.

Older drafts still open: batch 7 #6532 (dark mode + public fixes — merge main, re-run, testers) · dark 1–4 #6500
#6501 #6502 #6522 · public fixes #6499 · #6407 #6411 #6412 #6419 #6420 (paused).

## 3 · WAITING ON THE OWNER
- **Cover Scene** prototype (Fable, finished, NOT yet shown):
  `Setnayan/prototypes/maker_cover_group_background_2026-10-14_fable.html`. Rulings in it: named "Cover Scene" ·
  fills the whole first screen on any device · the Hero folds into the Cover Scene's Background (one background) ·
  Scene ◆ ready-made loops play · Upload = photos (videos kept, not played for guests). Publish it as an Artifact
  (strip doctype/head/body, `<title>Cover Scene</title>`), ask for his OK, then build. Open questions inside: Framed
  meaning · Hero folded in · Scene ◆ still Pro.
- **Media allowance** — owner: Pro gets **500 MB** of media; **Free gets nothing extra** (keeps logo + Hero photo).
  Not built. Constant proposed: `COUPLE_MEDIA_QUOTA_BYTES` in `lib/entitlements.ts`. Cost ≈ nothing (R2 ~$0.015/GB-mo).
- **Video checking** — owner said "Yes, research it": find a way to screen uploaded videos so they can play for guests
  (today `GUEST_HERO_VIDEO_PLAYBACK = false`, SEC-6). Cloudflare's CSAM tool is NOT available (DNS is GoDaddy, see
  CLAUDE.md). Bring options + cost to him; nothing is built.
- **The toolbar on www.setnayan.com/cale-ice** — signed-out there is none (measured). Most likely Vercel's own toolbar
  (he is signed into Vercel). Asked him for a screenshot; unanswered.
- His own to-dos: Start on /admin/launch-offer · Google Wallet set-up · refund wording.

## 4 · TRAPS (each cost time tonight)
- Builders die together on a session limit → their lock waiters keep running headless. Commit after every step.
- A sheet portalled to `<body>` is OUTSIDE its form (`new FormData(form)` never sees it) — fixed for the card maker
  by `lib/portaled-fields-join-their-form.ts`, which also forces `type="button"` on type-less sheet buttons (else one
  tap submits the card).
- AI figures: `gpt_image_2_5` via Higgsfield (0.25 credit each); ivory garment + mask + multiply = recolourable. Shirts
  under suits take tint — masks hand-cut.
- The Maker has no "group" selection on the Cover; its parts' Background is grey ("This sits on the cover's
  background"). Don't promise a feature before reading `lib/maker-parts.ts` `makerPartToolWorks`.

## 5 · RESTART BRIEFS (paste into a new builder; model Opus unless noted)
- **Size (live fix):** Stages › part › Style › Colour·Size row (`stage-panel/stage-look-row.tsx` StageLookRow →
  `part-look.ts` keepPartLook/partLookNext; steps/bounds `lib/element-style.ts` HUB_ELEMENT_SIZE_*). Slider moves but
  the words don't resize. Find why for EVERY part offering Size on every stage; prove with computed font-size per
  step on the render; guard + sabotage; branch `rd/stage-size-resizes`; draft + label; ships alone. Check
  `rd/maker-look-fixes` (Elements colour not showing on preview) for a shared root cause first.
- Every other build: its worktree's last commits + the table above + `handovers/` are the brief. Rules for all:
  lab/stand-in only (never Apply/Undo/Restore on cale-ice, never the owner's browser pane), whole `pnpm preflight`
  before every push, draft PR + `do-not-auto-merge`, never `--admin`, live fixes ship alone, features as one tested
  batch (CI + whole preflight + two testers + controller read = live without his test; money/legal/open questions are
  his).
