# Claude Code Build Prompt — Setnayan V1

> The first document Claude Code reads when starting to build the Setnayan V1 app. Read it top-to-bottom in one pass before opening any iteration folder. Everything you need to start coding is here or one hop away.

---

## 1. What you are building

The **Setnayan V1 app** is a Philippines-first life-events platform. One product, three role-routed doorways: **customers** plan events end-to-end, **vendors** run a free-during-launch business profile, **admins** (Setnayan team) operate the platform from a 7-surface internal console. V1 ships **weddings**; the architecture supports the broader event roadmap (birthday, celebration, travel, corporate, burial) as event types unlock over time. Full product context lives in `CLAUDE.md` (read it second, after this file). Spoken brand name is **Setnayan** (SET-na-yan), origin phrase *"Set na 'yan."* — Tagalog for "that's all set."

---

## 2. Build order

Build iterations strictly in numeric order with two exceptions: **0013 ships first as Sprint 0**, and the retired tombstones (0003, 0020) plus the post-V1 queue (0014) are skipped.

### Sprint 0 — Platform foundation (blocks everything else)

- **0013 Platform Stack & Sync Setup.** Vercel + Supabase + Cloudflare R2 + GitHub + Daily.co + Resend + Sentry + PostHog + Better Stack. All 15 integration tests in `0013_platform_stack_and_sync/tests.md` must pass before any feature iteration starts.

### Sprint 1+ — Feature iterations

Build 0000 through 0012, then 0015 through 0035, in numeric order. Each iteration is self-contained — five files in one folder.

**Skip entirely:**
- `0003_token_wallet_and_packs/` — **RETIRED 2026-05-11** (replaced by apply-then-pay)
- `0020_admin_console/` — **SUPERSEDED 2026-05-12** (use 0023 instead)
- `0014_v1_1_polish/` — queued for V1.1, do not build in V1

**The 5-file iteration folder pattern (33/33 conform):**

| File | Purpose |
|---|---|
| `NNNN_*.md` | Engineering spec — source of truth |
| `NNNN_*.html` | Interactive prototype — visual contract |
| `NNNN_*.docx` | Stakeholder mirror — non-engineering review |
| `tests.md` | Acceptance criteria + coverage map + scenarios |
| `fixtures.json` | Deterministic sample data using `S89X-` IDs |

The fixtures.json baseline is cross-iteration coherent — the guest in 0001 is the same guest seated in 0008 and tagged in 0012. Use these fixtures for dev seeding and test setup.

---

## 3. The locked technical stack

- **Web frontend.** **Next.js 14+ App Router on Vercel.** React 18, TypeScript strict.
- **Backend.** **Supabase** (Postgres + Auth + Realtime + Storage + Edge Functions). Primary database in Singapore region for low RTT to PH (~50ms to Manila/Cebu/Davao).
- **Object storage.** **Cloudflare R2** in PH region. Three buckets: `setnayan-media` (photos/videos/renders), `setnayan-thread-files` (0019 chat attachments), `setnayan-vendor-contracts` (signed vendor agreement PDFs).
- **Render pipeline.** **Remotion** (React-based programmatic video) + FFmpeg + Lottie + `.cube` LUTs. Cloudflare Workers orchestrate; **Hetzner Cloud** is the fallback pool. Replaces hand-rolled FFmpeg scripting.
- **Native apps.** **SwiftUI for iOS 16+**, **Jetpack Compose for Android 11+** (Papic capture surface in iteration 0012). Platform-native, **NOT React Native** — capture pipeline performance is non-negotiable.
- **Desktop apps.** **Tauri** wrapping the web build for macOS + Windows. **Deferred to V1.1** — not in V1 scope.
- **Video meetings.** **Daily.co** (hosted SFU, Singapore region) for chat-attached video meetings in iteration 0019.
- **Email.** **Resend** primary, **SendGrid** fallback. 10 V1 transactional templates per iteration 0028. RFC 8058 one-click unsubscribe.
- **Live stream.** **Cloudflare Stream Live** for SFU ingest → server-side composite → RTMP relay to **YouTube** on the `@SetnayanWeddings` master channel. **No YPP enrollment** on that channel (monetization disabled). YouTube absorbs all viewers at ₱0 marginal cost to Setnayan.
- **Inference.** **Cloudflare Workers AI** (free tier) for Whisper transcription + light LLM tasks; **Anthropic Claude API** for vision-heavy work (AI Highlights, Same-Day Edit, Contract Intelligence).
- **Observability.** **Sentry** (errors) + **PostHog** (product analytics) + **Better Stack** (uptime + status page + on-call). ~₱3,500/month total. Status page at `status.setnayan.com`.

---

## 4. The locked canonical patterns

### 4.1 Entity IDs — `S89<TYPE>-<10-char Crockford base 32>`

Every customer-facing identifier uses this format. Random body (NOT sequential — sequential enables enumeration attacks). Internal joins continue to use a hidden `bigserial id`; the `public_id` column is what shows up to customers, on receipts, in QR codes, in support transcripts.

| Prefix | Entity |
|---|---|
| `S89U-` | Users (customers, vendors, admins, guests — one users table) |
| `S89V-` | Vendor business profiles |
| `S89E-` | Events |
| `S89O-` | Orders (payment reference codes) |

Canonical reference at `02_Specifications/Account_ID_Format.md` including the Postgres `generate_public_id(type_letter)` function. 9 type letters reserved for V1.5+ (A/B/C/G/M/P/S/T/R). Crockford base 32 omits ambiguous `I/L/O/U` for phone-call legibility.

### 4.2 RLS — canonical pattern doc

Every table uses one of **8 policy patterns** from `02_Specifications/RLS_Policy_Pattern.md` (per-user · per-event · vendor-team · public-read · chat-thread · admin-only · per-order · static-reference). Four security-definer helper functions are mandatory:

- `is_admin()`
- `current_event_ids()`
- `current_vendor_ids(role)`
- `current_thread_ids()`

CI gates deploy on RLS verification queries. The doc maps every ~95 active-iteration table to its policy pattern. **Don't invent new patterns — pick one of the 8.**

### 4.3 Payment flow — apply-then-pay (iteration 0034)

Customer adds to cart → checkout produces a `S89O-XXXXXXXXXX` reference code → external payment via BDO or GCash QR → screenshot upload → admin manually reconciles within **24-hr SLA**. Reconciliation matcher (4-tier fuzzy SQL function `match_inbox_to_order`) lives in `0034 § 11`. The retired token wallet (iteration 0003) is **gone** — do not implement, do not reference.

Reference codes are 10-char Crockford. 7-day expiry on `pending_payment`. Resubmission supported on the same `order_id` (`resubmission_count` increments). Internal accounts (§ 10a) skip payment-pending entirely; team-pool members (§ 10b) get partial/full comp atomically through the standard flow.

### 4.4 Template renders — Remotion + Lottie + .cube LUT

V1 ships **30 locked flagship templates** (all free tier) — see `02_Specifications/Template_Catalog_V1.md`. Each template becomes a Remotion JSX component at `src/templates/{category}/{template_id}.tsx`. SKUs that consume templates:

- **0024** Save-the-Date Maker
- **0012** Papic — Personal Reels
- **0017** Patiktok
- **0011** Panood — AI Video Highlight + AI Edited Highlight + Same-Day Edit
- **0005** LED Background Maker

No filler templates. **Quality over breadth** — every free-tier template is one of the best, not one of the cheapest.

### 4.5 Watermark preview rule

**Client-side preview** uses FFmpeg.wasm + WebCodecs to render the template against the couple's actual photos with a large `SETNAYAN PREVIEW` watermark. **Paid server-side render** is byte-identical EXCEPT the watermark layer is absent. Couples preview unlimited times before purchasing — zero server cost during exploration.

**Custom Monogram Pack (₱1,999)** replaces both the preview AND final watermark with the couple's monogram across all event-wide media outputs.

### 4.6 Responsive Showcase view

Every interactive `.html` prototype carries a **Showcase toggle** that renders the current screen across 4 device frames in a 2×2 grid simultaneously:

- Desktop 1440×900
- iPad Pro 1024×1366
- iPhone 15 Pro 393×852
- Pixel 8 412×915

Locked baseline UI element in the prototype appbar. Every new prototype inherits it. Used for design review, investor demos, QA spot-checks.

### 4.7 The 5-file iteration folder pattern

Already covered in Section 2. Every iteration carries spec + prototype + docx + tests + fixtures. **No exceptions** — 33/33 active iterations conform.

---

## 5. Pricing (locked 2026-05-12, charm-priced -1 endings)

All prices PHP-direct. No tokens. Stored in `service_catalog` as `amount_php` integers.

| SKU | Price |
|---|---|
| Save-the-Date Render | ₱99 / render |
| Personal Reel template unlock | ₱49 (event-wide) |
| Patiktok booth (5 hours) | ₱2,499 / booth |
| Patiktok +1 Hour add-on | ₱499 |
| LED Background loop | ₱99 |
| **AI Video Highlight (60s)** | **₱999** (Strategy B premium tier) |
| **AI Edited Highlight (3-min)** | **₱2,999** (Strategy B premium tier) |
| **Same-Day Edit (3–5 min)** | **₱24,999** (Strategy B flagship — same-day delivery vs market's 4–12 weeks) |
| Pro Template unlock (per template, future tier) | ₱99 |
| Pro Template All-Bundle (event-wide, future tier) | ₱499 |
| Live Stream Base (1 broadcaster + 3 cams + 3 hrs) | ₱2,499 |
| Live Stream +1 Camera add-on (max +2) | ₱999 |
| Live Stream +1 Hour add-on (unlimited) | ₱999 |
| Custom Monogram Pack | ₱1,999 |
| Broadcast Style Pack | ₱2,999 |
| Pro Camera Bridge (per DSLR seat) | ₱1,499 |
| Pro Widget tier (per invitation widget) | ₱99 |
| Pro Widget Bundle (all 3) | ₱199 |
| 3 Paparazzi seats | ₱1,499 |
| 5 Paparazzi seats | ₱2,499 |
| Vendor Pro Weekly | ₱499 / wk |
| Sponsored Boost (certified vendors only) | ₱1,499 / wk |

**Setnayan Pay convenience fee:** +3% on customer invoice when Setnayan processes a vendor booking. Vendor receives full booking amount; fee is the customer's cost.

---

## 6. Brand strings

- **Wordmark.** **SETNAYAN** — always full-word, **never STNYN** (consonant-only stylization retired 2026-05-12). Manrope 700 uppercase, letter-spacing 0.06em.
- **Tagline.** *"Set na 'yan."* — Tagalog for "that's all set." Always with the period.
- **Domain.** `setnayan.com` (primary) + `setnayan.ph` (alternate).
- **YouTube master channel.** `@SetnayanWeddings`.
- **Symbol mark.** `0015_main_website/setnayan_logo.svg`. SVG with transparent cutout so it works on any background.
- **DPO contact.** `dpo@setnayan.com`.
- **All brand strings centralized.** `brand.config.ts` is the single source of truth — one PR flips any brand string platform-wide.

Sub-product names under the Setnayan umbrella (each is a Filipino word, no brand prefix):

- **Papic** — candid-capture iteration (0012)
- **Panood** — live stream iteration (0011)
- **Patiktok** — short-form reel templates (0017)
- **Sulyap** — V1 reel-template roadmap
- **Din** — Phase 3 supplier app
- **Kasalan** — wedding-AI module
- **Supplies** — third-vertical marketplace (deferred)

---

## 7. Before you start coding — prerequisites

Verify **every line item** in `API_Integration_Checklist.md` (502 lines, 7 tiers) is complete. Without these accounts the code can't deploy end-to-end. Several require multi-day approval and must start in parallel with Sprint 0:

- **Apple Developer Program** — 24–48hr approval (for iOS Papic)
- **DSLR vendor SDK access** — Canon / Nikon / Sony / Fujifilm WiFi SDKs (Pro Camera Bridge)
- **BIR registration** — Setnayan legal entity + tax registration (blocks payment processing)
- **Static BDO + GCash receiving accounts** — verified merchant inboxes for reconciliation
- **Cloudflare R2 PH-region buckets** — provisioned + bucket policies + signed-URL keys
- **Daily.co + Resend + Anthropic API + Sentry + PostHog + Better Stack** — all provisioned with billing attached

Engineering CAN start Sprint 0 (0013 scaffolding) before the slowest external approvals land — those approvals block deploy, not local development.

---

## 8. Documentation to read in order

Read these before opening any iteration folder. Each builds on the previous:

1. **`CLAUDE.md`** — project-wide decision log. Most recent decisions at the bottom. **Read in full.** This is the source of truth for "why is it built this way."
2. **`02_Specifications/00_Iteration_Connection_Map.md`** — cross-iteration data flow + dependency graph.
3. **`02_Specifications/Account_ID_Format.md`** — the `S89X-` canonical ID contract.
4. **`02_Specifications/RLS_Policy_Pattern.md`** — the 8 RLS patterns + 4 helper functions + per-table mapping.
5. **`02_Specifications/Template_Catalog_V1.md`** — the 30 locked V1 templates (Remotion components).
6. **`RETIRED_ITEMS.md`** — what NOT to build. Token wallet, STNYN wordmark, old 0020 admin console, etc.
7. **`01_Contracts/Setnayan_Privacy_and_Security_Policy.md`** — RA 10173 compliance contract.
8. **`01_Contracts/Setnayan_Vendor_Agreement.md`** — what vendors agree to (mandatory logo upload, chat identity masking, team pool, internal accounts).
9. **The iteration you're currently working on** — all 5 files (.md, .html, .docx, tests.md, fixtures.json) in that folder.

---

## 9. Workflow per iteration

For each iteration NNNN:

1. **Read all 5 files** in `NNNN_*/` before writing any code. The `.md` spec is canon; the `.html` is the visual contract; `tests.md` is the merge gate; `fixtures.json` is your dev seed.
2. **Honor every "Locked" claim** in the `.md`. Locked decisions are not up for debate during implementation.
3. **Schema first.** If the spec references a table or column, confirm it exists in the migration files. If not, write the migration before the feature code.
4. **RLS second.** Apply the matching pattern from `RLS_Policy_Pattern.md`. CI fails the build if a new table lands without an RLS policy.
5. **Translate the prototype.** The `.html` mockup is the visual contract — convert it to React components, don't reinterpret it.
6. **Replace the prototype `.html`** with a real interactive component when the feature ships. Most iterations 0016–0035 currently have placeholder prototypes — those are explicit upgrade points.
7. **Test against `tests.md`.** Every checkbox in that file is a CI-enforced acceptance criterion. PR cannot merge until all checkboxes pass.

---

## 10. Commit conventions

Conventional commits with iteration-scoped prefixes:

- **Single-iteration work:** `iter(0021): add overview surface card`
- **Cross-iteration work:** `cross: align brand tokens across web + native`
- **Sprint 0 platform work:** `iter(0013): wire R2 signed-URL helper`
- **Spec / doc changes:** `docs(0024): clarify STD render quota`
- **Chore / tooling:** `chore: bump pnpm to 9.x`

PR titles **must include the iteration number** in the same `iter(NNNN):` or `cross:` form. PRs over 400 changed lines should split unless the change is genuinely atomic.

---

## 11. Definition of done per iteration

A feature iteration is done when:

- [ ] Every checkbox in `tests.md` ticked
- [ ] Coverage ≥80% on new code; overall project coverage ≥70%
- [ ] TypeScript strict — `tsc --noEmit` zero errors
- [ ] Lint + format — `eslint .` + `prettier --check` zero errors
- [ ] No critical Sentry events in CI smoke run
- [ ] PostHog events emit for every telemetry point the spec requires
- [ ] axe-core accessibility — zero failures on new surfaces
- [ ] Lighthouse — Performance / Accessibility / Best Practices / SEO ≥ 90 on touched routes
- [ ] Bundle analyzer — no single chunk > 200KB gzipped
- [ ] RLS policies present on every new table; deploy-gate verification queries pass
- [ ] Schema migration dry-run on staging before production apply
- [ ] `.html` prototype either replaced with a real component OR explicitly deferred with a tracked follow-up issue
- [ ] CLAUDE.md decision log updated if a meaningful decision landed during the build

---

## 12. Decisions you should NOT relitigate

The decision log in `CLAUDE.md` is the source of truth. Trust it. Specifically, the following are **locked** — surface a question if you think one needs revisiting, but never silently change them:

- **Apply-then-pay payment flow** (not token wallet — that's retired)
- **YouTube-only Live Stream delivery** (Cloudflare Stream Live ingests; YouTube absorbs viewers at ₱0 marginal cost)
- **Remotion + Lottie + .cube LUT render pipeline** (not hand-rolled FFmpeg scripting)
- **Native SwiftUI / Compose for Papic capture** (not React Native, not Flutter)
- **Supabase as primary backend** (not bare Postgres + custom auth)
- **Cloudflare R2 for object storage** (not S3 — R2 free egress is architectural)
- **Daily.co for video meetings** (not self-hosted WebRTC SFU)
- **PHP-direct charm pricing with -1 endings** (not round prices, not tokens, not USD)
- **`S89X-` ID format with Crockford base 32 random body** (not sequential, not UUID-as-public-ID)
- **Vendor mandatory logo + chat identity masking** (per Vendor Agreement § 1.1 + § 3.10)
- **Owner internal accounts (§ 10a) skip payment-pending**; team pool (§ 10b) is single shared monthly cap, use-it-or-lose-it
- **No SMS in V1** — email-only notification fallback per iteration 0028
- **No public API endpoints in V1** — iteration 0033 plumbs the gateway only
- **5-second hard cap on video clips**; **max 10 tags per photo**; **untagged-still-delivered guarantee**
- **The 30-day post-download compression rule** for downloaded originals
- **Per-event-scoped face vector store** — never reused across weddings
- **Five-file iteration folder pattern** — `.md` + `.html` + `.docx` + `tests.md` + `fixtures.json`
- **Apparatus-only pricing rule** — Setnayan SKUs price software TOOL access, never hardware, never crew, never hours of human labor

---

## 13. When you're stuck

**Don't guess.** Surface the question. Setnayan ships once — getting it right matters more than getting it fast.

Ask the operator when:

- A locked decision in CLAUDE.md is at risk of being broken
- A spec contradicts CLAUDE.md
- PII / RA 10173 handling implications are unclear
- A new external service or vendor is required
- A new SKU is being introduced (not in the catalog)
- Compute cost > ₱500/month new spend

Decide yourself when:

- Implementation detail is within a spec's contract
- Code style fits the established conventions
- Test naming, file naming, internal function organization
- Performance optimizations that maintain the contract
- Refactoring within the same scope

When in doubt, ask. Better to confirm than to lock the project into a wrong direction.

---

*This is the contract between strategy and engineering. When Claude Code reads this file + `CLAUDE.md` + the relevant iteration's 5 files, it has everything it needs to produce production code. Hand off when `API_Integration_Checklist.md` is fully checked.*
