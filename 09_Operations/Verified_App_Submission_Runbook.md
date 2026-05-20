# Verified-App Submission Runbook

**Locked 2026-05-20.** Owner-side launch-prep guide for the three external app reviews that gate V1 launch: **Google Drive** (Photo Delivery + Papic), **YouTube** (Panood), **TikTok** (Patiktok). Each section has the audit summary, submission portal URL, field-by-field answers, demo video script, and common rejection reasons.

> **Engineering-side prep is COMPLETE for all 3.** The privacy disclosure pages are shipped at `setnayan.com/privacy`, all OAuth scopes are minimum-necessary, and the OAuth flows are coded + deployed. What blocks each is the **submission package + demo video** that only the owner can record and submit.

> **Submission timeline expectations.** Google + TikTok reviews take 1–4 weeks typical, sometimes 6+ if scopes need justification. Submit all three in parallel — they don't depend on each other. Each portal accepts updates without resetting the queue, so first submission can be incomplete and refined while waiting.

---

## Part 0 — Common prereqs

| Item | Where | Status |
|---|---|---|
| Privacy policy URL | `https://www.setnayan.com/privacy` | ✅ Shipped — covers all 3 integrations explicitly |
| Terms of service URL | `https://www.setnayan.com/terms` | (verify before submission) |
| Public website + branding | `https://www.setnayan.com` | ✅ Shipped per 0015 |
| Production OAuth redirect URIs (must match what's coded) | See per-section below | ✅ Coded |
| Setnayan logo (PNG 512×512+) | `apps/web/public/setnayan-logo*` | ✅ Available |
| Owner Google account | `iscasasolaii@gmail.com` (verified from memory) | Owner owns |

**Demo video general guidance** (applies to all 3):

- Record at 1080p in landscape (16:9), 60–180 seconds total
- Use a fresh test account when possible (NOT the owner's primary account) so reviewers see the real new-user experience
- Show the full OAuth consent screen (with scopes visible)
- Show that scopes work as described — DO the action that requires the scope
- Show that the user can disconnect / revoke access at any time
- Voiceover OR captions — required by most reviewers
- Upload to YouTube (unlisted) or Google Drive (link-shareable) — reviewers don't accept Vimeo or proprietary players

---

## Part 1 — Google Drive verified-app submission (#19g)

**For iterations:** 0009 Photo Delivery + 0012 Papic
**Owner blocker tag:** #19g (per App_Build_Status)

### Audit summary

| Check | Status |
|---|---|
| OAuth scope used | `https://www.googleapis.com/auth/drive.file` (minimum — Setnayan can only see/touch files it created) ✅ |
| OAuth redirect URIs | `https://www.setnayan.com/api/oauth/drive/callback` + `/api/oauth/photo-delivery/callback` ✅ |
| Privacy disclosure | `setnayan.com/privacy` § "Google Drive integration (Photo Delivery · iteration 0009 + Papic · iteration 0012)" ✅ |
| Disconnect flow | Implemented at `/api/oauth/drive/disconnect` ✅ |
| Token refresh handler | `/api/cron/oauth-refresh` ✅ |
| Lib source of truth | `apps/web/lib/papic-drive.ts` ✅ |

**What couples actually use the scope for** (the justification text for the reviewer):
- Photo Delivery (0009): vendor uploads finalized wedding photos to the Setnayan-created Drive folder; couple downloads from the same folder once vendor "releases" the set. Setnayan only reads/writes files it itself created inside the `/Setnayan/{event-slug}/` hierarchy.
- Papic (0012): camera-mesh-captured photos sync to the Setnayan-created Drive folder at T+30 days. Setnayan never reads or writes outside the folders it created.

### Submission portal

https://console.cloud.google.com/apis/credentials/consent → OAuth consent screen → Edit → "Submit for Verification"

### Field-by-field answers

| Field | Answer |
|---|---|
| App name | `Setnayan` |
| User support email | `iscasasolaii@gmail.com` |
| App logo | Upload `setnayan-logo` 512×512 PNG transparent |
| Application home page | `https://www.setnayan.com` |
| Application privacy policy | `https://www.setnayan.com/privacy` |
| Application terms of service | `https://www.setnayan.com/terms` |
| Authorized domains | `setnayan.com` |
| Developer contact information | `iscasasolaii@gmail.com` |
| Scopes requested | Only `https://www.googleapis.com/auth/drive.file` |
| Scope justification text | *"Setnayan is a Filipino wedding-planning platform. Two features use the `drive.file` scope, both opt-in by the couple: (1) Photo Delivery — wedding vendors release finalized photos to the couple via a Setnayan-created Drive folder; the couple downloads from the same folder; (2) Papic camera mesh — guest-captured photos sync to the Setnayan-created Drive folder 30 days post-event. The `drive.file` scope is the minimum scope necessary because Setnayan only creates, reads, and writes files within Setnayan-created folders (the `/Setnayan/{event-slug}/` hierarchy). Setnayan cannot access any other files in the user's Drive. Users can disconnect at any time from the Setnayan dashboard or revoke from their Google Account settings."* |
| Why a less-sensitive scope isn't sufficient | *"All Google Drive scopes narrower than `drive.file` (such as `drive.metadata`) do not permit writing files, which is required for vendor-uploaded photos and Papic photo sync. The `drive.file` scope is Google's documented minimum for apps that create + manage files they own."* |

### Demo video script (target 120 seconds)

```
[0:00–0:10] Opening title card: "Setnayan — Google Drive integration demo for verification review. Iteration 0009 Photo Delivery."
[0:10–0:25] Show https://www.setnayan.com homepage. Voice: "Setnayan is a Filipino wedding-planning platform. Couples use Photo Delivery to receive their finalized wedding photos from their vendor."
[0:25–0:45] Sign in as a test couple. Navigate to /dashboard/[eventId]/add-ons/photo-delivery. Voice: "From the Photo Delivery page, the couple clicks Connect Google Drive."
[0:45–1:10] Click Connect → Google OAuth consent screen appears. Voice: "Google's standard consent screen shows the drive.file scope being requested. The couple accepts. Setnayan only gets access to files Setnayan itself creates."
[1:10–1:25] Show the Setnayan-created folder appearing in the couple's actual Google Drive at /Setnayan/{event-slug}/. Voice: "Setnayan creates a folder for this wedding. The vendor uploads photos here. The couple downloads from here."
[1:25–1:45] Switch to vendor view (or describe). Voice: "When the vendor releases the photos, the couple sees them in Setnayan and can download. Setnayan only touches files inside this folder."
[1:45–2:00] Navigate to /dashboard/[eventId]/add-ons/photo-delivery → click Disconnect Google Drive → confirm. Voice: "The couple can disconnect at any time from the same page. They can also revoke from Google Account settings."
[2:00] End card: "Privacy policy: setnayan.com/privacy. Thank you for reviewing."
```

### Common Google rejection reasons + how to avoid

| Rejection reason | Mitigation |
|---|---|
| Privacy policy doesn't mention Google scope | Privacy page DOES mention `drive.file` explicitly — ✅ |
| Scope justification too vague | Use the field text above — it's specific to the user-facing feature |
| Demo video shows scope but doesn't show user benefit | Script above explicitly shows file creation + download |
| Demo video uses dev account that bypasses OAuth | Record with a test couple account that isn't on the Google Cloud project |
| App branding inconsistent (logo + name on portal vs. in product) | Use exact match: name = "Setnayan", logo = the same SVG/PNG on both portal + product |

### After submission

- Currently OAuth works only for `indaleciocasasolaii@gmail.com` (the Google Cloud project owner). All other couples see the "unverified app" warning screen.
- After approval, any Google account can OAuth without the warning.
- Photo Delivery becomes available to all couples (currently gated per App_Build_Status row 0009).

---

## Part 2 — YouTube verified-app review Phase 2 (#17a)

**For iteration:** 0011 Panood
**Owner blocker tag:** #17a (privacy disclosure ✅ shipped PR #116; demo video pending)

### Audit summary

| Check | Status |
|---|---|
| OAuth scopes used | `https://www.googleapis.com/auth/youtube` + `https://www.googleapis.com/auth/youtube.upload` ✅ |
| OAuth redirect URI | `https://www.setnayan.com/api/oauth/youtube/callback` ✅ |
| Privacy disclosure | `setnayan.com/privacy` § "YouTube integration (Panood · iteration 0011)" ✅ PR #116 |
| Disconnect flow | `/api/oauth/youtube/disconnect` ✅ |
| Token refresh | `/api/cron/oauth-refresh` ✅ |
| Lib source of truth | `apps/web/lib/panood-youtube.ts` ✅ |

**What couples actually use the scopes for:**
- `youtube` + `youtube.upload`: couples purchase a Panood SKU (live wedding broadcast). Their YouTube channel goes live during the ceremony. Setnayan creates the live broadcast on the couple's channel, the camera streams to it, viewers watch on YouTube. The recording stays on the couple's channel after the wedding.

### Submission portal

https://console.cloud.google.com/apis/api/youtube.googleapis.com → OAuth consent screen → "Submit for verification" (combined with Drive submission above — both are Google reviews)

### Field-by-field answers

Same project as Drive submission. Add YouTube scopes to the same OAuth consent screen as Drive.

| Field | Answer (adds to existing app verification) |
|---|---|
| Scopes added | `https://www.googleapis.com/auth/youtube` + `https://www.googleapis.com/auth/youtube.upload` |
| Scope justification text | *"Setnayan offers 'Panood' — a paid feature that broadcasts a wedding ceremony live on the couple's own YouTube channel. The couple opts in by purchasing the SKU, connects their YouTube channel via OAuth, and Setnayan creates the live broadcast event on that channel. The youtube.upload scope is needed to push the camera stream into the broadcast. The youtube scope is needed to read channel ID + create the broadcast object. Setnayan never reads the couple's watch history, comments, subscriptions, or any other YouTube data. The broadcast + recording belong to the couple after the wedding."* |
| Why less-sensitive scopes aren't sufficient | *"Live streaming requires the full youtube + youtube.upload scope pair. Read-only scopes don't allow broadcast creation; partial-write scopes don't exist for live broadcasts."* |

### Demo video script (target 150 seconds)

```
[0:00–0:10] Opening title: "Setnayan — YouTube live streaming integration demo for verification review. Iteration 0011 Panood."
[0:10–0:30] Show https://www.setnayan.com → Panood add-on page. Voice: "Panood is a paid Setnayan feature that broadcasts a wedding ceremony live on the couple's own YouTube channel."
[0:30–0:50] Show pricing + SKU purchase flow. Voice: "Couples opt in by purchasing the Panood SKU."
[0:50–1:20] After purchase, the Panood setup page appears. Click "Connect YouTube". Voice: "The couple clicks Connect YouTube. Google's OAuth consent screen appears showing the youtube + youtube.upload scopes."
[1:20–1:50] Accept consent → return to Panood setup. Voice: "Once connected, Setnayan shows the couple's channel name and confirms ready-to-broadcast status. Setnayan only reads channel metadata + creates the broadcast object. We do not read watch history, comments, subscriptions, or any other YouTube data."
[1:50–2:20] Simulate the live event (or show a recording of one). Voice: "When the wedding starts, Setnayan creates the live broadcast on the couple's channel. The camera streams to YouTube. Guests and family worldwide watch on YouTube. The recording stays on the couple's channel after the event."
[2:20–2:40] Navigate to /dashboard/[eventId]/add-ons/panood → click Disconnect YouTube. Voice: "The couple can disconnect at any time. The connection is also revocable from Google Account settings."
[2:40] End card: "Privacy policy: setnayan.com/privacy. Thank you."
```

### Common YouTube rejection reasons + how to avoid

| Rejection reason | Mitigation |
|---|---|
| "We don't see live streaming actually working in the demo" | Script explicitly shows a live broadcast going live (use a test channel + private broadcast for the demo) |
| "Why does Setnayan need write scope vs. just monitoring?" | Justification above explicitly states broadcast creation requires upload scope |
| "Privacy policy doesn't disclose YouTube" | Already covered in privacy page per PR #116 ✅ |
| "App appears to scrape YouTube data" | Script explicitly says "we do not read watch history, comments, subscriptions" |

---

## Part 3 — TikTok app review submission (#20f)

**For iteration:** 0017 Patiktok
**Owner blocker tag:** #20f

### Audit summary

| Check | Status |
|---|---|
| OAuth scopes used | `user.info.basic` + `video.upload` + `video.publish` ✅ |
| OAuth redirect URI | `https://www.setnayan.com/api/tiktok/auth/callback` ✅ |
| Privacy disclosure | `setnayan.com/privacy` § "TikTok integration (Patiktok · iteration 0017)" ✅ |
| Disconnect flow | Coded in `lib/patiktok-tiktok.ts` ✅ |
| Lib source of truth | `apps/web/lib/patiktok-tiktok.ts` ✅ |

**What couples actually use the scopes for:**
- `user.info.basic`: read couple's TikTok open_id + display_name + avatar to confirm which account is connected
- `video.upload` + `video.publish`: post Patiktok booth compilation videos to the couple's TikTok handle automatically when the booth session ends

### Submission portal

https://developers.tiktok.com/apps → your app → "Submit for review"

### Field-by-field answers

| Field | Answer |
|---|---|
| App name | `Setnayan` (or `Setnayan Patiktok` if TikTok requires per-feature naming) |
| App icon | `setnayan-logo` 1024×1024 PNG |
| App description (short) | `Wedding photobooth that auto-posts compilation videos to TikTok` |
| App description (long) | *"Setnayan is a Filipino wedding-planning platform. The Patiktok feature is a wedding photobooth — guests record short clips during the event, Setnayan compiles them into a wedding TikTok video, and the video posts to the couple's TikTok account automatically. The couple opts in by purchasing the Patiktok Personal tier (₱1,999/day) and connecting their TikTok account via OAuth."* |
| Privacy policy URL | `https://www.setnayan.com/privacy` |
| Terms of service URL | `https://www.setnayan.com/terms` |
| Scopes requested | `user.info.basic` · `video.upload` · `video.publish` |
| Scope justification — `user.info.basic` | *"We display the connected TikTok account name + avatar to the couple so they can confirm the correct handle is connected before booth events go live. We do not read followers, drafts, messages, or any other account data."* |
| Scope justification — `video.upload` + `video.publish` | *"At the end of each booth session at a wedding, Setnayan compiles the guest-recorded clips into a single TikTok video and uploads + publishes it to the couple's account on their behalf. The couple authorized this when they connected their account and purchased the Patiktok SKU."* |

### Demo video script (target 120 seconds)

```
[0:00–0:10] Opening title: "Setnayan — TikTok integration demo for verification review. Iteration 0017 Patiktok."
[0:10–0:30] Show https://www.setnayan.com → Patiktok add-on page. Voice: "Patiktok is a wedding photobooth that compiles guest-recorded clips into a TikTok video and posts it to the couple's TikTok account."
[0:30–0:55] Show the couple purchasing the Patiktok Personal tier (₱1,999/day). Voice: "Couples opt in by purchasing the Patiktok Personal SKU. After purchase they're prompted to connect TikTok."
[0:55–1:25] Click Connect TikTok → TikTok OAuth consent screen appears. Voice: "TikTok's consent screen shows the three scopes: user.info.basic for showing which account is connected; video.upload + video.publish for posting compilation videos."
[1:25–1:50] After consent, show the couple's TikTok display name + avatar appearing in Patiktok setup. Voice: "Setnayan reads only basic profile info to confirm the right account is connected."
[1:50–2:20] Show a wedding photobooth simulation — guest clips compiled, video posted to TikTok. Voice: "When the booth session ends, Setnayan compiles clips into a single TikTok video and posts to the couple's account."
[2:20–2:35] Show disconnect flow + post-disconnect state. Voice: "Disconnect at any time from Setnayan; or revoke from TikTok app settings."
[2:35] End card: "Privacy policy: setnayan.com/privacy."
```

### Common TikTok rejection reasons + how to avoid

| Rejection reason | Mitigation |
|---|---|
| "We need to see actual video upload working" | Demo must show a real compilation upload to a test TikTok account (script does this) |
| "Why both video.upload AND video.publish?" | Upload alone leaves video in drafts; publish is required for the auto-post UX described |
| "Brand assets inconsistent" | Use exact same logo + name on TikTok portal + product surfaces |

---

## Tracking

After each submission:

| Integration | Submitted on | Reviewer feedback | Approved on |
|---|---|---|---|
| Google Drive (Photo Delivery + Papic) | _____ | _____ | _____ |
| YouTube (Panood) | _____ | _____ | _____ |
| TikTok (Patiktok) | _____ | _____ | _____ |

Update `App_Build_Status.md` rows for 0009, 0011, 0017 when each approval lands. The Hiring Predictive Guide will surface no signals for these directly — they're owner-action items, not in-app metrics.

---

## Cross-references

- Privacy disclosures: `apps/web/app/privacy/page.tsx` (3 sections, all shipped)
- Google Drive lib: `apps/web/lib/papic-drive.ts`
- YouTube lib: `apps/web/lib/panood-youtube.ts`
- TikTok lib: `apps/web/lib/patiktok-tiktok.ts`
- Iteration specs: `0009_photo_delivery`, `0011_panood`, `0012_papic`, `0017_patiktok`
- App_Build_Status rows: 0009 (Drive), 0011 (YouTube), 0017 (TikTok)
- API_Integration_Checklist § 9 owner actions

## Decision log

- **2026-05-20 — Runbook drafted.** Consolidates the 3 verified-app submissions into a single owner-facing playbook. All engineering-side prep is COMPLETE; only the demo videos + submission forms remain (owner-side actions).
