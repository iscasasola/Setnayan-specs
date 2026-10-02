# Prototype sample values vs shipped code — leak sweep, 2026-10-02

Read-only investigation. Nothing was changed in the app repo. Code read from a detached worktree of `origin/main` at `60b949035` (PR #6270 merge).

**Question (owner):** when a prototype became real screens, did builders copy the prototype's SAMPLE values ("190 days to go", "₱45,000", "128 guests", sample couple names, sample dates, "3 couples") into shipped code as typed text instead of computing them from real data?

**Short answer: mostly no.** The literal sample sentences from the prototypes are almost entirely absent from the live app screens. Searched and **not found** in any rendered text: `190 days`, `128 guests`, `₱45,000` as a shown figure, `3 couples` (only in code comments), `December 18, 2026` / `18 Dec` / `12 Dec` / `March 13, 2027` as a typed date on a live surface. The leaks that exist are of a different shape: **typed snapshots and pre-filled defaults** (an admin tile with a frozen "34 changes · 52%", a form pre-filled with ₱15,000, "what a planner would charge" totals typed in), and **prices typed into copy next to a catalogue that already holds the real number.**

## Counts per class

| Class | Rows listed below | Meaning |
|---|---|---|
| LEAK | **3** (4 sites) | a sample or snapshot value shown as if it were live on a real surface |
| PRICE IN COPY | **8** | a price or discount typed instead of read from the catalogue |
| UNSURE | **6** | needs an owner or builder call |
| DEMO-ONLY | **21** (grouped, ~60 lines) | renders only on a marketing mock, a sample, a demo flag or a labelled sample story |
| RULE CONSTANT | ~600 lines, listed by family | real fixed rules (24 h, 7 days, 120 days, 50/50 deposits, 5-min snap, seat counts) |

How the counts were produced: scripts in the session scratchpad extracted **1,779 distinct sample values** from the **223 prototype HTML files** (all of `prototypes/` plus every `Design_*/` folder): numbers next to units, ₱ amounts, written-out dates, couple/person names. Then **4,609 `.ts`/`.tsx` files** under `apps/web/app` and `apps/web/lib` were scanned (skipping `*.test.*`, `tests/`, `app/dev`, `app/prototype`, demo/fixture/sample/tour paths, `lib/feature-pages`; 91 files skipped by path). Raw pattern hits: 1,461 lines. After removing comments and CSS false positives (217 `%`/gradient lines) about **700 rendered-text lines** were reviewed by family; every LEAK / PRICE / UNSURE / DEMO row is listed individually, the rule constants by family. Five extra scans covered shapes the unit regex cannot see: a bare number in its own tag (`<b>128</b>`), numeric props (`value="168"`), `key: '128'` object literals, `?? 150`-style fallbacks, and named-people greps. Prototype match = exact string found in the prototype HTML.

Not scanned by design: `app/tour/*`, `app/dev`, `app/prototype`, anything whose filename contains demo/fixture/sample/tour, `lib/feature-pages`. Prices in those are DEMO-ONLY by the brief.

---

## LEAK

| file:line (anchor) | the text | matches prototype | why |
|---|---|---|---|
| `apps/web/app/admin/_components/what-you-change.tsx:72-77` (`WHAT_YOU_CHANGE`) | "34 changes · 52%", "9 changes", "9 changes", "6 changes", "4 changes", "3 changes" + bar widths 100/26/26/18/12/9 | `admin_home_interactive_2026-08-25.html` (`34 changes · 52%`) | Rendered on the admin Overview as if they were live counts. They are a frozen snapshot of the owner's audit log 20 May to 8 Aug 2026. The file's docblock says "the shares are FIXED, not recomputed", so it is deliberate, but the tile reads as a live number and will be wrong from the next change on. |
| `apps/web/app/dashboard/[eventId]/manpower/_components/post-gig-drawer.tsx:102` (`defaultValue={15000}`) | "Cash amount (₱)" box pre-filled with 15000 | `₱15,000` appears in **15** prototypes (`admin_pricing_grouping`, `chat_interface_v2..v4`, ...) | A host posting a manpower gig sees ₱15,000 already typed in. It is the prototype's sample amount, not a rule or a catalogue value. |
| `apps/web/app/dashboard/[eventId]/manpower/page.tsx:214` and `apps/web/app/vendor-dashboard/manpower/surface.tsx:185` | "The ₱15,000 (or whatever you adjust it to) flows directly from you…" / "Setnayan doesn't touch the ₱15,000 — it flows direct from the host to your crew." | same ₱15,000 | The supplier-side note states ₱15,000 as the amount of every gig. Gigs carry their own `cash_amount_php`, so this is wrong for any gig not at 15,000. |

## PRICE IN COPY

| file:line (anchor) | the text | matches prototype | why |
|---|---|---|---|
| `apps/web/app/dashboard/[eventId]/studio/papic/page.tsx:2413` (`DslrBridgeSection`) | "Pair a DSLR — ₱100 / seat / day" | none | Catalogue `papic_cam_bridge_slot_day` is `priceCentavos: 9900` (₱99) and `isActive: false` (`lib/sku-catalog.ts`). A real couple screen quotes a price that is neither the catalogue figure nor purchasable. Worst row in this class. |
| `apps/web/app/vendor-dashboard/team/actions.ts:120` | "Add a seat (₱250/28d) for more." | `₱250` in 9 prototypes (`your_team_FINAL`, `vendor_custom_subscription`, ...) | `lib/vendor-seats.ts` already reads the live fee via `fetchSeatFeePhp` (SKU `vendor_extra_seat`); this error message types it instead. |
| `apps/web/app/onboarding/wedding/_components/onboarding-shell.tsx:957` + `:4706` (`ONBOARDING_PROMO = 0.2`, "−20% onboarding promo") | 20% off any add-on during onboarding | none | The discount is a constant inside the component plus the same figure typed in the label. Not read from an admin-managed setting. |
| `apps/web/lib/v2-catalog.ts:377-386` (`soloMonthly: fmt(soloMo, '₱1,000')` ...) | nine typed fallback prices: ₱1,000 / 10,400 / 2,600 / 2,500 / 26,000 / 6,500 / 10,000 / 104,000 / 26,000, branch ₱1,000, token fallback 200 | none verified (₱250 seat fee is in 9 prototypes) | Only render if the catalogue read is empty, and the docblock says they are re-derived by hand. Standing promise that a human keeps nine numbers in step. |
| `apps/web/app/admin/pricing/_components/papic-ladder-editor.tsx:105` | "Shots are sold against ₱1 a shot" | none | Typed rate in admin explanatory copy. Admin-only, low risk. |
| `apps/web/app/onboarding/wedding/_components/onboarding-shell.tsx:4590` | "₱30,000+ coordinator" | none | Declared in `lib/public-price-literals.ts` with `sku: null`, which is the category nothing verifies. |
| `apps/web/app/_components/app-store/studio-card-demo.tsx` (path skipped by scan, found through the literal registry) | ₱500 monogram, ₱2,500 Pakanta, ₱85,000 quote | none | Declared and SKU-checked at runtime by `runSeoHealthChecks`, so this is the guarded version of the problem. Listed so the class is complete. |
| `apps/web/app/pay/[reference]/_components/pay-panel.tsx:306` | "a ₱10–₱15 transfer fee" | none | A bank's fee, declared in the registry with `sku: null`. Not a Setnayan price, listed for completeness. |

## UNSURE

| file:line (anchor) | the text | matches prototype | why |
|---|---|---|---|
| `apps/web/app/onboarding/wedding/_components/onboarding-shell.tsx:1071-1085` (`FREE_TOOL_DRIVERS`) | typed "market-equivalent" values: website ₱14,999, Drive ₱5,000, mood board ₱3,999, budget ₱3,999, guest list ₱2,999, marketplace ₱2,500 × expos, compare ₱2,499, ... summing to the "~₱63.5K / ~290h" headline and the "Tools a wedding planner would charge you for" tally (`:1142`, `:1163`) | `wedding_onboarding_interactive_2026-10-01_fable.html` (`14,999`, `₱63`) | The docblock calls it owner-locked ("market-equivalent, not a Setnayan SKU price"). Still: invented figures, copied from a prototype, summed into a headline a real couple reads on the Your Plan screen. Owner call whether this is acceptable. |
| `apps/web/app/onboarding/wedding/_components/onboarding-shell.tsx:2152`, `:2540-2541`; `apps/web/app/onboarding/wedding/_components/weave-story.ts:132-133` | fallback couple name "Maria & Juan" / "Maria" / "Juan" | `Maria & Juan` in `story.html` | If the names are blank, the Your Plan screens and the woven love story show the sample couple. The `name` step is Continue-gated, so probably unreachable. Needs a builder to confirm. |
| `apps/web/app/onboarding/wedding/_components/onboarding-shell.tsx:2244`, `:2519`, `:2714` (`state.pax ?? 150`, `s.budgetBand ?? 'classic'`) | 150 guests / "classic" band as fallback; the line-2714 one feeds `budgetAmountCentavos` in the commit payload | `150 pax` in 12 prototypes | The pax step is gated (`state.pax !== null`), so the fallback should never write. If it ever did, it would store a budget computed from a sample guest count. A guessed number governing money is exactly the rule-9 pattern. |
| `apps/web/app/dashboard/[eventId]/studio/patiktok/booth/page.tsx:447` | "The 40-cap is calibrated to ~20% participation across 200 guests" | none | The 40 is typed here while line 293 of the same file renders `{PATIKTOK_VIDEO_SOFT_CAP}` (`lib/patiktok.ts` = 40). Will drift if the cap moves. |
| `apps/web/lib/llms-txt.ts:561` | "the founder's wedding (December 18, 2026)" | `18 December 2026` in 22 prototypes | A real fact typed into the public llms.txt. Not a sample, but a fixed date that will go stale after the wedding. |
| `apps/web/app/onboarding/wedding/_components/welcome-moments.tsx:99-100` | "about 236,000 couples in 2023" / "177,627 in 2023" | none | Real PSA statistics, typed. Not a sample, but unsourced in the UI and a hand-copied number. |

## DEMO-ONLY (fine, grouped)

| where | what shows | note |
|---|---|---|
| `apps/web/app/download/_download-motion.tsx:321-335` | "Maria & Jose", "284 days to go", Guests 168 / RSVP'd 124 / Tables 18 | marketing mock of the desktop app. `Maria & Jose` is in 11 prototypes; `168` in 3. The "284 days" is frozen and already stale, but it sits in a mock window. |
| `apps/web/app/(shell)/papic/_papic-sections.tsx:257-286` | "Maria & Jose", "14 February 2027 · Tagaytay", "1,284 moments", "34 photos of you" | marketing mock; `14 February 2027` is in 3 prototypes, `1,284` in 5. |
| `apps/web/app/for-suppliers/_components/vendor-grow-sections.tsx:317-330` | "Blossom & Co." looking at "your date (Jun 14)", "Andrea & Miguel" | marketing chat mock; `Andrea & Miguel` is in `people_and_places_rail_2026-09-26.html`. |
| `apps/web/app/_components/home/plan3d-demo-overlay.tsx`, `panood-demo-overlay.tsx`, `alaala-editorial-overlay.tsx` | "Maria & Jose", "Maria & Juan" | home-page overlays of the sample room and sample story. |
| `apps/web/app/(shell)/pa3d/_pa3d-room.tsx`, `pa3d/try/page.tsx`; `apps/web/app/3d_plan/demo/[token]/…/plan3d-guest-view.tsx:102` | "Maria & Jose's sample room" | explicitly labelled sample room. |
| `apps/web/app/_actions/plan3d-demo-actions.ts:399-400` | `ev.bride_name ?? 'Maria'`, `groom_name ?? 'Jose'` | demo scene loader (`loadPlan3DDemoScene`, reads the sample event). |
| `apps/web/lib/real-weddings.ts` (22 entries, all `isSample: true`) | 22 sample stories: Maria & Juan, Sofia Reyes, ..., guestCount '120 guests' / '80 guests' / '260 guests' ... | labelled "Sample" on /realstories; file header says fictional. |
| `apps/web/app/[slug]/_components/editorial/data.ts:3336-3340` (`mariaAndJuan`, `guests = 120`, `eventDate '2026-02-14'`) and its four siblings | five sample editorials | reached only via the `SAMPLE_EDITORIAL_IDS` sentinel. |
| `apps/web/lib/admin/intelligence-stats.ts:322-345` (`buildDemoIntelligenceStats`: "Bea & Marco", "Bea Santos", `bea.demo@example.com`) | admin intelligence page in demo mode | only when `?demo=1` or the demo cookie is set, with a demo badge. `Bea & Marco` is in 17 prototypes. |
| `apps/web/app/dashboard/[eventId]/launch/_components/maker-details.tsx:410`, `maker-theme-picker.tsx:269` | "Samples · Maria & Jose" | labelled "Samples". |
| `apps/web/app/admin/reveal-studio/studio.tsx:467` | "Maria & Jose" | admin tool preview canvas. |
| `apps/web/app/vendor-dashboard/services/_components/canvas-maker.tsx:1440` | "Casa Luna Events — Full-day service, from ₱25,000 per event" | preview card illustrating the maker. |
| `apps/web/app/vendor-dashboard/shop/_components/voice-match-card.tsx:54-55` | "Full-Day Coverage from ₱48,000; Half-Day … ₱28,000 … Signature ₱85,000" | `PREVIEW_ANSWER`, shape-matched to the real builder; shown as an example reply. |
| `apps/web/lib/print-layout.ts:2466` | "Your guest's name", "Table 1", seat "3", "Nº 0001" | pass preview when no real pass supplied; reads as placeholder. |
| `apps/web/lib/simulated-guest-preview.ts:119` | "Table 1 · sample" | labelled sample. |
| `apps/web/lib/tours.ts:767`, `lib/site-widgets.ts:56` | "Maria & Jose" / `home_maria_juan` | tour copy and a widget label. |
| `apps/web/app/_components/app-store/studio-card-demo.tsx` | Ana/Maria names + the three prices above | public app-store demo frames (skipped path). |
| `apps/web/lib/llms-txt-guard-input.ts:89-147` | PAPIC_GUEST_* price rows | test-input fixture for the llms.txt guard, not rendered. |
| Placeholders: `creator/page.tsx:701` "e.g. Ana & Marco — Batanes elopement", `story/editorial-editor.tsx:958` "Maria & Juan Are Married", `guests/_components/capture-bar.tsx:44` "Ana Cruz +1 groom vip #Barkada", `guest-name-fields.tsx:125`, `self-added-contact-card.tsx:162`, `budget-setter.tsx:94` "₱ 680,000", `costs-with-no-supplier.tsx:172` "₱ 40,000", `maker-details.tsx:1056` "Reply by Nov 18 · Claire, 0917" | grey placeholder text in empty inputs | placeholders, never stored or shown as a value. |
| `apps/web/app/(shell)/guest-list/page.tsx:136,195` | "Ana Cruz +1 groom vip #Barkada" lands as a row | example sentence in marketing FAQ. |
| `apps/web/lib/blog.ts:375-381`, `lib/blog-batches/*` | market ranges: "₱45,000–₱180,000" photo and video, "₱900–₱2,500 per head", "₱25,000" coordination ... | editorial market guidance about other parties' prices, not Setnayan prices. Note `₱45,000` is also the low end here; the owner's sample figure may have come from the same source. |

## RULE CONSTANT (fine, by family; ~600 lines)

Representative, not exhaustive. All real fixed rules or policy copy, none matches a prototype sample as a live value.

- **Time windows and retention:** "24 hours", "48 hours to agree or decline", "7 days", "30 days", "90 days", "120 days" licence validity, "6 months" originals, "5 years / 10 years" retention (`privacy/page.tsx`, `terms/page.tsx`, `refunds/page.tsx`, `periodic-job-registry.ts`, `lock-request-expiry.ts`, `date-change.server.ts`, `paperwork.ts`).
- **Money rules:** Deposit 50% / Balance 50% (`budget/actions.ts:337,345`), payout stages 20/60/20 (`lib/payouts.ts:66-68`), "0% commission", "keep 100%" (`about`, `explore`, `marketplace`, `pricing` — note these are typed repeatedly while `lib/commission-promise.ts` derives the same promise elsewhere), "₱0 forever" free markers (always allowed by `public-price-literals.ts`), "every 28 days" billing cycle, "Save 20%" annual (a rule whose live value is in the catalogue; low risk).
- **Interaction constants:** "snaps to 5 min" (`schedule/_components/day-ui.tsx`, `day-sheets.tsx`), 15/30/45/90 min duration chips, "Upload up to 3 photos per category", "Tag up to 5 guests", "10 photo notes", "3 seats" sub-accounts, 1–5 star ratings.
- **Seat shapes:** "Round (8/10/12 seats)", "Family head (12/14/16 seats)" etc. (`lib/seating.ts:80-89`).
- **Checklist bands:** "18–12 months before" … "The final 2 weeks" (`lib/checklist.ts:349-356`), roadmap bands (`lib/wedding-roadmap.ts`).
- **Admin constants:** SLA 48 hours, "10 minutes", "Past 12 weeks", hiring-guide salary ranges (`lib/hiring-guide/alert-engine.ts`), voucher examples ("a ₱500 cap on a ₱2,000 service").
- **Validation messages:** "₱0 or more", "between 0% and 100%" and the like.
- **CSS false positives (217 lines):** `radial-gradient(… 32% …)`, `transform-origin: 50% 50%`, `borderRadius: '50%'`, `calc(100% - 20px)`.

---

## What this says about the owner's question

1. **The prototype's headline sentences did not get copied.** "190 days to go", "128 guests", "3 couples" are computed or absent. Where a count appears it is a variable (`formatCount(...)`) in every authenticated screen checked.
2. **The leak vector is defaults and snapshots, not sentences.** Both LEAK rows came from a *shape* in a prototype: a tile that shows a number, and a form that shows an amount. A builder typed the prototype's number into the field's default or the tile's label. The same shape hides in the UNSURE rows (the onboarding "what you'd pay elsewhere" tally).
3. **Prices in copy are the larger, quieter problem.** The catalogue is the single price source, yet the Papic screen quotes ₱100 for a feature the catalogue prices at ₱99 and marks inactive; the supplier team screen types ₱250; the onboarding promo is a constant, not a setting. The repo already has `lib/public-price-literals.ts`, but it only scans **public** sources, so couple and supplier dashboard copy sits outside it. Extending that scan to `app/dashboard` and `app/vendor-dashboard` would catch rows like the DSLR price.
4. **Marketing mocks keep frozen sample numbers** ("284 days to go", "1,284 moments"). They are honest mocks, but a reader could take them for a claim.

## Method gaps

- Line numbers are as of `60b949035`; per Rule 7 re-find by the anchor in parentheses.
- JSX text split across lines, or numbers built from a variable plus a typed word, are invisible to a line scan. The `{count} guests` pattern is a variable and therefore fine; a typed "128" separated from its label by markup would only be caught by the bare-number-in-a-tag and props scans, which found nothing outside the marketing mocks listed.
- `app/tour/*` and other skipped paths were not audited.
- Prototype PNGs were not read; only HTML.
