# Front door — correctness pass, and what to send back to Claude Design

**The concept:** `design_handoff_frontdoor/` (committed 2026-08-11, from *"user home with
website concept.zip"*). YouTube-shaped: centred search, **right** sidebar, a feed of
Trending storyteller → Editorials shorts row → More stories → Trending vendors.

**Its own README asked for this pass:** *"desktop and mobile layout need a correctness
pass (the owner is sending this to Claude Code for that, then back to design for
finalization)."* This is that pass. Everything below was checked against the **live site,
the shipped code and the production database** — not against documents.

> 🔒 **This 11 Aug concept SUPERSEDES `prototypes/home_facebook_shaped_2026-08-07.html`**,
> which the owner chose earlier the same day before this one existed. One front door.

---

## ✅ Verified correct — do not let design "fix" these

| Claim | Verdict |
|---|---|
| *"Editorials stay live day one"* | **TRUE. 82 articles authored, 32 rendering on the live blog right now.** ⚠ I nearly reported the opposite: they are TypeScript modules, not markdown, so a content-folder check returns zero. The rail is the one genuinely-populated section at launch. |
| Empty-catalogue mode — invitations, never seeded trends | **Correct, and it is load-bearing.** Storyteller chapters: **0 rows.** Live vendors: **1.** So on day one three of the four rails are empty and only Editorials carries the page. The concept already handles this; the finalized design must not quietly assume content. |
| *"Trending is earned, never sold"* | Consistent with the merit-first ranking lock. Keep. |
| Homepage gold `#8C6932` on cream | **Passes accessibility at 4.86:1** — measured. Better than the locked terracotta's 4.61:1. So the objection to it is brand consistency, **not** legibility. |
| Sidebar links: Stories · Editorials · Explore · About · Pricing · Privacy · Terms · Open your shop | All resolve **200** on the live site. |
| Tools have public doorway pages | All six answer **200**. |

---

## ❌ Wrong — fix before finalization

### 1 · The EXPLORE list is not the real taxonomy, and it omits the two biggest groups
The concept lists **Photographers · Venues · Catering · Videographers · Hosts & bands**.

The live catalogue's actual top-level folders, counted in production (marketplace-visible,
excluding Setnayan's own SKUs):

| folder | services | | folder | services |
|---|---|---|---|---|
| **look** | **54** | | prints | 15 |
| **booths** | **42** | | planning | 12 |
| venue | 28 | | documentary | 12 |
| design | 26 | | transport | 11 |
| program | 20 | | feast | 7 |

**Not one of the five proposed names is a real folder**, and the two LARGEST — `look` (54)
and `booths` (42) — are missing entirely. "Photographers" and "Videographers" both live
inside `documentary`; "Catering" is `feast`; "Hosts & bands" is `program`.

⇒ Design must draw the **real** folders, with their real labels, and decide which get the
five visible slots before "Show more". **Do not re-type this list into a design file** —
it is a live table and it changes.

### 2 · "Contact us" points at a page that does not exist
`/contact` returns **404**. The real surface is **`/help`**, which ships with search and
routes enquiries to the right team. Relabel or repoint.

### 3 · The gold-dot claim needs a per-tool answer
*"gold dot = usable without an account"* is drawn against six tools. What I verified is
that all six **marketing pages** load publicly — which is not the same claim. Whether the
**tool itself** works signed-out is true for some (a camera helper can now shoot without
signing in) and unverified for others. **Design should not paint six dots until each is
confirmed one at a time.**

---

## ⚠️ Owner rulings needed — these are not design questions

1. **Gold as the action colour on this page.** The concept says it *"deliberately breaks
   the terracotta rule."* The app-wide lock is: terracotta `#C24E25` is the ONLY action
   colour and **gold is never a button**, and there is a CI guard enforcing contrast. The
   proposed gold is legible — this is purely whether the front door is allowed its own
   action colour. **Say yes or no; do not leave it to the drawing.**
2. **System font on this page** instead of the app's typefaces. Same shape of question.
3. ~~**"My Home" signed-out**~~ — ✅ **ANSWERED 2026-08-11: it TURNS INTO THE SIGN-IN.**
   It does not disappear. That makes the row the page's single front-and-centre doorway in
   both states: the way in for a stranger, and the way home for a member.

---

## 🏠 "My Home" expands into FOUR AREAS — and they already exist

**The owner asked whether there was a plan. There is, and it is exact.** Found in two
independent places that agree:

- The committed 8 Aug bundle, in its own words: *"the four home areas mount here —
  **Events · Alaala · Spaces · People**"* (frames 3a–3f).
- The **shipped code**: `app/dashboard/(launcher)/_components/home-pill-nav.tsx`, whose
  docblock reads *"four honest targets beat five with a dead one."*

| Area | Route | State today |
|---|---|---|
| **Events** | `/dashboard` | ✅ live — the home board |
| **Alaala** (your memories) | `/dashboard/library` | ✅ live |
| **People** | `/dashboard/people` | ⚠️ **live but deliberately dormant** — see below |
| **Spaces** | capability-gated `spacesHref` | ⚠️ **conditional** — only renders when the account actually runs something (a shop, a console). The nav takes `hasSpaces` and hides the slot otherwise |

### 🚨 Two things that make this NOT a simple four-item list

1. **People is intentionally "coming soon" as of today.** Its connections layer is
   counsel-gated and was **switched off in production on 2026-08-11** — the live page now
   reads *"Connections are coming soon… There's nothing to do on this page yet."* That is
   correct and must stay until counsel clears it. So the front door would be expanding
   into an area that deliberately has nothing in it.
2. **Spaces is not everyone's.** It appears only for accounts that run something. A design
   that draws four fixed rows will show a dead one to every ordinary couple — which is
   precisely what that docblock's *"four honest targets beat five with a dead one"* exists
   to prevent.

⇒ **The expansion is "two always, one dormant, one conditional" — not four.** The design
has to say what each of those looks like, and the empty-state rule already on this page
("every empty state is a written invitation; no fake doors") applies inside the sidebar,
not just in the feed.

---

## 📋 Paste this to Claude Design to finalize

> This is the correctness pass on the YouTube-shaped front-door concept. The structure is
> agreed and should not change: centred search, right sidebar, feed order Trending
> storyteller → Editorials shorts row → More stories → Trending vendors, mobile as a
> single column with a hamburger index. Finalize the desktop and mobile layout, with these
> corrections — every one measured against the live product, not assumed:
>
> **1. Replace the EXPLORE category list.** The five names drawn are not real. The live
> top-level folders, largest first, are: **look (54 services) · booths (42) · venue (28) ·
> design (26) · program (20) · prints (15) · planning (12) · documentary (12) · transport
> (11) · feast (7)**, plus insurance, experience, logistics & safety, specialty. Draw the
> real ones; recommend which five earn the visible slots above "Show more", and say why.
> Note that photographers and videographers both sit inside *documentary*, catering is
> *feast*, and hosts and bands are *program* — so the friendly words people search for are
> NOT the folder names. **Show how search bridges that gap**, because that is the real
> problem this page has to solve.
>
> **2. "Contact us" must point at /help**, which is the surface that exists. Relabel it if
> "Help" reads better in that footer group.
>
> **3. Design the empty day-one page as the PRIMARY state, not a variant.** In production
> today there are **0 storyteller chapters and 1 visible vendor**, while **32 editorials
> are live**. So on launch day three of the four rails have nothing and Editorials carries
> the whole page. Show me the real launch-day screen — desktop and mobile — and make it
> feel deliberate rather than unfinished. The busy version is the future; the empty one
> ships first.
>
> **4. Give the Editorials rail more of the page** in that day-one state, since it is the
> only rail with content. Say how it re-balances once stories and vendors arrive.
>
> **5. Do not paint the "usable without an account" dots yet** — that claim is per-tool
> and unverified. Draw the dot grammar, leave which tools carry it to us.
>
> **6. "My Home" expands into the four home areas that already exist: Events · Alaala
> (their memories) · People · Spaces.** But do NOT draw four equal rows — the shipped nav's
> own rule is *"four honest targets beat five with a dead one"*, and today: **Events and
> Alaala are live · People is deliberately dormant** (its connections layer is on hold
> pending legal review, and the page currently says "coming soon") · **Spaces only exists
> for accounts that actually run something**, like a shop, and is hidden otherwise. Show
> the signed-in expansion with those real states. **Signed out, the row does NOT disappear
> — it becomes the SIGN-IN** (owner-ruled 2026-08-11), so the same slot is the way in for a
> stranger and the way home for a member; draw both. No fake doors: an area with nothing in
> it gets a written invitation, not a disabled row.
>
> **Unchanged and locked:** cream `#FDFBF7` page and cards separated by border and shadow
> (never a second surface) · ink `#2C2A29` · counts in monospace · no fake doors · zero is
> never shown where a count failed to load · every empty state is a written invitation ·
> 44×44 minimum tap targets · light mode only.
>
> Deliver as a downloadable bundle.

---

## 🚫 Still do not ask for

The vendor shop page, invitation, wedding website, Studio, vendor dashboard, app shell,
marketplace, admin — **all already drawn and committed** in
`design_handoff_setnayan_redesign/`. They need porting, not designing.

**The one genuine gap remains the couple's Papic control room** — see
`ASK_CLAUDE_DESIGN_2026-08-11.md`.
