# SESSION PROMPTS — the pricing work left after #4952 · 2026-08-29

> Written 2026-08-29 by the pricing session (`setnayan-cb`). Four self-contained prompts,
> one per session, to be started **ONE AT A TIME** after PR #4952 lands.
>
> **Each prompt below is complete on its own.** Paste one into a fresh session. Do not paste
> two into one session — the lanes are drawn to avoid file collisions, and merging them
> defeats that.

---

## 🛑 START HERE — THE MERGE RULE, AND WHY IT EXISTS

**Build in parallel. Merge one at a time.**

On 2026-08-28 PR #4952 was **green and mergeable four times and overtaken three times.** It
never once failed on its own merits. The cause is structural and it will bite every one of
these four sessions:

- Nearly every change here touches permissions or migrations.
- That regenerates **`supabase/security/exposure-surface.baseline.txt`**.
- That file is **generated, never merged** — a conflict in it has no correct side, so it must
  be rebuilt by replaying **~1,250 migrations**, which takes minutes.
- Any other session merging during that rebuild puts you back to `CONFLICTING`.

⇒ **Conflict → slow rebuild → someone else merges → conflict.** Four rounds, no progress.

**The rule:** when you are ready to merge, say so to the other live sessions, merge, then tell
them it is done. Everyone else holds. Use `ListAgents` to find them and `SendMessage` to ask.
Sessions on this project have been consistently cooperative — one stopped its own duplicate
work when asked.

⚠ **This file is a standing tax on the whole repo, not a fact about today.** Worth someone
eventually asking whether that baseline can be generated at merge time rather than committed
per branch. Nobody has been asked to change it; it is named here so the next person does not
rediscover it as a mystery.

---

## 🚨 THE FOUR TRAPS THAT COST REAL TIME — read before writing any code

**1 · The stale checkout.** `git rev-parse main` in `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform`
returns a commit **~700 behind** `origin/main`. Two separate readers grepped it on 2026-08-28
and reported a catastrophic defect — *"13 of 16 Papic rungs take the money and grant
nothing"* — that **did not exist**. It reached the owner as fact, and the "independent
verification" used the same stale tree.
⇒ **`git fetch origin`, build your worktree from `origin/main` explicitly, print the SHA to
confirm, and never read the primary checkout.**

**2 · A green run that ran nothing.** `npx tsx --test` on a path matching nothing prints
`# tests 0 … # fail 0` and **exits 0** — byte-identical to success. The escape this corpus
taught for weeks (`[[]slug[]]`) does **not** work either.
⇒ **Require `# tests` to be NON-ZERO before believing any pass.**

**3 · `tsc` exiting 134 with "errors=0".** A heap abort masquerading as a clean run. It has
hidden a real error today.
⇒ **Print the exit code beside the error count. A non-zero exit is a failure regardless of
what the error count says.**

**4 · Advisory locally, blocking in CI.** `lint radius tokens` is advisory on a laptop and
strict under CI's `RADIUS_LINT_STRICT=1`. A clean local pass proves nothing about it.
⇒ Run the repo's own CI script list, not just the obvious three.

**And the rule underneath all four:** *the instrument is always a count, and the failure is
always that nobody looked at it.*

---

## 🔒 THE SECURITY TRAP SPECIFIC TO THIS WORK

**The exposure freeze does NOT fail on narrowings.** If a regeneration silently absorbs a
revocation your branch made, **nothing tells you**. This nearly cost a real `anon` revocation
on 2026-08-28.

⇒ **Read every line of the regenerated baseline diff. Confirm your own narrowings survived.**
⇒ **Never resolve that file by picking a side, and never hand-edit it.** Regenerate from the
merged tree: `pnpm --filter @setnayan/web exposure:baseline`.

⚠ Three tables were found **born open** on 2026-08-28 — new tables inherit `anon` grants from
Supabase defaults, and `REVOKE … FROM PUBLIC` does **not** remove a role grant. If you create a
table, revoke **by role name** at **table level** and verify by querying the grants, not by
reading your migration.

⚠ **A column-level revoke is inert against a table-level grant.** `has_table_privilege` answers
FALSE while column grants still stand — so a table-level check reads a column-granted table as
closed. Ask per column.

---

## ✅ HOUSE RULES FOR ALL FOUR SESSIONS

- **RULE 0 — find it before you build it.** Almost nothing here is new. Grep for the feature
  noun before designing. Two features the owner asked for on 2026-07-27 already shipped.
- **Do NOT open a PR until the work is green.** ⚠ The repo **auto-arms auto-merge on every
  non-draft PR** (`.github/workflows/auto-merge.yml`). To hold one, open it as a **DRAFT** —
  that is the workflow's own documented mechanism. `--disable-auto` is a pause, not a hold.
- **Never weaken a guard to go green.** If a guard's *assertion* is stale, correct the
  assertion and say so loudly — but check first whether the guard is right and you are wrong.
- **Mutation-check every guard you write**, printing occurrence counts **before → after**, and
  restore from an explicit `cp` backup — **never `git checkout`**, which has destroyed
  uncommitted work in this repo.
- **Stage by explicit path. Never `git add -A`.** Several sessions share this tree.
- **`DECISION_LOG.md` is append-only.** On a conflict keep BOTH sides in date order.
- **Report what you MEASURED separately from what you INFER.** This project has been burned
  repeatedly by confident inference presented as fact.
- **Stop and ask rather than guess** on anything that moves money or changes what a customer
  is charged.

---

## 📋 CONTEXT EVERY SESSION NEEDS

**Prod is pre-launch.** 2 vendor profiles (both `solo`), 2 paid Solo subscriptions, 2 orders
ever (one cancelled ₱499, one paid ₱2,499 Setnayan AI). The owner ruled 2026-08-28:
*"it doesn't matter if it was sold or not, we are still trying to build it."* **Do not reason
from sales history.** The only question is whether a change breaks something that works.

**Owner communication:** plain English, no file/function/table/flag names in the reply. Say
what a PERSON experiences. He steers product and pricing; he is not reading the code.

**Already landed 2026-08-28** — do not rebuild: the price sheet · the per-row-save pricing
screen · Custom hidden from public pages · SEC-7 (a failed price read refuses the sale) ·
five hidden price-copies closed and guarded · plan changes (up prorates, down defers, term
floor, credit expires on lapse into a ledger).

**#4952 carries** (verify it landed before assuming): the booking-fee controls, the Setnayan AI
bands + event-type checkboxes, the Papic five-anchor block, `LIVE_STUDIO` → `per_day`, one
discount per family (AI 40%, Papic 10%).

---
---

# SESSION 1 — BRANCHES: SEEN BY CUSTOMERS, AND PAID FOR

**Lane:** the vendor branch add-on. Public shop page, branch library, activation.
**Avoid:** `apps/web/app/admin/pricing/**`.

## What the owner ruled (2026-08-28)
- **"Should customers ever see a supplier's branches?" → YES.**
- **"Should paying for a branch be required?" → "paid".**

## What is true today — established by a read-only trace, but VERIFY IT YOURSELF
A supplier pays **₱1,000 per 28 days** (Enterprise-only) and gets **a label only they can
see**: branch name, city, "100 km radius", an Active chip on My Shop, and a dropdown to file
their own service cards under a branch.

**No customer sees any of it** — not the marketplace, not the public shop page, not search, not
the map, not Google. Established by enumerating all 8 `vendor_branches` call sites, its RLS
policies (`TO authenticated` only, **no `anon` policy**), and the absence of any denormalised
copy. It changes nothing functional — not reach, not caps, not seats, not ranking.

The public shop page shows exactly **one** city, address and map pin, all from headquarters
(`app/v/[slug]/page.tsx` — `location_city`, `hq_address`, `hq_latitude/longitude`; JSON-LD
`addressLocality`; `areaServed` hardcoded to Philippines). **A shop with five paid branches
looks identical to one with none.**

## Build 1 — customers can see branches
**Design it before you build it.** State what a customer actually sees — a list of locations?
extra map pins? "also serving…"? Keep it small and honest.

⚠ **Only PAID, ACTIVE, non-cancelled branches may be public.** `deriveBranchStatus()` computes
the real status from the latest paid order. `branch_subscription_active` is written in three
places and **read by nothing** — do not resurrect it as the gate without checking.

⚠ **`vendor_branches` has no `anon` policy**, so a public page cannot read it through a user
session. Work out the right access path and say what you chose. **Do NOT open a blanket `anon`
read on the table** — expose only what a customer needs, and justify it.

⚠ Anything added to JSON-LD or the sitemap is a **public claim**. Keep it truthful.

## Build 2 — paying is required
Today the branch picker and the My Shop list filter only on `status !== 'cancelled'`, so a
`pending_payment` branch is **fully usable**. Paying appears to flip a chip orange→green and
nothing else.

⚠ **Verify that independently before building** — it is an inference from *"no reader exists"*,
and it is a revenue claim.

⚠ **Do not lock an existing supplier out mid-term.** Check what prod holds and report the count
before changing behaviour. If any branch is unpaid-but-in-use, **stop and say so.**

## Both
Server-side, not just hidden in the UI. Plain-English refusals, never a raw error. Tests for
each, mutation-checked. Changelog fragment.

## Known, unfixed, and adjacent — report if you touch it
There are **two** "Additional Branch" catalogue rows, both now ₱1,000. `vendor_additional_branch`
is what **charges**; `vendor_branch_28day` is what the **public pages quote** and has no buy
path. The fix is **repoint the three display readers first, THEN retire** — never the other way
round, which would drop the price from the public pages. Out of scope unless it blocks you.

---
---

# SESSION 2 — THE CATALOGUE CLEAN-UP

**Lane:** `platform_retail_catalog_v2` rows, Event Hub Pro copy.
**Avoid:** `apps/web/app/admin/pricing/**` (until #4952 has landed and you have re-fetched).

## Build 1 — delete the retired prices
**Owner ruled: "delete them."** 43 rows are `is_active = false`.

**READ FIRST:** `/Users/icecasasola/Documents/Claude/Projects/Setnayan/prototypes/retired_prices_checklist_2026-08-28.html`
— a full per-row analysis, verdicts **34 safe · 5 held-but-fixable · 4 do-not-delete**.
**Re-verify its verdicts yourself.** It is evidence, not gospel.

1. **Delete the 34 SAFE rows.**
2. **The 5 HELD rows: clear the blocker first, then delete.** Four are the Papic camera-day
   prices, freed by one fix.
3. **DO NOT DELETE the 4 locked rows.**

### 🔴 The four that must survive — and why a database check would kill three
- **`SETNAYAN_AI_B` · `_C` · `_D`** — retired, **zero database references**, and load-bearing:
  `AI_TIER_SKU` in `lib/setnayan-ai-type-pricing.ts` reads their `retail_price_php` as the
  price for **15 of 17 event types**. **The link is in CODE, not a foreign key**, so every
  database-only safety check calls them free.
  ⚠ Deleting them would **not move a price today** (the code ladder is byte-identical) — the
  harm is that those rows are the **only handle the owner has** on 15 event types' prices.
  Delete them and the figures freeze in code, unreachable from the pricing screen.
- **`SETNAYAN_AI_RENEW`** — judgement, not measurement: "switched off" there means *not sold
  separately*, not retired, and it prices something still being built.

🔑 **Hunt for more of that shape before deleting anything** — any retired code referenced by a
constant map, a TypeScript lookup, a fallback, or a SQL function body. **Report how you
searched and what a false negative would look like.** Find a fifth and it stays.

⚠ **Three near-misses**: `EDITORIAL_PRO`, `STD_PREMIUM_OPENINGS`, `PANOOD_SYSTEM`. Live pages
read their prices — but only inside a branch gated on the service being on sale, which none is.
**A fetched value is not a shown value.** Stopping at "live code reads it" would wrongly keep
three.

### Known consequences — verify and state each
- The supplier-suggestion admin map drops 42 rows → 14 (28 cascade). Invisible to suppliers.
- A refused purchase gets a generic message instead of "no longer available". No money moves.
- Referral vouchers go from an unordered first-50-of-68 to ~25, all live.
- ⚠ **The pricing screen's own delete button would call 38 of the 43 safe**, and on the four
  camera rows it attempts the delete and returns a raw database error. **Do not use it as your
  authority.** Fix its check if cheap; otherwise report the gap.

⚠ **Gitleaks reads a single-line SQL `IN ('A','B','C')` of SKU codes as leaked API keys.**
Split one code per line.

Add a test pinning that the four locked codes still exist and still resolve their prices.

## Build 2 — Event Hub Pro says what it includes
**Owner ruled: yes.**

Event Hub Pro (₱3,500, `COUPLE_WEBSITE_PRO`, titled **"Event Hub Pro"** since 2026-08-27) is the
website umbrella. Verified: `SKU_OWNERSHIP_ALIASES` grants **`EDITORIAL_PRO`** and
**`STD_PREMIUM_OPENINGS`** to anyone who owns it, and the website editor gates background
music, hero video and gallery on it.

So it absorbed the **₱999 cinematic Save-the-Date reveal** and the **₱2,999 Editorial version**
and **never updated what it says it buys.** A couple looking at ₱3,500 cannot tell it includes
a reveal they would otherwise see priced at ₱999.

**Copy only.** Do not change the price, the aliases, or what it unlocks. Say truthfully what is
included — verify each claim against the aliases and the editor's gates before writing it.

---
---

# SESSION 3 — VENDOR LIMITS AND THE CHALLENGE SUBSCRIPTION

> # ✅ DONE 2026-08-29 — BOTH BUILDS. DO NOT RUN THIS SESSION AGAIN.
> **Build 1:** PR [#4985](https://github.com/iscasasola/setnayan-platform/pull/4985) — **MERGED
> 2026-08-29T05:43Z**, migration `20271180727490`.
> **Build 2:** PR [#4988](https://github.com/iscasasola/setnayan-platform/pull/4988), migration
> `20271181420277`. ⚠ Verify each with `gh pr view <n> --json state,mergedAt` before trusting this
> banner. Full rows: `DECISION_LOG.md` 2026-08-29 (two of them). Drawn first:
> [`prototypes/vendor_plan_ceilings_2026-08-29.html`](prototypes/vendor_plan_ceilings_2026-08-29.html).
>
> ## ⛔ TWO THINGS THIS PROMPT SAID THAT WERE FALSE — corrected here, at the site that gets read
> **1 · "`platform_settings.vendor_tier_pipeline_caps_enabled` exists in prod and NOTHING in the
> entire repo references it — searched including migrations. So the grid was either never finished
> or removed."** **FALSE.** The whole engine ships and has since 2026-08-09 (`20271121655918`): the
> grid as a SQL function, a `BEFORE` trigger that refuses an over-ceiling accept, a clamp trigger,
> the TypeScript twin in `lib/vendor-tier-caps.ts`, and a parity db test. It is simply **switched
> off**. That search was run against a checkout ~700 commits behind `origin/main` — **the first trap
> this very file warns about, on its own first page.** Nothing was rebuilt; the delta was that the
> number had **zero readers in the whole application**, so a supplier could only learn it by being
> refused by it.
>
> **2 · "Prod vendors are all `free`."** Both `vendor_profiles` rows are **`solo`**, both
> `verified`, both holding **1** on the waiting list with it switched **off**. Several notes in the
> corpus still repeat the older claim.
>
> ## ⚖ Owner rulings collected while building — do NOT re-ask
> · **`verified` is 2 chasing / 1 waiting.** Asked directly, he answered *"we already had a table for
>   this"* ⇒ the table wins. Both moves WIDEN; nobody loses a slot.
> · **"Turn it on now"** — he wants the ceilings ON. ⏭ **THE FLIP IS STILL OWED**, deliberately:
>   `UPDATE public.platform_settings SET vendor_tier_pipeline_caps_enabled = TRUE WHERE id = 1;`
>   after #4985 is SERVED, never inside a migration and never before a supplier can see the number
>   that is about to bind them. Safe by arithmetic — both shops are Solo and neither is near its
>   numbers.
>
> ## 🚨 The finding that outranks both builds
> The live `papic_create_vendor_challenge` had **NO PAID GATE AT ALL** in production. `20271001130000`
> replaced it and **rebased its body on `20270906348207`** — a LOWER prefix than the migration that
> had ADDED the paywall — deleting the gate silently. **A `CREATE OR REPLACE` that copies an older
> body forward reverts every guard added in between.** Inert (0 vendor missions ever); fixed in
> #4988. **And the same mistake was then made inside the fix** — rebuilding
> `guard_vendor_profiles_entitlement` from the migration that created it turned ten db tests red,
> naming self-verification, reversing an admin suspension, the `pending_tier` five and account
> credit. ⇒ **Copy a function body out of `pg_get_functiondef`, never out of a migration.**
>
> ## ⏭ Still open from this lane
> · The **switch flip** above (owner asked for it; do it once #4985 is served).
> · **Custom's "buy past 10" dials** — named, not built. Custom is hidden from every public page, so
>   that purchase would be a door onto nothing.
> · `platform_settings.vendor_addon_tiered_pricing_enabled` is **TRUE in prod** while
>   `NEXT_PUBLIC_VENDOR_ADDON_TIERED_PRICING` is off — the database admits every tier for Papic
>   Challenges and the app gate refuses below Pro. **A pricing question, named not reconciled.**

**Lane:** vendor tier caps, waitlist/pipeline, `vendor_photo_challenge`.
**Avoid:** `apps/web/app/admin/pricing/**`, the branch add-on.

## Build 1 — waitlist and pipeline ceilings
**Owner ruled (2026-08-28):** use his own grid, and **grandfather existing suppliers.**

| tier | pipeline clients | waitlist |
|---|---|---|
| Free | 1 | 0 |
| Verified | **2** | **1** ⚠ *proposed, not ruled — see below* |
| Solo | 3 | 1 |
| Pro | 5 | 3 |
| Enterprise | 10 | 5 |
| Custom | Enterprise's ceiling, then buys past it |

⚠ **The owner's grid has FOUR numbers and there are FIVE tiers below Custom.** `verified` was
never given a value. **2 / 1 was proposed to him and he did not object, but he did not
explicitly rule it either.** It is low-stakes today (both prod vendors are `solo`, none is
`verified`) — **confirm it with him rather than shipping it silently.**

**"Whitelist" = the accepted-but-not-yet-locked client list** (owner-confirmed). Not the
calendar's approve-first day state, which is a different thing with the same word.

### What exists — measure before building
- **No cap is enforced anywhere today.** Suppliers set their own `max_waitlist_acceptances`
  free, in their calendar settings.
- `platform_settings.vendor_tier_pipeline_caps_enabled` **exists in prod and NOTHING in the
  entire repo references it** — searched including migrations. So the grid was either never
  finished or removed. **Establish which before building on top of it.**

### Requirements
- **Grandfather:** anyone above their new ceiling keeps their setting; the cap binds new
  suppliers and anyone who lowers it. Only 2 suppliers exist, so this protects almost nobody
  today — it matters after launch.
- **Draw the moment a supplier HITS a ceiling before shipping it.** Being told "you can't take
  another client" reads as broken unless it is designed to read as a ladder.
- Custom's raise dials (₱500 per +5, ₱2,500 unlimited) were approved but **Custom is now hidden
  from public pages** — build the ceilings; **do not build the dials** without asking.

## Build 2 — Papic Challenge becomes a subscription
**Owner ruled: "unlimited us 2500 for 4 weeks."** ⇒ **₱2,500 per 28 days, unlimited challenges**,
replacing today's **₱400 per event**.

⚠ **This is a build, not a price edit.** Established scope:
- `papic_photo_challenge_sponsorships` needs an expiry column and its
  `UNIQUE (event_id, vendor_profile_id)` **dropped** — a subscription grants all the vendor's
  events, so the row can no longer be keyed by event.
- **Three entitlement checks rewritten, two of them SQL RPCs.**
- `photoChallengeEligibility` rewritten: `already_sponsored` is currently a **denial**, and
  under a subscription that is exactly the state you want to **allow**.
- New renewal maths — no helper handles anything but 28 days.
- Activation and reversal hooks rewritten.
- The buy surface moves off `/clients/[eventId]`, which requires an event in the route.

⚠ **With `NEXT_PUBLIC_VENDOR_ADDON_TIERED_PRICING` ON, `vendor-addon-tier-pricing.ts` is
authoritative** and the catalogue price is ignored. It is **OFF** in prod (owner confirmed
2026-08-28) — verify before assuming, and say which price actually applies.

---
---

# SESSION 4 — THE PRICE SCREEN'S REMAINING GUARDS

**Lane:** `apps/web/app/admin/pricing/**`, notifications.
**⚠ START ONLY AFTER #4952 HAS MERGED** — this lane is the one it rewrites. Re-fetch and read
the merged screen before touching anything.

## Build 1 — the server refuses a bad price
**Owner ruled: yes.**

Today the 10% onboarding-discount floor is **a browser warning only.** The server accepts any
non-negative sign-up price and **will not even refuse one HIGHER than the regular price.**

- **Refuse server-side**, with a plain-English message naming the rule.
- ⚠ **Never silently clamp.** A screen that rewrites what you typed without saying so is worse
  than one that argues with you.
- The floor is **Papic-only** (owner ruled 2026-08-28) — Setnayan AI sets its own discount
  freely. **Keep the nonsense guard (onboarding ≥ regular) on BOTH families**; scoping the
  floor must not take that with it.
- ⚠ The floor was found **enforced nowhere** on 2026-08-28 — there was no "all rows" rule to
  narrow. Verify the current state after #4952 rather than assuming.

## Build 2 — warn a supplier before their credit expires
**Owner ruled: tell them, and "before the money goes."**

Credit expires when a shop lapses, into a `vendor_credit_ledger` row. The owner wants the
supplier **warned in advance**, not told afterwards.

⚠ **Not free.** `notification_type` is a Postgres **enum with 76 labels**, so a new notice needs
its own migration — **in its own file with NO transaction**, because Postgres forbids using a
new enum value in the transaction that adds it. Copy the shape of an existing one.

🚨 **This codebase has shipped three notification types the database never had.** They were
**refused silently** — `emitNotification` only `console.error`s. So a TS-only union member
means the supplier is told nothing and nothing throws. **Add the enum value, and derive any
guard from the code rather than hand-listing.**

⚠ Decide and state where it sits on `EMAIL_ENABLED_TYPES` / `MARKETING_GATED_EMAIL_TYPES`.
A live bug exists in that area: **all six `lock_request_*` types sit in BOTH**, and
`marketing_opt_in` defaults FALSE — so **those emails are suppressed by default**. Do not
inherit that pattern. New tests must assert **NON-membership** of the marketing set.

⚠ **When does the warning fire?** Expiry is attached to the **sweep**, which is
**login-driven — this project is cron-free.** So a shop whose owner never signs in keeps its
balance until somebody does. Work out what "before the money goes" means with no scheduler, and
**say plainly what you chose**; do not invent a cron.

## Also in this lane, small
`/admin/subscriptions` says **"Confirm payment & activate plan" / "the plan activated"**, which
is untrue for a **deferred downgrade** — that is *scheduled*, not activated. The honest fix
needs `plan_change_kind` in that page's select, and ⚠ **naming an unknown column makes PostgREST
refuse the WHOLE query**, so it is a deploy-ordering risk. Sequence it deliberately.

---
---

## ⏭ NOT IN ANY LANE — still the owner's, unbuilt

- **The two Additional Branch rows** — repoint the public readers, then retire. (Session 1 may
  do it if it blocks them; otherwise its own change.)
- **The weak-signal venue** (§ H of `Vendor_Room_Design_2026-08-26.md`) — its own project.
- **What a wake should cost**, and whether an assisted planner should offer itself at a wake at
  all. `wake` currently reaches ₱899 through the DEFAULT, which nobody chose.
- **`PAKULAY`** — ₱0, no description, no caller. What it was meant to be is not recoverable
  from the code or the database. The owner may remember.
