# Root map — part 2 first run: Fields, one home, saved and used, landings, shown values (2026-10-02)

Generated from code by `pnpm --filter @setnayan/web root-map --report` (setnayan-platform, `apps/web/scripts/root-map.ts`). Owner rulings: DECISION_LOG 2026-10-02 "ONE MAP OF THE APP", "EVERY ANSWER ABOUT AN EVENT LIVES IN EVENT DETAILS — ONE HOME, MAPPED", "THE ROOT MAP ALSO CATCHES 'PRESSED BUT WENT TO THE WRONG PLACE' AND 'FILLED IN BUT NOT SAVED'", "…A NUMBER THAT LOOKS LIVE BUT IS TYPED IN", "TWO MORE THINGS EVERY BUILD IS CHECKED FOR" and "THE ROOT MAP IS A BACKEND THING". Part 1 (Screens · Doors) is in `UGAT_MAP_FIRST_RUN_2026-10-02.md`. Root map is the owner's name for the Ugat map; code keeps `lib/ugat`.

**What changed today:** every one of these checks now runs in CI on every pull request. Today's findings are written down as the starting list (the "baseline"), so CI is green today — and anything NEW of a kind marked "fails CI" below stops the build (the six the owner named: no way in, doors to nowhere, one home, filled-but-not-saved, typed-in numbers, and the same fact shown twice). The list can only get shorter.

## The numbers

| check | found today | a NEW one… |
|---|---|---|
| Screens with no way in | 23 | **fails CI** |
| Doors to nowhere | 1 | **fails CI** |
| Doors to a missing #section | 1 | **fails CI** |
| One fact, two homes | 0 | **fails CI** |
| Event answers outside Your info | 82 | **fails CI** |
| Filled in but not saved | 17 | **fails CI** |
| Numbers that look live but are typed in | 51 | **fails CI** |
| The same fact shown twice on one screen | 12 | **fails CI** |
| Saved but never used | 32 | warns |
| Sanitisers that drop keys | 3 | warns |
| Doors whose words do not match where they land | 134 | warns |
| Doors that still point at a forwarding stub | 110 | warns |

Screens mapped: 318 (admin is mapped separately). Actions mapped: 1234. Forms followed to their action: 725 of 865. Files that save something: 547.

## The Fields layer — what each screen reads and saves

Every screen from part 1 now carries the facts it READS (`table.column`, from its select lists), the facts it WRITES (from the save actions it can call — a column, a key inside a JSON column, or a database-function input), the actions themselves, and the numbers it CALCULATES. Every action carries each form field it reads and the column that field ends up in. Run `pnpm --filter @setnayan/web ugat:fields` to write the whole map to `apps/web/lib/ugat/fields.generated.json` (not committed — it is regenerated on every CI run, so it can never be out of date).

Numbers the map knows are calculations, not columns:

- **Days to go** = events.event_date − today (both midnights in the event’s timezone)
- **Guests coming** = count(guests where rsvp_status = attending) for the event
- **Guests with no reply** = count(guests where rsvp_status = pending) for the event
- **Still owing** = Σ(supplier totals + line items + own costs) − Σ(payments made), per lib/budget-truth.ts
- **Share of the plan locked in** = locked supplier categories ÷ lockable categories × 100 (lib/setnayan-ai-cockpit.ts)

**The home for event answers** is Event Details › Your info (`/dashboard/[eventId]/details` + `/dashboard/[eventId]/details/change`). Between them they read or save 59 columns of the event record.

## Screens with no way in — 23 (a new one fails CI)

Carried over from part 1: a page nobody can reach without typing its address. Now ratcheted.

- Everyone who will be there (/[slug]/everyone)
- Your seat pass (/[slug]/seat)
- Claim your profile (/claim/[token])
- Editorial PRO (/dashboard/[eventId]/studio/editorial-pro)
- Indoor Blueprint (/dashboard/[eventId]/studio/indoor-blueprint)
- Live Watch controller (/dashboard/[eventId]/studio/live-studio-control/setup)
- Your wedding playlist (/dashboard/[eventId]/studio/playlist)
- Thank-You Video · Studio (/dashboard/[eventId]/studio/thank-you)
- /demo-capture/[slug]
- /dev/booth-lab
- /dev/details-lab
- /dev/hero-lab
- /dev/home-lab
- /dev/schedule-lab
- Accept your invitation (/host/accept/[token])
- Create a Simple Event (/onboarding/simple)
- Live Watch demo (/panood/demo/[token])
- Papic live demo (/papic/demo/[token])
- Papic light check (/papic/lightcheck)
- /privacy/google-access
- /suppliers/[event]/[category]
- Add a vendor to your plan (/vendor-invite/[slug])
- Plan your wedding free (/waitlist)

## Doors to nowhere — 1 (a new one fails CI)

A link to an address no page answers.

- A link in lib/vendor-email-triggers.ts goes to /vendor-dashboard/settings/notifications, which no page answers.

## Doors to a missing #section — 1 (a new one fails CI)

The page exists, but the place on it the door points at (`#section`) is drawn nowhere in that page's code.

- A door in app/dashboard/(account)/profile/concierge/actions.ts goes to /help#concierge, but that page has no "concierge" section to land on.

## One fact, two homes — 0 (a new one fails CI)

One answer saved in two places, so the two can disagree: a table holding it both as a column and inside a JSON blob, an event column copied into another part of the event's record, or a copy in the browser. (Snapshots, ledgers and logs copy on purpose and are not counted.)

None today.

## Event answers outside Your info — 82 (a new one fails CI)

Owner, 2026-10-02: every answer about an event lives in Event Details › Your info, and no screen keeps its own copy. Each line is an event field a screen saves that Your info neither shows nor edits — either Your info gains a row for it, or it is not an "answer" (a design or system setting) and joins the reasoned exclusions in `lib/ugat/fields.ts`. The onboarding answers in `style_preferences.setup` are the owner's named case.

- `events.anchor_date` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.anchor_kind` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.ceremony_sub_type` — saved from Story Maker (/dashboard/[eventId]/story); Create a Simple Event (/onboarding/simple).
- `events.ceremony_venue_address` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.entourage_section_order` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dev/details-lab.
- `events.face_tagging_declined_by_couple` — saved from Papic (/dashboard/[eventId]/studio/papic).
- `events.gender_separation` — saved from /dashboard/[eventId].
- `events.is_mixed_ceremony` — saved from Story Maker (/dashboard/[eventId]/story); Create a Simple Event (/onboarding/simple).
- `events.is_primary` — saved from /dashboard/[eventId]; Story Maker (/dashboard/[eventId]/story); Create event (/dashboard/create-event); +1 more screens.
- `events.kwento_flash_auto_wall` — saved from Live Wall (/dashboard/[eventId]/live).
- `events.landing_page_hero_video_r2_key` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor; Living hero (/dashboard/[eventId]/website/living-hero); +1 more screens.
- `events.live_media_public` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor; Who can view your event page (/dashboard/[eventId]/website/privacy).
- `events.live_mode_override` — saved from Live Wall (/dashboard/[eventId]/live).
- `events.live_photo_wall_visibility` — saved from Live Wall (/dashboard/[eventId]/live); Papic (/dashboard/[eventId]/studio/papic).
- `events.live_studio_guest_pick_enabled` — saved from Live Watch controller (/panood/control/[eventId]).
- `events.mahr_description` — saved from /dashboard/[eventId].
- `events.monogram_cipher_config` — saved from /dashboard/[eventId]; Guests (/dashboard/[eventId]/guests); Event Hub Maker (/dashboard/[eventId]/launch); +3 more screens.
- `events.monogram_color` — saved from Guests (/dashboard/[eventId]/guests); Guest detail (/dashboard/[eventId]/guests/[guestId]); Requests (/dashboard/[eventId]/guests/claims); +5 more screens.
- `events.monogram_custom_svg` — saved from Monogram Maker (/dashboard/[eventId]/monogram).
- `events.monogram_font_key` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.monogram_frame_key` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.monogram_motion_key` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.monogram_studio_config` — saved from Monogram Maker (/dashboard/[eventId]/monogram).
- `events.monogram_style` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.monogram_uploaded_svg` — saved from Monogram Maker (/dashboard/[eventId]/monogram).
- `events.moodboard_style_family` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Mood Board (/dashboard/[eventId]/studio/mood-board).
- `events.moodboard_theme_description` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Mood Board (/dashboard/[eventId]/studio/mood-board).
- `events.moodboard_theme_name` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Story Maker (/dashboard/[eventId]/story); Mood Board (/dashboard/[eventId]/studio/mood-board).
- `events.our_photos` — saved from /dashboard/[eventId]; Guests (/dashboard/[eventId]/guests); Event Hub Maker (/dashboard/[eventId]/launch); +3 more screens.
- `events.pabuya_message` — saved from Pabuya · E-Gifts (/dashboard/[eventId]/pabuya).
- `events.pakanta_song_adopted_as_site_music` — saved from Music Maker (/dashboard/[eventId]/studio/pakanta).
- `events.panood_watch_url` — saved from Live Watch setup (/dashboard/[eventId]/studio/panood/setup); Live Watch controller (/panood/control/[eventId]).
- `events.panood_watch_url_facebook` — saved from Live Watch setup (/dashboard/[eventId]/studio/panood/setup); Live Watch controller (/panood/control/[eventId]).
- `events.papic_guest_capture_early` — saved from Papic (/dashboard/[eventId]/studio/papic).
- `events.papic_style` — saved from Papic (/dashboard/[eventId]/studio/papic); Papic Challenges (/dashboard/[eventId]/studio/papic/challenges); No crew cameras yet (/dashboard/[eventId]/studio/papic/crew); +1 more screens.
- `events.papic_uploads_open` — saved from Papic (/dashboard/[eventId]/studio/papic); Papic Challenges (/dashboard/[eventId]/studio/papic/challenges); No crew cameras yet (/dashboard/[eventId]/studio/papic/crew); +1 more screens.
- `events.papic_window_end` — saved from Papic (/dashboard/[eventId]/studio/papic); Papic Challenges (/dashboard/[eventId]/studio/papic/challenges); No crew cameras yet (/dashboard/[eventId]/studio/papic/crew); +1 more screens.
- `events.papic_window_start` — saved from Papic (/dashboard/[eventId]/studio/papic); Papic Challenges (/dashboard/[eventId]/studio/papic/challenges); No crew cameras yet (/dashboard/[eventId]/studio/papic/crew); +1 more screens.
- `events.photo_delivery_account_email` — saved from Photo Delivery (/dashboard/[eventId]/studio/photo-delivery).
- `events.photo_delivery_folder_name` — saved from Photo Delivery (/dashboard/[eventId]/studio/photo-delivery).
- `events.photo_delivery_provider` — saved from Photo Delivery (/dashboard/[eventId]/studio/photo-delivery).
- `events.photo_delivery_sync_mode` — saved from Photo Delivery (/dashboard/[eventId]/studio/photo-delivery).
- `events.photo_moments_config` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor; Camera cues (/dashboard/[eventId]/website/photo-moments).
- `events.pool_gallery_open` — saved from Papic (/dashboard/[eventId]/studio/papic).
- `events.print_details` — saved from /dashboard/[eventId]; Guests (/dashboard/[eventId]/guests); Guest detail (/dashboard/[eventId]/guests/[guestId]); +5 more screens.
- `events.reception_design` — saved from Event Hub Maker (/dashboard/[eventId]/launch); 3D Plan (/dashboard/[eventId]/plan3d); Seating chart (/dashboard/[eventId]/seating); +1 more screens.
- `events.role_names` — saved from Guests (/dashboard/[eventId]/guests).
- `events.rsvp_backdrop` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.rsvp_backdrop.intensity` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.rsvp_backdrop.theme` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.seating_autoplace_enabled` — saved from Event Hub Maker (/dashboard/[eventId]/launch); 3D Plan (/dashboard/[eventId]/plan3d); Seating chart (/dashboard/[eventId]/seating).
- `events.seating_group_adjacency` — saved from Event Hub Maker (/dashboard/[eventId]/launch); 3D Plan (/dashboard/[eventId]/plan3d); Seating chart (/dashboard/[eventId]/seating).
- `events.share_budget_band` — saved from Budget (/dashboard/[eventId]/budget); Thread (/dashboard/[eventId]/messages/[threadId]); Suppliers (/dashboard/[eventId]/vendors); +2 more screens.
- `events.site_art_direction` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.site_bg_color` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.site_bg_music_source` — saved from /dashboard/[eventId]; Guests (/dashboard/[eventId]/guests); Event Hub Maker (/dashboard/[eventId]/launch); +4 more screens.
- `events.site_button_color` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.site_magic_traveller` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.special_message` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Story Maker (/dashboard/[eventId]/story); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_background` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_film_accent_hex` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_film_date` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_film_story` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_film_venue_city` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_invitation_launch_date` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_media` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_media.type` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_reveal_effects` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_reveal_effects.music` — saved from /dashboard/[eventId]; Guests (/dashboard/[eventId]/guests); Event Hub Maker (/dashboard/[eventId]/launch); +2 more screens.
- `events.std_reveal_template` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.std_theme` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +1 more screens.
- `events.story_cover_kind` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.story_cover_ref` — saved from Story Maker (/dashboard/[eventId]/story).
- `events.style_preferences` — saved from /dashboard/[eventId]; Guests (/dashboard/[eventId]/guests); Event Hub Maker (/dashboard/[eventId]/launch); +2 more screens.
- `events.style_preferences.setup` — saved from Create a Simple Event (/onboarding/simple).
- `events.ticket_url` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor; Who can view your event page (/dashboard/[eventId]/website/privacy).
- `events.together_since` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor; Our Love Story (/dashboard/[eventId]/website/our-story); +1 more screens.
- `events.venue_address` — saved from Event Hub Maker (/dashboard/[eventId]/launch); Save the Date (/dashboard/[eventId]/studio/save-the-date); /dashboard/[eventId]/website/editor; +2 more screens.
- `events.wall_tile_layout` — saved from Live Wall (/dashboard/[eventId]/live); Papic (/dashboard/[eventId]/studio/papic).
- `events.wax_seal_config` — saved from Make your wax seal (/dashboard/[eventId]/studio/save-the-date/stamp).
- `events.website_open_browse` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.
- `events.what_to_bring` — saved from Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor.

## Filled in but not saved — 17 (a new one fails CI)

A person fills it in and the save throws it away: either the form sends a field the action never reads, or the action reads it and then neither saves it, uses it to find a row, passes it on, returns it, nor uses it to decide anything (what to save, or to turn the request away). A box that is only checked and then forgotten shows up here; one that is checked and enforced does not.

- A form in app/admin/studio/_surfaces/social-queue-surface.tsx sends "link_url", but createAnnouncement never reads it. On: `app/admin/studio/_surfaces/social-queue-surface.tsx`.
- A form in app/admin/studio/_surfaces/social-queue-surface.tsx sends "link_url", but saveEvergreenItem never reads it. On: `app/admin/studio/_surfaces/social-queue-surface.tsx`.
- A form in app/admin/studio/_surfaces/social-queue-surface.tsx sends "media_url", but createAnnouncement never reads it. On: `app/admin/studio/_surfaces/social-queue-surface.tsx`.
- A form in app/admin/studio/_surfaces/social-queue-surface.tsx sends "media_url", but saveEvergreenItem never reads it. On: `app/admin/studio/_surfaces/social-queue-surface.tsx`.
- A form in app/admin/studio/_surfaces/songs-surface.tsx sends "canonical_id", but deleteSongAction never reads it. On: `app/admin/studio/_surfaces/songs-surface.tsx`.
- A form in app/admin/studio/_surfaces/songs-surface.tsx sends "dup_id", but deleteSongAction never reads it. On: `app/admin/studio/_surfaces/songs-surface.tsx`.
- setFolderEventTypes reads the field "confirm_overwrite" and then does nothing with it — it is never saved. On: `app/admin/taxonomy/actions.ts`.
- setFolderEventTypes reads the field "scope_mode" and then does nothing with it — it is never saved. On: `app/admin/taxonomy/actions.ts`.
- createWeddingEvent reads the field "concierge_choice" and then does nothing with it — it is never saved. On: /dashboard/[eventId]; Create event (/dashboard/create-event).
- updatePaxSettings reads the field "maker_quiet" and then does nothing with it — it is never saved. On: Event settings (/dashboard/[eventId]/details/change); Setnayan AI (/dashboard/[eventId]/studio/setnayan-ai); Filipino wedding suppliers marketplace (/explore).
- updateGuest reads the field "groups_posted" and then does nothing with it — it is never saved. On: Guests (/dashboard/[eventId]/guests); Guest detail (/dashboard/[eventId]/guests/[guestId]); Event Hub Maker (/dashboard/[eventId]/launch).
- A form in app/dashboard/[eventId]/invitation/_components/guest-invite-modal.tsx sends "guest_id", but markGuestInvitationSent never reads it. On: Guests (/dashboard/[eventId]/guests); Guest detail (/dashboard/[eventId]/guests/[guestId]); Requests (/dashboard/[eventId]/guests/claims); +4 more screens.
- A form in app/dashboard/[eventId]/vendors/[vendorId]/workspace/page.tsx sends "business_name", but createAutoShareInviteAction never reads it. On: Event settings (/dashboard/[eventId]/details/change); Suppliers (/dashboard/[eventId]/vendors); Service workspace (/dashboard/[eventId]/vendors/[vendorId]/workspace); +1 more screens.
- A form in app/dashboard/[eventId]/vendors/[vendorId]/workspace/page.tsx sends "category", but createAutoShareInviteAction never reads it. On: Event settings (/dashboard/[eventId]/details/change); Suppliers (/dashboard/[eventId]/vendors); Service workspace (/dashboard/[eventId]/vendors/[vendorId]/workspace); +1 more screens.
- acknowledgeHandover reads the field "advance_status" and then does nothing with it — it is never saved. On: Event settings (/dashboard/[eventId]/details/change); Thread (/dashboard/[eventId]/messages/[threadId]); Suppliers (/dashboard/[eventId]/vendors); +3 more screens.
- A form in app/pay/[reference]/_components/pay-panel.tsx sends "amount_php", but submitPaymentProof never reads it. On: Pay (/pay/[reference]).
- postVendorReply reads the field "return_to" and then does nothing with it — it is never saved. On: Today (/vendor-dashboard); Reviews · Vendor (/vendor-dashboard/reviews).

## Numbers that look live but are typed in — 51 (a new one fails CI)

A number next to a unit (days · guests · pax · tables · seats · photos · couples · % · ₱) written into a screen's words instead of read from the event. Rule constants ("within 7 days", "0% commission", "₱0", "(8/10/12 seats)", "save 20%", the 28-day cycle) are allowed, each with its reason, in `RULE_CONSTANTS`. Marketing samples are listed so you can decide; demo, sample, tour and dev files are not scanned.

- "Among the top 10% of verified suppliers by completed weddings this …" — 10% is typed into the text, not read from the event. (app/(shell)/explore/_components/vendor-badge-row.tsx — on Filipino wedding suppliers marketplace (/explore))
- "Setnayan's pick of the month — top 5% by review score and volume." — 5% is typed into the text, not read from the event. (app/(shell)/explore/_components/vendor-badge-row.tsx — on Filipino wedding suppliers marketplace (/explore))
- "Plan free, add the magic as you go. Transparent PHP prices. Supplie…" — 0% is typed into the text, not read from the event. (app/(shell)/pricing/page.tsx — on Pricing (/pricing))
- "90 days" — 90 days is typed into the text, not read from the event. (app/(shell)/privacy/page.tsx — on Privacy policy (/privacy))
- "7 days" — 7 days is typed into the text, not read from the event. (app/(shell)/refunds/page.tsx — on Refund & cancellation policy (/refunds))
- "34 changes · 52%" — 52% is typed into the text, not read from the event. (app/admin/_components/what-you-change.tsx)
- "Optional but recommended for audit. Grants over ₱10,000 get flagged…" — ₱10,000 is typed into the text, not read from the event. (app/admin/accounts/_surfaces/users-surface.tsx)
- "Coverage could not be worked out — the expenses it divides were not…" — 0% is typed into the text, not read from the event. (app/admin/app-performance/_components/expenses.tsx)
- "± tolerance around a target, e.g. 0.15 = ±15%." — 15% is typed into the text, not read from the event. (app/admin/budget-planner/page.tsx)
- "10 seats included. Extra seats beyond the base 10 are billed." — 10 seats is typed into the text, not read from the event. (app/admin/custom-plans/_components/custom-composer.tsx)
- "300 photos included. Billed per +100-photo pack." — 300 photos is typed into the text, not read from the event. (app/admin/custom-plans/_components/custom-composer.tsx)
- "Verified: read permitted · 0 guests" — 0 guests is typed into the text, not read from the event. (app/admin/events/[eventId]/page.tsx)
- "e.g. ₱8,000 refunded via GCash on 2026-05-15 — ref 0123…" — ₱8,000 is typed into the text, not read from the event. (app/admin/force-majeure/[flagId]/page.tsx)
- "modelled ~8% · over # stills" — 8% is typed into the text, not read from the event. (app/admin/papic-storage/page.tsx)
- "BIR 0.5%" — 0.5% is typed into the text, not read from the event. (app/admin/payouts/page.tsx)
- "Stage 1 · 20%" — 20% is typed into the text, not read from the event. (app/admin/payouts/page.tsx)
- "Stage 2 · 60%" — 60% is typed into the text, not read from the event. (app/admin/payouts/page.tsx)
- "Stage 3 · 20%" — 20% is typed into the text, not read from the event. (app/admin/payouts/page.tsx)
- "Papic has its own separate saving, and its 10% floor does not apply…" — 10% is typed into the text, not read from the event. (app/admin/pricing/_components/ai-bands-editor.tsx)
- "₱1 a shot" — ₱1 is typed into the text, not read from the event. (app/admin/pricing/_components/papic-ladder-editor.tsx)
- "PH standard is 12%. Receipts already issued won't be re-rated." — 12% is typed into the text, not read from the event. (app/admin/settings/_surfaces/settings-surface.tsx)
- "and clears the 48-hour pull window. The content gate (event date + …" — 7 days is typed into the text, not read from the event. (app/admin/studio/_surfaces/social-queue-surface.tsx)
- "Consented + past the publish gate (event date + 7 days)." — 7 days is typed into the text, not read from the event. (app/admin/studio/_surfaces/social-queue-surface.tsx)
- "to move to the new date or unlock their service. They have 3 days t…" — 3 days is typed into the text, not read from the event. (app/dashboard/[eventId]/launch/_components/details-date-clash.tsx — on Event Hub Maker (/dashboard/[eventId]/launch); /dev/details-lab)
- "The ₱15,000 (or whatever you adjust it to) flows directly from you …" — ₱15,000 is typed into the text, not read from the event. (app/dashboard/[eventId]/manpower/page.tsx — on Manpower (/dashboard/[eventId]/manpower))
- "— laid out in a grid fanning from the stage; head & family tables l…" — 10 seats is typed into the text, not read from the event. (app/dashboard/[eventId]/seating/_components/seating-editor.tsx — on Event Hub Maker (/dashboard/[eventId]/launch); Seating chart (/dashboard/[eventId]/seating))
- "Showing the first 1,000 photos and snippets from the day." — 1,000 photos is typed into the text, not read from the event. (app/dashboard/[eventId]/story/_components/make-it-yours.tsx — on Story Maker (/dashboard/[eventId]/story))
- "Running low — under 10% of your pool remains." — 10% is typed into the text, not read from the event. (app/dashboard/[eventId]/studio/papic/_components/host-pool-meter-card.tsx — on Papic (/dashboard/[eventId]/studio/papic))
- "Battery handoff at 20%" — 20% is typed into the text, not read from the event. (app/dashboard/[eventId]/studio/papic/page.tsx — on Papic (/dashboard/[eventId]/studio/papic))
- "Pair a DSLR — ₱100 / seat / day" — ₱100 is typed into the text, not read from the event. (app/dashboard/[eventId]/studio/papic/page.tsx — on Papic (/dashboard/[eventId]/studio/papic))
- "0 photos" — 0 photos is typed into the text, not read from the event. (app/dashboard/[eventId]/website/editor/page.tsx — on Event Hub Maker (/dashboard/[eventId]/launch); /dashboard/[eventId]/website/editor)
- "284 days to go" — 284 days is typed into the text, not read from the event. (app/download/_download-motion.tsx — on Download Setnayan for Mac or Windows (/download))
- "0% while we launch — and we never hold a peso of yours." — 0% is typed into the text, not read from the event. (app/for-suppliers/_components/vendor-grow-sections.tsx — on /for-suppliers)
- "0%" — 0% is typed into the text, not read from the event. (app/for-suppliers/_components/vendor-grow-sections.tsx — on /for-suppliers)
- "Tap a start + end (≤30 days) — we lock the shared date inside it." — 30 days is typed into the text, not read from the event. (app/onboarding/_shared/date-calendar.tsx — on Plan your event (/onboarding/[type]); Plan your wedding (/onboarding/wedding))
- "−20% onboarding promo" — 20% is typed into the text, not read from the event. (app/onboarding/wedding/_components/onboarding-shell.tsx — on Plan your wedding (/onboarding/wedding))
- "₱30,000+ coordinator" — ₱30,000 is typed into the text, not read from the event. (app/onboarding/wedding/_components/onboarding-shell.tsx — on Plan your wedding (/onboarding/wedding))
- "3 guest seats to taste candid-capture tagging — every shot lands in…" — 3 guest is typed into the text, not read from the event. (app/onboarding/wedding/_components/onboarding-shell.tsx — on Plan your wedding (/onboarding/wedding))
- "Church, mosque, or temple — about 236,000 couples in 2023." — 236,000 couples is typed into the text, not read from the event. (app/onboarding/wedding/_components/welcome-moments.tsx — on Plan your wedding (/onboarding/wedding))
- "You've shared your 10 photo notes for this celebration — salamat!" — 10 photo is typed into the text, not read from the event. (app/papic/guest/_components/papic-guest-capture.tsx — on /[slug]; /papic/guest)
- "1 couple is waiting on this date." — 1 couple is typed into the text, not read from the event. (app/vendor-dashboard/calendar/[date]/page.tsx — on Day · Calendar · Vendor (/vendor-dashboard/calendar/[date]))
- "1 couple waiting" — 1 couple is typed into the text, not read from the event. (app/vendor-dashboard/calendar/surface.tsx — on Customers (/vendor-dashboard/customers))
- "3 photos" — 3 photos is typed into the text, not read from the event. (app/vendor-dashboard/clients/[eventId]/editorial-media/page.tsx — on Editorial media · Vendor (/vendor-dashboard/clients/[eventId]/editorial-media))
- "No portion rules yet — add your first below (e.g. "Rice — 0.2 kg pe…" — 10% is typed into the text, not read from the event. (app/vendor-dashboard/clients/[eventId]/production-sheet/page.tsx — on Production Sheet · Vendor (/vendor-dashboard/clients/[eventId]/production-sheet))
- "1 couple is asking about this date" — 1 couple is typed into the text, not read from the event. (app/vendor-dashboard/customers/_components/customers-calendar.tsx — on Customers (/vendor-dashboard/customers))
- "Setnayan doesn't touch the ₱15,000 — it flows direct from the host …" — ₱15,000 is typed into the text, not read from the event. (app/vendor-dashboard/manpower/surface.tsx — on Shop (/vendor-dashboard/shop))
- "Only you can see this — never the couple, never their guests. 1 Pap…" — 1 photo is typed into the text, not read from the event. (app/vendor-dashboard/on-the-day/live/[eventId]/_components/portfolio-album-section.tsx — on Papic capture · Event Hub (/vendor-dashboard/on-the-day/live/[eventId]/papic))
- "90% within" — 90% is typed into the text, not read from the event. (app/vendor-dashboard/performance/_components/inquiry-handling-card.tsx — on My Performance · Vendor (/vendor-dashboard/performance))
- "from ₱25,000 per event" — ₱25,000 is typed into the text, not read from the event. (app/vendor-dashboard/services/_components/canvas-maker.tsx — on Add a service (/vendor-dashboard/services/new); Add a service (/vendor-dashboard/services/new/[category]))
- "row to build a ladder — e.g. 12+ months ahead −15%, 6+ months −10%.…" — 15% is typed into the text, not read from the event. (app/vendor-dashboard/services/_components/service-list-editors.tsx — on /vendor-dashboard/services; Add a service (/vendor-dashboard/services/new); Add a service (/vendor-dashboard/services/new/[category]); +1 more screens)
- "Our Signature package is ₱85,000." — ₱85,000 is typed into the text, not read from the event. (app/vendor-dashboard/shop/_components/voice-match-card.tsx — on Shop (/vendor-dashboard/shop))

## The same fact shown twice on one screen — 12 (a new one fails CI)

One calculated fact worked out or drawn by two different parts of the same screen — the Home case, where the new first screen shipped on top of the old tiles ("replace means remove"). Home dedupe is in flight (PR #6278); when it lands, its lines here drop off.

- /[slug] — works out or draws "Days to go" in 2 places (app/[slug]/_components/editorial/post-event-scene-views-3.tsx, app/[slug]/_components/site-body.tsx) — one fact, shown once.
- /dashboard/[eventId] — works out or draws "Days to go" in 2 places (app/dashboard/[eventId]/_components/event-dashboard.tsx, app/dashboard/[eventId]/page.tsx) — one fact, shown once.
- /dashboard/[eventId] — works out or draws "Guests coming" in 3 places (app/dashboard/[eventId]/_components/event-dashboard.tsx, app/dashboard/[eventId]/_components/home-first-screen.tsx, app/dashboard/[eventId]/page.tsx) — one fact, shown once.
- /dashboard/[eventId] — works out or draws "Guests with no reply" in 3 places (app/dashboard/[eventId]/_components/event-dashboard.tsx, app/dashboard/[eventId]/_components/home-first-screen.tsx, app/dashboard/[eventId]/page.tsx) — one fact, shown once.
- /dashboard/[eventId] — works out or draws "Still owing" in 3 places (app/dashboard/[eventId]/_components/event-dashboard.tsx, app/dashboard/[eventId]/_components/home-first-screen.tsx, app/dashboard/[eventId]/page.tsx) — one fact, shown once.
- Guests (/dashboard/[eventId]/guests) — works out or draws "Guests coming" in 2 places (app/dashboard/[eventId]/guests/_components/roster-meters.tsx, app/dashboard/[eventId]/guests/page.tsx) — one fact, shown once.
- Guests (/dashboard/[eventId]/guests) — works out or draws "Guests with no reply" in 4 places (app/dashboard/[eventId]/guests/_components/chip-editors.tsx, app/dashboard/[eventId]/guests/_components/guest-card-body.tsx, app/dashboard/[eventId]/guests/_components/roster-controls.tsx, app/dashboard/[eventId]/guests/page.tsx) — one fact, shown once.
- Thread (/dashboard/[eventId]/messages/[threadId]) — works out or draws "Share of the plan locked in" in 2 places (app/dashboard/[eventId]/vendors/_components/lock-milestone.tsx, app/vendor-dashboard/services/_components/service-card-face.tsx) — one fact, shown once.
- Suppliers (/dashboard/[eventId]/vendors) — works out or draws "Share of the plan locked in" in 2 places (app/dashboard/[eventId]/vendors/_components/build-locked.tsx, app/dashboard/[eventId]/vendors/_components/lock-milestone.tsx) — one fact, shown once.
- Suppliers (/dashboard/[eventId]/vendors) — works out or draws "Still owing" in 2 places (app/dashboard/[eventId]/budget/page.tsx, app/dashboard/[eventId]/vendors/_components/merkado-budget-lens.tsx) — one fact, shown once.
- Customers (/vendor-dashboard/customers) — works out or draws "Days to go" in 2 places (app/vendor-dashboard/bookings/surface.tsx, app/vendor-dashboard/customers/_components/customers-roster.tsx) — one fact, shown once.
- Thread · Vendor (/vendor-dashboard/messages/[threadId]) — works out or draws "Share of the plan locked in" in 2 places (app/dashboard/[eventId]/vendors/_components/lock-milestone.tsx, app/vendor-dashboard/services/_components/service-card-face.tsx) — one fact, shown once.

## Saved but never used — 32 (a new one warns)

A column the app saves that nothing reads back — no select, no row property, no filter, and no database function, view or policy.

- budget_allocation_decisions.recommended_amount_php is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/budget/allocation-actions.ts`.
- budget_allocation_decisions.recommended_share_bp is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/budget/allocation-actions.ts`.
- budget_allocation_decisions.total_budget_php is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/budget/allocation-actions.ts`.
- chat_threads.compat_reasons is saved but nothing in the app or the database reads it back. Saved by `lib/vendor-autoreply/auto-accept.ts`.
- discount_code_redemptions.discount_centavos_applied is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/checkout/actions.ts`.
- event_editorial.edited_by_couple is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/story/actions.ts`.
- event_inspiration_assets.sampled_hex_1 is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/mood-board/actions.ts`.
- event_inspiration_assets.sampled_hex_2 is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/mood-board/actions.ts`.
- event_inspiration_assets.sampled_hex_3 is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/mood-board/actions.ts`.
- event_inspiration_assets.sampled_hex_4 is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/mood-board/actions.ts`.
- event_inspiration_assets.sampled_hex_5 is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/mood-board/actions.ts`.
- event_inspiration_assets.sampled_hex_6 is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/mood-board/actions.ts`.
- event_moderators.removal_reason is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/guests/[guestId]/access-actions.ts`.
- event_vendors.completion_resolution_note is saved but nothing in the app or the database reads it back. Saved by `app/admin/completions/actions.ts`.
- event_walkthrough_zones.duration_seconds is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/seating/walkthrough/actions.ts`.
- events.auspicious_reasons is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/date-selection/actions.ts`.
- events.ceremony_type_locked_by is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/(account)/create-event/actions.ts`.
- guest_claims.review_note is saved but nothing in the app or the database reads it back. Saved by `lib/seat-unlink.ts`.
- homepage_background_videos.video_url is saved but nothing in the app or the database reads it back. Saved by `app/admin/background-videos/actions.ts`.
- media_hash_checks.perceptual_hash is saved but nothing in the app or the database reads it back. Saved by `lib/known-hash-match.ts`.
- patiktok_oauth_grants.revoked_reason is saved but nothing in the app or the database reads it back. Saved by `app/api/tiktok/auth/callback/route.ts`.
- patiktok_source_clips.captured_by is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/patiktok/actions.ts`.
- patiktok_source_clips.performer_label is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/[eventId]/studio/patiktok/actions.ts`.
- person_story_items.removed_reason is saved but nothing in the app or the database reads it back. Saved by `app/dashboard/(account)/people/life-stories.ts`.
- platform_secret_rotations.rotated_by is saved but nothing in the app or the database reads it back. Saved by `app/admin/secrets/actions.ts`.
- samahan_stories.clip_bytes is saved but nothing in the app or the database reads it back. Saved by `app/api/samahan/story/route.ts`.
- scan_events.ip_anon is saved but nothing in the app or the database reads it back. Saved by `lib/scan-trail.ts`.
- users.concierge_enforcement_by is saved but nothing in the app or the database reads it back. Saved by `app/admin/concierge-abuse/actions.ts`.
- vendor_bot_replies.compat_score is saved but nothing in the app or the database reads it back. Saved by `lib/vendor-autoreply/auto-accept.ts`.
- vendor_bot_replies.was_llm is saved but nothing in the app or the database reads it back. Saved by `lib/vendor-autoreply/auto-accept.ts`.
- vendor_locked_qr_tokens.remembrance_r2_key is saved but nothing in the app or the database reads it back. Saved by `app/vendor-dashboard/invite/actions.ts`.
- vendor_profile_views.viewer_hash is saved but nothing in the app or the database reads it back. Saved by `lib/record-vendor-view.ts`.

## Sanitisers that drop keys — 3 (a new one warns)

A cleaner that keeps only the keys it knows and silently drops the rest before a save. Sometimes that is the point (an allowlist); each one is listed so a dropped answer is a decision, not an accident.

- scrubWizardState (lib/erasure/coverage.ts) keeps only the keys it knows and silently drops the rest before lib/erasure/purge.ts saves.
- sanitizeReceptionDesign (lib/reception-scene.ts) keeps only the keys it knows and silently drops the rest before 6 files save.
- sanitizeGroupAttire (lib/role-group-dress-code.ts) keeps only the keys it knows and silently drops the rest before app/dashboard/[eventId]/website/dress-code/actions.ts saves.

## Doors whose words do not match where they land — 134 (a new one warns)

The words on a link do not name where it lands. Judged against the destination's own title, heading, menu label and address, through a reasoned list of synonyms (Event Hub = website = invitation; suppliers = vendors = team …). Calls to action ("Open", "See all", "Start free") are not judged. A judgement check: it warns, it does not fail.

- "Secure your plan" in app/_components/account-switcher/account-switcher.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "Review accept →" in app/_components/chat-thread-views.tsx opens /proposals/[publicId], whose own words are "Proposal / We couldn t open this quote".
- "Saved suppliers" in app/_components/frontdoor/command-data.ts opens /dashboard/library, whose own words are "Memories / Memories".
- "New uploads" in app/_components/frontdoor/front-door-feed.tsx opens /realstories, whose own words are "Stories / Stories · Setnayan".
- "See how sharing works" in app/_components/frontdoor/front-door-feed.tsx opens /realstories, whose own words are "Stories / Stories · Setnayan".
- "See the full story →" in app/_components/home/HomeOverlays.tsx opens /setnayan-ai, whose own words are "It doesn’t chat. It watches your wedding for you. / A 24-hour secretary, working inside your wedding.".
- "Turn on Setnayan AI" in app/_components/home/HomeOverlays.tsx opens /onboarding/wedding, whose own words are "Plan your wedding / You’re already planning a wedding".
- "Phone" in app/_components/site-stage/site-stage.tsx opens /[slug], whose own words are "invitation event hub page".
- "A chapter by @" in app/_components/storyteller-tile.tsx opens /u/[userSlug], whose own words are "u".
- "How to get this" in app/_components/verification/doc-slot-card.tsx opens /help/[slug], whose own words are "Setnayan · Help / help".
- "3D Plan" in app/(shell)/alaala/page.tsx opens /pa3d, whose own words are "Your mood board / Your venue".
- "Logo Maker" in app/(shell)/alaala/page.tsx opens /palogo, whose own words are "One mark, alive across your whole wedding. / One mark, and everywhere it goes".
- "Ask about your date —" in app/(shell)/explore/compare/page.tsx opens /v/[slug], whose own words are "Setnayan supplier / Setnayan supplier".
- "View full profile →" in app/(shell)/explore/compare/page.tsx opens /v/[slug], whose own words are "Setnayan supplier / Setnayan supplier".
- "See every amount →" in app/(shell)/papic/page.tsx opens /pricing, whose own words are "Pricing / Pricing · Setnayan".
- "Unlock Setnayan AI" in app/(shell)/pricing/page.tsx opens /onboarding/wedding, whose own words are "Plan your wedding / You’re already planning a wedding".
- "Happening now" in app/[slug]/_lib/room-links.ts opens /[slug]/hub, whose own words are "Live hub / hub".
- "The album" in app/[slug]/_lib/room-links.ts opens /[slug]/recap, whose own words are "The Recap / The Recap".
- "Walk the room" in app/[slug]/_lib/room-links.ts opens /[slug]/venue, whose own words are "Explore the venue / Explore the venue".
- "See me in the room →" in app/[slug]/avatar/_components/avatar-maker.tsx opens /[slug]/venue, whose own words are "Explore the venue / Explore the venue".
- "See the venue map →" in app/[slug]/hub/page.tsx opens /[slug]/find-my-table, whose own words are "Find your table / Open this from your invitation".
- "Publish your story — free" in app/creators/_components/creator-story-hero.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "Publish your story — free" in app/creators/_components/creator-story-sections.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "Secure my plan" in app/dashboard/_components/secure-account-banner.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "Buksan ang" in app/dashboard/(account)/create-event/page.tsx opens /dashboard/[eventId], whose own words are "dashboard".
- "ago today — relive the day" in app/dashboard/(account)/library/_components/photos-tab.tsx opens /dashboard/[eventId]/studio/papic, whose own words are "Papic / Battery handoff at 20%".
- "Contact" in app/dashboard/(account)/library/_components/saved-vendor-card.tsx opens /v/[slug], whose own words are "Setnayan supplier / Setnayan supplier".
- "Spaces on your home" in app/dashboard/(account)/library/page.tsx opens /dashboard, whose own words are "Your events / HQ".
- "Plan what’s next →" in app/dashboard/(account)/life-flash/_components/flash.tsx opens /dashboard/create-event, whose own words are "Create event / dashboard create-event".
- "Plan what s next" in app/dashboard/(account)/life-flash/page.tsx opens /dashboard/create-event, whose own words are "Create event / dashboard create-event".
- "Visit the shop" in app/dashboard/(account)/people/[dependentId]/page.tsx opens /[slug], whose own words are "invitation event hub page".
- "secure your plan" in app/dashboard/(account)/profile/page.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "Secure your plan" in app/dashboard/(account)/profile/page.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "View public profile" in app/dashboard/(account)/profile/page.tsx opens /u/[userSlug], whose own words are "u".
- "Add your birthday" in app/dashboard/(launcher)/_components/year-moments-strip.tsx opens /dashboard/profile, whose own words are "Profile / Profile".
- "What you had switched on for this one." in app/dashboard/[eventId]/_components/after/finished-event-summary.tsx opens /dashboard/[eventId]/suite, whose own words are "More Services / dashboard suite".
- "· available" in app/dashboard/[eventId]/_components/checklist/checklist-full.tsx opens /dashboard/[eventId]/vendors, whose own words are "Suppliers / Suppliers".
- "t replied yet" in app/dashboard/[eventId]/_components/event-dashboard.tsx opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".
- "Mutual consent" in app/dashboard/[eventId]/_components/nikah-essentials-card.tsx opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".
- "Add to your Memories" in app/dashboard/[eventId]/alaala/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "Stop the livestream" in app/dashboard/[eventId]/clearance/page.tsx opens /dashboard/[eventId]/launch, whose own words are "Event Hub Maker / dashboard launch".
- "Find a date / feng-shui specialist" in app/dashboard/[eventId]/date-selection/_components/chinese-specialist-nudge.tsx opens /explore, whose own words are "Filipino wedding suppliers marketplace / Filipino wedding suppliers · Setnayan marketplace".
- "· · Ref" in app/dashboard/[eventId]/documents/page.tsx opens /dashboard/[eventId]/orders, whose own words are "Orders / Orders".
- "TXN- - · ·" in app/dashboard/[eventId]/documents/page.tsx opens /receipts/[receiptId], whose own words are "Transaction Receipt / receipts".
- "waiting for you to confirm" in app/dashboard/[eventId]/guests/invite/_components/invite-panel.tsx opens /dashboard/[eventId]/guests/claims, whose own words are "Requests / Requests".
- "or use the full form" in app/dashboard/[eventId]/guests/page.tsx opens /dashboard/[eventId]/guests/new, whose own words are "Add guest / Add a guest".
- "Paste a list" in app/dashboard/[eventId]/guests/page.tsx opens /dashboard/[eventId]/guests/import, whose own words are "Import guests / Import guests from a file".
- "Who came" in app/dashboard/[eventId]/guests/page.tsx opens /dashboard/[eventId]/guests/checkin, whose own words are "Check-in desk / Check-in desk".
- "What s included" in app/dashboard/[eventId]/launch/_components/hub-pro-offer.tsx opens /dashboard/[eventId]/website/editor, whose own words are "① Site / ② Sections".
- "Open the live page" in app/dashboard/[eventId]/launch/_components/hub-stage.tsx opens /[slug], whose own words are "invitation event hub page".
- "Merkado" in app/dashboard/[eventId]/launch/page.tsx opens /marketplace, whose own words are "Every supplier for your day, in one search. / Find them, keep them, compare them".
- "The page itself" in app/dashboard/[eventId]/launch/page.tsx opens /dashboard/[eventId]/website/editor, whose own words are "① Site / ② Sections".
- "The running order" in app/dashboard/[eventId]/launch/page.tsx opens /dashboard/[eventId]/schedule, whose own words are "Schedule / Schedule".
- "See it in Add-ons" in app/dashboard/[eventId]/live/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "Choose ceremony type" in app/dashboard/[eventId]/paperwork/page.tsx opens /dashboard/[eventId]/date-selection, whose own words are "Pick your date / I have a date in mind".
- "Design panel" in app/dashboard/[eventId]/plan3d/page.tsx opens /dashboard/[eventId]/seating/lab, whose own words are "Seating · 3D lab (prototype) / dashboard seating lab".
- "Preview your editorial ↗" in app/dashboard/[eventId]/story/_components/editorial-editor.tsx opens /[slug], whose own words are "invitation event hub page".
- "Verifying" in app/dashboard/[eventId]/studio/_components/addon-detail-view.tsx opens /dashboard/[eventId]/orders, whose own words are "Orders / Orders".
- "Back to add-ons" in app/dashboard/[eventId]/studio/indoor-blueprint/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "open the guest view" in app/dashboard/[eventId]/studio/indoor-blueprint/page.tsx opens /[slug]/find-my-table, whose own words are "Find your table / Open this from your invitation".
- "Back to add-ons" in app/dashboard/[eventId]/studio/live-studio-control/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "‹ Back to add-ons" in app/dashboard/[eventId]/studio/mood-board/_components/mood-board-editor.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "love-story details" in app/dashboard/[eventId]/studio/pakanta/page.tsx opens /dashboard/[eventId]/details, whose own words are "Event Details / Event Details".
- "Play this day" in app/dashboard/[eventId]/studio/papic/_components/life-flash-card.tsx opens /dashboard/life-flash, whose own words are "Life-Flash / Life-Flash".
- "Back to add-ons" in app/dashboard/[eventId]/studio/papic/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "Show the QR codes" in app/dashboard/[eventId]/studio/papic/page.tsx opens /dashboard/[eventId]/studio/papic/crew, whose own words are "No crew cameras yet / dashboard studio papic crew".
- "Preview template + queue render" in app/dashboard/[eventId]/studio/patiktok/booth/page.tsx opens /dashboard/[eventId]/studio/patiktok/[templateId], whose own words are "dashboard studio patiktok".
- "Back to add-ons" in app/dashboard/[eventId]/studio/patiktok/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "Choose template" in app/dashboard/[eventId]/studio/patiktok/page.tsx opens /dashboard/[eventId]/studio/patiktok/[templateId], whose own words are "dashboard studio patiktok".
- "Back to add-ons" in app/dashboard/[eventId]/studio/save-the-date/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "Back to add-ons" in app/dashboard/[eventId]/studio/setnayan-ai/page.tsx opens /dashboard/[eventId]/studio, whose own words are "Studio / Your Studio".
- "+ Unlock more categor" in app/dashboard/[eventId]/vendors/_components/plan-budget-accordion.tsx opens /dashboard/[eventId]/vendors/categories, whose own words are "Find a supplier / Find a supplier".
- "Transport, food inclusions →" in app/dashboard/[eventId]/vendors/_components/self-added-price.tsx opens /dashboard/[eventId]/vendors/[vendorId]/workspace, whose own words are "Service workspace / dashboard vendors workspace".
- "Design the film →" in app/dashboard/[eventId]/website/editor/_components/authoring-panels.tsx opens /dashboard/[eventId]/studio/save-the-date, whose own words are "Save the Date / dashboard studio save-the-date".
- "Reminders" in app/dashboard/[eventId]/website/editor/page.tsx opens /dashboard/[eventId]/website/widgets, whose own words are "Customize widgets / Add at least one guest to your list to enable preview".
- "setnayan.com" in app/download/page.tsx opens /, whose own words are "home setnayan".
- "Use it on the web instead" in app/download/page.tsx opens /, whose own words are "home setnayan".
- "use Setnayan on the web" in app/download/page.tsx opens /, whose own words are "home setnayan".
- "Get your invite link" in app/for-suppliers/_components/vendor-grow-sections.tsx opens /open-shop, whose own words are "Open your shop / open-shop".
- "List your business — free" in app/for-suppliers/_components/vendor-grow-sections.tsx opens /open-shop, whose own words are "Open your shop / open-shop".
- "List your business for free" in app/for-suppliers/_components/vendor-hero-gate.tsx opens /open-shop, whose own words are "Open your shop / open-shop".
- "Talk to us →" in app/for-suppliers/_components/vendor-tier-deltas.tsx opens /help, whose own words are "Help & support / Help & support · Setnayan".
- "Talk to us →" in app/for-suppliers/_components/vendor-tier-matrix.tsx opens /help, whose own words are "Help & support / Help & support · Setnayan".
- "Open my camera" in app/papic/me/[token]/page.tsx opens /papic/seat/[token], whose own words are "This seat was reissued. / papic seat".
- "Finish setting up" in app/pay/[reference]/page.tsx opens /dashboard/[eventId], whose own words are "dashboard".
- "Send me a new link" in app/reset-password/page.tsx opens /forgot-password, whose own words are "Reset your password / Forgot your password?".
- "No thanks" in app/samahan/join/[token]/page.tsx opens /dashboard, whose own words are "Your events / HQ".
- "Back to all stops" in app/tour/budget/page.tsx opens /tour, whose own words are "Walk through a real wedding / Walk through a real wedding · Setnayan".
- "All stops" in app/tour/gallery/page.tsx opens /tour, whose own words are "Walk through a real wedding / Walk through a real wedding · Setnayan".
- "Start your own, free" in app/tour/layout.tsx opens /onboarding/wedding, whose own words are "Plan your wedding / You’re already planning a wedding".
- "All stops" in app/tour/seating/page.tsx opens /tour, whose own words are "Walk through a real wedding / Walk through a real wedding · Setnayan".
- "All stops" in app/tour/vendors/page.tsx opens /tour, whose own words are "Walk through a real wedding / Walk through a real wedding · Setnayan".
- "Made with Setnayan" in app/u/[userSlug]/c/[chapterId]/page.tsx opens /, whose own words are "home setnayan".
- "Made with Setnayan" in app/u/[userSlug]/page.tsx opens /, whose own words are "home setnayan".
- "View s profile →" in app/v/[slug]/booth/page.tsx opens /v/[slug], whose own words are "Setnayan supplier / Setnayan supplier".
- "Philippines" in app/v/[slug]/page.tsx opens /[slug], whose own words are "invitation event hub page".
- "Plan with Setnayan" in app/v/[slug]/page.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "Setnayan supplier" in app/v/[slug]/page.tsx opens /, whose own words are "home setnayan".
- "Setnayan supplier" in app/v/[slug]/page.tsx opens /[slug], whose own words are "invitation event hub page".
- "See how couples discover you" in app/vendor-dashboard/_components/spotlight-award-banner.tsx opens /explore, whose own words are "Filipino wedding suppliers marketplace / Filipino wedding suppliers · Setnayan marketplace".
- "new inquiries" in app/vendor-dashboard/_components/supplier-today-first-screen.tsx opens /vendor-dashboard/customers, whose own words are "Customers / vendor-dashboard customers".
- "Set up profile" in app/vendor-dashboard/attributes/page.tsx opens /vendor-dashboard, whose own words are "Today / Today".
- "Turn on Papic Challenges" in app/vendor-dashboard/clients/[eventId]/_components/vendor-challenge-section.tsx opens /vendor-dashboard/subscription, whose own words are "Plan · Vendor / Choose your plan.".
- "Set up a schedule" in app/vendor-dashboard/clients/surface.tsx opens /vendor-dashboard/customers, whose own words are "Customers / vendor-dashboard customers".
- "Switch to customer view" in app/vendor-dashboard/error.tsx opens /dashboard, whose own words are "Your events / HQ".
- "View all issued →" in app/vendor-dashboard/invite/page.tsx opens /vendor-dashboard/locked-qr, whose own words are "Locked QRs · Vendor / Locked QRs".
- "Schedule" in app/vendor-dashboard/messages/[threadId]/page.tsx opens /vendor-dashboard/clients/[eventId], whose own words are "Customer Card · Vendor / Payment logged by the couple".
- "contact email" in app/vendor-dashboard/notifications/page.tsx opens /vendor-dashboard, whose own words are "Today / Today".
- "Open the full desk" in app/vendor-dashboard/on-the-day/live/[eventId]/_components/floor-command/floor-command.tsx opens /vendor-dashboard/on-the-day, whose own words are "Event Hub · Vendor / Recap capture".
- "Open the inbox" in app/vendor-dashboard/on-the-day/live/[eventId]/_components/floor-command/floor-command.tsx opens /vendor-dashboard/on-the-day, whose own words are "Event Hub · Vendor / Recap capture".
- "Photos" in app/vendor-dashboard/on-the-day/page.tsx opens /vendor-dashboard/clients/[eventId]/editorial-media, whose own words are "Editorial media · Vendor / From your camera".
- "Recap capture" in app/vendor-dashboard/on-the-day/page.tsx opens /vendor-dashboard/clients/[eventId]/editorial-media, whose own words are "Editorial media · Vendor / From your camera".
- "Start a new card from this one" in app/vendor-dashboard/services/_components/services-manager.tsx opens /vendor-dashboard/services/new/[category], whose own words are "Add a service / vendor-dashboard services new".
- "see what s left" in app/vendor-dashboard/website/page.tsx opens /vendor-dashboard/shop, whose own words are "Shop / Your shop".
- "This invite was previously declined." in app/vendor/claim/[token]/page.tsx opens /signup, whose own words are "Create account / Create your user account.".
- "Pre-register your business today" in app/waitlist/page.tsx opens /for-suppliers, whose own words are "for-suppliers".
- "Groups" in lib/free-tools-rail.ts opens /dashboard, whose own words are "Your events / HQ".
- "Groups" in lib/free-tools-rail.ts opens /dashboard/[eventId]/messages, whose own words are "Chats / Chats".
- "Build" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".
- "Confirm" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/guests/claims, whose own words are "Requests / Requests".
- "Customize" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".
- "Day-of" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/guests/checkin, whose own words are "Check-in desk / Check-in desk".
- "Insights" in lib/nav-registry-defaults.ts opens /vendor-dashboard/performance, whose own words are "My Performance · Vendor / Where your bookings come from".
- "Journey" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".
- "nav.notifications" in lib/nav-registry-defaults.ts opens /dashboard/clusters/[clusterId], whose own words are "dashboard clusters".
- "nav.notifications" in lib/nav-registry-defaults.ts opens /dashboard/people/[dependentId], whose own words are "Loved one / dashboard people".
- "nav.notifications" in lib/nav-registry-defaults.ts opens /dashboard/samahan/[communityId], whose own words are "Group / dashboard samahan".
- "Personalization" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/details, whose own words are "Event Details / Event Details".
- "Search" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".
- "Setnayan brand logo / Home" in lib/nav-registry-defaults.ts opens /, whose own words are "home setnayan".
- "Summary" in lib/nav-registry-defaults.ts opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".
- "Verify" in lib/nav-registry-defaults.ts opens /vendor-dashboard/shop, whose own words are "Shop / Your shop".
- "Scan tickets" in lib/roster-doors.ts opens /dashboard/[eventId]/guests/checkin, whose own words are "Check-in desk / Check-in desk".
- "Share the link" in lib/roster-doors.ts opens /dashboard/[eventId]/guests, whose own words are "Guests / Guest".

## Doors that still point at a forwarding stub — 110 (a new one warns)

A door that works, but through an old address that only forwards. Point it at the real page.

- A door in app/dashboard/[eventId]/budget/actions.ts still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/dashboard/[eventId]/disputes/actions.ts still points at /vendor-dashboard/bookings, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/dashboard/[eventId]/event-page/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/guests/invite/_components/invite-panel.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/orders/page.tsx still points at /dashboard/[eventId]/orders/new, an old address that only forwards to /dashboard/[…]/studio.
- A door in app/dashboard/[eventId]/story/_components/editorial-editor.tsx still points at /dashboard/[eventId]/website/special-message, an old address that only forwards to /dashboard/[…]/website/editor?open=special-message.
- A door in app/dashboard/[eventId]/story/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/studio/[addon]/page.tsx still points at /dashboard/[eventId]/event-page, an old address that only forwards to /[…].
- A door in app/dashboard/[eventId]/studio/[addon]/page.tsx still points at /dashboard/[eventId]/more, an old address that only forwards to /dashboard/[…].
- A door in app/dashboard/[eventId]/studio/[addon]/page.tsx still points at /dashboard/[eventId]/progress, an old address that only forwards to /dashboard/[…][…].
- A door in app/dashboard/[eventId]/studio/[addon]/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/studio/guest-columns/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/studio/page.tsx still points at /dashboard/[eventId]/event-page, an old address that only forwards to /[…].
- A door in app/dashboard/[eventId]/studio/papic/couple-challenges-manager.tsx still points at /dashboard/[eventId]/studio/[addon], an old address that only forwards to /dashboard/[…]/[…].
- A door in app/dashboard/[eventId]/studio/papic/crew/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/studio/patiktok/page.tsx still points at /dashboard/[eventId]/studio/[addon], an old address that only forwards to /dashboard/[…]/[…].
- A door in app/dashboard/[eventId]/vendors/actions.ts still points at /vendor-dashboard/bookings, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/dashboard/[eventId]/website/dress-code/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/website/editor/_components/editor-shell.tsx still points at /dashboard/[eventId]/event-page, an old address that only forwards to /[…].
- A door in app/dashboard/[eventId]/website/editor/_components/editor-shell.tsx still points at /dashboard/[eventId]/more, an old address that only forwards to /dashboard/[…].
- A door in app/dashboard/[eventId]/website/editor/_components/editor-shell.tsx still points at /dashboard/[eventId]/progress, an old address that only forwards to /dashboard/[…][…].
- A door in app/dashboard/[eventId]/website/editor/_components/editor-shell.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/website/editor/page.tsx still points at /dashboard/[eventId]/website/colors, an old address that only forwards to /dashboard/[…]/website/editor?open=colors.
- A door in app/dashboard/[eventId]/website/editor/page.tsx still points at /dashboard/[eventId]/website/editorial, an old address that only forwards to /dashboard/[…]/story.
- A door in app/dashboard/[eventId]/website/editor/page.tsx still points at /dashboard/[eventId]/website/special-message, an old address that only forwards to /dashboard/[…]/website/editor?open=special-message.
- A door in app/dashboard/[eventId]/website/editor/page.tsx still points at /dashboard/[eventId]/website/what-to-bring, an old address that only forwards to /dashboard/[…]/website/editor?open=what-to-bring.
- A door in app/dashboard/[eventId]/website/hero-photo/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/website/living-hero/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/website/our-story/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/website/privacy/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/website/stories/page.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/dashboard/[eventId]/website/widgets/page.tsx still points at /dashboard/[eventId]/website/colors, an old address that only forwards to /dashboard/[…]/website/editor?open=colors.
- A door in app/dashboard/[eventId]/website/widgets/page.tsx still points at /dashboard/[eventId]/website/editorial, an old address that only forwards to /dashboard/[…]/story.
- A door in app/dashboard/[eventId]/website/widgets/page.tsx still points at /dashboard/[eventId]/website/special-message, an old address that only forwards to /dashboard/[…]/website/editor?open=special-message.
- A door in app/dashboard/[eventId]/website/widgets/page.tsx still points at /dashboard/[eventId]/website/what-to-bring, an old address that only forwards to /dashboard/[…]/website/editor?open=what-to-bring.
- A door in app/onboarding/wedding/_components/onboarding-shell.tsx still points at /dashboard/[eventId]/more, an old address that only forwards to /dashboard/[…].
- A door in app/onboarding/wedding/_components/onboarding-shell.tsx still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in app/vendor-dashboard/_components/overview-sections.tsx still points at /vendor-dashboard/calendar, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/_components/overview-sections.tsx still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in app/vendor-dashboard/_components/overview-sections.tsx still points at /vendor-dashboard/contracts, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/_components/overview-sections.tsx still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/_components/supplier-today-first-screen.tsx still points at /vendor-dashboard/calendar, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/activities/page.tsx still points at /vendor-dashboard/verify, an old address that only forwards to /vendor-dashboard/shop[…]#get-verified.
- A door in app/vendor-dashboard/calendar/[date]/page.tsx still points at /vendor-dashboard/calendar, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/bookings, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/branches, an old address that only forwards to /vendor-dashboard/shop[…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/contracts, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/demand, an old address that only forwards to /vendor-dashboard/performance[…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/earnings, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/manpower, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/payday, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/payment-options, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/profile, an old address that only forwards to /vendor-dashboard/shop[…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/calendar/actions.ts still points at /vendor-dashboard/verify, an old address that only forwards to /vendor-dashboard/shop[…]#get-verified.
- A door in app/vendor-dashboard/clients/[eventId]/actions.ts still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in app/vendor-dashboard/clients/[eventId]/challenge-photos/page.tsx still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in app/vendor-dashboard/clients/[eventId]/page.tsx still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in app/vendor-dashboard/clients/[eventId]/page.tsx still points at /vendor-dashboard/contracts, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/clients/[eventId]/page.tsx still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/clients/[eventId]/page.tsx still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/clients/surface.tsx still points at /vendor-dashboard/bookings, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/clients/surface.tsx still points at /vendor-dashboard/calendar, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/contracts/[contractId]/page.tsx still points at /vendor-dashboard/contracts, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/contracts/new/page.tsx still points at /vendor-dashboard/contracts, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/contracts/new/page.tsx still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/lines/actions.ts still points at /vendor-dashboard/verify, an old address that only forwards to /vendor-dashboard/shop[…]#get-verified.
- A door in app/vendor-dashboard/lines/page.tsx still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in app/vendor-dashboard/lines/page.tsx still points at /vendor-dashboard/verify, an old address that only forwards to /vendor-dashboard/shop[…]#get-verified.
- A door in app/vendor-dashboard/manpower/surface.tsx still points at /vendor-dashboard/verify, an old address that only forwards to /vendor-dashboard/shop[…]#get-verified.
- A door in app/vendor-dashboard/messages/[threadId]/_components/chat-info-rail.tsx still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/messages/[threadId]/_components/send-proposal-card.tsx still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/messages/[threadId]/outcome-actions.ts still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/messages/[threadId]/page.tsx still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/messages/[threadId]/proposal-actions.ts still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/on-the-day/live/[eventId]/page.tsx still points at /vendor-dashboard/verify, an old address that only forwards to /vendor-dashboard/shop[…]#get-verified.
- A door in app/vendor-dashboard/on-the-day/page.tsx still points at /vendor-dashboard/verify, an old address that only forwards to /vendor-dashboard/shop[…]#get-verified.
- A door in app/vendor-dashboard/page.tsx still points at /vendor-dashboard/earnings, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in app/vendor-dashboard/page.tsx still points at /vendor-dashboard/payday, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in app/vendor-dashboard/payday/surface.tsx still points at /vendor-dashboard/bookings, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/event-people-roster.ts still points at /dashboard/[eventId]/event-page, an old address that only forwards to /[…].
- A door in lib/event-people-roster.ts still points at /dashboard/[eventId]/more, an old address that only forwards to /dashboard/[…].
- A door in lib/event-people-roster.ts still points at /dashboard/[eventId]/progress, an old address that only forwards to /dashboard/[…][…].
- A door in lib/event-people-roster.ts still points at /dashboard/[eventId]/website, an old address that only forwards to /dashboard/[…]/launch.
- A door in lib/ghosting.ts still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/nav-registry-defaults.ts still points at /dashboard/[eventId]/event-page, an old address that only forwards to /[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/bookings, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/branches, an old address that only forwards to /vendor-dashboard/shop[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/calendar, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/contracts, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/demand, an old address that only forwards to /vendor-dashboard/performance[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/earnings, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/manpower, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/payday, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/payment-options, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/profile, an old address that only forwards to /vendor-dashboard/shop[…].
- A door in lib/nav-registry-defaults.ts still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/payouts.ts still points at /vendor-dashboard/earnings, an old address that only forwards to /vendor-dashboard/shop?[…].
- A door in lib/proposal-back.ts still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/reusable-bookings.server.ts still points at /vendor-dashboard/proposals, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/vendor-email-triggers.ts still points at /vendor-dashboard/clients, an old address that only forwards to /vendor-dashboard/customers?[…].
- A door in lib/vendor-email-triggers.ts still points at /vendor-dashboard/profile, an old address that only forwards to /vendor-dashboard/shop[…].
- A door in lib/vendor-growth-recs.ts still points at /vendor-dashboard/calendar, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/vendor-growth-recs.ts still points at /vendor-dashboard/messages, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/vendor-more-rows.ts still points at /vendor-dashboard/calendar, an old address that only forwards to /vendor-dashboard/customers?[…][…].
- A door in lib/vendor-service-tools.ts still points at /vendor-dashboard/manpower, an old address that only forwards to /vendor-dashboard/shop?[…].

## Round trips — create → read back every field

Nine create forms now have a round-trip test (`apps/web/lib/ugat/create-forms-round-trip.test.ts`): every input is followed to the column it is saved in and to the screen that shows the new thing — guest, schedule moment, sponsor, seating table, budget line item, manpower gig, supplier service, supplier payment method, Samahan community. These 61 create forms have no round-trip test yet (the helper, `roundTrip()`, takes one line each):

- `app/_components/amendment-builder.tsx` → `createAmendmentFromChat`
- `app/_components/appointments-section.tsx` → `proposeAppointment`
- `app/_components/negotiation-composer-menu.tsx` → `createScheduleRequestFromChat`
- `app/_components/schedule-suggest-chip.tsx` → `createScheduleRequestFromChat`
- `app/(shell)/help/page.tsx` → `submitHelpMessage`
- `app/dashboard/(account)/api-keys/page.tsx` → `createApiKey`
- `app/dashboard/(account)/clusters/_components/create-cluster-form.tsx` → `createCluster`
- `app/dashboard/(account)/create-event/_components/event-type-picker.tsx` → `createWeddingEvent`
- `app/dashboard/(account)/people/_components/add-alaga-button.tsx` → `addDependent`
- `app/dashboard/(account)/people/_components/dependents-section.tsx` → `addGodparent`
- `app/dashboard/(account)/people/_components/dependents-section.tsx` → `createHandoverLink`
- `app/dashboard/(account)/people/_components/samahan-people-section.tsx` → `proposeSamahanConnection`
- `app/dashboard/(account)/profile/page.tsx` → `requestAccountDeletion`
- `app/dashboard/(account)/samahan/[communityId]/page.tsx` → `postSamahanMessage`
- `app/dashboard/[eventId]/guests/_components/groups-sidebar.tsx` → `createGuestGroup`
- `app/dashboard/[eventId]/guests/_components/guest-list-multiselect.tsx` → `createGuestGroup`
- `app/dashboard/[eventId]/guests/import/import-form.tsx` → `importGuestsCsv`
- `app/dashboard/[eventId]/studio/papic/couple-challenges-manager.tsx` → `addLibraryChallengeAction`
- `app/dashboard/[eventId]/studio/papic/couple-challenges-manager.tsx` → `createCoupleChallengeAction`
- `app/dashboard/[eventId]/studio/papic/run-of-show/page.tsx` → `addLibraryChallengeAction`
- `app/dashboard/[eventId]/studio/patiktok/_components/render-form.tsx` → `submitPatiktokRender`
- `app/dashboard/[eventId]/vendors/_components/reuse-bookings-panel.tsx` → `requestVendorReuseForm`
- `app/dashboard/[eventId]/vendors/[vendorId]/review/page.tsx` → `submitCoupleReview`
- `app/dashboard/[eventId]/vendors/[vendorId]/review/page.tsx` → `submitReviewAppeal`
- `app/dashboard/[eventId]/vendors/[vendorId]/workspace/_components/consent-gated-invite-form.tsx` → `inviteHost`
- `app/dashboard/[eventId]/vendors/[vendorId]/workspace/_components/working-folder-notes.tsx` → `addWorkingNoteAction`
- `app/dashboard/[eventId]/vendors/[vendorId]/workspace/page.tsx` → `createAutoShareInviteAction`
- `app/dashboard/[eventId]/website/editor/_components/scene-template-picker.tsx` → `addCustomSection`
- `app/forgot-password/page.tsx` → `requestPasswordReset`
- `app/onboarding/simple/page.tsx` → `commitSimpleEvent`
- `app/open-shop/_components/open-shop-wizard.tsx` → `becomeVendor`
- `app/panood/control/[eventId]/_components/venue-screens-section.tsx` → `addLiveScreen`
- `app/panood/control/[eventId]/page.tsx` → `addEventFilm`
- `app/panood/control/[eventId]/page.tsx` → `addRoamZone`
- `app/panood/control/[eventId]/page.tsx` → `createChannelJoinLink`
- `app/papic/order/[token]/page.tsx` → `submitPapicGuestPayment`
- `app/pay/[reference]/_components/pay-panel.tsx` → `submitPaymentProof`
- `app/vendor-dashboard/_components/overview-sections.tsx` → `postVendorReply`
- `app/vendor-dashboard/activities/page.tsx` → `addActivity`
- `app/vendor-dashboard/activities/questions-section.tsx` → `addQuestion`
- `app/vendor-dashboard/calendar/surface.tsx` → `addManualBlock`
- `app/vendor-dashboard/calendar/surface.tsx` → `createCalendar`
- `app/vendor-dashboard/calendar/surface.tsx` → `importExternalClient`
- `app/vendor-dashboard/clients/[eventId]/_components/customer-card-notes.tsx` → `createClientNote`
- `app/vendor-dashboard/clients/[eventId]/_components/vendor-challenge-section.tsx` → `createVendorChallengeAction`
- `app/vendor-dashboard/clients/[eventId]/production-sheet/page.tsx` → `addPortionRule`
- `app/vendor-dashboard/clients/surface.tsx` → `importExternalClient`
- `app/vendor-dashboard/disputes/page.tsx` → `submitDisputeContest`
- `app/vendor-dashboard/partnerships/page.tsx` → `proposePartnership`
- `app/vendor-dashboard/proposals/surface.tsx` → `createProposal`
- `app/vendor-dashboard/repertoire/page.tsx` → `addRepertoireSong`
- `app/vendor-dashboard/reviews/page.tsx` → `postVendorReply`
- `app/vendor-dashboard/reviews/page.tsx` → `submitFlagAsFake`
- `app/vendor-dashboard/services/_components/canvas-maker.tsx` → `commitVendorService`
- `app/vendor-dashboard/services/_components/coverage-panel.tsx` → `createCoverage`
- `app/vendor-dashboard/services/_components/service-wizard.tsx` → `commitVendorService`
- `app/vendor-dashboard/shop/page.tsx` → `inviteVendorTeamMember`
- `app/vendor-dashboard/subscription/custom/_components/custom-configurator.tsx` → `requestCustomPlan`
- `app/vendor-dashboard/team/page.tsx` → `inviteVendorTeamMember`
- `app/vendor-dashboard/team/page.tsx` → `proposeAdminMotion`
- `app/vendor/fit/[ref]/page.tsx` → `addVendorFromFit`

## Home — "move the input, the output moves"

`apps/web/app/dashboard/[eventId]/home-numbers-move.test.ts` renders the real Home first screen through the same functions the page calls, for two different "today"s, two event dates and two guest lists, and fails if days to go, coming or no reply stays the same. Today: days to go reads 200 → 199 across two todays and 60 → 200 across two dates; coming 1 → 3; no reply 1 → 2.

## How it was found, and what it cannot see

- Everything is read from the code; nothing is typed in. Each check has a fixture test that proves it finds the thing AND does not accuse the correct version, and each was sabotaged once (switched off) to prove the test notices.
- **Fields:** a payload assembled across several files, a column chosen at run time, and saves done through `fetch('/api/…')` are not followed; a form field rendered by a component two levels down is not seen. So "dropped" means "no path found in this code" — open the named file before deleting anything.
- **Saved but never used** counts ANY mention of a column name as a read (generous on purpose), so it under-reports.
- **Typed numbers:** a number split from its unit by markup (`<b>190</b> days`) is not seen, and numbers in `lib/` copy are not scanned.
- **Duplicates:** only the calculations listed above are compared; a fact drawn twice through two different variables of the same name is not seen.
- **Not built (by design, owner 2026-10-02 "THE ROOT MAP IS A BACKEND THING"):** no owner page; the run-time "Dead ends people hit" recorder is part 3.
