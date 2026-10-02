# Root map — first run of Screens · Doors (2026-10-02)

Generated from code by `pnpm --filter @setnayan/web ugat:screens --report` (setnayan-platform, `apps/web/scripts/gen-ugat-screens.ts`). Owner rulings: DECISION_LOG 2026-10-02 "ONE MAP OF THE APP", its amendment "THE APP MAP STARTS FRIDAY" and "THE UGAT MAP IS ALSO THE APP'S OWN DEFINITION OF WHAT IT DOES". Root map is the owner's name for the Ugat map (DECISION_LOG 2026-10-02); code paths keep `ugat`. Live view: Admin › Root map › Screens. This is the FIX LIST the first run was asked to produce.

## The numbers

| | count |
|---|---|
| Screens (host, guest, supplier, onboarding, public — admin is mapped separately) | 328 |
| Connected — at least one way in from inside the app | 266 |
| **Not connected — no way in** | **24** |
| Legacy stubs — old addresses that only forward somewhere else | 38 |
| **Doors to nowhere — a link to an address nothing answers** | **1** |
| Unmapped — no Root map node (the page reads no mapped table) | 33 |

## 1 · Not connected (no door)

A page nobody can reach except by typing its address. Each needs one of: a door added where the person would look for it, a decision that it is entered from outside on purpose (an emailed or QR link we could not see statically), or deletion. "Only from" lists doors that exist but do not count (admin, sitemap, dev).

### Host app (6)

- `/dashboard/[eventId]/studio/editorial-pro` — "Editorial PRO" · the couple-facing buy surface for the à-la-carte Editorial PRO unlock (₱3,499 · owner 2026-07-04).
- `/dashboard/[eventId]/studio/indoor-blueprint` — "Indoor Blueprint" · the couple-facing Indoor Blueprint studio: place the venue entrance + preview each guest's "find your table" wayfinding map.
- `/dashboard/[eventId]/studio/live-studio-control/setup` — "Live Watch controller" · WAVE 8 · TOMBSTONE REDIRECT — the controller moved out of /dashboard.
- `/dashboard/[eventId]/studio/playlist` — Playlist Builder add-on surface.
- `/dashboard/[eventId]/studio/thank-you` — "Thank-You Video · Studio" · the Thank-You Video maker.
- `/host/accept/[token]` — "Accept your invitation" · The five terminal states (declined · revoked · already accepted · expired · wrong account · server error).

### Guest app (6)

- `/[slug]/everyone` — "Everyone who will be there" · Does this event RECOGNISE the person reading?
- `/[slug]/seat` — "Your seat pass" · the personalized Seat Pass + public QR resolver (seat-finding PR 4/6 · gated on the paid CUSTOM_QR_GUEST SKU, ₱1,499 · 'live').
- `/claim/[token]` — "Claim your profile" · the Alaga claim / rehome landing (owner-locked 2026-07-16 ownership rule).
- `/join/[eventId]/check-email` — "Check your email" · "we've emailed you a sign-in link".
- `/papic/demo/[token]` — "Papic live demo" · The LIVE demo's own frame.
- `/papic/lightcheck` — "Papic light check" · THROWAWAY capability + frame-rate probe.

### Supplier app (1)

- `/vendor-invite/[slug]` — "Add a vendor to your plan" · `logo_url` DOES NOT ALWAYS HOLD A URL.

### Sign-in & onboarding (1)

- `/onboarding/simple` — "Create a Simple Event" · the lean, date-only onboarding for a Simple Event (owner 2026-06-27).

### Public site (3)

- `/panood/demo/[token]` — "Live Watch demo" · The LIVE demo's own frame.
- `/privacy/google-access` — the ONE short page a Google reviewer (or a couple) can be handed that answers "what does connecting Google actually do?".
- `/waitlist` — only from sitemap — "Plan your wedding free" · 2026-06-13 reprice scrub (Pricing.md § 00.D): the wedding website, RSVP, and QR invitations are paid SKUs — listed as ready, not as free.

### Internal (dev, prototypes) (7)

- `/demo-capture/[slug]` — `?scene=N` pins one frame and `&plain=1` drops the caption — the still capture's contract (`scripts/capture-demo-stills.mjs`).
- `/dev/booth-lab` — internal preview lab.
- `/dev/details-lab` — the Maker's Details page (three columns, the theme gallery, the folded-in prints) on fixture data, with no sign-in and no database (Detai…
- `/dev/hero-lab` — only from internal — the hero's four designs on fixture words, with no sign-in and no database (hero designs 2–4, 2026-09-28).
- `/dev/home-lab` — the phone Home's first screen (owner-APPROVED 2026-10-01, "THE SIMPLE PHONE APP — APPROVED", frame 1) on fixture data: no sign-in, no dat…
- `/dev/schedule-lab` — the Schedule's Event Day rail on fixture moments, with no sign-in and no database (Schedule rebuild, 2026-09-28).
- `/prototype/mesh-call` — "Mesh call (prototype)" · Prototype route for the N-way mesh call (lib/mesh-call-webrtc).

## 2 · Doors to nowhere

- `/vendor-dashboard/settings/notifications` — written in `apps/web/lib/vendor-email-triggers.ts` (email)

Only an address whose start is known is ever reported here, and only after it failed every page, route handler, next.config redirect, middleware legacy rule and public file. A one-segment address such as `/something` always resolves to the guest event page `/[slug]`, so a broken one-segment link cannot be detected statically.

## 3 · Legacy stubs

Pages that draw nothing and forward. Harmless on their own; a stub that still has doors pointing at it is a link that should be retargeted at the real address.

| old address | forwards to | doors still pointing here |
|---|---|---|
| `/dashboard/[eventId]/design` | `/dashboard/[…]/studio` | 4 |
| `/dashboard/[eventId]/event-page` | `/[…]` | 6 |
| `/dashboard/[eventId]/for-you` | `/dashboard/[…]/vendors` | 4 |
| `/dashboard/[eventId]/more` | `/dashboard/[…]` | 5 |
| `/dashboard/[eventId]/orders/new` | `/dashboard/[…]/studio` | 1 |
| `/dashboard/[eventId]/progress` | `/dashboard/[…][…]` | 4 |
| `/dashboard/[eventId]/studio/[addon]` | `/dashboard/[…]/[…]` | 5 |
| `/dashboard/[eventId]/studio/animated-monogram` | `/dashboard/[…]/monogram` | 0 |
| `/dashboard/[eventId]/today` | `/dashboard/[…]` | 4 |
| `/dashboard/[eventId]/vendors/[vendorId]` | `/dashboard/[…]/vendors/[…]/workspace` | 0 |
| `/dashboard/[eventId]/website` | `/dashboard/[…]/launch` | 16 |
| `/dashboard/[eventId]/website/colors` | `/dashboard/[…]/website/editor?open=colors` | 2 |
| `/dashboard/[eventId]/website/editorial` | `/dashboard/[…]/story` | 2 |
| `/dashboard/[eventId]/website/launch` | `/dashboard/[…]/website/editor` | 1 |
| `/dashboard/[eventId]/website/special-message` | `/dashboard/[…]/website/editor?open=special-message` | 3 |
| `/dashboard/[eventId]/website/what-to-bring` | `/dashboard/[…]/website/editor?open=what-to-bring` | 2 |
| `/dashboard/year` | `/dashboard#worth-planning` | 0 |
| `/explore/categories` | `/explore` | 0 |
| `/site-editor/[eventId]` | `/dashboard/[…]/website/editor` | 0 |
| `/site-editor/[eventId]/editorial` | `/dashboard/[…]/website/editor` | 0 |
| `/site-editor/[eventId]/event` | `/dashboard/[…]/website/editor` | 0 |
| `/site-editor/[eventId]/rsvp` | `/dashboard/[…]/website/editor` | 0 |
| `/vendor-dashboard/bookings` | `/vendor-dashboard/customers?[…][…]` | 6 |
| `/vendor-dashboard/branches` | `/vendor-dashboard/shop[…]` | 2 |
| `/vendor-dashboard/calendar` | `/vendor-dashboard/customers?[…][…]` | 8 |
| `/vendor-dashboard/clients` | `/vendor-dashboard/customers?[…]` | 9 |
| `/vendor-dashboard/contracts` | `/vendor-dashboard/customers?[…]` | 7 |
| `/vendor-dashboard/demand` | `/vendor-dashboard/performance[…]` | 2 |
| `/vendor-dashboard/earnings` | `/vendor-dashboard/shop?[…]` | 4 |
| `/vendor-dashboard/funnel` | `/vendor-dashboard/performance` | 1 |
| `/vendor-dashboard/manpower` | `/vendor-dashboard/shop?[…]` | 3 |
| `/vendor-dashboard/messages` | `/vendor-dashboard/customers?[…]` | 11 |
| `/vendor-dashboard/payday` | `/vendor-dashboard/customers?[…]` | 5 |
| `/vendor-dashboard/payment-options` | `/vendor-dashboard/shop?[…]` | 2 |
| `/vendor-dashboard/profile` | `/vendor-dashboard/shop[…]` | 3 |
| `/vendor-dashboard/proposals` | `/vendor-dashboard/customers?[…]` | 9 |
| `/vendor-dashboard/tax-documents` | `/vendor-dashboard` | 1 |
| `/vendor-dashboard/verify` | `/vendor-dashboard/shop[…]#get-verified` | 7 |

Plus these next.config.ts redirects (old public addresses kept alive for bookmarks and search):

- `/dashboard/:eventId/studio/live-studio-roam` → `/dashboard/:eventId/studio/live-studio-control`
- `/dashboard/:eventId/studio/live-studio-roam/:path*` → `/dashboard/:eventId/studio/live-studio-control/:path*`
- `/for-vendors` → `/for-suppliers`
- `/help/papic-pool-vs-papic-one` → `/help/papic-giving-a-camera-its-own-shots`
- `/how-it-works` → `/features`
- `/storytellers` → `/realstories#storytellers`
- `/tl/how-it-works` → `/tl/features`
- `/vendors` → `/for-suppliers`
- `/weddings` → `/realstories`
- `/weddings/:slug` → `/realstories/:slug`
- `/why-setnayan` → `/features`

## 4 · Screens with no Root map node (unmapped)

Most are content pages (legal, about, help) that read no data and need no node. The ones that DO hold product data are the gaps: the map cannot say what they are about.

- **Host app:** `/dashboard/notifications`
- **Guest app:** `/join/[eventId]/set-password` · `/papic/demo/[token]` · `/papic/lightcheck` · `/papic/try` · `/receipts/[receiptId]`
- **Supplier app:** `/vendor-dashboard/notifications`
- **Sign-in & onboarding:** `/forgot-password`
- **Public site:** `/about` · `/acceptable-use` · `/alaala` · `/api/v1` · `/blog` · `/cookies` · `/creators` · `/download` · `/features` · `/features/[slug]` · `/help/[slug]` · `/monogram` · `/panood/demo/[token]` · `/privacy` · `/privacy/google-access` · `/refunds` · `/terms` · `/tl/about` · `/tl/features` · `/tl/features/[slug]` · `/waitlist` · `/web-only`
- **Internal (dev, prototypes):** `/demo-capture/[slug]` · `/dev/booth-lab` · `/prototype/mesh-call`

## 5 · Every screen, by area

| screen | status | doors | Root map node(s) |
|---|---|---|---|
| **Host app** | | | |
| `/dashboard` | connected | 73 | Events, Guests, Orders & activations, Papic, Person, Proposal, Run of Show, Group, Threads, Users, Vendors |
| `/dashboard/[eventId]` | connected | 94 | Availability, Events, Guests, Orders & activations, Package, Papic, Person, Proposal, Run of Show, Group, Seat Plan, Service cards, Taxonomy, Threads, Users, Vendors |
| `/dashboard/[eventId]/access-requests` | connected | 5 | Run of Show, Vendors |
| `/dashboard/[eventId]/activity` | connected | 6 | Events, Guests, Orders & activations, Run of Show, Users, Vendors |
| `/dashboard/[eventId]/alaala` | connected | 6 | Events, Guests, Papic, Users |
| `/dashboard/[eventId]/alaala/assignments` | connected | 1 | Events, Guests, Users |
| `/dashboard/[eventId]/budget` | connected | 22 | Events, Orders & activations, Package, Proposal, Service cards, Taxonomy, Threads, Users, Vendors |
| `/dashboard/[eventId]/checklist` | connected | 6 | Events, Guests, Run of Show, Seat Plan, Service cards, Taxonomy, Users, Vendors |
| `/dashboard/[eventId]/clearance` | connected | 5 | Events, Users |
| `/dashboard/[eventId]/contracts` | connected | 10 | Contract, Vendors |
| `/dashboard/[eventId]/contracts/[contractId]` | connected | 2 | Contract, Vendors |
| `/dashboard/[eventId]/date-selection` | connected | 10 | Availability, Events, Users, Vendors |
| `/dashboard/[eventId]/design` | legacy stub | 4 | _unmapped_ |
| `/dashboard/[eventId]/details` | connected | 11 | Events, Guests, Orders & activations, Package, Papic, Run of Show, Service cards, Taxonomy, Users, Vendors |
| `/dashboard/[eventId]/details/change` | connected | 1 | Events, Proposal, Service cards, Threads, Users, Vendors |
| `/dashboard/[eventId]/disputes` | connected | 7 | Events, Users, Vendors |
| `/dashboard/[eventId]/documents` | connected | 8 | Contract, Events, Orders & activations, Vendors |
| `/dashboard/[eventId]/event-page` | legacy stub | 6 | Events, Users |
| `/dashboard/[eventId]/event-qr` | connected | 6 | Events, Users |
| `/dashboard/[eventId]/find-date` | connected | 5 | Availability, Events, Users, Vendors |
| `/dashboard/[eventId]/for-you` | legacy stub | 4 | _unmapped_ |
| `/dashboard/[eventId]/galleries` | connected | 7 | Events, Guests, Orders & activations, Papic, Users |
| `/dashboard/[eventId]/guests` | connected | 46 | Colour access, Events, Guests, Orders & activations, Person, Seat Plan, Service cards, Users, Vendors |
| `/dashboard/[eventId]/guests/[guestId]` | connected | 8 | Colour access, Events, Guests, Orders & activations, Person, Seat Plan, Users |
| `/dashboard/[eventId]/guests/checkin` | connected | 6 | Events, Guests, Seat Plan, Users |
| `/dashboard/[eventId]/guests/claims` | connected | 6 | Events, Guests, Person, Seat Plan, Users |
| `/dashboard/[eventId]/guests/import` | connected | 5 | Events, Guests, Seat Plan |
| `/dashboard/[eventId]/guests/invite` | connected | 2 | Events, Guests, Users |
| `/dashboard/[eventId]/guests/new` | connected | 5 | Events, Guests, Person, Seat Plan, Service cards, Users, Vendors |
| `/dashboard/[eventId]/guests/quick` | connected | 1 | Guests |
| `/dashboard/[eventId]/guests/send` | connected | 3 | Events, Guests, Person, Seat Plan, Users |
| `/dashboard/[eventId]/guests/souvenirs` | connected | 1 | Events, Guests, Seat Plan, Users |
| `/dashboard/[eventId]/guests/tea-ceremony` | connected | 2 | Events, Guests |
| `/dashboard/[eventId]/hosts` | connected | 6 | Colour access, Events, Users |
| `/dashboard/[eventId]/invitation` | connected | 10 | Events, Guests, Users, Vendors |
| `/dashboard/[eventId]/invitation/print` | connected | 2 | Events, Guests, Users |
| `/dashboard/[eventId]/launch` | connected | 20 | Events, Mood Board library, Guests, Live Watch, Orders & activations, Package, Papic, Person, Mood Board renders, Run of Show, Seat Plan, Service cards, Design sign-off, Users, Vendors |
| `/dashboard/[eventId]/live` | connected | 10 | Events, Guests, Orders & activations, Papic, Users |
| `/dashboard/[eventId]/manpower` | connected | 6 | Events, Users, Vendors |
| `/dashboard/[eventId]/messages` | connected | 16 | Availability, Events, Proposal, Service cards, Threads, Users, Vendors |
| `/dashboard/[eventId]/messages/[threadId]` | connected | 23 | Availability, Events, Guests, Orders & activations, Proposal, Service cards, Threads, Users, Vendors |
| `/dashboard/[eventId]/monogram` | connected | 7 | Events, Guests, Orders & activations, Users |
| `/dashboard/[eventId]/more` | legacy stub | 5 | _unmapped_ |
| `/dashboard/[eventId]/orders` | connected | 15 | Orders & activations |
| `/dashboard/[eventId]/orders/[orderId]` | connected | 6 | Events, Orders & activations, Papic, Users |
| `/dashboard/[eventId]/orders/new` | legacy stub | 1 | _unmapped_ |
| `/dashboard/[eventId]/pabuya` | connected | 7 | Events |
| `/dashboard/[eventId]/paperwork` | connected | 10 | Events |
| `/dashboard/[eventId]/people` | connected | 5 | Events, Guests, Papic, Users, Vendors |
| `/dashboard/[eventId]/plan3d` | connected | 7 | Events, Mood Board library, Guests, Orders & activations, Seat Plan, Users, Vendors |
| `/dashboard/[eventId]/progress` | legacy stub | 4 | _unmapped_ |
| `/dashboard/[eventId]/refer` | connected | 5 | Users |
| `/dashboard/[eventId]/schedule` | connected | 18 | Events, Guests, Run of Show, Service cards, Users, Vendors |
| `/dashboard/[eventId]/seating` | connected | 17 | Events, Mood Board library, Guests, Orders & activations, Seat Plan, Service cards, Design sign-off, Users, Vendors |
| `/dashboard/[eventId]/seating/lab` | connected | 4 | Events, Mood Board library, Guests, Orders & activations, Seat Plan, Service cards, Design sign-off, Users, Vendors |
| `/dashboard/[eventId]/seating/walkthrough` | connected | 1 | Events, Seat Plan, Users |
| `/dashboard/[eventId]/sponsors` | connected | 6 | Events, Guests, Person, Group, Users |
| `/dashboard/[eventId]/story` | connected | 11 | Events, Guests, Live Watch, Orders & activations, Papic, Run of Show, Seat Plan, Users, Vendors |
| `/dashboard/[eventId]/studio` | connected | 27 | Events, Guests, Orders & activations, Seat Plan, Users, Vendors |
| `/dashboard/[eventId]/studio/[addon]` | legacy stub | 5 | _unmapped_ |
| `/dashboard/[eventId]/studio/about/[addon]` | connected | 2 | Events, Orders & activations |
| `/dashboard/[eventId]/studio/animated-monogram` | legacy stub | 0 | _unmapped_ |
| `/dashboard/[eventId]/studio/editorial-pro` | **no door** | 0 | Events, Guests, Orders & activations, Service cards, Users, Vendors |
| `/dashboard/[eventId]/studio/guest-columns` | connected | 1 | Events, Guests, Users |
| `/dashboard/[eventId]/studio/indoor-blueprint` | **no door** | 0 | Events, Guests, Orders & activations, Seat Plan, Users, Vendors |
| `/dashboard/[eventId]/studio/live-studio-control` | connected | 2 | Events, Guests, Orders & activations, Service cards, Users, Vendors |
| `/dashboard/[eventId]/studio/live-studio-control/setup` | **no door** | 0 | Events |
| `/dashboard/[eventId]/studio/mood-board` | connected | 9 | Events, Mood Board library, Guests, Orders & activations, Mood Board renders, Design sign-off, Users, Vendors |
| `/dashboard/[eventId]/studio/pakanta` | connected | 2 | Events, Orders & activations |
| `/dashboard/[eventId]/studio/panood` | connected | 2 | Events |
| `/dashboard/[eventId]/studio/panood/broadcast` | connected | 1 | Events, Live Watch, Orders & activations, Users |
| `/dashboard/[eventId]/studio/panood/cameras` | connected | 1 | Events, Live Watch, Orders & activations, Users |
| `/dashboard/[eventId]/studio/panood/cameras/print` | connected | 2 | Events, Live Watch, Users |
| `/dashboard/[eventId]/studio/panood/setup` | connected | 1 | Events, Live Watch, Orders & activations, Users |
| `/dashboard/[eventId]/studio/papic` | connected | 16 | Events, Guests, Orders & activations, Papic, Person, Run of Show, Users, Vendors |
| `/dashboard/[eventId]/studio/papic/challenges` | connected | 3 | Events, Guests, Orders & activations, Papic, Users, Vendors |
| `/dashboard/[eventId]/studio/papic/crew` | connected | 5 | Events, Guests, Orders & activations, Papic, Users, Vendors |
| `/dashboard/[eventId]/studio/papic/crew/poster` | connected | 1 | Events, Users |
| `/dashboard/[eventId]/studio/papic/crew/print` | connected | 2 | Events, Orders & activations, Papic, Users |
| `/dashboard/[eventId]/studio/papic/moderation` | connected | 3 | Events, Guests, Orders & activations, Papic, Users |
| `/dashboard/[eventId]/studio/papic/recap` | connected | 3 | Events, Guests, Live Watch, Orders & activations, Papic, Run of Show, Users, Vendors |
| `/dashboard/[eventId]/studio/papic/run-of-show` | connected | 3 | Events, Guests, Orders & activations, Papic, Users, Vendors |
| `/dashboard/[eventId]/studio/patiktok` | connected | 4 | Events, Guests, Orders & activations, Seat Plan, Users |
| `/dashboard/[eventId]/studio/patiktok/[templateId]` | connected | 3 | Events, Guests, Seat Plan, Users |
| `/dashboard/[eventId]/studio/patiktok/booth` | connected | 3 | Events, Guests, Papic, Seat Plan, Users, Vendors |
| `/dashboard/[eventId]/studio/photo-delivery` | connected | 2 | Events, Guests, Papic, Users |
| `/dashboard/[eventId]/studio/playlist` | **no door** | 0 | Events, Vendors |
| `/dashboard/[eventId]/studio/save-the-date` | connected | 4 | Events, Guests, Orders & activations, Service cards, Users, Vendors |
| `/dashboard/[eventId]/studio/save-the-date/stamp` | connected | 2 | Events, Guests, Users |
| `/dashboard/[eventId]/studio/setnayan-ai` | connected | 3 | Availability, Events, Orders & activations, Run of Show, Users, Vendors |
| `/dashboard/[eventId]/studio/thank-you` | **no door** | 0 | Events, Guests, Orders & activations, Papic, Service cards, Users, Vendors |
| `/dashboard/[eventId]/studio/website-pro` | connected | 11 | Events, Orders & activations, Users |
| `/dashboard/[eventId]/suite` | connected | 7 | Events, Guests, Orders & activations, Papic, Seat Plan, Users, Vendors |
| `/dashboard/[eventId]/today` | legacy stub | 4 | _unmapped_ |
| `/dashboard/[eventId]/vendors` | connected | 46 | Availability, Events, Mood Board library, Guests, Orders & activations, Package, Proposal, Service cards, Taxonomy, Threads, Users, Vendors |
| `/dashboard/[eventId]/vendors/[vendorId]` | legacy stub | 0 | _unmapped_ |
| `/dashboard/[eventId]/vendors/[vendorId]/review` | connected | 7 | Events, Orders & activations, Threads, Users, Vendors |
| `/dashboard/[eventId]/vendors/[vendorId]/workspace` | connected | 16 | Availability, Colour access, Contract, Events, Guests, Orders & activations, Package, Proposal, Service cards, Threads, Users, Vendors |
| `/dashboard/[eventId]/vendors/categories` | connected | 3 | Events, Mood Board library, Guests, Service cards, Taxonomy, Threads, Users, Vendors |
| `/dashboard/[eventId]/vendors/packages/[bookingId]` | connected | 1 | Events, Guests, Package, Service cards, Users, Vendors |
| `/dashboard/[eventId]/website` | legacy stub | 16 | _unmapped_ |
| `/dashboard/[eventId]/website/colors` | legacy stub | 2 | _unmapped_ |
| `/dashboard/[eventId]/website/dress-code` | connected | 4 | Events, Guests, Users |
| `/dashboard/[eventId]/website/editor` | connected | 18 | Events, Guests, Live Watch, Orders & activations, Papic, Run of Show, Seat Plan, Users, Vendors |
| `/dashboard/[eventId]/website/editorial` | legacy stub | 2 | _unmapped_ |
| `/dashboard/[eventId]/website/hero-photo` | connected | 3 | Events, Orders & activations, Users |
| `/dashboard/[eventId]/website/launch` | legacy stub | 1 | _unmapped_ |
| `/dashboard/[eventId]/website/living-hero` | connected | 3 | Events, Orders & activations, Users |
| `/dashboard/[eventId]/website/our-photos` | connected | 4 | Events, Orders & activations, Users |
| `/dashboard/[eventId]/website/our-story` | connected | 4 | Events, Orders & activations, Users, Vendors |
| `/dashboard/[eventId]/website/photo-moments` | connected | 3 | Events |
| `/dashboard/[eventId]/website/privacy` | connected | 4 | Events, Users |
| `/dashboard/[eventId]/website/site-chrome` | connected | 4 | Events, Orders & activations, Users |
| `/dashboard/[eventId]/website/special-message` | legacy stub | 3 | _unmapped_ |
| `/dashboard/[eventId]/website/stories` | connected | 2 | Events, Users |
| `/dashboard/[eventId]/website/what-to-bring` | legacy stub | 2 | _unmapped_ |
| `/dashboard/[eventId]/website/widgets` | connected | 2 | Events, Guests, Orders & activations, Run of Show, Users |
| `/dashboard/api-keys` | connected | 2 | Vendors |
| `/dashboard/clusters` | connected | 1 | Events, Users, Vendors |
| `/dashboard/clusters/[clusterId]` | connected | 4 | Events, Guests, Users, Vendors |
| `/dashboard/create-event` | connected | 23 | Events, Person, Group, Users, Vendors |
| `/dashboard/creator` | connected | 3 | Events, Threads, Users, Vendors |
| `/dashboard/library` | connected | 8 | Events, Guests, Papic, Person, Users, Vendors |
| `/dashboard/life-flash` | connected | 2 | Events, Guests, Papic, Person, Users |
| `/dashboard/notifications` | connected | 7 | _unmapped_ |
| `/dashboard/people` | connected | 10 | Events, Person, Group, Users |
| `/dashboard/people/[dependentId]` | connected | 3 | Person, Users, Vendors |
| `/dashboard/profile` | connected | 13 | Events, Guests, Person, Users, Vendors |
| `/dashboard/profile/concierge` | connected | 1 | Events, Users, Vendors |
| `/dashboard/samahan` | connected | 3 | Events, Group, Users, Vendors |
| `/dashboard/samahan/[communityId]` | connected | 9 | Events, Group, Users, Vendors |
| `/dashboard/samahan/new` | connected | 6 | Events, Group, Users, Vendors |
| `/dashboard/year` | legacy stub | 0 | _unmapped_ |
| `/host/accept/[token]` | **no door** | 0 | Events, Users |
| `/panood/control/[eventId]` | connected | 1 | Events, Live Watch, Orders & activations, Users, Vendors |
| `/panood/program/[eventId]` | connected | 2 | Events, Live Watch, Users |
| `/proposals/[publicId]` | connected | 7 | Events, Package, Proposal, Service cards, Threads, Users, Vendors |
| `/site-editor/[eventId]` | legacy stub | 0 | _unmapped_ |
| `/site-editor/[eventId]/editorial` | legacy stub | 0 | _unmapped_ |
| `/site-editor/[eventId]/event` | legacy stub | 0 | _unmapped_ |
| `/site-editor/[eventId]/rsvp` | legacy stub | 0 | _unmapped_ |
| **Guest app** | | | |
| `/[slug]` | connected | 85 | Availability, Events, Guests, Live Watch, Orders & activations, Package, Papic, Person, Run of Show, Group, Seat Plan, Service cards, Taxonomy, Threads, Users, Vendors |
| `/[slug]/avatar` | connected | 2 | Events, Guests |
| `/[slug]/everyone` | **no door** | 0 | Events, Guests, Live Watch, Orders & activations, Papic, Person, Run of Show, Seat Plan, Users, Vendors |
| `/[slug]/find-my-table` | connected | 4 | Events, Guests, Orders & activations, Person, Seat Plan, Users, Vendors |
| `/[slug]/find-seat` | connected | 5 | Events, Guests, Live Watch, Orders & activations, Papic, Person, Run of Show, Seat Plan, Users, Vendors |
| `/[slug]/hub` | connected | 5 | Events, Guests, Orders & activations, Papic, Person, Run of Show, Seat Plan, Users, Vendors |
| `/[slug]/invite` | connected | 3 | Events, Guests, Run of Show, Users |
| `/[slug]/invite/enter` | connected | 2 | Events, Guests, Live Watch, Orders & activations, Package, Papic, Run of Show, Seat Plan, Users, Vendors |
| `/[slug]/invite/reply` | connected | 2 | Events, Guests, Live Watch, Orders & activations, Papic, Run of Show, Seat Plan, Users, Vendors |
| `/[slug]/pabuya` | connected | 2 | Events, Guests, Person, Seat Plan, Users, Vendors |
| `/[slug]/print` | connected | 2 | Events, Guests, Live Watch, Orders & activations, Papic, Person, Run of Show, Users, Vendors |
| `/[slug]/recap` | connected | 3 | Events, Guests, Live Watch, Orders & activations, Papic, Person, Run of Show, Seat Plan, Users, Vendors |
| `/[slug]/request` | connected | 2 | Events, Guests, Users, Vendors |
| `/[slug]/seat` | **no door** | 0 | Events, Guests, Orders & activations, Seat Plan, Users, Vendors |
| `/[slug]/venue` | connected | 3 | Events, Guests, Orders & activations, Person, Seat Plan, Users, Vendors |
| `/[slug]/welcome` | connected | 4 | Events, Guests, Users, Vendors |
| `/claim/[token]` | **no door** | 0 | Person, Users |
| `/join/[eventId]` | connected | 6 | Events, Guests, Users |
| `/join/[eventId]/check-email` | **no door** | 0 | Events, Guests |
| `/join/[eventId]/connect/confirm` | connected | 1 | Events, Guests, Papic, Users |
| `/join/[eventId]/set-password` | connected | 1 | _unmapped_ |
| `/join/[eventId]/success` | connected | 2 | Events, Guests, Users, Vendors |
| `/live` | connected | 2 | Events, Live Watch |
| `/live/screen` | connected | 2 | Events, Live Watch |
| `/panood/cam/[token]` | connected | 1 | Events, Live Watch, Orders & activations, Users |
| `/papic/claim/[token]` | connected | 3 | Events, Guests, Orders & activations, Papic |
| `/papic/decorate` | connected | 1 | Events, Guests, Orders & activations, Papic |
| `/papic/demo/[token]` | **no door** | 0 | _unmapped_ |
| `/papic/guest` | connected | 7 | Events, Guests, Orders & activations, Papic, Users |
| `/papic/join/[token]` | connected | 1 | Guests, Papic |
| `/papic/lightcheck` | **no door** | 0 | _unmapped_ |
| `/papic/me/[token]` | connected | 7 | Events, Guests, Orders & activations, Papic, Person, Users |
| `/papic/order/[token]` | connected | 1 | Events, Guests, Orders & activations, Papic, Users |
| `/papic/pool` | connected | 1 | Events, Guests |
| `/papic/seat/[token]` | connected | 2 | Events, Guests, Papic |
| `/papic/try` | connected | 1 | _unmapped_ |
| `/pay/[reference]` | connected | 2 | Events, Orders & activations, Papic, Users, Vendors |
| `/receipts/[receiptId]` | connected | 2 | _unmapped_ |
| `/samahan/join/[token]` | connected | 2 | Events, Group, Users, Vendors |
| `/wall/[eventId]` | connected | 2 | Events, Guests, Orders & activations, Papic, Person, Users |
| **Supplier app** | | | |
| `/open-shop` | connected | 10 | Events, Orders & activations, Person, Service cards, Taxonomy, Users, Vendors |
| `/vendor-dashboard` | connected | 93 | Availability, Contract, Events, Orders & activations, Proposal, Run of Show, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/activities` | connected | 3 | Run of Show, Users, Vendors |
| `/vendor-dashboard/attributes` | connected | 4 | Service cards, Taxonomy, Users, Vendors |
| `/vendor-dashboard/booking-fees` | connected | 2 | Events, Orders & activations, Users, Vendors |
| `/vendor-dashboard/booking-fees/[orderId]` | connected | 2 | Orders & activations |
| `/vendor-dashboard/bookings` | legacy stub | 6 | _unmapped_ |
| `/vendor-dashboard/branches` | legacy stub | 2 | _unmapped_ |
| `/vendor-dashboard/calendar` | legacy stub | 8 | _unmapped_ |
| `/vendor-dashboard/calendar/[date]` | connected | 2 | Availability, Events, Service cards, Threads, Users, Vendors |
| `/vendor-dashboard/clients` | legacy stub | 9 | _unmapped_ |
| `/vendor-dashboard/clients/[eventId]` | connected | 25 | Contract, Events, Orders & activations, Papic, Proposal, Run of Show, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/clients/[eventId]/challenge-photos` | connected | 1 | Orders & activations, Users, Vendors |
| `/vendor-dashboard/clients/[eventId]/cocktail` | connected | 1 | Events, Guests, Orders & activations, Seat Plan, Users, Vendors |
| `/vendor-dashboard/clients/[eventId]/editorial-media` | connected | 3 | Events, Orders & activations, Service cards, Users, Vendors |
| `/vendor-dashboard/clients/[eventId]/mood-board` | connected | 3 | Colour access, Events, Mood Board library, Guests, Orders & activations, Design sign-off, Users, Vendors |
| `/vendor-dashboard/clients/[eventId]/production-sheet` | connected | 2 | Orders & activations, Users, Vendors |
| `/vendor-dashboard/clients/[eventId]/seat-plan` | connected | 2 | Orders & activations, Users, Vendors |
| `/vendor-dashboard/contracts` | legacy stub | 7 | _unmapped_ |
| `/vendor-dashboard/contracts/[contractId]` | connected | 2 | Contract, Events, Threads, Users, Vendors |
| `/vendor-dashboard/contracts/new` | connected | 2 | Contract, Events, Threads, Users, Vendors |
| `/vendor-dashboard/creators` | connected | 3 | Events, Threads, Users, Vendors |
| `/vendor-dashboard/customers` | connected | 16 | Availability, Contract, Events, Orders & activations, Package, Proposal, Service cards, Threads, Users, Vendors |
| `/vendor-dashboard/deep-search` | connected | 2 | Orders & activations, Users, Vendors |
| `/vendor-dashboard/demand` | legacy stub | 2 | _unmapped_ |
| `/vendor-dashboard/disputes` | connected | 2 | Events, Guests, Orders & activations, Run of Show, Users, Vendors |
| `/vendor-dashboard/earnings` | legacy stub | 4 | _unmapped_ |
| `/vendor-dashboard/funnel` | legacy stub | 1 | _unmapped_ |
| `/vendor-dashboard/invite` | connected | 2 | Availability, Contract, Events, Orders & activations, Service cards, Taxonomy, Users, Vendors |
| `/vendor-dashboard/lines` | connected | 2 | Users, Vendors |
| `/vendor-dashboard/locked-qr` | connected | 3 | Events, Orders & activations, Users, Vendors |
| `/vendor-dashboard/manpower` | legacy stub | 3 | _unmapped_ |
| `/vendor-dashboard/messages` | legacy stub | 11 | _unmapped_ |
| `/vendor-dashboard/messages/[threadId]` | connected | 21 | Availability, Events, Guests, Orders & activations, Package, Proposal, Run of Show, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/moodboard-library` | connected | 4 | Events, Mood Board library, Service cards, Users, Vendors |
| `/vendor-dashboard/more` | connected | 4 | Service cards, Users, Vendors |
| `/vendor-dashboard/notifications` | connected | 4 | _unmapped_ |
| `/vendor-dashboard/on-the-day` | connected | 12 | Availability, Events, Orders & activations, Papic, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/on-the-day/live/[eventId]` | connected | 3 | Availability, Events, Orders & activations, Run of Show, Service cards, Threads, Users, Vendors |
| `/vendor-dashboard/on-the-day/live/[eventId]/papic` | connected | 1 | Availability, Events, Orders & activations, Papic, Service cards, Threads, Users, Vendors |
| `/vendor-dashboard/packages` | connected | 3 | Events, Package, Users, Vendors |
| `/vendor-dashboard/packages/[packageId]` | connected | 2 | Events, Package, Users, Vendors |
| `/vendor-dashboard/partnerships` | connected | 4 | Users, Vendors |
| `/vendor-dashboard/payday` | legacy stub | 5 | _unmapped_ |
| `/vendor-dashboard/payment-options` | legacy stub | 2 | _unmapped_ |
| `/vendor-dashboard/performance` | connected | 5 | Events, Guests, Orders & activations, Package, Proposal, Service cards, Threads, Users, Vendors |
| `/vendor-dashboard/profile` | legacy stub | 3 | _unmapped_ |
| `/vendor-dashboard/proposals` | legacy stub | 9 | _unmapped_ |
| `/vendor-dashboard/real-stories` | connected | 3 | Availability, Events, Service cards, Threads, Users, Vendors |
| `/vendor-dashboard/recaps` | connected | 4 | Availability, Events, Service cards, Threads, Users, Vendors |
| `/vendor-dashboard/recommendations` | connected | 3 | Events, Guests, Orders & activations, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/repertoire` | connected | 6 | Users, Vendors |
| `/vendor-dashboard/reviews` | connected | 8 | Events, Users, Vendors |
| `/vendor-dashboard/services` | connected | 8 | Availability, Events, Orders & activations, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/services/new` | connected | 1 | Events, Service cards, Taxonomy, Users, Vendors |
| `/vendor-dashboard/services/new/[category]` | connected | 3 | Events, Package, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/shop` | connected | 32 | Availability, Events, Orders & activations, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor-dashboard/subscription` | connected | 20 | Billing, Events, Guests, Orders & activations, Seat Plan, Service cards, Users, Vendors |
| `/vendor-dashboard/subscription/custom` | connected | 1 | Orders & activations, Users, Vendors |
| `/vendor-dashboard/tax-documents` | legacy stub | 1 | _unmapped_ |
| `/vendor-dashboard/team` | connected | 3 | Orders & activations, Service cards, Users, Vendors |
| `/vendor-dashboard/theft-watch` | connected | 2 | Service cards, Users, Vendors |
| `/vendor-dashboard/track-record` | connected | 2 | Service cards, Users, Vendors |
| `/vendor-dashboard/verify` | legacy stub | 7 | _unmapped_ |
| `/vendor-dashboard/website` | connected | 3 | Users, Vendors |
| `/vendor-invite/[slug]` | **no door** | 0 | Events, Users, Vendors |
| `/vendor/claim/[token]` | connected | 4 | Events, Service cards, Threads, Users, Vendors |
| `/vendor/claim/[token]/finalize` | connected | 1 | Events, Service cards, Threads, Users, Vendors |
| `/vendor/fit/[ref]` | connected | 1 | Availability, Events, Package, Proposal, Service cards, Taxonomy, Threads, Users, Vendors |
| `/vendor/lock/[token]` | connected | 1 | Availability, Contract, Events, Orders & activations, Users, Vendors |
| **Sign-in & onboarding** | | | |
| `/forgot-password` | connected | 2 | _unmapped_ |
| `/login` | connected | 353 | Events |
| `/onboarding/[type]` | connected | 2 | Events, Person, Taxonomy, Users, Vendors |
| `/onboarding/simple` | **no door** | 0 | Events, Orders & activations, Users, Vendors |
| `/onboarding/wedding` | connected | 30 | Events, Guests, Orders & activations, Service cards, Taxonomy, Users, Vendors |
| `/reset-password` | connected | 1 | Users |
| `/signup` | connected | 56 | Guests, Users |
| `/signup/you` | connected | 1 | Events, Guests, Users, Vendors |
| **Public site** | | | |
| `/` | connected | 71 | Availability, Events, Guests, Orders & activations, Papic, Run of Show, Seat Plan, Users, Vendors |
| `/3d_plan/demo/[token]` | connected | 1 | Events, Guests, Seat Plan, Service cards, Vendors |
| `/about` | connected | 4 | _unmapped_ |
| `/acceptable-use` | connected | 3 | _unmapped_ |
| `/alaala` | connected | 1 | _unmapped_ |
| `/api/v1` | connected | 1 | _unmapped_ |
| `/blog` | connected | 5 | _unmapped_ |
| `/blog/[slug]` | connected | 12 | Events, Users, Vendors |
| `/budget` | connected | 2 | Events |
| `/cookies` | connected | 3 | _unmapped_ |
| `/creators` | connected | 3 | _unmapped_ |
| `/download` | connected | 4 | _unmapped_ |
| `/explore` | connected | 41 | Availability, Events, Guests, Orders & activations, Papic, Run of Show, Seat Plan, Service cards, Taxonomy, Users, Vendors |
| `/explore/categories` | legacy stub | 0 | _unmapped_ |
| `/explore/compare` | connected | 4 | Events, Service cards, Users, Vendors |
| `/features` | connected | 11 | _unmapped_ |
| `/features/[slug]` | connected | 1 | _unmapped_ |
| `/for-suppliers` | connected | 12 | Events, Guests, Orders & activations, Service cards, Users, Vendors |
| `/guest-list` | connected | 2 | Events |
| `/help` | connected | 21 | Users, Vendors |
| `/help/[slug]` | connected | 3 | _unmapped_ |
| `/marketplace` | connected | 3 | Events |
| `/monogram` | connected | 2 | _unmapped_ |
| `/mood-board` | connected | 2 | Events |
| `/our-story` | connected | 5 | Events, Guests, Papic |
| `/pa3d` | connected | 4 | Events, Guests, Vendors |
| `/pa3d/try` | connected | 2 | Events, Guests, Vendors |
| `/pakanta` | connected | 2 | Events |
| `/palogo` | connected | 3 | Events |
| `/panood` | connected | 3 | Events |
| `/panood/demo/[token]` | **no door** | 0 | _unmapped_ |
| `/papic` | connected | 7 | Events, Guests, Orders & activations, Service cards, Users, Vendors |
| `/patiktok` | connected | 2 | Events |
| `/pawebsite` | connected | 3 | Events |
| `/pricing` | connected | 17 | Events, Guests, Orders & activations, Service cards, Users, Vendors |
| `/privacy` | connected | 17 | _unmapped_ |
| `/privacy/google-access` | **no door** | 0 | _unmapped_ |
| `/realstories` | connected | 8 | Events, Guests, Papic, Users, Vendors |
| `/realstories/[slug]` | connected | 2 | Events, Guests, Live Watch, Orders & activations, Papic, Run of Show, Seat Plan, Users, Vendors |
| `/refunds` | connected | 3 | _unmapped_ |
| `/samahan` | connected | 2 | Events |
| `/schedule` | connected | 2 | Events |
| `/seat-plan` | connected | 2 | Events |
| `/setnayan-ai` | connected | 4 | Events |
| `/suppliers` | connected | 2 | Events, Service cards, Taxonomy, Vendors |
| `/suppliers/[event]/[category]` | connected | 1 | Service cards, Vendors |
| `/suppliers/[event]/[category]/[city]` | connected | 2 | Service cards, Vendors |
| `/terms` | connected | 12 | _unmapped_ |
| `/tl/about` | connected | 2 | _unmapped_ |
| `/tl/features` | connected | 3 | _unmapped_ |
| `/tl/features/[slug]` | connected | 1 | _unmapped_ |
| `/tour` | connected | 5 | Events |
| `/tour/budget` | connected | 2 | Events, Orders & activations, Package, Service cards, Vendors |
| `/tour/gallery` | connected | 2 | Events, Mood Board library, Guests, Orders & activations, Papic, Person, Users |
| `/tour/seating` | connected | 2 | Events, Guests, Orders & activations, Seat Plan, Vendors |
| `/tour/vendors` | connected | 2 | Availability, Events, Service cards, Taxonomy, Users, Vendors |
| `/u/[userSlug]` | connected | 10 | Availability, Events, Guests, Papic, Proposal, Threads, Users, Vendors |
| `/u/[userSlug]/c/[chapterId]` | connected | 7 | Events, Threads, Users, Vendors |
| `/v/[slug]` | connected | 21 | Availability, Events, Guests, Orders & activations, Package, Proposal, Service cards, Taxonomy, Threads, Users, Vendors |
| `/v/[slug]/booth` | connected | 1 | Events, Guests, Seat Plan, Vendors |
| `/waitlist` | **no door** | 0 | _unmapped_ |
| `/web-only` | connected | 1 | _unmapped_ |
| **Internal (dev, prototypes)** | | | |
| `/demo-capture/[slug]` | **no door** | 0 | _unmapped_ |
| `/dev/booth-lab` | **no door** | 0 | _unmapped_ |
| `/dev/details-lab` | **no door** | 0 | Events, Guests, Users, Vendors |
| `/dev/hero-lab` | **no door** | 0 | Events, Run of Show, Users, Vendors |
| `/dev/home-lab` | **no door** | 0 | Users |
| `/dev/schedule-lab` | **no door** | 0 | Run of Show |
| `/prototype/mesh-call` | **no door** | 0 | _unmapped_ |

## How it was found, and what it cannot see

- **A screen** is a `page.tsx` outside `app/admin` (the admin map already covers the console). Intercepting modal routes are a second view of an existing screen and are not counted.
- **A door** is an address written where it will be followed: an `href`, a `router.push`, a `redirect()`, a `routes.…()` builder, a menu-registry slot (`lib/nav-registry-defaults.ts`, which also says phone vs desktop), an email or notification link, a URL helper's return value or a named address constant. A link from a page to itself does not count, and neither do doors from the admin console, sitemaps, next.config redirects or dev pages — they do not bring the person the screen is for.
- **It cannot see** an address assembled entirely at run time (`${base}/${key}` from a list of keys), or a link that arrives from outside the code (a QR printed on paper, an address typed from a poster). So "no door" means "no door in the code" — check before deleting.
- **A Root map node** comes from the tables the page reads (in the page and two imports deep), through the same table → node binding the concept-coverage check uses. No table, no node; nothing is guessed.
- **Next (Saturday, slice 2):** the FIELDS layer (every input → the one table.column it saves to), the "this fact already lives in X" check, and switching the CI check from report mode to failing on a NEW no-door screen (today's list is the baseline it ratchets from).
