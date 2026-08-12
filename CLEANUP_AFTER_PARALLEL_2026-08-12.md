# Cleanup after the five parallel sessions · 12 August 2026

> Post-merge integrity audit: 6 auditors + 6 adversarial passes + synthesis, against **current
> main and the live production database** — never against the pull requests.
>
> **VERDICT: nothing was clobbered.** Across nineteen merges, no fix was reverted, no file was
> lost, five separate rewrites of the same permission baseline all survived, and the one merge
> resolved by hand kept BOTH sides. All 15 migrations reached prod, verified object by object.
> **The risk you were warned about did not materialise.**
>
> The real cost was **one** cross-session collision and **one habit**. See §0.

---

## 0 · What running five at once actually cost

**The one true collision — still open.** The Papic one-product session retired a price rung at
02:48. Twenty hours later the truthfulness session edited the exact price map pointing at that
rung — for a *different* card — and did not re-check the rest of it. **A paid Papic camera now
reads ₱0 on the main wedding sign-up funnel.** Confirmed live. One card, one funnel, caught by
audit rather than by a customer.

**The habit, which is the bigger bill and is NOT a parallel problem.** Several sessions declared
an item fixed after fixing *the one screen they were looking at*, leaving the same wrong thing
standing on a sibling screen — the duplicate livestream card, the venue-only photo-wall wording,
the photo-screening bypass on a second message store. **That would have happened running them
one at a time.** It is a review problem: *when you fix a screen-shaped bug, sweep every screen
with that shape.*

**A structural hazard worth naming:** retiring a price rung silently renders its card as **free**
rather than failing. It happened twice in one wave. Nothing anywhere stops the next retirement
doing it again — hence the guard in Session A below.

---

# CLEANUP SESSION A · What a customer can see right now
**~1 session · everything here is live on the site today**

```
[PASTE THE SHARED HEADER FROM SESSION_PROMPTS_2026-08-11.md FIRST]

TASK: seven customer-visible defects left by a five-session parallel wave. All verified against
current main and live prod on 2026-08-12. Re-verify each before editing — the tree moves.

1. A PAID PAPIC CAMERA READS ₱0 ON THE SIGN-UP FUNNEL. (Highest priority — money.)
   onboarding-pricing.ts:75 maps papic_seats → PAPIC_CAMERA_MINI_DAY, which is is_active=false
   in prod (title suffixed 'superseded 2026-08-11'). v2-catalog.ts:225 filters to active rows,
   so the degrade branch at onboarding-pricing.ts:310-316 returns 0. The map's own comment at
   :72-75 still claims it points at the cheapest live rung.
   FIX: point it at the rung actually on sale.
   THEN ADD THE GUARD THAT MATTERS: a check that FAILS when any card maps to an inactive
   catalogue code. Nothing ties these values to is_active today, and this exact defect has now
   occurred three times (live_background, guest_stories, papic_seats).
   ⚠ guest_stories also renders ₱0 and is accidentally CORRECT — Stories is owner-locked free.
   Do not "fix" it into a price. The documented remedy is dropping the key from INAPP_KEYS,
   as live_background already was (onboarding-shell.tsx:1169-1170).

2. THREE PUBLIC PAGES STILL SELL THE LED BACKDROP, WITH A PRICE.
   apps/web/public/keynote/components/keynote-ternus.jsx:604, keynote-vendors.jsx:510 and :530,
   apps/web/public/proto/onboarding-2026-06-01.html:1058/1082/1089. They advertise
   "Pailaw · LED background loops — from ₱6,000 — 8K, USB-deliverable" and an LED item in a
   ₱2,499 bundle. Routed live by next.config.ts:503-505; robots-disallowed but returning 200 —
   so people reach them, only search engines do not. These are the links sent to partners.
   ⚠ Neither LED-removal PR touched public/ at all. Strip the LED lines or take the decks down.

3. THE SIGN-UP FUNNEL SELLS THE LIVESTREAM AT ₱2,999 WITH NO "IN BUILD" WARNING, and mints a
   real order. Your own price list marks Live Studio as still being built. Production has never
   run a livestream. Show the same chip, or stop it minting an order.

4. TWO LIVESTREAM CARDS, ONE LABELLED FREE, STILL SIT SIDE BY SIDE — the exact thing reported
   fixed. Only the services suite screen was corrected. The couple's vendors tab and the
   memories hub still show "Live Studio Cast" ("free with a single camera") beside "Live
   Studio", both leading to the same setup. Route both through the same check the suite uses.

5. A VENDOR CANNOT WITHDRAW A DRAFT VERIFICATION APPLICATION — pressing Withdraw puts a raw
   database error in the page address. PRODUCT CALL FIRST: decide whether a vendor may withdraw
   an unsubmitted application, then make the button do it (or remove the button).

6. A GREEN "BOOKING CONFIRMED" BADGE SITS ABOVE A MESSAGE SAYING IT IS NOT CONFIRMED.
   The body text is now correct ("a couple marked you as booked — that is their side of it");
   the badge above it was not updated. Display text only, ten minutes.

7. COPY LEFTOVERS (an hour for all four):
   - The "Notify me" button now succeeds with "we've noted your interest" — but the BUTTON
     still promises an email nothing sends.
   - The guest event hub bookmark prints the brand name twice. This was introduced by the fix
     that gave it a title: it copied a neighbouring page that already appended the brand.
   - The reel form says a copy is saved to the event gallery; the Galleries screen shows no reels.
   - The livestream control room still offers a "live background" screen mode nothing plays.
```

---

# CLEANUP SESSION B · Locks that are only enforced by the screens
**~1 session · nothing visible today, all of it real**

```
[PASTE THE SHARED HEADER FROM SESSION_PROMPTS_2026-08-11.md FIRST]

TASK: four places where a rule exists only in the app layer, plus the one thing that must be
fixed before bot protection is ever switched on.

1. 🔴 DO THIS BEFORE ANYONE FLIPS BOT PROTECTION — THE FORGOT-PASSWORD PAGE LIES.
   forgot-password/actions.ts:44-54 branches only on the rate-limit error; everything else is
   console.error'd and redirects to ?sent=1. The bot-check field deliberately submits an EMPTY
   token when the script is blocked, errors or expires (turnstile-field.tsx:85-103) and nothing
   disables submit. So a person with an ad blocker or a strict corporate network is told
   "a reset link is on its way, check your inbox and spam" and NO EMAIL EVER ARRIVES.
   This is the one page a person only reaches because they are already locked out.
   Compare login/actions.ts:85-89 and signup/actions.ts:230-234, which surface the real message.
   ✅ Confirmed inert TODAY: live /login and /forgot-password contain zero challenge markup, so
   the site key is unset in prod. Nothing is broken right now — this is a pre-flip blocker.

2. A COUPLE OR COORDINATOR CAN PUSH A FLAGGED GUEST MESSAGE ONTO THE WALL.
   Guest messages and guest columns carry the same "has this been screened" verdict as photos.
   The photo one was locked in this wave; these two were missed. A couple or coordinator can
   mark a flagged message clean and then get it onto the venue wall and the public page — the
   code meant to stop this checks the verdict the same person just changed.
   Lock both verdict fields exactly the way the photo one was locked.
   🔑 THIS IS THE SIBLING-SCREEN HABIT — the fix was correct and simply not swept.

3. THE ADDRESS RULES ARE ONLY ENFORCED BY THE SCREENS, NOT BY THE DATABASE.
   Anyone with a free account, writing to the database directly rather than through a screen,
   can point their own event page at an address a real couple's printed invitations already
   use — including an old address that is supposed to be forwarding to them.
   vendor_profiles.business_slug: authenticated=SIU, owner policy FOR ALL on user_id=auth.uid(),
   and NO check/trigger on INSERT (guard_business_slug_immutable is BEFORE UPDATE OF only).
   events.slug: anon=SIU/authenticated=SIU, authenticated_can_create_event WITH CHECK TRUE,
   couple_can_update_event has no with_check on slug. users.slug: authenticated=SU.
   Zero triggers on either table mention slug — only shape CHECKs. The entire hold lives in
   business_slug_is_available (reached only when the slug IS NULL) and in TypeScript.
   FIX: move the rules into the database so they apply however the row is written.

4. RENAMED ADDRESSES FORWARD IN THEORY ONLY — IT HAS NEVER ONCE RUN.
   Four importers of the forwarding module, all route files, NO test file. Every existing
   "test" is source-text regex. Prod has exactly one forwarding record and its target event was
   deleted, so fetching the old address returns 404 — the correct answer for a deleted target,
   which discriminates NOTHING. Untested: chained renames, the fail-closed branch, the closed-
   vendor filter, the public-profile disclosure gate.
   FIX: write tests that actually perform a rename and follow the link, then do ONE real rename
   end to end in prod and open the old address yourself.
   🔑 The two-year window is real and read from one place — that part is genuinely good. It is
   the forwarding itself that has never been exercised.
```

---

# CLEANUP SESSION C · Ten-minute items
**~half a session for all of it**

```
[PASTE THE SHARED HEADER FROM SESSION_PROMPTS_2026-08-11.md FIRST]

1. THE PHOTO WALL IS STILL "VENUE ONLY" WHERE AN AI READS IT. The couple's screen was fixed;
   the public machine-readable catalogue still says the wall is "displayed at the venue".
   That is what an AI assistant quotes when someone asks about Setnayan.
   SEPARATE, AND A PRIVACY DECISION: a couple who switches the guest-phone mirror OFF still
   finds the same photos in the public after-event recap. Decide whether the switch should
   reach the recap too.

2. THE ADMIN CORRECTIONS SCREEN PROMISES AN INTAKE THAT DOES NOT EXIST. It reads "verified
   vendors file these from their My Shop profile." No vendor can file one — there is no button
   anywhere. Fix the sentence, or build the intake if you want it (a session).

3. A RETIRED ADDRESS IS HELD FOR TWO YEARS WITH A REASON THAT IS NOT TRUE. A word is refused
   with "that address was used before and still sends visitors to its old page." It sends
   nobody anywhere — the target was deleted. The window was just lengthened from three months
   to two years, so the untrue lockout now lasts eight times longer. One real word today.
   FIX: only hold a word if the page it forwards to still exists.

4. INTERNAL ENGINEERING MAPS STILL DESCRIBE DELETED THINGS AS WORKING. The two files a future
   session reads as its inventory still list an LED save route, an LED page and an LED table as
   "Operational". All are deleted. Nothing checks these files, so they stay wrong until someone
   trusts them.

5. ONE NOTE ON THE ORDER-LEDGER CHANGE THAT MERGED (#4368): a couple can write three of their
   own order-history entries. The entry type and the order owner are locked down, but the
   AMOUNT and VOUCHER fields are not — a couple could write a cosmetically wrong figure into
   their own order's history. It cannot affect money or unlock anything, because nothing
   machine-readable reads those three entry types. Worth closing, not urgent.
```

---

## What is CONFIRMED GOOD — do not re-check any of this

Proven by attacking it against the live database, not by reading the fix.

- **A couple can no longer put words in a supplier's mouth in chat.** The attack was run against
  prod and refused. The system works out who is speaking instead of believing the browser, and
  a supplier's name can no longer be unmasked by a faked reply. *(Session 2 — the one with no
  fallback. It holds.)*
- A free account cannot turn itself into an admin, by any route.
- A shop cannot award itself the "Setnayan checked this" mark; changing its founding year
  correctly drops the mark.
- A supplier cannot mark their own payout destination as checked. **The safe default was flipped
  too — that was the half that mattered**; a permission change alone would have quietly
  auto-approved everyone.
- An uploader cannot pass their own photo through the nudity screen, on both main photo stores.
- A verification application cannot be created already approved.
- **Every database change reached prod** — checked object by object. Repo and prod both hold
  1,114 migrations with the same newest one.
- **The LED backdrop is genuinely gone from the product** — no route, page, bundle membership or
  sellable item, in either language. **Hiring an LED wall from a real rental vendor still works
  and was not over-removed** — that path was improved.
- The photo wall is honestly described to the couple and has a **real** switch for the
  guest-phone mirror, honoured on all three guest surfaces including the refresh feed, failing
  closed if unreadable.
- The other truthfulness fixes are live: livestream priced right, photo wall no longer "in
  build", gift page no longer claims guests can see it, reel form no longer promises a server
  render, the stream warning says only what it knows, two dead vendor price rows off.
- Bot-check plumbing is wired on **nine of ten** paths, the tenth a documented exception landing
  on a working screen. The security header now allows the challenge window.
- The reserved-word list matches prod exactly — all 76 words, **generated from the real pages**,
  so a new page cannot be forgotten.
- The two-year forwarding window is in the database and read from one place, not typed twice.
- The shop-address correction is admin-only and properly locked.
