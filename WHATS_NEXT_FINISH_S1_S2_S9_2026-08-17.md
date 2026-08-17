# Finish S1 · S2 · S9 — ready to paste, 17 August 2026

> 📄 **COPY-PASTE PAGE (one button per prompt):**
> <https://claude.ai/code/artifact/21becc67-808b-4c56-abbd-d495534ab84e>

> Three prompts that CLOSE the three sessions already in flight. Every "already ships" line was
> read from `origin/main` and the live production database **today** — after their merges — so a
> fresh session does not re-derive it and does not rebuild it.
>
> 🚨 **SPLIT S2-FINISH BEFORE STARTING ANYTHING ELSE — MEASURED 2026-08-17.**
> Its two halves have wildly different footprints, and the small one is not the blocker:
>
> | half | files in scope |
> |---|---|
> | sign-up | **3** |
> | the doubled tab title | **402** — every page file in the app |
>
> **The tab-title half is app-wide, exactly like S3, and it is what blocks every other session.**
> With it in scope, S4 · S5 · S6 · S7 · S8 · S11 ALL collide with S2-FINISH. **Defer it and
> S3 · S4 · S5 · S6 · S8 · S10 are all free to start immediately.**
> ⏭ It is the natural thing to defer anyway: **it is already waiting on the owner's wording** for
> the "keep it forever" line, and those are the same files.
> 🔑 **A SESSION'S BLAST RADIUS IS NOT ITS IMPORTANCE.** A one-line mechanical change across 402
> files blocks more work than a careful 860-line rewrite of one.
>
> 🛑 **These three touch different trees and may run TWO at a time.** Measured: S1 is the event
> page, S2 is the account screens, S9 is migrations + the photo tables. **Zero shared files.**
> The safe pairs are **S1+S2**, **S1+S9**, **S2+S9** — any two, not all three.
>
> ⚠ **A migration is judged against the state it will LAND in, not the state it was written
> against.** Two sessions each did the right thing today and still collided on a grant, because
> one re-granted what the other had just revoked and neither PR could show it. **If your work
> touches grants, re-read the live permissions immediately before merging.**

Paste the **shared header** from
[`WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md) on top of
each block below. It carries the rules and today's production numbers.

---

# S1-FINISH · The host stops being a stranger on their own event page
**small · no owner ruling · pairs with S2 or S9**

```
WHAT A PERSON GETS: a couple opens their own wedding's web address and the page speaks to them as
the people whose wedding it is — instead of showing them the visitor's page with a thin ribbon on
top, which can still tell them to "scan your personal QR" for an invitation they are the ones who
send.

STATUS: S1's FIRST HALF SHIPPED AND IS LIVE — PR #4483, verified in production. A booked supplier
can now get past the private-event gate. DO NOT REDO THAT. This is the half of the same brief that
did not ship.

ALREADY SHIPS — DO NOT REBUILD (read from origin/main 2026-08-17):
- `resolveOwnerCapability` in app/[slug]/_lib/site-identity.ts — the server-verified host gate.
  Correct, in use, and already resolved on every render of this page.
- The read-only owner ribbon: `ownerCapability` is already threaded into
  app/[slug]/_components/site-body.tsx (props at ~355, ~393, consumed ~403). The ribbon renders.
- The private-event gate already admits a signed-in host (Path B) — they REACH the page fine.

THE DEFECT, AND IT IS ONE BRANCH:
app/[slug]/page.tsx line ~821:

    if (!session) {
      return renderAnonymous(inviteError === 'invalid_token' ? 'invalid_invite' : null);
    }

`session` is the GUEST COOKIE. A host has an ACCOUNT, not a guest cookie — so a signed-in host
with no cookie falls straight into the anonymous body. The file's own comment at ~481 says exactly
this: "they fall through to `renderAnonymous`". The ribbon then sits on top of a body written for
a stranger.

BUILD: an owner body variant, taken when `ownerCapability` is present and there is no guest
session. Reuse the existing anonymous body as the base and change what is UNTRUE for a host —
start with any copy telling them to find or scan an invitation.

🔒 READ-ONLY STAYS READ-ONLY. Every real control (guest list, seating, budget, schedule, vendors)
lives in /dashboard/[eventId] and this is NOT the session that moves any of it. The Event Hub is a
place people visit, not a control panel. Adding a single editing control here is out of scope.

🔒 AND DO NOT WIDEN WHAT A HOST SEES. A host is not a guest: they must not acquire a guest session,
a seat, or any per-guest surface by taking this branch. app/[slug]/_lib/site-identity.ts declares
owner-ness as an ADDITIVE capability orthogonal to the identity tier — keep it that way. Assert
what the owner payload does NOT contain, on an event seeded with real guest rows.

⚠ THE `?as=replied` PREVIEW ALREADY EXISTS and is gated on ownerCapability (page.tsx ~795). It
substitutes a FABRICATED guest so a host can preview the RSVP'd view. Do not break it, do not
duplicate it, and do not turn your new branch into a second preview mode.

HOW TO PROVE IT: prod has 6 events and real host rows, so this one IS observable — but you cannot
sign in as the owner. Cover it with tests, and say plainly in your reply which parts are
test-proved and which are observed. Do not claim you watched it work.
```

---

# S2-FINISH · The account funnel, and the tab that says Setnayan twice
**medium · ⚠ CARRIES ONE OWNER DECISION · pairs with S1 or S9**

```
WHAT A PERSON GETS: the last two screens of the way in stop looking like a different product, and
browser tabs stop reading "Setnayan · … · Setnayan".

STATUS: S2 IS ALMOST DONE. Five changes, four live. TWENTY-TWO entry screens now share one look
(PRs #4484 · #4486 · #4491 · #4493, plus #4494 for the nine refusal screens). DO NOT REBUILD ANY
OF THEM.

ALREADY SHIPS — DO NOT REBUILD, DO NOT REDRAW (read from origin/main 2026-08-17):
- app/_components/door/door-shell.tsx — the one shared door, with its own guard
  (doors-are-designed.test.ts) that now recognises the door CARD BY SHAPE, so a new hand-made copy
  fails the build rather than waiting to be noticed. 18 screens import it.
- /login renders `SignInCardModal` — the owner-locked shared sign-in card (owner 2026-07-18, "we
  only want 1 login"). ⛔ DO NOT TOUCH /login. It is not undesigned; it is the design.
- /forgot-password and /reset-password were ported in #4493.
- The nine refusal screens are in #4494.

═══ PART 1 · SIGN-UP — the careful one ═══
app/signup/page.tsx is 860 lines: a two-column marketing-register page with a brand panel. It is
the ONE screen where a mistake costs a real signup, and it is the last screen still wearing the
website's look rather than the door look.
KEEP THE COMPOSITION. Change the REGISTER, not the layout. This is a reconcile, not a redraw.
Measure the form still posts every field it posted before — a lost field here is a lost customer,
and nothing else in this repo will tell you.

🎨 THE COLOUR TRAP, MEASURED — IT HAS BITTEN THREE TIMES:
In this repo the Tailwind slot named `terracotta` is the atelier GOLD #A9834B, and the CTA
terracotta #C24E25 lives in the slot named `mulberry`. Inherited, and BACKWARDS — `text-terracotta`
LOOKS safe and is the unsafe one, at 3.37:1 on cream, below the 4.5:1 floor. Use `text-mulberry`
(4.61:1) or `text-link` (8.22:1). Gold on an ICON is fine; never on text.
⚠ CHECK BOTH THEMES. `text-mulberry-700` measures 5.86:1 light and 3.05:1 DARK, because that slot
flips on a dark panel. A light-only check waves it straight through — this shipped once already.

═══ PART 2 · THE DOUBLED TAB TITLE ═══
app/layout.tsx (~line 293) sets `template: '%s · Setnayan'`, so the brand is appended to EVERY page
title. 147 page titles under app/ already contain the word themselves (a subset reach the actual
tab; the rest are social-card titles the template does not touch — count them before you edit).
So a tab can read "Setnayan · … · Setnayan". Mechanical, and worth doing once, properly.

🔴 AND WHILE YOU ARE IN THOSE EXACT FILES — AN OWNER DECISION YOU MUST NOT MAKE:
app/page.tsx line ~53 is `HOME_TITLE = 'Setnayan · Plan your Filipino wedding free — keep it
forever'`, and its description (~55) plus layout.tsx (~296, ~320, ~335) promise "keep every photo
and memory in one place FOR LIFE". THE RULING IS: free for 5 years, then a paid option — and
nothing is ever deleted, only compressed. The privacy page was corrected months ago; the front
door, the Google result and every share card were not.
⛔ DO NOT INVENT THE REPLACEMENT WORDING. "For life" is positioning and the owner owns it. ASK,
with the exact strings quoted, and do the title de-duplication around it so those files are edited
ONCE rather than twice.
🔑 A CORRECTION AT ONE SITE IS NOT A CORRECTION — the last pass checked the product pages, found
them clean, and closed this while the promise sat in the page title all along.
```

---

# S9-FINISH · The gate on every photo you actually have
**medium · ⚠ CARRIES ONE OWNER DECISION · pairs with S1 or S2**

```
WHAT A PERSON GETS: the consent gate that decides whether a photo can ever be shown publicly can
actually be answered — for the photos that really exist.

STATUS: S9's SHIPPED WORK IS VERIFIED IN PRODUCTION BY THE OBJECT, NOT BY ITS REPORT.
Anonymous read access 306 → 290 tables of 384 (batch 1, #4489). The browser-report table exists
and receives. The switches guard now ENUMERATES from the schema catalog and carries a 122-line
reasoned baseline (#4485) — its own claim, and it is TRUE. DO NOT REBUILD ANY OF IT.

═══ PART 1 · THE FINDING S9'S OWN GUARD RAISED, AND THAT I WRONGLY DISMISSED ═══
`gates-have-handles.baseline.txt` marks `papic_photos.consent_to_public` as a FINDING. I checked
the NEIGHBOURING table, found a working writer, and reported the feature fine. That was wrong.

MEASURED IN PRODUCTION 2026-08-17 — there are TWO capture paths sharing one column name:

  papic_guest_captures.consent_to_public  — WRITTEN by the guest capture screen's checkbox
                                            (app/papic/guest/_components/papic-guest-capture.tsx
                                            → app/api/papic/guest-capture/route.ts → the RPC).
                                            Prod rows: 0.
  papic_photos.consent_to_public          — NO WRITER ANYWHERE. No function body in prod touches
                                            it; no route sets it. Prod rows: 14 — EVERY REAL
                                            PHOTO YOU HAVE.

So every photo in production sits behind a gate nobody can open, and can never become eligible for
the public showcase.

🔑 CHECKING THE TABLE THAT WORKS IS NOT CHECKING THE FEATURE. Two tables, one column name.

⚖ THE OWNER DECIDES THE SHAPE — DO NOT DECIDE IT YOURSELF, AND READ THIS FIRST:
The live /privacy page promises a TWO-GATE system in these words: "a photo only becomes eligible
for the couple's public showcase when two gates are met: you opt in at capture time (off by
default, never pre-checked) and the couple approves it." It says "if you take photos AS A GUEST".
The seat path is a friend handed a camera — arguably a different person and a different question.
SO THIS IS NOT A BROKEN PROMISE, and you must not "fix" it by copying the guest flow.
ASK: should a camera-seat photo carry its own capture-time consent — and whose consent is it, the
friend holding the camera or the person in the frame? Build only after he answers.
⛔ DO NOT loosen the reader. `couple_approved_for_showcase` and this column are ANDed on purpose.
Fail closed.

═══ PART 2 · THE NEXT GRANT BATCH ═══
anon-table-grants-closed.db.test.ts line ~24: "~194 remain; each later batch". Continue in SMALL
batches with the SIXTH GATE S9 added — that gate exists because taking one key back would have
emptied the public supplier listing for every signed-out visitor, and the automated check named
only ONE of the two tables involved.
🔑 TRACE THE WHOLE CHAIN, NOT THE TABLE THE FAILURE NAMES. Obeying the failure alone would have
shipped a second, untested break silently.
🪤 READ THE COLUMN DEFAULT BEFORE YOU REVOKE, a table-level revoke drops COLUMN grants, and the
replay runs as superuser — DRY-RUN EVERY MIGRATION AGAINST PROD IN A ROLLED-BACK TRANSACTION.
🚨 AND RE-READ THE LIVE GRANTS IMMEDIATELY BEFORE MERGING. Two sessions collided on exactly this
today: one revoked a grant, another re-granted it hours later, both were correct in isolation, and
neither PR could show it.

═══ PART 3 · WHAT NOT TO DO ═══
⛔ DO NOT enforce the wide browser-protection policy. It is deliberately still watching, not
blocking, and it should stay that way until the record has some weeks in it. That switch is the
owner's.
✅ The two tables nothing creates (`event_service_deliveries`, `pioneer_incentive_logs`) are NOT a
mystery — `20271011873973_reconcile_declared_schema_to_production.sql` names them as "the two
prod-only TABLES" and records that they were deliberately not back-filled because declaring them
would widen the exposure surface and fail the freeze. NOTHING TO DO. Do not re-investigate them.
✅ The two "stuck" settings are NOT findings either. The supplier radar is ON in production and is
SOLD on /vendors; only an off switch is missing, which nobody needs. The homepage spotlight strip
is off because /vendors lists it as "soon" — off is correct. Do not build controls for either.
```

---

## After these three

**Then, and only then, the eleven-session plan resumes** —
[`WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md), starting
at wave 2 (**S4** eight small things · **S9** under the floor).

⏭ **Still outstanding and NOT covered by these three:** four pull requests from 2026-08-15 that
have been armed for auto-merge and RED for two days (#4471 · #4472 · #4478, plus #4473 which
CONFLICTS and is not being tested at all). **One of the four was hiding a real disclosure**, which
is why they need reading rather than re-arming. See §6b of
[`WHAT_IS_LEFT_2026-08-17.md`](WHAT_IS_LEFT_2026-08-17.md).
