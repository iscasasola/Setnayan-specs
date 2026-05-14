# Claude Code Session 1 — Sprint 0 Kickoff

> **What this file is.** Paste the body of this file (everything below the line) into Claude Code as the FIRST message of your first engineering session. It briefs Claude Code on the project state, the locked decisions, and what to build first.

> **Why this file exists.** Setnayan has 7 months of specification work in 33 iteration folders + canonical reference docs. Without an explicit kickoff prompt, Claude Code would start asking foundational questions you've already answered. This prompt routes Claude Code through the locked-decision corpus in the right order so it starts on Day 1 with full context.

---

## PASTE THIS INTO CLAUDE CODE (start)

You are starting engineering work on the **Setnayan platform** — a Philippines-first life-events platform whose V1 surface is weddings. This is Session 1 of the build. All specification work is complete; your job is to write the code.

### Before you write a single line of code

Read these documents in this exact order. Do not skip. Each one builds on the last:

1. `CLAUDE.md` — full project context + decision log (most recent decisions at bottom). This is the canonical source of truth for product behavior. Anything not in CLAUDE.md or the docs below is undecided.
2. `CLAUDE_Code_Build_Prompt.md` — engineering handoff. Locked tech stack, locked patterns, locked pricing.
3. `02_Specifications/Account_ID_Format.md` — canonical S89X- ID format. Every customer-facing identifier follows this.
4. `02_Specifications/RLS_Policy_Pattern.md` — canonical RLS policies (8 patterns + 4 helper functions). Every table you create follows one of these patterns.
5. `02_Specifications/Sample_Render_Refresh_Program.md` — locked program for template gallery samples + guest credits.
6. `RETIRED_ITEMS.md` — do not accidentally build something already cut.
7. `API_Integration_Checklist.md` — external service prerequisites. Some require multi-day approvals (Apple Developer, BIR registration, business banking). Confirm which are needed for Sprint 0 (Supabase, Vercel, Cloudflare R2, GitHub, Resend, Daily.co, Sentry, PostHog, Better Stack) and which are deferred to later phases.

After reading, summarize back to me in your own words the 5 things you understand most clearly about the locked decisions. If anything is ambiguous, surface the question before writing code.

### Multi-platform from Day 1, single codebase (locked 2026-05-12, owner directive)

V1 ships as **ONE Next.js codebase** that runs everywhere from Day 1. Do not architect around a single platform. Every architectural decision must keep all of these distribution targets viable:

**V1 distribution targets — must all work without code changes:**
- **Web** — Next.js 14+ App Router deployed to Vercel · the primary surface · `setnayan.com` and `setnayan.ph`
- **Desktop apps (macOS + Windows)** — same web build wrapped via **Tauri** · single build target produces both .app and .exe · zero code differences from the web version · ship in Phase 2 of Sprint 0 (~Week 2)
- **Mobile web + Installable PWA** — responsive design with installable PWA manifest · "Add to Home Screen" on iOS Safari + Android Chrome produces a native-feeling install · no separate code path
- **Tablet (iPad + Android tablets)** — same responsive web build · larger viewport layout adapts via Tailwind breakpoints · touch-target compliance (≥44pt) required throughout

**What stays as Phase 2 (post-V1.0 launch):**
- Native iOS Papic binary (SwiftUI 16+) — only for the DSLR pairing path and the always-best-quality phone-camera experience
- Native Android Papic binary (Jetpack Compose 11+) — same purpose
- DSLR SDK pairing (Canon EOS Camera Connect / Nikon SnapBridge / Sony Camera Remote / Fujifilm Camera Remote)
- App Store distribution via Capacitor or native binary submission

**Architectural rules to keep multi-platform viable (must follow from Day 1):**

1. **Use Next.js with `output: 'standalone'`** so the build artifact runs cleanly inside Tauri WebView (macOS · Windows · Linux).
2. **No browser-API gotchas in webviews** — avoid `window.opener`, popup-based auth flows, anything that fails inside a webview context. Use Supabase Auth's email/password + magic-link flows; avoid OAuth pop-ups for V1.
3. **PWA-ready** — ship `manifest.json` + service worker registered properly from Sprint 0. The user must be able to "Add to Home Screen" on iOS/Android from Day 1.
4. **Responsive everywhere** — every screen must work in 4 viewports without code changes: Desktop 1440×900 · Tablet iPad Pro 1024×1366 · Mobile iPhone 15 Pro 393×852 · Mobile Pixel 8 412×915. Use Tailwind breakpoints `sm` (640), `md` (768), `lg` (1024), `xl` (1280).
5. **Touch targets ≥ 44pt** throughout. No tiny hover-only interactions.
6. **No platform-specific code paths in V1 application code** — if you find yourself writing `if (isMacOS)` or `if (isMobile)` for anything other than progressive enhancement, surface it as a question. The architecture must collapse to one codebase.
7. **Papic capture uses browser APIs** — `getUserMedia` + `MediaRecorder` + MediaPipe-WASM for face detection. Works identically across all platforms. Native enhancements come in Phase 2 without breaking the web fallback.
8. **Patiktok booth runs as a web kiosk** — same codebase, runs full-screen on a laptop/tablet at the venue.
9. **Panood broadcaster + camera operator** — web clients only, per the locked spec in iteration 0011.

**Tauri scaffold target:** when you finish Sprint 0's web deploy, immediately add the Tauri scaffold (`tauri.conf.json` + Cargo.toml minimal setup + GitHub Actions workflow that produces .app + .exe artifacts). This is the "don't go back" insurance — the Tauri build target stays green from Sprint 0 onward, so any future code change that breaks desktop distribution gets caught in CI.

If a spec mentions native iOS/Android binaries or DSLR pairing, treat that as Phase 2 documentation and DO NOT implement in V1. Everything else in the 33 iterations is in scope for the one shared codebase.

### Build order (locked)

Build iterations in this exact order. Do not reorder unless you discover a real dependency I missed.

**Phase 1 — Foundation (Sprint 0):**
1. Iteration **0013 platform_stack_and_sync** — Vercel project · Supabase project · Cloudflare R2 buckets (PH region) · GitHub repo · `.env.example` · base auth flow · base RLS scaffold · S89X- generator function · the canonical 8 helper functions from RLS_Policy_Pattern.md.

**Phase 2 — Core Shell:**
2. Iteration **0000 app_shell_and_navigation** — login page · role router (`users.account_type ∈ customer/vendor/admin`) · event picker · event-scoped URL pattern `/dashboard/[event-id]/[section]` · 4 bottom-nav tabs · services launcher grid · event join QR + scan-to-join flow.
3. Iteration **0001 creating_guest_list** — guest list table · CSV import · role tiers · plus-ones · RSVP state machine · spreadsheet bulk-edit mode.
4. Iteration **0002 qr_invitation_system** — personal invitation site renderer · branded QR code generation · guest scan flow · scan_events table.

**Phase 3 — Couple-facing core:**
5. Iteration **0021 couple_dashboard_fully_purchased** — 9 surfaces, the 4-theme system (Setnayan Default / Victorian / Classy / iOS).
6. Iteration **0015 main_website** — public marketing site + landing-page renderer · uses Event Palette per the 3-theme-system locked decision.
7. Iteration **0010 mood_board** — palettes only (per § 1 of the iteration spec) · Setnayan Guide rule engine.
8. Iteration **0008 seating_chart_editor** — 13-entry table catalog · free-placed stage · role-tier ring auto-fill · QR-on-publish.

**Phase 4 — Vendor + Coordination:**
9. Iteration **0006 vendors_management** — 28 canonical service categories · 6-stage readiness tracker · flexible payment milestones · crew meal computation.
10. Iteration **0022 vendor_dashboard** — 6 surfaces · mandatory company logo upload · chat identity masking.
11. Iteration **0019 communications** — 1:1 + group chat (Supabase Realtime) · video meetings (Daily.co) · file viewers · coordinator-join permission · vendor identity masking.
12. Iteration **0023 admin_console** — 7 surfaces · two-admin approval queue (§ 9.1) · 🟣 internal accounts (§ 10a) · 🟢 Team Pool widget (§ 10b).

**Phase 5 — Render pipeline:**
13. Iteration **0024 save_the_date** — 30-template gallery · upload 3–8 video clips · render in 3 formats · ₱99 per render · client-side watermarked preview via FFmpeg.wasm.
14. Iteration **0007 budget_expenses** — 3-line items per vendor · payment log · `.ics` calendar export.
15. Iteration **0025 profile_settings** — 6 tabs · RA 10173 data export + soft/hard delete.
16. Iteration **0034 payments_and_cart** — 8-table canonical schema + reconciliation module · BDO + GCash QR · 4-tier fuzzy SQL matcher.

**Phase 6 — Wedding-day features:**
17. Iteration **0012 papic** — WEB ONLY for V1 · browser camera capture · gesture shutter via touch events · face detection via MediaPipe WASM · QR tagging · upload pipeline.
18. Iteration **0011 panood** — Cloudflare Stream Live SFU ingest · YouTube RTMP relay · web broadcaster client · web camera operator client · AI Video Highlight + AI Edited Highlight + SDE pipelines (Remotion).
19. Iteration **0017 patiktok** — web kiosk booth · TikTok audio integration · ₱2,499/booth/5hr.

**Phase 7 — Flagship + polish:**
20. Iteration **0005 led_background_maker** — 8K template render pipeline · Photo Pool blend.
21. Sample Render Refresh Program rollout — consent prompt at post-render · `template_samples` table · "Sample Curation" admin surface · guest credits gated to AIEH/SDE donors.
22. Iteration **0026 bir_tax_compliance** · **0028 email_notifications** · **0029 help_center** · **0030 guided_tour** · **0031 day_of_guest** · **0032 contract_intelligence** · **0033 public_api_foundation** · **0035 observability** — pre-launch polish layer.

### Per-iteration workflow

For each NNNN iteration, read ALL 5 files in the folder before coding:
1. `NNNN_*.md` — the spec, source of truth
2. `NNNN_*.html` — interactive prototype (most are placeholder renderings of the .md; canonical ones are 0000, 0001, 0002, 0004-0013, 0015, 0020-0024)
3. `NNNN_*.docx` — stakeholder doc, same content as .md
4. `tests.md` — your acceptance criteria contract. Every checkbox must pass before PR can merge.
5. `fixtures.json` — sample data using `S89X-` IDs. Use this for dev seeding and tests.

Honor every "**Locked**" claim in the .md as immutable. If you disagree with a locked decision, surface it as a question rather than silently changing it.

### Tonight's session goal

Sprint 0 — iteration 0013 platform_stack_and_sync.

Concrete acceptance criteria for end of Session 1:

**Phase 1A — Infrastructure foundation:**
- [ ] Vercel project exists and is connected to a private GitHub repo `setnayan-platform`
- [ ] Supabase project exists (Singapore region — closest to PH for latency) with `auth.users` table
- [ ] Cloudflare R2 buckets created (`setnayan-media`, `setnayan-thread-files`, `setnayan-vendor-contracts`, `setnayan-samples`)
- [ ] `.env.local.example` committed with all expected keys (Supabase URL/keys, R2 keys, Daily.co placeholder, Resend placeholder, Sentry placeholder, PostHog placeholder, Better Stack placeholder)
- [ ] Next.js 14 App Router app skeleton in the repo with `output: 'standalone'` config
- [ ] Tailwind CSS configured with the locked breakpoints (sm 640, md 768, lg 1024, xl 1280)
- [ ] PWA manifest.json + service worker scaffolded (icons can be placeholders for now)
- [ ] App deploys to Vercel without errors at a preview URL

**Phase 1B — Schema + RLS:**
- [ ] Base Postgres migration created with these tables (all using `S89X-` `public_id`):
  - `users` (public_id `S89U-`, `account_type` enum [customer/vendor/admin], `is_internal`, `is_team_member`, locale, theme_preference)
  - `events` (public_id `S89E-`, `event_type` enum, `is_primary`, `archived`, `geolocation_enabled`)
  - `event_members` (event_id, user_id, `member_type` enum [couple/guest/vendor/coordinator])
  - `event_join_tokens` (event_id, token text, expiry, revoked)
- [ ] `generate_public_id(type_letter CHAR(1))` Postgres function — random 10-char Crockford base 32 body per `02_Specifications/Account_ID_Format.md`
- [ ] The 4 helper functions from RLS_Policy_Pattern.md: `is_admin()`, `current_event_ids()`, `current_vendor_ids(role)`, `current_thread_ids()`
- [ ] RLS enabled on all 4 base tables with the canonical patterns from RLS_Policy_Pattern.md

**Phase 1C — Auth + first deploy:**
- [ ] Supabase Auth wired up for email/password + magic-link (no OAuth popups in V1 — they break in webviews)
- [ ] Login + signup pages built with Tailwind, responsive across all 4 showcase viewports (Desktop / Tablet / iPhone / Pixel)
- [ ] `/health` route returns 200 OK after Vercel deploy
- [ ] Owner (the person running Claude Code) can sign up via Supabase Auth on the deployed URL
- [ ] Owner is auto-issued a `users.is_internal = TRUE` flag with the 🟣 internal-account designation per CLAUDE.md § 10a

**Phase 1D — Multi-platform "don't go back" insurance:**
- [ ] Tauri scaffold added to the repo (`src-tauri/` directory with minimal `Cargo.toml` + `tauri.conf.json`)
- [ ] GitHub Actions workflow `build-desktop.yml` that produces .app (macOS) + .exe (Windows) artifacts on every push to `main`. Artifacts don't need to be signed yet (just buildable).
- [ ] PWA install works on iPhone Safari + Android Chrome (test: add to home screen, launch as installed app, verify navigation works)
- [ ] Lighthouse audit passes ≥90 on Performance + Accessibility + Best Practices + SEO + PWA categories
- [ ] All four showcase viewports verified in browser dev tools: Desktop 1440×900 · iPad Pro 1024×1366 · iPhone 15 Pro 393×852 · Pixel 8 412×915

When you finish, ask me to verify by:
1. Visiting the Vercel URL and signing up
2. Installing as PWA on my phone
3. Running the macOS .app artifact from the Actions tab
4. Reviewing the Lighthouse report

### One more thing

**Treat the decision log in CLAUDE.md as the contract.** It carries every locked product decision (pricing, scope, brand strings, render pipeline, payment flow, RA 10173 compliance, etc.). If a request or impulse contradicts the decision log, surface the question — don't silently implement around it.

Start by reading the foundational docs. Confirm understanding. Then begin Sprint 0.

## PASTE THIS INTO CLAUDE CODE (end)

---

## What to expect after Session 1

If Session 1 finishes successfully:
- You have a deployed Next.js app at a Vercel URL
- You can sign up as a user
- The Supabase backend has the base schemas
- Sprint 0 is done

Session 2 begins iteration 0000 (App Shell). Session 3 begins iteration 0001 (Guest List). At session ~5 you can list your actual wedding guests in the app.
