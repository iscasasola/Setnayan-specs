# Launch → Settings-First — Design Spec (2026-07-24)

> **Fable design pass** for the owner ask (2026-07-24): *"when we open Launch, instead of the website, we start by the settings — as free, and the settings when Website Pro is unlocked."* Prototype: [`launch_settings_prototype.html`](launch_settings_prototype.html) (top-right toggle previews both entitlement states). Implementation = Opus, repo PR workflow.

## 1 · What changes (and what doesn't)

- **The guest website itself changes ZERO.** `/[slug]` (the live 4-in-1 site + open-browse stack) is untouched.
- **The sidebar "Launch" item** (`customer-nav-config.ts` — today `href: /${slug}`, falling back to `/website/launch`) now points at the redesigned **`/dashboard/[eventId]/website/launch`** always. The live site stays one click away ("View my site ↗" in the hero card).
- The existing `/website/launch` page (go-live control + 4-phase preview) is **absorbed**: its `LaunchStdButton` becomes the hero card's "Go live · or schedule" action; the 4-phase `WebsiteLaunchPreview` moves behind "View my site" / a secondary "Preview each page" row (keep the component, don't delete).

## 2 · Page anatomy (top → bottom)

1. **Go-live hero card** (dark plaque) — status line (Private / Scheduled / Live), the couple's URL, `View my site ↗` (ghost), `Go live · or schedule` (gold, opens the existing LaunchStdButton panel). Always free.
2. **FREE band — "Set up your site"** (chip: FREE). Cards, each = icon · name · one-liner · status chip · deep-link to the EXISTING editor (no new editors):
   URL (slug) · Who can view (privacy) · **Open browsing** (open-browse toggle → board) · Sections (widgets editor w/ Auto·Shown·Hidden) · Hero photo · **Map link** · **Theme** · Live media for visitors.
3. **WEBSITE PRO band — "The cinematic layer"** (bordered gold-tinted panel, `₱3,500 · one-time` tag): the owner's seven —
   **Cinematic Reveal · Save-the-Date video · Photo gallery · Background music · Editorial editing · Background color · Button color.**
   - **Locked state** (no `COUPLE_WEBSITE_PRO`): cards show `🔒 Part of Website Pro` in place of their edit links; ONE umbrella CTA plaque at the band's foot: "Unlock Website Pro · ₱3,500" → checkout. Never seven separate buy buttons.
   - **Unlocked state:** tag swaps to `✓ Unlocked`, CTA plaque disappears, every card gets its status chip + edit deep-link.
   - Footnote either state: "Website Pro also removes the 'Powered by Setnayan' footer."

## 3 · Owner-locked split (2026-07-24, this thread)

| Bucket | Items |
|---|---|
| **Website Pro ₱3,500** | STD video upload · Gallery (`our-photos`) · Cinematic Reveal (`STD_PREMIUM_OPENINGS` beats) · Background music (site-chrome) · Editorial editables · **Background color (NEW)** · **Button color (NEW)** |
| **Free** ("the rest will be deemed free") | URL · visibility · open-browse · sections/mode · hero photo/video? *(hero PHOTO free; the STD **video** is the Pro item)* · **Map link (was ₱100)** · **Themes (was ₱1,000)** · live-media toggle · the whole 4-page site + RSVP |

## 4 · ⚠ Surfaced consequences (owner has seen; re-confirm at build)

1. **Background music + Gallery become Pro-gated but are FREE today.** Grandfather rule (design assumption): content already set keeps WORKING on the live site; only the EDITOR gates. Fail-open for existing couples — never yank a live song/gallery off a launched site.
2. **`WEBSITE_GALLERY_UPLOAD` ₱100 / `WEBSITE_MAP_LINKING` ₱100 / `WEBSITE_THEMES` ₱1,000 SKUs**: gallery folds INTO Pro; map + themes go FREE. Catalog rows → `is_active=false` per the [[project_setnayan_catalog_is_active_gotcha]] rule (reject-at-resolver, never sweep); anyone who already BOUGHT one keeps it (entitlement reads stay).
3. **Watermark removal stays a Pro perk** (not made free-for-all despite "rest free") — removing it for everyone deletes the freemium loop. Held for explicit owner word.
4. **Background color / Button color are NET-NEW settings** — no couple-facing control exists (site color comes from the Mood Board `role_palette`). Build: two columns (e.g. `events.site_bg_color`, `events.site_button_color`, nullable hex, NULL = today's palette behavior), a small picker card, and reads in the site chrome. Ship inert (NULL default).
5. **Checkout**: the umbrella CTA reuses the existing `COUPLE_WEBSITE_PRO` checkout path (₱3,500, owner 2026-07-22 reactivation). ⚠ Prod catalog note in memory says `COUPLE_WEBSITE_PRO` was `is_active=false` at one point — verify the row is purchasable before wiring the CTA.

## 5 · Build order (Opus)

1. **PR-A (page):** rebuild `/website/launch` per §2 with entitlement read (`eventCoupleWebsiteProActive`) driving locked/unlocked; re-point the nav `launchItem`; absorb LaunchStdButton + keep WebsiteLaunchPreview reachable. No gating changes yet — Pro cards deep-link if content exists (grandfather).
2. **PR-B (gating):** Pro-gate the four EXISTING editors (STD video upload beat, our-photos, site-chrome music, editorial editor) behind `COUPLE_WEBSITE_PRO` with the grandfather rule; free the map-link + themes paths; catalog `is_active` updates.
3. **PR-C (colors):** the two new color columns + picker + chrome reads, inert by default.

*Fable, 2026-07-24. Prototype states verified in-browser (7 Pro cards, both body-state classes).*
