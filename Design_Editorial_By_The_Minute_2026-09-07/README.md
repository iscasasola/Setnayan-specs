# The editorial, by the minute — design lock 2026-09-07

> **Prototypes are IN THIS FOLDER** — `prototypes/story.html` and `prototypes/story-maker.html`.
> Open them in a browser; every control works, offline, on any machine.
> (They are also published as Artifacts on the owner's claude.ai account, which does **not**
> travel to a new account — the files here are the durable copy.)
>
> **Full build documentation:** `00_BUILD_README.md` → `08_Build_Order.md` in this folder.
> **The build plan:** `09_SESSIONS_AND_PROMPTS_2026-09-09.md` — fifteen sessions, each with its
> ready-to-paste prompt, its model and effort, what it runs after, and the three owner answers
> that block three of them. **Nothing in this folder is built yet** (measured against
> `origin/main` `df0d78d16`, 2026-09-09).
> **Supersedes** the newspaper front-page layout of `02_Specifications/Editorial_Experience_Spec_2026-06-18.md`
> **for the public story surface only.** Everything that spec locks about CONTENT — the three
> voices, the locked close, the A3 keepsake, the edition number, "What We Made Together" — stands.
> What changes is the SPINE: the story is no longer a page of sections, it is a clock.

## The idea

Every gallery on the market is a grid, every video is a bar, every wedding page is a list of
sections. Nobody has put the photos, the words, the vendors, the room and the film on one axis:
**the clock of the event.** So the page IS the event. Everything is filed under the moment it
happened, and the reader moves through it the way it was lived.

Checked against: YouTube chapters + product shelf, live blogs (BBC/Guardian "as it happened"),
Polarsteps (auto-tracked trip → steps → private-live → printed book), Pic-Time Scenes,
The Knot Real Weddings, Spotify Wrapped share cards, scrollytelling (NYT/Pudding/SCMP).
None of them combines time-as-spine + per-moment vendor credit + the room lit by the minute +
colours from the host's own saved board.

## The six owner locks (2026-09-07)

1. **Grows privately, publishes once.** Three layers at one URL:
   - **the host's own layer** (date set, saved theme, team booked, prenup, save-the-date page,
     invitation page, 3D room, live broadcasts) — PUBLIC as it happens;
   - **the guests' layer** (Papic captures, Kwento, challenge answers, letters) — visible only to
     QR/seat holders and the host until publish;
   - **the edition** — published once, with RA 10173 consent, at the same URL; then it stays open
     for later chapters.
   *A written minute does not exist until the host writes it: nobody sees day-of chapters live.*
2. **Colours come from the host's saved mood board** (`sanitizeRolePalette(events.role_palette).reception`),
   neutral fallback when none is saved. Six light-stages derived from the swatches; every colour is
   contrast-corrected before use — a colour taken from a board is never trusted to be readable.
3. **Vendor tiers.** LISTED (free) = named at every minute they made, host's endorsement if given,
   bookable on Setnayan, story auto-collected on their portfolio. FEATURED (paid) = + a note to the
   host inside the story, their own day-of clips, Follow, outside links live, reach numbers.
   **Paying never changes WHETHER a vendor is credited, only how richly.** A `#1 match` is a credit,
   not a tier. Prices are never shown here — they live in `platform_retail_catalog_v2`.
4. **Minutes:** the host writes a few; **every bar on the dial opens**, with or without a write-up.
5. **A per-guest 9:16 share card** is in scope.
6. **Assigned seats exist only while the reception venue is in use.** Elsewhere on the day the lawn
   is in rows; on a day with no reception venue, and on a roaming event, there is no plan at all.

## Rulings added 2026-09-07 (owner, in session)

- **A person's day is exclusive to their own account.** There is NO name field, for anyone, ever.
  "Were you there?" resolves from the signed-in guest's own Papic link. Nobody can look anyone up.
  The public seating plan carries table numbers and photo-heat — never names.
- **The capture's minute is the shutter, not the upload.** Owner: *"when we get the photos and
  snippets, we know. but the guest does not need to know."* → read `captured_at` from the capture on
  ingest, silently; never ask the guest, never surface the mechanism to them.
- **Print-ready and social share are first-class.** Print → A3 keepsake broadsheet (front+back, QR
  returns to the living page) · PDF · A4 one-minute-per-page. Share → FB · Messenger · Pinterest ·
  link · the 9:16 story card.
- **The teaser for the next event is the BACK COVER, outside the locked close.** The edition still
  ends on the host's words then their song (spec §7 intact); "next in this chronicle" sits after the
  colophon, the way a series page sits after The End. Starting the next event from there links it:
  No. 2 opens with "Previously · No. 1" and inherits names, palette and guest list.
- **A guest cannot author a chapter** and does not need to: their voice arrives as photos and
  snippets. Chapters stay with the host and booked vendors, and appear only once the host includes
  them (`creator_chapters.host_included_at`).

## What the review changed (7 lenses · 101 raw → 45 merged → 39 confirmed + 11 gap findings)

**Blockers fixed:** the pre-publish views leaked the whole guests' layer (index, dial bar heights,
minute sheet, cover counts, Relive, the last word) — now every guest-made unit carries
`data-layer="guest"` and a stranger before publish receives none of it · every voice was named and
role-badged although the only shipped naming opt-in is for letters — every voice now declares its
source and its consent, and an unconsented parent quote becomes the host's retelling · the public
seating plan published 108 first names, searchable by anyone.

**Also fixed:** one film cannot span 2:38→9:47 PM (three broadcast sessions; timecode = clock −
went-live) · table attribution before the reception (a `BLOCKS` array mirroring
`event_schedule_blocks`, not a clock threshold) · edition number arrives WITH publish · "who tapped
them" → "how many reached them" · palette slot labels are the shipped `PALETTE_LIMITS.reception`
ones · the light crossfade passed through a ~1.05:1 illegible midpoint · derived palettes failed AA ·
dial labels squashed to 35% width on a phone · 1.3px bars unreachable · page sat at 65% opacity at
rest · focus never moved into either overlay · 44px tap floor · vendor card was one `<a href="#">`
wrapping three fake actions.

**Now covered:** the words follow the occasion (`event_type_profiles.terminology`), the solemn
register renders no Relive / challenges / anniversary / "tell me when it's live", the dial carries
one segment per calendar day (the despedida is Day 1, not a milestone), and a day with no reception
venue says so.

## Data requirements for the build

| Needed | Today | Action |
|---|---|---|
| capture minute = shutter | both Papic write paths default to `NOW()`; `papic_record_guest_capture` has no `p_captured_at`, and `papic-sink.ts` drops `CapturedFile.capturedAtMs` | carry the client value, validate server-side, following the existing `p_geo_*` pattern |
| live viewer figure | not stored anywhere | one nullable `panood_broadcasts.peak_concurrent_viewers`, filled from the controller's existing poll |
| vendor reach from a story | `vendor_profile_views(source)` exists; no story key | link `/v/{slug}?src=editorial&utm=story%3A{public_id}` via `VendorCreditChip` |
| free portfolio collection for non-weddings | `loadVendorFeaturedStories` still filters `.eq('event_type','wedding')` while the showcase was opened to every kind on 2026-08-15 | **the LISTED tier's headline promise is false today for a debut, reunion or wake** — remove the filter, gate on `editorialAllowsEventType` |
| per-layer visibility | `event_editorial.status` is one audience for the whole story | add a per-layer flag; guest layer maps to the `event` audience until `published` |
| broadcast sessions | one `watchFilmEmbedUrl`; `went_live_at` never written | `films: {embedUrl, startedAt, endedAt, title}[]` |
| multi-day axis | `events.event_end_date` exists but the editorial loader never selects it | select it; one segment per Manila calendar day |

## Open — owner's call, not engineering's

1. **Are aggregate counts and bar heights public before publish**, or QR-only? Defaulted to QR-only.
2. **Does the Kwento naming opt-in match the letters'?** The DPO ruled on guest columns; whether it
   extends to photo messages *was never put to them and is not decided*. Defaulted to yes.
3. **Does by-the-minute refuse the solemn register outright** (as the shipped recap does), or ship
   the quiet arm the prototype now demonstrates?
4. **Featured tier price** — not set here.
