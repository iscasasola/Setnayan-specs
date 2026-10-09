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
