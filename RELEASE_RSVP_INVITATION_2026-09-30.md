# RSVP + Invitation release — live before Oct 1 (plan, 2026-09-30)

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
