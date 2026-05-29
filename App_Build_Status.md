# Setnayan — App Build Status (spec vs. live code)

**Last regenerated:** **2026-05-28 pre-pilot pass — addendum below** captures 2026-05-23 → 2026-05-28 sprint (~PRs #290–#549, ~260 merges including Concierge → Today's Focus SKU lock, wizard 38 → 65 cards, /today first-class route + first BottomNav tab, admin dashboard 4 new surfaces + Tier 1 follow-ups, vendor hero photos pilot polish, Wedding Attire Guide arc, OAuth Google + Facebook, .single() pilot hardening). Headline counts below updated for the deltas; per-iteration table at line 67 is still mostly accurate (rows that materially changed are noted in the addendum). Pilot launches **2026-06-01** — 4 days out at regen time.
**Previous regen:** 2026-05-22 post 17-PR sprint (PRs #272–#289 — payments idempotency sealed, observability completed end-to-end, day-of PWA Phase 1, marketing chrome + schema.org + sitemap refresh, CI guards for retired strings + email links, dashboard TILES expansion, admin nav, actor terminology sweep, Patiktok + Pakanta marketing surfaces, Setnayan Pay worked example update)
**Repo audited:** `origin/main` at `https://github.com/iscasasola/setnayan-platform` (last commit `a6475b3` 2026-05-27 22:17 PHT — PR #549 my profile maybeSingle fix)
**Companion docs:** [V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md) (spec) · this doc (code) · [Installed_Stack_Inventory.md](Installed_Stack_Inventory.md) (deps) · [API_Integration_Checklist.md](API_Integration_Checklist.md) (prereqs)

---

## 🚀 2026-05-23 → 2026-05-28 sprint addendum — what changed since the 2026-05-22 regen

**Scope:** ~260 PRs merged (PR numbers ~#290 → #549). Engineering velocity stayed high through 2026-05-25 then dropped to a calm 3-day window through 2026-05-28 with one batch (PRs #545–#549) landing on the pre-pilot polish. Pilot launches 2026-06-01 — 4 days out at this regen.

### Headline shifts (per-iteration table at line 67 mostly stays — these rows materially changed)

| Iteration | Status flip | Why |
|---|---|---|
| 0011 Panood | ⚙️ engineering-in-flight → ⚠️ partial → on path to ✅ V1 (YouTube verified-app review still pending) | BYO YouTube OAuth shipped per CLAUDE.md 2026-05-23 row 1 OAuth providers expansion; broadcaster scaffolds shipped via 2026-05-24 wizard sequence work |
| 0012 Papic | ⚙️ engineering-in-flight → ⚠️ partial V1 web slice | Web-side capture path + Drive transfer + Auto-Recap rendering scaffolds shipped throughout 2026-05-23/24; native iOS/Android stays V1.5+ per the deferred-architecture lock; 1019 vendor_profiles + 39 venue_directory rows backfilled with Pexels hero photos via PR #499 |
| 0016 Step-by-Step Plan Builder | renamed in spec to "Today's Focus" (CLAUDE.md 2026-05-24 eighth row), engineering shipped 65-card wizard | 38 → 65 cards across PRs #519–#544 (one-PR-per-card waves); /today route + first BottomNav tab "Today" with Focus icon shipped via PR #520; 6-week Phase 0–5 plan locked 2026-05-23 row 6 collapsed into ~5-day intensive engineering sprint 2026-05-24 |
| 0017 Patiktok | ⚙️ engineering-in-flight → ⚠️ partial | Setnayan-tier dual-TikTok flow shipped; Personal-tier still gated on TikTok app review |
| 0018 Setnayan Supplies | ⚙️ engineering-in-flight stayed (PR plan #1–#8 partial) | Awaits owner-side supplier onboarding chain per the 2026-05-19 pivot |
| 0021 Couple Dashboard | ✅ shipped → ✅ refreshed for Finder-column UX (2026-05-22 PR #367) → ✅ Today's Focus extracted to /today (PR #520) | Per-event localStorage isolation fix (PR #517) + cap-compare-at-2 (PR #515) closed customer-side bug-hunt findings |
| 0023 Admin Console | ⚠️ partial → ✅ 4 new surfaces shipped (PRs #419/#420/#421/#423) + Tier 1 follow-ups (refund + comp-grant + Setnayan Pay rate alignment PRs #429-#432) | Disputes · Pricing · Add-ons · Concierge Brain surfaces all read-only V1; admin payment-method config table extension for min_fee_centavos shipped |
| 0025 Profile Settings | ✅ shipped → ✅ hardened pre-pilot via PR #549 | .single() → .maybeSingle() canonical guard pattern applied; profile load now logs PGRST116 + future ADD-COLUMN drift as `graceful_degrade` |
| 0026 BIR Tax Compliance | ✅ stayed | OR generation + EWT + Form 2307 unchanged |
| 0028 Email Notifications | ✅ template count 9 → 10 (PR #288) | Notification routing held |
| 0034 Payments & Cart | ✅ Setnayan Pay flat 5.0% + ₱50 min floor + Vendor opt-in absorption | Migration `20260608000000_iteration_0023_setnayan_pay_rate_alignment.sql` shipped per PR #432 |
| **NEW** 0050 Paprint | spec proposal in CLAUDE.md 2026-05-23 row 6 (Card #33 Print outs integration) | Not yet a folder; engineering hold for post-pilot V1.x |

### Architectural locks that landed (CLAUDE.md decision-log rows — engineering pickup status noted)

1. **Today's Focus SKU model (2026-05-24 eighth row)** — supersedes 2026-05-17 Concierge `concierge_complete` ₱2,499 single-tier + 2026-05-18 row 1 Concierge AI Brain paid-tier-gating + 2026-05-22 row 3 CONCIERGE_ENABLED killswitch. New SKUs `todays_focus` ₱9,999 one-time per-event + `todays_focus_extension` ₱4,999 discounted re-up, 24mo cumulative-active pause-aware runtime, per-host `users.show_todays_focus_wizard` toggle for DIY parity. **🟡 Decision LOCK shipped to spec corpus; engineering migration NOT yet shipped.** Pilot-friendly because CONCIERGE_ENABLED=off for pilot per 2026-05-22 row 3, so the wizard surface is hidden during pilot — pilot couples interact with the schema reality (concierge_complete ₱2,499 SKU still active) via Your Plan grid + marketplace search only. Customer-facing copy on `/pricing` + `/for-vendors` + `/waitlist` + `/privacy` still markets "Setnayan Concierge ₱2,499" — consistent with schema. Owner decision pending: rename to Today's Focus before vs after pilot.
2. **Wizard 38 → 65 cards (2026-05-24 rows 9–12 + 2026-05-25 PR #544)** — canonical sequence ratified to 65 entries across 7 phases (setup · foundation · style_identity · programming · late_additions · legal · final_month · post_event); /today first-class route + first BottomNav tab shipped (PR #520); Wizard ⇔ Your Plan parity rule locked (2026-05-24 row 7) requiring shared event_vendors state across both surfaces.
3. **Vendor presentation pattern lock (2026-05-24 row 6)** — Pattern A Creations (multi-service vendors with portfolio cards · backed by `vendor_services`) vs Pattern B Locked (single-fixed-offering · single hero photo). Filter approach per pattern: region→city cascade · distance-from-Reception · reviews-first. 28 sub-categories assigned per pattern in Vendor_Taxonomy_V1_Master.md § 10. **🟡 Pattern A V1.1 multi-photo tile upgrade engineering pending.**
4. **5-tier recommendation priority ladder (2026-05-24 row 7)** — Tier 1 Venue-recommended → Tier 2 Already-locked-vendor's other services → Tier 3 Boosted → Tier 4 Top-rated → Tier 5 Closest-to-venue. Dedup rule. Tier-badge UI per tile. **🟡 Engineering pending across wizard cards + Your Plan grid + marketplace search.**
5. **Lock/delete/overlap architecture (2026-05-24 ninth row)** — soft-hold vs hard-lock semantics layered on existing `event_vendors.status` enum (contracted = soft hold, deposit_paid = hard lock); host-side cancel pre-downpayment; vendor-side release pre-downpayment; configurable max_soft_holds_per_date; auto-release on downpayment confirmation. **🟡 Schema migration + 5 PRs queued; PR A (pilot-critical host-side cancel) flagged for pre-pilot ship.**
6. **45 → 48 wizard cards alignment (2026-05-24 tenth row, PR #516)** — added coordinator + led_background + invitations_stationery cards to close the wizard ⇔ plan-grid orphan gap (3 plan groups had no wizard entry points). 65 total post-#544 after-party_music.
7. **OAuth providers Google + Facebook (2026-05-23 row 1, PR #422)** — Ships V1; Apple deferred until iOS app ships per the shared Apple Developer Program prereq chain.

### What shipped from the 13-item V1 wizard refinement bundle (CLAUDE.md 2026-05-24 seventh row)

| Item | Status |
|---|---|
| 1. Ceremony Venue distance filter (Card 03) | ✅ shipped (10km default + 15km stepper + nearest-fallback) |
| 2. Caterer venue-recommended integration | 🟡 V1 SCOPE FLAG (owner re-confirm before engineering) |
| 3. Mood Board sub-categories expansion | 🟡 V1.1 deferred |
| 4. Guest dress code confirmation | ✅ already locked per 2026-05-21 row |
| 5. Quick interview (Card 09 entry) 5-question intake | 🟡 V1.1 deferred |
| 6. Monogram quality polish | 🟡 owner visual audit pending |
| 7. Music DJ/Choir/Band separation | ✅ kept separated per existing canonical taxonomy |
| 8. Booths taxonomy expansion | ✅ shipped (Donut Wall #50a + Sorbetes Cart #50b + Food Cart Generic #50c added to Vendor_Taxonomy_V1_Master.md + migration `20260624000000`) |
| 9. Website Free vs Pro current state | ✅ documented (consistent with shipped) |
| 10. STD Video Card 17 inline behavior | ✅ shipped (₱199 OR upload your own) |
| 11. Send Invitation Free/Pro tiers (Camera Free 24 vs Pro 80+20) | 🟡 V1 SCOPE FLAG (pricing TBD) |
| 12. Accommodation distance filter | 🟡 follow-up PR pending post-merge of add-accommodation-card branch |
| 13. Bridal Car region filter | 🟡 V1.x (waits for Phase 5 wizard cards) |

### Major customer-side polish landings

- **Vendor hero photos pilot polish (PR #499)** — 1019 vendor_profiles + 39 venue_directory rows backfilled with Pexels CDN photos via migration `20260618000000`; renamed TEST-prefix marketplace rows to clean names; visible photos across every venue + vendor browse surface for pilot.
- **Wedding Attire Guide arc (PRs #449/#451/#453/#455 + PR #468 head-crop fix)** — Dress Codes pillar shipped with polished SVG silhouettes + 5 style themes + real Pexels stock photos + CSS tint-overlay recolor; migration `20260611000000` seeded 10 figure_attire library assets.
- **Seating catalog 13 entries (PR #312)** — canonical 13 table types per 2026-05-09 lock (Round 8/10/12 · Long banquet 6/8/10 · Family head 12/14/16 · Sweetheart 2 · Serpentine 6/12/18); enum drift from migration 20260513090000 fixed via enum-swap migration.
- **guest_role bride/groom enum (PR #313)** — added `bride` + `groom` enum values to production via migration 20260530020000.
- **Profile maybeSingle pilot hardening (PR #549, 2026-05-28)** — closes the .single() audit deferred from 2026-05-24 customer-side bug-hunt.

### Engineering DEFERRED — items locked in spec but not yet shipped (V1.x / post-pilot pickup queue)

1. **Today's Focus SKU migration** — schema additions (`events.todays_focus_*` columns + `users.show_todays_focus_wizard` + 2 service_catalog SKU rows) + activation/pause/resume logic + DIY toggle UI. Pilot-friendly to defer since CONCIERGE_ENABLED=off for pilot.
2. **5-tier recommendation ladder engineering** — sort + tier-badge + dedup logic across vendor-pick-grid-card.tsx + marketplace search.
3. **Package-inclusion auto-tagging** — event_vendors schema additions (`inclusion_source` + `parent_vendor_id` + `parent_package_id` + status enum 'included') + auto-population trigger.
4. **Lock/delete/overlap Rule 1 host-side cancel** — pilot-critical (Rule 1 of 5); Rules 2-5 acceptable to defer.
5. **Per-card hard-floor scheduler** — 45-card hard-floor table + scheduler algorithm that distributes cards into NOW · THIS WEEK · COMING WEEKS · NEAR WEDDING · POST-WEDDING buckets.
6. **Vendor Pattern A multi-photo tile upgrade (V1.1)** — 3-5 photo carousel from `vendor_services.primary_photo_r2_key`.
7. **Items 2, 11 of the 13-item bundle** — Caterer venue-recommended + Send Invitation Pro pricing both V1 SCOPE FLAGS pending owner confirmation.

### Pilot-readiness summary (pre-pilot pass 2026-05-28)

✅ /today route + Today first BottomNav tab + i18n shipped
✅ /add-ons 12-entry grid renders
✅ /vendors marketplace folder + religion + venue filter scoping
✅ /pricing has flat 5.0% + ₱100K worked example
✅ /privacy has 4 RA 10173 sections
✅ Setnayan Pay 5.0% bps + ₱50 min floor + BIR 0.5% withholding
✅ Wizard 65 cards shipped (Concierge OFF for pilot but DIY surface always works)
✅ Profile page hardened (PR #549 maybeSingle)
✅ Vendor hero photos backfilled across pilot surfaces (PR #499)
✅ Seating catalog 13 canonical entries (PR #312)
✅ guest_role bride/groom in production schema (PR #313)
🟡 Sentry prod smoke test → owner verification still pending per OWNER_ACTIONS Step Sentry.7
🟡 4 owner-side crypto-secret rotation pending per OWNER_ACTIONS punch-list #19f
🟡 Concierge → Today's Focus SKU rename — defer to post-pilot decision

**No pilot-blocking findings.** Pre-pilot smoke check + .single() audit + admin dashboard realignment all closed. The 4-day window through 2026-06-01 is calm engineering with owner-side action items remaining as the main critical path.

---

## 🚀 2026-05-22 autonomous 17-PR sprint — what changed

| PR | Iteration | Net effect |
|---|---|---|
| #272 | 0034 | service_catalog migration (price/feature corrections) |
| #273 | 0015 + 0018 brain + 0046 + Privacy Policy v1 | Public Editorial consent + Concierge Brain consent + Privacy Policy v1 lock |
| #274 | 0006 + 0046 | Vendor compare orphan redirect (no-entry → marketplace) |
| #275 | 0035 | `/api/health` + `/api/health/deep` endpoints |
| #276 | infra | CI lint guard for retired strings (Pareto / Custom Monogram Pack) + drift cleanup |
| #277 | 0034 | Payments idempotency column + unique index — race conditions sealed |
| #278 | 0015 | schema.org Pro pricing (`Offer` + `PriceSpecification`) |
| #279 | 0015 | Sitemap refresh — all live routes indexed |
| #280 | 0035 | Sentry prod smoke-test endpoint (`/api/admin/sentry-smoke-test`) — wired, owner verification pending |
| #281 | 0015 + 0017 + 0036 | Patiktok + Pakanta marketing surfaces on `/features` |
| #282 | 0015 + 0034 | Setnayan Pay worked example refresh + actor terminology sweep ("couple" → "customer/host" in marketing copy) |
| #284 | 0031 | Day-of guest experience PWA Phase 1 (offline shell + service-worker fallback) |
| #285 | 0023 | Admin nav refresh — Funnels + Force-majeure + Website editor flow consolidated |
| #286 | 0015 | Marketing chrome polish |
| #287 | 0021 | Couple dashboard TILES expansion (new entry points fix prior orphans) |
| #288 | 0028 + infra | Email links lint audit + 1 new template |
| #289 | 0035 | Observability typecheck — all server actions instrumented cleanly |

**Net effect on counts:** ✅ Shipped 24 → **26** (0031 fully ships + 0035 fully ships) · ⚠️ Partial 4 → **3** (0035 lifted) · ⛔ Blocked stays 0 · Cross-cutting "Sentry smoke test pending" → 🟡 endpoint wired, owner verification pending. See per-iteration table below for row-level flips.

---

## How to read this doc

`V1_Gap_Analysis_Status.md` answers "did we update the spec?". **This doc answers "did we ship the spec?"** Re-generated EOD 2026-05-14 after a 23-PR run.

- ✅ **Shipped** — spec scope is live in the app
- ⚠️ **Partial** — some scope is live; remainder still in flight or queued
- 🟡 **Not shipped** — spec exists, code doesn't (V1.5+ deferral or pending Phase 2/3)
- ⛔ **Blocked** — gated on an external dep
- 🚫 **Retired / superseded**
- ⚙️ **Engineering in flight** — worktree created + brief committed + fresh Claude Code session can pick up (added 2026-05-19 for parallel kickoff)

---

## Headline numbers (post 2026-05-28 pre-pilot pass · supersedes 2026-05-22 17-PR sprint count)

| Bucket | Count | Iterations |
|---|---|---|
| ✅ Shipped | **28** (+2 since 2026-05-22) | 0000, 0001, 0002, 0004, 0007, 0008, **0009** (2026-05-20), 0010, 0013, 0015 (refreshed 2026-05-22 via #278/#279/#281/#282/#286), 0016 → **renamed to Today's Focus in spec** (engineering 65 cards shipped + /today first-class route + first BottomNav tab via PR #520 · CONCIERGE_ENABLED off for pilot · Today's Focus SKU migration 🟡 deferred to owner decision), 0021 (TILES expanded 2026-05-22 via #287 · Finder-column UX via #367 · cap-compare-at-2 via #515 · per-event localStorage isolation via #517), 0023 (+ 4 new admin surfaces via PRs #419/#420/#421/#423 · Tier 1 follow-ups via PRs #429-#432 · nav refresh 2026-05-22 via #285), 0025 (+ Profile page maybeSingle hardening via PR #549), 0026, 0028 (+1 template 2026-05-22 via #288), 0029, 0030, **0031** (PWA Phase 1 via #284), 0033 (partial), 0034 (race conditions sealed via #277 · Setnayan Pay rate alignment + min fee floor via #432), **0035** (health endpoints #275 + smoke-test #280 + typecheck #289), 0037, **0043** (2026-05-20). 🆕 **0011 Panood + 0012 Papic + 0017 Patiktok lifted from engineering-in-flight to partial-V1**. |
| ⚠️ Partial / Phase 2 in flight | **6** (was 3) | 0006 · 0019 · 0022 (extended w/ 0043 compat editor 2026-05-20) · 0030 · 0033. 🆕 **0011 Panood** (BYO YouTube OAuth shipped via 2026-05-23 row 1 OAuth providers expansion · YouTube verified-app review still pending) · 🆕 **0012 Papic** (web-side capture + Drive transfer + Auto-Recap scaffolds shipped · native iOS/Android stays V1.5+) · 🆕 **0017 Patiktok** (Setnayan-tier shipped · Personal-tier gated on TikTok app review). |
| ⚙️ **Engineering in flight** | **2** (was 5) | **0005 Pailaw** (schema shipped 2026-05-20 via PR #150 — needs render pipeline + UI) · **0018 Setnayan Supplies** (schema + pricing resolver shipped 2026-05-19 — needs owner-side supplier onboarding + fulfillment flow). 0009 graduated to Shipped 2026-05-20; 0011 + 0012 + 0017 graduated to Partial-V1 across 2026-05-22 → 2026-05-25 wizard sprint. |
| 📐 V1.1 spec drafted (2026-05-19) | 6 | 0043, 0044, 0045, 0046, 0047, **0038** (0039 RETIRED same day — see Retired bucket below) |
| 📐 V1.1 vendor taxonomy master doc (2026-05-19) | 1 | `02_Specifications/Vendor_Taxonomy_V1_Master.md` — 192 sub-categories + 3 new booth entries 2026-05-24 (Donut Wall · Sorbetes Cart · Food Cart Generic) + § 10 Vendor presentation patterns (2026-05-24 row 6) + § 11 5-tier recommendation priority ladder (2026-05-24 row 7) · phased V1.1 → V1.5+ |
| 📐 V1.2 spec drafted (2026-05-19) | 2 | 0048 multi-moderator event access · 0049 multi-payer cart |
| 📐 V1.2 amendments to existing iterations (2026-05-19) | 5 | 0007 · 0019 · 0021 · 0028 · 0034 |
| 📐 **V1 architectural locks shipped to spec but engineering deferred** (2026-05-23 → 2026-05-28) | 7 | Today's Focus SKU model · Lock/delete/overlap 5-rule architecture · 5-tier recommendation ladder · Package-inclusion auto-tagging · Per-card hard-floor scheduler · Vendor Pattern A V1.1 multi-photo tile upgrade · Caterer venue-recommended integration (V1 SCOPE FLAG pending owner re-confirm) |
| ⛔ Blocked | 0 | — |
| 🚫 Retired | **6** | 0003, 0014, 0027, 0024 (folded into 0002 Phase 1 on 2026-05-16), 0039 (RETIRED 2026-05-19 — AdSense path blocked), **0032** (RETIRED 2026-05-18 — replaced by free dual e-sign on every vendor contract; migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql`) |

**Bold** = changed today.

---

## Per-iteration status (post 2026-05-14)

| # | Iteration | Status | What changed today (if any) |
|---|---|---|---|
| 0000 | App Shell & Navigation | ✅ Shipped | Bottom nav now reads "Add-ons" (PR #13); locale toggle (Phase 2 agent in flight). **Chrome drift FIX SHIPPED 2026-05-15**: PR [#67](https://github.com/iscasasola/setnayan-platform/pull/67) restored the per-couple monogram + caret event-switcher and collapsed the two-row top-nav into a single persistent strip; follow-ons [#99](https://github.com/iscasasola/setnayan-platform/pull/99) (persistent-switcher) and [#127](https://github.com/iscasasola/setnayan-platform/pull/127) (responsive-chrome-polish) hardened the implementation. The drift surfaced in `apps/web/app/dashboard/[eventId]/_components/event-switcher.tsx` + `apps/web/app/dashboard/_components/outer-dashboard-header.tsx` is resolved. (Original 2026-05-15 drift paragraph removed 2026-05-20; preserved in CLAUDE.md decision-log row 443 as audit trail.) |
| 0001 | Creating Guest List | ✅ Shipped | RSVP-received email + in-app notification (PR #20) |
| 0002 | QR Invitation System | ✅ Shipped | — |
| 0003 | Token Wallet (retired) | 🚫 — | — |
| 0004 | Invitation Widgets | ✅ Shipped (free tier; V1 paid upgrades reset 2026-05-16) | Pro tier still queued. V1 paid upgrades locked: **Monogram Hero ₱1,999 no-refund** (SVG-only · animated trace + custom video/photo background) + **Live Schedule ₱999**. Retired: `pro_widget_hero`/`pro_widget_story`/`pro_widget_bundle`. SKU code rename: `pro_widget_hero` → `monogram_hero_upgrade`. New schema fields on `hero_monogram` config_json. |
| 0005 | LED Background | ⚙️ Schema shipped 2026-05-20 (foundation only) | Migration `20260520010000_iteration_0005_led_background_foundation.sql` shipped via PR #150 — `led_background_configs` + renders tables. UI route `/dashboard/[eventId]/add-ons/led/page.tsx` shipped as scaffold. `lib/led-background.ts` shipped. Remaining: render pipeline + asset library + couple-side configurator UX. |
| 0006 | Vendors Management | ⚠️ Partial | `/vendors` placeholder shipped (PR #22); marketplace + reviews in Phase 2 agent (in flight) |
| 0007 | Budget & Expenses | ✅ Shipped | — |
| 0008 | Seating Chart Editor | ✅ Shipped | — |
| 0009 | Photo Delivery | ✅ Shipped (V1 — gated on #19g) | **Engineering-complete end-to-end as of 2026-05-20.** Foundation migrations 72 + 76, OAuth lib + routes shipped 2026-05-19/20 via PRs #147, #150, #152, #153. Six PRs landed 2026-05-20: [#163](https://github.com/iscasasola/setnayan-platform/pull/163) added the add-ons grid card (closing the orphan), [#166](https://github.com/iscasasola/setnayan-platform/pull/166) added the per-event `photo_delivery_sync_mode` column + UI picker (`manual_release` default / `auto_sync` opt-in, migration `20260521020000`), [#169](https://github.com/iscasasola/setnayan-platform/pull/169) rewrote the 517-line client-mock panel into a real server-component reading events.photo_delivery_* + photo_delivery_jobs with live progress polling + release + disconnect server actions. `lib/photo-delivery-release.ts` (539 lines) + 3 API routes (`/api/photo-delivery/release`, `/disconnect`, `/status`) already in place. **Owner action:** Google Drive verified-app submission (#19g) — gates couples-not-on-developer-account from clean OAuth. Without #19g, OAuth works only for `indaleciocasasolaii@gmail.com`. |
| 0010 | Mood Board | ✅ Shipped | — |
| 0011 | Panood | ⚙️ OAuth + cron + UI scaffolds shipped 2026-05-16; awaiting Google verified-app review | **SKU lock 2026-05-16** (see prior history below). YouTube OAuth code shipped 2026-05-16 via commit `20b21fc`: `lib/panood-youtube.ts` + 3 routes (`/api/oauth/youtube/start` + `/callback` + `/disconnect`) + `/api/cron/oauth-refresh` + UI scaffolds `/dashboard/[eventId]/add-ons/panood/{page,setup,broadcast,reviews}`. **Owner action:** YouTube verified-app submission Phase 2 still pending (#17a — privacy disclosure ✅ shipped PR #116, demo video pending owner). |
| 0012 | Papic | ⚙️ Schema + storage target + V1 SKU seed + Drive OAuth shipped 2026-05-19/20 | Migrations 55 (`events_papic_storage_target.sql`), 73 (`v1_sku_lock_papic_seat_packs.sql`), 75 (`iteration_0012_paparazzi_seats_photos.sql`) shipped via PRs #149 + #151. `lib/papic-drive.ts` + 3 OAuth routes (`/api/oauth/drive/start` + `/callback` + `/disconnect`) shipped. UI route `/dashboard/[eventId]/add-ons/papic/page.tsx` shipped as scaffold. **Architecture lock 2026-05-16** retained (see history below — 207-camera mesh, Drive transfer at T+30d, pooled credits, Auto-Recap). **Native iOS/Android still V1.5+** — web-side schema + Drive integration now landed. |
| 0013 | Platform Stack | ✅ Shipped | Caching foundation (PR #10) · R2 storage (PR #18) · Sentry + PostHog (PR #17, #19) · CI build gate (PR #15) |
| 0014 | V1.1 Polish | 🚫 No folder | — |
| 0015 | Main Website | ✅ Shipped (refreshed 2026-05-22) | Landing-page conversion upgrades — split CTA, trust signals, pricing table (PR #21). **2026-05-22:** schema.org Pro pricing added (#278), sitemap refresh covering all live routes (#279), `/features` extended with Patiktok + Pakanta marketing surfaces (#281), Setnayan Pay worked example refreshed + "couple" → "customer/host" actor terminology sweep across marketing copy (#282), marketing chrome polish (#286), Privacy Policy v1 lock with Public Editorial + Concierge Brain consent sections (#273). |
| 0016 | Step-by-Step Plan Builder (Setnayan Concierge) | ✅ Shipped + ⚙️ wizard architecture schema landed 2026-05-18 | Single SKU ₱4,999 wedding-anchored access locked 2026-05-17. Pricing migrations: `_concierge_pay_flat_and_charm` (2026-05-18) + `_concierge_repriced_to_2499` (2026-05-18 launch promo) + corrected back 2026-05-19. Wizard architecture schema (pgvector synthesis, migration 64 `iteration_0016_wizard_architecture_schema.sql`) landed 2026-05-18. `lib/concierge.ts` + `/dashboard/profile/concierge` route + `/admin/concierge-abuse` tab shipped. **2026-05-22:** Concierge Brain consent disclosure added to Privacy Policy (#273). |
| 0017 | Patiktok | ⚙️ Schema + OAuth + UI scaffolds + music refs shipped 2026-05-16 | Migrations 50-52 (`iteration_0017_patiktok.sql` + `_oauth.sql` + `_music.sql`) shipped. `lib/patiktok.ts` + `lib/patiktok-tiktok.ts` + 2 OAuth routes + internal worker route + UI routes (`/booth`, `/[templateId]`). **Owner action:** TikTok app review pending (#20f). SKU lock 2026-05-16 (see history below). |
| 0018 | Supplies Marketplace | ⚙️ Schema + pricing resolver shipped 2026-05-19 | Migrations 69 + 70 (`iteration_0018_supplies_foundation.sql` + `_pricing_resolver_fn.sql`) shipped via PRs #143 + #146. `lib/supplies/` subfolder shipped. UI route `/dashboard/[eventId]/add-ons/supplies-marketplace/page.tsx` shipped. PR #148 aligned UI copy with locked Setnayan-sourced resale model. Remaining: supplier vendor onboarding, order/fulfillment flow, couple-side cart integration. Surface stays behind "Coming to your area soon" empty state until supplier vendor agreements signed. |
| 0019 | Communications | ⚠️ Partial — chat + files shipped · video meetings RETIRED 2026-05-16 | Force-majeure flow + admin escalation in Phase 2 agent (in flight); **video meetings (Daily.co) RETIRED entirely from V1+ on 2026-05-16** — couples + vendors use external tools (Google Meet, Zoom, Messenger, WhatsApp). Chat + file attachments + in-app viewers + coordinator-join + force-majeure flow all retained. |
| 0020 | Interaction Prototype | n/a | Design artifact only |
| 0021 | Couple Dashboard | ✅ Shipped (TILES expanded 2026-05-22) | Day-of mode (PR #11) + event-day pre-load CTA (PR #12) + dispute entry placeholder (PR #22). **2026-05-22:** TILES grid expanded via PR #287 — new entry points cover prior orphan routes; reachability invariant restored. |
| 0022 | Vendor Dashboard | ⚠️ Partial | 5 new placeholder routes shipped (PR #22); services + bookings + team + earnings in Phase 2 agent (in flight). **Wedding compatibility tag editor added 2026-05-20 via PR [#172](https://github.com/iscasasola/setnayan-platform/pull/172)** — checkbox chip groups for ceremony types + venue settings on the vendor profile page, persisting `compatible_ceremony_types` + `compatible_venue_settings` columns introduced by migration `20260521000000` (0043). |
| 0023 | Admin Console | ✅ Shipped + 2 placeholders (nav refreshed 2026-05-22) | Funnels + Force-majeure tabs added (PR #22) — filled in by Phase 2 agent; Delete + Blacklist actions (PR #9). **2026-05-22:** Admin nav refreshed via PR #285 — Funnels + Force-majeure + Website editor entry points consolidated; consistent breadcrumb pattern across all surfaces. |
| 0024 | Save the Date | 🚫 Page-render SKU retired · 🟡 V1 ₱99 MP4 SKU (confirmed in V1 alongside 2026-05-18 V1.5+ promotion) | **Two 2026-05-16 changes:** (a) Original ₱99 page-render SKU retired (Phase 1 of landing page is free in 0002). (b) NEW Save-the-Date Video MP4 SKU reintroduced 2026-05-16 — explicitly distinct from retired SKU: input = 5-10 engagement photos · output = single 30-60s 1080×1920 vertical MP4 with Setnayan-owned music + closing-card landing-page URL · ₱99/render · multi-purchase · `save_the_date_video_render` SKU code. Drives traffic back to the free landing page via end-card. ~70% net margin under V1 tax tier. |
| 0025 | Profile Settings | ✅ Shipped | EN/TL locale toggle in Phase 2 agent (in flight) |
| 0026 | BIR Tax Compliance | ✅ Shipped | TIN auto-format (PR #5) |
| 0027 | E-signature | 🚫 V1.5 deferred (NOT promoted on 2026-05-18 — no iteration folder exists; needs separate folder-creation task before promotion) | — |
| 0028 | Email Notifications | ✅ **10/10 templates** (PR #288 added 1 more 2026-05-22 + CI link audit) | Welcome, chat_message, order_quoted, order_paid, payment_matched, payment_rejected, rsvp_received, help_ticket_replied, vendor_inquiry_received + 1 new template via #288. Force-majeure-filed notification type added 2026-05-17 (migration `20260517020000_notification_type_force_majeure_filed.sql`). **2026-05-22:** CI lint guard for email-link URL validity now blocks merges on broken links. |
| 0029 | Help Center | ✅ Shipped | — |
| 0030 | Guided Tour | ⚠️ Partial | Per-surface mini-tours still queued (not in current Phase 2 batch) |
| 0031 | Day-of Guest | ✅ Shipped — PWA Phase 1 landed 2026-05-22 via PR #284 | Banner + 6-card grid auto-activates T-1h to T+8h (PR #11). **2026-05-22:** PWA Phase 1 ships offline shell + service-worker fallback for weak-signal venues. 3 of 6 cards still stubs depending on 0009/0011/0012; offline shell renders cached state without breaking. |
| 0032 | Contract Intelligence | 🚫 **RETIRED 2026-05-18** | Migration `20260518200000_vendor_contracts_dual_esign_retire_0032.sql` flipped both SKU rows (`contract_intelligence_upgrade` couple-side ₱199 + vendor-side) to `is_active=FALSE`. Replaced by **free dual e-signature on every vendor contract** (no AI in V1) — vendor uploads contract PDF, picks event/couple, both parties sign with canvas-captured signatures, signatures stored as PNG image URLs in R2 with IP + UA + timestamp for evidentiary trail (RA 8792 compliant). Notary integration explicitly excluded by owner (PH Notarial Law jurisdiction restrictions). Anthropic API setup deferred to V1.5+ for 0011/0012 AI highlights only. Spec file `0032_contract_intelligence/0032_contract_intelligence.md` kept as reference for V1.5+ revival. |
| 0033 | Public API | ⚠️ Partial | `/health` + `/me` shipped earlier; Phase 2 agent in flight adds events/guests/vendors read-only |
| 0034 | Payments & Cart | ✅ Shipped (V1 manual reconciliation; race conditions sealed 2026-05-22) · 🟡 Setnayan Pay reprice + Maya Business pending V1.5+ | TIN format fix flows through receipts (PR #5). **2026-05-16:** Setnayan Pay convenience fee repriced 3% → flat **5.0%** on top of vendor price; Option B vendor absorbs gateway; BIR Marketplace Withholding 0.5% pass-through per RMC 8-2024; Maya Business as V1.5+ primary gateway. **2026-05-22:** service_catalog migration via #272 (price/feature corrections), payments idempotency column + unique index via #277 — race conditions on duplicate-submit / double-click checkout sealed at DB layer. Worked example refresh in marketing copy via #282. |
| 0035 | Observability | ✅ Shipped — end-to-end 2026-05-22 via PRs #275 + #280 + #289 | Sentry (PR #17) + PostHog 3-event funnel (PR #19); 4 more funnels go through PostHog Insights. **2026-05-22:** `/api/health` + `/api/health/deep` endpoints landed via #275 (Better Stack uptime can now ping); `/api/admin/sentry-smoke-test` endpoint landed via #280 (admin-gated controlled-error trigger — owner verification of email/Slack routing still pending); observability typecheck via #289 confirms all server actions are Sentry-instrumented cleanly. **End-to-end shipped.** |
| **0037** | **Event-Day Pre-load (NEW iteration)** | ✅ Shipped | Couple + vendor T-3d → T+1d "Prepare for event day" CTA + auto-prefetch T-24h → T+12h (PR #12). Spec drafted retroactively 2026-05-16 in `0037_event_day_preload/0037_event_day_preload.md` (renumbered from the originally proposed 0036 to avoid collision with `0036_pakanta`). |
| **0043** | **Wedding Type Picker** | ✅ Shipped (V1 — schema + picker + compatibility loop) | **End-to-end engineering complete 2026-05-20.** Migration `20260521000000_iteration_0043_wedding_type_picker.sql` adds events.ceremony_type + venue_setting + sub_type + is_mixed + secondary_ceremony_type columns + vendor_profiles.compatible_ceremony_types + compatible_venue_settings + wedding_type_launch_status + couple_wedding_type_notify_signups tables. UI: `WeddingTypePicker` component on /dashboard/create-event renders 2-axis picker with 2 active types (Catholic + Civil) + 4 Coming-Soon types (INC / Christian / Muslim / Cultural) with inline email-capture flowing to `couple_wedding_type_notify_signups` via `notifyWhenWeddingTypeLaunches` action. **Compatibility loop closed via [#170](https://github.com/iscasasola/setnayan-platform/pull/170)** (couple-side "Match my wedding" toggle on /vendors) + **[#172](https://github.com/iscasasola/setnayan-platform/pull/172)** (vendor-side compatibility tag editor on /vendor-dashboard) + **[#174](https://github.com/iscasasola/setnayan-platform/pull/174)** (compatibility badges on /v/[slug] public vendor profile). Next steps gated on vendor adoption: until vendors fill in their compatibility tags, columns stay NULL → "open to all" semantics keep the filter inclusive. |
| **0044** | **Per-Category Vendor Attribute Schemas** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | `canonical_service_schemas` + `shared_attribute_groups` (faith_compatibility, dietary_accommodations, geographic_service_areas, pricing_signal, vendor_credentials) + `vendor_service_attributes`. V1.1 launches schemas for 15 top canonical_services (catering with faith tags · photography · videography · bridal_gown_custom · band · host · coordinator · florals · stylist · photo_booth · mobile_bar · coffee_booth · officiant · transportation · wedding_cake); remaining ~100 sub-categories roll out V1.2+. |
| **0045** | **Vendor Product Catalogs** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | `vendor_products` table + per-product attribute schemas. ~20 of 115 canonical_services get product catalogs (consumables + portfolio types). Compound queries (attribute AND product) — "coffee booths with oat milk AND Spanish Latte". Snapshot pattern preserves cart line-item state. Setnayan first-party services (Pakanta, Pailaw, Custom Monogram, Save-the-Date Video) populate via same schema with SETNAYAN SERVICE badge. SEO at product-level URLs doubles SEO surface vs WedMeGood. |
| **0046** | **Wedding Showcase (Real Weddings)** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | Vendor-initiated → couple-approves → vendor-submits-3 → couple-picks-1 trigger flow. `wedding_showcases` + `wedding_showcase_vendor_credits` + `wedding_showcase_captures` + `wedding_showcase_product_credits` + `wedding_showcase_facets` tables. Faceted browse (City × Ceremony × Venue × Theme × Budget × Season) creates per-combination SEO landing pages. Vendor portfolio auto-populator + product "used at N weddings" badges close cold-start differently than WedMeGood's editorial team. Real budget brackets + day-of timeline are unique data WedMeGood lacks. |
| **0047** | **Style-Driven Vendor Marketplaces** (V1.1 NEW spec) | 📐 Spec drafted 2026-05-19 | 7 primary marketplaces sequenced V1.1.x with Stylist first (palette ΔE matching reuses 0010 engine, lowest engineering, visual demo). 5-column vendor mega-menu adopted from WedMeGood pattern. Stations & Booths as new category (30 sub-types in 5 groups — Food/Beverage / Sensory/Beauty / Visual/Keepsake / Skill/Craft / Interactive — PH-cocktail-hour culture has no WedMeGood equivalent). SETNAYAN SERVICE badge inserts (Papic / Panood / Pailaw / Patiktok / Pakanta / Concierge) as first-class marketplace listings — "Setnayan eats its own marketplace" pattern. Smart-default filtering by ceremony_type (INC couples auto-see inc_friendly caterers; Muslim couples auto-see halal vendors). |
| **0048** | **Multi-Moderator Event Access** (V1.2 NEW spec) | ⚙️ **Phase A foundation shipped 2026-05-19** | Migration 66 (`iteration_0048_event_moderators_foundation.sql`) shipped via PR #135 — `event_moderators` table + backfill + RLS helper. **NOT V1 launch** — today every event has exactly one owner; co-couple/parent/coordinator sharing arrives V1.2. Foundation laid early so future amendments to 0007/0019/0021/0028/0034 (per-payer budget, moderator-aware vendor chat, role-aware couple dashboard, moderator-aware notification routing, multi-payer cart) have schema to build against. |
| **0038** | **Editorial & Affiliates** (V1.1 NEW spec · traffic monetization) | 📐 Spec drafted 2026-05-19 | `setnayan.com/blog` (long-form articles, git-tracked MD pattern matching 0029 Help Center) + `setnayan.com/recommendations/[category]` (disclosed curated affiliate links · Involve Asia primary network — V1.1 owner action) + Sponsored Content (paid editorial features w/ unambiguous "Sponsored" badge · two-admin gate ≥₱100K per 0023 § 9.1). New tables: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`. PostHog `affiliate_link_clicked` event with no PII; postback endpoint `/api/affiliates/postback?network=:network` for conversion tracking. Newsletter sponsorship slot extends 0028 (single-sponsor per send). Cross-coordinates with 0022 Boosted Ads (vendor opt-out toggle) + 0039 AdSense (sponsored articles + sponsored newsletter slots are AdSense-excluded). |
| ~~**0039**~~ | ~~**Display Ads**~~ (V1.1 NEW spec · traffic monetization · activation-gated) | 🚫 RETIRED 2026-05-19 | **Retired same-day after the AdSense walkthrough surfaced that the owner's Google account is locked to AdSense-for-YouTube only — the YouTube channel went inactive, AdSense for YouTube auto-deactivated, and there's no AdSense-for-Content enrollment path forward from that account.** Three alternate URLs (`/adsense/signup`, `/adsense/new`, `adsense.google.com`) all routed back to the deactivation screen. Sidebar showed no Sites tab. Creating a fresh Google account would risk a permanent ban via Google's duplicate-AdSense identity checks (phone · payment · IP · beneficial owner) — not worth the gamble given the surface yield was already ~₱5-20K/mo vs Boosted Ads ~₱780K/yr per 20km vendor. Path A chosen (drop display ads entirely from V1.1; cookie-consent banner scope dropped since RA 10173 first-party PostHog opt-out is sufficient). 0039 spec file kept as a tombstone with the 🚫 RETIRED banner; engineering scope shrunk (no AdSense publisher console, no CSP changes, no `users.consent_state` JSONB, no `cookie_consent_events` / `adsense_activation_log` / `adsense_daily_revenue` tables, no `/cookie-preferences` route, no 0022 vendor opt-out toggle, no 0023 § 5.1 kill-switch, no 0028 `consent_updated` template, no 0029 "Cookies & ads" article). Decision log Ninth (originally tenth) 2026-05-19 row carries the full reasoning. |
| (n/a) | **Boosted Ads Activation Playbook** (NEW operations doc · traffic monetization) | ✅ Doc landed | `09_Operations/Boosted_Ads_Activation_Playbook.md` — owner-side outbound sales playbook for the existing-and-shipped Boosted Ads + Sponsored Boost program (0022 § 5b locked 2026-05-16). No engineering changes. Includes prospect-list SQL · in-app DM outreach template · 4 common objections + counters · 30-vendor launch promo `BOOSTED-LAUNCH-2026` 20% off month 1 cap 30 redemptions (engineering action: seed `promo_codes` row). Featured-vendor lookbook deliverable owed 2026-06-15. Weekly Monday review of new subs + cancels + top/bottom 5 click cohorts. |

---

## Cross-cutting infra

| Item | Status | Notes |
|---|---|---|
| **Caching & Offline Strategy** | ✅ Shipped | TanStack Query + idb-keyval persister + Workbox-equivalent service worker (PR #10) |
| **R2 Storage Migration** | ✅ Shipped | All new uploads go to R2; legacy Supabase Storage URLs still resolve (PR #18) |
| **Account lifecycle (Delete vs Blacklist)** | ✅ Shipped (code); migration owner-action pending | Replaces the soft-delete + ban model from PR #7. Owner must run `supabase db push` (PR #9) |
| **Persistent login (client-aware sessions)** | ✅ Shipped | 10-year cookie maxAge for Tauri + installed PWA; 1-year for web (PR #6) |
| **Services → Add-ons rename** | ✅ Shipped | 308 redirects from `/services/*` → `/add-ons/*` (PR #13) |
| **CI build job** | ✅ Shipped | `pnpm --filter @setnayan/web build` runs on every PR (PR #15) |
| **Vendor Verification flow (NEW 2026-05-16)** | 🟡 Spec locked · engineering pending | FREE initial / ₱1,499 annual renewal / ₱2,499 re-verification after demotion (charm-corrected 2026-05-17) · 12-document checklist (DTI / BIR 2303 / Mayor's Permit / gov ID via Persona/Veriff/Onfido / bank micro-deposit / portfolio + reverse image search / 3-5 references / live selfie + liveness / 15-min Google Meet / SMS OTP + email / social presence / AMLC sanctions) · all-or-nothing · 3-5 BD SLA · `setnayan-vendor-verification` R2 bucket (90d raw + 7yr audit). Schema migrations pending (vendors.verification_state + vendor_verification_applications + vendor_tier_history). |
| **All Tools Unlock bundle (NEW 2026-05-16)** | 🟡 Spec locked · SKU seed pending | ₱9,999/year · includes Mood Board + Palette + Seating + QR Reader + Advanced Pricing Tier · open to ALL paying vendors (NOT verified-only). vendor_tool_bundles table pending. |
| **Boosted Ads + Sponsored Boost ladder (NEW 2026-05-16 · charm-corrected + seeded 2026-05-17)** | 🟡 Spec locked · seeded in 0034 § (i) · engineering UI pending | Boosted Ads 5km ₱4,999/wk · 10km ₱7,999/wk · 20km ₱14,999/wk · Sponsored Boost Quarterly ₱249,999 / Annual ₱799,999 at 30km (verified-only). Replaces prior single ₱1,499/wk Sponsored Boost SKU (now `is_active=FALSE`). |
| **Vendor Payout model (NEW 2026-05-16)** | 🟡 Spec locked · engineering pending | Verified = immediate full payout T+1 (less gateway + BIR 0.5%); coming_soon = 3-stage milestone release 20/60/20 with T-14 + T+7 dispute windows. Demote-to-coming_soon trigger: 3+ disputes/30d. Setnayan absorbs ₱15-25 disbursement fee. vendor_payouts table + dispute counter cron pending. |

---

## 2026-05-15 PR Run — second-day shipping

After the 2026-05-14 PR run wrapped, a follow-on session on 2026-05-15 shipped 4 more PRs to main, with 4 more in flight. Spec-side: 6 new decision-log entries locked in `CLAUDE.md`.

| PR | Decision | What shipped |
|---|---|---|
| #52 | Decision 5 — UI Theme rebrand | iteration 0025 — burgundy default replacing terracotta (`#7A1F2B` accent) + new 5th theme "Forest & Champagne Gold" (`#2D4A3A` primary + `#C9A66B` gold); theme picker UI extended; idempotent enum migration |
| #55 | Decision 1 — Self-purchase confirm + self-review hard-gate | iterations 0006/0034/0023 — schema CHECK + `block_related_account_review()` BEFORE INSERT trigger blocking owner/team/payment/device/household self-reviews; cart self-purchase confirm modal (Pay full price / Comp for myself); admin moderation queue + appeal flow; new `user_devices` + `vendor_review_appeals` + `comp_grants` (stub) tables |
| #54 | Decision 3 — Public-stats exclusion + event-switcher role rows | iterations 0006/0022/0000 — `vendor_public_completed_events_stats` materialized view (filters team/internal/self-comp from public count) + `vendor_full_completed_events_stats` sibling; vendor dashboard "Completed events" card with public-vs-private toggle; event-switcher Shop/Admin console role rows; empty-state monogram split by role |
| #56 | Decision 6 — Vendor visibility + Website editor | iterations 0006/0015/0022/0023 — `vendors.public_visibility ENUM('hidden','coming_soon','verified','archived')` with `coming_soon` default + backfill of existing verified rows; DIY-browse "Verified only" toggle (OFF by default → coming-soon vendors visible with badge); `site_widgets` widget registry + `platform_availability` table; admin Website editor at `/admin/website` (8th admin surface) with native HTML5 drag-drop reorder; `/admin/verify` queue with status tabs + audit-logged actions |

**4 PRs in flight** as of this regen (background agents working in parallel worktrees):
- **PR #57** (Decision 4 homepage 12-section skeleton) — perf optimization agent running; lighthouse regression from 0.88 → 0.71 needs to return to ≥0.9 before merge
- **shared-chrome perf agent** — fixing main's lighthouse regression caused by PR #53 (shared SiteHeader) + PR #56 (admin chrome) bloat that dropped every route's lighthouse score
- **/for-vendors page agent** — full vendor-side landing per spec (Airbnb host page convention; outcome-led merchant framing per Shopify; pricing visible exception to homepage's hide-prices rule)
- **/features page agent** — feature deep-dive page (recipient of dropped Section 7 "Outsourcing, pacing, scheduling" content from Decision 4 homepage redesign)

**6 new decision-log entries today** (in CLAUDE.md): dual-role self-purchase/review gate · V1 platform expansion (5 native apps deferred V1.5) · dual-role public-stats exclusion · public-website wholesale redesign · UI theme rebrand · vendor visibility + widget editor.

**Status shifts (from 2026-05-14 baseline):**
- 0000 — chrome drift fix from Decision 7 (Roadmap doc) still pending; this PR run added Shop/Admin event-switcher rows
- 0006 — stays ⚠️ Partial (marketplace browse + reviews shipped; vendor-side admin moderation now wired via PR #55; full self-review gate live)
- 0015 — stays ✅ Shipped (12-section restructure in PR #57 still pending)
- 0022 — stays ⚠️ Partial (vendor dashboard public-stats card + public_visibility state machine added)
- 0023 — ✅ Shipped + 2 new surfaces (Website editor as 8th admin surface; Verify queue at `/admin/verify`); review-moderation queue from PR #55
- 0025 — ✅ Shipped (theme system extended to 5 themes — Setnayan Default Color burgundy + Forest & Champagne Gold)
- 0034 — ✅ Shipped (cart self-purchase confirm modal added)

**Owner-side blocker** (RESOLVED 2026-05-20 evening):
- ~~`supabase db push`~~ — ✅ **Verified caught up 2026-05-20 evening.** `supabase migration list --linked` against `setnayan-prod` (ref `njrupjnvkjkitfctetvi`) shows all 88 local migrations applied on remote, ending at `20260522010000_iteration_0041_couple_event_type_notify_signups.sql`. No pending migrations as of this verification. The earlier "10+ migrations pending" warning rolled forward across multiple PR runs and finally cleared today.

**Migration name-collision note:** Three of the 4 new migrations from 2026-05-15 each declare `CREATE TABLE IF NOT EXISTS admin_audit_log` with slightly different columns (PRs #54, #55, #56 each stubbed it independently). Two declare `CREATE TABLE IF NOT EXISTS comp_grants` similarly (#54, #55). All idempotent (`CREATE TABLE IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS`); union schema lands cleanly in any merge order. Worth eyeball when reviewing.

---

## Phase 2 — in flight as of EOD 2026-05-14

5 background agents are landing PRs in parallel. When this doc was regenerated, the 3 originally-spawned agents had opened their PRs and the 2 follow-up agents had just launched:

| Agent | What it ships |
|---|---|
| A | `/vendors` public marketplace + `vendor_reviews` schema + post-completion trigger + display on `/v/[slug]` + vendor-side review viewer |
| B | `/vendor-dashboard/services` editor + `/bookings` inbox + `/team` (4 roles) + `/earnings` rollup |
| C | `/admin/funnels` Supabase-side analytics + `/admin/force-majeure` queue + `force_majeure_flags` schema + couple-side `/dashboard/[eventId]/disputes` flag form |
| D | EN/TL locale toggle in `/dashboard/profile` + 2 new email templates (help_ticket_replied + vendor_inquiry_received) |
| F | Read-only `/api/v1/events`, `/api/v1/events/[id]/guests`, `/api/v1/vendors`, `/api/v1/vendors/[id]` |

Owner must run `supabase db push` once all Phase 2 PRs are merged — multiple new migrations land together (blacklist + reviews + force-majeure + team + services-pricing fields).

---

## Phase 3 — decision-gated (waiting on owner)

| Item | The decision |
|---|---|
| ~~Save-the-Date render pipeline~~ | **CLOSED 2026-05-16** — 0024 reframed, no render pipeline needed (free landing page Phase 1) |
| Panood live stream | Provision Cloudflare Stream Live + YouTube Data API + master channel |
| Marketplace commission model | Free / commission per booking / paid tier |
| Daily.co video meetings | Sign up, paste API key |
| ~~Anthropic Claude API (0032)~~ | ~~Sign up + spend cap~~ | **DEFERRED 2026-05-18 — 0032 RETIRED.** Replaced by free dual e-sign on every vendor contract (no AI in V1). Anthropic env + spend caps preserved in `.env.example` for V1.5+ 0011/0012 AI highlights activation, but **no owner action needed for V1 launch**. |
| Apple Developer Program | $99/yr enrollment (V1.0+ deferred per owner) |
| ~~Render pipeline infra~~ | **CLOSED 2026-05-16** — alongside item #6 closure; landing page is web tech only |

---

## Owner-side blockers (must act, no code can replace)

- ~~**`supabase db push`**~~ — ✅ **DONE 2026-05-20 evening.** Verified via `supabase migration list --linked`; all 88 local migrations applied on remote.
- **Sentry / PostHog smoke test** — trigger one prod error, sign up one fresh user
- **Resend signup smoke test** — confirm welcome email lands at non-account-holder Gmail
- **Cowork spec reconciliation** — `COWORK_INBOX.md` entries below

---

## Pending Cowork spec updates (from today's run)

The 2026-05-14 PR run added or changed several iterations. The spec corpus needs catch-up edits via Cowork:

1. **0037 Event-Day Pre-load** — ✅ DONE 2026-05-16. Iteration folder `0037_event_day_preload/0037_event_day_preload.md` created (renumbered from the originally proposed 0036 to avoid collision with the existing `0036_pakanta` iteration). Spec retroactively documents PR #12 — couple-side banner CTA (T-3d / T+1d) + silent auto-preload (T-24h / T+12h) + vendor-side per-thread CTA + RLS-gated bundle + service-worker asset warming.
2. **0023 Admin Console + 0025 Profile Settings** — update to reflect the Delete vs Blacklist redesign (PR #9). The old soft-delete + ban model from PR #7 is gone; spec text in `0023_admin_console.md` § 9.1 should be updated.
3. **0006 Vendors** — once the Phase 2 marketplace + reviews PR merges, update `0006_vendors_management.md` to reflect that the marketplace + review-stats materialized view are live.
4. **0019 Communications** — once the Phase 2 force-majeure PR merges, update `0019_communications.md` to reflect the actual schema + admin flow.
5. **Services → Add-ons rename** ✅ DONE 2026-05-16. Mechanical search-replace applied across all active iteration spec files (0000, 0005, 0009, 0010, 0011, 0012, 0015, 0020, 0021, 0030) + 02_Specifications/{00_Iteration_Connection_Map, Feature_Documentation_By_Role}.md + 01_Contracts/{Setnayan_Privacy_and_Security_Policy, Setnayan_Vendor_Agreement}.md + tests.md files + README.md. Couple-side route reference `/services` → `/add-ons` updated in 0021 § 2.2 nav table row 5. Historical references in `CLAUDE.md` decision log + `07_Archive/MIGRATION_AUDIT_2026-05-11.md` left intact (those are temporal records of the rename, not current-state docs). Vendor-side "My Services" terminology in 0022 stays untouched — it's a different concept (the vendor's own offerings).
6. **0035 Observability** ✅ DONE 2026-05-16. Row promoted in `V1_Gap_Analysis_Status.md` Tier 3 row #8 — expanded to include both 0023 funnel analytics (7 V1 funnels via Supabase) AND 0035 Observability (Sentry error tracking + PostHog 3 server-side funnels live + 4 more via PostHog Insights). Sentry prod smoke test remains pending — flagged in decision-log row 10 (2026-05-16) and bundled with the long-pole owner-admin sprint (items #17-20).

Owner: walk these via Cowork at convenience.

---

## How to re-generate this doc

1. List spec folders: `ls ~/Documents/Claude/Projects/Setnayan/ | grep -E '^[0-9]{4}_'`
2. Migrations on `main`: `git ls-tree -r origin/main supabase/migrations | awk '{print $4}'`
3. Routes: `git ls-tree -r origin/main apps/web/app | grep '/page\.tsx$' | awk '{print $4}'`
4. Cross-reference with [STATUS.md](https://github.com/iscasasola/setnayan-platform/blob/main/STATUS.md) + [HANDOFF.md](https://github.com/iscasasola/setnayan-platform/blob/main/HANDOFF.md).
5. Re-bucket every iteration. Update the table above.
