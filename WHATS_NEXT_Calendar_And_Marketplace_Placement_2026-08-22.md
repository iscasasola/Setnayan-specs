# WHATS_NEXT — ADD TO CALENDAR MOVED ONTO THE CARD, AND THE MARKETPLACE MOVED INSIDE THE EVENT

**Written 2026-08-22 (session continued into 08-23) so the next session does not
re-derive any of it, and above all does not "restore" something the owner deliberately
removed.**

Everything below is measured against `origin/main` and the **live production database**,
not against a document. ⚠ **A HANDOFF IS NOT EVIDENCE — including this one.** Re-run the
commands before acting.

**Model note:** the owner asked at the top of the session which model to run. The answer
given, and it held: **Sonnet for the two placement fixes; Opus for the teardown**, because
that one touched a dropped table, a security exposure baseline and the RA 10173
compliance registries. The split is recorded because he asked for it explicitly and will
likely ask again.

---

## § 0 · HOW THIS STREAM STARTED

The owner selected three things on his own signed-in board and said, in order:

> *"adding an event to a calendar is not all events but just per event. so we want add to
> calendar to be on each card."*

> *"marketplace is best shown inside an event, not when they just logged in."*

> *"cookie policy should be easier to be set and not everytime they log in. maybe cache
> their decision or something"*

Then, after the per-card button shipped:

> *"shouldn't now happening and planning be the only ones to have this add to calendar?"*

And finally, selecting the all-events subscribe block:

> *"block delete."*

---

## § 1 · ✅ SHIPPED — DO NOT REBUILD

### 1a · Per-event "Add to calendar" on each board card — PR [#4717](https://github.com/iscasasola/setnayan-platform/pull/4717), MERGED 2026-08-21T20:24Z (`b79cf736b`)

Every My Events card's `⋯` menu now carries **Add to calendar** — a one-shot `.ics` for
that ONE celebration.

🔑 **RULE 0 PAID: NOTHING WAS DRAWN.** The builder already existed —
`buildWeddingIcs` + `icsDataHref` in `lib/calendar-links.ts`, shipped for the
Save-the-Date flow. The delta was a menu row and four props.

### 1b · Only on Now happening + Planning — PR [#4718](https://github.com/iscasasola/setnayan-platform/pull/4718), MERGED 2026-08-22T00:23Z (`034478000`)

1a rendered the row on **every** shelf, including the two past-event ones (Untold, Told).
The owner caught it in one sentence. A `finished` prop — mirroring the `finished` already
passed to the card underneath on exactly those two shelves — drops the row entirely.

### 1c · The Marketplace shows only inside an event — same PR as 1a

The rail's **Marketplace** destination row and its **Browse by category** group no longer
render on the front door or the My Events board. They render only while standing inside a
specific event.

🔴 **THIS REVERSES THE 2026-08-12 RULE. Do not "restore consistency" by undoing it.**
The old rule was the exact opposite — Marketplace was *front-page furniture* that
collapsed away the moment a `railContext` pushed in. Both rules are written into
`front-door-shell.tsx`'s own docblock, the new one naming the old.

🔑 **THE GATE IS `insideEvent`, DELIBERATELY NARROWER THAN `railContext`.** Only the event
tree passes `studioEventId`. The **admin console and the vendor dashboard also push a
`railContext`**, and neither is a place to show a couple's supplier marketplace — a bare
`railContext ?` gate would have leaked it into both.

🪤 **A TEST WINDOW THAT READ THE WRONG GATE.** `studio-follows-you-in.test.ts` looked
back **700 characters** from the `Browse by category` heading — far enough to swallow the
**unrelated** `railContext ? (<div>{railContext}</div>) : null` wrapper of section 2b
sitting directly above. So the "no longer reads railContext" assertion passed on a match
belonging to a different element. Narrowed to 260. **When a guard scans backwards from an
anchor, print the window and read it — a nearby sibling satisfies a substring test as
happily as the thing you meant.**

### 1d · The all-events calendar subscription is RETIRED — PR [#4721](https://github.com/iscasasola/setnayan-platform/pull/4721) · migration `20271157440480`

⚠ **STATE AT WRITING: OPEN, auto-merge armed, `mergeState: BLOCKED` (waiting on CI).**
**Verify with `gh pr view 4721 --json state,mergedAt` before trusting this line** — this
corpus has been wrong about a PR's state three separate times.

Deleted: the subscribe block on My Events, the unauthenticated `webcal:` feed route
(`app/api/calendar/[token]/route.ts`), the token mint/reset server actions, the feed
builder (`lib/calendar-feed.ts`), and the **`calendar_feed_tokens` table**.

🔴 **THIS IS A REAL REDUCTION IN BEHAVIOUR, OFFERED AND ACCEPTED — NOT AN OVERSIGHT.**
The feed handed out ONE link the person's phone **re-read on its own schedule**, so
moving a date moved it in their calendar too. The per-card `.ics` that replaces it is a
**copy taken once**: change the date afterwards and the copy in somebody's phone is
silently wrong, with nothing to tell them. That trade was put to the owner in plain terms
*before* deleting and he chose deletion. **Do not file this as a regression, and do not
quietly make the per-card button "re-fetch" — there is nothing left to re-fetch from.**

🔢 **SAFE BY ARITHMETIC, MEASURED IN PROD FIRST.** `calendar_feed_tokens` held **exactly
one row** — the owner's own, minted merely by rendering his board — and its
**`last_read_at` was NULL**, so **no calendar has ever once fetched this feed**. Nothing
live broke. Dependencies were also measured, not assumed: **zero** inbound FKs, functions,
views or triggers; only its own three RLS policies, which drop with it. `DROP TABLE` is
written **without `CASCADE`** on purpose.

---

## § 2 · 🔑 THE COMPLIANCE HALF — THE PART WORTH READING TWICE

Dropping that table forced a decision in **three** places, and **they are not the same
decision**. This generalises to every future table retirement in this repo.

**The root fact:** the repo's schema parsers (`lib/security/migration-schema.ts`) **union
every `CREATE TABLE` ever written and never read `DROP TABLE`**, and the original
migration is **left on disk** (deleting an applied migration makes `supabase db push`
refuse and **stops every deploy** — see the dead-deploy post-mortem). So a dropped table
stays **VISIBLE to the guardrails forever**.

| File | Action taken | Why it differs |
|---|---|---|
| `lib/erasure/coverage.ts` (`OWN_ROW_DELETES`) | **entry REMOVED** | **This list is EXECUTABLE.** `erasure/purge.ts` issues a real `.delete().eq(col, userId)` per entry. Against a dropped table PostgREST **errors**, and `step()` does **not throw** — it calls `auditFail`. Left in place it would have stamped a permanent, meaningless **failure onto every RA 10173 erasure request forever**, while looking to a reader like extra diligence. |
| `lib/erasure/coverage-guardrail.test.ts` | **entry ADDED** to `DELIBERATE_EXCLUSIONS` | Removing the purge rule makes **G3** report the table unclassified. Matches the existing `homepage_hero_config` precedent. |
| `lib/export-coverage-guardrail.test.ts` | **entry KEPT but REWRITTEN** | **T1** still sees the table, so deleting the line fails. But its old reason ended by promising *"the subject can see and reset the link on My Events at any time, which is the surface that right belongs on"* — **a control that no longer exists.** Left alone it would have become a compliance document asserting a capability the product does not have. |

🔑 **DOCUMENTATION LISTS KEEP A RETIREMENT NOTE; THE EXECUTABLE LIST DROPS THE ROW.**
Same table, three files, two opposite actions, all three correct. Before touching a
compliance list, ask which kind it is — **does anything RUN it?**

🛡 **BOTH "THE ENTRY MUST STAY" CLAIMS WERE MUTATION-TESTED, NOT ASSUMED.** Deleting the
export entry turns **T1 red** (`Unclassified user-identifying table(s):
calendar_feed_tokens`); deleting the erasure entry turns **G3 red** naming the same table.
Occurrence counts printed 1 → 0 both times, then restored and re-verified green. Two
structural decisions rested on those claims, which is exactly when a claim has to be
measured.

📊 **BASELINES REGENERATED, NEVER HAND-EDITED** — `pnpm exposure:baseline`,
`pnpm port:baseline`, `UPDATE_FK_BEHAVIOUR=1 … user-fk-behaviour.db.test.ts`. The
**exposure diff is removal-only: ZERO added lines**, i.e. nothing became newly reachable.
The port baseline absorbed **one unrelated ADDITION** (a new papic-challenges route that
had landed since its ref) and lost **no** control beyond the three deleted here — checked,
because a wholesale regeneration is exactly where an unrelated removal hides.

---

## § 3 · 🪤 TRAPS FROM THIS SESSION

1. 🚨 **MY OWN TWO PRs COLLIDED, AND THE CONFLICT WAS IN A GENERATED FILE.** #4718 merged
   *after* #4721 was branched, touching the same two files. GitHub reported #4721 as
   `DIRTY`. The two **source** files auto-merged cleanly; only
   `port-control-baseline.json` conflicted. **Fix a generated file by REGENERATING it, not
   by hand-merging** — then verify the regenerated diff.
2. 🔑 **A CLEAN AUTO-MERGE IS WHERE A SILENT REVERT HIDES — the files git did NOT flag are
   the dangerous ones.** After resolving, both auto-merged files were checked *by
   occurrence count* to confirm #4718's `finished` prop survived (4 hits, all three
   declaration sites) **and** that the calendar deletions were still absent. Neither file
   was flagged by git; neither was assumed.
3. 🪤 **A FRESH `git worktree` HAS NO `node_modules`.** `npx tsc` in one prints *"This is
   not the tsc command you are looking for"* and `--test` dies with
   `Cannot find module 'lucide-react'` — **both read as a broken change, not a missing
   install.** Run `pnpm install --frozen-lockfile` first.
4. 🪤 **A HALF-WRITTEN TERNARY TYPECHECKS AS A SYNTAX ERROR 300 LINES AWAY.** Converting
   `{cond ? (<X/>) : null}` into a nested ternary and forgetting the inner `: null`
   reported `TS1005: ':' expected` at the line of the **next** JSX block. The error
   location was not the defect's location.
5. ⚠ **`~/Setnayan-iOS` IS THE CODE REPO ON THIS MACHINE, and its checkout was ~2,500
   commits stale** (on `7032173fc` while `origin/main` was `1f5a60b83`). Everything here
   was done in `git worktree add --detach /tmp/wt-* origin/main`. **Never read code from
   the stale checkout.**
6. 🗑 **PRUNE WORKTREES AS YOU GO** — done for all four created here. ⚠ **16 OTHER
   worktrees from earlier sessions are still on this machine** (~1–2 GB each). Deliberately
   NOT deleted: several sit on named branches and may be another session's live work. The
   owner was told; at zero free bytes even `rm` fails.

---

## § 4 · ⏭ OPEN — WHAT IS ACTUALLY LEFT

### 4a · 🔴 THE COOKIE BANNER — the owner's third ask, NOT ACTIONED, and the diagnosis is not yet settled

> *"cookie policy should be easier to be set and not everytime they log in. maybe cache
> their decision or something"*

**What was measured:** `lib/cookie-consent.ts` already persists the choice in
`localStorage` under `setnayan-cookie-consent-v1` **with no expiry**, and
`cookie-consent-banner.tsx` returns `null` whenever `readConsent()` is non-null. **So in
the same normal browser it should already never re-ask.**

⏭ **THE QUESTION PUT TO THE OWNER, STILL UNANSWERED:** does it re-ask in the **same
ordinary browser window** after answering once — or is he seeing it across incognito
windows / different browsers / different devices, where a per-browser store correctly
cannot follow him?

**Do not build before that answer.** The two readings lead to completely different work:

- **Same browser re-asks** ⇒ a real bug. Suspects worth checking in order: storage
  cleared by something else, the private-mode `catch` in `writeConsent` swallowing the
  write, or a mismatch between the write and the read.
- **Different browser/device** ⇒ working as designed, and "remember it for my account"
  means **moving consent server-side per user**. That is **not** a small change: consent
  must be recorded before a session exists for a signed-out visitor, it is RA 10173
  proof-of-consent, and the DPO is the owner. Treat as an owner/DPO call, not a tidy-up.

### 4b · ⚖ The trade in 1d is permanent unless someone rebuilds a feed

Nothing to do — **listed so it is not "discovered" later as a defect.** If the owner ever
says dates are not following people's phones, that is this decision, not a bug.

---

## § 5 · HOW TO VERIFY ANY OF THIS

```bash
gh pr view 4717 -R iscasasola/setnayan-platform --json state,mergedAt
gh pr view 4718 -R iscasasola/setnayan-platform --json state,mergedAt
gh pr view 4721 -R iscasasola/setnayan-platform --json state,mergedAt
```

⚠ **AND AFTER #4721 MERGES, IT DROPS A TABLE — verify BY THE OBJECT, never by
`schema_migrations`:**

```sql
select to_regclass('public.calendar_feed_tokens') is null as table_is_gone;
```

🔒 **And the standing rule after any merge somebody expects to SEE:**

```bash
curl -s https://www.setnayan.com/api/health
```

**The merge is not the ship.**
