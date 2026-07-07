# Setnayan — Operator's Guide: Account Creation → Editorial

> The full path a couple walks, from "Start planning" to their published wedding **Editorial** — what they do at each step, what the system stores, how it reaches the editorial, and where vendors + the Setnayan team plug in. Written 2026-06-20, grounded in the verified as-built flows and reflecting the QA fixes shipped this session. Items marked **(shipping)** are fixes merging to prod from this session's batch; everything else is already live.

---

## 0 · The big picture

**One app, three doorways:** couples plan, vendors run a business profile, the Setnayan team operates from the admin console. They're **RLS-isolated** — they don't read each other's data directly. The bridges between them are **shared chat threads, specific link columns, and notifications**.

**The editorial is the destination.** Almost everything a couple does becomes an input to their final wedding **Editorial** — a magazine "Chronicle" at `setnayan.com/<their-slug>`. The journey:

```
Create account → Onboarding → Dashboard
   → Plan: Guests · Vendors · Budget · Seating · Studio · Website photos
   → (optional) Buy in-app services (apply-then-pay)
   → Website lifecycle: Save-the-Date → RSVP → Day-of → EDITORIAL
   → (optional) Featured on Real Stories
```

**The single most important setting:** the editorial goes live to the public **when the wedding date has passed** (it's date-gated). Onboarding deliberately leaves the date open (the "date is an output of vendor discovery" philosophy), so **the couple must set a real wedding date** for the editorial to ever auto-launch — there's now a **"Set your wedding date" nudge** on the dashboard home **(shipping)**.

---

## PART 1 — Couple: create account + onboard

**Where:** homepage → **"Start planning · free"** → `/onboarding/wedding`.

The onboarding is a guided, mostly-tap-through flow (~18–20 screens). Each answer is held in the browser until **one final commit** at the end (so nothing is half-saved). Steps:

| Step | What they do | What it later feeds |
|---|---|---|
| Role | Bride / Groom / Someone helping | their host role + permissions |
| Ceremony | Religious / Civil / Mixed → faith (Catholic, Muslim, INC, Chinese, Christian, Born-Again, Cultural) | event type; **faith list is admin-managed** — all active faiths are honored |
| **Names + monogram** | 4 names, finalize the monogram (gates Continue) | the editorial **masthead** (e.g. "A & P") |
| Date | specific date(s) or a flexible window | the editorial dateline + **the live-go-live gate** (see §0) |
| **Love story** | how you met · the almost · the proposal · voice/tone | the editorial **lead narrative** ("Our story") + Pakanta song |
| Region | up to 2 PH areas | vendor matching; **regions are admin-managed (canonical table)** (shipping) |
| Guests + Budget | headcount + budget band | vendor ranking; **budget bands are admin-editable** (shipping) |
| Dream team | shortlist venues / "Setnayan AI" matching | considering-vendor rows |
| Essentials | pick service categories | plan + vendor matching |
| **Account gate** | email + password (or Google) | creates the account (`account_type=customer`) |

**Finish** → one commit writes the `events` row + couple membership + seeded data → lands on the **couple dashboard**.

> **Operator notes:** (1) Email signup currently bounces to a sign-in screen once (re-enter the password) — Google sign-in avoids it. (2) After landing, **set the real wedding date** (dashboard nudge) so the editorial can launch later.

---

## PART 2 — Couple: plan the wedding (this *is* the editorial's raw material)

### Guests (`/dashboard/[id]/guests`)
Add guests (quick-add, paste-list, or CSV), assign side/role, manage RSVPs, run day-of check-in.
→ **Feeds the editorial "By the Numbers"** (guests · attended · RSVP %). Free, unlimited.

### Vendors — the couple↔vendor connection (`/explore` → `/v/[slug]`)
1. **Save** a vendor → adds a "considering" row to their plan.
2. **Inquire** → opens a chat thread; the vendor is **notified** and can Accept (which costs them a token + reveals their name).
3. **Lock / book** the vendor → status becomes "contracted."
4. Vendor **marks complete** → couple **confirms received** → review unlocks.

→ **Feeds the editorial "The Team Behind the Day"** — each booked vendor appears with their name, category, **logo + tier badge, and a "#1 match" flag** when they were the couple's chosen pick. *(This credit chain was broken — `linked_vendor_profile_id` and `selection_match_rank` were never written — and is **fixed + backfilled this session (shipping).** Both the date-path and the Enterprise time-slot lock now stamp it.)*

### Budget + Seating (`/budget`, `/seating`)
Money ledger + seating chart (drag-assign, publish QR pack). **Couple-private — these do *not* appear in the editorial** (money-free + seating-disconnected by design).

### Studio — branding (`/studio/monogram`, `/studio/...mood-board`)
Monogram + mood-board palette. → **Feeds the editorial chrome** (masthead monogram + colour palette).

### Website photos (`/dashboard/[id]/website/our-photos`)
Upload up to 24 photos. → **The only auto source for the editorial "From the Day" gallery.** (Note: this is a manual upload, separate from the live Papic gallery.)

---

## PART 3 — Couple: buy in-app services (optional · apply-then-pay)

Free covers planning + RSVP + the 4-in-1 website. Paid SKUs (Setnayan AI, Panood, Animated Monogram, etc.) use **apply-then-pay**:
1. Open the service → **"Add this service · ₱X"** → checkout drawer.
2. Pay externally (GCash/BDO), upload the screenshot + reference code, **Submit**.
3. **Setnayan team reconciles** it (admin) → service activates; the couple is **notified** (payment matched / order paid). *(Order submission now also **notifies admins** so it's not poll-only — shipping.)*

*(All prices are admin-managed in the catalog and provisional pending the owner's pricing pass.)*

---

## PART 4 — Vendor side (how a vendor feeds the couple's editorial)

**Where:** `/vendor-dashboard`. A vendor's journey:
1. **Register** (mandatory company logo) → **submit 12-doc verification** → admin approves → verified + listed. *(Submission now notifies admins; approve/reject now notifies the vendor with the reason — shipping. Note: there is **no** 100-token verification bonus — that was retired, and stale "100 free tokens" copy was removed this session.)*
2. **List services** (the category picker now reflects the **admin taxonomy labels** — shipping).
3. **Receive an inquiry** → **Accept** (burns 1–3 region-banded tokens; the cost is shown on the returning-client hint) → two-way chat opens, name revealed.
4. Couple books → **"Booked via Setnayan."**
5. **Deliver** off-platform → **"Mark service complete"** → couple confirms → review unlocks.
6. **Add editorial media** ("From Your Vendors"): the chosen #1 vendor uploads up to 3 photos + 3 clips that appear on the couple's editorial. *(This was 100% dead — gated on the never-written `selection_match_rank` — and is **now unblocked (shipping).**)*

**Money:** Setnayan never holds funds (0% commission); vendors settle off-platform. Payout/hold/billing events now **notify the vendor** (shipping).

---

## PART 5 — Setnayan team (admin) touchpoints

From the admin console (`/admin`): **reconcile payments** (apply-then-pay queue), **verify vendors**, **resolve disputes** (the completion-dispute → demotion chain is now reconnected — shipping), **manage the taxonomy/event-types/faiths/regions/budget-band vocabularies** (these are the source of truth the app reads), and **curate Real Stories**.

---

## PART 6 — The Editorial (the ending)

### The website lifecycle (one URL, time-gated)
`setnayan.com/<slug>` shows a different face depending on the date:
- **Far out (>90d):** Save-the-Date film + reveal opening + add-to-calendar.
- **Run-up (≤90d):** RSVP + guest widgets.
- **Wedding day (T-1h…T+8h):** live "Day-of" mode (watch-live, photo wall, table/schedule).
- **After the date:** **the Editorial** — the magazine front page.

### The editorial editor (`/dashboard/[id]/website/editorial`)
Opens **pre-filled**: headline (names), eyebrow (archetype from guest count/spend), deck (years + date + venue), pull-quote (from the thank-you message). The couple edits the words, writes **"Your story,"** toggles which sections show, and clicks **Publish**.

> **Operator note:** public go-live is **date-driven, not the Publish button** — the editorial appears for guests automatically once the wedding date passes. Publish controls the share-card/draft state; it does not force the page live early. (The host can preview anytime via `?phase=editorial`.)

### What's auto vs manual on the editorial
| Auto-composed | Couple enters manually |
|---|---|
| Headline/monogram (names) · eyebrow (archetype) · deck · pull-quote | **"Your story"** lead paragraphs |
| **By the Numbers** (guests/attended/RSVP%/services) | **"From the Day"** photo gallery (Our Photos upload) |
| **The Team** (booked vendors + logo/tier/#1-match) *(now wired — shipping)* | Section visibility toggles |
| Hero photo · monogram + palette chrome | Showcase consent (privacy toggle) |
| **From Your Vendors** (vendor media) *(now unblocked — shipping)* | — |

### Real Stories (the public showcase)
A couple's editorial appears on `setnayan.com/realstories` when **all** hold: showcase consent on (signup checkbox or privacy toggle) · event is a wedding · public slug exists · the wedding is **30+ days past**. The team curates the order; every card links to the couple's own `/<slug>` editorial.

---

## 7 · Notifications map (who gets told what)

The accounts are isolated, so **notifications are the bridge.** After this session's overhaul, the cross-account events fire correctly (in-app bell; the transactional ones also email via Resend):
- **Couple ↔ vendor:** inquiry received/accepted/declined · booking confirmed · review request/received/reply · pax-surcharge change · schedule suggestions · the founder-operated demo-vendor responses **(all now wired — shipping)**.
- **Couple ↔ admin:** payment instructions/matched/paid/rejected/refunded · order awaiting reconciliation · support replies (incl. anonymous) · showcase/editorial decisions.
- **Vendor ↔ admin:** verification submitted/decided · payout paid/held · disputes filed/resolved · the 5 vendor-quality emails **(revived — shipping)**.

---

## 8 · Caveats & current state (be honest with testers)

- **Set the wedding date** or the editorial never auto-launches (date-gated). Nudge added.
- A few notification emits in `vendors/actions.ts` / dispute-completion files (**Phase B-2**) are queued to wire once their PRs land.
- Prices are admin-managed + **provisional** (owner pricing pass pending).
- macOS/iOS/Android apps are **deferred** until the website is finished; the desktop app is a thin shell that opens the live site (1-time upload).
- **⚠ Booking-flow gap (found in the 2026-06-20 live walkthrough):** a vendor's in-thread **"Offer another service"** is metadata-only — it shows an "Inquiring about…" chip but does **not** create a bookable/priced line, so the couple can't lock the vendor straight from chat. The working path today is: the vendor sends a **proposal** (or quotes a ₱ figure in chat) → the couple logs it on the **vendor workspace** (Costing form / QuoteBridge) → it appears in **Build** → **Lock**. Fix queued. The whole walkthrough (validated: onboarding→date-lock→inquiry→bidirectional notifications→token gate→editorial #1-match credit) + all findings are logged in `DECISION_LOG.md` (2026-06-20 "LIVE QA WALKTHROUGH") and memory `project_setnayan_live_qa_walkthrough_2026-06-20`. Demo couple `beaniko.demo@setnayan.com` / `setnayan.com/bea-niko` is left populated.

---

## 9 · Quick operator checklist (account → editorial)

1. ☐ Start planning → finish onboarding → create account.
2. ☐ **Set the real wedding date** (dashboard nudge).
3. ☐ Add guests; collect RSVPs.
4. ☐ Explore → Save/Inquire → book vendors → confirm completion (powers the editorial team credits).
5. ☐ Studio: set monogram + mood-board palette.
6. ☐ Website → Our Photos: upload the gallery.
7. ☐ (optional) Buy any paid services; team reconciles payment.
8. ☐ Open the Editorial editor → write "Your story" → toggle sections → Publish.
9. ☐ Turn on Real Weddings consent (privacy) if you want it showcased.
10. ☐ After the wedding date passes → the public Editorial is live at `setnayan.com/<slug>`.

---
*Next: the live demo walkthrough on setnayan.com (couple + a demo vendor) to validate this end-to-end once the fix PRs finish merging — findings fold back into this guide.*
