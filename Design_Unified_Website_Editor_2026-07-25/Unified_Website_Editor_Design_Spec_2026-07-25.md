# Unified Website Editor — Design Spec (2026-07-25)

> **Fable design pass** for the owner ask (2026-07-25): *"integrate all functions and remove dupes. one whole editing page for their website, from all the free and all the upgrades"* — after finding that preview/edit links jump to the old `/site-editor` ("an old website") and editing is scattered. Prototype: [`unified_editor_prototype.html`](unified_editor_prototype.html) — interactions verified (preview-tap→rail opens · rail-tap→preview scrolls+highlights · Pro lock/unlock states; demo toggle bottom-right). Owner decisions locked this thread: **design-first (Fable)** · **retire `/site-editor` → redirect**.

## 0 · The problem being solved

Editing "the website" today spans **two paradigms and ~18 routes**: the legacy `/site-editor/[id]` (+3 phase sub-pages) and the newer `/dashboard/[id]/website/*` (13 feature pages), plus Save-the-Date bits in `/studio/save-the-date`. The old editor is mostly a **link hub** with exactly **two unique things**: the `rsvp_backdrop` picker (edited nowhere else) and a duplicate hero-photo save/clear (PR #3642 already flagged). Preview links still point into the old tree — that's the "jumps to an old website" bug.

## 1 · Design (see prototype)

**One route. Two panes. The site is always visible.**

- **Topbar:** `Website editor · [names] — setnayan.com/[slug]` · `View live ↗` · `Go live · or schedule` (absorbs LaunchStdButton). Mobile: an `Edit ⇄ Preview` switch.
- **Left rail (controls, ~390px):** three groups mirroring how the couple thinks, not our file tree:
  - **① Site** — Wedding URL · Who can view (+ open browsing) · Theme · **Colors [PRO]** · **Background music [PRO]**
  - **② Sections** — the widget list in display order (drag/⠿ + Auto·Shown·Hidden), each row expands to an **inline edit panel** (hero photo, our story, details/schedule + map link, dress code, photo moments, special message, what to bring, **photo gallery [PRO]**, RSVP incl. the ported **rsvp_backdrop** picker)
  - **③ Chapters** — **Save-the-Date** (launch date · **Cinematic opening [PRO]** · **your video [PRO]**) · Wedding day · **After/editorial [PRO]**
- **Right pane (live preview):** the couple's REAL `/[slug]` page in a same-origin iframe (host session rides along — the proven `WebsiteLaunchPreview` mechanic), with **phase tabs** (Save-the-Date / Invitation / Wedding day / After) via the host-only `?phase=` override.

**Interaction contract (the whole point):**
1. **Rail → preview:** selecting a rail row scrolls the preview to that section + flashes a highlight (drive via the existing `SITE_MENU_ANCHORS` + widget anchor ids; postMessage from parent → a tiny host-only listener in the site page, or URL-fragment reload).
2. **Preview → rail:** in editor context (`?editor=1`, host-gated), sections get a hover "✎ Edit" affordance; tapping posts the section key up to the parent, which opens that rail row. *Guests never see this — editor affordances mount only for the host inside the editor iframe.*
3. **Save → refresh:** panel saves call the EXISTING server actions, then reload the iframe (`revalidateGuestSite` already invalidates). No optimistic mirror-rendering — the iframe IS the truth (this is what kills the drift/dupe problem).
4. **Pro in place:** PRO rows sit where they belong with a gold tag. Locked: the panel shows one lock-note + `Unlock ₱3,500` → the umbrella sheet (7 perks + watermark note) → `/studio/website-pro` checkout. Unlocked: the same row is just… an editor. Grandfathered rows (existing content, PR-B rule) behave unlocked.
5. **Mobile (PH-first):** rail is full-screen; `Edit ⇄ Preview` toggles panes; preview-tap jumps back to Edit with the right row open.

## 2 · Route + migration plan (remove dupes, keep the write layer)

**Principle: the unified editor is a NEW VIEW over the EXISTING write layer.** Every server action shipped in `/website/*/actions.ts` (+ widgets `setSectionMode`, colors, site-chrome…) is reused verbatim — no new write paths, no re-validation forks.

| Surface | Fate |
|---|---|
| **NEW** `/dashboard/[eventId]/website/editor` | The unified editor (this design). |
| `/site-editor/[id]` + `rsvp/event/editorial` + `_components` + `_data` | **RETIRED → `redirect()`** to the editor (owner-locked). Port `rsvp_backdrop` save/clear into the RSVP section panel first; DELETE the duplicate `saveHeroPhoto`/`clearHeroPhoto`. |
| `/website/*` 13 sub-pages | Actions stay (write layer). Pages KEPT initially (deep-links from Launch cards still work), then thinned to redirects into `editor#<section>` in the cleanup PR. |
| `/website/launch` (PR-A) | **MERGED INTO THE EDITOR (owner 2026-07-25 "rebuild the launch page now and improve it").** The editor IS the Launch surface: nav "Launch" → `/website/editor`; go-live hero collapses into the editor topbar (`Go live · or schedule` + status chip + URL) exactly as the prototype shows; the FREE band's status chips become the rail rows' chips; the PRO band becomes the in-place gold tags + the umbrella unlock sheet. `/website/launch` → `redirect()` to the editor. Nothing wasted: PR-A's entitlement read, status logic, and copy migrate in. |
| `/studio/save-the-date` | KEPT (the film studio is deeper than a panel); the ③ Save-the-Date chapter hosts launch-date + opening/video quick controls and links into the studio for the full experience. |
| Old `WebsiteLaunchPreview` | Superseded by the editor's preview pane; Launch keeps a thin phase-preview or links to the editor. |

## 3 · Build plan (Opus, phased — each PR shippable)

1. **PR-1 · Shell + preview + sync:** `/website/editor` route (couple-gated), two-pane layout, iframe preview with phase tabs, rail with groups ①②③ where every row deep-links (no inline panels yet). Preview→rail + rail→preview sync via anchors/postMessage (`?editor=1` host-gated affordance). **Re-point ALL `/site-editor` links** (launch free cards URL/map/theme, WebsiteLaunchPreview edit links, any others — grep `site-editor`) at the editor. *This alone fixes the "jumps to an old website" complaint.*
2. **PR-2 · Retire `/site-editor`:** port `rsvp_backdrop` picker into the editor's RSVP panel (reuse `saveRsvpBackdrop`/`clearRsvpBackdrop` moved to a `/website` actions home); delete dupe hero actions; `/site-editor/*` → `redirect('/dashboard/[id]/website/editor')`. Delete `_components/site-editor.tsx` (1,333 lines) + `_data.ts`.
3. **PR-3 · Inline panels, free set:** absorb hero photo · our story · details/map · dress code · photo moments · special message · what to bring · sections mode/order · URL · visibility/open-browse · theme as inline rail panels calling the existing actions.
4. **PR-4 · Inline panels, Pro set + unlock sheet:** colors · music · gallery · STD opening/video quick-controls · editorial entry, with the lock-note/grandfather behavior (PR-B rules) + the umbrella sheet.
5. **PR-5 · Cleanup:** thin `/website/*` sub-pages to redirects (`editor#<section>`), re-point Launch cards, retire the old preview component, corpus/DECISION_LOG close-out.

## 4 · Flags (surfaced, not silently decided)

- **`?editor=1` affordance is host-gated** and must add ZERO bytes to guest renders (same pattern as `?phase=`). Byte-lock goldens stay the fence.
- The 1,333-line `site-editor.tsx` also carries service deep-links (papic/panood/patiktok etc.) — those live on Launch/Studio already; deleting is safe, but PR-2 should grep for anything unique before the kill.
- `/site-editor` may be linked from emails/help copy — PR-2 must grep `site-editor` across `lib/email*`, `help.ts`, guided tours.
- Drag-reorder in ② can ship as Up/Down first (matches existing widgets editor; no new deps) — drag is polish.

*Fable, 2026-07-25. Interactions verified in-browser. Next: owner switches to Opus → "build it" → PR-1.*
