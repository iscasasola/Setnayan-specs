# The invite link — three doors, five themes (2026-09-10)

The owner's decisions (DECISION_LOG.md, 2026-09-10 row "the invite link is an arrival"):

* **The invite link is an arrival, not a form.** It finds or adds the guest on the list, takes
  their details, makes the email they give their sign-in, and hands them into the Event Hub.
* **Three doors: Name · Reply · Enter.** Continue with Google / Apple sits at the top of Reply.
* **Five themes.** House (Generic) is free, with nothing to edit. Capiz (Elegant), Velvet (Classy),
  Galeriya (Sophisticated) and Abaca (Rugged) are part of **Event Hub Pro** (`COUPLE_WEBSITE_PRO`,
  ₱3,500).
* **The background is the couple's reveal background**, colours are the couple's own, and the
  cinematic reveal opens the invite: one concept, reveal → door 01 on the same background.

## What is built (verify with `gh pr view <n> --json state,mergedAt`)

| PR | What a guest or couple gets |
|---|---|
| #5403 | The three doors. Door 01 asks only for a name; door 02 is the Event Hub's own reply card; door 03 hands them into the Event Hub. Live 2026-09-10. |
| #5409 | Themes: the `events.invite_theme` column (NULL = House), the picker on Guests → Invite link, the Pro gate, and the **Capiz** skin. Velvet, Galeriya and Abaca are registered but `ready: false`. |
| #5410 | A Pro theme opens with the couple's cinematic reveal on door 01 — the Event Hub's own reveal, under the Event Hub's own rule (not on the day, not for a wake). |

## The designs — port these, never redraw them

`designs/` holds the design files the owner reviewed (drawn with Fable, then tightened). Each is
a single HTML page at a 375 px phone; `reveal-bg-sample.jpg` stands in for a couple's reveal
background (it is one of the app's own public presets, no people).

| File | Theme | Faces | Default opening |
|---|---|---|---|
| `house.html` | House · Generic · Free | the app's own | none |
| `capiz.html` | Capiz · Elegant · Pro — **shipped, the pattern to copy** | Cormorant Garamond · Hanken Grotesk · DM Mono | sheer veil |
| `velvet.html` | Velvet · Classy · Pro | Bodoni Moda (already in the repo) · Jost | four-flap |
| `galeriya.html` | Galeriya · Sophisticated · Pro | Schibsted Grotesk · DM Mono | sheer veil |
| `abaca.html` | Abaca · Rugged · Pro | Alfa Slab One · Bitter · Oswald | four-flap |
| `five-invite-doors.html` | the lineup page the owner saw, with the open questions | — | — |

Published copy of the lineup: https://claude.ai/code/artifact/938658cb-2a5e-4e0e-a3d6-8f022f82b001

What is left, in order, with a prompt for each session: `01_WHAT_IS_LEFT_SESSIONS_2026-09-10.md`.
The owner answered its seven questions on 2026-09-11 (1 A · 2 A · 3 A · 4 B · 5 A · 6 B · 7 A — see
`DECISION_LOG.md`); the prompts build those answers.
