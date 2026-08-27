# SESSION PROMPTS — clearing the five 2026-08-26 streams

> Built from the owner's screenshot of his last five Claude Code sessions (Admin usability
> improvements · Admin question · Papic discussion · Pricing management redesign · Vendor
> dashboard reorganization). Each maps to a real open contract in this repo. Paste one prompt per
> session. **Run session 0 alone, first — everything else either depends on it or can collide
> with it.**

## Order

0. Close the PR collision (5 min, blocks nothing else structurally but must go first)
1. Admin: alerts + names cleanup (small, independent)
2. Admin: finish the assistant (depends on 0 only if it touches the ladder — it doesn't; safe parallel with 2/3)
3. Papic: atomic capture (independent of pricing rows, safe parallel with 1/2)
4. Pricing: fix the data-loss bug, then build the redesign (must run AFTER 0)
5. Vendor Hub: the security fixes only (plan is owner-paused past that — do NOT build the room)

Sessions 1, 2, 3 can run in parallel with each other. Session 4 must wait for 0. Session 5 is
scoped down to security only, per the owner's explicit "just plan for now."

---

## Session 0 — Resolve the duplicate Papic ladder PRs

**Why first:** #4883 and #4884 both add the same 16-rung ladder via separate migrations. Merging
both writes the catalog twice. Nothing else touching pricing (Session 4) should start until this
is resolved.

```
Two open PRs both implement the 16-rung Papic ladder: #4883 and #4884 on
iscasasola/setnayan-platform. Compare them (gh pr diff on each). Determine which one is more
complete/correct — check for the guard test pinning the 16 rungs, the sku-activation.ts mapping
for all 16, and whether the migration timestamp is safely ordered. Keep the better one, close the
other with a comment explaining why and pointing to the surviving PR. If the closed one has
anything the kept one lacks (e.g. a test file), cherry-pick that piece into the surviving PR
before closing. Then verify the surviving PR's auto-merge is armed. Report back in plain English:
which PR survived and why, and confirm nothing else needs picking from the closed one.
```

---

## Session 1 — Admin usability: finish the alerts + names cleanup

**Contract:** `WHATS_NEXT_Admin_Names_And_Alerts_2026-08-26.md`
**What's already shipped:** PR #4874 (rail + phone labels), #4881 (destination pages) — merged.
**What's open:** PR #4885 (the notification-unblock-on-your-device fix) — still open, auto-merge
should be armed but verify.

```
Read WHATS_NEXT_Admin_Names_And_Alerts_2026-08-26.md in the Setnayan spec corpus
(~/Documents/Claude/Projects/Setnayan/) fully before touching anything — it names three places a
menu label lives (wide-rail label, STRIP_CAPTION, NAV_SLOT_DEFAULTS overlay) and why renaming
only one left the owner still seeing the old name. Verify PR #4885's current state with
gh pr view 4885 --repo iscasasola/setnayan-platform --json state,mergedAt. If it's open and CI is
green, nothing to do but wait for auto-merge. If CI is red or it's stuck, diagnose and fix.

Then pick up the two items the contract calls out as NOT engineering-done:
1. The vendor notification card is a dead end (cannot enable at all, renders five words then
   `: null`). Do NOT replace it with the shared toggle — it owns deactivateAllPushTokens, a
   server-side kill switch across all devices, which the shared toggle lacks. Instead give it a
   real path to enable (or if enabling requires the owner's VAPID/browser permission action, make
   the card say so clearly instead of dead-ending).
2. Decide whether ADMIN_NAV_ALIASES (added to keep renamed labels searchable) covers every
   recently-renamed route — grep for any nav item renamed in #4874/#4881 that lacks an alias
   entry, and add missing ones.

Do NOT touch the AI search box or assistant work — that's a separate session (see
WHATS_NEXT_Admin_Search_And_Assistant_2026-08-26.md), already claimed by session 2. Do NOT rename
the Ugat subsystem itself — that's explicitly an owner decision, not yours to make.

When done: changelog fragment, plain-English summary of what changed for the admin using the
console, and list any owner decision you had to leave open.
```

---

## Session 2 — Admin assistant: build the second half of the owner's own example

**Contract:** `WHATS_NEXT_Admin_Search_And_Assistant_2026-08-26.md`
**What's shipped:** 7 PRs — scanned route map, job checklists, sentence-level search, price rows
as destinations, learn-once assistant, visible search field, surface-following create button.
**What's NOT built:** the assistant still only *navigates* to a job; it doesn't *fill and ask*.

```
Read WHATS_NEXT_Admin_Search_And_Assistant_2026-08-26.md in the Setnayan spec corpus fully first.
The owner's own example is the spec: "i want to add a new category on the taxonomy service — ask
me what to add and where to place it." Today the assistant takes the admin TO the Taxonomy page;
it does not ask the follow-up questions or fill the form. The 284-job checklist (185 form-driven)
already exists and is committed — it just isn't read by anything except the search haystack.

Build the missing half: when a job the assistant recognizes needs details it doesn't have, it
should ask for them conversationally (using the checklist's own field list — do not hand-author a
second copy of what a job needs), fill the target form, show the admin the finished thing, and
let THEM press submit. The assistant must never press submit itself — gathering and preparing is
fine, executing the action is not (this is a standing lock: money, prices, approvals and publishes
only go through with a human press).

Also fix the three findings from the adversarial audit that already ran and were confirmed (read
wf_867e7d84-c54/journal.jsonl if still available, or re-verify by hand against origin/main):
1. The phone's "All surfaces" filter requires EVERY word in a query to match, so a full sentence
   hides all 79 cards. It should match if the sentence's meaningful words are found, not require
   every token.
2. The admin lost its phone top-bar search entirely — the new box is lg: only (desktop breakpoint)
   AND it replaced the shared one instead of sitting alongside/adapting. Restore phone search.
3. "No page has the word X" is printing above hits whose names actually contain X — fix the
   no-results branching logic.

Also close the gate-with-no-handle: learned_from admits 'admin' as a value with no code path that
ever writes it. Either wire a writer or drop the value from the allowed set.

Give the learned-memory system a surface: nothing today lets anyone see, correct, or delete a
phrase the assistant has learned, so a wrong answer is permanent. Add a simple admin-only view
listing learned phrases with a delete action.

Do not touch: the admin route map generator, the job checklist generator (never hand-edit their
output — regenerate), or the assistant's core "routes only, never acts" boundary.

When done: changelog fragment + plain-English summary of what the admin can now do that they
couldn't before. ✅ Do NOT re-raise `ANTHROPIC_API_KEY` — it was set on 2026-08-27 and the
assistant is LIVE in production (proven by a `learned_from='ai'` row in prod, a value only a
successful model call can write). There is no non-engineering blocker on this stream.
```

---

## Session 3 — Papic: make capture-and-credit-spend atomic

**Contract:** `WHATS_NEXT_Papic_Meter_Ladder_And_Uploads_2026-08-26.md`
**What's shipped:** #4879 merged and verified in prod (locked down who can write photo credit
rows). Ladder handled by Session 0/4.
**What's NOT built:** the real fix — a captured photo can currently exist without its credit
actually being spent, because reserving the credit and writing the photo row are two separate
steps.

```
Read WHATS_NEXT_Papic_Meter_Ladder_And_Uploads_2026-08-26.md in the Setnayan spec corpus fully
first, and confirm PR #4879 is merged (gh pr view 4879 --repo iscasasola/setnayan-platform
--json state,mergedAt) before starting — this session builds on top of it.

The problem: recordSeatCapture reserves Papic credits, THEN writes the photo row, as two separate
database calls. If the process dies in the gap, the credits are gone but no photo was recorded —
we lose money, the guest doesn't, which is the safe direction to fail in, but it should not be
possible to write a photo row with no credit actually spent.

The fix already exists in this codebase for the guest-upload path: papic_record_guest_capture is
a single SECURITY DEFINER Postgres function that does the eligibility checks, reserves the
credit, AND inserts the photo row all in one transaction — which is exactly why the anon role
never needed an INSERT grant on that table. Do the same for the seat-camera capture path
(recordSeatCapture): write an equivalent SECURITY DEFINER function that combines reserve + insert
for camera captures, and switch the seat capture route to call it instead of doing the two steps
in application code. Do NOT just copy papic_record_guest_capture verbatim — it writes a different
table (guest captures vs seat/camera captures) — use it as the shape to follow, not the function
to reuse.

Two things to double check while you're in there:
1. current_user inside a SECURITY DEFINER function is the function's OWNER, not the caller — this
   has bitten this codebase before. Do not write any caller-identity check using current_user
   inside the new function; resolve caller identity the way the guest-capture function already
   does it correctly.
2. Verify column-level grants with has_table_privilege per column, not a table-level check — a
   table-level privilege check can read FALSE while individual column grants still stand open,
   which has hidden a real hole here before.

Also close two named-but-not-built gaps from the contract:
- The uploads-open switch must be read server-side wherever guests or suppliers can upload (not
  just client-side) — find where it's currently client-only and add the server check.
- papic_guest_captures has no column recording which person captured it, so "each person's own
  folder" only works for camera captures, not guest uploads. Add the column + a trigger that
  derives it the same way captured_by_person_id does for papic_photos (a JOIN-derived trigger, not
  something app code has to remember to set).

Do NOT touch the supplier capture lane — it's explicitly gated on a DPO/owner ruling, not
engineering.

IMPORTANT: give any audit or sweep subagent a detached, read-only git worktree, never your own
live working tree — this exact repo lost a security fix once when an audit agent's edits landed
between a diff check and a git add.

When done: changelog fragment, migration applied and verified against prod by querying the
actual object (not schema_migrations, not a comment), plain-English summary of what changed for
someone shooting a wedding, and list of tests added/passing.
```

---

## Session 4 — Pricing: fix the data-loss bug, then build the redesign

**Contract:** `WHATS_NEXT_Managing_Prices_2026-08-26.md`
**Run after Session 0.** Do not start until #4883/#4884 is resolved — this session will touch
the same catalog rows.

```
FIRST: confirm Session 0 has resolved the duplicate Papic-ladder PR situation (only one of
#4883/#4884 should still be open or merged). If both are still open, stop and flag it — do not
proceed with pricing work while two PRs are racing to write the same catalog rows.

Read WHATS_NEXT_Managing_Prices_2026-08-26.md in the Setnayan spec corpus fully first, and open
the approved prototype at prototypes/admin_pricing_manager_2026-08-26.html — it is a clickable,
owner-facing design using real prod data and is BINDING. Port it; do not redesign it.

STEP 1 — fix the live bug first, before any redesign work, because it is actively losing data
right now: "Save all changes" on the admin price screen blanks the description of any row whose
info panel (ⓘ) was closed at save time, because the textarea isn't in the DOM and the save reads
the missing field as empty. Measured: 32 of the last 34 saved rows lost their note. Fix by
changing the save SHAPE — each row should be its own card that submits only its own fields when
you save that row, never a single "save everything" pass that can blank fields it never rendered.
Write a regression test that saves a row with its panel closed and asserts the description
survives.

STEP 2 — build the redesign per the prototype: two views. The front view ("the sell sheet") shows
only what's actually sellable today — the prototype's approved cut is 34 rows. The back room
holds everything retired (57 of 91 rows) and should visually communicate itself trending toward
empty as things get cleaned up, not read as an equally-important second list.

STEP 3 — the seven price fields flagged as needing engineering (not owner decisions) — read the
contract's list of which seven and why each one is broken, and fix them. One is described as a
LIVE, CHARGED ₱1,499 sign-up price with a real defect — treat that one first among the seven and
confirm in your own testing what's wrong with it before touching it.

STEP 4 — do NOT build a price-history table. It already exists in the audit log; wire the
existing history into the new screen instead of storing it twice.

STEP 5 — before touching the retirement list, verify removability by whether a row has DONE
anything (any read in the last N days, any non-null balance/reference from it), never only
whether something POINTS at it. The contract found 13 Papic-named rows that are pointed-at but
inert (all still titled the old "Papic Pool/One/Mini/Ltd/Max" names from the retired two-product
model) — those are safe to fully retire, not just hide.

Gitleaks note: if you write a SQL IN (...) list of SKU codes on one line, the secret scanner reads
it as leaked API keys. Split one code per line.

When done: changelog fragment, before/after screenshot or description of the sell-sheet vs
back-room split, and a plain-English list of what price data is now safe that wasn't before.
```

---

## Session 5 — Vendor Hub: security fixes ONLY — do not build the room

**Contract:** `WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md`
**Owner, explicit:** *"do not start building. we will do this on what's next. just plan for
now."* **Honor that.** This session is scoped to two live security holes the plan surfaced —
neither is "the room," both are bugs in code that already exists and ships today.

```
Read WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md fully first. The owner has explicitly said
NOT to build the vendor room itself — this session is scoped ONLY to the two live security
defects the planning work surfaced, both of which are bugs in code that already ships today and
have nothing to do with the unbuilt room.

FIX 1 — a host-access check selects a member_type column and never compares its value, so
Boolean(memberRow) returns true for ANYONE with a membership row — including a guest who merely
scanned the event QR code. That guest is then treated as a HOST and can walk into every private
sub-page, including reading the couple's unfinished keepsake story before it's published. Find
this check (the contract says it's a clone of a check that was already correctly fixed elsewhere
in this codebase — find that already-fixed twin and read its diff to see the correct shape, likely
named something like host-scope.ts) and apply the same fix: actually compare member_type against
the host role, don't just check row existence.

IMPORTANT — do this in the same commit, not a follow-up: the check you're narrowing was
accidentally covering for a missing case. A seat-holder viewing a PRIVATE event has no arm in the
shared gate today because the over-wide host check was masking that gap. If you narrow the host
check without adding the seat-holder arm, a seat-holder whose 60-day cookie expired will start
getting bounced from every sub-page. Add both in the same change: the narrowed host check, and the
missing private-event seat-holder branch.

FIX 2 — "the couple" is hardcoded into public-facing strings in at least four files, twelve
occurrences, nine of them on the join/door screen and two of them in the SIGNED-OUT arm that a
QR-scanning guest actually lands in. This is wrong for every non-wedding event type — the contract
gives the example of a funeral's gift page saying "help the family" in one line and "the couple's
account" three lines later. Find every hardcoded "couple" string on a public/signed-out page (the
contract says check four files) and replace it with the event's own terminology field (the same
terminology/register system used for the funeral event type — grep for how that's read elsewhere,
e.g. EventWords or similar) so it reads correctly per event type. The funeral-specific noun is
"family", never "host" — do not introduce "host" as a fallback for that type.

ALSO FIX the guard meant to catch exactly this class of bug: it currently matches files to exempt
by bare basename (e.g. 'page.tsx' alone), which accidentally exempts 11 files just because they
share a filename with something legitimately exempt — 28% of the relevant tree is exempt by
accident. Make the exemption list match by full relative path, not basename. Confirm this produces
zero new offenders when you run it (it should — the contract states it will).

Do NOT: build the vendor room itself, any of its nine pieces, the answers desk, or touch
lock-modal.tsx / the catalogue-picker flag logic. Do NOT resolve any of the nine owner decisions
listed in the contract's § 7 — flag them, don't decide them.

When done: changelog fragment, confirm both fixes are covered by a test that would have caught the
original bug, and a plain-English summary: what a guest or a funeral family sees differently now,
and confirm the room itself is still unbuilt as instructed.
```

---

## What I'm NOT scheduling a session for, and why

- **The vendor room itself (9 pieces)** — explicit owner pause. Wait for "what's next" after he's
  ready to unpause it.
- **The answers desk (16 kinds, 6 doors)** — the contract calls it "the cheap independent win"
  and says it can start now, but it's a genuinely new build (not a fix), so it's a candidate for
  a *future* session once 0–5 are clear, not bundled in here.
- **Whether suppliers buy off the Papic ladder** — named as the owner's call, not engineering's.
- **The Ugat subsystem rename** — named as the owner's call.
- **PR #4886** (audit findings from the admin work, still open) — its findings need the same
  refutation pass described in the contract before anyone acts on them; folding it into Session 1
  or 2 without that pass risks acting on an unverified claim. Recommend a follow-up session once
  the skeptic pass on #4886 finishes.
