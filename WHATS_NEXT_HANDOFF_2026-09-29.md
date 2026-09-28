# WHAT'S NEXT — handoff 2026-09-29 (controller, account C)

> Supersedes `WHATS_NEXT_HANDOFF_2026-09-28.md` for ORDER and PLAN. Verify every line against
> GitHub / Vercel / prod before acting — a handoff is not evidence.

## 1 · The plan of record
**`EVENT_HUB_BUILD_PLAN_2026-09-28.md`, top section "⭐ FINAL BUILD SEQUENCE".** Every table below it
in that file is history.

**Order (owner, verbatim 2026-09-29: "Finish all Event Hub first then Apple Check · So Stage A,C,E ·
Then D · Then B"): A → C → E → D → B.** The Apple check is LAST — no longer Thursday 1 Oct.
- **A** — finish, merge as ONE train, deploy the builds running now (§3).
- **C** — Details, five parts (1 frame + theme gallery + Prints fold · 2 Your event / Words / Schedule /
  RSVP / wedding march / date finder / tap-on-stage · 3 Mood Board, Logo, Hero, Reveal move in; place
  menu = 4 stages + Details · 4 seat plan in three columns · 5 the guided 3-round flow).
- **E** — per-letter styling (adapts to text edits) · Both view · A3 poster · STD auto-play · palette
  person · dashboard card wears the cover · STD film replay fix · Post Event scenes. **No 50 themes**
  (owner: "no 50 themes yet").
- **D** — the event menu becomes Home · Guest list · Your Team · Event Hub Maker · Our Services.
- **B** — the Apple check.
- **Lane 2** (not Event Hub) runs beside it, 1–2 at a time: Our Services page · Guest list takes
  Hosts + Check-in, Your Team takes Budget · People page · account sync · service cards + marketplace ·
  supplier toolkit · SEO.

## 2 · Approved references (open these, don't redraw them)
- `prototypes/event_hub_maker_blueprint_2026-09-29.html` — the whole Maker: Part 1 moved-not-invented
  ledger (17 rows, each citing its shipped source) · Part 2 the 23 new rules · Part 3 presentation.
  Owner: "ok".
- `prototypes/details_themes_page_2026-09-28.html` — Details (three columns, groups, ✓/○, Used on,
  What's left), the 19-step guided flow (`?view=easy&step=N`), seat plan, Apply sheet, wedding march.
- `prototypes/event_hub_sequence_2026-09-29.html` — the three rounds, step 1 to finish.
- DECISION_LOG rows dated 2026-09-28 → 2026-09-29 hold every ruling (do not re-ask them).

**Showing a prototype to the owner:** `.claude/launch.json` → "setnayan-prototypes" (a tiny node
server over a scratchpad copy). The preview launcher cannot read `~/Documents` (python's getcwd
fails), and `file://` pages render their inner iframes blank. Copy the HTML + `theme-posters/` into
the served folder, then `preview_start`.

## 3 · In flight at handoff (all `do-not-auto-merge`; the controller merges)
| PR / branch | Build |
|---|---|
| #6091 `rd/try-pro-pay-at-apply` | Try Pro, pay at Apply · ◆ no padlocks · "Unlock Pro and Apply" (pays then applies) · + Add only on stages · free-version bar |
| #6088 `rd/hero-hub-link-editable` | hero link, Date, photo caption editable + "every hero word is a part" guard |
| #6089 `rd/rows-arrive-one-by-one` | rows arrive one by one, incl. pinned Scrub/Auto runs |
| #6087 `rd/scene-upload-media` | scene Upload media always there, in-place upload, parallax, video (reuse Main background) |
| `rd/circle-qr-fills-the-circle` | circle QR fills the disc; decode test for every look |
| `rd/logo-centred-by-its-ink` | logo centred by ink · all stage fonts · snap-to-centre sliders |
| `rd/preview-way-back` | "Back to the Maker" on the draft preview; same view on phone/app |
| `rd/modern-cyber-free` | Modern + Cyber Neon free; theme counts from the registry |
| `rd/maker-never-slow` | speed audit (table first) → fix worst → JS budget + optimistic-path guards |
| `rd/pakanta-is-music-maker` | visible renames: Music Maker · Group · Memories · Loved ones (identifiers unchanged) |
| `rd/themes-on-details-page` | Details part 1 (local groundwork commits; skeleton push pending) |
Not ours: #6090, #6077 (host invites — another session), #5911, #5874.

## 4 · Owner rules to put in EVERY builder prompt
Opus builds, Fable designs · no "Edit in X ↗" link-outs — the field sits where you are · ◆ marks Pro,
never a padlock, never blocks; Apply is the gate · any set of choices is one PickMenu dropdown · phone
first (375/390, touch) · plain words; only **Papic** and **Patiktok** keep custom names · never drive
the owner's signed-in Browser pane · never open cale-ice's Maker · PR with `do-not-auto-merge`,
verify `autoMergeRequest` is null · every build reaches the owner as a CHECK CARD.

## 5 · Traps that cost time on 2026-09-28/29
- **The heavy lock is the bottleneck.** ~10 builders queue for one tsc/suite slot; a 2-minute tsc took
  29 minutes of waiting. Give each builder the ONE-command form:
  `LOCK=~/Documents/Claude/Projects/heavy-lock.sh; $LOCK acquire <label> && ( <job> ); rc=$?; $LOCK release <label>`.
  A job held > 1 h is treated as stale and another builder takes the lock mid-run.
- **Every PR regenerates `apps/web/scripts/port-control-baseline.json`**, so each sibling merge turns
  the rest DIRTY (+~50 min CI each). Fold ready PRs into ONE train branch, regenerate once, arm only
  the train, disarm the members (#6082, #6085 did this).
- **A bracketed test path passed alone runs zero tests** — escape `[`/`]` (`sed 's/\[/\\[/g; s/\]/\\]/g'`).
- **The deploy cron (:07 every 4 h) skips runs.** Deploy with `gh workflow run deploy-prod.yml --ref main`
  and confirm with `setnayan-handoff-src/tools/controller/wait-served.sh <sha> <run>` — merged is not deployed.
- **"View as a free couple" confused the owner twice** (stays on 24 h; thin strip). #6091 makes it a clear
  bar that switches off on leaving the Maker — until then, tell him to tap Stop.

## 6 · Open owner answers (none urgent)
1. Panood's plain name (recommended "Watch Live").
2. Remove the Logo Maker menu row (recommended yes).
3. Seat plan: one new action to switch "Guests see this now" back OFF (+1 server action).
4. Lane 2 L5: the five questions in `AFTER_APPLE_BUILD_LIST_2026-09-28.md` §2C.

## 7 · Usage
Weekly all-models 34% at 16:26Z 28 Sep (resets 29 Sep 14:00Z). Owner: zip at ~90% and ~97%;
**STOP all builders at 98%** and hand off.
