# Admin audit: step 5, "Admin fixes" (2026-09-30)

**Verdict: the admin console isn't broken, but it lies when a read fails.**

- **Links:** every menu link, every old address and every `?tab=` resolves. There is one dead link.
- **Failed reads:** about 35 pages still show a failed read as "all clear", "₱0", "none" or a blank form.
- **Silent overwrites:** on six of those, pressing Save writes the blanks over the real values: bank details, compliance facts, platform settings, event-type profile, budget config and music tracks.
- **Missing workflows:** reopen a guest list, see a guest's face-tagging state, open an event, and record a payment that never got logged.

**Source:** code read only, from a fresh detached worktree of `origin/main` at `15df3c142` (#6206). No browser, no writes.

**Production reads:** one read-only prod query, on `platform_retail_catalog_v2`.

**How to re-check any row:** `grep -n '<symbol>' apps/web/<path>`. Rows cite a symbol, never a line number.

---

## 0. The 113 admin pages (`find apps/web/app/admin -name page.tsx`)

- **Real pages (60):**
  - Money: overview · work · account-deletions · accounts · app-performance · approvals · background-videos · booking-fees · budget-planner · chat-flags · completions
  - Compliance and content: compliance/data-sheet · concierge-abuse · corrections · data-privacy · demand · demo-vendors/inquiries · directory · discount-codes/new · disputes · editorial-review · event-deletions
  - Trust and money: force-majeure · founder-seats · fraud · gifts · help · integrations · integrity-watch · live-studio-channels · money · moodboard-renders · more · pakanta · papic-storage · pax-changes · payment-options · payments · payouts · pricing · receipts · repost-watch · reviews
  - System: search-memory · secrets · settings · settings/payment-methods · studio · subscriptions · taxonomy · taxonomy/aliases · ugat · ugat/map · user-reports · vendor-partnerships · vendor-recommendations · venues/new · verification-docs · verify · website-media
- **Detail pages (12):**
  - `users/[userId]` · `vendors/[id]/{edit,plan,team}` · `venues/[id]`
  - `discount-codes/[id]/edit` · `editorial-review/[id]` · `force-majeure/[flagId]`
  - `demo-vendors/inquiries/[threadId]` · `event-types/[type]/{categories,onboarding,profile}`
- **Redirects into a hub (41):**
  - Studio: songs · website · recaps · patiktok · referrals · social-queue · …
  - Settings: compliance · notifications · demo-mode
  - Numbers (`app-performance`): funnels · growth · seo · offline · connection-logs · operations-hiring · intelligence · insights
  - Ugat: brain · menus · onboarding · wedding-traditions
  - Accounts: users · vendors · events · venues · demo-vendors
  - Pricing: addons · custom-plans · price-bands
  - Taxonomy: event-types · refinements · wedding-types
  - Other: queues → work · npc-readiness → data-privacy
  - Full list: `apps/web/lib/admin-map/admin-routes.generated.ts`
- **Results of the checks:**
  - All 83 menu links resolve to a page.
  - Every page outside the menu is linked from somewhere.
  - Every redirect passes on the `?error=`, `?saved=` and notice parameters its actions send back.
  - Every `?tab=` value, from the menu and from the redirects, is handled by its hub. An unknown value quietly shows the hub's default tab.

## 1. Findings

Severity: **blocks** = the owner can lose money or data, or act on a false "all clear" · **should** = real harm or a missing workflow · **polish** = wording and developer text. Paths are under `apps/web/`.

| # | page | issue | evidence (file · symbol) | fix | severity |
|---|---|---|---|---|---|
| 1 | Payments | The main list ignores its read error. A failed read shows **"Nothing to reconcile."**, which looks exactly like an empty queue. This is where the new payment email lands. | `app/admin/payments/page.tsx` · `const { data } = await paymentsQuery;` → `(data ?? [])` | Keep the error and show "Couldn't read payments". | blocks |
| 2 | Payments `?q=` | The order lookup behind `q` ignores its error and quietly falls back to bank reference only. The order id from the email then finds nothing, and the page says "Nothing to reconcile." | `payments/page.tsx` · `const { data: hits } = await admin` (`public_id.ilike`) | On error, say the search failed; don't fall back. | blocks |
| 3 | Settings › Payment methods (and Settings › Settings) | If the settings read fails it returns built-in defaults: blank BDO/GCash details, business name "Setnayan", "last updated 1970". There's no warning, and **Save writes the blanks over the real bank details.** | `lib/platform-settings.ts` · `return FALLBACK`; `app/admin/settings/actions.ts` · `savePaymentInstruments` `nullIfBlank(` | Return an "unread" state, show a warning and disable Save. | blocks |
| 4 | Settings › Compliance | Compliance facts (DPO, TIN, NPC number) are read without an error check. A failure opens a blank form, and Save overwrites the real values. | `settings/_surfaces/compliance-surface.tsx` · `toFormState(factsRes.data` (`factsRes.error` never checked) | On error, show it and hide Save. | blocks |
| 5 | Work (the main worklist) | If the queue counts can't be read, each count becomes 0 and the page prints **"All queues clear."** | `app/admin/work/page.tsx` · `Math.max(0, row.count ?? 0)` → `queues-triage-feed.tsx` "All queues clear." | Say "N queues couldn't be read" and never show the all-clear. | blocks |
| 6 | Subscriptions | Both reads ignore their errors. A failure shows the **"0 pending"** badge and "No pending subscription orders." | `app/admin/subscriptions/page.tsx` · `pendingRes.data ?? []` | Check `.error` and show a "couldn't read" state. | blocks |
| 7 | Music Maker queue | The orders read logs its error but never sets `queryError`. Paid orders disappear, and the page says "No Music Maker orders yet." | `app/admin/pakanta/page.tsx` · `if (orderErr) { logQueryError(` (no `queryError =`) | Set `queryError` for this read too. | blocks |
| 8 | Studio › Social queue | A failed take-downs read shows "No take-downs pending", on a list with a 24-hour legal clock. The Failed and Scheduled lists do the same. | `studio/_surfaces/social-queue-surface.tsx` · `(takedownData ?? [])` | Give each section its own load-failed flag. | blocks |
| 9 | Numbers › Connection logs | Both reads drop their errors, so a failure shows "All clear — No active faults right now." | `app-performance/_surfaces/connection-logs-surface.tsx` · `const [{ data: activeData }, { data: resolvedData }]` | Keep both errors and suppress the all-clear. | blocks |
| 10 | User card | The orders, payments and refunds reads drop `error`. A paying customer shows "No orders placed." / "No payments logged." | `app/admin/users/[userId]/page.tsx` · `const { data: orders }`, `{ data: payments }`, `{ data: refunds }` | Destructure `error` and render "couldn't read". | blocks |
| 11 | Verify | The shop-details read drops `error`. Every card becomes "Unnamed vendor", and the automated checks run on blanks, so they flag mismatches on a legitimate shop. | `app/admin/verify/page.tsx` · `const { data: vendorData } = await admin` | On failure, say "shop details couldn't load" and skip the checks. | blocks |
| 12 | Force majeure (detail) | A failed evidence signing shows "No evidence attached." on a dispute the owner is judging. Change orders show "No change orders" when their read fails. | `app/admin/force-majeure/[flagId]/page.tsx` · `displayUrlsForPrivateStoredAssets(` `.catch(() => [] as string[])` | Use `null` for "couldn't load" and compare against `row.evidence_urls.length`. | blocks |
| 13 | Payments | After a shortfall or duplicate on approve, the redirect drops `q`. Arriving from the email, the owner loses the row he was confirming. | `payments/actions.ts` · `approvePayment` → `redirect(\`/admin/payments?filter=all&notice=` | Carry `q` into the redirect. | should |
| 14 | Payments | "Orders needing a quote" ignores its error, so a failure shows "No orders waiting for a quote." When `q` matches nothing, the page says "Nothing to reconcile." rather than that nothing matched. | `payments/page.tsx` · `filter === 'orders_needing_quote'` `(data ?? [])`; `PaymentsList` empty branch | Keep the error; when `q` is set, say "No payment matches X". | should |
| 15 | Payments / orders | There's no way to record a payment that arrived but was never logged; the inbox matcher only matches existing rows. There's also no admin order page. `/admin/money` lists orders with no search and no link to confirm. | `payments/actions.ts` (no payments insert); `money/_components/transactions-ledger.tsx` columns | Add "Record a payment received" on the order; ledger rows link to `/admin/payments?filter=all&q=<public_id>`. | should |
| 16 | Money ledger | The buyer, payment and receipt side reads drop errors. The "ours" test-purchase badge then vanishes, so **our own test purchases look like real revenue.** | `money/_components/transactions-ledger.tsx` · `const [{ data: buyers }, { data: paid }, { data: receipts }] = await Promise.all` | Keep each error and mark that column "couldn't read". | should |
| 17 | Booking fees | Failed order and payment reads show every charge as **"Never billed"**. "Check their payment" opens the unfiltered payments desk. | `app/admin/booking-fees/page.tsx` · `const { data: orders }`, `const { data: pays }`, `href="/admin/payments"` | Show "status unknown" on failure; deep-link with `?filter=all&q=`. | should |
| 18 | Payouts | After an error, the tiles show ₱0 and "No payouts match" sits under the error. The supplier filter is a raw "UUID" box. The Overview tiles call payouts live ("T+1 schedule"), but the menu calls it a closed trail. | `app/admin/payouts/page.tsx` · `const rows = (data ?? [])`, `placeholder="UUID"`; `app/admin/page.tsx` · `queueTile('payouts'` | Show "—" on error and use a supplier-name picker; reword the tiles as a closed history. | should |
| 19 | Payment options / Founder seats / Pricing › Free windows | A failed read shows an empty or all-clear state: "every payment method is approved", every seat "Empty — fill later", "No free windows yet" (which invites a second live freebie). | `payment-options/page.tsx` · `(data ?? [])`; `founder-seats/page.tsx` · `const { data } = await admin.from('founder_seats')`; `free-windows-surface.tsx` · `(data ?? []) as PromoRow[]` | Branch on `error` before the empty state. | should |
| 20 | Pricing › Papic ladder / Custom plans | If the limits read fails, the form shows floor 0 / ceiling 0, and Save writes 0/0. If the custom unit prices fail to load, quotes quietly use prices from code. | `papic-ladder-surface.tsx` · `clamps.get(r.config_key)?.floor ?? 0`; `lib/vendor-custom-catalog.ts` · `fetchCustomUnitPrices` | Keep unread values as null and disable Save; label quotes "not the live catalogue" when the fallback is used. | should |
| 21 | Discount codes (edit) | Covered services the form couldn't load are **silently dropped on save**. With the Live Studio launch switch off, you can't make a code for `LIVE_STUDIO` at all. Every non-monthly supplier item is labelled "Vendor tokens", though tokens are retired. | `discount-codes/[id]/edit/page.tsx` · `fetchV2CustomerCatalog()`; `lib/v2-catalog.ts` · `.neq('service_code', 'LIVE_STUDIO')`; `: 'Vendor tokens'` | Show unknown covered services as locked checked rows; give the admin its own catalogue read; label from `offering_type`. | should |
| 22 | Pricing catalogue | Supplier-plan names show "{title} — migration-owned, edit in code" (developer text) and **can't be renamed**, because `saveVendorRow` writes price, description and active only. Customer items can be renamed (see §2c). | `pricing/_components/catalog-editor.tsx` · `migration-owned, edit in code`; `pricing/actions.ts` · `saveVendorRow` | Add `title` to `saveVendorRow` and its form. | should |
| 23 | Accounts › Events · face tagging | The switch shows "On" from `papic_face_mode` alone. It ignores `face_tagging_declined_by_couple`, which is the final word, so it says On when nothing runs. A failed write logs and returns: no message, no row check, and the switch just doesn't flip. | `accounts/_surfaces/events-surface.tsx` · `e.papic_face_mode === 'mode_a' ? 'On' : 'Off'`; `app/admin/events/actions.ts` · `setEventFaceMode` `logQueryError('setEventFaceMode'` → `return;` | Read the decline column ("On · couple declined"); `.select()` the updated row and redirect with `?error=` / `?saved=`. | should |
| 24 | Accounts › Events | The guest count reads raw rows for 200 events with no paging and hits the 1,000-row cap, so it quietly under-counts guests. Rows link nowhere, because there's no event detail page. | `events-surface.tsx` · `.from('guests').select('event_id').in('event_id', eventIds)` | Count per event; add an event detail view (see §3). | should |
| 25 | Accounts › Vendors | The unclaimed list (limit 50) doesn't exclude demo shops, so seeded demo shops push real unclaimed shops out. | `accounts/_surfaces/vendors-surface.tsx` · `.is('user_id', null)` + `UNCLAIMED_ROW_LIMIT` | Add `.eq('is_demo', false)`. | should |
| 26 | Integrity watch / Repost watch | "Open vendor →" goes to `/edit`, which redirects every **claimed** shop to the unfiltered list. The shop is lost, and there's no detail page for a claimed supplier. | `integrity-watch/page.tsx` · `` href={`/admin/vendors/${r.subject_vendor_id}/edit`} ``; `vendors/[vendorProfileId]/edit/page.tsx` · `if (profile.user_id) { redirect('/admin/vendors')` | Link to `/admin/accounts?tab=vendors&q=<public_id>` for now. | should |
| 27 | User card (other sections) | Nine more reads drop `error`: events, supplier team, help, disputes, reports, AI-abuse, access log and admin actions ("Not a member of any event yet."). The profile read gives a **404 for a real account** if it fails. | `users/[userId]/page.tsx` · `{ data: memberships }` … `if (!user) notFound()` | Same pattern; show an error page, not `notFound`. | should |
| 28 | Reviews / Corrections / Concierge abuse / Completions | Failed reads show "No pending fake-review flags", "No correction requests", or "queue is clear" with 0/0. A failed date lookup in Completions drops every overdue row. | `reviews/page.tsx` · `{ data: fakeFlagData }`; `lib/vendor-corrections.ts` · `if (error \|\| !data) return []`; `concierge-abuse/page.tsx` · `pendingFlagsRes.data ?? []`; `completions/page.tsx` · `{ data: eventData }` | Return null on error and render "unmeasured". | should |
| 29 | Chat flags · Integrity · Repost · User reports · Live channels · Verify | The error message and the empty state ("No flags in this view.") render together and contradict each other. | e.g. `chat-flags/page.tsx` · `{listError && (` then `{rows.length === 0 ? (` | Show the empty state only when there's no error (as Completions already does). | should |
| 30 | User reports / Demo inquiry thread / Celebration removals | A failed lookup says "Chapter no longer exists" (false) or gives a 404 on a real demo thread. "Nothing yet." hides a failed history read, and the card doesn't show which bill is blocking the removal. | `user-reports/page.tsx` · `{ data: chapterData }`; `demo-vendors/inquiries/[threadId]/page.tsx` · `{ data: vendorRaw }`; `event-deletions/page.tsx` · `{ data: recentRows }` | Destructure errors; show the blocking bill with a link. | should |
| 31 | Account deletions | The request is marked approved before the erasure runs (deliberately). If the erasure fails, `loadPendingRequest` only accepts `pending`, so this page can't retry it. `erasure_step_failed` isn't shown by any admin page. The confirm text says "hard-deletes… cascade-deletes", but `lib/erasure/purge.ts` no longer works that way. | `account-deletions/actions.ts` · `approveRequest` "Mark approved before the cascade" | Add "Run erasure again" for approved-but-still-present accounts; fix the confirm text. | should |
| 32 | Data privacy › Controls / Checklist · NPC data sheet | A failed read shows every control "Off" and the checklist "0 of N". A failed count is added as 0 to "Total data subjects (live)". | `lib/data-privacy-controls.ts` · `fetchDataPrivacyControls` `data ?? []`; `compliance/data-sheet/page.tsx` · `(users ?? 0) + (guests ?? 0)` | Show "couldn't read" / "couldn't count" (the Deletions tab already does). | should |
| 33 | Overview | If the queue digest throws, the headline says "0 items need you" and "0% queues cleared", with only a grey "some counts unavailable". A failed activity read shows "No admin actions logged yet." | `app/admin/page.tsx` · `getAdminQueueDigest().catch(() => ({}))`, `digest[key]?.count ?? 0`, `auditRows ?? []` | Show "—" in the headline when any queue is unknown. | should |
| 34 | Event type › Profile / Onboarding · Budget planner · Ugat › Onboarding | A failed read shows the built-in defaults as if they were live, and **Save overwrites the real content**: the profile, the budget config, the onboarding music tracks. | `event-types/[eventType]/profile/page.tsx` · `{ data: profileData }`; `budget-planner/page.tsx` · `CONFIG_FALLBACK`; `lib/platform-settings.ts` · `FALLBACK` | Disable Save when the read failed. | should |
| 35 | Integrations / Secrets | Failed reads show Resend as "Not configured" and every secret as unset. Saving from that state wipes the from-address and sign-in fields. | `integrations/page.tsx` · `secretRes.data?.resend_api_key_enc`; `lib/integration-config.ts` · `getSecretPresenceMap`; `secrets/page.tsx` · `(rotationRes.data ?? [])` | Show an "unreadable" banner and block Save. | should |
| 36 | Taxonomy / Aliases · Editorial review · Studio (Reveal, Recaps, Awards, Songs) · Demand · Ugat › Traditions/Map/Menus · Numbers › Growth/Intelligence | These reads also show a failure as an empty state: "No pending requests", "No editorials yet", "No songs match", "Not enough demand data yet", "0 items · using code defaults", "No outcomes logged yet". The Menus read caches a failure for 60 seconds as "no renames". | `taxonomy/page.tsx` · `(reqRes.data ?? [])`; `lib/songs.ts` · `fetchSongsAdmin`; `lib/demand-radar.ts` · `return EMPTY_RADAR`; `lib/nav-registry.ts` · `if (error \|\| !data) return {};`; `lib/admin/growth-stats.ts` · `fetchBreakdowns` | Return `{ ok, rows }` everywhere and never cache a failure. | should |
| 37 | Editorial review (detail) | An editorial whose scan never ran shows "Unlock for couple — all red flags resolved", and there's no Re-scan button. | `editorial-review/[editorialId]/page.tsx` · `canUnlock = redPending.length === 0 &&` | Hide Unlock while the scan is pending; add Re-scan. | should |
| 38 | Settings › Notifications / daily digest | The owner can't choose which alerts email him (the list is fixed in code). The digest switch sits on a different tab. The **last send is never shown**. The digest marks the day as sent before `sendEmail` and ignores the result, so a failed send (or a missing `RESEND_API_KEY`) loses that day silently. | `lib/notification-emit.ts` · `EMAIL_ENABLED_TYPES`; `lib/admin/digest-flush.ts` · `.update({ admin_digest_last_sent_at: nowIso })` before `await sendEmail(` | Show "last digest sent"; move the switch to Notifications; record the send result; later, per-alert email toggles. | should |
| 39 | Verification docs | ID documents are listed and deleted by raw storage key only, with no shop name. | `verification-docs/page.tsx` · `{d.key}` | Show the business name, with the key as secondary text. | should |
| 40 | User reports | The reported party shows as `user <uuid>` / `event <uuid>`, with no link. | `user-reports/page.tsx` · `{r.target_type === 'event' ? 'event' : 'user'} {r.target_id}` | Resolve the name and link to the account card. | should |
| 41 | Journal spotlights | The owner has to paste an internal "Vendor profile ID" into a box. | `studio/_surfaces/journal-spotlights-surface.tsx` · `name="vendor_profile_id"` | Use a supplier search dropdown. | should |
| 42 | Numbers › Operations | **Dead link**: `/admin/operations-hiring/time-log` returns a 404. A refused read tells the owner to "Run REFRESH MATERIALIZED VIEW". | `app-performance/_surfaces/operations-surface.tsx` · `/admin/operations-hiring/time-log` | Remove the link; plain failure text. | should |
| 43 | Menu, Overview, ~65 admin files | Visible copy says **"vendor"** about 220 times: menu labels "Vendors", "Demo vendors", "Vendor recommendations"; tiles "Vendors to verify", "Vendor users"; verify "Vendor approved —"; "Vendor Partnerships"; "Paid vendors"; "Vendor payouts". The menu never says "supplier". | `_components/admin-nav-groups.tsx` · `label: 'Vendors'`; `app/admin/page.tsx` · `queueTile('verify', 'Vendors to verify'`; `verify/page.tsx`; `gifts/page.tsx` (worst, 18) | One copy pass over UI strings only (not identifiers or legal text); a guard for visible "vendor" in admin JSX. | polish |
| 44 | Many | Developer text shown to the owner: "Every vendor_profile + published status", "(0010 · locked 2026-05-21)", a file path in Settings help, "Hamming distance", "Punch-list item #19e", `event_vendors.completion_status ∈ …`, `service_role`, a shell command on Aliases, and the demo-vendors "PR 1 of 3" footer. Raw values: `p.channel` ("gcash"), `p.status`, `r.surface`, `r.kind`, a `'wedding'` fallback for a null type. Raw `error.message` appears on ConsoleTable, Live channels, vendor plan, and the verify and settings redirects. | `app/admin/page.tsx`; `settings-surface.tsx` · `help="Reverse-image theft watch (lib/…`; `_components/console-table.tsx` · `The read was refused: ${readError.message}`; `accounts/_surfaces/demo-vendors-surface.tsx` | Plain wording; label maps; log `error.message` rather than print it. Widen `the-console-speaks-english.test.ts` to catch a table name and "(NNNN ·". | polish |
| 45 | All surfaces (`/admin/more`) | The search placeholder says "Search settings & insights" on the page that lists every admin page. | `_components/mobile-landing-grid.tsx` · `placeholder="Search settings & insights"` | Change to "Search every admin page". | polish |
| 46 | Unfinished pages | Ugat › AI brain has "Coming soon" chips and disabled Edit buttons. The Numbers Uptime and Error-rate tiles always show "—". The Search Console pull has never delivered. The Website editor says "V1 ships the home page only". | `ugat/_surfaces/brain-surface*`; `app-performance` overview tiles | Hide or label as "not live" until wired, or remove from the menu. | polish |

## 2. The owner's workflows

**(a) Confirming a payment from the new email.** The page is ready; the email isn't on `main` yet.

- **The page:** `/admin/payments?filter=all&q=<order>` works.
  - `q` is trimmed and cleaned (`S89O-…` survives), then matched case-insensitively against the order's public id or reference, with a fallback to the bank reference.
  - It searches past the newest 100 rows.
  - Approve, reject, ask to resubmit, refund and batch approve all work from the list.
  - The row stays in view after approving.
- **The email:** the link is built in **open PR #6199** (`lib/admin-order-alert.ts` · `adminOrderDeepLink`), which is **not on `main`**.
- **What still fails:** rows 1, 2, 13 and 14. The worst is that a failed read, and a search that found nothing, both say "Nothing to reconcile."

**(b) Events list and the face-mode switch.** It exists: the "Face tagging" column in Accounts › Events writes `events.papic_face_mode`. Its display and its write are not honest (row 23).

**(c) Catalogue and pricing, and the Live Watch rename.**

- **Where prices come from:** `platform_retail_catalog_v2` is the only price source, edited in Pricing.
- **Live Watch rename:**
  - **No build is needed.** The "Name customers see" field (`saveRetailRow`) saves immediately; only price changes need a second admin.
  - Measured read-only on prod 2026-09-30: `LIVE_STUDIO` has the title **"Live Studio"** and `LIVE_STUDIO_HOSTED_CHANNEL` has **"Live Studio — hosted channel"**.
  - 🔑 **Owner action:** rename both in Admin › Pricing, or approve a data migration.
- **Supplier-plan names:** can't be renamed from admin (row 22).

**(d) Suppliers and demo shops.**

- **What works:** bulk seed, cleanup and regenerate per category (in production only while demo mode is on), and demo inquiries.
- **What's missing:**
  - No list of individual demo shops.
  - No publish or hide switch for one shop.
  - Demo shops crowd real shops out of the unclaimed list (row 25).
  - Links to a claimed shop dead-end (row 26).

**(e) Compliance and privacy.**

- **What works end to end:** account deletion (with the retry gap in row 31) and event removal.
- **What's missing:** an admin path for a **data export request** ("send me my data"). The only export is self-serve for the signed-in user (`app/api/profile/export/route.ts`), so a request emailed to the data protection officer, or from someone who can't sign in, can't be handled.

**(f) Notifications and the digest.**

- **What works:** a missing Resend key is flagged in three places, and the 7-day delivery log is honest.
- **What's missing:** the gaps in row 38.

## 3. What the owner needs and cannot do from admin today

1. **Reopen a finalized guest list.**
   - **The lock:** `events.guest_count_locked_at` plus `events.final_pax`, enforced by the trigger `guard_guest_edits_when_locked`. `ensureFinalized` in `lib/pax.ts` re-stamps it once `guest_list_edit_deadline` passes.
   - **The gap:** nothing ever clears it, and `lib/guest-list-closed.ts` says it "never un-closes".
   - **What a reopen needs:** clear both columns **and** move the deadline, or the next visit re-locks it. The code says the lock is permanent, so this is a product call as well as a build.
2. **See a guest's face-tagging state.** The only admin code that reads `guest_face_enrollments` is two count-only tallies. Nothing per guest reads exclusion, consent or age affirmation.
3. **Open an event.** There's no event detail page, and the slug in the list is plain text.
4. **Open a claimed supplier.** There's only `/plan` and `/team`; `/edit` bounces claimed shops.
5. **Record a payment that arrived but was never logged**, and find an order from the ledger (row 15).
6. **Handle a data export request for someone else** (§2e).
7. **Pick which alerts email him, and see when the digest last went out** (row 38).
8. **Rename a supplier-plan catalogue item** (row 22). Customer items can already be renamed.
9. **Publish or hide one demo shop** (§2d).

## 4. Suggested build order (3 PRs)

1. **PR 1: "Admin reads tell the truth: money and every Save".**
   - Rows 1–12, plus the Save-over-blank forms in rows 20, 34 and 35.
   - One pattern for all of them, copied from `app/vendor-dashboard/reads-are-honest.test.ts` and `lib/guests.ts`. A fetch returns `null` or `{ ok: false }`; the page renders "couldn't read" and disables Save. `platform-settings.ts`'s `FALLBACK` must never reach a form.
   - Add rows 13 and 16. Put a guard on every admin form whose initial values come from a read.
2. **PR 2: "Do it from admin".**
   - The face switch made honest (row 23).
   - An event detail drawer from Accounts › Events: guest count, the guest-list lock with a **Reopen** action, and per-guest face state.
   - "Record a payment received", plus order links from the money ledger.
   - Last digest send, and recording its result.
   - Supplier-plan title edit.
   - Links to claimed shops fixed.
   - Guest-list reopen needs the owner's yes first (§3.1).
3. **PR 3: "Plain English".**
   - Change "vendor" to "supplier" in visible admin copy (about 220 strings) and in the menu.
   - Remove developer text and raw `error.message`; map raw statuses to labels.
   - Remove the dead time-log link and the demo footer; drop the "Vendor tokens" labels.
   - Widen `the-console-speaks-english.test.ts` and add a guard for visible "vendor".
   - The remaining empty-state rows (28–30, 32, 33, 36) can go here or in PR 1, depending on budget.

**Owner actions that need no build:** rename `LIVE_STUDIO` and `LIVE_STUDIO_HOSTED_CHANNEL` to Live Watch in Admin › Pricing, and merge #6199 (the payment email) once its checks clear.
