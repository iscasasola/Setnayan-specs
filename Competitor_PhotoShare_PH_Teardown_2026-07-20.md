# Competitor Teardown — PhotoShare.ph (photoshare.ph)

> **Date:** 2026-07-20 · **Method:** public teardown only (rendered HTML + client JS bundles + sitemap/robots). No private source, no authenticated surfaces. Everything below is inferred from what the site ships to browsers — treat exact internals as high-confidence-but-not-certain.
> **Why this matters to Setnayan:** PhotoShare is a direct, stripped-down competitor to the **Papic** slice — "one QR photo wall per event." Useful as a positioning + pricing benchmark and as a build reference for the guest-upload flow.

---

## 1. One-line summary

A **single-SKU, ₱999-per-event QR photo-sharing app**: guests scan a QR, upload photos from any browser (no app, no account), photos appear on a real-time projectable wall, host downloads a full-res album, 30-day storage. Filipino-built, Metro Manila, "since 2024." Radical simplicity is the whole pitch.

---

## 2. Tech stack (fingerprinted)

| Layer | What they use | Evidence |
|---|---|---|
| **Framework** | **Next.js** (App Router, React Server Components) | `/_next/static/chunks/...`, RSC manifests in bundles, `vary: rsc, next-router-state-tree` |
| **Hosting/CDN** | **Vercel** (ISR / static prerender) | `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, `x-nextjs-stale-time: 300`, `cache-control: s-maxage=31536000`. `/pricing` is fully static-generated. |
| **Backend + DB** | **Convex** — **self-hosted** | Bundles reference `ConvexReactClient`; real backend at **`https://convex-backend.photoshare.ph`** (their own domain, NOT managed `*.convex.cloud`). ⚠️ `happy-otter-123.convex.cloud` also appears but is just the **placeholder string in Convex's library error messages** — not their deployment. |
| **Realtime** | Convex reactive subscriptions (websockets) — powers the live photo wall. A stray **`ably`** reference also appears (possible secondary/legacy realtime path). | grep hits: `Convex` ×119, `ably` ×2 |
| **UI** | React + **Radix UI** primitives (almost certainly shadcn/ui) + Tailwind | `radix-ui.com` refs, component shape |
| **Images** | Next.js `<Image>` (loader config lists `cloudinary` among defaults — **not** proof they store on Cloudinary; that's just Next's stock loader list) | image config in bundle |
| **Payments** | **No client-side payment SDK** (no Stripe/PayMongo/Xendit/GCash SDK in bundles). Checkout is server-side or manual; bulk bookings explicitly route to **phone (0905 454 1497) + Facebook DM**. | absence in grep + FAQ copy |
| **Security headers** | `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy: origin-when-cross-origin` | response headers |

**Architecture read:** Marketing pages are static/ISR on Vercel for SEO + speed; the dynamic app (event creation, uploads, live wall, dashboard) is a Convex-backed reactive SPA talking to their self-hosted Convex instance. Self-hosting Convex is a deliberate cost/control choice (avoids managed Convex per-seat/usage pricing; keeps data on their own infra).

---

## 3. Routes / surfaces (from sitemap.xml + crawl)

**Public / SEO (static):**
- `/` — home
- `/pricing`
- `/about`
- `/blog` (changefreq daily — they intend to publish regularly)
- `/templates` — printable QR signage; **offloaded to a Canva collection** (no in-app design tool)
- **SEO landing pages** (programmatic long-tail): `/event-photo-sharing`, `/qr-photo-sharing`, `/wedding-photo-sharing`, `/free-event-photo-sharing`

**App (dynamic / guarded):**
- `/admin/login` → 404 to anonymous crawl (guarded or different path)
- `/join` → 404 (guest-join is likely event-scoped, e.g. `/e/[code]` or a query param)
- Nav references "Create Event", "Admin Login", "Join an Event", "Dashboard"

`robots.txt`: fully open (`Allow: /`), declares `Host` + sitemap. SEO-forward.

---

## 4. Product / features (host-facing, all in the one package)

- Unlimited guest uploads, unlimited guests
- QR code generation (branded)
- **Real-time photo wall**, projectable at the venue
- **Full-resolution** album download (host)
- 30-day cloud storage
- No app — browser-only for guests
- Access controls: invite-only codes, expiry dates, revoke access
- Event dashboard: monitor uploads, manage guests, **moderate** photos in real time
- Positioned for: weddings, corporate, debuts/birthdays, graduations, workshops, sports days, Christmas parties, team building, product launches

**Guest side is deliberately zero-friction:** scan → browser page → upload. No download, no account, no password. "Guests always ₱0."

---

## 5. Pricing & business model

- **₱999 flat, one-time, per event.** No subscriptions, no tiers, no tokens, no per-upload fees, no guest caps.
- Each additional event = another ₱999.
- Guests always free; host pays once.
- Bulk/corporate = manual (call/FB).
- Payment: "major Philippine payment methods" online, but no visible automated gateway SDK — likely a hosted checkout redirect or manual/GCash reconciliation.

**Model:** dead-simple, transactional, one-and-done. No recurring revenue, no vendor side, no marketplace. Growth relies on volume + SEO + word-of-mouth.

---

## 6. Positioning & messaging

- **Core promise:** "The best candid shots end up trapped on dozens of phones. Fix it with one QR code." Anti-groupchat, anti-compression ("full resolution, no quality loss").
- **Filipino-first framing:** "from the ninong to the flower girl," debuts, ballroom corporate galas, "Made in the Philippines," founded 2024 Metro Manila.
- **Trust levers:** transparent pricing, no hidden fees, no app, no sign-up.
- **SEO strategy:** programmatic landing pages per keyword (`wedding-photo-sharing`, `qr-photo-sharing`, `free-event-photo-sharing`), daily-cadence blog, FAQPage-style pricing FAQ, Canva template funnel as a soft top-of-funnel lead magnet.

---

## 7. Read against Setnayan / Papic

**They are a narrow subset of Papic.** PhotoShare = "QR photo wall, ₱999, done." Papic is a superset: tiered camera seats (Free 3 cams + Mini ₱30 / Ltd ₱50 / Unli ₱100, weddings-only caps), QR guest **tagging**, face-detection auto-tag, 5s clips, personal 9:16 reels, DSLR bridge, table-tag fan-out, untagged-still-delivered guarantee — all inside a whole events platform (planning, vendors, seating, live studio, etc.).

**What they do that's worth respecting:**
1. **Brutal simplicity as the product.** One price, one package, zero guest friction, no app. Their entire funnel is "scan and upload." Setnayan's Papic story is richer but also heavier — the ₱999-single-price clarity is a real conversion advantage for the casual "I just want guests' photos" buyer.
2. **Guest = zero account, zero app.** Matches Setnayan's own "no app, browser-first" locked decision — good validation of that call.
3. **SEO + Canva template funnel** as cheap top-of-funnel. Setnayan could mirror the programmatic landing pages + printable QR signage.
4. **Full-res download + moderation** framed as premium reassurance (photographers/hosts care about quality + control).

**Where Setnayan wins / should differentiate:**
- Tagging + face-detection + personal reels + owned-music renders = deliverables PhotoShare simply doesn't have.
- Whole-event platform vs. a single point tool (they have no vendor side, no planning, no marketplace, no recurring revenue).
- Setnayan's **Free 3-camera Papic tier** undercuts their "you must pay ₱999 to start" — a couple can try Setnayan capture for ₱0.

**Competitive risks to flag:**
- Their **₱999-for-everything** may read as cheaper/clearer than Papic's per-camera token math to a first-time buyer who just wants "one shared album." Consider whether a simple **flat "Papic album" bundle SKU** (one price, unlimited guest browser uploads, full-res download, 30-day) belongs in the catalog as the direct counter — vs. the current tiered/token framing.
- They're SEO-forward and publishing a blog daily; Setnayan's `0038_editorial_and_affiliates` + landing-page SEO should not cede those exact keywords.

---

## 8. Open questions / not verifiable from outside

- Exact payment rail (hosted checkout vs. manual GCash reconciliation) — no SDK visible.
- Whether `ably` is live realtime or dead code alongside Convex.
- Storage backend (Convex file storage vs. Cloudinary vs. S3/R2) — inconclusive; only Next's default loader list seen.
- Actual guest-upload compression behavior (they *claim* full-res; unverified).
- Admin/event route scheme (guarded; 404 to anon).

---

## 9. Raw evidence (for re-verification)

- `/pricing` response: `HTTP/2 200`, `x-nextjs-cache: HIT`, `x-nextjs-prerender: 1`, `cache-control: s-maxage=31536000`.
- Bundle grep: `Convex` 119 hits; real backend `convex-backend.photoshare.ph`; placeholder `happy-otter-123.convex.cloud` from library error strings; `ably` ×2; `radix-ui.com`; Next image loaders incl. `cloudinary`.
- No `NEXT_PUBLIC_*`, no `/api/*`, no Stripe/PayMongo/Xendit/Supabase/Firebase strings found in shipped chunks.
- Sitemap URLs: `/`, `/blog`, `/pricing`, `/about`, `/templates`, `/event-photo-sharing`, `/qr-photo-sharing`, `/wedding-photo-sharing`, `/free-event-photo-sharing` (lastmod 2026-04-30).
- Contact: `0905 454 1497`, Facebook page, "Metro Manila."
