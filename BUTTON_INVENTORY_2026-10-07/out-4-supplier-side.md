# Supplier side — button inventory (origin/main archive)

Scope: `apps/web/app/vendor-dashboard/`, `apps/web/app/vendor/`. Note: `apps/web/app/vendors/` does not exist in the archive (the supplier pricing page is not under that folder), so it is not covered.
Rule applied: owner's one-colour-per-meaning pill rule (2026-10-07). "Today" = what the control is now; "Colour" = what it should be. Display-only chips and pills, text inputs, dropdown `<select>`s and checkbox/radio fields are not listed (counts at the end). Rows in file order; exact duplicates merged with ×N.


## apps/web/app/vendor-dashboard/_components/branch-manager.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add a branch | Opens the add-branch form | button | Terracotta |
| Purchase · {…} / 28 days | Buys a 28-day branch slot | button | Green |
| Renew · {…} | Renews the branch for 28 days | button | Green |
| Cancel {branch name} | Cancels that branch | icon-only | Red |

## apps/web/app/vendor-dashboard/_components/branch-pin-map.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Zoom in | Zooms the map in | icon-only | Grey |
| Zoom out | Zooms the map out | icon-only | Grey |
| © OpenStreetMap | Opens map credit page | text link | link — stays a link |

## apps/web/app/vendor-dashboard/_components/event-locked-by-fee.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {CTA, e.g. Pay the booking fee} | Opens the booking-fee payment page | button-styled link | Green |
| Message the couple | Opens the chat with the couple | button-styled link | Blue |
| Back ({destination label}) | Goes back to the previous screen | text link | Grey |

## apps/web/app/vendor-dashboard/_components/feature-accordion.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Section title} (row) | Expands or collapses the section | button | Grey |

## apps/web/app/vendor-dashboard/_components/first-steps.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Step CTA, e.g. Add your first service} | Opens that setup step | button-styled link | Terracotta |
| Go there anyway | Opens the step despite the warning | text link | Grey |

## apps/web/app/vendor-dashboard/_components/instagram-connect-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Connect Instagram | Starts Instagram connect | button-styled link | Terracotta |
| Sync now | Re-pulls Instagram posts | button | Grey |
| Disconnect | Disconnects Instagram, removes posts | button | Red |
| Hide from / Show on your portfolio (eye icon) | Toggles a post on the portfolio | icon-only | Grey |
| Open on Instagram (icon) | Opens the post on Instagram | icon-only | Grey |

## apps/web/app/vendor-dashboard/_components/list-pager.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹ Prev | Goes to the previous page of the list | button-styled link | Grey |
| {page number} | Goes to that page of the list | button-styled link | Grey |
| Next › | Goes to the next page of the list | button-styled link | Grey |

## apps/web/app/vendor-dashboard/_components/overview-sections.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| I delivered this service | Marks the service delivered | button | Green |
| Accept | Accept inquiry | button | Green |
| Decline | Decline inquiry | button | Red |
| Agree to this booking | Agree lock | button | Green |
| Can’t take this booking? | Expands the turn-down form | clickable element | Grey |
| Turn it down | Decline lock | button | Red |
| Move to {…} | Accepts the new date for the booking | button | Green |
| Unlock my service | Declines the move and frees the service | button | Red |
| Agree to remove it | Agrees to remove the booking | button | Green |
| Not yet — say why | Expands a say-why form | clickable element | Grey |
| Keep it for now | Declines the removal for now | button | Red |
| See what they sent | Opens what the couple sent | text link | Grey |
| Yes, it arrived | Confirm lock | button | Green |
| View the payment | Opens the payment on the customer card | button-styled link | Grey |
| It hasn’t reached you? | Expands the not-arrived form | clickable element | Grey |
| It never arrived | Reject lock | button | Red |
| Open the review | Opens the review to reply | button-styled link | Grey |
| Post reply | Post review reply | button | Blue |
| Answer them | Opens the chat to answer them (or the handover) | button-styled link | Blue |
| Open the conversation | Opens the chat thread | button-styled link | Blue |
| Confirm this time | Respond meeting | button | Green |
| Offer another time | Opens the schedule to offer a time (or the customer) | button-styled link | Blue |
| Can’t make it at all? | Expands the turn-down form | clickable element | Grey |
| Turn down this meeting | Respond meeting | button | Red |
| Open the quote | Opens the quotes page | button-styled link | Grey |
| Open the contract | Opens the contracts page | button-styled link | Grey |
| View all | Opens the clients list | text link | Grey |
| {task name} {due chip} | Opens the task’s page | text link | link — stays a link |
| Open calendar | Opens the calendar | text link | Grey |
| {date block} {event name} (booked-event row) | Opens the customer card | text link | link — stays a link |
| Message {event name} | Opens that couple’s chat | button-styled link | Blue |

## apps/web/app/vendor-dashboard/_components/payout-method-nudge.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add a payment method / View your payment options | Opens payment options | text link | Grey |

## apps/web/app/vendor-dashboard/_components/pipeline-pressure-line.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| see the plans (inline) | Opens plans | text link | link — stays a link |

## apps/web/app/vendor-dashboard/_components/push-notification-registrar.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Enable / Enabling… | Turns on push notifications | button | Terracotta |
| Dismiss push prompt (X icon) | Closes the prompt | icon-only | Grey |

## apps/web/app/vendor-dashboard/_components/qr-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Shortlist | Switches to the Shortlist QR tab | button | Grey |
| Locked | Switches to the Locked QR tab | button | Grey |

## apps/web/app/vendor-dashboard/_components/qr-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Set up my page | Opens the shop page setup | text link | Terracotta |
| Update QR | Updates the QR event/service filter | button | Terracotta |
| Copy link · Download QR | Copies the QR link / downloads it | button | Grey |
| View your issued Locked QRs → | Opens issued Locked QRs | text link | Grey |

## apps/web/app/vendor-dashboard/_components/spotlight-award-banner.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| See how couples discover you | Opens Explore | text link | Grey |

## apps/web/app/vendor-dashboard/_components/supplier-today-first-screen.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {N} new inquiries (stat tile) | Opens waiting inquiries | text link | link — stays a link |
| {N} events this week (stat tile) | Opens the calendar | text link | link — stays a link |
| {amount} owed to you (stat tile) | Opens money owed | text link | link — stays a link |
| {date} {event name} (upcoming row) | Opens the customer card | text link | link — stays a link |
| See everything | Scrolls to the full list | text link | Grey |

## apps/web/app/vendor-dashboard/_components/tier-gate.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Upgrade to {…} | Opens plans to upgrade | button-styled link | Terracotta |
| Unlock with {…} | Opens plans to unlock | button-styled link | Terracotta |

## apps/web/app/vendor-dashboard/_components/vendor-bottom-nav.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Today | Opens the Today screen | text link | link — stays a link |
| Customers | Opens the Customers screen | text link | link — stays a link |
| Shop | Opens the Shop screen | text link | link — stays a link |
| More | Opens the More menu sheet | clickable element | Grey |
| {More-sheet destination rows, ×N (shared sheet, set by config)} | Open that section | text link | link — stays a link |

## apps/web/app/vendor-dashboard/_components/vendor-rail-context.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {rail item label} (+ badge) | Opens that section | text link | link — stays a link |
| Plan {tier} | Opens plans page | text link | link — stays a link |

## apps/web/app/vendor-dashboard/_components/video-links-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove this video link (icon) | Removes a video link | icon-only | Red |
| Add another video | Adds a video link row | button | Terracotta |

## apps/web/app/vendor-dashboard/activities/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add segment | Adds a day-of segment | button | Terracotta |
| Not offering · {N} | Expands retired segments | clickable element | Grey |
| Offer again | Offers the segment again | button | Amber |
| Save | Saves the segment edits | button | Green |
| Move earlier (arrow icon) | Moves the segment up | icon-only | Grey |
| Move later (arrow icon) | Moves the segment down | icon-only | Grey |
| Stop offering | Retires the segment | text-styled button | Red |

## apps/web/app/vendor-dashboard/activities/questions-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the question edits | button | Green |
| Stop asking | Retires the question | text-styled button | Red |
| {suggested question prompt} | Adds that suggested question | button | Terracotta |
| Add question | Adds a question | button | Terracotta |
| Not asking · {N} | Expands retired questions | clickable element | Grey |
| Ask again | Asks the question again | button | Amber |

## apps/web/app/vendor-dashboard/attributes/_components/attribute-field-renderer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| × (remove {tag}) | Removes that tag | icon-only | Red |
| Add | Adds the typed tag | button | Terracotta |

## apps/web/app/vendor-dashboard/attributes/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Set up profile | Opens dashboard to set up profile | button-styled link | Terracotta |
| Add | Adds the chosen service | button | Terracotta |
| Add service + save / Save | Save vendor service attribute | button | Green |
| Remove service (component button) | Removes the service from details | button | Red |
| Remove this service’s payload | Removes that service’s details | text-styled button | Red |

## apps/web/app/vendor-dashboard/booking-fees/[orderId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to booking fees | Goes back to booking fees | button-styled link | Grey |
| Copy | Copies the amount | button | Grey |
| Copy | Copies the reference code | button | Grey |
| Send your payment | Opens the payment page | button-styled link | Green |
| Screenshot | Opens the payment screenshot | text link | Grey |

## apps/web/app/vendor-dashboard/booking-fees/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Plan | Goes back to Plan | button-styled link | Grey |
| {amount} {reference} (fee row) | Opens that booking fee | text link | link — stays a link |

## apps/web/app/vendor-dashboard/bookings/_components/vendor-prep-add.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add to prep schedule | Opens the prep-step form | button | Terracotta |
| Tap outside the sheet | Closes the prep sheet | clickable element | Grey |
| Close (X icon) | Closes the sheet | icon-only | Grey |
| Cancel | Closes the sheet, discards | button | Red |
| Add to schedule / Adding… | Adds the dated prep step | button | Terracotta |
| Remove “{step}” (X icon) | Removes a prep step | icon-only | Red |

## apps/web/app/vendor-dashboard/bookings/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {filter} · {count} | Filters the bookings list | button-styled link | Grey |
| Upcoming · last 30d / All time | Switches the time window | button-styled link | Grey |
| {status pill} {event name} (thread row) | Opens that chat thread | text link | link — stays a link |

## apps/web/app/vendor-dashboard/calendar/[date]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ← Back to calendar | Goes back to the calendar | text link | Grey |
| Save | Saves the day’s state | button | Green |
| Apply to all | Applies the state to all schedules | button | Terracotta |
| Open chat | Opens that couple’s chat | text link | Blue |
| A slot opened — notify them | Notifies waitlisted couples of an opening | button | Amber |

## apps/web/app/vendor-dashboard/calendar/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Create a calendar | Expands the new-calendar form | clickable element | Grey |
| Create calendar | Creates the calendar | button | Terracotta |
| ← {previous month} | Shows the previous month | button-styled link | Grey |
| {next month} → | Shows the next month | button-styled link | Grey |
| Block dates | Scrolls to the block-dates form | button-styled link | Grey |
| See plans | Opens plans | text link | Terracotta |
| Save | Saves waitlist settings | button | Green |
| Pick for waitlist ({N} picked / {cap}) | Picks the couple for the waitlist | button | Terracotta |
| A slot opened — notify them | Notifies waitlisted couples of an opening | button | Amber |
| Go to Services | Opens Services | text link | Terracotta |
| All schedules | Shows all schedules | button-styled link | Grey |
| {schedule name} | Shows that schedule | button-styled link | Grey |
| {day number} (calendar cell) | Opens that day | text link | link — stays a link |
| {day number} {badge} (calendar cell) | Opens that day | text link | link — stays a link |
| Save calendar | Edit calendar | button | Green |
| Save | Update pool capacity | button | Green |
| Block dates | Expands the block-dates form | clickable element | Grey |
| Add block | Blocks the chosen dates | button | Terracotta |
| Import an outside client | Expands the import form | clickable element | Terracotta |
| Import · free | Imports an outside client | button | Terracotta |
| Open chat | Opens that couple’s chat | text link | Blue |
| Remove (confirm popup) | Opens the remove-block confirmation | button | Red |
| Remove | Removes the date block | text-styled button | Red |
| Which categories share this team? | Expands the share-team form | clickable element | Grey |
| Move | Moves the category to that schedule | button | Grey |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/booth-event-buy-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Brand my booth here — ₱{…} | Buys the booth for this event | button | Green |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/booth-event-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| See plans | Opens plans | text link | Terracotta |
| Compare | Opens plans to compare | text link | Grey |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/booth-poster-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove poster | Removes the poster | text-styled button | Red |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/booth-studio-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save to my booth | Saves the booth words | button | Green |
| Remove the words | Removes the booth words | text-styled button | Red |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/colour-lane-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save / Saving… | Saves the colour | button | Green |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/customer-card-nav.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {tab name} | Switches the customer-card tab | button-styled link | Grey |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/customer-card-notes.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Done / Reopen | Marks the note done or reopens it | text-styled button | Green |
| Delete | Deletes the note | text-styled button | Red |
| Save note | Saves the note | button | Green |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/payment-asks-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Take it back | Withdraws the payment ask | button | Amber |
| Ask {…} | Sends a payment ask to the couple | button | Blue |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/script-composer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Write your line… | Opens the line editor | button | Terracotta |
| Save line / Keep this line | Saves the script line | button | Green |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/script-tab.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| My lines (inline) ×2 | Opens saved lines | text link | link — stays a link |
| {time} {segment} (review chip) | Jumps to that script block | button-styled link | Amber |
| write your questions once (inline) | Opens activity questions | text link | link — stays a link |
| your questions (inline) | Opens activity questions | text link | link — stays a link |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/vendor-challenge-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Submit for the couple’s okay | Submits the challenge to the couple | button | Green |
| View shared photos | Opens shared challenge photos | text link | Grey |
| Turn on Papic Challenges | Opens plans to switch Challenges on | text link | Terracotta |

## apps/web/app/vendor-dashboard/clients/[eventId]/_components/vendor-part-signoff.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| I’ll build this | Agrees to build their part | button | Green |
| Not as designed | Opens the reason box to push back | button | Red |
| Send | Sends the reason to the couple | button | Blue |
| Go ahead, change it | Agrees to the reopened change | button | Green |
| Keep it as agreed | Keeps the part as agreed | button | Green |

## apps/web/app/vendor-dashboard/clients/[eventId]/challenge-photos/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to client | Goes back to the client | text link | Grey |
| {photo/clip thumbnail} | Opens the photo | text link | link — stays a link |

## apps/web/app/vendor-dashboard/clients/[eventId]/cocktail/cocktail-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Dismiss (X icon) | Closes the notice | icon-only | Grey |
| Add booth | Opens the booth-type list | button | Terracotta |
| {booth type, e.g. Bar} | Adds that booth to the floor | button | Terracotta |
| Add sign | Adds a sign | button | Terracotta |
| Resize cocktail area (corner handle) | Drags to resize the area | icon-only | Grey |
| Edit what {booth} serves (icon) | Opens the offerings editor | icon-only | Grey |
| Remove {booth} (X icon) | Removes the booth | icon-only | Red |
| Cancel | Closes the offerings editor | button | Red |
| Save | Saves the booth offerings | button | Green |
| Rotate {sign} (icon) | Rotates the sign | icon-only | Grey |
| Remove {sign} (X icon) | Removes the sign | icon-only | Red |

## apps/web/app/vendor-dashboard/clients/[eventId]/cocktail/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Event brief | Goes back to the event brief | text link | Grey |

## apps/web/app/vendor-dashboard/clients/[eventId]/editorial-media/_components/editorial-media-studio.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove | Removes a submitted photo | text-styled button | Red |
| Add photos | Opens the photo picker | button | Terracotta |
| Add a clip (≤{…}s) | Opens the clip picker | button | Terracotta |
| Remove (X icon) | Removes a staged photo | icon-only | Red |
| Submit {N} to their editorial | Submits staged photos | button | Green |

## apps/web/app/vendor-dashboard/clients/[eventId]/editorial-media/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Event brief | Goes back to the event brief | text link | Grey |

## apps/web/app/vendor-dashboard/clients/[eventId]/mood-board/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to event brief | Goes back to the event brief | text link | Grey |

## apps/web/app/vendor-dashboard/clients/[eventId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Clients | Goes back to the clients list | text link | Grey |
| Open chat | Opens the chat with the couple | button-styled link | Blue |
| New quote | Opens quotes to write a new one | button-styled link | Blue |
| Contract | Opens the contract (or starts a new one) | button-styled link | Grey |
| Files ×2 | Opens the Files tab | button-styled link | Grey |
| Schedule | Opens the Schedule tab | button-styled link | Grey |
| Log payment | Opens payments in chat to log one | button-styled link | Green |
| Chat ×2 | Opens the chat | button-styled link | Blue |
| Payments | Opens the Payments tab | button-styled link | Grey |
| Mark service complete | Marks the service complete | button | Green |
| Call | Opens chat at the call tool | button-styled link | Blue |
| Quote | Opens chat at the quote builder | button-styled link | Blue |
| Invite → | Opens clients to invite a customer | text link | Terracotta |
| Open the production sheet | Opens the production sheet | text link | Grey |
| Open mood board → | Opens the mood board | text link | Grey |
| View the floor plan | Opens the floor plan | text link | Grey |
| Add to their editorial | Opens editorial photo upload | text link | Terracotta |
| It arrived after all | Confirms the payment arrived after all | button | Green |
| Confirm payment received | Confirms the payment was received | button | Green |
| Didn’t receive it? | Expands the not-received form | clickable element | Grey |
| Didn’t receive this payment | Tells the couple it did not arrive | button | Red |
| Arrange the cocktail area | Opens the cocktail-area editor | text link | Grey |
| View → | Opens that quote | text link | Grey |
| New quote | Opens chat at the quote builder | button-styled link | Blue |
| Log & confirm payments in chat | Opens chat to log payments | button-styled link | Green |
| Share files in chat → | Opens chat to share files | text link | Blue |
| Open → | Opens that file | text link | Grey |
| Share more files in chat → | Opens chat to share more files | text link | Blue |
| Full timeline | Shows the full timeline | text link | Grey |
| My slots only | Shows only your slots | text link | Grey |
| Add to calendar | Downloads the timeline calendar file | text link | Grey |
| Request this call time | Asks for a call-time change | button | Blue |
| see the full timeline (inline) | Shows the full timeline | text link | link — stays a link |
| Change or remove | Expands change/remove options | clickable element | Grey |
| Send request | Sends the change request | button | Blue |
| Ask to remove | Asks the couple to remove the entry | button | Red |
| Suggest a change | Expands the suggestion form | clickable element | Blue |
| Send suggestion ×2 | Sends the suggestion | button | Blue |
| Suggest a new timeline entry | Expands the suggestion form | clickable element | Blue |
| Share a gallery link | Expands the gallery-link form | clickable element | Grey |
| Send link | Sends the gallery link | button | Blue |
| Upload a sample/proof | Expands the upload form | clickable element | Terracotta |
| Choose file | Picks a proof file | clickable element | Terracotta |
| Upload | Uploads the proof | button | Terracotta |
| Leave a note | Expands the note form | clickable element | Blue |
| Send note | Sends the note | button | Blue |
| All delivered (sign-off) | Expands the sign-off form | clickable element | Grey |
| Mark all delivered | Marks everything delivered | button | Green |
| open link | Opens the shared link | text link | Grey |
| Propose a change | Expands the change-order form | clickable element | Blue |
| Send to couple | Sends the change order to the couple | button | Blue |
| Accept | Accepts the change order | button | Green |
| Decline | Declines the change order | button | Red |
| Withdraw | Withdraws the change order | button | Amber |
| Agree to this booking | Agrees to the booking | button | Green |
| Can’t take this booking? | Expands the turn-down form | clickable element | Grey |
| Turn it down | Turns the booking down | button | Red |

## apps/web/app/vendor-dashboard/clients/[eventId]/production-sheet/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Event brief | Goes back to the event brief | text link | Grey |
| Print production sheet | Prints the sheet | button | Grey |
| Delete {rule} (icon) | Deletes the portion rule | icon-only | Red |
| Add a portion rule | Expands the portion-rule form | clickable element | Terracotta |
| Save rule | Saves the portion rule | button | Green |

## apps/web/app/vendor-dashboard/clients/[eventId]/seat-plan/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Event brief | Goes back to the event brief | text link | Grey |

## apps/web/app/vendor-dashboard/clients/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Bookings (inline) ×2 | Opens bookings | text link | link — stays a link |
| Customer card ×2 | Opens the customer card | text link | Grey |
| Open chat ×2 | Opens the chat | text link | Blue |
| View on calendar | Opens the calendar | text link | Grey |
| calendar (inline) | Opens the calendar | text link | link — stays a link |
| Remove (confirm popup) | Opens the remove confirmation | button | Red |
| Remove | Removes the outside client | text-styled button | Red |
| Import an outside client · free | Expands the import form | clickable element | Terracotta |
| Import · free | Imports the outside client | button | Terracotta |
| Set up a schedule | Opens availability setup | text link | Terracotta |

## apps/web/app/vendor-dashboard/contracts/[contractId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to contracts | Goes back to contracts | text link | Grey |
| View / download | Opens or downloads the contract file | button-styled link | Grey |
| Make visible to couple | Shares the contract with the couple | button | Blue |
| Cancel this contract | Expands the cancel form | clickable element | Red |
| Cancel contract | Cancels the contract | button | Red |

## apps/web/app/vendor-dashboard/contracts/new/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to contracts | Goes back to contracts | text link | Grey |
| messages (inline) | Opens messages | text link | link — stays a link |
| Choose file | Picks the contract file | clickable element | Terracotta |
| Upload draft | Uploads the draft contract | button | Terracotta |
| Cancel | Leaves without uploading | button-styled link | Red |

## apps/web/app/vendor-dashboard/contracts/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Upload new contract | Opens the contract upload page | button-styled link | Terracotta |

## apps/web/app/vendor-dashboard/creators/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Set reach bar | Applies the reach filter | button | Grey |
| {creator name} ×3 | Opens the creator’s page | text link | link — stays a link |
| Send a discount offer | Expands the offer form | clickable element | Blue |
| Send offer | Sends the discount offer | button | Blue |

## apps/web/app/vendor-dashboard/customers/_components/customers-calendar.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Previous month (icon) | Shows the previous month | icon-only | Grey |
| Next month (icon) | Shows the next month | icon-only | Grey |
| {day number} {events} (calendar cell) | Opens that day | text link | link — stays a link |

## apps/web/app/vendor-dashboard/customers/_components/customers-filter-bar.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Heat map | Turns the heat map on or off | button | Grey |
| How to read this calendar (i icon) | Shows or hides the help | icon-only | Grey |

## apps/web/app/vendor-dashboard/customers/_components/customers-pick.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Filter dropdown} | Opens a filter menu | button | Grey |

## apps/web/app/vendor-dashboard/customers/_components/customers-roster.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add an outside client (+ icon) | Opens the outside-client form | icon-only | Terracotta |
| More customer tools (menu icon) | Opens the tools menu | icon-only | Grey |
| Book of business | Jumps to that tool section | text link | link — stays a link |
| Messages | Jumps to that tool section | text link | link — stays a link |
| Calendar | Jumps to that tool section | text link | link — stays a link |
| Availability & capacity | Jumps to that tool section | text link | link — stays a link |
| Quotes | Jumps to that tool section | text link | link — stays a link |
| Contracts | Jumps to that tool section | text link | link — stays a link |
| Clear the search | Clears the search | text link | Grey |
| {customer name} (roster row) | Opens that customer | text link | link — stays a link |

## apps/web/app/vendor-dashboard/customers/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Money in timeline | Jumps to money-in timeline | text link | Grey |
| Open messages | Opens messages | text link | Grey |
| My Services | Opens My Services | text link | Grey |

## apps/web/app/vendor-dashboard/deep-search/_components/deep-search-runner.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Run Deep Search — {price} (or free) | Runs the Deep Search | button | Green |

## apps/web/app/vendor-dashboard/deep-search/_components/dossier-view.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| source (↗) | Opens the source page | text link | link — stays a link |
| open (↗) | Opens the found website | text link | link — stays a link |

## apps/web/app/vendor-dashboard/disputes/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Contest this dispute / Edit your response | Expands the response form | clickable element | ? — opens a form to push back on a dispute; neither a plain save nor a decline |
| Submit my response / Update my response | Sends your response | button | Green |

## apps/web/app/vendor-dashboard/earnings/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Plan (inline) | Opens plans | text link | link — stays a link |
| Services (inline) | Opens Services | text link | link — stays a link |
| ‹ Newer | Shows newer earnings | button-styled link | Grey |
| Older › | Shows older earnings | button-styled link | Grey |

## apps/web/app/vendor-dashboard/error.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Try again | Retries loading the page | button | Amber |
| Switch to customer view | Switches to the customer side | text link | Grey |

## apps/web/app/vendor-dashboard/invite/_components/locked-qr-generator.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {service name} ✓ (selected) | Deselects the service | button | Grey |
| {service name} | Selects the service | button | Grey |
| Remove payment (icon) | Removes a payment row | icon-only | Red |
| Choose file (payment receipt) | Picks the first-payment receipt | button-styled link | Terracotta |
| Choose file (remembrance photo) | Picks the keepsake photo | button-styled link | Terracotta |
| Generate Locked QR | Generates the Locked QR | button | Terracotta |

## apps/web/app/vendor-dashboard/invite/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| My Shop | Goes back to the shop | text link | Grey |
| Shortlist | Switches to the Shortlist tab | button-styled link | Grey |
| Locked | Switches to the Locked tab | button-styled link | Grey |
| Go to my shop | Opens the shop page | button-styled link | Terracotta |
| Copy link · Download QR ×2 | Copies the link / downloads the QR | button | Grey |
| Create another Locked QR | Starts another Locked QR | text link | Terracotta |
| View all issued → | Opens issued Locked QRs | text link | Grey |
| View your issued Locked QRs → | Opens issued Locked QRs | text link | Grey |
| Generate QR | Generates the Shortlist QR | button | Terracotta |

## apps/web/app/vendor-dashboard/layout.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Account menu (avatar) | Opens switch account / Sign out menu | clickable element | Grey |
| + Create service card | Opens the service card maker | button-styled link | Terracotta |

## apps/web/app/vendor-dashboard/lines/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the line | button | Green |
| Update match | Updates the matched segment | text-styled button | Green |
| Remove ×2 | Deletes the line | text-styled button | Red |
| those stay as you left them (inline) | Opens clients | text link | link — stays a link |

## apps/web/app/vendor-dashboard/locked-qr/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| My Shop | Goes back to the shop | text link | Grey |
| New | Starts a new Locked QR | button-styled link | Terracotta |
| Show QR | Shows that QR | button-styled link | Grey |
| Copy link · Download QR | Copies the link / downloads the QR | button | Grey |

## apps/web/app/vendor-dashboard/manpower/_components/gig-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Accept gig / Accepting… | Accepts the gig | button | Green |
| Mark wrapped / Wrapping… | Marks the gig wrapped | button | Green |
| Confirm cancel / Cancelling… | Confirms cancelling the gig | button | Red |
| Close cancel form (X icon) | Closes the cancel form | icon-only | Grey |
| Cancel gig | Opens the cancel-gig form | button | Red |

## apps/web/app/vendor-dashboard/messages/[threadId]/_components/chat-info-rail.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Tools | Opens the customer tools panel | button | Grey |
| {tool name, e.g. Build a quote} | Runs or reveals that chat tool | clickable element | ? — tool rows differ per tool (quote, call, deal…); label and meaning come from data |
| create one (inline) | Opens quotes to make a template | text link | link — stays a link |
| Full customer profile | Opens the full customer card | button-styled link | Grey |

## apps/web/app/vendor-dashboard/messages/[threadId]/_components/inquiry-outcome-capture.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {outcome, e.g. Booked / Lost} | Chooses the inquiry outcome | button | Grey |
| Update outcome / Save outcome | Saves the inquiry outcome | button | Green |

## apps/web/app/vendor-dashboard/messages/[threadId]/_components/send-proposal-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save a quote template | Opens quotes to save a template | text link | Grey |
| 📄 Send from a saved template | Opens the send-from-template form | button | Blue |
| Send this quote | Sends the quote in chat | button | Blue |
| Cancel | Closes the form | button | Grey |

## apps/web/app/vendor-dashboard/messages/[threadId]/_components/vendor-offer-service.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Send card / Sending… | Sends the service card in chat | button | Blue |

## apps/web/app/vendor-dashboard/messages/[threadId]/_components/vendor-payment-live.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| It arrived — confirm received / Confirm received | Confirms the payment was received | button | Green |
| Not received | Opens the not-received form | button | Red |
| Tell them it hasn’t arrived | Tells the couple it has not arrived | button | Red |
| View attached receipt | Opens the attached receipt | text link | Grey |
| Mark payment cleared | Marks the payment plan cleared | button | Green |

## apps/web/app/vendor-dashboard/messages/[threadId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Messages (arrow icon) | Goes back to messages | icon-only | Grey |
| Tools / ⋮ menu (header) | Opens the chat tools panel | clickable element | Grey |
| {creator name} | Opens the creator’s page | text link | link — stays a link |
| {chapter title} | Opens that creator chapter | text link | link — stays a link |
| Apply +{…} / Apply −{…} | Applies the price change for guest count | button | Terracotta |
| Hold price | Keeps the current price | button | Red |
| Call {couple} ×2 | Opens the call tool in chat | button | Blue |
| Accept inquiry | Accepts the inquiry | button | Green |
| Decline | Declines the inquiry | button | Red |

## apps/web/app/vendor-dashboard/messages/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Archive / Unarchive thread | Archives or restores a thread | button | Grey |
| supplier profile (inline) | Opens the dashboard | text link | link — stays a link |
| Archived · {N} | Expands archived threads | clickable element | Grey |

## apps/web/app/vendor-dashboard/moodboard-library/_components/stylist-library-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Dismiss | Closes the message | text-styled button | Grey |
| Dismiss | Closes the error | text-styled button | Grey |
| Choose file | Picks a photo to upload | clickable element | Terracotta |
| Upload + tag | Uploads and tags the photo | button | Terracotta |
| Add to gallery / Added | Adds the photo to the gallery | button | Terracotta |
| {asset label} (list row) | Selects that asset to edit | button | Grey |
| Save tags | Saves the tags | button | Green |
| Delete | Deletes the asset | button | Red |
| Preview palette (test how your tags look with different colors) | Expands the palette preview | clickable element | Grey |

## apps/web/app/vendor-dashboard/moodboard-library/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹ Back to shop dashboard | Goes back to the dashboard | text link | Grey |

## apps/web/app/vendor-dashboard/more/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {row label} {sub} (More list row) | Opens that section | button-styled link | link — stays a link |

## apps/web/app/vendor-dashboard/notifications/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Mark all read | Marks all notifications read | button | Green |
| contact email (inline) | Opens the dashboard | text link | link — stays a link |

## apps/web/app/vendor-dashboard/notifications/push-toggle.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Disable / Disabling… | Turns push notifications off | button | Red |
| Enable / Enabling… | Turns push notifications on | button | Terracotta |

## apps/web/app/vendor-dashboard/on-the-day/_components/access-grants.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Access switch for {team member} | Grants or revokes their access | clickable element | Grey |

## apps/web/app/vendor-dashboard/on-the-day/_components/event-picker.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {event name} {Today/date} (event row) | Opens the event’s day-of setup | text link | link — stays a link |
| Launch | Launches the live day-of app | button-styled link | Terracotta |
| Set up | Opens the event’s setup | button-styled link | Terracotta |

## apps/web/app/vendor-dashboard/on-the-day/_components/guest-review-qr.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Print | Prints the review QR | button | Grey |
| Show fullscreen | Shows the QR full screen | button | Grey |
| Copy link · Download QR | Copies the link / downloads the QR | button | Grey |
| Tap anywhere on the full-screen QR | Closes the full-screen QR | clickable element | Grey |
| Close full screen (X icon) | Closes the full-screen QR | icon-only | Grey |

## apps/web/app/vendor-dashboard/on-the-day/_components/issues-log.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Log | Logs the issue | button | Terracotta |
| Mark issue resolved / Reopen issue (tick icon) | Resolves or reopens an issue | icon-only | Green |
| Remove issue (icon) | Removes the issue | icon-only | Red |

## apps/web/app/vendor-dashboard/on-the-day/_components/module-configurator.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {module name} {blurb} (tile) | Switches the module on or off | button | Grey |

## apps/web/app/vendor-dashboard/on-the-day/_components/requests-inbox.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Refresh (icon) | Reloads the requests | icon-only | Grey |
| Log | Logs the request | button | Terracotta |
| Mark {next status} (tick icon) | Advances the request’s status | icon-only | Green |

## apps/web/app/vendor-dashboard/on-the-day/_components/shot-list.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Mark captured / not captured (tick icon) | Ticks a shot off | icon-only | Green |
| Remove “{shot}” (icon) | Removes the shot | icon-only | Red |
| Add | Adds the shot | button | Terracotta |
| Reset | Resets the shot list | button | Amber |
| Share with the couple / Save again | Saves and shares the list | button | Green |

## apps/web/app/vendor-dashboard/on-the-day/_components/vendor-status-updates.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {status preset, e.g. Running late} | Sends that status to the coordinator | button | Blue |
| Send to the coordinator | Sends the note to the coordinator | button | Blue |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/floor-command/ask-access.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {floor area} | Selects the area to ask for | button | Grey |
| Send request | Sends the access request | button | Blue |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/floor-command/floor-command.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open the seat plan | Opens the seat plan | button-styled link | Grey |
| Open the inbox | Opens the inbox | button-styled link | Grey |
| Open the full desk | Opens the full desk | text link | Grey |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/floor-command/schedule-updater.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start {item} / Finish {item} | Starts or finishes the current item | button | Terracotta |
| +{N}m | Pushes the schedule by N minutes | button | Amber |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/floor-command/seat-scanner.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Stop | Stops the scanner | button | Red |
| Scan a guest’s card | Starts the camera scanner | button | Terracotta |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/papic-capture-controller.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Agree & open camera | Agrees and opens the camera | button | Green |
| Flip camera (icon) | Switches front/back camera | icon-only | Grey |
| {N}× (zoom lens) | Picks the camera lens | button | Grey |
| Shutter (Take photo / hold for video) | Takes a photo, hold for video | icon-only | Green |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/portfolio-credits-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Buy {N} credits · {price} | Buys a credit pack | button | Green |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/portfolio-import-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Import a photo · 1 credit | Picks a photo to import (costs 1 credit) | button-styled link | Terracotta |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/song-desk/requests-inbox.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Pause / Resume requests | Pauses or resumes song requests | button | Amber |
| We’ll play it | Accepts the song request | button | Green |
| Decline {song} (icon) | Declines the song request | icon-only | Red |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/song-desk/sets-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Your sets · {N} of {max} | Expands the sets panel | clickable element | Grey |
| Add set | Creates the set | button | Terracotta |
| Cancel | Closes the form | button | Red |
| Add a set / Add your first set | Opens adding | button | Terracotta |
| Rename set {name} (pencil icon) | Starts renaming the set | icon-only | Grey |
| Delete set {name} (icon) | Deletes the set | icon-only | Red |
| Remove {song} from {set} (icon) | Removes the song from the set | icon-only | Red |
| Save set name (tick icon) | Saves the new name | icon-only | Green |
| Cancel rename (X icon) | Cancels the rename | icon-only | Red |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/song-desk/song-desk.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Edit your repertoire | Opens the repertoire page | text link | Grey |
| {N} more in your repertoire | Expands the rest of the list | clickable element | Grey |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/specialization-slot.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {role choice} | Switches the role view | button-styled link | Grey |
| See the plans / Renew your plan | Opens plans | text link | Terracotta |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/stage-note-compose.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Send | Sends the stage note | button | Blue |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/_components/stage-notes-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Got it | Marks the stage note seen | text-styled button | Green |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Exit | Exits to the day-of overview | text link | Grey |
| {section anchor} | Jumps to that section | button-styled link | link — stays a link |
| {module name} {blurb} (tile) | Opens that module | text link | link — stays a link |

## apps/web/app/vendor-dashboard/on-the-day/live/[eventId]/papic/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to the floor / Back to the Event Hub | Goes back | text link | Grey |

## apps/web/app/vendor-dashboard/on-the-day/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| See plans | Opens plans | text link | Terracotta |
| Exit preview | Exits the preview | text link | Grey |
| Launch the app | Launches the live day-of app | text link | Terracotta |
| See your customers | Opens customers | text link | Grey |
| Set up | Opens that event’s setup | button-styled link | Terracotta |
| Get verified | Opens verification | text link | Terracotta |
| All events | Goes back to all events | text link | Grey |
| Launch the app | Launches the live day-of app | button-styled link | Terracotta |
| See your customers | Opens customers | button-styled link | Grey |
| Preview the console | Opens the console preview | button-styled link | Grey |
| Your event briefs (tile) | Opens customers’ event briefs | text link | link — stays a link |
| {console tile} | Opens that day-of tool | text link | link — stays a link |
| {title} {sub} (tile) | Opens that day-of tool | text link | link — stays a link |

## apps/web/app/vendor-dashboard/packages/_components/package-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add inclusion | Adds an inclusion row | button | Terracotta |
| Let them choose between options | Adds a choice between options | text-styled button | Terracotta |
| Remove this inclusion (icon) | Removes the inclusion | icon-only | Red |
| Create package / Save changes | Saves the package | button | Green |
| Publish to my page / Unlist from my page | Publishes or unlists the package | button | Terracotta |
| Remove this option (icon) | Removes the option | icon-only | Red |
| Add another option | Adds an option | text-styled button | Terracotta |

## apps/web/app/vendor-dashboard/packages/[packageId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All packages | Goes back to all packages | text link | Grey |

## apps/web/app/vendor-dashboard/packages/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Build a package | Opens the new-package page | button-styled link | Terracotta |
| {package name} {price} (row) | Opens that package | text link | link — stays a link |

## apps/web/app/vendor-dashboard/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| create your own (inline) | Opens vendor sign-up | text link | link — stays a link |
| Earned this year (stat tile) | Opens earnings | text link | link — stays a link |
| Received of booked (stat tile) | Opens payday | text link | link — stays a link |
| {banner CTA, e.g. Finish your profile} | Opens the suggested fix | text link | Terracotta |
| Renew your plan | Opens plans to renew | text link | Green |

## apps/web/app/vendor-dashboard/partnerships/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Accept | Accepts the partnership | button | Green |
| Decline | Declines the partnership | button | Red |
| Re-propose | Re-proposes with new wording | button | Blue |
| Withdraw | Withdraws the partnership | button | Amber |
| Send request | Sends the partnership request | button | Blue |

## apps/web/app/vendor-dashboard/payday/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| bookings (inline) | Opens bookings | text link | link — stays a link |

## apps/web/app/vendor-dashboard/payment-options/_components/add-payment-method.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add a payment option | Opens the add-payment-option form | button | Terracotta |
| Cancel (X icon) | Closes the form | icon-only | Grey |
| {payment type tile, e.g. GCash} | Chooses the payment type | button | Grey |
| Upload your QR | Uploads the payment QR image | button | Terracotta |
| See plans | Opens plans | text link | Terracotta |
| Cancel | Closes the form without saving | button | Grey |
| Save payment option | Saves the payment option | button | Green |

## apps/web/app/vendor-dashboard/payment-options/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {payment link} | Opens the payment link | text link | link — stays a link |
| Make primary | Makes this the primary option | button | Grey |
| Show / Hide on my page | Shows or hides the option | button | Grey |
| Delete (confirm popup) | Opens the delete confirmation | button | Red |
| Delete | Deletes the payment option | button | Red |

## apps/web/app/vendor-dashboard/performance/_components/funnel-preview-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {funnel step} (row) | Expands that funnel step | button | Grey |

## apps/web/app/vendor-dashboard/performance/_components/growth-recs-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {recommendation CTA} | Opens the recommended fix | text link | Terracotta |

## apps/web/app/vendor-dashboard/performance/_components/health-composite-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Business health (card) | Expands the health breakdown | button | Grey |

## apps/web/app/vendor-dashboard/performance/_components/momentum-window-toggle.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Daily | Shows daily momentum | button | Grey |
| Monthly | Shows monthly momentum | button | Grey |
| Annual | Shows annual momentum | button | Grey |

## apps/web/app/vendor-dashboard/performance/_components/reply-claim-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Go to your customers | Opens customers | text link | Terracotta |

## apps/web/app/vendor-dashboard/performance/_components/service-scope-selector.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All services | Shows all services’ performance | button-styled link | Grey |
| {service name} | Shows that service’s performance | button-styled link | Grey |

## apps/web/app/vendor-dashboard/proposals/_components/reuse-inbox.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Send quote / Re-quote | Sends a quote to the couple | button | Blue |
| Decline | Declines the request | button | Red |

## apps/web/app/vendor-dashboard/proposals/surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Generate draft | Generates the quote draft | button | Terracotta |
| {quote title} | Opens that quote | text link | link — stays a link |
| Delete {template} (icon) | Deletes the template | icon-only | Red |
| New template | Expands the template form | clickable element | Terracotta |
| Save template | Saves the template | button | Green |

## apps/web/app/vendor-dashboard/real-stories/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Stories (inline) | Opens the public Stories page | text link | link — stays a link |
| View the story | Opens the public story | text link | Grey |
| Share (Facebook / copy link) | Opens share options | button | Grey |
| Save story card | Downloads the story card image | button | Grey |

## apps/web/app/vendor-dashboard/recaps/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| View the recap | Opens the public recap | text link | Grey |
| Share (Facebook / copy link) | Opens share options | button | Grey |
| Save story card | Downloads the story card image | button | Grey |

## apps/web/app/vendor-dashboard/recommendations/_panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Turn off | Turns recommendations off | button | Red |
| Turn on | Turns recommendations on | button | Terracotta |
| Suggest to a couple | Opens the suggest-to-couple form | text-styled button | Blue |
| Cancel ×3 | Closes the form | text-styled button | Grey |
| Suggest | Suggests the add-on to the couple | button | Blue |
| Not a fit for me | Opens the not-a-fit form | text-styled button | Grey |
| Send flag | Sends the not-a-fit feedback | button | Blue |
| Suggest a service to recommend | Opens the suggest-a-service form | text-styled button | Blue |
| Send suggestion | Sends the service suggestion | button | Blue |

## apps/web/app/vendor-dashboard/repertoire/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add a music service | Opens the service maker | button-styled link | Terracotta |
| Search | Searches the song list | button | Grey |
| Add | Adds the song to the repertoire | button | Terracotta |
| Add to my set list | Adds the song to the set list | button | Terracotta |
| Remove {song} (icon) | Removes the song | icon-only | Red |
| Save | Saves the performance link | button | Green |
| Watch | Opens the performance video | text link | Grey |

## apps/web/app/vendor-dashboard/reviews/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Post reply | Posts your reply to the review | button | Blue |
| Flag as fake | Expands the flag-review form | clickable element | Red |
| Submit flag | Submits the fake-review flag | button | Red |

## apps/web/app/vendor-dashboard/services/_components/addons-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove add-on (icon) | Removes the add-on | icon-only | Red |
| Add add-on | Adds an add-on row | text-styled button | Terracotta |
| Save add-ons | Saves the add-ons | button | Green |

## apps/web/app/vendor-dashboard/services/_components/canvas-maker.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start my card / Continue / Done — show my card | Moves to the next card step | button | Terracotta |
| Skip — I’ll build it myself | Skips guided mode | text-styled button | Grey |
| Pick up where I left off | Restores the saved draft | button | Terracotta |
| Start a fresh card | Discards the draft, starts fresh | button | Terracotta |
| Edit photos (card cover) | Opens the photos sheet | button | Grey |
| Choose what kind of service this is (card area) | Opens the kind sheet | clickable element | Grey |
| Edit price (card area) | Opens the price sheet | clickable element | Grey |
| Setnayan gift line (card area) | Opens the gift sheet | clickable element | Grey |
| Edit what couples get (card area) | Opens the inclusions sheet | clickable element | Grey |
| Edit who this is for (card area) | Opens the audience sheet | clickable element | Grey |
| Comes with · {N} | Expands the linked services | clickable element | Grey |
| Publish service | Publishes the service | button | Terracotta |
| Save as draft | Saves the service as a draft | button | Green |
| Make it richer — all optional | Expands optional sections | clickable element | Grey |
| {section name} {summary} (row) | Opens that optional section sheet | button | Grey |
| {service kind pill} ×3 | Picks the service kind | button | Grey |
| Something else I do / All kinds of service | Expands more kinds | clickable element | Grey |
| Tell us what you do | Opens a request for a new kind | text link | Blue |
| Add a photo (upload) | Uploads the cover photo | button | Terracotta |
| Lead-time rules (advanced) | Expands advanced rules | clickable element | Grey |
| {Yes / No} | Chooses whether to include the gift | button | Grey |
| Save who it’s for | Saves who the service is for | button | Green |
| {N} items ▴/▾ | Shows or hides the checklist | button | Grey |
| {next action, e.g. Add a photo} | Jumps to the next thing to fix | button | Terracotta |
| {finding message} | Jumps to the sheet to fix it | button | Amber |
| Close (tap outside the sheet) | Closes the sheet | clickable element | Grey |
| Close (X icon) | Closes the sheet | icon-only | Grey |
| Update card | Applies the sheet's changes | button | Green |

## apps/web/app/vendor-dashboard/services/_components/coverage-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {coverage name} › | Opens who-you-serve editor | button | Grey |
| Remove {coverage} (icon) | Removes the coverage | icon-only | Red |
| {event type chip} ×2 | Ticks an event type | button | Grey |
| {faith chip} ×2 | Ticks a faith | button | Grey |
| Close | Closes the editor | text-styled button | Grey |
| Save | Saves who you serve | button | Green |
| Back to categories | Goes back to categories | text-styled button | Grey |
| Add coverage | Adds the coverage | button | Terracotta |
| {category tile} ×2 | Picks that category | clickable element | Grey |
| Categories (breadcrumb) | Goes back to the top level | clickable element | Grey |
| {parent label} (breadcrumb) | Goes back one level | clickable element | Grey |
| {branch label} (breadcrumb) | Current level (no action) | clickable element | Grey |
| {folder tile} | Drills into that folder | clickable element | Grey |
| {group tile} | Drills into that group | clickable element | Grey |

## apps/web/app/vendor-dashboard/services/_components/customization-step.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add | Adds a customization line | button | Terracotta |
| Remove this line (icon) | Removes the line | icon-only | Red |
| {state: Required / Optional / …} | Sets how the line is offered | button | Grey |
| Ask something else | Adds a follow-up question | text-styled button | Blue |
| Remove this option (icon) | Removes the option | icon-only | Red |
| Add another option | Adds an option | text-styled button | Terracotta |

## apps/web/app/vendor-dashboard/services/_components/manager-tabs.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {tab name} | Switches the services tab | button | Grey |

## apps/web/app/vendor-dashboard/services/_components/payment-schedule-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Move up (icon) | Moves the payment up | icon-only | Grey |
| Move down (icon) | Moves the payment down | icon-only | Grey |
| Remove payment (icon) | Removes the payment | icon-only | Red |
| % of total | Sets the amount as a percentage | button | Grey |
| Fixed ₱ | Sets the amount as fixed pesos | button | Grey |
| Add payment / Add first payment | Adds a payment row | button | Terracotta |
| Save schedule | Saves the payment schedule | button | Green |

## apps/web/app/vendor-dashboard/services/_components/pricing-basis-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {pricing basis, e.g. Per guest} | Chooses how this service is priced | button | Grey |

## apps/web/app/vendor-dashboard/services/_components/publish-gate-submit.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Publish / Save label (passed in)} | Submits the service form | button | ? — label and action are passed in by the caller (publish vs save) |

## apps/web/app/vendor-dashboard/services/_components/refinements-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| More details → | Opens attributes for more details | text link | Grey |
| Save refinements | Saves the refinements | button | Green |

## apps/web/app/vendor-dashboard/services/_components/service-list-editors.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| What’s included | Expands the inclusions list | clickable element | Grey |
| Remove inclusion (icon) | Removes the inclusion | icon-only | Red |
| Add inclusion | Adds an inclusion row | button | Terracotta |
| Discounts | Expands the discounts list | clickable element | Grey |
| Remove discount (icon) | Removes the discount | icon-only | Red |
| {% / ₱} | Switches the discount unit | button | Grey |
| Add discount | Adds a discount row | button | Terracotta |
| Price by guest count | Expands the price brackets | clickable element | Grey |
| Remove bracket (icon) | Removes the bracket | icon-only | Red |
| Add price bracket | Adds a price bracket row | button | Terracotta |

## apps/web/app/vendor-dashboard/services/_components/service-wizard.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add a photo (upload) | Uploads the cover photo | button | Terracotta |
| Pricing rules (advanced) | Expands advanced rules | clickable element | Grey |
| {Yes / No} | Chooses whether to include the gift | button | Grey |
| Publish service | Publishes the service | button | Terracotta |
| Save as draft | Saves the service as a draft | button | Green |
| Back | Goes to the previous step | button | Grey |
| Continue | Goes to the next step | button | Terracotta |

## apps/web/app/vendor-dashboard/services/_components/services-manager.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Set up off-season offer | Opens the off-season offer setup | button-styled link | Terracotta |
| Add a service | Opens the service maker | text link | Terracotta |
| Add a service or coverage | Expands add options | clickable element | Terracotta |
| {service kind} · {count} | Opens that service category | button-styled link | Grey |
| Add a service | Opens the service maker | button-styled link | Terracotta |
| Start a new card from {service} (copy icon) | Starts a new card from this one | icon-only | Terracotta |
| Hide / Show service on Explore (eye icon) | Hides or shows the service | icon-only | Grey |
| Edit details | Expands the edit form | clickable element | Grey |
| Add a photo (upload) ×2 | Uploads the cover photo | button | Terracotta |
| Delete | Opens the delete confirmation | button | Red |
| Delete this service? (confirm) | Confirms deleting the service | button | Red |
| Save links | Saves the service links | button | Green |
| {tool name} {description} (tile) | Opens that service tool | text link | link — stays a link |
| ← Back to your card | Goes back to your card | text link | Grey |
| Request | Sends the new-category request | button | Blue |
| Cancel | Leaves without saving | text link | Red |
| Add service | Creates the service | button | Terracotta |
| Remove time slot {name} (icon) | Removes the time slot | icon-only | Red |
| Add slot | Adds the time slot | button | Terracotta |

## apps/web/app/vendor-dashboard/services/_components/showcase-media-fields.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add photos (upload) | Uploads showcase photos | button | Terracotta |
| Add a video (upload) | Uploads a showcase video | button | Terracotta |

## apps/web/app/vendor-dashboard/services/new/[category]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Services | Goes back to Services | text link | Grey |

## apps/web/app/vendor-dashboard/services/new/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| My Shop | Goes back to My Shop | text link | Grey |

## apps/web/app/vendor-dashboard/shop/_components/autoreply-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Auto-Reply Assistant (switch) | Turns auto-reply on or off | clickable element | Grey |
| Save | Saves the daily reply cap | button | Green |
| Compatibility auto-accept (switch) | Turns auto-accept on or off | clickable element | Grey |
| Save | Saves the match threshold | button | Green |
| Save | Saves the accept cap | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/docs-body.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Upload your document ×2 | Uploads a verification document | button | Terracotta |
| Save links / Saving… | Saves the links | button | Green |
| Remove reference {N} (icon) | Removes the reference | icon-only | Red |
| Add another reference | Adds a reference row | text-styled button | Terracotta |
| Save references / Saving… | Saves the references | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/editable-row.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Edit / Done (row toggle) | Opens or closes the row editor | button | Grey |
| Cancel | Closes the editor, discards edits | button | Red |
| Edit / Add (pencil) | Opens Services to edit this field | button-styled link | Grey |
| Upload your logo | Uploads the logo | button | Terracotta |
| OpenStreetMap (map credit) | Opens map credit page | text link | link — stays a link |
| Find on map | Finds the address on the map | button | Grey |

## apps/web/app/vendor-dashboard/shop/_components/manage-tiles.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {count} {label} (tile) | Expands that manage section | button | Grey |

## apps/web/app/vendor-dashboard/shop/_components/public-line-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves your public line | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/reach-map.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| © OpenStreetMap | Opens map credit page | text link | link — stays a link |

## apps/web/app/vendor-dashboard/shop/_components/request-correction-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Ask us to correct something | Opens the correction form | button | Blue |
| Send to Setnayan | Sends the correction request | button | Blue |
| Cancel | Closes the form | text-styled button | Grey |

## apps/web/app/vendor-dashboard/shop/_components/service-radius-fields.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save distances / Saving… | Saves the distances | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/services-disclosure.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Your services (row) | Expands the services section | button | Grey |

## apps/web/app/vendor-dashboard/shop/_components/shop-rail.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {N} {step title} {question} | Opens that shop step | button-styled link | link — stays a link |

## apps/web/app/vendor-dashboard/shop/_components/suggested-coverage-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {suggested coverage} | Ticks a suggested coverage | button | Grey |
| Add ({…}) | Adds the ticked coverages | button | Terracotta |
| Not now | Dismisses the suggestions | text-styled button | Grey |

## apps/web/app/vendor-dashboard/shop/_components/venue-match-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves venue matching | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/venue-type-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Clear | Clears the venue type | text-styled button | Grey |

## apps/web/app/vendor-dashboard/shop/_components/verify-pairs.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Upload your document | Uploads a verification document | button | Terracotta |
| Use the value on my paper | Saves the value read from the paper | button | Green |
| Save / Saving… ×2 | Saves the typed value | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/verify-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| First step: finish your business profile | Scrolls to the profile fields | text link | Terracotta |
| {step title} (row) | Expands that verification step | button | Grey |
| Try again | Reloads the section | text-styled button | Amber |
| Copied / Copy | Copies the code | button | Grey |
| Email {…} | Opens email with the code | button-styled link | Blue |
| Text {…} | Opens text message with the code | button-styled link | Blue |
| Submit for review | Submits for review | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/visibility-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves visibility | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/voice-match-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Use my voice on replies (switch) | Turns voice matching on or off | clickable element | Grey |
| Use my past replies | Learns from your past replies | button | Terracotta |
| Learn from my past replies (switch) | Turns learning on or off | clickable element | Grey |
| Use po and opo (switch) | Turns honorifics on or off | clickable element | Grey |
| Save voice / Save | Saves your voice | button | Green |

## apps/web/app/vendor-dashboard/shop/_components/website-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| View page | Opens the public page | text link | Grey |
| Copy | Copies the page link | button | Grey |
| Open live | Opens the live page | text link | Grey |
| Open full website settings | Opens website settings | text link | Grey |
| Save | Saves the About text | button | Green |
| {service name} | Shows or hides the service on the page | button | Grey |
| Show {section} (switch) | Shows or hides a page section | clickable element | Grey |
| {accent colour name} | Picks the accent colour | button | Grey |
| Automatic (hero tile) | Uses an automatic hero photo | clickable element | Grey |
| {photo} (hero tile) | Picks that hero photo | clickable element | Grey |
| None (newest first) | Clears the pinned review | clickable element | Grey |
| {review} (row) | Pins that review | clickable element | Grey |
| {editorial} (row) | Shows or hides that editorial | button | Grey |
| Add photos (upload) | Uploads portfolio photos | button | Terracotta |
| Save / Saving… | Saves the page settings | button | Green |
| See plans | Opens plans | text link | Terracotta |

## apps/web/app/vendor-dashboard/shop/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Set up my shop | Opens shop setup | button-styled link | Terracotta |
| Save | Saves the business start date | button | Green |
| Packages (card) | Opens packages | text link | link — stays a link |
| Verification in review | Scrolls to verification | button-styled link | Amber |
| Get verified · {…} of 2 | Scrolls to the verify steps | button-styled link | Terracotta |
| Copy link | Copies the public page link | button | Grey |
| View as couple | Opens your public page | button-styled link | Grey |
| {shop CTA, e.g. Publish your page} | Opens the suggested next step | button-styled link | Terracotta |
| Add | Invites a team member | button | Terracotta |
| {tile label} {sub} | Opens that shop section | text link | link — stays a link |

## apps/web/app/vendor-dashboard/subscription/_components/ai-addon-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Turn on Vendor AI / Renew — {price} / 28 days | Buys or renews Vendor AI | button | Green |

## apps/web/app/vendor-dashboard/subscription/_components/booth-addon-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Turn on / Renew — {price} / 28 days | Buys or renews the booth add-on | button | Green |

## apps/web/app/vendor-dashboard/subscription/_components/cycle-toggle.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Monthly / Annual} | Switches the billing cycle | button-styled link | Grey |

## apps/web/app/vendor-dashboard/subscription/_components/papic-challenge-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Turn on / Renew — {price} / 28 days | Buys or renews Papic Challenges | button | Green |

## apps/web/app/vendor-dashboard/subscription/_components/plan-change-notice.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Keep my current plan instead | Cancels the scheduled plan change | text-styled button | Grey |

## apps/web/app/vendor-dashboard/subscription/_components/subscription-cards.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {plan CTA, e.g. Start Pro} | Starts buying that plan | button | Green |
| Get verified first | Opens verification first | button-styled link | Terracotta |

## apps/web/app/vendor-dashboard/subscription/custom/_components/custom-configurator.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Adjust | Opens the plan adjuster | button | Grey |
| {Monthly / Annual} | Picks the term | button | Grey |
| {payment channel} | Picks the payment channel | button | Grey |
| Request this plan / Sending… | Sends the custom plan request | button | Blue |
| Decrease {item} (− icon) | Lowers the amount | icon-only | Grey |
| Increase {item} (+ icon) | Raises the amount | icon-only | Grey |

## apps/web/app/vendor-dashboard/subscription/custom/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Plans | Goes back to Plans | text link | Grey |

## apps/web/app/vendor-dashboard/subscription/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| You have {N} unpaid booking fee(s)… (banner) | Opens booking fees to pay | text link | Green |
| Billing cycle toggle | Switches Monthly/Annual | button | Grey |
| Beyond Enterprise? Compose a Custom plan (card) | Opens the custom plan builder | text link | link — stays a link |
| Deep Search (card) | Opens Deep Search | text link | link — stays a link |
| Send your payment | Opens the payment page | button-styled link | Green |

## apps/web/app/vendor-dashboard/team/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Approve✓ | Votes to approve the motion | button | Green |
| Reject✓ | Votes to reject the motion | button | Red |
| Cancel vote | Cancels your vote | text-styled button | Red |
| Add | Invites the team member | button | Terracotta |
| Add a seat (₱{…}) | Buys an extra seat | button | Green |
| Step down | Steps down to Agent | button | Red |
| Remove team member (icon) | Removes the member | icon-only | Red |
| Save | Saves the member’s role | button | Green |
| Start vote | Starts an admin vote | button | Terracotta |
| Start removal vote | Starts a removal vote | text-styled button | Red |
| Save assignments | Saves the service assignments | button | Green |

## apps/web/app/vendor-dashboard/track-record/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Go to my shop | Opens the shop | text link | Terracotta |

## apps/web/app/vendor-dashboard/website/_domain-manager.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {…} Verify | Verifies the domain | button | Amber |
| Remove {domain} (icon) | Removes the domain | icon-only | Red |
| Add domain | Adds the domain | button | Terracotta |

## apps/web/app/vendor-dashboard/website/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Edit page | Opens the page editor | button-styled link | Grey |
| Open live / Open preview | Opens the public page | button-styled link | Grey |
| see what’s left (inline) | Opens verification | text link | link — stays a link |
| Name my shop / Edit in My Shop | Opens the shop to name it | button-styled link | Terracotta |

## apps/web/app/vendor/claim/[token]/finalize/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to sign in | Goes to sign in | button-styled link | Grey |

## apps/web/app/vendor/claim/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Claim & sign up ×3 | Opens sign-up to claim the shop | button-styled link | Green |
| Sign in & claim | Opens sign-in to claim the shop | button-styled link | Green |
| Sign in & connect | Opens sign-in to connect the shop | button-styled link | Green |
| Back to Setnayan | Goes to the home page | button-styled link | Grey |
| I’m not this supplier | Declines the claim invitation | button | Red |

## apps/web/app/vendor/fit/[ref]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Sign up free & check the fit | Opens couple sign-up | button-styled link | Terracotta |
| I already have an account | Opens sign-in | text link | Grey |
| Set up your event | Opens event setup | button-styled link | Terracotta |
| {event name} | Switches which event to check | button-styled link | Grey |
| Add to my shortlist | Adds the supplier to your shortlist | button | Terracotta |

## apps/web/app/vendor/lock/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Go to your suppliers | Opens your suppliers | button-styled link | Terracotta |
| Sign up free & lock it in | Opens couple sign-up to lock it in | button-styled link | Green |
| I already have an account | Opens sign-in | text link | Grey |
| Set up your event | Opens event setup | button-styled link | Terracotta |
| Lock it in | Locks the supplier in | button | Green |

## Totals

- Controls counted: **785** (rows after expanding ×N)
- Today a button already: 332 · button-styled link (already pill-shaped, may need recolour): 105 · clickable element (summary / tile / chip / switch / overlay): 74
- Text links or text-styled buttons that must become buttons: **137**
- Bare icons (icon-only, no word) that must become buttons: **67**
- Pure page links that stay links (nav, rows, tiles, inline prose, map credits): **73**
- Marked "?": **3**
- Not listed: 65 dropdown selects, 38 checkbox/radio/range fields, plus hidden file inputs wired to listed buttons.
