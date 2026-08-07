# 05 · The Complete Page Map

**Setnayan · every page, every pattern**
Prepared 2026-08-07 · Companion to briefs 01–04 · Audience: the design partner, and the owner

---

## 1. 403 pages is not 403 designs

Setnayan has **403 addresses**. That number frightens people, and it shouldn't. Every one of those 403 pages is built from **one of 12 page patterns**, dressed with **one of 7 popup types**. All 19 were approved by the owner on 4 August 2026 with no changes requested, and they are binding — they get **ported, never redrawn**.

So the real question is not "how do we design 403 pages." It is "which handful of pages genuinely need a designer's own thinking, and which 370 are just an approved pattern with this page's words in it."

### The 12 page patterns, and how many pages use each

| Pattern | What it is | Pages |
|---|---|---:|
| **A01 shell** | The app frame itself — the chrome every page sits inside | 3 |
| **A02 editorial** | Long-form pages you read top to bottom | 51 |
| **A03 gallery** | Many pictures or videos, browsed with the eye | 23 |
| **A04 detail** | One record shown in full — one vendor, one guest, one order | 45 |
| **A05 roster** | Many people (or things) in a list, with status and per-row actions | 34 |
| **A06 ledger** | Many money lines — paid, due, overdue | 24 |
| **A07 comparison** | A few options side by side, to choose between | 13 |
| **A08 wizard** | One decision per screen, in order, with visible progress | 24 |
| **A09 admin-table** | Dense tables — the one place density wins | 40 |
| **A10 command** | Search, type-to-find, results | 9 |
| **A11 states** | A page defined by its empty / loading / error / not-yet states | 85 |
| **A12 dashboard-home** | A landing page made of tiles and attention rows | 52 |
| | **Total** | **403** |

The largest single group is **A11 states (85 pages)**, and that is the most important fact in this document. Eighty-five of our pages are mostly *the honest thing we say when there is nothing to show yet* — a redirect, a "not bought yet", a "no channel connected", a "your work is clean, no copies found". Those states are the design job on those pages. They are not filler.

### The 7 popup types, and where they appear

| Popup | Rule | Where it shows up |
|---|---|---|
| **O01 confirm-dialog** | Destructive actions only — never for "are you sure you want to save" | Deleting an account, removing a group member, archiving a group, deleting a media file |
| **O02 toast** | The receipt for something we already did | Every optimistic save across the dashboards |
| **O03 command-palette** | Reach anything by name | The signed-in home's type-to-jump bar; admin search |
| **O04 lightbox** | Full-screen media — the one dark surface in a light-only product | Alaala, guest photo pools, vendor galleries, moodboards |
| **O05 picker** | Returns a value; it never navigates you somewhere | Dates, colours, categories, templates, songs |
| **O06 popover-tooltip** | A whisper, not a doorway | Explaining a badge, a status word, a fee |
| **O07 banner-notice** | The page speaking in its own voice | "Switched off", "not visible yet", "we're checking your payment" |

### How the 403 split by how much design they need

| Priority | Meaning | Pages |
|---|---|---:|
| **Bespoke** | Genuinely needs its own design thinking | **33** |
| **Pattern** | An approved pattern filled with this page's content | **263** |
| **Trivial** | Redirects, print-only sheets, internal tools — nothing to draw | **107** |

---

## 2. The bespoke list — the actual work

These 33 pages are the work. Everything else follows a pattern. Grouped by who sees them.

### Public — 7 pages

| Page | Address | Why it earns its own design |
|---|---|---|
| The Setnayan home page | `/` | Deliberately breaks our own rules — its own cinematic opening, floating nav and five-pillar dock. Prices on it come live from the catalogue. |
| Browse and search wedding suppliers | `/explore` | The front door of the marketplace and the largest page in the product. Several different layouts live inside it, plus a pinned search bar and a slide-up filter sheet. |
| Create your account | `/signup` | The join between the marketing site and the app. Two columns on a laptop, one on a phone, with a couple-or-supplier toggle that changes where you land. |
| What everything costs | `/pricing` | Every number is read live, so the design must survive prices changing without a rebuild. Includes an interactive photo-cost estimator. |
| Make your own monogram, free | `/monogram` | A marketing page wrapped around a real working drawing tool anyone can use without an account. No pattern describes a canvas. |
| A supplier's public shop page | `/v/[slug]` | Already built at very large scale. This is a page to **reconcile** with the pattern, never to redraw from scratch. |
| A person's own public page | `/u/[userSlug]` | Behaves three different ways depending on how many events the person has running, and doubles as a storyteller's shopfront. |

### Guest-facing — 8 pages

| Page | Address | Why it earns its own design |
|---|---|---|
| Opening your invitation | `/[slug]/invite` | **The single most-seen first impression of Setnayan.** Every guest at every event lands here. It is currently treated as a generic form. `/join/[eventId]` draws the identical screen — one design unit, not two. |
| The couple's own wedding website | `/[slug]` | The biggest guest surface. One page serves a stranger, an invited guest, a save-the-date reveal, an RSVP and the day itself — and falls through to a supplier shop when the address isn't an event. |
| The guest's home screen on the wedding day | `/[slug]/hub` | Fills the phone, no scrolling, with a bottom bar switching between the day's functions. |
| Your seat pass | `/[slug]/seat` | A pass, not a page. Read at arm's length, in a crowd. |
| Walk around the venue in 3D | `/[slug]/venue` | A live 3D scene. No pattern covers it. |
| Your phone as a camera at the event | `/papic/guest` | A full-screen live camera with a shot allowance. Nobody signs in — opening the invitation is what identifies you. Copy must never say "wedding". |
| Your photos from the day | `/papic/me/[token]` | The emotional payoff of the whole photo feature: a guest's own pictures, downloadable, plus the little film maker on their phone. |
| The big photo screen at the venue | `/wall/[eventId]` | Built for a projector, not a phone. No menus, nobody signed in, and it opens with a six-character code the venue types to claim the display. |

### Couple / customer — 12 pages

| Page | Address | Why it earns its own design |
|---|---|---|
| Your event home | `/dashboard/[eventId]` | The most-visited screen in the product. It changes shape three ways: normal planning, a wedding-day takeover, and cultural overlays. |
| Your home — every celebration, memory, group and shop | `/dashboard/(launcher)` | The most-seen signed-in screen and the biggest page in the area. Four blocks, each with exactly one home. |
| Who is coming to the wedding | `/dashboard/[eventId]/guests` | The canonical roster and one of the two or three most-used screens anywhere in the app. |
| Setting up your wedding — the first questions | `/onboarding/wedding` | The single most important funnel in the product. Every new couple passes through it, and it remembers where you left off. |
| The Setnayan store — everything you can add | `/dashboard/[eventId]/studio` | Built to feel like the App Store: four sections, each led by a hero. Prices live from the catalogue, never hardcoded. |
| One purchase and how to pay for it | `/dashboard/[eventId]/orders/[orderId]` | Money plus anxiety. The page changes completely with the payment state — the states *are* the design. |
| Cameras in your guests' hands | `/dashboard/[eventId]/studio/papic` | The biggest service screen: every guest's QR becomes their camera, with live counts and many simultaneous states. |
| Make your save-the-date film | `/dashboard/[eventId]/studio/save-the-date` | A short self-playing film that fills itself from what the couple already entered. One of the most emotionally loaded screens we have. |
| Change your website while watching it | `/dashboard/[eventId]/website/editor` | Structurally the most distinct page in the area — a controls rail beside the couple's real live page, edited in place. Needs a **shell** design, not a page design. |
| Your seating chart | `/dashboard/[eventId]/seating` | A full-bleed drag-and-drop floor canvas that deliberately breaks the page frame. |
| One conversation | `/dashboard/[eventId]/messages/[threadId]` | None of the twelve patterns is a chat. This one needs its own treatment, and three other screens will inherit it. |
| Alaala — all your photos and videos | `/dashboard/(account)/library` | Five word-lenses, two of which honestly say "not yet" rather than showing an empty grid. Media-heavy; needs the lightbox. |

### Vendor — 4 pages

| Page | Address | Why it earns its own design |
|---|---|---|
| Your home screen — what needs you today | `/vendor-dashboard` | Deliberately **not** a stat board. A decision feed: new inquiries, lock requests, reviews awaiting a reply, delays. Team members who own no shop get a different, smaller landing. |
| One customer's card | `/vendor-dashboard/clients/[eventId]` | The biggest page on the vendor side. Five-step progress strip, five tabs, and it deliberately shows **less** to a vendor still in conversation than to one who is booked. |
| My Shop — your storefront | `/vendor-dashboard/shop` | One of the five locked main pages and the second-biggest screen in the app. Profile, website, team and branch all open in place instead of navigating away. |
| Running one event, live | `/vendor-dashboard/on-the-day/live/[eventId]` | Two clearly separate halves: the basic kit every vendor gets, and a slot for their trade — song desk, script and cues, or floor command. |

### Admin — 2 pages

| Page | Address | Why it earns its own design |
|---|---|---|
| What needs me right now | `/admin/work` | The answer to "there are so many buttons and menus". A triage strip, one ranked list, and drawers that settle work without leaving the page — with deliberately **no button at all** for judgement calls. |
| Set up the app's menus, icons, first questions and the rules Setnayan AI follows | `/admin/ugat` | The one place the app's own vocabulary is authored. Changing it changes wording on hundreds of screens. |

---

## 3. The complete map

Every one of the 403 addresses. Nothing sampled, nothing summarised.

---

### 3.1 The public site — 54 pages

**The front door and our story — 7**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The Setnayan home page | `/` | A02 editorial | **Bespoke** |
| About Setnayan | `/about` | A02 editorial | Pattern |
| About Setnayan (Taglish) | `/tl/about` | A02 editorial | Pattern |
| Our story — why living memories | `/our-story` | A02 editorial | Pattern |
| How Setnayan works | `/how-it-works` | A02 editorial | Pattern |
| How Setnayan works (Taglish) | `/tl/how-it-works` | A02 editorial | Pattern |
| Why Setnayan is different | `/why-setnayan` | A02 editorial | Pattern |

**What we sell — 13**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Everything Setnayan can do | `/features` | A02 editorial | Pattern |
| Everything Setnayan can do (Taglish) | `/tl/features` | A02 editorial | Pattern |
| What everything costs | `/pricing` | A02 editorial + A07 comparison | **Bespoke** |
| Papic — guest photos, explained | `/papic` | A02 editorial | Pattern |
| Live Studio — streaming your event, explained | `/panood` | A02 editorial | Pattern |
| Pa3D — see your reception in 3D, explained | `/pa3d` | A02 editorial | Pattern |
| Palogo — your animated monogram, explained | `/palogo` | A02 editorial | Pattern |
| Patiktok — short highlight reels, explained | `/patiktok` | A02 editorial | Pattern |
| Pawebsite — your wedding website, explained | `/pawebsite` | A02 editorial | Pattern |
| Alaala — the living memory, explained | `/alaala` | A02 editorial | Pattern |
| Setnayan AI — the planning helper, explained | `/setnayan-ai` | A02 editorial | Pattern |
| For suppliers — why sell on Setnayan | `/vendors` | A04 detail | Pattern |
| For wedding content creators — get booked from the events you film | `/creators` | A01 shell | Pattern |

*Worth knowing: Pa3D, Palogo, Panood, Patiktok and Pawebsite are five copies of one shared sales template — design it once. The Papic page is richer and quotes a live starting price.*

**The marketplace — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Browse and search wedding suppliers | `/explore` | A10 command + A03 gallery | **Bespoke** |
| Old category link (sends you to Browse) | `/explore/categories` | A11 states | Trivial |
| Two suppliers side by side | `/explore/compare` | A09 admin-table | Pattern |
| A supplier's public shop page | `/v/[slug]` | A04 detail | **Bespoke** |
| Walk into a supplier's 3D booth | `/v/[slug]/booth` | A04 detail | Pattern |

**Publishing and people pages — 6**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The Setnayan Journal (wedding planning articles) | `/blog` | A02 editorial | Pattern |
| One journal article | `/blog/[slug]` | A02 editorial | Pattern |
| Real weddings on Setnayan | `/realstories` | A04 detail | Pattern |
| One real wedding story | `/realstories/[slug]` | A02 editorial + A03 gallery | Pattern |
| A person's own public page | `/u/[userSlug]` | A04 detail + A03 gallery | **Bespoke** |
| One published story chapter | `/u/[userSlug]/c/[chapterId]` | A04 detail | Pattern |

*Worth knowing: a journal article, a real-wedding story and a published chapter should read as one publication, not three. A paid supplier feature credit must always read clearly as sponsored.*

**The sample wedding tour — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Walk through a sample wedding | `/tour` | A02 editorial | Pattern |
| Sample wedding — the money | `/tour/budget` | A06 ledger | Pattern |
| Sample wedding — the photos | `/tour/gallery` | A03 gallery | Pattern |
| Sample wedding — finding your table | `/tour/seating` | A10 command + A04 detail | Pattern |
| Sample wedding — picking the suppliers | `/tour/vendors` | A07 comparison | Pattern |

**Getting in — 4**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Create your account | `/signup` | A08 wizard | **Bespoke** |
| Sign in | `/login` | A11 states | Pattern |
| I forgot my password | `/forgot-password` | A08 wizard | Pattern |
| Choose a new password | `/reset-password` | A08 wizard | Pattern |

*Worth knowing: sign-in, sign-up, forgot and reset are one card. Design it once on sign-up and the other three inherit it. Forgot-password says the same thing whether or not the email exists, on purpose.*

**Free tool, help, and leftovers — 6**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Make your own monogram, free | `/monogram` | A02 editorial + A08 wizard | **Bespoke** |
| Download the Mac app | `/download` | A02 editorial | Pattern |
| Help centre | `/help` | A12 dashboard-home + A10 command | Pattern |
| One help article | `/help/[slug]` | A02 editorial | Pattern |
| Notes for developers building on Setnayan | `/api/v1` | A02 editorial | Trivial |
| Old waitlist page (now says we're live) | `/waitlist` | A02 editorial | Trivial |

**Legal — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Privacy policy | `/privacy` | A02 editorial | Pattern |
| Terms of service | `/terms` | A02 editorial | Pattern |
| Cookie policy | `/cookies` | A02 editorial | Pattern |
| Refund and cancellation policy | `/refunds` | A02 editorial | Pattern |
| The rules about what you can post | `/acceptable-use` | A02 editorial | Pattern |

*Worth knowing: privacy is by far the longest text page in the product and is legally load-bearing. Length alone makes reading structure matter.*

**Try it without signing up — 3**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Try the 3D seat finder without signing up | `/3d_plan/demo/[token]` | A04 detail + A11 states | Pattern |
| Try the live control room without signing up | `/panood/demo/[token]` | A11 states | Trivial |
| Try Papic without signing up | `/papic/demo/[token]` | A11 states | Trivial |

---

### 3.2 Guest-facing event pages — 26 pages

**The couple's own address — 11**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The couple's own wedding website (what guests open) | `/[slug]` | A02 editorial | **Bespoke** |
| Opening your invitation | `/[slug]/invite` | A11 states | **Bespoke** |
| Tell us your name (for a plus-one) | `/[slug]/welcome` | A08 wizard | Pattern |
| The guest's home screen on the wedding day | `/[slug]/hub` | A12 dashboard-home | **Bespoke** |
| Your seat pass | `/[slug]/seat` | A04 detail | **Bespoke** |
| Type your name to find your seat | `/[slug]/find-seat` | A10 command | Pattern |
| Where your table is | `/[slug]/find-my-table` | A06 ledger | Pattern |
| Walk around the venue in 3D | `/[slug]/venue` | A04 detail | **Bespoke** |
| How the day went | `/[slug]/recap` | A05 roster | Pattern |
| Send the couple a cash gift | `/[slug]/pabuya` | A08 wizard | Pattern |
| Print the wedding story as a keepsake newspaper | `/[slug]/print` | A02 editorial | Trivial |

**Joining by code — 4**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Join this event as a guest | `/join/[eventId]` | A08 wizard + A11 states | Pattern |
| Check your email | `/join/[eventId]/check-email` | A11 states | Trivial |
| Pick a password for your new account | `/join/[eventId]/set-password` | A08 wizard | Trivial |
| You're in | `/join/[eventId]/success` | A11 states | Trivial |

**Guest cameras and photos — 9**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Your phone as a camera at the event | `/papic/guest` | A11 states | **Bespoke** |
| Open the photo camera from a scanned code | `/papic/join/[token]` | A11 states | Pattern |
| Claim your spot on the photo crew | `/papic/claim/[token]` | A11 states | Pattern |
| The photo crew camera | `/papic/seat/[token]` | A02 editorial | Pattern |
| Your photos from the day | `/papic/me/[token]` | A03 gallery | **Bespoke** |
| Everyone's photos from the day | `/papic/pool` | A03 gallery | Pattern |
| Add stickers and words to a photo | `/papic/decorate` | A04 detail + A11 states | Pattern |
| Pay for the photos you bought | `/papic/order/[token]` | A08 wizard | Pattern |
| Record a video greeting for the couple | `/pabati/[eventId]` | A11 states | Pattern |

**On the venue's screens — 2**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The big photo screen at the venue | `/wall/[eventId]` | A03 gallery | **Bespoke** |
| Turn this phone into a camera for the live stream | `/panood/cam/[token]` | A11 states | Pattern |

---

### 3.3 Customer home and account — 25 pages

**Home and memory — 6**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Your home — every celebration, memory, group and shop in one place | `/dashboard/(launcher)` | A12 dashboard-home | **Bespoke** |
| Alaala — all your photos and videos from every celebration you were part of | `/dashboard/(account)/library` | A03 gallery | **Bespoke** |
| Your life so far, playing itself | `/dashboard/(account)/life-flash` | A05 roster | Pattern |
| The dates coming up — anniversaries and moments worth gathering for | `/dashboard/(account)/year` | A05 roster | Pattern |
| Your notifications | `/dashboard/(account)/notifications` | A05 roster | Pattern |
| Your story chapters and vendor offers | `/dashboard/(account)/creator` | A06 ledger | Pattern |

**People and groups — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The people in your life | `/dashboard/(account)/people` | A07 comparison | Pattern |
| Your groups — barkada, parish, clan, org | `/dashboard/(account)/samahan` | A05 roster | Pattern |
| Start a new group | `/dashboard/(account)/samahan/new` | A08 wizard | Pattern |
| Inside one group — who's in it and what they're planning | `/dashboard/(account)/samahan/[communityId]` | A04 detail + A05 roster | Pattern |
| Join a family or friend circle | `/samahan/join/[token]` | A11 states | Pattern |

*Worth knowing: the members list deliberately shows only name, role and join date — never an email or photo — for privacy law reasons. Promote, demote, remove and archive all need the confirm dialog.*

**Account settings — 4**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Your account settings | `/dashboard/(account)/profile` | A10 command | Pattern |
| What Setnayan AI is, and how to get it | `/dashboard/(account)/profile/concierge` | A02 editorial | Trivial |
| Developer keys for connecting other software to Setnayan | `/dashboard/(account)/api-keys` | A09 admin-table | Trivial |
| Take over your own profile from whoever set it up | `/claim/[token]` | A11 states | Trivial |

**Starting an event — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Setting up your wedding — the first questions | `/onboarding/wedding` | A08 wizard | **Bespoke** |
| Setting up a simple event | `/onboarding/simple` | A08 wizard | Pattern |
| Setting up a birthday, debut or other event | `/onboarding/[type]` | A08 wizard | Pattern |
| Start planning something new | `/dashboard/(account)/create-event` | A11 states | Pattern |
| Accept an invitation to help run the event | `/host/accept/[token]` | A08 wizard + A11 states | Pattern |

**Money and supplier handshakes reached from email — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Your official receipt | `/receipts/[receiptId]` | A04 detail | Pattern |
| A supplier's quotation | `/proposals/[publicId]` | A06 ledger | Pattern |
| Lock in this supplier | `/vendor/lock/[token]` | A06 ledger | Pattern |
| Does this supplier fit your event? | `/vendor/fit/[ref]` | A04 detail | Pattern |
| Add this supplier to your plan | `/vendor-invite/[slug]` | A04 detail + A08 wizard | Pattern |

*Worth knowing: the quotation page and the lock-in page are the same accept-or-decline handshake, and it is already drawn in the approved set. Two bespoke slots for one moment would be a waste.*

---

### 3.4 The event dashboard — 117 pages

**The event home and its old links — 7**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Your event home | `/dashboard/[eventId]` | A12 dashboard-home | **Bespoke** |
| Everything that's happened so far | `/dashboard/[eventId]/activity` | A09 admin-table | Pattern |
| Everything you told us about your wedding | `/dashboard/[eventId]/details` | A06 ledger | Pattern |
| (Old daily to-do screen — sends you home) | `/dashboard/[eventId]/today` | A12 dashboard-home | Trivial |
| (Old Progress — sends you home) | `/dashboard/[eventId]/progress` | A11 states | Trivial |
| (Old More tab — sends you home) | `/dashboard/[eventId]/more` | A11 states | Trivial |
| (Old For You tab — sends you to your vendors) | `/dashboard/[eventId]/for-you` | A12 dashboard-home | Trivial |

**Guests — 12**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Who is coming to the wedding | `/dashboard/[eventId]/guests` | A05 roster | **Bespoke** |
| One guest's details | `/dashboard/[eventId]/guests/[guestId]` | A06 ledger | Pattern |
| Add one guest | `/dashboard/[eventId]/guests/new` | A04 detail | Pattern |
| Type your guest list fast, one line at a time | `/dashboard/[eventId]/guests/quick` | A09 admin-table | Pattern |
| Bring your guest list in from a spreadsheet | `/dashboard/[eventId]/guests/import` | A08 wizard | Pattern |
| The one link you send everyone | `/dashboard/[eventId]/guests/invite` | A04 detail | Pattern |
| People who joined but weren't on your list | `/dashboard/[eventId]/guests/claims` | A05 roster | Pattern |
| Check people in at the door | `/dashboard/[eventId]/guests/checkin` | A07 comparison | Pattern |
| Hand out the giveaways | `/dashboard/[eventId]/guests/souvenirs` | A10 command | Pattern |
| Who you serve tea to, in order | `/dashboard/[eventId]/guests/tea-ceremony` | A05 roster | Pattern |
| Every guest's QR and the print sheet | `/dashboard/[eventId]/invitation` | A07 comparison | Pattern |
| Printable sheet of guest QRs | `/dashboard/[eventId]/invitation/print` | A03 gallery | Trivial |

*Worth knowing: check-in and souvenirs are the same scan-or-search desk counting different things. The tea ceremony has to be readable on paper — getting the order wrong is a real family problem.*

**People helping you — 4**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Who's planning this with you | `/dashboard/[eventId]/hosts` | A05 roster | Pattern |
| Who's asking to see your event | `/dashboard/[eventId]/access-requests` | A05 roster | Pattern |
| Hire day-of crew | `/dashboard/[eventId]/manpower` | A05 roster | Pattern |
| Your ninongs and ninangs | `/dashboard/[eventId]/sponsors` | A07 comparison | Pattern |

**Money and paperwork — 9**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| What everything costs and what's paid | `/dashboard/[eventId]/budget` | A08 wizard | Pattern |
| What you've bought from Setnayan | `/dashboard/[eventId]/orders` | A06 ledger | Pattern |
| One purchase and how to pay for it | `/dashboard/[eventId]/orders/[orderId]` | A04 detail + A11 states | **Bespoke** |
| (Old order form — sends you to Studio) | `/dashboard/[eventId]/orders/new` | A11 states | Trivial |
| All your papers in one place | `/dashboard/[eventId]/documents` | A12 dashboard-home | Pattern |
| Government papers you need to file | `/dashboard/[eventId]/paperwork` | A07 comparison | Pattern |
| Papers your vendors sent you | `/dashboard/[eventId]/contracts` | A05 roster | Pattern |
| One vendor contract | `/dashboard/[eventId]/contracts/[contractId]` | A04 detail | Pattern |
| Where guests send you a cash gift | `/dashboard/[eventId]/pabuya` | A05 roster | Pattern |

*Worth knowing: the cash-gift page must say plainly that Setnayan never touches the money — guests send straight to the couple.*

**Vendors and conversations — 9**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Who you're hiring, and the total | `/dashboard/[eventId]/vendors` | A07 comparison | Pattern |
| Add another kind of vendor | `/dashboard/[eventId]/vendors/categories` | A05 roster | Pattern |
| (Bare vendor link — sends you to that vendor's room) | `/dashboard/[eventId]/vendors/[vendorId]` | A11 states | Trivial |
| Everything about one vendor you booked | `/dashboard/[eventId]/vendors/[vendorId]/workspace` | A06 ledger | Pattern |
| Rate a vendor after the day | `/dashboard/[eventId]/vendors/[vendorId]/review` | A10 command | Pattern |
| The package you booked, line by line | `/dashboard/[eventId]/vendors/packages/[bookingId]` | A06 ledger | Pattern |
| Problems with a vendor | `/dashboard/[eventId]/disputes` | A05 roster | Pattern |
| Your conversations with vendors | `/dashboard/[eventId]/messages` | A05 roster | Pattern |
| One conversation | `/dashboard/[eventId]/messages/[threadId]` | A04 detail | **Bespoke** |

*Worth knowing: the booked-package page must look exactly like the supplier's own package page, or couples will think they are different things.*

**The day itself — 11**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The running order of the day | `/dashboard/[eventId]/schedule` | A07 comparison | Pattern |
| Choosing your wedding date | `/dashboard/[eventId]/date-selection` | A09 admin-table | Pattern |
| Which date keeps your vendors free | `/dashboard/[eventId]/find-date` | A09 admin-table | Pattern |
| Your full to-do list, counted back from the date | `/dashboard/[eventId]/checklist` | A05 roster | Pattern |
| Your seating chart | `/dashboard/[eventId]/seating` | A04 detail | **Bespoke** |
| Walk through your room in 3D | `/dashboard/[eventId]/seating/lab` | A06 ledger | Pattern |
| Walkthrough videos | `/dashboard/[eventId]/seating/walkthrough` | A03 gallery | Pattern |
| The QR your vendor's crew scans | `/dashboard/[eventId]/event-qr` | A04 detail | Pattern |
| Start your live services on the day | `/dashboard/[eventId]/launch` | A02 editorial | Pattern |
| Run the photo wall at the venue | `/dashboard/[eventId]/live` | A02 editorial | Pattern |
| Say the day is over — shut down your live services | `/dashboard/[eventId]/clearance` | A08 wizard | Pattern |

*Worth knowing: choosing a date and finding a date are one design, arguably one page. The schedule must match what the vendors and guests see — one shared design.*

**The wedding website — 21**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Your wedding website and its settings | `/dashboard/[eventId]/website` | A02 editorial | Pattern |
| Change your website while watching it | `/dashboard/[eventId]/website/editor` | A01 shell + A04 detail | **Bespoke** |
| The story that goes on your page after the day | `/dashboard/[eventId]/website/editorial` | A04 detail + A02 editorial | Pattern |
| How you tell your story | `/dashboard/[eventId]/website/our-story` | A04 detail + A02 editorial | Pattern |
| The big photo at the top of your page | `/dashboard/[eventId]/website/hero-photo` | A04 detail | Pattern |
| Your own photo gallery for the page | `/dashboard/[eventId]/website/our-photos` | A03 gallery | Pattern |
| Turn a few seconds of video into a loop | `/dashboard/[eventId]/website/living-hero` | A11 states | Pattern |
| Background music and a video header | `/dashboard/[eventId]/website/site-chrome` | A04 detail | Pattern |
| Tell guests what to wear | `/dashboard/[eventId]/website/dress-code` | A04 detail | Pattern |
| When guests should shoot and when to put phones down | `/dashboard/[eventId]/website/photo-moments` | A05 roster | Pattern |
| Who can see your page | `/dashboard/[eventId]/website/privacy` | A07 comparison | Pattern |
| Choose which sections show on your page, and in what order | `/dashboard/[eventId]/website/widgets` | A05 roster | Pattern |
| (Colours moved into the website editor) | `/dashboard/[eventId]/website/colors` | A11 states | Trivial |
| (Going live moved into the website editor) | `/dashboard/[eventId]/website/launch` | A11 states | Trivial |
| (Special message moved into the website editor) | `/dashboard/[eventId]/website/special-message` | A11 states | Trivial |
| (What-to-bring moved into the website editor) | `/dashboard/[eventId]/website/what-to-bring` | A11 states | Trivial |
| See your public event page | `/dashboard/[eventId]/event-page` | A11 states | Trivial |
| Old website editor link (sends you to the new one) | `/site-editor/[eventId]` | A11 states | Trivial |
| Old website editor link (sends you to the new one) | `/site-editor/[eventId]/editorial` | A11 states | Trivial |
| Old website editor link (sends you to the new one) | `/site-editor/[eventId]/event` | A11 states | Trivial |
| Old website editor link (sends you to the new one) | `/site-editor/[eventId]/rsvp` | A11 states | Trivial |

*Worth knowing: music never starts on its own — guests tap a visible control. Some sections (hero, greeting, QR card, RSVP) are pinned on and cannot be switched off.*

**The store — everything you can add — 42**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The Setnayan store — everything you can add | `/dashboard/[eventId]/studio` | A12 dashboard-home | **Bespoke** |
| Any add-on link — opens it, or tells you it isn't ready yet | `/dashboard/[eventId]/studio/[addon]` | A12 dashboard-home | Trivial |
| What this service is and what it costs | `/dashboard/[eventId]/studio/about/[addon]` | A06 ledger | Pattern |
| Everything you own and could add | `/dashboard/[eventId]/suite` | A09 admin-table | Pattern |
| (Old Design tab — sends you to Studio) | `/dashboard/[eventId]/design` | A11 states | Trivial |
| Design your wedding monogram | `/dashboard/[eventId]/monogram` | A02 editorial | Pattern |
| (Old animated monogram page — sends you to the monogram maker) | `/dashboard/[eventId]/studio/animated-monogram` | A11 states | Trivial |
| Make your save-the-date film | `/dashboard/[eventId]/studio/save-the-date` | A08 wizard | **Bespoke** |
| Make your wax seal | `/dashboard/[eventId]/studio/save-the-date/stamp` | A04 detail | Pattern |
| Cameras in your guests' hands | `/dashboard/[eventId]/studio/papic` | A12 dashboard-home + A11 states | **Bespoke** |
| Your photo crew | `/dashboard/[eventId]/studio/papic/crew` | A05 roster | Pattern |
| Printable QR cards for the photo crew | `/dashboard/[eventId]/studio/papic/crew/print` | A03 gallery | Trivial |
| A poster for the venue telling guests to shoot | `/dashboard/[eventId]/studio/papic/crew/poster` | A02 editorial | Trivial |
| Hide a photo you don't want up | `/dashboard/[eventId]/studio/papic/moderation` | A05 roster | Pattern |
| Your recap film and photo highlights | `/dashboard/[eventId]/studio/papic/recap` | A05 roster | Pattern |
| Pick the reel templates for your photo booth | `/dashboard/[eventId]/studio/patiktok` | A03 gallery | Pattern |
| One reel template | `/dashboard/[eventId]/studio/patiktok/[templateId]` | A04 detail | Pattern |
| The booth screen guests record on | `/dashboard/[eventId]/studio/patiktok/booth` | A05 roster | Pattern |
| (Retired livestream product — sends you to Live Studio) | `/dashboard/[eventId]/studio/panood` | A11 states | Trivial |
| Set up your livestream | `/dashboard/[eventId]/studio/panood/setup` | A11 states | Pattern |
| The control room for going live | `/dashboard/[eventId]/studio/panood/broadcast` | A02 editorial | Pattern |
| Your camera operators | `/dashboard/[eventId]/studio/panood/cameras` | A05 roster | Pattern |
| Printable QR cards for camera operators | `/dashboard/[eventId]/studio/panood/cameras/print` | A03 gallery | Trivial |
| Connect (or disconnect) your YouTube channel | `/dashboard/[eventId]/studio/live-studio-control` | A11 states | Pattern |
| (Old setup page — sends you to the live broadcast control room) | `/dashboard/[eventId]/studio/live-studio-control/setup` | A12 dashboard-home | Trivial |
| Order a song written for you | `/dashboard/[eventId]/studio/pakanta` | A08 wizard | Pattern |
| Your song list for the DJ or band | `/dashboard/[eventId]/studio/playlist` | A05 roster | Pattern |
| Your colours and the look of the day | `/dashboard/[eventId]/studio/mood-board` | A05 roster | Pattern |
| Make the loop for the venue's big LED wall | `/dashboard/[eventId]/studio/led` | A04 detail + A11 states | Pattern |
| Show guests how to find their table | `/dashboard/[eventId]/studio/indoor-blueprint` | A04 detail | Pattern |
| Your branded guest QR cards | `/dashboard/[eventId]/studio/custom-qr-guest` | A03 gallery + A11 states | Pattern |
| Printable branded QR cards | `/dashboard/[eventId]/studio/custom-qr-guest/print` | A03 gallery | Trivial |
| Buy the fancier write-up for your page | `/dashboard/[eventId]/studio/editorial-pro` | A02 editorial | Pattern |
| Buy the premium website upgrade | `/dashboard/[eventId]/studio/website-pro` | A02 editorial | Pattern |
| Approve what guests wrote about your day | `/dashboard/[eventId]/studio/guest-columns` | A05 roster | Pattern |
| Send your finished photos to Google Drive | `/dashboard/[eventId]/studio/photo-delivery` | A08 wizard + A11 states | Pattern |
| Turn on the planning assistant | `/dashboard/[eventId]/studio/setnayan-ai` | A11 states | Pattern |
| Order wedding supplies and favours | `/dashboard/[eventId]/studio/supplies-marketplace` | A02 editorial | Trivial |
| Where all your photos and videos land | `/dashboard/[eventId]/galleries` | A12 dashboard-home + A11 states | Pattern |
| The story of your day, stage by stage | `/dashboard/[eventId]/alaala` | A05 roster | Pattern |
| Ask a guest to tell the story of each moment | `/dashboard/[eventId]/alaala/assignments` | A05 roster | Pattern |
| Invite another couple, both get a perk | `/dashboard/[eventId]/refer` | A02 editorial | Pattern |

*Worth knowing: the "Live Studio control" page has four whole-page states, two of them honest dead ends. There must be no fake buttons. The store and "Everything you own" are two shopping surfaces for one shop — a product question, not a design one; do not pay to design it twice.*

**Live broadcast, reached outside the dashboard — 2**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The live broadcast control room | `/panood/control/[eventId]` | A02 editorial | Pattern |
| The clean picture the broadcast sends out | `/panood/program/[eventId]` | A03 gallery | Trivial |

---

### 3.5 Vendor — 67 pages

**Getting in — 4**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Open your supplier shop | `/open-shop` | A11 states | Pattern |
| Supplier claims the page we made for them | `/vendor/claim/[token]` | A08 wizard | Pattern |
| Finishing the supplier claim | `/vendor/claim/[token]/finalize` | A11 states | Trivial |
| Prove your business is real | `/vendor-dashboard/verify` | A11 states | Pattern |

**Home and shopfront — 7**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Your home screen — what needs you today | `/vendor-dashboard` | A12 dashboard-home | **Bespoke** |
| My Shop — your storefront | `/vendor-dashboard/shop` | A12 dashboard-home | **Bespoke** |
| See your public page as couples see it | `/vendor-dashboard/website` | A11 states + A04 detail | Pattern |
| Make a QR code couples can scan | `/vendor-dashboard/invite` | A02 editorial | Pattern |
| Old link to your profile | `/vendor-dashboard/profile` | A11 states | Trivial |
| Old link to your branches | `/vendor-dashboard/branches` | A11 states | Trivial |
| Old link to your services | `/vendor-dashboard/services` | A11 states | Trivial |

**What you sell — 6**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Add a service, step by step | `/vendor-dashboard/services/new/[category]` | A11 states | Pattern |
| The specifics of each service — hours, sizes, what's included | `/vendor-dashboard/attributes` | A08 wizard | Pattern |
| Your packages | `/vendor-dashboard/packages` | A09 admin-table | Pattern |
| Build one package | `/vendor-dashboard/packages/[packageId]` | A11 states | Pattern |
| The parts of the night you run | `/vendor-dashboard/activities` | A09 admin-table | Pattern |
| Your set list | `/vendor-dashboard/repertoire` | A09 admin-table + A10 command | Pattern |

**Customers and calendar — 14**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| My Customers | `/vendor-dashboard/customers` | A07 comparison | Pattern |
| One customer's card | `/vendor-dashboard/clients/[eventId]` | A04 detail | **Bespoke** |
| Photos from the couple's photo challenges | `/vendor-dashboard/clients/[eventId]/challenge-photos` | A03 gallery | Pattern |
| Set up the cocktail area | `/vendor-dashboard/clients/[eventId]/cocktail` | A04 detail | Pattern |
| Add your own photos and clips from their day | `/vendor-dashboard/clients/[eventId]/editorial-media` | A03 gallery | Pattern |
| The couple's colours and look | `/vendor-dashboard/clients/[eventId]/mood-board` | A03 gallery | Pattern |
| How much food to prepare | `/vendor-dashboard/clients/[eventId]/production-sheet` | A09 admin-table | Pattern |
| Where the tables are on the night | `/vendor-dashboard/clients/[eventId]/seat-plan` | A06 ledger | Pattern |
| One day on your calendar | `/vendor-dashboard/calendar/[date]` | A04 detail | Pattern |
| One conversation with a couple | `/vendor-dashboard/messages/[threadId]` | A06 ledger | Pattern |
| Old link to your clients | `/vendor-dashboard/clients` | A11 states | Trivial |
| Old link to your calendar | `/vendor-dashboard/calendar` | A11 states | Trivial |
| Old link to your bookings | `/vendor-dashboard/bookings` | A11 states | Trivial |
| Old link to messages | `/vendor-dashboard/messages` | A11 states | Trivial |

*Worth knowing: guest names never appear on the vendor side, only totals. The cocktail page is the only place a vendor writes into the couple's floor plan, and only that one area.*

**Money — 9**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Fees you owe Setnayan | `/vendor-dashboard/booking-fees` | A08 wizard | Pattern |
| Pay one Setnayan fee | `/vendor-dashboard/booking-fees/[orderId]` | A08 wizard | Pattern |
| Your plan and tokens | `/vendor-dashboard/subscription` | A09 admin-table | Pattern |
| Build your own plan | `/vendor-dashboard/subscription/custom` | A11 states | Pattern |
| Old link to earnings | `/vendor-dashboard/earnings` | A11 states | Trivial |
| (Old link to money coming in — sends you to My Customers) | `/vendor-dashboard/payday` | A12 dashboard-home | Trivial |
| Old link to how clients pay you | `/vendor-dashboard/payment-options` | A11 states | Trivial |
| (Old link to your credits — sends you to your plan) | `/vendor-dashboard/tokens` | A12 dashboard-home | Trivial |
| Retired tax documents page | `/vendor-dashboard/tax-documents` | A11 states | Trivial |

*Worth knowing: no supplier has ever been charged a fee in production. The pay screen here should be the same pay screen the couple sees.*

**Paperwork and proposals — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| One contract | `/vendor-dashboard/contracts/[contractId]` | A04 detail | Pattern |
| Upload a contract | `/vendor-dashboard/contracts/new` | A08 wizard | Pattern |
| QR codes you handed out to lock a booking | `/vendor-dashboard/locked-qr` | A09 admin-table + A06 ledger | Pattern |
| Old link to your contracts | `/vendor-dashboard/contracts` | A11 states | Trivial |
| Old link to proposals | `/vendor-dashboard/proposals` | A11 states | Trivial |

**On the day — 4**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| On the Day console | `/vendor-dashboard/on-the-day` | A07 comparison | Pattern |
| Running one event, live | `/vendor-dashboard/on-the-day/live/[eventId]` | A12 dashboard-home + A11 states | **Bespoke** |
| Take photos at the event | `/vendor-dashboard/on-the-day/live/[eventId]/papic` | A02 editorial | Pattern |
| Your saved lines for hosting | `/vendor-dashboard/lines` | A09 admin-table | Pattern |

*Worth knowing: saved lines are shown with the blanks visible — "⟨the couple⟩", never a real name — so the emcee can see no real person is stored.*

**Reputation and growth — 13**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| What couples said about you | `/vendor-dashboard/reviews` | A07 comparison | Pattern |
| Complaints filed against you | `/vendor-dashboard/disputes` | A07 comparison | Pattern |
| Weddings you worked on that got published | `/vendor-dashboard/real-stories` | A03 gallery + A02 editorial | Pattern |
| Highlight recaps from events you served | `/vendor-dashboard/recaps` | A03 gallery | Pattern |
| Setnayan extras you can suggest to your couples | `/vendor-dashboard/recommendations` | A09 admin-table | Pattern |
| Vendors you team up with | `/vendor-dashboard/partnerships` | A09 admin-table | Pattern |
| Offer a deal to a content creator | `/vendor-dashboard/creators` | A09 admin-table | Pattern |
| How many of each kind of event you've done | `/vendor-dashboard/track-record` | A09 admin-table | Pattern |
| Where someone copied your photos | `/vendor-dashboard/theft-watch` | A03 gallery + A11 states | Pattern |
| Your own moodboard pictures | `/vendor-dashboard/moodboard-library` | A03 gallery | Pattern |
| Let Setnayan research your business for you | `/vendor-dashboard/deep-search` | A10 command + A11 states | Pattern |
| (Old link to what couples are looking for — sends you to My Performance) | `/vendor-dashboard/demand` | A12 dashboard-home | Trivial |
| (Old link to how many enquiries turned into bookings) | `/vendor-dashboard/funnel` | A12 dashboard-home | Trivial |

*Worth knowing: most vendors will only ever see theft-watch's good empty state — "no copies found, your work is clean" — so that state is the real design job. Partnership labels are "Included in package" and "Discounted", never "sponsored".*

**Team, alerts and numbers — 5**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Who works with you | `/vendor-dashboard/team` | A05 roster | Pattern |
| Your alerts | `/vendor-dashboard/notifications` | A09 admin-table | Pattern |
| How your business is doing | `/vendor-dashboard/performance` | A06 ledger | Pattern |
| Old link to manpower | `/vendor-dashboard/manpower` | A11 states | Trivial |
| Old 'More' menu | `/vendor-dashboard/more` | A11 states | Trivial |

---

### 3.6 Admin — 114 pages

**Doorways — 6**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| What needs me right now | `/admin/work` | A12 dashboard-home | **Bespoke** |
| What needs the Setnayan team today | `/admin` | A02 editorial | Pattern |
| The Money and Settings menu | `/admin/money` | A12 dashboard-home | Pattern |
| The menu for looking up people, businesses, events and venues | `/admin/directory` | A10 command | Pattern |
| Every admin page there is | `/admin/more` | A01 shell | Trivial |
| Old link to the work list | `/admin/queues` | A11 states | Trivial |

*Worth knowing: `/admin` and `/admin/work` are two admin home pages both claiming to show what needs doing. Keep the work list; it was built to the owner's own instructions. Worth deciding whether both should exist.*

**People, businesses, events and venues — 16**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Look up any person, business or event | `/admin/accounts` | A12 dashboard-home | Pattern |
| Everything about one person's account | `/admin/users/[userId]` | A06 ledger | Pattern |
| Filling in a vendor's details for them before they sign up | `/admin/vendors/[vendorProfileId]/edit` | A04 detail | Pattern |
| Who works at this vendor's shop | `/admin/vendors/[vendorProfileId]/team` | A05 roster | Pattern |
| Giving a vendor free credits | `/admin/vendors/[vendorProfileId]/tokens` | A06 ledger + A04 detail | Pattern |
| Editing one venue's details | `/admin/venues/[id]` | A04 detail | Pattern |
| Adding a new venue | `/admin/venues/new` | A04 detail | Trivial |
| Messages couples sent to our sample vendors | `/admin/demo-vendors/inquiries` | A09 admin-table | Pattern |
| One message from a couple, and our reply | `/admin/demo-vendors/inquiries/[threadId]` | A06 ledger | Pattern |
| The ten founder accounts that get everything free | `/admin/founder-seats` | A05 roster | Pattern |
| People asking us to delete their account | `/admin/account-deletions` | A05 roster | Pattern |
| Old link to the people list | `/admin/users` | A11 states | Trivial |
| Old link to the vendor list | `/admin/vendors` | A11 states | Trivial |
| Old link to the venue list | `/admin/venues` | A11 states | Trivial |
| Old events link (now inside Accounts) | `/admin/events` | A11 states | Trivial |
| Old sample-vendors link (now inside Accounts) | `/admin/demo-vendors` | A11 states | Trivial |

**Checking vendors — 8**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Vendor applications waiting to be checked | `/admin/verify` | A12 dashboard-home | Pattern |
| Vendors' ID photos and permits — which we still need and which are junk | `/admin/verification-docs` | A09 admin-table | Pattern |
| Checking a vendor's bank details or QR code isn't a scam | `/admin/payment-options` | A09 admin-table | Pattern |
| Verified shops asking to fix a locked detail | `/admin/corrections` | A09 admin-table | Pattern |
| Which vendors work together, and what they give each other's couples | `/admin/vendor-partnerships` | A09 admin-table | Pattern |
| Which Setnayan services we suggest to each kind of vendor | `/admin/vendor-recommendations` | A09 admin-table | Pattern |
| Vendors upgrading to a paid plan, waiting for us to confirm payment | `/admin/subscriptions` | A06 ledger | Pattern |
| Vendors buying credit packs, waiting for us to confirm payment | `/admin/token-purchases` | A06 ledger | Pattern |

*Worth knowing: the verification document viewer is worth getting right once and reusing. On the ID-and-permits page, the label and the delete button must come from the same check, or the page lies.*

**Money — 14**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Money waiting to be checked off | `/admin/payments` | A12 dashboard-home | Pattern |
| Which vendors still owe us a booking fee | `/admin/booking-fees` | A06 ledger + A11 states | Pattern |
| Money we owe vendors, and when we sent it | `/admin/payouts` | A06 ledger | Pattern |
| Official receipts we have issued | `/admin/receipts` | A06 ledger | Pattern |
| Where couples send their money — our bank and GCash details | `/admin/settings/payment-methods` | A04 detail + A09 admin-table | Pattern |
| Every price on the platform | `/admin/pricing` | A12 dashboard-home | Pattern |
| Typical prices we suggest for couples' budgets | `/admin/budget-planner` | A09 admin-table + A06 ledger | Pattern |
| Make a new discount voucher | `/admin/discount-codes/new` | A04 detail | Pattern |
| Change a discount voucher | `/admin/discount-codes/[id]/edit` | A04 detail | Pattern |
| Old vouchers link (now inside Studio) | `/admin/discount-codes` | A11 states | Trivial |
| (Old link to the price ranges — now inside Pricing) | `/admin/price-bands` | A12 dashboard-home | Trivial |
| (Old link to what one credit is worth — now inside Pricing) | `/admin/token-bands` | A12 dashboard-home | Trivial |
| Old custom plans link (now inside Pricing) | `/admin/custom-plans` | A11 states | Trivial |
| Old add-ons link (now goes to Pricing) | `/admin/addons` | A11 states | Trivial |

*Worth knowing: if a detail on the payment-methods page is wrong, real money goes to the wrong place. A voucher's code can never be changed — past redemptions have to keep meaning something.*

**Judgement queues — 14**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Couples and vendors who fell out | `/admin/disputes` | A12 dashboard-home | Pattern |
| Vendors behaving suspiciously | `/admin/fraud` | A09 admin-table | Pattern |
| Things people reported as inappropriate | `/admin/user-reports` | A12 dashboard-home | Pattern |
| Fake reviews and abandoned vendor pages | `/admin/integrity-watch` | A09 admin-table | Pattern |
| People misusing the concierge | `/admin/concierge-abuse` | A12 dashboard-home | Pattern |
| Weddings hit by typhoons and other disasters | `/admin/force-majeure` | A09 admin-table | Pattern |
| One disaster claim and what we decided | `/admin/force-majeure/[flagId]` | A06 ledger | Pattern |
| People trying to swap phone numbers in chat | `/admin/chat-flags` | A09 admin-table | Pattern |
| Vendors using someone else's photos | `/admin/repost-watch` | A12 dashboard-home | Pattern |
| Jobs stuck between 'vendor says done' and 'couple says done' | `/admin/completions` | A09 admin-table | Pattern |
| Why a vendor's price changed when the guest count moved | `/admin/pax-changes` | A09 admin-table | Pattern |
| Reviews we held back, and appeals | `/admin/reviews` | A12 dashboard-home | Pattern |
| Decisions waiting for a second admin to say yes | `/admin/approvals` | A09 admin-table | Pattern |
| Messages from people who need help | `/admin/help` | A09 admin-table | Pattern |

*Worth knowing: the judgement queues deliberately get **no quick buttons at all** — a sentence sits where the buttons would be. Being fast here is worse than being right. The chat-flags page shows only what kind of contact detail was shared, never the message itself. `/admin/concierge-abuse` was mis-filed as trivial in an earlier pass — it is a full working queue and must be checked.*

**Publishing and content — 18**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Everything we publish, in one place | `/admin/studio` | A12 dashboard-home | Pattern |
| Wedding stories waiting to be checked before they go public | `/admin/editorial-review` | A09 admin-table | Pattern |
| One wedding story and what the checker flagged | `/admin/editorial-review/[editorialId]` | A04 detail | Pattern |
| The looping videos on the homepage | `/admin/background-videos` | A03 gallery | Pattern |
| The website's own pictures and videos, and which nothing uses any more | `/admin/website-media` | A09 admin-table | Pattern |
| Songs we still have to write for couples | `/admin/pakanta` | A05 roster + A04 detail | Pattern |
| Old marketing link (now the Studio) | `/admin/marketing` | A11 states | Trivial |
| Old link to real couples' stories | `/admin/real-stories` | A11 states | Trivial |
| Old link to the social-posting queue | `/admin/social-queue` | A11 states | Trivial |
| Old link to the song library | `/admin/songs` | A11 states | Trivial |
| Old link to the vendor awards | `/admin/spotlight-awards` | A11 states | Trivial |
| Old link to the refer-a-friend rewards | `/admin/referrals` | A11 states | Trivial |
| (Old link to featuring a vendor in an article — now inside Studio) | `/admin/journal-spotlights` | A12 dashboard-home | Trivial |
| (Old link to the save-the-date opening animations — now inside Studio) | `/admin/reveal-studio` | A12 dashboard-home | Trivial |
| (Old link to event highlight recaps — now inside Studio) | `/admin/recaps` | A12 dashboard-home | Trivial |
| (Old link to how the short highlight videos are being made — now inside Studio) | `/admin/patiktok` | A12 dashboard-home | Trivial |
| Old link to the website editor | `/admin/website` | A11 states | Trivial |
| Old moodboard library link (now inside Studio) | `/admin/moodboard-library` | A11 states | Trivial |

*Worth knowing: the media page is deliberately one-at-a-time — no bulk delete. Guests' photos and vendor documents can never appear on it.*

**The app's own words and setup — 13**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Set up the app's menus, icons, first questions and the rules Setnayan AI follows | `/admin/ugat` | A10 command | **Bespoke** |
| A live map of how everything connects | `/admin/ugat/map` | A02 editorial | Pattern |
| The master list of every service and word | `/admin/taxonomy` | A12 dashboard-home | Pattern |
| Which vendor categories show up for this kind of event | `/admin/event-types/[eventType]/categories` | A09 admin-table | Pattern |
| The questions we ask someone planning this kind of event | `/admin/event-types/[eventType]/onboarding` | A04 detail | Pattern |
| What we call things for this kind of event, and which features it gets | `/admin/event-types/[eventType]/profile` | A04 detail | Pattern |
| (Old link to the rules Setnayan AI follows — now inside the app setup console) | `/admin/brain` | A12 dashboard-home | Trivial |
| (Old link to the app's menus and icons — now inside the app setup console) | `/admin/menus` | A12 dashboard-home | Trivial |
| Old link to the first-questions editor | `/admin/onboarding` | A11 states | Trivial |
| Old link to the wedding-traditions editor | `/admin/wedding-traditions` | A11 states | Trivial |
| Old link to the faith and ceremony types | `/admin/wedding-types` | A11 states | Trivial |
| (Old link to the extra questions per service — now inside the master list) | `/admin/refinements` | A12 dashboard-home | Trivial |
| Old event types link (now inside Taxonomy) | `/admin/event-types` | A11 states | Trivial |

*Worth knowing: the connection map is generated from the code, not drawn by a designer, and roughly one person ever opens it. A designer slot spent there buys nothing.*

**Settings, privacy and keys — 10**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| The platform's own switches and settings | `/admin/settings` | A04 detail + A01 shell | Pattern |
| Privacy promises, switched on one by one | `/admin/data-privacy` | A12 dashboard-home | Pattern |
| Our privacy filing sheet, ready to print | `/admin/compliance/data-sheet` | A04 detail | Trivial |
| Our keys and passwords — where each one lives and how old it is | `/admin/secrets` | A09 admin-table | Pattern |
| Switch outside services on and off | `/admin/integrations` | A12 dashboard-home | Pattern |
| Old compliance link (now a tab in Settings) | `/admin/compliance` | A11 states | Trivial |
| Old link to the privacy-filing checklist | `/admin/npc-readiness` | A11 states | Trivial |
| Old link to the email-alert settings | `/admin/notifications` | A11 states | Trivial |
| Old link to the demo-mode switch | `/admin/settings/demo-mode` | A11 states | Trivial |
| (Old link to whether our outside services are working) | `/admin/connection-logs` | A12 dashboard-home | Trivial |

*Worth knowing: the keys page never shows the value of anything, not even the first few characters — only where a key is kept, its age, and how to replace it. On the privacy page the seriousness belongs in the wording, not in bespoke design.*

**Numbers and health — 11**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| How the platform is doing | `/admin/app-performance` | A12 dashboard-home | Pattern |
| What events people are asking for | `/admin/demand` | A12 dashboard-home | Pattern |
| How much photo storage each wedding is using | `/admin/papic-storage` | A09 admin-table | Pattern |
| Our YouTube channels for live-streaming weddings | `/admin/live-studio-channels` | A09 admin-table | Pattern |
| (Old link to the platform's numbers) | `/admin/insights` | A12 dashboard-home | Trivial |
| (Old link to what the platform's numbers are telling us) | `/admin/intelligence` | A12 dashboard-home | Trivial |
| (Old link to how fast the platform is growing) | `/admin/growth` | A12 dashboard-home | Trivial |
| (Old link to where people drop out before signing up) | `/admin/funnels` | A12 dashboard-home | Trivial |
| (Old link to how much work the team is carrying) | `/admin/operations-hiring` | A12 dashboard-home | Trivial |
| Old link to the search-visibility report | `/admin/seo` | A11 states | Trivial |
| Old link to the works-without-signal report | `/admin/offline` | A11 states | Trivial |

*Worth knowing: chart styling is a system-wide rule set once, not a per-page design.*

**Internal tools, not product — 4**

| Page | Address | Pattern | Priority |
|---|---|---|---|
| Internal screen used to record demo videos | `/demo-capture/[slug]` | A03 gallery | Trivial |
| Developer-only test page for the 3D supplier booth | `/dev/booth-lab` | A12 dashboard-home | Trivial |
| Internal camera test tool | `/papic/lightcheck` | A11 states | Trivial |
| Developer-only video call test | `/prototype/mesh-call` | A11 states | Trivial |

---

## 4. What this means for the design work

### How many things actually have to be drawn

| | Count | What happens to it |
|---|---:|---|
| Patterns and popups | **19** | Already drawn and approved. They get **ported**, never redrawn. A gap between a built screen and its pattern is a mistake in the port, not a new design decision. |
| Bespoke screens | **33** | The real design work. Listed in full in section 2. |
| Shared pieces that repeat across many pages | **~14** | Drawn once, reused everywhere. See below. |
| Pattern pages | **263** | No new design. Take the approved pattern, put this page's real words and data in it. |
| Trivial pages | **107** | Nothing to draw. Redirects that render nothing, print-only sheets, and internal test tools. |

### The pieces that repeat — draw each of these exactly once

These are the reason the number is 33 and not 90. Each appears on several pages, and every time it appears it must look identical.

1. **The camera screen** — the guest's camera, the crew camera, the photo booth recorder, and the vendor's camera are four doors into one design.
2. **The chat transcript** — the couple's side, the vendor's side, and the admin's reply to a sample-vendor enquiry.
3. **The pay screen** — the couple's order, a guest buying photos, the cash gift, and the vendor's two fee pages. Five copies of one screen today.
4. **The memory player** — the public recap, the couple's Alaala, the Papic recap, Life-Flash, and the lifetime library. Design the library and the other four follow.
5. **The venue map and the 3D room** — the guest walkthrough, the couple's 3D lab, the supplier booth, and the try-it demo are one room with four doors. Keep the guest's version the beautiful one; far more people see it.
6. **The print sheets** — guest QR cards, crew QR cards, camera-operator cards, the venue poster, the keepsake newspaper. One print system, no app chrome.
7. **The product sales page** — Pa3D, Palogo, Panood, Patiktok, Pawebsite (and Alaala and Setnayan AI alongside them) are one template.
8. **The sign-in card** — sign-up, sign-in, forgot password, reset password, open-a-shop, set-a-password.
9. **The accept-or-decline handshake** — the supplier's quotation and the lock-in page. Already drawn in the approved set; this is a port.
10. **Choose-between-dates** — choosing a wedding date, finding a date that keeps vendors free, and comparing two suppliers.
11. **The branded QR** — the vendor's invite code, the event QR, the guest invite link, the branded guest cards.
12. **The document viewer** — vendor verification and the ID-and-permits page.
13. **Charts** — one styling rule that covers the platform's own numbers, the vendor's performance, and the budget planner.
14. **The empty state** — 85 pages are mostly this. One honest voice for "nothing yet", "not bought", "switched off", "we're still checking".

### The order to work in

**First — the shell.** Every one of the 403 pages sits inside it, and it is the one piece where a change touches everything. Nothing else should start before it is settled.

**Second — the nine screens the most people touch**, in this order: opening your invitation · the couple's wedding website · your event home · your signed-in home · the guest list · browse suppliers · create your account and the wedding first-questions (one flow) · the supplier shop page · the supplier's home screen. These carry almost all of the traffic in the product.

**Third — the repeating pieces above.** Each one drawn here removes between three and five pages from the list.

**Fourth — the remaining bespoke screens** from section 2.

**Fifth — the 263 pattern pages.** This is production, not design: take the approved pattern, fill it with the real words. It should not need the designer's hand on every page.

**Never — the 107 trivial pages.** They render nothing, or they print. Spending a slot on any of them is spending it twice.

One caution, because it has cost real money before: several pages in the bespoke list — the supplier shop page above all, and the guest list, the couple's website and the admin work list close behind — **are already built, at scale, and working**. They are on the list to be *reconciled* with the approved pattern, not redrawn. Recreating a working screen is a defect, not a deliverable.