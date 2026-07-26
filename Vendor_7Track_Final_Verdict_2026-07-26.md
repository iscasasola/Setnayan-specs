# Vendor Monetization — 7-Track FINAL VERDICT after fix pass (2026-07-26)

> Builders + adversarial reviewers + a dedicated fix pass + independent re-audit. **Trust the RE-AUDIT over any fixer self-report** — two fixers claimed falsifications that did not hold.

# FINAL CALL — 7 vendor branches, post-fix-pass

Base for all seven was `origin/main` @ `bc37265d5`. **Main has since moved to `4913473ad` (PR #3715).** Every branch needs a rebase + re-diff before merge — see the "#3668 stale-tree clobber" note at the bottom. No PRs are open on any of them.

## Verdicts

| Track | Branch | Verdict | One-line reason | Descoped (NOT built) |
|---|---|---|---|---|
| tier-gate-flips | `claude/vendor-tier-gate-flips` | **SHIP** | All 3 defects fixed at the call site; 5 of 6 attack-reverts go red; flag-OFF byte-identical. | Nothing. `editorialFeatures` cap added but wired to nothing. |
| ai-advanced-voice | `claude/vendor-ai-advanced-voice-match` | **SHIP** | Both BLOCKERs closed at reachable call sites; every self-reported number reproduced exactly. | Couple-language auto-detect, lead analytics, higher daily cap. AI Advanced SKU stays `is_active=false` — it is a spine, not a product. |
| launch-window | `claude/vendor-launch-window-coverage` | **FIX-FIRST** (2 lines) | Blockers fixed by descope; one new undisclosed bug can silently cut a vendor's paid AI window to 28 days. | **Vendor plan subscriptions are NOT free during the launch window.** Only 3 add-ons. Half the stated posture. |
| team-roles | `claude/vendor-team-roles-financial-secretary` | **FIX-FIRST** (rebase only) | Blocker genuinely deleted, tests provably real; 2 commits behind main. | **The Financial role entirely** — code *and* DB enum. The 5×11 capability matrix enforces nothing. Secretary can be assigned and can read nothing. |
| cap-ui | `claude/vendor-cap-fully-booked-ui` | **FIX-FIRST** | 4 of 6 fixed and falsifiable, but the money hole was *relocated*, not closed, and its falsification claim is false. | Nothing removed. Residual race is handled by *telling* the couple their deposit wasn't recorded — not by capturing it. |
| boost-featured | `claude/vendor-boost-featured` | **FIX-FIRST** | Both BLOCKERs genuinely closed — but **the fix pass introduced a new HIGH** that breaks the branch's own headline rule, shipped with a false comment and zero tests. | **Merit ranking on 1 of 5 vendor lists.** The grid couples see first is still pay-to-win. Small categories sell Enterprise zero featured slots, silently. The bot-reply trigger is still unfixed (read-side mitigation only). |
| two-ring-reach | `claude/vendor-two-ring-reach` | **SPLIT — do not attempt a third pass on the whole thing** | Settings half is clean; the free-transport enforcement half is defeated by renaming a line item, and then attaches a **Setnayan-authored "travel is free" line next to the charge**. Worse than main on that path. | **The entire vendor-facing free-travel readout** (trilateration oracle). **Ring 2 bounds nothing** — "beyond = not shown" is enforced nowhere. |

## SHIP list, in merge order

1. **tier-gate-flips** — merge first. It owns `lib/vendor-tier-caps.ts`, which boost-featured and team-roles both read.
2. **cap-ui** *(after fix)* — independent files + its own migration.
3. **ai-advanced-voice** — takes `vendor-dashboard/shop/page.tsx` first, so two-ring-reach rebases onto it, not the reverse.
4. **boost-featured** *(after fix)* — **rebase after #1**: `TIER_BOOST_POINTS` is keyed off `VENDOR_TIERS` *order*, so a reorder silently changes featured-slot priority with **no type error**. Re-run its unit tests after #1 lands.
5. **team-roles** *(after rebase)* — same `vendor-tier-caps.ts` semantic dependency. Re-run its tests after #1.
6. **launch-window** *(after 2-line fix)* — **rebase after #3**: it edits `ai-addon-actions.ts` and `subscription/page.tsx`; ai-advanced-voice touches the same AI add-on surfaces. No textual conflict today, semantic overlap likely.
7. **two-ring-reach, settings half only** — **rebase after #3** for `shop/page.tsx`.

Everything else is textually independent. Re-run `scripts/check-migration-timestamps.mjs` at merge time — seven agents allocated prefixes concurrently.

## Still blocking, per track — minimal work

- **launch-window** — `apps/web/app/vendor-dashboard/subscription/ai-addon-actions.ts:222`: capture the `error` on the expiry read and bail. As written, a transient DB blip reads `null`, and a vendor sitting on +56 days gets rewritten to +28. **Two lines.**
- **cap-ui** — ungate the pre-check: drop `isVendorFullyBookedUiEnabled()` from the `isMarketplaceVendorFullyBooked` call sites. It reads the DB switch itself, so it is inert while that switch is off; cost is one extra read per lock. Plus two source-scan guards of the shape the branch already uses successfully twice. **~1 hour.**
- **boost-featured** — in `category-search.ts:1249`, restrict the price-fit sink to rows actually *over* budget (or exclude unpriced vendors from the comparator), and add the missing test. Separately, bound the `vendor_bot_replies` read — it is unlimited and silently truncates at 1000 rows, at which point the heaviest bot users get their 15 merit points back. **Half a day.**
- **team-roles** — rebase onto `4913473ad` and re-diff to the declared 11 files. Nothing else blocks the *merge*.
- **two-ring-reach** — see split, below.
- **tier-gate-flips / ai-advanced-voice** — nothing. Optional: one literal assertion on `SITEMAP_TIER_COLS` (today it's compared only to itself, so dropping `tier_expires_at` from the sitemap select reopens the HIGH defect with a green suite).

## The one track to stop working on: two-ring-reach

Split it and merge half:

- **Merge:** the ring-settings fixes (the real money bug where a paid upgrade delivered no extra reach, the 0-km self-delisting slider, the transient-read tier downgrade). Clean, falsifiable, worth having.
- **Abandon on this branch:** the free-transport enforcement. It matches the exact string `"transportation"` on vendor-typed free text — `Travel & Logistics`, `Transpo`, `Mileage` all sail through unzeroed, *and the server then appends its own "Free Transportation — your venue is inside our free-travel range" line beside the surviving charge.* A third patch pass on string matching is the wrong move; transport needs to be a structured field on the wire, which is a schema decision. Also: the enforcement covers **one** of two send paths — the native chat endpoint is unenforced, and three places in the branch claim otherwise.

## What was descoped — the explicit list

1. **Vendor plans are not free during the launch window.** Flipping the flag makes three add-ons free; vendors still pay ₱999–₱7,999/28d. The DB refuses a ₱0 subscription order by design (`price_php > 0` CHECK), and the app-side workaround is the same self-grant class PR #3714 just hotfixed. Rationale is sound; the flag's name over-promises.
2. **The Financial role does not exist** — removed from code *and* from the DB enum (deliberately: `ALTER TYPE … ADD VALUE` is irreversible). Its defining rule ("sees billing, not client chat") is not expressible in the current single-rank RLS ladder.
3. **The vendor "team roles" feature is a picker plus an enum label.** The capability matrix has zero authorization call sites. Fine to merge dark. **Not fine to market.**
4. **Merit-based ranking exists on one of five vendor lists.** With the flag on, the platform contradicts itself: fair ranking in the dashboard overlay, pay-to-win in the grid couples land on first.
5. **The free-travel Ring 2 bounds nothing.** No discovery surface enforces it.
6. **The vendor-facing free-travel indicator is gone** (it let a vendor triangulate a couple's undisclosed venue in ~20 clicks).
7. **AI Advanced is still an empty rung** — SKU `is_active=false`, consistent with the standing warning in the corpus.
8. **Zero browser verification on all seven branches.** Every UI claim is code review + typecheck.

## Where the fixer and the re-audit disagreed — trust the re-audit

- **cap-ui:** fixer claimed its headline fix was falsified. The re-audit deleted the actual DB-switch read and **23/23 still passed** — the test pins the *shape* of the fix, not its behaviour. Same for the "your deposit was not recorded" wiring. Claim overstated.
- **boost-featured:** fixer's comment says the new sort "preserves the merit order exactly." Re-audit disproved it numerically — unpriced vendors score 0.5 vs 1.0, so price becomes the primary sort key and a free vendor 75 merit points better ranks below. Undisclosed, and it is the one change with no test.
- **two-ring-reach:** fixer, changelog, and a code comment all say enforcement covers "the web action and the native endpoint alike." It does not.
- **launch-window:** fixer under-claimed one falsification (6 red, not 5) and missed the expiry-truncation bug.
- **tier-gate-flips, ai-advanced-voice, team-roles:** every reported number reproduced exactly. Trustworthy self-reports.

**Wave-level tooling finding:** four re-audits caught `pnpm run typecheck` returning a **turbo cache hit replayed from a different agent's worktree**. Any "typecheck clean" claimed via the root script across these seven is potentially attributed to the wrong tree. Verify with `npx tsc --noEmit` inside the worktree. Also note `test:unit` lives in `apps/web`, not the root.

## Owner decisions — plain English

1. **Launch offer.** Vendors will still pay for their plan; only the three add-ons go free. Accept that, pay for the database work to make plans genuinely ₱0, or use the existing admin promo tool to grant a free tier instead. **Needed before the flag flips.**
2. **Booking-cap switch order.** Turning on the free-tier booking cap in the database *before* deploying the UI flag means a couple can pay a deposit and then be refused with a raw database error, with no payment recorded. Either approve the small always-on check, or accept a written flip-order rule you must follow exactly.
3. **Featured slots.** Are you OK launching with fair ranking on the dashboard list only, while the main vendor grid stays pay-to-win?
4. **Small categories.** A category with fewer than 4 vendors currently sells Enterprise **zero** featured slots and says nothing. Minimum slot count, or tell the vendor why?
5. **Should the money person see client chat?** Your answer decides whether the Financial role ever ships — and if yes, the permission split has to ship in the *same* change as the role, because the database change can't be undone.
6. **Team seats.** Does Pro mean 3 people total, or the owner plus 3?
7. **Free travel.** If a vendor sets a free-travel radius and then quotes a travel fee inside it, we currently zero the charge silently with no warning. Acceptable, or should we refuse the send and make them fix it?
8. **Two contradictory reach ladders** (20/50/100 km vs 30/60/100 km) are live in different files and **nobody owns this**. Pick one.
9. **Vendor AI greetings** are filtered for off-platform contact info more strictly than real chat messages are today. Intentional?
10. **Unrelated, live on main right now:** locking a multi-item vendor package fails outright (database rejects the second row). Zero such bookings have ever succeeded. Needs its own fix and its own decision — one row per package, or archive-on-cascade.

**Housekeeping owed:** one consolidating commit adding five new `NEXT_PUBLIC_*` flags to `.env.example` (deliberately deferred to avoid a seven-way conflict), and delete the stray 1–2 GB worktree at `/Users/icecasasola/setnayan-wt-ring2fix`.
