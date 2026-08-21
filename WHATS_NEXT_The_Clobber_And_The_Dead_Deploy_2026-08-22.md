# 🔴 THE DEAD DEPLOY AND THE CLOBBER — 2026-08-22

> **Read this before any other stream.** Production stopped shipping on
> 2026-08-21 and four already-merged features are missing from the repo. Every
> other handoff in this corpus assumes a repo that deploys; this one does not.

---

## 1 · WHAT THE OWNER SEES

> *"i do not see it."* — 2026-08-22

He is right, and it is **not his browser and not the change he is looking for**.

**PRODUCTION HAS NOT DEPLOYED SINCE 2026-08-21 14:19Z.** Everything merged after
that built green, tested green, and never reached the site. At the time of
writing that is **nine merges**, including both My Events board changes
(#4678, #4697).

🔑 **THE SYMPTOM IS FOUR FEATURES AWAY FROM THE CAUSE.** Nothing fails near the
change that looks stuck. The site simply stops updating.

---

## 2 · WHY IT STOPPED — the mechanism, verified

`deploy-prod.yml` does **two** things in order:

1. `supabase db push` — apply migrations
2. **then** fire the Vercel deploy hook

**A migration failure means the hook never fires.** The build is fine; nothing
publishes it.

⚠ **DO NOT REPEAT MY MISTAKE HERE.** I read that workflow's `DORMANT` notice and
announced that the job was inert and Vercel deployed natively. **That was
wrong.** The `DORMANT` echo is one branch of a guard, not the state of the job.

✅ **THE EVIDENCE THAT SETTLES IT** is the Vercel deployment record, not the
workflow's own prose: every `target: "production"` deployment carries
`deployHookName: "migrate-then-deploy"`, and the newest one is `daf6de9` from
14:19Z. Everything after it is `state: CANCELED, target: null` — branch previews,
never production.

🔑 **A WORKFLOW'S OWN LOG LINE IS NOT PROOF OF WHAT IT DID. Read the deployment
record.**

### The drift that fails the push

Three migrations are **applied in production and absent from the repo**:

| version | name |
|---|---|
| `20271154904649` | `five_hundred_papic_challenges` |
| `20271155852254` | `requests_do_not_linger` |
| `20271155952591` | `a_real_screen_up_to_twenty` |

`supabase migration list` prints each with an **empty local column** and the step
fails. All three were committed and merged normally, then deleted.

---

## 3 · THE CLOBBER — what actually happened

**Commit `aa39dc5a5`** (PR [#4700](https://github.com/iscasasola/setnayan-platform/pull/4700),
*"the guest fills their own details"*), merged into `main` as **`953a9d49e`**:

- **deleted 24 files**
- **modified 42 more**

⚠ **CORRECTION TO MY OWN FIRST DIAGNOSIS.** I called this a *stale-branch merge
clobber*. **Measured, it is not:** the branch's merge base is `daf6de93e`, which
already contained every deleted file, and `aa39dc5a5^` contains all 24. **The
branch HAD them and the commit deleted them.** Only **one** file in that merge
was changed on `main` without the branch touching it. So this is a bad commit on
the branch — a stray `git checkout` / revert — **not** a merge resolving against
an old base. The effect is identical; the mechanism is not, and the next person
must look at the commit, not the merge.

### Four already-merged PRs lost most of their work

| PR | what is gone from the repo |
|---|---|
| [#4686](https://github.com/iscasasola/setnayan-platform/pull/4686) | **631 Papic Challenges** — pool, picker, categories, the couple's screen, the emit script |
| [#4695](https://github.com/iscasasola/setnayan-platform/pull/4695) | **connection-request expiry** — the `/privacy` promise that *"requests do not linger"* |
| [#4696](https://github.com/iscasasola/setnayan-platform/pull/4696) | **the couple's own custom editorial column** |
| [#4699](https://github.com/iscasasola/setnayan-platform/pull/4699) | **`pay-path`** — every buy button landing on the payment page |

🚨 **CI CANNOT SEE THIS, AND THAT IS THE WHOLE LESSON.** Every check passed on
that PR. **A repo missing an entire feature is internally consistent** — no
dangling import, no type error, no failing test, because the calling code was
removed too. Measured: the restored modules have **zero consumers** on `main`.

🔑 **THE ONLY SYMPTOM WAS A DEPLOY THAT STOPPED.**

---

## 4 · WHAT IS ALREADY DONE

**PR [#4706](https://github.com/iscasasola/setnayan-platform/pull/4706)** —
branch `claude/restore-the-clobbered-work`. **Check its state before doing
anything**; if it merged, the deploy backlog should have shipped.

It restores **only**:

- the three migrations (safe by construction — the objects already exist in
  prod, so the push is a **no-op**);
- `apps/web/tests/db/papic-story-challenges.db.test.ts`;
- the regenerated exposure baseline.

### 🔑 Two things that PR proved, and the next person needs both

**A MIGRATION AND THE GUARD THAT DESCRIBES IT ARE ONE UNIT.** Restoring the
migrations alone went red: *"the-place is a side story and must carry `{who}`"*.
Measured in prod — **97 side stories, 45 without the token** — so it was never
one row. **That guard was itself one of the 42 reverted files**: `main` carries
the version predating the 631-challenge set, judging content written after it.
Restore either alone and the repo contradicts itself.

**THE EXPOSURE BASELINE WAS UNDERSTATING PRODUCTION.** It had been regenerated
while those migrations were missing, so the committed freeze file claimed a
**smaller** reachable surface than the live database has — reporting green over
objects nobody reviewed. Regenerating adds exactly two facts, **both verified
present in prod**: `papic_challenge_library.event_types` (`anon` cannot read it)
and `papic_challenge_pick_counts()`. **A correction, not a widening.**

---

## 5 · ⏭ WHAT IS LEFT — the actual next job

**Restore the remaining 21 deleted files and the 42 reverted ones**, WITHOUT
undoing PR #4700's genuine work (guest details) or anything merged after it
(#4702 · #4703 · #4705 and later).

### The recovery source

- **Deleted files:** `git checkout aa39dc5a5^ -- <path>` — verified: all 24 are
  present there.
- **Reverted files:** compare `main` against `daf6de93e` per path.

### ⚠ Three traps in this specific recovery

1. **`aa39dc5a5` DID have a real purpose.** Its guest-details work (the
   `[slug]/_lib/guest-details-changed*`, `rsvp-widget`, `actions.ts` edits) is
   wanted and must survive. **Do not blanket-revert the commit.**
2. **Later merges have since edited some of the same 42 files.** Taking
   `daf6de93e`'s version wholesale would clobber #4702/#4703/#4705 — *committing
   the same crime in the other direction.* Diff per file; never per tree.
3. **The 42 include `supabase/security/exposure-surface.baseline.txt`.** It is
   GENERATED. Never hand-merge it — regenerate with
   `pnpm --filter @setnayan/web exposure:baseline` and read the diff.

### The 24 deleted files

```
apps/web/app/[slug]/_components/editorial/custom-columns.ts (+ .test.ts)
apps/web/app/dashboard/[eventId]/studio/papic/challenges/page.tsx
apps/web/lib/connection-request-expiry.ts (+ -core.ts)
apps/web/lib/every-buy-button-lands-on-the-payment-page.test.ts
apps/web/lib/papic-challenge-categories.ts
apps/web/lib/papic-challenge-picker.ts (+ .test.ts)
apps/web/lib/papic-challenge-pool.ts (+ .test.ts)
apps/web/lib/papic-challenge-sql.ts
apps/web/lib/pay-path.ts (+ .test.ts)
apps/web/tests/db/five-hundred-challenges.db.test.ts
apps/web/tests/db/requests-do-not-linger.db.test.ts
changelog.d/{a-column-of-their-own,five-hundred-papic-challenges,
             pay-applies-to-all,requests-do-not-linger}.md
scripts/emit-papic-challenge-pool.mjs
supabase/migrations/2027115{4904649,5852254,5952591}_*.sql   ← done in #4706
```

---

## 6 · 🔒 THE RULE THIS EARNS

> **A DEPLOY THAT STOPS IS A SYMPTOM WITH NO OWNER.** Nine changes queued behind
> a failure none of them caused, and the person waiting was told each one had
> shipped.

**After any merge you expect a person to SEE, check the deployment record — not
the merge, not CI.** `/api/health` reports the commit production is actually
serving:

```bash
curl -s https://www.setnayan.com/api/health
```

If that version is not an ancestor-or-equal of your merge, **it has not
shipped**, whatever GitHub says.

⚠ And this is the SECOND time prod has silently stopped applying migrations —
see `[[project_setnayan_deploy_silently_stopped_migrating]]`. **Assume a third.**
