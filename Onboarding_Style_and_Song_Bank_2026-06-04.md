# Onboarding Style Steps + Song Bank — Session Consolidation (2026-06-04)

> Single-source merge of this session's decisions + prototype changes on the wedding-onboarding flow.
> **Prototype:** `Onboarding_Wedding_Flow_2026-06-01.html` (style steps 4–6 + the Music → Song Bank step).
> **Prototype-first** (built + verified): folds into iterations **0016** (onboarding) and **0022** (vendor
> dashboard / performer repertoire) once the two open decisions in §7 lock. DECISION_LOG rows appended same
> day; durable model captured in memory `project_setnayan_song_bank_model`.

---

## 1. Date step — "What your dates share" (already in file)
The callout renders **under the headline** (`viewzone`); the calendar is bottom-anchored (`tapzone`, `margin-top:auto`) so it **stays grounded** as the callout changes height. Shipped 2026-06-03 (commit `36c8917`); re-verified this session (callout y≈201, calendar top identical at 1 vs 4 dates).

## 2. Photo & Video — "Your look" (SHIPPED · verified no-scroll)
- Full-row **photographer hero removed**.
- Concepts → a **swipeable photo carousel** (Photojournalistic · Classic · Editorial · Fine-art · Cinematic) — each card *is* its photo, uniform size.
- "What's included?" **split into two uniform-chip groups**:
  - **Coverage** — Pre-nup · Save-the-date · Wedding day · After-party
  - **Deliverables** — Same-day edit · Drone · Album · Raw files
- "What do you need?" → uniform 3-up (Photo + Video / Photo only / Video only).
- Every chip identical height + width; whole screen fits one viewport.

## 3. Set the mood — feel carousel (SHIPPED)
- Feels (Timeless → Filipiniana → Others) run in a **filling photo carousel** ("the photo will show"), uniform cards.
- Color swatches repaint per selected feel; "Others" → mood-board note.
- The per-budget-tier mood **hero** is dropped in favor of the carousel (open §7.5 — restore it alongside?).

## 4. Shared pattern
One treatment across the visual style steps: a **horizontal photo-card carousel** for the visual choice + **uniform equal-width/height chip grids** for the structured choices. Keeps every style step to one page.

## 5. Music → "Song Bank" (SHIPPED)
### 5.1 UX (in prototype)
- **Search-driven** (no list dump): type → matches under "Tap to add" with **+**; saved list with **×** to remove.
- **No min / no max** — "add as many as you like, or none." Continue always enabled. (Retires the old "pick ≥10" gate.)
- Title + artist on every row.
- **Per-song 30-sec preview** — tap the **album cover** to play, tap again to stop, one at a time; cached per song.
- **Album-cover play button** — the cover (iTunes `artworkUrl`) IS the play surface, with a ▶/⏸ overlay; covers hydrate lazily (debounced, capped per pass) + cache per song; branded gold placeholder until loaded.
- **Layout: results on top, search bar pinned at the BOTTOM** (mirrors the location screen, screen 7) — the list scrolls internally (`max-height` cap) so the search never gets pushed off-screen.
- **Throttle / network → "give it about a minute" notice** (not cached → it retries); genuine no-clip → quieter "no preview on file"; covers skip silently when throttled.
- Curated **seed list grown to 390 songs** — PH OPM (classics + current/2020s) + deep **Taylor Swift** + **Bruno Mars** (incl. *Risk It All*, his 2026 wedding ballad) + golden classics + the **latest TikTok-era first-dance** staples (Lord Huron, Cigarettes After Sex, Hozier, Arctic Monkeys, Miguel, JVKE, The 1975…). **0 duplicates, 0 malformed** (verified).

### 5.2 Preview tech — LOCKED
- Source = **Apple / iTunes Search API** — keyless, no login. **One lookup returns BOTH** the 30-sec `previewUrl` (plays in `<audio>`) **and** `artworkUrl` (album cover) — covers + preview from a single call.
- **Spotify rejected** for inline preview (full playback needs Premium login/OAuth; `preview_url` restricted for new apps).
- **YouTube rejected** for inline preview (Data-API search ≈ **100 lookups/day** free quota; ToS requires showing the player + ads). Optional future complement: a zero-cost **"Watch on YouTube" deep-link** per song. Not built.
- **Legal:** previews are Apple-hosted clips we neither host nor license → fully consistent with the locked **"owned-AI-music-only for RENDERS"** rule (renders use Pakanta / owned catalogue; previews are taste/reference only).
- **Scaling (1000+ users):** playback is unlimited (Apple CDN); only the **lookup** is ~20/min/IP. Client-side calls spread across users' IPs; per-song cache = one lookup per song. **Production: cache `previewUrl` (+ track id + artwork) in our DB on first lookup** → near-zero live calls (wedding songs repeat heavily). Throttle is handled gracefully in-UI.

### 5.3 Lyrics — NOT included (decided)
- iTunes returns metadata + artwork + preview, **but not lyrics**.
- Lyrics are separately copyrighted (publishers) → a **licensed, paid** feature: **Musixmatch** (free tier ~30% partial; full = paid commercial license), **Genius** (link-out only, no inline text per ToS), community DBs (LRCLIB — free but unlicensed/gray).
- **Decision: skip inline lyrics** — the 30-sec preview already confirms the song; lyrics add cost for little gain at this step. If ever wanted, a zero-cost **"View lyrics" deep-link** (Genius). *(Pakanta custom songs are different — those lyrics are owned.)*

## 6. Song Bank DATA MODEL — performer-sourced (the lock)
- The Song Bank is **OURS but performer-sourced**: the **de-duplicated UNION of every performer's repertoire**.
- Each performer (band / singer / DJ) keeps their own song list on their **vendor profile (0022)**.
- A song enters the bank the moment **any** performer lists it → **every bank song is performable** → picking a song surfaces the band(s) who do it. We own the aggregate; performers fill it. Self-growing, self-cleaning. **"We only have what they listed."**
- The **390-song hand list = the SEED** (founding repertoire) so the bank isn't empty at launch.

### 6.1 Canonical song identity — the linchpin
- Resolve every performer-added song through Apple/iTunes to a **canonical track ID** (or ISRC).
- One step delivers: **auto-dedup** (same track id = same song however typed) + **free 30-sec preview + artwork** + a clean bank.
- Bank entry = canonical track; each maps to the performers who do it.
- **Governance = the existing taxonomy-governance pattern** (propose → match-to-existing / accept-as-new).

### 6.2 Three distinct music layers (never conflate)
1. **Performer Song Bank** — ours, performer-sourced (this doc).
2. **Couple taste picks / mainstream reference** — the onboarding picker; iTunes preview just to agree "which song."
3. **Render music** — owned-AI / Pakanta (0036) backing tracks for Setnayan-made video. **Separate; untouched.**

### 6.3 Licensing
- Performer **originals**: clean. Performer **covers**: the performer represents the recording rights (mechanical/cover) — goes in vendor terms, like any vendor-uploaded content.

## 7. OPEN decisions (owner)
1. **Dedup key** — Apple track ID (recommended; we already use it for previews) vs normalized title + artist.
2. **Couple wants a song NO band performs yet** — (a) allow as a **"wish"** (flagged "no band yet — we'll match one") or (b) restrict couples to bank songs (every pick performable). *Earlier lock: couples can list as many as they want.*
3. **Photo/Video concepts** — add Light & airy · Dark & moody · Korean-style · Documentary (need photos → Recraft).
4. **Set the mood** — keep carousel-only, or restore a big per-budget-tier mood hero alongside?

**Resolved this session:** Song Bank layout → **results on top, search pinned at the bottom** (done, mirrors screen-7). Lyrics → **skipped** (licensed/paid; deep-link option) — §5.3. Album covers → **shipped** (iTunes `artworkUrl`).

## 8. Where it lands (corpus — folds in when §7.1–7.2 lock)
- **0016** (onboarding): style-step carousel/uniform pattern + Song Bank search/preview/album-cover UX (results-on-top · bottom-pinned search) + 390 seed.
- **0022** (vendor dashboard): performer **"My Repertoire"** screen → feeds the shared bank; canonical-track resolution on add.
- **New schema note** (when locked): `canonical_song` (keyed on `apple_track_id`/ISRC, cached `preview_url` + `artwork`) + `performer_song` join (performer ↔ canonical_song). Bank = the union view.
- **0036** (Pakanta) + the owned music catalogue: unaffected (render-music layer stays separate).

## 9. Status
Prototype: **shipped + verified** (no-scroll, no console errors, preview + **album covers** work incl. throttle, **390 songs** clean, **results-on-top / bottom-pinned search**). Model: **locked conceptually**, 2 load-bearing decisions open (§7.1–7.2). Iteration-spec folding: pending those.
