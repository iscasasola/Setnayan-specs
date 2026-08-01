# Public Website & App Design Foundation — Psychology · PH Market · Frame Inventory
### 2026-08-01 · the layer that sits UNDER the 12-archetype brief

> **What this document is.** The owner supplied (a) a YouTube transcript on web-design psychology and
> (b) a screenshot of a two-tier pricing card annotated `Everything in Basic PLUS:`. This file converts
> both into an executable design foundation for Claude Code, joined to what Setnayan **already ships**.
>
> **What this document is NOT.** It does not replace
> [`Claude_Design_Brief_2026-07-31.md`](Claude_Design_Brief_2026-07-31.md). That brief already defines the
> 12 archetypes, the palette supersede, and the port contract. **This file supplies what that brief
> lacks:** the *why* (psychology), the *reference* (PH market visual language), the *frame inventory*
> (popups/states — the brief only counts screens), the *response contract* (what the app does when a
> thing is picked), and the *count* (how many designs to actually produce).
>
> **Verified against `origin/main` @ `cf4c0f127` (2026-08-01), not against specs.**

---

## 0 · RULE 0 — what exists · what is missing · the delta

Per repo `CLAUDE.md` Rule 0, the search ran before any design. Results:

| | Finding | Evidence |
|---|---|---|
| **EXISTS** | **The 12-archetype brief, and its numbers still hold.** 401 routes (126 couple · 108 admin · 104 public · 63 vendor); 45 raw `<table>` files, 33 of them `admin/*`. Re-counted today at `cf4c0f127` — identical to the brief's `c626d7686` count. | [`Claude_Design_Brief_2026-07-31.md`](Claude_Design_Brief_2026-07-31.md) §0, §3 |
| **EXISTS** | **The palette supersede is already recorded.** Mandarin `#F37A1F` CTA + gold `#A9834B` highlight + Facebook two-tone surfaces, with the AA contrast math already done. Typography stays locked. | Brief §1 |
| **EXISTS** | **The animation stack is installed** — GSAP 3.13 + `@gsap/react`, three.js 0.184 + r3f + drei + postprocessing. No framer-motion. "Add animations" is a **coverage** problem, not a capability problem. | Brief §0 |
| **EXISTS** | **App-shell primitives ship and are barely used** — `_components/sheet.tsx`, `nav/bottom-nav.tsx`, `nav/sub-nav.tsx`, `nav/nav-slide-controller.tsx`, `app-init-splash.tsx`, `account-switcher/`. | `apps/web/app/_components/nav/` |
| **EXISTS** | **🔑 The owner's screenshot is already the shipped vendor data model.** `vendor-benefits.ts` is grouped (`VendorTierGroup = { h?, items }`) and every tier states only what it **ADDS**: *"Everything in Free, plus…"* · *"Everything in Solo, plus:"* · *"Everything in Pro, plus:"*. Its header comment says so verbatim: *"each tier showing what it ADDS on top of the one below."* | `apps/web/app/_components/home/vendor-benefits.ts:3-4,121,140,168` |
| **EXISTS** | **`/pricing` already chunks.** Add-ons render from `ADDON_GROUPS` into four named sections — *Papic & its add-ons · Go live & interactive · Your website · Personal touches* — data-driven from the catalog, never hardcoded. `"Everything in Free"` already appears. | `apps/web/app/pricing/page.tsx:114-190,667,690-721` |
| **MISSING** | **The psychology is not written down anywhere**, so each session re-derives (or contradicts) it. No corpus doc states *why* the layout must be conventional, or where deviation is permitted. | grep of `03_Strategy/`, `DECISION_LOG.md` |
| **MISSING** | **No PH-market visual reference exists in the corpus.** `01_Competitor_Analysis` covers wedding rivals only — never Shopee/GCash/Facebook, which are where Filipino users' **mental models actually come from**. | `03_Strategy/01_Competitor_Analysis.docx`, `02_Competitor_Analysis_Consolidated_v2.docx` |
| **MISSING** | **The brief counts screens, not frames.** 55 files carry a dialog/sheet/modal; none of that is in the 12-archetype count, and no state matrix (loading/empty/error/denied) exists — critical because **prod is pre-launch-empty**, so most surfaces render empty for every user today. | `grep -rln 'role="dialog"\|<Sheet\|Dialog\b' apps/web/app` → 55; memory `project_setnayan_prod_is_prelaunch_empty` |
| **MISSING** | **No response contract.** Nothing states what the app does *between* the tap and the new state. That gap is why the product reads as website-not-app. | Brief §2 (names the gap, doesn't spec the response) |
| **DELTA** | **This file.** §1 psychology → §2 PH reference → §3 palette/layout/type/imagery rules → §4 the concept → §5 pattern-breaking budget → §6 the logic layer → §7 full frame inventory → §8 interconnection/response contract → §9 the count → §10 build order. **No new screens are invented; every archetype maps to the brief's 12.** | — |

**One line each, as Rule 0 demands:**
- **What exists:** the 12-archetype brief + a shipped delta-pattern vendor ladder + a chunked `/pricing` + a full animation stack.
- **What is missing:** the rationale, the PH reference, the popup/state inventory, the response contract, and a real design count.
- **The delta I will build:** this foundation file — reasoning and inventory only, zero re-drawn screens.

---

## 1 · The psychology (source: the supplied transcript)

The transcript's argument, compressed to what changes our decisions. Line references are to the supplied
caption file, `[English (auto-generated)] The Psychology of a PERFECT Website [DownSub.com].txt`.

### 1.1 The premise — most of the decision is unconscious

Roughly a billion bits per second reach the senses; conscious awareness handles on the order of ten
(lines 24-29). Therefore **every design decision lands whether or not the visitor notices it** — a bad one
"quietly turns people away, and you're never going to know why" (lines 36-38).

**Consequence for Setnayan:** we cannot A/B our way out of a broken foundation, because the failure mode is
silent. Prod being pre-launch-empty means we have **no behavioural signal at all** right now
(`project_setnayan_prod_is_prelaunch_empty`). The foundation has to be right by construction.

### 1.2 The three-friend model (lines 43-59)

The transcript's frame: not one user but three simultaneous evaluators, who must be addressed **in order**.

| Friend | Cares about | Votes | Fails when | Our archetype answer |
|---|---|---|---|---|
| **1 · Survival** | Safety, recognition, "am I in the right place" | **First** | Layout deviates from the expected blueprint | Archetypes 1, 2, 12 — shell, wayfinding, honest empties |
| **2 · Emotional** | Feeling, delight, novelty | Second | Everything is so safe it's boring | Archetypes 5, 8, 10 + the motion budget |
| **3 · Rational** | Logic, justification, proof | Last | Reasons are unchunked and get dropped | Archetypes 4, 5, 6, 9 + the grouping law (§1.5) |

**The ordering is the instruction.** Friend 1 votes first — so we may not spend the hero on delight, and
may not spend the fold on proof. Setnayan's existing wayfinding rule (`project_setnayan_wayfinding_rule`,
"doorway") is already an expression of Friend 1; this names why.

### 1.3 Mental models — the blueprint visitors arrive holding (lines 72-88)

Visitors carry a blueprint built from *every site they have ever used*: logo top-left, nav adjacent, footer
at the bottom. Deviate and Friend 1 does not go looking — it registers "this is different" and leaves.

The transcript's worked failure: a gaming site moved its mobile menu to the bottom corner — **better UX on
paper**, closer to the thumb zone — and had to revert it because nobody could find it (lines 65-72).

> ### 🪤 The trap this creates for us, stated plainly
> **A UX improvement that violates the blueprint is a regression.** Being right about ergonomics does not
> buy you the click. This is the single most expensive lesson in the transcript and it directly threatens
> our bottom-nav / app-shell work (archetype 1) — where "more app-like" is exactly the argument the gaming
> site made before reverting.
>
> **The resolution is not to abandon the shell.** It is that *the blueprint for a logged-in app surface and
> the blueprint for a public marketing page are different blueprints.* Bottom nav is native-app
> convention (Friend 1 expects it **inside** an app). Top nav is web convention (Friend 1 expects it on a
> **marketing page**). Setnayan must not cross them — and today, per the brief, the public site and the
> dashboards share no shell at all, so the line is free to draw correctly.

### 1.4 Principle #1 — structure conventional, MAYA inside it (lines 88-134)

The transcript's uncomfortable conclusion: to keep Friend 1, **you cannot be very creative with layout**
(lines 88-95). But total predictability bores Friend 2 into bouncing (lines 106-110).

The resolution the transcript names: **keep the structure predictable, break tiny patterns on purpose
inside it** (lines 111-114) — the **MAYA** target, *Most Advanced Yet Acceptable* (lines 120-121).
Vehicle: **microinteractions** — "a button that reacts to your hover in a way that buttons don't normally
react," "an image that scales ever so slightly as you scroll past" (lines 122-129). Explicitly **not
drastic** — drastic scares Friend 1 off (lines 130-134).

This is quantified into a spend budget in **§5**.

### 1.5 Principle #2 — the grouping law (lines 169-209) ⟵ *this is what the screenshot is about*

Working memory holds about **three or four things** (lines 170-172). A visitor scrolling a benefits list
has dropped half the reasons before reaching the bottom (lines 176-180). The fix is **chunking** — the
phone-number analogy: ten digits are unmemorable; three chunks are trivial (lines 181-187).

Applied to pricing, the transcript is specific (lines 190-209):
1. **Do not write every feature out in a long flat list, repeated per tier** — nobody can then tell the
   cheapest from the dearest (lines 191-198).
2. **Split features into named categories** (lines 199-201).
3. **Show the difference, not the repetition** — *"this pro tier, the diamond tier, is everything in basic
   plus all of these features"* (lines 201-206).
4. The purpose: stop making people **"pick the needle out of the haystack"** on every comparison
   (lines 206-209).

### 1.6 What the supplied screenshot demonstrates

The annotated image is the transcript's §1.5 rendered as a card pair. Two annotations were drawn by hand:

- **A circle around `Everything in Basic PLUS:`** — marking the delta framing as the load-bearing element.
- **A long vertical bracket down the entire Diamond feature column** — marking that *everything below the
  circle is additive only*: the Diamond card never restates *3 projects · 10GB · Basic analytics*.

Structural facts readable from the image, and what each maps to for us:

| Observed in the image | The rule it encodes | Setnayan status |
|---|---|---|
| Both cards carry **category subheads** (`Projects` · `Team` · `Included`) in small muted type | Chunk into 3-4 named groups, never a flat list | ✅ shipped both sides — `ADDON_GROUPS` (4 groups) on `/pricing`; `VendorTierGroup.h` on the vendor ladder |
| The premium card states **`Everything in Basic PLUS:`** and lists only additions | Show the delta, never the repeat | ✅ shipped on vendor (`vendor-benefits.ts:121,140,168`) · ⚠️ **not visually rendered as a delta** — see the finding below |
| The premium card is **colour-inverted** (saturated fill, dark CTA) against the neutral card | One card is visually the answer; the other is the reference point | ⚠️ to design — archetype 5 |
| A **billing-period toggle** sits above both cards, not inside either | The axis that applies to everything lives above everything | ⚠️ to design — archetype 5 |
| **Prices in one heavy weight, features in one light weight** — two type roles only | Do not let the comparison carry more than two levels of emphasis | Locked type pair already gives us exactly two (§3.3) |
| Checkmarks are identical throughout — **the tick carries no information** | Differentiate by *presence of a row*, not by icon variation | ⚠️ to design |

> ### 🔑 The finding that matters most
> **Setnayan already made this decision — in data, on the vendor side, on 2026-07-01 — and never finished
> rendering it.** The tier objects are grouped and additive by construction. The unfinished half is the
> **presentation**: `vendor-tier-matrix.tsx` is named in the brief as an archetype-5 offender, and a
> matrix is *precisely* the haystack the transcript warns about — it re-states every row for every tier so
> the reader can compare ticks. **Do not build a new pricing model. Render the one that exists, the way
> the data already describes it.** (Repo `CLAUDE.md` Rule 0 — extend, never re-draw.)
>
> The **customer** side is the genuine gap: `/pricing` chunks its add-ons but the **Free → Setnayan AI**
> step is not framed as a delta, and the à-la-carte SKU cards each stand alone with no "everything before
> this, plus" spine.

---

## 2 · The Philippine reference layer — where our users' blueprints come from

Friend 1's blueprint (§1.3) is built from the sites a person actually uses. For a Filipino visitor that
blueprint is **not** built from wedding platforms — it is built from the handful of surfaces below. This
section exists because the corpus has competitor analysis but **no market-visual analysis**.

### 2.1 The market facts that set the constraints

| Fact | Figure | Design consequence |
|---|---|---|
| Internet users | 98.0M, 83.8% penetration (end-2025) | Mass-market, not early-adopter. Convention beats cleverness. |
| Smartphone ownership | **98.6%** | Design mobile-first as the *primary* artefact, not the fallback. |
| Mobile share of internet use | **~64.9%** — a market that skipped the desktop era | The desktop layout is the derivative, not the source. |
| Mobile connections | 137M = 117% of population; **89% broadband (3G/4G/5G)** | Heavy media is viable, but 11% is **not** broadband → progressive enhancement is mandatory. |
| Social media identities | 95.8M = 81.9% of population | Facebook's chrome *is* the default UI vocabulary. |

### 2.2 The sites themselves (ranked, current)

| Rank / segment | Site | What the visitor learned there |
|---|---|---|
| #1 overall | **Google** | A search field is the primary control; results are a vertical list. |
| #2 · #4 | **Facebook · Messenger** | **Grey page, white cards.** Top bar + tab row. Rounded rectangles. Blue = action. |
| #3 | **YouTube** | Thumbnail grid; play is the only affordance that matters. |
| #5 | **ChatGPT** | A single input at the bottom of a scroll region. |
| E-comm #1 | **Shopee** | Orange `#EE4D2D`. Dense category-icon grid, bottom nav, countdown urgency, coin/reward pill. |
| E-comm #2 | **Lazada** | Deep blue `#1E2376` + `#1E71FF`, pink `#FA2D96`. Same skeleton, different paint. |
| Wallet | **GCash** | Blue `#1972F9` / `#0B2757` / `#518FFB`. Balance card pinned top; **a grid of labelled service icons underneath** — the super-app launcher. |
| News | **Inquirer · GMA · ABS-CBN · PhilStar · Rappler** | Dense multi-column headlines; density reads as *credible*, not cluttered. |

### 2.3 The five patterns every one of them shares

This is the **actual blueprint** to conform to. Nothing here is a style preference; each is a repetition
frequent enough to have become Friend 1's expectation in this market.

1. **Two-tone surface.** A **grey page** with **white cards** floating on it. Not white-on-white. This is
   Facebook's chrome and Shopee's and GCash's. *(⚠️ Setnayan today is the inverse — page is pure `#FFFFFF`
   with warm `#f4f2ec` cards. Brief §1 already flags this.)*
2. **One saturated action colour, used sparingly.** Shopee orange, GCash blue, Lazada blue. It appears on
   the primary button and essentially nowhere else. Scarcity is what makes it read as *the* action.
3. **A labelled service grid.** GCash's launcher, Shopee's category circles. **Icon + short label, never
   icon alone.** Filipino super-app users expect to *read* their way to a service.
4. **Persistent bottom navigation on mobile, 4-5 items, labelled.** Universal across Shopee, Lazada,
   GCash, Grab, Facebook. This is the strongest single convention in the market.
5. **Density reads as trustworthy.** Every high-traffic PH surface is denser than a Western SaaS landing
   page. Generous whitespace is read as *thin*, not premium.

> ### 🎯 The convergence worth naming to the owner
> The owner's 2026-07-31 palette instruction — *"background color like facebook which is white, then
> mandarin orange and gold buttons/highlights"* — **independently arrives at patterns 1 + 2 above.** It is
> Facebook's surface model with Shopee's action colour. That is not a coincidence to be smoothed over;
> it is a correct read of the market, and it should be executed rather than re-litigated. The one
> correction the reference demands: Facebook's page is **grey `#F0F2F5`**, not white — the brief already
> carries the corrected value.

### 2.4 What we deliberately do **not** copy

| Not adopted | Why |
|---|---|
| Shopee's countdown timers / flash-sale urgency | We sell a wedding, a binyag, a debut. Manufactured urgency against a life event reads as insulting and would violate the warm-Filipino voice lock. |
| Lazada's three-colour system | Our accent budget is exactly two (mandarin CTA, gold highlight) and typography is locked to one pair. |
| News-site ad density | Public-surface hygiene lock — benefit/feeling copy only. |
| GCash's balance-first hierarchy | Our top-of-surface truth is the **event and its date**, not money. |

---

## 3 · The rules — palette · layout · typography · imagery

### 3.1 Palette (carried verbatim from brief §1 — do not re-derive)

```
CTA        mandarin  #F37A1F   button fills, primary actions        (token slot: mulberry)
           hover     #D9600A
           label     #1B1A17   ← INK, NOT WHITE. White on mandarin = 2.76:1, FAILS AA.
                                 Ink on mandarin = 6.31:1, passes.
           deep      #B44F06   orange TEXT on white = 5.17:1 ✓ · links, small elements
           dark mode #FF8A3D   (7.73:1 on #17160F) · hover #FFA05C

HIGHLIGHT  gold      #A9834B   selected states, active tabs, borders, rules, pills  (slot: terracotta)
           soft      #F3ECDF light / #2A2E36 dark
           dark mode #CBA766   (7.99:1)
           ⚠ 3.48:1 on white — LARGE TEXT AND UI ONLY. Never gold body text.

SURFACE    light   page #F0F2F5   card #FFFFFF     ← the two-tone of §2.3 pattern 1
           dark    page #17160F   card #1E2229

INK        light  #1B1A17 (17.4:1 on white · 15.5:1 on #F0F2F5)   soft #4F535B
           dark   #FBFAF7                                          soft #B6B9BE
```

> ### ⚠️ CORRECTION 2026-08-01 — the app is LIGHT-ONLY. Do not design a dark theme.
> The parent brief §1 says *"Both themes are mandatory… the app ships a runtime theme picker."*
> **That is not true of shipped code and has not been since 2026-06-04.** Owner directive, quoted in
> `apps/web/app/_components/theme-provider.tsx:11` — *"the app used to adjust automatic to light and dark
> theme. disable this and just always keep it light theme."*
>
> The provider is hard-locked: `mode` and `resolvedTheme` are always `'light'`, `setMode` is a **no-op**,
> and the `.dark` class is stripped on mount. `globals.css` carries **no** `prefers-color-scheme: dark`
> rule, so with `darkMode: 'class'` every `dark:` variant and every `html.dark` token block is **inert**.
> `users.theme_preference` and `updateThemePreference` are dormant and unread. The dark values remain in
> `globals.css:136-143` only so a future revert is a small one.
>
> **Consequences:**
> - **Design ONE theme per file, not two.** This roughly halves the drawing work (§9).
> - Obsidian surfaces (Alaala, the gallery archetype, the `/` hero) stay obsidian — that is a **per-surface
>   design choice**, not a theme mode. Draw them dark because they *are* dark, not because a toggle exists.
> - The dark-mode hex values in §3.1 are retained for reference only. **Nothing consumes them today.**
> - Re-enabling light/dark/auto is a small revert of `theme-provider.tsx` + the bootstrap script in
>   `layout.tsx` — an **owner decision**, not something a redesign should assume.
>
> The couple's guest landing page (`app/[slug]`) is driven by the couple's own mood-board palette and was
> never under this provider — unchanged, and still out of scope (§9.4).

**Implementation reality (brief §1a) — this is two jobs, not one:**
- **Cheap:** `mulberry` (CTA) and `terracotta` (accent) are already distinct semantic slots that today both
  hold gold `169 131 75` (`apps/web/app/globals.css:120-125`). Point `mulberry` at mandarin, leave
  `terracotta` gold → **239 CTA files turn orange, highlight files stay gold, with zero component edits.**
- **Expensive:** `paper` is **aliased to `cream`** in `tailwind.config.ts`, so page background and card
  surface are **one token**. The two-tone requires splitting them → auditing **396 `bg-cream` uses** plus
  **337 files that hardcode `bg-white`** and will not follow a token change.

> ⚠️ **History the owner should know:** a Facebook palette already shipped **2026-05-22** (white +
> `#1877F2`) and was **retired 2026-05-30** — recorded in `globals.css:110-114`. Orange + gold ≠ Facebook
> blue, so this is not a straight revert, but the territory has been visited. Flagging, not blocking.

### 3.2 Layout law

Derived from §1.3 (blueprint) + §2.3 (PH patterns). **These are Friend 1's requirements — treat as
non-negotiable.**

| Rule | Public marketing surfaces | Logged-in app surfaces |
|---|---|---|
| Primary nav | **Top**, logo left, auto-hides on scroll-down. ONE shared nav — the single-shared-nav lock. | **Bottom** on mobile (4-5 labelled), **rail** on desktop |
| Page/card | Grey page, white cards, `12-16px` radius | Same |
| Service discovery | Labelled grid, icon + text | Labelled grid, icon + text |
| Density | Denser than Western SaaS; tighter line-height in lists | Dense — the Filipino app expectation |
| Footer | Full, link-rich, every doorway present | Not applicable (bottom nav) |

> **🪤 Do not cross the two columns.** A bottom nav on a marketing page and a top nav inside the app are
> both blueprint violations — the exact failure mode of the gaming-site menu (§1.3). The blueprint differs
> by *context*, and Friend 1 knows which context it is in before it knows anything else.

### 3.3 Typography — **LOCKED, do not touch**

```
Hanken Grotesk   the UI family, all weights — every piece of running text and UI
Space Mono       kickers, labels, numerals, dates, prices · .14em uppercase tracking
```

**No other family.** Four were deliberately removed to cut font payload. Do not introduce Instrument Serif,
Cormorant, Manrope, Saira, Geist, or JetBrains. The palette was superseded 2026-07-31; **typography was
explicitly not.**

This pair happens to give exactly the two emphasis levels §1.6 requires: Space Mono for the number,
Hanken Grotesk for the reason. **Prices and dates are always Space Mono** — that is what makes a figure
read as a figure without a second colour.

### 3.4 Imagery

| Kind | Rule | Source of the rule |
|---|---|---|
| Real event photos | **Consented, post-event, couple-only-faces.** Never imply guest-captured or pre-event content is auto-shared. | RA 10173 consent lock |
| Service illustration | Show the *artefact* (the seat plan, the QR, the gallery), never a stock-photo mood | Public-surface hygiene lock |
| Iconography | **Lucide line icons, 1.75px stroke. Never emoji.** | Atelier kit hard rule (still current) |
| Video | Hero videos + Papic / Live Studio / 3D demos are **untouched** by any reskin | Brief §1 |
| Rendered video output | **Never promise a produced-video deliverable** — the render pipeline is owner-blocked. Sell presence and keepsake. | No-rendered-video-promises lock |

---

## 4 · The concept — *"The Filipino app that happens to have a website"*

### 4.1 The one-sentence positioning of the design

> **Setnayan should feel like the apps a Filipino already trusts — a grey-and-white super-app launcher with
> one orange action colour — carrying a story no super app can tell.**

Friend 1 gets Shopee/GCash/Facebook structure and relaxes instantly. Friend 2 gets the pattern-breaks of
§5 and the cinematic `/` that already ships. Friend 3 gets the grouped, delta-framed proof of §1.5-1.6.
Three friends, in order, on every surface.

### 4.2 How the concept lands per surface

| Surface | Concept expression | Archetypes (brief §3) |
|---|---|---|
| `/` homepage | **⛔ EXCLUDED — do not redesign.** ELN cinematic reskin, owner-approved 2026-06-29. The job is to raise the *other* pages to its level. | — |
| Public doorways (`/papic`, `/panood`, `/pawebsite`, `/pa3d`, `/palogo`, `/pakanta`, `/alaala`…) | Editorial page with a **service-grid entry point** — the GCash launcher pattern applied to our in-app services | 7, 9, 12 |
| `/pricing`, `/features` | **The screenshot rendered.** Grouped subheads (shipped) + delta framing + one inverted recommended card + the period toggle above both | 5 |
| `/explore` | Search-first, dense result list — Google's blueprint, not a filter-heavy SaaS grid | 3, 5 |
| Couple dashboard | Persistent shell + bottom nav + labelled service grid; **the four-surface home (Events · Alaala · Spaces · You, PR #3240) is re-skinned, never re-conceived** | 1, 3, 4, 5, 8, 10 |
| Vendor dashboard | Same shell; **extend** `Vendor_Dashboard_AllScreens_2026-07-01.html` etc., do not redraw | 1, 3, 4, 9, 10 |
| Admin console | Density genuinely wins — sticky header, zebra-free, row-hover actions, inline edit, keyboard nav. **Internal-only, ships last.** | 6 |

### 4.3 "Help people find our website and app easy to navigate"

The owner's request splits into two different problems with two different answers:

**Find it (acquisition).** Already specified — do not re-plan. `Website_Master_Plan_2026-06-28.md` §8 holds
the two-tier SEO/GEO play; the SEO **code** work is done (#3952, #3960). The live blocker is **not design**:
per memory `project_setnayan_seo_geo_state`, `seo_metrics` has **0 rows ever** because the GSC/Bing
verification tokens were never added, and `sameAs` is empty. **Two owner actions, no design dependency.**

**Navigate it (comprehension).** This *is* the design problem, and §2.3 answers it: labelled service grid,
persistent bottom nav, top-left logo, dense readable lists, one orange action colour.

---

## 5 · Breaking tiny patterns — the MAYA budget

From §1.4: structure conventional, **small** deviations inside it. The transcript's warning is that drastic
motion scares Friend 1 — so this is written as a **budget with a ceiling**, not a wishlist.

### 5.1 The hard motion rules (brief §2 — non-negotiable)

- Every transition **≤ 240ms**, easing `cubic-bezier(.22,.61,.36,1)`.
- Honour `prefers-reduced-motion`: **all decorative motion off**, functional transitions reduced to opacity.
- **No animation may delay first input.**
- No parallax on scroll-critical content.

### 5.2 The budget

**Ceiling: at most ONE signature pattern-break per viewport.** Two in view simultaneously stops reading as
craft and starts reading as a website showing off — which is the Friend-1 scare the transcript warns about.

| # | Break | Where | Friend 2 payoff |
|---|---|---|---|
| 1 | **Primary CTA press** — 2px settle + subtle mandarin bloom, `≤160ms` | Every primary button | The most-repeated moment in the product |
| 2 | **Card lift on hover/press** — `translateY(-2px)` + warm shadow `rgba(30,26,18,·)` | Service grid, vendor cards, story cards | Makes the grid feel touchable |
| 3 | **Number roll** — Space Mono figures count into place once on entry | Prices, guest counts, budget totals | Numbers *arrive* instead of appearing |
| 4 | **Delta reveal** — on a tier card, the additive rows cascade in at `~30ms` stagger under `Everything in … PLUS` | Archetype 5 only | Makes the grouping law *feel* like a reveal — §1.5 and §1.4 solved by one gesture |
| 5 | **Route cross-fade** — content region only; shell never blinks | Every logged-in route change | **The single biggest app-vs-website win in the whole brief** |
| 6 | **Sheet rise** — bottom sheet springs from the touch point | Every secondary action | Replaces a page load with a gesture |
| 7 | **Skeleton → content dissolve** — skeleton matches the real shape, then dissolves | All loading | Removes the white blink |
| 8 | **Gold underline draw** — active tab/section underline draws left-to-right | Sub-nav, active states | The only place gold moves |

### 5.3 The anti-list — never ship these

Page-load spinners over the whole viewport · scroll-jacking · parallax on anything a user must read ·
carousels that auto-advance · motion on the admin console (archetype 6 optimises for speed, not beauty) ·
**any animation whose absence would change what the user understands.**

---

## 6 · The logic layer

The owner listed "Logic" as its own item. It is the set of rules that must hold **regardless of which
screen is being designed** — the contract a designer cannot see by looking at one frame.

### 6.1 Content logic

| Rule | Consequence | Source |
|---|---|---|
| **Never hardcode a price in a design or a marketing page.** Reference the SKU; link to `/pricing`. | Every price in every mock is a **live catalog read**. A number typed into a mock is a defect. | Pricing lock; `project_setnayan_pricing_change_never_a_side_effect` |
| **A guard comparing two hand-typed things is not a guard.** | Prefer **generation** over assertion. Two hand-typed copies drift together and CI stays green. | `feedback_a_guard_comparing_two_hand_typed_things` |
| **Retired means deleted** — no tombstones, no "formerly known as" banners. | A retired SKU leaves no visual trace. ⚠️ The `lint-retired-strings` guard was **removed** (#3970) — nothing mechanically blocks a retired name returning to a live page. **Owner accepted; do not rebuild the guard, do not re-ask.** | `project_setnayan_retired_means_deleted` |
| **`is_active = false` ≠ retired**, and "filter the reader" is backwards — reject before resolvers. | An inactive SKU must be **absent**, not greyed out. `/pricing` already omits rather than renders. | `project_setnayan_catalog_is_active_gotcha` |
| **Brand is SETNAYAN, spelled in full**, never STNYN. Kicker: *Set na 'yan.* | — | Brand lock |
| **AI is "Setnayan AI."** Never name the model. | — | Public-surface hygiene lock |

### 6.2 Truth logic — the rules that make a screen honest

| Rule | Consequence |
|---|---|
| **🪤 An RLS denial and an empty read are the same value** — `count: 0`, no error. | **Any UI deriving state from a count must first prove the reader was permitted.** An empty state and a denied state must be **visually distinct frames** (§7.3). This is not theoretical: it printed *"no requests yet"* over 3 real pending rows. |
| **🪤 An empty array is truthy.** `eventTiles ? new Set(…) : null` treats `[]` as a real narrowing. | Second half of the same prod defect. Any "filter by the user's things" surface must distinguish *no filter* from *empty filter*. |
| **🪤 Two vocabularies that never match.** `vendor_profiles.services` speaks TILES; `booked_categories` speaks CATEGORIES. Intersecting them made all three specialization desks unreachable in prod. | Bridge with `lib/vendor-category-taxonomy.ts`. **Verifying the parts cannot find a defect that lives in the JOIN between two correct parts.** |
| **Verify the surface as the end user**, not as service-role. Run the real reads with `set local role authenticated` + jwt claims and diff. **Where they differ, the UI is lying.** | The acceptance test for every gated surface designed here. |
| **Prod is pre-launch-empty.** Paid-tier gates render *locked* for everyone right now. | The **empty/locked frames are the default experience today** — design them first, not last. |

### 6.3 Interaction logic — what makes it an app

| Property | Rule |
|---|---|
| **Persistent shell** | Chrome survives navigation; only the content region swaps. |
| **Route transitions** | Content cross-fades. **The app never blinks white.** |
| **Sheets over pages** | Secondary actions rise as sheets/drawers, not new URLs. |
| **Optimistic state** | Tap → UI moves **now**, reconciles after. Every optimistic action needs a **designed rollback frame**. |
| **Direct manipulation** | Drag, long-press, swipe, snap — not form-submit-reload. |
| **One primary per view** | Exactly **one** mandarin CTA visible at a time. Everything else is gold, ghost, or text. |

---

## 7 · The full frame inventory

The brief counts 12 screen archetypes. The owner asked for *"website, to pages, to popups (each frame)"* —
so this section adds the two dimensions the brief omits: **overlays** and **states**.

### 7.1 Layer A — the 12 screen archetypes (carried from brief §3, unchanged)

| # | Archetype | Governs | Replaces |
|---|---|---|---|
| 1 | **App shell** | all logged-in routes | full-page renders |
| 2 | **Command surface** (⌘K) | global | menu-hunting |
| 3 | **Roster** | guests, clients, team | table-of-people |
| 4 | **Ledger** | budget, earnings, receipts, disputes | table-of-money |
| 5 | **Comparison** | pricing, tiers, vendor compare | `build-compare.tsx`, `vendor-tier-matrix.tsx` |
| 6 | **Admin console table** | `admin/*` | — *(stays tabular, deliberately)* |
| 7 | **Editorial page** | marketing, help, blog | — |
| 8 | **Gallery** | Alaala, Papic | — |
| 9 | **Detail** | vendor, contract, guest, event | — |
| 10 | **Sheet** | every secondary action | modal-as-page |
| 11 | **Wizard** | onboarding, multi-step | — |
| 12 | **Empty & loading** | everywhere | white blink |

### 7.2 Layer B — overlay archetypes ⟵ *new; the brief has only #10*

55 files currently render a dialog, sheet or modal. They collapse into **8 overlay types**. Archetype 10
covers the first; the other 7 are additions this document contributes.

| # | Overlay | Trigger | Dismiss | Rules |
|---|---|---|---|---|
| B1 | **Bottom sheet** (mobile) / **side drawer** (desktop) | secondary action | swipe-down · backdrop · Esc | = archetype 10. The default for *everything*. |
| B2 | **Confirm dialog** | destructive only | explicit only — **no backdrop dismiss** | Names the object. Destructive button is **not** mandarin — mandarin means *go*. |
| B3 | **Toast / snackbar** | after an optimistic action | auto `4s` · swipe | Carries **Undo** where the action is reversible. Never the only place an error appears. |
| B4 | **Command palette** | ⌘K / search tap | Esc | = archetype 2 as an overlay. |
| B5 | **Lightbox** | gallery tap | swipe-down · Esc | Obsidian. Scrub, pinch, next/prev. Pairs with archetype 8. |
| B6 | **Picker** | date, guest, vendor, table selection | select · backdrop | Returns a value to a field, never navigates. |
| B7 | **Inline popover / tooltip** | ⓘ, truncated cell, status pill | outside click | **Never carries the only copy of load-bearing information.** |
| B8 | **Banner / inline notice** | consent, verification, degraded state | persistent or dismissed | Cookie consent, "secure your plan", pre-launch-empty explanations. |

### 7.3 Layer C — the state matrix ⟵ *new; disproportionately load-bearing today*

**Every archetype in Layer A must be designed in all six states.** Because prod is pre-launch-empty, states
2-4 are what most users see **right now** — they are the product, not the edge case.

| # | State | Design rule |
|---|---|---|
| C1 | **Ideal** | Realistic PH data. Filipino names, PHP figures, real event types. Never lorem ipsum. |
| C2 | **Loading** | Skeleton **matching the archetype's real shape**. Dissolve, never spin. |
| C3 | **Empty** | **Teaches, doesn't apologise.** Names the one action that fills it. |
| C4 | **Locked / gated** | The paid-tier state. Shows what is behind it and the one step to unlock. **Visually distinct from C3.** |
| C5 | **Denied** | ⚠️ **Must be distinct from C3.** *"You don't have access"* ≠ *"there's nothing here."* This distinction is the fix for the §6.2 prod defect. |
| C6 | **Error** | What broke, what survived, what to do. Never a bare stack trace or a shrug. |

### 7.4 Layer D — responsive

Two breakpoints per frame. **Mobile is the source artefact** (§2.1: ~64.9% mobile share, 98.6% smartphone
ownership), desktop is derived.

- **Mobile `390px`** — primary. Bottom nav, sheets, single column, scroll-snap comparison rows.
- **Desktop `1280px`** — derived. Rail nav, drawers, multi-column, comparison as a column grid.

---

## 8 · Interconnections — what the app does when a thing is picked

The owner asked specifically: *"how our app would respond when things are picked."* This is the response
contract. **It is not extra pixels — it is the rule that makes the pixels behave.**

### 8.1 The universal response ladder

Every pick, everywhere, runs the same four beats. If a surface skips a beat, that surface is the defect.

| Beat | Timing | What happens | Failure if skipped |
|---|---|---|---|
| **1 · Acknowledge** | `≤ 100ms` | The picked element visibly changes: gold border, filled tick, `translateY(-2px)`. **Before any network call.** | Reads as broken; user taps twice |
| **2 · Commit optimistically** | immediate | Dependent UI updates **now** — totals, counts, the CTA label | Reads as a website waiting on a server |
| **3 · Reconcile** | on response | Silent on success. On failure: **revert the visible change** + toast (B3) naming what was undone | Silent divergence — the worst outcome |
| **4 · Reveal consequence** | `≤ 240ms` after beat 2 | Anything newly relevant animates in; anything now irrelevant animates out | Consequence unnoticed → decision unmade |

### 8.2 The ten canonical flows

Each is a **storyboard** (a strip of frames + the rules between them), not a new screen.

| # | The pick | The response chain |
|---|---|---|
| F1 | **Event type** (wedding · debut · binyag · simple event) | Chip fills gold → the whole downstream vocabulary re-keys (categories, checklist, schedule) → available services re-filter. 🪤 **16 event types exist, not 9** — the nine-item `EVENT_TYPES_FALLBACK` is a *silent* fallback; the picker must read `event_type_vocab`. |
| F2 | **Billing period toggle** (28-day ↔ annual) | Toggle slides → **every** price on the surface number-rolls (§5.2 #3) → savings pill appears on the annual side. Above the cards, per the screenshot. |
| F3 | **Tier card** | Card inverts to the saturated fill → its delta rows cascade (§5.2 #4) → the CTA below adopts that tier's label. The **other** card does not grey out — it stays the reference point. |
| F4 | **Add-on SKU** | Row ticks → running total in Space Mono rolls → the group subhead shows an "n selected" count → sticky footer summary rises. Ledger archetype (4) rules apply. |
| F5 | **Vendor from `/explore`** | Card lifts → detail opens as a **sheet** (B1), not a route → shortlist button optimistically fills → toast with Undo. ⚠️ **Hybrid anonymity holds** — Free/Verified vendor names stay hidden until first chat reply. |
| F6 | **Guest / table in seat plan** | Direct manipulation, already the deepest-built subsystem. **Auto-save-on-exit is owner-locked.** One room, three projections: List = manage · 2D = blueprint · 3D = rendered. **Do not redesign — extend.** |
| F7 | **Photo in the gallery** | Tap → lightbox (B5) → swipe-down dismisses to the **same scroll position**. Obsidian. |
| F8 | **Wizard step** | One decision per screen → progress advances → **back is always available and lossless**. |
| F9 | **A gated / paid thing** | Reveals **C4 (locked)**, never C3 (empty) and never a dead end. Names what's behind it + the one step. |
| F10 | **A thing the user cannot read** | **C5 (denied)** — explicitly not C3. Requires the surface to prove the reader was permitted before deriving state from a count (§6.2). |

### 8.3 The interconnection acceptance test

A flow is done when — and only when — this holds:

> Run the surface's real reads **as the end user's identity** (`set local role authenticated` + jwt claims),
> and diff against the same reads as service-role. **Where they differ, the UI is lying.**

Eight PRs shipped the Song Desk with every DB object verified, and the desk was **unreachable in prod the
entire time** — because the defect lived in the join between two individually-correct parts (§6.2).
Per-part verification cannot catch it. **This test is the gate.**

---

## 9 · How many designs — the count

### 9.1 Design **files** to produce (the Claude Design deliverable)

Per brief §6, the output contract is **one self-contained HTML file per archetype**, all CSS/fonts/images
inlined, real copy, real token values. Each file carries its states and both breakpoints **inline** — that
is what makes the count tractable.

⚠️ **Amended from brief §6: ONE theme per file, not two.** The app is light-only (§3.1 correction). Ask for
a light rendering of every archetype; draw the obsidian surfaces (Alaala, gallery) dark **because those
surfaces are dark**, not because a toggle exists. This roughly halves the work inside each file.

| Layer | Files | What each contains |
|---|---|---|
| **A · Screen archetypes** | **12** | Mobile + desktop + all 6 states (§7.3), one theme, in one file |
| **B · Overlay archetypes** | **7** | B1 ships inside archetype 10; B2-B8 are 7 additional files |
| **Foundations** | **3** | Token sheet · motion sheet (the 8 breaks of §5.2) · icon + service-grid sheet |
| **D · Flow storyboards** | **10** | F1-F10 as frame strips + the response rules between them |
| **TOTAL** | **32 files** | |

### 9.2 What those 32 files cover

| Covered | Count | Source |
|---|---|---|
| Routes | **401** (126 couple · 108 admin · 104 public · 63 vendor) | `find apps/web/app -name page.tsx` @ `cf4c0f127` |
| Overlay call sites | **~55** | `grep -rln 'role="dialog"\|<Sheet\|Dialog\b'` |
| `<table>` files retired or kept-and-restyled | **45** (33 admin → archetype 6 · 12 customer-facing → archetypes 3/4/5) | `grep -rln "<table"` |

**Compression ratio ≈ 14:1** (456 surfaces → 32 files). That ratio is the entire reason this is a
tractable job, and it is why **the unit of work is the archetype, never the screen.**

### 9.3 Frame count, for scheduling only

If every state × breakpoint were counted as a distinct frame: `12 archetypes × 6 states × 2 breakpoints =
144`, plus `7 overlays × 2 = 14`, plus ~40 storyboard frames ≈ **~198 frames** — **one theme only**, per
the §3.1 correction. *(The brief's dual-theme assumption would have doubled this to ~396. It is wrong; the
app is light-locked.)* **Do not commission 198 frames.** Commission **32 files**; the frames live inside
them. The number is here only so the owner can size the effort honestly.

### 9.4 Explicitly out of scope

- **`/` homepage** — ELN cinematic reskin, owner-approved 2026-06-29. Redesigning it re-draws a working
  screen (repo `CLAUDE.md` Rule 0).
- **Guest event sites `/[slug]`** — the couple-chosen theme system stays untouched; separate design track
  (`project_setnayan_premium_guest_site_design`).
- **Seat plan 2D/3D** — the most-built subsystem in the product. Extend, never redraw.
- **The four-surface couple home** (PR #3240) — re-skin, do not re-conceive.
- **Merkado inner components** — their own locked system.

---

## 10 · Build order

Carried from brief §7, with this document's additions folded in.

| Phase | Deliverable | Why here |
|---|---|---|
| **0** | **Foundations (3 files)** + the **cheap token flip** — point `mulberry` at mandarin, leave `terracotta` gold | 239 CTA files turn orange with **zero component edits** (§3.1). Highest ratio of visible change to risk in the entire programme. |
| **1** | Archetypes **1, 2, 10, 12** + overlays **B2, B3** | Nothing else can land without the shell. Archetype 12 first because **prod is pre-launch-empty** — the empty/locked/denied states are today's actual product. |
| **2** | Archetype **5** + flows **F2, F3, F4** | The screenshot, executed. Renders a decision **already made in data** on 2026-07-01 (`vendor-benefits.ts`). Lowest-novelty, highest-clarity win. |
| **3** | Couple dashboard — archetypes **3, 4, 8** + flows **F1, F5, F7, F9, F10** | The paying customer. |
| **4** | Public marketing — archetypes **7, 9** + overlays **B5, B8**. **`/` untouched.** | Acquisition-visible. |
| **5** | Vendor dashboard — extend the 2026-07-01 prototypes. | Retention; prototypes already exist. |
| **6** | Admin console — archetype **6** only. | Internal-only, zero customer impact. **Ships last.** |
| **⏸ Deferred** | The **expensive** surface split: 396 `bg-cream` + 337 hardcoded `bg-white` (§3.1) | Grey-page/white-card two-tone. Owner decision on whether to pay for it at all, or accept white-page + white-card with borders. |

**Port path (brief §6):** `import-claude-design-from-url` (Vercel MCP) pulls the bundle in for preview →
Claude Code ports each archetype into `apps/web` **behind a flag** → surfaces migrate archetype-by-archetype.
**Never big-bang.**

---

## 11 · Open flags for the owner

Decisions this document surfaces but does **not** make.

1. **Grey page, or stay white?** *(Merged 2026-08-01 — this was written as two flags. It is one question,
   and the second half was a false alarm. Corrected below.)*

   Grey page + white cards is PH pattern #1 (§2.3) and the surface half of the owner's Facebook reference.
   It costs an audit of **396 `bg-cream` + 337 hardcoded `bg-white`** files, because `paper` is aliased to
   `cream` in `tailwind.config.ts` — page and card are one token. The cheap alternative: keep the white
   page and separate cards with a hairline border.

   ⚠️ **The "a Facebook palette already shipped and was retired" caution was overstated — disregard it.**
   `globals.css:110-114` records that the **2026-05-22** palette was `light=#FFFFFF` + **blue `#1877F2`**,
   retired 2026-05-30. **What died was the blue.** The white page survived and is still what ships today
   (`--color-cream: 255 255 255`). Since the current direction is **mandarin, not blue**, that history
   warns against nothing here.

   *Recommendation: defer the grey to Phase ⏸ and ship the CTA colour first — the orange carries most of
   the perceived change on its own, at zero component cost.*

2. **Light-only is now assumed (§3.1 correction).** Re-enabling light/dark/auto is a small revert of
   `theme-provider.tsx` + the `layout.tsx` bootstrap — but it is an **owner decision**, and the redesign
   does not assume it. Say so if dark should come back; it roughly doubles the drawing work.

3. **`/` stays excluded?** This document assumes yes (brief §8). Including it means discarding the ELN
   reskin approved 2026-06-29.
3. **Live Studio pillar (04)** promises broadcast while the Google Cloud Identity account is suspended
   (appeal `73857927`). A pillar-dock redesign is the natural moment to demote it. **Still undecided.**
4. **Route transitions require a client-side shell** — the one *architectural*, not cosmetic, change in the
   whole programme. It changes how logged-in surfaces render.
5. **Two SEO owner-actions block measurement, not design** (§4.3): the GSC/Bing verification tokens
   (`seo_metrics` has 0 rows ever) and the empty `sameAs`. No design dependency — but no design's effect
   is measurable until they land.

---

## 12 · References

**Supplied by the owner (2026-08-01)**
- `~/Downloads/[English (auto-generated)] The Psychology of a PERFECT Website [DownSub.com].txt` — 222 lines. Line refs throughout §1.
- Annotated pricing-tier screenshot (Basic / Diamond, `Everything in Basic PLUS:` circled, additive column bracketed). §1.6.

**Corpus — read these before executing**
- [`Claude_Design_Brief_2026-07-31.md`](Claude_Design_Brief_2026-07-31.md) — **the parent contract.** 12 archetypes, palette supersede, per-surface notes, output contract, port path.
- [`Website_Master_Plan_2026-06-28.md`](Website_Master_Plan_2026-06-28.md) — IA, doorway system, funnel, SEO/GEO, locks-as-design-rules.
- [`Website_Copy_2026-06-29.md`](Website_Copy_2026-06-29.md) · [`Homepage_Reskin_Handoff_2026-06-29.md`](Homepage_Reskin_Handoff_2026-06-29.md) · [`Pillar_Positioning_Copy_2026-06-30.md`](Pillar_Positioning_Copy_2026-06-30.md)
- `Design_Reskin_Atelier_Glass_2026-07-12/handoff/` — tokens, animations, UI kit. Palette superseded 2026-07-31; **typography and hard rules stand.**
- `AS_BUILT_GROUND_TRUTH_2026-06-07.md` — source-of-truth order.
- `prototypes/` + `03_Strategy/*.html` — 18 HTML prototypes. **Every shipped redesign was ported from one of these.**
- `DECISION_LOG.md` — append new rows at the bottom, in date order.

**Code — verified at `origin/main` `cf4c0f127`, 2026-08-01**
- `apps/web/app/_components/home/vendor-benefits.ts:3-4,121,140,168` — the shipped delta pattern
- `apps/web/app/pricing/page.tsx:114-190,667,690-721` — `ADDON_GROUPS`, the shipped chunking
- `apps/web/app/globals.css:110-114,118-143` — retired FB palette note; live token values
- `apps/web/tailwind.config.ts` — `paper` aliased to `cream` (the two-tone blocker)
- `apps/web/app/_components/nav/` · `_components/sheet.tsx` · `app-init-splash.tsx` — unused shell primitives
- `lib/vendor-category-taxonomy.ts` — the tile↔category bridge (§6.2)

**Market research — 2026-08-01**
- [Top Websites Ranking in Philippines — Similarweb](https://www.similarweb.com/top-websites/philippines/)
- [Top Ecommerce & Shopping Websites in Philippines — Similarweb](https://www.similarweb.com/top-websites/philippines/e-commerce-and-shopping/)
- [Most Visited Websites in the Philippines — Semrush](https://www.semrush.com/trending-websites/ph/all)
- [INQUIRER.net most visited PH news site — Inquirer/Similarweb](https://newsinfo.inquirer.net/2199534/inquirer-net-still-top-most-visited-ph-news-site-in-february)
- [Digital 2026: The Philippines — DataReportal](https://datareportal.com/reports/digital-2026-philippines)
- [Digital in the Philippines — DataReportal](https://datareportal.com/digital-in-the-philippines)
- [Mobile Internet Usage by Country 2026 — TechnologyChecker](https://technologychecker.io/blog/mobile-internet-usage-by-country)
- [Top 5 UX Principles for Super App UI Design — ProCreator](https://procreator.design/blog/super-app-ui-principles-from-top-global-app/)
- [How Super Apps Are Building the Next Era of Ecommerce — ProCreator](https://procreator.design/blog/how-super-apps-build-next-era-of-ecommerce/)
- [UI/UX Audit: Shopee vs Lazada — Snappymob](https://blog.snappymob.com/ui-ux-audit-shopee-vs-lazada)
- [Shopee Color Codes — BrandPalettes](https://brandpalettes.com/shopee-color-codes/)
- [Lazada brand assets — Brandfetch](https://brandfetch.com/lazada.com)
- [GCash brand assets — Brandfetch](https://brandfetch.com/gcash.com)
- [GCash: Designing the Future of Money — Serious Studio](https://serious-studio.com/project/gcash-technology-finance-branding-design)
- [GCash Unveils New App Design — Adobotech](https://www.adobotech.net/2024/09/gcash-unveils-new-app-design.html)

**Locks this document must not break**
Typography (Hanken Grotesk + Space Mono) · SETNAYAN spelled in full · no hardcoded prices in marketing ·
"Setnayan AI", never the model name · single shared nav · consent/spoiler-safe imagery ·
no rendered-video promises · vendor hybrid anonymity · retired-means-deleted · `/` excluded ·
guest event sites excluded.

---

*Foundation compiled 2026-08-01. Verified against `origin/main` `cf4c0f127`. Parent contract:
`Claude_Design_Brief_2026-07-31.md`. No screens invented; all 12 screen archetypes are the brief's own.*
