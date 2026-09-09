# The chat, both sides — v4: the bench card is the shipped card, plus one line

**Prototype:** `chat_interface_v4_2026-09-09.html` (open it in any browser; no server, no fonts, no CDN).
Same five frames as v3. **Only the “Couple · the bench” frame is redrawn.** The Decisions view, both conversations, the supplier frames, the short previews, the Files rule and the phone conversation frames are byte-for-byte v3.

Handy links: `?tab=cp` for the bench, `?theme=dark`, and the v3 ones (`?tab=sd|sm|cd|cm`, `?state=pending`, `?open=<tool>`, `?sheet=1`, `?view=decisions|files`).

---

## 1. What the owner said, and what was wrong

> *“the imagery of each vendor is important. You lost add manually. Or you are just getting key information and did not check the full bench”*

He was right on all three counts. v3’s bench card was drawn from a description of the **page** (folders → categories → carousel → three actions) and never from the **card**. So it was a card invented for chat: an avatar circle, a name, a stage pill, a quote bubble, a price, the standing line, two buttons. The shipped card is a different object — a photograph on top, eleven facts under it, three-to-five actions beneath — and beside the carousel sit two cards the couple uses every day, **Find** and **Add manually**. v3 had neither.

v4 starts from the component itself: `apps/web/app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx` (`VendorCard`, `FitBadges`, `CardDateBlock`, the `.slcat .vc` stylesheet, the rail markup around “vendor carousel + find / add-manually”) and `bench-vendor-actions.tsx`, read top to bottom on the `/tmp/wt-doc` checkout. Every element those files render is in the table in § 3, with where it went.

---

## 2. What v4 draws

**The bench card, ported.** 206px wide in a snapping horizontal carousel. From the top:

- **Image block, 108px** — the supplier’s cover photograph, or their **initials in italic serif on a slate gradient** when they have none (Kusina ni Aling Nena and Sweet Tooth PH show this; it is a design, not an error). In the top-right corner: **★ Chosen** when locked (Hiraya, Casa Verde) or **Asked** when a lock has been requested and not answered (Feast & Co.). In the top-left: the **reason pill** that explains the card’s place under the current lens (*Fits your budget · est.*, *Near your venue*, *Closest to your venue*), suppressed on a Chosen card.
- **Meta block** — name · city with a pin · rating to one decimal and review count with a star · **Setnayan** and/or **Verified** badges · the **fit badges** (reach: *No travel fee* / *Travel fee applies* / *Reaches you*; budget: *Fits budget* / *Fits budget · est.* / *Over budget*; date: *Free on your date* / *Booked that day*; the schedule clash: *No shared date with …*) · the **price** · the **free-days line** (*Free: Fri 18 Dec*).
- **NEW — “Where you stand”**, one line under all of that, in the same place on every card, with the same words the conversation’s Decisions view shows.
- **The actions under the card**, exactly the shipped legs: **＋ Add to build** · **● In your build + Remove** · the *“Ask for a price to add this to your build”* note · the *“Waiting on them — Asked — they have N days left to answer”* note · **Open conversation** (the shipped *Check inquiry* leg, relabelled) · **Take it back** · **Lock this**.
- **The card is a trigger.** On the desktop frame a click opens the supplier’s **quick view** in the sticky column (gold ring on the card, name · category · city · rating · price · fit badges · *Open full profile ↗*), as the shipped `InspectorTrigger` does at ≥xl. In the phone it is a plain link, as shipped below xl.

**Beside the carousel, both rail-end cards:** **＋ Add another Catering** (the Find card, which reads “Add another …” once a category holds a lock and allows more — `railEndIsAddAnother`; every other category reads **Find more**) and **Add manually**. Press Find and **row 2 — “More in Catering”** opens in place under the carousel with its own search box, **See all →**, and marketplace cards carrying *Save to Catering · Inquire* — the owner’s 2026-09-06 “we do not want to leave the page”.

**The three caterers, three states, one row:** Hiraya (★ Chosen · photo · Verified · ₱187,500) · Kusina ni Aling Nena (no photo · Setnayan · in your build · new reply · ₱165,000) · Feast & Co. (Asked · photo · lechon & grazing station · ₱48,000). That row is the comparison the change exists for, and it now also shows every corner state and every action leg without opening anything.

**The surrounding bench furniture, all drawn:** the **coverage strip** (progress ring · *Cover your event* · *Covered 2 of 9* · nine icon tiles with state rings, count badges and the NEXT flag) · the **sort bar** (five ranking lenses — *Best matches · Nearest to your venue · Fits your budget · New here · In demand right now*, the last disabled with its reason in the tooltip — a divider, then the two plain sorts *Lowest price · Top rated*) · the **bench search** box · folder rows with icon, serif name, summary pills (*● 1 locked · 2 to decide*), chevron and their own **ⓘ** (press it: the shipped hint copy opens beneath) · category rows with icon, name, **In your plan**, **First shortlist free ✦**, the count badge, the **ⓘ** and the **saved-request** control · **Not needed? Remove** at the foot of every open, lock-free category (absent on Catering and Reception because they hold a lock) · **＋ Add to your event** chip pools at the foot of Feast and Look.

**At the top of the page, the roll-up:** **2 suppliers replied — Kusina ni Aling Nena · Lumen Studios · Read them.** One line, full width, under the section chips. (v3 had it inside the Picks column; on a phone that put it below the whole bench.)

**The sticky Picks column** is v3’s, minus the roll-up it no longer needs: *Locked in* (Hiraya with **2 with Hiraya ›**, Casa Verde), *In your build — ready to lock* (Kusina), *Still needs your decision*, the six tiles. The quick view opens at its top.

**Three states a screenshot would miss** (the accordion is single-open at each level, so only Catering is open in a still): drawn under the desktop frame — an **empty category** with *Find Dessert bar* and *Add manually* sharing a row plus *Not needed? Remove*; a **collapsed category that holds a lock** naming it (*🔒 Casa Verde Tagaytay*); and a **card behind the “Doesn’t fit your build” divider** — dimmed, never removed, its conversation still live.

**The phone** is not re-authored: the script clones the desktop frame into the phone screen, so nothing can be dropped for width. The card is the shipped 206px, the carousel is a swipe (one card and the edge of the next at 375px), the sort chips wrap, the coverage strip scrolls, and every control is ≥44px (the actions, the chips, *Not needed? Remove*, the Find/Add cards; the 22px ⓘ, the 30px saved-request control and the 28px *2 with Hiraya* chip carry invisible halos to 44px). The Couple · phone tab still clones this phone in turn, as in v3.

---

## 3. Every element the shipped card renders, and where it went

Read from `VendorCard`, `FitBadges`, `CardDateBlock` and `BenchVendorActions`. “Drawn on” names the cards in the file.

| # | Shipped element (source) | Drawn on | Note |
|---|---|---|---|
| 1 | Cover photograph, `object-fit: cover`, 108px block (`v.photoUrl`) | Hiraya · Feast & Co. · Lumen · Casa Verde · Piknik (row 2) | inline SVG stand-ins — no external images |
| 2 | Initials on the slate gradient when there is no photo (`initials()`, `.ini`) | Kusina · Sweet Tooth · Plateful (row 2) · Manila Brass (states) | white at .85 instead of the shipped .7 — see § 6 |
| 3 | Corner **★ Chosen** (`status === 'locked'`) | Hiraya · Casa Verde | |
| 4 | Corner **Asked** (`lockRequestState === 'requested'`) | Feast & Co. | the card’s own comment: *“an ask is not”* a settled booking |
| 5 | Reason pill, `ok` (leader) / `soft`, suppressed when locked (`reason`) | Lumen *Closest to your venue* (ok) · Kusina *Fits your budget · est.* (soft) · Feast & Co. *Near your venue* (soft) · Hiraya none | copy from `DIMENSION_COPY` / `dimensionCopyFor` |
| 6 | Name (`.vn`) | all | |
| 7 | City + map-pin (`.sub`, hidden when null) | all | |
| 8 | Rating to one decimal + review count + star (`.stars`, hidden when null) | all but Sweet Tooth | Sweet Tooth has no rating → hidden, as shipped |
| 9 | Badges: **Setnayan** (sparkles) · **Verified** (check) | Kusina Setnayan · Hiraya / Feast & Co. / Lumen / Casa Verde Verified | |
| 10 | Fit badges — reach (`resolveReachBadge`: *No travel fee · Travel fee applies · Outside their range · Reaches you · Beyond Nkm / Travel fee likely*) | Hiraya · Kusina · Feast & Co. · Lumen · Plateful · Piknik | *Outside their range* / *Beyond Nkm* not in the fixture |
| 11 | Fit badges — budget (*Fits budget* / *· est.* / *Over budget*) | Hiraya · Kusina (est.) · Feast & Co. · Lumen (over) · Casa Verde | |
| 12 | Fit badges — date (*Free on your date* / *Booked that day*) | Hiraya · Kusina · Feast & Co. · Lumen · Plateful · Sweet Tooth (booked) | |
| 13 | Fit badge — schedule clash (*No shared date with X*) | Manila Brass (states) | |
| 14 | Price (`formatPhp`, hidden when null/0) | all with a price; hidden on Sweet Tooth | anchor moved — see § 6 |
| 15 | Free-days line (`cardDatesInlineLine`: *Free: …* / *Free N of M days*) | Kusina *Free: Fri 18 Dec* | |
| 16 | “+N more” disclosure + popup of all free dates (`fd-more`, `fd-pop`) | **not drawn** | needs >4 free days in the window; this couple’s date is settled |
| 17 | Date-outcome sentence (*Locking this sets your date to …* / *Leaves N possible dates …*) | **not drawn** | `DateOutcome` is null once the date is anchored |
| 18 | The card as `InspectorTrigger` (≥xl: quick view in the sticky column; below xl / modified click: plain link) | desktop: click any card · phone: no-op | `data-inspector-selected` gold ring reproduced |
| 19 | **＋ Add to build** (`build.kind = 'add'`) | Lumen | |
| 20 | **● In your build** + **Remove** (`in_build`) | Kusina | |
| 21 | *“Ask for a price to add this to your build”* (`needs_price`) | Sweet Tooth | |
| 22 | *“Doesn’t fit your build — Remove X from your build and this vendor is bookable again.”* (`schedule_clash`) | Manila Brass (states) | |
| 23 | *“Waiting on them — Asked — they have N days left to answer.”* (`withdraw` non-null) | Feast & Co. | |
| 24 | **Inquire** (no live thread — `ContactShortlistVendorButton`) | row 2 cards only | every considered supplier in the fixture already has a thread; the leg keeps its label when none exists |
| 25 | **💬 Check inquiry** (thread exists — a `<Link>` to it) | Kusina · Feast & Co. · Lumen · Sweet Tooth · Manila Brass **as “Open conversation”** | the relabel; and extended to Hiraya · Casa Verde — see § 4 |
| 26 | **Take it back** (`WithdrawAskButton`) | Feast & Co. | |
| 27 | **Lock this** (`AccordionLockButton`) | Kusina · Lumen · Sweet Tooth | |
| 28 | Rail-end **Find more** / **＋ Add another {label}** (opens row 2 in place under the flag) | Catering *＋ Add another Catering* · Photo & video / Reception / Cake *Find more* | |
| 29 | Rail-end **Add manually** | every rail | |
| 30 | Empty category: *Find {label}* + *Add manually* sharing a row (`.find-set`) | Dessert bar · Drinks & bar · Ceremony · Gown · Hair & make-up · states panel A | |
| 31 | *“Doesn’t fit your build”* divider + sunk cards (`.raildiv`, `.is-dim`) | states panel C | no clash exists in the fixture |
| 32 | Row 2 *More in {label}* · search · *See all* → · cards with *Save to {label}* · *Inquire* | under Catering, opens on Find | the *Saved to … · Undo* state not drawn |
| 33 | Coverage strip: ring · *Cover your event* · *Covered N of M* · tiles (state ring, mini badge, NEXT) | drawn, 9 tiles | |
| 34 | *From your plan* chip strip (the pre-replan strip the coverage strip upgrades) | **not drawn** | superseded under the flag the whole drawing assumes |
| 35 | Convergence banner (PR-G1) | **not drawn** | server returns null on an anchored date |
| 36 | Sort bar: 5 lenses (one disabled with its reason) · divider · 2 plain sorts | drawn | |
| 37 | Bench search · *See all results in the marketplace for “…”* · inline marketplace results | search box drawn | the results list and jump link render only while typing |
| 38 | Folder row: icon · serif name · summary pills / *N considering* / *N categories* · chevron · ⓘ + hint box | drawn, 5 folders | hint copy is the shipped copy from `category-hints.ts` / `wedding-plan-groups.ts` |
| 39 | Category row: icon · name · *First shortlist free ✦* · *In your plan* · *✓ Covered* · count · chevron · ⓘ · saved-request control | drawn | *✓ Covered* and the *“✓ Covered — Reopen”* body not in the fixture |
| 40 | Locked-names line on a collapsed category | states panel B | hidden while open, as shipped |
| 41 | *Not needed? Remove* + its confirm | the control on every open lock-free category; **the confirm dialog not drawn** | |
| 42 | *＋ Add to your event* chip pool · *“Nothing from X in your event yet”* line | pools on Feast and Look; **the empty-folder line not drawn** | |
| 43 | Error lines (`plan-err`, `vact-err`, `mrerr`) | **not drawn** | |
| 44 | The Add-manually **modal** and the full **search sheet** | **not drawn** | only their doors are on the bench |

Nothing that renders on a shipped card is missing from the drawing. Rows 16, 17, 31, 34, 35 are absent from the *fixture* for the reason given, and 31 is drawn separately so the state is not forgotten.

---

## 4. Things I found in the card that the brief got wrong — or did not say

1. **“Open conversation” is not a relabel on a ★ Chosen card, because a Chosen card has no actions at all.** `resolveBenchCardActions` rule 2: *“Already LOCKED → nothing.”* It withholds Add-to-build, Lock **and the inquiry leg**. So today a couple cannot open their booked caterer’s conversation from the bench — and the booked caterer is exactly the one with two things waiting. v4 draws *Open conversation* on Hiraya and Casa Verde and says on the page that this is the one leg that is an **extension, not a port**: rule 2 should withhold build and lock only. It is the smallest change that makes the feature work, and it is flagged rather than slipped in.
2. **There are more than three legs.** The brief’s “three bench actions” is the docblock’s framing; the component renders **seven** states across four slots: add / in-build+remove / needs-price note / clash note; the *Waiting on them* note; inquire / check; *Take it back*; lock. All seven are drawn.
3. **Find does not “go looking”, it opens row 2 in place** (owner 2026-09-06), and it reads **＋ Add another {label}** on a locked category that allows more picks. The brief described the pre-2026-09-06 behaviour.
4. **The lens control is five lenses plus two plain sorts, with a divider that is “the point, not decoration”** (a lens is a recommendation with a reason pill; a plain sort is a comparator), and a lens can be offered *disabled* with its reason. Drawn that way.
5. **The whole of this — the three-action card, coverage strip, lenses, ⓘ, remove, add-pool, row 2 — is behind `NEXT_PUBLIC_EXPLORE_REPLAN_ENABLED`.** With the flag off the card renders as a bare trigger with no action rail at all. v3 already assumed the flag on; v4 does too, and says so here. I cannot read the flag’s production value from a session — it is a server-read env var — so **whether the live bench is the flag-on bench is a fact to confirm, not assume.**
6. **The bench still offers *Lock this* on a supplier who has declined.** Sweet Tooth said no to the date in the conversation; the resolver does not read the thread, so the card keeps Lock (correct after a *lock-request* decline — the couple may ask again — but odd after an inquiry decline). Drawn as shipped; the new standing line is what tells the couple not to. Noted, not changed.
7. **The shipped bench has gold-on-gold pairings under AA.** Measured from the stylesheet: `.fsum .s.lk` (#8C6932 on rgba(169,131,75,.16)) ≈ 4.25:1, `.cat-plan` (on .13) ≈ 4.39:1, `.vact.quiet` (on .10) ≈ 4.53:1 — the first two fail 4.5 on white. The prototype uses a .06 tint for those (4.67) and states it. This is a finding about the live bench, not fixed by a drawing.

---

## 5. The rule that makes “show it twice” safe — and how v4 makes it a mechanism, not a sentence

Owner: *“yes, it is fine to show it twice.”* The same standing may sit on the bench card, in the Picks column and inside the conversation. What makes that safe is **one derivation rendered several times, never three derivations, and never two controls doing the same job differently.**

v3 broke its own rule inside one file: the Hiraya bench card said *“they haven’t confirmed it yet · price not answered”* while the same couple’s Decisions line in the conversation frame said *“nothing needs you”*. Two hand-typed sentences, already disagreeing.

v4 fixes it structurally in the prototype: the Hiraya and Lumen cards carry `data-standing-from="#f-cd"` / `"#f-cm"`, and the script **copies the conversation frame’s Decisions line into the card at load**. There is no second sentence to drift. (The cards with no conversation frame in this file — Kusina, Feast & Co., Casa Verde, Sweet Tooth — are typed once, in the card only.) The stage pill at the head of that line is hidden on the card, because the card’s own corner (★ Chosen · Asked) is its stage. The **2 with Hiraya ›** chip in Picks is that sentence counted, and it jumps to the card; it opens nothing. The roll-up at the top of the page is the same derivation counted across suppliers.

In the build this is one function — the one that produces the Decisions standing — with three renderers.

---

## 6. Deviations from the shipped stylesheet, each said out loud

- **Price anchor.** The shipped `.price` has `margin-top:auto` (it sits at the card’s foot). With the new line below it, that anchor moved to `.stand`, so the price stays beside its badges and the standing line sits at the foot. A port that keeps the auto-margin on the price leaves a gap between the badges and the price on the shorter cards.
- **Initials tint .85, not .7.** White at .7 over the light end of the slate gradient measures 4.1:1 — fine as large text (26px), below the 4.5 bar this brief sets. .85 measures 5.48 at the light end, 8.17 at the dark end.
- **Gold tints at .06 where gold text sits on them** (`quiet`, `on`, `In your plan`, `● N locked`) — see § 4.7. Text gold is the palette’s `#8A6B39`, never the decorative `#A9834B`.
- **Setnayan badge** — terracotta text on white with a soft border, not on the ink tint (terracotta on the .10 ink tint is 3.85:1).
- **Card ground** is the page white with a hairline, as the shipped `--card:#fff`; in dark it is the page dark, as every other card in this file (the shipped dark card is a lighter `#2A2E36`).
- **Frame width 88rem (1408px)** so the whole rail — three cards, Find, Add manually — is visible without scrolling in a still. At 1440px with the app shell the left column is 716px and the rail scrolls; the Add-manually card peeks. Both are true; the still needed the wider one.
- Sizes are the shipped ones (mono 7.5–9px badges, 8px corner and reason pills, 11.5px actions). They are small; they are what ships. Phone controls are raised to ≥44px; desktop actions keep the shipped ~32px.

---

## 7. Colours — measured in the browser, both themes

Computed from each element’s rendered colour against its composited background (alpha walked up the ancestors), light / dark. Lowest first:

| pairing | light | dark |
|---|---|---|
| **● N locked** pill · **In your plan** · **Lock this / Take it back** · **In your build** (text-gold on .06 gold tint) | **4.67** | 8.69 |
| ★ Chosen / Asked corner · count badge · Best matches (on) · Find card · Find row · **2 with Hiraya** · roll-up dot text · See all · open folder/category name · Setnayan badge (terracotta ↔ white) | 4.76 | 5.76 |
| Saved-request control (icon) | 4.76 | 5.76 |
| Rating · Where-you-stand label · reason pill (ok) · NEXT flag · locked-tile badge · coverage count · locked names · divider label · quick-view label (text-gold ↔ white) | 4.95 | 9.31 |
| Initials on the slate gradient (light end / dark end) | 5.48 / 8.17 | same gradient, darker in dark |
| Fit badge · warn (#6F5A2E on gold tint) | 5.58 | 7.32 |
| Verified badge · fit ok (green on green tint) | 5.65 | 7.00 |
| *confirmed* (green on white) | 6.32 | 8.28 |
| Hint box | 6.69 | 6.47 |
| Sort chips · to-decide pill · Add manually card/row | 6.89 | 7.61 |
| City · free days · standing body · note text · Remove · Not needed? Remove · Add-to-event chip · tile labels · ⓘ | 7.72 | 8.22 |
| Name · price · standing strong · folder/category names · search text · roll-up | 14.28 | 14.92 |
| Reason pill (soft) on the photograph | 14.28 | 16.89 |

Every text pairing ≥ 4.5:1 in both themes. **Three failed on the first run and were fixed before this file was finished:** *● N locked* and *In your plan* at 4.29 (gold text on the `--gold-soft` tint), and the saved-request control at 4.25 (terracotta on the cream paper — the same cream trap v2 and v3 both hit). The disabled lens chip is at .42 opacity as shipped; a disabled control is exempt from the text rule and reads its reason on hover and to a screen reader.

---

## 8. What I checked in the real code for this revision

All on the doc checkout at `/tmp/wt-doc`, `apps/web/`:

1. `app/dashboard/[eventId]/vendors/_components/shortlist-categories.tsx` — the whole `.slcat` stylesheet (rail · card · image · corner · reason pill · meta · badges · fits · price · free days · action rail · Find/Add cards · find-set · coverage strip · sort bar · search · folder/category rows · ⓘ/hint · locked names · remove · add-pool · row 2 · divider · dim), `VendorCard` (lines ~740–860), `FitBadges`, `CardDateBlock`, `initials()`, and the level-3 markup (`.rail` → `VendorCard`s → `.act.find` → `.act.manual` → `.raildiv` → clashes; `.find-set` for an empty category; the `morerow`; `.cat-note`; `.addpool`).
2. `bench-vendor-actions.tsx` — the seven rendered states and their copy constants.
3. `lib/bench-card-actions.ts` — which legs a card gets: rule 2 (locked → nothing), rule 4 (inquiry needs a marketplace id), rule 5 (clash withholds build + lock, inquiry survives), rule 6 (an outstanding ask replaces lock with withdraw); `railEndIsAddAnother`.
4. `lib/explore-info-copy.ts` — every string on the page: `CARD_*`, `FOLDER_SUMMARY_*`, `COVERAGE_STRIP_HEADING`, `coverageCountLabel`, `ADD_TO_PLAN_HEADING`, `REMOVE_FROM_PLAN_LABEL` and its note, `cardAddAnother`, `waitingOnSupplier`, `lockedNamesLine`, `inlineMore*`, `cardDatesInlineLine`, `dateOutcomeLine`.
5. `lib/bench-sort.ts` (`BENCH_PLAIN_SORTS`, `DIMENSION_COPY`, `sortWithReasons` — leader gets `ok`, the rest `soft`) · `lib/ranking-lenses.ts` (the five lens labels; the forbidden-copy list, which no pill here breaks) · `lib/vendor-service-radius.ts` (reach badge texts) · `lib/build-date-window.ts` (`DOESNT_FIT_*`, `doesntFitReason`, `noSharedDateBadge`, `freeDaysLine`) · `lib/coverage-strip.ts` (the six states and their glyphs) · `lib/category-hints.ts` and `lib/wedding-plan-groups.ts` (the ⓘ copy drawn verbatim) · `lib/setnayan-ai-free-assist.ts` (*First shortlist free ✦*) · `lib/explore-replan-flag.ts`.
6. `vendor-quickview-inspector.tsx` header — what the quick view shows (the same `ShortlistVendor` fields, one action: *Open full profile ↗*).

Not verified live: the production value of the replan flag (§ 4.5), and — unchanged from v3 — whether *Check inquiry* lands on `/messages/[threadId]` for every stage.
