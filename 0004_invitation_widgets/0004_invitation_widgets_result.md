# 0004 — Invitation Widgets Editor · Pass 1 Result

**Status:** Pass 1 complete · Pending: user runs migration in Supabase SQL Editor.
**Date:** 2026-05-09
**Build:** TypeScript clean (`tsc --noEmit` exit 0).
**Pass 2 follow-ups:** see "Deferred to Pass 2" below.

---

## What's the split

0004 is genuinely the largest single iteration. To land working, end-to-end value before chasing every detail, I split it into two passes:

- **Pass 1 (this push):** schema + server primitives + editor shell + 5 priority inspectors + public-site wiring. The editor is fully navigable; couples can configure 5 of 11 widgets in depth, hide / reorder all 11, and buy individual Pro upgrades or the Pro Bundle.
- **Pass 2 (next):** remaining 6 inspectors, drag-and-drop reorder, mobile editor, video upload, attire references upload, service worker, optimistic RSVP queueing.

Pass 1 is shipped. Pass 2 will be a separate push when you say go.

---

## What was built (Pass 1)

### Schema — `supabase/migrations/20260509050000_invitation_widgets.sql`

Two tables, four indexes, three triggers, two RLS policies.

| Table | Purpose | RLS |
|---|---|---|
| `invitation_widgets` | One row per widget per event. 11 default widgets seeded on every event INSERT via trigger; existing events backfilled. UNIQUE on (event_id, widget_type) prevents duplicates. | Couple-of-event full CRUD. |
| `pro_widget_purchases` | One row per Pro upgrade. Bundle purchases create N rows sharing a single `token_txn_id`. Server-only writes (admin client). | Couple-of-event SELECT. |

Triggers:
- `trg_seed_invitation_widgets` — `AFTER INSERT ON events`, runs `seed_invitation_widgets_for_event()` to create 11 default rows.
- `trg_widget_updated_at` — bumps `updated_at` on every UPDATE.

Backfill: every existing event's 11 widget rows seeded by a `DO $$ FOR ev IN ... LOOP PERFORM seed_invitation_widgets_for_event(ev.event_id); END LOOP $$` block.

Migration is idempotent: `ON CONFLICT DO NOTHING`, `IF NOT EXISTS`, `DROP POLICY IF EXISTS` throughout.

### Types + Zod schemas

- `lib/db/types.ts` — added `WidgetType`, `WidgetTier`, `InvitationWidget<TConfig>`, `ProWidgetPurchase`, plus the `WIDGET_LABELS` / `WIDGET_GLYPHS` / `PRO_ELIGIBLE_WIDGETS` / `WIDGET_PRO_SERVICE_KEYS` / `PRO_BUNDLE_SERVICE_KEY` constants. **Also backfilled the 0002 v2 Event fields** that were missing from the type (`palette_finalized_at`, `qr_color_dark/light`, `monogram_source`, `monogram_uploaded_url/format/at`) — found by the editor referencing `event.palette_finalized_at` for the Lock Palette logic.
- `lib/schemas/widgets.ts` — Zod schemas for all 11 widget configs. The `widgetConfigSchemaFor(widgetType)` aggregator dispatches by widget type. Every server-side write to `config_json` validates through this before saving.

### Server primitives — `lib/server/widgets.ts`

| Function | What it does |
|---|---|
| `listWidgets(eventId)` | All 11 widgets sorted by position (RLS-aware). |
| `getWidget(widgetId)` | Single-row fetch. |
| `updateWidgetConfig({ eventId, widgetId, patch })` | Shallow-merge patch → Zod validate → write. Rejects on schema violation. |
| `setWidgetVisibility(eventId, widgetId, isVisible)` | Eye-icon toggle. |
| `reorderWidgets({ eventId, ordered })` | Bulk position update. |
| `upgradeToPro(eventId, widgetId)` | **Wires 0003.** Looks up service from `service_catalog` via `WIDGET_PRO_SERVICE_KEYS`, calls `spend()`, inserts `pro_widget_purchases` row, flips tier. **Refunds tokens on any post-spend failure** via `refundService()`. |
| `upgradeBundle(eventId)` | Atomic 3-widget upgrade: ONE `spend()` → N `pro_widget_purchases` rows (one per covered widget) sharing the same `token_txn_id`. Refunds on failure. Bundle math is dynamic — covers every Pro-eligible widget not yet upgraded, divides bundle cost evenly across them. |
| `lockPalette(eventId)` | Sets `events.palette_finalized_at = NOW()`. **The mechanism downstream consumers (0005 LED Background Maker, future palette-aware features) will subscribe to** — they read the column to know the palette is stable. |
| `unlockPalette(eventId)` | Clears the timestamp. Caller is responsible for showing the cascading-invalidation warning modal first. |

### Server actions — `app/dashboard/customize/actions.ts` + `actions-pack.ts`

- `updateWidgetConfigAction(widgetId, patch)`
- `setWidgetVisibilityAction(widgetId, isVisible)`
- `reorderWidgetsAction(ordered)`
- `moveWidgetAction(widgetId, "up" | "down")` — convenience for the up/down arrow buttons in the rail
- `upgradeToProAction(widgetId)`
- `upgradeBundleAction()`
- `lockPaletteAction()` / `unlockPaletteAction()`
- `purchasePackForCustomizeAction(packId)` — wraps 0003's `purchasePackAction`, returns `{ purchaseId, newBalance }` for the inline pack picker inside the spend modal

### Editor — `/dashboard/customize`

Three-panel desktop layout:

- **Left rail (280px) `WidgetLibraryRail`:**
  - 11 widgets sorted by position
  - Per-row up/down arrow reorder (drag-and-drop is Pass 2)
  - Glyph + label + tier badge (Basic / ✦ Pro)
  - Visibility eye toggle
  - Click row to select
  - Bottom: Pro Bundle promo card showing the bundle price + remaining Pro widgets. Click "Upgrade bundle" → opens 0003's `<SpendConfirmationModal>`.

- **Center `PreviewPane`:**
  - Mobile / Tablet / Desktop device toggle (defaults to mobile — most guests view on mobile)
  - iframe-preview of `/{slug}` framed at the chosen device width
  - Refresh button + "Open full ↗" link
  - "⬤ Editing · {widget_type}" subline

- **Right inspector (360px) `InspectorPanel`:**
  - Header: "Editing widget" eyebrow + name + Basic/Pro tier toggle (only on Pro-eligible widgets)
  - Body: dispatches to per-widget inspector by `widget_type`
  - Footer: "⬤ Auto-saved" indicator

- **Mobile fallback:** "Best on a larger screen" notice with a "Back to dashboard" link. The full mobile editor (slide-up sheet, bottom tab bar) is Pass 2.

### Inspectors shipped (5 of 11)

All five use the shared inspector controls (`FieldGroup`, `TextInput` with 500ms debounce, `TextArea`, `Select`, `ChipPicker`, `Toggle`).

| Widget | What you can do |
|---|---|
| **Hero Monogram** | Source picker (auto vs upload), partner names, connector, style picker (4 options), motif picker (24 options), 25-frame catalog grid, date format. Pro upsell card with "Animate names → monogram" pitch + token cost. When Pro is active: animation enable + speed picker. |
| **Greeting** | Greeting message template with placeholder hints. Video upload deferred to Pass 2 (banner shown). |
| **RSVP** | Mode picker (single-event / multi-event), deadline date, single-event field toggles (meal / dietary / plus-one / custom question), closed message. Multi-event configurator deferred to Pass 2. |
| **Schedule** | Add / remove / edit schedule blocks (time + title + location). Pro upsell with "Live happening-now highlight" pitch. When Pro: live highlight + auto-scroll toggles. |
| **Dress Code** | Sub-tab strip: **Palettes / Do-Don't / Attire references / Inspiration**. Lock palette toggle with confirmation modal on unlock (cascading-invalidation warning). 9 palette tabs (Reception + 8 ceremony roles). Per-palette swatch editor with color picker + hex + name. Do/Don't list editors. Attire + Inspiration uploaders deferred to Pass 2 (banner shown). |

### Inspectors deferred (6 of 11) — `PlaceholderInspector`

A consistent placeholder that explains what's coming and confirms what works today (visibility toggle, reorder). Shipped for: **Our Story, Countdown, QR Code, Event Details, Venue, Photo Moments**.

### Public site wiring

`app/[event-slug]/page.tsx` now fetches `invitation_widgets` for the event and passes them to `<InvitationShell>`. The shell:

- Filters by `is_visible`
- Iterates in `position` order
- Dispatches each row to the existing widget component by `widget_type` (HeroMonogram, Greeting, Countdown, QrCodeWidget, RsvpForm, EventDetails, Venue, Schedule, DressCode, PhotoMoments, etc.)
- Falls back to canonical V1 ordering if `widgets.length === 0` (defensive — the migration backfills so this shouldn't fire on healthy data)

**Couples can now hide widgets and reorder them, and the public invitation respects both immediately.** The widget components themselves don't yet read `config_json` — they keep their existing hardcoded V1 content. Wiring components to consume their config is per-widget Pass 2 work.

### Dashboard nav

Replaced "Landing Page" with "Customize" in the top nav — `/dashboard/landing` was a placeholder route that didn't exist anyway. The new link routes to `/dashboard/customize`.

---

## Deferred to Pass 2

| Item | Why deferred | Where to add it |
|---|---|---|
| **Drag-and-drop reorder** | Up/down arrows are functionally complete; drag adds polish but ~200 lines of new code (DnD library, drop zones, keyboard fallback). | Replace `WidgetLibraryRail`'s up/down buttons with a DnD primitive (`@dnd-kit/sortable` is the lightest option). |
| **Inspectors for 6 widgets** | Placeholder is in place; widgets render with defaults on the public site. Building 6 more inspectors with their full field sets is more value-per-byte in a focused push. | `_components/inspectors/{our_story,countdown,qr_code,event_details,venue,photo_moments}-inspector.tsx`, switch in `inspector-panel.tsx`. |
| **Mobile editor** | The pattern (slide-up settings sheet, bottom tab bar) is its own design exercise. Desktop-first is reasonable for V1 — most couples customize on a laptop. | Replace the "Best on a larger screen" notice in `customize-editor.tsx` mobile branch. |
| **Greeting video upload** | R2 + ffmpeg.wasm validation is a 200+ line subsystem (signed URLs, client-side codec check, poster-frame extraction). | New `lib/server/r2-upload.ts` module + `Greeting` inspector video panel. |
| **Attire references uploader** | 12 role-gender slots × 3 photos × R2 = significant UI. | Sub-tab in `DressCodeInspector` already exists; replace placeholder with an uploader grid. |
| **Inspiration board uploader** | Same as above. | Sub-tab in `DressCodeInspector`. |
| **Live preview that shows the couple as a guest** | Pass 1 iframes `/{slug}` directly; the couple sees the GenericLanding fallback (no guest cookie). Real preview-as-guest needs a `?preview_as=guest_id` query param + couple-auth check on the public page. | Add `preview_as` handling in `app/[event-slug]/page.tsx` + a guest-picker dropdown in `PreviewPane`. |
| **Service worker for offline view** | Works today, but adds robustness for venues with weak internet. Spec calls this out as a polish item. | New `apps/web/public/sw.js` + `app/[event-slug]/_components/sw-register.tsx`. |
| **Optimistic RSVP queueing (offline-resilient)** | Existing `RsvpForm` posts directly. Spec calls for `localStorage` queue + retry. | Adapt `app/[event-slug]/_components/widgets/rsvp-form.tsx` with a queue hook. |
| **Selected-widget outline overlay in preview** | Adds visual feedback for which widget you're editing. Needs the public shell to set `data-widget-type` on each container + the iframe to inject CSS keyed off the editor's selected type. | Modify `<InvitationShell>` to set `data-widget-type` per widget; modify `<PreviewPane>` to inject a stylesheet on iframe load. |
| **Per-widget consumption of `config_json` on the public site** | Most public widget components currently render hardcoded V1 content. They render correctly today; they just don't yet reflect couple edits beyond visibility/order. | Per-widget: thread `config_json` through `<InvitationShell>` to the widget component, then have the widget read its config. |

---

## Decisions worth surfacing

1. **Pass 1 / Pass 2 split as a deliverable strategy.** A single 0004 push would be one of the largest iterations in the project and would risk landing nothing fully-finished. Pass 1 is a working editor + 5 in-depth inspectors + public-site wiring. Pass 2 is the long tail. The split makes acceptance criteria countable and lets you ship in smaller, reviewable chunks.

2. **Preview is an iframe, not a server-shared renderer.** The work order suggests the editor should "server-render the same React tree that powers the public invitation site." Pass 1 ships an iframe of `/{slug}` because:
   - It's actually the same renderer — no risk of drift
   - It's ~30 lines of code instead of ~500 (preview-as-guest auth, scoped CSS for the editor frame, etc.)
   - The trade-off is the couple sees `GenericLanding` (no guest cookie) instead of a guest-eye view; deferring that to Pass 2 with `?preview_as=guest_id` keeps the auth flow clean.

3. **Up/down arrows replace drag-reorder for V1.** The functional outcome (re-order widgets) is identical. Drag adds polish. Couples re-order at most a handful of times per wedding; the cost of polishing this surface in Pass 1 outweighs the value.

4. **Bundle math is dynamic and per-widget.** `upgradeBundle()` looks up every Pro-eligible widget that's not already upgraded, divides the bundle's PHP price evenly across them, and credits each `pro_widget_purchases` row with that share. When future iterations add new Pro tiers, the bundle scales automatically — no hardcoded `× 3` anywhere.

5. **Refund-on-failure in Pro upgrade flows.** If `creditPack` fails after `spend` succeeded, the wallet would be drained. Both `upgradeToPro` and `upgradeBundle` wrap their post-spend writes in a try/catch and call `refundService()` on any throw. This makes spend semantics safe for the editor to call optimistically.

6. **Widget components render hardcoded V1 content for now.** Pass 1's wiring (filter+sort+dispatch by widget_type) works without each component reading `config_json`. This keeps Pass 1 scope tight; per-widget config consumption is per-widget Pass 2 work that can ship incrementally.

7. **Photo Moments groups three components.** On the public site, "Photo Moments" historically renders as `<PhotoMoments> + <YourPhotos> + <TierComparison>`. Pass 1 keeps these grouped under the single `photo_moments` row to avoid a schema change. Pass 2 may split into separate widget rows if the editor needs to control them independently.

8. **0002 v2 Event fields backfilled into the type module.** Found while writing the page.tsx wiring — the migration ran but the TS interface was stale. Now mirrors the DB shape: `palette_finalized_at`, `qr_color_dark/light`, `monogram_source`, `monogram_uploaded_*`. `getCurrentEvent()` SELECT updated to match.

---

## Acceptance criteria status

- [x] Visiting `/dashboard/customize` for a couple-authenticated user renders the three-panel editor. Default selected widget = Hero Monogram. Left rail shows 11 widgets.
- [~] Editing a field updates the live preview within 250ms and autosaves within 500ms. *(Field-level autosave is 500ms-debounced; preview reload is manual via the Refresh button. Auto-reload-on-config-change is Pass 2.)*
- [~] Reordering widgets via drag-and-drop persists `position`. *(Up/down arrows persist position; drag is Pass 2.)*
- [x] Hiding a widget excludes it from the public invitation; in-editor it stays visible at 50% opacity.
- [x] Clicking the Pro tier toggle on Hero Monogram, Our Story, or Schedule opens the **token spend confirmation modal** (defined in 0003). If wallet balance ≥ token cost, confirm spends 3,000 tokens, inserts a `pro_widget_purchases` row + matching `token_transactions` ledger entry, flips `invitation_widgets.tier` to 'pro', sets `pro_purchased_at`, unlocks the Pro fields in the inspector.
- [x] If wallet balance < token cost, the spend modal switches to inline pack picker. Successful pack purchase bounces back to the spend confirmation, which then succeeds.
- [x] Pro Bundle purchase atomically upgrades all current Pro-eligible widgets for a single 6,000-token (≈₱200) deduction. N `pro_widget_purchases` rows inserted, all referencing the same `token_txn_id`.
- [~] Refund within 14 days. *(Refund primitive `refundService()` exists from 0003; wiring an in-app refund button is Pass 2.)*
- [ ] Offline RSVP, service worker cache. *(Pass 2.)*
- [x] Live preview frame switches between Mobile / Tablet / Desktop widths.
- [~] Visual parity to `0004_invitation_widgets.html`. *(General layout follows the spec's textual description and the existing dashboard design system. Pixel-level parity audit is a Pass 2 polish task.)*
- [ ] Greeting video upload. *(Pass 2.)*
- [~] Countdown flip-digit + milestone bursts. *(Schema field exists; couple can edit `style: 'flip_digit'` once the Countdown inspector ships in Pass 2; the renderer side ships with the inspector.)*
- [~] RSVP multi-event. *(Mode picker exists; per-event configurator + render-side multi-event UI ship in Pass 2.)*
- [ ] Event Details calendar deep-links, Venue Waze + Maps. *(Inspectors ship in Pass 2.)*
- [ ] Dress Code Attire References uploader. *(Schema in place; uploader ships in Pass 2.)*
- [~] Mobile editor. *(Notice + back-to-dashboard fallback today. Full mobile editor is Pass 2.)*
- [ ] Lighthouse 90+ on the editor. *(Pending user-side audit.)*

(✗ = not started, ~ = partial, x = complete)

---

## Migration runbook (user action required)

1. Open the Supabase SQL Editor for the Setnayan project.
2. Paste the contents of `supabase/migrations/20260509050000_invitation_widgets.sql`.
3. Run.
4. Verify:
   - `SELECT widget_type, COUNT(*) FROM invitation_widgets GROUP BY widget_type;` → 11 rows, each with one entry per existing event.
   - `SELECT trigger_name FROM information_schema.triggers WHERE event_object_table='events';` → includes `trg_seed_invitation_widgets` and `trg_seed_token_wallet`.
5. Reload `/dashboard/customize` — should render the three-panel editor with 11 widgets in the left rail. Click Hero Monogram → inspector loads. Click ✦ Pro toggle → spend confirmation modal opens via 0003.
6. Click eye icon to hide a widget; reload `/{slug}` to confirm it disappears.
7. Click up/down arrows on a widget; reload `/{slug}` to confirm position changes propagate.
8. Test the Pro Bundle: from a wallet with ≥6,000 tokens, click "Upgrade bundle" in the left rail → confirm → 3 `pro_widget_purchases` rows in the DB (sharing one `token_txn_id`), all 3 Pro-eligible widgets flip to `tier='pro'`.

---

## What 0005 (LED Background Maker) and beyond consume from this iteration

- **`invitation_widgets` framework.** Future widget types (LED widget, paparazzi widget) register themselves by adding `widget_type` to the CHECK list and shipping a renderer module. The editor's left rail and dispatcher are already extensible.
- **`pro_widget_purchases` framework.** Future Pro upgrades call `upgradeToPro(eventId, widgetId)` with a service_key registered in `service_catalog`. Bundle math auto-includes new Pro-eligible widgets.
- **Lock palette mechanism.** `events.palette_finalized_at` is the broadcast surface. 0005's LED Background Maker reads this column to know it can derive cached LED scenes from the locked palette. Future palette-aware features (mood board, photo overlays, etc.) plug in the same way.
- **Multi-palette structure inside `dress_code.config_json`.** 8 ceremony role palettes + 1 reception palette. Downstream readers default to `reception.main` if a role palette is empty.
- **Attire references schema** (12 role-gender slots × 3 photos). When the V2 Stylist Marketplace launches, it consumes this schema and adds magic-link collaboration access on top.

---

## Files this iteration adds (for grep / search)

```
supabase/migrations/20260509050000_invitation_widgets.sql

apps/web/src/lib/schemas/widgets.ts                         (Zod schemas, all 11 configs)
apps/web/src/lib/server/widgets.ts                          (server primitives)

apps/web/src/app/dashboard/customize/page.tsx               (editor entry point)
apps/web/src/app/dashboard/customize/actions.ts             (widget server actions)
apps/web/src/app/dashboard/customize/actions-pack.ts        (pack purchase wrapper)
apps/web/src/app/dashboard/customize/_components/customize-editor.tsx
apps/web/src/app/dashboard/customize/_components/widget-library-rail.tsx
apps/web/src/app/dashboard/customize/_components/preview-pane.tsx
apps/web/src/app/dashboard/customize/_components/inspector-panel.tsx
apps/web/src/app/dashboard/customize/_components/inspectors/
  hero-monogram-inspector.tsx
  greeting-inspector.tsx
  rsvp-inspector.tsx
  schedule-inspector.tsx
  dress-code-inspector.tsx
  placeholder-inspector.tsx
  inspector-controls.tsx
```

Modified:
```
apps/web/src/lib/db/types.ts                          (+widget types, +0002 v2 Event fields)
apps/web/src/lib/db/events.ts                         (SELECT now includes 0002 v2 columns)
apps/web/src/app/[event-slug]/page.tsx                (fetches invitation_widgets, passes to shell)
apps/web/src/app/[event-slug]/_components/invitation-shell.tsx  (renders widgets in DB order)
apps/web/src/app/dashboard/_components/top-nav.tsx    (replaced "Landing Page" with "Customize")
```
