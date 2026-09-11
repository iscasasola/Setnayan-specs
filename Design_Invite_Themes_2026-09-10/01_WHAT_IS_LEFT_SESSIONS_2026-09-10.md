# 01 · WHAT IS LEFT — the invite themes, in order (2026-09-10)

> Built and merged: #5403 (three doors), #5409 (themes + Capiz), #5410 (the reveal opens the
> invite). See `00_README.md`. ⚠ Verify any PR state with `gh pr view <n> --json state,mergedAt`
> before trusting this line.

## The order

| # | Session | What a person gets | Model | Effort | Starts when |
|---|---|---|---|---|---|
| **1** | Prove Capiz on setnayan.com | The owner watches a guest open a Capiz invite on a phone (reveal → three doors), and sees a couple without Event Hub Pro get House | **Sonnet 5** | medium | now (all three PRs live) |
| **2** | Velvet · Classy | Couples with Event Hub Pro can choose Velvet | **Opus 5** | **high** | after 1 |
| **3** | Galeriya · Sophisticated | …can choose Galeriya | **Opus 5** | **high** | after 2 |
| **4** | Abaca · Rugged | …can choose Abaca | **Opus 5** | **high** | after 3 |
| **5** | Event Hub Pro · the finishing touches | The invite button in the couple's own colour · the invite theme listed as Pro's eighth item · no second reveal right after arriving · Pro themes for weddings only · links to change the colour and background | **Opus 5** | **high** | after 1 · safe beside 2–4 |

⛔ **Never together: 2, 3 and 4.** Each adds a line to the same two places (the skin switch in
`invite-skin.tsx` and the theme's font loader), so run them one after another. **5 may run beside
any of them** as long as it leaves `app/[slug]/invite/_components/themes/` alone.

Why this order: 1 is short and proves the pattern the other three copy, so a defect is fixed once,
not three times. Velvet goes first of the three because its headline face is already in the app.
Abaca goes last because it needs the most new type (three faces).

## The owner's answers (2026-09-11 — DECISION_LOG.md, "the seven invite-theme questions")

All seven answered, each with the recommended choice. Build these; do not re-ask them.

* **Q1 · Fonts → A, download.** Five free SIL-OFL faces — Jost (Velvet), Schibsted Grotesk
  (Galeriya), Alfa Slab One, Bitter and Oswald (Abaca) — from Google's font repository on GitHub,
  committed with their licence files, loaded only on the invite doors of the theme that uses them.
  Bodoni Moda (Velvet's headline face) is already in the repo.
* **Q2 · Button colour → A, yes.** On a Pro theme the invite doors' one button takes the couple's
  own button colour, with a safety floor: it falls back to Setnayan terracotta `#C24E25` whenever
  the couple's colour cannot be read. House keeps terracotta.
* **Q3 · Eighth item → A, yes.** The invite theme becomes the eighth Event Hub Pro item. Price and
  SKU unchanged.
* **Q4 · Galeriya's print → B, shorten it** until Continue sits on the first screen of a phone
  (above 640 px at 375×812). The print stays on the Name door.
* **Q5 · First theme offered → A, keep the mapping** (timeless or Filipiniana → Capiz · glam or
  royalty → Velvet · modern → Galeriya · rustic or boho → Abaca · none → House). Now a ruling.
  Nothing to build.
* **Q6 · The reveal twice → B.** A guest who has just come through the invite doors does not meet
  the Event Hub's reveal again on that visit; later visits play it as usual. The Save-the-Date
  film must still start.
* **Q7 · Which celebrations → A, weddings only for now** — the event types that carry the
  Save-the-Date film, the same fence the reveal uses. Every other celebration gets House.

---

## SHARED HEADER — paste at the top of every prompt below

```
Read /Users/icecasasola/CLAUDE.md and ~/Documents/Claude/Projects/Setnayan/CLAUDE.md first, then
this folder: ~/Documents/Claude/Projects/Setnayan/Design_Invite_Themes_2026-09-10/
  00_README.md · 01_WHAT_IS_LEFT_SESSIONS_2026-09-10.md · designs/
The files in designs/ are the DESIGN, not decoration. Open them in a browser. PORT THEM, NEVER
REDRAW THEM — a difference between your screen and the design is a defect in the port.
The owner answered Q1–Q7 on 2026-09-11 ("The owner's answers" above, and DECISION_LOG.md).
Build those answers; do not re-ask them.

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
- Q1 = A is the owner's yes to download the five named OFL faces from github.com/google/fonts.
  Any other download still needs the owner's yes in chat.
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
Jost: download it (Q1 = A) from github.com/google/fonts (ofl/jost, with OFL.txt). Commit woff2 like
the rest of app/_fonts — subset/convert with fonttools if the source is TTF — and ship only the
weights the design uses.

TRAPS:
- A skin owns what is BEHIND and AROUND the card — never the card, its 3 px top edge or its one
  button (doors-are-designed.test.ts). The skin never colours the button: the couple's button
  colour (Q2 = A) is applied through DoorShell for every Pro theme at once, by session 5.
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
the pattern. The owner's Q4 answer is B: shorten the print (below).

WHAT ALREADY SHIPS — DO NOT REBUILD: everything session 2's block lists, plus Velvet. Galeriya's
default opening (sheer veil) is already in the registry.

THE DELTA: galeriya.tsx + galeriya.module.css; one case in invite-skin.tsx; ready: true; fonts on
the invite doors only. Q4 = B: the hung print is SHORTENED until door 01's Continue sits above
640 px at 375×812 — the print stays on door 01, keeps its frame and its drape, and still carries
no words. Measure where Continue lands before and after, and put both numbers in the PR.

FONTS: DM Mono is already in the app. Schibsted Grotesk: download it (Q1 = A) from
github.com/google/fonts (ofl/schibstedgrotesk, with OFL.txt), woff2, only the weights used.

TRAPS: all of session 2's. Plus: the design keeps every word OFF the photo — that is what makes
it legible (8:1 over the veil). Do not move a word onto the print.

DONE WHEN: as session 2, for Galeriya, with a screenshot proving where Continue sits on door 01.
```

## 4 · Abaca · Rugged · **Opus 5 · high**

```
GOAL: couples with Event Hub Pro can choose Abaca for their invite link.

READ FIRST: designs/abaca.html, then Capiz, Velvet and Galeriya as the pattern.

WHAT ALREADY SHIPS — DO NOT REBUILD: everything above. Abaca's default opening (four-flap) is
already in the registry.

THE DELTA: abaca.tsx + abaca.module.css; one case in invite-skin.tsx; ready: true. Its three faces
— Alfa Slab One, Bitter, Oswald — downloaded (Q1 = A) from github.com/google/fonts (OFL),
committed under app/_fonts/ as woff2, each with its OFL licence file, loaded only on the invite
doors. Ship only the weights the design uses.

TRAPS: all of session 2's. Plus: Oswald is condensed — at 12 px it is the likeliest line in the
whole set to fail lint:legibility or read badly on a phone; measure it. Three new faces is the
heaviest theme — check the invite doors' page weight before and after and put both numbers in the
PR.

DONE WHEN: as session 2, for Abaca. After it merges all five themes are live — update
00_README.md's table and the memory note.
```

## 5 · Event Hub Pro · the finishing touches · **Opus 5 · high**

```
GOAL: finish the invite themes as part of Event Hub Pro, building the owner's 2026-09-11 answers
Q2, Q3, Q6 and Q7 (DECISION_LOG.md) — plus one thing that needs no decision.

1 · WHERE TO CHANGE THE LOOK (no decision needed). The picker says the invite "opens on your
reveal background, in your colour" but not where to change either. Link each: the colour is the
monogram colour on /dashboard/[eventId]/invitation; the background is on
/dashboard/[eventId]/studio/save-the-date.

2 · THE BUTTON IN THE COUPLE'S COLOUR (Q2 = A). On a PRO theme only, the one button on doors
01–03 takes the couple's button colour — events.site_button_color (#rrggbb, the Event Hub Pro
"Button color" item). Text on it is white or ink, chosen by luminance; when neither reaches 4.5:1,
the button falls back to #C24E25. House keeps #C24E25. Carry the colour through DoorShell's skin
from app/[slug]/invite/_lib/load-invite-look.ts — NOT from the theme files — so this session can
run beside sessions 2–4. doors-are-designed.test.ts needs a reasoned, line-keyed exception, never
a file-wide one. Remember the colour is one the couple typed: validate it as #rrggbb before it
reaches a style.

3 · THE EIGHTH PRO ITEM (Q3 = A). Add the invite theme where "the seven" live:
lib/website-pro-items.ts (WEBSITE_PRO_ITEMS), lib/event-hub-pro.ts (its headline + blurb — draft
them with the Fable model, the owner's standing preference for product copy, grounded only in what
ships), the buy page's BENEFITS, and every sentence that says "seven". Keep
says-what-it-includes.test.ts true both ways. Update EVENT_HUB_CONTROLLER_DESIGN_2026-09-02.md in
the corpus, which counts seven. Price and SKU do not change.

4 · NO SECOND REVEAL RIGHT AFTER ARRIVING (Q6 = B). A guest whose invite door 01 PLAYED the reveal
does not meet the Event Hub's reveal again on that visit; a later visit plays it as usual. A
House invite plays no reveal, so that guest's first reveal is still the Event Hub's. Suggested
shape (confirm it): door 01's overlay records "seen" for that event in sessionStorage when it
opens; the Event Hub's overlay reads it on mount and steps aside. 🪤 TRAP: on the Event Hub the
first lift of the veil is also what STARTS the Save-the-Date film ("Start the film once, on the
first lift") — stepping aside must still start the film. Prove both stages, save-the-date and
invitation.

5 · WEDDINGS ONLY (Q7 = A). The four Pro themes are offered only where the event type may show
the Save-the-Date film — resolveWeddingOnlyParts(profile).save_the_date_film, the reveal's own
fence. The picker does not offer them elsewhere, setInviteTheme refuses them server-side, and
resolveInviteTheme renders House for such an event even if a value was saved.

TRAPS: the reveal's WHEN is one rule (cinematicRevealPlays in lib/site-body-plan.ts) — never
restate it. The Pro gate is eventCoupleWebsiteProActive — never add a second ownership check.

DONE WHEN: all five are built, each guarded by a test that fails when it is reverted
(mutation-checked), and verified on setnayan.com after merge.
```
