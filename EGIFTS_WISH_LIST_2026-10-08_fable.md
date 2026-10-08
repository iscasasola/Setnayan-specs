# E-Gifts › the wish list — design (2026-10-08, Fable)

**Status: DRAWN, awaits the owner's look. Nothing built.** Prototype `prototypes/egifts_wish_list_2026-10-08_fable.html` (open one frame alone with `?s=<frame>`, `&dark=1`, `&tour=1`) · screenshots `prototypes/egifts_wish_list_2026-10-08_fable/` (`00-contact-sheet.jpg` + 28 frames at 375 px).

**Owner, verbatim.** The ask: *"E-Gfits can also have a list of their wants like things they want to buy. They can add the list here as well on e-gifts. Send money to purchase this."* His four answers, same day:
1. Funded so far — *"when people send gcash, they also give screenshot of their payment and the vallue and their message for the couple. this will be the way to measure."*
2. Splitting — *"yes. it will accumulate all the gift and mark them one by one"*
3. Got — *"when amount is reached."*
4. Free — *"free."*

**The verdict in two sentences.** The couple adds wishes in one new section of the shipped Studio › E-Gifts screen; a guest taps a wish, sends through the couple's own GCash or bank exactly as today, then shows the couple a screenshot, the amount and a word — that record is the measure, and a wish marks itself *Got it* when the records reach its price. Setnayan never holds or sees the money, every word says "sent" (never "received" or "verified"), and a guest's screenshot, name, amount and message are the couple's alone.

---

## 1 · What exists (Rule 0, read-only from `origin/rd/train-2026-10-08-a`)

| Thing | Where | Fields / behaviour | Who reads it |
|---|---|---|---|
| Ways to give | `event_egift_methods` (`20270725802892`) | `method_kind` gcash·maya·bank·paypal·other · `label` · `account_name` · `handle` · `qr_r2_key` · `note` · `is_enabled` · `sort_order`. **No amount, no order, no ledger** (the table's own invariant). | Hosts (RLS Pattern B: `event_moderators` accepted + legacy `event_members` couple + admin). **No anon policy** — `/[slug]/pabuya` reads enabled rows through the service-role client behind the published gate; the number and QR are withheld from a reader the event does not recognise (`viewerIsRecognisedForEvent`). |
| Accept gifts? | `events.gifts_on` (`20271260666366`) | boolean; `giftsAreOn()`; No hides every method from guests at once | authenticated (column grant) |
| Thank-you words | `events.pabuya_message` (≤ 600) | drafted in the Maker since "draft 1-3" (#6417), ✓ Apply publishes | authenticated |
| Registry link | `events.gift_registry_url` (`20271265788160`) | http(s), ≤ 500, saved **live** by `savePabuyaMessage` | authenticated |
| Studio › E-Gifts | `launch/_components/studio-tools.tsx` `StudioEgifts` | Accept gifts? ▾ · WHAT GUESTS SEE (`PabuyaCardList`) · WAYS TO GIVE (4 `StudioSwitch` rows: number · Add your QR (`FileUpload`, qr-first kinds) · name) · Registry link · "Guests see this right away" (`HUB_LIVE_WORDS`) · Thank-you row (`StudioThanks`: Your own words ⓘ + Start from ▾, no Save) — **approved as seen on preview `7429bfa`** | the host |
| E-Gifts manager page | `dashboard/[eventId]/pabuya/` (`pabuya-manager.tsx`, `actions.ts`: `saveEgiftMethod` · `deleteEgiftMethod` · `setEgiftMethodEnabled` · `moveEgiftMethod` · `savePabuyaMessage`) | the older full page; same table | the host |
| Guest door | `[slug]/_components/guest-doorway-strip.tsx` `WelcomeGifts` → `GiftDoorCard` ("E-Gifts · Send E-Gifts straight to the couple.") | four looks `gifts.door` (default) · `centred` · `side-rule` · `ruled` (`lib/scene-styles-parts.ts`, CSS in `globals.css` "THE PARTS' OWN STYLES"), picked in Stages › Style, stored in `events.style_preferences.scene_styles` | guests, strangers |
| Guest E-Gifts page | `[slug]/pabuya/page.tsx` | eyebrow "The pabuya · E-Gifts" · h1 "E-Gifts for ‹names›" · how-to-send line · the couple's words · registry link · `PabuyaCardList` (QR itself for GCash/Maya; `PabuyaMethodActions` full size · save QR · copy number) · `PabuyaTrustNote` · footer thank-you | anyone with the link; identifiers only for recognised readers |
| Create pattern | Love Story "+ Add a moment" sheet (`moment-sheet-studio.tsx`) | fields, frosted foot ✕ Not now · ✓ Keep this moment, `sn-glass-row` | — |
| Guest upload pipeline | `api/guest-selfie/route.ts` | cookie-authenticated guest session → presigned R2 PUT (`R2_BUCKETS.media`), jpeg/png/webp | the recognised guest |
| **A gift record / proof upload** | **none.** `Kasama_Pabuya_EventSite_2026-07-11.html` drew an amount + note + "42 blessings" in July; nothing shipped. `payment_screenshot_url` exists only on supplier payments. | — |

**Delta:** one Studio section (+ one row to a records list) · one guest sheet after "I sent it" · two tables. Nothing shipped is redrawn.

## 2 · The design, in plain English

### Couple — Studio › E-Gifts (frames 01–11)
The screen stays as approved. **One section, "Wish list", goes between Ways to give and the Thank-you message** — it reads top-down as *what guests see → how they send → what they send toward → what we say*, and a wish depends on a way to give being on, so it sits right under the switches it needs.

- **Rows** (no boxes): photo · name · `₱4,000 sent of ₱4,500 · 2 gifts` with a thin meter (gold while filling, green when got) · `Got it ✓` pill · ≡ grip (hold to reorder). Got wishes sink to the end. Count at the right of the eyebrow: `4 wishes · 1 got`.
- **＋ Add an item** — the one creating button (terracotta, icon + word, like Love Story's "+ Add a moment"). The sheet rises from the thumb zone: Photo · Name · Price (optional ⓘ "leave it empty and guests send any amount; a wish with no price never marks itself got") · Link (optional) · Note (optional). Frosted foot: ✕ Not now · ✓ Add it.
- **A wish open** (tap the row): the same fields, kept as you type, no Save; at the top the **Got it** switch with its honest line (*"Marks itself when the gifts sent reach ₱4,500"* / *"Reached ₱2,500 — marked for you. Flip it off if it isn't in your account yet."* / *"Marked by you"*), then **the gifts guests say they sent** for this wish (screenshot thumbnail · who · way · when · their words · ₱ "sent"). Foot: 🗑 Remove (second tap "Remove it?") · ✓ Done.
- **One gift open**: the screenshot large · their words · *Amount they said* (editable — "correct it if the screenshot differs") · *Counts toward* ▾ (move a mis-filed gift to another wish or "Any gift") · Remove. Line: *"A screenshot is what they sent you, not money in your account — check GCash or your bank."*
- **Gifts sent to you ›** — one row under the list → a full screen (✓ Done back): every record newest first, total *"₱14,500 said sent in 5 gifts"*, the same tap-to-correct. Footer: *"Only you see these. Guests see each wish's total, never a name, amount or screenshot."*
- **Empty**: three grey sample row shapes (editor-only, `aria-hidden`, as Love Story's empty state does), "No wishes yet.", ＋ Add an item.
- **No way to give switched on**: the list is kept but an amber line says *"Switch on a way to give — guests can't send for a wish without one, so the list is kept but not shown."* The guest page draws no list.
- **Accept gifts? No**: everything below folds to *"Guests see no E-Gifts. Your ways to give, wish list and gifts are kept for when you switch it back on."*
- **Couldn't load**: *"Couldn't load your wish list."* + Try again — never "No wishes yet" with an add button under it (the shipped `readEgiftMethods` rule, kept).
- **Tour** (first visit, thumb zone): *"Add what you'd love. Guests send toward a wish through your own GCash or bank and show you a screenshot — the money never passes through Setnayan. A wish marks itself Got it when what they sent reaches its price; check your account first."*

### Guest — Welcome › gift door · E-Gifts page (frames 12–25)
- **The door** keeps its words and gains one line when there are open wishes: *Wish list · 4 things they'd love.*
- **The list** sits **above Ways to give** on the E-Gifts page (a wish is what you give toward; the ways are how), in the event's own type and colours, wearing the E-Gifts look already picked in Stages › Style — **no new picker**: The door · Side rule → **Rows**, Centred → **Tiles** (2-up, photo on top), Between rules → **Ruled**. Each wish: photo · name · `₱4,000 of ₱4,500 sent` + meter, or the price alone, or *Any amount* (· ₱ sent so far). A got wish is dashed, struck through, *Got it ✓ · thank you*, at the end; tapping it only says "Already got — thank you!". Under the list: *"Tap a wish to send toward it — or give any amount below."*
- **Tap a wish → "Send for the Air fryer"** (sheet in the lower two-thirds): *"₱500 more reaches ₱4,500 · any amount helps — it goes straight to Maria & Jose's own account."* then the couple's **shipped** ways exactly as today (the QR itself for GCash/Maya with Full size · Save QR; the bank number with Copy; identifiers withheld from unrecognised readers exactly as today), the trust line, and the foot ✕ Close · **✓ I sent it**.
- **"I sent it" → "Show Maria & Jose"** — the owner's measure, nothing more: *Your screenshot* (Add it — "from GCash, Maya or your bank") · *Amount* (prefilled with what was left, editable) · *A word for Maria & Jose* (optional) · *From* = their name from the invitation, or a Name field for a guest who is not signed in (frame 19). Foot: ✕ Not now · **➤ Send to Maria & Jose**. The amount is required; the screenshot is asked for first but not enforced (a bank app may not give one) — the couple sees "no shot" and judges.
- **After**: *"Thank you, Tita Nene. Maria & Jose will see your screenshot, ₱500 and your words beside the Air fryer. No other guest sees them — and the wish is now marked got."* The guest's own wish row then reads *You sent ₱500 ✓ · ₱4,500 of ₱4,500*.
- **A gift toward no wish**: under Ways to give, *"Sent a gift? Show Maria & Jose ›"* opens the same record sheet with no wish (frame 08 shows such a record as "Any gift").
- **Gifts off** (`gifts_on = false`) or no way to give: nothing drawn — the Welcome has no door, the page has no list (frame 24).

### Honesty and privacy (the lines every screen keeps)
- A record is a **claim**. The words are *sent* / *said sent* / *what guests say they sent* — never *received*, *paid*, *verified*, *funded*. The couple can correct the amount, move the gift, or remove it (a fake, a double entry, a typo).
- **Who sees what:** guests see each wish's `₱ sent of ₱ price` and their own gift only. Another guest's name, amount, message and screenshot are the couple's alone — the screenshot URL is served behind the host session like the QR route, never on a guest page. (If the owner ever wants a total shown to guests, it is one switch later; not drawn.)
- **What a stranger could abuse:** a passer-by with the link cannot see the number or QR (shipped gate) and cannot write a record unless the event recognises them (invitation link or scanned QR — the same rule as the RSVP). A recognised guest who lies inflates one wish's meter until the couple removes the record; nothing else moves, and the couple's own GCash is the truth they check against. The automatic Got it is therefore said as *"marked for you — flip it off if it isn't in your account yet"*.
- Setnayan holds nothing, sees nothing, refunds nothing (owner 2026-10-08: no refunds anywhere).

## 3 · Data — exists vs NEW

Exists and reused unchanged: `event_egift_methods` (the ways), `events.gifts_on`, `events.gift_registry_url`, `events.pabuya_message`, the E-Gifts scene style pick, the guest recognition rule, the guest upload route, `FileUpload`.

**NEW — two tables (smallest shape), RLS as `event_egift_methods`:**

```
event_wish_items
  wish_item_id uuid pk · public_id text unique default generate_public_id('H') · event_id uuid fk events on delete cascade
  name text not null (≤ 60) · price_php integer null (check > 0) · photo_r2_key text null · link_url text null (http(s), ≤ 500, the registry rule)
  note text null (≤ 120) · sort_order int not null default 0
  got_at timestamptz null · got_by text null check in ('auto','host')   -- null = open
  created_by_user_id uuid references auth.users(id) ON DELETE SET NULL · created_at · updated_at (+ the set_updated_at trigger)
  index (event_id, sort_order)

event_gift_records
  gift_record_id uuid pk · public_id text unique default generate_public_id('G') · event_id uuid fk events on delete cascade
  wish_item_id uuid null fk event_wish_items on delete set null     -- null = a gift toward no wish ("Any gift")
  amount_php integer not null check > 0 · screenshot_r2_key text null · message text null (≤ 240)
  giver_name text not null (≤ 80) · giver_guest_id uuid null fk guests on delete set null (the recognised guest)
  method_kind text null (the way they said they used) · created_at · removed_at timestamptz null (the couple's remove = soft, so a disputed record can be restored)
  index (event_id, created_at desc) · index (wish_item_id)
```

- **RLS:** both tables `FOR ALL TO authenticated` with the `event_egift_methods_host_all` predicate (moderators accepted · legacy couple · `is_admin()`); **no anon policy**. Guests read wishes and the per-wish sums through the service-role client behind the published gate, as `/[slug]/pabuya` reads the methods; a guest's record is inserted by a server action that first passes `viewerIsRecognisedForEvent` (the shipped rule) and then writes with the admin client — the same shape as the RSVP writes. The screenshot rides the `guest-selfie` presign route (own prefix `gift-shots/<event>/`), and is served to the host only through a host-gated route like `/api/pabuya/qr/[publicId]`.
- **Got it:** `got_at`/`got_by` are set by the record-writing action (sum of non-removed records ≥ `price_php` → `auto`) and cleared by the removing/correcting action when the sum drops below (only if `got_by = 'auto'`); the host's switch writes `'host'` or null. A wish with `price_php null` is never set automatically. Done in the action, not a trigger, so the two guards that watch `supabase/migrations/` (Ugat map + exposure baseline) see only two plain tables.
- **Live, not drafted (recommended):** wishes and records are rows, like Ways to give, and the screen already says "Guests see this right away" above them; a record must count the moment a guest makes it and a wish must mark itself at once, which a draft cannot do. Alternative: draft the item fields (name · price · photo · link · note) in the hub draft and ✓ Apply them, with records and Got it still instant — more plumbing, two kinds of truth on one screen; only worth it if the owner wants wishes staged before the Hub goes live.
- **Free, no ◆ anywhere** (owner). No item cap drawn; a soft cap of 30 items can be a later guard if lists get silly.
- The migration adds no column to `events`, so none of the three-things-per-events-column cost applies.

## 4 · Owner words still open (recommendation first)
1. **Per item** / One pool — *Per item*: the guest picks the wish and several guests add up on it (frames 13–23); *One pool*: every gift adds to one total that fills the list from the top (frame 25). Per item is recommended because the guest chose that thing and the couple's thank-you can say so; a pool can mark a wish got with money a guest meant for another. In Per item, money beyond a price stays on that wish (shown as ₱5,200 of ₱4,500 · Got it) — moving it silently would misstate what a guest gave; the couple can move a record by hand.
2. **Live** / Draft — see § 3.

(The four questions of the brief are answered by the owner and drawn; they are not re-asked.)

## 5 · Taps
- **Add an item** from Studio › E-Gifts: ＋ Add an item (1) → type name, price (photo optional) → ✓ Add it (2). From the Studio home: + the E-Gifts tile = 3.
- **Send for an item** as a guest: Welcome › E-Gifts door (1) → the wish (2) → the QR is on the sheet; Full size (3) to scan from a second phone. Telling the couple: ✓ I sent it (1) → amount is prefilled; add the screenshot (2) → ➤ Send (3).

## 6 · Build plan (PR-sized; each ends with a 375 side-by-side, prototype left · build right)

| PR | Scope | Touches | Schema |
|---|---|---|---|
| **E-PR1 · the two tables** | `event_wish_items` + `event_gift_records`, RLS, indexes, updated_at; `lib/wish-list.ts` (types, `SELECT` lists, `sumSent`, `reachedPrice`); db test that a non-host reads zero rows and a host reads their own; Ugat node + exposure baseline lines | `supabase/migrations/`, `lib/`, `tests/db/` | NEW (above) |
| **E-PR2 · Studio › Wish list** | the section between Ways to give and Thank-you: rows + meter + ＋ Add an item sheet + item sheet (Got it switch, fields kept on blur, Remove two-tap) + reorder; actions `saveWishItem` · `deleteWishItem` · `moveWishItem` · `setWishItemGot`; empty · no-way-to-give · Accept-No · couldn't-load states; the tour; the "Gifts sent to you" row (count only) | `launch/_components/studio-tools.tsx` (lazy — the Maker first load has 0.1 KB headroom), `dashboard/[eventId]/pabuya/actions.ts`, `FileUpload` reuse | — |
| **E-PR3 · the guest list + send sheet** | `WishList` on `/[slug]/pabuya` above the ways, wearing `gifts.<look>` (Rows · Tiles · Ruled mapped from the four E-Gifts styles); the door's extra line on Welcome; the send sheet reusing `PabuyaCardList` + `PabuyaMethodActions`; got/no-price/long-list/gifts-off states; `the-guest-text-is-honest` test extended: no "received/verified/funded" on any gift surface | `[slug]/pabuya/page.tsx`, `guest-doorway-strip.tsx`, `globals.css` (three list shapes under the gifts looks), `lib/invitation-welcome.ts` | — |
| **E-PR4 · the gift record** | "Show Maria & Jose" sheet (screenshot via the guest presign route under `gift-shots/`, amount, message, name when unrecognised); `recordGift` action (recognition check → admin insert → auto Got it); the thank-you; the guest's own "You sent ₱ ✓"; "Sent a gift? Show the couple ›" under the ways | `[slug]/pabuya/`, `api/guest-selfie` (prefix param) or a sibling route, `lib/pabuya-recognition.ts` reuse | — |
| **E-PR5 · Gifts sent to you** | the full-screen list (OpenInPlace, ✓ Done), one gift open (screenshot via a host-gated image route, amount correction, Counts toward ▾, soft remove/restore), the sums re-settled on correction | `studio-tools.tsx` (lazy), `actions.ts`, `api/gift-shot/[publicId]` (host-gated like `/api/pabuya/qr`) | — |

Guards to extend, never weaken: `the-guest-text-is-honest` (no money-verified words), `an-account-number-is-not-public` (the send sheet withholds identifiers exactly as the page does), the order-mint/exposed-table rosters (two new exposed tables), the Maker first-load budget (every new Studio piece lazy).

## 7 · Where it sits on the Map
- **Couple:** Studio › E-Gifts › **Wish list** (rows · ＋ Add an item · a wish › its gifts › one gift) · **Gifts sent to you** › one gift. Three taps from Studio home to any gift record.
- **Guest:** Welcome › **E-Gifts door** (one new line) → E-Gifts page › **Wish list** › a wish › the couple's ways to give › **I sent it** › Show the couple › thank-you. Also E-Gifts page › Ways to give › **Sent a gift? Show the couple**.

## 8 · Frames (prototype `?s=` · screenshot)
01 today · 02 wish-empty · 03 wish-five · 04 wish-add · 05 wish-edit · 06 wish-got · 07 wish-gift · 08 wish-gifts · 09 wish-noway · 10 wish-off · 11 wish-fail · 12 g-welcome · 13 g-rows · 14 g-side · 15 g-tiles · 16 g-ruled · 17 g-send · 18 g-record · 19 g-stranger · 20 g-sent · 21 g-got · 22 g-long · 23 g-noprice · 24 g-off · 25 g-pool (the One-pool alternative) · 26 wish-five&tour=1 · 27 wish-five dark · 28 g-rows dark.
