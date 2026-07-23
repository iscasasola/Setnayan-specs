# Chibi customization — placement audit verdict

**Date:** 2026-07-21 · **Status:** APPLIED to `avatar_maker_one_chibi_2026-07-21.html` (41 edits)
**Trigger:** owner, on seeing the flower sunk into the hair — *"please use council or properly navigate the different customization."*
**Method:** grounding pass extracts the geometry contract → 6 parallel auditors (accessories · hair · facial hair · brows · face · outfits) compute每 option's actual landing against it → synthesis judge dedupes, collapses to root causes, and rejects false positives. Run `wf_268f71d6-30e`, 8 agents, 0 errors.
**Result:** 8 systemic + 8 individual fixes repairing **55 option-instances**; 6 findings correctly rejected.

---

## 0 · The meta root cause

> **Nearly every defect traces to one thing: parts were authored against a SPHERE, but the head is an ELLIPSOID.**

`head.scale.set(1, 0.93, 0.97)` is applied to the head **mesh**; hair, face parts and accessories are added to the head **group**, so they never inherit it. Anything positioned at a constant radius or a constant `z` therefore lands at the wrong depth — floating at the poles, buried at the sides.

**This is the same root cause as both bugs the owner caught by eye** (the bald occiput, and the nape that read as a beard). Fixing it structurally is worth more than any individual coordinate.

**The rule:** for a part at `(x, y)` in R units, the skin is at `z = 0.97·√(1 − x² − (y/0.93)²)`. Seat the part at that surface **plus its own outward half-extent, minus ~0.02 R** so it reads as relief rather than a floating sticker.

---

## 1 · Systemic fixes

| # | Fix | Repairs |
|---|---|---|
| **S1** | **Clamp `cap()` rather than hand-tune 11 call sites.** Two invariants: `crown ≤ 0.42` + `lift ≥ 0.03` puts the front rim at 0.331 R (above the tallest brow, arched top 0.2963 R); `nape ≥ 0.70` puts the back hairline at −0.513 R (past the occiput, short of the 0.75 beard threshold). | 13 |
| **S2** | **Seat face parts on the ellipsoid.** 8 options were rendering *inside the head* — the moustache was 100% buried (`z 0.919` vs surface `0.9605`), which is why "moustache", "Van Dyke" and "full beard" all looked moustache-less. | 9 |
| **S3** | **Align flat plates to the surface normal.** Half-torus arcs and brow boxes sat in constant-`z` planes on a curved skull, so one end lifted and the other sank. `smile`/`grin` had their plane tilted **up** while the skull normal tilts **down** ~13° — a 24.5° mismatch burying both corners. | 7 |
| **S4** | **Accessories seat at HAIR radius, not scalp radius** — the reported bug. The flower sat at 1.06 R with hair now at 1.05 R scaled, so half of every petal was inside the cap. | 2 |
| **S5** | **Facial-hair shells open below the mouth and close over the chin.** | 3 |
| **S6** | **Collar plane 0.74 → 0.77 on all 16 garments**, plus re-seating the 3 collar rings the raised plane re-buried. | 15 |
| **S7** | Shirt-V cones dropped out of the neck cone into the flat chest band. | 4 |
| **S8** | **`legLevel` must OVERLAP the hem, not meet it** (dress 0.07 → 0.12, cocktail 0.1 → 0.2). | 2 |

## 2 · Individual fixes

`acc: band` was a **vertical** hoop (`TorusGeometry` lies in XY; `rotation.x = 0.42` left it nearly upright) · `hair: long` still had a bald occiput band · `acc: cap` dome smaller than the hair beneath it · `hair: spiky` cones ~82% swallowed by the crown · `hair: bangs` fringe clipping the eyes · barong placket, wedding-gown belt and filipiniana waistband each floating or z-fighting.

## 3 · What the judge REJECTED — and why it matters

Six findings were thrown out, and two of the rejections are instructive:

- **Stale-number cascade.** Two auditors proposed collar-ring radii that were correct *only against the old 0.74 plane*. After S6 raises it, the garment widens at collar height and both proposals are re-buried. **The judge caught that one fix invalidates another's arithmetic** — and noticed S6 newly breaks the POLO collar, which no auditor had flagged.
- **Duplicate with conflicting numbers** — `hair: curly` was filed twice with different corrections; S1's clamp subsumes both.

**This is the argument for the council over one-at-a-time fixing:** the interaction between fixes was the thing most likely to be got wrong by hand.

---

## 4 · Carry into PR-1

These are prototype coordinates, but the **rules** are what `kit/chibi-figure.tsx` must inherit:

1. **Seat on the ellipsoid, not the sphere** — or make the geometry integral so the question disappears (§11 of the rig spec: body + arms + legs as one authored form).
2. **Invariants in the builder, not at the call sites** — S1's clamp is the pattern. Eleven hand-tuned triples drift; one clamp cannot.
3. **Accessories clear the HAIR surface**, which moves whenever a cap spread changes — so express it as a derived radius, never a literal.
4. **Flat plates take the surface normal**, never a constant plane.
5. The **no-exposed-cap law** (rig spec §11.2) is the merge gate that keeps all of this from regressing.

## 5 · ✅ Both prototypes fixed (2026-07-21)

`chibi_studio_prototype.html` shared the defective builders, so the corrected **`buildFace` · `buildHair` · `buildAcc` · `buildOnepiece` · `buildTop`** were ported into it verbatim (`buildBottom` was already identical). Its showroom UI — two hero pedestals plus the tap-to-apply shelves — is untouched; only the geometry changed. Both files syntax-checked after the port.

**The two prototypes now differ ONLY in interaction model:**

| | `chibi_studio_prototype.html` | `avatar_maker_one_chibi_2026-07-21.html` |
|---|---|---|
| Model | **Showroom** — 2 hero figures + shelves of variants you tap | **Creator** — ONE chibi transformed in place |
| Matches owner directive? | ✗ (the pattern rejected 2026-07-21) | **✓** |
| Facial hair + brows | ✗ | **✓** |
| Geometry | fixed | fixed |

⚠ **OPEN — which is the reference build?** Spec §10 still names the studio. The maker matches the owner's stated UX and carries facial hair; the studio carries the richer parts shelf. **PR-1 should build against the maker for interaction and the shared builders for geometry** — but the spec pointer needs updating either way, or PR-4 will implement a showroom.
