# Supplier page — "Plan with Setnayan" → Follow + Add to an event · plan · 2026-10-04 · Fable

Owner ruling (DECISION_LOG 2026-10-03, row "SUPPLIER PAGE: 'PLAN WITH SETNAYAN' → FOLLOW + ADD TO AN EVENT"; that row names this plan `SUPPLIER_FOLLOW_PLAN_2026-10-03_fable.md` — this file is it): *"1. following: so you see their update like follow users on discover · 2. creates a marking that this is a vendor you follow when searching for vendors · 3. we sync them to an event we pick from their events or add a new event."* Inquire stays the one main action.

Read-only against `origin/main` **777cf8f07** (worktree, not `~`). Drawing: `prototypes/supplier_follow_and_add_2026-10-04_fable.html` (phone 375, light + dark, clickable **with no JavaScript** — states are CSS radio switches, so it works in the phone viewer) + PNGs beside it: `…_fable.png` (full page) · `-2` signed out · `-3` the sign-in sheet · `-4` one event, done · `-5` several events, the dropdown open · `-6` supplier search · `-7` Library. Sits inside the approved page `prototypes/supplier_page_2026-10-03_fable.html` frame 3. Rules applied: `INTERACTION_RULES.md` (one dropdown for 3+ choices · no captions · no doors elsewhere · toast on success · phone first) · RULE 0.

---

## 1 · What ships today (RULE 0 — all paths under `apps/web/`)

| Thing | Where | What it is |
|---|---|---|
| **"Plan with Setnayan"** | `app/v/[slug]/page.tsx` — grep `Plan with Setnayan` (two hits) | (a) header link, signed-out only, **hidden on phones** (`hidden … sm:inline`), → `/signup`; (b) bottom of the Inquire fold, `button-primary` (the same class as Inquire and the composer's button), shown to **everyone, signed in included**, → `/signup`. No test pins the string. |
| **Save / Saved** | `app/(shell)/explore/_components/save-vendor-button.tsx` · action `saveVendorToPicks` in `app/(shell)/explore/actions.ts` | Writes **`event_vendors`** (`status = 'considering'`, `source = 'host_manual'`) for ONE event: `event_id` from the form when given, else the primary host event. Terminal state "Saved to {event}". Signed out → the shipped sign-in sheet over the page, then the press re-runs itself. No event → "Start an event to save" → `/dashboard`. |
| **Where Saved shows** | `app/dashboard/[eventId]/vendors/_components/services-takeover.tsx` (`shortlist: 'Saved'`) · `shortlist-categories.tsx` · `app/dashboard/(account)/library/_components/vendors-tab.tsx` | Suppliers › Your planning › **Saved** (the bench, per event) · Library › Suppliers (own saves across events + suppliers bookmarked as a guest, `guest_saved_vendors`). |
| **Follow (supplier)** | table `vendor_follows` (migration `20260514150000_iteration_0019_follow_gate.sql`: `follower_user_id, vendor_profile_id, followed_at`, RLS follower-owns-row + vendor-reads-own) · `lib/follow-actions.ts` `followVendor` / `unfollowVendor` (upsert / delete, idempotent) · `lib/follow.ts` `isFollowingVendor`, `countVendorFollowers` · `app/_components/follow-gate.tsx` | Per **person**, no event. Today it is (1) auto-recorded when a couple presses Message (the 0019 chat-thread RLS gate — `inquiry-actions.ts`), (2) counted into the shop's "N saved you" badge (`count_saves_for_vendor` = follows ∪ guest saves), (3) read on `/explore` into `followedSet` → `VendorCard.isFollowing` → `FollowGate variant="card"`, **which renders no button and no mark** (owner 2026-09-08 "no Follow on a search result"). The shop page stopped rendering `FollowGate` on 2026-07-02 ("retires the old Follow / Save-to-picks row"). **No couple-facing list of followed suppliers exists** (`grep -rl vendor_follows app/dashboard` → none). |
| **Follow (people, Discover)** | `app/_components/frontdoor/discover-follow-button.tsx` → `setFollowByPublicId` → `app/u/_actions/audience-actions.ts` · table `user_follows` · shelf "Upcoming from people you follow" in `front-door-discover.tsx` / `lib/discover-events.ts` | A different relation (person → person). Its payoff is the Discover shelf of **public events** the followed people announce. `discover-events.ts` reads `user_follows` only — a `vendor_follows` row feeds nothing on Discover today. Suppliers have no "posts" table (`grep -rl "vendor_posts\|vendor_updates" supabase/migrations` → none). |
| **The event picker for a shop** | `app/v/[slug]/_components/add-shop-to-event-data.ts` `resolveAddShopToEvent(slug)` → options `{eventId, title, kindWord, dateISO, href}` via `eventsForStudioApp` (yours to organise · ongoing + upcoming) · drawn by `app/_components/marketing/add-to-event.tsx` (`AddToEvent`, a centred **dialog**, rows are LINKS carrying `?event=`) · rendered in the Inquire fold only when `options.length > 1` (D1: a couple with one celebration is never asked) | Already answers "which of your celebrations" for a shop — but each row only *navigates*; nothing is written. |
| **Sign-in over the page** | `app/_components/auth/sign-in-here.tsx` `useSignInPanel()` → `openSignIn({ onSignedIn })` | What `SaveVendorButton` uses. `FollowGate` still bounces to `/login?next=` — the older shape. |
| **No event → make one, then come back** | `app/dashboard/(account)/create-event/page.tsx` + `actions.ts` read `next` through `safeNext()` and redirect there after creation | The carry-through the vendor-invite claim loop already uses. |
| **Guards that touch this page** | `app/v/[slug]/one-inquire-button.test.ts` (exactly 3 bare `Inquire` labels) · `lib/no-door-out-of-the-app.test.ts` · `app/_components/marketing/add-to-event-is-the-only-difference.test.ts` (Studio pages: signed-in adds one button, never swaps) | Must stay green; see §4. |

**Measured in prod (re-measure, never trust this line):** `select count(*) from vendor_follows` was not re-run today; the 2026-10-03 review measured 2 public shops, 0 reviews. `select count(*) from event_vendors where status='considering'` is the Saved count.

---

## 2 · The key question — one mechanism or two?

**Follow is NOT Save renamed. They are two facts, both already in the schema, and each already has a home. Keep both; invent nothing.**

| | **Follow** | **Add to an event** |
|---|---|---|
| The fact | *I want to keep up with this supplier.* | *This supplier is on THIS celebration's list.* |
| Who it belongs to | me (`follower_user_id`) — survives every event I ever plan | one event (`event_id`) — the bench of that event |
| Row | `vendor_follows` (shipped) | `event_vendors` `status='considering'` (shipped — it IS Save) |
| Toggle? | yes — tap again to unfollow, no confirm | terminal "Saved to {event}"; removal lives on the bench (shipped) |
| Where I see it | Library › Suppliers › **Following** (new group, §4 step 5) · ♥ mark + "Following" filter in supplier search (owner item 2) · later, Discover "New from suppliers you follow" (owner item 1, §5) | Suppliers › Your planning › **Saved** · Library › Suppliers › Saved (both shipped, unchanged) |
| What the supplier sees | counted in "N saved you" (shipped) | the inquiry/lock path as today |

Why not one: renaming Save to Follow would make "Follow" mean *"for Maria & Jose's wedding"* — the 2026-09-08 lesson (*"Save adds to a specific event? this is a search result outside an event"*) in reverse. Renaming Follow to Save would put a no-event row under a word that already names an event list. The owner's own sentence separates them: *following … like users on Discover* vs *sync them to an event we pick*.

**The word.** On the shop page the button says **Add to an event** (the owner's phrase; a verb, naming the question it asks). Its done state is the shipped Save button's own: **✓ Saved to {event}** — the place it landed, which the owner also named (*"→ the event's Suppliers › Saved"*). "Add" is the act, "Saved" is the shelf. The explore card's "Save" takes the same label so the one component reads one way everywhere (owner Q4).

---

## 3 · Behaviour by visitor (drawn in the prototype, frames 2a–2c)

The calling card (approved §F) gains ONE second row under *Inquire · Share*: **♡ Follow · ＋ Add to an event**. Both quiet pills (`.b2`), 44 px, half-width each. "Plan with Setnayan" goes from both places; the header's signed-out link becomes a quiet **Sign in** (opens the same sheet). Nothing else on the page changes between signed out and signed in.

| Visitor | Follow | Add to an event |
|---|---|---|
| **Signed out** | sheet "Sign in to follow {shop}" over the page (`openSignIn({onSignedIn: retry})`) → ♥ Following | sheet "Sign in to add {shop} to an event" → then whichever row below fits the account |
| **Signed in · no event** | toggle | → `/dashboard/create-event?next=/v/{slug}?add=1`; the shop page, on `?add=1` with exactly one event, saves into it and strips the param (one press, no second question). The create page gets one line: "{Shop} will be saved to it." (it is an answer, not an explainer — it says what the carried param does) |
| **Signed in · one event** | toggle | button reads **＋ Add to {event name}** (names the only answer instead of asking) → tap writes `saveVendorToPicks(event_id)` → **✓ Saved to {event}** + toast "Saved · Suppliers › Saved" |
| **Signed in · several** | toggle | **＋ Add to an event ▾** → ONE **PickMenu** list: your celebrations (title · kind · date; the shipped `resolveAddShopToEvent` order) + last row **＋ Start a new celebration** (→ create-event with `next`) → pick writes the Save for that event → **✓ Saved to {picked}** |
| **Already saved to that event** | — | `already_saved` → same done state (idempotent, shipped) |
| **Shop not bookable** (still verifying) | hidden, like Save on explore | hidden |
| **Viewer owns the shop** (`viewerOwnsShop`) | hidden | hidden |

Failure: the plain reason + "Try again" in the button (the shipped Save's error state) — never a state that looks like success.

---

## 4 · Build steps (Opus) — no schema, no new table, no new action

1. **`app/v/[slug]/page.tsx`** — remove both `Plan with Setnayan` links. Header signed-out: `<Link href="/login">Sign in</Link>` that opens the sheet (keep the real href — `sign-in-here.tsx`'s rule). In the calling-card action row (today the `bookable ? … Inquire + ShareButton` block; after the supplier-page build, the §F card) add the second row: `<FollowSupplierButton …/>` + `<AddToEventButton …/>`. Pass `initialFollowing` from `isFollowingVendor(supabase, user.id, vendor.vendor_profile_id)` (fail-soft → `false` **and** `followUnknown=true`, so the button renders "Follow" but a tap re-reads — never claim "not following" as fact), `shopEventOptions` from `resolveAddShopToEvent(slug)` for **every** signed-in viewer (today it is fetched only when `showInquiryComposer`), and `viewerOwnsShop`. Handle `?add=1`: signed in, exactly one option → call `saveVendorToPicks` server-side with that `event_id`, then `redirect` to the clean URL.
2. **`app/_components/follow-supplier-button.tsx`** (new client island, or evolve `FollowGate`'s profile variant — prefer the new file and leave `FollowGate` for explore until step 5 retires it): `♡ Follow` / `♥ Following`, `aria-pressed`, optimistic toggle, calls `followVendor` / `unfollowVendor` (`lib/follow-actions.ts`, unchanged). Signed out → `useSignInPanel().openSignIn({ onSignedIn: retry })` — not a `/login` redirect. Toast on success via the app's toast.
3. **`app/(shell)/explore/_components/save-vendor-button.tsx`** — extend, don't fork: new props `events?: AddToEventOption[]` and `label` default **"Add to an event"**. 0 options signed in → `needs_event` doorway becomes `href="/dashboard/create-event?next=…"` (the shipped `/dashboard` doorway loses the supplier; `next` keeps it). 1 option → label "Add to {title}", press sends `event_id`. 2+ → render **`PickMenu`** (`app/dashboard/[eventId]/website/editor/_components/pick-menu.tsx`; options from `shopEventOptions` as `PickOption {key:eventId, label:title, hint:kindWord + date}` + a last option `{key:'new', label:'Start a new celebration'}`), `onPick` → `saveVendorToPicks` with that `event_id` (the action already validates `userHostsEvent`). Done state unchanged: "Saved to {eventName}" (the action already returns it).
4. **The Inquire fold's "which celebration" chooser** — replace the `AddToEvent` **dialog** (`shopEventOptions.length > 0 ? <AddToEvent …/>`) with the same `PickMenu` list, labelled "For which celebration", so the page has one way to answer one question. The Studio service pages keep their dialog (owner 2026-08-21) — out of scope; `add-to-event-is-the-only-difference.test.ts` is untouched.
5. **Supplier search (`/explore`) — owner item 2.** In `vendor-card.tsx`: render a `♥ Following` mark (hero corner) when `isFollowing`; add **Following** as one option of the existing filter dropdown (`filters` already carries `category`; add `following=1` → filter `followedSet`). Retire the inert `FollowGate variant="card"` mount (it draws nothing). Save button label → "Add to an event" (step 3's default).
6. **Library › Suppliers — a follow you can see.** `app/dashboard/(account)/library/_data/`: add `fetchFollowedVendors()` (RLS-scoped read of `vendor_follows` joined to `vendor_profiles`, same honest-read shape as `saved-vendors.ts` — a refused read says "couldn't load", never "none"). `vendors-tab.tsx`: a **Following** group above Saved, each row with "Add to an event" (step 3's button) and a "Following" toggle.
7. **Guards (new, source-level, phrased as properties):**
   - `app/v/[slug]/no-plan-with-setnayan.test.ts`: the page source contains no `/signup` link and no `Plan with Setnayan`; the card row renders exactly one Follow island and one Add island (anchor on the component names, print the count).
   - `lib/the-follow-is-not-the-save.test.ts`: `followVendor` touches only `vendor_follows`; `saveVendorToPicks` touches only `event_vendors` (+ the venue anchor) — the two tables never appear in each other's action (the "one fact, one mechanism" rule, enforced).
   - extend `one-inquire-button.test.ts`: still exactly 3 `Inquire` labels (the new row adds none).
   - `apps/web/app/(shell)/explore/following-mark-reads-the-set.test.ts`: `isFollowing` reaches a rendered element (today it is swallowed — "a flag in an object is not ink").
   - Run from `apps/web`; `no-door-out-of-the-app.test.ts` stays green (no new hrefs leave the app).
8. **Changelog fragment** `changelog.d/supplier-follow-and-add.md` with `SPEC IMPACT: DECISION_LOG 2026-10-03 row (this plan)`; corpus edits already made by this file.

Size: steps 1–4 medium (one PR); 5–6 small (second PR); 7 rides with each. No migration → no Ugat change.

---

## 5 · Not in this build (said out loud so nobody re-asks)

- **Owner item 1 — "see their updates like Discover".** Follow has nothing to deliver until a supplier does something a follower can see. No supplier-posts feature; the honest updates already exist as rows — a new **Their work** album (S3, DECISION_LOG 2026-10-03 "THEIR WORK"), a new `vendor_services` card, a new `vendor_service_discounts` deal. Build the Discover shelf **"New from suppliers you follow"** (`lib/discover-events.ts` gains a `vendor_follows` read; `front-door-discover.tsx` gains shelf 1b) **after S3 lands**, from those three sources (owner Q3). Prototype frame 3b draws it dashed.
- **The supplier's view of followers.** `vendor_follows` is vendor-readable by RLS; the dashboard shows "N saved you" (follows ∪ guest saves). Showing "followers" separately is a later question — not needed for the couple's button.
- **Desktop sticky rail** (Pro/Enterprise): carries Inquire · Share today; mirror the second row there in step 1 (same islands), no new design.

---

## 6 · Owner questions (recommended answer first — at most four)

1. **Is Follow its own thing (keep me posted on this supplier, no event), separate from Add to an event (this supplier on this celebration's Saved list)?** → **Yes — two buttons, two facts, both already in the database.** Alternative: one button only ("Add to an event") and no Follow until Discover can show supplier updates — simpler today, but it drops items 1 and 2 of your ruling.
2. **Choosing the celebration: one dropdown (PickMenu, the 2026-09-30 rule) or the centred dialog the Studio pages use (2026-08-21)?** → **The dropdown.** It is the rule for every 3+ choice now, it is lighter on a phone, and the Studio pages keep their dialog untouched. Alternative: reuse the dialog as-is (rows become buttons that write).
3. **What counts as a supplier "update" on Discover?** → **Only what suppliers already do: a new "Their work" album, a new service card, a new deal — built after S3, no posting tool.** Alternative: a supplier "post" feature (new table, new editor, moderation) — a different project.
4. **Should the supplier-search card's "Save" button also say "Add to an event"?** → **Yes — same component, same word, same done state "Saved to {event}".** Alternative: keep "Save" on the card and "Add to an event" on the page — two words for one act.
