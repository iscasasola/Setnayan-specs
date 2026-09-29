# RSVP + Invitation release — live before Oct 1 (plan, 2026-09-30)

> **OWNER DATES (2026-09-30, verbatim): "Oct 1 release of RSVP and INVITATION · Oct 3 THE DAY and POST EVENT".**
> Oct 1 = everything in the table below. Oct 3 = each tab its own full page (Invitation + The Day, reusing hub-shell) · The Day menu Live · Welcome · Camera · Gallery · Me · Post Event (train n #6166 / #6156 scene styles + Post Event, fixed and re-checked). Profile and Name style ride alongside when they don't risk Oct 3. Maker core (Lane A/B) + Themes follow (target Mon 5 Oct).


Owner, verbatim: *"we really need to release RSVP before Oct1"* · *"our build needs to be safe for releasing RSVP"* · *"this means we need to fix both RSVP and Invitation"*.

## The rule
One release that carries ONLY RSVP + guest Invitation work. Everything else is held (label `do-not-auto-merge`, auto-merge off) until this is live and walked through. After it is live: **freeze the guest pages** while friends reply — new findings go on a list, not into prod.

## In the release (PR · what the guest sees)
| # | Item | PR / branch |
|---|---|---|
| 1 | No email to guests; digital tickets; requester gets a pending ticket; thank-you | #6157 `rd/owner-answers-0929` |
| 2 | Yes / No only — no "maybe" | #6167 `rd/rsvp-no-maybe` |
| 3 | Sponsor names: no role under every name; secondary sponsors grouped; pairs on one line | #6165 `rd/entourage-no-repeated-role` |
| 4 | Home-screen card removed; camera terms = small card | #6168 `rd/no-home-screen-card` |
| 5 | Digital ticket on **Me** only; Home loses the pass, keepsake, summary card, "Need to change your reply", scan-trail notice (opt-out moves into Your details) | `rd/hub-shows-the-ticket` (building) |
| 6 | Seat plan only on the event day; no table on the ticket; no "Find your seat" before the day | `rd/seats-show-on-the-day` (building) |
| 7 | A login never grabs someone else's seat; sign-out clears the guest cookie; safe Unlink | `rd/seat-links-only-on-purpose` (building) |
| 8 | Dress code: couple can hide the outfit figure; Do's & Don'ts editable in place | `rd/dress-code-figure-toggle` (building) |
| 9 | Best Woman · either-or honour attendants · rename roles (Bride's Crew / Groom's Crew) | `rd/best-woman-matron` (building) |
| 11 | Maker: **Page ▾ Home · Details · Story · Me** dropdown at the top of the navigator (jumps, never filters) so the couple fixes each guest page — Maker only, guests unchanged | `rd/maker-page-dropdown` (building) |
| 12 | Venues: name/address/buttons readable (≥4.5:1); venue photo from the booked supplier's own photos (couple picks, cover by default), manual upload if none; address already from the supplier | `rd/venue-cards-readable-with-photos` (building) |
| 13 | Custom QR: a round QR sits in a ROUND slot on every print + ticket (never a square frame round a round QR) | `rd/round-qr-round-slot` (building) |
| 14 | Every guest's QR ready: every guest row has a token; ticket QR uses the event's QR look and decodes to that guest | in `rd/hub-shows-the-ticket` |
| 15 | Invitation **Home** = the guest's own page: their Mood Board look · Reminders (couple-set) · E-Gifts shown now | `rd/invitation-home-is-personal` (building) |
| 10 | Invitation text fixes from the guest-side audit (list: scratchpad `invite-audit/REPORT.md`, "blocks sending" + "should fix" only) | one small PR after the audit |

## Held until after the release
Train n #6166 (event menu + scene styles/Post Event) · #6160 font dropdown · #6164 Both view · #6162 Partner + handshakes · palette styles · #6161 Patiktok · #6159 Discover · all Maker re-plan lanes (start ~11:30 only once this is verified).

## Order
1. Builders finish → each PR green on its own.
2. ONE train branch folding 1–10, baseline regenerated once, ONE CI run.
3. Auto-merge only after every check passes (never --admin) → deploy (`deploy-prod.yml`) → confirm the version on `/api/health`.
4. Phone walk-through (390 px) on the TEST wedding `cc47d373-…` — never the owner's real one: guest opens the link → finds their name → fills details (+1s) → gets the digital ticket → connects an account; couple uses Send invite / Copy message. Timed, with pictures.
5. Owner sends. Freeze.

Target: live ~10:00 AM 30 Sep PHT; hard limit before 1 Oct.

## After the release (in this order)
1. **Profile** — a guest row linked to an account shows that account's profile (read-only); one tap copies the event's formal name into the person's profile; a first account made from an invitation starts with its profile filled.
2. **Name style ▾** — Full · Middle initial · Surname first (DECISION_LOG "THE COUPLE PICKS A NAME STYLE").
3. **Themes** — theme sets background + fonts + colours (Lane C) · one font dropdown #6160 · palette styles · venue styles (3: Photo card · Full photo · The journey — prototype first).
4. **Maker core** — Lane A structure + Lane B stage editing (instant by design), then Invitation → The Day → Post Event stages.
5. **Mood Board** — supplier can alter every detail (extend MB16 grants beyond colour).
6. **The Day menu** — Live · Welcome (their table, look, reminders, E-Gifts) · Camera · Gallery · Me (DECISION_LOG "THE DAY'S MENU HAS FIVE").
0. **FIRST after the release — each menu tab is its own full page** (Invitation + The Day), reusing `hub-shell.tsx` (DECISION_LOG "EACH MENU TAB IS ITS OWN FULL PAGE").
