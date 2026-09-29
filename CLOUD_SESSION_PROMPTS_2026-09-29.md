# Cloud session prompts — ease-audit fixes (2026-09-29)

How to use: claude.ai/code (or the desktop app → New session → Cloud) → repo **iscasasola/setnayan-platform** → paste ONE prompt below per session. Each is self-contained. They open PRs; the controller (the local "Setnayan handoff" session) merges and deploys.

Common rules are inside every prompt so each can be pasted alone.

---

## PROMPT 1 — Supplier paywalls obey the switch (Creators, Deep Search, Reach, Branches, Team, page editor)

```
Model: Opus · effort high. You are a builder in the Setnayan repo (Next.js monorepo, apps/web). Read CLAUDE.md at the repo root first and obey it.

RULES (owner-locked): never merge anything, never `gh pr merge`, never --admin, never arm auto-merge. Open ONE PR to main with `gh pr create --label do-not-auto-merge` and confirm `gh pr view --json autoMergeRequest` is null. Never apply a migration to production. Never deploy. Plain English in UI copy. Any set of choices is ONE dropdown (the shipped PickMenu), never a row of pill buttons. Paid features are marked ◆, never a padlock, and must never block trying — the supplier may try/preview/edit; payment is asked only at the final action (the shipped Apply/checkout step). Phone first (375/390 px). Add a changelog fragment `changelog.d/<branch-slug>.md` (see changelog.d/README.md) — do NOT edit CHANGELOG.md or STATUS.md. Run from apps/web: `pnpm install --frozen-lockfile`, typecheck, lint, every CI guard script listed in .github/workflows/ci.yml, and the unit tests near what you change (escape bracketed paths: `[[]eventId]`). Sabotage-test any new guard (break the code, see it fail, restore).

TASK — supplier upgrade prompts that contradict the paywall switch.
Facts found by a read-only audit of origin/main (verify each before acting):
- The supplier paywall is meant to be governed by the server flag VENDOR_TIER_FEATURE_GATE (lib/vendor-tier… — find it), which is OFF in production, so every `VendorTierGate` should be inert.
- BUT `app/vendor-dashboard/creators/page.tsx` gates on `isTierAtLeast(tier,'pro')` with NO flag check → Creators is paywalled live.
- These upsells show regardless of the flag: the page editor's `SoloUpsell` / "Pro customization · Upgrade" (shop/_components/website-editor.tsx), Reach "Upgrade to appear on the map" (shop/page.tsx `hasRing`/serviceRadiusKm 0 — while lib/vendor-search-gate.ts is off, Free shops ARE findable, so this sentence is false), Team seats "Upgrade to add" (shop/page.tsx `teamSub`), Branches "Upgrade to add" (`branchSub`), the availability waitlist cap, payment links "Pro & Enterprise only", Deep Search "Upgrade to run it" (deep-search-runner.tsx `!eligible`).
DO: route every one of these through the SAME flag-aware gate the other VendorTierGate mounts use (one helper, not a new rule). While the flag is off: no paywall, no false "not shown in searches" sentence. While on: try-first — let the supplier browse/preview/draft, ask at the final action. Remove supplier-visible developer text found by the audit: attributes/page.tsx footer "Schema source … iteration 0044"; notifications/page.tsx "Email delivery ships once Resend SMTP is wired."; moodboard-library "In production each host's palette renders here"; team "V1 invites existing Setnayan accounts only"; autoreply-card.tsx token wording ("reserving one token as a hold… Out of tokens?" — the token wallet was retired 2026-05-11).
Add a guard test: no vendor-dashboard page shows an upgrade/paywall while the flag is off (property-based, sweep the files). Report the PR number and a 3-step phone check card.
```

---

## PROMPT 2 — Try first, pay at Apply: Galleries own photos, Story Maker, Post Event stage

```
Model: Opus · effort high. You are a builder in the Setnayan repo (Next.js monorepo, apps/web). Read CLAUDE.md at the repo root first and obey it.

RULES (owner-locked): never merge anything, never `gh pr merge`, never --admin, never arm auto-merge. Open ONE PR to main with `gh pr create --label do-not-auto-merge` and confirm autoMergeRequest is null. Never apply a migration to production. Never deploy. Plain English. Any set of choices = ONE PickMenu dropdown. Pro is ◆, never a padlock, never blocks: the couple tries everything; the Maker's Apply sheet (`app/dashboard/[eventId]/website/_components/apply-pro-sheet.tsx`, "Unlock Pro and Apply") names the Pro effects and asks then. Phone first (375/390). Changelog fragment in changelog.d/ only. Run from apps/web: install, typecheck, lint, every CI guard script in .github/workflows/ci.yml, nearby tests (escape `[[]eventId]`). The Maker must never be slow: keep `scripts/check-maker-js-budget.mjs` ≤ 505KB and the shared bundle ≤ 202KB (the shared bundle has almost no headroom — any new Maker UI must load lazily inside an EXISTING named chunk; never raise a budget).

TASK — three places that lock a FREE couple out before they have made anything:
1. Galleries → "Photos you add": `app/dashboard/[eventId]/website/our-photos/page.tsx` returns `WebsiteProLock` ("Unlock Event Hub PRO") early. Remove the early lock: free couples upload and preview; the photos are marked ◆ and go live only through Apply with Pro (reuse the draft/Apply mechanism the Maker uses — find `draftedRowLockedIf` / hubDraftAction).
2. Story Maker `/dashboard/[eventId]/story` (`story/_components/editorial-editor.tsx`): fields are `disabled={!isPro}` with a padlock `ProChip` and "Unlock Editorial PRO" → /studio/editorial-pro. Make every field editable; mark ◆; ask at Apply. Retire the separate "Editorial PRO" name in UI copy — it is Event Hub Pro (confirm the SKU mapping in lib/ before changing; if two SKUs truly exist, keep both but say "Event Hub Pro" in copy and flag it in the PR).
3. Post Event stage in the Maker: `website/editor/page.tsx` row key 'editorial' is `locked: !ownsPro` — give it `draftedRowLockedIf` like every other row; replace the link-outs "Show, hide or reorder in your story workroom ↗" and "Open the editor's desk →" (authoring-panels.tsx `EditorialPanel`) with the same controls in place, or remove them if the scene list already offers them.
Guard: a sweep test that no couple-side page returns a Pro lock/padlock before Apply (property-based). Sabotage it. Report PR + phone check card.
```

---

## PROMPT 3 — Dead ends: Messages, Thank-You Video, unreachable pages

```
Model: Opus · effort high. You are a builder in the Setnayan repo (Next.js monorepo, apps/web). Read CLAUDE.md at the repo root first and obey it.

RULES (owner-locked): never merge, never `gh pr merge`, never --admin, never arm auto-merge. ONE PR to main with `--label do-not-auto-merge`; confirm autoMergeRequest null. No production migrations, no deploys. Plain English (UI never says "website"/"site" for the couple's page — it is the "Event Hub"). One PickMenu for any set of choices. No "go edit elsewhere ↗" links — put the control in place. Pro ◆ never blocks; ask at the final action. Phone first. Changelog fragment only. Install, typecheck, lint, all CI guard scripts, nearby tests (escape brackets).

TASK — four dead ends found by a read-only audit (verify each first):
1. Couple Messages: `app/dashboard/[eventId]/messages/page.tsx` "Start a new thread" needs the vendor's email (`startThreadByVendorEmail`), which shops no longer show. Replace with ONE PickMenu of the couple's shortlisted/connected shops (the Your Team bench data — find its loader) that opens that shop's thread in place, reusing the existing thread-creation path.
2. Thank-You Video `/dashboard/[eventId]/studio/thank-you`: not owned → "Add it from your Studio" / "Back to Studio"; /studio redirects to /suite whose card reopens this same panel — a loop with no way to buy. Let "Make the film" preview free; charge at "Save to my phone" through the shipped `InlineCheckoutDrawer` (or the shared checkout the other studio products use).
3. Unreachable pages: `/dashboard/[eventId]/alaala` (Memories) has no inbound link; `/studio/photo-delivery` is only linked from Alaala and its catalogue group 'utility' is filtered off Our Services; `/studio/supplies-marketplace` (Paprint, coming soon) has no inbound link and says both "Paprint" and "Setnayan Supplies". For each: either give it one sensible doorway (Our Services / the right menu part) or retire it cleanly (redirect to its natural home, never 404). Decide per page, explain in the PR. Remove developer text shown to users in `studio/[addon]/page.tsx` ("Cloudflare Stream Live SFU → YouTube RTMP relay", "FFmpeg pipeline") if reachable.
4. Papic guest pages with no way back: `/papic/pool` (signed-out screen has no button) and `/papic/decorate` — add a "Back to my photos" link; link `decorate`'s "terms_required" message to /papic/guest.
Guards per fix; sabotage. Report PR + phone check card.
```

---

## PROMPT 4 — Rows of buttons become one dropdown + missing first-visit tours (guest & Papic)

```
Model: Opus · effort high. You are a builder in the Setnayan repo (Next.js monorepo, apps/web). Read CLAUDE.md at the repo root first and obey it.

RULES (owner-locked): never merge, never `gh pr merge`, never --admin, never arm auto-merge. ONE PR to main with `--label do-not-auto-merge`; confirm autoMergeRequest null. No production migrations, no deploys. Owner rule "any set of choices is a dropdown": every single-choice set of 3+ options is ONE shipped `PickMenu`, never a pill row. Owner rule "every feature gets a first-visit tour": use ONLY the shipped `MiniTour` + `TOURS` registry in `lib/tours.ts` — never a new mechanism. Plain English (only Papic and Patiktok keep custom names; never "website"/"site"). Phone first (375/390). Changelog fragment only. Install, typecheck, lint, all CI guard scripts, nearby tests (escape brackets). If you touch the Event Hub Maker, keep `check-maker-js-budget.mjs` ≤ 505KB and the shared bundle ≤ 202KB (almost no headroom) — never raise a budget.

TASK:
A. Pill rows → PickMenu (verify each first): Papic Decorate filter row (`papic/decorate/_components/kwento-decorator.tsx` PAPIC_STYLES) and its colour swatches (second PickMenu under the caption, so the row stops overflowing at 375); Live Wall layout `WALL_TILE_LAYOUTS` (live-wall-controls.tsx) and mode `CHOICES` (live/_components/mode-control.tsx); Papic gallery `FILTERS` (studio/papic); Patiktok `CategoryChips`; couple guest list phone filter "Side" and "RSVP" segments (guests/_components/mobile-guest-carousel.tsx `SegRow`) to match the Role/Group selects beside them; Your Team "Sort by" 7 pills (vendors/_components/shortlist-categories.tsx `lensChips`); Budget Save/Standard/Splurge; Seat plan room "Presets" (seating-editor.tsx ROOM_PRESETS); Memories lens row (library/page.tsx LENSES); board "Why are you removing it?" reasons (event-card-menu.tsx ReasonPicker). A 2-option toggle may stay a toggle.
B. First-visit tours (TOURS keys + MiniTour mounts, 3–5 short slides each, plain words): Papic guest camera (`papic/guest/_components/papic-guest-capture.tsx`), Papic "me" page, the couple Guest list (/guests), Budget, Galleries, and refresh the stale `customer_papic_v1` copy ("photo-crew seats", "5 guest cameras", "wedding" → current product words, event-type neutral via EventWords where available).
Add a sweep guard: no single-choice pill row of 3+ options in the files you touched (property-based), and each new tour key is mounted. Sabotage. Report PR + phone check card.
```

---

## Held (needs an owner decision first)
- **Patiktok payment check** — sold as Pro (`PATIKTOK_COMPILER`) but `actions.ts` (`submitPatiktokRender`, `recordPatiktokClip`) and `/api/patiktok/upload` never check `eventSkuActive`. Owner to choose: try free → pay to save/share (recommended) vs blocked until paid.
