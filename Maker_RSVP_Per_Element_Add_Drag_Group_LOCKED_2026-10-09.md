# The Maker's RSVP stage — each line its own part; ＋, drag and Group — owner rulings, 2026-10-09 (evening)

Continues `Maker_Animate_Preview_Scrub_LOCKED_2026-10-09.md`. Every sentence in quotes is the owner's (Ice Casasola),
said while looking at the live new Maker (internal only) and two clickable prototypes:
`prototypes/maker_rsvp_per_element_2026-10-09.html` and `prototypes/maker_rsvp_add_drag_group_2026-10-09.html`.
The build is local (branch `rd/rsvp-stage-per-element`); nothing of it is on GitHub or in production.

## 1. What he hit on the live RSVP stage
- "RSVP background not working. how come background not fixed and no animate? why is this grouped?"
- "why do i see a rounded edge frame as well?" (two rounded frames around the RSVP part)
- "why is this scrolling? the bottom toolbar is not aligned to our design" (Style showed the old list of every answer)
- "shouldn't it be per element?"
- FOUND (code): the Look's background already reaches the RSVP pages; what was grey was the toolbar's Background and
  Animate on the RSVP form, which was one fixed block. `events.rsvp_backdrop` is a different, older thing.

## 2. Each line is its own part
- On the per-element prototype (When yes, card picked): "i like this idea. heading message then the whole group?"
- RULING: every line of the reply pages is picked on its own — Form: Eyebrow · Question · Yes answer · No answer · Hint;
  When yes: Heading · Message · the pass's Save button; When no: Heading · Message — and the card (the whole group) is a
  part too. The toolbar shows only the picked line's rows. One frame, never two.
- Stored with the RSVP words in `events.rsvp_ask_config` (new optional keys; absent = today's look; fixed-list values
  only; saved through the draft; no migration). Controller's decision under the owner's delegation.

## 3. ＋, drag and Group
- "but my question is why should we have this concept across the stages? how to add elements/ scenes? can we cdrag and
  drop the element. similiar to the concept of wedding march. the grouping can be like this. multiple select elements
  create a background together? but how can we do that?"
- "we already had the +" → "you removed it" — the ＋ had been switched off on the RSVP stage (pages treated as fixed).
- RULING (prototype `maker_rsvp_add_drag_group_2026-10-09.html`, answered "ok"):
  - ＋ is back on the RSVP stage, on the picked line's frame (top and bottom edge). It adds a line: Heading · Message ·
    Picture. Never the invitation's scenes.
  - Hold a line (about 350 ms) to drag it; the others make room; matched to the Wedding March. Earlier · Later stay.
  - Group: Edit's last row → tap the lines → "N picked · Done · Cancel" → they share ONE background (None · Plain ·
    Frosted) and move as one; Ungroup undoes it. A line in a group is still picked on its own for Edit and Style.
  - Only lines the couple ADDED can be removed; the reply form's own lines cannot.
  - When a group is made the big RSVP card switches to None, so the group's background shows.
  - A line cannot leave its group on its own; Ungroup is the one way out.
- NOT RULED: the same three things on the other stages (his first question). Controller's recommendation: one concept
  everywhere, after RSVP is seen working. Not built, not promised.
- NOT PROVEN: the prototype ran in simulated touch at 375×812 and 441×882 only; no real iPhone.

## 4. What was built locally on 2026-10-09 (steps 1–4 of 7; nothing on GitHub or live yet)
- Step 1: every line picks on its own; the card's side picks the whole group, named "Card".
- Step 2: Edit shows only the picked line's words (+ "Start from" on the two answers). Three new optional words:
  the form's Eyebrow, Question and Hint. Untouched, the card prints what it printed before.
- Step 3: Style per line = Colour (the page's own, or one of the event's five colours, stored as a slot 1–5 so it
  follows the event's colours) and Size (85 · 92 · 100 · 110 · 120 · 132 %). A button has Size only.
- Step 4: the card's Background = None · Plain · Frosted; Animate per line and for the card = Build in only
  (Fade · Blur · Move · Size + Movement Quick · Calm · Cinematic). A reply page is one screen with no scroll to
  follow and no exit, so Action and Build out are not offered there (controller's decision).
- STORED in `events.rsvp_ask_config`: the three words, and one key `look` =
  `{ lines: { '<part>.<line>': { c, s, i, v } }, card: { '<part>': { g: 'none' | 'frost', i, v } } }` — line keys rsvp.eyebrow · rsvp.question · rsvp.yes · rsvp.no · rsvp.hint · yesnote.heading · yesnote.message · pass.save · nonote.heading · nonote.message; card keys rsvp · yesnote · nonote; c = 1–5 (never on a button), s = 85 · 92 · 110 · 120 · 132 (100 not stored), i = the Event Hub's effect object, v = quick | cinematic. Absent = today's
  look. Fixed-list values only; nothing typed reaches CSS. The app's save refuses at 1,900 bytes with a plain sentence
  ("It is too long to keep: your RSVP's words and looks are at their limit. Shorten a message, then try again.").
- DATABASE: the column has a 2,048-byte CHECK (migration 20271247938209). Steps 5–7 (added lines, pictures, order,
  groups) do not fit. Owner, asked "Shall I include that database change in the next batch?": "yes". The migration
  raising the cap rides the next batch through the pipeline; never applied by hand.
- When no has two cards on the real page. Rule: untouched = today's look; once the couple chooses None or Frosted,
  the inner note card gives up its own paper so ONE card shows (owner: "why do i see a rounded edge frame as well?").
- Also fixed: the cookie card can no longer sit over the reply pages inside the Maker's canvas.

## 5. Four fixed blocks get Animate (built 2026-10-09 evening; draft PR #6471, not merged)
- Owner's rule (2026-10-09): "there should always be animate and background?" → "yes that is what we are doing. giving
  the freedom to fix their event hub." Built for the FOUR fixed blocks that have one real root on a guest's page:
  Wedding March · The details · E-Gifts (only when the event has gift details) · Happening now. Full Animate (Build in ·
  Action · Build out, Movement, Plays, Delay) through the Event Hub's scroll-aware motion.
- STORED in `events.style_preferences.block_looks = { entourage | details | gifts | spotlight: { motion } }` (the Event
  Hub's own motion shape; no migration — proved on the replayed schema: no CHECK or trigger touches the column).
  Absent = today's page.
- NOT built: Background for those four (rule decided: the same three tiles; nothing stored = today's look, today's tile
  shown picked; grey with a reason where a card would break the layout).
- SIX blocks stay grey and say why — Your seat · Photos of you · Announcements · Live hub · Digital pass · What to wear:
  what the Maker shows is a sample; each guest's real one is another component. Their real surfaces are not mapped.
- For steps 5–7 (＋ · drag · Group), the builder's sums for the size cap: worst case ≈ 17,300 bytes with at most four
  added lines per screen → database CHECK 24,576 bytes, the app's refusal at 19,000. The migration's own test must
  measure `pg_column_size` of the worst case in the replay before the number is fixed. Not written yet.
- OPEN for the owner: a line's Colour row shows six circles; his rule elsewhere in Style is one circle.
