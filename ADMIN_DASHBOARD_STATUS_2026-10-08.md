# Admin dashboard — SAVED, PAUSED (2026-10-08 ~07:00 PHT) · resume at Admin build time

Owner, verbatim: *"save what we have planned for admin dashboard and we will return to it during admin build time"* · *"stop the build for admin"* · *"we will do this when we start with admin"*.
Build order (locked 2026-10-08): Event Hub → couple's Suppliers page (+ Budget + launch offer) → supplier dashboard → **Admin (this)**. Nothing in Admin is approved and nothing is built.

## Where we are
| Piece | State | File |
|---|---|---|
| Audit of every /admin page vs the rules + coverage check | done (pass 2) | `ADMIN_DASHBOARD_AUDIT_2026-10-08.md` |
| Redesign doc — where things go · blocks keep/move/merge/remove · data exists vs NEW · owner questions · A-PR build plan · Connections to the supplier plan · supplier-design disconnects · Map · 10-job tap table · Coverage with taps column · the owner's 22 jobs · everything you can enter | done (pass 2) — **still describes refunds** (see "Not finished") | `ADMIN_DASHBOARD_REDESIGN_2026-10-08_fable.md` |
| Phone prototype, 66 frames + dark (01–35 core · 36–38 dark · 39–66 the 22 jobs) | done; **pass 3 (no refunds) applied to the prototype and its screenshots, committed as WIP** | `prototypes/admin_dashboard_2026-10-08_fable.html` + `prototypes/admin_dashboard_2026-10-08_fable/` |
| Code reads the design was built from | saved | `~/Documents/Claude/Projects/controller-2026-10-08/admin-reader-*.md` (three files; outside this repo) |

## The shape (what the owner was shown)
Bar: **Work · Money · People · More** + "Search anything" in the thumb zone. **Work** = the ONE Needs-action list (a Next card, then everything waiting, grouped by job, actionable in the row). **One confirm sheet** for every money / for-everyone / irreversible action (what happens · to whom · typed where needed · Undo). **More** = nine headings, one per job: Pricing & offers · Content · Templates · Media · Growth · Numbers · Privacy · Set up · Admin. Rule: every screen and control ≤3 taps from Work (the designer's table says all pass; the controller has NOT independently re-counted it).

## The owner's 22 jobs (all drawn; doc §12 has frame · taps · exists/NEW for each)
1 more categories · 2 new events (event types) · 3 new reveal / Event Hub items · 4 promo for users and suppliers (money off) · 5 complimentary services · 6 fix a user's/supplier's issue myself · 7 website performance · 8 privacy · 9 reports · 10 account deletions · 11 bans · 12 freeze · 13 confirm payments that release services · 14 new articles · 15 rotating backend data · 16 change prices for events and suppliers · 17 new video backgrounds · 18 AI auto-assists · 19 other data inputs · 20 promotions (visibility) · 21 launch offer for suppliers AND users' events · 22 let a user reuse a service not used on an event.

## Owner rulings given during the design (all in DECISION_LOG 2026-10-08)
- Job 22: *"for example a user created an event and ordered papic, and it was never used. we can allow them to transfer that to their next immediate event created"* · *"we wait for their next event"* — no admin pick; an unused service waits for the user's next event.
- *"there is no refund. only virtual credits converted to papic if they cannot use the service they got."* — load-bearing; the app and its public Refund policy / Terms still say otherwise.
- *"follow the same rule that can access everything in less than 3 taps and all the other rules"*.
- Chat: three places (Samahan members-only · events · normal chat) — separate row; not part of this design.

## Open questions for the owner (recommendation first) — ask when Admin resumes
1. Two-admin approvals → **Delay** (one admin + typed confirm + 24-hour window). Today a price change, a comp above ₱10,000, a receiving-account change, promote-to-admin etc. wait for a second admin.
2. Users' side of the launch offer → **Credits only** (the 50 Papic credits per booked event; nothing else was decided).
3. "Rotating backend data" → **Keys/secrets** (not demo data).
4. Edit from the phone → **Yes** (lifts the 2026-08-26/27 "the phone answers, it does not edit" rule).
5. Launch offer "end of that week" → **Platform week** (Sunday), one date for every supplier.
6. NEW from the no-refund ruling: the conversion rate (pesos paid → Papic credits; must come from the catalogue price of a credit, never a typed number) · what counts as "cannot use" and who decides · whether money paid directly to a supplier is outside the rule.

## Not finished (do these first on return)
1. **Pass 3, docs half.** The no-refund ruling is applied to the prototype and screenshots only. The redesign doc and audit still list Refund actions (Money segment, the refund confirm, tap table / Coverage / 22-jobs / A-PR rows, owner question 1's refund case). Replace with **Convert to Papic credits**; add the "What the no-refund ruling touches" table (`order_refunds`, the `/admin/payments` refund action, `approve_large_refund`, refund paths in disputes / force-majeure / event-deletions / Music Maker, the public `app/(shell)/refunds/page.tsx` and Terms) with each surface's fate, and an A-PR for it. Then re-check that the prototype and the docs say the same thing.
2. The controller's independent check of the ≤3-taps column and of the Map (every tap lands).
3. The 10 disconnects the designer found in the SUPPLIER dashboard design (redesign doc §8) — go through them BEFORE the supplier build starts (e.g. the launch-offer read vs "nothing new", S-PR9 with no dependency on the Admin launch-offer PR, a typed "50").
4. Owner's look + "ok admin" on the prototype; only then the A-PR builds (Opus, draft PRs, 375 side-by-side each).

## New work the design needs (nothing exists in code today)
The launch-offer page and counter (the designer's smallest proposal: columns on `promo_free_windows` + a waived marker) · Freeze an account / hold an event (shop suspend exists) · move an unused service to the next event · Convert to Papic credits (replacing refunds) · an article editor · adding Event Hub video loops and reveal openings (code-only today) · the "Ask" door. Each is marked NEW in the doc.
