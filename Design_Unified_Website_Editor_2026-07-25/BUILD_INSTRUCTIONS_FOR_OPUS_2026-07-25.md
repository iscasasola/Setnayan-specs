# Unified Website Editor — Build Instructions (Fable → Opus handoff, 2026-07-25)

> **For the implementing session (Opus).** Design authority = [`Unified_Website_Editor_Design_Spec_2026-07-25.md`](Unified_Website_Editor_Design_Spec_2026-07-25.md) + [`unified_editor_prototype.html`](unified_editor_prototype.html) (open it; toggle Free/Pro bottom-right; note the two-way sync). This doc is the execution plan: 5 PRs, each independently shippable, standard workflow (one worktree off latest `origin/main` per PR → tsc on touched files + `next lint` + relevant unit tests → changelog.d fragment → PR → `gh pr merge --auto --merge` → prune worktree). No schema changes anywhere — **zero migrations in this program.**

## Owner-locked decisions (do not re-ask)
1. ONE editing surface for the whole website, free + Pro, edited while seeing the site (2026-07-25).
2. **Launch page merges INTO the editor** — nav "Launch" opens the editor; `/website/launch` becomes a redirect (2026-07-25 "rebuild the launch page now and improve it").
3. **`/site-editor` is retired → redirect** (2026-07-25). Port `rsvp_backdrop` first; delete its dupe hero actions.
4. Website Pro split + grandfather rules are FINAL as shipped in #3661/#3663/#3664 (see [[project_setnayan_launch_settings_pro_split]]). The editor changes presentation, never entitlement logic.

## Reuse inventory (the write layer — call these, never fork)
- `widgets/actions.ts`: `toggleWidgetVisibility` · `moveWidgetUp/Down` · `setSectionMode` (+ `lib/website-section-content.ts` `computeSectionContentMap` for status chips).
- `hero-photo/actions.ts`: `uploadHeroPhoto` / `removeHeroPhoto`.
- `our-photos/actions.ts`: `updateOurPhotos` (Pro+grandfather-gated already, PR-B).
- `site-chrome/actions.ts`: `updateSiteChrome` (music Pro-gated already; hero video free).
- `colors/actions.ts` (PR-C): bg/button color save.
- `privacy/actions.ts`: `updateLandingPageVisibility` (+ anon-`secured` branch — leave its gate alone).
- `dress-code` / `photo-moments` / `special-message` / `what-to-bring` / `our-story` / `editorial` actions — as-is.
- OLD `site-editor/actions.ts`: `saveRsvpBackdrop` / `clearRsvpBackdrop` — the ONLY logic worth porting; `saveHeroPhoto`/`clearHeroPhoto` there are DUPES → delete with the route.
- Go-live: `LaunchStdButton` (STD studio component) — mount in the editor topbar.
- Entitlement: `eventCoupleWebsiteProActive` · gates from PR-B (`website-pro-lock.tsx` shared lock UI).
- Preview mechanics: same-origin iframe + host-only `?phase=` (proven in `WebsiteLaunchPreview`); slug-edit action — grep (`dashboard/(account)/profile/actions.ts` or invitation page) and reuse/deep-link.

---

## PR-1 — Editor shell + live preview + two-way sync + link re-point (fixes the owner's bug)
**Route:** `apps/web/app/dashboard/[eventId]/website/editor/page.tsx` (+ `_components/`). Gate = couple member + `surfaceEnabled(profile,'website')` (copy the launch page's gates).
**Layout (prototype):** topbar (`Website editor · names — setnayan.com/slug` · `View live ↗` · `LaunchStdButton` + status chip) · left rail groups ①②③ · right iframe.
- Rail rows PR-1 = **header + status chip + deep-link** to the existing editor page (inline panels come in PR-3/4). Status chips: reuse launch-page logic + `computeSectionContentMap`. Pro rows: gold `PRO` chip; locked → lock-note + link `/studio/website-pro` (PR-4 upgrades this to the sheet).
- **Preview pane:** `<iframe src={/[slug]?phase=X&editor=1}>` with the 4 phase tabs. Client component; reload on `router.refresh()`.
- **Two-way sync:**
  - Rail→preview: each row carries `anchor` (SITE_MENU_ANCHORS / widget section ids); on select, postMessage `{t:'scrollTo',anchor}` into the iframe.
  - Preview→rail: in `app/[slug]`, when `?editor=1` AND the server-verified host check passes (same fence as `?phase=` — **guests get ZERO new bytes; goldens are the fence**), mount one small client component that (a) listens for `scrollTo`, (b) decorates sections (`[data-editor-key]` attrs added ONLY in editor mode) with a hover ✎ affordance that posts `{t:'edit',key}` up. Parent maps key→rail row, opens it.
  - Verify origin on both sides of postMessage (`event.origin === location.origin`).
- **Re-point every `/site-editor` link** → editor (THE bug fix): `grep -rn "site-editor" apps/web --include="*.tsx" --include="*.ts"` — known: launch page freeCards (url/map/theme) + colors placeholders if any remain, `WebsiteLaunchPreview` editHref, old website board `page.tsx`. Point at `editor` (use `#<anchor>` where a row exists).
- **Nav re-point:** `customer-nav-config.ts` launchItem `href`/`matchPrefix` → `${base}/website/editor` (label stays "Launch"). Update the comment (owner 2026-07-25 supersedes 2026-07-24 href).
- **Mobile:** `Edit ⇄ Preview` toggle (CSS + state), preview-tap returns to Edit with the row open.
**Gates:** tsc/lint on touched files · `site-body-plan` goldens green · `anonymous-zero-guest` green (editor-mode bytes are host-gated) · manual: `?editor=1` as anon adds nothing (curl-diff the HTML if in doubt).

## PR-2 — Retire `/site-editor` + merge `/website/launch`
1. Port `rsvp_backdrop`: new `website/editor/actions.ts` exporting `saveRsvpBackdrop`/`clearRsvpBackdrop` (move code verbatim; host gate via `lib/host-gate`); PR-3 gives it a panel — PR-2 can expose it as a minimal RSVP-row panel or hold the control until PR-3 if cleaner (**do not delete the old route before the port lands**).
2. `app/site-editor/[eventId]/{page,rsvp,event,editorial}/page.tsx` → `redirect('/dashboard/'+eventId+'/website/editor')` (thin server components); DELETE `_components/site-editor.tsx` (1,333 lines), `_data.ts`, old `actions.ts` (after port). Grep first: `grep -rn "site-editor" apps/web lib` INCLUDING `lib/help.ts`, email templates, guided tours (0030), `llms.txt` — re-point any copy.
3. `/website/launch/page.tsx` → `redirect(...editor)`; `WebsiteLaunchPreview` moves to `website/editor/_components/` if reused for the phase tabs, else delete. `changelog.d` notes Launch merge (owner 2026-07-25).
**Gates:** tsc/lint · grep proves zero remaining `site-editor` references · `next build` (route deletions).

## PR-3 — Inline panels, FREE set
Convert free rail rows to expandable inline panels (prototype styling) calling existing actions: hero photo (upload via existing `<FileUpload>` flow) · our story · details/schedule (+ map-link field — reuse whatever `site-editor`/invitation used; grep `waze|map_link`) · dress code · photo moments · special message · what to bring · sections mode/order (Auto·Shown·Hidden + Up/Down from widgets editor) · URL (slug action) · visibility + open-browse · theme · RSVP backdrop (ported). Saves → action → `router.refresh()` → iframe reloads. Keep `/website/*` sub-pages working (redirects come in PR-5).
**Gates:** tsc/lint · each action still covered by its existing tests · manual save→preview-refresh pass.

## PR-4 — Inline panels, PRO set + unlock sheet
Colors · background music (music field only; video stays free) · photo gallery · editorial entry · Save-the-Date chapter quick-controls (opening picker + video slot; deep "Design →" link into `/studio/save-the-date` stays). Locked rows: panel = lock-note + **umbrella sheet** (7 perks + watermark line, prototype's sheet) → `/studio/website-pro`. Respect PR-B grandfather (content present ⇒ behaves unlocked). Reuse `website-pro-lock.tsx` where it fits.
**Gates:** tsc/lint · gating parity spot-check vs `/website/*` pages (same entitlement outcomes).

## PR-5 — Cleanup: thin the sub-pages
`/website/{hero-photo,our-photos,site-chrome,colors,widgets,dress-code,photo-moments,special-message,what-to-bring,our-story,editorial,privacy}` → `redirect('...editor#<anchor>')` — **actions files stay** (the write layer lives there). Keep `/website/page.tsx` board → redirect to editor too (it's a link-hub dupe). Re-grep all inbound links (overview cards, tours, help). Corpus close-out: DECISION_LOG row + update [[project_setnayan_unified_website_editor]] memory to SHIPPED.
**Gates:** `next build` · grep zero stale hrefs · full `test:unit` in CI.

---

## Hard invariants (every PR)
- **Guest bytes:** `/[slug]` renders byte-identical for guests/anon — all editor affordances behind the server-verified host check + `?editor=1`. Goldens + `anonymous-zero-guest` are the fence; never weaken them.
- **Never fork the write layer** — a panel that can't cleanly call the existing action DEEP-LINKS instead (correctness over completeness).
- **Entitlement logic untouched** — presentation only; PR-B owns gating truth.
- Worktree hygiene per [[feedback_prune_worktree_after_merge]]; verify before arming per [[feedback_verify_before_automerge]]; changelog.d fragment every PR; no `CHANGELOG.md`/`STATUS.md` edits.

## Acceptance (owner walkthrough after PR-5)
Sidebar **Launch** → editor opens with live preview · tap "Our story" ON the site → its panel opens · edit + save → preview updates in place · phase tabs show all four pages · Free couple sees gold PRO tags + one ₱3,500 sheet · Pro couple edits everything inline · any old `/site-editor` or `/website/launch` URL lands on the editor · guest/anon page bytes unchanged.
