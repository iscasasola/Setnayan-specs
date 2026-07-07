# 0021 — Couple Dashboard · Unified Nav (Accordion Bottom Nav + Side Nav)

**ADDENDUM · 2026-06-15 (rev 2)**
**Status: DIRECTION LOCKED (owner 2026-06-15).** Design — no code yet. Extends the one shared `BottomNav` (not a fork). **Supersedes the 2026-06-14 journey-group sidebar IA** for the customer doorway (see §8).

---

## 1. The idea in one line

**One nav config, two renderings.** The bottom nav (mobile) and the side nav (desktop) are driven by the SAME config: **six fixed top-level menus**; any menu that has sub-views extracts them as an inline accordion (**≤5 children**). **No "More" overflow. No horizontal scroll.** Account/settings live under the **profile avatar (top-right)**, not in the bar.

## 2. The six menus + the avatar (customer doorway)

| Bottom-nav menu | Extracts (≤5 children) | Note |
|---|---|---|
| **Home** | — (navigates) | event hub; recent Activity surfaces here |
| **Guests** | Summary · Search · Add · Customize · Journey | Journey = guest lifecycle (invite→RSVP→seated→checked-in) |
| **Vendors** (Explore) | Explore · Messages · Contracts · Disputes | the find→talk→sign→resolve arc |
| **Studio** | Website · Mood Board · Monogram | Studio's own page = the in-app services grid (Papic/Panood/Save-the-Date…); design tools are its children |
| **Budget** | (Budget · Orders · Receipts) | navigates; the two children are optional |
| **Wedding** | Find your date · Schedule · Seating · Event QR · Live Wall | the event-day / logistics bucket |

**Profile avatar (top-right) — account & settings, NOT a bottom menu** (front door to iteration 0025): Profile · Appearance (theme) · Notifications · URL & Slug · Payment Methods · Privacy & Data · **Hosts (event access)** · Sign out.

Rules of the roster:
- Labels are **concrete destinations** (bottom-nav convention), not journey-phase labels.
- A menu **with** children extracts the accordion on tap; a menu **without** children (Home, optionally Budget) navigates straight.
- Owner judgment calls (movable): **Disputes** → Vendors · **Find your date** → Wedding · **Activity** → folded into Home.

## 3. The choreography (validated motion)

The tapped menu is the **hero of the move** — two overlapping beats (shown with Guests; every accordion menu behaves identically).

**Expand (tap Guests):**
1. **Clear + glide.** Home slides off the **left**; the other tabs slide off the **right**; `Guests` **glides into the left corner**. (Home must leave because the section bar starts at the anchor.)
2. **Unfurl from the corner.** Summary → Journey **slide out from behind the Guests corner**, cascading one after another (staggered), into their slots.

Beat 2 starts at ~45% of beat 1 (overlap), so it reads "make room → fill it" as one gesture.

**Collapse (tap ‹ Guests):** reverse — children retract into the corner (reverse cascade), then Guests glides back to its slot and the other tabs return.

## 4. Timing + the trail (canonical — do not re-invent)

| Param | Value | Note |
|---|---|---|
| Item duration `DUR` | ~280 ms | the accordion slide, per beat |
| Beat overlap | start beat 2 at ~0.45·`DUR` | snappy, still legible |
| Sub-item stagger | ~40 ms each | the slide-from-corner cascade |
| Item easing | `cubic-bezier(.32,.72,0,1)` | decelerate-out |
| Input lock | ignore taps while animating | prevents mid-flight corruption |

Respect `prefers-reduced-motion`: collapse to a near-instant cross-fade.

**The trail** is the shared `BottomNav`'s existing machinery (`apps/web/app/_components/nav/bottom-nav.tsx` @ `origin/main`, owner-locked 2026-06-13) — reused verbatim, never re-invented. Four central knobs on the nav root (the "bounce / glow / trail / speed" the owner recalls):

- **speed** `--bn-dur` = 500ms · **bounce** `--bn-grow` = 1.15 (icon grow + spring overshoot `cubic-bezier(0.34,1.4,0.5,1)`) · **glow** `--bn-glow` = 1.5 (white press-light bloom on press-DOWN, `nav-press-flash`) · **trail** `--bn-stretch` = 1.1 (the traveling dark stadium pill `--m-ink`@15% + its liquid `scaleX` stretch, `nav-pill-travel`).
- Active icon = `--m-orange` (#C5A059 champagne-gold), active label `--m-ink` weight 600; inactive `--m-slate`. The pill **travels on RELEASE**; the press-light blooms on **press-DOWN** and jumps to the pressed cell (never travels).

Accordion-specific: on expand, the press-light blooms under the tapped menu, then the pill **travels to the default child** (e.g. Guests → Summary) as the bar reconfigures; on collapse it travels back to the menu's slot. Child→child taps are ordinary canonical pill travels.

## 5. Behavior rules

1. **Six fixed menus, no scroll.** A menu with children extracts the accordion; a menu without children navigates. The active highlight is always the canonical traveling pill (§4) — never a per-item background.
2. **The collapse affordance must be unmistakable** — the leading `‹ Menu` carries a back-chevron + the active pill. When the primary bar is gone, that hinge is the *only* way back; biggest usability risk.
3. **Cross-navigation costs two taps** (collapse, then tap another menu). Accepted tradeoff for a section you settle into.
4. **Children cap = 5.** If a menu needs more, split or demote to in-page tabs (don't overflow the bar).
5. Default landing child on expand = the section's first child (Guests → **Summary**).

## 6. Open items

1. **Confirm the three re-homings** (Disputes→Vendors · Find-your-date→Wedding · Activity→Home) and **Budget's children** (navigate-only, or Budget·Orders·Receipts).
2. **Extends the "UNBREAKABLE" shared BottomNav (sign-off).** Build as a config-driven `primary ↔ section` mode inside the one lint-enforced component; keep `scripts/lint-bottom-nav.mjs` green. The traveling pill / press-light / icon-grow are reused verbatim — the only new wiring is `activeIndex` resolving against the current mode's slot map.
3. **Vendor + admin doorways** adopt the same model (6 fixed + accordion + avatar-settings) **once proven on customer** — scope = customer-first.

## 7. Implementation note

- **One config is the source of truth.** Re-shape `buildCustomerNavGroups()` from the 7 journey *phase-groups* into the **6 destination-menus-with-children** above. Both the bottom nav and the desktop sidebar consume it (sidebar renders the same tree vertically — no horizontal scroll; "same model, platform skin").
- **Bottom nav consumes the config directly** and renders menus + their ≤5 children with the accordion; **delete the `/more` landing** (`apps/web/app/dashboard/[eventId]/more/page.tsx`) — its reason to exist (overflow) is gone.
- Items absolutely positioned within the bar; animate `left` / `width` / `opacity`; the anchor sits above its children (`z-index`) with a `--m-paper-2` background so the cascade emerges from behind it.
- **Account/settings move to the profile avatar (top-right)** — the front door to iteration 0025. The sidebar drops its Settings group too, so desktop + mobile stay consistent.

## 8. Supersedes / scope

- **Supersedes the 2026-06-14 journey-group sidebar IA** (`Setnayan / Plan / Book / Design / Day-of / After / Settings`) for the customer doorway. The journey grouping is replaced by 6 concrete destination menus.
- **Services → Explore is now its own menu (Vendors)** — no longer "inside More" (More is retired entirely).
- Vendor + admin: same model, customer-first rollout.
