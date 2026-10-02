# What Setnayan gives free — and what the same thing costs elsewhere

Read 2026-10-02. Research only, no code changed. Owner brief, verbatim: *"this is not a real measurement. find all our services that is free and what is its equivalent cost if they purchase it somewhere else."*

Rate used everywhere: **₱57 = US$1**. "Read" dates below are 2026-10-02; the page's own date is given where the page showed one.

## 0. Verdict in four lines

1. The headline today ("Everything you get · free", ~₱63,500 + ~290 hours) comes from `FREE_TOOL_DRIVERS` in `apps/web/app/onboarding/wedding/_components/onboarding-shell.tsx`. Its own comment calls the money "market-equivalent", but **no source is cited for any of the 19 rows, and the hours are an internal "practical-time-audit"** (§I of an internal model). Neither is a measurement.
2. Of the 19 rows, **only 4 free services have a price I could source** (website+RSVP, e-invitation, live photo wall, monogram, the last on weak evidence). Two more (seat plan, budget tracker) are **free elsewhere too**, so they are worth ₱0. The rest: **no reliable price found**.
3. The sourced total is **₱0 to about ₱30,000**, not ₱63,500. The low end is ₱0 because the Philippine and international competitors give most of this away on a free tier.
4. **No source states any time saving, so hours come out entirely.** Two typed figures are contradicted by what I read: the prototype's **₱2,500 per bridal expo** (Manila expos are free to enter) and **₱14,999 for "a hired web developer"** (Philippine wedding-site packages run ₱1,700–₱8,995).

## 1. What Setnayan gives a host for free today

Read from `origin/main` (fetched this session), not from `~`.

**A. The Your Plan "Everything you get" list** (`FREE_TOOL_DRIVERS`, 19 rows): Basic website (RSVP, event site, editorial page) · Photos on your Google Drive · Mood board · Budget tracker · Planning dashboard (checklist, schedule, vendors) · Guest list + seat plan · Verified vendor marketplace · Side-by-side compare · Day-of guest portal · Contract organizer · Songlist maker · Papic sampler (3 guest seats) · Food planner · Basic monogram · Branded QR · One-tap inquiries · All chats in one place · Bring your own vendor · Verified-vendor safety.

**B. Free by decision or flag, not in that list** (all read from the code/DECISION_LOG on `origin/main`):
- `FREE_FOR_ALL_SKUS` in `apps/web/lib/entitlements.ts`: **LIVE_WALL** (live photo wall, free since 2026-08-11), **KWENTO**, **EDITORIAL_PRO** (editorial editing), **SEATING_3D** (3D seat plan, free 2026-09-05; kept free 2026-09-28), **CUSTOM_QR_GUEST** (the on-screen seat pass).
- Themes: Classic, Modern and Cyber Neon are free (DECISION_LOG 2026-09-29). The rest are Event Hub Pro.
- Free look editing: design pick, text, size, colour, background colour (DECISION_LOG 2026-09-28 "WHAT IS FREE VS PRO … REDRAWN").
- Prints in the Classic look are free (DECISION_LOG 2026-09-25). The couple still pays a printer.

**C. Not free (excluded):** the nine Event Hub Pro items in `apps/web/lib/website-pro-items.ts` (Cinematic Reveal, Save-the-Date video, photo gallery, background music, photo/video backgrounds, the Pro themes, animated logo, logo on QR). `apps/web/lib/our-services.ts` lists only paid cards (SAI, Papic, Live Watch, Music Maker, Patiktok); nothing in it is free. Editorial editing is free today, so it may not be used as the reason to sell Pro (`NOT_SOLD_ON`).

## 2. The table

"Typical cost elsewhere" is **what a couple pays if they buy it**. Where a free alternative exists, the low end is ₱0 and the row says so. Conversions at ₱57/US$.

| # | Free Setnayan service | What it replaces | Typical cost elsewhere (₱) | Source(s) |
|---|---|---|---|---|
| 1 | Event Hub website + RSVP page + guest list + QR | A wedding website with RSVP tracking | **₱0 – ₱8,995.** Free elsewhere too: Zola, Joy, Nuptl (50 guests), RSVPMePls "Intimate" (50 guests). Paid PH: RSVPMePls Classic ₱1,495 (150 guests; regular ₱2,995), Grand ₱8,995 (unlimited; regular ₱9,995); Love, D. Concepts ₱1,700–₱7,500 per site; Vowly "₱0 to ₱7,999" (search-result text only) | rsvpmepls.com · lovedconcepts.com/wedding-invitation-website/ · zola.com/wedding-planning/website · withjoy.com/wedding-website/ · nuptial-ph.com/articles/wedding-rsvp-website-philippines (page dated 2026-05-22) |
| 2 | Digital invitation (classic theme, shareable link, QR) | Sending an e-invitation with RSVP tracking | **₱0 – ₱14,193.** Free elsewhere: Joy free designs, Nuptl e-invite builder. Greenvelope per send: $59 (60 guests) = ₱3,363 · $99 (100) = ₱5,643 · $249 (250) = ₱14,193; or $125–$565/yr membership = ₱7,125–₱32,205. Paperless Post: 1–2 coins per guest at $0.12–$0.22/coin, so about ₱684–₱2,508 for 100 guests (my arithmetic from their stated coin prices) | greenvelope.com/knowledge/product/pricing.md · paperlesspost.com/blog/how-much-do-wedding-invitations-cost/ and search result on coin prices · withjoy.com/wedding-website/ |
| 3 | Live photo wall + guest photo sharing | A guest-photo QR app with a live slideshow | **₱0 – ₱6,783.** Free elsewhere: Joy, Knipsmig, Kululu and Wedibox free tiers (the free-tier wall is not confirmed for every one). Paid: Wedibox $29–$79 = ₱1,653–₱4,503 (Wedding plan $49 = ₱2,793 includes live slideshow) · Kululu $39–$99 = ₱2,223–₱5,643 · GuestPix $49–$119 = ₱2,793–₱6,783 | wedibox.com/compare/best-wedding-photo-sharing-apps (updated 2026-07-28) · wedibox.com/pricing |
| 4 | Basic monogram | A wedding monogram/logo from a designer | **₱2,850 – ₱5,700**, weak evidence: Philippine Fiverr listings "up to $50" and $50–$100 tiers; DesignCrowd PH logo $99 = ₱5,643. Fiverr returned 403 to me, so these are search-result figures I could not open | search results for Fiverr and designcrowd.com/services/466941/artchitect-ph/custom-logo-design (not opened) |
| 5 | Seat plan (2D and 3D) | A seating-chart tool | **Free elsewhere too:** Nuptl free tier has drag-and-drop seating. Paid tools I found are bundles or planner software: Wedibox All-in-One $79 = ₱4,503 (also includes RSVP, website, slideshow), Prismm (was AllSeated) $35/month = ₱1,995/month, aimed at planners and venues. **No reliable price for a couple's seat plan alone** | nuptial-ph.com/articles/wedding-rsvp-website-philippines · wedibox.com/pricing · softwareadvice.com/catering/allseated-profile/ |
| 6 | Budget tracker | A budget tool | **Free elsewhere too:** Nuptl free tier, up to 20 categories. The Knot and Zola budget pages returned 403/404, so I did not confirm those | nuptial-ph.com/articles/wedding-rsvp-website-philippines |
| 7 | Verified vendor marketplace ("like 50 bridal expos") | Going to bridal expos | **₱0 entrance.** Manila expos in 2025 were free with pre-registration (Wedding Library Feb and May 2025; Getting Married Bridal Fair, Nov 2025). Some events charge **₱750 per extra guest** beyond three. This **contradicts the prototype's ₱2,500 per expo** | jetro.go.jp/en/database/j-messe/tradefair/detail/139137 · exhibitionsforyou.com/?p=6305 (as quoted in search results) |
| 8 | Mood board | A styling consult | **No reliable price found** (the one styling-consult price I found was in Nigerian naira) | — |
| 9 | Planning dashboard, checklist, schedule | Spreadsheets / planner time | **No reliable price found** | — |
| 10 | Side-by-side compare | Quote-vetting legwork | **No reliable price found** | — |
| 11 | Day-of guest portal | Day-of guest coordination | **No reliable price found** for the portal itself (coordinators are in §3, not the same thing) | — |
| 12 | Contract organizer | Contract admin | **No reliable price found** | — |
| 13 | Songlist maker | A music planner | **No reliable price found** | — |
| 14 | Food planner | A menu planner | **No reliable price found** | — |
| 15 | Photos on your Google Drive | USB-and-delivery service | **No reliable price found** | — |
| 16 | Papic sampler, one-tap inquiries, all chats in one place, bring-your-own-vendor, verified-vendor safety | Second shooter, messaging each vendor, due diligence | **Not products anyone sells; no price exists.** The prototype already shows ₱0 for these | — |
| 17 | Editorial editing, Kwento | — | **No reliable price found** | — |

## 3. Context, not counted: planners and coordinators

The Your Plan caption says *"Tools a wedding planner would charge you for."* That is the claim most at risk, because a planner is a person, and none of these tools replaces one. I list prices so nobody is tempted to add them.

| Service | Philippines (₱) | International (USD, ₱57) |
|---|---|---|
| On-the-day coordination | ₱25,000–₱45,000 Metro Manila; ₱15,000–₱20,000 provincial (nuptial-ph.com, 2026-06-26). Conflicting: "from ₱1,500" (eventnest.ph, undated); Kwyzer listings run ₱3,000–₱10,000 at the low end (kwyzer.com, undated) | $800–$3,500 = ₱45,600–₱199,500 (withjoy.com/blog/cost-of-wedding-planner/, 2026-08-12); $800–$3,000 (zola.com/expert-advice/how-much-do-wedding-coordinators-cost, 2026-02-19) |
| Partial planning | ₱45,000–₱90,000 (nuptial-ph.com) | $2,000–$6,000 = ₱114,000–₱342,000 (Joy) |
| Full planning | ₱90,000–₱200,000+, or 8–12% of budget (nuptial-ph.com); ₱20,000 to ₱200,000 (eventnest.ph) | $3,500–$15,000 = ₱199,500–₱855,000 (Joy) |

Caveats: the Philippine figures come from a competing wedding app's blog and from directory listings, and they disagree widely. **Treat them as direction, not fact.** Neither Philippine source states any hours saved.

## 4. Totals

Counting **only** rows with a sourced price. Each is a "buy it separately" range.

| Basis | Low | High |
|---|---|---|
| **Strict** — rows 1, 2, 3 (price read on the page; free tiers counted as ₱0). Rows 5–7 are ₱0 and add nothing | **₱0** | **₱29,971** (8,995 + 14,193 + 6,783) |
| **Including the weak monogram row** (row 4, search-result figures) | ₱2,850 | ₱35,671 |

How to read it:
- The **low is ₱0** because every one of these has a credible free option. A couple who knows Zola, Joy or Nuptl loses nothing by using them.
- The **high double-counts RSVP**. Greenvelope (row 2) already includes RSVP tracking, and the PH website packages (row 1) include RSVP too. A couple buying both would overlap. Taken as a no-overlap estimate, the high is nearer **₱21,000–₱23,000** (the larger of rows 1/2, plus row 3: 14,193 + 6,783 = ₱20,976).
- Highs come from the top tier of each vendor (Greenvelope at 250 guests, RSVPMePls Grand, GuestPix top tier). A typical Filipino wedding is 150–300 guests (Nuptl, 2026-05-22), so the 250-guest tier is realistic, not inflated.
- **Hours: none sourced, none shown.** I searched for a stated time saving for RSVP, guest-list and planning tools and found marketing language only, no figure. The prototype's ~290 hours is an internal estimate with no external source.

## 5. Which claims are safe to show couples

**Safe (each traces to a page I read):**
- "Your wedding website, RSVP and guest list: free." Zola, Joy and Nuptl are free too, so don't say "unlike others".
- "Similar services charge ₱1,495–₱8,995 for a Philippine wedding website, ₱5,643–₱14,193 to send e-invitations (Greenvelope, 100–250 guests), and ₱1,653–₱6,783 for a guest photo wall." Each is a published price. Name the product and cite the date.
- "Philippine bridal expos are free to enter." True, but it argues against the marketplace's value as expo-replacement.

**Not safe — remove or reword:**
- **₱63,500 / ₱53,486 / "all of it ₱X · Yh".** It adds unsourced numbers and 14+ items with no market price. Any total that includes them is invented.
- **"~290 hours"** and every per-card "⏱ Nh". No source.
- **"Tools a wedding planner would charge you for."** A planner charges for people's time. Say "tools couples usually pay apps for".
- **"vs a hired web developer ₱14,999"**, **"₱2,500 × expos"** and every card whose "vs" role has no price in §2.
- Any claim that Setnayan is "the only free" one. At least Zola, Joy, Nuptl and RSVPMePls (50 guests) are free.

**Safest one-line headline** (every figure is a published price on a page I read, ₱57/US$):

> **Free here: your wedding website, RSVP and invitations. Similar services charge from ₱1,495 to ₱14,193 each.**

A shorter fallback with no peso figure: *"Your wedding website, RSVP, guest list, seat plan and live photo wall — free."*

## 6. Limits of this research (read before relying on it)

- Many PH tool pages carry no date or publish no price. I wrote "no reliable price found" rather than fill the gap.
- The Philippine coordinator figures come from a **competing app's blog** (nuptial-ph.com is the Nuptl marketing site) and from directories. Vowly's peso prices appear only in search-result text. Wedibox's photo-app comparison is written by a vendor in that market.
- Fiverr pages and The Knot returned 403, and Zola's budget page 404. Those prices are search-result text or unconfirmed.
- Prices are list prices on the day read. Greenvelope and Paperless Post offer discounts and the Philippine apps run promos (RSVPMePls shows "regularly ₱2,995" struck through to ₱1,495).
- I did not price the **Pro** features, **Papic**, **Live Watch** or any other paid Setnayan product. Those are not free and are out of scope.

## 7. Sources (all read 2026-10-02)

- https://rsvpmepls.com/ (RSVPMePls plans)
- https://lovedconcepts.com/wedding-invitation-website/ (PH wedding-website packages)
- https://nuptial-ph.com/articles/wedding-rsvp-website-philippines (Nuptl free/paid, dated 2026-05-22)
- https://nuptial-ph.com/articles/digital-wedding-invitations-philippines (₱180 per printed piece; Nuptl ₱560 lifetime, dated 2026-05-22)
- https://nuptial-ph.com/articles/wedding-coordinator-cost-philippines (coordinator tiers, dated 2026-06-26)
- https://eventnest.ph/blog/hiring-a-wedding-planner-or-coordinator-in-the-philippines/ (undated)
- https://kwyzer.com/hire/wedding-coordinator (undated listings)
- https://www.zola.com/wedding-planning/website (free website)
- https://withjoy.com/wedding-website/ (free website)
- https://withjoy.com/blog/cost-of-wedding-planner/ (dated 2026-08-12)
- https://zola.com/expert-advice/how-much-do-wedding-coordinators-cost (dated 2026-02-19)
- https://www.greenvelope.com/knowledge/product/pricing.md (Greenvelope tiers)
- https://www.paperlesspost.com/blog/how-much-do-wedding-invitations-cost/ and the search result quoting coin prices
- https://www.wedibox.com/compare/best-wedding-photo-sharing-apps (updated 2026-07-28) and https://www.wedibox.com/pricing
- https://www.kululu.com/qr-code-for-wedding-pictures (features, no prices shown)
- https://www.softwareadvice.com/catering/allseated-profile/ (AllSeated is now Prismm; $35/month; planner-oriented)
- https://www.jetro.go.jp/en/database/j-messe/tradefair/detail/139137 and https://exhibitionsforyou.com/?p=6305 (bridal expo free entry, via search results)
