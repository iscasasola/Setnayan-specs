# Wedding Website — Lifecycle Spec (canonical working doc)

> **Created 2026-06-07** with the owner, in-session. This is the single source of truth for the couple's
> event website model: **one site, one URL, three time-driven phases.** It spans iterations **0002**
> (invitation site), **0021** (couple dashboard editor), and **0031** (day-of guest). Fold into those
> iteration `.md` files + a `DECISION_LOG.md` row once the model is fully signed off (Event phase finalized
> + Save-the-Date pricing resolved — see Open items).

## 1. The model

The wedding website is **one published site** at `setnayan.com/{slug}` that **auto-switches through three phases** based on the event date. The page already computes `getDayOfPhase(event_date)` ([apps/web/app/[slug]/page.tsx]) and 0031 specs the full `coming-soon → pre-event → live → recap → archive` lifecycle, so the phase plumbing exists.

| Phase | When | Editor tab | Purpose |
|---|---|---|---|
| **RSVP** | before the event | RSVP | invitation + responses + info |
| **Event** | during the event | Event | live day-of experience |
| **Editorial** | right after the event | Editorial | recap · reviews · sharing |

**Widgets are a matrix, not buckets.** Each element declares a presence **per phase** with its **own order per phase** (build implication: per-surface `is_visible` + `display_order`, not one global flag). Most elements live on RSVP; some persist or transform into Event / Editorial.

The editor has a 4th tab, **Settings** (config, not page content): URL/slug · master QR · theme/palette · Google Drive · header/footer chrome.

## 2. Element × phase matrix

Legend — **Free** · **SKU** (lights up when the add-on is owned) · **Pro** (Pro Website ₱5,499).
✓ = appears in that phase. All prices PHP, from the corpus SKU catalog.

| Element | RSVP · before | Event · during | Editorial · after | Tier |
|---|:--:|:--:|:--:|---|
| Site Header / Footer | ✓ | ✓ | ✓ | Free (chrome) |
| Hero Monogram | ✓ | ✓ | ✓ | Free · upgrade Animated Monogram ₱2,499 |
| Our Song | ✓ | ✓ | ✓ | SKU · Pakanta |
| Greeting | ✓ | · | · | Free |
| Countdown | ✓ | · | · | Free |
| Special Message | ✓ | · | ✓ | Free |
| Our Love Story | ✓ | · | ✓ | Free |
| Event Details | ✓ | ✓ | · | Free |
| Venue | ✓ | ✓ | · | Free |
| Wedding Schedule | ✓ | ✓ *(live, pinned)* | · | Free |
| What to Wear | ✓ | · | · | Free |
| What to Bring | ✓ | · | · | Free |
| Guest QR Card | ✓ | ✓ | · | Free |
| RSVP form | ✓ | · | · | Free |
| Our Photos | ✓ | · | ✓ | Free · upgrade High Res Archive ₱2,999/yr |
| Save-the-Date Video | ✓ | · | · | **OPEN** (free upload / ₱49 render / both) |
| Happening Now | · | ✓ | · | Free *(0031)* |
| Find My Table | · | ✓ | · | Free *(0031, shipped: /find-my-table)* |
| Live Photo Wall | · | ✓ | · | SKU · Live Venue Photo Wall / Papic |
| Video Guestbook | · | ✓ | · | Free *(0031; Pabati tie possible)* |
| Coordinator Broadcast | · | ✓ | · | Free *(0031)* |
| Watch Live | · | ✓ | ✓ *(replay)* | SKU · Panood ₱3,499/day |
| Savour the Moment + Gallery | · | ✓ | ✓ | SKU · Papic |
| Service Showcase | · | · | ✓ | **Pro/Enterprise vendors only** |
| Event Feedback Wall | · | · | ✓ | Free *(vendor voices Pro/Ent only)* |
| Thank-You | · | · | ✓ | Free · upgrade Thank You Video ₱5,499 |
| Highlight Reel | · | · | ✓ | SKU · SDE ₱3,499 |
| Full Gallery delivery | · | · | ✓ | Free *(High Res Archive upgrade)* |

**System (all phases):** Visibility gate (public/unlisted/private) · Phase auto-switch · **Login to Save** · Day-of live mode (= the Event phase).

## 3. Review system (event-bound)

Extends the locked `Vendor_Value_Proposition_and_Reviews_2026-06-05` decision.

- **Three reviewers, all bound to the event:** the **couple**, each **verified guest** (≤250, 1 per verified guest — *already locked*), and **vendors** (testimonial about the event).
- **Vendor visibility gate:** a vendor's photos, profile link, tags, and feedback render on the Editorial **only while the vendor is currently Pro/Enterprise**. Eligibility to be featured requires Pro/Enterprise **at event creation**.
- **Free vendors:** hidden from the Editorial entirely.
- **Vendor lapse:** their tags/photos/link/feedback are removed from the **public** Editorial. **Photos are NOT deleted** (untagged-still-delivered guarantee) — only the vendor's credit/feature is stripped. The **couple always keeps their private vendor list** (0006/0007 vendor management + budget ledger), untouched by subscription state.
- **Review-to-unlock = SOFT, skippable prompt.** Strongly prompt for a review before download (tagged photos/videos) or render-a-story, but **never block** the couple's or a guest's own media. Avoids dark-pattern / RA 10173 risk and keeps reviews honest.
- **Favorite-from-review (flywheel):** a **logged-in** reviewer may opt to **favorite a vendor** while reviewing → that favorite seeds the **shortlist** (`event_vendors`) of the reviewer's **future event**, scored by the 6-dim leaf-match. Shortlist stays invisible to the vendor until inquiry (locked rule). Only Pro/Enterprise vendors appear on the Editorial, so the discovery flywheel itself is a Pro upsell. This is **Login-to-Save's 3rd reason to exist** (keep photos past 3 days · leave reviews · bank vendors).

## 4. Post-event onboarding flow

`event ends` → site enters **Editorial** phase → actor opens their link →
**soft review prompt** (couple→vendors, guest→event, vendor→event) **+ optional favorite** →
unlock **download tagged photos/videos** + **render-a-story** (skippable at any step).

## 5. Build implications

1. **Per-surface widget state.** `invitation_widgets` needs `(phase, display_order, is_visible)` — one row per (event, widget, phase), or a phase-keyed JSON. Today it's single-phase.
2. **Editor tab rename.** Shipped `/site-editor` puts content under a tab labeled **"Event"** and uses **"RSVP"** for response mgmt only. The new model flips this: the content builder lives across **RSVP / Event / Editorial** phase tabs. Requires relabel + the matrix-driven section lists.
3. **Phase auto-switch** reuses `getDayOfPhase()`; map `pre-event→RSVP`, `live→Event`, `recap/archive→Editorial`.
4. **Reviews** schema: cross-actor, event-bound, with moderation (0023 #4). Vendor visibility computed against *current* subscription tier.

## 6. Handoff from onboarding session (2026-06-07) — surfaces + presentation features

> Owner clarification handed over from the wedding-onboarding design session. All file paths verified to exist.

### 6.1 Three surfaces ↔ code paths
| Surface | Editor code path | Notes |
|---|---|---|
| **RSVP / Invitation** | `app/dashboard/[eventId]/invitation/` + finalize-rsvp / deploy-invitation wizard cards | "current editing scope" |
| **Event / Website** | `app/dashboard/[eventId]/website/` (hero-photo, dress-code, photo-moments, schedule, widgets) + `app/site-editor/[eventId]/` | the content builder |
| **Editorial Page** | `create-editorial-card.tsx` / `create-editorial-choice-buttons.tsx` wizard | separate story page; the **FREE carrot** at onboarding settlement |

✅ **RESOLVED 2026-06-07 (owner).** RSVP/Event/Editorial = **time-phases of ONE site**, auto-switched by today's-date vs wedding-date (RSVP = before · Event = the wedding day · Editorial = after). The code paths above are the **per-phase editors** that compose that single public site — *not* separate public pages. Content sections live wherever the phase needs them (the §2 matrix governs).

### 6.2 Presentation features (need a home on the right surface)
1. **Hero monogram — two free→paid ladders.**
   - *Monogram:* free static (`event-monogram.tsx`, `monogram-maker.tsx`) → **Animated / Custom Monogram ₱2,499** (leaf `animated_monogram` / `setnayan_custom_monogram`, iter **0037**, `add-ons/animated-monogram`). Bespoke brief is **post-purchase**. Refinement facet = `design_styles`.
   - *Music:* free upload → **Pakanta** (see #3).
2. **Scrub-video hero** — `welcome-parallax.tsx` (onboarding) + `animated-monogram-hero.tsx` (site hero): monogram draws itself over the couple's video/photo background.
3. **Looping background music (NET-NEW).** Gapless, continuous site soundtrack while viewing. New field **`events.site_bg_music_source` (upload | pakanta)** + R2 key. **Distinct** from `music_playlist_seed` / `event_song_picks` (vendor matching) and render-catalogue music — verified not present in code. Gives **Pakanta a 2nd surface** (page soundtrack). Constraints: **gapless loop via Web Audio** (not `<audio loop>`); autoplay blocked → **tap-to-start/unmute**; **always a visible mute toggle** (a11y); stream from R2, **lazy-load** (don't block LCP). *(Supersedes the "Our Song" audio-card framing in §2 — this is ambient chrome, not a content block.)*

Onboarding only collects **intent** (basic monogram keys + Pakanta/music intent) and the reveal shows the couple's page (assumed RSVP). Page-level config = this spec. Onboarding doc: `Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md`.

### 6.3 Editorial page — format & Setnayan Impact (owner, 2026-06-07)
The Editorial (post-wedding) must **feel like an editorial**. Mockup: `Editorial_Page_Mockup_2026-06-07.html`.
- **Format** — **newspaper front page on desktop** (masthead nameplate, edition line, lead headline + italic deck + byline, multi-column article with drop cap + pull quote, boxed sidebar, section rules) → **responsive single-column mobile editorial**.
- **NEW element · Setnayan Impact ("By the Numbers")** — quantifies Setnayan's hand in the wedding: *services planned with Setnayan / total* (e.g. 12/28), *vendors that were Setnayan's **#1 match*** (first-pick hit rate, e.g. 8/12 — from the 6-dim leaf-match), *planning time saved* (e.g. ≈42 hrs — **heuristic, needs a defensible formula**), plus supporting counts (guests · photos delivered · % replied). Sourced from the behavioral-data edge + match scoring. **Free.**
- **Guest gallery (customized)** — guests scan their **personal QR** (or open their invite link) to download **their tagged** photos/videos + render-a-story; gated by the soft, skippable review prompt.
- **Cross-phase links** — Editorial links to **The Invitation (RSVP)** and **The Wedding Day (Event)** (the archived earlier phases of the same site) + **Watch the Film** (SDE). Confirms the 3 phases stay linkable from the recap.

### 6.4 Auto-Editorial — input inventory (owner, 2026-06-07)
The editorial write-up is **auto-generated (free)** — an LLM composes the newspaper narrative from structured facts + the couple's own words + reviews. Inventory of required inputs. Legend: ✅ already collected · 🆕 needs new collection · 🧮 derived/computed.

| # | Input | Feeds | Source |
|---|---|---|---|
| **Identity & facts** ||||
| | Couple names + first names | masthead · headline · byline | ✅ `events.display_name` |
| | Wedding date | edition line · headline tense ("Are Married") | ✅ `events.event_date` |
| | City / venue(s) | dateline · deck · article | ✅ `events.venue_*` |
| | Monogram + hashtag | nameplate mark · colophon | ✅ `events.monogram_*` |
| | Together-since / engagement length | "after seven years" | 🆕 one onboarding field |
| **Their story** ||||
| | How-we-met · proposal · milestones (year+moment) | lead article · timeline | 🆕 Our Love Story input |
| | Couple's own note/words | pull quote · "from the couple" | 🆕 Special Message |
| | Tone/voice (warm/playful/formal) · language EN/TL/CEB | generation style | 🆕 optional pick |
| **The day** ||||
| | Run-of-show / schedule | "ran on time" · article color | ✅ schedule blocks |
| | Coordinator broadcasts / notable moments | article color | ✅ 0031 day-of (if captured) |
| **People** ||||
| | Guest count (RSVP'd/attended) · RSVP % | By the Numbers | ✅ `guests` → 🧮 |
| | Roles (principal sponsors / entourage) | wedding-party mentions | ✅ `guests.role` |
| **Vendors & services** ||||
| | Vendors hired + categories | The Team | ✅ `event_vendors` |
| | Vendor tier · photos · profile link | showcase gate (Pro/Ent) | ✅ `vendor_profiles` |
| | Services planned w/ Setnayan / total | impact stat 12/28 | 🧮 `event_vendors` vs 28 cats |
| | **Match rank at selection** (#1 match?) | impact stat 8/12 first-pick | 🆕 **persist leaf-match rank at `finalizeVendor`** |
| | Add-ons owned (Papic/Panood/Pakanta…) | which elements + article | ✅ `orders` |
| **Reviews** ||||
| | Guest (≤250) · vendor (Pro/Ent) · couple reviews + stars | What They Said · pull quotes | 🆕 review system (§3) |
| | Extracted highlights/sentiment | article color · quotes | 🧮 LLM from reviews |
| **Media** ||||
| | Photos-delivered count | By the Numbers | ✅ `photos` → 🧮 |
| | Hero pick · essay selection | hero · photo essay | 🆕/🧮 auto-best or couple-pick |
| | Photo metadata (captured_at, tags) | captions | ✅ `photos`/`photo_tags` |
| | Highlight reel / SDE | "Watch the Film" | ✅ if owned |
| **Impact (derived)** ||||
| | time_saved | By the Numbers ≈42 hrs | 🧮 **needs defensible formula** |
| **Governance** ||||
| | Couple edit/approve pass (auto-draft → tweak) · regenerate · visibility/consent (RA 10173 for guest names+reviews) | the whole page | 🆕 |

**Build prerequisites for a good auto-editorial:** (1) collect the **storylines** (onboarding Our Love Story + Special Message); (2) **persist match-rank at vendor selection** (for first-pick hit rate); (3) stand up the **review system** (§3); (4) define the **time-saved formula**.

### 6.5 Editorial — collection, virtual interview & timing (owner, 2026-06-07)
**Inputs arrive in 3 layers:**
- **Onboarding (pre-wedding)** — storyline base + chrome (also feeds RSVP-phase Our Love Story + Special Message): `love_story` (how-we-met · proposal · milestones), `together_since`, `editorial_tone` + language, optional `special_message`, monogram, `site_bg_music_source`, hero video.
- **Post-event virtual interview (T+0 → T+48h)** — the reflective/day-of layer: favorite moments, a closing note (or edit the message), **hero + essay photo picks**, shout-outs, optional storyline edits. **Delegatable** — the couple or main event creator can **assign one person** (maid of honor, coordinator, family) to answer on their behalf (newlyweds are often offline/honeymooning).
- **Auto-gathered (no one fills)** — reviews (guest/vendor/couple), photos + counts, guest/RSVP counts, day-of moments, vendor credits, computed impact metrics (M1–M3).

**Timing — NEW RULE: the Editorial launches 3 days after the wedding.**
- **T+0** (wedding) = Event phase (live).
- **T+0 → T+48h** = *recap-pending*: interview open to couple/creator/delegate; guests can already claim photos; public sees a "full story coming in a few days" state.
- **T+48h** = interview closes → rich-vs-lean decided.
- **T+3 days = Editorial LAUNCHES** publicly (~24h between interview close and launch to generate).

**Rich vs lean fallback:** interview done by 48h → **rich** editorial (onboarding storyline + interview + auto data). Not done → **lean** editorial from onboarding storyline + auto-gathered data only — still a full newspaper, just without the interview-derived color. Couples can **answer late + regenerate** to upgrade lean→rich after launch.

**Schema delta (follow-up migration · extends the shipped `event_editorial`):** `interview_status (pending/completed/lapsed)` · `interview_deadline_at (=event+48h)` · `interview_delegate_user_id` · `launch_at (=event+3d)` · `mode (rich/lean)` · `interview_answers JSONB`. Phase computation gains a **T+3 editorial-public threshold** (T+0→T+3 = recap-pending sub-state).

### 6.6 Storyline → Pakanta (custom song) reuse (owner, 2026-06-07)
The pre-wedding storyline (§6.5 onboarding) is **told once, used three ways**: the RSVP "Our Love Story" section · the editorial spine · **the lyric source for Pakanta** (custom AI song, iter 0036). At the end of the storyline step, a soft **upsell** ("hear your story as a song?", always skippable). If taken, the **narrative is pre-filled** — the couple only picks the **song-specific extras**: feel/genre (the 6 music-catalogue feels), voice (her/him/duet), must-includes (names/nicknames/inside jokes), tier (Basic ₱1,999 / Premium ₱3,999 / Wedding Suite ₱9,999). The resulting Pakanta song then also becomes the page's **looping background music** (`site_bg_music_source='pakanta'`, §6.2). Free storyline pre-fills the paid song — the story is never re-asked. Prototype: `Editorial_Storyline_Prototype_2026-06-07.html` (screens 7–8).

### 6.7 Two interviews — setup vs post-event (owner clarification, 2026-06-07)
The storyline collection is **NOT editorial-scoped — it's a SETUP-time interview**, a first-class onboarding step. Done at setup, it immediately feeds **three** consumers: RSVP "Our Love Story" (live pre-wedding) · Pakanta lyrics · editorial spine. So there are two distinct interviews, same underlying fields surfaced twice:
- **Setup interview (storyline)** — at onboarding/event setup: how-we-met · proposal · milestones · note · tone (+ the Pakanta upsell). **Skippable + resumable** (commit-then-patch — the event saves first, the story patches in); editable anytime in the site-editor. Belongs as a **(recommended, skippable) stage in the adaptive onboarding** → fold into `Onboarding_Wedding_Adaptive_Redesign_2026-06-07.md`. Writes `events.love_story`/`special_message`/`editorial_tone`. Prototype: `Editorial_Storyline_Prototype_2026-06-07.html`.
- **Post-event interview** — after the day (T+0→T+48h): the reflective/day-of layer (favorite moment, cover photo). **Pre-filled** from the setup interview; writes the post-event `interview_answers`. Prototype: `Editorial_Interview_Prototype_2026-06-07.html`.

### 6.8 Editorial identity from final count + spend (owner, 2026-06-07)
**Final count is the truth.** Once the guest list is **finalized**, the actual count (NOT the onboarding estimate) becomes (a) the **basis for pax-priced services** and (b) a **framing input for the editorial**.
- **Pricing floor (vendor protection):** if the final count is *below* the estimate, prices **stay at the minimum** quoted — never below the 100-pax floor (+ per-50 above). Downsizing can't drop a vendor under their minimum. *(Cross-cuts pax-pricing + 0007 budget + 0001 guest-list finalization → DECISION_LOG fold pending.)*

**Two axes → an event "identity"** (an *angle* for the generator, never canned text). Bands **admin-tunable · owner sets thresholds**:
- **Scale** = final guest count → *Intimate ↔ Grand* (the 100-pax floor anchors "intimate").
- **Spend** = final budget, primarily **per-guest** spend (catches intimate-but-lavish), total secondary → *Modest ↔ Luxurious*.

| | Modest spend | Luxurious spend |
|---|---|---|
| **Intimate** | *Hand-picked* — the people who matter most; warmth over scale | *Jewel-box* — small + exquisite; every detail for a precious few |
| **Grand** | *Big-hearted* — everyone they love, a joyful crowd | *Sweeping* — a grand, lavish celebration |

**Principles:**
- **Archetype = angle, not a template sentence** — the LLM still writes uniquely from the real story/stats/reviews (preserves §8). The archetype only sets the framing + voice.
- **Always flattering** — modest/small is framed as *intentional · hand-picked · what mattered*, never "cheap/small"; luxurious is expressed expressively. No wedding is judged.
- **Voice overlay** — the storyline `editorial_tone` (warm/playful/formal) modulates wording on top of the archetype.
- **Generation input** = archetype (angle) + tone + final count/spend + real story/stats/reviews → one expressive, unique editorial.

### 6.9 Website packaging — Basic / Pro (owner, 2026-06-07) ⚠ SUPERSEDES "free website"
The website is **clustered into two paid tiers** (simpler than the earlier per-element à-la-carte model):
- **Basic RSVP — ₱2,500** *(worth ~₱15k outside the market)*
- **Upgrade to Pro — +₱2,000** → ₱4,500 total *(worth ~₱35k outside)*

⚠ **Supersessions to confirm:**
1. **Supersedes the "Free website / Setnayan-AI-included" framing** (§2, §6.1). The *published wedding website is a paid product.* Reconcile with the homepage **"Start planning · free"** — cleanest read: **planning/dashboard stays free; the published website is paid** (Basic ₱2,500 / Pro ₱4,500). Confirm.
2. **Pro ₱4,500 supersedes the ₱5,499 "Pro Website" SKU.**
3. The per-element **Free/SKU/Pro chips** in §2's matrix collapse into **Basic vs Pro** (services stay separate add-ons).

**Basic/Pro split — owner-confirmed 2026-06-07:**
- **Basic = "RSVP Website" (₱2,500)** — the full invitation/response site (static-monogram hero, greeting, countdown, details, venue, schedule, dress code, what-to-bring, our photos, our love story, special message, save-the-date upload, QR card, RSVP, login-to-save).
- **Pro = +₱2,000 (₱4,500)** — **includes ALL advanced website features**: the **"Event Website"** (during / live day-of) + the **"Editorial Website"** (after / recap) + premium chrome (animated/custom monogram, scrub-video hero, looping bg music, the editorial engine). *"Pro already includes all the advanced features of the website."*
- **Service add-ons** (Papic · Panood · Pakanta · etc.) remain **separate purchases** that light up their own elements on whichever tier.

### 6.10 Platform pricing — FINAL (owner 2026-06-07 · "use this")
"Premium stance." Supersedes §6.9 (Basic/Pro) and every earlier figure this session. Internally consistent — the 18 à-la-carte SKUs sum to **₱47,982**; Essentials' components sum to **₱22,492** (both verified).

**Bundle ladder**
| Tier | Price | What you get · SRP → savings |
|---|---|---|
| **Free — Explore** | ₱0 | Browse + personalized reveal + planning tools — **no published website** |
| **Setnayan AI** | ₱3,999 | Full match/sort/cross-ref + planning workspace (value-anchored · ~89% below a ₱30k planner) |
| **Essentials** | ₱12,999 | AI + Monogram + QR + Pro RSVP + Papic Guests + Guest Stories + **Event & Editorial Website** · SRP ₱22,492 → save ~₱9,500 (~42%) |
| **Complete** | ₱27,999 | **All 18 paid services** · SRP ₱47,982 → save ~₱20,000 (~42%) |

**À la carte — all 18 (SRP ₱47,982)**
- *Planning/AI:* Setnayan AI **₱3,999**
- *Brand & Invites:* Animated Monogram **₱1,999** · Custom QR **₱999** · Pro RSVP **₱1,999** · Event Website **₱1,999** · Editorial Website **₱7,999**
- *Capture (Papic):* Papic Guests **₱1,999** · Papic 5 Seats **₱2,999** · Camera Bridge **₱1,499**
- *Video & Media:* Guest Stories **₱1,499** · Pabati **₱999** · Patiktok **₱1,499** · Thank You **₱3,499** · Same Day Edit **₱4,999** · PhotoWall **₱2,499** · Live Background **₱2,499** · Panood **₱2,499/day**
- *Audio:* Pakanta **₱2,499**
- Margins ~95–99% (cost ≈ R2 storage ≤₱1,000/event). *(Owner also has a "Removed / no longer offered" list — not captured here; confirm what was cut.)*

**Website ↔ phases (FINAL):** no free published website — the site is **paid, one SKU per phase**:
- **RSVP (before)** = **Pro RSVP ₱1,999**
- **Event (during · live day-of)** = **Event Website ₱1,999**
- **Editorial (after · recap)** = **Editorial Website ₱7,999**
- All three bundled in Essentials/Complete. *(Editor banner → Pro RSVP ₱1,999 · Event Website ₱1,999 · Editorial ₱7,999.)* Minor confirm: "Pro RSVP" naming implies a non-pro RSVP — is the before-phase site simply Pro RSVP ₱1,999 (no free/basic version)?

⚠ **Platform-wide propagation (canonical now)** — fold this into **`Pricing.md` / SKU catalog / `DECISION_LOG`** and reconcile every delta. Corpus currently differs: Pro Website ₱5,499 (retire → Event ₱1,999 + Editorial ₱7,999), Animated Monogram ₱2,499→₱1,999, Panood ₱3,499/day→₱2,499/day, Editorial ₱4,999→₱7,999, Pakanta 3-tier→₱2,499, etc. Owner sign-off per item.

## 7. Decisions & open items

### Decided 2026-06-07 (owner)
- ✅ **Surface model** — **one site, three time-phases** auto-switched by date (RSVP before · Event during · Editorial after).
- ✅ **Shared chrome** — hero monogram + scrub-video + looping background music **persist across all three phases**.
- ✅ **Editorial nature** — **hybrid**: free couple-authored story page + paid Setnayan-produced "magazine feature" upgrade (Pro Website).
- ✅ **Hero/music config** — **couple picks during setup** (onboarding collects the actual hero-video + music-source choices, not just intent).

### Still open
- **Save-the-Date pricing** — free upload / ₱49 render / both *(recommend: both — free upload + ₱49 template upsell, mirroring the hero ladder)*.
- **Video Guestbook** tier *(recommend: basic free; video messages = Pabati SKU ₱999 · 300×5s)* · **Live Photo Wall** = SKU (Live Venue Photo Wall ₱2,499 / Papic).
- Fold into 0002 / 0021 / 0031 `.md` + `.docx` mirror via the COWORK sequence (DECISION_LOG row added 2026-06-07).

## 8. Auto-editorial — generation principles (owner: "inspirational + unique per wedding")
- **Unique by construction.** Each draft is LLM-composed from *that wedding's* §6.4 inputs — uniqueness comes from real, per-wedding material, not a template.
- **Angle detection.** Lead with the wedding's most distinctive fact (longest engagement · biggest guest list · most #1-matches · a standout day-of moment · the Papic candids), so two weddings never open the same way.
- **Use their own voice.** Weave the couple's actual storyline + note + real review quotes; never stock phrasing. Require ≥3 wedding-specific concrete details per draft.
- **Tone + language per couple** (warm / playful / formal · EN/TL/CEB).
- **Truth-grounded.** Compose ONLY from provided facts — no invented details, names, or numbers. **Impact numbers are pre-computed and passed in — the model never does the math.**
- **Inspirational voice.** Celebratory editorial that centers the love story + the people; frames the impact as *"what made the calm possible,"* not bragging.
- **Couple edit/approve + regenerate** (free).

## 9. Impact metrics — definitions
Honesty rules for all: count only **confirmed/real** actions; round + show "≈"; **hide a metric if data is insufficient** (never render 0/0).

| Metric | Formula | Source | Edge cases |
|---|---|---|---|
| **M1 · Services with Setnayan** | `services picked through Setnayan` ÷ `total services comprising the wedding` | picked service line-items (`event_vendors` + chosen service · `is_setnayan_service`) | **Unit = a granular service** (a leaf-level vendor offering; a vendor offers 1–1000; the 28-taxonomy is just the container — NOT the denominator). Denominator = every service line-item in the couple's plan (all channels). Count booked/managed, not browsed. *(Supersedes the "12/28" category framing — that was wrong; mockup number is illustrative only.)* |
| **M2 · First-pick hit rate** (8/12) | `booked marketplace vendors where selection_match_rank = 1` ÷ `booked marketplace vendors with a ranking` | `event_vendors.selection_match_rank` (NEW) | exclude off-platform/manual (no ranking) **and single-candidate categories** from the denominator |
| **M3 · Time saved** (≈42 hrs) | `Σ(coefficient × count)`, conservative, rounded to nearest 5, shown "≈" | derived | coefficients **admin-tunable + owner-ratified**; never false precision |
| Guests | `count(rsvp='yes' / attended)` | `guests` | — |
| Photos delivered | `count(photos delivered)` | `photos` | — |
| RSVP % | `responded ÷ invited × 100` | `guests` | — |

**M3 coefficient model (illustrative — owner ratifies the values):** vendor discovered+matched in-app **2.0 hr** · vendor coordinated via threads **1.0 hr** · RSVP automation **0.04 hr/guest** · QR invitations vs manual **3 hr** · each maker/template used (monogram · save-the-date · website · seating · schedule) **2 hr** · auto-editorial **1 hr**. *(Stored in `editorial_time_coefficients` or code constants.)*

## 10. Foundation — schema/data model (the build foundation)
> **FOUNDATION SHIPPED 2026-06-07 · PR #1060** — items **2 · 4 · 5** below (migration `20260910000000_wedding_website_lifecycle_foundation.sql`, safe/additive, **not yet prod-applied** — no consumer; apply via `supabase db push` when the first consuming code lands).
> **Deferred:** item **1** (per-phase widgets — RENDERER-COUPLED; ships atomically with a phase-aware `[slug]` renderer) · items **3/6** (event review/feedback table — **reconcile vs the existing `vendor_reviews`**; owner decision pending — see §7).

1. **`invitation_widgets` → per-phase.** Add `phase TEXT CHECK (phase IN ('rsvp','event','editorial'))`; UNIQUE becomes `(event_id, widget_type, phase)`; `display_order` + `is_visible` are now per-phase. Expand `widget_type` with the new blocks (special_message, our_love_story, what_to_bring, our_photos, save_the_date, happening_now, find_my_table, live_photo_wall, video_guestbook, coordinator_broadcast, watch_live, service_showcase, feedback_wall, thank_you, highlight_reel, setnayan_impact, full_gallery). Seed-trigger writes the §2 matrix defaults per phase. Phase itself is **derived from `event_date`** via `getDayOfPhase()` (no stored phase state).
2. **`events` — new columns:** shared chrome → `site_bg_music_source` CHECK(upload/pakanta) · `site_bg_music_r2_key` · `site_bg_music_enabled` · `landing_page_hero_video_r2_key` (scrub-video). Storylines/config → `love_story` JSONB `{how_we_met, proposal, milestones:[{year,title,note}]}` · `special_message` TEXT · `together_since` DATE · `editorial_tone` · `editorial_language`.
3. **`event_reviews` (NEW · event-bound · cross-actor):** `review_id · event_id · author_type(couple/guest/vendor) · author_ref · rating(1-5) · body · created_at · moderation_status(pending/approved/rejected) · is_public · favorited_vendor_id(nullable)`. RLS + 0023 moderation. 1 per verified guest (≤250). Vendor visibility computed vs **current** tier.
4. **`event_vendors.selection_match_rank` INT NULL** — set at `finalizeVendor` from the compat-score (1 = was the #1 match; NULL = off-platform/no ranking). Powers M2. *(Retroactive only going forward.)*
5. **`event_editorial` (NEW · snapshot):** `editorial_id · event_id · status(draft/published) · generated_at · draft_json (composed sections) · impact_metrics JSONB (M1–M3 + supporting, snapshot) · hero_photo_id · essay_photo_ids[] · edited_by_couple · published_at`. Snapshot **freezes the numbers at publish** so they don't drift.
6. **Favorite-from-review** reuses `event_vendors`/shortlist — `event_reviews.favorited_vendor_id` seeds the reviewer's future-event shortlist.
