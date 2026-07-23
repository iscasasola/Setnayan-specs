# Route Wayfinding Audit — 2026-07-15

> **Author:** Fable (design lead) · **Trigger:** owner found `/guests/invite` + QR surfaces orphaned ("make sure nothing is orphaned as well. strategically plot them properly") · **Method:** mechanical link-context scan of all 366 `page.tsx` routes on `origin/main`, then 3-agent verification tracing every 0–2-hit candidate to a *rendered, reachable* doorway (registry rows, comments, tab-light `activeMatch` arrays, and uncalled route helpers do NOT count as reachability — that's exactly how `/guests/invite` hid).

## Verdict summary

| Class | Count | Examples |
|---|---|---|
| REACHABLE (real doorway verified) | vast majority | souvenirs, tea-ceremony, site-editor phases, 3D demo, reset-password, all admin studio tabs |
| STUB-OK (redirect stubs, orphan-by-design) | ~30 | 11 vendor 5-page-IA stubs, ~20 admin studio-tab stubs, `…/design`, `…/for-you`, `…/today` |
| PROTOTYPE/DEV-BY-DESIGN | 2 | `/prototype/mesh-call` (noindex, awaiting owner multi-device test), `/dev/booth-lab` (prod-404) |
| SEO-LANDING-BY-DESIGN | 1 | `/why-setnayan` (GEO/AI-search landing; internal links unnecessary) |
| **ORPHANED-LIVE (fix — this doc)** | **5** | below |
| DEAD (deletion candidates → cleanup track, NOT this PR) | 2 | `…/studio/bundle` (permanent 404, no reachable minter), `…/profile/concierge` (CONCIERGE_ENABLED=false + retired SKU; admin concierge-abuse `relatedUrl` still points at it — do not delete without untangling) |

Fixed earlier today (same directive): `/guests/invite` + `/event-qr` + mobile Invite-pill mis-route — PR #3249, merged.

## The 5 placements (strategic, per surface IA)

1. **`/admin/integrations`** (Integration Activation Console — Resend/OpenAI/Maya secrets, AI-paywall flag; today only an `/admin` dashboard tile).
   → Add to `ADMIN_NAV_GROUPS` **Money group settings tail** (beside Compliance · Notifications · Demo-mode) in `admin-nav-groups.tsx`. Ops-config belongs with settings, and the solo-operator finds every activation switch in one place.

2. **`/explore/compare`** (live compare-2-saved-vendors; `explore/page.tsx` still shows a stale "compare coming in V1.2" banner while the tool EXISTS).
   → Wire a **"Compare" affordance on the explore/saved-vendors surface**, enabled at ≥2 saved vendors; replace the stale coming-soon banner with the real door (honesty rule: never advertise "coming" for something shipped).

3. **`/dashboard/year`** (Moments calendar; email CTA works, in-app strip de-linked 2026-07-13).
   → Re-link from the **launcher's year-moments strip** (`year-moments-list.tsx`) — strip header/see-all row → `/dashboard/year`. The strip already renders the data; it just lost its door. Owner's "nothing orphaned" directive (2026-07-15) supersedes the 07-13 de-link.

4. **`/vendor-dashboard/website`** (full website settings + `DomainManager` — unique functionality; editing summary lives inline on the /shop Website manage-tile).
   → **"Open full website settings →" link on the /shop Website manage-tile** (`shop/_components/manage-tiles.tsx` websitePanel). Tile stays the summary; the standalone page is the deep surface.

5. **`/waitlist`** (live couple-waitlist signup; `site-chrome.tsx` comment CLAIMS a footer link that `reskin-footer.tsx` doesn't render).
   → Add the **footer "Join the waitlist" link** on the marketing chrome (IA fix, not a reskin — guest/marketing visual exclusions untouched).

Also in the fix PR: correct stale reachability comments so docs can't drift (`event-qr/page.tsx` header "event-home tiles grid" claim; `track-record` "/more landing" claim; `site-chrome.tsx` footer claim).

## Standing rule (proposed, for CLAUDE.md consideration)
A page ships with its doorway or it doesn't ship: any PR adding a `page.tsx` must include at least one rendered, reachable link to it (or explicitly declare it a redirect stub / prototype / SEO landing in the page header comment). Nav-registry rows and `activeMatch` entries are not doorways.
