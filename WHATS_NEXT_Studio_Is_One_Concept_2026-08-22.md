# WHATS_NEXT — STUDIO IS ONE CONCEPT, AND THE PAGES THAT ASK FOR MONEY HAVE NO HEADLINE

**Written 2026-08-22 because the owner said: _"save the issue on what's next? we are
running in circles."_**

This file exists so the next session does not re-derive any of it. Everything below is
measured against `origin/main` (`a4e5ec1be` at the time of writing) and the **live
production database**, not against a document.

⚠ **A HANDOFF IS NOT EVIDENCE — including this one.** Every claim carries the command
that produced it. Re-run before acting.

---

## § 0 · HOW THIS STREAM STARTED

The owner pressed **Unlock** on Setnayan AI, screenshotted what he got, and said:

> *"i tried unlocking setnayan AI. this is what shows when i clicked unlock. it does
> not look appealing."*

Then he widened it:

> *"so we will discuss all the in app services of setnayan for a wedding (since all
> are there), it can easily adjust to other events."*

Then, over three more messages, he made the decisions in §1–§3.

---

## § 1 · ✅ SHIPPED — DO NOT REBUILD

### 1a · The Studio group follows you into the event — PR [#4709](https://github.com/iscasasola/setnayan-platform/pull/4709), MERGED 2026-08-21T16:44Z

Owner, comparing the sidebar before and after opening a wedding:

> *"when we enter an event it becomes suite and other features are added there. This
> seem wrong since we lose the consistency of the concept. What we want is for that
> Studio to still show on the sidebar, but now it is link to that event."*

Until this, the **Studio** group collapsed to nothing the instant an event context was
present, and the event's own menu carried ONE row labelled *Studio* / *Suite* in its
place. The named products taught a stranger what Setnayan makes and then vanished at the
exact moment somebody finally had somewhere to open them.

What shipped:

- The Studio group is no longer gated on `railContext`. **The Marketplace category group
  still is** — deliberately. Fifteen supplier categories beside a wedding's own sections
  is the list the binding drawing rejected; named products under one heading is not the
  same thing.
- `app/dashboard/[eventId]/layout.tsx` passes `studioEventId`;
  `resolveRailStudioEvent(preferEventId)` **matches it against the person's own
  organiser events** before pointing a row at it, then falls through to the shipped
  count-based answer. 🔒 A rail row is a door, and a door built from an unverified path
  parameter is a door into somebody else's wedding.
- The group ends in one **"All services"** row → the services hub for that event. The
  event menu's own hub row is dropped **from the desktop rail only**
  (`EventRailContext` filters `key !== 'studio'`). 🔑 **The same builder feeds the
  phone's bottom bar, which carries NO Studio group** — remove it there and a phone
  loses its only door to the shelf. `lib/customer-menu.test.ts` still pins it.
- New **`lib/studio-hub.ts`** owns the single `NEXT_PUBLIC_SUITE` branch
  (`studioHubHref`). It was hand-typed in two places that must agree; the rail's new row
  would have been a third. `env-flag.test.ts`'s `CONVERTED` registry moved with the
  reader — its half-pair sweep asks the repo, not the list, so this is not the guard
  going quiet.

⚠ **NAMED DEBT — the Studio rows stay UNLIT.** Lighting them needs ONE match list
spanning `FrontDoorShell` and `EventRailContext`; run separately the two **double-light**
— `3D Plan` opens `/seating/lab` while the event menu's own `Seat plan` row
prefix-matches `/seating`, and two lit rows read as broken. Unlit is exactly today's
behaviour, so nothing regressed. The fix is one combined match list and it is a slice of
its own.

Guard: `app/_components/frontdoor/studio-follows-you-in.test.ts` — 8 assertions, every
one mutation-checked **by occurrence count**.

### 1b · Pakanta is the eighth Studio product — PR [#4711](https://github.com/iscasasola/setnayan-platform/pull/4711), OPEN at time of writing

Owner: *"pakanta is paid. so add this to the studio."*

Pakanta had been **sold since 2026-05-14 with no public page of any kind** — the only
way to meet it was to already own a wedding and open the services hub.

- **`/pakanta`** is now a real public product page on the shared doorway kit. Its words
  are lifted from `add-ons-detail.ts`, which has carried them since the App Store detail
  pages were built — **not rewritten**, because a second set would give a couple two
  different accounts of one product.
- `STUDIO_APPS.length` is **8**. No `surface` (Pakanta is not wedding-only) and no
  `demo` (nothing renders a Pakanta overlay).
- Registered where a guard demanded it: sitemap · `llms.txt` (route list AND the prose
  line) · SEO health-check sweep · doorway-invariants list · doorway `studioKey` list ·
  and **`lib/reserved-slugs.ts`, so no shop, wedding or person can claim `pakanta` as a
  permanent address.**

🚨 **THE GUARD THAT HAD KEPT PAKANTA OUT COULD NEVER HAVE FIRED.** It asserted
`!/pakanta/i.test(DOOR_CODE)` where `DOOR` is `front-door.tsx`. The Studio rows are built
from `STUDIO_APPS` in `lib/studio-apps.ts`, and that word **has never appeared in the
front door's own source** — so adding Pakanta to the rail would have left it GREEN.
Decoration for its whole life while naming a real rule: *a rule everybody believed was
enforced.* It is now inverted **and repaired** — it walks the real rail rows and asks the
filesystem whether each one's page exists, catching a row that outlives its page for all
eight products.

---

## § 2 · ⏭ DECIDED, SCOPED, NOT BUILT — RETIRE PABATI

**Owner, 2026-08-21: _"we do not need pabati. retire it because it is part of papic."_**

⚠ **This SUPERSEDES PR [#4704](https://github.com/iscasasola/setnayan-platform/pull/4704)
(merged 2026-08-21T16:35Z), which made Pabati FREE** on the owner's earlier instruction
in another session the same afternoon. Free was the right answer to the question asked
then; retire is the answer to the question asked after it. **Do not treat #4704 as the
current state** — its `FREE_FOR_ALL_SKUS` entry has to come out along with everything
else, because a free SKU that no longer exists is not free, it is dark.

### Why it is safe — measured in prod, 2026-08-21

```sql
select (select count(*) from pabati_clips)                                    as clips_ever,
       (select count(*) from orders where service_key='PABATI')               as orders_ever,
       (select count(*) from papic_challenge_library where capture_kind='pabati') as pabati_challenges,
       (select count(*) from papic_challenge_library where capture_kind='clip')   as clip_challenges;
```

| | |
|---|---|
| greetings ever recorded | **0** |
| times it has ever been bought | **0** |
| challenge-library rows with `capture_kind='pabati'` | **1** of 631 |
| challenge-library rows that already ask for a **clip** | **284** — 47 of them in the `greeting` category |

🔑 **THE CAPABILITY DOES NOT DIE WITH THE PRODUCT.** Pabati is one row in the Papic
challenge library (`library_id 5` · slug `pabati` · *"Leave the newlyweds a video
greeting."* · `mission_type video_greeting`). Papic's own clip recorder already does the
same job 284 times over. **The retirement converts that row to `capture_kind='clip'`** so
the guest is still asked to leave a greeting — they just record it the way they record
everything else in Papic.

### The scope — ~50 files, enumerated before starting

```bash
grep -rln "pabati\|PABATI" apps/web supabase --include="*.ts" --include="*.tsx" --include="*.sql"
```

The delete list, grouped:

1. **The separate surface** — `app/pabati/[eventId]/page.tsx` · `app/api/pabati/clip/route.ts` ·
   `lib/pabati.ts` · `lib/offline/service-handlers/pabati-handler.ts` (+ its registration
   in `sync-daemon.ts` and `offline/types.ts`) · `app/[slug]/_components/pabati-prompt.tsx`
   and its mount in `site-body.tsx` · `loaders.ts` · `site-identity.ts` · `types.ts`.
2. **The couple's surfaces** — `day-of-mode/video-guestbook-card.tsx` + `grid.tsx` +
   the gating in `dashboard/[eventId]/page.tsx`; the recap "Video Guestbook" section in
   `[slug]/_components/editorial/data.ts` + `editorial-content.tsx`.
3. **The capture kind** — `CaptureKind = 'photo' | 'clip' | 'pabati'` in
   `lib/papic-missions.ts` loses its third member, and with it `pabatiActive` threading
   through `papic-missions.ts` · `couple-challenges-manager.tsx` ·
   `api/papic/guest-missions/route.ts` · `papic-challenge-panel.tsx` · `papic-games.ts` ·
   `papic-cameras-pure.ts` · `simulated-guest-preview.ts`.
4. **The SKU** — deactivate `PABATI` in `platform_retail_catalog_v2` (idempotent; **do
   not assume #4704's migration applied — it had not, see §3**), drop it from
   `FREE_FOR_ALL_SKUS` in `lib/entitlements.ts`, `lib/v2/sku-catalog-v2.ts`,
   `lib/v2-catalog.ts`, `(shell)/pricing/page.tsx`, `onboarding-pricing.ts`,
   `persona-packs.ts`, `experience-personas.ts`, `api/v1/billing/initialize-maya/route.ts`.
5. **The empty table** — `pabati_clips` (0 rows) follows the LED-backdrop precedent
   (PR #4356), which dropped its two empty tables.
6. **`lib/llms-txt.ts`** — drop `PABATI` from `REQUIRED_RETAIL` **and** its prose line.
   🚨 **Retiring a row that file still advertises THROWS and drops the whole AI/GEO
   document to its 603-byte stub.** That happened in production once already, with
   `PAPIC_ADDON_STORIES` (PR #4357). The hand-written test fixture goes in the same PR.
7. **Tests** — `entitlements.test` · `kwento-is-free.test` · `llms-txt.test` ·
   `papic-mission-cost.test` · `papic-missions.test` · `anonymous-zero-guest.test` ·
   `event-words-mounted.test` · `doors-are-designed.test` · `simulated-guest-preview.test`.

### ⏸ WHY IT WAS HELD, AND WHEN TO START

At the time of writing, PRs **#4708** and **#4710** were open and touching the exact
files this retirement edits — `couple-challenges-manager.tsx`, `papic-missions.ts`,
`editorial/data.ts`, `editorial-content.tsx` — as part of restoring work a stale-branch
merge had deleted (§3). Landing a ~50-file **deletion** into that window is how a
deliberate retirement becomes indistinguishable from the accident being repaired.

✅ **Start when #4708 and #4710 are MERGED.** Verify with
`gh pr view <n> --json state,mergedAt` — not by reading this file.

### ⛔ WHAT THE RETIREMENT MUST NOT TOUCH

- The **Papic shot ladder** (`PAPIC_GUEST_100` · `PAPIC_GUEST` · `PAPIC_GUEST_10K` ·
  `PAPIC_GUEST_20K`) — owner-locked. **Features are free; SHOTS are the product.**
- **`PAPIC_ADDON_THANK_YOU` (₱2,499) stays paid** — owner's explicit ruling the same day.
- The `greeting` category and its 47 clip challenges. They are the replacement.

---

## § 3 · 🔴 STILL OPEN, AND IT IS THE THING HE COMPLAINED ABOUT FIRST

### 3a · NINE PAGES THAT ASK A COUPLE FOR MONEY OPEN WITH NO HEADLINE

This is the actual answer to *"it does not look appealing"*, and it is **not one page**.

`PageMasthead` was reduced on **2026-08-21** to render *the actions and nothing else* —
a screen-reader-only `<h1>` and no visible title, back arrow or (i). That is
**owner-locked and correct for a page you already live in**: the row was costing every
page 36–44px to answer a question the person had already answered by tapping the thing
that brought them there.

🔑 **BUT IT WAS APPLIED TO THE SELLING PAGES TOO, AND A SELLING PAGE IS THE OPPOSITE
CASE.** Somebody on a buy page has *not* decided anything yet. Measured:

```bash
grep -rln "InlineCheckoutDrawer\|BuyButton\|checkout" \
  "apps/web/app/dashboard/[eventId]/studio" --include="*.tsx" | grep "/page.tsx"
```

**Nine in-app pages take money and render no visible headline:** `papic` ·
`custom-qr-guest` · `editorial-pro` · `indoor-blueprint` · `save-the-date` · `patiktok` ·
`setnayan-ai` · `website-pro` · `supplies-marketplace`.

The sell headlines are all still authored, and all invisible — *"Stop guessing who to
hire"* · *"Setnayan-curated supplies, delivered."* · *"Animated Monogram"* ·
*"Broadcast Style Pack"* · *"AI Edited Highlight"*.

**What the owner actually saw on the Setnayan AI page:** no product name, no promise,
no price — straight into a small heading and eight near-identical grey cards, with
**₱2,499 only after scrolling past all of them.** A page asking for ₱2,499 opens by
saying what it is and what it costs.

⚖ **THE BOUNDARY, SO NOBODY REVERSES AN OWNER LOCK BY ACCIDENT.** The fix is **not**
"put the page header back". `PageMasthead` stays exactly as it is for the ~380 pages a
person lives in. What the nine buy pages need is a **hero of their own** — product name,
the one-line promise, and the price, above the fold — because they are marketing
surfaces that happen to live inside the app. The public doorway kit
(`app/_components/marketing/_doorway.tsx`) already solves this exact problem for the
eight public product pages and is the thing to reach for. **RULE 0: port it, do not
draw a new one.**

### 3b · SMALLER, FROM THE SAME PAGE

- The Setnayan AI value grid renders **eight cards in a 3-column grid**, so the last row
  is one card and a hole. It reads as unfinished before it reads as anything else.
- The price sits in a plain sentence at the bottom of a tile, with the CTA beside it.
  Nothing on the page says *what you get for the money* in one line.

---

## § 4 · THE TRAPS THIS STREAM PRODUCED — ASSUME A SIXTH

1. 🪤 **A TEST'S COMMENT-STRIPPER ATE THE CODE IT WAS SEARCHING FOR.**
   `customer-nav-config.ts` contains the line `// hub + /studio/* (mood-board…`. The
   repo's usual stripper removes **block comments first**, so that `/*` opens a comment
   the regex closes hundreds of lines later. **Measured: the file reduced to 18% of
   itself and `studioHubHref(` vanished from it**, so a correct assertion failed against
   correct code. **Strip line comments FIRST.** A stripper that eats the thing you are
   looking for turns every check into a false negative — the one failure that looks like
   a real finding.
2. 🪤 **TWO OF MY OWN MUTATIONS DID NOT LAND AND REPORTED GREEN.** One counted a pattern
   the sabotage never touched; one died on shell escaping. **An unmeasured mutation
   proves nothing in either direction — print the occurrence count before → after.**
3. 🚨 **A GUARD THAT COULD NEVER FIRE, PROTECTING A RULE EVERYBODY BELIEVED IN** — see
   §1b. It searched the wrong file for a word that lives in a different module.
4. 🚨 **ANOTHER SESSION SHIPPED THE SAME FEATURE WHILE I WAS DIAGNOSING IT.** I told the
   owner Pabati cost ₱1,299 and was locked behind a purchase. **True that morning, false
   by the time I said it** — PR #4704 had merged an hour earlier. `git fetch` and read
   the tip before reporting the state of anything.
5. 🔒 **THE MERGE IS NOT THE SHIP, AND THE SYMPTOM IS FOUR FEATURES FROM THE CAUSE.**
   PR #4709 merged and **was not live**: `deploy-prod.yml` applies migrations and only
   then fires the Vercel hook, and `supabase db push` was refusing because three
   migrations **applied in prod** had their files deleted from the repo by a stale-branch
   merge. Every deploy since 14:19Z failed. Full write-up:
   [`WHATS_NEXT_The_Clobber_And_The_Dead_Deploy_2026-08-22.md`](WHATS_NEXT_The_Clobber_And_The_Dead_Deploy_2026-08-22.md).
   **After any merge somebody expects to SEE:**
   ```bash
   curl -s https://www.setnayan.com/api/health
   ```
   and check the version is your merge or later.
6. ⚠ **A CATALOG ROW IN PROD IS NOT WHAT THE MERGED MIGRATION SAYS.** `PABATI` was still
   `is_active = true` in production **after** #4704 merged, because nothing had deployed.
   **Query the object, never the migration.**

---

## § 5 · THE STANDING VOCABULARY, NOW SETTLED IN THE RAIL TOO

**Studio** is the one word for the things you make — signed out, on your own home, and
inside a wedding. *Suite* no longer appears in the sidebar. The services hub is reached
by one row called **All services**, which is deliberately not called Studio: the same
word twice in one rail is two different places in the reader's head.

Related: [[project_setnayan_studio_rail_one_list_three_states]] (addenda 2 and 3 carry
this) · [[project_setnayan_event_hub_rename]] · `DECISION_LOG.md` 2026-08-21.
