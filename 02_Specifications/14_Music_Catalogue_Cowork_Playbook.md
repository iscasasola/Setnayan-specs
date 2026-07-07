# Setnayan Music Catalogue & Template Library — Cowork Generation Playbook

> ## WARNING: AS-BUILT CORRECTION — 2026-06-07 (reconciled to live site + origin/main)
> **This doc is HISTORICAL/REFERENCE.** Authoritative current state = the live site (www.setnayan.com) + shipped code + `AS_BUILT_GROUND_TRUTH_2026-06-07.md`. Deltas (or "still accurate"):
> - **This is an unbuilt asset-generation production playbook, not a shipped feature.** As of 2026-06-07 there is NO `music_catalogue/` or `template_library/` asset directory, NO `catalogue_manifest.json`/`library_index.json`, NO Remotion/FFmpeg reel-render pipeline, and NO Personal Reels render flow in `apps/web` @ `origin/main`. The Suno-driven music run and the 500-template generation run described here were never executed in code. Treat the whole document as a forward production plan / reference, not as-built.
> - **Technique/method is still directionally usable** if/when the render layer is built (Suno-owned AI music, no major-label tracks, instrumental-only, architectural prompts, owned-outright licensing) — these remain locked product principles. But the volume targets (600 tracks / 500 templates) and the Saturday-session logistics are aspirational.
> - **Cross-cutting product facts** that supersede anything implied here: commission is **0%** (no Setnayan Pay 3%/5%); the AI planner SKU is **"Setnayan AI" ₱3,999** (not "Concierge ₱4,999"); **Pakanta is a single SKU ₱2,499** (3-tier collapsed in `lib/v2/sku-catalog-v2.ts`); the customer token wallet (0003) is RETIRED; the **SDE / Same-Day Edit SKU is RETIRED 2026-06-28** (the ₱3,499 figure cited in sister refresh docs no longer ships).
>
> When this body disagrees with the above, **the above wins.**

**Document Version:** 1.1
**Created:** 2026-05-08 (Friday)
**Session Date:** 2026-05-09 (Saturday)
**Owner:** Ice + Cowork
**Companion Spec:** 10_Papic_Feature_Specification.md (Personal Reels — Music Catalogue Strategy)
**Scope:** Two related production runs in one playbook
  1. **Music Catalogue Generation** — 600 AI-generated tracks across 6 mood/feel categories (Sections 1–10)
  2. **Reel Template Library Generation** — 500 pre-built 10-slot reel templates (Sections 11–14)

---

## 1. Mission

Generate **600 AI-composed music tracks** across 6 popular-feel categories through Suno Premier, driven by Cowork inside a Chrome session, save the keepers to the Setnayan workspace folder, and end up with a fully-owned, commercial-rights music catalogue for the Personal Reels feature. Then in a follow-up Cowork session, generate **500 reel template manifests** for the app's pre-built template library.

**Success criteria for the music run:**

- 500–600 tracks generated across 6 categories (~₱1,725 / ~$30 USD via Suno Premier 1-month subscription)
- 350–480 keepers after curation pass (60–80% keep rate is realistic)
- All tracks downloaded as MP3 to `/Users/icecasasola/Documents/Claude/Projects/Setnayan/music_catalogue/`
- File names tagged by category + sub-mood + BPM + index
- Suno subscription cancelled before next billing cycle

**Success criteria for the template-library run:**

- 500 reel template manifests generated as JSON
- Each template defines slot order, durations, transitions, intro/outro, color grade, and pairs cleanly with at least 2 music-catalogue categories
- Library saved to `/Users/icecasasola/Documents/Claude/Projects/Setnayan/template_library/`
- Cost: ₱250–₱1,000 in LLM API spend

**Why this matters:** Together, these two production runs deliver the entire creative-asset layer of the Personal Reels feature without the ₱100K–₱200K/year recurring license cost. Couples get more variety than competitors who use the same Artlist tracks, and Setnayan gets a "scored with original AI music for Filipino weddings, with bespoke templates for every couple" marketing line.

---

## 2. Pre-Saturday Checklist (do before the session starts)

| Task | Owner | Time | Done? |
|---|---|---|---|
| Sign up for **Suno Premier** account at suno.com (~$30 USD via credit card or PayPal — 10,000 credits/month, plenty of headroom for 600 tracks + re-rolls) | Ice | 5 min | ☐ |
| Verify the Premier account credit balance shows 10,000 monthly credits | Ice | 1 min | ☐ |
| Confirm Chrome browser is installed and the Claude in Chrome extension is connected to this Cowork session | Ice | 2 min | ☐ |
| Create the folder `/Users/icecasasola/Documents/Claude/Projects/Setnayan/music_catalogue/` with six subfolders: `01_bridgerton_feel/`, `02_taylor_swift_feel/`, `03_michael_jackson_feel/`, `04_jazz/`, `05_sunday_morning_vibes/`, `06_hip_hop/` | Ice or Cowork | 2 min | ☐ |
| Set up a music-keeper-decision log: a fresh Numbers/Excel sheet with columns: Filename, Family, BPM (estimated), Mood notes, Keep/Drop, Render-pair (which template moods this fits) | Ice | 5 min | ☐ |
| Test internet — generation needs steady connection. Disable VPN if active (Suno is sometimes geographically rate-limited) | Ice | 1 min | ☐ |
| Block out 4-hour windows for the session (recommended: morning + afternoon, or two morning blocks across two days if you'd rather not push through) | Ice | n/a | ☐ |

**Critical pre-session note:** Suno's 2,500 credits **reset monthly on the subscription anniversary**, not on the calendar month. If you sign up Saturday morning, those credits are good through ~June 9 — plenty of buffer if we need to spread the work over the weekend.

---

## 3. Saturday Session Plan

### Block 1 — Pilot batch (60 minutes, ~9:00 AM)

**Goal:** verify the Cowork → Chrome → Suno → download → save flow works end-to-end. We'll generate 20 tracks and confirm naming, file format, and folder structure are clean before scaling up.

| Step | Time | Who |
|---|---|---|
| Ice signs in to Suno Pro in the Chrome session | 2 min | Ice |
| Cowork verifies the Suno UI loads and the credit counter is visible | 2 min | Cowork |
| Cowork navigates to Custom Mode, enters first prompt from Section 4.1 (Bridgerton-Feel), clicks Generate | 2 min | Cowork |
| Wait for the first generation (~60–90 seconds) | 90 sec | both |
| Cowork downloads the MP3 to the correct subfolder, names it `BR_001_95bpm.mp3` | 2 min | Cowork |
| Repeat for 23 more tracks across all 6 categories (4 per category for diversity) | 60 min | Cowork |

If anything breaks in Block 1 — Suno UI changes, rate limiting, download issues, account flags — we stop and triage before committing more credits.

### Block 2 — Production run #1 (3.5 hours, ~10:30 AM after pilot)

**Goal:** generate 300 tracks (50 per category × 6 categories).

- ~35–40 minutes per category at 60-second generation cycles
- Cowork drives the prompt entry, generation, and download; Ice monitors and handles any Suno UI sign-out or CAPTCHA prompts
- Mid-block checkpoint at the 90-minute mark to verify keeper rate (spot-check 10 tracks)

### Block 3 — Lunch + curation pass on Block 1+2 output (90 minutes, ~2:30 PM)

**Goal:** listen to all 320 generated tracks (24 + 300), mark Keep/Drop in the decision log, identify any prompt patterns that consistently produce keepers vs. duds. Tune the Block 4 prompt list based on findings.

### Block 4 — Production run #2 (3 hours, ~4:00 PM)

**Goal:** generate the remaining 250–280 tracks, leaning into the prompt patterns that performed best in curation. End the day at ~580–600 total generations.

### Block 5 — Final curation + integration prep (60 minutes, ~7:00 PM)

**Goal:** finish the curation log, batch-rename keepers with their final filenames, write a `catalogue_manifest.json` describing each track's metadata (BPM, category, mood tags, key, length).

### Total session time: ~10 hours

If 10 hours is too long for one day, split the production runs (Blocks 2 + 4) across Saturday and Sunday. Suno Premier's 10,000-credit monthly pool is the only constraint — credits don't expire by daily quota and we have generous headroom (600 tracks × ~5 credits = 3,000 credits used, 7,000 remaining for re-rolls or wildcards).

---

## 4. The Prompt Library

Six categories, 100 prompts each = **600 generations target**. Below are 25–30 fully-specified seed prompts per category to drive the early production blocks. During the lunch curation pass we'll mutate the seed prompts (vary BPM, swap instrument, change emotional tone) to fill in the rest.

**Suno Custom Mode formula** that works well:
`[GENRE/STYLE], [INSTRUMENTATION], [MOOD], [TEMPO], instrumental, [LENGTH NOTE], [SPECIFIC FEEL]`

We always include the `instrumental` keyword — Personal Reels do not use vocal tracks because vocals fight the visual narrative.

**Important — popular-feel prompting rules:**

- **Never name an artist or song in a prompt.** Suno's safety layer will block or mute output that names "Taylor Swift," "Michael Jackson," "Bridgerton," etc. The output also gets watermarked as "questionable" in their backend.
- **Always describe the SOUND**: instruments, era, production style, BPM, mood. The genre is the descriptor — "string-quartet pop covers" gets us Bridgerton energy without saying Bridgerton.
- **Soundalikes are legal**: original compositions in the style of a genre are protected. Direct copies are not. Suno's training is built around this line.

### 4.1 Bridgerton-Feel — String-Quartet Pop Covers & Baroque Chamber (~100 tracks target)

Pop melodies arranged for string quartet. Period-drama-romantic. Baroque chamber elements. Reads as both classical and contemporary at once.

```
1.  String quartet cover of pop song style, baroque chamber, romantic, 95 BPM, instrumental, period drama feel
2.  Vitamin String Quartet style arrangement of contemporary pop, 100 BPM, instrumental, lush strings only
3.  Baroque chamber ensemble with harpsichord lead, romantic, 85 BPM, instrumental, regency-era feel
4.  String quartet with cello-driven pop melody, dramatic, 90 BPM, instrumental, ballroom dance feel
5.  Pop song reimagined as classical piece, two violins viola cello, 95 BPM, instrumental, period romance
6.  Baroque-influenced string ensemble with pizzicato verse and full bow chorus, 100 BPM, instrumental
7.  Modern pop melody arranged for string quartet plus piano, 92 BPM, instrumental, cinematic romance
8.  Period drama orchestral with harpsichord and strings, 88 BPM, instrumental, elegant ballroom
9.  String quartet with dramatic builds and pizzicato breaks, contemporary feel, 98 BPM, instrumental
10. Baroque chamber arrangement of pop ballad style, 85 BPM, instrumental, regency wedding
11. String quartet plus piano, modern pop melody arrangement, 95 BPM, instrumental, dramatic romance
12. Cello-led classical pop arrangement, romantic, 90 BPM, instrumental, sweeping chamber
13. Period orchestral with strings and woodwinds, romantic-dramatic, 92 BPM, instrumental, ballroom
14. Strings playing modern pop motif with baroque ornamentation, 100 BPM, instrumental, period-modern hybrid
15. Harpsichord and strings duet, regency-era romantic, 88 BPM, instrumental, intimate chamber
16. Full string ensemble with pop chord progression, dramatic, 95 BPM, instrumental, cinematic ballroom
17. String quartet with rolling cello bass, contemporary classical pop, 100 BPM, instrumental
18. Pizzicato strings with dramatic full-bow climax, romantic, 96 BPM, instrumental, period drama
19. Orchestral strings with harp arpeggios, regency-romantic, 90 BPM, instrumental, ballroom waltz
20. String quartet pop arrangement, building intensity, 95 BPM, instrumental, romantic period drama
21. Baroque-modern fusion with strings, harpsichord, and subtle percussion, 92 BPM, instrumental
22. Sweeping strings with woodwind countermelody, dramatic, 88 BPM, instrumental, period romance
23. Cello solo with string quartet accompaniment, romantic ballad arrangement, 85 BPM, instrumental
24. String ensemble with pop hooks, dramatic builds, 95 BPM, instrumental, period-drama opener
25. Baroque chamber orchestra with harpsichord lead, romantic, 90 BPM, instrumental, formal ballroom
26. String quartet with pop melodic structure, lush production, 100 BPM, instrumental, romantic drama
27. Period orchestral with string crescendo and timpani, dramatic, 92 BPM, instrumental, ballroom climax
28. Modern pop ballad arranged for chamber strings, intimate-romantic, 88 BPM, instrumental
29. String ensemble with dramatic pizzicato verse and legato chorus, 96 BPM, instrumental, period drama
30. Baroque romantic with harpsichord, strings, and subtle harp, 90 BPM, instrumental, regency wedding

VARIATION PATTERNS (use to reach 100):
- Vary BPM across 85, 88, 90, 92, 95, 98, 100, 104, 110
- Swap instrumentation: harpsichord vs. piano, full quartet vs. cello solo, with/without harp
- Add tempo arc: "rubato intro then steady tempo," "ritardando ending," "accelerando through bridge"
- Add ornamentation: "with baroque trills," "with romantic vibrato," "with mordents"
- Specify key: "key of D major" (bright), "key of G minor" (dramatic), "key of A major" (warm)
```

### 4.2 Taylor-Swift-Feel — Modern Pop with Narrative Production (~100 tracks target)

Female-forward modern pop. Country-pop crossover. Synth-pop. Folk-pop with banjo/mandolin. Late-2010s to 2020s production sensibility — narrative songwriting structure, anthemic bridges, mid-tempo storytelling.

```
1.  Modern country-pop with female-forward production, narrative songwriting, 95 BPM, instrumental, mid-tempo storytelling
2.  Synth-pop with vintage drum machine and bright lead, 110 BPM, instrumental, anthemic chorus arc
3.  Folk-pop with banjo, acoustic guitar, and four-on-the-floor kick, 120 BPM, instrumental, joyful
4.  Pop ballad with piano lead, building strings, narrative arc, 88 BPM, instrumental, emotional pop
5.  Synth-driven pop with arpeggiated lead and big drums, 105 BPM, instrumental, late-2010s production
6.  Mid-tempo pop with acoustic guitar verse and synth chorus, 100 BPM, instrumental, dynamic build
7.  Country-pop crossover with mandolin and modern drums, 115 BPM, instrumental, hopeful narrative
8.  Pop with finger-snap rhythm and acoustic guitar, 108 BPM, instrumental, intimate-anthemic
9.  Synth-pop ballad with airy vocals as pad texture, 92 BPM, instrumental, dreamy modern pop
10. Indie folk-pop with mandolin and brushed drums, 100 BPM, instrumental, narrative songwriting
11. Modern pop with piano-led verse and synth-driven chorus, 105 BPM, instrumental, build-and-payoff
12. Late-2010s pop production with synth bass and clap, 112 BPM, instrumental, polished radio
13. Folk-pop with acoustic guitar verse and string-section bridge, 95 BPM, instrumental, narrative arc
14. Country-pop with steel guitar accents and modern drums, 110 BPM, instrumental, crossover hit
15. Synth-pop with shimmer reverb guitar and tight drums, 108 BPM, instrumental, modern radio
16. Pop with kick-snare four-on-floor and acoustic guitar, 120 BPM, instrumental, anthemic
17. Mid-tempo pop ballad with piano and strings, 90 BPM, instrumental, emotional narrative
18. Folk-pop with hand claps, foot stomps, and acoustic guitar, 115 BPM, instrumental, joyful
19. Synth-pop with vintage drum machine and bright lead synth, 108 BPM, instrumental, retro-modern
20. Pop with acoustic guitar verse, building to anthemic synth chorus, 102 BPM, instrumental
21. Country-pop with banjo, mandolin, and modern drums, 118 BPM, instrumental, hopeful and bright
22. Modern pop ballad with piano, strings, and subtle synth pad, 88 BPM, instrumental, emotional
23. Folk-pop with kick-drum heartbeat and acoustic guitar, 95 BPM, instrumental, narrative ballad
24. Synth-pop with arpeggiated lead and tight modern drums, 110 BPM, instrumental, dance-pop crossover
25. Pop with finger-snap rhythm, ukulele, and synth pad, 100 BPM, instrumental, light and bright
26. Country-pop crossover with steel guitar and synth, 115 BPM, instrumental, modern Nashville
27. Mid-tempo synth-pop with airy production, 105 BPM, instrumental, dreamy modern pop
28. Folk-pop with banjo and brushed drums, 108 BPM, instrumental, narrative storytelling
29. Pop with piano lead and modern drum production, 95 BPM, instrumental, emotional ballad
30. Synth-pop with bright lead and big build to chorus, 112 BPM, instrumental, anthemic pop

VARIATION PATTERNS:
- Era variants: "early-2010s pop," "late-2010s pop," "2020s pop," "2008-style country-pop crossover"
- Production layer toggles: with/without synth bass, with/without finger snaps, with/without airy vocal-pad
- BPM range: 88–122 (sweet spot of mid-tempo modern pop)
- Specify mood: "narrative-melancholic," "anthemic-hopeful," "dance-celebratory," "intimate-confessional"
```

### 4.3 Michael-Jackson-Feel — Funk-Pop, Disco, Soul-Pop (~100 tracks target)

Funk-pop with disco bass. Soul-pop with horn sections. 80s-style pop production. Falsetto-style synth leads. Tight rhythm sections with slap bass and crisp drums.

```
1.  Funk-pop with disco bass and falsetto-style synth lead, 110 BPM, instrumental, 80s production
2.  Soul-pop with horn section and tight rhythm, 105 BPM, instrumental, polished party
3.  Disco-influenced pop with strings and four-on-the-floor kick, 116 BPM, instrumental, dance celebration
4.  Funk-pop with slap bass, crisp drums, and bright synth, 108 BPM, instrumental, groovy
5.  80s-style pop with gated reverb snare and synth bass, 112 BPM, instrumental, retro polish
6.  Soul-pop with tight horn riffs and walking bass, 100 BPM, instrumental, classic R&B feel
7.  Funk-pop with rhythm guitar 16th-note groove, 110 BPM, instrumental, energetic dance
8.  Disco-pop with strings, horns, and four-on-floor kick, 118 BPM, instrumental, dance floor
9.  80s-style pop with synth bass and clean electric guitar, 108 BPM, instrumental, retro radio
10. Funk-pop with brass stabs and tight rhythm section, 112 BPM, instrumental, anthemic groove
11. Soul-pop with rhodes piano, horns, and bass, 102 BPM, instrumental, classic 70s soul
12. Disco-influenced pop with arpeggiated synth and four-on-floor, 116 BPM, instrumental, dance-pop
13. Funk-pop with wah-wah guitar and slap bass, 108 BPM, instrumental, groovy and bright
14. 80s-style pop with synth lead and gated drums, 110 BPM, instrumental, retro-modern
15. Soul-pop with full horn section and rhythm guitar, 100 BPM, instrumental, classic Motown
16. Funk-pop with rolling bassline and tight kick-snare, 112 BPM, instrumental, dance celebration
17. Disco-pop with strings, brass, and four-on-floor kick, 120 BPM, instrumental, party anthem
18. Funk-pop with rhythm guitar 16th-note pattern, 110 BPM, instrumental, energetic groove
19. Soul-pop with horn stabs and walking bass, 104 BPM, instrumental, classic R&B
20. 80s-style pop with synth bass and gated reverb snare, 114 BPM, instrumental, retro polish
21. Funk-pop with falsetto-style synth lead and slap bass, 110 BPM, instrumental, signature 80s
22. Disco-influenced with strings, horns, and dance kick, 118 BPM, instrumental, sparkly party
23. Soul-pop with rhodes, horns, and tight rhythm section, 102 BPM, instrumental, classic groove
24. Funk-pop with brass section accents and rhythm guitar, 108 BPM, instrumental, dance-floor ready
25. 80s-style pop with synth lead, gated drums, and tight bass, 112 BPM, instrumental, retro pop
26. Disco-pop with arpeggiated synth, strings, and four-on-floor, 116 BPM, instrumental, sparkle
27. Funk-pop with wah guitar, slap bass, and tight drums, 110 BPM, instrumental, groovy dance
28. Soul-pop with horn riffs, rhodes, and bass, 100 BPM, instrumental, classic R&B groove
29. Funk-pop with rolling bass and brass stabs, 114 BPM, instrumental, energetic celebration
30. 80s-style pop with falsetto-style synth and gated snare, 112 BPM, instrumental, retro-anthemic

VARIATION PATTERNS:
- Era variants: "70s soul-pop," "80s funk-pop," "early-90s soul-pop," "Quincy Jones-era production"
- Instrument toggles: with/without horn section, with/without strings, slap bass vs. walking bass
- BPM range: 95–122
- Production references (avoid the artist name): "thriller-era production polish," "off-the-wall disco-pop feel," "bad-album rhythm guitar"
- Add "with hi-hat 16ths," "with tight kick-snare, gated reverb"
```

### 4.4 Jazz (~100 tracks target)

Smooth jazz, swing, bossa nova, Latin jazz, jazz ballad. Brushed drums, walking bass, brass and woodwind leads, piano trios. Sophisticated and intimate, works for cocktail-hour and dinner-service moments.

```
1.  Smooth jazz with brushed drums, walking bass, and tenor sax lead, 95 BPM, instrumental, classic
2.  Jazz ballad with piano trio, intimate cocktail feel, 75 BPM, instrumental, supper club
3.  Bossa nova with nylon guitar, light percussion, and flute, 110 BPM, instrumental, Brazilian summer
4.  Swing jazz with full big band, 130 BPM, instrumental, classic ballroom
5.  Latin jazz with piano trio, congas, and trumpet, 105 BPM, instrumental, Cuban cocktail
6.  Smooth jazz with electric piano, brushed drums, and soprano sax, 92 BPM, instrumental, mellow
7.  Jazz piano trio with walking bass and brushed drums, 100 BPM, instrumental, classic standard
8.  Bossa nova with acoustic guitar, shaker, and muted trumpet, 108 BPM, instrumental, beach lounge
9.  Swing jazz with tenor sax lead and rhythm section, 125 BPM, instrumental, dance hall
10. Jazz ballad with rhodes piano, upright bass, and brushed drums, 78 BPM, instrumental, late-night
11. Latin jazz with piano, bass, congas, and saxophone, 100 BPM, instrumental, salsa-inflected
12. Smooth jazz with guitar lead, brushed drums, and bass, 95 BPM, instrumental, polished cocktail
13. Jazz waltz with piano, bass, and brushed drums, 100 BPM, instrumental, intimate three-four
14. Bossa nova piano trio with light percussion, 112 BPM, instrumental, Rio cocktail
15. Swing jazz with full rhythm section and brass, 128 BPM, instrumental, classic uptempo
16. Smooth jazz with alto sax lead and electric piano, 90 BPM, instrumental, mellow groove
17. Jazz ballad with solo piano and upright bass, 76 BPM, instrumental, after-hours
18. Latin jazz with piano, bass, and Latin percussion, 105 BPM, instrumental, Afro-Cuban
19. Bossa nova with classical guitar, shaker, and muted trumpet, 110 BPM, instrumental, samba-light
20. Swing jazz with brushed drums and walking bass, 120 BPM, instrumental, classic medium swing
21. Smooth jazz with tenor sax, brushed drums, and electric piano, 92 BPM, instrumental, lounge
22. Jazz piano trio standard, swung 8th notes, 110 BPM, instrumental, classic
23. Latin jazz with bossa rhythm and piano lead, 108 BPM, instrumental, breezy
24. Smooth jazz ballad with electric guitar and bass, 80 BPM, instrumental, intimate
25. Swing jazz with vibraphone, brushed drums, and walking bass, 115 BPM, instrumental, supper club
26. Bossa nova with nylon guitar and light vocal-style flute, 108 BPM, instrumental, summer afternoon
27. Jazz with brushed drums, upright bass, and trumpet melody, 95 BPM, instrumental, classic standard
28. Latin jazz with piano, bass, and congas, 102 BPM, instrumental, Cuban-jazz fusion
29. Smooth jazz with saxophone, electric piano, and bass, 95 BPM, instrumental, polished
30. Jazz waltz with piano trio, 102 BPM, instrumental, intimate three-four time

VARIATION PATTERNS:
- Sub-genres: smooth jazz, swing, bossa nova, Latin jazz, jazz waltz, cool jazz, ballad, bebop-light
- Instrument lead variants: tenor sax / alto sax / soprano sax / trumpet / muted trumpet / flugelhorn / vibraphone / electric piano / acoustic piano / guitar
- BPM range broad: 70–135 (jazz spans the full mood spectrum)
- Add "with light Latin percussion" / "with brushed drums only" / "with finger snaps on 2 and 4"
- Add tonality: "key of F major" (warm), "key of B-flat" (jazz-standard), "minor key for melancholy"
```

### 4.5 Sunday Morning Good Vibes (~100 tracks target)

Chill acoustic. Indie-folk. Coffee-shop pop. Warm and unhurried. Brunch-music. Lo-fi hip-hop-adjacent for the chiller end. Fits couples who want a relaxed, pacific energy.

```
1.  Chill acoustic with fingerpicked guitar and brushed drums, 92 BPM, instrumental, coffee-shop warm
2.  Indie folk with acoustic guitar, light strings, and warm pad, 90 BPM, instrumental, brunch
3.  Soft pop with electric piano, brushed drums, and bass, 95 BPM, instrumental, lazy Sunday
4.  Lo-fi indie pop with vinyl crackle and warm pad, 85 BPM, instrumental, hangout
5.  Acoustic with classical guitar, cello, and light percussion, 95 BPM, instrumental, sunny morning
6.  Indie folk with banjo, acoustic guitar, and brushed drums, 100 BPM, instrumental, lazy weekend
7.  Soft pop with rhodes piano, bass, and shaker, 90 BPM, instrumental, breezy
8.  Lo-fi acoustic with tape hiss and clean guitar, 88 BPM, instrumental, mellow afternoon
9.  Chill acoustic with ukulele, light percussion, and warm pad, 95 BPM, instrumental, beach morning
10. Indie folk with acoustic guitar, strings, and subtle drums, 92 BPM, instrumental, hopeful Sunday
11. Soft pop with electric piano, light brushed snare, and bass, 88 BPM, instrumental, lazy bright
12. Acoustic with mandolin, fingerpicked guitar, and brushed drums, 96 BPM, instrumental, country-Sunday
13. Lo-fi indie pop with vinyl crackle, soft drums, and pad, 82 BPM, instrumental, drowsy
14. Indie folk with banjo, mandolin, and acoustic guitar, 102 BPM, instrumental, sunny porch
15. Chill acoustic with classical guitar, light shaker, and bass, 95 BPM, instrumental, brunch
16. Soft pop with acoustic guitar verse and light strings chorus, 92 BPM, instrumental, gentle build
17. Lo-fi acoustic with tape hiss, clean electric guitar, and brushed drums, 88 BPM, instrumental
18. Indie folk with fingerpicked guitar and cello, 95 BPM, instrumental, contemplative warm
19. Soft pop with rhodes, light percussion, and warm bass, 92 BPM, instrumental, mellow
20. Chill acoustic with ukulele, shaker, and warm guitar, 100 BPM, instrumental, beach-morning bright
21. Indie folk with acoustic guitar, mandolin, and brushed drums, 95 BPM, instrumental, country-pop chill
22. Lo-fi indie pop with vinyl crackle and warm electric piano, 85 BPM, instrumental, hangout
23. Soft pop with acoustic guitar, light strings, and brushed drums, 92 BPM, instrumental, hopeful chill
24. Chill acoustic with classical guitar, cello, and warm pad, 95 BPM, instrumental, late-morning
25. Indie folk with banjo, acoustic guitar, and light percussion, 98 BPM, instrumental, sunny weekend
26. Lo-fi acoustic with tape hiss and electric piano, 86 BPM, instrumental, drowsy bright
27. Soft pop with rhodes piano, brushed drums, and bass, 90 BPM, instrumental, lazy Sunday
28. Chill acoustic with ukulele, brushed drums, and warm pad, 92 BPM, instrumental, breezy
29. Indie folk with fingerpicked guitar and brushed drums, 95 BPM, instrumental, contemplative warm
30. Lo-fi indie pop with vinyl crackle, acoustic guitar, and warm bass, 88 BPM, instrumental, hangout

VARIATION PATTERNS:
- Sub-feels: "brunch chill," "lazy weekend," "porch acoustic," "hammock vibes," "rainy-Sunday melancholy"
- Instrument toggles: ukulele vs. acoustic guitar vs. classical guitar; with/without banjo or mandolin; with/without rhodes
- BPM range: 80–105 (this family is unhurried by definition)
- Texture additives: "with vinyl crackle," "with tape hiss," "with light field recording," "with subtle background ambience"
- Mood: "hopeful," "contemplative," "drowsy," "sunny," "rainy-day cozy"
```

### 4.6 Hip Hop (~100 tracks target)

Boom-bap, lo-fi hip hop, modern trap-light, jazz-rap. Instrumental hip hop only — no rapped vocals (Suno's instrumental toggle handles this). Spans chill (lo-fi, jazz-rap) to upbeat (boom-bap, trap).

```
1.  Boom-bap hip hop instrumental with vinyl crackle and 808 drums, 90 BPM, instrumental, classic
2.  Lo-fi hip hop with jazz piano sample, brushed drums, and warm bass, 85 BPM, instrumental, chill
3.  Modern trap-light with 808 sub bass, hi-hat rolls, and synth lead, 140 BPM, instrumental, polished
4.  Jazz-rap instrumental with rhodes, upright bass, and boom-bap drums, 92 BPM, instrumental, classic
5.  Lo-fi hip hop with vinyl crackle, jazz guitar sample, and bass, 80 BPM, instrumental, drowsy
6.  Boom-bap hip hop with horn sample, vinyl crackle, and 808 drums, 92 BPM, instrumental, golden-era
7.  Modern hip hop with melodic synth, 808 bass, and hi-hat rolls, 130 BPM, instrumental, polished
8.  Jazz-rap with saxophone sample, brushed drums, and bass, 95 BPM, instrumental, classic
9.  Lo-fi hip hop with rhodes piano, vinyl crackle, and warm bass, 82 BPM, instrumental, late-night
10. Boom-bap with chopped soul sample, vinyl crackle, and 808 drums, 88 BPM, instrumental, classic NYC
11. Modern hip hop with melodic lead, sub bass, and hi-hats, 135 BPM, instrumental, contemporary
12. Jazz-rap with piano trio sample, brushed drums, and walking bass, 95 BPM, instrumental
13. Lo-fi hip hop with guitar sample, vinyl crackle, and soft drums, 80 BPM, instrumental, mellow
14. Boom-bap with horn riff, vinyl crackle, and 808 kick-snare, 90 BPM, instrumental, classic
15. Modern trap with melodic synth, 808 bass, and hi-hat triplets, 138 BPM, instrumental, polished
16. Jazz-rap with rhodes, upright bass, and boom-bap drums, 92 BPM, instrumental, golden-era
17. Lo-fi hip hop with vinyl crackle, jazz piano, and warm bass, 85 BPM, instrumental, study
18. Boom-bap with soul sample, vinyl crackle, and 808 drums, 88 BPM, instrumental, classic
19. Modern hip hop with melodic lead, 808 sub bass, and hi-hat rolls, 130 BPM, instrumental
20. Jazz-rap with saxophone sample, brushed drums, and walking bass, 96 BPM, instrumental
21. Lo-fi hip hop with guitar sample, vinyl crackle, and soft drums, 82 BPM, instrumental, drowsy
22. Boom-bap with horn riff and vinyl crackle, 92 BPM, instrumental, classic golden-era
23. Modern trap-light with melodic synth and 808 bass, 135 BPM, instrumental, polished
24. Jazz-rap with piano sample, brushed drums, and bass, 94 BPM, instrumental, classic feel
25. Lo-fi hip hop with rhodes, vinyl crackle, and warm bass, 80 BPM, instrumental, late-night chill
26. Boom-bap with soul sample, vinyl crackle, and 808 kick-snare, 90 BPM, instrumental
27. Modern hip hop with melodic lead, sub bass, and hi-hats, 132 BPM, instrumental, contemporary
28. Jazz-rap with saxophone, upright bass, and brushed drums, 95 BPM, instrumental, classic
29. Lo-fi hip hop with vinyl crackle, jazz guitar, and soft drums, 84 BPM, instrumental, mellow
30. Boom-bap with horn sample and vinyl crackle, 92 BPM, instrumental, classic NYC

VARIATION PATTERNS:
- Sub-genres: boom-bap, lo-fi hip hop, jazz-rap, trap-light, melodic trap, downtempo hip hop
- BPM range: 80–145 (lo-fi cluster at 80–95, boom-bap at 88–95, trap at 130–145)
- Sample sources to reference: "with chopped soul sample," "with jazz piano sample," "with brass riff sample," "with rhodes loop"
- Always specify "no rapped vocals" or rely on the instrumental toggle
- Texture: "vinyl crackle," "tape hiss," "boom-bap kick-snare," "trap hi-hat rolls"
```

### 4.7 Off-Label / Wildcard Generations (allocate ~50 credits)

Save 50 credits at the end of the session for wildcard prompts — things we didn't think of, or moods we discover during curation are missing. Examples:

- "Wedding processional with church bells and string orchestra"
- "Chinese-influenced wedding traditional with erhu and pipa, 75 BPM, instrumental"
- "Tropical bossa nova with nylon guitar, 100 BPM, instrumental, romantic afternoon"
- "Anime-influenced romantic ballad with piano and strings, 80 BPM, instrumental"
- "EDM build with no drop (just suspense), 128 BPM, instrumental, anticipation"
- "Filipino kundiman string-quartet arrangement, 75 BPM, instrumental" (since the original Traditional Filipino category is missing — worth keeping a few of these in the catalogue for cultural fit)

**Note on Filipino representation:** The 6 user-requested categories don't include explicit Filipino traditional music, which may be a gap for the Setnayan PH wedding market. Worth allocating 20–30 wildcard credits to kundiman/rondalla-style tracks so couples wanting a culturally-grounded reel still have options.

---

## 5. Generation Workflow Step-by-Step

### Inside Cowork during the session, the loop looks like this:

1. **Cowork (me)**: Reads the next prompt from this playbook.
2. **Cowork**: Uses Chrome MCP to navigate to suno.com (Custom Mode tab open).
3. **Cowork**: Pastes the prompt into the lyrics/prompt field. Selects "Instrumental" toggle.
4. **Cowork**: Clicks Generate.
5. **Suno**: Begins generation. Takes 60–90 seconds.
6. **Cowork**: Polls the Suno UI every 15 seconds checking if the track is ready.
7. **Cowork**: When ready, hovers the track and clicks Download → MP3.
8. **Chrome**: Saves to default Downloads folder.
9. **Cowork**: Uses Bash to move the file from `~/Downloads/` to the appropriate subfolder under `/Users/icecasasola/Documents/Claude/Projects/Setnayan/music_catalogue/`, renaming it according to the convention below.
10. **Cowork**: Logs the prompt + filename + estimated keep-rate guess into the decision sheet.
11. **Cowork**: Loops to next prompt.

### Filename convention

`{category_code}_{index_3digit}_{bpm}_{descriptor}.mp3`

| Code | Category |
|---|---|
| BR | Bridgerton-Feel |
| TS | Taylor-Swift-Feel |
| MJ | Michael-Jackson-Feel |
| JZ | Jazz |
| SM | Sunday Morning Vibes |
| HH | Hip Hop |
| WC | Wildcard / Off-Label |

Examples:
- `BR_001_95bpm_string-quartet.mp3` (Bridgerton-Feel, prompt 1, 95 BPM)
- `TS_042_110bpm_synth-pop.mp3` (Taylor-Swift-Feel)
- `MJ_015_110bpm_funk-pop.mp3` (Michael-Jackson-Feel)
- `JZ_007_95bpm_smooth-jazz.mp3` (Jazz)
- `SM_023_92bpm_indie-folk.mp3` (Sunday Morning)
- `HH_038_88bpm_lofi.mp3` (Hip Hop)

### Suno Custom Mode settings

- **Mode:** Custom
- **Lyrics:** leave empty (we want instrumental)
- **Style:** paste the prompt from the library
- **Instrumental:** **TOGGLE ON**
- **Length:** Keep default (Suno will produce ~2 minute tracks; we trim at render time)
- **Public:** **TOGGLE OFF** (don't make tracks publicly visible on Suno's explore feed)

### Rate-limit handling

If Suno starts returning "Try again in X seconds" or rejecting Generate clicks, **stop immediately**. Do not hammer. Wait 5 minutes and retry. If the rate-limit returns within 30 seconds, pause for 30 minutes — Suno's anti-bot escalation tightens with repeated rapid retries. Use the pause to do a curation listen-through of what we've already generated.

---

## 6. File Organization

After the session, the catalogue should look like this:

```
/Users/icecasasola/Documents/Claude/Projects/Setnayan/music_catalogue/
├── 01_bridgerton_feel/
│   ├── BR_001_95bpm_string-quartet.mp3
│   ├── BR_002_100bpm_baroque-chamber.mp3
│   └── ... (~80–100 files)
├── 02_taylor_swift_feel/
│   └── ... (~80–100 files)
├── 03_michael_jackson_feel/
│   └── ... (~80–100 files)
├── 04_jazz/
│   └── ... (~80–100 files)
├── 05_sunday_morning_vibes/
│   └── ... (~80–100 files)
├── 06_hip_hop/
│   └── ... (~80–100 files)
├── 07_wildcard/
│   └── ... (~10–20 files)
├── catalogue_manifest.json     ← machine-readable index
└── decision_log.numbers        ← curation/keep notes
```

`catalogue_manifest.json` shape (one entry per kept track):

```json
{
  "tracks": [
    {
      "id": "BR_001",
      "filename": "BR_001_95bpm_string-quartet.mp3",
      "category": "bridgerton_feel",
      "bpm": 95,
      "key": "D major",
      "length_seconds": 124,
      "mood_tags": ["dramatic", "romantic", "period"],
      "best_slot_position": "S1 or S10",
      "best_30s_window_start": 22,
      "energy_curve": "slow-build",
      "suno_prompt": "String quartet cover of pop song style, baroque chamber, romantic, 95 BPM, instrumental, period drama feel",
      "generated_at": "2026-05-09T09:14:32Z",
      "keep": true
    }
  ]
}
```

The manifest is what the template library reads at template-binding time to pair a music track with a reel template.

---

## 7. Curation Pass

For each generated track, listen 15–20 seconds (you don't need to hear the whole thing) and tag:

| Criterion | Pass / Fail |
|---|---|
| Does it sound like a real wedding wouldn't reject this? | Pass = keep |
| Are there obvious AI artifacts (audible glitches, weird transitions, abrupt cutoffs)? | Fail = drop |
| Is the BPM consistent enough for the template's beat-driven cuts to land? | Pass = keep |
| Does the energy match the family it was generated for? | If wrong family but good track, re-categorize |
| Is the production quality acceptable on phone speakers (not just headphones)? | Pass = keep |

**Realistic keep rate: 60–80%.** That gives us 300–400 keepers from 500 generations. More than the 30–40-track minimum we need for V1.5.

**If keep rate falls below 50% in a category**, pause that category and tweak the prompts. Common Suno-quality issues:
- Vocals creeping in despite "instrumental" toggle → re-prompt with explicit "no vocals, no humming, no human voice"
- Tracks ending abruptly at 0:30 → ignore (we trim anyway)
- Generic-sounding tracks → add more specific influence references in prompts

---

## 8. Risk & Contingency

| Risk | Probability | Mitigation |
|---|---|---|
| Suno UI changes mid-session, breaking the automation | Medium | Pause, take screenshot, adapt the Cowork driving logic. May lose 30 minutes. |
| Suno rate-limits the account aggressively | Medium | Slow down to 1 generation per 90 seconds. Take 30-min breaks every hour. |
| Suno flags the account for automated activity and suspends it | Low | The activity pattern through Chrome MCP looks like normal user activity. If suspended, contact Suno support and pivot to MusicGen open-source as backup. |
| Internet drops mid-session | Medium | Resume from last completed prompt. The decision log is the source of truth for what's been done. |
| Credits exhausted before all 600 prompts processed | Very low (Suno Premier's 10,000-credit allotment leaves ~7,000 credits of buffer past 600 generations) | If somehow exceeded, wait for monthly reset or top up. |
| Curation reveals quality is below threshold | Low-Medium | Pivot to one-time-purchase tracks from AudioJungle (₱30–50K backup budget) for the gaps. The free-music-library option is also still available as fallback. |
| Suno's TOS interpreted as not allowing this use | Low | Read the Pro plan TOS during pre-session checklist. As of the last public version, Pro grants you commercial rights and ownership of generations. We're using it for its intended purpose. |

---

## 9. Post-Generation Integration Tasks

Once the catalogue exists, we need to wire it into the Setnayan system. These are post-Saturday tasks (not for the session itself):

- [ ] Upload the curated MP3s to Cloudflare R2 under a `music_catalogue/` bucket
- [ ] Build the `catalogue_manifest.json` reader into the AI sequencer service so it can pick tracks for templates
- [ ] Add 30-second segment trim logic to the render pipeline (FFmpeg `-ss` and `-t` flags using the best-30s metadata we'll add)
- [ ] Tag each track with "best 30-second window start time" during a second listening pass
- [ ] Build a couple-facing music preview UI in the Personal Reels onboarding (couple can hear a 15-second preview of each option for their template)
- [ ] Write a music-license claim memo for Setnayan's legal file: "These tracks were generated using Suno Pro under their commercial-rights TOS on [date]. Setnayan holds full ownership and commercial-use rights. Subscription proof and generation logs are archived at [path]."
- [ ] Cancel the Suno Pro subscription before the next billing cycle

---

## 10. Saturday Morning Quick-Start (TL;DR — Music)

1. Sign up for Suno Premier at suno.com (~5 minutes, ~$30 credit card)
2. Open Chrome with the Claude in Chrome extension connected to Cowork
3. Tell Cowork: "Let's start the music catalogue session — pilot batch first"
4. Cowork drives Suno using prompts from Section 4
5. Run pilot (60 min) → check output → run production blocks 1 + 2 → curate → done

---

## 11. Mission — Template Library Generation

After the music catalogue is curated and ready, Phase 2 runs separately (could be same day, could be a follow-up Cowork session within the week): generate **500 reel template manifests** for the Personal Reels feature.

A reel template is a JSON manifest the render pipeline ingests. It defines:

- 10 slot positions (5 for guest picks, 5 for couple memorable clips)
- Slot durations (each adds up to ~30 seconds total with intro/outro)
- Transitions between slots (cross-fade, hard cut, swipe, zoom-blur, beat-match cut)
- Intro and outro card design (couple monogram + names, hashtag)
- Color grade / LUT
- Text overlay rules (timestamps, captions, names, locations)
- Ken-Burns / motion treatment per slot for static photos
- Pairing hints — which music-catalogue categories this template feels best with

500 templates means a couple's wedding can be assigned a uniquely-feeling reel structure without us ever having to generate a template per-wedding. The AI sequencer just picks the best fit from the library and parameterizes it (drops in monogram, music track, hashtag).

**Success criteria:**

- 500 templates generated as JSON manifests
- Each template tested rendering at least once with placeholder content to verify it produces valid output
- Templates organized into a library with metadata for fast lookup
- 60–80% pass curation as "production-ready" (300–400 keepers, more than enough)
- Total cost: ₱250–₱1,000 in LLM API spend

---

## 12. Template Generation Workflow

This is a Claude/Gemini-driven workflow, not a Suno-driven one. Cowork prompts the LLM to produce template manifests that conform to a strict schema, validates each one, and saves it to disk.

### The template schema (target output)

```json
{
  "template_id": "TPL_001",
  "name": "Bridgerton Cinematic — Romantic Slow Burn",
  "version": "1.0",
  "feel_tags": ["bridgerton-feel", "romantic", "dramatic", "period"],
  "music_pairing_categories": ["bridgerton_feel", "jazz"],
  "music_pairing_bpm_range": [85, 100],
  "color_grade": "warm-cinematic",
  "lut": "warm_film_01",
  "intro": {
    "duration_ms": 1000,
    "type": "monogram_card",
    "background": "soft_cream",
    "text_layout": "centered",
    "title_template": "{couple_first_names}",
    "subtitle_template": "{wedding_date_pretty}",
    "fade_in_ms": 200,
    "fade_out_ms": 300
  },
  "slots": [
    {"position": 1, "source": "memorable_clip_1", "duration_ms": 2500, "transition_in": "cross_fade_500ms", "ken_burns": null, "overlay": null},
    {"position": 2, "source": "guest_pick_1",     "duration_ms": 3000, "transition_in": "cross_fade_300ms", "ken_burns": "push_left_to_right", "overlay": null},
    {"position": 3, "source": "guest_pick_2",     "duration_ms": 2500, "transition_in": "hard_cut",         "ken_burns": "zoom_in",            "overlay": null},
    {"position": 4, "source": "memorable_clip_2", "duration_ms": 3000, "transition_in": "cross_fade_400ms", "ken_burns": null, "overlay": "lower_third_caption"},
    {"position": 5, "source": "guest_pick_3",     "duration_ms": 2500, "transition_in": "swipe_right",      "ken_burns": "zoom_out",           "overlay": null},
    {"position": 6, "source": "memorable_clip_3", "duration_ms": 2500, "transition_in": "cross_fade_300ms", "ken_burns": null, "overlay": null},
    {"position": 7, "source": "guest_pick_4",     "duration_ms": 2500, "transition_in": "hard_cut",         "ken_burns": "push_right_to_left", "overlay": null},
    {"position": 8, "source": "memorable_clip_4", "duration_ms": 2500, "transition_in": "cross_fade_400ms", "ken_burns": null, "overlay": null},
    {"position": 9, "source": "guest_pick_5",     "duration_ms": 2500, "transition_in": "zoom_blur",        "ken_burns": "zoom_in",            "overlay": null},
    {"position": 10,"source": "memorable_clip_5", "duration_ms": 2500, "transition_in": "cross_fade_500ms", "ken_burns": null, "overlay": null}
  ],
  "outro": {
    "duration_ms": 1000,
    "type": "hashtag_card",
    "text_template": "#{couple_hashtag}",
    "background": "warm_blur",
    "fade_in_ms": 200
  },
  "total_duration_ms": 30000,
  "generated_at": "2026-05-09T14:22:11Z",
  "review_status": "auto_generated"
}
```

The template never specifies a specific music file — that gets paired at render time based on `music_pairing_categories` and `music_pairing_bpm_range` against the catalogue manifest.

### The generation loop

1. **Cowork** loads the schema above and the list of valid values for each enumerated field (transition types, ken-burns directions, color grades, etc.)
2. **Cowork** sends a prompt to Claude/Gemini: "Generate one reel template JSON conforming to this schema. Aim for a Bridgerton-feel, romantic-dramatic mood, with slow cross-fades and warm color grade."
3. **LLM** returns a JSON object
4. **Cowork** validates the JSON against the schema (all fields present, durations sum to 30,000ms, enums use valid values)
5. **Cowork** saves the validated template to `/Users/icecasasola/Documents/Claude/Projects/Setnayan/template_library/{feel_tag}/TPL_{nnn}.json`
6. **Cowork** repeats for the next template, varying the feel-tag and mood across the 6 music categories

500 templates ÷ 6 music categories ≈ 83 templates per category. Allow some overflow into multi-category-pairing templates.

### Generation distribution across feel-tags

| Feel-tag bucket | Count target | Notes |
|---|---|---|
| Bridgerton-feel templates | 80 | Slow cross-fades, dramatic builds, warm grade |
| Taylor-Swift-feel templates | 80 | Mid-tempo cuts, soft transitions, narrative arc |
| Michael-Jackson-feel templates | 80 | Beat-driven cuts, snappy transitions, vibrant grade |
| Jazz templates | 80 | Smooth dissolves, mellow grade, slower-paced |
| Sunday Morning Vibes templates | 80 | Gentle dissolves, warm-natural grade, unhurried |
| Hip Hop templates | 80 | Quick beat-match cuts, bold typography, neutral-cool grade |
| Multi-category / Crossover templates | 20 | Templates that fit 2+ categories — flex coverage |

### Template-generation prompt template (for Cowork to use)

```
You are generating a single reel template JSON manifest for a 30-second
wedding souvenir reel with 10 fixed slots (5 guest picks + 5 couple memorable clips).

Output ONE valid JSON object conforming to the following schema:
{schema_paste}

Constraints:
- total_duration_ms must equal 30000 (intro + sum(slots) + outro = 30000)
- intro_duration + outro_duration in [1000, 1500] each
- slot durations between 2200 and 3500 ms
- transition_in must be one of: ["cross_fade_300ms","cross_fade_400ms","cross_fade_500ms","hard_cut","swipe_left","swipe_right","zoom_blur","beat_match_cut","fade_to_white","fade_to_black"]
- ken_burns must be one of: [null,"push_left_to_right","push_right_to_left","zoom_in","zoom_out","static_with_breath"]
- color_grade must be one of: ["warm-cinematic","cool-editorial","vibrant-pop","mellow-natural","high-contrast-modern","soft-pastel","desaturated-doc","neon-night"]

Mood for THIS template: {mood_directive}
Pair with music categories: {music_categories}
Aim for {energy_arc} energy curve across slots.

Output only the JSON, no commentary.
```

For each generation, Cowork rotates through:
- mood_directive (e.g., "Bridgerton-feel, romantic-dramatic, slow burn with payoff")
- music_categories (one or two from the catalogue's 6)
- energy_arc (one of: "slow-burn-to-climax," "energetic-throughout," "warm-steady," "build-then-resolve," "crescendo-decrescendo," "anchored-by-couple-clips")

### Cost economics for template generation

| Per template | Cost |
|---|---|
| LLM call (Claude Sonnet or Gemini Flash, ~2K input tokens + 1K output tokens) | ₱0.50–₱2 |
| Validation (local JSON schema check) | ₱0 |
| Storage on disk | ₱0 |
| **Total per template** | **₱0.50–₱2** |
| **500 templates total** | **₱250–₱1,000** |

Use Gemini Flash or Haiku for the bulk of generations — at this scale the cost difference vs. premium models is real and the schema-conforming task doesn't need premium reasoning.

---

## 13. Template Library File Organization

```
/Users/icecasasola/Documents/Claude/Projects/Setnayan/template_library/
├── 01_bridgerton_feel/
│   ├── TPL_001.json
│   ├── TPL_002.json
│   └── ... (~80 files)
├── 02_taylor_swift_feel/
│   └── ... (~80 files)
├── 03_michael_jackson_feel/
│   └── ... (~80 files)
├── 04_jazz/
│   └── ... (~80 files)
├── 05_sunday_morning_vibes/
│   └── ... (~80 files)
├── 06_hip_hop/
│   └── ... (~80 files)
├── 07_crossover/
│   └── ... (~20 files)
├── library_index.json          ← master index, queryable by feel-tag, BPM range, energy arc
├── validation_log.txt          ← which templates passed/failed schema validation
└── render_test_log.json        ← results of placeholder-content render tests
```

`library_index.json` is the file the Setnayan backend loads at runtime to pick templates for couples. Shape:

```json
{
  "templates": [
    {
      "template_id": "TPL_001",
      "filename": "01_bridgerton_feel/TPL_001.json",
      "feel_tags": ["bridgerton-feel", "romantic", "dramatic"],
      "music_pairing_categories": ["bridgerton_feel", "jazz"],
      "music_pairing_bpm_range": [85, 100],
      "energy_arc": "slow-burn-to-climax",
      "color_grade": "warm-cinematic",
      "average_render_time_seconds": 38,
      "production_ready": true
    }
  ]
}
```

---

## 14. Template Curation & Validation

After all 500 templates are generated, run two passes:

### Pass A — Automatic schema validation

For every template:
- All required fields present
- Durations sum to 30,000 ms
- All enums use valid values
- All slots have unique positions 1–10
- No internal references break

Templates that fail validation are flagged in `validation_log.txt`. Re-generate the failures (typically 5–15% of an LLM batch) using a tighter prompt.

### Pass B — Render test with placeholder content

For a stratified sample of 50 templates (10 per category):
- Drop placeholder photos (Setnayan-supplied stock wedding photos) into the 5 guest-pick slots
- Drop placeholder couple-memorable clips
- Run the FFmpeg render pipeline
- Watch the output

Check for:
- Visual jank (transitions that look broken)
- Pacing problems (slot durations that don't read naturally)
- Color-grade applied correctly
- Text overlays in correct positions
- Total duration exactly 30 seconds

Templates with render-test issues get marked `production_ready: false` in the library_index. They stay in the library but the Setnayan runtime never picks them — they're available for future debugging/improvement.

### Outcome

- ~500 generated, ~470 pass schema validation (5–10% failure regenerated)
- ~400 marked `production_ready: true` after render test
- 400 production-ready templates is a massive library — more than 10× what competitors ship

---

## 15. Saturday Quick-Start (TL;DR — combined)

Music run (Saturday):
1. Sign up for Suno Premier at suno.com (~$30)
2. Open Chrome with Claude-in-Chrome extension connected to Cowork
3. Tell Cowork: "Let's start the music catalogue session — pilot batch first"
4. Cowork drives Suno using prompts from Section 4
5. Run pilot (60 min) → production blocks 1 + 2 → curate → done

Template run (Saturday late or follow-up day):
1. Tell Cowork: "Now generate the 500 reel templates per Section 12"
2. Cowork uses Claude/Gemini to generate templates against the schema
3. Validate, render-test, log
4. Done — both creative-asset libraries are live

---

## 16. V1 Starter-10 catalogue + beat-synced cut timing (2026-06-28)

> **Decision (owner-signed 2026-06-28):** rather than wait on the aspirational 600-track / 500-template run, ship Guest Stories on a **curated starter set of 10 owned tracks**. Generation method = **Suno** (per the locked "owned forever, no per-render license" principle — not a per-render or third-party-licensed source). The list + per-track beatmap is locked; only the audio render is pending a Suno session. This section is additive — the Section 5/6 manifest and Section 12 template schema still apply; the fields below extend them.

### 16.1 The 10 tracks

Two each in the wedding-heavy families, one each for the narrative and dance-floor moments. `energy` is the 5-point shape (intro → drop) that drives cut cadence. **Tracks are full-length (~60–120s); a 30s window is selected per track** (§16.6).

| # | Title | Category | Mood | BPM | Energy shape | Filename |
|---|---|---|---|---|---|---|
| 1 | Velvet Court | `bridgerton_feel` | romantic · dramatic | 95 | slow-build | `BR_001_95bpm_velvet-court.mp3` |
| 2 | Candlelit Vows | `bridgerton_feel` | intimate · tender | 88 | gentle-flat | `BR_002_88bpm_candlelit-vows.mp3` |
| 3 | The Story of Us | `taylor_swift_feel` | narrative · warm | 100 | verse-chorus arc | `TS_001_100bpm_story-of-us.mp3` |
| 4 | Dance Floor Gold | `michael_jackson_feel` | celebration · funk | 112 | beat-driven | `MJ_001_112bpm_dance-floor-gold.mp3` |
| 5 | After Hours | `jazz` | mellow · cocktail | 90 | steady-low | `JZ_001_90bpm_after-hours.mp3` |
| 6 | Manila Bossa | `jazz` | breezy · light swing | 105 | light-lift | `JZ_002_105bpm_manila-bossa.mp3` |
| 7 | Sunday Light | `sunday_morning_vibes` | soft · unhurried | 80 | unhurried | `SM_001_80bpm_sunday-light.mp3` |
| 8 | Paper Boats | `sunday_morning_vibes` | tender · fingerpicked | 76 | lullaby | `SM_002_76bpm_paper-boats.mp3` |
| 9 | Goldenhour Lo-Fi | `hip_hop` | head-nod · modern | 90 | groove-steady | `HH_001_90bpm_goldenhour-lofi.mp3` |
| 10 | Sa'Yo | `hip_hop` | energetic · drop-heavy | 120 | drop-heavy | `HH_002_120bpm_sayo.mp3` |

### 16.2 The 10 Suno prompts

Instrumental-only, sound-described, BPM + tempo arc baked in (per Section 5 prompt principles — never name an artist; the sound is the descriptor).

> **Length model = full-length tracks, windowed to 30s (model B, owner-locked 2026-06-28 — reverses the earlier "exactly 30s" lock).** Let Suno write a complete song (~60–120s) with a real chorus/hook, then point `best_30s_window_start` at the strongest 30 seconds. This sounds better than a forced 30s composition because the render runs over the section built to be the emotional peak. Append `, full-length song with a clear chorus/hook section, instrumental` to each prompt below. Window-selection rules live in §16.6.

1. **Velvet Court** — `String quartet cover of a modern pop melody, baroque chamber, romantic and dramatic, 95 BPM, instrumental, period-drama feel, soft pizzicato intro building to a full-bow climax then easing`
2. **Candlelit Vows** — `Harpsichord and string quartet duet, regency-era romantic, intimate, 88 BPM, instrumental, gentle steady dynamics, tender chamber, no big climax`
3. **The Story of Us** — `Acoustic pop instrumental with fingerpicked guitar, warm piano, and light strings, mid-tempo narrative, 100 BPM, instrumental, soft verse lifting to an emotional bridge swell`
4. **Dance Floor Gold** — `Funky pop instrumental, tight syncopated bassline, bright brass stabs, four-on-the-floor groove, 112 BPM, instrumental, danceable, punchy chorus drop, vibrant`
5. **After Hours** — `Smooth jazz piano trio, brushed drums, upright bass, mellow cocktail-lounge mood, 90 BPM, instrumental, relaxed steady swing, intimate late-night`
6. **Manila Bossa** — `Bossa nova instrumental, nylon-string guitar, soft shaker, warm vibraphone, breezy tropical, 105 BPM, instrumental, light swing, gentle lift in the chorus`
7. **Sunday Light** — `Warm folk instrumental, fingerpicked acoustic guitar, soft Rhodes, light ambient pads, unhurried Sunday-morning calm, 80 BPM, instrumental, gentle and airy, minimal dynamics`
8. **Paper Boats** — `Tender fingerpicked guitar with soft glockenspiel and subtle strings, lullaby-like, 76 BPM, instrumental, intimate and delicate, slow and steady, nostalgic`
9. **Goldenhour Lo-Fi** — `Lo-fi hip hop instrumental, dusty boom-bap drums, mellow Rhodes chords, vinyl crackle, warm head-nod groove, 90 BPM, instrumental, relaxed and modern, steady`
10. **Sa'Yo** — `Trap-soul instrumental, deep 808 bass, crisp hi-hats, emotive piano melody building to a hard beat drop, 120 BPM, instrumental, modern and cinematic, strong dynamic contrast`

### 16.3 Beatmap — manifest extension

Each track's `catalogue_manifest.json` entry (Section 6) gains a `beatmap` object, **computed once at ingestion** (open-source analyzer, e.g. `librosa` — owner sign-off open on the exact tool). Everything else in the Section 6 entry is unchanged.

```json
"beatmap": {
  "bpm": 95,
  "bpm_confidence": 0.97,
  "beats_per_bar": 4,
  "first_downbeat_ms": 410,
  "downbeats_ms": [410, 2936, 5463, 7989, 10515, 13042, 15568, 18094, 20621],
  "energy_samples": [
    {"t_ms": 0, "e": 0.18}, {"t_ms": 8000, "e": 0.41},
    {"t_ms": 16000, "e": 0.86}, {"t_ms": 24000, "e": 0.79}
  ],
  "sections": [
    {"label": "intro", "start_ms": 0,     "end_ms": 8000,  "energy": "low"},
    {"label": "build", "start_ms": 8000,  "end_ms": 16000, "energy": "rising"},
    {"label": "drop",  "start_ms": 16000, "end_ms": 30000, "energy": "high"}
  ],
  "analyzer": "librosa-0.10",
  "analyzed_at": "2026-06-28T00:00:00Z"
}
```

`downbeats_ms` is the load-bearing array — the only timestamps a cut is allowed to land on, and it spans the **whole** track. The Section 6 entry keeps the real `length_seconds` (~60–120) and a real `best_30s_window_start` (the ms offset of the chosen 30s window, snapped to a downbeat). `sections` cover the full track; the render clips to the window. See §16.6 for the windowing rules.

### 16.4 Beat-synced template — Section 12 extension

Templates may set `timing_mode: "beat_synced"` (default stays `"fixed"` so the legacy `duration_ms` slots keep working — beat-sync is opt-in per template). Beat-synced templates drop per-slot `duration_ms` and add a `cut_pattern`:

```json
"timing_mode": "beat_synced",
"cut_pattern": {
  "snap_to": "downbeat",
  "default_hold_bars": 1,
  "energy_response": {
    "low":    {"hold_bars": 2,   "transition": "cross_fade_500ms"},
    "rising": {"hold_bars": 1,   "transition": "cross_fade_300ms"},
    "high":   {"hold_bars": 0.5, "transition": "hard_cut"}
  },
  "downbeat_accent": "zoom_punch"
},
"slots": [
  {"position": 1, "source": "memorable_clip_1", "transition_in": "auto", "ken_burns": null},
  {"position": 2, "source": "guest_pick_1",     "transition_in": "auto", "ken_burns": "push_left_to_right"}
],
"min_slots": 3,
"target_duration_ms": "from_request"
```

> The per-slot `ken_burns` stub above is widened into a full `camera_move` object in **§16.9** (push / pan / roll / `orbit_feel` + auto-reframe + depth parallax) — the "filmed, not slideshowed" look the owner asked for. Default stays `null` (no move), so legacy templates are unaffected.

### 16.5 Render algorithm (deterministic — no per-render AI)

1. Couple picks a track + target duration (1–30s) → load that track's `beatmap`.
2. Start the playhead at `best_30s_window_start`; snap to the first `downbeats_ms` ≥ that point.
3. Per slot: find the `section` the playhead is in → read `energy_response[section.energy].hold_bars` → advance that many bars → place the cut on the next `downbeats_ms` entry. `transition_in: "auto"` resolves to that section's transition; a strong downbeat gets `downbeat_accent`.
4. Keep filling slots until accumulated time reaches `target_duration_ms`; clamp to `min_slots`.
5. Result: soft intros hold 2 bars; the drop cuts every half-bar — emergent from one track's beatmap, identical every render.

> ⚠ **Still pending the render layer.** The 10 prompts, the beatmap, and the `cut_pattern` are all data/spec you can lock now. The *visible* result (clips actually cutting on the beat in a downloadable MP4) waits on the Remotion/FFmpeg render pipeline, which does not yet exist in `apps/web` (see top-of-doc banner). Beat-sync adds **₱0** per render — the analysis is amortized once per track.

### 16.6 30-second window selection (model B)

Tracks are full-length; the render runs over a 30s slice. The window is chosen **once at ingestion** and stored as `best_30s_window_start` (ms offset). Rules:

1. **Pick the strongest 30s.** Usually the chorus/hook, or any section with its own mini arc (build → peak → settle). A person picks it during curation, or energy-peak detection on `energy_samples` suggests it (highest 30s rolling-average energy that still includes a lead-in).
2. **Snap the start to a downbeat.** `best_30s_window_start` must equal a value in `downbeats_ms` (or the nearest one), so cuts are on-beat from the first frame.
3. **Clean in and out.** The render applies a 0.5s audio fade-in at the window start, and either a fade-out at +30,000ms **or** lands the window end on a downbeat / section boundary so it never stops mid-phrase. Stored hint: optional `window_end_style: "fade" | "downbeat"`.
4. **Beatmap is window-relative at render time.** Only `downbeats_ms` and `sections` falling inside `[best_30s_window_start, best_30s_window_start + 30000]` are used; the §16.5 algorithm runs unchanged within that span. A shorter reel (1–29s) uses the same start with a shorter span.

Manifest impact: `best_30s_window_start` is a real per-track integer again (not 0); optionally add `window_end_style`. Everything else in §16.3 is unchanged.

### 16.7 Two soundtrack sources + two render paths (owner-locked 2026-06-28)

The couple picks one of two sources. The **same beat-sync cut engine** (§16.4–§16.5) drives both — only the render *location* differs, and that difference is a compliance boundary, not a UX one.

| | **Source A — Our music** | **Source B — Your music (upload)** |
|---|---|---|
| Catalogue | 1 of the 10 owned tracks | Couple uploads an audio file |
| 30s window | Couple scrubs + picks (default = our suggested `best_30s_window_start`) | Couple scrubs + picks the cut |
| Analysis | once at ingestion (server, librosa) | once on the couple's device (Web Audio API beat detection) |
| **Render location** | **server-side OR client-side** (we own the music — no restriction) | **client-side ONLY** (in-browser compositor) |
| Audio on our servers | yes (owned) | **never enters the server render pipeline** |

**Why the split (the load-bearing rule):** rendering copyrighted music server-side makes Setnayan the direct infringer (CLAUDE.md gotcha #1). Client-side render means the couple's **own device** composites and exports the reel — Setnayan never reproduces or distributes their uploaded song. That is the only compliant way to offer BYO music, and it **reverses the "BYO music in Personal Reels" V1-exclusion** (owner-accepted, eyes open).

**Transition vocabulary (both sources, chosen from energy):**

| Transition | When | `cut_pattern` mapping |
|---|---|---|
| **Crossfade** | soft / low-energy sections | `energy_response.low.transition = "cross_fade_*"` |
| **Hard cut** | on the beat, mid-energy | `energy_response.rising.transition = "hard_cut"` |
| **Pop** (scale/zoom punch) | strong downbeats / peaks | `downbeat_accent = "zoom_punch"` (a.k.a. "pop"), `energy_response.high` |

**Build implication (both still unbuilt, and they are DIFFERENT infra):**
- Source A server render → Remotion/FFmpeg on Workers (the pipeline tracked in [[project_setnayan_no_video_render_pipeline]]).
- Source B client render → an in-browser compositor (WebCodecs / `ffmpeg.wasm` / Canvas + MediaRecorder). Separate build; the uploaded audio stays on-device end to end.
- The cut engine (`beatmap` → `cut_pattern` → cut list) is shared code that runs in either location — write it once, render-target-agnostic.

### 16.8 Proposed build sequence (2026-06-28 — not yet owner-locked beyond the client-first principle)

Driving insight: **client-side render covers both sources**, so building the in-browser compositor first ships the whole feature with **zero server infra**; the server pipeline drops from blocker → later optimization. CC-time = Claude Code working sessions (not calendar); externals called out separately.

| Phase | What | CC-time | Infra |
|---|---|---|---|
| **0 · Foundation** | Shared cut engine (pure logic, unit-testable, no renderer) + librosa ingestion → `catalogue_manifest.json` + R2 CORS | ~1–2 | none (+ **owner Suno session** for the 10 tracks, calendar) |
| **1 · Live preview** | In-page player runs the cut list over photos + `<audio>` — beat-sync you can see/hear, no file. Both sources. First visible payoff | ~2–3 | none |
| **2 · Client render → MP4** | In-browser compositor (WebCodecs / `ffmpeg.wasm`) exports the reel on-device. **Both sources ship here**; BYO compliant (render never hits our servers) | ~4–6 | **none — feature ships** |
| **3 · Server render (optional)** | **FFmpeg-only on an Oracle A1 Always-Free box (₱0)** — optimization for weak devices / batch, and the always-on **Auto-Recap** path (no device present). **Owned (Suno) music only, never BYO.** Shares the box + the pure cut/command engine with the Auto-Recap prototype (`0012_papic/Render_Prototype_Oracle_30s_2026-06-28.md`; outputs capped at 30s). Remotion deferred — heavy on ARM. | ~3–5 | **owner: create the Oracle A1** (Always-Free, no monthly cost; capacity-contended — retry past "out of capacity") |

**Risk flag (Phase 2):** in-browser video encoding is fiddly on mobile — `ffmpeg.wasm` is heavy/slow on phones, WebCodecs support varies (mobile Safari is the long pole). Run a short encode spike on a mid-range Android **before** committing the full phase.

### 16.9 Camera-move layer — stills that feel filmed (owner-directed 2026-06-29)

**Goal:** a still photo (or a static / lightly-panning clip) should read as if a real camera glided around it — push-in, slow pan, a touch of roll — so a Guest Story built from photos feels *shot*, not slideshowed. This is the "Vids AI · Reels Video Editor" effect the owner flagged (their App-Store ad: a flat "Before" still → a moving, camera-circling "After"). It is the produced-output moat for Stories — the thing that makes our reels look premium without a per-render bill.

**Honesty note — what this is and isn't.** It is **not** a true 360° orbit. One photo can never reveal an angle it didn't capture (the back of a head, a new side). What the ad does — and what we copy — is a **fake-depth camera move**: virtual push-in + 2.5D parallax + auto-reframe, which *together* read as a circling camera. A real orbit needs generative image-to-video — expensive, billed per render, and it breaks the "template-driven render, no per-render AI" lock (CLAUDE.md). We ship the cheap deterministic illusion, never the generative orbit.

**This is an enrichment of the existing `ken_burns` slot field, not a new system.** §16.4 already reserves `ken_burns` per slot — today a one-move stub (`"push_left_to_right"`). We widen that one string into a `camera_move` object the **shared, render-target-agnostic cut engine** (§16.7) reads. Beatmap, `cut_pattern`, and the two render paths are all unchanged.

```json
"slots": [
  {
    "position": 2,
    "source": "guest_pick_1",
    "transition_in": "auto",
    "camera_move": {
      "type": "push_in",        // push_in | pull_out | pan_l | pan_r | pan_u | pan_d | roll_cw | roll_ccw | orbit_feel
      "amount": 0.12,            // 0–1 — how far the move travels over the slot's hold
      "ease": "in_out",         // linear | in_out | accel
      "auto_reframe": true,      // keep the detected subject centred as the camera moves
      "parallax": "subtle"       // none | subtle | strong  (needs a depth map — see cost tiers)
    }
  }
]
```

- **`orbit_feel`** is the headline preset = `push_in` + a small pan + `parallax:"strong"` + `auto_reframe`. That combination is what produces the "camera circling the subject" look the owner pointed at.
- **Beat-sync composes for free.** `downbeat_accent:"zoom_punch"` (§16.4) still fires on top: the camera *glides*, and on a strong downbeat it *punches* the zoom. Glide + on-beat punch is the whole feel — two existing fields cooperating, no new machinery.

**Three cost tiers (mirror the §16.7 render-location split):**

| Tier | What it adds | When computed | Marginal cost |
|---|---|---|---|
| **1 · Camera move** | push / pan / roll / ease + on-beat zoom punch | per render, pure math | **₱0** — deterministic in the shared cut engine |
| **2 · Auto-reframe** | subject detection keeps the person centred | **once per photo at ingest** | **₱0 recurring** — self-hosted OSS detector, one pass on upload |
| **3 · Depth parallax** | foreground/background separate → the 2.5D "orbit" depth | **once per photo at ingest** (store a depth map) | **₱0 recurring** — self-hosted OSS depth model on upload |

The **recurring per-render cost stays ₱0 at every tier.** The only spend is one-time compute when a photo is first ingested, and that runs on self-hosted OSS (no API, no license, no per-photo fee) — consistent with [[project_setnayan_marginal_cost_model]] and the OSS-self-host preference.

**Where it runs — NOT blocked by the dead server pipeline.** The camera move is shared, render-target-agnostic code, exactly like the cut engine (§16.7). It runs **client-side**, so it's **visible in the Phase-1 live preview** (§16.8) and ships in the **Phase-2 client render** with zero server infra. Tier 1 needs no ingest work and can be prototyped immediately; Tiers 2–3 light up `auto_reframe` / `parallax` once the ingest depth + subject pass exists. **No new phase, no new infra** — it folds into the §16.8 sequence (P1 preview shows Tier-1 moves over photos; P2 bakes them into the MP4; Tiers 2–3 are an ingest-side add that never touches the render path).

[Open this playbook](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan/14_Music_Catalogue_Cowork_Playbook.md)

[Open the Paparazzi feature spec for context](computer:///Users/icecasasola/Documents/Claude/Projects/Setnayan/10_Papic_Feature_Specification.md)

---

**End of playbook.** See you Saturday.
