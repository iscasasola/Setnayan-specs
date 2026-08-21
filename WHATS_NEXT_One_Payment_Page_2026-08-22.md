# WHAT'S NEXT — THE ONE PAYMENT PAGE (2026-08-22)

> **Owner, 2026-08-22: *"save the issue on what's next? we are running in circles."*** He is right.
> This file exists so nobody re-derives any of it. **Read it before touching anything under
> `/pay`, `orders`, `payments`, or any buy button.**

---

## 0 · THE ONE-PARAGRAPH STATE

There is now **ONE payment page**, `/pay/<reference>`, that every purchase lands on: what you are
paying for → a QR **carrying the exact amount** → the screenshot (kept on screen so the reference
can be read off it) + the **last 6 digits** of the bank reference. Ten of the twelve money paths
were converted. **Four PRs are merged and live; the fifth is still open.** One of the merged ones
was **silently reverted on `main` by another session** and had to be restored — see §3, which is
the most important section in this file.

**Approved prototype:** [`prototypes/one_payment_page_2026-08-22.html`][proto] (owner: *"perfect"*).

[proto]: prototypes/one_payment_page_2026-08-21.html

---

## 1 · WHAT IS MERGED AND LIVE — DO NOT REBUILD

| PR | What it did |
|---|---|
| **#4676** | The page itself + the shop **plan** purchase wired to it. `pay` reserved as a route word in **both** halves (migration `20271154435745`, verified applied in prod **by the object**). |
| **#4685** | **Six defects in #4676**, found by attacking it. See §4. |
| **#4694** | **Six shop purchases** converted + the shared work. ⚠ **REVERTED ON MAIN, see §3.** |
| **#4699** | 🔶 **STILL OPEN** — the couple's bill, the guest buy, the booking fee, the missing alert, the money fix, and the restore of #4694. |

**Verified live** (by fetching, not by trusting a merge): the page redirects a signed-out visitor to
sign-in for a real reference **and** a fake one identically, so it cannot be used to test whether
somebody else's code exists.

---

## 2 · ⏭ WHAT IS ACTUALLY LEFT

1. 🔶 **LAND PR [#4699](https://github.com/iscasasola/setnayan-platform/pull/4699).** Auto-merge is
   armed; it has been blocked twice on conflicts (the port baseline, which regenerates on every
   merge) rather than on a failing check. **Re-check `mergeStateStatus`, not just the checks** — it
   sat `DIRTY` for hours while every check was green and nobody noticed.
2. 🔴 **AFTER IT DEPLOYS, VERIFY THE SIX SHOP REDIRECTS ARE ACTUALLY BACK** — read the deployed
   build, do not trust the merge. That is exactly how the revert in §3 was found.
3. **Finish the adversarial review of the conversion.** It ran on 2026-08-21 and **17 of its 57
   agents died on a session usage limit**, including the whole completeness pass and the
   verification for two of six lenses (`redirect-mechanics`, `notify-and-admin`). **A partial pass
   is not a clean bill of health** — those two lenses' findings were never confirmed or refuted.
4. **The two paths deliberately NOT converted**, both owner-visible decisions, neither a defect:
   - **The couple's inline checkout DRAWER.** It already mints an amount-carrying QR inline. Moving
     it means inverting pay-then-mint → mint-then-pay, which leaves an unpaid order in the admin
     queue on every abandoned checkout. Real work, real risk, little gain.
   - **Every ₱0 / comp branch.** `compOrderRowFor` stamps `status:'paid'` ⇒ SETTLED ⇒ a shop that
     just switched a feature on for **free** would read *"This one is settled — there's nothing
     left to send."* Guarded, and the guard must stay.
5. ⚖ **OWNER DECISION, small:** whether to add a CI guard that fails when a payment redirect
   disappears from a buy path. The test that did exactly that was **deleted along with the code it
   guarded** in the §3 revert — nothing protects a guard from going out with its subject.

---

## 3 · 🚨 THE INCIDENT THAT MUST NOT REPEAT — A MERGED, LIVE PR WAS REVERTED BY ANOTHER SESSION

**On 2026-08-21 at 21:27, commit `aa39dc5a5` (a guest-invitation feature) carried a tree branched
from BEFORE PR #4694 and reverted it wholesale on `main`:** all six shop redirects,
`lib/pay-path.ts` + its test, the guard `every-buy-button-lands-on-the-payment-page.test.ts`, and
the changelog fragment. For roughly a day the live site served the OLD screens while this register
and the decision log both said the work was live.

**Verified before acting:** that commit added **nothing of its own** to any of those files —
`md5` of `origin/main`'s copy equalled the pre-#4694 copy exactly. It was an overwrite, not a
disagreement, so restoring lost nothing of theirs.

### 🪤 AND THE RESTORE NEARLY REPEATED IT — this is the transferable lesson

Merging `origin/main` back in reported only **FOUR** conflicts. **Every other reverted file merged
CLEANLY — by keeping the deletion**, because the branch had not touched them since. Three more
fixes (the placeholder-is-not-proof rule, the coordinator scope, the anonymous refusal) vanished
into that clean auto-merge and were recovered only by enumerating every file the PR touched and
comparing each against BOTH sides.

🔑 **THE CONFLICTS GIT REPORTS ARE NOT THE DANGEROUS PART.** A file conflicts only when *both*
sides changed it. A file the other side REVERTED and you did not re-touch merges silently in
their favour.

**The procedure, after any merge that touches work you shipped:**

```bash
# 1 · per-file verdict against BOTH sides — never eyeball the conflict list
PRE=$(git rev-parse <your-PR-commit>^)
git show --name-only --format= <your-PR-commit> | while read f; do
  cur=$(md5 -q "$f" 2>/dev/null || echo NONE)
  mine=$(git show <your-PR-commit>:"$f" | md5 -q); old=$(git show $PRE:"$f" | md5 -q)
  [ "$cur" = "$mine" ] && echo "ok(mine)  $f" || { [ "$cur" = "$old" ] && echo "REVERTED  $f" || echo "changed  $f"; }
done
# 2 · then grep the MERGED tree for a marker of each behaviour you shipped and PRINT THE COUNTS.
#     A file can read "changed" — a hybrid — and still be missing three of your fixes.
# 3 · before restoring a file wholesale, `git log <yourPR>..origin/main -- <file>` and confirm the
#     other side's version is a pure revert, so you do not clobber their work in turn.
```

⚠ **ANOTHER SESSION WORKS THIS REPO CONCURRENTLY.** Assume it. **Re-verify any "merged and live"
claim in this corpus before repeating it to the owner** — this one was false for a day.

---

## 4 · THE DEFECTS FOUND BY ATTACKING OUR OWN WORK — each one shipped, each one caught

Every item here was in code that had already passed CI and been called finished. **Six were found
by the first adversarial review of #4676, one by CI, one by the path map, one by the review of the
conversion.** They are recorded because the SHAPES recur.

| # | What a person would have hit | The shape |
|---|---|---|
| 1 | 🚨 Approving a shop's plan payment **never switched the plan on** — the money was taken, the shop was thanked, the tier never changed. | An **admin-gated RPC called on the service-role client**: no `auth.uid()` ⇒ `is_console_admin()` false ⇒ `FORBIDDEN`, and the dispatcher swallowed it. **The "powerful" client is the one that cannot do this.** |
| 2 | An admin insight card had been **permanently empty** since it was built. | Same shape, **pre-existing**, found by the guard written for #1. Its own comment named the reason it failed as the reason it worked. |
| 3 | One stray tap wrote an unreconcilable payment **and permanently hid the form** — including when an admin asked for a better picture. | A **forward primitive with no inverse**, plus an optional field where a required one belonged. |
| 4 | The page was a **second door around the couple's coordinator money-consent gate**. | A second door onto one act must carry the same lock. |
| 5 | Every payment through the page counted **₱0 against the receiving-account cap**. | `'GCash'` vs `'gcash'` — the meter matches EXACTLY. |
| 6 | A **finished order would have shown a live QR** for money already paid. | `statusOf` invented two enum labels that do not exist and omitted the two that mattered. **Never hand-recall an enum.** |
| 7 | One plan payment **counted twice** in the admin revenue dashboard. | One transfer, two rows, two streams. |
| 8 | 🚨 Almost **every buyer** would have seen *"We're checking your payment… nothing else to do"* — thanked for money they had not sent, with the form gone. | **Eight buy paths PRE-MINT an empty `payments` row at checkout.** Ask whether the row carries a screenshot **or** a reference, never whether a row exists. |
| 9 | 🚨 Payments through the new page **notified nobody**. | The surface moved; the **guard on the old one described a property the new one had to carry**, and I orphaned it instead of re-pointing it. Caught only because CI failed for a *different* reason. |
| 10 | 🚨 On any **quoted** order the QR asked for the **wrong amount** — measured ₱1,500 against ₱2,000 owed — so the buyer underpays and the purchase can never be marked paid. | **Two copies of a money rule.** `requested_total_php` is pre-voucher; `confirmed_total_php` is already voucher-adjusted. **Fix by DELETING the copy** and calling `orderGrossOwed`, the same function the shortfall guard uses. |

🪤 **Guards that were decoration, all mine, all caught by mutation:** one counted occurrences of a
helper name (present and correct while the hook was dead); one matched a renamed variable, so it
would have passed whatever the code did. **Print the occurrence count before → after; a sabotage
that reports green usually did not land.**

---

## 5 · THE RULES THIS WORK ESTABLISHED — do not re-litigate

- **ONE column, three steps.** The first prototype put the QR in a second column; on a phone that is
  a second SCREEN with nothing pointing at it. Owner: *"it just went to the you're paying for…
  never showed the pay this exact amount and no way to get there."* A guard fails any multi-column
  grid on that page.
- **The screenshot preview STAYS on screen above the reference field**, and enlarges on tap.
- **Last 6 digits** — but a pasted full number is **kept, not trimmed**. Six is a minimum a person
  can read off a receipt, not a maximum we store.
- ⚖ **Owner 2026-08-21: a guest NEEDS AN ACCOUNT to buy.** Nothing live changed
  (`NEXT_PUBLIC_PAPIC_GUEST_BUY` has never been on) and it is what makes the page reachable for
  them: an account-less order carries no `user_id`, `orders_owner_read` has no disjunct admitting
  it, and **`orders` grants NOTHING to `anon`** — its own buyer got a 404 on the order they had
  just placed. **Settling an order that ALREADY EXISTS is untouched**; a rule about new purchases
  must never strand a debt somebody already owes.
- ⚠ **CORRECTION TO A CLAIM MADE TO THE OWNER:** the booking fee does **NOT** require the *full*
  bank reference. `requireBookingFeeReference` sets **no format and no minimum length** and says so.
  The owner's 2026-08-06 rule is that a reference is **PRESENT**. It never conflicted with the
  last-six field.
- **The amount shown must come from `orderGrossOwed`** — the same function `/admin/payments` uses to
  decide whether an order is fully paid. Anything else can disagree **inside a QR code**, where
  nobody can see it.

---

## 6 · WHERE THE PIECES ARE

`apps/web/app/pay/[reference]/` (page · actions · `_components/pay-panel.tsx`) ·
`lib/pay-path.ts` · `lib/payable-by-reference.ts` · `lib/payable-status.ts` ·
`lib/emv-qr.ts` (the QR minter — **pre-existing, live-tested on real wallets 2026-07-31**) ·
guards: `app/pay/one-payment-page.test.ts` · `lib/every-buy-button-lands-on-the-payment-page.test.ts`
· `lib/the-qr-asks-for-what-is-owed.test.ts` · `lib/admin-gated-rpc-needs-a-session.test.ts` ·
`tests/db/plan-activation-needs-a-real-admin.db.test.ts`.

**Anchors at the time of writing:** `origin/main` = `c2bd11b` · production = `daf6de9` ·
PR #4699 branch = `claude/pay-the-last-three-doors`. **Verify all four before acting on them.**
