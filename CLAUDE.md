# CLAUDE.md — Setnayan Engineering Context

> Project context for Claude Code working on the Setnayan platform. Keep this file under 200 lines — it's loaded into every Claude Code session as context, so brevity matters.

## 🗣 HOW TO TALK TO THE OWNER — owner-locked 2026-08-02

**Owner, verbatim:** *"the last part of your reviews are questions and
recommendations of what to do next and always in simple english and simplest
answers needed."*

⚠ **AMENDED 2026-08-04 — the closing block is RETIRED.** Owner: *"can you keep
going instead of telling me what you recommend doing next. can you do it. and
decide"*. **Decide and act.** Ask only when proceeding either way would be unsafe
or would waste real work. The plain-English rule below still stands in full.

~~**Every substantive reply ENDS with a short closing block:**~~

1. **What I recommend doing next** — one line. A call already made, not a menu.
2. **Anything I need from the owner** — only when genuinely blocked. One question,
   not two.

Nothing after it. No summary, no caveats, no "let me know if…".

**And the whole reply is in simple English, not just that block.** The owner
steers product, pricing, scope and risk — they are *not reading the code*.

- Say what a PERSON EXPERIENCES, not what the code does.
  ✅ *"Your cousin scans the poster, shoots 20 photos, they reach you — but she
  can't get photos of herself."*
  ❌ *"The self-link is keyed on `guest_id`, so a seat-holder without a session
  cookie can't reach the pool gallery."*
- **No file paths, function names, table names, SQL or flag names** in the
  answer. They belong in the PR body, not in the reply.
- Shortest version that is still true.

⚠ The owner said **"english"** three times in one session (2026-08-01/02), each
time after a reply that was correct and unreadable. Every one cost a round-trip.
**A correct answer the owner cannot act on is worth the same as a wrong one.**
The failure is always the same shape: explaining the plumbing instead of the
point, because the plumbing is where the last hour went.

Make routine calls yourself and say so — pre-launch, reversible work needs no
sign-off. Escalate only real owner territory: locked prices/SKUs, scope, risk
trade-offs, or reversing an owner lock.

## 🔑 TRIGGER — the owner types **"what's next"**

When the owner says **"what's next"** (or *whats next* / *what next*), that is a standing
instruction to **pick up all unfinished work**:

1. Open **[`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md)** — the master register of every active
   handoff, its gates, and its repo/worktree rules. **Read it fully before touching anything.**
2. Then open the contract for whichever stream you are executing (each row in the register names
   its own contract file).
3. Obey the register's global safety rules: build up to a gate, stop at it, list it. Never
   auto-flip a prod flag, never `db push` a counsel-gated migration, never make an
   `OWNER_DECISION` yourself.

⚠️ **THIS MAY BE A DIFFERENT MACHINE OR CLAUDE ACCOUNT.** Assume **no memory files exist** —
`~/.claude/.../memory/` does NOT travel. Everything you need is committed in THIS repo
(specs/corpus, remote `Setnayan-specs.git`) and in the code repo
(`github.com/iscasasola/setnayan-platform`). If a doc references a memory note by `[[name]]`,
treat it as a hint about a topic, not as a file you can open — the substance was copied into the
committed docs on purpose.

## 🚦 ACTIVE WORK — READ THIS BEFORE ANYTHING ELSE (updated 2026-08-01)

**The owner's #1 complaint about new sessions: they start without the plan, rebuild things that
already ship, and produce errors.** The fix is this block. Keep it CURRENT — one active work
stream, deleted or replaced when it finishes. If you finish a stream, update this block.

> ### ⛔ FALSE BELIEF IN CIRCULATION — kill it on sight (corrected 2026-08-04)
> **"A migration whose prefix sits below prod's applied head merges green and creates NOTHING."**
> **THIS IS FALSE.** `deploy-prod.yml` and `supabase-migrations.yml` both run
> `supabase db push --include-all --yes`, and `--include-all` exists precisely to apply
> migrations dated before the remote head.
>
> **Measured 13 ways:** 12 migrations were historically added out of order and **all 12 are
> applied in prod**; and the open-browse launch migration `20271102765509` applied on 2026-08-04
> while sitting **two prefixes below the head**.
>
> 🦠 **It spreads, which is why it is in the auto-loaded file.** It began in one migration header,
> was repeated in **six** migrations (`20271102603681` · `20271102765509` · `20271102810371` ·
> `20271103100614` · `20271104090000` · `20271106090000`) — **two of them written by other
> sessions AFTER the correction landed** — plus `DECISION_LOG.md` rows 2026-08-02/08-03 and
> `PR_H_Lock_Request_Handshake_BUILD_SPEC_2026-08-04.md`. Those migrations are APPLIED, so they
> are **not edited**; this block is the correction. Do not treat a migration comment as evidence.
>
> 🔑 **Where it came from:** a `count(*) WHERE version = <prefix>` on an **unmerged** PR returned
> `0`, read as *"it will be skipped."* Zero was because the PR had not merged. Correct fact,
> invented consequence.
>
> ✅ **What IS true:** the PGlite replay (`apps/web/tests/db/replay-migrations.ts`) applies in
> **filename order**, so a low prefix that depends on a higher-prefixed, already-merged migration
> fails every `*.db.test.ts` while prod is fine. Allocate forward with `pnpm migration:new` for
> **that** reason and for the UNIQUE rule — never because "it won't apply."
> `check-migration-timestamps.mjs` enforces UNIQUE + not-hand-typed-round. **It does not check
> ordering and never did.**

> ### 🔑 TRIGGER — the owner saying **"what's next"** activates ALL unfinished sessions
> (Set 2026-07-29 for cross-account continuation — the prior account hit its usage limit; a
> fresh account has NO conversation context, only these files.) On the trigger, open
> [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) — the master register + its HUMAN-GATE rules —
> and its newest entries:
> - [`WHATS_NEXT_Card_Family_Handoff_2026-07-29.md`](WHATS_NEXT_Card_Family_Handoff_2026-07-29.md)
>   — maker/card/details/customization-inquiry: 11 PRs DONE (anchored `origin/main`=`441779c1f`,
>   verify before trusting), locked principles, the unfinished build list, the trap list.
>   ⏭ One pending owner flip: `NEXT_PUBLIC_SERVICE_DETAILS_ENABLED`.
> - The **Papic two-type model** (locked 2026-07-29, build NOT started): DECISION_LOG row
>   2026-07-29 + memory `project-setnayan-onboarding-papic-ai-cards`.
> - **Song Desk is DONE** (8 PRs, all merged 2026-07-30). Superseded by the INTERCONNECTION
>   LAYER block below — read that instead.
> - 🗄 **STORAGE HYGIENE — DONE 2026-08-02, do NOT rebuild.** `/admin/website-media` ships
>   (PR #4050): lists what is actually in the media bucket, marks each file *In use* /
>   *Left over* / *Not sure*, Download + single-file Delete, **no bulk delete**. The two
>   upload paths now sweep what they replaced. Download forces a real save (#4052). The
>   **sign-in hero is RETIRED** (#4055) — deleted, `/admin/hero-video` → 404 — it sliced
>   every clip into 73–361 stills for a screen nothing rendered. See the newest section of
>   [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) for the owner actions + 7 traps.
>   🔑 **Prefixes come from the UPLOAD CALL SITES, never a module name** (rev 1's allowlist
>   matched ZERO objects). 🔑 **Prose is not a safety mechanism** — a live audio file sat
>   under "probably left over" with Delete ON. 🚨 **The main checkout was switched to `main`
>   under this session 3×** — branch, then `git worktree add` immediately.
> - 🎨 **[`WHATS_NEXT_Design_Programme_2026-08-01.md`](WHATS_NEXT_Design_Programme_2026-08-01.md)**
>   — **the newest stream. Read it before ANY design/UI/page work.** Palette ✅ shipped on all
>   401 routes (PR #3988, locked by a derived-contrast guard); 12 archetypes + 7 overlay types
>   ✅ drafted to `prototypes/archetype_*_2026-08-01.html`.
>   ✅ **THE OWNER GATE IS CLOSED — ALL 19 APPROVED 2026-08-04, no changes requested**
>   (`DECISION_LOG.md` 2026-08-04 · commit `02d995c` · verdict-sheet artifact `36f20665` ·
>   `PARALLEL_WORK_CLAIMS_2026-08-04.md` S8 flipped in the same commit). The prototypes are
>   **BINDING** — port them, never redraw them; a delta between a ported screen and its
>   archetype is a defect in the port, not a fresh design decision.
>   ⚠ **This line said "owner has not seen the prototypes" for two days AFTER the approval**,
>   and a session acting on it told the owner his top priority was to go look at something he
>   had already signed off. The programme doc's own state table (line 37) and item #3 (line 234)
>   carried the same stale claim while an approval banner sat at the top of the SAME file.
>   🔑 **A doc that records a decision at the top and contradicts it in the middle will be read
>   from the middle** — grep the file for the old state before declaring a gate closed.
>   ⏭ `design#1` + `design#2` are DONE (#4064/#4065). **`design#3` (the shell) is next** and is
>   the architectural one. The remaining ~40 port units are now ALL unblocked.
> - 📈 **SEO / GEO — code side DONE 2026-08-02, do NOT rebuild.** `llms.txt` is now GENERATED
>   from the catalog (#3952), the SEO surface has a **"Re-run audit now"** button (#3960), and
>   the audit stopped grading two sources nothing else read (#3973). Audit `fail 2 → 0`.
>   ⏭ **2 owner actions:** paste `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` + `NEXT_PUBLIC_BING_…`
>   into Vercel **then redeploy** (they inline at build time); the Search Console DATA pull is
>   **BLOCKED** on the suspended Google Cloud account (appeal `73857927`) ⇒ `seo_metrics` = 0
>   rows. ✅ **The `sameAs` nag was FALSE — the FB Page already ships. Do not create one.**
>   ⏸ **The Filipino-USP hero/manifesto copy was owner-APPROVED but never entered code** —
>   copy is §5 of `03_Strategy/Claude_Design_Brief_2026-07-31.md` (⚠ that brief's §1 palette is
>   superseded by the terracotta lock; §5 copy is still valid), and it targets `/`, which the
>   Design Programme **excludes** ⇒ `OWNER_DECISION` on whose scope it lands in.
>   🔑 **A guard comparing two HAND-TYPED things is not a guard** — that is how `llms.txt`
>   drifted for 3 weeks with green CI. See the newest `WHATS_NEXT_INDEX.md` section for 8 traps.
> Execute per each contract's own rules; build flag-dark; stop at every HUMAN gate.

> ### ▶ ACTIVE 2026-08-07: A REJECTED QUERY IS NOT A THROWN ERROR — and TWO operational warnings
> **Full handoff: [`WHATS_NEXT_Session_Handoff_2026-08-07.md`](WHATS_NEXT_Session_Handoff_2026-08-07.md).**
> 6 PRs merged, 1 closed as superseded.
>
> 🔴 **A LIVE USER-FACING BUG RAN FOR WEEKS WITH GREEN CI.** Every guest who wrote a
> message on a Papic photo got `save_failed`. The route posted EIGHT named arguments to
> `submit_photo_message`; prod's function took SEVEN. **PostgREST resolves an RPC by its
> exact set of NAMED arguments** — one unknown name means NO candidate matches and the
> call fails before the body runs. Nothing threw; CI never calls the live database.
> 🔑 **THIS IS THE THIRD COSTUME OF ONE RULE.** A phantom **column** in a select, a
> phantom **enum value** in a filter, and now a phantom **argument** in an `.rpc()` all
> get the query **REJECTED, NOT THROWN**. Silence every time. Assume a fourth exists.
>
> 🔑 **WHY THE SCHEMA WAS MISSING — the orphan directory.** The feature's migration was
> written into `apps/supabase/migrations/`; `supabase db push` reads
> `<repoRoot>/supabase/migrations` ONLY. The app half shipped and went live, the schema
> half went nowhere, and **both halves looked done**. Same shape as the orphan
> `changelog.d` dirs that stranded 172 fragments.
>
> 🛡 **THREE NEW GUARDS, ALL MUTATION-TESTED — do not weaken or delete:**
> `lint-server-only-boundary.mjs` · `lint-migrations-dir.mjs` ·
> `rpc-argument-names.db.test.ts` (197 `.rpc()` sites checked, 8 skipped AND reported).
> 🔑 **Wiring a guard into `ci.yml` takes THREE edits** — the step (`id:` +
> `continue-on-error`), the **env binding**, and the `check '...' "$VAR"` line. Miss any
> one and the guard runs but can never fail the job. It is decorative.
>
> 🚨 **A "VERIFIED" TASK BRIEF CAN STILL BE WRONG.** The orphan-dir brief said all three
> findings were checked and said *delete both files*. **Finding 3 was false** — its check
> matched `column_name ILIKE '%kwento%'`, which proves *some* column exists, not that
> *this file's* objects do. Obeying it would have **destroyed the only remaining record
> of schema a live feature needed.** Re-verify before running a brief's destructive step.
>
> ⚠️ **1 · ANOTHER SESSION WORKS THIS REPO CONCURRENTLY.** A force-push was rejected, and
> that rejection is the ONLY reason I noticed it had pushed the same fix minutes earlier;
> forcing would have silently erased its work. Before any force: the remote tip must
> equal your own `ORIG_HEAD`. A naive "does the remote have commits I lack?" **cries wolf
> after your own rebase.** And **verify the push landed** — a `&& echo "pushed"` chain
> prints success after a failed push.
>
> ⚠️ **2 · THE SHARED MAIN CHECKOUT HOLDS 96 UNCOMMITTED FILES** (29 A, 67 M) from that
> session and is 122+ commits behind, so `git pull` aborts. **Do NOT stash or discard —
> they are not yours.** Read current main with
> `git worktree add --detach /tmp/wt-read origin/main`.
> 🔴 **OWNER DECISION: keep or discard that work.**
>
> ⚠️ **#4004 (CSAM known-hash hook) MERGED** despite `DECISION_LOG.md` 2026-08-04 saying
> it must not. **Verified INERT** (`CSAM_HASH_MATCH_ENABLED`, default off) — merging
> activated nothing. 🔑 **But the gate moved from a draft PR to an env var.** Condition
> unchanged: enrol with a known-hash provider AND sign the NPC Circular 16-02 agreement
> BEFORE setting it. Both are contracts, not code.
>
> ✅ `NEXT_PUBLIC_PLAN3D_SHARED_ROOM` is **ON** — read out of the live production bundle
> (compiled constant `!0`), not inferred. ⚠ The booking-fee flag is **unverifiable from a
> session** (server-only, page behind a vendor login); it needs TWO switches and the
> billing one is off, so nothing is charged. Prod: 0 fee charges, 13 booked vendors.

> ### 🔴 COLD START? READ THE CODE REPO'S `HANDOFF_RESUME_2026-08-07.md` FIRST.
> Set 2026-08-07 because the owner is continuing **on a new Claude account**, and
> `~/.claude/.../memory/` does **NOT** travel. That file is self-contained: verified
> prod state, the open URL decision, the 16-surface logo debt, the retention model,
> and every trap inlined rather than linked. **This block is a summary of it, not a
> replacement.**
>
> **Verified prod, 2026-08-07:** 5 events · 2 vendors, **both hidden** · **0** photos ·
> **0** fee charges · **0** livestream channels. **Nothing is live to a stranger.**
>
> 🔗 **VENDOR BARE-ROOT URLs ARE ALREADY BUILT — DO NOT "MOVE" ANYTHING.**
> `app/[slug]/page.tsx:219` already dispatches to `renderVendorBySlug`, and the vendor
> sitemap already emits `${baseUrl}/${business_slug}`. `/v/[slug]` is LEGACY.
> `setnayan.com/setnaprod` 404s only because that shop is unverified + hidden.
> ⚠ I reported this backwards **twice** — once calling the shop page's correct address
> a defect, once calling a **200 that was the not-found body** a working page.
> 🔑 **A STATUS CODE IS NOT A PAGE. READ THE BODY.**
> ⏭ Real work (40 traps, 24 severe): one shared name registry (**zero collisions today,
> 7 names — free now, a migration later**) · 14 unprotected route words incl. `creators`
> + `open-shop`, both LIVE and sitemapped · rename-forwarding **has never run in prod and
> expires at 90 days** while save-the-dates go out 6–12 months ahead · a retired slug is
> **re-claimable** (one is free right now) · shops have **no** rename forwarding.
> 🔴 **OWNER-ONLY, blocks event nesting only:** what a person's tag looks like. Nobody has
> one; the one account that does reads `s89u-kemmf2adck`, so flipping today prints a
> machine code on invitations forever.
>
> 🖼 **`logo_url` HOLDS `r2://`, NOT A URL** — a raw value in an `<img>` fails SILENTLY.
> Launcher fixed (#4215); **16 surfaces baselined**, including the public shop page.
> 🔎 **The vendor route SOFT-404s** — its `loading.tsx` forces streaming, so `notFound()`
> can no longer set the status and every bad shop URL tells Google "success".
> 🗄 **Retention:** originals **6 months from FIRST capture** (drop is DEFAULT-ON),
> compressed gallery **forever**, Drive is the only way to keep originals. Copy corrected
> (#4208 · #4209). 🔴 **Paid preservation ALREADY EXISTS switched off** (₱999/yr) — owner
> 2026-08-07: **not selling yet**; do not re-ask its four numbers.

> ### ▶ ACTIVE: TIME — and the class of bug behind it
> **Set 2026-08-04. This replaced the INTERCONNECTION LAYER block, which is DONE (14 PRs,
> all merged; its findings live in `DECISION_LOG.md` 2026-08-01/02 and the memory notes).**
>
> **17 live defects in one day, all one disease: two values that LOOK alike and MEAN
> different things, compared directly.** Nothing errored, nothing logged, CI was green
> throughout. Shipped in PRs #4095 · #4098 · #4101 · #4105.
>
> **1 · A WALL CLOCK IS NOT AN INSTANT.** `event_schedule_blocks.start_at` stores the
> VENUE'S wall clock in a UTC column (prod: `Ceremony 14:00+00`). Nine surfaces compared it
> against a real instant ⇒ **out by exactly 480 minutes** in Manila. An on-time start
> announced as *480 min behind* · the host's desk counting 8 min away as *"in 488 min"* · at
> 2 PM the couple's dashboard reading the day as 6 AM · a guest at the reception told the
> ceremony was still coming · a 2 PM ceremony in the photographer's phone at 10 PM · a 2 PM
> appointment shown to both parties as 10 PM · **a call-time EMAIL with 10:00 PM in the
> subject line**, one press from sending.
> 🔑 **TWO FIXES, PICK BY WHAT YOU COMPARE:** `plannedInstant(iso, tz)` lifts a stored time
> UP (use against `actual_start_at`); **`venueNowMs(tz, now)` brings `now` DOWN** (use to
> locate a position — far smaller, every existing sort/countdown keeps working).
> `datetimeLocalToIso(raw)` for anything posted from a form.
> 🔑 **NO TIMEZONE ⇒ REPORT NOTHING.** A false *"20 min behind"* tells a coordinator to rush
> a wedding that is on time.
>
> **2 · A DATE IS NOT AN INSTANT.** `events.event_date` is a DATE. `new Date('2026-12-12')`
> is midnight UTC = the **11th** west of Greenwich ⇒ a 12 Dec wedding read **11 Dec** on the
> save-the-date, the invitation and 41 screens. The relatives reading on a foreign phone are
> the ones booking flights. Fixed at `formatEventDate` · `shortDate` · both `anchorIso`s ·
> `calendarDayEpoch`.
>
> 🪤 **WHY IT ALL SURVIVED — READ THIS BEFORE WRITING A TEST.**
> **CI RUNS IN UTC, THE ONE CLOCK WHERE BOTH MISTAKES CANCEL OUT.** So does every server
> action. **Run the suite under `Asia/Manila`, `America/New_York`, `Pacific/Kiritimati`** —
> 6483 tests are green in all four as of 2026-08-04, the first time that has ever been true.
> 🔑 **THE TESTS ASSERTED THE BUGS.** Fixtures wrote `06:00Z` commented *"2 PM Manila"*; the
> seed test's `localDate` used local **getters** matching an `anchorIso` that used local
> **setters**. **Two halves wrong in the same direction agree with each other perfectly.**
> A previous session even recorded one failure in a docblock as *"known, out of scope"* —
> **a documented failure is still a failure.**
> See [[project_setnayan_wall_clock_vs_instant]] · [[project_setnayan_date_is_not_an_instant]].
>
> **3 · 🔑 A GATE WITH NO HANDLE.** Face auto-tagging was built, **paid for and activated
> 2026-06-19**, every flag green — and stored **nothing for 7 weeks**. `papic_face_mode` had
> **ZERO writers anywhere**; all 5 prod events sat in the mode that hard-nulls the vector.
> ✅ Switch built (`setEventFaceMode`, admin-only, DPO presses it per event); **owner decided
> "on" 2026-08-04.** 🚨 **The stale comment is what kept it shut** — it claimed mode_a
> fingerprints *"EVERY guest with no per-guest opt-in roster"*; false, both writers require
> `biometric_consent` + `age_affirmation` server-side. **Trace to the WRITE, not the flag:
> grep the column and ask whether every hit is a READ.**
> 🚨 **THE DB IS THE AUTHORITY, NEVER THE MIGRATION SEED.** Five agent verdicts of "built but
> switched off" were wrong on that basis — **all 20 privacy controls in prod are `active`.**
> See [[project_setnayan_gate_with_no_handle]].
>
> **4 · 🎬 A FIX NOBODY CAN REACH IS NO FIX.** Three PRs retired the save-the-date veil
> correctly and the owner's complaint repeated **verbatim for three days** — because the only
> "See our page" button sat on the film's LAST beat, so the website was reachable only by
> watching the whole film. ✅ A persistent exit now ships. 🔑 **`aria-hidden` +
> `pointer-events-none` do NOT remove an element from the tab order** — gate such a control
> on a real MOUNT condition (`started`), never a style.
> See [[feedback_a_fix_nobody_can_reach_is_no_fix]].
>
> **5 · RULE 0 PAID OFF FOUR TIMES IN ONE DAY — nothing was rebuilt.** The photographer
> hand-over (`booking_handovers` `kind='gallery_link'`, copy already says *"Big galleries stay
> on your link"*), the **editorial vendor spotlight** (`journal_vendor_spotlights`, authored in
> admin, rendered in `/blog/[slug]`, free + four-eyes-gated sponsored), **vendor partnerships**
> (complete both sides, two-admin gate), and **all eleven** vendor "special services" the owner
> listed — **zero genuinely missing.** ⏭ Real gaps found: no vendor→emcee channel · a vendor
> cannot see their own captures · no avatar maker exists for anyone.
>
> ⏭ **OPEN, needing the owner:** (a) a control to delete orphaned files in the
> **vendor-verification** bucket — `/admin/website-media` covers only `media`, and two
> government IDs sit there unreferenced; (b) whether the corrected legacy-preservation counsel
> brief was ever re-sent; (c) whether Partnerships should be *pushed* (nothing invites a vendor
> into it) or merely kept.


> ### ✅ DONE 2026-08-05: THE ADMIN WORK LIST — do NOT rebuild it
> Owner, 2026-08-03: *"there are so many buttons and menus. we want this simplified and easier to
> manage."* Then the decisive follow-up: *"a faster way to respond to quick actions needed instead
> of them making jump to a new page."*
>
> 🔴 **START BY READING WHAT SHIPS.** `/admin/work` was ALREADY the ranked work list and
> `/admin/more` was ALREADY the all-surfaces map — I nearly rebuilt both. Five merged PRs, all
> delta: a triage strip (past promise · due soon · on pace) + lane chips; `?open=<queue>` expands
> a drawer with the top 3 real items; **payments · verify · approvals settle on ONE CLICK**;
> **reviews · payouts settle on a FORM**; clear queues collapse behind one line.
>
> 🔑 **THE ACTION SHAPE IS DECIDED BY WHAT THE CODE REFUSES TO RUN WITHOUT — not by taste.** This
> corrected my own call mid-build: reviews looked like a one-click queue until
> `overridePublishReview` turned out to throw *"Override reason is required"*. Same for payouts,
> which needs the method AND the reference of a hand-made transfer. Read the action first. That is
> now the test for the fact / judgement / needs-details split (`DECISION_LOG` 2026-08-04).
>
> 🔒 **JUDGEMENT QUEUES GET NO BUTTON AT ALL** — disputes, fraud, user reports, erasure requests,
> integrity watch, concierge abuse, force majeure. Each shows a SENTENCE where the buttons would
> be. A fast button invites a wrong call at speed on exactly the queues where being wrong costs
> most; silence would read as an unfinished feature, so the sentence teaches the rule.
>
> 🪤 **`count === null` MEANS "NOT MEASURED", NOT "ZERO".** Filing an unmeasured queue under *"N
> queues are clear"* puts it in the one place a reader has been told they need not look — and it
> looks completely fine. Guarded and mutation-checked.
>
> 🪤 **FOUR PAYOUT COLUMN NAMES WERE WRONG ON THE FIRST PASS**, as three payment ones were the week
> before. A Supabase select naming a phantom column returns an ERROR, NOT A CRASH ⇒ it ships as a
> **silently empty drawer**. The column scan caught both; run it after any new query.
>
> ⏭ **The one thing left is the owner LOOKING** — nothing here has been seen on a real phone.
>
> **THEN A VERIFICATION PASS FOUND THREE MORE, ALL MINE, ALL GREEN IN CI — one disease:
> A MECHANISM BUILT AND NEVER PROVEN REACHABLE.** Fixed in #4148.
> 1. 🚨 **The duplicate-reference guard was INERT from the hour it merged.** It queried
>    `status IN ('matched','paid')` — **there is no `'paid'`**; the enum is
>    pending/matched/rejected. Postgres rejected the WHOLE query, `data` came back null, and
>    it concluded *"no duplicates"* on every payment. Its seven tests passed because they read
>    SOURCE and exercised the PURE comparison; **neither runs the query.** 🔑 **THE HOUSE RULE
>    APPLIED ONE LEVEL TOO SHALLOW** — I knew "a phantom COLUMN returns an error, not a crash"
>    and missed that **ENUM VALUES fail identically.**
> 2. **`unreadable` could never be set** — it lived in a `catch`, but **Supabase does not
>    throw**, it resolves with `{ error }`. A failed read still said *"Nothing waiting here"*
>    with a green tick.
> 3. **Every refusal was invisible** — the actions wrote `settle=`/`why=` into the URL and
>    nothing read them. Worse, the payment flips to `matched` BEFORE the shortfall check, so
>    the row vanished and the count dropped while the order stayed unpaid. A docblock I wrote
>    asserted the opposite. 🔑 **A GUARD THAT REFUSES IN SILENCE IS INDISTINGUISHABLE FROM ONE
>    THAT PASSED.**
> 🛡 `lib/guards-can-actually-fire.test.ts` now enforces the class: statuses checked against
> the migration enum, every peek read must check its error, every `settle=` outcome must have
> somewhere to be shown. ⚠ Its status scan is scoped to the QUERY CHAIN — a first cut flagged
> ten ORDER statuses and **a guard that cries wolf teaches you to skim past the one time it is
> right.**
>
> **PAYMENTS — the owner's five asks (2026-08-05). THREE ALREADY WORKED.** Short payments +
> the paste-the-bank-alert matcher + the request-better-proof button all ship. Built this
> session: **duplicate detection** (#4146 · same order = REFUSED, no override; different order
> = warn + typed acknowledgement; **NOT a UNIQUE constraint** — the corrected re-send, one
> lump sum over two orders, and the BDO rail where our code WRAPS theirs are all honest
> repeats) and **the photo upload that was refused outright** on the couple's order page and
> the vendor's fee page (#4145 — `payments/<orderId>` was read as an EVENT id). 🔑 **What broke
> was the SECOND chance**: the first screenshot arrives via a different screen, so
> *"send a clearer picture"* was addressed to someone who could not.
> 🚨 **`/admin/booking-fees` ("Fees owed") is NEW** (#4138) — no buttons by design; money is
> confirmed where the PROOF is.
> ⚠ **The "four-tier automatic bank-inbox matcher" in our own notes DOES NOT EXIST IN CODE.**
> What ships is the admin pasting an alert into a box that highlights the likely row.
> ⏭ Owner call: whether a reference should be REQUIRED on the four pay-Setnayan forms (cash is
> only ever a couple→VENDOR thing, a different form Setnayan does not reconcile).

> ### ▶ ALSO ACTIVE: PARTNERSHIPS + CONSENT — shipped 2026-08-05, read before touching either
> **Owner ruling: partnerships are FREE on both sides, forever.** *"no payment for any. but we
> have to build it properly."*
>
> 🚨 **`sponsored_included` / `sponsored_discounted` NEVER MEANT PAID PLACEMENT** — the vendor
> sponsors their PARTNER'S SERVICE FOR THE COUPLE (in their package free / discounted alongside).
> The word sent **two independent readers** to the same wrong conclusion: the 2026-07-27
> ranking-honesty finding *"paid placement is reordering the marketplace"* (**now corrected in
> `DECISION_LOG.md` — do not act on it**) and a 2026-08-05 pricing recommendation argued to the
> owner twice. ✅ **Renamed at the source** (migration `20271108090000`): `included_in_package` ·
> `discounted_together`. 🔑 **DOCUMENTATION WAS TRIED FIRST AND WAS NOT ENOUGH — a comment does
> not travel with the value** into a query result, a log line or an audit. When a stored value's
> NAME is what misleads, rename the value.
> ⚠ I also mis-stated that partnerships carry a **two-admin gate — they do NOT**; that gate is on
> **journal spotlights**. On partnerships it was RETIRED (it only ever flipped `admin_verified`,
> which stopped gating visibility under the mutual-accept model).
>
> **Also fixed (PRs #4113 · #4116):** two files ranked the same four kinds in OPPOSITE orders
> (the profile page picked alphabetically, Explore by `PARTNERSHIP_RANK`) — now one shared order,
> **by what the COUPLE gets** · both bundle kinds rendered as the meaningless *"Preferred
> partner"* · a partnership could never CHANGE kind (🔑 **moving INTO a pricing claim re-asks the
> partner AND drops `accepted_at`, so the badge comes down while they decide** — it is a claim
> about someone else's money) · partnerships had **nothing inviting a vendor in** (owner:
> "promote") → a `build_partnerships` growth rec that **stops at 3 partnerships** and **hides on a
> read error**, because a failed count returns 0 and 0 looks exactly like "you have none".
>
> **🪪 CONSENT — the words now follow the event's mode.** Because `papic_face_mode` had no writer
> for 7 weeks, EVERY event is `mode_b` — yet the RSVP box said *"I consent to facial-recognition
> photo matching for this event"* on all of them. Guests consented to a technique that never ran
> and expected photos to find them. mode_a copy unchanged; mode_b now says **no facial
> recognition runs**. 🔒 The 18+ box stays required in BOTH modes. ⛔ **The consent GATE on the
> write path was deliberately NOT touched** — loosening it is an owner/DPO call.
>
> **🖼 A partially-denied gallery no longer reads as the whole album.** A coordinator could read
> only vendor documentation shots (the couple-only sources refuse silently) and the card said
> *"Your gallery"*. Now asks the permission question SEPARATELY and **fails toward the caveat**.
> ⛔ Nothing widened — `COORDINATOR_AREAS` has **no photo area at all**; whether it should is an
> OPEN product call.
>
> 🪤 **THREE SELF-CAUGHT FALSE ALARMS IN ONE STRETCH, all from one query each:** "`papic_photos`
> has ZERO read policies ⇒ nobody can see their own gallery" (it has two `FOR ALL` policies —
> my filter was `cmd='SELECT'`) · "`schema_migrations` lies, the rename never applied" (my read
> raced the deploy; re-query showed the new CHECK) · and a mutation test that **silently did not
> apply**, so its green meant nothing. 🔑 **VERIFY THE SABOTAGE LANDED BEFORE TRUSTING THE GREEN**,
> and re-query before reporting anything scary.
>
> ⏭ **OPEN, owner-only:** coordinator→emcee (the emcee cannot read coordinator messages at all;
> opening it means granting member-level access to the couple's private notes) · whether a
> coordinator should ever see couple Papic photos · a per-vendor visibility switch for the couple.

**If you are starting a session on ANY topic, do these three things first:**
1. Read the ACTIVE block above (even if your task seems unrelated — it may already be covered).
2. Run RULE 0 from the repo's own `CLAUDE.md`: grep for the feature noun in `apps/web` BEFORE
   designing anything. Two features the owner asked for on 2026-07-27 turned out to already ship.
3. Verify claims against **live prod or shipped code**, not against specs or handoffs — the
   iteration specs are archive stubs and `schema_migrations` can lie about what actually landed.

## 🧭 SOURCE OF TRUTH (read this FIRST — flipped 2026-06-07)

**Canonical reference: [`AS_BUILT_GROUND_TRUTH_2026-06-07.md`](AS_BUILT_GROUND_TRUTH_2026-06-07.md).** Source-of-truth order: **(1) live site `www.setnayan.com` → (2) shipped code `apps/web` @ `origin/main` → (3) live prod DB → (4) the ground-truth doc → (5) iteration specs / dated handoffs = REFERENCE + HISTORY ONLY, may be stale.**

> ⚠ **The canonical iteration specs are ARCHIVE STUBS as of 2026-07-02.** Each `NNNN_<slug>/NNNN_<slug>.md` (and its `.docx` mirror) has been **gutted to a one-screen pointer** — title + "where current truth lives" + a `git show 573a96c:<path>` recovery command + links to any newer dated siblings in the same folder. The full original bodies were **not deleted** — they live in git history at `573a96c` and are one command away. This replaced the old "append-a-banner-on-top-of-the-stale-body" pattern, which is exactly why stale prices/SKUs kept resurfacing: the stub is now the *only* thing the canonical filename serves, so a grep or a cold read can no longer surface superseded claims. **Do NOT re-expand these stubs** — if an iteration needs fresh detail, write a new dated file in its folder (a "newer sibling") or update the living main; never paste the old body back into `NNNN_<slug>.md`. When any spec disagrees with the live site / code / ground-truth doc, **the latter win.** The old "after every code change, edit the corpus + regenerate .docx + `[PENDING]` to `COWORK_INBOX`" sync mandate is **relaxed** — log notable decisions at the **bottom of `DECISION_LOG.md`**; the code is canonical, the corpus is the archive + decision history.

## Status anchors (read these before any work)

Two status docs sit at the spec-corpus root. Cross-reference them at the start of every session — they answer "where are we?" without re-reading the whole iteration tree.

- **[V1_Gap_Analysis_Status.md](V1_Gap_Analysis_Status.md)** — did we update the *spec corpus* for each gap-audit item? (single-pane view of Tier 1/2/3 spec landings)
- **[App_Build_Status.md](App_Build_Status.md)** — did we ship the *app code* for each iteration? (spec vs. live `origin/main` audit; ✅/⚠️/🟡/⛔ per iteration with what's still missing inline)
- **[Installed_Stack_Inventory.md](Installed_Stack_Inventory.md)** — what's actually *wired under the hood*? (10-pass audit: deps, migrations, routes, actions, integrations, env vars, CI, desktop, PWA)
- **[API_Integration_Checklist.md](API_Integration_Checklist.md)** — external service prereqs (signups, keys, DNS) the owner must action before code can run end-to-end.
- **Repo-side mirrors** (at `https://github.com/iscasasola/setnayan-platform`): `STATUS.md` (living checkpoint), `HANDOFF.md` (cold-start handoff), `OWNER_ACTIONS.md` (phased launch checklist), `CHANGELOG.md` (every change with `SPEC IMPACT` flag), `COWORK_INBOX.md` (pending spec updates).

When code lands ahead of a spec update, the repo appends a `[PENDING]` line to `COWORK_INBOX.md`. Walk those entries at the start of any Cowork session and apply each via the spec file it names, then mark `[DONE <date>]`.

## What this product is

**Setnayan** (spoken: SET-na-yan, brand-origin phrase *"Set na 'yan."* — Tagalog for "that's all set") is a Philippines-first life-events platform. V1 surface is weddings; the product is built for the broader event market (birthday · debut · christening · gender reveal · celebration · travel · corporate · tournament · anniversary · graduation · reunion) as event types unlock over time. One app, three role-routed doorways: **customers** plan events end-to-end, **vendors** run a free-during-launch business profile, **admins** (Setnayan team) run operations from a 7-surface internal console. The full 33-iteration spec spine is documented across `0000_*` through `0035_*` folders.

**Papic** (the candid-capture iteration `0012_papic/`) is one of the in-app SKU-driven services within Setnayan. Designated friends/family ("paparazzi") shoot unlimited photos and 5-second clips, tag guests via QR scan, deposit everything into a shared gallery on the couple's existing Setnayan landing page. Every guest gets their tagged photos in real time and can render a 1–30 second personal souvenir reel from a pre-made template library.

**Full Papic spec:** `02_Specifications/10_Papic_Feature_Specification.md` — read it when in doubt.

## Locked V1 scope (do NOT expand without explicit owner sign-off)

### SKUs

**There is no price table in this file, on purpose.** Prices moved often enough that every copy of them became a way to quote a dead number. The only sources are, in order: the **live site** → the **live DB** (`platform_retail_catalog_v2`, `vendor_billing_catalog`) → **`Pricing.md § 00`**. Read one of those; never a table in a primer.

**Vendor-side shape** (amounts live in `vendor_billing_catalog`): Solo · Pro Vendor · Enterprise · Custom, each 28-day with an annual, plus à-la-carte add-ons. **Token packs are RETIRED (2026-08-07)** — the vendor token currency is gone entirely. ⚠ **THERE IS A BOOKING FEE — but ⚠ CORRECTED 2026-08-06: the "0% commission on vendor bookings" line is *CORRECT AND STAYS*.** Owner, verbatim: *"this is not commission. it is a syncing fee/booking fee."* The couple pays the vendor directly and Setnayan never touches that money; the fee is charged to the VENDOR for the introduction + in-app sync. 🔑 **NEVER call it commission anywhere — product, copy, logs or admin.** (This sentence previously read "…is now FALSE", contradicting the correct statement 80 lines below it in this same file.) Owner-locked taper (`Vendor_Monetization_Model_LOCKED_2026-07-25.md` § 3, coded in `lib/booking-fee.ts` — **derive the rate, never re-type it**): **5% on the first ₱100,000 · 1% above · floor ₱50 · NO cap.** Scope: **SOURCED clients only** (BYO / vendor-invited / returning are free forever), and a verified vendor's **first 5 sourced bookings are free**. Currently **flag-dark** (`NEXT_PUBLIC_BOOKING_FEE_ENABLED`, default off) — nothing is charged until the owner flips it. Enterprise is a BOUNDED tier (up to 10 team seats · 100 km reach · unlimited categories); Custom is the truly-unlimited tier above it. Market Intel (Demand Radar + Price-Position) is **Pro-and-up**.

### Hard product constraints

- **10-second hard cap on video clips.** Capped client-side. UI must enforce. Clip currency is **10s = 7 points** (photo = 1 pt). Ships as an isolated post-metering PR (clip-point value is a hardcoded constant on the fail-closed capture path). See `0012_papic/Papic_One_Pool_Model_Spec_2026-07-22.md § 0`. ⚠ 10s clips are ~2× the bytes and clips don't compress yet → coupled to the clip-web-copy storage PR.
- **NO per-photo tag limit (owner 2026-08-06: "no tag limit. we can tag as many").** Supersedes the 20-tag lock of 2026-07-23, which superseded a 10-tag lock of 2026-06-17. Combined individual + table + face + self-link — none of it is counted against a ceiling any more. Migration `20271117449785`. ⚠ **The 20-cap was never the real bug:** the two capture screens hardcoded **10** while the DB had allowed 20 since 2026-07-23, so a paparazzo was cut off at half the real limit and told "that's the max" — the owner's decision reached the database and never reached the screen. 🔑 A 100,000 ceiling remains in `enforce_photo_tag_cap()` purely as a runaway-write backstop (retry storm / loop bug), **not** a product rule; no real photo approaches it.
- **Untagged-still-delivered guarantee.** Every uploaded photo lands in the couple's gallery regardless of tagging status.
- **Personal Reels:** vertical 9:16 only (1080×1920), 1–30 seconds duration, max 5 guest picks + max 5 couple memorable clips, template-driven render (no per-render AI).
- **Music:** Setnayan-owned AI-generated catalogue only. No major-label music. No per-render music license fee.
- **DSLR pairing is 1 phone : 1 DSLR.** Multi-DSLR-per-phone is V2. WiFi-SDK only in V1; no USB tether.
- **Face detection is per-event-scoped.** Vector store never reused across weddings. Confidence ≥ 0.85 auto-tags; 0.65–0.85 surfaces a suggested tag; below 0.65 the photo uploads untagged.
- **Capture metadata is mandatory.** Every photo and clip stamps `captured_at`, `geo_*` (when fix available), `device_model`, `paired_camera_brand/model` (when paired). Geo is stripped on outbound shares; original on R2 retains it.

## Architecture summary

### Stack

- **Native apps:** iOS 16+ (SwiftUI + AVFoundation), Android 11+ (Compose + CameraX)
- **Backend:** existing Setnayan backend (extend it, don't fork it)
- **Storage:** Cloudflare R2 — **Asia-Pacific (APAC) · ✅ CONFIRMED IN THE CLOUDFLARE DASHBOARD 2026-08-01** (owner read `setnayan-media` → Location: *Asia-Pacific (APAC)*; bucket created 2026-05-13). The old "PH-region buckets" was false in two ways — **R2 has no Philippines region**, and it implied PH residency we do not have — and this line is where that claim propagated from into the live public `/privacy` notice. — hot 90 days, IA cold 5 years
- **Render pipeline:** FFmpeg on Cloudflare Workers + R2 (or Hetzner VM pool fallback)
- **Auth for paparazzi seats:** wedding-scoped ephemeral session tokens via QR-code claim flow (not username/password)
- **QR scanning:** AVFoundation metadata output (iOS) / ML Kit Barcode Scanning (Android)

### Data model (key tables — full schema in spec Part 4.1)

```
Event(event_id, couple_id, paparazzi_tier{3|5}, templates_unlocked[], geolocation_enabled{default true})
PaparazziSeat(seat_id, event_id, claimer_user_id, claim_qr_token)
Guest(guest_id, event_id, assigned_table_id, personal_qr_token)  -- existing in Setnayan
Table(table_id, event_id, table_qr_token)
Photo(photo_id, event_id, paparazzi_seat_id, r2_object_key, type{photo|clip},
       captured_at, geo_lat, geo_lon, geo_accuracy_m, geo_unavailable,
       device_model, paired_camera_brand, paired_camera_model,
       auto_face_attempted, ...)
PhotoTag(photo_id, guest_id, source{individual_qr|table_qr|auto_face|manual_pick}, confidence?, ...)
Template(template_id, feel_category, manifest_json, paired_music_track_ids[])
EventTemplateUnlock(event_id, template_id, purchased_at)
PersonalReel(reel_id, event_id, guest_id, template_id, selected_photo_ids[], r2_output_key)
DslrPairing(pairing_id, event_id, paparazzi_seat_id|live_stream_camera_id,
            brand{canon|nikon|sony|fujifilm}, model, last_paired_at, status)
FaceEnrollment(enrollment_id, event_id, guest_id, source{rsvp_profile|guest_portal|checkin_kiosk},
               vector_blob, quality_score, captured_at, revoked_at?)
```

### Critical flows

**Paparazzi capture → upload → tag:**
1. Native app captures photo/clip → local SQLite WAL
2. Background uploader (BGTaskScheduler/WorkManager) PUTs to R2 via signed URL
3. Tag scanner sheet → scan guest QR (`setnayan:guest:{id}`) or table QR (`setnayan:table:{id}`)
4. Tag intents flush to backend with the upload payload
5. Backend fans out table-tag to all guests assigned to that table (⚠ **NO CAP** — the 10/20 ceilings were retired by the owner 2026-08-06, *"no tag limit. we can tag as many"*)

**Personal Reel / Story render (⚠ CLIENT-SIDE, download-only — reversed 2026-07-23, owner):**
The reel maker is **free** and renders **entirely in the guest's browser**; the output is **downloaded to their phone and Setnayan stores nothing** (no R2 write, no DB row, no shared feed). This matches the BYO-music not-distributor posture (`14_...Playbook.md §16.7`). See `DECISION_LOG.md` 2026-07-23.
1. Guest opens the reel maker (reward for completing a Papic Challenge — see `0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md §8`)
2. Guest freely picks up to ~10 items — **any mix of their own Papic photos + clips** (relaxes the locked "5 guest + 5 couple" split) → target 30s, 9:16 1080×1920
3. Picks music: their own upload (BYO, client-side per §16.7) **or** an owned-catalogue template track
4. **Browser** loads the template manifest + the guest's source assets (pulled from R2 — prefer the compressed, geo-stripped `clip_web_r2_key` web-copy; egress is free) + music, and renders via WebCodecs (fallback ffmpeg.wasm)
5. Output MP4 (~15–25 MB) → **guest downloads to phone.** Setnayan holds zero story files → no storage accumulation on our side. Cost to us = ₱0.

## Music & template assets

The music catalogue and template library are generated through a separate Cowork-driven workflow — see `14_Music_Catalogue_Cowork_Playbook.md`.

- **Music catalogue:** ~400 owned AI-generated tracks (Suno Premier, generated once, owned forever) across 6 categories — Bridgerton-Feel, Taylor-Swift-Feel, Michael-Jackson-Feel, Jazz, Sunday Morning Vibes, Hip Hop. Stored under `/music_catalogue/{category}/{filename}.mp3`. Manifest at `/music_catalogue/catalogue_manifest.json`.
- **Template library:** ~400 production-ready JSON manifests under `/template_library/{feel_category}/TPL_{nnn}.json`. Master index at `/template_library/library_index.json`. Schema documented in spec Part 4 / playbook Section 12.

When the backend serves a template selection UI to the couple, it reads from `library_index.json`. When the renderer needs music for a render, it picks from the manifest based on the template's `music_pairing_categories` and `music_pairing_bpm_range`.

## Cost shape

Per-render cost: ~₱2–₱5 (FFmpeg compute + R2 storage; music free, CDN egress free on R2). Most digital SKUs run ~90–99% margin — the cost side is compute and storage, both small and roughly flat per event.

**Live Stream cost is audience-independent.** YouTube absorbs all viewers at ₱0 marginal cost to Setnayan. Per-event cost scales only with camera count and stream duration; whether the wedding has 100 viewers or 1,000,000 viewers, Setnayan's bill is the same.

## Payment system (V1 — apply-then-pay)

Setnayan monetizes via **PHP-direct apply-then-pay** with manual reconciliation. Couples always pay in PHP and never see a token balance. **Neither does anyone else: the vendor-side token currency was RETIRED 2026-08-07** (owner lock 2026-07-21 — *"token can retire, there should be nothing that needs token anymore"*). No packs, no bundles, no grant surface, nothing that spends one. Prod never saw one bought or spent. ⚠ Two token things are still OPEN and are the owner's call: `/vendor-dashboard/creators` (its whole meter is tokens) and the ACTIVE `vendor_custom_included_token` ₱100/cycle row on the Custom plan. See `Pricing.md § 0.C`.

- **Payment rails (V1):** static BDO + GCash receiving accounts owned by Setnayan. Customer applies for a service / order → receives payment instructions email with unique reference code → pays externally → Setnayan Team manually verifies against BDO/GCash inboxes within 24-hr SLA → service activates.
- **PHP-only pricing.** No tokens, no in-app wallet balance, no spending primitive. Each order is a discrete PHP charge tied to a `service_orders` row with `service_key`, `customer_id`, `amount_php`, `reference_code`, `status ∈ pending_payment / paid / failed / refunded`.
- **No CUSTOMER-side convenience fee** — couples are never surcharged. ⚠ **But the vendor side is no longer 0%: the BOOKING FEE (5% first ₱100k · 1% above · floor ₱50 · no cap, sourced clients only, first 5 free) was owner-locked 2026-07-25.** See the SKU section above; the rate lives in `lib/booking-fee.ts`, never in a doc. ✅ **"Setnayan does not hold money" is CORRECT and must stay** (owner, 2026-08-03: *"they do not transact on our website. they just set the final quotation and we charge them that booking fee and they pay it to sync on the app"*). The couple pays the vendor **directly, off-platform**; Setnayan never touches that money. The booking fee is charged to the VENDOR against their quoted figure — it is a platform fee for the introduction + the in-app sync, **not** a cut of the couple↔vendor deal, so 0% commission and a booking fee are both true at once. ⚠ **`lib/payouts.ts` + `/admin/payouts` are a LEGACY path, not the live model** — its own call site says so: *"Retired 2026-05-28 V2 cutover… Setnayan is now a software publisher, not a marketplace intermediary… new V2 orders won't route through it."* It fires only for pre-V2 orders carrying `vendor_profile_id`. A separate automated **Setnayan Pay gateway** (per-rail 1.5%/2.0%/2.5% in `setnayan_pay_methods`) is **dormant** — every row is `is_active=FALSE`, not charged in V1.
- **V1.5 roadmap:** automated reconciliation via GCash Merchant API (probable) or PayMongo integration (under evaluation). Activation latency drops from 24-hr to minutes.
- **Comp + Unlimited-Use Grants:** admin can issue free-render or unlimited-use grants to specific customer accounts. Grants are a `comp_grant_id` populated on `service_orders` that skip the payment-pending state.
- **Spec convention:** prices are written in PHP everywhere — specs, design conversations and the in-app UI alike. Nothing talks in tokens any more.

## What's NOT in V1 (don't build, don't backdoor in)

- All-Guest Unlock tier (every guest can shoot via web)
- Native Pro Capture Pack (RAW, manual focus peaking, ISO/shutter)
- Roving Papic service tier (staff photographers)
- Premium Photojournalism + Photo Book
- AI Top-50 same-day curation
- Live Photo Wall venue projection
- Photo Mission system / crew leaderboard
- Cross-paparazzi de-duplication
- **BYO music is ALLOWED** as Guest Stories' "Your music (upload)" source, **client-side render ONLY** (uploaded audio never enters the server pipeline → Setnayan is not the distributor). Spec: `14_Music_Catalogue_Cowork_Playbook.md` §16.7.

These are tracked in spec Part 6. Each is a future spec.

## Privacy & compliance

- PH Data Privacy Act (RA 10173) — guest consent at RSVP, opt-out flow, face-blur for opt-outs. ⚠ **Retention is NOT 5 years for photos** — full-res originals drop at **6 months from first capture** (default-ON), the compressed gallery is kept indefinitely; 5 years applies to MESSAGES.
- Couple has 7-day review window (configurable) before public unlock
- NSFW filter is on by default and CANNOT be disabled
- DPO is the **proprietor, Indalecio Sacdalan Casasola II** (registered on the NPC DPO system 2026-07-07). ⚠ Not Claire E. Buanhog — she is VP / co-founder and DBRT support. See [[dpo-designation-owner]].
- **Data residency: NOTHING is hosted in the Philippines.** Database = **Supabase, Singapore** (this is also where the biometric face vectors live — `guest_face_enrollments.face_vector`, `user_face_profiles`). Object storage = **Cloudflare R2, Asia-Pacific (APAC)** (media + the source selfie images, *not* the vectors) — **✅ CONFIRMED IN THE DASHBOARD 2026-08-01**, no longer an assumption. Corrected 2026-07-31 from "PH-region buckets", which was false in two ways (no PH region exists; and it implied PH residency we do not have) and had propagated into the live public `/privacy` notice. ⚠ **Five buckets, not four** (`media` · `thread-files` · `vendor-contracts` · `samples` · **`vendor-verification`** — the last holds vendor government IDs); the code's `R2_BUCKETS` is canonical.

## Common pitfalls / gotchas for engineers

1. **Don't render reels server-side with major-label music.** Even with TOS click-through, server-side rendering makes Setnayan the direct infringer. Catalogue is owned-AI-generated only.
2. ⚠ **CORRECTED 2026-08-07 — this said "don't auto-delete photos within 5 years… we match" and it is FALSE.** Full-resolution originals are **deleted 6 months from the event's FIRST capture** (an engagement shoot starts the clock), floored at 30 days after the event, and the sweep is **DEFAULT-ON** (`papic-fullres-drop.ts` — `!== 'false'`). The **compressed gallery is kept indefinitely** — that is the part that is forever. Google Drive is the only way a couple keeps originals. The live `/privacy` page now says exactly this; this file said 5 years for five days after the code said six months.
3. **Tag fan-out from table QR.** ⚠ **No truncation — there is NO tag cap** (owner 2026-08-06). The old "alphabetize and truncate at 10" rule is retired; a 100,000 backstop remains in the trigger purely to stop a retry storm and is **not** a product rule.
4. **Untagged photos still go to the couple.** Don't filter the couple's gallery view by tag presence.
5. **Personal Reel duration is flexible (1–30s) but template slot durations don't all need to scale linearly.** Some templates have minimum slot durations; if guest picks 1s reel from a template with 4s minimum slots, swap to a shorter-template variant or surface an error.
6. **Wedding-scoped session tokens.** A paparazzi seat token only works for its bound event. Don't allow cross-event reuse.
7. **R2 free egress is a real architectural advantage.** Use Cloudflare's CDN end-to-end. Don't proxy through a different cloud unless absolutely necessary.

## Companion documents

- `10_Papic_Feature_Specification.md` — full product spec, single source of truth
- `14_Music_Catalogue_Cowork_Playbook.md` — music + template asset generation playbook
- `09_Panood_Feature_Specification.md` — Live Studio (livestream/control-room; renamed from "Panood" 2026-06-29; filename + internal SKU key `PANOOD_SYSTEM` unchanged) feature (cross-references the same backend + landing page)
- `07_V1_Developer_Specification.md` — overall Setnayan V1 dev spec (RSVP, seating chart, payments — all of which Paparazzi depends on)
- `13_Engineering_Brief.docx` — Setnayan engineering high-level brief

## Iteration build order (forward-sequenced)

`Status` = spec drafting state. `Built` = what exists in the codebase right now (✅ = shipped to code, ⚠ = partial, blank = unbuilt). Built status updated as each iteration's code lands; the doc's `Status` column stays as the spec-drafting field.

| # | Folder | Status | Built | Surface |
|---|---|---|---|---|
| **0000** | `0000_app_shell_and_navigation/` | **drafted 2026-05-09** | ⚠ Phase 1 | **App shell foundation — universal Setnayan account (`users`), login, event picker, primary event auto-jump (1 active event jumps in; 2+ shows picker), event QR + scan-to-join flow with role picker, four bottom-nav tabs (Guest List / Vendors / Schedule / In-App Services), event-scoped URL pattern `/dashboard/[event-id]/[section]`, services launcher grid, unified Schedule view. Vendor accounts placeholder (deferred to Din)** |
| 0001 | `0001_creating_guest_list/` | drafted | ✅ | Couple dashboard guest list + roles |
| 0002 | `0002_qr_invitation_system/` | drafted | ✅ v2 | Personal invitation site renderer + branded QR |
| **0004** | `0004_invitation_widgets/` | **drafted (this session)** | | Customization editor, Basic/Pro widget tiers, Pro purchases via wallet |
| 0005 | `0005_led_background_maker/` | drafted | | 8K LED screen template maker (USB delivery, offline) |
| **0006** | `0006_vendors_management/` | **drafted 2026-05-09** | | Couple-managed vendor registry — hybrid service taxonomy (28 canonical + custom), flexible payment milestones, computed crew meals, R2 contracts. No wallet integration (vendor money is external) |
| **0007** | `0007_budget_expenses/` | **drafted 2026-05-09** | | Couple's payment ledger — 3 line items per vendor (Package / Crew Meal / Transportation), payment log with proof, vendor QR display, .ics calendar export, Setnayan platform costs auto-populate from 0003 wallet |
| **0008** | `0008_seating_chart_editor/` | **drafted 2026-05-09** | | Seating chart editor — 13-entry table catalog (round / long / king / sweetheart / serpentine), free-placed stage, role-tier ring auto-fill, QR-on-publish print pack, peer tagging is QR-scan only with tag-once trust handshake |
| 0009 | `0009_photo_delivery/` | partial | | Google Drive integration for photo delivery |
| **0010** | `0010_mood_board/` | **drafted 2026-05-09** | | Mood Board V1 — palettes only (role + venue), Setnayan Guide rule engine with 7 categories, 20 pre-template themes, color name library, image extraction, master palette dedup. Stylist persona + inspirations + venue segments deferred until stylist exists |
| **0011** | `0011_live_stream/` | **drafted 2026-05-09 · re-revised 2026-05-09** | | Ships as **Live Studio, ONE SKU `LIVE_STUDIO`, per event-day, no per-camera fee** (canon: `Live_Studio_Unified_Spec_2026-07-25.md`). YouTube as sole in-app delivery, registers shared Custom Monogram Pack flag consumed by 0012 |
| **0012** | `0012_paparazzi/` | **drafted 2026-05-09** | ⚠ webapp slice | Paparazzi V1 — native iOS/Android, rear-only, gesture shutter, QR tagging, consumes monogram pack |
| **0013** | `0013_platform_stack_and_sync/` | **drafted 2026-05-09** | ⚠ partial | **Platform Stack & Sync Setup — Vercel + Supabase + Cloudflare R2 + GitHub. User Setup Checklist (Section A), Claude Code Implementation Guide (Section B), Integration Tests (Section C). MUST BUILD FIRST as Sprint 0 even though numbered 0013.** |
| 0014 | `0014_v1_1_polish/` | empty (queued · no folder on disk yet) | | V1.1 polish — Photo Center, profile photo auto-update, expanded filters, battery escalation, delivered indicator (renamed from 0013, displaced by Platform Stack iteration) |
| **0015** | `0015_main_website/` | **re-drafted 2026-05-11 · brand finalized 2026-05-12** | | **SETNAYAN public marketing site at setnayan.com (working) / setnayan.com (current). Two-sided split hero (couple ↔ vendor), free vendor registration during launch, feature catalog visible / prices hidden, EN-primary luxurious-Filipino-modern voice (TL · CEB toggles), uploaded symbol mark + SETNAYAN wordmark (spelled in full), "Set na 'yan." brand-origin. One product, three doorways (customer / vendor / admin role-router).** |
| **0016** | `0016_step_by_step_plan_builder/` | **now "Setnayan AI"** | | **Setnayan AI — the couple-side assisted planner (DIY remains the free default). Deterministic, not an LLM. Price + tier shape live in `Pricing.md § 00` and the live catalog, never here. Full roadmap · nudges · vendor matching · honeymoon planning.** |
| 0017 | `0017_patiktok/` | drafted | | Patiktok templates — short-form vertical video templates for the post-event "personal reel" experience (V1 Sulyap roadmap; complements 0024 Save-the-Date). |
| 0018 | `0018_supplies_marketplace/` | drafted | | Supplies marketplace placeholder — third-vertical "Supplies" exploration (deferred; precursor to the second-vertical car-services concept). |
| 0019 | `0019_communications/` | drafted 2026-05-11 | | **In-app communications: text chat between couples ↔ vendors; coordinator role gets per-thread join permission. Doc / sheet / pdf / image readers attached to threads with dedicated R2 storage. Vendor-side messages always display company logo (never personal photo) per § 3.10. Free use across the board. No in-app video meetings — couples + vendors use external tools.** |
| 0020 | `0020_interaction_prototype/` | drafted 2026-05 | | Cross-cutting 8-phase interaction prototype (vendor → customer → Papic → other features). |
| **0021** | `0021_couple_dashboard_fully_purchased/` | **drafted 2026-05-10 · theme system + icon migration pilot 2026-05-12** | | **Fully-purchased couple dashboard — 9 surfaces (Overview/Guests/Vendors/Schedule/Services/Seat Plan/Landing/QR Hub/Gallery). Pilot for the 5-theme system (Setnayan Default · Victorian · Classy · iOS · Forest Theme) with runtime theme picker + Lucide icon framework. Home deadline scheduler re-anchored to earliest-chosen-date + "Upcoming schedules" (2026-06-03).** |
| **0022** | `0022_vendor_dashboard/` | **drafted 2026-05-10 · mandatory logo + chat masking 2026-05-12** | | **Vendor dashboard — 6 surfaces (Home/Services/Calendar/Clients/Threads/Team & Setnayan). Mandatory company logo upload at registration per § 2.1b. Pro subscription · plan builder · custom service categories.** |
| **0023** | `0023_admin_console/` | **drafted 2026-05-12 · Team Pool + Payment Methods + § 9.1 scope 2026-05-12** | | **Setnayan internal admin surface — 29 surfaces. Vendor verification queues · payment reconciliation · disputes · pricing catalog · Team Pool widget (§ 10b) · 🟣 internal accounts (§ 10a) · Payment Methods upload (§ 3.5c) · two-admin approval queue gated to major decisions (§ 9.1) · surface #29 Promoted Events & Broadcast (V1.6 · § 3.16).** |
| **0024** | `0024_save_the_date/` | **REDESIGNED 2026-06-17** | ⚠ reveals ✅ · content film 🟡 | **Save-the-Date = a continuous, self-playing, scrubbable CONTENT FILM (one elegant design · the 7-beat spine) under a chosen REVEAL OPENING (5: Sheer veil + four-flap/two-flap-side/two-flap-top/church-doors), recoloured to the couple's Mood Board · auto-plays fullscreen → ends → add-to-calendar (wedding + invitation-launch). FREE = the content film; PREMIUM = the cinematic openings ₱999/event (repriced 2026-07-10, was ₱799). **Built state 2026-06-18:** veil reveal PORTED #1671 · STD openings ₱799 buy flow SHIPPED #1705/#1709/#1718 (admin-approval handshake, fail-proofed) · content film (PR4 · 7-beat free film) 🟡 in build. See `0024_Save_the_Date_Content_and_Customization_2026-06-17.md` + `0024_Veil_Reveal_Spec_2026-06-17.md` + AS_BUILT § 10b.** |
| **0025** | `0025_profile_settings/` | **drafted 2026-05-12** | | **Profile Settings surface lives inside 0021/0022/0023 dashboards. 6 tabs: Profile · Appearance (theme picker) · Notifications (preferences) · URL & Slug · Payment Methods · Privacy & Data (RA 10173 — data export + soft/hard account deletion + face data revocation + marketing consent).** |
| **0026** | `0026_bir_tax_compliance/` | **drafted 2026-05-12** | | **BIR / PH tax compliance — Official Receipt generation per in-app SKU payment, VAT vs Percentage Tax decision matrix (V1 launches non-VAT), Vendor payout EWT + quarterly Form 2307 PDF, eFPS report exports for Setnayan's tax accountant, customer/vendor tax-document download surface. Critical for PH legal compliance — Setnayan can't accept payment without this.** |
| **0028** | `0028_email_notifications/` | **drafted 2026-05-12** | | **Email-only notification fallback (SMS deferred to V1.5). 10 V1 templates: payment_instructions · payment_confirmed · refund_processed · new_vendor_message · vendor_status_change · vendor_unresponsive_48h · rsvp_received · wedding_day_reminder · save_the_date_sent · security_alert. Provider Resend (SendGrid fallback). Branded HTML + plaintext, RFC 8058 one-click unsubscribe, RA 10173 + CAN-SPAM compliant.** |
| **0029** | `0029_help_center/` | **drafted 2026-05-12** | | **Help Center / FAQ at `setnayan.com/help` · 4 role tiles (customer/vendor/guest/admin) · ~90 V1 articles · full-text search · structured contact-form routing to admin roles · support ticket queue with 24-hr SLA. SEO via FAQPage schema.org. EN-only in V1; TL/CEB deferred.** |
| **0030** | `0030_guided_tour/` | **drafted 2026-05-12** | | **First-time guided tour on initial login per account type. 8-step customer · 7-step vendor · 4-step guest · 6-step admin scripts. Driver.js library. Per-surface mini-tours (11 of them). Replayable from Settings. Tour analytics in 0023.** |
| **0031** | `0031_day_of_guest/` | **drafted 2026-05-12** | | **Day-of guest experience — live-event mode auto-activates T-1hr to T+8hr on the personal landing page. 6 cards (what's-happening · your-table · live-photo-wall · video-guestbook · live-schedule · coordinator-broadcast). Offline-first PWA shell for venues with weak signal. 5-mode lifecycle (coming-soon → pre-event → live → recap → archive).** |
| **0032** | `0032_contract_intelligence/` | **drafted 2026-05-12** | | **Contract Intelligence + Builder — AI-powered contract analysis (Claude API), 14-element detection, ~50-clause Setnayan template library, both-party e-signature flow (RA 8792 compliant), compliance checklist. Paid upgrade SKU at ₱199/contract OR free unlimited with Vendor Pro Weekly. External PH counsel review gate before launch.** |
| **0033** | `0033_public_api_foundation/` | **drafted 2026-05-12** | | **Public API foundation — Cloudflare Workers gateway · OAuth2 PKCE · scoped tokens (16 scopes) · path-based versioning · rate-limit tiers (free 100/min · Pro 1K/min · Enterprise 10K/min) · webhook delivery infra · developers.setnayan.com portal. NO public endpoints in V1; plumbing for V1.5 phased rollout.** |
| **0034** | `0034_payments_and_cart/` | **drafted 2026-05-12 · reconciliation module added 2026-05-12** | | **Payments & Cart spine — 8-table canonical schema + `payment_inbox_messages` reconciliation table. Customer add-to-cart → checkout → BDO + GCash QR codes → external pay → screenshot upload → admin reconciles (Approve / Reject-needs-more-proof / Reject permanently). Resubmission supported (same order_id). § 10a internal accounts skip payment-pending entirely; § 10b team-pool members get partial / full comp atomically. No Setnayan Pay convenience fee — commission is 0%. Reference codes 8-char Crockford base32. 7-day expiry on pending_payment. 4-tier fuzzy SQL matcher (`match_inbox_to_order`) auto-pairs bank/GCash inbox notifications to orders — exact code → amount+sender fuzzy → amount-only → unmatched. Admin reviews matcher suggestions but final approve/reject stays single-admin.** |
| **0035** | `0035_observability/` | **drafted 2026-05-12** | | **Observability stack — Sentry (errors · ~₱1.5K/mo) + PostHog (product analytics · ~₱1K/mo) + Better Stack (uptime + status page + on-call · ~₱1K/mo). `/api/health` + `/api/health/deep` endpoints. Vercel Log Drains → Better Stack. Alert rules (critical paging Ops Lead · warning Slack · info digest). RA 10173 compliant — no PII in logs · session recordings disabled · PostHog opt-out toggle. Status page at `status.setnayan.com`. Total ~₱3.5K/month. Engineering effort ~1 week for one engineer.** |
| **0036** | `0036_pakanta/` | **drafted 2026-05-14 · 3-tier locked** | | **Pakanta · Your Wedding's Own Song — 3-tier custom songwriter service powered by Suno Premier. Basic ₱1,999 (1 song · 24-hr turnaround · no lyric approval) · Premium ₱3,999 (1 song · 2 versions · 3 remakes · 8-section intake · lyric approval gate · 2–5 day) · Wedding Suite ₱9,999 (3 matching songs · same Personas · same key family · lyric through-line · mastering pass · 5–7 day). Library-save mechanic makes the couple's Pakanta song(s) the backing track for every Setnayan-rendered video at their wedding. Canonical ID prefix S89K-. 85–90% margins.** |
| **0037** | `0037_bespoke_monogram/` | **drafted 2026-05-14 · prototype shipped · ⚠ LIVE SITE: ships as "Animated Monogram" — ₱999 (2026-07-10 reprice; was ₱1,999/₱2,499; see Pricing.md § 00)** | | **⚠ Live site sells this as "Animated Monogram" at ₱999 (2026-07-10; was ₱2,499/₱2,999), bundling the animation. _Original spec text:_ Bespoke Monogram (DALL-E) at ₱2,999 — fully in-app AI-driven monogram with 30-refinement loop. Couple fills brief (initials + 3 personality words + optional motif + reference uploads) → pays → brief LOCKS → DALL-E 3 HD generates 4 candidates within 5 sec → refine loop with text feedback + suggested chips (4 new variations per refinement; 30 free included; +₱199 for 10 more) → accept final → vectorizer.ai produces SVG → replaces event-wide monogram across QR center, hero, save-the-date, AI Highlight, SDE, LED, signage, gallery chrome. Customer-facing brand "Setnayan AI"; DALL-E/OpenAI never named. Retires Custom Monogram Pack ₱1,999 SKU. ~95% margin. Canonical ID prefix S89B-.** |
| **0038** | `0038_editorial_and_affiliates/` | **drafted 2026-05-19** | | **Editorial & Affiliates · V1.1 traffic-monetization expansion. `setnayan.com/blog` (long-form articles, ~1/week cadence post-launch) + `setnayan.com/recommendations/[category]` (curated picks with disclosed affiliate links — Involve Asia primary network) + Sponsored Content (paid-for editorial features w/ unambiguous "Sponsored" badge, two-admin gate ≥₱100K). Git-tracked MD pattern (same as 0029 Help Center) — content lives in `apps/web/content/editorial/`. New tables: `editorial_articles` + `recommendation_pages` + `affiliate_links` + `affiliate_conversions` + `sponsored_slot_bookings`. PostHog `affiliate_link_clicked` event w/ no PII. Newsletter sponsorship slot extends 0028. Cross-coordinates with 0022 Boosted Ads + 0039 AdSense (sponsored articles + sponsored newsletter slots are AdSense-excluded).** |

## Decision log

> **Moved to [`DECISION_LOG.md`](DECISION_LOG.md)** (corpus root) — split out 2026-06-03 to keep this primer light in auto-loaded context. The full append-only log (457 rows, ~2.2 MB) is **not** auto-loaded; search it on demand, e.g. `grep -n "2026-06" DECISION_LOG.md`. **Append new rows there** in date order, format `| Date | Decision | Why-or-affected-files |` — not in this file.
