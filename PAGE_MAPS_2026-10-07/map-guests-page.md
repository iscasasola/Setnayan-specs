# Map: the couple's GUESTS page, as seen on a phone (375 px)

Source: archive of origin/main (apps/web/app + components) for `app/**`; `git show origin/main:` for `lib/**`.
Abbreviations: **G** = `apps/web/app/dashboard/[eventId]/guests`, **C** = `G/_components`, **L** = `apps/web/lib`.
Cite style: file:symbol (greppable). No line numbers. "NOT FOUND" / "NOT VERIFIED" = I did not find it, I am not guessing.
"Phone" = below `lg` (1024 px). Almost every phone/desktop split is a Tailwind `lg:` class, not a different component.

---

## 0. How the phone page is assembled (one-paragraph model)

`G/page.tsx:GuestsPage` (server, `force-dynamic`) builds ONE `master` section and hands it to
`@/app/_components/inspector/inspector-column:InspectorLayout` with `mobileSheet`. The master = a title group, then a
column of blocks, then four sheets/hosts mounted at the bottom. Opening a guest (`?inspect=<guestId>`) renders
`C/guest-card-body.tsx:GuestCardBody` (variant `panel`) inside `InspectorColumn`, presented on a phone by
`inspector-column:InspectorSheet` (a right-hand slide-in that leaves a peek strip of the list on the left; the strip is a
button "Back to the list"). The whole page is wrapped in `LastSeenCapture page="guests"` (roster kept on the phone and
shown instantly on the next open, then refreshed; a refused read is never kept) with `G/loading.tsx:GuestsLoading`
(`LastSeenFallback` + `GridPageSkeleton`) as the fallback. Every filter/sort/mode is a URL search param re-read on the
server; `RosterFilters`/`RosterSort` write them with `router.push(..., {scroll:false})`.

Server redirects that change what "the guests page" is:
- `?gview=walk` or `?view=march` -> Maker Details "march" (`detailsItemHref(eventId,'march')`).
- `?gview=hosts` -> `/dashboard/<id>/hosts`; `?gview=checkin` -> `/guests/checkin`.
- A delegate without the guest_list area -> `/hosts` (`isDelegateWithoutArea`). Not logged in -> `/login`.
- `?inspect=<unknown>` renders the card closed, never a blank rail.

---

## 1. TOP-TO-BOTTOM OUTLINE (phone)

### 1.0 Chrome around the page (not this file's, but on screen)
- **Shell top bar** — on `/dashboard/<id>/guests` the shared top bar's search box IS the guest search
  (`apps/web/app/dashboard/(launcher)/_components/guests-top-search.tsx:GuestsTopSearch` -> `C/live-search.tsx:LiveSearch`,
  placeholder "Search guests", debounced 250 ms `router.replace` of `?q=`; typed text shows an "escape" row to search
  everywhere). The page itself has NO search box. Whether that bar is visible at 375 px: NOT VERIFIED (I did not read the
  shell's responsive rules).
- **Bottom bar** — HOME · GUESTS · SUPPLIERS · HUB · MORE (`apps/web/app/dashboard/[eventId]/_components/customer-bottom-nav.tsx`;
  the Guests tab is this page; `lib/customer-menu.ts` entry `label: 'Guests'`). Page clears the dock
  (`the-page-clears-the-dock.test.ts`).

### 1.1 Page heading (invisible) — `app/_components/page-masthead:PageMasthead`
Renders only an `sr-only` `<h1>`: "{N} guests" (formatCount(stats.total)) or "Guests" when the read was refused.
No visible title from this component.

### 1.2 Phone title row — `G/page.tsx` (`data-guests-phone-title`, `lg:hidden`)
`Guests` (display font text, aria-hidden) on the left; on the right TWO round 44 px buttons:
1. **+** `C/add-guest-sheet.tsx:OpenAddGuestButton` (filled ink circle, Plus icon, no word; aria-label "Add a guest", or
   "Still adding someone? — the list is open" after the event). Fires a `CustomEvent` that opens `AddGuestSheet`.
2. **⋯** `C/guests-phone-menu.tsx:GuestsPhoneMenu` (outlined circle, MoreHorizontal icon, no word; aria-label
   "More for the guest list"). Opens a bottom sheet portalled to `<body>` (see 1.3).
The same two elements are drawn a second time at the end of the computer's Filter row (`FindAddRow` `more`, `hidden lg:block`);
on a phone only the title-row copy shows.

### 1.3 The ⋯ sheet — `C/guests-phone-menu.tsx:GuestsPhoneMenu` (bottom sheet, 85 vh, rounded-t-3xl, X close)
Header "Guest list" + round X. Then, top to bottom:
1. **Sort ▾** — `C/roster-controls.tsx:RosterSort` (PickMenu, one dropdown). Options (`G/page.tsx:SORT_OPTIONS`):
   Importance (default) · Last name (A–Z) · First name (A–Z) · Side (only if the event has sides) · Group · RSVP status ·
   Seat · Newest first. Writes `?sort=` and clears `?by=`.
2. **The doors row** — `C/roster-tabs.tsx:RosterTabs` fed by `L/roster-doors.ts:rosterDoors` (drawn here on a phone; on a computer
   it is a row of its own, `data-roster-doors-row`, `hidden lg:block`). One `.sn-seg` segmented `<nav aria-label="Guest list">` of links:
   - **List** and **Mind map** — `C/view-switcher.tsx:GuestsViewSwitcher bare` (they stand in the "Roster" tab's place; `?gview=map` for Mind map; icons List / Network).
   - **Share the link** — only BEFORE the event; `?gview=share`; Send icon.
   - After the event instead (`trailing`): **Scan tickets** (text link, ClipboardCheck icon, -> `/guests/checkin`) and, when a join link exists, **Share the link** (`page.tsx:ShareDropdown`, a `<details>` with a `button-secondary` summary; panel shows the join URL in a `<code>` block and a text link "Send invites one by one" -> `/guests/send`).
   - Any link inside this block closes the sheet (`onClickCapture` on `a`).
3. **The four add doors, as labelled rows** — `C/capture-bar.tsx:AddDoors rows`: **From your people** (icon Users; opens `AddFromPeopleSheet`), **Add with details** (ClipboardList; opens `QuickAddSheet`), **Import a file** (Upload; link -> `/guests/import`), **Paste many names** (ListPlus; link -> `/guests/quick`). Tapping any closes the sheet.

### 1.4 "That's a wrap" strip — `G/page.tsx` (only when `finished` = lifecycle phase `after`)
Terracotta-tinted box: bold "That's a wrap." + "{N} people checked in on the day." (only if the arrivals read was measured and > 0) / "Nobody was added to this one." / "This is the list as it stood." Two underlined text links: **Who came** (-> `/guests/checkin`), **Write the story** (-> `/dashboard/<id>/story`).

### 1.5 Flash + error banners — `G/page.tsx:pickFlash`, `guestListErrorCopy`
Green `role=status` banner from success params (added, saved, removed, imported, bulk_*, paired, group_*, reordered, new_qr…). Red `role=alert` banner from `?error=` (known codes mapped to sentences; bare snake_case never shown).

### 1.6 Requests strip — `G/page.tsx` (`data-requests-strip`, only if `pendingClaimsCount > 0`)
Whole-width link card -> `/guests/claims`: mulberry round count badge · "N request(s) to join" · "From your event link — keep them, or link them to a name you already have." · "Review →" (ArrowRight). Not a button; a link.

### 1.7 Finalize row — `C/finalize-guest-list-control.tsx:FinalizeGuestListControl`
Open: sentence "Guests can reply until you finalize." + full-width 44 px pill **Finalize guest list** (no icon) -> `useConfirm` dialog "Finalize your guest list?" (Finalize / cancel) -> `finalize-actions.ts:setGuestListFinalized`.
Finalized: "Guest list finalized · your suppliers price for N heads. Guests can no longer reply on your event page." + underlined text button **Reopen** (confirm dialog "Reopen your guest list?").

### 1.8 Roster head — `G/page.tsx:SummaryFacetBar` -> `C/find-add-row.tsx:FindAddRow`
Phone shows only:
- **Filter ▾** pill button (`data-find-add-filter-toggle`, ChevronDown rotates). Toggles an in-flow line (not a popover) holding `C/roster-controls.tsx:RosterFilters`:
  four PickMenu dropdowns **RSVP ▾ · Side ▾ (only if sides) · Role ▾ · Group ▾**; an active one reads "RSVP: No reply" in gild.
  - RSVP options: Everyone · Attending · No reply · Not coming · Maybe (Maybe only while somebody holds it).
  - Side: Both sides · Bride's side · Groom's side.
  - Role: "All guests" + lenses derived from the event's role set (`page.tsx:viewFiltersFor`) in the couple's own role words (`roleGroupLabel`).
  - Group: All groups · each group (filtered to the side in view) · tags under a "Tags" heading · last line "Make or rename groups…" (opens the **Your groups** sheet, 1.12).
- Sort is NOT in this row on a phone (it is in the ⋯ sheet). The computer-only meters (`RosterMeters`, `hidden lg:block`) are absent on a phone.

### 1.9 Counts line — `G/page.tsx:RosterCountsLine` (+ `C/phone-show-pick.tsx:PhoneShowPick`)
`{attending} attending · {declined} not coming · {pending} no reply · {toInvite} to invite (wine) · {requests} request(s) (wine, only >0)`; with any filter on, it leads with bold "N of M shown". Right end (`ml-auto`, phone only): **Show ▾** — a PickMenu whose options are the roster columns (Invite · RSVP · Access · Check-in (from event day) · Seat · Side (if sides) · Role · Groups · +N · Account · Contact; `L/roster-columns.ts:ROSTER_COLUMN_LABEL`). It picks the ONE column every row shows under its dashed line; remembered per device in localStorage `sn:guest-list-columns:phone:v1` (`C/use-roster-columns.ts`, `fixedSlots: 1`; published to the line through `C/phone-column-channel.ts`). Not rendered at all when the read was refused ("never print a count").

### 1.10 The list body — one of three modes by `?gview=`
(a) **List** (default) — `C/guest-list-multiselect.tsx:GuestListMultiselect`; phone = the `lg:hidden` block.
    - Section headings: `TierHeader` (a full-width BUTTON: chevron + mono small-caps label + count; folds the section; honoree section also says "always first"). Which headings: by default one per role group in this order — `SECTION_CONFIG`: Bride & Groom · VIP · Immediate Family · Nikah Principals · Groomsmen · Bridesmaids · Principal Sponsors · Secondary Sponsors · Bearers & Flower Girl · Officiants & Readers · Guests (labels `L/role-groups.ts:ROLE_GROUP_LABELS`, re-said in the couple's words). The honoree (bride/groom/celebrant) is pulled out first and never moves. The heading set changes with `?sort=` (Side -> side headings, RSVP -> reply headings, Group -> group headings, name/Seat/Newest -> one flat list, no heading) via `lib/roster-arrangement`.
    - Rows: `MobileListRow` — see section 3.
    - After the last row: an invisible `h-[50dvh]` runout so the last guest can scroll to mid-screen.
    - Empty / zero-match / refused: `G/page.tsx:EmptyState`.
(b) **Mind map** — `C/guest-mind-map.tsx:GuestMindMap`; phone = vertical expand/collapse tree (`MobileTree`), computer = canvas. Lens switch (2 tabs) **Side + group** (or **Groups** when no sides) / **Entourage**; each node has a round + (`AddButton`, aria-label "Add a guest/group/+1") that opens an inline text box ("First Last…" / "Group name…" / "+1 name…"); Enter commits through `map-actions.ts:mapAddGroup/mapAddPlusOne` then `router.refresh()`. Hint "Tap + to grow a branch…".
(c) **Share the link** — `G/invite/_components/invite-panel.tsx:InvitePanel` rendered in the body (the head, finalize row and filter row stay above it). See section 2.

### 1.11 Sheets / hosts mounted at the bottom (all idle until opened)
- `C/add-guest-sheet.tsx:AddGuestSheet` — opened by the round + / the empty-list button. Bottom sheet "Add a guest": the **name box** (`C/capture-bar.tsx:CaptureBar withDoors={false}`, placeholder "Type a name…", Enter or the in-box round + adds via `inline-actions.ts:addSingleGuest`, shimmer "Adding…" is `sm:` only), one example line + **Tips ▾** (`<details>`; words from `L/quick-add-tips.ts:quickAddTips`), then the four add doors as rows (same `AddDoors rows`). Name box grammar: "Ana Cruz +1 groom vip #Barkada".
- `C/quick-add-sheet.tsx:QuickAddSheet` ("Add with details" door; modal titled "Quick add"): three native `<select>`s — Side (if sides) · Role · Group (+ "New group…" inline create strip with Create / X) — then First name / Last name inputs, duplicate-warning card with buttons (Add X too / Change X to Y / Different person / Keep as is), error line, footer button **Done**. Sticky context across rapid adds.
- `C/add-from-people-sheet.tsx:AddFromPeopleSheet` ("From your people"; `overlay-primitives:Drawer` = bottom sheet on a phone): title "Add from your people", text button "Close", search input "Search a name…", Groups pill row (samahan groups, only if any), **Side** PickMenu (only if sides), text button "Choose all N shown"/"Clear these N", checkbox rows (name · "from" line · greyed "Already here"), footer "N picked" + primary button "Add guest"/"Add N guests". `people-add-actions.ts:listPeopleYouCanInvite/addGuestsFromPeople`.
- `C/undo-toast.tsx:UndoToastHost` — bottom snackbar, 6 s: label · **Undo** (Undo2 icon + word) · X dismiss. One at a time.
- `MiniTour tourKey="customer_guest_invite_v1"` and `MiniTour tourKey="customer_guest_list_v1" after="customer_guest_invite_v1"` — see section 6. **Both currently render nothing** (`L/tip-popups.ts` `TIP_POPUPS_ON = false`).

### 1.12 "Your groups" sheet — `C/roster-controls.tsx:RosterFilters` (`Sheet … title="Your groups"`) hosting `C/groups-sidebar.tsx:GroupsSidebar layout="inline"`
Opened from Group ▾ -> "Make or rename groups…". Contents: one pill LINK per group (side dot · label · count; tapping it FILTERS the roster `?group=<id>`), each with a hidden-until-hover "⋯" kebab (`KebabMenu`: "Rename / Side", "Delete group" with `ConfirmForm`), a dashed pill **New group** (Plus icon) that opens `NewGroupForm` (text input, native Team-side `<select>` if sides, **Create group**), and `EditGroupForm` (input, select, Save / Cancel).

### 1.13 The open guest card (`?inspect=`) — `C/guest-card-body.tsx:GuestCardBody variant="panel"`
Phone: slide-in sheet over the list. Sticky header (`InspectorColumn`): eyebrow ("Guest · Bride's side" via `guestCardEyebrow`), name, reply badge ("✓ Attending" via `guestCardReply`), round X "Close details". Body top to bottom:
1. error banner / invite flash (e.g. "Done — a new QR and link. The old ones no longer work…").
2. Identity: 48 px photo/initials, "+N" ring pill, "Host" pill for the couple.
3. **TOP block** (`data-guest-card-top`): their Digital ticket thumbnail (`C/guest-ticket-parts.tsx:GuestTicketThumb`, "Tap to view" -> full-ticket modal with one button **Save ticket**; "No ticket" box when none) · eyebrow "Their ticket" · "What they see on their phone." (couple: "A host — nothing to send.") · **Invite** button + round **⋯** (`GuestMoreMenu`) + status line "Not sent · Not linked" / "✓ Sent Sep 30 · Linked" (`C/guest-invite-cell.tsx:GuestInviteCell layout="card"`). Couple rows with no account: **This is me** button.
4. **Autosaving form** (`C/guest-card-autosave.tsx:AutosaveForm`, state text "Saving…" -> "✓ Saved" for 2.2 s; every change also pushes an Undo snackbar): eyebrow "Name · mobile"; Prefix (dropdown) · First · Middle · Last · Suffix · "Shown as (optional)"; **Mobile** (tel). A linked person's name is read-only ("From their account"; `Edit on your profile ›` link for the person themself).
5. Closed accordion rows (native `<details name="guest-card-row">`, exclusive, `Fold`), each with a one-line summary on the right:
   - **Details**: Side (dropdown, if sides) · Group category (dropdown) · Role (dropdown, grouped; couple = read-only "Foundation · locked") · Also serves as (checkmark multi dropdown) · Groups (checkmark multi dropdown, or text "No groups yet — make one from the Guest list's Group dropdown.") · Tea-ceremony order (number, Chinese rites only) · **Passed away** switch.
   - **RSVP** (opens by itself if the guest left a note): Reply (dropdown) · "Answer recorded …" · **Invited to** — one SWITCH per part of the day (`C/invited-to-chips.tsx look="toggles"`) · Extra seats (dropdown None/+1…+4) · Meal (dropdown) · Dietary (text) · +1 state note.
   - **Seat**: Table (dropdown incl. "Not seated") · Attire · 3D seat plan (dropdown) · note.
   - **Photos**: three switches (tag consent · blur face on Live Wall · keep out of face recognition).
   - **Private note**: textarea.
6. "A note from {first}" read-only quote, when the guest wrote one.
7. **Access** fold (outside the autosave form): Access word + note + text link **"Change in People with access ›"** (`C/guest-access-control.tsx`, `ChangeAccessLink`); helper pieces (`C/guest-helper-access.tsx`); Account line ("Unlink account is in the ⋯ menu at the top."); for a non-couple guest: **Give the spot** form (only while the reply is "no reply": name input + primary button) and **Take this seat back** button; for the couple row: **Send {first} their sign-in link** button.
8. **Tags** read-only row (never opens).
The card's ⋯ (`GuestMoreMenu deletable`): Write to NFC · New QR · Unlink account (only while an account holds it) · Delete guest. New QR / Unlink open a confirm sheet (full-width "Make a new QR"/"Unlink account" + "Cancel"); Delete opens `DeleteGuestSheet`.

---

## 2. SUB-ROUTES / DOORS (table)

| Route (under `/dashboard/<id>/`) | File | How entered | What it is | Relation to the page |
|---|---|---|---|---|
| `guests` | G/page.tsx | bottom-bar Guests; Home "Add guests" Next card; Maker "Guests and replies" row (`launch/page.tsx`); Details "Open Guest list" (`details/page.tsx`); after-event summary "Open the guest list" (`_components/after/finished-event-summary.tsx`); Home day-of/after "Planning tools" Guests mini-tile and "N guests haven't replied yet" row (`_components/event-dashboard.tsx`) | the roster | the page |
| `guests?inspect=<id>` | page.tsx + GuestCardBody | tap a name / white space of a row | slide-in guest card | same page, a param |
| `guests?gview=map` | C/guest-mind-map.tsx | ⋯ -> Mind map | mind map | body swap |
| `guests?gview=share` | G/invite/_components/invite-panel.tsx:InvitePanel | ⋯ -> Share the link (before event); Maker `maker-details.tsx` `sendHref` | share-the-link body | body swap, header stays |
| `guests/invite` | G/invite/page.tsx | no door found on the page; "sidebar and journey link there" (per roster-doors docblock); couple-only | same `InvitePanel` standalone with Back to guest list | duplicate surface of `?gview=share`. Existence of a live link to it: NOT VERIFIED |
| `guests/send` | G/send/page.tsx + send/_components/send-run.tsx:SendRun | InvitePanel black card "Send invites one by one"; ShareDropdown link; bulk bar **Invite selected** (`?ids=a,b,c`); Home "Send N invitations" Next card | one-by-one invite run on the couple's phone ("3 of 150 · Send to Maria -> Next") | stamps `invitation_sent_at` via `invitation/actions.ts:setGuestInvitationSent`, which makes "to invite" fall |
| `guests/claims` | G/claims/page.tsx (+ keep-quick-add.tsx, link-picker.tsx) | requests strip; InvitePanel pending link; check-in desk "pending" door; also embedded in Maker RSVP panel with `?maker=1` (`launch/page.tsx`, `details/_components/record-editor.tsx` import `RequestsPage`) | "Requests": big count + per-request Accept / Decline / Link | the reconcile queue for `entry_source='self_added_unlisted'` |
| `guests/import` | G/import/page.tsx, import-form.tsx | ⋯/+ sheet "Import a file" | 1 Get the file (Download for Excel / Numbers button; text links "Open in Google Sheets", "CSV") then 2 Upload (file input + **Check the file**) -> preview ("We found N guests · M need a look") -> **Add N guests** / **Choose another file** | add door |
| `guests/quick` | G/quick/page.tsx, quick/_components/quick-add-list.tsx | "Paste many names" | "List your guests, one row at a time." typed list -> **Upload to guest list** | add door; its footer links to `guests/new` and `guests/import` |
| `guests/new` | G/new/page.tsx | **no door from the guests page** (only `quick/page.tsx` footer "Add full guest" and `website/widgets/page.tsx`) | the FULL add form "Add a guest" (native selects, radio pill row for extra seats, chips for Invited to, RSVP, meal, notes) | orphaned from the page it belongs to; "Add with details" opens the smaller `QuickAddSheet` instead |
| `guests/[guestId]` | G/[guestId]/page.tsx | name `InspectorTrigger` href fallback (modified click / no layout); old links | the same `GuestCardBody variant="page"`, with "‹ Back to guest list" | same card, standalone |
| `guests/checkin` | G/checkin/page.tsx + checkin/_components/checkin-desk.tsx | "Scan tickets" door / "Who came" (after event); `?gview=checkin` redirect; `clearance/page.tsx` "Close check-in" | door crew's desk: Arrived N / M attending bar, **Scan a guest's QR** (camera), NFC reader, name search "No QR on hand? Search their name…", **Mark arrived**, Undo, recent arrivals | Check-in is ALSO a column of the roster from the event day |
| `guests/souvenirs` | G/souvenirs/page.tsx, souvenirs/_components/souvenir-desk.tsx | link at the bottom of `checkin/page.tsx` only | "Souvenir table" scan/search desk, "Souvenir given · time" | child of check-in |
| `guests/tea-ceremony` | G/tea-ceremony/page.tsx | Home tile for Chinese/Tsinoy events only (`dashboard/[eventId]/page.tsx` `isChineseEvent`) | tea ceremony serving order | guarded by ceremony |
| (Wedding March) | `detailsItemHref(eventId,'march')` -> Maker Details | `?gview=walk`, `?view=march` redirect only | the march lives in the Maker; no door on the page | removed from the Guest list 2026-09-29; actions `march-actions.ts`, `entourage-order-actions.ts`, `pair-actions.ts` still sit in G |
| (Seat plan / Arrange the room) | Maker Details > Your event > Seat plan | none on the page (door removed) | | `seating` redirects for the couple |
| (RSVP sheet) | NOT FOUND as a page under guests/**. "RSVP" on this page = the RSVP column/pill, the card's RSVP fold, and the Maker's RSVP panel (embeds claims) | | | |
| (People with access) | `peopleWithAccessHref(eventId)` (L/people-with-access-href) | Access column word (co-host) and card's "Change in People with access ›" | where Access is set | link out |
| (Hosts) | `/hosts` | redirect for a limited helper / `?gview=hosts` | | |

Home (phone first screen, `_components/home-first-screen.tsx:HomeFirstScreen`) touches guests in three ways: the one **Next card** (kind `guests` "Add your guests" -> `/guests`; kind `invite` "Send N invitations" -> `/guests/send`; `L/home-first-screen.ts`), three PLAIN numbers (days · "coming" · "no reply"; not links, "—" when unread), and the Maker door. Only in the day-of/after receded views does the old `EventDashboard` appear (inside a `<details>`), carrying the **Guests mini-tile** with an animated `CountUp` of attending + a segmented reply bar.

---

## 3. ROW ACTIONS (table) — phone roster row `MobileListRow` in `C/guest-list-multiselect.tsx`

Row anatomy: [avatar/side control] [name (display font) + ONE sub-line] [reply pill at right] ... dashed line ... [ONE column cell, picked by Show ▾].

| Label / affordance | Control type | What it does |
|---|---|---|
| Whole-row long-press (480 ms, haptic 12 ms) | GESTURE ONLY — no visible control anywhere starts it (`guestSelection.enter()` is called nowhere else) | enters select mode; row ticked; shows round checkboxes + the bulk bar |
| Tap the name | link-styled `InspectorTrigger` (text, no icon) | opens the guest card sheet (`?inspect=`) |
| Tap white space of the row | gesture on `data-guest-row` (`C/row-tap.ts:isWhiteSpaceTap`) | same as name; in select mode it ticks the row |
| Avatar (photo or side-tinted initials) | icon-only button (`SideChipEditor`, aria "Change {name}'s side") — only if the event has sides | popover list Bride / Groom / Both (+ side swatch); optimistic + Undo snackbar |
| Role text ("Best Man", "Guest") | text button (`RoleChipEditor`, aria "Change {name}'s role") | popover: sections with option rows; either-or pairs as ONE row with two buttons ("Best Man or Best Woman"); bottom text button **Rename this role** -> inline two-field form (Save / Use "usual" / Cancel). Bride/groom: `LockedChip` that explains why on tap |
| Group names (plain text, max 10 ch) | text; an `x` icon button appears ONLY while that group is the current filter | removes from group (`removeGuestFromGroup`) |
| Dashed round "+" | icon-only button (`AddToGroupControl`, aria "Add {name} to a group") | popover list of groups for their side; "New group…" inline input + round Plus/X buttons |
| "+N (K named)" / "+2 · TBA" | plain text on the phone sub-line | read-only (the +N editor exists only as the `plus` column) |
| "+1 of Ana" | plain text | read-only; the row is indented |
| "· Table 3" | plain text | read-only (seat is changed in the card's Seat fold or bulk "Set table") |
| Reply pill (Attending / No reply / Not coming / Maybe; "Always" for hosts) | pill button (`RsvpChipEditor`, aria "Change {name}'s RSVP"); hidden when the one column already IS RSVP | popover Attending / No reply / Not coming (+Maybe if held). Declining frees the seat and the Undo snackbar says "· Seat T3 freed". Bride/groom locked |
| Column cell = **Invite** (default while anyone is unsent) | dark pill button **Invite** (word, no icon) + round **⋯** icon button + status text | Invite opens a popover: phone = **Share message + ticket** (waits for the ticket file, "Getting their ticket…") and **Copy invitation link** (Link2 icon); computer/refused-share = 3 numbered steps Copy message / Copy ticket / Mark as sent (+ Undo). ⋯ = `GuestMoreMenu`: Write to NFC · New QR · Unlink account (each icon+word list items) |
| Column cell = Invite for a host | text "Host" + "Linked/Not linked" | none |
| Column cell = RSVP | same reply pill | as above |
| Column cell = Access | text link (co-host, couple viewer) or plain text; nothing for "None" on a phone | link to People with access |
| Column cell = Check-in (from event day) | pill button "Check in" / "✓ In 9:41 AM" (`C/guest-checkin-cell.tsx`) | `checkInGuest` / `undoCheckIn`, optimistic |
| Column cell = Seat | text "T3" / "~T3" (suggested) / "—" | read-only |
| Column cell = Side / Role / Groups / +N | the chip editors above (`+N`: popover None/+1…+4; locked chip once the list is finalized) | as above |
| Column cell = Account | text "Linked" / "Not linked" / "—" | read-only |
| Column cell = Contact | text link (`tel:`) | calls |
| Swipe left | GESTURE (touch) revealing an 84 px red BUTTON "Delete" (Trash icon + word) | opens `DeleteGuestSheet` ("Delete {name}?" body; red **Delete**, **Cancel`) -> soft delete -> Undo snackbar "1 guest deleted". Not for bride/groom |
| "N named · M allowed" note under a row | text + a text-link button **Delete** per named +1 (underlined, no icon) | `DeleteGuestButton` -> same delete sheet |
| Section heading | full-width button (chevron + label + count) | fold / unfold the section (client only, resets on reload) |

Select mode (checkbox per row; sub-line column hidden) -> **bulk bar** `RosterBulkBar` (fixed above the bottom dock, dark rounded bar):
`N selected · M not yet invited` · text buttons **Select all N** and **Clear** (or **Done** in select mode) · **Invite selected** (link pill -> `/guests/send?ids=`) · **Set group ▾** (PickMenu: each group + "New group…" -> sheet with Group name input, native Team-side select, **Create + Add N** / **Cancel**) · **Set table ▾** (PickMenu: No table + tables) · **⋯** (PickMenu, grouped: Set side · Set role · Mark invited · Delete N guests). Group/table/side/role apply at once, no Apply button (`groups-actions.ts:bulkApplyRoleAndGroup`).

Other row-adjacent actions: **Undo** on the snackbar; card **⋯** (above); card **Invite**; request cards **Accept / Decline / Link**; check-in desk **Mark arrived / Undo**.

---

## 4. NUMBERS / COUNTS / METERS

| Where | What | Animated? | Notes |
|---|---|---|---|
| Counts line (`RosterCountsLine`) | attending · not coming · no reply · to invite · requests | NO (server text) | `stats` from `L/guests.ts:fetchGuestsByEventMeasured` -> `.stats`; "Maybe" is not on the line; hidden if read refused. "to invite" = living non-couple guest, not sent, not declined (`page.tsx` `toInvite`) |
| "N of M shown" | filtered count prefix | NO | |
| sr-only h1 | "N guests" | — | the only place the total appears on a phone |
| Requests strip | badge N + "N request(s) to join" | NO | |
| Section headings | count per section | NO | |
| Computer-only `C/roster-meters.tsx:RosterMeters` (`hidden lg:block`) | **Guest target** "X of Y pax · N listed" bar (only if `events.estimated_pax` set; `L/guests.ts:computePaxProgress`; "Now planning for X · N over your Y minimum" when exceeded) and **Confirmations** "N of M · P% · K plus-ones" 3-segment bar (attending / maybe / declined) | NO CSS transition | NOT on a phone |
| Bulk bar | "N selected", "M not yet invited", "Select all N", "Delete N guests", "New group for N guests", "Create + Add N" | NO | |
| Invite cell | "✓ Sent Sep 30" / "Not sent" + "· Linked/Not linked" | NO | |
| Check-in cell | "✓ In 9:41 AM" | NO (optimistic flip) | |
| +N text | "+3 (2 named)" / "+2 · TBA" / "3 named · 1 allowed" | NO | `L/extra-seats.ts` |
| Finalize | "your suppliers price for N heads" | NO | |
| Wrap strip | "N people checked in on the day." | NO | |
| Autosave | "Saving…" -> "✓ Saved" (2.2 s) | text swap | |
| Undo snackbar | 6 s timer | enter animation `gl-toast` | |
| Roster entrance | `.gl-settle`, `.gl-settle-delayed`, `.sn-lens-swap` cross-fade on any filter change | YES (CSS; frozen under prefers-reduced-motion per page comments) | |
| `guests/claims` | giant serif count "N asked to join" (text-7xl), "0" when none | NO | |
| `guests/send` | "3 of 150", "N sent · M skipped" | NO | |
| `guests/checkin` | "Arrived N / M attending" + progress bar | YES — bar width `transition-[width] duration-500` | |
| `guests/souvenirs` | mono tabular count | NO | |
| Home first screen | "coming", "no reply" (plain), days | NO | "—" when unread |
| Home day-of/after `EventDashboard` Guests tile | attending number + 3-state bar + legend | YES — `CountUp value={stats.attending} delayMs={600}` | only in the receded "Planning tools" `<details>` |

---

## 5. CHOICE SETS (dropdown vs pills vs tabs)

DROPDOWN (the shipped `website/editor/_components/pick-menu.tsx:PickMenu`, anchored list, ▾ button): Sort ▾ · RSVP ▾ · Side ▾ · Role ▾ · Group ▾ · Show ▾ (phone column) · bulk Set group ▾ / Set table ▾ / ⋯ · AddFromPeople Side · card `FormPick` (`C/card-fields.tsx`: Prefix, Side, Group, Role, Also serves as [multi, checkmarks], Groups [multi], Reply, Extra seats, Meal, Table, Attire) · column-header dropdowns on desktop (`ColumnPick`) · send-run "Who to send to".
POPOVER LISTS (option rows, one list, not pills): row Side / RSVP / +N / Role / Add-to-group popovers (`C/chip-editors.tsx:OptionRow`); ⋯ lists (`GuestMoreMenu`, Invite popover).
NATIVE `<select>` (a dropdown, but not PickMenu): `C/quick-add-sheet.tsx` (Side, Role, Group), `C/groups-sidebar.tsx:TeamSideSelect`, `C/guest-list-multiselect.tsx:NewGroupInlineForm` (Team side), `G/claims/keep-quick-add.tsx` (Role), `G/new/page.tsx` (Side, Group, Role, RSVP, Meal).
SWITCHES (yes/no): card "Passed away", Photos x3, "Invited to" per part of the day (`.sn-switch`).
SEGMENTED / TABS: roster doors `.sn-seg` nav = List · Mind map · Share the link (owner-approved "sections = ONE segmented control style", 2026-10-04); Mind map lens `role=tablist` "Side + group"|"Groups" / "Entourage" (`C/guest-mind-map.tsx`); either-or role pair inside the Role popover (`EitherOrRow`).
PILL ROWS (a set of choices drawn as pills): see section 6.

---

## 6. FIRST-VISIT TOURS, FEATURE FLAGS, "BREAKS THE RULES"

### First-visit tours (mounted at the bottom of `G/page.tsx`)
- `MiniTour tourKey="customer_guest_invite_v1"` (`L/tours.ts`): 4 slides — Each guest has their own ticket · Tap Invite to send it · On a computer · Replies update here by themselves.
- `MiniTour tourKey="customer_guest_list_v1" after="customer_guest_invite_v1"`: 4 slides — Everyone in one list · Find anyone fast · Send invitations, see replies · Check-in on the day. Waits until the invite tour is seen.
- Both are `app/_components/mini-tour:MiniTour` (server) -> `GuidedTour`; reads `users.tour_seen_keys`. **`L/tip-popups.ts` `TIP_POPUPS_ON = false` on origin/main, so NEITHER tour renders for anyone right now** (the guard returns before any read). Card/route tours: NOT FOUND for the sub-routes.

### Feature flags / conditions that change what renders
- `L/tip-popups.ts:TIP_POPUPS_ON` (false) — tours off.
- `eventHasSides(resolveRoleSet(roleSetKey))` (`L/guest-side-question`) — Side dropdown, Side sort, side headings, Side column, bulk "Set side", group Team-side field, card Side fold all disappear for birthday/simple events (`SIDELESS_SIDE` still written).
- Event lifecycle (`L/day-of-mode:getMenuLifecyclePhase`): `finished` (after) -> wrap strip, Share the link tab becomes Scan tickets + Share menu, + button relabelled, empty-state copy changes; `checkinOpen` (`phase !== 'plan'`) -> Check-in column exists and leads.
- Role set: Role lenses and bulk role sections per event type (`viewFiltersFor`, `bulkRoleSectionsFor`); Muslim weddings add Nikah Principals; Chinese/Tsinoy add tea-ceremony field/tile; INC note.
- `finalize.locked` — +N editors become locked chips; Finalize row flips to Reopen; guests cannot reply on the event page.
- `viewer.isCouple` (`canManageAccess`) — Access is a link only for co-hosts; "Linked" is known only to them; helper pieces on the card couple-only.
- `NEXT_PUBLIC_NFC_WRITE_ENABLED` (`L/nfc-write-flag.ts`, read by `app/_components/nfc-write-button.tsx`) — "Write to NFC" line in every ⋯ list; docblock says OFF until enabled. **Prod value: NOT VERIFIED** (a code default is not a prod value).
- `pendingClaimsCount > 0` — Requests strip; `joinUrl` exists — Share menu after the event; `invitationBase` null -> Invite column says "—"/"No link yet".
- Refused reads (`guestsMeasured`, `accessMap`, `checkins`, `linkedGuestIds`) degrade to "—"/no count, never 0.
- Delegate without `guest_list` area -> redirect to `/hosts`.

### BREAKS THE RULES (file:symbol)
(Page already FOLLOWS: "supplier" in the invite panel's crew-QR line; "event" in tours/card copy mostly; one PickMenu per filter; the empty list has ONE button "Add a guest"; no email to guests.)

1. **"celebration" (user-visible)** — `G/page.tsx:guestListErrorCopy` `invalid_role`: "That role isn't available for this celebration — pick one from the list."
2. **Edit-in-X / go-elsewhere links** — `G/invite/_components/invite-panel.tsx:InvitePanel`: "Change in Event Hub Maker ↗" (theme line), row "Change in Event Details" (how guests get in), "Open your Event Hub settings"; `C/guest-access-control.tsx` + `app/dashboard/[eventId]/_components/coordinator-seat-controls.tsx:ChangeAccessLink` "Change in People with access ›" (card) and `C/guest-access-cell.tsx:GuestAccessCell` (the co-host word is a link, aria "Change it in People with access"); `C/guest-card-body.tsx:GuestCardBody` "Edit on your profile ›" and "No groups yet — make one from the Guest list's Group dropdown."; `C/send-invite.tsx` + `G/send/_components/send-run.tsx` + `G/send/page.tsx` send the couple to the "Invitation page" to re-issue/set an address.
3. **A set of choices as a pill row** — `C/add-from-people-sheet.tsx:AddFromPeopleSheet` samahan "Groups" pills (`aria-pressed`); `C/groups-sidebar.tsx:GroupsSidebar layout="inline"` group pill links in the "Your groups" sheet (duplicates Group ▾ and filters on tap); `C/chip-editors.tsx:EitherOrRow` two-button pair in the role popover; `C/guest-mind-map.tsx:GuestMindMap` lens tablist; `G/new/page.tsx` extra-seats radio pills + `C/invited-to-chips.tsx:InvitedToChips` default `look="chips"`.
4. **Native `<select>` instead of the one PickMenu** — `C/quick-add-sheet.tsx:QuickAddSheet`, `C/groups-sidebar.tsx:TeamSideSelect`, `C/guest-list-multiselect.tsx:NewGroupInlineForm`, `G/claims/keep-quick-add.tsx:KeepQuickAdd`, `G/new/page.tsx` (two dropdown styles on one page).
5. **Gesture-only controls (not buttons)** — selecting rows = long-press only (`MobileListRow` `startPress` -> `guestSelection.enter`; no Select button exists); delete = swipe (`SwipeToDelete`, the button is hidden until swiped); the row-white-space tap (`C/row-tap.ts`). The kebab on a group pill is invisible until hover (`groups-sidebar:KebabMenu` `opacity-0 group-hover/pill:opacity-100`), so on touch it is effectively undiscoverable.
6. **Text-only controls (not icon + word)** — `RosterBulkBar` "Select all N" / "Clear" / "Done" (underlined text buttons); `FinalizeGuestListControl` "Reopen"; `PlusOneOverNote`/`DeleteGuestButton` "Delete"; `AddFromPeopleSheet` "Close" and "Choose all N shown"; `RenameThisRole` "Rename this role"; `SendRun` "Change your message"/"Go through the N skipped"; wrap strip "Who came"/"Write the story"; `EmptyState` "Show all N". Icon-only (no word): header + and ⋯, avatar side trigger, dashed + add-to-group, Invite ⋯.
7. **Word mismatch / orphan** — the door "Add with details" opens a modal titled "Quick add" (`QuickAddSheet`), while the real full form `G/new/page.tsx` ("Add a guest", "Add full guest") has no door from the guests page; the card eyebrow reads "Name · mobile"; "Role in wedding" label (`GuestCardBody`) is the only wedding-word in a card otherwise made event-neutral (shown when `hasSides`).
8. **Two phone surfaces for one job** — `?gview=share` body panel and the standalone `G/invite/page.tsx` both draw `InvitePanel`; `GuestMoreMenu`/Invite popover and `SendInviteActions` (run/claims) are two UIs over one sender.
9. **One button at a time for guests** — the card opens with ten-plus controls (Invite, ⋯, name x6, mobile, six folds) and the row carries up to five tappable chips plus a column control; Show ▾ lets a phone pick the one column but the sub-line still shows several editors. (Judgement call against the "one button at a time" rule, not a bug.)
10. **Stale comment that misdescribes the UI** — `C/quick-add-sheet.tsx` says "Mobile has no FAB… carousel's Add panel" (no such panel exists any more); `G/loading.tsx`/`FindAddRow` docblocks describe removed controls. Comments only, no user impact.
