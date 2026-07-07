# Instagram Auto-Sync — Wave 2 Project Brief

_Drafted 2026-07-05. Companion to Wave 1 (public "Featured videos" gallery + Vimeo social + presence guide), which ships the manual-link foundation this builds on._

## Goal

Let a vendor **connect their Instagram once** and have their IG posts/reels flow into their Setnayan public profile gallery automatically — "you upload to IG, it shows up on your Setnayan site." Removes the re-upload burden for vendors who already run an active IG.

## Existing assets (updated 2026-07-05 — better than first assumed)

- **The Meta app already exists:** "**Setnayan Social**" (App ID `1685580025513352`, Business: Setnayan, currently *In development*). Use this one. (Also present: a second "Setnayan" app `26504621642553856` and the unrelated "iCasa ERP".)
- **Meta Graph plumbing already in code:** `apps/web/lib/social/facebook.ts` (Graph API v21.0 page-publish) + `apps/web/lib/integration-config.ts` `resolveMetaConfig()`, driven by `META_PAGE_ID` / `META_PAGE_ACCESS_TOKEN` (the Setnayan-page auto-publish pipeline, `Social_Sharing_Program_2026-06-12.md`). Vendor IG sync reuses the **same app** but a **different credential type**: `META_APP_ID` + `META_APP_SECRET` for a per-vendor OAuth exchange (not a page token).
- **Dev-mode testability:** because the app is *In development*, we can build AND test the real OAuth + sync flow **now** against the owner's own Business IG (dev-mode allows app admins/testers). Only opening it to *public* vendors needs Live mode + App Review.

## The hard constraint (read first)

Meta retired the easy path (Instagram Basic Display API) on **2024-12-04**. The only sanctioned route now is the **Instagram Graph API**, which requires:

1. ✅ A **Meta Developer app** — DONE (Setnayan Social).
2. **Meta App Review** for `instagram_basic` + **Live mode** + Business Verification — needed only to open connect to PUBLIC vendors (~1–4 weeks). NOT needed to build/test in dev mode.
3. The **vendor** must have a **Business or Creator IG account linked to a Facebook Page** — a personal IG account **cannot** connect. Many small PH vendors have personal accounts, so this feature serves a subset, not everyone.
4. **Long-lived token refresh** (tokens expire ~60 days) — a background refresh job.

**Legal line:** pulling a vendor's own media via their OAuth consent is fine (it's their content, their choice). **Scraping IG without the API is against Meta's ToS — we will not do it.**

So the feature splits into **buildable-now (inert)** vs **blocked-on-Meta (live)**.

## Architecture

```
Vendor dashboard → "Connect Instagram" (OAuth, Meta login)
  → we store: ig_user_id, page id, long-lived token, connected_at
Background sync (poll every ~6–12h via after()/waitUntil, cron-free per house style)
  → GET /{ig-user-id}/media?fields=id,media_type,media_url,permalink,thumbnail_url,timestamp
  → upsert into vendor_ig_media (dedupe on ig_media_id)
Public profile → renders synced media in the gallery alongside gallery_video_links + portfolio photos
  → vendor can hide/curate individual items (a "show on profile" toggle)
Token refresh job → refresh long-lived token before expiry; mark connection stale if it fails
```

### Data model (new)
```sql
-- connection (one per vendor)
vendor_ig_connections(
  vendor_profile_id, ig_user_id, ig_username, fb_page_id,
  access_token (encrypted), token_expires_at, connected_at, last_synced_at, status)
-- synced items
vendor_ig_media(
  id, vendor_profile_id, ig_media_id (unique), media_type, media_url, permalink,
  thumbnail_url, caption, taken_at, show_on_profile bool default true, synced_at)
```
- Media URLs from IG are **short-lived** — either re-fetch on sync or copy the asset into R2 (`setnayan-media`) for a stable public URL. **Recommend copying to R2** (R2 egress is free; house "R2 = record" rule) so the profile doesn't break when IG's CDN URL expires.
- RLS: standard vendor-owns-row patterns; tokens readable only server-side (never to client).

## What's buildable NOW (inert, defensible-by-default)

Per the "build everything buildable before the external gate" principle, we can ship the whole flow **behind a feature flag / disabled connect button** while Meta review is pending:
- The `vendor_ig_connections` + `vendor_ig_media` tables + RLS.
- The "Connect Instagram" UI (disabled, with "Coming soon — requires a Business Instagram" copy).
- The sync worker + token-refresh job (written, not scheduled).
- The public-profile render of synced media (reads an empty table → renders nothing).
- The curate/hide toggle.

This means the day Meta approves, it's a config flip, not a build.

## What's BLOCKED on the owner (Meta side)

1. **Create the Meta Developer app** + complete Meta Business Verification.
2. **Submit `instagram_basic` for App Review** with the use-case + screencast.
3. Provide the app credentials (`META_APP_ID`, `META_APP_SECRET`) as Vercel env vars.
4. Decide the OAuth redirect domain + privacy-policy URL Meta requires.

## Phasing recommendation

- **Phase A (now, after Wave 1 merges):** build the inert scaffolding above behind a flag. Low risk, additive, ready-to-arm.
- **Phase B (after Meta approval):** flip the flag, wire real OAuth, first sync. Owner-gated on steps 1–4 above.

## Open product decisions

- Copy synced media to R2 (recommended) vs hot-link IG CDN (breaks on expiry)?
- Auto-show all synced posts vs vendor opt-in per post (recommended: sync all, default-show, easy hide)?
- Sync cadence (6h? 12h? on-demand "sync now" button)?
- Video reels: same pipeline, but reel embeds may prefer the IG permalink card over a re-hosted file (rights-safe).

## Non-goals

- No cross-vendor scraping. No personal-IG-account support (Meta doesn't allow it). No storing IG data for non-connected vendors. No auto-posting FROM Setnayan TO Instagram (that's the separate couple-side social-sharing pipeline).
