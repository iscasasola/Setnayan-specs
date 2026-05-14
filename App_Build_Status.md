# Setnayan — App Build Status (spec vs. live code)

**Last regenerated:** 2026-05-14 (end of day, after the big PR run)
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
| ✅ Shipped | **23** | 0000, 0001, 0002, 0004, 0007, 0008, 0010, 0013, 0015, 0016, 0021, 0023, 0024, 0025, 0026, 0028, 0029, 0030, **0031**, 0033 (partial), 0034, **0035**, **0036** (NEW) |
| ⚠️ Partial / Phase 2 in flight | 5 | 0006, 0019, 0022, 0030, 0033 |
| 🟡 Deliberate V1.5+ | 6 | 0005, 0009, 0011, 0012, 0017, 0018 |
| ⛔ Blocked | 1 | 0032 (Anthropic) |
| 🚫 Retired | 3 | 0003, 0014, 0027 |

**Bold** = changed today.

---

## Per-iteration status (post 2026-05-14)

| # | Iteration | Status | What changed today (if any) |
|---|---|---|---|
| 0000 | App Shell & Navigation | ✅ Shipped | Bottom nav now reads "Add-ons" (PR #13); locale toggle (Phase 2 agent in flight) |
| 0001 | Creating Guest List | ✅ Shipped | RSVP-received email + in-app notification (PR #20) |
| 0002 | QR Invitation System | ✅ Shipped | — |
| 0003 | Token Wallet (retired) | 🚫 — | — |
| 0004 | Invitation Widgets | ✅ Shipped (free tier) | Pro tier still queued (not in current Phase 2 batch) |
| 0005 | LED Background | 🟡 V1.5+ | Now visible as "Coming soon" in the add-ons grid |
| 0006 | Vendors Management | ⚠️ Partial | `/vendors` placeholder shipped (PR #22); marketplace + reviews in Phase 2 agent (in flight) |
| 0007 | Budget & Expenses | ✅ Shipped | — |
| 0008 | Seating Chart Editor | ✅ Shipped | — |
| 0009 | Photo Delivery | 🟡 V1.5+ | — |
| 0010 | Mood Board | ✅ Shipped | — |
| 0011 | Panood | 🟡 V1.5+ (decision-gated) | — |
| 0012 | Papic | 🟡 V1.5+ (web V1 in design queue) | — |
| 0013 | Platform Stack | ✅ Shipped | Caching foundation (PR #10) · R2 storage (PR #18) · Sentry + PostHog (PR #17, #19) · CI build gate (PR #15) |
| 0014 | V1.1 Polish | 🚫 No folder | — |
| 0015 | Main Website | ✅ Shipped | Landing-page conversion upgrades — split CTA, trust signals, pricing table (PR #21) |
| 0016 | Step-by-Step Plan Builder | ✅ Shipped | — |
| 0017 | Patiktok | 🟡 V1.5+ | Now visible as "Coming soon" in add-ons grid (PR #22) |
| 0018 | Supplies Marketplace | 🟡 V1.5+ | Now visible as "Coming soon" in add-ons grid (PR #22) |
| 0019 | Communications | ⚠️ Partial | Force-majeure flow + admin escalation in Phase 2 agent (in flight); video meetings still deferred |
| 0020 | Interaction Prototype | n/a | Design artifact only |
| 0021 | Couple Dashboard | ✅ Shipped | Day-of mode (PR #11) + event-day pre-load CTA (PR #12) + dispute entry placeholder (PR #22) |
| 0022 | Vendor Dashboard | ⚠️ Partial | 5 new placeholder routes shipped (PR #22); services + bookings + team + earnings in Phase 2 agent (in flight) |
| 0023 | Admin Console | ✅ Shipped + 2 placeholders | Funnels + Force-majeure tabs added (PR #22) — filled in by Phase 2 agent; Delete + Blacklist actions (PR #9) |
| 0024 | Save the Date | ✅ Shipped (UI; render pipeline = Phase 3 decision) | — |
| 0025 | Profile Settings | ✅ Shipped | EN/TL locale toggle in Phase 2 agent (in flight) |
| 0026 | BIR Tax Compliance | ✅ Shipped | TIN auto-format (PR #5) |
| 0027 | E-signature | 🚫 V1.5 deferred | — |
| 0028 | Email Notifications | ✅ 7/10 templates | Welcome, chat_message, order_quoted, order_paid, payment_matched, payment_rejected, rsvp_received. Phase 2 agent in flight adds help_ticket_replied + vendor_inquiry_received (→ 9 total) |
| 0029 | Help Center | ✅ Shipped | — |
| 0030 | Guided Tour | ⚠️ Partial | Per-surface mini-tours still queued (not in current Phase 2 batch) |
| 0031 | Day-of Guest | ✅ Shipped (NEW) | Banner + 6-card grid auto-activates T-1h to T+8h (PR #11); 3 of 6 cards are stubs depending on 0009/0011/0012 |
| 0032 | Contract Intelligence | ⛔ Blocked on Anthropic | — |
| 0033 | Public API | ⚠️ Partial | `/health` + `/me` shipped earlier; Phase 2 agent in flight adds events/guests/vendors read-only |
| 0034 | Payments & Cart | ✅ Shipped | TIN format fix flows through receipts (PR #5) |
| 0035 | Observability | ✅ Shipped (NEW) | Sentry (PR #17) + PostHog 3-event funnel (PR #19); 4 more funnels go through PostHog Insights |
| **0036** | **Event-Day Pre-load (NEW iteration)** | ✅ Shipped | Couple + vendor T-3d → T+1d "Prepare for event day" CTA + auto-prefetch T-24h → T+12h (PR #12). Spec needs to be added to Cowork corpus |

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
| Save-the-Date render pipeline | Browser-canvas + MediaRecorder OR server FFmpeg |
| Panood live stream | Provision Cloudflare Stream Live + YouTube Data API + master channel |
| Marketplace commission model | Free / commission per booking / paid tier |
| Daily.co video meetings | Sign up, paste API key |
| Anthropic Claude API (0032) | Sign up + spend cap |
| Apple Developer Program | $99/yr enrollment (V1.0+ deferred per owner) |
| Render pipeline infra | Cloudflare Workers Paid + Hetzner Cloud |

---

## Owner-side blockers (must act, no code can replace)

- **`supabase db push`** — apply all pending migrations (PR #9 + Phase 2 PRs)
- **Sentry / PostHog smoke test** — trigger one prod error, sign up one fresh user
- **Resend signup smoke test** — confirm welcome email lands at non-account-holder Gmail
- **Cowork spec reconciliation** — `COWORK_INBOX.md` entries below

---

## Pending Cowork spec updates (from today's run)

The 2026-05-14 PR run added or changed several iterations. The spec corpus needs catch-up edits via Cowork:

1. **0036 Event-Day Pre-load** — NEW iteration not in any spec folder yet. Owner picks one:
   - Add a new section to `02_Specifications/Caching_and_Offline_Strategy.md`, OR
   - Create a new iteration folder `0036_event_day_preload/0036_event_day_preload.md`
   - Content already drafted in `COWORK_INBOX.md` `[PENDING]` entry
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
