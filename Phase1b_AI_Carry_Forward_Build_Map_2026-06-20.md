# Phase 1b — Setnayan AI Category Requirements Carry-Forward · Build Map

> Read-only map 2026-06-20 for `Vendor_Transaction_Lifecycle_2026-06-20.md` Phase 1b. Net-new feature. **Blocked on one product decision (§f).**

## Core finding
Carry-forward / requirements-profile / inquiry-prefill logic does **not exist** today. The scaffolding to build it does (clean, copyable patterns). **The blocker: there is no structured place a customer enters per-category requirements** — `apps/web/app/v/[slug]/_components/inquiry-composer.tsx` collects only service checkboxes + a hard-coded canned `INQUIRY_BODY`; the vendor thread view (`apps/web/app/vendor-dashboard/messages/[threadId]/page.tsx:49`) shows only `display_name` + `event_date` + interest chips. So "capture what the customer tells a vendor" has nothing structured to capture. The machinery (PR-1..3) is buildable now but carries nothing until a capture surface (PR-4 / §f) exists.

## AI gate (reuse as-is)
`isSetnayanAiActive(event)` — `apps/web/lib/setnayan-ai.ts:45-54` (the single governing gate; reads `events.setnayan_ai_active` + `planning_mode`). Precedent: `build-3state-actions.ts:218`, `vendors/page.tsx:466,501`, `_actions/category-search.ts:230`. Carry-forward gates on this; AI-off ⇒ skip entirely.

## Inquiry paths (capture + carry hooks)
Two entry points, both already write `thread_service_interests`:
- Public: `startServiceInquiry` — `apps/web/app/v/[slug]/inquiry-actions.ts:46-267` (needs to add `setnayan_ai_active`/`planning_mode` to its event lookup).
- Dashboard auto-inquiry: `apps/web/app/dashboard/[eventId]/vendors/_actions/unlock-category.ts:160-227`.
- `startThreadByVendorEmail` (`messages/actions.ts:52`) records no interests — out of scope for v1.

## Category keying
Key on the **leaf** canonical service key (`vendor_services.category`, e.g. `photography`) — NOT the coarse `resolveVendorCategory` enum (that bleeds photography→videography). Available at inquiry time (`inquiry-actions.ts:97,104`; `unlock-category.ts:140`). Matches `thread_service_interests.category_key` + `event_vendor_preferences.canonical_service`.

## Data model (recommended: new table; mirror event_vendor_preferences)
`event_category_requirements (event_id, canonical_service, requirements JSONB, source_thread_ids UUID[], updated_at, created_at, PK(event_id, canonical_service))`, migration slot `20270131000000+`. **RLS = host-scoped event Pattern** copied verbatim from `event_vendor_preferences` (`supabase/migrations/20260721000000:55-75`): SELECT + ALL `USING (event_id IN (SELECT current_event_ids()) OR is_admin())`. **Privacy is structural:** keyed only on event_id, no `current_vendor_*` predicate ⇒ vendors literally cannot read it. (Don't overload `event_vendor_preferences` — it has a live facet-match semantic.)

## Hooks
- **Capture:** new `apps/web/lib/category-requirements.ts` (`get`/`getAll`/`upsert`, graceful-degrade on 42P01/42703 like `event-preferences.ts`); call `upsert` after `recordThreadInterests` in both inquiry paths, AI-gated, MERGE not overwrite, append threadId to source_thread_ids.
- **Carry-forward:** in `startServiceInquiry` (+ unlock-category), when AI-on + new thread + same category + a requirements row exists → inject into the inquiry (append a "What we're looking for" block to the body and/or a structured panel the vendor thread renders). AI-off ⇒ skip.
- **Privacy:** carry-forward sources ONLY `event_category_requirements`, never `vendor_proposals`/vendor messages. Add a test asserting no vendor-authored row feeds the payload.

## PR slices
- PR-1: migration + lib (dormant, zero behavior change).
- PR-2: capture (write-only, AI-gated, DB-verifiable).
- PR-3: carry-forward injection (first user-visible; + privacy test).
- PR-4: capture UI + vendor "Their requirements" panel — **depends on §f**.

## §f — OWNER DECISIONS (blocking)
1. **⚠ What is a "requirement" + where does the customer enter it?** No structured capture exists today. Options: **(A)** add a free-text "Tell the vendor what you're looking for" textarea to the inquiry composer; **(B)** structured per-category intake form (reuse `canonical_service_schemas`) — most on-spec; **(C)** extract from the customer's chat messages. Recommend **B** (richest, on-spec) or **A** (minimum viable). PRs 1-3 are useless until this is chosen + PR-4 built.
2. Carry-forward only the 2 marketplace inquiry paths (recommend), or also `startThreadByVendorEmail`?
3. Carrier: appended message text (ships now) vs structured vendor panel (cleaner; needs new surface).

---

## ⭐ AS-BUILT REALITY (2026-06-20 deep map) — the matching system already exists, DORMANT

There are **two parallel "refinement" systems, never unified:**
1. **`onboarding_refinements` + `onboarding_refinement_options`** — couple-facing carousel catalogue, admin-managed via **`/admin/refinements`** (LIVE), keyed by `leaf_key`. Captured into `events.style_preferences.refinements` = **DISPLAY-ONLY, never feeds matching.**
2. **`canonical_service_schemas` (field schema, admin via /admin/taxonomy) + `vendor_service_attributes` (vendor=offers) + `event_vendor_preferences` (customer=wants)** — THE matching schema, compared by **`preference-match.ts`** (the refinement dim = 0.30 of `compat-score.ts`'s 6 dims). This IS the owner's "one schema, vendor offers / customer wants" vision — but: **`event_vendor_preferences` has ZERO writers (dormant)** and **`vendor_service_attributes` is EMPTY in prod.** The engine is wired but starved of data.

### Revised plan — REUSE the dormant system, don't build new
- **Admin field definitions = `canonical_service_schemas.category_specific_attributes`** (already admin-editable + public-read). Extend with the checkbox-options + special-request-freeform the pop-up needs (or a sibling table keyed by the SAME `canonical_service`). Do NOT extend `onboarding_refinements` (wrong key: `leaf_key` ≠ `canonical_service`). Don't build a 3rd admin field surface.
- **Customer side = REUSE `event_vendor_preferences`** (per-(event, canonical_service) JSONB, host-RLS, matcher already reads it, zero writers to disturb). Add `special_request TEXT` + `auto_send BOOLEAN`. The inquire pop-up becomes its first writer → **this lights up the matching that's currently inert.**
- **Vendor side = REUSE `vendor_service_attributes`** (vendor marks offered). Launch dependency: it's EMPTY — matching float stays inert until vendors tag their services.
- **AI gate = ranking/intelligence ONLY** (codebase precedent confirmed: capture was NEVER gated; `aiActive` only changes ordering/display — `build-3state-actions.ts:218`, `category-search.ts:230`). So: **FREE** = pop-up render + save to `event_vendor_preferences` + shortlist icon + basic overlap float (already runs for all via `matchEventId`). **AI-GATED** = carry-forward auto-propagation to the next same-category inquiry (gate at the pre-fill read path, not the capture). Customer `auto_send` checkbox works for all; AI makes it automatic/smarter.
- **Onboarding refinements = SAFE to remove** (confirmed cosmetic: written to `style_preferences`, never read by the matcher; reads null-safe). KEEP the category picks (drive plan groups + budget checklist) + `event_song_picks` (the one live demand signal). Leave the 3 projectable defaults for recap display.

### Risks / breaks to handle
1. **`vendor_service_attributes` empty in prod** → refinement match float is inert until vendors tag services (same blocker the existing system already has; surface as launch dependency — vendors must fill refinements).
2. **`event_vendor_preferences.canonical_service` FK → `canonical_service_schemas`** — the pop-up's leaf category MUST map to a `canonical_service` (via `canonical_service_taxonomy.tile_id`/`service_categories` bridges) or the upsert fails. **#1 most likely break.**
3. `projectRefinementsToPrefs` (`onboarding-shell.tsx:538`) + recap read `prefs` for ceremony/cuisine/pv display — keep the 3 defaults or recap shows blanks (cosmetic).
4. Long-term: fold the `/admin/refinements` carousel into the `canonical_service_schemas` schema so admin defines fields ONCE (don't leave two admin field systems).
