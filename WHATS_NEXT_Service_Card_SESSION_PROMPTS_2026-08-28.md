# Service card maker — paste-ready session prompts · 2026-08-28

> One prompt per session. **Paste the SHARED HEADER first, then one session block.** Register:
> [`WHATS_NEXT_Service_Card_SESSIONS_2026-08-28.md`](WHATS_NEXT_Service_Card_SESSIONS_2026-08-28.md).
> 🛑 **Never more than two sessions at once, and never S3 with S4** — both edit the same file.

---

## SHARED HEADER — paste this at the top of every session

```
You are working on the Setnayan platform.

CODE: github.com/iscasasola/setnayan-platform · SPECS: ~/Documents/Claude/Projects/Setnayan/

READ FIRST, in this order:
  1. ~/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Service_Card_Maker_2026-08-28.md
     — what the service card maker now does, promise by promise, and what was measured.
  2. ~/Documents/Claude/Projects/Setnayan/WHATS_NEXT_Service_Card_SESSIONS_2026-08-28.md
     — the register, including the RULE 0 table of things that ALREADY SHIP.
  3. prototypes/service_card_wizard_2026-08-28.html — the approved drawing. It is BINDING:
     port it, never redraw it. A delta between a built screen and the drawing is a defect in
     the port, not a fresh design decision.

RULE 0 — FIND IT BEFORE YOU BUILD IT. Almost nothing you are asked for is new. Before writing
any code, grep for the feature noun in apps/web and say in one line each: what exists · what is
missing · the delta you will build. If you cannot name the existing component, you have not
searched enough.

HOW TO WORK:
  · git worktree add IMMEDIATELY (never work in the main checkout, never read code from ~ —
    that tree is ~750 commits stale and has produced confident wrong answers).
  · One PR, auto-merge armed after opening: gh pr merge <n> --auto --merge
  · A changelog fragment in changelog.d/<branch-slug>.md, never CHANGELOG.md or STATUS.md.
  · Spec-impacting decisions get a row at the BOTTOM of DECISION_LOG.md.
  · Prune the worktree the moment the PR merges.

HOW TO PROVE ANYTHING:
  · Print TSC_EXIT beside the error count — tsc aborts at 134 while printing errors=0.
  · Require a NON-ZERO "# tests" count; a run that matched no files prints 0 and exits green.
  · Every guard you write gets a MEASURED mutation: print the occurrence count before → after
    and show it going red. An unmeasured mutation proves nothing; 29 across this stream so far,
    and several early ones were decoration.
  · Read production by the OBJECT, never from a migration comment or a doc.

HOW TO TALK TO THE OWNER: plain English, what a PERSON experiences. No file paths, function
names, table names or flag names in the reply — those belong in the PR body. Decide and act on
reversible pre-launch work; escalate only real owner territory (prices, scope, risk, reversing
a lock). Stop at every gate your session names.
```

---

## S1 · IT IS LIVE, AND IT WORKS ON A REAL SHOP

**Sonnet · low effort · read-only · pairs with anything**

```
Confirm the new service card maker is actually serving real suppliers, then walk it.

1. gh pr view 4930 --json state,mergedAt — if it is not MERGED, stop and say so. Do not
   re-verify anything else; the rest of this session is meaningless until it lands.
2. Confirm PRODUCTION IS SERVING IT BY ANCESTRY, not by the merge: fetch /api/health, take the
   commit it self-reports, and prove that commit is a descendant of #4930's merge commit
   (git merge-base --is-ancestor). A merge is not a ship.
3. Then walk the six doors that mean "make a card" and confirm each opens the maker itself:
   the top bar's + Create service card · My Shop's Add a service · My Shop's empty state ·
   the first-run checklist step · the repertoire page · the earnings page. Six call sites use
   one shared constant; your job is to confirm nothing else in the vendor tree still points at
   the old drawer.
4. Report in plain English what a supplier now experiences, and anything that looks wrong.

⚠ You cannot sign in as a supplier. Say plainly which of the above you proved by fetching the
live site and which you proved by reading merged code — never blur the two.

Gate: report only. Do not fix anything you find without saying what it is first.
```

---

## S2 · ONE VOCABULARY INSTEAD OF TWO

**Opus · high effort · measurement only · pairs with anything · ENDS AT AN OWNER DECISION**

```
Setnayan describes what a shop does in TWO vocabularies that do not agree, and a supplier meets
both in one screen.

  · COVERAGE speaks the newer taxonomy: the owner's own shop covers a leaf called "Pabati".
  · SERVICE CARDS speak an older list of ~52 category keys (~34 labels after duplicates
    collapse). There is no "Pabati" in it.

The card maker currently bridges them BY FAMILY (the tier-1 folder), which is correct and is
not the same as the two lists agreeing.

MEASURE, then propose ONE thing. Nothing here is a build.

  a. For every coverage leaf in the live taxonomy, which card category (if any) means the same
     thing? Produce the actual table. Count: exact matches · family-only matches · leaves with
     no card kind at all · card kinds no leaf covers.
  b. Read it out of PRODUCTION, by the object. Every live shop's coverage rows and every live
     card's category, and say how many real rows each finding touches (prod is small — say the
     numbers, do not estimate).
  c. Name what a couple actually searches by today, and what would change for them if one list
     replaced the other. That is the part that makes this the owner's call, not a tidy-up.
  d. Then put ONE recommendation in front of the owner, in plain English, with the cost and the
     risk of each of the two or three real options you considered.

⛔ DO NOT migrate anything, do not rename a leaf, do not add a category, and do not "fix" the
bridge. A taxonomy leaf removal can strand shops permanently, and shop addresses are immutable.

Gate: a written recommendation + the measured table. STOP THERE.
```

---

## S3 · A LOCKED KIND HAS SOMEWHERE TO GO

**Sonnet · medium · touches `canvas-maker.tsx` · 🛑 NEVER with S4 · BLOCKED until the owner answers**

```
BLOCKED UNTIL THE OWNER ANSWERS. Do not start building until you have his answer in writing:
"when a supplier's plan cannot hold a kind of service, where should the greyed pill lead —
the pricing page, or the 'tell us what you do' form?" If you do not have it, ask, and stop.

RULE 0, PRE-ANSWERED — DO NOT BUILD EITHER OF THESE, THEY EXIST:
  · The "tell us what you do" intake SHIPS: a vendor form on My Shop writes a pending row that
    admins resolve from the taxonomy console. Grep for proposeCategory before designing
    anything.
  · The pricing/plans page ships.

So this is a WIRING job plus copy, not a feature. What is missing is only that the greyed pill
explains and then stops.

Build the destination the owner picked:
  · The pill stays visible and stays unpressable — a kind that quietly vanishes reads as
    "Setnayan does not do that", and a pill that looks refused but still submits is worse than
    both.
  · Whatever it leads to must come back to the card being made. Losing a half-built card to a
    pricing page would repeat the exact defect this whole stream removed.
  · The reason is said ONCE for the whole greyed set, not once per pill.

Guard it, and mutate the guard: the pill still disabled · the destination present · the return
path present. Print each count before → after.
```

---

## S4 · THE LAPTOP GETS ITS TWO COLUMNS

**Sonnet · medium · touches `canvas-maker.tsx` + `globals.css` · 🛑 NEVER with S3**

```
On a phone the card maker is right. On a laptop the drawing shows the card PINNED LEFT AT FULL
SIZE with the current question beside it; what ships is a single centred column with the
question as a right-hand panel over it. Port the drawing.

  · The card is the thing being built — at 1400px there is no reason for it to be small or
    partly covered.
  · Same flow, same order, NO extra fields, no second layout to maintain: this is CSS and one
    wrapper, not a desktop version of the maker.
  · The phone is untouched and must be proved untouched.
  · An ordinary edit (outside the guided first pass) stays a bottom sheet at every width —
    nothing is being built behind those.

Watch for: the page's own max-width, which currently centres everything; and the sheets, which
must keep working as sheets on a phone.

Guard it and mutate the guard, including one that proves the PHONE layout did not change.
```

---

## S5 · A PUBLISHED CARD LOOKS RIGHT WHERE COUPLES MEET IT

**Sonnet · medium · touches the public shop page + marketplace card · pairs with anything**

```
Follow ONE card the whole way: made in the maker, published, then met by a couple on the public
shop page and in the marketplace. Fix what does not survive the trip.

Known and worth checking first, each measured rather than assumed:
  a. A card with NO title. The maker now writes a name from the kind, but a title is still
     optional and blank is stored as nothing. Confirm what the public page renders in that
     case, everywhere it renders it (shop page · marketplace card · anywhere else the name is
     read) — a database key must never reach a couple.
  b. The price line. The maker offers per event / per head / per hour and "price on request";
     confirm each one reads correctly to a couple, including the shop that hides prices.
  c. The Setnayan Exclusive — the one thing the whole publish gate exists for. Confirm it
     actually renders where a couple will see it, and says what it means.
  d. A card in a kind whose label the taxonomy renames. The maker takes labels from the live
     taxonomy; check the public side agrees rather than showing the older word.

Prod is small — read the real rows. Say which findings touch a real card and which are
theoretical.

Gate: fix what is plainly broken; anything that changes what a couple is PROMISED (wording of
the Exclusive, whether a price may be hidden) is flagged, not decided.
```

---

## ⏭ Not sessions — the owner's, whenever he wants them

1. **Should a half-finished card survive on our side, not just in that browser?** Today it is
   browser-only on purpose: a server draft mints a real card row per abandoned attempt, which
   lands in the shop's own list and in the caps that count cards.
2. **`NEXT_PUBLIC_SERVICE_DETAILS_ENABLED`** is still an unflipped switch from the card-family
   wave (2026-07-29). Unrelated to this stream, still open.
3. **The drawer's name.** Now that every "create a card" control opens the maker, the drawer on My
   Shop is really the *coverage* door wearing a shared name. Renaming it is copy, and copy about
   what a supplier thinks they are doing is the owner's.
