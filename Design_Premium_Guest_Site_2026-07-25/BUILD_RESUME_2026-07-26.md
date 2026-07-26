# Pahina build — RESUME POINT (2026-07-26, session parked mid-Wave-A)

> For the next Claude Code session (any account). Read `BUILD_INSTRUCTIONS_FOR_OPUS_2026-07-25.md` in this folder first — it is the full 5-wave plan (§0–§12). This file is only WHERE WE STOPPED.

## State (updated 2026-07-26, session 2)

- **Wave branch:** `wave/a-pahina-reskin` on `iscasasola/setnayan-platform` — tip `f9c0c981c`.
  - PR-1 #3712 (tokens + Fraunces + gild/paper-deep/veil + `.sn-editorial` classes + vercel.json `claude/*` preview skip) — MERGED.
  - **PR-2 #3745 (masthead) — MERGED.** The blocking `tsc --noEmit` gate was run and came back CLEAN; PR opened and merged same session.
  - **PR-3 #3748 (chapter grammar) — MERGED.** See below.
- **Nothing is parked.** Next work starts fresh off `origin/wave/a-pahina-reskin`.

### What PR-3 established (read before PR-4)

- **Chapter numbering is now fixed:** `№ 01` hero · `№ 02` story · `№ 03` details · `№ 04` programme · `№ 05` dress code · **`№ 06` reserved for the gallery** · **`№ 07` RSVP** (spec §7). PR-4 must use 06 + 07.
- **Duplicate-№ rule:** any component that can co-occur with a numbered chapter takes an UNNUMBERED eyebrow (`our-love-story-widget`, `venue-widget`, the two "Good to know" notes, `tea-ceremony-card`, `guest-column-card`). The guest-personal layer is STARRED (`✦`), not numbered — per spec §11a. Follow this for the qr_card/hub plates.
- **`globals.css` Pahina block moved into `@layer components`.** It was unlayered, and unlayered CSS beats every `@layer` including utilities — a `.pahina-plate` could not be tuned with a Tailwind `bg-*`/`border-*`/`p-*` on the same element. It can now. New classes available: `.pahina-dropcap`, `.pahina-quote`, `.pahina-swatch` (plus PR-1's `.pahina-eyebrow`, `.pahina-plate`, `.pahina-rule`, `.pahina-grain`).
- Functional-color exile is UNDERWAY, not done — PR-3 cleared the day-of schedule wrapper, the Do/Don't boxes, the venue band, and `your-seat-block`'s emerald. PR-4 owns the rest of the grep sweep.
- **⚠ NO visual pass has been done on ANY Pahina PR yet.** A local one is not possible: the dev server falls back to the anon key (no service-role key in `apps/web/.env.local`), so `/maria-and-jose` 404s under RLS. The visual pass is owed on the **wave branch's Vercel preview** — which is also the only branch previews build for (§12 rule 2). Do this before the wave merges to main.

## Next actions, in order

1. **PR-4**: reply card RSVP (wording per spec §7: "Joyfully accepts / Undecided, for now / Regretfully declines") + qr_card place card + gallery mosaic (`№ 06`) + RSVP chapter (`№ 07`) + full `success-*`/`warn-*` grep sweep under `app/[slug]/` (includes `arrival-greeting.tsx` `text-emerald-700`, `guest-hub-card.tsx` badges, and the `warn-*` blocks at `site-body.tsx` ~562/~1013/~1267) + **the GuestHubCard hub-plate restyle (resequenced here from PR-2)**.
2. **PR-4b**: RSVPed keepsake fork (per-guest, inside rsvp phase — NO new LifecyclePhase) + unified-editor 5th preview tab (§4).
3. **PR-5**: motion + Candlelight Pro toggle (migration!) + Cormorant drop.
4. **Visual pass on the wave branch's Vercel preview** — still owed for PR-2 + PR-3 (see State above). 375px + desktop, palette-rich + palette-empty event, all four phases.
5. Wave A done → OWNER previews the wave branch → ONE merge to main. Then Waves B–E (§ plan).

## Standing rulings that override older lines in the build doc

- **Chrome is a CLONE:** `site-menu-bar.tsx` + `guest-hub-bar.tsx` = palette-token-only diffs. NO bar merge, NO invented camera notch (supersedes §5 PR-2's merge idea). GuestHubBar untouched beyond tokens.
- Reskin-never-drop (§5 inventory = acceptance checklist). Goldens test PLAN, not markup — pure restyling safe; STRUCTURAL changes flagged in commit body.
- Verify BEFORE arming auto-merge. Changelog fragments at REPO ROOT `changelog.d/`. Prune each worktree after its PR merges.
