# Button inventory — guests / Event Hub Maker (website) / launch

Area: `apps/web/app/dashboard/[eventId]/{guests,website,launch}/`. NOTE: the folder `hub/` does not exist in this archive (no such path under `dashboard/[eventId]/`); nothing inventoried for it. Paths below are relative to `apps/web/app/dashboard/[eventId]/`.
Colour key: T = terracotta, G = green, B = blue, A = amber, R = red, Grey = grey, link = pure page link (stays a link). "Today" column: button / text link / icon-only / clickable element.

# PART 1 — guests/

## guests/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add a guest / "Still adding someone? — the list is open" (header + icon, OpenAddGuestButton) | Opens the add-guest sheet | icon-only (+) | T |
| Phone "more" menu (GuestsPhoneMenu: sort, tabs, add doors) | Opens the phone overflow menu | icon-only | Grey |
| Who came | Go to check-in page | text link | link — stays a link |
| Write the story | Go to story page | text link | link — stays a link |
| "N requests to join … Review →" strip | Opens join-requests review page | clickable element (card link) | A |
| Share the link (details dropdown summary) | Opens share-link dropdown | button-styled summary (button-secondary) | Grey |
| Send invites one by one → | Go to send-invites page | text link | link — stays a link |
| Try again (guest list failed to load) | Reloads the guest list | button-styled link | A |
| Clear filters | Resets roster filters | button-styled link | Grey |
| Show all N | Resets filters, shows everyone | text link | Grey |
| Add a guest / Add someone who came (OpenAddGuestTextButton) | Opens the add-guest sheet | text button | T |

## guests/_components/guest-delete.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Delete (confirm; "Deleting…") | Permanently deletes the guest | button (pill) | R |
| Cancel | Closes delete confirm | button (pill) | Grey |
| Delete (text under card, aria "Delete {guestName}") | Opens delete confirm | text link-style button | R |

## guests/_components/view-switcher.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| List | Switch roster to list view | text link (segment, icon+word) | Grey |
| Mind map | Switch roster to mind-map view | text link (segment, icon+word) | Grey |

## guests/_components/guest-invite-cell.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Invite (aria "Invite {name} — sent {day}") | Opens the invite popover | button (pill, ink) | T |
| Share message + ticket / "Getting their ticket…" | Opens phone share sheet | button (row) | B |
| Copy message | Copies invite message | button (row) | Grey |
| Copy ticket | Copies the ticket image | button (row) | Grey |
| Undo | Marks invite as not sent | button | A |
| Mark as sent / "Saving…" | Marks invite as sent | button (row) | G |
| Copy invitation link | Copies the invitation link | button (row, icon+word) | Grey |

## guests/_components/guest-ticket-parts.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Ticket thumbnail (aria "View {name}'s ticket") | Opens the ticket preview | clickable element (image) | Grey |
| Close (backdrop) | Closes ticket preview | clickable element | Grey |
| Close (X) | Closes ticket preview | icon-only | Grey |
| More for {guestName} (…) | Opens ticket/QR actions menu | icon-only | Grey |
| Write to NFC tag (NfcWriteButton, row in menu) | Writes the guest link to an NFC tag | menu row button | Grey |
| Make a new QR | Opens new-QR confirm | menu row (icon+word) | T |
| Unlink account | Opens unlink-account confirm | menu row (icon+word) | R |
| Delete | Opens delete-guest confirm | menu row (icon+word) | R |
| Make a new QR / Unlink account (confirm submit) | Confirms the chosen action | button (pill) | G |
| Cancel (confirm) | Closes confirm | button (pill) | Grey |

## guests/_components/undo-toast.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Undo / "Undoing…" | Reverts the last change | button (icon+word, tinted) | A |
| Dismiss (X) | Closes the toast | icon-only | Grey |

## guests/_components/find-add-row.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Filter | Toggles the filter panel | button (pill) | Grey |

## guests/new/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| ‹ Back to guest list | Back to guest list | text link | link — stays a link |
| Save guest / "Saving…" | Saves the new guest | button (button-primary) | G |
| Cancel | Back to guest list without saving | button-styled link | Grey |

## guests/claims/link-picker.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Choose someone else (X) | Clears the picked guest | icon-only | Grey |
| {guest name} (search result) | Picks that guest to link | text list button | T |

## guests/invite/_components/invite-link.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Copy / Copied | Copies the invite link | button (icon+word) | Grey |

## guests/_components/groups-sidebar.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {group name} chip | Filters the roster to a group | text link (pill) | Grey |
| New group / Cancel (toggle, wide) | Opens/closes new-group form | button (icon+word) | T |
| Create a new group / Cancel new group (+ / X) | Opens/closes new-group form | icon-only | T |
| + new group (empty-state sentence) | Opens new-group form | text button | T |
| {group name} (list row) | Filters the roster to the group | text link | Grey |
| Actions for {group} (…) | Opens group actions menu | icon-only | Grey |
| Rename / Side | Opens group edit form | text menu button | Grey |
| Delete group / "Removing…" | Deletes the group (confirm dialog) | text menu button | R |
| Create group / "Creating…" | Creates the group | button | T |
| Save / "Saving…" | Saves group rename/side | button | G |
| Cancel | Closes group edit form | button | Grey |

## guests/quick/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to guest list | Back to guest list | text link (icon+word) | link — stays a link |
| Add full guest | Go to full add-guest form | text link (inline) | link — stays a link |
| import a CSV | Go to import page | text link (inline) | link — stays a link |

## guests/[guestId]/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| ‹ Back to guest list | Back to guest list | text link | link — stays a link |

## guests/souvenirs/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to guest list | Back to guest list | text link (icon+word) | link — stays a link |

## guests/invite/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to guest list | Back to guest list | text link (icon+word) | link — stays a link |

## guests/_components/guest-checkin-cell.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Check in | Checks the guest in | button (outline) | G |
| ✓ In {time} (aria "Undo {name}'s check-in") | Undoes the check-in | button (text) | A |

## guests/_components/add-from-people-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add from your people (opener; text or icon) | Opens add-from-people sheet | button (button-secondary) | T |
| Close | Closes the sheet | text button | Grey |
| {group name} chips | Filters people by group | button (chip) | Grey |
| Clear these N / Select all N | Toggles selection of shown people | text button | Grey |
| (person rows, checkbox) | Selects a person to add | checkbox label | Grey |
| Add guest / Add N guests / "Adding…" | Adds picked people as guests | button | T |

## guests/_components/finalize-guest-list-control.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Reopen / "Reopening…" | Reopens the finalized guest list | text button | A |
| Finalize guest list / "Finalizing…" | Locks guest list, stops replies | button | G |

## guests/_components/capture-bar.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add this guest (+) | Adds the typed name as a guest | icon-only | T |
| From your people (door) | Opens add-from-people sheet | icon-only (icon+word in phone ⋯) | T |
| Add with details (door) | Opens quick-add-with-details sheet | icon-only (icon+word in phone ⋯) | T |
| Import a file (door) | Go to import page | icon-only link (icon+word in ⋯) | T |
| Paste many names (door) | Go to paste-many-names page | icon-only link (icon+word in ⋯) | T |

## guests/_components/plus-one-seats-note.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (DeleteGuestButton per row — see guest-delete.tsx) | Deletes that plus-one guest | via shared component | R |

## guests/_components/overlay-primitives.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (Scrim, aria "Close") | Closes drawer/popover on outside tap | clickable element (invisible) | Grey |

## guests/_components/add-guest-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| + (OpenAddGuestButton, aria = label) | Opens add-a-guest sheet | icon-only | T |
| + {label} (OpenAddGuestTextButton) | Opens add-a-guest sheet | button (icon+word) | T |
| Close (X) | Closes add-a-guest sheet | icon-only | Grey |
| Tips (details summary) | Expands name-entry tips | text toggle | Grey |
| {doors} (From your people / Add with details / Import / Paste many) | Add routes inside sheet — see capture-bar.tsx | per capture-bar | T |

## guests/_components/guests-phone-menu.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| ⋯ (aria "More for the guest list") | Opens phone overflow sheet | icon-only | Grey |
| Close (X) | Closes the overflow sheet | icon-only | Grey |
| Sort dropdown (RosterSort) | Changes roster sort order | dropdown | Grey |
| {doors}: Roster · Wedding March · Invite guests · Who came etc. (from rosterDoors) | Switch view / go to door | text links (icon+word rows) | Grey (view tabs) / link (page doors) |
| {addDoors}: From your people · Add with details · Import a file · Paste many names | Add guests routes | rows (button / link) | T |

## guests/_components/guest-name-fields.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| View (possible duplicate, new tab) | Opens existing guest in new tab | text link | Grey |
| These are different people — continue | Dismisses duplicate warning | text button | Grey |

## guests/_components/roster-tabs.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Door tabs (Roster · Wedding March · Invite guests · Who came, from rosterDoors; icon+word) | Switch roster view / open door | text links (segmented) | Grey (views) / link (page doors) |
| Share menu / QR PDF door (SaveFileLink) | Share link dropdown / download QR PDF | clickable element | Grey |

## guests/_components/guest-access-cell.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {first}'s access: {word} | Go to People with access to change it | text link | link — stays a link |

## guests/invite/_components/regenerate-qr-button.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Regenerate QR / "Regenerating…" | Replaces the event QR code | button (icon+word) | A |

## guests/send/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Guest list | Back to guest list | text link (icon+word) | link — stays a link |
| Invitation | Go to invitation page | text link | link — stays a link |

## guests/send/_components/send-run.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Skip | Skips this guest | button (icon+word) | Grey |
| Next — {name} / Finish | Moves on to next guest | button (word+icon) | T |
| Go through the N skipped | Restarts run on skipped guests | button | T |
| Back to the guest list | Back to guest list | text link | link — stays a link |
| Invitation page | Go to invitation page | text link (inline) | link — stays a link |
| Change your message / Change the message | Opens inline message editor | text button | Grey |
| (inline message editor: Save / Cancel buttons — lines 198-206, sub-component) | Saves/cancels the invite wording | buttons | G / Grey |

## guests/_components/guest-mind-map.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Side + group / Groups (lens tab) | Switches mind-map lens | button (tab, icon+word) | Grey |
| Entourage (lens tab) | Switches mind-map lens | button (tab, icon+word) | Grey |
| Add a group / Add a +1 / Add a guest (+) ×2 (desktop + list) | Opens inline add at that node | icon-only | T |
| Expand / Collapse {node} (chevron) | Toggles a branch | icon-only | Grey |
| (inline name input; Enter commits, blur commits) | Commits the new node | text input | G |

## guests/_components/quick-add-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add with details (opener; text or icon) | Opens quick-add sheet | button | T |
| Close (backdrop) | Closes quick-add sheet | clickable element | Grey |
| Close (X) | Closes quick-add sheet | icon-only | Grey |
| Side / Role / Group (selects) | Pick side, role, group once | dropdown | Grey |
| Create (new group) | Creates the typed group | text button | T |
| Cancel new group (X) | Cancels new group entry | icon-only | Grey |
| ＋ Add {role} too — keep both roles | Adds a second role to existing guest | button | T |
| Change {name} to {role} | Changes existing guest's role | button | A |
| Different person | Adds anyway, not a duplicate | button | T |
| Keep as is | Skips the duplicate | button | Grey |
| Different person ×2 (true-dup branch, "＋ Different person") | Adds anyway | button | T |
| Keep as is ×2 | Skips the duplicate | button | Grey |
| Done / "Adding…" | Adds typed guest(s) and closes | button | G |

## guests/tea-ceremony/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to guest list | Back to guest list | text link (icon+word) | link — stays a link |
| Print (PrintButton) | Prints the serving order | button | Grey |
| Edit (per guest) | Opens guest card | text link | Grey |
| Add a guest | Go to new-guest form | text link | link — stays a link |

## guests/quick/_components/quick-add-list.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {guest name} / "(no name)" | Opens that row for editing | text button | Grey |
| Toggle edit for guest N (pencil) | Toggles row editing | icon-only | Grey |
| Remove guest N (X) | Removes row from the list | icon-only | R |
| Upload to guest list / "Uploading…" | Saves all rows as guests | button (icon+word) | T |

## guests/_components/chip-editors.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Locked chip (aria = label) | Shows locked value, explains why | clickable element (chip) | Grey |
| Side chip → options (Bride's / Groom's / Both) | Opens + picks guest's side | button (chip) + option rows | Grey |
| Plus-one chip → None / +1 / +2… | Opens + picks plus-one allowance | button (chip) + option rows | Grey |
| RSVP chip → Attending / Pending / Declined / Maybe | Opens + sets RSVP status | button (chip) + option rows | Grey |
| Role chip → role option rows | Opens + changes guest role | button (chip) + option rows | Grey |
| Either/or role buttons ({role label}) | Picks one of two roles | segmented button | Grey |
| Rename this role | Opens inline role rename | text button | Grey |
| Save / "Saving…" (rename role) | Saves the role name | button | G |
| Use “{usual}” | Restores the default role name | button | Grey |
| Cancel (rename role) | Closes rename | button | Grey |
| Add {guest} to a group (dashed +) | Opens group picker | icon-only | T |
| {group name} option rows | Adds guest to that group | menu row | T |
| Create group and add (+) | Creates group, adds guest | icon-only | T |
| Cancel new group (X) | Cancels new group name | icon-only | Grey |
| New group… | Opens new-group name entry | text button (icon+word) | T |

## guests/_components/roster-controls.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Sort (dropdown) | Sorts the roster | dropdown button | Grey |
| RSVP (dropdown: Everyone / Attending / Pending / Declined / Maybe) | Filters by RSVP | dropdown button | Grey |
| Side (dropdown: Both sides / Bride's / Groom's) | Filters by side | dropdown button | Grey |
| Role (dropdown) | Filters by role/view | dropdown button | Grey |
| Group (dropdown: All groups / groups / tags / "Make or rename groups…") | Filters by group; manage groups | dropdown button | Grey |

## guests/_components/guest-list-multiselect.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {Section name} header (chevron, e.g. "Bride's side · 12") | Collapses/expands a roster section | button (text+chevron) | Grey |
| Row checkbox (desktop table, mobile select mode) | Selects the guest for bulk actions | checkbox | Grey |
| Column picker (PickMenu "Column N shows") | Chooses which column to show | dropdown | Grey |
| Guest name (InspectorTrigger / name button) | Opens guest card / toggles selection | text link / button | Grey |
| Row chips: Side · Role · RSVP · Plus-one · Group (+) | See chip-editors.tsx | chips | Grey / T (add-to-group) |
| Check in cell (GuestCheckinCell) | See guest-checkin-cell.tsx | button | G |
| Access cell (GuestAccessCell) | Go to People with access | text link | link — stays a link |
| Invite (GuestInviteCell) | See guest-invite-cell.tsx | button | T |
| Select all N | Selects every guest in view | text button (bulk bar) | Grey |
| Done / Clear | Leaves select mode / clears selection | text button (bulk bar) | Grey |
| Invite selected | Go to send-invites for the selection | button-styled link | T |
| Set group (dropdown: groups + "New group…") | Puts selected guests in a group | dropdown button | T |
| Set table (dropdown: "No table" + tables) | Seats selected guests at a table | dropdown button | T |
| ⋯ More for the selected guests (side / role / "mark invited" / remove) | Bulk side, role, mark invited, remove | dropdown button | Grey (remove = R) |
| Create + Add N / Cancel (new-group form in bulk bar) | Creates group, adds the selection | button / button | T / Grey |
| Delete (swipe-reveal trash, aria "Delete {name}") | Opens delete confirm for the guest | icon-only | R |
| Remove from {group} (X on chip) | Takes guest out of a group | icon-only | R |
| Delete / Cancel in DeleteGuestSheet (bulk + swipe) | Confirms/cancels guest deletion | buttons | R / Grey |

## guests/_components/guest-card-body.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| This is me | Links this guest to your own account | button (SubmitButton) | G |
| Edit on your profile › | Go to profile page | text link | link — stays a link |
| Send {first name} their sign-in link / "Sending…" | Emails the guest a sign-in link | button (SubmitButton) | B |
| Give the spot / "Giving the spot…" | Hands the seat to another person | button (button-primary) | T |
| Take this seat back / "Taking back…" | New QR, unlinks their account | button (SubmitButton) | R |
| Fold rows: Details · RSVP · Seat · Photos · Private note · Access (summary) | Expands/collapses a section | clickable element (accordion summary) | Grey |
| (+ chips/menus from chip-editors, guest-ticket-parts, guest-delete) | See those files | — | — |

## guests/_components/send-invite.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Send to {first} / Send again / Send invite | Opens phone share sheet with invite | button (primary) | B |
| Copy message / Copied ✓ | Copies the invite message | button (icon+word) | Grey |
| Undo (after sent) | Marks invite as not sent | button (icon+word) | A |
| Mark as sent / "Saving…" (primary) | Marks the invite as sent | button (icon+word) | G |
| Mark as sent (quiet) | Marks the invite as sent | button (icon+word) | G |
| Save for every guest / "Saving…" | Saves the invite wording for all | button | G |
| Use our wording | Resets wording to default | button | Grey |

## guests/import/import-form.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Check the file / "Reading…" | Reads the uploaded file | button (button-primary) | T |
| Save {changes} / Add N guests / "Saving…" | Commits the import | button (button-primary) | G |
| Choose another file | Returns to the upload step | button (button-secondary) | Grey |

## guests/import/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| ‹ Back to guest list | Back to guest list | text link | link — stays a link |
| Download for Excel / Numbers | Downloads the template | button-styled link (button-primary) | Grey |
| Open in Google Sheets | Opens the template in Google Sheets | button-styled link | Grey |
| CSV | Downloads CSV template | text link | Grey |

## guests/invite/_components/invite-panel.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Send invites one by one → | Go to send-invites page | card link (dark) | link — stays a link |
| Copy message / Copied ✓ (CopyButton) | Copies the group invite message | button | Grey |
| Copy link (QR block, hideCopy variant) | Copies the join link | button | Grey |
| Regenerate QR | See regenerate-qr-button.tsx | button | A |
| Open your Event Hub settings | Go to Event Hub page | text link | link — stays a link |
| "{Guests get in} … Change in Event Details" | Go to RSVP page tool in Maker | card link | link — stays a link |
| N requests waiting for you to confirm | Go to join-requests page | card link | link — stays a link |
| Change in Event Hub Maker ↗ | Go to Maker theme | text link | link — stays a link |
| Event QR (crew pairing) | Go to event-qr page | card link | link — stays a link |

## guests/claims/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Undo ×2 (after Accept / after Decline) | Reverses the last accept/decline | button (SubmitButton pill) | A |
| Guest List | Back to guest list | text link (icon+word) | link — stays a link |
| Accept (details summary) | Opens accept form | pill summary | G |
| Add to my list / "Adding…" | Accepts request, adds guest | button (button-primary) | G |
| Decline / "Declining…" | Declines the request | button (pill) | R |
| Link (details summary) | Opens link-to-existing-guest form | pill summary | T |
| Link / "Linking…" | Links request to chosen guest | button (button-primary) | G |
| (also embedded: guest-invite/send-invite for accepted rows — see those files) | — | — | — |

## guests/souvenirs/_components/souvenir-desk.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Stop scanning | Stops the camera scanner | button (icon+word) | Grey |
| Scan a guest QR | Starts the camera scanner | button (icon+word) | T |
| {guest name} (+ Given / table) rows | Selects the guest | list button | Grey |
| Undo | Reverses "souvenir given" | button (icon+word) | A |
| Confirm souvenir given | Records the souvenir handed over | button (icon+word) | G |

## guests/checkin/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to guest list | Back to guest list | text link (icon+word) | link — stays a link |
| Souvenir table → | Go to souvenirs page | text link (icon+word) | link — stays a link |

## guests/checkin/_components/checkin-desk.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Stop scanning | Stops camera scanner | button (icon+word) | Grey |
| Scan a guest’s QR | Starts camera scanner | button (icon+word) | T |
| Stop (NFC) | Stops NFC reading | button | Grey |
| Read a guest’s tag | Starts NFC tag reading | button (icon+word) | T |
| {guest name} (search results) | Selects the guest to check in | list button | Grey |
| {DOOR_WORDS.pendingOpen} (join-request notice) | Go to join-requests page | text link (button-styled) | link — stays a link |
| Not now | Dismisses the scan result | button | Grey |
| {DOOR_WORDS.next} (scan result) | Dismisses result, ready for next | button | Grey |
| Undo (selected guest) | Reverses the check-in | button (icon+word) | A |
| Mark arrived | Checks the guest in | button (icon+word) | G |
| Undo check-in for {name} (↶, recent list) | Reverses that check-in | icon-only | A |

## guests/_components/invited-to-chips.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {part of the day} Yes/No toggles (Ceremony, Reception, …) | Sets which parts the guest is invited to | toggle / checkbox chip | Grey |

## guests/_components/card-fields.tsx · phone-show-pick.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Card field dropdowns (PickMenu) | Picks a guest-card field value | dropdown | Grey |
| What each row shows (phone) | Chooses the roster column shown | dropdown | Grey |

## guests/claims/keep-quick-add.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Role (select) | Picks role for the accepted request | dropdown | Grey |
| (name input) | Types name to accept | text input | — |

# PART 2 — website/ (the Event Hub Maker pages and editor)

## website/our-story/milestones-field.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Remove milestone N (X) | Removes a milestone row | icon-only | R |
| Add a milestone | Adds a blank milestone row | button (icon+word) | T |

## website/our-story/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Open the Event Hub Maker / Apply it in the Event Hub Maker | Go to the Maker | text link | link — stays a link |
| The words your invitation weaves into its story paragraph (summary) | Expands story-words form | clickable element | Grey |
| Save our story / "Saving…" | Saves the story | button (button-primary) | G |

## website/site-chrome/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Save music & video / "Saving…" | Saves music and video settings | button (button-primary) | G |

## website/_components/hub-draft-button.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Restore / Undo / Apply (DraftButton; icon-only on the Maker bar, icon+word elsewhere; disabled shows an InfoTip) | One Maker-toolbar draft control | button (pill) / icon-only | Restore = A, Undo = A, Apply = T |
| Why {label} is off (InfoTip) | Explains why it is disabled | icon-only | Grey |

## website/privacy/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Manage launch / Change schedule / Launch or schedule | Go to editor launch panel | button-styled link (icon+word) | link — stays a link |
| Visibility cards: Public / (others) radio cards | Picks who can open the page | radio card | Grey |
| Save changes / "Saving…" | Saves visibility | button (button-primary) | G |
| Back | Back to Event Hub | text link | Grey |
| Close it to guests only / Let anyone with the link watch | Toggles live-media sharing | button (button-primary) | G |
| Stories (inline) | Go to /realstories page | text link | link — stays a link |
| Turn off featuring / Feature our {event} | Opts in/out of public Stories | button (button-primary) | G |

## website/living-hero/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to hero photo | Back to hero photo | text link (icon+word) | link — stays a link |

## website/our-photos/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Save gallery / "Saving…" | Saves the photo gallery | button (button-primary) | G |

## website/_components/website-pro-lock.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Unlock Event Hub PRO ↗ | Go to PRO upsell | button-styled link | T |
| Back to Event Hub | Back to Event Hub | text link (icon+word) | link — stays a link |

## website/hero-photo/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to Event Hub | Back to Event Hub | text link (icon+word) | link — stays a link |
| Make it move → (card) | Go to Living hero page | card link | link — stays a link |
| Remove / "Removing…" | Removes hero photo | button (icon+word) | R |
| Cancel | Back to Event Hub, discard | text link / button-styled | Grey |
| Save photo / "Saving…" | Saves the hero photo | button (icon+word) | G |
| (file chooser — see FileUpload) | Picks a photo | file input | Grey |

## website/photo-moments/_components/photo-moments-editor.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add a moment | Adds a new moment row | button (icon+word) | T |
| Save changes / "Saving…" | Saves the moments | button | G |
| Move up (↑) | Moves the moment up | icon-only | Grey |
| Move down (↓) | Moves the moment down | icon-only | Grey |
| Remove moment (trash) | Deletes the moment | icon-only | R |

## website/stories/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to your {noun} Event Hub | Back to Event Hub | text link (icon+word) | link — stays a link |
| Read it | Opens the public story page | text link | link — stays a link |
| Add to my day / Take off my day / "Saving…" | Toggles a story on the host's page | button (SubmitButton) | T (add) / R (take off) |

## website/_components/apply-pro-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Close (X) | Closes the Apply sheet | icon-only | Grey |
| Go to {effect} ↗ | Jumps to that Pro effect in the Maker | text button | Grey |
| Remove {effect} (X) | Takes the Pro effect out | icon-only | R |
| Apply / "Applying…" | Publishes the draft | button (button-primary) | T |
| Unlock Pro and Apply · {price} | Buys Pro, then applies | button-styled link | G |
| Apply without the Pro effects / "Applying…" | Publishes without Pro effects | button | T |

## website/_components/hub-draft-bar.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Undo (icon, bar) | Undoes the last draft change | icon-only | A |
| Preview menu (⋯ beside Undo, from shell) | Opens preview options | icon-only | Grey |
| Apply (check icon + count badge) | Opens Apply sheet | icon-only (filled circle) | T |
| Restore (row in ⋯ menu, registered with shell) | Restores the last applied page | menu row | A |
| Close (X, draft sheet) | Closes "Your draft" sheet | icon-only | Grey |
| Get Event Hub Pro | Go to Pro upsell | text link | link — stays a link |
| Reset {stage}… | Opens reset confirm | text button | A |
| Reset in my draft | Resets stage to our design (in draft) | button | A |
| Cancel | Closes reset confirm | text button | Grey |

## website/our-story/_components/love-story-live.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (form onClick: any inner button triggers autosave) | Autosaves story to the draft | clickable element | — |

## website/our-story/_components/chapter-moments.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {date} {moment line} (+ "Hidden") | Opens that moment for editing | list button | Grey |
| Add a moment | Opens the add-moment sheet | button (icon+word) | T |

## website/our-story/_components/love-story-pro-line.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {LOVE_STORY_PRO_CTA} · {price} | Go to Pro unlock | text link | T |

## website/our-story/_components/moment-order-cards.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {year} {title} (card) | Jumps to that moment on the page | text link (anchor) | link — stays a link |
| Move {title} (grip; drag or arrow keys) | Reorders the moment | icon-only (drag handle) | Grey |

## website/our-story/_components/panel-follows-the-page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (document click listener — no visible control) | Scrolls panel to the clicked chapter | none | — |

## website/our-story/_components/moment-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {trigger}: Edit / Add a moment (icon+word) | Opens the moment sheet / in-place editor | button (pill, icon+word) | Grey (Edit) / T (Add) |
| Close (X) | Closes the moment sheet | icon-only | Grey |
| Date-precision pills (e.g. Day / Month / Year) | Sets how exact the date is | segmented buttons | Grey |
| Not now | Closes the sheet without saving | text button | Grey |
| Keep this moment / "Keeping…" | Saves the moment | button (button-primary) | G |

## website/our-story/_components/love-story-book.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Pick from our events | Jumps to the pick section | pill link (anchor) | link — stays a link |
| Show it on our Event Hub | Jumps to Event Hub section | pill link (anchor) | link — stays a link |
| Open in Event Hub Maker ↗ | Go to the Maker | pill link | link — stays a link |
| Change in Event Hub Maker ↗ | Go to Maker theme | text link | link — stays a link |
| {chapter years} / {chapter label} (timeline) | Jumps to that chapter | text link (anchor) | link — stays a link |
| Edit (per moment; opens MomentSheet) | Opens the moment for editing | pill button (icon+word) | Grey |
| Show on the Event Hub / Keep off the Event Hub | Toggles a moment's visibility | pill button (icon+word) | Grey |
| Remove (per moment) | Deletes the moment | pill button (icon+word) | R |
| turn it on in the Event Hub Maker | Go to the Maker | text link (inline) | link — stays a link |
| See it on your Invitation ↗ | Go to invitation page | text link | link — stays a link |

## website/our-story/_components/pick-from-our-events.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (photo checkboxes) | Picks photos to add | checkbox | Grey |
| Use these / "Adding…" | Adds the picked photos | button (button-primary) | T |

## website/widgets/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Preview as {guest name} | Opens guest preview in new tab | button-styled link (mulberry) | Grey |
| Preview as guest (disabled) | Disabled until a guest exists | button (disabled) | Grey |
| + Add your first guest to enable preview | Go to add-guest form | text link | link — stays a link |
| Edit content (icon+word) | Go to editor for that section | text link | link — stays a link |
| Visible / Hidden (per section) | Toggles section visibility | button (SubmitButton, icon+word) | Grey |
| Move {section} up | Moves section up | icon-only | Grey |
| Move {section} down | Moves section down | icon-only | Grey |
| Auto / Shown / Hidden (per section, 3-way) | Sets browse-mode for the section | segmented buttons | Grey |

## website/living-hero/_components/living-hero-studio.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Make it move | Bakes the video into a looping hero | button (primary) | T |
| Use a photo instead | Switches to a still photo hero | button (ghost) | Grey |
| Cancel | Resets the studio | button (ghost) | Grey |
| Save as my hero | Saves the looping hero | button (primary) | G |
| Start over | Resets the studio | button (ghost) | Grey |
| Change it again | Resets after saving | button (ghost) | Grey |
| Try again (error) | Resets after an error | button (ghost) | A |
| (file picker for the video) | Chooses the video | file input | Grey |

## website/editor/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (page mounts ButtonsLookRow, LaunchStdButton, and the panels — see those files) | — | — | — |

## website/editor/_components/post-event-preset-tiles.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {preset name} tile (thumbnail + name) | Picks that post-event page preset | button (tile) | T |

## website/editor/_components/maker-canvas-guard.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Back to your page | Returns the canvas to the Maker | button | Grey |

## website/editor/_components/inspector-kit.tsx (shared primitives used by every editor panel)
| Label | What it does | Today | Colour |
|---|---|---|---|
| Inspector tabs ({tab labels}; dropdown on phone) | Switches inspector tab | button (tab) / dropdown | Grey |
| ISeg segment ({label}) | Picks one option in a segmented set | button (segment) | Grey |
| {label}: smaller (−) | Decreases a value | icon-only | Grey |
| {label}: larger (+) | Increases a value | icon-only | Grey |
| IReset ({label}, ↺ icon+word) | Resets a setting to automatic | button (icon+word) | A |
| IButton ({label}; "fill" = dark) | Generic inspector action | button | per use |

## website/editor/_components/scene-animate-tab.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Reset how it moves | Clears this scene's motion | button (IReset) | A |
| How it moves (dropdown) | Picks the motion preset | dropdown | Grey |
| Timing (dropdown) | Picks motion timing | dropdown | Grey |
| Back to Auto (Comes in) | Clears the "comes in" effect | button (IReset) | A |
| Back to Auto (Goes out) | Clears the "goes out" effect | button (IReset) | A |
| How its parts arrive (dropdown) | Picks part sequencing | dropdown | Grey |
| Into the next scene (dropdown) | Picks the scene transition | dropdown | Grey |
| Speed (dropdown) | Picks transition speed | dropdown | Grey |
| Preview | Plays this scene and next transition | button (IButton, icon+word) | Grey |

## website/editor/_components/motion-fx-rows.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Fade / Move / Size / Blur / Speed (dropdowns) | Sets in/out effects | dropdown ×5 per end | Grey |

## website/editor/_components/scene-background-row.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| No background / Plain / Diagonal / Glow / Opaque / Frosted / Upload media (swatch tiles) | Picks the scene background style | button (tile) | Grey |
| Just this scene | Applies background to this scene only | button (IButton) | T |
| Every scene | Applies background to every scene | button (IButton, dark) | T |
| Own background · ↺ Use the Event Hub’s | Drops this scene's own background | button (pill) | A |
| Make this one different | Gives this scene its own background | text button | T |
| (colour well — see colour-well.tsx) | Picks the tint | colour picker | Grey |
| Ready-made backgrounds (photo tiles) | Uses a ready-made photo | image button | T |
| Photo / Clip tiles (uploads, photo choices) | Uses that photo/clip as background | image button | T |
| Upload a photo or clip | Uploads media | button (file upload) | T |
| Remove this scene’s photo / video | Takes media off the scene | button (IButton) | R |
| How the photo moves (dropdown) | Picks photo motion | dropdown | Grey |
| Keep area N of 9 in frame (3×3 grid) | Sets the photo focal point | icon-only ×9 | Grey |
| As it is / Closer / Closest | Sets photo zoom | segmented buttons | Grey |
| Box shape (e.g. Framed …) | Sets the scene box shape | segmented buttons | Grey |

## website/editor/_components/scene-inspector.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Arrangement options (HUB_ARRANGEMENT_LABEL) | Picks how the scene is arranged | segmented buttons | Grey |
| Shown / Auto / Hidden (🔒 when blocked) | Sets scene visibility mode | segmented buttons | Grey |
| Shown / Hidden (eye) | Shows/hides the scene | segmented buttons | Grey |
| Move up | Moves the scene up | button (IButton, icon+word) | Grey |
| Move down | Moves the scene down | button (IButton, icon+word) | Grey |
| Pick a part (dropdown) | Chooses a part to edit | dropdown | Grey |
| Remove (scene of their own; confirm-first form) | Removes a custom scene | button | R |

## website/editor/_components/scene-style-row.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| This scene’s style (dropdown) | Picks the scene style | dropdown | Grey |
| Style tiles (radio) | Picks a style | button (tile) | Grey |
| One map for both / No map | Venue-map choice | segmented buttons | Grey |
| Alignment (dropdown: As the scene / …) | Sets text alignment | dropdown | Grey |

## website/editor/_components/part-inspector.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Which part (dropdown) | Chooses the part to edit | dropdown | Grey |
| Weight options (HUB_ELEMENT_WEIGHT_LABEL) | Sets text weight | segmented buttons | Grey |
| Size − / + (stepper) | Changes text size | icon-only ×2 | Grey |
| B (bold) / I (italic) / U (underline) | Toggles text styling | segmented buttons | Grey |
| (colour well — see colour-well.tsx) | Picks text colour | colour picker | Grey |
| Alignment (dropdown) | Sets alignment | dropdown | Grey |
| Line spacing − / + | Changes line spacing | icon-only ×2 | Grey |
| Letter spacing − / + | Changes letter spacing | icon-only ×2 | Grey |
| Use the Event Hub style | Resets text style to default | button (IReset) | A |
| The word between the names (dropdown; "Your own…") | Picks the joiner word | dropdown | Grey |
| Delay (dropdown) | Sets animation delay | dropdown | Grey |
| While on screen (dropdown) | Sets loop effect | dropdown | Grey |
| When it plays (dropdown) | Sets animation timeline | dropdown | Grey |
| Preview | Plays the part animation | button (IButton, icon+word) | Grey |
| Move with the scene | Clears part motion | button (IReset) | A |
| Shown / Hidden | Shows/hides the part | segmented buttons | Grey |

## website/editor/_components/element-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Close (X) | Closes the element sheet | icon-only | Grey |
| “{selected text}” / Whole {part} | Chooses scope of a style change | segmented buttons | Grey |
| Section tabs ({tab labels, e.g. Style · Animate}) | Switches sheet section | segmented buttons (wine) | Grey |
| Clear this selection | Removes styling from selection | button (IReset) | A |
| (+ style / animate controls shared with part-inspector) | See part-inspector | — | — |

## website/editor/_components/editor-shell.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| open the Event Hub Maker | Go to the Maker (framing fallback) | text link | link — stays a link |
| Music (scene-list row) | Selects the Music/main part to edit | clickable element (row button) | Grey |
| {scene tile} (miniature + name; ‹ › step through) | Selects that scene to edit | button (tile) | Grey |
| Hide {scene} / Show {scene} (eye) | Toggles scene visibility | icon-only | Grey |
| {transition label} (e.g. "Fade") | Opens that scene's transition settings | text button | Grey |
| Not shown on {stage} (N) (summary) | Expands folded-away scenes | clickable element | Grey |
| Edit {folded scene} | Selects folded scene to edit | icon-only | Grey |
| Show {folded scene} | Brings the folded scene back | icon-only | Grey |
| + Add a scene (SceneTemplatePicker trigger) ×2 (normal stage / post-event) | Opens the scene template picker | text button | T |
| Drag to resize the scenes (separator) | Resizes the scenes pane | clickable element (drag handle) | Grey |
| See as · {view} (dropdown) | Chooses whose view to preview | dropdown | Grey |
| Event Bar (toggle) | Shows/hides guest event bar in preview | icon-only toggle | Grey |
| Move up (scene ⋯ menu) | Moves scene up | menu row | Grey |
| Move down (scene ⋯ menu) | Moves scene down | menu row | Grey |
| Hide from guests / Show to guests (scene ⋯ menu) | Toggles scene for guests | menu row | Grey |
| {unlockLabel} e.g. "Unlock … {price}" | Go to Pro unlock | text link | T |
| Pick a part (dropdown) / part buttons (ElementButtons) | Chooses part to edit | dropdown / buttons | Grey |
| Inspector tabs ("Edit this scene") | Switches inspector tab | tabs | Grey |
| Film / Photos (radio, "What opens your Save the Date") | Chooses STD opener | segmented buttons | Grey |
| (4 hidden proxy submit buttons: toggle/mode/up/down) | Not user-pressable (tabIndex −1, empty) | hidden | — |

## website/editor/_components/sections-panel.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Visible / Hidden (per section) | Toggles section visibility | button (icon+word) | Grey |
| Move {section} up | Moves section up | icon-only | Grey |
| Move {section} down | Moves section down | icon-only | Grey |
| Shown / Auto / Hidden (🔒 when blocked) | Sets browse mode | segmented buttons | Grey |
| Reset how it moves | Clears section motion | text button | A |
| {motion preset labels} | Picks how the section moves | button chips | Grey |
| {transition labels} (🔒 when locked) | Picks transition | button chips | Grey |
| Unlock with Event Hub Pro | Go to Pro unlock | text link | T |
| {auto speed labels} | Picks speed | button chips | Grey |
| Auto / {timeline labels} | Picks when it plays | button chips | Grey |
| Auto / {value labels} | Picks a motion setting | button chips | Grey |
| Auto / {sequence labels} | Picks parts sequence | button chips | Grey |
| Remove this section (summary) | Expands remove confirm | clickable element | R |
| Remove for good | Deletes the custom section | button | R |
| Save this section | Saves the custom section | button | G |
| {arrangement labels} | Picks section arrangement | button chips | Grey |
| Remove this section’s photo / video | Takes media off the section | button | R |
| Your video | Uses own video as background | button | T |
| (photo tiles) Use this photo as the background | Uses that photo | image button | T |
| Keep area N of 9 in frame ×9 | Sets focal point | icon-only | Grey |
| As it is / Closer / Closest | Sets zoom | button chips | Grey |
| None (colour) / colour swatches | Sets the section background colour | button / swatch | Grey |
| {background choice labels} | Picks a background style | button chips | Grey |
| {shape labels} | Picks box shape | button chips | Grey |

## website/editor/_components/media-panels.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Save / "Saving…" ×6 (SaveButton: hero, music, gallery, etc.) | Saves that media panel | button | G |
| Turn on open browsing / Turn off open browsing | Toggles open browsing of the page | button (SaveButton) | G (on) / R (off) |
| Backdrop intensity (select: Subtle / Standard / Lavish) | Picks backdrop strength | dropdown | Grey |
| Save scene / Turn on backdrop | Saves or turns on the backdrop | button (SaveButton) | G |
| Turn the backdrop off | Turns backdrop off | button | R |
| (file uploads: photos, video, audio) | Chooses files | file inputs | Grey |

## website/editor/_components/main-background-panel.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {choice tile}: Same as my hero · Upload media · theme still etc. (+ ◆ Pro mark) | Picks the page background | button (tile, pressed state) | T |
| Behind every scene (dropdown) | Picks background for all scenes | dropdown | Grey |
| How the photo moves (dropdown) | Picks photo motion | dropdown | Grey |
| Background effect chips ×4 (Plain / …) | Sets the colour effect | button chips | Grey |
| (colour wells, file upload) | Picks colour / uploads media | colour picker / file | Grey |

## website/editor/_components/type-in-place.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {part} dropdowns (Choose a line / Wording / Format) ×6 | Picks wording/format for a part | dropdown | Grey |
| ‹ Done (phone) | Closes the type-in-place editor | button (icon+word) | G |
| Style ▾ | Opens style options | text button | Grey |
| Show / Hide (eye) | Toggles the part | button (icon+word) | Grey |

## website/editor/_components/pro-panels.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {unlockLabel} (e.g. "Unlock Event Hub Pro · ₱…") | Go to Pro unlock | text link | T |
| (colour wells ×2) | Picks colours | colour picker | Grey |
| Art direction (trigger button / dropdown) | Opens art-direction picker | button + dropdown | Grey |
| Magic Move (dropdown) | Picks the shared-element transition | dropdown | Grey |

## website/editor/_components/authoring-panels.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the panel | button (SubmitButton) | G |
| Save your answers | Saves answers | button (SubmitButton) | G |
| Adjust in Schedule → | Go to Schedule page | text link | link — stays a link |
| Design the film → | Go to Save-the-Date film design | text link | link — stays a link |

## website/editor/_components/post-event-scene-panel.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Hidden from guests / Shown to guests (eye) | Toggles the post-event scene | button (icon+word) | Grey |
| Earlier | Moves scene earlier | button (icon+word) | Grey |
| Later | Moves scene later | button (icon+word) | Grey |
| {part label} (e.g. Title, Date…) | Chooses a part to edit | button chip | Grey |
| use the written line | Uses the suggested wording | text button | T |

## website/editor/_components/scene-template-picker.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| + Add a scene (triggerLabel) | Opens the template picker | button | T |
| Close the templates (backdrop) | Closes the picker | clickable element | Grey |
| Show the templates as on (dropdown: desktop/phone) | Switches template preview device | dropdown | Grey |
| Close | Closes the picker | button | Grey |
| {template name} tiles (25) | Adds that scene template | button (tile, submit) | T |

## website/editor/_components/scene-slots-panel.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Take it off | Removes media from the slot | button (submit) | R |
| Your video | Uses own video in the slot | button (submit) | T |
| Current photo N / Use photo N (tiles) | Puts that photo in the slot | image button | T |
| {text option} | Picks a slot text option | button (submit) | Grey |
| Save | Saves slot text | button (submit) | G |

## website/editor/_components/details-bound-field.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Edited here · Use {fact} | Re-links the field to Event Details | text button | Grey |
| Change it everywhere | Writes the edit to Event Details | text button | T |
| Just this scene | Keeps the edit to this scene only | text button | Grey |
| Cancel | Dismisses the choice | text button | Grey |
| Save | Saves the field edit | text button | G |
| Font, colour & size | Opens the style controls | text button | Grey |
| Open Event Details | Go to Event Details in the Maker | text button | link — stays a link |

## website/editor/_components/colour-well.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {hex} / {unset label} · swatch | Opens the colour popover | button | Grey |
| Open the Colour panel | Opens the full colour panel | icon-only | Grey |
| Close the Colour panel | Closes the colour panel | icon-only | Grey |
| Save the current colour | Saves colour to "your colours" | icon-only | G |
| ↺ {unset label} | Clears the colour | text button | A |
| Colour {hex} swatches | Picks that colour | swatch button | Grey |

## website/editor/_components/pick-menu.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {PickMenu trigger: current value} | Opens the dropdown | button (dropdown trigger) | Grey |
| Tick as many as apply. Done ✓ | Closes a multi-select | text button | G |
| {option rows} | Picks that option | menu row | Grey |

## website/editor/_components/text-panel.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Save / "Saving…" (SaveButton ×1 + inline) | Saves the text panel | button | G |

## website/editor/_components/buttons-look-row.tsx · palette-look-row.tsx · font-pick.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Button shape / Button fill / Button colour (dropdowns) | Styles the page's buttons | dropdown ×3 | Grey |
| How your colours are shown (dropdown) | Picks palette treatment | dropdown | Grey |
| {font} (dropdown) | Picks a font | dropdown | Grey |

# PART 3 — launch/ (the Event Hub Maker shell, Event Details, prints, studio)

(Many launch controls are drawn by shared tile/row components; they are listed once at the component where the button element lives, with the labels the user sees.)

## launch/page.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {nextStep.ctaLabel} ×2 (anchor + Link variants) | Go to the next step | text link / button-styled link | T |
| {s.launchLabel} · (per stage) | Opens that stage's launch | text link | link — stays a link |
| Add (per stage, s.addHref) | Go to add that part | text link (icon+word) | T |
| {door.label} {door.hint} | Go to that tool/door | card link | link — stays a link |
| Merkado | Go to marketplace | text link | link — stays a link |
| budget | Go to budget | text link | link — stays a link |

## launch/_components/maker-shell.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Exit (aria "Exit — your draft is kept") | Leaves the Maker | icon-only link | Grey |
| Event Details (door button; icon+word; ShutDoor when not the owner) | Opens Event Details | button (pill) | T |
| Stage (dropdown, LT pick) | Switches stage | dropdown | Grey |
| Page (dropdown) | Switches page / Page actions (＋ Add a scene · Reset this stage… · Prints · Restore what guests see · Your Event Hub address · Who can view · About the Maker) | dropdown | Grey (Reset = A, Add a scene = T, Restore = A) |
| Preview (eye) menu → See as · Show it on a phone / Phone — tap for the desktop · Phone and desktop · Scenes · Play this scene · Preview the whole {stage} | Opens preview options | icon-only menu + menu rows | Grey |
| Preview menu: view-as-free row (internal only) | Toggles view-as-free | menu row | Grey |
| ToolMenu / icon buttons (undo, apply, ⋯ — via DraftButton in hub-draft-bar) | See hub-draft-bar.tsx | icon-only | see there |
| Close ×2 (more sheet / Your Event Hub sheet) | Closes the sheet | icon-only | Grey |

## launch/_components/maker-lower-third.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {tool tile} (first letter + name) | Opens that tool in the lower third | button (tile) | T |
| Previous (‹) | Steps to the previous scene/tile | icon-only | Grey |
| Next (›) | Steps to the next scene/tile | icon-only | Grey |
| Close {tool} | Closes the open tool | icon-only | Grey |
| Menu / {pick label} ▾ | Opens the lower-third menu | button | Grey |
| Close the menu (backdrop) | Closes the menu | clickable element | Grey |
| {menu row: icon + label (+ dot/trail)} | Picks a menu entry | menu row button | Grey |
| LowerThirdTileButton ({tile label / caption / switch}) | Opens a tool, or flips a switch | button / switch (tile) | T (tools) / Grey (switches) |

## launch/_components/maker-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Close ×3 (aria = close label) | Closes the half sheet | icon-only | Grey |
| Show more / Show less | Raises or lowers the sheet | icon-only | Grey |
| Peek (hold to see the whole page) | Hides the sheet while held | icon-only / text | Grey |
| Open {title} ▴ | Reopens a collapsed sheet | button | Grey |

## launch/_components/maker-details.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Set up E-Gifts | Go to E-Gifts setup | text link | link — stays a link |
| Save | Saves the words form | button (submit) | G |
| (Include toggles: label + switch per field) | Includes/excludes a field | switch row | Grey |
| Who guests reply to (select) | Picks the host guests reply to | dropdown | Grey |

## launch/_components/maker-theme-picker.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {theme name} (still tile) | Picks that theme | button (tile) | T |
| See {theme} | Previews that theme | button / icon-only | Grey |
| Theme (dropdown) | Picks a theme | dropdown | Grey |

## launch/_components/theme-preview-overlay.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Exit preview | Leaves the theme preview | button (icon+word) | Grey |
| Use this theme / Your theme | Applies this theme | button (icon+word) | T |

## launch/_components/maker-tour.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Skip the tour (X) | Skips the first-visit tour | icon-only | Grey |
| Back | Previous tour step | button (icon+word) | Grey |
| Start | Starts the tour | button | T |
| Next | Next tour step | button (word+icon) | T |

## launch/_components/maker-logo.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {layer name / text} (layer row) | Selects that logo layer | list button | Grey |
| Move {layer} up / down (IconBtn) | Reorders layers | icon-only ×2 per row | Grey |
| Text · Image · Frame (Add) | Adds a layer of that kind | button (icon above word) | T |
| Cancel | Cancels the logo edit | button | Grey |
| Play / Edit | Plays the logo animation / back to editing | button (icon+word) | Grey |
| Layers · Edit {layer} · … (tool tiles) | Switches logo tool sheet | button (tile, icon+word) | Grey |
| Colour swatches (aria {colour name}) | Picks layer colour | swatch button | Grey |
| Its own (chip) | Uses the layer's own colour | chip button | Grey |
| Knock-out (switch) | Toggles knockout | switch row | Grey |
| Centre it | Centres the layer | button | Grey |
| Show how it's written / Trace it again | Plays write-on animation | button (icon+word) | Grey |
| Reverse it | Reverses the layer | button | Grey |
| Clear it | Clears the layer's change | button | A |
| In / During / Out (dropdowns) | Pick animation | dropdown ×3 | Grey |
| Remove this layer | Deletes the layer | button | R |
| Chip / row buttons (aria = label) | Option choices | chip buttons | Grey |

## launch/_components/maker-reveal.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {opening option label} (+ Pro mark) | Picks the reveal opening | button (tile) | T |
| Extras (dropdown) | Picks reveal extras | dropdown | Grey |
| Shown / Hidden | Shows/hides the reveal | segmented buttons | Grey |
| ▷ Play the opening | Plays the reveal | button (icon+word) | Grey |
| {stage label} (chip per stage) | Picks the stage the reveal precedes | chip button | Grey |
| {label} switches (effects) | Toggles reveal effect | switch button | Grey |
| Fine-tune ▸ | Opens fine-tune controls | text button | Grey |
| Reset | Resets reveal to defaults | button | A |

## launch/_components/maker-rsvp-ask.tsx / maker-rsvp-stage.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Guests get in / How guests answer / Wording (dropdowns ×3) | Picks RSVP settings | dropdown | Grey |
| Use the automatic words | Resets RSVP wording | text button | A |
| Use the default | Resets an ask to default | text button | A |
| {n} {step label} {sub} (RSVP stage list) | Opens that RSVP step | list button | Grey |
| {tile label / caption} | Opens that RSVP tile | button (tile) | T |

## launch/_components/maker-hero-design.tsx · maker-page.tsx · maker-made-once.tsx · maker-play-menu.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Your hero's design (dropdown) | Picks hero design | dropdown | Grey |
| {label} (dropdown, page) | Picks a page | dropdown | Grey |
| Use the invitation card instead | Reverts to the invitation card | button (submit) | T |
| Preview the whole {stage} (sameView / new tab) | Plays the stage preview | menu link | link — stays a link |

## launch/_components/maker-prints.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add your menu | Jumps to the menu editor | text link (anchor) | T |
| Save PDF / Save · Classic (PDF) / Save · {theme} (PDF) | Downloads the printable PDF | button (PrintSaveButton) | Grey |
| Sample · {theme} (JPG) | Downloads a sample image | button (PrintSaveButton) | Grey |
| Download all (pass cards zip) | Downloads all pass cards | button (PrintSaveButton) | Grey |
| Download all (link variant) | Go to pass-card download | text link | Grey |
| Every guest’s {pass card} · {format} | Downloads every pass card | button (PrintSaveButton) | Grey |
| {print sheet label} (per sheet) | Downloads that sheet | button (PrintSaveButton) | Grey |
| Whole set · Classic / Whole set · {theme} (PDF) / Sample sheet · {theme} (JPG) | Downloads the whole set | button (PrintSaveButton) | Grey |
| open the 3D plan | Go to 3D plan | text link | link — stays a link |

## launch/_components/print-save-button.tsx · print-preview.tsx · print-menu-editor.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {label} / "Preparing…" (download anchor) | Downloads / shares the file | button-styled anchor | Grey |
| {print field} (aria, on preview) | Selects a field on the print preview | clickable element | Grey |
| Retry | Retries the preview | button (icon+word) | A |
| Add your menu | Opens menu editor | button (icon+word) | T |
| Add a dish | Adds a dish row | button (icon+word) | T |
| {section name} chips (Starters, …) | Adds a menu section | button (icon+word) | T |
| A moment of your own | Adds a custom moment | button (icon+word) | T |
| Save menu | Saves the menu | button (submit) | G |
| Move or remove {item} | Opens move/remove menu | icon-only | Grey |
| {label} (item menu rows) | Moves / removes the item | button (icon+word) | Grey / R |

## launch/_components/stage-item-menu.tsx · stage-picker.tsx · stage-tools.tsx · stages-studio-parts.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {label} ▾ (stage item menu trigger) | Opens stage/part menu | button | Grey |
| {stage label} rows | Switches to that stage | menu row | Grey |
| {part label} (+ "Here") rows | Jumps to that part | menu row | Grey |
| {round name}{stage line}{n of m} cards | Selects a stage to prepare | list button | Grey |
| Get {round} ready | Starts preparing the stage | button | T |
| Stages | Opens the stage list | button (icon+word) | Grey |
| Start anyway | Starts despite gaps | button | A |
| I’m ready | Confirms ready | button | G |
| Style / Aa / {tool} (part tool icons) | Opens that part tool | icon-only | Grey |
| Play / Stop ("Play the stage" / "Play this part") | Plays or stops preview | icon-only | Grey |
| Close the tools | Closes tools | icon-only | Grey |
| {quiet.words} (link and button variants) | Go to suppliers / quiet action | text link + text button | link / Grey |
| {part label} {tag} rows | Picks a part | list button | Grey |
| {side label} (ISeg) | Picks a side | segmented | Grey |
| Studio tool (dropdown) | Picks studio tool | dropdown | Grey |
| Done | Closes studio sheet | button (icon+word) | G |
| Close / Resize the tools (drag handle) | Closes / resizes the tools panel | icon-only | Grey |

## launch/_components/add-part-sheet.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Add above {part} | Adds a part above | icon-only | T |
| Add below {part} | Adds a part below | icon-only | T |
| Delete {part} (own scene) | Deletes the part | icon-only | R |
| Drag to move {part} | Reorders the part | icon-only (drag handle) | Grey |
| {part label} rows | Adds that part type | list button | T |
| Choose a template / All six are in use | Opens template picker | button | T / Grey (disabled) |
| Keep it ×2 | Keeps the current choice | button | G |
| {w.yes} (confirm) | Confirms the change | button | G |
| Stop | Stops preview | icon-only | Grey |

## launch/_components/celebration-pick.tsx · details-answers.tsx · details-your-event.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| RSVP celebration (dropdown) | Picks celebration style | dropdown | Grey |
| ▷ Play it again | Replays celebration | button | Grey |
| {answer label} (dropdown) | Picks an answer | dropdown | Grey |
| Name style / Your date / {slot} (dropdowns ×4) | Picks event details | dropdown | Grey |

## launch/_components/details-city-pick.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Pick a city or area / {city · area} | Opens the city picker | button | Grey |
| Near me / "Finding…" | Uses location to find cities | button (icon+word) | Grey |
| Close | Closes picker | icon-only | Grey |
| {city} · {km} {region} rows | Picks that city | list button | Grey |

## launch/_components/details-date-clash.tsx · details-date-finder.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Yes, ask them / "Asking…" | Asks the clashing supplier to move | button | B |
| Not now | Dismisses clash | button | Grey |
| Ask them to move or unlock? | Opens the ask options | text button | B |
| Message {name} | Opens chat with that supplier | text link | B |
| {n} {date} {dow} (Best match) | Picks a candidate date | list button | Grey |
| Show the top three / Show all N days | Expands date list | text button | Grey |
| Use {date} | Sets the event date | button | G |
| Must-have supplier (dropdown) | Filters by supplier | dropdown | Grey |
| Compare its Saturdays / "Saving…" | Saves and compares Saturdays | button | T |

## launch/_components/details-go.tsx · details-guide-top.tsx · details-guide.tsx · details-workspace.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {children} ×2 (DetailsGo buttons) | Jumps to that detail item | button | T |
| Pick a step — any time (dropdown) | Jumps to a guide step | dropdown | Grey |
| All items | Shows all details items | text button | Grey |
| What’s left {label} | Shows remaining items | text button | Grey |
| (select) | Picks step | dropdown | Grey |
| {step title} (✓ set / ○ not yet) | Opens that guide step | list button | Grey |
| {title} {unlocks} · Add names › | Go to guest list | text link | link — stays a link |
| Share your Save the Date (ProfileShareButton) | Shares the Save the Date | button | Grey |
| Send invitations | Go to send invitations | text link (icon+word) | T |
| Pick another stage | Back to stage picker | button (icon+word) | Grey |
| Open your guest list › / Add names › | Go to guest list | text link | link — stays a link |
| Keep editing | Stays on the step | button | Grey |
| Skip anyway / Go on without saving | Leaves the step unsaved | button | A |
| Back | Previous step | button (icon+word) | Grey |
| Skip for now | Skips the step | button | Grey |
| Next | Next step | button (word+icon) | T |
| {icon} {item label} (workspace list, ✓) | Opens that item sheet | list button | Grey |
| Done (step sheet) | Closes step sheet | icon-only | G |
| {whatsLeftLine} | Opens the what's-left list | text button | Grey |

## launch/_components/details-look-pages.tsx · details-people.tsx · details-piece.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {part label} (DetailsPieceButton) | Opens that look/people piece | button (tile) | Grey |
| {label} {sub} (people pieces) | Opens that people piece | button (tile) | Grey |

## launch/_components/details-march.tsx · details-march-tray.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Retry | Retries loading | button | A |
| Put the sections back in their usual order | Resets march order | text button | A |
| Undo | Undoes last march change | button | A |
| (tray handle/list toggle) | Opens/closes the march list | button | Grey |
| Close the list | Closes the list | icon-only | Grey |
| Close | Closes the tray | icon-only | Grey |

## launch/_components/hub-pro-offer.tsx · film-follows-theme.tsx · opening-line-field.tsx · parent-cards.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {offer.ctaLabel} | Go to Pro offer | text link | T |
| What’s included | Go to Pro details | text link | link — stays a link |
| Same as the Event Hub | Reverts the film to the hub theme | button | Grey |
| {t.name} (opening line templates) | Uses that opening line | button chip | T |
| Parents | Opens parents list | button (icon+word) | Grey |
| {parent name} | Opens that parent | list button | Grey |
| Whose parent (dropdown) | Picks whose parent | dropdown | Grey |
| Add / "Adding…" | Adds the parent | button | T |
| Cancel | Cancels add parent | button | Grey |
| Add a parent | Opens add-parent form | button (icon+word) | T |

## launch/_components/pass-card-design-picker.tsx · poster-photo-picker.tsx · print-choice-picker.tsx · qr-look-controls.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Pass-card style / poster background / print choice (dropdowns) | Picks a print look | dropdown ×3 | Grey |
| QR shape / QR pattern / QR colour (dropdowns) | Styles the QR | dropdown ×3 | Grey |

## launch/_components/plan-myself.tsx · special-message-field.tsx · sheet-sections.tsx · studio-home.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (submit, plan it myself) | Starts self-planned flow | button (submit) | T |
| Save message | Saves the special message | button (submit) | G |
| {current} ▾ / {section label} | Opens/picks a sheet section | button / list button | Grey |
| {tool tile: label, status ✓/Missing} | Opens that studio tool | button (tile) | T |

## launch/_components/studio-tools.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| (LaunchStdButton) | Launches the Save the Date | button | T |
| Who can view (dropdown) | Sets viewers | dropdown | Grey |
| {Which version} (dropdown) | Picks version | dropdown | Grey |
| Restore | Restores the saved version | button | A |
| Reset… | Resets the studio design | button | A |
| {look label} (ISeg) | Picks a look | segmented | Grey |
| Pattern / Focus / Blur / Shade (dropdowns) | Styles the studio | dropdown ×4 | Grey |

## launch/_components/hub-stage.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| Open the live page | Opens the published page | text link (icon+word) | link — stays a link |
| Edit the page / Set your link | Go to editor / address setup | text link (icon+word) | T |

## launch/_components/view-as-free.tsx
| Label | What it does | Today | Colour |
|---|---|---|---|
| {VIEW_AS_FREE_STOP_LABEL} | Stops view-as-free mode | button | Grey |

---

# TOTALS

- Rows (controls or merged control groups) inventoried: **668** across guests/ (about 135 rows), website/ (about 300) and launch/ (about 230). Rows that stand for a repeated control (chip sets, per-row buttons, dropdown families) count once; the true on-screen control count is higher.
- `hub/` does not exist in this archive: 0 controls.
- Pure page links that stay links ("link — stays a link"): **65** rows.
- Text links, bare icons, plain text buttons, clickable elements that must become pills (icon + word): **about 179** rows (text link / icon-only / clickable element / text button).
- Rows marked "?" for colour: **0** (judgement-call rows are listed in the reply and are best-guesses, not unknowns).
- Not user-pressable and excluded: 4 hidden empty submit proxies in website/editor/_components/editor-shell.tsx; document click listener in website/our-story/_components/panel-follows-the-page.tsx.
- Files with no controls: website/colors, editorial, special-message, what-to-bring, page.tsx, loading.tsx (redirect/empty pages).
