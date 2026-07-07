# In-App Services — Consistency Plan (2026-06-25)

> **Status:** PLAN for owner review. No code changed yet. Written after a 17-agent audit of all 14 in-app services + the launcher + the "learn more" pattern (workflow `wf_f773e545-682`).
> **One owner decision already made (2026-06-25):** Animated Monogram = **MERGE** the free maker + the paid animation into one surface (not a repoint). Baked into Tier 5 below.
> **Still owner's call (flagged in §7):** Supplies status, and how to handle Papic/Panood placeholder screens.

---

## 1. The problem, in plain English

The Studio (in-app services hub) *feels* inconsistent — how services are listed, how you open + learn about them, and what you see when they open. The audit confirms it, but the cause is good news: **the foundation is solid** (one shared master list of services, shared card/page components, prices from the live admin catalog). The inconsistency is a layer of **one-off exceptions** bolted on top — individual services special-cased in code instead of just *declaring what they are* on the master list. Fix the exceptions and the foundation carries the rest.

## 2. What's actually good (don't touch)

- **One catalog** (`add-ons-catalog.ts`) — every service is one row.
- **Shared components** — `StudioAppRow`, `StudioFeaturedCard`, `AddOnDetailView`, `AppStoreLayout`, the shared `InlineCheckoutDrawer` (the locked checkout primitive), and a single badge resolver `pillFor()`.
- **Live admin pricing** + shared ownership readers already exist.

So this is a **consistency sweep, not a rebuild.**

## 3. The three inconsistencies (your three axes)

**(A) How they're listed / managed — the status tag lies.**
- Paid services **with no `serviceKey`** (Panood, Save-the-Date, Patiktok) can *never* flip to **Active/Pending** — they're stuck showing a buy-style **"Get"** even after purchase. → *paid-features-auto-show is silently broken at the grid for them.*
- Free tools that omit `tier:'free'` (Save-the-Date film, Photo Delivery) show a money-style **"Get"** → **free looks paid.**
- Mis-placement/mis-pricing: Pakanta (a song) sits under *Branding*; Papic shows a "Free to try" pill instead of its real paid price.

**(B) How you open + learn about them — decided by hardcoded exceptions, not a rule.**
- Default (good): card → `/studio/about/[key]` learn-more page → CTA → the tool.
- Exceptions break it: Panood / Seating / Supplies / website-parts skip the learn-more page; Patiktok skips it *only when owned*; **Animated Monogram's learn-more CTA routes to the WRONG page** (`/monogram`, the free maker) so its paid page is an orphan — **the purchase is broken (lost revenue)**; Supplies/Seating have no learn-more entry at all (a direct URL would **404**); `landing-page` has authored copy no route renders.

**(C) What shows when opened — no shared shape.**
- Archetypes are all over: clean editor (Mood Board, LED owned) · marketing-that-re-sells-after-purchase (LED renders a 2nd marketing header even for owners; Setnayan AI/SDE/Custom QR re-pitch) · status dashboard on **fake/mock data** (Papic seat/bridge/gesture cards = `MOCK_SEATS` with disabled buttons; Panood `/setup` = `mockPanoodSetup()` + 7 **hardcoded prices** ignoring real orders + admin catalog) · kitchen-sink (Save-the-Date stacks analytics + checkout + 5-step editor + launch + social) · **dead-end storefront** (Supplies = cart with a permanently disabled "Checkout opens soon").
- **Ownership is tested 3 different ways** across the app (grid order-status map vs `eventOwnsSku` vs `eventSkuActive`), so a bundle owner can see **"Active" inside but "Get" on the grid.**

**Root cause (one line):** behavior is driven by *per-feature `if/else` in two files* (`appStoreDetailHref()` + `studio/about/[addon]/page.tsx`) and by *optional catalog fields left blank*, instead of by **declared flags on the catalog row.**

### Inconsistency matrix (sample)
| Service | Open | Learn-more | Opened state |
|---|---|---|---|
| Animated Monogram | learn-more page | yes — but CTA → **/monogram (wrong)** | no editor; punts to free maker → **buy path broken** |
| Panood | direct (special-cased) | bespoke page | marketing; `/setup` = **mock + hardcoded prices** |
| Papic | learn-more; owner not deep-linked | yes + 2nd in-surface marketing | status dashboard over **MOCK data** + checkout + real storage radio |
| Save-the-Date | learn-more | shows priced **"Get" for a FREE film** | kitchen-sink (5 archetypes at once) |
| Supplies/Paprint | direct | **none (would 404)** | **dead-end cart** (checkout disabled) |
| SDE / LED / Custom QR | learn-more | yes | re-sells you **after** the learn-more page |
| Mood Board | learn-more | yes | clean editor ✅ (the ideal) |

## 4. The target pattern (the rule, going forward)

**(A) Listing — one honest tag from the catalog.** Every row declares `serviceKey` (paid) **or** `tier:'free'` — make both **non-optional in the type** so a blank one fails typecheck (same spirit as the `lint-nav-icon-source` guard). `pillFor()` stays the only badge source: `free → "Free"`, `owned → "Active"`, `submitted → "Pending"`, else **live admin price** (never a bare "Get" for a real SKU; if price unreadable, neutral "View").

**(B) Opening + learn-more — data, not code.** Replace the hardcoded exceptions with **one declared flag** `opensDirect` per row (true = free everyday tools that skip the interstitial: Seat Plan, Mood Board, website parts, Photo Delivery; false/default = paid SKUs that earn a learn-more page). Then two universal rules, **no exceptions**:
1. **Own it → deep-link straight to the working tool** (generalize Patiktok's owner-redirect to *every* paid service via the shared `eventSkuActive` gate — this is just paid-features-auto-show applied to routing).
2. A learn-more CTA **always** hands off to **that same service's** surface. Every non-`opensDirect` row **must** have an `add-ons-detail.ts` entry (lint-enforce the pairing so a Supplies-style 404 can't ship).

**(C) Opened state — one of three declared shapes.** Each service declares exactly one:
- **EDITOR** — its working surface (Mood Board, Seat Plan, LED/Indoor owned, website editors, Save-the-Date builder).
- **STATUS/DELIVERY** — read-only outcome for crew/admin-delivered services (SDE, Pakanta delivered, Panood post-purchase).
- **STOREFRONT** — only genuine multi-item commerce (Supplies).

Laws on top: **no marketing on the opened surface** (selling lives only on the one learn-more page — strip the in-surface re-pitch from LED/Pakanta/Custom QR/Indoor/Setnayan-AI + Mood Board's "coming next" teaser); **buy action only via the shared `InlineCheckoutDrawer`**, never re-pitched after purchase; **no mock data on a shipped surface** (wire it, or hide behind an honest "coming with the native app" state); **no hardcoded prices** (one live admin read — per the prices-are-admin-managed lock); **"Open" must actually open the thing**; a service may **link out** to a dependency (Indoor → Seating) but must degrade gracefully and state the prerequisite, never silently dead-end.

## 5. The staged plan (5 tiers)

| Tier | What | Effort | Risk | Fixes |
|---|---|---|---|---|
| **1 · Data fixes** | Add missing `serviceKey` (Panood, Save-the-Date, Patiktok); `tier:'free'` (Photo Delivery, Save-the-Date film); move Pakanta out of Branding; Papic real price; dedupe music-creator alias | Hours | Lowest | ~most grid-badge lies — `pillFor()` already does the right thing once the fields exist |
| **2 · Flag-driven routing** | Replace hardcoded exceptions in `appStoreDetailHref()` + `about/[addon]/page.tsx` with declared `opensDirect`; generalize owner deep-link to all paid services via `eventSkuActive`; lint-guard that every non-direct row has a detail entry | 1–2 sessions | Low (1 central change) | the open/learn-more chaos, 404 gaps, wrong-page |
| **3 · Ownership unification** | Collapse the 3 ownership readers → **`eventSkuActive` everywhere** a badge/gate is computed | 1 session | Low (mechanical + test bundle-owner case) | grid vs surface disagreeing |
| **4 · Opened-surface cleanup** | Strip in-surface marketing headers (LED, Pakanta, Custom QR, Indoor, Setnayan-AI, Mood Board teaser); remove hardcoded prices → live read | Small per service | Low | re-selling-after-purchase; price drift |
| **5 · Genuine build (staged)** | Wire Papic + Panood placeholder screens to real data (or honest "coming with the app"); **Animated Monogram MERGE** (see §6); decide Supplies status | Larger | Medium | mock-data surfaces, the broken monogram revenue path, the Supplies dead-end |

**Tiers 1–3 = the consistency sweep** — shared-template/data, low-risk, fixes ~80% of what you're feeling. Recommend shipping those first as one sweep, each as its own verified PR.

## 6. Animated Monogram — MERGE (owner-decided 2026-06-25)

One unified monogram surface: **design your mark for free → "Animate it · ₱1,999" upgrade inline** (the animation plays on the couple's surfaces once purchased). Removes the free-maker-vs-paid-buy split entirely, and kills the broken `/monogram`-vs-`/studio/animated-monogram` handoff. This is the right long-term UX and resolves the lost-revenue bug — but it's **Tier 5 build work** (a real surface change), so the *interim* is: in Tier 2, ensure the monogram card/learn-more at least routes to a working buy path so revenue isn't lost while the merge is built. *(Note: the monogram mark itself is deterministic — no AI — per the 2026-06-25 0037 correction; the "Animate it" upsell adds motion, not generation.)*

## 7. Still your call (surfaced, not assumed)

- **Supplies / Paprint** — it's a dead-end (checkout permanently disabled, mock products, name mismatch Paprint vs supplies-marketplace). Recommend flagging it **Coming Soon** at the catalog level so it stops presenting as live. Confirm, or is checkout meant to work now?
- **Papic & Panood placeholder screens** — wire to real data now, or label "coming with the native app" until the native capture/stream apps land? (Papic's capture + Panood's live-stream are partly native-app territory.)

## 8. Locks this respects

paid-features-auto-show (#2012) · prices-are-admin-managed · flow-primitives REUSE (InlineCheckoutDrawer, one badge resolver) · responsive/nav ruleset · app-independence/linking-contract · in-app-services = first-party listings. No new conflicting patterns invented.

## 9. Recommended next step

Approve the target pattern (§4) → I ship **Tier 1** (hours, the data fixes — you'll see the listing get honest immediately), then **Tiers 2–3** as the routing/ownership sweep, each a verified PR. Tiers 4–5 staged after, with the two §7 decisions resolved.
