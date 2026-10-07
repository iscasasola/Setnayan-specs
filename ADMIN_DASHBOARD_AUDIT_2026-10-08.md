# Admin dashboard audit vs the event-dashboard rules — 2026-10-08

Three read-only Sonnet readers over a detached worktree of `origin/main` (`560e6d0f0`, #6409): routes A–F · routes G–Z · nav + registries + `lib/ugat/graph.ts` (reports in `~/Documents/Claude/Projects/controller-2026-10-08/admin-reader-*.md`). Rules = `PAGE_DESIGN_PROMPT_TEMPLATE_2026-10-08.md` + `BUTTON_RULE_2026-10-07_fable.md` + `INTERACTION_RULES.md` (R1 phone · R2 few words · R3 one row shape · R4 one dropdown · R5 no go-elsewhere · R6 thumb-zone frosted rows · R7 buttons · R8 no boxes · R9 no per-field Save · R10 honest failures · R11 tours · R12 words) **plus the admin-only rule R13: a money / for-everyone / irreversible action shows what will happen and to whom BEFORE the tap, and says what happened after.** Grep-level; verify before building. Earlier admin audits already on record and NOT repeated here: `ADMIN_AUDIT_2026-09-30.md` (46 honest-read findings, 35 pages that show a failed read as "all clear"), `BUTTON_INVENTORY_2026-10-07/out-5` (132 admin controls to convert).

**Shape of the thing:** 106 `page.tsx` under `app/admin` = 59 real pages + 36 redirect stubs + 11 dynamic/detail pages; 82 nav items in 6 groups (`ADMIN_NAV_GROUPS`); 317 generated jobs; 25 Ugat nodes (7 with an `/admin` href, 4 of those pointing at redirect stubs). The owner's own words (2026-10-02): *"today, i am lost on the admin page. i only use search bar and rely on the overview page because it does so many things and has so many buttons."*

# A · Today / Work / the shell (`/admin`, `/admin/work`, `layout.tsx`, `_components`)
1. Three screens show the same 21 queues three ways: the Overview (21 tiles in 4 lanes + 6 "More queues" tiles + 8 KPI cards + 6 What-you-change tiles + 8 audit rows + 2 pills + 2 strips ≈ 53 things), `/admin/work` (19 ranked rows + chips + drawers) and the nav badges — all from one `getAdminQueueDigest()`. Nothing is a per-ITEM list; the owner still opens a page to see what the item is. R3 R2 **L**
2. Overview first screen ≈ 70 words + 21 tiles; `/work` ≈ 90 words with a sentence subtitle ("N items need your attention across the 19 queues tracked here"). R2 M
3. Lane chips All · Money · Trust · Growth · Support on `/work` = a pill row → one Show ▾. R4 S
4. Phone bar is **Today · People · Money · More** + a floating "Payment requests" FAB over the bar; the approved 2026-10-01 phone admin is **Work · Money · People · More** with one Next card and nothing floating over the bar. The shipped order and labels differ from the approved ones. R1 M
5. `the-phone-answers-it-does-not-edit.test.ts` pins "on a phone the console answers; it does not edit" and `/admin/more` + `/admin/directory` are static card grids (`MobileLandingGrid`) — the phone has NO search opener at all (`AdminSearchBox` is `hidden lg:flex`), so the owner's one fast door is desktop-only. R5 R6 **L**
6. Zero `sn-glass-row` anywhere in admin; zero `ActionButton`; buttons are `.fd-btn-gold` / text links (BUTTON_INVENTORY out-5: 132 to convert). R6 R7 M
7. The layout runs ~21 `after()` background jobs on every admin request — not a rule violation, but a reason the shell must stay one layout. (noted)
8. Boxes: every tile, KPI card, lane and drawer is a bordered card. R8 M
9. Failed reads: the Overview's `getAdminQueueDigest().catch(() => ({}))` + `digest[key]?.count ?? 0` prints "0 items need you" (audit 09-30 row 33); `/work` prints "All queues clear." when counts fail (row 5). R10 **blocks**
10. `GuidedTour admin_welcome_v1` exists; nothing per page. R11 S
11. "Vendor" ≈ 220 visible strings (menu "Vendors", tiles "Vendors to verify"…); `admin-says-supplier.test.ts` exists but the readers still list Vendor labels in nav (Suppliers item key `vendors`). R12 M
12. Confirm step: `approvePayment` opens a dialog that names the effects (good — the one place R13 is already met); `/approvals` "Approve & execute" has no confirm; ban/blacklist/hard-delete are browser `confirm()`s with no reason field; Reveal Studio, referrals, AI paywall and demo-mode switches flip for everyone with no "who is affected". R13 **L**
GOOD: one digest feeds everything (counts are never re-derived); SLA clocks per queue with overdue → due-soon → busiest ordering (`compareQueuePriority`); the phone bar exists; `admin-reads-say-couldnt-read` + `the-console-speaks-english` + `the-overview-shows-what-it-counts` guards; the payment dialog is honest; `settling-from-the-list-stays-honest` keeps irreversible actions off the list.

# B · Money (`/admin/payments` 4,355 lines · `/money` 571 · `/payouts` · `/subscriptions` · `/booking-fees` · `/receipts` · `/payment-options` · `/settings/payment-methods` 817 · `/pricing` 6,789 · `/gifts` 1,164 · discount codes · custom plans)
1. `/money` is read-only (revenue + ledger + a card grid of 13 links); `/payments` is the desk. Two pages for one job; the ledger row links to `/payments?q=` (go-elsewhere). R5 R3 M
2. `/payments` first screen ≈ 70 words: three view tabs (Pending · All · Orders needing a quote) + platform filter + search + a red "events today" banner + per-row itemised bill + duplicate checkbox + AI read. Pill rows → one Show ▾. R4 R2 M
3. Payments "Nothing to reconcile." on a failed read and on a search that found nothing (audit 09-30 rows 1, 2, 14) — the owner's daily screen lies in both directions. R10 **blocks**
4. **No "Record a payment received"** (audit 09-30 row 15) — a transfer seen in the bank but never logged by the buyer cannot be entered. (missing workflow) **L**
5. Receiving accounts: fixed BDO + GCash fields; owner 2026-10-01 asked for a LIST (any bank or e-wallet, name · number · QR); a failed settings read returns `FALLBACK` blanks and **Save writes the blanks over the real bank details** (row 3). R10 R9 **blocks**
6. `/pricing` = 6 tabs (Pricing · Setnayan AI · Papic shots · Custom plans · Price bands · Free windows), 117 catalogue rows with retired ones inline (council 07-21 step 1 not shipped: "Show N retired"), supplier-plan names "migration-owned, edit in code" (developer text, cannot rename — row 22), per-section "Save all changes". R2 R9 R4 **L**
7. The booking-fee switch is two env keys (`NEXT_PUBLIC_BOOKING_FEE_ENABLED` + `_RAIL_LIVE`), not an admin setting; `fee_unlocks_event_enforced` and `booking_fee_free_from/until` exist in `platform_settings` with **no writer in `app/admin`** — a comment says they are flipped "from the admin console" and nothing can. (gate with no handle) **L**
8. **Launch offer (DECISION_LOG 2026-10-08 L4824–4825): not implemented anywhere.** `lib/vendor-launch-free-window.ts` is a dead fixed-date window (Nov 30), `promo_free_windows` is a date/audience window with no counter, `FREE_BOOKING_LIMIT = 5` is per supplier. No page, no counter, no cap, no end-date, no 50-credit grant. (NEW) **L**
9. Comps and tiers are granted in TWO places (`/gifts` and `/vendors/[id]/plan`, both call `setVendorTier` / `issueVendorSkuComp`). R5 (one thing, one way) S
10. Boxes and captions everywhere; `/payouts` filter is a raw "UUID" box (row 18); `/booking-fees` "Never billed" on a failed read (row 17); `/subscriptions` "0 pending" on a failed read (row 6). R8 R10 M
GOOD: `approvePaymentCore` is one shared path (matched → ledger → receipt → payout → activation → referral); shortfall guard; duplicate verdict shared with the refusal (`admin-payment-desk.ts`); two-admin thresholds in one file (`two-admin-promise.ts`: refund > ₱25,000, comp > ₱10,000, every retail price change); `platform_settings` fails toward the locked fee default, never toward free.

# C · People (`/accounts` 3,425 lines with 5 tabs · `/users/[id]` 1,063 · `/vendors/[id]` + `/edit` `/plan` `/team` · `/events/[id]` · `/verify` 3,604 · `/verification-docs` · `/vendor-partnerships` · `/corrections` · `/founder-seats` · `/directory`)
1. Eight places to look up one customer (Users tab · Events tab · Suppliers tab · user card · event page · shop card · payments · problems); the user card is read-only and its ONLY action is "Download their data" — force sign-out, blacklist, delete and reset password live on the Accounts tab, not on the person. R5 R3 **L**
2. `/accounts` first screen ≈ 50 words + five tabs (a pill row) + a search form; `/directory` on the phone is a 9-card grid with no live search. R4 R6 M
3. `/verify` ≈ 120 first-screen words: two tabs (Applications · Listing visibility) × status tabs, per-card auto-checks, VALIDATE contact, web dossier, documents, Approve (confirm dialog, good) · Reject · Demote · In review · Verify experience · Mark contact confirmed · Deep search · Manual dossier. A failed shop-details read makes every card "Unnamed vendor" and runs the checks on blanks (row 11). R2 R4 R10 **blocks**
4. `/vendors/[id]/edit` redirects every CLAIMED shop to the list — "Open vendor →" from Integrity/Repost watch dead-ends (row 26). R5 M
5. Events: no event page from the list (slug is plain text, row 24); the shipped `/events/[eventId]` has Reopen guest list (Finalize-only, #6213, owner-kept L4576) + face mode — face mode ignores `face_tagging_declined_by_couple` (row 23). R10 M
6. `/verification-docs` lists files by raw storage key, no shop name (row 39); `/user-reports` shows `user <uuid>` (row 40). R12 R2 S
7. Judgement queues (disputes · fraud · reports · force majeure) correctly have NO fast button (CLAUDE_DESIGN_04 §2) — keep. GOOD
8. No MiniTour on any People page. R11 S
GOOD: `fetchUgatSearch` already searches vendor_profiles · events · users · orders · taxonomy · guests (fenced) — the record search EXISTS and is reachable only at `/admin/ugat/map` (WHATS_NEXT 08-26: "Rule 0 paid again"); `UgatSearchHit.href` has zero readers (a gate with no handle); verification approval is single-admin and writes `vendor_tier_history` + the audit log.

# D · More: Studio / Root map / Numbers / Privacy / Settings (`/studio` 5,385 lines · 13 tabs · `/ugat` 2,892 · 4 tabs · `/app-performance` 5,558 · 10 tabs · `/data-privacy` 5 tabs · `/settings` 4,184 · 4 tabs · `/integrations` 1,465 · `/secrets` 1,165 · `/categories` 10,351)
1. Five hub pages carry **36 tabs** between them; 24 old addresses redirect into tabs; 11 tabs are in no nav group at all (Pricing `setnayan-ai` · `papic-shots` · `free-windows`; Studio `storytellers`; Ugat `screens`; Numbers `interconnections` · `browser-blocks`; Privacy `controls` · `coverage` · `deletions` · `checklist` · `documents`) — reachable only by typing the URL. R5 R4 **L**
2. The More grid lists all 82 items alphabetically within 6 groups; group names are Today · People & shops · Studio · Root map · Numbers · Money — "Root map" holds Settings, Compliance, Notifications, Integrations, Secrets, Budget planner, Papic storage and "My account" (which leaves `/admin`). Grouping by system, not by job. R3 M
3. Reveal Studio (`/studio?tab=reveal-studio`): a master "Show the reveal" switch whose hint says it no longer switches anything (every reveal needs Event Hub Pro, L4760), 5 template switches, 3 feature switches, colours, ~24 sliders + a second queue (Save-the-Date video moderation) on the same tab. Switches flip for 312 hubs with no blast-radius line. R13 R2 M
4. Settings: 4 tabs; Settings tab ≈ 110 words (business identity · Hamming threshold · VALIDATE · brand icon · loader appearance · a Sentry smoke-test button); Save is correctly disabled when the read failed (good) but Compliance (`platform_compliance_facts`) is not (row 4). R2 R10 M
5. Menus & icons (`/ugat?tab=menus`): 190 slots in one long form; 21 of 82 admin nav items have no slot (cannot be renamed/hidden); the Money phone tab has no slot. R2 S
6. Numbers: 10 tabs, 8 totals + Uptime/Error-rate tiles that always read "—" ("wiring"); dead link `/operations-hiring/time-log` (row 42); "Connection logs" is still the tab name — owner renamed it **Problems** (L4662). R12 R10 M
7. Privacy: a failed controls read shows every control "Off" and the checklist "0 of N" (row 32). R10 M
8. Integrations/Secrets: failed reads show "Not configured"/unset and Save wipes the from-address (row 35). R10 **blocks**
9. `/categories` is the approved one-page design (2026-10-02) — keep; 9 `ReadFailed` already. GOOD
10. Content that does not exist yet though the 10-02 rows name it: Features page · FAQs & help · Event Hub theme maker · Email & notification templates · Guest-import template · Team & permissions page · Admin log page · a Person page with actions. (NEW, from `admin_final_2026-10-02`) 
GOOD: honest `ReadFailed` on ~12 routes; `nav_slot_override` + `getNavSlotMap()` fall back to code defaults on a failed read; `reveal_studio_config` merges over locked defaults; `the-menu-name-has-one-source` guard; approvals queue with 12-h SLA; demo mode is a per-session cookie, audit-logged.

# E · Words on the first screen (R2) — today vs the prototype
| Screen | Today (words, first 812 px) | Prototype | Cut |
|---|---|---|---|
| Overview / Work | ~70 + 21 tile labels + 8 KPI labels ≈ 140 | Work frame 01 ≈ 60 (Next card · line · 3 numbers · 5 rows) | ≈ 57 % |
| `/work` | ~90 | (merged into Work) | 100 % |
| `/payments` | ~70 + bill lines | Money frame 06 ≈ 55 | ≈ 21 % (the bill lines moved to the payment page) |
| `/accounts` | ~50 + 5 tabs | People frame 09 ≈ 45 | ≈ 10 % (already short) |
| `/verify` | ~120 | Supplier frame 12 ≈ 55 | ≈ 54 % |
| `/pricing` | ~60 + 117 rows | Pricing & offers frame 20 ≈ 50 · Catalogue frame 24 ≈ 45 | ≈ 60 % |
| `/settings` | ~110 | Switches frame 25 ≈ 60 | ≈ 45 % |
| `/more` grid | ~40 + 82 items ≈ 200 | More sheet frame 19 ≈ 45 | ≈ 78 % |
| Reveal Studio | ~150 (intro + 24 slider labels) | Reveal frame 27 ≈ 50 | ≈ 67 % |
Across the eight first screens: ≈ 1,000 → ≈ 465 words (**≈ 54 % fewer**; ≥ 60 % on the five worst). The rest of the cut comes from folds (sliders behind "Look ⌄"), ⓘ, and the one Show ▾ per page.

---
# COVERAGE CHECK (2026-10-08, before the Fable redesign — what has no home today)

**Routes with no door (reachable only by URL):** `/admin/compliance/data-sheet` · `/admin/demo-vendors/inquiries` (+ `[threadId]`) · `/admin/discount-codes/new` · `/admin/venues/new` · every dynamic page (`/users/[id]`, `/vendors/[id]`, `/vendors/[id]/edit|plan|team`, `/events/[id]`, `/venues/[id]`, `/force-majeure/[flagId]`, `/editorial-review/[id]`, `/discount-codes/[id]/edit`) is reached only from a list row; 11 tabs in no nav group (D1). `/admin/storytellers` has actions but no page.

**Ugat nodes with no admin screen (18 of 25):** Guests · Service cards · Threads · Group · Papic · Person · Package · Proposal · Contract · Availability · Geography · Seat Plan · Run of Show · Live Watch · Mood Board renders · Design sign-off · Colour access · Wedding March. The 7 with an href: Users · Events · Vendors · Mood Board library point at **redirect stubs**; Orders → `/payments`, Billing → `/subscriptions`, Taxonomy → `/categories` are real.

**Plan / money features with no admin control:**
1. Launch offer B (on/off · cap 2,000 · live count · end date · Pro-free grant · 50 Papic credits) — nothing (B8).
2. Booking-fee master switch — env only; `fee_unlocks_event_enforced` and `booking_fee_free_from/until` — columns with no writer (B7).
3. Supplier-plan prices in `vendor_billing_catalog` — editable price/description/active, **title not editable** (B6).
4. Record a payment received (B4).
5. Receiving accounts as a list (B5).
6. Spotlight-on-homepage switch (`spotlight_homepage_enabled`) — reader only, no writer.
7. Guest-list reopen exists (Finalize-only) but is not reachable from any list (C5).
8. Data-export request on behalf of someone else (audit 09-30 §2e).
9. Which alerts email the owner + last digest send (row 38).
10. Fee-free promo reason (money switches 09-22 (3)): not built.
11. One demo shop publish/hide (09-30 §2d).
12. The 2026-10-02 named-but-unbuilt pages (D10).

**Where every one of these lands in the redesign:** `ADMIN_DASHBOARD_REDESIGN_2026-10-08_fable.md` §11 (Coverage, with taps from Work) and §4 (Data — exists vs NEW).
