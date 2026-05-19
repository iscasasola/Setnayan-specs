# Iteration 0043 — Wedding Type Picker (Ceremony × Venue × Sub-type)

**Iteration number:** 0043
**Topic:** Two-axis wedding-type picker (Ceremony Type × Venue Setting) with conditional sub-types; powers downstream filtering, Concierge branching, vendor surfacing, and showcase taxonomy
**Surface:** Couple-side event creation flow ([0001_creating_guest_list](../0001_creating_guest_list/0001_creating_guest_list.md)) + couple dashboard event settings ([0021_couple_dashboard_fully_purchased](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md))
**Status:** Drafted 2026-05-18 · V1.1 concept lock · spec-only, no engineering yet
**Owner:** Ice
**Phase:** V1.1 — drafts after pilot wraps per CLAUDE.md 2026-05-18 row 8 (pilot uses Catholic-default convention; explicit picker ships V1.1)
**Builds on:** 0001 (events table + event creation flow), 0006 (vendors + canonical_services + vendor compatibility tags), 0016 (Concierge wizard branching), 0021 (couple dashboard event settings)
**Consumed by:** 0044 (per-category schemas filter by ceremony type), 0045 (product catalogs surface per ceremony type), 0046 (wedding showcase faceted by ceremony type), 0047 (style-driven marketplaces filter by ceremony type)
**Companion specs:** 0001, 0006, 0016, 0021

---

## What this iteration ships

A required two-axis picker during event creation (and editable later from event settings) that captures:

1. **Ceremony Type** — drives officiant requirements, religious rules, dietary/alcohol constraints, default canonical_services, Concierge wizard branch
2. **Venue Setting** — drives logistics requirements (generators, tents, sound, decor patterns), default vendor recommendations
3. **Ceremony Sub-type** (conditional) — appears only for Muslim or Cultural; captures ethno-cultural group for specialty vendor matching
4. **Secondary ceremony** (conditional) — for mixed-faith couples (Catholic-Muslim, Catholic-INC, etc.)

The picker also sets faith-aware defaults for:
- Catering filter (Halal-friendly · INC-friendly · alcohol-served filters auto-applied)
- Mobile bar / cocktail bar visibility (hidden for INC and Muslim by default)
- Vendor saturation rules (per faith × per region)
- Showcase facets (wedding's permanent classification)
- Email/notification copy (no Pre-Cana reminders to Muslim couples)

V1.1 ships with **2 faith buckets visible** (Catholic + Civil) and **4 "Coming Soon" buckets** (INC, Christian, Muslim, Cultural) with email-capture. Schema supports all 7 from day 1 to avoid migrations when faiths are activated.

---

## The two axes

### Axis A — Ceremony Type (required)

| Value | Officiant | Key constraints | Notes |
|---|---|---|---|
| `catholic` | Catholic priest | Pre-Cana required (PSA); ceremony in chapel/church | Default for ~80% of PH weddings |
| `civil` | Judge / Mayor / Justice of Peace | No religious component; CENOMAR + Marriage License chain | Often a precursor to later Catholic blessing |
| `inc` | INC minister | NO alcohol (strict, even in food/sauces/dessert); modesty dress code; Christian-acceptable music only; specific INC chapel rules | ~2-3M PH members; structurally underserved by competitors |
| `christian` | Born Again / Evangelical / Protestant pastor | Contemporary worship music; generally allows alcohol; flexible dress codes | Umbrella for JIL, CCF, Victory, Baptists, Methodists, etc. |
| `muslim` | Muslim Imam (Bureau of Muslim Affairs registered) | Halal-only catering; mahr exchange; wali consent; two male Muslim witnesses; gender-separation common; Nikah + Walima | Requires `ceremony_sub_type` for ethno-cultural group |
| `cultural` | Tribal elder / cultural officiant | Varies by tradition (Igorot, Cordillera, Maranao folk, Manobo, etc.) | Requires `ceremony_sub_type` for specific tradition |
| `mixed` | Dual officiants | Two ceremony chains, two officiant types, often two venue components | Requires `secondary_ceremony_type` |

### Axis B — Venue Setting (required)

| Value | Logistics implications |
|---|---|
| `banquet_hall` | Standard utilities; vendors assume power + AV + restrooms present |
| `garden` | Generator rental, tent backup, outdoor sound specialist, mobile restrooms, cooling fans (March-May), weather contingency |
| `beach` | Sand-friendly decor, salt-air protection for equipment, tide/weather monitoring, transport for elderly guests |
| `destination` | Travel coordination for vendors, accommodation blocks, multi-day logistics, often combines with garden/beach |
| `heritage` | Restoration-aware decorators (no nail holes in heritage walls), specialty lighting, capacity restrictions |
| `outdoor_tent` | Tent rental, generator, flooring, climate control |
| `civil_registrar` | Compact ceremony (City Hall / Sala); specialty photographers for cramped indoor settings; intimate-scale caterers |

### Axis C — Ceremony Sub-type (conditional, only for `muslim` or `cultural`)

For `ceremony_type='muslim'`:
- `maranao` — Singkil, kapag-arung procession, kulintang, okir-motif decor
- `tausug` — Pangalay, beadwork, paggalay performances
- `maguindanao` — Agongan music, pangalay variations
- `sama_bajau` — Igal dance, lugu chants, coastal themes
- `yakan` — Yakan textile ceremonies
- `general_muslim` — Generic Islamic wedding, no specific ethno-cultural specialty

For `ceremony_type='cultural'`:
- `igorot_cordillera` — Bontoc, Ifugao, Kalinga
- `manobo` — Mindanao indigenous
- `visayan_folk` — Pintados, etc.
- `tagalog_folk` — Pre-colonial Tagalog traditions
- `kapampangan_folk` — Pampanga regional
- `other` — Open-text fallback for niche traditions

### Axis D — Secondary Ceremony (conditional, only for `ceremony_type='mixed'`)

When `ceremony_type='mixed'`, surface a second picker showing the same 6 primary options (catholic / civil / inc / christian / muslim / cultural). System stores both and treats the event as dual-ceremony for vendor filtering, Concierge branching, and timeline planning.

Common PH mixed combinations:
- Catholic + Civil (sequential — civil first for license, Catholic later for sacrament)
- Catholic + Muslim (interfaith — both ceremonies on different days)
- Catholic + INC (interfaith — both ceremonies)
- Civil + Cultural (civil + tribal blessing)

---

## Schema

### `events` table additions

```sql
ALTER TABLE events
  ADD COLUMN ceremony_type TEXT NOT NULL DEFAULT 'catholic'
    CHECK (ceremony_type IN ('catholic','civil','inc','christian','muslim','cultural','mixed')),
  ADD COLUMN venue_setting TEXT NOT NULL DEFAULT 'banquet_hall'
    CHECK (venue_setting IN ('banquet_hall','garden','beach','destination','heritage','outdoor_tent','civil_registrar')),
  ADD COLUMN ceremony_sub_type TEXT,  -- nullable; required when ceremony_type IN ('muslim','cultural')
  ADD COLUMN is_mixed_ceremony BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN secondary_ceremony_type TEXT
    CHECK (secondary_ceremony_type IS NULL OR secondary_ceremony_type IN ('catholic','civil','inc','christian','muslim','cultural'));

-- Conditional integrity constraint
ALTER TABLE events
  ADD CONSTRAINT events_sub_type_required_when_muslim_or_cultural
    CHECK (
      (ceremony_type NOT IN ('muslim','cultural')) OR
      (ceremony_type IN ('muslim','cultural') AND ceremony_sub_type IS NOT NULL)
    ),
  ADD CONSTRAINT events_secondary_required_when_mixed
    CHECK (
      (is_mixed_ceremony = FALSE) OR
      (is_mixed_ceremony = TRUE AND secondary_ceremony_type IS NOT NULL)
    );

CREATE INDEX events_ceremony_type_idx ON events (ceremony_type);
CREATE INDEX events_venue_setting_idx ON events (venue_setting);
```

Defaults of `catholic` + `banquet_hall` reflect the most common PH wedding shape, so existing events (created before this iteration ships) backfill cleanly without owner intervention.

### `wedding_type_launch_status` table (NEW)

Controls per-faith × per-region visibility so the picker can show "Coming Soon" for faiths that don't yet have a healthy vendor pool. Admin-toggleable per region.

```sql
CREATE TABLE wedding_type_launch_status (
  ceremony_type TEXT NOT NULL
    CHECK (ceremony_type IN ('catholic','civil','inc','christian','muslim','cultural')),
  region TEXT NOT NULL,  -- e.g., 'metro_manila', 'cebu', 'davao', 'barmm', 'all'
  status TEXT NOT NULL DEFAULT 'coming_soon'
    CHECK (status IN ('active','coming_soon','disabled')),
  vendor_count_threshold INT NOT NULL DEFAULT 20,  -- min vendors before flip from coming_soon → active
  current_vendor_count INT NOT NULL DEFAULT 0,  -- updated by nightly job
  notify_signups_count INT NOT NULL DEFAULT 0,  -- couples who asked to be notified
  activated_at TIMESTAMPTZ,  -- when status flipped to active
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ceremony_type, region)
);

-- V1.1 launch seed
INSERT INTO wedding_type_launch_status (ceremony_type, region, status) VALUES
  ('catholic', 'all', 'active'),
  ('civil', 'all', 'active'),
  ('christian', 'all', 'coming_soon'),
  ('inc', 'all', 'coming_soon'),
  ('muslim', 'all', 'coming_soon'),
  ('cultural', 'all', 'coming_soon');
```

### `couple_wedding_type_notify_signups` table (NEW)

Email-capture for couples interested in faiths not yet active. Generates demand signal for vendor recruitment prioritization.

```sql
CREATE TABLE couple_wedding_type_notify_signups (
  signup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),  -- nullable if signed up pre-account
  email TEXT NOT NULL,
  ceremony_type_interested TEXT NOT NULL,
  region TEXT,
  expected_wedding_date DATE,
  notes TEXT,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX notify_signups_ceremony_type_idx ON couple_wedding_type_notify_signups (ceremony_type_interested);
```

---

## Picker UX

### Where it appears

1. **Primary entry point** — during event creation in [0001_creating_guest_list](../0001_creating_guest_list/0001_creating_guest_list.md) flow, as step 2 or 3 (after couple name + event date). Required to proceed.
2. **Edit-later** — from couple dashboard event settings ([0021_couple_dashboard_fully_purchased](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) § Settings). Changing the picker after vendors are shortlisted triggers a soft-warning flow (see § Change-management below).

### Layout pattern

Two-step wizard (not single screen — picker carries weight, deserves room to breathe):

**Step 1 — Pick Ceremony Type.** Card grid:

| Catholic | Civil | INC | Christian | Muslim | Cultural |
|---|---|---|---|---|---|
| Active card | Active card | Coming Soon | Coming Soon | Coming Soon | Coming Soon |

Each card shows:
- Icon (chapel for Catholic, City Hall for Civil, tabernakulo for INC, cross-only for Christian, crescent/mosque for Muslim, tribal symbol for Cultural)
- Label
- One-line description ("Catholic mass with Pre-Cana requirement", "Civil ceremony at City Hall or with Mayor/Judge", etc.)
- Status badge for Coming Soon ("Get notified when we launch [INC/Muslim/etc.] wedding support →" with email-capture inline)
- "Mixed (interfaith)" option as a 7th card

Smart defaults by signal:
- **Geo signal** — couples in BARMM (resolved via signup IP or address) get `muslim` pre-highlighted with the appropriate ethno-cultural sub-type suggestion
- **Email/name signal** — Muslim name patterns suggest pre-highlighting `muslim`
- **Family list signal** — "Father [name]" entries in guest list suggest `catholic`
- **Always overridable** — defaults are pre-highlighted, never locked

**Step 2 — Pick Venue Setting.** Card grid:

| Banquet Hall | Garden | Beach | Destination | Heritage | Outdoor Tent | Civil Registrar |
|---|---|---|---|---|---|---|

Each card shows:
- Photo (representative venue type from PH)
- Label
- One-line description
- "Logistics affected" expandable note ("Garden weddings typically need generator + tent backup + outdoor sound specialist")

**Step 2.5 (conditional) — Ceremony Sub-type.** Appears only if `ceremony_type` is `muslim` or `cultural`. Card grid of ethno-cultural sub-types with brief descriptions.

**Step 2.6 (conditional) — Secondary Ceremony.** Appears only if `ceremony_type='mixed'`. Repeats Step 1's card grid (minus the "Mixed" option) for the second ceremony.

### Coming-soon UX

Couples picking an inactive faith get:
- Soft "Coming Soon" badge on card
- Click → modal with email-capture: "We're building support for [INC/Muslim/Christian/Cultural] weddings — get notified when it launches in [Metro Manila/Cebu/your region]. Expected: [Q3 2026/Q4 2026]."
- Option to "Continue with [closest active faith] for now and switch later" → falls back to Catholic or Civil as appropriate
- Option to "Wait — I'll come back when [Muslim] launches" → email capture, no event created yet

### Change-management

Couples editing the picker after vendors are shortlisted face two scenarios:

**Scenario 1 — Compatible change.** Catholic → Christian. Vendors largely overlap; show a non-blocking notice ("Your 5 shortlisted vendors are mostly compatible with Christian weddings — review your shortlist to confirm").

**Scenario 2 — Incompatible change.** Catholic → INC (or Muslim). Vendors must be re-filtered for new constraints (no alcohol, modesty rules, etc.). Show a soft warning modal:

> Changing your wedding type to INC will hide 2 of your 5 shortlisted vendors that aren't INC-compatible (Acme Mobile Bar, XYZ Cocktail Caterer). You can keep them shortlisted but we'll flag them. Continue?
> [Continue · Cancel]

Recommended: **soft warning, not hard block**. Couples may know their vendor's specific situation (e.g., a cocktail caterer who also does mocktail-only events — vendor self-tag may be missing). Keep agency with the couple.

---

## Downstream impact (what this picker controls)

| Downstream system | What changes per `ceremony_type` |
|---|---|
| **Canonical services shown** ([0006](../0006_vendors_management/0006_vendors_management.md)) | Catholic ~30 services · Civil ~15 · INC ~25 (drops alcohol-related: mobile_bar hidden by default) · Christian ~28 · Muslim ~28 (drops mobile_bar, adds Mahr coordination + Imam + Halal catering) · Cultural varies by sub-type |
| **Vendor marketplace defaults** ([0006](../0006_vendors_management/0006_vendors_management.md) + 0047) | Vendors with matching `compatible_ceremony_types` tags shown by default; "Expand to all" toggle stays available |
| **Catering faith filter** | INC weddings auto-apply `inc_friendly` tag filter; Muslim weddings auto-apply `halal_certified OR halal_compatible` filter; mixed weddings show the intersection |
| **Mobile bar / cocktail bar visibility** | Hidden by default for INC and Muslim weddings (no alcohol); couples can manually un-hide if their specific case allows |
| **Concierge wizard branch** ([0016](../0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md)) | Different next-step recommendations per type: Catholic Pre-Cana path · Civil paperwork path · Muslim Nikah+Walima dual-track · INC counseling path · Christian pastor selection path |
| **Email + notification copy** ([0028](../0028_email_notifications/0028_email_notifications.md)) | Catholic templates reference Pre-Cana; Muslim templates reference Nikah; INC templates avoid alcohol mentions; Christian templates use Born-Again-Evangelical framing |
| **Planning timeline templates** ([0016](../0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md)) | Catholic 12-month default · Civil 3-month default · Muslim 6-month dual-ceremony · INC 8-month with counseling block · Christian 6-month · Cultural varies |
| **Budget allocation defaults** ([0007](../0007_budget_expenses/0007_budget_expenses.md)) | Catholic includes church fees line · Muslim includes mahr line · Civil leaner (no religious line items) · INC drops alcohol-bar line · Christian similar to Catholic minus church |
| **Day-of timeline** ([0021](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md), [0031](../0031_day_of_guest/0031_day_of_guest.md)) | INC reception flow differs (no toast moments with alcohol); Muslim adds gender-separation logistics; Catholic has communion timing; Civil compact |
| **Showcase taxonomy** ([0046](../0046_wedding_showcase/0046_wedding_showcase.md)) | Wedding gets faceted into Real Weddings browse by ceremony type; filter facets respect ceremony × venue compound |
| **Vendor saturation rules** ([0006](../0006_vendors_management/0006_vendors_management.md) § saturation) | INC-compatible photographer pool saturates separately from full photographer pool; Halal caterer pool saturates separately from full caterer pool |
| **Vendor compatibility tags** ([0006](../0006_vendors_management/0006_vendors_management.md), 0044, 0047) | Vendors self-tag `compatible_ceremony_types[]` and `compatible_venue_settings[]` during onboarding; multi-select |

---

## Vendor compatibility tags (consumed from 0006 + 0044)

Vendors during onboarding self-select which ceremony types and venue settings they're comfortable serving. Stored as multi-select arrays on `vendors`:

```sql
ALTER TABLE vendors
  ADD COLUMN compatible_ceremony_types TEXT[] NOT NULL DEFAULT ARRAY['catholic','civil','christian']::TEXT[],
  ADD COLUMN compatible_venue_settings TEXT[] NOT NULL DEFAULT ARRAY['banquet_hall','garden','heritage']::TEXT[];

CREATE INDEX vendors_ceremony_compat_idx ON vendors USING GIN (compatible_ceremony_types);
CREATE INDEX vendors_venue_compat_idx ON vendors USING GIN (compatible_venue_settings);
```

Defaults assume the broad PH baseline (Catholic + Civil + Christian, banquet/garden/heritage). Vendors who serve INC, Muslim, Cultural, beach, destination, outdoor-tent, or civil-registrar must explicitly opt in. This protects couples from incompatible matches (an alcohol-served caterer accidentally shown to an INC couple).

---

## Lechonero edge case

A specific category-vendor combination that self-filters cleanly: Lechonero (whole-pig roast specialist, [iteration 0006 canonical_services](../0006_vendors_management/0006_vendors_management.md) addition pending).

- Lechonero vendor's product = pork
- Muslim couples filter for `compatible_ceremony_types CONTAINS 'muslim'` → Lechoneros are excluded automatically (no Lechonero opts into Muslim compatibility)
- Catholic / Civil / Christian / INC couples see Lechoneros normally
- INC weddings allow lechon (no alcohol restriction applies to pork) — INC-friendly Lechonero is the modal case

This is the **self-filtering pattern**: the platform doesn't need to hide categories; faith-incompatible vendors simply don't surface because no compatible vendor opts in.

---

## Phasing

**V1.1 launch (~6-8 weeks post-pilot wrap):**
- Schema all 7 ceremony types + 7 venue settings + sub-types + secondary ceremony
- Picker UI with 2 active (Catholic + Civil) + 4 Coming Soon cards
- Email-capture for inactive faiths
- Vendor compatibility tags surfaced on vendor onboarding (vendors can opt into INC/Muslim/Cultural even before activation — these vendors become the seed pool for V1.2)
- Downstream filtering wired up for Catholic + Civil (other faiths' filters work but are gated by `wedding_type_launch_status`)

**V1.2 (Christian activation):**
- Flip `christian` to active in `wedding_type_launch_status`
- Vendor pool: ~20+ Born Again pastors recruited across Manila, Cebu, Davao
- Marketing announce to email-captured signups

**V1.3 (INC activation):**
- Flip `inc` to active
- Vendor pool: ~15+ INC ministers, ~10+ alcohol-free caterers, ~5+ INC-compatible photographers, ~5+ INC-compatible coordinators recruited
- Marketing announce to INC email-captured signups

**V1.4 (Muslim activation):**
- Flip `muslim` to active region-by-region (BARMM first, then Metro Manila, then other major cities)
- Vendor pool: ~15+ Imams, ~10+ halal caterers, ~5+ modest-attire designers, ~3+ Kulintang ensembles recruited
- Region-by-region rollout because vendor density varies dramatically

**V1.5+ (Cultural activation):**
- Niche per-tribe rollout based on demand signal from email captures
- Smallest market, hardest vendor sourcing

---

## Smart defaults logic

When event creation begins, pre-highlight (but don't lock) likely picker values based on signup signals:

```
def suggest_ceremony_type(user):
  if user.signup_address.region in ['barmm', 'lanao_del_sur', 'maguindanao', 'basilan', 'sulu', 'tawi_tawi']:
    return 'muslim'
  if user.name has muslim_name_pattern or user.family_names has muslim_pattern:
    return 'muslim'
  if user.signup_address.region in ['cordillera', 'mountain_province', 'kalinga']:
    return suggest_via_secondary_signal()  # Could be catholic OR cultural
  return 'catholic'  # PH baseline

def suggest_venue_setting(event):
  if event.guest_count <= 30:
    return 'civil_registrar' if ceremony_type == 'civil' else 'banquet_hall'
  if event.location_keyword matches ['beach', 'boracay', 'palawan', 'siargao', 'bohol']:
    return 'beach'
  if event.location_keyword matches ['tagaytay', 'antipolo', 'baguio garden']:
    return 'garden'
  return 'banquet_hall'  # PH baseline
```

These are advisory pre-highlights, surfaced as "We think this might be you — change if not" framing. Never auto-applied without explicit confirmation.

---

## Edge cases

1. **Existing events without picker values.** Backfill to defaults (`catholic` + `banquet_hall`) on migration; show a one-time "Confirm your wedding type" banner on next dashboard visit so couples can correct if wrong.
2. **Couple changes mind after vendor shortlist.** Soft-warning flow per § Change-management above.
3. **Couple picks Coming Soon faith.** Email capture + fallback options (continue with closest active faith, or wait for activation).
4. **Mixed-faith couple where both are Coming Soon.** Both halves require email capture; event creation paused until at least one ceremony type is active.
5. **Vendor self-tags incorrectly.** Couple flags via review system ([0006 § reviews](../0006_vendors_management/0006_vendors_management.md)); admin moderation queue ([0023 admin console](../0023_admin_console/0023_admin_console.md)) handles dispute.
6. **Sub-type missing for Muslim/Cultural.** UI hard-validates before saving (can't save without sub-type).
7. **Secondary ceremony same as primary.** UI hard-validates (can't pick Catholic + Catholic as mixed).

---

## Open questions

1. **Region taxonomy granularity.** `wedding_type_launch_status.region` — region-level (`metro_manila`, `cebu`, `davao`) or city-level (`quezon_city`, `cebu_city`)? Recommend region-level for V1.1, city-level if vendor density requires finer control later.
2. **Sub-region BARMM specifics.** Should BARMM split into Maranao zones (Lanao del Sur), Tausug zones (Sulu, Tawi-Tawi), Maguindanao zones for ethno-cultural defaults? Recommend yes for ceremony_sub_type pre-highlighting but no for launch-status granularity.
3. **Cultural sub-types as static enum or admin-editable?** Cultural traditions in PH are diverse; a static enum risks under-coverage. Recommend `cultural` sub-types stored as TEXT with an admin-curated suggested list, allowing free-text for niche traditions.
4. **Auto-suggest engine signals.** Geo, name, family-list — are there other signals worth wiring (e.g., guest-list family surnames, prior event types in the same household)?
5. **Should the picker affect public marketing copy?** E.g., "Setnayan supports Catholic, Civil, INC, Christian, Muslim, and Cultural weddings" on the landing page. Recommend yes at V1.1 launch — brand positioning as "PH wedding platform, not Catholic wedding platform" is strategic.

---

## Cross-references

- Consumes: [0001](../0001_creating_guest_list/0001_creating_guest_list.md) (events table base), [0006](../0006_vendors_management/0006_vendors_management.md) (vendors + canonical_services), [0016](../0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md) (Concierge wizard host), [0021](../0021_couple_dashboard_fully_purchased/0021_couple_dashboard_fully_purchased.md) (couple dashboard event settings host)
- Provides: `events.ceremony_type` + `events.venue_setting` + `events.ceremony_sub_type` + `events.is_mixed_ceremony` + `events.secondary_ceremony_type` + `wedding_type_launch_status` table + `couple_wedding_type_notify_signups` table + `vendors.compatible_ceremony_types[]` + `vendors.compatible_venue_settings[]`
- Consumed by: [0044](../0044_per_category_schemas/0044_per_category_schemas.md), [0045](../0045_product_catalogs/0045_product_catalogs.md), [0046](../0046_wedding_showcase/0046_wedding_showcase.md), [0047](../0047_style_driven_marketplaces/0047_style_driven_marketplaces.md), [0016](../0016_step_by_step_plan_builder/0016_step_by_step_plan_builder.md) Concierge wizard, [0006](../0006_vendors_management/0006_vendors_management.md) vendor marketplace filtering, [0028](../0028_email_notifications/0028_email_notifications.md) email templates

---

## Decision log

- **2026-05-18 — Iteration drafted.** Concept locked across multi-turn session: 7 ceremony types, 7 venue settings, conditional sub-types for Muslim/Cultural, secondary ceremony for mixed, V1.1 ships 2 active + 4 Coming Soon, schema supports all 7 from day 1 to avoid migrations. Catering faith-compatibility tags (Halal/INC/etc.) live in 0044 per-category schemas as a shared attribute group. Self-filtering pattern means category-level hiding isn't needed — vendor compatibility tags handle exclusion (Lechonero example).
