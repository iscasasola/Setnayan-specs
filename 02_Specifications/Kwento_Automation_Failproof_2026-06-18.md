# Kwento — Automation + Failproof Analysis
## Companion to Kwento_Monumental_Upgrade_2026-06-18.md · 2026-06-18

> Written against real shipped code (`apps/web`), not spec assumptions. Every gap is grounded in an actual file and line.

---

## Part 1 — Real Failure Modes (code-grounded)

### 1A. FaceBlock cache invalidation on the Live Wall
**File:** `lib/live-wall.ts:243`
```ts
.eq('author_publicly_hidden', false)
```
The caption query trusts the `author_publicly_hidden` column — a cached flag synced by a best-effort `after()` hook when the guest toggles FaceBlock. If that hook fails silently (network error, DB timeout), the caption keeps showing even though FaceBlock is now ON for that guest. The DB `CHECK (wall_eligible => clean)` doesn't protect this path.

**Fix:** Join against `guests.faceblock_enabled` in the caption query. The column is the cache; the join is the truth.
```sql
-- serve-path addition (no new table)
AND NOT g.faceblock_enabled
```

**Severity:** Medium. The risk is real during a live reception when FaceBlock toggles happen under pressure. The after() failure rate is low but non-zero.

---

### 1B. Tier-1 moderation not scoped to voice depth
**File:** `app/api/papic/kwento/route.ts:46`
```ts
if (!captureId || text.length < 1 || text.length > 280)
```
The route has no concept of `voice_depth`. When Flash tier ships, a 50-char limit and a different prompt need to reach the same endpoint. Hardcoded `280` will silently accept Flash messages that are 51–280 chars as valid Stories instead of rejecting them as oversized Flashes.

**Fix:** Accept `voice_depth: 'flash' | 'story'` in the request body. Enforce `flash → max 50 chars`, `story → max 280 chars` at the route before the RPC.

---

### 1C. Single-shot flagged notification — no batch or pacing
**File:** `app/api/papic/kwento/route.ts:88–113`
The couple gets an email every time a single Kwento is flagged. During a live reception with 60 guests writing Stories, a wave of borderline messages (banter with mild profanity) could generate 10+ emails in 5 minutes — each identical in subject line. The couple is busy getting married.

**Fix for Story tier:** Batch flagged notifications into a 10-minute debounced window (one email: "You have N stories waiting for review"). Use a `kwento_notification_pending` flag on `events` + a post-response `after()` that checks the last-sent timestamp before emitting.

**Fix for Flash tier:** Flash goes to the wall automatically on Tier-1 clean (if owner approves this). No couple-review email on Flash. The Live Wall's 5-second kill window is the moderation path.

---

### 1D. No moment slot awareness anywhere in the stack
There is no concept of "which moment of the event does this photo belong to?" anywhere in shipped code. `captured_at` exists on photos, `created_at` exists on `photo_messages`, but there is no slot-bucketing system.

The editorial assembly depends entirely on coordinator time-taps that don't exist yet. Without them, the system cannot know which Kwentos belong to the Bridal March slot vs. the First Dance slot.

**Fix:** Add `ceremony_time` and `reception_time` to `events` table (they may already exist — confirm before migrating). Define slot time windows as a config (deterministic, not AI):

```ts
// Standard Filipino Catholic wedding timing offsets (owner-adjustable)
const SLOT_WINDOWS = {
  bridal_march:      { offset: 0,   duration: 20  }, // min from ceremony_time
  exchange_of_vows:  { offset: 15,  duration: 30  },
  veil_and_cord:     { offset: 25,  duration: 20  },
  first_kiss:        { offset: 40,  duration: 5   },
  leaving_church:    { offset: 50,  duration: 15  },
  cocktail_hour:     { offset: 0,   duration: 90  }, // min from reception_time
  newlywed_entrance: { offset: 90,  duration: 15  },
  first_dance:       { offset: 105, duration: 10  },
  cake_cutting:      { offset: 180, duration: 10  },
  money_dance:       { offset: 210, duration: 20  },
};
```

Coordinator taps OVERRIDE the heuristic. If no tap exists, the heuristic runs. If no ceremony/reception time set, bucketing is skipped and all slots fall through to Plan C.

This is pure deterministic time-math — no AI, no per-render compute.

---

### 1E. No escalation path on the assignment nudge
The assignment nudge (Phase 3) fires once and waits. If the assigned contributor ignores it, the slot silently becomes Plan B or Plan C with no human loop. The couple doesn't know an assignment was missed.

**Fix:** Three-step nudge cascade per assignment:
1. T+24h post-wedding: initial nudge to assigned contributor
2. T+7d: reminder to contributor + silent flag on the assignment row
3. T+14d: escalation to Best Man/MoH: "Tito Randy hasn't responded. Would you like to write the Bridal March story instead, or let us fill it automatically?"

The escalation is a separate `kwento_assignment_escalated` notification type in `0028`.

---

### 1F. Zero-account contributor can't access Column compose
A guest who participated via QR disposable camera (zero-account, no Setnayan login) might be the best person to write a Column — they captured the most photos in the Bridal March slot. But the Column compose UI requires an authenticated session.

**Fix:** The assignment nudge email generates a **magic-link session** scoped to the specific assignment. The link pre-creates a limited Setnayan session (write-to-this-assignment only) via the same zero-account QR mechanism used for Papic capture. The guest clicks the link, lands on the Column compose UI, writes, submits. No full account required.

The session expires when the assignment window closes. It cannot access any other surface.

---

### 1G. Consent scope mismatch on Column tier
**File:** `app/api/papic/kwento/route.ts:50`
```ts
if (body.consent !== true) {
  return NextResponse.json({ error: 'consent_required' }, { status: 400 });
}
```
The current consent is binary — consent or no consent. But the consent text that was presented at submit ("your story may appear in the couple's keepsake") was written for the Story tier. A Column is published on the couple's public Alaala editorial page — a different consent scope entirely.

**Fix:** `kwento_columns` table has a `consent_scope` column: `'couple_private' | 'editorial_public' | 'vendor_portfolio'`. The Column compose UI shows the exact consent text for each scope. The server validates that `consent_scope` matches the column's intended surface.

A Column approved for `editorial_public` cannot be silently re-scoped by the couple to `vendor_portfolio` without re-consent.

---

### 1H. Couple approval queue doesn't scale to Column volume
**File:** `app/dashboard/[eventId]/add-ons/papic/moderation/actions.ts:272–348`
`approveKwento` / `rejectKwento` are one-at-a-time. For 6 guest columns + 3 vendor columns, the couple must open each one, read 400 words, decide, tap. The current UX doesn't exist yet for Columns, but if it mirrors the Story queue, the couple will face 9 full-read approval tasks post-wedding when they're exhausted.

**Fix:** Batch-preview approval queue for Columns:
- Cards showing 50-word excerpt + byline + assigned slot
- Bulk: "Approve all uncontroversial" toggle (approves all columns whose assigned contributor was couple-selected AND who passed Tier-1)
- Individual read opens inline, never a new page
- Keyboard shortcuts: ⌘+Enter = approve, ⌘+Delete = reject, ⌘+← = skip
- Priority sort: assigned columns first, unsolicited contributions last

---

### 1I. Vendor Column retraction leaves orphaned references
If a vendor column is retracted after publication, three surfaces reference it:
1. The Alaala editorial page (sections)
2. The vendor's portfolio page ("As featured in...")
3. The Kwento Magazine PDF (if it was printed in an edition)

There is no cascade retraction logic proposed in the upgrade spec. The editorial could have a broken section. The vendor portfolio could link to a deleted column.

**Fix:** The `kwento_columns.status = 'retracted'` triggers a DB-level cascade:
- Editorial section reads `WHERE status NOT IN ('retracted', 'draft')` — the section simply disappears
- Vendor portfolio reads the same status check — the "as featured in" card disappears
- Magazine PDF: retraction is **prospective only** — already-generated PDFs are not re-rendered. A note in the couple's dashboard: "A column was removed. Regenerate your magazine edition?"

---

### 1J. Time window race condition on coordinator taps
If two coordinators both tap "First Dance started" within seconds of each other (coordinator + couple both watching on phones), the system creates two `moment_taps` for the same slot — ambiguous time windows.

**Fix:** `UNIQUE(event_id, moment_slot_key)` on the taps table with ON CONFLICT DO UPDATE SET tapped_at = GREATEST(existing, new). First tap wins for the start time; subsequent taps extend only if they're later (they might be the "end" tap of a mistaken restart).

---

## Part 2 — The Automation Layer

### 2A. The Auto-Assembly Engine

The editorial must never require the couple to build it from scratch. The automation layer produces a complete, publishable editorial draft automatically. The couple's job is editing, not creation.

**Assembly priority per locked slot:**

```
1. Approved Column from assigned contributor (Phase 4 build)
2. Approved Column from any contributor (unsolicited, same slot)
3. Best Story (longest approved photo_message in slot time window)
4. Auto-Flash: top Flash (if Flash tier ships) from slot time window
5. Highest-density photo from slot time window (no text — photo only)
6. Best available Papic photo from general pool (Plan C floor)
```

The couple sees a "Draft editorial ready" notification when the assembly completes (T+48h after the event). The draft is always complete — no empty slots, no gaps.

---

### 2B. Auto-Suggested Assignments

The couple uses the Assignment Board, but they don't always know who was where. The system helps.

**After the event, for each locked slot:**
1. Find all photos in the slot's time window (by `captured_at`)
2. Count photos per contributor (Papic seat or Disposable Camera user)
3. Rank by photo count → highest count = most physically present
4. Surface top 1–3 as suggested contributors: "Kuya Bart took 12 photos during the First Dance. He might have a story."

This is pure SQL — COUNT + JOIN + sort. No AI. The suggestion UI shows the top contributor's name + role + photo count for that slot.

The couple taps to confirm. The nudge fires. The assignment is live.

---

### 2C. Smart Nudge Sequencer

Current state: one-shot flagged notification. The upgrade requires an adaptive multi-step nudge system.

**The full nudge lifecycle per event:**

| T | Event | Recipient | Channel | Content |
|---|---|---|---|---|
| Shutter close | Flash prompt | Papic/Disposable user | In-app | "One line. What just happened?" (5-second auto-dismiss) |
| Shot confirmed | Story offer | Papic/Disposable user | In-app | "Tell them more?" (dismissible, non-blocking) |
| T+12h post-wedding | Story invite | ALL guests (RSVP'd) | Email | "Share the moment you'll never forget from [couple]'s wedding" |
| T+24h | Column invite | Assigned contributors | Email + magic-link | "[Couple] wants your story from the [slot]." |
| T+7d | Column reminder | Unresponded assignments | Email | "You still have time — [couple] is waiting for your story." |
| T+14d | Column escalation | Best Man / MoH | Email | "[Contributor] hasn't responded. Would you like to cover the [slot]?" |
| T+14d | Draft ready | Couple | Email | "Your editorial draft is ready. Review and publish." |
| T+21d | Regenerate nudge | Couple | Email | "N new stories have arrived since your last edition. Regenerate?" |

**Implementation:** No crons. Uses Next 15 `after()` chained from the previous step's output. The T+12h story invite is queued when the event transitions from `live` to `recap` mode. Each subsequent nudge is queued when the prior deadline passes with no response.

---

### 2D. The Editorial Floor Guarantee

**The editorial is always complete. This is a system invariant, not an aspiration.**

Every locked slot always has a photo. The photo floor cannot fail because it reads from `papic_guest_captures` and `papic_photos` — both of which already exist for any event where Papic ran.

The system builds the draft in this order:
1. Run slot-bucketing against `captured_at` to assign photos to slots
2. For each slot, pick the best photo (density score > photo count > recency)
3. For each slot, find the best Kwento (Column → Story → Flash → none)
4. Assemble into editorial draft
5. Store as `event_editorial_drafts` (new table — one draft per assembly run)
6. Notify couple

The couple can regenerate the draft at any time. Regenerating is free and idempotent.

---

### 2E. Density Score as an Editorial Signal

The density map (Phase 2 from the upgrade spec) feeds directly into editorial decisions:

**The density signal has three uses:**

1. **Best-photo selection per slot** — within a time window, pick the photo with the highest density score (most Kwentos) as the hero image. Guests voted with their words.

2. **Editorial slot ordering** — slots with high-density moments should probably appear earlier (the guest voted it as memorable). The couple can override.

3. **Post-event "highlight reel"** — when the video pipeline ships, the density score is the editorial signal for which clips to include in the Auto-Highlight. The highest-density photo's time window = most likely the moment to cut to.

All three are query-only (no new tables). The density score is `COUNT(photo_messages WHERE status != 'rejected')` per photo, materialized as a view.

---

### 2F. Flash Tier Automation

Flash is designed to be frictionless. The automation that makes it work:

1. **Immediate prompt** — the prompt appears the moment the capture confirmation appears. Not a modal. A 5-second countdown ticker in the corner of the confirmation screen. "What just happened? Tap to write."

2. **Predictive Flash** — if the guest dismisses the prompt three times in a row without writing, stop showing it for the next 20 minutes. They're in shooting mode, not writing mode.

3. **Wall auto-publish on clean** — Flash that passes Tier-1 as `clean` goes to the Live Wall immediately via the `5-second hold → no coordinator kill → auto-publish` path. The couple doesn't review Flashes live. The coordinator has the kill switch on the wall control panel.

4. **Flash auto-expires on the wall** — Flash captions cycle every 30 seconds. The wall never shows the same Flash twice in a row. The newest clean Flash is always preferred.

---

## Part 3 — The Failproof Architecture Summary

### The seven guarantees

Every layer of the upgrade must uphold these:

| # | Guarantee | Mechanism |
|---|---|---|
| G1 | The editorial is always complete | Photo floor + slot-bucketing + auto-assembly engine |
| G2 | No FaceBlock guest appears in any public output | Serve-path join against `guests.faceblock_enabled` (not just cached column) |
| G3 | Column consent matches the surface | `consent_scope` column + server-side validation at compose AND at publish |
| G4 | Retracted Column leaves no orphans | Cascade via `status != 'retracted'` in all read paths; prospective-only for PDFs |
| G5 | Zero-account contributors can write Columns | Magic-link session from nudge email, scoped to one assignment |
| G6 | Flash never overwhelms the couple's inbox | Flash bypasses couple review queue entirely; coordinator kill switch only |
| G7 | Moment slots never have duplicate time windows | `UNIQUE(event_id, moment_slot_key)` + ON CONFLICT DO UPDATE |

---

### The three automated chains that require no human action

**Chain 1 — Photo capture → Editorial draft (0 human actions needed)**
```
Guest takes photo
→ captured_at recorded
→ slot-bucketing assigns to nearest slot
→ density score computed
→ (if Kwento exists) pulled as slot text
→ Editorial draft assembled T+48h
→ Couple notified
→ Couple taps "Publish" (one action)
```

**Chain 2 — Assignment → Column → Editorial slot (1 human action per contributor)**
```
Couple assigns Tito Randy to Bridal March slot (1 action)
→ T+24h: nudge fires with magic-link
→ Tito Randy writes Column (1 action, his)
→ Tier-1 check runs automatically
→ Column enters couple approval queue
→ Couple taps "Approve" (1 action)
→ Bridal March slot → Column text + byline
→ Editorial regenerates automatically
```

**Chain 3 — Flash → Live Wall (0 human actions needed)**
```
Guest captures photo
→ Flash prompt fires (5s)
→ Guest writes Flash (1 action, theirs)
→ Tier-1 runs synchronously
→ clean → 5-second hold
→ no coordinator kill
→ appears on Live Wall lower-third
→ cycles with next Flash every 30s
```

---

## Part 4 — Schema Additions (concrete)

### `events` table extensions
```sql
-- Already may exist — verify before adding
ALTER TABLE events ADD COLUMN IF NOT EXISTS ceremony_time timestamptz;
ALTER TABLE events ADD COLUMN IF NOT EXISTS reception_time timestamptz;
```

### `photo_messages` table extensions
```sql
-- Phase 1: Flash tier
ALTER TABLE photo_messages ADD COLUMN IF NOT EXISTS
  voice_depth text NOT NULL DEFAULT 'story'
  CHECK (voice_depth IN ('flash', 'story'));

-- Enforce per-depth character limits at DB level (belt + suspenders)
ALTER TABLE photo_messages ADD CONSTRAINT chk_flash_length
  CHECK (voice_depth != 'flash' OR length(body_text) <= 50);
ALTER TABLE photo_messages ADD CONSTRAINT chk_story_length
  CHECK (voice_depth != 'story' OR length(body_text) <= 280);
```

### `kwento_columns` (Phase 4)
```sql
CREATE TABLE kwento_columns (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          uuid NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  author_guest_id   uuid REFERENCES guests(guest_id),
  author_vendor_id  uuid REFERENCES vendors(id),
  assignment_id     uuid,               -- FK to kwento_assignments.id (Phase 3)
  moment_slot_key   text,               -- 'bridal_march' | 'first_dance' | ...
  title             text,
  body              text NOT NULL,
  word_count        integer NOT NULL,
  byline_name       text NOT NULL,
  byline_role       text,
  photo_ids         uuid[] DEFAULT '{}',
  consent_scope     text NOT NULL DEFAULT 'editorial_public'
                    CHECK (consent_scope IN ('couple_private','editorial_public','vendor_portfolio')),
  consent_captured_at timestamptz NOT NULL,
  status            text NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','submitted','approved','published','retracted')),
  submitted_at      timestamptz,
  approved_at       timestamptz,
  approved_by       uuid,
  published_at      timestamptz,
  retracted_at      timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  -- Author must be either a guest or a vendor, not both, not neither
  CONSTRAINT chk_single_author CHECK (
    (author_guest_id IS NOT NULL) != (author_vendor_id IS NOT NULL)
  ),
  -- Word count range enforced at DB level
  CONSTRAINT chk_word_count CHECK (word_count BETWEEN 200 AND 400)
);
```

### `kwento_assignments` (Phase 3)
```sql
CREATE TABLE kwento_assignments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id                uuid NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  moment_slot_key         text NOT NULL,
  assigned_guest_id       uuid REFERENCES guests(guest_id),
  assigned_vendor_id      uuid REFERENCES vendors(id),
  assigned_by_user_id     uuid,
  auto_suggested          boolean DEFAULT false,  -- system-suggested vs couple-confirmed
  nudge_1_sent_at         timestamptz,            -- T+24h initial
  nudge_2_sent_at         timestamptz,            -- T+7d reminder
  escalation_sent_at      timestamptz,            -- T+14d to Best Man/MoH
  escalated_to_guest_id   uuid REFERENCES guests(guest_id),
  fulfilled_column_id     uuid,                   -- FK to kwento_columns.id
  created_at              timestamptz DEFAULT now(),
  UNIQUE(event_id, moment_slot_key)               -- one assignment per slot
);
```

### `event_editorial_drafts` (Phase 5)
```sql
CREATE TABLE event_editorial_drafts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        uuid NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  version         integer NOT NULL DEFAULT 1,
  assembly_at     timestamptz NOT NULL DEFAULT now(),
  slot_manifest   jsonb NOT NULL,   -- { slot_key: { column_id?, message_id?, photo_id, plan } }
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  published_at    timestamptz,
  UNIQUE(event_id, version)
);
```

---

## Part 5 — Owner Sign-offs (additions to the upgrade spec)

Beyond the six sign-offs in the upgrade spec:

| # | Decision | Recommendation |
|---|---|---|
| O7 | Flash auto-publish policy | Auto-publish on Tier-1 clean with 5s kill window. Coordinator is the gatekeeper, not the couple. |
| O8 | Story batch-notification window | 10-minute debounce during the event. One email per 10 minutes max, regardless of how many Stories arrive. |
| O9 | Zero-account Column access | Magic-link session, write-scoped, expires in 14 days. Couple must confirm before link is generated. |
| O10 | Vendor Column on downgrade | Published columns persist through downgrade. New invites blocked. Agree? |
| O11 | `ceremony_time` / `reception_time` required fields | Make them required at event creation (planning stage) so slot-bucketing always works. Currently optional? Confirm. |
| O12 | Auto-editorial T+48h window | The draft assembles 48 hours post-wedding automatically. Does the couple want control over when assembly runs, or is 48h automatic good? |

---

*Spec owner: Setnayan Product. Last updated: 2026-06-18. Code grounded: `lib/live-wall.ts`, `lib/kwento-moderation.ts`, `app/api/papic/kwento/route.ts`, `app/dashboard/[eventId]/add-ons/papic/moderation/actions.ts`.*
