# Nav / Icon / Menu Registry — Design & Slot Map

> 2026-06-16 · Source-of-truth blueprint for the admin-managed system that sets the **name (label) AND icon** of every menu/route across Setnayan, for **all account types** (customer · vendor · admin · public). Owner: *"all icons and namings are there … these will set the source for all the icons and menus on setnayan for all accounts."* Produced by the `icon-menu-registry-map` discovery workflow (6 parallel readers → synthesizer) + manual recovery of the admin-tile + Studio-catalog gaps.

## Headline

- **176 deduped slots** (187 rows) across: customer 75 · vendor 35 · admin 52 · public 14
- **route-meta.ts is imported NOWHERE today** — every live nav hardcodes its own icon+label. So this is *green-field wiring*, not a migration of a live system: the registry becomes the single import.
- Two labels use i18n keys (`nav.hosts`, `nav.notifications`); all ~174 others are literal strings → a real inconsistency to normalize.
- One custom (non-Lucide) mark: `SetnayanMark` inline SVG (public Home + customer bottom-nav Home), paints in currentColor.

## Architecture (recommended)

**Code defaults + sparse DB overrides + a resolver.** Keeps defaults version-controlled (the route-meta successor) and avoids a 176-row SQL seed.

1. `lib/nav-registry-defaults.ts` — the canonical 176-slot list (key · scope · area · route · kind · default label/labelKind · default icon{kind,lucideName,customRef} · sortOrder). Generated from this map; replaces scattered hardcoded icons over time.
2. `nav_slot_override` table (DB) — only the slots an admin actually changed: label, icon_kind, lucide_name, custom_url, is_hidden. RLS public-read / admin-write.
3. `lib/nav-registry.ts` — fetches overrides (cached/ISR), merges with code defaults → resolved map; `getSlot(key)` / `getArea(scope,area)`; falls back to baked defaults if the fetch fails.
4. `<DynamicIcon slot=… />` + `<DynamicLabel slot=… />` — render lucide name → component, custom_url → `<img>`/inline SVG, or none.
5. `/admin/menus` — grouped by scope→area; per row: inline label edit · searchable Lucide picker · custom SVG/PNG upload (→R2) · hide toggle · reset-to-default. Group headings (kind=`group`) editable too.

## Build phasing

0. Phase 0 — Audit lock: freeze this registry as the canonical slot list; choose ONE slot_key convention (<scope>.<area>.<kebab-name>) and reconcile the camelCase/kebab drift across route-meta + the 4 nav configs.
1. Phase 1 — Foundation: migration creates nav_slot + nav_slot_override + nav_slot_resolved view with RLS (public read / is_admin write); add a Lucide-name allowlist + custom_url(R2) validation in app code.
2. Phase 2 — Seed: generate the nav_slot seed rows directly from lib/route-meta.ts (172) PLUS the slots route-meta lacks (bottom-nav custom-SVG Home, studio add-on cards from add-ons-catalog, profile-menu, guest-journey, marketing/site-nav, control tabs) so every slot in this registry exists as a default row.
3. Phase 3 — Resolver lib: add lib/nav-registry.ts that fetches nav_slot_resolved (cached/ISR), maps icon_kind+lucide_name->Lucide component / custom_url-><img|inline SVG>, and exposes getSlot(slot_key) + getArea(scope,area); fall back to baked route-meta defaults if the fetch fails.
4. Phase 4 — Admin page: build /admin/nav-registry (or a tab under /admin/website) — grouped by scope+area, inline label edit + Lucide picker + custom-SVG upload + hide toggle + reset-to-default; two-admin gate only if owner deems naming load-bearing.
5. Phase 5 — Wire CUSTOMER chrome: refactor sidebar-item/sidebar-section/bottom-nav/sub-nav/profile-menu to resolve via lib/nav-registry; convert customer-nav-config + customer-bottom-nav + guest-journey to pass slot_keys (keep IA/grouping, drop hardcoded glyph/label). Verify the Home dual-icon (Lucide sidebar vs SetnayanMark bottom-nav) renders from two distinct slots.
6. Phase 6 — Wire VENDOR chrome: convert vendor-sidebar + vendor-bottom-nav + vendor-mobile-landing (/more) to read the SAME vendor.* slots so sidebar and /more never drift; keep role-gating + isMusicVendor in code (registry governs naming/glyph only).
7. Phase 7 — Wire ADMIN chrome: convert admin-sidebar + admin-bottom-nav AND consolidate app/admin/_overview-tile ICONS onto the same admin.* slots so the landing tiles and sidebar share one source.
8. Phase 8 — Wire PUBLIC + STUDIO catalog: route marketing site-nav/site-header/vendor-nav label overrides and the add-ons-catalog Studio cards through the registry; retire direct route-meta imports.
9. Phase 9 — Cleanup + guardrail: delete per-config hardcoded icon/label literals, add an ESLint/CI check that nav readers import only from lib/nav-registry (no raw Lucide refs in *-nav-config / *-sidebar / *-bottom-nav), and add a seed-vs-DB drift test.

## Conflicts to resolve (the registry makes these fixable from admin)

- DUPLICATE-DEST DIFFERENT-ICON (kept as 2 slots, intentional): route /dashboard/[eventId] (customer Home) renders Lucide 'Home' in the sidebar (customer.sidebar.home) but custom SVG 'SetnayanMark' in the bottom-nav (customer.bottom-nav.home). The registry must allow per-surface icon override; do NOT collapse these.
- DUPLICATE-DEST DIFFERENT-LABEL: route /vendor-dashboard renders 'Overview' in sidebar (vendor.sidebar.overview) vs 'Home' in bottom-nav (vendor.bottom-nav.home); also /admin renders 'Overview' (sidebar) vs 'Home' (bottom-nav). Same destination, deliberately different label per surface — two slots each.
- DUPLICATE-DEST DIFFERENT-LABEL: route /admin/concierge-abuse labeled 'Setnayan AI abuse' in both admin sources but route-meta key is admin.conciergeAbuse — naming drift between the 'concierge' code id and the 'Setnayan AI' display label (Concierge was retired; reconcile naming).
- SAME-ICON SEMANTIC COLLISION (Wallet): used for customer Budget, customer Payouts(admin), vendor Earnings AND vendor Payment-options ('How clients pay you') AND admin Payouts. Vendor Earnings + vendor Payment-options sit in the same dashboard with identical Wallet glyph — visually ambiguous; recommend distinct glyphs (e.g. Wallet vs Landmark/HandCoins).
- SAME-ICON SEMANTIC COLLISION (Tag): admin Discount-codes, admin Taxonomy, vendor Attributes, vendor Redeem-code all use 'Tag'. Within the vendor dashboard, Attributes + Redeem-code share Tag.
- SAME-ICON SEMANTIC COLLISION (Music): vendor Repertoire, admin Pakanta, admin Songs, AND four customer Studio cards (Music Creator / Playlist / Pakanta) all use 'Music' — four Studio cards with the identical glyph.
- SAME-ICON SEMANTIC COLLISION (Sparkles): customer Studio, customer Personalization, vendor Real Stories, customer LED Background, admin Add-ons all use 'Sparkles'.
- SAME-ICON SEMANTIC COLLISION (QrCode): customer Event QR, guest-journey Day-of, customer Day-of route, vendor payment-option QR, Custom-QR-guest add-on all use 'QrCode'.
- SAME-ICON SEMANTIC COLLISION (Globe vs Globe2): /site-editor + vendor/admin Website use 'Globe' while Landing-Page add-on uses 'Globe2' — near-identical glyphs for related-but-distinct concepts; pick one convention.
- SAME-ICON SEMANTIC COLLISION (BarChart3): admin Funnels, admin Insights, customer guest-carousel Summary all use 'BarChart3'.
- SAME-ICON SEMANTIC COLLISION (Users): customer Guests, vendor Clients, vendor Team, admin Users, admin Directory all use 'Users'.
- SAME-ICON SEMANTIC COLLISION (LayoutGrid): customer Seating, guest-journey Seat, website-editor Widgets, customer Design-bottom(Palette differs) all use 'LayoutGrid'.
- LABEL-SOURCE AMBIGUITY (i18nKey vs literal): only 2 of ~176 slots use i18n keys — customer.route.hosts ('nav.hosts') and customer.route.notifications ('nav.notifications'). Everywhere else the SAME destinations use LITERAL labels (profile-menu Hosts='Heart'+literal 'Hosts'; vendor/admin notifications literal 'Notifications'). The registry must carry labelKind per slot and a translation table; mixed sourcing is a real inconsistency to resolve.
- CUSTOM-SVG (non-Lucide): 'SetnayanMark' inline brand mark used as an icon in exactly 2 slots — public.marketing.home and customer.bottom-nav.home. Registry icon column must support kind='custom' (paints in currentColor).
- NO-ICON slots: profile-menu Profile/Settings/Sign out render as text-only links (defaultIcon empty). All ~21 public marketing/header/vendor-nav items are label-only (no icon). Schema must allow NULL icon.
- KEY-CONVENTION DRIFT across the 4 readers: route-meta uses camelCase nested keys (admin.conciergeAbuse, dashboard.addOns.setnayanAi); nav configs use kebab/dot keys (vendor.grow.redeem-code); CATCH-ALL audit invented yet another (admin-sidebar.concierge-abuse). One canonical slot_key scheme must be chosen (this registry standardizes on <scope>.<area>.<kebab-name>).
- route-meta admin.settings.demoMode + admin.settings.paymentMethods are nested under 'settings' but the live admin sidebar lists Demo-mode and Payment-methods as flat top-level items in different groups — nesting vs flat grouping drift.

## Gaps / open questions

- route-meta.ts is defined but IMPORTED NOWHERE (confirmed in head comment 'nothing imports it yet'). Every live nav reader still hardcodes its own icon+label. The consolidation work is therefore green-field wiring, not a migration of an in-use system — the registry can become the single import.
- Group/section HEADING labels are not captured as slots. Sidebar groups (customer: Setnayan/Plan/Book/Design/Day-of/After; vendor: Home/Work/Grow/Business; admin: 6 groups) all have literal heading strings that an admin-managed naming system should also own. Add a 'group' slot kind.
- Mobile activeMatch umbrellas (e.g. customer Studio includes /add-ons/* tree; vendor More enumerates every non-tab route) are behavior, not label/icon — but they encode which slot 'owns' a route. The registry should optionally store the route-match prefix so orphan-prevention stays single-sourced.
- Admin overview landing tiles (app/admin/_overview-tile.tsx ICONS map) is a SECOND admin icon source not fully enumerated in any reader — it can silently drift from the sidebar. Needs its own slots or must alias admin.sidebar.* keys.
- Customer 'design' bottom-nav tab routes to /dashboard/[eventId]/design but no corresponding sidebar slot or route-meta entry exists for a bare /design hub — possible orphan or umbrella-only tab; verify the route resolves.
- route-meta lists customer routes with NO live nav consumer (Documents, Manpower, Orders, Paperwork, Sponsors, Invitation, guests/claims as 'Invite/Confirm', guests/checkin) — these are 'prepared but unwired' destinations. They belong in the registry as defaults but the readers don't surface them yet; flag whether they should appear in nav.
- Two different labels exist for /dashboard/[eventId]/guests/claims: guest-journey calls it 'Confirm', route-meta calls it 'Invite / Confirm'. Pick the canonical display label.
- Two labels for /dashboard/[eventId]/add-ons: 'Studio' (nav) vs route-meta dashboard.addOns.index 'Studio' (consistent) but the add-ons hub page itself may title it differently — verify hub title.
- Group-level section ordering / display-order is not captured anywhere as data; if admins can rename, they will likely also want to reorder — schema should include a sort_order column even if v1 admin UI doesn't expose it.
- No reader captured the AUTH pages, error pages, cookie-consent, or onboarding wizard chrome — out of scope for nav labels but confirm they need no admin-managed naming.
- Customer profile-menu items appear TWICE in the raw inventories (profile-menu.tsx reader + CATCH-ALL) with slightly different defaultIcon ('' vs 'customSVG:None') — normalized here to NULL icon; confirm the three account items intentionally have no glyph.
- Vendor 'Repertoire' is conditionally shown (isMusicVendor gate) and several vendor items are role-gated (agent/viewer see only 4). Registry stores label/icon but NOT visibility rules — confirm gating stays in code and registry only governs naming/glyph.

## Chokepoint components to rewire

- `app/_components/nav/sidebar-item.tsx` — Leaf renderer (sidebar)
- `app/_components/nav/sidebar-section.tsx` — Group/section renderer (sidebar)
- `app/_components/nav/bottom-nav.tsx` — Mobile tab-bar renderer (all scopes)
- `app/_components/nav/sub-nav.tsx` — Docked floating-pill subnav renderer
- `app/_components/profile-menu.tsx` — Profile dropdown renderer (customer)
- `app/dashboard/[eventId]/_components/customer-nav-config.ts` — Customer sidebar config (source of truth today)
- `app/dashboard/[eventId]/_components/customer-bottom-nav.tsx` — Customer mobile-tab config
- `app/admin/_components/admin-sidebar.tsx` — Admin sidebar config (source of truth today)
- `app/admin/_components/admin-bottom-nav.tsx` — Admin mobile-tab config
- `app/vendor-dashboard/_components/vendor-sidebar.tsx` — Vendor sidebar config (source of truth today)
- `app/vendor-dashboard/_components/vendor-bottom-nav.tsx` — Vendor mobile-tab config
- `app/vendor-dashboard/more/_components/vendor-mobile-landing.tsx` — Vendor /more card-grid renderer
- `lib/route-meta.ts` — Prepared static SSOT skeleton (NOT yet imported)
- `lib/add-ons-catalog.ts` — Dynamic Studio add-on catalog
- `app/_components/marketing/site-nav.tsx` — Marketing top-nav renderer (public)
- `app/admin/_overview-tile.tsx` — Admin overview tile icon map (ICONS)

## Shared icons (collision candidates)

- Wallet (~6: customer Budget, customer build-pin Budget, admin Payouts, vendor Earnings, vendor Payment-options, customer-sidebar Budget)
- Users (~7: customer Guests, vendor Clients, vendor Team, admin Users, admin Directory, vendor-sidebar Clients/Team)
- Music (~7: vendor Repertoire, admin Pakanta, admin Songs, Studio Music-Creator, Studio Playlist, Studio Pakanta, website-editor site-chrome)
- Sparkles (~7: customer Studio, Personalization, vendor Real-Stories, Studio LED, Studio index, admin Add-ons)
- QrCode (~6: customer Event-QR, guest-journey Day-of, vendor payment QR, Studio Custom-QR-guest, find-* none)
- Tag (~5: admin Discount-codes, admin Taxonomy, vendor Attributes, vendor Redeem-code)
- Home (~6: customer sidebar Home, vendor Overview, vendor bottom Home, admin Overview, admin bottom Home)
- Briefcase (~4: vendor Bookings sidebar+bottom, admin Vendors)
- Palette (~5: customer Mood-Board, customer Design tab, vendor Moodboard-library, admin Moodboard-library, Studio Mood-Board)
- Globe (~4: customer Website, vendor Website sidebar+bottom, admin Website)
- MessageSquare (~5: customer Messages, vendor Messages sidebar+bottom)
- CalendarDays (~4: vendor Calendar sidebar+bottom, admin Events)
- FileText (~4: customer Contracts, customer Documents, vendor Proposals, admin)
- BarChart3 (~3: admin Funnels, admin Insights, guest-carousel Summary)
- Menu (~3: customer/vendor/admin bottom-nav More)
- customSVG:SetnayanMark (2: public marketing Home, customer bottom-nav Home)
- LayoutGrid (~4: customer Seating, guest-journey Seat, website-editor Widgets)
- Landmark (~3: admin Payment-methods, vendor payment Bank, vendor Payment-options sidebar partial)

## Proposed schema (DDL sketch — from synthesizer; adapt to code-defaults model)

```sql
-- ============================================================
-- Admin-managed NAV REGISTRY: slot defaults + overrides
-- Defaults seed from lib/route-meta.ts (172 bindings) at migration time.
-- Two-layer model: nav_slot (system catalog, seeded) + nav_slot_override
-- (admin edits). Readers merge: COALESCE(override, default).
-- RLS at CREATE TABLE time per Setnayan convention. Helper: public.is_admin().
-- ============================================================

-- 1) System catalog of every nameable/iconable slot (seeded from code; rarely changes)
CREATE TABLE public.nav_slot (
  id              bigserial PRIMARY KEY,
  public_id       text NOT NULL DEFAULT public.generate_public_id('N'), -- S89N-...
  slot_key        text NOT NULL UNIQUE,            -- '<scope>.<area>.<name>' e.g. 'admin.sidebar.payouts'
  account_scope   text NOT NULL CHECK (account_scope IN ('customer','vendor','admin','shared','public')),
  area            text NOT NULL,                   -- 'admin-sidebar' | 'customer-bottom-nav' | 'studio-addon-hub' | ...
  route           text,                            -- nullable: control tabs / non-routed slots
  kind            text NOT NULL DEFAULT 'item' CHECK (kind IN ('item','group','tab','control')),
  -- baked-in DEFAULTS (the route-meta seed):
  default_label        text,                       -- literal default label
  default_label_i18n   text,                       -- i18n key when labelKind='i18nKey' (e.g. 'nav.hosts')
  default_label_kind   text NOT NULL DEFAULT 'literal' CHECK (default_label_kind IN ('literal','i18nKey')),
  default_icon_kind    text NOT NULL DEFAULT 'lucide' CHECK (default_icon_kind IN ('lucide','custom','none')),
  default_lucide_name  text,                        -- 'Wallet' | 'Home' | ...  (NULL when none/custom)
  default_custom_url   text,                        -- e.g. SetnayanMark asset ref (NULL unless custom)
  sort_order      integer NOT NULL DEFAULT 0,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.nav_slot ENABLE ROW LEVEL SECURITY;
-- public read (nav chrome is rendered everywhere, incl. logged-out marketing):
CREATE POLICY nav_slot_read  ON public.nav_slot FOR SELECT USING (true);
CREATE POLICY nav_slot_write ON public.nav_slot FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX nav_slot_scope_area_idx ON public.nav_slot (account_scope, area, sort_order);

-- 2) Admin overrides (only rows admins actually changed; sparse)
CREATE TABLE public.nav_slot_override (
  id            bigserial PRIMARY KEY,
  slot_key      text NOT NULL UNIQUE REFERENCES public.nav_slot(slot_key) ON UPDATE CASCADE ON DELETE CASCADE,
  label         text,                              -- NULL => keep default
  label_i18n    text,                              -- override i18n key
  label_kind    text CHECK (label_kind IN ('literal','i18nKey')),
  icon_kind     text CHECK (icon_kind IN ('lucide','custom','none')),
  lucide_name   text,                              -- validated app-side against the bundled Lucide set
  custom_url    text,                              -- R2 public URL for an uploaded SVG/mark (R2_PUBLIC_URL host)
  is_hidden     boolean NOT NULL DEFAULT false,    -- admin can hide a slot without code change
  updated_at    timestamptz NOT NULL DEFAULT now(),
  updated_by    uuid REFERENCES auth.users(id),
  CHECK (icon_kind IS DISTINCT FROM 'custom' OR custom_url IS NOT NULL),
  CHECK (icon_kind IS DISTINCT FROM 'lucide' OR lucide_name IS NOT NULL)
);
ALTER TABLE public.nav_slot_override ENABLE ROW LEVEL SECURITY;
CREATE POLICY nav_override_read  ON public.nav_slot_override FOR SELECT USING (true);
CREATE POLICY nav_override_write ON public.nav_slot_override FOR ALL    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- updated_at trigger (reuse existing public.set_updated_at() if present)
CREATE TRIGGER nav_override_touch BEFORE UPDATE ON public.nav_slot_override
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3) Merged read view consumers query (defaults + sparse overrides)
CREATE VIEW public.nav_slot_resolved AS
SELECT s.slot_key, s.account_scope, s.area, s.route, s.kind, s.sort_order,
       COALESCE(o.label,        s.default_label)        AS label,
       COALESCE(o.label_i18n,   s.default_label_i18n)   AS label_i18n,
       COALESCE(o.label_kind,   s.default_label_kind)   AS label_kind,
       COALESCE(o.icon_kind,    s.default_icon_kind)    AS icon_kind,
       COALESCE(o.lucide_name,  s.default_lucide_name)  AS lucide_name,
       COALESCE(o.custom_url,   s.default_custom_url)    AS custom_url,
       COALESCE(o.is_hidden, false)                     AS is_hidden
FROM public.nav_slot s
LEFT JOIN public.nav_slot_override o USING (slot_key)
WHERE s.is_active;
-- (view inherits invoker RLS of base tables; both are public-read.)
```

## Full slot registry

### customer

#### `customer-sidebar` (16)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.sidebar.home` | Home | `Home` | /dashboard/[eventId] |
| `customer.sidebar.studio` | Studio | `Sparkles` | /dashboard/[eventId]/add-ons |
| `customer.sidebar.explore` | Explore | `Compass` | /dashboard/[eventId]/vendors |
| `customer.sidebar.guests` | Guests | `Users` | /dashboard/[eventId]/guests |
| `customer.sidebar.seating` | Seating | `LayoutGrid` | /dashboard/[eventId]/seating |
| `customer.sidebar.schedule` | Schedule | `CalendarClock` | /dashboard/[eventId]/schedule |
| `customer.sidebar.budget` | Budget | `Wallet` | /dashboard/[eventId]/budget |
| `customer.sidebar.messages` | Messages | `MessageSquare` | /dashboard/[eventId]/messages |
| `customer.sidebar.contracts` | Contracts | `FileText` | /dashboard/[eventId]/contracts |
| `customer.sidebar.website` | Website | `Globe` | /site-editor/[eventId] |
| `customer.sidebar.mood-board` | Mood Board | `Palette` | /dashboard/[eventId]/add-ons/mood-board |
| `customer.sidebar.monogram` | Monogram | `Type` | /dashboard/[eventId]/monogram |
| `customer.sidebar.live` | Live Wall | `MonitorPlay` | /dashboard/[eventId]/live |
| `customer.sidebar.event-qr` | Event QR | `QrCode` | /dashboard/[eventId]/event-qr |
| `customer.sidebar.activity` | Activity | `Activity` | /dashboard/[eventId]/activity |
| `customer.sidebar.disputes` | Disputes | `Shield` | /dashboard/[eventId]/disputes |

#### `customer-bottom-nav` (2)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.bottom-nav.home` | Home | `customSVG:SetnayanMark` | /dashboard/[eventId] |
| `customer.bottom-nav.design` | Design | `Palette` | /dashboard/[eventId]/design |

#### `guests-section-subnav` (5)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.guest-journey.build` | Build | `PencilLine` | /dashboard/[eventId]/guests |
| `customer.guest-journey.invite` | Invite | `Send` | /dashboard/[eventId]/guests/invite |
| `customer.guest-journey.confirm` | Confirm | `CircleCheck` | /dashboard/[eventId]/guests/claims |
| `customer.guest-journey.seat` | Seat | `LayoutGrid` | /dashboard/[eventId]/seating |
| `customer.guest-journey.dayof` | Day-of | `QrCode` | /dashboard/[eventId]/guests/checkin |

#### `profile-menu` (5)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.profile-menu.hosts` | Hosts | `Heart` | /dashboard/[eventId]/hosts |
| `customer.profile-menu.personalization` | Personalization | `Sparkles` | /dashboard/[eventId]/details |
| `customer.profile-menu.profile` | Profile | `none` | /dashboard/profile |
| `customer.profile-menu.settings` | Settings | `none` | /dashboard/profile#settings |
| `customer.profile-menu.sign-out` | Sign out | `none` | /auth/sign-out |

#### `customer-route-meta` (11)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.route.documents` | Documents | `FileText` | /dashboard/[eventId]/documents |
| `customer.route.guests-checkin` | Day-of | `QrCode` | /dashboard/[eventId]/guests/checkin |
| `customer.route.guests-claims` | Invite / Confirm | `Send` | /dashboard/[eventId]/guests/claims |
| `customer.route.hosts` | nav.hosts | `UserPlus` | /dashboard/[eventId]/hosts |
| `customer.route.invitation` | Invitation & URL | `Pencil` | /dashboard/[eventId]/invitation |
| `customer.route.manpower` | Manpower | `HardHat` | /dashboard/[eventId]/manpower |
| `customer.route.notifications` | nav.notifications | `Bell` | /dashboard/[eventId]/notifications |
| `customer.route.orders` | Orders | `Receipt` | /dashboard/[eventId]/orders |
| `customer.route.paperwork` | Paperwork / Government paperwork | `ScrollText` | /dashboard/[eventId]/paperwork |
| `customer.route.profile` | My account | `CircleUser` | /dashboard/profile |
| `customer.route.sponsors` | Sponsors | `Star` | /dashboard/[eventId]/sponsors |

#### `website-editor` (5)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.website-editor.dress-code` | Edit dress code | `Shirt` | /dashboard/[eventId]/website/dress-code |
| `customer.website-editor.photo-moments` | Edit photo moments | `Camera` | /dashboard/[eventId]/website/photo-moments |
| `customer.website-editor.privacy` | Who can view | `Lock` | /dashboard/[eventId]/website/privacy |
| `customer.website-editor.site-chrome` | Edit music & video | `Music` | /dashboard/[eventId]/website/site-chrome |
| `customer.website-editor.widgets` | Customize widgets | `LayoutGrid` | /dashboard/[eventId]/website/widgets |

#### `studio-addon-hub` (19)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.studio.setnayan-ai` | Setnayan AI | `Gem` | /dashboard/[eventId]/add-ons/setnayan-ai |
| `customer.studio.orders` | Orders | `Receipt` | /dashboard/[eventId]/orders |
| `customer.studio.save-the-date` | Save the Date Video | `Video` | /dashboard/[eventId]/add-ons/save-the-date |
| `customer.studio.landing-page` | Landing Page | `Globe2` | /dashboard/[eventId]/add-ons/landing-page |
| `customer.studio.music-creator` | Music Creator | `Music` | /dashboard/[eventId]/add-ons/music-creator |
| `customer.studio.playlist` | Playlist | `Music` | /dashboard/[eventId]/add-ons/playlist |
| `customer.studio.pakanta` | Pakanta | `Music` | /dashboard/[eventId]/add-ons/pakanta |
| `customer.studio.animated-monogram` | Monogram Creator | `Type` | /dashboard/[eventId]/add-ons/animated-monogram |
| `customer.studio.custom-qr-guest` | Custom QR per guest | `QrCode` | /dashboard/[eventId]/add-ons/custom-qr-guest |
| `customer.studio.papic` | Papic | `Camera` | /dashboard/[eventId]/add-ons/papic |
| `customer.studio.panood` | Panood | `Tv` | /dashboard/[eventId]/add-ons/panood |
| `customer.studio.panood-broadcast` | Open broadcaster preview | `Tv` | /dashboard/[eventId]/add-ons/panood/broadcast |
| `customer.studio.photo-delivery` | Photo Delivery | `ImageDown` | /dashboard/[eventId]/add-ons/photo-delivery |
| `customer.studio.patiktok` | Patiktok | `Film` | /dashboard/[eventId]/add-ons/patiktok |
| `customer.studio.supplies-marketplace` | Paprint | `Printer` | /dashboard/[eventId]/add-ons/supplies-marketplace |
| `customer.studio.led` | LED Background | `Sparkles` | /dashboard/[eventId]/add-ons/led |
| `customer.studio.indoor-blueprint` | Indoor Blueprint | `MapPin` | /dashboard/[eventId]/add-ons/indoor-blueprint |
| `customer.studio.mood-board` | Mood Board | `Palette` | /dashboard/[eventId]/add-ons/mood-board |
| `customer.studio.index` | Studio | `Sparkles` | /dashboard/[eventId]/add-ons |

#### `budget-build-subnav` (5)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.budget-subnav.summary` | Summary | `Gauge` | /dashboard/[eventId]/budget?tab=summary |
| `customer.budget-subnav.shortlist` | Shortlist | `Bookmark` | /dashboard/[eventId]/budget?tab=shortlist |
| `customer.budget-subnav.build` | Build | `Hammer` | /dashboard/[eventId]/budget?tab=build |
| `customer.budget-subnav.compare` | Compare | `Scale` | /dashboard/[eventId]/budget?tab=compare |
| `customer.budget-subnav.lock` | Lock | `Lock` | /dashboard/[eventId]/budget?tab=lock |

#### `budget-build-control` (3)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.build-pin.budget` | Budget | `Wallet` |  |
| `customer.build-pin.services` | Services | `ListChecks` |  |
| `customer.build-pin.date` | Date | `CalendarRange` |  |

#### `guests-mobile-carousel` (5)

| slot_key | label | icon | route |
|---|---|---|---|
| `customer.guest-carousel.summary` | Summary | `BarChart3` | /dashboard/[eventId]/guests?panel=summary |
| `customer.guest-carousel.search` | Search | `Search` | /dashboard/[eventId]/guests?panel=find |
| `customer.guest-carousel.add` | Add | `UserPlus` | /dashboard/[eventId]/guests?panel=add |
| `customer.guest-carousel.customize` | Customize | `SlidersHorizontal` | /dashboard/[eventId]/guests?panel=customize |
| `customer.guest-carousel.journey` | Journey | `Route` | /dashboard/[eventId]/guests?panel=journey |

### vendor

#### `vendor-sidebar` (26)

| slot_key | label | icon | route |
|---|---|---|---|
| `vendor.sidebar.overview` | Overview | `Home` | /vendor-dashboard |
| `vendor.sidebar.profile` | Profile | `User` | /vendor-dashboard/profile |
| `vendor.sidebar.website` | Website | `Globe` | /vendor-dashboard/website |
| `vendor.sidebar.bookings` | Bookings | `Briefcase` | /vendor-dashboard/bookings |
| `vendor.sidebar.calendar` | Calendar | `CalendarDays` | /vendor-dashboard/calendar |
| `vendor.sidebar.clients` | Clients | `Users` | /vendor-dashboard/clients |
| `vendor.sidebar.messages` | Messages | `MessageSquare` | /vendor-dashboard/messages |
| `vendor.sidebar.services` | Services | `ClipboardList` | /vendor-dashboard/services |
| `vendor.sidebar.contracts` | Contracts | `FileSignature` | /vendor-dashboard/contracts |
| `vendor.sidebar.proposals` | Proposals | `FileText` | /vendor-dashboard/proposals |
| `vendor.sidebar.repertoire` | Repertoire | `Music` | /vendor-dashboard/repertoire |
| `vendor.sidebar.attributes` | Attributes | `Tag` | /vendor-dashboard/attributes |
| `vendor.sidebar.subscription` | Subscription | `Crown` | /vendor-dashboard/subscription |
| `vendor.sidebar.tokens` | Tokens | `Coins` | /vendor-dashboard/tokens |
| `vendor.sidebar.redeem-code` | Redeem code | `Tag` | /vendor-dashboard/redeem-code |
| `vendor.sidebar.marketing` | Marketing | `Megaphone` | /vendor-dashboard/marketing |
| `vendor.sidebar.verify` | Verify | `ShieldCheck` | /vendor-dashboard/verify |
| `vendor.sidebar.reviews` | Reviews | `Star` | /vendor-dashboard/reviews |
| `vendor.sidebar.real-stories` | Real Stories | `Sparkles` | /vendor-dashboard/real-stories |
| `vendor.sidebar.recaps` | Recaps | `Images` | /vendor-dashboard/recaps |
| `vendor.sidebar.moodboard-library` | Moodboard library | `Palette` | /vendor-dashboard/moodboard-library |
| `vendor.sidebar.earnings` | Earnings | `Wallet` | /vendor-dashboard/earnings |
| `vendor.sidebar.payment-options` | How clients pay you | `Wallet` | /vendor-dashboard/payment-options |
| `vendor.sidebar.manpower` | Manpower | `HardHat` | /vendor-dashboard/manpower |
| `vendor.sidebar.branches` | Branches | `Building2` | /vendor-dashboard/branches |
| `vendor.sidebar.team` | Team & Setnayan | `Users` | /vendor-dashboard/team |

#### `vendor-bottom-nav` (6)

| slot_key | label | icon | route |
|---|---|---|---|
| `vendor.bottom-nav.home` | Home | `Home` | /vendor-dashboard |
| `vendor.bottom-nav.website` | Website | `Globe` | /vendor-dashboard/website |
| `vendor.bottom-nav.bookings` | Bookings | `Briefcase` | /vendor-dashboard/bookings |
| `vendor.bottom-nav.calendar` | Calendar | `CalendarDays` | /vendor-dashboard/calendar |
| `vendor.bottom-nav.messages` | Messages | `MessageSquare` | /vendor-dashboard/messages |
| `vendor.bottom-nav.more` | More | `Menu` | /vendor-dashboard/more |

#### `vendor-topbar` (1)

| slot_key | label | icon | route |
|---|---|---|---|
| `vendor.topbar.notifications` | Notifications | `Bell` | /vendor-dashboard/notifications |

#### `vendor-payment-options` (3)

| slot_key | label | icon | route |
|---|---|---|---|
| `vendor.payment-options.bank` | Bank / e-wallet | `Landmark` |  |
| `vendor.payment-options.qr` | QR code | `QrCode` |  |
| `vendor.payment-options.link` | Payment link | `Link2` |  |

### admin

#### `admin-sidebar` (54)

| slot_key | label | icon | route |
|---|---|---|---|
| `admin.sidebar.overview` | Overview | `Home` | /admin |
| `admin.sidebar.verify` | Verify | `BadgeCheck` | /admin/verify |
| `admin.sidebar.payments` | Payments | `Banknote` | /admin/payments |
| `admin.sidebar.payouts` | Payouts | `Wallet` | /admin/payouts |
| `admin.sidebar.token-sales` | Token sales | `ShoppingBag` | /admin/token-purchases |
| `admin.sidebar.subscriptions` | Subscriptions | `RefreshCw` | /admin/subscriptions |
| `admin.sidebar.payment-options` | Payment options | `CreditCard` | /admin/payment-options |
| `admin.sidebar.disputes` | Disputes | `Shield` | /admin/disputes |
| `admin.sidebar.pax-changes` | Pax changes | `UsersRound` | /admin/pax-changes |
| `admin.sidebar.force-majeure` | Force majeure | `AlertOctagon` | /admin/force-majeure |
| `admin.sidebar.reviews` | Reviews | `Star` | /admin/reviews |
| `admin.sidebar.concierge-abuse` | Setnayan AI abuse | `Flag` | /admin/concierge-abuse |
| `admin.sidebar.account-deletions` | Account deletions | `UserX` | /admin/account-deletions |
| `admin.sidebar.user-reports` | User reports | `MessageSquareWarning` | /admin/user-reports |
| `admin.sidebar.approvals` | Approvals | `CheckCheck` | /admin/approvals |
| `admin.sidebar.social-queue` | Social queue | `Share2` | /admin/social-queue |
| `admin.sidebar.pakanta` | Pakanta queue | `Music` | /admin/pakanta |
| `admin.sidebar.help` | Help | `LifeBuoy` | /admin/help |
| `admin.sidebar.users` | Users | `Users` | /admin/users |
| `admin.sidebar.vendors` | Vendors | `Briefcase` | /admin/vendors |
| `admin.sidebar.demo-vendors` | Demo vendors | `TestTube` | /admin/demo-vendors |
| `admin.sidebar.events` | Events | `CalendarDays` | /admin/events |
| `admin.sidebar.venues` | Venues | `MapPin` | /admin/venues |
| `admin.sidebar.growth` | Growth | `LineChart` | /admin/growth |
| `admin.sidebar.intelligence` | Intelligence | `Radar` | /admin/intelligence |
| `admin.sidebar.funnels` | Funnels | `BarChart3` | /admin/funnels |
| `admin.sidebar.operations-hiring` | Operations & Hiring | `TrendingUp` | /admin/operations-hiring |
| `admin.sidebar.connection-logs` | Connection logs | `Bug` | /admin/connection-logs |
| `admin.sidebar.offline` | Offline daemon | `WifiOff` | /admin/offline |
| `admin.sidebar.pricing` | Pricing | `DollarSign` | /admin/pricing |
| `admin.sidebar.addons` | Add-ons | `Sparkles` | /admin/addons |
| `admin.sidebar.discount-codes` | Discount codes | `Tag` | /admin/discount-codes |
| `admin.sidebar.token-bands` | Token bands | `Coins` | /admin/token-bands |
| `admin.sidebar.budget-planner` | Budget Planner | `PiggyBank` | /admin/budget-planner |
| `admin.sidebar.receipts` | Receipts | `Receipt` | /admin/receipts |
| `admin.sidebar.payment-methods` | Payment methods | `Landmark` | /admin/settings/payment-methods |
| `admin.sidebar.settings` | Settings | `Settings` | /admin/settings |
| `admin.sidebar.onboarding` | Onboarding | `Compass` | /admin/onboarding |
| `admin.sidebar.taxonomy` | Taxonomy | `Tag` | /admin/taxonomy |
| `admin.sidebar.event-types` | Event Types | `PartyPopper` | /admin/event-types |
| `admin.sidebar.refinements` | Refinements | `SlidersHorizontal` | /admin/refinements |
| `admin.sidebar.website` | Website | `Globe` | /admin/website |
| `admin.sidebar.hero-video` | Hero video | `Video` | /admin/hero-video |
| `admin.sidebar.real-stories` | Real Stories | `Newspaper` | /admin/real-stories |
| `admin.sidebar.recaps` | Recaps | `Images` | /admin/recaps |
| `admin.sidebar.ads` | Ads | `Megaphone` | /admin/ads |
| `admin.sidebar.brain` | Setnayan AI brain | `Brain` | /admin/brain |
| `admin.sidebar.moodboard-library` | Moodboard library | `Palette` | /admin/moodboard-library |
| `admin.sidebar.songs` | Songs | `Music` | /admin/songs |
| `admin.sidebar.wedding-types` | Wedding types | `Church` | /admin/wedding-types |
| `admin.sidebar.wedding-traditions` | Wedding traditions | `BookOpen` | /admin/wedding-traditions |
| `admin.sidebar.notifications` | Notifications | `Bell` | /admin/notifications |
| `admin.sidebar.demo-mode` | Demo mode | `Settings` | /admin/settings/demo-mode |
| `admin.sidebar.my-account` | My account | `CircleUser` | /dashboard/profile |

#### `admin-bottom-nav` (6)

| slot_key | label | icon | route |
|---|---|---|---|
| `admin.bottom-nav.home` | Home | `Home` | /admin |
| `admin.bottom-nav.work` | Work | `ListChecks` | /admin/work |
| `admin.bottom-nav.directory` | Directory | `Users` | /admin/directory |
| `admin.bottom-nav.money` | Money | `DollarSign` | /admin/money |
| `admin.bottom-nav.insights` | Insights | `BarChart3` | /admin/insights |
| `admin.bottom-nav.more` | More | `Menu` | /admin/more |

### public

#### `marketing-site` (1)

| slot_key | label | icon | route |
|---|---|---|---|
| `public.marketing.home` | Setnayan brand logo / Home | `customSVG:SetnayanMark` | / |

#### `marketing-site-nav` (5)

| slot_key | label | icon | route |
|---|---|---|---|
| `public.site-nav.explore` | Explore | `none` | /vendors |
| `public.site-nav.for-vendors` | For vendors | `none` | /for-vendors |
| `public.site-nav.our-story` | Our story | `none` | /our-story |
| `public.site-nav.journal` | Journal | `none` | /blog |
| `public.site-nav.real-stories` | Real Stories | `none` | /weddings |

#### `for-vendors-header-nav` (3)

| slot_key | label | icon | route |
|---|---|---|---|
| `public.vendor-nav.for-couples` | For couples | `none` | / |
| `public.vendor-nav.pricing` | Pricing | `none` | /pricing |
| `public.vendor-nav.help` | Help | `none` | /help |

#### `download-page` (3)

| slot_key | label | icon | route |
|---|---|---|---|
| `public.download.page` | Mac app | `Apple` | /download |
| `public.download.mac-api` | Download for Mac | `Download` | /api/download/mac |
| `public.download.qr-png` | Download PNG | `Download` | /api/website/qr/detail |

#### `guest-experience` (2)

| slot_key | label | icon | route |
|---|---|---|---|
| `public.guest.find-my-table` | Find my table | `MapPin` | /guests/find-my-table |
| `public.guest.find-seat` | Find your seat | `MapPin` | /guests/find-seat |

#### `papic-guest-gallery` (1)

| slot_key | label | icon | route |
|---|---|---|---|
| `public.papic.guest` | Be a candid camera | `Camera` | /papic/guest |
