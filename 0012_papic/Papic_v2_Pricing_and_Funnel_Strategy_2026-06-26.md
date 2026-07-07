# Papic v2 — Pricing, Funnel & "Better-than-Once" Strategy

> **Date:** 2026-06-26 · **Status:** Strategy agreed in principle · **Pricing:** ALL NUMBERS PROVISIONAL — final amounts are admin-catalog dials set in the holistic pricing pass (per `project_setnayan_pricing_holistic_review_later` + `project_setnayan_pricing_admin_managed`). Never hardcode prices in code.
>
> Reference competitor: **Once** (join.once.film) — 22 onboarding/capture screens reviewed 2026-06-26. Source-of-truth order still applies: live site → shipped code → live DB → this doc.
>
> ## 🔄 UPDATE 2026-07-08 — owner discussion decisions (supersede conflicting lines below)
> Full build map: [`Papic_Live_Build_Plan_2026-07-08.md`](Papic_Live_Build_Plan_2026-07-08.md). Deltas that override this doc's body:
> - **Kwento = ₱299 (whole-event flat), NOT ₱500.** The §"UPDATE 2026-06-26" line 12/14 "Kwento ₱500 — fully paid" is **not adopted** — the live ₱299 (set 2026-06-29) is canonical. The free-vs-paid question is settled: **paid ₱299**.
> - **Camera themes = 5 FIXED, Papic-specific looks** (Original · Film · Vintage · Cinematic · [5th TBD]). This **reverses** §5's "Look & feel driven by the couple's Mood Board palette, not fixed filters." Themes are fixed presets now; originals always saved.
> - **Capture = two gestures** (tap = photo · hold = video, ring fills to 5 s, release-early = shorter). Confirms §5's press/long-press; the old four-gesture model stays retired.
> - **Face tagging + blocking = strict OPT-IN** (RA 10173): guest must affirmatively approve tagging (clear faces only); same for blocking. Stronger than the "opt-out blur" framing.
> - **Live Photo Wall setup** asks wall resolution + photo count, then a **tile-layout picker** (several options).
> - **Gallery** adds **direct download + ZIP export.**
> - **Patiktok is NOT a Papic add-on** — it's its own thing (`0017_patiktok/`). Removed from §8's add-on list below.
>
> ## 🔄 UPDATE 2026-06-26 (later) — CAPS + NAMES + ADD-ON PRICES SHIPPED (PR7 · #2265)
> The funnel + model below are intact; these owner-set numbers supersede the body's provisional figures:
> - **Per-tier CAPS (replaces the single "~₱6,999 soft ceiling"):** **Papic Ltd** ₱30/cam/day caps at **₱6,000** (≈200 cams) · **Papic Unli** ₱100/cam/day caps at **₱10,000** (≈100 cams). Beyond the cap the tier price is FLAT (300 guests on Ltd = ₱6,000). Caps live in admin-adjustable `events.papic_ltd_cap_php` / `papic_unli_cap_php`.
> - **RENAME:** Roll → **Papic Ltd** · Unlimited → **Papic Unli** (display only; `service_code` + `tier` enum unchanged).
> - **Min order:** 5 Ltd = **₱150**.
> - **À-la-carte add-ons:** Thank You **₱1,500** · Stories **₱2,000** · Pabati (video guestbook) **₱500** · Camera Bridge **₱100/seat/day, max ₱2,000** (reverses the 2026-06-18 included-free). _PR8 build:_ Kwento **₱500 — FULLY PAID to unlock** (owner-confirmed; reverses the free lock) · Photo Wall **₱1,000** (+ livestream URL). **"Unlock all" = ₱15,000** — the max Papic unlock (Unli cap + every add-on; à-la-carte sum is now higher, so it's a cap/discount).
> - **Both ₱2,999 SKUs REMOVED** (`PAPIC_GUEST` + `PAPIC_SEATS` deactivated).
> - ⚠ **Kwento was FREE** in the body below (the free words-layer differentiator). The **₱500** price REVERSES that lock — owner-flagged, pending final confirm (fully paid vs free-basic + ₱500 premium).

---

## 1. The strategic reframe — why our version beats Once

Once charges by a confusing two-axis grid (participant tier × shots cap) **because it doesn't know the guest list.** We do. That single fact lets us delete their most awkward screen and turn it into our advantage.

- **The guest list IS the camera roster.** Every name the couple already entered becomes a Papic camera. No "buy up to 25 participants" paywall — cameras seed from data we hold, and invites can ride the existing RSVP/invite email.
- **One global "how much can everyone shoot" dial**, applied to all guests, instead of a grid.
- **Designated crew (old "5 Seats") becomes an optional unlimited overlay**, not a separate product.

### Service comparison (the "better service" case)

| | Once | **Papic** |
|---|---|---|
| Capture | Photos only | **Photos + 5-sec video clips** |
| Who shoots | Buy "participant tiers" | **Whole guest list — auto from your list** |
| Photo sorting | By who *took* it | **By who's *in* it — face-sorted** |
| Each guest gets | One shared pile | **Their own personal gallery** |
| Keepsake video | — | **Personal reel (video + music), auto-made** |
| Privacy | — | **Face blocking + RSVP consent (RA 10173)** |
| Where it lives | Their app, can expire | **Your wedding website, forever** |
| Your originals | Stuck in their cloud | **Your own Google Drive** |
| Story page | — | **Flows into your Alaala memory page** |
| Pay with | USD / foreign card | **Pesos, GCash / BDO** |
| Pricing | Flat per event (a grid) | **Per guest, auto-totaled (one number)** |

**Positioning decision (agreed):** *better service at a fair per-guest price* — NOT premium-above-Once everywhere. The feature gap is the premium; we don't put it in the price too. Per-guest pricing already makes us cheaper than Once for the volume market (sub-~250-guest weddings = most of PH) and naturally premium for big weddings where the budget exists.

---

## 2. The pricing model

> 💳 **All prices below are NET WEB prices** — what Setnayan keeps when a couple buys on setnayan.com. They **EXCLUDE Apple/Google's 15–30% in-app-purchase commission** (15% Small Business Program under ~$1M/yr, else 30%). Checkout is **web-only** (the native app is a Capacitor remote-URL shell with *no in-app digital purchase*), so the platform takes **0%** and ₱100 nets ₱100. Selling via IAP would net 15–30% less (e.g. ₱30 → ₱21 at 30%) — avoided by design. **Web processor = free choice** (PayMaya / PayMongo / GCash / cards / manual BDO-GCash) at ~0–3.5%, so ₱30 nets ~₱29. The **app *links OUT*** to web checkout (never embeds it — in-app digital checkout = forced Apple IAP). ⚠ iOS purchase-flow = **App Store review** territory; the 2025 US Epic ruling + EU DMA now permit commission-free external/web purchase links (viable in 2026). Papic may also qualify as a real-world **event service** (IAP-exempt) — worth a determination, but link-out works regardless.

**Face tagging + face blocking are INCLUDED FREE in every tier.** The intelligence (auto-sort → personal galleries + reels) is bundled, never a separate SKU — it's what makes Papic *Papic*, on for everyone. Face blocking is a privacy/opt-out right under RA 10173 and is **never paywalled** (it's also a differentiator — Once has no privacy feature at all).

### 2.1 Free tier — the FUNNEL (revised 2026-06-26)

> **Free — first 5 guests can shoot, 5 photos + 1 video each.** Face-sorting + personal reels ON. Upgrade to open Papic to the whole guest list.

- **"First 5 guests" = a funnel, NOT a wall.** It works for *every* wedding as a taste (the first 5 guests to join shoot freely), not only events under 5 guests. The cap is the **upgrade trigger**: when guest #6 scans the QR, the couple sees *"Papic is full at 5 free guests — open it to your whole wedding."*
- **Matches Once's headcount, beats it on product:** their free is *5 guests, photos only*; ours is *5 guests with video + face-sort + a real reel.*
- **Costs ~₱3/event** (5 guests × ~6 captures of R2 storage). Trivial.
- Both numbers (5 guests, 5+1 allowance) are dials — loosen for a bigger taste / tighten against cannibalization.

### 2.2 One price, PER CAMERA — "how many cameras?" is the only choice (clarified 2026-06-26)

There is **one pricing model: per camera.** "Seats vs Everyone" is **not two price structures — it's just how many cameras** the couple buys. Both deliver face-sorted galleries + reels to **every** guest; only *who holds a camera* differs.

| You want… | Cameras | Lowest paid order (5-camera minimum) |
|---|---|---|
| **A few (a crew / "Seats")** | pick **5** / 10 / 20 | **5 Roll = ₱150** · 5 Unlimited = ₱500 |
| **A camera per guest ("Everyone")** | = guest count | 100 Unlimited = ₱10,000 → **capped ₱6,999** |

**Minimum purchase = 5 cameras** (no peso floor) — so the lowest possible paid order is **₱150** (5 Roll @ ₱30) or **₱500** (5 Unlimited @ ₱100). This ties the minimum to the product unit and mirrors the **5 free cameras**: 5 free to taste → the smallest paid step is also 5. (If the entry ever feels too cheap, raise the *minimum count*, not a peso floor.)

> ⚠ **Correction 2026-06-26:** an earlier draft priced Seats separately at "~₱600/seat → ₱3,000" (a stray import of the retired flat "5 Seats ₱2,999" SKU). That **broke the per-camera model** — a camera can't be ₱50 in one mode and ₱600 in another. Resolved: **one per-camera rate** (₱30 roll / ₱100 unlimited, per camera/day), **5-camera minimum**. Never add a second per-camera price.

- **Receiving is universal** — every guest gets their own gallery + reel regardless of camera count; in a few-cameras setup they *receive* instead of *shoot*.
- The free taste (first 5 cameras) applies on top.
- **Mix & upgrade freely (per-camera tiers):** each camera carries its own tier, so a couple can put everyone on **Roll** and upgrade a few key shooters to **Unlimited**, and/or **add extra dedicated unlimited crew seats** (**₱100 each**, beyond the guest list). Works **mid-event** (apply-then-pay add-on, min 1 day). **Couple controls the bill** (no guest can run up the tab; guest-pays-own-upgrade is a future option). The event **cap ~₱6,999 applies to the combined total.** Everyone still *receives* everything regardless of the mix — tiers only change who *shoots* how much.
- **Upgrade = the price DIFFERENCE between tiers** (not a flat ₱70): Roll→Unlimited = **₱70** (₱100 − ₱30) · **Free→Unlimited = ₱100** (full — no ₱30 base was ever paid) · Free→Roll = ₱30. **⚠ Free cameras have NO ₱70 path** — letting a free camera reach Unlimited for ₱70 would be a backdoor that leaks the funnel; free cameras upgrade only at the honest full price.

### 2.2b The per-camera ladder, auto-totaled (Everyone mode)

When cameras = the guest list, pricing is **read straight off that list** — the couple never does math; the screen states the total (e.g. *"187 cameras × 1 day → ₱18,700 → capped ₱6,999"*). This auto-total is the structural edge Once can't copy.

Flat **per-camera/day rate** with a per-event cap:

| Tier | Rate | What you get |
|---|---|---|
| **Roll** | **₱30/camera/day** | 30 photos + 10 videos per camera, per day |
| **Unlimited** | **₱100/camera/day** | unlimited photos + videos, archived to the couple's Google Drive (Google One ~₱149/mo recommended for big weddings) |
| Soft ceiling | ~**₱6,999** per event | binds Unlimited from ~70 cameras / Roll from ~233 — so big "everyone" events land at ~₱6,999 (just above Once), while small/crew setups pay per camera |

**Unlimited = unlimited; capture never stops mid-event.** It's bounded by the couple's Drive (that's how it stays ₱0-storage for us — full-res lives in their Drive). If their Drive fills *during* the wedding, we hold the overflow on R2 and nudge a Google One upgrade — guests keep shooting, nothing is lost. The promise is *"unlimited shooting, archived to your Drive,"* NOT *"unlimited until your Drive fills."*

**Time dimension — the price is per guest × per day.** The "day" comes from the **capture window** (onboarding step 2: start → close date+time, default = wedding date). That window IS the billing period, auto-computed like the guest count (*"187 guests × 1 day → ₱X"*). Rules:
- A **"day" = a 24-hour block from the window start**, NOT a calendar date — a reception running 6 PM → 1 AM stays **1 day** (no midnight-crossing penalty).
- **1 day for virtually all weddings** (invisible); multi-day (destination / pre-nup-day + wedding-day) scales to 2–3 days.
- **Minimum 1 day — no hourly pro-rating.** A 4-hr reception and a 12-hr all-day both = 1 day; the **5-camera minimum** (₱150 Roll / ₱500 Unlimited) sets the smallest paid order.
- **Window close ends CAPTURE, never the DATA** (locked promise) — after the end time guests stop shooting, but galleries, reels, the Drive copy, and the website gallery persist forever.

Worked totals (1 day) vs Once (~₱6,160 flat, photos only):

| Cameras | Roll ₱30 | Unlimited ₱100 (cap ₱6,999) | Once |
|---|---|---|---|
| 30 | ₱900 | ₱3,000 | ₱6,160 |
| 50 | ₱1,500 | ₱5,000 | ₱6,160 |
| 70 | ₱2,100 | ₱6,999 (cap) | ₱6,160 |
| 100 | ₱3,000 | ₱6,999 (cap) | ₱6,160 |
| 200 | ₱6,000 | ₱6,999 (cap) | ₱6,160 |
| 300 | ₱6,999 (cap) | ₱6,999 (cap) | ₱6,160 |

**Roll = value, Unlimited = premium:** Roll (₱30/camera) stays well under Once across the whole range (a fat 30+10 roll each, plus video + face-sort). Unlimited (₱100/camera) is the premium upgrade — it passes Once at ~62 cameras and the **~₱6,999 cap** binds from ~70, so big "everyone-unlimited" events land just above Once while small/crew setups pay per camera.

### 2.3 The "matches-Once + Smart-Sorting add-on" lever (documented alternative, NOT the launch default)

Explored and kept in reserve: a **base tier at Once-parity (commodity capture/gallery) + a per-guest "Smart Sorting & Privacy" add-on** (face tagging + face blocking + personal galleries/reels — the intelligence layer, branded under **Setnayan AI**, never naming the tech). This is the most explicit way to monetize the moat and is **coherent with Setnayan's locked "tool = commodity / intelligence = paid" doctrine** ([[project_setnayan_free_vs_ai_boundary]]).

**Launch decision: go all-in (everything bundled in the paid per-guest tier) + the free funnel** — it's simpler/more understandable (one number). The add-on split stays documented as a future lever to monetize big-spenders without raising the base.

### 2.4 Video-vs-photo counting (resolved)

**Two simple counters — NOT a unified "shots" currency.** A guest sees *"10 photos + 2 videos left."* No conversion math. Reasons:
- A convertible "15 shots" forces guests to do math mid-party (the question "is that 15 photos or 5+1 video?" is itself the proof it confuses).
- It's how Papic is already built (shipped sampler = *8 photos + 2 clips*, two pools).
- A 5-sec clip is only **~2–3 photos** of storage (~10 MB vs ~4 MB) — a 10× "shot cost" would be artificial, not cost-justified.
- Stays consistent free → paid (paid tiers also use photo + clip pools).

---

## 3. Storage architecture — "no permanent full-res on us" (Drive-backed)

The only marginal cost is R2 storage; everything else (on-device face recognition, renders, egress) is ₱0. So:

- **Full-res originals → the couple's own Google Drive** (their forever archive). The trust story: *"we don't hold your memories hostage — they're in YOUR Drive."* Better than Once (trapped, can expire). **Drive default-ON for paid tiers**, framed as a benefit; **not a hard checkout gate** (forcing OAuth mid-purchase tanks conversion); degrades gracefully to R2 + pool backstop if skipped.
- **Keep featherweight compressed web copies on R2 (~₱30/event — rounding error)** so the permanent website gallery NEVER breaks if a couple disconnects Drive. We offload the expensive ~₱1,200 full-res tail, not the ₱30 that keeps the locked "lives on your website forever" promise bulletproof.
- **Transient hot copy during the event** for the live photo wall, real-time face-sorted galleries, and reel rendering (Drive can't serve those live).
- **Honest disclosure (UX-north-star):** big unlimited weddings exceed Google's free 15 GB → may need Google One (~₱149/mo). Surface via the existing `DriveSafetyPanel`. Never a hidden cost.

✅ **Owner sign-off RECEIVED 2026-06-26.** Drive default-on + permanent full-res archive in the couple's Drive is approved, on the strength of the compressed-copy safety net (the website never depends on Drive uptime) + honest 15GB→Google One disclosure.

---

## 4. §11 open-question resolutions (from the external PAPIC_SPEC.md)

Anchored to the decision log + shipped code (Explore audit 2026-06-26):

- **F-05 Face Block → SHIPPED.** Guest-set blur on every public/shared surface (live wall; flips `author_publicly_hidden` on Kwento). Couple's private gallery keeps the clear original. Rule: *blur public + stop public tagging; never delete; never hidden from the couple.*
- **F-09 Live Photo Wall → SHIPPED** as a venue-projection URL ("Salamisim"), moderation- + FaceBlock-gated, safe derivatives only. ⚠ Corpus spec Part 6 + root CLAUDE.md still list it under "NOT in V1" — **stale, needs correction** (code overtook spec).
- **F-10 Google Drive Sync → DECIDED (2026-06-17) + wired:** host-only, `drive.file` scope, continuous, additive (never a gate). Capture-pipeline upload branch still `TODO(0012)`.
- **F-16 Link to Editorial → DECIDED + shipped:** the *Alaala* `/our-story` showcase, dual-consent gated (`consent_to_public` AND `couple_approved_for_showcase`). NOT the 0038 blog/affiliate "Editorial" — disambiguate in the doc.
- **F-17 Thank you → DECIDED 2026-06-26: PAID ONLY.** F-17 = the paid 5-min `PAPIC_ADDON_THANK_YOU` produced video. **No free per-guest thank-you channel in V1** (the "gallery is live" email already covers post-event reach).
- **Clip-cost → separate pools** (see §2.4); the execution guide's "1 capture = 1 shot" is wrong for Setnayan.

---

## 4.5 Kwento — the words layer (FREE)

Kwento is Papic's third pillar (canonical spec Part 1, the *words layer*): a guest attaches a short text — a message, a story, a *chismis* — **anchored to a specific photo or clip**, telling the couple the moment they were too busy to live. Photos/clips are the *what*; Kwento is the *story behind it*.

- **Who & price:** any guest, **no shooting camera needed** (it's participation, like viewing + reels). **FREE, always** — paywalling a guest's message would be like charging for the guestbook. It enriches the free experience *and* feeds the editorial keepsake.
- **Where it surfaces:** (1) **inline** on the photo/clip in the gallery, and (2) on the couple's **editorial / Alaala page** as guest-authored columns (the wedding gazette — see `Editorial_Experience_Spec_2026-06-18.md`; "guest columns = Kwento fully realized," ~200–400 words, couple-approved).
- **Gating (already partly shipped):** couple-approved before public; `consent_to_public` for the public editorial; **FaceBlock sync** — a guest who hides their face also hides their Kwento authorship (`author_publicly_hidden`, mig `20261227000100`); NSFW moderation. Same dual-consent gate as the Alaala orb clips.
- **Three surfaces + connection:** guest writes → couple approves/curates (feeds the editorial) → admin moderates abuse. Kwento → editorial/Alaala showcase.

---

## 5. UX / userflow (our version)

- **Onboarding: 5 steps, not Once's 6** (we delete the paywall screen). Name → Capture window → Reveal timing → Look & feel (driven by the couple's Mood Board palette, not Once's 3 fixed filters; keep "originals always saved") → **Cameras & allowance** (who shoots: guest list ✓ / + crew · the shots dial · visibility toggle · the load-bearing *"couple always receives every photo & clip full-quality"* note). → Create → confirm (share code + join URL on wedding domain) → Invite (QR + link + printable table card + "send with RSVP email").
- **Capture screen — our addition Once doesn't have:** press = photo / long-press = 5-sec clip with fill-ring + auto-stop + haptics (no competitor reference — design from scratch). Preview Mode badge, "N uploading" pill, face-sort silent in background.
- **Gallery — the differentiator:** "Your gallery" (face-sorted) ↔ "All photos", "Make my reel", per-tile capturer name, stats row, FaceBlock toggle. Host view = everything, always.
- **Host curation/moderation — swipe + buttons (2026-06-26):** the Review queue and bulk gallery triage support **Tinder-style swipe** (drag right = keep, left = remove, with the green "Keep" / red cue stamp) for fast one-thumb clearing of large galleries. **The Keep/Remove buttons are always retained** — swipe is a touch accelerator, never the only path: desktop has no swipe, keyboard/screen-reader users need the buttons (a11y), and the buttons keep the action discoverable. Rule: *swipe is the accelerator, buttons are the floor.*
- **Three-surface wiring:** admin (tiers in pricing catalog, moderation, sampler-abuse queue, storage-pool meter) · couple (buy → set dial → invite from list → host gallery + Drive copy) · guest (camera link with invite → shoot → own gallery + reel) · vendor (first-party "Setnayan Productions" listing, apply-then-pay, 0% commission).

---

## 6. Build prerequisite (before widening to "every guest gets a camera")

Per `feedback_setnayan_build_for_long_term`: **fix the Papic free-sampler storage leak first** — cap enforced at the record layer not the presign layer → orphaned R2 bytes, no R2 lifecycle/retention rule, weak anon rate limit. The R2-hot → Drive-archive → R2-keeps-compressed lifecycle (§3) *depends* on that lifecycle rule. Without it, "Unlimited" leaks full-res bytes forever. Fix → then widen.

---

## 7. Status & open items

**Decided 2026-06-26:** F-17 Thank-you = paid only (§4) · Drive default-on = signed off (§3) · storage-leak fix = agreed prerequisite (§6) · pricing is per guest **× per day**, day = 24-hr window block (§2.2).

**Remaining for the holistic pass:**
1. **Final price dials** — Roll ₱30/camera/day (30 photos + 10 videos), Unlimited ₱100/camera/day, free first-5-cameras/5+1, ~₱6,999 cap, **5-camera minimum** (lowest paid ₱150 Roll / ₱500 Unlimited). Face tagging + blocking + Kwento free in all tiers. All admin-catalog amounts.
2. **All-in vs add-on monetization** (§2.3) — launch all-in; revisit per-guest "Smart Sorting" add-on for big-spenders.
3. **Spec corrections** — Live Photo Wall "shipped" (not "NOT in V1"); browser-first framing now matches as-built; disambiguate Alaala-editorial from 0038-editorial.

---

## 8. Add-on features — GATED on active Papic · pricing DEFERRED to next session

**Owner rule (2026-06-26):** the Papic **add-on features are only available when Papic is active** for the event — they operate on Papic captures / the Papic event, so **Papic is the prerequisite gate**. **Their pricing is deferred to a future session, AFTER the core per-camera model is built and validated** ("make this work first").

The add-on layer to price next time (all gated on active Papic — confirm the exact set then):
- **Personal Reel templates** (the reel/template library)
- **SDE** (same-day-edit compilation) · **Thank You Video** (5-min — F-17 already PAID, price TBD) · **Guest Stories** (30s story maker)
- **Pabati** (short video greetings) · **Patiktok** (TikTok-style recordings)
- **Live Background** (LED wall + monogram) · **Live Venue Photo Wall** premium (base wall ships; premium TBD)
- **Camera Bridge** (DSLR → Papic pairing) · **High Res Archive** (yearly archive)

**Sequence:** build + validate the core per-camera Papic (incl. the §6 storage-leak fix) → **THEN** price the add-on layer.
