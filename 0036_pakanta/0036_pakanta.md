# Iteration 0036 — Pakanta · Your Wedding's Own Song

**Iteration number:** 0036
**Topic:** Custom songwriter service (3-tier · Suno Premier + lyric approval gate · manual workflow V1)
**Status:** Drafted 2026-05-14 · 3-tier revision locked · **V1 promotion 2026-05-18 (confirmed in V1 scope alongside the broader V1.5+ → V1 promotion; see CLAUDE.md decision log)**
**Display name in app:** *Pakanta · Your Wedding's Own Song*
**Canonical ID prefix:** S89K- (K for Kanta)

---

## 1. Why this iteration exists

Custom wedding songs in PH normally cost ₱5,000–₱25,000 for a single song (4–8 weeks delivery via musician commission) or ₱25,000–₱75,000 for a 3-song suite (8–16 weeks). Setnayan delivers the same outcome at 60–80% lower cost with same-week turnaround via Suno Premier + owner's music-director curation.

The strategic payoff isn't just margin — it's the **library-save mechanic**. Once a couple's Pakanta song(s) is in their event's song library, it becomes the backing track for every Setnayan-rendered video at their wedding (Save-the-Date · every guest's Personal Reel · AI Highlight · SDE · LED Background loop). The couple's wedding becomes one coherent emotional arc set to their own song(s) — something no PH wedding platform offers because they don't own the renderer.

Pakanta is the "platform-of-record" feature for music. Once a couple buys it, Setnayan is the place their wedding's emotional spine lives.

## 2. Filipino sub-product naming

"Pakanta" = "pa-" (causative · "have someone do") + "kanta" (song). Literally "have a song made." Fits the established Setnayan sub-product family:

- **Papic** — have someone *photograph*
- **Panood** — *watch* the livestream
- **Patiktok** — have a *TikTok* made
- **Sulyap** — *glimpse*
- **Pakanta** — have a *song* made ✨

Filipino word as the brand mark; English subtitle ("Your Wedding's Own Song") helps non-Tagalog speakers understand the product.

## 3. Three pricing tiers (locked 2026-05-14)

All three tiers follow the locked charm-pricing convention (-9 endings).

| Tier | SKU code | Price | Songs | Versions | Remakes | Lyric approval gate | Turnaround |
|---|---|---|---|---|---|---|---|
| **Basic** | `pakanta_basic` | **₱1,999** | 1 | 1 (single style) | 2 | No (lightweight intake) | 24 hr |
| **Premium** | `pakanta_premium` | **₱3,999** | 1 | 2 (different approaches) | 3 | **Yes — mandatory · up to 3 revision rounds** | 2–5 days |
| **Wedding Suite** | `pakanta_wedding_suite` | **₱9,999** | 3 | 1 per song · same musical DNA | 3 total across the suite | **Yes — mandatory · single approval gate covering all 3 lyrics** | 5–7 days |

### What's the same across all tiers

- Owner-curated by Setnayan's music director (V1 manual; V1.5 partially automated when Suno API ships)
- Suno Premier generation only — Setnayan owns the rights to every track delivered (per locked music policy)
- Library-save option included — couple can save their final song(s) to `event_song_library` and use as backing track for all downstream Setnayan video renders
- Free unlimited MP3 downloads after delivery
- All deliverables include a final lyrics document (PDF, section-labeled)

### What differentiates Basic from Premium

- Basic skips the lyric approval gate — owner writes lyrics from intake and they ship in the first render. No mid-process collaboration.
- Basic produces 1 stylistic version (not 2 different approaches)
- Basic delivers a shorter song (≤ 1:30 length)
- Basic is essentially "test-drive Pakanta" — couples who want to see what AI-generated wedding songs can do without committing to the full custom-songwriter experience

### What differentiates Premium from Wedding Suite

- Wedding Suite delivers 3 separate songs for 3 different wedding moments
- All 3 songs share locked vocal Personas, base style, key family, and lyric through-line
- Final mastering pass on all 3 tracks together (LUFS + EQ + stereo-width match)
- Each song serves a different emotional function — Save-the-Date is announcement, First Dance is intimate, Reception Entrance is celebratory — but they feel like an EP, not 3 random songs

## 4. 6-phase production flow

### Phase 1 — Discovery (1–2 days)

Customer fills the 8-section intake form (see § 5). Lightweight version for Basic; full version for Premium and Wedding Suite. Owner may ask 2–3 follow-up questions for clarity via in-app chat.

### Phase 2 — Lyric Drafts (Premium + Wedding Suite ONLY · skipped in Basic)

**Round 1:** Owner drafts initial lyrics based on intake. Posts to customer in dashboard.

**Round 2:** Customer reviews · gives feedback (what lands, what doesn't, story corrections, tone adjustments). Owner revises.

**Round 3 (if needed):** Final polish round. Owner revises one more time.

**Approval gate:** Customer signs off on final lyrics before music generation begins. This is the **mandatory checkpoint** — Phase 3 cannot start until the customer approves.

For Wedding Suite: lyrics for all 3 songs are drafted simultaneously and reviewed together in a single approval gate. The lyric through-line (recurring phrase from the couple's story) must appear across all 3 song lyrics.

### Phase 3 — Style Development (owner-side · internal)

Owner builds the Suno style prompt based on intake answers. Locks in:

- **Genre cocktail** — 2–3 blended genres (e.g., "Romantic funky-retro-modern R&B pop duet")
- **Vocal arrangement** — who's singing and how
- **Specific instrument callouts** — 4–6 named instruments
- **Production era/style** — reference an era, not specific artists
- **Vocal character** — texture and delivery
- **Tempo (BPM)** — specific number, not a range
- **Mood descriptors** — 2–3 emotional words
- **Structural tag enforcement** — strict adherence to bracketed section tags

For Wedding Suite: owner additionally locks the **base style foundation** that stays identical across all 3 songs · the **key family** (single major key for all 3) · the **vocal Personas** plan (after Song #1 is generated, save male and female vocals as Personas to reuse on Songs #2 and #3).

### Phase 4 — Music Generation (Versions A & B for Premium · single Version for Basic · 3 songs for Suite)

Owner generates **8–10 takes per version** in Suno (the best take is rarely the first one). Owner internally picks the best take of each version before showing anything to the customer.

For Premium: deliver the best take of Version A (the primary requested style) AND the best take of Version B (a contrasting approach — different tempo, production approach, or genre blend). Both are internally curated best-of-batch, not raw Suno output.

For Wedding Suite: same 8–10 takes per song workflow. Song #1 generated first. Owner saves Personas. Songs #2 and #3 reuse those Personas + same base style + Song #1 as style reference for sonic DNA pull-forward.

### Phase 5 — Remake Round

Customer picks favorite version (Basic + Premium) OR reviews all 3 in the suite (Wedding Suite). Customer can request up to N remakes per tier:

- Basic: 2 remakes
- Premium: 3 remakes
- Wedding Suite: 3 remakes total across the suite (3 credits to use however)

Owner uses Suno's **Replace Section** feature for surgical fixes (e.g., "change just this line") instead of full regeneration. Full regeneration only when customer wants a substantively different feel.

### Phase 6 — Delivery

Each tier delivers:

**Basic (₱1,999):**
- 1 mastered MP3 (final locked version)
- Final lyrics document (PDF, section-labeled)
- License terms (personal use)

**Premium (₱3,999):**
- 1 mastered MP3 (final locked version) · plus access to all 3 remake renders if customer wants
- Final lyrics document (PDF, section-labeled)
- License terms (personal use)
- Save-to-library option: makes this song the default backing track for all event video renders

**Wedding Suite (₱9,999):**
- 3 mastered MP3s (matched LUFS + EQ + stereo width)
- Optional instrumental versions for ceremony moments
- Final lyrics document for all 3 songs (single PDF with section labels + through-line annotations)
- "About Your Suite" 1-page doc explaining cohesion mechanisms (Personas, style foundation, key family, lyric through-line)
- License terms (personal use)
- Save-to-library option: all 3 songs save to `event_song_library` so each is used for its intended moment in the wedding video stack

## 5. The 8-section intake form

Required for Premium and Wedding Suite. Basic uses a stripped-down 4-section version (basics + how-you-met + vibe + ending).

### Section 1: The Basics

- Bride's name
- Groom's name
- Wedding date
- Pet names for each other (e.g., "love," "babe," "mahal," etc.)
- Wedding location/venue (optional, can be referenced in lyrics)

### Section 2: How You Met

- How did you first meet? (Setting, year, age)
- Was there anything notable about the timing? (Almost-met moments, missed connections, etc.)
- How long between meeting and your first date?

### Section 3: First Date / Defining Moments

- Where did you go on your first date?
- Specific locations, places, or details that mattered (e.g., a bridge, a restaurant, a beach, a song playing)
- Was there a moment during early dating where you both knew?
- Any iconic spots in your relationship?
- **Defining-moment photo upload** (optional but encouraged · helps owner capture sensory detail)

### Section 4: The Proposal

- Where and when did the proposal happen?
- Was there a specific date significance (birthday, anniversary, holiday)?
- Anything surprising or unusual about how it played out?
- What was the bride's reaction?

### Section 5: Story Highlights

- Are there any inside jokes, signature phrases, or things you say to each other?
- Was there a long-distance period, a wait, or any obstacle you overcame?
- Are there specific words or phrases from your relationship you want included? (in your language, with translations)

### Section 6: Vibe / Style Preferences

- What's the song for? (Save-the-date video, first dance, walk-down-the-aisle, reception entrance, anniversary keepsake)
- What artists/songs inspire the feel you want? (Multiple — to capture the blend)
- Mood: Playful & upbeat / Romantic & cinematic / Intimate & tender / Cool & confident / Other
- Tempo: Slow ballad / Mid-tempo groove / Upbeat
- Vocal arrangement: Solo male / Solo female / Duet / Duet with backing vocals
- Language: English / Tagalog / Bilingual / Other
- Length: Under 1:30 (save-the-date) / 2–3 minutes (full song) / Both

### Section 7: Vocal Personality

- Should the song feel like the couple is narrating to friends or singing to each other?
- Want any spoken/conversational intros?
- Want playful banter or stay strictly sung?
- Want ad-libs or keep it clean?

### Section 8: The Ending + What You DON'T Want

- What's the song's final message? (Save-the-date announcement · "Here we are, married" celebration · "Forever starts now" vow · "We can't wait to share this moment with you" invitation)
- **What clichés do you want to avoid?** (cliché-avoidance field — just as important as what you want)

### Wedding Suite extension

Suite customers additionally pick 3 use cases from this list (must be 3 distinct):

- Save-the-Date
- First Dance
- Reception Entrance
- Processional (walk down the aisle)
- Recessional (couple exits ceremony)
- First Parent Dance
- Cake Cutting

## 6. Wedding Suite cohesion mechanisms (LOCKED · non-negotiable for the tier)

Three Suno renders are stochastically different. The Wedding Suite is NOT three identical clones — it's three songs that feel like they belong to the same album. Five cohesion mechanisms make this work:

### 6.1 Personas — locked vocal DNA across all 3 songs

After generating Song #1's best take, owner saves the male vocal as a Suno Persona and the female vocal as a Suno Persona. Songs #2 and #3 reuse those EXACT Personas. Couple hears "their voices" across all 3 songs because they ARE the same vocal performances.

### 6.2 Locked Base Style Foundation

One base style prompt stays identical across all 3 songs. Only the emotional descriptor varies:

```
BASE STYLE (locked across all 3):
"Indie folk-pop, fingerpicked acoustic guitar + soft felt piano +
 warm upright bass + brushed snare + light strings. Folklore-era
 polish. G major, 90–105 BPM range. Female lead with male backup
 harmonies on choruses."

SONG 1 — Save-the-Date (joyful announcement):
{BASE STYLE} + "bright joyful announcement energy, claps on chorus"

SONG 2 — First Dance (intimate vulnerable):
{BASE STYLE} + "slow intimate vulnerable, stripped chorus with
 vocal + piano only"

SONG 3 — Reception Entrance (celebratory):
{BASE STYLE} + "upbeat danceable energy, full drum kit, tambourine"
```

### 6.3 Locked Key Family

Single major key (G, D, or C work well for pop) across all 3 songs. Allows back-to-back playback at the wedding without jarring key changes.

### 6.4 Lyric Through-Line

A recurring phrase or image from the couple's story appears across all 3 song lyrics (subtle, not hammered). Example for a couple who met on a bridge in Vigan:

- **Save-the-Date:** *"A bridge in Vigan, December eighteen..."*
- **First Dance:** *"...the same bridge, the same rain, the same yes..."*
- **Reception Entrance:** *"...and now we're here, the bridge behind us..."*

The couple's story is the literal lyric thread tying the 3 songs together. Strongest emotional unifier.

### 6.5 Mastering Pass

Owner does a 15–30 minute mastering pass on all 3 final tracks together in Audacity / Logic / Ableton:

- Match loudness (LUFS · target -14 LUFS for streaming-style consistency)
- Match EQ profile (compare frequency spectra, adjust subtly)
- Match stereo width

This is what makes 3 separate Suno generations feel professionally produced as a collection.

## 7. Schema

```sql
-- ============================================================
-- 0036.1: pakanta_orders — state machine for each Pakanta purchase
-- ============================================================

CREATE TABLE pakanta_orders (
  pakanta_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id             TEXT UNIQUE NOT NULL,    -- S89K-XXXXXXXXXX
  event_id              UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  service_order_id      UUID NOT NULL REFERENCES service_orders(order_id),
  package_tier          TEXT NOT NULL
                          CHECK (package_tier IN ('basic', 'premium', 'wedding_suite')),
  suite_id              UUID REFERENCES pakanta_suites(suite_id),
                          -- NULL for basic/premium · set for wedding_suite child orders
  suite_position        SMALLINT,
                          -- NULL for basic/premium · 1/2/3 for wedding_suite child orders
                          -- 1 = first song generated (the anchor with Personas saved)
  use_case              TEXT,
                          -- 'save_the_date' / 'first_dance' / 'reception_entrance' / etc.
  customer_brief        JSONB,                   -- intake form data
  current_phase         TEXT NOT NULL DEFAULT 'brief_received_pending'
                          CHECK (current_phase IN (
                            'brief_received_pending',
                            'brief_received',
                            'lyrics_draft_1_ready',
                            'lyrics_revision_pending',
                            'lyrics_approved',
                            'samples_ready',
                            'sample_chosen',
                            'rerender_pending',
                            'rerender_ready',
                            'locked_in',
                            'delivered',
                            'expired_auto_locked',
                            'cancelled'
                          )),
  render_count          INTEGER NOT NULL DEFAULT 0,
                          -- Basic: max 3 (1 initial + 2 remakes)
                          -- Premium: max 5 (2 different-approach versions + 3 remakes)
                          -- Wedding Suite: max varies per child order (3 total remakes shared via parent)
  lyric_round           SMALLINT NOT NULL DEFAULT 0
                          CHECK (lyric_round >= 0 AND lyric_round <= 3),
  lyrics_approved_at    TIMESTAMPTZ,
  chosen_render_id      UUID,
  final_song_r2_key     TEXT,
  final_lyrics_pdf_r2_key TEXT,
  saved_to_event_library BOOLEAN NOT NULL DEFAULT FALSE,
  brief_submitted_at    TIMESTAMPTZ,
  locked_at             TIMESTAMPTZ,
  delivered_at          TIMESTAMPTZ,
  sla_deadline_at       TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pakanta_orders_event ON pakanta_orders(event_id);
CREATE INDEX idx_pakanta_orders_suite ON pakanta_orders(suite_id) WHERE suite_id IS NOT NULL;
CREATE INDEX idx_pakanta_orders_phase ON pakanta_orders(current_phase)
  WHERE current_phase NOT IN ('delivered', 'cancelled');

-- ============================================================
-- 0036.2: pakanta_suites — parent row for Wedding Suite 3-song bundle
-- ============================================================

CREATE TABLE pakanta_suites (
  suite_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id             TEXT UNIQUE NOT NULL,    -- S89K-SUITE-XXXX
  event_id              UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  service_order_id      UUID NOT NULL REFERENCES service_orders(order_id),
  -- Locked cohesion mechanisms:
  base_style_prompt     TEXT,                    -- the shared base style for all 3
  locked_key            TEXT,                    -- e.g., 'G major'
  male_persona_id       TEXT,                    -- Suno Persona ID after Song 1 generation
  female_persona_id     TEXT,
  lyric_through_line    TEXT,                    -- the recurring phrase
  remakes_used          INTEGER NOT NULL DEFAULT 0
                          CHECK (remakes_used >= 0 AND remakes_used <= 3),
  mastering_completed_at TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 0036.3: pakanta_lyric_drafts — track lyric revision rounds (Premium + Suite)
-- ============================================================

CREATE TABLE pakanta_lyric_drafts (
  draft_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pakanta_id            UUID NOT NULL REFERENCES pakanta_orders(pakanta_id) ON DELETE CASCADE,
  round_number          SMALLINT NOT NULL CHECK (round_number BETWEEN 1 AND 3),
  lyrics_text           TEXT NOT NULL,           -- full lyric draft with section labels
  owner_notes           TEXT,                    -- internal — what owner intends in this draft
  customer_feedback     TEXT,                    -- couple's feedback after this round
  is_approved           BOOLEAN NOT NULL DEFAULT FALSE,
                          -- TRUE when this is the round customer signed off on
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  feedback_received_at  TIMESTAMPTZ,
  UNIQUE (pakanta_id, round_number)
);

-- ============================================================
-- 0036.4: pakanta_renders — every render produced (audit trail)
-- ============================================================

CREATE TABLE pakanta_renders (
  render_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pakanta_id            UUID NOT NULL REFERENCES pakanta_orders(pakanta_id) ON DELETE CASCADE,
  render_index          SMALLINT NOT NULL,
                          -- Basic: 1 (initial), 2, 3 (remakes)
                          -- Premium: 1, 2 (Versions A+B), 3, 4, 5 (remakes of chosen)
                          -- Wedding Suite: same as Premium per song · cap varies
  approach_label        TEXT NOT NULL,
                          -- "Version A · Lover-era bright pop"
                          -- "Version B · Folklore acoustic cottagecore"
                          -- "Remake 1 · Bigger chorus with horn section"
  is_chosen             BOOLEAN NOT NULL DEFAULT FALSE,
  suno_prompt_used      TEXT NOT NULL,           -- transparency log
  takes_generated       SMALLINT NOT NULL DEFAULT 1,
                          -- Owner's internal 8–10 takes-per-version curation count
  takes_kept            SMALLINT NOT NULL DEFAULT 1,
                          -- Always 1 — the best take owner picked
  r2_key                TEXT NOT NULL,
  duration_seconds      INTEGER,
  bpm                   INTEGER,
  song_key              TEXT,                    -- 'G major' etc.
  used_personas         BOOLEAN NOT NULL DEFAULT FALSE,
                          -- TRUE when this render reused saved Personas (Suite songs 2+3)
  owner_notes           TEXT,
  delivered_to_couple   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pakanta_renders_pakanta ON pakanta_renders(pakanta_id, render_index);

-- ============================================================
-- 0036.5: event_song_library — saved Pakanta songs available
-- to event renderers (0011/0012/0024)
-- ============================================================

CREATE TABLE event_song_library (
  library_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id              UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  pakanta_id            UUID NOT NULL REFERENCES pakanta_orders(pakanta_id),
  use_case              TEXT,                    -- which moment this song serves
  song_name             TEXT NOT NULL,           -- couple-named
  r2_key                TEXT NOT NULL,
  duration_seconds      INTEGER,
  is_suite_member       BOOLEAN NOT NULL DEFAULT FALSE,
  suite_id              UUID REFERENCES pakanta_suites(suite_id),
  available_for_renders BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, pakanta_id)
);

CREATE INDEX idx_event_song_library_event ON event_song_library(event_id, available_for_renders);
```

## 8. RLS policies

Following canonical patterns in `02_Specifications/RLS_Policy_Pattern.md`:

```sql
-- All Pakanta tables: couple sees their event's rows; admin sees all
ALTER TABLE pakanta_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pakanta_suites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pakanta_lyric_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pakanta_renders ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_song_library ENABLE ROW LEVEL SECURITY;

-- Couple read patterns (per-event scope)
CREATE POLICY pakanta_orders_couple_read ON pakanta_orders
  FOR SELECT USING (event_id IN (SELECT current_couple_event_ids()));
CREATE POLICY pakanta_suites_couple_read ON pakanta_suites
  FOR SELECT USING (event_id IN (SELECT current_couple_event_ids()));
CREATE POLICY pakanta_lyric_drafts_couple_read ON pakanta_lyric_drafts
  FOR SELECT USING (
    pakanta_id IN (SELECT pakanta_id FROM pakanta_orders
                    WHERE event_id IN (SELECT current_couple_event_ids()))
  );
CREATE POLICY pakanta_renders_couple_read ON pakanta_renders
  FOR SELECT USING (
    pakanta_id IN (SELECT pakanta_id FROM pakanta_orders
                    WHERE event_id IN (SELECT current_couple_event_ids()))
    AND delivered_to_couple = TRUE
  );
CREATE POLICY event_song_library_couple_all ON event_song_library
  FOR ALL USING (event_id IN (SELECT current_couple_event_ids()));

-- Admin policies (full access)
CREATE POLICY pakanta_orders_admin ON pakanta_orders FOR ALL USING (is_admin());
CREATE POLICY pakanta_suites_admin ON pakanta_suites FOR ALL USING (is_admin());
CREATE POLICY pakanta_lyric_drafts_admin ON pakanta_lyric_drafts FOR ALL USING (is_admin());
CREATE POLICY pakanta_renders_admin ON pakanta_renders FOR ALL USING (is_admin());
CREATE POLICY event_song_library_admin ON event_song_library FOR ALL USING (is_admin());
```

Guests deliberately do NOT see pakanta tables.

## 9. Server actions

```ts
// apps/web/lib/pakanta.ts

// === Customer-side ===

export async function submitPakantaBrief({
  pakantaId,
  brief,    // full 8-section intake for Premium/Suite · 4-section for Basic
}: SubmitBriefInput): Promise<Result>;

// Lyric approval gate (Premium + Wedding Suite only)
export async function reviewLyricDraft({
  pakantaId,
  draftId,
  feedback,  // free text · OR 'approve' to lock the round
}: ReviewLyricInput): Promise<Result>;

export async function approveLyrics({
  pakantaId,   // for Wedding Suite, approves all 3 songs' lyrics in one call
}: ApproveLyricsInput): Promise<Result>;

export async function chooseSample({
  pakantaId,
  renderId,
}: ChooseSampleInput): Promise<Result>;

export async function requestReRender({
  pakantaId,
  diffNotes,
}: ReRenderInput): Promise<Result>;
// Wedding Suite version checks parent suite.remakes_used against cap of 3

export async function lockInPakanta({
  pakantaId,
}: LockInInput): Promise<Result>;

export async function saveToEventLibrary({
  pakantaId,
  songName,
  useCase,    // for Suite, allows mapping each of 3 songs to their use case
}: SaveToLibraryInput): Promise<Result>;

export async function downloadPakantaMP3({
  pakantaId,
  renderId,
}: DownloadInput): Promise<{ signedUrl: string }>;

// === Admin-side (owner workflow) ===

export async function uploadLyricDraft({
  pakantaId,
  roundNumber,
  lyricsText,
  ownerNotes,
}: UploadLyricInput): Promise<Result>;

export async function uploadPakantaSamples({
  pakantaId,
  samples,    // Premium: [versionA, versionB] · Basic: [singleVersion]
}: UploadSamplesInput): Promise<Result>;

export async function uploadSuiteSong({
  pakantaId,     // child suite order
  suitePosition, // 1, 2, or 3
  render,
  personasUsed,  // TRUE for songs 2+3 in suite
}: UploadSuiteSongInput): Promise<Result>;

export async function uploadPakantaReRender({
  pakantaId,
  renderInput,
}: UploadReRenderInput): Promise<Result>;

export async function lockSuitePersonas({
  suiteId,
  malePersonaId,
  femalePersonaId,
}: LockPersonasInput): Promise<Result>;
// Called after Suite Song #1 is generated · enforces re-use on songs 2+3

export async function deliverMasteredSuite({
  suiteId,
  masteredR2Keys,  // 3 final mastered MP3s
}: DeliverSuiteInput): Promise<Result>;
```

## 10. Admin Pakanta Queue surface (lives in 0023 Admin Console · new section)

`/admin/pakanta` — tier-aware admin surface for the Pakanta workflow. Four tabs:

### Tab 1 — Inbox (briefs + lyric drafts awaiting owner)

- Cards sorted by `brief_submitted_at` ascending
- Each card shows:
  - S89K- public ID + tier badge (Basic / Premium / Wedding Suite)
  - Couple names + event date
  - Brief preview (vibe + use case)
  - Current phase indicator (Brief / Lyric Round 1 / Lyric Round 2 / Lyric Round 3 / Samples Pending / Remake Pending)
  - SLA flag (yellow at 24hr, red at 48hr)
- Filter chips: All / By tier / By phase

### Tab 2 — Working sheet (per-order detail)

Three-pane layout adapts to current phase:

**Phase = Lyrics:**
- Left pane: Couple's intake (read-only) + previous lyric rounds + customer feedback
- Middle pane: Lyric drafting textarea (section-labeled template ready: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Final Chorus], [Outro], [End])
- Right pane: "Send draft to couple" CTA + draft history

**Phase = Suno Generation:**
- Left pane: Approved lyrics (read-only · for owner to paste into Suno)
- Middle pane: Suno-prompt scratchpad (textarea) + style-foundation builder (8 fields per § 3 Phase 3) + take-tracker (1–10 takes generated · which one to keep)
- Right pane: Upload area for MP3 + duration/BPM/key fields + Personas-save reminder (for Wedding Suite Song #1)

**Phase = Remake:**
- Left pane: Customer's diff notes + previous renders
- Middle: New Suno prompt (inherits previous approach) + Replace Section flag if surgical fix
- Right: Upload 1 new MP3

### Tab 3 — Wedding Suite Workbench (special UI for 3-song coordination)

Suite-specific surface:
- **Header:** Suite parent metadata (locked base style, locked key, lyric through-line, Personas status)
- **Three columns:** Song 1, Song 2, Song 3 — each shows its current phase, child order, all renders
- **Personas lock indicator:** prominent banner showing whether male/female Personas have been saved (RED if not yet · GREEN with Persona IDs once locked)
- **Mastering pass section:** at bottom, surfaces when all 3 songs are locked-in · uploads 3 mastered final MP3s + "Deliver Suite" CTA

### Tab 4 — Completed (delivered orders + analytics)

- Recent deliveries with delivery latency stats
- Average renders per order · per tier
- Library-save adoption rate
- Lyric revision-round distribution (how often customers go to round 3 vs approve round 1)
- Owner notes (private)

## 11. Couple-side surface (lives in 0021 § new card)

In `/dashboard/[eventId]/services` grid, new card "Pakanta · Your Wedding's Own Song" with tier-aware stateful rendering.

**Empty state:** Tier picker showing all 3 tiers side-by-side with the price ladder + brief feature summary + "Compare tiers" expand.

**In-progress state:** Card surfaces depend on `pakanta_orders.current_phase`:

| Phase | Card shows |
|---|---|
| `brief_received_pending` | "Tell us about your song" CTA → intake form |
| `brief_received` (Basic) | "Crafting your song · 24hr ETA" passive |
| `brief_received` (Premium/Suite) | "Lyrics in progress · 24hr ETA" passive |
| `lyrics_draft_1_ready` (Premium/Suite) | "Review your lyrics" CTA → review surface |
| `lyrics_revision_pending` | "Lyrics being revised · 24hr ETA" passive |
| `lyrics_approved` | "Music in production · 24–72hr ETA" passive |
| `samples_ready` | "Listen to your sample(s)" CTA |
| `sample_chosen` | "Remake or lock in" state console |
| `rerender_pending` | "Remake in production · 24hr ETA" passive |
| `rerender_ready` | "Your remake is ready" CTA |
| `locked_in` / `delivered` | "Download + save to library" finished view |

For Wedding Suite: the card additionally shows a 3-song progress strip (Song 1 / Song 2 / Song 3) with each at its independent phase.

## 12. Renderer integration (cross-iteration impact)

Iterations 0011 (Panood AI Highlights/SDE) · 0012 (Papic Personal Reels) · 0024 (Save-the-Date) renderers must check `event_song_library` BEFORE falling back to Setnayan's stock music catalog:

```sql
-- Single-song case (Basic or Premium):
SELECT r2_key, song_name, duration_seconds
FROM event_song_library
WHERE event_id = $1
  AND available_for_renders = TRUE
ORDER BY created_at DESC LIMIT 1;

-- Wedding Suite case (use_case-matched):
SELECT r2_key, song_name, duration_seconds
FROM event_song_library
WHERE event_id = $1
  AND available_for_renders = TRUE
  AND use_case = $2  -- 'save_the_date' / 'first_dance' / 'reception_entrance'
LIMIT 1;
```

For a couple with a Wedding Suite saved to library:
- Save-the-Date render → uses the Save-the-Date song
- AI Edited Highlight or SDE → uses the First Dance song (most emotionally central)
- LED Background loop → uses the Reception Entrance song

If no use-case-matched song exists, falls back to any saved Pakanta song; if no Pakanta in library, falls back to Setnayan stock catalog.

Couples can override per-render in the render UI ("Use a different song" toggle).

## 13. SLA + edge cases

**No background cron jobs are required for Pakanta in V1.** All time-based state transitions are handled via two lazy patterns: **(a) check-on-read** (server evaluates expiration timestamps when a couple opens their order or an admin opens the queue, mutating state at that read), and **(b) admin queue surface flags** (orders sitting in stale phases for longer than thresholds appear with red flags in the Pakanta Queue for manual action). Reminder emails are deferred to V1.1 enhancement. This keeps V1 cron-free for Pakanta — the platform-wide cron infrastructure (Phase 7 of `Install_Sequence_V1.md`) remains for other jobs (payment matcher, R2 tier migration, monthly team-pool allocation, etc.) but Pakanta does NOT register a job.

| Event | Per-tier SLA | Behavior (lazy / manual) |
|---|---|---|
| Brief submitted → next step | Basic 24hr · Premium 24hr (lyric R1) · Suite 24hr (lyric R1) | **Admin queue flag:** orders past 24hr without next step appear with a yellow SLA flag · past 48hr the flag goes red. Owner sees these every time they open the Pakanta Queue. |
| Lyric round submitted → couple action | 14-day window then auto-approve | **Check-on-read:** when couple opens the order surface OR admin opens the queue, server evaluates `lyric_round_submitted_at + 14 days < NOW()` → flips draft to `is_approved = TRUE` automatically at that read. Owner sees the auto-approval in the queue next time they look. |
| Couple chosen sample → couple action | 30-day auto-lock | **Check-on-read:** when couple opens order OR admin opens queue, server evaluates `sample_chosen_at + 30 days < NOW()` → flips `current_phase = 'locked_in'`, sets `locked_at = NOW()`, marks `expired_auto_locked = TRUE`. The chosen sample becomes the locked song automatically. Couple can still save-to-library or download from this state. |
| Couple inactivity at `brief_received_pending` | 14-day red flag (no auto-cancel) | **Admin queue surface:** orders in this state for > 14 days appear with a red "abandoned brief" flag in the Pakanta Queue. Admin clicks "Cancel + refund" manually per 0034 refund flow. No background job; this is a queue-grooming step the owner does opportunistically. |
| Suno generation fails (no usable take) | Re-generate at no additional render-count cost | Owner judgment call · logged in `pakanta_renders.owner_notes` |
| Owner unable to deliver within tier SLA | Customer apology + tier-proportional refund | 10% (Basic) / 15% (Premium) / 20% (Suite) per § 9.1 admin authority (single-admin refund authority ≤ ₱25K) |

### Why no cron for Pakanta

The platform-wide cron infrastructure (Vercel Cron OR Cloudflare Cron Triggers) is provisioned in Phase 7 of `Install_Sequence_V1.md` for six unavoidable scheduled jobs (monthly team-pool allocation, payment expiry sweep, reconciliation matcher every 5 min, face vector retention, R2 tier migration, quarterly template tally). Pakanta deliberately does NOT register a job because:

1. **State transitions can be lazy** — auto-lock at 30 days and auto-approve lyric drafts at 14 days don't need to happen *exactly at that moment*. They need to happen *by the time someone next looks at the order*. Check-on-read handles this with zero infrastructure.
2. **Inactive briefs don't need automatic cancellation** — they sit in the admin queue with a red flag. The 24-hr SLA owner uses to triage the queue catches them; a 14-day-flagged brief just gets cancelled when the owner notices it. This is operationally identical to admin clicking a button vs cron flipping state, with the upside of one human in the loop.
3. **Reminder emails are V1.1** — sending day-7 and day-12 reminders would require a cron job. We defer this until V1.1 when notification volume justifies the engineering.

Net effect: Pakanta ships fully functional in V1 with no Pakanta-specific cron jobs. The 0034 reconciliation cron handles payment-related state transitions for Pakanta orders (same as every other SKU) but no Pakanta-internal scheduler exists.

## 14. Pricing rationale + unit economics

| Cost factor | Basic | Premium | Wedding Suite |
|---|---|---|---|
| Suno Premier subscription amortized | ~₱50 | ~₱200 | ~₱500 |
| Owner curation + lyrics time | ~45 min (₱375) | ~2.5 hr (₱1,250) | ~7.5 hr (₱3,750) |
| Mastering pass | — | — | ~30 min (₱250) |
| R2 storage + bandwidth | ~₱5 | ~₱10 | ~₱20 |
| **Total variable cost** | **~₱430** | **~₱1,460** | **~₱4,520** |
| **Revenue** | **₱1,999** | **₱3,999** | **₱9,999** |
| **Gross margin** | **~78%** | **~63%** | **~55%** |

Wedding Suite has thinner margin (~55%) because it's labor-intensive — but the absolute contribution per order is ₱5,479, the highest of the 3 tiers. Strategic balance: Basic and Premium drive volume; Wedding Suite drives high-touch couples who'd otherwise spend ₱25K–₱75K elsewhere.

Comparison vs PH market:
- Basic ₱1,999 vs musician commission ₱5,000–₱8,000 single song: **60–75% cheaper**
- Premium ₱3,999 vs songwriter ₱10,000–₱25,000 single song: **60–84% cheaper**
- Wedding Suite ₱9,999 vs composer 3-song commission ₱25,000–₱75,000: **60–87% cheaper**

Setnayan delivers all 3 in 24hr–7 days vs PH market 4–16 weeks.

## 15. V1.5 roadmap

When Suno's official API ships:
- Replace manual workflow with automated generation (5-min owner review per render vs 15-20 min full curation)
- Real-time generation in couple-facing flow (samples in ~3 minutes instead of 24hr)
- Owner curation becomes "Director's Cut" optional upgrade
- Margin goes up to ~85% on Basic, ~75% on Premium, ~70% on Wedding Suite

Until V1.5: positioned in marketing as **"human-curated by Setnayan's music director"** — actually a positioning asset.

## 16. Out of scope (V1.x or later)

- Self-service Pakanta (couple writes own prompt, no curation) — V1.5+ as optional cheaper variant
- Bring-your-own lyrics (couple supplies lyrics, owner generates only) — V1.5 evaluation
- Pakanta gifting (one couple gifts another) — V2
- Pakanta for non-wedding events — will follow once Birthday/Celebration event types ship (same SKU works)
- Major-label music incorporation — NEVER (locked policy)
- More than 3 songs per Wedding Suite — V1.5 evaluation as Custom Suite tier

## 17. Test plan reference

See `tests.md` for the 30+ acceptance scenarios covering tier branching, lyric approval gate, render-cap enforcement per tier, Wedding Suite Personas lock, mastering pass delivery, RLS, SLA timers, library-save integration with use-case matching, and renderer fallback logic.

## 18. Fixtures reference

See `fixtures.json` for deterministic test data covering one event with one in-progress Premium Pakanta (`S89K-PAKANTA001` at `lyrics_revision_pending`) and one completed Wedding Suite (`S89K-SUITE0001` with all 3 child orders delivered + saved to event_song_library).

## 19. Decision references

- CLAUDE.md decision log 2026-05-14: "Pakanta · Your Wedding's Own Song — locked as 3-tier paid SKU with custom songwriter workflow"
- Music policy: AI-generated owned tracks only · CLAUDE.md decision log 2026-05-08
- Suno-prompt architecture: `02_Specifications/Music_Catalogue_Suno_Prompts_V1.md` and `Suno_Workstream_Complete_V1.md`
- Pricing convention: CLAUDE.md decision log 2026-05-12 (charm-priced -9 endings)
- Apparatus pricing rule: CLAUDE.md decision log 2026-05-09 (Pakanta is curation service — apparatus is Suno Premier subscription + Setnayan's music director judgment)
- Strategy B pricing repositioning: CLAUDE.md decision log 2026-05-12 (premium pricing for AI/curation services)
