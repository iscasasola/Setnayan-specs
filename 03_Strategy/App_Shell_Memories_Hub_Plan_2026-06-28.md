# App Shell + Memories Hub Build Plan
*2026-06-28. The 5-focus app-shell IA (desktop sidebar + mobile bottom-nav) + the Memories Hub surface. Authored against shipped code on `origin/main` via a 5-lens codebase study. Companion to `Website_Master_Plan_2026-06-28.md` (Phases 2 + 4 of the 5-focus reframe).*

## Headline findings (de-risk the build)
1. **Memories Hub already ~70% exists** as `/dashboard/library` ("Collection") — an **account-scoped, cross-event** hub. Its Photos & Videos tab already aggregates every event the user **hosts or attends**, with "On this day" hooks, a year timeline, and Hosting/Attended badges. The hard parts (cross-event RLS, owned-vs-attended privacy split, presigned thumbnails, graceful degradation) are solved in `apps/web/app/dashboard/(account)/library/_data/photos-albums.ts`. → Phase 4 is **rename + promote**, not build-from-scratch.
2. **The nav is builder + registry driven**, not hardcoded. Mobile = the canonical `BottomNav` primitive (lint-locked) fed by `buildCustomerMenuTree` (`apps/web/lib/customer-menu.ts`); desktop = `SidebarShell` fed by `buildCustomerNavGroups` (`apps/web/app/dashboard/[eventId]/_components/customer-nav-config.ts`). Labels/icons overlay from the registry (`apps/web/lib/nav-registry-defaults.ts` → `getNavSlotMap()`, admin SSOT `/admin/menus`). → The 4-focus remap is a **builders + registry-defaults edit**, never a BottomNav fork.
3. **The shell already IS the target shape** — `SidebarShell` is a fixed LEFT desktop rail (`hidden lg:flex`, collapsible) + a sibling mobile `BottomNav` (`lg:hidden`), both off one menu tree. No new chrome needed except the AI drawer.
4. **Setnayan AI** is a Studio child + `/studio/setnayan-ai` page today, gated by `events.setnayan_ai_active`. Target = injected `useSetnayanAI` hook + a right drawer; **keep the ₱3,999 gate at the injection point**.

## Locks the build must respect
- **Canonical BottomNav** (`apps/web/app/_components/nav/bottom-nav.tsx`) is lint-enforced (`lint:botnav`): no second bar; preserve the markers (`--bn-dur/--bn-grow/--bn-glow/--bn-stretch`, `nav-pill-stretch`, `nav-press-flash`, `aria-label="Primary navigation"`, fill `rgba(248,246,240,0.92)`). Any `*-bottom-nav.tsx` must import the canonical primitive.
- **`lint:navicon`**: the 8 nav chokepoints must consume the registry (`navSlots`/`getNavSlotMap`/`navIconComponent`). A NEW nav-chrome file is unpoliced until added to `CHOKEPOINTS` — prefer reusing existing chokepoints.
- **Slot keys are stable** — introduce NEW keys for the 4 focuses; never rename a key in place (admin overrides key off them).
- **≤5 pill tabs / ≤6 bottom-nav budget.** 4 focuses fits; AI is a drawer, not a tab.
- **Public URLs unchanged** (5-focus names apply to app-shell + homepage labels only). **Seat plan stays free** (Planado). **No video render pipeline** — Memories Hub uses stored photos/clips + poster frames only. **Cross-event reads** use the existing `current_event_ids()` SECURITY DEFINER helper + `event_members`; attended albums show **only the user's own tagged, `clean`, non-hidden** photos (the privacy boundary is the filter, since `loadAttendedAlbum` uses the admin client).

## The 5 focuses → surfaces
| Focus | Desktop sidebar / mobile tab | Existing surfaces it groups |
|---|---|---|
| **Memories Hub** | `/dashboard/library` (account-scoped) | Photos & Videos (cross-event) · Saved Vendors · Editorials; feeds from Papic galleries, `galleries/`, `live/`, recaps, `our_photos` |
| **Ala ala Set** (Creative Studio) | `/dashboard/[id]/studio` (+ `/alaala` public doorway) | `studio/*` (papic·panood·patiktok·save-the-date·pakanta·led·playlist…), `monogram/`, `live/`, `galleries/` |
| **Planado** (Planner Suite) | event-scoped | `guests/*` · `seating/*` (free) · `budget` · `checklist` · `schedule` · `studio/mood-board` (route stays; nav cross-refs) · `date-selection`/`find-date` (compare) · `contracts` |
| **Setnayan AI** | injected drawer (not a tab) | `useSetnayanAI` overlay on Planado + Marketplace; gate = `events.setnayan_ai_active` |
| **Marketplace** | `/dashboard/[id]/vendors` + `/explore` | `vendors/*` (discovery·categories·packages·workspace·review); retain **0% commission** |

## Phased PR roadmap
- **PR 1 — Memories Hub rename ✅ (this PR).** `Collection` → `Memories Hub` in `account-nav-config.ts` + the `customer.account.library` registry default + `library/page.tsx` (title, h1, subhead). Key/href/slot stable. Lowest-risk; promotes the already-built cross-event hub to the flagship name. *(Promoting it to a primary FOCUS on mobile/desktop comes with PR 2.)*
- **PR 2 — 4-focus event-shell nav (the big one; build-verify required).** Edit BOTH builders in lockstep: `buildCustomerMenuTree` (`lib/customer-menu.ts`, mobile) + `buildCustomerNavGroups` (`customer-nav-config.ts`, desktop) to the 4 focuses (Memories · Creative Studio · Planner Suite · Marketplace); add NEW `customer.bottom-nav.*` + `customer.sidebar.*` slot defaults; consolidate today's Home/Guests/Explore/Studio/Budget → Planner Suite (+ Memories/Creative/Marketplace). Reconcile the day-of/after phase rosters. Keep `<BottomNav>` + `SidebarShell` untouched. **Owner-locked menu set change** — owner has directed it (the §3 nav rules); still verify via `next build` + `lint:botnav` + `lint:navicon`.
- **PR 3 — Mobile Memories landing.** On mobile, launch into the Memories grid: mount the Photos-tab stream via `CustomerMobileLanding` (`dashboard/[eventId]/_components/customer-mobile-landing.tsx`). Reconcile with the locked primary-event auto-jump so 0-owned-event attendees still land sensibly.
- **PR 4 — Setnayan AI injection.** Add `useSetnayanAI` hook (reads `events.setnayan_ai_active`) + a right-hand drawer rendered as a **fixed sibling overlay** of `SidebarShell` (no right-rail slot exists; don't change the offset model). Inject filter/adaptive-checklist into Planado (guests/checklist/compare) + Marketplace. Retire `/studio/setnayan-ai` as a standalone page once injected (keep a redirect). Gate preserved.

## Open owner decisions (flagged)
1. **`website/*` (15 routes) + `monogram/` + `invitation/` + `event-page/`** don't map to one focus and have standalone-vs-studio duplicates — decide whether the event website lands in Ala ala Set (as Pawebsite) or stays a separate management surface, and dedup the standalone vs studio routes. (Primary mapping ambiguity.)
2. **Day-of / After phase rosters** currently swap the whole mobile bar — keep them as lifecycle overrides, or also collapse to the 4 focuses (phase content inside Memories/Planner)?
3. **Mobile Memories landing vs primary-event auto-jump** — confirm the landing rule for hosts (owned event) vs pure attendees (0 owned).
4. **AI drawer push-vs-overlay** — overlay (recommended, no shell change) vs push content (needs a new `SidebarShell` right-offset var).
