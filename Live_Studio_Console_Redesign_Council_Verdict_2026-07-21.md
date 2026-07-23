# Live Studio Control Room — Redesign Council Verdict (2026-07-21)

> **20-agent council**: 5 repo-grounding readers → 7 seats (broadcast engineer · the cousin operating it · pixel economics · the mobile tier · failure modes · information architecture · design & brand) → 7 hostile cross-examiners → chair.
>
> **Owner brief (verbatim), pointing at the page header:** *"this is taking up space. use the council to fix the whole screen and maximize it for its full potiential"*
>
> **Sibling docs:** [`Live_Studio_Repackaging_2026-07-08.md`](Live_Studio_Repackaging_2026-07-08.md) · [`Live_Studio_Trial_Council_Verdict_2026-07-21.md`](Live_Studio_Trial_Council_Verdict_2026-07-21.md) · [`Live_Studio_Competitive_and_Pricing_2026-07-20.md`](Live_Studio_Competitive_and_Pricing_2026-07-20.md)
>
> ⚠️ **Every pixel figure below is ARITHMETIC from shipped Tailwind classes, not a browser measurement.** The chair says so explicitly. Re-measure before quoting any of it as fact.
>
> ✅ **Independently corroborated the same day:** the chair's decisive reason for deleting the in-console upsell — *"apply-then-pay with a 24-hr manual reconciliation SLA, so mid-show conversion is impossible by construction"* — was reached separately by a direct prod check of `setnayan_pay_methods`: **all six automated rails are `is_active = false`.** See DECISION_LOG 2026-07-21.

---

# Live Studio Control Room — Council Verdict & Build Spec
**Chair ruling · 2026-07-20 · supersedes all seven seat positions where they conflict**

## 1. The verdict in three sentences

The owner pointed at a header, but the header is only the third-largest of ~577px (desktop) / ~669px (mobile, corrected) of chrome spent before a single video pixel — so the ruling is a whole-screen cull down to one 44px status strip, a height-driven PROGRAM that stops throwing ~46% of its own box into pillarbox, a source bus and a moment rail that are permanently visible and never behind a scroller or a tab, and a COMPACT layout rebuilt as a first-class ₱1,500 instrument rather than a tabbed subset. The console **stays on `/dashboard/[eventId]/studio/panood/broadcast`** — the route move died on cross-examination (the Studio sub-nav does not dock here, so the mobile mandate for it evaporated, and `launch/page.tsx:81` points the day-of "Go live" button at this exact URL). Everything that is unbuilt stays unbuilt: no AUTO, no rate, no fade-to-black, no Mark-highlight promotion, and no PREVIEW monitor rendered by default — a dead 279k-px² monitor is a fake door twenty times larger than the ScreensManager the council just deleted.

## 2. What gets cut, and the pixels reclaimed

Desktop figures = 1440×900 screen / ~760px innerHeight, free tier, streaming flag off. **All figures are arithmetic from shipped Tailwind classes, not browser measurements — re-measure before quoting to the owner.**

| Element | Current height (D / M) | Ruling | Reclaimed (D / M) |
|---|---|---|---|
| Sticky `.shell-topbar` (layout.tsx:340) | 61 / 69 | HIDE on this route via the shipped `.shell-topbar` hook — **only while `is_live === true`** (see Owner Decision 3) | 61 / 69 |
| Content wrapper `py-6` + `px-*` (layout.tsx:458) | 24 top / 24 | BLEED with `-mx-4 -my-6 sm:-mx-6 lg:-mx-8` (seating/page.tsx:164 precedent) | 24+32w / 24+32w |
| "Back to Panood setup" link row (page.tsx:134-140) | 52 / 52 | → 24px chevron in status strip; hidden while `is_live` | 52 / 52 |
| Page-level "Connect cameras" link (page.tsx:146-152) | inside above, +24 dead margin | DELETE the duplicate; canonical doorway stays in the bus header (control-room.tsx:1044-1051) + an inline action on each unclaimed tile | 24 / 24 |
| `sn-eye` "BROADCAST" (page.tsx:155) | 21 / 21 | DELETE — the URL and sidebar say it | 21 / 21 |
| `sn-h1` + Tv icon (page.tsx:156-159) | 37 / 37–74 | DEMOTE to 12px name in status strip (`.sn-h1` is fixed 36px, no responsive step — stop using it here) | 37 / 37–74 |
| 3-line description paragraph (page.tsx:160-164) | 60 / 80 | MOVE to `studio/panood/setup`; show in the pre-show band only when `is_live === false` | 60 / 80 |
| `UpgradeBanner` (page.tsx:167,194-215) | 74 / 158 | DELETE. Decisive reason (IA seat): the rail is apply-then-pay with a 24-hr manual reconciliation SLA — **mid-show conversion is impossible by construction.** → one 24px gold chip in the strip | 74 / 158 |
| `space-y-6` ×4 (page.tsx:133) | 96 / 96 | → 8px gaps | 72 / 72 |
| Streaming-off warning (control-room.tsx:452-464) | 90 / 150 | DELETE — verified 4th restatement (`:817`, `:1138`, `:1252`, setnayan-overlay:80-81). → the word `PREVIEW` in the strip. It is `shrink-0` *inside* the measured box, so this comes straight back to PROGRAM | 90 / 150 |
| Board\|Compact row (control-room.tsx:466-498) | 46 / 46 | MOVE into strip overflow (⋯). Set-once-per-lifetime control (panood-console-layout.ts:34-35) | 46 / 46 |
| `ScreensManager` + Walls tab (:1258-1327, :643-648) | 120 / 1 of 3 tab slots | DELETE. `provisionPanoodScreensAdmin` has zero callers (cameras/page.tsx:135-138). The two **wall SOURCE tiles stay in the bus** — different object | 120 / 54-share |
| Compact 3-tab bar (:653-678) | — / 54 | DELETE ENTIRELY | — / 54 |
| Duplicate compact Cameras tab (:630-640) | — / — | DELETE — same `cameras` array through the same `SourceTileBody` as the strip 60px above | — / — |
| Dead audio block (:1130-1140) | ~50 / ~50 | DELETE until real levels exist; returns as per-source meters on bus tiles | 50 / 50 |
| `GoLivePanel` helper prose (:1246-1252) | 45 / — | DELETE | 45 / — |
| Inert `sticky bottom-[5.5rem]` / `bottom-3` (:655, :681) | 0 | DELETE as dead pre-fit residue | 0 |
| `layout === null` double-mount (:503-511, :567-575) | 0px, real hazard | ONE tree, visibility by class — two mounted trees is a MediaStream-lifecycle risk (one publisher → one viewer per slot) | 0 |
| **Total** | | | **≈ 576 / ≈ 646** |

**Corrected mobile bottom obstruction.** The docked Studio sub-nav **does not render on this route** — `customer-menu.ts` sets `sectionMatch: '${base}/studio'` immediately followed by `sectionMatchExact: true`, and `/studio/panood/broadcast !== /studio`. There is no `subnav-docked`, no 136px reserve, no floating pill over Go-live. The real reserve is `pb-20` (80px) + safe-area + the FAB. `MOBILE_NAV_CLEARANCE_PX = 88` under-reserves by ~16px + inset, not 82. **Strike every "170px" and "389px of scroll" claim from the record.**

## 3. The BOARD layout

Route unchanged. Sidebar stays (256px — no per-route opt-out, and hiding it strands the inline `--shell-main-offset`). Content width ≈ 1168px after bleed to 8px gutters; console height ≈ **744px** at innerHeight 760.

```
<main data-console-root>                       // fixed height, overflow-hidden, flex-col, gap-2
 ├ <StatusStrip/>            44px  shrink-0    // .sn-glass-dark
 ├ <Stage/>                  flex-1 min-h-0    // flex-row, gap-2
 │   ├ <ProgramMonitor/>     flex-1 min-h-0    // box flexes; <video className="h-full w-auto mx-auto object-contain">
 │   └ <TransportRail/>      320px shrink-0    // flex-col
 ├ <SourceBus/>              90px  shrink-0    // ONE row, never scrolls
 └ <MomentRail/>             80px  shrink-0    // ONE row, never scrolls
```

**Row 0 — STATUS STRIP, 44px.** 44 not 32: `globals.css:169-173` puts `min-height:44px` on every `<button>` and this row holds four of them. Left → right: 24px back chevron (hidden while live) · couple `display_name`, 12px, truncate · **ON AIR slab** (see §6 tally) · elapsed clock + 24h-window remaining, Space Mono — free data, `decideWatermark` already returns `minutesRemaining` and `isWindowEndingSoon` (panood-watermark.ts:140-146) with zero consumers · `PREVIEW` word when the streaming flag is off · Connect-cameras icon · Pop out for OBS · ⋯ overflow holding Board|Compact, Back to setup, and **End broadcast behind an 800ms hold**. Icon toggles carry an explicit `min-h-8` — a *knowing*, documented SIZE-2 override, not an accident.

**Row 1 — STAGE, ~506px (68%).** PROGRAM box flexes to ~840×506; the image renders 840×472 ≈ **396k px², up from ~88k (4.5×)**. Height comes from flex slack, never `aspect-video` on the container (the documented regression, panood-console-fit.ts:10-15); the aspect lives on the `<video>`. PROGRAM is the single `.sn-tile-dark` (Owner Decision 4). The 320px TransportRail holds: Go live / End broadcast (End is *never* gold and *never* adjacent to routing), split-ratio readout, and — **only when `director_mode === true`** — the PREVIEW pane above them.

**Row 2 — SOURCE BUS, 90px, one full-width row, never scrolls.** Cells = `cameras.length + 2` walls, width-distributed, min 96px, max 140px. At 10 cells: ~110px wide, 62px 16:9 thumb + 26px label. Each cell: live thumbnail, Space Mono index digit 1-8, tally ring, connection state expressed by **form** (see §6), inline "Connect" action when unclaimed. Tap = cut to program (tap-to-air is the default; see Owner Decision 1). Wall tiles must stop rendering blind — pass their stream when one exists.

**Row 3 — MOMENT RAIL, 80px, all 8 macros in one row, never scrolls, never a tab.** This is the control `control-room.tsx:80-82` calls primary for a non-engineer and it is currently 100% below an internal scroll fold at first paint.

**Keyboard (desktop only, `pointer:fine`):** `1`–`8` cut to camera, `9`/`0` walls, `F1`–`F8` fire moment, `[`/`]` nudge split. Nothing destructive is bound. Today the entire 1,328-line file has one keydown handler.

## 4. The COMPACT layout — the ₱1,500 Mobile Controller

**Parity rule (IA seat, adopted):** *any element present in one layout and absent in the other is a bug, not a tier difference.* Compact is the same content inventory rearranged. Tabs are deleted outright.

390×844, innerHeight ~730. Console = 730 − 8 top − measured bottom (`--sn-bottomnav-h` + safe-area ≈ 114) ≈ **608px**.

```
StatusStrip        40    ON AIR slab · elapsed · window · PREVIEW · ⋯(End = hold)
ProgramMonitor    219    full-bleed 390×219, true 16:9, renders <SetnayanOverlay>
SourceBus         104    ONE horizontal rail, ~96px tiles, cameras AND both walls
MomentRail        148    2×4 grid, ALL 8, permanently visible alongside the bus
ThumbRow           56    off air → [Go live] (gold) · on air → [Undo last cut]
gaps 5×6           30
                  ---
                  597 of 608
```

Rulings inside compact:
- **The bus keeps horizontal scroll.** The mobile-tier seat's "this tier caps at 3 cameras" is false twice: the console is tier-blind (`grep -c tier control-room.tsx` = 0), layout is device-keyed, and `panoodCameraCapForTier(tier, grantedCap)` lets an admin raise *any* tier to 8. A fixed 3-slot bar strands 5 cameras. Tiles are ≥96px; overflow scrolls.
- **End broadcast leaves the thumb zone** and lives in ⋯ behind hold-to-confirm. Today it is the largest, lowest, one-tap, unguarded control on the screen.
- **Mark highlight is NOT added.** `markHighlight` is a verified stub that returns `ok` and writes nothing (actions.ts:267-274). Putting a placebo in the phone's scarcest 56px during vows that cannot be re-run is worse than its absence. It returns in the same PR as `panood_highlight_marks`, in **both** layouts.
- **Undo-last-cut** is the phone's safety mechanic — client-side, one action, honest. State it as weaker than preview: it shortens an aired mistake, it does not prevent one.
- **Split** moves off the 38×18px corner chip (which sits on the identical coordinates as the status chip, `:1092` vs `:996`, and will paint over it the day the streaming flag flips) into a dedicated ≥44px control in the TransportRail / ThumbRow — **not** a long-press on the tile, whose short-press is a live cut.
- **Portrait is the specified layout.** Landscape is out of scope for this pass (see Risk R4).

## 5. Setup vs show — one route, two modes

No new route. Show-mode derives from the already-persisted `is_live`.

| Content | `is_live === false` (setup) | `is_live === true` (show) |
|---|---|---|
| `.shell-topbar` | visible (keeps the coordinator's bell + unread badge) | hidden via the shipped hook |
| Back-to-setup chevron | visible | hidden |
| Pre-show band (one collapsible 56px strip above the console): what the paragraph said, streaming-state sentence, Board\|Compact, Unlock chip | visible | not rendered |
| Console | full | full + reclaimed 61px |

The onboarding paragraph's permanent home is `studio/panood/setup`. **`launch/page.tsx:81`, `studio/panood/page.tsx:78`, `setup/page.tsx:698`, `cameras/page.tsx:95`, `galleries/page.tsx:119` and `lib/routes.ts:303` all keep pointing here unchanged** — this is precisely why the "repurpose as a room check" proposal died: it would have put a marketing header inside the day-of "Go live" path.

**Route move: RECORDED AS DEAD.** Its load-bearing justification ("only `.shell-topbar` has a hook; the sub-nav, FAB and 136px reserve have none") failed verification — the sub-nav never docks here, `.subnav-lift` is a stable class anyway, and the FAB is a one-line route predicate in `[eventId]/layout.tsx:470`. Cost (a fourth `/panood/*` paywall surface, duplicated auth, five re-pointed doorways, coordinator stranded from unread messages) exceeds a benefit now measured in one floating button.

## 6. What must NOT change

1. **The server-decided watermark.** `decideWatermark` runs server-side (page.tsx:125-130) and the client only renders it. This redesign adds video surfaces; **every one is a paywall bypass if it skips the overlay.** Enforce structurally: one `<ProgramVideo>` primitive taking `WatermarkDecision` as a **required prop** and rendering `<SetnayanOverlay>` itself. No new surface can exist without it. Never re-derive client-side.
2. **The SETNAYAN overlay exactly as owner-locked 2026-07-21** — mark, size, placement, full-screen coverage, keyline, scrim. The proposed "micro / gold dot" size is **rejected**: `SIZE.thumb` at `text-[10px] tracking-[0.28em]` is ~70px and fits a 96px tile, and the lock reads "run setnayan logo on all screens."
3. **One publisher → one WebRTC viewer per slot** (`lib/panood-program-bridge.ts`). Streams are shared by reference through `window.opener`. No second viewer anywhere — this is also why the double-mount must die.
4. **Device-keyed layout** — `screen.width` + `pointer:fine`, persisted global override, **frozen while on air** (panood-console-layout.ts:50-66). Do not regress to a viewport media query. Only the control's *position* moves.
5. **Optimistic echo with server rollback** (control-room.tsx:360-371) — extend it, don't replace it. But rollback must leave a persistent mark on the failed control, not only a 5s toast (`ToastProvider` is above the shell, so its `bottom-4` genuinely lands on the compact thumb row).
6. **`requirePanoodControlRoomMember`** as the authorization boundary.
7. **The split divider** — pointer + keyboard + correct `role="separator"` ARIA (`:879-908`). Keep verbatim; change only its entry point.
8. **Tally colour language stays red = program.** On-air is carried by **AREA and SHAPE**: a full-width inverted `ON AIR` slab in the status strip plus a 3px keyline + ring on the tile. No motion dependency — `globals.css:251-262` forces `animation-iteration-count:1`. (Correcting the record: the existing pulse is a decorative dot inside an already-solid `bg-danger-600` pill; Reduce Motion does *not* delete today's on-air signal.)
9. **The CI radius scale, Hanken + Space Mono, Lucide 1.75, warm shadows, motion tokens.** Every numeral — clock, window, camera digit, split ratio — in Space Mono (coherence rule 6).

## 7. Build plan — ordered, independently shippable

**PR-1 · Instrument correctness (no layout change).** Split the single `useTransition` (`:140`) into per-control pending — today one action `disable`s SourcesRail, MomentDirector, GoLivePanel and ScreensManager simultaneously, so firing a moment locks out the camera cut. Wire `onSlotState` (`:277` is `() => {}`, discarding every connecting/connected/failed transition) and add a prune path to `setCamStreams` (`:274` is add-only, so a dead camera paints its last frame under a red badge forever). *Highest value per line in the council; ships alone.*

**PR-2 · Chrome cull + fit correctness.** Delete header/eyebrow/paragraph/UpgradeBanner/streaming banner/duplicate link/back-link-while-live; padding bleed; `.shell-topbar` hide gated on `is_live`; route-gate the FAB; move Board|Compact to ⋯. Declare `--sn-safe-bottom` in `globals.css` (it is read at `:220` and defined nowhere — `parseFloat('')` → NaN → 0, so the 34px home indicator has never been reserved). Replace `MOBILE_NAV_CLEARANCE_PX = 88` with the ResizeObserver-published `--sn-bottomnav-h`. Delete the inert `sticky` offsets.

**PR-3 · Structural overlay + single tree.** `<ProgramVideo>` with required watermark prop; collapse the `layout === null` double-mount to one component tree switched by class.

**PR-4 · BOARD relayout.** Status strip, flex Stage, TransportRail, fixed non-scrolling SourceBus, permanent MomentRail. Delete `ScreensManager`, the audio block, `GoLivePanel` prose. End broadcast → ⋯ + hold.

**PR-5 · COMPACT relayout.** Delete the tab bar, the Walls tab, the duplicate Cameras tab. Persistent bus (walls included) + persistent 2×4 moment rail + thumb row. End evicted + hold. Split entry relocated.

**PR-6 · Dark surfaces + keyboard + tally slab.** Built **only** from already-sanctioned primitives — `.sn-glass-dark`, `.sn-tile-dark`, `.sn-eye-on-dark`, `.sn-btn-on-ink`. Zero new tokens, zero new namespace, zero new lint script. Add `'app/panood'` and this route's directory to `SCAN_DIRS` in `scripts/lint-guest-legibility.mjs` (it already ships the walk, `MAX_PX`, an inline exemption and a baseline file) — that is the fence. Desktop keymap 1-8 / F1-F8.

**PR-7 · Content correctness.** Reseed `DEFAULT_MOMENTS` so `program_source` covers cam3+ (all 8 currently target cam1/cam2 only — on a 3-camera rig a third of the rig is macro-unreachable; on 8 cameras, six of eight). Add undo-last-cut.

**PR-8 · owner-gated.** `director_mode` two-bus: PREVIEW pane + TAKE, rendered **only** when the column is true. UI-only, zero migration (`preview_source`/`director_mode` exist; `setPreviewSourceAdmin`/`setDirectorModeAdmin` are written and unit-tested).

**PR-9 · deferred.** `panood_highlight_marks` table, then Mark in both layouts.

## 8. Owner decisions

1. **Two-bus preview/take — ship it opt-in, default OFF?** *Recommendation: YES, opt-in.* `director_mode` defaults `false` in the migration; every production row is single-stage. Tap-to-air stays the default for the cousin; a coordinator who knows switchers flips it. Rendering a preview monitor by default would be the largest dead surface in the product.
2. **Saturated-red tally token (`#D6261B`) as a scoped palette exception?** *Recommendation: NO for now.* Its justification — a cross-device tally language — fails: the OBS pop-out is contractually forbidden from carrying tally, and the shooter's phone has none. Ship the area/shape slab; revisit if camera-side tally is ever built.
3. **Hide `.shell-topbar` always, or only while `is_live`?** *Recommendation: only while live.* On couple desktop that bar is the sole host of the unread badge and bell; `services-takeover.tsx:156-158` blinked at exactly this trade.
4. **PROGRAM as the single `.sn-tile-dark`.** `App_Wide_Glass_Rollout_Plan §1.3` names the DayOfModeGrid card as *the* day-of obsidian and does not name this page. *Recommendation: grant it here, and note the two are never co-visible.*
5. **Written operator-surface type/target carve-out.** No operator or day-of exemption exists anywhere in `Responsive_and_Mobile_UI_Ruleset_2026-06-21.md`. This spec needs: labels down to **13px** (raising, not lowering — the file ships 16 sub-12px sites today) and **≥32px** icon toggles in the status strip. *Recommendation: sign it, scoped to this route, enforced by the legibility lint's new scan dir.*
6. **`markHighlight` — build `panood_highlight_marks`, or drop the control from Board?** *Recommendation: build the table.* A paid tier missing a feature is fixed by shipping the feature, not by deleting it from the other tier.
7. **Compact landscape.** Out of scope this pass. *Recommendation: defer; a materially different landscape arrangement would break the frozen-while-live guarantee.*

## 9. Open risks that survived

- **R1 · Every pixel figure in this document is modelled**, derived from Tailwind class values at assumed viewports, with `NEXT_PUBLIC_PANOOD_STREAMING_ENABLED` **off**. No browser was opened. Re-measure with the flag ON before quoting to the owner — the streaming banner's absence today means the console an operator rehearses on is 90-150px shorter than the one they run on.
- **R2 · The failure vocabulary has no inputs yet.** With the flag off, `camStreams` is permanently `{}`. Worse: nothing anywhere in `apps/web` writes `panood_cameras.last_seen_at` or sets status `'offline'`, so that enum value is unreachable from both directions. PR-1 wires the client half; the server half is unspecified.
- **R3 · Blur budget is honour-system here.** `.lighthouserc.json` audits only `/`, `/pricing`, `/login`. `.sn-tile-dark` carries `backdrop-filter: blur(22px) saturate(1.4)` behind an opaque video where it samples nothing — consider a `blur-none` variant for the monitor.
- **R4 · Cutting the paragraph and the streaming warning removes the only two explanations a first-time operator gets.** Mitigation is the `is_live === false` pre-show band (§5). If that band is cut for density, the cuts should be reconsidered.
- **R5 · No realtime.** The console reconciles via `revalidatePath` only. Any assumption of a second operator or a second tab staying in sync is wrong.
- **R6 · Sidebar 256px is unreclaimed** and has no per-route hook; hiding it strands the inline `--shell-main-offset` gutter.
- **R7 · The ground-truth brief supplied to this council contained a verified error** (the docked Studio sub-nav / 170px / 389px-of-scroll chain). Three seats built arguments on it. Treat any *other* unverified figure in that brief with the same suspicion.
