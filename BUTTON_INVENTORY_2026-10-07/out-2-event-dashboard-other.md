# Event dashboard (non-excluded areas) — button inventory

Source: apps/web/app/dashboard/[eventId]/ excluding vendors, budget, workspace, guests, website, hub, launch. Rule: owner 2026-10-07. Dynamic repeats (per-guest, per-item) count once unless noted.

## apps/web/app/dashboard/[eventId]/_components/access-requests-doorway.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Your coordinator is asking for access / N access requests are waiting | Opens the access requests page | link — stays a link | n/a |
| We couldn't check for access requests | Opens the access requests page | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/address-pin-field.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Find | Finds typed address on the map | button | Grey |

## apps/web/app/dashboard/[eventId]/_components/after/finished-event-summary.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Open your page | Opens event overview | link — stays a link | n/a |
| Open the guest list | Opens guest list | link — stays a link | n/a |
| Open your suppliers / Open the marketplace | Opens suppliers or marketplace | link — stays a link | n/a |
| Open More Services | Opens More Services | link — stays a link | n/a |
| Open the photos | Opens galleries | link — stays a link | n/a |
| Open the editorial maker | Opens the story editor | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/checklist/checklist-full.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Manage | Opens supplier shortlist | link — stays a link | n/a |
| {suggestion} (e.g. 'Photo booth') per suggestion | Opens that supplier category | link — stays a link | n/a |
| Budget health card (normal and couldn't-check) ×2 | Opens budget page | link — stays a link | n/a |
| Mark "{task}" done / not done (check circle) | Ticks or unticks a checklist task | icon-only | Green |
| Go to {task} (arrow) | Opens the page for that task | link — stays a link | n/a |
| {date hint} (dashed row) | Opens invitation page to set date | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/cohost-welcome.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Confirm | Marks the welcome notice as read | button | Green |

## apps/web/app/dashboard/[eventId]/_components/connect-supplier-modal.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Close (X) | Closes the connect dialog | icon-only | Grey |
| SupplierConnectPanel (custom component, defined elsewhere) | Gives the supplier their own account link | button | ? |

## apps/web/app/dashboard/[eventId]/_components/coordinator-seat-controls.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Change in People with access | Opens people-with-access page | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/customer-sidebar.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| All your events | Back to all events | link — stays a link | n/a |
| Sidebar nav items (custom SidebarItem, defined elsewhere) | Open each dashboard section | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/date-change-doorway.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Keep waiting | Keeps waiting on the supplier's answer | button | Grey |
| Drop {supplier name} | Releases that supplier's booking | button | Red |
| Every supplier answered — Apply {new date} in your Event Hub | Applies the new date | button | Terracotta |
| Withdraw — keep my date / Cancel the change — keep my date | Cancels the date change | text link | Red |

## apps/web/app/dashboard/[eventId]/_components/day-of-mode/banner.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Dismiss event day banner (X) | Hides the banner for an hour | icon-only | Grey |

## apps/web/app/dashboard/[eventId]/_components/day-of-mode/coordinator-broadcast-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Broadcast | Sends an update to everyone | button | Blue |
| Email call-times to suppliers (N) | Emails call times to suppliers | button | Blue |
| Receive broadcasts on this device (checkbox, 'coming soon' card) | Toggles broadcast opt-in | clickable element | Grey |

## apps/web/app/dashboard/[eventId]/_components/day-of-mode/get-help-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {supplier name} rows (same-day suppliers) per supplier | Opens supplier's public page | link — stays a link | n/a |
| Get help | Opens the help page | button | Blue |

## apps/web/app/dashboard/[eventId]/_components/day-of-mode/grid.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| When the day winds down, close it out | Opens clearance to close the day | button | Terracotta |

## apps/web/app/dashboard/[eventId]/_components/day-of-mode/live-photo-wall-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Open the wall on a screen | Opens the live photo wall | button | Grey |

## apps/web/app/dashboard/[eventId]/_components/day-of-mode/live-schedule-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Full schedule | Opens the schedule page | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/day-of-mode/your-table-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Plan | Opens seating page | link — stays a link | n/a |
| Open seating | Opens seating page | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/device-frame.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| iPhone | Previews on iPhone frame | button | Grey |
| MacBook Pro 16" | Previews on MacBook frame | button | Grey |

## apps/web/app/dashboard/[eventId]/_components/event-rail-context.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {event name} / Details (settings gear) | Opens event settings | link — stays a link | n/a |
| More Services (row with chevron) | Expands or collapses More Services | clickable element | Grey |
| {More Services child} per child | Opens that service page | link — stays a link | n/a |
| {rail row} per row (Guests, Budget, etc.) | Opens that dashboard section | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/expand-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {card title} (full-width toggle with chevron) | Expands or collapses the card | clickable element | Grey |
| {fullLabel} → | Opens the full page | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/feature-us-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Credit us by first names (radio pill) | Chooses first-names credit | clickable element | Grey |
| Keep us anonymous (radio pill) | Chooses anonymous credit | clickable element | Grey |
| Allow featuring | Saves consent to be featured | button | Green |

## apps/web/app/dashboard/[eventId]/_components/home-first-screen.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Event Details | Opens event details sheet | button | Grey |
| {next.action} (shared NextCard, defined elsewhere) | Takes the one next step | button | ? |
| Later (shared NextCard, setup offer only) | Postpones the setup offer | button | Grey |
| Edit your Event Hub | Opens the Event Hub maker | button | Grey |
| What's next (row with chevron) | Opens the what's-next sheet | clickable element | Grey |
| Paid / Still owing tile | Opens budget page | link — stays a link | n/a |
| {service name} tile per service | Opens that service | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/inline-checkout-drawer.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Add this service · ₱{price} (label varies by caller) | Opens the checkout drawer | button | Terracotta |
| Close checkout (dim backdrop) | Closes the checkout drawer | clickable element | Grey |
| Close (X) | Closes the checkout drawer | icon-only | Grey |
| Have a code? | Reveals the voucher code field | text link | Grey |
| Remove voucher (X) | Removes the applied voucher | icon-only | Red |
| Apply | Applies the voucher code | button | Terracotta |
| Payment channel toggle (ChannelToggle, shared) | Picks GCash or bank | button | Grey |
| Payment screenshot · required (FileUpload, shared) | Uploads the payment screenshot | clickable element | Grey |
| Submit request | Submits the order with payment proof | button | Green |
| Copy (CopyButton, shared) | Copies the reference code | button | Grey |
| Track this order | Opens the order page | button | Grey |
| Done | Closes the drawer after success | button | Green |

## apps/web/app/dashboard/[eventId]/_components/more-services-sheet.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {service name} rows per service | Opens that service and closes sheet | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/new-manual-vendor-modal.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Close (X) | Closes the add-supplier dialog | icon-only | Grey |
| Choose a photo (round avatar) | Opens the photo picker | icon-only | Grey |
| Add photo / Replace photo | Opens the photo picker | button | Grey |
| {marketplace supplier} suggestion rows per match | Links to that marketplace supplier | clickable element | Terracotta |
| Hide (suggestions) | Hides the suggestions list | text link | Grey |
| Pick different | Unlinks the picked marketplace supplier | text link | Grey |
| Cancel | Closes without saving | button | Red |
| Save & add / Save changes / Add to plan | Saves the supplier to the plan | button | Green |
| Done (after save) | Closes the dialog | button | Green |
| SupplierConnectPanel (custom component, defined elsewhere) | Gives the supplier their own account link | button | ? |

## apps/web/app/dashboard/[eventId]/_components/nikah-essentials-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Add wali | Opens guest list to add a wali | text link | Terracotta |
| Add imam | Opens guest list to add an imam | text link | Terracotta |
| Add witnesses | Opens guest list to add witnesses | text link | Terracotta |
| Save Nikah details | Saves mahr and Nikah details | button | Green |
| Set a guest modesty note in your Mood Board | Opens the Mood Board | link — stays a link | n/a |

## apps/web/app/dashboard/[eventId]/_components/overview-inspector-body.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {ctaLabel} → | Takes the suggested decision action | button | Terracotta |

## apps/web/app/dashboard/[eventId]/_components/papic-ready-nudge.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Open Papic | Opens the Papic page | link — stays a link | n/a |
| Dismiss the Papic camera reminder (X) | Hides the reminder | icon-only | Grey |

## apps/web/app/dashboard/[eventId]/_components/payment-plan-rows.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Move payment N earlier (up arrow) per row | Moves the payment up | icon-only | Grey |
| Move payment N later (down arrow) per row | Moves the payment down | icon-only | Grey |
| Remove payment N (trash) per row | Deletes that payment row | icon-only | Red |
| Add payment | Adds a payment row | text link | Terracotta |

## apps/web/app/dashboard/[eventId]/_components/reveal-preview-card.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| No reveal | Chooses no opening animation | clickable element | Grey |
| {reveal template name} tiles per template | Previews that opening | clickable element | Grey |
| Add music | Toggles opening music | clickable element | Grey |
| Add falling petals | Toggles falling petals | clickable element | Grey |
| Veil colour / Petal colour swatches ×2 | Opens colour picker | clickable element | Grey |
| Reset ×2 (Veil colour, Petal colour) | Resets colour to Mood Board | text link | Amber |
| Make this mine | Saves the chosen opening | button | Green |

## apps/web/app/dashboard/[eventId]/_components/services-covered-picker.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Remove {service} (X on chip) per chip | Removes a covered service | icon-only | Red |
| + {service} suggestion rows per match | Adds a covered service | clickable element | Terracotta |

## apps/web/app/dashboard/[eventId]/_components/set-date-nudge.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Set your date | Opens date selection page | link — stays a link | n/a |
| Dismiss set-your-date reminder (X) | Hides the reminder | icon-only | Grey |

## apps/web/app/dashboard/[eventId]/_components/std-background-picker.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Same as theme | Uses the theme background | clickable element | Grey |
| Background colour swatches per preset | Picks a plain colour | clickable element | Grey |
| + (Custom colour) | Opens colour picker | clickable element | Grey |
| Paper swatches per paper | Picks a paper background | clickable element | Grey |
| Realistic scene tiles per scene | Picks a photoreal background | clickable element | Grey |
| Upload your own (FileUpload, shared) | Uploads a custom background | clickable element | Grey |

Note: rows marked 'per item' are lists of dynamic length and are counted once each; ×2 rows are counted per the ×N rule only where stated.


## apps/web/app/dashboard/[eventId]/_components/std-media-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Photo gallery (card) | Choose gallery as film ending | clickable element (selectable card button) | Grey |
| Upload a video (card) | Choose video as film ending | clickable element (selectable card button) | Grey |
| Fill | Video plays edge to edge | button (segmented toggle) | Grey |
| Fit to screen | Video shows whole frame | button (segmented toggle) | Grey |

## apps/web/app/dashboard/[eventId]/_components/supplier-connect-panel.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Copy / Copied | Copies the connect link | button | Grey |
| Share | Opens device share sheet for link | button | Grey |
| Create their link | Creates supplier invite link | button | Terracotta |

## apps/web/app/dashboard/[eventId]/_components/vendor-direct-pay.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Pay {vendor} directly (e.g. Pay Seda directly) | Opens direct-payment sheet | clickable element (full-width card button) | Green |
| Preview as couple (admin) | Opens payment sheet preview | button | Grey |
| Sheet close X / backdrop (Sheet component, imported) | Closes direct-payment sheet | icon-only | Grey |
| Open wallet (OpenWalletButton, imported, mobile only) | Opens GCash or bank app | button (custom component) | Green |
| Copy / Copied ×3 (account name, number, bank) | Copies the field value | button | Grey |
| Show QR | Opens QR code modal | button | Grey |
| Close (backdrop) ×2 | Dismisses QR or link modal | clickable element (invisible backdrop) | Grey |
| Close X ×2 | Closes QR or link modal | icon-only | Grey |
| Pay | Opens leaving-Setnayan confirm | button | Green |
| Cancel | Dismisses leaving-Setnayan confirm | button | Grey |
| Continue | Opens supplier payment page | button | Terracotta |

## apps/web/app/dashboard/[eventId]/_components/vendor-itemization-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Message (ContactShortlistVendorButton, supplier on Setnayan) | Opens or resumes chat thread | button (custom component) | Blue |
| Message (supplier not on Setnayan) | Goes to Messages, email prefilled | button-styled link | Blue |
| Open workspace | Goes to supplier workspace page | button-styled link | link — stays a link |
| Supplier ledger row header (whole summary strip) | Expands or collapses the ledger | clickable element (details summary) | Grey |
| Ask them for pricing (ContactShortlistVendorButton) | Opens chat thread asking price | button (custom component) | Blue |
| Delete line item (trash) | Opens confirm, removes line item | icon-only (inside ConfirmForm) | Red |
| Suggest a deposit + balance split | Seeds deposit and balance milestones | button (custom component) | Terracotta |
| Add line item | Adds a manual line item | button | Terracotta |
| Add an extra not on the supplier's catalog | Expands add-extra form | clickable element (details summary, text) | Grey |
| Add extra | Adds an off-catalog extra | button | Terracotta |
| Delete payment (trash) | Opens confirm, removes logged payment | icon-only (inside ConfirmForm) | Red |
| Amount to pay (arrow) | Goes to the Amount to pay step | text link | Green |
| Log a payment | Expands the log-payment form | clickable element (details summary, text) | Green |
| Log | Records the payment | button | Green |

## apps/web/app/dashboard/[eventId]/_components/vendor-marketplace-info.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| See all (reviews) | Opens supplier's public reviews, new tab | text link | link — stays a link |
| Write a review | Goes to the review form | text link | Terracotta |

## apps/web/app/dashboard/[eventId]/access-requests/_components/request-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Share (per area, e.g. Share) ×N areas | Marks that area as shared | button (toggle) | Green |
| Decline (per area) ×N areas | Marks that area as declined | button (toggle) | Red |
| Send my answer | Submits all share/decline answers | button | Green |

## apps/web/app/dashboard/[eventId]/access-requests/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| See and change what each person can open | Goes to People with access | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/activity/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back (arrow, uppercase) | Returns to event home | text link | Grey |
| Add your first guest (empty state) | Goes to Guests to add one | button-styled link | Terracotta |
| Activity row (description + time) ×N | Opens the thing that happened | text link (whole row) | link — stays a link |

## apps/web/app/dashboard/[eventId]/alaala/assignments/_components/assignment-controls.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Assign (next to guest dropdown) ×10 moments | Assigns chosen guest to a story moment | button | Terracotta |
| Nudge ×N assigned guests | Sends reminder email to assigned guest | button | Amber |
| Remove ×N assigned guests | Removes the guest assignment | button | Red |

## apps/web/app/dashboard/[eventId]/alaala/assignments/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ← Memories | Returns to Memories page | text link | Grey |

## apps/web/app/dashboard/[eventId]/alaala/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Feature chips (Save the Date, Papic, Patiktok, Panood, Photo Notes, Mood Board, Animated Monogram, Pakanta, Playlist, Landing page, Photo delivery, Indoor blueprint; labels come from catalog) ×12 | Opens that feature's page | text link (pill chip; plain text when coming soon) | link — stays a link |
| See all → (Mga Boses) | Opens Papic moderation | text link | link — stays a link |
| Manage assignments → | Goes to Story Assignments | button-styled link | Terracotta |
| Add to your Memories | Goes to the studio hub | button-styled link | Terracotta |

## apps/web/app/dashboard/[eventId]/clearance/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Go to your dashboard (after closing) | Goes to the event dashboard | button-styled link | link — stays a link |
| Stop the livestream | Goes to Launch page to end stream | text link (whole row) | link — stays a link |
| Freeze the photo wall | Goes to Live wall page | text link (whole row) | link — stays a link |
| Close check-in | Goes to check-in desk page | text link (whole row) | link — stays a link |
| Close out the day | Marks the event day as closed out | button | Green |

## apps/web/app/dashboard/[eventId]/contracts/[contractId]/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to contracts | Returns to contracts list | text link | Grey |
| View / download | Opens contract PDF in new tab | button-styled link | Grey |

## apps/web/app/dashboard/[eventId]/contracts/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| See all documents | Goes to Documents page | text link | link — stays a link |
| Contract card (ContractCard, imported) ×N | Opens that contract | text link (whole card) | link — stays a link |

## apps/web/app/dashboard/[eventId]/date-selection/_components/candidate-date-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Lock in {date label} (e.g. Lock in Sat, 12 Dec 2027) ×N candidate dates | Locks that date as the event date | button | Green |
| {Supplier name} pill (Pin a must-have supplier) ×N suppliers | Toggles pinning supplier as must-have | button (toggle chip) | Grey |
| Clear | Removes the pinned supplier | text link (inline underlined button) | Grey |
| Pick a different date | Goes to direct date picking path | text link | link — stays a link |
| get a meaningful suggestion | Goes to guided date path | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/date-selection/_components/chinese-specialist-nudge.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Find a date / feng-shui specialist | Goes to Explore specialists category | button-styled link | link — stays a link |

## apps/web/app/dashboard/[eventId]/date-selection/_components/date-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back (arrow + dynamic back label) | Returns to previous date path step | text link | Grey |
| Pick another path | Returns to path choice | button-styled link | Grey |
| Lock this date and start planning | Locks chosen date, starts planning | button | Green |

## apps/web/app/dashboard/[eventId]/date-selection/_components/four-question-flow.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to date selection | Returns to date path chooser | text link | Grey |
| Tradition options (radio cards, step 1) | Picks ceremony tradition | clickable element (radio card) | Grey |
| Indoor / outdoor options (radio cards, step 2) | Picks venue setting | clickable element (radio card) | Grey |
| Remove this date (trash) ×N draft rows | Removes a meaningful date row | icon-only | Red |
| Add another date | Adds a meaningful-date row | button | Terracotta |
| Sukob options (radio cards, step 4) | Picks sibling-wedding preference | clickable element (radio card) | Grey |
| Back | Goes to the previous question | button | Grey |
| Continue / See suggestions | Saves answer, goes to next step | button | Terracotta |
| Lock this date ×5 suggestions | Locks that suggested date | button | Green |

## apps/web/app/dashboard/[eventId]/date-selection/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to {event name} (e.g. Back to Maria and Jose) ×2 | Returns to event home | text link | Grey |
| I have a date in mind | Starts direct date-picking path | text link (whole card) | link — stays a link |
| Help me pick a meaningful one | Starts guided four-question path | text link (whole card) | link — stays a link |
| I'm not ready yet | Marks date undecided, exits | clickable element (whole-card submit button) | Grey |

## apps/web/app/dashboard/[eventId]/details/_components/details-form.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save basics | Saves event basics form | button | Green |

## apps/web/app/dashboard/[eventId]/details/_components/pax-settings-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save | Saves guest-count settings | button | Green |

## apps/web/app/dashboard/[eventId]/details/_components/put-away-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Put this away | Opens put-away confirmation | button | Red |
| Yes, put {event name} away | Archives event, cameras go quiet | button | Red |
| Cancel | Dismisses the put-away confirmation | button | Grey |
| Bring it back | Restores put-away event to active | button | Amber |

## apps/web/app/dashboard/[eventId]/details/_components/record-fold.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {Group title} + summary + chevron (mobile only) ×4 groups | Expands or collapses a record group | clickable element (full-width toggle button) | Grey |

## apps/web/app/dashboard/[eventId]/details/_components/record-row-link.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {Field row} + chevron (component; instances counted on details page) | Opens or closes that field's editor | clickable element (whole-row link) | Grey |

## apps/web/app/dashboard/[eventId]/details/_components/people-with-access.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Area level dropdown (e.g. Guests: View / Edit / Off) ×N areas per person | Sets that person's access per area | button (PickMenu dropdown, imported) | Grey |
| Access dropdown (Co-host / Limited helper / None) ×N guests | Sets a guest's overall access | button (PickMenu dropdown, imported) | Grey |
| Reason… (why {name} is leaving) ×N coordinators | Picks reason for removing coordinator | button (PickMenu dropdown, imported) | Grey |
| Remove (underlined, disabled until reason) ×N coordinators | Removes coordinator's access | text link (underlined submit text) | Red |
| Invite as coordinator ×N suppliers | Goes to supplier workspace to promote | text link | Terracotta |
| Add a person | Dropdown to give a guest helper access | button (PickMenu dropdown, imported) | Terracotta |

## apps/web/app/dashboard/[eventId]/details/_components/governed-fields.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Contact support ×2 (booked-supplier lock notices) | Goes to Help page | text link | link — stays a link |
| Change ×5 (wedding type, ceremony venue, venue, guest count, date) | Opens that field's editor | button | Grey |
| We're also holding a Chinese tea ceremony (checkbox) | Toggles tea-ceremony layer, saves instantly | clickable element (checkbox) | Grey |
| More date options | Goes to date selection page | text link | link — stays a link |
| Remove ×N conflicting suppliers | Removes affected supplier from event | button | Red |
| Apply change / Apply anyway | Commits the change despite conflicts | button | Green |
| Cancel ×2 (conflict step, edit step) | Closes the field editor | button | Grey |
| Check & save / Save | Checks conflicts, then saves field | button | Green |

## apps/web/app/dashboard/[eventId]/details/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Undo (HubDraftDock, imported) | Undoes waiting Maker changes | button (custom component) | Amber |
| Apply (HubDraftDock, imported) | Publishes waiting Maker changes | button (custom component) | Terracotta |
| {HOME_GUIDE_ACTION label} (Finish your Event Hub card) | Continues Event Hub setup guide | button-styled link | Terracotta |
| Detail rows that open an editor (Buttons, Names, Area, Ceremony time, Guest list closes etc.) ×21 | Opens that field's editor in place | clickable element (whole-row link, see record-row-link.tsx) | Grey |
| Detail rows that open a studio (Logo / monogram, Guests arrive, Reception, Dress code, etc.) ×7 | Opens that studio or tool page | clickable element (whole-row link with chevron) | link — stays a link |
| Locked detail rows ×6 (when a supplier is booked) | Expands lock explanation | clickable element (details summary) | Grey |
| Contact support (inside locked row) | Goes to Help page | text link | link — stays a link |
| Open Guest list / Open Budget / Open Suppliers / Open Services / Open Purchases | Goes to that full page | text link (chevron) | link — stays a link |
| Plan it myself (switch) | Toggles manual or guided planning mode | icon-only (switch toggle) | Grey |

## apps/web/app/dashboard/[eventId]/disputes/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Open a new dispute | Expands the new-dispute form | clickable element (details summary, text) | Terracotta |
| Flag type options (radio cards) ×6 | Picks the type of dispute | clickable element (radio card) | Grey |
| Evidence upload (FileUpload, imported) | Attaches evidence files | button (custom component) | Grey |
| File flag | Submits the dispute | button | Green |
| file 1, file 2 ... ×N attachments | Opens an evidence file, new tab | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/documents/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Start your paperwork (empty state) | Goes to Paperwork page | button-styled link | Terracotta |
| See contract uploads (empty state) | Goes to Contracts page | button-styled link | Grey |
| Manage (Government paperwork header) | Goes to Paperwork page | text link | link — stays a link |
| See all (Supplier contracts header) | Goes to Contracts page | text link | link — stays a link |
| See all (Order receipts header) | Goes to Orders page | text link | link — stays a link |
| Open paperwork / See chat threads / Browse add-ons / Open orders ×2 (empty sections) | Goes to the related page | text link | link — stays a link |
| Paperwork row ×N | Opens that paperwork item | text link (whole row) | link — stays a link |
| Contract row ×N | Opens that contract | text link (whole row) | link — stays a link |
| Creation order row ×N | Goes to Orders | text link (whole row) | link — stays a link |
| Order receipt row ×N | Goes to Orders | text link (whole row) | link — stays a link |
| Transaction receipt row (TXN-...) ×N | Opens public receipt | text link (whole row) | link — stays a link |

## apps/web/app/dashboard/[eventId]/event-qr/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Regenerate QR | Rotates the crew pairing QR code | button | Amber |

## apps/web/app/dashboard/[eventId]/find-date/_components/find-your-date.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Set your wedding date (empty state) | Goes to date selection | button-styled link | Terracotta |
| Shortlist suppliers (empty state) | Goes to Suppliers to shortlist | button-styled link | Terracotta |
| {Supplier name} pill (Pin a must-have) ×N suppliers | Toggles pinning supplier as must-have | button (toggle chip) | Grey |
| Clear | Removes the pinned supplier | text link (inline underlined button) | Grey |
| Date card (e.g. Sat, 12 Dec + coverage headline) ×N dates | Expands who works together that date | clickable element (full-width toggle) | Grey |
| Set a month or a date range | Goes to date selection | text link | link — stays a link |
| Lock it in your date settings | Goes to date selection | text link | link — stays a link |


## apps/web/app/dashboard/[eventId]/galleries/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| View & download / Open Papic / Look anyway (Papic source) | Opens that photo source | button | Grey |
| Watch the recording | Opens the recording | button | Grey |
| View & manage / Add photos / Look anyway (own photos source) | Opens or adds to own photos | button | Grey (Terracotta when label is Add photos) |
| Photo Delivery (doorway row, whole row clickable) | Opens Photo Delivery page | link — stays a link | link |
| Memories (doorway row, whole row clickable) | Opens Memories page | link — stays a link | link |

## apps/web/app/dashboard/[eventId]/hosts/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to {event name} | Returns to event home | text link | Grey |
| Everyone in this event | Opens the people page | button | Grey |

## apps/web/app/dashboard/[eventId]/invitation/_components/guest-invite-modal.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Send / Sent (per guest) | Opens the guest's message dialog | text link | Blue |
| Close (X) | Closes the dialog | icon-only | Grey |
| Copy to clipboard / Copied | Copies the guest's message | button | Grey |
| Mark sent | Records invitation as handed out | button | Green |
| Not sent yet | Undoes the sent mark | button | Amber |

## apps/web/app/dashboard/[eventId]/invitation/_components/reissue-qr-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Re-issue | Opens replace-QR confirm dialog | text link | Amber |
| Close (X) | Closes the dialog | icon-only | Grey |
| Cancel | Closes dialog without replacing | text link | Grey |
| Replace QR / Replacing… | Invalidates old QR, issues new | button | Red |
| (backdrop click on dialog overlay) | Closes the dialog | clickable element | Grey |

## apps/web/app/dashboard/[eventId]/invitation/_components/slug-field.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save slug / Saving… | Saves the invitation address | button | Green |
| {suggested slug} e.g. maria-and-juan-2 (chip, per suggestion) | Fills the field with that slug | button | Terracotta |

## apps/web/app/dashboard/[eventId]/invitation/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Print sheet (A4) | Opens printable QR sheet in new tab | button | Grey |
| Download tag list (TagListDownload, imported) | Downloads guest tag links as CSV | button | Grey |
| Save monogram / Saving… | Saves QR monogram text and colour | button | Green |
| Preview as guest | Opens the invitation site in new tab | button | Grey |
| {guest name} (table row link) | Opens that guest's page | link — stays a link | link |
| {guest name} (mobile list link) | Opens that guest's page | link — stays a link | link |
| QR strip: Download PNG / NFC / Copy link (QrActions, imported) ×2 | Saves, writes or copies QR link | button | Grey |
| (per-guest Send and Re-issue come from the two component files above, ×2 layouts) | see guest-invite-modal / reissue-qr-button | n/a | n/a |

## apps/web/app/dashboard/[eventId]/live/_components/flash-auto-wall-toggle.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Flash auto-wall (on/off switch) | Toggles auto-posting Flash stories | clickable element | Grey |

## apps/web/app/dashboard/[eventId]/live/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| See it in Add-ons | Opens add-ons hub for Live Wall | button | Terracotta |
| Flash auto-wall switch (FlashAutoWallToggle, counted in its file) | n/a | n/a | n/a |
| KwentoQueue (imported queue of guest stories) | not in my files, not inventoried | n/a | n/a |

## apps/web/app/dashboard/[eventId]/manpower/_components/post-gig-drawer.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Post a manpower gig | Opens the new-gig form | button | Terracotta |
| Close (X) | Closes the form | icon-only | Grey |
| Cancel | Closes form without posting | button | Grey |
| Post gig / Posting… | Publishes gig to the board | button | Terracotta |

## apps/web/app/dashboard/[eventId]/manpower/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to event home | Returns to event home | text link | Grey |
| Cancel gig / Cancelling… (per gig) | Cancels the posted gig | button | Red |

## apps/web/app/dashboard/[eventId]/messages/[threadId]/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ‹ Saved (ConversationColumn back link, imported component) | Goes back to Suppliers | text link | Grey |
| Back to Messages (chevron) | Returns to inbox | icon-only | Grey |
| Conversation options ⋮ (ChatThreadMenu, imported: block, report, workspace links) | Opens thread options menu | icon-only | Grey |
| Send (ChatSendForm, imported) | Sends the chat message | icon-only | Blue |
| Deal (RevealToolButton, imported) | Opens the deal/quote tool panel | icon-only | Blue |
| Call {vendor} (RevealToolButton, imported) | Opens the call panel | icon-only | Blue |
| Withdraw inquiry (pending state) | Withdraws the pending inquiry | text link | Red |
| See similar suppliers | Opens similar suppliers list | button | Terracotta |
| Withdraw inquiry (closed-thread state) | Withdraws the inquiry | text link | Red |

## apps/web/app/dashboard/[eventId]/messages/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {supplier name} chat row (per thread) | Opens that conversation | link — stays a link | link |
| Archive / Unarchive conversation (ThreadArchiveToggle, imported) | Archives or restores a chat | icon-only | Grey |
| Find a supplier | Opens supplier categories | button | Terracotta |
| Archived · N | Expands the archived chats list | clickable element | Grey |
| Start a conversation supplier picker (StartThreadPicker, imported dropdown) | Picks a supplier to message | clickable element | Blue |
| Suppliers (inline sentence link) | Opens Suppliers page | link — stays a link | link |
| Look for {email} on Setnayan / Looking… | Finds that supplier and opens chat | button | Blue |

## apps/web/app/dashboard/[eventId]/monogram/animate-rows.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Handwriting (effect chip) | Selects and previews that reveal effect | button | Grey |
| Bloom (effect chip) | Selects and previews that reveal effect | button | Grey |
| Petal Fall (effect chip) | Selects and previews that reveal effect | button | Grey |
| Molten Gold (effect chip) | Selects and previews that reveal effect | button | Grey |
| Medallion Turn (effect chip) | Selects and previews that reveal effect | button | Grey |
| Fine-tune ▸ | Expands or folds the sliders | clickable element | Grey |
| ▶ Play the reveal | Replays the reveal on the mark | button | Grey |
| Use Static Image FREE | Saves the mark without animation | button | Terracotta |
| Apply Animation (when animation owned) | Saves the mark with animation | button | Terracotta |
| Unlock Animation & Apply (InlineCheckoutDrawer trigger, imported; when not owned) | Saves, then opens payment drawer | button | Terracotta |

## apps/web/app/dashboard/[eventId]/monogram/draft-restore.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Make it my monogram / Applying… | Applies the pre-signup studio draft | button | Terracotta |
| Not now | Dismisses and discards the draft | text link | Grey |

## apps/web/app/dashboard/[eventId]/monogram/ink-compare.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Keep our file's colours | Chooses to keep original colours | button | Grey |
| Follow our mood board | Chooses mood-board palette colours | button | Grey |

## apps/web/app/dashboard/[eventId]/monogram/mark-everywhere.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Close (✕) | Closes the everywhere popup | icon-only | Grey |
| Scene card "n / N · tap to continue" | Advances to the next scene | clickable element | Grey |
| (dark backdrop tap) | Advances to the next scene | clickable element | Grey |
| Done | Closes the popup when finished | button | Green |

## apps/web/app/dashboard/[eventId]/monogram/mark-toggle.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Create your own (segment tab) | Switches page to design mode | link — stays a link | link |
| Upload your monogram (segment tab) | Switches page to upload mode | link — stays a link | link |

## apps/web/app/dashboard/[eventId]/monogram/studio.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Remove | Clears the saved studio mark | button | Red |
| Close the reveal preview (✕) | Closes the animated preview overlay | icon-only | Grey |
| (Vector studio editor controls — injected HTML from lib/monogram-studio/markup, NOT in my file list, not inventoried) | n/a | n/a | n/a |

## apps/web/app/dashboard/[eventId]/monogram/upload-mark.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Upload a different logo (icon, saved-logo card) | Opens file picker for a new logo | icon-only | Terracotta |
| Remove uploaded logo (trash icon, saved-logo card) | Deletes uploaded logo after confirm | icon-only | Red |
| Upload a different logo (icon, freshly chosen file card) | Opens file picker for another file | icon-only | Terracotta |
| Tap to upload · SVG or transparent PNG (dropzone) | Opens file picker to upload logo | clickable element | Terracotta |
| Keep our file's colours / Follow our mood board (InkCompare, counted in ink-compare.tsx) | n/a | n/a | n/a |

## apps/web/app/dashboard/[eventId]/orders/[orderId]/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to orders | Returns to orders list | text link | Grey |
| Send a clearer screenshot (inline underlined link) | Opens payment page to re-upload | text link | Amber |
| Cancel order / Cancelling… | Cancels this order | button | Red |
| Open receipt | Opens receipt in new tab | button | Grey |
| Send your payment | Opens the payment page | button | Green |
| Screenshot (per logged payment, with ↗) | Opens payment screenshot in new tab | text link | Grey |

## apps/web/app/dashboard/[eventId]/orders/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| New order | Starts a new custom order | button | Terracotta |
| {order description} row (per order, whole row) | Opens that order | link — stays a link | link |

## apps/web/app/dashboard/[eventId]/pabuya/_components/pabuya-message-editor.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {template name} chips (one per template) | Fills the box with that template | button | Terracotta |
| Save / Saving… / Saved | Saves your own words | button | Green |
| Clear it | Empties the message box | text link | Grey |

## apps/web/app/dashboard/[eventId]/pabuya/_components/pabuya-manager.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Edit (per e-gift method) | Opens that method in the edit form | button | Grey |
| Hide / Show (per method) | Hides or shows method to guests | button | Grey |
| Move {label} up (arrow, per method) | Moves method up the list | icon-only | Grey |
| Move {label} down (arrow, per method) | Moves method down the list | icon-only | Grey |
| Remove (per method) | Deletes method after confirm | button | Red |
| Close form (X) | Closes add/edit form | icon-only | Grey |
| {payment kind} chips: GCash, Maya, bank… (per kind) | Picks the payment method type | button | Grey |
| QR code image upload (FileUpload, imported) | Uploads a QR image | clickable element | Terracotta |
| Add method / Save changes / Saving… | Saves the e-gift method | button | Green |
| Cancel | Closes form without saving | button | Grey |
| Add an e-gift method | Opens the add-method form | button | Terracotta |
| Open ↗ (guest preview) | Opens the guest gift page | text link | Grey |

## apps/web/app/dashboard/[eventId]/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Tea ceremony serving order (tile, Chinese events) | Opens tea-ceremony helper page | link — stays a link | link |
| Plan next year / Creating… | Clones event into next year's plan | button | Terracotta |
| Open the live desk (day-of tile) | Opens the live desk page | link — stays a link | link |
| Planning tools — still here if you need them ×2 (day-of and after-event views) | Expands the planning tools section | clickable element | Grey |
| (HomeFirstScreen, SetDateNudge, PapicReadyNudge, SetnayanAiComebackOffer, EventDayPrepCta, AccessRequestsDoorway, DateChangeDoorway, DayOfModeGrid, FinishedEventSummary, WhatsNextSheet, EventDashboard — imported, NOT in my file list, not inventoried) | n/a | n/a | n/a |

## apps/web/app/dashboard/[eventId]/paperwork/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to event home (BackLink, also on non-wedding view) | Returns to event home | text link | Grey |
| See all documents → | Opens the documents page | link — stays a link | link |
| Plan your tea-ceremony serving order (per guide, up to 2 guides) | Opens tea-ceremony helper | button | Terracotta |
| Find a date / feng-shui specialist (per guide, up to 2 guides) | Opens specialist search | button | Blue |
| Set wedding date (no-date prompt) | Opens date selection | text link | Terracotta |
| Build my checklist / Setting up… | Creates the paperwork checklist rows | button | Terracotta |
| Choose ceremony type | Opens date selection to pick ceremony | text link | Terracotta |
| Mark as requested (per document, when not started) | Marks the document as requested | button | Green |
| Mark as received (per document, when requested or in processing) | Marks the document as received | button | Green |
| Reset status (per document, when received) | Resets status to not started | button | Amber |
| Open PSA portal ↗ (birth cert and CENOMAR docs) | Opens PSA site in new tab | button | Grey |
| Open CFO site ↗ (CFO counseling doc) | Opens CFO site in new tab | button | Grey |
| Save (tracking reference, per requested document) | Saves the tracking reference | button | Green |
| Upload scan (FileUpload, imported, per document) | Picks a scan file to upload | clickable element | Terracotta |
| Save scan / Saving… (per document) | Saves the uploaded scan | button | Green |
| Save note / Saving… (per document) | Saves the private note | button | Green |


# chunk4 inventory

Notes: "Today" column values are button / text link / icon-only / clickable element. Pure page links that should stay links carry colour "link — stays a link". Shared components defined outside my file list (PickMenu, Sheet's own close X, SubmitButton, CopyButton) are counted as one control per use; Sheet's built-in close button is NOT counted. day-ui.tsx rows are the shared component DEFINITIONS; the files that use them list their instances too (so those are counted twice by design). Native inputs/selects/text fields/textareas are not counted.

## apps/web/app/dashboard/[eventId]/people/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {group label} + blurb (one tile per people group, e.g. Guests) | Opens the page that owns that group | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/plan3d/_components/plan3d-stage.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Open as a guest (when live) | Opens the public 3D venue walk | button | Grey |
| Walk it yourself (when not live) | Opens the 3D room in play mode | button | Grey |
| Edit the room | Opens the room editor in the lab | button | Grey |

## apps/web/app/dashboard/[eventId]/plan3d/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Hide until the day | Unpublishes the 3D walk until event day | button | Red |
| Show early | Publishes the 3D walk to guests now | button | Terracotta |
| {next-step CTA}  e.g. next step label with arrow | Goes to the one suggested next step | text link | Terracotta |
| {source label} rows under Built from ×N | Opens the page that supplies that fact | text link | link — stays a link |
| Guest photos in the 3D walk | Opens seating chart settings | text link | link — stays a link |
| Who can open the address | Opens event details visibility | text link | link — stays a link |
| Design panel | Opens the seating lab design panel | text link | link — stays a link |
| print pack | Opens the seating print pack | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/progress/_components/free-venue-shortlist-offer.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Build my venue shortlist (Sai is looking… while working) | Runs Sai to build a free venue shortlist | button | Terracotta |
| Browse on your own → | Opens the venue bench | text link | Grey |
| See your venue shortlist → | Opens the venue shortlist | text link | Grey |
| Open your venue shortlist → | Opens the venue shortlist | text link | Grey |
| Browse reception venues → | Opens reception venue browsing | text link | Grey |

## apps/web/app/dashboard/[eventId]/refer/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Copy code (then Copied) | Copies the referral code | button | Grey |
| Copy link (then Copied) | Copies the share link | button | Grey |

## apps/web/app/dashboard/[eventId]/schedule/_components/announce-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Announce (megaphone) | Opens the announce-to-guests sheet | button | Blue |
| Announce (Announcing… while sending) | Sends one message to every guest | button | Blue |

## apps/web/app/dashboard/[eventId]/schedule/_components/block-time-editor.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Edit time | Opens inline time editor | button | Grey |
| Save (Saving…) | Saves the new block time | button | Green |
| Cancel | Discards the time edit | button | Red |

## apps/web/app/dashboard/[eventId]/schedule/_components/day-ui.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ⓘ (More about this) — shared Tip | Shows a tooltip explanation | icon-only | Grey |
| Switch row (label + hint, e.g. Visible to guests) — shared | Toggles a setting on or off | clickable element | Grey |
| − (5 minutes earlier / shorter) — shared Stepper | Moves a time down five minutes | icon-only | Grey |
| + (5 minutes later / longer) — shared Stepper | Moves a time up five minutes | icon-only | Grey |
| Round tool button with tooltip label — shared ToolButton | Opens a day tool (label per use) | icon-only | Grey |

## apps/web/app/dashboard/[eventId]/schedule/_components/day-sheets.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Phase dropdown (Add a moment) | Picks the moment's phase | button | Grey |
| Starts dropdown | Picks the start time | button | Grey |
| Starts − / + (5 minutes earlier / later) ×2 | Nudges the start by five minutes | icon-only | Grey |
| Runs for dropdown | Picks the duration | button | Grey |
| Runs for − / + (5 minutes shorter / longer) ×2 | Nudges the duration by five minutes | icon-only | Grey |
| Visible to guests (switch) | Shows the moment on the Event Hub | clickable element | Grey |
| Start staged (switch, coordinators only) | Hides the moment from the couple | clickable element | Grey |
| Cancel (Add moment sheet) | Closes the sheet without adding | button | Red |
| Add moment (Adding…) | Adds the moment to the schedule | button | Terracotta |
| From dropdown (Running late) | Picks the first moment to move | button | Grey |
| Through dropdown | Picks the last moment to move | button | Grey |
| By dropdown | Picks how many minutes late | button | Grey |
| By − / + (5 minutes less / more) ×2 | Nudges the shift by five minutes | icon-only | Grey |
| Cancel (Running late sheet) | Closes the sheet without shifting | button | Red |
| Shift the day (Shifting…) | Moves the chosen moments by that amount | button | Terracotta |
| Decline (per request; Declining…) ×N | Tells the supplier no | button | Red |
| Approve (per request; Approving…) ×N | Applies the supplier's request to the schedule | button | Green |

## apps/web/app/dashboard/[eventId]/schedule/_components/day-rail.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| View as dropdown (Master · everything / Guests / supplier name) | Switches the schedule view lens | button | Grey |
| Supplier requests (N) | Opens the supplier requests sheet | icon-only | Amber |
| Host / MC — segments, questions, a note | Opens the Host / MC panel | icon-only | Grey |
| Shift the day (running late) | Opens the running-late sheet | icon-only | Terracotta |
| ⓘ (tooltip beside the tools) | Shows a tooltip explanation | icon-only | Grey |
| ⓘ (tooltip beside View as) | Shows a tooltip explanation | icon-only | Grey |
| Add moment | Opens the add-a-moment sheet | button | Terracotta |
| back to Master | Returns to the master view | text link | Grey |
| ＋ {time} (gap slots on the rail, e.g. ＋ 2:00 PM) ×N | Opens add-a-moment at that time | clickable element | Terracotta |
| Empty rail area (tap a time) | Opens add-a-moment at tapped time | clickable element | Terracotta |
| {supplier} asks · start {time} / proposes · {label} (dashed block) | Opens the supplier requests sheet | clickable element | Amber |
| Moment block on the rail (label, time) ×N | Selects the moment to inspect or drag | clickable element | Grey |
| Drag handle on a selected moment, top and bottom edges ×2 | Resizes the moment by dragging | clickable element | Grey |
| Eye / eye-off (Shown to guests — tap to hide) ×N | Toggles whether guests see the moment | icon-only | Grey |
| Review (under supplier request count) | Opens the supplier requests sheet | text link | Amber |
| Add the first moment | Opens add-a-moment on an empty schedule | button | Terracotta |
| {template label} · N moments (template rows) ×N | Loads that starter template | clickable element | Terracotta |
| Emcee script tool (from emcee-script-button, icon variant) | See emcee-script-button.tsx | icon-only | Terracotta |

## apps/web/app/dashboard/[eventId]/schedule/_components/emcee-picks.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {activity label} cards (pick / unpick) ×N | Toggles an activity into your picks | clickable element | Grey |
| Add N to my timeline | Places picked activities onto the schedule | button | Terracotta |

## apps/web/app/dashboard/[eventId]/schedule/_components/emcee-script-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Emcee script (scroll icon, icon variant) | Generates the emcee script | icon-only | Terracotta |
| Generate emcee script (Generating…, full variant) | Generates the emcee script | button | Terracotta |
| Backdrop outside the script dialog | Closes the script dialog | clickable element | Grey |
| Close (X) | Closes the script dialog | icon-only | Grey |
| Include private blocks (checkbox) | Regenerates script with private blocks | clickable element | Grey |
| Copy (Copied) | Copies the script text | button | Grey |
| Download | Downloads the script file | button | Grey |

## apps/web/app/dashboard/[eventId]/schedule/_components/host-questions.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save answers | Saves the host questionnaire answers | button | Green |

## apps/web/app/dashboard/[eventId]/schedule/_components/journey-view.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Journey entry rows with a link (title, subtitle, date) ×N | Opens the page behind that step | text link | link — stays a link |
| Find suppliers (empty state) | Opens the suppliers page | button | Terracotta |
| Open preparation (empty state) | Opens the preparation view | button | Grey |

## apps/web/app/dashboard/[eventId]/schedule/_components/moment-inspector.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Close (X) | Closes the moment inspector | icon-only | Grey |
| Phase dropdown | Changes the moment's phase | button | Grey |
| Who this moment is for dropdown | Changes who the moment is for | button | Grey |
| Starts − / + (5 minutes earlier / later) ×2 | Nudges the start time | icon-only | Grey |
| Ends − / + (5 minutes earlier / later) ×2 | Nudges the end time | icon-only | Grey |
| ＋ Add an end | Gives the moment a 30 minute end | button | Terracotta |
| review (supplier asked for a change) | Opens the supplier requests sheet | text link | Amber |
| Visible to guests (switch) | Shows or hides moment on Event Hub | clickable element | Grey |
| Untag {supplier name} (X on chip) ×N | Removes a supplier tag | icon-only | Red |
| Tag a supplier dropdown | Tags a supplier to the moment | button | Grey |
| Remove the part {part label} (X) ×N | Deletes a moment part | icon-only | Red |
| Add (part) | Adds a part to the moment | button | Terracotta |
| Release to couple | Makes a staged moment visible to the couple | button | Terracotta |
| Shift everything after | Opens running-late sheet from this moment | button | Terracotta |
| Keep | Cancels the delete confirmation | button | Grey |
| Delete it / Delete it and its N parts | Confirms deleting the moment | button | Red |
| Delete | Asks to delete the moment | button | Red |
| ⓘ (Responsible tooltip) | Shows a tooltip explanation | icon-only | Grey |

## apps/web/app/dashboard/[eventId]/schedule/_components/prep-item-controls.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Add to schedule (plus) | Opens add-an-item dialog | button | Terracotta |
| Backdrop outside the dialog | Closes the add dialog | clickable element | Grey |
| Close (X) | Closes the add dialog | icon-only | Grey |
| Task / Meeting / Payment (type picker) ×3 | Chooses what kind of item to add | button | Grey |
| Cancel | Closes the add dialog without saving | button | Red |
| Add item (Adding…) | Adds the item to the agenda | button | Terracotta |
| Remove {item label} (trash) ×N | Deletes an agenda item | icon-only | Red |

## apps/web/app/dashboard/[eventId]/schedule/_components/prep-kind-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Task / Meeting / Payment (segmented radios) ×3 | Chooses the kind of agenda item | button | Grey |

## apps/web/app/dashboard/[eventId]/schedule/_components/preparation-agenda.tsx
Also renders AddPreparationItem and DeletePreparationItemButton (both counted in prep-item-controls.tsx).

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Agenda rows with a link (title, date) ×N | Opens the page behind that item | text link | link — stays a link |
| Open budget | Opens the budget page | button | Grey |
| Open paperwork | Opens the paperwork page | button | Grey |

## apps/web/app/dashboard/[eventId]/schedule/_components/ros-p2.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Master (view chip) | Shows the master schedule | button | Grey |
| Guests (view chip) | Shows the guest view | button | Grey |
| {supplier name} (view chip) ×N | Shows that supplier's view | button | Grey |
| Shift the timeline (bulk retime) | Expands the bulk retime form | clickable element | Grey |
| Shift blocks (Shifting…) | Moves the chosen blocks by that amount | button | Terracotta |
| Use this template (Loading…) ×N | Loads that starter schedule template | button | Terracotta |
| {Responsible names} or Assign responsible party | Expands the responsible party form | clickable element | Grey |
| Save (Saving…) | Saves the responsible party | button | Green |

## apps/web/app/dashboard/[eventId]/schedule/_components/schedule-mode-toggle.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Journey (with count badge) | Switches to the Journey view | text link | link — stays a link |
| Preparation (with count badge) | Switches to the Preparation view | text link | link — stays a link |
| Event Day | Switches to the Event Day view | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/schedule/_components/tell-the-host.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Send (Sending…; one per host) ×N | Sends a stage note to the host | button | Blue |

## apps/web/app/dashboard/[eventId]/schedule/_components/vendor-meetings-section.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Meeting rows with a thread (title, time) ×N | Opens that meeting's message thread | text link | link — stays a link |


## apps/web/app/dashboard/[eventId]/schedule/page.tsx

(Imported components outside this chunk are counted as one control each: ScheduleModeToggle, AnnounceButton, EmceeScriptButton, BlockTimeEditor.)

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Preparation / Event day / Journey (mode toggle, custom ScheduleModeToggle) | Switches the schedule view mode | clickable element | Grey |
| Announce (custom AnnounceButton) | Opens sheet to broadcast to guests | button | Blue |
| Emcee script (custom EmceeScriptButton) | Compiles timeline into host script (copy/download) | button | Grey |
| Emcee script (icon variant, event-day view) | Same, as icon in the day header | icon-only | Grey |
| Release to couple | Moves a staged block into couple's schedule | button | Terracotta |
| Accept | Accepts a supplier's schedule suggestion | button | Green |
| Decline | Declines a supplier's schedule suggestion | button | Red |
| Add a block | Opens the add-block form (details summary) | clickable element | Terracotta |
| Add block | Submits the new schedule block | button | Terracotta |
| Hide from guests / Show to guests | Toggles block visibility to guests | button | Grey |
| (trash icon) Delete block | Deletes the schedule block | icon-only | Red |
| Edit time (custom BlockTimeEditor, shows the time range) | Switches block time to edit form | clickable element | ? |

## apps/web/app/dashboard/[eventId]/seating/_components/drop-confirm-bubble.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Drop here (check icon) | Confirms and saves the dropped element | button | Green |
| Cancel (X icon) | Snaps element back, cancels the drop | button | Red |
| OK (X icon) | Dismisses the refusal message | button | Grey |

## apps/web/app/dashboard/[eventId]/seating/_components/seat-plan-phone.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| (three dots) More seat-plan tools | Opens menu: add table, share and print | icon-only | Grey |
| Rules ▾ | Opens who-sits-together rules menu | button | Grey |
| (invisible full-screen backdrop) ×2 | Closes the open ⋯ / Rules popover | clickable element | Grey |
| Undo | Reverts the last Auto arrange | text link | Amber |
| (X) Dismiss | Closes the Auto arrange message | icon-only | Grey |
| Auto arrange / Arranging… | Auto-seats all guests | button | Terracotta |
| Unseated: 12 › | Opens the unseated guest list | button | Grey |
| View ▾ (2D / 3D / List) — custom PickMenu | Picks the seat plan view | button | Grey |
| Same layout in 3D ↗ | Opens the 3D view of the plan | button | Grey |
| (backdrop) Close — move-guest sheet | Closes the Move sheet | clickable element | Grey |
| Table ▾ — custom PickMenu in Move sheet | Picks the destination table | button | Grey |
| Move | Moves the guest to the chosen table | button | Green |

## apps/web/app/dashboard/[eventId]/seating/_components/seating-context-dock.tsx

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| (X) Close — dock header | Dismisses the context dock | icon-only | Grey |
| (X) Close shape picker | Closes the table shape picker | icon-only | Grey |
| Shape tiles ×N, e.g. 'Round 10 seats' | Picks a table shape (applies or previews) | button | Terracotta |
| Cancel | Drops the pending shape change | button | Red |
| Apply | Applies the new table shape | button | Terracotta |


# chunk6 — button inventory (seating + sponsors)

Notes: text inputs, checkboxes and native selects/dropdowns are not counted (not pressable buttons). Shared components imported from outside this list (DropConfirmBubble, BoothVendorCard, the `viewSegment` prop, SubmitButton internals) are not itemised. Inside the 3D canvas, scene objects with pointer/click handlers are listed as "clickable element".

## apps/web/app/dashboard/[eventId]/seating/_components/seating-frame.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| BarMenu trigger: icon + {label} + chevron (e.g. 'Share', 'Arrange') | Opens a dropdown menu of actions | button | Grey |
| (invisible full-screen scrim behind open menu) | Closes the open menu | clickable element | Grey |
| MenuRow {label} + hint (button variant, label set by caller) | Runs the row's action, closes menu | button | ? (meaning set by each caller, not in this file) |
| MenuRow {label} (link variant with href) | Navigates to href | link — stays a link | link — stays a link |
| Save chip: '{N} unsaved' / 'Retry save' / 'Saved · {time}' | Saves layout changes (⌘S) | button | Green |
| View segment 'List' | Switches to list view | button | Grey |
| View segment '2D' | Switches to 2D editor | button | Grey |
| View segment '3D' | Switches to 3D lab | button | Grey |

## apps/web/app/dashboard/[eventId]/seating/error.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Reload the plan | Re-renders the failed seat plan | button | Amber |
| Refresh from saved | Refreshes route data from saved plan | button | Grey |

## apps/web/app/dashboard/[eventId]/seating/lab/_components/reception-design-editor.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Reception design ▾ | Expands or collapses the design panel | text link | Grey |
| (venue picture hotspot) 'Design the {part}' ×N | Selects that zone to design | clickable element | Grey |
| Zone chip '{zone name} · {current treatment}' ×N | Selects the zone to edit | button | Grey |
| Add it | Adds the booked supplier's option to design | button | Terracotta |
| No thanks | Dismisses the supplier suggestion | button | Grey |
| Option chip '{option label}' ×N | Picks or unpicks that treatment | button | Grey |

## apps/web/app/dashboard/[eventId]/seating/lab/_components/seating-lab-3d.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Full screen / Exit full screen (icon) | Toggles fullscreen for the 3D room | icon-only | Grey |
| Hide (in 'Still to book' card) | Hides supplier suggestions | text link | Grey |
| × (Dismiss {category} suggestion) ×N | Dismisses one suggested booth | icon-only | Grey |
| Show supplier suggestions | Turns ghost-booth suggestions back on | button | Grey |
| 🚶 Walk around / Exit walk | Starts or stops first-person walk | button | Grey |
| 👋 Say hi · {N} here | Waves at partner in shared room | button | Blue |
| Floor catcher (3D floor plane) | Drops a table, deselects, double-tap fullscreen | clickable element | Grey |
| Booth tap box (3D booth) | Opens the booth's vendor card | clickable element | Grey |
| Removed chair (3D seat) | Restores a removed chair | clickable element | Grey |
| Table (3D table) | Selects or drags the table | clickable element | Grey |
| Dancer figure (3D) | Sends the dancer back to their seat | clickable element | Grey |
| Walk stick (on-screen joystick) | Walks the camera around | clickable element | Grey |
| Look pad (on-screen) | Turns the camera view | clickable element | Grey |
| Zone drag grip (stage/dance floor/entrance) ×3 | Starts dragging that zone | clickable element | Grey |
| Seating rules ▸ | Expands or collapses rules panel | text link | Grey |
| Add (keep-apart rule) | Adds a keep-apart pair rule | button | Terracotta |
| ✕ (Remove keep-apart rule) ×N | Removes one keep-apart rule | icon-only | Red |
| ↑ (Move up) ×N | Moves a seating tier earlier | icon-only | Grey |
| ↓ (Move down) ×N | Moves a seating tier later | icon-only | Grey |
| Floor & stage ▸ | Expands or collapses floor panel | text link | Grey |
| Move stage | Arms tap-to-place for the stage | button | Grey |
| Move dance floor | Arms tap-to-place for dance floor | button | Grey |
| Move entrance | Arms tap-to-place for entrance | button | Grey |
| − / + width and depth (stage) ×4 | Shrinks or grows the stage | icon-only | Grey |
| − / + width and depth (dance floor) ×4 | Shrinks or grows the dance floor | icon-only | Grey |
| On / Off (Dance floor) | Toggles the dance floor | button | Grey |
| On / Off (Entrance) | Toggles the entrance | button | Grey |
| Build | Switches to build mode | button | Grey |
| Play | Switches to play mode | button | Grey |
| Tablecloths | Toggles tablecloth display | button | Grey |
| Centerpieces | Toggles centerpiece display | button | Grey |
| ✕ (Dismiss notice) | Dismisses the notice banner | icon-only | Grey |
| Take over editing / Start editing | Takes the edit lock | button | Terracotta |
| Start my seating | Builds a first draft seating plan | button | Terracotta |
| + Add a table | Adds a table to the room | button | Terracotta |
| Auto-seat | Auto-seats unseated guests | button | Terracotta |
| Fill around locked seats | Auto-fills around locked seats | button | Terracotta |
| Auto-arrange tables | Asks to re-tidy all tables | button | Terracotta |
| Re-tidy all · confirm | Confirms re-tidying every table | button | Green |
| Cancel (re-tidy confirm) | Backs out of re-tidy | button | Red |
| Group chip '{group} · {N}' ×N | Picks a group to seat at a table | button | Grey |
| Cancel (seat a group) | Cancels group seating | text link | Red |
| ⟲ (Rotate left) | Rotates the table left | icon-only | Grey |
| ⟳ (Rotate right) | Rotates the table right | icon-only | Grey |
| Delete | Deletes the selected table | button | Red |
| Break apart | Splits a linked table group | button | Red |
| Show early / Hide until the day | Publishes or unpublishes the 3D walk | button | Terracotta |
| Print pack | Opens the print pack in new tab | button | Grey |
| 3D Plan control centre → | Goes to the Plan 3D page | link — stays a link | link — stays a link |
| Seat anywhere | Seats the picked guest at any table | button | Terracotta |
| Cancel (placing guest) | Cancels placing the guest | button | Red |
| Swap two tables | Arms the table-swap mode | button | Grey |
| Walk everyone in / Clear the room | Starts or clears the walking crowd | button | Terracotta |
| Sit everyone down · {N} dancing | Returns dancing guests to seats | button | Grey |
| Guest row '{guest name}' ×N | Picks up or swaps that guest | button | Grey |
| P{n} / · (Seat-first priority) ×N | Cycles the guest's seating priority | button | Grey |
| unseat ×N | Removes the guest from their seat | text link | Red |
| Palette swatch '{palette name}' ×N | Switches the demo colour palette | button | Grey |

## apps/web/app/dashboard/[eventId]/seating/walkthrough/_components/walkthrough-manager.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Add zone | Creates a new walkthrough zone | button | Terracotta |
| Save name | Saves the renamed zone | button | Green |
| Delete {zone name} (trash icon) | Deletes the zone after confirm | icon-only | Red |
| {N} tables in this zone ▾ | Expands or collapses table checklist | text link | Grey |
| Save tables | Saves which tables are in the zone | button | Green |
| Reset | Undoes unsaved table ticks | text link | Amber |
| Showing to guests / Hidden — tap to show guests | Toggles whether guests see the clip | button | ? (label shows current state, not the action) |
| Remove video | Deletes the zone's walk video | text link | Red |
| Record or upload the walk to this zone (FileUpload component) | Records or uploads the walk video | clickable element | Terracotta |

## apps/web/app/dashboard/[eventId]/seating/walkthrough/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ← Back to seating | Navigates back to seating page | link — stays a link | link — stays a link |

## apps/web/app/dashboard/[eventId]/sponsors/_components/add-sponsor-modal.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| + Add ninong (label per tier, e.g. 'Add ninang', 'Add cord sponsor') | Opens the add-sponsor dialog | button | Terracotta |
| ✕ (Close) | Closes the dialog | icon-only | Grey |
| (dialog backdrop) | Closes the dialog | clickable element | Grey |
| Cancel | Closes the dialog without saving | text link | Red |
| Save sponsor | Saves the new sponsor | button | Green |

## apps/web/app/dashboard/[eventId]/sponsors/_components/edit-sponsor-modal.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Pencil (Edit {sponsor name}) | Opens the edit-details dialog | icon-only | Grey |
| ✕ (Close) | Closes the dialog | icon-only | Grey |
| (dialog backdrop) | Closes the dialog | clickable element | Grey |
| Cancel | Closes the dialog without saving | text link | Red |
| Save changes | Saves the sponsor's edited details | button | Green |

## apps/web/app/dashboard/[eventId]/sponsors/_components/invitation-template-modal.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Invite {sponsor name} (send icon; label per caller) | Opens the invitation message dialog | button | Terracotta |
| ✕ (Close) | Closes the dialog | icon-only | Grey |
| (dialog backdrop) | Closes the dialog | clickable element | Grey |
| Copy to clipboard / Copied | Copies the invitation message | button | Grey |
| Cancel | Closes the dialog without marking sent | text link | Red |
| Mark invitation sent | Records the invitation as sent | button | Green |

## apps/web/app/dashboard/[eventId]/sponsors/_components/pair-target-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Reset to {4} pairs (no-JS fallback only) | Reloads page with default pair count | link — stays a link | link — stays a link |


# chunk7 button inventory

Conventions: "button" = pill/rounded labelled button; "clickable element" = tile, card, toggle row, drag handle or other non-pill pressable; "text link" = inline/underlined link or link-looking button; "icon-only" = glyph button with no visible word. Custom components defined outside this chunk are counted as one control and marked "(not read)".

## apps/web/app/dashboard/[eventId]/sponsors/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to {event name} | Returns to the event dashboard | text link | link — stays a link |
| Pair-target picker (PairTargetPicker, not read) | Sets how many sponsor pairs to plan for | clickable element | ? (component not read, cannot see its label or effect) |
| Add {tier} sponsor (one per empty slot, ×N) | Opens add-sponsor form (AddSponsorModal, not read) | button | Terracotta |
| Add ninong | Opens add-sponsor form for groom's side | button | Terracotta |
| Add ninang | Opens add-sponsor form for bride's side | button | Terracotta |
| your guest list | Goes to the guest list | text link | link — stays a link |
| Edit (pencil, EditSponsorModal trigger, not read) | Opens edit form for the sponsor | icon-only | Grey |
| Remove {sponsor name} (trash) | Removes the sponsor | icon-only | Red |
| {sponsor name} (InvitationTemplateModal trigger, not read) | Opens the invitation message to send | button | Blue |
| Marked yes | Records that the sponsor accepted | button | Green |
| Declined | Records that the sponsor declined | button | Red |
| View on guest list | Opens the sponsor's guest record | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/story/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to your page | Returns to the Event Hub page | text link (pill outline) | link — stays a link |
| Back to Event Hub | Returns to the Event Hub page | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/story/_components/story-rail.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| The desk / The story / Theme / Cover / What's next / Publish (phone chip strip, ×6) | Switches to that Story Maker step | button | Grey |
| The desk / The story / Theme / Cover / What's next / Publish (wide side rail, ×6) | Switches to that Story Maker step | button | Grey |

## apps/web/app/dashboard/[eventId]/story/_components/the-desk.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Everything / Guests / Suppliers / Still waiting on you (each with count, ×4) | Filters the desk list | button | Grey |
| Accept | Accepts the item into the story | button | Green |
| Edit | Opens the item's words for editing | button | Grey |
| Reject | Leaves the item out of the story | button | Red |
| undo | Puts a decided item back to pending | text link | Amber |
| Save the words | Saves the edited words | button | Green |
| cancel | Closes the editor without saving | text link | Grey |

## apps/web/app/dashboard/[eventId]/story/_components/theme-step.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Follow my mood board | Story colours follow the mood board | clickable element | Grey |
| Make my own | Switches to your own story colours | clickable element | Grey |
| Neutral | Uses plain paper-and-ink colours | clickable element | Grey |
| Open your mood board | Goes to the mood board | text link | link — stays a link |
| Colour swatch (SwatchPopover, ×5, not read) | Opens colour picker for that colour | clickable element | Grey |
| Make my own (inline in "These are your mood board's colours") | Switches to own colours to edit them | text link | Grey |

## apps/web/app/dashboard/[eventId]/story/_components/cover-step.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {picture label} cover tile (one per candidate, ×N) | Chooses that picture as the cover | clickable element | Terracotta |
| Upload another (FileUpload, not read) | Uploads a new cover picture | clickable element | Terracotta |

## apps/web/app/dashboard/[eventId]/story/_components/whats-next-step.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Nothing yet (card) | Announces no next event | clickable element | Grey |
| Anniversary / Christening / Reunion (cards, ×3) | Announces that next event on back cover | clickable element | Terracotta |
| Or another kind: {kind} (pills, ×N) | Announces that other kind of event | button | Terracotta |
| Start it now | Opens a new event pre-filled from this one | button | Terracotta |

## apps/web/app/dashboard/[eventId]/story/_components/editorial-editor.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Apply with Event Hub Pro (×3, shown when not Pro) | Goes to the Event Hub apply page | text link | link — stays a link |
| Living hero / Photos / Thank-you note (×3 cards) | Saves draft, opens that piece's editor | clickable element | Grey |
| More settings | Expands or collapses extra settings | clickable element | Grey |
| The smaller lines | Expands or collapses the small text fields | clickable element | Grey |
| Cover photo (FileUpload) | Uploads the cover photo | clickable element | Terracotta |
| Gallery photos (FileUpload) | Uploads gallery photos | clickable element | Terracotta |
| Move moment earlier | Moves the moment up the order | icon-only | Grey |
| Move moment later | Moves the moment down the order | icon-only | Grey |
| Hide this moment / Show this moment | Hides or shows the moment | icon-only | Grey |
| Move {section} up | Moves the section up | icon-only | Grey |
| Move {section} down | Moves the section down | icon-only | Grey |
| Remove | Removes your own column | button | Red |
| Write a column | Adds a new own column | button | Terracotta |
| Move wish up | Moves the wish up | icon-only | Grey |
| Move wish down | Moves the wish down | icon-only | Grey |
| Remove wish | Deletes the wish | icon-only | Red |
| Add a wish | Adds a new guest wish | button | Terracotta |
| By the Numbers / Photo gallery / Guest wishes / Supplier team / From your suppliers / Powered by Setnayan / Live Photo Wall / Watch the film / What they whispered / Letters to the editor / From the couple / Suppliers we loved / Where everyone sat / Entourage / Before & after (×15 toggle rows) | Turns that story section on or off | clickable element | Grey |
| Draft (publish rung) | Saves the story as a private draft | clickable element | Green |
| Guests only (publish rung) | Saves and shows it to your guests | clickable element | Terracotta |
| Published (publish rung) | Saves and publishes the story live | clickable element | Terracotta |
| Taken back (publish rung) | Takes the published story back down | clickable element | Red |
| Consent tick ("I agree…" checkbox) | Gives consent required to publish | clickable element | Green |
| Preview your editorial ↗ | Opens the story preview in new tab | text link | link — stays a link |
| Copy link | Copies the story link | button | Grey |
| Share buttons (ShareButtons, not read) | Shares the link to social apps | button | Grey |
| Feature our story in Stories | Opts the story into public Stories gallery | clickable element | Grey |
| Who can view | Goes to the privacy settings | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/story/_components/make-it-yours.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| + New | Adds a new moment | button | Terracotta |
| Automatic | Sorts photos by the run of show | button | Grey |
| I choose | Lets you place photos yourself | button | Grey |
| Add your schedule | Goes to the schedule page | text link | link — stays a link |
| {moment name} + photo count (one per moment, ×N) | Opens that moment on the page | clickable element | Grey |
| ⋮⋮ drag grip (one per moment, ×N) | Drags the moment to reorder | clickable element | Grey |
| Remove {moment name} (×) | Removes the moment | icon-only | Red |
| Rename this moment (pencil) | Edits the moment's name | icon-only | Grey |
| Put all back | Returns all photos to the tray | button | Amber |
| reload (data-load alert) | Reloads the page | text link | Amber |
| Reload (conflict alert) | Reloads the page | button | Amber |
| Photo on the page (each placed photo, ×N) | Selects or drags the photo | clickable element | Grey |
| Take the photo off the page (×) | Removes the photo from the page | icon-only | Red |
| Words on the page (each text box, ×N) | Selects, drags or types in the words | clickable element | Grey |
| Remove these words (×) | Deletes the text box | icon-only | Red |
| Smaller text (toolbar) | Shrinks the text | icon-only | Grey |
| Bigger text (toolbar) | Enlarges the text | icon-only | Grey |
| Text colour (toolbar) | Opens the colour choices | icon-only | Grey |
| Background behind the words (toolbar) | Toggles a backing behind the words | icon-only | Grey |
| Turn left (toolbar) | Rotates the words left | icon-only | Grey |
| Turn right (toolbar) | Rotates the words right | icon-only | Grey |
| Remove these words (toolbar, bin) | Deletes the text box | icon-only | Red |
| Ink / Terracotta / Blue / Gold (colour swatches, ×4) | Sets the words' colour | icon-only | Grey |
| + Words | Adds a new text box | button | Terracotta |
| Name these photos | Opens the photo-set naming field | button | Grey |
| Save | Saves the page now | button | Green |
| Name them | Saves the name for the photo set | button | Green |
| Cancel | Closes the naming field | button | Grey |
| Put the photo from {time} on this page (tray, ×N) | Places the photo on the page | clickable element | Terracotta |
| {set name} · {count} (saved photo-set chip, ×N) | Puts that photo set on the page | clickable element | Terracotta |
| Forget the name {set name} (×) | Removes the saved set name | icon-only | Red |
| Undo (toast) | Reverses the last change | text link | Amber |

## apps/web/app/dashboard/[eventId]/studio/_components/addon-detail-view.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Verifying (shown while payment is being checked) | Opens the order to see payment status | button (pill link) | Grey |
| Open (shown when free or owned) | Opens the service's own page | button (pill link) | Terracotta |
| Get · {price} / Get (shown when not owned) | Opens the service's buy flow | button (pill link) | Terracotta |
| Back to Studio (rendered by AppStoreLayout, not read) | Returns to the Studio hub | text link | link — stays a link |
| ✕ close (inspector variant, rendered by InspectorColumn, not read) | Closes the side inspector | icon-only | Grey |
| Open full page ↗ (inspector variant, InspectorColumn, not read) | Opens the full detail page | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/studio/_components/service-parts.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {part name} + line, e.g. Thank-You Video (tile with chevron) | Opens that part's detail page | text link (tile) | link — stays a link |

## apps/web/app/dashboard/[eventId]/studio/editorial-pro/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to services | Returns to the Studio hub | text link | link — stays a link |
| Open your editorial editor (×2, included or unlocked states) | Opens the story editor | button (pill link) | Terracotta |
| Track your order | Opens the orders page | text link | link — stays a link |
| Unlock Editorial PRO (InlineCheckoutDrawer, not read) | Opens the checkout drawer | button | Terracotta |
| see Event Hub PRO | Goes to the Event Hub PRO page | text link | link — stays a link |
| Unlock Event Hub PRO | Goes to the Event Hub PRO page | button (pill link) | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/guest-columns/_components/column-queue-controls.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Return it | Returns the column to the guest with note | button | Red |
| Cancel | Closes the note box | text link | Grey |
| Approve | Publishes the column to the paper | button | Green |
| Return to guest / Take down & return | Opens note box to return the column | button | Red |


## apps/web/app/dashboard/[eventId]/studio/guest-columns/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to your page | Navigates to event website page | text link | link — stays a link |
| ColumnQueueControls (custom component, outside file list; Approve / Decline per column) | Approve or return guest columns | button (custom component, counted as one) | ? (not in file list; Approve=green, Decline=red presumably) |

## apps/web/app/dashboard/[eventId]/studio/indoor-blueprint/_components/blueprint-studio.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save entrance (Saving…) | Saves entrance position | button | Green |
| Drag to set the venue entrance (invisible drag handle over map) | Drag handle to place entrance | icon-only | Grey |
| Preview a guest's view (select: guest → table) | Picks guest to preview map | clickable element (select dropdown) | Grey |
| seating chart | Goes to seating page | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/studio/indoor-blueprint/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to add-ons | Navigates back to studio hub | text link (grey pill) | link — stays a link |
| seat plan | Goes to seating page | text link | link — stays a link |
| open the guest view | Opens guest find-my-table page | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/studio/live-studio-control/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Open the controller — go live free with one camera | Opens the live controller | button (outlined pill link) | Terracotta |
| Add Live Watch / Open controller (AddOnStateCta, shared component) | Opens plan sheet to buy, or opens controller | button (custom component, counted as one) | Terracotta |
| Back to add-ons (AppStoreLayout back prop) | Navigates back to studio hub | text link | link — stays a link |
| Add hosted channel (ChoosePlanSheet trigger) | Opens plan sheet for hosted channel | button (custom component, counted as one) | Terracotta |
| Disconnect (Disconnecting…) | Disconnects YouTube channel | button | Red |
| How we handle Google data | Goes to privacy page | text link | link — stays a link |
| Connect YouTube | Starts YouTube OAuth connect | button (anchor styled as button) | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/auto-palette-sheet.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {palette name} e.g. 'Blush Garden' + swatches | Applies that suggested palette | clickable element (card-style button) | Terracotta |
| ✨ Make more | Shows next suggestion page | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/colour-picker-sheet.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Colour swatch (from your photos, up to 8) | Picks that colour | icon-only | Grey |
| Colour swatch (Swatches grid) | Picks that colour | icon-only | Grey |
| Colour wheel | Opens native colour input | clickable element (label wrapping colour input) | Grey |
| Use | Applies typed hex colour | button | Terracotta |
| Close (full-screen backdrop, aria-label only) | Dismisses sheet | clickable element | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/concept-pdf-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Download concept book (PDF) (Preparing your PDF… / Saved to your downloads) | Downloads concept-book PDF | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/dress-code-fields.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Show the outfit figure (InfoTip) | Opens info tip for outfit figure | icon-only (shared InfoTip, outside list; counted as one) | Grey |
| Show the outfit figure (switch) | Toggles outfit figure on or off | clickable element (checkbox switch) | Grey |
| What each group wears (GroupAttireField, outside file list) | Edits group outfit lines | button (custom component, counted as one) | ? (not in file list) |
| What each role wears (RoleAttireField, outside file list) | Edits role outfit lines | button (custom component, counted as one) | ? (not in file list) |
| PaletteField and ListField controls | Rendered here, listed under own files | (see palette-field.tsx and list-field.tsx) | n/a (not counted again) |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/dress-code-lists-form.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save (studio only; SubmitButton, 'Saving…') | Saves do's and don'ts lists | button | Green |
| ListField controls (Do and Don't lists) | Rendered here, listed under list-field.tsx | (see list-field.tsx) | n/a (not counted again) |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/list-field.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| X icon (Remove row 2) (used in Do and Don't lists) | Removes a row from the list | icon-only | Red |
| Add another (used in Do and Don't lists) | Adds a blank list row | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/majors-editor.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Colour swatch (SwatchPopover, outside list; per main colour, with remove) (repeats per item) | Opens colour editor or removes colour | clickable element (custom component, counted as one) | Grey |
| + (Pick your main colour — not yet chosen) (repeats per item) | Adds a main colour slot | icon-only | Terracotta |
| + (Add a major color) | Adds another main colour | icon-only | Terracotta |
| Palette | Jumps to Palette section | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/mood-board-parts.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Theme | Switches to Theme part | button (DetailsPieceButton, outside list; tab-like) | Grey |
| Inspiration | Switches to Inspiration part | button (DetailsPieceButton) | Grey |
| Palette | Switches to Palette part | button (DetailsPieceButton) | Grey |
| Reception | Switches to Reception part | button (DetailsPieceButton) | Grey |
| In your colours | Switches to colours preview part | button (DetailsPieceButton) | Grey |
| Make it real | Switches to Make it real part | button (DetailsPieceButton) | Grey |
| Share & export | Switches to Share part | button (DetailsPieceButton) | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/palette-field.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Colour picker for swatch 1 (native colour input) (repeats per item) | Picks swatch colour | clickable element | Grey |
| X icon (Remove swatch 2) (repeats per item) | Removes swatch row | icon-only | Red |
| Add another swatch | Adds a blank swatch row | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/gallery-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| From · Everyone (PickMenu dropdown) | Filters photos by source | button (dropdown) | Grey |
| Near · Anywhere (PickMenu dropdown) | Filters photos by region | button (dropdown) | Grey |
| Matches my colours (switch) | Hides photos not matching palette | clickable element (switch) | Grey |
| Close (non-studio only) | Closes supplier photo picker | text link (underlined text button) | Grey |
| Try again (on load error) | Retries loading photos | button | Amber |
| Save to {slot} e.g. 'Save to Flowers' / Saved | Saves supplier photo to slot | button | Green |
| Shop › (studio only, new tab) | Opens supplier shop page | button (pill-styled anchor) | link — stays a link |
| Show more (12 left) | Loads more photos | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/inspiration-board.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| + (empty photo tile, file picker; 3 per slot) (repeats per item) | Uploads inspiration photo | clickable element (label wrapping file input) | Terracotta |
| × (Remove, on photo tile) (repeats per item) | Removes photo from slot | icon-only | Red |
| Photo tile (draggable) (repeats per item) | Drag to reorder photos | clickable element (drag only) | Grey |
| Browse supplier photos / Hide supplier photos (repeats per item) | Toggles supplier photo picker | text link (underlined text button) | Grey |
| Browse shared renders / Hide shared renders (repeats per item) | Toggles shared render picker | text link (underlined text button) | Grey |
| GalleryPicker and RenderPoolPicker controls | Rendered here, listed under own files | (see gallery-picker.tsx, render-pool-picker.tsx) | n/a (not counted again) |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/make-it-real.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| About make it real (InfoTip) | Opens info tip | icon-only (shared InfoTip, outside list) | Grey |
| Buy {pack name} e.g. 'Buy Render Pack' (ChoosePlanSheet trigger) | Opens credit pack purchase sheet | button (custom component, counted as one) | Terracotta |
| Let Setnayan feature your creation — get 1 extra render (checkbox) | Toggles feature-my-render consent | clickable element (checkbox) | Green |
| + Render another part | Opens part chooser dialog | button | Terracotta |
| Close part chooser (full-screen backdrop) | Dismisses chooser | clickable element | Grey |
| {part label} e.g. 'Cake' (repeats per item) (in chooser) | Adds that part to render board | button | Terracotta |
| Close (in chooser) | Closes chooser | button | Grey |
| Get the credit back (stalled render) (repeats per item) | Abandons stalled render, refunds credit | button | Amber |
| Get more credits (repeats per item) | Scrolls to credits area | button | Terracotta |
| Try again · {cost} (repeats per item) | Retries failed render | button | Amber |
| + Add a photo (repeats per item) | Scrolls to Inspiration section | button | Terracotta |
| Pick your colours (repeats per item) | Scrolls to Palette section | button | Terracotta |
| The whole look · {cost} / Make it real · {cost} (repeats per item) | Opens brief to start a render | button | Terracotta |
| Buy more credits (repeats per tile) | Scrolls to credits area | button | Terracotta |
| Unlock (repeats per item) | Unlocks locked render preview | button | Amber |
| Keep photo / ✓ Kept (repeats per item) (2 locations per tile) | Toggles keeping the photo | button | Green |
| Regenerate · {cost} (repeats per item) | Opens brief to regenerate | button | Terracotta |
| Lock this preview (repeats per item) | Locks the render preview | button | Green |
| Remove (repeats per item) (part tiles) | Removes part tile from board | button | Red |
| Generate · {cost} / Generate the whole look · {cost} (repeats per item) | Starts paid render | button | Terracotta |
| Not now (repeats per item) | Closes the brief panel | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/mood-board-editor.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ‹ Back to add-ons | Navigates back to studio hub | text link | link — stays a link |
| Theme (sticky mini-nav) | Jumps to Theme section | text link | link — stays a link |
| Inspiration (sticky mini-nav) | Jumps to Inspiration section | text link | link — stays a link |
| Palette (sticky mini-nav) | Jumps to Palette section | text link | link — stays a link |
| Do's & don'ts (sticky mini-nav) | Jumps to Do's and don'ts | text link | link — stays a link |
| Reception (sticky mini-nav) | Jumps to Reception section | text link | link — stays a link |
| In your colors (sticky mini-nav) | Jumps to colours preview | text link | link — stays a link |
| Make it real (sticky mini-nav) | Jumps to Make it real | text link | link — stays a link |
| Share & export (sticky mini-nav) | Jumps to Share section | text link | link — stays a link |
| Your inspirations / About inspiration (InfoTip) | Opens info tip | icon-only (shared InfoTip, outside list) | Grey |
| ThemeStudio (outside file list; theme description, templates, apply) | Sets theme and applies templates | button (custom component, counted as one) | ? (not in file list) |
| Edit in Seat Plan → (non-Maker only) | Goes to seat plan lab | text link | link — stays a link |
| ShareWithVendorsButton / PrintablePdfButton / ConceptPdfButton | Rendered here (editor bar and Maker controls) | (see own files) | n/a (not counted again) |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/mood-board-studio.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Auto | Opens auto-palette suggestions sheet | button | Terracotta |
| Colours (tab) | Shows Colours tab | button (segmented tab) | Grey |
| Attire (tab) | Shows Attire tab | button (segmented tab) | Grey |
| Inspiration (tab) | Shows Inspiration tab | button (segmented tab) | Grey |
| Do's & Don'ts (tab) | Shows Do's and Don'ts tab | button (segmented tab) | Grey |
| Undo (after a colour change note) | Reverts the last colour change | button | Amber |
| Keep (supplier-suggested change) (repeats per item) | Accepts supplier colour suggestion | button | Green |
| Undo it (supplier-suggested change) (repeats per item) | Reverts supplier colour change | button | Amber |
| About {heading} (InfoTip) ×4 | Opens info tip on a heading | icon-only (shared InfoTip) | Grey |
| {main colour name} row e.g. 'Dominant' + hex ×5 | Opens colour picker for that colour | clickable element (full-row button) | Grey |
| {room or flower part} row e.g. 'Linens' (repeats per item) | Opens colour picker for that part | clickable element (full-row button) | Grey |
| Wear · {style} / Not said yet (PickMenu dropdown) (repeats per role) | Picks what role wears | button (dropdown) | Grey |
| + (Add a colour for {role}) (repeats per role) | Opens colour picker to add colour | icon-only | Terracotta |
| Upload your own photos (PickMenu dropdown) | Picks slot, then opens file chooser | button (dropdown) | Terracotta |
| Use as my five main colours | Applies photo palette as main colours | button | Terracotta |
| Compare | Switches to Colours tab | button | Grey |
| Search ideas › (repeats per slot) | Opens supplier ideas gallery sheet | text link (text button) | Grey |
| + (Add a photo to {slot}) (repeats per slot) | Opens file chooser to upload | icon-only | Terracotta |
| X (Remove this photo) (repeats per photo) | Removes uploaded photo | icon-only | Red |
| {slot useLabel} e.g. 'Use as bride's colours' (repeats per slot) | Applies slot palette to roles | button | Terracotta |
| Follow {main colour} again (inside colour picker sheet) | Resets part to follow main colour | button | Grey |
| Colour picker, Auto sheet and Ideas sheet controls | Rendered here, listed under own files | (see colour-picker-sheet.tsx, auto-palette-sheet.tsx, gallery-picker.tsx) | n/a (not counted again) |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/palette-section.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Palette style options e.g. 'Soft' / 'Bold' (repeats per style) | Sets palette style | button (pill toggle) | Grey |
| Venue / Couple / Wedding party, family & sponsors / Room dressing (collapsible headings) (repeats per group) | Expands or collapses a group | clickable element (details summary) | Grey |
| ↑ Edit at 00 — Your theme | Jumps up to Theme section | text link | link — stays a link |
| + (Pick a {role} colour) (repeats per role) | Adds first colour for role | icon-only | Terracotta |
| Colour swatch (SwatchPopover, outside list; with remove) (repeats per colour) | Opens colour editor or removes colour | clickable element (custom component, counted as one) | Grey |
| + (Add another {role} colour) (repeats per role) | Adds another colour for role | icon-only | Terracotta |
| ↺ Match my main colours (repeats per role) | Releases role back to main colours | text link (underlined text button) | Terracotta |
| {Room item} color e.g. 'Linens' (native colour input) (repeats per item) | Sets room dressing colour | clickable element | Grey |
| Use derived (repeats per item) | Resets room colour to derived | button | Grey |
| X (Remove custom role {name}) (repeats per role) | Deletes custom role | icon-only | Red |
| Custom role colour (native colour input) (repeats per colour) | Sets custom role colour | clickable element | Grey |
| X (Remove color {hex}) (repeats per colour) | Removes custom role colour | icon-only | Red |
| Add color (repeats per custom role) | Adds colour to custom role | button | Terracotta |
| Add a custom role | Adds a custom role | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/part-finalization-panel.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Never mind (repeats per part) | Cancels re-open request | button | Red |
| Ask to change it (repeats per part) | Asks supplier to re-open agreed part | button | Blue |
| Withdraw (repeats per part) | Withdraws sign-off request | button | Red |
| Ask {supplier} e.g. 'Ask Bloom Studio' (repeats per supplier) | Asks supplier to sign off part | button | Blue |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/printable-pdf-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Download printable (PDF) (Preparing your PDF… / Saved to your downloads) | Downloads printable mood board PDF | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/recolor-studio.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Photo canvas (tap while eyedropping) | Picks a region by tapping photo | clickable element | Grey |
| {region name} chip e.g. 'Dress' (repeats per region) | Selects region to recolour | button (chip) | Grey |
| + Eyedrop area / Tap the photo… | Toggles eyedropper mode | button | Grey |
| Colour swatch (Snap to a palette color) (repeats per colour) | Snaps region to palette colour | icon-only | Grey |
| Reset this part | Reverts the active region edit | text link (text button) | Amber |
| Save to moodboard (Saving…) | Saves recoloured photo | button | Green |
| Reset all | Reverts all region edits | button | Amber |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/render-pool-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Close | Closes shared render picker | text link (underlined text button) | Grey |
| Try again (on load error) | Retries loading renders | button | Amber |
| Save to this slot / Saved (repeats per render) | Saves shared render as reference | button | Green |
| Show more (12 left) | Loads more shared renders | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/share-with-vendors-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Share with suppliers (Sharing…) | Notifies booked suppliers of board | button | Blue |


# chunk9 — studio (mood-board, pakanta, panood, papic) controls

Notes: pill-styled `<Link>`/`<a>` counted as "button"; plain text links = "link — stays a link". Dynamic per-option controls (moods, cameras, moments, guests) are listed once as one row per kind. Imported shared components not in this list (CopyButton, SubmitButton, SettingRow, InlineCheckoutDrawer, EncoderKeyPanel, FacebookDualStreamCard, LiveStudioRecordingsCard) are treated as one control each where they appear; the last three contain their own controls that are not inventoried here.

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/swatch-popover.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| (colour swatch) "Change color, currently Sage" | Opens the colour picker popover | clickable element | Grey |
| X (Remove Sage) | Removes this colour from the palette | icon-only | Red |
| Colour name chip, e.g. "moss green" (one per search match) | Sets swatch to that named colour | button | Terracotta |
| Closest-match chip, e.g. "Olive" (one per suggestion, dashed) | Sets swatch to nearest suggested colour | button | Terracotta |
| (round swatch) "Use your Sage board color" (one per board colour) | Sets swatch to a mood-board colour | icon-only | Terracotta |
| (round swatch) "Match your Blush major color" (one per major) | Sets swatch to a theme major colour | icon-only | Terracotta |
| Copy | Copies this colour to the clipboard | button | Grey |
| Paste Sage | Pastes the copied colour here | button | Terracotta |
| Cancel swap | Cancels the pending colour swap | button | Red |
| ⇄ Swap here | Completes the swap into this role | button | Terracotta |
| ⇄ Swap with another role | Starts swapping with another role | button | Grey |
| Done | Closes the colour popover | button | Green |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/template-gallery.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Start from a designed theme | Begins the theme picker wizard | button | Terracotta |
| Start with a blank board | Keeps the board blank | button | Terracotta |
| Browse designed themes anyway | Reopens theme picker from chosen state | text link | Grey |
| Actually, show me some designed themes | Leaves blank board, opens theme picker | text link | Grey |
| Back ×2 (mood step, setting step) | Goes back one wizard step | button | Grey |
| Mood choice, e.g. "Romantic" (one per mood) | Picks the mood, moves to settings | button | Terracotta |
| More feelings | Shows all mood options | text link | Grey |
| Setting choice, e.g. "Garden" (one per style family) | Picks the setting, shows matching themes | button | Terracotta |
| More settings | Shows all setting options | text link | Grey |
| Start over ×1 | Resets the wizard to the beginning | text link | Grey |
| Try again | Retries loading the themes | button | Amber |
| Try another setting / Pick another feeling | Goes back to choose differently | button | Terracotta |
| Apply (becomes "Applied") per theme | Fills empty board slots with this theme | button | Terracotta |
| or replace everything instead (per theme) | Overwrites the whole board with theme | text link | Red |
| Show more (12 left) | Loads more matching themes | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/mood-board/_components/theme-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Suggest for me | Suggests a theme from the board | button | Terracotta |
| Read my description | Reads description into mood, colours, details | button | Terracotta |
| X (Remove Romantic) ×4 (mood / setting / colour / motif chips) | Drops that item from the reading | icon-only | Red |
| Use these | Applies the understood items to the board | button | Terracotta |
| Dismiss | Closes the reading without applying | text link | Grey |

## apps/web/app/dashboard/[eventId]/studio/pakanta/_components/pakanta-music-form.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save my music notes | Saves notes after payment (paid state) | button | Green |
| Save for later | Saves the music brief as a draft | button | Green |
| Continue to payment · ₱X | Saves brief, reveals checkout drawer | button | Terracotta |
| Pay · ₱X (InlineCheckoutDrawer trigger, custom component) | Opens inline payment checkout | button | Green |

## apps/web/app/dashboard/[eventId]/studio/pakanta/_components/use-song-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Use this song on my site | Sets delivered song as site music | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/pakanta/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to services | Goes back to studio hub | text link | link — stays a link |
| love-story details | Goes to details page to finish story | text link | link — stays a link |

(UseSongButton and PakantaMusicForm controls are inventoried in their own files.)

## apps/web/app/dashboard/[eventId]/studio/panood/_components/copy-link.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Copy (becomes "Copied") | Copies the link to clipboard | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/panood/broadcast/control-room.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| < (Back to Live Watch setup) | Goes back to Live Watch setup | icon-only | Grey |
| Camera icon (Connect cameras) | Opens the camera connection page | icon-only | Terracotta |
| Pop-out icon (Pop out for OBS) | Opens clean program window for OBS | icon-only | Grey |
| Layout icon (Switch to compact console / director board) | Toggles console layout | icon-only | Grey |
| Camera tile, e.g. "Camera 1" (mobile strip, one per camera) | Puts that camera on air | clickable element | Terracotta |
| Moments / Cameras / Walls (mobile tabs) ×3 | Switches the control section | button | Grey |
| Go live / End broadcast (mobile thumb bar) | Starts or ends the broadcast | button | Terracotta (Go live); Red (End broadcast) |
| Pop out for OBS (program monitor) | Opens clean program window for OBS | button | Grey |
| Split position divider | Drags or arrow-keys the split ratio | clickable element | Grey |
| Connect a camera | Opens the camera connection page | text link | link — stays a link |
| Camera source tile (Sources, one per camera) | Puts that camera on air | clickable element | Terracotta |
| Split / Split ✓ (per camera) | Pairs camera beside program source | button | Grey |
| Photo wall / Live background tiles ×2 | Puts that wall source on air | clickable element | Terracotta |
| Moment tile, e.g. "First dance" (one per moment) | Recomposes the shot for that moment | clickable element | Terracotta |
| Go live / End broadcast (Broadcast panel) | Starts or ends the broadcast | button | Terracotta (Go live); Red (End broadcast) |
| Mark highlight | Marks a beat for AI highlight reels | button | Green |
| Photos / Mirror / Live bg (per venue screen) ×3 | Routes that source to the screen | button | Terracotta |
| Off (per venue screen) | Turns that venue screen off | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/panood/broadcast/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Unlock Live Watch | Opens Live Watch page to upgrade | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/panood/cameras/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to the control room | Goes back to the control room | button | Grey |
| Print the QR sheet | Opens printable camera QR sheet | button | Grey |
| Open the control room (empty state) | Opens control room to create camera seats | button | Terracotta |
| Reissue to someone else (per claimed camera) | Starts reissuing the camera link | button | Amber |
| Yes, disconnect them | Reissues link, disconnects current operator | button | Red |
| Cancel | Cancels the reissue | button | Red |
| Copy (per open camera link, CopyLink) | Copies the camera link | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/panood/cameras/print/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to the control room | Goes back to the control room | text link | link — stays a link |

## apps/web/app/dashboard/[eventId]/studio/panood/cameras/reissue-button.tsx
Controls are rendered on the cameras page and inventoried there (Reissue to someone else, Yes disconnect them, Cancel).

## apps/web/app/dashboard/[eventId]/studio/panood/setup/go-live-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Go live | Creates the YouTube broadcast | button | Terracotta |
| Copy (RTMP server URL, CopyButton external) | Copies the OBS server address | button | Grey |
| (watch URL, opens new tab) | Opens the live watch page | text link | link — stays a link |
| Copy (watch URL, CopyButton external) | Copies the watch link | button | Grey |
| End broadcast | Ends the broadcast on YouTube | button | Red |

(EncoderKeyPanel, an external component, holds the stream-key reveal/copy/connect controls; not inventoried here.)

## apps/web/app/dashboard/[eventId]/studio/panood/setup/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to Live Watch | Goes back to Live Watch page | button | Grey |
| Privacy policy | Opens privacy page | text link | link — stays a link |
| Connect YouTube | Starts Google OAuth to link channel | button | Terracotta |
| Disconnect | Unlinks the YouTube channel | button | Red |
| Live Watch page (inline) | Opens Live Watch page | text link | link — stays a link |
| Open the control room | Opens the multi-camera control room | button | Terracotta |
| Remove link | Removes the saved watch link | button | Red |
| Save watch link | Saves pasted YouTube watch link | button | Green |

(FacebookDualStreamCard and LiveStudioRecordingsCard are external components with their own controls; not inventoried here.)

## apps/web/app/dashboard/[eventId]/studio/papic/_components/credit-stepper.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| − (Less) | Steps down to the smaller credit pack | icon-only | Grey |
| + (More) | Steps up to the larger credit pack | icon-only | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/face-tagging-choice.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Finding people in photos row (SettingRow, opens a sheet) ×2 | Opens the setting explanation sheet | clickable element | Grey |
| Turn it off for my event | Switches face tagging off, erases selfies | button | Red |
| Turn it back on | Switches face tagging back on | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/guest-allotment-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save (one per guest row) | Saves that guest's credit limit | button | Green |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/guest-allotments-choice.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| How many credits each guest gets row (SettingRow, opens a sheet) ×2 | Opens the credit limits sheet | clickable element | Grey |
| Turn this on | Enables per-guest credit limits | button | Terracotta |
| Turn this off | Disables per-guest credit limits | button | Grey |
| Save (everyone you have not named) | Saves the default limit | button | Green |
| Save (minimum each) | Saves the minimum credits per guest | button | Green |
| on your guest list (inline) | Goes to the guest list page | text link | link — stays a link |
| Open the rest to everyone | Lifts every limit on the pot | button | Terracotta |


## apps/web/app/dashboard/[eventId]/studio/papic/_components/guest-cameras-choice.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Let guests shoot now / Only on my event day (SettingRow row variant: opens sheet) | Toggles guest cameras open early | button (SubmitButton, grey ink/5 chip) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/live-wall-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Set up your Papic crew > | Goes to crew page | link — stays a link (terracotta text link) | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/live-wall-controls.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| On guests' phones - tap to stop / Venue screens only - tap to allow phones | Toggles wall mirroring to guest phones | button (mulberry/grey switch) | Grey |
| Layout dropdown (Wall layout PickMenu) | Picks wall tile layout | clickable element (PickMenu custom dropdown) | Grey |
| Save | Saves wall photo count and layout | button (ink fill) | Green |
| Generate screen code | Creates a new wall screen code | button (mulberry) | Terracotta |
| X (Revoke screen code {code}) | Revokes a wall screen code | icon-only | Red |
| Show on wall again (undo arrow icon) | Unhides a hidden wall photo | icon-only | Amber |
| Hide from wall (keeps it in your gallery) (eye-off icon) | Hides photo from wall only | icon-only | Red |
| Hide from wall AND gallery (X icon) | Hides photo from wall and gallery | icon-only | Red |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/papic-gallery-grid.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Show dropdown (Gallery filter PickMenu) | Filters gallery by kind or tag | clickable element (PickMenu dropdown) | Grey |
| Download all | Downloads gallery zip | text link (a download, sn-gal-btn chip) | Grey |
| Play video clip / Open photograph (tile overlay) | Opens tile in lightbox | clickable element (full-tile button) | Grey |
| Sparkle (Add this snippet to your public memory orb) | Toggles clip on public memory orb | icon-only | Terracotta |
| Gem (Kept at full resolution - tap to release) | Toggles keeping original at full resolution | icon-only | Grey |
| Save to phone (SavePhotoButton, external component) | Saves photo to phone | icon-only | Grey |
| Download snippet | Downloads clip file to device | button (sn-gal-btn chip) | Grey |
| Save photo | Downloads photo from lightbox | text link (a download, sn-gal-btn chip) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/papic-pool-card.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Credit stepper (- / +) (CreditStepper, external component) | Adds or removes pool credit rungs | clickable element (custom stepper control) | Grey |
| Continue to payment | Submits pool top-up order | button (terracotta-700 fill) | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/pool-gallery-toggle.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Open to guests - tap to close / Closed - tap to open to guests | Toggles shared gallery open to guests | button (mulberry/grey switch) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/setting-row.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {Setting label} {value} > (row, e.g. 'When guests can shoot  Event day') | Opens settings sheet for that row | clickable element (full-width row button with chevron) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/source-row.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {Source label} {state} > (row with href) | Navigates to source page | link — stays a link | Grey |
| {Source label} {state} > (row with sheet) | Opens source settings sheet | clickable element (full-width row button with chevron) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/uploads-open-choice.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Turn this on | Allows hand-added photos to the gallery | button (SubmitButton sn-btn-primary) | Terracotta |
| Turn this off | Stops hand-added uploads | button (SubmitButton sn-btn-secondary) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/_components/vendor-media-controls.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Hide (per supplier) | Hides supplier captures from gallery | button (grey chip) | Grey |
| Show again (per supplier) | Restores supplier captures in gallery | button (grey chip) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/challenges/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| < Papic | Goes back to Papic setup | link — stays a link (back) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/couple-challenges-manager.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Pick your challenges > / Change your challenges > | Opens the challenge picker page | button (Link with button-primary class) | Terracotta |
| Set a challenge for each moment | Opens run-of-show page | link — stays a link (inline text link) | Grey |
| Add challenge (+) | Adds your own written challenge | button (SubmitButton mulberry fill) | Terracotta |
| Search | Searches the challenge library | button (SubmitButton outline) | Grey |
| Filter chips: All / Photo / Video ×3 | Filters library by kind | text link (chip link) | Grey |
| Filter chips: Everything + 12 theme chips (e.g. Ceremony) ×13 | Filters library by theme | text link (chip link) | Grey |
| X Clear search and filters | Resets search and filters | text link | Grey |
| Add (+) (per library challenge) | Adds library challenge to board | button (SubmitButton outline) | Terracotta |
| Ask now (play icon) with length dropdown | Starts challenge for chosen minutes | button (SubmitButton mulberry outline) | Terracotta |
| How long this challenge runs dropdown (30 min / 1 hr / 2 hr) | Picks how long challenge runs | clickable element (native select) | Grey |
| Stop (square icon) | Stops the running challenge prompt | button (SubmitButton outline) | Red |
| Hide from guests / Show to guests (eye icon) | Toggles challenge visibility to guests | icon-only | Grey |
| Delete challenge (trash icon) | Deletes your own challenge | icon-only | Red |

## apps/web/app/dashboard/[eventId]/studio/papic/crew/_components/copy-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Copy link (shows Copied) | Copies seat claim link to clipboard | button (outline) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/crew/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| < Back to Papic ×2 | Returns to Papic setup | link — stays a link (back; grey pill link) | Grey |
| Go to Papic | Opens Papic page to set up crew | button (Link styled as mulberry pill) | Terracotta |
| Print QR cards | Opens printable QR cards in new tab | button (Link styled as grey pill) | Grey |
| Fill in my crew cameras | Creates missing crew camera seats | button (SubmitButton mulberry) | Terracotta |
| Copy link (shared code) | Copies shared pool join link | button (CopyButton, outline) | Grey |
| Print the poster | Opens printable poster in new tab | button (Link styled as grey pill) | Grey |
| Open your Event Hub settings | Opens Event Hub settings | button (Link styled as mulberry pill) | Terracotta |
| Copy link (per camera seat) | Copies one seat's claim link | button (CopyButton, outline) | Grey |
| Reissue to someone else / Reset link | Issues a fresh claim link for a seat | button (SubmitButton outline) | Amber |

## apps/web/app/dashboard/[eventId]/studio/papic/extra-cameras-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| - (Remove one {tier} camera) | Decreases extra cameras of that tier | icon-only (round stepper) | Grey |
| + (Add one {tier} camera) | Increases extra cameras of that tier | icon-only (round stepper) | Grey |
| Add 3 extra cameras - PHP 1,500 (or Free; Pick at least one camera when 0) | Submits extra-camera order | button (mulberry full-width) | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/papic/guest-camera-tier-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Limited (tier radio card, with price) | Selects Limited guest camera tier | clickable element (radio card button) | Grey |
| Unlimited - archived to your Drive (tier radio card) | Selects Unlimited guest camera tier | clickable element (radio card button) | Grey |
| Ready for Papic - activate 120 guest cameras - PHP X / Upgrade to Unlimited - PHP X / Switch to Limited - PHP X | Submits guest camera tier order | button (mulberry full-width) | Terracotta |
| Re-sync from guest list | Re-syncs cameras to current guest list | button (same mulberry full-width submit) | Amber |

## apps/web/app/dashboard/[eventId]/studio/papic/moderation/_components/kwento-queue-controls.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Approve (check icon) | Approves a guest message | button (mulberry fill) | Green |
| Reject (X icon) | Rejects a guest message | button (outline) | Red |
| Take off wall (monitor-off icon) | Removes message from venue wall | button (outline) | Grey |
| Show on wall (monitor icon) | Puts message on venue wall | button (terracotta outline) | Terracotta |
| Block guest (shield icon) | Blocks guest from sending messages | button (faint text button) | Red |

## apps/web/app/dashboard/[eventId]/studio/papic/moderation/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Hide from gallery / Unhide (guest capture) | Toggles guest photo hidden in gallery | button (SubmitButton outline) | Grey |
| Delete forever (guest capture, opens confirm dialog) | Permanently deletes photo after confirm | button (SubmitButton terracotta outline in ConfirmForm) | Red |
| Report reason dropdown (e.g. nudity_sexual) | Picks report reason | clickable element (native select) | Grey |
| Report (flag icon) | Reports photo for the chosen reason | button (SubmitButton amber outline) | Amber |
| Unblock {name}'s camera | Unblocks guest's camera | button (SubmitButton outline) | Amber |
| Block {name}'s camera | Blocks guest's camera | button (SubmitButton terracotta tint) | Red |
| Hide from gallery / Unhide (crew seat photo) | Toggles crew photo hidden in gallery | button (SubmitButton outline) | Grey |
| Delete forever (crew seat photo, opens confirm dialog) | Permanently deletes crew photo after confirm | button (SubmitButton terracotta outline in ConfirmForm) | Red |
| Unblock (blocked guests list) | Unblocks a blocked guest | button (SubmitButton outline) | Amber |
| Approve - show this photo (eye icon) | Restores a screened-out photo | button (SubmitButton green tint) | Green |
| Set up Papic | Opens Papic setup page | link — stays a link (inline mulberry text link) | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/papic/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| < Back to add-ons | Returns to add-ons hub | link — stays a link (back; grey pill link) | Grey |
| Show the QR codes (QR icon) ×2 | Opens crew QR codes page | button (Link styled as mulberry pill) | Terracotta |
| Print cards ×2 | Opens printable crew cards in new tab | button (Link styled as grey pill) | Grey |
| When your cameras can shoot  {dates} > (Coverage row) | Opens date picker sheet | clickable element (SettingRow row button) | Grey |
| Crew cameras / Guest cameras / Your uploads rows (SourceRow with sheet) ×3 | Opens that source's settings sheet | clickable element (SourceRow row button with chevron) | Grey |
| Your Papic look  {style} > (Filter row) | Opens look picker sheet | clickable element (SettingRow row button) | Grey |
| Add the first memory | Jumps to Four ways into your library | button (a styled as terracotta pill, anchor jump) | Terracotta |
| Turn this on (uploads camera, in Your uploads sheet) | Creates upload camera for hand-added photos | button (SubmitButton sn-btn-primary) | Terracotta |
| Open moderation > | Opens moderation page | link — stays a link (mulberry text link) | Grey |
| Setup & help - DSLR pairing, the shutter, capture defaults | Expands setup and help section | clickable element (details summary) | Grey |
| Supported camera bodies | Expands list of supported DSLR bodies | clickable element (details summary) | Grey |
| Unlock all - PHP {price} (InlineCheckoutDrawer trigger, external component) | Opens inline checkout to unlock Papic | button (mulberry fill) | Green |
| Keep Full-Res - PHP {price}/yr (InlineCheckoutDrawer trigger, external component) | Opens inline checkout for full-res keeping | button (mulberry outline) | Green |
| Go to guest list / Add more guests > | Opens guest list page | link — stays a link (terracotta text link) | Terracotta |
| Connect Google Drive | Starts Google Drive connection | button (a styled as mulberry pill) | Terracotta |
| connect more space / connect a second Drive you own (full-Drive warning) | Starts second Drive connection | text link (inline underlined) | Terracotta |
| Use a different account | Switches the connected Drive account | text link (inline) | Grey |
| Connect a second Drive you own | Starts second Drive connection | text link (inline) | Terracotta |
| reconnect it (2nd Drive needs to reconnect) | Re-authorises second Drive | text link (inline underlined) | Amber |
| Disconnect 2nd Drive | Disconnects the second Drive | text link (SubmitButton underlined text) | Red |
| Disconnect (Drive) | Disconnects the Google Drive | button (SubmitButton outline) | Red |

## apps/web/app/dashboard/[eventId]/studio/papic/papic-window-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Set window / Update window | Saves the camera capture window dates | button (SubmitButton outline) | Green |

## apps/web/app/dashboard/[eventId]/studio/papic/recap/_components/recap-drive-nudge.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| X (Dismiss) | Hides the Drive nudge card | icon-only | Grey |
| Save originals to my Drive | Starts Google Drive connection | button (a styled as mulberry pill) | Terracotta |
| Maybe later | Hides the Drive nudge card | text link (button styled as plain text) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/recap/_components/recap-social-feature-toggle.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Let Setnayan feature this recap on our Facebook & Instagram (switch) | Toggles permission to feature recap on socials | clickable element (toggle switch) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/recap/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| < Back to Papic | Returns to Papic setup | link — stays a link (back) | Grey |
| View public recap (external icon) | Opens public recap in new tab | text link | Grey |
| Share buttons (ShareButtons, external component) | Shares public recap link | clickable element (custom component, one control) | Grey |
| Make it private | Takes the public recap down | button (SubmitButton outline) | Red |
| Publish my recap | Publishes the recap publicly | button (SubmitButton mulberry fill) | Terracotta |
| Your keepsake magazine - The full, private edition (card) | Opens keepsake magazine page | link — stays a link (whole-card link) | Grey |

## apps/web/app/dashboard/[eventId]/studio/papic/run-of-show/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| < Papic (back link at top) | Returns to Papic setup | link — stays a link (back) | Grey |
| Pause challenges (pause icon) | Pauses challenges for guests | button (outline pill) | Amber |
| Resume challenges (play icon) | Resumes paused challenges | button (dark pill) | Terracotta |
| This is happening now (play icon) | Starts this moment's challenge now | button (dark pill) | Terracotta |
| Take off this moment (X icon) | Removes challenge from this moment | text link (button styled as plain text) | Red |
| Use this | Places suggested challenge on this moment | button (outline pill) | Terracotta |
| Your whole challenge list | Opens full challenge list page | link — stays a link (inline text link) | Grey |



## apps/web/app/dashboard/[eventId]/studio/papic/style-picker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Look card, e.g. 'Classic' + blurb (one per look, count unknown — counted as 1) | Sets the event-wide Papic photo look | clickable element | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/papic/vendor-challenges-approval.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Approve ×N (one per pending challenge) | Approves a supplier's Papic challenge | button | Green |
| Decline ×N (one per pending challenge) | Rejects a supplier's Papic challenge | button | Red |

## apps/web/app/dashboard/[eventId]/studio/patiktok/[templateId]/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to templates | Returns to Patiktok template gallery | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/patiktok/_components/render-form.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Render reel | Queues the reel render | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/patiktok/_components/reel-renderer.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Render now | Starts rendering the reel in browser | button | Terracotta |
| Download reel | Downloads the finished MP4 | button | Grey |
| Open saved copy | Opens the saved reel in new tab | button | Grey |
| Render again ×2 | Re-runs the reel render | button | Terracotta |
| Save & share · ₱{price} | Opens checkout to unlock saving the reel | button | Terracotta |
| Try again | Retries the failed render | button | Amber |

## apps/web/app/dashboard/[eventId]/studio/patiktok/_components/booth-capture.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Clear tag (X icon beside the tag name) | Removes the current guest tag | icon-only | Grey |
| Tag guest / Change | Opens the guest tagging sheet | button | Terracotta |
| Tag (in "Looks like {name}?") | Accepts the suggested guest tag | button | Green |
| Not them | Dismisses the face suggestion | button | Grey |
| Open camera | Asks for camera access, opens booth camera | button | Terracotta |
| Start recording / Record next guest | Starts the countdown then recording | button | Terracotta |
| Stop | Stops the current recording | button | Grey |
| Keep this clip | Accepts the recorded clip | button | Green |
| Retake (n left) | Discards clip and records again | button | Amber |
| Retry camera | Retries camera access after error | button | Amber |
| Continue to render (N clips ready) | Goes to the render page | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/patiktok/_components/tag-sheet.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Close (dimmed backdrop, tap outside) | Closes the tag sheet | clickable element | Grey |
| Close (X icon) | Closes the tag sheet | icon-only | Grey |
| Stop scanning | Turns off the QR scanner | button | Grey |
| Scan place card or table QR | Starts camera QR scan to tag | button | Terracotta |
| Guest row, e.g. 'Maria Santos' ×N | Tags the picked guest | clickable element | Terracotta |
| Use | Tags typed free-text name | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/patiktok/booth/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to Patiktok gallery | Returns to Patiktok gallery | button | Grey |
| ↔ Swap primary and backup | Swaps and saves the two templates | button | Grey |
| Change primary | Opens gallery to pick primary template | button | Grey |
| Change backup | Opens gallery to pick backup template | button | Grey |
| Preview template + queue render | Goes to template page to render | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/patiktok/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to add-ons | Returns to Studio add-ons hub | button | Grey |
| Open booth dashboard → (top) | Opens the booth operator dashboard | button | Terracotta |
| support request (inline in sentence) | Opens help page contact section | text link | link — stays a link |
| Open booth dashboard (panel) | Opens the booth operator dashboard | button | Terracotta |
| Disconnect TikTok | Disconnects the linked TikTok account | button | Red |
| Connect TikTok | Starts TikTok account connection | button | Terracotta |
| Download (Your renders row) ×N | Downloads a completed reel | button | Grey |
| Save (Your renders row) ×N | Jumps to the Save & share card | button | Terracotta |
| Render / Preview (Your renders row) ×N | Opens the queued reel to render | button | Terracotta |
| Save & share · ₱{price} (save card) | Opens checkout to unlock Patiktok | button | Terracotta |
| Template category dropdown (All templates / categories) | Filters templates by category | clickable element | Grey |
| Use as primary / Use as backup ×N (picking mode) | Saves template into the booth slot | button | Terracotta |
| Choose template ×N | Opens the template page | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/photo-delivery/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to Galleries | Returns to Galleries | button | Grey |
| Review then release (mode card) | Sets sync mode to manual release | clickable element | Terracotta |
| Sync live during the event (mode card) | Sets sync mode to live auto-sync | clickable element | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/photo-delivery/_components/photo-delivery-panel.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Connect Google Drive (shared DriveConnectCard, defined outside list) | Starts Google Drive connection | button | Terracotta |
| Not now — I'll download them myself (DriveConnectCard) | Skips Drive and returns to add-ons | text link | Grey |
| Reconnect Drive (DriveReconnectBanner, defined outside list) | Re-authorises the broken Drive link | button | Amber |
| Use a different account | Restarts Drive connect with another account | text link | Grey |
| Disconnect | Disconnects Google Drive | button | Red |
| Release to Drive | Uploads full archive to Drive | button | Terracotta |
| Open in Drive | Opens the Drive folder in new tab | button | Grey |
| Re-deliver new photos | Uploads newly added photos to Drive | button | Terracotta |
| Retry upload | Retries the failed Drive upload | button | Amber |

## apps/web/app/dashboard/[eventId]/studio/playlist/_components/playlist-pick-row.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Edit {song title} (pencil icon) ×N | Opens the pick for inline editing | icon-only | Grey |
| Remove {song title} (trash icon) ×N | Removes the song after confirm | icon-only | Red |
| Done (editing a pick) | Closes inline edit, edits already saved | text link | Green |

## apps/web/app/dashboard/[eventId]/studio/playlist/_components/playlist-slot-section.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Add a song / Add a no-play ×N (one per slot) | Opens the add-song form | text link | Terracotta |
| Cancel | Closes add form, clears fields | text link | Grey |
| Add | Adds the song (red when no-play list) | button | Terracotta |
| Feel chip, e.g. 'Romantic' ×6 | Sets or clears the slot's vibe | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/playlist/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to {event name} | Returns to event home | text link | Grey |

## apps/web/app/dashboard/[eventId]/studio/save-the-date/_components/StdBuilderClient.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Unlock Event Hub Pro (inline in lock notice) ×3 | Goes to Event Hub Pro page | text link | Terracotta |
| Background picker (StdBackgroundPicker, defined outside list: choices, upload, follow theme) | Chooses the film background | clickable element | Terracotta |
| Auto / Lighten / Darken | Sets text-readability veil | button | Grey |
| Font card, e.g. 'Classic' ×N | Picks the film typeface | clickable element | Terracotta |
| Accent colour swatch / reset (ColorRow, defined outside list) | Sets or resets the accent colour | clickable element | Grey |
| Autofill from my event details | Fills fields from event details | button | Terracotta |
| Date Selection (inline, shown when no dates) | Goes to Date Selection page | text link | link — stays a link |
| Edit (beside Your names) | Goes to dashboard to edit names | text link | Grey |
| Video / gallery picker (StdMediaPicker, defined outside list) | Chooses film video or gallery | clickable element | Terracotta |
| Play music in your film (toggle) | Turns film music on or off | clickable element | Grey |
| Song upload (FileUpload, defined outside list) | Uploads your wedding-site song | clickable element | Terracotta |
| Use your Music Maker song | Goes to Music Maker | text link | Grey |
| Manage site music | Goes to site music settings | text link | Grey |
| Opening picker (RevealPreviewCard, defined outside list: opening choices, effect toggles) | Chooses the cinematic opening | clickable element | Terracotta |
| Phone / laptop toggle (DeviceToggle, defined outside list) | Switches preview device frame | clickable element | Grey |
| Replay | Replays the preview from start | button | Grey |
| View your page (after save) | Opens live page in new tab | text link | Grey |
| Render my Save the Date | Builds and saves the Save-the-Date film | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/save-the-date/_components/launch-std-button.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| View your page | Opens live page in new tab | text link | Grey |
| Launch now (scheduled state) | Makes page public immediately | button | Terracotta |
| Change time | Opens the schedule time picker | button | Grey |
| Cancel schedule | Cancels the scheduled launch | text link | Red |
| Update time | Saves the new go-live time | button | Green |
| Cancel (schedule picker) ×2 | Closes the time picker | button | Grey |
| Yes, launch | Confirms making page public now | button | Terracotta |
| Not yet | Backs out of launch confirm | text link | Grey |
| Launch now (private state) | Asks to confirm going public | button | Terracotta |
| Schedule for later | Opens the go-live time picker | button | Terracotta |
| Schedule launch | Schedules the go-live time | button | Terracotta |
| Preview your page | Opens preview in this tab | text link | Grey |

## apps/web/app/dashboard/[eventId]/studio/save-the-date/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to add-ons | Returns to Studio add-ons hub | button | Grey |
| Unlock the openings | Opens checkout for cinematic openings | button | Terracotta |
| Unlock Event Hub PRO | Goes to Event Hub PRO page | button | Terracotta |
| Make your wax seal / Re-make your wax seal | Goes to the wax seal maker | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/save-the-date/stamp/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to Save the Date | Returns to Save-the-Date studio | button | Grey |

## apps/web/app/dashboard/[eventId]/studio/save-the-date/stamp/wax-stamp-maker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Wax pour area ("Tap to drip · Hold to pour") | Pours wax onto the seal | clickable element | Terracotta |
| Stamp handle (press and hold) | Presses the stamp into the wax | clickable element | Terracotta |
| Mood Board (wax colour) | Uses Mood Board colour for the wax | button | Grey |
| Wax colour swatch ×N | Picks a wax colour | icon-only | Grey |
| Matte / Glossy | Picks the wax finish | button | Grey |
| Try again | Resets and re-makes the seal | button | Amber |
| Love it — use this seal | Saves the seal to your event | button | Green |

## apps/web/app/dashboard/[eventId]/studio/setnayan-ai/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Back to add-ons | Returns to Studio add-ons hub | button | Grey |
| See your ranked suppliers → | Goes to ranked suppliers page | button | Terracotta |
| Unlock Setnayan AI | Opens checkout for Setnayan AI | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/thank-you/_components/thank-you-maker.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Save to my phone | Downloads the owned Thank-You film | button | Grey |
| Save to my phone · ₱{price} | Opens checkout to unlock saving the film | button | Terracotta |
| Make the film / Make it again | Renders the Thank-You film | button | Terracotta |

## apps/web/app/dashboard/[eventId]/studio/website-pro/page.tsx
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| {back label}, e.g. Back to Maker | Returns to the previous page | text link | Grey |
| Open your Event Hub | Opens the Event Hub | button | Terracotta |
| Track your order | Goes to the orders page | text link | Grey |
| {back label} (pending-order state) | Returns to the previous page | text link | Grey |
| Unlock Event Hub PRO | Opens checkout for Event Hub PRO | button | Terracotta |


## apps/web/app/dashboard/[eventId]/_components/event-dashboard.tsx

Notes: decision-row CTAs are pill-styled spans inside an InspectorTrigger (whole row is the click target; desktop opens inspector, mobile navigates). ExpandCard is an imported component I could not see inside; each is one control (expand/collapse plus its full-page link).

### Decisions board and Coming up (renderDecisionGroup)

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Book-a-supplier row CTA, label from cockpit (e.g. 'Browse reception venues', 'Lock your coordinator') | Opens inspector or the supplier room | clickable element (pill-look span in a row link) | Terracotta |
| Pick-an-option row CTA, label from cockpit | Opens saved options to pick one | clickable element (pill-look span in a row link) | ? (could be forward step or book; label comes from cockpit) |
| Settle payment | Opens orders to pay a pending order | clickable element (pill-look span in a row link) | Green |
| Fill-a-role row CTA, label from cockpit | Opens sponsor/role room to fill it | clickable element (pill-look span in a row link) | Terracotta |
| Refresh | Reloads event home for unreadable dates | clickable element (pill-look span in a row link) | Amber |
| Open (a date row, ×up to 6) | Opens the date item's room | clickable element (pill-look span in a row link) | Grey |
| Free venue shortlist offer (FreeVenueShortlistOffer, inline variant) | Starts the free Sai venue shortlist | button (custom component) | Terracotta |
| Free venue shortlist offer (FreeVenueShortlistOffer, card variant) | Starts the free Sai venue shortlist | button (custom component) | Terracotta |

### Hero / top grid

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Watch alert row, phone branch ('Guard' / 'Secretary' + alert copy, ×up to 4) | Opens that alert in the inspector | clickable element (InspectorTrigger row, no href) | Grey |
| Watch alert row, laptop branch ('Guard' / 'Secretary' + alert copy, ×up to 4) | Opens that alert in the inspector | clickable element (InspectorTrigger row, no href) | Grey |
| Setnayan AI · The Watch · {N} (details summary) | Expands or collapses the watch list on phone | clickable element (details summary) | Grey |
| Open the decision / Open the list ↗ | Scrolls to the decisions section | text link (in-page anchor) | link — stays a link |
| {N} guest(s) haven't replied yet → | Opens the guest list | text link (row link) | link — stays a link |
| Guests mini tile ('Open the roster →') | Opens the guest list | text link (whole-card link) | link — stays a link |
| Budget mini tile ('Open budget & payments →') | Opens budget | text link (whole-card link) | link — stays a link |
| Schedule · next mini tile ('Full program →') | Opens schedule | text link (whole-card link) | link — stays a link |
| Papic mini tile ('Open Papic →') | Opens Papic studio | text link (whole-card link) | link — stays a link |
| Messages mini tile ('Open threads →') | Opens messages | text link (whole-card link) | link — stays a link |

### Today's one thing / checklist / Meanwhile

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Today's one thing CTA, dynamic (e.g. 'Browse venues') | Goes to the top-priority task | button (filled pill link) | Terracotta |
| View your full checklist → | Opens the planning checklist | text link | link — stays a link |
| Meanwhile row ('Look →' / 'Open →' / 'Read →') | Opens the supplier's delivery workspace | text link (row link) | link — stays a link |

### Around your event

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Hosts card (ExpandCard; expand + 'Set access in People with access') | Expands list; links to access settings | clickable element (custom ExpandCard) | Grey |
| Suppliers card (ExpandCard; expand + 'Manage suppliers') | Expands list; links to suppliers | clickable element (custom ExpandCard) | Grey |
| Your services card (ExpandCard; expand + 'Open orders') | Expands list; links to orders | clickable element (custom ExpandCard) | Grey |
| Schedule card (ExpandCard; expand + 'See full schedule') | Expands timeline; links to schedule | clickable element (custom ExpandCard) | Grey |
| Open threads → (Conversations card) | Opens messages | text link | link — stays a link |
| See all recent activity → | Opens the activity feed | text link | link — stays a link |


## apps/web/app/dashboard/[eventId]/seating/_components/seating-editor.tsx (lines 1-4500)

Note: lines 1-4500 are almost all state, handlers and canvas maths; the JSX of the editor (canvas, toolbars, tables, seats) is in 4501-end, owned by the other reader. Only the pieces below are pressable in this range.

### SeatingEditor — groupVerbs (shared by People pane and Details guests part)

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| (armchair icon; tooltip "Seat this whole group at a table", aria "Seat [group] at a table" / "Cancel seating [group]") | Picks group, then tap a table to seat it | icon-only | Terracotta |
| (eye / eye-off icon; aria "Hide colour on canvas" / "Show colour on canvas") | Toggles group colour on the canvas | icon-only | Grey |

### SeatingEditor — peoplePane

| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Only show unseated | Filters People list to unseated guests | clickable element (checkbox) | Grey |
| [Group name] [count] with chevron (group header row) | Expands or collapses the group's members | clickable element (bare row button, no pill) | Grey |

## apps/web/app/dashboard/[eventId]/seating/_components/seating-editor.tsx (lines 4501-9010)

### peoplePane — member groups
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Group row (colour dot, group name, count, chevron) | Expands or collapses the group's member list | clickable element | Grey |

### tablesPane
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| + Table | Opens the new-table form | button | Terracotta |
| Table row (dot, name, seats, Filled/Open badge) | Highlights table, or seats picked group | clickable element | Grey |
| Delete [table name] (trash, hover only) | Opens delete-table confirmation | icon-only | Red |

### rulesPane
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Move [tier] up (chevron up) | Moves priority tier higher | icon-only | Grey |
| Move [tier] down (chevron down) | Moves priority tier lower | icon-only | Grey |
| Remove keep-apart rule (minus) | Deletes a keep-apart rule | icon-only | Red |
| Relax the lowest-priority rule | Drops lowest rule to clear a conflict | button | Amber |

### KeepApartAdder
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Guest… (first guest dropdown) | Picks first guest for rule | clickable element | Grey |
| Guest… (second guest dropdown) | Picks second guest for rule | clickable element | Grey |
| + Add | Saves the keep-apart pair | button | Terracotta |

### panelTabs
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| People / Tables / Rules (tabs with count badge) ×3 | Switches the side panel pane | clickable element | Grey |

### addMenuBody (menu rows, shared by Add menu and More sheet)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| New table… | Opens new-table form | clickable element | Terracotta |
| Entrance | Adds entrance marker to floor | clickable element | Terracotta |
| Service door | Adds service door marker | clickable element | Terracotta |
| Dance floor | Adds dance floor zone | clickable element | Terracotta |
| Cocktail area | Adds a second cocktail room | clickable element | Terracotta |
| Sign (n/24) | Adds a wayfinding sign | clickable element | Terracotta |
| Supplier booth | Adds a supplier booth | clickable element | Terracotta |

### arrangeMenuBody
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Auto-seating On/Off | Toggles automatic seating policy | clickable element | Grey |
| Keep groups together On/Off | Toggles group-adjacency policy | clickable element | Grey |
| Tight / Service / Comfort (walkway presets) ×3 | Sets walkway width preset | clickable element | Grey |
| − (Narrower walkway) | Narrows walkway by 0.1 m | icon-only | Grey |
| + (Wider walkway) | Widens walkway by 0.1 m | icon-only | Grey |
| Room size & scale… | Opens room size panel | clickable element | Grey |
| Seating Priority & Guide | Opens the priority and rules pane | clickable element | Grey |

### shareMenuBody
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| In your colours | Downloads coloured seat-plan export | clickable element | Grey |
| Blueprint | Downloads line-drawing seat-plan export | clickable element | Grey |
| Caterer meal counts | Opens meal counts to print or CSV | clickable element | Grey |
| Own table only | Guests see only own table photos | clickable element | Grey |
| All guests | Guests see all guest photos | clickable element | Grey |
| No photos | Hides guest photos in 3D walk | clickable element | Grey |
| Walkthrough videos | Goes to walkthrough videos page | text link | link — stays a link |
| Publish & print | Freezes snapshot, prints signs and cards | clickable element | Terracotta |

### dock helpers (desktop verb row)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Remove a chair (minus) | Removes one empty chair | icon-only | Red |
| Restore a chair (plus) | Restores a removed chair | icon-only | Terracotta |
| Rotate N° left (hold to repeat) | Rotates table counter-clockwise | icon-only | Grey |
| N° (angle readout) | Lets you type an exact angle | text link | Grey |
| Rotate N° right (hold to repeat) | Rotates table clockwise | icon-only | Grey |
| More table options (three dots) | Opens table overflow menu | icon-only | Grey |
| Change shape… | Opens the shape picker | clickable element | Grey |
| Edit chairs… | Enters chair-edit mode | clickable element | Grey |
| Rotate 180° | Turns table half a turn | clickable element | Grey |
| Break apart | Unlinks table from its group | clickable element | Red |

### Context dock — view-only
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Edit / Take over | Acquires the editor lock | button | Grey |
| Done (X) | Clears the selection | icon-only | Green |

### Context dock — picked guest / picked group
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Unseat | Removes picked guest from their seat | button | Red |
| Cancel (X) ×2 | Drops the picked guest or group | icon-only | Red |

### Context dock — selected table (desktop and phone)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Table type ▾ (phone) | Changes the table type | clickable element | Grey |
| Seat people | Opens the seat-people panel | button | Terracotta |
| Done (edit-chairs banner) | Leaves chair-edit mode | button | Green |
| Undo seat N (inline in banner) | Restores the just-removed chair | text link | Amber |
| Seat N removed · Undo | Restores the just-removed chair | button | Amber |
| Rotate (phone) | Rotates table 90° | button | Grey |
| Edit chairs… (phone) | Enters chair-edit mode | button | Grey |
| Unlink (phone) | Unlinks table from its group | button | Red |
| Link… (phone) | Starts joining to another table | button | Terracotta |
| Done (phone) | Closes the table sheet | button | Green |
| Delete this table (phone) | Opens delete-table confirmation | text link | Red |
| Delete table (trash, desktop) | Opens delete-table confirmation | icon-only | Red |
| Done (X, desktop) | Clears the selection | icon-only | Green |

### Context dock — selected marker (booth, entrance, cocktail, dance, service, sign, stage)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Remove ×6 | Removes the selected marker | button | Red |
| Done ×7 | Closes the marker editor | button | Green |
| Door / Walk-through (entrance style) ×2 | Switches entrance style | clickable element | Grey |
| Decrease depth (minus) | Shortens walk-through depth | icon-only | Grey |
| Increase depth (plus) | Deepens walk-through depth | icon-only | Grey |
| With entrance / Separate (cocktail placement) ×2 | Links or separates the cocktail room | clickable element | Grey |
| Rotate 45° left | Turns sign anticlockwise | icon-only | Grey |
| Rotate 45° right | Turns sign clockwise | icon-only | Grey |

### Context dock — notice
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Undo (Auto Arrange result) | Undoes the last Auto Arrange | button | Amber |
| Dismiss (X) ×2 | Dismisses the notice toast | icon-only | Grey |

### Door strip (Details)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Show guests their seats early (switch) | Opens or hides seats for guests | clickable element | Grey |

### placeList (left navigator in Details)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Table / element rows (name, sub-label) | Picks that object on the plan | clickable element | Grey |
| Guests' map | Opens the guests' map panel | clickable element | Grey |

### back-link and seat-at menu (right part)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| ‹ Guests ×3 | Returns to guest list | text link | Grey |
| Seat at… ▾ | Seats an unseated guest at a table | clickable element | Terracotta |

### tableGuests (right part, picked table)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Unseat | Removes guest from their seat | text link | Red |
| Empty seat (dashed row) | Seats next or picked guest here | clickable element | Terracotta |
| + Seat next unseated | Seats next unseated guest at table | button | Terracotta |
| All guests | Clears selection, shows all guests | text link | Grey |

### guestsNode (right part)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Only unseated (checkbox) | Filters list to unseated guests | clickable element | Grey |

### Phone head (trailing and rules slot)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Seating priority & who sits apart › | Opens the priority and rules pane | text link | Grey |
| Edit / Take over / Opening… | Acquires the editor lock | button | Grey |
| Save status chip (phone) | Saves the seat plan | clickable element | Green |

### Command bar (desktop)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| N to seat | Filters people to the unseated | clickable element | Grey |
| Edit / Take over (beside Viewing only) | Acquires the editor lock | button | Grey |
| N notices | Expands the collapsed notices | clickable element | Amber |
| Add ▾ | Opens the add-things menu | button | Terracotta |
| Arrange ▾ | Opens the arrange policies menu | button | Grey |
| Share & print ▾ | Opens the share and print menu | button | Grey |
| More (three dots, below lg) | Opens the combined overflow menu | button | Grey |
| Save status chip (command bar) | Saves the seat plan | clickable element | Green |
| Auto Arrange | Opens the Auto Arrange confirmation | button | Terracotta |
| More auto-layout options (caret) | Opens the auto-layout menu | icon-only | Grey |
| Build my seating draft | Lays out the whole floor | clickable element | Terracotta |
| Fill around N locked | Re-seats others around locked seats | clickable element | Terracotta |

### Banner slot
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Dismiss (X) | Dismisses the displaced notice | icon-only | Grey |

### Room size and scale panel
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Close room size (X) | Closes the room-size panel | icon-only | Grey |
| Show room to scale (checkbox) | Turns to-scale room display on | clickable element | Grey |
| Pick a common size ▾ | Sets room to a preset size | clickable element | Grey |

### Canvas — floor markers (clickable elements on the plan)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Dance floor zone | Selects it; drag to move | clickable element | Grey |
| Resize dance floor (grip) | Drags to resize dance floor | icon-only | Grey |
| Cocktail area label chip | Selects it; drag to move | clickable element | Grey |
| Resize cocktail area (grip) | Drags to resize cocktail area | icon-only | Grey |
| Stage | Selects it; drag to move | clickable element | Grey |
| Resize stage (grip) | Drags to resize stage | icon-only | Grey |
| Entrance / Walk-through | Selects it; drag to move | clickable element | Grey |
| Service | Selects service door; drag to move | clickable element | Grey |
| Booth marker (label or Pick type) | Selects booth; drag along walls | clickable element | Grey |
| Sign marker | Selects sign; drag to move | clickable element | Grey |

### Canvas — empty-floor starter card
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| 1 Set room size | Opens room size panel | clickable element | Terracotta |
| 2 Add your first table | Opens new-table form | clickable element | Terracotta |
| 3 Build my seating draft | Lays out the whole floor | clickable element | Terracotta |

### Canvas — tables and chairs
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Table hub (number and count) | Selects table; drag to move | clickable element | Grey |
| Seated guest on a chair | Picks guest, or seats picked one | clickable element | Grey |
| Empty seat N (chair slot) | Seats picked guest in this chair | clickable element | Terracotta |
| Restore seat N (plus ghost, edit-chairs) | Brings a removed chair back | icon-only | Terracotta |
| Delete seat N (X, edit-chairs) | Removes this empty chair | icon-only | Red |

### Canvas — chrome
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Room size & scale (scale bar) | Opens room size panel | clickable element | Grey |
| Fit all tables in view | Fits the whole room in view | icon-only | Grey |
| Zoom in | Zooms the plan in | icon-only | Grey |
| Zoom out | Zooms the plan out | icon-only | Grey |
| Drag to change room width / length / resize (grips) ×3 | Drags room walls to resize | icon-only | Grey |
| Rotate table handle | Drags in circle to rotate table | icon-only | Grey |

### List view
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Table card header (name, n/cap, chevron) | Expands or collapses the table card | clickable element | Grey |
| Delete [table name] (trash) | Opens delete-table confirmation | icon-only | Red |
| Seated avatar | Picks that guest to move | icon-only | Grey |
| Seat here | Seats picked guest at this table | button | Terracotta |
| Seat group here | Seats picked group at this table | button | Terracotta |
| Lock / Unlock seat (padlock) | Locks seat against Fill around locked | icon-only | Grey |
| Unseat | Removes guest from their seat | button | Red |

### Mobile bottom drawer
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| N to seat · N tables (drawer handle) | Opens or resizes the panel drawer | clickable element | Grey |

### Auto Arrange confirm dialog
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Cancel | Closes the dialog | button | Red |
| Auto Arrange | Runs Auto Arrange | button | Terracotta |

### Fill-around-locked confirm dialog
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Cancel | Closes the dialog | button | Red |
| Fill the rest | Re-seats everyone around locked seats | button | Terracotta |

### Delete-table confirm dialog
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Cancel | Closes the dialog | button | Red |
| Delete table / Delete unit | Deletes table, unseats its guests | button | Red |

### MemberRow (guest row, used in People pane and Details)
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Guest name row (avatar, name, table badge) | Picks guest to seat or move | clickable element | Grey |
| P1 to P4 (priority chip) | Cycles the guest's seating priority | clickable element | Grey |

### SeatPeoplePanel
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Guest / Group / Role (segmented) ×3 | Switches the seat-people grain | clickable element | Grey |
| Guest row (avatar, name, here/unseated) | Seats guest at next open chair | clickable element | Terracotta |
| Unseat (person-minus icon) | Removes guest from this table | icon-only | Red |
| Group row (dot, name, count) | Seats whole group at this table | clickable element | Terracotta |
| Role tier row (1 to 4, label, n unseated) ×4 | Seats that tier's guests here | clickable element | Terracotta |

### AddTablePanel
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| Cancel | Closes the new-table form | text link | Red |
| + Add table | Creates the table | button | Terracotta |

### BoothPickerPanel
| Label (as the user sees it) | What it does (≤ 8 words) | Today: button / text link / icon-only / clickable element | Colour |
|---|---|---|---|
| lock a supplier in the Marketplace | Goes to the dashboard vendors page | text link | link — stays a link |
| Booked supplier row (name, category) | Places that supplier at the booth | clickable element | Terracotta |
| Station row (Photo booth, Mobile bar, etc.) | Sets the booth's station type | clickable element | Terracotta |


---
## TOTALS

Controls counted: 1588; text links or bare icons or clickable elements that must become buttons: 693; unsure (?): 12.

Per-chunk: 
TOTALS chunk1: controls=109 bare-or-textlink=45 unsure=3
TOTALS chunk11: controls=128 bare-or-textlink=41 unsure=0
TOTALS chunk12b: controls=178 bare-or-textlink=131 unsure=0
TOTALS chunk10: controls=133 bare-or-textlink=58 unsure=0
TOTALS chunk2: controls=210 bare-or-textlink=73 unsure=0
TOTALS chunk4: controls=129 bare-or-textlink=54 unsure=0
TOTALS chunk12a: controls=4 bare-or-textlink=4 unsure=0
TOTALS chunk6: controls=109 bare-or-textlink=49 unsure=2
TOTALS chunk13: controls=27 bare-or-textlink=13 unsure=1
TOTALS chunk8: controls=150 bare-or-textlink=53 unsure=4
TOTALS chunk3: controls=121 bare-or-textlink=46 unsure=0
TOTALS chunk5: controls=33 bare-or-textlink=13 unsure=1
TOTALS chunk7: controls=153 bare-or-textlink=82 unsure=1
TOTALS chunk9: controls=104 bare-or-textlink=31 unsure=0
