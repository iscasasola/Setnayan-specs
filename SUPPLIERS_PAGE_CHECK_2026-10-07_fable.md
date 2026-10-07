# Suppliers page — check before design · 2026-10-07 (Fable)

**Owner's brief, verbatim (2026-10-07):** *"right now you have hidden the bench the compare budget, and everything else in the suppliers and just showed suppliers that are booked. we want to create a uni screen interface that adapts to both desktop and mobile view. which handles everything we have and still keeps it un clumped. i want a uniscreen that can help them navigate properly to all their categories, find suppliers, compare combinations, add supplier manually, chat with suppliers, and still make it look legible to the eyes. with animation"*

**Owner, later the same day, verbatim — the journey the page must follow:** *"1. they start looking for categories and search or add manually their suppliers · 2. they get to talk and inquire services · 3. they accept their price proposal · 4. the can start creating builds. to compare combinations of each vendor they get · 5. compare multipl builds · 6. book a supplier's service · 7. see all booked services · 8. see the budget on where they are · 9. see if the date becomes more specific. and location also becomes more specific."* And: *"once they have locked vendors. this data can be used across the event."*

**How this was measured.** The live site (`www.setnayan.com`) at 375 px, signed in on the owner's event (looked only; nothing pressed except the "Saved" row, which only scrolls), plus `origin/main` at `fe86472846` read from a detached worktree. Anchors are file:symbol, never line numbers. Screenshots: `prototypes/suppliers_page_live_2026-10-07-*.jpg`.

## Verdict

**The complaint is accurate, and the cause is one CSS class.** The page opens to the booked rows and a five-row menu. Everything else — the bench, Picks, the six money figures, Plans, Payments — sits in one `#team-find-area` that is `hidden lg:block` and is not even mounted on a phone until a menu row is tapped (`services-takeover.tsx:ServicesTakeover`). When it does open it is one tall scroll, with Payments and Your plans collapsed at the very bottom. Three jobs leave the page entirely: **Find a supplier** (`/vendors/categories`), **Budget** (`?part=budget`) and **Chats** (`/messages`). On a computer it is the same phone column plus a 380 px rail. No design in the corpus draws a one-screen page; the nearest approved pieces are listed below and the prototype assembles them.

## The table

| # | Item | Where it was decided | Shipped? (origin/main anchor) | What is wrong or missing |
|---|---|---|---|---|
| 1 | Suppliers = booked rows, one next step each, one "Find a supplier" button | DECISION_LOG 2026-10-01 (simple phone app) | **Yes** · `lib/your-team-rows.ts:teamRows`, `team-rows.tsx:TeamRows` | Rows ship as boxed cards; the approved frame draws hairline rows. A supplier who is only saved returns `null` from `teamRowOf`, so the page reads "2 booked" to a couple with 50 names on the bench. |
| 2 | Messenger-style Chats door + inbox | APPROVED 2026-10-01 · `prototypes/supplier_inbox_and_find_2026-10-01_fable.html` frames 1–3 | **Partly** · `chats-door.tsx:ChatsDoor` → `/messages` | The door exists; Chats is a separate page (measured live: 1 thread, "Choose a supplier" dropdown). It leaves Suppliers. **And it is double:** the shell bar already carries a Messages icon beside the bell, so the page shows two chat icons (owner spotted it on the prototype, 2026-10-07; it is true of the live page too). With Chats as a section, `ChatsDoor` retires. |
| 3 | Find a supplier by event type ("Popular for weddings", scoped groups) | APPROVED 2026-10-01, frames 4–6 | **Yes, as a separate route** · `categories/page.tsx:FindSupplierPage` (`buildShortlistFolders`, `applicable_event_types`) | Measured live: ~70 categories, almost every one "Joining soon". It leaves Suppliers. The page is honest but it is a wall. |
| 4 | Category → its suppliers, "Save to bench" / "Ask for a quote" | APPROVED 2026-10-01, frame 7 | **Yes** · `categories/_components/find-supplier-controls.tsx:SaveToBenchButton`, `contact-shortlist-vendor-button.tsx` | Not walked live (every category I could open says "Joining soon"). |
| 5 | Bench: "Cover your event" ring, 12 folders, sort, search | `your_team_FINAL_2026-09-22.html` | **Yes** · `shortlist-categories.tsx:ShortlistCategories` | Hidden below 1024 px until "Saved" is tapped; on a phone it is the third screen down. |
| 6 | Picks (the build) | same | **Yes** · `build-locked.tsx:BuildLocked` (label "Picks" = `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED` is **on** in prod, read from the live labels) | Same hiding. `team-controls.tsx` Remove/Clear only render behind the replan flag. |
| 7 | Money split + a buffer that refuses while anyone is unpriced (Your Team slice 3) | `your_team_BUILD_PLAN_2026-09-22.md` | **Yes** · `merkado-budget-lens.tsx:MerkadoBudgetLens` ("Buffer · Not knowable · 1 supplier has no price recorded", measured live) | Collapsed by default on both widths (`budgetOpen=false`). The plan file still says "no slice done" — the plan's status rotted, not the code. |
| 8 | Capped lists + unread badges (slices 0–1) | same | **Yes** · `lib/capped-rows.ts`, `lib/bench-unread.ts` exist | Plan status not updated. Slices 2 and 4: not measured. |
| 9 | Compare saved builds (Plans) | same | **Yes** · `build-compare.tsx:BuildCompare` | Collapsed by default (`compareOpen=false`), last thing on the page. "Compare combinations" is the item the owner named and it is the hardest to reach. |
| 10 | Budget page | `?part=budget` | **Yes** · `page.tsx` early return → `BudgetPage` | A second door to money that leaves the page; with the replan flag off the menu shows two rows both labelled "Budget" (`planning-list.test.ts`). |
| 11 | Add a supplier manually | DECISION_LOG 2026-09-20 (a)–(k) | **Yes** · `NewManualVendorModal` inside `shortlist-categories.tsx` | Three taps deep on a phone: Saved → open a category → "Add manually". "Manual add with an agreed price = booked" is still in the roadmap queue, not built. |
| 12 | Remove on every non-booked bench card | DECISION_LOG 2026-10-05 | **Partly** · `deleteVendor` is wired in `shortlist-categories.tsx` (self-added, with undo) | Shortlisted (not self-added) suppliers: queued in `ROADMAP_TO_APPLE_CHECK_2026-10-06.md` §5.1, not re-verified here. |
| 13 | The other §5.1 bench items (payment-plan hint, Edit sheet + Send by email, PesoInput, Paid so far, inclusion chips, price × guests, locked groups, picked tile sticks, "Not needed? Remove" index bug, one pill height) | ROADMAP §5.1 | **Not measured individually** — the roadmap lists them as queued | They are all bench-card details; the uniscreen keeps the bench card, so they stay valid as a follow-on batch. |
| 14 | "Book", never "lock" | repo guard `the-couple-books-never-locks` (named in the brief; not found under that filename in `apps/web/lib` — anchor the test by grep, not path) | **Partly** · `team-rows.tsx` "Book ›", `accordion-lock.tsx` default label "Book this pick" | `bench-vendor-actions.tsx` docblock still says "Lock this"; comments and symbol names say lock everywhere. Copy is right where I could read it. |
| 15 | Event date lives in Suppliers | DECISION_LOG 2026-10-06 | **No** · editors are `details/_components/governed-fields.tsx:GovernedFields` and `launch/_components/details-your-event.tsx:DateEditor`; Suppliers only reads `event_date` | Needs a home on the page. |
| 16 | Date Finder lives in Suppliers | same | **No** · `find-date/_components/find-your-date.tsx:FindYourDate` (own route) + `launch/_components/details-date-finder.tsx` (Maker) | Reuse `FindYourDate` in place; do not redraw it. |
| 17 | Venue lives in Suppliers; Maker shows "Set when you book your venue in Suppliers" | same | **No** · `details-your-event.tsx:VenuesEditor` | Needs a home on the page, with manual venue entry. |
| 18 | Room size from the venue, table sizes from the stylist | DECISION_LOG 2026-10-06 | **No** · `venue_width_m` is written only by `seating/actions.ts:saveFloorPlan` | No supplier-send path exists. The Suppliers page should show what was received and offer "Ask them". |
| 19 | First-visit tour | owner rule 2026-09-25 | **No** · `customer_vendors_v1` retired 2026-10-02 (`marketplace-mini-tour.test.ts`), no replacement | A new page gets a new tour. |
| 20 | Desktop adaptation | — | **Partly** · `lg:grid-cols-[minmax(0,1fr)_380px]`, sticky rail; nothing else responsive in `page.tsx` | It is a phone column with a rail. |
| 21 | Animation | — | **Barely** · `services-takeover.tsx` has 5 transition classes, `team-rows.tsx` 1 | No motion carries meaning (nothing opens, slides, or counts). |

**Tests that fence any redesign** (keep them green or change them with the design): `your-team-phone-first.test.ts` (source order team → Find → planning list → find area; find area may be hidden on a phone only while closed; rows from `lib/your-team-rows.ts`; one action per row), `suppliers-opens-fast.test.ts` (first paint shows the team, does not draw the closed find area), `suppliers-keeps-the-shell-bar.test.ts`, `planning-list.test.ts` (five rows in the owner's order, 48 px, no ⋯ menu). **The uniscreen replaces the planning list with a jump dropdown, so `planning-list.test.ts` is retired with it, not weakened.**

## What the prototype keeps, and what it changes

Prototype: `prototypes/suppliers_page_2026-10-07_fable.html` — a **working model**, not a picture: every button does its job and the state is kept in the browser. Open `?frame=1` to resize it; `?frame=1&start=empty` starts from zero so the nine steps can be walked in order. Screenshots: `prototypes/suppliers_page_2026-10-07_fable-*.jpg`.

**Kept as shipped:** the shell bar, the Home · Guests · Suppliers · Hub · More bar, `TeamRows` content and its one-action-per-row rule, `ShortlistCategories` data (folders, counts, "Cover your event"), `BuildLocked` picks, `MerkadoBudgetLens` figures incl. "Not knowable", `BuildCompare`, `FindYourDate`, `NewManualVendorModal`, the One Chat Box, `MiniTour`.

**The page is the owner's nine steps, in order, on one scroller — six parts, each mapped to what ships:**

| # | Section | Owner's steps | Maps to (shipped) | What happens there |
|---|---|---|---|---|
| 1 | **Cover your event** | 1 find · 2 talk, inquire · 3 accept | `shortlist-categories.tsx` ("Cover your event" ring, folders → cards), `categories/page.tsx ?c=` (frame 7), `NewManualVendorModal`, One Chat Box | The shipped ring as rows; "＋ Add to your event" is one dropdown of the admin taxonomy. A row with a shortlist opens **on the page** to the couple's suppliers as rows (the Your Team FINAL carousel, one row shape): Add to build · Inquire / Nudge / Read their reply · Book · Remove. "Find more in X ›" opens the marketplace as a **sheet** (the approved frame 7: search · one Filter ▾ · Save · Ask for a quote); Save or Ask closes the sheet and the supplier lands on the page. "Not needed? Remove X from your event" and "＋ Add your own" in the original's words. Chat is not a section: it hangs off the row; the inbox is the shell's one icon. |
| 2 | **Build** | 4 create builds | `build-locked.tsx:BuildLocked` | One supplier per category; money and date-fit update as you pick. Save this build · Book this build. |
| 3 | **Compare builds** | 5 compare builds | `build-compare.tsx:BuildCompare` | Side by side in place, with totals, buffer and the dates each build is free on. Use › |
| 4 | **Booked** | 6 book · 7 see all booked | `team-rows.tsx:TeamRows`, `lib/your-team-rows.ts` | One next step each (Set price · Pay). Opens to what they sent (room size, table sizes, "Ask them") and **"Used across your event"** (Event Hub · seat plan · schedule · guests · Papic). |
| 5 | **Budget** | 8 where they are | `merkado-budget-lens.tsx`, `BudgetPage`, `workspace?tab=payments` | The FINAL's rows, restored: Budget · Booked · Paid to suppliers · Setnayan orders · If you book these · Buffer ("Not knowable" while anyone is unpriced), a meter, the payment rows. |
| 6 | **Date & place** | 9 date and location sharpen | `DateEditor`, `FindYourDate`, `VenuesEditor` (moved here) | Two ladders that fill as you book; the line under the title sharpens: "December 2026 · Metro Manila" → "Fri, Dec 18, 2026 · Seda Vertis North, Quezon City". |

**Each supplier row carries only what is true** (one row shape everywhere): free on your date · covers other categories (the shipped "also covers") · booked by someone in your circle (trusted circle). The shipped **fit badge** (Merkado scoring) is referenced, not redrawn — the prototype never guesses whether a price fits.

No navigator. Sheets are for browsing and input only (marketplace, chat, pay, price, book, date, add your own); nothing of the couple's lives in a sheet. **Desktop (≥1024 px):** Cover and Booked on the left; Build · Compare · Budget · Date & place in a sticky rail. Motion: rows open with a height transition, sheets slide, money counts, "Booked" pops once, ladders fill; `prefers-reduced-motion` honoured.

**What the comparables do (The Knot / WeddingWire Vendor Manager, Zola, Bridebook, Thumbtack; checked 2026-10-07):** all split find / your vendors / budget / messages into 3–4 places; all share the spine we keep (your suppliers by category with a moving status, quotes and deposits feeding the budget). None compares builds across categories, none sharpens date and place, none feeds a booked supplier into the rest of the event.

**Not in the prototype on purpose (needs an owner call):** the word for a combination — the shipped page says "Picks" (replan flag on) / "Build" (flag off); the owner said *"builds"* today. The prototype says **Build**.

## Recommendations (one word each)

1. **Retire the five-row "Your planning" menu**; the page is the nine steps in order, no navigator. (Yes / No)
2. **The second line of the page is "date · venue"**, both editable in place; the Maker's Details tool loses both. (Yes / No)
3. **"Cover your event" shows the shipped starter ring for the event type**, the rest behind one "More categories" dropdown — not the 70-row wall. (Yes / No)
4. **Compare plans opens in place** (sheet/panel), not as a collapsed section at the bottom. (Yes / No)
5. **Chats get a section on the page** (3 latest threads); the `/messages` page stays as the full inbox. (Yes / No)
6. **Hairline rows, not boxed cards**, for suppliers — as the approved 2026-10-01 frame drew them. (Yes / No)
7. **"Build" is the word** for a combination (not "Picks"), per today's phrasing. (Yes / No)
8. **Chats is not a section**: the conversation hangs off the supplier's row; the shell's Messages icon is the only inbox door. (Yes / No)
9. **Add later, each needs your data, none guessed:** a suggested spend per category (Bridebook's one good idea; admin-set figures) · "Ask 3 at once" quote fan-out on a category · a kinder "usually books N months out" line instead of "168 days overdue". (Yes to any)

## Build plan (Opus, after approval — nothing started)

| PR | Scope | Touches | Guard |
|---|---|---|---|
| 1 | Shell: remove `hidden lg:block` + lazy mount; one scroller with seven `<section id>`s in the journey order; no navigator; retire `PlanningList` + `planning-list.test.ts`; update `your-team-phone-first.test.ts` / `suppliers-opens-fast.test.ts` to the new order | `services-takeover.tsx`, `page.tsx` | "every section is in the first render on a phone" |
| 2 | Date + venue line: read `event_date` / venue; sheets reuse `DateEditor`, `FindYourDate`, `VenuesEditor`; Maker Details shows read-only "Set when you book your venue in Suppliers" | `services-takeover.tsx`, `launch/_components/details-your-event.tsx` | "the Maker has no date or venue writer" |
| 3 | Categories in place: starter-scoped rows + "More categories" dropdown; row opens to swipe strip; Find and Add as sheets (reuse `FindSupplierPage` body, `NewManualVendorModal`) | `shortlist-categories.tsx`, `categories/` | "Find a supplier never navigates away" |
| 4 | Picks + money + date-fit line always visible; Compare as a sheet (`BuildCompare` body) | `build-locked.tsx`, `merkado-budget-lens.tsx`, `build-compare.tsx` | "Buffer still says Not knowable while anyone is unpriced" |
| 5 | Chats section (threads via the messages read, state pill + next step) + conversation sheet (One Chat Box); Booked rows get "Used across your event" from the shipped feeds (venue → Event Hub/seat plan, coordinator → schedule, photo → Papic) | new `_components/chats-section.tsx`, `team-rows.tsx` | "unread count on the page equals the door badge" |
| 6 | Supplier sends room size / table sizes: supplier-side field, couple-side "received / Ask them" line | migration (RLS pattern per table), supplier workspace, Suppliers row detail | db-tests + Ugat map |
| 7 | Tour `customer_suppliers_v2` (3 stops) + motion polish + reduced-motion | `lib/tours.ts`, CSS | `marketplace-mini-tour.test.ts` updated |

Then the §5.1 bench batch from the roadmap, unchanged.

**For the controller (Maker change needed):** PR 2 removes the date and venue editors from the Maker's Details tool and leaves a read-only line. Nothing else touches Maker files.
