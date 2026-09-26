# The guest pathway — prototype + build brief (Redesign Controller, 2026-09-26)

> Owner, verbatim: *"this needs to be built with the event hub, okay? because this is very important. make
> sure that the prototype is also clean and simple to understand just like the rest of what we are doing.
> we handle the chaos and organize it so everything is smooth for the users."*

**Part of the Event Hub build — not after it.** Every ruling below is a DECISION_LOG row dated 2026-09-26
(search "GUEST PATHWAY", "GET INSIDE", "NOBODY WITHOUT A KEY", "REQUESTS", "SWAP", "TWO LEVELS OF ACCESS",
"UNLISTED PERSON'S ACCOUNT"). Do not re-ask them.

**Order:** Step 0 live walkthrough (controller) → Step A prototype (Fable · high) → owner picks → Step B build
(Opus · high). Opus because it changes who gets inside an event, account binding, keys and headcount —
mistakes there are invisible and expensive.

---

## The one principle

**One button at a time. The guest never chooses between options.** The couple sees one list and three
verbs. We absorb every edge case so neither side has to think.

## 1. The rules (what the prototype must show and the build must enforce)

| Who | What they see |
|---|---|
| **Stranger** — general link, not signed in | General details only (names · date · story · look). Nothing on a private event. One button: **"Get inside: Scan your QR, Tap NFC or Sign in"**. |
| **Guest with a key** — invite link = QR = NFC (all carry the guest's `qr_token`) | Required answers missing? → **the RSVP page first**, only the missing switched-on questions, cannot be skipped → **inside** (seat · pass · Papic camera · gallery · announcements · Were You There?). A question added later is asked alone next visit. |
| **Couple marked them Attending** (confirmed by text/call — `rsvp_status` on the guest edit form) | Gate asks only the remaining details; shows "The couple has you down as attending ✓" + "Not coming after all?" until the lock. |
| **No key — RSVP from the general link, or signed in but not on the list** | "You're not on the guest list for this event yet" → **Ask to join** → type name (the list is NEVER shown) + RSVP + contact → "Request sent". NOT inside, and the event does NOT appear in their account/app, until the couple acts. A name match alone never admits. |
| **The couple — Guest List → Requests (n)** | Each request: suggested match + **Keep** (add to the list) · **Remove** · **Link** (merge into an existing guest) — the shipped verbs, owner 2026-09-26. Keep/Link → key issued → "Save to my account". |
| **Swap** — "Give this spot to someone else" on a guest who has NOT replied | New person takes the same seat/table/count; new key issued (`rotate_guest_qr_token`), the old QR/link stop working; old person not notified; confirmed guests can't be swapped; allowed after the lock, up to the day. |
| **Shared phone** | "Not you? Switch" under the guest's name. |
| **After the final-count lock, never replied, opens key on the day** | *(controller rec, owner to confirm)* inside, marked "Didn't reply", no headcount questions. The venue scanner never blocks over a missing form. |

**Plus-ones:** the RSVP asks a name for EVERY plus-one seat (+1…+4); each becomes its own guest row under the one who brought them ("Maria Santos · with Ben") with its own key/QR. Today only one `plus_one_name` exists; extra seats read "TBA".

**Plus-ones get their own access:** thank-you screen → "Your guests" → one **"Send their invite"** per plus-one (native share sheet, their personal link; no SMS from us) · no-phone plus-ones (kids, elders): passes in the bringer's **Me** → "Show Lola's pass" · names unknown → "+2 TBA", fill later from Me → "Add names".

**Account details win on sync:** an existing Setnayan account's name · photo · mobile · dietary are used and shown to everyone; the couple's typed label ("Tita Baby") stays visible only to the couple as "saved as".

**"Who can RSVP?"** — one stored value, shown in BOTH Guest List → Invite and Maker → Details (next to "What do
you ask your guests?"): **Only my Guest List** (default) · **Anyone, I approve**.

**The guest's screens (the whole path):**
1. Invitation → one button **RSVP**
2. RSVP page (same Event Hub, same theme) → only the switched-on questions → **Send**
3. "Thank you — see you on the 18th!" → one button **Save to my account** (method chosen by the device, never
   a choice: in-app webview — Messenger/IG/FB, where Google blocks sign-in → email link · iOS Safari / the iOS
   app → Apple · Android Chrome → Google) · small "Not now". Everything pre-filled from the invite + RSVP.
4. Coming back with the key → **Pre Event** (their seat · schedule · dress code · countdown).

**Last 30 days — "Your checklist"** at the top of each identified guest's page: what to wear (their role's dress code) · motif colours (Mood Board palette) · arrive by (run of show) · venue + directions · their table · what to bring (their QR + a couple line) · "Reply by <date>" first if unreplied. **Interactive:** each item is a tick ("3 of 5 ready" → "You're all set ✓"), saved to the guest (not the device), private to the guest; must reuse an existing guest save action (+0 route). (Reminder emails 30/7/1 days — listing only unticked items — come with the Schedule rebuild.)

**Terms at sign-up (vital, moved in):** "Save to my account" via Google/Apple must record `terms_accepted_at` + `terms_version` at that step (the OAuth callback never does today); the tick sits on the RSVP/Save step, unticked + required, like `/signup`.

**Invitation bar:** Home · Details · **RSVP** · Story · **Me** (Camera returns on The Day).

## 2. Step 0 — live walkthrough first (controller, owner approved)

On production with a TEST event + TEST guests only, in the iOS Simulator (Safari + a Messenger-style in-app
webview) at 390 px: key → RSVP → Save to account → return; general link as stranger; sign in not on list.
Record for every row of §1 what happens TODAY. Specifically measure: does account creation copy name /
mobile / dietary into the profile (or only email)? does Save appear right after Send? which inside content
leaks to a stranger (announcements especially)? The build is the delta, not a rewrite.

## 3. Step A — the prototype (Fable · high)

- Two columns of phone screens (390 px): **the guest** (every screen in §1, one per state) and **the couple**
  (Guest List → Requests with Link/Approve/Decline · Swap · "Who can RSVP?" in the Maker).
- House style: no cards/borders, one button per screen, helper text behind ⓘ, the theme's type and colour.
- Real-looking data for cale-ice (fictional guests). No prices.
- Deliver PICTURES (the owner's viewer runs no JavaScript) + open it in a browser tab. Copy the file into
  the repo's `build-sessions/` so the viewer can open it.

## 4. Step B — the build (Opus · high), from the shipped code

Start from: `lib/guest-one-path.ts` (resolveGuestViewer · guestAccountState · shouldSendKeepLink),
`lib/guest-session.ts`, `lib/event-account-link.ts`, `app/[slug]/_components/guest-account-card.tsx`,
`app/[slug]/_components/rsvp-widget.tsx`, `app/[slug]/invite/reply/page.tsx`, `app/join/[eventId]/actions.ts`
(`admitAsUnlisted` — REPLACE optimistic admit with a request), `app/dashboard/[eventId]/guests/claims/*`
(becomes **Requests**, verbs Link · Approve · Decline), `guests/[guestId]/actions.ts` (host rsvp_status), the
`rotate_guest_qr_token` function, the Event Bar resolver (`app/[slug]/_lib/site-nav.ts`, `stage-bar.ts`).

Must hold:
- **+0 server-action exports** if at all possible (production is ~29 routes under Vercel's 2,048 ceiling).
- One source of truth for "who is this viewer" (`resolveGuestViewer`) — page, actions and reply door agree.
- The inside content is gated at the SERVER, not hidden in the client.
- Existing self-added guests (`self_added_unlisted`) appear in Requests; nothing already inside is kicked
  out without the couple choosing.

Tests (each seen to fail once — sabotage, restore, `git status --short`): stranger sees no inside content
(camera, gallery, announcements, seat, exact venue) · key + missing answers → RSVP first · couple-marked
attending → only remaining questions · no key → request, no membership, event absent from their account ·
Link/Approve issues a key · Swap rotates the key and the old token is refused · "Not you? Switch" clears the
guest session · after-lock unreplied → inside as "Didn't reply" (once confirmed) · "Who can RSVP?" reads one
value in both places. Plus `pnpm -s lint`, every guard, phone check at 375/390 with touch.

## 5. Acceptance — the owner's check card

> **The guest pathway**
> **Open:** the test invite link on your phone (sent in chat)
> **Do:** 1. Tap RSVP and send. 2. Tap Save to my account. 3. Open the general link in another browser.
> **You should see:** one button each time; inside after Send; the general link shows only the details and
> "Get inside".
> **Screenshot:** each screen at phone size.
> **Reply:** "ok" or what looks wrong.
