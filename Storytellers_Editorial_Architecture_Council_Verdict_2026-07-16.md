# Storytellers × Editorial — Architecture Council Verdict

## 1. The decision

**INTEGRATE — one public stories destination at `/realstories` with two named, visually distinct shelves; `/storytellers` ships only as a redirect into it.** The single strongest reason: both surfaces are ~empty until ~Dec 2026 and `/realstories` is the only one with a solved cold-start (the labeled-Sample fallback) — a standalone `/storytellers` has zero chapters, zero sample mechanism, zero SEO equity, and a full doorway kit to duplicate, and its inevitable "just list everything published" pressure would flip the solo operator from deny-by-default curation into policing an open feed.

One clarification that dissolves most of the fork: **the data, consent, and curation write paths stay side-by-side no matter what** (RA-10173 showcase consent vs `public_profile_enabled`+published are two legal bases; curation state lives on `events` vs `creator_chapters`). The council integrates only the layer users actually see — the browse page and the admin hub. That is not a hybrid dodge; it is what the code makes structurally true under every option.

## 2. Vote tally + how disagreements were resolved

| Seat | Vote | Disposition |
|---|---|---|
| Brand / editorial voice | HYBRID (one masthead now, earn the second address later) | **Absorbed into the verdict** — its "route-agnostic build + promotion path" becomes a build discipline (Phase rule below), not a second page |
| Product / IA | INTEGRATE | Won the routing question (`/storytellers` = redirect, chapter canonical stays `/u/…`) |
| Solo-operator / moderation | INTEGRATE | Won the curation/moderation shape (deny-by-default, one Studio hub, one report queue, report-hide atomically unfeatures) |
| Growth / SEO | INTEGRATE | Won the SEO posture (one indexed hub, chapter details stay noindex, category child pages later) |

**Tally: 3 integrate, 1 hybrid, 0 side-by-side.** The lone hybrid vote is not a genuine disagreement — the brand seat's proposal ("one library, two named shelves, chapters never in the Chronicle tile, standalone page only after 10–20 real chapters") is 95% identical to the integrate proposals. The chair resolves the remaining 5% as follows: **build the chapter loader, tile variant, OG renderer, and curation columns with zero `/realstories` coupling** (brand seat's demand), so promoting the shelf to a standalone page later is a routing change + doorway kit — but **do not build, plan, or budget that second page now**. It happens only if the owner later decides chapter volume has outgrown the shelf.

Where the chair overrode a seat: the growth seat's `/realstories/c/[kind]` category child pages are **deferred out of scope entirely** (premature until any kind clears ~10 items — that is a 2027 conversation). The brand seat's "food/travel/lifestyle appear only in the Storytellers shelf" beat the growth seat's broader taxonomy union: milestone facets stay milestone-only; non-milestone kinds are shelf-scoped chips.

**Explicit finding against the current plan doc:** the P4 side-by-side spec's "promote a standout chapter via the existing curation queue" is impossible as built — `assertEligibleShowcase` (app/admin/real-stories/actions.ts:76-107) hard-nulls anything that isn't a consented past wedding, and curation columns live on `events` (migration 20261221000000). Every seat's audit confirmed the fork is a routing/branding decision, not an architecture one: curation columns, global index, report target, thumbnail answer, and chapter OG renderer are unavoidable under both forks.

## 3. The plotted architecture

**Routes**

- `/realstories` — the single public stories hub. Keeps its 301 from `/weddings`, `CollectionPage`+`BreadcrumbList` JSON-LD, `sitemap-weddings.xml`, footer link, homepage gallery doorway, NAV_ROUTES entry. Metadata/JSON-LD reworded ONCE, before the first chapter renders, to honestly cover both voices: *"Real stories from real events — editorial features written by Setnayan, and chapters told by our storytellers."*
- `/storytellers` — a redirect to `/realstories#storytellers` (or `?lens=storytellers`). Gives creators/marketing a speakable word (and the `/pricing` "Creators — Free" callout a link target) with zero second page to maintain. Never indexable on its own.
- `/u/[userSlug]/c/[chapterId]` — unchanged. Remains the canonical chapter page, the creator's share target, embeds-only (ChapterEmbedFrame), and **stays noindex**. Gains `ShareButtons` (already built reusable) and `ReportPageButton`.
- No new detail routes anywhere — the hub stays a link-out index over canonical pages, exactly the shape both systems already have (`showcase-db.ts` href `/${slug}`; chapters href `/u/…/c/…`).

**Page structure (top to bottom)**

1. **Editorial shelf — "From the Setnayan Editorial Desk"**: the existing cascade (Cover → Most loved → Just published → Archive) in the untouched Chronicle nameplate tile (`gallery.tsx` "The {name} Chronicle" + witness quote + edition number). Sample fallback behavior unchanged.
2. **Storytellers shelf — "From Our Storytellers"** (anchor `#storytellers`): chapters in a **new tile variant** — byline-forward ("A chapter by @slug"), Storyteller/Kwentista badge (extending the `isSample`-badge provenance precedent), kind chip, view count, video/thumbnail hero reusing the shipped `BoomerangVideo` viewport-gated card system. **Never the Chronicle tile; never house prose; editorial tiles never show view counts.**
3. **Cross-rails** via the existing `creator_chapters.event_id` FK (a join, not machinery): editorial cards whose event has a linked published chapter get a "Watch the storyteller's cut" chip; chapter cards whose event has a consented editorial get "Read the editorial."

**Facets/labels**: milestone chips (Weddings · Debuts · …) filter across both shelves; non-milestone kinds (Travel; Food/Lifestyle if admitted — owner decision #4) appear as chips scoped to the Storytellers shelf only. A couple's default milestone browse never surfaces a food vlog uninvited.

**Nav placement**: zero new IA debt. Homepage `HomeReskin` Real Stories gallery grows a storyteller row when the shelf is live; footer keeps the single "Real stories" link; the inert `public.site-nav.real-stories` registry slot is untouched.

**Empty-state launch shape**: the Storytellers shelf **simply does not render** until ≥1 owner-featured real chapter exists (and the P4 gates below have cleared). No dead shelf, no fake door, no "coming soon," no chapter-sample mechanism ever. The page today keeps showing its 9 labeled sample editions exactly as it does now — no launch event required; chapters appear when they're real.

**Route-agnostic build rule (the brand seat's escape hatch, kept)**: the chapter→GalleryItem mapper, cross-creator loader, tile variant, OG renderer, and curation actions are written with no import from `/realstories` page code, so a future standalone `/storytellers` page is loader + doorway kit only.

## 4. Curation & moderation flow

**How a chapter reaches the public surface (deny-by-default, one owner click):**

1. Creator publishes a chapter (self-serve, `/dashboard/(account)/creator`) → it is public **only** on their own `/u/[slug]` timeline. Publish ≠ listed.
2. The chapter appears as a candidate row in a new **"Storytellers" tab in `/admin/studio`** — the 14th sibling in `_surfaces/` beside `real-stories-surface.tsx` (the established 13-tab house pattern). Candidate list = all published chapters on `public_profile_enabled` profiles, newest first, with embed preview, owner, kind, and report count inline — **the featuring click IS the moderation review**.
3. Owner clicks **Feature** → a new `storytellers` actions file that **copies the proven spine verbatim** from `app/admin/real-stories/actions.ts` (copy-the-pattern, not call-the-same-code — the wedding assert must never be generalized): re-assert eligibility (`status='published'` AND owner `public_profile_enabled`, app-side over the admin client per the documented pattern) → write `showcase_featured_at`/`showcase_feature_rank` on `creator_chapters` → `admin_audit_log` row (`storytellers.feature` / `.unfeature` / `.rank`) → in-app notification to the creator (mirror of `showcase_featured`) → `revalidatePath('/realstories')`.
4. Card renders in the Storytellers shelf instantly (revalidate) or within the 1h ISR window.
5. Any viewer reports it via `ReportPageButton` on the chapter detail → lands in the **existing `/admin/user-reports` queue** (target type `'chapter'` — no second moderation surface, per the standing solo-op red line in migration 20270812329751) → **the hide resolution atomically clears `showcase_featured_at` in the same action**. A hidden chapter can never ride out the ISR window on the public page.

**Reuse of the real-stories queue**: same Studio hub, same tab grammar, same audit+notify+revalidate spine, same "featuring never bypasses the consent gate" rule (mirror of 20261221000000:20-24) — but two independent action sets over two independent gates. Chapter→editorial "promotion" collapses into the `event_id` join: a featured chapter whose event later earns showcase consent surfaces in the editorial candidate loader automatically; no bridge feature needed.

## 5. Data/schema deltas (smallest-first)

1. **Widen `user_reports.target_type` CHECK** to add `'chapter'` (one-line ALTER on the 20270812329751 constraint). Ships **before anything else**.
2. **Two nullable columns on `creator_chapters`**: `showcase_featured_at timestamptz`, `showcase_feature_rank int` — the exact 2-column pattern of migration 20261221000000, plus a partial index `WHERE status='published' AND showcase_featured_at IS NOT NULL`. Featuring never overrides the RLS/app gates.
3. **Global published index**: `(published_at DESC) WHERE status='published'` on `creator_chapters` (today's only published index is user-scoped — 20270813337233:109-112). Powers the admin candidate list; the public lane reads only featured rows.
4. **No thumbnail column yet**: V1 derives YouTube thumbs from the normalized embed id at render time (works for the dominant provider); `teaser_r2_key` stays the deferred seam; a creator `cover_r2_key` column is added only if owner decision #6 picks uploads. Non-YouTube chapters without derivable thumbs are simply not featurable in V1 — a curation rule, not a schema change.
5. **Deferred, owner-gated**: widening the `kind` CHECK for `'debut'` (P4's "Debuts" row) — a follow-up migration once decision #4 lands.
6. **No new tables, no changes to `events`, no changes to either consent gate.**

## 6. What this changes in the existing P4 plan

Rewrite `Creator_Economy_Discount_Collab_Build_Plan_2026-07-16.md` P4 (lines 95–115) as follows:

- ~~"/realstories and /storytellers COEXIST as two shelves of one library — neither replaces the other"~~ → **"/realstories IS the library; the two shelves live on ONE page. `/storytellers` is a redirect into the Storytellers shelf. A standalone page is a possible future promotion once chapter volume outgrows the shelf — build everything route-agnostic, plan nothing standalone now."**
- ~~"a standout chapter can be promoted into a curated Real Story (admin pick, existing curation queue)"~~ → **"the existing queue is wedding-only as built (`assertEligibleShowcase` + `events` columns); chapters get their own `showcase_featured_at`/`rank` columns and a Storytellers tab in `/admin/studio` copying the audit+notify+revalidate spine. Cross-promotion = the `creator_chapters.event_id` join (cut/editorial chips), not a queue transfer."**
- "Shared machinery, not duplicated" → **stays, now precise**: genuinely shared = ShareButtons, satori/sharp OG card family (`lib/social/` gets one chapter renderer), `/admin/user-reports`, vendor crediting destination `/v/[slug]`, Studio tab-hub. Pattern-copied = curation actions. Never shared = consent gates, loaders, write paths.
- "Distinct voices kept distinct" → **stays, sharpened to tile grammar**: Chronicle nameplate is editorial-only; Storyteller badge + byline card is chapter-only.
- Launch gates → **unchanged** (see §7), plus three new pre-gates: hub metadata rewrite, thumbnail answer, report target.
- New line: **"The Storytellers shelf inherits /realstories' doorways, sitemap, and JSON-LD; chapter detail pages remain noindex; all creator SEO equity concentrates in the one hub."**

## 7. Build phases + gates

**Phase S0 — safety floor (ships first, independent of everything):** `user_reports` CHECK widening + `ReportPageButton` on `/u/[userSlug]/c/[chapterId]` + `'chapter'` handling in the `/admin/user-reports` resolution (hide path stubs the unfeature clear). Also drop `ShareButtons` onto the chapter detail. *No gate — this is owed to the already-live chapter pages regardless of P4.*

**Phase S1 — curation spine (dark, no public change):** migration (columns + indexes, §5 items 2–3) · Storytellers tab in `/admin/studio` with candidate list + feature/unfeature/rank actions + audit/notify/revalidate spine · report-hide atomically unfeatures. Owner can start hand-picking before anything is public.

**Phase S2 — card + OG kit (dark):** chapter→GalleryItem-variant mapper (route-agnostic) · Storyteller tile variant (BoomerangVideo/thumb reuse) · YouTube-thumb derivation · chapter OG renderer in `lib/social/` + `/api/og/chapter/[publicId]` route. *Gate: owner decision #6 (thumbnail source).*

**Phase S3 — the shelf goes live on `/realstories`:** hub metadata/JSON-LD rewrite lands in the same PR as the shelf · shelf renders only when ≥1 featured chapter exists · cross-rail chips via `event_id` · `/storytellers` redirect · homepage gallery storyteller row. *Gates (unchanged from P4): (a) ~10–20 real published chapters exist, (b) Phase S0 + S1 shipped, (c) P2 attribution live, (d) owner decisions #1–#5 signed.*

**Phase S4 — only if earned (no date, no budget now):** standalone `/storytellers` page + doorway kit, if chapter volume outgrows the shelf. The route-agnostic discipline in S1–S2 makes this loader-plus-doorways.

## 8. Owner decisions needed

1. **Ratify the architecture change**: your 2026-07-16 P4 spec says side-by-side pages; the council verdict is one hub + shelf + redirect. Sign off on rewriting P4 per §6 (this reverses your written position — flagged per the surface-don't-silently-change rule).
2. **SEO posture**: approve the `/realstories` metadata/JSON-LD rewording to cover self-published chapters (chapter detail pages stay noindex — only the hub's identity widens).
3. **Badge word**: Creator / Storyteller / Kwentista — it names the shelf, the card badge, the admin tab, and the redirect slug. (Blocking S2/S3 copy, not S0/S1.)
4. **Non-milestone kinds on the hub**: (a) travel+food+lifestyle allowed, shelf-scoped chips only (growth seat), or (b) V1 admits wedding+travel only, food/lifestyle stay `/u`-profile-only (solo-op seat, smaller abuse surface). Chair leans (b) for V1.
5. **Vendor tier-gate juxtaposition**: editorial credit chips are a Pro/Enterprise perk (`editorialTagged`); chapter shoppable vendors are any-visible. One page puts both in view — bless the framing "chapter mention free, editorial chip is the Pro badge," or align the gates.
6. **Thumbnail source**: YouTube-derived thumbs now (non-YouTube chapters unfeaturable in V1) vs ship the deferred teaser render vs add a creator cover upload column. Chair recommends YouTube-derived now, teaser later.