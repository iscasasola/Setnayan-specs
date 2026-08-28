# One vocabulary instead of two — measured, and one recommendation

> ## ✅ DECIDED AND BUILT — 2026-08-28
> **The owner answered twice: *"1. yes 2. yes their own words."*** The recommendation in § 5 is the
> one that shipped: a card's kind may now be a **coverage leaf**, the chooser's leading band is the
> shop's own words, and the 52 legacy kinds stay one tap below. **Nothing was migrated — production
> has never held a supplier-authored service card.** PR
> [#4942](https://github.com/iscasasola/setnayan-platform/pull/4942); `DECISION_LOG.md` row 2026-08-28.
> **Do not re-ask the decision.** The measurement below is kept as the evidence it was made from.
>
> ⚠ **TWO THINGS IN § 7 BELOW ARE NOW STALE, corrected here rather than left to mislead:**
> item **3** (the public shop page printing a raw key) was **already closed the same day by another
> session** — that page normalised onto `displayServiceLabel`, which humanises rather than printing
> the key; and item **4** (no database-level validation) is unchanged but the app-side gate is
> wider and still closed. Items 1, 2, 5 and 6 stand.
>
> 🛑 **AND A THIRD CORRECTION, FROM THE OWNER HIMSELF: *"why can't other shops create their card? the card is universal fit for any service."*** **He is right.** Wherever this document implied a trade with no card kind could not MAKE a card, that was **overstated and is corrected in place below.** `misc` (*Miscellaneous*) sits in the picker's Other group, is offered to every shop, and is **exempt from the family cap** (`parentsOfCategory('misc')` → `[]` → always `'open'`), so the card was **always universal and always makeable**. The 51 leaves and the 3 ungrouped funeral kinds are a **NAMING** gap — a real defect, and a smaller one than first written.
> 🔑 **An absent option is not a closed door when a catch-all sits on the same screen.** Check for the catch-all before calling anything unreachable — the same shape as reading an empty column as a missing mechanism.

> **Session S2** of [`WHATS_NEXT_Service_Card_SESSIONS_2026-08-28.md`](WHATS_NEXT_Service_Card_SESSIONS_2026-08-28.md).
> **Measurement only. Nothing was built, nothing was migrated, no leaf was renamed, no category was
> added, and the family bridge was not touched.** This ends at an OWNER_DECISION.
>
> Everything below is read out of **production** (`njrupjnvkjkitfctetvi`) **by the object** —
> `service_categories`, `canonical_service_taxonomy`, `canonical_service_schemas`, `vendor_profiles`,
> `vendor_coverages`, `vendor_services`, `event_vendors`, and `pg_get_functiondef` — and out of the
> code at `origin/main` = **`137a0e458`**, read in a detached worktree, never from `~`.
>
> ⚠ **PR [#4930](https://github.com/iscasasola/setnayan-platform/pull/4930) was OPEN, not merged, at
> the time of this measurement.** The coverage-first chooser it adds is therefore measured from the
> shipped `[category]` picker on `main`, which is the same 52-key list. Nothing here depends on
> #4930 landing.
>
> **Full 262-row table:** [`SERVICE_CARD_VOCABULARY_TABLE_2026-08-28.md`](SERVICE_CARD_VOCABULARY_TABLE_2026-08-28.md)

---

## 0 · The one-page version

A supplier says what they do **twice**, in two different languages, on two different screens.

* **Coverage** speaks the live taxonomy: 16 folders → 73 branches → **262 leaves**. The owner's own
  shop covers a leaf called **Pabati**.
* **Service cards** speak a hardcoded list of **52 keys** that predates it. There is no *Pabati* in
  it, and there never can be — the list is a TypeScript union, so only a deploy can add a word.

The maker bridges them **by family**, which is correct, and is why a shop covering *Pabati* is
offered a card kind called *Photobooth*. **The bridge works. The words do not.**

**The decision is smaller and safer than it looks, for one measured reason: a couple never searches
the card-kinds list.** Every "find me a supplier" path in the app filters on the **coverage**
vocabulary. Changing the card kinds moves nothing a couple types, clicks or sees in results.

**And it is free exactly once. Today production holds ZERO supplier-authored service cards.**
The only two card rows belong to a seeded fixture shop that is hidden from the public. Every month
of real suppliers turns a one-line decision into a data migration on other people's work.

**Recommendation: make a card's kind the same word the shop already used to say what it covers —
its coverage leaf — and let the supplier pick it from their own coverage instead of a 46-pill wall.
Do it now, while it costs nothing.** Options and risks in § 5.

---

## 1 · What the two vocabularies actually are

| | Coverage | Service cards |
|---|---|---|
| Where a supplier meets it | "Your coverage" on My Shop | the card maker's kind chooser |
| Where it is stored | `vendor_coverages.canonical_service` (+ mirrored into `vendor_profiles.services[]`) | `vendor_services.category` |
| Where the list comes from | the **admin-managed database** — an admin adds a word, it appears with no deploy | a **hardcoded TypeScript union** — `VENDOR_CATEGORIES` in `lib/vendors.ts`. A new word needs a deploy |
| Size | **262** visible leaves · 73 branches · 16 folders | **52** keys |
| Grain | a trade ("Pabati", "Sorbetes Cart", "Mehndi Artist") | a department ("Photobooth", "Catering", "Miscellaneous") |
| Validated where | `createCoverage` refuses anything not in the live tree | the `[category]` route: `CATEGORY_SET.has(category)` → `notFound()` |
| Validated in the database | — | **No.** `vendor_services.category` is plain `TEXT NOT NULL`, and `save_vendor_service` does not check it against anything (read out of prod with `pg_get_functiondef`) |

The bridge between them, `VENDOR_CATEGORY_CANONICAL`, maps each of the 52 keys to one or more
**tier-2 tiles** — the *branch*, not the leaf. 48 keys map to a tile; 4 (`officiant`,
`church_fees`, `security`, `misc`) are deliberately exempt. **Every one of the 57 tile references
resolves against live production — zero drift.** The bridge is sound. It is the vocabularies that
disagree.

---

## 2 · (a) The overlap, measured

**262 visible coverage leaves.** For each one, is there a card kind that means the same thing?

| | leaves | share |
|---|---|---|
| **EXACT** — the leaf key *is* one of the 52 card-kind keys | **16** | 6% |
| **FAMILY only** — a card kind claims the leaf's tile, but no word matches | **195** | 74% |
| **NONE** — no card kind **means this trade**. ⚠ The shop can still make a card — see the correction at the top; it just has to file it under *Miscellaneous* or a department that is not theirs | **51** | 19% |

The 51 orphans sit across **19 tiles that hold leaves**. The loudest:

| Tile with no card kind | leaves | who this is |
|---|---|---|
| Outdoor | 9 | generator hire, mobile restrooms, tent rental, misters, outdoor lighting |
| Food Cart | 8 | sorbetes, halo-halo, ice cream, mini lechon, cotton candy, crepe |
| Women's Attire | 6 | bridesmaid dresses, flower girl, mother-of-bride, ninang sets |
| Men's Attire | 5 | groomsman sets, ring bearer, ninong sets, 18 roses |
| Mocktail · Digital Services | 3 each | alcohol-free bars; Setnayan's own monogram / Pakanta |
| Coffee · Dessert · Engraving · Trophies | 2 each | |
| Dance Floor · Escort · Fireworks · Food Truck · Grooming · Orchestra · Stations · Wedding Singer · Date & Feng-shui | 1 each | |

**Two empty orphan tiles** (`editorial`, `filipiniana_barongs`) hold no leaves at all.

**In the other direction — card kinds no leaf covers.** Zero card kinds point at a dead tile. But
the reverse question that matters is different and worse:

> **Only 16 of the 52 card kinds exist as a canonical leaf** (`accommodation`, `av_production`,
> `catering`, `event_insurance`, `event_medic`, `host_emcee`, `kids_entertainer`, `mobile_bar`,
> `personal_accident_insurance`, `referee_official`, `restaurant_reservation`, `reveal_element`,
> `speaker_talent`, `tour_activity`, `tour_guide`, `travel_insurance`).

Measured twice by independent routes (a key join against `canonical_service_schemas`, and the EXACT
column of the leaf table) — both give 16. That number has a consequence in § 4.

### The picker, as a supplier actually sees it

The register's line *"~52 category keys (~34 labels after duplicates collapse)"* is **wrong in both
halves, and I am correcting it rather than repeating it.** Measured:

* **52 keys · 52 distinct in-code labels.** Nothing collapses on the in-code labels.
* The picker does not show the in-code labels. It resolves each key through
  `labelForVendorCategory`, which returns the **live tile label from the database**. Three pairs
  then collapse (photographer+videographer → *Photo & Video*; makeup+hair → *HMUA*; choir+string
  quartet → *Choir*) — so **49 grouped members render as 46 pills in 6 groups**, not 34.
* **3 of the 52 keys are in no group at all** — `funeral_home`, `cremation`, `memorial_park`, added
  2026-08-27 with the wake work and never added to `SERVICE_GROUPS`. **No funeral-shaped word
  renders in that picker at all** — a funeral home could still make cards, it just had to file
  them under *Miscellaneous*.
* **33 of the 46 pills show a word that is not the word the value is stored under.** Mostly
  harmless case changes. Three are not:

| Pill a supplier presses | What it actually stores | Why it reads wrong |
|---|---|---|
| **Live Band** | `band_dj` — band **and** DJ | a DJ-only shop is asked to file under "Live Band" |
| **Bridal Car** | `transportation` — bridal car, guest shuttle **and** transfers/rentals | a van-rental or airport-transfer shop is asked to file under "Bridal Car" |
| **Massage Chair** | `guest_booth` — seven booth trades | a perfume bar, an arcade or a henna artist is asked to file under "Massage Chair" |

This is not a taste problem, it is a mechanism: for a key that spans several tiles, the label helper
takes **`tiles[0]`** and prints that tile's name. **The labels were already switched to the taxonomy
while the values stayed legacy — which is the half-migration this decision is about finishing.**

---

## 3 · (b) Production, by the object — how many real rows this touches

| | count | notes |
|---|---|---|
| Shops | **2** | `SetnaProd` (verified, `is_published=false`) · `Saysay Live Band & Hosting (FIXTURE)` (`public_visibility='hidden'`) |
| Coverage rows | **2** | both `SetnaProd`: **`pabati`** + **`day_of_coordinator`** |
| Service cards | **2** | both the FIXTURE shop |
| Couple-side vendor rows (`event_vendors`) | **45** | a **different** column; see below |
| `event_vendors.category_key` populated | **0 of 45** | see § 4 |

**The two cards are a fixture, not authored work.** Both rows carry `created_at` =
`2026-08-01 08:10:21.894705+00`, **identical to the microsecond** — one bulk insert. Both have no
title, no coverage link, and belong to the hidden fixture shop. **Nobody has ever authored a service
card in production.**

🚨 **And both of them hold a value that is not in the card-kinds list at all.** They store
`live_band` and `host_mc` — **tier-2 tile ids**, where the list holds `band_dj` and `host_emcee`.
So production is not in one of the two vocabularies; it is in a **third** state. The database allows
it because the column is unvalidated `TEXT`; the app's only gate is the route, which would 404 on
those same values. *(Not a live harm — the shop is hidden. It is evidence about how easily this
column drifts.)*

**The 45 couple-side rows are clean and are NOT the same thing.** `event_vendors.category` holds 15
distinct values, **all 15 are legitimate card-kind keys**, and all 45 rows are unlinked to any shop.
That column is the couple's own private supplier list. **It is not in scope and must not be moved
with this decision.**

**Safe by arithmetic:** changing what a service card's kind is worth today touches **2 rows, both
seeded, both hidden from the public, and both already outside the list being changed.**

---

## 4 · (c) What a couple searches by — the finding that reframes the decision

The brief assumed *"a migration touches what couples search by, so it is his call."* **Measured, it
does not.** Every supplier-discovery path in the app filters the **coverage** vocabulary:

* `/explore?category=<key>` runs `.contains('services', [key])` against **`vendor_profiles.services[]`**.
* `/explore?tile=<slug>` runs `.overlaps('services', <that tile's canonical leaves>)`.
* **Every `?category=` link the app emits carries a canonical LEAF key** — the six explore chips
  (`photography`, `videography`, `catering`, `wedding_coordination`, `bridal_hmua`, `wedding_cake`),
  all 22 dashboard plan-group hints (`photo_booth`, `live_band`, `dj`, `wedding_ring`, …), the
  taxonomy autocomplete, the category tiles and the paperwork nudge. **Not one emits a card-kind
  key.** *(The comment in `explore/page.tsx` claiming the chip UI sets "one of the 28-enum
  VendorCategory keys" is stale — I checked the emitters, not the comment.)*
* `vendor_services` is read on that page **only for enrichment** — the lowest starting price, the
  primary photo, the off-peak-deal badge, the has-an-active-service constraint. **Never as the
  category filter.**

⇒ **Renaming, splitting or replacing the card-kinds list changes nothing about what a couple can
search for, or which shops come back.** That removes the biggest risk the brief assumed.

**What a couple *would* notice** is smaller and is on the shop page, and it is already broken:

1. **A card with no title prints its raw database key.** `app/v/[slug]/page.tsx` falls back to
   `isCanonicalService(s.category) ? VENDOR_CATEGORY_LABEL[...] : s.category` — so a category outside
   the 52 is rendered verbatim. **That is exactly the state of both production cards** (`live_band`,
   `host_mc`). Only the hidden fixture shop saves us today. *(Also on S5's list; naming it here
   because it is the same defect.)*
2. **The same file holds both beliefs at once.** ~325 lines below that fallback, its own comment
   reads *"the initial pick's category IS the canonical_service (`vendor_services.category` ≈ 1:1
   with `canonical_service_schemas`)"* — and the requirements pop-up is built on that belief:
   `fetchRequirementFields(admin, s.category)` looks the card's category up as a **leaf key**.
   **So the label wants a card kind and the requirements want a leaf, out of one column.** With
   only 16 of 52 kinds existing as leaves, **the requirements pop-up can never find fields for 36 of
   the 52 kinds** — and it fails soft, so it looks like "this trade just has no questions".

🔴 **And the migration was already started and stalled.** `event_vendors.category_key` was added
2026-08-15 as **PR-1 (EXPAND) of a documented 4-step enum→key plan** — expand, dual-write, read,
drop. It is FK'd to `service_categories`. Measured: **0 of 45 rows carry a value, and no code
anywhere writes it** (three mentions repo-wide, all comments or the Ugat map). PR-2 never shipped.
**The seventh "gate with no handle": a column built for exactly this decision that has never held a
value.** It is the couple-side column, not the card column — but it is the precedent, and it shows
what happens when this is half-done.

---

## 5 · (d) The recommendation, and the options behind it

### ✅ Recommended — **one word, and it is the leaf**

**A service card's kind becomes the same word the shop already used to say what it covers: its
coverage leaf.** The chooser stops being a 46-pill wall and becomes *"which of the things you cover
is this card for?"* — for the owner's own shop, that is **two** choices, not 46.

**Why this one:**

* **It is the shop's own words.** A Pabati shop makes a *Pabati* card. Nobody has to recognise their
  trade under a word they never chose.
* **It finishes a half-done change rather than starting one.** The picker already shows taxonomy
  labels; the shop page already assumes the category is a leaf; the maker already leads with
  coverage. Only the stored value is still legacy.
* **It fixes the requirements pop-up for all trades instead of 16 of 52** — for free, because the
  lookup already keys on a leaf.
* **It closes the 51-leaf hole.** A generator-hire or sorbetes-cart shop can NAME its card, and every
  future admin-added leaf is reachable **with no deploy** — which is the whole reason the taxonomy
  is in the database.
* **It splits the three dishonest pills.** Band and DJ, bridal car and van rental, and the seven
  booths stop sharing one value with one misleading name.
* **Couples are unaffected** (§ 4), so it is not a marketplace change.
* **It costs 2 fixture rows today.** It will never be this cheap again.

**Shape, so this is not a blank cheque:**

1. Keep `vendor_services.category` and **widen what may go in it to a canonical leaf**, the same
   expand→dual-write→read→contract sequence PR-1 already wrote down for the couple side — and
   actually finish it this time.
2. The chooser offers **the shop's own coverage leaves first**, then the full tree, searchable —
   which is what #4930 already draws; only the value it posts changes.
3. `VENDOR_CATEGORIES` stays exactly where it is **for the couple side** (`event_vendors.category`,
   45 real rows). **Nothing about the couple's private supplier list moves.**
4. The public shop page's two contradictory fallbacks collapse into one that resolves a leaf label
   and can never print a key.

**Honest cost and risk:**

* **~66 code sites read `vendor_services`.** Every reader of `.category` has to be enumerated —
  *by the column, not from memory*; the packages join, the couple's inquiry composer, the schedule
  pools and `service_card_records` all key on it.
* **The 3 multi-tile kinds split.** `band_dj` → band **and** DJ; `transportation` → 3;
  `guest_booth` → 7. That is a product improvement and it is also a real change of meaning. With
  zero authored cards it costs nothing; with real cards it is a conversation with every supplier.
* **The URL carries the kind** (`/services/new/[category]`), so old links to a legacy kind stop
  resolving. Nobody has such a link today.
* **The four exempt kinds** (`officiant`, `church_fees`, `security`, `misc`) have no leaf by design.
  `officiants` **is** a live tile; `security` and `misc` genuinely have nowhere to go and need a
  ruling of their own — flagged, not assumed.

### ⚖ The two alternatives, and why they lose

**Option B — make the card's kind the tier-2 TILE (78 of them), not the leaf.**
Cheaper: the existing bridge already maps to tiles, and the stalled couple-side column is
tile-keyed, so it matches the precedent. But 78 tiles is still a wall, it still cannot say *Pabati*,
it still leaves the requirements pop-up broken (that lookup needs a leaf), and it leaves the three
misleading pills exactly as they are. **It buys consistency without buying the supplier anything.**

**Option C — keep two vocabularies and formalise the bridge.**
Costs nothing today and keeps every defect: the 51 unreachable leaves, the funeral home with no
pill, "Massage Chair" meaning seven trades, 36 of 52 kinds with no requirements, and a hardcoded
list that needs a deploy every time an admin adds a word. **The bill grows with every real supplier
who signs up.** It is the honest option only if the answer is "not now" — in which case the three
misleading pills (§ 2) should still be fixed, because they are a two-line label change.

---

## 6 · 🔴 THE OWNER DECISION

> **Should a service card's kind be the same word a shop already used in its coverage — its own leaf,
> like *Pabati* — replacing the older 52-word list on the card side only?**

**What is NOT being asked:** nothing about the couple's own supplier list (45 rows, untouched),
nothing about prices, nothing about the marketplace, no leaf is renamed or removed, and no shop
address changes. Coverage itself is unchanged.

**Why it is his and not an engineering tidy-up:** it changes the words a supplier sees when they say
what they sell, and it splits three of today's kinds into finer ones. It is also the last moment it
is free.

**A "yes" is worth one small ruling alongside it:** `security` and `misc` have no home in the
taxonomy. Do they get a leaf, or does a card simply have to name a real trade?

---

## 7 · Found on the way — not this decision, and not fixed here

Each is measured, none was touched (this session builds nothing). Worth filing.

1. **A funeral home has no card-kind pill.** `funeral_home` · `cremation` · `memorial_park` are in
   `VENDOR_CATEGORIES` and in **no** `SERVICE_GROUPS` group, so the picker never renders them.
   One-line fix; also survives Option C.
2. **Three pills name only one of the several things they store** — *Live Band* (band+DJ),
   *Bridal Car* (+shuttle, +transfers), *Massage Chair* (7 booth trades). Cause: the label helper
   prints `tiles[0]`. Label-only fix.
3. **A titleless card can print a raw database key to a couple** on the public shop page — the
   exact harm the 2026-08-09 *"never print a database key at a couple"* rule was written for,
   surviving in a different fallback in the same file. Both prod cards are in that state.
4. **`vendor_services.category` has no database-level validation** — plain `TEXT`, and
   `save_vendor_service` never checks it. The route is the entire fence.
5. **`event_vendors.category_key` is a gate with no handle** — added for PR-1 of a 4-step plan,
   FK'd, 0 of 45 rows populated, zero writers in the whole repo.
6. **The requirements pop-up can only ever find fields for 16 of 52 card kinds**, and fails soft, so
   the other 36 look like trades that simply have no questions.

---

## 7b · ✅ AN UNSTATED SIDE EFFECT OF #4942, FOUND BY THE FABLE PASS — and it is in the couple's favour

**THREE readers already compare a card's `category` against CANONICAL LEAF keys**, not against the
52 legacy ones — verified on `origin/main` = `795aa14ae` (which production self-reports serving):

| Reader | What it feeds | What its own comment records |
|---|---|---|
| `lib/wizard-recommendations.ts:638` | the service photo on a wizard recommendation tile | *"NO wizard recommendation tile ever showed a service photo"* — a phantom-column 42703 it has already been repaired from once |
| `lib/budget-allocation-data.ts:185` | the market median / min / p25 / p75 a couple sees | *"has been showing NO market median … for any leaf"* |
| `lib/plausibility-scanner.ts:165` | the price plausibility check | — |

⇒ **A card filed under the shop's own leaf now matches all three. A legacy-keyed card never
did, and still does not.** So #4942 quietly turned on photo enrichment, market pricing and the
plausibility check for exactly the cards the new door produces.

⚖ **This is a behaviour change nobody wrote down, and it is a good one** — but it is also the
answer to *"why does one card show a market price and another does not?"*, which is the kind of
question that otherwise gets diagnosed from scratch six months later. **Zero rows are affected
today** (both prod cards are the hidden fixture), so nothing changed for anybody yet.

---

## 8 · How to re-measure this, exactly

Nothing above should be believed because it is written down.

* Visible leaves: join `canonical_service_taxonomy` → live tier-2 tile → live tier-1 folder,
  dropping `marketplace_hidden`. Reproduces `getCoverageTaxonomy()`. Expect **262 · 73 · 16**.
* Card kinds: parse `VENDOR_CATEGORIES` + `VENDOR_CATEGORY_LABEL` from `apps/web/lib/vendors.ts`.
  Expect **52 and 52**.
* Bridge: parse `VENDOR_CATEGORY_CANONICAL` from `apps/web/lib/vendor-category-taxonomy.ts` —
  ⚠ **`guest_booth` is a multi-line entry a single-line regex silently drops**; a mapping that comes
  back with 51 of 52 keys has missed it, and 51 looks close enough to be believed.
* Verdicts: EXACT = leaf key ∈ card keys · FAMILY = a card kind claims the leaf's tile · NONE =
  neither. Expect **16 / 195 / 51**, and the appendix table must reproduce those counts row-for-row —
  it does, which is how the transcription was checked.
* Prod rows: `vendor_profiles` · `vendor_coverages` · `vendor_services` · `event_vendors`.
  Expect **2 · 2 · 2 · 45**, `category_key` NULL on all 45.
