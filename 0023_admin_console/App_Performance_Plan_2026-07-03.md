# App Performance — Build Plan (2026-07-03)

> **Status:** design LOCKED (owner-approved direction) · prototype DONE · **repo build PENDING**
> **Placement:** **1 of the 6 top-level menus of the admin dashboard** (owner, 2026-07-03).
> **Prototypes:** [`App_Performance_Cockpit_2026-07-02.html`](App_Performance_Cockpit_2026-07-02.html) (canonical — one-page cockpit) · [`App_Performance_Prototype_2026-07-02.html`](App_Performance_Prototype_2026-07-02.html) (v1, observability-only study).
> **Decision-log rows:** 2026-07-03 (cockpit design) · 2026-07-03 (this plan + 6-menu promotion).

---

## 1 · What it is

The operator's single daily screen — one page that answers three questions in order:
**What do I need to do? → Is it growing? → Is it working?**

One page, four zones, top to bottom:

| Zone | Question | Content |
|---|---|---|
| Context strip | where do we stand | 7 stat tiles: **Users · Vendors · Services · Total Events · Total Editorials · Uptime% · Error rate** (owner-corrected: Users, NOT Couples) |
| **1 · Action Center** | what to do next | Operator to-dos, sorted act → watch → ok |
| **2 · Expenses & Receipts** | money out | Every digital peso out + the receipt to prove it (feeds 0026 BIR) |
| **3 · Growth** | is it growing | Owner-curated growth graphs + statistical growth comparison |
| **4 · Stability** | is it working | Technical health |

Curation rule (owner): **only graphs that matter to growth and stability.** Cumulative entity totals are tiles, not charts. Infra/cost detail lives as Action Center cards, not charts.

## 2 · Admin IA placement (owner lock 2026-07-03)

App Performance is **one of the 6 admin dashboard menus**. ⚠ **Open sign-off:** which slot — current admin mobile spine is Home · Work · Directory · Money · Insights · More. Does App Performance **replace Insights** (absorbing Growth; Funnels/Intelligence links move inside it) or reshuffle another slot? Recommendation: replace **Insights** — App Performance is a superset of Insights' daily-pulse purpose, and Growth folds into it (§ 5, PR 1). Must land in the nav-registry SSOT (`/admin/menus`) + lint, per the nav-registry program.

## 3 · Zone specs (verified against origin/main schema)

### Zone 1 — Action Center ("what to do next")
Cards = trigger → what to do → link. Two kinds: **auto** (readable from DB/API) and **manual-tracked** (owner logs top-ups; page counts down).

| Category | Cards | Mode |
|---|---|---|
| AI credits | Suno credits · Claude API headroom · OpenAI/DALL·E balance · Recraft credits | manual (Suno) / auto where API exists |
| Plans & limits | R2 storage % · Resend quota · Supabase tier · Vercel build minutes · Sentry/PostHog quota | auto |
| Secrets & keys | R2 token rotation · expiring API keys · service-role rotation | manual calendar + known expiries |
| Vendor tokens | mint/adjust token bands & packs | manual admin action |
| Domains & certs | setnayan.ph / .com renewals · SSL/DKIM · app-signing certs | manual calendar |
| Operational backlog | payments awaiting reconciliation (`orders`) · verification queue · open disputes · open `user_reports` · editorial review · pax changes | **auto — real tables today** |

### Zone 2 — Expenses & Receipts (ALL Needs-wiring — no table exists)
Categories: **Infra · AI credits · Domains & fees · Tools · Permits & docs** (IPOPHL trademark, Mayor's permit, barangay clearance, DTI, BIR documentary stamps, notarization — January permit cluster pre-flagged in Upcoming charges).

Cards: E1 monthly stacked spend + total + ghost line · E2 spend-by-service ranked bars · E3 receipt-coverage % + "N missing before BIR quarter close" · E4 ledger table (date/vendor/category/amount/receipt-chip/source) with **receipts@setnayan.com forward + upload** affordance · E5 upcoming charges (30-day total + renewal clusters).

Wiring: new **`platform_expenses`** table (internal, admin-only RLS) + receipt object on R2; optional email-forward inbox later. Receipts = expense substantiation for **iteration 0026 (BIR)**.

### Zone 3 — Growth
| Graph | Source (origin/main) | Tag |
|---|---|---|
| New users / vendors / services / events per period (4-up small multiples) | `users` · `vendor_profiles` · `vendor_services` · `events` on `created_at` | Live |
| New events by type (stacked) | `events.event_type` (12-value enum; label from taxonomy DB, NOT the hardcoded 5-value map) | Partial (wedding-dominated) |
| Completed services | `event_vendors.completion_status IN ('confirmed','auto_confirmed')` | Live |
| Sales split 3 ways + total | `orders` (AI = `service_key IN (SETNAYAN_AI_SUB, SETNAYAN_AI, SETNAYAN_AI_RENEW, TODAYS_FOCUS-retired)`) · `vendor_subscriptions` · `vendor_token_purchases`; exclude `comp_grant_id` from revenue | Live |
| First-pick rate | `event_vendors.selection_match_rank = 1` ÷ recommendation-flow bookings — a RATE, not a count | Partial |
| Reviews volume + avg rating | `vendor_reviews` (no status column — all rows live) | Live |
| **Normalized growth index** (headline) | all entity series + revenue rebased to 100 at period start — steepest line = fastest grower | Live |
| MoM/WoW %-change leaderboard | derived; **min-N floor** → "insufficient data" on tiny bases (28-day "month") | Partial |
| — every time-series card | vs-previous-period ghost line + ▲/▼ delta chip | pattern |

### Zone 4 — Stability
| Graph | Source | Tag |
|---|---|---|
| Health status strip | `/api/health` + `/api/health/deep` | Live (current) / history needs probe persistence |
| Error rate | Sentry (wired) | Live |
| API p95 latency | Vercel/Sentry Perf | Needs wiring |
| Lighthouse per deploy + CWV gauges (LCP/INP/CLS) | Lighthouse CI (required check) + web-vitals RUM | Partial |
| Reports trend (inverse-good) | `user_reports` by status | Live |

## 4 · Load-bearing schema facts (verified 2026-07-02, honor when building)

1. **Amounts are PESOS `NUMERIC(12,2)`, NOT centavos** on `orders` / vendor billing tables — no ÷100 anywhere.
2. **No completed-event state exists** on `events` — proxy = `event_date < CURRENT_DATE` (undercounts NULL dates; caveat in-UI). `archived` is a soft-hide flag, not completion.
3. Vendor org table is **`vendor_profiles`**; listings are **`vendor_services`** (not the SKU `service_catalog`).
4. Editorials: **`event_editorial`**, UNIQUE(event_id), headline = `status='published'`.
5. **EXTEND `/admin/growth`'s `fetchGrowthStats`** (`apps/web/lib/admin/growth-stats.ts`) — same GROWTH_BUCKETS mechanism for the new fetchers; do NOT fork a parallel stats layer. One range selector, one CSV export.
6. Honest-empty rules: min-N floor on all % chips; "wired, sparse data" labels; prefer rates over counts on tiny bases.

## 5 · Build sequence (repo — worktree + PR each)

| PR | Scope | Day-one real? |
|---|---|---|
| **PR 1** | Route + nav-registry slot (6-menu placement) + Growth & Stability zones' **Live** charts (extend `fetchGrowthStats`; sibling fetchers: monetization 3-table union · completed lifecycle · content/trust) + growth-index + leaderboard + ghost-line pattern + Sentry error rate + health strip | Yes |
| **PR 2** | Action Center — auto backlog counts from real tables; `platform_ops_notes`-style small table for manual-tracked cards (credits, renewals, rotations) | Yes (auto cards) |
| **PR 3** | Expenses & Receipts — `platform_expenses` migration (RLS admin-only, at CREATE TABLE) + R2 receipt upload + coverage stat + ledger + upcoming charges | Yes once migrated |
| Later | Probe persistence (uptime/dependency history) · p95 wiring · web-vitals RUM · receipts@ email-forward inbox · live credit-balance APIs | — |

Premium animation system ports from the prototype (scroll-into-view IntersectionObserver, once-only, transform/opacity-only, reduced-motion + no-JS safe).

## 6 · Open sign-offs

1. **Which of the 6 menu slots** does App Performance take (recommend: replaces Insights)?
2. Completed events: proxy acceptable, or add a real completion state to `events`?
3. Staff exclusion default on user counts (`is_internal`/`is_team_member`) — exclude by default?
4. Bundles (GUIDED_PACK/MEDIA_PACK): inside "all other purchases" or a 4th stream?
5. Dependency/DB-probe latency: stay Needs-wiring, or is probe history persisted anywhere (Better Stack)?
