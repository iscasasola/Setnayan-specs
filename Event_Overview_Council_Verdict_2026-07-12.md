# Event Overview — Model Council Verdict & Redesign

**Date:** 2026-07-12 · **Surface:** couple Event Overview / Home (`/dashboard/[eventId]`) · **Status:** Phase-1 redesign SHIPPED (PR on `feat/overview-council-redesign`); Phases 4–7 are staged follow-ups.

> Owner prompt: pointing at the "Around your event" band — *"does not expand and collapse. Let us start with event overview. Use the council to strategically design this page."* Then: *"fix everything."*

## Method

A model council: **5 design lenses** each proposed a full Overview design (Information Architecture · Conversion/Funnel · Brand & Emotional · UX Density "Energy-not-skin" · Jobs-to-be-Done/Lifecycle), **3 adversarial critics** (Scope/Simplicity · Brand-Lock-Reskin Fidelity · Real-Couple/Mobile Reality) fought over all five, and a **Chief-Designer synthesis** reconciled them. Grounded in the shipped `event-dashboard.tsx`, the "Energy, not skin" density direction, the Free ↔ Setnayan-AI dual-state mechanic, and the incoming Atelier+glass reskin (so nothing hard-depends on wine).

## The verdict (one line)

> **The three-question doorstep that knows your moment: STATUS → ACT → NAVIGATE** — one canonical decisions list, honest event-type-scoped vitals, and an "Around your event" band that is flat, self-densifying, and always links OUT (never an accordion) — reshaped by lifecycle stage and, on the event day, superseded by the day-of takeover.

## The "expand and collapse" answer (unanimous)

All five lenses independently rejected a user-toggled accordion — including the Brand lens's softer "tap-to-expand settled cards," which the critics killed as "the same accordion scoped to one tile." The owner's note is a **symptom that the cards are dead teasers** (a tile that only says "3 of 21 booked · Manage vendors →" is a status label, not a doorstep), not a request for drawers. The fix, with zero accordion chrome:

1. **Content/state-driven auto-density** the couple never toggles — a tile with substance renders full (a glance stat + up to 3 real preview rows, urgent status floated into the visible three); an empty/off-stage tile collapses to ONE calm, hopeful, directive line + count + link. Stable slot order so the grid never reflows.
2. **Depth = navigation** — the WHOLE card is a stretched-link to its already-shipped route. No inline drawer that competes with its own destination.
3. **Aliveness comes from real content** (company logos, names, urgent chips), not an open/close animation and not a since-last-visit gold pulse (cut: new tracking + gold is becoming the brand accent).

## The page, section by section (target design)

| # | Section | Free | Setnayan-AI on |
|---|---|---|---|
| 1 | Hero greeting | warm line + "you're in the {stage} stage" | Suri briefing hero + "Today's one thing" |
| 2 | At-a-glance bento | Countdown (ring) · Decisions (count+chip **jump-anchor**, not a list) · Budget · Guests — endowed, never 0% | + forecast deltas (overage, RSVP pace) |
| 3 | **Decisions board** (ACT) — the ONE canonical action list | grouped book→pick→pay→role | Suri-ranked; "What's next" folds in |
| 4 | **Around your event** band (NAVIGATE) | flat doorways, auto-density, link-out | one Suri micro-insight per tile, still a door |
| 5 | Journey rail (reassurance) — **moved below the band** | scrubbable arc, endowed | + per-stage Suri note |
| 6 | Suri on watch | absent | ambient guard strip |

**De-dup rule (enforced in the data layer):** every item is EITHER "only you can resolve" (Decisions board) OR "volume behind a door" (a band tile). **Inbox is not a decision** — unread lives only on the Conversations tile. (Already honored: the board is book/pick/pay/role, no messages.)

## Band interaction model (final)

Desktop: Hosts + a 2×2 grid of fixed-slot doorway tiles (Team · Conversations · Services · Schedule) in stable order; substantive tiles full, empty tiles one line. Whole card is a stretched-link (layered so the header affordance stays tappable and screen-reader-reachable). Mobile (375px PWA): 1-col stack in the same order; auto-collapsed empties keep the fresh-event scroll short; tap = navigate (scroll position preserved by the route change). No bottom sheet, no peek, no accordion. Vendor identity masking (always company, never a personal profile) stated ONCE as a global footnote, not per-card legalese.

## Owner sign-offs (council recommended YES on all; "fix everything" endorsed)

1. **Reorder** Decisions above / Journey below the band — *shipped* (hero greeting preserves pacing).
2. **Event-type scoping** with an **event-word fallback** (no wedding "of 21" for other types; per-type maps staged) — fallback *shipped*.
3. **NO inline checkout / Setnayan-AI paywall teaser on the free Overview** (Setnayan AI = ₱1,499 one-time per event, owner-locked 2026-07-12) — the doorstep routes into the Studio; Free stays complete. *Honored (nothing funnel-like added).* ⚠️ load-bearing monetization call — flagged for explicit confirmation.
4. **Day-of takeover** may recede the planning stack when `getLifecyclePhase==='dayof'` — *deferred* (Phase 6, touches `page.tsx` + `/live`).
5. **Reserve a non-gold urgency hue** — using the existing `warn` (amber) scale for urgency/unread so it survives wine→gold. *Honored.*
6. **Event-scoped unread** for Conversations (real vendor threads, not account-wide) — *shipped*.
7. **Hosts** presence — kept as the owner's recently-shipped card (not demoted to a thin bar), with auto-density + stretched link. *Shipped as card.*

## Build phases

| Phase | Scope | State |
|---|---|---|
| 1 De-dup + one action list + reorder | Decisions above Journey; bento Decisions → jump-anchor; inbox≠decision | **Shipped** |
| 2 Endowed honest empty states | hopeful one-liners on every band tile; event-word fallbacks | **Shipped (band)** |
| 3 Band auto-density + navigate-out + masking footnote | stretched links, urgent-float, global masking note | **Shipped** |
| 4 Shape-honest widgets + reskin token | Budget mini-donut, Guests segmented RSVP bar; reserved `--urgent` | Deferred |
| 5 Event-type breadth | per-type plan-group/role maps behind the event-word fallback | Deferred (fallback shipped) |
| 6 Day-of true takeover | recede planning `EventDashboard` on the day; lead with the live grid + jump to `/live` | Deferred |
| 7 Conversations honesty (rode Phase 3) | vendor-thread-scoped unread | **Shipped** |
| — | Fold AI "What's next" rail into the Decisions board | Deferred |

## Open risks

- Reorder changes the emotional pacing established by the endowed-progress work — mitigated by keeping the hero greeting; owner can veto.
- The whole-card stretched link makes row text non-selectable on the band tiles (acceptable for doorway tiles).
- Per-type category maps not yet built — the event-word fallback prevents the breadth bug in the interim but non-weddings get a plainer count.

*Full council material (all 5 designs + 3 critiques + synthesis) archived in the session workflow transcript `wf_3bbfe7e9-f9a`.*
