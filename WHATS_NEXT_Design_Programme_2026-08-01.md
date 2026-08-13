# WHATS_NEXT — Design Programme: palette shipped, archetypes drafted, ~40 units to port

> ## ✅ THE GATE IS OPEN — ALL 19 APPROVED, 2026-08-04
>
> The owner reviewed the twelve screen shapes and seven pop-up types and returned
> **SHIP IT on every one.** No changes requested, nothing held for discussion.
>
> **What that means for anyone picking this up:**
> - The port is **unblocked**. This was the largest blocked stream in the project.
> - `prototypes/archetype_*_2026-08-01.html` are now **BINDING**. Port them; do not redraw them.
> - The admin collapse is blessed: ~95 of 107 admin routes become ONE archetype.
> - The 28 older prototypes are to be **reconciled** against these, never treated as a rival source.
>
> ⚠ **What was approved is the SHAPE, not any screen's pixels.** If a ported screen differs from
> its archetype, that is a defect in the port — not a new design decision to make on the spot.
### 2026-08-01 · owner: *"we want to fix all pages"* → *"i don't think we can finish this now"*

> **Cold-start contract.** Assume no memory files and no conversation context. Everything needed is in
> this repo. Verified against `origin/main` @ `41b3552b3` (2026-08-01) by enumerating every `page.tsx`,
> not by reading a spec.
>
> **Read in this order:** this file → [`Design_Gap_Pass_2026-08-01.md`](03_Strategy/Design_Gap_Pass_2026-08-01.md)
> (the ~40-unit list) → [`Public_Website_Design_Foundation_2026-08-01.md`](03_Strategy/Public_Website_Design_Foundation_2026-08-01.md)
> (the why + frame inventory) → [`Claude_Design_Brief_2026-07-31.md`](03_Strategy/Claude_Design_Brief_2026-07-31.md)
> (⚠ **read its STOP block first — §1 below it is out of date**).

---

## 0 · State in one screen

| | |
|---|---|
| ✅ **DONE — colour, on all 401 routes** | PR #3988 merged. Terracotta palette resolves from CSS vars ⇒ **1,263 `bg-cream` call sites** turned over with **zero component edits**. |
| ✅ **DONE — the guard that LOCKS it** | **PR [#4030](https://github.com/iscasasola/setnayan-platform/pull/4030) MERGED 2026-08-02**, confirmed by ancestry (`git merge-base --is-ancestor 99fd30e79 origin/main`), not PR status. ⚠ **It sat OPEN for a day because auto-merge does not report a red check as a blocker in the PR state** — `mergeStateStatus` read `BLOCKED`/`UNKNOWN` while `typecheck + lint` had genuinely FAILED: CI rejected the guard on `noUncheckedIndexedAccess` grounds (regex capture groups and array destructures are "possibly undefined"), which cannot reproduce under `tsx --test`. Fixed by narrowing the hex capture through `assert.ok` and computing luminance per-channel instead of destructuring. 🔑 **"Auto-merge armed" is not "will merge" — read `gh pr checks`, not the PR status.** |
| ✅ **DONE — the design language** | 12 screen archetypes + 7 overlay types, drafted by Fable, verified, committed to `prototypes/archetype_*_2026-08-01.html` (5 files, ~8,900 lines). |
| ▶ **STARTED — the port** | ~40 design units. **`design#1` and `design#2` are DONE (2026-08-02, PRs [#4064](https://github.com/iscasasola/setnayan-platform/pull/4064) + [#4065](https://github.com/iscasasola/setnayan-platform/pull/4065)) — do NOT rebuild them.** Everything else is untouched. 🔴 **`design#3` IS NOT NEXT — it is PREMISE FALSIFIED, DO NOT BUILD IT** (see its entry below): the persistent app shell **already ships and is mounted**, and rebuilding it is called *"the paid-twice mistake at its largest scale"* in this same file. ⏭ **WHAT IS ACTUALLY NEXT: `design#4`** — RECONCILE the ~28 existing per-surface prototypes to the terracotta palette + the shipped shell. They are still CORRECT about composition and carry only the old palette. **RECONCILE, NEVER REDRAW.** ⚠ **This row said "`design#3` is next" for ten days while the entry below carried a red DO-NOT-BUILD banner** — the exact read-from-the-middle failure the row above this one warns about, in the same file, about the same gate. Corrected 2026-08-12. |
| ✅ **DONE — the front door + THE SEAM, 2026-08-12** | [`FRONT_DOOR_AND_SEAM_FINAL_2026-08-12.md`](FRONT_DOOR_AND_SEAM_FINAL_2026-08-12.md) + [`prototypes/front_door_and_seam_2026-08-12.html`](prototypes/front_door_and_seam_2026-08-12.html). Answers [`MASTER_DESIGN_PROMPT_2026-08-11.md`](MASTER_DESIGN_PROMPT_2026-08-11.md) in full: finalized front door (desktop + phone × launch-day-empty + busy), the My Home expansion in its real states, and **the sign-in↔public round trip nobody had drawn**. Every figure re-measured against prod + `origin/main`, and **four of the brief's claims were wrong** — Real Stories is also empty (0, not "has content"), there are **8** public tool doorways not 6, **Pakanta has none at all**, and the taxonomy has 15 folders not 14. ⚠ **THIS RAISES AN OWNER QUESTION NOBODY HAS ASKED — see §6.** |
| ✅ **CLOSED — the owner looked, and approved all 19 (2026-08-04)** | Reviewed via the verdict sheet (artifact `36f20665`); **ship-it on every one, no changes, nothing held.** ⚠ **This row said "🔴 BLOCKING — nobody has looked at the prototypes" until 2026-08-06**, while the approval banner sat at the top of this same file — so a session reading the state table got the opposite of a decision recorded two days earlier, and told the owner to go review work he had already signed off. 🔑 **The state table is what gets read, not the banner.** When a gate closes, edit every row that asserts it is open, in the same commit. |

**The locked palette — do not re-derive, do not re-litigate:**
```
page + card   #FDFBF7   cream (page and card are the SAME value; separate with border + shadow)
body text     #2C2A29   espresso        13.82:1 AAA
CTA fill      #C24E25   terracotta      hover #B04722 · active #9D3F1E
CTA label     #FDFBF7   ← CREAM, NOT WHITE. This exact pairing is 4.61:1 AA.
highlight     #A9834B   gold — UI + large text ONLY (3.37:1). Text escalation #8A6B39 (4.79:1).
links + 2nd   #3B4E67   slate indigo    8.22:1 AAA
destructive   #B65A3A   ← NEVER terracotta. Terracotta means "go".
```

---

## 1 · The three reductions that make this finite

401 routes is not 401 designs. In order:

1. **Colour is already fixed on all 401.** Shipped. Every page wears it now.
2. **190 of 401 routes are dynamic** (`[eventId]` · `[slug]` · `[addon]` · `[vendorId]`) ⇒ one design serves
   every instance. 211 static remain.
3. **The big groups repeat ONE shape.** `studio`'s **35** routes are ~20 instances of a single SKU-setup
   page. `website`'s **16** are sub-sections of one editor. `(account)`'s **14** are spokes off one pattern.

⇒ **~40 design units, and the archetypes already answer most of them.**

🔑 **The rule that keeps it finite: design the ARCHETYPE, never the screen.** A route is *archetype + that
route's content*. If a session is about to draw a 401st page, ask which of the ~40 units it belongs to —
and "none" is a finding to report, not a licence to draw.

---

## 2 · Execution items (register schema §3)

```
- id:            design#1                                    ✅ DONE 2026-08-02 · PR #4064
  title:         Port the six-state system (empty · loading · locked · denied · error)
  shipped:       apps/web/app/_components/states/ — surface-state.ts (the resolver),
                 empty-state.tsx · denied-state.tsx · locked-state.tsx · error-state.tsx ·
                 loading-skeleton.tsx, + surface-state.test.ts.
                 ⚠ ADDITIVE ONLY — nothing is MOUNTED on a route yet. Adopting these
                 surface-by-surface is the follow-up, and it is where the live defect
                 actually gets closed.
  the_rule:      resolveSurfaceState() denies unless readPermitted === true. undefined,
                 null and false ALL resolve to 'denied' — because an RLS denial and an
                 empty read are the same value (count: 0, no error). EmptyState's
                 readPermitted prop is typed as the LITERAL true, so false is not
                 expressible. Precedence: loading → error → locked → permission → count,
                 with locked ABOVE permission (a free-tier reader meets the upgrade gate,
                 not a slate denial).
  verified:      216-combination sweep, mutation-tested (loosening to === false fails 2 of
                 4). 6,269/6,269 unit tests, tsc + lint clean.

- id:            design#2                                    ✅ DONE 2026-08-02 · PR #4065
  title:         Port the overlay grammar (sheet · confirm · toast) as shared primitives
  ⚠ THE PREMISE BELOW WAS WRONG — this is the finding, not a footnote:
                 "Replaces ~55 ad-hoc dialog call sites" does not survive measurement.
                 53 files render a dialog and **43 ALREADY route through the shipped
                 primitives** (Sheet · ConfirmDialog · useModalA11y, all from the
                 2026-06-25 checkout audit). The grammar was never missing. Writing
                 "shared primitives" would have duplicated three working files.
  what_shipped:  ADOPTION, ~50 lines. Four overlays claimed aria-modal="true" with no
                 Escape, no Tab trap, no focus restore — papic-buy-shell (GUEST-FACING,
                 opens by itself over the viewfinder at the out-of-shots moment, no
                 Escape at all) · report-page-button (public pages, signed-out visitors) ·
                 wipe-ban-dialog (destructive) · guest-review-qr (had Escape, lacked the
                 trap + restore). All four now call the existing useModalA11y.
  the_guard:     apps/web/lib/modal-a11y-adoption.test.ts — fails on any aria-modal
                 without shared focus management. Pins a 20-file floor so a mis-pointed
                 walk cannot pass silently; exemptions are EXACT PATHS with a written
                 reason, re-validated by a second test. One exemption: life-flash/flash.tsx
                 hand-rolls the complete contract correctly and predates the hook.
  verified:      mutation-tested TWICE (watched failing on the 2 it found, and again
                 after stripping the Papic fix). 6,267/6,267, tsc + lint clean.

- id:            design#3        🔴 PREMISE FALSIFIED 2026-08-02 — DO NOT BUILD THIS
  title:         Persistent app shell + route transitions, behind a flag
  type:          code
  depends_on:    [design#2]  ✅ done
  parallel_safe: no
  safety_gate:   NONE   (the FLAG FLIP to prod is FLAG_FLIP_PROD)
  🔴 **IT ALREADY SHIPS, AND IT IS MOUNTED.** Verified against origin/main 2026-08-02
     by reading the layouts, not the spec:
       · THE SHELL — `app/_components/nav/sidebar-shell.tsx` (`SidebarShell`): desktop
         sidebar with persisted collapse state, sticky top-bar slot, main content
         column. **20 consumers**, mounted in `admin/layout.tsx` AND
         `dashboard/[eventId]/layout.tsx`. The contract never names this file.
       · THE TRANSITIONS — a `template.tsx` in **all four** dashboard trees (`admin`,
         `dashboard/(account)`, `dashboard/[eventId]`, `vendor-dashboard`), each
         wrapping children in `.sn-page-enter` (soft rise, 400 ms, pathname-scoped so
         `?show=all` correctly does NOT replay, with a reduced-motion freeze).
       · MOBILE BOTTOM NAV — `CustomerBottomNav` / `AdminBottomNav` mounted in those
         same layouts.
     In App Router, layout + template IS "navigation repaints the region, never the
     room". The archetype's swap boundary is the app's existing structure.
  ⚠ **AND THE "PRIMITIVES SHIP UNUSED" CLAIM IS WRONG ON ALL FIVE.** `sheet.tsx` has 5
     consumer imports · `bottom-nav.tsx` 32 refs · `sub-nav.tsx` 22 · and
     `nav-slide-controller.tsx` + `app-init-splash.tsx` are both imported by the ROOT
     `app/layout.tsx`, i.e. mounted on every route in the app.
  ⇒ WHAT IS ACTUALLY LEFT: nothing architectural. Any delta between the archetype and
     the shipped shell is styling — duration, spacing, the top-bar's event chip — which
     is **design#4 reconcile work behind the owner-review gate**, not a rewrite.
     Rebuilding this is the paid-twice mistake at its largest scale.

- id:            design#4        ⏭ THIS IS WHAT IS NEXT (design#3 is falsified, not a blocker)
  title:         Reconcile the ~28 existing per-surface prototypes to terracotta + shell
  type:          spec
  depends_on:    []   # was [design#3]; that unit is FALSIFIED, so it blocks nothing
  parallel_safe: yes
  safety_gate:   NONE
  touches:       prototypes/{event_dashboard,vendor_dashboard,admin_hq}_v2_2026-07-15.html + 7 more
  ⚠ These 28 prototypes are STILL CORRECT about COMPOSITION. They carry the OLD palette
    (gold/obsidian CTAs, warm alabaster). RECONCILE, NEVER REDRAW — the owner has paid
    twice for one page. See [[feedback_start_from_existing_code]].

- id:            design#5
  title:         Couple dashboard — Roster · Ledger · Comparison · Gallery
  type:          code
  depends_on:    [design#3]
  parallel_safe: no             # shares the shell
  safety_gate:   NONE
  touches:       dashboard/[eventId]/{guests,vendors,budget,alaala}/*
  named_offenders: vendors/_components/build-compare.tsx ·
                   vendors/_components/plan-budget-accordion.tsx ·
                   guests/_components/guest-list-multiselect.tsx
  preserve:      the four-surface home (PR #3240) is owner-approved — RE-SKIN, never re-conceive

- id:            design#6
  title:         Public doorway pattern + the /pricing delta framing
  type:          code
  status:        ✅ DONE 2026-08-13 — PRs #4417 (doorways) + #4419 (price pages).
                 DO NOT REBUILD EITHER HALF.
  depends_on:    []
  parallel_safe: yes
  safety_gate:   NONE
  touches:       app/{papic,panood,pawebsite,pa3d,palogo,alaala,pricing,features}/*
  ⚠ `/` IS NO LONGER EXCLUDED — the front door replaced the ELN cinematic
     homepage on 2026-08-13 and is LIVE. The exclusion line above it is dead.
  ✅ WHAT WAS ACTUALLY WRONG WITH THE DOORWAYS: not the shell — all eight are
     registered in NAV_ROUTES and already carried SiteChrome + the footer, so
     that half was already done and nothing was rebuilt. It was the COLOUR, and
     because the pages were copy-pasted, every wrong colour was eight pages wide:
     the struck-through half of every differentiator measured **3.06:1 on cream**
     (below the 4.5:1 AA floor) from a hand-typed #9A8F86, and the cards were
     `bg-white/60` — white in all but name — on a cream page.
     🔑 TWO EXISTING CONTRAST GUARDS BOTH MISSED IT AND NEITHER WAS BROKEN:
     `palette-lock.test.ts` checks TOKEN DEFINITIONS (all fine in isolation) and
     `lint-label-on-fill-contrast.mjs` judges only pairings where BOTH sides are
     opaque — the fill was an alpha. The defect lived in the seam.
     `doorway-palette.test.ts` closes it, with NO baseline.
  ✅ /papic + /setnayan-ai joined the shared kit (7 of 8 now mount it); two
     private forks of the archetype are deleted. `/alaala` deliberately did NOT
     — it is the umbrella page, so forcing it through would mean inventing a
     how-it-works panel and a differentiator lede it has never had and deleting
     one of its two CTAs. It takes the archetype's COLOURS from `DOORWAY_TONE`.
  ⚠ THE PRICING FINDING AS WRITTEN HERE WAS HALF WRONG, MEASURED 2026-08-13.
     "The delta pattern ALREADY SHIPS in vendor-benefits.ts" — TRUE, and the
     offender named was the right one. But "the genuine gap is CUSTOMER-side:
     Free → Setnayan AI is not framed as a delta" was NOT the gap: `/pricing`
     had already led that card with "Everything in Free" since it was built.
     🔴 THE REAL CUSTOMER-SIDE GAP WAS A PRICE. Setnayan AI has had TWO prices
     since 2026-08-12 (sign-up ₱1,499 · regular ₱2,499, both live in the catalog,
     the sign-up one already being CHARGED) and no public surface showed the
     second, because `fetchV2CustomerCatalog` never SELECTED the column. And the
     '₱499' fallback behind it was FIVE TIMES off, hidden in the `sku: null`
     category that the runtime drift audit deliberately skips.
     🔑 A BRIEF THAT NAMES A GAP CAN BE RIGHT ABOUT THE SURFACE AND WRONG ABOUT
     THE DEFECT. Re-measure before building what it describes.
  ⚖ THE MATRIX IS KEPT, BEHIND A DISCLOSURE, and this is an OWNER CALL left open:
     a matrix is what he asked for on 2026-07-04, so `/vendors` now LEADS with
     per-plan deltas and the ~450-cell grid sits behind "Compare every tier side
     by side". If he wants the grid gone entirely, that is one line.
     📄 EVIDENCE FOR THAT CALL, checked after the build: the RECONCILED prototype
     `prototypes/for_vendors_2026-07-24.html` — the binding one for this page —
     draws the pricing section as FOUR CARDS, each with a single line naming what
     that tier adds ("Your branded 3D booth and one team seat" · "Market Intel,
     performance insight, and three team seats"). It contains **no matrix at
     all**, and closes on *"Start on Free. Upgrade only for the tools you want."*
     So the shipped result is a SUPERSET of the approved design, and the honest
     reading is that the prototype implies deleting the grid. Deliberately not
     done unilaterally — it reverses a dated owner instruction.
     ⚠ Also noticed, NOT acted on: that prototype's copy says *"a flat 5% on a
     closed booking"*, while the locked taper is 5% → 1% beyond ₱100,000 with a
     ₱50 floor. The prototype is the simplification; `bookingFeeScheduleSummary()`
     (now used by the shipped component) is the accurate one.

🔬 **AND AN ADVERSARIAL PASS OVER design#6's OWN TWO PRs FOUND FOUR REGRESSIONS, ALL
INTRODUCED BY IT** — PR [#4423](https://github.com/iscasasola/setnayan-platform/pull/4423),
merged 2026-08-13. 20 candidates, five lenses, two independent skeptics each; four survived.
`/alaala`'s card hover put gold at **4.42:1 live** (the exact number `_doorway.tsx`'s docblock
states as the reason its own cards avoid that surface) · its docblock claimed it shared the kit's
colours and **there was no import** · `/vendors` printed the word **`Infinity`** to the public ·
and `aiHasSignupPrice` had **zero readers**, so the price page and the price popup quoted
different figures for one product.
🔑 **The guard could not see `/alaala` at all** — it derived its expectations from the shared
constant, which made it strictly stronger for the seven pages that use it and blind to the one
that does not. **That is where the defect went.** Widening it then reproduced the alpha-fill
blind spot it existed to close, and the next cut cried wolf on a file-level match.
⚠ **So "design#6 DONE + verified live" above is true and was not the end of it.** Do not read a
DONE row as evidence that the work was defect-free — read the PR list.

- id:            design#6b
  title:         The SAME 3.06:1 text colour is live on /why-setnayan and the /tour tree
  type:          code
  status:        🔴 FOUND 2026-08-13 while sweeping after design#6. NOT FIXED — out of
                 that unit's scope (8 doorways + price pages), named rather than
                 silently widened or silently dropped.
  depends_on:    []
  parallel_safe: yes
  safety_gate:   NONE
  🔑 WHY IT EXISTS: design#6 removed the hand-typed `#9A8F86` from the eight
     doorways because it measures **3.06:1 on cream — below the 4.5:1 AA floor for
     normal text**. The repo's own rule is "when you fix a route-shaped bug, sweep
     every route with that shape". The sweep found the identical colour still live.
  📏 MEASURED, NOT INFERRED — counted in the HTML actually served by
     `www.setnayan.com` on 2026-08-13:
       /why-setnayan   200 · 6 occurrences   (an `<h3>` SECTION HEADING at text-lg)
       /tour/vendors   200 · 14 occurrences  (labels + body on bg-white/50 cards)
       /tour/gallery   200 · 7 occurrences   (captions at text-xs)
       /tour/seating   200 · 5 occurrences   (an input PLACEHOLDER + captions)
       /tour           200 · 0 in initial HTML — the source has one ("soon" pill) but
                       it did not appear in the served markup; treat as UNCONFIRMED.
     Contrast: 3.06:1 on cream · 3.11:1 on the bg-white/50 cards. All need 4.5:1.
  ⚠ THE `text-lg` HEADING IS NOT EXEMPT. WCAG's large-text allowance needs ≥24px, or
     ≥18.66px BOLD. `text-lg` is 18px at normal weight, so it takes the 4.5:1 floor.
  ⚠ `/tour` HAS ITS OWN PALETTE that predates the terracotta lock (its own files name
     `#1B1A17` ink and `#5F5E5A` body), so this is a PORT UNIT, not a one-line swap —
     do not just find-and-replace the hex without deciding what the tour's surfaces
     are. `--m-slate-2` is the token that clears AA (5.21:1) if the surface is cream.
  🛡 `doorway-palette.test.ts` deliberately scans ONLY the eight doorways plus the
     shared kit. It will NOT catch these. Widening its route list is the cheapest way
     to make this stay fixed once it is fixed.
  ✅ DONE 2026-08-13 · PR #4422. 13 source sites across 9 files → `--m-slate-2`.
     Verified in the served HTML after deploy: all five routes 200 with ZERO
     occurrences, and the `--m-slate-2` counts land exactly on the old defect counts
     (6 · 0 · 14 · 7 · 5). Computed style read in a real browser on production:
     the `text-lg` <h3>s are `rgb(110,106,98)` at 5.38:1, 18px/weight 400; the
     /tour/seating placeholder and its search glyph likewise 5.38:1.
     🔑 THE PORT WAS NOT NEEDED. The deciding fact was in the markup, not the palette:
        NO tour route sets a page background at all — every `<main>` is bare and
        inherits `bg-cream` from the root layout. The tour was already on cream, so
        `--m-slate-2` was correct rather than merely available. The `bg-white/50` card
        fills were deliberately LEFT ALONE: the terracotta lock does not cover /tour,
        replacing them is a redesign not an a11y fix, and the token clears AA on them
        anyway (5.30:1).
     📏 The colour was WORSE than this entry said, on surfaces nobody had listed:
        2.98:1 on `#FBF8F1` and 2.93:1 on `#FBF6EA` — below even the 3:1 non-text floor.
     🛡 Widening `doorway-palette.test.ts` was NOT the cheapest way after all, and the
        suggestion above is withdrawn. That guard bans the ACT (any raw literal, no
        baseline), which is affordable only because the doorways were ported in the same
        unit; /tour carries ~290 hand-typed hexes, so widening it would fail on its first
        run and force a ~290-line baseline — "a bill, not a decision". New
        `lib/public-page-text-contrast.test.ts` checks the OUTCOME instead (whatever a
        page names for text must come out readable), still with no baseline, and scans
        RECURSIVELY — 9 of the 13 occurrences were in `_components/` subfolders that the
        doorway guard's flat `readdirSync` never opens.

- id:            design#6c
  title:         The SHARED FOOTER measures 2.21:1 — worse than design#6b, on every page
  type:          code
  status:        🔴 FOUND 2026-08-13 while verifying design#6b in a real browser. NOT
                 FIXED — different colour, different component, and it is SHARED CHROME,
                 so it is named rather than silently widened into that PR.
  depends_on:    []
  parallel_safe: yes
  safety_gate:   OWNER — this is the home-reskin design system, not one page.
  📏 MEASURED by computed style on `www.setnayan.com/tour/seating` after the design#6b
     deploy, then confirmed against source:
       `--hr-grey-2: #a8a4a0` (apps/web/app/_components/home/home-reskin.css:25)
       on the `.hr-footer` surface `#F2F2F0` = **2.21:1**, at 12px weight 400.
     For scale, the colour design#6b was raised to fix measured 3.06:1. This is worse.
  🩸 BLAST RADIUS IS EVERY PUBLIC PAGE, not a route list. `.hr-foot-base` lives in
     `_components/marketing/reskin-footer.tsx`, reached through `site-chrome.tsx`,
     `site-footer-chrome.tsx` and `legal-chrome.tsx` — marketing AND legal. The two
     strings are the copyright line and the **Data Protection Officer contact**, which
     is the one line on the site a regulator would look for.
  ⚠ NOT A ONE-LINE SWAP EITHER. `#a8a4a0` is also hand-typed in ~10 other places
     (`HomeOverlays.tsx`, `alaala-editorial-overlay.tsx`, `panood-demo-overlay.tsx`,
     `plan3d-guest-view.tsx`), and `--hr-grey-2` is redefined a second time at
     home-reskin.css:1930. Decide whether the TOKEN moves or only the footer's use of
     it — moving the token changes the home reskin everywhere it is read.
  ✅ `--m-slate-2` (#6E6A62) clears it at 4.80:1 on that footer surface.
  🛡 `lib/public-page-text-contrast.test.ts` (new in PR #4422) does NOT catch this:
     it scans `app/why-setnayan` and `app/tour` only, and this lives in
     `_components/`. Adding the shared chrome to its route list is the natural
     follow-on once the colour is decided.

- id:            design#7
  title:         The five genuine gaps
  type:          code
  depends_on:    [design#3]
  parallel_safe: yes
  safety_gate:   NONE
  items:         /explore (3 routes) · Papic public sub-tree (11) · auth screens (~8:
                 login/signup/reset/claim/join) · ONBOARDING CONTENT (the Wizard archetype
                 is only the chassis — the persona-quiz questions/order/reveal are a
                 separate content design) · guided tour (5 routes, 11 mini-tours)

- id:            design#8
  title:         Vendor dashboard — EXTEND the 4 existing prototypes
  type:          code
  depends_on:    [design#3, design#4]
  parallel_safe: no
  safety_gate:   NONE
  touches:       vendor-dashboard/**

- id:            design#9
  title:         Admin console table
  type:          code
  depends_on:    [design#3]
  parallel_safe: yes
  safety_gate:   NONE
  touches:       admin/**
  note:          ~95 of 107 admin routes collapse into ONE archetype. 33 of the app's 45
                 raw <table> files live here. Internal-only, zero customer impact ⇒ SHIPS LAST.

- id:            design#0-GATE                              ✅ CLOSED 2026-08-04 — ALL 19 SHIP IT
  title:         OWNER REVIEWS THE 5 PROTOTYPES
  outcome:       Owner reviewed the 12 screen shapes + 7 overlay types via the verdict
                 sheet and approved EVERY ONE. No changes, nothing held. design#4 · #5 ·
                 #6 · #7 · #8 · #9 are therefore ALL UNBLOCKED — and note design#3 was
                 falsified (the shell already ships and is mounted), so nothing that
                 "depends_on: [design#3]" is actually waiting on anything.
                 ⚠ The SHAPE was approved, not any screen's pixels. A delta between a
                 ported screen and its archetype is a DEFECT IN THE PORT.
  type:          decision
  depends_on:    []
  safety_gate:   OWNER_DECISION
  ⚠ BLOCKS #4 #5 #6 #8 #9 (everything aesthetic). Does NOT block #1 #2 — their
    correctness is functional. Nobody has looked at these files yet; all verification
    was DOM-level because the shared browser pane blanked while backgrounded.
```

---

## 3 · Suggested order

| Phase | Items | Note |
|---|---|---|
| ✅ 0 | Palette | Done — and the guard that locks it merged 2026-08-02 (#4030). |
| ✅ 1 | `#1` + `#2` | Done 2026-08-02 (#4064 + #4065). ⏭ The states primitives are built but **not mounted anywhere** — adopting them per surface is open follow-up work. |
| ✅ 2 | `#3` shell | **Already shipped and mounted — premise falsified 2026-08-02. Do not build.** See the item above. |
| ✅ 3 | `#0-GATE` owner review | ✅ **CLOSED 2026-08-04 — all 19 approved, no changes.** Nothing is gated on the owner any more; #4 #5 #6 #8 #9 are all open work. ⚠ This row read "🔴 THE ONLY THING BLOCKING THE PROGRAMME NOW" until 2026-08-06 — two days after the gate closed, and with the approval banner sitting at the top of this same file. |
| 4 | `#4` reconcile · `#6` public | Cheapest real progress. |
| 5 | `#5` couple → `#7` gaps → `#8` vendor → `#9` admin | Admin last. |

> **Where the programme actually stands after 2026-08-02:** the two ungated build items
> are done, the third turned out to be already shipped, and **everything that remains is
> behind the owner-review gate.** The next unit of progress is the owner opening the five
> `prototypes/archetype_*_2026-08-01.html` files — not more code.

---

## 4 · Traps specific to this stream

- 🪤 **Empty ≠ Locked ≠ Denied — three different frames, not three tints.** An RLS denial and an empty read
  are the **same value**: `count: 0`, no error. A surface once printed *"no requests yet"* over **3 real
  pending rows**. Any UI deriving state from a count must first prove the reader was **permitted**.
- 🪤 **Size the CTA against CREAM, never white.** `#C75026` passes on white (4.56:1) and **FAILS** on the
  cream the app actually renders (4.41:1). A white-background contrast check waves the failure through.
- 🪤 **There is NO "tech blue" in this codebase.** Every blue is Meta's sanctioned Facebook mark on the
  OAuth/photo-import controls, or a `paperwork` status chip. Do not go hunting for one to replace.
- 🪤 **The app is LIGHT-ONLY** since 2026-06-04 (`theme-provider.tsx:11`, `setMode` is a no-op, `.dark` is
  stripped before paint, every `dark:` variant is inert). **Design ONE theme.** Obsidian surfaces (Alaala,
  gallery, lightbox) are dark because *those surfaces* are dark, not because a mode exists.
- 🪤 **A UX win that breaks the blueprint is a REGRESSION.** Marketing = top nav; logged-in app = bottom nav
  (mobile) / rail (desktop). **Never cross them.** A gaming site moved its mobile menu into the thumb zone —
  measurably better ergonomics — and reverted because nobody could find it.
- 🪤 **Never write a literal SETNAYAN price.** Prices come from the live catalog. A peso figure in a
  component is a defect. (A customer's own budget amount is data, not our pricing — that's fine.)
- 🪤 **A test that cannot fail is worse than none.** Found twice on 2026-08-01: a palette guard comparing
  hand-typed hexes would drift green, and an overlay smoke test "passed" because the overlay never opened.
  Prove the assertion fails before trusting it. **A file-walking guard has a third version of this failure:
  point it at the wrong root and it scans zero files and passes forever** — `modal-a11y-adoption.test.ts`
  pins a minimum scanned-file count for exactly that reason.
- 🪤 **"Auto-merge armed" is not "will merge."** PR #4030 sat OPEN for a day with auto-merge on and a
  genuinely FAILED `typecheck + lint`; the PR's own `mergeStateStatus` said `BLOCKED`/`UNKNOWN` and named
  nothing. **Read `gh pr checks <#>`, never the PR state**, and confirm a landing with
  `git merge-base --is-ancestor`.
- 🪤 **CI's typechecker is stricter than `tsx --test` — `noUncheckedIndexedAccess` is the usual culprit.**
  A regex capture group (`m[1]`) and an array destructure (`const [r,g,b] = …`) are "possibly undefined"
  to `tsc` and completely fine at runtime, so a test file can pass locally 8/8 and fail the build. Narrow
  through `assert.ok`, or index inside a helper.
- 🔑 **VERIFY A CONTRACT ITEM'S PREMISE BEFORE BUILDING IT.** design#2 said "~55 ad-hoc dialog call
  sites"; the real number was **10, of which 43 already used the shipped primitives**. Building what it
  asked for would have duplicated three working files. The contract's file:line targets are sound; its
  claims about how much is MISSING are audit-time inferences. Count first.

---

## 5 · Verification reality

- **`npm run build` CANNOT run locally** — 7 GB heap → SIGTERM 143. **CI is the sole detector for an RSC
  break.** `tsx --test` is not a typechecker and `tsc` is not a bundler; both missed one.
- **`tsc` needs `--max-old-space-size=8192`.** A crashed run once "found" 128 errors that were GC output.
  **Never trust the error count of a crashed run.**
- **Diff against `origin/main`, never a local `main` ref** — a stale local ref made merged code look like
  contamination on 2026-08-01.
- Standing PR default: `gh pr merge <#> --auto --merge` immediately after `gh pr create`.

---

## 6 · What is deliberately NOT in scope

| Excluded | Why |
|---|---|
| **Home `/`** | ⚠️ **THIS EXCLUSION IS NOW IN QUESTION — OWNER_DECISION, raised 2026-08-12, do not resolve it in code.** It reads "ELN cinematic reskin, owner-approved 2026-06-29; redrawing it is the paid-twice mistake" — and that was true until the owner spent 2026-08-07 and 2026-08-11 **choosing a front door**: first a Facebook-shaped concept, then the YouTube-shaped one that superseded it, whose own correctness pass says *"One front door."* The 2026-08-12 pass **drew that front door in full**. 🔑 **Nobody has ever said out loud that shipping it RETIRES the approved ELN cinematic homepage** — the two cannot both be `/`. Drawing it was correct either way; **landing it is a reversal of an owner lock and needs the owner to say so.** Until he does, the drawing is a design, not a build order. |
| **Guest event sites `/[slug]`** (11 routes) | They run the couple's own mood-board theme system, deliberately outside the app palette. |
| **Seat plan 2D/3D** (3 routes) | Locked coordinate contract + 14-test parity suite. Extend only. |
| **The four-surface couple home** (#3240) | Owner-approved. Re-skin, never re-conceive. |
| **Merkado internals** | Its own locked system. |
| **Typography** | Hanken Grotesk + Space Mono. Locked through every palette turn. Do not touch. |
