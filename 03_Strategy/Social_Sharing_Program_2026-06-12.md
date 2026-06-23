# Social Sharing & Featuring Program — 2026-06-12

> **Status: BUILT 2026-06-13 — shipped via PR [#1304](https://github.com/iscasasola/setnayan-platform/pull/1304) (auto-merge armed).** Vendor featuring policy OWNER-LOCKED to "hybrid by tier." Migration `20261130000000_social_sharing_program.sql` APPLIED to prod. As-built notes: publish gate = `event_date + 7 days` app-side (no review-window column exists in the shipped schema — the 7-day buffer mirrors the gallery-review doctrine); consent prompts shipped on monogram + save-the-date (website/reel/led_design types exist in the schema CHECK, prompts to follow); Pro+ derivation = `vendor_profiles.tier_state ∈ (pro, enterprise)` guarded by `tier_expires_at`; admin surface = `/admin/social-queue` in the Work nav group; greetings panel is render-only (no `birthday_greeting` email template yet — still a 0028 follow-up).

## 1. Purpose

Turn the Setnayan Facebook page into a content engine fed by the product itself, with consent captured in-app:

1. **Couple creations** — monograms, save-the-dates, event websites, reels, LED designs shared as showcase posts.
2. **New verified vendors** — a recurring "just verified ✅" drumbeat that doubles as a vendor-recruitment carrot.
3. **Birthdays & anniversaries** — personal greetings that re-surface the brand on the couple's timeline.

Everything here is marketing use of customer data/content, which under **RA 10173 requires its own consent**, separate from the consent that delivers the service. That separation is the spine of this spec.

## 2. Couple creation sharing — "Feature us"

### 2.1 Consent capture

- **Per-artifact, opt-in, default OFF.** No global "share my stuff" toggle. Each consent names one artifact (this monogram, this save-the-date render).
- **Asked at the moment of delight:** immediately after a render completes / a monogram is accepted, a small card: *"Proud of this one? Allow Setnayan to feature it on our page after your big day."* Never blocks the flow; dismissible; re-askable from the artifact's own page later.
- **Credit choice at consent time:** `first_names` ("Ana & Miguel's monogram") or `anonymous` ("A Setnayan couple's monogram").

### 2.2 Publish gate — never before the event

A consented artifact becomes **postable only after BOTH**:

1. `event_date` has passed, AND
2. the couple's gallery review window (7-day default) has closed — so we never feature something they later pulled.

Rationale: pre-event posts spoil guest-facing surprises AND publicly advertise a date + venue (same threat model as geo-stripping on outbound shares).

### 2.3 Face tiers (what is featureable in V1)

| Tier | Content | V1 policy |
|---|---|---|
| A | No people — monograms, palettes, websites, LED designs, QR art | Featureable with consent |
| B | Couple only — save-the-date videos, couple reels | Featureable with consent (the consenting party IS the subject) |
| C | Contains guests — gallery photos, Papic output, group reels | **NOT featureable in V1.** Guest RSVP consent covers the couple's gallery, not Setnayan marketing. V1.5: reuse the Salamisim FaceBlock blur pipeline to make tier-C postable. |

### 2.4 Revocation (0025 Privacy & Data)

- New block in the existing Privacy & Data tab: list of all artifacts with active share consent, one-tap **Revoke**.
- Revoked before posting → row leaves the HQ queue, never posted.
- Revoked after posting → flagged in HQ; team takes the post down within the standard 24-hr SLA.

### 2.5 Data model (build-time reference)

```
marketing_share_consents(
  id, event_id, customer_id,
  artifact_type  -- monogram | save_the_date | website | reel | led_design | ...
  artifact_id,
  credit_mode    -- first_names | anonymous
  consented_at, revoked_at,
  posted_at, post_url, taken_down_at
)
```

RLS: couple sees/edits own rows; admin full (standard patterns — no new pattern invented).

## 3. Vendor verification featuring — HYBRID BY TIER (owner-locked 2026-06-12)

The fork: "tiers sell reach" + hybrid-anonymity hide Free+Verified names in the marketplace until first chat reply — but a verification shoutout is the best recruitment carrot during free launch. Owner locked the hybrid:

| Vendor tier | Facebook post on verification |
|---|---|
| Free + Verified | **Category-level mention, unnamed:** "A new caterer in Iloilo just got verified ✅" — keeps the drumbeat + recruitment proof without granting named reach |
| Pro / Enterprise | **Named feature:** business name + logo + sample photos |

- Consistency: this mirrors the in-app hybrid-anonymity model exactly (category visible, name is what Pro buys).
- **Upsell hook:** the unnamed mention is itself a Pro pitch — "want your name on our page? Go Pro."
- **Opt-out checkbox at registration/verification** (default ON — business identity, clearly disclosed). Tier upgrade later → vendor becomes eligible for a named feature post.

## 4. Birthdays & anniversaries

- **Optional DOB field per partner** in 0025 Profile tab, labeled with purpose: "so we can greet you on your day." Never required, never gates anything.
- **Default greeting channel = email** (new 0028 template `birthday_greeting`). A public Facebook greeting reveals someone is a customer — so **public greetings require a separate explicit opt-in toggle** next to the DOB field.
- **Wedding anniversary is already known** (event date) — the stronger public-post asset: "Happy 1st anniversary, Ana & Miguel! 🥂" recurs annually, lands while their friends (the next customers) are watching. Same opt-in toggle governs it; couples with `first_names` share-consent history are the natural candidates.

## 5. Mechanism (V1) — HQ Social Queue, manual post

New small surface in **Setnayan HQ** (0023 family): **Social Queue**.

- **Event-driven enqueue, no crons** (cron-free lock): consent grant → queue row (held until publish gate passes, checked lazily at queue-view time); vendor verification → queue row immediately.
- **Greetings panel computed on page load** ("This week: 3 birthdays, 1 anniversary") — lazy view-time query, no scheduler. Email greetings can use Resend `scheduled_at` when built.
- Each queue row renders a **ready-to-post card**: the asset (image/video thumb) + a drafted caption honoring credit_mode. Team copies, posts manually on Facebook, clicks **Mark posted** (stores `post_url`).
- **Meta Graph API auto-posting is V1.5** — `pages_manage_posts` needs Meta app review; manual posting from a prepared card costs the team seconds and keeps a human eye on everything that goes public, matching the manual-reconciliation ops culture.

## 6. Compliance notes (RA 10173)

- Marketing consent is collected separately from service consent, purpose-stated at collection, revocable at any time — § 2.1/2.4 and § 4 implement this directly.
- DOB is personal information: optional, purpose-bound, deletable with the account (rides the existing 0025 deletion flows).
- Guest data never crosses into marketing (tier C rule) until FaceBlock-mediated and separately consented.

## 7. Build shape (queued, not scheduled)

1. `marketing_share_consents` migration + RLS (schema first, per standing rule)
2. Post-render/accept consent card on the 2–3 highest-volume artifact flows (monogram, save-the-date, website)
3. 0025 Privacy & Data revoke block + optional DOB fields + public-greeting toggle
4. Vendor verification enqueue + opt-out checkbox
5. HQ Social Queue surface (cards + captions + mark-posted + greetings panel)

Small program — roughly a 1–2 CC-day build across 2–3 PRs. No pricing involved anywhere (sharing is free; featuring is not a SKU).

---

## 8. Auto-publish pipeline — Facebook + Instagram + TikTok (owner-directed 2026-06-13)

> **Owner directive 2026-06-13:** "our app and website needs to sync on our facebook page, instagram page, and tiktok page. and auto post what can be posted to them … everything is automatic but still substantial." This SUPERSEDES § 5's "Meta Graph API auto-post = V1.5" deferral — auto-posting is pulled forward. The manual Social Queue (§ 5, shipped PR #1304) becomes the pipeline's mission control, not the workflow.

### 8.1 Principle — compose once, fan out per platform

One pipeline, three adapters. Every postable moment becomes a single `social_posts` record carrying per-platform captions + per-platform assets; platform adapters publish it wherever it qualifies. "Automatic but substantial" is achieved by three mechanisms:

1. **Default-publish with a pull window** (inverts the manual queue): couple-creation posts auto-publish after a **48-hour hold** visible in the Social Queue — the team acts only to PULL or edit, never to approve. Vendor features, greetings, editorial announcements auto-publish at the next flush with no hold (template-driven, low risk).
2. **Cadence governor** — per-platform daily caps (FB ≤3 · IG ≤2 · TikTok ≤1), ≥3-h spacing, PH prime windows (11:00–13:00 · 18:00–21:00); the scheduler assigns the next free slot rather than firehosing. Backlog beyond caps rolls into **monthly recap compilations** (e.g. 9 monograms → one carousel) — substantial, never spam.
3. **Rendered assets, not screenshots** — IG requires media and TikTok requires video anyway, so every post gets a branded render via the existing Remotion/FFmpeg + R2 pipeline: 1080×1080 card (FB/IG feed) + 1080×1920 clip (Reels/TikTok). Monograms use the shipped motion library for animated 9:16 clips; save-the-dates are already video; vendor features render a card template (logo for Pro+, category illustration for Free).

### 8.2 Content → platform matrix

| Source (trigger) | FB | IG | TikTok | Hold |
|---|---|---|---|---|
| Couple creation (consent + `event_date+7d` gate) | ✅ | ✅ (rendered card/Reel) | ✅ if video exists | 48 h pull window |
| Vendor verified (hybrid by tier, § 3) | ✅ | ✅ (rendered card) | — | none |
| Anniversary / birthday (opt-in, § 4) | ✅ | story-style card (V2) | — | none |
| Editorial article published (0038) | ✅ link post | — | — | none |
| Showcase / milestone (0046, "100th verified vendor") | ✅ | ✅ | ✅ if compiled video | 48 h |

### 8.3 Architecture (cron-free)

- **`social_posts` table** — source_type + source ref, per-platform caption variants (JSONB), R2 asset keys, `publish_after` (gate), `hold_until`, per-platform status map `{facebook:{status,external_id,posted_at,error}, instagram:{…}, tiktok:{…}}`, status ∈ draft/scheduled/published/pulled/failed. RLS admin-only.
- **Compose stage** — event-driven via Next 15 `after()` on the existing triggers: consent grant (computes `publish_after = event_date+7d` at composition), vendor verification, article publish. No new polling anywhere.
- **Dispatch stage = lazy flush** — a flush routine piggybacks on organic traffic (`after()` on admin layout + Social Queue view + 1–2 high-traffic routes): picks due posts (gate passed · hold passed · cadence slot free), calls adapters, stamps results, exponential-backoff retries; hard failures surface in the queue + email alert. Honors the cron-free lock — worst case an overnight-due post publishes on the first morning request.
- **Adapters** — `lib/social/` one module per platform:
  - **Facebook**: Graph API page feed/photos/videos with a Business **system-user page token** (posting to Setnayan's OWN page — no public App Review needed; dev-mode app + admin-granted token suffices).
  - **Instagram**: Content Publishing API — IG **Professional account linked to the FB Page**, same Meta app/token (`instagram_content_publish`); images + Reels; API's 25-post/day ceiling is far above our caps.
  - **TikTok**: Content Posting API "Direct Post" — requires a TikTok developer app **audit** (days–weeks, calendar-bound). Until approved: **assisted-manual mode** — the pipeline still renders the 9:16 video + caption; the queue card offers download + copy-caption for a 30-second manual post from the TikTok app.
- **Connections strip** in the Social Queue: per-platform token status/expiry + re-auth, plus a per-platform kill switch.
- **Consent scope (RA 10173)**: the § 2 consent copy must name all channels — "feature this on our social pages (Facebook, Instagram & TikTok)" — and the vendor opt-out copy likewise. **Must ship before the first consents accumulate** (zero rows in prod as of 2026-06-13 — free to fix now; no re-consent migration needed).

### 8.3b Brand-voice lanes — milestones, updates, evergreen (owner-directed 2026-06-13)

> Owner: "we also want to post milestones, updates, and other information about our app." Three additional `social_posts` source types, each at a different automation level:

| Lane | source_type | How it's composed | Automation |
|---|---|---|---|
| **Milestones** | `milestone` | **Fully automatic** from true DB counters crossing a threshold ladder (10 · 25 · 50 · 100 · 250 · 500 · 1,000 · …): events created, vendors verified, weddings hosted, guests RSVP'd, photos delivered. Checked lazily at flush time (no cron) against a `social_milestones` watermark table so each threshold fires exactly once. Rendered as a branded stat card ("500 weddings planned on Setnayan 🎉"). | Auto-compose + auto-publish (48-h pull window) |
| **Updates / announcements** | `announcement` | **Composed once in HQ, automated everywhere after.** A composer in the Social Queue: title + body + optional media; the pipeline drafts per-platform captions, renders the branded card, schedules into cadence slots, fans out to FB/IG (+TikTok when video). Feature launches are deliberate brand moments — a human writes the one sentence; the machine does the other 95%. The composer surfaces **auto-drafted suggestions** from recent repo CHANGELOG headlines so writing one is a 30-second pick-and-edit, not a blank page. | Manual compose → auto everything downstream |
| **Evergreen / tips** | `evergreen` | A reusable library authored in HQ (planning tips, how-tos, seasonal "ber-months booking" pieces, feature spotlights). The cadence governor uses it as **filler to hold a content floor** — if a page would otherwise go ≥3 days silent, the scheduler pulls the least-recently-used evergreen item. Pages never look dead in slow weeks; recurrence is tracked so nothing repeats within 60 days. | Auto-scheduled from the pool |

Privacy guardrails: milestone posts are **aggregate numbers only** — never names, never per-couple data (consistent with the behavioral-data min-N lock). Counters must be real DB counts; no invented numbers, ever.

### 8.4 Owner prerequisites (calendar-bound — start now)

1. **Meta Business Portfolio + developer app** (same app serves FB + IG): link the Setnayan Facebook Page, create a system user, grant `pages_manage_posts` + `instagram_content_publish`, generate the long-lived page token → paste as Vercel env (`META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN`, `IG_USER_ID`). ~Same day, free.
2. **Instagram → Professional account**, connected to the FB Page in Meta Business settings. Minutes.
3. **TikTok for Developers** app + Content Posting API Direct-Post audit application. Days–weeks on TikTok's clock — the long pole; assisted-manual covers the gap.

### 8.5 Build phases (CC-time)

- **Phase A — ✅ BUILT 2026-06-13 (PR [#1311](https://github.com/iscasasola/setnayan-platform/pull/1311), stacked on #1304)**: `social_posts`/`social_milestones`/`social_evergreen_items`/`social_publish_settings` schema (migration `20261204000000`, APPLIED to prod; consent migration renumbered to `20261203000000` after a parallel-session prefix collision) · sweep-compose + cadence governor + lazy `after()` flush (admin layout · social-queue · public /vendors) · FB Graph adapter · queue → mission control (Autopilot strip + kill switches · Pull/Post-now · Retry · announce composer with CHANGELOG suggestions · evergreen library, § 8.3b lanes included) · consent-copy channel fix. **Ships with the master switch OFF — goes live the moment the owner pastes the Meta env vars (#21a) and flips the Autopilot switch.**
- **Phase B — ✅ BUILT 2026-06-13 (PR [#1322](https://github.com/iscasasola/setnayan-platform/pull/1322))**: branded 1:1 card renderer (satori + sharp, on-the-fly `/api/social/card/[postId]`, 5 layouts, custom-monogram composite) · IG feed adapter + multi-platform dispatch · FB auto-upgraded to photo posts. **9:16 clips/Reels deferred to a later phase** (needs the Remotion/FFmpeg video pipeline). Needs `IG_USER_ID` env in addition to the Meta page token.
- **Phase C — ✅ BUILT 2026-06-13 (PR [#1328](https://github.com/iscasasola/setnayan-platform/pull/1328))**: 9:16 story card format · TikTok adapter via Content Posting API **Photo Mode** (posts the 9:16 card, no video infra) behind `isTikTokConfigured()` + audit · **assisted-manual fallback** (9:16 preview + caption + download) is the working default until the owner clears the audit + OAuth. Needs `TIKTOK_ACCESS_TOKEN` + a verified PULL_FROM_URL domain (#21c).
- **Phase D — NOT BUILT (owner infra decision)**: real MP4 / Reels / TikTok-video (1080×1920 motion clips using the couple's monogram-motion + owned-music). Requires a video render pipeline (Remotion on a render service, FFmpeg on Cloudflare Workers, or a third-party like Shotstack/Creatomate) — a genuine infra fork to weigh against the OSS-self-host preference + marginal-cost-R2-only lock. Static cards (Phases B/C) cover FB feed + IG feed + TikTok photo today; video is the richer follow-up.
