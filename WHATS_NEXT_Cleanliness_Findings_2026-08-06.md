# WHATS NEXT · The 2026-08-06 cleanliness findings — the work register

> **Read this before picking up any item below.** Every finding here was produced
> by a 6-dimension sweep of the codebase and then **re-checked by a skeptic agent
> instructed to refute it**. The ones that did not survive are not listed.
>
> ⚠ **The first run of that sweep read a 294-commit-stale checkout** and its
> answer was void — it recommended deleting nine files that had been deleted
> hours earlier. The findings below come from the **re-run against current code**,
> verified by confirming every file it names still exists on `origin/main` and
> that it mentions none of the deleted ones. Do not re-use the first run.

## The shape of almost every finding

**Two places holding the same fact, and one never got the update.**

Not "the code is bad" — the code is fine. Six separate defects today were one
disease: the tag limit reached the database and not the screen; the WebRTC
security fix reached two transports out of five; the ceremony list reached the
database and not the schedule; the nav knew about the header and the header
didn't know about the nav.

🔑 **When picking up any item: the question is not "is this correct?" but "does
this fact live in more than one place, and do the copies agree?"**

---

## DONE 2026-08-06

| Fix | PR |
|---|---|
| Emcee could never save a line · Compare-vendors dead · vendor booked-counts read zero · wedding-day photo-wall card · dead admin links | #4172 |
| Internal ticket numbers on the public features page · TODO markers on the paid booth screen · flags that gated nothing | #4173 |
| 13 provably-dead files deleted (and the 4,100-line "dead" wizard KEPT — it is live) | #4179 |
| AI briefing kill switch wired · four site-address variables collapsed into one | #4181 |
| Features-page nav overlapping its own tabs | #4183 |
| Papic 40-challenge library (a PR was never opened for it) | #4187 |
| No per-photo tag limit | #4188 |
| **Couple↔vendor call channel was PUBLIC** + the double-prefixed topic that would have denied every call | #4191 |
| Call failure copy derived instead of hardcoded | #4192 |
| Three env notes that were wrong about live reality | #4196 |
| **Born Again / Jewish couples handed a Catholic Mass** | #4198 |

---

## OPEN · in priority order

Priority is **who it hurts**, not effort.

### P1 — a customer or your own team hits this today

**1 · Six shipped features have no doorway.** Built, paid for, in the database,
unreachable. Five are `UNKNOWN`-bucket files whose only entry point was deleted;
the sixth was found separately.

- a couple cannot invite a supplier who isn't on Setnayan yet
- no screen to upload the Save-the-Date music
- the peer-comparison numbers promised to top-tier vendors have data, no page
- the "why this date is lucky" card was never mounted
- a vendor lost the button that preloads everything for the wedding day
- **`/vendor-dashboard/activities`** ("Your segments" — the host/MC catalogue,
  shipped 2026-07-28) has **no `<Link>`, no `router.push`, no redirect, no
  nav-config entry, no route-builder, no registry key** anywhere in the repo.
  Its deliberately-identical sibling `/vendor-dashboard/repertoire` has **five**
  doorways. That asymmetry is the whole bug.

*Cheapest work available — the expensive half is already built.*

**2 · The app disagrees with itself about when the wedding day is.**
Two definitions ship side by side and are consumed **in the same component**:

- `isDayOfOpen` — `lib/guest-journey.ts:115` — eventDate **±24h**
- `getMenuLifecyclePhase` / `isEventDayActive` — `lib/day-of-mode.ts:156,181` —
  eventDate **−12h .. +60h** (`LIVE_WINDOW_START_MS` 12h, `LIVE_WINDOW_END_MS`
  36h, `POST_WINDOW_END_MS` 60h)

`customer-section-subnav.tsx:82` computes `dayOfOpen` from the first, receives
`phase` from the second (set in `layout.tsx:266`), and passes **both** into
`buildCustomerMenuTree` on line 85. `phase === 'dayof'` swaps the entire bottom
nav to Now/Check-in/Seats/Services/Schedule (`lib/customer-menu.ts:159`).

**They disagree by 12h at the start and 36h at the end.** For about a day and a
half after the wedding the menu says day-of while Check-in sits greyed out — and
late check-ins happen exactly there.

🔑 One of the two must become the other's caller. Do not add a third.

**3 · The admin "Samahan" tab throws.** The Ugat console renders a Samahan entity
tab keyed `communities`, but the server action's `VALID_TABLES` allow-list holds
**8 of the 9** `UgatTableKey` members — `communities` is missing — so the tab
throws `Unknown table`, or shows the previous table's rows under the Samahan
heading. A list of 9 and a list of 8 that must agree.

### P2 — wrong information, no one hurt yet

**4 · Adding a new event type silently switches off its public website** while
leaving the day-of page and gallery on. Saving the settings page does it.

**5 · Two admin screens rank the same queues in opposite orders** — and the main
work list buries a queue that **cannot be counted** (i.e. is broken) below all
the healthy ones.

**6 · A switch labelled as controlling marketplace visibility controls nothing.**
The part it gated was removed a month ago. Nothing breaks; the next reader simply
believes they hold a lever that isn't attached.

**7 · An old icon/route map still ships** beside the newer one the app actually
uses.

### P3 — latent; correct today, wrong on the next edit

**8** Two same-named money converters that round differently (one keeps centavos,
one rounds up) — they never meet today.
**9** Package inclusions + discounts fetched by two word-for-word identical
readers (couple side, vendor side).
**10** Two lists of "what a guest may see about an event", each with its own
safety checks reading only its own list. They match **today**.
**11** Three files each keeping their own copy of the same nine settings, held
together by a comment.
**12** An admin venue screen keeping a private copy of the faith list, while the
faith file promises adding a faith means editing one place.
**13** The two call entry points (Messages tab, Appointments list) drift on the
paid-feature upgrade nudge.
**14** A photo-count shortcut still switched on in the live database for a count
that was removed from the menu.

### NOT WORK — verified deliberate, do not "fix"

- **18 files parked on purpose**, each saying so in its own docblock or in the
  commit that orphaned it. Deleting these is what would break things.
- **3 files reached by CI, not by imports** — read via `readFileSync` in a test,
  or compiled by `tsc` for their `@ts-expect-error` assertions. Deleting any
  turns CI red with no import anywhere pointing at them.
- **The retired Concierge wizard (~4,100 lines) is LIVE** via the mood-board page.
  An audit called it the highest-severity deletion available. It would have
  broken a working screen.
- **30 keynote JSX files** load in no deck, but a design brief names 15 by exact
  path. Dead to the bundler, live as source material.
- **A finished GCash/BDO payment modal with no doorway** — parked pending the
  payment gateway's approval, and says so.

---

## The house rules these findings were produced under

1. **Verify against live reality, never a document.** Three notes were wrong
   about deployment on 2026-08-06 alone, and two nearly sent the owner to redo
   finished work. Read Vercel / DNS / prod SQL / the live site.
2. **The bigger and more confident the claim, the less it was checked.** The two
   largest deletion recommendations of the day were both wrong.
3. **Break every guard on purpose before trusting it.** Three guards written
   today only proved correct because reverting the fix made them fail by name.
4. **A guard that cries wolf is worse than none.** Three separate first drafts
   over-fired (16 flagged / 1 real, 13 routes / 0 real, 10 statuses / 0 real) and
   had to be narrowed before shipping.
5. **The owner looking at a phone beats every automated check.** The nav overlap
   was found that way in seconds, and no test we own could express it.
