# Vendor Pricing Build — Council Verdict (2026-07-22)

> Six-seat adversarial review of the vendor-pricing build shipped this session (base reprice + 4 add-ons + token retirement/free-answering + 3D couple discount + gap-fixes + peso removal). Seats: **Billing integrity · Security/RLS · Go-live/Ops · Spec fidelity · Privacy (RA 10173) · Data-model/Dead-code.** Read-only against `origin/main`.

## Verdict in one line
**Structurally sound** — RLS airtight, prices server-authoritative, migrations safe/reversible, **no fake doors** (both flag-dark features are genuinely complete; public copy is gated). What's missing is a cluster of **revenue leaks, a missing safety net, one un-built locked decision, two privacy gates, and token-era cleanup** — all fixable. Nothing blocks the code from running, but ~9 items should be fixed **before flipping a flag or taking real money.**

## 🔴 Fix before go-live / real money

| # | Finding | Seats | Fix / status |
|---|---|---|---|
| 1 | **₱1,000 couple discount is permanent + free to the vendor** — activate booth on free cycle → unlock unlimited couples → let booth lapse → couples keep ₱1,000 forever. Resolver checks only row existence; no re-validate, no revoke. | billing, security, data-model (3) | PR `council-fix-money`: re-validate booth-active + still-booked at charge time |
| 2 | **Refund = keep the feature** — 4 activation hooks, 0 deactivation hooks. Refund AI/Booth keeps the window; Photo Challenge stays sponsored permanently. | billing | PR `council-fix-money`: add deactivation hooks (mirror SETNAYAN_AI) |
| 3 | **Deep Search free-run race** — read-decide-run, no atomic claim → N parallel = N free searches (unlimited free AI/web compute). Sibling trials got the guard; this didn't. | security, billing, data-model (3) | PR `council-fix-money`: atomic pre-claim + partial unique index |
| 4 | **Failed paid activation is invisible** — `activateOrderSku` errors go to `console.error` only; no Sentry/alert/reconciliation. Money taken, entitlement never stamped, admin sees success. | go-live | PR `council-fix-money`: route to captureException/insertFaultLog |
| 5 | **Deep Search charges ₱500 for a keyless "Lite" pass** — no `ANTHROPIC_API_KEY` check before charging; Lite = free-tier output. | go-live | PR `council-fix-money`: block/label the paid buy when unkeyed |
| 6 | **"Open it up / name never gated" LOCKED decision un-built** — code still gates the name (hidden/anonymised until Solo); `llms.txt` still sells "name from day 1" as the upgrade. Only the inbox-free half shipped. | spec | PR `council-fix-names` (owner review — product change) |
| 7 | **Deep Search live + undisclosed (RA 10173)** — AI web-research + indefinite dossier storage, no `/privacy` section, no retention TTL, third-party PII; already billable in prod. | privacy | PR `council-fix-money` adds dossier retention TTL. ⚠ **OWNER/DPO:** `/privacy` disclosure + DPO review; decide whether to gate dark meanwhile |
| 8 | **Don't flip `VENDOR_AUTOREPLY_V1` until `/privacy` + DPO clear** — AI reads couple messages + dates/pax/budget/venue. Deterministic + couple-labelled (good), but no privacy basis yet; faith-consumption must stay unwired. | privacy | ⚠ **OWNER/DPO** — keep flag OFF; DPO sign-off + `/privacy` section required |
| 9 | **Token retirement missed the Manpower gig path** — gig-accept still burns 2 tokens with no token source; errors to a deleted page. Live stranding. | data-model | PR `council-fix-tokens`: make gig-accept free (or gate the tab) |

## 🟠 Should-fix (in the fix PRs)
- **Unscoped role check** across all 5 money actions — uses global-highest role, not the role on the *specific* vendor (viewer-on-A-who-owns-B could act on A). → `council-fix-money` (scope to the acted-on `vendor_profile_id`).
- **Photo Challenge double-charge** (no pending-order guard) → `council-fix-money`.
- **Add-ons lapse with no warning** (activation hooks don't stamp `orders.expires_at`) → `council-fix-money`.
- **Paid Deep Search runs synchronously in the admin approve click** (timeout/re-charge risk) → `council-fix-money` (move to `after()`).
- **Self-comp hook latent bypass** (inert today; re-assert tier/verification in the hooks) → `council-fix-money`.
- **Token language everywhere asserts a dead model** — "Buy tokens" CTA + wallet UI + home `vendor-benefits` + `VENDOR_TIERS_AND_BENEFITS.md` + `llms.txt` + `Pricing.md § 00.0`. The orphaned-peso-card pattern at scale. → `council-fix-tokens`.

## 🟢 LOW / cosmetic
Deep Search fail-safe overcharge on a DB blip · cycle-anchor ~1-day drift on annual · charged-but-no-dossier on a hard-failing run · Solo tier admin-unreachable (`setVendorTier` omits it) · `SEATING_3D` "₱2,499" comment drift · `unlock_vendor_event` direct-RPC spam (analytics only) · the 4× CHECK drop/recreate is fragile-by-accretion.

## ✅ Verified clean (no action)
- **No fake doors:** Vendor AI is a real deterministic engine; Photo Challenge's full loop IS built (the "Phases 2-5 unbuilt" memory was stale); public + vendor "coming soon" gating honest.
- **RLS** on all 3 new tables canonical (no cross-tenant; service-role writes only); the re-defined `unlock_vendor_event` preserves every gate + SECURITY DEFINER + search_path; the challenge RPC requires booked + paid + tier; couple discount + all add-on prices are server-authoritative.
- **Migrations** safe, idempotent, reversible, correctly ordered; **prod DB already up to date** (CI auto-push works).
- **Free-trial atomicity** (AI + Booth) sound; founder/comp doesn't double-grant.

## ✔️ Already resolved this session
- Dangling `vendor_peso_per_lead` RPC → dropped by in-flight **#3538** (peso surface fully removed).
- Migrations-applied → verified up to date.

## Ownership of the open items
- **Claude (in flight):** `council-fix-money` (leaks + monitoring + Deep-Search hardening + role-scoping + retention TTL), `council-fix-tokens` (token-copy sweep + Manpower), `council-fix-names` (implement the name lock — owner reviews).
- **Owner / DPO (decisions, not code):** the `/privacy` disclosures for Vendor AI + Deep Search; DPO sign-off before flipping `VENDOR_AUTOREPLY_V1`; whether to gate Deep Search dark until its disclosure/retention land; the Photo-Challenge Solo-eligibility question already flagged in migration `20270907628470`.

**Standout:** Deep Search is the most-flagged feature (4 seats: race, keyless-charge, undisclosed, sync-in-approval). Consider keeping it OFF until hardened + disclosed.
