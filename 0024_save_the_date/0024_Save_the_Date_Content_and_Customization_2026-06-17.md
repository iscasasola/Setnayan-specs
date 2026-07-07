# Save-the-Date — Content & Customization Spec (2026-06-17)

> **Owner-defined 2026-06-17.** The content schema + customization for **every** Save-the-Date website, and how the **content templates run together with the reveal templates** (veil / cathedral doors / envelopes). Companion to `0024_Veil_Reveal_Spec_2026-06-17.md` (veil reveal) and `0024_Reveal_Tuning_and_Door_Spec_2026-06-17.md` (rigid reveals). This is the **PR4 content-layer** spec.
>
> **⚠ VIDEO REINSTATED — owner-reversed 2026-06-18 (supersedes the "photos only" lines below in §2/§3/§4b/§4c/§5).** The media element is again a **choice: a photo gallery OR a couple-uploaded video** that plays as a **real-time, NSFW-screened "video island"** (the addendum `0024_ADDENDUM_envelope_open_experience_2026-06-14.md` §2/§6 — the video plays at its own clock, NOT scrubbed). Everywhere below that says "photos only / no video / video path removed", read it as **"photo gallery OR video"**.

> **✅ AS-BUILT 2026-06-19 (this supersedes the "Build pending" notes — the content layer + customization SHIPPED; see `DECISION_LOG.md` 2026-06-19).** Live on `origin/main` (PRs #1774→#1784, auto-merge):
> - **The content film** (PR4) plays the 7-beat spine (§3); flag default-on in prod (`?film=0` to disable). `save-the-date-film.tsx` + `lib/save-the-date-content.ts` (auto-fill resolver, §5).
> - **5-step builder** (supersedes §2's "3 picks" framing): **1 Background · 2 Content · 3 Video/Gallery · 4 Music · 5 Opening(reveal-last)**. The old standalone "Theme" step folded into Background as "Step 1 · Fonts & colours" (theme = fonts + text colours; Background sets the scene).
> - **Step-1 Background** (new vs §2): plain colour · 5 procedural paper styles · 10 realistic scenes · upload-your-own. `events.std_background` JSONB. Whole-image parallax (per-pixel depth deferred — owner infra).
> - **Background legibility** (new): Auto / Lighten / Darken — a veil PAIRED with the text tone, **measured Smart Auto** (per-scene luminance baked in `lib/std-backgrounds.ts`) + a **localized text scrim** so text reads while the photo stays vivid. `StdBackground.legibility`.
> - **Media = gallery OR video**: `events.std_media` JSONB; the video plays as a **locked real-time island** with sound; **NSFW-screened by a client-extracted poster frame** (`screenStdVideo`, fail-open→never-live) — the server never trusts a client `nsfw` value; admin override panel in `/admin/reveal-studio`.
> - **Music** (§5): SINGLE-SOURCE — the film reuses the couple's site song (`site_bg_music_*`); Step-4 has an inline song uploader + a "Play music" toggle. **No separate STD-music column** (a deliberate single-source decision — reversing it is open, owner's call).
> - **Monogram element** (§3): the film renders the couple's REAL mark (`monogram_uploaded_svg ?? monogram_custom_svg`), text-initials fallback.
> - **Orientation**: reveal is portrait/landscape-aware; a landscape video on a portrait phone shows a "tilt your phone" hint; a revealed veil survives a rotate.
>
> **STILL OPEN:** (1) ~~separate ceremony + reception venue beats~~ — **DONE 2026-06-19 (PR-M + PR-R):** the film has two venue beats, auto-filled from the finalized bookings; (2) the PREMIUM-opening **price** (₱1,499 à-la-carte live vs the ₱3,999 PRO unlock) = holistic pass; (3) single-source vs dedicated STD music = owner decision; (4) the standalone **"Our story" teaser beat was DROPPED 2026-06-19** (PR-R — not in the owner's 9-beat spine; `storyTeaser` still resolved but unrendered — owner to confirm re-add or strip).
>
> **⚠ FILM SPINE RE-LOCKED 2026-06-19 (owner) — now a fixed 9-beat spine; see §3.** The video plays **full screen on a play gesture** (not inline auto-play); the add-to-calendar is the **terminal** beat (shown after the video ends), no longer attached to the date card.

---

## 1. The model — a FREE content "film" + reveal "filters" on top (owner-ratified 2026-06-17)

The Save-the-Date is a **continuous, self-playing, scrubbable multi-slide "film"** — NOT a static page. It opens on the monogram and **auto-advances through the 9-beat spine (§3) to the last slide**; the guest can **pause (hold) · step (tap the left/right thirds)** — there is **no visible chrome** (no segment bars, no transport controls — owner 2026-06-19, "just the texts"), and the **music plays throughout** (auto-play + gesture scrub, owner-locked). The **video beat holds** until the guest presses play (→ full screen) or scrubs past. Prototyped this session via `show_widget` (v1 → v2 "recommended cut").

**FREE vs PREMIUM split (owner 2026-06-17 · re-affirmed + refined 2026-06-19):**
- **FREE = the content film** — the auto-built slide experience (part of the free 4-in-1 couple website). **The Save-the-Date itself stays free** (owner 2026-06-19, verbatim: _"Save the Date is still free but there are some features on the app that needs payment for storage and features."_).
- **PAID = the features that carry real cost (STORAGE) or are genuinely premium** — NOT a whole-STD paywall. The marginal cost of the platform is **R2 storage only** (memory [[project_setnayan_marginal_cost_model]]), so the paid line is drawn around **storage-heavy** features (an uploaded **video**, uploaded **photos/media**, uploaded music/background) plus the genuinely-premium **cinematic reveals** (the existing `STD_PREMIUM_OPENINGS` ₱1,499 unlock). Zero-marginal-cost touches (texts, logo, plain/paper backgrounds, preset realistic backgrounds, fonts, falling petals) stay **free**.
- ⚠ **The exact per-feature paid boundary + amounts are PRICING → the holistic pricing pass** (all prices PROVISIONAL; [[feedback_setnayan_pricing_holistic_review_later]]). Owner **rejected** the strict "free = texts + logo + plain bg only" reversal (it would have gutted the free 4-in-1-website pillar, [[project_setnayan_pricing_tiers]]). **No speculative gating built 2026-06-19** — the existing model (free content film + paid cinematic openings) already embodies the principle; the storage-feature charge (video/photos) gets pinned in the pricing pass.
- Architecturally this needs **no rework**: `RevealOverlay` is already an overlay layer over the page content, so "reveal filter on top of the free film" is the existing structure. The reveals are built; **the content film is the PR4 build.** A single per-event unlock (`STD_PREMIUM_OPENINGS`, query-based via `eventOwnsSku`/`eventSkuActive`, no migration) is the natural carrier if/when the storage features are gated — expand its meaning rather than minting new SKUs.

So the run-as-one-experience flow is: **(premium) reveal filter plays → lifts → (free) content film auto-plays to the last slide.** Without a reveal filter, the free film just opens on its monogram slide directly. The couple picks the content (auto-filled, §5) + optionally a reveal filter + the 3 customizations (§2).

**Etiquette-validated (web research 2026-06-17 — The Knot / Zola / WeddingWire / With Joy / Mindy Weiss):** the spine hits the 4 universal essentials (names · date · location · "formal invitation to follow") and uses the STD as the "personality preview." Two notes: slide 2 should use **save-the-date wording** ("X & Y are getting married"), NOT invitation wording ("cordially invited" — that's the formal invitation's line; template-dependent); and full ceremony/reception **venues** exceed paper-card etiquette (city-only) but are justified here because it's **digital + PH/travel-heavy** and the formal invitation still owns exact address/time/RSVP (slide 6 defers "further details").

---

## 2. Couple-customizable — the builder is a SHORT screen (owner-refined 2026-06-17)

Everything physics/timing/sizes/lighting/fold stays **author-time baked house defaults** ("set what I like"). Of the rest, **most auto-fills** (§5) and **colours auto-inherit** — so the couple's *active* surface is just **3 picks**:

1. **Template** — the design/look, **matched to their wedding theme** (cohesive with the rest of the wedding).
2. **Photos** — the couple uploads their engagement / pre-wedding photos. **No video upload option** (owner 2026-06-18 — photos only; video path removed from scope).
3. **Song** — their **Pakanta** track (auto) **or an explicit "Upload your song" manual button.**

…plus the optional premium **reveal filter** choice.

**⚠ Colours auto-inherit from the Mood Board for the THEME — but the VEIL has explicit couple controls (owner-reversed 2026-06-18).** The STD **theme colours auto-inherit from the FINALIZED Mood Board** (single source — `site-palette.ts` derives them from `role_palette`); the white logo stays white. **For the veil specifically, the couple's controls are exactly four: `Add music` · `Add petals` · `Veil colour` · `Petal colour`.** The two colour pickers **override** the Mood-Board-derived veil/petal colours (null = inherit; a "Reset" link returns to the palette). The **admin Reveal Studio** still owns the veil LOOK (folds / weight / wind / lighting). _Stored in_ `events.std_reveal_effects` _(JSONB)_ `{butterflies, petals, music, veilColor, petalColor}`. _Side effect:_ a **finalized Mood Board is a STD readiness gate** (provides the inherit defaults). Their **monogram** comes from the Cipher/Monogram studio (auto). _(This supersedes the prior "colours are NOT a separate picker" line for the veil.)_

---

## 3. The film spine — a fixed 9-beat sequence (owner-locked 2026-06-19)

The film auto-advances through these beats; each is **shown only when its data resolves** (no date → beat 3 skipped; one venue → one venue beat; no video + no photos → beat 8 skipped). Verbatim owner spine:

1. **Monogram / logo** — precedence (owner 2026-06-19): **uploaded mark → monogram-lab/Cipher mark → the onboarding lockup → initials.** The default is the couple's **onboarding lockup** (the bar/duo/script/infinity/framed/circle mark they designed at onboarding, rendered via the canonical `HeroMonogram`); an explicit **upload or monogram-lab** mark **bypasses** it. The same object the reveal uses.
2. **Names** — "Together with their families · {Couple} · are getting married" (save-the-date wording, not invitation wording)
3. **Wedding date** — the date card; **no calendar CTA here** (moved to the terminal beat 9)
4. **Ceremony venue** — "We'll exchange our vows at **{ceremonyVenue}**" (auto-filled from the finalized ceremony booking)
5. **Reception venue** — "And we'll celebrate together at **{receptionVenue}** · {city}" (auto-filled from the finalized reception booking)
6. **Sentiment** — "We can't wait to celebrate with you"
7. **Formal invitation to follow** — "Arrives **{launchLabel}**" (auto = 3 months before the wedding; manual override)
8. **The media beat** — the couple's **video** (a play button → **full screen on top of everything**, plays with sound, music ducked; on its natural end the film advances to beat 9) **OR** the **photo gallery** (auto-advances after a glance). The beat holds until played or scrubbed past.
9. **Add to calendar** — the **terminal** beat (shown once the video ends): monogram + date + the calendar button (the .ics / Google link carries both the wedding date and the invitation-launch reminder).

_Builder inputs that feed the spine_ (§2/§5): the **monogram** (Cipher/Monogram studio, auto) · **names + date** (onboarding, auto/locked) · **ceremony + reception venues** (finalized bookings, auto + manual fallback) · the **media** (a photo gallery OR an uploaded video — NSFW-screened) · the **song** (Pakanta auto or an explicit upload) · the optional premium **reveal filter**.

_(The standalone "Our story" teaser beat was **dropped 2026-06-19** — not in the spine; `storyTeaser` is still resolved in `save-the-date-content.ts` but unrendered, pending an owner call to re-add or strip.)_

---

## 4. Petal timing

**Petals start falling when the veil is UP (revealed) and continue** — there are no petals during the covered state; the reveal triggers the shower and it keeps going. (Implemented by gating the petal system on the reveal/lift state.) Petal colour is couple-customizable (§2).

---

## 4b. Orientation & video display (owner 2026-06-17)

**The REVEAL is orientation-LOCKED.** During the reveal (any template — veil / doors / envelope), the orientation does **not** change even if the phone is tilted: **portrait on mobile · landscape on desktop.** Tilting is ignored until the reveal completes — the reveal stays composed for its locked orientation.
- *Port:* lock via the Screen Orientation API (`screen.orientation.lock('portrait')`) where supported (Android Chrome, needs fullscreen). On browsers without it (notably **iOS Safari**), render the reveal in a **portrait-composed stage that ignores orientation/resize during the reveal** — the stage stays portrait-proportioned (letterboxed if the device is held landscape) so the reveal looks the same regardless of tilt. Desktop = landscape stage. Release the lock when the reveal finishes.

**Content phase (AFTER the reveal):** the orientation lock is **released after the reveal**. The content film with photos is portrait-first on mobile and fills the stage; no landscape-tilt hint needed (photos only, no video).

---

## 4c. Playback & add-to-calendar (owner 2026-06-17)

**The film auto-plays FULLSCREEN, then ends → an add-to-calendar request.**
- **Browser-gesture constraint (handled):** autoplay-with-audio AND the Fullscreen API both require a **user gesture** (anti-spam). The **reveal-lift tap IS that gesture** → flow: *land → tap to lift the reveal → unlocks fullscreen + sound → the film auto-plays immersively with their song → ends → calendar prompt.* iOS Safari only true-fullscreens `<video>` elements, so for the slide-film "fullscreen" = an **immersive full-viewport stage** (CSS `fixed inset-0`, fill the screen); use the real Fullscreen API where supported (Android Chrome, desktop). The media is **photos only** — the gallery fills the stage at the closing slide.
- **Add-to-calendar lives at the END of the film** (uninterrupted playback, then the CTA — supersedes a mid-film button).

**Multiple calendar events (yes — one `.ics` holds multiple VEVENTs / one tap adds both):**
1. **Wedding date** — primary ("X & Y's wedding"); the save-the-date's whole job.
2. **Invitation launch date** — secondary ("remind me when the invitation arrives") — primes guests for the formal invite; ties to content slide 6 ("further details on the formal invitation").

End-of-film CTA sheet = **[Add wedding to my calendar]** (primary) + **[Remind me when the invite arrives]** (optional) + the **see-details/website** link.

**New builder field implied:** the **invitation launch date** ("when will you send your formal invitation?") — optional/estimable; feeds the 2nd reminder. (Wedding date stays auto-filled.)

---

## 5. Data — AUTO-GENERATE on lock + manual override (owner-ratified 2026-06-17)

**The free Save-the-Date auto-assembles itself from data the platform already has — the couple is NOT handed a blank 7-field form.** It pre-fills, and asks only for what's genuinely missing.

| Element | Auto-source (pre-filled) | Manual? |
|---|---|---|
| Animated monogram | Cipher/Monogram studio object (shared with the reveal) | no — auto |
| Names | `events` / onboarding | no — auto |
| Finalized date | `events` (once locked) — **this is the TRIGGER** | no — auto |
| Ceremony venue | **populated on ceremony venue-booking LOCK** | confirm / add if not booked via Setnayan |
| Reception venue | **populated on reception venue-booking LOCK** | confirm / add if not booked via Setnayan |
| Music | the couple's **Pakanta** song (library-saved backing track) | else pick / upload |
| Photos | **Papic** photos (if taken) | the one real new asset — couple uploads engagement / pre-wedding photos |

- **Trigger:** the Save-the-Date **unlocks once the date is FINALIZED** (reuses the date-as-output idea — "your date's set, now send your save-the-date"). Venue fields fill **upon venue-booking lock**; **manual upload is the override** for any gap (e.g. a venue booked off-platform).
- **The media is photos only (owner 2026-06-18 — video upload path removed).** The couple uploads their engagement or pre-wedding photos. No auto-composed video, no video upload toggle. (Reuse `events.love_story` — never re-interview; see memory `project_setnayan_love_story_single_source`.)
- **Add the Save-the-Date-specific fields/columns:** ceremony + reception venue (split, with the booking-lock link), the STD media (auto-composed or uploaded), the music choice (Pakanta vs upload), the chosen **reveal filter**, and the customization (`background`, `veil_colour`, `petals_colour`).
- **Functional additions (the "best" cut, this session):** a one-tap **Add to calendar** (it *is* a save-the-date — the highest-value digital affordance) + a **"see wedding details/website"** link on the "invitation to follow" beat (the etiquette-approved gateway to RSVP/registry/travel later).
- Reveal stays flag/`?reveal=`-gated until the **per-event template chooser** ships.

---

## 6. Builder UX — inline edit + single save (owner-confirmed 2026-06-18)

**Any field is editable inline on the page — there is no "edit this field" modal or per-field save.** The couple taps any element (name, date, venue, music, media) and edits it in place. One **Save** button (or autosave on navigation) commits all pending changes in a single write.

- No field-by-field save dialogs.
- No multi-step wizard for content editing (wizard is only the *first-time* setup guided by the unlock trigger).
- Every field starts pre-filled (§ 5); the couple only touches what needs changing.
- The single-save pattern is the same as the event website editor ("edit-on-the-page inline model" per `project_setnayan_website_effects_editing`).

**Implication for data layer:** the content form holds all 7 fields in local state; the save action writes them as a single upsert on `events` / the STD content table — no partial-save API calls per field.

---

## 7. Status

- **Reveals: design LOCKED** — veil (`0024_Veil_Reveal_Spec`), doors/envelopes (`0024_Reveal_Tuning_and_Door_Spec`).
- **Content layer (this doc): SPEC'd, pending build (PR4)** — the 7-element content + customization + the template chooser + single-save inline editor, running under the chosen reveal.
