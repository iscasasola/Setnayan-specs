# The 96 builds, cross-referenced — 53 of them were overstated

> ## 📌 SECOND CORRECTION PASS — 2026-08-11 · the owner asked again, and was right again
>
> ~20 of the 79 "genuinely open" were re-opened against `origin/main` (not against this
> document). **One is DONE, five are materially smaller than their entry says.** Corrections
> are written into the entries themselves below as well as listed here, so a half-read page
> cannot resurrect a fixed claim.
>
> **DONE — delete it from the list**
> - **#92 · Doorways for six product pages** — **SHIPPED.** Six of the seven product pages are
>   now linked from the shared front-door menu. ⏭ Only the **greeting-video page (`/pabati`)**
>   has no way in — from any public page or the search-engine list. **One page, not six.**
>
> **WRONG — the entry states the opposite of what ships**
> - **#96 · "The app is not translated … there is no translation machinery at all"** —
>   **FALSE.** A translation system ships: English + Tagalog dictionaries of **59 phrases**,
>   wired into **three** dashboard screens, plus a separate marketing-page translator serving
>   a live Taglish site. Finishing Tagalog is **extending what exists**, not building it. The
>   size claim (thousands of hardcoded English lines) is still true.
>
> **OVERSTATED — real, but far smaller**
> - **#6 · "Six 'we couldn't load this' screens built and used nowhere"** — there is **ONE**
>   such component, and it genuinely has **zero** consumers. The count is wrong; the substance
>   is right and cheaper than billed.
> - **#5 · Supplies shop** — the product schema **and** the area-based pricing resolver shipped
>   in **May**; the shop reads a mock list on purpose, with the swap documented in the file. So
>   this is *swap the mock for the query already in the database + a checkout*, and it is
>   **gated on the owner signing supplier agreements**, not on engineering.
> - **#83 · "A two-person gate on the most dangerous actions"** — the gate itself **works and is
>   already in use** on other actions. Left: point it at a large refund, a large free grant and
>   a change of receiving bank account.
> - **#61 · Supplier looks back at their own captures** — the strip that shows them **exists and
>   is mounted**; it only opens on the event day. Left: a door on any other day. *(The original
>   entry said this correctly — repeated here because it keeps being summarised as "not built".)*
>
> **RE-CONFIRMED STILL OPEN** (opened and checked, entries stand): #1 Thank-You Video (sold,
> nothing produces it) · #2 LED backdrop (the design saves as a draft; no file is ever made) ·
> #14 the supplier-agrees step (**the database half shipped and has ZERO app consumers** — screens
> only) · #28 splitting one payment · #82 admin job titles and spending limits · #29 asking key
> people which dates they can make · #41 copying a service card · #52 the emcee's questionnaire ·
> #21 gallery chapters (nothing anywhere stores that a chapter is held back).
>
> ⚠ **~45 of the 79 were NOT re-opened in this pass.** At a 6-in-20 correction rate, expect more.
>
> ---
>
> ## 🔗 WHAT BUNDLES — 2026-08-11 · eight groups, each ONE job not several
>
> Verified against `origin/main`, not inferred from the wording of the entries.
>
> **A · The render-and-hand-over spine — and it CORRECTS two launch blockers.**
> #1 Thank-You Video · #2 LED backdrop file · #35 LED animated previews.
> 🚨 **`render_jobs` already exists, is keyed on SKU with a free-form spec, and its own
> comment names `THANK_YOU_VIDEO` as one of the SKUs it was built for.** Patiktok and
> Auto-Recap both ride it today, and Auto-Recap is a working ≤30s 1080×1920 montage of an
> event's best captures with a music bed, an FFmpeg argv builder, completion emails, a
> couple-facing screen and a public page. **`led_background_renders` also exists — with
> ZERO writers** (a gate with no handle). So #1 is *a second template on a running queue*,
> not "everything that makes the video"; #2 is *the worker + writing to a table that is
> already there*. Both entries below overstate the work.
>
> **B · One pass over the screens — the largest saving on the list.**
> #25 couple daily screens · #63 vendor dashboard · #88 admin console · #26 the 112
> hand-drawn headings · #6 the unused error screen · #27 the 115 duplicated rules.
> **Measured: the 112-entry heading baseline is 76 couple screens, 27 admin, 9 vendor** —
> the exact files each redesign already opens. Done separately, every one of those files is
> opened three times.
>
> **C · Who says yes before a supplier is booked.**
> #14 the supplier-agrees step (**database half shipped, ZERO app consumers**) · decision 17
> merge the two coordinator access paths (ruled: the host approves) · decision 20 retire
> "coordinator proposes, couple confirms" · decision 14 payment-before-lock.
> `vendor_lock_proposals` is what "coordinator proposes" runs on and what the handshake
> replaces — retiring it while building the handshake is one change, not two.
>
> **D · Live Studio — ORDERED, and the order is load-bearing.**
> #123 port the printable camera hand-out → THEN #121 delete the retired broadcast tree ·
> #125 camera-seat dates stored as whole days · owner action: reconnect + rehearse.
> **The old tree holds the retired broadcast room AND the only print sheet AND the camera
> pages; the new control screen has neither.** Deleting first destroys the hand-out.
>
> **E · One database-permission sweep.**
> #103 the 314 stranger-readable tables · #104 four internal summary views · #105 two views
> ignoring the per-row rules. All three rewrite the **same single exposure record**, which
> must be regenerated in the same change — three passes means three regenerations and three
> chances to clobber.
>
> **F · One address pass.**
> #99 the shared name registry · #100 the ~28 in-app links on old supplier addresses · #101
> capitalisation/underscore opening the same page · the unlinked greeting-video page.
> ⛔ #58 (shop rename forwarding) is **moot** — the shop address is now permanent by ruling.
>
> **G · One compliance-document pass.**
> #127 the 88 further record kinds in "download my data" · #131 four outside services missing
> from the public privacy page · decision 4 delete-means-delete · decision 36 an end date on
> face measurements · decision 37 whether the hidden-name rule covers captions. Same two
> documents, same export-coverage guard, same sweep machinery.
>
> **H · One redeploy for the switches.** Per-service detail sheet (ruled yes) · vendors
> listing packages · whichever photo switches the owner picks · bot protection.
> ⚠ **Bot protection has a mandatory ORDER**: key + redeploy FIRST, widget second, enforce
> last. In any other order the photo screens start rejecting real people. Everything else can
> ride the same redeploy.
>
> **⛔ TWO PAIRS THAT MUST NOT BOTH BE BUILT**
> - #86 the automatic bank-inbox matcher **vs** #69 automatic subscription billing — a real
>   payment gateway makes the matcher unnecessary. Decide the gateway first.
> - #58 shop rename forwarding is already answered by the permanent-address ruling.

You asked whether some of the 96 were already done or already integrated. **Yes — a lot of them.**

Every one of the 132 numbered items was checked twice: once by an agent hunting for evidence it already exists, then again by a second agent whose only job was to argue the opposite of whatever the first one concluded. Verdicts moved in both directions.

| | count | what it means |
|---|---|---|
| ✅ **Already built** | **11** | Nothing to do. Do not schedule these. |
| 🔌 **Built, just switched off** | **6** | A setting, not a build. |
| 🔧 **Mostly built, small gap** | **30** | Real work left, but far less than the list implied. |
| 📋 **Not a build at all** | **6** | Paperwork, an errand, or already settled by your own ruling. |
| ⬜ **Genuinely open** | **79** | The real list. |

---

## ✅ The 11 that are already built — do not schedule these

**#4 · Livestream.** The list said it "has never once run". It has. Production records a real YouTube channel connected through our own consent screen on **25 July**, revoked the next morning — and **16 camera passes** were actually issued. The credentials are live in the running app and it pushes from OBS, so there is no missing video vendor either. *Left: reconnect the channel and do one rehearsal. No build.*

**#24 · The wedding-website manager.** The first pass looked one directory away from the answer and reported it missing. The side-by-side board ships: sections on the left set to automatic / shown / hidden, the real guest page live beside it, tabs for save-the-date, RSVP, the day and the keepsake, a phone-or-laptop toggle, and the who-can-open-it choice in the same rail. **Anyone told to build this should be sent to look at it first.**

**#36 · Small playable copies of each video clip.** Made on the phone and saved beside the original, on both the crew and guest paths — the call sites are real, not just the functions. ⚠ **But a warning worth acting on:** when the stricter browser-security policy is switched from watching to enforcing, the video shrinker loads its engine from an outside address that is not on the allowed list. Every small copy would then fail **silently**. That is the same illness as the map that was blocked last night.

**#15 · A wedding date outliving the supplier it came from** — fixed on 8 August. One residue: a supplier-side cancellation doesn't hand the date back and doesn't prompt the couple.

**#45 · The track-record card where couples browse** — couples already see it. Only the per-event-kind split is missing.

**#59 · A supplier changing how many couples may hold the same date** — works today. Only the plan-based ceiling is off, deliberately, because both your test shops are free-tier and would lose their waitlist.

**#78 · A guest opening their own camera by scanning their code** — works. Their code lands them on the wedding site recognised, and the Camera button is right there. **Do not build.**

**#79 · The venue photo wall on the couple's website** — works, including the database call that usually breaks silently. Item 23 is the same claim about the same feed and should be dropped with it.

**#118 · Rigid-group linking in the seat plan** — built, with real writes. Only worth confirming that *creating* a group is deliberately 3D-only.

**#120 · Corner radii** — the checker reports **zero**, and it's a hard gate in CI. Close it.

**#132 · The last unreviewed database function** — the walk from 217 to zero finished, and three more arrivals were reviewed on the way. ⚠ But that same file records a **separate hole nobody has fixed**: a couple can post a message on their own event dressed up as coming from a supplier.

---

## 🔌 The 6 that are built and just switched off

**#40 · Vendors listing packages at all.** One setting, and it really is only one — the database already lets a supplier write their own packages. Set it in hosting **and redeploy**, because it's baked in at build time.

**#12 · The three sign-in buttons.** 🔴 **This one changed from "somebody should check" to a live defect.** I clicked all three against the auth server instead of leaving it as a suggestion: **Apple and Google are properly configured. Facebook returns an error.** A first-time visitor who taps Facebook fails at the very first screen. Either switch Facebook on in the sign-in settings or take the button off the page.

**#10 · Bot protection on signup and sign-in.** Written, and the live sign-in page contains no challenge at all. ⚠ Order matters: set the key and redeploy **first**, then add the widget to the two photo screens, **then** enforce. In the other order those screens start rejecting real people.

**#9 · Rename-forwarding** — inert until one cutover switch is flipped; then the 90-day life, the deeper pages and the shop-side equivalent are real work.

**#19 · Child-safety image matching** — the hook is genuinely wired into the screening path. Two contracts, not code.

**#117 · Offline** — the reading half is finished and verified live. Only replaying actions taken with no signal is off.

---

## 📋 The 6 that are not builds

- **#11 · Stolen-password blocking** — one switch in the database console.
- **#16 · Fifteen privacy filings** — you and counsel; the console to record them exists.
- **#17 · Twelve unsigned data agreements** — signatures; the register exists and the public page already names them.
- **#18 · Money landing in personal accounts** — both rails are switched **on** today, both in your personal name, and the business email on file belongs to your other business. Registrations gate this, not code.
- **#75 · A guest deleting their own photo** — **matches your ruling** ("the host deletes, and that's it"). Don't build it.
- **#89 · Two storage folders and a leftover record** — half already done (the record's table was dropped on 6 August); the rest is one sign-in and a button that already ships.

---

## ⬜ The 79 that are genuinely open

Sizes below are the **revised** ones from the cross-check, not the original guesses.

### Launch blockers — 7 open
- **1. Thank-You Video on sale at ₱2,499 with nothing producing it** *(medium)*
  - Everything that makes the video, plus any way to hand it over. Someone can pay ₱2,499 today and nothing anywhere produces or delivers a thing.
- **2. LED backdrop tool takes a design and never makes the file** *(large)*
  - The file-making step and a way to hand it to the venue — including a place in the database to even track a render, which does not exist yet. The layout editor and its save are done.
- **5. Supplies shop looks real and sells nothing** *(small)*
  - Either wire the shop to real supplier products and a checkout, or hide the tile. Today a couple browses invented products and fills a basket that cannot be paid for.
- **6. Six 'we couldn't load this' screens built and used nowhere** *(medium)*
  - Adopting them screen by screen, so a page that fails to load says so instead of saying 'nothing here yet'. The components themselves are done.
- **7. Fourteen of our own web addresses can be claimed as a shop or wedding name** *(small)*
  - Generate the protected word list from the real route list rather than typing it, and make the couple's rename form run the check it currently skips entirely.
- **8. A retired web address goes straight back in the pool** *(small)*
  - Make the availability check refuse any name that still has a live forwarding row, so a printed invitation cannot land on a stranger's page.
- **14. A booked supplier can be committed without ever being asked** *(medium)*
  - All the screens: the couple's 'ask the supplier' step, the supplier's agree/decline page, the reminder and the 7-day expiry. The rules and the state machine are already in the live database, so this is UI work, not schema work.

### Couple — 14 open
- **20. Preservation storage plan (₱500/yr per 10 GB, 5 GB free, % meter, 1 Jan renewal)** *(medium)*
  - The meter, the account-wide total, the 5 GB free allowance, the ₱500-per-10-GB pricing and the 1 January renewal. Do NOT build a new buy screen or checkout — a working 'keep my full-res' purchase card and payment flow already sits on the couple's photo page and appears the moment the price row is sw
- **21. Choose which chapters of the gallery strangers see** *(medium)*
  - All of it. Chapters are worked out automatically from when each photo was taken; nothing anywhere stores whether a chapter is held back, so there is no switch to build on.
- **22. Phone photo wall ignores the per-wedding setting and can't be turned off** *(small)*
  - Make the phone wall obey the wedding's own setting, and give the couple a switch. Today the only way to hide something is one photo at a time; the wedding-level setting is written on every wedding and read by nothing — not one line of app code and not one database function.
- **23. Live Photo Wall section on the couple's own website can never show anything** *(small)*
  - Either build the screen that picks photos into that band, or delete the band and point that section at the live mirror that already works. The venue projector wall and the day-of mirror are both real — only the hand-picked strip is dead.
- **25. Redesign the couple's daily screens (guest list, compare, budget, gallery)** *(medium)*
  - The four screens already wear the new colours, card style and corners — that landed in one global change. What is left is re-laying them out to the approved row-and-focal grammar, the same treatment the event overview and digests got this week.
- **26. 112 screens hand-draw their own page heading** *(large)*
  - 112 screens to convert onto the shared heading. The guard that stops new ones is already in place, so this only ever gets smaller.
- **27. 115 places write the same rule down twice** *(medium)*
  - 115 duplicates to collapse onto one definition each. Nothing new can be added — only this backlog remains.
- **28. Two people splitting one payment** *(large)*
  - All of it. Nothing anywhere allows more than one person to pay toward the same order.
- **29. Ask key people when they can come, alongside vendor availability** *(medium)*
  - Asking real people — parents, principal sponsors — which of the shortlisted dates they can make, and folding their answers into the comparison the vendor availability already feeds.
- **30. A taste profile that remembers a person across their events** *(medium)*
  - Cuisine, photo style and moods — those still die with the event. Liked vendors already follow the person across their weddings, behind an opt-in privacy switch, on the account Library page. Extend that exact pattern rather than inventing a new one.
- **31. Widen the couple's simulated-guest preview** *(small)*
  - Only the guest states that aren't a phase — someone who declined, and per-guest day-of variations. Not-yet-replied, save-the-date, the day itself and the keepsake page can all be previewed today from the tabs above the preview.
- **34. Finish the reservation layer** *(medium)*
  - There is no screen at all — not for the couple to reserve, not for the venue to accept. The database rules and server helpers are written and cannot be oversold, but nothing calls them and the on/off switch has no reader. Still open too: binding a confirmed booking to the reserved place and time, an
- **35. LED templates preview as a flat colour blend, not the animation** *(small)*
  - Real looping previews per template. The tiles do at least show the couple's own colours, but not what the finished animation looks like. The placeholder is explicitly labelled in the code.
- **38. Owned music catalogue is 31 tracks against a plan of 400** *(medium)*
  - About 369 more tracks to generate and load, plus the licence paperwork on file. The table and the delivery path already work — this is asset production, not engineering.

### Vendor — 20 open
- **41. Copy one of their own service cards to make another** *(medium)*
  - All of it. A supplier with three near-identical packages retypes every field three times.
- **43. Show couples what other couples picked on a service card** *(medium)*
  - The counting itself. The rule that stops a thin sample identifying a real couple is already written and enforced in the database — reuse it, do not rebuild it.
- **47. Financial and Secretary team roles, plus notify staff on assignment** *(medium)*
  - Both halves. Two new roles with their own permission shape, and a message to the staff member when work is put on them — right now they are assigned in silence and only find out by opening the app.
- **48. Suggestions inbox drafting changes from the vendor's own bookings** *(large)*
  - The inbox itself — reading a supplier's own closed bookings, writing a plain sentence like 'your last six weddings closed higher than your listed price', and a Confirm button that actually changes the listing. The pricing, demand and benchmark maths already exist; extend those.
- **50. Photographer's bulk hand-over of 1,000–3,000 photos** *(large)*
  - The bulk upload. Today a photographer pastes a link to their own gallery and attaches one small proof image. If their link dies, the couple has nothing.
- **51. A supplier writes a piece for the couple's keepsake paper** *(medium)*
  - All of it for a business — every entry must be pinned to a guest record and a business has none. Needs a second author kind plus a 'from the team' byline. Note the guest version is itself still switched off.
- **52. A questionnaire the emcee owns** *(medium)*
  - All of it. The app already knows he must ask — it deliberately leaves the sponsor blanks in his script — and gives him no way to ask or to store the answers. Copy the song/activity request pattern into a form he owns and the couple fills in.
- **53. Coordinator's request inbox opens out of the fullscreen console** *(small)*
  - Mount the existing inbox component inside the console instead of linking away. This is a placement fix, not a new screen.
- **54. Only the coordinator may advance the run-of-show** *(small)*
  - Tighten the rule in the database to match the rule on the screen. The button is hidden from other suppliers but the permission underneath is open to anyone booked on the wedding.
- **57. Extend prepare-then-release to checklists and tasks** *(medium)*
  - The same two fields and the same release button on checklists and tasks, plus a small badge saying how many items are still held back. The schedule version is already working in production — copy its shape.
- **58. Rename forwarding for shop addresses** *(small)*
  - All of it. If a business changes its web address, every printed card, saved link and search result pointing at the old one dies immediately. Couples' addresses at least get 90 days; shops get zero.
- **60. Mark a business as a founding supplier** *(small)*
  - One admin button that marks a shop as a founding supplier. The perk it unlocks already works and there is already an almost identical grant screen (founder seats) to copy the shape from — it just points at the wrong record.
- **61. Supplier looks back at their own captures the morning after** *(small)*
  - A door a supplier can open on any day to see the photos they took. The permission, the reading code and the clip-length formatting all exist behind a door that only opens on the event date.
- **63. Redesign the vendor dashboard** *(medium)*
  - The layout/structure work, not the colours — the new look already reached these screens through one global change. Reconcile the July drawing to the locked colours before porting, or it will drag the retired palette back in.
- **64. Wire the referral part of the vendor activity score** *(medium)*
  - Record the credit. The vendor's own invite QR already brings couples in — nothing stamps 'this couple came from that supplier', so a tenth of every activity score is stuck at zero.
- **65. Three small annoyances (coverage save, clip length, orphan helper)** *(small)*
  - Only the coverage one: after saving which events a service covers, keep that service's row open instead of collapsing it. The clip length is already done, and the caller-less helper is the free-tier booking cap already tracked as item 62.
- **66. Per-product listings** *(large)*
  - The authoring screen, the attributes, and the search that filters on them. Half the record already exists in the database from the 2026-05 supplies work — nobody has ever written a row to it.
- **68. Market Scan (wider-market version of Deep Search)** *(medium)*
  - The wider-market web scan itself. But two market-intelligence screens already exist for suppliers, and the research engine plus the pay-per-use billing shape are already built for the single-business version — so this is an extension, not a blank page.
- **69. Automatic billing when a subscription period ends** *(large)*
  - Everything that takes money by itself. Realistically blocked on a live payment gateway — today every peso is paid by hand and matched by an admin.
- **70. Nudges for stale conversations and lapsed couples** *(small)*
  - Less than the report implies. 'Nobody answered in 48 hours' already runs for both sides. Missing: a nudge when a conversation that WAS running goes quiet, and anything aimed at a couple whose event has passed.

### Guest — 4 open
- **71. Guests make their own little 3D character** *(large)*
  - The maker screen and the save. The character parts, the safety whitelist and the fallback all exist; nothing lets a guest choose, and no choice has ever been stored.
- **72. Guests can review a vendor** *(medium)*
  - A way for a guest to leave one at all, plus the rule for who qualifies. Today nothing ties a review to anyone but the couple who booked.
- **73. A guest's own photo download stops silently at 500** *(small)*
  - Either page through everything, or at minimum tell the guest the ZIP is partial and how to get the rest. Right now a clipped download looks identical to a complete one.
- **74. Guests who paid for their own shots are never warned before compression** *(small)*
  - A warning addressed to the guest who paid, and your call on whether their originals should be timed from THEIR purchase instead of the couple's event.

### Admin — 9 open
- **80. Two admin screens rank the same job queues in opposite orders** *(small)*
  - Make the two admin screens agree on what to put first. The overview puts the biggest pile first; the work list puts the most overdue first. Pick one rule and use it on both.
- **81. Adding an event type can silently switch off that event's public website** *(small)*
  - Stop the admin form from saving an event type with the day-of page or gallery on while the website is off — either tick the website on automatically, or refuse the save and say why.
- **82. Separate jobs and spending limits for admins** *(medium)*
  - Everything on the Setnayan side. Anyone with an admin login can approve any payment of any size, verify any supplier and settle any dispute. There are no job titles and no ceilings. A working example of both already exists for supplier teams.
- **83. A two-person gate on the most dangerous actions** *(medium)*
  - Wire the second-signature step that already works onto three actions: a large refund, a large free grant, and changing the bank or e-wallet account money arrives into. The last one also wants a small test deposit and a waiting period.
- **84. An ads screen showing real Facebook/Instagram spend and results** *(medium)*
  - All of it — nothing reads ad-account data. It also still carries an unmade decision: whether the console creates campaigns or only reports on them.
- **85. The internal system map is missing 29 real parts of the product** *(medium)*
  - 26 real parts of the product still have no home on the internal map — short video, per-event supplier access, bookings, message contents, discount codes, booking fees, monograms, mood boards, budgets, photo delivery and the service catalogue among them.
- **86. The four-tier automatic bank-inbox matcher does not exist** *(medium)*
  - The automatic half. An admin pastes a bank alert into a box today and the likely row is highlighted by three ranked rules — a person still decides every time, and nothing keeps a record of the alerts. May become unnecessary if a payment gateway lands.
- **87. The assisted planner's free-trial abuse checks are half-written** *(small)*
  - Only a repeated phone number is checked at trial start. Same card, same wedding date, same venue, same device all pass. The same-person grouping the check would need is already built and switched off pending the privacy sign-off, so much of this is connecting two things we own.
- **88. Redesign the internal console (~107 screens)** *(large)*
  - All 108 admin screens still wear their own hand-made layout. The look has already been drawn and approved — what is missing is the one shared shape and the pass that puts every screen inside it.

### Public site — 10 open
- **92. Doorways for six product pages (launch blocker 13)** *(small)*
  - All six still have no way in — none is linked from any public page, and the memories index is missing from the search-engine list too. Because there is one shared footer on every marketing page, this is a handful of lines in a single file.
- **93. Recommendation pages and affiliate links** *(medium)*
  - The whole recommendations side: the public category pages, the disclosed affiliate links, and the click and conversion tracking. The blog half already ships and is now linked.
- **94. Public bridal-fair pages** *(medium)*
  - Both halves, not just the visitor pages — I found no management side or pricing in code or in the database either, only in specs. Its own launch gate is 500 verified suppliers and we have 2, so this is a deliberate deferral.
- **95. Public supplies browse pages** *(large)*
  - All of it — there is no public page where a visitor can browse supplies. Roadmap work, not launch work.
- **96. The app is not translated** *(large)*
  - Everything beyond three marketing pages. There is no translation machinery at all, so finishing Tagalog means building that first and then pulling thousands of hardcoded English lines out of the screens; Cebuano sits on top of that.
- **97. Design the sign-in, sign-up and invite screens** *(small)*
  - A drawn design for sign-in, sign-up, password reset, claim and join. They work today and already share one card, so the drawing lands in one place.
- **98. Design the four other undesigned surfaces** *(large)*
  - Four surfaces still need drawing: browsing suppliers, the public photo pages, the guided tour, and the onboarding questions themselves — the wizard frame exists, the questions, their order and the reveal do not.
- **99. One shared name registry across weddings, shops and people** *(medium)*
  - One list all three name types check before a name is taken. A wedding, a shop and a person can each claim the same word today. The shared-list module already exists for reserved words, so the wiring point is known — and with seven names in use it is nearly free now.
- **100. The old supplier addresses still work and ~28 in-app links point at them** *(small)*
  - Point the 30 in-app links at the short shop address and make the supplier's website tab show the same address as their shop tab. Keep the old address working — it already tells search engines the short one is the real page, and sub-pages hang off it.
- **101. Loose address matching — punctuation and letter case both resolve** *(small)*
  - Make one address the real one and send the others to it. Any capitalisation opens a wedding page, and swapping the dash for an underscore opens it too, so search engines see several copies — and unlike the shop pages, the wedding pages say nothing about which copy is real.

### Behind the scenes — 11 open
- **103. Half the database hands anonymous visitors a read key nothing needs** *(large)*
  - All of it. 314 of 396 tables and views still hand a stranger a read key, up from the 310-of-383 the report quoted. Narrow them a few at a time.
- **104. Four internal summary views are readable by anyone** *(small)*
  - All four. A stranger can still read a supplier's review statistics and the gap between their full and public completed-job counts. Four REVOKE statements.
- **105. Two database views ignore the per-row rules entirely** *(small)*
  - Two that matter, plus one to tidy. vendor_completed_events (stranger-readable) and events_host (any signed-in user) both run with the owner's permissions. user_identity_signals is the same shape but nobody has been granted it, so fix it while you are in there rather than as a risk.
- **108. Every picture from our storage gets a fresh address each time** *(small)*
  - Real but narrow. On the presigned lanes the web address is regenerated per render, so the image service re-processes and we pay again. The fixed-address helper already exists in the same codebase; point the safe buckets at it. Cheap now, grows with real galleries.
- **113. Delete a dead short-video worker that fakes a finished render** *(small)*
  - Nothing has changed. Delete the file and its registry line.
- **115. Text-message notifications** *(medium)*
  - Nothing is built and nothing is meant to be — this is a deliberate scope decision for this version. Do not schedule it unless you are reversing that decision.
- **119. Upgrade the crash-reporting library** *(small)*
  - All of it, but the target is different from the note: we are on version 8, so this is an 8→9→10 move. Settle the real jump before scheduling.
- **121. Delete the retired livestream code** *(small)*
  - The old broadcast room is already bypassed in production, so this is safer than the note implies — but the neighbouring camera pages and the only printable hand-out sheet still live in that tree and are still reachable. Build item 123 first, run one real broadcast, then delete.
- **122. Nobody is told when cameras are silently dropped for exceeding the channel limit** *(small)*
  - All of it. The code knows exactly how many cameras it refused and discards the number. Surfacing it is a small change at one call site.
- **123. There is no printable camera hand-out sheet on the current control screen** *(medium)*
  - All of it, and it blocks item 121. On the screen hosts actually reach today, codes can only be read off a laptop one at a time. Port the old print sheet across before anything is deleted.
- **125. The camera-seat validity dates are stored as whole days** *(small)*
  - All of it. The urgent bug is fixed, but every save still throws away the hour and minute. Change the column type and the one place that writes it, and test under Manila time — under our servers' clock it looks correct.

### Compliance — 4 open
- **127. More than ninety kinds of record are missing from "download my data"** *(large)*
  - The download button and its safety net genuinely work — 19 kinds of record come out today, and a build-blocking check makes sure no new kind can be added silently. What is missing is 88 more kinds, all already written down by name, so nothing needs designing. Most are plainly the person's own (their
- **128. Managing another person's account is NOT built** *(medium)*
  - Half of this already exists and should not be rebuilt: a guardian can hold a child's or an elder's record, choose what is shared, and hand it over with a one-time link that refuses to be created until the birthday proves eighteen. Nobody has used it yet — there are no such records in the live system
- **130. The guest who buys shots without an account is still not a listed data subject** *(small)*
  - Paste one already-written paragraph into the records document and stop calling that flow undeclared. The person it concerns is a wedding guest with no Setnayan account who pays for extra shots: we take the name they type, a link that acts as their key, and a screenshot of their bank or GCash confirm
- **131. Three services that genuinely run may not be named on the public privacy page** *(small)*
  - Add four outside services to the list on your public privacy page, not three. The certain one nobody had spotted: whenever a couple first saves the written story on their event page, that text is sent to a European spell-and-grammar service — no switch, no key, it just happens, and we never named th
---

## 🔧 The 30 "mostly built" — read before scheduling any of them

These are on nobody's do-not-build list, but the remaining work is much smaller than the original entry implied. The one-line "what's actually left" is in the entry for each; the pattern is almost always **the mechanism ships and the last mile doesn't**: a doorway, a switch with no screen, a preview, a permission, or a piece of copy.

Numbers: 3, 13, 32, 33, 37, 39, 42, 44, 46, 49, 55, 56, 62, 67, 76, 77, 90, 91, 102, 106, 107, 109, 110, 111, 112, 114, 116, 124, 126, 129.

---

## How this was checked

Two passes per item. The first hunted for evidence the thing already exists — searching under different words than this list uses, because the list speaks plain English and the code does not. The second argued the opposite of every verdict the first reached, including re-testing "already built" claims for the classic trap where a screen exists but nothing ever writes to it.

Verdicts moved **both** ways. #12 got worse (a sign-in button that actually fails). #24, #59 and several others got better once someone looked in the right place.

Evidence is a live database result, an HTTP response body, or a named file and line — never a document and never a comment.
