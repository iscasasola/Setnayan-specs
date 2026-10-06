# The phone toolbar, per element — Style · Text · Animate · prototype · 2026-10-06

**Status: PLANNING ONLY — for the owner's review. Nothing here is approved or being built.**
**File:** `maker_toolbar_style_text_animate_2026-10-06_fable.html` (self-contained; Google Fonts only).
**Screenshots (375 × 812 @2x):** `…-phone.jpg` (Countdown · Style) · `…-phone-text.jpg` · `…-phone-animate.jpg` ·
`…-phone-wedding-march-edit.jpg` (the Edit button) · `…-phone-wedding-march-editor.jpg` (full screen) ·
`…-phone-form-gifts.jpg` (full-screen form) · `…-phone-venue-card.jpg` · `…-phone-lower-third-half.jpg` (resized) ·
`…-phone-nothing-picked.jpg`.
**Decisions it draws:** DECISION_LOG 2026-10-06 "THE PHONE TOOLBAR, PER ELEMENT: STYLE · TEXT · ANIMATE — SWIPE TO THE
NEXT ELEMENT; BIG TOOLS GET 'EDIT'; FACTS BECOME FULL-SCREEN FORMS; FOUR THINGS MOVE OUT OF THE MAKER" ·
2026-10-06 "THE LOWER THIRD CAN BE RESIZED" · 2026-10-05 "EVERY TOOL LIVES IN THE THUMB ZONE" · 2026-10-05 the approved
lower-third/top-nav chrome (`maker_lower_third_interactive_2026-10-05_fable`) · 2026-10-05 "THE 5 MAIN COLOURS, ONE JOB EACH".
Deep links for review: `#el=countdown&tool=text` · `#el=march&screen=editor:march` · `#el=gifts&screen=form:gifts` ·
`#el=venue` / `#el=venue&venue=booked` · `#lt=half` · `?shot=1` (frameless 375 × 812).

## What it shows

- **Top nav unchanged:** ✕ Exit (red) · where you are ("Invitation · Countdown") · [Undo | Preview] pill · ✓ Apply (green,
  with the count). Undo works; Preview and Exit are drawn.
- **The page is a realistic maria-and-jose invitation** — 14 elements in order: Logo · Event name · Names & date ·
  Countdown · RSVP · Greeting · Special message · Love Story · Schedule · Venue · Dress code · Wedding March (Our Entourage) ·
  Seat plan · Gifts.
- **Tap an element → ring + name tag; the lower third becomes its toolbar.** Row 1: ‹ · "4 / 14 · Countdown" · › · ×.
  Row 2: ONE segmented header **Style | Text | Animate**, full width. The panel fills the rest — no scrolling for the common case.
  - **Style** = the element's three presets as thumbnails (Countdown: Big number · Boxes · Line; Names & date: Classic ·
    Stacked · Monogram; Greeting: Letter · Centered · Banner; Special message: Quote · Card · Plain) + **Background ▾**
    (None · Plain · Diagonal · Glow) with the palette swatches once a background is on.
  - **Text** = **Font ▾** (Cormorant Garamond · Playfair Display · Great Vibes · Lora · Inter) · **Colour** = the Mood
    Board's five main colours (Dominant · Supporting · Accent · Neutral · Accent 2) + ink + "+" · **Size** slider 80–140 %.
    The words themselves are typed **on the page**: tap the text of the picked element → caret on the page; the panel's
    last line says so ("Typing on the page — tap elsewhere when done").
  - **Animate** = **Build in ▾** (None · Fade up · Fade · Slide in · Scale up) · **Action ▾** (None · Pulse · Float ·
    Shimmer) · **Build out ▾** (None · Fade · Slide out · Scale down) and a tall **▶ Play** that runs all three on the
    page element.
  - Every set of choices is a **dropdown that opens inside the lower third** (owner rule). Presets are the one exception —
    three thumbnails, because they are pictures.
- **Swipe right on the toolbar = next element; swipe left = previous.** The page scrolls to it, the ring moves, the
  indicator bumps. ‹ › do the same. The swipe is ignored on the size slider, the grab bar and an open dropdown.
- **Big tools keep the same header (dimmed) and the panel is one Edit:** "Edit the Logo" · "Edit the Mood Board & Dress
  Code" · "Edit the Wedding March" · "Edit the Love Story" · "Edit the Schedule" · "Edit the Seat plan" — each opens a
  full-screen mock (the march = the two-column drag maker; chapters; timeline; canvas; palette + figures; tables).
- **Facts keep the header (dimmed) and the panel is one "Edit details"** with the current facts in a line:
  Event name (name · line above · show on the cover) · RSVP (Reply by + what the form asks: plus-ones · meal choice · a
  note; says "guests see this right away" and that how-guests-get-in is set in Event Setup) · Gifts (show the section ·
  cash gifts · GCash · registry link · what it says). The form **saves as you type** ("Saving… → Saved ✓") and the page
  updates behind it.
- **Venue:** the panel shows the booked venue + "Change it in Suppliers", or the card **"No venue yet — Book your venue in
  Suppliers, or add one manually there"** with one button that opens a mock Suppliers screen (Book / Add a venue
  manually); booking it writes the venue onto the invitation at once.
- **Nothing picked:** "Tap any part of the page to edit it" + a strip of the 14 elements (tagged Edit / Form / Suppliers).
- **Resize:** drag the bar on the lower third's top edge between 268 px and half the screen (406 px); a tap toggles;
  remembered on the device (browser storage). Everything inside uses the extra room (presets grow).
- Chrome transitions 200–280 ms. Copy says "event" — never "celebration", never "website". Desktop unchanged this round.

## Verified by script (375 touch, served over a local http.server, Browser pane)

- Tapped 5 elements (Countdown · Greeting · Wedding March · Gifts · Venue): ring, indicator and panel kind each correct
  (tool / edit / form / venue).
- Swiped right ×4 from Countdown → RSVP → Greeting → Special message → Love Story (page scrolled each time); swipe left → back.
- Opened Style · Text · Animate on the Countdown; no control overflows the panel at the default height; preset "Boxes"
  repaints the page; the Build in dropdown opens inside the lower third and picks "Slide in"; the Apply count rises.
- Opened the Wedding March editor (9 walks + Not walking tray) and the Love Story editor (3 chapters); opened the Gifts
  form (2 toggles, 3 fields, "Saved"), toggled Cash gifts off → the GCash card left the page.
- Venue card → Suppliers → Book "Seda Vertis North" → the page and the panel both show it.
- Lower third resized 268 → 406 px. No console errors.

## Open for the owner

1. Should **Style · Text · Animate** also apply to the big-tool and fact elements' section on the page (its background, font,
   build-in), with Edit / Edit details as a fourth row — or stay dimmed as drawn?
2. The default lower-third height grew from 245 to **268 px** so three rows + the hint fit without scrolling — keep, or
   shrink the rows?
3. The **Seat plan** is drawn on the Invitation here only to show its Edit; its real home is The Day.
