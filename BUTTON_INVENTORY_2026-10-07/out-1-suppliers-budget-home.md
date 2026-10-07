# Button inventory 1 — Suppliers page, Budget, Dashboard home and Account

Source: origin/main archive. Rule: owner's rule 2026-10-07 (one pill per control, one colour per meaning). Dashboard home = `(launcher)/`; account = `(account)/`. Paths are relative to `apps/web/app/dashboard/`.

Notes: native text inputs/textareas are not counted. Cancel-that-only-closes is Grey in most files; p5 (people/profile/samahan) applied Cancel = Red literally, so reconcile when applying. `AccordionLockButton` is listed at each mount site (team-rows, bench-vendor-actions, build-locked) by one agent and inside accordion-lock.tsx by another; it may be double-counted by a few. Controls living in components defined outside these folders (shared PickMenu, FileUpload, lib label constants) are described by usage.


---
# Part 1: Suppliers — big components

## [eventId]/vendors/_components/shortlist-categories.tsx

Notes: label strings that come from constants in `lib/` (not in BASE) are described by constant name. Mounted-but-defined-elsewhere components NOT counted here: `BenchVendorActions`, `NewManualVendorModal`, `RequirementsModal` (Save), `CategorySearchOverlay`, `removeConfirmDialog` hook, `UnreadBadge`. Full-screen invisible backdrop "Close" button in the loading shell skipped as decorative.

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| "+{N} more" (free days, e.g. "+3 more") | Toggles popup listing all free dates | text link | Grey |
| Vendor card (photo, name, price) | Opens vendor quick-view / details page | clickable element | link — stays a link |
| ⠿ drag grip (arrange mode) | Drag handle to reorder card | icon-only | Grey |
| ← (Move {name} earlier) | Moves card one slot left | icon-only | Grey |
| → (Move {name} later) | Moves card one slot right | icon-only | Grey |
| Undo (INLINE_MORE_UNDO) | Reverses the just-saved supplier | button | Amber |
| + Save {category} (inlineMoreSaveLabel) | Saves marketplace supplier to shortlist | button | ? (label says Save/green but it is an add-to-shortlist, terracotta; text lives in lib) |
| Inquire (INLINE_MORE_INQUIRE) | Sends inquiry to the supplier | button | Blue |
| Coverage tile "{category}" (icon + label, with NEXT flag/count badge) | Opens that category on the bench | clickable element | Grey |
| Plan chip "{category}" (From your plan) | Opens that category on the bench | button | Grey |
| Sort by ▾ (PickMenu dropdown) | Chooses how the bench is ordered | button | Grey |
| × (Clear search) | Clears the search box | icon-only | Grey |
| Marketplace result row "{supplier} · city · rating →" | Opens supplier's public page | clickable element | link — stays a link |
| See all results in the marketplace for "{query}" → | Opens /explore search for query | clickable element | link — stays a link |
| Folder header "{folder}" (summary + chevron) | Expands/collapses the folder | clickable element | Grey |
| i (folder info) | Shows/hides folder hint box | icon-only | Grey |
| Category header "{category}" (count + chevron) | Expands/collapses the category | clickable element | Grey |
| i (category info) | Shows/hides category hint box | icon-only | Grey |
| Sliders icon (View or edit your saved request) | Opens saved request modal | icon-only | Grey |
| Reopen | Reopens a category marked covered | button | Amber |
| Reset order (RESET_ORDER_LABEL) | Clears the couple's hand-arranged order | button | Amber |
| Done | Exits arrange mode | button | Green |
| Find more / Add another {category} (dashed rail tile; Link to /explore when flag off) | Opens in-place supplier search row | clickable element | Terracotta |
| Add manually (dashed rail tile) | Opens add-your-own-supplier form | clickable element | Terracotta |
| Find {category} (empty category; Link to /explore when flag off) | Opens in-place supplier search row | button | Terracotta |
| Add manually (empty category) | Opens add-your-own-supplier form | button | Terracotta |
| See all → (INLINE_MORE_SEE_ALL) | Opens full category search overlay | button | Grey |
| Remove from plan (REMOVE_FROM_PLAN_LABEL, plain mono text) | Removes the category from the plan | text link | Red |
| + {category} chip (Add to your event) | Adds category back to the plan | button | Terracotta |

Count: 29 controls; 17 text-link-or-icon-only-or-clickable; 1 unsure

## [eventId]/vendors/_components/plan-budget-accordion.tsx

Notes: counted elsewhere (defined in other files, mounted here): `AccordionBuildButton` (counted in accordion-build.tsx), `ChangePickButton` (counted in accordion-lock.tsx). Mounted but defined in files outside my four and NOT counted: `ContactShortlistVendorButton` (button, "Contact supplier", Blue), `NewManualVendorModal`, `CategorySearchOverlay`. Coming-soon service cards are static (not interactive).

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ✕ (Dismiss tip) on "How this works" coach | Dismisses the first-run tip | icon-only | Grey |
| + Unlock {N} more categories (outlined gold pill, `<a>`) | Opens categories page to enable more | button | link — stays a link |
| Folder header "{folder}" (amount/status + ▾) | Expands/collapses the folder | clickable element | Grey |
| Leaf header "{category}" (plan, count, ›) | Expands/collapses the category's services | clickable element | Grey |
| ⇄ Compare {N} | Opens side-by-side compare sheet | button | Grey |
| Adjust (inline in "Your plan for…") | Goes to budget allocation | text link | link — stays a link |
| ＋ Find {category} · Search (empty category) | Opens in-place category search | button | Terracotta |
| ✎ Add manually · Add (empty category) | Opens add-your-own-supplier form | button | Terracotta |
| ＋ Find {category} / Add another {category} (dashed rail tile) | Opens in-place category search | clickable element | Terracotta |
| ✎ Add manually (dashed rail tile) | Opens add-your-own-supplier form | clickable element | Terracotta |
| Supplier card (photo, name, price, match %) | Opens the supplier's workspace | clickable element | link — stays a link |
| × (Remove from shortlist) on card corner | Arms the remove confirmation | icon-only | Red |
| Remove (armed, pending "Removing…") | Deletes supplier from shortlist | button | Red |
| Keep | Cancels the armed remove | button | Grey |
| Not on Setnayan yet — invite them (tinted tag `<Link>`) | Goes to workspace invite section | button | link — stays a link |
| Leave a review (tinted tag `<Link>`) | Goes to review form | button | link — stays a link |
| Setnayan service card "{service} {cta} →" (poster card) | Opens that service's setup page | clickable element | link — stays a link |
| ✕ (Close compare) | Closes the compare sheet | icon-only | Grey |

Count: 18 controls; 10 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/accordion-lock.tsx

Notes: `LockConfirmModal` and `LockMilestoneToast` (Undo / I'm done / Add another) are mounted from `./lock-milestone` and NOT counted here. Main button label is a prop (default "Book this pick"; Lock tab passes "Lock to confirm"); its pill styling comes from the `className` prop (`.lockbtn` mulberry fill by default). Modal backdrop click-to-dismiss skipped as decorative.

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Book this pick (or "Lock to confirm" / "Booking…") | Books supplier; may ask for confirmations | button | Green |
| ↺ Change pick (or "Reopening…") | Reverts booked pick to considering | button | Amber |
| ✕ (Cancel) in "Pay the first payment to book" modal | Closes payment modal, books nothing | icon-only | Grey |
| ◯ {payment method} (radio per method, ×N) | Picks which method you paid through | clickable element | ? (selection input, not an action) |
| Choose file (Payment screenshot, required) | Attaches payment proof file | button | Grey |
| Book & submit first payment (or "Booking…") | Submits payment proof and books | button | Green |
| Cancel ×3 (payment modal, time-slot modal, reservation-terms modal) | Dismisses the modal, books nothing | button | Grey |
| ✕ (Close) ×3 (conflict, time-slot, reservation-terms modals) | Closes the modal | icon-only | Grey |
| Switch to {vendorName} (or "Switching…") | Replaces earlier booking with this supplier | button | Terracotta |
| Browse similar suppliers (pill `<Link>`, soft-hold case) | Opens explore for this category | button | link — stays a link |
| Cancel / Dismiss (conflict / soft-hold modal) | Dismisses the exception modal | button | Grey |
| Time slot (select dropdown) | Chooses the supplier's time window | clickable element | ? (selection input, not an action) |
| Book this slot (or "Booking…") | Books supplier for chosen time slot | button | Green |
| ☐ I understand the first payment… (checkbox) | Agrees to reservation terms | clickable element | ? (consent toggle, not an action) |
| Agree & book (or "Booking…") | Acknowledges terms and books supplier | button | Green |

Count: 20 controls; 7 text-link-or-icon-only-or-clickable; 3 unsure

## [eventId]/vendors/_components/accordion-build.tsx

Notes: backdrop click-to-dismiss on the Replace popup skipped as decorative. "Waiting for the supplier's price" is a disabled note, not a control.

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Remove (beside "In your build") | Removes supplier from the build | button | Red |
| 🔨 Add to build (or "Adding…") | Pins supplier as the category's build pick | button | Terracotta |
| ✕ (Cancel) in "Replace on your build?" popup | Closes popup, changes nothing | icon-only | Grey |
| Cancel | Closes popup, changes nothing | button | Grey |
| Add both | Adds this one, keeps both shortlisted | button | Terracotta |
| Replace (or "…") | Swaps build pick to this supplier | button | Terracotta |

Count: 6 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

---
# Part 2: Suppliers — other pages & components

# p2 — Suppliers (`[eventId]/vendors`) button inventory

Conventions: "link — stays a link" = pure navigation (destination/back/row links). Pill-styled links that carry an action word are coloured by meaning. Selects/switches/chips are listed as controls (Grey = neutral input). Controls rendered by a component defined in another file are listed in the file that defines them (ContactShortlistVendorButton is listed once, in its own file; its callers pass the label: "Ask for a quote", "Inquire", "Open thread"). Exception: AccordionLockButton (defined in excluded accordion-lock.tsx) is listed at each mount site. Count = number of rows (merged duplicates count once).

## [eventId]/vendors/page.tsx
(Composes components; the only control written directly in this file is below.)

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Unlock (pill inside the "See your ranked shortlist" banner link) | Opens Setnayan AI purchase page | button | Terracotta |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/categories/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| ‹ Suppliers | Back to the Suppliers page | text link | link — stays a link |
| ‹ Find a supplier | Back from one category to the category list | text link | link — stays a link |
| {Category name} + "{N} suppliers" / "Booked ✓" ›  (each row, ×N) | Opens that category's supplier list | text link | link — stays a link |
| Open chat › (on a Booked supplier row, ×N) | Opens the Messages page | text link | Blue |
| Ask for a quote (per supplier row, ×N) | Opens a chat thread with the supplier | button | Blue |

Count: 5 controls; 4 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/categories/_components/find-supplier-controls.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Filter / Filter · 2 | Opens the Area · Price · Rating dropdown (PickMenu, compact) | button | Grey |
| Area / Price / Rating (dropdown options with checkmarks) | Toggles a filter in the URL | clickable element | Grey |
| Save (bookmark icon, per supplier row) → "Saved" (✓) after press | Saves supplier to your bench | button | Green |

Count: 3 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/chats-door.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Chat bubble icon with unread badge (aria "Chats, 3 unread") | Opens the Messages page | icon-only | Blue |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/planning-list.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Budget › (full-width list row) | Opens the Budget page | text link | link — stays a link |
| Saved › / Build › / Plans › / Payments › (4 list rows) | Scrolls to that section on the page | text link | link — stays a link |

Count: 2 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/waiting-for-quotes.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| {Supplier name} · {city} · "waiting 3 days" › (each row, ×N, incl. folded rows) | Opens that supplier's inquiry | text link | link — stays a link |
| …and {N} more waiting for a quote (disclosure) | Expands the folded rows | text link | Grey |

Count: 2 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/lock-milestone.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| (dimmed backdrop behind the lock dialog) | Click outside closes the dialog | clickable element | Grey |
| ✕ Close (top-right of lock dialog) | Closes the lock dialog | icon-only | Grey |
| Not yet | Cancels the lock; closes dialog | button | Grey |
| Book {date label} / Book {supplier name} / custom confirm label (e.g. "Book Seda") | Confirms the booking request | button | Green |
| Finalize your {Save the Date} → (in the "Congratulations" toast) | Opens the newly unlocked feature | text link | Terracotta |
| ✓ I'm done | Marks this service complete | button | Green |
| ＋ Add another | Keeps the service open for another pick | button | Terracotta |
| Undo · revert to considering | Reverts the booking to considering | text link | Amber |
| ✕ Dismiss (toast) | Closes the congratulations toast | icon-only | Grey |

Count: 9 controls; 5 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/quote-fill.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| ＋ Add to your build (single) / Fill your build from your quotes (multi) | Puts quoted suppliers into your build | button | Terracotta |
| Set a budget | Opens the Budget page | text link | link — stays a link |
| Find more options | Loads more supplier suggestions | button | Grey |
| Add / Added (per suggested supplier, ×N) | Adds that supplier to your shortlist | button | Terracotta |
| Show 10 more | Expands the suggestion list | text link | Grey |

Count: 5 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/self-added-price.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Add the price you agreed (pencil icon) | Opens the inline price field | button | Terracotta |
| ✓ (check icon, aria "Save price") | Saves the agreed price | icon-only | Green |
| Transport, food & inclusions → | Opens the supplier workspace costing | text link | link — stays a link |

Count: 3 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/reuse-bookings-panel.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Choose a past supplier… (select) | Picks which past supplier to reuse | clickable element | Grey |
| For which event… (select) | Picks the target event | clickable element | Grey |
| Request | Asks the supplier to reuse the booking | button | Blue |
| Accept (per quoted request) | Accepts the supplier's reuse quote | button | Green |
| Cancel (per pending/quoted request) | Cancels the reuse request | button | Red |

Count: 5 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/pending-lock-proposals.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Book now (per proposal, ×2 incl. folded list) | Confirms coordinator's proposed booking | button | Green |
| Dismiss (per proposal, ×2 incl. folded list) | Dismisses the coordinator's proposal | button | Grey |
| …and {N} more (disclosure) | Expands the folded proposals | text link | Grey |

Count: 3 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/merkado-budget-lens.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Open budget & payments (inline link in empty state; also whole tile with → arrow) ×2 | Opens the Budget page | text link | link — stays a link |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/team-rows.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Try again › | Reloads the suppliers page | text link | Amber |
| Book › (AccordionLockButton mount, per row needing a lock) | Requests booking of this supplier | text link | Green |
| {Next action} › e.g. "Pay ›", "Nudge ›" (per row) | Goes to that row's next step | text link | ? meaning varies by action kind (Pay green, Nudge amber); label comes from lib, not this file |

Count: 3 controls; 3 text-link-or-icon-only-or-clickable; 1 unsure

## [eventId]/vendors/_components/team-controls.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| ✕ (aria "Remove {name} from your build", per candidate row) | Takes that candidate off your build | icon-only | Red |
| Clear candidates (eraser icon; confirm dialog follows) | Empties all non-booked candidates | text link | Red |
| as a new plan / overwrite "{plan}" (select) | Chooses new plan or overwrite target | clickable element | Grey |
| Save plan / Save | Saves current candidates as a named plan | button | Green |
| {Category} · "4d left" › (each "Still needs your decision" row, ×N) | Opens that category on the bench | text link | link — stays a link |

Count: 5 controls; 4 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/bench-vendor-actions.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Connect (QR icon) | Opens the connect-supplier modal | button | Terracotta |
| Add to build (hammer icon; "Adding…") | Adds supplier to your build | button | Terracotta |
| Remove (×2: in-build and not-available states) | Removes supplier from your build | button | Red |
| Check inquiry (chat icon) | Opens the existing chat thread | button | Blue |
| Lock this (AccordionLockButton mount; "Locking…") | Requests booking of this supplier | button | Green |

Count: 5 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/withdraw-ask-button.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Take it back (undo icon; "Withdrawing…") | Withdraws your pending lock request | button | Amber |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/contact-shortlist-vendor-button.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Contact supplier (default) / Inquire / Ask for a quote / Open thread — label set by caller; "Opening…" (chat icon) | Opens or creates a chat with the supplier | button | Blue |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/build-compare.tsx
(Two flag branches: "Save As" bar + per-column load/modify/book/delete are the flag-OFF layout; saved-plan rows are the flag-ON layout. Both listed.)

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| as a new build / overwrite "{build}" (select, flag-off) | Chooses new build or overwrite target | clickable element | Grey |
| Save As / Save (flag-off) | Saves current plan under a name | button | Green |
| Rename (pencil, per saved plan) | Loads plan name into the save bar | text link | Grey |
| Load (folder icon, per saved plan) | Loads saved plan into your build | button | Terracotta |
| 🗑 (aria "Delete {plan}", per saved plan) | Deletes the saved plan | icon-only | Red |
| load (flag-on) / modify (flag-off), per plan column | Loads that plan into your build | text link | Terracotta |
| book (lock icon, per plan column) | Loads plan and heads to book | text link | Green |
| delete (trash, per plan column) | Deletes that plan | text link | Red |
| ⌄ (aria "Show inclusions" / "Hide inclusions", per cell) | Expands a pick's inclusions | icon-only | Grey |

Count: 9 controls; 7 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/build-locked.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Book to confirm (AccordionLockButton mount; "Booking…") | Requests booking of this supplier | button | Green |
| Leave a review (on Booked rows, when review window open) | Opens that supplier's review page | button | Amber |
| Make your first payment (deposit due) | Opens the deposit payment step | button | Green |
| Send it again (deposit refused) | Resends the first payment | button | Amber |
| First payment & payments (deposit state unknown) | Opens the payments page | text link | link — stays a link |

Count: 5 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/cancel-booking-button.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Cancel booking (trash icon; default "pill" variant is plain grey text, "cta" variant is a bordered pill) | Opens the cancel-booking dialog | text link | Red |
| (dimmed backdrop behind dialog) | Click outside closes the dialog | clickable element | Grey |
| ✕ Close | Closes the dialog | icon-only | Grey |
| Keep the booking | Closes dialog, keeps the booking | button | Grey |
| Yes, cancel (trash icon; "Cancelling…") | Cancels the booking | button | Red |
| ✕ Dismiss notification (success toast) | Closes the cancelled toast | icon-only | Grey |
| Request refund / dispute (DisputeLinkButton, warn icon) | Opens the Disputes page | button | Amber |

Count: 7 controls; 4 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/category-search-overlay.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| ✕ (aria "Close", round header button) | Closes the supplier search overlay | icon-only | Grey |
| + Add / ✓ Added (per result row, ×N, also farther rows) | Adds supplier to your plan | button | Terracotta |
| Unlock with Setnayan AI (last-minute empty state) | Opens Setnayan AI purchase page | button | Terracotta |
| Set your budget (budget-estimate nudge pill) | Opens the Budget page | button | Terracotta |
| Adjust your budget (raise-budget nudge pill) | Opens the Budget page | button | Grey |
| Show suppliers farther away | Loads out-of-range suppliers | button | Grey |
| Filter (dot when active) | Opens the Refine sheet | button | Grey |
| (dimmed scrim behind Refine sheet) | Click outside closes the sheet | clickable element | Grey |
| Verified only (toggle switch) | Toggles verified-only filter | clickable element | Grey |
| Distance chips: {radius label} (×N) | Picks a distance from venue | button | Grey |
| Facet chips: {option label} (×N, per facet group) | Toggles a service-detail filter | button | Grey |
| Only exact matches (toggle switch) | Toggles strict facet matching | clickable element | Grey |
| Show results | Applies filters and closes sheet | button | Terracotta |

Count: 13 controls; 4 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/services-takeover.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Find a supplier (full-width outlined pill) | Opens the Find a supplier page | button | Terracotta |
| Show / Hide (chevron, on Payments and Plans section headers) | Expands or collapses the section | button | Grey |
| ⓘ (aria = explore info label, next to the Saved heading, flag-gated) | Opens the "how this page works" panel | icon-only | Grey |
| ✕ Close (inside the info panel) | Closes the info panel | icon-only | Grey |

Count: 4 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/_components/vendor-quickview-inspector.tsx
(Only the full-profile link, which is rendered by InspectorColumn from the `fullHref` / `fullLabel` props; everything else here is display-only.)

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Open full profile ↗ | Opens the supplier's detail page | text link | link — stays a link |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/packages/[bookingId]/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| ‹ Back to event home | Returns to the event home | text link | link — stays a link |
| {Supplier business name} (under the package title) | Opens the supplier's public page | text link | link — stays a link |
| Remove (per included item, only while locked, ×N) | Removes that item from the package | button | Red |
| View contracts (file icon) | Opens the Contracts page | button | Grey |
| Open thread (chat icon; "Opening…") — ContactShortlistVendorButton | Opens the chat with this supplier | button | Blue |
| Messages (chat icon; fallback when no supplier row id) | Opens the Messages list | button | Blue |
| Release this package ("Releasing…") | Releases the locked package | button | Red |

Count: 7 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/[vendorId]/review/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| ‹ Back to suppliers (×7, one in every page state) | Returns to Suppliers | text link | link — stays a link |
| Star rating inputs (one per axis: StarRatingInput, ×N axes) | Picks 1–5 stars for an axis | clickable element | Grey |
| On time? Yes / No (OnTimeBinaryInput) | Picks on-time yes or no | clickable element | Grey |
| Submit review ("Submitting…") | Posts your review | button | Green |
| Yes, I got everything ("Confirming…") | Confirms the service was delivered | button | Green |
| Something's missing ("Reporting…") | Reports non-delivery | button | Amber |
| Want to attach the review you would have posted? (disclosure) | Expands optional review fields in appeal | text link | Grey |
| File appeal ("Filing…") | Files an appeal to the review block | button | Terracotta |
| Open supplier profile (already-reviewed state) | Opens the supplier's public profile | button | Grey |

Count: 9 controls; 4 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/vendors/[vendorId]/review/_components/recommend-vendor-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Recommend {supplier name} (e.g. "Recommend Seda"; "Saving…") | Adds supplier to your recommended list | button | Terracotta |
| Update endorsement ("Saving…") | Saves your edited endorsement line | button | Green |
| Remove recommendation ("Removing…") | Withdraws your recommendation | text link | Red |

Count: 3 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

---
Files in scope with no interactive controls (omitted): `_components/merkado-guard-banner.tsx`, `_components/trusted-circle-badge.tsx`, `_components/saved-photo-marker.tsx`.

Totals across this part: 113 controls; 56 not already buttons; 1 unsure.

Caveats: (1) The `vact` classes used in bench-vendor-actions/self-added-price/withdraw-ask were checked against the scoped CSS in shortlist-categories.tsx (all bordered pills = button). (2) Labels for CARD_* constants (Add to build, Remove, Check inquiry, Lock this, Take it back) and the "Budget / Saved / Build / Plans / Payments" tab labels came from a grep of lib/explore-info-copy.ts and the planning-list docblock, which sit outside the BASE copy; that one grep read a file outside BASE (a deviation from the stated rule). (3) PickMenu, StarRatingInput, OnTimeBinaryInput, InspectorColumn and useConfirm are defined in other files not in my scope, so their "Today" values are inferred from usage.

---
# Part 3: Suppliers — per-supplier workspace

# p3 — vendor workspace (couple side): `[eventId]/vendors/[vendorId]/workspace/`

Scope notes
- `[eventId]/vendors/[eventVendorId]/` holds only `workspace/loading.tsx` — no controls.
- Controls that live inside imported components NOT in this file list (VendorDirectPay, ChosenProofField, FileUpload, ProofImage, CoordinatorColourDomains, AppointmentsSection, VendorItemizationCard, VendorMarketplaceInfo, PaymentPlanStepper, TrustedCircleBadge, the confirm dialog inside CancelBookingButton, RelationshipTabShell internals) are not listed; only the trigger/tab entries this page names directly are.
- Native checkboxes/radios are listed with Colour "n/a (checkbox/radio)" — they are form inputs, not pills; the caller decides whether they are in scope. They are counted under "not already buttons" but not under "?".
- "Today = button" means already a styled pill/bordered button, even where the colour is not yet the rule's colour (several Accept/Save/Record buttons are terracotta or mulberry today).

## page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Back to event home | Goes to the event dashboard | text link | link — stays a link |
| All services | Goes to this event's suppliers list | button | link — stays a link |
| Request refund / dispute (shown once money has moved) | Opens the disputes page | button | link — stays a link |
| Cancel booking (shown while status is contracted) | Opens cancel-booking confirmation dialog | button | Red |
| view it (inside "From the quote you accepted") | Opens the accepted quote | text link | link — stays a link |
| Open chat thread | Opens the existing chat with the supplier | button | Blue |
| Send the first note | Creates the chat thread and opens it | button | Blue |
| Manage (Documents header) | Goes to the contracts page | text link | link — stays a link |
| Ask {name} for a contract | Opens the chat to request a contract | button | Blue |
| {contract title} e.g. "Venue contract" | Opens the uploaded contract file in a new tab | text link | link — stays a link |
| Message {name} (thread exists) | Opens the chat thread | text link | Blue |
| Message {name} (no thread yet) | Creates the thread and opens it | text link | Blue |
| Crew fed by your crew-meal provider | Toggles crew-meal coverage for this supplier | clickable element | n/a (checkbox/radio) |
| view the quote | Opens the accepted quote | text link | link — stays a link |
| Save crew | Saves crew size / crew-meal coverage | button | Green |
| Save costs | Saves service price, transport, food costs | button | Green |
| Create a shareable invite link | Creates a claim link to invite the supplier | button | Terracotta |
| Yes, I got everything | Confirms the supplier delivered everything | button | Green |
| Something's missing | Reports a non-delivery to Setnayan | button | Amber |
| Leave a review | Goes to the review page for this supplier | button | Terracotta |
| Chat (tab strip) | Goes to the chat thread | text link | link — stays a link |
| Quote · Payments · Files · Schedule · Details (tab strip) ×5 | Switches the workspace tab in place | button | Grey |
| Chat (desktop side rail) | Goes to the chat thread | button | Blue |
| Payments (desktop side rail) | Jumps to the Payments tab | button | link — stays a link |

Count: 28 controls; 9 text-link-or-icon-only-or-clickable; 0 unsure

## _components/change-order-trail.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Propose a change | Opens the change-order form | button | Terracotta |
| Add-on | Sets the change kind to add-on | button | Grey |
| Removal | Sets the change kind to removal | button | Grey |
| Send to {supplier} | Submits the proposed change order | button | Blue |
| Cancel | Closes the change-order form | button | Grey |
| Accept (on a supplier-raised change) | Accepts the change, updates budget | button | Green |
| Decline (on a supplier-raised change) | Declines the supplier's change | button | Red |
| Withdraw (on your own proposed change) | Takes back your proposal | button | Red |

Count: 8 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/claim-link-share.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Copy (becomes "Copied") | Copies the claim link to clipboard | button | Grey |
| Share invite link (only where the device can share) | Opens the device share sheet | button | Grey |

Count: 2 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/colour-access-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| (switch, aria "Colour access for {name}", beside On/Off badge) | Grants or revokes supplier colour access | icon-only | ? (toggle switch, no word; grants/revokes — not one of the six meanings) |
| Reject (per change row; "Rejecting…" while busy) | Puts one colour change back | button | Red |

Count: 2 controls; 1 text-link-or-icon-only-or-clickable; 1 unsure

## _components/consent-gated-invite-form.tsx

(Modal "Share your event with {who}?" shown before inviting a coordinator. The invite form's own submit button is rendered by the parent, see promote-coordinator-card.)

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| (dark area behind the dialog) | Dismisses the consent dialog | clickable element | Grey |
| X (aria "Close") | Closes the consent dialog | icon-only | Grey |
| Can book suppliers | Optional permission: coordinator may book suppliers | clickable element | n/a (checkbox/radio) |
| Can handle payments | Optional permission: coordinator handles payments | clickable element | n/a (checkbox/radio) |
| I agree to share my event's planning information… | Required consent tick to enable invite | clickable element | n/a (checkbox/radio) |
| Cancel | Closes the dialog without inviting | button | Grey |
| Agree & invite | Records consent and sends the invitation | button | Terracotta |

Count: 7 controls; 5 text-link-or-icon-only-or-clickable; 0 unsure

## _components/deposit-reservation.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Record payment (becomes "Send it again" after the supplier says it did not arrive) ×2 (first payment card and later-installment card) | Opens the record-payment form | button | Green ("Send it again" variant: Amber) |
| Pay early (when nothing is due yet) | Opens the record-payment form early | button | Green |
| Record payment (form submit) ×2 | Saves the payment record to the supplier | button | Green |
| Cancel ×2 | Closes the record-payment form | button | Grey |

Count: 7 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/handover-inbox.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Open gallery | Opens the supplier's gallery link, new tab | text link | link — stays a link |
| View file | Opens the delivered file, new tab | text link | link — stays a link |
| Also mark this supplier delivered (asks you for a review) | Also advances the supplier to delivered | clickable element | n/a (checkbox/radio) |
| Confirm receipt | Confirms you received the handover | button | Green |

Count: 4 controls; 3 text-link-or-icon-only-or-clickable; 0 unsure

## _components/host-service-details.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| {category} chips, e.g. "Photo", "Video" (one per plan category, tick shows when on) | Toggles that this booking covers the category | button | Grey |
| Save details ("Saving…" while busy) | Saves inclusions and covered categories | button | Green |

Count: 2 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/payment-asks-card.tsx

Display only — no interactive controls.

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/promote-coordinator-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Invite as delegate ("Inviting…") | Starts the consent dialog, then invites | button | Terracotta |
| Message them | Opens chat with the booked coordinator | button | Blue |
| Revoke ("Removing…") | Revokes a pending coordinator invitation | button | Red |
| Change in People with access > | Goes to the People with access page | text link | link — stays a link |

Count: 4 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## _components/quote-bridge.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Log ₱{amount} (up to three chips, from chat quotes) | Opens the confirm dialog with that amount | button | Terracotta |
| Log as service price (one per proposal) | Opens the confirm dialog with proposal costs | button | Terracotta |
| X (aria "Close") | Closes the log-quote dialog | icon-only | Grey |
| Cancel | Closes the dialog without saving | button | Grey |
| Confirm & save to build ("Saving…") | Saves the quote amounts to the build | button | Green |

Count: 5 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## _components/reservation-terms-ack.tsx

Display only — no interactive controls.

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/self-added-contact-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Save their details | Saves contact person, number, address, payment note | button | Green |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/shot-list-card.tsx

Display only — no interactive controls.

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/vendor-proposals-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| {quote title} (one per quote) | Opens that quote to review/accept/decline | text link | link — stays a link |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## _components/working-folder-notes.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Private-to-coordinators option (coordinator viewers only) | Sets new note visibility to private | clickable element | n/a (checkbox/radio) |
| Shared option (coordinator viewers only) | Sets new note visibility to shared | clickable element | n/a (checkbox/radio) |
| Add note ("Adding…") | Posts the note to the working folder | button | Terracotta |
| Trash icon (aria "Remove your note") | Deletes your own note | icon-only | Red |

Count: 4 controls; 3 text-link-or-icon-only-or-clickable; 0 unsure

---
Totals: 75 controls; 24 not already buttons; 1 unsure

---
# Part 4: Budget, dashboard home (launcher), shared dashboard components

# p4 — dashboard budget, shared dashboard components, launcher (home)

Conventions used: "Count" counts table rows (a row merged with ×N is one control type). "T" = rows whose Today is not "button". Pure navigation links that already look like a filled pill (button-primary / bg pill) are given the colour of their meaning and noted as page links; plain text navigation links are "link — stays a link". Native selects / dropdown pickers are listed as controls. Files with zero controls are listed with Count 0.

## [eventId]/budget/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Export upcoming dates (.ics) | Downloads payment due dates as calendar file | button | Grey |
| Budget (.csv) | Downloads the budget as a spreadsheet file | button | Grey |
| Print budget | Opens printable budget in a new tab | button | Grey |
| Update mahr / Set mahr | Goes to Home to record the mahr | text link | link — stays a link |
| Find suppliers | Goes to suppliers page (empty budget state) | button | Terracotta (page link, already a pill) |
| Open suppliers | Goes to suppliers page (none contracted yet) | button | Terracotta (page link, already a pill) |

Count: 6 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/budget/_components/suggest-milestones-button.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Suggest a first payment + balance split | Adds a 50% first payment and 50% balance | button | Terracotta |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/budget/_components/budget-live-summary.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Pinned bar: Agreed / Paid / Owed with progress line (aria: Back to your budget summary) | Scrolls back up to the budget summary | clickable element | Grey |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/budget/_components/costs-with-no-supplier.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Record a cost | Opens the add-a-cost form | button | Terracotta |
| Category: Choose a category (dropdown) | Picks which category the cost belongs to | clickable element | Grey |
| Record this cost (Saving… while busy) | Saves the cost into the budget | button | Green |
| Cancel | Closes the cost form (nothing is deleted) | text link | Grey (closes a form; not a destructive cancel) |
| Delete {cost name} (trash icon) ×N | Deletes that recorded cost | icon-only | Red |

Count: 5 controls; 3 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/budget/_components/budget-ledger-table.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| "{Categories} are ₱X more than you planned. See what could cover it" / Hide | Expands or collapses the cover-the-overspend details | text link | Grey |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/budget/_components/budget-setter.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save my budget / Update my budget | Saves the total budget target | button | Green |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/budget/_components/budget-allocation-planner.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save plan (Saving… while busy) | Saves the suggested budget split | button | Green |
| Service row: name, range, ₱ amount, % of budget (aria: Adjust {service}) ×N | Opens the adjust-this-service sheet | clickable element | Grey |
| Close (X icon) | Closes the adjust sheet | icon-only | Grey |
| Level: Save / Standard / Splurge (dropdown, or "Your own amount") | Picks a spending level for the service | button | Grey |
| Reset to suggested | Clears your amount, back to suggestion | text link | Amber |
| Done | Applies the amount and closes the sheet | button | Green |

Count: 6 controls; 3 text-link-or-icon-only-or-clickable; 0 unsure

## [eventId]/budget/_components/share-budget-band-toggle.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| On/off switch (aria: Share budget ranges with suppliers) | Turns sharing budget ranges with suppliers on or off | icon-only | Grey (a setting switch) |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## _components/secure-account-banner.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Secure my plan | Goes to signup to attach an email | button | Terracotta (page link, already a pill; currently mulberry) |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/pending-vendor-inquiry-dispatcher.tsx

No UI (returns null).

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## _components/terms-reaccept.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| "I agree to the Terms and Privacy Policy" checkbox | Ticks consent required to continue | clickable element | ? form consent field, not an action |
| Terms | Opens the Terms page | text link | link — stays a link |
| Privacy Policy | Opens the Privacy Policy page | text link | link — stays a link |
| Continue (Saving… while busy) | Records agreement and continues to dashboard | button | Terracotta (label is "Continue"; it also accepts the Terms) |

Count: 4 controls; 3 text-link-or-icon-only-or-clickable; 1 unsure

## layout.tsx

No controls of its own (renders SecureAccountBanner, TermsReaccept, GuidedTour, children).

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/layout.tsx

No controls of its own (mounts the bell, AccountSwitcher, HomePillNav, modal slot — all in other files).

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/@modal/default.tsx

Renders nothing.

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/@modal/(.)create-event/page.tsx

Wraps the create-event page in CreateEventPanel; no controls of its own.

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/create-event-panel.tsx

Only wires onClose into SidePanel; the panel's own close control lives in side-panel.tsx (not in this file's scope).

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/start-planning-link.tsx

Wrapper only: a Link whose onClick stashes the moment, then navigates. The visible pressable is the "Start planning" row, counted once under year-moments-list.tsx.

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/event-scene.tsx

Decorative card cover (aria-hidden); no controls.

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/home-pill-nav.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Home | Goes to the events board | text link | link — stays a link |
| Memories | Goes to Memories library | text link | link — stays a link |
| + (aria: Create an event) | Goes to create-event | icon-only | Terracotta |
| People | Goes to People | text link | link — stays a link |
| Spaces (only if shop/admin) | Goes to shop or admin console | text link | link — stays a link |

Count: 5 controls; 5 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/guests-top-search.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| "You're searching guests · this looks everywhere" (appears under the search box) | Repeats the typed words as a site-wide search | text link | link — stays a link |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/incoming-requests.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Yes ×N | Accepts the invitation request | button | Green |
| No ×N | Declines the invitation request | button | Red |
| Don't show me invites from {Name} ×N | Mutes future invites from that person | text link | Red |

Count: 3 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/home-command-bar.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Search bar ("Search …", ⌘K hint) ×2 (laptop bar and phone row) | Opens the search-and-jump palette | clickable element | Grey |
| Result rows: name + sublabel + kind tag (incl. "search everywhere" row) ×N | Jumps to that event, space or destination | clickable element | link — stays a link |

Count: 2 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/year-moments-strip.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Add your birthday (empty tile) | Goes to profile to add birthday | text link | link — stays a link |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/year-moments-list.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Show N more / Show less (chevron) | Expands or collapses the moments list | text link | Grey |
| Open plan (pill inside an event moment row) ×N | Opens that event's dashboard (whole row is the link) | clickable element | link — stays a link |
| Start planning (pill inside a no-event moment row) ×N | Starts create-event pre-filled from that date | clickable element | Terracotta |

Count: 3 controls; 3 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/_components/event-card-menu.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ⋯ (aria: Options for {event}) ×N cards | Opens the event's options menu | icon-only | Grey |
| (invisible full-screen backdrop behind the menu) | Closes the menu on outside press | clickable element | Grey |
| Add to calendar — Just this celebration, on your phone | Downloads one .ics for this event | text link | Grey |
| Put this away / Bring it back | Hides the event, or restores it | text link | Grey (put away) / Amber (bring it back = undo) |
| Remove for good (menu row) | Opens the remove-event dialog | text link | Red |
| Withdraw the request ×2 (deletion request / supplier ask) | Takes back a pending request | text link | Amber |
| Why are you removing it? — Choose a reason (dropdown) ×2 | Picks a reason for removal or request | clickable element | Grey |
| Ask them to agree | Asks the booked suppliers to agree to deletion | button | Blue |
| Ask us to remove it | Opens the reason step to ask Setnayan to remove | button | Blue |
| I'd rather not say | Skips the reason, goes to confirm step | text link | Grey |
| Change / Say why | Goes back to edit the reason | text link | Grey |
| Add a note | Reveals the optional note box | text link | Terracotta |
| Cancel / Back | Closes the dialog / returns from reason step | text link | Grey |
| Send it | Sends the removal request to Setnayan | button | Blue |
| Remove for good (dialog, after typing name) | Permanently deletes the event | button | Red |

Count: 15 controls; 11 text-link-or-icon-only-or-clickable; 0 unsure

## (launcher)/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| i (aria: What is this row?) ×5 (Now happening, Planning, Worth planning, Untold/Ended, Told) | Opens a small help bubble for the shelf | icon-only | Grey |
| Create an event (empty Planning shelf) | Goes to create-event | button | Terracotta (page link, currently ink pill) |
| New event (dashed tile at end of Planning) | Goes to create-event | clickable element | Terracotta |
| Planning pages: page numbers / gaps | Goes to another page of the Planning shelf | text link | link — stays a link |
| Event card (poster or glass card): name, date, progress ×N across Now happening / Planning / Put away / Untold / Told | Opens that event's dashboard (or invited page) | clickable element | link — stays a link |
| Untold-shelf event card (organiser, stories measured) ×N | Opens that event's story page | clickable element | link — stays a link |
| Show the N I put away / Hide the ones I put away | Shows or hides put-away events on the board | button | Grey |
| + (aria: New event, in the Planning header) | Goes to create-event | icon-only | Terracotta |
| read them in Memories | Goes to the Memories library | text link | link — stays a link |
| Open Memories | Goes to the Memories library | text link | link — stays a link |

Count: 10 controls; 8 text-link-or-icon-only-or-clickable; 0 unsure

---
# Part 5: Account — people, profile, samahan

# Part 5 — (account)/people · (account)/profile · (account)/samahan

Scope notes: native form fields (text/date inputs, `<select>`, textareas, the hidden file input) are NOT listed — they are fields, not pressables. Controls rendered by shared components imported from elsewhere (FileUpload, PickMenu, PushToggle, ConfirmForm dialog, LifeStorySection) are listed only as the trigger visible in these files. Rule applied to verbs: Back/View/Visit = Grey; bare navigation (names, cards, tabs, nav rows) = "link — stays a link"; Cancel = Red, Close = Grey.

## (account)/people/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| New group (Samahan view head) | Opens the create-group page | button | Terracotta |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/[dependentId]/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| ← People | Back to the People list | text link | Grey |
| Visit the shop ↗ (only when the alaga is a shop) | Opens the alaga's public shop page | text link | Grey |
| Timeline entry cards (event / shop with a link) ×N | Opens that event or shop | text link | link — stays a link |

Count: 3 controls; 3 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/add-alaga-fields.tsx

(Only form fields: kind select, name, birthday, relationship, debut-year, religion. No pressable controls.)

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/samahan-people-section.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Group cards (name · Organizer · N members) ×N | Opens that group's page | text link | link — stays a link |
| Create one (in "No group yet." line) | Opens the create-group page | text link | Terracotta |
| Add (on each second-degree person chip) | Sends a connection request to that person | button | Terracotta |

Count: 3 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/connection-tree-section.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Show N more people / person (summary) | Expands the hidden courtesy-kin list | text link | Grey |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/people-view-picker.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| People view dropdown (current view + count, e.g. "Connected 12"); lists Requests · Connected · Following · Followers · Alaga · Samahan | Switches the People page view | button | Grey |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/person-avatar.tsx

(Display only.)

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/add-alaga-button.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Add a loved one (heart-handshake icon) | Opens the add-loved-one drawer | button | Terracotta |
| Add (inside drawer; "Adding…" while pending) | Saves the new loved one | button | Terracotta |
| Cancel (inside drawer) | Closes the drawer without saving | button | Red |

Count: 3 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/your-story-section.tsx

(Wrapper only; the hide/unhide/opt-out controls live in LifeStorySection, a different file.)

Count: 0 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/follow-list-view.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Unfollow (quiet underlined, on a Connected row) | Stops following; stays connected | text link | Red |
| Unfollow (pill, on a non-connected row) | Stops following that person | button | Red |
| Follow again | Re-follows someone you unfollowed | button | Terracotta |
| Follow back (Followers view) | Follows the person back | button | Terracotta |

Count: 4 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/find-or-invite.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Add ("Adding…" while pending; capture bar) | Invites by name + email | button | Terracotta |
| Follow (on a search hit) | Follows a public profile, no request | button | Terracotta |
| Add (on a search hit) | Sends a connection request | button | Terracotta |

Count: 3 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/dependents-section.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| {Loved one's name} ×N | Opens that loved one's page | text link | link — stays a link |
| Plan {name}'s debut → | Opens the debut onboarding flow | text link | Terracotta |
| Erase (claimed own profile; confirm dialog) | Permanently erases own profile record | text link | Red |
| Remove (own loved one; confirm dialog) | Deletes the loved one's record | text link | Red |
| Copy hand-over link / Copy transfer link | Copies the claim link | button | Grey |
| Revoke | Cancels the active hand-over link | text link | Red |
| Email it | Emails the hand-over link to recipient | button | Blue |
| {Name} is of age — create their hand-over link / Transfer care to someone else | Creates a hand-over link | text link | Terracotta |
| Share with your spouse / ✓ Shared with your spouse — tap to make private | Toggles sharing with spouse | text link | Grey |
| × (on a godparent chip; confirm dialog) | Removes that godparent | icon-only | Red |
| Add (godparent form) | Adds a ninong or ninang | button | Terracotta |

Count: 11 controls; 8 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/people/_components/people-roster-view.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Accept | Accepts a connection or label request | button | Green |
| Decline | Declines the request | button | Red |
| Yes, change it (replace-partner question, request row) | Confirms replacing current partner | button | Green |
| Keep as is (request row) | Dismisses the replace-partner question | button | Grey |
| Take back (Waiting for them list, label ask) | Withdraws the label you asked for | text link | Red |
| + Group (dashed chip on a connected row) | Opens menu to ask them into a group | button | Terracotta |
| {Samahan name} items in "Ask them into" menu ×N | Sends them that group's invitation link | clickable element | Terracotta |
| Label chip (current word, or "+ Label") | Opens the label picker | button | Grey |
| Yes, change it (label replace-partner question) | Confirms replacing current partner | button | Green |
| Keep as is (label question) | Dismisses the replace-partner question | button | Grey |
| Label options in "How is X yours?" menu (Spouse · Partner · Parent · … ×N) | Asks for / sets that label | clickable element | Grey |
| Remove the label (menu item) | Clears the label | clickable element | Red |
| Plan an event together | Opens create-event with both names | text link | Terracotta |
| Send again | Re-sends the invitation email | text link | Amber |
| Withdraw | Withdraws the pending request | text link | Red |
| Remove (connected row) | Removes the connection | text link | Red |

Count: 16 controls; 8 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/profile/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Profile photo dropzone (shared FileUpload: upload, Replace, Remove) | Uploads, replaces or clears profile photo | clickable element | ? (labels live in shared FileUpload, not this file) |
| Privacy › Public profile (under Account name) | Jumps to the handle setting | text link | link — stays a link |
| Use “{Formal name}” from {event}'s list | Fills empty name parts from guest list | text link | Terracotta |
| Save (Profile) | Saves profile details | button | Green |
| Privacy (in Guest details note) | Jumps to the Privacy section | text link | link — stays a link |
| Save (Guest details) | Saves guest details | button | Green |
| Public profile page (switch) | Turns the public profile on/off | clickable element | Grey |
| Share profile | Shares or copies the public profile link | button | Grey |
| View public profile | Opens the public profile page | button | Grey |
| Save account name | Saves the new @handle | button | Green |
| Can people find you by name? (switch) | Turns name search on/off | clickable element | Grey |
| Share my profile photo with hosts (switch) | Turns photo sharing with hosts on/off | clickable element | Grey |
| Public birthday and anniversary greetings (switch) | Turns public greetings on/off | clickable element | Grey |
| Download .json | Downloads your data export | button | Grey |
| posted ↗ (on a feature consent) | Opens the live social post | text link | link — stays a link |
| Revoke (on a feature consent) | Revokes permission to feature you | button | Red |
| Reuse my account face profile across my events (switch) | Turns account face profile on/off | clickable element | Grey |
| {Event name} switches (Events that can reuse your face) ×N | Allows/stops face reuse for that event | clickable element | Grey |
| Forget my face everywhere (summary) | Expands the erase-face panel | text link | Grey |
| Forget my face everywhere (submit) | Erases the account face profile | button | Red |
| Secure your plan | Opens signup to add an email | button | Terracotta |
| Change password | Changes your password | button | Green |
| Sign out other devices (confirm dialog) | Signs out every other session | button | Red |
| Guided / DIY (Planner mode segments) ×2 | Sets planner mode | button | Grey |
| English / Tagalog (Display language segments) ×2 | Sets display language | button | Grey |
| Planning reminders (switch) | Turns planning reminders on/off | clickable element | Grey |
| Marketing emails (switch) | Turns marketing emails on/off | clickable element | Grey |
| Push notifications (switch, shared PushToggle) | Turns push notifications on/off | clickable element | Grey |
| Help ×2 (Account list + phone list) | Opens Help | text link | link — stays a link |
| Setnayan AI ×2 | Opens the Setnayan AI settings | text link | link — stays a link |
| API keys ×2 | Opens the API keys page | text link | link — stays a link |
| Restart welcome tour | Restarts the first-visit tour | text link | Terracotta |
| Setnayan HQ ↗ ×2 (admins only) | Opens the admin console | text link | link — stays a link |
| Cancel deletion request | Cancels the pending account deletion | button | Red |
| secure your plan (inline, anonymous accounts) | Opens signup to add an email | text link | link — stays a link |
| Delete my account (summary) | Expands the delete-account panel | text link | Grey |
| Request account deletion | Files the account-deletion request | button | Red |
| Back to Home / Back to events (masthead) | Returns to event home or event list | button | Grey |

Count: 38 controls; 22 text-link-or-icon-only-or-clickable; 1 unsure

## (account)/profile/_components/analytics-choice.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Change (Analytics cookies) | Opens the cookie preferences panel | button | Grey |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/profile/_components/haptics-toggle.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Haptic feedback (switch) | Turns tap haptics on/off | clickable element | Grey |

Count: 1 controls; 1 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/profile/_components/settings-shell.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Profile · Guest details · Privacy · Sign-in & security · Preferences · Account (desktop rail) ×6 | Switches the visible settings group | text link | link — stays a link |
| Same five groups with hint text (phone group list) ×5 | Opens that settings group | text link | link — stays a link |
| Identity card (avatar, name, @tag) | Opens the Profile group | text link | link — stays a link |
| Account (row with account ID) | Opens the Account group | text link | link — stays a link |
| Delete account (red row, phone list) | Opens the Account group's delete panel | text link | link — stays a link |
| ‹ Settings | Back to the settings group list | text link | Grey |

Count: 6 controls; 6 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/profile/concierge/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Back to profile ×2 (top + inside panel) | Returns to Profile | button | Grey |
| See pricing ×3 (live panel; dormant expired + DIY panels) | Opens the pricing page | button | Terracotta |
| {Event name} chips (event picker, dormant branch) ×N | Shows Setnayan AI status for that event | button | Grey |

Count: 3 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/samahan/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Create a group (empty state, mulberry pill) | Opens the create-group page | button | Terracotta |
| Group rows (initial · name · role · N members) ×N | Opens that group's page | text link | link — stays a link |
| Create a group (dashed "+" row under the list) | Opens the create-group page | text link | Terracotta |

Count: 3 controls; 2 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/samahan/new/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Create group ("Creating…" while pending) | Creates the group | button | Terracotta |

Count: 1 controls; 0 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/samahan/[communityId]/page.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Back to Groups | Returns to the groups list | button | Grey |
| Overview · Usapan · Members · Events (tab bar) ×4 | Switches the group tab | text link | link — stays a link |
| Usapan — the group chat | Opens the group chat tab | text link | Blue |
| Copy (invite link) | Copies the invite link | button | Grey |
| Rotate link ("Rotating…") | Replaces the invite link, kills old | button | Amber |
| Take it down (under own chat message) | Deletes your own message | text link | Red |
| Send (Usapan) | Posts the message to the group | button | Blue |
| Leave group | Leaves the group | text link | Red |
| Promote | Makes the member an organizer | text link | Terracotta |
| Demote | Removes the member's organizer role | text link | Red |
| Remove (member row) | Removes the member from the group | text link | Red |
| Plan an event ×2 (empty state pill + list-header chip; organizers) | Opens create-event for this group | button | Terracotta |
| Event rows (when you may open them) ×N | Opens that event's board | text link | link — stays a link |

Count: 13 controls; 8 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/samahan/[communityId]/_components/samahan-identity-header.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Group photo chip with camera badge (aria: Add/Change the group photo) | Opens picker to set the group photo | icon-only | Grey |
| {Group name} ✎ (aria: Rename) | Starts renaming the group inline | text link | Grey |
| ✓ (aria: Save the name) | Saves the new group name | icon-only | Green |
| ✕ (aria: Cancel) | Cancels the rename | icon-only | Red |

Count: 4 controls; 4 text-link-or-icon-only-or-clickable; 0 unsure

## (account)/samahan/[communityId]/_components/samahan-stories.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today | Colour |
|---|---|---|---|
| Record your 3 seconds (becomes Shrinking… / Posting… / Yours is up) | Opens the camera to record a story | button | Terracotta |
| Play the day | Plays all clips one after another | button | Grey |
| Story thumbnails (aria: Play {name}'s story) ×N | Plays that clip from there on | icon-only | Grey |
| Take it down ×2 (under own thumbnail; inside player) | Arms / performs removal of own clip | text link | Red |
| Yes, remove it | Confirms removing own clip | text link | Red |
| Close ×2 (camera sheet; player) | Closes the camera or the player | text link | Grey |
| Round record button (aria: Start/Stop recording) | Starts or stops the 3-second recording | icon-only | Terracotta |
| Flip | Switches front/back camera | text link | Grey |
| Turn sound on | Unmutes the playing story | text link | Grey |
| Back (player) | Plays the previous clip | text link | Grey |
| Next (player) | Plays the next clip | text link | Grey |

Count: 11 controls; 9 text-link-or-icon-only-or-clickable; 0 unsure

---
# Part 6: Account — everything else

# p6 — (account)/ controls (excluding people/, profile/, samahan/)

Notes: plain form fields (text/date/number inputs, textareas, selects) are not listed. Files with no controls of their own (layout.tsx, template.tsx, year/page.tsx, chapter-embed-frame.tsx, loading files) are omitted. "×N" = repeated per item or fixed count. Pill-styled navigation links with an action word get the meaning colour; cards, rows, names and rail items are "link — stays a link".

## (account)/_components/account-rail-context.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Memories rail rows: Recent, Owned, Attended, People, With me, Albums by event, Editorials, Saved vendors ×8 | Switch Memories view | text link | link — stays a link |
| People rail rows: Requests (with count), People, Following, Followers, Alaga, Samahan ×6 | Switch People view | text link | link — stays a link |

Count: 14 controls; 14 T-link-or-icon-only-or-clickable; 0 unsure

## (account)/_components/autosurfaced-events.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Event name + "A couple added you to their event." (per row) | Opens the event board | text link | link — stays a link |
| Leave (per row) | Leaves an event you were added to | button | Red |

Count: 2 controls; 1 T; 0 unsure

## (account)/_components/life-story-section.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Hide all from this event | Hides all your story items for the event | button | Grey |
| Unhide (eye icon, per hidden item) | Shows a hidden story item again | text link | Grey |
| Hide (eye-off icon, per item) | Hides one story item | text link | Grey |

Count: 3 controls; 2 T; 0 unsure

## (account)/api-keys/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to profile (arrow chip) | Returns to Profile | button | Grey |
| Scope checkboxes (per API scope; label = scope name) | Choose what the new key can read | clickable element | ? (form choice, not an action) |
| Create key (plus icon) / Creating… | Creates an API key | button | Terracotta |
| View supplier plans | Opens supplier plans to get API access | button | Terracotta |
| Revoke (shield-off icon, per key) / Revoking… | Revokes an API key | button | Red |
| /api/v1 (inline link) | Opens the API reference | text link | link — stays a link |

Count: 6 controls; 2 T; 1 unsure

## (account)/clusters/[clusterId]/_components/cluster-tools.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add | Adds a celebration to the group | button | Terracotta |
| Save (main celebration) | Saves which celebration is the main one | button | Green |
| Rename | Renames the group | button | Grey |
| Remove (per celebration) | Ungroups a celebration (not deleted) | button | Red |

Count: 4 controls; 0 T; 0 unsure

## (account)/clusters/[clusterId]/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| All groups | Returns to the groups list | button | Grey |
| Celebration name (per timeline row) | Opens that celebration | text link | link — stays a link |
| See everyone | Expands the combined guest list | text link | Grey |

Count: 3 controls; 2 T; 0 unsure

## (account)/clusters/_components/create-cluster-form.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Create group / Creating… | Creates a new group | button | Terracotta |

Count: 1 controls; 0 T; 0 unsure

## (account)/clusters/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Group name + "Open" (per group row) | Opens the group | text link | link — stays a link |

Count: 1 controls; 1 T; 0 unsure

## (account)/create-event/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to events / Back to [group name] (arrow chip) | Leaves create-event | button | Grey |
| Buksan ang [event name] (only on duplicate-event error) | Opens the existing event | button | link — stays a link |

Count: 2 controls; 0 T; 0 unsure

## (account)/create-event/_components/create-date-picker.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Specific date(s) | Switches date entry to exact dates | button | Grey |
| A range | Switches date entry to a range | button | Grey |
| + Add another option | Adds another candidate date | text link | Terracotta |

Count: 3 controls; 1 T; 0 unsure

## (account)/create-event/_components/create-location-picker.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| × (per chosen area, "Remove [city]") | Removes a chosen area | icon-only | Red |
| City / region rows (per search result, up to 8) | Adds the city as an event area | clickable element | Terracotta |

Count: 2 controls; 2 T; 0 unsure

## (account)/create-event/_components/event-type-photo-picker.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Event-type photo tile (Wedding, Debut, Birthday… "Begin →" on hover) | Picks the event type to start | clickable element | Terracotta |

Count: 1 controls; 1 T; 0 unsure

## (account)/create-event/_components/event-type-picker.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Who tiles (You / each alaga / Someone else) | Picks who the event is for | clickable element | Terracotta |
| Change (underlined, next to "For [name]") | Re-opens the who step | text link | Grey |
| May iba ka pang pinaplano? … show all event types | Reveals all event types | clickable element | Grey |
| The church (or civil) ceremony of the same marriage (card) | Opens the existing wedding | text link | link — stays a link |
| A vow renewal or anniversary celebration (card) | Starts an Anniversary event instead | clickable element | Terracotta |
| Go to [wedding name] | Opens the in-planning wedding details | button | link — stays a link |
| ‹ Pick a different type | Goes back to the type grid | text link | Grey |
| Make it a yearly thing (checkbox) | Repeats the event each year | clickable element | ? (toggle preference, not an action) |
| Create [type] event / Creating event… | Creates the event | button | Terracotta |
| Cancel | Abandons and returns to events | button | Red |

Count: 10 controls; 7 T; 1 unsure

## (account)/creator/_components/teaser-generator.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Generate teaser / Regenerate teaser | Renders a teaser video in the browser | button | Terracotta (Generate) · Amber (Regenerate) |
| Download | Downloads the teaser video | button | Grey |

Count: 2 controls; 0 T; 0 unsure

## (account)/creator/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Supplier name (per offer) | Opens the supplier page | text link | link — stays a link |
| Accept (sparkle icon) / Accepting… | Accepts a discount offer | button | Green |
| Decline / Declining… | Declines a discount offer | button | Red |
| Past offers (N) | Expands past offers | text link | Grey |
| Link chapter / Linking… | Credits the supplier in a chapter | button | Terracotta |
| Create chapter (plus icon) / Creating… | Creates a new chapter | button | Terracotta |
| /u/[slug] (inline link) | Opens your public page | text link | link — stays a link |
| Edit chapter | Expands the chapter edit form | text link | Grey |
| Save changes / Saving… | Saves chapter edits | button | Green |
| Only me · The people of this celebration · Everyone (×3, per chapter) | Sets who can read the chapter | button | Grey (Only me, This celebration) · Terracotta (Everyone = publish) |
| Profile (inline link in note) | Opens Profile to pick web address | text link | link — stays a link |
| Delete (trash icon) / Deleting… | Deletes the chapter | button | Red |

Count: 14 controls; 5 T; 0 unsure

## (account)/library/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Life-Flash card ("The moments that mattered most…" ▶) | Opens Life-Flash | text link | link — stays a link |
| Show (Memories lens dropdown, phone only) | Switches the Memories view | button | Grey |
| Spaces on your home (inline link) | Opens the home Spaces | text link | link — stays a link |

Count: 3 controls; 2 T; 0 unsure

## (account)/library/_components/album-shelf.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Album cover + event name + item count (per event) | Opens that event's album | text link | link — stays a link |

Count: 1 controls; 1 T; 0 unsure

## (account)/library/_components/gallery-doors.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| [Event name] — Gallery › (per hosted event) | Opens that event's Gallery | text link | link — stays a link |

Count: 1 controls; 1 T; 0 unsure

## (account)/library/_components/saved-vendor-card.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Saved supplier card (logo, name, "Saved in N events") | Opens the supplier page | text link | link — stays a link |
| Contact (chat icon) | Opens supplier page to message them | button | Blue |

Count: 2 controls; 1 T; 0 unsure

## (account)/library/_components/vendors-tab.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Explore the marketplace (compass icon) | Opens the supplier marketplace | button | Terracotta |
| Supplier name (attended weddings list) | Opens the supplier page | text link | link — stays a link |

Count: 2 controls; 1 T; 0 unsure

## (account)/library/_components/editorials-tab.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Editorial hero image (per card) | Opens editor (owned) or page (attended) | text link | link — stays a link |
| Edit editorial (pencil icon) | Opens the editorial editor | button | Grey |
| View page (arrow) | Opens the published editorial page | button | Grey |
| View editorial (arrow) | Opens an attended couple's editorial | button | Grey |

Count: 4 controls; 1 T; 0 unsure

## (account)/library/_components/photos-tab.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Create an event (plus icon) | Opens create-event | button | Terracotta |
| "N years ago today" card (sparkle, arrow) | Opens that event's Papic studio | text link | link — stays a link |
| Share the gallery link (Facebook icon) | Shares the gallery to Facebook | button | Grey |
| Album thumbnail strip (per album) | Opens the album | text link | link — stays a link |
| View & download / Open album (arrow, per album) | Opens the album | button | Grey |

Count: 5 controls; 2 T; 0 unsure

## (account)/life-flash/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Whole life · year · month · event chips (per scope) | Filters Life-Flash to that scope | button | Grey |
| Plan what's next (empty state) | Opens create-event | button | Terracotta |

Count: 2 controls; 0 T; 0 unsure

## (account)/life-flash/_components/flash.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| ▶ Play your Life-Flash (dark card) | Starts the Life-Flash playback | clickable element | Terracotta |
| ▶ Resume | Resumes paused playback | button | Terracotta |
| ↻ Replay | Plays the Life-Flash again | button | Amber |
| ■ Stop | Stops and closes the overlay | button | Grey |
| Stage (tap anywhere on the playing scene) | Pauses / resumes playback | clickable element | Grey |
| Plan what's next → (final beat) | Opens create-event | button | Terracotta |
| Close (final beat) | Closes the overlay | button | Grey |

Count: 7 controls; 2 T; 0 unsure

## (account)/life-flash/_components/story-people.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Remembered ✦ (per person) | Asks to confirm marking in memoriam | text link | Grey |
| Remember ✦ ("Hold them a little longer in your story?") | Confirms marking in memoriam | text link | Green |
| Not now | Dismisses the confirmation | text link | Grey |
| Unmark ✦ | Removes the in-memoriam mark | text link | Amber |

Count: 4 controls; 4 T; 0 unsure

## (account)/life-flash/_components/scroll-reel.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| By significance | Orders the reel by significance | button | Grey |
| By time | Orders the reel by time | button | Grey |

Count: 2 controls; 0 T; 0 unsure

## (account)/notifications/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Mark all read (double-check icon) / Marking… | Marks every notification read | button | Green |
| Back to events (empty state) | Returns to the events board | button | Grey |

Count: 2 controls; 0 T; 0 unsure

---
## Totals

Controls counted: 558 across 122 files · not already buttons (text links, bare icons, clickable elements — must become buttons): 288 · unsure ("?"): 10
