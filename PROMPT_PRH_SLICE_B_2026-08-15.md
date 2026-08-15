> # 🛑 THIS PROMPT IS HISTORY — IT WAS EXECUTED 2026-08-16. DO NOT RUN IT AGAIN.
> **All six pieces shipped as PR
> [#4479](https://github.com/iscasasola/setnayan-platform/pull/4479), flag-dark.**
> Read the ANSWER, not the ask: `DECISION_LOG.md` row **2026-08-16** and the
> `CLAUDE.md` block *"PR-H IS BUILT AND WAITING ON ONE OWNER PRESS"*.
>
> ⚖ **The one thing still open is item 6 — the owner previewing and flipping
> `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED`.** That is the ONLY line below still live.
>
> ⚠ Every "still missing" claim in the body was TRUE at `ce5ee9b88` and is FALSE
> now. Two corrections worth carrying forward: the couple surfaces were **five,
> not four**, and the lock paths were **five, not the three** this prompt lists —
> the wizard's *Lock this vendor* and its booth lock were found by grepping every
> writer of `status='contracted'`, exactly as this prompt told me to.

# PR-H slice B — finish the supplier handshake · 15 August 2026

> **Session 9 is DONE** (PR #4451). **Session 10 slice A is MERGED, flag-dark**
> (PR [#4470](https://github.com/iscasasola/setnayan-platform/pull/4470), 2026-08-15T16:00:32Z),
> plus [#4459](https://github.com/iscasasola/setnayan-platform/pull/4459) for the promise copy.
> This is what finishes it.
>
> ⚠ **Supersedes the Session 10 block in
> [`PROMPTS_9_AND_10_2026-08-15.md`](PROMPTS_9_AND_10_2026-08-15.md)** — that block's premise
> ("half is built with zero callers") was overtaken by #4470 six hours after it was written.
>
> Paste the SHARED HEADER from
> [`WEBSITE_ADJUSTMENT_PROMPTS_2026-08-14.md`](WEBSITE_ADJUSTMENT_PROMPTS_2026-08-14.md) above the
> block. **Runs alone.**

---

```
Finish PR-H — the step where a supplier agrees before a booking is real. Slice A merged
2026-08-15 as PR #4470, flag-dark. You are building SLICE B: the surfaces slice A
deliberately left out, and the one inverse it never wired.

⛔ BEFORE ANYTHING ELSE — RE-VERIFY. THIS PROMPT WILL BE STALE.
The register this came from was accurate at 07:54Z and wrong by 16:00Z the SAME DAY, because
20+ PRs merged in between and the audit read a pinned worktree. Do not repeat that:
  git fetch origin && git log --oneline -1 origin/main
  gh pr list --repo iscasasola/setnayan-platform --state merged --limit 25
Then re-measure every "still missing" claim below with your own grep before building it. Pin a
checkout to READ CODE, never to ASSERT CURRENT STATE. Everything below was measured at
origin/main ce5ee9b88.

═══ WHAT A PERSON GETS ═══
A couple presses Lock and the screen honestly says "we've asked them", not "booked". The
supplier sees the ask, says yes or no, and their yes is what makes it real. Either side can
back out cleanly before it is answered. Nobody sees the wedding's private details until they
have actually agreed to be there.

═══ WHAT ALREADY SHIPS — DO NOT REBUILD ANY OF IT ═══
Verified at origin/main ce5ee9b88:
· The whole database machine: nine `lock_*` columns, the five-value `lock_request_state`
  machine, a forgery trigger covering INSERT and UPDATE, two indexes, three SECDEF RPCs
  (migrations 20271107090000 + 20271143289546).
· `vendor_agree_to_lock` writes `state='agreed'` AND `status='contracted'` in ONE statement,
  and the flip is MONOTONE — it must not roll a `deposit_paid` row back to `contracted`.
  DO NOT "simplify" that into an unconditional write: it would hand a paid supplier's held
  date back to everyone else.
· The supplier's answer card on their Overview —
  apps/web/app/vendor-dashboard/_components/overview-sections.tsx (LockRequestBody, agreeLock
  + declineLock), wired to the RPCs at
  apps/web/app/vendor-dashboard/clients/[eventId]/actions.ts:890 and :955.
· Decline-the-others-first (`resolve_others_first`), the 7-day window, the expiry sweep
  (apps/web/lib/lock-request-expiry.ts — DELIBERATELY NOT flag-gated; do not gate it), and
  the nudge reset.
· The flag: apps/web/lib/lock-handshake-flag.ts → NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED, off by
  default. Flag-off is byte-identical to today's behaviour.

═══ SLICE B — SIX PIECES ═══
🛑 ALL SIX ARE DONE (PR #4479, 2026-08-16) EXCEPT #6, THE OWNER'S FLAG FLIP.
The descriptions below are the state at ce5ee9b88 and no longer describe the code.
The first is a live gap slice A created; the next four are its own declared scope; the last
is the owner's.

1. 🔴 THE COUPLE CANNOT TAKE THE ASK BACK. `cancel_vendor_lock_request` exists, is
   EXECUTE-granted, and has ZERO callers anywhere (measured). So a couple who asks the wrong
   supplier, or changes their mind, has no way out and the supplier's slot stays held until
   the 7-day sweep. THIS IS A FORWARD PRIMITIVE WITH NO INVERSE — the exact shape that once
   left a vendor reading BUSY to everyone forever. Wire the couple-side withdraw. It is the
   highest-value item here and the smallest.

2. THE COUPLE'S WAITING STATES. Slice A makes Lock an ask; nothing on the couple's side says
   so. Four surfaces still speak as if the booking happened: the bench, the coverage strip,
   "Your team", and the workspace. A couple pressing Lock today would be told they are booked
   and then see a supplier who has not answered. Add the waiting state to all four — and
   COUNT THE SURFACES YOURSELF, because a fifth is how this class of bug survives.

3. 🔒 THE CLIENT-DETAIL CARD AND THE THIRD STAGE OF `get_vendor_event_brief` — WITH A PAYLOAD
   CEILING. This is the plan's defect #1 and it is a PRIVACY boundary, not a layout job: a
   supplier who has only been ASKED must NOT receive the venue address or the run-of-show.
   Only an agreement earns those. Build the ask-stage payload as its own shape and assert what
   it does NOT contain — a test that only checks the happy stage will pass while leaking.

4. THE PACKAGE AND CHAT LOCK PATHS. Slice A covered the main path. These are other ways a lock
   is created and they still book outright.
   ⛔ ONE LOCK PATH: `AccordionLockButton` → `finalizeVendor` is the spine. Route these into
   it. Do NOT add a second answer to the same question.
   🪤 Slice A already found that `acquire_service_time_slot` is SECURITY DEFINER, writes
   `contracted` itself and short-circuits the generic write — DEFINER runs as `postgres` so
   the trigger cannot catch it. ASSUME ANOTHER DEFINER PATH DOES THE SAME. Enumerate every
   writer of `status='contracted'` before you claim coverage.

5. THE DATE RE-NARROWING AT AGREEMENT. Asking deliberately does NOT finalize the wedding date
   (owner §6.1) — otherwise merely asking would pin the date off a supplier who can still
   decline, and it would survive the decline. So the narrowing has to happen at AGREEMENT
   instead, and it does not yet.

6. ⚖ THE FLAG FLIP IS THE OWNER'S, NOT YOURS. Build it all flag-dark, then STOP and ask him to
   preview. The production value of NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED could NOT be read from
   a signed-out session — do not assume it is off because the code default is off. Read it in
   the hosting settings and say which you did.

═══ EXPLICITLY NOT YOURS ═══
· Deposit-at-lock — stays flag-dark, separate owner call.
· `max_soft_holds_per_date` — enforced at lock, ZERO writers, and the vendor-settings route
  its own comment names does not exist. Do not surface "N holds left" until a writer exists.
  Do not invent a capacity number: the owner's documented default is 1 and
  `daily_booking_capacity` was never built.
· A supplier cancelling their own VERIFICATION application — a different state machine,
  one policy line, and an open owner question. Do not fold it in.
· The forgery hole on `status`: slice A's new trigger arm is a COHERENCE rule and is labelled
  as one; the shipped machine lets a couple write 'cancelled', so cancel-then-book walks past
  it. That bypass is ASSERTED IN A PASSING TEST on purpose. It closes when the flag-off path
  is retired — which is not this slice. If that test starts FAILING, forgery was closed and
  the test should be deleted, not repaired.

═══ TRAPS ═══
· THE ROW IS YOURS, THE FIELD IS NOT. Constrain state on BOTH INSERT and UPDATE. A PERMISSIVE
  `FOR ALL` policy admits INSERT and DELETE; delete-then-reinsert has defeated a correct guard
  here before.
· When an RPC becomes the sole authority for a booking, its ownership predicate MAY NOT key on
  a column the counterparty controls. Slice A had to re-anchor exactly this — the agree gate
  keyed on `event_vendors.service_id`, which is `authenticated`-UPDATEable.
· READ THE COLUMN DEFAULT BEFORE YOU REVOKE. A revoke on a column whose default is the
  privileged value ships silent universal auto-approval — worse than the bug.
· A rejected query is not a thrown error. Phantom column, enum value, RPC argument: REJECTED,
  not thrown. The only symptom is an absence.
· Prod is PRE-LAUNCH EMPTY and 44 of 45 bookings have NO marketplace supplier. "The table is
  empty" proves nobody used it, never that nothing can write it. Trace every writer, and keep
  the off-platform branch working — without it the ORDINARY case throws raw Postgres at a
  couple.
· MEASURE EVERY MUTATION BY OCCURRENCE COUNT, before → after. Slice A ran 16 and TWO caught
  defects in its own work: one sabotage left 20/20 green because a second mechanism in the
  same query masked it, and one guard matched FILE-LEVEL and read a type declaration as a call
  site. A file-level count cannot say which component still renders a thing. Anchor with \b.
· Verify the migration reached production BY QUERYING THE OBJECT, never schema_migrations.

STOP AT: everything built and flag-dark, with the owner asked to preview. Do not flip the flag.
```

---

## The state this was written from — re-verify it, do not trust it

| Measured at `origin/main` `ce5ee9b88` | |
|---|---|
| `vendor_agree_to_lock` app callers | 3 files (real call: `vendor-dashboard/clients/[eventId]/actions.ts:890`) |
| `vendor_decline_lock` app callers | 2 files (real call: `…/actions.ts:955`) |
| **`cancel_vendor_lock_request` app callers** | **0 — the couple cannot withdraw** |
| `lock_request_state` app references | 4 files |
| `LOCKED_STATUS = 'contracted'` | still at `dashboard/[eventId]/vendors/actions.ts:638` (the flag-off path) |
| Couple-side withdraw UI | none found under `apps/web/app/dashboard/**` |
| `NEXT_PUBLIC_LOCK_HANDSHAKE_ENABLED` in prod | **not readable from a signed-out session — confirm in the hosting settings** |

*Written 2026-08-15 against `origin/main` `ce5ee9b88`, prod `ce5ee9b`. Register:
[`WHAT_IS_LEFT_VERIFIED_2026-08-15.md`](WHAT_IS_LEFT_VERIFIED_2026-08-15.md) (carries a
same-day correction banner — read it).*
