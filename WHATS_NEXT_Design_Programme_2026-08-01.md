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
  depends_on:    []
  parallel_safe: yes
  safety_gate:   NONE
  touches:       app/{papic,panood,pawebsite,pa3d,palogo,alaala,pricing,features}/*
  ⛔ `/` IS EXCLUDED — ELN cinematic reskin, owner-approved 2026-06-29.
  🔑 THE PRICING FINDING: the delta pattern ALREADY SHIPS in
     _components/home/vendor-benefits.ts (grouped + "Everything in Solo, plus:").
     The job is PRESENTATION, not modelling. The offender is vendor-tier-matrix.tsx —
     a matrix restates every row per tier, which is the haystack the pattern kills.
     The genuine gap is CUSTOMER-side: Free → Setnayan AI is not framed as a delta.

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
| **Home `/`** | ELN cinematic reskin, owner-approved 2026-06-29. Redrawing it is the paid-twice mistake. |
| **Guest event sites `/[slug]`** (11 routes) | They run the couple's own mood-board theme system, deliberately outside the app palette. |
| **Seat plan 2D/3D** (3 routes) | Locked coordinate contract + 14-test parity suite. Extend only. |
| **The four-surface couple home** (#3240) | Owner-approved. Re-skin, never re-conceive. |
| **Merkado internals** | Its own locked system. |
| **Typography** | Hanken Grotesk + Space Mono. Locked through every palette turn. Do not touch. |
