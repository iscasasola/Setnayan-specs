---
name: setnayan-the-wakes-refusal-was-one-gate
description: "\"The joyful recap is refused for a wake\" named ONE gate that also withheld the whole story; and /[slug]/recap has no solemn gate at all — don't repeat either claim without re-measuring"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9bd0e178-c61d-43d8-94d5-7801234e9228
  modified: 2026-09-09T13:13:23.752Z
---

In `setnayan-platform`, the sentence *"shipped code already refuses the joyful auto-composed
recap for a wake"* appears in the design corpus and in `event-words.ts`. Measured 2026-09-09
(S13, PR #5374) it was **narrower and broader than it sounds, in two different directions.**

**1 · It was ONE gate doing TWO jobs.** The whole refusal was
`solemnAdjustedPhase(phase, solemn)` demoting `'editorial'` → `'rsvp'`. The **story lives in the
editorial phase**, so the gate that withheld the recap withheld the story with it — a wake got
no story at all. Owner ruled 2026-09-09 (arm b) that a wake GETS a story, so it now demotes
`save_the_date` only. **Re-adding `'editorial'` there silently deletes the wake's story**;
`the-wake-never-celebrates.test.ts` pins it in the opposite direction with the ruling attached.

**2 · `/[slug]/recap` has NO solemn gate whatsoever.** It checks
`surfaceEnabled(profile, 'website')` and `isRecapPublished(eventId)` and nothing else;
`lib/auto-recap.ts` contains **zero** occurrences of `solemn` or `register`. So the "refusal"
never covered that route — only a host deliberately publishing is what keeps it away. Do not
assert the recap route refuses a wake without re-reading it.

**Why this matters:** granting the editorial phase looked like it would resurrect the joyful
recap onto the wake's story. It does not, and that is *measured*, not reasoned:
`composeCopy`'s joyful output is not rendered under the spine at all — S9's spine "replaced the
masthead and the lead", and the only field the story still takes from the composer is
`pullQuote` (the host's own `special_message`). The body reads `data.draft.leadParagraphs`
falling back to the host's own prose.

**How to apply:** before changing anything keyed on the solemn register, grep for what the gate
actually reaches rather than trusting the docblock naming it — and check whether the surface you
think is protected is protected by *that* gate or by something else entirely. Relive is gated on
the REGISTER, never on `slides.length`: a wake HAS minutes, so an emptiness gate is green on the
empty story and wrong on the real one. See [[setnayan-guards-must-test-the-claim]] and
[[setnayan-story-layer-gate-s3-landed]].
