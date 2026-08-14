# Every adjustment we will make to the current website · 14 August 2026

> Owner: *"so list all the adjustments we will make for our current website."*
>
> **Every line below was verified against shipped code at `origin/main` `3ca1af296` — which is the
> exact commit production serves — or against the live database.** Nothing here is copied from a
> document's status line. That rule exists because this week a status line was wrong in **both**
> directions: a closed gate still reading "open" (twice), and shipped work still reading "not
> built" (Guests, for a month).
>
> **Nothing is a rebuild.** Every item is a delta on something that already ships.

---

## A · One shell — the sidebar stops being something you leave

Owner 2026-08-13, with YouTube screenshots: *"the sidebar should stay… what we want to see the
dashboards converted for this desktop view."* Plan: [`ONE_SHELL_PLAN_2026-08-13.md`](ONE_SHELL_PLAN_2026-08-13.md).
Drawing: [`prototypes/one_shell_2026-08-13.html`](prototypes/one_shell_2026-08-13.html).

**Desktop only (≥1024).** The phone keeps its bottom bar — that is the locked signed-in grammar and
converting it would be a regression.

| # | Scope | Size |
|---|---|---|
| **A0** | **Your events + your account pages** — ~15 screens. These mount **no chrome at all** today, so nothing is displaced. **Ships alone and is judgeable.** Exactly what the owner pressed when he complained. | S |
| A1 | Inside an event — ~110 screens. Carries the two-level rail for the owner look. | L |
| A2 | Your shop — 63 screens. Mechanical repeat of A1. | M |
| A3 | Setnayan HQ — 108 screens. Internal only, zero customer risk, ships last. Must move ~10 background sweep jobs verbatim. | L |
| A4 | Retire the old sidebar component, its collapse key, and the Atelier glass with no consumers. | S |

**Inside A0, one thing that is not cosmetic:** the front-door rail has **no active-route logic** —
`Home` is hardcoded on. Ship the chrome without wiring the shipped path matcher and **all 296 pages
light "Home."** Nothing throws.

**Not converted, deliberately:** the couple's own guest sites (11 routes — the couple's mood-board
theme, guests are not "in the app"); marketing + the 8 public tool doorways (top-nav surfaces, and
the session-reading shell would de-cache them); full-bleed working surfaces (website editor, seat
plan 2D/3D, Live Studio control, day-of); `/login` and `/onboarding` (sign-in happens **over** pages,
not inside a chrome).

---

## B · The event Marketplace — six steps

Plan: [`MARKETPLACE_FOUR_TABS_PLAN_2026-08-13.md`](MARKETPLACE_FOUR_TABS_PLAN_2026-08-13.md)
(a verification pass — the **design** was settled in
[`Explore_IA_Replan_2026-07-27.md`](Explore_IA_Replan_2026-07-27.md)).

| # | What ships | Size | State |
|---|---|---|---|
| **B0** | **Truth alignment** — the prototype drew a tab strip that was removed in July, and drew the Plans/Payments rename as an open question two weeks after the owner decided it. | XS | ✅ **DONE 2026-08-14** |
| B1 | **A jump-to strip in the page** — four names wired to the existing anchors (scroll, never swap). Closes the real hole: with the old dock gone, a couple **on a phone scrolls the entire bench to reach their money.** | S | |
| B2 | **The warm-editorial look** the Overview got on 8 August, applied to the bench, team, plans, payments, quote-fill. Plus one honesty string: the premium crest tells **every** couple they are on a premium tier while the paywall is off. | M–L | |
| **B3** | **Move "Your plans" out of the 380px column.** A side-by-side table cannot live in a narrow rail. **The one change that needs the owner's eye.** | M | ⚖ owner look |
| B4 | **Join the two money views.** The in-page Payments computes from older math than the full budget page's newer math. **Must land before that newer math is switched on** or two surfaces print different numbers for the same wedding. | S | 🔴 ordering |
| B5 | **A date line on each plan** — "everyone in this plan is free on your date" / names who is booked. Today's version only renders for events without a fixed day, which is none of them. | S | |
| B6 | **The supplier-agrees step.** Today a couple's Lock **books the supplier outright** while the copy promises the supplier agrees first. Owner ruled 2026-07-27 that a lock is a REQUEST. Fully specced, **not started**, 14 open plan defects. **Its own job, not a slice.** | L | own spec |

---

## C · Studio — five doors become one

**Approved by the owner 2026-08-14** (*"yes. same as the menu on admin and shop"*), from
[`Event_Studio_Replot_Council_Verdict_2026-07-17.md`](Event_Studio_Replot_Council_Verdict_2026-07-17.md)
— the council's dupe #1, open since 17 July.

**Verified still true today:** `apps/web/lib/add-ons-catalog.ts` carries **five** website doorways —
`save-the-date` · `rsvp` · `editorial` · `website-pro` · `landing-page` — for one product.

- **C1** — one free **"Your Website"** card, the parts become chips inside it, old links 301 to it.
- **C2** — the **Tab-1 refile** that sign-off #2 gated (Mood Board · Seat Plan · 3D Plan move out of
  "Branding", which is a planning/layout group, not an identity one). Sign-off #1 was approved
  2026-07-17 and the refile never shipped because it waited on #2.

---

## D · Event Overview — three pieces deferred in July

Phases 1 · 2 · 3 · 7 **shipped**. From
[`Event_Overview_Council_Verdict_2026-07-12.md`](Event_Overview_Council_Verdict_2026-07-12.md) § Build phases:

- **D1 · Phase 4** — shape-honest widgets: a budget mini-donut and a segmented guest RSVP bar
  instead of bare numbers.
- **D2 · Phase 5** — event-type breadth. **Non-weddings currently get a plainer count**; the
  event-word fallback prevents the bug but the per-type maps were never built.
- **D3 · Phase 6** — day-of takeover: on the day itself the planning dashboard **recedes** and the
  page leads with the live grid.
- **D4** — fold the AI "What's next" rail into the Decisions board (one list, not two).

🔒 **Do not touch:** the single hero card. Owner 2026-05-22 — it was five cards, correctly sorted,
and hosts froze in front of five buttons. That reason is now written onto the surface itself.

---

## E · Guests — nothing. It already ships.

Owner: *"we already had a solid design for this. where they have a list, and search, and add, and
seatplan, and a way to group them, and send invitations, and custom QR."* **All seven verified
present in code**, plus the three "open sign-offs" that a stale status line advertised for a month:
they shipped **2026-07-13, the day the verdict was written** (`d8b42c890`) — one always-visible
search with ⌘K, instant sort, no Apply button, no `Add|Find` toggle.

---

## F · Decisions waiting on the owner — four, none blocking A0

1. **Seat appears twice** — journey stage 4 and the sidebar's *Seat plan* are the same room.
   Identical shape to the Budget tab vs Budget link overlap, which §5 of the Marketplace plan
   already settled. **One ruling should cover both.**
2. **The "+ Create" button colour** in the shared chrome. Gold today on the front door.
   *Recommendation: one persistent chrome = one button colour.* The alternative is the button
   changing colour as you cross into your events — the exact "jump" he asked us to remove.
3. **The chrome lettering.** Front door uses the system face; the platform uses Hanken Grotesk. The
   sidebar cannot change face per page without visible churn. *Recommendation: the chrome keeps one
   face everywhere; content columns keep theirs.* Either answer edits a lock.
4. **The two-level sidebar** — one look at the A1 screen: the rail **pushes** a group with your own
   rows still visible (recommended, and what the prototype draws) vs the approved seam prototype's
   wholesale swap.

---

## Order

**A0 → C1 → B1 → B2 → A1 → the rest.**

A0 and C1 are independent, small, and each visible on its own. B4 must precede any flip of the
newer budget math. B6 and A3 are the two genuinely large ones and both can wait.
