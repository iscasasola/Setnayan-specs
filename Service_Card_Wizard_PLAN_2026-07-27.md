# The Service Card Wizard — THE service card maker · 2026-07-27 · v2 FOUR STEPS

> Owner: *"make the wizard a 4 step wizard… incorporate everything that is there."*
> v2 supersedes the same-day 7-step draft. Shape chosen by a 3-design panel (vendor-flow ·
> card-mirror · fastest-publish lenses), each adversarially critiqued; all three converged on
> this grouping and every critique fix is folded in below. Grounded in `service-wizard.tsx`
> on `origin/main` — every SHIPS claim was read, not remembered.

## 0 · The rules that shape it

- **The couple meets ONE card, so the vendor meets ONE maker** (owner-locked). The wizard is it.
- **The wizard is ONE `<form>`.** Steps render simultaneously, hidden via the `hidden`
  attribute; everything posts together in one `commitVendorService` submit. A step is a VIEW —
  regrouping is cheap, data never moves.
- **The publish gate does not weaken:** cover photo + Setnayan Exclusive + the card-text
  integrity gate (no contact info; blanks auto-name; `@` teaches "at").
- **Navigation is linear** (Back / Continue; the progress pills are not clickable). The panel's
  fastest-publish lens died on this fact — "publish after step 2" is false under shipped nav.
  Do not claim step-skipping anywhere until nav itself changes.

## 1 · The four steps

Every existing field appears exactly once. Nothing is dropped — the panel's critic caught one
silently unmapped field (`coverage_id`) and it is placed explicitly.

### Step 1 · Your service — *"What am I selling, and what does it look like?"*
- category · listing title (optional)
- **cover photo** — REQUIRED to publish, watermarked, browser-downsized (#3793). **First on
  the step**, above everything optional, so the hardest gate item is cleared while the camera
  roll is already open.
- showcase photos (≤5) + one ≤30s clip — clearly badged optional, BELOW the cover. ⚠ Phone
  wall risk: uploads are the slow part; the required one leads, the optional ones trail.

### Step 2 · Your price — *"What does it cost, and what does delivering it take?"*
- pricing basis (fixed / per-head / per-hour) · starting price · pax brackets (fixed only)
- **coverage (calendar assignment)** — the field the 7-step draft silently dropped
- transport fee · crew size · lead-time + last-minute fields
- **discounts** — beside the price they modify (ruled earlier today)

### Step 3 · What couples get — *"What's inside the price, and why book it on Setnayan?"*
- **Setnayan Exclusive AT THE TOP** — the required field leads; the optional editor follows.
  (The panel's sharpest catch: my draft put it last, a required field buried under an optional
  wall — a vendor who skims discovers it only at the gate.) Copy ships today: *"One thing
  couples only get by booking you through Setnayan."* Chips: Free add-on · Priority date
  hold · Setnayan-only rate · Complimentary upgrade.
- **★ Customization** — Included in the price (absorbs the old inclusions editor; storage
  stays in `vendor_service_inclusions`, 8 downstream readers) · Choices (amount-only `+₱`
  options; 0/blank renders "included") · pick-N · Quantities (`max_extra_hours`) · follow-up
  branching (`parent_option_id`; never default-included/required — DB-enforced).
  Groups default COLLAPSED on phone.

### Step 4 · Check & publish — *"Is this card ready to meet a couple?"*
- **Comes with** — a conditional BLOCK, not a conditional step: renders only for
  multi-category vendors, exactly as the section already prunes. **The step count is a
  constant 4 for every vendor.** (Unanimously the panel's best-rated move.) Its redundant
  "Comes with: N" recap row is dropped — the picker is right there.
- card health (deterministic advisory) · recap rows
- publish gate `hasPhoto && hasPerk` — **with real jump-back links** to step 1 / step 3.
  ⚠ Those links do not exist today (the gate warning is plain text); they are part of this
  build, not an assumed mitigation. ⚠ The gate copy names step numbers — renumbering must
  update it; today's copy being right is luck, not a checked property.

## 2 · Cross-cutting facts the panel corrected

1. **The live preview is GLOBAL chrome, not a step child.** `ServiceCardLivePreview` sits
   OUTSIDE every `show()` section in the shipped file. Mounting it "in step 1" would hide it
   on steps 2–4 via the `hidden` attribute. It stays above the steps, always visible — the
   card lights up region by region as the vendor advances.
2. **This is not a zero-work reshuffle.** Steps 1/2/4 are regrouping; step 3 is the
   Customization editor build (in flight) plus folding the inclusions editor in as its
   "Included in the price" group. Honest scope: one new step component + view membership.
3. **Step 3 is the heaviest screen.** Mitigations that are build items, not hopes: Exclusive
   on top · groups collapsed by default · card health visible on every step so problems
   surface before step 4.

## 3 · Where the owner's two named things live

- **Photo upload** → step 1 (cover, required) + step 1 (gallery + clip, optional). SHIPS.
- **Setnayan Exclusive** ("what they can offer on top of the market") → step 3, top. SHIPS —
  field, copy, chips and publish-gate enforcement all exist today; only its position moves.

## 4 · Build order (unchanged, remapped to steps)

1. ★ Customization editor component — **BUILDING** (mounts into step 3; mount point is a
   one-line decision, so the running build is unaffected by the regroup).
2. Couple-side choice/follow-up render + visibility pricing — **BUILDING**; must ship together.
3. The 4-step regroup itself: steps array, section membership, Exclusive to step 3 top,
   comes-with block into step 4, gate jump-back links, gate copy renumbering.
4. ⑂ split (inclusion → lines) · 5. drag-and-drop · 6. card health · 7. §6.7 special requests.

## 5 · Open, owner's call

- Guided-flow faith chips (adjacent, not this wizard): born-again still folds under Christian.
- "Viber only" on a card passes the text gate — accepted trade, reversible.
