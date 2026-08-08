# Warm Editorial Archive — the three "open questions", answered against shipped code

> Checked 2026-08-08 against `origin/main` in the code repo, **not** against specs.
> The handoff's README ends with three questions for the owner. Two are answerable
> from the code and one collides with an owner lock — so only **one** genuinely
> needs a decision, and it is not the one that looks hardest.
>
> 🔑 Why this file exists: earlier the same day, a design artifact's "what I need
> from you" list was read as three open decisions when **all three had already been
> answered in code months before**. A question printed in a design document is not
> evidence the question is open. Check the code first.

---

## Q3 — "Does a 'Find' type-to-jump palette already ship?"

**NO. It does not ship.** Answered, no decision needed.

Searched for a command palette, `cmdk`, type-to-jump, `⌘K`/`Cmd+K`, and spotlight
across `app/` and `lib/`. Nothing. The two families of false hit are worth naming so
this is not re-litigated:

- **"Spotlight"** matches only `app/admin/studio/_surfaces/spotlight-awards-surface.tsx`
  and the journal-spotlight surfaces — that is *editorial* spotlight (featuring a
  vendor), a completely different sense of the word.
- **"Find"** matches only a dashed **"Find" pill** inside the vendor shortlist
  (`plan-budget-accordion.tsx`, `shortlist-categories.tsx`) — a button in one
  accordion, not a global palette.

⇒ Frame 1a–1d's "Find" is **new work**, not a restyle of something existing. Size it
accordingly.

---

## Q1 — "In-event bottom bar: re-scope to Event·Guests·➕·Budget·Find, or keep the global bar?"

**🔴 THIS ONE IS OWNER TERRITORY — it would reverse an owner lock, and it would
remove behaviour the design does not appear to know about.**

What actually ships is **not** a fixed five-tab bar. `lib/customer-menu.ts` builds
**six top-level menus** that change with the event's lifecycle phase:

| phase | the bar shows |
|---|---|
| **day-of** | Now · Check-in · Seats · Services · Schedule |
| **planning** | Overview · Guests · Marketplace · Studio · … |
| **post-event** | Overview · Review · Editorial · Galleries |

Three properties the proposed re-scope would destroy:

1. **It is phase-aware.** The bar a couple sees on the wedding day is deliberately
   different from the one they see nine months out. A fixed five-item bar has one
   state.
2. **It is admin-tunable at runtime.** Every tab's label and icon come from the nav
   registry (`customer.bottom-nav.<key>` slots), and a slot marked hidden drops its
   tab — no deploy required.
3. **It is owner-locked, twice, and guarded.** `bottom-nav.tsx` carries *"FLAT BOTTOM
   NAV — the canonical, owner-locked baseline"* and *"ACCORDION BOTTOM NAV — 0021
   ADDENDUM (owner-locked 2026-06-15)"*; `nav-fab.tsx` adds *"never a 7th tab, never
   a fork of the canonical [template]"*. The handoff's own README notes a lint guard
   enforces the canonical template — that guard is what would block the re-scope.

⇒ **Do not build this from the design alone.** It is a reversal of a standing lock
plus a loss of phase-awareness. If the owner still wants it, that is his call to
make explicitly — but he should be told what the current bar does first, because the
design reads as though it is replacing a static bar.

---

## Q2 — "Add-ons rail: on the event Overview, or only behind a SubNav tab?"

**Genuinely open — but it already has a home, so this is "also surface it?", not
"where does it go?".**

Today there is **no add-ons rail on the event Overview**. Add-ons live behind a
top-level menu: **Services → `/dashboard/[eventId]/launch`**, with the Studio menu
carrying sub-anchors (Setnayan AI · Website · Capture · Branding · Event page).

So the real question is whether Overview should *also* carry a rail, at the cost of
a permanent band on the most contested page in the product.

**Recommendation:** no rail on Overview by default. The event Overview already
carries the focal, the bento, `slotAfterBento` (which holds the set-date and Papic
nudges), the journey rail and the decisions board. A permanent commerce rail there
competes with the decisions board — the same argument that correctly kept Papic
*out* of the decisions board on 2026-07-30. If discovery of add-ons is the actual
problem, the proven pattern on this page is a **dismissible nudge in
`slotAfterBento`**, not a permanent rail.

---

## Status

| Q | verdict | needs owner? |
|---|---|---|
| Q3 Find palette | does **not** ship — new work | no |
| Q1 bottom-bar re-scope | collides with an owner lock + drops phase-awareness | **yes — explicitly** |
| Q2 add-ons rail | no rail today; add-ons live at `/launch` | only if he wants Overview placement |
