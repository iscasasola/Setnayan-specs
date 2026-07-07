# Kwento — The Narrative Infrastructure Layer
## Monumental Upgrade Study · 2026-06-18

> **Status:** Design spec · no code yet. Written against the current ~90%-shipped Kwento foundation (`photo_messages` + Kwento Magazine + Auto-Recap voices). Every proposed addition is a net-new layer on top of shipped infrastructure — nothing retracts or replaces what exists.
>
> **Why "monumental":** Kwento today is a feature — a message box attached to a photo. This upgrade makes it the **narrative infrastructure** of the entire event: the journalism layer that turns 2,000 Papic captures into a story the couple can read, the editorial can publish, and the event can feel.

---

## Part 1 — The Central Insight

Every Filipino wedding is covered by 200 journalists who don't know they are journalists.

The lola who watched the bridal march from the third pew, eyes welling up — she is the only person alive who can describe exactly what she felt in that moment. The best man who watched the groom's face when the church doors opened — his account of those three seconds is irreplaceable. The college friend who caught a joke in the hallway between the ceremony and the reception — that story dies in a Messenger bubble unless someone captures it.

Right now, that collective witness memory disperses the morning after. It goes into Facebook posts, Viber threads, group chats — and within a week it is gone. No photographer's gallery, no matter how stunning, contains what 200 people *said to each other* while watching the couple.

**Kwento's job is to catch that memory before it disperses.**

The shipped foundation (≤280-char message anchored to a photo, couple review queue, Live Wall lower-third) is the correct architecture. The moat is the words-to-film pipeline — when the render infrastructure arrives, guest stories bake into the SDE and Thank-You film on owned Pakanta music. That remains the uncopyable ceiling.

This upgrade is the floor between where Kwento is and that ceiling.

**The shift:** from a message box → to a narrative system. Three surfaces it upgrades:

| Surface | Before | After |
|---|---|---|
| **The couple** | Reads 12 discrete messages in a queue | Sees their entire wedding reconstructed from every angle |
| **The editorial** | 10 locked moment slots auto-filled with best photos | Each slot has a photo AND a human story as its journalism text |
| **The event** | Post-capture, couple-mediated | Participatory live journalism — the wedding is being narrated in real time |

---

## Part 2 — The Three Voice Depths

The core upgrade. One schema change (`photo_messages.voice_depth` + new `kwento_columns` table), three radically different use cases.

### Flash ≤50 characters
**The Live Wall format.** A raw reaction, captured in the moment the photo was taken.

- "She was crying before he even arrived."
- "Lola has been waiting 40 years for this."
- "Nobody told Kuya Bert what to do and he did everything."

**Surface:** Live Wall lower-third caption. SDE title card over the clip. This is what plays on the venue projection. This is what guests on the other side of the room read.

**Prompt:** Immediate — the camera shutter closes and the prompt fires: *"One line. What just happened?"*

**Who writes it:** Anyone with a Papic or Disposable Camera session. Zero friction. The Flash prompt is unavoidable, dismissible in one tap.

**Why it matters:** A wedding is 8 hours. The Live Wall today shows photos with names. The Live Wall with Flash Kwentos reads like a real-time news feed. The energy in the room changes when guests see their words appear on the projection five seconds after they wrote them.

---

### Story ≤280 characters *(current shipped format)*
**The behind-the-photo truth.** The chismis. What the photo doesn't show.

- The photo shows the groom smiling at the altar. The Story says: "He was shaking so hard his bestman had to put a hand on his shoulder to stop him."
- The photo shows the couple cutting the cake. The Story says: "Maria kept laughing because Juan forgot which hand to cut with."

**Surface:** Couple's review queue → Magazine pull-quote → Auto-Recap voices section.

**Prompt:** Appears after Flash submission, or as the primary prompt for Story-only moments.

**No change to the current model.** This is the shipped ≤280-char `photo_messages` experience.

---

### Column 200–400 words *(new · invite-only)*
**The editorial guest piece.** The byline article. The lola's account of the bridal march. The best man's professional opinion of the first dance. The florist's story of how she interpreted the brief.

- Not a caption.
- Not a guestbook entry.
- Not a Facebook post.
- An authored piece with a byline, attached photos from their Papic captures, and a perspective only *they* could have.

**Surface:** The Alaala editorial page — a full scrollable section. The couple's print magazine. The vendor's portfolio page.

**Who writes it:** Couple-selected contributors. The couple hand-picks which guests and which vendors get invited. The guest logs in via their existing RSVP account — no new signup. The vendor writes from their dashboard.

**Prompt:** Post-wedding, via a nudge ("Maria and Juan want your story from the bridal march"). The couple uses the Assignment Board (Part 4) to decide who covers what before the day.

**Word cap enforced:** 400 words. Not 401. The discipline is editorial.

---

## Part 3 — For the Couple: The Reconstruction Layer

### 3.1 What the couple can't see

A couple at their own wedding is never *watching* their wedding. They are in it. They are saying vows, greeting guests, cutting cake, being the subject of 200 cameras. They cannot be in two places at once. They cannot see:

- What Tito Randy whispered to their dad at the cocktail hour
- What happened at table 7 while they were doing the photo wall
- How guests reacted during the first kiss from the back of the church
- The exact moment their flower girl realized she was walking the wrong way

These are the moments the couple mourns, post-wedding. "I wish I could have seen that." Kwento is the answer.

### 3.2 The Moment Density Map

New couple-side surface in the Alaala hub.

Every photo in the gallery gets a Kwento density score: `COUNT(photo_messages) WHERE photo_id = ?`. Photos with 3+ Kwentos surface differently — a small dot indicator in the gallery, a dedicated "Most storied moments" row.

**The density map reveals what mattered most to your guests.** The photo the couple thinks is the best shot of the night might have zero Kwentos. The photo they almost deleted — the one where everyone's back is turned — might have six, because something happened right before the shutter clicked that only the room knows.

That photo with six Kwentos? That's your editorial cover. That's your SDE opening shot. That's the moment your guests chose for you.

**Surfaces:**
- `Alaala hub → Most storied moments` row (query-only, no new table)
- Gallery view: density dot on any photo with 3+ Kwentos
- Editorial assembly: default to highest-density photo per locked slot when no assignment exists

### 3.3 The Time Reconstruction

Every `photo_messages` record has a `created_at`. Every Papic photo has a `captured_at`. Together, these reconstruct the event timeline from the guest perspective.

New couple surface: **Event Timeline tab** in the Alaala hub. A chronological scroll of every Kwento written during the event, sorted by `captured_at` of the parent photo. The couple reads their wedding as it happened — hour by hour, through the eyes of their guests.

10:47 AM → "She was shaking at the mirror but she said it was the bouquet."
11:02 AM → "Lola was the first person to cry."
11:14 AM → "The flower girl walked the wrong way and nobody noticed except the front row."
11:15 AM → "Actually everyone noticed."

This is not a photo gallery. This is a narrative reconstruction of the day. Nothing on the market does this.

---

## Part 4 — The Assignment Board

### 4.1 The problem with passive Kwento collection

The current model is broadcast: guests can write stories if they want to. The editorial then auto-fills from whatever was written. The result: the bridal march might have 0 Kwentos because nobody thought to document it. The money dance might have 12 because it's inherently shareable.

The editorial locked slots (Bridal March → Exchange of Vows → Veil & Cord → First Kiss → Leaving the Church → Cocktail Hour → Newlywed Entrance → First Dance → Cake Cutting → Money Dance) need coverage. They always appear in the editorial. They need stories, not just photos.

### 4.2 How the Assignment Board works

**Location:** Couple dashboard → Guests → Assignment Board tab. Also accessible by Best Man / MoH with delegate access.

**Before the wedding:**
The couple sees all 10 locked moment slots. For each slot, they assign a guest. "Who should cover the bridal march? Tito Randy — he's been part of this family for 40 years." They tap his name. An assignment is created.

**Day-of (coordinator view):**
As the coordinator taps moments live, the assignment board updates. The Best Man can see: "You have the First Dance slot. Look for good moments."

**Post-wedding:**
Assigned guests receive a nudge: "Maria and Juan would love your story from the First Dance. You have 14 days." The nudge links directly to the Column compose UI for that specific assignment, pre-anchored to the best Papic photo from that moment's time window.

### 4.3 The fallback chain (now automated)

| Plan | Condition | Result |
|---|---|---|
| **A** | Assignment fulfilled | Assigned contributor's Column becomes the editorial text for that slot |
| **B** | Assignment unfulfilled but Stories exist | Best Story (highest density moment in time window) becomes pull-quote |
| **C** | No assignment, no Stories | Best Papic capture from time window, no text |

The couple can override any slot manually.

### 4.4 New table: `kwento_assignments`

```sql
kwento_assignments (
  id                  uuid PRIMARY KEY,
  event_id            uuid NOT NULL,
  moment_slot_key     text NOT NULL,    -- 'bridal_march' | 'first_kiss' | custom
  assigned_guest_id   uuid REFERENCES guests(id),
  assigned_vendor_id  uuid REFERENCES vendors(id),  -- for vendor columns
  nudge_sent_at       timestamptz,
  nudge_responded_at  timestamptz,
  fulfilled_column_id uuid REFERENCES kwento_columns(id),
  created_by          uuid,             -- couple or coordinator
  created_at          timestamptz DEFAULT now()
)
```

---

## Part 5 — For the Editorial: The Journalism Layer

### 5.1 What the editorial is without Kwento

The editorial today is a curated collection of photos with captions and a love story. Beautiful. But it's one-dimensional — it's the couple's perspective, illustrated by their photos.

Every great newspaper has multiple reporters. The editorial needs multiple voices.

### 5.2 What the editorial becomes with Kwento

Each of the 10 locked editorial slots now has three layers:

1. **The photo** — the moment captured
2. **The story text** — the journalism layer (sourced from Kwento: Column preferred, Story as fallback)
3. **The byline** — who wrote it, their role, a link to their guest profile

This is not a caption. This is editorial copy. The editorial does not say "Juan and Maria cut the cake." It says:

> *"They laughed through the whole thing because Juan, who had practiced with his sisters the week before, suddenly forgot everything. He went right, she went left, and the moment the knife touched the cake, Maria started laughing so hard the whole reception joined in."*
> — Kath, Maid of Honor

That is the editorial. The editorial that only this wedding can produce. The editorial that will be read 20 years from now.

### 5.3 Column placement in the editorial

The couple reorders columns like an editor. They drag the sections:

- Cover
- Love story
- Ceremony sections (Bridal March → First Kiss → etc.)
- Reception sections
- **Guest columns** (one per assigned contributor — 1 to ~6)
- **Vendor columns** (Pro/Enterprise only — 1 to 3)
- Day timeline
- Vendor credits
- [LOCKED CLOSE] Couple's words + Pakanta

The only locked position is the close. Everything else is couple-ordered.

### 5.4 The Alaala page as a living editorial

The editorial does not publish on wedding day. It publishes when the couple is ready — and it keeps updating as columns arrive.

The couple publishes their editorial. A week later, Tito Randy sends his bridal march column. The editorial updates. A notification goes to anyone who bookmarked the page: "A new story has been added."

The editorial is alive for as long as the couple wants it to be. The wedding happened on one day. The editorial can grow for a year.

---

## Part 6 — For the Event: Real-Time Narrative

### 6.1 Flash on the Live Wall

The shipped Live Wall today shows:
- Incoming Papic photos
- Photo count
- Guest tags
- Kwento Story lower-third (if approved)

With the Flash upgrade:
- Every photo fires an immediate ≤50-char Flash prompt to the photographer
- Flash submissions auto-queue with a 5-second hold (couple/coordinator can kill any Flash before it hits the wall)
- The Live Wall reads as a running newsfeed, not just a photo stream

The venue projection becomes a real-time narration of the wedding. Guests at table 14 who can't see the cake cutting can read what's happening on the wall in five words.

### 6.2 The event timeline, built live

As Flashes and Stories arrive with their parent photo's `captured_at`, the Timeline view in the Alaala hub builds in real time.

The couple can check their phone during the reception and see what their guests are saying about the ceremony they just left. Not photos — words. The 10 words that reconstruct a moment they were too busy to fully feel.

### 6.3 Coordinator tools

The coordinator has a dedicated Assignment Board view with one job: make sure the 10 locked moments get covered.

When the coordinator taps a moment live (e.g., "First Dance started"), the system:
1. Creates a time window for that moment
2. Sends a background nudge to the assigned contributor: "First Dance is happening now. Capture something."
3. Buckets any Papic photos taken in the next N minutes to that slot

This is the coordinator's editorial job: time-gating moments so the system can bucket evidence correctly.

---

## Part 7 — The Vendor Voice

### 7.1 Why vendor columns are different

A guest column is emotional and personal. A vendor column is professional and insider.

The florist's column: "I placed the last petal at 6:47 AM. The brief said 'garden romance' and I interpreted that as walking into a dream that only lasts one morning. Here's what I was thinking."

The band's column: "We played the entrance in A major because the venue acoustics were tight. When the couple walked in, we switched keys without warning — the drummer gave us a look — and it landed."

This is not marketing copy. This is the insider account that makes the editorial feel like a real magazine. The kind of piece that Vogue charges ₱50,000 to write for a brand. Setnayan's couples get it for free, from the vendor who was actually there.

### 7.2 The vendor's incentive

A vendor column on the couple's editorial page:
- Links back to the vendor's profile
- Appears on the vendor's portfolio as "As featured in [couple]'s wedding" (couple-approved label)
- Is a concrete reason to upgrade to Pro/Enterprise — Free vendors cannot contribute columns

This is editorial placement worth more than advertising. A real account of real work, on a real couple's page, with a real backlink. SEO-valid. Authentic. Impossible to fake.

### 7.3 Guardrails

- Couple must approve the column before it publishes (couple = editor-in-chief)
- Couple can reject without explanation
- Vendor column max = 400 words, same as guest column
- Vendor cannot edit their column once the couple approves it (anti bait-and-switch)
- Couple can retract a published vendor column at any time

---

## Part 8 — Build Plan

### What's already shipped (foundation)

- `photo_messages` table + RPCs (submit / wall-approve / wall-clear / delete)
- Guest author sheet in Papic capture UI
- Couple review queue + moderation page
- Live Wall lower-third
- Kwento Magazine PDF
- Auto-Recap "Mga Boses" voices section
- FaceBlock → author-hide
- Guest 24h self-delete
- Couple email on held Kwento

### Phase 1 — Flash tier + Voice Depth selector
**Scope:** Extend `photo_messages.voice_depth ENUM('flash','story')` + Flash prompt UX in `papic-guest-capture.tsx`. Flash auto-queues to Live Wall with 5-second hold. Story prompt appears as a follow-up offer after Flash.

**New table:** None. One `ALTER TABLE photo_messages ADD COLUMN voice_depth text NOT NULL DEFAULT 'story'`.

**Owner sign-off needed:** Flash auto-queue policy (5-second hold? couple-must-approve-flash-too? or Flash auto-publishes on clean Tier-1?).

**Estimate:** 1–2 Claude Code days.

---

### Phase 2 — Moment Density Map
**Scope:** Query-only surface in the Alaala hub. `COUNT(photo_messages) GROUP BY photo_id`. Density dot in the gallery. "Most storied moments" row.

**New table:** None. View or materialized view recommended for performance.

**Estimate:** 0.5–1 CC day.

---

### Phase 3 — Assignment Board + `kwento_assignments`
**Scope:** New table `kwento_assignments` (see schema in §4.4). Couple UI in Alaala hub → Assignment Board. Coordinator view (read + tap-to-time-gate). Post-wedding nudge via `after()` + Resend (0028 email template `kwento_assignment_nudge`).

**Owner sign-off needed:** Delegate access level for Best Man/MoH (can they assign, or only view?). Nudge window (14 days default).

**Estimate:** 2–3 CC days.

---

### Phase 4 — Column tier + `kwento_columns`
**Scope:** New table `kwento_columns` (long-form content, couple-approved, supports both guest and vendor authors). Column compose UI for invited contributors (web-only, mobile-responsive). Couple approval flow. Editorial assembly in the Alaala editor.

```sql
kwento_columns (
  id              uuid PRIMARY KEY,
  event_id        uuid NOT NULL,
  author_guest_id uuid REFERENCES guests(id),
  author_vendor_id uuid REFERENCES vendors(id),
  moment_slot_key text,                 -- which editorial slot this covers (nullable)
  assignment_id   uuid REFERENCES kwento_assignments(id),
  title           text,                 -- optional; couple can set
  body            text NOT NULL,        -- 200–400 words enforced at submit
  word_count      integer NOT NULL,
  byline_name     text NOT NULL,
  byline_role     text,
  photo_ids       uuid[],               -- up to 3 attached Papic photos
  status          text DEFAULT 'draft', -- draft | submitted | approved | published | retracted
  submitted_at    timestamptz,
  approved_at     timestamptz,
  approved_by     uuid,
  published_at    timestamptz,
  print_consent   boolean DEFAULT false,
  created_at      timestamptz DEFAULT now()
)
```

**Owner sign-off needed:** Vendor columns (Pro/Enterprise gate vs. Free) · column retraction model (does it disappear from the editorial immediately or does a "this piece was removed" tombstone remain for editorial continuity?).

**Estimate:** 3–4 CC days.

---

### Phase 5 — Editorial integration (Kwento → 10 locked slots)
**Scope:** Wire the editorial assembly engine to pull from `kwento_columns` first, `photo_messages` (Story) as fallback, best Papic capture as Plan C. The editorial editor shows: [Photo] + [Story text slot: Column | Story | empty] + [Byline]. Drag-and-drop column ordering.

**Prerequisite:** Phases 3 + 4 complete.

**Estimate:** 2–3 CC days.

---

### Phase 6 — Vendor columns (gated on Phase 4)
**Scope:** Vendor-side column compose in `/vendor-dashboard/[vendorId]/columns`. Pro/Enterprise gate check. Couple invite flow (couple sends invite from their Alaala editor → vendor receives notification → vendor composes). Portfolio cross-link ("As featured in [couple]'s wedding" on the vendor's public page).

**Estimate:** 1–2 CC days.

---

### Not in this spec (requires video pipeline first)
- Guest words baked as title cards in the SDE film
- Guest words as narration in Thank-You video
- Flash captions as lower-third text in AI Highlights

These remain the uncopyable ceiling. They are blocked on owner-actionable infra (render host + Pakanta/owned-music library) — not a Kwento code gap.

---

## Part 9 — Owner Sign-offs Required

Before any Phase begins:

1. **Flash auto-publish policy** — Flash goes to Live Wall immediately on Tier-1 clean, OR Flash joins the Story approval queue? (Recommendation: Flash auto-publishes on clean Tier-1 with coordinator one-tap kill switch — friction kills the real-time energy.)

2. **Column tier gate** — Guest Columns: free for all invited guests, OR requires a Papic/Guests unlock? (Recommendation: free — "monetize the produced video, not the words" is the locked principle.)

3. **Vendor columns gate** — Pro/Enterprise only? Or all verified vendors? (Recommendation: Pro/Enterprise only — editorial placement is a concrete upgrade reason.)

4. **Assignment delegate access** — Can the Best Man/MoH assign contributors from the board? Or view-only? (Recommendation: full assign + nudge access, same as coordinator for this board only.)

5. **Column retraction model** — When couple retracts a published column, does it disappear immediately or leave a tombstone? (Recommendation: immediate disappear — the couple is editor-in-chief and must be able to clean without trace.)

6. **Naming** — Does the long-form tier stay "Column" (internal) or does it get a Tagalog product name? The Flash/Story/Column ladder could become **Bulong / Kwento / Sanaysay** (whisper / story / essay). Owner call.

---

## Part 10 — The Competitive Moat Summary

| What Kwento does | Who else does this |
|---|---|
| Photo-anchored messages from guests | Nobody (upload buckets don't tie messages to specific photos) |
| Live Wall lower-third from guest words | Nobody |
| Guest messages baked into SDE on owned music | Nobody — **this is the ceiling** |
| Moment density map (crowdsourced editorial lead) | Nobody |
| Assignment board → editorial journalism coverage | Nobody |
| Guest-authored editorial columns with byline | Nobody |
| Vendor professional POV as editorial contribution | Nobody |
| All of the above in one canonical URL | Nobody |

The moat is not any single feature. The moat is that you cannot replicate this by combining any five other apps — because it requires the planning graph (who was at which table), the capture layer (Papic photos with `captured_at`), the word layer (Kwento), the music layer (Pakanta), and the editorial layer (Alaala) to be the same system. Every competitor is a point solution. Setnayan is the integration.

---

*Spec owner: Setnayan Product. Last updated: 2026-06-18. No code exists for Phases 1–6 as of this writing — this is a design document.*
