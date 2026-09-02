<!-- Ready-to-paste session prompt for item 7d. Paste verbatim, under the shared header from
WHATS_NEXT_Papic_Items_4_5_PROMPTS_2026-09-01.md. -->

# Item 7d — budgets across the year (2026-09-02)

> ⚠ **THE MOST DANGEROUS PHASE OF ITEM 7.** It is the one with a plausible reason to pool money
> across celebrations, and the owner has ruled that the POT must never pool. Read the distinction
> below before writing anything — getting it wrong is silent.

```
Let a cluster show the budgets of its celebrations. Item 7d of
WHATS_NEXT_Papic_Build_Order_2026-08-29.md § 7, corpus at ~/Documents/Claude/Projects/Setnayan.

🛑 THE BUDGET SUBSYSTEM ALREADY SHIPS. You are not building budgets.

  public.budget_builds               — saved A/B/C plan snapshots (Lean/Fits/Stretch), event-scoped
  public.budget_allocation_config    public.budget_allocation_decisions
  public.budget_band_config          public.budget_category_flags
  public.budget_leaf_benchmarks
  apps/web/app/dashboard/[eventId]/budget/…   — the per-event page, allocation planner, live summary
  apps/web/app/admin/budget-planner/…         — the admin side
  apps/web/app/api/budget/[eventId]/ics/route.ts

`budget_builds.event_id UUID NOT NULL REFERENCES events(event_id)` — budgets are ALREADY per-event.
7d is a cluster-level READ over them. It is a rollup, not a schema.

🔑 THE DISTINCTION THIS WHOLE PHASE TURNS ON — TWO DIFFERENT MONIES:

  BUDGET  = pesos the couple plans to spend with vendors (Lean/Fits/Stretch baskets).
  THE POT = Papic capture CREDITS, bought per celebration.

**Rolling BUDGETS across a cluster is ALLOWED and is what this item is.**
**Rolling THE POT across a cluster is FORBIDDEN — owner ruling 2026-09-02.**

Verified 2026-09-02: NO budget table references `points` or `papic`. They are genuinely separate.
Re-check before you trust it: `grep -il "points\|papic" supabase/migrations/*budget*`

🔒 THE GUARDS YOU MUST LEAVE GREEN (from 7a, PR #5082):
`apps/web/tests/db/a-pot-belongs-to-one-celebration.db.test.ts`
  · no Papic table references or names a cluster
  · no Papic function has learned the word event_cluster
  · the cluster tables hold no value of any kind
Run that file BEFORE you push. They are mutation-proved and have already caught a real intrusion. If
your work makes them red, your work is wrong — not the guard. ⚠ "The cluster tables hold no value"
means your rollup is COMPUTED ON READ; do not store a cluster total anywhere.

📐 THE PATTERN TO COPY IS ONE PHASE OLD. 7c (PR #5090) established it in `apps/web/lib/clusters.ts`:
  "THE SPAN IS DERIVED HERE AND STORED NOWHERE … a stored span goes stale the first time a date
   moves." — `clusterSpan()` computes on every read.
A budget total goes stale the same way, and worse: a stale MONEY number is read as fact. Derive it.

⚠ MEASURED IN PRODUCTION 2026-09-02, and it decides your testing:
  budget_builds .................... 0 rows
  budget_allocation_decisions ...... 0 rows
  event_clusters ................... 0
  event_cluster_members ............ 0
  events ........................... 5
Nothing real exists yet. Build fixtures; do not "verify" against production emptiness and call it a
pass. AND — this is the disease this repo has paid for repeatedly — **an empty or REFUSED read must
never render as ₱0.** A budget tile reading "₱0 committed" against a real target is indistinguishable
from a couple who has committed nothing. Unknown must say UNKNOWN. Copy the honest-read pattern:
`apps/web/lib/guests.ts` + `guests-read-is-honest.test.ts`, and `live-wall.ts`'s
`measured: false` vs `measured: true, value: null`.

🪤 `BUDGET_BUILD_ENABLED` GATES THE BUILD FEATURE. It is an ENV VAR, not a row in
`platform_settings` — I checked, it is not there. **I could NOT read its production value from a
session, and neither can you: server-side env is not readable.** Do not assume it is on, and do not
assume it is off — a flag's default in code is not its value in production (CLAUDE.md). Open the page
or ask the owner. If it is OFF, say plainly in the PR that this ships dark.

BUILD:

1. A cluster's budget view: each celebration's budget, and a derived total across the cluster.
2. Derived on read, stored nowhere. No cluster-level money column, anywhere.
3. Honest emptiness: no budget yet ⇒ says so; a refused read ⇒ says UNKNOWN, never ₱0.
4. Guards: the three pot guards still pass; a cluster total equals the sum of its celebrations and
   changes when a member is added or removed; and NO Papic credit is aggregated anywhere.
5. RLS: `a-year-holds-only-your-own-celebrations.db.test.ts` must still pass — a budget rollup must
   never become a way to read money for a celebration you do not own.

DO NOT touch the Papic pot, ceilings, shares or credits. If the work seems to require it, stop and
ask the owner — that is the ruling, not a preference.
```

## Model and effort

**Opus 5 · xhigh.** This phase fails silently and expensively: a rollup that quietly aggregates
credits, or a stale stored total, or a refused read rendering as ₱0 — none of which goes red on its
own. Same tier as 6b and 7a, and for the same reason.
