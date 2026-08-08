# FABLE build spec — Event Overview `/dashboard/[eventId]` · Warm Editorial Archive

> **Date:** 2026-08-08 · **Author:** Fable (design pass; Opus implements)
> **Binding rule (owner, verbatim):** *"do not just replace it. integrate it well."*
> **Sources read in full:** this bundle's `README.md`, `INTEGRATION_RULES.md`,
> `OPEN_QUESTIONS_ANSWERED_2026-08-08.md`, the deep-dive's unpacked content
> (6 widgets + annotations), and the SHIPPED code:
> `apps/web/app/dashboard/[eventId]/page.tsx` (539 lines),
> `_components/event-dashboard.tsx` (2,192 lines), `layout.tsx` (487 lines),
> plus `lib/guests.ts`, `lib/papic-home-tile.ts`, `lib/booking-handovers.server.ts`,
> `lib/checklist.ts`, `alaala/page.tsx`, the vendor workspace handover inbox,
> `globals.css` token blocks and `tailwind.config.ts`.
>
> **What this spec is:** a widget-by-widget DELTA — keep / restyle / extend / new —
> against the page that ships. A section that says "keep" is a verified finding,
> not an omission. Everything the design frame does not draw (loading, empty,
> error, denied, partial, phase variants) is inventoried in § 3 from the shipped
> component, and every one of those branches must survive the restyle
> (INTEGRATION_RULES rules 1–3).

---

## ⚠ The three traps the implementer must hold in mind throughout

1. **Token naming.** In `globals.css` / Tailwind, `terracotta` = **GOLD** (`--color-terracotta:
   169 131 75` → `#A9834B`) and `mulberry` = the **rust CTA** (`--color-mulberry: 194 78 37`
   → `#C24E25`). Every "action colour" in this spec means **`bg-mulberry` / `#C24E25`**.
   Never reach for `bg-terracotta` expecting a button.
2. **The current page's primary CTAs are GOLD-filled** (`--sn-gold-500` pills — digest row
   CTA, board row CTA, Today's-one-thing CTA, PRIORITY badge). The Warm Editorial lock —
   *gold is never a button* — makes flipping these to mulberry the single most visible
   change in this whole spec. It is a style-only flip: same elements, same handlers, same
   hrefs, new fill.
3. **The design frame shows one state of one composition.** It draws no Big-Day focal, no
   journey rail, no doorstep cards, no AI state, no day-of takeover, no cultural overlays.
   All of those ship, all of them stay. The frame's page order for the blocks it *does*
   draw happens to match the shipped mobile stacking almost exactly — which is why this
   integration is mostly restyle, two small extends, one new card, and two deferrals.

---

## § 0 — How the design's six widgets map onto what ships

| Design widget | Shipped equivalent | Verdict |
|---|---|---|
| ① Event header (← · name · "127 days · 12 Dec 2026 · Tagaytay") | Split across three shipped homes: sidebar plaque (`SwitcherPlaqueTrigger`, desktop), body hero greeting, Big-Day focal (countdown + date + venue) | **KEEP the shipped split · defer the header row to the shell unit** (frames 1a–1d are a separate deliverable). Building it here would put a second countdown on the page, violating the shipped "one home per number" rule (rollout § 3.1). Delta on this surface: data-date format only (§ 2.8). |
| ② "Needs you this week" decision rows | The decisions **digest** panel (top grid, right column) fed by `flatDecisions` — cockpit decisions + pending-payment orders | **RESTYLE** to the dot-row grammar + **EXTEND** with one new row kind (unanswered RSVPs) (§ 2.2) |
| ③ "Where you stand" four counters | The 2×2 live minis (`miniTiles`: Guests · Budget · Schedule · Papic · Messages, cap 4) | **RESTYLE** flat; candidate set and owner-locked ranking untouched. The frame's "vendors booked" and "checklist done" counters do NOT become minis — see § 2.3 for where each number already lives / newly lives. |
| ④ Add-ons rail | Nothing on the Overview (add-ons live behind Services → `/launch`, posters in `studio/`) | **DO NOT BUILD — blocked on owner Q2.** `OPEN_QUESTIONS_ANSWERED` recommends no rail; fallback designed and parked in § 2.6. |
| ⑤ "Meanwhile" memory arrival | Nothing (the design guessed `alaala/`, which is catalog-driven and has **no per-event data** — verified in `alaala/page.tsx`'s own docblock) | **NEW**, wired to the *verified* shipped source: `booking_handovers` (couple-RLS'd, ack = the shipped dismissal) (§ 2.5) |
| ⑥ Bottom nav (Event·Guests·➕·Budget·Find) | Owner-locked, phase-aware `CustomerBottomNav` + `CustomerNavFab` + `CustomerSectionSubnav` | **KEEP — zero changes.** Q1 is owner territory (`OPEN_QUESTIONS_ANSWERED` § Q1); the re-scope reverses a lock and deletes phase-awareness. Not designed away. The "Find" palette does not ship (Q3) and is NOT part of this surface's scope. |

---

## § 1 — The page, top to bottom

Order below = actual render order in `page.tsx` → `event-dashboard.tsx` (mobile stacking).
"Skin swap" = the § 2.1 recipe (Atelier-Glass → Warm Editorial flat).

| # | Block (shipped name) | Verdict | What changes exactly | Why |
|---|---|---|---|---|
| 0a | `EventDayPrepCta` (pre-day banner) | keep | Nothing structural; token pass only if it uses glass (out of my read — flag for implementer to check its classes) | Not drawn in the frame; behaviour is owner-shipped |
| 0b | `AccessRequestsDoorway` | keep | Nothing. Self-hiding (owner ruling 2026-07-27) | Renders only when a coordinator waits on an answer |
| 0c | `AutoPreloadOnEventDay` | keep | Nothing (renderless) | — |
| 0d | `DayOfModeGrid` (T-1h..T+8h takeover) | keep | Nothing this pass. Its own restyle is a separate unit (frames 2x day-of strip) | Day-of is its own surface; the Overview spec must not reach into it |
| 1 | Hero (`Kumusta…` greeting + sentence) | restyle | Type + colour tokens only (§ 2.7). Greeting, three-way sentence branch (day-0 / past / future) all stay | The frame has no hero, but deleting it would orphan the emotional pacing the council kept on 2026-07-12 |
| 2 | Big-Day focal (`sn-tile-dark` / `sn-tile`) | restyle | Obsidian-glass → solid **ink** card `#2C2A29`; glass veil/capiz ornaments dropped; all content + every conditional kept (§ 2.4) | The countdown's ONE home; the AI briefing + Watch live inside it; day-of step-down must survive |
| 3 | Decisions digest panel ("Decisions · waiting on you") | restyle + extend | Becomes **"Needs you this week"**; rows adopt dot-grammar; +1 new row kind (RSVP pending); CTA colour flip (§ 2.2) | Design widget ②; the digest is exactly this panel |
| 4 | 2×2 live minis (Guests · Budget · Schedule · Papic · Messages) | restyle | Flat cards, mono numerals `86/141` grammar, ring dropped on Guests, budget bar kept; ranking/cap byte-identical (§ 2.3) | Design widget ③; Papic slot is owner-locked ("foundation of the app") |
| 5 | Today's one thing (AI) | restyle | Gold-filled CTA → mulberry; gold hairline + numbered coin stay gold (accent, not action) | Gold-is-never-a-button lock |
| 6 | `slotAfterBento` overlays: NikahEssentialsCard · SetDateNudge · PapicReadyNudge · tea-ceremony tile · Plan-next-year | keep | Token pass only where a class resolves to glass; the tea tile + plan-next-year already use the flat bordered grammar and mulberry-outline secondary buttons — they are the house pattern this whole restyle converges on | Every overlay is conditional + owner-locked (Papic nudge order behind SetDate is an owner default) |
| 7 | Decisions board (`#decisions`, grouped) | restyle | Skin swap on group cards + rows; CTA colour flip; PRIORITY badge recolour; inspector triggers untouched (§ 2.2b) | — |
| 8 | Checklist doorway line ("View your full checklist →") | extend | Append a Space-Mono **"N % done"** chip when checklist rows exist (§ 2.3b) | Design widget ③'s fourth counter, given a home that doesn't fight the minis cap or the focal's "% planned" |
| 9 | What's-next rail (AI) | restyle | Dot colours re-map to the 3-dot vocabulary; dates → "12 Dec"; type tokens | — |
| 10 | **"Meanwhile" card — NEW** | new | One conditional card between the What's-next rail and Around-your-event (free state: between board and Around-your-event), fed by unacknowledged `booking_handovers` (§ 2.5) | Design widget ⑤, re-wired to the real source |
| 11 | Around your event (Hosts · Your team · Conversations · Your services · Schedule ExpandCards) | restyle | Skin swap; chip tones re-mapped; ExpandCard behaviour, admin-read hosts feed, marketplaceEnabled gate on Your team, urgent-float in services — all untouched | Every card carries paid-for edge cases (event-scoped unread honesty, vendor-free gate) |
| 12 | Band footer (identity-masking note + activity link) | keep | Colour token only on the link | — |
| 13 | Journey rail ("Read your progress") | keep | No visual spec from this handoff (the deep dive does not draw it) — token-level alignment only via whatever the shared kit does to `JourneyRail`'s internals; NOT this unit's scope | Shared component; restyling it here would fork it |
| 14 | Inspector column (desktop ≥ xl, `?inspect=`) | keep | Body cards inherit the skin swap via shared classes; selection resolution untouched | #3265 behaviour |
| 15 | `CustomerBottomNav` + `CustomerNavFab` + `CustomerSectionSubnav` + sidebar/topBar chrome | keep | **Zero changes** (design widget ⑥ verdict, § 0) | Owner-locked, lint-guarded |
| 16 | `PromoFreeWindowBanner` (layout) | keep | Nothing | Self-gating |

**Net shape check** (INTEGRATION_RULES § mechanical): after every unit here, `git diff` should
show roughly flat net lines, zero removed exports, zero removed conditionals except where § 2
explicitly adds one (the extends add branches, never remove).

---

## § 2 — Per-widget visual specification

### 2.1 The shared card recipe (the skin swap)

Applies to every block marked *restyle*. This page currently wears the Atelier-Glass kit
(`.sn-tile` glass + blur, `.sn-tile-dark` obsidian, gold CTA pills). Warm Editorial replaces
the *surface treatment*, not the layout.

**Scope guard:** do NOT restyle the `.sn-*` classes globally — they have consumers across
the app. Swap classes **in this page's markup only** (this is a styling-only, in-place edit;
rule 2 compliant). Where a recipe below matches the shipped `.m-card` family, prefer the
existing class over new CSS.

| Element | Spec |
|---|---|
| Card surface | `#FDFBF7` (`--m-paper` / `bg-cream`) — same as the page. Separation comes from the border + shadow, **never a second surface tint** |
| Card border | 1px `#E1DCD1` (`--m-line`) |
| Card radius | **14px** (`--m-r-md`) for content cards; 22px (`--m-r-lg`) only for the page-level framing if any; pills `--m-r-full` |
| Card shadow | `0 1px 3px rgba(30,26,18,0.06)` resting. Hover on link-cards: keep the shipped `translateY(-3px)` lift, shadow may deepen to the `.m-card-lift` value |
| Inner row separators | 1px `#EDE8DE` (`--m-line-soft`) |
| Section eyebrow | Space Mono · 11px · 700 · uppercase · letter-spacing 0.14em · `#8A6B39` (readable-text gold). On the ink focal: `#CBA766` (`--sn-gold-300`, the shipped on-dark gold). *(The frame's eyebrows inherit Hanken — a prototype artifact; the README's rule "Space Mono for eyebrows" wins.)* |
| Section title (`sn-sec` sites) | Hanken Grotesk · 16–18px · 800 · tracking −0.015em · ink `#2C2A29` |
| Body text | Hanken Grotesk · 13–14px · ink; muted `#6E6A62` (`--m-slate-2`); faint `#8A857B` |
| Numerals & money | **Space Mono, always** — including inside chips (the shipped `₱45,000 pending` chip currently inherits Hanken: fix). Money never abbreviated except the Budget mini (§ 2.3) |
| Data dates | "12 Dec 2026" (day-first, 3-letter month); short form "12 Dec" in chips/rails (§ 2.8) |
| Primary action (filled) | `bg-mulberry` `#C24E25` · label `text-cream` `#FDFBF7` (4.61:1 AA ✓) · hover `#B04722` · radius 999 · min 44×44 target (pad text pills to ≥ 32px visual height + extended hit area) |
| Secondary action (outlined) | border `rgba(194,78,37,.30)` · text `#C24E25` · hover `bg-mulberry/10` — the exact pattern the shipped Plan-next-year `SubmitButton` already uses |
| Text links in cards | `#3B4E67` (`--color-link`) · hover `#304055` · weight 600. (Replaces the gold-700 text links on mini-tile feet, checklist doorway, activity link) |
| Gold `#A9834B` | Eyebrows (as `#8A6B39`), the focal's planned-bar fill, the Today's-one-thing hairline + numbered coin, the AI ✦ spark, "waiting" chip tint. **Never a fill behind a label that performs an action** |
| Focus ring | Keep the shipped `focus-visible:ring-2 ring-terracotta` (= gold ring) on inspector triggers — visible on cream, not an action colour. Do not change |
| Motion | Keep `sn-press`/lift transforms and `CountUp`/`ProgressRing` reveal delays where retained; drop `sn-bloom`, `sn-veil`, `sn-capiz` (glass-era ornaments) on this page |

**The three-dot status vocabulary** (used by § 2.2 rows and § 2.9 chip re-map):

| Dot | Hex | Meaning |
|---|---|---|
| ● mulberry | `#C24E25` | money due / urgent |
| ● gold | `#A9834B` | waiting on people |
| ● slate-blue | `#3B4E67` | informational |

Dots are 8px, `border-radius:50%`, vertically centered on the first text line.

### 2.2 Widget ② — "Needs you this week" (the digest panel, restyled + extended)

**Where:** the existing digest `sn-tile` in the top grid's right column. Same position, same
data plumbing (`flatDecisions` = grouped cockpit decisions + `payItems`), same `#decisions`
anchor link.

**Header:**
- Eyebrow (replaces "Decisions · waiting on you"): `NEEDS YOU THIS WEEK` — per § 2.1 eyebrow
  spec. Keep the `ListChecks` icon at 14px.
- The big count + "open decisions · ranked" line: **keep exactly** (Space Mono 30px count,
  `CountUp` delay 300ms). The AI "· ranked" suffix stays.

**Rows (top 3, unchanged slice):** replace the label/sub/CTA-pill stack with the frame's
row contract — *one line, one number, one destination*:

```
[● dot 8px]  [label, 14px Hanken, ink, truncate]        [right slot]
```

- Row is the whole link (navigates to `item.href`); min-height 44px; padding 13px 16px;
  separator `#EDE8DE` between rows; no outer border (rows sit inside the panel card).
- **Right slot:** when the item carries an amount (`payItems` — parse from the existing
  chip data, don't re-derive): the peso figure, Space Mono 13.5px 700 ink, full amount
  (`₱45,000`). Otherwise: a `→` chevron in `#8A857B`.
- **Dot mapping from the existing `chipTone`:** `hot` → mulberry ● (payments) · `warm` →
  gold ● (waiting/urgent booking) · `calm` → slate-blue ● (pick/role/informational).
- The old per-row CTA pill in the digest is **dropped** (the row itself is the door — this
  is presentation; the href is identical). The board below keeps its CTA pills (§ 2.2b),
  so no action loses a labelled button.
- `sub` line: keep as a second 11.5px `#8A857B` line **only when it carries a date or a
  reference** (e.g. "Order placed · ref ABC123"); otherwise omit on the digest (full detail
  remains on the board). Keeping the sub conditional is presentation-only.
- Footer link "All N decisions ↗" → recolour `#3B4E67`, keep behaviour.
- Empty state: keep the shipped sentence verbatim ("Nothing needs a decision right now —
  your plan keeps moving on its own.") — it already obeys "every empty state is a written
  invitation".

**EXTEND — one new row kind: unanswered RSVPs.**
- Source: `stats.pending` from `computeGuestStats(guests)` — **already loaded** by this
  surface; zero new queries.
- Render condition (honesty gate): `stats.pending > 0 AND (stats.attending +
  stats.declined + stats.maybe) > 0` — i.e. replies have started arriving. A roster nobody
  has invited yet must NOT nag "141 haven't replied". *(An "invitations sent" signal would
  be the better gate; not found in `computeGuestStats` — not stated. The replies-started
  proxy is the conservative substitute.)*
- Copy: `38 guests haven't replied yet` (count in Space Mono 700). Dot: gold ● (waiting on
  people). Destination: `${base}/guests` (a pre-filtered pending view is **not stated** —
  link the roster plainly; do NOT invent a `?filter=` param). **No "nudge them?" copy** —
  no verified nudge mechanism ships, and a question implying one is a fake door.
- Placement: it is not a cockpit decision, so it does NOT enter `decisionGroups` or the
  count (the "N open decisions" number keeps meaning cockpit decisions + payments —
  don't corrupt a shipped number's definition). It renders as an appended row *below* the
  top-3 slice, above the "All N" link. It also does NOT appear on the decisions board.

### 2.2b The decisions board (`#decisions`) — restyle only

- Group cards: § 2.1 card recipe. Group icon coin: keep, background `rgba(169,131,75,.12)`,
  icon `#8A6B39`.
- `PRIORITY {n}` badge (AI): gold fill → **mulberry fill, cream label** (it ranks action).
  Free-state count badge: keep neutral outline.
- Row CTA pills: first-item filled → `bg-mulberry text-cream`; subsequent outlined →
  mulberry-outline secondary (§ 2.1). The pill stays a styled `<span>` inside the
  `InspectorTrigger` anchor (no nested link) exactly as shipped.
- Chips on rows: § 2.9 re-map. Amount chips get Space Mono.
- `FreeVenueShortlistOffer` (inline + card variants): keep both mount points and the
  `marketplaceEnabled`-first gate byte-identical; its own internals restyle with the kit.
- Empty state + "View your full checklist →" line: keep; link recolours `#3B4E67`; the
  checklist chip lands here (§ 2.3b).

### 2.3 Widget ③ — the live minis ("Where you stand")

**Untouchable behaviour (verified in code, owner-locked):** candidate build order
Guests → Budget → Schedule → **Papic** → Messages; Papic always holds a slot when
`resolvePapicHomeTile` returns non-null; `MAX_MINIS = 4`; Messages yields first;
real-data-or-nothing (a tile with no data does not render — a fabricated sample never
appears). The blur-budget *rationale* for the cap dissolves with the glass, but the cap
stays — four tiles is also the right visual density on cream, and the ranking lock is
about priority, not blur.

**Restyle per tile (all: § 2.1 card, 14px radius, padding 14px 16px, `sn-press` lift kept):**

- **Eyebrow row:** icon 14px + label — § 2.1 eyebrow spec (mono, `#8A6B39`).
- **Guests:** drop the `ProgressRing`. Numeral line: `86` Space Mono 20px 700 ink,
  followed by `/141` Space Mono 13px `#8A857B` (attending / total). Sub-line
  "guests confirmed" 12.5px `#6E6A62`. Keep `CountUp` on the leading numeral.
  *(Ring removal is presentation; the render condition `stats.total > 0` is untouched.)*
- **Budget:** numeral `₱312k` Space Mono 20px 700 + `/480k` muted 13px. Compact-k display
  **in this tile only** (≥ ₱100,000 → nearest k, e.g. `₱312k`); the full figures go in the
  tile's `aria-label` ("₱312,450 committed of ₱480,000") and everywhere else on the page
  money stays exact. **Keep the thin progress bar** (Fable call, § 4-E3): 1.5px→6px track
  `rgba(30,26,18,.08)`, fill `#A9834B`, width `min(100, budgetPct)%` — over-commitment
  legibility is worth the deviation from the frame. Render condition unchanged
  (`committed > 0 || target > 0`); "committed so far" fallback when no target.
- **Schedule · next:** keep two-block preview; date chips → Space Mono 9.5px 700 on
  `rgba(169,131,75,.12)` / `#8A6B39`, date text "12 Dec" (§ 2.8).
- **Papic:** keep both figure modes verbatim (`preCapture` → shots-ready + cameras-out;
  post-first-photo → photos-gathered + shots-left). Numeral 20–22px Space Mono. This tile
  renders only when `papicHome` is non-null AND `canViewPapicCounts` fed the resolver —
  the RLS-correctness gate: **do not touch**.
- **Messages:** keep; numeral Space Mono.
- **Tile foot links** ("Open the roster →" etc.): 11.5px 600 → colour `#3B4E67` (was gold).

**Rejected from the frame, with reasons (do not build):**
- *"vendors booked 7/9" mini* — the number already lives in the Your-team badge
  (`lockedVendorCount of totalLockableCategories`, wedding only) and the focal's AI chip.
  A third home violates one-home-per-number, and a new mini would displace Papic or
  Schedule against the ranking lock. On a vendor-free type it would be a permanent fake
  door (`marketplaceEnabled=false` zeroes the whole ladder).
- *"checklist done 62%" mini* — same displacement problem, and it would sit one card away
  from the focal's "% planned" bar: two adjacent planning-percentages that measure
  different things (tasks done vs categories locked) read as a contradiction the first
  time they diverge. It gets a cheaper, honest home instead → § 2.3b.

### 2.3b EXTEND — checklist completion chip

On the shipped "View your full checklist →" line under the decisions board:

```
View your full checklist →   [62% done]
```

- Chip: Space Mono 11px 700, `#8A6B39` on `rgba(169,131,75,.12)`, radius 8px, padding
  2px 8px.
- Data: two head-counts over `event_checklist_items` for this event (`status='done'` and
  total), added to the surface's existing `Promise.all` batch. This is a lean read of a
  shipped table — allowed ("widgets read shipped sources"); **no seeding on this page**
  (`ensureChecklistSeeded` mutates and stays on the checklist surfaces).
- States: rows exist → percentage (round, no decimals). Zero rows (never seeded) → **no
  chip** (not "0%"). Query error → **no chip** (link unaffected). 100% → chip shows
  `100% done` in `--sn-success` `#5E7C52` on `#E9EEE3`.

### 2.4 The Big-Day focal — restyle (obsidian → ink)

Everything inside this block keeps its exact conditional structure (see § 3.1). Visual
deltas only:

| Part | Was (Atelier) | Becomes (Warm Editorial) |
|---|---|---|
| Surface (`focalDark` true) | `.sn-tile-dark` obsidian glass + gold radial + `sn-veil`/`sn-capiz` ornaments | Solid **ink** `#2C2A29`, radius 14px, no blur, no ornaments, border none, shadow `0 8px 28px rgba(30,26,18,0.10)` |
| Surface (day-of step-down, `focalDark` false) | `.sn-tile` glass | § 2.1 flat cream card — the DayOfModeGrid's "happening now" card keeps sole ownership of the dark surface that day ("one ink card per view" replaces "one obsidian per view"; same prop, same logic) |
| Eyebrow "The wedding day" | gold-300 on dark | Space Mono eyebrow, `#CBA766` on ink / `#8A6B39` on cream |
| Date headline | 22px 800 | Keep size/weight; colour `#FDFBF7` on ink (cream, never pure white) / ink on cream. Keep the long-form "Friday, December 12" register here — the emotional anchor earns the exception to § 2.8; every other date on the page goes day-first short |
| Venue / lock line | mono xs | Keep; `rgba(253,251,247,.65)` on ink |
| Countdown numeral | 46px mono | Keep 46px Space Mono 700; `#FDFBF7` on ink. `CountUp` kept |
| "% planned" bar | gold-300 fill + shimmer on glass track | Track `rgba(253,251,247,.14)` on ink / `rgba(30,26,18,.08)` on cream; fill `#CBA766` on ink / `#A9834B` on cream. Shimmer sweep: keep (it's restrained and reads as light on ink) |
| Suri briefing + chips (AI) | glass chips | Chips: on ink → 1px `rgba(253,251,247,.25)` border, `rgba(253,251,247,.08)` fill, text `#F3ECDF`; on cream → gold-outline chip (border `#A9834B`, text `#8A6B39`, fill `rgba(169,131,75,.12)`). Sentence colour = headline colour |
| The Watch rows (AI) | gold dots on dark | Keep structure + `InspectorTrigger`s; dot `#CBA766` on ink; category label mono 10px; copy `rgba(253,251,247,.82)`. Below-xl inert behaviour unchanged |
| Divider lines | rgba white/ink .12/.08 | `rgba(253,251,247,.12)` on ink / `#EDE8DE` on cream |

### 2.5 NEW — the "Meanwhile" card (memory arrival)

**The design's stated source (`alaala/`) does not exist as data** — `alaala/page.tsx` is
catalog-driven, "no per-event data yet" by its own docblock. The verified source that
means exactly "a vendor delivered something you haven't looked at":

- **Read:** `booking_handovers` where `event_id = eventId`, `status = 'delivered'`,
  `couple_acknowledged_at IS NULL`, ordered `delivered_at DESC`. RLS is couple-on-event
  (`current_event_ids`) — read with the **user client, not admin**, so a coordinator or
  moderator viewer is denied → empty → card hides. For this card that fail-direction is
  correct (see § 3.6).
- **Join for display:** map `event_vendor_id` → vendor name via the `eventVendors` array
  the surface already loads. No new queries beyond the one lean select (add it to the
  existing `Promise.all`).
- **Destination:** `${base}/vendors/${event_vendor_id}/workspace` — the shipped handover
  inbox, where **Confirm receipt** (the `acknowledge_handover` RPC, idempotent) is the
  shipped, explicit dismissal. No new action, no new store, no per-card dismiss state.

**Visual (per the frame):** § 2.1 card; eyebrow `MEANWHILE`; one row: 44px thumbnail
placeholder square (10px radius, `repeating-linear-gradient(-45deg,#EFE8DA,#EFE8DA 6px,
#E6DECB 6px,#E6DECB 12px)`, 1px `#E1DCD1` border — no real thumbnail: handover payloads
are links/files, not resolvable previews; do not presign anything here) + copy 13.5px
`#6E6A62`:

- `kind='gallery_link'`: **"{Vendor} delivered your gallery.  Look →"**
- `kind='file'`: **"{Vendor} sent you a file{label ? ` — ${label}` : ''}.  Open →"**
- `kind='note' | 'signoff'`: **"{Vendor} left you a note.  Read →"**
- Link text `#3B4E67` 600. Row min-height 44px.

**Multiplicity:** show the latest delivery only; if more than one unacknowledged handover
exists (any vendor), append a muted second line: *"+2 more waiting in your vendor rooms."*
(plain text, no link — each row's own door is its vendor workspace; a hub for all
handovers is **not stated** and must not be invented).

**Position:** after the What's-next rail (or after the decisions board in the free state),
before "Around your event" — the frame's "last content section before nav" intent, mapped
onto the shipped order. States: § 3.6.

**Copy note:** the frame's sample "Your prenup photos arrived — 84 from Studio Hiraya" —
the count ("84") and media kind are NOT derivable from `booking_handovers` (payload is an
opaque link/file). The copy above claims only what the row knows. Do not fake precision.

### 2.6 Widget ④ — Add-ons rail: PARKED (owner Q2)

Not built in this pass. `OPEN_QUESTIONS_ANSWERED` § Q2: no rail on the Overview by
default — it would compete with the decisions board, the same argument that kept Papic off
the board on 2026-07-30. **If and only if the owner answers Q2 "yes, on Overview"**, build
it as the proven pattern on this page — a **dismissible nudge in `slotAfterBento`**, not a
permanent band:

- One `ServicePoster`-derived card (reuse `studio/_components/service-poster.tsx` +
  `poster-drift` motion; zero new CSS), showing the single highest-relevance un-bought
  add-on (relevance = the shipped catalog order; a recommender is not stated).
- Prices come **live from the catalog** — never typed. The frame's "from ₱2,500 / ₱4,000 /
  ₱1,500" are sample values and wrong-shaped for the locked charm pricing (-1 endings).
- Ranking within `slotAfterBento`: after SetDateNudge and PapicReadyNudge (owner default:
  set-date first; Papic is the foundation; commerce goes last). Dismissible per-event like
  its siblings; hides any purchased service (`paidOrders` already loaded); hides entirely
  when everything is bought — no empty shell.

### 2.7 Hero — restyle

- Greeting line: 13px `#6E6A62` (was `text-ink/55`).
- `sn-h1` sentence: keep Hanken 800; size per the shared kit; ink. The `.sn-h1-tail`
  softening stays.
- All three sentence branches (day-0 / past / future) and the tail's render condition:
  untouched.

### 2.8 Data-date format — page-wide restyle

The shipped `shortDate` (`en-PH`, `month:'short', day:'numeric'` → "Dec 12") flips to
**day-first**: "12 Dec" (chips, schedule previews, What's-next rail) and "12 Dec 2026"
where the year is present (none found on this surface outside the focal — the plaque
metaLine lives in the layout/shell unit's scope). One formatter change at the `shortDate`
const; every consumer inherits. The focal headline keeps long form (§ 2.4).

### 2.9 Chip-tone re-map (all chips on this page)

The shipped `chipToneStyle` maps to `--sn-*` semantic vars. Re-point the four tones to the
Warm Editorial vocabulary — **the keys and every call site stay identical**:

| Tone | Was | Becomes |
|---|---|---|
| `hot` | `--sn-warning` amber | text `#C24E25` on `rgba(194,78,37,.10)` |
| `warm` | gold-700/gold-100 | text `#8A6B39` on `rgba(169,131,75,.12)` (the README's "waiting `#C9A96E`" family, at readable depth) |
| `calm` | `--sn-info` | text `#3B4E67` on `rgba(59,78,103,.10)` |
| `ok` | `--sn-success` | keep `#5E7C52` on `#E9EEE3` (sage — matches the handoff's status tints) |

Amount-bearing chips add `font-mono`.

---

## § 3 — Every state each touched widget must still render

Derived from the shipped component, not the frame. The restyle is DONE only when each of
these renders correctly under the new skin.

### 3.1 Big-Day focal
1. **No date:** headline "Your date, once it's set" (wedding) / "Date to be set"; no
   countdown; helper "Your countdown begins the moment your date is set."; SetDateNudge
   present in overlays. `hasFirmDate=false`.
2. **Year-precision date:** headline = year only; sub "Target date — not locked yet";
   helper "Narrow to a single day to start your countdown."; NO countdown numeral.
3. **Month-precision:** as (2) with "December 2026" headline.
4. **Firm future date:** long-form headline; venue OR "The date is locked" sub; countdown
   `CountUp`; "% planned" bar.
5. **Day-0 outside day-of window:** numeral "Today" + "it all happens now".
6. **Day-of window (`dayOfActive`):** focal renders CREAM (step-down); DayOfModeGrid owns
   the ink surface above.
7. **Past date:** numeral `abs(daysOut)` + "day/days ago"; hero flips to "Your {event} is
   complete."
8. **Invalid date string:** `Number.isNaN` branch → fallback headline. Keep.
9. **AI off:** no briefing, no chips, no Watch — the focal is short. **AI on:** briefing
   sentence + up-to-3 chips (countdown chip only when `daysOut ≥ 0`; urgent chip only when
   `topPriorityTask`); Watch section only when `watchItems.length > 0`, max 4 after
   restraint, with the "few alerts a week" reassurance line.
10. **`?suri=preview` (internal only):** render-only AI state — must look identical to
    entitled AI.

### 3.2 "Needs you this week" digest
1. Zero decisions → count `0` + invitation sentence (no rows, no fake rows). Note: the
   count comes from loaded groups, not a failed read — a query error upstream
   graceful-degrades that source to `[]` and logs; the panel itself never shows an error
   state (shipped behaviour, kept).
2. 1–3 decisions → rows without the "All N" link ambiguity (link still renders; fine).
3. >3 → top 3 + "All N decisions ↗".
4. AI on → ordering `book, pay, pick, role` re-rank + "· ranked" suffix; AI off → natural
   order.
5. RSVP row (new): hidden when `pending=0` OR no replies yet OR guests failed to load
   (`guests=[]` fail-soft ⇒ `pending=0` ⇒ hidden — correct fail direction, verified).
6. Amount rows: `requested_total_php` null/non-finite → "payment pending" text, no fake
   ₱0 (shipped guard, keep).
7. Vendor-free event (`marketplaceEnabled=false`): no book/pick/venue rows ever; digest may
   legitimately be empty on a busy event — the empty sentence must not imply idleness
   (shipped copy is fine).

### 3.3 Live minis
1. Fresh event, nothing loaded: **zero tiles** → the grid div doesn't render
   (`miniTiles.length > 0` gate — keep; no empty 2×2 skeleton).
2. Each tile's independent render condition (verified): Guests `total>0` · Budget
   `committed>0 || target>0` · Schedule `!schedulePreview.isEmpty` · Papic
   `papicHome !== null` (which internally requires the viewer gate) · Messages
   `unreadCount>0`.
3. Papic pre-capture vs gathering copy branches, incl. the `cameras===1` singular and
   `shotsLeft===0` tail.
4. Coordinator viewer: `canViewPapicCounts` resolved by page for couple+coordinator;
   moderators outside that set get **no tile, never a wrong zero** (RLS-denial-≡-0 guard —
   the reason the prop exists; keep default-false).
5. Overflow: 5 candidates → Messages yields; Papic never drops.
6. Budget over target: bar clamps at 100% — with compact-k display the over-commitment
   must still read: when `committed > target`, the leading numeral renders in `#C24E25`
   (extend, presentation-only).

### 3.4 Decisions board
1. Empty board → single invitation card. 2. Group-level: only non-empty groups render.
3. First-row-filled / rest-outlined CTA hierarchy per group. 4. Inspector trigger vs plain
navigation below xl / modified clicks. 5. Venue offer: standalone card when no matching
decision row; inline under the matching row otherwise; NEVER on vendor-free or AI-active
(three-way gate verified — keep). 6. Checklist chip states per § 2.3b.

### 3.5 What's-next rail (AI only)
1. Hidden when AI off or `upcoming.items` empty. 2. `fetchUpcomingItems` throw →
graceful empty object → hidden. 3. Items without `href` render as text, not links (no fake
doors — keep). 4. Dot colours by category: payment/renewal → `#C24E25` · document →
`#3B4E67` · else → `#5E7C52` (re-mapped per § 2.1 vocabulary).

### 3.6 "Meanwhile" card (new — full inventory)
1. No unacknowledged deliveries → **absent** (no header, no shell).
2. One delivery → single row, kind-specific copy.
3. Multiple → latest + "+N more waiting" muted line.
4. Query error / RLS denial (coordinator, moderator) → **absent.** Deliberate: error≡empty
   is acceptable HERE because absence of a conditional nudge misleads nobody — unlike a
   counter, where 0 is a claim. This is the documented exception, not an oversight.
5. Vendor name unresolvable from `eventVendors` (archived row) → fall back to "A vendor"
   — never render a blank name.
6. After the couple confirms receipt in the workspace → row disappears on next render
   (state lives in `booking_handovers.status` — no local dismiss state to desync).
7. Delivered-then-disputed (`status='disputed'`) → NOT shown (filter is
   `status='delivered'` exactly).

### 3.7 Around-your-event cards
All shipped branches kept: Hosts solo vs multi (+invited chip tone) · Your team hidden on
vendor-free, wedding vs non-wedding badge denominators, empty-team invitation copy ·
Conversations zero vs unread (event-scoped count — never the account-wide number) ·
Services empty vs rows with pending-first urgent-float · Schedule empty ("No program
yet…") vs preview + "+N more blocks".

### 3.8 Page-level overlays (`slotAfterBento`)
Nikah (with imam auto-resolve note variants) · SetDate (no-date only, dismissible) ·
PapicReadyNudge (dated + couple + nothing-shot, waits behind SetDate) · Chinese tea tile ·
Plan-next-year (recurring types). `hasOverlays` gate keeps the spacing div from rendering
empty. None of these change.

---

## § 4 — Fable's enhancements (beyond the handoff, each justified)

- **E1 · The RSVP digest row** (§ 2.2). The frame drew it; my additions are the honesty
  gate (replies-started), the no-fake-nudge copy rule, and keeping it out of the decision
  count. Nine months out, unanswered invitations are the couple's most common "waiting on
  people" state and today the page only shows it as a ring fraction.
- **E2 · Mobile Watch disclosure.** On <lg with AI active, the focal's Watch rows collapse
  behind a native `<details>` — summary: `The Watch · {n}` in the eyebrow style, open by
  default when any item is category `guard`. Rationale: on a phone the tall AI focal
  pushes "Needs you this week" below the fold — the one panel a couple opens the app for.
  Nine months out the briefing is reassurance; the digest is the job. Behaviour-add is one
  wrapper; inspector triggers inside are unchanged. Desktop (≥lg) never collapses.
- **E3 · Budget bar kept + over-commit tint** (§ 2.3, § 3.3.6). The frame's plain
  `₱312k/480k` counter hides the one thing a glance is for — being over. Deviation from
  the frame, declared.
- **E4 · The "Meanwhile" source correction** (§ 2.5). Re-wired from the frame's guessed
  `alaala/` (no per-event data — verified) to `booking_handovers`, whose couple-RLS read
  and idempotent acknowledge RPC give the card a real lifecycle with zero new stores.
  This is the difference between the card shipping this month and the card waiting on an
  Alaala data model.
- **E5 · Checklist chip instead of a fourth counter** (§ 2.3b). Honours the frame's intent
  (the number exists on the page) without breaking the Papic slot lock or seating two
  rival percentages side by side.
- **E6 · Space Mono inside amount chips** (§ 2.1). The frame renders every peso figure in
  mono; the shipped chips don't. Small, page-wide, and it is the README's own rule
  applied one level deeper than the current code goes.
- **E7 · Compact-k money in the Budget mini only, full value in `aria-label`** (§ 2.3).
  Glanceability where space is tightest; precision preserved for assistive tech and
  everywhere money is settled.
- **E8 · Fail-direction notes written into the spec** (§ 3.2.5, § 3.6.4). Each new read
  states which way it fails and why that direction is safe — the house lesson (RLS denial
  ≡ empty read) applied at design time instead of discovered in prod.

**Deliberately NOT enhanced:** the bottom bar (owner lock), the add-ons rail (owner Q2),
the journey rail (not drawn in the handoff; shared component), the day-of grid (own
surface), the "Find" palette (Q3 — new work, different unit), any reordering of the
board-above-journey-rail council verdict (2026-07-12 — stands).

---

## § 5 — Could not verify / not stated (do not invent during build)

1. **A "pending RSVPs" filtered view under `guests/`** — not found; the RSVP row links the
   plain roster.
2. **An "invitations sent" signal** in `computeGuestStats` — not present; the
   replies-started proxy gates the RSVP row instead.
3. **A compact-peso formatter** in the codebase — not searched exhaustively; if none
   ships, the Budget-mini display math is new presentation code (display-only).
4. **`EventDayPrepCta` / `PromoFreeWindowBanner` internals** — not read this pass; flagged
   for a token check only.
5. **`JourneyRail` internals** — out of this unit's scope by decision, not by ignorance.
6. **Which unit owns the shell header row** (design widget ①) — frames 1a–1d; this spec
   only asserts what the Overview must NOT duplicate (a second countdown).
7. **The frame's "unread vendor quote" digest row** ("Florist sent a new quote ·
   ₱28,500") — structured proposal sends exist in chat, but this surface loads no thread
   bodies; building it needs a lean "latest unread structured proposal per event" read
   that is **not specified anywhere I can verify**. Parked as a finding, not designed.
8. **Handover thumbnail media** — `booking_handovers.payload` is an opaque link/file;
   no preview is resolvable. The placeholder swatch is deliberate.

---

## § 6 — Build order (restyles land before new builds — rule 6)

1. **Unit A (restyle):** § 2.1 skin swap + § 2.9 chip re-map + § 2.4 focal + § 2.7 hero +
   § 2.8 dates + CTA colour flips (§ 2.2b, one-thing, minis feet). Zero behaviour deltas.
   Run the INTEGRATION_RULES mechanical check; expect ~flat net lines.
2. **Unit B (restyle):** § 2.2 digest row grammar + § 2.3 minis flat grammar.
3. **Unit C (extends):** § 2.2 RSVP row · § 2.3b checklist chip · E2 Watch disclosure ·
   E3 over-commit tint. Each adds branches; each new branch appears in § 3's inventory.
4. **Unit D (new):** § 2.5 Meanwhile card.
5. **Parked pending owner:** § 2.6 add-ons nudge (Q2) · anything touching the bottom bar
   (Q1 — currently NOT granted).

Existing tests stay green untouched (rule 5). `TZ=Asia/Manila` (and friends) suite runs
per the house timezone rule before any PR.
