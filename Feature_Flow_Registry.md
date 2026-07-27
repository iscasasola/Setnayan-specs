# Setnayan — Feature & Flow Registry

> ## ⚠ AS-BUILT CORRECTION — 2026-06-29 (live-site / prod-DB sync)
>
> **Canonical = setnayan.com + [`AS_BUILT_GROUND_TRUTH_2026-06-07.md`](AS_BUILT_GROUND_TRUTH_2026-06-07.md) + [`Pricing.md § 00`](Pricing.md).** Where the body below disagrees, the live site wins. Current canon (prod DB 2026-06-29):
> - **AI planner = "Setnayan AI" — ₱499 first 28-day cycle (intro) → ₱799/28-day cycle** (paid first-paywall subscription) — the "Setnayan Concierge ₱4,999" / "₱1,499" / "free planner" names+prices are RETIRED.
> - **Commission = 0%**, every vendor booking, every tier — no 3%/5% Setnayan Pay cut.
> - **Vendor subs:** Solo ₱999/28d (₱9,999/yr) · Pro ₱2,499/28d (₱24,999/yr) · Enterprise ₱4,999/28d (₱49,999/yr) · verification FREE · 100 free tokens on verify · flat ₱100/token packs. Old ₱6,000/₱10,000 + ₱2,499/₱5,499 + per-week vendor prices are RETIRED.
> - **Couple website:** FREE 4-in-1 site (Save-the-Date · RSVP · Event · Editorial) + unlimited free RSVP + ONE **Couple Website PRO ₱1,999** upgrade. The separate RSVP / RSVP Pro / Event Website / Editorial Website à-la-carte SKUs are RETIRED.
> - **Animated Monogram ₱1,999** · **Live Studio** **₱2,999 / event-day** (ONE SKU `LIVE_STUDIO`, unified 2026-07-25; single-cam livestream FREE; no device split; 12-camera ceiling) · **Pakanta ₱2,499** (single SKU) · **Cinematic Reveal = ₱1,499** (STD Cinematic Openings) · **3D Plan ₱2,499** · **Thank You ₱2,499** · **Live Background ₱499** · **Kwento ₱299** · **Custom QR FREE**.
> - **Couple tiers:** Free ₱0 · Setnayan AI (₱499 first 28d → ₱799/28d). **NO BUNDLES** — Essentials ₱12,999 + Complete ₱27,999 REMOVED 2026-06-29.

**Last generated:** 2026-05-22 (refreshed post 17-PR autonomous sprint)
**Surface audited:** every `apps/web/app/**/page.tsx` + `apps/web/app/api/**/route.ts` on `origin/main` of `iscasasola/setnayan-platform`
**Owner:** senior-dev engineering audit (initial cut 2026-05-20; refresh 2026-05-22)
**Companion docs:** [App_Build_Status.md](App_Build_Status.md) (what shipped) · [V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md) (spec coverage) · [Installed_Stack_Inventory.md](Installed_Stack_Inventory.md) (deps) · this doc (is each shipped surface reachable + does something + leads somewhere)

**Audit-trail note (2026-05-22):** Refreshed after 17-PR autonomous sprint landing tasks #3–#22, #25. Routes touched: `/vendors/compare` (now 307 redirect → retired), `/dashboard/[eventId]/schedule` (TILES + day-of), `/dashboard/[eventId]/disputes` (TILES + admin force-majeure inbound), `/admin/settings/payment-methods` (admin-nav Money group), `/[slug]` (ISR + day-of-mode wiring), `/privacy`, `/features`, `/pricing`. New routes added: `/api/health`, `/api/health/deep`, `/api/admin/sentry-smoke-test`. See [CLAUDE.md decision-log 2026-05-22](CLAUDE.md) for full PR-to-row trail.

**Audit-trail note (2026-05-28 sub-audit):** Companion deep-audit at button + cross-doorway level — [System_Wiring_Map_2026-05-28.md](07_Archive/System_Wiring_Map_2026-05-28.md). Three parallel Explore agents walked all 62 surfaces (customer 19 + vendor 17 + admin 26) and tracked 152 interactive elements down to file:line + server action + state writes + downstream notifications. **Route-level headline numbers below stay accurate** — the 3 RED findings shipped pre-pilot don't add/remove routes (they fix wiring inside existing surfaces: follow-gate UI consume on `/messages`, payment-instructions email in `createOrder`, 5 admin audit-log gaps in `/admin/users` + `/admin/reviews`). 10 ⚠️ orphans surfaced are all explicitly V1.x post-pilot scope per CLAUDE.md spec locks. False positives caught: `DOWNPAID_STATUSES` defined-but-missed by agent's read window, 3 sub-route TILES entry-points correctly wired, shared chat composer covers both vendor + customer reply. See System Wiring Map § False-positive findings ruled out for the trail.

---

## How to read this doc

`App_Build_Status.md` answers "did we ship the spec?". **This doc answers three questions per shipped route**:

1. **Is it reachable?** — the **Entry points** column names the parent surfaces that link here. `**NONE** (URL only)` is the dead-end flag.
2. **Does it do something?** — the **Primary actions** + **State persisted** columns describe what runs when the user clicks (server action, DB write, file upload, etc.)
3. **Does it lead somewhere?** — the **Outcome** column describes the next surface after the action.

The **Flag** column closes the loop. One per row:

- ✅ **wired** — entry, action, and outcome all present
- 🟠 **partial** — some actions wired, others stubbed/missing
- ⚠️ **scaffold** — page renders, primary actions are empty-state or stubs (in-flight iterations land here)
- 🔴 **no-entry** — route exists, no parent surface links to it
- 🚫 **retired** — surface retired by V1 scope decision (kept for back-compat)

---

## Headline numbers

| Bucket | Total | ✅ wired | 🟠 partial | ⚠️ scaffold | 🔴 no-entry | 🚫 retired |
|---|---|---|---|---|---|---|
| Marketing + Public | 13 | 12 | 0 | 0 | 0 | 1 |
| Auth + Guest + Claim | 10 | 10 | 0 | 0 | 0 | 0 |
| Couple Dashboard Core | 10 | 10 | 0 | 0 | 0 | 0 |
| Couple Add-ons | 14 | 6 | 1 | 7 | 0 | 0 |
| Couple Primary Objects | 18 | 18 | 0 | 0 | 0 | 0 |
| Vendor Dashboard | 15 | 15 | 0 | 0 | 0 | 0 |
| Admin Console | 19 | 19 | 0 | 0 | 0 | 0 |
| Public API docs | 1 | 1 | 0 | 0 | 0 | 0 |
| Health + Ops API | 3 | 3 | 0 | 0 | 0 | 0 |
| **Total** | **103** | **94** | **1** | **7** | **0** | **1** |

**Headline reading:** **94 of 103 routes are fully wired** (entry → action → outcome). The 7 remaining ⚠️ rows are **all in-flight add-on scaffolds** (0005/0009/0011/0012/0017/0018) blocked on external owner action (Google Drive verified-app, YouTube verified-app, TikTok app review, Cloudflare Stream Live, supplier onboarding) — these are NOT engineering blockers. Plus 1 🟠 partial (panood/reviews — read live, write gated on paid-Panood traction by spec) and 1 🚫 retired (`/vendors/compare` — 307 redirect via PR #274; reactivation deferred to V1.2 per `feedback_setnayan_vendor_compare_v1_2`).

**Delta vs 2026-05-20:** 99 → 103 routes (+4: `/api/health`, `/api/health/deep`, `/api/admin/sentry-smoke-test`, `/vendors/compare` row re-added as retired). ✅ wired 91 → 94 (+3 new API endpoints all ship live + functional). 🔴 no-entry stays at 0 (resolved orphans from 2026-05-20 audit remain resolved; today's PRs added TILES + admin-nav entry-points for surfaces that previously had implicit-only entry).

**Audit-trail note:** the initial agent pass false-positive flagged 5 routes that were already correctly wired. Each was verified against `origin/main` source code:
- `/dashboard` chrome drift → already fixed in PRs [#67](https://github.com/iscasasola/setnayan-platform/pull/67) + [#99](https://github.com/iscasasola/setnayan-platform/pull/99) + [#127](https://github.com/iscasasola/setnayan-platform/pull/127). `event-switcher.tsx` + `outer-dashboard-header.tsx` ship the monogram + caret popover and single-strip top-nav.
- `/dashboard/[eventId]/contracts` → real orphan; fixed in [#162](https://github.com/iscasasola/setnayan-platform/pull/162) (this audit's only shipped fix).
- `/dashboard/create-event` → Coming-Soon notify form correctly wired via `notifyWhenWeddingTypeLaunches` action → `couple_wedding_type_notify_signups` table.
- `/admin/funnels` → "PostHog-side funnels" section + "Open in PostHog" CTA already in the page at line 211-231; clearly labeled.
- `/admin/settings/payment-methods` → intentional read-only V1 pattern with an explicit amber banner explaining the SQL-update path.
- `/dashboard/[eventId]/add-ons/panood/reviews` → linked from panood index at line 317; read surface wired; write surface gated by spec on paid-order traction.

See [CLAUDE.md decision-log 2026-05-20 rows 442-444](CLAUDE.md) for the full correction trail.

---

## Top dead-end findings (drives the Phase 2 punch list)

### ✅ RESOLVED 2026-05-22 — `/vendors/compare` ([#274](https://github.com/iscasasola/setnayan-platform/pull/274))

V1.1 routing-rule enforcement: `/vendors/compare` now serves a `307` redirect to `/vendors?notice=compare_v1_2`. The notice toast tells the user the compare view is V1.2 scope and offers to add them to a notify-list. Reactivation gated on V1.2 spec lock per [[feedback_setnayan_vendor_compare_v1_2]]. Row preserved in the registry as 🚫 retired with reactivation note.

### ✅ RESOLVED 2026-05-22 — `/admin/settings/payment-methods` admin-nav entry ([#285](https://github.com/iscasasola/setnayan-platform/pull/285))

Previously reachable only via direct URL or `/admin/settings` deep-link. PR #285 adds the route to the admin top-nav under the "Money" group (alongside `/admin/payments`, `/admin/payouts`, `/admin/receipts`, `/admin/bir/2307`). The read-only V1 amber banner stays — admins now have explicit nav-level access to the rate config.

### ✅ RESOLVED 2026-05-22 — `/dashboard/[eventId]/schedule` + `/disputes` TILES entry ([#287](https://github.com/iscasasola/setnayan-platform/pull/287))

Both routes shipped without TILES grid entries. PR #287 adds `schedule` tile (Clock icon, between Vendors and Budget) and `disputes` tile (AlertTriangle icon, conditional render — only shows if event has open force-majeure flags OR active disputes). Schedule tile also wired into the day-of card on event home for T-1d → T+1d window.

### ✅ RESOLVED — `/dashboard` chrome drift (false-positive corrected)

Initial agent pass flagged this 🔴 based on `App_Build_Status.md` row 0000's stale text. Direct verification on `origin/main`:

- PR [#67](https://github.com/iscasasola/setnayan-platform/pull/67) `fix: 0000 chrome drift — single-strip top-nav + event switcher (item #12)` merged 2026-05-15T22:01:53Z.
- Follow-on PRs [#99](https://github.com/iscasasola/setnayan-platform/pull/99) (`persistent-switcher-chrome`) and [#127](https://github.com/iscasasola/setnayan-platform/pull/127) (`responsive-chrome-polish`).
- `apps/web/app/dashboard/[eventId]/_components/event-switcher.tsx` ships monogram + caret popover + `+ Add event` row + role-switch rows (Shop / Admin).
- `apps/web/app/dashboard/_components/outer-dashboard-header.tsx` deliberately drops the global Setnayan wordmark + standalone Sign-out — collapsing the two-row drift into single strip.

Both halves of the 0000 chrome drift are RESOLVED. The `App_Build_Status.md` row 0000 paragraph about chrome drift is stale and flagged for strike-through on the next full status-anchor refresh.

### ✅ RESOLVED — `/dashboard/[eventId]/contracts` orphan ([#162](https://github.com/iscasasola/setnayan-platform/pull/162))

PR #162 added a `contracts` tile to the event-home TILES grid (FileSignature icon, `nav.contracts` label EN + TL, position 4 between Vendors and Budget). Merged 2026-05-20, deployed to production same day. Verified live on www.setnayan.com.

### ⚠️ In-flight add-on scaffolds (expected, but visible to users) — 8 routes
Per `App_Build_Status.md` these iterations are intentionally schema-only/UI-scaffold today. The user-facing copy already follows the "polite empty-state" memory rule.

| Route | Iter | Why scaffold | Owner action to graduate to ✅ |
|---|---|---|---|
| `/dashboard/[eventId]/add-ons/led` | 0005 | Template grid is mock, render pipeline pending | Render pipeline + asset library |
| `/dashboard/[eventId]/add-ons/photo-delivery` | 0009 | OAuth state machine wired, no delivery job processor | Google Drive verified-app review (#19g pending) + delivery job |
| `/dashboard/[eventId]/add-ons/panood` | 0011 | YouTube OAuth + mock broadcast URLs | YouTube verified-app review Phase 2 (#17a pending) |
| `/dashboard/[eventId]/add-ons/panood/broadcast` | 0011 | Mock camera grid, control buttons non-functional | Cloudflare Stream Live provisioning |
| `/dashboard/[eventId]/add-ons/panood/reviews` | 0011 | Read surface live, write surface pending paid orders | Ship write-surface form after first paid Panood orders |
| `/dashboard/[eventId]/add-ons/papic` | 0012 | Storage target switch + mock seat status | Native iOS/Android (V1.5+) |
| `/dashboard/[eventId]/add-ons/patiktok/booth` | 0017 | Capture-counter wired, record button disabled | TikTok app review (#20f pending) |
| `/dashboard/[eventId]/add-ons/supplies-marketplace` | 0018 | Mock supplier data, awaiting onboarding | Supplier vendor agreements signed |

### ✅ RESOLVED — lower-priority partials (all false-positive on second-pass verification)

Initial Phase 1 agent rows flagged these as problems; direct source verification confirmed each is correctly wired:

- **`/admin/settings/payment-methods`** — read-only by intentional V1 design; the page itself ships an amber banner explaining the SQL-update path ("Read-only V1. Edit flow is deferred — to change a rate, run a service-role SQL update against `setnayan_pay_methods`"). Not a dead-end — admins are technical and the UX correctly signals the operational path.
- **`/admin/funnels`** — already has a dedicated "PostHog-side funnels" section (page lines 211-231) listing the 4 funnels that live in PostHog plus an "Open in PostHog" external-link CTA. Already correctly labeled.
- **`/dashboard/create-event`** — Coming-Soon ceremony-type cards open an inline email-capture form that posts to `notifyWhenWeddingTypeLaunches` (server action at `apps/web/app/dashboard/create-event/actions.ts:218`), which inserts into `couple_wedding_type_notify_signups` (line 240) and fires a PostHog `wedding_type_notify_signup` event (line 257). Fully wired by V1.1 design.

---

## Per-route registry

### Marketing + Public (12)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/` | 0015 | public | Homepage, 12 marketing sections | Nav: SiteHeader | "Sign up free" → /signup · "Browse vendors" → /vendors · "For vendors" → /for-vendors | none | Renders only | ✅ |
| `/features` | 0015 | public | Feature catalog deep-dive for couples (Patiktok + Pakanta cards added [#281](https://github.com/iscasasola/setnayan-platform/pull/281)) | Nav: SiteHeader · footer | "Start planning" → /signup · "For vendors" → /for-vendors | none | Renders only | ✅ |
| `/for-vendors` | 0015 | public | Vendor acquisition landing | Nav: SiteHeader · `/` (TwoSides) | "List your business free" → /signup?as=vendor · pricing CTAs | none | Renders only | ✅ |
| `/help` | 0029 | public | Help center with role-filtered articles | Nav: SiteHeader · footer | "Send message" → submitHelpMessage · role tiles → ?role= | `help_messages` | Toast + stay or redirect with status param | ✅ |
| `/how-it-works` | 0015 | public | Platform map: six roles + flow chart | Nav: SiteHeader · footer | "Start planning free" → /signup · "List your business free" → /signup?as=vendor | none | Renders only | ✅ |
| `/pricing` | 0015 | public | Couple-side pricing: Concierge + add-ons (the PR [#282](https://github.com/iscasasola/setnayan-platform/pull/282) "5% Setnayan Pay worked example" is stale — fee RETIRED to 0% at the 2026-06-07 reset; verify live copy) | Nav: SiteHeader · /for-vendors links | "Start 3-day free trial" → /signup?intent=concierge · "See vendor pricing" → /for-vendors | none | Renders only | ✅ |
| `/privacy` | 0015 | public | Privacy policy (RA 10173) — expanded coverage of subprocessors + retention windows + RA 8792 audit trail [#273](https://github.com/iscasasola/setnayan-platform/pull/273) | Footer · /help links | (none) | none | Renders only | ✅ |
| `/terms` | 0015 | public | Terms of service (starter draft) | Footer · /help links | (none) | none | Renders only | ✅ |
| `/weddings` | 0046 | public | Real weddings showcase index (Dec 1, 2026 cutover) | Nav: SiteHeader (BrowseStrip) | "Browse vendors" → /vendors · "Create account" → /signup | `event_editorials` (Phase B) | Renders only (static today) | ✅ |
| `/waitlist` | 0015 | public | Couple waitlist (pre-launch Dec 1, 2026) | Nav: AnnouncementBar · `/` Hero | "Join the waitlist" → joinCoupleWaitlist · "Browse vendors" → /vendors | `couple_waitlist` | Redirect to /waitlist?status=joined or error param | ✅ |
| `/vendors` | 0006 + 0043 | public | Public marketplace browse + filter (incl. wedding-type compatibility) | Nav: SiteHeader (Browse) · `/` BrowseStrip · footer | "Apply filters" → GET /vendors · search → GET /vendors?q= · "Follow" → FollowGate · "Verified only" toggle · "Match my wedding" toggle (couples with event only, opt-in) [#170](https://github.com/iscasasola/setnayan-platform/pull/170) | `vendor_profiles` (incl. `compatible_ceremony_types` + `compatible_venue_settings` from 0043) · `vendor_follows` · `events.ceremony_type` + `venue_setting` (read for matching) | Renders filtered list or empty state | ✅ |
| `/v/[slug]` | 0006 | public | Canonical vendor profile + reviews (schema.org Pro 4999 markup [#278](https://github.com/iscasasola/setnayan-platform/pull/278)) | /vendors card → "View profile" · search results · sitemap [#279](https://github.com/iscasasola/setnayan-platform/pull/279) | "Follow vendor" → FollowGate · contact links · "Load more reviews" → ?reviewsPage= | `vendor_profiles` · `vendor_reviews` · `vendor_follows` | Renders profile or 404 if hidden | ✅ |
| `/vendors/compare` | 0006 | public | (RETIRED V1.1 → V1.2) Multi-vendor compare view | `/vendors` list links (legacy, now redirected) | (none — 307 redirect to `/vendors?notice=compare_v1_2`) [#274](https://github.com/iscasasola/setnayan-platform/pull/274) | none | Redirect surfaces a notice toast with V1.2 notify CTA | 🚫 retired (V1.2 reactivation per `feedback_setnayan_vendor_compare_v1_2`) |

### Auth + Guest + Vendor Claim (10)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/login` | 0015 | public | Sign in (email + magic link) | SiteHeader · for-vendors · how-it-works · features footer · /join · /vendor/claim/finalize | "Sign in" → signInWithPassword · "Email magic link" → signInWithMagicLink | `auth.users` | Redirect to `next` param or `/` | ✅ |
| `/signup` | 0015 | public | Create couple or vendor account | features hero · how-it-works · pricing · /[slug] · /join · /vendor/claim | "Create account" → signUp · account_type radio | `auth.users` · `users.public_summary_consent_at` | Confirmation email or auto-confirmed; redirect to `next` | ✅ |
| `/[slug]` | 0002 | guest | Public wedding QR landing + RSVP (ISR + GuestPreload + DayOfBanner + day-of-mode wiring [#284](https://github.com/iscasasola/setnayan-platform/pull/284); sitemap [#279](https://github.com/iscasasola/setnayan-platform/pull/279)) | QR code (buildInvitationUrl) · emailed invites · sitemap (post-publish) | "Submit RSVP" → submitRsvp · "Decline" → clear session · day-of-mode (T-1h → T+8h) auto-activates 6-card live grid per 0031 | `guests` (rsvp_status, meal_preference, dietary_restrictions, notes, rsvp_responded_at) | Redirect to /[slug]/welcome for unconfirmed +1s; else stay + revalidate; day-of-mode swaps live cards | ✅ |
| `/[slug]/welcome` | 0002 | guest | Plus-one name onboarding | Redirect from /[slug] if unconfirmed TBA | "Confirm name" → confirmPlusOneName · "Abandon" → abandonPlusOneInvite | `guests` (first_name, last_name, plus_one_name_confirmed_at) | Redirect to /[slug] on success; clear session on abandon | ✅ |
| `/join/[eventId]` | 0002 | guest | Event join via token link | Email token · couple's guest-list invite | Role select + Submit → joinEventAction | `event_members` · `guests` (if new) | Redirect to /join/[eventId]/success or error param | ✅ |
| `/join/[eventId]/success` | 0002 | guest | Join confirmation + dashboard redirect | Redirect from /join/[eventId] | "Go to dashboard" → /dashboard link | `event_members` (member_type, role) | Joined event details + dashboard link | ✅ |
| `/receipts/[receiptId]` | 0034 | guest | Print-friendly transaction receipt | Email receipts link (fetchReceiptById RLS) | "Print" → browser print (⌘P / Ctrl+P) | `receipts` (or_serial, issued_at, issued_to_name, issued_to_email) | Display receipt; print-stylesheet renders PDF | ✅ |
| `/download` | 0015 | public | macOS app download landing | SiteHeader · for-vendors · how-it-works footers | "Download for Mac" → /api/download/mac · "Use on web" → setnayan.com | none | .dmg download or web app | ✅ |
| `/vendor/claim/[token]` | 0022 | vendor | Vendor onboarding via emailed claim token | Email claim token link (fetchClaimLandingByToken) | "Sign up" → /signup?as=vendor · "Sign in" → /login · "Decline" → declineVendorInviteByToken | `vendor_invites` (status→claimed) · `vendor_profiles` | Redirect to /finalize if signed in; else signup/login CTA | ✅ |
| `/vendor/claim/[token]/finalize` | 0022 | vendor | Auto-link transaction for claim completion | Redirect from /vendor/claim/[token] after auth | (auto-execute on load) | `vendor_profiles` (create if missing) · `vendor_invites` (status→claimed) · `vendor_follows` | Redirect to /vendor-dashboard?claimed=1; ErrorShell if tx fails | ✅ |

### Couple Dashboard Core (10)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/dashboard` | 0021 | couple | Events list w/ auto-jump + role routing | OuterDashboardHeader monogram + caret popover (`event-switcher.tsx`) — tap routes to event, caret opens switcher with `+ Add event` + role rows | Auto-redirect to single event / multi-event picker | `events` · `users.account_type` | Redirect or render picker | ✅ |
| `/dashboard/create-event` | 0021 + 0043 | couple | Pick event type (V1.1 wedding-type picker) | /dashboard create-event CTA · auto-redirect for new couples | EventTypePicker (active types submit createWeddingEvent) + WeddingTypePicker inline notify-form for Coming-Soon types → notifyWhenWeddingTypeLaunches | `wedding_type_launch_status` read · `events` insert · `couple_wedding_type_notify_signups` for Coming-Soon · PostHog `wedding_type_notify_signup` event | Redirect to event home / sent-state for notify · error param | ✅ |
| `/dashboard/api-keys` | 0033 | couple | Manage personal API access tokens | "Back to profile" link · /dashboard/profile (?) | "Create key" → server action · "Revoke" → server action | `api_keys` (CRUD + last_used_at) | Toast + stay or error param | ✅ |
| `/dashboard/notifications` | 0023 | couple | Activity feed (vendor messages, quotes, payments) | TILES grid (notifications tile) · "Back to events" link | "Mark all read" / "Mark single read" → server actions | `notifications` (read_at flag) | Redirect to self or Toast + stay | ✅ |
| `/dashboard/profile` | 0025 | couple | User settings (name, locale, theme, tour restart) | "Back" context-aware (event or /dashboard) | 6 forms: personal · password · planner-mode · locale · theme · data-export+delete → server actions | `users` (display_name, locale, theme_preference, marketing_opt_in, soft-delete flag) | Toast banners (saved/error/tour-restart/password-changed) | ✅ |
| `/dashboard/profile/concierge` | 0016 | couple | Setnayan Concierge SKU + trial mgmt | "Back to profile" link | 3-day trial form · Buy SKU · Cancel · Extend → actions/redirects | `events.concierge_*` · `users.concierge_*` · enforcement + expiry sweep | Toast banners (trial started/already-used/enforcement) or redirect to order form | ✅ |
| `/dashboard/[eventId]` | 0021 | couple | Event home: planner dashboard, checklist, next tasks, day-of grid | /dashboard auto-redirect · event-switcher monogram pill in chrome strip | 10-tile TILES grid (`apps/web/lib/planner.ts:7-16`) · journey checklist · day-of grid → actions/nav | `events` (full) · `guests` count · `event_vendors` status · `schedule_blocks` · journey completion flags | Redirect to next task or Toast + stay | ✅ |
| `/dashboard/[eventId]/activity` | 0023 | couple | Activity log (grouped by day, newest first, 500-item cap) | Event home "Open activity" link | Click activity items → navigate to detail routes | `activity_log` view (event-scoped) | Navigate to detail or Toast + stay | ✅ |
| `/dashboard/[eventId]/schedule` | 0021 | couple | Wedding-day timeline blocks (ceremony, reception) | TILES `schedule` tile (Clock icon, between Vendors and Budget) added [#287](https://github.com/iscasasola/setnayan-platform/pull/287) · also reachable from day-of card on event home (T-1d → T+1d window) | "Add block" / "Delete block" / "Toggle visibility" → server actions | `schedule_blocks` (is_public flag) | Toast + stay or error param | ✅ |
| `/dashboard/[eventId]/disputes` | 0019 | couple | Force-majeure flag filing (no-show, quality, payment) | TILES `disputes` tile (AlertTriangle icon, conditional render — only renders if event has open force-majeure flags OR active disputes) added [#287](https://github.com/iscasasola/setnayan-platform/pull/287) · admin force-majeure inbound from `/admin/force-majeure/[flagId]` mediator actions · couple "Report a problem" CTA | "File flag" (description + evidence upload) · auto-resolve sweep on pageload → action + admin client | `force_majeure_flags` (flag_type, description, evidence_urls, status, auto_resolve_at) | Toast banner (filed) or error param; 7-day auto-resolve countdown | ✅ |

### Couple Add-ons (14)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/dashboard/[eventId]/add-ons` | 0000 + 0021 | couple | Add-ons launcher grid | TILES `add_ons` tile (event home) · journey STEPS final step | Card links to each feature (or disabled "coming soon") | ADD_ONS manifest + internal-admin check | Grid with shipped + in-flight cards | ✅ |
| `/dashboard/[eventId]/add-ons/[addon]` | generic | couple | Iteration placeholder fallback for unknown slug | /add-ons grid (if metadata exists) | "Back" link only; meta card shows iteration code | `ADD_ON_META` lookup | Placeholder blurb + iteration code | ✅ (catch-all) |
| `/dashboard/[eventId]/add-ons/led` | 0005 | couple | LED Background Maker — 8K loop render | Grid "Choose template" link | Template picker → mock render preview | LED_TEMPLATES constant + auth gate | Static template grid (no real render) | ⚠️ scaffold |
| `/dashboard/[eventId]/add-ons/mood-board` | 0010 | couple | Mood Board — per-role palette editor | Grid "Open" link · TILES `mood_board` tile | PaletteEditor (color picker per role) → saveRolePalette | `events.role_palette` (JSONB) | Persistent role palettes + guest-list color dots | ✅ |
| `/dashboard/[eventId]/add-ons/panood` | 0011 | couple | Panood setup — YouTube OAuth + SKU summary | Grid "Set up" link | YouTube OAuth connect/disconnect · setup-link copy · mock broadcaster/camera URLs | `oauth_grants` + mock PanoodSetup | OAuth state + 4 step sections (mock data) | ⚠️ scaffold |
| `/dashboard/[eventId]/add-ons/panood/broadcast` | 0011 | couple | Broadcaster preview — camera grid + controls | Panood "Open broadcaster preview" | "Mark highlight" / "Cast" / "Go live" buttons (all non-functional) | Mock camera roster | Static 4-camera grid + control buttons + audio rail (preview mode) | ⚠️ scaffold |
| `/dashboard/[eventId]/add-ons/panood/reviews` | 0011 | couple | Feature reviews (App Store-style) — read surface live | Panood index "See all reviews" link (`panood/page.tsx:317-320`) | (read-only list; write surface ships post-launch by spec — gated on paid-Panood traction) | `feature_reviews` (read; migration `20260517000000_feature_reviews.sql`) | Renders rating + review list | 🟠 partial (write surface pending by design) |
| `/dashboard/[eventId]/add-ons/papic` | 0012 | couple | Papic setup — storage choice + seat roster (R2-mode photos sync to couple's Drive via 0009 Photo Delivery) | Grid "Set up" link | Storage radio (R2 / Drive OAuth) · Drive connect/disconnect · seat invite QR (disabled) · camera-bridge purchase (disabled) | `events.papic_storage_target` · `oauth_grants` (Drive) | Storage target switch + mock seat status + 6 settings cards | ⚠️ scaffold |
| `/dashboard/[eventId]/add-ons/patiktok` | 0017 | couple | Patiktok gallery — template grid + render queue + tier pricing | Grid "Browse templates" link | Template category filter · tier purchase (Setnayan/Personal) · TikTok OAuth (Personal tier) → createOrder | `patiktok_render_jobs` · `patiktok_oauth_grants` | Live render queue (status pills) + pricing tiers + template cards | ✅ |
| `/dashboard/[eventId]/add-ons/patiktok/booth` | 0017 | couple | Operator dashboard — capture counter + template picker | Patiktok gallery "Open booth dashboard" | Capacity strip (soft-cap check) · template swap · overage purchase CTA · "Record" (disabled) | `patiktok_render_jobs.enqueued_at` (24h window) | Live capture-count meter + overage upsell + static template slots | ⚠️ scaffold |
| `/dashboard/[eventId]/add-ons/patiktok/[templateId]` | 0017 | couple | Template detail — render form + music picker | Patiktok booth or gallery template card | Duration slider · music dropdown · RenderForm submit (createOrder) | `patiktok_music_tracks` + music prefs in order | Form submits render job (queued status on gallery) | ✅ |
| `/dashboard/[eventId]/add-ons/photo-delivery` | 0009 | couple | Photo Delivery setup — couple's Drive OAuth + sync-mode (R2 → Drive pipeline, downstream of Papic 0012 + photographer uploads) | Add-ons grid card (`ImageDown` icon, "Set up" CTA) added via [#163](https://github.com/iscasasola/setnayan-platform/pull/163); also via emailed release notification from `photo-delivery-release.ts:389` | Sync-mode picker (`manual_release` default / `auto_sync` opt-in) [#166](https://github.com/iscasasola/setnayan-platform/pull/166) · Connect Google Drive (real OAuth via `/api/oauth/photo-delivery/start`) · Release to Drive button (manual mode only) [#169](https://github.com/iscasasola/setnayan-platform/pull/169) · Disconnect [#169] · live progress poller during uploads [#169] | `events.photo_delivery_*` (status, folder_id, folder_name, account_email, progress_pct, sync_mode) · `oauth_grants` (provider='drive_photo_delivery') · `photo_delivery_jobs` · `photo_delivery_artifacts` | State machine: idle → connected (after OAuth) → releasing/uploading (after Release click) → complete (Open in Drive link) / failed (Retry). Auto-sync mode shows "Live sync active" banner with no manual Release button. | 🟠 partial (entire panel + release flow LIVE; gated only on owner-side Google Drive verified-app review #19g) |
| `/dashboard/[eventId]/add-ons/save-the-date` | 0024 | couple | Save-the-Date gallery — 12-template grid + order creation | Grid "Browse templates" link | Template card → createOrder (apply-then-pay) with description pre-fill | `service_orders` (create) + save-the-date:slug key | Live template grid + order creation (manual video-clip handoff) | ✅ |
| `/dashboard/[eventId]/add-ons/supplies-marketplace` | 0018 | couple | Supplies Marketplace — product catalog + cart drawer | Grid "Browse supplies" link | Browse by category · add-to-cart → checkout via Orders | Cart in component state (session only) + recommend rail from order history | Catalog grid + recommend rail + checkout drawer (mock vendor data) | ⚠️ scaffold |

### Couple Primary Objects (18)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/dashboard/[eventId]/budget` | 0007 | couple | Budget — itemize vendor costs + log payments | TILES `budget` tile · BottomNav (Wallet) | "Add line item" → addLineItem · "Log payment" → logPayment · "Export ICS" → /api/budget/{eventId}/ics | `event_vendor_line_items` · `event_vendor_payments` | Revalidate /budget | ✅ |
| `/dashboard/[eventId]/contracts` | 0032 (retired) | couple | Vendor contracts list — PDFs uploaded by vendors | TILES tile (FileSignature) added via [#162](https://github.com/iscasasola/setnayan-platform/pull/162); also reached from email notification + vendor-side server-action revalidate | "View contract" → /[contractId] | `vendor_contracts` (status: upload-only as of [#118](https://github.com/iscasasola/setnayan-platform/pull/118), 2026-05-18) | Contract detail page | ✅ |
| `/dashboard/[eventId]/contracts/[contractId]` | 0032 (retired) | couple | Contract detail — view + download PDF + e-sign | Contracts list (orphan upstream) · email notification link | "Download" → /api/contract/{contractId}/download · "Sign" canvas (free dual e-sign) · "Back" | `vendor_contracts` (signature_image_url, signed_at, IP, UA) | Back to contracts list | ✅ (page itself wired; upstream broken) |
| `/dashboard/[eventId]/guests` | 0001 | couple | Guests list — RSVP, roles, filtering, sorting | TILES `guests` tile · BottomNav (Users) · header link | "Add guest" → /new · "Quick add" → /quick · "Import" → /import | `guests` (indexed by name, rsvp_status, role) | Guest list with active filters/sort | ✅ |
| `/dashboard/[eventId]/guests/new` | 0001 | couple | Add single guest — form entry | Guests list "Add" link | "Create guest" → createGuest | `guests` (insert: name, side, group, role, rsvp_status, meal_preference) | Redirect to guests list or new?error= | ✅ |
| `/dashboard/[eventId]/guests/quick` | 0001 | couple | Quick add — bulk-entry textarea (name-per-row) | Guests list "Quick add" link | "Upload names" → bulkCreateGuests | `guests` (batch insert with defaults) | Redirect to guests list or quick?error= | ✅ |
| `/dashboard/[eventId]/guests/import` | 0001 | couple | Import guests — CSV upload (10 columns) | Guests list "Import" link | "Upload CSV" → importGuestsCsv | `guests` (batch insert from CSV) | Redirect to guests list or import?error= | ✅ |
| `/dashboard/[eventId]/guests/[guestId]` | 0001 | couple | Guest detail — edit all fields + soft-delete | Guests list (card click) | "Update guest" → updateGuest · "Soft-delete" → softDeleteGuest | `guests` (update: name, role, side, group, meal, household, rsvp_status, display_name) | Redirect to guests list or guests/{id}?error= | ✅ |
| `/dashboard/[eventId]/invitation` | 0004 | couple | Invitations — slug + monogram + QR reissue | TILES `invitation` tile · BottomNav (grouped under Guests activeTab) | "Update slug" → updateEventSlug · "Update monogram" → updateMonogram · "Reissue guest QR" → reissueGuestToken | `events` (slug, monogram_text, monogram_color) · `guests` (qr_token) | Revalidate or redirect with status param | ✅ |
| `/dashboard/[eventId]/invitation/print` | 0004 | couple | Print sheet — QR cards per guest | Invitation page "Print sheet" link | Browser print (⌘P / Ctrl+P) | `guests` (read: qr_token, display_name, role) | Print dialog | ✅ |
| `/dashboard/[eventId]/messages` | 0019 | couple | Messages — vendor thread list + new-thread form | TILES `messages` tile · BottomNav | "Start thread" → startThreadByVendorEmail | `message_threads` · `message_thread_members` | Redirect to /messages or ?error= | ✅ |
| `/dashboard/[eventId]/messages/[threadId]` | 0019 | couple | Message thread detail — realtime chat | Messages list (thread row) | "Send" → sendChatMessage (Realtime sub) | `messages` (insert) | Stay on thread, append to stream | ✅ |
| `/dashboard/[eventId]/orders` | 0034 | couple | Orders — list with status + totals | TILES `orders` tile · BottomNav (grouped under Guests activeTab) | "New order" → /new | `orders` (indexed by status, created_at) | Orders list with flash message | ✅ |
| `/dashboard/[eventId]/orders/[orderId]` | 0034 | couple | Order detail — status, payments, receipts | Orders list (card click) | "Log payment" → logPayment (upload screenshot) · "Cancel" → cancelOrder | `orders` · `order_payments` · `receipts` (update/insert) | Revalidate or redirect with status param | ✅ |
| `/dashboard/[eventId]/orders/new` | 0034 | couple | New order — form for service + budget | Orders list "New" button | "Create order" → createOrder · "Confirm self-comp" modal | `orders` (insert: event_id, couple_user_id, description, requested_total_php, status=pending) | Redirect to /orders/{orderId} or new?error= | ✅ |
| `/dashboard/[eventId]/seating` | 0008 | couple | Seating chart — drag-drop floor plan + guest assignments | TILES `seating` tile · BottomNav (grouped under Guests activeTab) | "Create table" / "Delete" / "Assign" / "Unassign" / "Move" → server actions | `event_tables` · `seat_assignments` | Revalidate seating or redirect with error | ✅ |
| `/dashboard/[eventId]/vendors` | 0006 | couple | Couple's vendors — list, status, invites, reviews | TILES `vendors` tile · BottomNav (Briefcase) | "Create vendor" · "Invite to Setnayan" modal · "Delete" · "Update status" → actions | `event_vendors` · `vendor_invites` (indexed by category, status) | Revalidate vendors list or redirect with status param | ✅ |
| `/dashboard/[eventId]/vendors/[eventVendorId]/review` | 0006 | couple | Post-booking review — 5-axis Likert + text | Vendor card (post-delivery state only) | "Submit review" → submitCoupleReview · "Appeal" → submitReviewAppeal | `couple_reviews` (axis scores, body, appeal_signal) | Redirect to vendors or review?blocked={signal} | ✅ |

### Vendor Dashboard (15)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/vendor-dashboard` | 0022 + 0043 | vendor | Vendor profile home | Vendor nav header | "Save profile" → redirect ?saved · "Upload logo" → FileUpload · "Wedding compatibility" checkbox grid (ceremony types + venue settings, 0043) [#172](https://github.com/iscasasola/setnayan-platform/pull/172) | `vendor_profiles` (incl. `compatible_ceremony_types` + `compatible_venue_settings`) | ?saved | ✅ |
| `/vendor-dashboard/services` | 0022 | vendor | Services editor (vendor's offerings) | Vendor nav header | "Add service" → ?add=category · "Delete" · "Toggle active" → actions | `vendor_services` | ?saved / ?error | ✅ |
| `/vendor-dashboard/bookings` | 0022 | vendor | Bookings inbox | Vendor nav header | Filter (new / in-progress / stale) · "Open thread" → [threadId] | `chat_threads` (read) | Thread detail or ?error | ✅ |
| `/vendor-dashboard/earnings` | 0022 | vendor | Earnings rollup | Vendor nav header | Pagination (?page=N) · monthly subtotals · payout breakdown | `orders` (RLS read) · `payments` | Static list | ✅ |
| `/vendor-dashboard/team` | 0022 | vendor | Team members (4 roles) | Vendor nav header | "Invite" · "Remove" · "Update role" → actions | `vendor_team_members` | ?saved / ?invited / ?error | ✅ |
| `/vendor-dashboard/reviews` | 0022 + 0006 | vendor | Reviews viewer + reply | Vendor nav header | "Post reply" → actions · axis-average stars | `reviews` (read) · `vendor_review_replies` | Static list | ✅ |
| `/vendor-dashboard/contracts` | 0032 (retired) | vendor | Contracts list | Vendor nav header | "Create new" → /new · "View detail" → [contractId] | `vendor_contracts` | New or detail page | ✅ |
| `/vendor-dashboard/contracts/[contractId]` | 0032 (retired) | vendor | Contract detail (vendor-side) | /contracts or back link | "Publish to couple" · "Cancel" · "Download PDF" → actions | `vendor_contracts` | Contracts list or ?error | ✅ |
| `/vendor-dashboard/contracts/new` | 0032 (retired) | vendor | Contract upload + dual e-sign init | "Create" button on /contracts | "Upload PDF" → FileUpload · "Select event" dropdown | `vendor_contracts` (insert) | Contracts list or ?error | ✅ |
| `/vendor-dashboard/messages` | 0019 | vendor | Messages threads list | Vendor nav header | "Open thread" → [threadId] · filter by event | `chat_threads` (read) | Thread detail | ✅ |
| `/vendor-dashboard/messages/[threadId]` | 0019 | vendor | Message thread detail (realtime) | /messages or notification | "Send" → action · Realtime sub | `chat_messages` (insert) | Back to /messages | ✅ |
| `/vendor-dashboard/notifications` | 0028 + 0022 | vendor | Notifications viewer | Vendor nav header | "Mark read" / "Mark all read" → actions | `notifications` | Static list / realtime | ✅ |
| `/vendor-dashboard/marketing` | 0022 § 5b | vendor | Boosted Ads + Sponsored Boost subscription | Vendor nav header | "Start subscription" · "Cancel" → actions | `vendor_ad_subscriptions` | ?started / ?cancelled / ?error | ✅ |
| `/vendor-dashboard/tax-documents` | 0026 | vendor | BIR 2307s (vendor side) | Vendor nav header | "Mark filed" · "Unmark" · "Download filing" → actions | `vendor_2307_filings` | Static list | ✅ |
| `/vendor-dashboard/verify` | 0022 (verification flow) | vendor | Vendor verification application | Vendor nav header · blocked-route redirects | "Upload docs" per slot → FileUpload · "Submit" · "Withdraw" → actions | `vendor_verification_applications` | ?error / ?submitted / ?withdrawn | ✅ |

### Admin Console (19)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/admin` | 0023 | admin | Admin home — metrics tiles | Admin nav header | Metrics tiles · links to other admin surfaces | (counts only) | Other admin surfaces | ✅ |
| `/admin/users` | 0023 | admin | Users list/search | Admin nav header | Search ?q= · filter ?filter= · per-user actions (blacklist, confirm email, reset pwd) | `users` · `email_blacklist` | ?temp_password / ?for_email | ✅ |
| `/admin/vendors` | 0023 | admin | Vendors list/search | Admin nav header | Search ?q= · filter ?status= · profile detail | `vendor_profiles` | Static list | ✅ |
| `/admin/verify` | 0023 | admin | Verification queue | Admin nav header | Tab switch (applications/visibility) · Approve / Reject / In-review · Demote / Archive → actions | `vendor_verification_applications` · `vendor_profiles` | ?app_approved / ?app_rejected / ?demoted | ✅ |
| `/admin/events` | 0023 | admin | Events list/search | Admin nav header | Search ?q= · filter ?archived= · guest counts | `events` | Static list | ✅ |
| `/admin/payments` | 0023 | admin | Payments review (manual reconciliation) | Admin nav header | Filter ?filter=pending/orders_needing_quote · Approve / Reject / Confirm total → actions | `payments` · `orders` | Update status | ✅ |
| `/admin/payouts` | 0023 + 0034 | admin | Vendor payouts | Admin nav header | Filter (pending/paid/on_hold) · stage breakdown · "Mark paid" / "Hold" → actions | `payouts` | Update stage | ✅ |
| `/admin/receipts` | 0023 + 0034 | admin | Receipts by month | Admin nav header | Month filter ?month=YYYY-MM · OR serial + totals | `receipts` | Static list | ✅ |
| `/admin/reviews` | 0023 + 0006 | admin | Review moderation | Admin nav header | Two tabs (appeals / flagged) · Escalate / Reject / Override → actions | `review_appeals` · `reviews` | Update decision/status | ✅ |
| `/admin/bir/2307` | 0026 | admin | BIR 2307 batch | Admin nav header | Year/quarter filter · "Regenerate" · "Manual trigger" → actions | `vendor_2307_filings` | Static list | ✅ |
| `/admin/funnels` | 0023 + 0035 | admin | Funnels analytics — 3 Supabase + 4 PostHog | Admin nav header | Range filter (week/month/quarter) · "Open in PostHog" external CTA in dedicated section | Supabase counts (users · events · orders · vendor_profiles · chat_threads) · PostHog read-only for the other 4 | Renders 3 funnel tables · external dashboard for the other 4 | ✅ |
| `/admin/help` | 0023 + 0029 | admin | Help center management | Admin nav header | Status filter ?status= · "Set status" · admin notes field → actions | `help_messages` | Update status | ✅ |
| `/admin/concierge-abuse` | 0023 + 0016 | admin | Concierge abuse queue | Admin nav header | Two tabs (pending / enforcement) · Clear / Confirm / Lift → actions | `concierge_abuse_flags` | Update status/level | ✅ |
| `/admin/force-majeure` | 0023 + 0019 | admin | Force-majeure queue | Admin nav header | Status/type filter · auto-resolve countdown list · "Open detail" → [flagId] | `force_majeure_flags` | Detail page | ✅ |
| `/admin/force-majeure/[flagId]` | 0023 + 0019 | admin | Force-majeure detail | /force-majeure list or link | "Take ownership" · "Resolve" · dropdown menu | `force_majeure_flags` | Back to list or ?error | ✅ |
| `/admin/ads` | 0023 + 0022 § 5b | admin | Boosted ads (admin view) | Admin nav header | Status filter ?status=active/cancelled/expired · "Cancel subscription" → actions | `vendor_ad_subscriptions` | Update status | ✅ |
| `/admin/website` | 0023 | admin | Website editor (8th admin surface) | Admin nav header | Page dropdown · widget toggle (is_enabled) → PATCH API · drag-drop reorder → POST API | `site_widgets` | Live update, cache TTL 60s | ✅ |
| `/admin/settings` | 0023 + 0035 | admin | Admin platform settings (Sentry smoke-test button added [#280](https://github.com/iscasasola/setnayan-platform/pull/280)) | Admin nav header | "Save settings" → actions · "QR upload" → action · "Trigger Sentry smoke test" → POST /api/admin/sentry-smoke-test | `platform_settings` | ?saved / ?error / ?qr_uploaded / smoke-test toast (success or error) | ✅ |
| `/admin/settings/payment-methods` | 0023 + 0034 | admin | Payment-methods config (read-only V1) | Admin top-nav "Money" group (alongside `/admin/payments`, `/admin/payouts`, `/admin/receipts`, `/admin/bir/2307`) added [#285](https://github.com/iscasasola/setnayan-platform/pull/285) · also nested under /admin/settings | (intentional read-only; UI shows amber banner with SQL-update path) | `setnayan_pay_methods` (read) | Renders rate table with gateway + Setnayan Pay + total columns | ✅ (read-only by V1 design) |

### Public API docs (1)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/api/v1` | 0033 | api | Public API docs landing | External: curl / docs link | (no interactive controls) | none | API reference rendered | ✅ |

### Health + Ops API (3)

| Route | Iter | Role | Title/purpose | Entry points | Primary actions | State persisted | Outcome | Flag |
|---|---|---|---|---|---|---|---|---|
| `/api/health` | 0035 | ops | Shallow health check (process alive, env present) | External monitor (Better Stack uptime per 0035 § Better Stack) · cron pings · CI smoke | GET → returns `{status, version, ts}` 200 OK | none | JSON response 200/5xx | ✅ ([#275](https://github.com/iscasasola/setnayan-platform/pull/275)) |
| `/api/health/deep` | 0035 | ops | Deep health check (DB + R2 + Resend + PostHog + OAuth providers reachable) | External monitor (5-min cron) · admin alert hooks · CI smoke | GET → returns per-subsystem `{ok, latency_ms, error?}` (typecheck fix [#289](https://github.com/iscasasola/setnayan-platform/pull/289)) | none | JSON response 200/207/5xx with subsystem detail | ✅ ([#275](https://github.com/iscasasola/setnayan-platform/pull/275)) |
| `/api/admin/sentry-smoke-test` | 0035 | admin-api | Triggers controlled Sentry exception for prod verification | `/admin/settings` "Trigger Sentry smoke test" button | POST (admin-only via RLS) → throws controlled exception captured by Sentry SDK | `admin_audit_log` (action: `sentry_smoke_test_triggered`) | Returns confirmation; Sentry captures + alerting routes per 0035 | ✅ ([#280](https://github.com/iscasasola/setnayan-platform/pull/280)) |

---

## How to regenerate this doc

1. `git -C ~/setnayan-db-push fetch origin main`
2. List routes: `git -C ~/setnayan-db-push ls-tree -r origin/main apps/web/app | awk '$4 ~ /\/page\.(tsx|ts|jsx|js)$/ {print $4}' | sort`
3. Diff against the route list above. New routes get rows; deleted routes get pruned.
4. For each new/changed route, fill in 9 fields: Route · Iter · Role · Title · Entry points · Primary actions · State persisted · Outcome · Flag.
5. Recompute headline numbers + dead-end findings section.
6. Bump the date at the top.
7. Cross-link with `App_Build_Status.md` per-iteration row when bucket counts shift.

---

## Provenance

Phase 1 (this doc) assembled 2026-05-20 by a senior-dev audit dispatched at owner request. Six parallel Explore agents read every `page.tsx` on `origin/main`, mapped entry points via repo-wide grep, and returned schema-conformant rows. The doc owner verified the two critical 🔴 findings (`/dashboard` chrome drift + `/dashboard/[eventId]/contracts` orphan) with direct file reads of `apps/web/lib/planner.ts` and `apps/web/app/dashboard/[eventId]/page.tsx`.

**Refresh 2026-05-22 (this update)** — refreshed after the 17-PR autonomous sprint landing tasks #3–#22, #25. Eight existing rows updated to reflect today's PRs (`/[slug]` ISR + day-of mode · `/features` Patiktok + Pakanta cards · `/pricing` 5% worked example + actor-terminology · `/privacy` expanded coverage · `/v/[slug]` schema.org Pro 4999 + sitemap · `/dashboard/[eventId]/schedule` TILES + day-of · `/dashboard/[eventId]/disputes` TILES + admin inbound · `/admin/settings/payment-methods` admin-nav Money group · `/admin/settings` Sentry smoke-test button). Four new rows added (`/vendors/compare` as 🚫 retired per PR #274 V1.1 routing-rule enforcement · `/api/health` · `/api/health/deep` · `/api/admin/sentry-smoke-test`). Headline numbers 99 → 103 routes (+4); ✅ 91 → 94 (+3 net new functional API endpoints); 🚫 0 → 1 (`/vendors/compare`). Per [[feedback_setnayan_document_changes_with_why]]: this refresh preserves the orphan ledger accurate-to-`origin/main` for future sessions. Full PR-to-row trail in [CLAUDE.md decision-log 2026-05-22](CLAUDE.md).
