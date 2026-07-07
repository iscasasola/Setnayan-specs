# Setnayan Website Master Plan
*Lead architect synthesis — 2026-06-28. Authored against live `www.setnayan.com` + shipped code on `origin/main`, NOT the historical `0015_main_website.md` spec. Produced by a 13-agent workflow: 6 discovery lenses → 3 competing architectures → adversarial judging → synthesis.*

---

## 0. UPDATE 2026-06-28 — Repositioned around the all-events + memory proposition (owner-locked)

> This block supersedes the wedding-first framing in §§1–10 wherever they conflict. The plan's *mechanics* (free-floor, doorway system, funnel, SEO, roadmap, locks) all stand; the *headline story* changes from "wedding planning" to "every event + memory."

**The unique proposition (owner-stated 2026-06-28):** Setnayan is the one home for **every event in your life** — from the simplest dinner with friends, to a 3-day family trip, to the most elaborate wedding — built on five pillars:
1. **Widest variety of events** in the market (pick your event type and go).
2. **Planning tools + AI** that find the services best-suited to *that* event.
3. **In-app features** (Papic, Live Studio, Pakanta, Monogram…) that work standalone, for any event.
4. **A memory dashboard** to create and collect the memories of every event you hold (Alaala).
5. **Editorials for every kind of event** (Real Stories — already shipped all-events, 2026-06-18).

**Positioning posture (owner-locked):** *Lead all-events; weddings deepest.* Headline the breadth. Weddings is the fully-live, fully-bookable path. Other event types are selectable where built — note the **"Simple Event" type (dinner / small gatherings) is PR-merged but its activation migration is pending owner SQL**, and other types are admin-driven — and otherwise show an **honest "rolling out" state**, never a dead end. Big story, no over-promising. This is a deliberate, owner-signed **extension of the locked V1 wedding-first scope** (logged in `DECISION_LOG.md` 2026-06-28).

**The three-act spine (replaces the two-register frame):** homepage + brand now read as **Plan → Celebrate → Remember** — the actual life of an event. Free planning still leads the functional register; the free-floor lock is unchanged.

**Chosen look (owner-validated via mockups):** the **hybrid** — a cinematic full-bleed **Obsidian hero** (home of the existing scroll-scrub logo video) + a numbered **editorial spine** down the body. Tokens confirmed: Warm Alabaster `#FBFBFA`, Deep Obsidian `#1E2229` (text + buttons), Champagne Gold `#C5A059` hairline-only; Instrument Serif + Geist.

**Repositioned homepage blueprint (supersedes §4):**
1. **Cinematic hero (Obsidian).** Eyebrow "Set na 'yan." → serif **"Plan any event. Keep every memory."** → sub (the dinner→travel→wedding breadth line) → **"What are you planning?" event chips** (Wedding · Debut · Birthday · Christening · Travel · Reunion · Dinner · Corporate — only live types active; rest "rolling out") → primary **"Start free"** → quiet "see a real event →". Chips = breadth proof + direction device (route by event type into onboarding).
2. **01 · Plan** (light). Free tools for any event + the Setnayan AI match card ("best-suited to yours, and shows you why").
3. **02 · Celebrate** (light). In-app features grid — each standalone, for any event.
4. **03 · Remember · Alaala** (Obsidian band). The **memory dashboard** — create + collect every event's memories into one living keepsake. Elevates Alaala from manifesto page → productized dashboard surface (see §6).
5. **Real Stories — every kind of celebration** (light). Editorial cards tagged by event type. Already all-events in code.
6. **Close.** "Set na 'yan. — Whatever you're planning, that's all set." + Start free. Footer: Plan · Celebrate · Remember.

**Deltas to the rest of the plan:** §3 IA — add the hero **event-type chip router**; `/alaala` is now the **memory-dashboard** doorway (not just manifesto) and **= the combination of the five Pa- services: Papic + Panood + Pawebsite + Pa3D + PaLogo** (owner 2026-06-28); Real Stories stays all-events; nav unchanged (6-link). §6 — reframe Alaala "co-headline" → **"03 · Remember,"** the memory-dashboard act. §9 — all-events positioning is **DECIDED**; new dependency = Simple Event activation migration (owner SQL) + which event types are live enough to be active chips. §10 — Phase 2 adds the **event-chip router** + honest **"rolling out"** state; Phase 1 `/alaala` becomes the **memory-dashboard** doorway.

---

## 1. Executive summary

Setnayan wins the cold-start by being the **most generous free planning platform in the Philippines** — and wins the *brand* by being the only one that turns a wedding into a **living memory (Alaala)** no competitor can structurally copy. The strategic bet is therefore **two-register, not two-front**: free planning + free 4-in-1 website + free vendor browse stay the **functional acquisition headline** (the Bridalpod/WedPlanner-beating, SEO-able funnel that drives anon-draft signups toward the ₱3,999 Setnayan AI paywall), while **Alaala becomes the emotional co-headline** and each independent service (Papic, Live Studio, 3D Event Designer, Pawebsite, Animated Monogram, Pakanta, Save-the-Date) gets its own **standalone SEO doorway**. The doorways are made **co-equal at the discovery and SEO level** — via the homepage service strip, the footer "In-app services" column (already shipped), and `/features` cross-links — *without* reordering paid media in front of free planning in the primary hero (that would break the free-floor and the two-sided cold-start). Roughly 70% of this is already built in code (8 doorways ship; the AlaalaOrb ships; the paywall is live) — the work is **surfacing, four new doorway pages, one IA reconciliation, and a co-headline homepage band**, not greenfield construction. The single highest-leverage move is to **build `/alaala` and elevate it to a homepage co-headline**, because the owner-declared winning pillar currently lives buried inside `/our-story`.

---

## 2. Strategic principles (locks as design rules + the two-register thesis)

**The two-register thesis.** The homepage carries two headlines in sequence, not two competing front doors:
- **Functional register (acquisition, first in scroll):** "Plan your whole wedding — free." Free planning + free website + free vendor browse. This is the row Bridalpod/WedPlanner can't beat (WedPlanner caps free at 25 guests; Bridalpod is ad-funded).
- **Emotional register (differentiation, co-headline):** "A new way to remember." Alaala — capture + presence + stories + keepsake fused into one living memory. This is the *category* no rival owns.

**Locks restated as enforceable design rules:**

| Lock | Design rule on every public surface |
|---|---|
| **Free-floor (2026-06-20)** | Homepage leads with free planning + free vendor browse. AI = the upgrade that *finds/sorts*, never gates discovery. Never display a comparison row Setnayan loses to Bridalpod. |
| **Pricing (admin-managed)** | **Never hardcode** ₱3,999 / ₱799 / ₱1,999 etc. in any marketing page. Reference the SKU, link to `/pricing`. Positioning: "Every Setnayan service is free to use; some have upgrades." |
| **Public-surface hygiene** | Benefit/feeling copy only. AI = "Setnayan AI" (never name the model). Warm Filipino voice, EN-primary. Vendor hybrid-anonymity (Free/Verified names hidden until first chat reply). |
| **Single shared nav** | ONE `app/_components/marketing/site-nav.tsx`, label-only, auto-hides on scroll-down. No second nav, no per-page forks. |
| **Per-service = separate entity (2026-06-03)** | Each service is its own flat card/page on the public site (no marketplace grouping). The doorway system *is* this lock extended. |
| **No-login / no-paywall onboarding (2026-06-21)** | All CTAs route to `/onboarding/wedding`. No signup or paywall step before or inside the flow. Onboarding ends free on the persona reveal. |
| **Consent + spoiler-safety (RA 10173)** | Social/Real Stories proof = **consented, post-event, couple-only-faces** content. Never imply guest-captured or pre-event content is auto-shared. |
| **No rendered-video promises** | Render pipeline is owner-blocked. Alaala/Pakanta/Patiktok sell **presence/keepsake/feeling**, not produced-video deliverables. Label render-dependent SKUs "coming soon." |

**The discipline line (do not cross without flagging):** co-equal billing for services and Alaala is safe and additive. **Demoting free planning behind paid media in the primary hero is an owner-sign-off reversal** of the free-floor + cold-start posture. This plan does NOT do that.

---

## 3. Information architecture / sitemap

**Top nav (shipped 5-link set, reconciled to 6):** `[What you get (/features) · Explore (/explore) · Alaala (/alaala) · For vendors (/for-vendors) · Real Stories (/realstories) · Journal (/blog)]` + Sign in + primary **"Start planning — free"** CTA. *(Two flagged changes from shipped — see §9.)*

**All independent-service doorways live in the FOOTER "In-app services" column + homepage service strip + `/features`, NOT the top nav** — honoring "keep it simple."

| Route | Title | Role | Status | What changes |
|---|---|---|---|---|
| `/` | Home | Acquisition front door: hero → free-floor proof → Setnayan AI → **Alaala co-headline** → service strip → comparison → Real Stories | **restructure** | Hero copy → free-floor-led; add Alaala band + service strip + comparison |
| `/features` | What you get | Free-floor + comparison grid + folded pricing; the page that wins every Bridalpod row | **restructure** | Restore to nav; build comparison surface; give dead tiles (Save-the-Date, Pakanta, Mood Board) live hrefs |
| `/explore` | Explore | Search-first vendor + service marketplace | exists | Nav `Explore` href → `/explore` directly (drop the `/vendors` 308 hop) |
| `/for-vendors` | For vendors | Supply-side acquisition; lead "0% commission — keep 100%" | exists | Confirm Solo ₱2,000 in public copy (§9) |
| `/alaala` | **Alaala** | **NEW** umbrella memory doorway + co-headline destination; reuses `AlaalaOrb` | **new** | Highest-leverage build |
| `/our-story` | Our story | Living-Memories manifesto (narrative home; `/alaala` is the productized doorway linking from it) | exists | Stays; deep-linked from `/alaala` |
| `/about` | About | SEO/GEO Organization surface (PH-first) | exists | Footer/sitemap deep-link, not top nav |
| `/realstories` | Real Stories | Consented post-event editions; social proof + SEO | restructure | Canonical; footer link → `/realstories` (drop `/weddings` 301 hop) |
| `/blog` | Journal | Planning-education SEO engine | exists | Kept in nav |
| `/papic` | Papic | Standalone doorway (guest candid capture) | exists | Polish: sample gallery, free-5-cameras CTA |
| `/panood` | Live Studio | Standalone doorway (livestream / OFW presence) | exists | Free single-cam vs paid multicam framing; flag YouTube-OAuth dependency |
| `/palogo` | Animated Monogram | Standalone doorway (animated mark) | exists | Cross-link `/monogram` ↔ `/palogo` |
| `/monogram` | Monogram maker | FREE no-login lead-magnet tool | exists | Template pattern for new lead-magnet doorways |
| `/pawebsite` | Wedding Website | Standalone doorway (4-in-1 free site + PRO) | exists | Strengthen FREE framing; add live sample link |
| `/pa3d` | 3D Event Designer | Free 2D seat plan + paid 3D walk-through | exists | Lean on "seat plan stays free" alongside 3D angle |
| `/patiktok` | Patiktok | Vertical reels (Papic add-on) | exists | Flag render-pipeline dependency; "coming soon" if unwired |
| `/setnayan-ai` | Setnayan AI | Monetized engine doorway; first-paywall SEO page | exists | Keep as secondary monetized layer |
| `/pakanta` | Pakanta | **NEW** standalone doorway (custom song) | **new** | Flag render/audio-pipeline dependency before over-promising |
| `/save-the-date` | Save the Date | **NEW** doorway (free content film + cinematic reveal) | **new** | Autoplaying reveal demo; fixes dead `/features` tile |
| `/mood-board` | Mood Board | **NEW** free no-login palette lead-magnet (mirror `/monogram`) | **new** | Demonstrates "one palette → every piece" |
| `/why-setnayan` | Why Setnayan | Differentiation GEO surface | exists | Footer/sitemap deep-link |
| `/how-it-works` | How it works | Role cheat-sheet | restructure | **Fix the HTTP 500 / nav-orphan**; footer deep-link |
| `/pricing` | Pricing | Live tier + à-la-carte catalog | exists | Folded into `/features` + footer |
| `/onboarding/wedding` | Start planning | No-login no-paywall persona quiz → anon-draft → free dashboard | exists | The conversion engine; all CTAs route here. Unchanged. |
| `/signup`, `/login`, `/help`, `/download`, `/privacy`, `/terms` | — | Account/support/legal | exists | Unchanged |

**IA hygiene fixes folded in:** (1) `Explore` nav href `/vendors`→`/explore` direct; (2) footer `Real Stories` `/weddings`→`/realstories` direct (`apps/web/app/features/_sections/_SiteFooter.tsx:60`); (3) fix or remove `/how-it-works` (500); (4) designate `/our-story` as canonical narrative, `/about` + `/why-setnayan` as SEO deep-links.

---

## 4. Homepage blueprint (ordered, section-by-section)

The scroll-scrub logo hero shell is **owner-locked and unchanged**. Below it, free planning headlines the functional register; Setnayan AI is framed as the upgrade; Alaala co-headlines the emotional register; services surface as a strip; comparison closes the argument.

> **Conversion guardrail:** every section has a secondary link, but **"Start planning — free" must remain the single visually-dominant CTA above the fold and recur as the primary action in §2 and §6.** Do not let the 7-section length dilute it (flagged risk).

**Section 1 — Scroll-scrub hero (logo video) — unchanged shell**
- *Purpose:* preserve the brand's one signature moment (admin-uploaded scroll-scrub video = animated logo, full-screen). `HeroVideoScrub`.
- *Copy:* headline anchored on the FREE floor — **"Plan your whole wedding — free."** Sub: *"Unlimited guests, unlimited RSVP, your own wedding website. No card, no caps."* Keep *"Set na 'yan."* as the brand-origin tagline. (Replaces the current vendor-matching-led hero copy — flagged §9.)
- *CTA:* **Start planning — free** → `/onboarding/wedding`.

**Section 2 — "No spreadsheets. No caps." free-tool proof band** (`PostHeroReveal`)
- *Purpose:* deliver the acquisition argument immediately so a Bridalpod/WedPlanner shopper sees Setnayan out-frees both.
- *Copy:* *"Everything you need to plan — free forever"* over the free-tool chips (Guest List · Seat Plan · Budget · Timeline · Mood Board · Checklist · Save-the-Date · Couple Website + unlimited RSVP). One line: *"Truly unlimited — no 25-guest wall, no trial clock."*
- *CTA:* **Start planning — free**; inline secondary *"See everything you get →"* `/features`.

**Section 3 — Setnayan AI band — "Stop choosing. Get matched."**
- *Purpose:* introduce the monetized engine as the natural step *after* the free floor; seed the paywall narrative without paywalling discovery.
- *Copy:* *"A thousand vendors. One that fits your budget, faith, and city — matched, with reasons you can see."* Frame: **Free = you browse; Setnayan AI = it finds.** Explicitly state browsing/inquiring/chatting/booking vendors is free. **No price on the homepage.**
- *CTA:* **Find your vendors** → `/explore`; secondary *"How matching works →"* `/setnayan-ai`.

**Section 4 — Alaala co-headline band — "A new way to remember"** *(NEW)*
- *Purpose:* the emotional differentiator + uncopyable moat — Alaala's first homepage co-headline.
- *Copy:* *"Everyone gives you a record. We give you an Alaala — a memory that moves."* Reuse the existing `AlaalaOrb` component with consented post-event couple clips. Name the four ways one builds it: **capture (Papic) · presence (Live Studio) · stories (Kwento) · keepsake (Editorial).** Honor "presence over production" — sell feeling, never rendered-video deliverables.
- *CTA:* **See how memory works** → `/alaala`.

**Section 5 — Independent services strip — "Each one stands on its own"** *(NEW)*
- *Purpose:* surface standalone doorways on the homepage for the first time — co-equal at the discovery level, as a horizontal card strip *below* the free funnel.
- *Copy:* card strip — Papic (*"guests become the photographers"*) · Live Studio (*"everyone who can't be there, there"*) · Animated Monogram (*"your mark, drawn to life"*) · Couple Website (*"the front-page story of your day"*) · 3D Event Designer (*"walk your reception before the day"*) · Pakanta (*"an original song from your love story"*). Each: one benefit line + *"Use it standalone — or plan your whole wedding free."*
- *CTA:* per-card **Explore [service]** → `/papic`, `/panood`, `/palogo`, `/pawebsite`, `/pa3d`, `/pakanta`.

**Section 6 — "See what sets us apart" — comparison + 0% commission**
- *Purpose:* close the acquisition argument with locked comparison rows + the vendor-supply wedge.
- *Copy:* two columns. **"Free, and actually unlimited"** (unlimited RSVP · free 4-in-1 site · browse/chat/book vendors) shown as *matched*; then **"Only on Setnayan"** (living memory · livestream for family abroad · custom song · 0% commission). **Never display a row Setnayan loses to Bridalpod.**
- *CTA:* **Start planning — free**.

**Section 7 — Real Stories proof + footer**
- *Purpose:* consented post-event content as compliant social proof + SEO; footer carries every service doorway.
- *Copy:* *"The front-page story of their life"* — newspaper-style edition spotlight. *(Note: sample-only until real editorials begin Dec 2026 — funnel leans on §2 free-tool proof + §6 comparison meanwhile.)*
- *CTA:* **Read a real wedding** → `/realstories`; footer: **Start planning — free**.

---

## 5. The standalone service-doorway system

**Repeatable doorway template** (clone the proven shipped `/papic` · `/panood` · `/pawebsite` scaffold):
1. **Server Component, `force-static`, `revalidate=3600`.**
2. **Metadata:** OG + Twitter card.
3. **JSON-LD:** `SoftwareApplication` + `FAQPage` (the GEO surface for AI answer engines).
4. **Hero:** line-reveal headline on a real `<h1>` + one benefit line; a signature visual where the service is visual (Save-the-Date reveal loop, Pakanta audio player, 3D Event Designer clip).
5. **Free taste above the fold** where one exists (3 free monograms, free Papic trial, free single-cam Live Studio, free content film, free 2D seat plan, free palette).
6. **Benefits + FAQ** in benefit/feeling language — **no model names, no hardcoded price** (link to `/pricing`).
7. **Cross-link:** *"Use it standalone — or plan your whole wedding free."*
8. **Shared `SiteFooter`**, single nav via `NAV_ROUTES`.
9. **CTA routes into the SAME anon-draft onboarding** (`/onboarding/wedding`) — never a per-service signup silo.
10. **Deliverability honesty:** label render-blocked SKUs "coming soon"; link to the doorway's own page + in-app setup, **NOT** Explore search (first-party `setnayan_*` returns an empty grid until provisioned).

**Per-service doorway table:**

| Route | What it sells | Free taste vs paid | SEO/GEO intent | Status |
|---|---|---|---|---|
| `/papic` | Guests become the photographers; every candid in your gallery by morning | Free: first 5 guest cameras · Paid: seat packs (`PAPIC_SEATS`) | "wedding guest photo app", "disposable camera wedding alternative", "guest candid photos PH" | exists — polish |
| `/panood` | Your wedding live; everyone who can't be there, there | Free: single-cam broadcast · Paid: multicam control room (`PANOOD_SYSTEM`) | "live stream wedding Philippines", "wedding livestream for OFW family abroad" | exists — flag YouTube-OAuth |
| `/pawebsite` | The front-page story of your day; 4-in-1 site + unlimited RSVP | Free: full 4-in-1 site + RSVP · Paid: Couple Website PRO | "free wedding website Philippines", "wedding website with RSVP" *(highest free-intent volume)* | exists — strengthen FREE |
| `/palogo` + `/monogram` | Your mark, drawn to life | Free: no-login vector monogram maker · Paid: Animated Monogram (`ANIMATED_MONOGRAM`) | "free wedding monogram maker", "wedding logo maker" | exists — cross-link |
| `/pa3d` | Walk your reception before the day | Free: 2D seat plan · Paid: 3D walk-through | "3d wedding seating plan", "wedding table planner" | exists — add free angle |
| `/setnayan-ai` | The planner that finds your perfect vendors | Free: generic browse + match preview · Paid: ranked, reasoned shortlist (first paywall) | "wedding planner app Philippines", "find wedding vendors" | exists — secondary layer |
| `/patiktok` | Polished vertical reels, ready to post | Paid (`PATIKTOK_COMPILER`) | "wedding tiktok reels", "wedding highlight reel maker" | exists — flag render pipeline |
| **`/save-the-date`** | The reveal that opens your invitation, in your colors, and plays itself | Free: 7-beat content film · Paid: cinematic openings (`STD_PREMIUM_OPENINGS`) | "animated save the date", "digital wedding invitation video" *(visual/Pinterest/IG referral)* | **NEW** |
| **`/pakanta`** | An original song written from your love story — yours to keep | Paid (`PAKANTA`) | "custom wedding song", "personalized wedding song Philippines" *(low PH competition)* | **NEW — flag render/audio pipeline** |
| **`/mood-board`** | One palette → every piece | Free no-login palette extractor (lead magnet) | "wedding color palette generator", "wedding mood board maker" | **NEW** |
| **`/alaala`** | Capture + presence + stories + keepsake → one living memory | Umbrella (no single SKU); links to each member doorway | brand "Alaala", "living wedding memories", "remember your wedding" | **NEW — highest leverage** |

---

## 6. Alaala elevation — "A new way to remember" as co-headline

**Definition (owner 2026-06-28):** Alaala = the **combination of the five Pa- services** — **Papic + Panood + Pawebsite + Pa3D + PaLogo** — woven into one living memory. Each stands alone (its own doorway); together they *are* the Alaala. (This replaces the earlier Capture/Presence/Stories/Keepsake framing.)

Alaala is elevated **three ways, routed THROUGH the pillar** (not as five disconnected silos), without breaking free-floor ordering:

1. **Homepage co-headline band** (Home §4) — placed *after* the free-planning/AI funnel argument so it headlines the **emotional register** while free planning headlines the **functional register**. Carries the already-built `AlaalaOrb` (`apps/web/app/_components/marketing/AlaalaOrb.tsx`) with real consented post-event couple clips.
2. **NEW standalone `/alaala` umbrella doorway** — productizes the pillar (today it lives only inside `/our-story` + the orb). Names the **five Pa- services (Papic · Panood · Pawebsite · Pa3D · PaLogo, numbered 01–05)**, each linking to its own live doorway, gathered into one living memory. **✅ SHIPPED** (PR #2366 + definition correction #2369), reuses the `AlaalaOrb`, registered in `NAV_ROUTES` + footer.
3. **Nav rename "Our story" → "Alaala"** pointing at `/alaala`; the Living-Memories manifesto is preserved at `/our-story`, deep-linked from `/alaala`.

**Guardrails:** Alaala stays a **co-headline/second-fold band, never the primary acquisition hero** (free planning leads the functional register). Honor *"the essence of the wedding will never be ruined / presence over production"* — sell feeling and keepsake, not rendered-video deliverables (render pipeline owner-blocked). Kwento and produced-output keystones are **spec-only today** — label "coming soon," do not promise output on the doorway.

This is **directly sanctioned by the locked Alaala Lane 1 plan** (name Alaala in live marketing `/our-story` + homepage teaser) — it is surfacing + relabeling work, the lowest-cost / highest-leverage elevation available.

---

## 7. Conversion funnel + monetization

**Couple side:**
> Cold visitor (SEO / FB ad / social) → lands on `/` **or** a service/tool doorway (`/pawebsite`, `/monogram`, `/mood-board`, `/setnayan-ai`, any `/pa*`). Every surface's dominant CTA = **"Start planning — free"** → `/onboarding/wedding`.
> → **No-login, no-paywall persona quiz** (experience-quiz LIVE) mints an anonymous `auth.uid()` at finish → drops into a **fully-usable FREE dashboard** (first value, zero friction, zero card).
> → Inside: free plan tools + free 4-in-1 website + free vendor browse/inquire/chat/book.
> → **"Secure your plan"** nudges (`SecureAccountBanner` + just-in-time `SaveToContinue`) convert anon→registered at natural triggers (message a vendor · pay · invite co-host · publish/claim slug · receive email · return on another device) — **same uid converted in place, no merge.**
> → **FIRST PAYWALL = Setnayan AI ₱3,999** (LIVE in prod; DB toggle). Soft-gate: free generic browse + match preview; pay to unlock the ranked, reasoned shortlist. **Vendor discovery itself is never paid** (protects the Bridalpod free-browse comparison row).
> → **Per-SKU paid media** (Papic, Live Studio, Pakanta, Animated Monogram, Couple Website PRO, Cinematic Reveal) **auto-surface inline in-context when relevant** (paid-features-auto-show lock) → upsell tail. Bundles (Essentials, Complete) live in the dashboard, never in onboarding.

**One account model:** lead-magnet free tools (`/monogram`, `/mood-board`) and every service doorway feed the **same anon-draft account** — co-equal front doors, ONE account, no per-service silo. **Every new anon-minting doorway MUST pair with the "Secure your plan" nudge** (the cookie-clear/device-switch data-loss hole widens with each doorway).

**Vendor side:**
> `/for-vendors` leads with **"0% commission — keep 100% of every booking"** (the cleanest contrast to the universal pay-to-be-seen directory model). Free verification during launch. Transparent flat subscriptions: **Solo ₱2,000 / Pro ₱6,000 / Enterprise ₱10,000 per 28 days** (admin-managed; confirm Solo in public copy — §9). More vendors → richer `/explore` → better couple acquisition (the two-sided cold-start engine). This is *why* paid media must stay below the free funnel: vendor supply depends on couple demand built by the free floor.

**Real Stories + Journal** recirculate consented content as SEO/social fuel back to the top of the funnel.

---

## 8. SEO / GEO / social strategy

**Two-tier play.**

**Tier 1 — funnel-first, highest volume (own the free-intent queries competitors gate or cap):**
- "free wedding website Philippines", "wedding website with RSVP", "wedding planning tool Philippines", "unlimited guest list free" → landed on `/pawebsite` + `/features` + `/`, where the **no-cap free floor** is the differentiator vs WedPlanner's 25-item caps and Bridalpod's ad model.
- **Lead-magnet free tools** (`/monogram`, `/mood-board`) capture "wedding monogram maker" / "wedding color palette generator" tool-search → convert to anon drafts.
- **Programmatic white-space** (owned by blogs/directories today, not platforms): **`[category]-in-[city]`** (Manila / Cebu / Davao) and **"how much does [category] cost in the Philippines"** / "average wedding cost Philippines 2026" — fed by real **0%-commission vendor data**, so price transparency is a moat blogs can't match. *(Dependency: requires first-party + verified vendor listings provisioned and visible in `/explore`.)*

**Tier 2 — differentiation / GEO for AI answer engines:** the independent-service doorways carry `SoftwareApplication` + `FAQPage` JSON-LD and own media-intent queries no platform ranks for — "wedding livestream Philippines / for family abroad" (`/panood`, OFW wedge), "wedding guest photo app / disposable camera alternative" (`/papic`), "custom wedding song" (`/pakanta`), "animated save the date" (`/save-the-date`), and brand "Alaala / living wedding memories" (`/alaala`). The GEO moat is structural: **no competitor has the services to be cited *for*.** `/about` + `/why-setnayan` + `/how-it-works` remain GEO Organization/differentiation surfaces.

**Brand SEO engine:** Real Stories + Journal = the "expert advice" surface every rival runs. Homepage emits a `WebSite` `SearchAction` → `/explore?q=` for sitelinks search.

**Social:** FB auto-publish is LIVE; the July 1 FB ads program leans on an L3 conversion video → `/` "Start planning free." **Meta Pixel + signup-conversion event must be installed before July 1** or retargeting/lookalikes are starved (§9). V1 virality is **consented, post-event, couple-only-faces** — Real Stories is the compliant substitute for a guest-driven viral loop; never imply guest/pre-event content is auto-shared.

---

## 9. Open decisions requiring owner sign-off

1. **FLAGGED REVERSAL — restore `/features` ("What you get") to the top nav.** Reverses the 2026-06-14 "features-in-homepage-reveal" call. Minor; serves the funnel (it's the cleanest top-of-funnel link and folds pricing). *If denied:* `/features` stays in the homepage reveal + footer and the nav keeps 5 links.
2. **FLAGGED COPY CHANGE — hero from vendor-matching-led → free-floor-led.** Not a structural reversal, but the hero is the single highest-leverage acquisition surface. Recommend **A/B test or explicit confirm** before swapping the live "find your perfect fit" hero.
3. **Nav rename "Our story" → "Alaala"** pointing at new `/alaala` (manifesto preserved at `/our-story`). Confirm the relabel.
4. **NET-NEW STRATEGY (no corpus precedent) — "independent services as co-equal front doors."** This is a deliberate pivot, recommended in its **Alaala-routed, doorway-level co-equal** form (not homepage-billing-level ahead of free planning). Needs an explicit owner decision + a `DECISION_LOG.md` row. *(Note: per-service standalone pages are already sanctioned by the 2026-06-03 "separate entity" lock — that piece needs no reversal.)*
5. **Vendor Solo ₱2,000 in public copy** — live on `/pricing` + `/for-vendors`, but the strategy summary cites only Pro/Enterprise. Confirm it belongs in public-facing tier copy.
6. **Deliverability gating** — confirm whether Pakanta / Patiktok / SDE and free single-cam Live Studio are deliverable in prod, or whether their doorways ship with "coming soon" until the render pipeline / YouTube-OAuth land.
7. **NOT REVERSED (preserved explicitly):** paid media stays **below** the free funnel in the hero. No paid-media-first homepage.

---

## 10. Phased build roadmap (Claude-Code time)

Each phase = shippable PRs, each with a `changelog.d/<slug>.md` fragment, auto-merged per the standing default. Routes/files cited where discovery surfaced them.

### Phase 0 — IA hygiene + discoverability (copy/wiring only; no owner reversal needed)
*Smallest, safest, immediate. ~1 short CC session.*
- **PR 0.1** Fix footer stale link: `apps/web/app/features/_sections/_SiteFooter.tsx:60` `/weddings` → `/realstories` direct (drop the 301 hop). *(Footer `FEATURE_LINKS` services column already ships — lines 13–20 — correcting the earlier "must build it" assumption; verify it renders, confirm `/setnayan-ai` is present, `/monogram` cross-link intact.)*
- **PR 0.2** Nav `Explore` href `/vendors` → `/explore` direct in `site-nav.tsx` (drop the 308 hop).
- **PR 0.3** Fix or remove `/how-it-works` (HTTP 500); footer/sitemap deep-link if kept.
- **PR 0.4** Give the dead `/features` grid tiles (Save-the-Date, Pakanta, Mood Board) live hrefs (point at the new routes shipped in Phase 1).
- **PR 0.5** Confirm Meta Pixel + signup-conversion event installed before July 1 (measurement safety net).

### Phase 1 — Build the 4 missing doorways (new pages, proven scaffold)
*Highest leverage. Each clones the `/papic` template (§5).*
- **PR 1.1 — `/alaala`** (the single highest-leverage build): umbrella doorway reusing `AlaalaOrb`, narrating capture/presence/stories/keepsake → one living memory, linking to each member doorway. Co-headline destination.
- **PR 1.2 — `/save-the-date`**: autoplaying reveal demo (veil/flaps/doors) hero; free content film vs cinematic openings; fixes the dead `/features` tile. Most shareable visual.
- **PR 1.3 — `/mood-board`**: free no-login palette extractor lead-magnet (mirror `/monogram`); demonstrates "one palette → every piece."
- **PR 1.4 — `/pakanta`**: audio-player hero with a sample song. **Gated on deliverability (§9.6)** — ship with "coming soon" if the audio pipeline is unwired.
- *Each:* `force-static`, OG/Twitter, `SoftwareApplication`+`FAQPage` JSON-LD, no hardcoded price, CTA → `/onboarding/wedding`, "use standalone OR plan free" cross-link.

### Phase 2 — Homepage restructure (`apps/web/app/page.tsx` + components)
*Touches the highest-leverage acquisition surface; carries the flagged reversals — gated on §9.1/9.2 sign-off.*
- **PR 2.1** Hero copy → free-floor-led (`HeroVideoScrub` shell unchanged) — **behind §9.2 confirm / A-B**.
- **PR 2.2** Add **Alaala co-headline band** (Home §4) using `AlaalaOrb` with consented clips.
- **PR 2.3** Add **independent services strip** (Home §5) — 6 cards linking the real doorways.
- **PR 2.4** Add **comparison + 0% commission** section (Home §6) — never a row lost to Bridalpod.
- **PR 2.5** Nav reconciliation in `site-nav.tsx`: add `What you get`/`/features` (§9.1), rename `Our story`→`Alaala`/`/alaala` (§9.3) — **behind sign-off**.
- *Pressure-test:* "Start planning — free" stays the unambiguously dominant above-the-fold CTA.

### Phase 3 — Polish, SEO scale, doorway depth
- **PR 3.1** Doorway polish: `/papic` sample gallery + free-5-cameras CTA; `/panood` free-vs-paid framing; `/pawebsite` live sample site link; `/pa3d` 3D demo clip; `/palogo`↔`/monogram` cross-links.
- **PR 3.2** Build `/features` comparison surface (the public Bridalpod-beating grid) + fold pricing.
- **PR 3.3** Programmatic SEO: `[category]-in-[city]` + "cost of [category] Philippines" pages — **gated on first-party + verified vendor listings provisioned in `/explore`** (flagged dependency).
- **PR 3.4** `WebSite` `SearchAction` → `/explore?q=` JSON-LD on homepage; `/realstories` editions as they go live (real editorials Dec 2026).
- **PR 3.5** Resolve inherited copy mismatches: homepage free-tools count vs `/pricing` free-tier; open couple-side Contracts price/tier.

**Corpus note (per direct-edit authorization):** once the owner signs off on the net-new "co-equal front doors / Alaala co-headline" direction (§9.4), log it as a fresh row at the bottom of `DECISION_LOG.md`; treat `0015_main_website.md` as historical (code/live = canonical).
