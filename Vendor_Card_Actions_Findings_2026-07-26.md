# Service-card actions — what ships, what breaks · 2026-07-26

> Grounded in `setnayan-platform-wt-first5` @ `1e6f8b25c`. Every claim below carries a
> file:line or migration name. Produced by a 4-lens adversarial review (product · data ·
> money · privacy) over a mapping pass. **Reference doc — not a decision.** Decisions
> belong in `DECISION_LOG.md`.

## 0. Owner directive being tested (2026-07-26)

> "Add to shortlist will show customization. So no need for extra button. And message
> will happen after they send the shortlist so they get a quick view of what they want
> before they talk to each other."

Card collapses to **two** actions: `Add to shortlist` (opens customization) and `Lock this`.
Messaging moves *after* the send.

**Verdict: correct, and independently recommended.** The data lens reached the same fix from
the opposite direction — see §2.3.

## 1. Already built (do NOT rebuild)

| Capability | Where |
|---|---|
| Shortlist **is** a state, not a table | `event_vendors.status='considering'` — `explore/actions.ts:130` (`saveVendorToPicks`) |
| Message **already** auto-shortlists | `startServiceInquiry` creates-or-merges the same row — `v/[slug]/inquiry-actions.ts:405-456` |
| Adaptive Pax Pricing — live pax = `max(min-pax floor, live headcount)` | `lib/pax.ts` (2026-06-13) |
| Pax snapshotted onto the inquiry | `chat_threads.pax_at_inquiry` / `pax_current` |
| Guest-list finalize freezes the binding count | `FinalizeState` in `lib/pax.ts` |
| Explore workspace: Shortlist · Build · Budget · Compare, **Lock inside Build** | `lib/budget-build.ts:37`, live by default since 2026-06-09 |
| Per-line pricing by pax **and** hours | `resolvePackageLine(row, {pax, hours})` |
| There is **no** favorites table | `library/_data/saved-vendors.ts:13-14` calls it "a phantom" |

**Correction to an earlier claim in session:** today's shipped service card has **zero controls** —
`v/[slug]/_components/services-gallery.tsx:124-228` contains no button, anchor or Link, and the
word "Inquire" is a *price label* in a `<p>`. Adding two actions is a **0→2** change, not 4→2.

## 2. Blocking findings

### 2.1 🔴 `'shortlisted'` is a taken word that does not mean shortlisted
`public.vendor_status` = `considering | shortlisted | contracted | deposit_paid | delivered | complete`
(`20260513100000:66-73`). Every user-facing save/inquiry path writes **`considering`**. The only
writers of **`shortlisted`** are the proposal-accept RPCs (`20270201674389:136,169`;
`20270227551916:82,118`). Money code reads it.

**Do:** leave the enum alone. Keep `considering`. Express the rung in `event_vendors.source`
(free-form TEXT, no CHECK — `20260604120000:42-43`).

### 2.2 🔴 The shortlist row has no defined grain
There is **no unique key** on `(event_id, marketplace_vendor_id)`. `lockPackage`
(`vendors/packages/actions.ts:174-192`) INSERTs **one row per category**, all carrying the same
`marketplace_vendor_id`. Duplicates already exist in production data.

**Do:** decide the grain before any UI — recommended **one row per (event, vendor, category)**,
matching the plan-group grain the planner already reasons in — and push service-level
customization into a child table.

### 2.3 🔴 Customize cannot return a price without a thread — RLS inverts the ladder
`vendor_proposals` is the only object carrying a vendor-attested price, and its INSERT policy
requires a thread. So a customization with no message is a spec that can never be quoted.

**Recommended fix (verbatim from the data lens): "Customize IMPLIES Message."**
This is exactly the owner's 2026-07-26 directive. ✅

### 2.4 🔴 Lock bypasses the booking fee on the largest-ticket path
`collectBookingFeeAtLock` has exactly **two** call sites (`vendors/actions.ts:2152`,
`chat-lock-booking.server.ts:121`). `lockPackage` cascade-inserts N rows at `contracted` and
**never calls it**. Promoting Lock to a one-tap card action multiplies the leak.

**Do:** make the fee a property of the lock *event*, not of a call site — one lock action, one
entry point; other paths route through it or are declared fee-exempt in writing.

### 2.5 🔴 The shipped fee rate ≠ the locked model
Shipped: **flat 5%, ₱50 floor, NO cap** (`20270927120000:39`,
`BOOKING_FEE_SCHEDULE_VERSION='2026-07-24-flat5-nocap'`).
Locked model: **5% to ₱100,000 then 1% above** (`Vendor_Monetization_Model_LOCKED_2026-07-25.md:54`).
Gap is largest on exactly the biggest bookings.

**Do:** reprice + bump `BOOKING_FEE_SCHEDULE_VERSION` *before* any lock rung ships.

### 2.6 🔴 Lock is the product's largest disclosure event, and `/privacy` contradicts the code
Lock alone — no message, no vendor accept, no consent screen — moves the couple to booked-stage
disclosure (venue address, guest count, guests' meal preferences). `app/privacy/page.tsx:365-371`
("Vendor identity masking") does not describe this.

**Do:** rewrite that section as a three-rung disclosure **table** (pending / accepted / booked) with
the literal field list per rung, before the actions ship. This is the "document" half of the
standing 2026-07-24 *document-don't-block* default.

### 2.7 🔴 Lock's archive sweep has a non-symmetric Undo
`finalizeVendor` archives **every** other `event_vendors` row in the same category at
`considering`/`shortlisted` (`vendors/actions.ts:1722-1731`). `revertVendorToConsidering` does not
reverse exactly that set — a mis-tap destroys research.

**Do:** stamp `archived_by_lock_of = <vendor_id>` on the sweep and have Undo reverse precisely it.

## 3. Important findings

- **Messaging silently auto-FOLLOWS the vendor.** `startServiceInquiry` calls `followVendor()`.
  Follow is the one save surface that is vendor-visible and publicly counted. Release it on
  decline/archive, or surface it as a toggleable line in the composer.
- **The budget prices the category-cheapest service, not the one shortlisted.** A couple who
  shortlists "Full Day Premium ₱95,000" can be budgeted at "Half Day ₱25,000". Fix in
  `buildVendorPricingLookup`: resolve from `service_id` when non-null.
- **The "👀 N also eyeing this date" chip counts `considering` rows**
  (`vendors/page.tsx:591-616`). Auto-shortlisting on message inflates a scarcity signal shown to
  *competing couples*. Count only explicit saves.
- **`deleteVendorService` is a hard `.delete()`** with no reference check
  (`vendor-dashboard/services/actions.ts:1885-1897`) — a customized shortlist can point at a
  service that no longer exists. Soft-retire instead.
- **Free-5 counts EVENTS, not bookings.** `booking_fee_ledger` is `UNIQUE (vendor_profile_id,
  event_id)`. The model doc says bookings. Pick one; "first 5 customers" is the more defensible
  story and is what the code already does.
- **There is no down-rung.** PH couples routinely message 10–15 vendors in a category in one
  evening; every one becomes a shortlist row with no "Pass". Add `passed` and put it in the thread.
- **Hide-prices vendors break 3 of 4 rungs.** Collapse their card to a single "Ask for a price"
  and give the shortlist row an explicit *price not published* state.
- **A vendor's own Instagram link is currently classified SOURCED** (`website` ∈
  `SOURCED_INQUIRY_SOURCES`, `booking-fee-gate.ts:82`, flagged open sign-off #3d-iv). A one-tap
  Lock from a vendor's own link would be the most likely false charge in the system.

## 3b. Second verification pass — what customize / auto-adjust actually ships

> 5 capabilities claimed then adversarially refuted, prod DB queried directly
> (project `njrupjnvkjkitfctetvi`).

### 🟢 The couple-side package configurator ALREADY SHIPS

`LockPackageModal` (`app/_components/vendor-packages/lock-modal.tsx:23`) renders a checkbox per
`vendor_package_items` row, live-recomputes via `computeCustomization`
(`lib/vendor-packages.ts:259`), and submits `{removed_item_ids}` to `lockPackage`
(`packages/actions.ts:56`), which cascade-creates one `event_vendors` row per kept item.
Doorway is real — `/v/[slug]:3323`, linked from explore, compare, shortlist, favorites, `u/[slug]`.
Post-lock per-item Remove exists (`packages/[bookingId]/page.tsx:223-233`).

**So "drop optional inclusions for credit" is not a design — it is shipped code.**

### 🔴 …but it is DATA-DEAD, because vendors cannot create a package

Prod counts, queried live: `vendor_packages=0` · `vendor_package_items=0` ·
`event_vendor_packages=0` · `vendor_package_item_options=0`.
Grep for insert/upsert into `vendor_packages` across **all** file types returns only the migration
and a db test — **no application code anywhere.**

> **This is the whole gap.** The couple-side configurator renders for nothing, and nothing in the
> shipped product can ever give it something to render. The vendor-side authoring surface — the
> thing this design session was asked to produce — is the single missing piece.

### Correction: PR #3724 merged, and is live in prod
Merged 2026-07-26T03:34:06Z (merge `10ae4df8`). `vendor_package_items.is_required`,
`vendor_packages.unspent_credit_policy` and `vendor_package_item_options` all confirmed present in
the prod schema. `computePackageCredit` has **zero** production callers;
`NEXT_PUBLIC_PACKAGE_CREDIT` (default OFF) is consulted by nothing. Dead by wiring, not deployment.

### Three defects sitting in the shipped path

1. 🔴 **Money bug — the card and the modal disagree about what's in the package.**
   `package-card.tsx:29` filters to `is_default_included`; `lock-modal.tsx:151` maps `pkg.items`
   **unfiltered** with `removedIds=[]`, so an optional add-on renders **pre-checked**.
   `computeCustomization` then treats it as already inside `total_price_centavos` — so unticking it
   **refunds money the vendor never charged**.
2. 🔴 **`is_required` is ignored.** `lockPackage` (`actions.ts:95`) does not SELECT the column and
   `computeCustomization` does not honour it — a couple can untick a line the vendor marked
   mandatory. *This directly contradicts the owner's 2026-07-26 "required cannot be unpicked" lock.*
3. 🔴 **`removeItemFromPackage` cascades by CATEGORY, not by item**
   (`packages/actions.ts:396-401`). `PACKAGE_CANONICAL_TO_VENDOR_CATEGORY` is many-to-one
   (`reception_venue` + `function_hall` + `events_place` + `hotel_ballroom` + garden + resort → `venue`).
   Removing one line deletes **every sibling row in that category** while recording one item_id —
   silent desync.
4. ⚠ **Post-lock removal is one-way.** No restore/re-add action exists; the only way back is
   releasing the entire package.

### Correction: Build/Budget shows REAL vendor prices, not category estimates
My earlier claim was wrong. `VendorCard` prints `formatPhp(v.totalCostPhp)`
(`shortlist-categories.tsx:814` → `.price` at `:301-303`), and `BUDGET_BUILD_ENABLED` defaults **ON**
(`lib/budget-build.ts:99`). The median-anchored category estimator is quarantined to the separate
`/budget` page; on the vendors page its only consumer is a compat **score**, never a displayed peso.
*(Two doc drifts confirmed: the comment at `vendors/page.tsx:1039` says the flag defaults OFF; the
`budget_builds` migration still documents a retired snapshot shape nothing reads.)*

### Auto-adjust: engine BUILT, display MISSING
`resolvePackageLine` (`lib/package-line-pricing.ts:79-104`) prices `per_pax` as
`rate × max(pax, min_pax)` and `per_hour` as `base + max(0, hours − min_hours) × extra_hour` —
**both** dimensions, seeded from `thread.pax_at_inquiry`. The couple sees the resolved total and the
per-line caption ("₱200 × 250 pax").
**But it is vendor-mediated** — it appears only inside a quote. Public/shortlist cards still print
the vendor's raw anchor. And `requestedHours` is a hardcoded `8` (`proposal-maker.tsx:161`), never
read from the event's real coverage hours.

### Travel: distance BUILT, fee NOT BUILT
Venue↔vendor distance is live (geocoding via `lib/geo.ts:112`, event anchor re-derived by
`recomputeReceptionAnchor`, `lib/events.ts:615-629`). It feeds chips, sort keys, the maxKm filter and
the compat score — **it is never an argument to any pricing function**.
No `rate_per_km` / `free_radius_km` column exists anywhere. `transport_mode='distance'` returns **0**
(`package-line-pricing.ts:131-134`) and emits the literal *"Quoted after site check"*.

### Inquiry payload: four entry points, only one carries configuration
`unlockCategoryWithInquiry` (`vendors/_actions/unlock-category.ts:243`) posts a bare `INQUIRY_BODY`
and does **not** route through `startServiceInquiry` — so any fix applied there misses it. It is the
highest-volume origin (onboarding fan-out, up to 5 categories at once —
`onboarding/wedding/actions.ts:768-789`).

## 4. Open owner decisions

1. ~~**Hide-prices vendors** — do their numbers appear inside the signed-in customization screen?~~
   **RESOLVED 2026-07-26 (owner):** *"They already have basic information of what they need. The
   vendor's service only shows if their services is aligned to the event's request."*

   The couple's requirements are already captured — `requirements-capture.ts` surfaces the
   admin-defined `multi_select` facets as a "what we're looking for" pick-list on the inquiry
   composer, the shortlist, and the requirements modal, persisting to
   `event_vendor_preferences.attribute_payload` via `setEventPreference` and appending them to
   the inquiry body so the vendor sees them on first contact.

   So a hide-prices vendor needs no special branch: **relevance is the gate, not price.** The
   couple configures against requirements the system already holds, and the vendor supplies the
   number. Customization collects a spec; it does not need to quote one.

   ⚠ *Note for future readers:* the `20270204498975` migration header says `attribute_payload` is
   "written by nothing yet", and a grep for `from('event_vendor_preferences')` finds only
   `scripts/seed-preference-match-demo.ts`. Both are misleading — the real write is behind a
   `TABLE` constant in `lib/event-preferences.ts`. The comment is stale; the wiring shipped.
2. **Is `Lock this` universal or adaptive?** Product lens recommends showing it only where the
   vendor has a posted non-inquire price *and* a published reservation method; everywhere else the
   rung becomes "Request this date". **← still open**
3. ~~**Free-5: events or bookings?**~~ **ANSWERED 2026-07-26: BOOKINGS.** ⚠ This *reverses* shipped
   behaviour. `booking_fee_ledger` is `UNIQUE (vendor_profile_id, event_id)`, so today a vendor
   doing catering + styling + coordination at one wedding consumes **one** of their five; under the
   ruling it is **three**. Needs a schema change — the unique constraint must go, or the ordinal
   must count bookings rather than ledger rows. The free run now ends materially sooner for
   full-service vendors; that is the accepted trade.
4. ~~**Sign-off #3d-iv**~~ **ANSWERED 2026-07-26: IMPORT — no fee.** A couple arriving via the
   vendor's own link is a couple the vendor brought. `'website'` must move out of
   `SOURCED_INQUIRY_SOURCES` (`booking-fee-gate.ts:82`), and NULL `inquiry_source` must default to
   import too — it is free today only *by accident*, because the bare `/v/[slug]` composer leaves it
   NULL. Vendors should get an explicit self-link param so the classification is deliberate.
5. ~~**Package fee base?**~~ **ANSWERED 2026-07-26: the package price the couple agreed to** — the
   locked total `lockPackage` already computes. Needs a package-aware entry point beside
   `collectBookingFeeAtLock`, whose base comes from a single `event_vendors.total_cost_php` inside
   the RPC. Left alone, a package books for **₱0 in fees** the moment the flag flips.
6. ~~**Past-work photos on a service card?**~~ **ANSWERED 2026-07-26: yes, with recorded consent.**
   Only from weddings where that couple affirmatively agreed; Setnayan stores who and when.
   `resolveServiceShowcaseMedia` + `vendor_portfolio` exist; the consent record does not.
