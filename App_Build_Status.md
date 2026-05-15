# Setnayan — App Build Status (spec vs. live code)

**Last regenerated:** 2026-05-15 (after 4 more PRs landed in a single session; 4 more in flight)
**Repo audited:** `origin/main` at `https://github.com/iscasasola/setnayan-platform`
**Companion docs:** [V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md) (spec) · this doc (code) · [Installed_Stack_Inventory.md](Installed_Stack_Inventory.md) (deps) · [API_Integration_Checklist.md](API_Integration_Checklist.md) (prereqs)

---

## How to read this doc

`V1_Gap_Analysis_Status.md` answers "did we update the spec?". **This doc answers "did we ship the spec?"** Re-generated EOD 2026-05-14 after a 23-PR run.

- ✅ **Shipped** — spec scope is live in the app
- ⚠️ **Partial** — some scope is live; remainder still in flight or queued
- 🟡 **Not shipped** — spec exists, code doesn't (V1.5+ deferral or pending Phase 2/3)
- ⛔ **Blocked** — gated on an external dep
- 🚫 **Retired / superseded**

---

## Headline numbers (post 2026-05-14 PR run)

| Bucket | Count | Iterations |
|---|---|---|
| ✅ Shipped | **22** | 0000, 0001, 0002, 0004, 0007, 0008, 0010, 0013, 0015, 0016, 0021, 0023, 0025, 0026, 0028, 0029, 0030, **0031**, 0033 (partial), 0034, **0035**, **0037** (renumbered from 0036 on 2026-05-16 — 0036 was already used by `0036_pakanta`) |
| ⚠️ Partial / Phase 2 in flight | 5 | 0006, 0019, 0022, 0030, 0033 |
| 🟡 Deliberate V1.5+ | 6 | 0005, 0009, 0011, 0012, 0017, 0018 |
| ⛔ Blocked | 0 | ~~0032 (Anthropic)~~ — **unblocked 2026-05-16** (Anthropic Console signup + Haiku 4.5 locked) |
| 🚫 Retired | **4** | 0003, 0014, 0027, **0024 (folded into 0002 Phase 1 on 2026-05-16)** |

**Bold** = changed today.

---

## Per-iteration status (post 2026-05-14)

| # | Iteration | Status | What changed today (if any) |
|---|---|---|---|
| 0000 | App Shell & Navigation | ✅ Shipped (chrome drift) | Bottom nav now reads "Add-ons" (PR #13); locale toggle (Phase 2 agent in flight). **Chrome drift 2026-05-15** (visually confirmed in production): (A) top-left anchor is the global Setnayan brand logo, not the per-couple monogram → no event-switcher entry point reachable from the chrome; back-arrow on the `← Maria & Juan (Demo)` pill does not lead to an events index either, so the `+ Add event` row spec'd in 0000 § event switcher is unreachable in production (violates 0000 § event switcher · blocks the 2026-05-15 "Event lifecycle locked" decision-log row's add-event half). (B) Top-nav rendered as two stacked rows instead of the single persistent strip locked in the 2026-05-14 "Top-nav redesign locked + token-wallet pill removed from chrome" decision-log row. Both gaps need engineering follow-up: wire the monogram + caret event switcher, AND collapse the two rows into one strip — OR amend the specs if the shipped chrome is the new intent. |
| 0001 | Creating Guest List | ✅ Shipped | RSVP-received email + in-app notification (PR #20) |
| 0002 | QR Invitation System | ✅ Shipped | — |
| 0003 | Token Wallet (retired) | 🚫 — | — |
| 0004 | Invitation Widgets | ✅ Shipped (free tier; V1 paid upgrades reset 2026-05-16) | Pro tier still queued. V1 paid upgrades locked: **Monogram Hero ₱1,999 no-refund** (SVG-only · animated trace + custom video/photo background) + **Live Schedule ₱999**. Retired: `pro_widget_hero`/`pro_widget_story`/`pro_widget_bundle`. SKU code rename: `pro_widget_hero` → `monogram_hero_upgrade`. New schema fields on `hero_monogram` config_json. |
| 0005 | LED Background | 🟡 V1.5+ | Now visible as "Coming soon" in the add-ons grid |
| 0006 | Vendors Management | ⚠️ Partial | `/vendors` placeholder shipped (PR #22); marketplace + reviews in Phase 2 agent (in flight) |
| 0007 | Budget & Expenses | ✅ Shipped | — |
| 0008 | Seating Chart Editor | ✅ Shipped | — |
| 0009 | Photo Delivery | 🟡 V1.5+ | — |
| 0010 | Mood Board | ✅ Shipped | — |
| 0011 | Panood | 🟡 V1.5+ build (SKU + architecture locked 2026-05-16) | **SKU lock 2026-05-16:** Cloudflare Stream Live composite + master-channel YouTube + ffmpeg compositor + Broadcast Style Pack all retired. New V1 SKU model: Daily Broadcast ₱499/day + Camera Sync ₱99/day + Annual Streaming ₱2,999/year + Annual Streaming Plus ₱3,999/year. Couple BYO their own YouTube channel via OAuth; Setnayan provides broadcaster orchestration UI + landing-page IFrame embed. Engineering surface drops ~60% (no SFU subscription, no ffmpeg compositor). |
| 0012 | Papic | 🟡 V1.5+ (architecture locked 2026-05-16 · 207-camera + Drive transfer + pooled credits + Auto-Recap) | **Architecture lock 2026-05-16:** entire Papic V1 native iOS/Android build deferred to V1.5+; architecture frozen now to prevent re-litigation. 207-camera mesh (5 paid paparazzi + 200 guest cams + couple) · Drive transfer at T+30d to couple's Google Drive · cold-tier 90-day safety window (T+30d → T+120d, ~80% storage cost reduction) · 150-credit per-guest allocation · XMP/EXIF tag embedding on Drive transfer · Auto-Recap (FFmpeg no-AI, free with Premium Guest Camera Pack) · folder structure `Setnayan/[Event]/00_Cover/01_Pre-event/02_Ceremony/03_Reception/04_Auto-Recap/` · file naming `{couple-slug}_{ISO-timestamp}_{photographer-id}_{capture-id}.{ext}` · pooled credit pool 5K (3-pack) / 10K (5-pack) · 80% soft warning + ₱299/+1,000 extension SKU. New V1.5+ SKU table (all `is_active=FALSE` in seed): paparazzi_camera_addon ₱999, paparazzi_credits_addon ₱299, premium_guest_camera_pack ₱1,499, personal_album_per_guest ₱49, memory_book_per_guest ₱249 — alongside existing paparazzi_3_seats ₱1,499 + paparazzi_5_seats ₱2,499. Pro Camera Bridge folded into 5-Paparazzi pack capability set. |
| 0013 | Platform Stack | ✅ Shipped | Caching foundation (PR #10) · R2 storage (PR #18) · Sentry + PostHog (PR #17, #19) · CI build gate (PR #15) |
| 0014 | V1.1 Polish | 🚫 No folder | — |
| 0015 | Main Website | ✅ Shipped | Landing-page conversion upgrades — split CTA, trust signals, pricing table (PR #21) |
| 0016 | Step-by-Step Plan Builder | ✅ Shipped | — |
| 0017 | Patiktok | 🟡 V1.5+ build (SKU lock 2026-05-16) | **SKU lock 2026-05-16:** old single-tier ₱2,499/booth/5hr + ₱999 additional-station + ₱499/hour retired. New dual-tier per-day model: Patiktok Setnayan TikTok ₱999/day (auto-posts to @SetnayanWeddings · Setnayan keeps ad-revenue) vs Patiktok Personal TikTok ₱1,999/day (couple BYO TikTok via OAuth · couple owns videos). 40-video soft cap per booth per day · ₱49/+10 overage SKU as in-event upsell · per-day multi-purchase for multi-day events. Sound selection / multi-performer / external-display mechanics preserved. Anti-abuse rule changed: 500-per-event hard cap → 40-per-day soft cap. Still showing as "Coming soon" in add-ons grid pending V1.5+ build. |
| 0018 | Supplies Marketplace | 🟡 V1.5+ | Now visible as "Coming soon" in add-ons grid (PR #22) |
| 0019 | Communications | ⚠️ Partial — chat + files shipped · video meetings RETIRED 2026-05-16 | Force-majeure flow + admin escalation in Phase 2 agent (in flight); **video meetings (Daily.co) RETIRED entirely from V1+ on 2026-05-16** — couples + vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp). Chat + file attachments + in-app viewers + coordinator-join + force-majeure flow all retained. |
| 0020 | Interaction Prototype | n/a | Design artifact only |
| 0021 | Couple Dashboard | ✅ Shipped | Day-of mode (PR #11) + event-day pre-load CTA (PR #12) + dispute entry placeholder (PR #22) |
| 0022 | Vendor Dashboard | ⚠️ Partial | 5 new placeholder routes shipped (PR #22); services + bookings + team + earnings in Phase 2 agent (in flight) |
| 0023 | Admin Console | ✅ Shipped + 2 placeholders | Funnels + Force-majeure tabs added (PR #22) — filled in by Phase 2 agent; Delete + Blacklist actions (PR #9) |
| 0024 | Save the Date | 🚫 Page-render SKU retired · 🟡 V1 ₱99 MP4 SKU reintroduced (2026-05-16) | **Two 2026-05-16 changes:** (a) Original ₱99 page-render SKU retired (Phase 1 of landing page is free in 0002). (b) NEW Save-the-Date Video MP4 SKU reintroduced 2026-05-16 — explicitly distinct from retired SKU: input = 5-10 engagement photos · output = single 30-60s 1080×1920 vertical MP4 with Setnayan-owned music + closing-card landing-page URL · ₱99/render · multi-purchase · `save_the_date_video_render` SKU code. Drives traffic back to the free landing page via end-card. ~70% net margin under V1 tax tier. |
| 0025 | Profile Settings | ✅ Shipped | EN/TL locale toggle in Phase 2 agent (in flight) |
| 0026 | BIR Tax Compliance | ✅ Shipped | TIN auto-format (PR #5) |
| 0027 | E-signature | 🚫 V1.5 deferred | — |
| 0028 | Email Notifications | ✅ 7/10 templates | Welcome, chat_message, order_quoted, order_paid, payment_matched, payment_rejected, rsvp_received. Phase 2 agent in flight adds help_ticket_replied + vendor_inquiry_received (→ 9 total) |
| 0029 | Help Center | ✅ Shipped | — |
| 0030 | Guided Tour | ⚠️ Partial | Per-surface mini-tours still queued (not in current Phase 2 batch) |
| 0031 | Day-of Guest | ✅ Shipped (NEW) | Banner + 6-card grid auto-activates T-1h to T+8h (PR #11); 3 of 6 cards are stubs depending on 0009/0011/0012 |
| 0032 | Contract Intelligence | ✅ Unblocked 2026-05-16 (Claude API setup pending) | Anthropic Console workspace "Setnayan" + spend caps locked ($500/$2K/$100); primary text model **Claude Haiku 4.5** (Contract Intelligence); Sonnet 4.6 reserved for vision (AI Highlights V1.5+); OpenAI GPT-4 reserved as V1.5+ fallback. Per-call cost ~₱1 (80% lower than prior Sonnet estimate). Owner action: sign up at console.anthropic.com, create workspace, set spend caps. |
| 0033 | Public API | ⚠️ Partial | `/health` + `/me` shipped earlier; Phase 2 agent in flight adds events/guests/vendors read-only |
| 0034 | Payments & Cart | ✅ Shipped (V1 manual reconciliation) · 🟡 Setnayan Pay reprice + Maya Business pending V1.5+ | TIN format fix flows through receipts (PR #5). **2026-05-16:** Setnayan Pay convenience fee repriced 3% → 5.5% on top of vendor price (admin-configurable per method · cheap rails 5.5% / premium rails 6.5%); BIR Marketplace Withholding 0.5% pass-through per RMC 8-2024; Maya Business as V1.5+ primary gateway with Maya QR Ph preferred (1.5% gateway fee). Engineering pending: per-method config table, BIR 2307 generation, vendor_payouts table, gateway integration. |
| 0035 | Observability | ✅ Shipped (NEW) | Sentry (PR #17) + PostHog 3-event funnel (PR #19); 4 more funnels go through PostHog Insights |
| **0037** | **Event-Day Pre-load (NEW iteration)** | ✅ Shipped | Couple + vendor T-3d → T+1d "Prepare for event day" CTA + auto-prefetch T-24h → T+12h (PR #12). Spec drafted retroactively 2026-05-16 in `0037_event_day_preload/0037_event_day_preload.md` (renumbered from the originally proposed 0036 to avoid collision with `0036_pakanta`). |

---

## Cross-cutting infra

| Item | Status | Notes |
|---|---|---|
| **Caching & Offline Strategy** | ✅ Shipped | TanStack Query + idb-keyval persister + Workbox-equivalent service worker (PR #10) |
| **R2 Storage Migration** | ✅ Shipped | All new uploads go to R2; legacy Supabase Storage URLs still resolve (PR #18) |
| **Account lifecycle (Delete vs Blacklist)** | ✅ Shipped (code); migration owner-action pending | Replaces the soft-delete + ban model from PR #7. Owner must run `supabase db push` (PR #9) |
| **Persistent login (client-aware sessions)** | ✅ Shipped | 10-year cookie maxAge for Tauri + installed PWA; 1-year for web (PR #6) |
| **Services → Add-ons rename** | ✅ Shipped | 308 redirects from `/services/*` → `/add-ons/*` (PR #13) |
| **CI build job** | ✅ Shipped | `pnpm --filter @setnayan/web build` runs on every PR (PR #15) |
| **Vendor Verification flow (NEW 2026-05-16)** | 🟡 Spec locked · engineering pending | FREE initial / ₱1,500 annual renewal / ₱2,500 re-verification after demotion · 12-document checklist (DTI / BIR 2303 / Mayor's Permit / gov ID via Persona/Veriff/Onfido / bank micro-deposit / portfolio + reverse image search / 3-5 references / live selfie + liveness / 15-min Google Meet / SMS OTP + email / social presence / AMLC sanctions) · all-or-nothing · 3-5 BD SLA · `setnayan-vendor-verification` R2 bucket (90d raw + 7yr audit). Schema migrations pending (vendors.verification_state + vendor_verification_applications + vendor_tier_history). |
| **All Tools Unlock bundle (NEW 2026-05-16)** | 🟡 Spec locked · SKU seed pending | ₱9,999/year · includes Mood Board + Palette + Seating + QR Reader + Advanced Pricing Tier · open to ALL paying vendors (NOT verified-only). vendor_tool_bundles table pending. |
| **Boosted Ads + Sponsored Boost ladder (NEW 2026-05-16)** | 🟡 Spec locked · SKU seed pending | Boosted Ads 5km ₱5K/wk · 10km ₱8K/wk · 20km ₱15K/wk · Sponsored Boost Quarterly ₱250K / Annual ₱800K at 30km (verified-only). Replaces prior single ₱1,499/wk Sponsored Boost SKU. |
| **Vendor Payout model (NEW 2026-05-16)** | 🟡 Spec locked · engineering pending | Verified = immediate full payout T+1 (less gateway + BIR 0.5%); coming_soon = 3-stage milestone release 20/60/20 with T-14 + T+7 dispute windows. Demote-to-coming_soon trigger: 3+ disputes/30d. Setnayan absorbs ₱15-25 disbursement fee. vendor_payouts table + dispute counter cron pending. |

---

## 2026-05-15 PR Run — second-day shipping

After the 2026-05-14 PR run wrapped, a follow-on session on 2026-05-15 shipped 4 more PRs to main, with 4 more in flight. Spec-side: 6 new decision-log entries locked in `CLAUDE.md`.

| PR | Decision | What shipped |
|---|---|---|
| #52 | Decision 5 — UI Theme rebrand | iteration 0025 — burgundy default replacing terracotta (`#7A1F2B` accent) + new 5th theme "Forest & Champagne Gold" (`#2D4A3A` primary + `#C9A66B` gold); theme picker UI extended; idempotent enum migration |
| #55 | Decision 1 — Self-purchase confirm + self-review hard-gate | iterations 0006/0034/0023 — schema CHECK + `block_related_account_review()` BEFORE INSERT trigger blocking owner/team/payment/device/household self-reviews; cart self-purchase confirm modal (Pay full price / Comp for myself); admin moderation queue + appeal flow; new `user_devices` + `vendor_review_appeals` + `comp_grants` (stub) tables |
| #54 | Decision 3 — Public-stats exclusion + event-switcher role rows | iterations 0006/0022/0000 — `vendor_public_completed_events_stats` materialized view (filters team/internal/self-comp from public count) + `vendor_full_completed_events_stats` sibling; vendor dashboard "Completed events" card with public-vs-private toggle; event-switcher Shop/Admin console role rows; empty-state monogram split by role |
| #56 | Decision 6 — Vendor visibility + Website editor | iterations 0006/0015/0022/0023 — `vendors.public_visibility ENUM('hidden','coming_soon','verified','archived')` with `coming_soon` default + backfill of existing verified rows; DIY-browse "Verified only" toggle (OFF by default → coming-soon vendors visible with badge); `site_widgets` widget registry + `platform_availability` table; admin Website editor at `/admin/website` (8th admin surface) with native HTML5 drag-drop reorder; `/admin/verify` queue with status tabs + audit-logged actions |

**4 PRs in flight** as of this regen (background agents working in parallel worktrees):
- **PR #57** (Decision 4 homepage 12-section skeleton) — perf optimization agent running; lighthouse regression from 0.88 → 0.71 needs to return to ≥0.9 before merge
- **shared-chrome perf agent** — fixing main's lighthouse regression caused by PR #53 (shared SiteHeader) + PR #56 (admin chrome) bloat that dropped every route's lighthouse score
- **/for-vendors page agent** — full vendor-side landing per spec (Airbnb host page convention; outcome-led merchant framing per Shopify; pricing visible exception to homepage's hide-prices rule)
- **/features page agent** — feature deep-dive page (recipient of dropped Section 7 "Outsourcing, pacing, scheduling" content from Decision 4 homepage redesign)

**6 new decision-log entries today** (in CLAUDE.md): dual-role self-purchase/review gate · V1 platform expansion (5 native apps deferred V1.5) · dual-role public-stats exclusion · public-website wholesale redesign · UI theme rebrand · vendor visibility + widget editor.

**Status shifts (from 2026-05-14 baseline):**
- 0000 — chrome drift fix from Decision 7 (Roadmap doc) still pending; this PR run added Shop/Admin event-switcher rows
- 0006 — stays ⚠️ Partial (marketplace browse + reviews shipped; vendor-side admin moderation now wired via PR #55; full self-review gate live)
- 0015 — stays ✅ Shipped (12-section restructure in PR #57 still pending)
- 0022 — stays ⚠️ Partial (vendor dashboard public-stats card + public_visibility state machine added)
- 0023 — ✅ Shipped + 2 new surfaces (Website editor as 8th admin surface; Verify queue at `/admin/verify`); review-moderation queue from PR #55
- 0025 — ✅ Shipped (theme system extended to 5 themes — Setnayan Default Color burgundy + Forest & Champagne Gold)
- 0034 — ✅ Shipped (cart self-purchase confirm modal added)

**Owner-side blocker** (CRITICAL — applies before any V1 launch):
- **`supabase db push`** — 10+ migrations are now pending production push:
  - 6 from the 2026-05-14 run (vendor_reviews + vendor_dashboard expansion + force_majeure + api_scopes + notification_type + blacklist)
  - 4 from the 2026-05-15 run (theme_preference enum extension + vendor_public_visibility + site_widgets + self_review_gate schema)
  - Without `supabase db push`, half the new code in main 500s in production.

**Migration name-collision note:** Three of the 4 new migrations from 2026-05-15 each declare `CREATE TABLE IF NOT EXISTS admin_audit_log` with slightly different columns (PRs #54, #55, #56 each stubbed it independently). Two declare `CREATE TABLE IF NOT EXISTS comp_grants` similarly (#54, #55). All idempotent (`CREATE TABLE IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS`); union schema lands cleanly in any merge order. Worth eyeball when reviewing.

---

## Phase 2 — in flight as of EOD 2026-05-14

5 background agents are landing PRs in parallel. When this doc was regenerated, the 3 originally-spawned agents had opened their PRs and the 2 follow-up agents had just launched:

| Agent | What it ships |
|---|---|
| A | `/vendors` public marketplace + `vendor_reviews` schema + post-completion trigger + display on `/v/[slug]` + vendor-side review viewer |
| B | `/vendor-dashboard/services` editor + `/bookings` inbox + `/team` (4 roles) + `/earnings` rollup |
| C | `/admin/funnels` Supabase-side analytics + `/admin/force-majeure` queue + `force_majeure_flags` schema + couple-side `/dashboard/[eventId]/disputes` flag form |
| D | EN/TL locale toggle in `/dashboard/profile` + 2 new email templates (help_ticket_replied + vendor_inquiry_received) |
| F | Read-only `/api/v1/events`, `/api/v1/events/[id]/guests`, `/api/v1/vendors`, `/api/v1/vendors/[id]` |

Owner must run `supabase db push` once all Phase 2 PRs are merged — multiple new migrations land together (blacklist + reviews + force-majeure + team + services-pricing fields).

---

## Phase 3 — decision-gated (waiting on owner)

| Item | The decision |
|---|---|
| ~~Save-the-Date render pipeline~~ | **CLOSED 2026-05-16** — 0024 reframed, no render pipeline needed (free landing page Phase 1) |
| Panood live stream | Provision Cloudflare Stream Live + YouTube Data API + master channel |
| Marketplace commission model | Free / commission per booking / paid tier |
| Daily.co video meetings | Sign up, paste API key |
| Anthropic Claude API (0032) | Sign up + spend cap | **LOCKED 2026-05-16:** workspace "Setnayan" · $500/mo soft alert · $2,000/mo hard cap · $100/day soft cap · primary text model Claude Haiku 4.5 · vision Sonnet 4.6 · OpenAI GPT-4 V1.5+ fallback |
| Apple Developer Program | $99/yr enrollment (V1.0+ deferred per owner) |
| ~~Render pipeline infra~~ | **CLOSED 2026-05-16** — alongside item #6 closure; landing page is web tech only |

---

## Owner-side blockers (must act, no code can replace)

- **`supabase db push`** — apply all pending migrations (PR #9 + Phase 2 PRs)
- **Sentry / PostHog smoke test** — trigger one prod error, sign up one fresh user
- **Resend signup smoke test** — confirm welcome email lands at non-account-holder Gmail
- **Cowork spec reconciliation** — `COWORK_INBOX.md` entries below

---

## Pending Cowork spec updates (from today's run)

The 2026-05-14 PR run added or changed several iterations. The spec corpus needs catch-up edits via Cowork:

1. **0037 Event-Day Pre-load** — ✅ DONE 2026-05-16. Iteration folder `0037_event_day_preload/0037_event_day_preload.md` created (renumbered from the originally proposed 0036 to avoid collision with the existing `0036_pakanta` iteration). Spec retroactively documents PR #12 — couple-side banner CTA (T-3d / T+1d) + silent auto-preload (T-24h / T+12h) + vendor-side per-thread CTA + RLS-gated bundle + service-worker asset warming.
2. **0023 Admin Console + 0025 Profile Settings** — update to reflect the Delete vs Blacklist redesign (PR #9). The old soft-delete + ban model from PR #7 is gone; spec text in `0023_admin_console.md` § 9.1 should be updated.
3. **0006 Vendors** — once the Phase 2 marketplace + reviews PR merges, update `0006_vendors_management.md` to reflect that the marketplace + review-stats materialized view are live.
4. **0019 Communications** — once the Phase 2 force-majeure PR merges, update `0019_communications.md` to reflect the actual schema + admin flow.
5. **Services → Add-ons rename** (PR #13) — mechanical search-replace across spec docs that reference `/services` routes. The CONCEPT didn't change; only the naming.
6. **0035 Observability** — promote from "blocked on owner signup" to "shipped V1" in `V1_Gap_Analysis_Status.md` Tier 3 row #8.

Owner: walk these via Cowork at convenience.

---

## How to re-generate this doc

1. List spec folders: `ls ~/Documents/Claude/Projects/Setnayan/ | grep -E '^[0-9]{4}_'`
2. Migrations on `main`: `git ls-tree -r origin/main supabase/migrations | awk '{print $4}'`
3. Routes: `git ls-tree -r origin/main apps/web/app | grep '/page\.tsx$' | awk '{print $4}'`
4. Cross-reference with [STATUS.md](https://github.com/iscasasola/setnayan-platform/blob/main/STATUS.md) + [HANDOFF.md](https://github.com/iscasasola/setnayan-platform/blob/main/HANDOFF.md).
5. Re-bucket every iteration. Update the table above.
