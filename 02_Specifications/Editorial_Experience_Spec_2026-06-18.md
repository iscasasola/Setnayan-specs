# Editorial Experience Specification
**Date:** 2026-06-18
**Surface:** Couple website `/[slug]` — Editorial phase (post-wedding)
**Audiences:** Couple · Guests · Vendors
**Depends on:** Schedule (0000) · Papic (0012) · Coordinator role (0022) · Kwento · Alaala services

---

## 1. What the Editorial Is

The Editorial is the fourth and final phase of the couple's wedding website. It activates after the wedding day and lives permanently at `/[slug]`. It is not a photo gallery, not a guestbook, not a social feed.

It is a **curated publication** — a front-page newspaper assembled from everyone who was present, written in their words, illustrated by their captures, and closed by the couple's own voice and music.

**Owner-stated soul:** *"The front-page story of your life."* Like Harry Potter's newspaper — it holds moments, not just photos. Where Papic, Panood, and Kwento come to rest.

---

## 2. How It Runs — Full System Flow

### 2.1 Before the Wedding
- Couple pre-loads the schedule with named moments and planned times
- Papic seats are claimed; paparazzi are briefed
- Website has already run through Save the Date → RSVP → Event phases

### 2.2 Day Of — The Schedule Tapper
The coordinator (or couple) holds a QR code that opens the schedule tapper — a single-purpose screen showing the day's planned moments. One tap marks the current moment as active. All Papic captures from that point forward are automatically bucketed into that moment until the next tap.

**Access:** QR code only. Both the coordinator and couple hold one — natural backup if the coordinator steps away.

**Trigger for Plan B:** No taps detected by end of wedding day.

### 2.3 Post-Wedding — Content Collection

The system runs one of three plans per moment depending on what happened:

**Plan A — Coordinator tapped**
1. Captures are bucketed by moment window
2. Every Papic seat that filmed during a moment receives a targeted prompt: *"You captured [moment name]. What did you see?"*
3. 3-answer cap per moment — once 3 people respond, the moment stops receiving new prompts
4. Couple curates — picks which responses make it into the editorial

**Plan B — No coordinator taps**
1. System notifies Best Man and Maid of Honor
2. They open a shared assignment board: list of moments on the left, guest list on the right
3. For each moment they assign 1–3 people who they know were present and can write about it
4. Self-assignment is allowed
5. If one assigned person answers, the moment is closed — the other assignees are released
6. Assigned people receive the same targeted prompt as Plan A

**Plan C — No one acted**
The 10 locked moment slots auto-fill with the best available Papic captures from the general pool. No write-ups, but the slots are never visually empty.

### 2.4 Assembly
Once content collection closes (configurable window, default 72 hours after wedding day):

1. Masthead auto-generates from event data
2. 10 locked moment slots fill in — write-ups + attributed captures where available, auto-filled photos where not
3. Additional schedule-driven moments appear only if the coordinator tapped them
4. "What They Said" assembles from curated guest, vendor, and parent responses
5. Alaala services showcase builds from availed services
6. Couple reviews, reorders sections, writes their closing words
7. Couple approves → editorial publishes
8. PDF generates (2-page max)
9. Website phase flips from Event to Editorial permanently

---

## 3. The 10 Locked Moments

These slots are always present in the editorial template regardless of whether the tapper was used or anyone wrote a message. Auto-filled with Papic captures as the floor; write-ups as the ceiling.

### Ceremony
1. Bridal March
2. Exchange of Vows
3. Veil & Cord (Yugal)
4. First Kiss
5. Leaving the Church

### Reception
6. Cocktail Hour
7. Newlywed Entrance
8. First Dance
9. Cake Cutting
10. Money Dance (Pera-Pera)

### Schedule-Driven Only
These appear only when the coordinator taps them or the couple adds them manually:
Father-Daughter Dance · Arras · Exchange of Rings · Grand Exit · Cotillion · Toast / Speeches · any custom moments

---

## 4. Content Rendering Per Moment

Each moment slot adapts to whatever content is available:

| Content available | How it renders |
|---|---|
| Nothing | Moment name + a pull from the general gallery as placeholder |
| Auto-fill only (Papic captures, no write-up) | Moment name + best available photo or looping clip |
| Write-up only | Drop-cap text treatment + attributed photo if one exists |
| Write-up + captures | Full newspaper spread — photo dominant, write-up beside it |
| Multiple write-ups | Curated by couple — one primary, others as pull-quotes |

---

## 5. "What They Said" — The Three Voices

Not a flat pile of quotes. Three distinct voices with different weight and placement:

**Parents**
Highest weight. Large type, center placement, full attributions. If both sets of parents contributed, they each get their own block.

**Best Man + Maid of Honor**
Named, bylined. Their words appear near the moments they're most associated with (ceremony moments). Distinguished from general guest quotes by role badge.

**Guests**
Personal, emotional, "I was there" perspective. Pull-quote treatment in a 2-column masonry. Attributed with name and role at the wedding.

**Vendors**
Professional perspective — "here's how I worked with this couple / what this wedding meant to me." Appears near the "Team Behind the Day" section. Pro/Enterprise vendors get their logo + link to their marketplace profile. Plain credits for free vendors.

**Setnayan**
Auto-generated editorial note from event data. Appears near the masthead or colophon — a publisher's stamp, not a personal message. Format: *"Setnayan helped coordinate X vendors, captured Y photos, and planned Z services for this day."*

---

## 6. Alaala Services — "What We Made Together"

Not a chip strip. Each Setnayan service the couple availed gets a memory card showing the actual artifact produced:

| Service | What shows |
|---|---|
| Monogram | The actual monogram rendered large |
| Pakanta | Song title + play button — also closes the editorial |
| Save the Date | Thumbnail of the render they sent |
| Panood | A still from the stream + "Watch the Film" link |
| Papic | Photo count + best captures (feeds the gallery sections) |
| Personal Reels | A few guest reels as short looping previews |
| Patiktok | Short-form clip preview |

Only availed services appear. No empty placeholders for services not purchased.

Section name: **"What We Made Together"**

---

## 7. The Locked Close

The editorial always ends the same way. Non-negotiable. Couple-reorderable for everything above; only the close is fixed.

1. **Couple's words** — written by the couple during the editorial assembly step. No auto-generation. Their voice, their close.
2. **Their song** — either the song they uploaded for their Save the Date or their Pakanta. These are the only two options. No new upload. Keeps the couple's musical identity consistent across all Setnayan outputs.

The locked close is a Setnayan signature. Every editorial on every `/[slug]` ends this way.

---

## 8. The Print — 2-Page PDF

> **🔒 FORMAT LOCKED 2026-07-04 (owner): print size = A3, full page.** The keepsake is a broadsheet: "page 1" = the FRONT of the A3 sheet (always full), "page 2" = the BACK (conditional, never half-empty). All rules below apply at A3. Clips print as poster frames; an animated monogram prints as a clean representative frame — the QR is the bridge back to the moving version.

### Rules
- **Page 1 always ships, always full.** If content is thin, the layout expands — larger hero, bigger type, moments given more room. Never sparse, never stub-like.
- **Page 2 appears only when content warrants it.** Never a half-empty second page.
- **Maximum 2 pages.** Rich content gets curated down. Priority order when trimming:
  1. Hero photo + headline (never cut)
  2. The 10 locked moments (never cut, minimum treatment)
  3. Couple's lead paragraphs (truncated if needed)
  4. What They Said — top 3 curated by the couple
  5. Alaala services — availed only, most significant first
  6. Vendor credits — Pro/Enterprise first, rest collapsed
  7. QR colophon — always the last element on page 2

### Page Layout

**Page 1 (always):**
Masthead → monogram → "The [Name] Chronicle" nameplate → dateline (Vol./No. · city · wedding date) → hero photo → headline + deck → lead article (2-column, drop-cap) → the 10 locked moments (compact treatment if content is rich)

**Page 2 (when content warrants):**
Additional schedule-driven moments → What They Said → Alaala services showcase → Team Behind the Day (vendor credits) → Setnayan colophon → QR code

### The QR
Links back to the living editorial page. The PDF is the curated highlight; the living page is the full uncut story — video clips, moving frames, the complete What They Said, every Alaala artifact. The QR bridges physical and digital permanently.

> **✅ SHIPPED 2026-07-04 (slice A · repo PR):** the A3 broadsheet **print route** `apps/web/app/[slug]/print/` is live — a print-first render of the editorial. Front always full (masthead → still monogram → nameplate → dateline → hero → headline+deck → 2-col drop-cap lead → compact moments grid); a **conditional back** prints only when ≥2 of {>6 media-bearing chapters, ≥3 Kwento wishes, ≥3 reviews, ≥4 vendors, ≥3 Alaala services} hold (`keepsake-layout.needsBackPage`), else the close + QR colophon sit on the front. `@page { size: A3 portrait; margin: 0 }` with an ~11mm safe inner margin (consumer printers can't full-bleed). Clips print as poster frames with a "scan to watch" caption; animated monograms render STILL. QR (existing `lib/qr renderUrlQrSvg`) encodes `www.setnayan.com/[slug]`, always the last element on the last side; free-tier keeps "Powered by Setnayan", PRO drops it (same `COUPLE_WEBSITE_PRO` check as the editorial colophon). Same visibility gate as the editorial (`canViewSlugEvent`) + a phase gate that lets hosts preview pre-event. A quiet screen-only "Print the keepsake" affordance was added to the editorial colophon. **PDF-download generation = follow-up slice** (browser Print / Save-as-PDF is the V1 path). Samples (`/realstories`) are not yet wired (they have no real event slug → would need a `/realstories/[slug]/print` route).

---

## 9. The Experience Per Audience

### 9.1 For the Couple

The couple didn't write this. Everyone else did. Their role is **editor, not author** — they curate what makes it in, they write the close, they approve publication.

**What they experience:**
- Their wedding seen through everyone else's eyes — the bridal march as their father saw it, the money dance as their college friends experienced it
- Editorial control without authorship burden — they decide what's in, not what to write
- The PDF is their first physical artifact from their digital Setnayan wedding
- The edition number is permanent — Vol. I, No. 4. Theirs forever
- The QR means it never goes stale — scan it in 10 years and the living page is still there

**The feeling:** *"Everyone who loved us wrote us into history."*

---

### 9.2 For Guests

They contributed something that got published. Their name is in print, attached to a moment they witnessed. They are not just attendees — they are contributors to the historical record of this wedding.

**What they experience:**
- Their write-up has a byline — permanent credit in the editorial
- They can read what others wrote about the same moment — 3 perspectives on the bridal march, all different, all true
- Their Papic captures appear in the sections they helped create
- Personal Reels they made are featured in "What We Made Together"
- The PDF gives them something physical from a wedding they attended — most guests leave with nothing
- For Best Man and MoH — credited as editorial contributors, not just listed in the program

**The feeling:** *"My words mattered. I helped tell this story."*

---

### 9.3 For Vendors

Their work is published editorially — not just listed in a credits line. The editorial becomes the most authentic marketing they can have: their best work, shown in the context of a real wedding, attributed to them by name.

**What they experience (Free tier):**
- A credits line — name, category, a link to their profile if they're verified

**What they experience (Pro / Enterprise):**
- A vendor column — up to 200 words written by them about this wedding, their process, what it meant to them
- Their logo, their name, a link to their marketplace profile
- The column appears on their own vendor portfolio page as *"As featured in [couple]'s wedding"*
- Every future couple browsing Real Stories sees their work featured in context — editorial placement that wedding magazines charge ₱50,000/page for, included in their Pro subscription
- A clear, visible, concrete reason to upgrade beyond "more analytics"

**The feeling:** *"This is my best work. Published. Other couples will find me through it."*

---

## 10. What Makes This Genuinely Unique

No other wedding platform does this combination:

**1. Schedule → moments → prompts chain**
The live coordinator tap directly produces the post-wedding editorial. One product, a continuous thread from planning to keepsake. No other platform ties live event coordination to post-event content collection this way.

**2. The locked close**
Every editorial ends with the couple's words and their own music — Pakanta or STD song, nothing else. A Setnayan signature ritual. Creates a reading experience that's distinctly ours.

**3. The edition number**
Vol. I, No. X. Your wedding is a permanent numbered edition in the Setnayan archive. There is a community of Vol. I couples. That is identity, not just a timestamp.

**4. The QR on the printout**
Physical-digital bridge. You frame the PDF on your wall, a guest scans it 3 years later, the living editorial opens — with video clips, the moving frames, the full story that couldn't fit in 2 pages.

**5. Vendor columns as portfolio**
Vendors don't just get credited — they get published. That distinction is the entire Pro upgrade pitch made visible, on the day their best work is on display.

**6. Multi-perspective journalism**
The bridal march has 3 different write-ups from 3 different people. You read the vows through the Best Man's eyes and the mother of the bride's eyes simultaneously. No gallery does this. No guestbook does this.

**7. Content that writes itself**
The schedule tapper → moment buckets → targeted prompts chain means the editorial assembles from people who were actually there, prompted about what they actually witnessed, without the couple having to solicit anything manually.

---

## 11. The Product Bet

**The schedule tapper has to be easy enough that coordinators actually use it on the day.**

If coordinators don't tap, moment-attribution doesn't fire, targeted prompts don't go out, and the editorial falls back to Plan B or Plan C. The experience degrades gracefully — but the full magic only happens when Plan A runs.

The tapper screen is the most critical 2-second interaction in the entire editorial flow. It must be so simple that a coordinator managing a chaotic wedding day still reaches for it.

**Tapper screen requirements:**
- Opens via QR scan — no login, no navigation, instant
- Shows the day's planned moments as a vertical list
- One large tap per moment to mark it live
- Active moment highlighted clearly — coordinator always knows where they are
- An "Add unplanned moment" button for things not on the schedule
- Works offline — queues taps and syncs when signal returns

The whole editorial experience is only as good as this screen.

---

## 12. Open Decisions

- [ ] What is the time window for content collection before assembly closes? (default proposed: 72 hours)
- [ ] Can the couple reopen content collection after the editorial publishes?
- [ ] Does the "What They Said" Setnayan voice require admin copy input or is it fully auto-generated?
- [ ] Vendor column character limit (proposed: 200 words)
- [ ] Can parents of either couple contribute a column (not just a quote)?
- [ ] Is the PDF generated on demand or pre-generated on publish?
