> ⚠ **SUPERSEDED 2026-09-29.** Every Event Hub item (§1) is now inside `EVENT_HUB_BUILD_PLAN_2026-09-28.md` "FINAL BUILD SEQUENCE" (Stages C/E), which runs BEFORE the Apple check. §2 (SEO/GEO, service cards + marketplace) is Lane 2 of that plan; its §2C owner questions are still open. Kept for history.

# After Apple: the build list (2026-09-28)

Owner, verbatim (2026-09-28, to the SEO/GEO session): *"add the things to build after apple on the redesign controller session so they can add this to the documentation"*. Nothing here starts before the Apple check. Owner, 2026-09-26: *"SEO GEO will be after apple. not now."* Every line is a candidate; re-measure it before building, because a register decays.

## 1. From the Redesign Controller (Event Hub)

> ⚠ **SUPERSEDED FOR EVENT HUB ITEMS, same day.** Owner, verbatim (2026-09-28, to the new Redesign Controller): *"finish all the builds for the event hub. we will do apple check on thursday on a new account"*. Every Event Hub item below now builds BEFORE the Thursday 1 Oct Apple check; the waves and branches are in the DECISION_LOG row "EVERY EVENT HUB BUILD FINISHES BEFORE THE APPLE CHECK". Items here that are NOT Event Hub (supplier/coordinator toolkit, vendor readiness checklist, People page and place headers, Articles in HQ, and all of §2) stay after Apple. Already shipped or in flight as of that row: scene height = content (scenes-fit builder), RSVP preview with a real guest (`loadPreviewPerson`), Schedule rebuild + announcements before the day, reminder emails 30/7/1, QR logo + shapes (Pro QR builder), palette display (Dress code builder). Added to the Event Hub queue from this list: per-letter styling beyond the hero · Save the Date auto-play walks widget scenes · the A3 "Our Story" poster · "account details win on sync".
- **Scene height = content** (DECISION_LOG 2026-09-27, "A SCENE IS AS TALL AS ITS CONTENT"). Moved to after Apple by the owner on 2026-09-27. No scene is padded to 100vh except the front page and the STD film.
- **Hero designs 2–4:** Marquee · Crest · Letter. Every hero part is tap-to-edit.
- **Per-letter styling beyond the hero:** today it works on hero text only (#6029). Scene words are drawn by widgets that know nothing about the canvas.
- **RSVP preview draws guest-link scenes with a real guest** (the Maker canvas uses "Your guest" today).
- **Save the Date auto-play walks widget scenes too:** today Auto only steps through the fixed sections (`hub-scenes.tsx`, `stage-autoplay.tsx`, `site-body.tsx`).
- **Post Event scenes build** (`POST_EVENT_SCENES_BUILD_BRIEF_2026-09-26.md`) and the **Schedule rebuild**, which includes announcements before the day and reminder emails at 30, 7 and 1 days.
- **QR with the event logo, plus QR shapes (Pro); A3 "Our Story" poster; supplier and coordinator toolkit; vendor readiness checklist.**
- **People page and place headers** (the prototype is done); **palette display.**
- **"Account details win on sync":** the account's name, photo, mobile and dietary shown to everyone, with the couple's typed label kept as a private "saved as".
- **Articles in HQ:** only after a traffic check.

## 2. From the SEO/GEO session (paused)
Shipped before the pause: #6011 GEO copy says what ships · #6012 service worker reserves shell pages · #6013 the /suppliers directory (`/suppliers/{event}/{category}/{city}`; needs ≥3 cards from ≥2 shops; branch cities; migration 20271248809664) · #6014 Patiktok unlisted from /llms.txt · #6015 public pages say "supplier" (phase 1 of 4).

### A. Service cards and the marketplace: ONE build
Owner: *"list down all the fixes needed … plus fix the design flow for service card creation … a slightly similar concept as the event hub maker"* and *"we build this with the rest"*. Measured on prod on 2026-09-27 (Saysay's shop and /explore at 375px):
1. **The filtered marketplace still renders the old per-VENDOR card.** Any `?event_type=` triggers it, and that is always on for a signed-in couple. Photo and title aren't tappable, "View vendor" opens a new tab, and there is one card per shop, so Saysay's Host/MC service is missing. **Fix:** use `ServiceCardView` everywhere, per the 2026-09-10 ruling (the card body opens that service's details; the logo opens the shop).
2. **Card photos load a 1920w image into a ~230px box.** **Fix:** next/image `sizes`.
3. **The card says both "crew meal required" and "Crew meal not included".** **Fix:** one line, e.g. "Feed the crew: not included".
4. **"Booked 2× on Setnayan" shows on a trial shop**, because test bookings count.
5. **The phone header's account button is clipped** at the right edge.
6. **A service-card creation flow redesigned like the Event Hub Maker:** live preview of the real card, edit in place, phone-first, first-visit tour. The research must be redone.

### B. SEO/GEO follow-ups
7. **Footer "Suppliers" link** → /suppliers.
8. **Region-level directory pages** (e.g. `/suppliers/wedding/catering/metro-manila`). Owner question below.
9. **Per-category guide copy on directory pages**, up to the playbook §5.1 word minimums (400/600/800).
10. **Move /explore onto the shared `lib/service-card-faces.ts`.** Five guards read the file by path, so move them together.
11. **"Supplier, never vendor", phases 2–4:** couple dashboard → supplier dashboard → admin. About 1,300 occurrences remain. This is copy only; code names are frozen. The guard `lib/public-pages-say-supplier.test.ts` widens with each phase.
12. **Confirm the live /llms.txt names the booking fee on supplier lines.**
13. **Search Console:** request indexing for /suppliers pages once any qualify. Owner action.

### C. Owner questions (each one blocks an item above)
- Mark the trial shops SetnaProd and Saysay as `is_demo=true`? Today they're in the public sitemap as real verified suppliers. It's a prod write, so it needs his yes.
- Legal pages (/privacy, /terms, /acceptable-use): change "vendor"? It can be kept as a defined term (the Vendor Agreement).
- Move the supplier sign-up page from /vendors to, e.g., /for-suppliers (the old address forwards), or keep it?
- Make the Setnayan-specs repo private? It's public and ranks for "setnayan", pricing history included. The platform repo stays public: CI would be billed at roughly 7,700 min/day if it were private.
- Region pages (item 8): yes or no?

Already recorded in DECISION_LOG 2026-09-27: shops stay at `setnayan.com/{name}`; the directory is `/suppliers/{event}/{category}/{city}`; UI copy says "supplier", never "vendor"; Patiktok stays unlisted until tried.
