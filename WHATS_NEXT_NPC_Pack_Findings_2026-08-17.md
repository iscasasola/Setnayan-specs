# WHAT'S NEXT — 15 unverified NPC-pack findings · 2026-08-17

> # ✅ SUPERSEDED 2026-08-24 — THE VERIFICATION HAS NOW RUN. DO NOT RE-RUN IT.
>
> **All 13 findings in this file are dispatched in
> [`NPC_Pack_Findings_VERIFIED_2026-08-24.md`](NPC_Pack_Findings_VERIFIED_2026-08-24.md)** —
> 9 confirmed · 2 refuted · 1 reclassified as an owner decision · 1 deliberately withheld.
> Checked against shipped code, the live production database and the pack PDFs.
>
> ⚠ **The "15" in this title is a counting error in this file** — its own table lists 13, and the
> other seven were already closed in its "do NOT re-investigate" section.
>
> 🛠 **Some of them are already FIXED**, not merely verified: #14's face-blur veto shipped as PR
> #4747 and #4749 on 2026-08-24. **Read the verified doc before acting on anything below**, or you
> will rebuild work that has merged.
>
> **Everything under this banner is the state on 2026-08-17 and is kept as history.**

> **STATE (2026-08-17): the verification did NOT run.** A fan-out of 8 verifiers + 1 synthesis agent was
> launched and **all 9 failed on a session usage limit** (resets 21:50 Asia/Manila). It returned
> `total: 0, confirmed: 0`.
>
> 🚨 **`confirmed: 0` HERE MEANS "NOTHING WAS CHECKED", NOT "NOTHING IS WRONG."** This is the
> documented trap — *a fan-out that silently sweeps nothing looks exactly like a clean result*.
> The 15 findings below are **exactly as unverified as before the run.** Do not close any of them
> on the strength of that empty result.

## Where these came from

An adversarial audit of the regenerated pack: 7 claim-classes → **62 candidates → 30 survivors**
(each survived two skeptics: one attacking the facts, one attacking materiality). The top 5 were
re-verified by hand and **all five were real** — device fingerprinting mis-described, the
non-existent backups, the "never records money" sentence, the unenforced deletion promises, and
the 10-tag cap. That hit rate is why the rest deserve checking rather than dismissing.

## ✅ Already closed (do NOT re-investigate)

| # | finding | outcome |
|---|---|---|
| 1 | device fingerprinting described as switched off | **CONFIRMED + FIXED** — it is deliberately ON (owner policy 2026-07-24); the pack was stale |
| 2 | "daily encrypted backups retained 30 days" | **CONFIRMED + FIXED** — there are none; owner accepted this 2026-08-10; recovery step rewritten |
| 3 | "never holds, moves, **or records**" money | **CONFIRMED + FIXED** — 3 records, ₱111,500; now declared as DPS-20 |
| 4 | face data auto-deleted at 5 years | **CONFIRMED + FIXED** — owner ruled 3 months after the event ENDS; marked not-yet-enforced |
| 5 | supplier ID docs destroyed on decision | **owner ruled 90 days after the decision**; marked not-yet-enforced. ⏭ Re-check whether the CURRENT wording still misstates anything |
| 7 | event data auto-deleted at 5 years | **WITHDRAWN** — implementing it literally would delete the photos (everything cascades from the event) |
| 18 | "max 10 tags/photo" credited as a privacy control | **CONFIRMED + FIXED 2026-08-17** — production enforces only a **100,000** runaway-write backstop, read out of the live function. Caps retired by the owner 2026-08-06 |

## ⏭ THE 15 STILL UNVERIFIED

Ranked as the audit ranked them. **Each is a CANDIDATE, not a fact.**

| # | claim | why it matters if true |
|---|---|---|
| 6 | account deletion described wrongly in both directions — promises a 30-day grace that may not exist, and understates what is kept | a person deleting their account is told something untrue |
| 8 | pack declares we collect a government ID, liveness video and anti-money-laundering screening from every supplier | if aspirational, we over-declare collection we don't do |
| 9 | five outside organisations named as receiving supplier data; US + UK transfers declared | naming processors we don't use is as wrong as omitting ones we do |
| 10 | a company in Germany receives text couples write, named nowhere | an undeclared processor + an undeclared cross-border transfer |
| 11 | OpenAI described as a contract-analysis fallback; may actually read couples' event stories | wrong purpose declared for a named processor |
| 12 | the manual's sharing list omits the company hosting the entire website | the most obvious processor of all |
| 13 | pack (and possibly the live public page) offers an analytics off-switch that may not exist | **a right we advertise and may not provide** |
| 14 | "a guest who withdraws consent gets their face blurred" — withdrawal may blur nothing | **a promise made to guests at the moment they consent** |
| 15 | two of four people-connection rights have no mechanism | promised rights with nothing behind them |
| 16 | erasure described as delete-then-remove; may be blank-out-and-keep | **the single most load-bearing promise in a privacy filing** |
| 17 | an automatic supplier suspension said to be undoable in one click; undoing may leave the shop invisible | an appeal path that doesn't restore |
| 19 | the device-data justification rests on suppliers being charged per enquiry — answering is free on every tier | the legitimate-interest basis rests on a false premise |
| 20 | a "DO NOT LODGE" banner said to contradict the retention figure | ⚠ **LIKELY OVERSTATED** — a hand check found only `Status: DRAFT — [PENDING COUNSEL]`. Refute unless proven |

## How to resume

The workflow script is saved and every agent errored, so nothing is cached — a resume re-runs all
of them:

```
Workflow({ scriptPath: '<session>/workflows/scripts/npc-findings-verify-wf_340b4ae6-743.js',
           resumeFromRunId: 'wf_340b4ae6-743', args: <the 16-finding array> })
```

Simpler and safer: re-launch fresh after the limit resets. **Verifiers must be told to REFUTE**,
and must be given the guard rails that were in the original prompt:

1. A document is not evidence — verify against shipped code or the live database, never a comment.
2. A correction quoting old wording is NOT a defect.
3. A search that cannot match is not a negative result.
4. An empty table is not a missing mechanism — grep for the WRITER.
5. ⛔ **NEVER claim "production has no scheduled jobs."** It is FALSE and cost a retraction on
   2026-08-17. Setnayan is deliberately **cron-free**: a database compare-and-swap claim fired
   from request traffic drives **~16 periodic jobs**, all verified running that day, several of
   which delete automatically. Check `public.cron_job_runs`.

## The two builds the owner has already authorised

Neither is built; both are **smaller than they sound** because the machinery exists.

1. **Face data deleted 3 months after the event ends** (`event_end_date` where multi-day, else
   `event_date`). 🔒 Verified in the live schema: deleting face data does **not** remove photo
   tags — a tag carries the guest link itself and has no reference to face data, so nothing
   cascades. Guests keep every photo already delivered.
2. **A supplier's ID image + liveness video deleted 90 days after the approve/reject decision**,
   keeping only the decision record.

Both should copy the shipped `vendor-dossier-retention` job: a weekly `claimPeriodicJob` claim,
one idempotent DELETE, never throws. Until they ship, the pack must keep saying **ENFORCEMENT NOT
YET BUILT** — a guard asserts exactly that, so stating a period without the qualifier fails CI.
