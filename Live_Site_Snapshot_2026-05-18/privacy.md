[Setnayan](/)

Privacy policy

# How we handle your data

Effective 2026-05-13 · subject to RA 10173 (Philippines Data Privacy
Act)

## Starter draft

This is a starter draft pending legal review. The product behavior
described below is accurate as of this version; the legal language will
be refined by counsel before any public launch. If you have questions in
the meantime, reach us at the [help center](/help).

## What we collect

- Account info — email, password (hashed), display name, optional
  phone + profile photo URL
- Event data you create — guest lists, vendor records, budget items,
  schedule, mood-board palettes
- Messages you send via the in-app chat
- Payment metadata — order amounts, reference codes, channel, your
  screenshot if you upload one
- Automatic — IP address (truncated to first 3 octets for QR scan
  events), browser user-agent, timestamps

## What we do not collect (yet)

- Face biometrics — Papic iteration (0012) hasn’t shipped face data in
  V1
- Location beyond city-level vendor info you choose to share
- Third-party analytics — Sentry/PostHog are wired but not active until
  owner provisions accounts

## Vendor identity masking

When you chat with a Setnayan vendor, the vendor sees only your event
display name and date — never your email or personal name unless you
choose to share. This is a load-bearing product rule.

## Your rights (RA 10173)

- **Right to access:** download a JSON archive of your data anytime from
  [your profile](/dashboard/profile).
- **Right to erasure:** the same profile page has a soft-delete action
  (type DELETE to confirm). Soft-deleted accounts are retained for 30
  days for restoration by you, then become irreversibly deleted.
- **Right to rectification:** edit your personal info on the profile
  page.
- **Right to object:** reach us at the help center to opt out of
  specific processing.

## TikTok integration (Patiktok · iteration 0017)

Couples on the Patiktok Personal tier (₱1,999/day) connect their own
TikTok account to Setnayan so Patiktok booth compilations can auto-post
to the couple’s handle. Setnayan uses TikTok’s Login Kit and Content
Posting API. The Setnayan tier (₱999/day) does not require a couple-side
TikTok connection — those compilations post to **@SetnayanWeddings**,
our company-owned handle, using credentials Setnayan manages directly.

- **Scopes requested.** Only `user.info.basic`, `video.upload`, and
  `video.publish`. We do not request access to your TikTok followers,
  drafts, messages, or analytics.
- **What we receive from TikTok.** Your TikTok open ID (a stable per-app
  identifier), your union ID (if available), your display name / handle,
  an access token (typically valid 24 hours), and a refresh token. We do
  not receive your TikTok password.
- **How we use it.** The access token is read only by our render worker,
  only to post one rendered compilation MP4 per booth-day on your
  behalf, with a caption you can configure. We do not browse, download,
  or modify any other content on your TikTok account.
- **Storage + scope.** Tokens and the open ID are stored in
  `patiktok_oauth_grants` in our Supabase database (Singapore region ·
  encrypted at rest), scoped to one specific Setnayan event. They are
  never shared with vendors, other couples, or third parties.
- **Retention.** Grants are kept until the earlier of (a) you revoke
  them from your profile or from TikTok’s app settings, (b) you delete
  your Setnayan account, or (c) 30 days after the event ends. Refresh
  tokens past their expiry are purged automatically.
- **Revoking access.** Two paths, either works immediately:
  - In Setnayan, open the Patiktok page and click *Disconnect TikTok*.
    We soft-revoke the grant locally.
  - In TikTok, go to *Settings → Privacy → Manage apps and websites* and
    remove Setnayan. We honor the revocation on the next render attempt.
- **Posts on your TikTok account.** Once a compilation is posted to your
  account, the video is owned by you. Delete it from TikTok like any
  other video — Setnayan cannot delete posts on your behalf after they
  go live.

## YouTube integration (Panood · iteration 0011)

Couples who purchase a Panood SKU (live wedding broadcast) connect their
own YouTube channel to Setnayan so the live ceremony can stream to their
channel and embed on the event landing page. The connection uses
Google’s standard OAuth sign-in. You can revoke it at any time from your
[Google Account permissions](https://myaccount.google.com/permissions).

- **Scopes requested.** Only `.../auth/youtube` (create and manage live
  broadcasts on your channel), `.../auth/youtube.upload` (upload videos
  · used by V1.5+ AI Edited Highlight), `.../auth/userinfo.email`, and
  `.../auth/userinfo.profile`. We never request read access to your
  subscribers, comments, view history, watch history, search history, or
  any YouTube data unrelated to the broadcast we created for your event.
- **What we receive from Google.** A refresh token tied to your YouTube
  channel, your channel name and ID, an access token (typically valid 1
  hour), and the broadcast IDs we create on your behalf. We do not
  receive your Google password.
- **How we use it.** The refresh token is read by our broadcaster
  orchestration service only during your event window, to (a) create the
  YouTube live broadcast for your event, (b) push the selected camera
  feed to YouTube’s ingest endpoint while you are live, and (c) embed
  the resulting public broadcast in your Setnayan event landing page. We
  do not browse, modify, or delete any other content on your YouTube
  channel.
- **Storage + scope.** Tokens and the channel ID are stored in
  `oauth_grants` in our Supabase database (Singapore region · encrypted
  at rest), scoped to one specific Setnayan event. They are never shared
  with vendors, other couples, or third parties.
- **Limited Use commitment.** Setnayan’s use and transfer of information
  received from Google APIs to any other app adheres to the [Google API
  Services User Data
  Policy](https://developers.google.com/terms/api-services-user-data-policy),
  including the Limited Use requirements. We never use your YouTube data
  for advertising, never sell or transfer it, and never use it to train
  AI or ML models.
- **Retention.** Grants are kept until the earlier of (a) you revoke
  them from your Google account or from your Setnayan profile, (b) you
  delete your Setnayan account, or (c) 30 days after the event ends.
  Refresh tokens past their expiry are purged automatically.
- **Revoking access.** Two paths, either works immediately:
  - In Setnayan, open the Panood page and click *Disconnect YouTube*. We
    soft-revoke the grant locally.
  - In your Google account, go to [Security → Third-party apps with
    account access](https://myaccount.google.com/permissions) and remove
    Setnayan. We honor the revocation on the next broadcast attempt.
- **Broadcasts on your YouTube channel.** Once a broadcast is created on
  your channel, the recording is owned by you. Edit or delete it from
  YouTube Studio like any other video — Setnayan cannot delete videos on
  your behalf after the broadcast ends. Your use of YouTube is also
  governed by [YouTube’s Terms of
  Service](https://www.youtube.com/t/terms) and the [Google Privacy
  Policy](https://policies.google.com/privacy).

## Subprocessors

- Supabase (database + auth, Singapore region)
- Vercel (web hosting)
- Cloudflare (CDN + planned R2 object storage, APAC region)
- Resend (transactional email — pending activation)
- Google (YouTube Data API — only for couples who purchase Panood and
  explicitly connect their YouTube channel via OAuth)
- TikTok (Personal-tier Patiktok only · for couples who explicitly
  connect their TikTok account via OAuth)

## Contact

For privacy questions or RA 10173 requests, message us via the [help
center](/help) with subject “Privacy”. We’ll respond within one business
day.

[Home](/)[Help](/help)[Terms](/terms)[Privacy](/privacy)
