# Audit 2 — is the booking-fee source stamped correctly on every creator path

Read-only. Snapshot: origin/main (apps/web/app + components from the scratchpad archive; lib + migrations via `git show origin/main:`). Anchors are symbols, not line numbers.

## 0. The finding that reframes the question

**The fee does NOT read `event_vendors` at all. It reads `chat_threads.inquiry_source`.** There are two unrelated "source" axes:

| Axis | Column | Written by | Read by |
|---|---|---|---|
| FEE axis | `chat_threads.inquiry_source` (CHECK, 10 values; NULL = import) | `stampThreadProvenance` (service-role, only while the column is still NULL) | `booking_fee_attribution_for` -> `booking_fee_is_sourced_surface` |
| ANALYTICS axis | `event_vendors.source` (free text: host_manual, host_marketplace_search, vendor_invite, vendor_locked_qr, proposal_accept, reuse_accept, admin, NULL) | each `event_vendors` insert | `vendor_source_attribution()` (vendor My Performance "setnayan / off_platform / unattributed") |

Consequences:
- A creator that stamps only `event_vendors.source` and opens no thread stamps **nothing the fee can see** -> the booking is `import` -> `waived_import`.
- `host_manual` and `invite_claim` (named in the brief as import sources) are **not valid `inquiry_source` values**. The CHECK `chat_threads_inquiry_source_check` allows exactly: shortlist, first_pick, favorites, influencer, website, editorial, auto_build, degree, explore, search. Import is represented by NULL (or `website` / `degree`), never by a `host_manual` / `invite_claim` stamp.
- Migration `20271121904105_locked_qr_preserves_how_they_found_you` header says `event_vendors.source` "is the axis the whole free-vs-billable model turns on", then admits the fee reads the thread. The header is wrong about the fee; the fee turns on the thread.

## 1. Where the source is READ when the charge is minted

- Deciding function: **`public.booking_fee_open_lock_charge(p_event_vendor_id, p_schedule_version)`** — latest definition in migration `20271240512825_a_free_fee_window_waives_the_charge` (earlier: `20270927120000`, `20271009140000`, `20271009180000`, `20271218458148`; each a full CREATE OR REPLACE).
  - `v_attribution := public.booking_fee_attribution_for(v_ev.vpid, v_ev.event_id)` -> `EXISTS` a `chat_threads` row for (event_id, vendor_profile_id = ev.marketplace_vendor_id) where `booking_fee_is_sourced_surface(t.inquiry_source)`; else `'import'`.
  - Written to `booking_fee_ledger.attribution` on the FIRST insert for (vendor_profile_id, event_id) and **frozen** (the `ON CONFLICT DO UPDATE` never touches `attribution`). `import` -> a `booking_fee_charges` row with `status='waived_import'`, fee 0. Sourced -> free-5 / zero-fee / `waived_promo` window / `pending`.
  - Only caller path: `collectBookingFeeAtLock` (booking-fee-lock.server.ts) -> `admin.rpc('booking_fee_open_lock_charge')`, gated by `NEXT_PUBLIC_BOOKING_FEE_ENABLED` alone. Prod value of that flag: NOT READABLE from this session.
- CONFIRMED: it reads the stamped thread source and nothing else. `is_self_added`: **NOT FOUND** anywhere in migrations, lib or app. It does not read `event_vendors.source`, `event_vendors.is_*`, or `marketplace_vendor_id` provenance (it uses `marketplace_vendor_id` only to pick the vendor profile).
- Disclosure side (`resolveBookingFeeStanding`, booking-fee-disclosure.server.ts) calls the same SQL function over RPC — no TS re-implementation.
- TS `bookingFeeAttribution()` / `SOURCED_INQUIRY_SOURCES` has **no live charge-time reader**: the only consumer is the dormant proposal send-gate (`bookingFeeSendGate` -> `booking_fee_open_charge(p_attribution)`), which has no live caller (only comments in vendor-dashboard/proposals/actions.ts and proposal-send). If that gate is ever revived, TS decides the ledger's first-insert attribution, SQL decides after.

## 2. The two allowlists side by side

| Value | TS `SOURCED_INQUIRY_SOURCES` (lib/booking-fee-gate.ts) | SQL `booking_fee_is_sourced_surface` (mig 20271009140000, never redefined) | In CHECK / TS `INQUIRY_SOURCES` (lib/inquiry-source.ts) |
|---|---|---|---|
| explore | yes | yes | yes |
| search | yes | yes | yes |
| shortlist | yes | yes | yes |
| first_pick | yes | yes | yes |
| favorites | yes | yes | yes |
| auto_build | yes | yes | yes |
| editorial | yes | yes | yes |
| influencer | yes | yes | yes |
| website | no | no | yes (import) |
| degree | no | no | yes (import) |
| NULL | no | no (`IS NOT NULL` guard) | allowed (import) |
| host_manual / invite_claim | no | no | **NOT in CHECK** — cannot be stamped on a thread |

TS vs SQL: **identical, zero difference (8 = 8).** Held by `booking-fee-lock.db.test.ts` ("the SQL sourced-set and the TS SOURCED_INQUIRY_SOURCES agree exactly"). TS `INQUIRY_SOURCES` (10) equals the CHECK (10) exactly. SQL fail-safe verified: unknown or NULL -> not sourced -> import.

## 3. Creator table

Verdict key: OK · GAP (no source / null default on a path that can be sourced) · WRONG (sourced surface stamped as import, or the reverse) · DRIFT (here: the two source axes disagree; the TS/SQL lists never do).

### 3a. Thread creators (the fee axis)

| # | Creator (file:function) | Source stamped | In TS list / SQL mirror | Verdict | Note |
|---|---|---|---|---|---|
| T1 | app/v/[slug]/inquiry-actions.ts:startServiceInquiry (+ `stampThreadProvenance` in lib/inquiry-attribution.ts) | validated `ref_chapter` -> `influencer`; else caller-declared enum value except influencer/degree; else NULL. Only when `!isExisting` and only while column still NULL | all 8 sourced values are in both | OK | Declared value is client-supplied and not verified server-side (a hand-built `?src=explore` on a vendor's own link would bill it). Stamp failure is swallowed -> NULL -> import (fail-safe, silent). A previously *declined* thread with NULL is re-stamped on re-inquiry. |
| T2 | v/[slug]/_components/inquiry-composer.tsx + v/[slug]/page.tsx `?src=` mapping | `editorial`, `favorites`, `explore`, `search` from `?src`; `ref_chapter` -> influencer; else NULL | yes / yes | OK | `?src` and `ref_chapter` survive the bare-root `[slug]/page.tsx` forward. |
| T3 | dashboard/[eventId]/vendors/_actions/contact-shortlist-vendor.ts:contactShortlistVendor | `shortlist` (hard-coded) | yes / yes | **WRONG** | Looks up the `event_vendors` row only for `marketplace_vendor_id`, `service_id`, `category`; never checks `event_vendors.source`. Button gates (`plan-budget-accordion`, workspace page, `bench-vendor-actions`) test only "marketplace-connected + no thread". So a pick that arrived via `vendor_invite`, `vendor_locked_qr` or `reuse_accept` (the vendor brought the client, no thread yet) gets stamped `shortlist` the first time the couple taps Message -> billable. |
| T4 | same file: contactVendorProfile | `search` | yes / yes | OK | Only mounted via `FollowGate` in explore `vendor-card.tsx`. Its docblock says the public-profile "Message" button also uses it: **NOT FOUND** on /v/[slug]. |
| T5 | _components/vendor-packages/lock-modal.tsx ("ask the vendor about this build") -> startServiceInquiry | none (no `inquirySource`, no `referringChapterPublicId`) | n/a | **GAP** | Second inquiry door on the same /v page, but it drops the arrival tag. A couple who arrived via explore / editorial / favorites / chapter and uses this door is stamped NULL -> import. |
| T6 | app/dashboard/_components/pending-vendor-inquiry-dispatcher.tsx + v/[slug]/_components/anon-inquiry-composer.tsx + lib/pending-vendor-inquiry.ts | none (`PendingVendorInquiry` has no source / chapter field) | n/a | **GAP** | Compose-first flow for visitors with no event: `writePendingVendorInquiry` stores only vendor/service/message; the replay calls `startServiceInquiry` without a source. Arrival via `?src=explore` / `ref_chapter` is lost -> import, and the creator loses the "inquiry driven" credit too. |
| T7 | onboarding/wedding/actions.ts:commitOnboardingWedding -> unlockCategoryWithInquiry | `auto_build` | yes / yes | OK | Guarded `!user.is_anonymous`. |
| T8 | lib/pending-inquiries.ts:dispatchPendingInquiries -> unlockCategoryWithInquiry | `auto_build` | yes / yes | OK | |
| T9 | unlockCategoryWithInquiry default branch | `first_pick` | yes / yes | OK | **No live caller passes the default** (only the two `auto_build` callers exist), so `first_pick` is currently never written. |
| T10 | dashboard/[eventId]/messages/actions.ts:startThreadByVendorEmail | none (NULL) | n/a | OK | Couple types the shop's contact email = a client they already knew -> import, intended. |
| T11 | lib/vendor-invite-actions.ts:applyClaimAutoLink (thread upsert, `ignoreDuplicates`) | none (NULL) | n/a | OK | The invite/claim flow = import. `invite_claim` is not a stampable value; NULL is the representation. An existing sourced thread is preserved. |
| T12 | Editorial arrivals: blog `journal-partner-credit.tsx` (`ARRIVAL_TAG = 'editorial'`), `lib/a-tap-from-the-story.ts` (`STORY_TAP_SRC = 'editorial'`) | `editorial` via `?src` | yes / yes | OK | Subject to T5/T6 leaks. |
| T13 | Influencer: /u/[userSlug]/c/[chapterId] Book CTA -> `?ref_chapter` | `influencer` (server-validated; self-referral dropped) | yes / yes | OK | Subject to T5/T6. |
| T14 | Favorites: dashboard/(account)/library `saved-vendor-card.tsx` -> `?src=favorites` | `favorites` | yes / yes | OK | |
| T15 | degree / samahan / circle | never stamped | no / no | NOT FOUND | Enum + label only; server explicitly rejects a client-supplied `degree`. Unwired by design. |
| T16 | Admin tools, coordinator seats | NOT FOUND | | NOT FOUND | `admin/vendors/actions.ts` writes `vendor_invites`; coordinator seats are `event_moderators`. Neither creates `event_vendors` or `chat_threads`. |

### 3b. `event_vendors` creators (analytics axis; the fee cannot see these unless a thread exists)

| # | Creator (file:function / SQL fn) | `event_vendors.source` stamped | Thread opened? | Verdict | Note |
|---|---|---|---|---|---|
| E1 | startServiceInquiry (the `evRow` insert branch) | none (NULL) | yes (T1) | DRIFT | Thread may say `explore`, row says NULL -> My Performance "unattributed". Fee unaffected. |
| E2 | unlockCategoryWithInquiry (insert `considering`) | none (NULL) | yes (T7-T9) | DRIFT | Same: thread `auto_build`, row NULL. |
| E3 | (shell)/explore/actions.ts:saveVendorToPicks | `host_manual` | no | **WRONG** | An Explore / category-search save is a marketplace discovery but labelled `host_manual`, which `vendor_source_attribution()` buckets `off_platform`. Also leaves the fee axis empty (see E4). |
| E4 | vendors/actions.ts:attachMarketplaceVendorToCategory (also `buildFirstVenueShortlist` in progress/_actions/free-venue-shortlist.ts, and the Add-a-contact modal's name-search link) | `host_marketplace_search` | no | **GAP** | Right label, but no thread. Find -> save -> lock with no in-app thread: the lock path reads existing threads and never creates one -> `booking_fee_attribution_for` = import -> `waived_import`. Largest leak. |
| E5 | vendors/actions.ts:attachManualVendorToCategory (via addManualSupplier) | `host_manual` | no | OK | Typed-in vendor = import. |
| E6 | dashboard/[eventId]/wizard-actions.ts:completeVendorPickFromMarketplace ("Lock this vendor" on a top-5 recommendation) | none (NULL) | no | **GAP** | Recommendation surface, inserts a `contracted` marketplace row with no source and no thread -> import. (Lock handshake may make it `considering`.) |
| E7 | wizard-actions.ts:completeVendorPickFromCustom | none (NULL) | no | OK | Custom off-platform supplier = import. Analytics shows "unattributed" (cosmetic). |
| E8 | vendors/packages/actions.ts (lockPackage `event_vendors` anchor + covered rows) | none (NULL) | no | **GAP** | A package booked from a /v page reached via explore / editorial stamps no source and opens no thread -> import. |
| E9 | budget/cost-actions.ts:recordWithSupplier | `host_manual` | no | OK | Off-platform cost with a named supplier. |
| E10 | onboarding/wedding/actions.ts:commitOnboardingWedding — `shortlistRows` (marketplace venues from the venue picker) | `host_manual` | no | **WRONG** | Marketplace-discovered venues stamped `host_manual`; also no thread. Same pattern as E3. |
| E11 | commitOnboardingWedding — `ownVenueRows`, `byoRows` | `host_manual` | no | OK | Own / BYO venues and suppliers = import. |
| E12 | lib/vendor-couple-invite.ts:importVendorToEventShortlist | `vendor_invite` | no | OK | Vendor's own link = import. (Analytics shows "unattributed"; and see T3 for the later Message tap.) |
| E13 | lib/reusable-bookings.server.ts:acceptReuseRequest | `reuse_accept` | no | **GAP** | Docs (`lib/reusable-bookings.ts`) say "a NEW lock = a NEW fee", but the new (vendor, target event) pair has no thread -> import -> waived. Flag-dark: `NEXT_PUBLIC_REUSABLE_BOOKINGS_ENABLED` (prod value NOT READABLE). |
| E14 | SQL `respond_vendor_proposal` (latest `20270227551916`) | `proposal_accept` | proposal lives on a thread | OK | Attribution comes from that thread's stamp. |
| E15 | SQL `vendor_claim_locked_qr` (latest `20271174880981`) | `vendor_locked_qr` (INSERT only; UPDATE keeps prior via COALESCE) | no | OK | Vendor-brought = import; if the couple had already found the vendor via a sourced thread, the thread keeps it sourced. |
| E16 | Seed/demo: scripts/seed-inquiry.sql, `20270405784887_seed_founder_vendor_demo_stats` | NULL | demo | n/a | Demo data. |
| E17 | Coordinator proposals, `createManualVendorInvite` | NOT FOUND | | NOT FOUND | Neither inserts `event_vendors`/`chat_threads` (`createManualVendorInvite` writes `vendor_invites` only). |
| E18 | `auto_cascade_from_finalize`, `admin` | NOT FOUND stampers | | NOT FOUND | Historical analytics values; no live writer. |

## 4. Totals

**29 verdict rows: 18 OK · 6 GAP · 3 WRONG · 2 DRIFT** (DRIFT here = the two source axes disagree; **TS-vs-SQL allowlist DRIFT: 0**). Plus NOT FOUND / n/a: degree, admin, coordinator, `is_self_added`, `auto_cascade_from_finalize` writers, seeds.
(Rows: T1-T14 = 14 → 11 OK, 2 GAP, 1 WRONG; E1-E15 = 15 → 7 OK, 4 GAP, 2 WRONG, 2 DRIFT.)

## 5. GAP / WRONG / DRIFT list with one-line fixes

1. **T3 WRONG** `contactShortlistVendor` stamps `shortlist` on a vendor-brought row. Fix: read `event_vendors.source` and, if in {`vendor_invite`,`vendor_locked_qr`,`reuse_accept`,`host_manual`-with-own-link}, pass `inquirySource: null`; or have the pick's creator stamp the thread.
2. **T5 GAP** lock-modal "ask instead". Fix: thread `inquirySource` + `referringChapterPublicId` from the page's `?src`/`ref_chapter` into the modal props (or default to `shortlist` when mounted in the dashboard).
3. **T6 GAP** compose-first anon inquiry drops `src` and `ref_chapter`. Fix: add `inquirySource` and `referringChapterPublicId` to `PendingVendorInquiry` and replay them in the dispatcher.
4. **E4 GAP** marketplace save/attach leaves no thread, so find -> save -> lock is free. Fix: at lock time (or save time) stamp/open a thread with `search`/`explore`, or make `booking_fee_attribution_for` also accept `event_vendors.source = 'host_marketplace_search'` as a sourced signal (owner decision: this is a policy change).
5. **E6 GAP** wizard "Lock this vendor" on a recommendation: stamp no thread. Fix: open the thread with `first_pick`/`auto_build` in `completeVendorPickFromMarketplace`.
6. **E8 GAP** `lockPackage` books with no thread/source. Fix: open the thread (carrying the arrival tag) before/at the package lock.
7. **E13 GAP** reuse accept mints a new pair with no thread, contradicting "new lock = new fee". Fix: have `acceptReuseRequest` open a thread stamped with the original sourced value (or an owner-decided `returning` rule).
8. **E3 / E10 WRONG** `event_vendors.source='host_manual'` on marketplace-discovered picks (Explore save, onboarding venue shortlist). Fix: stamp `host_marketplace_search`.
9. **E1 / E2 DRIFT** inquiry-created `event_vendors` rows carry NULL source while the thread is sourced. Fix: stamp `host_marketplace_search` on those rows too (or retire the analytics axis in favor of the thread).
10. **Doc drift**: migration `20271121904105` header + brief list `host_manual`/`invite_claim` as inquiry sources; they are not in the CHECK. Fix: state "import = NULL / website / degree" in the SQL function comment and `booking-fee-gate.ts`.
11. **Low risk, T1**: client-declared `inquirySource` is unverified. Fix: verify `explore`/`search`/`editorial` only from a server-read referrer or signed param.
12. **Dormant**: `booking_fee_open_charge(p_attribution)` takes attribution from TS; if the send-gate is revived, derive it from `booking_fee_attribution_for` instead.
