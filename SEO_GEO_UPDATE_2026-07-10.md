# Setnayan — SEO + GEO Update (2026-07-10)

> **What this is:** a deep-dive of what the live website offers right now, an audit of the shipped SEO/GEO stack against `17_SEO_and_AI_Discoverability_Playbook.md`, and a prioritized update plan. Source-of-truth order per `CLAUDE.md`: live site → shipped `apps/web` @ `origin/main` → prod DB → ground-truth doc → specs.
>
> **Headline:** the foundation is genuinely strong and well-maintained. This is an *update* (close drift + fill gaps + one growth bet), not a rebuild. The single highest-value item is **fixing the AI-facing `llms.txt`, which currently feeds answer engines two dead routes, one wrong marketplace mapping, and ≥2 stale prices.**

---

## ✅ SHIPPED 2026-07-10 (P0 + P1 + a feature-activation directive)

After the audit below, two PRs went out (auto-merging) plus a live prod change:

- **[PR #2977](https://github.com/iscasasola/setnayan-platform/pull/2977) — feature activation + `llms.txt` freshness.** Owner directive "all our features should now be active": migration `20270710619774` (applied live) flips `is_active=true` for the 3 built-but-hidden current features — **3D Plan ₱2,499 · Stories ₱2,000 · Thank You Video ₱2,499** — while the ~16 retired/superseded SKUs stay off. The stale `BUILD_STATUS` map (dated 2026-05-28) was refreshed → Live for Live Studio Desktop/Mobile, Patiktok, Editorial PRO, Live Background, the 3 activated, and STD Cinematic Openings; **Camera Bridge + Live Wall held "In build"** (fulfillment infra genuinely not built). `llms.txt`: Live Studio → per-day device tiers, dead `/venues`+`/venue` removed, `/explore` browse mapping fixed, missing landing pages added.
- **[PR #2978](https://github.com/iscasasola/setnayan-platform/pull/2978) — technical SEO.** GSC+Bing verification meta (env-driven), canonical/sitemap fallback host aligned to `www.setnayan.com`, orphaned `/explore/compare`+`/open-shop` sitemap'd, `/tl/how-it-works` OpenGraph added.

**Price reconciliation result (live prod DB read directly):** the migration-record price alarms in §3 below were mostly **false** — live prod confirms `llms.txt` was already correct on Setnayan AI (₱499 first → ₱799 renew, both rows active), Pakanta ₱2,499, Animated Monogram ₱1,999, Camera Bridge ₱1,299, Kwento ₱299. The **only** genuine price drift was **Live Studio** (now per-day device tiers), fixed in PR #2977.

**Owner actions still open:** ① paste GSC + Bing verification tokens into Vercel env; ② create FB/LinkedIn pages → fill the empty `Organization.sameAs`; ③ confirm 3D Plan / Stories / Thank You Video fulfillment is delivery-ready now that they're sellable; ④ greenlight the P2 programmatic `/explore/[category]/[city]` growth pages.

### Update — later that day (2026-07-10)

Worked through the audit with the owner. Additional changes: **Facebook `sameAs`** wired ([PR #2982](https://github.com/iscasasola/setnayan-platform/pull/2982), merged — no LinkedIn); **Camera Bridge repriced ₱1,299 → ₱499** ([PR #2986](https://github.com/iscasasola/setnayan-platform/pull/2986), migration `20270711042075` applied live — aligns the owner-locked 2026-07-08 figure the estimator already used). **Stories + Thank You Video confirmed KEEP-PAID** (₱2,000 / ₱2,499) — no revert.

**Verification status:** Google is **already DNS-verified** as a Domain property (GSC shows 92 indexed / 434 not-indexed — the not-indexed bucket is mostly expected noindex/redirect/404/robots + the 78 future-dated Journal posts). So the Google meta-tag env var is optional; **Bing** recommended via GSC-import (no code). The verification env vars the PR added stay available but aren't required.

**P2 — DEFERRED (owner).** Density check on live prod found only **6 verified vendors** (Manila 3 · Cebu 2 · 1 no-city) and **zero** city×category combos with ≥2 vendors. Generating ~120 `/explore/[category]/[city]` pages now would create thin doorway pages — the exact "Crawled – currently not indexed" failure mode — so it would hurt, not help. **Re-trigger:** build when ≥3 verified vendors exist per city×category (post-launch). Pre-launch, the growth levers are recruiting verified vendors + the existing Journal (already ranking).

> The §3 table below is preserved as the *pre-reconciliation* audit snapshot — read the result above for what was actually true/changed.

---

## 1. What the website offers now (deep dive)

Setnayan's public, indexable surface as shipped:

### Brand / marketing core
`/` (home) · `/about` · `/our-story` · `/why-setnayan` (comparison/GEO page) · `/how-it-works` · `/features` · `/pricing` (live DB-driven catalog).

### Per-service SEO landing pages (force-static, SoftwareApplication + FAQPage JSON-LD)
`/setnayan-ai` · `/papic` · `/panood` · `/pa3d` · `/palogo` · `/pawebsite` · `/patiktok` · `/alaala` (remembrance) · `/monogram` (free no-signup lead-gen tool).

### Marketplace / vendor
- **`/explore`** — the *actual* vendor marketplace browse (+ `/explore/compare`, `/explore/categories`→redirect).
- **`/vendors`** — the vendor-*acquisition* ("list your business") page. **These two are different surfaces** — this distinction is fumbled in `llms.txt` (see §3).
- `/open-shop` — vendor onboarding · `/v/[slug]` — indexable vendor profile · `/u/[userSlug]` — user profile (`noindex`).

### Content / editorial
`/blog` + `/blog/[slug]` (Setnayan Journal — 78 future-dated articles drip to Dec 18) · `/realstories` + `/realstories/[slug]` (real-weddings showcase — this is the "`/weddings`" surface `llms.txt` names) · `/help` + `/help/[slug]`.

### Utility / legal / localized
`/waitlist` · `/download` · auth surfaces · `/privacy` `/terms` `/refunds` `/cookies` `/acceptable-use` · **`/tl/about` `/tl/features` `/tl/how-it-works`** (only 3 pages localized; CEB is roadmap).

### The commercial offer (what these pages sell)
- **Couples:** Free — Explore (₱0) → **Setnayan AI subscription** → à-la-carte software services. No bundles. 0% commission on vendor bookings.
- **Vendors:** Verified free during launch → Solo ₱9,999/yr (or ₱999/28d) → Pro ₱24,999/yr (or ₱2,499/28d) → Enterprise ₱79,999/yr (or ₱7,999/28d · repriced 2026-07-10, was ₱7,499) → Custom from ₱8,999/28d. Flat ₱100/token unlock model. 0% commission every tier.
- **Signature differentiator (lead with this everywhere):** the day-of **media layer** — Papic guest-crew capture, Live Studio livestream on the event page, per-guest highlight reels, Pakanta custom song, 3D reception walk. This is what makes Setnayan "three apps' worth of wedding in one" and it's the hook AI answer engines should attribute to us.

---

## 2. SEO/GEO foundation already shipped (the strong base)

Do **not** re-do these — they're solid:

| Layer | State |
|---|---|
| **AI-aware robots** (`app/robots.ts`) | Allows answer engines (ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot); blocks training-only bots (GPTBot, Google-Extended, Applebot-Extended, Amazonbot, cohere-ai, Bytespider, Diffbot). "Recommend us, don't train on us." |
| **`llms.txt`** | Rich, curated, price-drift-guarded (`lib/llms-price-fixture.ts` + test). *Content is now stale — §3.* |
| **Sitemaps** | Index → `static / help / blog / vendors / weddings`; DB-driven children with honest per-row `lastmod`. |
| **Structured data** | Sitewide `Organization`; `WebSite`+`SearchAction` (home); `FAQPage` on 13 pages; `Product`/`Offer`/`UnitPriceSpecification` (pricing); `Service`/`OfferCatalog`/conditional `AggregateRating`/`priceRange` (vendor profiles); `Article`/`BlogPosting`; `ItemList` (explore); `BreadcrumbList` broadly. |
| **Per-route metadata** | title / description / canonical / OpenGraph on essentially every marketing route; Twitter cards; hreflang on the 3 `/tl` pairs; dynamic OG images for `/realstories/[slug]` + `/our-story`. |
| **Content** | 78-article Journal, 9 service landing pages, `/why-setnayan` comparison page. |

This already implements ~80% of the playbook's Week-1 + Month-1 checklist. Google's own 2026 guidance is that most GEO ≈ good SEO + clean structured data + freshness — which we have. The gaps below are the delta.

---

## 3. 🔴 P0 — Fix what's actively misleading crawlers & AI (`llms.txt` + freshness)

`llms.txt` is the file AI answer engines read to decide what to say about us. It was last synced **2026-07-05**; the product moved after that. Every wrong line here becomes a wrong AI answer.

**Dead links being fed to AI (remove now):**
- `llms.txt` lists **`/venues`** and **`/venue/[slug]`** as "Currently shipped." **Both routes were deleted** ("remove all the fake venues", 2026-06-16). We are handing crawlers and AI two 404s. → Remove both bullets + the venues paragraph.

**Wrong marketplace mapping (fix now):**
- `llms.txt` tells AI the vendor browse directory is **`/vendors`**. The real browse is **`/explore`**; `/vendors` is the *acquisition* page. So "where do I browse Filipino wedding vendors on Setnayan?" gets the wrong URL. → Point browse at `/explore`; re-label `/vendors` as list-your-business.

**Missing indexable pages (add to `llms.txt` shipped-surfaces list):**
`/explore`, `/setnayan-ai`, `/why-setnayan`, `/our-story`, `/papic`, `/panood`, `/pa3d`, `/palogo`, `/pawebsite`, `/patiktok`, `/monogram`, `/alaala`, plus a line naming the `/tl` localized set. These are live, JSON-LD-rich, in the sitemap — but invisible to the AI index.

**✅ RESOLVED 2026-07-11 — the 2026-07-10 pricing finalization settled every row below.** Canonical = live prod DB: Setnayan AI **₱499 one-time per event** (NOT the ₱499→₱799 subscription — the ₱799 renewal row is deactivated), Pakanta ₱2,499, Animated Monogram **₱999**, Thank You Video ₱2,499, Camera Bridge ₱500, Kwento ₱299, Papic capture caps **Ltd ₱9,000 / Unli ₱15,000** (PR #3112). `llms.txt` synced to these (PR #3121). The audit table below is retained as the original 2026-07-10 open-questions snapshot.

**🟡 Price drift — original 2026-07-10 snapshot (now RESOLVED above; kept for lineage):**

| SKU | `llms.txt` says | Shipped/committed evidence | Action |
|---|---|---|---|
| **Live Studio** | multicam **₱3,499 one-time**, single-cam free | Repackaged to device tiers **Desktop ₱2,499/day + Mobile ₱1,299/day**, owner-locked **2026-07-08** (migration `20270526326110`, + memory `live_studio_packaging`). ₱3,499 no longer exists. | **Confirmed stale — I'll correct** unless you say otherwise. |
| **Setnayan AI** | **₱799/28d (₱499 first cycle)** | Live active row `SETNAYAN_AI` = **₱499/28d flat**; the ₱799 step-up (`SETNAYAN_AI_RENEW`) is seeded `is_active=FALSE`, flag defaults OFF. So ₱799 **is not live yet**. | **Confirm:** is the ₱799 step-up going live imminently (keep as-is) or should `llms.txt` say ₱499/28d flat today? |
| **Pakanta** | ₱2,499 | migration seed ₱3,499 (never repriced; owner flagged "live vs DB disagree") | Confirm live price. |
| **Animated Monogram** | ₱1,999 | migration seed ₱2,499 (flagged) | Confirm live price. |
| **Thank You Video** | ₱2,499 | last committed ₱3,499 | Confirm live price. |
| **Camera Bridge** | ₱1,299/day flat | shipped: Papic bridge ₱100/seat·day + Panood bridge ₱200/cam·day; no ₱1,299 bridge SKU | Confirm the real public figure. |
| **Kwento** | ₱299 | a `papic-kwento-paywall` change repriced to ₱500 | Confirm live price. |

> These are flagged because prices are locked SKUs — per `CLAUDE.md` I surface rather than silently change. The safest structural fix is also to **extend the drift guard to diff `llms.txt` against the live DB catalog**, not just against itself (today `lib/llms-price-fixture.ts` only self-checks) — that's what let this drift accumulate.

---

## 4. 🟠 P1 — Technical SEO gaps (safe, mechanical, high-leverage)

1. **No search-engine verification tokens.** Root `baseMetadata` has no `verification: { google, other: { 'msvalidate.01' } }`. Blocks meta-tag ownership of Google Search Console + Bing Webmaster. → add fields (owner supplies the tokens).
2. **Base-URL fallback host mismatch.** If `NEXT_PUBLIC_APP_URL` is unset, **pages** fall back to `https://www.setnayan.com` but **sitemaps + robots** fall back to `https://setnayan-platform-web.vercel.app` → canonical/sitemap host split. → align all fallbacks to `www.setnayan.com` (defensive; verify the env var is set in prod regardless).
3. **Orphaned pages.** `/alaala` and `/open-shop` are indexable but in **no sitemap**. → add to `sitemap-static.xml` (+ `/explore/compare`).
4. **`/tl/how-it-works` missing `openGraph`** (the only marketing route without it). → add.
5. **`vercel.app` literals in public copy** — `/api/v1` docs + `/dashboard/(account)/api-keys` show `setnayan-platform-web.vercel.app` URLs to users. → swap to canonical domain.
6. **Promote `WebSite`+`SearchAction` JSON-LD** from home-only into the root layout (brand sitelinks-searchbox eligibility). Minor.
7. **Consistency:** adopt the existing `localeAlternates()` helper on `/about` + `/how-it-works` (+ `/tl` twins) instead of hand-rolled hreflang maps. `sitemap-vendors` header comment is stale (says `/v/{slug}`, emits bare-root — code is correct, comment isn't).

---

## 5. 🟢 P2 — GEO + content growth (the real ranking upside)

The playbook's biggest unrealized bet: **indexable surface area**. We have ~30 static marketing URLs + a DB-driven vendor/blog/wedding long tail; competitors (Bride Worthy 2,107 listings, Bridestory thousands) win on programmatic depth.

1. **Programmatic location × category pages** — the playbook's `~120 city×category` surface (12 PH cities × ~10 categories). Cleanest path today: **filtered `/explore` landing routes** (e.g. `/explore/[category]/[city]`) with `ItemList` + `FAQPage` + `BreadcrumbList` and a 150–300-word localized intro each. This is the single largest organic-traffic lever and directly feeds AI "best wedding [category] in [city]" answers. *Scope/effort item — worth its own plan.*
2. **GEO-extractable formatting** (2026 best practice): comparison tables + "key answer first" blocks + dated factual claims. `/why-setnayan` and the FAQ pages already do this; extend the pattern to service pages and any new city pages. Add a **visible "Updated YYYY-MM-DD" + author byline** to Journal + landing pages (entity/freshness signal AI weighs).
3. **`Organization.sameAs` is empty** — create the FB Page + LinkedIn, then populate `sameAs[]`. Cheapest entity-grounding win; unblocks knowledge-graph association. (Owner action.)
4. **Off-page** (owner actions, from playbook §6): Google Business Profile (primary category Wedding Service), Bing Places, 6+ PH wedding directories, "Verified on Setnayan" dofollow badge program. SEO has a multi-month lag — starting these now pays out at the Dec launch.
5. **CEB localization** — playbook calls it a competitive moat; V1.1 roadmap. Defer but keep the `/tl` path-prefix pattern ready to clone to `/ceb`.
6. **Wikipedia/Wikidata** — gated on 3–5 PH press citations; not yet. Track.

---

## 6. Suggested sequencing

- **This week (P0):** confirm the 6 flagged prices → rewrite `llms.txt` (dead routes, `/explore` mapping, missing pages, prices) → add the live-DB drift guard. *One PR + owner price confirmations.*
- **This week (P1):** verification tokens + fallback alignment + sitemap orphans + `/tl` OG + vercel.app copy swap. *One mechanical PR.*
- **Pre-launch (P2):** stand up programmatic `/explore/[category]/[city]` pages (own plan) · create FB/LinkedIn → `sameAs` · GBP + directory listings · visible updated-dates.

---

## 7. Owner decisions needed

1. **Confirm the 6 live prices** in §3 (Setnayan AI ₱799-vs-₱499, Pakanta, Animated Monogram, Thank You Video, Camera Bridge, Kwento) — or tell me "trust live DB" and I'll read prod and reconcile.
2. **Go-ahead to ship P0 + P1** as two PRs now (P1 needs the GSC/Bing verification token strings from you).
3. **Greenlight a separate plan** for the P2 programmatic city×category pages (the growth bet).

---

## 8. 🤖 Auto-update: the SEO/GEO admin surface + daily cron (owner Q 2026-07-10)

> **✅ BUILT 2026-07-10 (monitoring core).** The `/admin/seo` surface + the two nightly crons shipped on branch `feat/seo-geo-auto-update` (`setnayan-platform`): migration `20270710700100_seo_geo_monitoring.sql` (3 admin-only tables), `lib/seo/health-checks.ts` (pure, 7 unit tests), `/api/cron/seo-health` (02:00 PHT) + `/api/cron/seo-gsc` (06:00 PHT, no-ops until GSC creds land), `/admin/seo` page (App Performance group). **Deliberately NOT built:** the full DB-generated `llms.txt` route — it's dense curated brand prose, so a daily machine rewrite would risk unattended edits to locked brand/price strings; instead the nightly audit makes drift *visible* (figure-set diff of the served llms.txt vs the live catalog). **Follow-up (owner-gated):** GSC pull is dormant until creds are pasted; the weekly AI meta drafter into `seo_suggestions` needs owner sign-off + a flag. See the `changelog.d/seo-geo-auto-update.md` fragment.


> **Owner question:** *"Can we have an admin page where we auto-update our SEO and GEO? Can this be done every day, or what do you suggest?"*
>
> **Short answer:** Yes — but "auto-update daily" splits into three jobs with three different rules. Regenerate deterministic files daily (safe, auto-publish). Monitor daily (data only). **Never** auto-publish AI-rewritten meta/content daily — that thrashes rankings and would let a model silently rewrite locked brand strings / SKU prices. The single highest-value piece is **making `llms.txt` DB-generated instead of hand-maintained** — that kills the entire drift class this doc spent effort fixing today.

### 8.1 What to automate, and at what cadence

| Job | What it does | Cadence | Auto-publish? |
|---|---|---|---|
| **`llms.txt` regen-from-DB** | Rebuild the AI-facing file from the live `service_catalog` (prices, `is_active` SKUs) + a canonical route registry (kills dead-route + stale-price drift at the source) | On every deploy **+** daily 02:00 PHT safety net | ✅ Yes — deterministic, no model in the loop |
| **SEO/GEO health checks** | Assert: no dead route in `llms.txt`/sitemap · `llms.txt` prices == DB · every indexable route in a sitemap · every marketing route has canonical + OG + JSON-LD · verification tokens present · `Organization.sameAs` non-empty | Daily 02:00 PHT → write `seo_health_snapshots` row; alert on a **new** failure | ✅ Data only |
| **Search Console + Bing pull** | Impressions / clicks / avg position / top queries → `seo_metrics` for the dashboard trend | Daily 06:00 PHT (GSC data lags ~2 days anyway) | ✅ Data only |
| **AI-citation spot check** | Query Perplexity/ChatGPT for "best wedding [category] in [city]" etc.; log whether Setnayan is cited | **Weekly** (LLM cost; slow-moving signal) | ✅ Data only |
| **AI-drafted meta/FAQ** | Claude drafts titles/descriptions/FAQ schema for pages missing or stale ones | **Weekly** → **review queue** | ❌ **Human-gated approve/reject** |

**Why not everything daily:** search engines reward *stable* titles/meta — rewriting them every 24h signals churn and can suppress rankings. GSC data has a multi-day lag, so a daily meta rewrite chases noise. And per `CLAUDE.md`, prices/SKU names/`SETNAYAN` spelling are locked — a model must never publish over them unattended. So: **deterministic regeneration + monitoring = daily & automatic; AI generation = weekly & human-approved.**

### 8.2 The admin page (new surface in 0023 admin console)

A **"SEO & GEO"** surface (fits the console's existing two-admin-gate + review-queue patterns):

1. **Health scorecard** — green/red per check from `seo_health_snapshots`, with the failing routes listed inline.
2. **`llms.txt` panel** — live DB-generated preview, diff vs the published file, "regenerate & publish now" button (in addition to the cron). This is the drift guard the audit §3 asked for, made visible.
3. **Route coverage matrix** — sitemap / canonical / OG / JSON-LD present-or-missing per marketing route.
4. **GSC + Bing trend** — impressions, clicks, avg position, top queries over time.
5. **AI-citation log** — weekly spot-check results (are we cited for the money queries?).
6. **Suggestion review queue** — AI-drafted meta/FAQ; approve → commits; reject → discards. **Brand/price guard: any suggestion touching a locked string or a catalog price is blocked before it's even shown.**
7. **Owner-action nags** — verification tokens missing, `sameAs` empty, GBP not claimed (the recurring items from §5/§7).

### 8.3 Build shape (in the `setnayan-platform` repo — worktree + PR, not corpus)

- **Migration first:** `seo_health_snapshots`, `seo_metrics`, `seo_suggestions` (RLS admin-only at `CREATE TABLE` time, per locked patterns).
- **Cron:** Vercel Cron entries in `vercel.json` → thin `/api/cron/seo-*` routes (guard with `CRON_SECRET`). Keeps compute off the request path.
- **`llms.txt`:** move generation into a `lib/seo/llms-generate.ts` that reads the DB + a single route registry; the existing `lib/llms-price-fixture.ts` self-check is **replaced** by a live-DB diff assertion.
- **Admin route:** `/admin/seo` behind the existing admin RLS/role guard.
- **Effort:** ~2–3 days. The DB-driven `llms.txt` + health-check cron alone (≈1 day) is the high-value core and is safe to auto-publish; the GSC pull and AI review-queue are additive.

### 8.4 Recommended sequencing

1. **First (≈1 day, pure upside):** DB-generated `llms.txt` + daily health-check cron + the health scorecard tab. Ends the drift problem permanently, no AI, no publish risk.
2. **Next:** GSC/Bing pull + trend panel (needs the verification tokens from §7).
3. **Then:** the weekly AI meta/FAQ review queue + AI-citation spot check.

> **One decision for the owner:** build this now in `setnayan-platform` (worktree + PR), or keep it as this plan and schedule after the P0/P1 audit PRs land? This section is the spec either way.

---

*Audit basis: `apps/web` @ current `origin/main`, `public/llms.txt` (synced 2026-07-05), `app/robots.ts`, all five `sitemap-*` routes, per-route metadata + JSON-LD survey, and `17_SEO_and_AI_Discoverability_Playbook.md`. Grounded against 2026 GEO guidance (Search Engine Land; Google's "5 GEO myths" note that llms.txt/chunking aren't required for Googlebot but remain used by Perplexity/other engines).*
