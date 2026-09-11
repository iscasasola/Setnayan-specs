# Service Control Centres — one pattern, drawn 2026-08-28

**Status:** DESIGN + RESEARCH. Drawn, not built. Nothing in the app changed.
**Prototype:** [`prototypes/service_control_center_pattern_2026-08-28.html`](prototypes/service_control_center_pattern_2026-08-28.html)
**What it answers:** the owner's 2026-08-27/28 ask, verbatim — *"can we improve the UI better. use the concept available in the market so we can generate the best approach for our papic control center. with this in mind, we will also fix the other in app service control centers."* And his verdict on the rebuilt Papic page: *"it doesn't look like a photo app control center. it still feels like it is a business page. with not much imagery and app feel UI."*

**The one-paragraph version.** The structure that shipped two days ago is right and stays — four facts, one next step, four ways in, the library, credits, quiet settings, offers last. What changes is what the page *opens on*. Every product in the market that feels like a photo product opens on its content, not on a form. So every Setnayan service now leads with a **stage** — its own content, in our approved dark gallery panel: Papic opens on the library, Live Studio on the broadcast screen, the event page on a living miniature of itself. When there is nothing yet, the stage shows the space the content will fill — a film roll of empty frames, a countdown to the day the cameras open, and one lit frame that starts it — because in this market, an empty roll is a promise, and a blank page is an apology. One pattern, seven slots, all 18 services; not one control is deleted.

---

## 1 · What the market does (the half the owner asked for)

Researched 2026-08-28 by reading the products' own announcements, help docs and published teardowns — not from memory. What each does about the exact problem — making a control page feel like a media product, not a settings screen:

**Google Photos — the grid is the home.** Opening the app lands directly on the photo grid; no dashboard first. Their 2024–25 redesign made thumbnails bigger, made videos play right in the grid, and pushed albums, printing and settings behind one demoted tab. Their own words for the principle: the app is "the home for your life's memories" — remembering first, managing second. *(Sources: Google's redesign announcement on blog.google; 9to5Google's redesign coverage, Nov 2024 and Mar 2025; Android Authority's carousel teardown.)*

**Apple Photos (iOS 18) — controls demoted below the content.** They deleted the tab bar entirely: one scrolling page, the photo grid at the top taking about two-thirds of the first screen, and everything else as photo-filled rows below it — utilities dead last. "Settings" for the page mostly means reordering the content rows. *(Sources: MacRumors' iOS 18 Photos guide; Engadget's interview with the design team.)*

**The disposable-camera rivals — Dispo, Lapse, POV, and Kuha (the direct competitor) — anticipation-shaped emptiness.** This category never shows a blank pre-event page. Dispo draws the back of a physical camera with a develop-time countdown. Lapse sends photos to a "darkroom" — a screen of obscured frames you hold down to reveal. Kuha's pre-event surface is a designed countdown with an animated envelope, and its host page leads with big live numbers over a photo carousel. POV frames setup as camera behaviour ("choose a style, how many photos each person takes, when photos reveal"), not as configuration. And all of them treat the QR card as a designed keepsake, not a utility. *(Sources: screensdesign's Dispo teardown; Lapse reviews in TapSmart and The Phoblographer; pov.camera and its App Store listing; kuha.app/weddings; our own `Competitor_Kuha_Teardown_2026-07-20.md`. Caveat, stated honestly: the rivals don't publish host-dashboard screenshots, so the host-screen claims are verified from their own marketing copy and teardowns, not from screenshots.)*

**Frame.io and Dropbox — state lives on the media.** Approval status, version count and upload progress render in the corner of the thumbnail, never in a list beside it. Hovering a video tile scrubs through it. "Settings" on the library page means "how big are my thumbnails." *(Sources: Frame.io V4 layout docs and beta post; Videomaker's review; Dropbox's April 2024 product updates.)*

**Luma and Eventbrite — the manage view is the guest view.** Luma anchors the host's dashboard with the same cover image the guests see, and every edit opens as an overlay on top of it, so the host never leaves the guest-facing page. Eventbrite leads with tickets-sold-of-capacity — a fraction filling toward a visible total, not a stat table. *(Sources: screensdesign's Luma breakdown; Luma's help pages; Eventbrite's analytics feature page.)*

**StreamYard, Riverside, Restream — the output is the centre.** The middle of a control room is always what the audience sees; waiting cameras sit in a strip below it; global settings hide behind one icon; and pre-live is the same screen as live with a colour flip — the pre-event state is a preview of the show, never a form. *(Sources: StreamYard's greenroom and layouts help docs; Restream's Studio guides.)*

### What the research actually changed about the design

Three things, concretely:

1. **The stage exists because of it.** The first draft instinct was to keep the facts strip on white and add a gallery lower down. The market evidence is unanimous that the content must be the first paint — so the dark library panel, which our approved drawing showed only *after* the wedding, now opens the page in every state, and the facts ride on its lower edge.
2. **The empty state stopped being the weak state.** The rivals' single strongest move is making emptiness read as anticipation — Lapse's darkroom, Dispo's develop clock, Kuha's countdown. Our empty stage is a film roll of waiting frames with a countdown and one lit frame ("Add the first memory"). Before the research, the honest-empty answer was a sentence; after it, the honest-empty answer is a picture.
3. **State moved onto the tiles.** Per-tile credit chips existed in the approved after-state; Frame.io's pattern extended them everywhere: clip lengths on tiles, a screening photo drawn as an obscured "being checked" frame (a rule we already enforce, silently — now visible), and each source row carrying three mini-frames of what it has contributed.

---

## 2 · The pattern — seven slots, two lives, three states

Measured first (2026-08-28, against current shipped code): the 18 service surfaces share **no pattern** — from a 21-line redirect stub to a 2,283-line page; about half wear the shared "shop window" buy layout, half wear nothing. Two good shapes already ship and are both kept:

- **The shop window** (already shipped, about half the services): the App-Store-style page for a service the couple hasn't started — what it is, what it costs, what's included. Unchanged.
- **The control room** (this pattern): for a service the couple has started. Seven slots, in order:

| Slot | What it is | Rule |
|---|---|---|
| **S1 · The stage** | The service's own content, first, in the dark gallery panel: Papic = the library · Live Studio = the broadcast screen · event page = itself, miniature and live · Save-the-date = the film's first frame · Pakanta = the song | Never disappears. Empty = the frames it will fill + a countdown + the one act that starts filling |
| **S2 · The four facts** | The same four cells the approved drawing locked, fused onto the stage's lower edge | Still the first text on the page |
| **S3 · One next step** | The terracotta-edged card naming the single thing to do now | Unchanged from the approved drawing |
| **S4 · The parts** | The service's moving parts as rows — sources, cameras, stages — each carrying its own state and a small cluster of what it contributed | State on the thing, not in a list elsewhere |
| **S5 · Set once** | Quiet setting rows, one sheet each | Never above the stage |
| **S6 · The money card** | Credits or plan as a filling meter, bought in place | Only where one exists |
| **S7 · Offers last · the boundary** | Upsells as quiet tiles at the bottom; a dashed note naming what deliberately lives elsewhere | An offer never outranks the day |

**Three states, one page:** before (the stage shows the waiting roll and the countdown) · during (the stage fills live and counts up) · after (the stage is the headline and the controls quiet down). Same order throughout — only the stage's contents and the next step change.

**The small-service rule:** a service with little to manage is S1–S3 long — a stage, four facts, one next step — and that is a complete page, not an unfinished one.

---

## 3 · The three worked examples

**Papic (full — phone and desktop, all three states).** Before the day: the stage is the empty film roll — one lit frame opens the existing upload sheet, a chip counts down to the cameras opening, and the required act (the camera dates) sits directly below as the next step, exactly where the approved drawing put it. On the day: tiles settle in as they arrive, one obscured frame says "arriving — being checked," the caption bar counts up, and "peek at the library" becomes the stage's own button. After: the approved after-state, unchanged, in its promoted position. Everything below the stage keeps the shipped order.

**Live Studio (brief).** The stage is the broadcast monitor — dark before the day and saying so — with the named cameras as a strip beneath it, exactly the control-room idiom the market uses and our approved day-of controller drawing already speaks. Facts: cameras named · channel · what's still coming · plan. Next step before the day: hand the camera QRs to their people. The YouTube channel control — including the disconnect button that page exists to keep alive — moves into a "set once" row whose sheet preserves all four of its states word for word. The shop window and the free single-camera door are untouched.

**The event page (brief — and one vocabulary note).** "Event Hub" is the guests' public address (owner-locked 2026-08-16); this example is the couple's control centre *for* it. The stage is a living miniature of their own page in whichever of its four stages it is in right now, with "open as a guest" beside "edit." Facts: the stage, replies in of invited, who hasn't replied, days to go. The parts are the four stages of the one link. Every editor screen that exists today keeps its own page — the rows here are doors, not replacements. Whether this gathered page gets built at all is Owner decision 4.

---

## 4 · The port contract

The full tables are printed at the bottom of the prototype. The summary:

- **Papic:** every control on the page that shipped 2026-08-27 is kept. Two moves: the library panel is promoted from after-only to always (the stage), and the facts strip fuses onto it. One thing made visible that was silent: a photo being screened shows as an obscured frame. **Deletions: none.**
- **Live Studio:** the buy surface, the lead-time warning, the free-single-camera door, the price-from-the-live-catalog rule, and all four states of the YouTube channel panel (disconnect included) are kept; the channel panel becomes a row + sheet with its state named on the row. **Deletions: none.**
- **The other fifteen:** the pattern licenses no deletions. Each service's port gets its own table like the two above when it is drawn.

---

## 5 · Owner decisions — flagged, not made

1. **The stage-first order.** The approved 08-25 drawing (and the shipped page) opens on the four facts on white; this design opens on the dark stage with the facts fused onto its lower edge. It is the one structural change, it exists because of your own complaint and the market evidence, and it is yours to approve or refuse. Refusing it keeps the shipped page as is; everything else in this document depends on it.
2. **The monogram on the stage.** Carried over unresolved from the 08-25 drawing: whether the couple's monogram belongs on the library header.
3. **Photo stand-ins in drawings vs. real photos in the product.** In the built page the stage shows real photographs. The empty state shows empty frames only — no sample or demo photos of strangers. If you'd rather the empty state show a tasteful sample set ("this is what it will look like"), say so; it was left out on purpose because a stranger's wedding in your library is a lie.
4. **Does the event page get a gathered control centre at all?** Its ~15 editor screens exist and work today, reached from the dashboard. The third worked example gathers them under one stage. Building it is new scope — your call, and it can wait.
5. **Rollout order for the other fifteen.** The pattern is drawn to fit all of them; nothing forces them to convert at once. Suggested order (cheapest first, most visible first): Papic skin → Live Studio → then per-service as each is next touched. Yours to re-order.
6. **The screening frame.** Showing "arriving — being checked" makes a silent rule visible. If you'd rather screening stay invisible to the couple, the frame simply doesn't render and nothing else changes.

---

## 6 · Footnotes for engineers (the owner can stop reading here)

- Read-only worktree used: `/tmp/wt-design` at `origin/main` `d6a5a79f2`. Census re-verified there; the home checkout was never read.
- **RULE 0 findings that shaped this:** (a) `AppStoreLayout` (`apps/web/app/_components/app-store/layout.tsx`, 589 lines) already IS the shared shop-window pattern — used by `studio/about/[addon]` via `addon-detail-view.tsx` and by `live-studio-control/page.tsx`. Do not build a second buy layout. (b) `animated-monogram` (21 lines) is a redirect stub to `/monogram` — the census's smallest "service" is not a service page. (c) The shipped Papic page already has the structure this skins: `where-you-stand.tsx` (facts), `source-row.tsx`, `setting-row.tsx`, 13 sheets. (d) The census column "has buy-hero = 0" for `live-studio-control` is a one-spelling artifact — the page renders a hero through `AppStoreLayout`, whatever marker the census grepped for. Re-derive that column from `AppStoreLayout` imports before acting on it.
- The obsidian stage is the Gallery archetype (`prototypes/archetype_content_editorial_gallery_detail_2026-08-01.html`), ported — same panel the 08-25 Papic after-state and the three shipped photo screens use (`#17160F`, per-tile credit chips).
- Dark-surface tokens: light-ground `--pos #4F6B4A` measures 2.7:1 on obsidian — never use it there; the stage uses `#46A46C` (5.3:1, the approved live-studio prototype's ready-green). Accent text on obsidian is `#E5794E` (5.7:1); `#C24E25` on obsidian is 3.5:1 and is used only as button fill. Remember the repo's slot-name trap: the Tailwind slot named `terracotta` is the gold; the CTA lives in `mulberry`.
- Tile gradients are photo stand-ins (content), the same exception the approved film-look swatches earned; page chrome stays flat and hairline. All motion one-shot, ≤260ms, disabled under `prefers-reduced-motion`.
- The event-page example's editor rows correspond to the existing `dashboard/[eventId]/landing/*` sub-pages (hero-photo, colors, our-story, dress-code, what-to-bring, widgets, privacy, …) plus `event-qr`/`launch`. They stay where they are; the centre only links.
- Live Studio's channel sheet must preserve the four-state logic and the disconnect form guarded by `lib/live-studio-cast-retirement.test.ts` — the guard's reachability requirement follows the control into the sheet.
- Prices in the drawings are the owner-locked ladder for illustration; the built page reads `platform_retail_catalog_v2` as ever. The ladder rung "+10,000 ₱3,200" matches the locked table (the 08-25 drawing shows ₱3,000 — the locked list says ₱3,200; this file follows the locked list).

*Research citations (full URLs, for re-verification): Google — blog.google Photos redesign announcement; 9to5google.com 2024-11-28 (Memories→Moments) and 2025-03-23 (year-long redesign); androidauthority.com Memories-carousel teardown. Apple — macrumors.com iOS 18 Photos guide; engadget.com "How Apple redesigned its Photos app around customization". Rivals — screensdesign.com Dispo showcase; tapsmart.com and thephoblographer.com Lapse reviews; pov.camera + its App Store listing; kuha.app/weddings. Pro libraries — help.frame.io project-layout-overview; blog.frame.io V4 beta feature post; videomaker.com Frame.io review; dropbox.com April-2024 product updates. Event consoles — screensdesign.com Luma showcase; help.luma.com creating-an-event; eventbrite.com/features/analytics. Control rooms — support.streamyard.com greenroom + layouts articles; restream.io Studio guide and go-live help.*
