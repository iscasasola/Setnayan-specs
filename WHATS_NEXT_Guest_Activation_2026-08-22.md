# WHAT'S NEXT — GUEST ACTIVATION: the shared QR → their details → their personal QR → Papic

> **Owner, 2026-08-21, stating the model verbatim:**
> *"Invite guests will be the initial activation before they get their personal QR.
> the goal is to allow them to input their details, and register all of these to
> their QR Code. where their data will be allocated to them. this will also give
> them access to the papic for that event."*
>
> **Owner, 2026-08-22: _"we are running in circles."_ He is right.** This file exists
> so nobody maps this chain a third time. It was mapped twice in one session
> (workflows `wf_aabf613c-bec`, `wf_3473de17-790` — 74 agents, ~11M tokens) and the
> answer barely changed. **READ THIS. DO NOT RE-RUN THE MAP.**

---

## 🟢 SECTION 1 — ALREADY SHIPS. DO NOT REBUILD ANY OF IT.

Each line below was verified against shipped code AND live production, then
attacked by an independent skeptic told to hunt "shipped work reported as missing".

| what | proof |
|---|---|
| **A guest's personal QR exists the instant their row is written.** Nothing issues it later. | `guests.qr_token` is `NOT NULL DEFAULT encode(gen_random_bytes(16),'hex')`. All prod rows carry one; none blank. |
| **The QR is a URL, not a code:** `/{slug}?invite={qr_token}`. Scanning it signs them in. | **Proven live:** fetching a real guest's QR URL on `www.setnayan.com` 307s through `/{slug}/redeem`, sets the signed guest cookie, and renders *"Hi again, Benigno · Signed in as Benigno Garcia · My QR · Photos of you"*. |
| **The shared "Invite guests" QR encodes `/{slug}/invite`** and renders the same JoinFlow as `/join/[eventId]`. | Read the generator; fetched the live page (200, *"You're invited · Add yourself — just your name, no account needed"*). |
| **An exact name match inherits the EXISTING person's code** rather than minting a duplicate. | `seedBindAllowed` requires exact normalised equality. A near-miss falls through to a new row + a notification to the couple. |
| **Papic is already ON for every event — 50 free shots, granted automatically at creation.** Nobody buys anything for cameras to have credit. | `papic_seed_free_grant_trg` (AFTER INSERT on `events`). `papic_event_pool_status()` returns `applies=true` on all 5 prod events. |
| **The guest's QR opens Papic and "photos of you".** | Owner-locked 2026-06-26; commit `b3ecbdb01` the same day. |
| **The day-only capture rule is enforced at the UPLOAD**, not merely on screen. | 403 `guest_capture_not_open_yet` / `guest_capture_closed`. No early photo can reach the couple. |
| **The host already has the open-cameras-early switch**, worded well, working both ways. | — |
| **The email a guest types at the invite door IS saved to their row.** | `lib/event-account-link.ts` step 1 — `.update({email}).is('email', null)`, fill-a-blank, called from all three join endings. |
| **Contact email · mobile · preferred name are collected on the reply card**, prefilled from the account profile. | PR #4700 (2026-08-21). |
| **The account profile already stores** display name · phone · meal · dietary. | Nothing to build for storage. |
| **A "confirm who you are, then you're in" screen already exists, fully written, in the product's voice.** | `/{slug}/welcome` — fenced to plus-ones today. **This is the activation screen the owner is describing.** |
| **A guest can reach their QR in every phase.** | The big QR *card* in the page body IS phase-gated (`qr_card: ['rsvp','event']`, >90 days out = hidden), but the **My QR button** in the guest's own section is not gated at all. 🪤 **TWO SURFACES FOR ONE THING — this was nearly reported as a gap.** |

---

## 🔴 SECTION 2 — THE REAL GAPS. Smallest first. Extend the named thing; never rebuild.

1. ✅ **DONE + VERIFIED LIVE 2026-08-23 — do NOT rebuild it.** (Proven on `www.setnayan.com`: a real guest's invitation cookie gets **200 · image/png · 1024×1024**, byte-identical to that guest's own QR; **no cookie gets 401**.) ~~A guest cannot KEEP their QR.~~ **"Save the code" + "Copy link" now ship on all three surfaces** (the invitation QR card, the My QR modal, the day-of hub's Me panel), backed by a new `GET /api/guest/qr` that hands the guest their own code as a 1024px PNG.
   🔑 **The route takes NO parameters — that is the security property, not an omission.** It is authenticated purely by the `setnayan_guest_session` cookie, ⚠ **and with NO token comparison — one was shipped and REMOVED the same day (PR #4740): it refused the honest guest whose host had just re-issued their code while the page beside it showed that code, and protected nothing. Revocation lives in ONE place, `readGuestSession()` behind `GUEST_SESSION_TOKEN_CHECK`. DO NOT RESTORE IT.** A qr_token is a credential: put one in a path and it lands in browser history, the next hop's `Referer` and every access log between — and an id in the path invites someone to try other ids. With nothing to name, there is no other guest the route can be asked about.
   ⚖ **NOT gated on a purchase, deliberately.** This is the plain ink-on-cream code the guest is **already shown for free**; saving a picture of your own screen is not a feature to sell. 🔒 **The paid `CUSTOM_QR_GUEST` branded PNG (`/api/website/qr/guest/[guestId]`, palette-tinted, ownership-gated) is UNTOUCHED** — do not collapse the two routes, that hands the paid upgrade away.
   🔑 **ONE component, not three.** These three screens were built at different times, none imports the others, and all three independently ended up with the same gap. A per-surface fix is three chances to forget one and the fourth surface makes four — so a guard now fails when **any** screen rendering a personal QR omits the keepers.
   🪤 **That guard was DECORATION on its first run.** It matched the bare identifier, which the surviving `import` line satisfies — so deleting the JSX from all three surfaces left it **green three times**. Re-anchored to the JSX element. **Print the occurrence count before → after; assume a sixth.**
2. ✅ **DONE 2026-08-24 (same change).** ~~The web address under the QR is dead text~~ — "Copy link" puts it on the clipboard, and **says so when the copy fails** rather than looking like a success.
3. **The "check your email" screen offers no way into the celebration they just joined** — its only button leaves for the marketing site. *Extend: the "Open your invitation" button its sibling screen already has.*
4. **Nobody who joins is told they are on the list.** The one visible status word is *"pending"*, which reads as **not finished**.
5. **Nothing points a guest at the reply card**, so the mobile/email/preferred-name boxes sit on a screen they never find. *Extend: the quick-link chips already on their summary card.*
6. **A guest can overwrite — or by saving blank, ERASE — contact details the couple typed.** The front door refuses this (`.is('email', null)`); one screen later the protection is gone. That address is a sign-in key, not a note.
7. **Every guest is told "the host hasn't turned on Papic" when the host has.** False on all five prod events. Blames the couple, offers no action. ⚠ Kept alive purely by the guest-camera pack still being paid while the rest of Papic went free.
8. **The camera on the invitation page shows a live viewfinder that only refuses AFTER the shutter.** Its sibling says so politely up front.
9. **A guest cannot say who they are bringing**, though the couple is promised in writing that the name will arrive. No name ⇒ no row ⇒ no QR ⇒ no camera for that person.
10. ✅ **DONE — PR [#4714](https://github.com/iscasasola/setnayan-platform/pull/4714).** ~~On a new phone the sign-in link silently failed.~~ `connectEventForUser` wrote `joined_via: 'email_link'`, which is **not one of the six legal labels**, so Postgres refused the row every time and the guest landed on an empty home page. **The sixth costume of *rejected, not thrown*.** Guarded by `tests/db/enum-literals-are-real.db.test.ts`.

---

## ⚖ SECTION 3 — OWNER DECISIONS. Not bugs. Do not decide these yourself.

1. **Nothing ever sends a guest their QR.** For **replacements** this is a deliberate, stated security rule (*"for your security, we never send the new code by email"*). For the **first** issue it was never decided — today's behaviour is inherited, not chosen. Emailing it makes activation self-serve; keeping it physical keeps the code out of inboxes forever.
2. **Should the guest camera be FREE like the rest of Papic?** Photo messages and guest greetings both went free on 2026-08-21. The guest-camera pack stayed paid — and that single fact is what keeps **gaps 7 and 8** alive. One decision deletes both.
3. **A private event refuses the shared door entirely** (owner-locked 2026-08-06: a stranger who guesses the address must not add themselves). 3 of 5 prod events are private, all created before the rule changed. ⚠ Worth knowing: **"locked" is the database's starting value and not every creation door overrides it**, so some celebrations are born turning their own shared link away. The couple is not misled — the Invite screen refuses to print the QR and explains why.
4. **Guest hint text measures ~3:1 contrast** (AA floor is 4.5:1) across **641 uses in 292 files**. It is the house style, not a regression. Raising it is a design-programme decision; `text-ink/70` (5.40:1) is the nearest passing step.

---

## 🪤 SECTION 4 — WHAT THIS SESSION GOT WRONG. Read before trusting any map.

- 🚨 **I CLOBBERED FOUR MERGED PRs AND STOPPED PRODUCTION DEPLOYING.** PR #4700 was squashed with `git reset --soft origin/main` **against a stale local ref**, deleting 24 files and reverting 42 — including applied migrations, which fails the deploy's migration push, which means **nothing publishes**. CI cannot see it: a repo missing a whole feature is internally consistent. **NEVER `git reset --soft origin/main` to squash. Rebase, or check `git diff --diff-filter=D origin/main...HEAD` (THREE DOTS) is empty before pushing.** I nearly did it a second time an hour later on the #4714 branch; the diff check caught it. ⚠ **CORRECTED 2026-08-24 — this line said TWO dots, and two dots cries wolf:** `origin/main..HEAD` compares the two TIPS, so every file main GAINED after you branched reads as a file YOU deleted, which fires on nearly every branch in this repo and cost one session a pointless rebase. Three dots diffs from the merge base — the actual question. To settle a hit rather than assume it: `git merge-tree --write-tree origin/main HEAD`, then `git cat-file -e "<tree>:<path>"` on each flagged file; a file that survives was never at risk.
- **I "fixed" the invite-door email, which already worked** (PR #4703, reverted by #4707). I followed the value to the CALL, read the function's name, and never opened the callee whose first statement was the write I thought was missing. **Follow the value into the callee.**
- **A pinned reader goes stale.** I froze a checkout for 43 agents and then merged four PRs underneath them — **18 commits of drift** — so they reported shipped work as missing. Pin it *or* keep merging, never both; and check `git rev-list --count HEAD..origin/main` before believing any "X is missing" finding.
- **Two surfaces for one thing, twice.** The seat-finder vs the join door; the big QR *card* vs the My QR *button*. **Enumerate every surface before reporting an affordance absent.**
- **A workflow died of the account usage limit, not an error** — 16 agents and the synthesis failed while ~27 verified results sat in `journal.jsonl`. **Read the journal before concluding a workflow returned nothing.**
- **A dead "Download PNG" label ships into every page's HTML** from a menu registry, pointing at a route that does not exist, rendered by nothing. A future grep of the live site will "find" a guest QR download that has never existed.

---

## ❓ SECTION 5 — NOT VERIFIABLE FROM A SESSION

- Anything needing a signed-in guest on a real phone. The QR scan and the refusals were read from the live site and live database, **not lived**.
- The 60-day guest-cookie expiry — read in code, never watched expire.
- Camera behaviour on a real device: permissions, shutter, upload.
- **Prod holds 36–40 guests and ZERO with an email saved**; no save-the-date has ever been sent. Every claim about guest emails describes what the code *would* do. Pre-launch — that is the plan, not a defect.
