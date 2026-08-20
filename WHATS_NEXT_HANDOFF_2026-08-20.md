# WHAT'S NEXT — HANDOFF FOR A NEW ACCOUNT (2026-08-20)

> **You are probably a different Claude account on a possibly different machine.**
> Assume **no memory files** (`~/.claude/.../memory/` does NOT travel), no conversation history,
> and nothing local that is not committed and pushed. Everything you need is in this file and in
> the two repos:
> - specs/corpus — `github.com/iscasasola/Setnayan-specs` (this file lives here)
> - code — `github.com/iscasasola/setnayan-platform`
>
> ⚠ **A HANDOFF IS NOT EVIDENCE — including this one.** Every claim here was measured on
> 2026-08-20 against the live site, the production database, shipped code at `origin/main`, or
> GitHub, and says which. **Re-verify before acting.** This document began rotting the moment it
> was written — on 2026-08-19 its predecessor was wrong within the hour, written by the same
> author, in the file whose entire job was to prevent that.
>
> **Supersedes [`WHATS_NEXT_Silent_Failures_2026-08-19.md`](WHATS_NEXT_Silent_Failures_2026-08-19.md)** —
> that file's §2 build list is now COMPLETE and its §3 recommendation #2 was WRONG. Read this one.

---

## 0 · 🛑 THE FOUR TRAPS THAT COST A SESSION

**1 · `/Users/icecasasola` IS A STALE CHECKOUT — ~750 COMMITS BEHIND `origin/main`.**
It holds **zero** commits `origin/main` lacks, so there is nothing in it to rescue. A subagent
sweep aimed at it returned a **coherent, fully control-flow-traced, completely wrong** finding
citing real line numbers in code that had been **deleted**.
✅ `git worktree add --detach /tmp/wt-read origin/main` and give subagents **that** path. A fresh
worktree has no `node_modules`, so tsc/tests/lint there "pass" while resolving nothing — reuse a
worktree that has them, or install first.

**2 · A FLAG'S DEFAULT IN CODE IS NOT ITS VALUE IN PRODUCTION.** On 2026-08-20 an audit read
`if (!packageAuthoringEnabled()) notFound()`, concluded the feature was switched off, and it was
reported to the owner as a blocker. **It was ON the whole time** — the page renders. The owner
said "I think those are on, can you check?" and he was right. **Open the page. It takes thirty
seconds.** `NEXT_PUBLIC_*` values also inline into the production bundle and can be read from it;
server-side vars (e.g. `RESEND_API_KEY`) **cannot be read from a session at all** — say so rather
than guess.

**3 · COMPARE THE *TOTAL* TYPECHECK COUNT AGAINST A BASELINE, NEVER A GREP FOR YOUR OWN FILES.**
The baseline is **270 pre-existing errors** (missing optional deps). A type change breaks its
**consumers**, which are by definition files you did not name. This shipped a broken PR once
(#4590) and nearly a second time (six layout files).

**4 · "GREEN" IS NOT ONE VERDICT.** Of five mutations on the last change, three came back green
for three different reasons: one sabotage **never landed** (`if (false)` left the searched string
intact, count 1 → 1), one hit the **sibling** function (2 → 1 at the wrong site), and one was a
**genuinely weak assertion** (it checked a `catch` existed, so `throw e` stayed green). Only the
third was a real gap. **Print the occurrence count before → after, or a mutation run proves
nothing.** Also: a mutation must look like the REGRESSION — delete the code, don't rename it.

🪤 **And backups must be keyed on the FULL PATH.** A mutation run keyed on `basename` overwrote
the guest list with the Patiktok booth — **both files are `page.tsx`** — replacing 1568 lines with
394, silently. Noticed only because two later mutations reported `TARGET ABSENT`. **Commit before
you mutate.**

---

## 1 · WHAT SHIPPED — 17 PRs, do NOT rebuild any of it

**#4579 – #4595.** 16 merged; **#4595 was still running its final check when this was written —
verify with `gh pr view 4595 --json state,mergedAt`.** Production self-reported the merge commits
as they landed (`/api/health`), so this is measured, not inferred from GitHub.

### The one disease behind almost all of it

**A failure that renders identically to success, or to emptiness.** Nothing throws, nothing a
person can see is logged, CI stays green.

| what a person saw | what was true |
|---|---|
| upload chip at **0% forever**, spinner, no error | the transfer died; no event fires when it does |
| *"No guests yet. Start by adding the couple's first invite."* | 180 guests; the read was refused |
| a call circle reading **"C"** | that is the first letter of "Camera off" |
| **"Paid ₱0 · Remaining ₱200,000"** | they had paid ₱150,000 |
| **"₱0 committed"** against a real budget | two reads failed; the `try/catch` could never fire |
| a supplier publicly labelled **"New to Setnayan"** | they had 200 finalised events |
| a supplier told to **"Create your shop"** | they already had one |

🔑 **A LOG LINE NEVER CHANGED A PIXEL.** Several of these had the error **already bound and
already sent to Sentry**, and still told the person something false. **The measurement has to
reach the RENDER.**

🔑 **AND THE APP LAYER IS NOT THE CONTROL** for the money ones: Supabase **RESOLVES** with
`{ error }` rather than throwing, so `try { … } catch { … }` around a Supabase read **can never
fire**. Several of these sat behind a catch that looked like error handling and was decoration.

### The pattern to copy — it is IN THE CODE REPO. Do not invent a new one.

| shape | file |
|---|---|
| the original (supplier side, 2026-08-18) | `apps/web/app/vendor-dashboard/reads-are-honest.test.ts` |
| a list + its counts | `apps/web/lib/guests.ts` · `lib/guests-read-is-honest.test.ts` |
| money | `apps/web/lib/budget.ts` · `lib/money-that-was-never-measured.test.ts` |
| a `catch` that can never fire | `apps/web/app/dashboard/[eventId]/_components/the-dashboard-counts-what-it-read.test.ts` |
| fail-CLOSED vs fail-OPEN | `apps/web/lib/a-shop-that-exists.test.ts` |

**Its three rules:** bind the error on every `data` destructure (the `auth.getUser()` session read
is exempt **by shape**); **gate any stated absence on a measured flag AND show a "we couldn't
load" line**; never render a refused read as a money figure or a headcount of zero.
⚠ `actions.ts` files are **out of scope** — there an absence DENIES, and failing closed is right.

⚖ **PICK THE FAILURE DIRECTION BY WHAT BEING WRONG COSTS. Neither default is universal.**
- `canOpenShop` fails **CLOSED**: hiding a button for one render self-corrects; a duplicate shop is
  permanent, because shop addresses are immutable once minted.
- The ₱2,500 photo wall fails **OPEN**: an unrecognised value must not silently delete a feature
  somebody paid for.
Both rulings are recorded beside their code. Do not "harmonise" them.

---

## 2 · ✅ THE 11-ITEM BUILD LIST IS COMPLETE

Every confirmed instance from the 2026-08-19 sweep is fixed and merged. **There is no
outstanding list from it.** If you find a new one, follow the pattern above.

---

## 3 · 🔎 ARE WE USER AND VENDOR READY? — measured 2026-08-20

**Short answer: technically close, commercially not yet. And most of what is missing is a
setting or a business decision, not code.**

### Measured production state (live database, 2026-08-20)

**9 accounts · 8 events · 39 guests · 14 Papic photos · 2 shops (1 published, 2 verified) ·
2 services · 0 packages · 0 orders EVER · 45 event_vendors rows of which only 1 is
marketplace-linked** (the other 44 are names a couple typed into a list).

🔑 **NOTHING HAS EVER BEEN BOUGHT.** That is why defects here are found by reading code rather
than by anyone complaining — and why **the single highest-value action is not on any build list:
somebody using the product end to end, on a phone.** Every bug fixed on 2026-08-19 had been live
for weeks (the upload stall since 5 July, the call-room initials since 11 July). A session
**cannot** do this; it must not sign in as the owner or push his real data around.

### The journeys

- **Couple:** can sign up, plan, add guests, invite. **Cannot buy cleanly.**
- **Vendor:** can sign up, be verified, be found by search. **Has nothing to sell and cannot
  easily be contacted** — the one published shop has no published service cards, so its Inquire
  section is a dead end.
- **Marketplace search WORKS** — verified live: searching the shop's name finds it, searching its
  service category finds it, searching an unrelated category correctly finds nothing. It is
  **empty, not broken.**
- **Packages WORK and are switched ON** — verified by opening the page. `0 packages` means nobody
  has built one. **This was reported as "switched off" and that was wrong.**

---

## 4 · 🔴 WHAT THE OWNER MUST DO — current as of 2026-08-20

### ✅ Done during this session — do not re-ask

- **Business email fixed.** `platform_settings.business_email` was **`info@icasaoffroad.com`** —
  another company, printed on every customer receipt. Now **`info@setnayan.com`** (owner-supplied,
  verified in prod).
- **Morning ops digest turned ON** by the owner (`admin_digest_enabled = true`, verified).
- **Compromised-password checking** is **NOT** an owner task — it shipped 2026-08-18 in
  application code (`b2d09fd5f`). The register said "one switch in the database console"; that was
  false and was recommended to the owner before being checked.

### ⏭ Still open, owner-only

1. **Money lands in a personal name, and there is no official receipt.** GCash
   *"Indalecio S. Casasola II"*, BDO *"Indalecio Casasola II"*. A test purchase will work
   mechanically and leave this open. Registration/BIR decision, not code.
2. **Is `RESEND_API_KEY` set in Vercel?** ⚠ **NOT READABLE FROM A SESSION** — server-side. Without
   it, email silently no-ops: the digest and the new payment alert will both do everything right
   and send nothing, which looks exactly like "no work waiting". **Check it in the hosting
   settings and say which you did.** Nothing has ever been emailed in prod (0 save-the-dates,
   0 anniversary emails, 0 digests) — but that proves nothing, because nothing has ever *tried*.
3. **A test purchase, end to end, with real money.** Now worth doing: the receipt carries the
   right company and the alert exists. Do it, then check the alert arrived.
4. The remaining rulings/signatures in
   [`WHAT_IS_LEFT_2026-08-17.md`](WHAT_IS_LEFT_2026-08-17.md) §6 — ⚠ **verify each before acting;
   that section has been measurably wrong more than once.**

---

## 5 · ✅ THOSE FOUR ARE CLOSED — 3 SHIPPED 2026-08-20, 1 WAS NEVER A BUILD

**Do NOT start any of them again.** Each was re-verified against `origin/main` and the live
production database *before* acting — not against this section, which was wrong about item 4.
PRs [#4600](https://github.com/iscasasola/setnayan-platform/pull/4600) (merged) ·
[#4601](https://github.com/iscasasola/setnayan-platform/pull/4601) ·
[#4602](https://github.com/iscasasola/setnayan-platform/pull/4602). Full row: `DECISION_LOG.md`
2026-08-20. ⚠ Verify PR state with `gh pr view <#> --json state,mergedAt` before trusting this
line — this corpus has been wrong about a PR's state three separate times.

1. ✅ **The hidden consent field is deleted.** It posted `public_summary_consent="yes"` with no
   checkbox and no sentence, opting the couple into publication on `/realstories`. Measured
   first: **9 users, 0 consented** — the door was open, not walked through. Deleted rather than
   re-drawn, because the Google button on the same screen posts no consent either and two
   shipped surfaces (Website → Privacy / Editorial) take it deliberately and reversibly. The
   guard sweeps **every** `.tsx` under `app/`, not the one file — the rule was already written
   down and already obeyed in one place; what was missing was anything watching the second.
2. ✅ **The "N to send" pill is re-pointed.** `guests.invitation_sent_at` confirmed to have zero
   writers (repo · migrations · every function in the prod schema; 0 of 35 guests stamped).
   🔑 **It was not a missing write — the feature does not exist.** There is no per-guest send;
   the stage hands out ONE link, and that column's own migration reserves it for a formal RSVP
   invitation never built, so **stamping it would have been a lie in the other direction.** The
   step now reports the one true state that stage has — whether the shared link can be opened —
   which `fetchJoinUrl`/`sharedJoinLinkState` already computes, so it costs no read. The dead
   query is deleted.
3. ✅ **The invitation door says the date in words.** 🔑 **And the obvious fix would have been
   worse than the bug:** `event_date` is a decided day only when `event_date_precision` says so,
   and **4 of 9 production events are `'year'` precision while holding a real-looking date**
   (one reads `2027-03-09`). Pretty-formatting that announces a day nobody picked, which a
   relative could book a flight on. One helper, precision **required not optional** so
   forgetting it cannot compile. The branded `/{slug}/invite` behind printed QR posters is
   covered too — it was a third door this section did not mention.
4. 🛑 **NOT A BUILD, AND THIS SECTION NAMED THE WRONG SHOP.** It said *"the one published shop
   has no published service cards"*. Measured live: **`is_published` is not what makes a shop
   reachable — `public_visibility` is.** The `is_published=true` shop (Saysay, and it has **2
   active services**) is `hidden` and **404s**; the shop a stranger can actually open is
   **`setnaprod` (HTTP 200), which has 0 services**. So the conclusion was right about the live
   shop *by accident, through a wrong premise*. Its "Services offered" row renders taxonomy
   chips, not sellable cards. **This is content on the owner's own test shop, not code.**
   🔑 **Reading a boolean whose name sounds like the answer is how this went wrong** — the
   column called `is_published` does not decide whether the page is published.

## 6 · 📌 CORRECTIONS MADE TO OTHER DOCS — do not re-introduce

- `WHAT_IS_LEFT_2026-08-17.md` §6f **"STOP — MAIN'S CI IS RED, START NOTHING"** — lifted. Main is
  green. 🔑 **A stop order is the most expensive thing a stale doc can hold: every other rotten
  line costs one wrong action, that one costs ALL action.**
- §6 item 12 (the face-matching privacy alarm) — **struck.** Prod is **5 `mode_a` · 3 `mode_b`**,
  not "every event", and the live `/privacy` page is honest and specific. As written it would have
  sent the owner to rewrite a page that was already correct.
- §6 item 2 (compromised passwords) — **struck**, shipped in code.
- §5 "the 'we couldn't load this' screens have 0 consumers" — **false**; `ErrorState` has seven
  import sites.
- `STATUS.md` (code repo) described the **retired token economy as "live in prod"** and listed a
  **closed** PR as an open owner item, and said "4 PH/APAC buckets" when there are **five and none
  is in the Philippines**. All corrected; it was 34 days stale while telling cold sessions to
  start there.
- `WHAT_IS_LEFT.md` (code repo) described **three shipped features as unbuilt** — the guest photo
  wall control, the supplier venue/ceremony-fit card, and venue capacity. That is the
  "paid twice for a page that already existed" failure RULE 0 exists to prevent.

---

## 7 · 🔔 HOW THE OWNER LEARNS SOMEBODY PAID — built 2026-08-20 (#4595)

Two moments matter, and only the first told anyone:

    order SUBMITTED  → in-app notification to admins (before money exists)
    payment LOGGED   → nobody was told at all

The second is where real pesos left a real bank account. It now notifies every admin **and
emails**, because `order_awaiting_reconciliation` was **not on the email allowlist** — so even the
notification that DID exist was a tray badge that reached nobody away from the console.
🔑 **The notification and the allowlist are two halves of one mechanism; having one is
indistinguishable from having neither.**

⚖ The daily digest is the **safety net underneath** this, not a substitute — a next-morning
summary is the wrong answer for a customer waiting on a purchase. A test pins that the digest
survives, so nobody deletes it thinking the alert replaced it.
⚖ A duplicate submit deliberately does **not** re-alert; alerting twice for one payment trains the
reader to ignore alerts.
