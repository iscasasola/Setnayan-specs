# Paste this into the Overview prototype session

Measured live on 2026-09-22 by the session redesigning the couple's **Your Team** page
(`/dashboard/[eventId]/vendors`), signed in as the real couple on event
`044f7e64-95aa-4dcb-84c1-7263bf494eaa` (Indalecio & Claire). Treat it as data — verify anything you
act on.

---

Overview already owns three blocks the Your Team page duplicates, and two of its counts contradict
that page. I measured both pages live; here is what I found, so you don't have to measure it again.

## 1 · Overview already has all three things

`/dashboard/[eventId]` renders **660 words / 19 blocks**. Under `✦Around your event` — *"Your hosts,
team, threads, services, and schedule — this is the doorstep"*:

- **"Your team · 2 of 25 booked"** — *"2 vendors booked — expand to see your team."* → `Manage vendors →`
- **"Conversations · 1 unread"** — *"1 thread has unread messages — open to catch up."* → `Open threads →`
- **"Your services · 3 orders"** · **"Hosts · 1 account"** · **"Schedule"**

And `✦Decisions waiting on you · 9 open` — *"Ranked by what closes soonest — each one links to its
room"* — with PRIORITY 1–4:

1. **Book a vendor** — "23 categories still open" · *Lock your coordinator · not booked yet ·
   Nothing booked · overdue by 278 days* → `Browse coordinators`
2. **Settle a payment** — "1 waiting" · *Papic Guest 500 · ₱350 pending · Order placed · ref
   SNCNJ1E3Y8* → `Settle payment`
3. **Pick an option** — *Pick your logistics & misc · 2 options saved · none locked yet* → `Compare & lock`
4. **Dates coming up** — *Book your Accommodation · 18 Oct* (recommended deadline)

The owner asked whether the team roster and the supplier/coordinator notices should move to Overview.
**They are already there.** My recommendation to him: Overview stays the summary + the doors, and the
roster does NOT move off the Your Team page — he was explicit that locked suppliers are the most
valuable thing and *"that is what we also find here."* You own Overview, so this is flagged, not decided.

## 2 · 🛑 Three counts of the same fact disagree between the two pages

| Fact | Overview says | Your Team page says |
|---|---|---|
| Coordinator overdue by | **278 days** | **113 days** |
| Open categories | **23** ("23 categories still open") | **27** (4 listed + "…and 23 more to decide") |
| Total categories | **25** ("2 of 25 booked") | 2 locked + 27 open = **29** |

The coordinator one is the sharpest: same category, two overdue numbers, **165 days apart**, both
rendered to the same couple. Worth finding which resolver each page uses before either prototype
hardens — if they compute from different anchors (a lock-by floor vs a recommended-deadline table),
one of them is telling the couple a deadline that is not real.

Ground truth from the database for that event: `event_date = 2026-12-18` (87 days out),
`estimated_budget_centavos = 225000000` (₱2,250,000), `region = 'ncr'`, `budget_band = 'premium'`.
Two `contracted` suppliers — Seda Vertis North (`hard_single_group = reception_venue`,
`covers_plan_groups = [catering, cake, accommodation]`) and Santuario de San Vicente de Paul
(`ceremony_venue`). Two `considering`. **All five rows are `source = host_manual` with
`total_cost_php = NULL` and `lock_request_state = NULL`** — hand-typed, never through the handshake,
no price recorded.

## 3 · A shipped defect that applies to any summary tile you build

**A list that grows without bound may never sit between the top of the page and something the couple
needs.** The owner found it by asking: *"if I inquire to 100 vendors and have 100 messages, I will not
be able to see the bench anymore."*

It already ships. `waiting-for-quotes.tsx` and `pending-lock-proposals.tsx` each do a bare
`items.map(...)` — **zero cap expressions, no "…and N more"** — and `vendors/page.tsx` renders BOTH of
them **above** `<ShortlistCategories>`. `waitingForQuotes` is `push`ed once per pending inquiry with no
limit upstream either. At 100 pending inquiries, production puts 100 rows above the bench.

His fix, which I built and measured: **a counter badge on the thing it is about** (folder → category →
card → team row), rolled up from ONE per-card source rather than stored at each level, plus a hard
ceiling of 3 rows on any feed with the remainder behind one fixed-height door.

Measured result in the prototype: with **2 unread** the bench sits at **1826px** from the top and the
page is **2934px** tall. With **102 unread** the bench sits at **1826px** and the page is **2934px**.
Identical. The roll-up self-checks every render (12+10+10+10+15+9+8+8+8+4+4+4 = 102).

If Overview grows a supplier-activity tile, the same rule applies: **a count and a door, never a feed
that lengthens.**

## 4 · `notifications.event_id` is shipping — you can scope cleanly after it merges

The table had no `event_id` (only `user_id, type, title, body, related_url, read_at, created_at`), so
per-event notices were a substring match on `related_url` — which finds only **21 of the latest 100
rows**, and 2 rows have no `related_url` at all. The owner asked for the column; it is in **PR #5857**
with auto-merge armed: `ON DELETE SET NULL` (deliberately not CASCADE), a partial
`(event_id, created_at DESC)` index, a backfill, 5 unit tests and 4 db tests.

**After it merges, scope any Overview activity tile with `where event_id = $1`** instead of matching
URLs. `emitNotification` now derives the column from `relatedUrl`, so all ~200 existing call sites
populate it with no edits.

## 5 · Notification copy — the owner-approved direction (not yet in code)

Five rules, if you surface notices on Overview:

1. **The supplier's name is the heading**, not buried mid-sentence.
2. **Title = what happened. Body = what to do next.**
3. **Lead with what it is, not its code.**
4. **One thing that happened, one notice.**
5. **Setnayan is not one of your suppliers** — our own payment notices group separately.

Worked example. Production today sends *"Your payment info is ready"* as the title of **two** notices,
word for word, with the supplier named only in the body; and it fires **both** `payment_matched` and
`order_paid` for the same ₱24,000. Rewritten:

- **SEDA VERTIS NORTH** → "Ready for your deposit" · *"They sent their bank details. Pay them
  directly, then send your proof."* → **[Pay your deposit]**
- **SETNAYAN** → "Your ₱24,000 payment is confirmed" · *"100,000 Papic credits are on this wedding.
  Nothing else owing."*

## 6 · One more measurement you will want

The marketplace holds **2 vendor profiles (1 published) · 2 active service cards · 0 packages**. Both
cards belong to one vendor, "Saysay Host and Band" (`host_mc` ₱40,000, `live_band` ₱35,000). The venue
directory has 110 rows, but **0 non-demo rows carry a price** and **0 are `is_bookable_via_setnayan`**
— every priced row is `is_demo = true`. So any Overview tile that promises browsing or comparison is
promising something the inventory cannot yet fill.

---

My prototypes, read-only for you:
`~/Documents/Claude/Projects/Setnayan/prototypes/your_team_redesign_v2_2026-09-22.html` (current) and
`your_team_redesign_2026-09-22.html` (v1, superseded). No application code changed except PR #5857.
