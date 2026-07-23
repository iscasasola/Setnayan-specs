# Find Your Date — Guest+Vendor Poll → Top 3 · Spec · 2026-07-18

> Owner direction (2026-07-18): extend the existing "Find your date" (Schedule Matrix / Date Finder) so it polls **key people** for their date availability, combines that with **vendor** availability, runs a systematized status analysis per candidate date, and shows only the **top 3 best picks**. Owner confirmed interpretation **(b)**: guests genuinely vote on dates (not a slip for the couple's own picks). Prototype (top-3 result): Claude artifact `date-finder-top3` — https://claude.ai/code/artifact/8c32e2af-26e4-4159-8e85-425bf4a4c25d. NOT built — spec for Opus.

## What exists vs what's new
- **Exists (reuse):** the Date Finder engine — `find-date` surface + `lib/schedule-matrix.ts` + `lib/vendor-availability.ts` (vendor_calendar_blocks). Today it ranks candidate dates by VENDOR availability only. Design-locked in `Schedule_Matrix_and_Date_Finder_2026-06-02.md`.
- **NEW — the guest/key-person date poll.** The couple selects a small set of **date-critical people** (principal sponsors ninong/ninang · immediate family · core entourage — chosen from the guest list / role sets, NOT all 200 guests), sends each a lightweight poll, and each marks availability per candidate date. This availability feeds the ranking alongside vendors.

## The model
1. **Candidate dates** — the dates the couple is weighing. *Dependency: these come from the onboarding Phase-4 capture (`date_candidates[]` / `date_window`, migration `20260719000000`) which is UNPOPULATED until that commit lands. The poll needs ≥2 candidate dates to be worth running.*
2. **The poll (new):** couple picks voters → each voter gets a link (reuse the RSVP/personal-link pattern — **no account required**) → marks free / maybe / can't per candidate date. Store: `date_poll` (per event) + `date_poll_responses` (voter × date × status).
3. **Vendor availability (existing):** per candidate date, how many shortlisted vendors are free (`vendor-availability.ts`).
4. **Systematized status analysis + ranking (extend `schedule-matrix.ts`):** each candidate date scored on a **combined** signal — weighted key-person turnout × vendor availability. Weighting: principal sponsors / immediate family count more than general voters (role-based weight). Output the per-date breakdown (turnout count + who-can't + vendor combination).
5. **Top 3 only.** Cap the output at the **3 best dates**, best first — turns a matrix into a decision. Each card shows: the date · a verdict (Best pick / Strong / Good) · "X of N key people can make it" (+ the notable absences) · vendor availability (which are free / booked) · a "Lock this date" CTA.
6. **Live + honest:** ranking updates as replies arrive; the couple sees "still waiting on N replies" and gets a nudge if a late reply changes the top pick. No fabricated data (real poll + real vendor calendars only).

## Differentiator
Not a Doodle poll (people only) and not a vendor calendar (vendors only) — it matches **people AND vendors to the same dates**. "We find the date your people *and* your vendors can all make." That's the moat.

## Cross-event-type
Even stronger for group / community-eligible events (barkada dinner, reunion, anniversary) where the whole group votes — the poll IS the primary mechanic there, and vendor availability may be light or absent (a dinner date just polls the barkada). Same engine, weights shift toward the people side.

## Free tool
Stays FREE (flywheel / acquisition — a poll link pulls key people into a Setnayan touchpoint, and it converts a couple into an active planner). Not a paid SKU.

## Privacy (RA 10173)
- The poll collects **voters' date availability** — minimal, self-provided PI via a link (no account). Add a purpose line to the data map / ROPA (ties to the privacy reconciliation work).
- **Self-scoped:** who-said-what is visible to the COUPLE (they need "Ninang Cora can't"), never exposed to other guests/voters. A voter sees only their own responses.
- Link-based, single-purpose, expirable — same posture as RSVP tokens.

## Build order (for Opus, after the onboarding candidate-date capture lands)
1. `date_poll` + `date_poll_responses` schema (RLS: couple-scoped read of aggregates + own-response read for voters).
2. Voter picker (from guest list / role sets) + poll-link generation (reuse RSVP/personal-link infra).
3. Voter poll page (link, no account): candidate dates → free/maybe/can't.
4. Extend `schedule-matrix.ts`: combined weighted score (people turnout × vendor availability), role-weighted, → top 3 with per-date breakdown.
5. Result surface (per the prototype) + live-update + "N pending" + top-pick-changed nudge.
6. Surface the tool prominently in the Suite free layer (promote from strip-chip to a featured free helper) + wire the secretary's "Lock your date" step to open it (see the Suite prototype). *(The surface was briefly named "Silid" during its first build; renamed to Suite — the code is `/suite` / `SUITE_NAME` / `NEXT_PUBLIC_SUITE`.)*
