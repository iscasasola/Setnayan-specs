# ▶▶▶ WHAT'S NEXT — LIVE STUDIO + GOOGLE OAUTH (handover, 2026-07-29)

> **Cold-start handover.** Written so a session with **zero prior context** can pick this up and act without re-deriving anything. Every fact below was verified against `origin/main`, the production database, and the live site on 2026-07-29. Where something is a *claim* rather than a verified fact, it says so.
>
> **Trigger:** this file is part of the `what's next` set — see [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md).

---

## 0 · READ THIS FIRST — five things that will waste your time if you don't

1. **The local `setnayan-platform` checkout runs STALE.** Always audit `origin/main`, never the working tree:
   `git -C ~/Documents/Claude/Projects/setnayan-platform show origin/main:<path>`
   ⚠ **Do NOT run `git checkout origin/main -- .` in that checkout.** It stages the entire tree, and a later `git add`/`commit` from that directory sweeps hundreds of files into an unrelated commit. This happened on 2026-07-26; it was caught and reset before any push.
2. **`NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED` is ON in production.** Proof: the `LIVE_STUDIO` ₱2,999 row renders on the public `/pricing` page, and `lib/v2-catalog.ts` name-excludes that SKU when the flag is off. Much of the corpus still writes about the flip in future tense — it already happened.
3. **Live Studio has never broadcast anything.** Prod: **0 pool channels · 0 platform grants · 0 broadcasts ever · 0 orders ever** for any Live Studio SKU. Anything that removes a working path "because the new one exists" is a regression — the new one is unproven.
4. **Corpus convention: sections under a "SUPERSEDED / kept for lineage only" banner are deliberate history. Do NOT edit them.** Correct canonical docs; leave lineage alone. Editing lineage is how stale numbers got re-legitimised before.
5. **Public copy is not auto-merged.** Website/legal copy ships as a DRAFT PR for the owner to read (precedent #3703, #3791). Code behind a default-off flag can auto-merge as usual.

---

## 1 · THE CAMERA MODEL — the canonical statement

Three contradictory models used to ship at once. This is the one that is true:

- **One SKU:** `LIVE_STUDIO`, **₱2,999 per event-day**, `is_active=true`. `PANOOD_SYSTEM` (₱2,500) and `PANOOD_SYSTEM_MOBILE` (₱1,500) are **retired** (`is_active=false`).
- **Cameras:** every host — free or paid — may connect and rehearse **up to 12** (`MAX_ROAM_ZONES = 12`). That is the only camera ceiling in the product.
- **What ₱2,999 buys is PUBLICATION, not cameras:** free broadcasts **one** channel (`FREE_PUBLISHED_CHANNEL_LIMIT = 1`); paid cuts between all 12 and publishes them.
- **Device: no limit anywhere.** `lib/panood-console-layout.ts` returns a *layout* (`'board' | 'compact'`) and states: *"camera capability is NOT affected by any of this."* The old Mobile-3 / Desktop-8 split was an entitlement split between the two dead SKUs.
- **Two numbers that look like camera limits and are not:** `GUEST_PICK_MAX_VIEWERS_PER_CAMERA = 3` (guests peer-watching ONE side camera) and a pool channel's **`concurrent_cap`, DEFAULT 4** (YouTube broadcasts per Setnayan channel per event).

---

## 2 · WHAT SHIPPED (all merged, verified on `origin/main`)

| PR | What |
|---|---|
| #3770 | Recording handoff — End completes the per-camera broadcasts, tears down the guest picker, resolves archives via `videos.list` |
| #3774 | Recordings render on **both** couple-facing setup surfaces (they'd otherwise vanish at the flag flip) |
| #3776 | `LIVE_STUDIO` added to `/pricing` groups — it could never have rendered at launch |
| #3780 | Adversarial-review fixes: chunked `videos.list` (a 50-id truncation read as "No recording"), and a duration formatter that produced "1 hr 60 min" |
| #3786 | The paid broadcast day no longer starts on a **free** go-live |
| #3787 | Payment lead-time notice on the buy surface, pinned by test to #3786's gate |
| #3791 | Public-copy realignment — **live and verified** |
| #3792 | **Pool-only switch** `NEXT_PUBLIC_LIVE_STUDIO_POOL_ONLY` (default OFF) |
| #3817 | A couple who pays ₱2,999 is no longer treated as unpaid on Launch/Galleries |
| #3820 | Google's `org_internal` translated instead of forwarded as a failure |

**Docs:** camera model reconciled across 8 memory statements + 16 canonical corpus docs; `Live_Studio_Internal_Consent_Cutover_2026-07-27.md` written; `DECISION_LOG.md` rows for each.

---

## 3 · 🔴 OWNER ACTIONS — everything is blocked on these

Full detail: [`Live_Studio_Internal_Consent_Cutover_2026-07-27.md`](Live_Studio_Internal_Consent_Cutover_2026-07-27.md). Summary:

| # | Action | Note |
|---|---|---|
| **A** | **Upgrade the Google Cloud billing account** | ⏰ Trial was "6 days left" on 2026-07-27. Upgrading is **free** (pay-as-you-go, keeps unused credit, usage is $0.00). If it lapses, resources stop with a 30-day recovery window. Set a budget alert immediately after. |
| **B** | **THE 15-MINUTE KILL TEST** | Sign up `workspace.google.com/gcpidentity/signup?sku=identitybasic` (Cloud Identity **Free**, ₱0 — verified against Google's editions doc) → verify `setnayan.com` by **DNS TXT only, never MX** → create `live@setnayan.com` → **Admin → Apps → Additional Google services → is YouTube listed?** |
| **C** | Enable YouTube for the org + set content restriction **"No restrictions"** | Restricted Mode blocks uploads even when the service is on |
| **D** | **G1** — create + phone-verify the channel, enable live streaming | ⏳ **24-hour wait** before the first stream. The long pole. |
| **E** | **NEW** Cloud project in the org → Audience **Internal** → new OAuth client → redirect URI `https://www.setnayan.com/api/oauth/youtube/callback` | ⚠ New project, **not** the existing one — see § 5 trap 1 |
| **F** | Vercel: `YOUTUBE_OAUTH_*` **and `NEXT_PUBLIC_LIVE_STUDIO_POOL_ONLY=true` in the same change** | see § 5 trap 2 |
| **G** | `/admin/live-studio-channels` → connect → verify → **set `concurrent_cap` to 12** | default 4 silently drops cameras 5–12 |
| **H** | **G4** — file the YouTube Data API quota increase | ceiling ≈ 12–15 weddings/day |
| **I** | **One non-paying mock event** before any paying wedding | nothing has ever reached YouTube |

**If B answers NO:** the ₱0 Internal path is dead. Fall back to External verification — brand verification + sensitive-scope review. ⚠ Note External may be **unsatisfiable** under the pool model: its demo video must show *"the OAuth grant process that users will experience"*, and under Setnayan-owned channels no user ever grants.

---

## 4 · 🟡 THE WORK QUEUE — legacy retirement (owner decided: "just the unified only, retire the legacy")

**PR-0 is done (#3817).** The rest, in this order. **Redirects are reversible; deletion is not.**

| Step | Change | Notes |
|---|---|---|
| **PR-1** | **Delete** `studio/panood/reviews/{page,loading}.tsx` | `feature_reviews` = 0 rows ever, no write surface exists. Also remove the `reviews={{…}}` prop in `studio/panood/page.tsx`, `lib/routes.ts` `panood.reviews`, and the `page-masthead-baseline.json` entry. **Keep** the table + the `AppStoreLayout` `reviews` prop (`lib/add-on-stats.ts` still reads it). |
| **PR-2** | Flag-gated **redirect** on `studio/panood/cameras/page.tsx` + `cameras/print/page.tsx` → `liveStudioControlPath(eventId)` | ⭐ **This is the page that told the owner "3 cameras free"** — see § 6. Already unreachable in prod (its only inbound links are inside the already-redirected legacy room). |
| **PR-3** | **One atomic PR:** filter the `panood` entry out of `BASE_ADD_ONS` when the flag is on **and** add a flag-gated redirect on `studio/panood/page.tsx` → the unified detail page | Doing either alone leaves a live tile whose price pill contradicts the product. Keep the JSX body below the redirect — `lib/panood-retirement.test.ts` greps this file for four literal strings. |
| **PR-4** | **Parity port — blocks PR-5.** Port into the unified `<SetupSheet>`: ① the **YouTube disconnect form** (the ONLY revocation door in the product), ② the stream-key **reveal** toggle, ③ the watch-URL **copy** button | Without ① a user cannot revoke. |
| **PR-5** | Flag-gated redirect on `studio/panood/setup/page.tsx` | 🚨 **KEEP `studio/panood/setup/actions.ts`** — the unified controller imports `goLivePanood`/`endPanoodBroadcast` from it. Delete the page, never the actions. |
| **PR-6** | Rebuild the **QR print pack**, channel-scoped: `app/panood/control/[eventId]/print/page.tsx`, gated by `isLiveStudioSetupHost`, driven off `fetchChannelCameras` | Blocks nothing. Prints camera-**operator** claim QRs (a seat-hijack credential) — a different artifact from the guest QRs on the event website. |
| **🚧 GATE** | **Do not proceed past here until one broadcast has actually reached YouTube in production** | |
| **PR-7/8** | Delete the legacy tree; retire `PANOOD_FREE_CAMERA_COUNT`, `PANOOD_TIER_CAMERA_CAP`, `resolvePanoodTier` | Irreversible |

---

## 5 · ⚠ TRAPS — each of these costs real time or real money

1. **Use a NEW Cloud project for the Internal client.** The consent-screen **Audience is PROJECT-level**, and the existing `SETNAYAN` project also carries **Papic's Google Drive** OAuth client. Flipping it Internal would return `org_internal` to every couple connecting Drive and silently kill photo delivery. `drive.file` is non-sensitive, so that project needs no verification — leave it exactly as it is.
2. **The BYO route and the pool route share ONE OAuth client** (`getYoutubeOAuthConfig`). The moment Internal credentials go live, the couple-facing door answers `org_internal` until `POOL_ONLY` is flipped. #3820 makes that survivable (it renders a plain notice), but flip both in the same change and the window never opens.
3. **`concurrent_cap` default is 4**, and `provisionRoamBroadcasts` computes `skippedOverCap` then **discards it** — nobody is told cameras were dropped. Set it to 12 at channel registration.
4. **Migrations auto-apply unreliably on bursty merges.** After merging any migration, verify and if needed `gh workflow run supabase-migrations.yml --ref main`. (All 960 were applied as of 2026-07-29.)
5. **Changelog fragments go in ROOT `changelog.d/`**, not `apps/web/changelog.d/` — CI enforces this.
6. **Run the unit suite with the Live Studio flag BOTH off and on:** `pnpm -C apps/web test:unit` and `NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED=true pnpm -C apps/web test:unit`. Drift guards cross-check catalog ⟷ peak-months ⟷ detail.
7. **Prune worktrees after their PR merges** — they are 1–2 GB each and have caused ENOSPC deadlocks.

---

## 6 · 🐞 KNOWN-OPEN DEFECTS (verified still open on 2026-07-29)

| Defect | Evidence | Fix |
|---|---|---|
| **`studio/panood/cameras` has no flag guard** — still serves the retired 3/8 ladder and still says *"You have 3 cameras free to test with"* | `grep -c "liveStudioRoamEnabled()) redirect"` → **0** | PR-2 |
| **`resolvePanoodTier` never checks `LIVE_STUDIO`** — on that page a couple who paid ₱2,999 is told they are on the free tier | `grep -c "LIVE_STUDIO"` in `lib/panood-camera-seats.ts` → **0** | PR-2 / PR-8 |
| **Duplicate Studio tile** with the flag on — legacy "Live Studio Cast" (retired SKU) + unified `LIVE_STUDIO` | `lib/add-ons-catalog.ts` | PR-3 |
| **`skippedOverCap` computed then discarded** — silent camera drop | `lib/live-studio-roam-provision.ts` | own PR |
| **Legacy `markHighlight` is a no-persistence stub** returning `{ok:true}` | `studio/panood/broadcast/actions.ts` | dies with PR-7 |

---

## 7 · 🤔 DECISIONS ONLY THE OWNER CAN MAKE

1. **Wipe vs. indefinite retention** of recordings on the Setnayan channel. `Cast_and_Roam § 4` and Unified `§ 4h` both say *wipe + reuse*; `09_Panood_Feature_Specification § 6` promises **indefinite retention**. Wiping deletes a wedding — **nothing was built either way**.
2. **The pool-side file handoff.** On a Setnayan channel the couple is not the channel owner and cannot download from YouTube Studio. Options: an admin Studio download + hand-off, or `videos.insert` re-upload to a channel they connect.
3. **Is 12 the number we SELL?** Chosen as a transport/UX guard; no public surface quotes a camera count.
4. **The encoder.** Browsers cannot push RTMP and the native capture app was never built, so the couple runs OBS window-capturing `/panood/program/[eventId]`. A WebRTC→RTMP relay would fix it but **breaks the ₱0 marginal-cost lock**.
5. **Free-tier camera count**, once PR-2 lands: legacy promised 3, unified promises 1 published channel. PR-2 removes the contradiction by retiring the legacy page — confirm that is the intent.

---

## 8 · HOW TO VERIFY YOU HAVEN'T BROKEN ANYTHING

```bash
cd ~/Documents/Claude/Projects/setnayan-platform
git fetch origin main && git worktree add -b claude/<task> <path> origin/main
pnpm -C <path> install --frozen-lockfile
pnpm -C apps/web typecheck && pnpm -C apps/web lint
pnpm -C apps/web test:unit
NEXT_PUBLIC_LIVE_STUDIO_ROAM_ENABLED=true pnpm -C apps/web test:unit
pnpm -C apps/web build
```
Then: `gh pr create …` → `gh pr merge <#> --auto --merge` (standing default; **except public copy**, which ships as a draft).

**Baseline at handover:** 4551/4551 unit tests green with the flag off and on.
