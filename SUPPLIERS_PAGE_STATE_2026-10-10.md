# Event Suppliers page: state against today's main (2026-10-10)

Local work only. Nothing pushed, no GitHub state touched, no supabase command run. Nothing was seen in a browser.

## The four drafts (all still open drafts)
| PR | Head branch | Base | Head commit | GitHub says |
|---|---|---|---|---|
| #6422 | rd/suppliers-shell-three-modes | main | 8af5ea67b | CONFLICTING |
| #6425 | rd/suppliers-find | the shell branch | 24aaff10c | mergeable |
| #6455 | rd/suppliers-find-walk-fixes | rd/suppliers-find | 7eafb5f12 | mergeable |
| #6459 | rd/suppliers-sheet-part-2 | rd/suppliers-find-walk-fixes | d73303688 | mergeable |

## The gap (top of the stack, #6459, against main 64746f064)
- Merge-base with main: 482a671b3. The stack is 29 commits and 65 files ahead of it.
- Main has moved 524 commits and 762 files since.
- Files both sides changed: only 3, and all three are generated baselines:
  apps/web/lib/ugat/baselines/no-door.baseline.txt, apps/web/lib/ugat/screens.generated.json, apps/web/scripts/port-control-baseline.json.
- No real code file is touched by both sides.

## The merge (local, worktree wt-suppliers-now, branch rd/suppliers-on-main)
- Completed. Commit a73bb03fced79ae9dcecf59dbdb69a4420f5b3df (a merge of origin/rd/suppliers-sheet-part-2 onto main).
- Conflicts: only screens.generated.json and port-control-baseline.json. Took main's version, finished the merge, regenerated both. no-door.baseline.txt merged by itself.
- Regenerated from apps/web: port:baseline and ugat:screens (changed, see below); root-map, lint:no-card and exposure:baseline reported no change.
- The only new thing the generators show is the dev lab page /dev/suppliers-lab as a "no door" screen. The stack's own no-door baseline already lists it with a reason (internal dev page). Nothing else new. Reported, not a surprise.
- No real-code conflicts, so zero files needed a builder's judgement.
- CHANGELOG.md and STATUS.md untouched; the stack's four changelog.d fragments came in cleanly.

## Checks on the merged tree
- Unit tests: 463 test files (every test file the four PRs added or changed, plus every test under apps/web/lib mentioning supplier, vendor-bench, shortlist, numbers-carry-commas, or the word "port") = 5194 tests, 5194 pass, 0 fail. the-lab-never-ships.test.ts was run separately: 1 pass.
- node scripts/lint-port-no-lost-controls.mjs: passes (431 routes, 1628 controls, 5984 blocks, baseline ref 64746f064).
- Full tsc under the machine lock: rc 0, empty log. Run once.
- Nothing needed fixing. I changed no code.

## The plan table (plan PR numbers)
| Piece | State | Where | Waiting on the owner |
|---|---|---|---|
| PR0 Foundation: ActionButton, Count, Fill, tones, Ugat nodes | Built (ActionButton and Count were already on main; Ugat nodes are NOT promoted: six tables sit as one-line baseline entries in apps/web/tests/db/ugat-concept.baseline.txt) | apps/web/components/action-button.tsx, count.tsx | nothing |
| PR1 Shell: Find / Build / Booked segmented control, date-place line, cart peek | Built (#6422) | vendors/_components/services-takeover.tsx, suppliers-mode.tsx, date-place-line.tsx, build-cart.tsx, lib/suppliers-shell.ts | side-by-side look at 375 and 1280 |
| PR2 Find: ring rows, state words, thumb bar, service cards, verbs by step, More to compare | Built (#6425, #6455 walk fixes) | shortlist-categories.tsx, find-thumb-row.tsx, lib/supplier-card-verbs.ts, bench-service-card(s).ts, supplier-find.ts | deviations listed in the status file (see below) |
| PR2 Supplier sheet | Built (#6459): photos, rest of portfolio, Follow, Share, sheet for a More-to-compare card | supplier-sheet.tsx, lib/supplier-sheet(-read).ts | deviations (below) |
| PR2 "Add your own" (screen part) | Not started | none yet. Needs NewManualVendorModal in steps with the twin match, record sheet, local insert into the bench | approvals 10 and 11 |
| "Add your own" migration + fee-leak check | Not started | needs event_manual_vendors.leak_match_vendor_profile_id and platform_settings.fee_leak_price_tolerance (no number invented), Ugat joint promotion | approval 11, and a tolerance number from the owner |
| PR3 Build: This build, All builds carousel, twin detection, Save / Save as new, Book this build | Not started (the old BuildCompare / build-locked still run under the Build segment) | plan only | none yet |
| PR4 Booked and Budget: Waiting for their yes, next step per row, room size, Pay sheet, meters | Not started (old team-rows.tsx still under Booked) | plan only | none yet |
| PR5 Date and place sheets, Help me choose, tour | Not started (customer_suppliers_v2 tour not in lib/tours.ts) | plan only | tour flag is the owner's call |
| PR6 Booking-fee rules, whole app | Not started, held until BOOKING_FEE_RULES_AUDIT_2026-10-07.md exists | plan only | the audit |

Deviations the status file (SUPPLIERS_BUILD_STATUS_2026-10-08.md) asks the owner to rule on:
- Sheet: photos are the supplier's published photos, not split by event; no "N yrs, N events" line, Verified is the only badge; a self-added supplier's card still opens their own record; no Share or photos for a shop whose name is withheld; reviews not filtered to the category; the desktop inspector column is no longer opened from a card here.
- Service cards: drawn in the ServiceCardFace shape, not the component; "No price recorded" for a self-added supplier with none; 14 px card radius.
- More to compare: a quiet Save sits beside Ask for a quote; a quiet "See all ‹Category› with filters" button was kept.
- Verbs: Nudge sends one sentence in both states; Connect stays as an extra grey button until the record sheet exists; booked with nothing due says "Payments"; marketplace supplier booked with no price says "Set price".
- Debt noted, not fixed: Save and Remove on a card still refresh the whole page.
- Also open from the plan: a never-planned category cannot stick today (choose a/b/c in the plan, (b) recommended); weddings should honour their onboarding picks.

## The approvals pending, verbatim from SUPPLIERS_PAGE_CHECK_2026-10-07_fable.md ("Recommendations (one word each)")
The document numbers them 1 to 10 with an 8b; items 11 and 12 follow it. I list 1 to 10 including 8b, then 11 and 12 for completeness.

1. **Retire the five-row "Your planning" menu**; the page is the nine steps in order, no navigator. (Yes / No)
2. **The second line of the page is "date · venue"**, both editable in place; the Maker's Details tool loses both. (Yes / No)
3. **"Cover your event" shows the shipped starter ring for the event type**, the rest behind one "More categories" dropdown — not the 70-row wall. (Yes / No)
4. **Compare plans opens in place** (sheet/panel), not as a collapsed section at the bottom. (Yes / No)
5. **Chats get a section on the page** (3 latest threads); the `/messages` page stays as the full inbox. (Yes / No)
6. **Hairline rows, not boxed cards**, for suppliers — as the approved 2026-10-01 frame drew them. (Yes / No)
7. **"Build" is the word** for a combination (not "Picks"), per today's phrasing. (Yes / No)
8. **Chats is not a section**: the conversation hangs off the supplier's row; the shell's Messages icon is the only inbox door. (Yes / No)
8b. **The Maker's shape for Suppliers**: Find · Build · Booked as the one segmented control; a category takes the screen; the cart peeks on Add to build. (Yes / No)
9. **Appearance = Light · Dark, in account settings, one dropdown** (owner 2026-10-07: *"keep it simple and have our light/dark theme"*). This supersedes the 2026-06-04 light-lock: re-enable Dark by the small revert `theme-provider.tsx` describes (`users.theme_preference` + `updateThemePreference` are dormant and ready; the `html.dark` tokens exist) and add the dropdown to account settings. Universal, per user, never per event. No event-colour theme on the dashboard (owner 2026-10-07: *"remove the adapt to event colors"*); the mood-board palette stays the Hub's. (Yes / No)
10. **Add your own = check Setnayan first, then the link, then a note** (owner 2026-10-07: *"they must agree to complete these information before they set the price. let us give them a form to fill up? or a link they can send to a vendor?"*). Typing a name searches Setnayan in that category (owner 2026-10-07: *"ask if there are similar suppliers with that name on that category that already exist"*): matches appear under the field as "Is it one of these? · already on Setnayan" with "Yes — Inquire" (owner: *"if it is same, they can just send inquire"*): one tap sends the shipped Ask-for-a-quote to the real shop, which lands under the category waiting for its quote, instead of a manual twin; "Not them?" continues the manual add. If not found: name · what they do · contact, then **their claim link as a QR or link** (the shipped `claim-link-share.tsx` + `qr-actions.tsx`: Download · Write to NFC · Copy link; owner: *"not by email but by QR Code or link"*); the supplier fills their own card and price, and the couple's record seeds that first card (2026-09-20 (g)). Until they join, what the couple writes is a note marked "your record, not a booking" (2026-09-20 (d), inert by guard). The first add is a four-step walk on a phone; editing is the form. (Yes / No)
11. **Attribution on a manual add whose shop already exists** (owner: *"does our ruling of checking if the vendor exists still adapt here… we saw them first"*). The shipped rule (`lib/booking-fee-gate.ts` + SQL `booking_fee_is_sourced_surface`): sourced = `explore · search · shortlist · first_pick · favorites · auto_build · editorial · influencer` (billable, 5% then 1%); `host_manual · invite_claim · degree · website` = import, free forever. Ask for a quote from a category → sourced; Add your own → import; the supplier claiming via the link → import. **Gap:** `vendor_profile_views(event_id, source)` records "we saw them first" but nothing reads it for the fee. Proposed rule: a manual add that matches an existing shop is sourced only if this event viewed or inquired that shop through a sourced surface before; otherwise import. One rule in the gate + its SQL mirror, held by the existing drift test. (Yes / No)

## Can it be seen without signing in?
Yes, for Find and the supplier sheet. The lab page is /dev/suppliers-lab (apps/web/app/dev/suppliers-lab/). It draws the real shell, the real Find body and the real supplier sheet on fixtures, no sign-in, no database. It 404s in production. Run the dev server with NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED=true NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=lab-no-database. Options: ?open=catering, &fail=1, &sheetfail=1, &slow=1, &empty=1. Build and Booked bodies are not on fixtures (per its header it draws the shell, Find body and sheet); a lab for those needs fixtures for the build picks and booked rows.

## Not verified
- Nothing was seen in a browser. No page, no lab, no screenshot.
- No next lint run. The 33 CI source guards and the other repo guards were not run, only lint-port-no-lost-controls.
- The check document's table (items 1 to 18+) was not re-measured against the merged code beyond the plan-piece status above, which is from file existence and the status file, not from reading each component.
- GitHub's "mergeable" flags are as of this run; main may move again.
