# FABLE build spec — Public + Marketplace group (frames 4a–4g · 5a–5c) · Warm Editorial Archive

> **Date:** 2026-08-08 · **Author:** Fable (design pass; Opus implements)
> **Binding rule (owner, verbatim):** *"do not just replace it. integrate it well."*
> **Sibling spec:** `FABLE_Event_Overview_Spec_2026-08-08.md` — § 2.1 there is the shared card
> recipe; this spec reuses it by reference and never restates it.
> **Sources read in full or mapped by line:** this bundle's `README.md`, `INTEGRATION_RULES.md`,
> `OPEN_QUESTIONS_ANSWERED_2026-08-08.md`, frames 4a–4g + 5a–5c of
> `Shell_all_frames_2026-08-08.html` with their captions, and the SHIPPED code @ `origin/main`
> `af8c84e26` (read from a detached worktree, not the stale shared checkout):
> `app/u/[userSlug]/page.tsx` (814) · `app/u/[userSlug]/c/[chapterId]/page.tsx` ·
> `app/u/_components/*` · `lib/public-profile.ts` · `lib/creator-*.ts` · `lib/storytellers.ts` ·
> `app/realstories/page.tsx` + `_components/{gallery,stories-search,storytellers-shelf}.tsx` ·
> `app/_components/{storyteller-tile,vendor-credit-chip}.tsx` · `app/blog/page.tsx` +
> `blog/[slug]/page.tsx` + `journal-partner-credit.tsx` · `lib/blog.ts` (types) ·
> `app/v/[slug]/page.tsx` (3,787 — full structural map) + its `_components` ·
> `app/[slug]/page.tsx` dispatch + `sitemap-vendors.xml` · `app/explore/page.tsx` (4,210 — full
> structural map) + all 17 `_components` + `explore/compare/page.tsx` + `explore/actions.ts` ·
> `app/dashboard/[eventId]/vendors/` + `budget/` trees (structural) · `app/creators/page.tsx` ·
> `globals.css` token blocks · `tailwind.config.ts` · `next.config.ts` redirects.
>
> **What this spec is:** a widget-by-widget DELTA — keep / restyle / extend / new — against the
> pages that ship. **"Keep — change nothing" is a verified verdict, not an omission**, and on the
> vendor shop it is the majority verdict on purpose. Every branch the frames do not draw is
> inventoried in § 4 and must survive (INTEGRATION_RULES rules 1–3).

---

## ⚠ The traps the implementer must hold in mind throughout

1. **Token naming.** `--color-terracotta` holds **GOLD** (`169 131 75` → `#A9834B`); the rust CTA
   is `--color-mulberry` (`194 78 37` → `#C24E25`), consumed as `rgb(var(--color-mulberry))` /
   `bg-mulberry`. ⚠ `tailwind.config.ts`'s prose comments claim "Champagne Gold #C5A059" and
   "mulberry #5C2542" — **those comments are stale**; the `:root` values in `globals.css:138–166`
   are the authority. Never name a token you have not verified — a phantom CSS var renders with
   no background at all.
2. **The one-Inquire-button guard is source-text-sensitive.**
   `app/v/[slug]/one-inquire-button.test.ts` asserts (a) **exactly 3** standalone `Inquire`
   labels in `page.tsx` (a 4th fails; a rename to 0 also fails), (b) the literal sequence
   `{cinematicHero ? null : (` + newline + 18 spaces + `<a href="#get-in-touch"` — the guard,
   the `<a>`, and `href` as first attribute are load-bearing **verbatim, indentation included**,
   and (c) `<ShareButton` within 900 chars after that guard closes. A restyle that reformats
   this block breaks CI. **Corollary: the frame's "Ask about your date" label is a rename this
   pass must NOT make** — tests stay green untouched (rule 5); the rename is an owner copy
   decision that travels with its own guard update.
3. **No `loading.tsx` may be added to either vendor route.**
   `app/[slug]/_lib/first-byte.test.ts:90–111` hard-asserts its absence — a streaming shell
   commits HTTP 200 before `notFound()`, re-creating the soft-404 fixed on 2026-08-08. Same for
   the `[slug]` twin. No skeleton, ever, on these routes.
4. **Both vendor routes render ONE body.** `renderVendorBySlug` (`app/v/[slug]/page.tsx:726`)
   is called by its own route's 3-line default export AND by `app/[slug]/page.tsx:219/:226`.
   Edit the function once; both URLs inherit. There is no second page to restyle.
5. **The vendor accent indirection must survive.** `micrositeAccentVars(microsite.accent)` is
   applied as inline `style` on the `<article>` (`:1809`) so Solo+ vendors retint the accent
   ramp. Restyle through the CSS variables, never hardcode the ramp, or paid accents break
   silently.
6. **Running the shop/slug tests: quote the path.** `npx tsx --test "app/v/[slug]/…"` — unquoted,
   zsh treats `[slug]` as a character class, runs NOTHING and exits green (`# tests 0 · # fail 0`).
7. **Supabase resolves `{ error }`, it never throws**, and every loader in these trees degrades
   to `[]`/`null` on failure by design. A restyle that drops one of those catch-paths turns a DB
   hiccup into a blank public page.

---

## § 0 — STALE INSERT POINTS in the handoff (read before opening any file)

The handoff names four targets wrongly for this group. An engineer following the stale path
builds a second copy of a page that already ships — the paid-twice mistake.

| # | The handoff / frame says | What actually ships | Proof |
|---|---|---|---|
| S1 | Frames 4a/4c target `app/creators/` | **The storyteller page ships at `app/u/[userSlug]/page.tsx`** (chapter detail at `app/u/[userSlug]/c/[chapterId]/page.tsx`). `app/creators/page.tsx` is the static **marketing pitch page** for the storyteller program ("Everywhere else, they watch. Here, they book.") — no DB reads, lists no creators. Restyling `creators/` would leave the real page untouched | `u/[userSlug]/page.tsx:23–52` docblock; `creators/page.tsx` header comment |
| S2 | Frame 4e/4f URL is `setnayan.com/stories` | **`/stories` does not exist.** The hub is **`/realstories`**; `/storytellers` is a 302 to `/realstories#storytellers` | `next.config.ts:445`; `app/` has no `stories/` dir |
| S3 | Frame 4g URL is `setnayan.com/realstories/tita-seating-problem` | **The Journal article ships at `/blog/[slug]`.** `/realstories/[slug]` is a different surface (the consented editorial showcase / curated samples, reusing the owner-excluded `/[slug]` editorial engine). Building 4g under `realstories/` would fork the Journal | `app/blog/[slug]/page.tsx`; `app/realstories/[slug]/page.tsx:1–16` |
| S4 | Frames 4b/4d target `app/v/[slug]/`; frame 4d's browser bar shows `/v/studioazul` | The tree is right but **the canonical vendor URL is the bare root `/{slug}`** — `alternates.canonical`, JSON-LD, review pager and the vendor sitemap all emit `${site}/${business_slug}`; `/v/[slug]` is a thin legacy wrapper over the same `renderVendorBySlug`. (Frame 4b's own "Find them" row shows `setnayan.com/studioazul` — the two frames disagree; the bare root wins.) One exception: the 3D booth route exists only under `/v/[slug]/booth` | `v/[slug]/page.tsx:424–426, 2779–2782`; `[slug]/page.tsx:219`; `sitemap-vendors.xml/route.ts:123` |
| S5 | Frame 5b implies one composed "Your plan" page | The plan is **flag-switched between two shipped compositions** — legacy `PlanBudgetAccordion` (114 KB) vs `ServicesTakeover` (4 slots: Shortlist · Your team · Budget · Your plans), decided at `vendors/page.tsx:1517` — plus a separate `/budget` route. Both must survive a restyle | `vendors/page.tsx:1084, 1517, 1821` |
| S6 | (implied by 5a) a marketplace tab strip | **`explore/_components/mega-column-tabs.tsx` is dead code** — only its `FolderTab` *type* is imported; `IconTileFolderStrip` replaced it. A restyle unit pointed at it restyles a corpse | `explore/page.tsx:40` |
| S7 | "review carousel" as an explore page section | No page-level carousel exists — `ReviewCarousel` mounts **inside each vendor card** (`vendor-card.tsx:491`) | agent-verified grep |
| S8 | `logo_display_url` (this group's briefs elsewhere) | No such column — it is a derived local `logoDisplayUrl` resolved per-render from `logo_url` (`r2://` ref) with a swallow-to-null presign | `v/[slug]/page.tsx:381–403, 797` |

---

## § 1 — Frame → real route map

| Frame | Surface drawn | Real target | Verdict |
|---|---|---|---|
| 4a | Storyteller page, phone | `app/u/[userSlug]/page.tsx` | **SHIPS — restyle + 4 small extends** (§ 3.1). The frame's avatar, city/married line, and per-chapter credits-on-profile do NOT ship and are not derivable (§ 1b, § 6) |
| 4b | Vendor shop, phone | `renderVendorBySlug` (one body, both routes) | **SHIPS — RECONCILE ONLY.** Majority verdict per section: change nothing (§ 2.D). Frame's Verified chip = enhancement E1; frame's affirmative availability + socials row = rejected/parked (§ 1b) |
| 4c | Storyteller page, desktop | same as 4a | Restyle only; the "credits follow the playing chapter" split-view is **rejected as drawn** (§ 1b R6) |
| 4d | Vendor shop, desktop | same as 4b | The shipped `premiumLayout` 2-col grid + sticky rail already IS the desktop composition — keep |
| 4e | Stories browse, desktop | `app/realstories/page.tsx` | **SHIPS — restyle.** Two-voice shelf grammar (Chronicle ≠ StorytellerTile) is a council lock the frame's uniform grid would erase — kept. Journal-in-grid intent honored by E4's labelled rail instead |
| 4f | Stories browse, phone | same | Restyle; **the TikTok lane button is REJECTED — fake door** (§ 1b R1) |
| 4g | Journal article | `app/blog/[slug]/page.tsx` | **Already Warm Editorial — KEEP, change nothing** except two items (§ 2.C); the woven-in chapter embed is genuine NEW work, costed in § 3.4 |
| 5a | Marketplace browse, phone | `app/explore/page.tsx` (+ 17 components) | **SHIPS — restyle + 1 extend** (surface the buried sort). The AI ask-row and AI sort are **rejected as drawn** (§ 1b R2) |
| 5b | Plan builder | `app/dashboard/[eventId]/vendors/` + `budget/` | **SHIPS (two compositions) — reconcile.** Frame deltas that don't ship are findings, not builds (§ 2.E2) |
| 5c | Compare, 2-way | `app/explore/compare/page.tsx` | **SHIPS — restyle + 1 extend** (bottom CTA row). Cap of 2 is owner-locked and already enforced |

### § 1b — REJECTED AS DRAWN (fake doors + lock collisions), each with the honest alternative

| # | Frame element | Why rejected | Honest alternative |
|---|---|---|---|
| R1 | 4f **"▶ Watch as a lane — swipe like TikTok"** | **No lane surface exists anywhere** (`grep lane` hits only prose in `lib/storytellers.ts`). A button to nothing is a fake door — locks forbid it | Build nothing this pass. What would make it honest: an actual `/realstories/lane` player consuming featured chapters' embeds — schedulable new work with its own moderation/consent questions. Until that ships, the button does not render |
| R2 | 5a **"Ask Setnayan AI: …" autocomplete row** + **"Best for your day" AI sort chip** + "AI results always say why" | **No AI ranking participates in explore** — verified: the only "Setnayan AI" hits in the tree are a taxonomy label and two comments. Setnayan AI is deterministic and not wired here. Drawing an AI chip over a non-AI list is a false claim | E3: surface the REAL shipped sort (`most_reviews` default · `highest_rated` · `newest`) as visible chips. "Nearest" exists as an unwired lens (`lib/ranking-lenses.ts:250–306` `near`) — wiring it is behavior work, **parked** with that pointer |
| R3 | 4b/4d **Availability "Your date — 12 Dec 2026 · Open"** | Ships **negative-only**: the booked-out waitlist renders only when the date IS blocked (`v/[slug]/page.tsx:1485–1503`). An affirmative "Open" would claim more than the calendar knows — pool-scoped blocks deliberately don't trigger (`:1473–1476`), and outside jobs the vendor never logged are invisible. False "Open" on a wedding date is the worst possible lie | Keep the shipped posture: silence when not blocked, the waitlist card when blocked. If the owner wants affirmative availability it is a product call about what "Open" promises, not a restyle |
| R4 | 4b/4d **socials row (Instagram · Facebook · TikTok · YouTube)** | **No column stores vendor social handles** (verified: only Panood livestream `facebook_url` exists, unrelated). The two lookalikes — `gallery_video_links` link-out cards and synced IG media — already render inside Portfolio. "No new data stores" (INTEGRATION_RULES rule 4) makes this a finding | Parked: needs a schema column + vendor-dashboard editor + this render, as one scheduled unit. Do not fake it from `gallery_video_links` hosts |
| R5 | 4a avatar circle + "Quezon City · married Dec 2025" | `resolvePublicProfile` exposes no avatar and no city (`lib/public-profile.ts:40–48`); no `avatar_url` exists anywhere in `lib/` (the corpus notes "no avatar maker exists for anyone") | Keep the shipped identity: the name + `EventMonogram` marks on event cards. Subtitle stays the shipped mode-based line |
| R6 | 4c desktop "credits follow whichever chapter is playing" | Chapters play on their canonical `/u/…/c/…` page, where the credit machinery (GAP-3 linked/unlinked vendors, viewer promos, ratified disclosure) lives. Hoisting a player + credits onto the profile makes two homes for one credit system | Keep the split: profile = timeline + "Partnered with" strip; chapter page = player + credits. E5 gives the profile's latest chapter a poster card that LINKS there |
| R7 | 4a/4c credit rows carrying "from ₱48,000" | Cards on aggregation surfaces stay price-less (the hide-prices-on-cards lock's spirit; the shop page itself is where prices live, one tap away). Chapter substrate cards ship name+city only | Keep credits price-less everywhere off the shop page |
| R8 | 4e/4f duration pills ("4:12") | No duration is stored on chapters (thumb is YouTube-derived; duration is not) | Keep the shipped "▶ Watch" pill |
| R9 | 4e "Near you" chip | No geo on the stories pool; the city facet exists only inside the volume-gated search (`STORIES_SEARCH_MIN_POOL = 50`, gate currently closed) | Nothing now; the facet arrives with volume, already built |
| R10 | 5a per-card **Compare** button | No card-level compare ships; compare is reached via `CompareShortlistBanner` (pairs the two earliest saves) and a URL-only `?ids=` contract with no picker | Parked: a picker is real behavior work. Keep + restyle the shortlist banner (§ 3.6) |
| R11 | 4g desktop right-rail credits beside the prose | The shipped magazine reader is a single `max-w-3xl` column with credits AFTER the prose — reading measure + one home for credits. A rail duplicates the credit home and squeezes the measure | Keep single column. The embedded chapter (§ 3.4) inherits the frame's in-flow placement, which is the part of 4g that matters |

---

## § 2 — The pages, top to bottom (delta tables)

"Skin swap" = the sibling spec's § 2.1 recipe. Line numbers are from `origin/main` @ `af8c84e26`.

### 2.A — `/u/[userSlug]` (frames 4a/4c) + `/u/[userSlug]/c/[chapterId]`

| # | Block (shipped) | Verdict | What changes exactly |
|---|---|---|---|
| 0 | Gates: `resolvePublicProfile` → `notFound()`; `public_profile_enabled` dormant-404 with owner-preview carve-out (`:137–139`); 1-ongoing auto-redirect **unless creator** (`:171–173`) | keep | Nothing. These are the name-oracle protections; the frame cannot see them |
| 1 | Owner-preview banner (`:209–214`) | keep | Token pass via the shared kit only |
| 2 | Header: name h1 (`.m-serif` — **already resolves to Hanken Grotesk**: `--font-serif-marketing` aliases `--font-hanken`, `globals.css:33`) | restyle | Weight to 700, tracking −0.015em per kit; no font swap needed — the `.m-serif` class is a naming fossil, leave the class |
| 3 | `CreatorBadge` row (`hasChapters` only) | keep | — |
| 4 | Audience stats row: followers · views · inquiries-driven (+`CreatorTierChip`), each hiding at 0 (`:222–253`) | restyle + extend | Numerals → **Space Mono 700** (they currently inherit Hanken — the README's own rule applied). EXTEND: prepend a **"N chapters"** stat when `hasChapters` (`chapters.length`, already loaded — zero new reads). Order: chapters · followers · views · inquiries-driven |
| 5 | **`FollowButton`** — renders ONLY signed-in ∧ not-self; nothing until state resolves (`follow-button.tsx:20–49`) | **restyle — LOCK VIOLATION FIX (§ 3.0 G1)** | Gold fill `--m-orange` → **`rgb(var(--color-mulberry))` fill, cream `#FDFBF7` label**; hover `#B04722`; `data-following='1'` state → outlined: 1px `rgba(194,78,37,.30)` border, `#C24E25` text, transparent fill. Render gate untouched. EXTEND (copy only): the frame's helper line *"Following a storyteller is one-way — they publish on purpose."* as an 11.5px `#A09A8E` line **only when the button itself renders** |
| 6 | Gallery/stories event grid (`mode` 3-way + empty state `:265–312`) | restyle | Skin swap on `.uprof-card`; `EventMonogram` fallback kept; empty-state copy kept verbatim (already a written invitation) |
| 7 | `ChapterTimeline` — spine of dated cards (`:369–408`) | restyle + extend | Kind kicker already mono gold-700 — keep. Dates → "12 Dec 2026" (currently long-form `en-PH`). EXTEND E5: chapter numbering + latest-chapter poster card (§ 3.2) |
| 8 | `CreatorInfluence` "Partnered with" pills (`:414–439`) | keep | Hover border gold = accent, fine |
| 9 | Share + Report actions (gated `enabled && hasPublicContent`) | keep | — |
| 10 | Foot "Made with Setnayan" | restyle | To the mono-caps foot grammar the frame draws: Space Mono 11px, `#A09A8E`, letter-spacing 0.1em |

**Chapter detail page** (`/c/[chapterId]`): keep everything — gates, kicker, sandboxed
`ChapterEmbedFrame`, "Behind the chapter" substrate with the GAP-3 linked/unlinked vendor split,
viewer promo + **ratified disclosure copy verbatim** (owner paper-lock), share/report. Deltas:
`.uchap-vendor-book-cta` ink fill → **mulberry** (single-action-colour rule, § 3.0 G2); dates →
"12 Dec 2026"; numerals → Space Mono. Nothing else.

### 2.B — `/realstories` (frames 4e/4f)

| # | Block (shipped) | Verdict | What changes exactly |
|---|---|---|---|
| 1 | H1 "The front-page story of their life." + honest pre-launch samples copy branch (`hasRealStory`) | keep | Type tokens only. Both copy branches stay |
| 2 | Search input ("Search by name, city, milestone, theme…") | restyle | Field → the kit's 999-radius bordered field (frame 4f) |
| 3 | Event-type filter chips (derived from items — only types that exist) | restyle | Active chip `bg-ink text-white` → **gold-outline grammar**: 1.5px `#A9834B` border, `rgba(169,131,75,.08)` fill, `#8A6B39` 600 text (matches the shipped BottomNav gold-active vocabulary). Inactive: 1.5px `#EBE5D9` border, `#6E6A62`. **Never `text-white`** |
| 4 | Chronicle cascade (Cover → Most loved → Just published → Archive) with `VendorCreditChip` rails + "Watch the storyteller's cut" cross-chips | keep | Skin swap on tiles; the newspaper grammar is the editorial voice — the frame's uniform video grid does NOT replace it. "Live · 5s" pill: gold fill + pure white → scrim pill `rgba(44,42,41,.75)` + cream (matches every other media pill) (§ 3.0 G8) |
| 5 | `StorytellersShelf` "#storytellers" — self-gates to NOTHING at zero featured chapters | keep | `StorytellerTile` is already the frame's YouTube-card grammar (thumb + Watch pill + byline + views). Watch pill `text-white` → `text-cream`. The shelf's deny-by-default (owner Feature click) is untouched |
| 6 | Volume-gated `StoriesSearch` (mounts at pool ≥ 50; today inert) | keep | Its facet chips inherit the § 2.B.3 chip grammar so the gate opening lands styled. `bg-ink text-white` actives → same fix |
| 7 | — | **new (E4)** | **"From the Journal" rail** between the shelves and the closing CTA: 2–3 article cards from `lib/blog.ts` constants (zero DB — the article set is in-code), Cormorant headline + mono kicker `FROM THE JOURNAL`, linking to `/blog/[slug]`. This delivers frame 4e's "one publication" Journal chip honestly without merging two surfaces (§ 3.3) |
| 8 | Closing CTA band ("Start planning · free" `button-primary` + "Browse vendors") | keep | `button-primary` is already mulberry — change nothing |

### 2.C — `/blog` + `/blog/[slug]` (frame 4g) — **KEEP: already Warm Editorial**

Verified across the whole tree: `bg-cream` page, ink text, **mulberry-filled CTAs** (download
block, signup band), gold (`terracotta`) eyebrows/pull-quotes/markers, Cormorant via
`font-display` **only on headlines** (the Journal's allowed serif), mono kickers, day-first
dates. The index's immersive cover, Nuggets ink band, category grid, and the article's drop-cap
reader + `JournalPartnerCredit` all conform. **Change nothing**, except:

| # | Item | Verdict | Delta |
|---|---|---|---|
| C1 | Active category chips `border-terracotta bg-terracotta text-[#3a2c10]` (`blog/page.tsx:334, 347`) | restyle | Gold FILL on a control → gold-outline active grammar (§ 2.B.3). The only gold-fill in the tree |
| C2 | Article byline date renders "12 July 2026" (full month, `[slug]/page.tsx:33–44`) | restyle | 3-letter month → "12 Jul 2026" (one `MONTHS` const; the index already uses short months) |
| C3 | `JournalPartnerCredit` SPONSORED badge — neutral ink chip + footnote "Placements marked "Sponsored" are paid partnerships." | **keep — deliberately NOT the frame's treatment** | The frame decorates the sponsored row (gold tint + gold chip), making the PAID row prettier than organic credits — the wrong incentive for a disclosure. The shipped neutral chip + explicit footnote stays. The rule remains structural: `is_sponsored` → badge, free placements never |
| C4 | Embedded chapter block | **NEW** | § 3.4 — the one genuine build in the Journal |

The 7-day presign TTL on credit logos (`journal-partner-credit.tsx:52`) and the fail-soft
spotlight fetch are load-bearing — untouched.

### 2.D — Vendor shop, `renderVendorBySlug` (frames 4b/4d) — **RECONCILE ONLY**

The shipped page already IS the frame's composition: cover → identity → packages/pricing →
work → reviews → about → booth → find-them, on cream with mono eyebrows, bordered cards,
mulberry `button-primary` Inquire, Space Mono money. Per-section verdicts:

| # | Section (shipped, `page.tsx` line) | Verdict | Delta |
|---|---|---|---|
| D0 | Hard exits: not-found/hidden 404 · demo gate · unverified-404 with owner-preview (`:748–777`) · **no loading.tsx** | keep | **Change nothing** |
| D1 | Demo / Coming-soon banners (`:1811, :1816`) | keep | Change nothing |
| D2 | Hero cascade: cinematic (Enterprise) / plain banner (Pro+) / placeholder / none (`:1822–1877`) | keep | Change nothing — incl. the cream-filled cinematic Inquire (cream-on-photo is the one place cream-fill is right) |
| D3 | Identity block (`:1889–2094`): Logo + initials fallback, chips (tier · rating · favorites ≥ 3 · declared experience), contact row, action row, `VendorLocationMap`, `NavLinksRow` | restyle (2 items) + extend (E1, E2) | **(a)** h1 `font-serif italic` → **Hanken Grotesk 800, tracking −0.02em, no italic** — Cormorant is locked to `/[slug]` guest surfaces + Journal headlines; the shop page is neither, and frames 4b/4d draw the name in Hanken. **(b)** nothing else: chips, map (OSM embed + city-only label anonymity note), nav chips — change nothing |
| D4 | About (Solo+, `:2099`) | keep | Change nothing |
| D5 | Portfolio: photos + inline YT/Vimeo + "Watch on {platform}" link-outs + synced IG (`:2116–2232`) | keep | Change nothing (this is where the socials-lookalikes live — see R4) |
| D6 | "Featured in these stories" — editorials + `StorytellerTile` chapters, free at every tier (`:2243–2292`) | keep | Change nothing. **The frame's "Featured in 3 chapters" card = already shipped**, as a full section; E2 adds the identity-block pointer chip to it |
| D7 | Services offered · Details · Wedding compatibility (`:2294–2392`) | keep | Change nothing |
| D8 | Services & pricing + Typical price + Packages (`:2394–2467`) — **real peso prices render here**; the hide-prices lock is a CARD lock, and `hide_prices_publicly` is the vendor's own switch honored at 10+ sites | keep | Change nothing. Money is already Space Mono (`font-mono`) |
| D9 | Reviews (`:2473–2492`, always renders): trusted-vs-raw stat split, tier gates (Free → "Reviews unlock…" card), provenance pills, right-of-reply at every tier, "no review yet" invitation | keep + 1-line extend | **Change nothing** except E9: add `id="reviews"` to the section — the pager already links `#reviews` and the fragment is dead (`:3350–3359`) |
| D10 | Trusted by (`:2494`) | keep | Change nothing |
| D11 | Inquire / Not-yet-bookable section: both composers, 4-way viewer-identity copy, existing-thread "View thread", waitlist card (`:2498–2695`) | restyle (1 item) | **Waitlist join button `bg-terracotta text-cream` → `bg-mulberry text-cream`** (`:2677`, § 3.0 G4). Everything else byte-identical — labels, gates, `?wl=` states |
| D12 | Sticky desktop rail (`:2701–2759`) | keep | Change nothing |
| D13 | Footer "Powered by SETNAYAN · Set na 'yan" + Vendor ID (`:2762`) | keep | Change nothing |
| D14 | `venue-matched-events.tsx` — the one component on the `sn-*`/`--m-*` system mid-Reviews | restyle | Reconcile its classes to this page's `ink`/`cream` vocabulary (visual seam; styling-only) |
| D15 | Booth `SoftGate` raw-hex palette (`booth/page.tsx`) | restyle (low priority) | Tokens for hexes; copy + gates untouched |

### 2.E — Marketplace (frames 5a/5b/5c)

**E1 · `/explore`** — two modes in one file: CATALOG landing (hero + folder strip + category
tiles + inline vendor previews) and VENDOR GRID (sticky header + filters + cards + pagination),
switched by `browseMode`/filters at `page.tsx:1083`.

| # | Block (shipped) | Verdict | Delta |
|---|---|---|---|
| M1 | Search hero — "Everything for your day, in one search." + `TaxonomySearch` autocomplete (categories → `?category=`, Setnayan services in the same list, free text → `q=`, folder-scoped via hidden input) | keep | **The frame's search contract already ships** minus the AI row (R2). The hero is already on `--m-*` tokens — it is the style TARGET, not the debt |
| M2 | The seam below the hero: folder strip, category tiles, banners, drawer, cards all on the older `cream/ink/terracotta` grammar | restyle | Align to the § 2.1 recipe: card borders `#E1DCD1`, radius 14, mono eyebrows `#8A6B39`, chip re-map (§ 3.6). Same hexes mostly — this is grammar alignment, not recolor |
| M3 | Sort — ships ONLY as a `<select>` in the filter drawer (`most_reviews` default · `highest_rated` · `newest` · `name_asc`); unreachable on the catalog landing | **extend (E3)** | Surface as a visible chip row above the vendor grid, presentation over the existing `?sort=` param (§ 3.6). No new ranking; drawer keeps working. "Nearest"/AI: R2 |
| M4 | `VendorCard` — hero-image ladder → name via `resolveVendorDisplayName` → badges → relationship chip → activity chips → tagline → meta (city · distance-gated-on-both-ends · rating with `'new'` never 0★) → `ReviewCarousel` → Save → View | keep + extend (E10) | Card contract is LOCKED and already honored — verified: **no price for real vendors** (`page.tsx:2382–2388`), distance requires anchor ∧ both coords (`vendor-card.tsx:282–294`), `'new'` literal at `:473`. Skin-swap only. E10 adds the anonymity explainer line the frame draws (§ 3.6) |
| M5 | `CompareShortlistBanner` (≥ 2 saves) · `SaveVendorButton` (writes `event_vendors status='considering'`; a venue save re-grounds the distance anchor) | keep | Skin swap. This banner IS the compare door (R10) |
| M6 | Empty states (incl. `EventTypeNotifyForm`), off-season band, faith strip, availability banner, pagination | keep | Skin swap; the "Show all vendors" gold-filled action → mulberry (§ 3.0 G3) |

**E2 · Plan builder (5b)** — reconcile, both compositions:

| Frame element | Shipped reality | Verdict |
|---|---|---|
| Working-budget card (Target/Committed/Planned/Left + bar) | `BudgetSummaryStrip` = **3 tiles** (Target · Committed · Budget left→"Over target"); the bar lives in `MerkadoBudgetLens`. **No "Planned" tile ships** | keep 3-tile strip; skin swap. "Planned" is derivable from the shipped `BudgetAllocationPlanner` allocations — **flagged as an optional extend for the owner**, not built silently (it changes what a shipped number means) |
| Category list w/ status dots + amounts | `ShortlistCategories` folder→category accordion; status = text chips (`⚠ Nd overdue` / `Nd left`) + `N considering`; **amounts deliberately live on `/budget`**, only at `contracted`+ | keep the split. EXTEND E8: 8px status dots as presentation over EXISTING statuses (sage `#7A8B6F` = locked/contracted · gold `#A9834B` = considering/comparing · stone `#A09A8E` = nothing saved). No new state |
| "+ Add category" chips | Ships as a **remove-first** model (`excludeTileFromPlan`/`restoreTileToPlan` over the full taxonomy) + `ADD_TO_PLAN_HEADING` affordances | keep — the frame's additive chips describe the same mechanism; restyle the shipped affordances to the dashed-chip look |
| "Removing a category never deletes saved vendors" | True in code (saves persist in `event_vendors` + Library) | keep; adopt the frame's caption as helper copy if any copy site exists — do not add a new band |

**E3 · Compare (5c)** — `?ids=` URL contract, `MAX_COMPARE = 2` (owner-locked), verified-only
double-filter, `redirect('/explore')` under 2. All keep. Deltas: restyle the raw `<table>` into
the frame's bordered-card grid grammar (§ 3.7); keep ALL shipped rows — the frame omits Faith
compat · Verification · Save, **they stay**; demo-only Starts-at/Included rows keep their honest
"Real vendor · pricing on inquiry / ask for inclusions" cells. EXTEND E7: a bottom CTA row —
"Ask about your date" per column → `/{slug}#get-in-touch` (the composer anchor that ships).
Mulberry-filled, the frame's exact intent, zero new mechanism.

---

## § 3 — Per-widget visual specification

### 3.0 — CTA-colour inventory: every off-grammar action in these trees, by file

Remedy pattern (matches the fix already applied on the couple's dashboard): **filled action →
`rgb(var(--color-mulberry))` `#C24E25`, label cream `#FDFBF7`, hover `#B04722`; outlined action
→ 1px `rgba(194,78,37,.30)` border + `#C24E25` text + hover `bg-mulberry/10`. Gold stays on
eyebrows, bars, badges, tints, status — gold is UI, never an action.**

| # | File · site | Today | Becomes |
|---|---|---|---|
| G1 | `app/u/[userSlug]/page.tsx` `.uprof-follow` (CSS-in-file) | **GOLD-filled Follow** (`--m-orange` #A9834B, white label) | Mulberry fill, cream label; `data-following='1'` → mulberry outline |
| G2 | `app/u/[userSlug]/c/[chapterId]/page.tsx` `.uchap-vendor-book-cta` | INK-filled "Book through this chapter" | Mulberry fill, cream label (one action colour; ink surfaces are for the focal/nuggets, not buttons) |
| G3 | `app/explore/page.tsx:3100` "Show all vendors" | **GOLD-filled action** (`bg-terracotta … text-cream`) | `bg-mulberry hover:bg-mulberry-600` |
| G4 | `app/v/[slug]/page.tsx:2677` waitlist "Join the waitlist for this date" | **GOLD-filled action** | `bg-mulberry text-cream hover:bg-mulberry-600` |
| G5 | `app/explore/_components/sticky-marketplace-header.tsx:309` active filter chip | GOLD fill + cream label | Gold-outline active grammar (selected state, not an action): 1.5px `#A9834B` border · `rgba(169,131,75,.08)` fill · `#8A6B39` text |
| G6 | `app/blog/page.tsx:334, 347` active category chips | GOLD fill + `#3a2c10` | Same gold-outline active grammar (§ 2.C C1) |
| G7 | `app/explore/_components/category-tile.tsx:235` mono pill · `sticky-marketplace-header.tsx:277` count badge | GOLD fill + cream text (≈2.4:1 — illegible) | Tinted badge: `rgba(169,131,75,.12)` fill · `#8A6B39` text |
| G8 | `app/realstories/_components/gallery.tsx:242` "Live · 5s" pill | GOLD fill + **pure white** | Media-scrim pill: `rgba(44,42,41,.75)` fill · cream text (matches every other overlay pill) |
| G9 | Pure-white labels: `gallery.tsx` + `stories-search.tsx` active chips (`bg-ink text-white`), `storyteller-tile.tsx` Watch pill (`text-white`) | `text-white` | `text-cream` (`#FDFBF7`) — and the active chips move to G5's outline grammar anyway |
| — | `explore/_components/mega-column-tabs.tsx:171` gold-filled active pill | dead code (type-only import) | **No work** — do not restyle a corpse; flag for deletion in a housekeeping PR |

Verified NOT violations (leave alone): gold eyebrows/kickers everywhere · `uprof-tl-dot` gold
timeline dots · gold hover-borders on cards · `Logo` initials tile `bg-terracotta/15` ·
viewer-promo gold text · review stars · the vendor page's `button-primary`/`button-secondary`
(already mulberry/link).

### 3.1 — Storyteller header (frames 4a/4c)

Composition keeps the shipped centered layout (the frame's left-aligned avatar row depends on
an avatar that doesn't exist — R5). Deltas beyond § 2.A: stats numerals Space Mono 15px 700 ink,
labels 13px `#6E6A62`; the gold rule under the header stays (gold as UI); Follow per G1 with the
one-way microcopy under it. Desktop (4c): the shipped single-column centered profile stays —
the 2-col chapter/credits split is R6.

### 3.2 — Chapter timeline (E5): numbering + latest-chapter poster

- **Numbering (presentation-only):** kicker gains `CHAPTER {n}` where n = 1-based index in
  chronological (oldest-first) order — stable as new chapters append. Latest additionally reads
  `CHAPTER {n} · LATEST`. Space Mono 10–11px, `#8A6B39`, existing kind label follows it
  (`CHAPTER 3 · WEDDING · 12 Dec 2025 · 31k views`).
- **Poster card for the LATEST chapter only** (the frame's hero card): 16:9 thumb + centered
  play glyph (cream disc `rgba(253,251,247,.92)`, mulberry triangle) + `on {provider}` scrim
  pill (provider label ships: YouTube/Instagram/TikTok). Links to the canonical `/u/…/c/…`
  page — never an inline player (R6). **Requires a thumb on the profile's chapter read** —
  `StorytellerTileItem.thumbUrl` proves derivation exists for YouTube; whether
  `fetchPublishedChapters` already carries it is **not verified** (§ 6.1). If absent for a
  chapter (IG/TikTok embeds), the card renders the shipped text-card form — never a broken
  frame.
- Older chapters keep the shipped compact text cards (the frame's own 4a draws exactly this).

### 3.3 — Stories hub (frames 4e/4f) + the Journal rail (E4)

- Chip + field grammar per § 2.B. StorytellerTile: keep byline-first lock (badge + "A chapter
  by @slug"), views line; card border → `#E1DCD1`, radius 14–16.
- **E4 "From the Journal" rail:** section eyebrow `FROM THE JOURNAL` (mono, `#8A6B39`); 2–3
  cards: Cormorant 21px headline (the Journal's serif traveling WITH Journal content — the one
  serif exception on this page), meta "N min read · {category}", link `/blog/[slug]`. Source:
  `publishedBlogArticles()` from `lib/blog.ts` — in-code constants, zero DB, zero states beyond
  "fewer than 2 articles → rail hides".

### 3.4 — Journal embedded chapter (frame 4g) — NEW, costed honestly

**What it is:** a new `BlogBlock` variant in `lib/blog.ts` — `{ type: 'chapter', publicId,
note? }` — rendered in-flow by `blog/[slug]/page.tsx`'s `Block` switch where the prose cites it.

**Cost, stated for scheduling (not cheap, not huge):**
1. A content-model change: new union member + authoring convention in the in-code article set.
2. A resolver: look up ONE published chapter by `public_id` re-checking BOTH gates the chapter
   page enforces (chapter `status='published'` ∧ owner `public_profile_enabled`). The shipped
   `fetchPublishedChapterByPublicId(userId, publicId)` needs the owner id — the implementer adds
   a by-public-id variant in `lib/creator-public.ts` (same admin-client read + app-code filter
   pattern, same table). This is a lean read of shipped tables, allowed under "widgets read
   shipped sources" — flagging it because it is a new FUNCTION, not a new store.
3. Render: the frame's bordered card — `1.5px #A9834B` border (gold as frame, not button),
   radius 16; `ChapterEmbedFrame` (sandboxed, allowlisted — Setnayan never hosts the video);
   byline row: monogram-initial disc + "Chapter: {title}" + "{owner} · plays on {provider}" +
   "Open →" (`#3B4E67`) to the canonical `/u/…/c/…`.
4. States (§ 4.C): resolver returns null (unpublished since authoring, profile went dark, bad
   id) → **the block renders NOTHING** — the prose flows on, no empty shell, no error. ISR
   `revalidate = 3600` means a just-unpublished chapter can linger ≤ 1h — acceptable and stated.
5. The article's credit machinery is untouched — chapter credits do NOT auto-join
   `JournalPartnerCredit`; spotlights remain admin-authored.

### 3.5 — Vendor shop reconcile items

Only the § 2.D deltas: h1 → Hanken 800 (D3a) · waitlist button (G4) · `venue-matched-events`
seam (D14) · SoftGate tokens (D15) · `id="reviews"` (E9) · E1/E2 below. **Everything else on
the 3,787-line page: change nothing.**

- **E1 · "✓ Verified" identity chip** (frame 4b/4d; the corpus's own vendor-page audit lists
  "no Verified-by-Setnayan rendered" as a gap): chip `✓ Verified` — `rgba(59,78,103,.08)` fill,
  `#3B4E67` 700 text, radius 12 — in the identity chip row, **gated
  `vendor.verification_state === 'verified'`** so it stays truthful on owner-preview/demo
  renders of unverified shops. Honest by construction: every publicly reachable shop page IS
  verified (the `:769` gate), so strangers see the trust signal the gate already guarantees.
- **E2 · "Featured in N stories →" pointer chip** in the identity block, anchor-linking to the
  shipped section; count = `featuredEditorials.length + featuredChapterCredits.length`, renders
  only when the section itself will render (same gate — no fake door). Give the section an
  `id="featured-stories"`.

### 3.6 — Explore grid (frame 5a)

- **E3 sort chips:** row `Sort` (mono 9.5px caps `#8A857B`) + three chips — labels exactly the
  shipped `SORT_LABEL` strings ("Most reviews" · "Highest rated" · "Newest"; omit "Name (A→Z)"
  from chips, it stays in the drawer). Each chip is a link rewriting `?sort=` (resets `page=1`,
  preserves all other params — reuse `buildHref`). Active chip = G5 grammar. Vendor-grid mode
  only; the drawer's `<select>` stays in sync for free (same param).
- **E10 anonymity explainer:** on cards where the name is the screen-name placeholder (the
  suppression signal already computed at `vendor-card.tsx:359–364`), one 12px `#8A857B` line:
  *"Their business name appears once you're in conversation — new shops are judged by their
  work, not their reach."* (frame 5a's own copy). Renders ONLY when anonymized — never on
  revealed/verified names.
- Chip re-map + § 2.1 skin on: folder strip tiles, category tiles, banners, drawer, pagination.
  The `--m-*` hero island is the reference rendering — do not restyle IT to the old grammar.

### 3.7 — Compare (frame 5c)

Keep the 3-column `[88px 1fr 1fr]` grid; restyle: outer card `#EBE5D9` border radius 14,
label column cells `rgba(169,131,75,.04)` + `#8A857B` labels, row separators `#F2EDE2`,
distance value gold-700 when present, rating per card grammar ("new" mono, never 0★). Verified
chip cells keep `#3B4E67` tint. E7 CTA row per § 2.E3. The `redirect` guards and the
verified-only double filter are behavior — untouched.

---

## § 4 — Every state each touched surface must still render

### 4.A `/u/[userSlug]`
1. Unknown/reserved slug → 404 (name-oracle: neutral metadata, no name in `<title>`).
2. Profile disabled + stranger → 404; disabled + owner → preview banner + full render.
3. 1 ongoing event, no chapters → **redirect** into the event (no profile render at all).
4. ≥ 2 ongoing → gallery mode; 0 ongoing → stories mode; nothing public → "A Setnayan profile"
   heading + empty invitation, **no real name, no stats, no share/report**.
5. Creator (≥ 1 published chapter): never redirects; badge + timeline render; stats row shows.
6. Follow button: signed-out → nothing · self → nothing · unresolved → nothing (no flash) ·
   following → outlined state. The E-microcopy line follows the button's own gate.
7. `inquiriesDriven === 0` → line + tier chip absent (never "0 inquiries driven").
8. Every loader fails soft (`[]`) — a DB hiccup shows fewer sections, never an error page.

### 4.B `/realstories`
1. Zero real stories → sample tiles with per-card "Sample" badges + the honest header branch.
2. Zero featured chapters → the Storytellers shelf renders NOTHING, not a heading (owner's
   Feature click is the only door).
3. Pool < 50 → shelves; ≥ 50 → faceted search (both restyled — the gate must land styled).
4. Filter chips render only for event types present; search empty-result state kept.
5. Cross-rail chips (storyteller's cut / read the editorial) render only on a real join.
6. E4 rail: < 2 published articles → absent.

### 4.C `/blog/[slug]` chapter block (new)
1. Resolves published + public → card renders. 2. Any gate fails → block absent, prose intact.
3. Unknown block type in older readers — N/A (in-code render switch, same deploy).
4. `dynamicParams=false` + `revalidate=3600` unchanged; staleness window stated in § 3.4.
5. The article page itself: unknown slug → 404 (no loading boundary — soft-404-proof shape kept).

### 4.D Vendor shop — the § 2.D keep-verdicts double as the state inventory; the restyle
touches none of them. Load-bearing families (agent-mapped, all must survive byte-identical in
behavior): hard exits `:748–777` · coming-soon flips (banner, no contact, package CTA, heading,
no action row/rail) · `bookable` gates · tier ladder (`canPersonalizePage`/`premiumLayout`/
`cinematicHero`/review caps) · 4-way hero cascade · 15+ empty-data auto-hides · media
sub-branches · no-coords map null · no-logo initials + JSON-LD fallbacks · 4 viewer-identity
states driving composer choice + copy · `hidePricesPublicly` at 11 sites · 7 default-OFF flags
stay inert · schema-degradation fallbacks (legacy select, catch→`[]`/`null`, prices fail OPEN) ·
`?reviewsPage/?wl/?service/?ref_chapter/?src/?utm*` params.

### 4.E Explore + compare + plan
1. Bare `/explore` = hero + Popular + one "Browse all categories" link — the catalog is behind
   a tap (shipped IA; the restyle must not flatten it).
2. Card: distance hides without both ends · rating "new" at 0 (including tier-gated-to-0 — a
   Free vendor with real reviews reads "new"; working as owner-designed, noted not "fixed") ·
   no price row ever on real vendors · Save states (Save/Saving…/Saved · login bounce ·
   "Create an event first…").
3. E3 chips: active reflects `?sort=`; default state = "Most reviews"; chips absent in catalog
   mode and focused mode (where the sticky header hides).
4. E10 line: only while anonymized; disappears on reveal/verification.
5. Compare: < 2 valid ids or < 2 verified survivors → redirect (never a 1-column table).
6. Plan: both flag compositions render post-restyle; `N considering` appears only once picks
   exist ("no NOT-STARTED noise" rule); dots (E8) map only the three existing states.

---

## § 5 — Fable's enhancements (why each earns a stranger's trust)

These pages are what ~150 guests per wedding and every browsing couple judge Setnayan by.
Ranked by first-impression value per unit of risk:

- **E1 · Verified chip on the shop identity** (§ 3.5). The single strongest trust signal the
  page can add, and it asserts only what the route's own 404-gate already guarantees.
- **E2 · "Featured in N stories →" pointer** (§ 3.5). Third-party proof (real couples' films)
  surfaced at the moment of first impression, one anchor tap from the evidence. Closes the
  4a↔4b loop the deliverable-4 intro calls "the one seam".
- **E3 · Visible sort chips on explore** (§ 3.6). The shipped sort is real but buried in a
  drawer; on a phone, one thumb-row of chips is the difference between "a list" and "a
  marketplace I can steer". No new ranking — presentation over `?sort=`.
- **E10 · Anonymity explainer on anonymized cards** (§ 3.6). Hybrid anonymity currently looks
  like a glitch ("Cavite Wedding Caterer #2117"); one sentence turns the oddity into a fairness
  story — the frame's own copy, rendered only when true.
- **E4 · Journal rail on `/realstories`** (§ 3.3). The frame's "one publication" idea delivered
  with in-code constants: serif headlines signal editorial care on the emptiest high-traffic
  page, at zero data cost, without blurring the two-voice lock.
- **E5 · Chapter numbering + latest-poster** (§ 3.2). Makes a profile read as a *continuing
  series* (the product's story) instead of a list — presentation over shipped data, with the
  thumb caveat flagged.
- **E7 · Compare bottom CTA row** (§ 3.7). Compare currently dead-ends at Save; the decision
  moment deserves the inquiry door both frames draw — via the shipped composer anchor.
- **E8 · Plan status dots** (§ 2.E2). The frame's at-a-glance vocabulary over the three
  statuses that already exist.
- **E9 · `id="reviews"`** (§ 2.D9). A shipped link that scrolls nowhere, fixed with one
  attribute.
- **E6 · Follow one-way microcopy + "N chapters" stat** (§ 2.A). Publishing-on-purpose is the
  privacy story guests' relatives need to hear at the exact moment they hit Follow.

**Deliberately NOT enhanced:** everything in § 1b (lane, AI ask/sort, affirmative availability,
socials, per-card compare, avatar identity, credit prices, 4g rail) · the "Ask about your date"
rename (guard-owned, trap 2) · a mobile sticky inquire bar (capped by the same 3-Inquire guard;
park with the rename) · the Free-tier "new" rating tension (owner's tier design, not a defect) ·
the sponsored-row decoration (would reward the paid row — § 2.C C3).

---

## § 6 — Could not verify / not stated (do not invent during build)

1. **`fetchPublishedChapters` thumb field** — whether the profile read already carries
   `thumbUrl` (the featured loader does). E5's poster degrades to the text card if absent.
2. **Chapter durations** — not stored (checked `lib/storytellers.ts` shape; migrations not
   exhaustively swept). R8 stands regardless.
3. **Any `users` city/tagline column** for a profile subtitle — absent from
   `resolvePublicProfile`'s select; migrations not exhaustively swept. R5 stands on the
   resolver's contract either way.
4. **A "Planned" figure's summation semantics** from `BudgetAllocationPlanner` allocations —
   the planner ships; whether allocations sum cleanly into a fourth strip tile is unread
   (§ 2.E2 flags it to the owner instead of building).
5. **`NEXT_PUBLIC_SERVICE_DETAILS_ENABLED` prod state** — the details sheet + per-card
   "Inquire about this" stay dark until the owner's pending flip; the restyle must keep the
   flag-off RSC payload byte-identical (`service-details-dark.test.ts`).
6. **The explore hero's "Walk through a real wedding →" destination** — not followed; restyle
   the link, don't rewire it.
7. **`?src=` allow-list** — known values `editorial|favorites|explore|search`; E7's compare CTA
   links plainly (no invented `src=compare`).
8. **`/realstories/[slug]` internals** beyond its header — out of this group's frames; its
   Chronicle detail restyle is not specified here.
9. **Prod visual QA** — nothing in this spec has been seen on a real phone; the owner-looking
   pass beats every check here (house rule).

---

## § 7 — Build order (restyles before extends before new — INTEGRATION_RULES rule 6)

1. **Unit A (restyle · the lock fixes):** § 3.0 G1–G9 CTA/chip/label inventory across all five
   trees. Pure class/CSS swaps; zero behavior. Run the mechanical check — expect ~flat lines,
   zero removed conditionals. ⚠ G4 sits 400 lines from the one-Inquire guard block — do not
   let a formatter touch `page.tsx:2052–2074`.
2. **Unit B (restyle · storyteller + stories + journal):** § 2.A/2.B skins, dates, Space Mono
   numerals, § 2.C C1–C2. Journal otherwise untouched.
3. **Unit C (restyle · shop + marketplace seams):** D3a h1 · D14 venue-matched-events · D15
   SoftGate · § 3.6 explore grammar pass · § 3.7 compare regrammar. The shop diff outside
   these items should be EMPTY.
4. **Unit D (extends):** E1 · E2 · E3 · E5 · E6 · E7 · E8 · E9 · E10. Each adds a branch;
   each branch appears in § 4.
5. **Unit E (new):** § 3.4 Journal chapter block (model + resolver + render + states).
6. **Parked pending owner:** everything in § 1b's alternative column marked parked · the
   Inquire rename + mobile sticky bar (travel together with the guard update) · the Planned
   tile (§ 6.4) · socials schema (R4).

Per-unit gates: `npx tsc --noEmit` · `TZ=Asia/Manila` (and the other three house zones) test
runs · **quoted** `[slug]` paths · `one-inquire-button.test.ts` + `first-byte.test.ts` +
`service-details-dark.test.ts` green UNTOUCHED. If any of those three needs editing, the change
was not a restyle — stop and re-read INTEGRATION_RULES.
