# Button inventory 5 — admin, signup, login, onboarding, live (origin/main archive)

Rule applied: owner 2026-10-07 (every control = coloured pill, one colour per meaning). Rows are in source order per file. "Today" = how the control is drawn now.

## admin/_apple-secret-reminder.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Dismiss reminder) | Hides the Apple-secret reminder | icon-only | Grey |
| Copy prompt / Copied | Copies the renewal prompt | button | Grey |

## admin/_components/admin-command-palette.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (click-away backdrop) | Closes the palette when tapped outside | clickable element | Grey |
| Back | Returns to the search list | button | Grey |
| Open the page / Prepare the form | Goes to the page or pre-fills a form | button | Terracotta |
| {job} — fill in a form / open the page | Starts the suggested admin job | button | Terracotta |
| {suggested page} — {why} | Opens the suggested admin page | button | Grey |
| Walk me through “{query}” | Asks Setnayan where this lives | button | Blue |
| {remembered page} — {why} | Opens the remembered admin page | button | Grey |
| Ask Setnayan where this lives | Asks Setnayan where this lives | button | Blue |
| {page name} ({group}) | Jumps to that admin page | button | Grey |
| {search result title} | Opens that search result | button | Grey |

## admin/_components/admin-rail-context.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {menu label} + caption + count badge | Opens that admin section | text link | link — stays a link |

## admin/_components/admin-search-box.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Search or ask — “papic prices”, “add a category” ⌘K | Opens the admin command palette | button | Grey |

## admin/_components/mobile-landing-grid.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {item label} {description} {count} | Opens that admin section | text link | link — stays a link |

## admin/_components/what-you-change.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} {note} | Goes to the page | text link | link — stays a link |

## admin/_email-delivery-strip.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {headline} {detail} | Goes to the page | text link | link — stays a link |

## admin/_overview-tile.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Inner} | Goes to the page | text link | link — stays a link |

## admin/account-deletions/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Approve + delete | Removes / reverses / stops something | button | Red |
| Approve + blacklist | Removes / reverses / stops something | button | Red |
| Reject (keep account) | Removes / reverses / stops something | button | Red |
| Run erasure again | Re-runs / reverses / flags for attention | button | Amber |

## admin/accounts/_surfaces/demo-vendors-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Demo inquiries — read & respond as the supplier → | Goes to the page | text link | link — stays a link |
| /explore?demo=1 | Goes to the page | text link | link — stays a link |
| Photography | Goes to the page | text link | link — stays a link |
| Catering | Goes to the page | text link | link — stays a link |
| Coordinators | Goes to the page | text link | link — stays a link |

## admin/accounts/_surfaces/events-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |
| {display_name} | Goes to the page | text link | link — stays a link |
| Face mode: On / Off / Auto (shows current state) | Cycles the Papic face-scan mode | button | ? (label is the current state, not a verb) |
| Delete | Hard-deletes the event | button | Red |

## admin/accounts/_surfaces/users-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |
| {email} | Goes to the page | text link | link — stays a link |
| Add to pool / Remove from pool | Adds/removes user from the team pool | button | Terracotta (add) · Red (remove) |
| Confirm email | Force-confirms the user's email | button | Green |
| Reset password | Generates a temporary password | button | Terracotta |
| Danger zone | Expands / collapses a section | clickable element | Grey |
| Force sign-out | Removes / reverses / stops something | button | Red |
| Delete | Deletes it | button | Red |
| Blacklist | Removes / reverses / stops something | button | Red |
| Comp grants | Expands the comp-grants list | button | Grey |
| Unblacklist | Re-runs / reverses / flags for attention | button | Amber |
| Issue comp grant | Issues a free comp grant | button | Terracotta |
| Revoke | Revokes it | button | Red |

## admin/accounts/_surfaces/vendor-card-title.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {name} | Goes to the page | text link | link — stays a link |

## admin/accounts/_surfaces/vendors-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open | Opens the supplier claim page | text link | link — stays a link |
| Claim link | Expands / collapses a section | clickable element | Grey |
| Edit | Neutral view / manage action | text link | Grey |
| Revoke | Revokes it | button | Red |
| Apply | Applies the filters | button | Grey |
| Set plan | Moves forward | text link | Terracotta |
| Team & roles | Goes to the page | text link | link — stays a link |

## admin/accounts/_surfaces/venues-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add venue | Opens the add-venue form | text link | Terracotta |
| {label} — / N | Goes to the page | text link | link — stays a link |
| Apply filters | Applies the filters | button | Grey |
| Clear | Clears the filters | button | Grey |
| {name} | Goes to the page | text link | link — stays a link |
| Edit → | Goes to the page | text link | link — stays a link |

## admin/accounts/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |

## admin/app-performance/_components/action-center.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} N {todo} {word} · oldest {slice} | Goes to the page | text link | link — stays a link |

## admin/app-performance/_components/expenses.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Log expense | Adds an expense entry | button | Terracotta |
| View receipt | Opens the receipt file | button | Grey |
| Attach | Attaches the receipt to the expense | button | Terracotta |

## admin/app-performance/_components/funnel-vendor-picker.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Show funnel | Neutral view / manage action | button | Grey |

## admin/app-performance/_surfaces/funnels-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |
| Open in PostHog | Opens PostHog in a new tab | text link | link — stays a link |

## admin/app-performance/_surfaces/growth-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |
| Export CSV | Downloads the growth data as CSV | button | Grey |

## admin/app-performance/_surfaces/intelligence-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |

## admin/app-performance/_surfaces/overview-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |

## admin/app-performance/_surfaces/problems-list.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {line} came back × N | Expands / collapses a section | clickable element | Grey |
| {line} | Expands / collapses a section | clickable element | Grey |
| Recently closed ( {length} ) | Expands / collapses a section | clickable element | Grey |

## admin/app-performance/_surfaces/seo-rerun-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Re-run audit now | Re-runs the SEO audit now | button | Amber |

## admin/app-performance/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |

## admin/approvals/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Submit for two-admin approval | Submits the action for second-admin approval | button | Terracotta |
| ✓ Approve & execute | Commits / confirms | button | Green |
| Reject | Rejects it | button | Red |

## admin/background-videos/background-videos-manager.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Publish / Publishing… | Publishes the background video | button | Terracotta |
| Unpublish / Unpublishing… | Takes the video off the site | button | Red |

## admin/booking-fees/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Check their payment | Goes to the page | text link | link — stays a link |

## admin/budget-planner/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save settings | Saves the changes | button | Green |
| Save ×2 | Saves the changes | button | Green |

## admin/categories/_components/add-rows.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save ×3 | Saves the changes | button | Green |
| Cancel ×3 | Cancels and closes | text link | Red |
| Add “{name}” as a search word on {category} instead | Adds as a search word instead | button | Terracotta |

## admin/categories/_components/ask-prefill.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Create category | Creates the prepared category | button | Terracotta |
| Discard ×2 | Discards the draft | button | Red |
| Add service | Adds the prepared service | button | Terracotta |

## admin/categories/_components/category-panels.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save ×5 | Saves the changes | button | Green |
| Turn last-minute off | Switches last-minute booking off | button | Red |
| {label} · N | Goes to the page | text link | link — stays a link |
| Add ×3 | Adds a new item | button | Terracotta |
| {en} {get} · asked for {askedFor}× | Goes to the page | text link | link — stays a link |
| Remove | Removes this item | button | Red |
| Approve | Approves it | button | Green |
| Reject | Rejects it | button | Red |

## admin/categories/_components/event-type-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save ×6 | Saves the changes | button | Green |
| Preview the flow | Goes to the page | text link | link — stays a link |

## admin/categories/_components/in-place.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Delete {label} | Deletes after a confirm prompt | button | Red |
| Combine | Combines the two entries into one | button | Terracotta |

## admin/categories/_components/list-pane.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {service} — File under ▸ | Opens the service to file it | text link | link — stays a link |
| “ {phrase} ” → {en} ⏳ | Goes to the page | text link | link — stays a link |
| “ {proposedLabel} ” · {supplierName} {suggestedTileLabel} | Goes to the page | text link | link — stays a link |
| {label} {plural} | Goes to the page | text link | link — stays a link |
| {label} Hidden {eventLabel[c.eventTypes[0]!] ?} only / {formatCount} event types {plural} | Goes to the page | text link | link — stays a link |
| {en} asked for {askedFor} × | Goes to the page | text link | link — stays a link |
| “ {proposedLabel} ” from {supplierName} request | Goes to the page | text link | link — stays a link |
| {emoji} {label} {EVENT_TYPE_STATUS_LABEL[word]} — / all categories / {formatCount} of {formatCount} | Goes to the page | text link | link — stays a link |
| {label} Deactivated civil {plural} / — · {LAUNCH_STATUS_LABEL[r.launch.s} | Goes to the page | text link | link — stays a link |
| Mixed-faith couples What to expect | Goes to the page | text link | link — stays a link |

## admin/categories/_components/onboarding-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Move up) | Moves the question up | icon-only | Grey |
| (Move down) | Moves the question down | icon-only | Grey |
| Remove | Removes this item | button | Red |
| + Add option | Adds a new item | button | Terracotta |
| Remove option | Removes this item | button | Red |
| + Add question | Adds a new item | button | Terracotta |
| {trim} {length} cats · {length} services | Expands / collapses a section | clickable element | Grey |
| Save onboarding content | Saves the changes | button | Green |
| Reset to default content | Discards edits, restores default content | button | Red |

## admin/categories/_components/picture-and-icon.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save photo | Saves the changes | button | Green |
| Clear photo | Clears the saved photo | button | Red |

## admin/categories/_components/prepared-job-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {verb} (e.g. Create category / Add service) | Applies the prepared admin job | button | Terracotta |
| Discard | Discards the draft | button | Red |

## admin/categories/_components/religion-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save ×2 | Saves the changes | button | Green |
| Load starter content to edit it | Loads starter content to edit | button | Terracotta |
| Reset every religion to the latest starter content… | Expands / collapses a section | clickable element | Grey |
| Reset all — discards every edit | Discards every edit, resets all | button | Red |
| Save / Add item | Saves the changes | button | Green |
| Remove | Removes this item | button | Red |

## admin/categories/_components/request-controls.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Approve as new | Approves the request as a new category | button | Green |
| Reject | Rejects it | button | Red |

## admin/categories/_components/ui.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {title} ▾ | Expands / collapses a section | clickable element | Grey |
| (On/Off switch) | Flips this setting on or off | icon-only | Grey |

## admin/categories/_components/what-couples-choose.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Dismiss) | Hides the flash message | icon-only | Grey |
| {choice name} (row) | Expands/collapses the choice row | button | Grey |
| (Move up) | Neutral view / manage action | icon-only | Grey |
| (Move down) | Neutral view / manage action | icon-only | Grey |
| (Expand / Collapse) | Expands or collapses the card | icon-only | Grey |
| Save card | Saves the changes | button | Green |
| (Move option up) | Neutral view / manage action | icon-only | Grey |
| (Move option down) | Neutral view / manage action | icon-only | Grey |
| Save | Saves the changes | button | Green |
| Delete option | Deletes it | button | Red |
| Add option | Adds a new item | button | Terracotta |

## admin/categories/_components/what-suppliers-fill-in.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |
| (Cancel rename) | Cancels renaming the field | icon-only | Grey |
| (Rename field) | Starts renaming the field label | icon-only | Grey |
| Restore / Retire | Restores or retires the field | button | Amber (restore) · Red (retire) |
| (Retire option / Restore option) | Retires or restores this option | button | Red (retire) · Amber (restore) |
| Add ×2 | Adds a new item | button | Terracotta |
| (Cancel add option) | Cancels adding an option | icon-only | Grey |
| + Option | Opens the add-option form | button | Terracotta |

## admin/categories/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| + Add | Opens the add form | text link | Terracotta |
| ‹ {LIST_LABEL[state.list]} | Goes to the page | text link | link — stays a link |

## admin/chat-flags/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} · {formatCount} | Goes to the page | text link | link — stays a link |
| Mark reviewed | Marks the flag reviewed | button | Green |
| Dismiss | Dismisses it | button | Grey |

## admin/completions/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Force-complete | Expands / collapses a section | clickable element | Grey |
| Mark as delivered | Marks the order as delivered | button | Green |
| Uphold non-delivery | Expands / collapses a section | clickable element | Grey |
| Keep review closed | Keeps the review closed | button | Green |

## admin/compliance/_components/compliance-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add row | Adds a table row | button | Terracotta |
| Remove | Removes this item | button | Red |
| Save compliance facts | Saves the changes | button | Green |
| Export NPC data sheet | Opens the NPC data sheet to export | text link | Grey |

## admin/compliance/data-sheet/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Compliance | Goes to the page | text link | link — stays a link |

## admin/concierge-abuse/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Pending review ( — / {length} ) | Goes to the page | text link | link — stays a link |
| Enforcement decisions ( — / {length} ) | Goes to the page | text link | link — stays a link |
| Clear (false positive) | Clears the flag as a false positive | button | Green |
| Confirm abuse (+1 strike) | Confirms abuse, adds a strike | button | Green |
| Lift enforcement (−1 strike) | Lifts enforcement, removes a strike | button | Amber |

## admin/connection-logs/connection-logs-client.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Active issues {count} | Switches to the active-issues tab | button | Grey |
| Resolved archive {count} | Switches to the resolved tab | button | Grey |
| Archive all active / Archive all {filter} | Archives every active fault listed | button | Grey |
| {filter name} | Filters faults by kind | button | Grey |
| {fault type} — {element name} | Opens the fault detail | button | Grey |
| Ignore | Archives without marking resolved | button | Grey |
| Resolve | Marks the fault resolved | button | Green |
| (click-away backdrop) | Closes the fault detail | clickable element | Grey |
| (Close) | Neutral view / manage action | icon-only | Grey |

## admin/corrections/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |
| Apply to profile | Applies the correction to the profile | button | Terracotta |
| Decline | Declines it | button | Red |
| Correct a shop’s web address | Expands the address-fix form | clickable element | Grey |
| Move the address | Moves the shop to the new address | button | Terracotta |

## admin/custom-plans/_components/custom-composer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Unit prices for this quote — Hide / Override… | Shows/hides unit-price overrides | button | Grey |
| None / ₱ off / % off | Picks the discount type | button | Grey |
| {channel} | Picks how the quote is sent | button | Grey |
| Send quote — ₱{amount} / 28 days | Sends the quote to the supplier | button | Blue |
| Mark active (comp / settled off-platform) | Marks the plan active, no payment | button | Green |

## admin/data-privacy/_components/control-actions.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Restore (set off) | Restores the control to off | button | Amber |
| Approve · activate | Approves and activates the control | button | Green |
| Turn off | Turns the control off | button | Red |
| Block | Blocks the control | button | Red |
| Retire | Retires the control | button | Red |

## admin/data-privacy/_components/npc-checklist.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {key} · {title} | Goes to the page | text link | link — stays a link |
| Related privacy control | Goes to the page | text link | link — stays a link |

## admin/data-privacy/_components/task-actions.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {task status} (e.g. In progress / Resolved) | Sets the NPC task status | button | ? (label changes per status) |
| Mark N/A | Marks the task not applicable | button | Grey |

## admin/data-privacy/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |
| {packet title} — Download | Downloads the merged PDF packet | text link | Grey |
| {document title} — Download | Downloads that document | text link | Grey |

## admin/demand/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Run now | Runs the demand job now | button | Terracotta |

## admin/demo-vendors/_components/demo-vendor-actions.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Confirm delete | Confirms and deletes the batch | button | Red |
| Cancel ×4 | Cancels and closes | button | Red |
| Cleanup batch | Opens delete-batch confirmation | button | Red |
| Confirm: delete existing + create (~{n}/category) | Confirms and creates demo suppliers | button | Green |
| Confirm: delete all | Confirms and deletes all demo suppliers | button | Red |
| Confirm: cleanup + regenerate | Confirms cleanup and regenerate | button | Green |
| Create demo suppliers | Opens create-demo-suppliers confirmation | button | Terracotta |
| Cleanup ALL Demo Suppliers | Opens delete-all confirmation | button | Red |
| Regenerate (cleanup + show seed command) | Opens cleanup + regenerate confirmation | button | Amber |

## admin/demo-vendors/inquiries/[threadId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Demo inquiries ×2 | Goes to the page | text link | link — stays a link |
| Send | Sends the reply as the demo supplier | button | Blue |
| Accept inquiry | Accepts the demo inquiry | button | Green |
| Decline | Declines the demo inquiry | button | Red |

## admin/demo-vendors/inquiries/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {business_name} | Goes to the page | text link | link — stays a link |

## admin/discount-codes/[id]/edit/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All codes | Goes to the page | text link | link — stays a link |

## admin/discount-codes/_components/eligibility-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove | Removes this item | button | Red |
| Add | Adds the user to the code | button | Terracotta |
| Browse users → | Goes to the page | text link | link — stays a link |

## admin/discount-codes/_components/voucher-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Create code / Save changes} | Creates or saves the discount code | button | Terracotta (create) · Green (save) |
| Cancel | Cancels and closes | text link | Red |

## admin/discount-codes/new/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All codes | Goes to the page | text link | link — stays a link |

## admin/disputes/_components/deposit-disputes-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| The payment stands | Rules the payment stands | button | Green |
| It did not arrive | Rules it did not arrive | button | Red |

## admin/disputes/_components/payment-disputes-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| receipt | Opens the receipt | text link | link — stays a link |
| The payment stands | Rules the payment stands | button | Green |
| It did not arrive | Rules it did not arrive | button | Red |

## admin/disputes/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |
| Supplier’s response | Expands / collapses a section | clickable element | Grey |
| Reservation policy evidence ( {length} ) | Expands / collapses a section | clickable element | Grey |
| Delivery handover ( {length} ) | Expands / collapses a section | clickable element | Grey |
| Resolve | Expands / collapses a section | clickable element | Grey |
| Apply resolution | Applies the dispute resolution | button | Terracotta |
| open link | Opens the handover link | text link | link — stays a link |

## admin/editorial-review/[editorialId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Unlock for couple — all red flags resolved | Unlocks the editorial for the couple | button | Terracotta |
| Re-scan editorial | Re-scans the editorial | button | Amber |
| Mark OK — no change | Marks it OK with no change | button | Green |
| Save rewrite | Saves the rewrite | button | Green |

## admin/editorial-review/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {display_name} {formatCalendarDate} / No date · Scanned N / not yet {length} red {length} grammar {label} → | Goes to the page | text link | link — stays a link |

## admin/error.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Try again | Retries loading the page | button | Amber |
| Back to Overview | Goes to the page | text link | link — stays a link |

## admin/event-deletions/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove it for good | Approves permanent removal of the event | button | Red |
| Keep it, and tell them why | Keeps the event, sends the reason | button | Grey |

## admin/events/[eventId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Events | Goes to the page | text link | link — stays a link |
| {null} | Goes to the page | text link | link — stays a link |
| Reopen guest list | Reopens the guest list | button | Amber |
| Turn on / Turn off | Switches Papic face mode on/off | button | Terracotta (on) · Red (off) |

## admin/force-majeure/[flagId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to queue | Goes to the page | text link | link — stays a link |
| {couple name / email} | Opens an email to the couple | text link | link — stays a link |
| file {n} | Opens the attached file | text link | link — stays a link |
| Take ownership | Takes ownership of the flag | button | Terracotta |
| {status} open | Opens the status-change form | clickable element | Grey |
| Apply {status} | Applies the chosen status | button | Terracotta |

## admin/force-majeure/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |
| {public_id} | Goes to the page | text link | link — stays a link |

## admin/founder-seats/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Grant seat | Grants a founder seat | button | Green |
| Revoke | Revokes the founder seat | button | Red |

## admin/fraud/_components/wipe-ban-dialog.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Confirm fraud → wipe + ban | Opens the wipe + ban dialog | button | Red |
| (click-away backdrop) | Closes the wipe + ban dialog | clickable element | Grey |
| (Close) | Neutral view / manage action | icon-only | Grey |
| Cancel | Cancels and closes | button | Red |
| Open two-admin wipe + ban request | Opens a two-admin wipe + ban request | button | Red |

## admin/fraud/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Dismiss (false positive) | Dismisses the flag as a false positive | button | Green |
| Un-suspend (keep watching) | Lifts the suspension, keeps watching | button | Amber |

## admin/gifts/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Search | Searches suppliers | button | Grey |
| Comp this supplier | Goes to the page | text link | link — stays a link |
| Cancel ×2 | Cancels and closes | text link | Red |
| Set tier | Sets the supplier tier | button | Terracotta |
| Comp Papic Challenges | Comps Papic Challenges | button | Terracotta |
| End deal | Ends the deal | button | Red |
| Manage | Goes to the page | text link | link — stays a link |
| Create deal | Creates the deal | button | Terracotta |
| End window | Ends the free window | button | Red |
| Create free window | Creates the free window | button | Terracotta |
| Search | Searches users | button | Grey |
| Comp this user | Goes to the page | text link | link — stays a link |
| Issue comp | Issues the comp | button | Terracotta |
| Revoke | Revokes the comp | button | Red |

## admin/help/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {sender email} | Opens a reply email | text link | link — stays a link |
| Update | Saves the message status | button | Green |
| {status label} | Moves to that status view | text link | link — stays a link |

## admin/integrations/_components/maya-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |
| Clear saved keys | Clears the saved Maya keys | button | Red |

## admin/integrations/_components/oauth-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |
| Save this key | Saves the changes | button | Green |
| Clear saved secret | Clears the saved secret | button | Red |

## admin/integrations/_components/secret-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |
| Clear saved key | Clears the saved key | button | Red |

## admin/integrations/_components/test-resend-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| / Send a test email | Sends a test email via Resend | button | Blue |

## admin/integrations/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to admin ×2 | Goes to the page | text link | link — stays a link |
| Save ×2 | Saves the changes | button | Green |
| Clear saved key | Clears the saved key | button | Red |

## admin/integrity-watch/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Rescan label} | Re-scans for integrity issues | button | Amber |
| Reviews · {openReviews} | Goes to the page | text link | link — stays a link |
| Listings · {openListings} | Goes to the page | text link | link — stays a link |
| Inquiries · {openInquiries} | Goes to the page | text link | link — stays a link |
| Prices · {openPrices} | Goes to the page | text link | link — stays a link |
| {label} | Goes to the page | text link | link — stays a link |
| Confirm fraud | Confirms the fraud finding | button | Green |
| Hide listing | Hides the listing | button | Red |
| Confirm under-declaration | Confirms under-declaration | button | Green |
| Confirm attack | Confirms the attack | button | Green |
| Dismiss | Dismisses the finding | button | Grey |
| Open supplier → | Goes to the page | text link | link — stays a link |

## admin/layout.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {overdue} overdue | Goes to the page | text link | link — stays a link |
| {dueSoon} due soon | Goes to the page | text link | link — stays a link |
| Queue counts unavailable | Goes to the page | text link | link — stays a link |

## admin/live-studio-channels/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Connect a Setnayan channel | Starts YouTube channel connection | text link | Terracotta |
| Re-connect | Re-connects the YouTube channel | text link | Amber |
| Connect | Connects the YouTube channel | text link | Terracotta |
| Mark verified / Un-verify | Toggles the channel verified flag | button | Green (verify) · Amber (un-verify) |
| Release | Releases the channel from its event | button | Red |
| Take out of service / Return to service | Toggles the channel in/out of service | button | Red (take out) · Amber (return) |
| Disconnect | Disconnects the channel | button | Red |
| Save ×2 | Saves the changes | button | Green |

## admin/menus/_components/menu-registry-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {scope} · {count} | Switches menu scope | button | Grey |
| (Change icon) | Opens the icon picker | icon-only | Grey |
| Save | Saves the label | button | Green |
| Cancel | Cancels the label edit | button | Red |
| {menu label} ✎ | Starts editing the label | button | Grey |
| (Show / Hide in menu) | Shows or hides the item | icon-only | Grey |
| (Reset to default) | Resets the item to default | icon-only | Red |
| No icon | Removes the icon | button | Grey |
| (Close icon picker) | Neutral view / manage action | icon-only | Grey |
| ({icon name}) | Picks this icon | icon-only | Grey |
| Upload | Uploads a custom icon | button | Terracotta |

## admin/money/_components/ledger-reference-column.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {reference_code} | Goes to the page | text link | link — stays a link |

## admin/money/_components/transactions-ledger.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} — / N | Goes to the page | text link | link — stays a link |
| View | Opens the receipt | text link | link — stays a link |
| Receipts for the tax file | Goes to the page | text link | link — stays a link |

## admin/moodboard-library/_components/color-range-manipulator.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (photo canvas) | Picks the colour at the tapped point | clickable element | Grey |
| Slot {n} | Selects the colour slot | button | Grey |
| Load | Loads the slot colour into the tool | button | Terracotta |
| Clear | Clears the colour slot | button | Red |
| Save sample to slot {n} | Saves the sample to the slot | button | Green |
| Preview with palette / Back to tagging | Toggles palette preview | button | Grey |

## admin/moodboard-library/_components/library-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Dismiss | Hides the error message | button | Grey |
| Generate random prompt | Rolls a random image prompt | button | Terracotta |
| Prompt | Expands / collapses a section | clickable element | Grey |
| Copy prompt to clipboard | Copies the prompt | button | Grey |
| Upload + tag | Uploads the asset and tags it | button | Terracotta |
| {asset label} — {type} | Opens the asset for tagging | button | Grey |
| Save tags | Saves the asset tags | button | Green |
| Publish | Publishes the asset | button | Terracotta |
| Reject… | Opens the reject-reason box | button | Red |
| Retire | Retires the asset | button | Red |
| Delete | Deletes the asset | button | Red |
| Reject with this reason | Rejects the asset with the reason | button | Red |
| Cancel | Closes the reject box | button | Red |
| Preview palette (used in the “Preview with palette“ toggle) | Expands / collapses a section | clickable element | Grey |

## admin/moodboard-library/_components/screen-findings-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Text read off the photo | Expands / collapses a section | clickable element | Grey |

## admin/moodboard-renders/_components/admin-render-grid.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Feature / Unfeature | Features or unfeatures the render | button | Terracotta (feature) · Amber (unfeature) |
| Block reuse / Allow reuse | Blocks or allows reuse of the render | button | Red (block) · Amber (allow) |

## admin/offline/_components/offline-diagnostic.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Refresh | Refreshes the diagnostic status | button | Grey |
| Trigger sync now | Triggers an offline sync now | button | Terracotta |

## admin/operations-hiring/_components/smoke-test-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Send Resend test email | Sends a Resend test email | button | Blue |
| Trigger Sentry test error | Fires a Sentry test error | button | Terracotta |

## admin/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Secrets & Rotation | Goes to the page | text link | link — stays a link |
| Integrations | Goes to the page | text link | link — stays a link |
| {label} oldest {age} · past SLA / · due soon N | Goes to the page | text link | link — stays a link |
| Open the work list | Neutral view / manage action | text link | Grey |
| Platform upgrades | Goes to the page | text link | link — stays a link |
| {label} — / {sub} · oldest {age} · past SLA / · due soon | Goes to the page | text link | link — stays a link |

## admin/pakanta/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Copy-paste brief for Suno | Expands / collapses a section | clickable element | Grey |

## admin/papic-storage/backfill-tiles-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Fill in missing wall-size copies | Builds missing wall-size photo copies | button | Terracotta |

## admin/payment-options/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Preview as couple | Opens the couple-view payment sheet | button | Grey |
| Approve | Approves the payment option | button | Green |
| Hold | Puts the option on hold | button | Amber |
| Remove | Removes the payment option | button | Red |

## admin/payments/_components/batch-approve-controls.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Approve {n} selected clean match(es) | Approves all selected matches | button | Green |

## admin/payments/_components/inbox-matcher.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Clear | Clears the pasted text | button | Grey |
| {payment label} · ref · amount · match type | Jumps to the matching payment | text link | link — stays a link |

## admin/payments/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Search | Searches payments | button | Grey |
| Clear | Neutral view / manage action | text link | Grey |
| {label} ×2 | Goes to the page | text link | link — stays a link |
| Confirm quote · move to awaiting payment | Confirms the quote, awaits payment | button | Green |
| One-click approve · clean match | Approves a clean-match payment | button | Green |
| Approve · matched | Approves the matched payment | button | Green |
| Request resubmit | Asks the couple to resubmit proof | button | Amber |
| Reject | Rejects the payment proof | button | Red |
| Record a refund for order {code} | Expands the refund form | clickable element | Grey |
| Record refund · notify couple | Records the refund, notifies couple | button | Green |
| Open event | Goes to the page | text link | link — stays a link |
| Read it / Read it again | Reads the payment proof (OCR) | button | Green (read) · Amber (again) |
| Record and confirm | Records the payment and confirms | button | Green |

## admin/payouts/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Payments | Goes to the page | text link | link — stays a link |
| {label} ×2 | Goes to the page | text link | link — stays a link |
| Apply | Applies the filters | button | Grey |
| Reset | Clears the filters | text link | Grey |
| Mark paid | Marks the payout paid | button | Green |
| Place on hold | Places the payout on hold | button | Amber |
| Release hold | Releases the hold on the payout | button | Green |

## admin/pricing/_components/ai-bands-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Move | Moves the price band | button | Terracotta |
| Save | Saves the changes | button | Green |

## admin/pricing/_components/booking-fee-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save booking fee | Saves the changes | button | Green |

## admin/pricing/_components/catalog-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {view} {count} | Switches catalogue view | button | Grey |
| All / {scope} | Filters the catalogue by scope | button | Grey |
| Papic credits — the top-up ladder (row) | Expands the Papic credits group | button | Grey |
| Remove all N for good | Opens remove-all confirmation | button | Red |
| Cancel | Cancels removal | button | Red |
| Remove all {n} | Removes all retired prices | button | Red |
| {price title} {code} | Expands the price to edit it | button | Grey |
| Save this price | Saves this price | button | Green |
| Retire this price | Opens retire-price confirmation | button | Red |
| Retire it | Retires the price | button | Red |
| Keep selling | Cancels retiring | button | Grey |
| Put back on sale | Puts the price back on sale | button | Amber |
| Remove for good | Opens remove-price confirmation | button | Red |
| Remove for good | Removes the price for good | button | Red |
| Keep it retired | Cancels removing | button | Grey |

## admin/pricing/_components/legacy-catalog.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Older catalogue — the previous system’s prices read-only | Expands / collapses a section | clickable element | Grey |

## admin/pricing/_components/papic-ladder-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save shot prices | Saves the changes | button | Green |

## admin/pricing/_components/papic-rest-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |

## admin/pricing/_components/papic-type-sizing-editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Recompute from finished celebrations | Recomputes sizing from real data | button | Amber |
| Save | Saves the changes | button | Green |

## admin/pricing/_components/signup-discount-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |

## admin/pricing/_surfaces/custom-plans-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| /admin/pricing | Goes to the page | text link | link — stays a link |
| {vendorName} now {tier} {summary} {label} ₱{format} / — per 28 days Review → | Goes to the page | text link | link — stays a link |

## admin/pricing/_surfaces/free-windows-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Create couple free window | Creates a couple free window | button | Terracotta |
| Gifts | Goes to the page | text link | link — stays a link |
| Create supplier free window | Creates a supplier free window | button | Terracotta |
| Deactivate / Activate | Toggles the free window | button | Red (deactivate) · Terracotta (activate) |
| Delete | Deletes it | button | Red |

## admin/pricing/_surfaces/price-bands-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Recompute now | Recomputes price bands now | button | Amber |
| Recompute funnel bands | Recomputes funnel bands | button | Amber |

## admin/pricing/_surfaces/pricing-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Download legacy catalog report | Downloads the legacy catalogue report | button | Grey |

## admin/pricing/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |

## admin/queues/_components/queue-drawer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open {queue} ×2 | Opens the full queue page | text link | link — stays a link |
| {row action label} | Runs the row’s quick action | button | ? (label comes from data per queue item) |
| {form submit label} | Submits the drawer form | button | ? (label comes from data per queue) |
| Open | Goes to the page | text link | link — stays a link |
| see all {n} | Goes to the page | text link | link — stays a link |

## admin/queues/_components/queues-triage-feed.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} {LANE_LABEL[item.lane]} {ageLabel} / Couldn’t count this queue — open it to check / {description} N / / | Goes to the page | text link | link — stays a link |
| {label} {n} | Goes to the page | text link | link — stays a link |
| {n} queues are clear | Expands the clear-queue list | clickable element | Grey |
| See every queue | Goes to the page | text link | link — stays a link |

## admin/receipts/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply | Applies the filters | button | Grey |
| View | Goes to the page | text link | link — stays a link |

## admin/repost-watch/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Rescan all | Re-scans all suppliers | button | Amber |
| {label} · {formatCount} | Goes to the page | text link | link — stays a link |
| Confirm theft | Confirms the theft | button | Green |
| Escalate | Escalates the flag | button | Amber |
| Dismiss | Dismisses the flag | button | Grey |
| Open supplier → ×2 | Goes to the page | text link | link — stays a link |
| Scan QR codes | Scans QR codes for repost matches | button | Terracotta |
| Media removed | Records that the media was removed | button | Green |
| Clear | Clears the flag | button | Grey |

## admin/reveal-studio/std-video-moderation.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Approve | Approves the video | button | Green |
| Prepare for review | Prepares the video for review | button | Amber |
| Reject | Rejects the video | button | Red |
| Open couple page ↗ | Goes to the page | text link | link — stays a link |

## admin/reveal-studio/studio.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {option label} {hint} (switch) | Flips this reveal option on/off | button | Grey |
| {template name} | Previews that template | button | Grey |
| ↻ Replay | Replays the reveal preview | button | Grey |
| Save — make it live | Saves and publishes the reveal | button | Green |
| Reset to locked defaults | Discards edits, restores defaults | button | Red |

## admin/reviews/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |
| Override-publish | Overrides and publishes the review | button | Terracotta |
| Reject appeal | Rejects the supplier’s appeal | button | Red |
| Escalate | Escalates the review | button | Amber |
| Dismiss flag | Dismisses the flag | button | Grey |

## admin/search-memory/search-memory-table.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the taught search answer | button | Green |
| Cancel | Cancels teaching | button | Red |
| Teach it this instead | Opens the teach-it form | button | Terracotta |
| Delete | Deletes the remembered phrase | button | Red |

## admin/secrets/_components/encryption-key-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Mark rotated | Marks the key as rotated | button | Green |

## admin/secrets/_components/reencrypt-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Sweep / Re-encrypt | Re-encrypts stored secrets | button | Terracotta |

## admin/secrets/_components/secret-row.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {secret name} — status · age | Expands the secret’s details | clickable element | Grey |
| Get a fresh value | Opens the provider in a new tab | text link | link — stays a link |
| Save to Vercel | Saves the value and redeploys | button | Terracotta |
| Save key | Saves the key | button | Green |
| Advanced settings → | Goes to the page | text link | link — stays a link |
| Remove saved key(s) | Removes saved keys | button | Red |
| Mark rotated | Marks the secret rotated | button | Green |

## admin/secrets/_components/secret-value-input.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Generate | Generates a random value | button | Terracotta |

## admin/secrets/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to admin | Goes to the page | text link | link — stays a link |
| {label} | Goes to the page | text link | link — stays a link |
| Redeploy production | Redeploys production | button | Terracotta |

## admin/settings/_components/brand-icon-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Upload brand icon / Replace brand icon | Uploads the brand icon | button | Terracotta |

## admin/settings/_components/loader-appearance-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {loader name} {blurb} | Picks the loading animation | button | Grey |
| Save loading animation | Saves the loading animation | button | Green |

## admin/settings/_components/morning-digest-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Turn on / Turn off | Switches the morning digest on/off | button | Terracotta (on) · Red (off) |

## admin/settings/_components/qr-upload-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| clear | Clears the chosen file | button | Grey |
| Upload QR | Uploads the QR image | button | Terracotta |

## admin/settings/_components/sentry-smoke-test-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Fire Sentry smoke test (admin only) | Fires a Sentry test error | button | Terracotta |

## admin/settings/_surfaces/demo-mode-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Turn demo mode ON / OFF | Switches demo mode on/off | button | Terracotta (on) · Red (off) |
| View /vendors | Goes to the page | text link | link — stays a link |
| Manage demo suppliers | Goes to the page | text link | link — stays a link |

## admin/settings/_surfaces/notifications-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Mark all read | Marks all notifications read | button | Green |
| Open | Goes to the page | text link | link — stays a link |
| Mark read | Marks this notification read | button | Green |

## admin/settings/_surfaces/settings-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save business identity | Saves the business identity | button | Green |
| Onboarding Settings for the new-account onboarding flows — background music and future per-flow knobs, grouped by onboarding type. (Moved here from this page.) | Goes to the page | text link | link — stays a link |
| Payment methods The receiving accounts (any bank or e-wallet) + QR codes the app shows to couples on order detail pages. | Goes to the page | text link | link — stays a link |
| Reset to default | Resets this setting to default | button | Red |

## admin/settings/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |

## admin/settings/payment-methods/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to settings | Goes back to Settings | text link | link — stays a link |
| Add account | Adds the payment account | button | Terracotta |
| Save limits | Saves the limits | button | Green |
| Turn on / Turn off | Enables or disables the account | button | Terracotta (on) · Red (off) |
| Move {account} up | Moves the account up the list | button | Grey |
| Move {account} down | Moves the account down the list | button | Grey |
| Remove | Removes this item | button | Red |
| Save {account} | Saves the account | button | Green |
| Remove QR | Removes the QR code | button | Red |

## admin/spotlight-awards/_components/spotlight-actions.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Recompute awards | Recomputes the spotlight awards | button | Amber |
| Feature / Unfeature | Features or unfeatures the award | button | Terracotta (feature) · Amber (unfeature) |
| (Remove award) | Removes the award after a confirm | icon-only | Red |

## admin/studio/_surfaces/discount-codes-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Edit | Goes to the page | text link | link — stays a link |
| Disable | Disables the discount code | button | Red |
| Enable | Enables the discount code | button | Terracotta |
| Create code | Opens the new-code form | button | Terracotta |
| {filter label} | Filters the code list | text link | link — stays a link |

## admin/studio/_surfaces/journal-spotlights-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Draft credit | Drafts the credit line | button | Terracotta |
| Approve & publish | Approves and publishes | button | Green |
| Start 2-admin approval | Starts two-admin approval | button | Terracotta |
| Confirm & publish | Confirms and publishes | button | Green |
| Remove | Removes the spotlight | button | Red |

## admin/studio/_surfaces/real-stories-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {coupleNames} | Goes to the page | text link | link — stays a link |
| Save | Saves the changes | button | Green |
| Unfeature | Unfeatures the story | button | Amber |
| Feature | Features the story | button | Terracotta |
| View the public page | Neutral view / manage action | text link | Grey |

## admin/studio/_surfaces/recaps-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| View | Goes to the page | text link | link — stays a link |
| Take down | Takes the recap down | button | Red |

## admin/studio/_surfaces/referrals-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |

## admin/studio/_surfaces/social-queue-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Scheduled | Jumps to that section | text link | link — stays a link |
| Failed | Jumps to that section | text link | link — stays a link |
| Published | Jumps to that section | text link | link — stays a link |
| Announce | Jumps to that section | text link | link — stays a link |
| Evergreen | Jumps to that section | text link | link — stays a link |
| Manual | Jumps to that section | text link | link — stays a link |
| Open the live post ↗ | Goes to the page | text link | link — stays a link |
| Mark taken down | Marks the post taken down | button | Red |
| Retry | Retries the failed post | button | Amber |
| Pull ×2 | Pulls the post from the queue | button | Red |
| FB ↗ | Opens the Facebook post | text link | link — stays a link |
| IG ↗ | Opens the Instagram post | text link | link — stays a link |
| Queue announcement | Queues the announcement | button | Terracotta |
| Add item | Adds the item to the queue | button | Terracotta |
| Mark posted ×2 | Marks the post as posted | button | Green |
| Save | Saves the post | button | Green |
| Download 9:16 card | Downloads the story card image | button | Grey |
| Edit copy… | Expands the copy editor | clickable element | Grey |
| Save copy | Saves the edited copy | button | Green |
| Post now → {channels} / Post now | Publishes the post now | button | Terracotta |
| Edit… | Expands the editor | clickable element | Grey |
| Save | Saves the changes | button | Green |

## admin/studio/_surfaces/songs-danger-controls.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Delete {song}) | Deletes the song after a confirm | icon-only | Red |
| Merge | Merges duplicate songs | button | Terracotta |

## admin/studio/_surfaces/songs-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Search | Searches songs | button | Grey |
| Add to list / In the list | Adds/removes the song from the curated list | button | Terracotta (add) · Amber (remove) |

## admin/studio/_surfaces/spotlight-awards-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add award | Adds the award | button | Terracotta |

## admin/studio/_surfaces/storytellers-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {title} | Goes to the page | text link | link — stays a link |
| N open report / reports | Goes to the page | text link | link — stays a link |
| Save | Saves the changes | button | Green |
| Unfeature | Unfeatures the storyteller | button | Amber |
| Feature | Features the storyteller | button | Terracotta |
| View the shelf | Neutral view / manage action | text link | Grey |
| {creatorName} | Goes to the page | text link | link — stays a link |

## admin/studio/_surfaces/website-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| View live → | Goes to the page | text link | link — stays a link |
| Open | Opens the website editor | button | Grey |

## admin/studio/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |

## admin/subscriptions/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Confirm payment & activate plan | Commits / confirms | button | Green |
| Reject | Rejects the payment | button | Red |
| Plan pricing | Goes to the page | text link | link — stays a link |

## admin/ugat/_components/ugat-console.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Map | Switches to the map view | button | Grey |
| Tables | Switches to the tables view | button | Grey |
| Health {n} | Toggles the audit overlay | button | Grey |
| {resolution} | Sets the map resolution | button | Grey |
| (click-away backdrop) | Closes the open panels | clickable element | Grey |
| (map edge line) | Opens the relationship panel | clickable element | Grey |
| (joint marker) | Opens the relationship panel | clickable element | Grey |
| (health marker) | Opens the health finding | clickable element | Grey |
| {node name} {count} | Selects the node, opens its panel | clickable element | Grey |
| (health marker on node) | Opens the health finding | clickable element | Grey |
| (Zoom in) | Zooms the map in | icon-only | Grey |
| (Zoom out) | Zooms the map out | icon-only | Grey |
| (Fit to view) | Fits the map to the screen | icon-only | Grey |
| (Close) | Closes the side panel | icon-only | Grey |
| {verb} {other table} — {n} rows | Opens the related table | button | Grey |
| {finding title} — {one-liner} ×2 | Opens the health finding | button | Grey |
| Open {label} table | Opens the table view for this node | button | Grey |
| Open in admin | Goes to the page | button | link — stays a link |
| (Close) ×2 | Neutral view / manage action | icon-only | Grey |
| Health finding {id} — open the binding trace | Opens the health finding | button | Grey |
| {saved question} — {n} matches | Runs the saved question | button | Grey |
| {search result title} | Opens that record | text link | link — stays a link |
| (Dismiss) | Dismisses the strip | icon-only | Grey |
| {tab label} | Switches the table tab | button | Grey |
| (table row) | Opens that record | clickable element | Grey |
| ← Prev | Previous page of rows | button | Grey |
| Next → | Next page of rows | button | Grey |

## admin/ugat/_surfaces/brain-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {topic} — tagline · chunks | Expands the topic | clickable element | Grey |
| Edit | (placeholder: edit coming later) | button | Grey |

## admin/ugat/_surfaces/onboarding-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save background music | Saves the background music | button | Green |
| {icon} {label} → | Goes to the page | text link | link — stays a link |

## admin/ugat/_surfaces/screens-surface.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {area} — {n} screens | Expands the screen group | clickable element | Grey |

## admin/ugat/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |
| Entity map | Goes to the page | text link | link — stays a link |

## admin/user-reports/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} · {formatCount} | Goes to the page | text link | link — stays a link |
| Open chapter page | Goes to the page | text link | link — stays a link |
| Hide content | Hides the reported content | button | Red |
| Remove from Real Stories | Removes it from Real Stories | button | Red |
| Block uploader | Blocks the uploader | button | Red |
| Escalate | Escalates the report | button | Amber |
| Dismiss | Dismisses the report | button | Grey |

## admin/users/[userId]/_components/account-card-nav.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | Goes to the page | text link | link — stays a link |

## admin/users/[userId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All users | Goes to the page | text link | link — stays a link |
| Users list | Goes to the page | text link | link — stays a link |
| {string} | Goes to the page | text link | link — stays a link |
| Reconcile in Payments | Goes to the page | text link | link — stays a link |
| Download their data | Downloads the user’s data export | text link | Grey |
| {hrefLabel} | Goes to the page | text link | link — stays a link |

## admin/vendor-partnerships/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Reject | Rejects the partnership | button | Red |
| Propose partnership (lands in supplier inbox) | Proposes the partnership | button | Terracotta |
| Take down | Takes the partnership down | button | Red |

## admin/vendor-recommendations/_editor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save | Saves the changes | button | Green |
| Remove from map | Removes it from the map | button | Red |
| Add recommendation | Adds the recommendation | button | Terracotta |
| Accept | Accepts the recommendation | button | Green |
| Decline | Declines the recommendation | button | Red |

## admin/vendors/[vendorProfileId]/edit/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to suppliers | Goes to the page | text link | link — stays a link |
| Save changes | Saves the changes | button | Green |

## admin/vendors/[vendorProfileId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {ownerLabel} | Goes to the page | text link | link — stays a link |
| All suppliers | Goes to the page | text link | link — stays a link |
| Edit this unclaimed shop | Goes to the page | text link | link — stays a link |
| Change plan | Goes to the page | text link | link — stays a link |
| See team | Goes to the page | text link | link — stays a link |
| Verification queue | Goes to the page | text link | link — stays a link |
| All their payouts | Goes to the page | text link | link — stays a link |

## admin/vendors/[vendorProfileId]/plan/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to suppliers | Goes to the page | text link | link — stays a link |
| Set tier | Sets the supplier tier | button | Terracotta |
| Mark as founding supplier / Remove founding supplier | Toggles the founding-supplier flag | button | Terracotta (mark) · Red (remove) |
| Comp {n} days | Comps free days of the challenge plan | button | Terracotta |

## admin/vendors/[vendorProfileId]/team/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All suppliers | Goes to the page | text link | link — stays a link |
| Plan | Goes to the page | text link | link — stays a link |

## admin/vendors/_components/invite-vendor-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Create invite link | Creates the claim invite link | button | Terracotta |
| Copy link / Copied | Copies the claim link | button | Grey |

## admin/venues/[id]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Delete venue | Deletes the venue | button | Red |

## admin/venues/_components/venue-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {Create venue / Save changes} | Creates or saves the venue | button | Terracotta (create) · Green (save) |
| Cancel | Leaves the form, discards changes | button | Red |

## admin/verification-docs/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Download | Downloads the verification document | button | Grey |
| Delete | Deletes the document | button | Red |

## admin/verify/_components/deep-search-chat.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Copy verification prompt | Copies the prompt | button | Grey |
| Copy study prompt (for interview) | Copies the prompt | button | Grey |
| Paste a result back → / Hide paste box | Shows/hides the paste box | button | Grey |
| Save pasted result | Saves the pasted result | button | Green |

## admin/verify/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} ×3 | Goes to the page | text link | link — stays a link |
| {length} -item checklist | Expands / collapses a section | clickable element | Grey |
| Confirm — matches DTI | Confirms the DTI match | button | Green |
| {verification action} | Runs a verification step | button | ? (label is data-driven) |
| Run deep search / Re-run deep search | Runs the deep search | button | Terracotta (run) · Amber (re-run) |
| source | Goes to the page | text link | link — stays a link |
| {platform} | Goes to the page | text link | link — stays a link |
| {link label} | Goes to the page | text link | link — stays a link |
| {length} check s already clear | Expands / collapses a section | clickable element | Grey |
| Open {n} — file missing | Opens the verification document | button | Grey |
| {url} | Goes to the page | text link | link — stays a link |
| Mark in review | Marks the application in review | button | Terracotta |
| Approve → Verified | Approves and verifies the supplier | button | Green |
| Reject… | Expands the reject form | clickable element | Grey |
| Confirm reject | Confirms rejection | button | Red |
| Demote… | Expands the demote form | clickable element | Grey |
| Confirm demote | Confirms demotion | button | Red |
| Withdraw vouch | Withdraws the vouch | button | Red |
| Vouch for them… | Expands the vouch form | clickable element | Grey |
| Vouch → Verified | Vouches and verifies | button | Green |
| Approve → Verified | Approves and verifies | button | Green |
| Reject → Hidden | Rejects and hides the listing | button | Red |
| Archive | Archives the application | button | Grey |

## admin/website-media/clear-folder-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Clear N left-over file / files | Opens clear-folder confirmation | button | Red |
| Delete them | Deletes the left-over files | button | Red |
| Cancel | Cancels the clear | button | Red |

## admin/website-media/media-table.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open the file here | Goes to the page | text link | link — stays a link |
| Download | Downloads the file | button | Grey |
| Delete | Deletes the file | button | Red |

## admin/website/widget-list.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Move up) | Moves the widget up | icon-only | Grey |
| (Move down) | Moves the widget down | icon-only | Grey |
| ({widget} on/off switch) | Shows or hides the widget | icon-only | Grey |

## live/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Connect | Connects with the entered code | button | Terracotta |

## live/screen/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Enter a new code | Goes back to enter another code | button | Grey |

## login/_components/sign-in-card-modal.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Close) | Closes the sign-in card | icon-only | Grey |

## login/_components/sign-in-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Set password / Try again | Sets the new password | button | Terracotta |
| Forgot password? | Goes to the page | text link | link — stays a link |
| Continue | Continues to sign in | button | Terracotta |
| Create one, free | Goes to the page | text link | link — stays a link |

## onboarding/[type]/_components/generic-onboarding.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Go to {displayName} | Goes to the page | text link | link — stays a link |
| Change | Reveals the honoree name field | button | Grey |
| {anchor origin} | Picks where the anchor date starts | button | Grey |
| {recurrence option} | Picks how often it repeats | button | Grey |
| On the day · {date} | Picks the celebration day | button | Grey |
| The Saturday after · {date} | Picks the following Saturday | button | Grey |
| Another day | Opens the calendar to pick a day | button | Grey |
| {option title} {description} | Picks this detail option | button | Grey |
| {option title} {description} | Picks this style option | button | Grey |
| sign in | Goes to the page | text link | link — stays a link |
| Back | Goes back a step | button | Grey |
| Create my {event type} / Go to my dashboard | Creates the event or opens its dashboard | button | Terracotta |
| Continue | Goes to the next step | button | Terracotta |

## onboarding/[type]/_components/specialty-fields.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove | Removes this item | button | Red |
| + Add another / + Add {field} | Adds another row | button | Terracotta |
| {value} ✕ | Removes this entry | button | Red |
| {option} ×2 | Picks this option | button | Grey |
| {option} | Toggles this option | button | Grey |

## onboarding/_shared/date-calendar.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Specific dates (1–4 days) | Switches to picking specific dates | button | Grey |
| Flexible window (a range) | Switches to a date range | button | Grey |
| ‹ | Shows the previous month | icon-only | Grey |
| › | Shows the next month | icon-only | Grey |
| {day number} | Picks this date | button | Grey |

## onboarding/_shared/services-step.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| − | Decreases the count | icon-only | Grey |
| + | Increases the count | icon-only | Grey |
| Add Papic · ₱{price} / Papic added ✓ | Adds Papic to the plan | button | Terracotta |
| Not now | Skips adding Papic | button | Grey |
| Add {AI} to my {event} ₱{price} / ✓ Added to your plan | Adds Setnayan AI to the plan | button | Terracotta |
| See Setnayan AI in your studio → | Goes to the page | text link | link — stays a link |
| Add {Event Hub Pro} to my {event} ₱{price} / ✓ Added | Adds Event Hub Pro to the plan | button | Terracotta |

## onboarding/_shared/setup-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| i | Shows more about this step | icon-only | Grey |
| {quick answer} | Fills in a quick answer | button | Grey |
| {cover choice} — You’ll add it from your Event Hub. | Picks the cover-photo option | button | Grey |
| {option} | Picks this option | button | Grey |

## onboarding/simple/_components/simple-setup-flow.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back | Goes back a step | button | Grey |
| Continue | Goes to the next step | button | Terracotta |

## onboarding/simple/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹ Back | Goes to the page | text link | link — stays a link |
| Create event | Creates the event | button | Terracotta |
| Cancel | Leaves without creating | button | Red |

## onboarding/wedding/_components/location-step.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Remove {city}) | Removes this city | icon-only | Red |
| {n}. {region} {city} | Toggles this city off/on | button | Grey |
| {region} {city} · {km} km | Toggles this city | button | Grey |
| {city} · {km} km {region} | Toggles this city | clickable element | Grey |
| Near me | Uses my current location | button | Terracotta |

## onboarding/wedding/_components/onboarding-music.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (Mute / Play background music) | Mutes or plays the music | icon-only | Grey |

## onboarding/wedding/_components/onboarding-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {refine option card} | Toggles this refinement | clickable element | Grey |
| {emoji} {option} ×2 | Picks this option | button | Grey |
| ✓ {option} | Toggles this option | button | Grey |
| {option} | Toggles this option | clickable element | Grey |
| ‹ | Goes back one step | icon-only | Grey |
| Skip | Skips this step | button | Grey |
| {monogram} {names} — your Event Hub preview | Peeks at the Event Hub preview | clickable element | Grey |
| {role title} {description} | Picks who is using the app | button | Grey |
| {kind title} {description} | Picks the event kind | button | Grey |
| {faith} | Picks the faith | clickable element | Grey |
| ↻ Change design | Cycles to another monogram design | button | Grey |
| ↻ Generate another design | Generates another monogram | button | Terracotta |
| Use this monogram | Locks in the monogram | button | Terracotta |
| Tell it | Starts the love-story questions | button | Terracotta |
| Add it later | Skips the love story for now | button | Grey |
| {starter line} | Picks a story starter | button | Grey |
| {cue} | Picks a cue | button | Grey |
| Ours was easy — skip | Skips this question | button | Grey |
| {proposal style} | Picks how the proposal happened | button | Grey |
| {voice} | Picks the proposal voice | button | Grey |
| {prompt tile} | Opens the prompt to answer it | clickable element | Grey |
| ＋ a moment that mattered | Opens the add-a-moment form | button | Terracotta |
| {moment title} | Fills the moment title | button | Grey |
| Save ♥ / Add to our story ♥ | Saves or adds the moment | button | Terracotta (add) · Green (save) |
| Remove | Removes the moment | button | Red |
| Cancel | Closes the moment form | button | Red |
| {tone} | Picks the story tone | button | Grey |
| This is us | Accepts the story and continues | button | Terracotta |
| Change a line | Jumps back to edit a line | button | Grey |
| Set a budget instead | Switches to entering an amount | button | Grey |
| No limit | Sets no budget limit | button | Grey |
| {option title} {description} ×2 | Picks this option | clickable element | Grey |
| {category card} ×2 | Picks this category | clickable element | Grey |
| {group} — {n} selected › | Expands the group | button | Grey |
| {style card} | Picks this style | clickable element | Grey |
| Terms | Goes to the page | text link | link — stays a link |
| Privacy Policy | Goes to the page | text link | link — stays a link |
| Create account | Creates the account | button | Terracotta |
| Already have an account? Sign in | Goes to the page | text link | link — stays a link |
| {vendor card} — Tap to shortlist / Shortlisted | Adds or removes from shortlist | clickable element | Grey |
| Expand search — see {n} farther venues ↓ | Shows farther venues | button | Grey |
| + Add your own venue / + Add another venue | Opens the add-venue sheet | button | Terracotta |
| Yes — match the rest of my suppliers | Accepts AI supplier matching | button | Terracotta |
| No thanks, I’ll browse on my own | Declines AI matching | clickable element | Grey |
| Keep Setnayan AI · ₱{price} | Keeps the AI add-on and finishes | button | Green |
| Maybe later — I’ll browse on my own (free) | Skips the AI add-on | clickable element | Grey |
| − | Fewer inquiries per category | icon-only | Grey |
| + | More inquiries per category | icon-only | Grey |
| (Save to your wedding) | Saves the service to my wedding | icon-only | Green |
| ♡ Save to my wedding / ♥ Saved to your wedding | Saves the service to my wedding | button | Green |
| ♥ {service} | Shows that service’s details | button | Grey |
| × | Removes the saved service | icon-only | Red |
| Purchase Now | Buys the add-ons and finishes | button | Green |
| Will purchase later, continue for FREE | Skips payment, continues free | button | Grey |
| Go to my dashboard | Finishes and opens the dashboard | button | Terracotta |
| {Continue / next label} | Goes to the next step | button | Terracotta |
| (click-away backdrop) | Closes the venue sheet | clickable element | Grey |
| Send invite & connect | Invites the venue to connect | button | Blue |
| Cancel | Closes the venue sheet | button | Red |

## onboarding/wedding/_components/song-bank-step.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {mode} | Switches how songs are picked | button | Grey |

## onboarding/wedding/_components/song-preview-list.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {song title} · {artist} | Adds/removes the song | clickable element | Grey |
| (Play / Stop 30-second preview) | Plays or stops the preview | icon-only | Grey |

## onboarding/wedding/_components/wedding-cards.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| More places › / Hide more places | Shows or hides more places | button | Grey |
| We already have our venue › / Just the area for now | Switches venue-or-area entry | button | Grey |
| − | Fewer guests | icon-only | Grey |
| + | More guests | icon-only | Grey |

## onboarding/wedding/_components/wedding-venues.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Show farther options › / Show fewer | Shows more or fewer venues | button | Grey |

## onboarding/wedding/_components/welcome-moments.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (tap the message to continue) | Advances to the next message | clickable element | Terracotta |
| {option title} {description} | Picks this option | button | Grey |

## onboarding/wedding/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Go to {event name} | Goes to the page | text link | link — stays a link |
| Back to my events | Goes to the page | text link | link — stays a link |

## signup/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Terms | Goes to the page | text link | link — stays a link |
| Privacy Policy | Goes to the page | text link | link — stays a link |
| Create user account · free | Creates the account | button | Terracotta |
| Sign in | Goes to the page | text link | link — stays a link |

## signup/you/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Full name — for guest lists and invitations (optional) | Expands the optional name section | clickable element | Grey |
| Done | Saves the profile and finishes | button | Green |
| Later | Skips to the next step | text link | link — stays a link |

## Totals

- Files with controls: 200
- Controls counted: 854 (duplicates within a file counted individually)
- Pure page links that stay links: 187
- Text links, bare icons and clickable non-buttons that must become buttons: 132
- Unsure ("?"): 5

## Scope notes

- Folders named in the brief that do NOT exist in this archive: apps/web/app/explore, apps/web/app/categories, apps/web/app/chat, apps/web/app/inbox. (admin/categories IS included.) Existing and covered: admin, signup, login, onboarding, live.
- Not counted: text/number/date/range/file inputs, selects, checkboxes and radios (form fields, not pressable actions); wrapper usages whose button is defined elsewhere in this area (counted once at the definition); non-interactive spans that merely carry a btn class (mock Event-Hub preview chips in onboarding-shell).
- <summary> disclosure rows are listed as "clickable element", Grey (expand/collapse).
- Choice chips, option cards, tabs, segmented toggles and switches are treated as Grey (neutral "pick / switch") because their meaning is selection, not an action.
- Plain-text navigation links (tabs, row names, breadcrumbs, "Back to…", "Open →") stay links; links with an icon + verb (Add, Edit, Export, Download, Open…), btn-styled links, and plain Cancel/Reset/Clear/Later links were treated as buttons.
- Toggle controls whose label flips are shown with both colours, e.g. "Terracotta (on) · Red (off)".
- Filter-bar "Apply" and "Search" are Grey (filter), not Terracotta.

## Unsure rows

- admin/accounts/_surfaces/events-surface.tsx:489 | Face mode: On / Off / Auto (shows current state) | label is the current state, not a verb
- admin/data-privacy/_components/task-actions.tsx:62 | {task status} (e.g. In progress / Resolved) | label changes per status
- admin/queues/_components/queue-drawer.tsx:151 | {row action label} | label comes from data per queue item
- admin/queues/_components/queue-drawer.tsx:196 | {form submit label} | label comes from data per queue
- admin/verify/page.tsx:1079 | {verification action} | label is data-driven
