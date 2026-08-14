# Event Studio Replot — Council Verdict · 2026-07-17

> Council of 4 independent perspectives (monetization · journey · IA · retail psychology), each adversarially cross-examined, synthesized by a chair. Question from the owner: *"Show FREE services first? Then FREE with upgrades? Then only paid upgrades? Or what is your strategy?"*
> Prototype: Claude artifact `council-replot-v1` (current-vs-proposed toggle) — https://claude.ai/code/artifact/4c866d6c-c5b9-4e6e-982d-a29b0078d481
> Surface under review: `apps/web/app/dashboard/[eventId]/studio/page.tsx` + `lib/add-ons-catalog.ts` (23 entries, 21 hub-visible).

## 1 · The strategy, in one sentence

**Not free-first, not paid-first: keep the four locked tabs, order them as the couple's journey, lead every section with a free (or free-trial) doorway, and seat each paid SKU directly beside the free tool that manufactures its need — with every price (including F+U upgrade prices) visible on the card face.**

All four council members independently rejected price-tier sorting, and all four critiques upheld the rejection:

- Free-first builds a **"paid ghetto"** below the fold — couples learn that scrolling down means price tags and stop scrolling. Lifetime conversion dies.
- Paid-first violates "monetize the doorway, never the deal" and triggers *"saan ang catch?"* bounce in a price-sensitive PH market.
- The free tools **are** the top of every paid funnel; splitting them from their paid siblings severs the funnel. A couple who spent hours arranging 150 guests in the free Seat Plan converts on the ₱1,499 Indoor Blueprint at a multiple of one who meets it cold in a paid pool.
- **No hidden prices anywhere** (a correction the cross-examination forced on 3 of 4 proposals): Setnayan is apply-then-pay (GCash/BDO send → screenshot → 24h manual reconciliation). There is no impulse moment to capture at an in-tool "emotional peak" — only a price ambush followed by a day of decay. Visible pre-need pricing lets the couple apply a day *before* the moment, which is the only merchandising this rail can convert. It also respects PH budget culture (iteration 0007 exists because couples plan against a written budget — the menu must be price-scannable).

## 2 · Dupes found in the shipped catalog (5)

| # | Defect | Resolution |
|---|---|---|
| 1 | **"Whole website" duplicates the 4 part-cards** (`landing-page` + save-the-date/rsvp/event/editorial = 5 doorways, 1 product) | One free **"Your Website"** card (retitled landing-page) with exactly two always-visible deep-link chips: **Event page · Editorial**. Save-the-Date and RSVP keep standalone rows (own SKU / own guest-tool job — NOT chipped, avoiding a miniaturized re-dupe). Event + Editorial standalone cards retire; the Set up & manage strip becomes the Event page's primary doorway. 5 cards → 3. |
| 2 | **Editorial vs Editorial PRO** — same Newspaper icon, byte-identical gradient, adjacent rows | Both standalone cards retire. Free Editorial = chip on the Website card; Editorial PRO = a **live deep-link inclusion line** on the Website PRO card ("includes Editorial PRO — ₱X alone ›") + an upgrade module inside the Editorial editor. |
| 3 | **Website PRO ⊇ Editorial PRO sold as siblings**, relationship unshown; Website PRO shares its exact gradient with "Whole website" | Standing IA rule: **a superset is never a sibling of its subset.** One paid website card, positioned as the child of the free parent, subset priced visibly inside it (the decoy that makes the umbrella the obvious buy). Gradient family-token rule: one gradient per product family; free = clear atelier glass, PRO = distinct gold-glass. Two cards may never share both icon and gradient. |
| 4 | **Music Creator routes to Pakanta's surface** (`addOnHref('music-creator')` → `/studio/pakanta`) — functional dupe; 3 Music-icon cards across 2 sections | Delete the Music Creator card; 301 its route to Pakanta ("Pakanta — Your Wedding's Own Song" absorbs it, no resurrection microcopy). Playlist (genuinely distinct) keeps its slot with a **queue icon**, not a music note. Zero-controversy, lock-free — ship first. |
| 5 | **Seat Plan + Indoor Blueprint + Mood Board filed under "Branding"** (planning/layout tools, not identity) | Refile all three into the tab still named **"Setnayan AI"** (zero label friction). Indoor Blueprint pinned DIRECTLY under Seat Plan — the single highest-leverage monetization fix in the arrangement. ⚠ needs composition sign-off; **fallback if refused:** trio stays in Branding but Blueprint remains pinned under Seat Plan (the adjacency mechanic survives in either tab). |

Net: **21 hub cards → 17 cards** + 3 in-card doorways + 1 redirect. Every removed card ships in the same PR with its 301 **and re-plumbed coordinator/vendor/Recommended-strip targets** (grep for `editorial-pro|website-pro|event|landing-page|music-creator` in strip config before merge).

## 3 · Final arrangement (top → bottom)

**Above the tabs (unchanged spec):** coordinator + vendor suggestion strips → "Recommended for you now" (phase-aware, ≤3) → Alaala pillar tile (**+ new "Explore Capture ›" deep link** — today it frames but doesn't door) → Set up & manage (Event page · Live Wall · E-Gifts).

**Tab 1 · Setnayan AI (plan):** Setnayan AI TALL HERO ₱499 one-time (state-aware: pre-purchase demos the free deterministic engines; post-purchase it's the active planner) → Mood Board (Free) → Seat Plan (Free) → **Indoor Blueprint ₱1,499 pinned under Seat Plan** → Playlist (Free).
**Tab 2 · Website:** Your Website (Free; chips Event page · Editorial) → **Website PRO ₱3,999** (the ONLY paid website card, gold-glass, "includes Editorial PRO — ₱X alone ›") → Save the Date ("Free · openings +₱999") → RSVP (Free).
**Tab 3 · Capture:** Papic ("Try free · ₱2,999 after") → **Patiktok pinned adjacent** (need born from the same moment) → Panood ("Free · multicam +₱") → Photo Delivery (Free).
**Tab 4 · Branding (now honestly pure identity):** Monogram Maker ("Free · animate +₱999") leads → Custom QR ₱1,499 + LED (both literally render the couple's own monogram — contextual merchandising, not a price wall) → Pakanta.
**Global:** coming-soon sinks last, desaturated, never carries a price. Hidden utilities (orders, Paprint) stay hidden.

## 4 · Pill grammar (visual treatment of Free / F+U / Paid)

Price is a **pill, never the sort key**. One pill per card, precedence **Active > Pending > Trial > Price/Free**:

- **Active** — the couple's possession; owned goods are never re-sold shelf space (card deep-links into the tool, already shipped behavior).
- **Pending** — amber, "Pending · within 24h" (apply-then-pay made honest).
- **Free** — quiet clear-glass pill; keep the word "Free" (*libre* is the strongest PH acquisition word; "Included" is semantically wrong on a free platform).
- **Free + Upgrade** — `Free · +₱999 to animate`, `Free · openings +₱999`: the upgrade's charm price always on the card face, whisper-weight. The *sell* still happens inside the tool at endowment peak, but the *number* is never a surprise.
- **Paid** — live admin-catalog charm price in a quiet Space Mono pill + "one-time" microcopy. No strikethroughs, no SALE badges, no GCash logos on card faces.
- **Gold discipline** — gold is the brand accent, not a "costs money" semaphore; it appears only as the PRO-tier family gradient.
- **Guard rails** — max one paid item in a section's first two rows (except Tab 1's locked hero); every section's row 2 or 3 must be free; **no fabricated social proof** (in a hiya-driven market one fabricated count discovered is a reputation event — the coordinator strip is the social-proof engine until real numbers exist).

## 5 · Locks — respected vs challenged

**Respected:** App Store metaphor (2026-06-19) · four-tab sub-nav labels + count (2026-06-17) · first-section-only tall hero · coming-soon sink · pill vocabulary (extended, not replaced) · top-of-page stack (one additive Alaala deep-link only) · wayfinding rule (every deletion ships with 301 + in-card doorway + re-plumbed strips, same PR).

> ✅ **BOTH SIGN-OFFS ARE NOW CLOSED (2026-08-14).** #1 approved 2026-07-17. **#2 — the website
> consolidation — APPROVED 2026-08-14**, owner: *"yes. same as the menu on admin and shop."* The
> "Whole website" card + the four part-cards are five doorways for one product; they become ONE
> free **"Your Website"** card with chips + 301s, and the Tab-1 refile it gated is unblocked.
> **Nothing below is still waiting on the owner.** See `DECISION_LOG.md` 2026-08-14.

**⚠ Challenged — owner sign-off required before build:**
1. **Section COMPOSITION of the 2026-06-17 lock** (not labels, not count): Mood Board / Seat Plan / Indoor Blueprint move Branding → Setnayan AI tab. Fallback specified (§2.5) so the arrangement isn't hostage to the sign-off.
2. **Card deletions within locked sections**: Whole-website consolidation; Event, Editorial, Editorial PRO, Music Creator cards retire.

## 6 · Risks

1. **Deleted cards silently break recommendation plumbing** (coordinator/vendor/Recommended strips target hub keys) → re-point targets + 301 in the SAME PR; grep gate before merge.
2. **Composition sign-off refused, fallback shipped half-heartedly** → the Blueprint↔Seat-Plan pin + the seat-plan editor's deep link to Blueprint ship in BOTH variants; that pairing is the revenue fix.
3. **Visible prices tilt the atelier shelf toward a bazaar** → quiet Space Mono pill treatment; design QA gate: the hub must still read editorial-premium at a squint. 4-week guardrail metrics: monogram creation rate, Blueprint attach from the Seat Plan editor, Website PRO attach, Editorial-PRO reach via its inclusion link.

## 7 · Ship order

1. **Lock-free, immediate:** dupe fixes 2–4 (Editorial twins, superset-sibling, Music Creator deletion) + pill grammar.
2. **After sign-off 2:** Website consolidation (Your Website card + chips + 301s).
3. **After sign-off 1 (or its fallback):** the Tab-1 refile.

## 8 · Presentation treatment v2 — "Sell the memory, not the module" (owner follow-up, same day)

Owner: *"the different features does not look enticing to purchase — how can we present these better?"* The row anatomy (icon tile + name + blurb + price) is the anatomy of a settings page. The showcase treatment replaces it for paid/F+U SKUs with a **poster card**: vignette → outcome headline → proof line → quiet price. Prototype: https://claude.ai/code/artifact/45dfb9d9-3c78-499a-ab13-7c8901ee74a3

Five presentation rules:
1. **Show the artifact, not the icon.** Every paid card opens with the output happening — church doors parting on the couple's names, candids fanning in, the monogram shining, the LED wall glowing, the live player pulsing. In production these are live renders — `service-poster.tsx` already owns the motion system; the vignette is its next evolution, not net-new machinery.
2. **Personalize with their data.** Their names in the doors, their monogram on the LED/QR, their Mood Board palette recoloring the vignettes. A card that already contains their wedding is endowment before purchase — and the structural reason Mood Board stays free and early.
3. **Outcome headline, tool name demoted to the eyebrow.** "Wake up to every candid" sells; "Papic" labels. Same for "Everyone who can't be there — there" (Panood), "Twenty feet tall on the stage screen" (LED), "Your wedding's own song" (Pakanta).
4. **One proof line, human-scale and Filipino.** "Lola J. watches from Cebu" · "Tita Neneng → Table 7, walang paikot-ikot" · "isa para kay Tita Neneng — print-ready". Counter chips (+812 candids · 214 watching) are illustrative slots that must only ever render REAL event data — the no-fabricated-social-proof rule from §4 stands.
5. **Price stays quiet and visible** (unchanged council law). Charm price + "one-time" in Space Mono, placed after desire, never hidden. Free tools keep compact utility rows — the contrast is what makes the posters feel like occasions.

Interplay with §2/§3: the arrangement (journey order, free-led, upgrade-adjacency, dupe resolutions) is unchanged — the showcase only swaps the card anatomy for paid/F+U entries. Adjacency now reads visually: Patiktok's vignette is literally "cut from your Papic candids"; QR and LED wear the monogram made one card above.

## 9 · Pricing corrections (owner catch, same day) + defect 6

The figures in §§ 2–4 and the first prototype versions came from the stale CLAUDE.md SKU tables. Canonical = **Pricing.md § 00** (2026-07-10 finalization + 2026-07-12/13 owner rulings) + live `platform_retail_catalog_v2`. Both artifacts republished with the FINAL sheet:

| SKU | Wrong (used) | Canonical |
|---|---|---|
| Setnayan AI | ₱499 | **₱1,499 one-time, per event** (owner FINAL 2026-07-12; live catalog lags at ₱499 until draft PR #3145 merges) |
| Indoor Blueprint | ₱1,499 | **RETIRED** (§ 00.C tombstone) — the arrangement's Seat-Plan adjacency slot goes to **3D Plan `SEATING_3D` ₱2,999** (gate-pending) |
| Custom QR per Guest | ₱1,499 | **FREE** (owner 2026-06-29) |
| Couple Website PRO | ₱3,999 | **₱4,999** — and **watermark removal is NOT a perk** (watermark stays subtle for everyone, § 00.F); PRO sells the four premium chapters, incl. Editorial PRO + Cinematic Reveal |
| Editorial PRO | ₱1,499 | **₱2,999** |
| Patiktok | ₱2,499 one-time | **₱1,499/day** (kept live & paid per 2026-07-13 ruling) |
| Papic | ₱2,999 flat | **per-camera: Ltd ₱30 · Unli ₱100 /cam·day** (caps ₱9,000/₱15,000) |
| Panood/Live Studio upgrade | +₱2,499 | single-cam FREE · **Mobile controller ₱1,299/day · Desktop ₱2,499/day** |
| LED/Live Background | ₱2,499 | **₱499** (self-serve reposition 2026-06-29) |
| Pakanta | ₱1,999 | **₱2,499** |

**Defect 6 (NEW, found via the price sweep):** the shipped `add-ons-catalog.ts` still merchandises **Indoor Blueprint** — a SKU tombstoned 2026-06-07 (`INDOOR_BLUEPRINT` inactive in DB, § 00.C) — and presents the now-FREE Custom QR through the paid-SKU pattern (serviceKey pill path), while the "LED Background" card copy predates the ₱499 "Live Background" reposition. **Fix rides ship-order step 1 (lock-free):** delete the indoor-blueprint entry (301 its route to the seat plan), set `tier:'free'` on custom-qr-guest, rename/reprice copy on led. Standing rule: **prototype and marketing figures are drawn from Pricing.md § 00 or the live catalog — never from the CLAUDE.md SKU tables** (both files self-declare as stale lineage).

## 10 · Setnayan AI framing correction (owner, same day)

Owner: *"Setnayan AI is more comprehensive than your 'shortlist already made'."* Correct — the matching-only frame repeats the shipped card's own underselling (`add-ons-catalog.ts` blurb: "The vendors that fit your budget, date, and style — already at the top" — matching only). Per Pricing.md § 00, ₱1,499 buys the WHOLE planning office: full match/sort/cross-reference (date↔availability · budget · venue · pax · religion · reviews) + the planning workspace + the secretary/guard/coach + watch-guard.

**Reframed hero (shipped to both prototypes):**
- Vignette: three role rows — **MATCH** ("Lumina Films · 98% fit") · **GUARD** ("Caterer quiet 48h — 3 backups ready") · **NEXT** ("Food tasting — book by Aug 30") — breadth shown, not claimed.
- Eyebrow: "Setnayan AI · your whole planning office". Headline: **"It matches. It reminds. It guards."** Copy keeps the "₱50,000 coordinator, productized" anchor; price line gains "· whole event". CTA: "Open your planner" (not "See your matches").
- **Copy fix added to ship-order step 1:** the shipped catalog blurb + "See your matches" CTA undersell the SKU the same way — rewrite alongside the pill-grammar pass.
