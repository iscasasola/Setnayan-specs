# Music Catalogue · Suno Prompts V1 (Launch Set)

> **What this file is.** A paste-ready set of Suno Premier prompts for generating the V1 music catalogue. One prompt per template's locked music pairing, plus an Inspiration Library mapping 35 trending wedding tracks to template architectures. Generate ~3 variants per prompt for couple-to-couple variety, keep the best 1–3 takes per template. Target: ~60–90 final tracks in the launch catalog.

> **Locked decisions referenced:**
> - All music is **Suno-owned AI-generated** (CLAUDE.md 2026-05-08 · "Major-label music: never embedded in renders")
> - Each track is **owned outright by Setnayan** under Suno Premier terms — no per-render licensing fee
> - Music pairs to templates per `Template_Catalog_V1.md` `**Music pairing**` lines
> - Cinematic Orchestral Build feel-category gets **multiple variants** (10+) for SDE flagship variety (CLAUDE.md 2026-05-12)

> **Critical rule for Suno prompts:**
> **NEVER reference specific artists or song titles in actual Suno prompts.** The Inspiration Library below cites songs as architectural references (mood, instrumentation, build structure), but the Suno prompts themselves describe the *feel* and *architecture* — never the source. This keeps every generated track Setnayan-owned and copyright-clean. Suno's terms discourage style-of-artist prompts, and architectural descriptions produce better output anyway.

> **Storage convention** (per `14_Music_Catalogue_Cowork_Playbook.md`):
> ```
> /music_catalogue/{category_slug}/{template_id}_{variant_n}.mp3
> /music_catalogue/catalogue_manifest.json
> ```

> **How to use this file:**
> 1. Open Suno Premier (suno.com)
> 2. Copy a template's prompt block
> 3. Paste into Suno, set **Instrumental: ON**
> 4. Generate 2-3 times per prompt for variants
> 5. Keep 1-3 best takes per template
> 6. Tag each kept track with its filename pattern

---

## Inspiration Library — 35 reference tracks → template architecture

These are the songs whose emotional architectures inform the Suno prompts below. **None of these track names appear in the actual Suno prompts** — only their architectural elements (instrumentation, tempo, build structure, mood). Setnayan owns 100% of what Suno generates.

### A · Cinematic Epic / Trailer

| # | Inspiration | Architectural elements extracted | Maps to |
|---|---|---|---|
| 1 | **Feeling Good · Epic Version** | Minor-key piano intro → swelling strings → brass climax → triumphant resolution | CD-01 · COB-01 |
| 2 | **Saturn** by SZA (piano cut) | Slow contemplative piano, sustained emotional arc, 60-72 BPM | COB variant · SP-02 |
| 3 | **Beautiful Things** by Benson Boone | Anthemic emotional buildup, vocal-leads-to-climax | COB variant · GG-01 |
| 4 | **Time** by Hans Zimmer (Inception) | Minor-key piano motif → orchestral build → low brass climax | CD-01 · COB-04 |
| 5 | **Strings of Life** (Interstellar OST) | Wordless choir + orchestra · spiritual cinematic | COB-03 |
| 6 | **A Thousand Years** instrumental | Classic wedding cinematic, piano-led, gentle build | COB-06 · HF-03 |

### B · Soft Romantic Ballad

| # | Inspiration | Architectural elements extracted | Maps to |
|---|---|---|---|
| 7 | **Lover** by Taylor Swift | Fingerpicked acoustic guitar, dreamy chord progression, vulnerable indie-pop | SP-02 v1 |
| 8 | **Joker and the Queen** by Ed Sheeran | Solo piano intro → strings enter at chorus → orchestral swell → soft resolution | HF-03 · SP-02 v3 |
| 9 | **Espresso** by Sabrina Carpenter | Bright modern romance, slightly playful, contemporary pop ballad | SP-02 v4 |
| 10 | **Fortnight** by TS ft. Post Malone | Emotional pop ballad with melancholic synth undertone | HF-03 variant |
| 11 | **Tagpuan** by Moira Dela Torre | Modern OPM wedding classic, Filipino-romantic piano-led | HF-03 Filipino variant |
| 36 | **Kahit Maputi Na Ang Buhok Ko** by Rey Valera | Classic Filipino slow ballad, piano/guitar-led, dignified-sentimental lifelong-love declarative melody, sentimental | HF-01 v2 · HF-03 v4 · SP-02 lifelong-love variant |
| 37 | **Grow Old With You** by Adam Sandler (The Wedding Singer, 1998) | Fingerpicked acoustic guitar, simple major chords, sincere/earnest vocal phrasing, conversational-tender pacing | SP-02 v6 · BB-04 |

### C · Upbeat Celebration / Reception

| # | Inspiration | Architectural elements extracted | Maps to |
|---|---|---|---|
| 12 | **Opalite** by Taylor Swift (2025) | Disco-jangle pop-rock, bouncy swing, jangly electric guitar, 4-on-floor kick | IM-01 v1 |
| 13 | **As It Was** by Harry Styles | High-energy indie-pop, bright analog synth lead, mid-tempo bounce | IM-01 v2 |
| 14 | **Cruel Summer** by Taylor Swift | Anthemic celebration pop, building synth-pop chorus | IM-01 v3 · IM-05 |
| 15 | **LUNCH** by Billie Eilish | Afterparty hype, sparse bassline + electronic drums, low-end-heavy | IM-05 v1 |
| 16 | **Water** by Tyla | Dance-floor amapiano-influenced groove, syncopated percussion | V1.5 Celebration Pop · IM-05 v2 |
| 17 | **Ayokong Tumanda** by Itchyworms | Funky upbeat Filipino reception classic, brass-heavy rock-pop | HF-05 upbeat variant · V1.5 Celebration Pop PH |

### D · Filipino / OPM

| # | Inspiration | Architectural elements extracted | Maps to |
|---|---|---|---|
| 18 | **Tagpuan** by Moira | Mapped above (B-11) | HF-03 |
| 19 | **Ben&Ben** ("Maybe the Night," "Pasalubong") | Indie folk with OPM warmth, harmonized male+female vocals, acoustic-led | HF-02 · HF-03 v2 |
| 20 | **Cup of Joe** ("Misteryoso," "Multo") | Modern indie OPM, dreamy guitar textures, mid-tempo | SP-02 OPM variant |
| 21 | **Arthur Nery** ("Pelikula," "Take All the Love") | Soulful modern OPM, R&B-OPM bridge, falsetto-friendly | SP-02 R&B/OPM variant |
| 22 | **Lupang Hinirang** soft instrumental | National-anthem-feel, used sparingly for ceremonial moments | HF-04 (potential V1.5 patriotic-ceremonial template) |

### E · Vintage / Sepia / Retro

| # | Inspiration | Architectural elements extracted | Maps to |
|---|---|---|---|
| 23 | **Sinatra-era jazz standards** ("Fly Me to the Moon" instrumental cover) | Small jazz combo, brushed snare, muted trumpet, swing-era phrasing | VE-04 v1 |
| 24 | **Human Nature** by MJ (1982) | 80s synth-pop ballad, FM-bell lead, smooth chord progression, mid-tempo groove | SP-04 v1 |
| 25 | **80s OPM** (Sharon Cuneta, Gary V era) | Filipino retro romance, lush synth pads, mid-tempo ballad | VH-01 v2 · VH-03 v2 |
| 26 | **Sade** ("Smooth Operator," "No Ordinary Love") | Smooth slow R&B, sax + electric piano, mid-tempo groove | SP-02 R&B variant |

### F · Indie Singer-Songwriter

| # | Inspiration | Architectural elements extracted | Maps to |
|---|---|---|---|
| 27 | **Lover** by TS | Mapped above (B-7) | SP-02 v1 |
| 28 | **Joker and the Queen** by Ed Sheeran | Mapped above (B-8) | HF-03 · SP-02 v3 |
| 29 | **Saturn** by SZA | Slow emotional ballad, contemplative pacing | SP-02 v5 |
| 30 | **Ben&Ben** | Mapped above (D-19) | HF-02 · HF-03 v2 |

### G · Modern R&B / Soulful

| # | Inspiration | Architectural elements extracted | Maps to |
|---|---|---|---|
| 31 | **I Just Can't Stop Loving You** by MJ | Soft electric piano (Rhodes), smooth R&B chord progression, soulful | SP-02 R&B variant |
| 32 | **Saturn** by SZA (R&B version) | Modern soulful R&B, slow-mid tempo | SP-02 R&B variant |
| 33 | **Sade** | Mapped above (E-26) | SP-02 R&B variant |
| 34 | **Anita Baker** ("Caught Up in the Rapture") | Classic R&B romance, smooth sax + warm vocals | SP-02 R&B variant |
| 35 | **Arthur Nery** | Mapped above (D-21) | SP-02 OPM/R&B variant |

---

## V1.5 Template Direction Flags (NEW · derived from inspiration analysis)

The 35 inspirations surfaced 3 gaps in the V1 catalog. Flag for V1.5 expansion:

1. **Celebration Pop** template — captures Opalite / Cruel Summer / As It Was / Ayokong Tumanda energy. Reception/dance/candid-joy section anchor. Bright palette (warm pinks/golds), jangly motion graphics, upbeat 110–130 BPM tempo.
2. **R&B Romance** template — captures MJ / Sade / Anita Baker / Arthur Nery feel. Soulful warmth, late-evening intimate energy, smooth sax/Rhodes piano motion. Palette: deep ink + warm gold + cream.
3. **Filipino Modern OPM** template — captures Ben&Ben / Cup of Joe / Tagpuan / Arthur Nery feel. Indie folk + modern OPM warmth, harmonized vocals (Suno renders as instrumental for V1), Filipino-millennial aesthetic. Bridges Heritage Filipiniana to Modern Minimalist.

These don't ship in V1 but should be on the V1.5 roadmap. Couples wanting these feels in V1 use the closest existing template (IM-01 / SP-02 / HF-02 respectively).

---

## Suno generation guidelines

Before pasting prompts:

1. **Always set "Instrumental: ON"** — wedding background music has no vocals (except wordless soprano in COB-03 / COB-09, noted explicitly)
2. **Generate 2-3 times per prompt** — Suno gives 2 takes per generation, so 2-3 generations = 4-6 takes to choose from
3. **Listen to the FULL track** before keeping — Suno sometimes loses the arc near the end
4. **Reject filler** — per the locked no-filler rule, only keep takes that feel flagship-grade
5. **Tag immediately** — name kept files per the locked pattern (`HF-01_capiz_garden_v1.mp3`) so the catalogue manifest stays clean

---

## Heritage Filipiniana (4 templates)

### HF-01 Capiz Garden
**Architecture inspiration:** Slow Filipino kundiman tradition · A Thousand Years cinematic gentleness · Kahit Maputi Na Ang Buhok Ko lifelong-love sentimentality
**Suno prompt (V1 · main kundiman):**
> Slow Filipino kundiman ballad, instrumental only, solo strings — gentle violin lead with acoustic guitar fingerpicking and soft cello accompaniment. Warm, nostalgic, intimate, no drums, no electronic elements. 2-3 minute composition with anticipation building to a tender climax around 1:30, then resolved softly. Mood: peaceful, devoted, family-centered traditional Filipino wedding. No vocals.

**Suno prompt (V2 · Filipino lifelong-love sentimental):**
> Slow Filipino sentimental ballad instrumental, piano-led with strings. Solo piano carries melodic phrases (0:00-0:45), soft string section enters (0:45-1:30) and provides warm sustained underneath, gentle climax at 1:30 with subtle violin lead, returns to piano resolution. Mood: classic Filipino lifelong-love wedding ballad sentiment ("kahit maputi na ang buhok ko"), multigenerational family-warmth, dignified-emotional declaration. Tempo: 65-75 BPM. No vocals.

**Variants:** 4 total (V1 × 3 + V2 × 1)
**Filename pattern:** `HF-01_capiz_garden_v{1,2,3,4}.mp3`

---

### HF-02 Calesa & Cobblestone
**Architecture inspiration:** Filipino harana tradition · Ben&Ben acoustic warmth (refined)
**Suno prompt:**
> Solo acoustic Spanish/classical guitar in the Filipino harana tradition with occasional second-guitar harmony lines (suggesting indie-folk Filipino duet feel), instrumental, mid-slow tempo, evocative and slightly melancholic, vintage-warm tone. Single guitar throughout with occasional soft hand percussion (palmas), warm vocal-imitating melodic phrasing without vocals. 2-3 minute composition. Mood: old Manila streets at dusk, Vigan cobblestones, candlelit ceremony, Filipino-indie-folk warmth. No vocals.

**Variants:** 3
**Filename pattern:** `HF-02_calesa_cobblestone_v{1,2}.mp3`

---

### HF-03 Sampaguita Garlands
**Architecture inspiration:** Solo piano lullaby · Joker and the Queen piano→strings build · Tagpuan Filipino-romantic warmth · Fortnight melancholic-emotional undertone
**Suno prompt (V1 · main):**
> Slow solo piano lullaby with gentle string accompaniment, instrumental. Piano carries melodic phrases throughout starting at 0:00, soft sustained string section enters at 0:45 and provides warm pad underneath, very light orchestral swell at 1:45 climax, returns to solo piano for resolution. Mood: garden wedding lullaby, finding "your person," tender vulnerability, Filipino-romantic ballad warmth. Tempo: 60-72 BPM. Soft sustain pedal throughout. No vocals.

**Suno prompt (V2 · Filipino-modern variant):**
> Slow modern Filipino indie-folk instrumental, similar to Ben&Ben's acoustic warmth. Fingerpicked acoustic guitar, soft sustained synth pad underneath, gentle piano countermelody, occasional shaker. Mood: contemporary Filipino-romantic wedding, garden ceremony, OPM tenderness. Tempo: 70-85 BPM. No vocals.

**Variants:** 3 total (V1 piano lullaby × 2 takes + V2 Filipino-modern × 1 take)
**Filename pattern:** `HF-03_sampaguita_garlands_v{1,2,3}.mp3`

---

### HF-05 Bayanihan Sun
**Architecture inspiration:** Kulintang / gangsa Filipino percussion · Ayokong Tumanda upbeat reception energy (refined)
**Suno prompt (V1 · main):**
> Filipino kulintang gong ensemble layered with contemporary string section, instrumental, mid-tempo and joyful. Polyrhythmic gong patterns (high to low pitched), strings provide warm sustained chords underneath, occasional flute accents. Mood: village celebration, multigenerational gathering, sun-soaked outdoor reception, bayanihan spirit. 2-3 minute composition, building energy to a vibrant communal climax. No vocals.

**Suno prompt (V2 · upbeat reception variant):**
> Upbeat Filipino indie-rock reception track, instrumental, mid-tempo. Bright acoustic guitar strumming, full brass section (trumpets + saxophone), kulintang percussion accents, electric bass groove, energetic drums. Mood: Filipino wedding reception dance floor, "ayokong tumanda" celebration, multigenerational party energy. Tempo: 110-125 BPM. No vocals.

**Variants:** 3 total (V1 traditional × 2 + V2 reception-upbeat × 1)
**Filename pattern:** `HF-05_bayanihan_sun_v{1,2,3}.mp3`

---

## Modern Minimalist (3 templates)

### MM-01 Editorial Cream
**Architecture inspiration:** Contemporary classical piano-cello chamber music
**Suno prompt:**
> Slow piano and cello duet, instrumental, contemporary classical chamber music. Sparse minimal arrangement — piano carries simple melodic line, cello provides warm sustained counterpoint. Mood: quiet luxury, Aesop-product-photography calm, editorial restraint. 2-3 minute piece with subtle dynamic build to a tender high point at 1:45. Tempo: 50-60 BPM. No drums, no other instruments. No vocals.

**Variants:** 3
**Filename pattern:** `MM-01_editorial_cream_v{1,2}.mp3`

---

### MM-02 Concrete Linen
**Architecture inspiration:** Neoclassical hybrid · ambient electronic with piano
**Suno prompt:**
> Ambient electronic music with contemporary classical piano on top, mid-slow tempo, instrumental. Soft electronic pads provide atmospheric foundation, occasional subtle digital pulse (no aggressive beats), grand piano carries the melody with refined contemporary harmony. Mood: modern architecture, industrial loft venues, Tagaytay-cliff luxury, considered and cool. 2-3 minute composition. Tempo: 70-80 BPM. No vocals.

**Variants:** 3
**Filename pattern:** `MM-02_concrete_linen_v{1,2}.mp3`

---

### MM-05 Marble & Bone
**Architecture inspiration:** Orchestral chamber music with low brass
**Suno prompt:**
> Orchestral chamber music, instrumental, very slow and refined. Low brass section (French horn, low strings) provides warm sustained foundation, occasional gentle harp arpeggios. Mood: 5-star hotel reception, Manila Peninsula ballroom, Soho House energy, expensive without ostentatious. 2-3 minute composition with subtle swell to a graceful peak at 1:45. Tempo: 50-60 BPM. No drums. No vocals.

**Variants:** 3
**Filename pattern:** `MM-05_marble_bone_v{1,2}.mp3`

---

## Bridgerton · Regency (4 templates)

### BR-01 Regency Pastel
**Architecture inspiration:** Period-romantic harpsichord-violin duet
**Suno prompt:**
> Harpsichord and violin duet, instrumental, slow-romantic Regency period style. Harpsichord plays delicate ornamented arpeggios, violin carries the lyrical melody with vibrato. Mood: English manor garden, soft pastel florals, springtime romance. 2-3 minute composition with gentle dynamic arc. Tempo: 60-72 BPM. No vocals.

**Variants:** 3
**Filename pattern:** `BR-01_regency_pastel_v{1,2}.mp3`

---

### BR-03 Whistledown Letters
**Architecture inspiration:** Narrative piano-flute with mystery
**Suno prompt:**
> Slow piano and flute duet, instrumental, narrative and slightly mysterious. Piano carries minor-key melodic phrases with rolled chords, flute weaves in counter-melodies. Mood: vintage paper journal, gossip column unfolding, candlelit study, Bridgerton-style storytelling. 2-3 minute composition with subtle tension building to a revealing climax at 2:00. Tempo: 65-80 BPM. No vocals.

**Variants:** 3
**Filename pattern:** `BR-03_whistledown_letters_v{1,2}.mp3`

---

### BR-04 Queen's Tea
**Architecture inspiration:** Risk It All Disney-romantic orchestral build (refined)
**Suno prompt:**
> Slow refined orchestral ballad, instrumental. Begins with delicate violin + harp intro (0:00-0:30), strings + low brass enter at 0:45, soaring full orchestral chorus at 1:30 with timpani, gentle string-only resolution at 2:15. Emotional architecture: tender → declarative → triumphant → resolved. Mood: royal cathedral ceremony with Disney-romantic emotional swell, princess-and-prince emotional declaration. Tempo: 70-80 BPM. Light timpani allowed. No vocals.

**Variants:** 3
**Filename pattern:** `BR-04_queens_tea_v{1,2}.mp3`

---

### BR-05 Regency Rake
**Architecture inspiration:** Dramatic cello-harpsichord with passionate intensity
**Suno prompt:**
> Dramatic solo cello and harpsichord duet, instrumental, mid-tempo with romantic intensity. Cello plays bold melodic lines in minor key, harpsichord provides ornamental accompaniment with occasional sweeping arpeggios. Mood: burgundy velvet, candlelit ballroom, slightly dangerous Bridgerton-rake romance. 2-3 minute composition with passionate build at 1:45. Tempo: 75-90 BPM. No other instruments. No vocals.

**Variants:** 3
**Filename pattern:** `BR-05_regency_rake_v{1,2}.mp3`

---

## Vogue Editorial (3 templates)

### VE-01 Cover Issue
**Architecture inspiration:** Minimal solo piano runway elegance
**Suno prompt:**
> Minimal solo piano with occasional subtle electronic texture, instrumental, mid-slow tempo. Single piano line carries the melody with confident phrasing, every note chosen carefully. Mood: Vogue cover photoshoot, magazine layout, runway grace, editorial restraint. 2-3 minute composition. Tempo: 80-90 BPM. Very sparse arrangement. No vocals.

**Variants:** 3
**Filename pattern:** `VE-01_cover_issue_v{1,2}.mp3`

---

### VE-03 Fashion Week
**Architecture inspiration:** Minimal electronic runway-grade
**Suno prompt:**
> Minimal electronic, instrumental, mid-tempo and slightly avant-garde. Sparse synth pulses, low-end texture, occasional metallic accents. Mood: Paris Fashion Week front row, monochrome SS27 collection runway show, confident high-fashion energy. 2-3 minute composition with rhythmic drive. Tempo: 100-110 BPM. Minimal but rhythmic. No vocals.

**Variants:** 3
**Filename pattern:** `VE-03_fashion_week_v{1,2}.mp3`

---

### VE-04 Sepia Vogue
**Architecture inspiration:** 1960s jazz combo (Sinatra-era swing standards · refined)
**Suno prompt:**
> Small jazz combo (acoustic piano, upright bass, brushed snare drums, muted trumpet, optional saxophone), instrumental, mid-tempo with subtle swing. Standards-era phrasing — verse-bridge-verse structure, simple melodic head, gentle improvised solos. Mood: 1960s Vogue magazine, mid-century glamour, old-Hollywood ballroom, Sinatra-era jazz club. 2-3 minute composition with classic swing-era arrangement. Tempo: 90-110 BPM. Warm vintage recording aesthetic. No vocals.

**Variants:** 3
**Filename pattern:** `VE-04_sepia_vogue_v{1,2}.mp3`

---

## iMessage · Conversation (3 templates)

### IM-01 Blue Bubble
**Architecture inspiration:** Opalite disco-jangle pop-rock · As It Was high-energy indie-pop · Cruel Summer anthemic celebration
**Suno prompt (V1 · Opalite disco-jangle):**
> Upbeat pop-rock instrumental with jangly electric guitar (chime-y arpeggiated lines), disco groove (4-on-the-floor kick drum, syncopated electric bass), bouncy swing rhythm. Bright synth pad accents, occasional hand-clap track. Mood: dance-floor celebration, summer joy, reception energy, finding-your-happiness theme. 2-3 minute composition with steady upbeat energy throughout, mini-bridge breakdown at 1:30, return to full groove at 1:45. Tempo: 115-125 BPM. Bright major-key. No vocals.

**Suno prompt (V2 · As-It-Was high-energy indie-pop):**
> High-energy indie-pop instrumental, mid-tempo. Bright analog synth lead carries the melody, mid-tempo bouncy kick-snare pattern, melodic bass guitar groove, occasional whistled-sounding synth hook. Mood: cocktail hour pop, modern indie radio, sun-drenched dance floor energy. 2 minute composition. Tempo: 110-120 BPM. Major-key. No vocals.

**Suno prompt (V3 · Cruel-Summer anthemic-pop):**
> Anthemic celebration pop instrumental, mid-tempo with build-and-release structure. Verse: sparse synth + bass pulse. Chorus: full synth-pop arrangement with layered pads + driving kick-snare + bright synth lead melody. Mood: summer wedding anthem, dance-floor explosion, modern radio-pop celebration. 2-3 minute composition with strong dynamic build at 1:00 chorus. Tempo: 115-130 BPM. Major-key. No vocals.

**Variants:** 3 (one per V1/V2/V3 prompt)
**Filename pattern:** `IM-01_blue_bubble_v{1,2,3}.mp3`

---

### IM-03 Group Chat
**Architecture inspiration:** Filipino indie folk communal warmth · Ben&Ben texture
**Suno prompt:**
> Warm acoustic Filipino indie folk instrumental, mid-tempo. Acoustic guitar strumming and fingerpicking, light hand percussion (cajón or shakers), gentle bass, occasional mandolin or banjo accents, soft harmonized melody lines (suggesting friend-group warmth without vocals). Mood: friend group gathering, Filipino family WhatsApp chat, communal warmth, "ikaw na" joy. 2 minute composition. Tempo: 100-115 BPM. No vocals.

**Variants:** 2
**Filename pattern:** `IM-03_group_chat_v1.mp3`

---

### IM-05 Story Reply
**Architecture inspiration:** TikTok-viral pop-rock · LUNCH afterparty hype · Water dance-floor amapiano
**Suno prompt (V1 · trending tiktok-style):**
> Modern viral pop instrumental in the style of trending TikTok-friendly music, upbeat and catchy, 30-60 second hook structure repeating. Bright synth lead, punchy electronic drums, optional pitched vocal chops (no actual lyrics or words). Mood: Instagram story reply, gen-Z aesthetic, viral content, IG-Stories scrolling. 2 minute composition. Tempo: 120-135 BPM. No actual sung vocals.

**Suno prompt (V2 · afterparty hype):**
> High-energy afterparty pop instrumental. Sparse pulsing bass-heavy electronic foundation, syncopated trap-style hi-hat, occasional bright synth stab melody, low-end-heavy mix. Mood: late-night reception afterparty, dim-lit dance floor, modern pop-club hybrid. 2 minute composition. Tempo: 125-140 BPM. No vocals.

**Variants:** 2 (V1 viral + V2 afterparty)
**Filename pattern:** `IM-05_story_reply_v{1,2}.mp3`

---

## Spotify Canvas (2 templates)

### SP-02 Now Playing
**Architecture inspiration:** Lover indie-pop singer-songwriter · Joker and the Queen orchestral ballad · Saturn slow emotional · MJ I-Just-Can't-Stop R&B · Sade smooth-soul · Anita Baker classic R&B · Arthur Nery soulful-OPM
**Suno prompt (V1 · indie singer-songwriter):**
> Slow modern indie singer-songwriter instrumental. Fingerpicked acoustic guitar opening (0:00-0:30), soft piano enters at 0:30, gentle bass and brushed snare at 1:00, optional electric guitar slide at 1:45 climax, soft acoustic outro. Mood: a couple's "our song," vulnerable and warm, modern indie aesthetic. Tempo: 75-90 BPM. No drums beyond brushed snare. No vocals.

**Suno prompt (V2 · R&B ballad):**
> Slow R&B ballad instrumental. Soft electric piano (Rhodes) opening with extended jazz chords, smooth R&B chord progression, warm electric bass and brushed snare with very subtle hi-hat, gentle saxophone or muted-trumpet lead at 1:45, smooth fade. Mood: 1980s R&B romance, Quincy Jones production aesthetic, soulful declarations of love. Tempo: 70-80 BPM. No vocals.

**Suno prompt (V3 · piano-orchestral ballad):**
> Slow piano-led ballad with orchestral build, instrumental. Solo piano intro (0:00-0:30), strings enter at 0:30 and provide warm sustained underneath, subtle orchestral swell at 1:30 chorus, gentle string-piano resolution at 2:00. Mood: "you're my person" emotional declaration, modern wedding ballad with cinematic warmth. Tempo: 70-85 BPM. No vocals.

**Suno prompt (V4 · bright modern romance):**
> Bright modern pop ballad instrumental, mid-tempo. Soft electric piano opening, warm bass groove, light electronic drums with brushed snare, slightly playful melodic phrasing. Mood: contemporary romance, modern pop radio, slightly cheeky tenderness. Tempo: 100-110 BPM. Major-key. No vocals.

**Suno prompt (V5 · soulful Filipino-modern OPM bridge):**
> Soulful modern Filipino OPM ballad instrumental, slow-mid tempo. Electric piano + acoustic guitar foundation, falsetto-imitating synth lead, occasional saxophone, warm bass, brushed snare with very subtle hi-hat. Mood: contemporary Filipino R&B-OPM, Arthur-Nery-aesthetic, soulful-modern wedding declaration. Tempo: 75-85 BPM. No vocals.

**Suno prompt (V6 · simple-sincere acoustic "grow old with you"):**
> Simple fingerpicked acoustic guitar ballad instrumental, slow-mid tempo, sincere and earnest. Single nylon-string or steel-string acoustic guitar throughout, occasional gentle harmonica or whistle accent for warmth, no drums, no electronic elements. Mood: humble lifelong-love declaration, conversational-intimate, slightly playful tenderness, "I want to grow old with you" simplicity. 2-3 minute composition. Tempo: 80-95 BPM. Major-key. No vocals.

**Suno prompt (V7 · Filipino lifelong-love piano ballad):**
> Slow Filipino piano ballad instrumental, dignified and emotionally declarative. Piano carries the melody with simple but emotionally direct phrasing, soft string section enters at 1:00 to support climax, returns to piano for tender resolution. Mood: classic Filipino lifelong-love wedding ballad ("kahit maputi na ang buhok ko" sentiment), declarative-sincere across generations, multigenerational family-warmth. Tempo: 65-80 BPM. No vocals.

**Variants:** 7 total (V1-V7) — couples pick the variant that fits their "our song" vibe
**Filename pattern:** `SP-02_now_playing_v{1,2,3,4,5,6,7}.mp3`

---

### SP-04 Mixtape
**Architecture inspiration:** Human Nature 80s synth-pop · 80s OPM Sharon/Gary V era
**Suno prompt (V1 · 80s synth-pop):**
> 1980s synth-pop instrumental ballad. Soft synth pad opening with FM-bell melody (0:00-0:30), classic drum machine (LinnDrum-style) enters at 0:30, warm electric bass groove at 0:45, lead synth melody (DX7-style bell or analog lead) at chorus, smooth fade. Mood: 1982 Thriller-era smooth pop, dreamy and nostalgic, MJ-aesthetic but original composition. Tempo: 90-100 BPM. No vocals.

**Suno prompt (V2 · 80s OPM romance):**
> 1980s Filipino OPM synth-ballad instrumental. Lush synth pads, FM-bell melodic lead, classic drum machine, warm electric bass, occasional saxophone accent. Mood: Sharon Cuneta / Gary V era romance, Manila 1985 wedding reception ballad, retro-Filipino sentimentality. Tempo: 75-90 BPM. No vocals.

**Variants:** 3 total (V1 × 2 + V2 × 1)
**Filename pattern:** `SP-04_mixtape_v{1,2,3}.mp3`

---

## VHS · Y2K (3 templates)

### VH-01 VHS Tracking
**Architecture inspiration:** 90s home-video synth · 80s OPM Filipino nostalgia
**Suno prompt (V1 · 90s home-video):**
> 1990s home-video synth instrumental, mid-tempo, with intentional tape hiss and warbly VHS-degradation aesthetic. Warm analog synth pads, classic drum machine, occasional bell-like FM synth lead. Mood: home video memories, 90s family camcorder footage, nostalgic warmth, slight degradation. 2-3 minute composition. Tempo: 90-100 BPM. No vocals.

**Suno prompt (V2 · Filipino retro nostalgia):**
> Slow Filipino 80s-90s synth-ballad instrumental with tape-hiss aesthetic. Warm pad chords, classic drum machine with slight tempo wobble, FM-bell lead melody, occasional saxophone. Mood: Filipino family reception 1989, Sharon Cuneta movie soundtrack, warm nostalgic romance. Tempo: 75-90 BPM. No vocals.

**Variants:** 3 total
**Filename pattern:** `VH-01_vhs_tracking_v{1,2,3}.mp3`

---

### VH-03 Polaroid Stack
**Architecture inspiration:** Warm acoustic indie · personal handmade feel
**Suno prompt:**
> Warm acoustic indie instrumental, mid-slow tempo, personal and handmade-feeling. Solo acoustic guitar with occasional gentle piano, light brush drums, soft glockenspiel accents. Mood: polaroid photos being placed on a table, handwritten captions, personal memory book, intimate moments. 2 minute composition. Tempo: 80-95 BPM. No vocals.

**Variants:** 2
**Filename pattern:** `VH-03_polaroid_stack_v1.mp3`

---

### VH-04 Tape Pause
**Architecture inspiration:** Dreamy cinematic synth · hypnagogic VHS-pause
**Suno prompt:**
> Dreamy cinematic synth instrumental, slow, with hypnagogic VHS-pause aesthetic. Lush atmospheric pads, slow synth arpeggios, occasional reverbed piano accents, slight pitch wobble. Mood: VHS freeze-frame, time suspended, dreamlike memory, cinematic nostalgia. 2-3 minute composition. Tempo: 70-85 BPM. No vocals.

**Variants:** 3
**Filename pattern:** `VH-04_tape_pause_v{1,2}.mp3`

---

## Garden Golden-Hour (2 templates)

### GG-01 Sunset Veil
**Architecture inspiration:** Warm acoustic golden-hour · Beautiful Things anthemic emotional buildup
**Suno prompt:**
> Warm acoustic guitar instrumental at golden hour, mid-slow tempo, soulful with anthemic emotional buildup. Fingerpicked classical/nylon guitar with occasional gentle slide accents (0:00-0:45), soft warm bass and brushed snare enter at 0:45, building dynamics through to a passionate emotional climax around 1:30-1:45 with full strummed acoustic + light strings, resolved softly. Mood: outdoor sunset wedding, lens flares, warm golden light, emotional anthem of love. 2-3 minute composition. Tempo: 75-90 BPM. No vocals.

**Variants:** 3
**Filename pattern:** `GG-01_sunset_veil_v{1,2}.mp3`

---

### GG-02 Botanical Press
**Architecture inspiration:** Harp + flute botanical dreaminess
**Suno prompt:**
> Harp and flute duet, instrumental, slow and botanical. Harp plays gentle arpeggios and rolled chords, flute carries melodic line with soft vibrato. Mood: pressed flowers, vintage herbarium book, garden detail shots, dreamy and delicate. 2-3 minute composition. Tempo: 60-72 BPM. Optional very light string section underneath. No vocals.

**Variants:** 3
**Filename pattern:** `GG-02_botanical_press_v{1,2}.mp3`

---

## Beach Barefoot (4 templates)

### BB-01 Boracay Sunset
**Architecture inspiration:** Ukulele + acoustic summer breezy
**Suno prompt:**
> Ukulele-led summer beach instrumental, mid-tempo, breezy. Bright ukulele strumming, warm acoustic guitar fingerpicking, light hand percussion (cajón or shakers), occasional gentle whistle melody. Mood: Boracay sunset, white sand beach wedding, golden hour, summer love. 2-3 minute composition. Tempo: 95-110 BPM. No vocals.

**Variants:** 3
**Filename pattern:** `BB-01_boracay_sunset_v{1,2}.mp3`

---

### BB-02 Palawan Reef
**Architecture inspiration:** Ambient oceanic synth
**Suno prompt:**
> Ambient instrumental with soft synthesizers, slow and oceanic. Lush atmospheric pads, occasional gentle piano notes, soft underwater-feeling synth arpeggios. Mood: turquoise reef, El Nido island wedding, snorkel-blue water, floating tranquility. 2-3 minute composition. Tempo: 60-75 BPM. No drums. No vocals.

**Variants:** 3
**Filename pattern:** `BB-02_palawan_reef_v{1,2}.mp3`

---

### BB-04 Beach Bonfire
**Architecture inspiration:** Warm acoustic folk · evening bonfire · Grow Old With You sincere-acoustic simplicity
**Suno prompt:**
> Warm acoustic folk guitar instrumental with subtle ambient texture suggesting a crackling bonfire (very low background, not foreground), slow-mid tempo. Single acoustic guitar with fingerpicking, optional gentle hand drum, occasional warm electric guitar slide. Mood: sunset beach bonfire ceremony, intimate evening, candlelit dance under stars. 2-3 minute composition. Tempo: 75-90 BPM. No vocals.

**Variants:** 3
**Filename pattern:** `BB-04_beach_bonfire_v{1,2}.mp3`

---

### BB-05 Sand & Sea
**Architecture inspiration:** Ambient piano · ocean-quiet stillness
**Suno prompt:**
> Slow ambient solo piano instrumental, very quiet and still. Sparse minimal piano notes with long sustain, occasional soft cello accompaniment underneath, slight room reverb. Mood: minimalist beach ceremony, ocean horizon, white sand, quiet ceremony, stillness. 2-3 minute composition. Tempo: 50-65 BPM. No drums, no other instruments. No vocals.

**Variants:** 3
**Filename pattern:** `BB-05_sand_sea_v{1,2}.mp3`

---

## Cinematic Drama (2 templates) + COB Variant Set

### CD-01 Hollywood Anamorphic
**Architecture inspiration:** Feeling Good Epic Version · Hans Zimmer Time/Interstellar · Beautiful Things anthemic emotional
**Suno prompt:**
> Epic cinematic orchestral build, instrumental, slow-mid tempo. Begins with minor-key piano intro, swelling string section enters at 0:30, big brass section (French horns, trumpets, low trombones) takes over by 1:00, full orchestra at climax around 1:45-2:00 with timpani and cymbal crashes, then resolves softly. Emotional architecture: anticipation → climax → resolution. Mood: Christopher Nolan film, Interstellar-era cinematic grandeur, wedding-as-epic-love-story, anthemic emotional release. 2-3 minute composition. Tempo: 70-85 BPM. Allow timpani crescendo. No vocals.

**Variants:** 5 (this is the flagship — generate more variants for variety; see also the 10 COB variants below)
**Filename pattern:** `CD-01_hollywood_anamorphic_v{1,2,3}.mp3`

---

### CD-04 Film Noir
**Architecture inspiration:** Noir jazz · double bass + saxophone smoky
**Suno prompt:**
> Film noir jazz instrumental, slow-mid tempo, smoky. Walking upright bass, brushed snare drums, muted/wah trumpet or smoky tenor saxophone leading the melody, occasional piano accents. Mood: 1940s detective film, midnight ceremony, dramatic black-and-white shadows, mid-century cinema romance. 2-3 minute composition. Tempo: 80-95 BPM. Slight room reverb / smoky club atmosphere. No vocals.

**Variants:** 3
**Filename pattern:** `CD-04_film_noir_v{1,2}.mp3`

---

## Cinematic Orchestral Build (COB) — variant set (10 tracks for SDE flagship)

Locked per CLAUDE.md 2026-05-12. CD-01 Hollywood Anamorphic is the highest-emotional-stakes music pairing in V1; needs multiple variants so couples picking it for their SDE don't all get the same song. Generate 10 distinct tracks in this feel.

### COB-01 — Soft Piano Entry (Feeling Good Epic architecture)
**Suno prompt:**
> Epic orchestral build, instrumental, starts with delicate solo piano introduction (0:00-0:30) playing a memorable minor-key melodic phrase, slowly adds warm string section (0:30-1:00), brass enters subtly at 1:00, full orchestral climax with timpani at 1:45, gentle resolved outro at 2:15. Tempo: 70-80 BPM. No vocals.

### COB-02 — Strings-First Build
**Suno prompt:**
> Epic orchestral build, instrumental, starts with quiet violin section playing sustained minor-key chord progression (0:00-0:45), low strings enter and provide motion (0:45-1:15), full brass section arrives at 1:30 with dramatic phrase, climax at 2:00 with full orchestra + timpani, slow fade-out resolution. Tempo: 75-85 BPM. No vocals.

### COB-03 — Choir + Orchestra (Interstellar Strings-of-Life architecture)
**Suno prompt:**
> Epic orchestral build with wordless choir, instrumental. Wordless soprano "aaah" vocals layered on top of orchestra (no lyrics, just vocalizing). Piano intro at 0:00, strings + choir enter at 0:30, brass takes over at 1:15, dramatic climax with timpani and full orchestra+choir at 1:50, resolves softly. Tempo: 70-80 BPM. Wordless vocals only.

### COB-04 — Low Brass Lead (Hans Zimmer Time architecture)
**Suno prompt:**
> Epic orchestral build, instrumental, low brass section is the dominant voice. Begins with low strings and timpani, French horn enters with melody at 0:30, trombones add depth at 1:00, full brass section + strings climax at 1:45, resolves with single sustained horn note. Mood: brass-heavy cinematic build, Inception-era gravity. Tempo: 65-80 BPM. No vocals.

### COB-05 — Modern Hybrid (Orchestra + Subtle Synth)
**Suno prompt:**
> Modern cinematic orchestral build with subtle electronic synth foundation, instrumental. Hybrid of full orchestra and minimal synth pads. Piano + synth pad intro at 0:00, strings + brass enter at 0:45, climax at 1:45 with full orchestra over deep synth bass, resolves with strings only. Mood: contemporary cinematic, Tenet-era hybrid. Tempo: 70-85 BPM. No vocals.

### COB-06 — Slow Strings Anthem (A Thousand Years cinematic architecture)
**Suno prompt:**
> Anthem-style orchestral build, instrumental, all strings until brass arrives. Solo cello plays opening melodic phrase (0:00-0:30), full string section joins (0:30-1:15), brass section adds at 1:30, climax with strings + brass + timpani at 1:50, slow ending. Mood: wedding anthem, swelling emotional release, classic-cinematic. Tempo: 65-80 BPM. No vocals.

### COB-07 — Driving Rhythm Build
**Suno prompt:**
> Epic orchestral build with subtle rhythmic drive, instrumental. Begins with low cello ostinato (repeated pattern), strings layer in at 0:30, brass at 1:00, climax with full orchestra + timpani driving rhythmic accents at 1:45, resolves with single sustained chord. Mood: Inception-feel rhythmic cinematic. Tempo: 80-95 BPM. No vocals.

### COB-08 — Heartbreak-to-Triumph Arc
**Suno prompt:**
> Epic orchestral build with explicit emotional arc, instrumental. Begins in melancholy minor key (cello + piano, 0:00-0:45), strings add tension (0:45-1:15), pivots to major key at 1:30 with brass entrance, triumphant climax at 2:00 with full orchestra. Mood: emotional resolution, dark-to-light, vow-aware. Tempo: 70-85 BPM. No vocals.

### COB-09 — Female Wordless Soprano Solo + Orchestra
**Suno prompt:**
> Epic orchestral build with wordless female soprano solo, instrumental. Soprano carries the main melody with wordless "ah/oh" vocalizing (no lyrics), full orchestra underneath. Piano intro at 0:00, strings + soprano enter at 0:30, brass + soprano climax at 1:45. Mood: emotional cinematic build, Lisa-Gerrard-feel ethereal. Tempo: 70-80 BPM. Wordless vocals only.

### COB-10 — Lush Triumphant Finale
**Suno prompt:**
> Epic orchestral build, instrumental, lush and triumphant. Begins with horn fanfare (0:00-0:30), full string section enters (0:30-1:00), brass section takes lead (1:00-1:30), climactic full orchestra with timpani + cymbal crashes at 1:50, glorious slow resolution. Mood: triumphant wedding finale, full Hollywood epic ending. Tempo: 75-90 BPM. No vocals.

---

## Quality check rubric (per Suno take)

Before keeping a track, listen end-to-end and ask:

- [ ] **Does the emotional arc match the template's storyline pacing?**
- [ ] **Is the instrumentation right?**
- [ ] **Is the tempo within the locked range?**
- [ ] **Is it long enough?** (≥2 minutes preferred to allow loop options)
- [ ] **Is the recording quality high?** No artifacts, no obvious AI-generation glitches
- [ ] **Does it stand alone or feel generic?** A great track has a memorable melodic phrase, not just texture

If "no" to any: generate again with a tweak. Reject filler.

---

## Catalogue manifest format (after generation)

For every kept track, add an entry to `/music_catalogue/catalogue_manifest.json`:

```json
{
  "track_id": "HF-01_capiz_garden_v1",
  "template_id": "HF-01",
  "category": "heritage_filipiniana",
  "filename": "HF-01_capiz_garden_v1.mp3",
  "duration_seconds": 142,
  "tempo_bpm": 70,
  "key": "C minor",
  "instrumental": true,
  "wordless_vocals": false,
  "tags": ["kundiman", "filipino-romantic", "slow", "strings"],
  "inspiration_refs": ["A-01-feeling-good", "B-08-joker-and-the-queen"],
  "generated_via": "suno-premier",
  "generated_at": "2026-05-13T14:00:00+08:00",
  "owned_outright": true,
  "license_source": "suno-premier-subscription"
}
```

`inspiration_refs` is optional — tracks which inspiration song's architecture informed the prompt. Useful for catalog navigation but not legally required (since the generated track is original).

---

## Time + cost estimate

Generating ~100 tracks in Suno Premier:
- Average per-generation time: ~30 seconds for prompt + listen + decide
- 35 unique prompts (30 templates + 5 extra variant prompts in IM-01/SP-02/SP-04/HF-03/HF-05/VH-01) × ~3 takes each × ~2 minutes listening per take = ~10 hours total focused work
- Realistic: 3 sessions of 3-4 hours each over a week
- Suno Premier ($30/month) gives 500 generations/month — well within budget

**Total cost to Setnayan: $30 (one month of Suno Premier)** + zero per-render licensing thereafter. Tracks are owned outright by Setnayan.

---

## Track count summary (V1 launch target)

| Category | Templates | Variants × takes | Final keepers |
|---|---:|---:|---:|
| Heritage Filipiniana | 4 | 4 + extra variants | 9 |
| Modern Minimalist | 3 | 3 | 6 |
| Bridgerton · Regency | 4 | 4 | 8 |
| Vogue Editorial | 3 | 3 | 6 |
| iMessage · Conversation | 3 | 5 (IM-01 has 3 variants, IM-05 has 2) | 7 |
| Spotify Canvas | 2 | 6 (SP-02 has 5 variants, SP-04 has 2) | 8 |
| VHS · Y2K | 3 | 4 | 6 |
| Garden Golden-Hour | 2 | 2 | 4 |
| Beach Barefoot | 4 | 4 | 8 |
| Cinematic Drama (CD-01 + CD-04) | 2 | 2 | 5 |
| Cinematic Orchestral Build (COB) | 10 variants | 10 | 10 |
| **TOTAL** | **30 + 10 COB** | **~47 unique prompts** | **~77 final keepers** |

That's the V1 launch catalogue. Post-launch, the catalog grows toward the 300-400 target via the Sample Render Refresh Program rotation + targeted new generations as adoption data identifies which feels couples want more of.
