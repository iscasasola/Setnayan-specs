# Vendor Package Authoring + Couple Customization — RECOMMENDATION (2026-07-26)

> 4 competing designs + 3 judges (vendor-adoption / couple-value / build-risk) + synthesis. Spine = fastest-authoring, with organs grafted from the other three.

# THE RECOMMENDATION — Vendor package authoring + couple customization

**Verified against** `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform-wt-first5` @ `5610d218a`. Every codebase claim below is cited. Where I could not verify something I say so.

---

## 0 · The spine, and why

**Spine = `fastest-authoring`.** It is the only proposal ranked top-3 by all three judges (adoption 1st, build-risk 2nd, couple-value 3rd; aggregate rank 6 vs 7/8/9). More importantly it is the only one whose *failure mode is still a shippable product*: when the vendor gets confused and stops, they have a valid, publishable package, because the defaults are the product.

I am **not** averaging in the other three. I am taking four specific organs:

| From | Organ grafted | Why it survives |
|---|---|---|
| `reuse-maximalist` | **"Save as a package"** — the inverse of `loadPackageLinesForQuote` (`apps/web/app/vendor-dashboard/messages/[threadId]/proposal-actions.ts:93`) | Two judges named it the single best idea in the set. It is the only cold-start door that works at 0 services. |
| `deepest-bespoke` | **The `considering` state as a persisted pre-commitment configuration**, the **one-number** discipline, the **non-live guest-count control**, and **catalogue-pointer lines** | Converts a checkout modal into "the place where you customize" — which is the positioning claim, literally. |
| `ai-assisted` | **The terminal handshake**: configuration → chat card → vendor one-tap Confirm → `sendCustomProposalCore` (`apps/web/lib/proposal-send.ts:392`) | Turns an unenforceable credit promise into a signed artifact. Fixes deepest-bespoke's own worst risk. |
| build-risk judge | **The money-column trigger guard** and **the one-lock-one-booking-fee rule** | Both traps re-verified below. Both are real. |

**Rejected outright:** ai-assisted's rename to "Bundles" (the schema, nine readers and `vendor_proposal_templates.default_package_id` all say *package* — a vocabulary fork with no upside); reuse-maximalist's `'expires'` **default** on the credit policy (use-it-or-lose-it pointed at a couple's biggest purchase); deepest-bespoke's new `vendor_package_line_options` table (unnecessary — see §5).

---

## 1 · The recommendation in plain business English

**What a vendor does.** They open My Shop → *Packages*. They never see a blank form. They pick one of four doors: *(a)* start from a ready-made package written for their category, *(b)* **turn a quote they already sent into a package with one tap**, *(c)* tick their existing service cards and we turn them into lines, or *(d)* start blank. Then every line answers exactly one question in plain words — **Always included · Can swap out · They pick one**. Only the swappable lines ever ask "what's this worth?" A caterer with six always-included lines and one swappable one types **two numbers total**: the swap value and the package price. Then one question — *"If they skip something, does the value come off their bill, or does it become credit to spend on anything else you sell?"* — and Publish.

**What a couple does.** They tap **"Make it yours."** That creates a saved configuration they can sleep on, show their mother, and come back to — it is not a booking and it costs nothing. Inside, the package price never moves. Everything they do — dropping a line, picking a cheaper main course, upgrading to the full band, buying a drone shoot — moves **one number and only one number: their credit with that vendor**. Locked lines have no checkbox at all: the couple can see the value is real without being able to raid it. When they're happy they send it to the vendor, who taps **Confirm once**, and that mints a real, itemized quote through the machinery we already ship.

**Why it beats the market.** Every competitor sells packages as a JPEG or a fixed tier — take it or negotiate over Viber. HoneyBook and Dubsado let a vendor mark a block "select one," but the vendor has to *author* every combination and the customer's only lever is a discount. We do three things none of them do at once: (1) **the price stays fixed and the couple's leftover value becomes spending power, not a discount** — so flexibility costs the vendor nothing in margin; (2) **that spending power works across the vendor's whole catalogue**, so a vendor with twenty service cards gives every couple an enormous configuration space by doing zero extra work; (3) **required and choice are separate ideas** — "you must have a main course" and "you may pick a different one" are two different sentences, and we're the only ones who say both.

---

## 2 · The vendor authoring design

### 2a · Where it lives — and one correction all four proposals got wrong

`/vendor-dashboard/services` **is a redirect stub, not a destination** — `apps/web/app/vendor-dashboard/services/page.tsx:5-11` documents it as *"RETIRED as a standalone destination (owner 2026-07-02: 'My Services' fully folded into My Shop)."* The manager renders inside `ServicesDisclosure` on My Shop (`apps/web/app/vendor-dashboard/shop/_components/services-disclosure.tsx:8-11`).

So the surface is **a fourth entry in the `ManagerTabs` array mounted at `apps/web/app/vendor-dashboard/services/_components/services-manager.tsx:480`**, which renders on `/vendor-dashboard/shop`. `manager-tabs.tsx:12-18` takes `tabs: { label, panel }[]` generically and `:59-60` keeps hidden panels mounted (`hidden={i !== active}`) so form state and `#svc-…` deep links survive — exactly what a long repeater needs. **Zero edits to `manager-tabs.tsx`.**

One real cost: `manager-tabs.tsx:41` renders each tab `flex-1`. Four tabs at 375px is ~86px each. `'Service cards'` (`services-manager.tsx:496`) must shorten to `'Services'`. One-word edit.

### 2b · Screen 1 — four doors, never a blank form

```
[ Coverage ] [ Services ] [ Packages ] [ Tools ]
─────────────────────────────────────────────────
 YOUR PACKAGES — none yet.
 A package is one price that covers several things.

 ⚡ Turn a quote into a package          ← 3 quotes you've sent
    Pick one you already sent and won.
 📋 Start from a Catering package        ← their own category
    8 lines already written. Change anything.
 ✓  Build from my service cards          ← greyed at 0 services
 ·  Start blank
```

**Door 1 is the cold-start answer and it ships before the wizard.** `loadPackageLinesForQuote` (`proposal-actions.ts:93-175`) already converts a package into Proposal Maker lines, carrying `pricing_basis / per_pax_price_centavos / min_pax / hour_base_centavos / min_hours / extra_hour_centavos / crew_* / transport_*`. Its inverse — read the vendor's own `vendor_proposals.line_items`, write `vendor_package_items` — is roughly 80 lines and needs no new grammar. A vendor's first package becomes a deal they already closed.

Door 2's starter packs are the ~28-category content track (see §8). Door 3 pulls lines by pointer, not by typing.

### 2c · Screen 2 — the lines

```
┌ Buffet for 100 guests ─────────────────────┐
│ [Always] [ Swap ] [Pick one]               │
│  ▲ no peso field at all                    │
├ Main course ───────────────────────────────┤
│ [Always] [ Swap ] [PICK ONE]               │
│   ◉ Chicken teriyaki            included   │
│   ○ Beef caldereta              + ₱8,000   │
│   ○ Lechon belly                +₱15,000   │
│   + Add an option                          │
│   ☑ They must pick one                     │
├ Photobooth · 3 hours ──────────────────────┤
│ [Always] [ SWAP ] [Pick one]               │
│   Worth ₱12,000                            │
│   If they skip it, ₱12,000 becomes credit. │
└────────────────────────────────────────────┘
  Mobile bar · 4 hrs                Always ▾
  + Add a line   ( ⌄ pull from my services ) │
```

Four load-bearing decisions:

1. **A required line has no value field.** This is the strongest idea in the whole set and it is free. Owner rule 7 ("a required line's value must NEVER appear as available credit") stops being a validation you must remember in three places and becomes a shape the data cannot take. `replacement_value_centavos` is never collected for `is_required = TRUE` rows. There is no number to leak.

2. **Progressive disclosure by state.** Collapsed `Always ▾` = one word. Only `Swap` reveals a peso field; only `Pick one` reveals the option sub-list.

3. **Three segments + one checkbox, DB fully orthogonal.** The four real combinations of required × choice all exist in the data (`is_required` and `choice_group` are independent columns). The UI surfaces three directly and reaches the fourth — *a choice the couple may also skip entirely* — via `☑ They must pick one`, which only appears inside a Pick-one block and defaults checked. **I side with fastest-authoring over deepest-bespoke here:** two radio pairs per line is sixteen decisions on an eight-line package typed on a phone. Adoption beats expressiveness on the authoring side, because a grammar the vendor won't fill produces an empty product.

4. **Lines can be pulled, not typed.** `+ Add a line → pull from my services` copies label, value and pricing basis from a `vendor_services` row and stores the pointer. Greyed at 0 services; lights up as the catalogue fills.

**Mechanically this is the shipped repeater grammar, unchanged.** `service-list-editors.tsx:13-22` is the contract: *"index-aligned HIDDEN inputs the server action reads via `formData.getAll(…)`… replace-all (DELETE by service+profile, INSERT)… fully-blank rows are ignored server-side."* Rows carry a stable `key` from a `nextKey` ref (`:80-83`, mirrored at `addons-editor.tsx:25-27`). `RowRemove` (`:46`) and `AddRowButton` (`:60`) import directly. The `<details>` + count-pill shell is `:88-113`. Per-line pricing basis mounts the existing `pricing-basis-editor.tsx`.

**Form mode: sibling `<form>`, never nested.** `services-manager.tsx:947-953` documents the exact bug nesting caused. Non-negotiable.

### 2d · Screen 3 — price, credit rule, publish

```
Package name  [ Grand Ballroom Wedding      ]
One price     ₱ [ 250,000 ]

If they skip something…
 ⦿ It becomes credit to spend on anything else you sell
   Price stays ₱250,000.
 ○ The value comes off their bill

[ live couple-card preview ]
[ Save as draft ] [ Publish ]
```

**This radio needs no migration.** `vendor_packages.is_consumable_flexible` already encodes exactly these two states — `apps/web/lib/vendor-packages.ts:252-259`: TRUE = *"removing items grows the consumable pool… total_locked stays at the package's total_price"*; FALSE = *"removing items reduces total_locked dollar-for-dollar."* Owner constraint 5's two options **are** that boolean. All four proposals added a policy column; none of them needed to. We expose the shipped boolean as plain English and stop there.

**Default:** `credit` when the vendor has ≥3 other sellable things, otherwise `off_price`. Rationale: credit is the flagship, but a credit pool with an empty catalogue is a broken promise the couple discovers at the worst moment (deepest-bespoke's gate, fastest-authoring's fallback). **Reject reuse-maximalist's `'expires'` default** — expiry-by-default is a use-it-or-lose-it mechanic aimed at the biggest purchase of someone's life, and defaults are policy.

**Live preview** clones `service-card-live-preview.tsx` — it *"renders no inputs of its own, so it adds nothing to the submitted payload"* (`:16-18`), finds `closest('form')` (`:163`), snapshots `new FormData` on every input event, plus `setInterval(read, 800)` (`:177`) *"because the bracket/inclusion/discount editors write React-controlled HIDDEN inputs whose updates fire no native DOM events."* Our segmented controls are exactly those hidden inputs. **The 800ms fallback is load-bearing, not optional.**

---

## 3 · The couple customization design

### 3a · The entry point changes — "lock" stops being the door

Today: browse → `LockPackageModal` → `lockPackage` → cascade into `event_vendors`. One irreversible tap from a bullet list (`apps/web/app/_components/vendor-packages/lock-modal.tsx:56-92`).

`event_vendor_packages.status` already permits `'considering'` (migration `20260604110000:243-244`) and **nothing currently enters that state.** Use it:

```
card → [ Make it yours ]      → considering row → the configurator (persists)
     → [ Lock it in as-is ]   → today's cascade, one tap, untouched
```

The configurator is the **existing** route `/dashboard/[eventId]/vendors/packages/[bookingId]`, taught to render `considering`. No new page.

**I checked the build-risk judge's objection that a live `considering` row poisons downstream readers, and it does not hold.** `apps/web/lib/budget.ts:293-297` already filters explicitly — *"Only 'locked' bookings drive vendor-controlled items. A 'considering' booking is still a draft from the host's side."* And `budget.ts:269-275` only looks up bookings via `event_vendors.event_vendor_package_id`, which the cascade populates **at lock only** (`packages/actions.ts:169-191`). A `considering` row is invisible to budget attribution by construction. Siding with couple-value here.

### 3b · The four line states, and the one number

```
ALWAYS INCLUDED                     ← no checkboxes. These are the deal.
 ✓ Buffet · Mobile bar · Cake · Lights

YOUR CHOICES                        ← required × choice
 Main course
  ◉ Chicken teriyaki      included
  ○ Beef caldereta        + ₱8,000
  ○ Lechon belly          +₱15,000

SWAP OUT FOR CREDIT                 ← optional × fixed
  ☑ Photobooth · 3 hrs
  ☐ Bridal car        ↩ ₱8,000 credit

OPTIONAL CHOICES                    ← optional × choice
  Entertainment  ○ Quartet ○ Duo ○ Band ○ Skip it, ₱25,000 credit
──────────────────────────────────────────
 Your price  ₱250,000   ← never moves
 To spend    ₱ 8,000    ← the ONLY number that moves
              [ Spend it → ]
```

All four owner line states render as distinct, legible zones. **One number, always visible, never joined by a second** — dropping a line, downgrading, upgrading, and buying elsewhere all resolve into the credit figure. That is the answer to "when does this become tax software": tax software is many numbers that interact; a bride can hold one number in her head while arguing with her mother on the phone.

**Credit is phrased "to spend," never "off"** (unless the vendor chose off-the-price, in which case the price line moves and the credit line does not exist).

### 3c · The spend step — where the positioning claim lives

```
Spend your ₱8,000 — anything Sofitel Manila does
 [ Extra hour of coverage  ₱5,000  + Add ]
 [ Premium bar upgrade    ₱12,000  + Add ]
 [ Drone coverage          ₱9,500  + Add ]
Credit left ₱3,000        Total ₱250,000
```

This is a **filtered read** of `vendor_services` ∪ `vendor_service_addons` for that `vendor_profile_id`. Zero additional authoring. It is why the credit pool is cheap here and expensive anywhere else.

**Overspend (constraint 6) reads as arithmetic, never as an error:**

```
Credit used   ₱8,000  ✓
Extra         ₱4,000
Total       ₱254,000     Paid the usual way when you settle.
```

Never a negative number, never a "you've exceeded" toast.

### 3d · Guest count — deliberately not a live slider

`lib/package-line-pricing.ts` already resolves `per_pax` / `per_hour` (`:79`) and is explicitly dark — `:16-19`: *"⚠ This module ONLY resolves a line's price. It does NOT touch the existing flat call sites… rewiring those is a LATER PR."* This is that PR.

But dragging 200 → 250 and watching ₱250,000 become ₱310,000 in real time produces dread, not control. Make it committed and report the delta: `Priced for 200. [change ▾] → 250 guests → +₱60,000, 3 lines re-price [use 250]`.

### 3e · Family, and the terminal handshake

Co-hosts already see a `considering` row — `event_moderators` + the `/host/accept/[token]` invite flow are shipped, and RLS scopes the row to the event. **Show who changed what; never let them vote.** An activity line ("Tita Menchie swapped the quartet for the full band") informs; a per-line vote turns a wedding into a committee, and committees do not book.

**Submit does not book.** `[ Send this to Sofitel ]` posts a card into the chat thread. The vendor taps **Confirm once**, which mints a real itemized quote through `sendCustomProposalCore` (`lib/proposal-send.ts:392`) — where *"the total is recomputed from the lines"* (`:388-390`) and the schedule is *"RE-RESOLVE[d] server-side from the drafts so the persisted, self-balancing numbers come from the pure resolver, not the client"* (`:406-409`).

This is the fix for the deepest risk on the board: **Setnayan takes 0% and vendors settle off-platform, so a displayed credit is a promise we render but cannot enforce.** Terminating every configuration in a vendor-signed proposal makes the credit a real artifact instead of a rendering.

---

## 4 · Reused vs new — file by file

### Reused with **zero edits**
| File:line | What it gives |
|---|---|
| `services/_components/manager-tabs.tsx:12-18` | Generic `tabs[]`; a 4th entry is an array push |
| `service-list-editors.tsx:46` `RowRemove`, `:60` `AddRowButton`, `:88-113` `<details>`+count-pill, `:13-22` the getAll contract | The entire repeater grammar |
| `services/_components/pricing-basis-editor.tsx` | Per-line fixed / per-pax / per-hour |
| `lib/package-line-pricing.ts:79,111,121,131,148` | Written, tested (`package-line-pricing.test.ts`), currently dark |
| `lib/vendor-packages.ts:210` `formatCentavosPhp`, `:275` `keptItems`, `:126` `resolveVendorCategory` | Formatting + cascade |
| `lib/proposal-send.ts:392` `sendCustomProposalCore` | The vendor's one-tap Confirm |
| `app/_components/vendor-packages/package-card.tsx` | Public card — lights up automatically |
| `app/v/[slug]` packages section, `lib/budget.ts`, `lib/price-position.ts`, `lib/vendor-autoreply/inbox-hook.ts`, `app/api/v1/vendor/profile/route.ts`, the couple workspace header, `app/api/vendor/chat/[threadId]/compose-options/route.ts` | **Nine downstream consumers already built and starving for rows.** `app/vendor-dashboard/proposals/surface.tsx:289` literally renders `<select name="default_package_id">` over packages no vendor can create. |
| `services/actions.ts:407` `ensureProfile`, `:493` `replaceServiceLists`, `:605-608` the `?error=` round-trip; `addon-actions.ts` replace-all + explicit `.eq('vendor_profile_id', …)` | The server-action contract |
| `app/_components/{submit-button, forms/field}`, `useModalA11y` | Chrome |

### Reused **without a migration** — the sharpest reuse in this plan
- **`vendor_packages.is_consumable_flexible`** carries owner constraint 5 as-is (`lib/vendor-packages.ts:252-259`). No policy column.
- **`PackageCustomizations.consumable_allocations`** — documented at `lib/vendor-packages.ts:190-195` as *"Free-text mapping category-label → centavos. Informational only"* and **read by nothing**. Promote it to carry the real credit spends, and add `choice_picks` beside it in the same JSONB. Zero schema change.
- **`event_vendor_packages.status = 'considering'`** — declared in `20260604110000:243-244`, never entered. Now the configurator's home state.

### Extended (not replaced)
- `lib/vendor-packages.ts` — `computeCustomization` (`:239-269`) is a two-branch boolean that today refunds `replacement_value_centavos` for **any** unchecked item. It gains required-exclusion + choice deltas. **This is a live rule-7 violation and cannot ship in a different PR from the `is_required` column.**
- `app/_components/vendor-packages/lock-modal.tsx` — `:41-47` `toggle()` and `:162-167` (an unconditional checkbox on *every* item) become the four zones. Also gains the second CTA.
- `app/dashboard/[eventId]/vendors/packages/actions.ts` — `lockPackage` persists choice picks + spends and re-resolves server-side; `removeItemFromPackage` (`:316`) must refuse required lines.
- `app/vendor-dashboard/messages/[threadId]/proposal-actions.ts` — add `savePackageFromQuote` beside `loadPackageLinesForQuote:93`.

### Genuinely new — **4 files + 1 migration**, no new page, no new table
| New | Justification against reuse-first |
|---|---|
| `supabase/migrations/…_package_required_choice_credit.sql` | No column expresses required-as-its-own-axis, choice grouping, the catalogue pointer, or overspend. |
| `lib/package-config.ts` (pure, ~180 lines) | `computeCustomization` cannot express choice deltas, required exclusion, or overspend. Mirrors `package-line-pricing.ts`'s pure+total contract. |
| `services/_components/package-editor.tsx` | Grammar reused; the row *shape* (3-state + options) is new. |
| `services/package-actions.ts` | Replace-all copied from `addon-actions.ts`; target table differs. |
| `services/_components/package-live-preview.tsx` | Scrape idiom copied verbatim; different reader. |
| `lib/package-templates.ts` | Pure data, no logic. |

The couple-side credit-spend step is **not** a new file — it is a step inside the existing `[bookingId]` route.

### Migration contents
```sql
-- vendor_package_items
is_required               BOOLEAN NOT NULL DEFAULT FALSE
choice_group              TEXT NULL
is_choice_default         BOOLEAN NOT NULL DEFAULT FALSE
source_vendor_service_id  UUID NULL REFERENCES vendor_services(...) ON DELETE SET NULL
-- event_vendor_packages
overspend_centavos        BIGINT NOT NULL DEFAULT 0 CHECK (overspend_centavos >= 0)
-- + BEFORE UPDATE money-guard trigger (see §5)
```
Additive, idempotent, defaulted. `ON DELETE SET NULL` answers the objection that a pointer welds a package line to a row the vendor can delete.

**Choice deltas are derived, never stored:** `delta = resolvePackageLine(picked) − resolvePackageLine(groupDefault)`. No delta column. Choice and credit unify into the one number.

---

## 5 · Two verified traps that all four proposals missed

**Trap 1 — `event_vendor_packages` money columns are couple-writable.** Migration `20260604110000:287-291` creates `event_vendor_packages_couple_write` as `FOR ALL … USING (event_id IN (SELECT public.current_couple_event_ids())) WITH CHECK (…)`. RLS is row-level: a couple can `UPDATE` their own booking's `total_locked_centavos` / `remaining_consumable_centavos` / `customizations_json` straight through PostgREST. `lockPackage` correctly derives on insert (`packages/actions.ts:152-159`) but nothing pins the columns afterward — and `removeItemFromPackage:406-410` writes them again on the couple's own client.

**Fix, in PR1:** move every money write in `packages/actions.ts` to `createAdminClient()` (precedent: `app/dashboard/[eventId]/vendors/actions.ts:2152`), then add a `BEFORE UPDATE` trigger rejecting changes to `total_locked_centavos`, `remaining_consumable_centavos` and `overspend_centavos` from role `authenticated`. Both halves must land together or `removeItemFromPackage` breaks.

**Trap 2 — the booking fee multiplies per package line.** `lockPackage` inserts **one `event_vendors` row per kept item** (`packages/actions.ts:169-191`), each `status:'contracted'`. `collectBookingFeeAtLock` is keyed `p_event_vendor_id` (`app/dashboard/[eventId]/vendors/actions.ts:2152`) and `FREE_BOOKING_LIMIT` is a per-row ordinal (`lib/booking-fee-lock.ts`). Today the package path never calls it — a fee *leak*. The moment it is wired, one 8-line package lock burns the entire free-5 and then charges on lines 6–8.

**Fix, in PR10:** **one package lock = one booking.** Fee base `total_locked_centavos`, ordinal 1, cascaded `event_vendors` rows fee-exempt.

**On the `>= 0` CHECK:** keep it (`20260604110000:251-252`). Model overflow additively in `overspend_centavos`; `total_locked = total_price + overspend`. The pool never goes negative, the overflow is auditable, and the couple reads `Package + Extras = Total`. **Siding with fastest-authoring / reuse-maximalist over deepest-bespoke / ai-assisted, who both drop a money invariant on a row the couple can write.**

---

## 6 · Ordered PR plan — every PR flag-dark behind `NEXT_PUBLIC_VENDOR_PACKAGES_V1`

| # | Scope | Mig? | Size | One-line risk |
|---|---|---|---|---|
| 1 | Migration (5 cols) + money-guard trigger + move `packages/actions.ts` money writes to the admin client | **yes** | S–M | Trigger blocks `removeItemFromPackage` if the admin-client move isn't in the same PR. |
| 2 | `lib/package-config.ts` — pure resolver + unit tests. Wires `package-line-pricing.ts` in. No UI. | no | M | Silent divergence from `computeCustomization` until PR7 switches callers. |
| 3 | Packages tab (4th `ManagerTabs` entry) + list + four-door empty state, read-only. Shorten `'Service cards'` → `'Services'`. | no | S | Tab strip at 375px; verify on a real phone. |
| 4 | **"Save as a package"** — inverse of `loadPackageLinesForQuote`, one button in Proposal Maker | no | S | Quote lines are peso-denominated (`proposal-actions.ts:131`); ×100 must happen exactly once. |
| 5 | **Core PR** — `package-editor.tsx` + `package-actions.ts` + `package-templates.ts`: 3-state control, progressive disclosure, options repeater, replace-all save | no | **L** | A fifth editor joins a 1,708-line component — see the §7 blocker. |
| 6 | `package-live-preview.tsx` | no | S–M | Without the 800ms poll the preview reads stale hidden inputs. |
| 7 | Couple configurator: `considering` entry, `[Make it yours]` / `[Lock it in as-is]`, four zones, one number. **Must land with or after PR2 and never before `is_required` exists.** | no | **L** | Rule 7 leaks the moment `is_required` exists without the exclusion. |
| 8 | Credit-spend step over `vendor_services` ∪ `vendor_service_addons` + overspend-on-total + the single ×100 shim | no | M | `vendor_services.starting_price_php` is INTEGER **pesos** (`20260514010000:44`); packages are BIGINT centavos. One conversion site only. |
| 9 | Terminal handshake — chat card + vendor one-tap Confirm → `sendCustomProposalCore` | no | M | Two quoting systems coexist; the seam must seed, not compete. |
| 10 | Downstream truth: **one-lock-one-booking-fee**, `removeItemFromPackage` refuses required, budget attribution, cascade honors choice picks | no | M | Money. Do not ship 7–8 to real vendors without this. |
| 11 | Optional: reconcile `lock-modal` cream/ink → `--m-*` | no | S | Cosmetic only; must not ride inside a money PR. |

**Two natural stop points.** PRs 1–6 give vendors package authoring that does not exist today in any form. PRs 1–10 make the positioning claim demonstrable end to end.

**Content track, starting at PR1 and off the critical path:** ~28 category starter packs (~8 lines each, with defensible default states) in Filipino-vendor vocabulary. This is what decides whether the feature lands or flops, and no code fixes it.

---

## 7 · What we deliberately do NOT build

1. **Nested choices** ("pick your buffet tier, *then* three dishes"). A caterer authoring on a phone between Viber replies will not build a decision tree. Ship a `requires_option_id` column so an option can grey out with *"available with the Premium buffet"* — a flat cross-reference — and defer the feature.
2. **A desktop/CSV package importer.** The 40-line hotel package wants a spreadsheet. Real, deliberately deferred — and if the first ten pilot vendors are hotels rather than solo caterers, re-litigate before PR5.
3. **Per-line family voting.** Visibility yes, enfranchisement no.
4. **A "fake flexibility" detector** (a rule that swappable values must total ≥15% of price). It is exactly the jargon that breaks the five-minute test. Ship without it, watch, add if it happens.
5. **A `vendor_package_choice_groups` table.** `choice_group TEXT` has no DB integrity — nothing stops two defaults or an orphan option. That matches this codebase's own stated posture (`20260604110000:168-171`: *"enforcement is at the app layer, not in DB"*). Real debt; the correct later fix.
6. **Migrating `vendor_services.*_php` to centavos.** Prod rows are ~0 so the migration would be data-free, but 40+ readers treat those columns as pesos. A read-time ×100 shim in one place instead.
7. **An LLM anywhere in this feature.** Owner-locked: Setnayan AI is deterministic and free. The wave-2 drafter reads rows and names them.
8. **Choice inside a *proposal*.** `vendor_proposals.line_items` stays a flat frozen array with accept/decline/counter. Separate, larger work.

---

## 8 · Owner decisions

1. **The starter-pack content — who writes it?** ~28 categories × ~8 lines, in words a Filipino caterer recognizes as their own. **Recommendation: you or a vendor-facing hire writes it, starting now, in parallel with PR1.** If it reads "Service Item 1," the whole design inverts from asset to liability.
2. **Default credit rule.** **Recommendation: credit when the vendor has ≥3 other sellable things, off-the-price otherwise.** Never expiry-by-default.
3. **Can a vendor fence the credit** ("spend it on anything except more hours")? Constraint 2 says the whole catalogue. Vendors will ask immediately because a second shooter on a booked date isn't purchasable. **Recommendation: ship without a fence; add a per-service `credit_eligible` flag in a later wave if it bites.**
4. **The `SlotEditor` / `PaymentScheduleEditor` contradiction — a ruling is owed before PR5.** `service-wizard.tsx:23-31` records that availability and payment plans were removed from the listing (owner 2026-06-20, *"the calendar has the limits, not the service"*), yet `services-manager.tsx:1046` and `:1051` still mount both. **Recommendation: honor the 2026-06-20 removal and delete them** before a fifth editor joins that stack. Flagged by three of the four proposals independently.
5. **Design tokens.** Vendor surfaces are `--m-*` (`addons-editor.tsx:34`, `manager-tabs.tsx:43-45`); couple package surfaces are cream/ink/terracotta (`lock-modal.tsx:99`, `package-card.tsx:31`). **Recommendation: leave `lock-modal` on cream/ink** — it renders on `/v/[slug]`, which is cream end to end, so reskinning it in isolation would break *that* page. Confirm rather than quietly reverse it inside a money PR.
6. **Tab order.** Packages as tab 4 buries it for hotels, for whom the package *is* the product. **Recommendation: ship at position 4; reorder to position 2 when a vendor has more packages than services.**
7. **Does the credit get a Tagalog name** in the Papic / Pabuya / Pakanta family? *Palit* ("swap") is available and apt. Your territory.

---

## 9 · The honest risk — the single most likely way this fails

**Vendors author exactly one package and never build a catalogue — so "customize" collapses into "uncheck things for a discount," which is what the market already does over Viber, only slower and with more taps.**

The whole positioning claim rests on constraint 2: credit spends across the vendor's *whole catalogue*. Prod is **0 services, 0 add-ons, 0 packages, 0 bookings**. If a vendor publishes one package and nothing else, the marquee "Spend your ₱8,000" screen renders an empty room, we quietly downgrade them to off-the-price, and the couple's experience is a checkbox list that lowers a number — a discount UI. At that point Setnayan is not "the place where people customize"; it is a slightly nicer PDF, and no vendor tells another vendor about a slightly nicer PDF.

Three things partially blunt it, none of them solve it: the four-door empty state (a quote-derived package needs no catalogue); the screen-3 nudge that turns "choose credit" into a services-authoring prompt at the exact moment the vendor cares; and the ≥3-things gate that keeps us from displaying a promise the shelf can't honor.

The real mitigation is not code. **The pilot vendor cohort must be chosen for catalogue depth, not logo prestige** — five vendors with fifteen service cards each will prove this feature; fifty vendors with one package each will kill it, and the post-mortem will say "customization is a nice-to-have," which will be the wrong conclusion.
