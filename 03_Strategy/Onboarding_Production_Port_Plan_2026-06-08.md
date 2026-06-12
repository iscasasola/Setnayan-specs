# Onboarding Production Port Plan — Adaptive Redesign → Shipped Wedding Onboarding

> **Date:** 2026-06-08 · **Author:** lead engineer (port session) · **Status:** buildable spec, multi-session
> **Worktree (canonical, off `origin/main`):** `/Users/icecasasola/Setnayan/.claude/worktrees/onboarding-prod-port` (branch `onboarding-prod-port`)
> **Do NOT trust `~/apps/web`** — it is stale (467+ commits behind). All reads/edits below are off this worktree.
>
> **Inputs:** prototype `Onboarding_Wedding_Adaptive_Flow_2026-06-07.html` + handoff `ONBOARDING_CONTEXT_HANDOFF.md` + `Pricing_Canonical_2026-06-08.md`.
> **The prototype wins on behavior; this canonical pricing doc wins on prices** (supersedes the handoff §7.3 illustrative ₱21k/₱35k numbers).

---

## 1 · Executive summary

### What changes
The shipped onboarding is a **17-screen, fixed-index flow** (`step === N` hardcoded conditionals, `FLOW_TOTAL = 17`, fixed-length `NEXT_LABEL`/`CAN_SKIP` arrays in `onboarding-shell.tsx`). The redesign is a **~31-screen, adaptive, staged flow** whose active screen list is recomputed every render by `buildSequence()`, with five forks (helper / love-stage / tradition / AI-gate / settlement). On top of that it adds five net-new surfaces:

1. **The 6-screen LOVE STAGE** (`love_intro → love_met → love_proposal → love_milestones → love_tone → love_preview`) — website-anchored, covert downstream reuse.
2. **THE MIRROR** — a persistent live wedding-website preview that accretes per answer.
3. **The dashboard "bloom" reveal** — the "Set na 'yan" 6-tile payoff hub.
4. **Stage-4 pricing** — Free / Setnayan AI ₱3,999 / Essentials ₱12,999 / Complete ₱27,999 + 18 à-la-carte SKUs, with a 30-min promo timer and a soft paywall.
5. **New data** — love-story fields (`spark`, `obstacle*`, `proposal_voice/feel`, `anchors{}`, `storyTone/storyLanguage`) and a couple-side **bundle** concept (net-new — couple bundles do not exist today).

### Strategy: extend the shell's render layer, REPLACE its navigation core
**Do not rewrite the shell wholesale, and do not bolt 14 more `step === N` blocks onto the index model.** The single highest-leverage move is to **swap the navigation core** (the fixed-index `go()` / `FLOW_TOTAL` / `NEXT_LABEL[]` / `CAN_SKIP[]` system) for the prototype's **`buildSequence()` id-array model**, while **keeping every existing screen's JSX, sub-component, and CSS**. Screens are addressed by **string id** (`'couple'`, `'budget'`, …) instead of integer index, so forks become array membership, not arithmetic. The proven, already-shipped screens (welcome, role, kind, faith, name+monogram, date, region, pax, budget, picker→s3, prefs→refine, find→s1search, account) are **re-pointed, not rebuilt**. The net-new screens are added as new id-keyed `<section>` blocks. This is a large but bounded refactor that pays for itself immediately: every subsequent fork/skip is a one-line array edit instead of renumbering every conditional.

### Headline risks
- **R1 — Navigation rewrite blast radius.** Every `step === N` in the 3,003-line shell is index-coupled. The id-array swap touches the whole render tree once. Mitigate by doing it as a **mechanical, behavior-preserving PR first** (same 17 screens, now id-addressed) before adding any new screen — ship and verify parity, then grow.
- **R2 — Covert love-story rules (§2.2).** Any "editorial / song / Pakanta / lyric / newspaper / feature" leak on a love screen, in state keys, in `localStorage`, or in a network payload is a product break. The `editorial_*` columns must rename to `story_*`, and the pre-flight grep must run on every love PR.
- **R3 — Pricing not fully reconciled in corpus.** `Pricing_Canonical_2026-06-08.md` is owner-locked but the corpus `service_catalog` seeds + `Pricing.md §0` still carry older labels/prices; couple **bundles don't exist** in schema. The bundle table + 18-SKU reseed is net-new.
- **R4 — No-scroll golden rule (§2.3).** 31 screens + the Mirror must each fit the ~665px frame with internal scroll only inside `.viewzone`. The Mirror competes for vertical budget — it must be a thin pinned ribbon, not a second column on phone.
- **R5 — Design still iterating.** The handoff is a behavioral contract with a *placeholder* visual layer; the real redesign visuals return separately and get re-skinned onto this flow. Build the logic/data/forks now against stable class hooks (§5.4); treat visuals as swappable.

---

## 2 · The migration

### What already exists (verified in `supabase/migrations/20260912000000_wedding_website_lifecycle_foundation.sql`)
- `events.love_story JSONB NOT NULL DEFAULT '{}'::jsonb` ✓ (the persistence vessel — needs no new column)
- `events.special_message TEXT` ✓
- `events.together_since DATE` ✓
- `events.editorial_tone TEXT CHECK (… IN ('warm','playful','formal'))` — **EXISTS, must RENAME → `story_tone`**
- `events.editorial_language TEXT` — **EXISTS, must RENAME → `story_language`**
- `events.site_bg_music_source/_r2_key/_enabled`, `landing_page_hero_video_r2_key` ✓
- `event_editorial` table + RLS ✓ · `event_vendors.selection_match_rank` ✓
- `service_catalog` (PK `sku_code`, `display_name`, `category`, `price_centavos`, `unit`, `purchaser_role`, `is_active`) ✓ — exists, needs **reseed** of the 18 canonical SKUs.
- `orders` (0034: `service_key`, `requested_total_php`, `reference_code`, `order_status` enum) + `payments` ✓
- **`couple_bundles` — DOES NOT EXIST.** Only `vendor_tool_bundles` exists (vendor-side, do not conflate).

### Migration A — love-story rename (small, required before any love copy ships)
`supabase/migrations/20260913000000_love_story_covert_renames.sql`
```sql
BEGIN;
-- editorial_tone → story_tone (drop the old CHECK, rename, re-add CHECK)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='events' AND column_name='editorial_tone') THEN
    ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_editorial_tone_check;
    ALTER TABLE public.events RENAME COLUMN editorial_tone TO story_tone;
    ALTER TABLE public.events ADD CONSTRAINT events_story_tone_check
      CHECK (story_tone IS NULL OR story_tone IN ('warm','playful','formal'));
  END IF;
END $$;
-- editorial_language → story_language
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='events' AND column_name='editorial_language') THEN
    ALTER TABLE public.events RENAME COLUMN editorial_language TO story_language;
  END IF;
END $$;
COMMENT ON COLUMN public.events.story_tone IS
  'Love-story voice (warm|playful|formal). Drives website story voice + hidden Editorial. Covert rename of editorial_tone. 2026-06-08.';
COMMENT ON COLUMN public.events.story_language IS
  'Love-story generation language (en|tl|ceb), silent-inherit. Covert rename of editorial_language. 2026-06-08.';
COMMENT ON COLUMN public.events.love_story IS
  'Expanded love-story JSONB. v1: how_we_met,met_year,together_since,proposal,proposal_setting,proposal_year. Redesign v2 keys: + spark,spark_why,obstacle,obstacle_kind,obstacle_kept,proposal_voice,proposal_feel,milestones[],anchors{song,place,injoke,food}. 2026-06-08.';
COMMIT;
```
**No new column is needed for the love-story narrative** — the richer fields (`spark`, `obstacle*`, `proposal_voice/feel`, `anchors{}`) all live inside the existing `love_story JSONB`. The migration only does the two renames + documents the JSONB shape. Note `event_editorial.editorial_tone` is an *internal* downstream column (not couple-facing) — leave it; the ban is on couple-facing identifiers, not the Editorial table itself.

### Migration B — couple bundles + 18-SKU reseed (net-new, for pricing)
`supabase/migrations/20260914000000_couple_bundles_and_canonical_catalog.sql`
```sql
BEGIN;
-- 1 · 18 canonical couple SKUs (centavos). Upsert so it reconciles existing rows.
INSERT INTO public.service_catalog (sku_code, display_name, category, price_centavos, unit, purchaser_role, is_active) VALUES
  ('setnayan_ai',       'Setnayan AI',       'planning_ai',     399900, 'event', 'couple', TRUE),
  ('animated_monogram', 'Animated Monogram', 'brand_invites',   199900, 'event', 'couple', TRUE),
  ('custom_qr',         'Custom QR',         'brand_invites',    99900, 'event', 'couple', TRUE),
  ('pro_rsvp',          'Pro RSVP',          'brand_invites',   199900, 'event', 'couple', TRUE),
  ('event_website',     'Event Website',     'brand_invites',   199900, 'event', 'couple', TRUE),
  ('editorial_website', 'Editorial Website', 'brand_invites',   799900, 'event', 'couple', TRUE),
  ('papic_guests',      'Papic Guests',      'capture_papic',   199900, 'event', 'couple', TRUE),
  ('guest_stories',     'Guest Stories',     'video_media',     149900, 'event', 'couple', TRUE),
  ('papic_5_seats',     'Papic 5 Seats',     'capture_papic',   299900, 'event', 'couple', TRUE),
  ('camera_bridge',     'Camera Bridge',     'capture_papic',   149900, 'event', 'couple', TRUE),
  ('pabati',            'Pabati',            'video_media',      99900, 'event', 'couple', TRUE),
  ('patiktok',          'Patiktok',          'video_media',     149900, 'event', 'couple', TRUE),
  ('thank_you',         'Thank You',         'video_media',     349900, 'event', 'couple', TRUE),
  ('same_day_edit',     'Same Day Edit',     'video_media',     499900, 'event', 'couple', TRUE),
  ('photowall',         'PhotoWall',         'video_media',     249900, 'event', 'couple', TRUE),
  ('live_background',   'Live Background',   'video_media',     249900, 'event', 'couple', TRUE),
  ('panood',            'Panood',            'video_media',     249900, 'day',   'couple', TRUE),
  ('pakanta',           'Pakanta',           'audio',           249900, 'event', 'couple', TRUE)
ON CONFLICT (sku_code) DO UPDATE
  SET display_name=EXCLUDED.display_name, category=EXCLUDED.category,
      price_centavos=EXCLUDED.price_centavos, unit=EXCLUDED.unit, is_active=TRUE;

-- 2 · couple_bundles — one active bundle selection per event
DO $$ BEGIN
  CREATE TYPE public.couple_bundle_code AS ENUM ('free','setnayan_ai','essentials','complete');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.couple_bundles (
  bundle_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  user_id             UUID NOT NULL,
  bundle_code         public.couple_bundle_code NOT NULL,
  bundle_price_centavos INTEGER NOT NULL DEFAULT 0 CHECK (bundle_price_centavos >= 0),
  srp_centavos        INTEGER NOT NULL DEFAULT 0,
  sku_codes           TEXT[] NOT NULL DEFAULT '{}',
  promo_applied       BOOLEAN NOT NULL DEFAULT FALSE,   -- frozen bundlePromo
  expires_at          TIMESTAMPTZ,                      -- 30-min timer (set at s4ai entry)
  order_id            UUID REFERENCES public.orders(order_id),
  status              TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','submitted','awaiting_payment','paid','activated','refunded')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS couple_bundles_one_active_per_event
  ON public.couple_bundles(event_id) WHERE status <> 'refunded';

ALTER TABLE public.couple_bundles ENABLE ROW LEVEL SECURITY;
-- canonical couple-scoped RLS (match the codebase helper; current_couple_event_ids())
CREATE POLICY couple_bundles_self_select ON public.couple_bundles FOR SELECT
  USING (event_id IN (SELECT public.current_couple_event_ids()));
CREATE POLICY couple_bundles_self_write ON public.couple_bundles FOR ALL
  USING (event_id IN (SELECT public.current_couple_event_ids()))
  WITH CHECK (event_id IN (SELECT public.current_couple_event_ids()));

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS bundle_id UUID
  REFERENCES public.couple_bundles(bundle_id);
COMMIT;
```
**Verify** the exact RLS helper name (`current_couple_event_ids` is referenced by `event_editorial` in the same foundation migration, so it exists) before applying. Essentials SRP = ₱22,492 (8 ✅ SKUs), Complete SRP = ₱47,982 (all 18) — both reconcile to the peso per the canonical doc; store the bundle price + SRP as snapshots in the row (do not recompute at read time).

### How it's applied + frontend-ahead rule
- Apply from a **clean worktree** (no psql): `supabase db push --db-url "$SUPABASE_DB_URL"`. Migrations do **not** auto-apply on main (workflow disabled) — apply in-session.
- **The frontend can ship ahead of Migration A.** Until `story_*` exists, love-story writes are **best-effort / non-fatal** (the commit wraps the love payload in a try/guard so a missing column never aborts the event insert). The flow renders and persists everything else; love data simply no-ops on write until the rename lands. Same for Migration B: `s4*` screens render off the in-code `PRICING` constant; only the *purchase* path needs `couple_bundles`, so the bundle UI can ship before the table and just gate the actual order insert.

---

## 3 · Screen-by-screen port map

Legend: **REUSE** = existing component/JSX re-pointed, no behavior change · **MODIFY** = existing screen, copy/state tweak · **NEW** = build from scratch. Production file is `onboarding-shell.tsx` unless noted; sub-components in `_components/`.

| # | Prototype id | Action | Production home | Notes |
|---|---|---|---|---|
| 1 | `intro` | **REUSE** | `welcome-parallax.tsx` (step 0 `.welcomescreen`) | Hero exists; swap CTA to `.btn-primary` "Build my free plan". |
| 2 | `who` | **REUSE** | `screen-role` (step 1) | Role cards `.opt`; writes `role`. |
| 3 | `helper` | **NEW** (small) | new id `'helper'` block | Conditional fork (`role==='helper'`). Clone `.namepair` + a role `<select>`. ~40 JSX lines. Writes `helper{first,last,role}`. |
| 4 | `couple` | **REUSE** | `screen-name` (step 4, names half) | `.namepair`×2; writes bride/groom names. |
| 5 | `monogram` | **REUSE** | `mono-lockup.tsx` (step 4, lower half) | Tap-to-cycle self-draw already integrated. Split into its own id-screen if the redesign wants monogram on a dedicated screen (it does — `monogram` is its own beat). **MODIFY**: extract from the combined name+monogram screen into two id-screens `'couple'` + `'monogram'`. |
| 6 | `love_intro` | **NEW** | new id `'love_intro'` | Twin-ghost threshold ("Start" / "Add it later" → `loveSkipped=true`). |
| 7 | `love_met` | **NEW** | new id `'love_met'` | Spark stem + sparkchips + spark_why + met_year/together_since + Almost (obstacle) stem + obstacle cues. Most complex love screen. |
| 8 | `love_proposal` | **NEW** | new id `'love_proposal'` | Setting chips + proposal textarea + who-asked (`proposal_voice`) + `proposal_feel` + year. |
| 9 | `love_milestones` | **NEW** | new id `'love_milestones'` | 2×2 anchor tiles (`anchors{song,place,injoke,food}`) + auto-sorted timeline + add-moment form. (Milestones array may defer to dashboard editor per handoff §4.1.) |
| 10 | `love_tone` | **NEW** | new id `'love_tone'` | 3 tone chips → `storyTone`; live one-line preview; badge `Appears as "Our Love Story"`. |
| 11 | `love_preview` | **NEW** | new id `'love_preview'` | Display-only site-card (masthead+monogram+pull-quote+braided prose+timeline). Twin-ghost. Renders via `weaveStory()`. |
| 12 | `kind` | **REUSE** | `screen-kind` (step 2) | `.opt` + `kindphoto`; writes `kind`. |
| 13 | `tradition` | **REUSE** | `screen-faith` (step 3) | `.chips.eq`; fork `kind!=='civil'`; writes `faith[]` (=`traditions`). Production already has the 8-faith list. |
| 14 | `date` | **REUSE** | `DateCalendar` (step 5) | 2-mode calendar. |
| 15 | `location` | **REUSE** | `location-step.tsx` (step 6) | Top-30 + near-me. |
| 16 | `pax` | **REUSE** | `screen-pax` (step 7) | Slider + `paxphoto`. |
| 17 | `budget` | **REUSE** | `screen-budget` (step 8) | Band + line-picker + photo. |
| 18 | `s1edu` | **NEW** (small) | new id `'s1edu'` | Static `.edu` lesson, no input. ~20 lines. |
| 19 | `s1type` | **NEW** | new id `'s1type'` | Reception-type photo-card carousel (`.pgrid.car`). Writes `receptionTypes[]` → `venue_setting`. (Today the find screen jumps straight to results; this front-pick is new.) |
| 20 | `s1search` | **MODIFY** | `screen-find` (step 12) | Real marketplace search + BYO sheet already shipped. Re-point + move earlier in sequence. Writes `shortlist[]`, `byoVendors[]`. |
| 21 | `s1payoff` | **NEW** (small) | new id `'s1payoff'` | 3-stat `.statstrip`, no login (login removed here). |
| 22 | `aigate` | **NEW** | new id `'aigate'` | Two `.opt` cards; `ai=true/false` controls the Stage-2/3 fork. |
| 23 | `s2pick` | **MODIFY** | reuse `screen-picker` (step 9) machinery | The 4 basics, pax-page picker design. Reuses Rail/PickCard. |
| 24 | `refine_basic` | **MODIFY** | reuse `StyleSubStepper` (step 10) | Sub-stepper → queue-driven refinement (BASIC[] order). Generalize prefs sub-stepper into the uniform refinement template. |
| 25 | `s3pick` | **MODIFY** | reuse `screen-picker` (step 9) | Full 10-parent taxonomy accordion (basics+reception excluded). Writes `enhancePicks[]`. |
| 26 | `refine` | **MODIFY** | reuse `StyleSubStepper` | Extras refinement queue. Silent-skip leaves with no facet. |
| 27 | `s4ai` | **NEW** | new id `'s4ai'` | Value anchor + reality-check; **starts 30-min timer** (`couple_bundles.expires_at`). |
| 28 | `s4bundle` | **NEW** | new id `'s4bundle'` | Two bundle cards (`.bdl-card`): Essentials ₱12,999 / Complete ₱27,999 ★, struck SRP + savings, "stay free". |
| 29 | `s4boost` | **MODIFY** | reuse `screen-services` (step 15) | À-la-carte 18 SKUs + Pakanta card (`.booster`/`.bundle`). Heart/add → `boost[]`. |
| 30 | `s5paywall` | **MODIFY** | reuse `screen-services-summary` (step 16) | Summary + cart + freebies + soft paywall. Writes `paid`. |
| 31 | `survey` | **NEW** (small) | new id `'survey'` | Attribution dropdown, post-reveal (give-before-take). |
| — | `settleFree` / `settlePay` | **NEW** | new ids | Mutually-exclusive settlement; lead to dashboard. |
| — | `dashboard` | **NEW** | new id `'dashboard'` | **The bloom reveal** — 6 hub tiles (`.dashtiles/.dashtile`), "Set na 'yan", exits onboarding. |

### Tally
- **REUSE (re-point only):** 9 — intro, who, couple, kind, tradition, date, location, pax, budget.
- **MODIFY (re-point + tweak/move/generalize):** 7 — monogram-split, s1search, s2pick, refine_basic, s3pick, refine, s4boost, s5paywall. *(8 if monogram-split is counted separately from couple.)*
- **NEW (build from scratch):** 15 — helper, the **6 love screens**, s1edu, s1type, s1payoff, aigate, s4ai, s4bundle, survey, settleFree/settlePay (1 pair), **dashboard bloom**. Plus the non-screen NEW: **The Mirror**, `weaveStory()` engine, `PRICING` constant, the `buildSequence()` nav core.

**Net-new flagged:** the 6 love-stage screens · The Mirror · the dashboard bloom · Stage-4 pricing (`s4ai`/`s4bundle` and the bundle/paywall logic).

---

## 4 · The Mirror

A persistent, reactive wedding-website preview that **accretes one detail per answer** and never scrolls the page.

- **Where it mounts:** a thin **pinned ribbon inside `.top`**, directly under `.stagebar`, appearing from the `monogram` screen onward (the moment the couple has names + a mark to show). On phone it is a **horizontal ribbon**, not a side column — the ~665px vertical budget cannot afford a second column (§4 risk R4). On the 880px desktop frame it may expand, but ship the ribbon first.
- **Markup (sibling discipline):** render `<div className="mirror"><div className="mir-card"> … </div></div>` as a child of `.top` (so it's pinned, never in the scrollable `.viewzone`). It contains `.mir-mono` (live monogram glyph), `.mir-names`, and a horizontally-scrollable `.mir-chips` strip of `.mir-chip` pills.
- **State it reads (derived, never new authoritative state):**
  ```ts
  const mirror = useMemo(() => ({
    show: activeId !== 'welcome' && reached('monogram'),
    mono: state.monogramDesign,
    names: coupleNamesLabel(state),                 // "Maria & Juan"
    chips: [
      state.storyTone && toneChip(state.storyTone),                 // accreted on love_tone
      state.kind && kindChip(state.kind),
      firstLocationLabel(state.places),
      state.pax && `${state.pax} guests`,
      recapDateLabel(state),                          // candidates / window
      ...state.receptionTypes.map(receptionChip),
    ].filter(Boolean),
  }), [state]);
  ```
- **Accretion = append on change.** Each chip animates in with `mirShim`/`mirPop` (already in CSS notes) the first time its source field becomes non-empty. No user interaction; it is purely a read-model of `OnboardingState`.
- **Covert rule applies to the Mirror too:** it shows only wedding-website-shaped facts (names, mark, tone, kind, place, date, guests, reception). It must **never** surface "editorial/song/Pakanta" chips. The love-story chip it may show is the **tone** ("Warm story") badged as the website's "Our Love Story" voice — nothing referencing a song or feature.
- **No-scroll guarantee:** the ribbon is fixed-height (~36–44px); chips overflow **horizontally** inside `.mir-chips` (`overflow-x:auto; scrollbar-width:none`). It never grows `.phone`.

---

## 5 · Pricing wiring

### The canonical model (from `Pricing_Canonical_2026-06-08.md`)
- **4 tiers:** Free ₱0 · Setnayan AI ₱3,999 · Essentials ₱12,999 (SRP ₱22,492, save ₱9,493) · Complete ₱27,999 (SRP ₱47,982, save ₱19,983).
- **18 à-la-carte SKUs** at SRP (Setnayan AI 3,999 … Pakanta 2,499). Essentials = the 8 ✅ SKUs; Complete = all 18.
- **Event Website is PAID ₱1,999** (owner-resolved 2026-06-08 option b) — the old "free Event Website" line is retired. The Free tier's website hook is the **personalized reveal**, not a published site.

### Where it lands
1. **In-code `PRICING` constant** (new `_data/pricing.ts`): the 4 tiers + 18 SKUs + the two bundle membership arrays + SRP/savings, all in centavos. `s4ai`/`s4bundle`/`s4boost`/`s5paywall` render off this — **prices are frozen at onboarding commit; no live re-fetch** after the 30-min timer.
2. **`service_catalog`** (Migration B reseed): the 18 SKUs become the authoritative catalog rows for checkout pricing + admin. The in-code constant must equal the seed (add a CI/test assert that the two agree).
3. **`couple_bundles`** (Migration B): on `s4ai` entry → insert a `pending` bundle row with `expires_at = now() + interval '30 minutes'`. On `s4bundle` pick → update `bundle_code`/`bundle_price_centavos`/`srp_centavos`/`sku_codes`/`promo_applied`. On Purchase Now → `orders.insert(service_key='bundle:'||code, requested_total_php=price, bundle_id=…)` + `payments.insert(pending)` + `couple_bundles.update(status='paid', order_id)`. Stay-free → `couple_bundles.update(bundle_code='free', status='activated')`, no order.
4. **Checkout reuse:** the existing 0034 orders/payments rail (reference code, screenshot upload, manual `/admin/payments` reconcile) is unchanged. À-la-carte boosts can either be one order each (current model) or rolled into a single bundle-style order — recommend **one order per cart** keyed by `bundle_id` for the bundle path and per-SKU orders for à-la-carte, mirroring today's per-service model.

### The bundle gap (net-new)
Couple bundles **do not exist** in schema today (only `vendor_tool_bundles`). The gap is: the `couple_bundles` table, the 18-SKU reseed, the `orders.bundle_id` FK, and the `bundlePromo`/`expires_at` 30-min snapshot. Until Migration B lands, the `s4*` screens render off the in-code constant and the **Purchase path is gated** (button shows but order insert is disabled / shows "coming online") — the soft-paywall "stay free" path still completes to the dashboard, so the flow is never blocked.

---

## 6 · Server actions

`actions.ts` · `commitOnboardingWedding()` + `OnboardingCommitPayload` (currently lines 210–289 / insert at 361–420). Today the events insert does **not** write any love-story field. Changes:

1. **Extend `OnboardingCommitPayload`** with: `loveStory` (the full JSONB blob: `how_we_met, met_year, together_since, spark, spark_why, obstacle, obstacle_kind, obstacle_kept, proposal, proposal_setting, proposal_year, proposal_voice, proposal_feel, milestones[], anchors{}`), `storyTone`, `storyLanguage`, `specialMessage`, `togetherSince`, and the offer fields (`bundle`, `bundlePromo`, `boost[]`, `paid`, `survey`).
2. **Write to events** (best-effort guard until Migration A):
   ```ts
   love_story: payload.loveStory ?? {},
   story_tone: payload.storyTone ?? null,        // post-rename column
   story_language: payload.storyLanguage ?? null,
   special_message: payload.specialMessage ?? null,
   together_since: payload.togetherSince ?? null,
   ```
   Wrap in a try/non-fatal pattern (or feature-flag on column existence) so a pre-migration prod never aborts the event insert.
3. **Bundle/order writes** (post-Migration B): a new `commitCoupleBundle(payload)` action (or an extension of the commit) that inserts `couple_bundles` + `orders` + `payments` per §5. Free path writes the `activated/free` row only.
4. **Covert renames in code (no conditionals):** `editorialTone → storyTone`, `editorialLanguage → storyLanguage` across `types.ts`, `actions.ts`, and the shell. **Grep gate:** no `editorial|song|pakanta|lyric|newspaper` substring on any love-story state key, payload field, `localStorage` value, or network body. Run the §2.2 pre-flight grep across the love screens' rendered copy before each love PR.
5. **`buildCommitPayload(state)`** in the shell (currently ~line 1982) maps the new state fields into the extended payload.

---

## 7 · PR sequence (small, independently shippable, manual merge)

> **Workflow reality:** `gh pr merge --auto` is **broken** on this repo (no branch protection) — **merge manually**. Ship each PR from an **isolated worktree off `origin/main`** (never from `~/`, which has unrelated WIP and is stale). Expect CHANGELOG/COWORK_INBOX conflicts on nearly every PR — use the fetch→merge→`checkout --theirs` docs→re-prepend→push→merge loop; confirm via `gh pr view --json state`. An unresolved conflict silently skips `pull_request` Actions, so resolve fully.

| PR | Title | Scope | Independently shippable? |
|---|---|---|---|
| **PR-1** | **Nav core: id-array `buildSequence()` (behavior-preserving)** | Replace `step:int`/`FLOW_TOTAL`/`NEXT_LABEL[]`/`CAN_SKIP[]` with id-addressed screens + `buildSequence()`; **same 17 screens, same order, same forks**. No new screens, no new data. Verify pixel/flow parity. | ✅ Pure refactor — the safest first move; everything else builds on it. **Recommended first PR.** |
| **PR-2** | **Migration A: love-story covert renames** | `20260913…_love_story_covert_renames.sql` (editorial_*→story_*, JSONB comment). Apply via `supabase db push`. Code rename `editorialTone→storyTone` etc. + grep gate. No UI yet. | ✅ Schema + identifier hygiene; frontend can ship ahead. |
| **PR-3** | **Love stage (6 screens) + state + `weaveStory()`** | The 6 love `<section>` blocks, love CSS, state extensions, fork (`loveSkipped`), best-effort love write in commit. Covert grep in CI. | ✅ Forks cleanly; if love is skipped the flow is unchanged. |
| **PR-4** | **The Mirror** | `.mirror` ribbon in `.top`, derived `useMemo`, accretion animations. Mounts from `monogram`. | ✅ Additive read-model; zero new authoritative state. |
| **PR-5** | **Stage-1–3 picker/refine restructure** | `s1edu/s1type/s1payoff/aigate`, generalize picker→`s2pick/s3pick`, prefs-substepper→uniform refinement template (`refine_basic/refine`) with silent-skip. | ✅ Re-points existing machinery; gated by `ai`. |
| **PR-6** | **Migration B: couple_bundles + 18-SKU reseed** | `20260914…` table + RLS + `orders.bundle_id` + catalog upsert. Apply. + `_data/pricing.ts` constant + parity test. | ✅ Schema + constant only; no UI dependency. |
| **PR-7** | **Stage-4 pricing UI** | `s4ai` (30-min timer), `s4bundle` (2 cards + soft paywall), `s4boost` (18 + Pakanta), `s5paywall` (cart+freebies), bundle/order commit. | ✅ Reads PR-6 constant; purchase gated until table exists. |
| **PR-8** | **Dashboard bloom + settlement + survey** | `survey`, `settleFree`/`settlePay`, `dashboard` 6-tile bloom reveal, exit-to-dashboard wiring. | ✅ Terminal screens; complete the arc. |
| **PR-9** | **Helper fork + polish + full QA** | `helper` screen, stage labels/time estimates, end-to-end QA (both AI paths, both settlements, covert grep, no-scroll audit). | ✅ Closes gaps. |

Each PR: append a `CHANGELOG.md` entry with a `SPEC IMPACT:` line, update `STATUS.md` if state advanced.

---

## 8 · Open blockers

1. **Covert love-story rules (§2.2) — load-bearing.** Run the grep `grep -Eiw 'editorial|newspaper|song|pakanta|lyric|lyrics|feature'` over rendered copy of `love_intro…love_preview` (expect ZERO) **and** over love-story state keys / payload / localStorage. `event_editorial.editorial_tone` (internal table) is allowed; couple-facing `story_*` is mandatory.
2. **No-scroll (§2.3 #1) at 31 screens + Mirror.** Each screen must fit ~665px with internal scroll only in `.viewzone`. The Mirror ribbon eats vertical budget — keep it ~40px, horizontal-scroll chips, pinned in `.top`. Audit every new screen on the 430px frame.
3. **Pricing not fully reconciled in corpus.** `Pricing_Canonical_2026-06-08.md` is owner-locked, but `Pricing.md §0` + corpus `CLAUDE.md` SKU table still carry older labels/prices, and **the handoff §7.3 prices (₱21k/₱35k) are stale** — use the canonical doc. Owner sign-off still open on: the 30-min timer keep-vs-drop; the "Removed (no longer offered)" list (Setnayan AI, Indoor Blueprint, Pakulay, Pro Website, High-Res Archive, Call-Time Escalator assumed retired customer-facing — **confirm**); bundle names ("Set Essentials"/"Set Complete" vs "Essentials"/"Complete").
4. **Design still iterating.** The handoff is the behavioral contract; the *visual* redesign returns separately and gets re-skinned onto this exact flow. Build against the stable class hooks (§5.4) and keep `settleFree`'s free-bonus graphic **generic/swappable** (Editorial-page example not final).
5. **Nav rewrite parity (R1).** PR-1 must prove behavior parity before any new screen lands — otherwise every later PR debugs against a moving base.
6. **Pakanta tier ladder** (handoff §7.3): canonical doc locks single ₱2,499; spec ladder (₱1,999/₱3,999/₱9,999) retired customer-facing. The `s4boost` card shows ₱2,499 (canonical) — placement LOCKED in `s4boost`, never the love stage.
7. **RLS helper name** for `couple_bundles` — verify `current_couple_event_ids()` (used by `event_editorial`) is the right helper before applying Migration B.
8. **`milestones[]` capture scope** — handoff defers the milestone editor to the dashboard in prod; decide whether `love_milestones` collects them in onboarding or just the 4 anchors.
