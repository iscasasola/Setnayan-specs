# Which document to trust — the map, 2026-09-18

**Nothing here is deleted.** Everything named below still exists; this says which ones are CURRENT,
which are SUPERSEDED, and which are stale but load-bearing so must not be removed.

Written because the project now has **eleven documents in the repo and five in the corpus** that all
answer some version of *"what is left?"*, and a session opening a stale one rebuilds shipped work.
That has already happened: the 2026-09-11 oversight prompt tasks three build sessions with the
Velvet, Galeriya and Abaca invite themes, and **all five themes are `ready: true` on `main`** —
they shipped as #5471, #5481 and #5486.

> ⚠ **This document is itself a claim about a moving tree.** Re-measure before acting. The check
> that settles almost everything is one command:
> ```
> gh pr list --state merged --limit 200 --search "merged:>=<the doc's date>" --json number,title
> ```
> A PR usually names the thing in its own title, so grep that output for the row you care about.

---

## ✅ CURRENT — read these, in this order

| Document | What it is | Last touched |
|---|---|---|
| `registers/ONE_REGISTER.md` | **The canonical register.** SUP/PAP/DAY/LAU/DSK rows plus LR-1…LR-28. The only document that tracks STATE. | 2026-09-18 |
| `registers/02_OWNER_DESK.md` | The items only the owner can move — signatures, prices, rulings, dashboard actions, devices. | 2026-09-17 |
| `registers/FRIDAY_BUILD_2026-09-18.md` | The near-term build sequence: 6 sessions, 13 builds, already re-measured against `main` (see its §4b — two builds were eliminated as already done). | 2026-09-17 |
| `setnayan-platform/OWNER_ACTIONS.md` | The live operator runbook — console steps, env vars, the Auth-SMTP sequence added 2026-09-17 (#5544). | 2026-09-17 |
| `setnayan-platform/CLAUDE.md` | House rules. Read the copy **inside the repo you are editing**, never the one at `/Users/icecasasola`. | live |

---

## 📌 STALE BUT LOAD-BEARING — do NOT delete

Deleting these breaks the docs that point at them. They need **repointing**, not removal.

| Document | Inbound refs | Why it stays |
|---|---|---|
| `STATUS.md` | **97** | Referenced by a third of the repo's documentation. Its own header records that it once sat 34 days stale while telling cold sessions to start there — it describes a retired token economy. Trust `ONE_REGISTER.md` over it. |
| `WHAT_IS_LEFT.md` | **17** | `CLAUDE.md`'s "📋 START HERE" points here. Written 2026-08-07, verified 2026-08-30. **Superseded by `ONE_REGISTER.md`.** The fix is to repoint `CLAUDE.md`, then retire this — not to delete it out from under seventeen references. |

---

## 🗄 SUPERSEDED — safe to ignore; keep as history

Verified by inbound-reference count on `origin/main`, 2026-09-18.

| Document | Refs | Last touched | Superseded by |
|---|---|---|---|
| `TASK_32_TRIAGE.md` | **0** | 2026-05-22 | `ONE_REGISTER.md` |
| `ENGINEERING_BRIEF.md` | **0** | 2026-05-19 | `CLAUDE.md` + the corpus |
| `REDESIGN_PLAN.md` | **0** | 2026-06-13 | shipped (Atelier-Glass rollout) |
| `TRACKING_STATUS.md` | 1 | 2026-06-07 | `ONE_REGISTER.md` |
| `HANDOFF.md` · `HANDOFF_RESUME_2026-08-07.md` | 8 · 2 | 2026-08-07 | `ONE_REGISTER.md` |
| `COWORK_INBOX.md` | 4 | 2026-07-25 | `CLAUDE.md` itself calls it *"retained only as a historical worklist"* — direct corpus edits were authorised 2026-06-04 |
| `WHATS_NEXT_One_Story_Per_Day_2026-08-22.md` | 2 | 2026-08-22 | `ONE_REGISTER.md` |

---

## 📦 THE 2026-09-11 DOWNLOADS — evidence, never instructions

Three artefacts in `~/Downloads`, all written the same day, all overtaken by **132 merged PRs**.

**`02_OVERSIGHT_PROMPT_20260911.md` — DO NOT RUN AS WRITTEN.** Its central premise is false: it says
Velvet, Galeriya and Abaca sit at `ready:false` and assigns Sessions 2/3/4 to build them. All five
themes are ready; its Session 5 (Event Hub Pro finishing touches) shipped as #5472. **Four of its
five sessions are done.** Only Session 1 — the owner opening Capiz on his phone — looks genuinely
open, and it was never a build. Its own text says the right thing: *"A document is not evidence —
this prompt included."*

**`BuildFinale.zip`** (25 MB, 300 files) — a real research pack: `01_STILL_MISSING.md`, 95 verbatim
open owner questions, a corpus sweep, a repo sweep, and `_research/INDEX_all_open_items.md` with
**265 items across 32 workstreams**. **Its structure is good; its status column is not.** Spot-checks
found its "Invite themes: only Capiz exists" false, and four of the six rulings it lists as unbuilt
shipped as #5524, #5482, #5469 and #5496.

The one cut from it that does NOT rot, because code was never the blocker:

| state | count |
|---|---|
| NOT STARTED | 96 |
| **BLOCKED ON OWNER** | **77** |
| PARTLY BUILT | 33 |
| UNVERIFIED | 29 |
| BUILT-NOT-LIVE | 23 |
| **BLOCKED ON DEVICE** | **6** |

**83 of 265 — nearly a third — wait on the owner or on a device.** That is the critical path, and no
amount of building shortens it.

**`StoryFinale.zip`** (1.5 MB, 96 files) — evidence, not a plan: screenshots, A3/A4 print PDFs, OG
images and e2e logs from the story build, plus its prompts and corpus extracts. Useful as a baseline
to diff against. Not a task list.

---

## The rule this document exists to enforce

🔑 **A conflict between two documents is not an open question until you have checked whether it was
already closed.** This project has paid for that more than once — most recently a supplier-fee
"contradiction" that turned out to be a settled owner ruling from 2026-08-06, and three invite
themes that had already shipped.

**And one register beats four.** New findings go into `ONE_REGISTER.md`. Point-in-time analyses may
exist alongside it, but they must say on their own face that they are dated measurements and that
tracking lives in the register — otherwise they become a fifth thing to reconcile.

**Current scope, owner 2026-09-18:** make the site fully functional for **weddings and simple
events** at minimum. Gaps that affect only the other fifteen event types are real but out of scope
until those two work end to end.
