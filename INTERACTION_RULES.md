# Setnayan — one way to do each thing (interaction rules)

Owner, verbatim (2026-09-30): *"how we ask questions for them to fill up, how we navigate and search around, how we interact. it should always feel the same but despite of its simplicity, we have the complex part of deciphering what to do"*.

**The promise:** every screen feels the same and simple; the hard part (what applies to this event, this person, this moment) is worked out by us, behind the screen — never handed to the user ("we handle the chaos").

## 1 · Asking
- One question per card. Title ≤5 words, one line ≤12 words, the answer, nothing else. Details behind ⓘ.
- Every question gets an answer; quick answers are allowed ("Not decided yet", "I'll add them later", "Use the defaults"). Everything is changeable later — say so once, small.
- We pre-fill whatever we already know (profile, event type, earlier answers). Never ask twice.
- Only ask what this event type needs (the event-type profile decides).

## 2 · Choosing
- 2 options → two buttons or a toggle. 3+ options → ONE dropdown (PickMenu). Never a row of pills.
- Yes/No settings → a switch. Several-of-many → a dropdown with checkmarks.

## 3 · Navigating
- About four things at every level: event menu (Home · Guests · Your Team · More Services), the Maker (the page · Page ▾ · Look · Details), the guest bar (Welcome · Details · Our Love Story · Me).
- Where you are is one dropdown (Page ▾, Guests ▾), never a wall of tabs.
- No "go edit it elsewhere ↗": the control is where you are.

## 4 · Searching
- The top bar searches the place you're in (this event's guests on the Guest list, the Maker's scenes in the Maker, everything on Home). The page itself only has "Add".

## 5 · Doing
- Tap what you see to change it (type in place). Changes show instantly; saving happens quietly behind.
- Success = a small toast. Failure = the plain reason + Try again, never looking like success.
- No "Are you sure?" — except for what can't be undone (delete, sign out erasing data, finalize), and then once.
- Phone first: fits 375 px without sideways scroll; one step per screen where steps exist.

## 6 · Behind the screen (our job, not theirs)
- The event-type profile decides stages, pages, scenes, guest-list parts, suggested suppliers and which questions appear.
- Defaults are chosen for them (the best one pre-selected); rules resolve silently (seats on the day, tagging only with Papic, no sides for a birthday).
- Every builder prompt links this file; a PR that adds a pill row, a confirm dialog, a second place for the same setting or a question we already know the answer to is a regression.

## 7 · Two looks, never mixed up
- **Setnayan look** (the host's tools — dashboard, Guest list, Your Team, the Maker's controls, onboarding's frame): warm paper, ink, gold + wine accents, serif for names/headings, sans for controls. Same everywhere. The dashboard may carry the event's cover + one accent colour at the top, nothing more.
- **The event's own theme** (everything a guest sees — the Event Hub, the landing page, RSVP, tickets, prints, guest emails): the couple's theme (background, fonts, colours, logo); tone follows the event type (a wake is quiet).
- **Where they meet:** the Maker's centre is the event's theme, its controls are the Setnayan look; onboarding starts in the Setnayan look and takes on the chosen event type's style once the type is picked.

## 8 · Phone editing: calm, full width, live preview, Apply publishes (owner, 2026-10-04)
Owner, verbatim: *"Remember our rules. 1. prevent to crowded presentation on mobile. 2. always maximize full width for body for easier editing. 3. Realtime effects for seeing what will change but always need to press apply to publish to the actual event hub"*
- **Not crowded on a phone:** one main thing per screen; few controls visible at once; the rest behind ONE dropdown or a sheet; no side-by-side panels at 375 px.
- **The body is full width:** the content being edited (the page, the form, the list) uses the screen's full width; controls go in slim top/bottom bars or a sheet over the page, never a column that narrows the body.
- **Live preview, Apply publishes:** every change shows on the page at once (realtime), and saves to the DRAFT only; guests see nothing until **Apply**. Opening a panel never writes.
- **One open at a time (auto-collapse):** opening a dropdown, ⋯ menu, popover or fold closes any other one open on the screen (owner 2026-10-04, verbatim: *"when a dropdown opens, the other dropdown collapses"* → *"auto collapse"*).
- **A record edits in place (Event Details, 2026-10-04):** a row opens the SAME field the Maker opens for that fact — on a phone in the half sheet over the page (the row scrolled into view above it; drag up for more; Peek; ×), on a desktop in place under the row — drafted, published at Apply. Opening a row is a plain link and writes nothing. A phone record with many rows is folded into a few groups (one line + summary each, one open at a time).
- **Sections inside a panel = ONE segmented control** (the Keynote/Pages pill group, `ISegmented`; selected segment filled in Setnayan wine): max 3 on a phone, 4 on desktop, one or two words each; never used to pick a value (values are dropdowns). Replaces every other tab style (owner 2026-10-04: *"segmented control"*).
