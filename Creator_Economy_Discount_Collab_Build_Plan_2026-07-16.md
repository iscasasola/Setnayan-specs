# Creator Economy — Discount Collab & Viewer Promo (Build Plan, 2026-07-16)

> Owner 2026-07-16: "This is great — document this, code it now around everybody." The three-party money engine on top of the user-native creator model (chapters + followers/viewers already shipped: PRs #3304/#3311/#3312/#3314/#3315). Companion visuals: the [creators pitch] and [economy map] artifacts. **Setnayan never touches the booking money — it sells the doorway (tokens + boost + subscriptions).**

## ✅ OWNER RATIFICATION — 2026-07-16 (the paper-lock session; governs delivery)

Owner signed all four decisions (AskUserQuestion, 2026-07-16):
1. **All simplification-council cuts RATIFIED** ([verdict](Creator_Economy_Simplest_Approach_Council_Verdict_2026-07-16.md)): tier ladder → one raw **"inquiries driven"** number (bands may return later as a rendering, owner-gated) · content-suggestions coach **deleted permanently** · user-home benefits block deferred (≥20 active collabs, trimmed form) · one rate at P1, audience rate returns with the Book CTA (PR-C) · vendor threshold setting cut (browse sort/filter instead) · no collab desk / no clawback / no "discount given" column / analytics usage-gated.
2. **Badge word = "Storyteller"** — names the featured-chapter badge, the hub shelf ("From Our Storytellers"), the admin Studio tab, and the `/storytellers` redirect. (`CREATOR_BADGE_LABEL` flips to 'Storyteller'.)
3. **Thumbnails V1 = YouTube-derived** (non-YouTube chapters not featurable in V1 — a curation rule; teaser render remains the later upgrade).
4. **Vendor Creators surface = PRO-AND-UP** (owner overrode the council's all-paid-tiers resolution; matches the Market Intel precedent). P1 shipped `tier != 'free'` → tighten to Pro/Enterprise in PR-C. Volume gates blessed as recommended (analytics ≥25 attributed unlocks · benefits block ≥20 active collabs; retunable).

**Paper locks from the verdict, now in force:** attribution = **CTA-click** (the chapter whose Book CTA started the thread gets credit; no windows, no multi-touch) · collab outcome = `fulfilled/unfulfilled` state + discount↔chapter link, **no clawback** · public read path whitelists **audience_rate only** (creator_rate_terms never renders publicly) · "inquiries driven" is the only public metric word.
**Pragmatic delta:** the audience-rate field in the P1 form ships LABELED-dormant in PR-B (already building) and becomes live in PR-C immediately after — the remove-then-return cycle would be churn since PR-C follows directly.

## ☝ THE SIMPLICITY CANON (owner directive 2026-07-16 — governs everything below)

Owner: "we still want this to be as simple as possible." The whole economy must stay expressible as SIX RULES — a feature that can't fit inside them doesn't ship:
1. Anyone can publish their story. Free.
2. **Being credited in a story is always free** — editorial or chapter, any tier. *(Resolves council decision #5 the simple way: retire the Pro-gate on the editorial credit chip — one rule, "you never pay to be named in a story." Pro keeps its real perks; credit display stops being one.)*
3. Vendors pay for exactly ONE thing: reach (tokens for offers/leads, subscriptions, boost). Never for credit, never commission.
4. Discounts are the vendor's choice, settled off-platform. Setnayan never touches the money.
5. One price rule: everyone pays regular — unless THIS vendor offered YOU a deal.
6. One stories page, one admin queue, one click to feature.

When any later design choice has a simple option and a clever option, **the simple one wins by default**; cleverness needs owner sign-off.

## The three-party model (what each earns)

- **Creator (any user with a public story):** earns an **exclusive discount** from vendors (their own booking) + audience (followers/viewers) + a permanent shoppable portfolio. **Free. Never pays. Never receives cash from Setnayan.**
- **Vendor:** earns **natural promotion** (a credited feature inside a trusted story) → **warm bookings kept 100%** (0% commission). Their cost = the discount(s) they offer (off-platform) + tokens + optional boost/subscription.
- **Setnayan:** earns **tokens** (reach + leads) + **boost cash** + **subscriptions** — at ≈ a DB row per chapter.

## Locked decisions (defaults — owner may veto any)

1. **Money-safe, no creator commission.** Creators are rewarded in **discounts + audience**, NOT a cash cut per booking. Paying creators per booking would force Setnayan to handle money → breaks 0%/never-touch-the-deal. *(The true-affiliate alternative is a separate model change, flagged below — NOT built here.)*
2. **Vendor → creator discount inquiry is TOKEN-GATED.** The vendor spends a **reach token** to send a discount-offer to a creator (reuse the existing vendor token-spend + hold-and-release; refund if the creator ghosts within the response window). Consistent with "vendors pay to initiate contact."
3. **Eligibility = follower/view threshold AND vendor-approval.** A vendor only sees/offers to creators above their chosen reach bar; the creator still accepts/declines. Protects vendors from wasting reach tokens on low-value creators; the follower/viewer counts (PR #3315) are the currency.
4. **Vendor offers TWO rates (optional per collab):** a **creator rate** (the creator's own booking) and an **audience/viewer rate** (a promo the creator's viewers get when they book that vendor through the Chapter). Both are the vendor's cost, off-platform. Viewers getting a discount is the conversion lever + the attribution key.
5. **"Creator influence" surfaces on the creator's profile:** accepted partnerships (vendors they've collab'd with), bookings driven, and reach (followers/views). Social proof for the creator, buying signal for vendors.
6. **Setnayan holds no money.** All discounts settle off-platform between the parties. Setnayan brokers the match, gates with tokens, and records the collab + attribution.

## Data model (new)

- `vendor_creator_offers` — the discount inquiry/collab: `(id, vendor_id, creator_user_id, creator_rate_terms, audience_rate_terms?, status ∈ pending|accepted|declined|expired, reach_token_ref, deliverable_chapter_id?, created_at, responded_at, expires_at)`. RLS: vendor owns their offers (current_vendor_ids); creator reads offers addressed to them; admin override. Canonical patterns only.
- Attribution: a `referring_chapter_id` (+ derived `creator_user_id`) on the customer→vendor lead/booking row (extend the existing lead/connection table, don't fork it). This is what powers the viewer-discount + the vendor ROI view.
- Aggregates for "creator influence": derive from `vendor_creator_offers` (accepted count) + attributed bookings + PR #3315 counters. Maintain counters by trigger where a live query would be heavy.

## Phased build

**P1 — the collab loop (around everybody) [FIRST PR]**
- Vendor: a **"Creators"** surface — browse eligible creators (reach ≥ bar) + send a token-gated **discount offer** (creator rate + optional audience rate). Reuse the existing vendor token-spend + hold-and-release.
- Creator: an **offers inbox** — accept/decline. On accept, the collab is recorded; the deliverable is a published Chapter crediting the vendor.
- Creator profile: **"creator influence"** block — partnered vendors + reach (bookings-driven comes in P2).
- Integrate: reuse the token/wallet spend path (tokens are LIVE, flat ₱200/token, PR #3138) and the fake-inquiry hold-and-release. **If the token-spend or lead integration is unclear, STOP and surface — do not fork the token economy.**

**P2 — viewer promo + attribution**
- The Chapter "Book" CTA carries the vendor's **audience rate**; booking through the Chapter creates a **lead tagged with the referring chapter/creator** (the promo IS the attribution). Vendor unlocks it with a lead token (existing). Discount honored off-platform.

**P3 — vendor ROI view + creator influence (full)**
- Vendor "Creators" surface gains the **ROI line** per creator: bookings driven, tokens spent, discount given. Creator profile's influence block gains **bookings driven**.

## Inquiry-source taxonomy (owner 2026-07-17 — "tell the vendor what type of customer sent an inquiry")

One `inquiry_source` on the thread, stamped at inquiry creation (CTA-click/last-touch, consistent with the attribution lock), shown to the vendor as a chip in the thread header + clients list, and aggregating into the EXISTING `SourceBreakdown` "by source" table. **Owner's 8 types** (enum values), mapped to their trigger surface — wire only the ones whose surface is LIVE; everything unstamped defaults to Website Inquiry (no fake chips):
| # | Label | Trigger (stamps it) |
|---|---|---|
| 1 | Shortlist Inquiry | inquiry sent from the couple's vendor shortlist/saved-workspace surface |
| 2 | First Pick Recommendation | inquiry from a match/compat recommendation surface |
| 3 | Favorites | inquiry from the guest/couple favorites (saved vendors) list |
| 4 | Influencer Recommendation | chapter Book CTA (`referring_chapter_id` NOT NULL) — the PR-C attribution |
| 5 | Website Inquiry | the vendor's public microsite `/v/[slug]` inquiry (the default) |
| 6 | Returning Customer | inquirer has a prior genuine booking with THIS vendor (the returning=1-token signal already in the token bands) |
| 7 | Editorial Inquiry | arrived via a /realstories editorial credit chip / featured-stories backlink |
| 8 | Auto Build Recommendation | inquiry from the auto-build/3-option build flow |
| 9 | Degree Recommendation (owner 2026-07-17, scope refined) | "a service **used OR FAVORITED** by someone in **your circle**" — the People/connections graph surfaced the vendor. **YOUR CIRCLE = your DIRECT (first-degree) connections only: your family tree + your samahan + your godparents + your friends.** ⚠ It does NOT spider outward — **nothing deeper than your direct circle counts UNLESS you are also directly connected to that person** (i.e. effectively first-degree only; a friend-of-a-friend you don't know never counts). This supersedes the earlier "5 degrees of your tree" — narrower on purpose (relevance: "someone you actually know"; privacy: the cross-person flow is limited to genuine direct ties, much easier for counsel to clear). A direct connection's used/favorited vendor is the signal. **ANONYMITY RULE (owner 2026-07-17): never identify WHO used/favorited the vendor — the surface says only "vendors used around your circle."** No names, no relationship labels, no degree number shown to the user. Design guard for wiring: a **minimum-circle/k-anonymity threshold** — suppress the degree rec when the circle or signal count is small enough that the person is inferable (2-connection tree ⇒ arithmetic identification). ⚠ Enum + label only for now: the trigger is People-layer + counsel-gated (the anonymous-aggregate framing + k-threshold materially softens the cross-person disclosure, but counsel still blesses the posture — note the standing `guest_saved_vendors` no-consent-gate finding) |
Notes: source is PRIVATE to the vendor (never public); Influencer + Editorial sources are what feed "inquiries driven" and the vendor's influencer analytics; Returning Customer may combine with any origin (origin chip + a returning flag rather than overwriting). Ships with PR-C (same files: `startServiceInquiry`, thread header, clients).

## Price separation — "everybody is a storyteller" (owner question, answered 2026-07-16)

**Principle: storyteller = identity (free, universal); a deal is NEVER attached to the identity.** No status discount exists. Regular price is the default for everyone, always. A special rate exists only when it passes three vendor-held gates: (1) **proven influence** — vendors browse by TIER (unlocked-inquiries-driven), not by "is a storyteller"; a zero-influence storyteller looks like a regular customer; (2) **vendor offers, customer never claims** — the rate exists only via the vendor's token-gated offer to that person (no "I'm a creator" claim button anywhere, ever); (3) **barter with a deliverable** — the rate is tied to a published crediting chapter.

**Mechanically, the accepted `vendor_creator_offers` row IS the separator** at money-time (P2): an inquiry from a customer with an ACTIVE accepted collab with THIS vendor gets a thread/quote marker ("creator collab active — agreed creator rate applies") and the Proposal Maker quotes accordingly; a chapter-attributed viewer gets that chapter's audience rate; everyone else quotes regular. Offers are per-vendor — a collab with the florist buys nothing at the caterer.

## Creator tiers (owner-decided 2026-07-16)

**Metric = unlocked inquiries driven, all-time.** A creator's tier is banded on the number of chapter-attributed inquiries a **vendor actually unlocked** (spent a token to pursue) — NOT bookings (off-platform, unobservable, vendor-self-reported = dishonest) and NOT raw "Book" taps (creator-gameable). The vendor's token spend is the honesty filter on both sides. Shown to users as **"bookings driven"** (the word people know); measured as unlocked/attributed inquiries under the hood.

**Ladder (familiar terms, Setnayan-defined bands — placeholders, tune later):**
| Tier | Unlocked inquiries driven (all-time) |
|---|---|
| *(none — "Storyteller" only)* | 0 |
| Nano | 1–9 |
| Micro | 10–49 |
| Macro | 50–149 |
| Mega | 150+ |

- 0 driven → **no tier badge** (just the Storyteller badge) — don't label every new creator "Nano".
- Badge sits next to the **"creator influence"** block on `/u` and in the vendor **Creators** surface; the vendor's eligibility threshold reads as "offer to Micro+".
- **Depends on the P2 attribution count** (chapter→lead, unlocked flag) — so the tier badge is built WITH P2, not before (a tier badge needs a real number, not an empty one). Optional later: a vendor "mark as booked" verified-bookings sub-count layered on top, never the tier's basis.

## Surface map — elements added per page (status: ✅ built · P1 · P2 · P3)

**USER / CREATOR**
- `/u/[userSlug]` (public profile): ✅ Storyteller badge · follower count + Follow · chapter timeline · view count → **P1** "creator influence" block (partnered vendors + reach) → **P2** tier badge (Nano/Micro/Macro/Mega).
- `/u/[userSlug]/c/[chapterId]` (chapter detail): ✅ embedded edit · shoppable vendor cards · teaser · view count → **P2** "Book" CTA carries the **viewer discount** + creates the attributed lead.
- `/dashboard/creator` (authoring): ✅ create/publish (ungated) · teaser → **P1 Offers inbox** (incoming vendor discount offers → Accept/Decline) → **P3** own stats (tier, bookings-driven).
- `/dashboard/(account)/profile`: ✅ public/hidden toggle + slug editor = the "become a public storyteller" switch.

**EVENTS** (kept light — the event site stays the couple's own, unbranded)
- `/[slug]` + recap/editorial: **P2 (light)** "Publish this event as a Chapter" linkage (a couple turns their real event into a shoppable chapter). The shoppable vendor list lives on the chapter, not on the invitation.
- Event dashboard `/dashboard/[eventId]`: **P2 (light)** the "turn this event into a public chapter" entry + pick which booked vendors to credit. Events are the *substrate*; most creator UI lives on /u + vendor side.

**VENDORS**
- `/vendor-dashboard` → **new "Creators" surface (P1, the big one):** browse eligible creators (by reach/tier) · **send a token-gated discount offer** (creator rate + optional viewer rate) · sent-offers list + status · the "creator rate" + eligibility-threshold setting → **P3** per-creator ROI (bookings driven, tokens spent, discount given).
- `/v/[slug]` (public microsite): **P3 (optional)** "Featured in these stories" — creators who credited this vendor (social proof).
- Vendor **clients / inquiry** (`vendor-dashboard/clients/[eventId]`, `messages/[threadId]`): **P2** attributed inquiries show **"referred by [Creator] · via [Chapter]"** + the promised viewer discount surfaced so the vendor honors it.

**INQUIRY → QUOTE pipeline** (all already built; P2 only *feeds* it — no new quote system)
- Unlocked inquiry / thread: **P2** attribution tag (creator + chapter) + viewer-discount note.
- Proposal Maker (`_components/proposal-maker.tsx`, ~1081 lines, shipped): **P2** pre-apply/surface the viewer-discount line when quoting an attributed inquiry.
- Customer quote `/proposals/[publicId]` (shipped): **P2** reflects the creator-referred discount.

## Owner requirements — 2026-07-16 (P2/P3 refinements + influencer analytics)

1. **Service links attach to the video embed.** The shoppable substrate (linked vendors/services) is bound to the Chapter's embedded video — a viewer watching the embed sees the linked services with it, not on a detached page. (Refines the chapter-detail render; the "Shop this" panel travels with the embed.) — P2.
2. **Vendor microsite backlink.** `/v/[slug]` gets a **"Featured in these stories"** connection — the published public Chapters that link/credit this vendor (reverse of the substrate link). Vendor's site gains inbound from the creator videos tied to them. Only published + public chapters; RLS-safe. — P2/P3.
3. **Every link is notified, counted, and discounted.** When a viewer books through a Chapter link (attributed): (a) **NOTIFY** — the creator ("your chapter drove a booking") + the vendor ("attributed lead from [Creator]"); (b) **COUNT** — increment the creator's **influence + tier** on the vendor's UNLOCK (unlocked-inquiry = the tier metric); (c) **DISCOUNT** — the vendor's viewer/audience rate applies at booking. — P2.
4. **Influencer-token registry → admin + vendor analytics.** EVERY token spent in the creator flow is TAGGED as an **influencer-driven** spend — both the **reach token** (vendor→creator offer, P1) AND the **lead token** (vendor unlocking a creator-attributed inquiry, P2). ⚠ The tag must be written **at spend time** (in the P1 token fix + P2 unlock), not retrofitted, or the data is lost. Aggregate into:
   - **Admin analytics** — platform-wide: how much token spend influencers drive, how they help businesses (new/extended admin analytics surface).
   - **Vendor analytics** — per-vendor: influencer-driven spend + the ROI line (bookings driven / tokens spent / discount given), updating the vendor's own analytics. — tag at P1-fix/P2; surfaces at P3.

**Cross-cutting note:** requirement #4's token-source tag is added to the **P1 token fix** (reach token) so the influencer-spend data is captured from day one; the analytics *surfaces* (admin + vendor) are P3, but the *data* starts accruing at P1-fix + P2.

5. **Vendor-side placement (audited 2026-07-16):** the vendor **Overview is a decision surface by design** (stat tiles retired) — creator items appear there ONLY as actionable cards ("offer accepted — link the chapter", "attributed lead awaiting unlock"). The influencer STATS extend the existing **`vendor-dashboard/performance` surface + `source-breakdown`** ("Creator chapters" becomes a lead source; per-creator ROI joins performance). Extend, don't invent. — P2 (cards) / P3 (stats).
5b. **Public acquisition surfaces** (owner 2026-07-16): a public **`/creators` marketing page** (mirrors `/vendors` acquisition-page structure; pitch = the artifact "for creators" narrative, honest to shipped features — no viewer-promo/earnings/tier promises) + a **"Creators — Free" callout on `/pricing`** linking to it + nav/footer/sitemap discoverability. And a **"Become a creator" promotion on the user home** launcher (honest copy; collapses to the plain "Your Story" doorway once the user has ≥1 chapter; one entry, promo IS the doorway). — building 2026-07-16 with the B4–B6 funnel PR + a dedicated marketing PR.

6. **User-home "Your creator benefits" block** (owner 2026-07-16): on the user's home, a block showing (a) **benefits** — active vendor discounts/collabs they hold; (b) **their performance for vendors** — views, followers, bookings driven, tier; (c) **content suggestions** — ⚠ DETERMINISTIC ONLY (Setnayan-AI Rule 1: no LLM, no per-call cost): rule-based nudges computed from their own stats (e.g. "chapters linking 4+ vendors drive more inquiries — your last linked 1", "your travel chapter earns the most views — publish another", "add a teaser — teaser'd chapters get saved to Stories more"). Shown only to users with ≥1 chapter (no fake door for non-creators). — P3 (needs P2's attribution data to say anything true).

## P4 — "Storytellers" public discovery (⚠ REWRITTEN 2026-07-16 by council verdict — INTEGRATE, not side-by-side)

> **Council verdict (3–1 INTEGRATE, [Storytellers_Editorial_Architecture_Council_Verdict_2026-07-16.md](Storytellers_Editorial_Architecture_Council_Verdict_2026-07-16.md)) — owner pre-authorized "or if better, integrate."** The side-by-side spec below is SUPERSEDED where it conflicts. Key corrections:
> - **`/realstories` IS the library; the two shelves live on ONE page.** Editorial shelf ("From the Setnayan Editorial Desk", the untouched Chronicle cascade) + Storytellers shelf ("From Our Storytellers", `#storytellers`, a NEW byline-forward tile variant — never the Chronicle tile, never house prose; editorial tiles never show view counts). `/storytellers` = a redirect into the shelf, never its own indexed page. Chapter canonical stays `/u/[slug]/c/[id]`, noindex.
> - **The audit found the old spec's "promote a chapter via the existing curation queue" is IMPOSSIBLE as built** — `assertEligibleShowcase` (admin/real-stories/actions.ts) hard-rejects anything but consented past weddings, and curation columns live on `events`. Chapters get their OWN `showcase_featured_at`/`showcase_feature_rank` columns + a "Storytellers" tab in `/admin/studio` (14th sibling surface) that COPIES the audit+notify+revalidate spine (copy-the-pattern, never generalize the wedding assert). Cross-promotion = the `creator_chapters.event_id` JOIN ("Watch the storyteller's cut" / "Read the editorial" chips), not a queue transfer.
> - **Deny-by-default curation:** publish ≠ listed. A published chapter is public only on the creator's /u timeline; it reaches /realstories only by an explicit owner Feature click (the featuring click IS the moderation review). Report-hide atomically unfeatures. Empty-state: the shelf simply does not render until ≥1 featured real chapter (no dead shelf, no chapter samples ever).
> - **Route-agnostic build rule:** the chapter loader / tile variant / OG renderer / curation actions import nothing from /realstories page code — a future standalone /storytellers (Phase S4) is loader+doorways only, built only if chapter volume outgrows the shelf.
> - **Build phases:** S0 safety floor (report target `'chapter'` + ReportPageButton + ShareButtons on chapter detail — owed to the LIVE pages regardless, ships first) → S1 curation spine (dark: columns/indexes + admin Storytellers tab) → S2 card+OG kit (dark; gate: thumbnail decision) → S3 shelf live on /realstories (gates: ~10–20 real chapters + S0/S1 + P2 attribution + owner decisions) → S4 standalone page only if earned.
> - **Schema deltas (smallest-first):** `user_reports` CHECK += `'chapter'`; 2 nullable cols + partial index on `creator_chapters`; a global published index; NO new tables, NO `events` changes, NO consent-gate changes; thumbnails = YouTube-derived in V1 (non-YouTube unfeaturable; teaser later).
> - **Owner decisions open:** SEO rewording of the hub · badge word (names the shelf/badge/tab/redirect) · non-milestone kinds on the hub (chair leans wedding+travel only in V1) · vendor tier-gate juxtaposition (editorial chip = Pro perk vs chapter mention = free) · thumbnail source (chair: YouTube-derived now).

### P4+ — Stories SEARCH ("samples by place or service") — owner 2026-07-16, VOLUME-GATED
Owner: users/creators should be able to search events & stories for samples in their target place or with their target service. Sequenced honestly:
1. **Service→stories = already building:** the `/v/[slug]` "Featured in these stories" backlink (PR-D) answers "show me real events this vendor made" per-vendor — the highest-intent form, zero new machinery.
2. **Kind filters = already plotted:** the hub shelf's milestone chips (Weddings · Debuts · Travel).
3. **Free-text place/service facets on the hub = gated on a featured pool ≥ ~50 chapters** (a search box over 15 items reads as a dead platform). No schema work needed now — chapters already join to events (venue/location) and credited vendors (categories); search is a later query, not a capture problem. Simplicity canon: don't build search before there's something to find.
4. **Search scope = the WHOLE library (owner-confirmed 2026-07-16): results return BOTH editorials and chapters**, each in its own tile grammar (Chronicle tile vs byline card) so provenance stays legible; filters/chips span both shelves; the `/v/[slug]` backlink likewise merges both (a vendor's full portfolio of real events). Same-event pairs are linked by the cross-rail chips, never shown as unexplained near-duplicates.

### Original P4 spec (SUPERSEDED where it conflicts with the verdict above)

**What it is:** the public, YouTube-like WATCH destination on setnayan.com — browse published Chapters across ALL creators, watch (EMBEDS ONLY — the no-hosting lock stays), tap through to the creator's `/u` page and the shoppable vendors. The platform-wide storefront of stories; the creator-powered sibling of `/realstories` (reuse its curation pattern).

**What it is NOT:** a video host (embeds only, sandboxed/allowlisted, same as chapters) · an algorithmic engagement feed. Shape = a **gallery of premieres**: curated rows (Weddings · Travel · Debuts), newest chapters, notable storytellers — "substantial events, not a feed."

**Why it's sequenced last (owner asked "storytellers page or website first?" → WEBSITE FIRST, decided 2026-07-16):**
1. **Empty-marketplace trap** — a browse page with 3 chapters looks dead; dead is worse than absent for the brand. The acquisition surfaces (5b) manufacture the content first.
2. **Moderation gate** — a public browse-all surface aggregates everyone's content on our domain; the council's consent/report/admin-desk items (§ must-plan) must exist before it.
3. **Launches as the finished loop** — by then P2 attribution exists, so every story on the page is shoppable-with-discounts and tier-counting from day one, not a preview.

**Gates before build:** (a) ≥ ~10–20 real published chapters (seed: owner's own events + first recruited creators); (b) the consent/report surfaces + mini admin/dispute desk shipped; (c) P2 attribution live.

**V1 shape:** hand-curated front page over the chapter pool (the `/realstories` way — curation IS the moderation), category rows, newest strip, storyteller spotlights; open toward fuller browse as volume + the report/admin desk mature. Route suggestion: `/storytellers` (public, marketing-nav sibling of `/realstories`; the badge-word decision — Creator/Storyteller/Kwentista — should settle before this page names itself).

**SIDE-BY-SIDE with the editorial system (owner 2026-07-16):** `/realstories` (Setnayan-curated couple editorials, RA-10173-consented, house editorial voice) and `/storytellers` (creator-authored chapters, self-published voice) COEXIST as two shelves of one library — neither replaces the other:
- **Cross-promotion both ways:** a standout chapter can be promoted into a curated Real Story (admin pick, existing curation queue); a couple's consented editorial can seed/link a Chapter (the event's editorial IS natural chapter substrate). Each surface carries a tasteful rail to the other ("From our editorial desk" / "From our storytellers").
- **Shared machinery, not duplicated:** same curation/moderation queue pattern, same OG-card pipeline, same vendor-crediting (both drive `/v/[slug]` leads), same consent gates — the editorial's showcase-consent for couples, the public-profile+published gate for creators.
- **Distinct voices kept distinct:** Real Stories = "Setnayan wrote this about you" (curated, editorial standard); Storytellers = "you published this yourself" (creator-owned). Labeling must keep the difference legible so the editorial brand isn't diluted by self-published volume.

## Guardrails / reuse (non-negotiable)
- **Reuse, don't fork:** the token/wallet spend, the lead/connection flow, the fake-inquiry hold-and-release, the notification pipeline. No new token primitive.
- Canonical RLS patterns + 4 helpers only; RLS at CREATE; cron-free; no entity-ID change.
- **No money handling:** Setnayan records the collab + attribution and gates with tokens; discounts settle off-platform. Do NOT build a payout/commission path.
- Deliverable check: a creator-rate discount is tied to a **published Chapter crediting the vendor**.

## Open (owner) — not blocking P1
- **True-affiliate model?** If you ever want creators to earn a **cash cut** per viewer booking, that's a deliberate change to what Setnayan is (it would have to touch money). Default = NO; flag if you want to explore it.
- Reach-token price for a creator inquiry (same ₱200/token, 1 token?), and the creator response window before refund.
- Whether the vendor "Creators" surface is Pro-and-up (like Market Intel) or all tiers.

*Provenance: owner design dialogue 2026-07-16, on top of the user-native creator model. Cross-refs: [[project_setnayan_social_sharing_program]], [[project_setnayan_creator_program]], [[project_setnayan_vendor_monetization]], [[project_setnayan_pricing_strategy]], [[project_setnayan_token_settlement]], [[project_setnayan_fake_inquiry_protection]], [[project_setnayan_proposal_maker]].*
