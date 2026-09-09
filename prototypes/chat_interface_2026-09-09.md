# The chat, both sides — what was decided and why

**Prototype:** `chat_interface_2026-09-09.html` (open it in any browser; no server needed).
Four frames along the top: Supplier · desktop, Supplier · phone, Couple · desktop, Couple · phone.
The Dark button shows every frame in dark mode. On the supplier desktop frame, the two buttons under the tabs switch between *Accepted — talking* and *New inquiry — not yet accepted*.

Handy links for sharing a particular view: add `?tab=sm` (supplier phone), `?tab=cd` (couple desktop), `?tab=cm` (couple phone), `?theme=dark`, `?state=pending`, `?open=build-quote` (any tool name), `?sheet=1` (the phone's ⓘ sheet open).

---

## 1. The layout in one sentence

Three columns on desktop — **the list, the conversation, the context** — and the conversation gets nearly all of the middle. On a phone the same three things are three screens: the list, the conversation, and ⓘ which slides the context up from the bottom.

What you see in the middle, top to bottom:

1. A small header: the couple's name, one line of facts (event · date · guest count), the stage pill, and the phone and camera icons on the right, exactly where Facebook puts them.
2. **One line** of privacy notice — see section 6.
3. The conversation, filling everything else.
4. A one-line strip of AI suggested replies — only when there is one to show.
5. The text box, with four small icons on its left and the orange Send on its right.

Nothing sits between the last message and the text box except the text box. That was the whole complaint, and it is the whole fix.

## 2. Where every function went

One rule decided every placement:

- **Reach for it mid-sentence, several times in one conversation, no money moves → an icon beside the text box.**
- **Do it once, on purpose, and money or a record moves → a line in the quiet list on the right.**
- **Facebook already taught everyone where it is → the header.**

### Supplier

| Function | Home | Why |
|---|---|---|
| Write a message, attach a file, add a photo | text box | as today |
| Deal or meeting | text-box icon (also listed on the right) | used mid-negotiation, often more than once; it writes a card, not money |
| Offer another service | text-box icon (also listed on the right) | a conversational "we also do dessert bars"; posts a card, charges nothing |
| Voice call · Video call | header icons (also listed on the right) | where everyone already looks; **both open the call panel, neither one dials** — the Start button is inside the panel |
| Build a quote | right list, first, outlined | money, done once; the thing a supplier is most likely here to do |
| Send proposal (from a template) | right list | money |
| Log payment | right list, with a count badge | jumps to the couple's "I paid you" card in the chat; Confirm lives on the card |
| Propose schedule | right list, marked "opens brief ↗" | leaves the screen; the arrow says so before you tap |
| Log the outcome | right list, last | private bookkeeping, done at the end |
| Full customer profile | dark button at the bottom of the right column | the way out to everything else |
| Accept / Decline a new inquiry | **in the text box's place** | the box you would write in becomes the decision; until you accept, the tools, the call icons and the AI strip are simply not there |
| Guest-count-changed · a payment the couple logged | cards inside the conversation, outlined in orange | they are events in the conversation, and the outline says "needs you" |
| Stage pill (Inquiry → Quoted → Booked → Completed / Cancelled) | header, right column, and on every list row | read-only everywhere; one small sentence under it says it moves by itself. There is no menu to set it — that is the owner's ruling and the design respects it |
| "Asking about" chips | one small chip in the header, and the Service row on the right | not a row of its own any more |
| The list: search, six filters, previews, tags | left column | same content as today, tighter rows; the filters scroll sideways instead of wrapping to three lines |

### Couple

| Function | Home |
|---|---|
| Write, attach, photo | text box |
| Deal or meeting | text-box icon (also listed on the right) |
| Voice · Video | header icons (also on the right) — only once the supplier has accepted, as today |
| Quotations card | top of the right column; on a phone it is the first thing behind ⓘ |
| "You asked about" chips | right column, with an *add* control |
| See similar suppliers · Open their shop · Withdraw · Block · Report | right column, quiet, never coloured; also under ⋯ |
| Safety tips (all four) | one line under the header, expanded by "Tips" |
| The list | left column, with the **category** and the **money state** on every row ("Quote ₱187,500", "Booked", "Waiting to accept", "Declined"), and filters: All · Has a quote · Booked · Waiting · Closed |

Nothing that ships today was removed.

## 3. Reconciling "the right-most can be the tools" with Facebook's icon row

Both are true and they do not fight. The right column is the **complete** list — every tool, in words, so choosing "Log payment" is never a guess from a glyph. The text-box row carries only the **three** you reach for mid-sentence (attach, deal-or-meeting, offer another service), plus photo. Money tools deliberately get no icon: an unlabelled symbol is the wrong way to begin a ₱241,200 quote.

The three that appear in both places (deal-or-meeting, offer another service, voice/video) are cheap to list twice because a listing does nothing on its own — it only opens the tool.

## 4. What an opened tool looks like — one choice

**It rises from the text box and sits above it; the messages stay visible above that; the text box stays visible below it.**

- Not an overlay covering the chat: you are quoting *from* those messages.
- Not a takeover of the right column: that column is built twice in the real app (a desktop column and a phone sheet), so a heavy tool cannot live in it without being built twice.
- One panel, one open at a time. Opening a second one replaces the first.
- Always a way out: the × in its corner, and the Esc key.
- Closed, it takes **no space at all** — the conversation gets the room back.
- On a phone the same panel rises from the bottom, taller, and the ⓘ sheet closes itself first so the tool is never hidden underneath it.

## 5. The AI suggested-reply strip

One line directly above the text box, small "AI" label on the left, two or three short suggestions scrolling sideways. **If there is nothing to suggest, the line is not there** — the text box takes the space. Tapping a suggestion fills the box; it never sends.

Honest note: what ships today is not this. The shipped "Auto-Reply Assistant" is a bot that **posts replies by itself** (switched off by default, and a paid add-on). A "suggest, don't send" strip is new work. It is also the right one for a supplier who wants to keep their own voice.

## 6. The privacy notice, quiet but complete

Today it is a grey block eating a fifth of the screen. In the prototype it is **one line** under the header: the shield, then *"Don't share private info in chat — government IDs · card numbers · full addresses · OTPs · passwords"*, then a small **Why**. Pressing Why expands the full text, every word of the current notice included, in place. On the couple's side the same line reads *"Plan with peace of mind — keep chats and payments inside Setnayan…"* and **Tips** opens all four points.

## 7. The new-inquiry state (supplier side)

Before accepting, the supplier cannot reply. In the prototype the text box is replaced by the decision card: the facts (date, guest count, event type, city, whether the couple uses Setnayan AI), **Accept inquiry** in orange, **Decline** beside it, and one line saying accepting costs nothing and does not book the date. The right column shows the customer and the *Full customer profile* button but no tools, because nothing they open would exist yet. The call icons are greyed and the AI strip is absent.

## 8. The three hardest trade-offs

1. **Two copies of a few tools.** Listing deal-or-meeting and calls in both the composer and the right column looks like the duplication we are removing. It is not: a listing does nothing, so two of them cost nothing, and the real defect was six *open* panels on screen, not two *names*. The rule "a listing opens; the tool acts" keeps it safe.
2. **The tool panel steals conversation height.** At its tallest it takes about 60% of the middle column. The alternative — a modal over everything — would hide the messages a supplier is quoting from. Keeping the newest messages visible above the panel was judged worth the squeeze.
3. **Calls in the header.** Putting phone and camera icons where Facebook puts them risks a supplier thinking a tap dials. It does not: both open the call panel, and the panel's first line says "Nothing has dialled yet." The convenience of the familiar spot won, with the safety moved into the panel.

## 9. Colours — every pairing measured

All text in the prototype clears 4.5:1 on its own background, in both themes. Measured from the rendered page, not estimated:

Light — body ink on white 14.3 · ink on cream card 12.8 · ink on the "you" bubble tint 12.5 · secondary text (#4F535B) on white 7.7, on cream 6.9 · faint labels and timestamps (#66696F) on white 5.5, on cream 4.9 · orange (#C24E25) text on white 4.8 · white on orange buttons 4.8 · link (#3B4E67) 8.5 · text-gold (#8A6B39) eyebrows on white 4.95 · Quoted pill 5.3 · Completed pill 5.7 · the two greys of the Cancelled/Inquiry pills 4.9.

Dark — ink on ground 14.9 · faint (#948E86) on ground 5.5, on card 5.1 · orange (#E8703F) text 5.8 · dark text on orange buttons 5.8 (white on that orange would be 3.1, so buttons flip to dark text in dark mode) · link 9.3 · gold eyebrows 9.3 · Quoted pill 6.9 · Completed pill 7.0.

Two things the measurement changed on the way: the house prototypes' light grey for faint text (#767A82) is **4.31:1** on white and was replaced with #66696F; and text-gold on the pale gold tint is **4.29:1**, so gold tints carry ink text, never gold text. Gold itself (#A9834B) is used only for icons and outlines, never for words.

## 10. Tap targets

Every control is at least 44px tall or carries an invisible 44px hit area around a smaller visual (the filter chips, the small card buttons, the Why/Tips link, the AI suggestions). Text-box icons and Send are 44px square.

## 11. What I found in the real code that contradicts the brief

- **The "approved prototype" the tool list cites does not exist.** The shipped tool list says its order was "approved on the prototype `prototypes/supplier_inbox_2026-09-08.html`". There is no such file in the corpus or in the checkout. The order was kept anyway, on the strength of the code comment.
- **There is no AI suggestion strip today.** See section 5 — the shipped assistant posts on its own; it does not suggest.
- **The shipped rail already refuses to be a container.** Its own notes explain that the column renders twice and the tools mount once — the brief's first hard constraint is already the code's rule, so this design extends it rather than arguing with it.
- **The couple's list has no filters or money state today**; the "Has a quote / Booked / Waiting / Closed" chips and the "Quote ₱…" tags on the couple's rows are new.
- **The couple's safety banner can be dismissed for good** (remembered on the device). The one-line-plus-Tips treatment keeps that behaviour; the supplier's notice is never dismissible, also as today.
- **"Log payment" is not a tool, it is a jump.** It scrolls to the couple's logged-payment cards; the prototype shows that honestly with a count badge rather than pretending there is a panel.
- **The stage is derived** from four facts (finished · booked · quoted · thread ended) and there is no writer for it anywhere — the prototype's sentence under the pill exists so nobody asks for a dropdown again.
- **The rail on a 900px-tall window scrolls by about one row** to reach *Log the outcome* and the profile button — the same behaviour as the shipped rail, kept rather than squeezed.
