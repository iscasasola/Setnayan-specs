# Supplier dashboard audit vs the event-dashboard rules — 2026-10-08

Four read-only Sonnet audits of origin/main apps/web/app/vendor-dashboard (+ /open-shop). Rules = PAGE_DESIGN_PROMPT_TEMPLATE_2026-10-08.md + BUTTON_RULE_2026-10-07_fable.md (R1 phone · R2 few words · R3 one row shape · R4 dropdown · R5 no go-elsewhere · R6 thumb-zone frosted rows · R7 buttons · R8 no boxes · R9 no per-field Save · R10 honest failures · R11 tours · R12 words). Grep-level; verify before building.

# A · Today / More / Notifications (Sonnet audit, origin/main)
1. Today below fold: boxes everywhere (sn-tile / sn-glass-bare rounded-2xl banners: lock/date/deposit answers, incomplete notice, token note, findability + credit banners, Coming-up + numbers tiles in supplier-today-first-screen.tsx, SpotlightAwardBanner, BookingFeeBills) → flat rows. R8 M
2. Today long copy: token note "Answering couples is free — reply to any lead…" (delete); all-caught-up ~35 words; date-change card ~75 words; incomplete notice ~25 words → 1–3 words + ⓘ. R2 M
3. findability/credit banners + Next-card body are paragraphs → title + ⓘ. R2 S
4. Feed cards (WhatsNewFeed/NothingToAnswerFeed) are paragraph cards + mono meta + inline forms → one row per ask (couple · one-line ask · ⌄ actions). R3 L
5. ~14 text-only rounded-full h-9 SubmitButtons in overview-sections.tsx, no icons, no tone map, no ActionButton/useFitRow; h-9 < 40px touch → ActionButton per BUTTON_RULE. R7 L
6. Inline reply forms (review reply, decline/reject reason) each with own send; PushToggle per-action → sheet with one Send. R9 M
7. "See everything ⌄" bare text link; number tiles bare links → ActionButton / row ›. S
8. Zero sn-glass-row; Next card + tools scroll away → float primary action as glass row above dock. R6 M
9. /more: row `sub` strings are sentences (vendor-more-rows.ts) + header caption "Everything that is not on the bar." → cut. S
10. No MiniTour on More / Notifications. S
11–15. /notifications: caption + long empty state + PushToggle sentences; read failure (fetchOwnNotifications no try/catch) shows "No notifications yet." (R10); go-elsewhere "contact email" link; text-only buttons. S each
16–17. Today money tiles vanish silently when earnings read fails; payoutReadiness / feeForecasts / credit errors render nothing → "Couldn't load" row. R10 S
18. todayLabel caption + milestone pill → one-line row. S
GOOD: 100svh first screen; 4-item bar Today·Customers·Shop·More; short nav labels; More/Coming-up rows are label·summary·› with 52px targets; Next card = one button; counts show "—" not 0; MiniTour vendor_today_v1 + vendor_welcome_v1; "Event Hub" naming pinned; no pill rows; one nav list. Today words: ~50 first screen, +200–350 below.

# B · Customers / money (Sonnet audit, origin/main)
STRUCTURE: bookings, messages, proposals, calendar, contracts, payday, clients(index) are redirect stubs into /customers (their surface.tsx folded in); earnings → /shop (shop imports earnings/surface). Each job reachable by 2 URLs; nothing dead.
DUPLICATES: invite?mode=locked vs /locked-qr (one job, two pages); clients/surface (kept notes, "Add an outside client") vs customers-roster (two customer lists); calendar/surface vs customers-calendar.tsx (two calendar renderers).
VIOLATIONS
1. Customer card (clients/[eventId], 4,104-line page) tabs = rounded-full pill row of 5–6 (customer-card-nav.tsx CardTabs) → one dropdown. R4 M
2. /invite Shortlist/Locked pill pair → PickMenu. R4 S
3. customers-filter-bar heatmap aria-pressed toggle; PickMenu only in customers-roster + customers-pick, none in calendar/bookings/proposals/contracts/payday. R4 M
4. Paragraph captions (≈91 <p>): invite "Lock in a customer who already paid…", "Name your shop first…"; calendar "Name a calendar (e.g. Main Team)…", waitlist, paid-plan note, "These are the tools that set capacity…"; booking-fees "This is on our side, not a sign you owe nothing…"; disputes paragraphs; clients "Notes you wrote about work whose celebration…". R2
5. "celebration" in clients/surface kept-notes copy. R12 S
6. Go-elsewhere: "Open mood board →", external "Open →" links on the card, roster "More customer tools" → ?open= folds, invite → /shop + /locked-qr, booking-fees → /subscription, clients → customers?open=availability; text month arrow "{month} →". R5 M
7. Boxes: card 12 <Card> + 41 bordered; calendar 16 incl. <details sn-tile>; invite dashed empty state; earnings, proposals, disputes; kept-notes sn-tile. R8 L
8. customer-card-notes.tsx "Save note" per-field Save. R9 S
9. Zero sn-glass-row; Customers tools (search/add/+/More tools) sit at the top under an h2. R6 M
10. MiniTour only on Customers; none on card, invite, booking-fees, disputes, payday, contract editor. R11 M
11. Text buttons "Go to my shop" bg-ink, →/Open/Manage links; no ActionButton/tones. R7 M
12. Card tabs, filter bar, More-tools menu each a different pattern; no shared label·summary·› row. R3
GOOD: honest-read flags on customers (evRead.complete etc.), "couldn't load" messages, reads-are-honest tests; customers MiniTour; PickMenu in roster pick; phone-first roster; "supplier" wording; one Customers landing already consolidates 7 routes.

# C · Shop / profile / sign-up (Sonnet audit, origin/main)
SIGN-UP → LIVE: /signup (one-door card, 44 words — good) → /open-shop wizard (open-shop-wizard.tsx, 4 steps, account made in step 3) → Today. Named shop in ~5 steps, but NOT live: "Get verified" admin gate (shop/_components/verify-section.tsx draft→pending_review→in_review→approved) + per-service publish gate (services/_components/publish-gate-submit.tsx). Realistic to live: ~8–10 actions + admin wait. Two tours fire back to back (GuidedTour vendor_welcome_v1 then MiniTour vendor_today_v1).
VIOLATIONS
1. /lines: intro paragraph + per-row Save form + separate delete form; "on a wedding" copy. R2 R9 R12
2. /team: 11 forms, per-row Save, "Save assignments", "Your store is run by one or more Admins…", "Apply-then-pay…" caption; "store" not "shop". R2 R9 R12
3. /reviews: 4-line paragraph citing "Vendor Agreement §3.10". R2 R12
4. /real-stories: paragraph with "celebration" + "the vendor". R2 R12
5. /repertoire: paragraph + per-song Save. R2 R9
6. /attributes: paragraphs, GET-form select, per-service Save / "Add service + save". R2 R4 R9
7. /packages: caption "Reached from the 'Packages' card on My Shop…"; radio in package-editor.tsx. R2 R4
8. Per-field Saves in shop/_components: verify-pairs (×2), website-editor, service-radius-fields "Save distances", voice-match-card "Save voice", docs-body "Save links"/"Save references", services-manager "Save changes". editable-row.tsx already autosaves on close — reuse. R9 L
9. Choice rows not PickMenu: website-editor (5 chip/card rows), venue-type-card radio, suggested-coverage-card chips, services-manager, customization-step (×2), service-list-editors, canvas-maker (×2), service-wizard gift pair, subscription ai/booth/papic-challenge cards (radio "channel"), custom-configurator radiogroup, add-payment-method pills. R4 L total
10. Zero PickMenu / sn-glass-row in area; MiniTour only on Today + Customers (none on Shop, Services, Subscription). R4 R6 R11
11. Bordered boxes: review cards, team sky notice, dashed empty states. R8
12. Desktop headers text-3xl/4xl + max-w-prose paragraph on lines/team/reviews/real-stories/repertoire. R1
13. Text-only Save/Add/Remove buttons; no ActionButton. R7
14. lines "Nothing here yet — and that is fine." may show on a failed load; verify lines/reviews/team/real-stories error paths. R10
DUPLICATES: /profile /services /payment-options /branches are redirect stubs into /shop (fine) but /services/new + /services/[id] editors compete with /shop's services disclosure; publish/verify state shown 3 places (shop verify-section, Today first-steps.tsx, profile-checklist-editor.tsx); website editor in My Shop AND /vendor-dashboard/website; payment methods in payment-options AND subscription cards; /lines ≈ Auto-reply card on /shop.
GOOD: one-door sign-up; 4-step always-mounted wizard; retired routes redirect into /shop (no "Edit in ↗"); could-not-load.tsx + reads-are-honest tests; "supplier"/"shop" wording mostly right.

# D · On-the-day / insights / extras (Sonnet audit, origin/main)
AREA-WIDE: no MiniTour on any of 15 routes (TOURS has only vendor_welcome_v1, vendor_today_v1, vendor_customers_v1); zero sn-glass-row; zero PickMenu — native <select> in on-the-day(4) performance(4) recommendations(3) moodboard-library(4) partnerships(3) activities(4); bordered cards everywhere (on-the-day 39, performance 12…); <p> counts on-the-day 133, performance 79 — mostly prose.
PER PAGE
- on-the-day/page.tsx: long banners ("Your event is today — this console is live now (T-1h → T+8h…)", preview + empty-state paragraphs) → one status row + ⓘ; h2 "Capture for your website + their recap" says "website"; 1,207 lines of bordered boxes, inline orange banners, off-tone CTA.
- on-the-day/_components (shot-list, issues-log, access-grants, module-configurator, ask-access): aria-pressed pill sets → PickMenu/switch row; shot-list "Saving…/Save again/Share with the couple" Save-style button.
- live/[eventId] console: ~20 sub-tools (song-desk, sets-panel, stage-script, floor-command, seat-scanner, schedule-updater, specialization-slot, portfolio import/credits) → one row per tool; specialization-slot shows locked upsell + "coming_soon" prose; seat-scanner copy "this site"; live/[eventId]/papic likely duplicates the console capture.
- performance (864 lines, ~18 cards: health composite, momentum chart, funnel benchmark, ROI, price band, capacity…) → too advanced for a phone supplier: 3 rows (views · inquiries · booked) + ⌄ more; pill tabs for service scope + 7/30/90 window → PickMenu; `partnershipErr ? 99 :` fakes a number on error (R10).
- demand → redirect to performance (fine).
- recaps: marketing blurb + text-3xl h1, says "wedding".
- deep-search: radio list; advanced dossier tool reachable only from subscription page.
- track-record page duplicates vendor-track-record-panel.
- recommendations: 633-line panel, 3 selects → 2 rows (give · received).
- moodboard-library: "Save tags" per-field Save; stylist-only tool.
- creators (433 lines), partnerships (472 lines): advanced; hide or 1 row.
- manpower: crosses to couple-side /dashboard/[eventId]/manpower (go-elsewhere).
- activities: 4 selects, heavy forms.
- theft-watch: "No reposts flagged — your work is clean." → "Clean".
- locked-qr: links out to invite (generator lives there); QR reachable from 3 places → fold into invite.
- notifications push-toggle: 6 paragraphs.
REACHABILITY: bottom nav lists theft-watch, recaps, partnerships (in More); shop-tool-shelves.ts holds recommendations, partnerships, creators, track-record, recaps, theft-watch (with sentence `sub:` texts); deep-search only via subscription; moodboard-library/manpower/activities not in nav (inbound links only).
GOOD: honest "couldn't load" in 7 on-the-day files + several others; console claims guarded by tests; redirects keep old URLs; live console is dark phone-first with press-and-hold Papic shutter; 44px touch targets in places.

