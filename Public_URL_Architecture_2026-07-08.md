# Public URL Architecture (2026-07-08)

> **Owner-locked this session (2026-07-08).** The public-facing route scheme for vendors, users, events, and the Live Studio watch page. **Supersedes** the shipped flat `/[slug]` = event + `/v/[slug]` = vendor convention. ⚠ This is a **platform-wide migration** (QR codes, sitemap, day-of routing, all `/[slug]/*` sub-pages) — see § Migration.

## The scheme

| Surface | Route | Notes |
|---|---|---|
| **Vendor** | `/[slug]` (flat, root) | Marketplace / SEO surface — clean short slugs. Moves here **from** `/v/[slug]`. |
| **User** | `/u/[user-slug]` | A user's namespace / profile. **New.** |
| **Event** | `/u/[user-slug]/[event-slug]` | The couple's public event page. Moves here **from** flat `/[slug]`. |
| **Live** | `/u/[user-slug]/[event-slug]/live` | The public live **watch** page (Live Studio viewer). The operator **controller** is a separate authenticated route. |
| Event sub-pages | `/u/[user-slug]/[event-slug]/{welcome, find-seat, …}` | Move with the event (were `/[slug]/welcome`, `/[slug]/find-seat`). |

**Rationale:** vendors are the SEO / marketplace surface → they get premium **flat root** slugs. Users + events are personal → namespaced under `/u/`, so **event slugs only need per-user uniqueness** (not global). Root flat slugs (vendors) must be globally unique **and** avoid reserved top-level paths.

## ⚠ Migration implications (this reverses shipped routing)

Shipped today: `/[slug]` = **event** (0002 · live · ISR · QR via `buildInvitationUrl`); `/v/[slug]` = **vendor**. This scheme swaps both:

1. **Events `/[slug]` → `/u/[user]/[event]`** — re-point **event QR codes** (`buildInvitationUrl`), the **sitemap**, **day-of routing** (0031), and every `/[slug]/*` sub-page. **⚠ Any event QR codes / shared links already in the wild (pilot) BREAK unless a redirect from old `/[slug]` is added.**
2. **Vendors `/v/[slug]` → `/[slug]`** — vendor pages move to flat root; redirect `/v/[slug]` → `/[slug]`.
3. **Reserved-word blocklist** for flat vendor slugs — a vendor slug cannot collide with reserved top-level paths (`u`, `v`, `dashboard`, `admin`, `api`, `pricing`, `features`, `help`, `privacy`, `blog`, `recommendations`, …). Enforce at slug creation.
4. **Redirects** from every old URL so live QR codes + SEO links survive.

## Owner to confirm

- Accept the **event-QR / existing-link breakage** (mitigated by redirects) — pilot is early, so blast radius may be small; confirm.
- The **reserved-word blocklist** for vendor flat slugs.
