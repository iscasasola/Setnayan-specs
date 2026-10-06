# Event Hub — what lives where, and how you reach it · prototype · 2026-10-06

**Status: PLANNING PROTOTYPE — not built.** Owner: *"just so i know how to access them"* — this shows the PATHS, the editors are light stubs.
**File:** `event_hub_what_lives_where_2026-10-06_fable.html` (self-contained; Google Fonts only). Phone · Desktop toggle at the top.
**Screenshots:** `…-phone-home.jpg` · `…-phone-menu-stages.jpg` · `…-phone-menu-studio.jpg` · `…-phone-schedule.jpg` · `…-phone-rsvp.jpg` ·
`…-phone-egifts.jpg` · `…-phone-event-info.jpg` · `…-phone-tap-venue.jpg` · `…-phone-suppliers.jpg` · `…-desktop.jpg` · `…-desktop-event-info.jpg`.
**Decisions it draws:** DECISION_LOG 2026-10-06 "EVENT DETAILS IS REBUILT" · 2026-10-06 "THE PHONE TOOLBAR, PER ELEMENT" (planning) ·
2026-10-06 "THE WEDDING MARCH ITEM IS A DRAG-AND-DROP MARCH MAKER" · the owner's 2026-10-06 "what lives where" note (verbatim in the brief) ·
the five-group menu (Stages · Look · Studio · Event Info · Settings).
**Deep links:** `#s=home` · `#menu=studio` (phone sheet on a tab) · `#item=schedule|rsvp|gifts|march|info|who|background|std…` · `#el=venue` (tap a page part) ·
`#s=suppliers` · `#v=desktop&item=…` · `?shot=1` frameless.

## What lives where (the owner's plan, as drawn)

| Group | Items | Opens as |
|---|---|---|
| **Stages** | Save the Date · RSVP · Invitation · The Day · Post Event | switches the page in the Maker |
| **Look** | Background · Colours · Font · Music | tools in the lower third (phone) / right panel (desktop) |
| **Studio** (own editors) | Logo · Mood Board & Dress Code · Wedding March · Love Story · Schedule (first row **Guests arrive by**) · Seat plan · E-Gifts (GCash · Maya · bank · PayPal + thank-you line) · RSVP (6 switches + Reply by) | full screen (phone) / right panel (desktop) |
| **Event Info** | one form: Event Name · A note from us · Opening line · What to bring — plus **Venue & date read-only** with "Change in Suppliers" | full-screen form (phone) / form in the main area (desktop) |
| **Settings** | Who can view · Event Hub address · QR code · Reset · About | full-screen form (phone) / form in the main area (desktop) |
| **Suppliers** | venue and date — compare cards show free/busy on the candidate dates; **Lock ▾** on a venue picks the date and sets the event date; "Add a venue manually" creates a manual Venue entry | its own screen, reached by the explicit hand-off |

## How each item is reached

- **Home › the ONE card "Event Hub · 7 of 10 ready ›"** (the 10 = 8 Studio items + Event Info + Venue & date) → the Maker opens on the **next missing item**; the missing ones are listed under the card. Desktop: sidebar **Event Hub › Event Details** does the same.
- **Phone — the lower third keeps ONE "Invitation ▾" Menu button** (where you are). Tap it → a sheet slides up inside the lower third (268 → 406 px): one row of five icon tabs **Stages · Look · Studio · Info · Settings**, and only the active group's items as tiles (✓ Ready / Missing). Stages is the default tab every time it opens.
- **Desktop — the left sidebar is the same five groups as an accordion** (one open at a time, Stages open by default); each header carries a count — "Studio · 6 of 8 ready", "Event Info · 1 of 2 ready", "Stages · Invitation", "Look · 4 tools". Page in the middle; the picked item's tools on the right; Event Info / Settings as a form in the main area.
- **Tap a part on the page** (each carries a small STUDIO / EVENT INFO / SUPPLIERS tag) → ‹ · "Invitation ▾ · Venue" · › × and one button: **Edit the …** (Studio) · **Edit details** (Event Info) · **Book / Change in Suppliers** (venue · date). Desktop: the click opens the editor on the right directly.
- **Every destination screen has a "How to get here" card** listing its paths (Home card · Menu ▾ / sidebar · tap on the page · the other platform).

## Verified by script (local http.server · Browser pane tab · phone 375 and desktop 1440)

- Home card "7 of 10 ready" + missing list (Schedule · E-Gifts · Venue & date) → tap → Maker opens the **Schedule** editor (first row Guests arrive by, how-to caption present); typing shows Saving… → Saved ✓; Done → 8 of 10.
- Phone lower third: exactly one Menu ▾ button, 268 px; opening the sheet → 5 tabs in one row, Stages default with 5 tiles, lower third 406 px; Look = 4 tiles (Background opens in the lower third, not full screen); Studio = the 8 editors; Info = 2 tiles; Settings = 5 tiles.
- Opened RSVP (6 switches + Reply by; toggled plus-ones), E-Gifts (GCash · Maya · Bank · PayPal + thank-you line), Wedding March (6 two-column walks + Not walking tray), Event Info (4 fields, autosaved the note; venue read-only with the Suppliers button), Settings (Who can view · address · QR · Reset · About).
- Tap on the page: venue → "Book your venue in Suppliers (or add one manually there)"; Event Name → Edit details; schedule → Edit the Schedule; the Menu ▾ button stays in the row.
- Suppliers: 3 venue cards + 1 other supplier with free/busy on 3 dates; **Lock ▾** is one dropdown of the candidate dates → locking Seda Vertis North for 14 Feb set venue + date, the grid shows "Your date"; "Add a venue manually" created a manual entry; back → the Maker page reads "Sat 14 Feb 2027 · Seda Vertis North" and Home reads 9 of 10.
- Desktop: sidebar Event Details → Maker on Schedule with the Studio accordion open ("6 of 8 ready"); 5 groups, one open; Stages › Save the Date switches the page; Look › Music in the right panel; Event Info opens as a form in the main area and autosaves; Settings › QR code opens the Settings form; clicking E-Gifts on the page → right panel; clicking the date → Suppliers → Lock Blue Leaf for 21 Feb → back: page + "Event Info · 2 of 2 ready".
- No console errors. No "celebration", no "website" anywhere in the file.

## Open for the owner

1. Which tab should the phone sheet remember — always Stages (as drawn), or the last group you used?
2. The Home card counts 10 (8 Studio + Event Info + Venue & date). Should Look or Settings count toward "ready"?
3. On desktop, clicking a page part opens its editor on the right at once (no Edit button in between). Keep, or mirror the phone's one-button step?
