# 0017 — Patiktok

**Status:** drafted 2026-05-11
**Iteration:** 0017
**Surface:** Guest engagement / event-day station
**Dependencies:** 0000 App Shell, 0002 QR Invitations (personalized QR), 0012 Papic (storage), Setnayan owned-AI music catalogue (cross-workstream)
**Author:** Ice

---

## What Patiktok is

Patiktok is a **TikTok-style mimic station** placed at the wedding venue. Guests stand on a physical **X-mark floor sticker**, perform the **full chosen reel** (typically 15-60 seconds) through the Setnayan app, then review their take. If they're happy, the take is saved. The app then auto-compiles a **~3-second highlight from each guest's full recording** into one continuous group video with masked transitions and a looping Setnayan-owned music track.

**Face-lock + transition continuity:** During recording, the app auto-tracks the central performer's face — crops and zooms in real time to keep their face anchored at the same screen position. Critical detail: the face anchor position is **consistent across all guest clips**. When the compilation cuts from Guest A to Guest B, both faces are centered at the same X/Y coordinates. The masked transition (dissolve, swipe, morph) reads as one continuous performance because the viewer's eyes stay locked on the same on-screen spot — only the body underneath swaps. Uses Papic's existing face-detection vectors.

**The output:** one TikTok-style group reel where every guest gets ~3 seconds, auto-selected from their best moment. Couple gets a viral-ready compilation that captures the energy of the event.

**Filipino branding:** "Patiktok" = "to TikTok" (PH conversational form). Pairs with Papic (capture) and Panood (broadcast) in the Setnayan product family.

## What's included in the Patiktok Station Pack

| Component | Description |
|---|---|
| Physical X-mark floor sticker | Branded vinyl decal shipped to couple. ~50 cm × 50 cm. Repositionable adhesive. |
| Companion signage card | Tabletop card next to the X explaining "Scan your QR → Stand here → Mimic the reel." |
| Patiktok station kiosk app | A guest device (Setnayan-provided tablet OR couple's iPad with Setnayan app) runs in kiosk mode. AR overlay shows the reel to mimic. |
| Trending sound selection | Setnayan polls TikTok daily for trending sounds and surfaces **top 5 international + top 5 Philippines local** = 10 sound options at any time. Couple picks one when buying Patiktok. Selections refresh daily — if a couple's chosen sound drops out of the top 10 before the event, Setnayan prompts them to swap or auto-falls-back to Setnayan-owned music. |
| Reel template library (paired with sound) | When couple picks a TikTok trending sound, the app surfaces the choreography/reel templates that have gone viral with that sound. Pairs trending sound + trending reel = high mimic engagement. |
| 3-sec auto-capture | App captures ~3 seconds of guest mimic. Guests can retake before submitting. Final clip auto-trims to beat sync. |
| Beat-sync indicator | AR overlay on camera shows beat ticks so guest knows when each move should land. |
| Masked-transition compilation | App auto-stitches all submitted clips into one continuous video. Transitions: dissolve, swipe, beat-match cut, mask wipe. |
| Continuous looping music | One Setnayan-owned AI-generated track loops through the entire compilation. Music doesn't restart between clips. |
| Compilation export | Final reel exported in 9:16 vertical, 1080p (or 4K if 4K Upgrade is purchased). |

## TikTok integration — viral loop posting via @SetnayanWeddings

Patiktok publishes through **Setnayan's own TikTok account (`@SetnayanWeddings`)**. This is intentional — Setnayan captures monetization upside on viral compilations while keeping the licensing model simple. No per-couple OAuth headaches; one account, one set of credentials, one monetization pool.

### Sound selection — couple curates 2 templates, hands off via printable QR

**Couple's pre-event flow:**

1. Couple browses TikTok in their own app (trending list is already personalized to them).
2. Couple picks **2 TikTok templates/sounds** — one **primary** + one **backup**. Two is the sweet spot: enough variety for the operator to swap if the primary isn't landing, simple enough that nobody at the event is fiddling with choices.
3. In Setnayan app, couple opens Patiktok setup and links the chosen templates (via TikTok share → Setnayan app, or paste link).
4. Couple marks one as primary, the other as backup.
5. Couple generates the **Patiktok session QR** — one QR per event, encodes both templates + event token + couple's @-tag for the post.
6. **QR is printable.** Setnayan emails a print-ready PDF (high-DPI QR + setup instructions). Couple prints copies, hands them to whoever will operate the booth, places extras on station signage as backup.

**Booth operator flow (at the venue):**

1. Operator scans the printed Patiktok QR with their phone (any phone with Setnayan app, or via web — no Setnayan account required).
2. Setnayan opens the **Patiktok Operator Dashboard:**
   - Couple's event name + date at the top
   - **Primary chosen TikTok template** displayed prominently
   - **Backup template** below — one tap to swap
   - Live counter of submissions captured
3. Operator taps "Start Recording" → camera opens for next guest.
4. **Persistent QR access:** the printed QR can be re-scanned anytime. If operator's phone dies / runs out of battery / loses internet — they grab a different phone, re-scan the printed QR, pick up where they left off. Token is event-scoped + persistent for the full event-day pack window.

**Guest flow:**

1. Guest walks up to the X mark.
2. Operator shows guest the 2 template options: "Pick one — primary or backup?"
3. Guest picks → camera opens with that template's AR overlay + sound preview.
4. Guest performs the full reel → face-lock keeps them centered → reviews → submits or retakes (max 3 retakes).
5. Next guest cycles through.

Different guests can pick either template. The final compilation interleaves the two — primary template clips and backup template clips alternate or cluster by music — still musically coherent because there are only 2 sound styles total.

**Why 2 templates instead of more:**
- Less decision paralysis for couples picking (just 2 favorites, not a long shortlist)
- Less decision paralysis for guests at the X mark (one of two vs scrolling through five)
- Operator dashboard stays clean — primary on top, backup ready to swap
- Final compilation reads as cohesive — 2 sound styles max, not a mashup of 5
- Guests enjoy the event more, less time spent fiddling with template selection

### Guest TikTok handle capture — via Setnayan Guest Profile

1. When guest receives their personalized Setnayan invite, the Guest Profile shows: *"Add your TikTok? Get tagged in event compilation videos."*
2. Guest opens TikTok app → Profile → Share QR (TikTok native feature).
3. Guest scans that QR with Setnayan app camera (or uploads screenshot).
4. Setnayan stores the guest's @handle in their guest record.
5. **Done.** When they perform at the Patiktok station, tagging is automatic.

Guests don't need to do anything extra at the station. The tagging happens server-side after the compilation is rendered.

### External display + dual-view mimic UX

Operator's phone can stream the mimic interface to an external monitor / TV / projector at the venue. Guests then see the reference TikTok playing alongside (or with) themselves — like karaoke for body movements. Reuses Setnayan's existing "Cast to projector" infrastructure from Panood.

**Two display modes the operator picks:**

| Mode | Layout | Best for |
|---|---|---|
| **Split screen (50/50)** | Left half: original TikTok playing<br>Right half: live camera (mirror) | Choreography-heavy reels — guest can side-by-side compare every move |
| **Picture-in-picture (PIP)** | Original TikTok in top-right corner (small)<br>Live camera fills the rest | Solo expression / lip-sync — guest performs naturally with the reference as glance reference |

**Hardware (couple / operator brings, NOT Setnayan-provided — apparatus rule):**
- HDMI dongle compatible with operator's phone (Lightning HDMI / USB-C HDMI / AirPlay receiver / Chromecast)
- HDMI cable
- TV or projector at the venue (often part of the venue's AV setup or rented from an AV vendor)

**The recording flow with external display:**

1. Operator connects phone to monitor via HDMI dongle. Setnayan app detects external display and switches to dual-view mode.
2. Operator's phone now shows **control panel only** (start/stop, template swap, submission count, mode toggle).
3. **External monitor** shows the guest the mimic interface.
4. New guest steps on the X mark. App shows: *"Want to watch the reel first? [Play preview]"*
5. Guest watches the original once or twice through speakers + monitor.
6. **"Ready to record?"** prompt appears with a 3-2-1 countdown.
7. On countdown, original TikTok plays in sync with the live recording — guest mimics in real-time. Music plays through monitor speakers or venue PA.
8. Face-lock keeps the guest centered in the live view.
9. After recording: review on monitor → retake / submit.

**Hardware-free fallback:** if couple doesn't have an external monitor, Patiktok still works phone-only. Guest watches the AR overlay on the phone screen instead of a TV. Less spectacle but functional.

### Multi-performer handling (2+ people on the X mark)

Patiktok auto-detects when multiple faces are in frame:
- Frame zooms out to keep all faces visible
- Face-lock anchors on the **geometric center of all detected faces**
- 3-sec compilation highlight is selected from the moment all performers are clearly visible
- After the clip is saved, app prompts: *"Tag others in this clip?"*
- Primary performer can add multiple TikTok handles (or pull from RSVP'd guests who already linked their TikTok)
- Compilation caption @-mentions all tagged performers per clip

### Posting flow (post-event)

1. Setnayan renders the final compilation (face-lock + masked transitions + couple's chosen TikTok sound).
2. Setnayan posts to **@SetnayanWeddings** with caption: `"[Couple Name]'s Patiktok — [event date] · @[guest1] @[guest2] ... · #[customhashtag]"`.
3. Every @-mentioned guest gets a TikTok notification, sees themselves in the compilation, can repost to their own profile via TikTok's native share-to-profile.
4. Couple gets the compilation post link to share to their own followers (couple can also natively repost to their own TikTok if they want).
5. **If the video monetizes, Setnayan collects the ad revenue.** A single viral wedding compilation could earn ₱500–₱50,000 in TikTok Creator Fund / brand sponsorship — pure margin upside.

### Downloadable backup copy

Couple also gets a downloadable MP4 of the compilation. This version uses Setnayan's owned-AI music (fallback) to be safe for off-TikTok sharing. The TikTok-sound version lives only on @SetnayanWeddings (where it's properly licensed).

## Pricing

| SKU | Price | Duration / scope | Notes |
|---|---|---|---|
| **Patiktok** | **₱2,499** | **per booth · 5 hours** | Single tier. App-only. Covers the standard PH wedding reception window. Includes X-mark decal + app station + TikTok integration + auto-post + guest tagging + multi-performer + compilation + **standard background soft copy**. |
| **Patiktok additional station** | **₱999** | per extra station · 5 hours | Multi-purchase. Each station gets own X-mark + compilation. Matches the base booth's 5-hour window. |
| **Patiktok +1 hour add-on** | **₱499** | per booth · per hour | Multi-purchase, unlimited. For events running longer than 5 hours. Pricing parity with Live Stream's hour-extension model. |
| **Patiktok custom background design** | **₱1,499** | per event | Optional upgrade. Setnayan designs a fully-custom Patiktok backdrop digital file based on couple's request — custom artwork, multiple revisions, full art direction. Soft-copy delivered; couple uses marketplace (future 0018) to source printing. |

**Background soft copy (bundled in ₱2,499):** Setnayan auto-generates a digital background design pulling from couple's mood board palette + monogram. Couple receives the soft copy (PDF, PNG, AI source). Use it for print or LED display.

**Not included by Setnayan** (couple / coordinator sources via Setnayan Marketplace — future 0018): backdrops, lighting kits, ring lights, HDMI dongles, monitors, tripods, print fulfillment.

## Coordinator workflow

Most weddings hire a coordinator (paid wedding planner) to handle execution. Patiktok fits this flow:

1. **Couple buys Patiktok** (₱2,499) via apply-then-pay flow.
2. **Coordinator accepts** the Patiktok purchase as part of the couple's wedding planning workflow they're managing.
3. **Coordinator hires a booth operator** — friend, family, or paid event staff. Operator doesn't need a Setnayan account.
4. **Coordinator scans the Patiktok QR** to test the dashboard, picks the primary + backup TikTok templates with the couple, generates the print-ready QR + signage card PDF.
5. **Coordinator uses Supplies Marketplace** (future 0018) to source:
   - Print fulfillment for the background soft copy
   - HDMI dongle + monitor rental
   - Backdrops, props, lighting
   - Other physical accessories
6. **Day of event:** booth operator scans the printed QR with their phone, runs the booth, guests cycle through.
7. **Post-event:** Setnayan auto-compiles, posts to @SetnayanWeddings, tags guests. Coordinator delivers the link to couple.

The coordinator is the "general contractor" for the wedding; Setnayan is one of the software systems they orchestrate. Patiktok is designed to slot into a coordinator's workflow without requiring them to learn deep Setnayan internals.

### Setnayan cost basis (per Station Pack)

| Cost line | Estimated PHP |
|---|---|
| X-mark vinyl decal (print + materials) | ₱50 |
| Shipping (PH Lalamove / standard) | ₱50 |
| Compilation FFmpeg render (~5-minute output) | ₱50 |
| Music: owned AI catalogue | ₱0 |
| App infrastructure | ₱0 |
| **Total Setnayan cost per Station Pack** | **~₱150** |
| **Margin** | **~₱1,349 (90%)** |

Additional stations cost ~₱120 each (more decal + separate compilation render).

## User flows

### Couple flow

1. Couple buys **Patiktok Station Pack** (₱1,499) via apply-then-pay flow.
2. Setnayan confirms payment, ships X-mark decal within 3-5 days.
3. Couple picks reel template from library (or assigns Setnayan Team to curate one based on couple's mood board palette).
4. On wedding day, couple places X-mark in venue (entrance, photobooth area, or dance floor).
5. Station goes live when first guest scans their personalized QR.
6. Setnayan auto-compiles after event ends (within 24 hrs).
7. Couple downloads final compilation from dashboard within 30 days at full quality.

### Guest flow

1. Guest sees the X-mark + signage card at venue.
2. Guest scans personalized QR (from RSVP / place card).
3. App opens to Patiktok station. AR overlay shows the reel to mimic with beat indicators.
4. Guest taps "Record" → app captures 3 seconds.
5. Guest sees their clip + can retake (max 3 retakes per guest).
6. Guest taps "Submit" → clip joins the compilation queue.
7. Optionally: guest enters their name (linked to RSVP profile if they're tagged).

## Technical requirements

### Storage

- Each 3-sec clip at 1080p: ~10 MB
- Each 3-sec clip at 4K (if 4K Upgrade purchased): ~30 MB
- 200-guest wedding: ~2 GB at 1080p, ~6 GB at 4K
- Fits within the 1-day 17 GB event pack with room to spare

### Compilation render

- FFmpeg compute job. Renders the final 9:16 vertical compilation.
- ~5-minute output for ~100 submissions (3-sec × 100 = 5 min)
- Music looped across the whole duration (continuous, no breaks)
- Transitions auto-selected per cut (dissolve, swipe, mask wipe) based on beat detection

### Music selection

- Setnayan's owned-AI music catalogue (~400 tracks across 6 categories)
- Couple picks category at purchase (Bridgerton / Pop / Hip-hop / Jazz / Acoustic)
- Music continues looping seamlessly through the compilation — no per-clip music restart

### Hardware at venue

- **Option A**: Setnayan ships a station tablet (rental ₱X — future SKU)
- **Option B**: Couple uses iPad or smartphone with Setnayan app in kiosk mode (default V1)
- Recommended phone/tablet: portrait orientation, ≥10" screen for kiosk experience

## Anti-abuse rules

| Rule | Why |
|---|---|
| Station active window = event days (per event-day pack purchased) | Same as Papic — protects against year-out events using free station |
| Max 500 submissions per station per event | Caps storage + render cost. Multi-station packs lift this limit. |
| Each guest QR can submit max 3 times | Prevents one guest spamming. Encourages retakes within session. |
| Submission must be ≥2.5 sec captured (no instant tap-and-submit) | Real-time guard against empty/spam submissions |

## Integrations across iterations

- **0000 App Shell**: station mode = special UI state inside Setnayan app
- **0002 QR Invitations**: guest's personalized QR is the auth token for submission
- **0012 Papic**: Patiktok submissions count toward the event's storage pack
- **0014/V1.5 Wedding Challenges**: Patiktok is a special type of challenge (auto-capture, auto-compile)
- **Music catalogue (Cowork workstream)**: Patiktok consumes from the same ~400-track library

## Future considerations (V2+)

- **AR face masks / filters** — TikTok-style filters guests can apply during the 3-sec capture
- **Real-time projection** — submitted clips appear on the venue projector as they're submitted (live-Patiktok)
- **Cross-event Patiktok** — couple's compilation can be embedded into other Setnayan surfaces (invitation site, marketing site if opt-in)
- **Patiktok challenges** — couple sets a custom prompt ("show your wedding day mood") instead of just a reel mimic
- **Patiktok rentals** — Setnayan provides a branded kiosk tablet pre-loaded (logistics-heavy, defer)

## Open questions for sign-off

- Where does the X-mark go physically? Standard 50×50 cm vs larger 100×100 cm option for premium stations?
- Compilation duration cap: should max 5-min compilation be a hard limit? 200 submissions × 3 sec = 10 min — couple gets a 10-min reel.
- 4K Upgrade interaction: if 4K is purchased, does Patiktok render at 4K vertical (1080×2160) or stay at 1080p (vertical 1080×1920)?
- Can guests retake AFTER submission (within event window)?
- Should there be a "Patiktok Watch Party" surface in the couple's dashboard for live view as guests submit?

## Companion docs

- `0017_patiktok.html` — design mockup (couple + guest views)
- `0017_patiktok.docx` — same content as this .md, in stakeholder-readable format
- `14_Music_Catalogue_Cowork_Playbook.md` — music selection source

---

*Drafted 2026-05-11. Pricing model: apply-then-pay. Status flag in account: `pending_application` → `pending_payment` → `active`. Activation SLA: 24 hours from confirmed payment + 3-5 days for X-mark decal shipping.*
