# Pahina build — RESUME POINT (2026-07-26, session parked mid-Wave-A)

> For the next Claude Code session (any account). Read `BUILD_INSTRUCTIONS_FOR_OPUS_2026-07-25.md` in this folder first — it is the full 5-wave plan (§0–§12). This file is only WHERE WE STOPPED.

## State (updated 2026-07-26, session 2)

- **Wave branch:** `wave/a-pahina-reskin` on `iscasasola/setnayan-platform` — tip `f9c0c981c`.
  - PR-1 #3712 (tokens + Fraunces + gild/paper-deep/veil + `.sn-editorial` classes + vercel.json `claude/*` preview skip) — MERGED.
  - **PR-2 #3745 (masthead) — MERGED.** The blocking `tsc --noEmit` gate was run and came back CLEAN; PR opened and merged same session.
  - **PR-3 #3748 (chapter grammar) — MERGED.** See below.
  - **PR-4 #3750 (reply card · mosaic · colour exile) — MERGED.**
  - **PR-4b #3752 (RSVPed keepsake fork) — MERGED.**
- **Nothing is parked.** Next work starts fresh off `origin/wave/a-pahina-reskin`.

### ⚠ TWO OWNER DECISIONS PENDING (both from the RSVP surface)

1. **RSVP option labels** changed to the design spec's §7 wording: "I'll be there / Maybe / Can't
   make it" → **"Joyfully accepts / Undecided, for now / Regretfully declines."** The option `key`
   values are byte-identical so nothing downstream moved. Revert = three lines in `rsvp-widget.tsx`.
2. **The ask was NOT removed after replying.** Design §11 says "Gone. The ask never reappears once
   answered" — literally that drops the guest's only way to change their reply, meal preference or
   dietary notes, so the form was kept, demoted into a `<details>` ("Need to change your reply?")
   beneath the keepsake. If the owner meant it literally, delete the disclosure in `site-body.tsx`.

### Deferred from PR-4b — reasons, not scope

- **After-Event memento.** `PahinaKeepsake` already supports it (`variant="attended"`), but the
  editorial takeover `phasedBody` (`site-body.tsx:387`) is SHARED by both identity tiers, so a
  guest-only memento means branching a path that also serves anonymous visitors.
- **Editor's 5th preview tab — OWNER-GATED, do not build blind.** The build doc §4 says to "mirror
  how the sample event fakes guest context." **No such mechanism exists** — Maria & Jose is real
  seeded DB rows, and there is exactly ONE `kind:'guest'` construction site in the route
  (`app/[slug]/page.tsx` ~591), fed only by `loadGuestContext` past a verified guest cookie. A 5th
  tab therefore needs a fabricated 15-field `GuestSiteIdentity` rendered to a viewer holding NO
  guest cookie, behind a new public-route param (the `?phase=` allow-list at `page.tsx:365-386`
  would reject `rsvpd`). That is a new security surface beside the `anonymous-zero-guest` firewall.
  Gate it at least as strictly as `editorMode` (`page.tsx:396-405`) and get owner sign-off first.

### What PR-4 established

- **Functional-color exile is COMPLETE.** `grep -rn "success-\|warn-\|danger-\|emerald-" apps/web/app/[slug]`
  returns one comment line and nothing else. Keep it that way — new guest-tree code must use
  `gild` / `veil` / `paper-deep` / `terracotta{,-600,-700}` / `ink`.
- **Two colour traps, learned the hard way — respect these in PR-5 and Waves B–E:**
  1. `--color-gild` and `--color-terracotta` resolve to the **same value on light surfaces**. Never
     put a gild mark on a `bg-terracotta` fill (or vice versa) — it vanishes. Use `cream`/`ink`.
  2. `gild` is **decor-only** and fails contrast as small body text. Below ~0.85rem use
     `text-ink/70`. Gild is for heading-scale type, rules, dots, and numerals.
- New CSS in the layered Pahina block: `.pahina-letterpress`, `.pahina-deckle`, `.pahina-perforation`.
- The guest-personal layer is STARRED (`✦`), editorial chapters are NUMBERED (`№`) — `guest-hub-card`
  and `your-seat-block` now both follow this.

### What PR-3 established (read before PR-4)

- **Chapter numbering is now fixed:** `№ 01` hero · `№ 02` story · `№ 03` details · `№ 04` programme · `№ 05` dress code · **`№ 06` reserved for the gallery** · **`№ 07` RSVP** (spec §7). PR-4 must use 06 + 07.
- **Duplicate-№ rule:** any component that can co-occur with a numbered chapter takes an UNNUMBERED eyebrow (`our-love-story-widget`, `venue-widget`, the two "Good to know" notes, `tea-ceremony-card`, `guest-column-card`). The guest-personal layer is STARRED (`✦`), not numbered — per spec §11a. Follow this for the qr_card/hub plates.
- **`globals.css` Pahina block moved into `@layer components`.** It was unlayered, and unlayered CSS beats every `@layer` including utilities — a `.pahina-plate` could not be tuned with a Tailwind `bg-*`/`border-*`/`p-*` on the same element. It can now. New classes available: `.pahina-dropcap`, `.pahina-quote`, `.pahina-swatch` (plus PR-1's `.pahina-eyebrow`, `.pahina-plate`, `.pahina-rule`, `.pahina-grain`).
- Functional-color exile is UNDERWAY, not done — PR-3 cleared the day-of schedule wrapper, the Do/Don't boxes, the venue band, and `your-seat-block`'s emerald. PR-4 owns the rest of the grep sweep.
- **⚠ NO visual pass has been done on ANY Pahina PR yet.** A local one is not possible: the dev server falls back to the anon key (no service-role key in `apps/web/.env.local`), so `/maria-and-jose` 404s under RLS. The visual pass is owed on the **wave branch's Vercel preview** — which is also the only branch previews build for (§12 rule 2). Do this before the wave merges to main.

## Next actions, in order

1. **Visual pass on the wave branch's Vercel preview** — owed for PR-2 · 3 · 4 · 4b. 375px + desktop, palette-rich + palette-empty event, all four phases, plus an `attending` guest to see the keepsake. **This is the biggest outstanding risk in the wave** — four PRs of pure visual change and nothing has been eyeballed. Do this BEFORE PR-5 adds motion on top.
2. **PR-5**: motion + Candlelight Pro toggle (migration!) + Cormorant drop.
3. The two deferred PR-4b items above, once the owner has ruled on the editor tab.
4. Wave A done → OWNER previews the wave branch → ONE merge to main. Then Waves B–E (§ plan).

## Standing rulings that override older lines in the build doc

- **Chrome is a CLONE:** `site-menu-bar.tsx` + `guest-hub-bar.tsx` = palette-token-only diffs. NO bar merge, NO invented camera notch (supersedes §5 PR-2's merge idea). GuestHubBar untouched beyond tokens.
- Reskin-never-drop (§5 inventory = acceptance checklist). Goldens test PLAN, not markup — pure restyling safe; STRUCTURAL changes flagged in commit body.
- Verify BEFORE arming auto-merge. Changelog fragments at REPO ROOT `changelog.d/`. Prune each worktree after its PR merges.
