# 01 · WHAT IS LEFT — the invite themes, in order (2026-09-10)

> Built and merged: #5403 (three doors), #5409 (themes + Capiz), #5410 (the reveal opens the
> invite). See `00_README.md`. ⚠ Verify any PR state with `gh pr view <n> --json state,mergedAt`
> before trusting this line.

## The order

| # | Session | What a person gets | Model | Effort | Starts when |
|---|---|---|---|---|---|
| **1** | Prove Capiz on setnayan.com | The owner watches a guest open a Capiz invite on a phone (reveal → three doors), and sees a couple without Event Hub Pro get House | **Sonnet 5** | medium | now (all three PRs live) |
| **2** | Velvet · Classy | Couples with Event Hub Pro can choose Velvet | **Opus 5** | **high** | after 1 · after Q1 (fonts) |
| **3** | Galeriya · Sophisticated | …can choose Galeriya | **Opus 5** | **high** | after 2 · after Q1 and Q4 |
| **4** | Abaca · Rugged | …can choose Abaca | **Opus 5** | **high** | after 3 · ⛔ only if Q1 = download (no stand-in exists) |
| **5** | Event Hub Pro · the finishing touches | Couples can find where to change the colour and background; plus whatever Q2, Q3, Q6, Q7 decide | **Opus 5** | **high** | after 1 and the answers · safe beside 2–4 |

⛔ **Never together: 2, 3 and 4.** Each adds a line to the same two places (the skin switch in
`invite-skin.tsx` and the theme's font loader), so run them one after another. **5 may run beside
any of them** as long as it leaves `app/[slug]/invite/_components/themes/` alone.

Why this order: 1 is short and proves the pattern the other three copy, so a defect is fixed once,
not three times. Velvet goes first of the three because its headline face is already in the app.
Abaca goes last because nothing in the app can stand in for its slab serif.

## Not sessions — the owner's to decide

Each answer unblocks a row above. Log each in `DECISION_LOG.md` when answered.

* **Q1 · Fonts.** Velvet, Galeriya and Abaca each use a typeface the app doesn't carry (Bodoni
  Moda, Velvet's headline face, is already in the app). May a session download five free faces
  (SIL Open Font License) from Google's font repository on GitHub: **Jost, Schibsted Grotesk, Alfa
  Slab One, Bitter, Oswald**? If **no**: Velvet and Galeriya use Manrope (already in the app),
  which is close but not the same; Abaca waits, because nothing in the app is a slab serif.
* **Q2 · Button colour.** Event Hub Pro sells "Button color", but the invite door's one button is
  locked to Setnayan's `#C24E25` and a test guards that. Should a Pro theme's button take the
  couple's button colour?
* **Q3 · An eighth item?** Event Hub Pro is "the seven" in the code and on the buy page. Is the
  invite theme an eighth item, or covered by Cinematic Reveal + Background colour + Button colour?
  (The public pricing description already says Pro includes "a Pro theme for your invite link".)
* **Q4 · Galeriya's print.** Hanging the photo as a print solved the hardest legibility case, but
  on the Name door it pushes Continue to about 808 px, below the line every other door keeps.
  Keep it, shorten it, or show the print on the Reply door only?
* **Q5 · Which theme a couple is offered first.** The picker pre-selects from the onboarding feel
  (timeless or Filipiniana → Capiz · glam or royalty → Velvet · modern → Galeriya · rustic or boho
  → Abaca · none → House). This was Claude's proposal, not a ruling. Guests see nothing new until
  the couple presses Save. Confirm or change.
* **Q6 · The reveal, twice.** The Event Hub replays its reveal on every visit. A guest who arrives
  by the invite link now meets the opening on the first door and again a minute later when the
  last door hands them into the Event Hub. Keep it, or skip the second one right after an arrival?
* **Q7 · Which celebrations.** The reveal already never plays for a wake. Should the four Pro
  themes (the monogram seal, the photo window) be offered to non-wedding celebrations at all?

---

## SHARED HEADER — paste at the top of every prompt below

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first, then
this folder: ~/Documents/Claude/Projects/Setnayan/Design_Invite_Themes_2026-09-10/
  00_README.md · 01_WHAT_IS_LEFT_SESSIONS_2026-09-10.md · designs/
The files in designs/ are the DESIGN, not decoration. Open them in a browser. PORT THEM, NEVER
REDRAW THEM — a difference between your screen and the design is a defect in the port.
Check DECISION_LOG.md for the owner's answers to Q1–Q7 before you start; if the one your
session depends on is unanswered, ask it in plain English and stop.

RULES THAT OVERRIDE YOUR DEFAULTS:
- RULE 0 — FIND IT BEFORE YOU BUILD IT. Assume what you are asked for already exists and your
  job is to locate and extend it. The "already ships" lines below were read from origin/main on
  2026-09-10 — confirm before changing.
- A DOCUMENT IS NOT EVIDENCE — including this prompt. Verify against shipped code and the live
  production database.
- A rejected query is not a thrown error. Adding an events column costs a GRANT SELECT, an
  events_host rebuild and an exposure-baseline line; omit the grant and every events query fails.
- Never edit the shared checkout. Branch first, then `git worktree add` your own copy. Commit
  before your first mutation run. Prune the worktree the moment your PR merges.
- Add a changelog fragment in changelog.d/. Do NOT edit CHANGELOG.md or STATUS.md.
- `gh pr merge <PR#> --auto --merge` immediately after `gh pr create`. Standing default.
- There are NO Vercel previews. A green Vercel check is not a rendered page. Verify on
  https://www.setnayan.com after merge.
- A guard must be able to FAIL. Sabotage what it protects and print the result before and after.
- `tsx --test` on a path containing [brackets] runs ZERO tests and exits 0 — use `*` in place of
  [slug] and require `# tests` to be non-zero. Use /usr/bin/grep in a worktree (bare grep
  returns nothing there).
- Print TSC_EXIT beside the error lines. Run the FULL `pnpm test:unit` and the ROOT `pnpm lint`
  before pushing; run them one after another, never at the same time.
- THEN RUN CI'S 36 SEPARATE GUARD SCRIPTS — root lint runs none of them. Walk the steps of
  .github/workflows/ci.yml and run every `run:` that calls a scripts/ file, from that step's
  working-directory. (2026-09-10: #5409 and #5410 each failed CI twice on guards root lint
  never ran — the one-comment-stripper and the exposure baseline.)
- CI checks your branch MERGED INTO MAIN. If you touched supabase/security/
  exposure-surface.baseline.txt, merge origin/main first and recount the header from the body —
  a clean git merge keeps one side's count.
- Downloading any file needs the owner's yes in chat (or a logged Q1 answer).
- Reply to the owner in plain English: what a PERSON sees. No file paths, function names, table
  names or SQL in the answer to the owner.
```

---

## 1 · Prove Capiz on setnayan.com · **Sonnet 5 · medium**

```
GOAL: show the owner, on the live site, that (a) a couple with Event Hub Pro who picks Capiz gives
their guests the Capiz invite — the cinematic reveal, then the capiz window over their reveal
background with their monogram as the seal, on all three doors — and (b) a couple WITHOUT Event
Hub Pro who somehow saved Capiz still gets House.

WHAT ALREADY SHIPS — DO NOT REBUILD: #5403, #5409, #5410 (00_README.md). The picker is
Dashboard → Guests → Invite link (/dashboard/[eventId]/guests/invite).

HOW:
1. Prove the column exists in prod BY THE OBJECT (Supabase MCP, read-only):
   select invite_theme from public.events limit 1;
2. (a) Ask the owner to pick Capiz and press Save on an event that owns Event Hub Pro. Cale & Ice
   (/cale-ice) is the owner's own internal account, so Pro is on for it. NEVER write invite_theme with SQL on
   a real couple's event.
3. Open https://www.setnayan.com/<slug>/invite in the Browser pane at 375×812. Screenshot: the
   reveal; door 01 after lifting it; door 02; door 03. Check the photo shows through the window,
   the seal carries their monogram, Continue sits above the fold, no text under 12 px, and the
   text over the photo is readable. Then at desktop width.
4. (b) The gate. The owner's own events cannot prove it — internal accounts get Pro free (the
   is_internal false-green trap in CLAUDE.md). Use a non-internal TEST event only, and only with
   the owner's yes in chat: set invite_theme = 'capiz' on it, then fetch /<slug>/invite and
   confirm it renders House (no capiz markup). Set it back to NULL afterwards and say so.
5. If anything is wrong, fix it in its own PR (same rules), or write it up for session 2.

DONE WHEN: the owner has the screenshots of reveal + three doors in Capiz on a phone and the
House result for the non-Pro test event, and any defect is fixed or written up.
```

## 2 · Velvet · Classy · **Opus 5 · high**

```
GOAL: couples with Event Hub Pro can choose Velvet for their invite link, and their guests see it
on all three doors.

READ FIRST: designs/velvet.html (the design). Then the shipped Capiz skin — the pattern to copy:
  apps/web/app/[slug]/invite/_components/themes/capiz.tsx and capiz.module.css
  apps/web/app/[slug]/invite/_components/themes/invite-skin.tsx   (the switch)
  apps/web/lib/invite-themes.ts                                   (velvet is ready: false)
  apps/web/app/_components/door/door-shell.tsx                    (DoorSkin: ground·crest·hinge)
  apps/web/app/[slug]/invite/_lib/load-invite-look.ts             (what a skin is handed)
  apps/web/app/[slug]/invite/_components/themes/themes-stay-skins.test.ts

WHAT ALREADY SHIPS — DO NOT REBUILD: the column, the picker, the Pro gate, the ground (the
couple's reveal background, lib/invite-ground.ts), the reveal on door 01 (Velvet's default
opening, four-flap, is already in the registry; the couple's own choice wins). Velvet needs only
its SKIN, its FONTS and ready: true.

THE DELTA: velvet.tsx + velvet.module.css ported from designs/velvet.html; one case in
invite-skin.tsx; ready: true; its fonts loaded ONLY on the invite doors. Add, if it is not
already there, a test that every ready theme resolves to a skin — and prove it fails when Velvet
is marked ready with no skin.

FONTS: Bodoni Moda is already in the repo (apps/web/assets/cipher-fonts/bodoni-moda.ttf — static,
one weight). Copy it under apps/web/app/_fonts/bodoni-moda/ and load it with next/font/local.
Jost only if Q1 = download; otherwise Manrope (already in app/_fonts) — say which in the PR.

TRAPS:
- A skin owns what is BEHIND and AROUND the card — never the card, its 3 px top edge or its one
  button (doors-are-designed.test.ts). The button stays #C24E25 unless Q2 said otherwise.
- DoorShell imports no stylesheet, and a theme's CSS module is imported only from
  app/[slug]/invite/_components/themes/. The main bundle is at 199.8 of 200 KB.
- lint:fonts: no next/font/google, every localFont path exists, no orphaned font file. Declare the
  theme's fonts in the theme's own module, NEVER in app/layout.tsx (that ships them on every page).
- lint:legibility: nothing under 12 px. Check text over the photo under all three legibility
  settings the couple can choose (auto · lighten · darken).
- The couple's colour is ornament only. Never put text in it over the photo without contrast.
- The photo URL goes into CSS through JSON.stringify, as Capiz does (the SEC-6 trap).

DONE WHEN: on a Pro event, picking Velvet shows it on doors 01/02/03 at 375 px and at desktop,
proven on setnayan.com after merge; the picker offers it; the new test fails without the skin;
lint:fonts, lint:legibility, the bundle budget, full test:unit and root lint are green.
```

## 3 · Galeriya · Sophisticated · **Opus 5 · high**

```
GOAL: couples with Event Hub Pro can choose Galeriya for their invite link.

READ FIRST: designs/galeriya.html, then the same files as session 2 — Capiz AND Velvet are now
the pattern. Read the owner's Q4 answer (the print on the Name door) before porting.

WHAT ALREADY SHIPS — DO NOT REBUILD: everything session 2's block lists, plus Velvet. Galeriya's
default opening (sheer veil) is already in the registry.

THE DELTA: galeriya.tsx + galeriya.module.css; one case in invite-skin.tsx; ready: true; fonts on
the invite doors only. Apply Q4 exactly:
  keep      → port as drawn, and write down that Continue sits below the fold on door 01;
  shorten   → the print shrinks until Continue sits above 640 px at 375×812;
  Reply only→ door 01 wears Galeriya's frame without the print; the print hangs on door 02.

FONTS: DM Mono is already in the app. Schibsted Grotesk only if Q1 = download; otherwise Manrope
— and check Galeriya still reads differently from Capiz, which already uses Hanken Grotesk.

TRAPS: all of session 2's. Plus: the design keeps every word OFF the photo — that is what makes
it legible (8:1 over the veil). Do not move a word onto the print.

DONE WHEN: as session 2, for Galeriya, with a screenshot proving where Continue sits on door 01.
```

## 4 · Abaca · Rugged · **Opus 5 · high** · ⛔ only if Q1 = download

```
GOAL: couples with Event Hub Pro can choose Abaca for their invite link.

READ FIRST: designs/abaca.html, then Capiz, Velvet and Galeriya as the pattern.

WHAT ALREADY SHIPS — DO NOT REBUILD: everything above. Abaca's default opening (four-flap) is
already in the registry.

THE DELTA: abaca.tsx + abaca.module.css; one case in invite-skin.tsx; ready: true. Its three faces
— Alfa Slab One, Bitter, Oswald — downloaded per Q1 from github.com/google/fonts (OFL), committed
under app/_fonts/, each with its OFL licence file, loaded only on the invite doors. Ship only the
weights the design uses.

TRAPS: all of session 2's. Plus: Oswald is condensed — at 12 px it is the likeliest line in the
whole set to fail lint:legibility or read badly on a phone; measure it. Three new faces is the
heaviest theme — check the invite doors' page weight before and after and put both numbers in the
PR.

DONE WHEN: as session 2, for Abaca. After it merges all five themes are live — update
00_README.md's table and the memory note.
```

## 5 · Event Hub Pro · the finishing touches · **Opus 5 · high**

```
GOAL: finish the invite themes as part of Event Hub Pro, per the owner's answers to Q2, Q3, Q6
and Q7 (DECISION_LOG.md). Build ONLY the answered items; list the rest back to the owner.

ALWAYS (no decision needed): the picker says the invite "opens on your reveal background, in your
colour" but does not say where to change either. Link each: the colour is the monogram colour on
/dashboard/[eventId]/invitation; the background is on /dashboard/[eventId]/studio/save-the-date.

IF Q2 = yes (button colour): on a PRO theme only, door 01–03's one button takes the couple's
button colour, with a contrast floor — pick white or ink text by luminance, and fall back to
#C24E25 when neither reaches 4.5:1. The doors-are-designed.test.ts register needs a reasoned,
line-keyed exception, never a file-wide one. House keeps #C24E25.

IF Q3 = an eighth item: add it where "the seven" live (lib/website-pro-items.ts,
lib/event-hub-pro.ts, the buy page's BENEFITS) and keep says-what-it-includes.test.ts true both
ways. If not: change nothing; the copy already names it.

IF Q6 = once: the Event Hub skips its veil for a guest who just came through door 03. TRAP: on the
Event Hub the first lift of the veil is also what STARTS the Save-the-Date film ("Start the film
once, on the first lift") — skipping the veil must not leave the film waiting for a lift that
never comes. Prove both stages.

IF Q7 = weddings only: the picker offers Pro themes only where the event type may show the
Save-the-Date film (resolveWeddingOnlyParts — the same fence the reveal uses), setInviteTheme
refuses the rest server-side, and resolveInviteTheme renders House for them even if a value was
saved.

TRAPS: the reveal's WHEN is one rule (cinematicRevealPlays in lib/site-body-plan.ts) — never
restate it. The Pro gate is eventCoupleWebsiteProActive; never add a second ownership check.

DONE WHEN: each answered item is built, guarded by a test that fails when it is reverted, and
verified on setnayan.com; each unanswered one is listed back to the owner in plain English.
```
