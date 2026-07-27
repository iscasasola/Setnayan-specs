# HANDOFF — the package / vendor-card wave · 2026-07-26

> **Read this first, then `Vendor_Card_Actions_Findings_2026-07-26.md`.**
> Written for a cold-start Claude Code session on the same machine, new account.
> Everything here was **verified against code or the live prod DB in the session that
> wrote it** — where something is unverified it says so explicitly.

---

## 0. THE ONE-PARAGRAPH SUMMARY

Setnayan already ships a **couple-side package configurator** (`/v/[slug]` → `LockPackageModal`)
that lets a couple drop inclusions and watch the price recompute. It has never done anything,
because **no application code could create a package** — prod holds `vendor_packages = 0` and a
grep across all file types finds no insert outside a migration and a test. This wave built the
missing vendor-side authoring surface, fixed five real defects found on the way (three in the
package path, two live on production data), and locked six owner decisions. What remains is
listed in §6 in priority order.

---

## 1. WHERE THINGS ARE

| Thing | Path |
|---|---|
| Spec corpus (this file) | `~/Documents/Claude/Projects/Setnayan/` |
| Main repo checkout | `~/Documents/Claude/Projects/setnayan-platform` |
| GitHub | `iscasasola/setnayan-platform` |
| Prod Supabase project id | `njrupjnvkjkitfctetvi` |

**Live worktrees from this session** (prune once their PRs merge — worktrees are 1–2 GB and
have caused ENOSPC before):

```
/private/tmp/claude-501/-Users-icecasasola-Documents-Claude-Projects-Setnayan/66b42afb-8608-42f3-8498-4dbe21741ab1/scratchpad/wt-author   [claude/package-authoring-ui]
/private/tmp/claude-501/-Users-icecasasola-Documents-Claude-Projects-Setnayan/66b42afb-8608-42f3-8498-4dbe21741ab1/scratchpad/wt-fixes    [claude/package-wave-defects]
```

Both branches are **merged or merging**; prune both after confirming §2.

---

## 2. PR STATE AT HANDOFF

| PR | State | What |
|---|---|---|
| [#3730](https://github.com/iscasasola/setnayan-platform/pull/3730) | **MERGED + prod-verified** | 3 defects in the shipped lock path + `event_vendors.package_item_id` |
| [#3733](https://github.com/iscasasola/setnayan-platform/pull/3733) | **MERGED** | `lib/package-authoring.ts` — the validator |
| [#3739](https://github.com/iscasasola/setnayan-platform/pull/3739) | **MERGED into #3737's branch** | the authoring UI |
| [#3740](https://github.com/iscasasola/setnayan-platform/pull/3740) | **MERGED** | 2 live data-loss defects + fee-header fix |
| [#3737](https://github.com/iscasasola/setnayan-platform/pull/3737) | **OPEN, auto-armed** | actions + UI + My Shop doorway (carries #3739) |

### ✅ RESOLVED 2026-07-26 — #3737 LANDED, no action needed

Verified: merged 08:07 UTC, all 21 checks green, and both feature commits (`2b679dc16`,
`869912bd9`) are ancestors of `origin/main` — file-level check, not just "the PR says merged"
(trap #7). #3739 and #3740 are in as well. **The wave is whole.**

> 🚨 But it did not *work*: see the `option_label` correction in § 6.1. The authoring surface
> merged with a column name that does not exist, so saving a choice option 400'd. Flag-dark, so
> no user impact and no data to repair.

_Original instructions, kept in case a similar `action_required` block recurs:_

**#3737 was blocked on `action_required` CI** (the merge of #3739 into its branch made the
workflows need manual approval). The three runs were approved at handoff. **Verify it landed:**

```bash
cd ~/Documents/Claude/Projects/setnayan-platform && git fetch -q origin main
for f in apps/web/lib/package-authoring-flag.ts \
         apps/web/app/vendor-dashboard/packages/actions.ts \
         apps/web/app/vendor-dashboard/packages/_components/package-editor.tsx; do
  git cat-file -e origin/main:$f 2>/dev/null && echo "✓ $f" || echo "✗ MISSING $f"
done
```

If any are missing, re-approve: `gh run list --commit $(gh pr view 3737 --json headRefOid -q .headRefOid)`
then `gh api -X POST repos/iscasasola/setnayan-platform/actions/runs/<id>/approve` for each.

---

## 3. WHAT ALREADY SHIPS — do not rebuild any of this

Every row verified this session. **This is the highest-value section**: most of the wasted
effort in this wave came from assuming something was missing when it wasn't.

| Capability | Where | Note |
|---|---|---|
| **Couple-side package configurator** | `app/_components/vendor-packages/lock-modal.tsx` | checkbox per item, live recompute via `computeCustomization`, submits `{removed_item_ids}` to `lockPackage`. Reachable from `/v/[slug]:3323`, explore, compare, shortlist, favorites, `u/[slug]` |
| **Explore workspace** | `lib/budget-build.ts:37` | tabs = `shortlist · build · budget · compare`; **Lock lives inside Build** (2026-06-20 "Build absorbs Lock"). `BUDGET_BUILD_ENABLED` defaults **ON** |
| **Shortlist = a state, not a table** | `app/explore/actions.ts:130` `saveVendorToPicks` | writes `event_vendors {status:'considering', source:'host_manual'}` |
| **Message auto-shortlists** | `app/v/[slug]/inquiry-actions.ts:405-456` | `startServiceInquiry` creates-or-merges the same row |
| **Adaptive Pax Pricing** | `lib/pax.ts` (2026-06-13) | live pax = `max(minimum-pax floor, live headcount)`; finalize freezes the binding count |
| **Per-line pricing by pax AND hours** | `lib/package-line-pricing.ts:79-104` | `per_pax` = `rate × max(pax, min_pax)`; `per_hour` = `base + max(0, hours−min_hours) × extra_hour` |
| **Pax snapshot on inquiry** | `chat_threads.pax_at_inquiry` / `pax_current` | seeded from `resolveLivePax` |
| **Couple requirements capture** | `lib/requirements-capture.ts` | surfaces admin-defined `multi_select` facets as "what we're looking for"; persists to `event_vendor_preferences.attribute_payload` via `setEventPreference`; appended to the inquiry body |
| **Shortlist rows carry a real price** | `shortlist-categories.tsx:814` → `.price` at `:301-303` | prints `formatPhp(v.totalCostPhp)` — Build/Budget are **not** category estimates |
| **Distance venue↔vendor** | `lib/geo.ts:112`, `lib/events.ts:615-629` | live; feeds chips, sort, radius filter, compat score |
| **Per-service showcase media** | `app/v/[slug]/page.tsx:608` `resolveServiceShowcaseMedia` | per-service photos already wired |
| **Booking-fee engine** | `lib/booking-fee.ts`, `lib/booking-fee-lock.server.ts` | flag-dark on `NEXT_PUBLIC_BOOKING_FEE_ENABLED` |

### Things that do NOT exist (verified by grep + prod query)

- **Any package.** `vendor_packages = 0`, `vendor_package_items = 0`, `event_vendor_packages = 0`.
- **A vendor authoring surface** — until #3737 lands.
- **Choice rendering.** `vendor_package_item_options` is in prod; `lock-modal.tsx` never SELECTs it.
- **Credit wiring.** `computePackageCredit` (`lib/package-credit.ts:333`) has **zero** production
  callers; `NEXT_PUBLIC_PACKAGE_CREDIT` is consulted by nothing (its own docstring says so).
- **Any per-km / free-radius column.** `transport_mode='distance'` returns **0** and emits the
  literal *"Quoted after site check"* (`package-line-pricing.ts:131-134`).
- **Extras** (adding quantities of an add-on) — no schema.
- **Per-request vendor verdicts.** `event_vendor_preferences.special_request` is ONE freeform note
  per category, and the migration header says *"no reader yet."*
- **Buttons on the service card.** `v/[slug]/_components/services-gallery.tsx:124-228` has no
  button/anchor/Link; "Inquire" is a price label in a `<p>`.
- **A "Pass" / down-rung** anywhere.

---

## 4. LOCKED DECISIONS FROM THIS SESSION

All six are in `DECISION_LOG.md` (bottom). Summarised:

### 4a. The service card has TWO actions, not four
**Add to shortlist** (which *opens the customization* — there is no separate Customize button)
and **Lock this** (book as offered, skip the shortlist).

**Messaging happens AFTER the couple sends the shortlist**, so the vendor's first message already
carries the spec, the date and the guest count. No more *"hi, are you available?"*.

> An adversarial review reached the same collapse independently, from the data side: a
> customization **cannot** return a price without a thread, because `vendor_proposals` is the only
> object carrying a vendor-attested price and its INSERT policy requires one. Its recommended fix
> was verbatim *"Customize IMPLIES Message."*

### 4b. Prices auto-adjust to the couple's plan; locked prices freeze
A signed-in couple should never see a shop-window price. `from ₱120,000` is rate × the vendor's
*minimum*; a 140-guest couple owes ₱168,000. **But a `contracted` price is an agreement** — it must
stop tracking the plan, and a plan change that invalidates one raises a re-quote flag rather than
silently re-pricing.

### 4c. Hide-prices vendors need no special branch
Owner: *"They already have basic information of what they need. The vendor's service only shows if
their services is aligned to the event's request."* **Relevance is the gate, not price.** The couple
configures against requirements the system already holds; the vendor supplies the number.

### 4d–4g. The four answered 2026-07-26

| # | Decision | Consequence |
|---|---|---|
| **Package fee base** | **the package price the couple agreed to** (the locked total `lockPackage` already computes) | needs a package-aware entry point beside `collectBookingFeeAtLock` |
| **Past-work photos** | **allowed, with a RECORDED couple consent** | needs a consent column + couple-side control |
| **Free-5 counts** | **BOOKINGS, not events** ⚠ | **reverses shipped behaviour — see §6.3** |
| **Vendor's own link** | **IMPORT — no fee** | `'website'` must leave `SOURCED_INQUIRY_SOURCES` |

---

## 5. TRAPS — each of these cost real time this session

1. **`vendor_status` has a value called `shortlisted` that does NOT mean shortlisted.**
   Enum: `considering | shortlisted | contracted | deposit_paid | delivered | complete`. Every
   user-facing save writes **`considering`**; `shortlisted` is written *only* by the proposal-accept
   RPCs (`20270201674389:136,169`), and money code reads it. **Leave the enum alone.**

2. **`event_vendors` has NO unique key on `(event_id, marketplace_vendor_id)`.** `lockPackage`
   inserts one row per category with the same vendor id, so duplicates already exist. Decide the
   grain before building UI — recommended: one row per `(event, vendor, category)`.

3. **A grep for a table name can miss its only writer.** `event_vendor_preferences` looks
   unwritten (`from('event_vendor_preferences')` hits only a demo seeder) because the real write is
   behind a `TABLE` constant in `lib/event-preferences.ts`. The `20270204498975` migration header
   *also* says "written by nothing yet" — **stale**. Grep for the helper, not just the literal.

4. **`booking-fee.ts`'s header says "(final)" about a SUPERSEDED rate.** It describes the
   2026-07-24 flat 5%; the owner-locked 2026-07-25 model is a 5%→1% taper. Fixed in #3740 — but the
   *rate* is deliberately unchanged (the taper belongs to the payment session).

5. **`pnpm run typecheck` returns turbo cache hits from other worktrees.** Use
   `cd apps/web && npx tsc --noEmit` and **capture the exit code directly** — piping into `tail`
   makes `&&` test `tail`'s status and can print "OK" over a real failure.

6. **A fresh worktree has no `node_modules`.** Run `pnpm install --frozen-lockfile --prefer-offline`
   inside it (~10–25 s). Do **not** symlink `node_modules` from another checkout — pnpm prompts and
   the run hangs.

7. **🚨 Never push to a branch whose PR already has auto-merge armed.** #3733's auto-merge fired on
   the first commit while a second was in flight; the PR read `MERGED` but
   `git merge-base --is-ancestor <sha> origin/main` was **NO** and the whole second half was on a
   deleted branch. Recovery is `git checkout -b <new> origin/main && git cherry-pick <sha>` — and is
   impossible if the worktree was pruned first. **Verify what landed, not that the PR merged.**

8. **`merged ≠ applied` for migrations.** After a migration merges, check the object in prod, not
   just the workflow (`supabase-migrations.yml`; concurrency groups cancel superseded runs).

9. **A merge into a branch can make CI need manual approval** (`action_required`), which silently
   blocks auto-merge with no failing check. See §2.

---

## 6. WHAT'S NEXT — in priority order

### 6.1 ✅ DONE 2026-07-26 — choices render and price

Shipped in **[#3744](https://github.com/iscasasola/setnayan-platform/pull/3744)** (couple-side
rendering + pricing), on top of **[#3743](https://github.com/iscasasola/setnayan-platform/pull/3743)**
(the `option_label` fix that made authoring work at all).

- A choice line renders a radio group under its inclusion — standard option preselected and
  labelled *Included*, others showing `+₱N`, plus an *Upgrades picked* footer row.
- Gated on `packageCreditEnabled()`. **The OFF state is correct, not degraded:** the line renders
  as a plain line at its standard option, and the DB pins that option's delta to 0. No flag state
  quotes below what the vendor charges.
- Prices are re-read server-side from the DB; only IDs cross the wire, and `lockPackage` persists
  a *sanitised* `chosen_option_ids`.
- Also fixed: `/v/[slug]` omitted `is_required`, so required lines rendered as unticking
  checkboxes there (server refused; the UI lied).
- 17 new tests, falsifiable both ways. **No migration** — it rides in `customizations_json`.

> ⚠ **Not verified end-to-end.** Prod holds 0 packages, so the modal has never drawn a real
> choice line anywhere. Pricing is unit-covered; *rendering* is not. Author one throwaway package
> once `NEXT_PUBLIC_PACKAGE_AUTHORING` flips, before turning the credit flag on.

_Original problem statement:_ A vendor can now author a choice line, but `lock-modal.tsx` never
SELECTs `vendor_package_item_options`, so the couple sees nothing. The first real package will
have an invisible line.

- SELECT the options alongside items in `lock-modal.tsx` and in
  `packages/actions.ts` (`lockPackage` — note it already SELECTs `is_required` after #3730).
- Render a radio group per choice line; the `is_default` option is the baseline at +₱0.
- Feed `chosenOptionIds` into `computePackageCredit`.
- **Schema is already in prod** — `option_id, item_id, option_label, option_description,
  price_delta_centavos, is_default, is_available, display_order`, with CHECKs enforcing
  `price_delta >= 0`, default-is-free, default-is-available.
- ⚠ **The column is `option_label`, NOT `label`** (corrected 2026-07-26 against the live schema).
  This line previously said `label`, and that is exactly what the authoring surface shipped —
  two SELECTs and one INSERT naming a column that does not exist, so no vendor could save or
  reload a choice option. Fixed on branch `claude/package-option-label-fix`; the name now lives
  once in `PACKAGE_ITEM_OPTION_SELECT` (`lib/vendor-packages.ts`) and is pinned to the migration
  by `lib/vendor-packages.columns.test.ts`. **Use the constant, never a literal.**
- **No migration is needed for the couple side.** `event_vendor_packages.customizations_json` is
  `JSONB DEFAULT '{}'`, so `chosen_option_ids` rides along in the existing
  `PackageCustomizations` payload.

### 6.2 ✅ DONE 2026-07-26 — the credit engine is wired

Shipped in **[#3746](https://github.com/iscasasola/setnayan-platform/pull/3746)**. `computePackageCredit`
is now the authority for every number on a package booking when the flag is on.

- **Parity is the safety argument:** with the DB-default `'expiring'` policy and no upgrades the
  engine reproduces `computeCustomization` **to the centavo** — asserted by exhaustion over all
  16 removal subsets × both package shapes. Flipping the flag on a plain package is a no-op *by
  construction*.
- **Fails closed, but forgives what it used to.** `allowedRemovals` narrows the removal list
  before the engine sees it, so a stale page can't turn into a hard failure on a money action;
  dropping a removal can only ever yield LESS credit. Everything else is surfaced, never replaced
  by a fallback number.
- **Fixed a defect in #3744:** the engine refuses to auto-apply the default on a REQUIRED choice
  line (owner rule). The modal had preselected it while holding no real selection. Required
  choices now start unselected and the button blocks; new `choice_required` result is the
  stale-client backstop.
- `unspent_credit_policy` is now SELECTed (without it the engine returned `invalid_package` on
  **every** call). Package/item select lists centralised into `VENDOR_PACKAGE_SELECT` /
  `VENDOR_PACKAGE_ITEM_SELECT`.

**Two of this section's own warnings were stale and are now resolved:**
- the `keptItemIds` "the lock wave MUST pick one" divergence — **stale**; #3730 already converged
  `keptItems()`. Nothing to pick.
- `'refundable'` — still owner-blocked but **verified unreachable**: nothing writes the column, so
  every package is `'expiring'`. The adapter defaults unknown/missing to `'expiring'` and a test
  pins it, so the unresolved semantic cannot be reached by omission.

Catalogue `additions` deliberately **not** wired — no schema, no picker (§6.9).

_Original problem statement:_
`computePackageCredit` has zero callers and `NEXT_PUBLIC_PACKAGE_CREDIT` is read by nothing.
The engine is written and tested (`lib/package-credit.test.ts`); it needs to replace/augment
`computeCustomization` on the lock path, behind the flag. **Owner's credit rules:**
- a dropped optional line frees credit; a required line never can
- credit offsets upgrades and extras; the couple pays the difference only if they overspend
- unspent credit is per-package policy (`unspent_credit_policy`: `expiring` | `refundable`)
- refund is capped: `min(remainingCredit, removedTotal, basePrice)`

### 6.3 ❌ CANCELLED 2026-07-26 — free-5 is PER EVENT, and that is what already ships

**Owner, 2026-07-26: *"yes. this is per event."*** This **REVERSES** the earlier same-day ruling
recorded below (and in `DECISION_LOG.md`) that free-5 counts BOOKINGS. A vendor doing catering +
styling + coordination at one wedding consumes **ONE** of their five, not three.

⇒ **The shipped behaviour is already correct.** `booking_fee_ledger` is
`UNIQUE (vendor_profile_id, event_id)` and the ordinal is per ledger row, i.e. per event. **No
schema change. Do not drop the unique constraint.**

> The ordinal DEFECT noted below was real and is **fixed** in
> [#3758](https://github.com/iscasasola/setnayan-platform/pull/3758): the `ON CONFLICT DO UPDATE`
> now sets `source = 'lock'` (it never did, so a send-created row stayed `source='send'`, the
> ordinal counted 0, violated the `>= 1` CHECK, raised, and left the fee silently uncollected),
> plus a `GREATEST(v_ordinal, 1)` backstop.

_Superseded text:_
### ~~6.3 ⚠ Free-5 → count BOOKINGS (schema change, owner-locked)~~
`booking_fee_ledger` is `UNIQUE (vendor_profile_id, event_id)` and the ordinal is per ledger row,
so today all of a vendor's services at one wedding share **one** free/paid verdict. Under the
ruling, a vendor doing catering + styling + coordination at one wedding consumes **three** of five.

Either drop the unique constraint or compute the ordinal off bookings. **Show the owner the shape
before shipping** — this materially shortens the free run for full-service vendors, which they
accepted, but should see.

> ⚠ There is also a pre-existing engine defect here: the ordinal counts
> `WHERE source='lock'`, but the lock path's `ON CONFLICT DO UPDATE` never sets `source`, so a
> send-path ledger row either frees the vendor forever or hard-errors into no charge. Fix with the
> same change.

### 6.4 ✅ DONE 2026-07-26 — the fee fires once, on the anchor

Shipped in **[#3765](https://github.com/iscasasola/setnayan-platform/pull/3765)**, on top of
**[#3762](https://github.com/iscasasola/setnayan-platform/pull/3762)** (M1, the anchor model) and
**[#3753](https://github.com/iscasasola/setnayan-platform/pull/3753)** (one pricer). Live in prod.

- `lockPackage` now calls `collectBookingFeeAtLock` on the **anchor**, whose `total_cost_php` is
  the whole agreed total. Verified: a ₱145,000 package bills **₱5,450** (the taper), not ₱4,500
  off one ₱90,000 line.
- `booking_fee_open_lock_charge` **refuses a covered row** (`covered_row_no_fee`). A DB guard, not
  careful callers: the RPC does NOT skip a NULL total — it COALESCEs to 0, still writes a ledger
  row and still **freezes a free-5 ordinal**, so a covered row would have consumed a free booking
  permanently and silently.
- `primary_event_vendor_id` was a heuristic that could land on a money-less covered row; it is now
  the anchor by construction.
- Exactly **one** charge per package booking, asserted.

_Superseded text:_
### ~~6.4 Package fee base + the bypass~~

**[#3753](https://github.com/iscasasola/setnayan-platform/pull/3753) landed the prerequisite.** The fee
base is `event_vendor_packages.total_locked_centavos`, and that number was being computed in **two
places that had diverged**: after §6.2 `lockPackage` was credit-aware while `removeItemFromPackage`
still priced with `computeCustomization` alone and fetched no options at all. So removing any
unrelated line from a package carrying a paid upgrade silently dropped the upgrade from the stored
total — and the fee would have shrunk with it. Now one shared `priceCustomizedPackage`, both callers.

**What §6.4 still needs — verified against the code 2026-07-26:**
- `collectBookingFeeAtLock(admin, { eventVendorId })` takes **only** an event-vendor id, and the RPC
  `booking_fee_open_lock_charge` derives the base from a **single** `event_vendors.total_cost_php`
  (`20270927120000:133-139`). Its one-live-charge unique index is keyed on **`event_vendor_id`**,
  not `(vendor, event)` — so calling it per cascaded row would mint **one charge + one QR order per
  package line, each with its own ₱50 floor**, not 5% of the package total.
- ⇒ needs a **new package-aware RPC** taking an explicit base (or an `event_vendor_package_id`).
  The `booking_fee_ledger` `UNIQUE (vendor_profile_id, event_id)` is actually convenient here: a
  package is one vendor at one event, so it maps to exactly one ledger row.
- ⚠ the amendment re-derive trigger watches `event_vendors.total_cost_php` only
  (`20270930120000:415-421`), so a package whose base is `total_locked_centavos` gets **no
  re-derive** when `removeItemFromPackage` rewrites it. Wire that too or the fee goes stale.
- ⚠ pre-existing engine defect to fix in the same change (§6.3 note): the free-5 ordinal counts
  `WHERE source='lock'`, but the lock path's `ON CONFLICT DO UPDATE` never sets `source`. If a
  send-path row exists first, the ordinal computes **0**, which violates the
  `booking_ordinal >= 1` CHECK → the RPC raises → `collectBookingFeeAtLock` returns `skipped` and
  **the fee is silently never collected**.

_Original:_
`lockPackage` **never calls** `collectBookingFeeAtLock` (which has exactly two call sites:
`vendors/actions.ts:2152`, `chat-lock-booking.server.ts:121`). On flag-flip, a package books for
**₱0 in fees**.

Owner-locked base = **the package's locked total**. The current RPC
(`booking_fee_open_lock_charge(p_event_vendor_id, p_schedule_version)`) derives the base from a
single `event_vendors.total_cost_php`, so this needs a package-aware entry point — do **not** call
it per cascaded row (the ledger's uniqueness would settle on the largest single item).

### 6.5 Vendor's own link = IMPORT
`'website'` is in `SOURCED_INQUIRY_SOURCES` (`lib/booking-fee-gate.ts:82`) with the sign-off
flagged open (#3d-iv). Move it to import, **and default NULL `inquiry_source` to import too** — it
is free today only by accident, because the bare `/v/[slug]` composer leaves it NULL. Add an
explicit self-link param (`/v/[slug]?src=own`) so the classification is deliberate.

### 6.6 Per-service gallery + consent record
Owner-locked: allowed **only** with a recorded couple consent (who + when).
`resolveServiceShowcaseMedia` and `vendor_portfolio` exist; the consent column and the couple-side
control do not. See memory `project_setnayan_vendor_past_events_gallery` (photo-rich layer was
deferred pending exactly this).

### 6.7 Special requests with per-line verdicts
Today: one freeform `special_request` per category, no reader. Owner wants N discrete lines, each
answered by the vendor: **Yes / Price it / Can't do / ↗ Offer instead**, with one-tap decline
reasons (*not something we offer · not possible on your date · below our minimum · needs a
different package*). Needs a child table with a per-line status.

### 6.8 Card actions on the service card
Today's card has **zero** controls. Ship the two-action model (§4a).

**`Lock this` is UNIVERSAL — owner-locked 2026-07-26** ("lock it. yes direct lock").

> ## ✅ THE CAPACITY QUESTION BELOW IS ANSWERED (owner, 2026-07-26)
> **"Lock will only be locked when the vendor approves their payment."**
>
> ⇒ the couple's Lock is a **CLAIM**, not a confirmed booking. That is branch **(b)** below —
> keep white unlimited, stop promising exclusivity — and it needs **no capacity-model change**:
> the 2026-06-12 lock stands, the date is genuinely held only at `deposit_paid`.
>
> **What must change is the COPY, not the schema.** No couple-facing surface may imply the date
> is secured at Lock. Do not ship the button saying "the date is yours".
>
> Nearest existing mechanism: the `vendor_locked_qr` RPC (`20270414692373:171`) — a vendor-issued
> QR promotes the row to `deposit_paid` and freezes the payment plan. Whether vendor
> payment-approval reuses that or gets its own action is **undecided**; the rule is not. The product
review's adaptive alternative is rejected.

> ⚠ **BUT — one thing must be settled first, and it is a money/trust issue.** The owner's stated
> reason was *"they only show if the date is available, so there is never a question as to whether
> it conflicts."* The availability filter is **display-time only.** The schedule-pool gate
> (`vendors/actions.ts:246-262`, owner lock 2026-06-12) says plainly:
> *"White (considering..contracted) is unlimited and consumes nothing; only BOOKED
> (deposit_paid/delivered/complete) consumes pool capacity."*
>
> So **`contracted` — what Lock writes — reserves nothing.** `acquireSchedulePools` fires on the
> flip to `deposit_paid`. Two couples can both Lock the same vendor for the same date and only
> discover it when one pays. Direct Lock makes this far likelier, because today `contracted` is
> only reached after a conversation.
>
> **Pick one before the button ships:**
> **(a)** move the pool acquire to the `contracted` transition so Lock really reserves the date —
> reverses the 2026-06-12 "white is unlimited" lock, and an unpaid lock holding a date needs an
> expiry or tyre-kickers will block vendors; or
> **(b)** keep white unlimited and stop promising exclusivity — Lock is a *claim*, the UI says so,
> and the vendor confirms.
>
> Shipping the button while telling couples "the date is yours", without (a), is the one outcome
> that damages trust on both sides.

### 6.9 Longer tail
- **Adjusted prices on cards** — the engine prices correctly but only inside a quote; cards print
  the raw anchor. Also `requestedHours` is a hardcoded `8` (`proposal-maker.tsx:161`), never read
  from the event.
- **Extras** — no schema; nearest is `CreditAddition[]` with no catalogue picker.
- **Travel by distance** — distance is live but never an argument to a pricing function.
- **Quote → package** — `loadPackageLinesForQuote` ships the reverse; the inverse is ~80 lines.
- **The budget prices the category-cheapest service**, not the one shortlisted (₱95k booked, ₱25k
  budgeted). Fix in `buildVendorPricingLookup`: resolve from `service_id` when non-null.
- **Messaging silently auto-FOLLOWS** the vendor (`startServiceInquiry` → `followVendor()`), and
  follow is publicly counted. Release on decline/archive, or surface it as a toggle.
- **No "Pass"** — PH couples message 10–15 vendors an evening; nothing ever leaves the list.
- **`/privacy` doesn't describe what Lock discloses** (venue address, guest count, meal
  preferences). Rewrite "Vendor identity masking" as a three-rung table: pending / accepted /
  booked. This is the *document* half of the standing 2026-07-24 "document, don't block" default.
- **Deliberately NOT fixed:** the *"👀 N also eyeing this date"* chip counts `considering` rows.
  It was flagged as inflated by auto-shortlisting, but a couple who messaged genuinely *is*
  considering, and cascade rows are genuinely booked. **Product call, not a defect — ask the owner.**

### 6.10 Still-unmerged from the earlier monetization wave
`cap-ui` (~1 hr) · `boost-featured` (~½ day) · `launch-window` (2 lines) · `team-roles` (rebase
only) · `two-ring-reach` **needs splitting** (merge the settings half, abandon transport
enforcement). See `Vendor_7Track_Final_Verdict_2026-07-26.md`.

---

## 7. HOUSE RULES (from `CLAUDE.md` + hard-won)

- Worktree → PR → `gh pr merge <#> --auto --merge`. **Never ask** whether to auto-merge (owner
  locked 2026-05-15) — but see trap #7.
- **The repo AUTO-ARMS auto-merge on every non-draft PR.** To hold one for review, open it
  `--draft`; "not arming" is not enough.
- Changelog fragments go in **ROOT `changelog.d/`**, NOT `apps/web/changelog.d/` (CI guard).
  Never edit `CHANGELOG.md` or `STATUS.md` in a feature PR.
- Everything ships **flag-dark**: a dedicated `*-flag.ts` module, strict `=== 'true'`, default OFF.
- Migrations land **first**, RLS at `CREATE TABLE` time.
- Pure libs (no env/clock/IO) so `tsx --test` can run them: `cd apps/web && npx tsx --test "lib/**/*.test.ts"`.
- **Falsifiable tests**: revert the fix, confirm red, restore. State the count both ways in the PR.
- A page ships **with its doorway** — no orphaned routes.
- Prune each worktree once its PR merges.

## 8. VERIFICATION RECIPES

```bash
# What actually landed on main (never trust "PR merged")
git fetch -q origin main && git merge-base --is-ancestor <sha> origin/main && echo LANDED

# Did a migration actually apply? (use the Supabase MCP execute_sql on njrupjnvkjkitfctetvi)
select count(*) from information_schema.columns
 where table_schema='public' and table_name='<t>' and column_name='<c>';

# Package reality check — expect 0 until a vendor authors one
select (select count(*) from vendor_packages)        as packages,
       (select count(*) from vendor_package_items)   as items,
       (select count(*) from event_vendor_packages)  as bookings;

# Typecheck (NOT `pnpm run typecheck` — turbo cache lies across worktrees)
cd apps/web && npx tsc --noEmit; echo "exit=$?"
```

## 9. PROTOTYPES (design reference, not code)

`Design_Package_Credit_2026-07-26/full_loop.html` is the canonical one — 5 tabs: vendor builds it ·
what couples see · they customize · vendor prices it · **alignment ledger** (every element tagged
SHIPS / PARTIAL / BROKEN / NEW against the real code). Open it before designing anything here.
Siblings in the same folder cover earlier iterations and the decline-reason set.

## 10. OPEN OWNER QUESTIONS

1. **Is `Lock this` universal or adaptive?** (§6.8)
2. **The "eyeing this date" chip** — should derived shortlist rows count? (§6.9)
3. **Free-5 shape** — show the owner the vendor-facing effect before shipping §6.3.
