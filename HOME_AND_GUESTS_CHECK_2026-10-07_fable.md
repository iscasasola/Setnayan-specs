# Home + Guests — check and plan, the same concepts as Suppliers · 2026-10-07 · Fable

Owner, verbatim: *"with the same concepts, on how interface UI and UX and UF and buttons applies, this flows same as hub, guests and home?"* · *"so what to adjust on both guests and home?"* · *"add this plan right after suppliers build"* · *"show a prototype as well on home and guests."*

**Verdict:** the concepts are universal and the Maker already has the shape; Home is already one screen and needs the rules more than a redesign; Guests needs the shape AND the rules. Prototype: `prototypes/home_and_guests_2026-10-07_fable.html` (`?frame=1&page=home` · `?frame=1&page=guests` · `&fail=1` for the honest-failure state). Measured on `origin/main` by two Sonnet maps: `PAGE_MAPS_2026-10-07/map-home-page.md`, `map-guests-page.md`. Acceptance pictures: `prototypes/home_and_guests_final_2026-10-07/`.

## Home — what ships (map) and what to adjust
Ships (plan phase, `home-first-screen.tsx:HomeFirstScreen`): cover band · ONE Next card (`pickHomeNext`) · "Edit your Event Hub" · three numbers (days to go · coming · no reply) · Paid / Still owing → `/budget` · "What's next" row → `?sheet=next` portal (decisions grouped: Book a supplier · Pick an option · Settle a payment · Fill a role) · "Your services" tiles. No pill rows; no "Edit in X ↗" on the first screen; no tour renders (`TIP_POPUPS_ON=false`); plan-phase numbers are static.

| # | Adjust | Today (file:symbol) | In the prototype |
|---|---|---|---|
| H1 | Every control a button, icon + word, tone | Next action, Edit your Event Hub, Event Details, the money card, service tiles, decision CTAs are links / styled spans (`HomeFirstScreen`, `NextCard`, `EventDashboard:renderDecisionGroup`, `ExpandCard fullLabel`) | ✉ Send invitations (main) · 📅 Later · ✎ Edit your Event Hub · ⓘ Event Details · Book 📅 / Pay 💳 / Pick 👤 per decision · ✓ Your checklist · 47% |
| H2 | Numbers count, the money bar grows | static on the plan-phase Home; only day-of views use CountUp/ProgressRing | days · coming · no reply · Paid · Still owing = `Count`; one `Fill` under Paid/owing |
| H3 | A failed read never reads as success | `pickHomeNext`: a failed guest read → "You are on track — Nothing is waiting"; `moneyRead` failure hides the card like "not shared"; services print "0 orders" on a thrown read; the Guests badge hides on an unmeasured count | `&fail=1`: the Next card says "We couldn't read your guest list — this is not 'on track'" + ⟳ Reload; the two guest numbers become "Guest counts couldn't load · not zero — unread" |
| H4 | Words | "N vendors booked" (non-wedding badge); "celebration" ×6 on the launcher + annual form | supplier · event |
| H5 | No go-elsewhere | Hosts card "Set access in People with access →"; "View your full checklist →"; "Open the list ↗"; ExpandCard arrow links | controls in place, or a button that opens the thing |
| H6 | The money opens Suppliers · Booked (Budget) | `/budget` link | the budget lives in Suppliers now (owner 2026-10-07) |
| H7 | What's next unfolds in place (pop → unfold) | `?sheet=next` portal + `router.replace` on close | one section, same motion as a category in Suppliers |
| H8 | Tour | none renders | the flag decision, same as Suppliers |
| — | Keep | the duplicates (coming/no reply, Paid/owing, days to go, Edit your Event Hub) — the Home is a doorway and those are the doors; the one Next card; the cover | unchanged |

## Guests — what ships (map) and what to adjust
Ships: no visible title or search at 375 (the shell top bar's `?q=` is the search — unverified at phone width); a round **+** and a round **⋯** with no word; the ⋯ sheet holds Sort ▾, the doors (List · Mind map · Share the link) and four add doors (From your people · Add with details · Import a file · Paste many names); requests strip (link); Finalize row; Filter ▾ → RSVP · Side · Role · Group (already `PickMenu` dropdowns — good); counts line + Show ▾; the list by role sections (`TierHeader` fold buttons) with `MobileListRow`; guest card as a slide-in sheet with an autosave form and folds. Both tours render nothing (`TIP_POPUPS_ON=false`).

| # | Adjust | Today (file:symbol) | In the prototype |
|---|---|---|---|
| G1 | The Maker/Suppliers shape: one segmented control, one body, tools at the thumb | doors drawn inside the ⋯ sheet (`GuestsPhoneMenu`, `RosterTabs`) | `List N · Map · Share the link` as the sticky `ISegmented`; no ⋯ sheet |
| G2 | One button at a time for adding — we pick the method | round wordless **+** (`OpenAddGuestButton`) + four add doors behind ⋯ (`AddDoors rows`) | thumb bar `＋ Add a guest` (main) → name box, Add; the four doors are ONE dropdown "Add another way" inside the sheet |
| G3 | A visible search, pinned | none on the page at 375 (`GuestsTopSearch` in the shell) | `Search guests or add` pinned under the counts; no match → `＋ Add "…"` |
| G4 | Numbers count, a replied meter | counts line is static; `RosterMeters` is computer-only | attending · not coming · no reply · to invite = `Count`; `Fill` = replied % |
| G5 | Gesture-only controls become buttons | select only by 480 ms long-press (`MobileListRow`), delete only by swipe (`SwipeToDelete`), group kebab only on hover (`KebabMenu`) | ☑ Select in the search row → avatars become checkboxes, thumb bar `✉ Invite N · ✕ Remove N`; every row has `✕ Remove`; groups get a visible ⋯ |
| G6 | Every row action a button with icon + word | bulk bar text buttons, "Reopen", "Delete", "Close", "Choose all N shown", "Rename this role", "Change your message", the wrap-strip links | `✓ Attending / Maybe / Not coming` (state, quiet main) · `🔔 Nudge` (no reply) · `✉ Invite` (to invite, main) · `💬 Message` · `✎ Edit` · `✕ Remove` — words drop by width |
| G7 | Pills and tabs → one dropdown | samahan pills (`AddFromPeopleSheet`), group pills (`GroupsSidebar inline`), `EitherOrRow`, mind-map lens tabs, extra-seats radio pills, `InvitedToChips` | dropdowns; the mind map's lens is one dropdown; "Invited to" stays as switches (toggles are not a choice set) |
| G8 | Native `<select>` → `PickMenu` | `QuickAddSheet`, `TeamSideSelect`, `NewGroupInlineForm`, `KeepQuickAdd`, `/guests/new` | all `.sel` |
| G9 | No go-elsewhere | "Change in Event Hub Maker ↗", "Change in Event Details" (`invite-panel.tsx`); "Change in People with access ›" (`ChangeAccessLink`, `GuestAccessCell`); "Edit on your profile ›", "make one from the Group dropdown" (`GuestCardBody`) | Access = a dropdown on the card; the message = `✎ Change your message` in place on Share the link; groups made from the Group dropdown's last line |
| G10 | Words and orphans | "celebration" in `guestListErrorCopy`; "Add with details" opens a modal titled "Quick add"; two sender UIs (`GuestInviteCell`, `SendInviteActions`); `?gview=share` and `/guests/invite` both draw `InvitePanel` | one word per door; one sender; one share surface |
| G11 | Requests and Finalize as rows with a button | requests strip is a link card with "Review →"; Finalize pill has no icon; Reopen is an underlined text button | `👤 Review` (main) · `✓ Finalize guest list` (main) · `⟳ Reopen` |
| G12 | Tour | both off | the flag decision |
| G13 | The open role pins on top, like the open category in Suppliers | `TierHeader` scrolls away | the open role's header sticks under the search row; opening lands its first row at the top (owner: *"follow the same concept on suppliers where we can pin on top"*) |
| G14 | Select by role | select only one by one (and only via long-press) | in Select mode each role header has a circle: tap = everyone in that role (respecting the filters); tap again = unselect (owner: *"we can select roles so selects all"*) |
| G15 | No repetition | — | the reply state lives on the row only; the action row never repeats it (owner: *"no repetition"*) |
| — | Keep | the role sections and their fold (`TierHeader` already a button), the four filter dropdowns, the autosave card and its folds, the Undo snackbar, the digital ticket block, the "Invited to" switches, the join link | unchanged (re-skinned only) |

## Plan — right after Suppliers (owner), before the area sweep
| PR | Scope | Size |
|---|---|---|
| G-PR1 · Guests shell + list | G1–G6, G11: the segmented, counts + meter, pinned search/add, the role sections with pop → unfold, rows as ActionButtons, Select mode with the thumb bar, Add sheet with the "Add another way" dropdown, requests + finalize rows | 2 sessions |
| G-PR2 · Guests card + share + map | G7–G10: the card's dropdowns and in-place access, Share the link with the message in place, the mind map lens dropdown, the five native selects, the words | 1–2 sessions |
| H-PR1 · Home | H1–H8 in one PR: ActionButtons, Count/Fill, the honest failure states, the money door to Suppliers · Booked, What's next unfolds in place, the words | 1 session |
Each PR: the prototype state at 375 and 1280 as the acceptance picture; side-by-side in the PR body; the build contract; a check card. Then the universal-rules sweep converts what remains in these areas (reader counts: Guests + Maker ≈ 179 controls; Home/event dashboard ≈ 693).
