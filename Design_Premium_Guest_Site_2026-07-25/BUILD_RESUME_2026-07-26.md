# Pahina build — RESUME POINT (2026-07-26, session parked mid-Wave-A)

> For the next Claude Code session (any account). Read `BUILD_INSTRUCTIONS_FOR_OPUS_2026-07-25.md` in this folder first — it is the full 5-wave plan (§0–§12). This file is only WHERE WE STOPPED.

## State

- **Wave branch:** `wave/a-pahina-reskin` on `iscasasola/setnayan-platform` — tip `e3c829a0b` = PR-1 (#3712, tokens + Fraunces + gild/paper-deep/veil + `.sn-editorial` classes + vercel.json `claude/*` preview skip) MERGED into the wave.
- **PR-2 is COMMITTED + PUSHED but NO PR OPENED:** branch `origin/claude/pahina-pr2-masthead` @ `eefc9f12b`.
  - Contents: NEW `apps/web/app/[slug]/_components/pahina-masthead.tsx` (shared masthead + `splitCoupleNames`) replacing ALL 4 hero call-sites in `site-body.tsx` (STRUCTURAL — photo demoted to cover plate; `SITE_MENU_ANCHORS` markers are separate nodes, editor-bridge verified safe); `invitation-shell.tsx` monogram header slot + footer sign-off (`monogramText` prop threaded from SiteBody); `countdown.tsx` + `site-menu-bar.tsx` class-only; `font-pahina` tailwind util; changelog fragment `changelog.d/pahina-pr2-masthead.md`.
  - Verified: `next lint` clean · 27/27 unit+golden tests green (`site-body-plan*`, `anonymous-zero-guest`, `site-menu`).
  - **⚠ NOT verified: `tsc --noEmit` never completed (machine contention killed it twice).**

## Next actions, in order

1. Fresh worktree off `origin/claude/pahina-pr2-masthead` → run `npx tsc --noEmit` in `apps/web`. If clean: `gh pr create --base wave/a-pahina-reskin` + `gh pr merge --auto --merge`. (PRs target the WAVE branch, never main — §12 cost rule.)
2. **PR-3 — chapters** (touchpoints already scoped):
   - `our-story.tsx`: chapter `№ 02` eyebrow + drop cap on first paragraph + italic pull quote with gild left rule.
   - `dress-code-widget.tsx`: silk swatches; KEEP the INC/Muslim modesty fallbacks + genderNote verbatim; the Do/Don't `success-*`/`danger-*` boxes get palette-derived tones.
   - `venue-widget.tsx` + `PublicEventDetails` in `empty-states.tsx`: paper-deep plates, gild mono CEREMONY/RECEPTION keys, Fraunces venue names; keep `NavLinksRow` (Maps/Waze/Apple) verbatim.
   - `schedule-widget.tsx`: programme rail (mono gild time column, hairlines); NOW row = accent left rule.
   - `site-body.tsx` line ~876: greeting → salutation restyle (keep personalization). Line ~907: REMOVE the `border-success-300 bg-success-50/50` promoted-schedule wrapper — the functional-color exile starts here.
   - Also (build plan §5): `YourSeatBlock`, `TeaCeremonyCard`, `GuestColumnCard`, `special_message`/`what_to_bring` → "Good to know" plates.
3. **PR-4**: reply card RSVP + qr_card place card + gallery mosaic + full `success-*`/`warn-*` grep sweep under `app/[slug]/` (includes `arrival-greeting.tsx` `text-emerald-700` and `guest-hub-card.tsx` badges) + **the GuestHubCard hub-plate restyle (resequenced here from PR-2)**.
4. **PR-4b**: RSVPed keepsake fork (per-guest, inside rsvp phase — NO new LifecyclePhase) + unified-editor 5th preview tab (§4).
5. **PR-5**: motion + Candlelight Pro toggle (migration!) + Cormorant drop.
6. Wave A done → OWNER previews the wave branch → ONE merge to main. Then Waves B–E (§ plan).

## Standing rulings that override older lines in the build doc

- **Chrome is a CLONE:** `site-menu-bar.tsx` + `guest-hub-bar.tsx` = palette-token-only diffs. NO bar merge, NO invented camera notch (supersedes §5 PR-2's merge idea). GuestHubBar untouched beyond tokens.
- Reskin-never-drop (§5 inventory = acceptance checklist). Goldens test PLAN, not markup — pure restyling safe; STRUCTURAL changes flagged in commit body.
- Verify BEFORE arming auto-merge. Changelog fragments at REPO ROOT `changelog.d/`. Prune each worktree after its PR merges.
