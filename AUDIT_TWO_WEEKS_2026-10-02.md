# Two-week build audit — 17 Sep → 2 Oct 2026 (controller, Thursday account)

**What was checked:** every owner ruling in DECISION_LOG dated 2026-09-17 → 2026-10-02 (~668 rows, newest ruling wins — amended/superseded rows count as "changed by owner", never as missed), against `origin/main @ 76c6ed1` plus open PRs. Six read-only area audits (guest side · Maker · host app · suppliers · admin/money · onboarding/types/public) + a per-PR audit of the night train (#6242 #6234 #6239 #6231 #6229 #6233/#6240 #6238/#6235). Each item checked for **built AND reachable** (the page renders it, the button that opens it is where the design puts it, no flag/role/type gate hides it). Code reading only — prod flag values could not be read.

| Area | Done | Missed | Built, not reachable | In flight | Changed by owner |
|---|---|---|---|---|---|
| A · Guest side | ~55 | ~13 | 6 | 5 | ~10 |
| B · Maker | 50 | 14 | 2 | 7 | 22 |
| C · Host app | ~68 | 15 | 1 | 8 | ~12 |
| D · Suppliers | 38 (+16 with a gap) | 20 | 2 | 12 | 7 |
| E · Admin / money / privacy | 36 | 10 | 1 | 5 | 10 |
| F · Onboarding / types / public | 31 | 26 | 3 | 7 | 11 |

Most "missed" items in C/F were already scheduled (front-door sidebar, wake/corporate onboarding, debut/christening roles, seat plan phone, The Day pages, /themes). The full per-area reports are summarised in `CONTROLLER_QUEUE.md` §1 "AUDIT FIX LIST".

## Fix order (controller builds these as Mac slots free)

**Batch F1 — live bugs a person would hit now (Sonnet unless noted)**
1. Supplier app wrong landings: More → Messages / Earnings & payday, Today's "owed" tile, Next card Send quote/contract land on the roster top (redirect stubs lack anchors) · "Run the day" missing before 8 am Manila (todayManila uses UTC) · "Agree" wording · "Vendor" in tab titles.
2. Maker: Details dead after tapping Prints (RUNNING) · re-tap current theme hands the look back.
3. Suppliers: Chats page has no way back to Suppliers; bar doesn't light on /messages.
4. Main background video plays for the host only — guests see a still (GUEST_HERO_VIDEO_PLAYBACK=false). Opus (media cost check).
5. 100 MB per-event media cap not enforced — uploads never refused (cost risk). Opus.
6. New receiving accounts (e.g. Maribank) would show raw ids to customers; ~10 screens say "BDO or GCash". **Owner: don't add Maribank/UNO until this lands.**
7. "Record a payment received" unreachable on the phone.
8. Patiktok still listed on /features (owner said hide) · "Live Studio" still in More Services (lib/our-services.ts).

**Batch F2 — owner rulings not yet built (Opus)**
- Google + Apple sign-in INSIDE the iOS/Android app ("Save to my account" fails in-app today) — owner: before the Apple check.
- One-QR events: signing in should add the event with no approval unless "I approve each one" (today it makes a request).
- "Will guests reply? / Entry" changeable later from the Guest list.
- Onboarding card answers are stored but ignored (Papic "No" doesn't turn Papic off; photo upload never prompts; gifts/logo).
- Maker: "Behind every scene" + fonts + colours into Details › Theme (owner: "too hidden") · tap-to-type beyond the hero · venues as pin + picked city · Maker stops embedding guest-list functions ("Open in Guest list ›").
- Admin: phone admin app (approved design, never got a prompt) · fee-lock / free-fee-window switches · face blur per person (today event-wide) · unpaid fee also loses reviews + stats.
- "Supplier, never vendor" across the logged-in app (~130 strings) — Sonnet sweep + guard.
- /features completion: a way in (front-door sidebar = P10a), hub metadata + OG image, screenshots, Together group + /samahan redirect, the 4 shipped features it skipped, guides.

**Already scheduled (no new build needed):** P1b seat plan phone + A3 print · P9 The Day pages · P6b + G5 roles/types · P10 a/b/e front door · /themes · speed chain (preload, service worker, last-seen data) · Lane 3 / Lane 5.

## Owner questions (ask via the desk)
1. **Services scoping (P3):** the 253 services were left inheriting their category's event types (copying would lock out Admin › Scope categories edits) — the approved row said seed them. Keep the builder's way? (rec: yes)
2. **Drive time between venues** (approved design shows "about 20 min drive"): needs a routing service (may cost) — "don't guess" rule. Add a routing source, or keep distance only? (rec: distance only until after Apple)
3. **Save-the-date emails and the face-unblur notice still email guests** — does "no email to guests" cover them? (rec: yes, stop them)
4. **Supplier toolkit** (scan-to-claim, claimed N of M, readiness checklist, roaming photographer…): after the Apple check like the toolkit rows say? (rec: yes)
5. **Papic wedding recommendation floor 5,000** vs the earlier "floor 0 for every type" — keep 5,000? 
6. **More sheet: 5 items or 6 (Gallery)?** and is the More Services page meant to be reachable only from cards?
7. **"Fits your budget" lens on Explore** narrows the supplier grid when the couple turns it on — allowed under "budget never limits"? (rec: yes, it's opt-in)
8. **Two-venue pages now show one shared map** (approved) — confirm it's OK that live two-venue pages changed.
