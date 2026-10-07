# Admin dashboard — one person, one phone, one list

**2026-10-08 · Fable (designer) · design + prototype only. No app code, no PRs, no database writes. AWAITS owner approval — nothing is built.**
Owner, verbatim: *"after suppliers, we will also do the same fix for the admin page so it will be an easy one man handled website."* (2026-10-08) · *"admin page needs to have an easier way to show all that has needs action."* (2026-10-02) · *"and the fable design for admin dashboard. make sure all mapped is correct and plans and builds are connected while following our build style"* · *"follow the same rule that can access everything in less than 3 taps and all the other rules"* (2026-10-08).
Build order (locked 2026-10-08, L4857): Event Hub → couple's Suppliers page → supplier dashboard → **Admin (this)**. Desktop + iPhone Duo after Admin (L4854).

Prototype: `prototypes/admin_dashboard_2026-10-08_fable.html` (gallery of 35 live phone frames + 3 dark + **28 job frames (39–66, §12)** added for the owner's 22 jobs; `?s=<frame>` opens one alone, `&dark=1`, `&v=calm|fail|done|ending|ended`, `&sheet=confirm:<pay|verify|ban|delete|swoff|launch|launchoff|price|reopen|record|export|cat|refund>`, `&open=<fold>`).
Screenshots (375 px, 750×1624): `prototypes/admin_dashboard_2026-10-08_fable/00-contact-sheet.jpg` + `01…66-*.jpg` (36–38 dark; 39–66 the owner's jobs; 65b = "waits for their next event").
Read: `ADMIN_DASHBOARD_AUDIT_2026-10-08.md` (R1–R13 + COVERAGE CHECK) · `SUPPLIER_DASHBOARD_REDESIGN_2026-10-08_fable.md` (the model; its frames are cited by number below) · `PAGE_DESIGN_PROMPT_TEMPLATE_2026-10-08.md` · `BUTTON_RULE_2026-10-07_fable.md` · `INTERACTION_RULES.md` · DECISION_LOG rows L4560 (phone admin approved: Work · Money · People · More), L4576 (Reopen guest list stays), L4662–4665 (simple admin · jobs · ONE Needs-action list · Problems), L4067 (money switches), L4823–4825 (launch offer B · 50 credits), L4828 (one-man admin), L4859 (supplier prototype approved). Code read from `origin/main` `560e6d0f0` in a detached worktree by three Sonnet readers (routes A–F · G–Z · nav/registries/Ugat).

**Earlier admin work and what each already settled (Rule 0):** `admin_app_simple_2026-10-01_fable` — **approved**: bar Work · Money · People · More, one Next card, lists first, nothing floats over the bar, Confirm from the card only when the AI read matches (L4560) — **kept exactly**. `admin_final_2026-10-02_fable` — the 19 jobs → one place, More = one heading per job, 16 Needs-action sources (11 exist, 5 new), the Person page, Account actions ▾ with reason + typed confirm — owner's reply was "you still did not create a simplified version of each page" (tacitly accepted placements) — **kept as the map; headings reduced 12 → 9 (owner question 1)**. `admin_pages_simple_2026-10-02_fable` — four page patterns (List+detail · Editor · Settings · Numbers), 1,143 functions placed — **kept as the function inventory**. `admin_money_switches_FINAL_2026-09-22` — fee switch warns and names, refuses only when it cannot count, a promotion carries a required reason (L4067) — **kept; the launch-offer page inherits all three**. `ADMIN_AUDIT_2026-09-30` — 46 honest-read findings, 3 PRs — **folded into A-PR3/A-PR10**. `CLAUDE_DESIGN_04_Admin_Console_2026-08-07` — fact → one button · details → small form · judgement → no fast button; four honest states — **kept (frames 04 · 08 · 16)**. `Solo_Operator_Admin_Plan_2026-07-11` — Exception Desk, Custodian, auto-approve bands — **not drawn**: the owner's 2026-10-01 rule is stricter (Confirm only when the AI read matches, a human presses) and PayMongo re-sequenced it. `Admin_Account_Access_Model_2026-06-22` — tiers, two-admin catalogue, takeover — **View as is read-only (frame 10); the two-admin thresholds are the shipped `two-admin-promise.ts`**. `Admin_Pricing_Cleanup_Council_Verdict_2026-07-21` — retired rows behind a fold, Add-ons tab dead — **Catalogue frame 24 draws the fold**. `WHATS_NEXT_Admin_Names_And_Alerts` / `_Search_And_Assistant` (08-26) — the record search exists (`fetchUgatSearch`) and the phone was ruled answer-only — **search is now the phone's door (owner question 4)**. `0023_admin_console/` — archive, not truth.

---

## Verdict

**The approved phone shape (2026-10-01) is right and already half shipped; what was never done is the list.** Today the owner's one daily job — see what needs him — is spread over three screens that show the same 21 *queues* (never the items), 82 menu entries in six system-named groups, 36 tabs inside five hubs, and a phone that cannot search or act. The redesign keeps the bar and the Next card, makes **Work the one Needs-action list of items** (16 sources, grouped by job, the action in the row, Undo after), puts **every other admin page one heading away under More**, and gives the phone the **search door** the desktop already has — so **every screen and every control is ≤ 3 taps from Work** (§11 proves it route by route).

**One confirm sheet, reused everywhere money moves or everyone is affected** (frames 04 · 08 · 11 · 13 · 26): what happens · to whom · a typed word when it cannot be undone · then the button; a toast with Undo after. It replaces eleven different dialogs, browser `confirm()`s and silent switches.

**Almost nothing is new data.** Every row reads a shipped table or action; the only NEW schema is the **launch offer** (§4), which the supplier design already reads (frames 22–25, 27, 30, 34) and which nothing in the code implements yet. Words on the eight first screens: ≈ 1,000 → ≈ 465.

---

## 1 · Where things go (the 82 nav items, 36 tabs and 3 phone hubs → four tabs + nine headings)

| Today (`ADMIN_NAV_GROUPS`) | Where it goes | Why |
|---|---|---|
| **Today** group (21 queue pages + Overview + All work) | **Work** = the one list. Every queue is a *group of rows* on Work (Money · Suppliers · Safety · Privacy · Problems · Today's events), never a menu item. Judgement queues (disputes · fraud · reports · force majeure · abuse · integrity) open their case from the row (frame 16). Approvals (two-admin) is a row and its own page (18). Problems is a row and a page (17). | L4665: *one list, first on Work and the Overview, the action IN the row.* |
| **People & shops** (Verify · ID documents · Suppliers · Partnerships · Users · Founder seats · Gifts · Events · Venues) | **People** = one search (reuses `fetchUgatSearch`) with Everything ▾; three kinds of page: Person (10) · Supplier (12, verification + plan + comps inside) · Event (14). ID documents · Gifts & comps · Partnerships are rows under "Also here". Founder seats → Pricing & offers. Venues = a People filter. | L4664 job 1: *search → ONE person page with support actions in place.* Two comp doors (`/gifts`, `/vendors/[id]/plan`) become one. |
| **Money** group (13 items) | **Money** = three numbers · Show ▾ (To confirm · Received · Refunds · Needs a quote · Subscriptions · Fees owed · Payouts · Everything) · rows; "More money" rows: Our accounts · Fees owed · Receipts · Catalogue. Pricing & offers lives under More (the Catalogue is also 2 taps from Money). | One desk, one list; `/money`'s read-only ledger and card grid dissolve into it. |
| **Studio** (13 tabs) | More › **Templates** (Event Hub themes · Reveal Studio · Patiktok · Email & notification · Guest-import) · **Media** (Front door media · Songs · Mood board library · All creations · Papic storage) · **Growth** (Front door · SEO · Referrals · Real Stories · Spotlight Awards · Social queue · Announcements). Discount codes → Pricing & offers. | admin_final placements, "Talk to users" folded into Growth (Q1). |
| **Root map** (16 items) | More › **Content** (Categories & event types · Articles · Features page · FAQs & help) · **Set up** (Onboarding · AI brain · Search memory · Screens · Demo suppliers) · **Admin** (Switches · Our accounts · Business details · Integrations · Secrets · Team & permissions · Menus & icons · Admin log). Demo mode → Switches. My account → the avatar sheet. | Settings, secrets and integrations are "Admin itself" (job 19), not a map. |
| **Numbers** (9 items) | More › **Numbers** (Problems · Sign-ups & retention · Funnels · Demand (+ Intelligence, Q5) · Costs (Live Watch channels · Papic storage · Expenses & hiring) · Offline · Interconnections · Browser blocks). | "Costs" folded into Numbers (Q1). |
| Phone hubs `/directory` · `/money` · `/more` (static grids) | Retired: People, Money and the More sheet replace them. | They were the grid the owner got lost in. |
| `AdminNavFab` "Payment requests" | Retired: the Next card IS the payment that needs him. | Nothing floats over the bar (approved). |
| Top-bar SLA pill · bell · environment badge · account switcher | The Work badge (number · dot when a source failed · nothing when empty) · the avatar sheet (29): Switches · Alerts to my phone · Team & permissions · Admin log · Sign out. | One badge, one sheet. |

**More (phone) = nine headings**, one per job: Pricing & offers · Content · Templates · Media · Growth · Numbers · Privacy · Set up · Admin (frame 19). Every heading page is rows, every row is a page: **3 taps to anything**.

---

## 2 · Today's blocks per page — keep · move · merge · remove

### Work (`/admin` 1,041 lines + `/admin/work` 165 + `queues/_components`)
| Block today | Fate |
|---|---|
| Exception desk headline ("N items need you" · % ring · top-3 queues · All work · Numbers links) | **Merge** into the three numbers: need you · late · events today (frame 01). Ring **removed**. A failed digest shows "—" and the warn card, never 0 (03). |
| 21 queue tiles in 4 lanes + 6 "More queues" tiles | **Replace** with the Needs-action list of *items*: `peekQueue()` already reads the top items per queue; the list is every item, grouped by job, `compareQueuePriority` order (overdue → due soon → oldest) inside each group. One Show ▾ (All · Money · Suppliers · Safety · Privacy · Problems · Today's events, with counts). |
| `/admin/work` ranked rows + lane chips + drawers | **Merge**: the #1 item IS the Next card; the drawers' forms become the action in the row (`approvePaymentFromWorkList`, `approveVerificationFromWorkList`, `settleSubscriptionFromWorkList`, `publishReviewFromWorkList`, `settleChatFlagFromWorkList`…). `/work` and `/queues` redirect to `/admin`. |
| 8 KPI cards (users · couples · suppliers · events · threads · internal · team pool) | **Move** to People's counts line ("— people · — suppliers · — events", read live, frame 09). |
| 6 "What you change" tiles · launcher grid · Secrets/Integrations pills · Apple-secret reminder · email-delivery strip | **Remove** the tiles and grid (search finds them); the two pills → More › Admin; Apple reminder and a failed mail become **rows on Work only while due/failed**. |
| 8 "Recent admin activity" rows | **Move** to Admin › Admin log (full page, filter by person · action · day). |
| `GuidedTour admin_welcome_v1` | **Replace** with one MiniTour slide per tab (Work · Money · People · Launch offer), frame 35. |
| Next card (approved) | **Keep**: the #1 item, its one button (Confirm only when `payment_receipt_reads` matched amount + reference, else Open), "1 of N", a second grey button (The receipt / Open). |
| NEW on Work | **Launch-offer line** under the card (reads the config of §4; → Launch offer page). **Today's events** group (events dated today × their Problems × Papic/Live Watch state). **Done state** (05): the cleared row stays struck-through with Undo until the list refreshes. |

### Money (`/payments` 4,355 · `/money` 571 · `/payouts` · `/subscriptions` · `/booking-fees` · `/receipts` · `/payment-options` · `/settings/payment-methods` 817)
| Block today | Fate |
|---|---|
| `/money` revenue summary + ledger + 13-card grid | **Merge**: the three numbers (received this week · to confirm · refunds owed) + "More money" rows. Grid **removed**. |
| `/payments` three view tabs · platform filter · search · events-today banner · per-row bill · duplicate checkbox · AI read · batch approve | **Keep the data, one Show ▾** (06); search in the thumb row; events-today sort first (kept, silently); the bill, duplicate verdict and AI read live on **the payment page** (07); batch approve → a "Confirm all clean" button that appears only when ≥ 2 rows are AI-matched. |
| Approve dialog (names the effects — good) | **Becomes the shared confirm sheet** (04): what happens (received · unlocks · receipt · payout if any) · to whom · Confirm. Same `approvePaymentCore`. |
| Reject · Ask to resubmit · Refund · Confirm total · Re-read receipt | Thumb row Confirm · Resend · Reject (07); Refund = a Work row + ⋯ on the payment; Confirm total → "Needs a quote" rows; Re-read = a row on the payment. |
| **Record a payment received** (missing) | **NEW action** (08): order ▾ · amount · channel ▾ · reference → logs a `payments` row → then the same confirm step. |
| `/payouts` (pre-V2, closed trail, raw UUID filter) | Show ▾ "Payouts · old"; supplier name picker. |
| `/subscriptions` · `/booking-fees` · `/receipts` · `/payment-options` | Show ▾ entries and "More money" rows; a subscription to confirm is also a Work row (01). Payment options approval = a Work row (Suppliers group) + the Supplier page Money fold. |
| `/settings/payment-methods` fixed BDO + GCash | **Our accounts** (34): a LIST (owner 2026-10-01 — any bank or e-wallet: name · number · QR), on/off switches, monthly cap; changing a number = two-admin (exists, `approve_payment_account_change`). The `FALLBACK`-blank Save (audit row 3) **cannot happen**: an unread list locks Add/Edit. |
| MiniTour: none | **Add** `admin_money_v1`. |

### People (`/accounts` 3,425 · `/users/[id]` 1,063 · `/vendors/[id]` + `/edit` · `/plan` · `/team` · `/events/[id]` 414 · `/verify` 3,604 · `/verification-docs` · `/vendor-partnerships` · `/corrections` · `/founder-seats` · `/gifts` 1,164 · `/directory`)
| Block today | Fate |
|---|---|
| Five tabs (Users · Suppliers · Demo suppliers · Events · Venues) + per-tab search forms | **One search** (reuses `ugatSearchInner`: vendor_profiles · events · users · orders · taxonomy · guests fenced) + Everything ▾ (People · Suppliers · To verify · Events · Venues · Demo suppliers), frame 09. The five `UgatSearchHit.href`s (zero readers today) are **authored** to the three pages below. |
| User card (read-only; actions on the Accounts tab) | **Person page** (10): folds Events (each with › to the Event page) · Orders & payments (Confirm/Comp in place) · People on their events (Unlink) · Memories · Problems they hit · Access (Reset · Sign out all · Send their data) · Admin log. Thumb: Message · View as (read-only, logged) · **Actions** → Ban / Delete account (11: reason ▾ · typed word · 24-h undo where data allows). |
| `/vendors/[id]` + `/edit` + `/plan` + `/team` + `/verify` card + `/gifts` supplier half | **Supplier page** (12): folds Verification (the `/verify` checks, documents, dossier, Deep search, "Ask for more") · Plan (tier ▾, why, Comp a SKU → two-admin, Founding supplier switch) · Services · Money (subscription to confirm, fees, payment options) · Team & customers (chat flags) · Admin log. Thumb: **Approve** (13, confirm sheet) · Message · Reject. `/edit` only for unclaimed shops stays, reached from this page (fixes audit row 26). |
| Events tab (no detail link; face mode dishonest) | **Event page** (14): Guest list (Finalized · **Reopen**, L4576, confirm sheet) · Face tagging (reads `face_tagging_declined_by_couple` too) · Papic · Suppliers · Money · Problems · Removal; hosts rows; thumb: Message hosts · Event Hub · Actions (force-delete = reason · typed name · 24-h undo). |
| `/verification-docs` (raw keys) · `/vendor-partnerships` · `/gifts` · `/founder-seats` · `/corrections` | Rows under "Also here" (ID documents with the shop name first; Gifts & comps = every comp, deal, window in one place; Partnerships as a Work row too). Founder seats → Pricing & offers. Corrections = a Work row (Suppliers). |
| `/directory` card grid | **Removed** (People is the hub). |
| MiniTour: none | **Add** `admin_people_v1`. |

### More — the nine heading pages (`/studio` 5,385 · `/ugat` 2,892 · `/app-performance` 5,558 · `/data-privacy` · `/settings` 4,184 · `/integrations` · `/secrets` · `/categories` 10,351 · `/pricing` 6,789)
| Block today | Fate |
|---|---|
| Five hubs with 36 tabs (11 in no menu) | **Every tab becomes a row on its heading page** (frames 20 · 31 · 27 · 30 · 32 · 33); the page keeps its `?tab=` as the row's URL so every old address still lands. Tab strips **removed**. |
| `/pricing` six tabs | **Pricing & offers** (20): Launch offer · Catalogue · Supplier plans · Booking fee · Free windows · Discount codes · Papic shot prices · Setnayan AI prices · Custom plans · Founder seats · Market price bands. **Catalogue** (24): Show ▾ (Customers · Supplier plans · Bundles · Retired — the council's "Show N retired" fold); a row opens in place: Price (two-admin → confirm sheet "Send for approval") · Name (saves at once) · Live switch; supplier-plan **titles become editable** (audit row 22). |
| **Launch offer** (nothing today) | **NEW page** (21–23): state card (running · ending week · ended) · meter · Used / Started / Ends · The rule ▾ (B · A) · Offer switch · Cap · Pro free for all · Papic credits per fee-free booking · After it ends · Week boundary ▾ · **Who reads this** (the supplier frames, by number). Apply = confirm sheet naming how many suppliers are affected; End now = confirm sheet (danger). |
| Reveal Studio tab (master switch · 5 templates · 3 features · 24 sliders · STD video queue) | **Reveal Studio** (27): switches as rows; sliders behind "Look ⌄" with Replay; every switch = confirm sheet with the hub count (26); the **Save-the-Date video queue** = a Work row (Safety) too. |
| Settings tab (identity · Hamming · VALIDATE · brand icon · loader · Sentry button) + demo-mode tab + referrals switch + AI paywall + spotlight + digest | **Switches** (25): every for-everyone switch in one place, each a confirm sheet; env-only flags listed read-only ("env · on"); **NEW writers** for `fee_unlocks_event_enforced` and `spotlight_homepage_enabled`. Business details · Integrations · Secrets keep their forms as rows (Save locked when the read failed — audit rows 3, 4, 35). |
| Menus & icons (190 slots, one form) | Admin › Menus & icons: Scope ▾ (admin · supplier · couple · public) · one row per slot (label · icon · hide); **adds the 21 missing admin slots + the Money bottom-nav slot + `vendor.more.settings`** (reader §2). |
| Notifications tab (own list · delivery · digest) | Avatar sheet: Alerts to my phone (push switch, `the-console-can-reach-your-phone`) · digest switch with **last sent** (audit row 38); the 7-day delivery log → Admin log. |
| Compliance tab · data-privacy 5 tabs · npc data sheet | **Privacy** (32): Deletions due · Data-export requests (both the SAME rows as Work) · Event removals · NPC filing (controls · checklist · data sheet · documents) · Who viewed whose data. |
| Numbers 10 tabs (Uptime/Error "—") | **Numbers** (30): three numbers + one bar + rows; "—" stays until wired; dead `time-log` link **removed**; Connection logs → **Problems** (17: issue rows, trace in place, Mark fixed / Ignore). |
| Studio 13 tabs | Templates · Media · Growth rows (§1). The theme maker, Features page, FAQs & help, Email templates, Guest-import sheet, Announcements are **NEW pages** named by admin_final — rows exist now, pages are later A-PRs. |
| `/categories` | **Keep** the approved one-page design (31); a category request is a row where it belongs, Approve in the row (confirm sheet). |
| `/ugat` Entity map · Screens | Set up › Screens (read-only, L4658). The map's search is now People's search. |
| `/dashboard/profile` "My account" | Avatar sheet row. |

---

## 3 · The design, plain English (375 first)

**Shell on every page:** SETNAYAN · Admin · search door (top right — the one fast door, INTERACTION_RULES §4) · avatar. Sub-pages: ‹ · page name · the same two doors. Bar: **Work · Money · People · More** (approved 2026-10-01). Work's badge = the total; a dot when a source couldn't load; nothing when nothing needs you.

**Work.** One Next card (the #1 item, "1 of 14", Confirm when the AI read matches, else Open), the launch-offer line, three numbers (need you · late · events today), then **Needs action**: one Show ▾, groups by job most urgent first, each row = sentence · meta · ONE action · ⋯ (the rest). A tick on the left = due today (gold) or late (wine). Judgement rows say **Open**. A cleared row stays struck-through with Undo. Calm day: "Nothing needs you · every source read" and the week's three facts. Failed source: a dashed "Couldn't load X · Retry" line at the end of its group, "—" in the number, a dot on the badge — never 0, never "all clear". ≈ 60 words.

**The confirm step (reused).** Title = the verb and the amount or the thing · one grey fact line · **What happens** (✓ lines, ✗ for what does not happen) · reason ▾ when policy needs one · "Type X" when it cannot be undone · the toned button + Cancel · "Written to the Admin log" / "Undo for 24 h". Used by: payment confirm · refund · verify · comp · price change (two-admin: "nothing changes yet") · launch-offer Apply / End · any for-everyone switch · reopen guest list · ban · delete · force-delete · record a payment · send export. Never a browser dialog; never "Are you sure?" without the consequence.

**Money.** Three numbers · Show ▾ · rows (who · what · ₱ · one action) · "More money" rows. Thumb: search + **Record** (brand). A payment = facts · receipt (AI read pill) · buyer · order · thumb Confirm (ok) · Resend · Reject.

**People.** One search in the thumb row, Everything ▾, rows that say which kind of page they open. Person · Supplier · Event pages are folds with the actions in place; dangerous ones under one **Actions** button (reason · typed · log · undo).

**More.** Nine headings; every page is rows; every choice is one dropdown; sliders and prose fold behind ⌄ or ⓘ. **Launch offer** is the one page the supplier side reads. **Switches** is the one page of for-everyone settings.

**Avatar sheet.** Ice Casasola · Switches · Alerts to my phone (switch) · Team & permissions · Admin log · Sign out.

**Search.** The field sits in the thumb row; results above in four bands: Pages · Actions (with the action in the row) · People & orders · Ask Setnayan AI (routes, never acts). "Nothing called X" is an honest line, not a hidden empty.

**Every page:** rows are hairlines, no boxes; one open fold at a time; buttons are `ActionButton` tones (ok = money/commit, brand = forward, info = message, danger = take back, grey = manage); numbers `Count`, meters `Fill`; thumb rows `sn-glass-row`, never on Work (the list is the tool); the list clears the thumb row at rest; failures say **Couldn't load · Retry** in their own place; dark = the shipped tokens (36–38); tour = one MiniTour slide per tab.

**Desktop** (after, with iPhone Duo): the bar becomes the left rail with the same four words; Work keeps the list, the row opens a panel beside it; More's headings are the rail's sub-rows. Nothing different.

**Words:** supplier · event · Event Hub · Problems (not Connection logs) · Categories & event types (not taxonomy) · the owner's own job names. The ≈ 220 visible "vendor" strings go in A-PR10.

---

## 4 · Data — exists vs NEW

**Exists (every row reads it):** `getAdminQueueDigest` + `QUEUE_DEFS` + `peekQueue` + `BASE_ROWS` + `work/actions.ts` settle actions · `approvePaymentCore` + `admin-payment-desk.ts` (exact/short/over · duplicate) + `payment_receipt_reads` · `refundOrder` · `two-admin-promise.ts` thresholds + `admin_approval_requests` · `fetchUgatSearch` (records) + `ADMIN_JOBS` + `admin_search_phrases` + `askTheAdmin` · `users/actions.ts` (confirm email · temp password · revoke sessions · blacklist · hard-delete) · `admin_data_access_log` · `/verify` actions + `vendor_tier_history` · `setVendorTier` · `issueVendorSkuComp` / `executeVendorSkuComp` · `reopen` on `/events/[id]` (#6213) · `setEventFaceMode` · `platform_retail_catalog_v2` · `vendor_billing_catalog` · `platform_package_catalog` · `promo_free_windows` · `discount_codes` · `platform_settings` (fee schedule · identity · VALIDATE · digest · loader · brand · `receiving_accounts` · `setnayan_ai_paywall_enabled` · `referral_program_enabled` · `spotlight_homepage_enabled` · `fee_unlocks_event_enforced`) · `reveal_studio_config` + `setStdVideoModeration` · `nav_slot_override` + `nav-registry-defaults.ts` · `app_telemetry_logs` (Problems) · `admin_audit_log` · `taxonomy_category_requests` + the Categories actions · every Studio/Numbers/Privacy surface behind its `?tab=`.

**NEW (named; the smallest honest shape for each):**
1. **Launch offer (the only new schema).** No new table: five columns on `promo_free_windows` (it already carries audience · active · start/end · **reason**, which L4067 requires): `booking_cap int null` (NULL = a date window as today) · `grants_pro bool default false` · `papic_credits_per_booking int default 0` · `closed_at timestamptz null` (set when the cap lands) · `pro_ends_at timestamptz null` (set with it = end of that platform week, Sun 23:59 PHT, Q2). One new `booking_fee_charges.status` value **`waived_launch`** beside `waived_free5` / `waived_import`. **Counter = a live `count(*)` of `waived_launch` charges** (never a stored number). Three code hooks, no job: (a) `collectBookingFeeAtLock` — if an active window with `booking_cap` exists and `count < cap` → status `waived_launch`, ordinal NOT stamped (Q3), and `grantVendorPapicCreditsForBookingFee` is called with source `launch_offer` and the window's `papic_credits_per_booking` (idempotent on the existing unique index); when the count reaches the cap in the same transaction → `closed_at` + `pro_ends_at`; (b) `resolveVendorTier` — returns `pro` while a `grants_pro` window is open or `now < pro_ends_at` (a derivation, no per-supplier rows — memory: *gated by derivation, not a column*); (c) the emails: "offer ends Sun" to every supplier when `closed_at` is set (`notification-emit`, a new type, email-only per V1). Admin page = the window's row. Supplier reads (frames 22–25, 27, 30, 34, 39) = one `fetchLaunchOffer()` returning `{active, cap, used, closed_at, pro_ends_at, credits}`; a failed read returns `null` → the frames show "couldn't load", never "free".
2. **Needs-action list of items** — no schema: `peekQueue` is widened from "top 3" to "all open" per queue, with the 5 new sources read from existing tables: Refunds owed (`order_refunds` where `status = 'owed'`) · Data-export requests (`admin_data_access_log` rows of type `export_requested` — the request is logged, the export is sent from the Person page) · STD video review (`events.std_media_nsfw = 'in_review'`) · Today's events (`events` dated today × `app_telemetry_logs`) · Privacy (DPO) approvals = `admin_approval_requests` with a new `action_type` `approve_privacy_exception` (an enum value, no table).
3. **Record a payment received** — a `payments` insert from the admin side (the table exists; `payments/actions.ts` has no insert — audit row 15).
4. **Switch writers** for `fee_unlocks_event_enforced` and `spotlight_homepage_enabled` (columns exist, no writer).
5. **Admin pages over existing tables:** Team & permissions (`users.is_internal` + `admin_approval_requests` `promote_to_admin`) · Admin log (`admin_audit_log`) · Announcements (the "Setnayan" thread the supplier design's frame 13 draws — `chat_threads` with a system participant; **this is the one supplier-side read with no writer anywhere**, §8).
6. **Nav slots:** 22 default entries added to `nav-registry-defaults.ts` (the 21 missing admin items + `admin.bottom-nav.money`) and `vendor.more.settings` for S-PR9 — code, not schema.
7. **Tour keys** `admin_work_v1 · admin_money_v1 · admin_people_v1 · admin_launch_v1`.
8. **Launch offer, per side (job 21):** the same window row carries the two switches — `grants_pro` (suppliers' half) and `papic_credits_per_booking > 0` (users' half) — so "turn the users' half off" = set the credits to 0 (no new column); the two "received" counts are live reads: suppliers on Pro free = `count(vendor_profiles)` while the window grants Pro; events that received credits = `count(distinct event_id)` of `vendor_papic_portfolio_credit_grants`/`papic_event_point_grants` rows with source `launch_offer`. **NEW**: the `launch_offer` source value and the per-event grant hook (the decided rule gives the credits to the EVENT when its fee-free booking locks).
9. **Move an unused service to the next event (job 22):** NEW action, no schema — re-point `orders.event_id` and the matching `event_software_activations_v2` row (the EVENT holds the purchase since 2026-10-02, `lib/entitlements.ts`), write two `admin_audit_log` rows (from · to), email the user. "Unused" is read, never guessed: Papic = `papic_event_pool_usage.points_used = 0` AND `papic_seat_day_usage.points_used = 0` AND zero `papic_photos` / `papic_guest_captures` AND no claimed `paparazzi_seats`; Live Watch = no `live_studio` session; Save-the-Date = no render job; Event Hub Pro = no Pro key applied in the hub draft; Setnayan AI = no usage row — where no usage table exists the row says "can't tell" and offers no button. A partly used Papic pass (`points_used > 0`) shows "used N of M" and **does not move** (the data allows "move the remainder" — a later rule if the owner wants it, not assumed). "Next event" = the user's event with the smallest `created_at` after the source event's; none → the row waits (owner ruling).
10. **Freeze (job 12):** account hold = NEW (`users.frozen_at` + reason; `requireUser` refuses while set; lifted from the Person page); shop suspend = exists (fraud suspend/`unsuspendVendor` + verify "Reject → Hidden" + integrity "hide listing"); event hold = NEW (`events.paused_at`; the public hub shows a paused page).
11. **Event Hub additions (jobs 3 · 17):** Event Hub theme loops = NEW (smallest: `scope` column on `homepage_background_videos` — `front-door` | `hub-loop` — plus `name`, `poster_key`, `is_pro`; the Maker's Background ▾ reads the `hub-loop` rows beside the code list); a new reveal opening = **code** (`lib/reveal-config-pure.ts` union) — no admin add, the row says so; themes = the theme maker (admin_final, NEW); the front-door uploads, Patiktok templates, songs and mood-board assets **exist**. Admin **cannot create an event for a user** (no `events` insert under `app/admin`) — NEW and not recommended.
12. **Articles (job 14):** NEW — posts are code (`lib/blog.ts`); the only DB row today is the supplier spotlight on a post (`journal_vendor_spotlights`). Smallest: a `journal_posts` table (slug · title · summary · body · cover_key · status) read by `lib/blog.ts` before the code list.
13. **AI assists (job 18):** exist — receipt read (`payment_receipt_reads`), verify auto-checks + web dossier + deep search (`vendor_web_dossiers`), fraud / integrity scores (`vendor_fraud_scores`, `integrity_flags`), editorial flag scan (`event_editorial`), mood-board NSFW screen (`screen_findings`), STD poster screen, category-request lexical "we think" (`mapCategoryRequest`), the search box with taught phrases + `askTheAdmin`, the 202 prefilled job forms (`?admin_ask=`), the AI brain. **NEW**: the one-line "✦ AI: …" suggestion in each Work row with its evidence one tap away (frame 59) and the Ask door preparing a money action for the owner's confirm (frame 60). Rule: suggests and prepares; never acts; "couldn't read" is a state, never "looks fine".
14. **Service-card Boost (job 20):** NEW — `Service_Card_Boosting_SPEC_2026-09-09.md` is a spec with no code; the Promotions row says "spec".
15. **Reports (job 9):** receipts CSV, legacy pricing CSV, a person's export, the NPC PDF **exist**; "Money by month" and "Admin log CSV" are NEW (reads only).
16. **Not NEW, deliberately:** the booking-fee master switch stays the two env keys (the rail's two-key gate is a safety design, L4067) — Switches shows it read-only. The theme maker, Features page, FAQs & help, Email templates and Guest-import sheet are rows now and their own later PRs (admin_final named them; nothing here depends on them).

---

## 5 · Owner questions (one word each) — recommendation first

**Q1 comes first because it decides whether "one man" is possible at all.**

| # | Question | Recommend | Why |
|---|---|---|---|
| 1 | **Two-admin?** Today these need a SECOND admin in the shipped code (`two-admin-promise.ts` + DB triggers on `admin_approval_requests`): every customer **price change** (`approve_retail_price_change`), a **supplier comp above ₱10,000** (`approve_comp_grant`; a SKU comp always), a **refund above ₱25,000** (`approve_large_refund`), **changing a receiving account** number/name/QR (`approve_payment_account_change`), **promote to admin · grant internal account · grant Team Pool**, a vendor partnership, a fraud wipe-and-ban, a sponsored journal spotlight. With one admin the request **just sits** in Approvals until it expires (72 h for refunds, 7 days otherwise) — the price never changes, the comp never lands. Options: **Keep** two-admin (the owner recruits a second signer) · **Delay** = one admin + typed confirm + a 24-hour delay in which the action is dormant and can be cancelled from Work (the "second eye across time" of the 2026-07-11 plan; the DB `CHECK(approver_id != initiated_by)` is satisfied by a login-less **Custodian** principal that signs after the delay, never deleted) · **Amount** = second admin only above a peso line. | **Delay** | It keeps every audit row and the DB gate, and turns a dead end into a 24-h "Pending · cancel" row on Work (drawn as the Approvals row's "yours · 24 h" state). Receiving-account changes and promote-to-admin keep the delay AND the typed word (Class C). If **Keep**: the design is unchanged and the owner names the second admin; if **Amount**: name the line. |
| 2 | **Users-side?** The launch offer for users' events — only the 50 Papic credits per booked event (what L4825 decided), or something more | **Credits** | L4823–4825 decide nothing else for users; the fee is the supplier's. Frame 57 draws exactly the 50 credits (switch · count · readers); a couple-side free window is the ordinary Free-window tool (frame 46) if ever wanted. |
| 3 | **Rotate?** "Rotating backend data" = the keys/secrets (frame 55: rotate · mark rotated · redeploy) or the demo data (Set up › Demo suppliers: seed · regenerate) | **Keys** | The shipped `/admin/secrets` is the only "rotation" in code; demo data is reseeded, not rotated. |
| 4 | **Phone-edit?** Lift the 2026-08-26/27 rule "the phone answers, it does not edit; search is desktop-only" so prices, switches and the launch offer can be changed from the phone (with the confirm step) | **Yes** | The owner's 2026-10-08 goal is a one-man site run from a phone; the confirm sheet is the safety the old rule was protecting. If No: Switches, Catalogue and Launch offer are read-only on the phone and §10 jobs 5 and 7 are desktop. |
| 5 | **Week?** The launch offer's "end of that week" = the **platform week** (Sun 23:59 PHT) or each supplier's own 4-week cycle | **Platform** | One date every supplier can read on Today; a per-supplier end means 1,384 different dates. L4824 asked the build to confirm this. |

**Decided here, not asked** (say so if wrong): More has **nine** headings (admin_final's 12 with Talk to users → Growth and Costs → Numbers; one phone screen) · a launch-offer booking does **not** consume a supplier's first-5-free ordinal (one reason per fee row: launch offer → first-5 → import) · Intelligence merges into **Demand** · **Job 22 is ruled by the owner** (2026-10-08, verbatim: *"we wait for their next event"*) — no admin pick; see §12.

Nothing above contradicts a locked row except Q4, which asks to lift one on purpose. Rows checked: L4560 (bar · Confirm-only-when-AI-matched · simple names), L4576 (Reopen stays), L4654 (Root map name), L4658 (no owner page for the map), L4662–4665, L4067 (three money-switch answers — inherited), L4824–4825 (B · 50 credits), L4645 (GCash + BDO until a real channel — the accounts list is a shape, not a new account), L4859.

---

## 6 · Build plan — PR-sized, in order (Opus builds; each PR ends with a 375 side-by-side, prototype left · build right; no merge before the owner's ok)

| PR | Scope | Touches | Schema | Must land before |
|---|---|---|---|---|
| **A-PR2** *(first — the supplier plan reads it)* | **Launch offer**: the five columns + `waived_launch` + the three hooks + `fetchLaunchOffer()` + the admin page (frames 21–23) with Apply/End confirm sheets; the Work line. Honest read: `null` → "couldn't load". | `supabase/migrations` (one), `lib/booking-fee-lock.ts`, `lib/sku-activation.ts`, `lib/vendor-tier*.ts`, `app/admin/pricing/_surfaces/launch-offer-surface.tsx`, `lib/launch-offer.ts` | **yes** (5 cols + 1 status value; Ugat map: a joint claim on `promo_free_windows`, baseline line) | **S-PR1** (frame 22) · **S-PR4** (30) · **S-PR9** (23–25, 27) · **S-PR11** (34) · the couple Suppliers page fee line |
| **A-PR0** | Foundations: admin shell (bar Work · Money · People · More; search door on the phone; avatar sheet), `ActionButton`/`Count`/`Fill` adopted in `app/admin/_components`, **`AdminConfirm` sheet** (what · to whom · reason · typed · tone), honest-read helper shared with `ReadFailed`, MiniTour keys. Guard: no `<button>` without `ActionButton` in swept admin files; no `window.confirm` in `app/admin`. | `layout.tsx`, `_components/*`, `lib/tours.ts` | none | A-PR1 |
| **A-PR1** | **Work** = the Needs-action list: items from the 16 sources (`peekQueue` → all open; 5 new sources from existing tables), Show ▾, groups, row actions through `AdminConfirm`, Undo, calm/fail/done states, badge dot, Today's events; `/work` + `/queues` + the FAB + the tiles retired; `the-overview-shows-what-it-counts` rewritten to "every counted queue has a Work group". | `app/admin/page.tsx` (shrinks), `work/`, `queues/`, `lib/admin/queue-peek.ts`, `lib/admin/work-rows.ts` | none (one `action_type` enum value) | — |
| **A-PR3** | **Money**: three numbers · Show ▾ · rows · payment page · Record a payment received · **Our accounts** as a list · honest reads (09-30 rows 1–3, 6, 13–19) · batch "Confirm all clean". `/money` card grid retired. | `payments/`, `money/`, `settings/payment-methods/`, `payouts/`, `subscriptions/`, `booking-fees/`, `receipts/` | none | — |
| **A-PR4** | **People**: one search (author the five `UgatSearchHit.href`s), Person · Supplier · Event pages with actions in place, Account actions (ban · delete · force-delete) through `AdminConfirm`, View as (read-only, logged), face-mode honest, "Ask for more" state; `/directory`, `/accounts` tabs, `/gifts` + `/vendors/[id]/plan` duplicates fold in; `/edit` kept for unclaimed shops. | `accounts/`, `users/`, `vendors/`, `events/`, `verify/`, `gifts/`, `verification-docs/`, `directory/` | none | **S-PR7** (Verified fold reads the "needs more" state) |
| **A-PR5** | **Pricing & offers + Catalogue**: rows, retired fold, supplier-plan title edit (`saveVendorRow` + title), fee schedule row, free windows with required reason, discount codes rows, two-admin price change through `AdminConfirm`; `/pricing` tabs → rows. | `pricing/`, `discount-codes/`, `founder-seats/` | none | **S-PR9** (plan names read from `vendor_billing_catalog`) |
| **A-PR6** | **Admin heading**: Switches (writers for the two orphan columns; every switch through `AdminConfirm` with the affected count; env flags read-only) · Business details · Integrations · Secrets (Save locked on a failed read) · **Menus & icons** rows + the 22 missing admin slots + `vendor.more.settings` · **Team & permissions** (new page) · **Admin log** (new page) · avatar sheet rows · digest "last sent". | `settings/`, `integrations/`, `secrets/`, `ugat/_surfaces/menus*`, `lib/nav-registry-defaults.ts`, new `admin/team/`, `admin/log/` | none | **S-PR9 / S-PR10** (the renamable slots for the rows that moved) — or S-PR9 adds its own slot defaults and this PR only adds the admin ones |
| **A-PR7** | **Templates + Media**: Reveal Studio rows + Look fold + switch confirms + STD video queue (also a Work row); themes list (the maker is a later PR); Patiktok · Songs · Mood board library (approve/decline rows) · All creations · Front door media (background videos + website media merged) · Papic storage. | `studio/`, `reveal-studio/`, `background-videos/`, `website-media/`, `moodboard-renders/`, `papic-storage/` | none | — |
| **A-PR8** | **Numbers + Problems + Growth + Content + Privacy + Set up**: hub tabs → rows on heading pages; Problems page (rename, trace in place, Mark fixed/Ignore); dead `time-log` link out; Demand + Intelligence (Q5); Privacy rows = Work rows; Set up rows (Screens read-only). | `app-performance/`, `connection-logs/`, `demand/`, `data-privacy/`, `compliance/`, `ugat/`, `search-memory/`, `categories/` (door only) | none | — |
| **A-PR9** | **Announcements** (Growth): the "Setnayan" system thread writer (`chat_threads` with a system participant + a compose row with audience ▾); feeds the supplier Messages frame 13 and couple notices. | new `admin/announcements/`, `lib/chat.ts` | none (a system participant row) | the supplier Messages "Setnayan thread" (S-PR1/S-PR9 draw it) |
| **A-PR10** | **Words + honest reads + tours + desktop**: ≈ 220 "vendor" strings, developer text and raw `error.message` (09-30 rows 43–46), remaining empty-state rows (28–36), four MiniTours, the rail = the bar opened out (with the Desktop + iPhone Duo work, L4854). | ≈ 65 admin files, `_components/` | none | — |

**One sequence with the supplier plan:** **A-PR2 → S-PR0 … S-PR8 → A-PR0 → A-PR1 → A-PR4 → A-PR5 → A-PR6 → S-PR9 → S-PR10 → A-PR3 → A-PR7 → A-PR8 → A-PR9 → S-PR11 → S-PR12 → A-PR10.** A-PR2 is tiny and first because four supplier frames and the couple fee line read it; if the owner wants admin strictly after suppliers, S-PR1/4/9/11 render their launch-offer rows as "not yet" until A-PR2 lands (the same "not yet" rule S-PR11 uses for the S2 scan).

Each PR: typecheck · lint (root `pnpm lint`) · unit from `apps/web` · the admin guards (`admin-reads-say-couldnt-read`, `admin-says-supplier`, `the-console-speaks-english`, `settling-from-the-list-stays-honest`, `the-phone-answers-it-does-not-edit` **rewritten if Q4 = Yes**, `admin-map-is-generated`, `admin-jobs-are-generated` — the generated maps are re-scanned, never hand-edited) · one sabotage seen red · draft PR, `do-not-auto-merge`, owner ok on the side-by-side first. If a step needs a migration or a protected guard the plan does not name: stop and report.

---

## 7 · Connections — every admin control a supplier frame, an S-PR or a couple screen depends on

| Admin control | Where it lives in this design (frame) | Who reads it | Exists today? |
|---|---|---|---|
| Launch offer: on/off · cap · live count · closed date · Pro end date · rule A/B · week boundary | Launch offer (21–23) + the Work line (01) | Supplier **22** (Today line: used · cap) · **23** (Plan fold: used · cap · end · Pro free) · **24** (ending state) · **25** (store shell read-only) · **27** (picture sheet "Pro · free · launch offer") · **30** (fee row "free · launch offer · ₱0") · **39** (quote fee line) · S-PR1 · S-PR4 · S-PR9 · S-PR11 · couple Suppliers page fee line | **NEW** (A-PR2) |
| Launch offer · users' half: `papic_credits_per_booking` (switch = 0/50) · events-received count | Launch offer (57) › For users' events | couple: the event's **Papic credits** line ("50 free · launch offer") · **Suppliers › Booked row** ("booking fee waived · launch offer") · Home/Budget fee line ₱0 · supplier **34** (the same grant) | **NEW** (A-PR2) |
| Launch offer · suppliers' half: `grants_pro` · suppliers-on-Pro count | Launch offer (57) › For suppliers | Supplier **23 · 27** (Plan status) · S-PR9 | **NEW** (A-PR2) |
| 50 Papic credits per fee-free booking | Launch offer row (21 · 57) | Supplier **34** (Event Hub › Papic "50 free with this booking") · S-PR11 | grant function exists (`grantVendorPapicCreditsForBookingFee`); the 50 rule + `launch_offer` source **NEW** (A-PR2) |
| Booking-fee schedule (rate · tail · tier-1 limit) · ₱50 min · first-5 free | Pricing & offers › Booking fee (20) | Supplier **05** (Money › Setnayan fees) · **30** · **39** · customer card fee row · S-PR4 · couple Suppliers page | exists (`/pricing`, `platform_settings`) |
| Booking-fee master switch (two env keys) | Switches, read-only "env · on" (25) | every fee row (fails toward the locked default) | exists (env); stays env by design |
| Fee unlocks the event (`fee_unlocks_event_enforced`) | Switches (25) | Supplier **06 · 19** (customer card Brief rows redacted before the fee) · **12** (Event Hub fee row "Pay to open") · S-PR5 · S-PR11 · `get_vendor_event_brief` | column exists, **writer NEW** (A-PR6) |
| Free windows (`promo_free_windows`, reason required) | Pricing & offers › Free windows (20) | Supplier **30** ("free · promo") · couple free Save-the-Date | exists |
| Supplier plan prices + titles (`vendor_billing_catalog`) | Catalogue › Supplier plans (24) | Supplier **23 · 26** ("₱— read from the catalogue") · **27** · S-PR9 | prices exist; **title edit NEW** (A-PR5) |
| Customer catalogue (`platform_retail_catalog_v2`) · two-admin price change | Catalogue (24) + Approvals (18) | couple checkout · /features · Add-ons "₱—" | exists |
| Set tier / comp a SKU / founding supplier | Supplier page › Plan fold (12) · Gifts & comps (09) | Supplier **23 · 27** (Plan status) · **26** (Add-ons on) | exists (`setVendorTier`, `issueVendorSkuComp`) |
| Subscription approval (`approve_vendor_subscription`) | Work row (01) · Supplier page › Money (12) | Supplier **23** (renews Oct 31) | exists |
| Payment approval (`approvePaymentCore`) · refund · record a payment | Work row + confirm (01 · 04) · Money (06) · payment (07) · Record (08) | Supplier **05** (Received) · **30** (fee bill paid) · **34** (credits granted on approval, J19/J49) · couple purchase unlock + receipt | exists; **Record NEW** (A-PR3) |
| Verification approve / reject / ask for more / listing visibility | Supplier page › Verification + Approve (12 · 13) · Work row | Supplier **08** (Page › Verified fold, the one place) · **07** (services publish gate) · S-PR7 | exists; the "needs more" state must be drawn on 08 (§8) |
| Payment options approval (`vendor_payment_methods`) | Work row (Suppliers) · Supplier page › Money (12) | Supplier **14** (Settings › Getting paid rows) · S-PR9 | exists |
| Partnerships approval | People › Partnerships row (09) · Work row | Supplier **33** (More tools › Partnerships) · S-PR12 | exists |
| Corrections (locked profile details) | Work row (Suppliers) | Supplier **08** (Profile "Something wrong?") · S-PR7 | exists |
| Mood board library approve / decline (+ reason) | Media › Mood board library | Supplier **33** ("1 declined: too dark", J45) · S-PR12 | exists |
| Review override / appeals · chat flags · completions (force-complete) · disputes · force majeure | Work rows (Safety · Suppliers · Resolve) + case pages (16) | Supplier **08** (Reviews) · **36** (thread) · **34** (Hand over / J47) · **33** (Disputes) · S-PR11 · S-PR12 | exists |
| Reveal Studio: template switches · default · features · STD video review | Templates › Reveal Studio (27) + switch confirm (26) + Work row | couple Save-the-Date page + `reveal-overlay-server.tsx` + Maker "made once"; the supplier side does not read it | exists |
| Renamable nav slots (`vendor.sidebar.*`, `vendor.bottom-nav.*`, `vendor.more.settings`, `customer.*`, `public.*`) | Admin › Menus & icons (33) | S-PR9 · S-PR10 (the rows that moved) · every supplier/couple bar | editor exists (`/ugat?tab=menus`); **22 admin slots + `vendor.more.settings` defaults NEW** (A-PR6; S-PR9 may add its own) |
| Categories & event types · category requests | Content › Categories (31) · Work row | Supplier **07** (Services › Coverage) · onboarding · couple Explore | exists (approved page) |
| Receiving accounts list (BDO · GCash · QR Ph) | Money › Our accounts (34) | couple pay page · supplier fee bill "Pay" (**30**) | exists as two fixed fields; **list NEW** (A-PR3, owner 10-01) |
| Reopen guest list · face tagging | Event page (14) | couple Guests page · Papic | exists (L4576) |
| Demo suppliers (seed · hide one) | Set up › Demo suppliers | couple Suppliers page | exists (hide one: NEW, 09-30 §2d — in A-PR4) |
| Flags with a UI (AI paywall · referrals · spotlight · package credit d8 · demo mode · digest · VALIDATE) | Switches (25) | couple AI paywall · referral program · front door · package credit | exist; spotlight **writer NEW** |
| Announcements ("Setnayan" thread) | Growth › Announcements | Supplier **13** (Messages: the Setnayan thread) · **37** (Recent) | **NEW** (A-PR9) |

---

## 8 · Found in the supplier design (not edited there — the exact line and the fix)

1. **L19** *"Nothing new is needed. Every row in the prototype reads data that already exists."* and **§4 L162–168** (the NEW list) omit the launch-offer read, while **L218** says *"Counts read the admin config … NEW read"* and **L371** says *"it is NEW code (S-PR9 reads it; the admin page is the Admin build's)"*. Fix: add item 6 to §4 — "`fetchLaunchOffer()` (A-PR2) read by frames 22–25, 27, 30, 39; rows show 'not yet' until it lands" — and soften L19 to "nothing new except the launch-offer read".
2. **L169** *"the launch offer (L4824) is an admin config, it only changes which fee rows appear"* — it also changes the **plan** (Pro free for all, frames 23 · 27), the **credits** (frame 34) and the **end date** (24). Fix: "it changes the fee rows, the Plan fold's state, the Papic credit line and the end date".
3. **L240** frame 34 *"Credits (50 free with this booking)"* — the 50 is a typed number; it must read `papic_credits_per_booking` from the offer (admin-editable, L4825). Fix: "Credits (N free with this booking — N from the launch offer)". Same for **L218/L219** "1,240 of 2,000": the 2,000 is the editable cap.
4. **L202 S-PR9** builds *"Plan (launch-offer states …)"* with **no dependency named**; the admin page that writes the config is not in the S plan. Fix: add "needs A-PR2" to S-PR1, S-PR4, S-PR9, S-PR11 (or the "not yet" rule of §6 above).
5. **L89** *"the three verify states become one summary line — the one place it is shown"* — the admin has five outcomes (draft · pending review · in review · **needs more** ("Ask for more…") · approved) plus listing visibility (hidden · archived · withdrawn). Fix: the Verified fold's line carries "needs: Mayor's permit" when the admin asked for more, and "hidden" when visibility was refused.
6. **L126** *"Setnayan's own notices appear as one 'Setnayan' thread"* (frame 13) and **L236** — no admin surface can write such a thread today. Fix: name A-PR9 (Announcements) as the writer, or draw the thread as "later".
7. **L227** *"Fee rows carry '2 of 5 free used'"* and frame 30 *"free · launch offer · ₱0"* — two waiver rules can both apply to one booking; which the row says is undefined. Fix: one reason per row in this order: launch offer → first-5 → import; and a launch-offer booking does not consume an ordinal (owner Q3).
8. **L247 (§8 row 12)** *"renamable slots follow the rows that moved"* — the editor can only rename label/icon of slots that exist in `nav-registry-defaults.ts`; `vendor.more.settings` and any new row need a code default first. Fix: S-PR9 adds the defaults (or waits for A-PR6) — stated, not assumed.
9. **L97** *"Prices read from `vendor_billing_catalog` (never a constant)"* — titles are not editable from admin today (audit row 22), so the Plan ▾ names are code-named until A-PR5. Fix: note "titles editable after A-PR5".
10. **L351–367** (Plan features table) has no row for **payment options approval** (supplier frame 14 rows show "approved" — an admin verdict, `vendor_payment_methods`). Fix: add a row "Getting paid rows read the admin verdict".
*(Re-read at the end of this pass: the other designer's "service card maker" amendment had not landed in the doc at commit time; if it adds a supplier-authored service card, the admin Catalogue is not its home — supplier service cards stay `vendor_services`, admin only sees them on the Supplier page › Services fold.)*

---

## 9 · Map — connected (every tap lands; every screen has a way back; one thing is reached one way)

**Screen → screen** (prototype `data-go` targets; ‹ = back target):

```
Work ─ Next card ──► confirm sheet (Confirm) · Payment (The receipt)
     ─ launch line ► Launch offer ‹ Pricing & offers
     ─ numbers ───► Work (Show ▾)
     ─ rows ──────► confirm sheet (Confirm · Approve · Refund · Send) · Payment (Match) · Supplier (Open) · Person (Open) · Event (Open) · Approvals · Report · Help · Problems
Search door (every page) ──► Search ‹ Work ──► Money · Approvals · People · Supplier · confirm (Confirm a payment) · Ask
Avatar (every page) ──► avatar sheet ──► Switches ‹ Admin · Admin (Team · Log) · sign out
Money ──► Payment ‹ Money · confirm (Confirm) · Our accounts ‹ Money · Fees owed ‹ Money · Receipts ‹ Money · Catalogue ‹ Pricing & offers   thumb: search · Record (sheet)
Payment ‹ Money ──► Person (Buyer)   thumb: Confirm (sheet) · Resend · Reject
People ──► Person ‹ People · Supplier ‹ People · Event ‹ People · ID documents · Gifts & comps · Partnerships   thumb: search · Add
Person ‹ People ──► Event · Payment (Confirm) · Problems · confirm (Send export)   thumb: Message · View as · Actions (Ban / Delete sheet)
Supplier ‹ People ──► confirm (Approve · Confirm) · Approvals (Comp)   thumb: Approve (sheet) · Message · Reject
Event ‹ People ──► confirm (Reopen) · People (Suppliers) · Money · Problems · Person (hosts)   thumb: Message hosts · Event Hub · Actions (force-delete sheet)
Help ‹ Work ──► Problems (same as #41) · Person   thumb: reply · Send
Report ‹ Work ──► Person (reporter · hosts)   thumb: Hide photo · Dismiss · Block
Problems ‹ Work ──► issue folds (Mark fixed · Ignore) · Fixing #41
Approvals ‹ Work ──► confirm (Approve)   thumb: New request
More sheet ──► Pricing & offers · Content · Templates · Media · Growth · Numbers · Privacy · Set up · Admin  (each ‹ More)
Pricing & offers ──► Launch offer · Catalogue · Gifts & comps (free windows · founder seats) · Discount codes · Numbers (price bands)
Launch offer ‹ Pricing & offers ──► confirm (Apply · End now)   thumb: Apply · Discard   (ended: New window)
Catalogue ‹ Pricing & offers ──► row opens in place → confirm (Send for approval)   thumb: search · Add
Content ──► Categories ‹ Content (Approve in the row → confirm)   Templates ──► Event Hub themes · Reveal Studio (switch → confirm)
Media · Growth · Numbers (► Problems) · Privacy (► Work rows) · Set up · Admin (► Switches ► confirm · Our accounts)
```
**One thing, one way:** a payment is the same Payment page from the Next card, the Work row, Money, the Person page and search. A supplier's verification is the same Supplier page from the Work row, People and search. The launch offer is the same page from the Work line and Pricing & offers. Switches is the same page from the avatar and Admin. Deletions and exports are the same rows on Work and Privacy.

**Admin Ugat nodes → the screen that shows / acts on them** (`lib/ugat/graph.ts` `UGAT_TYPES`, 25; joints `UGAT_JOINTS` J1–J51):

| Node (table) | Screen | Joints acted on |
|---|---|---|
| Users (`users`) | People › Person (10) — the stub `/admin/users` now lands on People | J14 (tallies only, RA 10173) |
| Events (`events`) | People › Event (14) · Work › Today's events | J37 (schedule), face mode |
| Guests (`guests`) | Event › Guest list (Reopen) · People search (fenced) | — |
| Vendors (`vendor_profiles`) | People › Supplier (12) | J2 (claim approval) · J32 (verification) · J10 (tier) |
| Service cards (`vendor_services`) | Supplier › Services fold · Content › Categories › Coverage | J8 · J34 |
| Orders & activations (`orders`) | Money (06) · Payment (07) · Work › Money | J9 (reconciliation approve) · J19 (entitlement on approval) |
| Threads (`chat_threads`) | Work › Safety (chat flags) · Growth › Announcements (system thread) | J5 |
| Billing (`vendor_subscriptions`) | Work row · Supplier › Money · Money › Show ▾ Subscriptions | J10 |
| Taxonomy (`canonical_service_taxonomy`) | Content › Categories (31) | requests |
| Group (`communities`) | Person › People on their events (tallies) | J14 |
| Papic (`paparazzi_seats`) | Event › Papic · Money (Papic orders) · Launch offer (credits) | J19 · J20 · J49 |
| Person (`people`) | People search · Person › People on their events | — |
| Package (`vendor_packages`) | Supplier › Services fold | J24 |
| Proposal (`vendor_proposals`) | Money › Needs a quote · Supplier › Money | J25 |
| Contract (`vendor_contracts`) | Supplier › Money (read) · Work › Resolve (disputes) | J26 · J27 |
| Availability (`vendor_schedule_pools`) | Supplier › Services fold (capacity line) | J29 · J30 |
| Geography (`regions`) | Pricing & offers › Market price bands · Numbers › Demand | — |
| Seat Plan (`event_tables`) | Event (read: "seat plan · N tables") | — |
| Run of Show (`event_schedule_blocks`) | Event › Problems / Today's events | J37 |
| Live Watch (`panood_camera_operators`) | Numbers › Costs › Live Watch channels · Work › Today's events | — |
| Mood Board renders (`event_renders`) | Media › All creations | J42 · J43 |
| Mood Board library (`moodboard_library_assets`) | Media › Mood board library (approve / decline + reason = the `screen_findings` queue) | J45 |
| Design sign-off (`moodboard_part_finalizations`) | Work › Suppliers › Completions row (force-complete) | J47 |
| Colour access (`event_colour_grants`) | Event (read) | J48 |
| Wedding March (`march_walks`) | Event (read) | — |

---

## 10 · The ten jobs of a one-person operator — taps from Work

A tap = one press that changes the screen or opens a control; typing is not counted. "Today" = the shipped phone (bar Today · People · Money · More + FAB), origin/main. **The confirm sheet's own button is shown as "+1"** — it is the deliberate tap R13 demands and it is never the way *to* a control.

| Job | Today (shipped) | Redesign | ≤3? |
|---|---|---|---|
| Approve a payment | FAB › `/payments` › Approve › dialog Confirm = **3** (and the list lies on a failed read) | Work › **Confirm** on the Next card (+1 in the sheet) = **1 (+1)** | ✓ |
| Verify a supplier | More › Verify › card › Approve › dialog = **4** | Work › **Open** › **Approve** (+1) = **2 (+1)** | ✓ |
| Answer a support message | More › Help › message › status ▾ · notes · Update — **no reply field; reply by email = 4+** | Work › **Reply** › **Send** = **2** | ✓ |
| See today's money | Money tab = **1** (revenue summary; ledger read drops errors) | **Money** = **1** (three numbers; a failed read says so) | ✓ |
| Switch a feature off fast | More › Studio › Reveal Studio tab › switch › Save = **5** (no "who is affected") | Avatar › **Switches** › switch (+1 with the hub count) = **3 (+1)**; search › "reveal" › switch = 3 | ✓ |
| Check the launch counter | — (does not exist) | **0** — the Work line reads it; 1 tap opens the page | ✓ |
| Fix a wrong price | More › Money › Pricing › find the row › field › Save all = **5** (two-admin request after) | Money › **Catalogue** › price field (+1 Send for approval) = **3 (+1)**; search › "papic pass" › Edit = 3 | ✓ |
| Find any user / event / supplier | People › Users card › search form › result = **3** (no record search on the phone) | Search door › type › result = **2** | ✓ |
| Reopen something for a customer (guest list) | **no path** — `/events/[id]` is reachable only by URL | Search › event › **Reopen** (+1) = **3 (+1)** | ✓ |
| See what broke | More › Numbers › Connection logs tab = **3** | Work › **Problems** row = **1** (or Numbers › Problems = 3) | ✓ |

**Totals: today 24 taps for the eight jobs that are possible (two impossible) → redesign 18 taps for all ten, every one ≤ 3** (+6 deliberate confirm taps where money moves, everyone is affected or a thing cannot be undone).

---

## 11 · Coverage — every route · Ugat node · money/plan control → its home · taps from Work (no value above 3; zero blanks)

Doors that count as a tap: a bar tab (1) · a row on a bar page (2) · a row on a sub-page or heading page (3) · the More sheet (1) → heading (2) → row (3) · the search door (1) → a result (2) · the avatar (1) → a row (2) · a Work row (1). Dynamic record pages are reached from a list row or a search result.

**Routes (`app/admin/*` on origin/main — 59 pages · 36 redirect stubs · dynamic pages)**

| Route | Home (frame) | Taps |
|---|---|---|
| `/admin` | Work (01–05 · 35 · 36) | 0 |
| `/admin/work` · `/admin/queues` (stub) | Work — merged; both redirect | 0 |
| `/admin/approvals` | Work › Approvals row → Approvals (18) | 1 |
| `/admin/help` | Work › Safety row → Help (15) | 1 |
| `/admin/disputes` · `/force-majeure` · `/force-majeure/[flagId]` · `/user-reports` · `/fraud` · `/concierge-abuse` · `/integrity-watch` · `/repost-watch` · `/chat-flags` · `/reviews` · `/editorial-review` · `/editorial-review/[id]` · `/completions` · `/corrections` · `/pax-changes` · `/pakanta` | Work rows (Safety · Suppliers · Resolve) → the case page (16) — each queue's page keeps its URL as the "Open" target; pax-changes is a trail row under Numbers › Problems as well | 1 (row) · 2 (case) |
| `/admin/account-deletions` · `/event-deletions` | Work › Privacy rows → Person / Event page; also Privacy (32) | 1 · 2 |
| `/admin/connection-logs` (stub) · `/app-performance?tab=connection-logs` | Problems (17): Work row 1 · More › Numbers › Problems 3 | 1 |
| `/admin/payments` | Money (06) · Payment (07) | 1 · 2 |
| `/admin/money` | Money (06) — the card grid retired | 1 |
| `/admin/payouts` · `/subscriptions` · `/booking-fees` · `/receipts` · `/payment-options` | Money › Show ▾ / More money rows (06 · fees · receipts); payment options also a Work row | 2 |
| `/admin/settings/payment-methods` | Money › Our accounts (34) | 2 |
| `/admin/pricing` (+ `?tab=pricing` · `custom-plans` · `price-bands` · `setnayan-ai` · `papic-shots` · `free-windows`) · `/addons` (stub) · `/custom-plans` (stub) · `/price-bands` (stub) | More › Pricing & offers (20) → rows; Catalogue (24) also Money › Catalogue | 2 · 3 (Catalogue 2) |
| `/admin/discount-codes` (stub) · `/discount-codes/new` · `/discount-codes/[id]/edit` | Pricing & offers › Money off (44 · 45; a row = edit in place; New ▾ in the thumb row) | 3 |
| `/admin/founder-seats` | Pricing & offers › Founder seats (also Gifts & comps) | 3 |
| `/admin/gifts` | People › Gifts & comps (09) | 2 |
| `/admin/vendor-recommendations` | Pricing & offers › Supplier recommendations | 3 |
| `/admin/accounts` (+ `?tab=users` · `vendors` · `events` · `venues` · `demo-vendors`) · `/users` · `/vendors` · `/events` · `/venues` (stubs) · `/directory` | People (09) with Everything ▾ (stubs land with the filter set) | 1 |
| `/admin/users/[userId]` | Person (10 · 11) — from a People row or search | 2 |
| `/admin/vendors/[id]` · `/vendors/[id]/plan` · `/vendors/[id]/team` | Supplier (12 · 13) — plan and team are folds | 2 |
| `/admin/vendors/[id]/edit` | Supplier › Services/Profile fold "Edit" (unclaimed shops only) | 3 |
| `/admin/events/[eventId]` | Event (14) — from a People row, search, or a Work "Today's events" row | 1–2 |
| `/admin/venues/new` · `/venues/[id]` | People › Venues (61 · 62; the data-list pattern; Add in the thumb row) | 2 · 3 |
| `/admin/verify` | Supplier › Verification fold (12); Work row "Verify …"; People › Everything ▾ To verify | 1 · 2 |
| `/admin/verification-docs` | People › ID documents (09) | 2 |
| `/admin/vendor-partnerships` | People › Partnerships (09) · Work row | 1 · 2 |
| `/admin/demo-vendors` (stub) · `/demo-vendors/inquiries` · `/demo-vendors/inquiries/[threadId]` | Set up › Demo suppliers (People › Everything ▾ Demo suppliers) › Inquiries row › thread | 3 (search 2) |
| `/admin/more` | The More sheet (19) | 1 |
| `/admin/studio` (+ `?tab=website` · `reveal-studio` · `recaps` · `real-stories` · `storytellers` · `patiktok` · `songs` · `moodboard-library` · `spotlight-awards` · `journal-spotlights` · `discount-codes` · `referrals` · `social-queue`) and the stubs `/website` · `/reveal-studio` · `/recaps` · `/real-stories` · `/patiktok` · `/songs` · `/moodboard-library` · `/spotlight-awards` · `/journal-spotlights` · `/referrals` · `/social-queue` | Templates (Reveal Studio 27 · Add to the Event Hub 42 · Patiktok) · Media (Songs · Mood board library · All creations incl. recaps) · Growth › **Promotions** (64: Real Stories incl. storytellers · Spotlight Awards · Social queue · Referrals · journal spotlights) · Growth › Front door · Content › Articles (53) · Pricing & offers › Money off (44: discount codes) | 3 |
| `/admin/background-videos` · `/website-media` | Media › Front door media → Add a video (43) · Templates › Add to the Event Hub (42) | 3 |
| `/admin/moodboard-renders` | Media › All creations | 3 |
| `/admin/papic-storage` | Media › Papic storage (also Numbers › Costs) | 3 |
| `/admin/live-studio-channels` (flag-gated) | Numbers › Costs › Live Watch channels | 3 |
| `/admin/categories` | Content › Categories (31) | 3 (Work row for a request: 1) |
| `/admin/ugat` (+ `?tab=onboarding` · `brain` · `menus` · `screens`) · `/ugat/map` · stubs `/brain` · `/onboarding` · `/menus` | Set up › Onboarding · AI brain · Screens (map, read-only); Menus & icons → Admin › Menus & icons (33) | 3 |
| `/admin/search-memory` | Set up › Search memory | 3 |
| `/admin/app-performance` (+ `?tab=growth` · `intelligence` · `funnels` · `seo` · `operations` · `offline` · `interconnections` · `browser-blocks`) · stubs `/growth` · `/insights` · `/intelligence` · `/funnels` · `/seo` · `/operations-hiring` · `/offline` · `/demand` | Numbers (30): rows Sign-ups & retention · Demand (+Intelligence) · Funnels · Costs (Expenses & hiring) · Offline · Interconnections · Browser blocks; SEO under Growth | 2 (Numbers) · 3 (row) |
| `/admin/data-privacy` (+ `?tab=controls` · `coverage` · `deletions` · `checklist` · `documents`) · `/compliance` (stub) · `/compliance/data-sheet` · `/npc-readiness` (stub) · `/settings?tab=compliance` | Privacy (32): NPC filing row (controls · checklist · data sheet · documents), Deletions due, Data-export, Event removals, Who viewed | 2 (Privacy) · 3 (row) |
| `/admin/settings` (+ `?tab=settings` · `notifications` · `demo-mode`) · `/notifications` (stub) · `/settings/demo-mode` (stub) | Admin › Switches (25, incl. demo mode) · Business details; notifications → the avatar sheet (29) | 2 (avatar) · 3 |
| `/admin/integrations` · `/secrets` | Admin › Integrations · Secrets (55: rotate · mark · redeploy) | 3 |
| `/admin/budget-planner` | Pricing & offers › Budget benchmarks (63) | 3 |
| `/dashboard/profile` ("My account") | Avatar sheet › Ice Casasola | 2 |
| `/admin/storytellers` (actions only, no page) | Growth › Real Stories (feature chapter · rank live there) | 3 |
| `/admin/addons/pricing-report` (route, CSV) | Numbers › Reports (56) | 3 |
| **The owner's 22 jobs** (frames 39–66) | §12 — each ≤ 3 taps; new pages: Add to the Event Hub (42) · Add a video (43) · Money off (44) · Give a comp (47) · Fix it (49 · 50) · Articles (53) · Secrets (55) · Reports (56) · Launch offer two halves (57) · Ask (60) · Venues (61) · Benchmarks (63) · Promotions (64) | 1–3 |

**Ugat nodes (25):** every node has a screen in §9 — taps: Users/Events/Vendors/Guests/Person 1–2 (People, search) · Orders/Billing/Proposal 1–2 (Money, Work) · Taxonomy 3 (Content › Categories; a request 1) · Service cards/Package/Availability/Contract 2 (Supplier page folds) · Papic 1–2 (Event, Launch offer) · Threads 1 (Work › Safety) · Group/Seat Plan/Run of Show/Colour access/Wedding March 2 (Event / Person) · Geography 3 (Pricing › Market bands) · Live Watch 3 (Numbers › Costs) · Mood Board renders/library 3 (Media) · Design sign-off 1 (Work › Completions row).

**Money / plan controls:** launch offer 0–1 (Work line) · booking-fee schedule 3 · fee master switch (read-only) 2 (avatar › Switches) · fee unlock switch 2 · free windows 3 · catalogue price 2–3 · supplier plan prices/titles 2–3 · set tier / comp 2 (Supplier page) · subscription approve 1 (Work row) · payment approve 1 · refund 1 (Work row) · record a payment 2 (Money › Record) · receiving accounts 2 · founder seats 3 · discount codes 3 · Papic shot prices 3 · AI prices 3 · custom plans 3 · two-admin approvals 1 · for-everyone switches 2 (+1 confirm) · Reveal Studio switches 3 (+1) · renamable slots 3 · verification 1–2 · reopen guest list 2–3 · ban / delete / force-delete 2–3 (+1 typed).

**Retired, and where its job went:** `/admin/work` + `/queues` → Work · `/money` grid → Money rows · `/directory` + `/more` grids → People + the More sheet · the FAB → the Next card · the Overview's 53 tiles/cards → Work + People's counts line + Admin log · five hub tab strips → heading-page rows (URLs kept) · `/vendors/[id]/plan` + `/gifts` supplier half → Supplier › Plan fold (Gifts & comps keeps the all-in-one view) · `/ugat/map`'s search box → People's search · the "Edit in X ↗" links on Integrity/Repost watch → the Supplier page.

---

## 12 · The owner's 22 jobs — job · frame · taps from Work · exists today / NEW

Owner, verbatim, 2026-10-08 (*"did you complete all the tasks?"*). Taps counted as in §10; "+1" = the confirm sheet's own button.

| # | Job (owner's words) | Frame | Taps from Work | Exists today / NEW |
|---|---|---|---|---|
| 1 | "Creating more categories?" | 31 Categories · **39 New category** (name · group · icon · shows for · search words · book by · hidden) · approve a request in the Work row | More › Content › Categories › Add = 3 (+1 Create); a request: Work row 1 | exists (`/admin/categories` actions) |
| 2 | "Creating new events?" | **40 Event types** · **41 An event type** (name · group · icon · words · questions · deadlines · religion asked · categories · status) | Content › Categories › Event types = 3 | event TYPES exist (`createEventTypeRoster`, `setEventTypeStatus`, `updateEventTypePresentation`, refinements, deadlines); creating an EVENT for a user = **not possible today**, NEW and not recommended |
| 3 | "Creating new reveal and other items for Event Hub?" | **42 Add to the Event Hub** (themes · reveal openings · video loops · front-door videos · Patiktok · songs · mood-board assets · event types, each marked) · 27 Reveal Studio | More › Templates › Add to the Event Hub = 3 | front-door videos · Patiktok · songs · mood-board assets **exist**; themes (maker) · theme loops **NEW**; a new reveal opening = **code only** (no fake Add) |
| 4 | "Creating promo for users and suppliers" | **44 Money off** (codes · free windows · deals, one **New ▾**) · **45 New code** (for · takes off · on · dates · limit) · **46 New free window / deal** (kind · what · event dates · dates · reason) | More › Pricing & offers › Money off = 3; New = +1 | exists (`discount_codes`, `promo_free_windows`, audiences all_couples · all_vendors · new_verified_vendors) |
| 5 | "Giving complementary services for user's event and suppliers." | **47 Give a comp — event** (what · until · value · reason · one admin ≤ ₱10,000) · **48 Give a comp — supplier** (second admin) · 66 Event › Comp a service · 12 Supplier › Plan › Comp | People › Give a comp = 2 (+1); from a person/event/supplier page 2 (+1) | exists (`issueCompGrant` / `revokeCompGrant`; `issueVendorSkuComp` → `executeVendorSkuComp`, two-admin) |
| 6 | "Helping a user/vendors to solve any probable issues to do it myself?" | **49 Fix it for a person** (confirm email · temporary password · sign out everywhere · resend access · reopen guest list · move an unused service · comp · send their data · freeze · "act as": NEW, not recommended) · **50 Fix it for a supplier** (edit unclaimed shop · set plan · comp · move address · apply a correction · mark contact confirmed · re-run checks · hide listing · suspend · founding) | search › person › Fix it = 3 (each action +1 where it confirms) | the listed actions **exist** (`users/actions.ts`, `vendors/actions.ts`, corrections mover, verify actions); freeze · move · act-as **NEW** |
| 7 | "Performance of the website?" | 30 Numbers (says: Uptime · Error rate · API speed · Web Vitals not measured yet, "—") · 17 Problems | More › Numbers = 2; Work › Problems row = 1 | exists |
| 8 | "Privacy?" | 32 Privacy · Work › Privacy rows | More › Privacy = 2; Work row 1 | exists |
| 9 | "Reports?" | 16 Reported photo (people) · **56 Reports** (receipts CSV · money by month · legacy pricing CSV · a person's data · admin log CSV · NPC PDF) | Work › Safety row = 1; More › Numbers › Reports = 3 | reports about people exist; receipts CSV · pricing CSV · export · NPC PDF **exist**; money-by-month · admin-log CSV **NEW** |
| 10 | "Account Deletions?" | 01 Work › Privacy row → 10 Person › Actions › Delete (typed) · 32 Privacy › Deletions due | Work › Open = 1 › Actions 2 (+1 typed) | exists (`deleteUser`, `account_deletion_requests`, 24-h rule) |
| 11 | "Bans?" | 11 Ban (reason ▾ · typed · 24-h undo) · 50 Supplier › suspend / hide | search › person › Actions = 3 (+1) | exists (`blacklistUser` = ban) |
| 12 | "Freeze?" | **51 Freeze an account** (temporary · reversible · NEW) · **52 Suspend a shop** (exists) · 66 Event › Hold (NEW) | Fix it › Freeze = 3 (+1) | shop suspend/unsuspend + hide listing **exist**; account freeze · event hold **NEW** |
| 13 | "Confirming payments that would release services for the buyers." | 04 confirm sheet (now explicit: releases the Thank-you film · sends receipt R-… · supplier payout: none) · 07 payment | Work › Confirm = 1 (+1) | exists (`approvePaymentCore`) |
| 14 | "Creating new articles?" | **53 Articles** · **54 Write · publish** (title · address · summary · body · cover · supplier spotlight free/sponsored · status) | More › Content › Articles = 3; Write +1 | **NEW** editor (posts are code; the spotlight row exists) |
| 15 | "Rotating Backend Data" | **55 Secrets** (each key: last rotated · due · Rotate · Mark rotated; thumb Redeploy · Re-encrypt sweep) | More › Admin › Secrets = 3 (+1) | exists (`/admin/secrets` actions) — Q3 asks what "data" means |
| 16 | "Changing service prices for both events and vendors" | 24 Catalogue (Customers · Supplier plans · Bundles; price → second admin, name saves at once) | Money › Catalogue = 2 › price 3 (+1 Send) | exists; supplier-plan **title** edit NEW |
| 17 | "adding new video backgrounds?" | **43 Add a video** (file · poster · where it shows ▾ front-door pillar / hero / Event Hub loop · name · free or ◆ · published; the front-door "couldn't load" state it lacks today) | More › Media › Front door media = 3; Templates › Add to the Event Hub › Add = 3 | front-door slots **exist** (`saveBackgroundVideo`, `toggleBackgroundVideoPublish`, no read-failed state today); Event Hub loops **NEW** (code + files) |
| 18 | "Auto assists with AI?" | **59 Work · AI assists in the row** ("✦ AI: amount matches · ref matches · no duplicate · safe to confirm"; "over by ₱400 — not confirmed for you"; "permit couldn't read"; "we already have Sorbetes cart"; "a child's face · guardian objected") · **60 Ask** (a typed question prepares the refund for his confirm; pages; what the box can do) | Work = 0; search › Ask = 2 | assists **exist** (§4 item 13); the row line + the preparing Ask **NEW**; never an auto-action on money or bans |
| 19 | "Other data inputs?" | **61 Venues** (the data-list pattern) · **62 A venue** (edit sheet, saves on close, Remove with typed confirm) · **63 Budget benchmarks** · §13 table | People › Venues = 2; Pricing & offers › Budget benchmarks = 3 | every data set in §13 has a home; add/edit/remove as stated there |
| 20 | "Promotions?" | **64 Promotions** (Spotlight Awards · Journal spotlights free/sponsored · Real Stories · Storytellers · Social queue · Announcements · Referrals · Founding suppliers · Boost · Launch banner; the money-off door jumps to 44) | More › Growth › Promotions = 3 | Spotlight · journal · stories · storytellers · social · referrals · founding **live**; Announcements **NEW**; Boost **NEW (spec only)**; Launch banner with A-PR2 |
| 21 | "Launch Offer for Vendors and User Events" | **57 Launch offer** — one counter, two halves (For suppliers: Pro free · fee ₱0 · 1,384 on it · who reads 22–25 · 27 · 30 · 39; For users' events: 50 Papic credits per booked event · 1,240 events · who reads: event Papic credits · Suppliers › Booked row · Home) · **58 ending week** · 23 ended · a "Launch offer" row on 10 Person · 12 Supplier · 66 Event | Work line = 1 | **NEW** (A-PR2) — only L4823–4825's rules drawn; nothing invented (Q2) |
| 22 | "Allowing users to reuse services that were not used on an event they created." · *"for example a user created an event and ordered papic, and it was never used. we can allow them to transfer that to their next immediate event created"* · ruling: *"we wait for their next event"* | **65 Move unused Papic to their NEXT event** (Person › Orders: "Papic Pass · unused · 0 of 3,000 points · 0 photos · next: Reyes debut" → **Move** → confirm: A loses it · B gets 3,000 points · told · logged · Undo) · **65b "Unused · waits for their next event"** (no next event: no button, no admin pick) | search › person › Orders fold › Move = 3 (+1) | **NEW** — no such action in code (`lib/reusable-bookings.ts` is supplier-booking reuse with a new fee; `lib/entitlements.ts`: the event holds the purchase). Recommendation (not a decision): keep the admin's allow as the default; an auto-move when the next event is created + an email is the smaller daily load, offered as a later switch. |

**Taps for the 22 jobs: every one ≤ 3 from Work** (sum of the "to the control" taps = 48; +1 confirms where money moves or a thing cannot be undone).

---

## 13 · Everything you can enter — every admin-entered data set · where · taps · add / edit / remove · who reads it

The data-list pattern (frames 61–63): list · search in the thumb row · **＋ Add** as the one creating button · a row opens an edit sheet that saves on close · Remove with a typed confirm · "couldn't load" in place and fields locked. A failed read never shows an empty form that Save could write back (audit 09-30 rows 3, 4, 20, 34, 35).

| Data set (table) | Entered at (frame) | Taps | Add · Edit · Remove | Read downstream by |
|---|---|---|---|---|
| Venue directory (`venue_directory`) | People › Venues (61 · 62) | 2 | ✓ · ✓ · ✓ (typed) | couple onboarding venue pick · Explore · Event Hub map |
| Supplier categories · services · aliases · search words (`canonical_service_taxonomy`, `service_categories`, `canonical_service_aliases`) | Content › Categories (31 · 39) | 3 | ✓ · ✓ · delete with "move everything to ▾" | Explore · supplier Services › Coverage · onboarding |
| Event types · presentation · status (`event_type_vocab`, `event_type_profiles`) | Content › Categories › Event types (40 · 41) | 3 | ✓ · ✓ · retire | onboarding · the Maker's words · supplier scoping |
| Religions · asked-on · traditions (`faith_vocab`, `wedding_tradition_items`) | Content › Categories › Religions | 3 | ✓ · ✓ · retire | onboarding · "What to expect" |
| Onboarding refinements + options (`onboarding_refinements`, `_options`) | Content › Categories › an event type › Questions | 3 | ✓ · ✓ · ✓ | onboarding questions |
| Planning deadlines (`planning_deadlines`) | Content › Categories › a category › Book by | 3 | — · ✓ · — | couple planning nudges |
| Onboarding music (`platform_settings.onboarding_bg_music_*`) | Set up › Onboarding | 3 | — · ✓ · clear | onboarding |
| Songs (`songs`) | Media › Songs | 3 | ✓ · merge · ✓ | Music Maker · supplier repertoire |
| Mood-board library assets + colour ranges (`moodboard_library_assets`, `moodboard_asset_color_ranges`) | Media › Mood board library | 3 | upload · tag · approve / decline / retire / delete | couple Mood Board · supplier gallery |
| Front-door videos + site media (`homepage_background_videos`, R2) | Media › Front door media · Add a video (43) | 3 | ✓ · publish/unpublish · ✓ | setnayan.com home |
| Event Hub theme loops (**NEW**) | Templates › Add to the Event Hub › Add a video (43) | 3 | ✓ · ✓ · retire | the Maker's Background ▾ |
| Patiktok templates (`patiktok_render_jobs` templates) | Templates › Patiktok | 3 | ✓ · ✓ · retire | couple Patiktok |
| Reveal Studio config (`reveal_studio_config`) | Templates › Reveal Studio (27) | 3 | — · ✓ (switches · sliders) · — | couple Save-the-Date · the public hub reveal |
| Event Hub themes (`lib/invite-themes.ts` → maker **NEW**) | Templates › Event Hub themes | 3 | ✓ (maker) · ✓ · retire | couple theme pick · onboarding look |
| Articles (**NEW** `journal_posts`) + supplier spotlights (`journal_vendor_spotlights`) | Content › Articles (53 · 54) | 3 | ✓ · ✓ · retire | setnayan.com/journal |
| Features page · FAQs & help (**NEW**, named by admin_final) | Content › Features page · FAQs & help | 3 | ✓ · ✓ · retire | /features · help centre |
| Budget benchmarks · bands · allocation (`budget_leaf_benchmarks`, `budget_band_config`, `budget_allocation_config`) | Pricing & offers › Budget benchmarks (63) | 3 | — · ✓ · reset | couple Budget planner |
| Catalogue prices · names · live (`platform_retail_catalog_v2`, `vendor_billing_catalog`, `platform_package_catalog`) | Money › Catalogue (24) | 2 | ✓ · ✓ (price = two-admin) · retire | checkout · supplier Plan · /features |
| Papic shot prices · pool config (`papic_pass_tiers`, `papic_event_pool_config`, `papic_tier_config`) | Pricing & offers › Papic shot prices | 3 | — · ✓ · — | Papic checkout · pool meter |
| Setnayan AI prices (`event_type_vocab` bands) | Pricing & offers › Setnayan AI prices | 3 | — · ✓ · — | AI paywall |
| Booking-fee schedule (`platform_settings.booking_fee_*`) | Pricing & offers › Booking fee | 3 | — · ✓ · — | every fee row (supplier 05 · 30 · 39) |
| Discount codes · eligible users (`discount_codes`, `discount_code_eligible_users`) | Pricing & offers › Money off (44 · 45) | 3 | ✓ · ✓ · disable | checkout |
| Free windows · supplier deals (`promo_free_windows`) | Pricing & offers › Money off (44 · 46) | 3 | ✓ · pause · ✓ | checkout · supplier fee row |
| Launch offer (window row + 5 NEW columns) | Pricing & offers › Launch offer (57) | 1 | ✓ (new window) · ✓ · end | supplier 22–25 · 27 · 30 · 34 · 39 · couple Papic · Suppliers › Booked |
| Custom plans (`vendor_custom_plans`) | Pricing & offers › Custom plans | 3 | ✓ · send quote · activate | supplier Plan › Build Custom |
| Market price bands (RPCs) | Pricing & offers › Market price bands | 3 | recompute | supplier Insights › Your price |
| Founder seats (`founder_seats`) · founding suppliers | Pricing & offers › Founder seats · Supplier › Plan | 3 · 2 | grant · — · revoke | supplier badge |
| Supplier recommendations + feedback (`vendor_service_recommendations`) | Pricing & offers › Supplier recommendations | 3 | ✓ · ✓ · ✓ | couple Suppliers page |
| Partnerships (`vendor_partnerships`) | People › Partnerships | 2 | ✓ · approve · remove | supplier More tools |
| Comps · tiers (`comp_grants`, `vendor_profiles.tier_*`) | People › Give a comp (47 · 48) · Gifts & comps | 2 | ✓ · — · revoke | couple services · supplier Plan |
| Demo suppliers (`vendor_profiles.is_demo`) | Set up › Demo suppliers | 3 | seed · regenerate · hide one (NEW) · clean | couple Suppliers page |
| Business details (`platform_settings` name · TIN · address · email · VAT) | Admin › Business details | 3 | — · ✓ · — | receipts · invoices |
| Compliance facts (`platform_compliance_facts`) | Privacy › NPC filing | 3 | — · ✓ · — | NPC data sheet · privacy page |
| Receiving accounts + QR (`platform_settings.receiving_accounts`) | Money › Our accounts (34) | 2 | ✓ · ✓ (two-admin) · ✓ | couple pay page · supplier fee bill |
| Integrations keys · AI paywall (`platform_integration_secrets`, `platform_settings`) | Admin › Integrations · Switches (25) | 3 · 2 | set · clear | email · OAuth · Maya · AI |
| Secrets · rotations (`platform_secret_rotations`) | Admin › Secrets (55) | 3 | — · rotate · mark · clear | the platform |
| Live Watch channel pool (`live_studio_roam_channel_pool`) | Numbers › Costs › Live Watch channels | 3 | ✓ · verify · rename · cap · release · disconnect | couple Live Watch |
| Platform expenses + receipts (`platform_expenses`) | Numbers › Costs › Expenses & hiring | 3 | ✓ · attach receipt · — | Numbers |
| Papic storage telemetry (`papic_photos`) | Media › Papic storage | 3 | backfill tiles | — |
| Setnayan AI brain chunks (`concierge_brain_chunks`) | Set up › AI brain | 3 | ✓ · ✓ · ✓ | the assistant |
| Search memory (`admin_search_phrases`) | Set up › Search memory | 3 | — · teach · delete | the admin search box |
| Menus & icons (`nav_slot_override`, 190 + 23 new slots) | Admin › Menus & icons | 3 | — · rename · icon · hide · reset | every bar and rail (admin · supplier · couple · public) |
| Team & permissions (`users.is_internal`, Team Pool) | Admin › Team & permissions (**NEW** page) | 3 | grant (two-admin) · — · revoke | who can open /admin |
| Switches (every for-everyone setting) | Admin › Switches (25) · avatar sheet | 2 | — · flip (confirm) · — | the whole app |
| Social posts · publish settings · evergreen (`social_posts`, `social_publish_settings`, `social_evergreen_items`) | Growth › Promotions › Social queue (64) | 3 | ✓ · post now · schedule · retry | social channels |
| Real Stories · storytellers featured + rank (`creator_chapters`) | Growth › Promotions | 3 | — · feature · rank · — | setnayan.com stories |
| Spotlight Awards (`vendor_spotlight_awards`) | Growth › Promotions | 3 | add by hand · feature · recompute · remove | front door |
| Announcements (**NEW**) | Growth › Promotions › Write | 3 | ✓ · — · — | the "Setnayan" thread (supplier 13 · 37) · couple notices |
| Venue · event · person records | People (09) | 1–2 | edit via Fix it · — · delete (typed) | — |

Every data set above has a home ≤ 3 taps from Work. Nothing an admin types today is left without a row.
