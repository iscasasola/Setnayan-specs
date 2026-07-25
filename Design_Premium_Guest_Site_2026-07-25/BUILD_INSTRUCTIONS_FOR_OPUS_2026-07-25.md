# Build Instructions for Opus — Pahina premium guest site

**Date:** 2026-07-25 · **From:** Fable design pass (read `Premium_Guest_Site_Design_Spec_2026-07-25.md` + open `premium_site_prototype.html` first).
**Scope:** restyle the guest event website tree `apps/web/app/[slug]/**` per the spec. Repo workflow as usual: worktree → PR → auto-merge; prune worktrees after merge.

---

## 0. Ground rules (read before PR-1)

1. **The plan goldens test PLAN logic, not markup.** `apps/web/lib/site-body-plan.test.ts` + `site-body-plan.openbrowse.test.ts` golden-lock `resolveSiteBodyPlan` (which body renders, widget fences, spotlight). **Pure restyling (classNames, CSS, new decorative wrapper elements) cannot break them.** They break only if you touch `lib/site-body-plan.ts` inputs/outputs — don't. Also leave `lib/invitation-widgets*` logic alone.
2. **Structural markup changes must be flagged per-PR.** Some tests and the editor bridge (`editor-bridge.tsx`, `data-*` hooks for the Unified Website Editor's click-to-edit) may key off DOM structure. Before moving/nesting a widget's root element, grep for its component name in `apps/web/lib/*.test.ts` and in the editor panels (`app/dashboard/**/website*`). Anything structural → call it out in the PR body under "STRUCTURAL".
3. **CSS-vars-first.** All new color duty goes through new `--color-*` vars set in `buildSitePaletteVars` / `InvitationShell` style attr, resolved via Tailwind tokens (extend `tailwind.config` with `gild`, `paper-deep`, `veil` mapping to `rgb(var(--color-…) / <alpha>)`). Never hardcode a hex in a component. This keeps the couple re-skin + Pro custom colors + a possible future theme switch all working through the one pipe.
4. **`.sn-editorial` is the scope.** Fonts and functional-color exile live under that class (globals.css) — do not leak to dashboards/marketing (the Atelier reskin owner-excludes the guest tree, and vice versa).
5. **The couple's existing personalization wins.** Monogram precedence, `wax_seal_config`, `std_film_accent_hex`, Pro custom bg/button (`buildCustomSiteColorVars` layered last) — all unchanged.
6. **Byte-inert where flagged-dark things live.** Open-browse (`website_open_browse` default FALSE), menu flag (`NEXT_PUBLIC_WEBSITE_MENU_ENABLED`), phases — restyle both branches but change no gating.
7. **Verification gates per PR:** `lint` + `tsc` + full test run (goldens green) + production build + a **visual pass on the sample event** (`/maria-and-jose` locally and on the Vercel preview, phone width 375, both a palette-rich and a palette-empty event, all four lifecycle phases via host preview params where available).
8. **Motion safety (learned in prototyping):** scroll-reveal must fail *visible* — gate the hidden state on a root `js` class added by an inline script, mount the IntersectionObserver before paint, and honor `prefers-reduced-motion`. A guest on a broken/slow script must never see blank sections.

## 1. Phased PR plan

### PR-1 — Tokens + type foundation (no visible layout change yet)
- `app/layout.tsx`: load **Fraunces** via `next/font` as `--font-editorial-display` replacement (keep Cormorant loaded until PR-5 confirms nothing else uses it; check `save-the-date-film`, monogram lab, print routes).
- `lib/site-palette.ts`: extend `buildSitePaletteVars` to also emit `--color-gild`, `--color-paper-deep`, `--color-veil` (derivations in spec §4; reuse `veilColorFromPalette`; add unit tests alongside the existing palette tests). Emit the same three from the DEFAULTS path so palette-less events get them too.
- `tailwind.config`: add `gild`, `paper-deep`, `veil` color tokens; nothing consumes them yet.
- `globals.css` `.sn-editorial`: paper-grain overlay (inline SVG data URI, spec §5), eyebrow/plate/hairline component classes (`.pahina-eyebrow`, `.pahina-plate`, `.pahina-rule` etc.) so later PRs are className swaps.
- Changelog fragment; SPEC IMPACT: none (foundation).

### PR-2 — Hero masthead + countdown strip + chrome
- `site-body.tsx` hero branches (both identity trees + `anonymousHeroBanner`): masthead typography, stacked names + italic amp, gild date block, photo → cover plate below with mono caption + seal motif (reuse seal recipe from the reveal). **STRUCTURAL** — flag; keep the `HeroMonogram` mount (animated-monogram SKU) inside the masthead.
- `invitation-shell.tsx`: header right slot → couple monogram in gild italic (needs the monogram text threaded — it's already available at every call site via `event`); footer sign-off restyle. Watermark logic untouched.
- `countdown.tsx`: strip treatment.
- `site-menu-bar.tsx`: gild active dot + scroll-follow IO (client component already).

### PR-3 — Chapters: story, details, schedule, dress code
- `our-story.tsx` / `our-love-story-widget.tsx`: chapter eyebrow + drop cap + pull quote.
- `empty-states.tsx` `PublicEventDetails` + `venue-widget.tsx`: venue plates.
- `schedule-widget.tsx`: programme rail; live-day highlight becomes accent left-rule on the current row (remove the `success-*` wrapper in `site-body.tsx` — **this is the functional-color exile start**).
- `dress-code-widget.tsx`: silk swatches.
- Greeting block in `site-body.tsx`: salutation restyle (keep all copy/personalization).

### PR-4 — RSVP reply card + Me/QR place card + gallery mosaic
- `rsvp-widget.tsx`: reply-card treatment, wording per spec §7, options recolored accent-deep (exile the greens), selfie-reveal CSS `:has()` mechanism unchanged, `SubmitButton`/server-action wiring unchanged.
- QR card widget (guest hub card / qr_card widget): place-card treatment.
- `our-photos-widget.tsx` / `photo-moments-widget.tsx`: editorial mosaic (offsets, mono captions). Live wall untouched.
- Remaining `success/warn` instances inside `[slug]` swapped to palette-derived tones (grep `success-` and `warn-` under `app/[slug]/`).

### PR-5 — Motion + Pro layer + cleanup
- Scroll reveal + cover parallax (spec §6, rule 0.8 safety pattern), gated `prefers-reduced-motion`.
- **Candlelight toggle (Pro):** new event column (e.g. `site_art_direction` enum `daylight|candlelight`, migration) + editor control in the unified website editor's colors panel, gated `eventCoupleWebsiteProActive`; implement as the dark var recipe in `.sn-editorial` (mirror globals' `[data-theme="dark"]` guest overrides). *Read the unified-editor shared-fields/data-wipe pattern memory before adding the panel.* **Migration note:** verify auto-apply after merge (`gh workflow run supabase-migrations.yml --ref main` if skipped).
- Drop Cormorant from the guest tree if nothing else consumes it (bundle win).
- Update `/dashboard` website-editor live preview screenshots/copy if any reference the old look.

Each PR: changelog fragment with `SPEC IMPACT` line; spec-impacting rows go to corpus `DECISION_LOG.md` bottom per the relaxed sync rule.

## 2. Rollout — ship as the new default look, not a theme (RECOMMENDATION · OWNER CALL)

**Recommendation: new default for every couple site, shipped in the PR sequence above (PR-2..4 are the visible flips).** Reasoning:

- Pre-revenue, small live-event count: this is the cheapest moment the platform will ever have to raise the default. Every future couple/share/reel then markets the premium look.
- A theme picker would freeze the current look as a maintenance surface forever (two visual grammars × every future widget) — the exact treadmill the theme-system pilot (0021) was never funded to run. One look, art-directed per-couple by palette, IS the brand position ("commissioned, not themed").
- The palette pipeline already guarantees no couple's colors change — only typography/spacing/texture do; nothing a couple hand-picked is overridden (Pro custom colors still layered last).
- Risk管理: PR-2..4 can each be verified on the sample event via Vercel preview before merge; and because everything is CSS-vars + classNames, a same-day revert is a clean `git revert` per PR.

**Owner flag:** this restyles EVERY live couple's site at merge. If any real (non-sample) wedding is inside its live window on ship day, hold PR-2..4 until the day after. If the owner instead wants opt-in, the fallback is a single `site_look` column (`classic|pahina`, default `pahina` for NEW events) — but that is the second-grammar treadmill; recommend against.

## 3. Verification checklist (run per visible PR)

- [ ] `pnpm lint` + `tsc --noEmit` clean
- [ ] Full test suite green — especially `site-body-plan*.test.ts` goldens untouched
- [ ] Production build passes; bundle delta for `[slug]` route < +60 KB (font swap net)
- [ ] Sample event `/maria-and-jose` visual pass: 375px + desktop, light + candlelight (PR-5), palette-rich + palette-empty event, all four phases
- [ ] Editor bridge still highlights/edits widgets in the unified editor preview (`?editor=1` as host)
- [ ] Reveal/STD film unaffected (fullBleed path)
- [ ] No `success-*`/`warn-*` classes left under `app/[slug]/` after PR-4
- [ ] Reduced-motion + JS-disabled render: all content visible

---

## 4. Five Timelines — engine notes (added 2026-07-25, owner correction)

The owner's model is FIVE timelines (Save the Date · Invitation · RSVPed · Event Day · After Event). Spec §11 has the per-timeline widget matrix; the prototype's top strip walks all five.

**DO NOT add a new `LifecyclePhase`.** The engine's four date-driven phases (`save_the_date | rsvp | event | editorial`) are untouched. **RSVPed = a per-guest FORK inside the `rsvp` phase**, keyed on the identified guest's reply:

- Fork point: the guest tree only (`identity.kind === 'guest'`), on `guest.rsvp_status === 'attending'` (design decision needed in-build for `maybe`/`declined`: `maybe` keeps the ask visible with the pill; `declined` shows a quiet "we'll miss you" line, no keepsake).
- What forks (render-level, inside `site-body.tsx` + `rsvp-widget.tsx` — **no plan/golden change**, `resolveSiteBodyPlan` is not consulted for this): the RSVP ask is replaced by the keepsake ticket; the countdown gets the enlarged/salutation treatment; the "Your table" line appears when a seat assignment exists (data already flows via `guestHubData.tableLabel`).
- **Anonymous visitors never see RSVPed** — the anonymous tree has no guest, so the fork is structurally unreachable there (same firewall as today's identity union). Nothing about the RA 10173 zero-guest-bytes fence changes.
- The keepsake's `Nº` is display flavor — use the guest's row position or a short hash of `guest_id`; never expose a raw internal id.
- After Event: the memento ticket renders in the guest tree under the editorial phase (guest identity + `rsvp_status === 'attending'` or `arrived` flag) — it persists below the editorial takeover the same way GuestHubBar already does.

**Unified Website Editor preview tabs: 4 → 5.** The editor's phase-preview switcher currently mirrors the four phases; add an "RSVPed" tab between Invitation and Event Day that renders the rsvp phase with a **simulated replied guest** (inject a mock guest identity with `rsvp_status: 'attending'` + a sample table label into the preview render — preview-only, no DB writes; mirror how the sample event fakes guest context, and read the shared-fields/data-wipe pattern memory before touching editor panels). Label copy suggestion: "RSVP'd" with a sub-caption "what a confirmed guest sees."

Slot this into the phased plan as **PR-4b** (after the reply-card PR-4, before motion PR-5): keepsake ticket + countdown fork + editor fifth tab ship together so the editor never previews a state that doesn't exist yet.

### Verification additions
- [ ] rsvp phase, guest with `rsvp_status='attending'` → keepsake + no ask; `pending` → ask; anonymous → ask never personalized, no keepsake ever
- [ ] `site-body-plan*` goldens still untouched (the fork lives above the plan, in the guest render branch)
- [ ] Editor preview: all 5 tabs render; RSVPed tab shows the simulated guest and writes nothing

---

## 5. RESKIN, NEVER DROP — the full functional inventory (owner correction #2)

> **TOP RULE for every PR in this sequence: the Pahina pass is a RESKIN of the complete existing site. Every component `site-body.tsx` renders today keeps its place, its data wiring, and its gates — you restyle it, you never remove or de-mount it.** The owner explicitly flagged the guest-personal layer; treat spec §11a's matrix as the acceptance checklist. If a component is not named in the phased plan, it still ships restyled (or visually untouched) — absence from the plan is NOT permission to drop it.

Complete inventory to carry (all under `apps/web/app/[slug]/_components/` unless noted): `GuestHubCard` + `GuestHubBar` (avatar/QR/camera/gallery/claim chrome — the hub plate + the camera notch below), `PapicGuestCapture` (camera), guest live gallery + "Not me" (in `site-body.tsx`), `your-photos-widget`, `DayOfFaceEnroll` + `FaceDataNotice`, `YourSeatBlock`, `ScheduleWidget` (incl. day-of promoted live schedule), `PabatiPrompt`, Pabuya/e-gifts entry, `qr_card` widget, greeting, `event_details` (role/side), `tier-comparison-widget`, `WatchLiveBlock`, `LiveWallBlock`, `TeaCeremonyCard`, `GuestColumnCard`, claim-account section, vendor-credits section, `special_message`/`what_to_bring`, plus every editorial widget already in the plan.

Phase assignments (amends the PR plan):
- **PR-2** also restyles: `GuestHubCard` → the "✦ Yours, {name}" hub plate (avatar ring, status pill, QR plate, connect block — the claim-account form moves INSIDE the hub plate's connect slot; keep the form action + `#claim-account` anchor). `GuestHubBar` → the camera notch: keep the bar's three actions (QR modal · camera · gallery) but restyle the center camera as the gilded shutter notch riding the SiteMenuBar; the QR + gallery actions fold into the hub plate + "Photos of me". **STRUCTURAL** — GuestHubBar and SiteMenuBar merge into one bottom chrome when the menu flag is on; flag this PR loudly and keep the flag-off DOM byte-stable (both old bars unchanged when `NEXT_PUBLIC_WEBSITE_MENU_ENABLED` is off).
- **PR-3** also restyles: `YourSeatBlock` (plate), `TeaCeremonyCard`, `GuestColumnCard`, `special_message`/`what_to_bring` ("Good to know" plate), day-of promoted schedule (NOW row replaces the green wrapper).
- **PR-4** also restyles: guest live gallery + "Not me" (mono pill on-tile), `your-photos-widget`, `tier-comparison-widget` (two-column ledger + letterpress CTA; keep the +1 `limited` variant's copy), `DayOfFaceEnroll`/`FaceDataNotice` (consent plate — copy is privacy-load-bearing: keep the per-event/never-reused/removable claims aligned with `/privacy`), `PabatiPrompt` + Pabuya entry ("Gifts & greetings" chapter), `qr_card` (place-card).
- **PR-4b** (unchanged) adds the keepsake/memento + editor fifth tab.

Verification additions:
- [ ] Diff the rendered component list per identity×phase before/after each PR — identical mount sets (the reskin invariant); the goldens cover the plan, THIS checklist covers the mounts
- [ ] Camera notch appears under exactly today's gates (`cameraReady || candidCameraActive`), never for anonymous visitors without the couple's open candid camera
- [ ] Face-enroll plate copy reviewed against `/privacy` disclosures (disclose-then-enable rule)
- [ ] Hub plate: claim form still posts `claimAccountAction`; QR modal still shows the monogrammed SVG; +1 `limited` guests keep their restricted variant

---

## 6. Correction #3 — nav is a PURE RESKIN; watch surface builds on Roam (2026-07-25)

1. **Bottom chrome PR = markup-parity reskin of `site-menu-bar.tsx` + `guest-hub-bar.tsx`. Zero structural invention.** The five text tabs stay five text tabs (Home · Details · Story · Photos · Me per council §1.1); GuestHubBar keeps its exact slots (My QR left chip · prominent center round Camera · Photos right chip + count badge · `hubHref` LIVE chip next to the center action · QR modal · top-right account/claim affordance). Restyle classNames/materials only — same elements, same order, same gates (`cameraReady || candidCameraActive`, `galleryCount`, `hubHref` window). Acceptance: a DOM diff of the two components before/after shows attribute/class changes only (plus the Pahina wrapper), no added/removed interactive elements. The v3 "camera notch in the tab row" is dead — do not build it.
2. **Day watch surface = the Live Studio guest-pick viewer, built ON the Roam #3666 substrate** (`live_studio_roam_zones`, QR camera join, the existing guest-pick viewer) per `Live_Studio_Unified_Spec_2026-07-25.md` — **do not fork a new viewer**. The Pahina pass restyles that viewer: CH 1 big player w/ tally + host-named smaller channel tiles (★ default, gild active border) + the on-demand note. Channel names come from `live_studio_roam_zones.label/venue_label`; flag-gating and YouTube/OAuth gates unchanged.
3. **Papic pool bar** ships per OnTheDay build ③'s own 5-PR plan (`NEXT_PUBLIC_PAPIC_POOL_BAR` + `PAPIC_GUEST_TOPUP` flip last); the Pahina pass only styles its strip (meter/rate/actions as spec §11b). **Camera+roll plate** reskins the existing capture entry + roll surfaces consistent with `0012_papic/0012_papic.html` (white shutter, last-5 strip, amber tag ring) — the capture flow itself is untouched.
4. Verification additions: [ ] DOM-parity diff on site-menu-bar/guest-hub-bar (rule 1) · [ ] viewer renders through the Roam substrate with zero schema changes · [ ] pool bar strip hidden outside T-1h..T+8h and behind its flags.

### 6b. Correction #4 — bottom-chrome DOM-parity rule TIGHTENED (2026-07-25)

The nav/hub-bar "reskin" is now defined as: **byte-identical markup and geometry classes; the only diffs allowed are color-token substitutions** (`cream→paper`, `mulberry→accent-deep`, `terracotta→accent`, active-state color may use the gild var). Concretely: for `site-menu-bar.tsx` and `guest-hub-bar.tsx`, the Pahina PR may touch ONLY color-bearing class fragments (`bg-*`, `text-*`, `border-*` color halves, `hover:*` colors); every size/spacing/radius/shadow/translate/typography class (`h-14`, `h-16 w-16`, `-translate-y-1.5`, `rounded-2xl`, `text-[0.6rem]`, `font-mono text-[0.7rem] tracking-[0.12em]`, `gap-3 px-5 pb-3 pt-2`, badge `-right-1 -top-1`…) and the lucide icons (`QrCode` 20/1.75 · `Camera` 24/2 · `Images` · `LayoutGrid`) are UNTOUCHABLE. Acceptance = a class-level diff listing color tokens only. If the couple-palette vars already restyle these components via the existing `--color-*` pipe (they do — cream/ink/terracotta/mulberry all resolve to vars), the correct PR here may be **zero lines** on these two files.

---

## 7. V6 mock → real surface mapping (2026-07-25)

Each interactive mock in `pahina_v6.html` maps to a shipped surface (restyle it) or a NEW build (owner-gated). **Reskins (restyle the shipped thing, no behavior change):** #3 camera sheet → `PapicGuestCapture` + pool metering; #5 → `DayOfFaceEnroll`; #6 → `claimAccountAction` claim form; #7 → guest role text (already free-text); #8 QR modal → `GuestHubBar` setQrOpen modal (clone rule §6b applies); #10 → run-of-show trigger (flip `NEXT_PUBLIC_GUEST_NOW_TRIGGER` for guest read); #17 → `saveAttendedVendorAction` vendor credits; #18 → `tier-comparison-widget`; #20 → `PabatiPrompt`; #12 wall → `LiveWallBlock` (+ small lightbox).

**Flag-flips / shipped-adjacent (coordinate, don't rebuild):** #9 Pabuya (`PABUYA_PUBLIC_ROUTE_ENABLED`, shipped #3124); #19 Guest Columns (OnTheDay build ① plan, `GUEST_COLUMNS_ENABLED`); #2 3D Plan (3D venue walk backlog; seat data live); #16 phones-down (Photo Moments 'present' mode → new guest banner render).

**NEW builds — list separately, owner-gated, do NOT fold into the reskin PRs:** #1 rewatch-film chip (small; STD film is phase-gated today — needs an owner call to expose post-STD); #4 in-app 3D avatar maker (avatar-maker memory: prototype exists, NO external assets; gate with 3D Plan); #13 two-lane Of-you/By-you merge (both sources shipped, new unified UI); #14 bulk download (zip endpoint NEW — size/cost note for owner); #15 GUEST-side Drive backup (couple-side delivery only today — honest "build pending" tag stays until owner greenlights; OAuth scope + privacy note); #11 Waze link (trivial). Every NEW item ships flag-dark with its own changelog fragment; surface each to the owner in plain English before building.

---

## 8. RE-BASE (correction #5, 2026-07-25) — base = the owner's 5Tab prototype; Pahina is the material layer

**`Guest_Event_Website_5Tab_Prototype_2026-07-22.html` is THE design** (it fathered the open-browse council verdict + the 11-PR program already in flight). The build target is therefore unchanged from the open-browse program: ship the 5Tab structure via the council's PRs, and apply Pahina as a **materials-only layer** on top — the `<style id="pahina-materials">` block in `pahina_v7.html` is the reference (Fraunces stack via next/font, paper grain, gild var, letterpress buttons, serif countdown numerals, newspaper inner hairline). **Spec §12's fidelity map governs**: anything marked KEPT must not be restructured; the three grounded enrichments (channel rail on the watch card — build ON Roam #3666; Pabuya gift sheet — flag `PABUYA_PUBLIC_ROUTE_ENABLED`; vendor ♥ credits — `saveAttendedVendorAction`) land as small PRs at the same slots the prototype puts them; the "needs owner call" list ships nothing without a decision. Earlier sections of this doc that assumed the Pahina five-timeline restructure (§1 PR-2/3/4 layout moves, §11c placements that contradict the 5Tab slots) are DOWNGRADED to material guidance — where they conflict with the 5Tab structure, the 5Tab structure wins.

---

## 9. V8 lanes = improvements to SHIPPED surfaces (no new product)

The coordinator/vendor day lanes in `pahina_v8.html` are restyle+composition targets over what already exists — do NOT scaffold new routes or schemas from them:
- **Coordinator lane** → the coordinator's existing host-access dashboard views + the run-of-show header (#3412). Buildable deltas, each already council-tracked: P3 broadcast wiring (`coordinator_broadcasts` tables — spec'd, no backend), the phones-down guest banner (needs the owner call from spec §11c #16), bulk time-shift affordance on the ROS. Money UI: render the lockstub by DEFAULT; when `NEXT_PUBLIC_COORDINATOR_CONSENT_GATE_ENABLED` flips and the couple grants scopes, the stub swaps per `lib/coordinator-money-scope.ts` — never hardcode the wall as absolute (2026-07-19 supersession).
- **Vendor lane** → `vendor-dashboard/on-the-day/*` components restyled in place (event-picker, access-grants, guest-review-qr, issues-log, live-reviews, prep-cta) + the per-vendor ROS slice (P2 build) + booth-mission chip (Games, live) + capture controller entry kept behind #3388's flag. Pahina materials only; DOM-parity discipline from §6b applies to any component that also renders on prod paths.

---

## 10. Role-matrix NEW builds (owner canon 2026-07-25) — flag-dark, owner-gated PRs

Restyles/recompositions of shipped things (no new product): issues-log, review-QR, live-reviews, favorites surface, delivery/checklist scan, QR kit card (print packs shipped), run-of-show console, host "Run the day" (parameterize the coordinator console for the host — it is host-access by definition).

**NEW builds — each its own flag-dark PR, owner sign-off before flag flip; plain-English asks:**
1. **Guest announcement card + phones-down banner** — the P3 broadcast wiring (`coordinator_broadcasts` / `broadcast_acknowledgments` tables per spec; guest card on the Day Home; phones-down = a broadcast kind driving the ink plate). Owner has ordered the features IN; the DB/backend is still the build.
2. **Vendor status updates** ("report to coordinator") — thin write into the same requests/issues stream, one-tap presets.
3. **Vendor Column for the Couple** — clone the guest-column machinery (`photo_messages`-style moderation) with a vendor author type; prints beside guest columns.
4. **Fee-proportional Papic documentation allowance** — substrate SHIPPED (#3388 `vendor_event_unlocks` Lite-20/Ltd-70, fail-closed behind the Data Privacy control); the NEW part is the fee→points mapping from the locked monetization model. ⚠ Get the owner's curve in plain English before wiring (e.g., "points = fee ÷ 100, floor 20, cap 100"?).
5. **Coordinator find-my-seat scanner** — combo PR: QR scan → guest lookup (#3607 seat-finder machinery) → plan highlight (published seat map) → 3D deep-link. No new schema.
6. **Requests inbox couple/hosts lanes** — extend the issues stream with an origin enum; one inbox UI.
7. **Song desk (requests + set list + up-next)** — genuinely new vertical-specific module; smallest possible schema (`vendor_song_requests`, `vendor_set_lists`); the up-next card can later render publicly (owner note).
8. **3D booth maker entry** — entitlement `vendor_3d_booth` (₱1,500/28d per 3D_Plan_Whats_Next); in-app maker pending — ship the entitlement-gated doorway + placeholder only.

### §10 addenda
- **#4 fee-proportional allowance — formula is now owner-locked, no ask needed:** `points = clamp(50, 50 + (fee_php − 500)/30, 200)` (50 floor below ₱500 fee, 200 cap at ₱5,000+). Implement as a derived grant on the #3388 `vendor_event_unlocks` substrate, fail-closed behind the Data Privacy control; photos-only vs photos+clips capability keeps following the existing tier split.
- **#9 (new) Host "Arrange your day":** per-host day-console card order/visibility prefs (one JSONB per host×event, or reuse the `invitation_widgets` display_order/mode pattern on a `host_day_cards` table). Console component is already host-parameterized; Liza keeps the fixed order. Small flag-dark PR.

### §10 addenda 2 (v10)
- **Role tab menus → routes:** the per-role bottom tabs map to `vendor-dashboard/on-the-day` SUB-ROUTES (tabs = child routes/segments: `/on-the-day/today|scan|papic|reviews|requests`; coordinator console equivalents under the coordinator's event surface). Mobile bottom-nav component = the dashboard nav grammar restyled with Pahina materials; do not reuse the guest SiteMenuBar.
- **Allowance grant wiring (final):** grant source enum = `fee_proportional` (clamp(50, 50+(fee−500)/30, 200)) OR `byo_gift_10` (couple-imported vendors, no fee) — both on the #3388 `vendor_event_unlocks` substrate. **Upgrade SKU:** `VENDOR_PAPIC_UPGRADE` — ₱100, sets the event allowance to the 200 cap, available from any tier incl. the 10-pt gift; seed `is_active=FALSE` (inert) until the owner flips; activation via standard apply-then-pay (note: mid-event upgrades share the pool-bar latency caveat — trust-first provisional grant question #16 applies).

### §10 addenda 3 (v11)
- **Host/MC lane = a vendor-dashboard ROLE VARIANT** of `on-the-day` (same route family, category-driven tab set — the MC category swaps in `Show/Script/Announce`), NOT a new surface. Coordinator-parity Show/Announce reuse the coordinator console + broadcast components with a vendor-scoped grant (needs a `coordinator-parity` capability flag on the MC's access grant — small NEW column/scope, owner-gated).
- **Emcee script substrate is SHIPPED:** `schedule/_components/emcee-script-button.tsx` (per-block scripts on the schedule). The MC Script tab reads those blocks; the cue card derives from run_state + next block. NEW pieces: the MC card-prefs table (reuse the `invitation_widgets` order/mode pattern — this is the card-placement feature, now MC-scoped) and the couple-intro/games cards (content fields on the MC's event link).
- **Bea revert:** drop the host day-card prefs item from §10 addenda (#9) — card prefs ship MC-scoped instead. Bea keeps the delegation console as-is.

### §10 addenda 4 (v12)
- **Kit #10 Column for the Guests** rides the guest-columns machinery as a **vendor-authored variant** — vendor_id author + couple approval status machine + a credits-side render; **no new grammar**. One text field (~160 chars) + optional single attachment referencing a photo from the vendor's own documentation roll (the #3388 allowance captures — reuse the photo row, no new storage). Render point = the vendor-credits surface (Day/After), inside the existing credited-vendors block, quote + thumb under name/category; ♥ Save untouched. Approval queue = the same couple review surface as guest columns (one list, two author types).

### §10 addenda 5 (v13)
- **Kit #11a phone upload = mostly wiring, flag-dark:** extend the EXISTING vendor capture route to accept multipart batches (camera-roll picks) — same access grant, same allowance meter debit (1/7 pts), same NSFW→face→galleries/wall pipeline the in-app camera already feeds. Client: `<input type=file multiple accept=image/*,video/*>` + per-file status from the existing processing states; no new pipeline stages, no new schema beyond an `ingest_source='phone_upload'` stamp on the capture row. Full-res posture unchanged (web-copy tonight, full-res via the shipped Drive handover).
- **#11b Camera Bridge stays its own plan** (`Camera_Bridge_Build_Plan_2026-06-11.md`); the chip links nothing until that ships. Do not scaffold pairing from this prototype.

### §10 addenda 6 (final vendor-points wiring)
- Grant sources on the #3388 `vendor_event_unlocks` substrate become: `fee_proportional` (50–200 clamp) · `byo_gift_10` · **`topup_small` (₱100/+250)** · **`pro_pack` (₱1,000/+3,000)** — the two purchase sources are repeatable rows; balance = SUM(grants) − usage; the 200 cap is enforced ONLY on the `fee_proportional` computation, never the balance. Seed both SKUs `is_active=false`. **Drop `VENDOR_PAPIC_UPGRADE` (₱100→200 flat) from §10 addenda 2 — superseded, do not build.** Mid-event purchase latency: same trust-first provisional-grant question as the couple pool bar (build ③ Q16) — flag for the owner alongside that decision.
- Kit #11a upload debits the same balance (photo 1 / clip 7) regardless of grant source.

### §10 addenda 7 (v14)
- **Coordinator Biz tab = the same vendor-kit components, coordinator category** — zero new components: review-QR, live-reviews, favorites, allowance meter + load-up + upload + Bridge + booth/ads + both columns all render for the coordinator's vendor record exactly as for any vendor. Route-wise: the coordinator's on-the-day surface gains an Event segment (merged QR/guests) + a Biz segment mounting the shared vendor-kit components with her vendor_id. Capture FAB/grant: her booking fee feeds the same `fee_proportional` grant; the host's delegation console never mounts Biz or the FAB (she has no vendor record in that mode).

## §11 · Upload cost architecture (owner directive 2026-07-25 — "cut the multiple uploads that increase the cost of Vercel")

**RULE: media bytes must NEVER pass through a Vercel function.** This CORRECTS the §10 addenda-5 note ("existing vendor capture route accepting multipart batches") — do NOT ship multipart-through-Vercel.

1. **Presigned direct-to-R2 for ALL capture/upload paths** — the pattern the website editors already use (`/api/upload` presigns; browser PUTs to R2; R2 ingress free). Convert/route the Papic guest-capture, vendor-capture, and the new phone-upload ingest through: (a) `POST /api/upload/sign-batch` → N presigned PUT URLs (tiny JSON), (b) client PUTs bytes straight to R2, (c) `POST /api/papic/commit-batch` → metadata only (keys, event, tags, points debit) which enqueues the NSFW/face pipeline asynchronously. Per-photo Vercel cost collapses from MB-transfer+duration to two sub-KB JSON calls, batched.
2. **Batch granularity:** sign 20–50 keys per call; one commit per batch. The ₱1,000 pro pack (≈3,000 shots) ⇒ ~120 light calls, not 3,000 heavy ones.
3. **Serving:** galleries, live wall, roll strips render pre-sized web copies from the R2/CDN domain with plain `<img>` (or a custom loader pinned to R2) — NEVER `next/image` default optimization on Vercel for event media (per-image optimization + transfer charges). The pipeline's existing web-copy keys are the source.
4. **Realtime pipeline chips** (uploading→screening→tagged): Supabase Realtime on the capture rows — no polling of Vercel functions.
5. **Phase-2 (optional, biggest ceiling):** move sign+commit to a Cloudflare Worker co-located with R2 (the corpus already plans Workers for renders) — removes Vercel from the media path entirely. Not a launch blocker.
Client-side: keep adaptive JPEG compression before PUT (spec'd) + the 10s clip clamp — bytes small at the source.
