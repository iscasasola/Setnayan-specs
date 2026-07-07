# Setnayan — Per-Window Data Map (what each button collects & sends)
Date: 2026-06-18 · Source: shipped code `apps/web` @ origin/main (worktree `claude/save-to-phone`), verified by the QA oracle trace + live click-through.

## How to read this
- **Collects** = data held in the browser (React state + `localStorage` draft `setnayan_onboarding_wedding_draft_v1`). Nothing is in the DB yet.
- **Sends** = the DB table + key columns written when the button fires.
- **Free vs Paid** = whether the data captured/sent differs by plan.

## ⚠️ The free-vs-paid reality (read first)
**Couple account creation + the entire onboarding wizard collect and send the EXACT SAME data on every plan.** Everyone starts Free; there is no "pro onboarding." The paid split is about *capability/access*, not data capture, and shows up in only three places:
1. **Setnayan AI gate** (onboarding) — "Yes, match my vendors" turns on the deterministic matching layer. Free/declined = generic browse. Same data either way; the AI just *uses* it.
2. **In-app service checkout** (windows 49–52) — Free can plan + RSVP + 4-in-1 website for ₱0; paid SKUs (Setnayan AI ₱3,999, Panood, Patiktok, Animated Monogram, etc.) require the apply-then-pay order flow. *(All prices provisional — owner holistic-pass pending.)*
3. **Vendor tiers** (separate vendor onboarding) — Free vs Pro vs Enterprise genuinely collect different data + unlock different reach. Documented in PART V below.

---

# PART A — Account creation (windows 1–4)

| # | Window / route | Buttons | Collects | Sends (table.columns) | Free vs Paid |
|---|---|---|---|---|---|
| 1 | Account gate (`/onboarding/wedding` screen-account, or `/signup`) | "Create account · free", "Continue with Google", "Use email instead" | email, password (8+), account_type=customer (hidden) | `auth.users` (email, meta account_type) → trigger `handle_new_auth_user` → `public.users` (user_id, public_id `S89U-…`, account_type='customer', is_internal=FALSE) | Same. `is_internal=TRUE` only for the owner email |
| 2 | Same window — consent checkbox | "Include my wedding in Real Weddings showcase" (✅ pre-checked) | public_summary_consent=yes | `public.users.public_summary_consent_at = now()` (couples only; vendors blocked) | Same |
| 3 | (verify) `/admin/users` | — | — | new couple appears newest-first (all/customer filter) | Same |
| 4 | `/login?ready=<email>` | "Sign in" | re-typed email+password | session | Same |

**⛔ Bugs here:** ① Email signup **bounces to `/login`** instead of dropping into the dashboard (only Google passes through). ② The signup **First/Last name fields are discarded** — `display_name` stays NULL. ③ Consent at signup is **invisible to admin** (the `/admin/users` page doesn't read the column).

---

# PART B — Onboarding wizard (windows 5–22) — *client-state only until ONE commit at the end*

| # | Window | Buttons | Collects | Committed later to (table.columns) | Free vs Paid |
|---|---|---|---|---|---|
| 5 | Role | Bride / Groom / Someone helping | role | `event_moderators.role_subtype` (bride→bride, helper→family_helper) | Same |
| 6 | Ceremony kind | Religious / Civil / Mixed | kind | `events.ceremony_type` / `is_mixed_ceremony` | Same |
| 7 | Faith | Catholic / Muslim / INC / Chinese / Born Again / Christian / Cultural | faith[] | `events.ceremony_type` — **⚠️ only `catholic` is live; everything else silently downgrades to catholic** | Same |
| 8 | Names + monogram | 4 name fields, "Use this monogram" (gates Continue) | bride/groom first+last, monogram design, finalized=true | `events.bride_name, groom_name, display_name, monogram_frame_key, monogram_font_key, monogram_style` | Same |
| 9 | Date | Specific (≤4 dates) / Flexible window + calendar | date_mode, candidates/window | `events.date_mode, date_candidates, date_window_*` — **⛔ `event_date` itself is hardcoded NULL** | Same |
| 10 | Region | up to 2 place cards, "Near me", search | places[] | `events.region, venue_latitude, venue_longitude`, `style_preferences.search_areas` | Same |
| 11 | Guest count | slider (default 200) | pax | `events.estimated_pax` | Same |
| 12 | Budget | slider + amount, "No limit" | band + amount | `events.budget_band, estimated_budget_centavos` (×100) | Same |
| 13 | Love story (4 parts + voice + reveal) | story fields, chips, year fields, Warm/Playful/Formal, "This is us" | spark/almost/yes text, met_year, together_since, tone | `events.love_story` (JSONB) + `story_tone` + `special_message` — **⚠️ `events.together_since` DATE stays NULL (year only lives in love_story JSON)** | Same |
| 14 | Essentials + prefs | service category cards, reception setting, cuisine, look, ≥10 song picks | picks[], prefs | `style_preferences.interested_categories`, `events.venue_setting, mood_feel_key`, `event_song_picks` | Same |
| 15 | Find venue | shortlist real venues, "Add your own vendor" | shortlist[], byoVendors[] | `event_vendors` (considering rows) | Same — **empty if no vendors onboarded in region** |
| 16 | Plan / services | "keep guiding me" (ON), "reach my best matches" (OFF), per-category count | guidanceOptIn, sendTopInquiries, interestedServices[] | `style_preferences.*` + (if opted in) inquiry fan-out | **Paid SKUs only previewed here; purchase is a separate order** |
| 17 | **FINAL COMMIT** (events) | "continue with the free plan" / Purchase CTA | — | **`events`** row: event_type='wedding', display_name='Andrea & Paolo', slug auto, ceremony_type, venue_setting — **⛔ event_date=NULL** | Same |
| 18 | commit → members | (automatic) | — | `event_members` (member_type='couple', joined_via='created_event') | Same |
| 19 | commit → moderators | (automatic, best-effort) | — | `event_moderators` (role_subtype, permissions_json, pre-accepted) | Same |
| 20 | commit → songs | (automatic, best-effort) | — | `event_song_picks` (song_id, source='onboarding') | Same |
| 21 | commit → vendors+guests | (automatic, best-effort) | — | `event_vendors` (shortlist=venue/considering, BYO=misc), `guests` (bride+groom) | Same |
| 22 | commit → inquiry fan-out | (only if "reach my best matches" was ON) | — | `chat_threads` + first message per category | **Default OFF** |

**Setnayan AI gate** (between 15–16): "Yes — match the rest of my vendors" / "No thanks, I'll browse on my own" — **the one onboarding fork that is plan-relevant** (AI matching capability). Collects `guidanceOptIn`; no extra data.

---

# PART C — Guests (windows 23–33) · couple-private

| Button | Route | Sends | Feeds |
|---|---|---|---|
| Quick add | `/guests` QuickAddSheet | `guests` (side, role default 'guest', rsvp 'pending', photo_consent=TRUE) | editorial By-the-Numbers count |
| Quick add list (paste) | `/guests/quick` | `guests` bulk (cap 500) | count |
| Import CSV | `/guests/import` | `guests` bulk (cap 200, dup-skip) | count |
| Add detailed + plus-one | `/guests/new` | primary + child `guests` row | count |
| Edit role/side/group | `/guests/[id]` | `guests.role/side/group_category` | — |
| Bulk assign | SelectionBar | `guests` + `guest_group_memberships` | — |
| RSVP change | `/guests/[id]` | `guests.rsvp_status, rsvp_responded_at` | **livePax = max(estimated_pax, attending)** → vendor live pax |
| Soft delete | `/guests` | `guests.deleted_at`, frees `event_seat_assignments` | — |
| Share invite + approve claim | `/guests/claims` | `guest_claims.status`, `event_members` (guest) | — |
| Day-of check-in | `/guests/checkin` | `guest_checkins` (UNIQUE guest_id) | **⚠️ no RSVP gate — pending guests can check in** |

Free vs Paid: **identical** (guest list is free, unlimited).

---

# PART D — Vendor connection (windows 34–41) · the customer↔vendor chain

| Button | Route | Sends | Reaches vendor at | Flows? |
|---|---|---|---|---|
| **Save** | `/explore`, `/v/[slug]` | `event_vendors` (marketplace_vendor_id, considering) | — | **DOES NOT FLOW (a Save is invisible to the vendor, by design)** |
| **Inquire** | `/v/[slug]` | `chat_threads` (inquiry_status='pending'), `chat_messages`, `vendor_follows` | `/vendor-dashboard/messages` "New inquiry" badge | ✅ FLOWS |
| Message / nudge | thread | `chat_messages` (≤1 follow-up while pending) | thread body | ✅ |
| Vendor accepts | `/vendor-dashboard/messages/[id]` | `chat_threads.inquiry_status='accepted'`, token burn `unlock_vendor_event` | name revealed, 2-way opens | ✅ |
| Couple locks/books | `/dashboard/[id]/vendors` | `event_vendors.status='contracted'` → on deposit, schedule pools | `/vendor-dashboard/clients` "Booked", calendar | ✅ |
| Vendor marks complete | `/vendor-dashboard/clients/[eventId]` | `event_vendors.service_marked_complete_at` | review request to couple | ✅ |
| Couple confirms received | `/dashboard/[id]/vendors/[vid]/review` | `completion_status='confirmed'`, unlocks public review | `/vendor-dashboard/reviews`, `/v/[slug]` rating | ✅ |

**⛔ Bugs:** ① **Inquire-without-Save creates NO `event_vendors` row** — an accepted conversation that never appears in the planning grid until you also Save. ② `linked_vendor_profile_id` + `selection_match_rank` are **never written** → the "#1 match / first-pick" editorial credit + vendor day-of media block can never activate.

Free vs Paid: chat/inquire/book are **free for couples**. Vendor side: a **Free vendor burns a token** to accept; Pro/Enterprise differ (PART V).

---

# PART E — Budget / Seating / Studio (windows 42–48) · couple-private, editorial-bound

| Button | Route | Sends | Note |
|---|---|---|---|
| Add line item | `/budget` | `event_vendor_line_items` (PHP, not centavos) | **only on contracted+ vendors** |
| Log payment + proof | `/budget` | `event_vendor_payments` (amount, proof_r2_key) | off-platform money — **never reaches admin** |
| Add + seat tables | `/seating` | `event_tables`, `event_seat_assignments` | **needs exclusive editor lock** |
| Publish & print | `/seating/print` | `event_tables.qr_published_at`, `event_floor_plan.published_at` | QR pack |
| Monogram | `/monogram` | `events.monogram_*` | feeds editorial masthead |
| Mood board | `/add-ons/mood-board` | `events.role_palette, reception_design`, `event_moodboard_saves` | feeds website palette |
| Our Photos | `/website/our-photos` | `events.our_photos` (≤24 R2 refs) | **the only auto source for editorial "From the Day"** |

Free vs Paid: budget + seating + mood board + website = **free**. Animated Monogram is a **separate paid SKU** (the lettered monogram here is free).

---

# PART F — Buy + admin reconcile (windows 49–52) · the customer↔admin money chain

| Button | Route | Sends | Admin sees at |
|---|---|---|---|
| "Add this service · ₱X" | `/add-ons/panood` etc. (InlineCheckoutDrawer) | (opens drawer, no write) | — |
| Submit order + proof | drawer submit | `orders` (status='submitted', reference_code), `payments` (status='pending', proof) | `/admin/payments` queue |
| Admin approves | `/admin/payments` | `payments.status='matched'`, `orders.status='paid'` (if promoted), `receipts` | — |
| Customer confirms | `/dashboard/[id]/orders/[orderId]` | (read) capability activates | bell: payment_matched |

Free vs Paid: **this whole part only exists for paid SKUs.** ⚠️ Reconciliation is **fully manual** (no auto-matcher shipped); the receipt is an **app receipt, not a BIR Official Receipt**.

---

# PART G — Support (53–54) & PART H — Showcase consent (55–56)

| Button | Route | Sends | Admin/Reflection |
|---|---|---|---|
| Submit help form | `/help` | `help_messages` (status='new') | `/admin/help` + notifies all admins ✅ |
| Admin works ticket | `/admin/help` | `help_messages.status` new→in_progress→closed | — |
| Toggle showcase consent | `/dashboard/[id]/website/privacy` | `users.public_summary_consent_at` | — |
| Admin curation | `/admin/real-stories` | `events.showcase_featured_at, showcase_feature_rank` | appears only when consent + wedding + slug + T+30d all pass |

---

# PART V — Vendor onboarding (free vs Pro vs Enterprise) — *the real free/paid data split*
*(To be captured live when we create the demo vendor. Documented from the build map.)*
- **Free vendor:** 1 category, name hidden until first chat reply, **burns a token to accept inquiries**, 100 free tokens on verification.
- **Pro vendor (₱6,000/28d):** up to 3 categories + 3 agents, name always visible, sponsored reach.
- **Enterprise (₱10,000/28d):** unlimited categories.
- Tiers sell **reach, not features.** Different data collected at registration: company logo (mandatory), categories, service packages, agents.

---

## Bottom line on free vs paid
- **Account creation + onboarding + guests + seating + budget + mood board + 4-in-1 website + RSVP = the SAME data, free.**
- **Paid changes capability, not capture:** AI matching (gate), in-app SKUs (checkout), vendor reach (tiers).
- The only window where *more data is collected* on a paid path is **in-app checkout** (payment proof, reference code) and **vendor Pro/Enterprise registration**.
