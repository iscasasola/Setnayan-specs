# Council Verdict — Desktop Rail Identity Control: Plaque-as-Menu, Wordmark-as-Home (Model B+)

**Date:** 2026-07-16 · **Council:** 5 proposals, 5 adversarial cross-examinations, synthesized
**Supersedes:** `Sidebar_Switcher_Retirement_2026-07-15.md` (Model A — plaque as direct home link)
**Status:** OWNER-APPROVED ("build it", 2026-07-16 — closes the § 8 sign-offs) · **BUILT + SHIPPED as app PR #3282** (all seven acceptance criteria implemented; tsc/lint/1,827 tests/prod build/live-browser verified on all three rails, expanded + collapsed)

---

## 1. The chosen model

**Model B+ — "Plaque-as-Menu, Wordmark-as-Home."** All five councilors independently converged on the same variant of the owner's Model-B lean, and all five survived cross-examination in this form:

- The **identity plaque** (event plaque / vendor card / new admin HQ plaque) becomes the **single popup trigger** that opens the existing slimmed switcher panel — exactly the owner's words: "use the event icon as the popup."
- The **SETNAYAN wordmark** in the rail header becomes a **`<Link href="/dashboard">`** — the universal logo-goes-home convention — preserving 1-click home under the owner-locked "launcher = THE home."
- The **AccountSwitcherStandalone email pill dies** on all three desktop rails. The "2 there" the owner named is resolved.

Why not the alternatives, definitively:

- **Model A** creates a 3-click, cross-page couple sign-out (plaque→home→avatar→Sign out) — a regression from today's 2 — and makes an identity chip silently navigate, the single most disorienting rail failure (users trained by Slack/GitHub/Notion expect identity-chip = menu). Dead.
- **Model C** buys nothing B+ doesn't already deliver (its sole advantage — 1-click home — rides on the wordmark link in B+), while costing a compound control that cannot be built cleanly (interactive-in-interactive is invalid HTML; requires stretched-link hacks), whose dominant mis-click *navigates* (the highest-cost failure), and which cannot be mirrored on the mobile avatar pill. It is also literally the "2 things there" ambiguity the owner just asked to remove, welded onto one card. Dead.
- **Pure Model B** (no wordmark link) makes home 2 clicks everywhere on desktop, fighting the launcher-is-home lock. Dead.

The cross-examinations converted five near-identical proposals into one **amended** spec. The amendments below are **acceptance criteria, not risks** — the design does not ship without them.

## 2. Per-doorway desktop behavior

### Shared anatomy — `DoorwaySidebarHeader` v2 (`apps/web/app/_components/nav/doorway-sidebar-header.tsx`)

- **Wordmark:** the current dead `<span>` becomes `<Link href="/dashboard" aria-label="Setnayan — home" title="Home">` with a visible hover affordance (opacity/underline-on-mark) and focus-visible ring. Destination is identical to the launcher top-bar wordmark — the "wordmark = home" model must never fork.
- **Pill slot:** `AccountSwitcherStandalone` is removed from the header. In its place the header gains a **required `identity` trigger slot**.
- **Trigger:** one new shared component, **`SwitcherPlaqueTrigger({ data, chip, title, metaLine })`** — a `<button type="button" aria-haspopup="dialog" aria-expanded={open}>` styled as the dark-glass plaque (atelier-glass, gold accent), whole surface = one hit target, with a **trailing ChevronDown as visual affordance only** (not a separate click zone — that would be Model C). It opens the existing `SwitcherPanelBody` desktop drawer via the shipped `useModalA11y` machinery (focus trap, Esc, focus-restore — zero new modal code). The `chip` is a ReactNode prop, **not a mode enum** — three parameterizations of one component, never three forks (the drift disease this header exists to cure).
- **Structural coupling:** because the slot is *required*, pill-deletion and trigger-presence cannot diverge per doorway. No rail can silently ship without a panel trigger.

### Collapsed 64px rail — mandatory shell change (the cross-exams' biggest catch)

`sidebar-shell.tsx` currently blanket-hides the entire `sidebarHeader` slot at `[data-sidebar-collapsed='1']` — and collapse persists in localStorage. Unamended, B+ would strand **all five actions** on every collapsed rail and *regress* the couple plaque's surviving 1-click home. Therefore:

- The shell stops blanket-hiding the header on collapse. The collapsed rail renders a compact stacked pair: **LogoMark glyph as an icon-only home link** + **`AccountSwitcherIconTrigger`** (already shipped in `account-switcher.tsx`, purpose-built for "the narrow icon sidebar," currently unused — wire it in) opening the same panel.
- This applies to **all three doorways** and ships in the same PR.

### COUPLE (event rail, `customer-sidebar.tsx`)

- The event identity plaque ("C&I" monogram chip + "Cale & Ice" + "WEDDING · DEC 18") **moves out of the sidebar body into the header's identity slot** and converts from `<Link href="/dashboard">` to the `SwitcherPlaqueTrigger`. The body plaque is **explicitly deleted** in the same change — otherwise the rail ships with two adjacent identity controls with divergent behaviors, strictly worse than today. (Owner-visible layout change: the event identity shifts up into the header block. Disclosed in § 8.)
- **aria-label: `"Cale & Ice — account menu"`** — the word "events" is dropped. The slimmed panel contains no event list; the current "switch events" label would become a lie. Event switching is carried by: wordmark (1 click to the picker) and the panel's Home button, **relabeled "Home · all your events"** (this label carries the teaching load for the retrained habit).
- **Unconditional render:** the plaque currently renders only when `plaqueName` is truthy (line 252). Under B+ it is the *sole* couple-desktop path to sign-out/profile/AI (the couple top bar has no sign-out; its switcher pill is `lg:hidden`). The trigger **must always render** — when `plaqueName` is empty (anon/unnamed drafts), render a fallback plaque (event-type label or avatar initial + "Your event"). The panel's existing anon branch (Sign out → "Secure your plan") does the rest. This is a hard acceptance criterion, not a PR-audit note.

### VENDOR (`vendor-sidebar.tsx`)

- `VendorIdentityCard` (logo/initials + business name + Verified line, currently a dead `<div>`) becomes the trigger — same button anatomy, gold inset rail kept, **trailing chevron + hover state + focus ring are load-bearing, not polish** (a static-looking card that is secretly a button is undiscoverable; do not value-engineer the affordance out). aria-label `"{Business name} — account menu"`. It moves into the header identity slot; the body instance is deleted (it was collapse-hidden anyway — the collapsed rail is covered by the shell-level icon pair above).
- Top-bar **Sign out stays** (1-click sign-out preserved; cheap redundancy).

### ADMIN (`admin/layout.tsx`)

- Gains the rail's missing identity element: a small **HQ plaque** (ShieldCheck glyph + "Setnayan HQ" + admin display name mono line) — the same `SwitcherPlaqueTrigger` parameterization, **never a hand-rolled third card**. Net-zero chrome: it replaces the deleted pill 1:1 in the same slot.
- Top-bar **Sign out stays**.
- Sequencing: the HQ plaque must land **before or with** pill deletion — never a state where the admin rail has no panel trigger.

### Panel changes (drops the "zero panel changes" claim — it was false)

- **Identity header row** at the top of `SwitcherPanelBody`: avatar + "Signed in as {displayName} · {email}". The deleted pill was the *only* element on the couple desktop rail disclosing the signed-in account; for a multi-console owner (admin+vendor+couple) and PH shared-device households, that disclosure must move into the panel, not die. One shared edit — desktop drawer and mobile sheet both inherit it, preserving the no-fork property.
- **Home / Shop / HQ items convert from `<button onClick={router.push}>` to real `<Link onClick={close}>`** — they are navigations; screen readers should announce links and middle-click/new-tab should work. Profile & settings / Setnayan AI are already Links; Sign out correctly remains a form POST button.
- Home button label → **"Home · all your events"** (couple) / "Home" elsewhere.

## 3. What dies

- **`AccountSwitcherStandalone`** usage in `DoorwaySidebarHeader` — all three desktop rails. Verified: the header is its only importer, so the export becomes deletable dead code. (The panel body, mobile avatar pill, and launcher avatar menu are untouched consumers of the shared machinery.)
- The couple plaque's **direct-Link-to-`/dashboard`** behavior and its "switch events" aria-label.
- `VendorIdentityCard` as a static div.
- The couple rail's **two-adjacent-go-home stack** — resolved to one identity control (menu) + one wordmark (navigate), disjoint jobs, zero overlap.
- **Yesterday's Model-A spec** (`Sidebar_Switcher_Retirement_2026-07-15.md`) — superseded; log the reversal in `DECISION_LOG.md`.
- **Stale comments** — `account-switcher.tsx` docblocks ("avatar pill in the app header") and `customer-sidebar.tsx` ("ACTS AS THE EVENT SWITCHER by linking") must be rewritten in the same PR, or the next session re-derives the old model from stale comments (the corpus's known disease).

## 4. Mobile + launcher statement

**Byte-identical, by design — no councilor proved otherwise.** All three doorways keep BottomNav + the top-bar AccountSwitcher avatar pill opening the same `SwitcherPanelBody` bottom-sheet (which now also carries the new identity header row — an improvement, not a change of model). The launcher (`/dashboard`) slim top bar is unchanged: wordmark → `/dashboard` + bell + avatar menu. Chrome-less account spokes unchanged.

Two honest corrections the cross-exams forced into the record:

- Mobile has **no wordmark** on event/vendor/admin top bars — the panel's Home button is mobile's *only* home path. It is **load-bearing: mark do-not-remove** in a code comment; a future slimming pass that removes it orphans mobile home.
- Vendor/admin mobile top-bar Sign out is **1 tap today** (no `lg:hidden` on those forms) and stays 1 tap. The residual sign-out asymmetry (couple 2, vendor/admin 1) exists on both breakpoints and is accepted (§ 6).
- Known asymmetry, logged not papered over: the mobile/launcher trigger is a **user avatar**; the desktop triggers are **event / business / HQ identity**. Same panel, different identity class of trigger. Accepted — the owner asked for the event icon as the popup — and mitigated by the panel identity header, which reconciles "clicked the event, see the account" on open.

## 5. Definitive reachability table — 5 actions × doorway × state

"Panel" = plaque/card/HQ-plaque → drawer (desktop) or avatar pill → sheet (mobile). Collapsed column assumes the mandatory shell amendment.

| Action | Couple desktop (expanded) | Vendor desktop (expanded) | Admin desktop (expanded) | Any desktop (collapsed 64px) | Mobile (all doorways) |
|---|---|---|---|---|---|
| **Home** (`/dashboard`) | **1** — wordmark (alt: 2 via panel) | **1** — wordmark (alt: 2) | **1** — wordmark (alt: 2) | **1** — LogoMark icon-link (alt: 2 via icon trigger→panel) | **2** — avatar → Home |
| **Settings** (`/dashboard/profile`) | **2** — plaque → Profile & settings | **2** — card → panel | **2** — HQ plaque → panel | **2** — icon trigger → panel | **2** — avatar → panel |
| **Profile** (same spoke as Settings) | **2** | **2** | **2** | **2** | **2** |
| **Setnayan AI** (`/dashboard/setnayan-ai`; hidden for anon) | **2** — plaque → Setnayan AI | **2** | **2** | **2** | **2** |
| **Sign out** (anon: "Secure your plan") | **2** — plaque → Sign out (today: 2 via pill — parity; Model A: 3) | **1** — top-bar (kept); alt 2 via panel | **1** — top-bar (kept); alt 2 via panel | Vendor/admin: **1** top-bar (top bars are not collapse-hidden); couple: **2** via icon trigger | **2** couple; **1** vendor/admin top-bar (unchanged) |

**Audit result: no action is worse than today on any doorway, breakpoint, or rail state**, and the couple event rail goes from two adjacent go-home controls to one control + one wordmark. Every claim in this table was code-verified against `origin/main` during cross-examination, including the collapsed and anon states the original proposals missed.

## 6. Trade-offs accepted with eyes open

1. **Event switching via the plaque goes from 1 click to 2.** Today: plaque → picker. After: wordmark → picker (1 click, but an unlabeled convention new to these rails) or plaque → "Home · all your events" → picker (2, discoverable). For a family-life-OS with many events per user, this is the real cost of the owner's directive. Mitigations: chevron affordance, panel Home first and visually dominant, relabeled copy. Expect a brief retraining blip for couples who shipped onto the 2026-07-15 plaque.
2. **The event plaque opens an account menu** — an identity-class weld (Slack's plaque menu is about the workspace; ours is about the user). Accepted deliberately (owner's words), made honest by: aria says "account menu" not "events menu," the panel identity header shows who is signed in, and Home absorbs the event job.
3. **Couple desktop loses the passive email display.** The panel identity header restores it one click away; no *always-visible* who-am-I cue survives on the couple event rail. Accepted for chrome minimalism; revisit only if wrong-account confusion shows up in support tickets.
4. **Vendor/admin keep redundant sign-outs** (top bar + panel). Accepted: removing top-bar sign-out would demote it 1→2 clicks. Standing guard: **never remove both sides in one change** — if a later slimming pass kills the top-bar buttons, the panel becomes the sole path.
5. **Two interactive controls remain in the header region** (wordmark link above plaque button). Defensible — a wordmark link is standard chrome with a disjoint job, and the *duplicate* (two go-home controls) is what dies — but it is honestly "2 there" again in the literal sense. Surfaced in § 8.
6. **Scope is larger than Model A**: wordmark link + pill deletion + two button conversions + new HQ plaque + shell collapsed-variant + panel identity row + Link cleanup. Priced against the solo-operator lock: one new shared component, one deleted export, one already-built icon trigger wired in, zero new modal machinery, and one panel body serving every breakpoint. Net maintenance surface *shrinks* after the PR.

## 7. Build deltas vs yesterday's spec (`Sidebar_Switcher_Retirement_2026-07-15.md`)

| Yesterday (Model A) | Today's verdict (B+) |
|---|---|
| Plaque = direct `<Link href="/dashboard">` on all rails | Plaque = `aria-haspopup="dialog"` **button** opening the switcher panel |
| Switcher panel survives **only** on mobile + launcher | Panel survives on **desktop rails too** — it becomes the primary account surface everywhere; only the *pill trigger* dies |
| Wordmark also links home | **Kept — now load-bearing**: it is the only 1-click home. Ship wordmark-link and plaque-popup together or ship neither |
| Vendor card becomes a link | Vendor card becomes a **button** (chevron + hover + focus anatomy mandatory) |
| Admin gains an HQ plaque (link) | Admin gains the HQ plaque as the shared **trigger** parameterization |
| Account actions reachable only via home's avatar menu (couple sign-out → 3 clicks) | All five actions in-place at ≤2 clicks on every doorway |
| — (not covered) | **NEW: collapsed-rail shell variant** — header slot no longer blanket-hidden; LogoMark icon-link + `AccountSwitcherIconTrigger` at 64px |
| — (not covered) | **NEW: unconditional trigger** — fallback plaque when `plaqueName` is empty (anon drafts) |
| — (not covered) | **NEW: panel identity header row** ("Signed in as…") + Home/Shop/HQ button→Link conversion + "Home · all your events" label |
| — (not covered) | **NEW: comment/doc rewrite** in `account-switcher.tsx` + `customer-sidebar.tsx`; test checklist names focus-restore-on-navigate (panel Home unmounts the trigger mid-restore — no-op today, verify no flash) |

**Atomicity rule:** one PR. Pill deletion, wordmark link, both plaque conversions, admin HQ plaque, collapsed variant, anon fallback, panel identity row — no intermediate commit may leave any doorway/state without a panel trigger (owner-locked wayfinding rule).

## 8. Owner sign-off items (verdict vs stated lean)

1. **"Maybe" → lock.** Today's directive was a lean ("maybe use the event icon as the popup"). This verdict locks it as Model B+. Confirm before merge — it reverses yesterday's drafted spec.
2. **1-click home moves to the wordmark**, reversing yesterday's "the event/vendor/admin icon can serve as the back to home" framing. The plaque path to home is now 2 clicks (plaque → Home). If the owner rejects wordmark-as-link, home degrades to 2 clicks everywhere on desktop rails and the reachability table's 1-click Home rows collapse — this is the load-bearing piece, not decoration.
3. **Event switching costs +1 click on the discoverable path** (plaque → Home → picker) vs the shipped 2026-07-15 plaque-as-switcher. Accepted by this verdict; owner should acknowledge, since that plaque behavior was his own one-day-old design.
4. **Visual reposition:** the couple event plaque and vendor identity card move up into the rail header block (replacing the pill's slot). Owner-visible layout change on the atelier-glass rails — approve the placement, or the triggers stay in the sidebar bodies with the header slot removed from the spec (functionally equivalent, weaker structural coupling).

---

**Verdict: ship Model B+ with the seven acceptance criteria (unconditional trigger · atomic PR · collapsed-rail coverage · panel identity header · honest aria/labels · panel Link conversion · comment rewrite). Log the Model-A supersession in `DECISION_LOG.md`. Mobile and launcher untouched.**
