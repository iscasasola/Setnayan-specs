# SESSION PROMPTS — `hub1` · `hub2` · `hub3` · `hub4`

**Written 2026-08-28.** The Event Hub work left after
[`EVENT_HUB_UNISON_2026-08-28.md`](EVENT_HUB_UNISON_2026-08-28.md), which measured
**41 features · 36 shipping**. These four are what is left, plus two switches that
need the owner rather than a session.

| Session | Model | Effort | Blocked? |
|---|---|---|---|
| `hub1` · the four photo names | **Opus** | low | no — start it |
| `hub2` · the supplier's desk gets a life | **Opus** | high | no — the design is binding |
| `hub3` · each kind offers only its own rooms | **Fable** to measure → **Opus** | high | ✅ **RULED 2026-08-28 — go** |
| `hub4` · a shop's teammate can open the desk | **Opus** | medium | ✅ **RULED 2026-08-28 — go** |

⚠ **Two at a time, never more.** Ten parallel builds once shipped 44 defects.
⚠ **`hub1` and `hub3` both touch event-type wording — never run them together.**

🔴 **NOT SESSIONS — these need the owner, not engineering:** the night-before
supplier email (built, switched off) · the supplier camera lane (built, dark,
gated on his DPO ruling) · and the reading of *"no paid booking fee, no
connect"* — blocked-when-owed, or nobody-connects, the second of which would
disconnect all **13** booked suppliers. Work proceeds on the first.

---

## `hub1` — FOUR PHOTO FEATURES, FOUR NEARLY IDENTICAL NAMES

```
You are picking up the session named hub1 in the Setnayan project.

FIRST, MEASURE — paste results before changing a word:
  1. The four: "Photo moments" (run-up prompts), "Our photos" (the host's own
     gallery), "Your photos" (a guest's tagged photos), and the photos-of-you
     gallery inside it. Confirm all four still ship and are visible.
     Measured 2026-08-28: all three widgets exist on all 5 production events,
     visible, mode=auto, audience=public.
  2. Confirm they are separated by lifecycle phase and therefore rarely collide
     on screen: photo_moments = the run-up · your_photos = the day and after ·
     our_photos = the run-up and after. ⚠ THE PHASE ENGINE IS EFFECTIVELY ON FOR
     EVERY REAL EVENT — the page enables it via the event TYPE, not only the env
     var, and the env var defaults OFF. A reader who checks only the flag
     concludes the opposite. Verify before repeating either claim.

WHAT A PERSON GETS: a host configuring their event page can tell the four apart
without opening each one. Today the names are one word from each other.

⛔ DO NOT RETITLE THE "Couple Website PRO" CATALOG ROW. It is genuinely still
titled that in production (verified 2026-08-28, ₱3,500, active) — but the owner's
own price sheet ALREADY retitles it to "Event Hub Pro" in an OPEN PR. Doing it
here collides with his. Check whether that PR merged; if it did, this is done.

ALSO IN SCOPE, both small and both measured:
  · One "photos will appear here" empty line can never render — nothing passes
    it its cue — and it still says "the couple". Either make it reachable or
    delete it; a plate nobody can reach is not an empty state.
  · The live photo wall renders in TWO places (the page, and inside the Live hub)
    and that is DELIBERATE — a guest needs it in both. Do not "fix" it. What
    matters is that both keep asking the host's ONE on/off question. Today they
    do. Add a guard that they cannot drift apart.

RULES:
  · Copy only. No new screens, no schema, no new widget types.
  · The names must work for all 17 event kinds, not just a wedding. The solemn
    kind's key in production is `wake`, NOT `funeral` — a search for "funeral"
    returns nothing and reads as "not built".
  · Renaming is a DELETION to anyone who knew the old name. Say what each was
    called before, in the changelog.

GUARD IT: whatever you assert, break it and print the occurrence count before →
after. An unmeasured mutation proves nothing.
```

---

## `hub2` — THE SUPPLIER'S DESK GETS A LIFE, NOT ONE DAY

```
You are picking up the session named hub2 in the Setnayan project.

Design (BINDING — port it, never redraw it): Vendor_Room_Design_2026-08-26.md
Contract: WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md
Current state: EVENT_HUB_UNISON_2026-08-28.md § 6, gaps 3 and 5.

FIRST, MEASURE — RULE 0, and this project has paid for skipping it repeatedly:
  1. The desk SHIPPED 2026-08-27 (PR #4919) and is INSIDE the Event Hub. Read it
     before designing anything: venue and address, the live run-of-show with
     private lines marked, headcount, tools, open until 6 a.m. after the day.
     DO NOT REBUILD ANY OF THAT.
  2. Confirm what is actually missing: the BEFORE and AFTER states. The design
     gives the desk a call-sheet ribbon months out, a countdown ("43 days to
     go"), a bridge between two same-day events, and a look-back afterwards.

WHAT A PERSON GETS: a booked supplier can open the celebration they are working
and see it whenever they look — not only on the day. Today the room exists for
about 30 hours and is shut the rest of its life.

🔑 THE DESIGN'S OWN STRONGEST ARGUMENT IS AGAINST WHAT SHIPPED: "a day-only room
recreates the midnight-door mistake." That is the brief.

⛔ THE RULE THAT IS THE WHOLE SAFETY OF THIS ROOM: the event page reads with the
service role, so every database rule that keeps a supplier out of the guest list
and the private schedule is INERT there. The shipped desk got this right — it
reads the running order under the SUPPLIER'S OWN permissions, and the one-line
shortcut that would have leaked coordinator-only lines was named and refused.
KEEP THAT. Authorization reads may use the service role scoped by an id resolved
from the session; EVENT CONTENT NEVER DOES.
⛔ And do not write a bare team-membership union — it looks equivalent, is
shorter, and silently retires per-event grants, which the owner ruled against.

⚠ A supplier's after-the-day surfaces currently point AWAY: their recaps and real
stories link from their own dashboard to the event address, and the Hub offers
them nothing supplier-shaped after 6 a.m. That is the look-back state.
⚠ NAMED AND NOT YOURS TO SOLVE: a weak-signal venue defeats the desk. The design
says so honestly. It is its own project.
```

---

## `hub3` — EACH KIND OF EVENT OFFERS ONLY ITS OWN ROOMS

```
You are picking up the session named hub3 in the Setnayan project.

✅ RULED 2026-08-28 — THE OWNER SAID "ONLY ITS OWN ROOMS". Build it. He was shown
the alternative (keep everything available for every kind) and chose enforcement.
Do not re-ask it. Use Fable to measure which rooms each kind should keep, then
build; the measuring is still worth doing, the DECISION is not.

THE MEASUREMENT THAT MAKES IT REAL (verified 2026-08-28, live database):
  · 17 event kinds. FIFTEEN of them carry an IDENTICAL 7-surface list.
    The wedding has 9. simple_event has 6.
  · So a dinner date and a trip are offered the same rooms as a wedding, and a
    corporate event can have a gifts page.
  · Nothing is broken — the unfilled rooms answer honestly ("nothing posted
    yet") — but it is not the grid the owner approved on 2026-08-17.

WHAT A PERSON GETS, if he says enforce: someone planning a reunion is not offered
seating charts and a gift registry they will never use.

⚠ SEEN FROM THE DAY ITSELF, THIS IS THE SAME GAP: the Live hub's panels assume
the host published seats and a programme, so at a kind where those rooms will
never be filled it answers with polite apologies forever. Harmless today — no
such event has reached its day — and it disappears when the grid is enforced.

TRAPS:
  · These profile rows were created by an ADMIN, not by a migration. A migration
    naming them matches zero rows in every local replay, silently. Verify against
    production, and dry-run any change inside BEGIN…ROLLBACK.
  · The solemn kind's key is `wake`, not `funeral`.
  · Removing a room from a kind is a DELETION for anyone mid-plan. Check whether
    any live event of that kind has content in a room you are about to withdraw
    before withdrawing it.
```

---

## `hub4` — A SHOP'S TEAMMATE CAN OPEN THE DESK

```
You are picking up the session named hub4 in the Setnayan project.

✅ RULED 2026-08-28 — "STAFF GET BOTH". Build the arm.

The owner was asked precisely this: a granted teammate opening the desk ALSO
counts as "one of the people of this celebration", which unlocks a private
keepsake the host did not choose to share with them. He was offered the careful
option — separate the two, so they work the event without becoming one of its
people — AND HE DECLINED IT. Working the event makes you one of its people,
keepsake included.

⚠ SO DO NOT BUILD THE SEPARATION. It was considered and refused; re-proposing it
is re-asking a settled decision. Build the straightforward version.
⚠ AND SAY IT OUT LOUD IN THE PRODUCT. A host granting a shop access should be
able to see that the shop's staff come with it — this ruling widens who can see
something private, so the widening must be visible to the person it affects,
not buried in a permission table.

WHAT A PERSON GETS, once ruled: the photographer's second shooter opens the same
desk the shop owner does, instead of being turned away from a celebration their
own shop is booked for.

FIRST, MEASURE: confirm the grant mechanism and exactly WHICH surfaces read the
"one of the people" membership today — because those are precisely the surfaces a
shop's teammate is about to gain, and the owner is entitled to a list of them
rather than a promise. Report that list in the PR body.
```
