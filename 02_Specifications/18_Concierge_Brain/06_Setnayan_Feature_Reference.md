# 06 — Setnayan Feature Reference

**Authoring status:** Filled 2026-05-18. Each chunk paraphrases an iteration spec in couple-friendly language for the wizard's couple-facing copy + the brain's free-tier Q&A surface. Couple sees these answers when they ask "what does Setnayan do for X?".

**Authoring rule.** Every chunk cites the iteration it summarizes. Pricing fields re-verify against `service_catalog` + `Pricing.md` before each release. Filled with canonical content reflecting the 2026-05-18 lock set (₱2,499 Concierge, Pro Weekly bundle, wizard architecture).

---

## Guest List (iteration 0001) — free

**Tags:** guest-list, rsvp, guests, feature, free
**Applies to:** all couples
**Cross-ref:** 0001 guest list, 0002 QR invitations, 0008 seating
**Last verified:** 2026-05-18 · Setnayan team

Setnayan's Guest List tool is free for every couple. Add your guest list once — names, contact info, role assignments (sponsors, entourage, family, friends), dietary restrictions, plus-one status — and the data feeds every downstream surface: invitations, seating chart, final headcount to your caterer, and the day-of guest check-in.

Each guest gets a personal QR code via the QR Invitations feature (0002), so RSVP'ing is one tap. You can track who's responded, send nudges to slow responders, and lock the final headcount when ready.

### Common follow-ups
- "How do I import my guest list from a spreadsheet?"
- "What if a guest doesn't have a phone for the QR?"
- "Can I edit the guest list after sending invitations?"

### Caveats / what NOT to say
- Don't say it's free on the Concierge tier — it's free for everyone (DIY and paid).

---

## QR Invitations (iteration 0002) — free

**Tags:** qr, invitations, save-the-date, feature, free
**Applies to:** all couples
**Cross-ref:** 0002 QR invitations, 0004 invitation widgets
**Last verified:** 2026-05-18 · Setnayan team

Setnayan invitations are personalized QR codes — each guest gets a unique URL that loads their personal RSVP page. Base invitations are **free** for every couple. The QR can be sent via SMS, Messenger, email, or printed on physical invitations (your printer adds the QR).

Two access tiers: **public-tier** (guest can see basic event info without registering) and **registered-tier** (guest must sign up to see venue address, contact info, and gift registry — gives you privacy + RSVP tracking). Couple chooses the access mode per invitation.

### Common follow-ups
- "Do I have to use the QR?"
- "Can guests see who else is invited?"
- "How does the registered-tier signup work?"

### Caveats / what NOT to say
- Don't recommend skipping the QR — manual RSVP tracking creates errors.

---

## Invitation Widgets (iteration 0004) — paid upgrades

**Tags:** widgets, monogram, hero, schedule, paid, free-during-launch
**Applies to:** all couples (especially mid-tier+ budgets)
**Cross-ref:** 0004 invitation widgets, Pricing.md § 2
**Last verified:** 2026-05-18 · Setnayan team

Beyond the free base invitation, Setnayan offers paid upgrades to elevate the visual experience:

- **Monogram Hero** (₱1,999) — animated SVG monogram for your invitation landing page, hand-traced from your initials
- **Live Schedule widget** (₱999) — interactive day-of timeline shown to guests, updates live as the day unfolds

Both are stayed paid throughout the 2026-05-18 launch promo. They're optional — the free base invitation works perfectly for couples who don't need the upgrades.

### Common follow-ups
- "Is the Monogram Hero worth it?"
- "What does the Live Schedule actually do?"

### Caveats / what NOT to say
- Don't pressure couples to buy these — they're optional polish, not core.

---

## Mood Board (iteration 0010) — free

**Tags:** mood-board, palettes, design, free, feature, colors
**Applies to:** all couples
**Cross-ref:** 0010 mood board, 0001 role taxonomy
**Last verified:** 2026-05-18 · Setnayan team

Setnayan's Mood Board is free for every couple. It's a palette engine where you define colors for every role on your guest list (Bride · Groom · Bride's parents · Groom's parents · Maid of Honor · Best Man · bridesmaids · groomsmen · principal sponsors · secondary sponsors · bearers · flower girls — plus any custom roles) and every venue area (Church · Reception · Cocktail · custom rooms).

You can pick from 20 pre-curated wedding palette themes, build from scratch using a color picker / hex input / color-name autocomplete, or upload a reference image and have Setnayan extract its dominant colors. The Setnayan Guide rule engine warns when colors won't work together.

**This is what your florist, stylist, cake vendor, and invitation designer all reference.** Locking your mood board by 6-8 months out unblocks every downstream vendor.

### Common follow-ups
- "Can I use the same palette for everyone?"
- "How do I share my palette with my florist?"
- "What if I want to change my colors halfway through?"

### Caveats / what NOT to say
- Don't suggest the Mood Board is optional for serious couples — every vendor needs it.

---

## Seating Chart Editor (iteration 0008) — free

**Tags:** seating, chart, tables, free, feature
**Applies to:** all couples
**Cross-ref:** 0008 seating, 0001 guest list
**Last verified:** 2026-05-18 · Setnayan team

Setnayan's Seating Chart is free for every couple. Drag-and-drop tables onto your reception floor plan, assign guests by role tier, and print a seating pack with QR codes for guests to scan and find their seat. 13 table shape/size options match common Filipino reception layouts.

The seating chart auto-fills from your Guest List role assignments (sponsors → premium center tables, bridal party → near the head table, family → next ring out, friends → outer ring). You can manually adjust or let the auto-fill do the heavy lifting.

### Common follow-ups
- "Can I have an open seating plan?"
- "What if guests want to sit together?"

### Caveats / what NOT to say
- Don't recommend skipping seating for events >50 guests — chaos at arrival.

---

## Budget & Expenses (iteration 0007) — free

**Tags:** budget, expenses, pricing, free, feature, payment-milestones
**Applies to:** all couples
**Cross-ref:** 0007 budget, 0034 Setnayan Pay
**Last verified:** 2026-05-18 · Setnayan team

Setnayan's Budget tool is free for every couple. Track every wedding expense with a three-line model per vendor: **Package** (the contract amount) + **Crew Meal** (per-crew-member meal cost if applicable) + **Transport** (if vendor charges outside their service radius). Set payment milestones (Reservation · Downpayment · Interim · Balance) and Setnayan reminds you when each is due.

Export your full payment schedule as an `.ics` calendar file so it lands in your iCal/Google Calendar with reminders. If you're using Setnayan Concierge, the wizard reads these milestones and surfaces them in your Next Actions feed (🔴 Overdue · 🟡 This week).

### Common follow-ups
- "What's a typical vendor payment schedule?"
- "How do I add a vendor that's not in the marketplace?"
- "What's a crew meal?"

### Caveats / what NOT to say
- Don't tie this feature to Concierge — the Budget tool is fully usable on DIY.

---

## Setnayan Concierge (iteration 0016) — the active wizard · ₱2,499

**Tags:** concierge, paid, wizard, journey, upsell, free-via-pro-weekly
**Applies to:** all couples (paid tier)
**Cross-ref:** 0016 § 0b wizard architecture, 0016 § 0c Pro Weekly bundle
**Last verified:** 2026-05-18 · Setnayan team

Setnayan Concierge is the **active wizard** that conducts your wedding planning. At ₱2,499 for the full wedding-anchored access window (12 months floor, 24 months cap), it's a one-time purchase per event — no subscription.

What you get on Concierge:

- A personalized wedding plan generated from your intake answers (date, guest count, religion, region, budget tier, foundation status)
- Active Next Actions feed: what's overdue, what's due this week, what's next priority
- Vendor recommendations matched to your tier, region, remaining slots
- Auto-share packs to your vendors (mood board to florist, guest list to caterer, etc.)
- Coordinator delegation — if you hire a coordinator on Setnayan, they get scoped access to act on your behalf
- Weekly email digest summarizing what's pending
- Unlimited free-form questions to the Concierge brain (vs 3 per event on DIY)
- Honeymoon planning support

**Free if you book any Pro Weekly vendor.** When you book a vendor with an active Pro Weekly subscription, Concierge automatically unlocks for your wedding-anchored window — no additional charge. Pay ₱2,499 only if you want Concierge immediately, before booking any vendor.

### Common follow-ups
- "What's the difference between DIY and Concierge?"
- "Can I try Concierge before paying?"
- "What's a Pro Weekly vendor?"

### Caveats / what NOT to say
- Don't say Concierge replaces a human coordinator — it's a planning aid, not a person.
- Don't quote ₱4,999 — that price was retired 2026-05-18.

**This chunk is the upsell answer when DIY couples hit their 3 free-question cap.**

---

## DIY mode — unrestricted vendor search (free, default)

**Tags:** diy, free, default, vendor-search, basic
**Applies to:** all couples (default tier)
**Cross-ref:** 0016 § 0 access model
**Last verified:** 2026-05-18 · Setnayan team

Every Setnayan account starts on DIY mode. You get unrestricted access to the marketplace: browse all vendors, contact whoever you want, build your own list. No wizard guidance, no proactive nudges, no auto-share packs — you drive everything yourself.

DIY couples also get **3 free questions** to the Concierge brain per event. After 3 questions, the upgrade prompt appears.

All artifact tools (Guest List, Mood Board, Seating, Budget) are fully available on DIY. The only difference between DIY and Concierge is whether the wizard actively *conducts* the planning or you do.

### Common follow-ups
- "What can I actually do for free?"
- "Why would I pay if DIY has everything?"
- "How do I switch to Concierge later?"

### Caveats / what NOT to say
- Don't disparage DIY — many couples plan beautifully on DIY.

---

## Save-the-Date Video (iteration 0024) — ₱99 (FREE during launch)

**Tags:** save-the-date, video, mp4, paid, ₱99, free-during-launch
**Applies to:** all couples
**Cross-ref:** 0024 save-the-date, Pricing.md § 2
**Last verified:** 2026-05-18 · Setnayan team

A ₱99 SKU that turns 5-10 of your photos into a 30-60 second 1080×1920 vertical MP4 — perfect for sharing on Instagram Stories, TikTok, or Messenger as a save-the-date. Uses Setnayan-licensed music + an end-card with your wedding landing page URL.

**FREE during the launch promo** (until 2027-03-31 23:59:59 +08:00). Couples planning a wedding in this window pay nothing for the SKU.

### Common follow-ups
- "What kind of photos should I upload?"
- "Can I customize the music?"

### Caveats / what NOT to say
- Don't promise customization beyond what the SKU offers (music is curated, end-card is templated).

---

## Help Center (iteration 0029)

**Tags:** help, support, tickets, feature, escalation
**Applies to:** all users (couples + vendors)
**Cross-ref:** 0029 help center
**Last verified:** 2026-05-18 · Setnayan team

Setnayan's Help Center is where couples + vendors escalate beyond the concierge brain. When the wizard can't answer something, or when there's a dispute, payment issue, account problem, or trial-ban appeal — file a help ticket. The Setnayan operations team handles tickets in priority order.

The help center is also the **appeal path** for: account enforcement (trial-ban / full-ban appeals route here), concierge unanswered questions (admin can elevate a question into a new brain chunk), and vendor disputes.

### Common follow-ups
- "How long until I get a response?"
- "What if my issue is urgent?"

### Caveats / what NOT to say
- Don't promise specific response times — they vary by ticket type.

---

## Vendor contract upload + dual e-signature (iteration 0032 replacement)

**Tags:** contracts, e-signature, vendor, pdf, free
**Applies to:** all booked vendor-couple pairs
**Cross-ref:** 0034 vendor contracts table, decision log 2026-05-18 row 4
**Last verified:** 2026-05-18 · Setnayan team

Every vendor on Setnayan can upload a contract PDF directly to your booking thread, and both you and the vendor sign with canvas-captured signatures (no third-party e-sig service). The contract is sealed `fully_signed` once both signatures land.

**Notary is not provided by Setnayan** — Philippine Notarial Law restricts notaries to their RTC city/province, and cross-city notarization is complex. Couples who want notarization take the signed PDF to their own local notary.

Free for every couple-vendor pair. Replaces the retired AI contract-analysis SKU from the older 0032 spec.

### Common follow-ups
- "Do I have to sign the contract on Setnayan?"
- "What if my vendor doesn't upload a contract?"

### Caveats / what NOT to say
- Don't recommend skipping the contract — verbal agreements lead to disputes.

---

## Daily Concierge Nudges (paid-tier only)

**Tags:** concierge, nudges, daily, paid-only, upsell, paid_tier_only
**Applies to:** paid Concierge couples only
**Cross-ref:** 0016 § 0b wizard architecture, 0028 emails
**Last verified:** 2026-05-18 · Setnayan team
**paid_tier_only: TRUE**

Paid Concierge couples get the wizard's full active-helping pattern: daily check-ins based on the 9-step journey + the canonical wedding timeline. The wizard surfaces what's overdue, what's due this week, what's next, and when major decisions should be made (food tasting · marriage license window · mood board lock).

DIY couples don't get the daily nudges — they get static tools + 3 free brain questions. The proactive layer (nudges + reminders + recommendations) is the paid moat.

### Common follow-ups
- "How often do I get nudges?"
- "Can I turn off nudges?"

### Caveats / what NOT to say
- Don't suggest DIY couples can get nudges — they can't.

---

## Honeymoon Planning (paid-tier only)

**Tags:** honeymoon, planning, paid-only, premium, paid_tier_only
**Applies to:** paid Concierge couples only
**Cross-ref:** 0016 § 0 access model, 0021 couple dashboard
**Last verified:** 2026-05-18 · Setnayan team
**paid_tier_only: TRUE**

Setnayan Concierge includes honeymoon planning support — destination recommendations, visa/passport timing reminders, off-season pricing tips, and pre/post-wedding scheduling. Particularly useful for international honeymoons where visa processing takes weeks.

V1 ships honeymoon planning as part of the Concierge wizard's tracking layer; V1.5+ deepens with curated destination guides + booking integrations.

### Common follow-ups
- "Can Setnayan book my honeymoon?"
- "What destinations does Concierge recommend?"

### Caveats / what NOT to say
- Don't promise booking integrations in V1 — V1 is planning support only.
