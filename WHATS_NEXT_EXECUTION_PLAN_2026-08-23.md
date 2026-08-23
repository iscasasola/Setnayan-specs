# THE EXECUTION PLAN — every open "what's next" item, in waves that cannot collide

**Written 2026-08-23.** The owner asked: *"assess all the what's next. use fable to plan. then
recommend what model and effort to use at best for each session to finish. Make sure none would
conflict and everything will be built properly."*

This file is the answer. It supersedes the *ordering* advice in every other `WHATS_NEXT_*` doc;
it does **not** supersede their reasoning or their trap lists — read the stream's own file before
starting its session.

> ## 🛑 A HANDOFF IS NOT EVIDENCE — INCLUDING THIS ONE
> Everything below was measured on 2026-08-23 against `origin/main` @ **`c984e0caf`**, the live
> production database, and `gh pr view`. **The register rots within hours** — while this
> assessment was being written, two items it inherited as "unbuilt" had already shipped
> (PR #4720 the plain story editor, PR #4722 the three story audiences). Re-verify before acting.

---

## § 0 · GROUND TRUTH AT THE TIME OF WRITING

| | |
|---|---|
| `origin/main` tip | `c984e0caf` |
| production serves | `c984e0c` — **the deploy is healthy; the 2026-08-21 dead-deploy incident is closed** |
| prod scale | 5 events · 40 guests · 2 shops · 14 Papic photos · **1 order ever, and it is cancelled** |
| open PRs | 6 — ⛔ **"none failing a check" was MY CLAIM AND IT WAS WRONG**, see § 1 |

⚠ **THE ₱499 UNPAID ORDER IS ALREADY CANCELLED.** `WHATS_NEXT_Onboarding_Asks_What_It_Knows_2026-08-20.md`
says a real unpaid ₱499 order is sitting in prod and asks whether to cancel it. Read live:
`S89O-GCR6BDC4Z6` is `status='cancelled'`, cancelled 2026-08-20 at the owner's instruction, with an
admin note. **Do not re-ask it.**

🪤 **THE TRAP THIS ASSESSMENT ITSELF FELL INTO.** A read-only worktree was created for the
assessors — and `git worktree add` on an **existing path fails**, printing `fatal: … already
exists`, while the very next command in the same chain printed a cheerful `OK` with the **old**
tree's hash. Three agents spent their first pass reading a tree **187 commits stale**. It was
caught by grepping for a feature known to have shipped and not finding it. **A worktree you did
not just create is not the tree you think it is — print `git rev-parse HEAD` and compare it to
`origin/main` before handing the path to anybody.**

---

## § 1 · ✅ WAVE 0 IS DONE — 2026-08-22 21:57Z. WAVE 1 IS UNBLOCKED.

**Verified independently of the session that did it:** `gh pr list --state open` returns **ZERO
open PRs**. #4535 CLOSED with a written reason; #4699 · #4708 · #4711 · #4567 · #4563 · #4723 all
MERGED; main tip `09697145d`; **production serving `0969714` — that same tip.** Two migrations
verified in prod **by the object**, my own query: the Pakanta word is now reserved (with `pay` and
`creators` still reserved and an ordinary shop name still free, so nothing was reverted or
over-reserved), and the photo board carries ten where it used to carry twenty.

⏭ **The three gates on the Pabati retirement are all in. Wave 1 may start — all three sessions.**

🪤 **Two traps that session paid for, worth more than the merges:**
1. **`$T:apps/...` in zsh triggers the `:a` history modifier and silently mangles the path** — the
   command errors and the grep count returns 0. **A verification that cannot match reads exactly
   like a clean result.** Use `${T}:path`.
2. **When merges land after yours, re-read the FINAL TIP for every piece of your own work before
   calling it done.** Five merges landed after the first one here; nothing had been reverted, but
   that is a measurement, not an assumption — and a silent revert is exactly what cost a day last
   week.

⏭ **Named, not fixed, deliberately:** one supplier-side payment link is hand-built instead of
calling the shared helper, so it misses the helper's trim. Measured inert — the reference is a
database-generated code that cannot carry whitespace — and the guard documents the exception. **A
recorded decision, not an oversight; do not "fix" it later without re-measuring.**

---

## § 1b · WHAT WAVE 0 FOUND (kept for the reasoning) — the six PRs

| PR | state | verdict |
|---|---|---|
| **#4535** | DIRTY, **507 files, 16 migrations already applied on main** | 🔴 **CLOSE IT. Do not rebase it.** This is the exact shape of the merge that deleted 24 files, reverted 42, and stopped production deploying for a day. CI cannot see that kind of damage — a repo missing a whole feature is internally consistent. |
| **#4699** | DIRTY (baseline conflict) | rebase, regenerate the baseline, land. Gates the payment verification. |
| **#4708** | DIRTY, 3 migrations | rebase, land. **Gates the Pabati retirement.** |
| **#4711** | BLOCKED | diagnose the block, rebase, land. **Second gate on Pabati.** |
| **#4567** | BLOCKED | 3 files, `lib/admin` only. Rebase, land. |
| **#4563** | BLOCKED, 1 migration | rebase, land. Frees `vendor-dashboard/repertoire`. |

**Land them one at a time**, rebasing between each, and after every migration-carrying merge
verify the object in prod **and** `curl -s https://www.setnayan.com/api/health`. The merge is not
the ship.

### 🛑 CORRECTION, 2026-08-22 — "NONE IS FAILING A CHECK" WAS WRONG, AND IT MATTERED

I wrote that all six were merely conflicted. **Three were failing, for three different reasons**,
found by the session actually running W0:

- **#4711 was failing typecheck+lint** on the guard that says no new route word may be left
  uncovered by the database mint. It ships a public `/pakanta` page and **never reserved the
  word** — `business_slug_is_reserved('pakanta')` returned NO in production, so **a business named
  "Pakanta" could have been minted our own product page permanently**, shop addresses being
  immutable. Fixed with a migration; the guard was mutation-measured 1 → 0 RED and 15/15 restored.
- **#4563 was failing the exposure freeze**, its surface widened by a new column.
- **#4567's run was CANCELLED at 15m18s** — not an assertion failure at all.

🔑 **BLOCKED · DIRTY · FAILING · CANCELLED ARE FOUR STATES AND I COLLAPSED THEM INTO ONE.** A
one-line summary of several PRs' health is cheap to write and expensive to believe. Read each run.

### ✅ AND W0 FOUND TWO LIVE MONEY DEFECTS BY FINISHING THE DEAD AUDIT LENSES — PR #4723

The two lenses that died on a usage limit were worth re-running. A **₱400 supplier purchase never
reached the payment page** and told the buyer to pay "our BDO or GCash account" while naming
**neither**; and a guest settling a photo order **notified nobody**. One cause behind both: each
guard enumerated its subjects **by hand** — one listed 7 buy paths where 9 files call the function.
Both now derive their list from the code and are floored so an empty sweep cannot pass silently.

⚠ **#4723 IS A THIRD GATE ON W1-B** — it touches the Papic buy action and the supplier-side
photo-challenge buy path, adjacent to the challenge libraries the Pabati retirement edits.

---

## § 2 · THE WAVES

A **wave** is a set of sessions that may run at the same time. The rule that makes it safe is
simple: **no two concurrent sessions may touch the same file.** Each wave below ends with the
intersection check that proves it.

### WAVE 0 — unblock (ONE session, strictly sequential)

| session | carries | what it does |
|---|---|---|
| **W0 · PR triage & land** | the six PRs · verify the six shop redirects in the deployed build · finish the two adversarial lenses that died on a usage limit (`redirect-mechanics`, `notify-and-admin`) | closes #4535, lands the other five in the order above |

*Nothing else runs during Wave 0.* Every later wave inherits its merges.

### WAVE 1 — three concurrent

| session | carries | what a person gets | territory | migration |
|---|---|---|---|---|
| **W1-A · Finished-event truth** | A1 A2 A3 A4 D3 | the schedule shows up first try · the checklist knows the day happened · **Review** goes somewhere · the fictional "7-day review window" sentence is deleted · three dead doorway rows and the two guards that were satisfied by them | `schedule/page.tsx` · `lib/checklist.ts` + page · `lib/customer-menu.ts` · `finished-event-summary.tsx` · `[eventId]/vendors/page.tsx` · `lib/budget-build.ts` · `lib/progress-stages.ts` · `(launcher)/page.tsx` + 2 guards | no |
| **W1-B · Studio & Pabati** | B1 B2 B3 B4 D4 | Pabati is retired (~80 files, not the ~50 the scope doc estimated) · the nine buy pages get a real hero · Setnayan AI names its price above the fold · the Studio rail lights the row you are on · story-page gold passes AA | `app/pabati/**` · `api/pabati/**` · `lib/pabati*` · CaptureKind + offline handlers + SKU lists · `studio/**` · `[slug]/_components/editorial/*` · `site-body.tsx` · `llms-txt.ts` · rail files | **YES** |
| **W1-C · Corpus sync** | D-4 WL-e | the prototypes speak the shipped palette · the compliance pack stops saying Philippines and stops quoting the retired 90-day rule | corpus only | no |

**Intersection check:** W1-A owns the couple dashboard + 4 lib files · W1-B owns pabati/studio/editorial/rail · W1-C owns no repo files. **Pairwise: empty.**
🔒 W1-B **cannot start until #4708 and #4711 are MERGED** — they edit the same papic and editorial files.

### WAVE 2 — three concurrent

| session | carries | what a person gets | territory | migration |
|---|---|---|---|---|
| **W2-A · Guest activation** | C1–C6, C9 + S3-hub | a guest can keep their QR and copy the address · the "check your email" screen has a way in · they are told they are on the list · they are pointed at the reply card · they can no longer erase contact details the couple typed · they can name their +1 · seat and find-my-table stop rendering a failed read as "nothing here" | `[slug]/_components/*` · `[slug]/actions.ts` · `[slug]/seat` · `find-my-table` · `api/website/qr/guest/*` · `join/*/check-email` · `papic/{me,guest,decorate}` | no |
| **W2-B · Privacy deletion jobs** | NPC-1 NPC-2 (+ NPC-V audit, read-only) | face data is actually deleted 3 months after the event ends and supplier ID images 90 days after a decision — **today neither job exists** | `lib/` job registry + retention job shape | no |
| **W2-C · Admin** | S8-gold, then D-9 | admin text stops using the unreadable gold (**106 occurrences / 51 files**), then ~95 admin routes converge on one archetype | `app/admin/**` exclusively | no |

**Intersection check:** guest tree · lib jobs · `app/admin/**`. **Pairwise: empty.**
🔒 W2-A needs W1-B merged — they share `site-body.tsx`.

### WAVE 3 — three concurrent

| session | carries | what a person gets | migration |
|---|---|---|---|
| ✅ **W3-A · Honest reads, couple tree — DONE 2026-08-24** | S3-A | ~58 reads across the couple tree stop rendering a refusal as "you have none" — ⚠ **the "45 unbound reads on the vendors page" in this row was FALSE: measured 3, with 12 already bound, and all three are a documented fail-open decision** — plus the per-tree guard, whose bill is now 16 sites, none in `[eventId]` | no |
| ✅ **W3-B · Vendor card features — DONE 2026-08-24** | CF-3a 3b 3c 3f | shipped in 4 PRs (#4741 · #4742 · #4744 · #4745). ⚠ **NOT a new table** — the picks were already frozen in the lock snapshot by #3862; what was missing was the card↔package LINK. CF-3c's Papic half is an OWNER/DPO gate, not built. | **YES** — two columns + a reader, no new table |
| **W3-C · A wake is not a celebration** | S17 | a family planning a wake gets an event that does not say "celebrate" anywhere | **YES** (event-type) |

**Intersection check:** couple dashboard · vendor dashboard · 3 lib files + guest strings. **Empty.**
Two migration writers at once is allowed **only because their table sets are disjoint** — a new
table plus `chat_threads` reads, against the event-type tables.

### WAVE 4 — three concurrent

| session | carries | migration |
|---|---|---|
| **W4-A · Couple's four daily screens** (measure first) | S5 — guests · vendors · budget · alaala wear the approved design | no |
| **W4-B · Supplier design port** | S6 — all 63 supplier screens | no |
| **W4-C · Grant hardening** | S9-res S9-next WL-d — ~290 unused anon read grants and 2 elevated-rights views closed in small batches | **YES**, sole migration writer this wave |

### WAVE 5 — two to three concurrent

| session | carries | migration |
|---|---|---|
| **W5-A · Vendor data survives a delete** (measure first) | DEL-2 — reviews, money and quotes already land; the rest of the 153-FK classification is **mapped-but-unverified** and `vendor_activity_stats` still recomputes downward | **YES**, sole migration writer |
| **W5-B · Undrawn surfaces** (measure first) | S7 — explore, tour, papic, onboarding. **Re-scope first:** the marketplace moved inside the event on 2026-08-22 | no |
| **W5-C · Small sweeps** | S11 roster half + the coordinator "Edit this site" dead end + WL-b (a host sees WHO holds a camera, not "Phone joined") | maybe |

### WAVE 6 — tail (one session)

**W6 · Verified grab-bag** — CL-P1, CL-P2, WL-c and any fixes queued by W2-B's audit. **Nothing
here has been re-verified since 2026-08-06; expect several to be already fixed.** Measure each
before touching it.

---

## § 2b · EVERY SESSION RUNS TO THE END

**Ready-to-paste prompts: [`WHATS_NEXT_SESSION_PROMPTS_2026-08-23.md`](WHATS_NEXT_SESSION_PROMPTS_2026-08-23.md)**
— one per session, each under a shared header that carries the continuity clause.

Owner, 2026-08-04: *"can you keep going instead of telling me what you recommend doing next. can
you do it. and decide"*. Every prompt is written so the session **finishes its whole list without
asking anything.** A blocked check, a conflict, a disarmed auto-merge, an item that turns out to be
already done — all of those are work, not stopping points. The session says so in one line and
carries on.

**The only legitimate stops:** an item the prompt explicitly marks OWNER DECISION · a locked price,
SKU or scope change · an action that would destroy customer data that cannot be restored. Nothing
else. Pre-launch means reversible — production holds 5 events, 40 guests, 2 shops and one cancelled
order, so hesitation costs more than a mistake.

**One report, at the end:** what shipped · what was skipped and why · what is waiting on the owner.

---

## § 3 · MODEL AND EFFORT PER SESSION

The rule, in one line: **effort is set by whether a wrong call is invisible or irreversible, not
by how many files it touches.**

| session | model | effort | why |
|---|---|---|---|
| W0 · PR triage | **Opus 5** | **high** | The judgement is "is this branch stale enough to delete work?" — the exact call that cost a day of deploys. Its audit sub-step (the two dead lenses) is **Fable**. |
| W1-A · Finished-event truth | **Opus 5** | medium | Small files, but the schedule fix rests on an inference about caching; run the discriminator before writing the cause down. |
| W1-B · Studio & Pabati | **Opus 5** | **xhigh** | A ~80-file deletion, a SKU that is *free and retired are the same row and opposite products*, and an `llms.txt` list that **throws and blanks the whole AI document** if a retired row stays advertised. Highest-risk build on the list. |
| W1-C · Corpus sync | **Sonnet 5** | medium | Reconcile, never redraw. No app code, no runtime. |
| W2-A · Guest activation | **Opus 5** | high | Touches a sign-in key (the guest's email) and issues a QR — data loss and access, in guest-facing copy. |
| W2-B · Privacy deletion jobs | **Opus 5** | **xhigh** | Irreversible deletion of biometric data and government IDs, under RA 10173. Over-deleting is worse than the gap. |
| W2-C · admin gold sweep | **Sonnet 5** | medium | 106 mechanical occurrences behind a guard — **but Opus writes the guard, and the mutation is measured by occurrence count, before Sonnet sweeps.** |
| W2-C · admin archetype port | **Opus 5** | high | ~95 routes onto one archetype is a design-judgement port, not a sweep. |
| ~~W3-A · Honest reads~~ ✅ DONE 2026-08-24 | **Opus 5** | high | The per-tree guard was the deliverable and it shipped — and three of its own rules were decoration until the mutation run caught them. Seventh, eighth and ninth. |
| ✅ W3-B · Vendor card features — DONE | **Opus 5** | high | Two aggregates published to strangers; both floors enforced in SQL, twice each. The "new table" the brief called for was not needed. |
| W3-C · A wake | **Opus 5** high for the schema and wiring · **Fable** for the words | high | The tone is the product here. A wake reading "celebrate" is the whole defect. |
| W4-A / W4-B · design ports | **Opus 5 medium** for the first screen (it sets the pattern) · **Sonnet 5 medium** for the repeats | medium | The archetypes are binding; a delta is a defect in the port, not a design decision. |
| W4-C · Grant hardening | **Opus 5** | **xhigh** | Grants and RLS fail silently at runtime and are green in every test. |
| W5-A · Vendor data survives a delete | **Opus 5** | **max** | 152 of 162 FKs cascade, the classification's own adversarial check died at 31 of 71 agents, and being wrong destroys a supplier's record permanently. |
| W5-B · Undrawn surfaces | **Fable** to re-scope · **Opus 5** medium to build | medium | Its scope genuinely moved last week. |
| W5-C · Small sweeps | **Opus 5** | medium | |
| W6 · grab-bag | **Fable** to verify · **Sonnet 5** medium to fix | medium | Most of it is expected to be already done. |

**Standing rules on top of the table**
- **Fable plans and audits; Opus builds; Sonnet repeats a pattern that Opus has already proved.**
- Never Sonnet on a migration, a grant, a deletion, money, or an enum.
- Never `low` effort anywhere in this repo — its whole defect history is bugs that are green in CI.

---

## § 4 · WHAT MUST NOT BE SCHEDULED — it is the owner's, not engineering's

- **Is the guest camera free like the rest of Papic?** — one answer deletes two gaps outright (C7, C8).
- **The cookie banner** — does it re-ask in the *same* browser? Same browser is a bug; a different one is working as designed, and "remember it for my account" is a DPO decision.
- **What the couple's dashboard calls a story** (it collides six ways) · **the "Editorial PRO" display name** · **whether correcting the story we wrote should be the paid half** — the free/paid split may be inverted.
- **Three flag flips**: service details · the lock handshake · the booking fee.
- **OD1** how much of the couple's private plan a booked supplier may see · **OD2** may an unpromoted coordinator broadcast · **OD3** day-of extras free during launch · **OD4** inviting off-platform suppliers.
- **The 450-cell tier matrix** — keep or drop · **the footer contrast** — token or per-use.
- **CSAM**: enrol with a hash provider and sign the NPC agreement *before* the env var.
- **Google**: the console resubmit and the Live Studio channel — the suspension is not the only blocker; nobody ever created a channel.
- The NPC filing tasks, the two unsigned Papic sign-offs, BIR receipts in a personal name, confirming the email key is set, **one real test purchase, and an hour on a phone.**

## § 5 · RECOMMEND DROPPING

- **#4535** — close it. Landing it re-runs the clobber.
- **The avatar maker (WL-a)** — a large greenfield surface, zero demand (0 of 39 guests), nothing depends on it. After launch.
- **PH-4B (vendor Papic allowance)** — probably superseded by *"features are free, shots are paid"* (owner, 2026-08-21). Confirm, then drop.

## § 6 · HOUSEKEEPING FOUND ON THE WAY

- 🗄 **22 worktrees exist and ~15 are fully merged into `main`** (~24 GB). The repo's own rule
  says prune as you go, because at zero free bytes **every** shell command fails — including the
  `rm` needed to recover. Prune the merged ones before starting a multi-session run. The ones
  holding unmerged work today are `wt-all` (#4699), `wt-ten` (#4708), `setnayan-wt-sec2b`,
  `wt-drive-connect`, `wt-papic-challenges`.
- 📇 **`WHATS_NEXT_INDEX.md` had no row for the One-Story-Per-Day stream** — the append that was
  supposed to add it was refused by a permissions wall and the failure was read as success. Added
  in the same commit as this file.
