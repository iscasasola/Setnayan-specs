# WHATS_NEXT — Design Programme: palette shipped, archetypes drafted, ~40 units to port
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
| ✅ **DONE — colour, on all 401 routes** | PR #3988 merged. Terracotta palette resolves from CSS vars ⇒ **1,263 `bg-cream` call sites** turned over with **zero component edits**. Locked by `apps/web/lib/palette-lock.test.ts` (8 tests, derives contrast from live tokens). |
| ✅ **DONE — the design language** | 12 screen archetypes + 7 overlay types, drafted by Fable, verified, committed to `prototypes/archetype_*_2026-08-01.html` (5 files, ~8,900 lines). |
| ⏸ **NOT STARTED — the port** | ~40 design units. **Nothing from the archetypes has entered `apps/web`.** |
| 🔴 **BLOCKING — nobody has looked at the prototypes** | All verification was DOM-level + static analysis; the shared browser pane blanked while backgrounded. Static checks prove tokens and motion budgets. They cannot tell you whether it is *good*. **Owner review is the gate before porting anything aesthetic.** |

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
- id:            design#1
  title:         Port the six-state system (empty · loading · locked · denied · error)
  type:          code
  depends_on:    []
  parallel_safe: yes
  safety_gate:   NONE
  touches:       apps/web/app/_components/states/* (new) · no existing file rewritten
  verify:        tsx --test + next lint; CI production build is the ONLY RSC detector
  why_first:     Prod is PRE-LAUNCH-EMPTY — states 2-5 are what every user meets before
                 they ever see a populated screen. Empty and Denied are currently
                 indistinguishable, which is a LIVE defect (see §4). Correctness here is
                 FUNCTIONAL, not aesthetic ⇒ it does NOT need the owner-review gate.

- id:            design#2
  title:         Port the overlay grammar (sheet · confirm · toast) as shared primitives
  type:          code
  depends_on:    []
  parallel_safe: yes            # disjoint files from #1
  safety_gate:   NONE
  touches:       apps/web/app/_components/sheet.tsx · confirm-dialog.tsx · toast/*
  verify:        tsx --test + next lint + a11y (focus trap, aria-modal, focus return)
  note:          Replaces ~55 ad-hoc dialog call sites. Prototype
                 prototypes/archetype_overlays_2026-08-01.html has a working engine +
                 25 behavioural assertions already written against it.

- id:            design#3
  title:         Persistent app shell + route transitions, behind a flag
  type:          code
  depends_on:    [design#2]
  parallel_safe: no
  safety_gate:   NONE   (the FLAG FLIP to prod is FLAG_FLIP_PROD)
  touches:       apps/web/app/dashboard/**/layout.tsx · template.tsx · nav/*
  verify:        CI production build (cannot run locally — see §5)
  ⚠ THE ONE ARCHITECTURAL CHANGE in the whole programme. Changes how 297 logged-in
    routes render. Primitives already ship UNUSED: _components/sheet.tsx,
    nav/bottom-nav.tsx, nav/sub-nav.tsx, nav/nav-slide-controller.tsx,
    app-init-splash.tsx. Do NOT write new ones without reading those first.

- id:            design#4
  title:         Reconcile the ~10 existing per-surface prototypes to terracotta + shell
  type:          spec
  depends_on:    [design#3]
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

- id:            design#0-GATE
  title:         OWNER REVIEWS THE 5 PROTOTYPES
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
| ✅ 0 | Palette | Done |
| **1** | `#1` + `#2` in parallel | **Start here.** No owner gate, disjoint files, both fix live defects. |
| 2 | `#3` shell | The architectural one. Flag-dark. |
| 3 | `#0-GATE` owner review | Unblocks everything aesthetic. |
| 4 | `#4` reconcile · `#6` public | Cheapest real progress. |
| 5 | `#5` couple → `#7` gaps → `#8` vendor → `#9` admin | Admin last. |

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
  Prove the assertion fails before trusting it.

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
