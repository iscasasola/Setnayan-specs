# Universal UI rules — buttons (one colour per meaning, icon + word by width) · numbers (count to their value)
**2026-10-07 · Fable · design rule for the WHOLE site (owner, verbatim: *"can we create this similar rule on all buttons on the website?"* · *"so a list of all buttons on the website and what their colors are"* · *"we want all interactive button to be buttons across the website"*).**
Nothing here is built. The Suppliers prototype (`prototypes/suppliers_page_2026-10-07_fable.html`, corpus 459e015) is the reference implementation of the rule; this doc carries it to every other page.

## The rule (owner 2026-10-07, four sentences)
1. **Every interactive control is a button** — a pill with a border, 40 px tall on phone, never a bare text link with a › after it. (Links that *navigate* to another page stay links; anything that *does* something is a button.)
2. **Icon + word.** Every button carries an icon and its word. *"when icon can present text, show text. when icon can present icon with text show both."*
3. **Words drop by width.** *"so it depends on the width of the screen."* A row measures itself after render; if the words do not fit, the right-most secondary buttons drop to icon-only, one at a time; the main verb always keeps its word. Desktop shows every word.
4. **One colour per meaning**, the convention every major system shares (Bootstrap · Material · Ant · Apple HIG): the same meaning is the same colour on every screen, so the colour is learnt once.

## The colours (shipped tokens — read `apps/web/app/globals.css`, never a hex from memory)
| Tone | Meaning | Token (light · dark) | Filled (main verb) / outlined (the rest) |
|---|---|---|---|
| **Terracotta** | primary — the forward step | `--color-mulberry` (name kept; #C24E25 · #E5794E) — what `ISegmented tone=wine` and `.m-btn-primary` already use | white word on terracotta / terracotta word on 9 % tint |
| **Green** | confirm · commit · money | new `--color-ok` (#2E7D4F · #6FCF97) — today the app has `text-emerald-*`/`bg-emerald-*` scattered, no token | same |
| **Blue** | messaging · information | new `--color-info` (#1F6FB2 · #7AB8F0) — close to the shipped `--color-link` slate (#5B6E8C · #9DB2CE); owner call: reuse `--color-link` or add `--color-info` | same |
| **Amber** | attention — waiting on you | new `--color-warn` (#B26B00 · #F0B45A) — today `amber-*` classes, no token | same |
| **Red** | destructive — take it back | new `--color-danger` (#B3261E · #F2817A) — today `text-red-600` etc. in 40+ files, no token | same |
| **Grey** | manage · edit · neutral | `--color-ink` / `--color-mute` (shipped) | ink word on paper |
⚠ Book and Pay share green deliberately (both are "commit"); the icon and the word separate them. If Pay must differ, the only honest choice is terracotta — no cross-site standard exists for Pay.
✅ **The guest Event Hub (`/[slug]`, `/e/…`) is EXEMPT from both rules** — owner, verbatim, 2026-10-07: *"except for the event hub which the users design themselves."* Couples design those pages; the platform's button colours and counting numbers do not apply there. (The Maker that EDITS the hub is platform UI and follows the rules.)

## Rule 2 — every number counts to its value (owner 2026-10-07: *"all numbers on the app will animate going to that number … upon load or change"* · *"this needs to be universal rules across the website"*)
- **Every number the user reads** — money, counts ("6 yours", "2 of 5", "3 builds"), percentages — is rendered through one component (`<Count value format>`), never as a bare string.
- **On load** it counts from 0 to its value; **on change** from the old value to the new. Ease-out, 420–900 ms (longer for a bigger jump), formatted at every frame (₱ with separators · integer · %). `prefers-reduced-motion` → the value is shown at once.
- The same component keys on a stable id, so a re-render of the page does not restart from 0 — only a real change animates.
- Reference implementation: `count()` / `money$()` / `num$()` in `prototypes/suppliers_page_2026-10-07_fable.html` (corpus, this date); in the repo the nearest shipped piece is the budget meter's animated figures — the builder extends that into the shared component rather than writing a second one.
- Exempt: the guest Event Hub (above).

## How a builder applies it (one component, then sweeps)
1. **Two shared components** — `apps/web/components/action-button.tsx` and `apps/web/components/count.tsx` (Rule 2). `ActionButton`: `<ActionButton tone icon label main onClick/href>`; renders icon + `<span class="lbl">`; `aria-label` = the word, so icon-only is still readable. Plus one hook `useFitRow(ref)` = the fit pass (remove `icon-only`, then from the right add it until `scrollWidth ≤ clientWidth`; re-run on resize). Tokens `--color-ok/info/warn/danger` added to `globals.css` light + dark with the AA numbers in the comment, as every other token there has.
2. **Sweep by area, one PR per area**, in the order below. Each PR: replace every `<button>`/`<a className="…btn…">`/text-link-with-› in that area with `ActionButton`, tone from the table in this doc; the PR body carries the before/after at 375 and 1280 and a one-line check card for the owner.
3. **A guard** (`apps/web/tests/every-action-is-a-button.test.ts` or a CI script): in swept areas, no `<button` without `ActionButton`, no `›` inside an `<a>`/`<button>` text, no `text-red-*`/`bg-emerald-*` on a button. Scope grows with each sweep; never weakened.

## The list — every interactive control on `origin/main`, by area, with its colour
Read by six Sonnet readers on 2026-10-07 (owner: *"use a lower model for non fable required tasks and launch them in parallel"*), one per area, against an archive of `origin/main`. Full tables live in **`BUTTON_INVENTORY_2026-10-07/`** (one file per area; a heading per source file; one row per control: label as the user sees it · what it does · what it is today · colour). Counts below are the readers' own totals; rows that repeat per item (per guest, per row) count once, so every number is a floor.

| # | Area | Controls | Already buttons / pill links | **Must become buttons** (text links, bare icons, clickable elements) | Pure page links (stay links) | Need a human call |
|---|---|---|---|---|---|---|
| 1 | Couple · Suppliers · Budget · dashboard home & account (`out-1`) | 558 | — | **288** | — | 10 |
| 2 | Couple · event dashboard — Papic, Gifts, Mood Board, schedule, seat plan, stories, settings, home (`out-2`) | 1,588 | — | **693** | — | 12 |
| 3 | Couple · Guests + Event Hub Maker (`out-3`) | 668 | — | **~179** | 65 | 0 |
| 4 | Supplier side — dashboard, public page, claim, `for-suppliers` (`out-4`) | 785 | 332 buttons + 105 pill links + 74 clickable | **204** (137 text + 67 icon-only) | 73 | 3 |
| 5 | Admin · sign-up · login · onboarding · Live (`out-5`) | 854 | — | **132** | 187 | 5 |
| 6 | Marketing · shared components · `(shell)` · public supplier page `v/[slug]` (`out-6`, guest hub rows included but EXEMPT) | 1,415 (290 of them guest hub) | — | **169** | 404 | 149 (mostly `{label}` props) |
| | **Total** | **≈ 5,870** (≈ 5,580 without the exempt guest hub) | | **≈ 1,665 to convert** | ≈ 730 | ≈ 180 |

**Where the readers disagreed, the rule is settled here (builders follow this, not the per-file colour):**
- **"Cancel" that only closes a dialog or backs out of a form = Grey.** Red is for cancelling a thing that exists (a booking, a payment, a build). Readers 1, 2 and 6 split on this; this line decides it.
- **Filter-bar "Apply" / "Search" / "Show results" = Grey** (they narrow a list; nothing is committed).
- **Tabs, chips, option cards, segmented choices, switches = Grey "pick"** — and per the owner's standing rule, any *set* of choices is one dropdown, not a chip row.
- **"Hold the price" = Green (commit) · "Counter" / "Counter-offer" = Blue (it is a message in the negotiation).**
- **"Send my reply" and every RSVP-style send = Green** (it commits an answer); **"Send to the host / couple / request" = Blue** (it is a message).
- **A button whose label flips with state** ("Publish to my page" ↔ "Unlist", Papic face-mode On/Off/Auto, "Contest this dispute" ↔ "Edit your response") takes the colour of the state it will PUT you in: Terracotta to publish, Red to unlist; Grey when it only shows a current setting.
- **Consent checkboxes, radios, selects, text fields are form fields, not actions — no colour.**
- **"Unlock my service" (supplier frees a date hold) = Grey**, not Red — nothing is destroyed.
- **"Save {category}" on the inline More row actually ADDS to the shortlist → Terracotta**, whatever the word says (and the word should be "Add").
- **`{label}` props (149 in `out-6`, 12 in `out-2`, 5 in `out-5`):** the colour is decided at the CALL SITE in the sweep — `ActionButton` requires a `tone`, so a builder cannot leave one blank.

**Method caveats, so nobody mistakes this for a hand audit:** readers 4, 5 and 6 parsed the JSX with a script and then hand-corrected rows (≈ 770 corrections in `out-4`, ≈ 600 in `out-5`); readers 1 and 2 fanned out into sub-readers (6 and 14) with one rule but uneven strictness; two sub-readers read label constants from `apps/web/lib/*` outside their area (read-only); `seating-editor.tsx` was read in two halves; `explore/`, `categories/`, `chat/`, `inbox/`, `vendors/`, `hub/` and `e/` do not exist as folders on `origin/main` — the marketplace Find, the inbox and supplier pricing live under other paths and are covered where they live. Every per-area file states its own gaps at the bottom.
