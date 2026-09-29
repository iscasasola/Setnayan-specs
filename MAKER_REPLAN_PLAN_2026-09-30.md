# Event Hub Maker — the re-plan and how it gets done (2026-09-30)

Source of truth for every ruling: `DECISION_LOG.md` rows dated 2026-09-30 ("THE MAKER RE-PLAN — SPEED FIRST…", "THE MAKER EDITS HOW IT LOOKS…", "ADDS TO THE MAKER RE-PLAN — QUICK SETUP + SEARCH", "RE-PLAN REVISIONS…", "RSVP ANSWERS…", "OUTFIT STYLE IS ONE SETTING…", "IN YOUR COLOURS…"). Design: `prototypes/maker_replan_2026-09-30.html` (v2 being redrawn).

## The rule for "done"
A piece is done only when a phone walk-through on a TEST event (never the owner's) passes timed tasks — e.g. "type a new opening line", "tap the logo + five times", "rename the bridesmaids", "change the date format" — each visible in under a second, nothing hidden, nothing confusing, pictures attached. Green CI alone is not done.

## Phase 0 — SPEED (now → Wed 30 Sep afternoon)
Every change shows instantly; saves run quietly in the background; the page rebuilds only on Apply. Taps (logo −/+) batch into one save. Target: visible < 150 ms, saved < 1 s, zero full-page reloads. Measured before and after.

## Phase 1 — Approve the design (Wed 30 Sep)
Owner approves prototype v2 (desktop + phone): RSVP stage parts, real scene designs recycled, Quick setup = missing-only, optional joiner, full Mood Board, full Logo Maker, frame optional per style. Answer the 8 questions (or "use your recommendations").

## Phase 2 — Build, in parallel lanes (Thu 1 → Sat 3 Oct)
**A · Structure**
- Top nav: **Details | Save the Date · RSVP · Invitation · The Day · Post Event | Prints**.
- **Prints** tab (invitation set, Finer Details, Digital/Printed tickets + style, poster, menu, seat plan print, The Entourage, **Mood Board download**).
- **RSVP stage**: RSVP (form) · After they submit (tickets) · When they decline. Answer wording renamable; "maybe" optional.
- **Details (slim)** — Main: Theme · Mood Board · Logo. Your event: Names (from the Guest list; joiner optional) · Date (date finder built in) · Venues (from the booked supplier) · Parents & hosts & Wedding March (arrangement, who walks beside whom, drag incl. phones) · Seat plan (Auto-arrange back in view) · Love Story · Schedule. Removed from Details: Words, Hero, Reveal, RSVP, Prints.
- The Maker shows **presentation only**; people stay in the Guest list ("Open in Guest list ›" is the one bridge).

**B · The stage edits everything**
- Tap any text → type in place, or **Wording ▾** premade lines. **Format ▾** for date/time. **Preset ▾ = 5 per scene/element**, the real existing styles first (today's look = default), new ones only to reach 5. **Frame ▾** only where the style has a frame. **Hide/show** (Maker-only placeholder). **Style**: one font dropdown · colour · size · motion. "Use on your other hero pages too? All · Just this one". **Opening** strip per stage (none · veil · seal · envelope…). No locks; Pro = ◆, asked at Apply. **ⓘ** on every non-obvious control.

**C · Look**
- Theme starter: picking a theme sets main background · fonts · colours; "Make it my own".
- One font dropdown (PR #6160) · 5 palette styles (built; default Tags stays still).

**D · Mood Board**
- Share settings first (coordinator · stylist · supplier). Theme (Suggest for me, Read my description, templates) · Inspiration · Palette per role + guests · Reception · In your colours (tied to each role's Outfit style; Change image, up to 5, recoloured — Recraft figures) · Make it real (button always shown). Fix the broken in-board jumps. Words: "supplier" never "vendor"; "Logo" never "your mark".

**E · Helpers**
- **Quick setup** — asks only for what's missing. **Search** across the Maker.

## Phase 3 — Walk-through + fixes (Sun 4 Oct)
Full phone walk-through as a free couple and as a Pro couple on a test event; timed; fix list closed.

## Phase 4 — Event Hub complete (Mon 5 Oct)
Then **Stage B — the Apple submission check** (owner + iPhone, ~30 min).

## Running alongside (not Maker, not blocking)
Guest-side answers (#6157: no guest email, tickets, requester flow), Patiktok pay-to-save (#6161), Best Woman + rename roles, Partner + label handshakes, sponsor layouts, Both-view fit, fashion figures (Recraft) for the dress code.

## Risks
GitHub test queue · Vercel out-of-memory (fix: `VERCEL_FORCE_NO_BUILD_CACHE=1`) · page-size limits (shared bundle has 0 bytes spare — every Maker addition loads on open) · weekly usage (warn at 90%, stop at 99%).
