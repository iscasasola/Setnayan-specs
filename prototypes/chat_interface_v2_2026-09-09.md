# The chat, both sides — v2: the Decisions view, and four owner decisions drawn

**Prototype:** `chat_interface_v2_2026-09-09.html` (open it in any browser; no server, no fonts, no CDN).
Five frames along the top: Supplier · desktop, Supplier · phone, **Couple · from the plan (new)**, Couple · desktop, Couple · phone.
The Dark button shows every frame in dark mode. Everything from v1 is kept as it was — this is an extension, not a redraw.

Handy links: `?tab=sd|sm|cp|cd|cm`, `?theme=dark`, `?state=pending`, `?open=<tool>`, `?sheet=1`, and new: **`?view=decisions`** / **`?view=files`**.
(One caveat: a viewer that renders the file as a data: snapshot drops the query string; in a normal browser tab the links work.)

---

## 1. Decisions — what it looks like

Above the conversation, under the one-line privacy notice, there is a small three-way switch: **All · Decisions · Files**. It is one row, on desktop and on the phone.

- **All** is v1's conversation, untouched.
- **Decisions** drops every text bubble, every "accepted your inquiry" line and every day divider. What stays is the cards, oldest to newest, each stretched to full width: the quote, the meeting request, the couple's logged payment, the guest-count change (and on the couple's side, a supplier's payment ask). The Decisions button carries two small numbers: how many cards there are, and — in terracotta — how many are waiting on *you*.
- **Files** shows only what was shared: photos inline, documents as a chip with name · size · who sent it · when · Open · Download. One line at the top says "3 files · 2 from Cale & Ice · 1 from you".

Above the cards in Decisions sits **one standing line**, in a white box with a gold left edge:

> **Booked** · Quote ₱187,500 · accepted 1 Sep · Tasting **Sun 27 Sep · 11 AM** · confirmed · Paid ₱50,000 of ₱187,500 · **1 for you to confirm** · Guests now 170 (quoted 150) · **price not answered**

with a pill in its corner: **2 need you**. The line is drawn in three states:

| State | Drawn where | The line reads |
|---|---|---|
| Nothing yet | Supplier phone 3 (Mara & Rui, not yet accepted); also the desktop when you flip it to "New inquiry" | *Nothing decided yet. Accept the inquiry to start — every quote, meeting, payment and change will collect here.* Decisions shows "0". |
| One thing outstanding | Couple phone 2 (Lumen Studios) | **Quoted** · Quote ₱95,000 · sent today · valid until 20 Sep · **waiting for your answer** — with "1 needs you". |
| Several | Supplier desktop and phone 2 (Cale & Ice); couple desktop (Hiraya) | The full line above. On the couple's side the same facts from their seat: "You paid ₱50,000 · **waiting for Hiraya to confirm** · Count 170 · **Hiraya deciding on the price**", and the corner pill says *nothing needs you* in green, because on that side nothing does. |

## 2. How a card shows where it stands now

Every card ends with one dashed-off line labelled **NOW**. That line is the whole point; without it the filter is a tidy list of old announcements.

- **The quote** was sent on 22 August as ₱187,500 for 150 guests. Its body still says exactly that. Its NOW line says: **Booked** · accepted by Cale & Ice · **1 Sep**. In the All view you scroll past it and see it has moved on; in Decisions it is the first card and the pill matches the header.
- **The meeting** was asked for Saturday 26 September at 2 PM. The body shows that time struck through. NOW: *moved to* **Sunday 27 September · 11:00 AM** *· confirmed by both · 26 Aug*. The messages that moved it are two bubbles below it in All, and gone in Decisions — you don't need them, the card carries the outcome.
- **The payment the couple logged** (₱50,000 · GCash · 5 Sep) is outlined in terracotta because it is waiting on the supplier. NOW: **waiting for you** · 4 days · ₱50,000 of ₱187,500 would be paid. The Confirm / Not received buttons stay on the card in both views.
- **The guest-count change** — now planning for 170, you quoted 150. NOW: **waiting for you** · the quote still reads 150 guests · ₱187,500. Apply +₱25,000 / Hold price at 150 stay on the card.

Each card's eyebrow also carries *when it was sent* on the right ("sent 22 Aug 10:51"), so "then" and "now" sit on the same card and nobody has to reconstruct the order.

### The words on the cards — one ladder, not two

Only the five stage words wear a coloured pill anywhere: **Inquiry · Quoted · Booked · Completed · Cancelled** — the same pill as the header, the rail and the list rows. A card wears one only if it is the thing that moved the stage: a quote wears **Quoted** while it waits and **Booked** once accepted; a declined or withdrawn one would wear **Cancelled** in grey. Meetings, payments and guest-count changes never wear a pill — a meeting does not book anything, so it must not say Booked; it says *moved to Sun 27 Sep · confirmed*. Every other state is a **dated sentence** ("accepted 1 Sep", "waiting for you · 4 days", "Hiraya deciding"). "Needs you" is the terracotta outline and the count in the corner, never a sixth word. The standing line is built from those same NOW sentences, so it cannot disagree with the pill above it.

## 3. How the couple now reaches a conversation

There is no couple inbox. The new **Couple · from the plan** frame shows the plan's *Suppliers* page:

- One line at the top: **2 suppliers replied** — Kusina ni Aling Nena (catering) · Lumen Studios (photo & video) — with *Read them*.
- **Catering, comparing 3**: three cards side by side — Hiraya (**Booked**, ₱187,500, their answer, the standing line), Kusina ni Aling Nena (**Quoted**, ₱165,000, a new reply, terracotta dot, "waiting for your answer"), Feast & Co. (**Inquiry**, nothing yet, "waiting for them to accept · 3 days"). Each card's standing text is the same sentence its conversation's Decisions view would show, so reading three caterers here *is* reading three Decisions views at once. This is the comparison an inbox could never do and the thing we must not lose.
- **Open conversation** on any card opens *that* conversation. Not the list, not a form.
- **Cake, from the marketplace**: three shop cards with a **Message** button. It opens the conversation straight away with the shop and the event already known; if one already exists with that shop, it resumes it.

In the conversation itself the left column stays — the couple still moves between the suppliers they are talking to — but it is headed **‹ Plan** and nothing in the couple's navigation points at it on its own. On the phone the first screen *is* the plan's category list (Catering with its three answers stacked, then Photo & video, Venue, Cake), each row carrying the stage pill, one line of their answer, and the standing line with "your answer" in terracotta where it is the couple's turn.

## 4. Who else wants that day (supplier only)

The **Target date** row in the supplier's rail now reads:

> **Dec 18, 2026** — **2** other couples asking about 18 Dec · **1** booking held that week
> *Your pipeline only — the couple never sees this line.*

The same sentence sits on the accept card of a new inquiry ("18 Dec — 2 other couples are asking you about this date · you hold 1 booking that week. Accepting does not book it."), and on the phone's ⓘ sheet. Counts only, never names. The couple's rail carries a comment in the HTML at the spot where the line would be, saying it is deliberately absent. If it ever becomes a link, it should open the supplier's own list filtered by that date — never a card naming who the others are.

## 5. Every guest count says which count it is

| Where | Reads |
|---|---|
| Conversation header (both sides) | planning for **~170 guests** · was 150 at inquiry |
| Supplier rail · Guests | **~170 now** — 150 at inquiry · you quoted 150 |
| Accept card (new inquiry) | 150 pax **· at inquiry** |
| Build a quote · Guests field | label: *their plan says 170 · you quoted 150* |
| Quote card | ₱187,500 · **quoted at 150 guests** |
| Guest-count-changed card | Now planning for 170 — **you quoted 150** |
| Couple rail · Your guest count | **~170 now** — 150 when you asked · Hiraya quoted 150 |
| Couple phone (Lumen) | ~170 now · 170 when you asked — the case where nothing moved, so the same label reads plainly |

Money rides on which number, so no count is ever shown bare.

## 6. Files

- **A photo** shows inline as a picture with its filename and size stamped in the corner; from the couple it sits on the left, from you on the right.
- **A document** (PDF · Word · Excel · plain text, up to 25 MB each) is a chip: an icon with the type, the filename, "1.2 MB · from Cale & Ice · 1 Sep", then Open and Download as 44px icon buttons.
- The paperclip opens an **Attach** panel like any other tool — one at a time, zero space closed, × and Esc to leave. On the phone it offers *Photo or video* and *Document*.
- **Files** in the switch lists only those, so a supplier finds the signed contract without scrolling.

⚠ **Not drawn, on purpose:** the stored files currently land on a public web address (the upload goes to the public media bucket, not the private thread-files one; the code's own comment tracks signed-URL access as a follow-up). That is being fixed separately and this design does not depend on it either way.

## 7. One tool added to the supplier's list

**Ask for a payment** — a figure, a due date and what it is for, sent to a booked couple as a card. It ships in the real app and v1's tool list had missed it. It sits under Send proposal, before Log payment, because the ask and the confirmation are two halves of one thing: the supplier asks, the couple pays them directly and logs it, the supplier confirms it on the card.

## 8. Constraints, restated and kept

- The rail still holds only launchers; Decisions and Files are views of the conversation column, not the rail, so nothing new has to render twice.
- One tool open at a time; closed tools take zero space; every tool has × and Esc. The Attach panel obeys the same rule.
- A launcher opens; the tool acts. Nothing in the switch or the plan cards performs an act — Confirm, Apply, Accept all stay on the cards.
- Phone frames are 375×812 and interactive: the switch, ⓘ, the tools, the sheets, the plan rows.
- 44px targets throughout; the segmented switch buttons are 40px tall with an invisible 3px halo above and below (46px hit).

## 9. Colours — every new pairing measured, both themes

Computed from the token values in the file (light / dark):

- Switch, selected: page on ink **14.3 / 14.9** · idle: secondary on page 7.7 / 8.2
- Standing box text: ink on page 14.3 / 14.9 · **terracotta "needs you" on page 4.76 / 5.76** · green "nothing needs you" on its tint 5.65 / 7.0 · gold eyebrow on page 4.95 / 9.3
- The "N need you" count: white on terracotta 4.76 / dark ink on the dark orange 5.76
- Card NOW line: secondary on page 7.7 / 8.2 · its label 5.5 / 5.5 · terracotta bold on an outlined card 4.76 / 5.76
- File chip: name ink 14.3 · meta 5.5 / 5.5 · type icon 6.9 / 7.6
- Photo caption: white on the 62% dark overlay — 7.0 over the lightest corner of the placeholder, 9.6 mid, 12.7 dark
- Pipeline counts in the Target-date row: terracotta on page 4.76 / 5.76; the explanatory small line 7.7 / 8.2
- Plan cards: the answer block ink on cream 12.8 / 13.8 · standing text 7.7 / 8.2 · terracotta bold 4.76 / 5.76 · pills unchanged from v1 (Quoted 5.3 / 6.9 · Completed 5.7 / 7.0 · Booked 4.76 / 5.76)

**Two failures caught and fixed before shipping the file:** the standing box was first drawn on the cream card ground, where the terracotta "needs you" text measures **4.25:1** and gold-text measures **4.42:1** — both under AA. It now sits on the white ground with a gold left edge, where they measure 4.76 and 4.95. Gold `#A9834B` is still icon-and-edge only, never a word.

## 10. What I found in the real code that contradicts this brief (or v1)

Checked against `origin/main` of the code repo, not against a doc.

1. **The stage ladder on `origin/main` is the five words the brief names** (Inquiry · Quoted · Booked · Completed · Cancelled). A first read of a local branch returned a four-rung *Inquiry · Quoted · Booked · Delivered* — that branch is stale; the relabel-plus-widening to Completed/Cancelled is on main. The design uses main's five words.
2. **Only three of the four message markers render.** A message can carry a quote, a meeting, a change or an adjustment, and the stream draws the quote, the meeting and the adjustment. The *change* marker has **no renderer** — the shared card shell even names a change-order card file that does not exist. So "Decisions" today would silently omit changes. This needs building before the view can claim "every card".
3. **Two of the cards the owner named are not in the message stream at all.** The guest-count-changed card and the couple's logged-payment card are page sections rendered *around* the stream on the supplier's thread page (the payment one is jumped to by anchor). Decisions therefore has to collect from three sources — the four message markers, the pending guest-count proposals, and the pending payments — and sort them into one timeline. The design assumes that merge; it is not free.
4. **A supplier's payment ask does not land in the chat.** It renders on the couple's *workspace* page for that supplier, not as a message card. Drawing it as a launcher in the supplier's rail is faithful to the tool; showing its card in the couple's Decisions view would be new wiring.
5. **The couple's "Message" is two different things today.** From the shortlist, *Inquire* already opens the specific conversation (and resumes an existing one, because a couple can only have one thread per shop). From the budget page and the follow gate, the link goes to `…/messages?prefill_vendor_email=` — the list with the pill "Pre-filled from vendor profile · just tap Start thread", which is the screen the owner objected to. And the supplier workspace falls back to the plain list when no thread exists yet. So the fix is not one button; it is retiring the prefill path and the list fallback in favour of the resolver the shortlist already uses.
6. **"Who else wants that day" half-exists, in two places, neither of which is what the owner described.** The supplier sees a *pipeline pressure* line ("You're chasing 2 of 3 customers for 18 Dec") — but only on a not-yet-accepted inquiry, and it counts against the tier cap, which is switched off in production. And a **couple-facing** line already exists on the marketplace bench: "N couples inquired for your date", floored at three, shown *about* the supplier. The brief said such a count must never appear on the couple's side; today a floored one already does, outside the chat. The v2 line ("2 other couples asking · 1 booking held that week") is a new, simpler read on the supplier's own inquiries and bookings; whether the couple-facing marketplace line should stay is a separate owner call.
7. **There is no "dates held" count for a supplier anywhere.** The "1 booking held that week" half of the sentence is new data, derived from the supplier's own bookings.
8. **The guest-count header sentence is already exactly what v2 draws** — "Planning for ~170 guests · was 150 at inquiry" ships on both sides, and shows the second half only when the count went up. The accept card and the rail do not say which count; that is the delta.
9. **Attachments match the brief exactly**: images, PDF, Word, Excel, plain text; 25 MB each; images inline, others as a name + size + download row. And the public-URL problem is real (see § 6).
10. **Kept from v1, still true:** the AI strip is a "suggest, don't send" design and what ships is a bot that posts on its own (off by default); the "approved prototype" the shipped tool list cites does not exist; the stage is derived and has no writer, which is why there is no dropdown.
