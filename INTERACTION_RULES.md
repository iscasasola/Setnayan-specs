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
