# Controller queue — between the owner desk and the controller

Two sessions, one plan (owner, 2026-10-01):
- **Owner desk** (separate session): the owner's questions, ideas and improvements. Researches (Rule 0: find the shipped thing first), has Fable draw designs, records owner decisions in `DECISION_LOG.md`, and writes ready-to-build prompts here. **Never builds, merges or deploys.**
- **Controller** (the build session): the final say on order, model and timing. Reads this file, runs builders, merges through green CI, deploys, and writes back here what the owner must do or decide.

Rules: newest at the top of each section · one item per line or block · a build item must name its DECISION_LOG row(s), the design file (if any), and the shipped files it extends · the controller moves items between sections, the desk only adds.

## 1 · Ready to build (desk → controller)
<!-- Format: - [ ] YYYY-MM-DD · Title · DECISION_LOG row "…" · design prototypes/… · extends <files> · suggested model (Sonnet = small/mechanical, Opus = schema/Maker/money) · full prompt below or in BUILD_PROMPTS_*.md -->

## 2 · Needs the owner (controller → desk)
<!-- Questions with a recommendation, owner actions (sign in, approve a design, check a phone card). -->
- [ ] 2026-10-01 · Create the view-only Google Sheets guest-import template in Setnayan's Drive and share its link (for the "Open in Google Sheets" button, #6225 follow-up).
- [ ] 2026-10-01 · Review the per-event-type starter supplier categories in Admin › Event type › Scope categories once P3 lands.
- [ ] 2026-10-01 · Sign in to the TEST wedding in the Browser pane so the controller can walk the Maker + RSVP at phone size.

## 3 · In progress (controller)
- 2026-10-01 · P2 onboarding engine · P5a admin · P4 supplier app · P3 supplier inbox + find · P10 /features pages · font dropdown #6160 · palette styles · P7 Maker names/date (Mac) · #6225 CI fix (Mac, Sonnet)
- Next when a Maker slot frees (max 2 Maker builders): the simplified Event Hub Maker — `prototypes/maker_in_four_2026-09-30_fable.html`, DECISION_LOG "THE MAKER RE-PLAN IS CUT TO ITS CORE" + "THE MAKER IN 4 IS A DIRECTION, NOT A COUNT".

## 4 · Done (controller, with PR + live SHA)
