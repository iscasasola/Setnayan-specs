# Setnayan Homepage Reskin — Session Handoff & Template Doc (2026-06-29)

> Read this first if you're a new session continuing the homepage work. It captures the GOAL, the website TEMPLATE we're following, what's DONE, what's NEXT, and the honesty/build backlog. The working artifact is the prototype `03_Strategy/Home_ELN_Reskin_2026-06-28.html` (open via the `home-proto` launch config → http://localhost:8795). Copy lives in `03_Strategy/Website_Copy_2026-06-29.md`.

---

## 1. The goal (positioning — LOCKED)

Setnayan is repositioning from "wedding planner" to a **core memory spot + free planner for every event**. Two-part identity:

- **Core identity (why you stay):** Setnayan is your **lifelong memory home** — the memories of every event you HOLD *and* ATTEND, kept for life. A planner you use once and abandon vs. a memory home you return to for the next event, and the one after.
- **Functional entry (why you sign up):** the **free planner** — **Planuhan** (planner) + **Likhaan** (creative studio) lead. Setnayan must be worth it *even without the vendor marketplace*.
- **All-events hub:** wedding (most intricate) → debut · birthday · christening · reunion → a dinner with friends (simplest).
- **Tiangge (marketplace) is supporting**, not a co-headline. 0% commission is the locked proof point.

Headline: **"Plan it, run it, remember it. Keep it, for life."** Brand line: **"Set na 'yan."**
Memory refs: `project_setnayan_core_memory_positioning`, `project_setnayan_five_pillar_names`, `project_setnayan_living_memories_thesis`.

---

## 2. The website TEMPLATE we're following — "ELN-style" (Espacio La Nube)

We are modelling the homepage on **https://www.espaciolanube.com** (owner-chosen, "full reskin"). What we copied (verified from its live DOM, not guessed):

**Design language**
- **Cool greige palette** (their live CSS): bg `#F2F2F0`, soft taupe text `#8C8884`/`#989490`, near-no true-black (soft ink `#54514D`). Setnayan accent kept: champagne gold `#C5A059` (`--pop2`), one mulberry pop `#9A7BC9` (`--pop1`).
- **"Liquid glass" UI, but SUBTLE** (their real values): `backdrop-filter: blur(5–7px)`, `background: rgba(140-150,·,·,.26-.30)` mid-grey, **no border, no shadow**, pill radius. (We initially over-did it with 20px blur + borders; corrected to match.)
- **Type:** their body font is **Adobe Clean** (a neutral humanist sans, NOT a serif). We use `-apple-system / Inter` as the free stand-in; Instrument Serif only for the brand wordmark/manifesto accents.
- **Photography/film:** desaturated, cinematic. We use CSS gradient "scenes" as stand-ins for real desaturated event clips (real footage drops in later).

**Signature interactions (the ELN moves we ported)**
- **No-scroll cinematic gate:** the hero is a full-screen looping film with scroll LOCKED; a glass nav + a centered title + "Learn more" + a **dock**; clicking "Learn more"/a dock item **unlocks scroll**. (On the real ELN site the hero is an HTML5 `<video>`; the bottom dock thumbnails are mini live-videos that **swap the full-screen video** — a video carousel.)
- **The dock = the 5 pillars** (our adaptation): clicking a pillar swaps the hero photo + shows that pillar's name + short description + "Start planning · free" + "Learn more →" (jumps to the pillar's section). Logo = Home (returns to the gate).
- **Manifesto reveal** after the gate (their studio statement → our "living memory" line).
- **`/work`-style gallery** → our **Real Stories** (big rounded monochrome cards: "Edition 01 · Claire & Ice").
- **`/info`-style kinetic word ticker** (their "[X] is in the air") → our feelings ticker ("Family, kept forever.").
- **Voice in utility UI:** the cookie pill reads "Cookies help us remember" (their "…help things flow").

**Layout system (current)**
- **Full-screen scroll-snap:** every section is `height:100dvh` + `scroll-snap-align:start`; `html.snap{scroll-snap-type:y mandatory}` (added to `<html>` on gate-open — note the scroller is the documentElement, NOT body). **No divider lines** between sections (seamless); alternating section backgrounds removed.
- **Preview widget height** locked to `clamp(...,32vh,...)` so it always fits; pillar vertical rhythm tightened so header + widget + cards never clip.
- **Subtopic presentation = card grid → now a horizontal CAROUSEL** (drag on desktop via pointer events, native swipe on mobile, scroll-snap, edge-fade peek). Owner picked card-grid then asked for carousel.
- **Interactive pillar preview** (built on Ala Ala as the pattern): each feature card, when clicked, swaps the pillar's "widget" to that feature's mockup; **desktop = browser frame, mobile = phone frame** (responsive via `@media(max-width:680px)`).

**Other prototypes in `03_Strategy/`** (exploration history, keep for reference):
- `Home_Design_A_LivingArchive…` / `_B_Broadsheet…` / `_C_Cinematic…` / `_D_Bento…` — the 4 design directions before the owner chose the ELN reskin.
- `Home_Pillars_Defined_2026-06-28.html` — the pillars-with-samples exploration.
- `Home_Five_Pillar_Prototype_2026-06-28.html` — the first (warm, pre-ELN) homepage prototype.
- `Subtopic_Presentations_2026-06-29.html` — the card-grid vs accordion vs numbered comparison (owner picked card grid, then carousel).

---

## 3. The 5 pillars (names RENAMED 2026-06-29)

| # | Name | Role | Tagalog | Contains |
|---|---|---|---|---|
| 01 | **Ala Ala** | Memory Hub | "memory" | Every event type · Editorials · Dashboard |
| 02 | **Likhaan** | Creative Studio | "a place to create" | Adaptive website · Logo & monogram · Papic · **Live Studio** · TikTok booth · **3D Event Designer** |
| 03 | **Planuhan** | Planner | "a place to plan" | Guest list · Seat plan · Mood board · Budget · Date picker · Checklist · Printable PDF · Scheduler |
| 04 | **Surian** | Setnayan AI | "where options are weighed" | Smart filtering · Adaptive checklist · Smart budgeting · Auto Build |
| 05 | **Tiangge** | Marketplace | "bazaar" | Verified vendors · Track record · Performance breakdown · 0% commission · Setnayan Exclusive |

**Rename history:** 2026-06-28 reassigned "Ala Ala" → Memory Hub. **2026-06-29 (owner)** renamed three pillars to the "-an = place" framing — **Likha→Likhaan · Plano→Planuhan · Utak→Surian** — and two sub-features **Panood→Live Studio · 3D Blueprint/Pa3D→3D Event Designer**. Internal widget ids followed: `awAla / awLikhaan / awPlanuhan / awSurian / awTiangge`. Supersedes the old `Website_Master_Plan` "Alaala = 5 Pa-services" definition. **Live Studio paid multicam repriced ₱4,999→₱3,499/event/day** (single-cam still free) — see §6/§9.

---

## 4. What's DONE this session

- Chose the **ELN reskin** direction (owner: "full reskin") after a 4-direction design exploration.
- Built the full prototype `Home_ELN_Reskin_2026-06-28.html`: gate → manifesto → 5 pillars → Real Stories → Pricing → Download → Close → footer.
- Pulled ELN's **real CSS** (Chrome MCP) and retuned glass/colors/type to match.
- Pillar **renames** (Ala Ala / Likha / Plano / Utak / Tiangge) applied everywhere.
- **Hero dock = 5 pillars**, click swaps hero photo + copy + "Learn more →" jump; **logo = Home**.
- Wrote the **full website copy** (hook→gap→ecosystem, cliché blocklist), repositioned **planner-first + core-memory**, demoted Tiangge, dropped to the prototype.
- Subtopics: chips → in-depth descriptions → **card grid** → **carousel**.
- Per-feature **detail restored** from owner's own descriptions.
- **Interactive preview widget** on Ala Ala (Event grid / Editorial-with-Share / Dashboard), desktop+mobile frames.
- **Seamless full-screen snap** layout (no lines, 100vh snap, widget fits).
- **Accuracy reconciliation (2 rounds)** — copy corrected to shipped reality; see §5.
- **Editorials** now include "share to your socials."
- **Prices never hardcoded** — ₱3,999 renders from admin; ₱89,000 is an unstated value anchor; tiers link to `/pricing`.

---

## 5. Accuracy map — what's REAL vs ROLLING OUT vs COMING SOON (honesty lock)

Copy must not overclaim. Current truthful state:

| Feature | Reality | Copy stance |
|---|---|---|
| Papic | themes ✅, face-blur ✅, face-tag code ✅ but **model not hosted** (auto-tag dormant; photos delivered untagged); manual QR tag added | "face tagging (manual QR today, auto rolling out)"; NO "never hunt for your photo" |
| Live Studio | YouTube stream + multi-screen routing code ✅ but screen-side client + split/PIP TODO ("sold-not-usable") | "stream live… rolling out"; dropped "full control over all your screens" |
| Editorial | photos ✅ + guest commentaries ✅ + short clips ✅; **no full-length video render pipeline** (no FFmpeg/Remotion/owned-music) | "short clips (not full films)" |
| Guest list | self-RSVP for pre-added guests ✅ + per-guest QR ✅; no open self-registration, no gate-crasher tracking, no assistant | "self-RSVP + QR" live; gate-crasher + assistant "rolling out" |
| Mood board | one-click "notify my vendors", NOT automatic | "share with all vendors in one tap" |
| Budget | payment schedule ✅; vendor pricing entered manually (not real-time two-way) | kept schedule; dropped "both sides real-time" |
| Printable PDF | print exists for seating, mood board, QR, invitation — NOT budget/checklist/guest list/date picker | "seating/mood/QR/invite today, all Planuhan tools rolling out" |
| Surian matching | **deterministic** rule-based scoring (`compat-score.ts`, fixed weights); not learning, not LLM | "checks every option against your plan instantly"; NO "learns/self-improving" |
| Auto Build | does not exist (named builds = manual save-points) | "Coming soon" |
| TikTok booth | operator shell only; capture + compilation = Phase 4.1 TODO | "Coming soon" |
| Event types | **wedding-only in code**; Simple Event type partway built, not activated | "weddings today, every event type rolling out" |
| Tiangge perf | no deep performance breakdown; marketplace founder-seeded | "verified reviews + track record" live; "performance breakdown… rolling out" |
| 0% commission · free planning · Planuhan suite · seat plan · QR | real | stated plainly |

---

## 6. BUILD backlog (owner-committed — "let us build")

These are real product features the owner directed us to build (in the app repo, not the prototype). Logged in `DECISION_LOG.md` (2026-06-29 rows).

1. **Guest list — gate-crasher tracking** (people who RSVP but aren't on the host list) + a **per-guest personal assistant**.
2. **Mood board — send-to-all-vendors** action.
3. **Printable PDF — extend to ALL Planuhan tools** (budget, checklist, guest list, date picker).
4. **Tiangge — vendor performance breakdown** (response time, re-book rate, completion %) + the **data-collection pipeline** to populate it (marketplace needs population to feel real).
5. **Surian — continuous learning**: aggregate across all assisted customers which recommended options are most-picked, create added information, improve scoring over time. (Today deterministic; this makes it actually improve.)
6. **Auto Build (on Explore)** — one-tap autobuild a service set from each vendor's **starting price for the indicated pax**.
7. **Activate the multi-event-type engine** (Simple Event type) — per `project_setnayan_simple_event_type`: PR1 #2297 merged, PR2 #2299 armed, **activation migration pending owner SQL**. Must ship file→PR→CI (never out-of-band, per the migration standing rule).

---

## 7. What's NEXT (prioritized, prototype)

1. ~~Roll the interactive preview widget to the other pillars~~ — ✅ **DONE 2026-06-29.** All 5 pillars now have click-to-swap widgets (27 mockups): Ala Ala (3) · Likhaan `awLikhaan` (6) · Planuhan `awPlanuhan` (8) · Surian `awSurian` (4) · Tiangge `awTiangge` (6). Generic `selFeat()` + reusable mock primitives (`.mk-h/.mrow/.mchip/.mbar/.mtile/.msw/.mcal/.mck/.mbox/.mtbl`). DOM-verified + screenshots.
2. **Real hero photos / real screenshots** — replace the CSS "scene" gradients (pillar heroes) AND the 27 widget mockups (currently gradient/element stand-ins) with real desaturated event imagery + real product screenshots.
3. **Mobile gate** polish (the phone-frame previews exist; refine the gate on mobile).
4. **Section order decision** (OPEN): the prototype leads memory-first (Ala Ala 01); the copy doc is planner-first (Plano first). Owner to confirm.
5. **Add the full opening hook** as a section (the longer hook/gap paragraphs from the copy doc; only the one-line manifesto is in the prototype).
6. **Port to the live homepage** (`apps/web` in the app repo) once the direction is locked — note this **supersedes the warm-Alabaster + Instrument-Serif brand locks**; log + get explicit owner sign-off before overriding.

---

## 8. Open decisions for the owner

- **Section order:** memory-first (current) vs planner-first (copy)?
- **Snap firmness:** mandatory (current, firm) vs proximity (gentler)?
- **Commit the reskin?** It overrides the warm-palette + Instrument-Serif locks. Prototype is free; production needs sign-off.
- **Patiktok:** kept as "Coming soon" (recommended) — owner asked whether to remove; left in.

---

## 9. Files & pointers

- **Prototype:** `03_Strategy/Home_ELN_Reskin_2026-06-28.html` (serve: `home-proto` in `.claude/launch.json` → :8795; serve script `.claude/serve-home-proto.mjs`).
- **Copy:** `03_Strategy/Website_Copy_2026-06-29.md` (has a dated accuracy-pass note at the bottom that supersedes earlier bullets).
- **Decision log:** `DECISION_LOG.md` — 2026-06-29 rows (accuracy passes + build commitments).
- **Memories:** `project_setnayan_core_memory_positioning`, `project_setnayan_five_pillar_names`, `project_setnayan_eln_reskin_prototype` (this doc), plus the honesty/render-gap memories (`project_setnayan_no_video_render_pipeline`, `project_setnayan_panood_controller_build`, `project_setnayan_simple_event_type`).
- **Reference site:** https://www.espaciolanube.com (the template).
