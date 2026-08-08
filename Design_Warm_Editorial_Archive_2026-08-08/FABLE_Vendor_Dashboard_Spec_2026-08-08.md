# FABLE build spec — Vendor Dashboard `/vendor-dashboard` · Warm Editorial Archive (frames 7a–7d)

> **Date:** 2026-08-08 · **Author:** Fable (design pass; Opus implements)
> **Binding rule (owner, verbatim):** *"do not just replace it. integrate it well."*
> **Sources read in full:** this bundle's `README.md`, `INTEGRATION_RULES.md`,
> `OPEN_QUESTIONS_ANSWERED_2026-08-08.md`, frames 7a–7d + their captions in
> `Shell_all_frames_2026-08-08.html` (lines 483–764), the sibling
> `FABLE_Event_Overview_Spec_2026-08-08.md` (whose § 2.1 shared card recipe this
> spec REUSES, not re-invents), and the SHIPPED code in
> `/Users/icecasasola/wt-win/apps/web/app/vendor-dashboard/` (worktree verified
> one commit ahead of `origin/main` `af8c84e26`, the handoff's own baseline):
> `layout.tsx` (379 lines) · `page.tsx` (305) · `_components/overview-sections.tsx`
> (894) · `_components/vendor-sidebar.tsx` (443) · `_components/vendor-bottom-nav.tsx`
> (236) · `_components/vendor-nav-fab.tsx` · `_components/feature-accordion.tsx` ·
> `shop/page.tsx` (1,623) · `customers/page.tsx` (787) ·
> `customers/_components/customers-calendar.tsx` (478) · `lib/vendor-overview.ts`
> (550) · `lib/vendor-customers.ts` (375) · `globals.css` token block.
>
> **What this spec is:** a widget-by-widget DELTA — keep / restyle / extend / new —
> against the pages that ship. **Headline finding: the "new" column is empty.**
> Every widget the frames draw already ships; the deltas are a skin swap, a set of
> CTA-colour corrections, five honest extends, and two frame ideas REJECTED because
> they collide with owner locks. § 4 inventories every state each touched widget
> must still render, derived from the shipped components, not the frames.

---

## ⚠ The five traps the implementer must hold in mind throughout

1. **Token naming.** `--color-terracotta` holds **GOLD** (`169 131 75` → `#A9834B`);
   the rust CTA is `--color-mulberry` (`194 78 37` → `#C24E25`) — verified in
   `globals.css:140/158`. Every "action colour" below means **`bg-mulberry`**.
   A phantom token renders with no background at all; name only tokens verified here.
2. **The vendor Overview's primary CTA is GOLD-FILLED today** — the focal's
   "Answer them" pill (`overview-sections.tsx:183`, `--sn-gold-500` fill). Under the
   *gold-is-never-a-button* lock this is the single most visible fix on the whole
   surface. Style-only flip: same `<Link href="#whats-new">`, same copy, mulberry fill.
3. **The decision feed's rows are FORMS, not links.** Accept/Decline/Confirm-lock are
   real server-action `<form>`s acting in place (`overview-sections.tsx:578–641`).
   Frame 7d draws them as one-line `→` rows — porting that literally would delete
   the act-in-place behaviour the Overview exists for. Restyle the cards; keep the forms.
4. **The calendar does NOT live in My Shop.** Frame 7c draws "Calendar" as My Shop's
   first tab; the shipped calendar is the CENTREPIECE of **My Customers**
   (`customers/page.tsx:44`, owner dedup 2026-07-12: *"calendar already on the
   page"*), with its edit tools under the "Availability & capacity" fold. § 0 rejects
   the relocation. Do not move it; do not build a second calendar.
5. **The masked inquiry stays masked.** A pending inquiry card carries NO couple
   identity by construction (`vendor-overview.ts:199–216`, anonymization-until-accept).
   Frame 7d's "New inquiry — Kasal, 12 Dec 2026" happens to be identity-free — keep
   it that way. No restyle may route `meta.displayName`/`venue` into a pre-accept card.

Also standing, said once: the focal's honesty line *"you keep 100% — 0% commission,
settled off-platform"* is **CORRECT AND STAYS** (owner correction 2026-08-06: 0%
commission and the vendor booking fee are both true at once — the fee is never called
commission, and this line is not about the fee). Do not "fix" it during the restyle.

---

## § 0 — How frames 7a–7d map onto what ships

| Frame | What it draws | Shipped equivalent (verified on disk) | Verdict |
|---|---|---|---|
| **7c** | Desktop shell: 5-item rail (Overview·My Shop·My Customers·My Performance·On the day), My Shop open on a "Calendar" tab with a month grid + day list + "Block dates · set a hold" | The 5-page rail **already ships name-for-name** (`vendor-sidebar.tsx:227–245`, owner-locked 2026-07-12; also the phone bar `vendor-bottom-nav.tsx:75–176`). My Shop ships as hero → stat strip → ManageTiles → VerifySection → Services → Earnings → `FeatureAccordion` (Contracts·Proposals·How clients pay you·Manpower·More tools). The month grid ships in **My Customers** (`CustomersCalendar`) | **Rail: KEEP** (its skin belongs to the shell unit, frames 1a–1d — `SidebarShell`/`SidebarItem` are shared three-doorway chrome; restyling them here would fork it). **Calendar-in-Shop: REJECT** (trap 4). **My Shop body: RESTYLE in place** (§ 2.6); the frame's horizontal tab pills do NOT replace the owner-locked accordion (§ 1.2 row 8) |
| **7d** | Phone Overview: identity row → "NEEDS YOU TODAY" decision rows (dot · label · sub · →) → "THIS WEEK" 2-up stats → 5-tab bottom bar | `/vendor-dashboard/page.tsx` — **already a decision surface** (rebuilt 2026-07-01: hero → `VendorTodayFocal` → `VendorEnergyStats` → `WhatsNewFeed` → info tile → `OngoingTasks` → `UpcomingSchedules`). Bottom bar ships the same five destinations | **RESTYLE + EXTEND** (§ 1.1, § 2.2–2.5). Bottom bar: **KEEP — zero changes** (lint-guarded canonical template; README nav lock) |
| **7a** | Phone calendar full-screen: month header with "6 booked · 2 held", mono grid, 4-state legend (Booked / Booked·Setnayan / Held / Blocked), "This month's days" agenda | `CustomersCalendar` (pipeline centrepiece) + day cells linking `/vendor-dashboard/calendar/[date]` + `CalendarSurface variant="manage"` behind `?open=availability`. Shipped taxonomy is **6 states** (blocked > locked > whitelist > full > booked > waitlist — `vendor-customers.ts:61–67`), richer than the frame's 4. The agenda below the grid ≈ the shipped Customers list on the same page | **RESTYLE + EXTEND** (§ 2.7). The frame UNDER-draws: keep all six states. "Held with an expiry + nudge sent" does **not ship** — finding, not designed (§ 5.1) |
| **7b** | The event run-of-show (couple's schedule, vendors see their rows) | The couple's event-dashboard schedule + the vendor's share of it via **On the Day** (`on-the-day/page.tsx`, category-conditional console) | **OUT OF THIS UNIT'S SCOPE.** 7b is the couple's surface (deliverable 3/its own unit); the vendor-side console is not drawn by any frame beyond its nav entry. Token pass only, no design here |

**Rejected from the frames, with reasons (do not build):**

- **The Overview rail badge "3"** (7c). The shipped live badge is on **My Customers**
  (`vendorCustomersBadge(bookingsPending, threadsUnread)`, one shared helper for
  laptop AND phone — the 2026-08-06 parity fix). The frame's Overview badge is the
  same pending-inquiry count in a second home; one number, one home. Feeding it the
  *full* decision count (locks + reviews + disputes) would put four extra reads on
  the layout's critical path, which re-renders on **every** sidebar navigation.
- **Calendar as a My Shop tab** (7c) — trap 4.
- **The horizontal tab-pill strip** (7c) replacing the accordion — the
  `FeatureAccordion` interaction is owner-locked (*"no button hyperlinks · same as
  profile that expands and collapses · one page access"*, 2026-07-12) and its
  `?open=` + legacy `?tab=` alias mechanics keep old deep-links alive. Restyle its
  skin (§ 2.6), keep its shape.
- **One-line link rows in the decision feed** (7d) — trap 3.
- **"Held (dashed)" as a calendar legend state** (7a/7c) — no expiring-hold
  mechanism ships (§ 5.1). The shipped `locked` (hard hold) + `whitelist`
  (approve-first) + `waitlist` (couples queued) already cover the territory honestly.

---

## § 1 — The pages, top to bottom

"Skin swap" = the sibling spec's § 2.1 recipe (Atelier-Glass → Warm Editorial flat
cards: cream surface, 1px `#E1DCD1` border, 14px radius, `0 1px 3px rgba(30,26,18,.06)`
shadow, Space-Mono eyebrows in `#8A6B39`, links `#3B4E67`, mulberry actions). That
recipe is REUSED verbatim — this spec adds only vendor-specific applications.
**Scope guard (same as sibling):** never restyle `.sn-*` classes globally; swap
classes in this surface's markup only.

### 1.1 Overview — `/vendor-dashboard` (render order of `page.tsx`)

| # | Block (shipped name) | Verdict | What changes exactly | Why |
|---|---|---|---|---|
| 0a | `AgentHome` (agent/viewer landing) | keep | Token pass on its `sn-tile` only | Role gate invisible in the frame; must survive |
| 0b | No-profile team landing | keep | The gold-700 "create your own" link → `#3B4E67` | Gold text-link retirement (§ 2.1 of sibling) |
| 0c | Loader-failed page ("Overview is temporarily unavailable.") | keep | Nothing | The honest failure page; frames can't draw it |
| 1 | Hero (`Kumusta, {shop} · {date}` + `Your shop, today.` + subline) | restyle | Greeting date → short day-first "Sat, 8 Aug" (§ 2.8); type tokens; both subline branches stay | Frame 7d's identity row = this hero + the layout plaque; no second identity row is built |
| 2 | Business-milestone pill | keep | Token check only (gold-100 chip = accent, allowed). ⚠ The "Plan a celebration →" CTA was owner-RETIRED 2026-08-05 — must NOT reappear | Owner ask; badge stays, door stays dead |
| 3 | `VendorTodayFocal` (obsidian tile) | restyle | Obsidian-glass → solid **ink** `#2C2A29` card; **gold "Answer them" CTA → mulberry fill, cream label** (trap 2); veil/capiz ornaments dropped; every branch kept (§ 2.2) | The vendor twin of the couple's focal; sibling § 2.4 grammar |
| 4 | `VendorEnergyStats` (KPI bento) | restyle | Flat cards; countdown ring → mono date grammar; cash-flow ring → thin gold bar; both empty states kept (§ 2.3) | Frame 7d's "This week" 2-up is this bento, flattened |
| 5 | `SpotlightAwardBanner` | keep | Token pass only (own internals; empty → renders nothing) | Conditional celebratory surface |
| 6 | `WhatsNewFeed` ("What's new") | restyle + extend | Retitled **"Needs you today"**; § 2.1 cards; accent-bar → dot vocabulary re-map; CTA colour flips; **"Mark all seen" fake door REMOVED**; + inquiry age line; + date-status chip; + oldest-first order (§ 2.4) | Frame 7d's centrepiece; the extends are the frame's own captions |
| 7 | Info tile ("Answering couples is free…") | keep | Skin swap; gold info icon stays (accent) | The free-to-answer explainer, said once |
| 8 | `OngoingTasks` | restyle | Skin swap on panel + rows; due chip keeps gold tint (waiting-on-you semantics, § 2.1 dot vocabulary); "View all" link → `#3B4E67`; decorative checkbox square kept | — |
| 9 | `UpcomingSchedules` | restyle | Skin swap; date block obsidian+gold → ink block, day-numeral-first (§ 2.5); "Open calendar" link → `#3B4E67`, href unchanged | — |
| 10 | `SectionHeader` / `EmptyCard` shared bits | restyle | Eyebrow treatment per recipe; count chip → neutral ink-on-`rgba(30,26,18,.06)` mono (a count is information, not an action); gold spark diamond stays; dashed-border empty cards keep their written invitations verbatim | — |

### 1.2 My Shop — `/vendor-dashboard/shop` (render order of `VendorShopHub`)

| # | Block | Verdict | What changes exactly | Why |
|---|---|---|---|---|
| 1 | `HeroCard` (logo · name · verify pill · address · ring · CTA) | restyle | Ink-filled CTA → **mulberry fill, cream label** (both branches: "View as couple" and the Finish-profile/Get-verified/Manage 3-way); live-case label may adopt the frame's "See your page as couples see it"; orange address/copy links → `#3B4E67`; "Get verified · N of 2" pill → mulberry-tint chip (`#C24E25` on `rgba(194,78,37,.10)`) — it IS an action door; sage Verified chip stays | Terracotta-only-action lock. **Every gate stays:** verified/in-review/get-verified 3-way, `websiteLive` guard on the outbound link (a hidden shop's page 404s), the "address for good… once Setnayan approves" line — all owner-paid-for honesty |
| 2 | Logo avatar (`VendorAvatar`) | keep | Nothing | Logo is mandatory brand law; initials fallback ships |
| 3 | `CompletenessRing` | restyle | Conic fill → gold `#A9834B` on `rgba(30,26,18,.08)` track (data-vis, gold allowed); mono % numeral | Ring = information, not a button |
| 4 | Stat strip (6 `StatTile`s) | restyle + extend | Flat cards, Space-Mono numerals; **null-vs-0 honesty**: reads that failed render the hollow dash `—`, not `0` (§ 4-E5). Reviews/Recap already dash at zero-data — extend the same grammar to failed reads on all six | "Zero ≠ failed-to-load" — today `() => 0` catches make a dead RPC indistinguishable from an unloved shop |
| 5 | `ManageTiles` + panels (Profile checklist · Website editor · Team · Branch) | keep | Token pass only where classes resolve to glass; internals not fully read this pass — flagged § 5.6 | Deep owner-shipped machinery (venue-match writer, IG connect, radius rings) |
| 6 | `VerifySection` | keep | Token pass only | Owner-sequenced journey (teaser → docs → submit → Meet) |
| 7 | `ServicesDisclosure` + `VendorServicesManager` | keep | Nothing this unit | The service editor is deliverable 8's frame 8b — a different unit |
| 8 | `EarningsSurface` (always-on) + `FeatureAccordion` (5 sections) | restyle | Skin swap on accordion headers (card recipe, chevron kept); NOT converted to the frame's pill strip (§ 0 rejection); `?open=`/`?tab=` mechanics byte-identical | Owner-locked interaction |
| 9 | Packages doorway (flag-dark) · AutoReply card (flag-dark) | keep | Token pass; flags untouched | Flag-off = today's page exactly |

### 1.3 The calendar (My Customers pipeline + frame 7a)

| # | Block | Verdict | What changes exactly | Why |
|---|---|---|---|---|
| 1 | `CustomersFilterBar` (Type·Service·Agent + heat toggle) | restyle | Token pass; the Agent tier-gate + its disabled hint stay | Tier feature; hint is the no-fake-door pattern |
| 2 | Month nav header | restyle + extend | Mono month label stays; **+ a derived sub-line** `N booked · N held` counted from the visible `data.days` (booked+full days / locked days) — frame 7a's header line, honestly derivable (§ 2.7) | "Peak month" NOT derivable — dropped (§ 5.2) |
| 3 | Day grid | restyle + extend | Cell + chip recolours per § 2.7; **whitelist's violet chip → info-slate** (violet is retired app-wide — the customers `STATUS_PILL` already moved; the calendar `CHIP` at `customers-calendar.tsx:64–69` lagged); **+ Setnayan-vs-outside booked split** (gold vs ink) via one additive builder field (§ 2.7b). Blocked full-black cell, today ring, past dim, event labels + "+N more" all kept | The frame's legend split is real shipped data (pool bookings vs `external_client` blocks) collapsed too early |
| 4 | Legend | restyle | Six entries recoloured to match § 2.7; the booked entry splits into two swatches (Booked · Booked via Setnayan) when 2.7b lands | Legend must mirror cells 1:1 |
| 5 | Heat map + its two honesty lines | keep | Recolour the heat ramp to the gold family (§ 2.7); the "no booked dates to map yet" and narrowed-filter context lines stay verbatim | Paid-for honesty |
| 6 | Summary cards · QR section · Customers list · Bookings/Payday/accordion | keep | Token pass only (orange links → `#3B4E67`; sage/gold tints per recipe). Not drawn by any 7-frame; the Customers list ≈ 7a's agenda already | Do not reach beyond the drawn surface |

### 1.4 Shell chrome (layout)

| # | Block | Verdict | Why |
|---|---|---|---|
| `SidebarShell` · `DoorwaySidebarHeader` · `SwitcherPlaqueTrigger` · `SidebarItem` internals | keep — **out of scope** | Shared three-doorway chrome; frames 1a–1d (the shell unit) own its skin. This unit must not fork it |
| `VendorSidebar` five items + `VendorBottomNav` five tabs + `VendorNavFab` | keep — zero changes | Already the locked 5-page IA, name-for-name; bottom-bar grammar is lint-guarded. "On the Day (BEO)" vs the frame's "On the day": relabelable at runtime via the nav registry (`vendor.sidebar.on-the-day` / `vendor.bottom-nav.onday`) — an owner/admin toggle, not a code change |
| `VendorSidebarFooter` (Plan chip) | keep | Gold tier chip = a label inside a link row, not a button fill; its on-dark contrast fix is recent and deliberate |
| Badges (`vendorCustomersBadge`) | keep | One shared helper, both devices — the 2026-08-06 parity fix. No Overview badge (§ 0) |
| `PromoFreeWindowBannerVendor` · `PushNotificationRegistrar` | keep | Self-gating |

---

## § 2 — Per-widget visual specification

### 2.1 Shared recipe + dot vocabulary — imported, not restated

Use the sibling spec's § 2.1 table verbatim (surfaces, borders, radii, shadows,
eyebrows, type scale, mono rules, primary/secondary action pattern, focus ring,
motion retirements) and its three-dot vocabulary:

| Dot | Hex | Meaning |
|---|---|---|
| ● mulberry | `#C24E25` | money due / urgent — act now |
| ● gold | `#A9834B` | waiting on people |
| ● slate-blue | `#3B4E67` | informational |

Vendor-specific ruling: **semantic status fills survive as chips, never as the only
signal**, and the two shipped semantic *buttons* flip to the house action grammar —
primary = mulberry fill + cream label, secondary = mulberry outline (§ 2.4).

### 2.2 `VendorTodayFocal` — obsidian → ink

| Part | Was | Becomes |
|---|---|---|
| Surface | `.sn-tile-dark` glass + `sn-veil`/`sn-capiz` + `sn-bloom` | Solid ink `#2C2A29`, radius 14, shadow `0 8px 28px rgba(30,26,18,.10)`, no blur, no ornaments |
| Eyebrow "Today at {shop}" | `.sn-eye` gold | Space Mono 11px 700 uppercase ls .14em, `#CBA766` (on-dark gold), Store icon kept |
| Headline (3 branches) | 22px 800 `#F3ECDF` | Keep size/weight; colour `#FDFBF7` (cream, never pure white) |
| Big numeral + "leads waiting" | 46px mono | Keep, `#FDFBF7`; `CountUp` delay kept; the literal `'0'` when no leads stays (an honest zero from a loaded feed — this is a real count, not an unmeasured one) |
| Fact chips (Next · date / ₱ this year) | white-alpha chips, gold text | Border `rgba(253,251,247,.25)`, fill `rgba(253,251,247,.08)`, text `#F3ECDF`, mono; date → "12 Dec" (§ 2.8); hidden-when-absent logic untouched |
| **CTA, leads > 0** | **gold-500 fill** "Answer them" | **`#C24E25` fill · `#FDFBF7` label** · hover `#B04722` · radius 999 · ≥44px hit target. Same href `#whats-new`, same Zap icon |
| CTA, zero leads | white-alpha outline "View your customers" | Keep shape; border `rgba(253,251,247,.25)`, text `rgba(253,251,247,.9)` — a quiet secondary on ink, correctly not mulberry (nothing is urgent) |
| Honesty line (0% commission) | gold mono bold | Keep verbatim incl. the gold `0%` (accent numeral, not a button); divider `rgba(253,251,247,.12)`; live-dot `#CBA766` |

### 2.3 `VendorEnergyStats` — the bento, flattened

All tiles: § 2.1 card, padding 14–16px, eyebrow per recipe, numerals Space Mono.

- **Next shoot:** drop the `ProgressRing`. New grammar: day-numeral block —
  `12` Space Mono 22px 700 ink + `Dec` mono 11px `#8A6B39` beneath — beside the
  event name (14px 600, truncate) and the sub-line `in 126 days · Alta Veranda`
  (12px `#6E6A62`, `inDaysShort` kept). Empty state "No booked events yet." kept.
  *(The 90-day countdown ratio dies with the ring — it was ring fuel, not a fact
  anyone read. The days-out number survives in words.)*
- **Confirmed cash-flow:** ring → **thin bar** (the sibling § 2.3 budget grammar):
  numeral line `₱48,000` mono 20px 700 + `/ ₱120,000 booked` mono 13px `#8A857B`;
  bar 6px, track `rgba(30,26,18,.08)`, fill `#A9834B`, width `min(100, pct)%`;
  when `confirmedPhp > expectedPhp` (data oddity) the leading numeral renders
  `#C24E25`. Empty state "No booked installments yet." kept. `expectedPhp === 0`
  guard kept.
- **Earned · this year:** keep link-card behaviour (`sn-press` lift → recipe lift);
  numeral mono; hover arrow → `#3B4E67`. `₱0 + bookingCount 0` invitation copy kept.
- **KPI row (New inquiries · Open tasks · Upcoming):** flat cards, icon coin
  `rgba(169,131,75,.12)` / `#8A6B39`, numeral mono 28px, `CountUp` kept.

### 2.4 `WhatsNewFeed` → "Needs you today"

**Header:** section title becomes the eyebrow `NEEDS YOU TODAY` + kept count chip
(neutral, § 1.1 row 10). **The "Mark all seen" `<span>` is deleted** — it has no
handler, no action, no mechanism anywhere (`overview-sections.tsx:489`); a control
that cannot do anything is not rendered (no-fake-doors). This is the one sanctioned
element REMOVAL in this spec — cite this line in the PR.

**Card recipe (all four kinds):** § 2.1 card; the 4px left accent bar is replaced by
an **8px dot** before the eyebrow, per the vocabulary — one palette entry per kind
preserved (the shipped `CARD_KIND` single-source rule):

| Kind | Was (accent/eyebrow) | Dot + eyebrow tint | Why |
|---|---|---|---|
| `inquiry` | gold / gold-700 | ● `#C24E25` / eyebrow `#C24E25` | A warm lead is income on a clock — the vocabulary's "act now" |
| `lock` | success / success | ● sage `#7A8B6F` / eyebrow `#5E7C52` | A positive commit to confirm — genuine status, stays semantic |
| `review` | gold / gold-700 | ● gold `#A9834B` / eyebrow `#8A6B39` | A person waits on your reply |
| `dispute` | danger / danger | ● keep `--sn-danger` family | Genuine alarm; do not soften |

**Buttons (style-only flips, forms untouched):**

- `Accept` (ink fill) → **mulberry fill, cream label**. `Decline` → mulberry-outline
  secondary (border `rgba(194,78,37,.30)`, text `#C24E25`).
- `Confirm lock` (success fill) → **mulberry fill** (it is THE action; the sage dot
  already says "positive"). `View` → neutral outline kept (`#E1DCD1` border, ink).
- `Reply` (ink fill) → mulberry fill. Dispute `Open` keeps its danger fill —
  the one button where the semantic IS the message.
- All: radius 999, h-9 visual + extended hit area to 44px.

**EXTEND 1 — the waiting-age line (frame 7d: "Waiting 2 hours").** On `inquiry`
cards append to the mono meta line: `· waiting 2 h` (hours < 48, else `· waiting
3 days`), derived from `card.createdAt` — presentation-only, no new data. Tint the
fragment `#C24E25` once waiting ≥ 24 h. Never shown on other kinds (their
timestamps are not SLAs).

**EXTEND 2 — the date-status chip (frame 7d: "your date is open").** One chip on
`inquiry` cards answering the vendor's first question — *am I free that day?*

- Data: `fetchVendorOverviewData` already loads `poolBookings`; add
  `fetchVendorBlocks` (same lib, same fail-soft `.catch(() => [])`) to its existing
  `Promise.all`. No new stores — rule 4 compliant.
- Derivation per card, only when `card.eventDate` is non-null:
  `booked` = any pool booking on that date · `blocked` = any non-`external_client`
  block covering it, or any `external_client` block on it · else `open`.
- Render: `open` → chip `Your date is open` (sage text `#5E7C52` on `#E9EEE3`) ·
  `booked` → `You have a booking that day` (gold `#8A6B39` on `rgba(169,131,75,.12)`) ·
  `blocked` → `You blocked this date` (neutral ink/60 on `rgba(30,26,18,.06)`).
- **Honesty gates:** no date → no chip (never "date TBD"). Blocks read failed
  (`[]` from catch is indistinguishable — accepted): the chip **downgrades to
  absent unless `booked`**, i.e. "open" is only claimed when both reads returned
  rows-or-genuinely-empty; implement by threading a `blocksLoaded` boolean from the
  fetch (`.then(ok).catch(() => null)` → null = not measured → suppress `open`,
  keep `booked`). A false "your date is open" invites a double-booking — fail
  toward silence. No capacity/pool arithmetic — day-level presence only.

**EXTEND 3 — oldest-waiting first.** Flip the feed sort ascending
(`cardTimestamp(a) - cardTimestamp(b)`). Frame 7d's caption is the authority:
*"oldest-waiting first, because a missed inquiry is lost income."* The shipped
newest-first (`vendor-overview.ts:257`) carries no recorded rationale. One-line,
declared behaviour delta — flag it in the PR body; trivially revertible.

**Empty state:** kept verbatim ("You're all caught up. New inquiries, lock requests,
reviews, and any flagged delays will land here.").

### 2.5 `OngoingTasks` + `UpcomingSchedules`

- Panels: § 2.1 card wrapping flat rows; row separators `#EDE8DE`; hover
  `translate-x-0.5` kept.
- Ongoing due chip: mono 11px, gold family kept (`#8A6B39` on `rgba(169,131,75,.12)`)
  — "Awaiting you N days" is waiting-on-you by definition.
- Upcoming date block: obsidian/gold → **ink `#2C2A29`** square, 56px, radius 12;
  day `05` mono 18px 700 `#FDFBF7` on top, month `DEC` mono 9.5px `#CBA766` under,
  weekday mono 9px `rgba(253,251,247,.5)` — day-first grammar (§ 2.8).
- Right-aligned `in N days` mono kept. Both empty states kept verbatim.

### 2.6 My Shop applications

- Stat strip tiles: § 2.1 card; icon coin gold-tint; value mono 20px 700; label
  12.5px 600 ink; sub 11px `#8A857B`. Dash rule → § 4-E5.
- `FeatureAccordion` headers: card recipe (border `#E1DCD1`, radius 14); icon coin
  `rgba(169,131,75,.12)`/`#8A6B39`; label 14px 700 ink; sub 12.5px `#6E6A62`;
  chevron `#8A857B` rotating as shipped; open body inset with `#EDE8DE` top rule.
  The `AccordionSkeleton` keeps streaming on expand.
- `ShopTools` grid rows: recipe cards, no blur (the shipped >10-item blur ban
  becomes moot on a flat kit but the flat treatment stays).
- Hero CTA + pills: § 1.2 row 1. Address line mono 12px `#3B4E67` with Globe icon.

### 2.7 The calendar — recolour + two extends

**Chip map (`CHIP` in `customers-calendar.tsx`), keys and precedence untouched:**

| State | Was | Becomes |
|---|---|---|
| `full` | ink bg / white | Keep ink `#2C2A29` bg, `#FDFBF7` label (cream, not #fff) |
| `booked` | sage tint | Split by § 2.7b: Setnayan-day → gold `#8A6B39` on `rgba(169,131,75,.12)`, border `rgba(169,131,75,.3)`; outside-only day → ink/70 on `rgba(30,26,18,.06)`, border `rgba(30,26,18,.14)` |
| `locked` | orange family | `#C24E25` on `rgba(194,78,37,.10)`, border `rgba(194,78,37,.28)` — a hard hold is the vendor's own strong mark |
| `whitelist` | **violet `rgba(139,123,184,…)` — retired palette, still live here** | info-slate `#3B4E67` on `rgba(59,78,103,.10)`, border `rgba(59,78,103,.30)` |
| `blocked` | ink cell takeover | Keep the full-black cell + white "BLOCKED" stamp exactly (label `#FDFBF7`) — unmistakable is the point |
| `waitlist` | amber | `#8A6B39` on `rgba(169,131,75,.14)` (waiting-on-people gold), count kept ("Waitlist 2") |

Today ring → `#C24E25` border + `rgba(194,78,37,.08)` fill; past-day opacity .45
kept; heat ramp `rgba(184,134,47,…)` → the same alpha curve on `169,131,75`
(gold family); `n/cap` mono labels kept; every `title` tooltip kept.

**2.7a EXTEND — month header sub-line.** Under the month label:
`6 booked · 2 held` — booked = count of days with state `booked`/`full`, held =
days with state `locked`, both from the already-derived `data.days` (pure,
client-side, filter-aware — a narrowed filter narrows the counts, which is
correct). Space Mono numerals, 12px `#6E6A62`. Zero-both → line omitted (not
"0 booked"). "Peak month" is NOT built (§ 5.2).

**2.7b EXTEND — Setnayan-vs-outside split.** Add one additive field to the builder:
in `buildCustomerCalendarMonth`'s accumulator, count pool-booking consumption
separately (`setnayanConsumed`) from `external_client` block consumption; expose
`setnayanConsumed` on `CustomerCalendarDay`. No existing field changes meaning;
precedence untouched. The cell chip + legend then distinguish
`day.setnayanConsumed > 0` (gold) from outside-only (ink-tint) per the table above.
The pure function gains a test asserting: a day with only an `external_client`
block reports `setnayanConsumed = 0` and still `consumed = 1` (new test file —
existing tests untouched, rule 5).

### 2.8 Dates — surface-wide

Day-first everywhere data-bearing: `shortDate` in `overview-sections.tsx`
("Jul 5" → "5 Jul"), `fmtDate` in `customers/page.tsx` ("Jul 5, 2026" →
"5 Jul 2026"), the hero `todayLabel` → "Sat, 8 Aug" (frame 7d's register),
`dateBlock` reordered day-over-month (§ 2.5). ₱ always Space Mono, full figures
(no compact-k anywhere on this surface — vendor money is settlement money).

---

## § 3 — Every state each touched widget must still render

Derived from the shipped components. The restyle is DONE only when each renders
correctly under the new skin.

### 3.1 Overview page-level
1. Agent/viewer role → `AgentHome` (no feed, no queries).
2. No vendor profile (team member, no owned shop) → the create-your-own landing.
3. Loader threw → "Overview is temporarily unavailable." page (awards + earnings
   fail SOFT before this — only the core feed read can trip it).
4. Milestone: none · monthsary (first year) · anniversary; countdown suffix only
   when ≤ 92 days (today/tomorrow/in-N variants); **no celebration CTA ever**.
5. Hero subline: leads > 0 vs all-caught-up branch.

### 3.2 Focal
1. Leads 1 (singular headline) · leads N · zero-leads-with-booking ("next shoot is
   on the books") · zero-leads-no-booking ("all set for now").
2. Fact chips: both · either · neither (row absent, not empty).
3. `earnedThisYearPhp` null (failed read) ≠ 0 (real) — chip requires `!== null && > 0`.
4. CTA branch flips with leads > 0.

### 3.3 Energy stats
1. `nearest` null → empty next-shoot card. 2. `earnings` null → BOTH money tiles
absent (never ₱0-faked). 3. `expectedPhp === 0` → cash-flow empty state, no bar,
no divide-by-zero. 4. `bookingCount === 0` → "Paid bookings roll up here."
5. KPI zeros are honest zeros from loaded arrays — render `0`, not a dash.

### 3.4 Decision feed
1. Empty → invitation card (verbatim). 2. Each kind's body renders under the new
skin: inquiry (masked `descriptor` meta — trap 5 — Accept/Decline forms, hidden
`return_to`), lock (couple name from event meta fallback "A couple", Confirm +
View), review (quote vs "Left you a 5-star rating." branch, Reply →
`#reply_{id}` anchor), dispute (event name fallback "A booked event", Open).
3. Review cards appear ONLY for `rating_overall === 5 && !vendor_reply` — untouched.
4. Lock rows exclude `package_role='covered'` cascade lines + archived rows (the
money-integrity filter in `fetchLockRequests`) — untouched.
5. NEW date-status chip: open / booked / blocked / no-date-absent /
blocks-unmeasured-suppresses-open (§ 2.4 E2 gates — each is a state to verify).
6. NEW age line: < 24 h neutral · ≥ 24 h mulberry · hours vs days wording.
7. Order: oldest-first across kinds (E3) — verify the empty + single-card cases
   trivially hold.
8. Every sub-fetch fail-softs to `[]` — a dead stream hides its cards only, never
   the page.

### 3.5 Ongoing + Upcoming
1. Empty states (verbatim invitations). 2. Ongoing sources: pending inquiries +
unconfirmed deposits + draft contracts — each row kind styled. 3. `awaitingChip`
today/1-day/N-days. 4. Upcoming: ≤ 5 rows, future-only filter, undated excluded
by source; `href` thread vs clients fallback branch; place/category `metaLine`
fallback "Booked event"; `inDaysLabel` today/1/N.

### 3.6 My Shop
1. `'no-vendor'` → redirect `/open-shop` (control-flow rethrow guard stays).
2. Loader failed → degraded header + "Set up my shop" fallback.
3. Hero pill 3-way: Verified (sage) · in-review (neutral) · Get-verified goal pill
   with live `N of 2` count.
4. Address: publicPath+live (link enabled) · publicPath+hidden (address shown +
   "goes live once Setnayan approves" line, NO outbound link) · no slug ("Add your
   shop name…").
5. Hero CTA 3-way when not live: Finish profile (<100%) · Get verified (100%,
   unverified) · Manage shop (verified).
6. Stat strip: real zero vs dash (E5) per tile; Reviews `—` when count 0; Recap
   `—` when 0.
7. Soft-probe degradations: tier null · radius rings null ("not declared yet") ·
   registration-number pre-migration → gate asks · validate email default.
8. Accordion: closed-all (children null, zero queries) · one-open with skeleton
   stream · invalid `?open=` ignored · legacy `?tab=` alias honoured.
9. Flag-dark: packages + auto-reply render NOTHING flag-off.
10. IG flash: connected · error (mapped copy) · absent.

### 3.7 Calendar
1. All six chip states + precedence (blocked > locked > whitelist > full > booked >
   waitlist), incl. partial-block fallback (`state===null && anyClosed → blocked`).
2. Open day: no chip at all.
3. `full` with capacity label `Full 2/2` · `booked` `1/2` · waitlist count · plain
   labels for locked/whitelist/blocked.
4. NEW split (2.7b): Setnayan-day gold · outside-only ink · mixed day = gold
   (Setnayan presence wins — it carries the event label anyway).
5. Heat map on + no bookings → honesty line; heat never tints a blocked cell.
6. Filters: each narrows correctly; narrowed-empty context line; agent filter
   disabled below Pro with hint.
7. Month nav: cached-instant · fetch-pending (dim + spinner + aria-busy) ·
   session-gone fallback full navigation.
8. Header sub-line (2.7a): both counts · one · neither (omitted).
9. Past dim · today emphasis · event labels max 2 + "+N more".

### 3.8 Shell (unchanged, but verify after the token pass)
Role-scoped nav (agent/viewer flat subset) · repertoire music-gate ·
registry label/icon overrides + hidden-slot drops · customers badge present/absent ·
plaque Verified/Unverified metaLine · promo banner self-gate · FAB hides under
docked SubNav.

---

## § 4 — Fable's enhancements (beyond the handoff, each justified)

- **E1 · Date-status chip on inquiry cards** (§ 2.4 E2). The frame wrote "your date
  is open" as static sample text; I specified the real derivation, its three states,
  and the fail-toward-silence gate. This is the highest-value ten lines on the
  surface: it answers the vendor's first question before they open the calendar.
- **E2 · Waiting-age + oldest-first** (§ 2.4 E1/E3). The frame's caption states the
  queue discipline; the shipped sort contradicts it with no recorded reason.
  Declared behaviour delta, one line, PR-flagged.
- **E3 · The fake-door removal** ("Mark all seen") — an inert span styled as an
  action since the 2026-07-01 rebuild. Removal is the honest fix; wiring it would
  need a seen-state store that does not ship (rule 4).
- **E4 · The violet whitelist chip retirement** (§ 2.7). The customers list already
  moved off violet ("retired app-wide, contract § 7" — its own comment); the
  calendar chip two components away did not. Consistency debt paid while the file
  is open.
- **E5 · null-vs-0 on the shop stat strip** (§ 1.2 row 4). Change the six fail-soft
  collapses (`() => 0`) to `() => null` and render the hollow dash for null — the
  house `count === null ≠ 0` lesson applied at design time. Additive type change
  (`number | null`), display-only consumers.
- **E6 · Setnayan-vs-outside calendar split** (§ 2.7b). The frame drew the legend;
  the data exists but is collapsed inside the builder. One additive field makes the
  platform's own contribution visible on the vendor's most-glanced surface — the
  quiet booking-fee-is-worth-it argument, made with data, not copy.
- **E7 · The month-header counts** (§ 2.7a). Derived, filter-aware, omitted at zero.
- **E8 · Fail-direction notes written into the spec** (§ 2.4 E2 gates, § 3.4.8,
  § 3.6.6) — every new read states which way it fails and why that is safe.

**Deliberately NOT enhanced:** the five-page nav (owner lock, both devices) ·
the accordion interaction (owner lock) · the sidebar/shell skin (frames 1a–1d's
unit) · the service editor (deliverable 8) · On the Day (not drawn) · Performance
(not drawn — token pass rides the shared kit only) · any expiring-hold mechanism
(§ 5.1 — needs schema + product decisions, not a restyle).

---

## § 5 — Could not verify / not stated (do not invent during build)

1. **"Held — expires in 3 days · nudge sent"** (frames 7a/7c/7d): no shipped
   mechanism. `vendor_calendar_day_states.locked` has no expiry column read
   anywhere I searched (`vendor-schedule.ts`, bookings surface); no hold-nudge
   exists. If the owner wants expiring holds, that is schema + product work —
   a finding for him, not a legend entry to fake.
2. **"Peak month"** (7a header): needs cross-month comparison no surface loads.
   Dropped from 2.7a.
3. **Frame 7c's tab names** (Photos · Socials & address · Subscription ·
   Verification as My Shop tabs): the shipped equivalents live inside the
   WebsiteEditor (photos, IG/socials), the Branch panel (address/reach),
   the sidebar-footer Plan row + `/subscription`, and `VerifySection`. No
   standalone tabs exist and none are built — the accordion + tiles keep them.
4. **"2 jobs to shoot / ₱48k deposits confirmed this week"** (7d): week-scoped
   derivations that ship nowhere; the bento's real numbers (next-5 upcoming,
   confirmed-vs-expected all-time) keep their shipped meanings. Do not re-scope
   a shipped number to "this week" silently.
5. **`proofUrl` on lock cards** — carried by the type, rendered nowhere. Left
   as-is (surfacing a deposit-proof link is a product call, not a restyle).
6. **`ManageTiles` / `VerifySection` / `WebsiteEditor` / `BookingsSurface` /
   `PaydaySurface` internals** — not fully read this pass; flagged for a
   token-check-only sweep (same posture as the sibling's § 5.4).
7. **The layout's `vendor_wallets` read + earned-token expiry sweep** — still
   running on every vendor navigation for a currency retired 2026-08-07. Out of
   design scope; flagged separately as an engineering cleanup.
8. **`buildCustomerCalendarMonth` test coverage** — no existing test file found
   for `lib/vendor-customers.ts`; § 2.7b therefore ships WITH its new test rather
   than amending one.

---

## § 6 — Build order (restyles before extends; nothing is "new")

1. **Unit A (restyle · Overview):** § 2.2 focal ink swap + CTA flip · § 2.3 bento
   flat · § 2.4 card skin + button flips + fake-door removal (the one sanctioned
   deletion — justify against check 2 of INTEGRATION_RULES) · § 2.5 panels ·
   § 2.8 dates · § 1.1 link recolours. Expect ~flat net lines otherwise.
2. **Unit B (restyle · My Shop):** § 1.2 hero + stat strip + accordion skin +
   link recolours. Zero behaviour deltas.
3. **Unit C (restyle · Calendar):** § 2.7 chip/cell/legend/heat recolours incl.
   E4 violet retirement. Zero behaviour deltas.
4. **Unit D (extends):** E1 date-status chip (+ blocks read) · E2 age line +
   oldest-first (PR-flagged) · E5 stat-null honesty · E7 month counts ·
   E6 builder split + its new test. Each new branch appears in § 3's inventory.
5. **Parked:** anything touching `SidebarShell`/`SidebarItem` skins (shell unit) ·
   expiring holds (owner) · lock-card proof link (owner).

After every unit: the INTEGRATION_RULES mechanical check; existing tests green,
untouched (rule 5); `TZ=Asia/Manila` (and friends) suite before any PR; the
`apps/web/scripts/lint-*.mjs` family — the BottomNav template guard must pass
byte-identical since the bar is untouched.
