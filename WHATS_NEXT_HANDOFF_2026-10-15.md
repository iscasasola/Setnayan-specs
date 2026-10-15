
## ⏹ STATE AT WIND-DOWN — 15 Oct ~13:30 PHT, 95 % weekly (stop at 98 %) — START HERE ON THE NEW ACCOUNT
Live: `c5fc266`. Every branch below is on GitHub; each has `controller-2026-10-12/handovers/<name>.md` with its exact next step.
| Work | State | Next |
|---|---|---|
| Colour live fix `rd/stage-colour-every-word` | pushed (5 commits), preflight queued | preflight → draft PR → CI → ship ALONE |
| Batch 8 `rd/batch-8-event-hub` (#6537 #6540 #6541 #6542 #6543 #6544 + Width #6545) | merged train pushed (56 commits), preflight queued | preflight → ONE draft PR → CI → two testers → ship |
| Veil #6546 | CI green (quick preflight only) | two testers + owner's iPhone (sound on tap) → ship; move the builder's uncommitted DECISION_LOG rows to the corpus |
| Glimpse `rd/photos-glimpse` | pushed; preflight was running | open PR if green; then #6547 Post Event (failing checks, merge after) |
| Host strip `rd/host-strip-removed` | pushed; preflight queued | preflight → PR |
| Media `rd/media-allowance-by-plan` (Free 10 / Pro 500 MB) | pushed, unit 22/22, sabotage 5/5 | read `handovers/media-by-plan-preflight.log` → PR (money rule: owner sees the PR body) |
| Cover Scene `rd/cover-scene` | partial, pushed | continue from its handover |
| Apple Wallet #6548 | 1 failing check | fix → owner's iPhone test |
| The Day parts `rd/the-day-parts-respond` | no commits yet | restart from its handover |
Supplier steps 1–6: #6533 #6535 + branches rd/supplier-easy-{1,3,4,5}-* — unchanged since 15 Oct 00:20.

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


## ⏩ UPDATE 15 Oct ~04:00 — building resumed on the OLD account until 98 % weekly (85 % at start)
Owner: "use the remaining % to build the fixes … up to 98%". Wave 1 RUNNING: stage Size (Opus, wt-stage-size, reset to
main first) · March drag + RSVP Back finisher (Sonnet: walk → whole preflight → draft PR + label → CI). Wave 2 (if
budget remains): built Event Hub features to "PR open, CI green" in value order — maker-look, march-card, rollcall,
egifts-inline, prints-previews, effects-attire, text-width (after Size). Leftovers of the dead builders were cleared
(dev servers on 3592/3661, se4 + makerlook waiters, the se4 requeue watcher, a dead walk lock). If this account stops
again, check each branch's PR state with `gh pr list --state open`.

**~06:30 PHT: LIVE `a5c0f1b`** — RSVP Back at 320 (#6538) shipped; March drag guard (#6536) merged (test only: thousands of
random drags + Undo never lose anyone; the owner's "lost Bridgette" was NOT reproduced — likely a drop landing out of
view; asked him to look in "Not walking" before Undo next time). Worktrees wt-march-keep and wt-rsvp-open-close pruned.

**~07:20 PHT: LIVE `c5fc266`** — stage Size live fix #6539 (a scene's Size writes label + heading + words; guard
`lib/a-scene-size-reaches-every-word.test.ts`). Six feature draft PRs, CI green, NOT tested by testers yet: #6537 Maker Look ·
#6540 March guest card · #6541 Roll call · #6542 E-Gifts inline · #6543 Prints previews · #6544 Effects + AI attire.
RUNNING at 88 % weekly: Colour live fix `rd/stage-colour-every-word` (owner: Colour colours ALL words; Dress code chips +
do/don't follow Size and Colour) · Width rebased onto Size → PR · batch train `rd/batch-8-event-hub` (the six + Width) →
then two testers → ship if budget allows; otherwise the new account starts with the testers on batch 8.

**~08:30 PHT: owner — "build as much now before we transfer".** Six builders running, each committing + pushing its
`rd/*` branch after EVERY step with a note in `controller-2026-10-12/handovers/<name>.md`:
`rd/stage-colour-every-word` (live fix) · `rd/stage-text-width` → `rd/batch-8-event-hub` (the six + Width) ·
`rd/photos-glimpse` · `rd/host-strip-removed` · `rd/media-allowance-by-plan` (Free 10 MB / Pro 500 MB) · `rd/cover-scene`
(big; expect partial). NEW ACCOUNT: `gh pr list --state open` + `git ls-remote origin 'refs/heads/rd/*'` + those
handover notes = where each stopped.

**~09:00 PHT (92 %): four more started** (owner picked all four), each pushing after every step with a note in
`handovers/`: `rd/apple-wallet-pass` (Apple only; secrets stay in Vercel; device test needs his iPhone) ·
`rd/guest-small-faults` (contrast, 44 px taps, /login cookie notice, /venue wording, film timing) ·
`rd/the-day-parts-respond` (two The Day parts that didn't answer a tap) · `rd/photos-glimpse-post-event` (stacked on
`rd/photos-glimpse` — merge after it). Plus the veil build `rd/veil-tap-and-hold-behind` (tap OR swipe up unveils, music
starts inside the tap, nothing behind the veil plays until it lifts). Full checks for these were left to the next account.

**Veil: draft PR #6546, CI green (27/27)** — tap or swipe up unveils, music starts inside the tap, nothing behind plays
until unveil (12 s safety release), double-tap/petal-tap gone. ⚠ Only the QUICK preflight half ran locally (queue was
full); CI covered the rest. Needs: two testers + the OWNER'S REAL iPHONE for sound-on-tap, then ship (feature, not a live
fault). The builder's own calls (veil back down doesn't re-pause; envelope/door openings release but don't start music;
an invisible-start scene animation stays hidden under the sheer veil) are written in the Setnayan checkout's
DECISION_LOG and `0024_Veil_Reveal_Spec` but NOT committed (that checkout has other sessions' edits) — move those rows
to the corpus via wt-corpus-push. Guest small faults: 4 of 5 already fixed on main; the film's 22 s autoplay is the
owner's 2026-09-26 ruling (left).

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
  `Setnayan/prototypes/maker_cover_group_background_2026-10-14_fable.html` — PUBLISHED for him 15 Oct: https://claude.ai/artifact/WhiYtnAuMME7NSgkKsd2t1 (APPROVED 15 Oct — all three: Framed as drawn, Hero folded in, Scene ◆ Pro). Rulings in it: named "Cover Scene" ·
  fills the whole first screen on any device · the Hero folds into the Cover Scene's Background (one background) ·
  Scene ◆ ready-made loops play · Upload = photos (videos kept, not played for guests). Publish it as an Artifact
  (strip doctype/head/body, `<title>Cover Scene</title>`), ask for his OK, then build. Open questions inside: Framed
  meaning · Hero folded in · Scene ◆ still Pro.
- **Media allowance** — FINAL: **Free 10 MB, Pro 500 MB** (owner 15 Oct, "Free 10MB" + "Pro is 500MB").
  Not built. Constant proposed: `COUPLE_MEDIA_QUOTA_BYTES` in `lib/entitlements.ts`. Cost ≈ nothing (R2 ~$0.015/GB-mo).
- **Video checking** — owner said "Yes, research it": find a way to screen uploaded videos so they can play for guests
  (today `GUEST_HERO_VIDEO_PLAYBACK = false`, SEC-6). Cloudflare's CSAM tool is NOT available (DNS is GoDaddy, see
  CLAUDE.md). Bring options + cost to him; nothing is built.
- **The toolbar on www.setnayan.com/cale-ice** — signed-out there is none (measured). Most likely Vercel's own toolbar
  (he is signed into Vercel). CLOSED 15 Oct: owner re-opened the link and the toolbar did not show.
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
- **Host strip removed — DESIGN APPROVED 15 Oct** (`Setnayan/prototypes/host_preview_after_ribbon_2026-10-15_fable.html`, https://claude.ai/artifact/2qek7DDRugqRX23LvuSmm1; its notes' "delta to build" is the spec): Preview stays in the Maker (stage from the top bar, hold ▶); ADD one "See as ▾" PickMenu beside "Exit preview" in the hold-▶ preview, phone only (owner: yes); remove the STRIP ONLY — the host-voiced body lines stay (owner: strip only). Original ruling (owner 15 Oct, "Remove it"): the owner ribbon on `/[slug]` for a signed-in host
  (`app/[slug]/_components/owner-ribbon.tsx` OwnerRibbon — "Your Event Hub — as a guest sees it" · Edit · Preview ▾ via
  `owner-phase-menu.tsx`; model `lib/owner-ribbon.ts` buildOwnerRibbon; mounted in `site-body.tsx` / `page.tsx`). The
  host's own page must look exactly like a guest's; editing is from the dashboard only. It is woven into ~20 guards
  (`grep -rln "OwnerRibbon\|owner-ribbon\|buildOwnerRibbon\|data-owner-ribbon" apps/web`) incl. the-host-sees-their-own-page,
  host-body-variant, owner-ribbon*.test.ts, see-as-*, a-control-that-works-for-whoever-sees-it, the-hub-next-step-never-
  points-at-itself, a-dark-look-keeps-its-words, each-guest-page-has-one-main-action, the Maker canvas test. Keep what
  OTHER surfaces still need: `supplier-ribbon.tsx` (vendors), `sample-viewer-inert.tsx` / See-as, the Maker canvas
  (it never showed the ribbon), and the `?phase=` previews (reachable from the dashboard / Maker, decide where the
  Preview ▾ moves or whether `?phase=` stays host-only by URL). site-body's host branch already draws no "Get inside".
  Re-aim each guard to the new claim ("a signed-in host sees no owner chrome on /[slug]"), never delete one to go green;
  sabotage once. Branch `rd/host-strip-removed`, draft + label, feature batch (not a live fault).
- **Cover Scene (APPROVED 15 Oct):** build the approved prototype
  `Setnayan/prototypes/maker_cover_group_background_2026-10-14_fable.html` (https://claude.ai/artifact/WhiYtnAuMME7NSgkKsd2t1)
  exactly — its notes' "delta to build" is the spec: part key `coverscene` + `makerPartParent` in `lib/maker-parts.ts`
  (the grey "This sits on the Cover Scene." line gains "Select the Cover Scene ›"; tap empty cover space; first row of
  the parts ▾) · the cover section full first screen (`min-h-[100svh]`, `100dvh` under @supports) in
  `pahina-masthead.tsx` · Framed = inset with a rounded margin on the page colour, Full width = edge to edge (owner:
  yes) · ONE background: the Hero folds into the Cover Scene's Background, Details › Hero is a second door to the same
  value, `resolveHero` keeps feeding poster/home card (owner: yes) · `canvas.ground` on the hero row, no migration ·
  the unchanged `StageBackground` rows via a thin adapter · Scene ◆ ready-made loops play for guests and stay PRO (owner:
  Pro) · Upload ◆ = photos and ≤15 s clips like every stage (own stage clips already play for guests — owner: keep playing); only the cover's own HERO clip stays locked while `GUEST_HERO_VIDEO_PLAYBACK` is false ·
  the EXISTING `MAKER_EVENT_MEDIA_BYTES_CAP` (100 MB, `lib/couple-media-allowance.ts`) becomes plan-aware — **Free 10 MB, Pro 500 MB** (owner, FINAL 15 Oct ~07:50 — "Pro is 500MB"; supersedes 100/500 and 10/100; never add a second quota constant; existing files are always kept — a couple over the cap just cannot add more; measured: only cale-ice (internal = Pro) is over 10 MB, at 144.9 MB — under Pro's 500 MB) with the "Your media · N MB of 500 MB" meter · legibility
  over the scene's ground · guard `the-cover-scene-is-one-group.test.ts`. Opus. Branch `rd/cover-scene`. Side-by-sides at
  375 + desktop vs the prototype before merge.
- **Glimpse photo style (APPROVED 15 Oct):** build `Setnayan/prototypes/photos_glimpse_style_2026-10-15_fable.html`
  (https://claude.ai/artifact/1fBZUi3ZU16sHhxu2Lu25x) — its notes' delta is the spec: `{ id: 'glimpse', name: 'Glimpse',
  line: 'One photo at a time, centred; the next peeks in.', stages: STD }` in the `gallery` set of
  `lib/scene-styles-stages.ts` · `OurPhotosGlimpse` beside Grid/Film strip in `our-photos-styles.tsx` + a small client
  rail leaf + the `sceneStyle === 'glimpse'` branch in `our-photos-widget.tsx` · reuse `gallery-lightbox.tsx` · scroll-snap
  centre, neighbours scale .92/opacity .72, dots ≤ 8 else "3 / 12", **AUTO-SCROLL ON = A SLOW CONTINUOUS HORIZONTAL DRIFT (owner 15 Oct: "is just slowly moves horizontally"; overrides the prototype's "no autoplay" and the "step every 4 s" note)**: a steady glide (~one photo per 8–10 s), seamless endless loop (photos repeated, no snap-back), the scale/opacity emphasis still computed per frame as each photo passes the centre; scroll-snap off while drifting, re-enabled while the guest is swiping; pauses on touch/swipe/hover and while the lightbox is open, resumes after ~6 s idle; runs only while the rail is on screen (IntersectionObserver) and the tab is visible; reduced motion = no auto-scroll and no scale · cards 3:4.
  Owner picks: **add a typed heading field to the Photos scene** (Details › Photos; every Photos style shows it — e.g.
  "Glimpse of Us"; the fixed "Our photos" eyebrow stays as the default when empty) · Post Event later (second step).
  Extend the three pinning guards (`scene-styles-stages.test.ts`, `layouts-are-the-shipped-scene-styles.test.ts`,
  `every-scene-style-draws.test.ts`). Our own design — never the third-party site's assets. Branch `rd/photos-glimpse`.
- Every other build: its worktree's last commits + the table above + `handovers/` are the brief. Rules for all:
  lab/stand-in only (never Apply/Undo/Restore on cale-ice, never the owner's browser pane), whole `pnpm preflight`
  before every push, draft PR + `do-not-auto-merge`, never `--admin`, live fixes ship alone, features as one tested
  batch (CI + whole preflight + two testers + controller read = live without his test; money/legal/open questions are
  his).
