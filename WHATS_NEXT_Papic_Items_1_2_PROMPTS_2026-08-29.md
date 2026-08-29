<!-- Ready-to-paste session prompts for items 1 and 2 of
WHATS_NEXT_Papic_Build_Order_2026-08-29.md. Paste ONE prompt per session, verbatim. -->

# Papic items 1 & 2 — session prompts (2026-08-29)

> ✅ **SAFE TO RUN TOGETHER.** Item 1 touches the guest camera and its quota read; item 2 touches
> the public marketing page. **Disjoint on every file.** Neither needs a migration.
> ⚠ Both must `git fetch` before branching — other sessions work this repo and `origin/main` moved
> three times during the planning session alone.

---

## SHARED HEADER — paste at the top of BOTH prompts

```
Read the repo's own CLAUDE.md and the corpus CLAUDE.md first, then follow RULE 0: assume what you
are about to build already exists, and locate it before writing anything.

Working rules for this session, all of which have cost this project real work before:

1. Branch, then `git worktree add` IMMEDIATELY — beside the repo at
   ~/Documents/Claude/Projects/wt-<name>. NEVER in /tmp: a finished, proved change was lost that
   way on 2026-08-28 with zero commits ever made.
2. `pnpm install` in the worktree BEFORE running anything. A run in an uninstalled worktree means
   nothing.
3. PUSH THE MOMENT IT TYPECHECKS. Do not batch a session's work into one commit at the end.
4. Typecheck with the exit code printed beside the error count:
   `npx tsc --noEmit -p tsconfig.json > /tmp/tsc.log 2>&1; echo "TSC_EXIT=$?"; grep -c 'error TS' /tmp/tsc.log`
   An EMPTY log is NOT a clean one — tsc exits 144 on abort, and two concurrent typechecks cause
   exactly that. Never run two.
5. Require `# tests` to be NON-ZERO before believing any pass. Zero-tests-zero-failures is
   byte-identical to success and exits 0.
6. Mutation-test every assertion you add and PRINT THE OCCURRENCE COUNT before → after. An
   unmeasured sabotage proves nothing. If a well-formed sabotage reports GREEN, suspect the
   sabotage before the guard.
7. Add a changelog fragment in changelog.d/ — never edit CHANGELOG.md or STATUS.md directly.
8. Auto-merge is the standing default: `gh pr merge <n> --auto --merge` right after creating it.
```

---

## ITEM 1 — the browser stops enforcing a limit that does not exist

```
Fix a live defect in Papic's guest camera. Spec: WHATS_NEXT_Shots_Per_Guest_2026-08-28.md § 1 in
the corpus at ~/Documents/Claude/Projects/Setnayan. This was built once, proved, and lost with its
worktree — it is a re-run of known work, not a rediscovery.

THE DEFECT, verified out of the objects:

papic_record_guest_capture (migration 20270920602517) decides whether the per-guest cap binds with
TWO disjuncts:

    v_unlimited := <event owns PAPIC_UNLOCK> OR COALESCE(v_pool_applies, FALSE);   -- :111-114

lib/papic-guest.ts `fetchGuestQuota` mirrors ONLY THE FIRST. The pool disjunct arrived with the
one-pool model and never reached the TypeScript copy. Every celebration arms the free 50-shot
grant, so the per-guest cap is inert server-side EVERYWHERE — and
app/api/papic/guest-capture/route.ts does NOT pre-check `remaining` (grep it: the word appears only
in a docblock and a type).

Meanwhile papic-guest-capture.tsx computes `exhausted = !guestUnlimited && remaining <= 0` off a
countdown from a hardcoded 150, hides its own shutter, and paints "That's all 150 photos, {name}!".

⇒ The server would take the 151st photo the browser already refused. A guest at a large wedding is
locked out of a celebration still holding thousands of shots, by a number nobody chose, and the
couple never learns it happened.

BUILD:

1. `fetchGuestQuota` asks BOTH disjuncts — eventHasPapicUnlock AND readEventPoolStatus (already
   imported in that file, already used by eventPapicGuestAccess) — and combines them exactly as the
   SQL does. Return `capApplies` (the inverse), plus `poolRemaining` and `poolLow` from the pool
   status, so a screen can say what is true without inventing a number.
2. The camera draws a personal countdown, and may hide its shutter, ONLY when `capApplies`.
   Otherwise show nothing, or "Running low" once the pool crosses its own soft-stop line.
3. Separate the two refusals in BOTH handlers — photo and clip are two copies, and a fix applied to
   one of them is not a fix. Today `res.status === 409 || json.status === 'quota_exhausted'`
   collapses POOL-EMPTY into the per-guest congratulation, so a guest three photos in can be told
   "That's all 150 photos" AND have the buy panel open offering shots that also cannot be taken.
   The component's own docblock states the rule it breaks: "A REFUSAL THAT REUSES ANOTHER
   REFUSAL'S STATUS CODE INHERITS ITS COPY." Give the pool case its own state and its own sentence
   about the celebration. Offering more shots stays correct in BOTH cases — that is what an empty
   pool is for.
4. Thread it through the Event Hub, which mounts the same camera:
   app/[slug]/_lib/loaders.ts and app/[slug]/_components/site-body.tsx.
5. COLLAPSE THE DUPLICATED SHAPE. `GuestPapicCamera` in app/[slug]/_lib/types.ts and the inline
   declaration in loaders.ts are two copies of one shape — the same disease as the bug. Make
   types.ts the only declaration and have the loader import it.

GUARD — lib/papic-guest-quota-mirrors-sql.test.ts:

Test 1 must DERIVE the disjunct list from the migration rather than restate it, so a third
condition added in SQL fails here until the TypeScript learns it too. A guard that hard-codes
"there are two" is a third copy of the same rule and rots the same way.
⚠ COUNT BOTH plpgsql write forms — `v_unlimited :=` AND `SELECT ... INTO v_unlimited`. Counting
only `:=` reports 1, and that is how this guard first lied to itself.
Also assert: capApplies is the inverse of the mirrored rule; `exhausted` is gated on capApplies and
is NOT the old expression; BOTH 409 handlers reference capApplies; the pill is not unconditional;
the pool copy exists and the per-guest copy survives.
Strip comments before matching — every docblock quotes the defect verbatim.

CHECKED AND DELIBERATELY NOT CHANGED: app/papic/decorate posts to the same route and looks like the
same bug. It is not — it keys on the refusal's STATUS rather than the bare 409, which is exactly
the rule the camera broke. Leave it alone, and say so in the PR.

ALSO VERIFY STILL GREEN (they read the files you are editing):
lib/papic-capture-has-a-ceiling.test.ts, lib/putaway-stops-captures.test.ts,
lib/guest-cameras-open-when-the-host-says.test.ts

NO migration. NO new feature. NO setting. A celebration where a per-guest cap genuinely binds must
behave byte-identically.
```

---

## ITEM 2 — say what is already true

```
Fix the Papic promotion page at apps/web/app/(shell)/papic/page.tsx.

READ FIRST, and do not write a word before you have:
 · ~/Documents/Claude/Projects/Setnayan/PAPIC_PAGE_BRIEF_FOR_CHAT_2026-08-29.md — especially § 2
   (what may be claimed) and § 3 (what may NOT). Two previous drafts of this page were written
   without seeing the product and both promised things we cannot do.
 · ~/Documents/Claude/Projects/Setnayan/prototypes/papic_promotion_page_2026-08-28.html — the
   already-drawn delta. PORT IT, do not redraw it.

RULE 0 IS PRE-ANSWERED: the page already ships and is already ported onto the shared DoorwayPage
archetype. You are changing COPY and the page's own children, not building a page.

TWO HALVES.

HALF A — the repairs, already drawn:
1. The price block prints ALL 16 top-up rungs — 1,111 px, a fifth of the page, and it has NO
   HEADING AT ALL. It was written when there were three rungs; the ladder was recut to sixteen on
   2026-08-26 and nobody re-looked. Cut it to THREE example amounts plus the "See the full price
   list" link that is already directly underneath. Give the block a heading.
2. Move "Two ways to run it" ABOVE the price block, so somebody is told what they would be buying
   before they are told the cost.
⚠ Every figure is DERIVED from the live tier tables via resolvePapicAnchor and the papic-tier-copy
helpers. NEVER type a price. A rung we cannot price must DROP OUT rather than render a guess — that
behaviour already exists; keep it.

HALF B — the facts we have never said. All verified in the running product:
 · Papic starts FREE — 50 shots on every celebration. Every rival's cheapest entry is ₱499–₱999.
   This is the single most converting fact we have and it currently sits 2,196 px down the page.
 · THE LIVE WALL IS FREE on every celebration. Verified: LIVE_WALL is in FREE_FOR_ALL_SKUS and both
   eventOwnsSku and eventSkuActive short-circuit true before any order read. There is nothing to
   buy. This is a stronger line than any price.
 · Any face can vanish — and we blur the photograph itself, failing closed.
 · Face data is really deleted, on request and automatically three months after the celebration.
 · Nothing unscreened is ever shown — a permission list, and it cannot be switched off.
 · Nothing is ever deleted; only the file size steps down, and the gallery is kept free for life.

⛔ HARD PROHIBITIONS — each fails on a rival's homepage in fifteen seconds:
 · NO latency or speed number of any kind. Nothing measures one.
 · NO per-guest shot limit claim — unbuilt. (And a rival already does per-guest limits; what is
   ours is limits PAIRED WITH A LIVE WALL.)
 · NO chapters / the year / engagement-to-wedding — unbuilt.
 · NEVER "the live service closes after six months". Nothing closes. Six months is the SHOOTING
   window. Lead with the lifetime archive — the global norm is 12–14 months, so leading with six
   makes us look SHORTER than rivals rather than the only one keeping it for life.
 · NO dollar prices, no papic.setnayan.com subdomain, never "Papic Pool" or "Papic One".
 · NO EXPLAINING LINE UNDER THE HEADLINE. The owner removed the eyebrow and sub-paragraph from
   every page on 2026-08-19: "we do not need these. it just eats up space." Headline, then the
   buttons.

DESIGN LOCKS: page white #FFFFFF · ink #2C2A29 · one action colour #C24E25 · links #3B4E67 · gold
#A9834B for SMALL LABELS AND ICONS ONLY, never body text — gold has almost no contrast headroom and
the text gold #8A6B39 FAILS on any tinted card. One typeface family; the "serif" on marketing pages
resolves to the same sans by design — do not introduce a display serif. Mobile first.
🔒 The hero, steps, versus rows, FAQ and closing panel come from the SHARED DoorwayPage used by
EIGHT product pages. Changing the shape changes all eight — stay inside it, or say explicitly that
you are proposing a change to all of them.

GUARD: extend or add a test asserting the page never renders more than N price rungs, that the
price block has a heading, and that none of the prohibited claims appear in the rendered copy.
Derive the prohibited list from one constant so a ninth prohibition is one line.
```

---

## When both are done

Item 1 is a defect fix and should merge as soon as it is green. Item 2 should be **looked at on a
phone** before merging — it is the page a stranger meets, and nobody has seen the new shape on a
real handset.
