# The live two-sided test — one page, owner-driven (2026-09-10)

> **Extends [`TEST_SCRIPT_E2E_2026-07-27.md`](TEST_SCRIPT_E2E_2026-07-27.md) — do not re-read
> that whole file.** Its five accounts, ground rules and cleanup SQL still apply. This page adds
> only what changed for the owner's own goal, in his words (2026-09-07): *"what i want to do is
> you be a vendor/user with an event. then you communicate with me as the other end… so it will
> be us 2 trying the app… i want to prove and experience it."*
>
> Code-repo companion: `build-sessions/PROVE-THE-FLOW.md` on `origin/main` — the engineering
> resume path. This page is the **owner's** page: what to prepare, what to tap, and what each
> tap should show. **No session signs in as a test account and no session taps anything below —
> the owner drives both sides at his own keyboard.** A session's job is read-only: watch
> production after each tap and say in plain words what happened.

---

## Before you start — five things must be true

Round 1 cannot be run honestly until all seven of these show **MERGED**, and
`https://www.setnayan.com/api/health`'s version has every one of their merge commits as an
ancestor. Ask whichever session is driving this page to re-check with `gh pr view <n> --json
state,mergedAt` before you sit down — the plan is a living register, not a fixed date.

| # | what breaks today if it hasn't landed | session |
|---|---|---|
| 1 | Publishing a card still demands the Setnayan gift, which you ruled optional | A1 (#5373) |
| 2 | "🔒 Lock this deal" in chat can lock with no price and no booking | A2 |
| 3 | Accepting a quote just says "Accepted" and stops — no next step | A4 |
| 4 | The shop's two cards show no name, only their category | B1 (#5387) |
| 5 | Changing the price after a lock replaces the number instead of showing both | B2 (#5390) — **you look before this one merges, it's money** |
| 6 | A locked shop doesn't sit first in its group on your list | A5 |
| 7 | A stranger can email/call the shop straight off its public page | #5404 |

If you run the walk before all seven land, you will simply rediscover these same problems one
tap at a time — useful as a sanity check, but it is not "the test ran."

---

## Prep — your own data, before you tap anything

Do these once, before round 1:

- [ ] **Rename the supplier shop.** Its public name currently ends in "(FIXTURE)" — give it a
      real name.
- [ ] **Give its two service cards real titles.** They currently show only their category
      (Live Band / Host-MC) because nobody has typed a title.
- [ ] **Add a cover photo to each card.**
- [ ] **Add a GCash QR** to the shop's payment methods (there are none today — nothing for a
      couple to pay *to* yet).
- [ ] **Leave the Setnayan gift at "no"** on both cards — the credits it promises don't reach a
      couple until a later session (C1); testing "yes" today would show a number that never
      arrives.
- [ ] **Sign in as the couple account (`testnayan4@test.com`, password `12345`) and give its
      wedding a date.** It has none yet.
- [ ] **Do not use your own account (`iscasasolaii@gmail.com`) as the couple.** It is
      `is_internal = TRUE` — every paywall silently passes on it, so nothing you see would prove
      the test worked for a real couple. Use it only as the supplier if you'd rather test on your
      own shop than the fixture — but then you are testing chat and locking, not payment.

**The two accounts for round 1:**

| side | sign in as | what it holds |
|---|---|---|
| Supplier (you) | `testnayan2@test.com` / `12345` | the renamed band shop |
| Couple (also you, second browser or private window) | `testnayan4@test.com` / `12345` | `Ana & Miguel`, now dated |

---

## The walk — one tap, one check

Do these in order. After each starred tap, whoever is watching production will tell you in
plain words whether the database agrees with what the screen showed — say so before you move
to the next tap.

**The tool for that watching** (code repo, read-only, never run on its own):
`apps/web/scripts/prove-the-flow-watch.ts` — `SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… npx tsx
scripts/prove-the-flow-watch.ts --vendor-slug=<shop slug> --event-id=<couple's event UUID>`. Run
it again by hand after each tap; add `--save=/tmp/t1.json --diff-against=/tmp/t1.json` from the
second run on to catch a price silently replaced instead of shown beside the old one (B2's
exact failure shape). It prints six lines — card, inquiry, chat Deal, quote, lock, price change
since lock — each in the same plain words this page uses, so a mismatch against the screen is
obvious without reading SQL.

1. **[Supplier] Publish a card with a price and the gift left at "no".** ★ The card publishes.
   Nobody demands a gift value. *(Proves A1.)*
2. **[Couple] Find the shop in the marketplace and open its page.** The card shows its new
   title and photo, not its category. *(Proves B1 + the marketplace fix from the next wave —
   note if the title is still missing, that's a separate, later fix, not a blocker.)*
3. **[Couple] Send an inquiry.** No email or phone number is offered anywhere on the page.
   *(Proves #5404.)*
4. **[Supplier] Accept the inquiry, then reply in the thread.** This has never happened in
   production before — the first supplier reply, ever.
5. **[Both] Strike a deal in chat (a discount, an add-on, a freebie) BEFORE the supplier sends
   a formal quote, and have the other side accept it.** ★ **Expected: no Lock button appears.
   You (the couple) read "This deal has no quoted price yet, so it can't be locked. Ask the shop
   to send their quote first"; the supplier reads "…Send your proposal first". Nothing anywhere
   may say "Deal locked" or "frozen".** *(Proves A2. If a Lock button appears on that deal, or
   anything says "locked," that session's fix hasn't landed — stop and say so. Once the quote is
   in, a NEW deal agreed on top of it is the one that shows Lock, with its price on the button.)*
6. **[Supplier] Send a real proposal / quote with a price.**
7. **[Couple] Accept the quote.** ★ **Expected: the page tells you plainly that accepting isn't
   booking — it points you to press Lock to actually book the shop.** *(Proves A4. If it just
   says "Accepted" and stops, that fix hasn't landed.)*
8. **[Couple] Press Lock on that supplier.** This asks the shop to confirm — it is a handshake,
   not an instant booking.
9. **[Supplier] Agree to the lock.** The booking is now made. No fee is charged — this shop's
   first five bookings are free, and the fee isn't switched on yet, so don't expect a bill.
10. **[Couple] Look at your suppliers list.** ★ The locked shop sits first in its category, not
    sorted alphabetically or by date. *(Proves A5.)*
11. **[Both] Change the agreed price after the lock — in chat, strike a NEW deal on the quote
    (say a ₱15,000 discount), the supplier accepts it, and you (the couple) press Lock on it.
    Then open your Budget and tap that supplier's row open.** ★ **Expected, with ₱100,000
    agreed at the lock: the row's Budget reads ₱85,000, and under "Changes you both agreed" you
    see three lines — "Agreed price before changes ₱100,000", "New deal agreed in chat (price
    lowered) −₱15,000", "Agreed total now ₱85,000". Never one number that silently replaced the
    other, never a negative bill, and no delete button on the change.** The watcher's line 6
    should say the same three numbers. *(Proves B2 — you will have already looked at this before
    it merged, so this step should hold no surprises.)* ⚠ Known, not a new defect: your
    suppliers list and the event home still show the ₱100,000 agreed at the lock — only the
    budget and that supplier's own page under your suppliers show both numbers.

---

## What "the test ran" means

Every starred step above has a production row behind it — a chat message, a proposal, a lock,
a change-of-price entry. **"The test ran" means each of those rows exists and matches what your
screen said**, not just that you tapped through without an error message. If a screen and the
database disagree — the screen says "locked" but no lock row exists, say — that is exactly the
kind of silent gap this whole test exists to catch, and it gets written up as a new, named
defect rather than waved past.

## Round 2 — later, once you've seen the "add to your event" drawing

Round 2 tests the missing step: adding a shop to one of *several* ongoing events on purpose,
not as a side effect of messaging. It needs a couple with two ongoing events — add a second
event to `testnayan3@test.com` or `testnayan4@test.com` before you run it. Its own script gets
written once you've seen the corrected drawing and the build for it (session D1) has landed.
