# Iteration 0030 — First-time Guided Tour

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main @ 34347c3c)
> **This spec is HISTORICAL.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas vs what actually shipped:
> - The tour shipped as a **custom slide-modal**, NOT Driver.js — `app/_components/guided-tour.tsx` (+ `mini-tour.tsx` + `guest-guided-tour.tsx`) reads slide definitions from `lib/tours.ts` (`TOURS` / `TourKey`) and tracks completion in `users.tour_seen_keys` via `lib/tour-actions.ts`. There is no spotlight-on-DOM-element library; slides are centered cards with copy + a Lucide icon.
> - **Shipped tour roster (6 keys), not the spec's 8/7/4/6-step set:** welcome tours `couple_welcome_v1` (6 slides), `admin_welcome_v1` (5 slides), `guest_welcome_v1`; mini-tours `customer_vendors_v1`, `admin_users_v1`, `admin_force_majeure_v1`. **No dedicated VENDOR welcome tour** and **not the "11 per-surface mini-tours"** described here.
> - Replay is **not** at `/dashboard/[role]/settings/replay-tour/[tour_key]`; completion state lives in `users.tour_seen_keys` and tours re-fire from layout based on that array.
> - This iteration is **cosmetic** and largely accurate in intent, but any tour copy that mentions **"Setnayan Concierge"** (planner is now **Today's Focus ₱1,499**; Concierge wizard retired, `CONCIERGE_ENABLED=false`) or a **"3% Setnayan Pay convenience fee"** (RETIRED — **commission is 0%**) is stale.
> - Tour analytics into 0023 (§ tour analytics) are not a built surface beyond the `tour_seen_keys` flag.
>
> When this body disagrees with the above, **the above wins.**

**Iteration number:** 0030
**Topic:** A 30-second guided onboarding overlay shown on first login for each account type — customer (couple/organizer), vendor, guest, and admin — that points out the most important parts of the dashboard they just landed on, plus optional deeper mini-tours per major surface.
**Surface:** All four role surfaces (customer dashboard 0021, vendor dashboard 0022, admin console 0023, guest landing 0002 + 0031) inside the same Setnayan app per the one-app-three-doorways architecture (decision 2026-05-11).
**URL pattern:** Tours overlay on top of existing surface URLs — no dedicated route. Replay path: `setnayan.com/dashboard/[role]/settings/replay-tour/[tour_key]`.
**Builds on:** 0000 (auth + role-router), 0021 (customer dashboard surfaces), 0022 (vendor dashboard surfaces), 0023 (admin console + analytics), 0002 + 0031 (guest landing page), 0025 (Settings surface — "Replay onboarding tour" lives here), 0029 (help center is the fallback when the tour ends).
**Status:** Drafted 2026-05-12.
**Phase:** V1. Ships alongside the four dashboards it depends on. Not a hard launch-blocker — the dashboards work without it — but the activation cost of *not* shipping it is high enough that we treat it as Tier-1 polish.

---

## 1. Why this iteration exists

V1 lands new users on visually busy interfaces with no scaffolding:

- **Customer dashboard (0021)** has 9 surfaces (Overview · Guests · Vendors · Schedule · Services · Seat Plan · Landing · QR Hub · Gallery) plus a services-launcher grid, a theme picker, and an avatar menu.
- **Vendor dashboard (0022)** has 6 surfaces (Home · Services · Calendar · Clients · Threads · Team & Setnayan) plus a mandatory logo upload, a Pro subscription card, and a marketplace listing preview.
- **Admin console (0023)** has 7 surfaces (Home · Verification · Payments · Users · Pricing · Disputes · Settings) plus a Team Pool widget, an audit log, and role-gated tools.
- **Guest landing (0002 + 0031)** evolves through 4 lifecycle phases (Save-the-Date · Invitation · Logistics · Gallery) with RSVP, personal QR, and (post-event) tagged photos + personal reel builder.

A first-time user looking at any of these surfaces sees a wall of unfamiliar tabs and buttons. The conversion data from comparable two-sided platforms is unforgiving: every additional second a user spends "figuring out what this is" before their first meaningful action drops activation by measurable percentage points.

**A 30-second guided tour on first login:**

- Names each major surface in one sentence, so the user has a mental map.
- Points at the *one* action that matters most for that role's first session (RSVP for guests, create-first-service for vendors, services-launcher for customers, verification queue for admin verification handlers).
- Tells the user where Settings + Help live so the next question they have has an obvious answer.
- Costs ~30 seconds, is fully skippable, and never re-fires once dismissed.

This iteration is the connective glue between the four big dashboards. Without it, users self-train; with it, the dashboards feel guided from the first second.

---

## 2. Tour mechanics

**Spotlight overlay.** When the tour is active, the rest of the page dims to 60% opacity behind a translucent black scrim (`rgba(0,0,0,0.6)`). The targeted UI element gets a transparent cutout — it's rendered at full brightness, with the rest of the page muted around it. The cutout is a rounded rectangle that hugs the target element's bounding box with 8px of padding on every side.

**Tooltip.** Anchored next to the spotlighted element (top / bottom / left / right based on the target's position on screen — auto-flipped if it would overflow the viewport). Tooltip contents:

- **Step counter** (e.g. "3 of 8") in the top-right corner of the tooltip
- **Title** — short, 3-5 words ("Switch surfaces here")
- **Body** — one sentence, never longer than two ("Tap any tab to jump to that section.")
- **Buttons** row: `Skip tour` (left, ghost button) · `Back` (only shown if step > 1) · `Next` or `Finish` (right, primary button)

**Progress bar.** A thin horizontal bar pinned to the top of the viewport showing tour progress (e.g. `███████░░░ 5 / 8`). Persistent across all steps; updates as the user advances.

**Centered modals.** Steps 1 and N (welcome + farewell) don't spotlight a specific element — they show a centered modal with no cutout, just the dim scrim and the modal card. These bookend the tour with a friendly opening and a confident close.

**Dismissibility.**

- Esc dismisses the current tour at any step (logs `action='skip'` with the step number).
- The `Skip tour` button does the same.
- Clicking the scrim *outside* the tooltip does NOT dismiss — accidental misses shouldn't end the tour. The user has to use Esc or the explicit Skip button.
- The penultimate step shows a "Don't show me this again" checkbox (default checked). Unchecking it means the tour will re-fire on the next login (used by users who want to come back later).

**Reduced motion.** If `prefers-reduced-motion: reduce` is set, the spotlight cutout transition is instant (no fade), the tooltip appears with no slide-in animation, and the progress bar updates without easing.

**Theme parity.** The tooltip card respects the user's theme (Setnayan Default · Victorian · Classy · iOS · Forest Theme — see [theme system](../CLAUDE.md)). Each theme provides its own card background, border, and text colors via CSS variables. The dim scrim is theme-agnostic.

---

## 3. Per-role tour scripts

Each tour is a fixed ordered list of steps. Step targets reference `data-tour-id` attributes that the dashboard iterations add to their key elements. If a target element is missing from the DOM (e.g. logo upload prompt when the logo is already uploaded), that step is silently skipped.

### 3.1 Customer (couple / organizer) — `customer_dashboard_v1` — 8 steps

1. **Welcome modal** (centered, no spotlight) — "Welcome to your Setnayan dashboard, [first_name]. Let me show you around in under a minute." · Buttons: `Skip tour` · `Let's go`
2. **Overview tab** — Title: "Your home base." Body: "This is your overview — today's most important tasks, all in one place." · Target: `[data-tour-id="customer-tab-overview"]`
3. **Bottom nav tabs** — Title: "Navigate the four sections." Body: "Switch between Guests / Vendors / Schedule / Add-ons with these tabs." · Target: `[data-tour-id="customer-bottom-nav"]`
4. **Services-launcher grid** — Title: "Tap to start any service." Body: "Save-the-Date, Papic, Live Stream, Custom Monogram, and more — every in-app service starts here." · Target: `[data-tour-id="services-launcher-grid"]`
5. **Avatar menu (top-right)** — Title: "Your account lives here." Body: "Tap your avatar for Settings, Privacy controls, Payment Methods, and to sign out." · Target: `[data-tour-id="topbar-avatar"]`
6. **Theme picker** — Title: "Make it yours." Body: "Pick a dashboard look: Setnayan Default, Victorian, Classy, iOS, or Forest Theme." · Target: `[data-tour-id="theme-picker"]`
7. **Help link** — Title: "Stuck? Help is one tap away." Body: "The help center has answers for the most common questions, plus you can replay this tour anytime from Settings." · Target: `[data-tour-id="help-link"]` · Has the "Don't show me this again" checkbox.
8. **Farewell modal** (centered, no spotlight) — "You're all set. Each tab also has its own quick walkthrough the first time you open it." · Buttons: `Finish`

### 3.2 Vendor — `vendor_dashboard_v1` — 7 steps

1. **Welcome modal** — "Welcome to Setnayan, [business_name]. Two minutes to get you oriented." · Buttons: `Skip tour` · `Let's go`
2. **Surface tabs at top** — Title: "Your six workspaces." Body: "Home · Services · Calendar · Clients · Threads · Team & Setnayan — switch between them up here." · Target: `[data-tour-id="vendor-tab-bar"]`
3. **Company-logo upload prompt** (only if logo missing — step auto-skipped if already uploaded) — Title: "Upload your company logo." Body: "Customers see this in chat and on your marketplace listing. PNG with transparent background works best." · Target: `[data-tour-id="vendor-logo-upload-prompt"]`
4. **Services tab CTA** — Title: "Create your first service." Body: "Even a single service is enough to publish your profile. Add packages later." · Target: `[data-tour-id="vendor-services-create-cta"]`
5. **Pro subscription card** — Title: "Optional: go Pro." Body: "Pro Weekly (₱499/wk) unlocks unlimited contracts, boost eligibility, and analytics. Skip for now if you'd rather start free." · Target: `[data-tour-id="vendor-pro-card"]`
6. **Setnayan add-ons** — Title: "Use Setnayan for your own events too." Body: "Same dashboard, customer view: Papic, Live Stream, Save-the-Date — for your own anniversary, christening, or staff party." · Target: `[data-tour-id="vendor-switch-to-customer-view"]` · Has the "Don't show me this again" checkbox.
7. **Farewell modal** — "Welcome aboard. Verification takes 3 business days; the help center has a checklist of what's needed." · Buttons: `Finish`

### 3.3 Guest — `guest_landing_v1` — 4 steps

1. **Welcome modal** — "Hi [first_name], you're invited to [organizer_display_name]'s [event_type]." · Buttons: `Skip tour` · `Let's go` · *Centered, no spotlight, includes the event hero image as a subtle background tint.*
2. **RSVP button** — Title: "Let them know you're coming." Body: "Tap here to confirm your attendance. You can update it later if plans change." · Target: `[data-tour-id="guest-rsvp-cta"]`
3. **Personal QR** — Title: "Bring this on the day." Body: "Save this QR — it finds your table and lets paparazzi tag you in photos." · Target: `[data-tour-id="guest-personal-qr"]` · Has the "Don't show me this again" checkbox.
4. **Farewell modal** — "After the event, your tagged photos appear here. You can build a personal 1–30 second reel from them." · Buttons: `Finish`

### 3.4 Admin — `admin_console_v1` — 6 steps

1. **Welcome modal** — "Welcome to the Setnayan admin console, [name]. Your assigned role: [admin_role]." · Buttons: `Skip tour` · `Let's go`
2. **Surface tabs** — Title: "Seven surfaces, role-gated." Body: "Home · Verification · Payments · Users · Pricing · Disputes · Settings — only the surfaces your role can access are clickable." · Target: `[data-tour-id="admin-tab-bar"]`
3. **Team Pool widget** — Title: "Your shared monthly pool." (only shown to non-owner team members) Body: "All non-owner team members share a ₱10K monthly pool for Setnayan services. First-come-first-served; resets on the 1st." · Target: `[data-tour-id="admin-team-pool-widget"]`
4. **Audit log link** — Title: "Everything is logged." Body: "Every admin action is recorded. Major actions (admin promotions, refunds > ₱25K, payment-account changes) require a second admin's approval." · Target: `[data-tour-id="admin-audit-log-link"]`
5. **Support tickets queue** — Title: "Tickets routed to your role." Body: "Customer support tickets land here, filtered to what your role can handle." · Target: `[data-tour-id="admin-support-queue"]` · Has the "Don't show me this again" checkbox.
6. **Farewell modal** — "Read the admin handbook in the help center. Reach out in the internal #setnayan-admin channel if you're stuck." · Buttons: `Finish`

---

## 4. Per-surface mini-tours (deeper dives)

Beyond the first-login tour, each major sub-surface can have its own 3-5 step mini-tour that fires the first time the user lands on that sub-surface — but only if they completed (or skipped past step 4 of) the parent dashboard tour. This prevents new users from being bombarded with overlapping tours on their first session.

### Customer mini-tours

| `tour_key` | Trigger | Steps |
|---|---|---|
| `customer_vendors_v1` | First time user opens Vendors tab | 1. Vendor card layout · 2. The 6-stage progress pips (shortlisted → in-talks → quoted → booked → paid → completed) · 3. Add-vendor CTA |
| `customer_seat_plan_v1` | First time user opens Seat Plan tab | 1. Drag a table from the catalog onto the canvas · 2. Tap a chair to swap a single guest · 3. Tap a table body to swap whole tables · 4. Auto-fill ring rules · 5. Publish to mint QR codes |
| `customer_landing_v1` | First time user opens Landing tab | 1. Lifecycle phases (Save-the-Date → Invitation → Logistics → Gallery) · 2. Per-phase override · 3. Preview-as-guest button |
| `customer_qr_hub_v1` | First time user opens QR Hub | 1. Personal guest QRs · 2. Table QRs · 3. Print pack download |

### Vendor mini-tours

| `tour_key` | Trigger | Steps |
|---|---|---|
| `vendor_services_v1` | First time user opens Services tab | 1. Create a service · 2. Plan builder (packages within a service) · 3. Custom service category vs canonical · 4. Publish toggle |
| `vendor_calendar_v1` | First time user opens Calendar | 1. Block dates · 2. Color-coded statuses (booked/tentative/blocked) · 3. Agent attribution if multi-team |
| `vendor_clients_v1` | First time user opens Clients | 1. Client list (couples who booked you) · 2. Per-client thread shortcut · 3. Per-client booking record |
| `vendor_team_v1` | First time user opens Team & Setnayan | 1. Add team members · 2. Set per-member chat permissions · 3. Switch to customer view |

### Admin mini-tours

| `tour_key` | Trigger | Steps |
|---|---|---|
| `admin_verification_v1` | First time user opens Verification queue | 1. New applications list · 2. Document review pane · 3. Approve / Request changes / Reject flow |
| `admin_payments_v1` | First time user opens Payments | 1. Inbox view (BDO + GCash) · 2. Match-to-order flow · 3. Mark-paid action with reference code · 4. 24-hr SLA timer |
| `admin_disputes_v1` | First time user opens Disputes | 1. Active disputes list · 2. Mediation message thread · 3. Resolution actions (refund / partial / decline) |

Each mini-tour key is namespaced by surface so users only see one tour fire at a time. The dashboard-level tour is the gatekeeper; mini-tours are progressive.

---

## 5. Data model

```sql
-- One row per completed (or explicitly skipped) tour per user.
-- Presence of a row means "do not auto-trigger this tour for this user again."
CREATE TABLE tour_completions (
  user_id          UUID NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  tour_key         TEXT NOT NULL,
  -- e.g. 'customer_dashboard_v1', 'vendor_dashboard_v1', 'guest_landing_v1',
  --      'admin_console_v1', 'customer_vendors_v1', etc.
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  skipped_at_step  INT,         -- nullable; the step number where user skipped (NULL if they finished)
  total_steps      INT NOT NULL,
  dont_show_again  BOOLEAN NOT NULL DEFAULT TRUE,
  -- if FALSE, the tour re-fires on next login (user unchecked the penultimate-step checkbox)
  PRIMARY KEY (user_id, tour_key)
);

-- Per-step analytics, for funnel reporting in 0023 admin analytics.
CREATE TABLE tour_step_views (
  view_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  tour_key     TEXT NOT NULL,
  step_number  INT NOT NULL,
  viewed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  action       TEXT NOT NULL CHECK (action IN ('next','back','skip','complete'))
);

CREATE INDEX tour_step_views_tour_idx ON tour_step_views (tour_key, viewed_at DESC);
CREATE INDEX tour_step_views_user_idx ON tour_step_views (user_id, viewed_at DESC);
```

**No PII in tour rows.** `tour_completions` is a pure user-state table — it records *that* a user saw a tour, not *what* they saw. The tour content lives in TypeScript source files, versioned in code, not in the database.

**Version suffix in `tour_key`.** When a tour script materially changes (new steps added, surfaces re-ordered), we bump the version (`customer_dashboard_v2`). Existing users with a `v1` completion row don't get auto-re-tour'd; they have to opt in via Settings → "Replay onboarding tour" to see the v2 walkthrough. This avoids surprising returning users with a "new" tour on their next login.

---

## 6. Trigger logic + replay flow

**On every page load:**

1. Identify the user's role and the current surface (e.g. customer + `/dashboard/[event_id]/overview` → tour key `customer_dashboard_v1`).
2. Check `tour_completions` for a row matching `(user_id, tour_key)`.
3. If no row exists: schedule the tour to start after a 1.5-second delay (lets the page render so spotlight targets exist in the DOM).
4. If a row exists with `dont_show_again = FALSE`: re-fire the tour on this login (user wanted to come back).
5. If a row exists with `dont_show_again = TRUE`: do not fire.

**Edge cases handled:**

- **Spotlight target missing.** If a `data-tour-id` element is not in the DOM at step-fire time, the step is silently skipped and the tour moves to the next step. The progress bar adjusts (e.g. tour shows as 7 of 8 instead of 8 of 8 if step 3 was skipped). The skipped step is *not* logged as a step_view.
- **User navigates away mid-tour.** Treated as an implicit skip: log `action='skip'` with the current step number, set `skipped_at_step` in `tour_completions`. The tour does not re-fire on the next page load.
- **User uncompletes via Settings replay.** Triggering "Replay onboarding tour" from Settings sets `dont_show_again = FALSE` and re-fires the tour. After completion, the row updates with new `completed_at` + `dont_show_again = TRUE`.

**Replay surface (lives in 0025 Settings).** Settings → Onboarding → "Replay onboarding tour" lists every tour the user is eligible for (based on role), with a status pill per tour: `Completed` / `Skipped at step N` / `Never started`. Tapping any row re-fires that tour immediately.

---

## 7. Implementation approach

**Library decision: Driver.js.** Both Shepherd.js and Driver.js are mature, MIT-licensed, work with vanilla HTML, and are framework-agnostic. We pick **Driver.js** for V1:

- **Smaller footprint:** ~5KB gzipped vs Shepherd's ~30KB. Tours load on every dashboard mount; small payload matters.
- **Simpler API:** Driver.js uses a flat array of step definitions; Shepherd uses a class-based step builder. For our use case (fixed scripts, no dynamic step injection) the flat array is the better fit.
- **No dependencies.** Shepherd pulls in Tippy.js + Popper.js. Driver.js is self-contained.
- **Better TypeScript types.** Driver.js ships first-class TS types out of the box.

**Tour definitions live in TypeScript:**

```
apps/web/src/tours/
  index.ts                        # exports the tour registry
  customer_dashboard.ts           # customer_dashboard_v1
  customer_vendors.ts             # customer_vendors_v1 mini-tour
  customer_seat_plan.ts           # customer_seat_plan_v1 mini-tour
  ...
  vendor_dashboard.ts
  vendor_services.ts
  ...
  guest_landing.ts
  admin_console.ts
  admin_verification.ts
  ...
```

**Step shape:**

```ts
export type TourStep = {
  // Target selector. Null = centered modal (no spotlight).
  target: string | null;
  // i18n key resolved at render time from marketing-copy.{locale}.ts
  titleKey: string;
  bodyKey: string;
  // tooltip position; 'auto' lets Driver.js pick
  side?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  // step-specific conditional skip (e.g. logo step skips if logo present)
  skipIf?: (ctx: TourContext) => boolean;
  // show the "Don't show me this again" checkbox on this step
  showDontShowAgain?: boolean;
};

export type Tour = {
  key: string;             // 'customer_dashboard_v1'
  role: 'customer' | 'vendor' | 'guest' | 'admin';
  surface: string;         // 'dashboard' | 'vendors_tab' | 'landing' | etc.
  steps: TourStep[];
};
```

**Locale resolution.** Step copy is keyed (e.g. `tour.customer.welcome.title`), then resolved at render time against the user's locale bundle (`marketing-copy.en.ts` / `marketing-copy.tl.ts` / `marketing-copy.ceb.ts`). All three locales must have all keys before a tour can ship — enforced by the locale-completeness CI check from 0015.

**Driver.js wiring.**

```ts
import { driver } from 'driver.js';

const d = driver({
  showProgress: true,
  progressText: '{{current}} of {{total}}',
  allowClose: false,         // no clicking-scrim-to-close
  overlayOpacity: 0.6,
  popoverOffset: 10,
  steps: resolveSteps(tour.steps, locale, ctx),
  onPopoverRender: (popover, { state }) => {
    // inject "Don't show me this again" checkbox on the flagged step
  },
  onDestroyed: (element, step, { state }) => {
    // log step_view + update tour_completions
  },
});

d.drive();
```

---

## 8. Accessibility

**Keyboard navigation.**

- `Esc` dismisses the tour.
- `→` / `Enter` advances to the next step.
- `←` retreats to the previous step.
- `Tab` cycles focus through the buttons in the tooltip (Skip · Back · Next).
- Focus traps to the tooltip while it's open. Focus restores to the spotlighted element after dismiss.

**Screen-reader support.**

- Tooltip has `role="dialog"` and `aria-labelledby` / `aria-describedby` pointing at the title + body.
- Spotlighted element has `aria-current="step"` while it's the active step.
- `aria-live="polite"` on the tooltip body so step transitions are announced.

**Visual.**

- Tooltip text contrast ≥ 4.5:1 in all 5 themes (Setnayan Default / Victorian / Classy / iOS / Forest Theme) — enforced by the theme-token contrast audit from 0021.
- Spotlight cutout has a 2px solid border in the theme's accent color so the focused element is visible to low-vision users even with the scrim dimmed.
- Reduced-motion: instant transitions, no slide-in.

**Touch.**

- Tooltip buttons ≥ 44pt tap targets (memory rule: thumb-friendly mobile).
- On mobile, tooltips occupy ≥ 70% of the viewport width with primary actions in the thumb zone (bottom third).

---

## 9. Tour analytics in 0023

Five event types logged into `tour_step_views`:

| Event | Logged when |
|---|---|
| `tour_started` | Tour first renders (step 1 viewed) |
| `step_viewed` | Each subsequent step renders |
| `step_skipped` | User skips a non-final step |
| `tour_completed` | User clicks Finish on the final step |
| `tour_replayed` | User triggers replay from Settings |

**Funnel surface in 0023 admin analytics:**

The admin analytics dashboard (0023 § 7) gains a new card: **Tour funnel**. For each `tour_key`, show:

- Total users eligible (have the role, have logged in)
- Started (step 1 viewed)
- Step-by-step retention (1 → 2 → 3 → … → final)
- Completed
- Skipped (with breakdown by step where they skipped)
- Replayed (count of users who replayed at least once)

**Why this matters.** If we see 70% of customers skipping at step 4 (services-launcher grid), the copy probably isn't landing. If we see 90% of vendors finishing their tour but only 30% of guests, the guest tour might be too long. The funnel data drives copy iterations on a per-tour basis.

---

## 10. Composition with 0021 / 0022 / 0023 / 0031

**0021 customer dashboard.** Adds `data-tour-id` attributes to: tab bar, services-launcher grid, avatar menu, theme picker, help link. Also adds the four customer mini-tour `data-tour-id` markers to: vendors tab, seat plan canvas, landing tab lifecycle picker, QR hub.

**0022 vendor dashboard.** Adds `data-tour-id` attributes to: tab bar, logo-upload prompt, Services CTA, Pro card, customer-view switcher. Plus mini-tour markers on Services / Calendar / Clients / Team & Setnayan.

**0023 admin console.** Adds `data-tour-id` attributes to: tab bar, Team Pool widget, audit log link, support tickets queue. Plus mini-tour markers on Verification queue, Payments inbox, Disputes list. Also gains the Tour funnel analytics card.

**0031 guest landing (post-0030).** Adds `data-tour-id` attributes to: RSVP button, personal QR display. Note: 0031 is the iteration that wraps 0002 in a full guest dashboard; this iteration forward-references 0031 since the guest tour lands on that surface.

**0025 Settings.** Adds the Onboarding section with "Replay onboarding tour" subsection listing all role-eligible tours.

**0029 help center.** The farewell step of each tour links to the relevant help-center landing (`/help/getting-started/[role]`). Help center content for first-time users mirrors the tour scripts so the user has a re-readable version of what the tour told them.

---

## 11. Voice + tone

The same luxurious-Filipino-modern register from 0015 marketing copy applies (locked 2026-05-11). EN is primary; TL and CEB bundles ship complete.

**Style rules for tour copy:**

- **Conversational, not instructional.** "Your home base" beats "This is the overview tab where you can see your tasks."
- **Direct address.** "Tap here" not "Users can click this button."
- **One sentence per body.** Two max if absolutely necessary. Long copy in a tooltip gets skipped.
- **No exclamation marks.** Calm voice — luxurious restraint per 0015's editorial register.
- **No emoji.** Lucide icons only, per the icon system (locked 2026-05-12).
- **First-name personalization** on the welcome modal only. "Welcome, Maria." Subsequent steps don't repeat the name (annoying).
- **Tagalog phrase in TL bundle warm spots.** TL version of step 1 welcome: "Kumusta, [name]. Pag-aralan natin nang sandali ang dashboard mo." CEB equivalent: "Maayong pag-abot, [name]. Imantala lang nato ang dashboard mo."
- **No engineering-spec voice.** Banned: "Apparatus," "surface," "flywheel," "role-router," "doorway" — even though they're locked terms in the project, public-facing copy uses everyday words.

All tour copy lives in `marketing-copy.{locale}.ts` under the `tour.*` namespace so it ships through the same localization pipeline as the rest of the marketing site.

---

## 12. Acceptance tests

| # | Test | Pass criteria |
|---|---|---|
| 1 | New customer signs up, lands on dashboard | Tour fires 1.5s after page render; step 1 welcome modal is centered + dimmed scrim visible |
| 2 | Customer completes all 8 steps | `tour_completions` row created with `total_steps=8`, `skipped_at_step=NULL`, `dont_show_again=TRUE` |
| 3 | Customer signs out, signs back in | Tour does NOT re-fire |
| 4 | Customer goes to Settings → Replay onboarding tour | Tour re-fires; on completion, `completed_at` updates |
| 5 | Vendor with logo already uploaded sees the tour | Step 3 (logo upload prompt) is silently skipped; tour shows 6 of 6 effective steps (not 7) |
| 6 | Guest opens the landing page tour, presses Esc on step 2 | Tour dismisses; `tour_completions` row has `skipped_at_step=2`, `action='skip'` logged in `tour_step_views` |
| 7 | Admin with the Verification Handler role lands on console | Admin tour fires; step 1 welcome modal references "Verification Handler" by role |
| 8 | User on Tagalog locale starts the tour | All step copy renders from `marketing-copy.tl.ts`; the "Set na 'yan." brand phrase appears in the farewell modal |
| 9 | User with `prefers-reduced-motion: reduce` starts the tour | Spotlight transitions are instant; no slide-in animation |
| 10 | User uses Tab to navigate the tooltip | Focus cycles through Skip → Back → Next; Esc dismisses |
| 11 | User unchecks "Don't show me this again" on step 7 | `tour_completions.dont_show_again = FALSE`; tour re-fires on next login |
| 12 | Admin opens analytics dashboard | "Tour funnel" card renders per-tour conversion (started → step-by-step → completed) |
| 13 | Customer who completed dashboard tour opens Vendors tab first time | Vendors mini-tour fires (3 steps); separate `customer_vendors_v1` row created on completion |
| 14 | Customer who SKIPPED dashboard tour opens Vendors tab first time | Vendors mini-tour does NOT fire (gated on parent dashboard tour completion) |
| 15 | Driver.js script weight | Production bundle adds ≤ 8KB gzipped to the dashboard route |

---

## 13. Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-05-12 | Library: **Driver.js**, not Shepherd.js | 5KB vs 30KB; no Tippy/Popper deps; flat array API matches our fixed scripts; first-class TS types |
| 2026-05-12 | Centered welcome + farewell modals bookend every tour | Soft open + confident close. Mid-tour spotlight is high-attention; a centered modal lets the user breathe at start and end |
| 2026-05-12 | Scrim-click does NOT dismiss; only Esc + Skip button do | Accidental scrim clicks shouldn't end a tour; explicit dismiss intent only |
| 2026-05-12 | "Don't show me this again" defaults checked | Most users don't want to see it again; opt-in to re-fire is the friendlier default |
| 2026-05-12 | Tour state is per-user-per-tour-key (not per-account-type) | Same user across multiple roles (e.g. someone who's both a customer at their own wedding AND a vendor for someone else) sees each role's tour the first time they enter that role surface |
| 2026-05-12 | Version suffix in tour_key (`_v1`, `_v2`) | When we revise a tour, existing users aren't surprised on next login; they have to opt-in via Replay |
| 2026-05-12 | Mini-tours gated on parent tour completion | Prevents new users from being bombarded with overlapping tours in their first session |
| 2026-05-12 | No tour for customers who land via QR-join flow | Customers arriving via 0000's QR-join flow are already on a specific event surface mid-task; firing a tour at that moment is the wrong UX. They get the tour on their next login to `/dashboard` instead |
| 2026-05-12 | Tour copy localized through `marketing-copy.{locale}.ts` | Same pipeline as the marketing site (0015); single source for all user-facing strings |
| 2026-05-12 | Per-step `data-tour-id` attributes, not CSS class selectors | More stable than class names (which change with theme/styling); explicit contract between tour scripts and the surfaces they target |
| 2026-05-12 | Skipped target step is silently skipped, not shown as an error | If logo upload step targets an element that's not in the DOM (because logo already uploaded), don't break the tour — just move on |
| 2026-05-12 | Tour analytics surface in 0023, not a separate iteration | Admin analytics dashboard already exists in 0023; tour funnel is one more card there |
| 2026-05-12 | No emoji in tour copy | Matches the icon system rule (locked 2026-05-12); Lucide-only |
| 2026-05-12 | First-name personalization on welcome modal only | Repeating the name across steps feels uncanny; once is welcome, twice is creepy |

---

## 14. Companion docs

- `0021_couple_dashboard_fully_purchased/` — customer dashboard surfaces; adds the `data-tour-id` markers + Replay setting integration
- `0022_vendor_dashboard/` — vendor dashboard surfaces; adds the `data-tour-id` markers + Replay setting integration
- `0023_admin_console/` — admin console + Tour funnel analytics card
- `0031_guest_landing_dashboard/` (forward-ref) — guest landing surfaces that the guest tour targets
- `0025_profile_settings/` — Settings surface where "Replay onboarding tour" lives
- `0029_help_center/` — the help articles that the farewell step links to
- `0015_main_website/` — marketing-copy localization pipeline reused for tour copy
- `CLAUDE.md` — project decisions index (this iteration's entries land in the main decision log)

---

*End of 0030.*
