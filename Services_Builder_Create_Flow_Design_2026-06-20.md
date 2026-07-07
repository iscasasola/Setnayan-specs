# Vendor Services Builder → Guided "Create a Service" Flow — Build Spec
Date: 2026-06-20 · Owner-approved (build in one pass · KEEP the old card as a quick-tweak path) · branch `claude/services-create-flow`
Origin: code-grounded redesign workflow (3 readers + 3 competing designs + judge synthesis) vs `apps/web` @ origin/main.

## Why
Services builder is the hardest vendor surface (diff 5) and — per owner — THE determining factor for vendor retention. Today one service "card" renders **FOUR independent server-action forms**, each with its own save button writing a different table with **no shared transaction** (`updateVendorService` / `setServiceLinks` / `setServicePaymentSchedule` / time-slots). Editing two sections + tapping one save silently drops the other's edits; the two replace-all sets do delete-then-insert as separate awaited calls ("atomically-enough") so a mid-failure wipes the set. There is no `/new` route (create is an inline `?add=<cat>` form) and `onboarding-shell.tsx` is a 4,640-line wedding monolith with ZERO exported stepper — it must be pattern-extracted, not imported.

## Architecture decision (improves on the workflow's full-SQL-RPC proposal)
**Validation stays in TypeScript** (reuse the existing `parse*` helpers in `actions.ts` — single source of truth, no SQL/TS drift, which the workflow itself flagged as the new sharpest edge). The RPC is a **thin atomic writer** that takes already-validated JSONB and writes service + links + schedule in ONE transaction (a function body is one implicit tx). It re-enforces only the cheap drift-free invariant — the publish gate. Tier caps stay in the TS action (as today). **Time-slots are NOT in the RPC** (Enterprise-only + booking-lock interactions via `acquire_service_time_slot`) — they keep their existing add/delete actions; the wizard's availability step writes `daily_capacity` (a `vendor_services` column, covered atomically), and Enterprise slot CRUD stays on the card.

## DONE
- ✅ Migration `20270208451790_save_vendor_service_atomic_rpc.sql` — `save_vendor_service(p_vendor_profile_id, p_service_id, p_fields jsonb, p_links jsonb, p_schedule jsonb, p_publish boolean) RETURNS uuid`. Upsert vendor_services (INSERT when p_service_id NULL = create, UPDATE = edit, ownership-scoped), publish-gate re-check, replace-all links + payment_schedules — all atomic. **NOT applied to prod** (owner go-live step).

## TO BUILD (the UI half — this branch)
1. **`commitVendorService(formData)` server action** (in `services/actions.ts`): reuse the existing `parse*` helpers (parseInt0OrNull, parseDiscountFields, parseDailyCapacityOrThrow, parseExclusivePerk, parseLeadTimeMonthsOrNull, parseSurchargePctOrNull, resolveBranchId) + the existing tier-cap block from `createVendorService` (servicesPerLeaf + parentCategories, founder override). Build the 3 JSONB args + call `supabase.rpc('save_vendor_service', …)`. `revalidatePath` + redirect to `?saved=1#service-<id>`. One action serves create (p_service_id null) AND edit. `p_publish` = "Publish" vs "Save as draft".
2. **Generic Stepper** `app/_components/stepper/` — purpose-built (~130 lines): a steps[] config + `canContinue(id,state)` + `draftKey` (single localStorage key, TTL hydrate/persist), `go()/goToId()`, activeId-derived `.active` section toggle (all sections in DOM). Pattern lifted from onboarding-shell; do NOT import it.
3. **Create route** `app/vendor-dashboard/services/new/[category]/page.tsx` (+ bare `new/page.tsx` starting at the category step). Client wizard composed from the Stepper.
4. **Edit route** `app/vendor-dashboard/services/[serviceId]/edit/page.tsx` — same wizard, hydrated from the row + child-table loaders (`lib/vendor-services.ts`), all steps unlocked + jumpable (`goToId`), category step read-only. Commits through the SAME action (UPDATE branch).
5. **Field components**: extract the inline helpers from `services/page.tsx` (LastMinuteFields, DiscountFields, ExclusivePerkField, BranchSelect) to `services/_components/fields/` so the wizard + card share them; reuse `PaymentScheduleEditor` + the SlotEditor field set.
6. **Rewire entry points** in `services/page.tsx`: left-rail picker links `?add=<cat>` → `/new/<cat>`; empty-state CTA → `/new`. **KEEP the existing card** (owner) as the quick-tweak edit path + add an "Edit in guided flow" deep-link to `/[id]/edit` (+ section anchors). Optionally route the card's 4 saves through the RPC so each is at least atomic-per-scope.

## The flow (7 steps · 3 required to publish · 1 transactional save)
1. **What are you selling?** — category (NOT-NULL wire enum, hidden-input today; read-only on edit) + optional title (≤80). Tier-cap pre-check on ENTER (servicesPerLeaf + parentCategories) → inline upgrade nudge + block advance. **required**
2. **How much?** — starting_price_php (blank = quote-on-request), crew_size, added_pax_price_php, crew_meal_required; collapsed "Add a discount" disclosure holds the 4 discount fields (promo-needs-expiry validated at commit). **required**
3. **Your Setnayan Exclusive** — exclusive_perk_text (≤500) + 2-3 example chips. THE publish gate. **required**
4. **What's included?** (optional) — multi-check the vendor's OTHER offered categories → links (cap 6). Auto-pruned when the vendor offers no other category. Fixes the real gap that links can't be set at create today.
5. **When are you free?** (optional) — ONE merged availability screen: "Bookings per day" = daily_capacity (capped by tier slotsPerDay); Enterprise-only "Use time slots instead" toggle (slots stay on existing actions; disables daily_capacity — the precedence made a visible either/or). Collapsed "Last-minute bookings" group (3 fields). Branch select for Enterprise-with-branches.
6. **Payment plan** (optional) — installment rows → payment_schedules (replace-all, seq from order). Placed last; fully skippable.
7. **Review & publish** — read-only recap + per-section Edit-jump (goToId). "Save as draft" (is_active=false) | "Publish" (is_active=true, disabled with inline reason unless perk non-empty). The ONE transactional submit → `commitVendorService`.

**Fewest steps to publish: 3** (category + price + perk; review/publish is the confirm).

## Honest difficulty impact
**5 → 3** (not 2). Fixed: silent-loss footgun gone on the wizard path (one tx); publish first-try-success (perk is a visible step); links settable at create. Residual keeping it at 3: the Stepper extraction is real UI surgery; the capacity-vs-slots two-models rule is inherent; **the old card retained (owner) keeps its lossy multi-form behavior on that path** — so the wizard is the *safe* path, the card the *fast-but-sharp* one. Going to 2 would require also retiring the card (owner chose to keep it).

## Risks / footguns
- RPC must be truly atomic (it is — single function body); never reintroduce delete-then-insert across separate awaits.
- Edit hydrate-then-submit must round-trip faithfully — submitting an empty links array because it failed to LOAD existing links would DELETE them (replace-all). Test "edit one field, don't touch links → links unchanged".
- Tier caps stay in the TS action (as today); don't duplicate the numbers in SQL.
- localStorage draft must NOT write the DB mid-flow (the row exists only at step 7) — no orphan draft rows.
- Prices are admin-managed for platform SKUs, but a VENDOR's `starting_price_php` is vendor-set — wizard writes the vendor figure only, no hardcoded platform price.

## Owner decisions captured
- Build in ONE pass (not phased). · KEEP the old all-at-once card as a quick-tweak path (footgun stays on that path; wizard is the safe path).
- exclusive-perk required-to-publish confirmed (it IS the existing publish gate).

## ADDENDUM — Listing vs Inquiry split (owner reframe, 2026-06-20)
Owner: "the service creation is basically a way to get couples started asking questions about their specific service — the inquiry is where they negotiate what's included and what's not." A code-grounded split confirmed the listing should be the generic MENU; the per-couple numbers already live in the inquiry/quote flow.

**The inquiry already owns (nothing to move):** the binding price = `event_vendors.total_cost_php` (set via the quote-bridge → `updateVendorCosts`); the added-guest surcharge APPLICATION (in-thread Adaptive-Pax vendor confirm, against the couple's headcount); the perk reveal (in-thread on accept); the tailored payment plan (frozen from the couple's total + date into `event_vendor_payment_plan` at lock — the listing only holds a reusable template).

**Stays on the upload (the menu):** category · title · starting/"from" price (teaser; "leave blank = quote on request") · crew size + crew-meal toggle · comes-with links · availability (daily_capacity / Enterprise slots) · the Setnayan Exclusive perk (publish gate) · branch (Enterprise).

**Owner rulings applied to the wizard (PR `claude/services-wizard-lean`):**
- DELETE the discount block — `vendor_services.discount_*` is write-only (no couple-facing reader anywhere) and duplicates the separate voucher/promo-code system. Removed from the wizard.
- TUCK `added_pax_price_php` + last-minute (`recommended_lead_time_months` / `last_minute_end_months` / `last_minute_surcharge_pct`) behind a closed-by-default "Pricing rules (advanced)" disclosure — listing defaults the inquiry resolves; never block publishing.
- Card price = "From ₱X" + "final quote in your inquiry" (owner-chosen).

**Honest gaps (flagged, not assumed):** (1) `last_minute_surcharge_pct` is collected but NO code applies it to a booking total — a default pending wiring into the quote/pax confirm. (2) Per-inquiry custom rate override (a different added-pax rate for one couple in-thread) does not exist — future product decision. (3) The legacy edit card still renders the (inert) discount form — left for a later card cleanup.

**Service-card anatomy (couple-facing hook — mostly platform-computed, not vendor-entered):** portfolio photo · the perk · comes-with · match badge (#1-for-you, leaf-match) · serves-your-area + available-on-your-date · specialties (refinements) · rating + review count (Bayesian Trust Score) · response time + rate · experience badge · verified check · from-price · social proof (inquired / booked / saved counts, MIN-N SUPPRESSED for the founder-only cold-start).
