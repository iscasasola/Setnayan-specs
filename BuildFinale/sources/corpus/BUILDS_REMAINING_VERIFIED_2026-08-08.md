# What's left to build — the full enumeration

**About 150 open items.** 96 things to build · 38 decisions only you can make · 14 blocked on someone outside the company. **19 of them can hurt a real customer on day one.** A further 34 items that earlier notes listed as outstanding are **already finished** and are listed at the bottom so nobody rebuilds them.

Six separate passes over the live site, the shipped code and the production database produced this. Where two passes disagreed I checked myself and say which one won.

---

## ⛔ FIRST — the 19 that hurt someone on day one

Nothing else on this page matters as much as these.

**Money taken for something that doesn't exist**
1. **Thank-You Video is on sale at ₱2,499 and nothing produces it.** It's on the live price page marked *Live*, a couple can buy it, and there is no screen, no maker and no render step anywhere. If someone pays on day one, nothing ever arrives. *(build · medium)*
2. **The LED backdrop tool takes a design and never makes the file.** A couple lays out their reception screen, presses save, and is told the render "ships later" and they'll be emailed. They cannot hand anything to the venue — and the animated monogram product, which is live at ₱1,000, advertises this as included. *(build · large)*
3. **Custom web address sold at ₱999 a year cannot be set up.** The app knows how to serve it and only serves it to someone who paid — but no made-up name under our domain resolves at all, so the address goes nowhere. Registrar work plus a certificate, not code. *(mostly an errand · small)*
4. **Livestream is on sale at ₱2,999 and has never once run.** Far more is built than our own notes claim — it really does create the broadcast, hand out camera passes and switch on-screen styles. But production has zero channels, zero broadcasts, zero streams. Somebody must create the channel and run one full rehearsal wedding before a paying couple does it for us. *(errand + rehearsal · medium)*
5. **The supplies shop looks like a real shop and sells nothing.** Every product is invented placeholder data, no supplier has listed anything, and the basket has no checkout — it dumps people onto a generic order page. Cheapest honest fix is to hide it. *(build or hide · small to hide)*

**Someone gets locked out or misled**
6. **Six "we couldn't load this" screens were finished and put on no screen.** I checked this myself — the shared set has **zero users anywhere in the app**. So a page that fails to load someone's information still says "nothing here yet". A guest saw an invitation that looked abandoned; a couple saw "no requests yet" over three real pending requests. *(build · medium — one pass claimed these were adopted by 14 screens; it was wrong, those screens each hand-roll their own)*
7. **Fourteen of our own web addresses can be claimed as somebody's shop or wedding name** — including two that are live and in our sitemap. A shop taking one is handed our own marketing page as its address. The couple's rename form checks nothing at all. *(build · small — generate the protected list from the real page list, never type it)*
8. **A retired web address goes straight back in the pool.** A guest holding a printed invitation lands on a stranger's page. One such name is free right now. *(build · small)*
9. **Rename-forwarding expires at 90 days, only covers the front page, and has never once run.** Save-the-dates go out 6–12 months ahead. Shops have no forwarding at all. *(build · medium)*
10. **Nothing stops an automated script creating accounts or hammering sign-in.** The protection is fully written and off. Two photo-service screens would break the day you switch it on, because they accept the check but never show it. Order matters: set the key and redeploy first, then enforce. *(errand + small build)*
11. **People can sign up with a password already known to be stolen.** One switch in the database console. *(errand · small)*
12. **Somebody should click all three sign-in buttons once.** The live sign-in page offers Google, Apple and Facebook — all three are switched on. Whether the providers behind Apple and Facebook are configured on our side is unchecked. If not, a first-time visitor gets an error at the very first screen. *(5 minutes)*
13. **Six product pages have no doorway.** The 3D walk, the animated monogram, the wedding website, the short reels, the livestream and the memories index all load fine and almost nothing links to them. Only the photo page is reachable from the homepage. *(build · small)*
14. **A booked supplier can be committed without ever being asked.** When a couple picks a supplier the booking just happens — the supplier is never asked to agree or decline. The seven-day handshake is entirely unbuilt, and the plan has a hole: the supplier can't even open the page the agree button would sit on. *(build · large)*
15. **A wedding date can outlive the supplier it came from.** Locking a supplier can set the couple's date for them; drop that supplier and the date stays forever, because nothing will overwrite a date once set. *(build · medium)*

**Legal and paperwork**
16. **All fifteen privacy-regulator filing tasks are untouched; six are marked blocking.** Including a public privacy statement that says we don't collect face data when we do, an undeclared anti-fraud process that went live in July, and signing the governance documents — nothing in the set is currently signed. *(owner + counsel · large)*
17. **Not one data agreement is signed with any of the twelve outside companies handling our users' data.** The list is correct and current; the signatures are missing. *(paperwork · medium)*
18. **The money arrives into personal accounts.** Bank and e-wallet details are live and payment codes generate from them, but both accounts are in your personal name and the business email on file belongs to your other business. Customers can pay today; the receipts won't read as Setnayan. Mayor's permit and the tax trade-name amendment sit behind this. *(errand · small, but gates the bank account)*
19. **Child-safety image matching is merged and inert.** The nudity filter is live and can't be disabled; matching against known illegal images needs enrolling with a provider and signing a regulator agreement. Both are contracts, not code. *(outside blocker · medium)*

---

## 👰 What a COUPLE still can't do

### Build

| # | What | Size |
|---|---|---|
| 20 | Buy the preservation storage plan you locked on 8 Aug — ₱500/year per 10 GB held, 5 GB always free, renewing 1 January, shown as a percentage-full meter. Only the arithmetic exists. No meter, no per-account total, no price on the plan, no renewal date. Until it ships, connecting Google Drive is the only way to keep full-resolution originals. | large |
| 21 | Choose which chapters of the gallery strangers see. Today it's one photo at a time. You ruled a held-back chapter must not appear at all — not greyed out with a teaser. | medium |
| 22 | The photo wall guests see on their phones ignores the setting every wedding is recorded as having, and can't be turned off. | medium |
| 23 | The Live Photo Wall section on the couple's own website can never show anything — no screen picks the photos for it. (The projector wall at the venue works and is finished.) | small |
| 24 | A wedding-website manager that mirrors what a guest sees, section by section, each set to automatic / always-shown / hidden, with the privacy switches in one place. Much exists; the mirror board doesn't. | large |
| 25 | Redesign the couple's daily screens — guest list, comparing suppliers, budget breakdown, gallery. Two units shipped this week; roughly forty remain. | large |
| 26 | 112 screens hand-draw their own page heading instead of using the shared one. Invisible to a person; it's the groundwork that stops the next silent style drift, which once spread a wrong look to eighty pages at once. | large |
| 27 | 115 places write the same rule down twice — 94 of them a hand-typed column list that leaves something out. The read still succeeds and the screen is silently wrong. This exact pattern once made a mandatory line item vanish from a package. | medium |
| 28 | Two people splitting one payment — a couple and a parent each covering part. | large |
| 29 | Ask the key people when they can come, alongside vendor availability, before setting a date. The vendor half already ships as a page. | medium |
| 30 | A taste profile that remembers a person across their events — cuisine, photo style, moods, liked vendors. Opt-in, deletable item by item. | medium |
| 31 | Widen the couple's simulated-guest preview. They *can* already preview as a real invited guest — that's built. The editor's fake-guest tab only covers "already replied", and widening it touches a security-reviewed gate. | medium |
| 32 | Guided walkthroughs exist on four screens, not the eleven planned. Each one is hand-authored. | medium |
| 33 | Finish the 3D venue: heritage is one look where you ruled two; chapel and rooftop are fully drawn and no couple can pick them; 250 guests without slowing down; repricing. | large |
| 34 | Finish the reservation layer — the venue accepting a reservation back, and binding a booking to a reserved place and time. Half exists and can't be oversold. ⚠ Its whole original value case rested on vendors spending tokens, which are retired — re-derive why it's worth building. | large |
| 35 | Show which templates the LED tool will actually produce — each option previews as a flat colour blend, not the animation you get. | small |
| 36 | ~~The short-video pipeline's small playable copies of each clip.~~ ✅ **ALREADY DONE — corrected 2026-08-24.** This row was wrong on the day it was written: the resolution of the kept clip copy was being argued the day BEFORE (DECISION_LOG 2026-08-07, 480p → 720p), which is only possible if the copy already existed. Verified on `origin/main` by the WRITER, not by a note — **both** capture paths persist it (the guest camera route and the seat/paparazzi action), and the full-res sweep REFUSES to drop a clip that has no web copy. The phone makes the small copy and uploads it finished, so we pay ₱0 of compute. 🔑 **The premise is dead too**: a 10s kept clip measures 0.47 MB — smaller than one phone photo — so long clips never did land a storage burden on the photo packs. ⚠ **One thing NOT verified**: whether clips captured before the pipeline existed were backfilled. Prod holds ~14 Papic captures, so it is small either way. | large |
| 37 | The souvenir-video template library is thin, and it was planned around rendering technology the app no longer uses — videos are now made in the guest's browser. Define the asset list against the current path first. | large |
| 38 | The owned music catalogue is 31 tracks against a plan of 400, and the licence paperwork isn't on file. | medium |

### Decisions only you can make

- **Storage plan: pro-rating and non-renewal.** Someone buying in November pays the same ₱500 as someone buying in January. And if a couple stops paying — nothing is deleted, but does the full-resolution copy shrink early, and how much warning?
- **What "delete a photo" should mean.** Today it hides it everywhere but the file survives to the six-month sweep. Genuine erasure is the alternative, and it would be the one exception to your "compress, never delete" rule.
- **The in-event bottom bar.** The new redesign draws a fixed five-tab strip. What ships is six menus that change with the phase of the wedding, retunable without code. Adopting the drawing reverses a decision you locked twice.
- **Contracts.** Advertised as a premium couple feature with no price anywhere and nothing purchasable. It appears to be simply free now — so the wording may be what needs fixing, not the price.
- **The concierge upgrade** exists switched off since May. Turn it on, or write one line saying why it's deferred so it stops resurfacing.
- **Six competitor-response questions** from the study of the closest Philippine competitor: white-label, where the seat-finder belongs, un-hiding the live photo wall, a photo game, how to package the event day.
- **Whether the assisted planner should charge at all** (its paywall is off) and whether the promotional free windows should run.
- **Whether a booking should require a payment before it locks.**

---

## 🏪 What a VENDOR still can't do

### Build

| # | What | Size |
|---|---|---|
| 39 | Agree or decline a booking — see launch blocker 14. | large |
| 40 | List packages at all. Production holds zero. The whole authoring screen exists behind one off switch. | small to flip |
| 41 | Copy one of their own service cards to make another. They retype everything today. | medium |
| 42 | Say which venue kinds and headcounts they serve — ⚠ **mostly already built.** The screen ships and works. What's genuinely missing is one field (venue kind on the profile) and the fact that **nobody has filled any of it in**, so the marketplace can still look empty. | small |
| 43 | Show couples what other couples actually picked on their card — each booking's choices are stored as one blob, so the question can't be asked. Needs a minimum-count floor so a thin sample can't identify anyone. | medium |
| 44 | Two more honest badges: typical first-reply time and how many events they have photos from. The reply data already exists and is measured; the badges don't. | medium |
| 45 | Put the track-record card where couples browse. It exists on the vendor's own page only. | small |
| 46 | Feature a real wedding on their shop page, with the couple's per-wedding permission — two separate tick boxes, both off by default, one for names and details, one for photos. The photo half is additionally a privacy call: guests never agreed to appear in a business's marketing. | large |
| 47 | Add Financial and Secretary to a vendor's team roles, and notify staff when a job is assigned to them. Four roles exist today. | medium |
| 48 | A suggestions inbox that reads a vendor's own past bookings and drafts things like "your last six weddings closed higher than your listed price", with the vendor pressing Confirm before anything changes. Eight groups of helpers hang off it. ⚠ The pricing, demand and benchmark modules underneath already ship — extend, don't rebuild. | large |
| 49 | Photo credits for booked suppliers, proportional to what they paid, with two ways to buy more. None of it exists. The guest-side equivalent does ship. | large |
| 50 | The photographer's bulk hand-over — uploading 1,000–3,000 viewing-size photos into Setnayan so the couple still has their wedding if the photographer's own link dies. The link half works today. | large |
| 51 | Let a supplier write a piece for the couple's keepsake paper, bylined as team rather than guest. Impossible today — every entry must attach to a guest record and a business has none. | medium |
| 52 | Give the emcee a questionnaire he owns — he must announce ~30 principal sponsors by full name and cannot see the guest list. Copy the pattern already used twice for songs and activities. | medium |
| 53 | The coordinator's request inbox opens the coordinator out of the fullscreen night console onto a different page. | small |
| 54 | Stop *every* booked supplier being able to advance the run-of-show. Only the screen hides the button; the permission underneath is open to caterers, florists, everyone. You ruled only the coordinator holds it. | small |
| 55 | Let a supplier send the coordinator an actual sentence, not six canned statuses. Also: the emcee isn't offered as a recipient when booked inside a bundle — the name is simply absent, no error. | medium |
| 56 | Add the four one-tap coordinator presets (hold the program / medical pause / skip next / wrap up) and the corner "1 notice, tap to read" marker. ⚠ **The channel itself is BUILT and working** — I confirmed eight files use it. Only the presentation is missing. | small |
| 57 | Extend prepare-then-release to checklists and tasks, plus a badge for what's still held back. Schedule-only today, and it's **live**, not dark. | medium |
| 58 | Rename forwarding for shop addresses — there is none at all. | small |
| 59 | Let a supplier raise or lower how many couples may hold the same date. Permanently stuck at three with no screen. | small |
| 60 | Mark a business as a founding supplier. The unlimited-categories perk is coded and working and nobody can ever receive it. | small |
| 61 | Let a supplier look back at their own captures the morning after — the view closes at midnight. *(unverified — I couldn't isolate the guard)* | small |
| 62 | Show a free vendor "you're fully booked — upgrade to take more" instead of a raw error. The limit is built and off; switching it on today gives an unexplained error at the moment of locking. | small |
| 63 | Redesign the vendor dashboard. Suppliers pay to stay, so this is the surface that decides renewals. Its old drawings still use the retired colours and must be reconciled first. | large |
| 64 | Wire the referral part of the vendor activity score — permanently zero today. | medium |
| 65 | Three small annoyances: saving which events a service covers throws them out of editing; a video clip shows "clip" instead of its length; a helper with no callers. *(unverified)* | small |
| 66 | Per-product listings — a couple can search for "a coffee cart" but not one with oat milk. Specced, never built. | large |
| 67 | Paid promotion — a boost and clearly-labelled featured slots. ⚠ The old version was **retired**, and its replacement mechanism (vendor tokens) is also retired, so this needs a fresh mechanism decision before it's a build. | medium |
| 68 | Market Scan — the wider-market version of Deep Search. Genuinely new, needs its own price, privacy control and a legal look. | medium |
| 69 | Nothing bills a vendor automatically when a period ends. Reminders go out; the vendor pays again by hand or somebody chases. | large |
| 70 | Nudges for stale conversations and lapsed couples — the only part of the auto-reply assistant I could find no trace of. ⚠ Everything else in that assistant already ships and is approved in production; its own status table is badly stale. | medium |

### Decisions only you can make

- **The booking fee.** You ruled it on. It has never charged anyone — and there are **two** switches, so flipping only one charges nobody. Two money questions still block it: does a vendor get money back if the couple walks away, and does the published fee include tax or add it on top. And the tax paperwork shape — one receipt per charge or a monthly summary — needs your accountant.
- **Merge the two overlapping ways a coordinator gets access.** A coordinator can end up holding both, or the wrong one. Nothing can be built until you pick the target shape.
- **Whether a coordinator may recommend vendors to guests**, and labelling where such an inquiry came from. The coordinator earns nothing from it. The labelling machinery already ships.
- **Whether to switch on the coordinator consent screen** before they see the guest list.
- **Whether to retire the "coordinator proposes, couple confirms" alternative** rather than flip it — later notes expect it to stay off permanently.
- **Whether to switch on the per-service detail sheet.** Finished on both the browsing and enquiry sides. Tapping a service card currently opens nothing.
- **Whether to lock specialist day-of tools behind a paid plan.** Free to everyone today; switching it on takes tooling away from vendors who have it during a free launch.
- **Whether reviews are ever ranked by what a vendor pays.** The shop page says reviews unlock on upgrade; you locked "never tiered". Zero reviews exist, so it's free to fix now and expensive after the first one.
- **Whether every booked supplier may read the couple's song picks.** The couple-sees-their-own half shipped; this mirror half was never asked.
- **Whether couples ever see a vendor's typical booking price**, and after how many real bookings.
- **Whether to quietly hold back a suspected sabotage flood of fake inquiries.** Detection is built and raises a flag for a human; silent withholding was deliberately never built and is the riskiest call — being wrong hides a real couple.
- **Whether to hold a stranger's email before they finish signing up.** Today an abandoned enquiry vanishes and the supplier never learns anyone was interested.
- **Which paid features lose their free ride** when the tier gates go on — market intelligence, saving favourites. ⚠ One of these must never be switched on: search placement by tier buries free vendors and contradicts merit-first ranking.
- **Which features the launch free-window applies to.** The mechanism exists and points at nothing.
- **A yearly "all tools" bundle** has a database table and not one line of code. It looks abandoned rather than pending — confirm it's dead.
- **Whether identity verification and sanctions screening happen at all** — no account exists with either provider, and screening carries a real annual cost.
- **Two questions left inside delivered venue work:** which supplier kinds get asked for room dimensions, and what to do about an L-shaped room.

---

## 🎉 What a GUEST still can't do

**Build**

71. **Make their own little 3D character.** Everyone in the venue is a randomly-coloured stranger, so nobody recognises themselves — which is most of the reason to walk the room. The parts were finished weeks ago and nothing writes to them. Two hard rules survive: body type is cosmetic and never joins the account's recorded sex; and customising your look and being *visible* to others are separate consents, visibility off by default. *(large)*
72. **Guests can't review a vendor at all** — only the couple who booked. By design in this version, still missing. *(medium)*
73. **A guest's own photo download stops silently at 500 items.** On the one occasion it matters — saving originals before compression — it hands back part of the wedding. *(small)*
74. **Guests who paid for their own shots are never warned before compression**, and their clock is the couple's clock, not their own. *(small)*
75. **Delete a photo they took themselves.** ⚠ **Ask before building** — two records from the same day contradict each other: one quotes you allowing self-delete, the other quotes you saying the host deletes and that's it. *(small)*
76. **Request a song from their phone.** The whole data layer ships across four changes; only the button guests would tap doesn't. *(medium)*
77. **Empty-state words for the guest wedding site** — what a guest sees when a section is empty or the wedding has passed. Wants one read-through from you, not piecemeal. *(medium)*
78. **A guest opening their own camera by scanning their personal code** — may already be closed by another route; check first. *(medium)*
79. **The venue photo wall on the couple's own website** — see item 23.

**Decisions**

- **Can guests pick day-of activities, or only the couple?** You asked three times for "activities which guests can pick"; everything built assumes the couple picks. Building either reading on a guess wastes the work.
- **Four photo-service switches are built and dark:** the shared gallery where any guest browses and links themselves to their own shots (needs three things on at once), the shots-remaining meter for the host, photo missions and challenges, and the buttons letting a guest buy more shots without an account.
- **Letting a camera helper start shooting without signing in.** Built and off. You set this once, redeployed, and the wall stayed up because the value's spelling wasn't recognised — that one now accepts any sensible spelling.

---

## 🛠 What the ADMIN / your team still can't do

**Build**

80. **Two admin screens rank the same job queues in opposite orders**, so the same person reading both is told two different things are most urgent. *(small)*
81. **Adding a new event type can silently switch off that event's public website.** Nothing stops someone saving with the day-of page and gallery on but the website off — both of which render *on* the website. Dead public page. *(small)*
82. **Separate jobs and spending limits for admins.** Everyone with an admin login can approve payments, approve suppliers, settle disputes, with no cap on how much money they can approve. Parked by you in July — confirm you still want it. *(medium)*
83. **A two-person gate on the most dangerous actions** — a large refund, a big free grant, changing the bank account we receive money into (that one also wants a test deposit and a delay). The approval mechanism already exists and is in live use; this is wiring it on. **Rises sharply in priority the moment a payment gateway is live.** *(medium)*
84. **An ads screen showing real Facebook/Instagram spend and results.** Deliberately not built — it needs ad-account access first, and there's an unmade choice about whether the console creates campaigns or only reports. *(medium)*
85. **The internal system map is missing 29 real parts of the product** — short video, per-event vendor access, bookings, message bodies, discount codes, booking fees, monograms, mood boards, budgets, photo delivery, the service catalogue. Nobody outside the team sees it. *(medium)*
86. **The four-tier automatic bank-inbox matcher described in our plans does not exist.** What ships is an admin pasting an alert into a box that highlights the likely row. May become unnecessary if a payment gateway lands. *(large)*
87. **The assisted planner's free-trial abuse checks are half-written** — only a matching phone number is checked. *(small)*
88. **Redesign the internal console** — roughly 107 screens that mostly collapse into one repeated shape. Genuinely last, but it's the one place where a single piece of work fixes almost a hundred screens. *(large)*
89. **Delete one leftover marketing-settings record** and clear two retired video folders in storage (the biggest reclaimable space; the one-press clear button already covers exactly those two). *(small)*

**Decisions**

- **Should a payment reference be required** on the four forms where someone pays Setnayan? Cash only ever flows couple→vendor, a different form we don't reconcile — so the main objection doesn't apply.
- **Delete the leftover supplier identity documents.** Government IDs sit in storage with nothing pointing at them. The screen exists and was deliberately left for you to press.
- **Look at the product on a real phone.** Nothing redesigned or newly built has been seen on an actual phone by someone who can sign in. Last time you looked, three real defects turned up in ten minutes, all green in every automated check. The public shop page is now approved, so that one is finally viewable.

---

## 🌐 The public site

**Build**

90. **Put the Setnayan name on the homepage** so Google will approve our sign-in screen. The "what does this app do" half is now answered by the new hero words; the *name* half isn't — the top of the page shows only a symbol, and one piece of page metadata that should carry the name is overwritten. Until this is fixed, connecting YouTube and Google Drive stays blocked. *(small — launch-relevant)*
91. **A page explaining what connecting Google actually does** — YouTube to broadcast, Drive so photos land in a folder you own, and we only ever touch files we created. Answers the reviewer and doubles as reassurance. Ship it with item 90; each resubmission costs days. *(small)*
92. **Doorways for six product pages** — launch blocker 13.
93. **Recommendation pages and affiliate links.** The blog half shipped; this half was never started. The network application is 80 days stale and blocks nothing, because there's nothing downstream. *(medium)*
94. **Public bridal-fair pages.** The management side and pricing were specced; the pages a visitor lands on were never built. ⚠ Its own launch gates are 500 verified vendors and 10,000 active couples — we have 2 vendors — so this may be a deliberate deferral. *(medium)*
95. **Public supplies browse pages.** Roadmap, not launch work. *(large)*
96. **The app is not translated.** Three marketing pages have hand-written Taglish twins; the dashboard is English only, and there is no translation machinery at all, so finishing Tagalog — let alone adding Cebuano — is much bigger than a language file. *(large)*
97. **Design the sign-in, sign-up and invite screens.** Every person passes through them before anything else and they are the only ones nobody has drawn. Small job, highest traffic in the product. *(small)*
98. **Design the four other undesigned surfaces:** browsing suppliers, the public photo pages, the guided tour, and the onboarding questions themselves. *(large)*
99. **One shared name registry across weddings, shops and people.** Three private lists that never check each other. Seven names in use, zero collisions — nearly free now, a data migration later. **Do this first of the address items.** *(medium)*
100. **The old supplier addresses still work and ~28 in-app links point at them.** Two settings tabs show a supplier two different addresses for the same shop. ⚠ The short clean address is **already built and correct** — do not "move" anything, and a single-line redirect is wrong because a sub-page would be orphaned. *(medium)*
101. **Loose address matching** — punctuation and letter case both resolve, so search engines see duplicates. *(unverified · small)*
102. **Swap placeholder marketing artwork for real Filipino wedding photography**, and show the app-store tiles only where the app actually exists. *(unverified — the homepage was rewritten since these were logged · medium)*

**Errands / decisions**

- **Verify with Bing** (a code pasted into hosting, then a redeploy — in that order, it only takes effect on a rebuild) and **submit the sitemap to Bing**. Google needs nothing — it was verified through the domain records.
- **setnayan.ph does not resolve** and has no name servers. If it isn't registered, somebody else can take it.
- **A LinkedIn company page** — genuinely fine to skip. Do **not** create a Facebook page; that one already exists.
- **Pick one shape for the features page** — two approved documents disagree, and it stays as it is until you choose.
- **Decide what a person's public handle looks like** before anyone has one. The one account that does reads like a machine code, so switching this on today prints that code on invitations forever. Free to decide now. It blocks only the nested-address idea — none of the other address work waits on it.

---

## ⚙️ Behind the scenes

**Build**

103. **Half the database hands anonymous visitors a read key nothing needs** — 310 of 383 areas. One correctly written rule inside each is the only lock; there's no second one. Nothing is leaking today. The debt is still *growing*. Must be narrowed carefully, never in bulk. *(large)*
104. **Four internal summary views are readable by anyone**, including a supplier's review statistics and how many of their finished jobs were written off as fake. Three worse ones were already locked down. *(small)*
105. **Two database views ignore the per-row rules entirely** — new finding, the only two of their severity in the whole system. *(small)*
106. **Browser-injection protection is watching, not enforcing, and its reports go nowhere** — they reach a log line nobody reads, so the moment to switch it on never arrives by itself. *(medium)*
107. **Every picture is delivered at the size it was uploaded** — a six-thousand-pixel portrait downloads in full to fill a thumbnail. Slow for guests on phone data at a venue. ⚠ Re-price before committing: the old plan assumed a traffic relationship we don't have. *(medium)*
108. **Every picture from our storage gets a fresh address each time, so the image service re-processes it on every view — and we're billed per processing.** Nothing is wasted today because there are almost no photos; it grows directly with real galleries. *(medium)*
109. **The face-matching model files are downloaded by every guest's phone from a free public address that slows under load.** At a 300-guest wedding that can stall. The clean fix needs our own address pointed at storage — a real infrastructure move we've deliberately not made. *(owner decision · medium)*
110. **Widen the detector for switches nobody can turn on.** Twelve settings are read by the app and may have nothing that can ever set them — features built, paid for, permanently stuck. It has bitten twice for real. The detector watches three, hand-written. I found three more zero-writer settings today, so it isn't catching them. *(medium)*
111. **About twenty switches silently ignore "TRUE" and "1"** — type the wrong spelling and the feature stays off with no error, which already cost a deploy cycle. A forgiving reader exists; it must be applied one switch at a time, never swept. *(small)*
112. **Extract one shared copy of the session-secret plumbing** — three places copy it. *(small)*
113. **Delete a dead short-video worker that fakes a finished render.** Nothing calls it, but it's live, and anything reaching it would corrupt a real job. *(small)*
114. **The Google-connection refresher has no timer.** Mostly self-healing because connections refresh on use; the risk is one left idle going stale. Short-video connections were never folded in. *(small)*
115. **Text-message notifications** — email only today, deliberately. Listed for completeness. *(medium)*
116. **A rate-limiting layer and a developer website** for the outside API. ⚠ A first API already exists and refuses anyone without the top vendor plan — it isn't absent. *(medium)*
117. **Finish the offline strategy** — caching is wired and works; the policy of what's kept, for how long and how it refreshes isn't finished. Matters most at venues with weak signal. *(medium)*
118. **Rebuild rigid-group linking in the seat plan** so linked tables move and rotate as one unit, plus the polish list: simultaneous 3D walkers bumping into each other, spread-out layouts not framing nicely, and the seat-from-reply rules never moved into the main engine. *(low confidence — sourced from a note untouched for three weeks · medium)*
119. **Upgrade the crash-reporting library** — ⚠ our own note says version 9→10; the code is on 8. Resolve the real version first. *(small)*
120. **Finish routing the last hand-written corner radii through the shared scale.** Run the checker for the real count rather than trusting the note. *(small)*
121. **Delete the retired livestream code** once one real broadcast has gone out. It's still 1,200 lines and still the destination when the new one is off — and it holds the **only** printable camera hand-out sheet, so order matters. *(small, gated)*
122. **Nobody is told when cameras are silently dropped for exceeding the channel limit.** The code counts exactly how many it skipped and throws the number away. *(small)*
123. **There is no printable camera hand-out sheet on the current control screen** — the host can only show codes one at a time on their laptop. *(medium)*
124. **No switch for the host to say a livestream is actually running.** A relative overseas opens the page at 8am to a pulsing WATCH LIVE badge over a dead player. Copy the pattern from the photo host switch that shipped this week. *(medium)*
125. **The camera-seat validity dates are stored as whole days**, which is what made the shooting window one millisecond wide. The urgent bug is fixed; the storage still throws away the time of day on every write. Test it under Manila time — under our servers' clock it looks correct. *(medium)*
126. **Seven livestream pieces left as written notes** — live video connection, relay, short-lived camera passes, automatic highlight reel, switching styles mid-stream, casting to a projector, tests. ⚠ **Triage before treating any as work** — they sit in the legacy tree and a newer controller shipped since. One rehearsal would settle most of it. *(large)*

**Errands / decisions**

- **⭐ Read the live switch values from the hosting dashboard.** Almost everything called "built, switched off" on this page is *the code's default*, not a reading of production. I could establish only four from outside: roaming cameras ON, all three sign-in buttons ON, the device-record check ON, the offline helper OFF. **Ten minutes with the environment list settles about forty-five items** and would tell us whether anything is already live that we believe is dark. This is the single highest-value next step.
- **Confirm upload permissions on all five storage buckets.** If one isn't set, uploads fail with a vague "check your connection" and no real error. This already happened once — every supplier-document upload failed silently for weeks. *(Likely done for at least one, since real logo uploads have landed since.)*
- **Wire the four one-time security keys, the real business identity and the payment details in hosting.** ⚠ **Lowest-confidence item here** — the source note is the least reliable file in the repo. Verify in the dashboard before acting. One half stands regardless: those four values were briefly committed in an old change and must be freshly generated.
- **Confirm real email sending is on.** Probably already true — the sending machinery is plainly live. Confirm the key is present and this item dies.
- **Point an uptime monitor at the health check**, and confirm that a production error actually reaches an inbox. There's a button that deliberately triggers one and it has never been pressed in production.
- **Prune the leftover working copies on disk** — nineteen of them, one to two gigabytes each. When the disk fills, every command fails including the one needed to recover. This deadlocked a session once.
- **Decide on paid hosting-plan upgrades**, and with it the disaster-recovery posture — backups are the entry tier with a seven-day window and storage sits in one region.
- **Buy code-signing certificates** for the Mac and Windows downloads — they currently trip a scary security warning. ~4–6 weeks, ~₱5–15k a year. Only matters if desktop is a real channel.
- **Add Google and Facebook sign-in** — provider configuration lives in two dashboards I can't read. Don't confuse this with the Google Drive/YouTube connection; that's a different grant.
- **The public developer interface is shut and that is almost certainly correct** — our locked scope says no public endpoints in this version. A confirmation, not work.
- **Rename the duplicated spec folder number.** Filing housekeeping, no user impact.
- **Decide the fate of 169 unapplied spec-sync notes.** The rule that created that list was replaced two months ago; nobody works it and nobody has closed it, so every fresh session reads it as 169 open tasks. Archive it or fold the still-true rows in.
- **Refresh the repo's own status documents.** The running change log hasn't been regenerated since 22 June while 2,243 change notes sit on disk. **This is the exact mechanism behind the most expensive failure in this project** — three separate times a session handed you a task you had already done. The changelog half is one command.

---

## ⚖️ Compliance and legal

**Build**

127. **More than ninety kinds of record are missing from "download my data"** — a person's own erasure requests, block list, read receipts, appointments, music picks, uploaded inspiration, civil-registry documents. Each is written down by name. This is a legal obligation, not a nice-to-have. Worth splitting into "obviously theirs, just ship it" and "you must rule". *(large)*
128. **Managing another person's account is NOT built** — earlier notes called it "built, switched off"; it is a reserved switch and some shapes with no screen, no action and no data handling. It covers a guardian holding a child's account and what happens to someone's memories after they die. Both need a lawyer before a line is written. *(large)*
129. **The downloadable compliance pack is three weeks behind its own source.** Hand it to a lawyer or the commission today and it's missing everything written since mid-July, including the exact paragraphs added to close the gaps they'd ask about. It would read as if nothing was done. It's a regeneration step, not new content. *(small)*
130. **The guest who buys shots without an account is still not a listed data subject** — that person's typed name and payment screenshot are taken and our written record never names them as a category. A drafted row exists and was never folded in. *(small)*
131. **Three services that genuinely run may not be named on the public privacy page.** *(unverified — needs a line-by-line diff)* *(small)*
132. **One database function a stranger can call has never been read by a person.** Started at 217, worked down to one. The last few entries are exactly where a surprise hides. *(small)*

**Decisions only you can make**

- **Whether face measurements should have an automatic end date.** Nothing removes them today except someone asking. If yes, the build is a periodic sweep, which the existing machinery already supports.
- **One live privacy control has no recorded approval.** One automatic action can hide a supplier's listing without a person deciding it. Nineteen of twenty carry your name and a date; this one is blank — which is exactly the record that board exists to produce.
- **Sign off the guest-photography privacy paperwork.** Guests can already shoot and buy credits; the written record and the tick-box wording were never signed. The wording changed on 5 August, so any earlier approval is out of date anyway.
- **Whether the hidden-name rule covers photo captions and photo messages.** You ruled it for the written pieces. ⚠ Careful: the photo-message setting has a confusingly similar name and flipping it would silently *unpublish* every message and empty the public recap and the venue wall.
- **Adopt three drafted rows in the regulator filing** — one understates how long clips can be; two describe things already running.
- **How a decades-long safekeeping promise survives a business registered to 2031.** If the proprietor dies the promise becomes a debt of his estate.
- **Whether we may hold a stranger's email before they finish signing up** — the anonymous-start machinery is already live in production, so the retention question is the only open half.
- **Whether to start selling paid preservation.** ⚠ Included only for completeness — you parked this on 7 August. Do not re-ask its numbers.
- **Whether a coordinator may see the couple's guest photos** beyond the approval slot now built.
- **A per-vendor visibility switch for the couple** — today it's one grant per vendor with a fixed shape.
- **Whether guest-to-couple attribution is worth building at all.** The planned badge ("nine of fifty couples first met this vendor as a guest") has no data behind it. Do not fake it.
- **Two storyteller questions:** what the badge looks like and whether it's verified, and which paid services a storyteller gets free. Plus building the follower perks — followers get nothing today.

**Blocked on someone outside the company**

- **The Google Cloud account suspension appeal.** Blocks the search-performance data pull, and every day of delay is a day of data never collected. ⚠ Two of our own documents disagree about how much it blocks — production evidence says the missing livestream channel is a *separate* problem, not this one.
- **A real payment gateway** so payments confirm themselves in minutes instead of a 24-hour manual check. Needs a merchant application that takes weeks. Every rail is currently switched off.
- **Google's approval of our sign-in screen** — depends on items 90 and 91 being live first, then you press "I have fixed the issues".
- **Google Drive delivery only works for the owner's own account** — the code is complete and Google has never been asked to approve the app.
- **TikTok's audit** for automatic posting. An admin copies and posts by hand today.
- **A Meta business setup** for Facebook/Instagram auto-posting — three values pasted into settings, no app review needed to post to your own page. About half an hour.
- **Three family-layer features are legally gated, not unbuilt** — connecting people across events, life stories that pull media from other people's events, and recording dependants such as a child. Needs counsel plus a privacy impact assessment. The connections screen currently shows an honest "coming soon".
- **A central-bank opinion** on the display-only gift codes.
- **Apple and Google developer enrolments, wallet passes, on-device face detection and the store compliance pack** — all gate on one decision: do phone apps happen. Apple's takes longest. Not blocking the web product.
- **Four camera-maker developer programmes** for professional-camera pairing — and the picture is narrower than four: only one of them has a genuine mobile route.
- **Confirm the corrected legacy-preservation brief actually reached the lawyer.** Only you know. ⚠ And "the lawyer said yes" never recorded what the yes covered.

---

## ✅ Already shipped — do NOT rebuild any of these

Every one of these was listed as outstanding somewhere. All are finished.

**Livestream / cameras:** the paying couple no longer told they're on the free plan · the duplicate retired livestream card is gone and forwards to the real one · the Google disconnect button was moved onto the surviving page first · the camera-operator print pack exists and hands out the right number of seats.

**Photos:** the venue photo wall exists, works, and has already shown photos in production (only our catalogue label calls it unfinished) · guests can already make their own short souvenir video and it sells at ₱2,000 · vendors can see the photos they captured · Google Drive photo delivery is ~1,150 lines of working code, not a scaffold · the retention wording on the public privacy page and in the compliance register both now match the code.

**Coordinator / day-of:** coordinator announcements to guests · the coordinator→emcee private note channel, including the emcee's "Got it" reply · prepare-then-release for the schedule, and it's live not dark · the coordinator's request inbox · the couple's coordinator can message the host from the schedule · "happening now" widened to noon-the-day-before through noon-the-day-after on the venue's clock · the emcee script screen.

**Vendors:** all sixteen missing vendor logos, with a check that now prints zero debt · a shop is approved and publicly visible at its short clean address · the vendor page no longer tells search engines a missing shop was found · a vendor can already say which venue kinds and ceremonies they take (nobody has filled it in) · vendors' own activity page has a doorway · per-category vendor attributes · vendors already see region and event type before accepting an inquiry · booth staff are already dressed by the vendor's trade · video calls in chat (the old provider was retired in May — do not sign up for it) · the per-vendor coordinator notes folder.

**Couple / site:** the approved Filipino homepage wording is live · the Save-the-Date film and its invitation-launch date · the day-of-mode and menu disagreement · the type-to-jump Find palette exists in two places · the couple can pin their website to a phase · multi-moderator event access · Real Weddings and Explore · non-wedding onboarding is live for ten event types · the 3D room already recolours from the couple's mood board (stage, linen, floor, backdrop, light) · the kwento assignment board, guest column, magazine and moderation · a private event's invitation page no longer leaks to anyone guessing the address.

**Admin / infra:** the ranked admin work list and the all-surfaces map · the leftover-vendor-ID deletion screen · the two "desktop only" admin screens and the placeholder screens · the vendor mood-board 404 · the leftover homepage-hero settings table is dropped · payment proofs can no longer reach a public bucket · branch protection with thirteen required checks, including all six guard jobs and the browser suite · the database is fully in sync, nothing stranded · recurring background jobs run themselves — there is no missing timer to hunt for · the erasure work is genuinely at zero and locked there · the guard that stops a redesign losing a page's buttons is built and running over 400 pages · the shared uncommitted-work worry resolved itself, that copy is clean · the Papic two-type model, built and merged the day it was locked · the vendor tokens, retired · the stale website-package rows, deactivated · the anti-fake-account device check is on and recording today.

---

## What I could not check — read this before treating the list as complete

- **Almost every "switched off" claim is the code's default, not production.** Only four live values were established from outside. The hosting dashboard settles ~45 items in ten minutes.
- **Nothing has been opened on a real phone by someone who can sign in.** The one time that happened, three real defects surfaced in ten minutes, all green in CI.
- **No third-party dashboard was readable** — Google Cloud, Bing, Cloudflare storage, Vercel billing, Supabase billing, Sentry, the uptime monitor, the affiliate network, TikTok, Meta. Every item touching those is marked unverified.
- **Six areas were carried from documents nobody re-read against code**, and those documents have a proven habit of being weeks stale: the seat-plan polish list, the vendor-card annoyances, the guest-site empty-state words, the sabotage-flood presets, the loose address matching, and the contract-intelligence feature. Treat each as a claim to check, not a task to start.
- **Two whole specced areas are missing from the build order entirely** — suppliers offering different catalogues per event kind, and a bridal-fair organiser layer. Most likely these should be confirmed as out of scope rather than scheduled.
- **Three PRs are open right now**, all from this week's redesign work, and none is held for your review.