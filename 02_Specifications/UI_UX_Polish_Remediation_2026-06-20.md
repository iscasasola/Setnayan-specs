# UI/UX Polish Remediation — 2026-06-20

> **Source:** owner-supplied YouTube reference *"7 UI/UX mistakes that SCREAM you're a beginner"* (8 mistakes incl. bonus). Audited against live `apps/web` @ worktree `fix-weddingdate` + `www.setnayan.com`. This doc is the build spec for the gaps the audit found. Reviewable BEFORE any cross-cutting PR (per owner "write a spec doc first").

## 0. Audit verdict (what the video flags vs. what we ship)

| # | Mistake (video) | Setnayan verdict | Action |
|---|---|---|---|
| 1 | User flow (missing search/skip/back) | ⚠️ mostly strong; **2 real gaps** | PR3 |
| 2 | Overusing effects (shadow/glow/gradient) | ✅ strong — soft-gray shadow tokens, same-family gradients, disciplined palette | none (1 stray `box-shadow` to token-ize, trivial) |
| 3 | Spacing / breathing room | 🟡 taste-dependent, not code-verifiable | owner eyes-on (see §6) |
| 4 | Inconsistent components (corner radius) | ❌ **biggest objective tell — no radius token, ~190 ad-hoc radii** | **PR1** |
| 5 | Icons (mixed library/stroke) | ✅ single library (lucide); ⚠️ stroke-width drift (~7–11% outliers) | PR1 (mop-up) |
| 6 | Redundant elements | ✅ clean; empty states excellent | none |
| 7 | Interactive feedback | ⚠️ **silent success — no app-wide toast** | PR2 |
| 8 | Charts (bonus) | 🟡 unverified | owner spot-check budget/admin |

Evidence: shadow tokens `globals.css:655-657` (soft `rgba(30,34,41,.05–.28)`); lucide-react in 469 files, 0 mixed libs; empty states in `guests/messages/budget/documents` pages; realtime unread badges (`unread-bell-badge.tsx`, `unread-messages-badge.tsx`); `SubmitButton` via `useFormStatus`; 165 `loading.tsx`.

---

## PR1 — Radius token scale + lint guard  ❌→✅  (the headline fix)

### Problem (CORRECTED 2026-06-20 after code grounding — the first-pass "no radius token" claim was WRONG)
A radius token scale **already exists** — `--m-r-xs/sm/md/lg/xl/full` = `4/8/14/22/36/999px` (`globals.css:646-651`) — **but it is used only 6 times** (effectively abandoned). The real disease is **three competing radius systems**:
1. **`--m-r-*` tokens** — the designed scale, ~6 uses. Dead.
2. **Tailwind default scale** — `borderRadius` is **not configured** in `tailwind.config.ts`, so ~4,200 `rounded-*` classes resolve to Tailwind's defaults (`lg=8 · xl=12 · 2xl=16 · 3xl=24 · full=9999`). This **disagrees** with the tokens (token `md=14` ≠ any Tailwind tier).
3. **Ad-hoc hardcoded** — 213 CSS `border-radius:Npx` + 27 `rounded-[Npx]` + 64 inline `borderRadius:N` = **~304 sites** at 8/9/10/11/12/13/16/20px.

So a "small component" is `rounded-lg` (8px) in one place, `border-radius:11px` in another, `rounded-[10px]` in a third — the exact amateur signal the video flags. **The good news:** a token scale already exists to standardize on. **The catch:** unifying is a *visual* decision (which scale wins; whether corners visibly change), NOT a safe mechanical codemod — so it needs owner sign-off (see "Approach fork" below).

### ✅ RESOLVED 2026-06-20 — owner chose **B (softer corners)** after an A/B preview · **PR1 SHIPPED #1899** (auto-merge armed)
Tailwind `borderRadius` wired to `--m-r-*`; 291 ad-hoc radii codemod'd across 34 files; latent `--m-radius-md` (undefined → square corners) renamed to `--m-r-md`; new `lint:radius` guard + strict CI job (clean at landing). Print/doc routes excluded.

### Approach fork — OWNER DECISION REQUIRED (taste half)
| Approach | What happens | Visual change | Verdict |
|---|---|---|---|
| **A — keep current look, unify + lock** | Adopt the *current* Tailwind-default scale as canonical (express it via tokens). Leave the ~4,200 `rounded-*` classes as-is. Codemod only the ~304 ad-hoc radii → nearest current value. Retire the 6 stray `--m-r-*` uses. | Only the ~304 ad-hoc sites shift slightly (±1–4px). No app-wide redesign. | **Recommended** — achieves the video's consistency goal with minimal risk |
| **B — adopt the softer designed token scale** | Point Tailwind `borderRadius` at `--m-r-*` (8→14, 12→14, 16→22…). | **Thousands** of elements get visibly rounder. A deliberate redesign. | Needs owner eyes-on / before-after |
| **C — show before/after first** | Build a side-by-side of A vs B on sample surfaces (button/card/sheet/modal) before committing. | none yet | safest if undecided |

### Lint guard (after the approach is chosen)
New `lint:radius` (mirrors `scripts/lint-nav-icon-source.mjs` / `lint-bottom-nav.mjs`): forbid arbitrary `rounded-\[[0-9]` + numeric `border-radius:`/`borderRadius:` outside `globals.css` + `tailwind.config.ts`. Start advisory; promote to required once clean.

### Lint guard (matches the existing `lint-nav-icon-source` / bottom-nav pattern)
New ESLint/grep guard `lint-radius-token`:
- **Forbid** arbitrary `rounded-\[[0-9]` in `className`.
- **Forbid** numeric `border-radius:` / `borderRadius:` outside `globals.css` + `tailwind.config`.
- Allow the tokens + the Tailwind named scale.
Start **advisory**; promote to a required check once the tree is clean (same promotion path as nav-icon guard).

### Acceptance
- 0 arbitrary radii outside the allow-list; `tsc 0`, `lint 0`, production build green; visual diff on 5 sample surfaces (button, input, card, sheet, pill) shows no regression.

---

## PR2 — App-wide success toast  ⚠️→✅  (close the "silent success")

### Problem
`SubmitButton` shows *pending* well, but on **success** most actions just `revalidatePath` and refresh — nothing visibly says "Saved." A proper toast exists only on booking-cancel (`cancel-booking-button.tsx:306-359`, `role="status"` + `aria-live="polite"` + 5s auto-dismiss). That's the video's mistake-7 failure mode on the success side.

### Decision — extract the existing pattern into a shared primitive (zero new dep)
Per the OSS/self-host preference and because a working, accessible toast already exists, **extract** it rather than add a dependency:
- `app/_components/toast/toaster.tsx` — a single `<Toaster>` mounted in the root layout; container is `role="status"` `aria-live="polite"`, bottom-center, stacks, auto-dismiss 5s, freezes under `prefers-reduced-motion`.
- `useToast()` / `toast.success(msg) | toast.error(msg) | toast.info(msg)` — context-based, no prop-drilling.
- Variants reuse `--m-*` tokens + the new radius tokens; success = champagne-gold check, error = mulberry.
- *(Alternative if richer behavior wanted later: `sonner` (MIT). Not chosen for V1 — avoids a dep and keeps the existing look.)*

### Wiring (incremental, not a big-bang)
Add `toast.success(...)` to the highest-traffic happy paths first: guest add/edit, RSVP save, budget payment logged, profile/settings save, vendor inquiry sent, seating save. Server actions return a status the client surfaces; do **not** convert pessimistic actions to optimistic in this PR (out of scope).

### Acceptance
- One `<Toaster>` mounted; ≥6 happy paths fire a success toast; screen-reader announces; reduced-motion respected; `tsc 0 / lint 0`.

---

## PR3 — Seating + budget search/filter  ⚠️→✅  (the two flow gaps)

### 3a. Seating chart — guest search (highest felt-pain)
At 200–300 guests, the seating editor's guest panel has **no search-by-name** when dragging guests onto tables. Add a debounced client-side search input atop the unassigned-guest list in `seating/_components/seating-editor.tsx` (filter by name; keep drag behavior intact; show "no guest matches" inline, never a blank panel). No schema change.

### 3b. Budget — vendor filter
`budget/page.tsx` itemizes vendors with no search. Add a lightweight filter (by vendor name / service category) over the itemization list, and a "Back to vendors" link on the "Review my picks" summary (currently relies on chrome nav). No schema change.

### Acceptance
- Seating: typing filters the guest panel live; drag still works; empty-match state present. Budget: filter narrows the list; back-link present. `tsc 0 / lint 0`.

---

## §6 — Owner eyes-on items (taste half — NOT code-decidable)
These need a human looking at rendered pixels; flagged, not auto-fixed:
- **Spacing (mistake 3):** do dense surfaces "breathe"? Spot-check dashboard cards + forms on mobile.
- **Charts (mistake 8):** budget breakdown + any admin dashboard chart — real axes, no value-obscuring rounded bar-tops, bar count = data count.
- **Effect taste (mistake 2):** confirm no gradient/shadow reads as heavy on hero / save-the-date.

## PR4 — back-button standardization + unwanted-text scan (NEW · added 2026-06-20 from owner observation)
Owner reports misaligned/redundant back buttons + unwanted text in the live app. Code audit confirms the back-button half: **no shared `<BackButton>` component**; back is drawn with TWO icons (`ArrowLeft` ×80 files, `ChevronLeft` ×15) at inconsistent sizes/strokes/margins (`h-3.5 w-3.5 strokeWidth={2}` vs `h-4 w-4` vs `mr-1 h-4 w-4`). = video mistake #4 (same control, different design) + #6 (redundant). Fix: one `<BackButton>` primitive (single icon/size/placement), sweep call-sites, drop redundant back-affordances where browser/native back already covers it. "Unwanted text" is a perception/taste call — needs owner-pointed examples; code scan can only catch obvious leftovers (placeholder/TODO/debug/duplicate labels).

## PR5 — shared `<Button>` primitive + sweep (NEW · added 2026-06-20 from owner "how about the buttons on the dashboard?")
Code audit: **NO shared `<Button>` component** (only purpose-specific `submit-button`/`copy-button`/`cancel-booking-button`). The dashboard has **550 hand-rolled `<button>`s** (289 primary/mulberry), and the *same* primary CTA appears in **110 distinct class strings** — 5 corner tiers (`rounded-md/lg/full/xl/2xl`), 5 vertical + 5 horizontal paddings, 3 text sizes. = video mistake #4 at the largest scale in the app (bigger than the radius issue PR1 already fixed). **PR1 did NOT resolve this** — it unified each radius token's *value*, but buttons still choose different tiers/paddings/sizes, so they still look uneven next to each other. Fix: one `<Button>` primitive (variant = primary/secondary/ghost/danger · size = sm/md · single radius · built-in pending+disabled states, folding in the existing `SubmitButton` behavior) + sweep the 550 call-sites. ⚠ **Highest conflict risk** — directly overlaps in-flight #1733 (`button audit · SubmitButton sweep across 61 files`); must fold into / follow that work, never run a competing sweep.

## Status & sequencing (UPDATED 2026-06-20 — owner chose "hold all until audits merge")
- **PR1 — radii — ✅ SHIPPED #1899** (auto-merge armed). Safe; touched only radii (no in-flight PR touches those).
- **PR2 (toast) · PR3 (seating+budget search) · PR4 (back-buttons) · PR5 (shared Button primitive + sweep) — ⏸ HELD.** Owner-locked sequencing decision: do NOT build until the parallel UI-polish audits land, then do them in one clean sweep. PR5 is the most conflict-prone (overlaps #1733) — it MUST follow/fold into #1733, not compete.
- **Resume trigger / dependency:** PRs **#1733** (`button audit · SubmitButton sweep across 61 files`) AND **#1732** (`Loading screens audit`) both merged to `main`. (#1865 sidebar-nav, #1685 seat-pass are related but not hard blockers.) ⚠ As of 2026-06-20 both #1733/#1732 are STALE (last activity Jun 18, sessions not running) — the hold may be long; owner may need to nudge/close them.
- Each held PR will branch off **latest** `origin/main` (post-merge), own worktree + PR + auto-merge + `changelog.d/` fragment. Toaster mounts in the **root** layout (avoids #1693's dashboard-layout edit). No pricing/scope/schema changes — SPEC IMPACT design-system/UX only.
- Conflict-watch is now a standing rule: pre-flight `gh pr list` + `list_sessions` before building/pushing (memory `feedback_setnayan_watch_parallel_sessions`).
