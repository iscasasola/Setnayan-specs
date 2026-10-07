# Button inventory 6 — marketing pages, guest Event Hub, shared components

Source: archive of origin/main (apps/web). Scope: `app/[slug]/**` (guest Event Hub — there is no `app/e/` route in this archive), `components/`, and everything under `app/` outside dashboard / vendor-dashboard / vendor / vendors / admin / explore / categories / signup / login / onboarding / chat / inbox / live. That includes `app/_components` (shared chrome), `app/(shell)`, `app/v/[slug]` (public supplier page), papic, panood, tour, blog, help, etc.

Method: a JSX scanner (every `<button>`, `<a>`, `<Link>`, `*Button`/`*Trigger` components, and any element with onClick or role=button) plus keyword classification of the label and handler against the 2026-10-07 colour rule. Labels in `‹…›` or `{…}` are built from variables; `‹dynamic label›` means the label could not be read from code. Rows are merged with ×N when identical inside one file. Colour "?" = could not tell the meaning from the code (reason after the table row's colour). A "(icon only)" row has no readable label. Invisible scrims, 3D hit-targets and stopPropagation wrappers are excluded (counted in totals).

Colour key: Terracotta = forward step · Green = confirm/commit/money · Blue = messaging/info · Amber = attention/waiting · Red = destructive · Grey = manage/neutral · "link — stays a link" = pure page link.

Guest hub rows add a final column: **themed** = colour follows the couple's hub tokens (button-primary / button-secondary, data-rsvp-answer, data-arrival-action, --door-action, --accent, --hub-*); **fixed** = house colours.


## app/[slug]/_components/add-name-in-place.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Add name | runs setOpen(true) | button | Terracotta | fixed |
| Cancel | runs setOpen(false); setFailed(null); | button | Red | fixed |
| Save name | submits its form | button | Green | themed |

## app/[slug]/_components/arrival-action.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {action.label} | goes to action.href | button | ? (dynamic label; meaning set at call site) | themed |

## app/[slug]/_components/background-music.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| playing ? 'Mute background music' : 'Play background music' | runs toggle | icon-only | Grey | fixed |

## app/[slug]/_components/copy-my-link.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Copied ✓ / Copy my link | runs async () => setState((await copyText… | button | Grey | fixed |
| Open in your browser Save to my account · Messenger can’t sign you i… | runs start | button | Blue | themed |
| Close | runs setOpen(false) | icon-only | Grey | fixed |
| Copy my link {shownLink(link)} | runs async () => setCopied(await copyText… | button | Grey | themed |
| Not now | runs setOpen(false) | button | Grey | fixed |

## app/[slug]/_components/day-of-face-enroll.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Try again | runs if (failure === CAMERA_BLOCKED) setA… | button | Amber | fixed |

## app/[slug]/_components/editorial/editorial-content.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {previousEdition.label} | goes to previousEdition.href | text link | link — stays a link | fixed |
| effectiveShare.title | custom control | clickable element | Grey | fixed |
| save story card | custom control | button | Green | fixed |
| {v.name} | goes to tapHref | text link | link — stays a link | fixed |
| {v.businessName} | goes to v.href | text link | link — stays a link | fixed |
| The {capitaliseWords(w.eventWord)} Day (Live) | goes to /${slug}/hub | text link | link — stays a link | fixed |
| Watch the Film | goes to #${WATCH_FILM_ANCHOR_ID | text link | link — stays a link | fixed |
| Print the keepsake | goes to /${slug}/print | text link | Grey | fixed |

## app/[slug]/_components/editorial/living-moments.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {muted ? :} [muted ? 'Play sound for this moment' : 'Mute this momen… | runs toggleSound | button | Grey | fixed |

## app/[slug]/_components/editorial/open-up-layer.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {preview} {openLabel} ↗ | runs openLayer | button | Terracotta | fixed |
| Back to the story | runs close | icon-only | Grey | fixed |
| Back to the story | runs close | button | Grey | fixed |
| {t.label} en-PH | runs setOn(t.key) | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/empty-states.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {ctaLabel} | goes to /${slug}/invite | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/entourage-section.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| See everyone — {hidden} more &rarr; | goes to previewHref | text link | link — stays a link | fixed |

## app/[slug]/_components/entourage-styles.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| See everyone — {hidden} more &rarr; | goes to previewHref | text link | link — stays a link | fixed |

## app/[slug]/_components/event-celebrants.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Follow | runs follow | button | Terracotta | themed |
| Add | runs add | button | Terracotta | themed |

## app/[slug]/_components/face-data-notice.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Show my face again / Blur my face on the screens | submits its form | button | Grey | fixed |
| Remove my photo & face data | submits its form | button | Red | fixed |

## app/[slug]/_components/face-tagging-row.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Face tagging {status} {tappable ? : null} | runs (on ? setMenu((m) => !m) : setCamera… | button | Grey | fixed |
| Retake selfie | runs setMenu(false); setCamera(true); | button | Amber | fixed |
| Turn off | submits its form | button | Grey | fixed |

## app/[slug]/_components/get-inside.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Join as a guest | submits its form | button | Terracotta | themed |
| Ask to join | goes to /join/${eventId | button | Blue | themed |
| Sign in | goes to signIn | text link | link — stays a link | fixed |

## app/[slug]/_components/get-tickets.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Get tickets | goes to url | button | Terracotta | themed |

## app/[slug]/_components/guest-checklist.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| item.title | runs toggle(item.key) | icon-only | Grey | fixed |
| {item.link.label} | goes to item.link.href | text link | link — stays a link | fixed |

## app/[slug]/_components/guest-code-keepers.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {PASS_CARD_WORDS.saveOwn} | custom control | button | ? (dynamic label; meaning set at call site) | fixed |
| Save the code | goes to /api/guest/qr | button | Green | fixed |
| Copied / Copy link | runs copy | button | Grey | fixed |

## app/[slug]/_components/guest-column-form.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Edit | runs setEditing(true) | button | Grey | fixed |
| {pending ? ( ) : ( )} Withdraw | runs withdraw | button | Red | fixed |
| {pending ? ( ) : ( )} rejected / Save changes / rejected / Send agai… | submits its form | button | Green | fixed |
| Cancel | runs setEditing(false); setTitle(own?.tit… | button | Red | fixed |

## app/[slug]/_components/guest-doorway-strip.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Walk the room in 3D → | goes to venueWalk | text link | link — stays a link | fixed |
| {icon} {title} {detail} | goes to href | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/guest-hub-bar.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Live hub | goes to hubHref | button | Grey | fixed |
| Account | goes to /dashboard/profile | button | Grey | fixed |
| My QR | runs setQrOpen(true) | button | Grey | fixed |
| Camera | goes to cameraHref | button | Terracotta | fixed |
| Photos 99+ | goes to galleryHref | button | ? (meaning not evident from label) | fixed |
| ‹dynamic label› | runs setQrOpen(false) | clickable element | Grey | fixed |
| Close | runs setQrOpen(false) | icon-only | Grey | fixed |
| Lost your QR? Get a new one | runs setRotateTyped(''); setRotateConfirm… | button | Terracotta | fixed |
| Yes, replace my QR | runs startRotate(async () => { try { cons… | button | Green | fixed |
| Cancel | runs setRotateConfirming(false) | button | Red | fixed |
| My QR | runs onOpenQr | button | Terracotta | fixed |
| Photos of you 99+ | goes to photosHref | button | ? (meaning not evident from label) | fixed |

## app/[slug]/_components/guest-me-parts.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {card.cta} | goes to card.href | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/guest-ticket.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {LANDING_WORDS.reply} | goes to replyHref | button | Blue | themed |

## app/[slug]/_components/hub-auto-run.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Play / Pause | runs setStopped((s) => !s) | button | Grey | fixed |

## app/[slug]/_components/hub/hub-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Live hub sections | custom control | clickable element | ? (meaning not evident from label) | fixed |
| {m.label} ×2 | runs select(m.key) | button | Grey | fixed |
| More | runs setMoreOpen((v) => !v) | button | Grey | fixed |
| ‹dynamic label› | runs setMoreOpen(false) | clickable element | Grey | fixed |
| Close | runs setMoreOpen(false) | icon-only | Grey | fixed |
| {label} | runs onClick | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/in-app-bar.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {LANDING_WORDS.inAppChrome} | goes to handoff.href | text link | link — stays a link | fixed |
| {LANDING_WORDS.inAppSafari} | goes to handoff.safariHref | text link | link — stays a link | fixed |
| {LANDING_WORDS.openInApp} | goes to handoff.appHref | text link | link — stays a link | fixed |

## app/[slug]/_components/invitation-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Close — back to Setnayan | goes to exitHref | icon-only | Grey | fixed |

## app/[slug]/_components/live-wall-block.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open this photo | runs setOpenedId(tile.feedId) | icon-only | Grey | fixed |
| save photo | custom control | button | Green | fixed |
| Open full size to save | goes to opened.url | button | Green | fixed |

## app/[slug]/_components/not-you-switch.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Switch | submits its form | button | Grey | fixed |

## app/[slug]/_components/our-love-story-styles.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {s.when \|\| s.chapterLabel} | runs setOpen(i) | button | Grey | fixed |

## app/[slug]/_components/owner-ribbon.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {model.editorLabel} | goes to model.editorHref | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/pahina-masthead.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| (icon only) | goes to card.hubHref | icon-only | link — stays a link | fixed |

## app/[slug]/_components/photos-of-you-gallery.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open this photo | runs setOpenedId(p.id) | icon-only | Grey | fixed |
| Not me | submits its form | button | Grey | fixed |
| Open full size to save | goes to opened.url | button | Green | fixed |
| Take it down | runs setOpen(true) | button | Red | fixed |
| Cancel | runs setOpen(false) | button | Red | fixed |
| Send it | submits its form | button | Blue | fixed |
| Take it off the wall / Put it back on the wall | runs press | button | Red | fixed |

## app/[slug]/_components/preview-way-back.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Back to the Maker | goes to href | button | Grey | fixed |

## app/[slug]/_components/private-landing.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Sign in | goes to /login?next=${encodeURIComponent(/${… | text link | link — stays a link | fixed |

## app/[slug]/_components/provider-stall.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Try again | runs window.location.reload() | button | Amber | fixed |

## app/[slug]/_components/public-event-day-bar.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Live hub | goes to hubHref | button | Grey | fixed |
| Camera | goes to /papic/guest | button | Terracotta | fixed |
| Photos | goes to photosHref | button | ? (meaning not evident from label) | fixed |

## app/[slug]/_components/reveal/rigid-stage.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Drag the seal away to open the invitation | button, no inline handler | icon-only | Grey | fixed |

## app/[slug]/_components/roam-watch-picker.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open on YouTube | goes to watchUrl | text link | link — stays a link | fixed |
| Main Stage directed | runs pickMain | button | ? (meaning not evident from label) | fixed |
| ‹dynamic label› | runs pickZone(zone.zoneIndex) | button | Grey | fixed |
| {cam.label} | runs pickGuestCamera(cam.slot) | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/room-footer.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {l.label} | goes to l.href | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/rsvp-one-at-a-time.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| ‹ Back | runs onBack | button | Grey | fixed |
| Next | runs onNext | button | Terracotta | themed |

## app/[slug]/_components/rsvp-sheet.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Close | runs closeSheet | button | Grey | fixed |

## app/[slug]/_components/rsvp-widget.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Send my reply | submits its form | button | Green | themed |
| Save details / Save RSVP | submits its form | button | Green | themed |
| Terms | goes to /terms | text link | link — stays a link | fixed |
| Privacy Notice | goes to /privacy | text link | link — stays a link | themed |
| Send | submits its form | button | Blue | themed |
| Not coming after all | submits its form | button | Red | themed |

## app/[slug]/_components/save-the-date-film.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Add to calendar | goes to content.icsHref ?? content.gcalUrl ?… | text link | Grey | fixed |
| See our page ↓ | runs window.dispatchEvent(new CustomEvent… | button | Grey | themed |
| {muted ? :} [muted ? 'Unmute sound' : 'Mute sound'] | runs toggleMute | button | Grey | fixed |
| See our page ↓ | runs window.dispatchEvent(new CustomEvent… | button | Grey | fixed |
| Add to calendar | goes to content.icsHref ?? content.gcalUrl ?… | button | Grey | fixed |
| Continue | runs if (audioRef.current && audioRef.cur… | button | Terracotta | fixed |
| Tap for sound | runs enableVideoSound | button | Grey | fixed |

## app/[slug]/_components/save-the-date.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Add to Google Calendar | goes to gcalUrl | button | Terracotta | fixed |
| Apple / Outlook (.ics) | goes to icsDataHref(ics) | button | Grey | fixed |

## app/[slug]/_components/save-to-account.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Sign in to your account | goes to /login?next=${encodeURIComponent(/jo… | button | Terracotta | themed |
| Yes, save to my account | submits its form | button | Grey | themed |
| Terms | goes to /terms | text link | link — stays a link | fixed |
| Privacy Notice | goes to /privacy | text link | link — stays a link | fixed |
| Save to my account {saveMethodLine(method)} — {carries} | submits its form | button | Grey | themed |
| Save | submits its form | button | Green | themed |

## app/[slug]/_components/scan-trail-notice.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Keep a record again / Stop keeping a record | submits its form | button | Terracotta | fixed |

## app/[slug]/_components/scene-clip.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| ▶ | runs start | button | Grey | fixed |

## app/[slug]/_components/schedule-styles.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {dialTime(m.minuteOfDay!)} {m.label} [`{m.timeLabel} · {m.label}`] | runs setOpenId(m.id) | button | Grey | fixed |

## app/[slug]/_components/schedule-widget.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Fewer moments / All {ordered.length} moments ↑ / → | runs setShowAll((v) => !v) | button | Grey | fixed |

## app/[slug]/_components/seat-door-line.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {label} → | goes to /${slug}/find-seat | text link | link — stays a link | fixed |

## app/[slug]/_components/selfie-capture.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Not now | runs onClose | icon-only | Grey | fixed |
| Details | runs setDetails(true) | icon-only | Grey | fixed |
| {working ? : null} Take selfie | runs void takeSelfie() | button | Terracotta | fixed |
| Got it | runs setDetails(false) | button | Grey | fixed |

## app/[slug]/_components/selfie-no-thanks-confirm.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {SELFIE_DELETE_CONFIRM.yes} | runs setConfirmed(true) | button | Green | themed |
| {SELFIE_DELETE_CONFIRM.keep} | runs keep | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/send-their-invite.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {label} | runs send | button | Blue | fixed |

## app/[slug]/_components/site-body.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Your keepsake reel → | goes to recapKeepsakeHref | text link | link — stays a link | fixed |
| Find your seat | goes to /${event.slug}/find-seat | button | Terracotta | fixed |
| Sign out of this invitation | submits its form | button | Red | fixed |
| See them | goes to hubTabHref('gallery') | text link | link — stays a link | fixed |
| {v.displayName} | goes to /v/${v.businessSlug | text link | link — stays a link | fixed |
| Save | submits its form | button | Green | themed |
| {rsvpSheetTrigger({ status: guest.…} &rarr; | goes to #your-details | text link | link — stays a link | fixed |
| Update your details / Change your reply | goes to #your-details | button | Blue | themed |
| {c.title} | goes to c.href | text link | link — stays a link | fixed |

## app/[slug]/_components/site-menu-bar.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {slot.label} [`{slot.label} — {slot.lockedReason ?? 'not available y… ×3 | runs setOpenReason(slot.lockedReason ?? n… | button | Grey | fixed |
| {slot.label} | goes to slot.href | text link | link — stays a link | fixed |
| {slot.label} | goes to cameraHrefWithBack(slot.href, active… | text link | link — stays a link | fixed |
| {slot.label} | goes to isCamera ? cameraHrefWithBack(slot.h… | text link | link — stays a link | fixed |
| {openReason} | runs setOpenReason(null) | button | Grey | fixed |

## app/[slug]/_components/song-request-card.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {pending ? : null} Send to the band | submits its form | button | Blue | themed |

## app/[slug]/_components/spotlight-card.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {content.eyebrow} {content.title} | goes to content.href | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/std-film-handoff.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Watch our film again | runs setShowFilm(true); window.dispatchEv… | button | Grey | fixed |

## app/[slug]/_components/story/back-cover.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {cover.door.label} | goes to cover.door.href | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/story/find-in-this-day.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Find | runs (open ? close(true) : setOpen(true)) | button | Terracotta | fixed |
| Close the search | runs close(true) | icon-only | Grey | fixed |
| ‹dynamic label› | runs jump | button | Grey | fixed |
| {h.stamp} | runs goTo(h) | button | Terracotta | fixed |

## app/[slug]/_components/story/relive.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| ▶ Relive it | runs setI(0); setProgress(0); setOpen(tru… | button | Grey | fixed |
| Close | runs setOpen(false) | button | Grey | fixed |
| Previous minute | runs go(i - 1) | button | Grey | fixed |
| Next minute | runs go(i + 1) | button | Terracotta | fixed |

## app/[slug]/_components/story/story-clock.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Close | runs close | button | Grey | fixed |
| {openBar.nearLabel} → | runs handler close | text link | Grey | fixed |

## app/[slug]/_components/story/story-index-tabs.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| en-PH | custom control | clickable element | Grey | fixed |
| {t.title} en-PH | runs setActive(t.key) | button | Grey | fixed |
| All / pre / vendors / From the shops | runs setHour(h) | button | Grey | fixed |

## app/[slug]/_components/story/story-index.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {body} | goes to entry.href | text link | link — stays a link | fixed |
| {tile} | goes to entry.href | text link | link — stays a link | fixed |

## app/[slug]/_components/story/story-spine.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {film.label} Watch this minute in the broadcast it went out on → | goes to https://www.youtube.com/watch?v=${fi… | text link | link — stays a link | fixed |

## app/[slug]/_components/story/were-you-there.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {r.a.stamp} {r.a.suffix} {r.a.label} | goes to #${r.a.id | text link | link — stays a link | fixed |
| save story card | custom control | button | Green | fixed |

## app/[slug]/_components/story/your-own-consent.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Hide it, or ask to be unnamed | runs setOpen((v) => !v) | button | Blue | fixed |
| Ask for this one to come down | runs hide | button | Blue | fixed |
| Take my name off what I wrote | runs unname | button | Red | fixed |

## app/[slug]/_components/supplier-desk.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {title} {blurb} | goes to href | text link | link — stays a link | fixed |
| {e.name} | goes to e.href | text link | link — stays a link | fixed |
| Message {words.theOrganizer} The conversation you already have about… | goes to /vendor-dashboard/messages/${desk.th… | text link | Blue | fixed |
| {desk.businessName} | goes to /vendor-dashboard/clients/${desk.ven… | text link | link — stays a link | fixed |

## app/[slug]/_components/supplier-ribbon.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open your desk / Your tools for this event | runs // Retire the film AND the veil with… | button | Grey | fixed |

## app/[slug]/_components/ticket-popup.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Close | runs close | icon-only | Grey | fixed |
| {LANDING_WORDS.saveInSafari} | goes to safariHref | button | ? (dynamic label; meaning set at call site) | themed |
| {LANDING_WORDS.saveTicket} | custom control | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/ticket-row.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {saveLabel} | custom control | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/tier-comparison-widget.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Learn more about Setnayan | goes to https://setnayan.com | button | Grey | themed |
| Sign up free → | goes to /signup | button | Terracotta | themed |

## app/[slug]/_components/use-on-profile.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Use this on your profile | runs setStep('confirm') | button | Green | fixed |
| Use it | runs confirmUse | button | Terracotta | themed |
| Not now | runs setStep('gone') | button | Grey | fixed |

## app/[slug]/_components/vendor-doorway.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| You are booked here Open your tools for this event as {' '} {capabil… | goes to /vendor-dashboard/clients/${capabili… | button | Grey | fixed |

## app/[slug]/_components/venue-styles.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| © OpenStreetMap | goes to https://www.openstreetmap.org/copyri… | text link | link — stays a link | fixed |
| {a.name} | goes to a.href | text link | link — stays a link | fixed |

## app/[slug]/_components/watch-live-block.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Watch on Facebook | goes to href | button | Grey | fixed |

## app/[slug]/_components/watch-live-embed.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open on YouTube | goes to watchUrl | text link | link — stays a link | fixed |
| Watch on Facebook | goes to facebookUrl | text link | link — stays a link | fixed |

## app/[slug]/_components/your-guests.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {PASS_CARD_WORDS.saveAll} | custom control | button | ? (dynamic label; meaning set at call site) | fixed |
| Add their name | goes to addNamesHref | button | Terracotta | fixed |
| {PASS_CARD_WORDS.saveOf(g.na…} | custom control | button | ? (dynamic label; meaning set at call site) | fixed |

## app/[slug]/_components/your-seat-styles.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| It's on your ticket in Me | goes to hubTabHref('me') | text link | link — stays a link | fixed |

## app/[slug]/_components/your-shots-gallery.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Everyone's photos &rarr; | goes to everyoneHref | text link | link — stays a link | fixed |
| Open full size to save | goes to /papic/me/${encodeURIComponent(qrTok… | text link | Green | fixed |

## app/[slug]/avatar/_components/avatar-maker.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {children} [ariaLabel] | runs onClick | button | ? (dynamic label; meaning set at call site) | fixed |
| name | runs onClick | icon-only | ? (meaning not evident from label) | fixed |
| Chibi | runs pickStyle('chibi') | button | ? (meaning not evident from label) | fixed |
| Heritage | runs pickStyle('heritage') | button | ? (meaning not evident from label) | fixed |
| Blocky | runs pickStyle('blocky') | button | ? (meaning not evident from label) | fixed |
| {label(b)} | runs set('bodyType', b) | button | Grey | fixed |
| Skin {hex} | runs set('skinTone', hex) | clickable element | Grey | fixed |
| {label(h)} | runs set('hairStyle', h) | button | Grey | fixed |
| Hair {hex} | runs set('hairColor', hex) | clickable element | Grey | fixed |
| {label(e)} | runs set('eyes', e) | button | Grey | fixed |
| {label(m)} | runs set('mouth', m) | button | Grey | fixed |
| {label(m)} | runs set('mark', m) | button | Grey | fixed |
| {label(o)} | runs set('outfit', o) | button | Grey | fixed |
| {c.name} | runs set('outfitColor', c.hex) | clickable element | Grey | fixed |
| {label(a)} | runs set('accessory', a) | button | Grey | fixed |
| {label(b)} | runs setH('bodyType', b) | button | Grey | fixed |
| Skin {hex} | runs setH('skinTone', hex) | clickable element | Grey | fixed |
| Crop / Short / Side-swept / Bob / Shoulder / Long / Style {h + 1} | runs setH('hairStyle', h) | button | Grey | fixed |
| Hair {hex} | runs setH('hairColor', hex) | clickable element | Grey | fixed |
| {label(o)} | runs setH('outfit', o) | button | Grey | fixed |
| {c.name} | runs setH('outfitColor', c.hex) | clickable element | Grey | fixed |
| Save / Saved | runs onSave | button | Green | fixed |
| Remove my avatar | runs onReset | button | Red | fixed |
| See me in the room → | goes to /${slug}/venue | text link | link — stays a link | fixed |

## app/[slug]/avatar/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| ← Back | goes to /${slug | text link | link — stays a link | fixed |

## app/[slug]/error.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Try again | runs reset() | button | Amber | fixed |

## app/[slug]/everyone/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Back to the invitation | goes to /${slug | text link | link — stays a link | fixed |

## app/[slug]/find-my-table/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Back to your invitation | goes to /${slug | button | Grey | fixed |
| Setnayan | goes to /${slug | text link | link — stays a link | fixed |

## app/[slug]/find-seat/_components/door-pass.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Show at the door | runs setOpen(true) | button | Grey | themed |
| Close the door pass | runs setOpen(false) | icon-only | Grey | fixed |

## app/[slug]/find-seat/_components/name-search.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| × | runs clear | button | Grey | fixed |
| Try again | runs tryAgain | button | Amber | fixed |
| Find my table | submits its form | button | Terracotta | fixed |
| Hide the walk / Watch the walk to your table | runs setWalkOpen((v) => !v) | button | Terracotta | fixed |

## app/[slug]/find-seat/_components/seat-back-link.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {children} [ariaLabel] | goes to target | text link | link — stays a link | fixed |

## app/[slug]/find-seat/_components/seat-frame.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Get inside | goes to /${slug | text link | link — stays a link | fixed |

## app/[slug]/find-seat/_components/your-seat.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Walk the room in 3D | goes to href | text link | link — stays a link | fixed |

## app/[slug]/hub/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Back to the event page | goes to /${event.slug | icon-only | Grey | fixed |
| See the venue map → | goes to /${event.slug}/find-my-table | text link | link — stays a link | fixed |
| ‹dynamic label› | goes to doorways.venueWalk | button | Grey | fixed |
| E-Gifts : giftIsMoneyDance(words) ? · | goes to doorways.pabuya | button | ? (meaning not evident from label) | fixed |
| Open your camera roll | goes to rollHref | button | Grey | fixed |
| Be a candid camera | goes to candidHref | button | Terracotta | fixed |
| See all ({galleryTotal}) → | goes to /papic/me/${guest.qr_token | text link | link — stays a link | fixed |
| See the recap gallery → | goes to recapHref | button | Grey | fixed |

## app/[slug]/invite/_components/landing-pre-reply.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {LANDING_WORDS.reply} | goes to replyHref | button | Blue | themed |

## app/[slug]/invite/enter/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open your invitation | goes to href | text link | link — stays a link | fixed |
| {LANDING_WORDS.reply} | goes to inviteReplyPath(home) | button | Blue | themed |
| {LANDING_WORDS.saveInSafari} | goes to safariSave | button | ? (dynamic label; meaning set at call site) | themed |
| {justIn ? REQUEST_WORDS.save…} | custom control | button | Green | fixed |
| {destinationWords.cta} | goes to openBeforeReplyHref(home) | text link | link — stays a link | fixed |
| {destinationWords.cta} | goes to /${home | text link | link — stays a link | fixed |
| {changeWords} | goes to inviteReplyPath(home) | text link | link — stays a link | fixed |

## app/[slug]/invite/reply/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open your invitation and your QR | goes to inviteEnterPath(home) | text link | link — stays a link | fixed |

## app/[slug]/not-found.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Sign in | goes to /login | button | Terracotta | fixed |
| Take me home | goes to / | button | Grey | fixed |

## app/[slug]/pabuya/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| (icon only) | goes to /${slug | icon-only | link — stays a link | fixed |
| Our gift registry ↗ | goes to registryHref | text link | link — stays a link | fixed |

## app/[slug]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open your invitation | goes to redeemHref | text link | link — stays a link | fixed |

## app/[slug]/print/print-toolbar.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Back to the story | goes to backHref | text link | link — stays a link | fixed |
| a4 / Switch to A4 booklet / Switch to A3 sheet | goes to switchHref | text link | link — stays a link | fixed |
| Print / Save as PDF | runs window.print() | button | Green | fixed |

## app/[slug]/recap/_components/save-story-card-button.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Saved / Story | runs onClick | button | Green | fixed |
| Saved / Save story card | runs onClick | button | Green | fixed |

## app/[slug]/recap/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open their page | goes to /${event.slug | button | Grey | fixed |
| `{model.coupleNames} — the day, in their words. A Setnayan recap.` | custom control | clickable element | ? (meaning not evident from label) | fixed |
| save story card | custom control | button | Green | fixed |

## app/[slug]/request/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| {REQUEST_WORDS.back} | goes to /${home | button | Grey | themed |

## app/[slug]/seat/_components/arrival-bloom.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Show my seat | runs setPlay((n) => n + 1) | button | Grey | fixed |

## app/[slug]/seat/_components/guest-push-prompt.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Turn on alerts | runs handleEnable | button | Grey | fixed |
| Not now | runs handleDismiss | button | Grey | fixed |
| Dismiss | runs handleDismiss | icon-only | Grey | fixed |

## app/[slug]/seat/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Open your invitation | goes to /${slug | text link | link — stays a link | fixed |
| Setnayan | goes to /${slug | text link | link — stays a link | fixed |
| Make your avatar for the 3D room → | goes to avatarHref | text link | link — stays a link | fixed |
| Back to your invitation | goes to /${slug | button | Grey | fixed |

## app/[slug]/venue/_components/guest-venue-3d.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| 👋 Say hi | runs sharedRoom.greet(null) | button | Blue | fixed |

## app/[slug]/venue/page.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| Try again | goes to /${slug}/venue | button | Amber | fixed |
| ← Back to the {noun} | goes to /${slug | button | Grey | fixed |
| Make your avatar | goes to /${slug}/avatar | text link | link — stays a link | fixed |
| ← Back | goes to /${slug | text link | link — stays a link | fixed |

## app/[slug]/welcome/_components/plus-one-door.tsx

| Label (as the user sees it) | What it does | Today | Colour | Hub theme |
|---|---|---|---|---|
| just show my {PASS_CARD_WORDS.noun} | submits its form | button | Grey | fixed |
| Open the invitation | goes to /${home | text link | link — stays a link | fixed |
| Save | submits its form | button | Green | themed |
| This isn't me — I scanned the wrong code | submits its form | button | Grey | fixed |

## app/_components/account-switcher/account-switcher.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| switcher plaque trigger | custom control | button | ? (meaning not evident from label) |
| ‹dynamic label› | link | text link | link — stays a link |
| {homeLabel} | runs handler close | text link | Grey |
| Shop | runs handler close | text link | Terracotta |
| HQ Setnayan | runs handler close | text link | Grey |
| Profile & settings | runs handler close | text link | Grey |
| Your Story | runs handler close | text link | Grey |
| Refer a couple | runs handler close | text link | Terracotta |
| Create your shop | runs handler close | text link | Terracotta |
| Secure your plan | runs handler close | text link | Terracotta |
| Sign out | submits its form | button | Red |
| Account switcher | runs setOpen((v) => !v) | clickable element | Grey |
| Open account switcher | runs setOpen((v) => !v) | button | Grey |
| Close account switcher | runs close | icon-only | Grey |
| Open account switcher | runs onToggle | icon-only | Grey |
| ‹dynamic label› | custom control | button | Grey |
| {chip} {title} rgba(243,236,223,.6) | runs setOpen((v) => !v) | button | Grey |
| account switcher icon trigger | custom control | button | Grey |
| Close account menu | runs close | icon-only | Grey |

## app/_components/alaala/lens-body.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {media} [label] ×2 | goes to href | text link | link — stays a link |
| Open People | goes to /dashboard/people | text link | link — stays a link |

## app/_components/amendment-builder.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| × | runs remove(i) | button | Red |
| + Add item | runs add | button | Terracotta |
| {submitLabel} | custom control | button | ? (dynamic label; meaning set at call site) |
| Cancel | runs onCancel | button | Red |

## app/_components/amendment-suggest-chip.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| 🧾 Send a deal | runs setOpen(true) | button | Blue |

## app/_components/anon-gate/save-to-continue.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Close ×2 | runs onClose | icon-only | Grey |
| Create a free account | goes to /signup?next=${next | button | Terracotta |
| I already have an account | goes to /login?next=${next | button | Grey |

## app/_components/app-store/choose-plan-sheet.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {triggerLabel} | runs setOpen(true) | button | Grey |
| Close plan picker | runs setOpen(false) | icon-only | Grey |
| Close | runs setOpen(false) | icon-only | Grey |
| Tick the box above to continue | button, no inline handler | button | Terracotta |

## app/_components/app-store/layout.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {back.label} | goes to back.href | button | Grey |
| ‹dynamic label› | goes to reviews.href | button | Grey |
| {inner} | goes to sample.href | text link | link — stays a link |

## app/_components/app-store/state-cta.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | goes to setupHref | text link | link — stays a link |
| {launchLabel} | goes to context.href ?? '#' | button | ? (dynamic label; meaning set at call site) |
| Verifying | goes to context.href ?? '#' | button | Green |

## app/_components/app-store/studio-card-demo.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Save as my monogram | button, no inline handler | button | Green |
| Draw my monogram live | button, no inline handler | button | Terracotta |
| Save palette | button, no inline handler | button | Green |
| Download | button, no inline handler | button | Grey |
| Connect Google Drive | button, no inline handler | button | Terracotta |
| Release to Drive | button, no inline handler | button | Terracotta |
| Open in Drive | button, no inline handler | button | Grey |
| Render reel | button, no inline handler | button | Terracotta |
| Download reel | button, no inline handler | button | Grey |
| Save entrance | button, no inline handler | button | Green |
| See your matches | button, no inline handler | button | Grey |
| Customize | button, no inline handler | button | Grey |
| Save RSVP | button, no inline handler | button | Green |
| Open | button, no inline handler | button | Grey |
| Make a custom track | button, no inline handler | button | Terracotta |
| Continue to payment · ₱2,500 | button, no inline handler | button | Green |
| Add | button, no inline handler | button | Terracotta |
| {playing ? ( ) : ( )} [playing ? 'Pause demo' : 'Play demo'] | runs setPlaying((p) => !p) | button | Grey |
| `Step {k + 1}` | runs setI(k) | icon-only | ? (meaning not evident from label) |

## app/_components/appointment-join.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Join now / Join | runs join | button | Terracotta |

## app/_components/appointments-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Propose a meeting | runs setOpen(true) | button | Blue |
| {APPOINTMENT_KIND_LABEL[k]} | runs setMode(k) | button | Grey |
| {p.label} | runs pickPreset(p) | button | Amber |
| Custom | runs setSelectedType('custom') | button | ? (meaning not evident from label) |
| Propose meeting | submits its form | button | Blue |
| Cancel | runs setOpen(false) | button | Red |
| appointment join | custom control | button | Terracotta |
| Directions | goes to directionsUrl(a.location) | button | Grey |
| Add to calendar | goes to icsHref | button | Grey |
| Confirm | submits its form | button | Green |
| Propose new time | runs setProposingNew(true) | button | Blue |
| Decline | submits its form | button | Red |
| Send new time | submits its form | button | Blue |
| Cancel | runs setProposingNew(false) | button | Red |
| Withdraw | submits its form | button | Red |
| Cancel meeting | submits its form | button | Red |

## app/_components/auth/sign-in-here-link.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) ×2 | custom control | icon-only | ? (no visible label in code) |
| (icon only) ×2 | link | icon-only | link — stays a link |
| ‹dynamic label› | link | text link | link — stays a link |
| {children} [title] | runs handler (e) => { // Let the browser handle t… | text link | Grey |

## app/_components/auth/sign-in-here-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ✕ | runs onClose | button | Red |

## app/_components/auth/sign-in-here.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Sign in | runs handler (e) => { e.preventDefault(); openSig… | text link | Terracotta |

## app/_components/back-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | link | text link | link — stays a link |
| {label} | goes to href | button | ? (dynamic label; meaning set at call site) |

## app/_components/booking-fee-notice.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {cta.label} | goes to cta.href | text link | link — stays a link |
| Pay now | goes to vendorBookingFeePayPath(bill.orderId) | button | Green |
| All booking fees | goes to VENDOR_BOOKING_FEES_PATH | text link | link — stays a link |

## app/_components/chat-amendment-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Mark delivered | custom control | button | Green |
| Accept all | custom control | button | Green |
| Counter | runs setCounterOpen((v) => !v) | button | Blue |
| Decline | custom control | button | Red |
| Book this deal — ₱ en-PH | custom control | button | Green |

## app/_components/chat-appointment-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Accept | custom control | button | Green |
| Propose new time | runs setReviseOpen((v) => !v) | button | Blue |
| Decline | custom control | button | Red |
| Send new time | custom control | button | Blue |

## app/_components/chat-message-stream.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {quoteState.primary.label} | goes to /proposals/${card.publicId | button | ? (dynamic label; meaning set at call site) |
| Ask {counterpartyLabel} to confirm your booking / Book {counterparty… | custom control | button | Green |
| Book on your Suppliers page | goes to lockTarget.benchHref | button | Green |
| Update this quote | goes to reviseHref | button | Blue |
| Counter-offer | goes to counterHref | button | Blue |
| Confirm it reached you | submits its form | button | Green |
| 📄 Jump to the quote | runs scrollToLatestQuote | button | Blue |
| ↓ Latest messages | runs scrollToBottom('smooth') | button | Grey |
| (icon only) | goes to url | icon-only | link — stays a link |
| {label} | goes to url | button | ? (dynamic label; meaning set at call site) |

## app/_components/chat-privacy-notice.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Less / More | runs setMore((v) => !v) | button | Grey |
| Less / Tips | runs setTips((v) => !v) | button | ? (meaning not evident from label) |
| Dismiss safety tips | runs onDismiss | icon-only | Grey |

## app/_components/chat-send-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove attachment | runs clearFile | icon-only | Red |
| Send | submits its form | icon-only | Blue |

## app/_components/chat-thread-menu.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Conversation options | runs setOpen((v) => !v); setShowReport(fa… | icon-only | Grey |
| {l.label} | goes to l.href | button | ? (dynamic label; meaning set at call site) |
| Report this conversation | runs setShowReport(true) | button | Blue |
| Unblock this person / Block this person | submits its form | button | Grey |
| Back | runs setShowReport(false) | icon-only | Grey |
| Send report | submits its form | button | Blue |

## app/_components/chat-thread-views.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | runs onChange(key) | button | Grey |
| Accept | submits its form | button | Green |
| Decline ×2 | submits its form | button | Red |
| Apply {s > 0 ? '+' : '−'}{formatPhp(Math.abs(s))} / Apply the new co… | submits its form | button | Terracotta |
| Hold the price | submits its form | button | Green |
| See the quote → | goes to /proposals/${reply.publicId | text link | link — stays a link |
| Open | goes to f.href | button | Grey |
| Confirm received | submits its form | button | Green |
| Not received | runs setNotReceivedOpen((v) => !v) | button | Amber |
| Tell them it hasn’t arrived | submits its form | button | Terracotta |
| Confirm | submits its form | button | Green |
| New time | runs setNewTimeOpen((v) => !v) | button | Terracotta |
| Send new time | submits its form | button | Blue |

## app/_components/chat/conversation-column.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹ Back | goes to backHref | text link | link — stays a link |
| {f.label} | runs setFilter(f.key) | button | Grey |
| ‹dynamic label› | goes to ${hrefBase}/${r.threadId | text link | link — stays a link |

## app/_components/chat/reveal-tool-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| text | runs revealThreadTool(reveal) | icon-only | ? (meaning not evident from label) |

## app/_components/chat/thread-archive-toggle.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {archived ? ( ) : ( )} [archived ? 'Unarchive conversation' : 'Archi… | submits its form | button | Grey |

## app/_components/chat/thread-list-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) | goes to href | icon-only | ? (no visible label in code) |

## app/_components/chosen-proof-field.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| `Open {chosen.name} full size` | goes to chosen.objectUrl | text link | link — stays a link |
| Remove | runs onRemove | button | Red |

## app/_components/collection-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {children} | goes to href | text link | link — stays a link |
| {label} ×2 | goes to href | button | ? (dynamic label; meaning set at call site) |
| {l.label} | goes to l.href | button | ? (dynamic label; meaning set at call site) |

## app/_components/confirm-dialog.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {title} {body} {cancelLabel} {confirmLabel} | runs (e) => { // Backdrop click closes — … | clickable element | Grey |
| {cancelLabel} | runs onCancel | button | Grey |
| {confirmLabel} | runs onConfirm | button | Green |
| Delete | runs handleDelete | button | Red |

## app/_components/contracts/contract-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {title} {subtitlePrefix} {subtitleName} · {' '} en-PH / numeric / sh… | goes to href | text link | link — stays a link |

## app/_components/cookie-consent-banner.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Cookie policy | goes to /cookies | text link | link — stays a link |
| Accept all | runs choose(true) | button | Green |
| Essential only | runs choose(false) | button | Grey |
| Manage | runs setManage(true) | button | Grey |
| Learn more | goes to /cookies | text link | link — stays a link |
| Save | runs choose(analytics) | button | Green |

## app/_components/copy-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| `{label}: {value}` | runs async () => { try { await navigator.… | icon-only | ? (meaning not evident from label) |

## app/_components/demo-mode-banner-client.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Dismiss demo-mode banner for this session | runs onDismiss | icon-only | Grey |

## app/_components/desktop-oauth-buttons.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| google google / {verb} Google | runs run('google') | button | Terracotta |
| apple apple / {verb} Apple | runs run('apple') | button | ? (meaning not evident from label) |
| facebook facebook / {verb} Facebook | runs run('facebook') | button | Green |

## app/_components/door/door-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Setnayan home | goes to / | text link | link — stays a link |
| Made with Setnayan | goes to / | button | Grey |

## app/_components/drive-connect-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {primaryLabel} | goes to connectHref | button | ? (dynamic label; meaning set at call site) |
| {deferLabel} | goes to deferHref | text link | link — stays a link |
| Reconnect Drive | goes to reconnectHref | button | Amber |

## app/_components/encoder-key-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Hide / Reveal | runs setShowKey((s) => !s) | button | Grey |
| Copy | custom control | button | Grey |
| Save to encoder | submits its form | button | Green |
| Connect encoder | runs handleConnect | button | Terracotta |

## app/_components/event-day-prep-cta.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Try again / Prepare for event day / Pre-loading… | runs onClick | button | Amber |

## app/_components/facebook-dual-stream-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove Facebook link | submits its form | button | Red |
| Save Facebook link | submits its form | button | Green |

## app/_components/file-upload.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Remove | runs removeItem(item.id) | button | Red |
| `Remove {item.filename}` ×2 | runs removeItem(item.id) | icon-only | Red |
| `Cancel {item.filename}` ×2 | runs cancelInFlight(item.id) | icon-only | Red |

## app/_components/follow-gate.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Following{pending ? '…' : ''} / Follow{pending ? '…' : ''} | runs onToggle | button | Terracotta |
| Message | custom control | button | Blue |
| Start an event to message | goes to /dashboard | button | Blue |

## app/_components/frontdoor/discover-event-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {card.title} | goes to card.href | text link | link — stays a link |
| Ask to join | goes to card.askHref | text link | link — stays a link |

## app/_components/frontdoor/discover-follow-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Following / Follow | runs onClick | button | Terracotta |

## app/_components/frontdoor/front-door-anchor.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start your celebration — free | goes to /onboarding/wedding?from=home | button | Terracotta |
| How it works | goes to /our-story | text link | link — stays a link |

## app/_components/frontdoor/front-door-discover.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {go} &rarr; | goes to href | text link | link — stays a link |
| {p.name} | goes to /u/${p.slug | text link | link — stays a link |
| {p.name} | custom control | button | ? (dynamic label; meaning set at call site) |

## app/_components/frontdoor/front-door-feed.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {a.readingMinutes} min SN {a.title} Article Setnayan {a.category} | goes to /blog/${a.slug | text link | link — stays a link |
| {name} | goes to /u/${slug | text link | link — stays a link |
| {s.title} | goes to s.href | text link | link — stays a link |
| {initialsOf(s.name)} {s.name} {s.folderLabel} · verified | goes to s.href | text link | link — stays a link |
| Open your shop &rarr; | goes to /open-shop | text link | link — stays a link |
| New uploads | goes to /realstories | text link | link — stays a link |
| See how sharing works &rarr; | goes to /realstories | text link | link — stays a link |
| See all articles &rarr; | goes to /blog | text link | link — stays a link |
| Browse all stories &rarr; | goes to /realstories | text link | link — stays a link |

## app/_components/frontdoor/front-door-results.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| SN {hit.title} {hit.tag} | goes to hit.href | text link | link — stays a link |
| ‹dynamic label› | goes to s.href | text link | link — stays a link |
| {initialsOf(item.label)} {initialsOf(item.label)} {item.label} Yours… | goes to item.href | text link | link — stays a link |
| Clear | goes to / | text link | link — stays a link |
| Search suppliers for &ldquo; {query} &rdquo; &rarr; | goes to /explore?q=${encodeURIComponent(query) | text link | link — stays a link |

## app/_components/frontdoor/front-door-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› ×3 | custom control | button | Grey |
| ‹dynamic label› | goes to /login | text link | link — stays a link |
| ☰ | runs (railOpen ? closeRail() : openRail()) | button | Grey |
| Setnayan ×2 | goes to homeHref | text link | link — stays a link |
| + Create event | goes to /dashboard/create-event | button | Terracotta |
| 🔔 | goes to /dashboard/notifications | text link | link — stays a link |
| {account.initials} [Your account] | runs setMenuOpen((v) => !v) | button | Grey |
| Sign in ×2 | runs handler onSignInPress | text link | Terracotta |
| {focus.label} {focus.caption} | goes to focus.href | text link | link — stays a link |
| Discover Discover | goes to / | text link | link — stays a link |
| (icon only) | goes to /explore | icon-only | link — stays a link |
| Events Events | goes to /dashboard | text link | link — stays a link |
| Memories Memories | goes to /dashboard/library | text link | link — stays a link |
| People People | goes to /dashboard/people | text link | link — stays a link |
| {account.shopName} Shop your shop | goes to /vendor-dashboard | text link | link — stays a link |
| Setnayan HQ HQ admin | goes to /admin | text link | link — stays a link |
| How it works How it works | goes to /our-story | text link | link — stays a link |
| {t.name} {t.name} ×3 | goes to t.href | text link | link — stays a link |
| {t.name} try it {t.name} | goes to t.href | text link | link — stays a link |
| About | goes to /about | text link | link — stays a link |
| Pricing | goes to /pricing | text link | link — stays a link |
| Help | goes to /help | text link | link — stays a link |
| Open your shop | goes to /open-shop | text link | link — stays a link |
| Terms | goes to /terms | text link | link — stays a link |
| Privacy | goes to /privacy | text link | link — stays a link |
| Acceptable use | goes to /acceptable-use | text link | link — stays a link |
| Cookies | goes to /cookies | text link | link — stays a link |
| Refunds | goes to /refunds | text link | link — stays a link |
| Download | goes to /download | text link | Grey |
| Articles | goes to /blog | text link | link — stays a link |
| For storytellers | goes to /creators | text link | link — stays a link |
| For suppliers | goes to /for-suppliers | text link | link — stays a link |
| Search | submits its form | icon-only | Terracotta |
| Your events | goes to /dashboard | text link | link — stays a link |
| Your account | goes to /dashboard/profile | text link | link — stays a link |
| Your shop | goes to /vendor-dashboard | text link | link — stays a link |
| Your photos | goes to /dashboard/library?tab=photos | text link | link — stays a link |
| (icon only) | link | icon-only | link — stays a link |
| Sign out | submits its form | button | Red |

## app/_components/frontdoor/signed-in-cluster.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) | link | icon-only | link — stays a link |

## app/_components/gallery/gallery-lightbox.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | runs onClose | clickable element | Grey |
| Close | runs onClose | icon-only | Grey |

## app/_components/gold-monogram-reveal.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {accentNode} [idle ? 'Open your Save the Date' : undefined] | custom control | clickable element | Grey |

## app/_components/guided-tour-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Skip tour | runs dismiss | icon-only | Grey |
| Back | runs setStep((s) => Math.max(0, s - 1)) | button | Grey |
| Skip | runs dismiss | button | Grey |
| Got it | runs dismiss | button | Grey |
| Next | runs setStep((s) => Math.min(slides.lengt… | button | Terracotta |

## app/_components/home/alaala-editorial-overlay.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | runs handler onClose | text link | Grey |

## app/_components/home/HomeOverlays.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ✕ | runs onClose | button | Red |
| See all free features & prices → | runs handler onClose | text link | Grey |
| ⌘ macOS Apple silicon & Intel · .dmg | runs handler onClose | text link | Grey |
| ⊞ Windows 64-bit · .msi | runs handler onClose | text link | Grey |
| ◍ Web app · PWA Install from your browser | runs handler onClose | text link | Terracotta |
| See all {TOTAL_VENDOR_BENEFIT_LABEL} supplier benefits {' '} → | runs handler onClose | text link | Grey |
| {label} | runs setMode(k) | button | Grey |
| Turn on Setnayan AI | runs handler onClose | text link | Grey |
| See the full story → | runs onOpenStory | button | Grey |
| See the full story → | runs handler onClose | text link | Grey |

## app/_components/home/panood-demo-overlay.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {audioOn && programHasAudio ? ( ) …} SOUND / MUTED | runs setAudioOn((v) => !v) | button | Grey |
| End broadcast / Go live | runs setDemoOnAir((v) => !v) | button | Red |
| Connecting… / Couldn’t connect / Waiting for a scan {SLOT_LABEL[slot… | runs live && cut(slot) | button | Terracotta |

## app/_components/home/papic-demo-overlay.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {s.label} | runs pickStyle(s.id) | button | ? (dynamic label; meaning set at call site) |

## app/_components/home/plan3d-demo-overlay.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Apply mood board | runs setThemed((v) => !v) | button | Terracotta |
| ● Walking the room / Walk around | runs setRoaming((v) => !v) | button | Terracotta |
| Back to seat | runs setReturnSignal((n) => n + 1) | button | Grey |
| No phone? Open the demo here | goes to qr.joinUrl | text link | link — stays a link |

## app/_components/info-tip.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| i | runs dispatch({ type: 'click' }) | button | Grey |

## app/_components/inspector/inspector-column.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| inspector trigger | custom control | button | ? (meaning not evident from label) |
| Back to the list | runs onClose | icon-only | Grey |
| {children} | runs (e) => { if (!ctx \|\| !inspectId \|\| !… | button | Grey |
| {children} | runs handler onClick | text link | ? (dynamic label; meaning set at call site) |
| Close details | runs ctx?.close() | icon-only | Grey |
| {fullLabel} | goes to fullHref | text link | link — stays a link |

## app/_components/last-seen/last-seen-mark.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Try again | runs window.location.reload() | button | Amber |

## app/_components/legal/cookie-settings-link.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {children} | runs openConsentManager() | button | Terracotta |

## app/_components/live-studio-recordings-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Watch on YouTube | goes to rec.watchUrl | button | Grey |

## app/_components/lock-answer-forms.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Agree to this booking | submits its form | button | Green |
| Turn it down | submits its form | button | Red |

## app/_components/marketing/_doorway.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {primary.label} | goes to primary.href | text link | link — stays a link |
| {secondary.label} | goes to secondary.href | text link | link — stays a link |
| {demo.label} | custom control | button | ? (dynamic label; meaning set at call site) |
| {closing.label} | goes to closing.href | text link | link — stays a link |

## app/_components/marketing/add-to-event-cta.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {primary.label} ×2 | goes to primary.href | text link | link — stays a link |

## app/_components/marketing/add-to-event.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| + Start a new celebration {createLabel} | goes to createHref | button | Terracotta |
| Add to an event | runs setOpen(true) | button | Terracotta |
| Close | runs close | icon-only | Grey |
| {o.title} {o.kindWord} · {humanDate(o.dateISO)} / · No date yet Add → | goes to o.href | button | Terracotta |

## app/_components/marketing/OurStory.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start your wedding · free | goes to /onboarding/wedding | button | Terracotta |
| Read our story → | goes to /our-story | text link | link — stays a link |

## app/_components/marketing/reskin-footer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Explore Prices Suppliers Papic Monogram maker Download app | runs onFooterLinkClick | clickable element | Grey |
| Prices | goes to /pricing | text link | link — stays a link |
| Suppliers | goes to /explore | text link | link — stays a link |
| Papic | goes to /papic | text link | link — stays a link |
| Monogram maker | goes to /monogram | text link | link — stays a link |
| Download app | goes to /download | text link | Grey |
| Company | runs onFooterLinkClick | clickable element | ? (meaning not evident from label) |
| About | goes to /about | text link | link — stays a link |
| Articles | goes to /blog | text link | link — stays a link |
| Their stories | goes to /realstories | text link | link — stays a link |
| Help center | goes to /help | text link | link — stays a link |
| For suppliers | goes to /for-suppliers | text link | link — stays a link |
| For storytellers | goes to /creators | text link | link — stays a link |
| Plan your wedding | goes to /onboarding/wedding | text link | link — stays a link |
| Legal | runs onFooterLinkClick | clickable element | ? (meaning not evident from label) |
| Privacy | goes to /privacy | text link | link — stays a link |
| Terms | goes to /terms | text link | link — stays a link |
| Refunds & cancellations | goes to /refunds | text link | link — stays a link |
| Cookie policy | goes to /cookies | text link | link — stays a link |
| Acceptable use | goes to /acceptable-use | text link | link — stays a link |
| Cookie settings | runs openConsentManager() | button | Grey |
| dpo@setnayan.com | goes to mailto:dpo@setnayan.com | text link | link — stays a link |
| (icon only) | link | icon-only | link — stays a link |

## app/_components/marketing/site-nav.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Home | runs handler unpinFooter() | icon-only | Grey |
| {prices} | runs press('prices') | button | ? (dynamic label; meaning set at call site) |
| {download} | runs press('download') | button | Grey |
| {vendors} | runs press('vendors') | button | ? (dynamic label; meaning set at call site) |
| {signin} | runs handler (e) => { e.preventDefault(); press('… | text link | Terracotta |

## app/_components/marketing/try-the-demo-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | runs openDemoOverlay(demo) | button | Terracotta |

## app/_components/native-oauth-buttons.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| apple {verb} Apple | runs run('apple') | button | ? (meaning not evident from label) |
| google {verb} Google | runs run('google') | button | Terracotta |

## app/_components/nav-links.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Google Maps | goes to googleMapsSearchByQuery(addressFallb… | text link | link — stays a link |
| Google Maps | goes to googleMapsNavUrl(latitude!, longitud… | text link | link — stays a link |
| Waze | goes to wazeNavUrl(latitude!, longitude!) | text link | link — stays a link |
| Apple Maps | goes to appleMapsUrl(latitude!, longitude!) | text link | link — stays a link |

## app/_components/nav-progress.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) | link | icon-only | link — stays a link |

## app/_components/nav/bottom-nav.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› ×3 | link | text link | link — stays a link |
| {item.badge && item.badge.count > …} | runs item.onSelect ? (e) => { if (e.metaK… | clickable element | ? (dynamic label; meaning set at call site) |
| ‹dynamic label› | custom control | button | Grey |
| {inner} | runs handler onActivate | text link | ? (dynamic label; meaning set at call site) |
| {inner} [role === 'hinge' ? `Collapse {item.label} menu` : `Open {it… | runs onActivate | button | Grey |

## app/_components/nav/nav-fab.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| label | goes to href | icon-only | link — stays a link |

## app/_components/nav/nav-slide-controller.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) ×3 | link | icon-only | link — stays a link |

## app/_components/nav/sidebar-item.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | link | text link | link — stays a link |
| item.description ?? item.label | goes to item.href | icon-only | ? (meaning not evident from label) |
| {item.label} {item.badge && item.badge.count > …} [item.description … | goes to item.href | button | ? (dynamic label; meaning set at call site) |
| ‹dynamic label› | custom control | button | Grey |
| (icon only) | link | icon-only | link — stays a link |
| {item.label} [item.description ?? item.label] | runs onSelect | button | ? (dynamic label; meaning set at call site) |

## app/_components/nav/sidebar-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {group.label} | runs toggle | button | Grey |

## app/_components/negotiation-card-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {t.label} : {title} {pill} | runs setOpen(true) | button | Grey |
| Collapse | runs setOpen(false) | icon-only | Grey |

## app/_components/negotiation-composer-menu.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Deal or meeting | runs setMode('menu') | button | Blue |
| 🧾 {entry.menuQuote.label} | runs revealThreadTool(entry.menuQuote!.re… | button | ? (meaning not evident from label) |
| 🧾 Send a deal | runs setMode('deal') | button | Blue |
| 📅 Request a meeting | runs setMode('meeting') | button | Blue |
| Close | runs close | icon-only | Grey |
| {APPOINTMENT_KIND_LABEL[k]} | runs setKind(k) | button | ? (dynamic label; meaning set at call site) |
| Send request | custom control | button | Blue |
| Cancel | runs close | button | Red |

## app/_components/next-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {action} | goes to href | button | ? (dynamic label; meaning set at call site) |
| {later.label} | submits its form | button | Grey |

## app/_components/nfc-write-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Write to NFC | runs void run('write') | button | Blue |
| Cancel | runs close | button | Red |
| Write another | runs void run('write') | button | Terracotta |
| Done | runs close | button | Green |
| Check tag | runs void run('check') | button | Grey |
| Try again ×2 | runs void run('write') | button | Amber |
| Close ×2 | runs close | button | Grey |
| Copy link | custom control | button | Grey |

## app/_components/notifications/notifications-list.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open | goes to n.related_url | button | Grey |
| Mark read | submits its form | button | Grey |

## app/_components/oauth-button-row.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {verb} Google | submits its form | button | ? (dynamic label; meaning set at call site) |
| {verb} Apple | submits its form | button | ? (dynamic label; meaning set at call site) |
| {verb} Facebook | submits its form | button | ? (dynamic label; meaning set at call site) |

## app/_components/on-time-binary-input.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Yes | runs setValue(5) | button | Green |
| No | runs setValue(1) | button | Grey |

## app/_components/open-wallet-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open {provider} | runs handler armWatchdog | text link | Grey |
| Get {provider} | goes to fallback | text link | link — stays a link |

## app/_components/pabuya/pabuya-card-list.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| `Open the {m.label \|\| meta.defaultLabel} QR code full size` | goes to m.qrUrl | button | Grey |

## app/_components/pabuya/pabuya-method-actions.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) | link | icon-only | link — stays a link |
| Copied / ) : state === 'manual' ? ( / Selected — copy it / Copy number | runs copy | button | Grey |
| Save QR | goes to ${qrUrl}${qrUrl.includes('?') ? '&' … | button | Green |

## app/_components/payment/payment-rails.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {badge} {title} Ready {desc} {selected ? : null} | runs onSelect | button | ? (dynamic label; meaning set at call site) |
| copy ×4 | custom control | button | Grey |
| Save image · scan from gallery | goes to mintedQr | button | Green |
| open wallet | custom control | button | Grey |

## app/_components/plan3d/booth-vendor-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Walk to this booth | runs onWalkTo(booth); onClose(); | button | Terracotta |
| Book this supplier for your event / View supplier profile | goes to /v/${vendor.slug | button | Green |

## app/_components/profile-share-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Link copied | runs share | button | Grey |

## app/_components/proof-image.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) | goes to url | icon-only | link — stays a link |
| Open full size | goes to url | text link | link — stays a link |

## app/_components/proposal-maker.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Step {formatCount(def.n)} of {formatCount(QUOTE_STAGES.length)} {def… | runs onOpen | button | Terracotta |
| ‹dynamic label› | runs onNext | button | Grey |
| 🧾 Build a quote | runs setOpen(true) | button | Blue |
| ✓ / {d.n} {d.title} | runs setStage(d.id) | button | ? (meaning not evident from label) |
| Full brief › | goes to brief.fullBriefHref | text link | link — stays a link |
| reset | runs resetToSeed | button | Grey |
| ✓ / + {c.label} | runs toggleCard(c.id) | button | Grey |
| ✓ / + {a.label} · +{formatCentavos(toCentavos(a.fromPhp))} | runs toggleAddon(a.id) | button | Grey |
| comes with {other.label} · add | runs toggleCard(other.id) | button | Terracotta |
| ⠿ | custom control | clickable element | ? (meaning not evident from label) |
| 🎁 | runs patchLine(l.key, { free: !l.free }) | button | Grey |
| ✕ | runs removeLine(l.key) | button | Red |
| + Feature | runs setItems((prev) => [...prev, newLine… | button | ? (meaning not evident from label) |
| 🎁 Freebie | runs setItems((prev) => [...prev, newLine… | button | ? (meaning not evident from label) |
| Toggle peso / percent | runs // Centavo-exact: a 15% row on a cen… | icon-only | Grey |
| ✕ | runs removeInstallment(r.key) | button | Red |
| + Add payment · splits the balance | runs addPayment | button | Green |
| {m.label} ·pending ✓ | runs setSelectedMethods((s) => ({ ...s, [… | button | Amber |
| Send quote · {formatCentavos(netPayable)} | submits its form | button | Blue |
| Cancel | runs setOpen(false) | button | Red |

## app/_components/public-page-actions.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Link copied / Share | runs share | button | Grey |
| Report | custom control | button | Blue |

## app/_components/push-toggle.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Push notifications | runs on ? disable : enable | icon-only | Grey |

## app/_components/qr-actions.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| nfc write | custom control | button | ? (meaning not evident from label) |
| Copy link | custom control | button | Grey |

## app/_components/relationship-tab-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {t.label} | goes to t.href | button | ? (dynamic label; meaning set at call site) |
| {t.label} | runs select(t.id) | button | Grey |

## app/_components/report-page-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | runs setOpen(true) | button | Grey |
| Report this page | runs close | clickable element | Blue |
| Close | runs setOpen(false) | icon-only | Grey |
| Done | runs setOpen(false) | button | Green |
| Submit report | runs submit | button | Green |

## app/_components/requirements-modal.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Close ×2 | runs onClose | icon-only | Grey |
| ‹dynamic label› | runs onSubmit | button | Grey |

## app/_components/run-of-show-header.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {pressLabel} | runs onAdvance(target.block_id) | button | ? (dynamic label; meaning set at call site) |
| End "{trim(current.label)}" → start "{trim(next.label)}" / Finish "{… | runs onAdvance(current.block_id) | button | Green |
| Start &ldquo; {trim(next.label)} &rdquo; | runs onAdvance(next.block_id) | button | Terracotta |

## app/_components/save-file-link.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {children(state)} | runs handler async (e) => { e.preventDefault(); i… | text link | Green |

## app/_components/save-pass-card-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| saved {text} | runs onClick | button | Green |

## app/_components/save-photo-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| done {label} | runs async (e) => { e.stopPropagation(); … | button | Grey |

## app/_components/scaled-tile.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {item.meta ?? ''} {item.title} | goes to item.href | text link | link — stays a link |
| {item.title} | goes to item.href | text link | link — stays a link |
| {item.title} ) : item.meta | goes to item.href | text link | link — stays a link |

## app/_components/schedule-suggest-chip.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| 📅 Set up this meeting | runs setOpen(true) | button | Terracotta |
| {APPOINTMENT_KIND_LABEL[k]} | runs setKind(k) | button | ? (dynamic label; meaning set at call site) |
| Send request | custom control | button | Blue |
| Cancel | runs setOpen(false) | button | Red |

## app/_components/service-card-view.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| `View details for {c.label}` | goes to doorwayHref | text link | link — stays a link |
| `View details for {c.label}` | runs onOpen | icon-only | Grey |
| {inner} [`Visit {shop.name}`] | goes to shop.href | text link | link — stays a link |

## app/_components/sheet.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Close ×3 | runs onClose | icon-only | Grey |

## app/_components/side-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Close ×2 | runs onClose | icon-only | Grey |

## app/_components/site-stage/site-stage.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {PUBLIC_STAGE_LABELS[s.phase]} Active now | runs pick(s.phase) | button | ? (dynamic label; meaning set at call site) |
| d.label | runs setDevice(d.key) | icon-only | ? (meaning not evident from label) |
| Preview {label} | goes to previewHref | text link | link — stays a link |
| Open the workroom | goes to workroomHref | text link | link — stays a link |
| {r.previewLabel} | goes to r.previewHref | text link | link — stays a link |
| label | runs setOpen((v) => !v) | icon-only | Grey |

## app/_components/stale-tab-notice.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Reload | runs window.location.reload() | button | Amber |
| Not now | runs // Remember WHICH version was waved … | button | Grey |

## app/_components/star-rating-input.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| `{formatCount(n)} star{n === 1 ? '' : 's'}` | runs setValue(n) | icon-only | ? (meaning not evident from label) |

## app/_components/storyteller-tile.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | link | text link | link — stays a link |
| (icon only) ×2 | link | icon-only | link — stays a link |
| A chapter by @ {item.ownerSlug} | goes to /u/${item.ownerSlug | text link | link — stays a link |
| {item.title} | goes to item.href | text link | link — stays a link |
| Read the editorial | goes to editorialHref | button | Grey |

## app/_components/submit-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Working… | submits its form | button | Green |

## app/_components/tag-list-download.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Tag list ( {rows.length} ) | goes to href | button | ? (meaning not evident from label) |

## app/_components/thread-call-launcher.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {nudge} | goes to upgradeHref | text link | link — stays a link |
| Join | runs joinIncoming | button | Terracotta |
| Voice | runs start('voice') | button | Terracotta |
| Video | runs start('video') | button | Terracotta |

## app/_components/thread-call-room.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Camera on / Camera off | runs toggleCam | button | Grey |
| Mic on / Muted | runs toggleMic | button | Grey |
| Hang up | runs onLeave | button | Red |
| {children} | runs onClick | button | ? (dynamic label; meaning set at call site) |

## app/_components/toast/toast-provider.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Dismiss | runs dismiss(id) | icon-only | Grey |

## app/_components/unread-bell-badge.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| 9+ | goes to href | button | ? (meaning not evident from label) |

## app/_components/unread-messages-badge.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| 9+ | goes to href | button | ? (meaning not evident from label) |

## app/_components/vendor-credit-chip.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {vendor.name} | goes to srcTag ? /v/${vendor.slug}?src=${enc… | button | ? (dynamic label; meaning set at call site) |

## app/_components/vendor-event-day-prep-cta.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Try again / Prepare for event day / Pre-loading… | runs onClick | button | Amber |

## app/_components/vendor-location-map.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| View larger map → | goes to largerMap | text link | link — stays a link |

## app/_components/vendor-packages/lock-modal.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Customize & book this package | runs setOpen(true) | button | Grey |
| ‹dynamic label› | runs close | clickable element | Grey |
| Close | runs close | icon-only | Grey |
| One hour fewer | runs setExtraHours(item, extraHoursOn(ite… | icon-only | Grey |
| One hour more | runs setExtraHours(item, extraHoursOn(ite… | icon-only | Grey |
| Book this package | runs onLock | button | Green |
| View the conversation / Open the conversation | runs const href = askState.threadHref; se… | button | Grey |
| Ask {ask.vendorLabel} about this build instead | runs onAsk | button | Blue |

## app/_components/verification/doc-slot-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| How to get this | goes to /help/${slot.guideSlug | text link | link — stays a link |

## app/(shell)/about/_about-motion.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Home | goes to / | text link | link — stays a link |
| Taglish | goes to /tl/about | text link | link — stays a link |

## app/(shell)/about/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Taglish | goes to /tl/about | text link | link — stays a link |
| How it works | goes to /features#how-it-works | button | Grey |
| See transparent pricing | goes to /pricing | button | Grey |
| {a.title} | goes to /help#${a.slug | text link | link — stays a link |
| the pricing page | goes to /pricing | text link | link — stays a link |
| the full help center | goes to /help | text link | link — stays a link |
| Create your account | goes to /signup | button | Terracotta |
| Browse vendors | goes to /explore | button | Terracotta |

## app/(shell)/acceptable-use/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| terms of service | goes to /terms | text link | link — stays a link |
| privacy policy | goes to /privacy | text link | link — stays a link |
| help center | goes to /help | text link | link — stays a link |
| dpo@setnayan.com | goes to mailto:dpo@setnayan.com | text link | link — stays a link |

## app/(shell)/alaala/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start planning · free ×2 | goes to /onboarding/wedding?from=alaala | button | Terracotta |
| See pricing | goes to /pricing | button | Grey |
| 0 · {p.role} {p.name} {p.desc} Explore {p.name} → | goes to p.href | text link | link — stays a link |
| Read the whole story | goes to /our-story | button | Grey |

## app/(shell)/cookies/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| privacy policy | goes to /privacy | text link | link — stays a link |
| dpo@setnayan.com | goes to mailto:dpo@setnayan.com | text link | link — stays a link |

## app/(shell)/explore/_components/category-tile.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {data.photoUrl} / · / PH / Rental / Sample | goes to href | text link | link — stays a link |

## app/(shell)/explore/_components/event-type-notify-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Notify me | submits its form | button | Terracotta |

## app/(shell)/explore/_components/explore-search-hero.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Show | submits its form | button | Grey |
| Walk through a real wedding → | goes to /tour | text link | link — stays a link |

## app/(shell)/explore/_components/filter-drawer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Close filters ×2 | runs onClose | icon-only | Grey |
| Apply filters | runs onClose?.() | button | Terracotta |
| Clear | goes to filters.folder ? /explore?folder=${f… | button | Grey |

## app/(shell)/explore/_components/folder-vendors-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| See all → | goes to seeAllHref | text link | link — stays a link |
| See all {folderLabel.toLowerCase()} vendors → | goes to seeAllHref | text link | link — stays a link |
| `{displayName} — view profile` | goes to href | button | Grey |

## app/(shell)/explore/_components/icon-tile-folder-strip.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} {formatCount(count)} | goes to href | text link | link — stays a link |

## app/(shell)/explore/_components/review-carousel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Previous review | runs prev | icon-only | Amber |
| Next review | runs next | icon-only | Amber |

## app/(shell)/explore/_components/save-vendor-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start an event to save | goes to /dashboard | text link | Green |
| Saved / Saving… / Save / ) : isError ? ( / Try again | submits its form | button | Amber |

## app/(shell)/explore/_components/sticky-marketplace-header.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Filters | runs setDrawerOpen(true) | button | Grey |
| {option.label} | goes to option.href | button | ? (dynamic label; meaning set at call site) |

## app/(shell)/explore/_components/taxonomy-search.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {opt.label} in {opt.column} · {formatCount(opt.columnCount)} services | runs selectOption(opt) | button | ? (dynamic label; meaning set at call site) |

## app/(shell)/explore/_components/vendor-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| save vendor | custom control | button | Green |
| View vendor | goes to href | text link | link — stays a link |

## app/(shell)/explore/_components/vendors-availability-banner.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| your event home | goes to /dashboard/${eventId | text link | link — stays a link |
| vendor dispute flow | goes to /dashboard/${eventId}/vendors | text link | link — stays a link |
| lock day | custom control | button | ? (meaning not evident from label) |
| Saving… | runs handleLock | button | ? (meaning not evident from label) |

## app/(shell)/explore/compare/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to marketplace | goes to /explore | text link | link — stays a link |
| save vendor | custom control | button | Green |
| View full profile → | goes to /v/${row.business_slug}?src=explore | text link | link — stays a link |
| Ask about your date — {row.business_name} | goes to /v/${row.business_slug}?src=explore#… | button | Blue |

## app/(shell)/explore/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Compare → | goes to compareHref | text link | link — stays a link |
| {LENSES[k].label} | goes to buildHref(filters, { lens: k, page: … | button | ? (dynamic label; meaning set at call site) |
| {SORT_LABEL[k]} | goes to buildHref(filters, { sort: k, page: … | button | ? (dynamic label; meaning set at call site) |
| Show all vendors | goes to buildHref(filters, { offSeason: fals… | text link | link — stays a link |
| Off-season savings | goes to buildHref(filters, { offSeason: true… | button | ? (meaning not evident from label) |
| All faiths | goes to buildHref(filters, { faithFilter: nu… | text link | link — stays a link |
| ‹dynamic label› ×2 | link | text link | link — stays a link |
| {h.tag} {h.title} {h.blurb} | goes to h.href | button | ? (dynamic label; meaning set at call site) |
| Show all vendors | goes to buildHref(filters, { offSeason: fals… | button | Grey |
| Or browse all vendors instead → | goes to browseAllVendorsHref(filters.focused… | text link | link — stays a link |
| Show all | goes to showAllHref | button | Grey |
| Clear all filters | goes to filters.focusedMode ? '/explore?from… | button | Red |
| List your business | goes to outreachSignupHref | button | Terracotta |
| How supplier listings work → | goes to /for-suppliers | button | ? (meaning not evident from label) |
| prev {label} next | goes to href | text link | link — stays a link |
| Open your shop &rarr; | goes to /open-shop | text link | link — stays a link |
| Browse all categories → | goes to /explore?browse=1 | button | Grey |
| Show all venue settings | goes to showAllHref | button | Grey |
| Browse all folders | goes to /explore | button | Grey |
| Show all faiths | goes to /explore?match=0 | button | Grey |

## app/(shell)/help/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {r.label} {r.blurb} | goes to isActive ? '/help' : /help?role=${r.… | button | ? (dynamic label; meaning set at call site) |
| Show all topics | goes to /help | text link | link — stays a link |
| {t.label} | goes to #${t.key | button | ? (dynamic label; meaning set at call site) |
| Contact support → | goes to #contact | button | Blue |
| Send message | submits its form | button | Blue |

## app/(shell)/pa3d/_pa3d-room.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Try again | runs setPhase('poster'); | button | Amber |
| Step inside / Standing up the room… | runs enter | button | Grey |
| Walking / Walk around | runs setRoaming((v) => !v) | button | Terracotta |
| Back to my seat | runs setReturnSignal((n) => n + 1) | button | Grey |
| Their colours: on / Their colours: off | runs setThemed((v) => !v) | button | Grey |
| Or open it here | goes to qr.joinUrl | text link | link — stays a link |

## app/(shell)/pa3d/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| setnayan.com/pa3d/try | goes to /pa3d/try | text link | link — stays a link |

## app/(shell)/pa3d/try/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| read what it’s for | goes to /pa3d | text link | link — stays a link |
| start planning free | goes to /onboarding/wedding?from=pa3d-try | text link | link — stays a link |

## app/(shell)/panood/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| privacy policy | goes to /privacy | text link | link — stays a link |

## app/(shell)/papic/_papic-dial.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| − | runs setI((n) => Math.max(0, n - 1)) | button | ? (meaning not evident from label) |
| + | runs setI((n) => Math.min(rungs.length - … | button | Grey |
| − | runs setGuests((g) => Math.max(GUEST_MIN,… | clickable element | Grey |
| + | runs setGuests((g) => Math.min(GUEST_MAX,… | clickable element | Grey |
| {children} [label] | runs onClick | button | ? (dynamic label; meaning set at call site) |

## app/(shell)/papic/_papic-scan.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {s.label} | runs pickStyle(s.id) | button | ? (dynamic label; meaning set at call site) |

## app/(shell)/papic/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| setnayan.com/papic/try | goes to /papic/try | text link | link — stays a link |
| See every amount → | goes to /pricing | text link | link — stays a link |

## app/(shell)/papic/try/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| see what Papic does → | goes to /papic | text link | link — stays a link |

## app/(shell)/pricing/_papic-estimator.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {b.label} {peso(b.pricePhp)} | runs setBucketKey(b.key) | button | ? (dynamic label; meaning set at call site) |
| ✓ {a.label} {peso(a.price)} | runs setChecked((prev) => ({ ...prev, [a.… | button | ? (meaning not evident from label) |

## app/(shell)/pricing/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| See plans | goes to #plans | button | Grey |
| What's free ↓ | goes to #free | button | Grey |
| See everything free ↓ | goes to #free | text link | link — stays a link |
| Unlock Setnayan AI | goes to /onboarding/wedding?from=pricing | button | Green |
| For storytellers | goes to /creators | button | ? (meaning not evident from label) |
| For vendors | goes to /for-suppliers | button | ? (meaning not evident from label) |

## app/(shell)/privacy/google-access/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Google Account permissions | goes to https://myaccount.google.com/permiss… | text link | link — stays a link |
| Google API Services User Data Policy | goes to https://developers.google.com/terms/… | text link | link — stays a link |
| privacy policy | goes to /privacy | text link | link — stays a link |
| dpo@setnayan.com | goes to mailto:dpo@setnayan.com | text link | link — stays a link |

## app/(shell)/privacy/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| dpo@setnayan.com ×3 | goes to mailto:dpo@setnayan.com | text link | link — stays a link |
| Help Center ×4 | goes to /help | text link | link — stays a link |
| your profile | goes to /dashboard/profile | text link | link — stays a link |
| YouTube's Terms of Service | goes to https://www.youtube.com/t/terms | text link | link — stays a link |
| Google Privacy Policy ×2 | goes to https://policies.google.com/privacy | text link | link — stays a link |
| Security &rarr; Third-party apps with account access | goes to https://myaccount.google.com/permiss… | text link | link — stays a link |
| Google account permissions | goes to https://myaccount.google.com/permiss… | text link | link — stays a link |
| Google API Services User Data Policy ×2 | goes to https://developers.google.com/terms/… | text link | link — stays a link |
| Google Account permissions | goes to https://myaccount.google.com/permiss… | text link | link — stays a link |
| Security → Third-party apps with account access | goes to https://myaccount.google.com/permiss… | text link | link — stays a link |
| help center | goes to /help | text link | link — stays a link |

## app/(shell)/realstories/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start planning · free | goes to /signup | button | Terracotta |
| Browse vendors | goes to /explore | button | Terracotta |

## app/(shell)/refunds/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| help center ×4 | goes to /help | text link | link — stays a link |
| terms of service | goes to /terms | text link | link — stays a link |
| dpo@setnayan.com | goes to mailto:dpo@setnayan.com | text link | link — stays a link |

## app/(shell)/suppliers/_landing.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Suppliers | goes to /suppliers | text link | link — stays a link |
| {eventLabel} {tileLabel} | goes to pagePath(nationwide, tileSlug) | text link | link — stays a link |
| {placeName(regionCrumb)} | goes to pagePath(regionCrumb, tileSlug) | text link | link — stays a link |
| Browse every verified supplier | goes to /explore | text link | link — stays a link |
| {eventLabel} {tileLower} anywhere in the Philippines | goes to pagePath(nationwide, tileSlug) | text link | link — stays a link |
| See them all on the marketplace | goes to /explore | text link | link — stays a link |
| ‹dynamic label› | goes to pagePath(p, tileSlug) | text link | link — stays a link |
| Start planning free | goes to /signup | text link | link — stays a link |
| Are you a supplier? List your services | goes to /for-suppliers | text link | link — stays a link |

## app/(shell)/suppliers/(index)/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Browse every verified supplier | goes to /explore | text link | link — stays a link |
| Are you a supplier? List your services | goes to /for-suppliers | text link | link — stays a link |
| {source.taxonomy.tileLabel[p.tile]…} in {placeName(p)} | goes to pagePath(p, tileSlug) | text link | link — stays a link |

## app/(shell)/terms/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| privacy policy ×4 | goes to /privacy | text link | link — stays a link |
| acceptable use policy | goes to /acceptable-use | text link | link — stays a link |
| refund policy | goes to /refunds | text link | link — stays a link |
| acceptable use & community guidelines | goes to /acceptable-use | text link | link — stays a link |
| refund & cancellation policy | goes to /refunds | text link | link — stays a link |
| YouTube Terms of Service | goes to https://www.youtube.com/t/terms | text link | link — stays a link |
| Google Privacy Policy | goes to https://policies.google.com/privacy | text link | link — stays a link |
| help center ×2 | goes to /help | text link | link — stays a link |
| dpo@setnayan.com | goes to mailto:dpo@setnayan.com | text link | link — stays a link |

## app/(shell)/web-only/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to your dashboard | goes to /dashboard | text link | link — stays a link |

## app/3d_plan/demo/[token]/_components/plan3d-guest-view.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Where am I seated | runs setPhase('walking') | button | Terracotta |
| Walk around ×2 | runs setPhase('roam') | button | Terracotta |
| Back to Setnayan ×2 | goes to / | text link | link — stays a link |
| Back to my seat · {table.label} | runs setReturnSignal((n) => n + 1) | button | Grey |

## app/3d_plan/demo/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan | goes to / | button | Grey |

## app/blog/_components/story-card.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | goes to /blog/${article.slug | text link | link — stays a link |

## app/blog/[slug]/_components/journal-partner-credit.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| View profile | goes to href | button | Grey |

## app/blog/[slug]/_components/shop-link.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | runs handler // Fire-and-forget, never awaited, n… | text link | ? (dynamic label; meaning set at call site) |

## app/blog/[slug]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {block.label} | goes to block.href | text link | link — stays a link |
| {block.label} | goes to block.href | button | Red |
| {resolved.ownerName} | goes to /u/${resolved.ownerSlug | text link | link — stays a link |
| Open | goes to /u/${resolved.ownerSlug}/c/${resolve… | text link | link — stays a link |
| (icon only) | goes to / | icon-only | link — stays a link |
| All articles ×2 | goes to /blog | text link | link — stays a link |
| Home | goes to / | text link | link — stays a link |
| Articles | goes to /blog | text link | link — stays a link |
| {categoryLabel} | goes to /blog?category=${article.category | text link | link — stays a link |
| {blogCategoryLabel(a.category)} {a.title} | goes to /blog/${a.slug | text link | link — stays a link |
| Start planning · free | goes to /signup | button | Terracotta |

## app/blog/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | goes to /blog/${article.slug | text link | link — stays a link |
| ‹dynamic label› | goes to /blog/${featured.slug | text link | link — stays a link |
| 0 {blogCategoryLabel(n.category)} {n.text} | goes to /blog/${n.sourceSlug | button | ? (meaning not evident from label) |
| All | goes to /blog | button | Grey |
| {c.label} | goes to /blog?category=${c.key | button | ? (dynamic label; meaning set at call site) |
| Start planning · free | goes to /signup | button | Terracotta |

## app/claim/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back home | goes to / | button | Grey |
| Back to People | goes to /dashboard/people | button | Grey |
| Claim my profile / Take over {row.name}'s care | submits its form | button | Green |
| Sign in to continue | goes to /login?next=${encodeURIComponent(/cl… | button | Terracotta |
| Create your account | goes to /signup?next=${encodeURIComponent(/c… | button | Terracotta |

## app/creators/_components/creator-story-hero.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Publish your story — free | goes to /signup | button | Grey |
| See what a Chapter is ↓ | goes to /creators#chapter | button | Grey |

## app/creators/_components/creator-story-sections.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Publish your story — free | goes to /signup | button | Grey |
| See Stories | goes to /realstories | button | Grey |

## app/dev/booth-lab/booth-lab-client.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ← Prev | runs setIndex((index + keys.length - 1) %… | button | Grey |
| Next → | runs setIndex((index + 1) % keys.length) | button | Terracotta |

## app/dev/details-lab/look-lab.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {o} | custom control | button | ? (dynamic label; meaning set at call site) |

## app/dev/guests-lab/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add a guest | custom control | button | Terracotta |

## app/dev/hero-lab/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {t.name} | goes to qs({ theme: t.id }) | text link | link — stays a link |
| card / photo | goes to qs({ photo: photo ? null : '1' }) | text link | link — stays a link |
| not the day / on the day | goes to qs({ onday: onday ? null : '1' }) | text link | link — stays a link |
| long names / short names | goes to qs({ names: displayName === SHORT ? … | text link | link — stays a link |

## app/dev/hero-lab/type-lab.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Wording pick (eyebrow) | runs pick('eyebrow', 'You are invited') | button | Terracotta |
| Format pick (date) | runs pick('date', 'Ika-18 ng Disyembre, 2… | button | Terracotta |

## app/download/_download-motion.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} · {sizeLabel} | goes to href | text link | link — stays a link |
| Use OBS instead | goes to https://obsproject.com/ | text link | link — stays a link |

## app/download/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {macDownloadLabel} | custom control | button | Grey |
| {winDownloadLabel} | custom control | button | Grey |
| Use it on the web instead | goes to https://setnayan.com | text link | link — stays a link |
| use Setnayan on the web | goes to https://setnayan.com | text link | link — stays a link |
| OBS | goes to https://obsproject.com/ | text link | link — stays a link |
| setnayan.com | goes to https://setnayan.com | text link | link — stays a link |

## app/error.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Try again | runs reset() | button | Amber |
| Take me home | goes to / | button | Grey |

## app/features/_feature-page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {w.features} ×2 | goes to hubHref | text link | link — stays a link |
| {w.tryIt} | goes to f.tryHref | text link | link — stays a link |
| {start.label} ×2 | goes to start.href | text link | link — stays a link |
| {w.more(f.name[locale])} | goes to f.moreHref | text link | link — stays a link |
| {other.name[locale]} {x.how[locale]} | goes to featureHref(x.slug, locale) | text link | link — stays a link |
| {w.findSuppliers} | goes to /suppliers | text link | link — stays a link |
| {g.title} | goes to /blog/${g.slug | text link | link — stays a link |
| {w.pricing} | goes to isSupplier ? '/for-suppliers' : '/pr… | text link | link — stays a link |

## app/features/_sections/_Ecosystem.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {f.name[locale]} | goes to featureHref(slug, locale) | text link | link — stays a link |

## app/features/_sections/_FeatureGroups.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {f.name[locale]} | goes to featureHref(f.slug, locale) | text link | link — stays a link |
| {WORDS[locale].tryIt} [`{WORDS[locale].tryIt}: {f.name[locale]}`] | goes to f.tryHref | text link | link — stays a link |

## app/features/_sections/_FinalCTA.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {c.ctaPrimary} | goes to /signup | button | ? (dynamic label; meaning set at call site) |
| {c.ctaSecondary} | goes to /for-suppliers | text link | link — stays a link |

## app/for-suppliers/_components/vendor-grow-sections.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Get your invite link | goes to /open-shop | button | Terracotta |
| List your business — free | goes to /open-shop | button | Terracotta |
| See supplier plans | goes to /for-suppliers#model | button | Grey |

## app/for-suppliers/_components/vendor-hero-gate.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| List your business for free | runs handler release | text link | Terracotta |
| How the model works ↓ | runs handler revealModel | text link | ? (meaning not evident from label) |

## app/for-suppliers/_components/vendor-tier-deltas.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Talk to us → | goes to /help#contact | button | Blue |
| Hide the side-by-side grid / Compare every tier side by side → | runs setShowMatrix((v) => !v) | button | Grey |

## app/for-suppliers/_components/vendor-tier-matrix.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {COL_META[c].name} | runs setSelected(c) | button | ? (dynamic label; meaning set at call site) |
| Talk to us → | goes to /help#contact | button | Blue |

## app/for-suppliers/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Couple pricing | goes to /pricing | button | ? (meaning not evident from label) |

## app/forgot-password/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Email me a reset link | submits its form | button | Grey |
| Back to sign in | goes to /login | text link | link — stays a link |

## app/global-error.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | link | text link | link — stays a link |
| (icon only) | link | icon-only | link — stays a link |
| Take me home | goes to / | text link | link — stays a link |

## app/help/_components/help-search.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {a.title} ×2 | goes to /help/${a.slug | text link | link — stays a link |
| message the team | goes to #contact | text link | Blue |

## app/help/[slug]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {part} | goes to part | text link | link — stays a link |
| (icon only) | goes to / | icon-only | link — stays a link |
| All help topics ×2 | goes to /help | text link | link — stays a link |
| Home | goes to / | text link | link — stays a link |
| Help | goes to /help | text link | link — stays a link |
| {topic.label} | goes to /help#${topic.key | text link | link — stays a link |
| {a.title} | goes to /help/${a.slug | text link | link — stays a link |
| Still stuck? Contact support → | goes to /help#contact | text link | link — stays a link |

## app/host/accept/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Create account | goes to /signup?next=${encodeURIComponent(ne… | button | Terracotta |
| Sign in | goes to /login?next=${encodeURIComponent(nex… | button | Terracotta |
| Accept invitation | submits its form | button | Green |
| Decline | submits its form | button | Red |
| {cta.label} | goes to cta.href | button | ? (dynamic label; meaning set at call site) |
| Back to Setnayan | goes to / | button | Grey |

## app/join/[eventId]/_components/join-flow.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Sign in | goes to loginHref | text link | link — stays a link |
| Sign in | goes to loginHref | button | Terracotta |
| Create account | goes to signupHref | button | Terracotta |
| Open my invitation ×2 | submits its form | button | Grey |
| Continue | submits its form | button | Terracotta |
| I don't know that number | submits its form | button | Grey |
| Not you? Start over | submits its form | button | Terracotta |
| Back to the details | goes to /${slug | button | Grey |

## app/join/[eventId]/_components/join-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back home | goes to / | button | Grey |

## app/join/[eventId]/_components/request-form.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Terms | goes to /terms | text link | link — stays a link |
| Privacy Notice | goes to /privacy | text link | link — stays a link |
| Send request | submits its form | button | Blue |

## app/join/[eventId]/connect/confirm/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Not me | submits its form | button | Grey |
| Not me | goes to / | button | Grey |
| Yes, save it | submits its form | button | Green |

## app/join/[eventId]/set-password/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) | link | icon-only | link — stays a link |
| Set password | submits its form | button | Green |
| Skip for now | goes to next | button | Grey |

## app/join/[eventId]/success/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open your invitation | goes to /${event.slug | button | Grey |
| Go to your dashboard | goes to /dashboard | button | Terracotta |

## app/monogram/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Create my free account | goes to /signup?next=/monogram | button | Terracotta |
| Sign in | goes to /login?next=/monogram | text link | link — stays a link |
| Start planning · free | goes to /onboarding/wedding?from=monogram | button | Terracotta |

## app/monogram/public-monogram-studio.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ✕ | runs setPreviewKind(null); setPreviewSvg(… | button | Red |
| Download SVG | runs onDownloadSvg | button | Grey |
| {pngBusy ? ( ) : ( )} Download PNG | runs onDownloadPng | button | Grey |
| handwriting / Handwriting / droplet / Bloom / petalfall / Petal Fall… | runs setPreviewKind(k); setPreviewSvg(upl… | button | ? (meaning not evident from label) |
| Download vector | runs downloadBlob(new Blob([uploaded.svg]… | button | Grey |
| Start planning · free | runs handler stashIfAny(); track('public_monogram… | text link | Terracotta |

## app/not-found.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Take me home | goes to / | button | Grey |
| Browse suppliers | goes to /explore | button | Terracotta |

## app/open-shop/_components/city-pin.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Use my location | runs useMyLocation | button | Terracotta |
| Yes, that's right | runs setConfirmed(true) | button | Green |

## app/open-shop/_components/open-shop-wizard.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| oauth button row ×2 | custom control | clickable element | ? (meaning not evident from label) |
| desktop oauth buttons | custom control | clickable element | ? (meaning not evident from label) |
| native oauth buttons | custom control | clickable element | ? (meaning not evident from label) |
| form | custom control | clickable element | ? (meaning not evident from label) |
| Terms | goes to /terms | text link | link — stays a link |
| Privacy Policy | goes to /privacy | text link | link — stays a link |
| Back | runs back | icon-only | Grey |
| Continue | runs next | button | Terracotta |
| Open my shop — free | submits its form | button | Grey |

## app/open-shop/_components/service-picker.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Change | runs onPick(null); setOpenParent(null); s… | button | Grey |
| Clear search | runs setQuery('') | icon-only | Grey |
| {h.leaf.label} {h.path} | runs onPick(h.leaf) | button | ? (dynamic label; meaning set at call site) |
| All groups | runs (branch ? setOpenBranch(null) : setO… | button | Grey |
| {p.label} | runs setOpenParent(p.folderId) | button | Grey |
| {b.label} | runs setOpenBranch(b.tileId) | button | Grey |
| {l.label} | runs onPick(l) | button | ? (dynamic label; meaning set at call site) |

## app/our-story/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Privacy Policy | goes to /privacy | text link | link — stays a link |

## app/panood/cam/[token]/_components/panood-camera-publish.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Retry camera | runs void start() | button | Amber |
| Try again | runs void start() | button | Amber |

## app/panood/cam/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan ×2 | goes to / | button | Grey |
| Join & open my camera / Join this camera | submits its form | button | Terracotta |
| Sign in to join this camera | goes to /login?next=${encodeURIComponent(/pa… | button | Terracotta |

## app/panood/control/[eventId]/_components/program-bridge.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Open program output | runs openProgramPopout | button | Grey |

## app/panood/control/[eventId]/_components/venue-screens-section.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | goes to unlockHref | button | Grey |
| {LIVE_SCREEN_MODE_LABEL[mode]} | submits its form | button | ? (dynamic label; meaning set at call site) |
| Add a screen | submits its form | button | Terracotta |
| Remove ×2 | submits its form | button | Red |
| Rename | submits its form | button | Grey |
| {LIVE_SCREEN_MODE_LABEL[m]} | submits its form | button | ? (dynamic label; meaning set at call site) |
| waiting / New code / Swap device (new code) | submits its form | button | Grey |

## app/panood/control/[eventId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Exit | goes to detailHref | button | Red |
| Clear | submits its form | button | Grey |
| Moment | submits its form | button | ? (meaning not evident from label) |
| Guest-pick Guests choose their view / Everyone sees your cut / On / … | submits its form | button | Grey |
| We’re off air / We’re on air | submits its form | button | Grey |
| Setup | goes to #setup | button | Terracotta |
| Add camera {addCameraCaption} | goes to #add-camera | text link | link — stays a link |
| ‹dynamic label› ×2 | goes to detailHref | button | Grey |
| Connect YouTube | goes to /api/oauth/youtube/start?event_id=${… | button | Terracotta |
| Copy | custom control | button | Grey |
| https://www.youtube.com/watch?v={activeBroadcast.broadcast_id} | goes to https://www.youtube.com/watch?v=${ac… | text link | link — stays a link |
| Make default | submits its form | button | Terracotta |
| Remove channel | submits its form | button | Red |
| Print the join card / {printableCards} join cards | goes to /dashboard/${eventId}/studio/panood/… | button | Grey |
| Add channel | submits its form | button | Terracotta |
| {POSITION_LABELS[pos]} ×2 | submits its form | button | ? (dynamic label; meaning set at call site) |
| {lock.unlockCtaLabel} | goes to detailHref | text link | link — stays a link |
| Save lower third | submits its form | button | Green |
| {UNLOCK_TO_BROADCAST_LABEL} | goes to detailHref | button | ? (dynamic label; meaning set at call site) |
| Remove moment | submits its form | button | Red |
| Mark it | submits its form | button | Green |
| Remove link | submits its form | button | Red |
| Save watch link | submits its form | button | Green |
| Remove | submits its form | button | Red |
| Add film | submits its form | button | Terracotta |
| Make the join QR | submits its form | button | Terracotta |
| Make a new join QR | submits its form | button | Terracotta |
| New QR | submits its form | button | Red |
| Copy the link | custom control | button | Grey |
| {label} Free | submits its form | button | ? (dynamic label; meaning set at call site) |
| `Put CH {tile.channel} — {tile.name} — on Channel 1` | submits its form | button | ? (meaning not evident from label) |
| `{UNLOCK_TO_BROADCAST_LABEL} — CH {tile.channel} is yours to rehears… | goes to detailHref | button | Green |
| Save name | submits its form | button | Green |

## app/panood/control/[eventId]/transport-row.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {blocked} | goes to connectHref | button | ? (dynamic label; meaning set at call site) |
| End (on air by hand) / End broadcast | runs run( () => (manualOnly ? endManualOn… | button | Red |
| Go live | runs run(() => goLivePanood(eventId), 'Go… | button | Terracotta |

## app/panood/demo/[token]/_components/cam-join-flow.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| starting starting / Allow camera + mic & go live | runs goLive | button | Terracotta |
| Try again ×2 | runs goLive | button | Amber |

## app/panood/demo/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan | goes to / | button | Grey |

## app/papic/_components/camera-controls.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Flip camera | runs onFlip | icon-only | Grey |
| {lensLabel(factor)} × | runs onSelectLens(factor) | button | Grey |

## app/papic/_components/papic-buy-shell.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Add credits | runs setOpen(true) | button | Terracotta |
| Close | runs setOpen(false) | icon-only | Grey |
| {offer.phrase} &rsaquo; | submits its form | button | Green |
| Give {n(standing.releasable)} to the celebration | submits its form | button | Green |
| Never mind | runs setConfirming(false) | button | Grey |
| Give the unused {n(standing.releasable)} to the celebration | runs setConfirming(true) | button | Green |

## app/papic/claim/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan ×2 | goes to / | button | Grey |
| Claim my seat & start shooting / Start shooting | submits its form | button | Green |
| Sign in to claim my seat | goes to /login?next=${encodeURIComponent(/pa… | button | Green |

## app/papic/decorate/_components/kwento-decorator.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to my photos | goes to myPhotosHref | button | Grey |
| 0 1px 2px rgba(0,0,0,0.35) / rgba(31,26,23,0.55) / 0.2em 0.36em / 99… | custom control | clickable element | ? (meaning not evident from label) |
| Resize and rotate | custom control | clickable element | Grey |
| Delete | custom control | icon-only | Red |
| Undo | runs undo | button | Amber |
| {emoji} [`Add {emoji}`] | runs addSticker(emoji) | button | Terracotta |
| Add | runs addText | button | Terracotta |
| Pill | runs setTextPill((v) => !v) | button | Grey |
| {saving ? : null} Saved / Save to gallery | runs save | button | Green |
| Open the camera page | goes to /papic/guest | button | Grey |
| {captionSaving ? ( ) : null} Add caption | runs saveCaption | button | Terracotta |

## app/papic/decorate/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan | goes to / | button | Grey |
| Back to my photos | goes to myPhotosHref | button | Grey |

## app/papic/demo/[token]/_components/demo-join-flow.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Allow camera & continue | runs openCamera('user', 'camera') | button | Terracotta |
| Try again | runs openCamera('user', 'camera') | button | Amber |
| {shooting ? ( ) : ( )} That’s the 3 demo credits / Take the shot | runs takeShot | button | Terracotta |
| Save | runs savePhoto(p) | button | Green |
| registering registering / Register my face | runs registerFace | button | Terracotta |

## app/papic/demo/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan | goes to / | button | Grey |

## app/papic/guest/_components/papic-challenge-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Papic Challenges armed {formatCount(done)} / {formatCount(total)} | runs setOpen((v) => !v) | button | Green |
| Cancel | runs disarm | button | Red |
| {busy ? ( ) : ( )} Retake | runs arm(m, true) | button | Amber |
| {busy ? ( ) : ( )} Start | runs arm(m, false) | button | Terracotta |
| {busy && !m.consent_shared ? ( ) :…} Share | runs void setShare(m.mission_id, true) | button | Grey |
| Keep private | runs void setShare(m.mission_id, false) | button | Green |
| 🎁 You earned a Story — make yours → | goes to storyHref | button | Grey |
| {m.completed ? ( ) : ( )} {m.prompt} | runs (isArmed ? disarm() : arm(m, m.compl… | button | Green |

## app/papic/guest/_components/papic-guest-capture.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Terms of Use | goes to /terms | text link | link — stays a link |
| {acceptBusy ? ( ) : ( )} Agree & open my camera | runs acceptTerms | button | Grey |
| Reload & try again | runs window.location.reload() | button | Amber |
| Close the camera | goes to cameraExitHref(exitTo.slug, exitTo.t… | icon-only | Grey |
| Add your face so your photos find you | runs setEnrolling(true) | button | Terracotta |
| Dismiss | runs setPromptDismissed(true) | icon-only | Grey |
| Your shots | goes to cameraExitHref(exitTo.slug, null, ad… | icon-only | ? (meaning not evident from label) |
| recording ? 'Recording — release to stop' : 'Tap to take a photo, or… | button, no inline handler | icon-only | Terracotta |
| Take a photo | runs void capture() | button | Terracotta |
| Stop recording / Record a 10-second snippet | runs (recording ? stopRecording() : void … | button | Red |
| Tag who's in it | runs startTagging | button | Terracotta |
| Done tagging | runs stopTagging | button | Green |
| ↑ | runs void sendFlash() | button | Grey |
| Skip | runs dismissFlash | button | Grey |
| {isStorySending ? ( ) : null} Send to the host 💌 | runs void sendStory() | button | Blue |
| Done | runs setKwentoPhase('sent') | button | Green |
| Skip | runs setKwentoPhase('idle') | button | Grey |
| Changed your mind? Delete this story | runs void deleteKwento() | button | Red |

## app/papic/guest/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to the invitation ×4 | goes to /${backSlug | button | Grey |
| Back to Setnayan | goes to / | button | Grey |
| See your photos | goes to /papic/me/${encodeURIComponent(sessi… | button | Grey |

## app/papic/join/[token]/_components/app-install-banner.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ios / Get it on the App Store / Get it on Google Play | goes to storeUrl | button | Grey |
| Dismiss app suggestion | runs dismiss | icon-only | Grey |

## app/papic/join/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan | goes to / | button | Grey |
| Continue | goes to target | button | Terracotta |

## app/papic/lightcheck/_components/lightcheck-client.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start camera | runs start | button | Terracotta |
| Measure FPS (5s) | runs measureFps | button | Grey |
| Toggle torch | runs toggleTorch | button | Grey |
| Stop | runs stop | button | Red |
| Copy results | runs copy | button | Grey |

## app/papic/me/[token]/_components/guest-story-maker.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Make my Story | runs run | button | Grey |
| Choose photos & music | runs openPicker | button | Terracotta |
| clip | runs toggleSelect(m.id) | button | Grey |
| Make my Story | runs void runPicked() | button | Grey |
| Back | runs setPhase('idle') | button | Grey |
| Check again | runs run | button | Amber |
| Share my Story | runs onShare | button | Grey |
| Save | runs onShare | button | Green |
| Make again | runs run | button | Terracotta |
| Choose again | runs openPicker | button | Terracotta |
| Try again | runs run | button | Amber |
| {label} {active ? ( ) : null} | runs onSelect | button | ? (dynamic label; meaning set at call site) |

## app/papic/me/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Browse everyone's photos | goes to /papic/me/${encodeURIComponent(token… | button | Terracotta |
| Open full size to save | goes to /papic/me/${token}/photo?id=${encode… | button | Green |
| Download my photos | goes to /papic/me/${token}/download | button | Grey |
| ‹dynamic label› | link | text link | link — stays a link |
| Decorate a photo | goes to /papic/me/${token}/session | button | Terracotta |
| Back to Setnayan | goes to / | button | Grey |
| Back to your invitation | goes to backToInvite | button | Grey |
| Open my camera | goes to /papic/me/${encodeURIComponent(clean… | button | Grey |
| Open my camera | goes to /papic/seat/${encodeURIComponent(cam… | button | Grey |

## app/papic/order/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Copy ×2 | custom control | button | Grey |
| Log my payment | submits its form | button | Green |

## app/papic/pool/_components/pool-grid.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| In your gallery / I'm in this | runs toggleLink(tile) | button | Green |
| {isLoadingMore ? ( ) : null} Load more | runs loadMore | button | Grey |

## app/papic/pool/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan | goes to / | button | Grey |
| Back to my photos | goes to /papic/me/${encodeURIComponent(sessi… | button | Grey |

## app/papic/seat/[token]/_components/camera-bridge-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Pair a camera · demo DSLR (no hardware) | runs pair | button | Terracotta |
| Unpair | runs unpair | button | Red |
| Restore camera | runs simulateRecover | button | Amber |
| {busy ? ( ) : ( )} Still | runs fire('still') | button | ? (dynamic label; meaning set at call site) |
| 10s clip | runs fire('clip') | button | ? (meaning not evident from label) |
| Drop | runs simulateDrop | button | ? (meaning not evident from label) |

## app/papic/seat/[token]/_components/papic-seat-capture.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Reload & try again | runs window.location.reload() | button | Amber |
| ‹dynamic label› | goes to /signup?next=${encodeURIComponent(/p… | button | Grey |
| Done tagging | runs stopTagging | button | Green |
| recording ? 'Recording — release to stop' : clipsAllowed ? 'Tap to t… | button, no inline handler | button | Terracotta |
| Take a photo | runs (photoFull ? flashCapNotice('photos'… | button | Terracotta |
| Stop recording / Record a 10-second snippet | runs recording ? stopClip() : clipFull ? … | button | Red |
| Tagged {formatCount(tagCount)} · tag more / Tag who’s in it | runs startTagging() | button | Terracotta |

## app/papic/seat/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to Setnayan | goes to / | button | Grey |

## app/pay/[reference]/_components/pay-panel.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {children} | runs handler (e) => { // Let a modified click ope… | text link | Terracotta |
| (icon only) | runs setBig(true) | icon-only | ? (no visible label in code) |
| I've sent the payment | submits its form | button | Green |

## app/pay/[reference]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Copy | custom control | button | Grey |
| {payable.back.label} ×2 | goes to payable.back.href | text link | link — stays a link |
| I don't want these after all — remove them | submits its form | button | Red |
| Finish setting up | goes to /dashboard/${payable.eventId | button | Green |
| {payable.back.label} | goes to payable.back.href | button | Grey |

## app/proposals/[publicId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {backDoor.label} | goes to backDoor.href | text link | link — stays a link |
| Print | custom control | button | Grey |
| {m.link_domain ?? m.link_url} | goes to m.link_url | text link | link — stays a link |
| Send to couple | submits its form | button | Blue |
| Delete draft | submits its form | button | Red |
| Accept quote | submits its form | button | Blue |
| Decline | submits its form | button | Red |
| Amount to pay | goes to depositStepHref(proposal.event_id, b… | button | Green |
| Ask {businessName} to confirm your booking / Book {businessName} | custom control | button | Green |
| Book on your Suppliers page | goes to lockTarget.benchHref | button | Green |

## app/realstories/_components/gallery.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| ‹dynamic label› | goes to item.href | text link | link — stays a link |
| Watch the storyteller's cut / Read the storyteller's chapter | goes to item.storytellerCutHref | button | Grey |
| Clear search | runs setQuery(''); inputRef.current?.focu… | icon-only | Grey |
| All | runs setActiveType(null) | button | Grey |
| {type} | runs setActiveType(activeType === type ? … | button | Grey |

## app/realstories/_components/share-buttons.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Share this story on Facebook | runs openShare(fbHref) | icon-only | Grey |
| Save this story to Pinterest | runs openShare(pinHref) | icon-only | Green |
| Share this story with an app on your phone | runs shareNatively | icon-only | Grey |
| {copied ? ( ) : ( )} [Copy link to this story] | runs copyLink | button | Grey |
| Facebook | runs openShare(fbHref) | button | Grey |
| Pinterest | runs openShare(pinHref) | button | Green |
| {copied ? ( ) : ( )} Copied / Copy link | runs copyLink | button | Grey |

## app/realstories/_components/stories-search.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All | runs onPick(null) | button | Grey |
| {opt} | runs onPick(active === opt ? null : opt) | button | ? (dynamic label; meaning set at call site) |
| Clear search | runs setQuery('') | icon-only | Grey |

## app/realstories/[slug]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {credit.role} | goes to credit.href | button | ? (dynamic label; meaning set at call site) |
| All stories | goes to /realstories | text link | link — stays a link |
| Stories | goes to /realstories | text link | link — stays a link |

## app/reset-password/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Send me a new link | goes to /forgot-password | button | Blue |
| Back to sign in | goes to /login | button | Grey |
| Save new password | submits its form | button | Green |

## app/samahan/join/[token]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Go home ×2 | goes to / | button | Grey |
| Create account | goes to /signup?next=${encodeURIComponent(ne… | button | Terracotta |
| Sign in | goes to /login?next=${encodeURIComponent(nex… | button | Terracotta |
| Join {invite.name} | submits its form | button | Terracotta |
| No thanks | goes to /dashboard | button | Red |

## app/tl/about/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Home | goes to / | text link | link — stays a link |
| English | goes to /about | text link | link — stays a link |
| How it works | goes to /tl/features#how-it-works | button | Grey |
| Tingnan ang pricing | goes to /pricing | button | Grey |
| pricing page | goes to /pricing | text link | link — stays a link |
| help center | goes to /help | text link | link — stays a link |
| Gumawa ng account | goes to /signup | button | Grey |
| Browse vendors | goes to /explore | button | Terracotta |

## app/tour/_components/tour-chat-thread.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {suggestion} | runs send(suggestion) | button | Blue |
| Send | submits its form | icon-only | Blue |

## app/tour/budget/_components/tour-budget-planner.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| `Adjust {label} — suggested {formatPhpRounded(leaf.amountPhp)}` | runs onOpen | button | Terracotta |
| ‹dynamic label› | runs (e) => { if (e.target === overlayRef… | clickable element | Grey |
| Close | runs onClose | icon-only | Grey |
| Reset to suggested | runs onReset(); setDraft(formatPlain(reco… | button | Grey |
| Done | runs commitDraft(draft); onClose(); | button | Green |

## app/tour/budget/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Back to all stops | goes to /tour | text link | link — stays a link |
| Next: the gallery | goes to /tour/gallery | button | Grey |
| Start planning · free | goes to /onboarding/wedding?from=tour | button | Terracotta |

## app/tour/gallery/_components/tour-live-wall.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Bring the wall to life | runs setPlaying(true) | button | Grey |

## app/tour/gallery/_components/tour-palette-preview.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Their palette | runs setHueShift(0) | button | Grey |

## app/tour/gallery/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| The budget | goes to /tour/budget | text link | link — stays a link |
| All stops | goes to /tour | text link | link — stays a link |
| Start planning · free | goes to /onboarding/wedding?from=tour | button | Terracotta |

## app/tour/layout.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start your own, free | goes to /onboarding/wedding?from=tour | text link | link — stays a link |

## app/tour/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Start the tour &rarr; | goes to /maria-and-jose | button | Terracotta |
| {card} | goes to s.href | text link | link — stays a link |
| Start planning · free | goes to /onboarding/wedding?from=tour | button | Terracotta |

## app/tour/seating/_components/find-your-seat.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {seat.name} {seat.tableLabel} | runs pick(seat) | button | ? (dynamic label; meaning set at call site) |

## app/tour/seating/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| larr; The vendors | goes to /tour/vendors | text link | link — stays a link |
| All stops | goes to /tour | text link | link — stays a link |
| Start planning · free | goes to /onboarding/wedding?from=tour | button | Terracotta |

## app/tour/vendors/_components/tour-shortlist.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Toggle Setnayan AI | runs setAiOn((v) => !v) | icon-only | Grey |

## app/tour/vendors/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| larr; The invitation | goes to /maria-and-jose | text link | link — stays a link |
| All stops | goes to /tour | text link | link — stays a link |
| Start planning · free | goes to /onboarding/wedding?from=tour | button | Terracotta |

## app/u/_components/follow-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Following / Follow | runs onClick | button | Terracotta |

## app/u/_components/mutual-days.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| A celebration &rsaquo; | goes to /${d.slug | text link | link — stays a link |

## app/u/[userSlug]/c/[chapterId]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| lsaquo; {creatorName} | goes to /u/${canonicalSlug | text link | link — stays a link |
| {v.name} &rsaquo; | goes to /v/${v.slug | text link | link — stays a link |
| Book through this chapter | goes to /v/${v.slug}?ref_chapter=${chapter.p… | text link | Green |
| `{chapter.title} · {creatorName}` | custom control | clickable element | ? (meaning not evident from label) |
| report page | custom control | button | Blue |
| Made with Setnayan | goes to https://www.setnayan.com | text link | link — stays a link |

## app/u/[userSlug]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| · / ) : poster.sheet === 'letterpress' ? ( / | goes to /u/${canonicalSlug}/${event.slug | text link | link — stays a link |
| follow | custom control | button | Terracotta |
| `{displayName} · Setnayan` | custom control | button | ? (meaning not evident from label) |
| Report this page | custom control | button | Blue |
| Made with Setnayan | goes to https://www.setnayan.com | text link | link — stays a link |
| {v.name} | goes to /v/${v.slug | text link | link — stays a link |

## app/v/[slug]/_components/anon-inquiry-composer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Set up your event to send this / Log in free to see your conversatio… | submits its form | button | Blue |

## app/v/[slug]/_components/inquiry-composer.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Edit | goes to guestEditHref | text link | link — stays a link |
| View thread | goes to existingThreadHref | button | Grey |
| Update what you're looking for | runs setModal({ kind: 'open' }) | button | Grey |
| View thread | goes to autoState.threadHref | button | Grey |
| Sending… | runs onInquireClick | button | Blue |

## app/v/[slug]/_components/service-details-sheet.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Close ×2 | runs onClose | icon-only | Grey |
| Inquire about this | runs onInquire | button | Blue |
| Inquire about this | runs handler onClose | text link | Blue |

## app/v/[slug]/_components/services-gallery.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| All | runs setActive(ALL) | button | Grey |
| {g.label} | runs setActive(g.key) | button | Grey |
| {label} {formatCount(count)} | runs onClick | button | ? (dynamic label; meaning set at call site) |

## app/v/[slug]/_components/share-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Copied / Share | runs onShare | button | Grey |

## app/v/[slug]/booth/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| View {name} 's profile → | goes to /v/${slug | button | Grey |

## app/v/[slug]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| (icon only) | goes to / | icon-only | link — stays a link |
| Return to Dashboard | goes to /dashboard | text link | link — stays a link |
| Plan with Setnayan | goes to /signup | text link | link — stays a link |
| Inquire ×3 | goes to #get-in-touch | button | Blue |
| Featured in {formatCount(featuredEditorials.le…} {' '} story / stories | goes to #featured-stories | button | Grey |
| displayLabel ×2 | custom control | button | ? (meaning not evident from label) |
| Walk into my booth | goes to /v/${vendor.business_slug ?? slug}/b… | button | Terracotta |
| Watch them play it | goes to song.performance_url | text link | link — stays a link |
| Featured story / Real Story {story.hostNames} · Read their story | goes to /${story.slug | button | Grey |
| Join the waitlist for this date | submits its form | button | Terracotta |
| Plan with Setnayan | goes to /signup | button | Terracotta |
| Back to home | goes to / | button | Grey |
| Report this shop | custom control | button | Blue |
| {body} | goes to v.href | button | ? (dynamic label; meaning set at call site) |
| Show more reviews | goes to /${slug}?reviewsPage=${nextPage}#rev… | button | Grey |
| (icon only) | goes to /login | icon-only | link — stays a link |

## app/vendor-invite/[slug]/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Sign up free & add this supplier | goes to /signup?as=couple&next=${encodeURICo… | button | Terracotta |
| I already have an account | goes to /login?next=${encodeURIComponent(nex… | text link | link — stays a link |
| Create your {eventTypeLabel.toLowerCase()} event | goes to /dashboard/create-event?next=${encod… | button | Terracotta |
| Add {vendor.business_name} to my plan | submits its form | button | Terracotta |
| or create a new event | goes to /dashboard/create-event?next=${encod… | text link | link — stays a link |

## app/waitlist/page.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| Plan your wedding free | goes to /onboarding/wedding | button | Terracotta |
| Browse vendors first | goes to /explore | text link | link — stays a link |
| Pre-register your business today | goes to /for-suppliers | text link | link — stays a link |

## app/wall/[eventId]/_components/wall-claim.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {busy ? : null} Start the wall | submits its form | button | Terracotta |

## components/print-button.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| {label} | runs window.print() | button | Grey |

## components/sd-loader/loader-overlay.tsx

| Label (as the user sees it) | What it does | Today | Colour |
|---|---|---|---|
| submit | submits its form | button | Green |

## Totals

- Controls counted: **1415** (after excluding 25 invisible scrims / 3D hit-targets / stopPropagation wrappers)
- Pure page links that stay links: 404
- Text links, bare icons or clickable non-button elements that must become buttons: **169** (of which 34 are non-button clickable elements)
- Unclassified "?": **149**
- Guest Event Hub (app/[slug]/**) controls: 290, of which themed: **35**, fixed: 255
- By colour: Terracotta 171 · Red 69 · Green 104 · ? 149 · Grey 420 · Blue 65 · Amber 33 · link — stays a link 404
