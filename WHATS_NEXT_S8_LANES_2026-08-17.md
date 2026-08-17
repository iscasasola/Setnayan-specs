# S8 · the remaining 31 admin tables, split into lanes — 17 August 2026 (evening)

> ## The answer: SPLIT IT, two at a time. But not for the reason you'd guess.
>
> One session **could** do all 31. The reason to split is not that it's impossible — it's that
> it's **~11,600 lines across 30 files, and each file needs its own RULE 0 read** before a single
> line changes. That reading is the work; it does not compress. Four fresh sessions read four
> lanes properly. One long session reads the fourth lane badly.
>
> 🔢 **THE COUNT IS 31, NOT 33.** Measured on `origin/main` = `f880f375f`, comments stripped, the
> archetype itself excluded. `WHATS_NEXT_SESSION_PROMPTS_2026-08-17.md` says 33 in its S8 row —
> that row is wrong and is corrected in the same commit as this file. **Re-measure before trusting
> either number; both are documents.**
>
> ⛔ **ONE OF THE 31 IS NOT OWED.** `ugat/_components/ugat-console.tsx` (1,707 lines) ships its own
> stylesheet — `ugat-console.css`, where `.ug-etable` is genuinely defined — and is a purpose-built
> graph console, not a records list. **Leave its line in the bill. Do not convert it.** So the real
> work is **30 files**.

## Why these four lanes can run two-at-a-time without colliding

Every conversion edits **one** shared file — `apps/web/app/admin/_components/admin-console-is-one-table.test.ts` — deleting its own lines from `RAW_TABLE_BILL` and adding them to `CONVERTED`.

🔑 **Both arrays are sorted BY PATH, which is exactly why lane boundaries follow directories.** Two
lanes working in different directories produce hunks far apart in both arrays, and git merges them
without a word. Two lanes working in the *same* directory would delete adjacent lines and conflict
on every push. **Do not re-cut these lanes by size or by "what looks quick" — the directory is the
whole reason the partition is safe.**

🛑 **NEVER MORE THAN TWO AT ONCE** (ten parallel builds once shipped 44 defects).
🛑 **NEVER AUTO-MERGE WHILE A SECOND LANE IS IN FLIGHT** — read both diffs first. Auto-merge is the
standing default for a lone PR, never for a fan-out.

| lane | files | lines | render "nothing here" over a REFUSED read |
|---|---|---|---|
| **L1** · the queues that lie | 4 | 1,557 | **4 of 4** ← being done in the session that built the archetype |
| **A** · account surfaces | 5 | 2,587 | 4 of 5 |
| **B** · insights surfaces | 6 | 2,077 | 2 of 6 |
| **C** · studio surfaces | 5 | 1,829 | 1 of 5 |
| **D** · the last ten pages | 10 | 3,797 | 0 of 10 |

**Waves: A + B together, then C + D together.** (L1 is already running; A or B may start beside it —
neither shares a file with it.)

---

## THE SHARED HEADER — paste this on top of every lane block below

```
You are converting admin screens onto a table component THAT ALREADY EXISTS. Read
apps/web/app/admin/_components/console-table.tsx first, in full, including its docblock. It is
~290 lines and the docblock is the specification.

⛔ DO NOT REBUILD THE ARCHETYPE. Do not "improve" its API. Do not add an actions prop. It shipped
2026-08-17 in PR #4506, is verified live in production, and is pinned by 10 mutation-checked
assertions in app/admin/_components/admin-console-is-one-table.test.ts.

⛔ DO NOT rebuild PageMasthead or KpiStatCard either. Both already exist and are the header and
the stat tile. The admin tree has 96 hand-rolled <header> blocks against 1 PageMasthead, and 22
local Stat/StatTile/Metric re-declarations against KpiStatCard — replacing those as you pass
through is IN scope; writing new ones is not.

WHAT YOU ARE ACTUALLY FIXING, and it is not looks. Supabase RESOLVES with { error } instead of
throwing, so a REFUSED read (phantom column, stale enum value, unapplied migration, missing
grant) arrives as data: null. `(data ?? [])` turns that into an empty array and the page prints a
calm sentence saying there is nothing here. On origin/main today, 11 of the remaining files do
exactly this. Each lane below says which of ITS files do.

THE CONVERSION, per file:
  1. Read the whole page before touching it. Some pages hold TWO or THREE tables (noted per file).
  2. At the read site: stop coercing. `const rows = data as Row[] | null` — NULL must survive to
     the render as NOT MEASURED. Keep any logQueryError call; logging never changed the render.
     If other code in the page maps over the rows, give it `const listed = rows ?? []` and leave
     `rows` nullable.
  3. Pass `readError={error}` and `reads="the thing in plain words"` to ConsoleTable.
  4. `readPermitted` — pass the literal `true` ONLY if BOTH halves hold: the read goes through
     createAdminClient() (service role, which RLS cannot silently filter) AND the page is behind
     requireAdmin(). If a read uses the RLS client, pass the permission value you actually hold.
     An RLS denial and an empty read are the same count: 0.
  5. If the query has a .limit(N), hoist N to a named const and pass the SAME const as `cap`.
     Two hand-typed copies of a number is not a guard. 15 of 21 capped admin reads never
     disclosed their cap.
  6. Columns: mark everything but the identifying ones with hideBelow: 'md' | 'lg'. Admin is used
     on a phone — there is an admin bottom nav and a mobile landing grid — and 20 of the original
     34 tables set no min-width, so they crush instead of scrolling.
  7. Stat tiles: pass `null` when the read was refused, never 0. KpiStatCard renders an em-dash.
     A ₱0 or a "0 pending" over a broken read is the same lie in a smaller box.
  8. Delete the file's line from RAW_TABLE_BILL and add it to CONVERTED, in the guard. A file with
     several tables keeps its bill line until EVERY table in it is converted — the bill is per
     file, not per table.

🎨 TWO GOLDS, TWO RULES, and it has bitten three times. The Tailwind slot named `terracotta` holds
the atelier GOLD #A9834B — 3.37:1 on cream, NON-TEXT ONLY. The CTA terracotta #C24E25 lives in the
slot named `mulberry` (4.61:1). Inherited and BACKWARDS, so `text-terracotta` LOOKS safe and is the
unsafe one. Use text-mulberry, or text-link (8.22:1) for an inline link. Gold on an ICON is fine.
CHECK BOTH THEMES on any tinted block — mulberry-700 measures 5.86:1 light and 3.05:1 DARK.

⛔ DO NOT "RESTORE" text-ink/55 ON A TABLE HEADER. It measures 3.24:1 on its own bg-ink/[0.03]
fill in the light theme — an AA failure at 11px, where no large-text exception applies. The
archetype uses text-ink/70 (5.02 light / 8.32 dark). Consistency with a measured failure is not a
reason. The guard fails if you change it.

🔒 JUDGEMENT QUEUES GET NO BUTTON AT ALL — disputes, fraud, user reports, erasure requests,
integrity watch, concierge abuse, force majeure. Each shows a SENTENCE where the buttons would be,
via ConsoleTable's `note`. A fast button invites a wrong call at speed on exactly the queues where
being wrong costs most. DO NOT "improve" this by adding actions. And where a queue DOES settle on
one click, the shape is decided by what the server action refuses to run without — read the action
first; reviews throw without an override reason, payouts need the method AND the reference of a
hand-made transfer — never by taste.

⚠ admin's SHELL renders no <main> (app/admin/layout.tsx has none; 4 admin pages open their own).
ConsoleTable is a fragment inside a page, not a page frame. Do not copy another tree's shell
placement in.

MECHANICS, all of which have cost real time in this repo:
  • Branch FIRST, then `git worktree add`. Never work in the shared main checkout — it has been
    switched to main under a running session three times.
  • `pnpm install --frozen-lockfile` in the new worktree; typecheck needs
    NODE_OPTIONS=--max-old-space-size=7168 or it dies with a heap OOM that looks like a crash.
  • Run each CI lint from the working directory ci.yml gives it. Several fail with
    MODULE_NOT_FOUND from the wrong cwd and that is not a real failure.
  • COMMIT BEFORE YOU MUTATION-TEST, and restore from an explicit backup copy — never
    `git checkout --`. A post-sabotage checkout silently reverted six uncommitted files in this
    repo on 2026-08-17 while the guard still passed, because the guard and the reverted files
    agreed.
  • PRINT THE OCCURRENCE COUNT before → after for every sabotage. An unmeasured mutation proves
    nothing, and a sabotage that did not land reads exactly like a pass.
  • If you touch a page's controls, `pnpm --filter @setnayan/web port:baseline` — but ONLY after
    rebasing onto current origin/main. Generated from a stale tip it silently drops whatever routes
    landed meanwhile; that happened on PR #4506 and was caught only by regenerating twice. Then
    check absorption PER ROUTE, not by totals: destinations lost, actions lost, routes gone.
  • Add a changelog.d/ fragment. Do NOT edit CHANGELOG.md or STATUS.md.
  • `gh pr merge <PR#> --auto --merge` — UNLESS a second lane is in flight, in which case both
    diffs get read first.
  • After merge, confirm it landed: `git merge-base --is-ancestor <sha> origin/main`, and check
    https://www.setnayan.com/api/health reports the merge commit. "Auto-merge armed" is not
    "merged".

⚠ NOTHING IN THIS LANE IS OBSERVABLE FROM A SESSION. Admin sits behind a login, so your work is
test-proved and measured, never seen. Say so plainly; do not upgrade it to "verified live".

Reply to the owner in plain English — what a PERSON experiences. No file paths, function names,
table names, SQL or flag names in the reply to him. They belong in the PR body.
```

---

# LANE A · The account surfaces
**5 files · 2,587 lines · 4 of the 5 lie about a refused read · pairs with B**

```
Convert the five account surfaces under app/admin/accounts/_surfaces/ onto <ConsoleTable>.
Measured on origin/main = f880f375f.

  users-surface.tsx          958 lines   TWO tables   caps at 200   LIES on a refused read
  vendors-surface.tsx        572 lines                caps at 200   LIES
  demo-vendors-surface.tsx   431 lines                caps at 2000  LIES
  events-surface.tsx         328 lines                caps at 200   LIES
  venues-surface.tsx         298 lines                caps at 500

⚠ users-surface.tsx HOLDS TWO TABLES. Its bill line does not come out until BOTH are converted.
It is also the largest file in the lane at 958 lines — read all of it before editing, and expect
the second table to be a different shape from the first.

🔢 THE CAP AT 2000 IS THE ONE TO NOTICE. A demo-vendor list that silently stops at 2,000 rows
reads as the complete list. Hoist it to a const and pass it as `cap`.

🔒 THESE FIVE SURFACES SHOW REAL PEOPLE'S ACCOUNTS. Convert what is rendered; do not widen a
select to add a column the page did not already show. If a column looks like it is missing, that
is a product question, not a port.

⚠ FOUR OF FIVE ARE THE DEFECT. On a refused read each currently prints an empty account list —
which on an accounts screen reads as "this platform has no users". Prod has 9 accounts, 6 events
and 2 shops, so an empty list is ALSO the honest answer some of the time; that is exactly why the
refusal and the emptiness must stop looking identical.
```

---

# LANE B · The insights surfaces
**6 files · 2,077 lines · 2 of the 6 lie · pairs with A**

```
Convert the six surfaces under app/admin/app-performance/ onto <ConsoleTable>.
Measured on origin/main = f880f375f.

  intelligence-surface.tsx    559 lines   TWO tables   no cap
  funnels-surface.tsx         423 lines                caps at 500   LIES on a refused read
  _components/expenses.tsx    396 lines                no cap        (has aria-label="Expense ledger" — keep it as ConsoleTable's `label`)
  operations-surface.tsx      319 lines                no cap
  seo-surface.tsx             233 lines                caps at 1     LIES
  browser-blocks-surface.tsx  147 lines                no cap        ALREADY CORRECT — see below

⛔ browser-blocks-surface.tsx IS THE EXEMPLAR, NOT A DEFECT. Its own comment reads "A FAILED READ
IS NOT AN EMPTY LIST" and it returns on the error before it can render. It is the surface the
archetype was modelled on. Converting it is worth doing for consistency, but you must NOT lose
any of its prose: its empty state explains that an empty list is the GOOD outcome for a
watch-only policy, and it discloses its own 200-row cap. Move those sentences into `empty.blurb`
and `cap`; do not paraphrase them shorter. If the conversion would lose a sentence, leave the file
and say so.

⚠ seo-surface.tsx "caps at 1" is a .limit(1) — a single-row read, not a list cap. Do NOT pass
cap=1; that would print "showing the first 1, there are more" on every load. Read what the query
is for before wiring anything.

⚠ intelligence-surface.tsx HOLDS TWO TABLES. Its bill line stays until both are done.

📊 THESE ARE MEASUREMENT SCREENS, WHICH MAKES THE null-VS-ZERO RULE THE WHOLE POINT HERE. A
metrics page that prints 0 over a refused read is not slightly wrong — it is a graph that says the
business stopped. Pass null to every KpiStatCard whose source read failed. Note that seo_metrics
holds ZERO rows in production because the Search Console pull is blocked on a suspended Google
Cloud account (appeal 73857927) — so on that surface, empty is the honest state and must read as
such, not as breakage.
```

---

# LANE C · The studio surfaces
**5 files · 1,829 lines · 1 of the 5 lies · pairs with D**

```
Convert the five surfaces under app/admin/studio/_surfaces/ onto <ConsoleTable>.
Measured on origin/main = f880f375f.

  discount-codes-surface.tsx  671 lines                no cap    has its OWN local Stat AND StatusPill
  storytellers-surface.tsx    436 lines   TWO tables    no cap
  real-stories-surface.tsx    287 lines                no cap
  referrals-surface.tsx       232 lines                caps at 500   LIES on a refused read
  patiktok-surface.tsx        203 lines                caps at 60    has its own StatusPill

🔑 THIS LANE IS WHERE THE 22 LOCAL STAT RE-DECLARATIONS CLUSTER. discount-codes-surface.tsx
declares BOTH a local `Stat` and a local `StatusPill`; patiktok-surface.tsx declares another
`StatusPill`. Replace each local Stat with KpiStatCard — it already renders null as an em-dash,
which is the behaviour the local ones lack.
⚖ The StatusPills are a JUDGEMENT CALL, not a mandate: a status pill is a per-surface vocabulary
(a discount code's states are not a Patiktok job's states), so two of them is not automatically
duplication. If they turn out to render the same states from the same values, share one. If they
do not, leave them and SAY you left them and why. Do not force a shared pill that has to take a
`variant` for every caller — that is the 22-Stat problem wearing a different hat.

⚠ storytellers-surface.tsx HOLDS TWO TABLES. Its bill line stays until both are done.

⚠ real-stories-surface.tsx TOUCHES PUBLISHED EDITORIAL. Prod has 0 published Real Stories, so its
empty state is the launch-day state and will be seen. Make the empty blurb teach how the shelf
fills, not apologise.
```

---

# LANE D · The last ten pages
**10 files · 3,797 lines · none of them lies · pairs with C**

```
Convert the remaining ten top-level admin pages onto <ConsoleTable>. None of these has the
refused-read defect — this lane is the long tail. Measured on origin/main = f880f375f.

  disputes/page.tsx                        832 lines   caps at 200   local StatsBanner + StatCell
  settings/payment-methods/page.tsx        612 lines   no cap        ALREADY returns on error — do not lose that
  vendor-partnerships/page.tsx             473 lines   caps at 25    ⚠ see the cap note below
  completions/page.tsx                     316 lines   caps at 500
  compliance/data-sheet/page.tsx           304 lines   THREE tables  no cap
  papic-storage/page.tsx                   304 lines   TWO tables    no cap
  account-deletions/page.tsx               294 lines   caps at 200
  offline/_components/offline-diagnostic.tsx 255 lines no cap        ⚠ see the phantom class below
  website-media/media-table.tsx            239 lines   no cap
  demo-vendors/inquiries/page.tsx          168 lines   caps at 300

🪤 offline-diagnostic.tsx RENDERS className="m-table" AND THERE IS NO `.m-table` ANYWHERE IN THE
REPO. `.m-card` exists, so the name reads plausible and styles nothing — the same silent-absence
failure as a phantom column or a blocked iframe. Converting the file removes it. Do not port the
class name across; do not add a `.m-table` rule to globals.css to "fix" it.

🔢 vendor-partnerships CAPS AT 25 AND THAT MAY BE A PAGE SIZE, NOT A CEILING. Read whether
anything pages past it before wiring `cap` — disclosing "there are more" on a paginated list that
already has a next control is a second, contradictory promise.

⚠ compliance/data-sheet/page.tsx HOLDS THREE TABLES and papic-storage TWO. Their bill lines stay
until every table in each is converted. The compliance sheet is the surface a regulator's
questions land on, so its three tables are the ones where a silent cap would matter most — check
each read for a limit even though the scan reported none.

⛔ settings/payment-methods/page.tsx IS ONE OF ONLY TWO ADMIN SURFACES THAT ALREADY HANDLES A
REFUSED READ CORRECTLY. It returns on the error before it can render a list. Converting it must
not replace that with something weaker — pass `readError` so ConsoleTable reports it, and delete
the hand-rolled branch only once the archetype demonstrably covers the same case.

🔒 disputes/page.tsx IS A JUDGEMENT QUEUE: NO BUTTONS. It has a local StatsBanner and StatCell —
replace with KpiStatCard where they are plain label+number, and say plainly if one of them carries
something a KPI tile cannot.
```

---

## What is NOT in these lanes, and why

- **`ugat/_components/ugat-console.tsx`** — own stylesheet, own design system, a graph console
  rather than a records list. On the bill so the shape stays visible; **not owed.**
- **The 236 `text-terracotta` occurrences across 89 admin files.** A shop-wide colour sweep is its
  own bounded job with its own guard. Each lane fixes only what it touches, so the number can only
  fall. **Do not turn a lane into the sweep.**
- **`/admin/work` · `/admin/more` · `/admin/website-media`'s page · `/admin/booking-fees` ·
  `/admin/corrections`** — all already ship and a previous session nearly rebuilt them. `/admin/work`
  IS the ranked work list with a triage strip, lane chips, and drawers that settle payments, verify
  and approvals in ONE CLICK and reviews and payouts on a form.
- **`SidebarShell`** — RETIRED 2026-08-15. Do not reintroduce it.

## When all four lanes land

`RAW_TABLE_BILL` holds exactly one line: the ugat console. At that point the guard stops being a
ratchet and becomes a wall, and the `CONVERTED` list is the whole admin console. **Whoever lands
the last lane should say so in their PR** — and should NOT delete the guard, because its job then
becomes refusing the 32nd hand-rolled table forever.
