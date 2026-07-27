# Vendor Package Credit Pool — BUILD SPEC (2026-07-26)

> 7-agent design + money/data-model adversarial review. Companion to the Fable UX design. Owner-locked model; this is the HOW.

# THE BUILD SPEC — Vendor Package Credit Pool (FINAL, hardened 2026-07-26)

Grounded in `/Users/icecasasola/Documents/Claude/Projects/setnayan-platform-wt-first5` @ `5610d218a`. Every adversarial finding below was re-opened against the source before folding in. Fixes are marked **[hardened: money]** / **[hardened: data-model]**.

---

## Reviewer claims I reject (one line each, with evidence)

- **data-model #12, parenthetical only** — *"`vendor_services` is also `UNIQUE (vendor_profile_id, category)`, so 'this vendor's whole catalogue' is at most ~45 rows."* **Wrong:** that UNIQUE was dropped by `supabase/migrations/20260922000001_vendor_services_multi_per_leaf.sql:9-15` ("Drops that UNIQUE so a vendor can hold N rows per category"), and `budget.ts:418-431` already comments "a category can now hold MULTIPLE service listings". The catalogue is unbounded. **The main body of #12 (`starting_price_php` is a synced floor, not a committed price — `20270502342558:51,83`) is correct and is fixed below.**
- **money #1, remedy half only** — *"gate `unspent_credit_policy='refund'` behind admin approval."* Rejected: owner locked per-package vendor authoring, and a solo-admin approval queue for a pricing dial is the "approve transactions" anti-pattern already recorded against this project. I take the other half of the same finding (gross fee base) plus a strict budget ceiling, which closes the exploit without an admin in the loop.
- **money #2 vs data-model #8 are not two findings** — they are the same algebraic defect at two magnitudes (`payable = price − budget − removed` under both `flexible` branches; at `removed = price − budget` it lands on ₱0). One fix retires both. Noted so the fix isn't double-counted.

Everything else from both lenses is confirmed and fixed. One design claim of my own was also wrong and is corrected: **§0's "RPC skips on `total_cost_php` NULL → fee 0" was false** — `booking_fee_open_lock_charge` `COALESCE`s NULL to 0 (`20270927120000:137`), inserts a `booking_fee_ledger` row and **freezes a free-5 ordinal**; the ₱0 outcome comes only from `booking_fee_centavos(0)` short-circuiting at `:44-48`. The safety claim is deleted; the real guarantee is **we never call the RPC with a covered row**, enforced by a DB guard. **[hardened: data-model]**

---

## 0 · THE ONE ARCHITECTURAL DECISION — "one anchor, N covered"

Unchanged in shape, corrected in the money it carries.

| | anchor row | covered rows |
|---|---|---|
| count | exactly 1 per booking | 1 per kept item, minus the anchor's own item |
| `package_role` | `'anchor'` | `'covered'` |
| `package_item_id` | the item the anchor absorbs (**NEW** — was prose-only) | the item it represents |
| `marketplace_vendor_id` | set | set |
| `total_cost_php` | **= `gross_total_centavos / 100`** (contracted value) | **always NULL** |
| booking fee | opened once, here | never — a DB guard blocks it |
| free-tier cap | counts 1 | counts 0 (`COUNT(DISTINCT event_id)`) |
| budget | one priced line + optional credit line | occupies its lookup key, prices nothing |

**Two indexes must be rebuilt, not one. [hardened: money]** M1 originally excluded covered rows only from `event_vendors_unique_marketplace_pick_per_event`. `event_vendors_hard_single_lock_uniq` (`20261210000000:41-45`) keys on the **generated** `hard_single_group` derived from `category` (`:80-95`), and the anchor's category is `resolveVendorCategory(pkg.primary_canonical_service)` — for the shipped Sofitel seed that is `'venue' → 'reception_venue'`, identical to its own kept `reception_venue` covered row. **23505 on the second insert; PR-1 assertion 1 would have stayed RED.** Both indexes now carry `AND package_role IS DISTINCT FROM 'covered'`.

**The anchor absorbs the item resolving to `primary_canonical_service`;** if no kept item matches, the anchor carries `package_item_id = NULL` and no covered row is skipped.

---

## 1 · SCHEMA DELTA

```bash
pnpm migration:new "package anchor role and cascade indexes"
pnpm migration:new "package credit options and policy"
pnpm migration:new "package credit spend ledger"
```

Every `ADD CONSTRAINT` is preceded by `DROP CONSTRAINT IF EXISTS` — Postgres has no `ADD CONSTRAINT IF NOT EXISTS`, and the recorded "migrations auto-apply unreliably, re-run to verify" behaviour makes a 42710 on re-run a real outage. **[hardened: money]**

### M1 — `package_anchor_role_and_cascade_indexes`

```sql
BEGIN;

ALTER TABLE public.event_vendors
  ADD COLUMN IF NOT EXISTS package_role TEXT,
  -- NEW: the delete key. Prose-only in the draft; no migration created it.  [hardened: data-model]
  ADD COLUMN IF NOT EXISTS package_item_id UUID
    REFERENCES public.vendor_package_items(item_id) ON DELETE RESTRICT;

ALTER TABLE public.event_vendors DROP CONSTRAINT IF EXISTS event_vendors_package_role_ck;
ALTER TABLE public.event_vendors ADD CONSTRAINT event_vendors_package_role_ck
  CHECK (package_role IS NULL OR package_role IN ('anchor','covered'));

ALTER TABLE public.event_vendors DROP CONSTRAINT IF EXISTS event_vendors_covered_rows_carry_no_money;
ALTER TABLE public.event_vendors ADD CONSTRAINT event_vendors_covered_rows_carry_no_money
  CHECK (package_role IS DISTINCT FROM 'covered'
         OR (total_cost_php IS NULL AND deposit_paid_php IS NULL));

CREATE UNIQUE INDEX IF NOT EXISTS event_vendors_one_anchor_per_booking_uniq
  ON public.event_vendors (event_vendor_package_id)
  WHERE package_role = 'anchor' AND archived_at IS NULL;

-- One covered row per package item per booking → the safe delete key.
CREATE UNIQUE INDEX IF NOT EXISTS event_vendors_one_covered_per_item_uniq
  ON public.event_vendors (event_vendor_package_id, package_item_id)
  WHERE package_role = 'covered' AND archived_at IS NULL;

-- BLOCKER 1 — marketplace pick.
DROP INDEX IF EXISTS public.event_vendors_unique_marketplace_pick_per_event;
CREATE UNIQUE INDEX event_vendors_unique_marketplace_pick_per_event
  ON public.event_vendors (event_id, marketplace_vendor_id)
  WHERE marketplace_vendor_id IS NOT NULL AND archived_at IS NULL
    AND package_role IS DISTINCT FROM 'covered';

-- BLOCKER 2 — hard-single slot. MISSED IN THE DRAFT.            [hardened: money]
DROP INDEX IF EXISTS public.event_vendors_hard_single_lock_uniq;
CREATE UNIQUE INDEX event_vendors_hard_single_lock_uniq
  ON public.event_vendors (event_id, hard_single_group)
  WHERE hard_single_group IS NOT NULL AND archived_at IS NULL
    AND package_role IS DISTINCT FROM 'covered'
    AND status IN ('contracted','deposit_paid','delivered','complete');

-- Free-tier cap counts EVENTS, not rows (20271001120000:87-92 is COUNT(*)).
CREATE OR REPLACE FUNCTION public.enforce_free_tier_booking_cap() -- SELECT COUNT(DISTINCT ev.event_id)
  ;

CREATE UNIQUE INDEX IF NOT EXISTS event_vendor_packages_one_lock_per_pkg_uniq
  ON public.event_vendor_packages (event_id, package_id) WHERE status = 'locked';

-- GUARD A — nobody writes an anchor's money except the credit RPC.   [hardened: money]
-- Closes updateVendorCosts (vendors/actions.ts:164-226), which today updates any
-- event_vendors row in the couple's event with a typed total and no package filter,
-- backed by the FOR ALL policy event_vendors_couple_write (20260513100000:35-40).
-- A typed "1" rewrites a ₱70,000 pending charge to the ₱50 floor.
CREATE OR REPLACE FUNCTION public.guard_package_anchor_price()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.package_role = 'anchor'
     AND NEW.total_cost_php IS DISTINCT FROM OLD.total_cost_php
     AND COALESCE(current_setting('setnayan.package_credit_rpc', true), 'off') <> 'on' THEN
    RAISE EXCEPTION 'package_anchor_price_is_derived: edit the package selections, not the total'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER event_vendors_guard_anchor_price
  BEFORE UPDATE OF total_cost_php ON public.event_vendors
  FOR EACH ROW EXECUTE FUNCTION public.guard_package_anchor_price();

-- GUARD B — an anchor with a live fee charge cannot be DELETEd.   [hardened: data-model]
-- booking_fee_charges.event_vendor_id is ON DELETE CASCADE (20270927120000:75-76), so a
-- stray delete hard-removes a PAID charge while booking_fee_ledger.fee_paid_total_centavos
-- keeps the money — a silent, audit-less desync.
CREATE OR REPLACE FUNCTION public.guard_package_anchor_delete()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.package_role = 'anchor' AND EXISTS (
    SELECT 1 FROM public.booking_fee_charges c
     WHERE c.event_vendor_id = OLD.vendor_id
       AND c.status IN ('pending','paid','waived_import','waived_free5')) THEN
    RAISE EXCEPTION 'package_anchor_has_live_fee_charge: release the package instead of deleting it'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END; $$;
CREATE TRIGGER event_vendors_guard_anchor_delete
  BEFORE DELETE ON public.event_vendors
  FOR EACH ROW EXECUTE FUNCTION public.guard_package_anchor_delete();

COMMIT;
```

### M2 — `package_credit_options_and_policy`

> ## 🚨 M2 CANNOT BE RUN AS WRITTEN — reconcile first (verified against prod 2026-07-26)
>
> M2 was drafted against `setnayan-platform-wt-first5 @ 5610d218a`, **before**
> `20271006413374` shipped `vendor_package_item_options`. That table now exists in prod, so:
>
> | M2 says | Shipped reality | Consequence |
> |---|---|---|
> | `CREATE TABLE IF NOT EXISTS vendor_package_item_options (…)` | the table **exists** | **SILENT NO-OP.** `pricing_basis`, `per_pax_delta_centavos` and `min_pax` are never created and the migration still reports success. |
> | `label`, `is_active` | `option_label`, `is_available` | wrong column names |
> | `unspent_credit_policy IN ('expire','refund')`, DEFAULT `'expire'` | `IN ('expiring','refundable')`, DEFAULT `'expiring'` | the ADD CONSTRAINT fails |
> | `price_delta_centavos` **SIGNED** | live `CHECK (price_delta_centavos >= 0)` | fails — **and see below** |
> | `item_id ON DELETE RESTRICT` | shipped `ON DELETE CASCADE` | not changed by an `IF NOT EXISTS` |
>
> **Use the SHIPPED names** (`option_label` / `is_available` / `'expiring'` / `'refundable'`).
> They are in prod, in `lib/package-credit.ts`, in `lib/vendor-packages.ts` and in the tests;
> the spec's names are a drafting artifact from before the table existed. Anything genuinely new
> (`pricing_basis`, `per_pax_delta_centavos`, `min_pax`, `requires_option_choice`,
> `is_archived`, `credit_price_centavos`, the gross/payable split, the ≤50% budget ceiling) must
> be an **`ALTER TABLE … ADD COLUMN IF NOT EXISTS`**, never a `CREATE TABLE`.
>
> ### ⛔ ONE OWNER DECISION IS BURIED HERE — signed deltas
>
> M2 marks `price_delta_centavos` and `per_pax_delta_centavos` **SIGNED**, i.e. an option may be
> NEGATIVE. Migration `20271006413374` refused exactly that on purpose, and said why:
>
> > *"A negative delta would be a **downgrade credit** — a genuinely different product decision
> > (it would let a REQUIRED line mint credit), so it is refused at the DB until an owner
> > explicitly asks for it."*
>
> So M2 silently reverses a deliberate, documented refusal on a **money** rule. **Do not
> implement signed deltas without the owner saying so in as many words.** Per-head upgrades
> (`pricing_basis='per_pax'`) do **not** require signed deltas and can ship without touching this.
>
> _(Reconciliation added 2026-07-26 after M1 + §6.4 landed. M2's own body below is unchanged.)_

Changes from the draft, all forced by the review:

```sql
BEGIN;

ALTER TABLE public.vendor_packages
  ADD COLUMN IF NOT EXISTS unspent_credit_policy TEXT NOT NULL DEFAULT 'expire';
ALTER TABLE public.vendor_packages DROP CONSTRAINT IF EXISTS vendor_packages_unspent_policy_ck;
ALTER TABLE public.vendor_packages ADD CONSTRAINT vendor_packages_unspent_policy_ck
  CHECK (unspent_credit_policy IN ('expire','refund'));

-- STRICT, and ceilinged. `<=` let a vendor set budget = price; with policy='refund'
-- that yields payable ₱0 → booking_fee_centavos(0) = 0 → a permanent ₱0 fee on
-- every booking (20270927120000:46).                                  [hardened: money]
ALTER TABLE public.vendor_packages DROP CONSTRAINT IF EXISTS vendor_packages_budget_within_price;
ALTER TABLE public.vendor_packages ADD CONSTRAINT vendor_packages_budget_within_price
  CHECK (consumable_budget_centavos * 2 <= total_price_centavos);   -- pool ≤ 50% of price

-- Options now carry a pricing basis. A flat delta cannot express "premium
-- delicacy, +₱150/head", the normal PH catering upgrade.        [hardened: data-model]
CREATE TABLE IF NOT EXISTS public.vendor_package_item_options (
  option_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id              UUID NOT NULL REFERENCES public.vendor_package_items(item_id) ON DELETE RESTRICT,
  label                TEXT NOT NULL CHECK (char_length(label) BETWEEN 1 AND 120),
  description          TEXT CHECK (description IS NULL OR char_length(description) <= 500),
  pricing_basis        TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_basis IN ('fixed','per_pax')),
  price_delta_centavos BIGINT NOT NULL DEFAULT 0,      -- SIGNED, basis='fixed'
  per_pax_delta_centavos BIGINT NOT NULL DEFAULT 0,    -- SIGNED, basis='per_pax'
  min_pax              INTEGER NOT NULL DEFAULT 0 CHECK (min_pax >= 0),
  is_default           BOOLEAN NOT NULL DEFAULT FALSE,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  display_order        INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- item_id is RESTRICT, not CASCADE: the draft paired item CASCADE with a spends
-- RESTRICT and a spends `item_id ON DELETE SET NULL` that immediately violated
-- spend_target_matches_kind. Those three could never all hold.  [hardened: data-model]

CREATE UNIQUE INDEX IF NOT EXISTS vendor_package_item_options_one_default_uniq
  ON public.vendor_package_item_options (item_id) WHERE is_default AND is_active;
ALTER TABLE public.vendor_package_item_options
  DROP CONSTRAINT IF EXISTS vendor_package_item_options_default_is_baseline;
ALTER TABLE public.vendor_package_item_options
  ADD CONSTRAINT vendor_package_item_options_default_is_baseline
  CHECK (NOT is_default OR (price_delta_centavos = 0 AND per_pax_delta_centavos = 0));

-- An option group with no live default must force a choice, else the lock proceeds
-- with NO selection for a "pick 1 of 3" group (deactivating the default silently
-- empties one_default_uniq).                                     [hardened: data-model]
ALTER TABLE public.vendor_package_items
  ADD COLUMN IF NOT EXISTS requires_option_choice BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;  -- soft-delete

-- Catalogue spends need a vendor-COMMITTED price. starting_price_php is the synced
-- FLOOR ("min bracket / per_pax×min_pax / hour_base", 20270502342558:51,83), never a
-- committed price — debiting credit against it is exactly the failure we set out to
-- delete, moved one table over.                                  [hardened: data-model]
ALTER TABLE public.vendor_services
  ADD COLUMN IF NOT EXISTS credit_price_centavos BIGINT
    CHECK (credit_price_centavos IS NULL OR credit_price_centavos > 0);
COMMENT ON COLUMN public.vendor_services.credit_price_centavos IS
  'Vendor-committed price when this service is bought with package credit. NULL = not '
  'spendable (the default). Never derived from starting_price_php, which is a floor.';

-- Booking money. gross is the CONTRACTED value and the fee base; payable is what the
-- couple owes after a refund. Splitting them stops a refund from erasing the fee.
ALTER TABLE public.event_vendor_packages
  ADD COLUMN IF NOT EXISTS credit_spent_centavos     BIGINT NOT NULL DEFAULT 0 CHECK (credit_spent_centavos >= 0),
  ADD COLUMN IF NOT EXISTS overspend_centavos        BIGINT NOT NULL DEFAULT 0 CHECK (overspend_centavos >= 0),
  ADD COLUMN IF NOT EXISTS pending_overspend_centavos BIGINT NOT NULL DEFAULT 0 CHECK (pending_overspend_centavos >= 0),
  ADD COLUMN IF NOT EXISTS refunded_unspent_centavos BIGINT NOT NULL DEFAULT 0 CHECK (refunded_unspent_centavos >= 0),
  -- LOCK SNAPSHOT: the engine must never re-read vendor_packages after lock.  [hardened: data-model]
  ADD COLUMN IF NOT EXISTS locked_total_price_centavos      BIGINT,
  ADD COLUMN IF NOT EXISTS locked_consumable_budget_centavos BIGINT,
  ADD COLUMN IF NOT EXISTS locked_is_consumable_flexible    BOOLEAN,
  ADD COLUMN IF NOT EXISTS locked_unspent_credit_policy     TEXT,
  ADD COLUMN IF NOT EXISTS locked_pax                       INTEGER,
  ADD COLUMN IF NOT EXISTS locked_hours                     NUMERIC,
  ADD COLUMN IF NOT EXISTS gross_total_centavos BIGINT
    GENERATED ALWAYS AS (total_locked_centavos + overspend_centavos) STORED,
  ADD COLUMN IF NOT EXISTS payable_total_centavos BIGINT
    GENERATED ALWAYS AS (total_locked_centavos + overspend_centavos - refunded_unspent_centavos) STORED;

ALTER TABLE public.event_vendor_packages DROP CONSTRAINT IF EXISTS event_vendor_packages_payable_non_negative;
ALTER TABLE public.event_vendor_packages ADD CONSTRAINT event_vendor_packages_payable_non_negative
  CHECK (total_locked_centavos + overspend_centavos - refunded_unspent_centavos >= 0);
ALTER TABLE public.event_vendor_packages DROP CONSTRAINT IF EXISTS event_vendor_packages_credit_xor_overspend;
ALTER TABLE public.event_vendor_packages ADD CONSTRAINT event_vendor_packages_credit_xor_overspend
  CHECK (remaining_consumable_centavos = 0 OR overspend_centavos = 0);

-- RLS gap: vendor TEAM admins can write the package header (20260822000000:42-43)
-- but not its items → package authoring is impossible for a team admin today.
CREATE POLICY vendor_package_items_team_admin ON public.vendor_package_items
  FOR ALL TO authenticated
  USING (package_id IN (SELECT package_id FROM public.vendor_packages
         WHERE vendor_profile_id IN (SELECT public.current_vendor_profile_ids())))
  WITH CHECK (package_id IN (SELECT package_id FROM public.vendor_packages
         WHERE vendor_profile_id IN (SELECT public.current_vendor_profile_ids())));

-- Authoring-time hard-single guard (function body as drafted).
CREATE TRIGGER vendor_package_items_no_hard_single_dupes
  BEFORE INSERT OR UPDATE OF canonical_service ON public.vendor_package_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_package_no_hard_single_dupes();

COMMIT;
```

### M3 — `package_credit_spend_ledger`

```sql
BEGIN;

CREATE TABLE IF NOT EXISTS public.event_vendor_package_spends (
  spend_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id          UUID NOT NULL REFERENCES public.event_vendor_packages(booking_id) ON DELETE CASCADE,
  event_id            UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  -- 'addon' is GONE from V1: vendor_service_addons.id is BIGSERIAL
  -- (20270426250948:96) so a UUID FK will not even compile, and every addon price
  -- is a "from ₱X" (:106) so the kind was unspendable anyway.   [hardened: data-model]
  kind                TEXT NOT NULL CHECK (kind IN ('option','catalogue')),
  option_id           UUID REFERENCES public.vendor_package_item_options(option_id) ON DELETE RESTRICT,
  vendor_service_id   UUID REFERENCES public.vendor_services(vendor_service_id)     ON DELETE RESTRICT,
  item_id             UUID REFERENCES public.vendor_package_items(item_id)          ON DELETE RESTRICT,
  label               TEXT NOT NULL CHECK (char_length(label) BETWEEN 1 AND 160),
  qty                 INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0 AND qty <= 99),
  unit_price_centavos BIGINT NOT NULL,          -- SIGNED, FROZEN at pick time
  line_total_centavos BIGINT NOT NULL,          -- SIGNED = qty × unit
  priced_for_pax      INTEGER,
  priced_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- pending_ack: an overspend line the vendor has not confirmed. Excluded from
  -- overspend_centavos and therefore from total_cost_php and the fee.  [hardened: money]
  status              TEXT NOT NULL DEFAULT 'selected'
                        CHECK (status IN ('selected','pending_ack','void')),
  acked_at            TIMESTAMPTZ,
  created_by_user_id  UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT spend_target_matches_kind CHECK (
    (kind='option'    AND option_id IS NOT NULL AND vendor_service_id IS NULL AND item_id IS NOT NULL) OR
    (kind='catalogue' AND vendor_service_id IS NOT NULL AND option_id IS NULL)),
  CONSTRAINT spend_line_total_is_qty_times_unit CHECK (line_total_centavos = qty * unit_price_centavos)
);

CREATE UNIQUE INDEX IF NOT EXISTS package_spends_one_option_per_item_uniq
  ON public.event_vendor_package_spends (booking_id, item_id)
  WHERE kind='option' AND status IN ('selected','pending_ack');
CREATE UNIQUE INDEX IF NOT EXISTS package_spends_one_service_uniq
  ON public.event_vendor_package_spends (booking_id, vendor_service_id)
  WHERE kind='catalogue' AND status IN ('selected','pending_ack');

-- SCOPE FENCE. The active-target check now runs ONLY on INSERT or when the target
-- changes — the draft ran it on every UPDATE, so a vendor deactivating one option
-- made voidSpend, updateSpendQty AND releasePackage throw: the vendor could trap the
-- couple's booking forever.                                       [hardened: data-model]
CREATE OR REPLACE FUNCTION public.enforce_package_spend_vendor_scope()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_pkg_vendor UUID; v_target_vendor UUID; v_active BOOLEAN; v_check_active BOOLEAN;
BEGIN
  v_check_active := (TG_OP = 'INSERT')
    OR (NEW.option_id IS DISTINCT FROM OLD.option_id)
    OR (NEW.vendor_service_id IS DISTINCT FROM OLD.vendor_service_id);
  IF TG_OP = 'UPDATE' AND NEW.status = 'void' THEN v_check_active := FALSE; END IF;
  -- …resolve v_pkg_vendor / v_target_vendor / v_active as drafted…
  IF v_target_vendor IS NULL OR v_target_vendor <> v_pkg_vendor THEN
    RAISE EXCEPTION 'package_spend_out_of_scope: credit can only be spent on this vendor''s own catalogue'
      USING ERRCODE='check_violation'; END IF;
  IF v_check_active AND v_active IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'package_spend_inactive_target: that item is no longer offered'
      USING ERRCODE='check_violation'; END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER package_spends_vendor_scope
  BEFORE INSERT OR UPDATE ON public.event_vendor_package_spends
  FOR EACH ROW EXECUTE FUNCTION public.enforce_package_spend_vendor_scope();

ALTER TABLE public.event_vendor_package_spends ENABLE ROW LEVEL SECURITY;
-- couple FOR ALL on current_couple_event_ids(); vendor SELECT + vendor UPDATE-ack-only
-- on their own package; plus the new event_vendor_packages vendor SELECT policy
-- (vendors have zero read on that table today).

COMMIT;
```

`customizations_json` keeps `{ removed_item_ids }` and **drops the `{ v: 2 }` tag** — no reader branches on it (`budget.ts:353-357`, `[bookingId]/page.tsx:74-75`, `actions.ts:371-372` all destructure unconditionally, and `actions.ts:157` persists the client object verbatim). A version nobody switches on is worse than none. Instead PR-3 adds **`parseCustomizations(json)`**, the single sanitising reader all three call sites move to (it drops unknown keys, so the client can no longer smuggle a blob through). **[hardened: data-model]**

---

## 2 · THE PURE CREDIT ENGINE — `apps/web/lib/package-credit.ts`

Three changes from the draft, all forced.

**(a) It reads the LOCK SNAPSHOT, never `vendor_packages`. [hardened: data-model]** The draft froze line prices but recomputed `base` from a live package re-read (the pattern at `actions.ts:346-360`). A vendor editing `total_price_centavos` from ₱1.4M → ₱1.6M after lock would move the couple's total by ₱200,000 on their next spend and fire an `amendment_delta` on a paid charge (`20270930120000:412-418`). Post-lock, `computePackageCredit` takes `snapshot: { totalPriceCentavos, consumableBudgetCentavos, isConsumableFlexible, unspentCreditPolicy, pax, hours }`. Pre-lock it takes the live package — that is the quote, and it is allowed to move.

**(b) Accrual resolves per-pax/per-hour items; it no longer delegates to `computeCustomization`. [hardened: data-model]** `computeCustomization` (`vendor-packages.ts:239-269`) sums only `replacement_value_centavos`, but `20270713100000` made items per-pax/per-hour capable and `resolvePackageLine`'s own header warns it "does NOT touch the existing flat call sites (computeCustomization …)". A ₱750,000 per-pax catering item has `replacement_value_centavos = 0`, so removing it would credit ₱0. Pinning the engine to that function would have canonised the bug. New:

```ts
resolvedItemValueCentavos(item, { pax, hours })  // = resolvePackageLine(item, {pax, hours})
```
…frozen onto `event_vendor_package_items_locked` values at lock. `computeCustomization` is still **not modified** (its two existing callers keep working), but test #12 no longer pins equality — it now asserts they *diverge exactly on non-fixed items*, so nobody "fixes" the drift by re-coupling them.

**(c) The refund is capped at the AUTHORED pool, not the grown one. [hardened: money]**

```
refunded = policy === 'refund'
  ? Math.min(remainingCredit, snapshot.consumableBudgetCentavos)   // ← authored, not pool
  : 0;
grossTotal   = base + ackedOverspend;
payableTotal = grossTotal - refunded;
```
Substituting `computeCustomization`'s two branches into the draft's `min(remainingCredit, base)` gave `payable = price − budget − removed` **identically under `flexible = TRUE` and `FALSE`** — so the "PR-5 hard-couples refund to flexible" mitigation prevented nothing, and at `removed = price − budget` it produced a **₱0 package** with a ₱0 fee. Capping at the authored budget restores `flexible = TRUE`'s documented contract ("money stays in the package, redirected", `vendor-packages.ts:230-233`): removals grow the *spendable* pool, they never become cash back.

Options get their **own signed resolver**, `optionDeltaCentavos(option, { pax })`. `resolvePackageLine` cannot be used for them — its fixed branch is `Math.max(0, …)` (`package-line-pricing.ts:101`) and reads `replacement_value_centavos`, a column options do not have, so every downgrade would resolve to ₱0 and the signed-delta model would be unreachable. **[hardened: data-model]**

`rejectUnspendable` additionally rejects a `kind='catalogue'` candidate whose `credit_price_centavos IS NULL`, and rejects any option on an item where `requires_option_choice = TRUE` but no live default exists and the couple picked nothing.

Invariants pinned: `remainingCredit × overspend === 0`; `payableTotal >= 0`; `grossTotal >= totalLocked`; `policy='expire' ⇒ payable === gross`; integers only.

---

## 3 · THE SPEND PATH, FILE BY FILE

### 3a · Authoring (vendor) — still the missing prerequisite

Unchanged in intent: **zero write path to `vendor_packages` / `vendor_package_items` exists in the repo** (all 19 call sites are `.select`), so PR-5 remains mandatory. Additions forced by the review:

- `deletePackageItem` is a **soft archive** (`is_archived = TRUE`), never a DELETE, once any booking references the item — M2's `ON DELETE RESTRICT` would otherwise surface a raw 23503 to the vendor. **[hardened: data-model]**
- `deleteService` in `vendor-dashboard/services/actions.ts` gets a friendly "this service is in an active package booking" branch for the same reason.
- `upsertItemOption` enforces ≥2 or 0 options, one live default *or* `requires_option_choice`, and a zero-delta default.
- `setCreditPrice` on the service editor — the vendor-committed `credit_price_centavos`.
- `unspent_credit_policy = 'refund'` is offered only with `is_consumable_flexible`; the copy is now honest: *"unspent allowance comes off the price, up to the ₱X you set."*

### 3b · Selection (couple)

As drafted, plus:

- `updateSpendQty` caps at **99** and any spend that pushes net above the pool lands `status='pending_ack'` — visible to the couple as *"waiting for {vendor} to confirm"*, invisible to the money. Without it a couple typing `999 × ₱25,000` mints a ₱2.5M overspend → an ~₱124,875 pending charge and a payment-instruction email **addressed to the vendor** (`booking_fee_upsert_vendor_order` mints the vendor-payer order, `20270930120000:90-99`). **[hardened: money]**
- **`removeItemFromPackage` is rewritten, not left alone** (the draft's non-goal #9 scoped it to the delete key only). Today it recomputes with `computeCustomization`, which knows nothing about spends, and writes `remaining_consumable_centavos` raw (`actions.ts:405-412`) — with the new XOR CHECK that throws 23514 as a raw Postgres string via `throw new Error(updateErr.message)`, and without it, it silently re-grants already-spent credit. It now routes through the same `recomputeAndPersist` helper as the spend actions, and it deletes on `(event_vendor_package_id, package_item_id) AND package_role='covered'` — the shipped `.eq('category', removedCategory)` (`:398-401`) can match the **anchor** whenever the package's `primary_canonical_service` shares a category with an item, and GUARD B now makes that impossible even if a future path tries. **[hardened: money + data-model]**

### 3c · Lock — what is written

Steps as drafted, with: the snapshot columns populated at step 8; the anchor's `package_item_id` set; anchor `total_cost_php = gross_total_centavos / 100`; and steps 8–13 inside the `SECURITY DEFINER` RPC `lock_vendor_package(...)`, which sets `setnayan.package_credit_rpc = 'on'` for its transaction so GUARD A lets it through.

---

## 4 · MONEY CORRECTNESS

### 4a · One number — restated

```
event_vendor_packages.gross_total_centavos    (GENERATED = total_locked + overspend_acked)
        ↓ ÷100, once, RPC-only
event_vendors[anchor].total_cost_php   →   booking_fee_open_lock_charge   →  ONE orders row

event_vendor_packages.payable_total_centavos  (= gross − refunded_unspent)
        ↓
what the couple owes the vendor, shown on the booking + budget as
a package line at gross/100 plus a negative "Unspent credit returned" line
```

**The fee base is the GROSS contracted value, not the net-of-refund number. [hardened: money]** With the draft's single number, a vendor authoring `budget = price` + `policy='refund'` produced `payable = 0 → booking_fee_centavos(0) = 0` (`20270927120000:46`) — a permanent ₱0 fee on ₱1.4M weddings. Splitting gross from payable, capping the refund at the authored budget (§2c) and ceilinging that budget at 50% of price (M2) bound the erosion at 2.5 points of the 5%, and a refund is now what it actually is: a vendor↔couple settlement, not a platform-fee reduction.

**This also deletes the `deposit_paid_php` clamp.** The draft's `Math.max(payable/100, depositPaid)` would have made `total_cost_php ≠ payable_total/100` with nothing recording the divergence — and since the fee RPC reads `COALESCE(round(ev.total_cost_php*100))` (`:137`), the 5% would have been charged on the *deposit*. `total_cost_php` now carries gross, which only ever moves down on a post-lock item removal; that path refuses with *"You've already paid ₱X to {vendor}; ask them to adjust the package before removing this."* rather than clamping. **[hardened: data-model]**

### 4b · Defect table (unchanged findings, all still fixed)

N charges → N vendor QR orders; wrong fee base (₱30,000 under-collected on the Sofitel shape); N× ₱50 floor; free-tier `COUNT(*)` over-count; 6× budget stamp — all collapse to one anchor. Free-5 ordinal correctly does **not** multiply (frozen on the ledger, `20270927120000:174-198`).

### 4c · Release / refund — resequenced

**The draft's release order left a collectible charge and let re-lock double-bill. [hardened: money + data-model]** `event_vendors_booking_fee_rederive` fires only `WHEN NEW.status IN ('contracted','deposit_paid','delivered','complete')` (`20270930120000:165-168`); the draft flipped status to `'considering'` *before* nulling the price, so the trigger never ran, the pending charge and its `orders` row stayed live, and `archived_at` (not DELETE) meant the `ON DELETE CASCADE` never cleaned up either. Then re-lock minted a **new** `vendor_id`, which `booking_fee_charges_one_live_primary_per_event_vendor` (`:74-78`) — keyed on `event_vendor_id` — does not see. Vendor billed 5% twice.

New release RPC, one transaction, in this order:

1. `UPDATE event_vendors SET total_cost_php = 0 WHERE package_role='anchor'` — **status still `'contracted'`**, so the trigger runs its `pending_cleared_zero` path (`20270930120000:263-273`) and cancels the order.
2. Explicitly expire any charge still live for that `event_vendor_id`.
3. Void every spend (`status='void'`; the scope trigger now permits it — see M3).
4. Reset the booking: `remaining_consumable_centavos = locked_consumable_budget_centavos`, all four money columns to 0.
5. `status='considering'`, `archived_at = NOW()` on anchor + covered rows — the draft's own fix for "released vendor can't be re-added", now safely after the trigger has done its work.
6. Anchor `total_cost_php = NULL`.

**Budget rendering — assertion 7 restated. [hardened: money + data-model]** `budget.ts:374-386` builds lines from `replacement_value_centavos/100`, which for the Sofitel seed sums to ₱800,000 against a ₱1.4M `total_locked` — the item list can never sum to the payable. The anchor now stamps **one** priced line at `gross_total_centavos/100` (+ a negative refund line when present); the kept-item list becomes display-only on the package detail page. And covered rows do **not** simply `continue` — they must occupy their lookup key:

```ts
if (ev.package_role === 'covered') { lookup.set(ev.vendor_id, { priceSource: 'package', items: [] }); continue; }
```
Bare `continue` would leave them in `serviceCandidates = marketplaceVendors.filter(v => !lookup.has(v.vendor_id))` (`budget.ts:398-400`), and each covered row whose category matches an active `vendor_services` row would stamp a phantom *"Service fee — <Category>"* line (`:436-456`) **on top of** the package price.

---

## 5 · THE HARD-SINGLE COLLISION

Three cases now, not two.

**Case 0 (NEW) — the anchor vs. its own covered row.** Fixed structurally by the `hard_single_lock_uniq` rebuild in M1 and by the anchor absorbing its matching item rather than duplicating it. **[hardened: money]**

**Case 1 — one package includes two items in the same hard-single group.** Rejected at authoring (pure `hardSingleCollisions` + M2 trigger). `reception_venue` + `ceremony_venue` remain legal — different groups (`20261210000000:80-95`); don't over-block.

**Case 2 — the couple already has that category confirmed.** Shared `lib/hard-single-conflict.server.ts`, plural `hard_single_conflict`, all-or-nothing Switch inside the lock RPC's transaction. Unchanged.

---

## 6 · TEST PLAN

### Pure — `apps/web/lib/package-credit.test.ts`

Draft cases 1–11 and 13 stand, with these corrections:

- **#2 rewritten:** `refund` + no spends → `payable === base − min(pool, authoredBudget)`, and with `flexible=TRUE` + ₱1,000,000 of removals the payable is **`base − authoredBudget`, never ₱0**. Red against the draft formula.
- **#12 replaced:** `computePackageCredit` and `computeCustomization` must **diverge** on a per-pax item (`per_pax_price_centavos=250000`, 300 pax, `replacement_value_centavos=0`): the engine credits ₱750,000, `computeCustomization` credits ₱0. Pinning equality was the bug.
- **NEW #14:** post-lock, mutating the live `vendor_packages` row changes nothing — the engine reads the snapshot.
- **NEW #15:** `optionDeltaCentavos` returns a **negative** value for a downgrade; `resolvePackageLine` on the same input returns 0 (regression guard against re-routing options through it).
- **NEW #16:** a spend pushing net above pool is classified `pending_ack` and contributes 0 to `gross`.

### DB — `apps/web/tests/db/vendor-package-cascade.db.test.ts`

Harness unchanged (PGlite replay, `setAuthUid`, vendor seeded `verification_state='verified'` or `lockPackage:141-146` gives a false pass). Draft assertions 1/1b/2/3/5/6/8/9/10/12/13 stand. Changed and added:

| # | assertion |
|---|---|
| 1 | **now also asserts no `hard_single_lock_uniq` violation** when `primary_canonical_service` duplicates a kept item (the Sofitel shape). Red on `main` **and** red against the draft M1. |
| 4 | one live charge, one `orders` row, `amount_charged === booking_fee_centavos(gross_total_centavos)` — **gross**, not payable. |
| 7 | budget returns **one** priced line = `gross/100`, plus a refund line when applicable, and **zero** phantom "Service fee" lines for covered rows. |
| 11 | **replaced:** a post-lock removal that would drop gross below `deposit_paid_php` returns a friendly refusal — no 23514, no clamp. |
| 14 | **NEW** — vendor deactivates the chosen option → `voidSpend`, `updateSpendQty` and **`releasePackage` all still succeed**. |
| 15 | **NEW** — release then re-lock produces **exactly one** live primary charge and one `orders` row for that (vendor, event). |
| 16 | **NEW** — `updateVendorCosts` against an anchor row raises `package_anchor_price_is_derived`; against a non-package row it still works. |
| 17 | **NEW** — `removeItemFromPackage` on a booking with live spends preserves `credit_spent_centavos`, never violates the XOR CHECK, and deletes only the covered row (anchor survives; `DELETE` on an anchor with a live charge raises `package_anchor_has_live_fee_charge`). |
| 18 | **NEW** — `vendor_packages` with `consumable_budget = total_price` is rejected at authoring by the 50% ceiling. |
| 19 | **NEW** — a `catalogue` spend against a service with `credit_price_centavos IS NULL` is rejected; `starting_price_php` is never read as a price. |
| 20 | **NEW** — every migration re-runs clean (idempotency; catches the 42710 `ADD CONSTRAINT` class). |

---

## 7 · ORDERED PR BREAKDOWN

Behind `NEXT_PUBLIC_PACKAGE_CREDIT_ENABLED`. Fragments at **repo-root `changelog.d/`**. Auto-merge default.

| # | title | contents | risk |
|---|---|---|---|
| **1** | `fix(packages): anchor role — unblock the cascade` | M1 (both index rebuilds, `package_item_id`, both guards, free-tier `COUNT(DISTINCT)`) + DB assertions 1/1b/5/6/16. | Rebuilds **two** live uniqueness indexes; both predicates only narrow and prod has 0 package rows, but re-verify `finalizeVendor`'s Switch flow after merge. |
| **2** | `fix(vendors): stop manual edits of derived package totals` | `updateVendorCosts` rejects `event_vendor_package_id IS NOT NULL`; friendly copy. Pairs with GUARD A. | Small; touches a live couple-facing form. |
| **3** | `feat(packages): options, policy, snapshot, credit price` | M2 + `vendor_services.credit_price_centavos` + `requires_option_choice` + team-admin RLS. DB 18. | The team-admin policy widens who can edit items — scope to `current_vendor_profile_ids()`, never bare `authenticated`. |
| **4** | `feat(packages): pure credit engine` | `lib/package-credit.ts`, `parseCustomizations`, full pure suite. Dead code until PR-7. | None; unreferenced. Reviewer confirms `computeCustomization` is byte-unchanged. |
| **5** | `feat(packages): credit spend ledger` | M3 + scope trigger + RLS. DB 9/13/14/19. | `ON DELETE RESTRICT` on services/items — PR-6's editor must surface it as English, not an FK code. |
| **6** | `feat(vendor): package builder — the first authoring surface` | `/vendor-dashboard/packages/**`, 11 pricing-basis columns on `VendorPackageItemRow`, soft-archive delete, `hardSingleCollisions`, credit-price + policy editors, overspend-ack inbox. DB 2. | Largest surface and the first-ever write path to `vendor_packages`. |
| **7** | `feat(packages): couple selection + anchored lock` | `lock-modal` rewrite (opt-in fix, option radios, credit meter), `/spend` page, 4 spend actions, `lock_vendor_package` RPC, plural `hard_single_conflict`. DB 3/8. | The one hard-to-reverse change; greenfield is the whole mitigation. |
| **8** | `feat(packages): gross/payable money wiring` | One `collectBookingFeeAtLock` on the anchor; resequenced release RPC; `removeItemFromPackage` rewrite; budget one-line + covered-key occupation. DB 4/7/11/12/15/17/20. | Touches the live fee engine — keep `collectBookingFeeAtLock` fail-soft (`booking-fee-lock.server.ts:29-33`); a fee hiccup must never roll back a committed lock. |

**Flip order:** 1–5 inert. 6 can flip alone. 7+8 flip together.

---

## 8 · EXPLICIT NON-GOALS

1. **No new payment rail.** Overspend rides `event_vendors.total_cost_php` → existing manual GCash/BDO orders. Setnayan never holds vendor money.
2. **No `vendor_change_orders` for spends — but overspend now requires a one-click vendor ACK. [hardened: money]** Amends the draft's flat "no vendor in the loop": in-pool spending stays fully self-serve and instant; only a line that pushes the couple *above* the pool waits for the vendor's confirm. Without that a couple unilaterally mints a six-figure vendor bill. This is an ack, not a change order — no counter-offer, no negotiation, no scope document.
3. **No pricing-resolver unification.** Options get their own signed resolver (they must); package items use `resolvePackageLine`; both are frozen at lock.
4. **No live per-pax re-quote.** `locked_pax` / `locked_hours` are frozen; drift surfacing is V1.1.
5. **No discount × credit interaction.** Credit spends at the vendor's committed `credit_price_centavos`.
6. **No cross-vendor credit.**
7. **No re-adding a removed item.** Removal stays monotonic.
8. **No partial release.**
9. **No `kind='addon'` spends in V1.** `vendor_service_addons.id` is `BIGSERIAL` and every addon price is a "from ₱X" — the kind was unbuildable and unspendable.
10. **No booking-fee refund on release.** A *paid* charge stays paid; ops handles it. (A *pending* one is now correctly cleared — §4c.)
11. **No admin surface** for pools, spends, or policy overrides.
12. **No backfill.** Prod is 0 rows across `vendor_packages`, `vendor_package_items`, `event_vendor_packages`, `vendor_services` package usage.

---

## Owner decisions still open

1. **Does the 5% booking fee apply to money the vendor gives back?** A "refund" package returns the couple's unspent allowance. I've set the fee on the **full contracted price** (₱1.4M package with ₱200k unspent → we still bill 5% of ₱1.4M, not of ₱1.2M). The alternative — bill only what the couple actually pays — is defensible but lets a vendor design the fee down to near zero. Say which you want before PR-3.
2. **Should the allowance be capped at half the package price?** I set a hard rule that the spendable allowance can never be more than 50% of the price, purely to stop a vendor pricing our fee away. If you'd rather trust vendors and drop the cap, that's a one-line change now and a data migration later.
3. **"Use it or lose it" is the default.** A vendor who never touches the setting keeps unspent allowance. If you'd rather the default be "give it back", say so before PR-3 — changing a default after packages exist is a migration.
4. **Should overspend really wait for the vendor's OK?** Today the couple can add extras beyond their allowance and it becomes a bill the vendor is charged commission on. I've made anything above the allowance wait for the vendor to press "confirm". That adds one step; the alternative is a couple being able to run up a vendor's bill (and our fee) without them agreeing.
5. **Booking fees already paid, when a couple releases a package.** There is no refund path built. Someone has to hand it back manually, or we keep it. Needs a rule.
6. **Vendors currently cannot see what a couple removed from their own package.** I've opened read access as part of this build. Confirm that's what you want — it's a new visibility.

## Residual risks

- **Migration-order fragility.** Eight PRs, three migrations, and the recorded "migrations auto-apply unreliably" behaviour. If M1 lands and M2/M3 don't, nothing breaks (M1 is inert), but PR-7 against a half-applied schema fails at runtime, not at build. Verify `list_migrations` after every migration merge.
- **`event_vendors` is now carrying a lot.** Anchor/covered role, hard-single group, marketplace pick, booking fee, budget, plan grid — six concerns on one table with four partial unique indexes and three triggers. Each new predicate is another way for an unrelated flow (`finalizeVendor`, `deleteVendor`, guest-count confirm) to hit an index it wasn't written for. PR-1 must be smoke-tested against the ordinary Save-a-Vendor path, not only the package path.
- **GUARD A is GUC-based.** Any future server action that legitimately needs to move an anchor price must set `setnayan.package_credit_rpc`; forgetting it produces a confusing refusal rather than a wrong number — the safe failure, but a support call.
- **Vendor-authored `credit_price_centavos` may simply not get filled in.** If vendors leave it NULL, the catalogue-spend surface — the actual feature request — is empty and the couple is back to "talk to your vendor". Mitigation is onboarding copy in PR-6, not code.
- **The overspend ack adds a vendor SLA we don't enforce.** A vendor who never presses confirm leaves the couple's extra in limbo indefinitely. No reminder, no timeout, no escalation in V1.
- **Greenfield is the whole safety story.** Every "safe because prod has 0 rows" claim expires the moment PR-6 ships and a real vendor authors a package. PR-7 and PR-8 must land before, not after, that happens — or they need a real migration plan.
- **`is_consumable_flexible` semantics are now genuinely subtle** (grows the spendable pool, never the refundable amount). Two reviewers independently got the algebra wrong. Expect the vendor-facing copy to be wrong at least once.
