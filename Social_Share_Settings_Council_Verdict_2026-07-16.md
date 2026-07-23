# Social Share & Settings Council Verdict — 2026-07-16

> **What this answers (owner's question):** "Use the council to check which of all the user settings can be shared to social media, from Home → Vendor → Events. How can users maximize their accounts? Social media = link, FB, TikTok, IG, FB/IG Stories, etc. — whichever is compatible."
>
> **Method:** 5 parallel code auditors read the SHIPPED app at `origin/main` (commit `1864d7ac4`, PR #3286, worktree checkout on 2026-07-16), then a 4-seat council (Privacy/RA-10173 Counsel · Growth/Distribution · Brand/Product · Solo-Operator Feasibility) ruled on the audit. This doc is the chair's synthesis. **Everything below is grounded in shipped code, not spec aspiration.** Flag-off items are labelled.
>
> **Headline finding:** The premise "share settings to social media" is a category error the council corrected — **settings are not shareable objects; they are the GATES on sharing.** What actually shares to social are **finished artifacts** (invitation site, recap, editorial, guest story reel, vendor microsite). And the honest channel truth is a two-tier split: **FB / Messenger / X / Pinterest accept a URL; IG feed, IG/FB Stories, and TikTok do NOT accept web URLs — they need a rendered FILE asset** pushed through the mobile native share sheet. Setnayan today produces exactly **one** strong file-asset (the free Guest Story 9:16 reel) and a pile of URL-only share buttons.

---

## 1. Share Matrix — Home → Vendor → Events

Channel legend: **URL** = link / FB sharer / Messenger / Viber / X / Pinterest / copy-link (all accept a pasted or unfurled URL). **FILE** = IG feed, IG Stories, FB Stories, TikTok — reachable only via `navigator.share({files})` (mobile native sheet) or download-then-upload. Ruling: **FREE** (share as-is) · **GATED(x)** (share only behind gate x) · **NEVER** · **DORMANT** (built-but-no-doorway) · **FLAG-OFF**.

### HOME / account surface

| Surface / Item | Route / file | Shareable today? | Channels compatible | Gating setting(s) | Council ruling |
|---|---|---|---|---|---|
| Public user profile `/u/[slug]` | `app/u/[userSlug]/page.tsx` | Yes, but **no in-app doorway** (owner can't even find their own URL) | URL only; inherits **generic** brand OG card (no `/api/og/u`) | Visibility derived purely from per-event `landing_page_visibility` + event-type website surface — **no user-level public/hidden toggle exists** | **DORMANT → keep dormant** until (a) user public/hidden toggle, (b) slug-rename UI, (c) a report path all exist. Empty state leaks `display_name` for any enumerable slug = **fix the name/existence oracle first.** |
| User slug / vanity URL | `migration 20270424889744` (`users.slug`) — **no UI** | Partial | — | Auto-backfilled from real display name; **no claim/rename UI shipped** | **GATED — ship the slug editor first.** RLS already permits self-set. A name-derived permanent public identifier with no rename path is an RA-10173 defect. |
| Memories Hub → Photos "Share to Facebook" | `dashboard/(account)/library/_components/photos-tab.tsx` | Partial — **defective** | URL (FB sharer of one event's gallery) | Renders if ANY event has a slug — **does NOT check `landing_page_visibility`** | **GATED(effective-public) + FIX FIRST.** It can hand the user a share button for a private/404 link = a fake door. Require `resolveEffectiveVisibility==public` before rendering. |
| Memories Hub → Editorials tab | `library/_components/editorials-tab.tsx` | Partial | URL (view-page link) | Published + event not private | **GATED(published+public).** Fine; reword control "Share your story," not "View page." |
| Profile / Settings / Notifications / People / Setnayan AI / API keys | `dashboard/(account)/*` | No | — | Auth-gated private config | **NEVER** a share target. These **host the consent gates**; they are not shareable objects. |

### VENDOR surface

| Surface / Item | Route / file | Shareable today? | Channels compatible | Gating setting(s) | Council ruling |
|---|---|---|---|---|---|
| Vendor microsite `/v/[slug]` (aliased bare `/[slug]`) + Share button | `app/v/[slug]/page.tsx` + `_components/share-button.tsx` | Yes | URL only (`navigator.share({title,url})` + copy) — **no file, so IG/TikTok get nothing** | Admin-set `public_visibility ∈ {coming_soon, verified}` + `verification_state='verified'`. **Vendor has NO self-serve hide/show** — only submit/withdraw verification | **FREE (URL).** Business data, admin-gated. **#1 vendor growth gap = no FILE asset for IG/TikTok** (see §5). Build a dedicated vendor OG route (bare logo card is below bar). |
| Copy public link (My Shop / Website tab) | `vendor-dashboard/shop/page.tsx`, `website/page.tsx` | Yes | URL | Shown only when slug + `isPubliclyVisible` | **FREE.** Primary vendor self-share; correct. |
| Share a booked couple's **published recap** to vendor's FB Page | `vendor-dashboard/recaps/page.tsx` (reuses `realstories/share-buttons.tsx`) | Yes | URL (FB sharer, Pinterest, copy) | Double gate: couple published recap **+** intersect vendor's own booked events. (Solo-tier gate `canUseSoloBusinessTools` is **flag-dark** — `VENDOR_TIER_FEATURE_GATE=off`) | **GATED(couple-publish).** Clean amplification loop. Decide before flipping the tier gate whether to monetize-gate or open for distribution. |
| "Featured in Real Stories" (couple editorial) | `vendor-dashboard/real-stories/page.tsx` | Yes (empty till ~Dec 2026) | URL | RA-10173 showcase consent (`public_summary_consent_at`) + wedding + public slug + T+30d + own booked events | **GATED(showcase-consent).** Correct; ready-but-empty. |
| Vendor Instagram connect | `vendor-dashboard/instagram-actions.ts` | **Inbound only** | — (imports IG→microsite; per-item `show_on_profile`) | Meta OAuth env present | **Not an outbound channel.** No "post to IG" anywhere vendor-side. |
| `show_prices_publicly=false` | `vendor_service_attributes` | Partial — **defective** | — | Collected in attributes form but **only used to skip the Details list** — packages with prices still render publicly | **NEVER share prices when flag=false, but code does.** Consent-integrity bug: honor the flag on `vendor_packages` rendering. |
| 3D Booth showcase `/v/[slug]/booth` | `app/v/[slug]/booth/page.tsx` | Flag-off | URL (copy/paste) | `NEXT_PUBLIC_PLAN3D_BOOTH_SHOWCASE` + Pro/Enterprise + verified | **FLAG-OFF.** |

### EVENTS surface (couple / host side)

| Surface / Item | Route / file | Shareable today? | Channels compatible | Gating setting(s) | Council ruling |
|---|---|---|---|---|---|
| Public invitation / wedding site `/[slug]`, `/u/[user]/[event]` | `app/[slug]/page.tsx` | Yes once public — **no in-page share button** (couple copies URL) | URL; OG card (monogram or `realstory-slug`) | `landing_page_visibility` (NULL→**private**, fail-safe); wedding flips public only on **Save-the-Date launch** (`std_launched_at`) or `scheduled_launch_at` | **GATED(visibility+STD-launch) → FREE(URL) once launched.** The one correctly-built master lever. Keep **UNBRANDED** (couple's aesthetic is sacred). |
| Recap page `/[slug]/recap` + ShareButtons + OG card | `app/[slug]/recap/page.tsx`, `/api/og/recap/[slug]` | Yes | URL (FB sharer, Pinterest, copy) | `canViewSlugEvent` + `event_recaps.status=published` | **FREE once published.** Couple's flagship URL loop, Setnayan-branded, brand-safe (wall-safe derivatives). Highest OG bar. ⚠ OG route skips the visibility check (see §6). |
| Editorial phase of couple site | `app/[slug]/_components/editorial/editorial-content.tsx` | Yes | URL (FB, Pinterest, copy) | Inherits `landing_page_visibility` | **FREE once published.** Credits booked vendors → seeds both marketplace sides from one share. |
| **Guest Story Maker** — free client-rendered 9:16 mp4 | `app/papic/me/[token]/_components/guest-story-maker.tsx` | **Yes** | **FILE** (`shareBlobToDevice` → native sheet → **IG Stories / TikTok / FB Stories / Messenger**) | Guest personal token; ≥ min tagged photos; Setnayan-owned music; client-side render | **FREE — the single strongest viral asset in the product.** GATE: must carry a subtle "made with Setnayan" end-card (it's a Setnayan render). Safe to amplify — consent-scoped to guest's own tagged photos. |
| Papic gallery photos + 5s clips — save/share | `save-photo-button.tsx`, `lib/save-to-device.ts` | Yes | **FILE** (native sheet with file → IG/TikTok) + download | Host/guest access gate | **GATED(geo-scrub) — BLOCKING.** File-share works, but **the outbound geo/EXIF strip the spec promises is NOT honored in code** (see §6 red line). Fix before promoting as a growth channel. |
| Save-the-Date (reveal + film) | `app/[slug]/_components/save-the-date.tsx` | No social share | `.ics` download only | The launch action itself flips the site public | **No exported video file** — it shares as the site URL, not an asset. |
| Guest invite link (`?invite=` → cookie) | `guests/invite/_components/invite-link.tsx` | Yes | URL (copy only) | Token **is the credential** — grants access to a private event | **FREE(copy-only). Never** surface in a public share intent/OG card — it's a bearer credential, not virality. Document "anyone with this link can view." |
| Referral link | `dashboard/[eventId]/refer/page.tsx` | Yes | URL (copy) | Personal referral code | **FREE.** Growth loop, no event PII. |
| Live Wall `/wall/[eventId]` | `app/wall/[eventId]/page.tsx` | No | — | `eventSkuActive(LIVE_WALL)`; wall-safe + FaceBlock fail-closed | No share button; screened derivatives only. |
| Panood / Live Studio links | `studio/panood/_components/copy-link.tsx` | Flag-off | URL (copy, when a real URL exists) | Orchestrator **not built in V1** — honestly states links "arrive with the streaming rollout" | **FLAG-OFF / not built.** `kasama` guest-watch route is prototype-only, not on `origin/main`. |
| Pabuya e-gifts `/[slug]/pabuya` | `app/[slug]/pabuya/page.tsx` | Flag-off | — | `PABUYA_PUBLIC_ROUTE_ENABLED` (off→404) + `canViewSlugEvent` | **FLAG-OFF.** When lit, exposes GCash/bank handles — require **explicit per-event money opt-in** on top of visibility (see §6). |

### Setnayan-OWNED social pipeline (cross-reference — NOT a user-to-own-account feature)

| Item | Route / file | State | Note |
|---|---|---|---|
| Auto-publish to **Setnayan's** FB Page / IG Business / TikTok Photo | `lib/social/{facebook,instagram,tiktok,flush,recap-post,governor}.ts` + `admin/studio/_surfaces/social-queue-surface.tsx` | **FLAG-OFF** (env-dark: `META_PAGE_ACCESS_TOKEN`, `IG_USER_ID`, TikTok token absent) | Posts to **Setnayan's** accounts, gated by `marketing_share_consents` (per-artifact, `first_names`|`anonymous`, event_date+7d). TikTok default = assisted-manual admin panel. **This is Setnayan's marketing channel, not the user's.** |
| Recap auto-post | `lib/social/recap-post.ts` | **FLAG-OFF, and a consent seam** | Fires on couple recap-publish with **NO `landing_page_visibility` check and NO separate opt-in** → a private-site couple gets composed into the public queue. **Unanimous red line** (see §6). |

---

## 2. Settings inventory ruling

Every user-facing setting the audit found, classified as **GATE** (controls what/whether something shares), **PRIVATE-ONLY** (never public, not a gate), or **DEFECT** (built but not honored / missing).

**Home / account (`dashboard/(account)/profile`):**
- `display_name` — **PUBLIC by construction** (H1 of `/u`, derives the slug). The only account field that is itself public.
- `users.slug` — **GATE + DEFECT**: the public identity, but no rename UI. Ship the editor.
- `public_greeting_opt_in` (default OFF) — **GATE**: consents Setnayan to post name-bearing birthday/anniversary greetings on its own FB/IG/TikTok.
- `marketing_opt_in` (default OFF) — **PRIVATE-ONLY**: marketing email consent, not social.
- `marketing_share_consents` (per-artifact: monogram / save_the_date / website / reel / led_design; `credit_mode` first_names|anonymous; revocable) — **GATE**: the compliant model for featuring on Setnayan's channels.
- Account face profile opt-in + "Forget my face everywhere" — **GATE, FLAG-OFF** (`NEXT_PUBLIC_ACCOUNT_FACE_PROFILE_ENABLED`, DPO-gated).
- `religion` / `civil_status` / `sex` / `birth_date` (stamp-on-change consent) — **PRIVATE-ONLY**, SPI; no public surface reads them.
- Data export (`/api/profile/export`), account deletion request/cancel — **PRIVATE-ONLY** (RA-10173 subject rights, self-download).
- Theme/Appearance, notification-preferences matrix, URL & Slug editor, user custom-domain UI — **NOT SHIPPED** despite spec (theme light-locked; slug auto-backfilled; custom-domain DB supports `owner_type='user'` but only vendors have UI).

**Event (`dashboard/[eventId]/website/privacy`):**
- `landing_page_visibility` (public / unlisted / private; NULL→private) — **THE master GATE.** Every event share routes through it. `canViewSlugEvent` is the reusable enforcement helper.
- `scheduled_launch_at` / `std_launched_at` — **GATE**: the launch act that flips a wedding public.
- `public_summary_consent_at` — **GATE**: Real Weddings showcase / `/realstories` index inclusion (distinct from own-page sharing).
- `schedule_blocks.is_public` (default true) — **GATE**: private blocks (vendor call-times) withheld from public run-of-show. Correct per-item gate.
- Guest gates: `guests.photo_consent` (default TRUE, couple-set), `faceblock_enabled`, `face_recognition_excluded`, `live_photo_wall_visibility`, and the **strongest gate in the codebase** — `papic_guest_captures.consent_to_public` **+** `couple_approved_for_showcase` **+** `moderation_state` triple gate. **This is the template every new share surface should copy.**
- `PABUYA_PUBLIC_ROUTE_ENABLED`, `NEXT_PUBLIC_DEPENDENT_PEOPLE` — **GATE, FLAG-OFF** (counsel-gated).

**Vendor:**
- `public_visibility` + `verification_state` — **GATE** (admin-set; no vendor self-serve hide/show).
- Microsite section toggles (Solo+), custom slug/domain (Pro), hybrid anonymity (`name_revealed_at`/`screen_name`/tier) — **GATE** on what the public page reveals.
- `logo_url` — public (doubles as OG image). `contact_email`/`contact_phone` — public only when bookable.
- `show_prices_publicly` — **DEFECT** (collected, not enforced).

**Admin (not user settings, cross-ref):** `social_publish_settings.*` (master autopublish + per-platform + recap-autopost) — Setnayan's own pipeline, all env-dark.

**The ruling in one line:** *No setting is itself a "shareable to social media" object. The shareable things are artifacts; the settings decide whether an artifact may leave.*

---

## 3. How users maximize their accounts (per-role playbook)

Concrete, using only what ships today or is one small build away.

**GUEST — highest leverage of anyone (and free):**
1. Attend an event → get auto-tagged (face/QR) → open `papic/me/[token]`.
2. Render the free **9:16 Guest Story reel** (Setnayan music, client-side).
3. Push it to **IG Stories / TikTok** via the phone's native share sheet.
Every guest is a zero-marginal-cost distributor whose post carries "made with Setnayan" + the couple's names to a wedding-age audience. *Maximize:* prompt the reel at peak emotion (day-of and T+24h when photos land); stamp a brand mark + the couple's public URL into the render so every Story is also a link back.

**COUPLE / HOST:**
1. **Launch the Save-the-Date** → site flips public → copy the `/[slug]` URL into Messenger/Viber/FB guest groups (copy-link is the intended high-reach path; there are no per-network buttons).
2. Post-event, **publish the Recap** → unlock the FB/Pinterest buttons + a rich OG card (a Setnayan-hosted target = inbound traffic).
3. **Publish the Editorial** that credits every booked vendor → one share seeds both marketplace sides.
4. **Opt into Real Stories** (`public_summary_consent_at`) for durable discovery on `/realstories`.
5. **Grant marketing-share consents** → Setnayan features your monogram/website/reel/LED on its own channels (free amplification, revocable, first-names-or-anonymous).
*The couple's own follower graph is the single largest untapped audience per event — today unlockable only as a URL; the missing piece is a story-sized recap asset (see §5).*

**VENDOR (recurring-revenue base):**
1. Keep the microsite **public + verified**; reach a **true-name tier** (Pro/Enterprise reveal the real business name day one).
2. **Copy the `/v/[slug]` link** into every quote, bio, and DM.
3. **Import Instagram** for an auto-synced portfolio (inbound).
4. When a booked couple publishes a **recap/editorial**, share it to your Page for consented social proof.
*Gap:* vendor share is **URL-only** today, which starves IG/TikTok — exactly where wedding vendors acquire. The story-sized "featured wedding" render (§5) is the #1 vendor unlock.

**CREATOR (approved "Adventure Chapter" model, NOT built):**
Build the Chapter on `/u/[slug]` → **embed** the finished edit (keeps their license/monetization, dodges the music/DMCA host trap) + let Setnayan host a **short owned-music teaser** ("made with Setnayan" hook) → make the Chapter page their share target across their existing platforms → attach the shoppable substrate (Papic gallery, itinerary, vendors) so followers convert into vendor leads (0% commission). Creators are FREE; their whole value is distribution.

**Cross-role flywheel:** one event → guest Stories (viral files) + couple Recap/Editorial (URL + vendor credit) + vendor amplification + creator Chapter. Every published artifact should (a) carry brand + a link back and (b) credit the other side of the marketplace — so one share seeds both supply and demand under 0% commission.

---

## 4. Channel compatibility cheat-sheet (the honest version)

| Channel | Accepts | Setnayan path today |
|---|---|---|
| **Copy link / Messenger / Viber / IG-DM** | URL (manual paste) | ✅ Everywhere (copy-link is the documented catch-all) |
| **Facebook** (feed) | URL + OG unfurl | ✅ `sharer.php` on recap/editorial/realstories/vendor-recaps; FB card in Library |
| **Pinterest** | URL + `media=` image | ✅ On the same ShareButtons |
| **X / Twitter** | URL + OG unfurl | ⚠ **No button anywhere** — but a pasted URL would unfurl fine via the existing OG cards |
| **Native share sheet (URL)** | URL | ✅ Vendor page, invite/claim/site-editor links |
| **IG feed** | **FILE** (image) | ⚠ Only via native sheet with a file — no IG button; only the guest reel + saved photos produce a file |
| **IG Stories / FB Stories** | **FILE** (image/video) via mobile sheet | ✅ **Only** the Guest Story reel + `save-to-device` photo/clip; ⚠ geo-leak gate |
| **TikTok** | **FILE** (video/photo) via sheet or download-upload | ✅ **Only** the Guest Story reel; ⚠ Patiktok reel MP4 is a **stub** (`please-replace-with-real-output.mp4`) |

**Bottom line:** on a mobile PWA, the OS share sheet is what reaches IG/TikTok/Stories — and it only works if you hand it a **file**. Setnayan makes exactly one strong file today (the guest reel). Everything else is a URL, which those three channels reject. **No per-user TikTok/IG/Meta API integration exists, and the council says never build one** — download-asset + native sheet is the ceiling for a solo operator.

---

## 5. Build gaps to unlock IG / TikTok / Stories (ranked, smallest-first)

1. **Wire the already-existing story/square OG formats to a user button.** `api/og/manifesto` already emits `?format=story` (1080×1920) and `?format=square` (1080×1080); the render pipeline (Remotion/FFmpeg) exists. **The only missing thing is a user-facing download/share button** on Recap and Editorial. Cheapest possible unlock — the asset capability is built.
2. **Vendor "featured wedding" story card.** A story-sized render (rides couple-consented recap/editorial content) that vendors can post to IG feed/Stories/TikTok. #1 growth gap for the recurring-revenue base. Decide: keep behind Solo tier (`VENDOR_TIER_FEATURE_GATE`) or open it.
3. **`navigator.share({files})` on the recap/editorial asset** (extend `save-to-device` `shareBlobToDevice` beyond the guest reel).
4. **"Made with Setnayan" watermark toggle** on Setnayan-rendered assets (reels, cards) — brand policy, not just code (see §7).
5. **Personalized OG routes** `/api/og/u` (personal profile) and a vendor OG route — the generic brand card is below the quality bar for a live personal/business share.
6. **`/u/[slug]` share doorway** — copy-link + share, **gated on ≥1 public chapter**, only after the slug editor + public/hidden toggle + report path land (see §6).

**Explicitly do NOT build:** per-user OAuth token storage + Graph/Content-API posting to a user's own accounts; auto-fan-out of galleries; cross-event auto-ZIP/auto-upload. Unbearable moderation/compliance load for a one-person op, and the native sheet already reaches those channels.

---

## 6. Red lines (unanimous NEVER-share)

1. **Geo/EXIF leak on outbound share — BLOCKING.** `CLAUDE.md` asserts "geo is stripped on outbound shares," but shipped code strips metadata only *incidentally* via AVIF photo derivatives *and only when they exist*. **Clip downloads always serve the original MP4 with GPS intact**, and photo derivative-misses fall back to the geo-bearing original. Sharing/saving any Papic clip (or a photo before its derivative renders) **leaks the venue's/home's exact lat-lng** to anyone downstream. A dedicated EXIF/geo scrub on the share+download path is mandatory **before any file-share surface is promoted for growth.** *(Fix hint: route downloads through `display_r2_key`, already metadata-stripped, or add a `sharp .rotate()` re-encode pass on zip/download.)*
2. **Recap auto-post consent seam.** The Setnayan-social recap pipeline fires on recap-publish with **no `landing_page_visibility` check and no separate opt-in** — a private-site couple gets their names+photo composed into Setnayan's public social queue. "I published a recap for my guests" is **not** consent to "Setnayan posts me on its own public FB/IG." Currently inert (creds env-dark). **Keep dispatch dark until an explicit per-event social-post consent (reuse `marketing_share_consents`) + a visibility check gate it.**
3. **Minors' SPI + religion never reach a public share path.** Both are correctly contained today (People layer flag-off/counsel-gated; religion stored-not-shared). Any feature that surfaces a child's birthdate/faith or a person's religion publicly without guardian/explicit consent is a hard stop.
4. **Pabuya money handles never inherit publicness silently.** GCash/bank identifiers require an **explicit per-event money-display opt-in** on top of the visibility gate before `PABUYA_PUBLIC_ROUTE_ENABLED` flips. Setnayan holds no money — leaking handles is pure downside.
5. **No name-derived permanent public slug with no rename path**, and **suppress `display_name` in the `/u` zero-public-event empty state** (today it's an account-existence + name oracle for any enumerable slug).
6. **No share button whose target may 404/deny/point at a private page** (the Library Photos first-slug bug) — a fake door burns the one moment the user chose to distribute.
7. **No share affordance on any surface lacking BOTH a report path AND an owner visibility toggle** — that's net-new moderation load with no kill switch. All new report targets route into the single existing `/admin/user-reports` queue (extend `target_type`, don't spin up a second surface).
8. **No auto-posting to a user's own social accounts via any API.** Every user-side share stays user-initiated (native sheet, copy, `sharer.php`).
9. **Never watermark the couple's bespoke invitation hero/monogram or downloaded Papic photos** — the couple's aesthetic is sacred (same principle that excludes guest sites from the reskin). Watermark **what Setnayan renders**, never what expresses the couple's/vendor's own taste.
10. **Profile photo, email, phone, birthday, religion, and guest lists never appear on any public share surface.**

---

## 7. Owner sign-offs needed

1. **Geo/EXIF scrub (BLOCKING).** Approve rewriting the outbound share/download path (`lib/save-to-device` consumers + `papic-derivatives`) with a mandatory geo+EXIF strip covering **both** photos (incl. derivative-miss fallback) **and** clips — reconciling code to the `CLAUDE.md` "geo stripped on outbound shares" claim before any file-share surface ships wider. *DPO-relevant. All four seats flagged this.*
2. **Recap auto-post consent model.** Gate the Setnayan-social recap pipeline on an explicit per-event social-post consent **and** on `landing_page_visibility`, before Meta/TikTok creds are ever armed.
3. **Story-sized render unlock (highest ROI).** Wire the already-existing `api/og ?format=story|square` into user-facing download/share buttons on Recap + Editorial, and extend to a vendor "featured wedding" story card. Confirm scope + the brand-stamp/URL-watermark policy on every exported asset.
4. **Watermark policy lock.** "Made with Setnayan" **ON** for Setnayan-rendered artifacts (story reels, recap/editorial/STD cards); **OFF** for the couple's invitation, downloaded photos, and vendor portfolio.
5. **`/u/[slug]` gating decision.** Confirm it stays dormant until (a) a user-level public/hidden toggle, (b) the slug claim/rename UI (RLS already permits self-set), and (c) a report path (`user_reports.target_type` needs a value) all exist; plus neutralize the empty-state name/existence oracle. Also decide whether the account-level profile is a promoted share target or stays per-event-derived.
6. **Vendor price-flag enforcement.** Honor `vendor_service_attributes.show_prices_publicly` on `vendor_packages` rendering (close the collected-but-ignored setting), and add Terms language making vendors warrant subject consent for faces in uploaded/IG-synced portfolio media.
7. **Library Photos FB-share fix.** Require `resolveEffectiveVisibility==public` before rendering the share card (stop offering a share affordance for possibly-private events); consider replacing the "share then re-upload to FB album" flow with clean native-share/copy.
8. **Raw invitation-page public share.** Decide whether `/[slug]` ever gets a frictionless public share button; if yes, adding an `event` value to `user_reports.target_type` + a public report entry point is a hard prerequisite.
9. **Creator Adventure Chapter.** Confirm the embed + short owned-music native teaser split and the "made with Setnayan" teaser branding (badge + comped-SKU sign-offs remain open from the 2026-07-15 creator-program verdict).
10. **`/privacy` notice reconciliation.** Close the known gaps (biometric face enrollment, geo capture, social auto-post, greetings) — the notice's omissions are themselves an RA-10173 transparency exposure and should land alongside these fixes.

---

## Seat-conflict resolutions (which seat won, and why)

- **`/u/[slug]` as a promoted share target:** Growth wanted a copy-link + share doorway *now* (dormant loop = zero shares). **Privacy, Brand, and Solo-Op won** — it stays dormant until slug-rename UI + public/hidden toggle + report path exist, because today it's an enumerable name/existence oracle with no kill switch. Growth's ask survives as a *sequenced* build (sign-off #5), not an immediate one.
- **Watermarking:** Growth wanted brand+URL stamped on every exported asset for reach. **Brand won the nuance** — watermark only Setnayan-rendered artifacts (reels/cards), never the couple's invitation or downloaded photos. Both agree on the guest reel end-card.
- **File-share promotion:** Growth ranked the story-asset unlock #1. **Solo-Op + Privacy imposed the ordering** — the geo/EXIF scrub is a *blocking prerequisite*; the asset loop is growth-positive but must not ship on leaky files. Not a conflict on direction, only on sequence (scrub first).
- **Vendor tier gate:** Growth flagged the open question (Solo-gate the vendor share tools or open them). Left as an explicit owner decision (sign-off #3), no seat overruled.
- **Everything else was unanimous** — settings are gates not share objects; the guest reel is the crown jewel; recap auto-post + minors/religion + Pabuya money + the two defective share buttons are hard lines.

---

*Provenance: council run `wf_1a7ff6d9-88e` (5 code auditors @ `origin/main 1864d7ac4` + 4 council seats). Chair synthesis completed manually after the automated chair step was interrupted by a model usage limit. All routes/files cited are from the shipped audit, not spec. Cross-references: [[project_setnayan_creator_program]], [[project_setnayan_privacy_reconciliation]], [[project_setnayan_data_retention]], [[project_setnayan_kasama_pabuya]], [[project_setnayan_public_url_scheme]].*
