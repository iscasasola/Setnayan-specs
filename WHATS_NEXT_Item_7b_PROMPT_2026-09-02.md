<!-- Ready-to-paste session prompt for item 7b. Paste verbatim, under the shared header from
WHATS_NEXT_Papic_Items_4_5_PROMPTS_2026-09-01.md. -->

# Item 7b — the shared guest list (2026-09-02)

> ✅ **UNBLOCKED — 7a merged as PR #5082** (`451dd7d3a`). Written against what 7a actually shipped.
> ⚠ 7a's migration had not reached production at the time of writing — build against the migration,
> and re-measure production yourself.

```
Make a person invited to three occasions ONE person, not three rows. Item 7b of
WHATS_NEXT_Papic_Build_Order_2026-08-29.md § 7, in the corpus at ~/Documents/Claude/Projects/Setnayan.

🛑 READ THIS BEFORE YOU DESIGN ANYTHING — THE IDENTITY MODEL ALREADY EXISTS.

There is a PERSON SPINE in this repo. You are not building one; building a second one is the single
worst outcome available to this session.

  public.people                     — the person entity (39 rows in production)
  public.guests.person_id           — the link, WITH an index
  migration 20270514555975_person_spine_unified_resolver_and_guest_seeding.sql
                                    — a UNIFIED RESOLVER and guest seeding, already written
  public.person_connections / person_stewardships / person_story_items — the surrounding subsystem

🚨 AND HERE IS THE FACT THAT DECIDES YOUR FIRST DAY. Measured in production 2026-09-02:

    people rows ................ 39
    guests rows ................ 40
    guests WHERE person_id IS NOT NULL ....... 0
    distinct person_id across guests ......... 0

**THE SPINE IS BUILT AND NOT CONNECTED.** A column, an index and a resolver exist, and not one guest
is linked to a person. Re-measure it yourself before you believe me:

    select count(*) from people;
    select count(*) from guests where person_id is not null;

⇒ YOUR FIRST JOB IS A DIAGNOSIS, NOT A BUILD. Find out WHY `person_id` is NULL on every guest. The
honest answers are: the resolver has no caller; it has a caller that never persists; it runs and
fails silently; or it was superseded. Establish which, and say so in the PR, BEFORE writing schema.
A shared guest list built on top of a link nobody sets will be a second identity model that passes
its own tests while disagreeing with the spine — the exact failure this project keeps paying for.

WHAT 7a SHIPPED, which you build on (PR #5082, migration 20271189765490_event_cluster_primitive.sql):

  public.event_clusters          — the cluster
  public.event_cluster_members   — membership; UNIQUE (event_id) means AT MOST ONE cluster per
                                   celebration, and a partial UNIQUE INDEX WHERE is_anchor means at
                                   most one anchor per cluster
  the column is `event_cluster_id` — NOT `cluster_id`, which already means an ANTI-FRAUD IDENTITY
  cluster (~20 hits, none of them a celebration). Do not "tidy" it.

🔒 THE OWNER RULING YOU MUST NOT ERODE (2026-09-02, DECISION_LOG.md):
**A CLUSTER IS PRESENTATION AND PLANNING, NEVER ACCOUNTING. THE POT STAYS STRICTLY PER-CELEBRATION.**
7a shipped three structural guards that fail the moment anyone gives a cluster accounting meaning:
  · no Papic table references or names a cluster
  · no Papic function has learned the word event_cluster
  · the cluster tables hold no value of any kind
They are in `apps/web/tests/db/a-pot-belongs-to-one-celebration.db.test.ts`. A shared guest list is
the FIRST phase with a plausible reason to reach across celebrations — so run that file before you
push and never weaken it. If your work makes it red, your work is wrong, not the guard.

⚠ ALSO STILL TRUE: the per-guest share is DERIVED at spend time and never stamped. A shared guest
list must not tempt anyone into stamping it.

BUILD:

1. The diagnosis above, stated plainly in the PR body.
2. Whatever makes `guests.person_id` real — most likely wiring the existing resolver rather than
   writing a new one. If the resolver is sound, this is a caller and a backfill, not new schema.
3. One person across the celebrations of ONE cluster: invited to the engagement and the wedding, she
   is one row in the planner's view, with her own per-celebration guest rows underneath.
4. Guards: a person in two clustered celebrations resolves to ONE person; a person in two UNCLUSTERED
   celebrations does NOT silently merge; and the pot guard above still passes.
5. RLS: a year holds only your own celebrations — 7a shipped
   `a-year-holds-only-your-own-celebrations.db.test.ts`. A shared guest list must not become a way to
   read a guest list you do not own. Run that file too.

DO NOT build 7c (dates/timeline) or 7d (budgets). 7d in particular is where pooling the pot becomes
tempting, and it is ruled out.
```

## Model and effort

**Opus 5 · xhigh.** The failure mode here is silent: a second identity model beside the spine passes
its own suite while disagreeing with the first, and nothing goes red. That is worth the top tier —
the same reasoning that put 6b and 7a there, and not merely because the task is large.
