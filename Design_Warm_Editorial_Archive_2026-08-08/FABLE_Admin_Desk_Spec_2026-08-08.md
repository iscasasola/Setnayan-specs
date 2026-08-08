# FABLE build spec — Admin Exception Desk (frames 8a–8c) · Warm Editorial Archive

> ⛔ **SUPERSEDED ON THE ACTION COLOUR — owner ruling 2026-08-08: GOLD is the action
> colour, not terracotta.** Wherever this document says *"terracotta is the only
> action colour"* or *"gold is never a button"*, read the opposite. Everything else
> in this document still stands. See **`ACTION_COLOUR_OVERRIDE_2026-08-08.md`**.

> **Date:** 2026-08-08 · **Author:** Fable (design pass; Opus implements)
> **Binding rule (owner, verbatim):** *"do not just replace it. integrate it well."*
> **Sources read in full:** this bundle's `README.md`, `INTEGRATION_RULES.md`, frames
> 8a/8b/8c + captions in `Shell_all_frames_2026-08-08.html` (lines 775–976), the sibling
> `FABLE_Event_Overview_Spec_2026-08-08.md` (§ 2.1 recipe reused here), and the SHIPPED
> code at `origin/main` (worktree verified clean + 0 behind):
> `app/admin/work/page.tsx` + `actions.ts`, `app/admin/queues/_components/
> queues-triage-feed.tsx` (507 lines) + `queue-drawer.tsx`, `lib/admin/work-rows.ts`,
> `lib/admin/queue-peek.ts` (459 lines), `lib/admin/queue-counts.ts`,
> `app/admin/layout.tsx`, `_components/admin-sidebar.tsx` + `admin-sidebar-menu.tsx` +
> `admin-bottom-nav.tsx`, `app/admin/page.tsx` (the pulse), `app/admin/more/page.tsx`,
> `app/admin/verify/page.tsx` (1,711 lines) + `verify/actions.ts`, and the vendor side:
> `app/vendor-dashboard/services/page.tsx` (redirect), `_components/service-wizard.tsx`,
> `services-manager.tsx` (~1,800 lines), `payment-schedule-editor.tsx`,
> `addons-editor.tsx`, `showcase-media-fields.tsx`, `service-card-live-preview.tsx`,
> `lib/service-customization-draft.ts` (wizard steps), `lib/price-position.ts`,
> `lib/reviews.ts`, plus `globals.css` / `tailwind.config.ts` token blocks.
>
> **What this spec is:** a widget-by-widget DELTA — keep / restyle / extend / new —
> against what ships. Admin is staff-only and the lowest-eyeball surface in the
> product, so the bias throughout is **restyle, don't extend**, and several verdicts
> are plainly "this already works; leave it." Every behaviour branch inventoried in
> § 3 must survive the restyle (INTEGRATION_RULES rules 1–3).

---

## ⚠ The traps the implementer must hold in mind throughout

1. **Token naming (verified in `globals.css` this pass).** `--color-terracotta: 169 131 75`
   = **GOLD** `#A9834B`; `--color-mulberry: 194 78 37` = the **rust CTA** `#C24E25`
   (hover `#B04722` = `mulberry-600`, deepest `#9D3F1E` = `mulberry-700`). Every
   "action colour" below means **`bg-mulberry`**. ⚠ `tailwind.config.ts` still carries a
   stale comment calling mulberry "#5C2542 Rich Mulberry" — the CSS var is the truth;
   the comment is a fossil. Never trust a comment over the computed value.
2. **The work list is 5 merged PRs old (2026-08-05) and owner-approved. It is the thing
   the frame is drawing, not a thing the frame replaces.** `/admin/work` already IS the
   ranked exception list; `/admin/more` already IS the all-surfaces map; `?open=` drawers
   already settle payments / verify / approvals on one click and reviews / payouts on a
   form. Rebuilding any of it is the paid-twice failure. This spec touches its *skin*.
3. **The frame draws ITEM rows; the shipped list is QUEUE rows.** Frame 8a's rows
   ("Verify: Studio Azul Photography · 26h") are individual cases; the shipped rows are
   one-per-queue with a live count, and the individual cases live in the `?open=`
   drawer (top 3) and on each queue's own page. **This is not a defect in the port —
   it is two zoom levels of the same list**, and the shipped zoom is the one that
   scales past 7 items. The drawer is the frame's inspector, rendered under the row
   instead of beside it. § 0 maps every frame element onto that model; nothing is
   restructured.
4. **The one loud, real defect this pass found: the vendor wizard's "Publish service"
   CTA is `bg-terracotta` — a GOLD-FILLED button** (`service-wizard.tsx:341`, and its
   twin `canvas-maker.tsx:521`). After the Atelier token swap that renders gold, which
   violates the "gold is never a button" lock on the vendor's single most important
   button. The fix is a class swap, not a redesign (§ 2.10).
5. **Two shipped decisions the frame's copy accidentally conflates:** approving an
   *application* (grants `verification_state = verified` — the badge) and approving
   *visibility* (makes the shop publicly browsable) are **two separate actions on two
   separate tabs**, by owner ruling (hidden is the resting state; only an admin
   publishes). The frame's button "Approve — make the shop visible" is honest ONLY on
   the visibility surface. § 2.8 assigns each surface its own honest label.

---

## § 0 — How the frames map onto what ships

### Frame 8a — Admin home, work list + inspector (desktop)

| Frame element | Shipped equivalent | Verdict |
|---|---|---|
| Sidebar rail: SETNAYAN + 🛡 HQ plaque, 6 rooms (Work list · Vendors · Events · People · Studio · App health) | `DoorwaySidebarHeader` ("Setnayan HQ") + `SwitcherPlaqueTrigger` with `ShieldCheck` chip; the owner-locked flat 6-menu rail (Overview · Accounts · Studio · Ugat Console · App Performance · Money) + "All surfaces"; live badge roll-up with worst-urgency tone | **KEEP — zero changes.** The rail IA is triple-locked (6-menu respine 2026-07-04 · flatten 2026-07-15 · nav-shape guard `admin-nav-groups.test.ts`, born from a cleanup commit that deleted two groups). The frame's room names are sample content, and its own caption concedes the point: *"No room gets a custom colour; the work list is the only home."* The shipped rail already satisfies both clauses. The 🛡 emoji is a prototype artifact — the code deliberately retired emoji (screen readers read it aloud) for the `ShieldCheck` icon. |
| "Needs a human" list, 7 waiting · oldest 26 hours, ranked, oldest highlighted | `/admin/work`: `QueuesTriageFeed` — ranked overdue → due-soon → busiest, triage strip, lane chips, per-queue rows with live counts + oldest-age lines | **RESTYLE + two copy/data extends** (§ 2.2, § 2.3, E1–E2). Ranking, partitioning, counts, SLA machinery untouched. |
| Inspector column (verification case: doc rows, name match, services listed, Approve / Ask for a better photo, refusal-explainer) | Two shipped homes: the `?open=verify` **drawer** (top-3 items, docs-complete gate, one-click Verify) and the full **verify page** (doc slots + presigned views, Deep Search dossier, contact confirmations, SLA badges, approve/reject with required reason, audit log) | **KEEP the drawer + page split; do NOT build a third pane** (§ 2.4 restyles the drawer; § 2.8 restyles the verify page's controls). An inspector column would be a second copy of the 1,711-line case file — the exact drift the one-engine-two-entry-points rule exists to prevent. |
| Explainer card: "A refusal here writes a visible reason back to the vendor… Every action is logged with who and when." | Already TRUE and already SAID at the point of action: `rejectApplication` refuses without a reason, the textarea label reads "(required — surfaces to vendor)", and every decision writes `vendor_tier_history` + `admin_audit_log` (verified in `applyApplicationDecision` steps 3–4) | **KEEP — this already works; leave it.** No new card. |

### Frame 8c — Admin on a phone (triage)

| Frame element | Shipped equivalent | Verdict |
|---|---|---|
| The work list follows you to dinner | The SAME `QueuesTriageFeed` renders at every breakpoint (single column on phones); it is the mobile Overview tab's badge target | **KEEP** — inherits the § 2 restyle automatically (one component, both breakpoints) |
| Lead card with always-visible Approve / Open docs | Tap the row → `?open=` drawer → the same buttons | **KEEP the tap.** Always-visible buttons need a peek query on every page load for a row nobody may act on; the drawer keeps "only the named row pays for a peek query" and works with JS off. One extra tap is the price of that; declared deviation. |
| "Phone admin is triage only — approve, hide, ping. Anything needing documents side-by-side says 'finish this at a desk' instead of pretending." | Structurally satisfied: the drawer only ever offers actions the code can finish (hasProof gate, docs-complete gate, four-eyes gate — each shows a SENTENCE otherwise), and "Open" routes to the full page, which itself renders responsively | **KEEP — already honest by mechanism, not by copy.** No desk-sentence needed. |
| No bottom nav drawn | `AdminBottomNav` — owner-locked ≤5 tabs, badge on Overview with worst-urgency tone | **KEEP — zero changes.** The frame simply crops it. |

### Frame 8b — Creating a service (vendor, phone-first)

| Frame element | Shipped equivalent | Verdict |
|---|---|---|
| Name + category chips | Guided wizard `/vendor-dashboard/services/new/[category]` (category picked at entry) + `AddServiceForm` in the manager | **KEEP structure · restyle chips** to the gold-outline selected grammar (§ 2.9) |
| "What's included — one line each" + "+ Add a line" | `InclusionsEditor` (replace-all repeater) | **RESTYLE only** |
| "Optional add-ons — priced separately" with mono prices | `AddonsEditor` → `setServiceAddons` | **RESTYLE only** (mono already partial; complete it) |
| "Your price" + "To reserve a date · 30% deposit" | From-price (optional → quote-on-request) + `PaymentScheduleEditor` (downpayment row, %-or-₱ per row, No-Show Downpayment Protection) | **KEEP the full editor** — the frame's two fields are a compression of a richer shipped mechanism; collapsing to them would delete the schedule rows, anchors and protection flag. Restyle (§ 2.9). |
| Price-band hint "₱35k–₱65k for this scope — shown to you only" | Ships as the **Price-Position Meter** on the subscription surface (`lib/price-position.ts`), reading admin-managed `market_price_bands`; Market Intel is **Pro-and-up** (owner-locked SKU shape), and the band suppresses below the min-N floor — founder-only market ⇒ `no_data` almost everywhere today | **DO NOT BUILD in the editor.** Inlining it for every vendor gives a Pro feature away free (pricing-lock territory), and today it would render "not enough market data yet" for essentially everyone. Parked as an owner call (§ 5.4). |
| Photos — "the first is your card photo" | `primary_photo_r2_key` (explicit card cover) + `ShowcaseMediaFields` (≤5 photos + ≤30s video, watermark rule) | **KEEP the explicit cover field** (better than positional — reordering a gallery can't silently change the card); restyle; borrow the frame's plain caption for the cover field's label (§ 2.9) |
| "Save — show it on your shop" single CTA | "Publish service" + "Save as draft" two-button model behind the `canPublish` gate (photo + perk + category) | **KEEP both buttons** — the frame's single Save deletes the shipped draft path and the publish gate's three graded warnings. Fix the fill colour (trap #4), keep the pair. |
| "You can pause a service any time; paused services keep their reviews." | Pause ships (`toggleVendorServiceActive`, eye toggle "Live — tap to hide"). But reviews attach to the **shop** (`vendor_reviews.vendor_profile_id` — verified in `lib/reviews.ts`), not to a service — "paused services keep their reviews" claims a per-service mechanism that does not exist | **EXTEND (copy, corrected):** add the reassurance line under the publish row, worded to what is true: *"You can hide a card any time — it comes back exactly as you left it."* (§ 2.10) |
| The editor mirrors what couples see | `ServiceCardLivePreview` — live snapshot of the exact card as the vendor types (owner: "we want to see the exact card") | **KEEP — this already works; leave it.** |

### The "leave it alone" register (each verified this pass, kept verbatim)

Judgement queues render a **sentence, never a button** (`JUDGEMENT_QUEUES`) · `count === null`
→ chevron, never a zero, plus the topbar "Queue counts unavailable" pill · the dead-tap
guard (`EXPANDABLE_QUEUES` — a row with no peek keeps its plain link) · the payments
`hasProof` gate (no reference + no screenshot ⇒ sentence, not a button) · the verify
`docs_complete` gate · the four-eyes "You started this" swap · `unreadable` ("Could not
load these right now — this is not the same as the queue being clear") · the
`settle=`/`why=` refusal banner with its 5 distinct notices · "I agree" (never "Approve")
on second signatures · reviews `owner_self`/`team_member` impossible-publish sentence ·
payouts method+reference form · the `<details>` "N queues are clear" fold · the empty-lane
good-news card · `/admin/more` on both breakpoints · the ⌘K palette ("a shortcut, never
the only door") · the whole `after()` sweep stack in `layout.tsx` · the guided tour.

---

## § 1 — The surfaces, top to bottom

### 1a `/admin/work` (and everything `QueuesTriageFeed` renders)

| # | Block (shipped name) | Verdict | What changes exactly |
|---|---|---|---|
| 1 | Header (`sn-eye` "Admin" · `sn-h1` title · subtitle) | restyle + extend | Eyebrow per § 2.1 recipe; **H1 becomes "Needs a human"** on the work page only (E1 — the `title` prop; metadata + nav label stay "Work"); subtitle gains "· oldest Nh" (E2) |
| 2 | Settle notice banner (`SETTLE_NOTICES`) | restyle | Skin swap + tone re-map (§ 2.5). All 5 notices + the `why` line survive |
| 3 | `TriageStrip` (late / due soon / on pace + bar) | restyle | Colour vocabulary re-map (§ 2.2); mono numerals already ✓; unit ("items waiting, not queues") untouched |
| 4 | `LaneChips` (All · Money · Trust · Growth · Support) | restyle | Selected-chip grammar (§ 2.6); "<2 lanes present ⇒ no chips" rule untouched |
| 5 | All-clear tile | keep | Token pass only; copy verbatim |
| 6 | "Needs attention now" section (overdue) | restyle | Header + badge colours per § 2.2 |
| 7 | `TriageRow` ×N | restyle | Card recipe + urgency colours + mono badge (§ 2.3). Ranking, partition, dead-tap guard, aria labels untouched |
| 8 | `QueueDrawer` (under the open row) | restyle | § 2.4. Buttons are ALREADY mulberry-filled + cream — keep, verified |
| 9 | "N queues are clear" `<details>` | keep | Token pass only |
| 10 | Empty-lane card | keep | Token pass only; copy verbatim |

### 1b Admin chrome (layout · sidebar · bottom nav · `/admin` pulse · `/admin/more`)

| # | Block | Verdict | What changes exactly |
|---|---|---|---|
| 1 | Sidebar rail (6 menus + All surfaces) | **keep — zero changes** | Owner-locked ×3; active state is the shipped gold-700 + pill grammar, already the handoff's own nav rule |
| 2 | HQ plaque + topBar (SLA pills · bell · role badge · sign-out) | keep | Token pass on the three SLA pills only (§ 2.7) — the 3-state honesty (overdue / due-soon / **unavailable**) must survive |
| 3 | `AdminBottomNav` + `AdminNavFab` + ⌘K palette | **keep — zero changes** | Owner-locked ≤5 tabs; badge tones re-map with the shared vocabulary automatically if the shared `NavBadge` tones are already themed — do NOT fork them here |
| 4 | `/admin` pulse (KPIs · lanes · more-queues · activity) | restyle (light, separate unit) | Token pass with the § 2.1 recipe (14 `sn-*` sites). Not drawn by any frame; no structural change; its curated lane grouping (deliberately ≠ the canonical lanes) untouched |
| 5 | `/admin/more` all-surfaces grid | keep | Token pass only via shared classes |

### 1c `/admin/verify` (the case file behind frame 8a's inspector)

| # | Block | Verdict | What changes exactly |
|---|---|---|---|
| 1 | Surface tabs (Applications / Visibility) + status tabs | restyle | Chip grammar § 2.6 |
| 2 | `ApplicationCard` (doc slots · presigned views · contact confirmations · Deep Search) | restyle | § 2.1 card recipe; `SlotDetail` "View document →" links → `#3B4E67` (already the frame's colour for these) |
| 3 | `ActionRow` — Approve (`button-primary` ✓) · "Reject…" disclosure (gold outline) · "Confirm reject" (gold-tint fill) · Demote | restyle + copy | § 2.8 — the two gold controls re-map; labels get the per-surface plain-language split |
| 4 | `VerifyCard` (visibility surface) — Approve → Verified / Reject → Hidden / Archive | restyle + copy | § 2.8 |
| 5 | `SlaBadge` / `StatusBadge` / `VisibilityBadge` | restyle | § 2.6 status-tint re-map (notably: `overdue` is currently a GOLD tint — it joins the urgency vocabulary) |
| 6 | `Avatar` r2:// presign fallback → initials | keep | Verified behaviour; token pass only |

### 1d Vendor service editor (`/vendor-dashboard/shop` manager + `/services/new/[category]` wizard)

| # | Block | Verdict | What changes exactly |
|---|---|---|---|
| 1 | Wizard step rail + step sections | restyle | § 2.9; `serviceWizardSteps` order/flags untouched |
| 2 | Publish / Save-as-draft row + `canPublish` warnings | restyle (defect fix) | **`bg-terracotta` → `bg-mulberry`** (+ hover 600) on "Publish service" and `canvas-maker.tsx:521`; draft button keeps its quiet outline; all three warning variants survive (§ 2.10) |
| 3 | `PaymentScheduleEditor` | restyle | %/₱ toggle pills `bg-terracotta text-white` → selected-chip grammar (§ 2.9) — fixes gold-fill AND pure-white-label in one move; row move/remove hover accents → ink |
| 4 | `InclusionsEditor` · `DiscountsEditor` · `PriceBracketsEditor` · `AddonsEditor` | restyle | Card recipe; `--m-paper-2` second-surface panels → cream + border (the house "never a second surface" rule); money/₱ inputs + rendered prices → Space Mono |
| 5 | `ShowcaseMediaFields` + primary photo | restyle + label copy | Cover-field label: "Photos — the first one is your card photo" (frame's phrasing, mapped onto the explicit cover slot) |
| 6 | `ServiceCardLivePreview` | keep | Inherits the card recipe only insofar as the PUBLIC card restyles in its own unit — the preview must keep mirroring the real card, so it changes when the card does, never independently |
| 7 | Manager row chrome (eye toggle · congrats banner · off-peak nudge · category-request badges · coverage panel · card records) | keep | Token pass only; every flag + nudge condition untouched |
| 8 | Reassurance line under publish | **extend (new copy)** | *"You can hide a card any time — it comes back exactly as you left it."* (§ 2.10) |

**Net-shape check** (INTEGRATION_RULES): after every unit, `git diff --stat` ≈ flat; zero
removed exports; zero removed conditionals. The guard tests that encode this surface's
past bugs — `work-rows.test.ts`, `queue-peek-coverage.test.ts`,
`admin-nav-groups.test.ts`, `admin-search-parity.test.ts`,
`lib/guards-can-actually-fire.test.ts` — stay green, untouched.

---

## § 2 — Per-widget visual specification

### 2.1 The shared recipe

**Reuse the sibling spec § 2.1 wholesale** (card surface `#FDFBF7`, border `#E1DCD1`,
radius 14, separators `#EDE8DE`, Space Mono eyebrows in `#8A6B39`, mulberry-filled
primary + mulberry-outline secondary, links `#3B4E67`, 44×44 targets, "12 Dec 2026"
dates). Same scope guard: **swap classes in these surfaces' markup only — never restyle
`.sn-*` globally** (consumers exist app-wide).

### 2.2 The admin urgency vocabulary (replaces the stock `#B42318`/`#B54708`/`#8A6A2E` triple)

The shipped mechanism (due-state → accent border, badge fill, age-line colour, strip
segments) is correct and stays. Only the constants re-map, in-palette:

| Due state | Text / accent | Filled badge (cream label) | Meaning |
|---|---|---|---|
| `overdue` | `#C24E25` (the frame's own "26h" colour) | `#9D3F1E` (`mulberry-700`, 6.42:1 ✓) | past its promise |
| `due-soon` | `#8A6B39` | `#8A6B39` (4.9:1 ✓) | closing in |
| `ok` (open) | age line `#8A857B` | **no fill** — outline chip: 1px `#E1DCD1`, ink mono numeral | fine, just waiting |
| `clear` | — | `Check` in `#8A857B` | — |
| `null` | — | `ChevronRight` in `#8A857B` (unchanged — never a zero) | not measured |

- **Why the badge fill is `#9D3F1E`, not `#C24E25`:** in Warm Editorial a `#C24E25` fill
  means *you can press this*. A count badge is not pressable; one shade deeper keeps the
  alarm without the fake affordance. Text accents may use `#C24E25` freely (the frame does).
- **Why on-pace loses its fill:** colour should appear exactly when time pressure exists
  ("the eye lands on the deadline first" — the shipped file's own rule, taken one step
  further). The champagne `#8A6A2E` fill goes; the count stays, quiet.
- The frame's gold-bordered lead card (border `#A9834B` + `rgba(169,131,75,.07)` wash)
  is **re-mapped, not copied**: in this vocabulary gold means *closing in*, so a gold wash
  on an overdue card would say the wrong thing. Overdue rows keep the shipped 3px left
  accent, now `#9D3F1E`; due-soon rows get it in `#8A6B39`.
- `TriageStrip`: numerals `#9D3F1E` / `#8A6B39` / `#6E6A62`; bar segments match; track
  `rgba(30,26,18,.08)`. Labels + aria strings verbatim.

### 2.3 `TriageRow`

- Row card: § 2.1 recipe (border `#EBE5D9` per the frame, radius 12–14, min-height 64 ✓).
- Icon coin: keep 44×44 `bg-ink/5`; icon colour = urgency text colour when open, `#8A857B`
  when not.
- Label 15px Hanken 700 ink; lane tag keeps its mono-uppercase micro-chip, colour `#8A857B`
  on `bg-ink/5`.
- Age line ("Oldest 26h · past SLA"): stays in place (the right slot belongs to the count —
  the frame's right-aligned age fits item-rows, not queue-rows; declared deviation),
  coloured by § 2.2, and the **duration token renders Space Mono** via the existing
  `ageShort` value (E3): compose `Oldest <span mono>26h</span> · past SLA`.
- **Count badge: Space Mono 700** (it is a numeral — the README's own rule, currently
  Hanken), fills per § 2.2.
- Hover: keep `hover:bg-[var(--sn-paper)]` → re-token to `rgba(169,131,75,.04)`.
- `aria-expanded`, toggle-vs-plain-link logic, `aria-label` strings: byte-identical.

### 2.4 `QueueDrawer`

- Container: keep the borderless under-row band; separators `#EDE8DE`.
- Item title/detail: title 14px 700 ink (₱ titles already mono via `formatCentavosPhp` —
  ensure `font-mono` on the rendered element, E4); detail 12px `#6E6A62`.
- **Action buttons: keep — verified already compliant** (`var(--sn-cta, #C24E25)` fill +
  `#FDFBF7` label). Only normalize radius to 8 and min-height toward 44 (pad hit area,
  not visual bulk — the shipped `py-1.5` pills gain the `::before` inset trick the topbar
  pills already use).
- Form fields (reviews reason · payouts method+reference): border `#E1DCD1`, radius 8,
  bg cream; the **reference input renders Space Mono** (it will be read back against a
  bank statement — transcription is the job, E4). Field lists still come from
  `queue-peek.ts` only.
- Judgement sentence, unreadable warning, "Nothing waiting here", "N more · see all",
  notes-in-place-of-buttons: **copy verbatim**, colours: warnings `#9D3F1E`, notes
  `#6E6A62`, links `#3B4E67`.

### 2.5 Settle notices

Tone re-map onto the sibling § 2.9 chip vocabulary: `warn` → icon + headline `#9D3F1E`,
card border `rgba(194,78,37,.30)`, bg `rgba(194,78,37,.06)`; `ok` → `#5E7C52` on
`#E9EEE3`. The five keys, the `why` line, and `role="status"` untouched.

### 2.6 Chips + status badges (work list lanes · verify tabs · SLA/status badges)

- **Selected chip** (lane active, tab active): 1.5px border `#A9834B`, bg
  `rgba(169,131,75,.08)`, text `#8A6B39` 600 — the frame 8b grammar. Selection is state,
  not action: gold is legal here.
- **Idle chip:** 1.5px `#EBE5D9`, text `#6E6A62`.
- Verify `SlaBadge`: `overdue` re-maps from its current gold tint to `#C24E25` on
  `rgba(194,78,37,.10)` (consistency with § 2.2 — an SLA breach must not wear the
  "waiting" colour); `due-soon` gold tint stays; `ok` sage.
- `StatusBadge`/`VisibilityBadge`: rejected/demoted → `#C24E25` tint family; approved →
  sage; pending/in-review → gold tint. Text-only accents; no fills behind actions.

### 2.7 Layout chrome touch-ups (only these)

The three topbar SLA pills re-token: overdue → text `#9D3F1E` on `rgba(194,78,37,.12)`;
due-soon → `#8A6B39` on `rgba(169,131,75,.14)`; **"Queue counts unavailable" keeps its
neutral ink treatment** — it must never look like either urgency, and never disappear.
Hit-area `::before` insets stay. Everything else in `layout.tsx`: zero changes.

### 2.8 Verify page controls (the frame's inspector buttons, honest per surface)

| Control | Was | Becomes |
|---|---|---|
| Applications · Approve | `button-primary` "Approve → Verified" | Keep fill (already mulberry). **Label: "Approve — grant the verified badge"** (plain-language; this action does NOT publish the shop) |
| Applications · "Reject…" disclosure | gold-outline chip | **Slate outline** — 1.5px `rgba(59,78,103,.3)`, text `#3B4E67` (the frame's secondary grammar). **Label: "Send it back…"** with the reason form unchanged — the shipped placeholder ("DTI certificate image is unreadable; please re-upload") shows this flow already IS the frame's "Ask for a better photo" |
| Applications · "Confirm reject" | `bg-terracotta/15 text-terracotta-700` (gold-tint **button** — lock violation) | Mulberry-outline secondary: border `rgba(194,78,37,.30)`, text `#C24E25`, hover `bg-mulberry/10` |
| Visibility · Approve | `button-primary` "Approve → Verified" | Keep fill. **Label: "Approve — make the shop visible"** (the frame's copy lands here, where it is true; ConfirmForm title/message already say exactly this) |
| Visibility · Reject → Hidden / Archive | `button-secondary` / ink outline | Keep; token pass only |
| Demote flow | warn family | Keep (it is an emergency moderation control; its amber-family distinctness is earned) — re-token warn to the `#9D3F1E`-family only if the shared warn tokens themselves re-map; do not fork locally |

Frame elements NOT built: the "Name match ✓ matches" row (no automated name-match
exists — the DOC_SLOTS hint + Deep Search dossier support a *manual* check; inventing an
automated ✓ would be a fake claim) and the "Services listed · 2 · both priced" row on the
applications card (ships on the visibility card + dossier already; duplicating it onto
applications is a nice-to-have, not this pass).

### 2.9 Vendor wizard + manager (restyle)

- **Chips** (category, %/₱ toggles, discount types): § 2.6 grammar. This retires the
  `PaymentScheduleEditor`'s `bg-terracotta text-white` active pills — fixing the
  gold-fill and the pure-white label in one swap.
- **Inputs:** border `#E1DCD1` idle → **1.5px `#A9834B` focused/filled** (the frame's
  active-field treatment; it matches the shipped gold focus-ring convention).
- **Money everywhere mono:** price inputs, add-on prices, bracket amounts, the preview's
  "from ₱X", discount values — Space Mono. (The frame renders every peso figure mono;
  the shipped editors are inconsistent.)
- **Second surfaces go flat:** `--m-paper-2` panel fills → cream + 1px `#E1DCD1`.
- Info banners (`new/[category]/page.tsx:156` gold-tint) stay — accent, not action.
- Cover-photo label: **"Photos — the first one is your card photo"** on the primary
  slot; the dashed "+" add tile per the frame (`1.5px dashed #C9BFA9`, `#8A6B39` plus).
- Step rail: eyebrow-style mono step labels; active step ink 800; completed steps get
  the sage ✓; `Lock` states untouched.

### 2.10 The publish row (defect fix + one copy extend)

```
[ Publish service ]  [ Save as draft ]
You can hide a card any time — it comes back exactly as you left it.
```

- "Publish service": `bg-mulberry text-cream hover:bg-mulberry-600` (was
  `bg-terracotta`/gold — trap #4). Same for `canvas-maker.tsx:521`. `disabled:opacity-50`
  and the `canPublish` gate + its three graded warnings: untouched.
- "Save as draft": keep the quiet ink outline.
- The reassurance line: 12px `#A09A8E`, centred under the row (the frame's position).
  **Not** the frame's review claim — reviews are shop-level (verified, `lib/reviews.ts`),
  so the honest promise is state-preservation, which `is_active` toggling actually
  delivers. The frame's sub-header "shows on your shop page once saved" is NOT adopted
  either: for an unverified shop the page is not public, and My Shop already carries the
  honest version ("goes live to couples once Setnayan approves your shop").

---

## § 3 — Every state each touched widget must still render

Derived from the shipped code, not the frames. The restyle is DONE only when each of
these renders correctly under the new skin.

### 3.1 Work list page
1. All queues clear → subtitle "You're all caught up…", all-clear tile, no strip
   (`total === 0` returns null), clear rows folded in `<details>`.
2. Digest fetch throws → **fails open to all clear on the list** while the topbar shows
   "Queue counts unavailable" (the honesty pair — both halves must survive).
3. `count === null` on a row → chevron, no badge, row still routes (never a zero, never
   filed under clear — `partitionQueues` puts null in `waiting`? **verify at build**: the
   partition source is `lib/admin/queue-partition.ts`, unread this pass — § 5.6).
4. Overdue present → "Needs attention now" section + "Also waiting" header appears on
   the remainder; no overdue → single unlabelled section.
5. Lane filter: unknown `?lane=` value → full list (stale bookmarks degrade); chosen
   lane all-clear → the good-news card with "See every queue"; <2 lanes present →
   no chips at all.
6. `?open=` on an expandable queue → drawer; on a non-expandable queue key → plain rows
   (the dead-tap guard); toggle preserves `lane`, close drops only `open`.
7. `settle=` notices ×5 (`shortfall` · `duplicate` · `refused` · `missing` · `published`)
   with and without `why`.
8. Strip counts items not queues; built from the UNFILTERED list even when a lane is
   active.

### 3.2 Drawer
1. Judgement queue → sentence + "Open {label}", never buttons. 2. `unreadable` → the
"could not look ≠ clear" warning. 3. Empty → "Nothing waiting here." 4. Payments:
hasProof → Confirm button; no proof → the sentence. 5. Verify: docs complete → "Verify
shop"; else "Waiting on documents", no button. 6. Approvals: `mine` → "You started
this — a different admin has to agree."; else "I agree". 7. Reviews: `owner_self`/
`team_member` → impossible-publish sentence; else the reason-required form. 8. Payouts:
always the method+reference form. 9. "N more · see all {total}". 10. Every refusal
bounces back to the exact `backTo` URL (lane + open preserved).

### 3.3 Chrome
1. Topbar pill: overdue > due-soon > unknown > nothing (strict precedence). 2. Sidebar
parent badges: roll-up count, worst-child tone, aria "some overdue". 3. Bottom-nav
Overview badge: summed count, tone escalation. 4. Registry overlay: renamed/hidden nav
slots still apply after the restyle (labels are data, not markup).

### 3.4 Verify page
1. Two surfaces × their tab sets (applications: pending / in_review / approved /
rejected / demoted / all · visibility: hidden / verified / archived / all — `coming_soon`
only inside `all`). 2. Empty-tab hint sentences per `parseApplicationsTab`. 3. Logo
`r2://` presign failure → initials avatar, never a broken glyph, never a crashed queue.
4. SLA tones incl. the re-mapped overdue. 5. Deep Search: no dossier / running / rows /
error banner (`bg-terracotta/5` warning at :1043 restyles with § 2.6). 6. Reject/demote
`<details>` popovers position + required `minLength={5}` textareas. 7. FormFlash
success/error banners. 8. Demoted-vendor cards without applications.

### 3.5 Wizard
1. Step sets: base 5 · +★ Customization (flag) · +Comes with (`hasOtherCategories`).
2. `canPublish` false → the three graded warning variants (no photo+perk / no photo /
no perk); publish disabled, **draft always enabled**. 3. Quote-on-request (no price).
4. `claimToken` present → couple-claim registration path. 5. Live preview mirrors every
editor incl. React-controlled hidden inputs (its interval poll must survive).

### 3.6 Manager
1. Congrats banner: `created=live` vs `created=draft`; `autonamed=N` line. 2. Off-peak
nudge opens + pre-fills exactly one service's discount editor. 3. Category-request
badges ×5 statuses. 4. Eye toggle live/hidden + "· hidden" row suffix. 5. Tier caps
(slots, `canPlotTimeSlots`). 6. Card records flag OFF → zero extra queries, no section.
7. Coverage tree read fails → full vocab in the serves sheet, never a false restriction.
8. Payment schedule: zero rows clears; per-row % vs ₱; anchors; No-Show protection
   only on the first row.

---

## § 4 — Fable's enhancements (each justified, all small)

- **E1 · "Needs a human" as the work-list H1.** The frame's one genuinely better word.
  `title` prop on `/admin/work` only; metadata stays "Work · Admin", nav label stays
  "Work" (bookmarks, tab continuity). It is also a truthful description of `BASE_ROWS` —
  a list of exceptions no automation may settle.
- **E2 · "· oldest 26h" in the subtitle.** `min(oldestAt)` across the already-loaded
  digest + the existing `ageShort` — zero new queries. The frame's header carries it;
  the shipped page already computes per-queue ages, so the whole-day figure is free.
  Skip the clause when no queue has a timestamp (never "oldest —").
- **E3 · Space Mono on every numeral** the feed renders (count badges, strip numbers ✓
  already, age tokens, drawer ₱ titles). The README's own rule applied one level deeper.
- **E4 · Mono reference inputs** in the payouts/reviews drawer forms — those strings get
  transcribed against bank statements; mono is a legibility feature, not a style.
- **E5 · The per-surface approve labels** (§ 2.8) — the frame's plain-language button,
  split so each surface claims only what its action does. The frame's single label
  conflated the badge with visibility; the split is the honest port.
- **E6 · The publish-CTA colour fix** (§ 2.10) — strictly the lock applied, but named
  here because it is the most visible change on the vendor side.
- **E7 · The corrected pause reassurance** (§ 2.10) — the frame's intent, reworded to a
  mechanism that exists.

**Deliberately NOT enhanced:** the inspector column (the drawer + case-file split is the
shipped answer) · an item-level flat work list (the queue zoom scales; items live one
tap in) · any rail rename or regroup (owner-locked ×3) · the inline price band (Pro
lock + no-data reality) · always-visible phone buttons (peek-cost + dead-control risk) ·
a third home for the verify case data · one-click anything on judgement queues (locked;
the sentence IS the feature) · merging `/admin` into `/admin/work` (both survived the
owner's own simplification pass three days ago).

---

## § 5 — Could not verify / not stated (do not invent during build)

1. **`lib/admin/queue-partition.ts`** — not read; § 3.1.3 assumes null-count rows land in
   `waiting`, matching the feed's null-⇒-chevron render. Confirm before touching the
   partition's inputs (it must keep filing null as "not measured", never as clear).
2. **Whether a rejected application has a vendor-side resubmission path** — the reject
   placeholder implies re-upload, but no `resubmit` symbol surfaced in
   `lib/vendor-verification.ts`. The "Send it back…" label (§ 2.8) is safe either way
   (the reason reaches the vendor regardless), but do not promise "and they can fix it"
   in any copy until traced.
3. **The shared `NavBadge` tone theming** — whether red/amber tones are centrally
   tokened (one re-map) or per-consumer hexes. If central: re-map once; if scattered:
   the admin chrome keeps stock tones this pass rather than forking the primitive.
4. **The Price-Position Meter's exact tier gate in code** — CLAUDE.md locks Market Intel
   Pro-and-up; the card renders on the subscription surface with a "Soon" badge. Whether
   an editor-inline variant could ever be free-tier is an **owner pricing call**; parked.
5. **`manager-tabs.tsx`, `coverage-panel.tsx`, `refinements-editor.tsx`,
   `customization-step.tsx`, `pricing-basis-editor.tsx` internals** — not read line-by-
   line; the § 2.9 recipe applies by class family, and their conditionals are covered by
   the § 3.6 inventory at the granularity verified. List their branches before editing
   (INTEGRATION_RULES rule 3).
6. **`/admin` pulse internals below line 120** — skimmed structurally (lanes, ring,
   activity), not exhaustively; its restyle unit must do its own branch listing.
7. **Whether `button-secondary` (used by Reject → Hidden) already resolves to an
   acceptable Warm Editorial treatment** — check the shared class before adding local
   overrides; prefer the shared class.

---

## § 6 — Build order (restyles land before extends — rule 6)

1. **Unit A (restyle · the shared feed):** § 2.2 urgency vocabulary + § 2.3 rows +
   § 2.4 drawer + § 2.5 notices + § 2.6 chips + § 2.7 topbar pills. One component tree;
   zero behaviour deltas; both breakpoints inherit. Run the mechanical check; expect
   ~flat net lines and **zero** removed conditionals.
2. **Unit B (restyle · verify):** § 2.8 controls + § 2.6 badges + card recipe across the
   1,711-line page. Copy labels land here (E5) — copy in JSX is still a style-layer
   change; the actions, ConfirmForm gates and reasons are untouched.
3. **Unit C (restyle · vendor editor):** § 2.9 + § 2.10 including the two `bg-terracotta`
   CTA fixes and the toggle-pill grammar. The live preview is verified unchanged-by-
   construction after this unit (it reads FormData, not classes).
4. **Unit D (extends):** E1 title · E2 oldest-subtitle · E7 reassurance line. Each adds
   a branch already inventoried in § 3.
5. **Separate light unit:** `/admin` pulse token pass (1b.4) — after A so the shared
   vocabulary exists.
6. **Parked pending owner:** inline price band (§ 5.4) · anything touching the rail,
   bottom nav, or the judgement-queue rule (all currently NOT granted).

Suite runs `TZ=Asia/Manila` (+ the house timezone matrix) before any PR; the five guard
tests named in § 1 stay green **untouched** — a red guard after a restyle means the
restyle changed behaviour; fix the code, never the test.
