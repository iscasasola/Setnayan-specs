# WHAT'S NEXT — MANAGING PRICES · 2026-08-26

> Owner: *"There are a lot here that is already retired and we want to improve how to manage the
> prices here."* Then, on the Papic ladder: *"this is our actual pricing. so i am lost where the
> other papic prices aside from thank you video is coming from"* → **"Apply my sheet exactly"** →
> *"our papic service is already a 6 month total papic service"* → *"can you also instruct our
> papic discussion to adjust the prices accordingly?"*

**Every number in this file was read out of the live production database
(`njrupjnvkjkitfctetvi`) on 2026-08-26, not estimated and not copied from a doc.**

⚠ **ANOTHER SESSION WAS EDITING THE SAME PAPIC SPECS DURING THIS WORK.** The corpus moved from a
17-rung ladder to 16 rungs mid-build, which is where the owner's *"remove the 40,000"* ruling
arrived. Re-read `CLAUDE.md` § "Papic — ONE product" and the tail of `DECISION_LOG.md` before
acting on anything here.

---

## 0 · WHAT SHIPPED (do NOT rebuild)

| | |
|---|---|
| **PR [#4883](https://github.com/iscasasola/setnayan-platform/pull/4883)** | The 16-rung Papic ladder — migration `20271170435163` + 10 activation hooks + guard rewrite. Auto-merge armed. **Supersedes #4882 (CLOSED), which had the identical final tree** — gitleaks scans EVERY COMMIT in a PR, not the final tree, so correcting the file in a later commit left the scan red. Rebuilt as one clean commit off current `main` rather than rewriting history (`reset --soft` to squash is forbidden here — see [[feedback_never_soft_reset_onto_origin_main]]). |
| **Prototype** | [`prototypes/admin_pricing_manager_2026-08-26.html`](prototypes/admin_pricing_manager_2026-08-26.html) — clickable, two panes (what ships now vs. the recommendation), real production data. **Design is done. The build is not.** |

⚠ **Verify the PR state with `gh pr view 4883 --json state,mergedAt` before trusting the row above.**
This register has been wrong about a PR's state five times.

---

## 1 · THE SHAPE OF THE PROBLEM (measured)

`/admin/pricing?tab=pricing` is **ONE form with ONE "Save all changes" button** holding:

| | On sale | Retired |
|---|---:|---:|
| Customer SKUs | 13 | 45 |
| Bundles | 2 | 2 |
| Vendor plans + add-ons | 19 | 10 |
| **Total in one form** | **34** | **57** |

Plus a **43-row legacy catalogue** that exists only as a download button — not viewable, not
editable. **No search, no filter, no sort.** Order is fixed: active-first, then price-ascending.
Two of the four tabs are empty in prod (free windows 0 rows · price bands 0 rows).

---

## 2 · 🔴 THE LIVE DEFECT — FIX THIS FIRST

**Every "Save all changes" blanks the description of every row whose ⓘ panel was closed.**

The editor returns `null` when its toggle is shut, so the textarea is **not in the DOM**, no
`retail.desc.<code>` key reaches the POST body, `saveAllPricing` reads `''`, computes
`descVal = desc === '' ? null : desc` → `null`, and the diff sees a row *with* a description as
CHANGED and writes NULL over it.

**Measured, not suspected:** `admin_audit_log` (which stores full `before`/`after` JSON) holds 34
bulk-edit rows. **32 wiped a description. 0 preserved one.** All in one save on 2026-07-01. Prod now
holds **32 of 58** customer rows with no description at all.

🔑 **The fix is by SHAPE, not patch:** a per-row card that submits only itself, with every field it
owns rendered while open, makes this structurally impossible. That is the main argument for killing
the single Save-all button. A conditional field inside a bulk form is a field the save will blank.

---

## 3 · 🔴 SEVEN PRICE FIELDS NEED AN ENGINEER

`saveAllPricing`'s key regex admits only `title|desc|cost|price|active`. Not editable anywhere:

- **`onboarding_price_php`** — a **LIVE, CHARGED ₱1,499 Setnayan AI sign-up price** (4 rows carry one)
- **`billing_period`** — one-off / per-day / per-year / per-28d (7 rows are recurring)
- **`pax_floor`, `pax_floor_price_php`, `pax_increment_size`, `pax_increment_price_php`, `is_pax_priced`** (0 rows use them today)

Only a migration can change them — on the screen whose own docblock calls itself *"the single source
of truth for app prices."*

---

## 4 · ✅ PRICE HISTORY ALREADY EXISTS — DO NOT BUILD A TABLE

`admin_audit_log` stores the full `before`/`after` of every changed row (34 rows). The screen shows
only *"edited 2 months ago by X"*. **Surface what is stored.** ⚠ Migration-authored price changes
bypass it, so the history is partial — say so on screen rather than implying completeness.

---

## 5 · 🧹 THE RETIRED PILE, AND THE RULE THAT CHANGES IT

Of the **45 retired customer rows**: **13** wire Papic tier config (CASCADE) · **9** sit in a live
bundle (CASCADE) · **1** has a live activation (NO ACTION, blocks delete) · **0** were ever sold.
⇒ 22 "wired", 23 free. The 2 retired bundles + 10 retired vendor rows were **not** checked.

🛑 **BUT "POINTED AT" IS NOT "LOAD-BEARING", AND THE PAPIC 13 PROVE IT.** Those 13 are *exactly* the
rows still titled **"Papic Pool" / "Papic One" / "Papic Mini" / "Papic Ltd" / "Papic Max"** — the
two-product model retired 2026-08-11. The old names survive because the old wiring does, and the
wiring is inert:

- `PAPIC_CAMERA_MINI_DAY`, which `CLAUDE.md` called *"still load-bearing … deactivate, never drop"*,
  is read by `papic_grant_camera_points()` as `WHERE service_code='PAPIC_CAMERA_MINI_DAY' AND
  t.is_active`. **That row is `is_active=false`**, so the lookup already misses and
  `COALESCE(v_per, 50)` supplies a hardcoded 50 — **and the stored value is also 50.**
- **0** seats carry it as `sku_code` (prod: `PAPIC_CAMERA_FREE` ×9 · `PAPIC_CAMERA_ONE_FREE` ×4).
- **0** seats are `tier='mini'`; **0** rows in `papic_one_orders`.

🔑 **THE RULE: a removability check must ask "has this DONE anything", not only "does anything point
at it".** An FK is a pointer, not a job. Measuring pointers alone reported 22 untouchable rows when
most of that pile is dead wiring holding up dead names.
⚠ Still verify per-row before sweeping: an inert pointer can be woken by a code change, and
`CREATE OR REPLACE` on that same function has silently reverted a guard before.
⚠ **`orders.service_key` has NO foreign key to the catalogue** — loose text. Deleting a sold SKU is
not blocked and would orphan the receipt. **Anything ever sold may be retired, never removed.**

✅ **Customers never see the old names** — verified by fetching the LIVE `/papic` and `/pricing`:
neither phrase appears. On sale is one product, "Papic". The ~48 remaining code hits are comments,
JSX comments and test fixtures.

---

## 6 · 📐 THE DESIGN — approved shape, unbuilt

**"The sell sheet, and the back room."** The screen opens on the 34 things a person can buy today.
Everything retired moves to a back room that **measures itself toward empty**: every retired price
either names what is still holding it in place, or offers to be gone for good.
**Gone is the DESTINATION of every retired row, and the screen shows each row's distance from it** —
which honours the owner's 2026-07-31 *"retired is retired… I want retired gone and deleted"* without
breaking the rows that are still doing a job.

**Build units, in order:**

1. **Per-row save; delete "Save all changes."** Closes § 2 structurally. Give-up: re-pricing a whole
   ladder becomes N saves. Accepted — nobody re-prices 91 rows at once.
2. **Three states instead of one tick** — Draft (nowhere public) · On sale · Retired. Retiring stamps
   date + person and asks two optional questions: *why* and *replaced by*. That deletes the word
   "(superseded)" typed into a product's own title.
3. **"Safe to remove" is MEASURED, never chosen** — and per § 5 it must measure *use*, not just
   pointers. Zero pointers + zero use + never sold ⇒ **Remove for good** appears on its own.
   `Remove all N` lists every name before the hand agrees.
4. **Every price field out of the code** (§ 3), labelled in words: "Charged: once / per day / per year".
5. **Draw the history** (§ 4).
6. **Margin only when a cost is real.** Blank cost = silence; entered ₱0 = a claim. Only claims get a
   margin. Delete the "Avg margin" tile — 5 of 13 live rows have cost ₱0, so it averages fiction.
   Delete "Max price" and "Min price" — they answer no question anybody has.
7. **Search + scope chips**, and one list under three shelf headers rather than three tabs (34 rows is
   about one screen; tabs would re-hide things the way retired rows bury live ones today).
8. **The legacy 43 become readable**, deliberately **read-only** — an editable dead catalogue is a
   second price authority waiting to disagree with the first.

**Deliberately NOT built:** bulk/spreadsheet editing (that shape is where § 2 came from) ·
approvals/scheduling (one-person admin, no counterparty) · a margin dashboard · a trash can for
removals · auto-sweeping the inert rows as part of shipping — **the screen hands him the broom; the
sweep is his act, on his day.**

---

## 7 · ⏭ OPEN, NEEDS THE OWNER

1. **Does the ladder recut need to reach the public price page copy?** The rungs are catalog-driven,
   so `/pricing` follows automatically — but the *narrative* ("Papic starts free… then top up") was
   written for a 4-rung ladder and now describes 16.
2. **`Pricing.md`'s Papic section is superseded lineage** pointing at `0012_papic/Papic_Pricing_Lock_2026-07-20.md`,
   which predates every ladder since. Whether to prune it or leave it as history is his call — the
   2026-07-31 precedent says prune.
3. **Whether `galleries/`-style "retired" bundles and vendor rows get the same wiring check** (§ 5's
   12 unchecked rows).

---

## 8 · 🪤 TRAPS PAID FOR IN THIS SESSION

- **A DECISION LOG IS NOT EVIDENCE THAT CODE EXISTS.** The 2026-08-26 ladder row said *"Built as
  given"* and nothing was built — no migration, no branch, no PR. Grep for the object.
- **A REAL NEGATIVE FIXTURE ROTTED INTO A LIVE PRODUCT.** `papic-guest-buy.test.ts` used
  `PAPIC_GUEST_50K` as its example of an *unknown* code. Once that became a real rung the test would
  have stayed **green while asserting a live product is unknown.** A negative fixture borrowed from
  the real namespace rots the day the namespace grows into it.
- **A RUNG IS THREE PLACES** — catalog row, tier row, and a line in `sku-activation.ts`, whose
  dispatcher ends `if (!hook) return;`. Two of three ships a rung that takes the money and grants
  zero shots, silently.
- **Gitleaks reads a single-line `IN ('A','B','C','D')` of SKU codes as four leaked API keys.** Split
  one per line rather than adding a `.gitleaksignore` entry — **a baseline is a bill, not a decision.**
- **A one-spelling sweep is not a survey.** My first "is the old name gone?" grep counted 48
  "rendered" hits that were all comment continuations, JSX comments and test fixtures. The live site
  settled it in one fetch.
- **The corpus can move under you mid-build.** 17 rungs → 16 during this session.
