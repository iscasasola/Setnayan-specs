# ⛔ OWNER OVERRIDE — GOLD is the action colour, not terracotta

> **Owner ruling, 2026-08-08, verbatim:** *"all at once. let's stick with Gold for now?"*
> then, when asked to confirm against the handoff's opposite rule:
> **"stick to gold to all first."**
>
> 🔴 **THIS OVERRIDES THE HANDOFF.** Every other document in this folder — the
> README's non-negotiables and all four Fable specs — states the opposite:
> *"Terracotta `#C24E25` is the ONLY action color… Gold is never a button."*
> **That line is now superseded. Read this file first.**

---

## The rule, as it now stands

| role | colour |
|---|---|
| **Primary action (filled)** | **deep gold `#8C6932`** (`terracotta-700` / `--sn-gold-700` `#8A6B39`), label cream `#FDFBF7` |
| **Secondary action (outlined)** | border gold `#A9834B`, text **deep gold `#8C6932`** |
| **Text ON a pale gold wash** (badges, pills) | **`--m-orange-deep` / `--sn-gold-800` `#5C4726`** |
| Eyebrows, bars, dots, coins — nothing sits ON them | gold `#A9834B` — unchanged, still correct |
| Text links in cards | slate-blue `#3B4E67` — unchanged |
| Page / card surface | cream `#FDFBF7` · ink `#2C2A29` — unchanged |

### ⚠ CORRECTED 2026-08-08 — the fill is ONE SHADE DEEPER than first written

This table first said *"primary action = gold `#A9834B`, label `#FFFDF8`"*. **That
pairing measures 3.37:1, against the 4.5:1 WCAG AA floor for normal text.** Pure
white on it is 3.48:1. Both fail; every filled gold button in the app was
unreadable, and nothing in the stack noticed.

🔑 **This is precisely what the palette lock meant by *"gold is UI-only"*.** Gold
works as an eyebrow, a bar, a dot, a border — anywhere nothing sits **on** it. The
owner's ruling is honoured in full: the action colour is still gold. It is simply
the shade of gold that can carry a word.

| pairing | ratio | |
|---|---|---|
| cream on gold-500 `#A9834B` | 3.37:1 | fails |
| white on gold-500 `#A9834B` | 3.48:1 | fails |
| **cream on gold-700 `#8C6932`** | **4.86:1** | passes |
| **`#5C4726` on the pale gold wash `#F3ECDF`** | **7.50:1** | passes |

🪤 **The near-fix was worse than the bug.** The first planned change was to swap
`text-white` for `text-cream` on the filled buttons, per the brand rule that labels
are cream and never pure white. That rule is real — and applying it here moves
contrast **3.48 → 3.37**. **The label was never the variable.** No label colour
rescues a fill that light; the fill is the only thing that can move.

Shipped in PR #4250 across 76 call sites, held by
`apps/web/scripts/lint-label-on-fill-contrast.mjs` (1,365 pairings, derived from the
live tokens, wired into CI). Do not re-specify `#A9834B` as a fill under a label.

Everything in the handoff that is **not** about the action colour still stands: the
card recipe, radii, Space Mono for money and eyebrows, day-first dates, 44×44 targets,
zero≠failed-to-load, no fake doors.

## What was reverted

The couple's event dashboard had six action pills converted to terracotta earlier the
same day (PR #4241), on the strength of the handoff's rule. **Those are back to gold.**
The page is unchanged from where it started on this axis.

## What was deliberately NOT done, and why it needs a decision

The app currently holds **both** colours on actions:

| | count |
|---|---|
| gold-filled action sites (`bg-terracotta`, which renders gold) | ~115 |
| **terracotta action sites (`bg-mulberry`)** | **783 occurrences across 238 files** |

"Gold to all" read literally means repainting those **783** terracotta buttons to gold
— a change to almost every screen in the product, in the opposite direction from the
design bundle. That is far larger than the 115 that prompted the question, and the
owner's *"for now"* reads as provisional.

**So it was not done.** The conservative action was taken instead: stop converting gold
→ terracotta, revert what had been converted, and record the rule. Repainting the 783
is a separate, explicit call.

🔴 **OPEN — OWNER:** should the 783 existing terracotta buttons also become gold, or do
they stay and gold simply stops being converted away?

## ⚠ The naming trap still applies, and now it bites the other way

`--color-terracotta` holds **GOLD** (`rgb(169,131,75)` = `#A9834B`).
`--color-mulberry` holds the **rust** `#C24E25`.

Under this ruling, `bg-terracotta` — the confusingly-named class — is now the
**correct** class for a button, and `bg-mulberry` is the one to avoid. The name was
misleading before and is misleading now, in the opposite direction. Do not rename it
casually: 690 files reference it.
