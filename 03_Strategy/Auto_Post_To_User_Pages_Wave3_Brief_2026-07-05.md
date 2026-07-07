# Auto-Post to a User's OWN Pages — Wave 3 Project Brief

_Drafted 2026-07-05. Companion to the Setnayan-owned recap auto-post (shipped this session · Setnayan FB + IG) and to `Instagram_Auto_Sync_Wave2_Brief_2026-07-05.md` (vendor IG READ sync). This brief covers the WRITE direction to a **vendor's or couple's own** Facebook Page + Instagram Business account._

## Goal

When an event **completes** (the couple publishes their public recap), let a **vendor** or a **couple** who has connected their own page have that recap (or a vendor "featured wedding" post) **auto-published to their OWN Facebook Page + Instagram Business account** — not just Setnayan's.

The Setnayan-side of this already ships: publishing a recap composes a `social_posts` row (`source_type='event_recap'`) that the existing flush dispatches to Setnayan's own FB Page + IG Business account (`lib/social/facebook.ts` + `lib/social/instagram.ts`, gated on the master autopublish switch). **Wave 3 extends the SAME dispatch to a per-user page token** — the couple's or the vendor's — behind their explicit consent.

## Why this is a separate wave (the hard gate)

Posting to Setnayan's OWN page uses ONE long-lived Page/System-User token the owner controls. Posting to a **user's** page needs a **per-user OAuth grant** and **materially more Meta permissions** — which means **App Review + Live mode**. It cannot ride dev-mode.

### Extra Meta permissions needed (beyond Wave 2's read-only IG sync)

Wave 2 (vendor IG auto-sync) only needs `instagram_basic` (READ the user's own media). Writing a post to a user's page needs the **publishing** scopes:

| Scope | Why |
|---|---|
| `pages_manage_posts` | Publish to the user's Facebook **Page** feed (`POST /{page-id}/feed` · `/{page-id}/photos`). |
| `pages_read_engagement` | Required companion to read the Page + exchange the user token for the **Page** access token (`GET /{page-id}?fields=access_token`). |
| `instagram_content_publish` | The IG two-step publish (`POST /{ig-user-id}/media` → `/media_publish`). |
| `pages_show_list` | Enumerate the Pages the user admins during connect, to pick which one to post to. |
| `business_management` (likely) | Needed when the Page/IG lives under a Business Manager, common for vendors. |

All of these ride the **SAME Meta app** already in use: **"Setnayan Social"** (App ID `1685580025513352`, Business: Setnayan). No new app. But these publishing scopes are **advanced-access** — they require **App Review + Business Verification + Live mode** (~1–4 weeks), the same gate Wave 2 hits, plus a heavier review because WRITE scopes get more scrutiny (screencast of the consent + post flow, a clear "the user opted in" story).

**Legal / ToS line:** publishing to a user's own page **with their OAuth consent** is sanctioned. We NEVER post to a page the user did not explicitly connect + opt in for. No token, no consent → no post. Ever.

## Reuse — this is mostly plumbing we already have

- **Dispatch clients** — `postToFacebookPage()` and `postToInstagramFeed()` already do the exact Graph v21.0 calls and already NEVER-THROW (`{ok,error}`). Wave 3 only needs them to accept a **per-post token + page id / ig-user-id** instead of always reading `resolveMetaConfig()`. Small refactor: thread an optional `{ pageId, accessToken, igUserId }` override into both, defaulting to `resolveMetaConfig()` (the Setnayan-owned path — byte-identical to today).
- **The card** — the recap card (`renderRecapOgJpeg` → R2 `setnayan-media`, stable public URL) is already generated for the Setnayan post. A user-page post reuses the **same** R2 card URL. No new image work.
- **The queue** — a user-page post is just another leg on the existing `social_posts` dispatch, or a sibling `social_posts` row targeted at a user page (see "Data model" — recommend the sibling-row model so the governor/dedupe/audit all apply unchanged).
- **The trigger** — event completion = `publishRecap` (already wired). Wave 3 adds a second compose call there that fans out to each connected + opted-in page.

## Per-user OAuth + page-token storage — reuse the Wave 2 pattern

**Reuse `vendor_ig_connections` verbatim** (from `Instagram_Auto_Sync_Wave2_Brief_2026-07-05.md`) — it already stores exactly what a WRITE needs: `ig_user_id`, `fb_page_id`, encrypted long-lived `access_token`, `token_expires_at`, `status`. Wave 3 additions:

- A `can_publish BOOLEAN` (or a `granted_scopes TEXT[]`) column so we record that this connection was granted the **publish** scopes, not just `instagram_basic` — a read-only Wave-2 connection must NOT be silently used to WRITE.
- An `autopost_recaps BOOLEAN DEFAULT FALSE` **opt-in** flag — connecting is not consent to auto-post; the user flips this on explicitly.
- A **couple-side** mirror table `couple_page_connections` (same shape) since couples are `users`/`events`, not `vendor_profiles`. Or generalize to one `page_connections(owner_type, owner_id, …)` table — recommended, so vendor + couple share one connect/refresh/publish path.
- The Wave-2 **token-refresh job** (long-lived tokens expire ~60 days) covers WRITE tokens too — no new refresh infra.

Tokens are **server-only**, encrypted at rest (`lib/encryption.ts`), never sent to any client — same rule as every other secret.

## Data model (recommended: sibling social_posts rows)

Keep the couple/vendor post as its OWN `social_posts` row so the governor, per-row claim, dedupe index, and admin audit all apply with zero new machinery:

```
social_posts(
  source_type = 'event_recap',
  source_ref  = '{event_id}',            -- Setnayan-owned row (ships today)
  ...
)
social_posts(
  source_type = 'event_recap_user',      -- NEW: user-page target
  source_ref  = '{event_id}:{connection_id}',  -- deterministic → dedupe per (event, page)
  target_connection_id = '{connection_id}',    -- NEW column: which page token to use
  media_url   = <same R2 recap card>,
  ...
)
```

- The partial-unique index `(source_type, source_ref)` makes each (event, page) post **compose-once** — a re-publish never double-posts, exactly like the Setnayan row.
- Dispatch reads `target_connection_id`; when set, it resolves that connection's page token + ig-user-id and passes them as the override into `postToFacebookPage` / `postToInstagramFeed`. When null, it's the Setnayan-owned path (today's behavior).
- Per-connection `platform_results` stamps + failures stay row-local — one vendor's expired token never affects Setnayan's post or another vendor's.

## Trigger, consent, dedupe

- **Trigger:** `publishRecap` (event completed → recap live). Already fires `after(composeRecapSocialPost + runSocialFlush)`. Wave 3 adds `composeUserRecapPosts(eventId)` in the same `after()`: for the couple's connection AND for each vendor booked on the event who has `autopost_recaps=TRUE` + a publish-capable connection, compose one sibling row.
- **Consent (two gates, both required):** (1) the user CONNECTED their page via OAuth (grants the token), AND (2) the user flipped `autopost_recaps` ON. Connecting alone is never consent to post. Vendors additionally only auto-post events they were actually booked on (no posting a wedding they had no part in).
- **Dedupe:** deterministic `source_ref = '{event_id}:{connection_id}'` + the partial-unique index → once per (event, page), forever.
- **Take-down:** a user revoking consent or disconnecting flips their pending sibling rows to `pulled` in the existing take-down sweep (extend `sweepTakedowns` to cover `event_recap_user`). Post-publish removal stays a manual admin lane + the user can delete on their own page.

## What's buildable NOW (inert) vs blocked-on-Meta

**Buildable now (behind a flag, ready-to-arm):**
- The `page_connections` publish columns (`can_publish`, `autopost_recaps`) + the `event_recap_user` compose path + the `target_connection_id` dispatch override (refactor the two publish clients to accept a token override).
- The dashboard "Connect page & auto-share my recap" UI (disabled, "Coming soon — requires a Business page" copy), the opt-in toggle, the take-down extension.
- Everything reads empty tables / no-op until a real connection with publish scopes exists.

**Blocked on the owner (Meta side):**
1. Submit `pages_manage_posts` + `pages_read_engagement` + `instagram_content_publish` (+ `pages_show_list`, likely `business_management`) for **App Review** on the Setnayan Social app, with a screencast of the consent + auto-post flow.
2. Complete Business Verification + move the app to **Live mode**.
3. Provide/confirm `META_APP_ID` + `META_APP_SECRET` as Vercel env vars (shared with Wave 2's OAuth) and the OAuth redirect domain + privacy-policy URL Meta requires for publish scopes.

## Owner actions

- **Decide scope of Wave 3 targets:** couples only? vendors only? both? (Recommend: build the generalized `page_connections`; enable couple-side first — simpler consent story — then vendors.)
- **Kick off Meta App Review** for the publish scopes (rides the SAME review submission as Wave 2's `instagram_basic` — bundle them to save a round-trip). This is the long pole (~1–4 weeks).
- **Confirm the consent copy** — WRITE-to-your-page is a stronger consent than READ-sync; the connect screen + the `autopost_recaps` toggle need unambiguous "we will publish to your page when your event completes" language for RA 10173 + Meta review.

## Non-goals

- No posting to a page the user did not explicitly connect + opt in for. No posting a vendor to an event they weren't booked on. No scraping. No personal-IG-account support (Meta requires Business/Creator IG linked to a Page — same limit as Wave 2). No new Meta app. No net-new render pipeline (reuses the recap card already on R2). Auto-posting stays recap-triggered in V1 of this wave; per-post "share this to my page now" buttons are a later add.
