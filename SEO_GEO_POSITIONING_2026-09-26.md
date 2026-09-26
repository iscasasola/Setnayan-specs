# Setnayan — SEO + GEO positioning (draft for owner approval, 2026-09-26)

Built from what SHIPS (live /features, /llms.txt, app/layout.tsx metadata, today's decision log) — not a wishlist.
**SEO** = what Google shows (title ~60 chars, description ~155). **GEO** = what ChatGPT / Perplexity / Google AI
answers say when asked "what is Setnayan?" or "best wedding app Philippines" — they read the long entity text,
`/llms.txt` and the page content, and they quote whatever is specific and TRUE.

---

## 1. What we are, in one sentence (the line every surface repeats)

> **Setnayan is the Filipino event platform: plan your wedding (or any celebration) free, invite every guest
> with their own QR pass, capture the day on your guests' phones, and keep the whole story — with verified
> Filipino suppliers in one place.**

## 2. Our edge — why Setnayan beats every alternative

People today juggle 5–8 tools for one Filipino wedding: a spreadsheet guest list, Canva invitations,
Messenger/Viber group chats for RSVPs, a US wedding-website builder (The Knot, Zola, WithJoy), a separate
photo-sharing app, Facebook Live for the stream, and Facebook groups to find suppliers. **Setnayan replaces
the stack with one link and one account.**

| Edge | Why it matters | Who can't match it |
|---|---|---|
| **Built for Filipino celebrations** — principal sponsors (ninong/ninang), the entourage, dress code by role, INC / Muslim / Catholic customs, PHP budgets, Filipino suppliers by city | Foreign wedding sites don't know what a ninang is; local directories don't plan | US wedding sites (built for American weddings) · PH supplier directories (listings only) |
| **One Event Hub from Save the Date to the story after** — Save the Date → Invitation & RSVP → The Day → Post Event, on ONE link | Guests never hunt for a different page; the couple edits it all in one Maker | Invitation apps stop at the invite; wedding sites stop at RSVP |
| **Every guest gets their own key** — personal QR / link / NFC: RSVP, seat, pass, check-in, their own photos | No lost RSVPs in group chats; a door scan counts the right people | Generic RSVP forms and group chats |
| **Papic — your guests' phones become the camera crew** — photos filed by moment and by guest, personal highlight reels; free to start | The candid photos a paid photographer misses, from 150 angles | Stand-alone photo-sharing apps (no guest list, no Event Hub) |
| **Live Studio** — the live stream sits on the Event Hub itself | Relatives abroad watch where the invitation already is | Facebook Live / YouTube links pasted in chats |
| **Free planning tools** — guest list, RSVP, seat plan (incl. 3D), budget in PHP, schedule, mood board | A complete planner at ₱0 | Most planners charge or upsell early |
| **Verified Filipino suppliers — no booking fees for couples** | Book without a markup; suppliers are verified | Directories that don't verify; agents that mark up |
| **Phone-first + iPhone app, guests need no app** | 99% of guests open it on a phone, inside Messenger | Desktop-first builders |
| **Every celebration, not just weddings** — debut, christening (binyag), birthdays, anniversaries, reunions, corporate, even a wake (planned with care) | One home for a family's life events; the wedding becomes a yearly anniversary | Single-purpose wedding sites |
| **Keeps it for years** — Alaala, the living memory; photos kept ≥10 years | The memory outlives the day | Apps that delete or charge to keep |

## 3. Search phrases that are perfect for us (to use in titles, headings, descriptions, article topics)

**Couples, planning (highest intent):**
wedding planning app Philippines · wedding planner app Philippines free · wedding website Philippines ·
online wedding invitation Philippines · wedding RSVP website · QR code wedding invitation · digital wedding
invitation with RSVP · wedding guest list app · wedding seating chart maker · wedding budget planner Philippines
(PHP) · wedding checklist Philippines · wedding schedule / program of events

**Filipino-specific (low competition, we own these):**
ninong ninang list · principal sponsors wedding Philippines · entourage list template · Filipino wedding
traditions · debut planning / 18 roses 18 candles · binyag / christening invitation · kasal planner ·
imbitasyon sa kasal · INC wedding dress code · Muslim wedding (walima) planning

**Capture & day-of:**
wedding photo sharing app for guests · guests take wedding photos app · QR code wedding photo sharing ·
wedding live stream Philippines · same-day edit (SDE)

**Suppliers (city pages):**
wedding suppliers Metro Manila · Tagaytay wedding suppliers · Cebu wedding suppliers · Davao wedding
suppliers · verified wedding vendors Philippines · wedding photographer / caterer / coordinator + city

⚠ **"Wedding website"**: the UI rule is *"Event Hub, never website"* (owner 2026-09-24). But people SEARCH
"wedding website". Recommendation: UI copy keeps "Event Hub"; search metadata says *"your Event Hub — your
wedding website, invitation and RSVP in one link"* so we are found by the word people type.

## 4. What must be FIXED because it is no longer true

| Claim | Where | Fix |
|---|---|---|
| **"0% commission on vendor bookings" / "Zero commission" / "no booking commission"** | Google description, social cards, JSON-LD, /llms.txt (×4), Home, /features, /vendors | Suppliers pay a booking fee since 2026-09-16 (5% on the first ₱100,000, 1% after; first 5 bookings free). Couples: **"no booking fees for couples"**. Suppliers (/vendors): state the fee plainly. |
| "Hosts and vendors transact directly, off-platform" | /llms.txt | Keep "payments to suppliers settle directly", add the booking fee |
| Prices written into /llms.txt text | /llms.txt | Read them from the catalogue (`platform_retail_catalog_v2`) or leave them out — hand-typed prices rot |
| "Incorporation pending — pilot under the founder's personal name" · the founder's wedding named as the public launch | /llms.txt | Owner to confirm what may stay public |
| Event Hub page URL is `/pawebsite` | links | Fine to keep the URL; its title/H1 should say Event Hub + "wedding website" as the search phrase |

## 5. The rewrite (for approval)

- **Title:** Setnayan · Plan your Filipino wedding and every celebration
- **Description (Google, ~155):** Plan your wedding free: guest list, RSVP, seating and budget. Send an
  Event Hub invitation guests open on their phones, capture the day with Papic, book verified suppliers.
- **Social card:** Plan your whole Filipino wedding free. One Event Hub link for the invitation, RSVP and the
  day itself — every guest with their own QR pass. Verified suppliers, no booking fees for couples.
- **Long entity text (JSON-LD + top of /llms.txt):** §1's sentence + §2's edges as plain facts + what is free
  vs paid (names, not prices) + event types + cities + "no booking fees for couples; suppliers pay a small
  booking fee".

## 6. After approval (small build, no new save functions)
Edit `app/layout.tsx` metadata + JSON-LD, `app/llms.txt/route.ts`, the Home / Features / Vendors "0%
commission" lines. Deploy, then check Google's Rich Results test and ask ChatGPT/Perplexity "what is
Setnayan?" a week later to see the new text quoted.

## 7. The builds about to ship — and the search phrases each one unlocks

**Rule:** the live metadata and /llms.txt claim only what SHIPS. Each build below gets its wording added
**the day it goes live** (part of its check card), never before — a claim ahead of the feature is the same
defect as "0% commission".

| Build (when) | New edge it adds | Search phrases it unlocks |
|---|---|---|
| **Guest pathway** (Sun–Mon) — one button at a time, fill-first RSVP, Requests (Keep · Remove · Link), swap a spot, named plus-ones each with their own QR, account details sync | Guests RSVP in two taps inside Messenger; every plus-one gets their own pass; gate-crashers can't get in | RSVP with plus ones · wedding RSVP QR code · guest check-in QR wedding · invite-only wedding RSVP |
| **Last-30-days guest checklist** (with the guest pathway) — attire by role, motif colours, arrival, table, tick-off | Each guest knows exactly what to wear and where to sit | wedding guest dress code by role · entourage attire guide · motif colors wedding guests |
| **Invitation fixes** (Sun) — Love Story on the invitation, empty sections hidden, venue after reply | A clean invitation that only shows what's ready | love story wedding invitation · online invitation with love story |
| **Post Event — Kwento** (Tue–Wed) — 17 scene types with styles: front page, the road to the day, statistics, schedule, gallery, Kwento, messages, where everyone sat (3D), vendor stories, entourage, Papic challenge, thank you, live stream, videos, clips | The wedding becomes a story guests revisit | wedding recap page · after the wedding story · wedding thank you page · wedding photo story |
| **Schedule rebuild** (Wed) — run of show, announcements before and on the day, reminder emails 30/7/1 days | Guests get the live program and reminders | wedding program of events · wedding day timeline app · wedding announcements for guests |
| **iPhone app approved** (Apple, after the sweep) | Setnayan on the App Store | wedding planning app iPhone · Setnayan app |
| **Supplier + coordinator toolkit** (after Apple) — door scanner, "your item is ready", souvenir claims, vendor readiness | Suppliers and coordinators run the day from one screen | wedding coordinator app Philippines · guest check-in app · photo booth claim QR |
| **Hero designs + tap-to-edit fonts, colours, size, animation** (after Apple) | Design the Event Hub like Keynote | customizable wedding website design · animated wedding invitation |
| **QR with your logo + shapes** (after Apple, Pro) | Branded QR invitations | custom QR code wedding invitation with logo |
| **A3 "Our Story" poster** (after Apple) | A framed keepsake of the day | wedding story poster print |
| **People page + places** (after Apple) — connected people, family tree, Alaga, Samahan | A family's circle in one place | family tree app Filipino · barkada group planner |
| **HQ Articles editor** (after traffic check) | Weekly Filipino wedding guides | Filipino wedding traditions · wedding tips Philippines |
