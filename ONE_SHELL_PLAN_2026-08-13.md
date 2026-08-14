# One shell — the dashboards converted for the desktop view · 13 August 2026

> **Owner, 2026-08-13:** *"the sidebar should stay. look at here as we navigate around. what you
> did was jumping back to the old dashboards. so what we want to see the dashboards converted for
> this desktop view."* — sent with three YouTube screenshots (his channel · a subscribed channel ·
> Watch history) in which **the left rail never leaves.** Confirmed: *"yes exactly!"*
>
> Planned with Fable, verified against `origin/main` `11721dfa2`. **The plan corrected the brief
> in eight places** — the five that change what gets built are below.

---

## 0 · What I had wrong, and what it changes

| Claim | Truth | Why it matters |
|---|---|---|
| "SidebarShell has 16 consumers / 20 mounts" | **THREE real mounts** — `dashboard/[eventId]/layout.tsx` · `admin/layout.tsx` · `vendor-dashboard/layout.tsx` | The 16 and the programme doc's 20 count **string hits in comments, CSS and tests**. The conversion is far smaller than it looked. |
| "mounted in `dashboard/layout.tsx` and `(account)/layout.tsx`" | **Both are deliberately chrome-less** — the 2026-06-14 chrome retirement, and owner rulings 2026-07-09/13: *"we do not want side bar and menu bars here"* | Converting them **reverses an owner lock**. Must be logged, not slipped. |
| "two palettes, the sharpest conflict" | **Mostly the same palette already.** Front-door cream `#FDFBF7` · ink `#2C2A29` · line `#E1DCD1` are **byte-identical** to the app's tokens, and the app's nav-active accent is **already gold `#8A6B39`** (owner-locked 2026-07-12: *"chrome and content now share the one gold decorative family"*) | Only **four** real deltas: button colour · chrome typeface · surface treatment · rail width. **A rail contains no CTA buttons**, so the conflict largely dissolves. |
| — | **The front-door rail has NO active-route logic.** `Home` is hardcoded `data-on="true"` | Without wiring the shipped `match-path.ts`, **every one of 296 pages lights "Home"** — wrong everywhere, and nothing throws. |
| — | **The native apps can never reach `/`** — middleware bounces Capacitor/Tauri off marketing paths (owner-locked 2026-06-10, login-first) | The shell must mount **in the dashboard layouts**, never "route everyone through `/`". |

**And this is NOT `design#3`.** That unit said *build a persistent app shell* and was falsified
because persistence, transitions and mobile navs already ship. **That falsification stands** —
nothing here rebuilds them. The order is about **which chrome the shipped structure wears, and
where the seam sits.** The paid-twice mistake here would be rebuilding the rail's structure; the
ordered work is re-skinning and re-mounting it.

---

## 1 · The shape

**The front-door shell becomes the shared chrome. `SidebarShell`'s mounting pattern survives as
the structure.** Neither file is deleted on day one.

`front-door-shell.tsx` already accepts `children` into its content column by design — the work is
to **generalize it in place**: parameterise the rail groups, add a slot for a per-surface context
group, and wire real active-row matching. Not a new component.

**No single layout can wrap `/` plus the three dashboard trees** without also catching marketing,
`/login` and the guest sites — the only shared ancestor is the root layout. So the shell mounts
**per tree**, exactly as `SidebarShell` does now.

**Two levels in one rail — the rail PUSHES a group, it does not swap.** Inside an event:
destinations → My Home (account rows **stay visible**) → **"In this event — {name}"** (Overview ·
Guests · Marketplace · Studio · Launch, then Schedule · Seat plan · Budget). The Marketplace and
Studio groups collapse away on event surfaces — they are front-page furniture.
⚠ **This is the one place the new ask and the approved seam prototype diverge** (the prototype
draws a wholesale swap). It gets an owner look at the slice-1 screen.

---

## 2 · The slices — 296 pages, zero route moves, chrome only, **desktop ≥1024 only**

Mobile already has its locked bottom-nav grammar; converting it would be a blueprint regression.

| Slice | Scope | Why this order |
|---|---|---|
| **0 · the proof** ✅ **DONE 2026-08-14** | **~15 pages** — the events board + the account spokes | **SHIPPED — PR [#4429](https://github.com/iscasasola/setnayan-platform/pull/4429), merge `2c607805e`, verified an ancestor of `origin/main`.** Do NOT rebuild it. `DECISION_LOG.md` 2026-08-14. **Exactly what he pressed when he complained.** ⚠ One correction to this row's own premise: these layouts mount no RAIL chrome, but `(account)` does render a slim top bar and the launcher page renders its own one-line rail — both were **kept**, and the rail was added beside them, because that launcher rail carries the ⌘K command bar and the only sign-out on the surface. The app variant therefore ships **rail-only, no top bar**. |
| 1 | event tree, ~110 pages | Carries the two-level owner look |
| 2 | vendor-dashboard, 63 | Mechanical repeat |
| 3 | admin, 108 | Internal-only, ships last — and must move ~10 `after()` sweep jobs verbatim |
| 4 | retirement | Delete `sidebar-shell.tsx`, the collapse key, the Atelier glass with no consumers |

---

## 3 · What breaks SILENTLY — the list to build against

1. 🔴 **The cron-free jobs.** Three ride on `/`, ~10 on `admin/layout.tsx`. Drop an `after()` line
   in a rewrite and anniversary digests and retention sweeps stop **with no error anywhere**.
2. 🔴 **`sn-vt-page` / `data-shell-main`.** SidebarShell wraps content at **all** widths; the
   mobile nav slide freezes everything except that element, and docked-subnav padding keys off it.
   A "desktop-only" swap that removes SidebarShell removes them **at mobile widths too**.
3. **Active-row truth** — see above: 296 pages all lighting "Home".
4. **Mobile double-render.** The front-door top bar renders at all widths on `/`. On converted
   signed-in surfaces below 1024 the rule is bottom-bar-only — **never both**.
5. **Badges at 72px.** The icon strip hides counts; the guest-count badge vanishes at that width.
   Decide it, don't discover it.
6. **Nav-registry bypass.** Render labels without `getNavSlotMap()` and admin label edits silently
   stop applying on desktop while mobile still obeys them — two answers to one question.
7. **ISR in the wrong direction.** The session-reading shell must mount on `/` and signed-in trees
   ONLY — extending it to blog/realstories/doorways silently de-caches them.

## 4 · What NOT to convert

- **The `/[slug]` guest sites (11 routes)** — the couple's own mood-board theme, owner-excluded
  from the app palette. **Guests are not "in the app." No rail, ever.**
- **Marketing and the eight tool doorways.** The rail *links to* them, which makes them look like
  citizens. They are top-nav surfaces by the never-crossed blueprint rule, and cached public pages
  the shell would de-cache.
- **Full-bleed working surfaces stay full-bleed inside the content column**: the website editor,
  seat-plan 2D/3D (locked coordinate contract — verify the canvas math is container-relative
  before slice 1), Live Studio control, day-of mode. Plus `/login` and `/onboarding` — the seam's
  whole point is that sign-in happens **over** pages, not inside a chrome.

---

## 5 · OWNER DECISIONS — four, none blocking slice 0

> **STATUS after slice 0 shipped (2026-08-14).** #1 is **CLOSED** — the
> supersession is logged (`DECISION_LOG.md` 2026-08-13/14) and both layouts now
> cite it inline. #2 and #3 are **STILL OPEN and were deliberately NOT decided
> in code**: the app variant renders no top bar, so there is no "+ Create"
> button in the shared chrome yet, and `[data-chrome='app']` **unsets** the
> inherited typeface so the rail keeps the front-door face while content columns
> keep Hanken — the plan's own recommendation, confined to chrome, and reversible
> in one CSS block. #4 (the two-level model) arrives with slice 1.

1. **Log the supersession.** The rail returns to the user home and account spokes, reversing the
   2026-07-09/13 no-sidebar rulings. His 2026-08-13 sentences already say it; record it so no
   future session "restores" the chrome-less launcher.
2. **The "+ Create" button colour in the shared chrome.** Gold on `/` today. **Recommendation: one
   persistent chrome = one button colour** — extend the gold lock to this single control of the
   shell, as the named mirror of the terracotta sign-in panel. The alternative is the button
   flipping colour as you cross into the board, which is exactly the "jump" he asked us to remove.
3. **The chrome typeface.** Front door = system face (that page only); platform = Hanken Grotesk.
   The rail cannot change face per page without visible churn. **Recommendation: the chrome keeps
   the front-door face and scale everywhere**; content columns keep Hanken. Either answer edits a
   lock.
4. **The two-level model** — one look at the slice-1 screen: rail-pushes-a-group with the account
   rows visible (recommended) vs the prototype's wholesale swap.
