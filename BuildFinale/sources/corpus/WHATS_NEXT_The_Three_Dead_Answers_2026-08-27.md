# THE THREE ANSWERS THE DESK STILL CANNOT TAKE — plan, not build

> **Planned 2026-08-27 (Fable, high effort). NOTHING IS BUILT.** The session that executes this is
> Opus 5 at high effort. Read this file, then re-verify anything you build on — including this
> file's own measurements.
>
> **Parent:** [`WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md`](WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md)
> § 9 (the Answers Desk) and § 7 (what needs the owner).
> **Register:** [`WHATS_NEXT_Suppliers_Room_SESSIONS_2026-08-27.md`](WHATS_NEXT_Suppliers_Room_SESSIONS_2026-08-27.md).

---

## THE SHORT VERSION

The **Answers Desk shipped and is served** — PR
[#4917](https://github.com/iscasasola/setnayan-platform/pull/4917), merged 2026-08-27T14:21Z.
It withheld **four** kinds of answer, recorded as data in `apps/web/lib/answers-desk.ts` →
`ANSWERS_THAT_DO_NOT_JOIN`, because in each case the answer does not work.

**One of the four is already fixed** — PR
[#4923](https://github.com/iscasasola/setnayan-platform/pull/4923) (`payment_claim`),
**MERGED 2026-08-27T15:36:36Z**, verified with `gh pr view`. ⛔ **DO NOT REBUILD IT.**
**This plan is the other three.**
⚠ It was OPEN when this plan was commissioned and merged while the plan was being written — which
is why § 5's ordering rule reads the way it does. **Re-verify with `gh pr view 4923 --json
state,mergedAt` before acting; this corpus has been wrong about a PR's state five times.**

| | What a person hits today | Size | Owner? |
|---|---|---|---|
| **1 · The waitlist pick** | Shop presses *Pick*, screen says it worked, **the database refused the write and said nothing**; the couple is never told | one action + one email + one couple-side sentence · **no migration** | **no** |
| **2 · The paid crew shift** | Cannot be posted (host sees a raw database sentence), cannot be seen, cannot be accepted | **one migration, ~zero app code** — and it is a **schema-drift repair**, not four missing policies | **no** |
| **3 · The song request** | The band's inbox has shipped for a month and **has never once rung** — nobody can ask | one server action + one hub card · **no migration** | **not blocking** (one optional question) |

🔑 **ONE SHAPE, THREE TIMES: the product says yes and the database says no, and nothing anywhere
says so.** All three are the *rejected-not-thrown* family this corpus already documents — a
phantom column, a phantom enum value, a phantom RPC argument, an RLS denial, a missing grant.
**The only symptom is an absence.**

---

## 0 · THREE CORRECTIONS TO THE BRIEF THIS PLAN WAS WRITTEN FROM

The planning pass was told three measured claims and **corrected all three**. Two were right in
conclusion and wrong in a detail; **one is materially larger than briefed.** Every correction below
was then **re-verified by hand against prod and `origin/main`** before this file was written.

### ⚠ Correction 1 (small) — `accepted_at` does NOT have zero readers

`app/vendor-dashboard/calendar/surface.tsx:288-293` reads `.not('accepted_at','is',null)` to draw
the *"picked N/cap"* count, and `pickWaitlistCouple` reads it for its own cap check.
**What is true, and is what matters:** it has **no couple-facing reader and no gate reader.** The
couple CTA (`app/v/[slug]/page.tsx` ~1580-1640) and the join action
(`app/v/[slug]/waitlist-actions.ts`) gate on `waitlist_enabled` + `status` and **nothing else**.
🔑 *A survey that finds "zero readers" and stops has not asked whether the readers it found are the
ones that decide anything.*

### 🚨 Correction 2 (LARGE, and it is the whole reason piece 2 is dead) — a schema drift, not a policy gap

**Read out of prod by the column, not from the migration:**

- `manpower_gigs.vendor_profile_id` is **`NOT NULL` in production.**
- The repo's own `CREATE TABLE` (`supabase/migrations/20260704020000`, line 53) declares it
  **nullable**.
- The app's entire model is *"an open gig is one with `vendor_profile_id IS NULL`"* —
  `postManpowerGig` omits the column, `acceptManpowerGig` matches `.is('vendor_profile_id', null)`,
  and **both** vendor SELECT policies key on it.

⇒ **Even with a perfect INSERT policy, posting a gig dies on a NOT-NULL violation.**

🔑 **WHERE IT CAME FROM, AND IT IS A RULE: `CREATE TABLE IF NOT EXISTS` NO-OP'd against a
pre-existing prod table of a different shape.** The same drift is already *documented* for a second
column of this same table — `20271011120000_reconcile_columns_the_code_already_uses.sql` had to
`ADD COLUMN IF NOT EXISTS posted_by_user_id`, because prod did not have it at all. **Both
migrations are applied**, and prod still disagrees with the repo on **two** columns of one table.
🔴 **CONSEQUENCE FOR TESTING, and it is the important half:** the PGlite replay builds from the
**repo file**, so it has the *nullable* column. **A db test for the manpower door would pass in the
replay and prove nothing about production.** This is a new instance of *the test db is more
permissive than prod* — and here it is not permissiveness, it is a **different table**.

Also drifted: `handshake_tokens_consumed` defaults to **2** in prod, while the actions file
promises the gig records **0** (free-to-accept, owner 2026-07-22).

### ⚠ Correction 3 (small) — the post refusal is NOT silent

RLS denial on **INSERT throws** (unlike UPDATE and SELECT, which return empty). `postManpowerGig`
redirects with `?error=<insertError.message>` and the host page renders it
(`app/dashboard/[eventId]/manpower/page.tsx:188-193`) — **the host sees a raw Postgres sentence in
a banner.** The *see* and *accept* refusals are silent exactly as briefed.

⚠ And that file's own comment (`actions.ts:339`) states *"the policy model is
INSERT-allowed-for-authenticated"*. **Prod has no INSERT policy at all.** *A comment is a claim with
an expiry date; read the ACL out of prod.*

---

## 1 · WHAT WAS MEASURED — prod, 2026-08-27

| | |
|---|---|
| `vendor_date_waitlist` | **0 rows** · `accepted_at` set on **0** · shops with the waitlist switched on: **0 of 2** |
| `manpower_gigs` | **0 rows** · policies: **4**, of which **3 are SELECT and 1 is `is_admin()` ALL** ⇒ **no non-admin write policy exists** |
| `event_song_requests` | **3 rows — all three share `created_at` to the microsecond** (2026-07-30 07:52:09.45592+00) ⇒ **one seed INSERT. Nobody has ever asked for a song.** |
| Scale | 5 events · 2 vendor profiles · 45 event-vendor rows |

⇒ **Every one of the three is latent. Nobody is harmed today, and all three are safe by
arithmetic** — which is exactly the window in which they should be fixed.

🔑 **`authenticated` already holds full table-level INSERT/UPDATE/DELETE grants on
`manpower_gigs`.** The door is **policy-and-constraint only**; **no GRANT is needed.** The grants
check paid off in the opposite direction from the one expected.

---

## 2 · PIECE 1 — THE WAITLIST PICK

### What a person experiences today
A supplier presses **Pick for waitlist (0/1)** and is told *"Couple picked for the waitlist."*
**Nothing happened.** The count stays 0/1. And the couple — who joined that waitlist because they
wanted this shop on their date — is **never told anything, ever.**

### Why it does nothing
Prod has exactly three policies on `vendor_date_waitlist`: couple INSERT, a shared SELECT, and
`couple_update` (`user_id = auth.uid() OR is_admin()`). **There is no vendor UPDATE policy.**
`pickWaitlistCouple` runs on the vendor's **own session** (`requireVendor()` →
`createClient()`), so the UPDATE matches **zero rows**. Supabase returns `{error: null}` for a
zero-row update, and the action branches **only on `error`** — so it reports success.

🔑 **AND ITS OWN DOCBLOCK IS FALSE.** It claims *"Once the cap is reached the date's waitlist is
full (the couple-side CTA + join action both stop)."* **Neither stops.**

🔑 **THE FIXED TWIN IS ALREADY IN THE SAME MODULE.** `lib/vendor-waitlist.ts` says in writing that
*"vendors have no UPDATE policy on this table"*, which is why the **notify** path deliberately uses
the service-role admin client. **The pick path never got the same treatment.**
*A clone inherits the bug its twin fixed — fifth instance.*

### RULE 0 — exists · missing · delta
- **Exists:** the whole surface (settings, cap picker, queue, Pick button, notices at
  `calendar/surface.tsx:82-90, 540-590`), the cap read, the next-in-line read, the tier clamp
  trigger, the vendor SELECT policy, the service-role twin, **and `sendWaitlistSlotOpenedEmail` +
  `fetchCoupleContact`** in `lib/vendor-email-triggers.ts`.
- **Missing:** a write that lands · a zero-row check · any word to the picked couple · any
  couple-side meaning for *picked* · a true docblock.
- **Delta:** move the flip to the admin client with a RETURNING check, send one email, render one
  couple-side state, **delete one lie.**

### The build
1. `lib/vendor-waitlist.ts` gains `pickWaitlistCoupleForDate(vendorProfileId, requestedDate)`
   beside `notifyWaitlistForDate`, on `createAdminClient()`. The UPDATE carries
   `.select('waitlist_id, user_id')` and **branches on returned row count, never on `error`** —
   *a zero-row flip is a failure, never a success.* Every scope RLS used to enforce
   (`vendor_profile_id`, `accepted_at IS NULL`, `status IN ('pending','notified')`) is written out
   by hand, with the comment saying why. **The cap check moves in here too**, so the cap and the
   flip cannot disagree across callers.
2. `pickWaitlistCouple` keeps `requireVendor()` — the authorization is still the vendor's own
   session — then calls the lib function. **`waitlist_picked` is shown only after a returned row.**
3. New `sendWaitlistPickedEmail(...)`, modelled line-for-line on `sendWaitlistSlotOpenedEmail`
   (:556). **Copy is soft — a pick is not a booking and the email must not claim one.**
   Best-effort, logged, never thrown.
4. Couple-side reader: add `accepted_at` to the `existing` query in `app/v/[slug]/page.tsx` (~1625)
   and render a **third CTA state** — *"[shop] set your date aside — send them a message"*.
   **This is the handle the stored value never had.**
5. **Delete the false sentence** in the docblock and say what is true: the cap limits *picks*;
   joining stays open.

### Failure direction
The email is best-effort and never blocks the flip. The **flip** fails **closed** — no returned
row means no success notice.

### What un-does it
`unpickWaitlistCouple` — admin client, clears the newest `accepted_at` for the (vendor, date), same
RETURNING check, notice `waitlist_unpicked`, surfaced as **Undo** beside the picked count when > 0.
🔑 **The soft email copy is what makes the inverse honest** — nothing was promised that an unpick
would have to retract.

### Guards, each with its sabotage and the count that must move
| Guard | Sabotage | Count |
|---|---|---|
| Source-scan beside the lib (`lib/**`, so `test:unit`'s glob can see it): the pick flip runs on the admin client, carries `.select(`, and its success branch requires returned rows | delete the `.select(` | `.select(` chained on the pick UPDATE **0 → 1** |
| A couple-side reader exists | — | `grep -c accepted_at 'app/v/[slug]/page.tsx'` **0 → ≥1**; non-test readers outside the calendar module **0 → ≥1** |
| Post-ship, prod, exercised on the two test shops | — | rows with `accepted_at NOT NULL` **0 → 1**, notice observed only on that run |

🪤 **THE GUARD TO SUSPECT: any assertion that the `waitlist_picked` notice string exists in
`surface.tsx`.** It existed all along **while the feature did nothing.** Named here so nobody counts
it as coverage.

### The tempting wrong turn
**Adding a vendor UPDATE policy on `vendor_date_waitlist`.** It looks like the proper fix. The
module's own docblock records the deliberate decision that vendors get **no** UPDATE policy and that
vendor-driven writes on couples' rows go through service-role. **The notify path is the fixed twin;
the pick path should get the same treatment, not a new door every future vendor-session path can
walk through.**
Second wrong turn: **building** the docblock's false cap-gate on the join instead of **deleting the
sentence** — a gate nobody needs, guarding a queue whose whole point is waiting.

### Owner: **NO**
The semantics are his own rulings (waitlist 2026-07, tier caps 2026-08-09); the email goes to a
couple who put themselves on the list, through the channel the notify email already uses.
Reversible, pre-launch, **zero rows**. Decide and act.

---

## 3 · PIECE 2 — THE PAID CREW SHIFT

### What a person experiences today
A host presses **Post gig** and gets an error banner quoting a **raw database sentence**. A
supplier's gig board on every event they work says no hosts have posted anything — **silently,
forever.** Nobody can accept, so real day-of labour (default ₱15,000) **has no door at all.**

### RULE 0 — exists · missing · delta
- **Exists: everything above the database.** Both surfaces
  (`app/dashboard/[eventId]/manpower/page.tsx` with its post drawer,
  `app/vendor-dashboard/manpower/surface.tsx` with open/accepted/wrapped lanes), all four actions
  (`post` / `accept` / `complete` / `cancel`) **including a race-safe atomic claim**, the table, its
  CHECKs and FKs, **full table-level grants for `authenticated`**, three SELECT policies + admin ALL.
- **Missing:** every non-admin write policy · a SELECT policy that can see an **open** gig (both
  vendor SELECTs key on `vendor_profile_id`, which is NULL on an open gig) · **nullability of
  `vendor_profile_id` in prod** · a truthful `handshake_tokens_consumed` default.
- **Delta: ONE MIGRATION. Zero app-code changes for the core flow** — *the actions were written
  correctly against a database that never matched them.*

### The build — one migration, prefix allocated forward with `pnpm migration:new`
1. `ALTER COLUMN vendor_profile_id DROP NOT NULL` — a **no-op in the PGlite replay** (the repo's
   CREATE TABLE already has it nullable), **real in prod.** Safe: 0 rows.
2. `ALTER COLUMN handshake_tokens_consumed SET DEFAULT 0` — make the schema say what free-to-accept
   promises.
3. **Five policies for `authenticated`** (grants already stand; policy is the only missing layer),
   all using the team-aware `current_vendor_profile_ids()` that `manpower_gigs_team_admin` already
   uses:
   - `manpower_gigs_host_insert` — INSERT WITH CHECK `posted_by_user_id = auth.uid() AND
     vendor_profile_id IS NULL AND status = 'pending' AND` host-membership of the event.
   - `manpower_gigs_vendor_reads_open` — SELECT USING `status='pending' AND vendor_profile_id IS
     NULL AND` the vendor is linked to that event. **This is what stops the accept action lying
     `not_found`.**
   - `manpower_gigs_vendor_accept` — UPDATE USING the open-gig predicate; WITH CHECK
     `status='accepted' AND vendor_profile_id IN (current_vendor_profile_ids())`.
   - `manpower_gigs_vendor_own_write` — UPDATE on the vendor's own rows (complete, vendor-cancel).
   - `manpower_gigs_host_cancel` — UPDATE USING host-membership; WITH CHECK `status='cancelled'`.
   ⚠ **Write the residual down in the migration, so it is a decision and not a surprise:** policies
   are **OR-ed**, so an event-linked vendor passing `vendor_accept`'s USING can write a row
   satisfying `vendor_own_write`'s WITH CHECK — claim-and-complete in one write. Harmless (the same
   vendor can do it in two legal steps), but **named**.
4. 🔬 **BEFORE APPLYING: dry-run against prod inside `BEGIN … ROLLBACK`.** The PGlite replay runs as
   **superuser**, so RLS refusals do not reproduce there — **and here the replay's table is a
   different shape entirely** (Correction 2). Inside the transaction: run the migration text,
   `SET LOCAL ROLE authenticated` with real test-host and test-vendor claims, and assert the host
   INSERT returns a row · a non-member INSERT raises · the vendor SELECT sees the open gig · the
   vendor UPDATE flips exactly one row. **ROLLBACK. Then apply. Then re-read `pg_policies`.**

### What un-does it
**The product inverse already ships** — `cancelGig` (host or vendor, pending/accepted only, reason
required): post ↔ cancel, accept ↔ cancel. The **schema** inverse is five `DROP POLICY` lines plus
`SET NOT NULL` (valid only while no NULL rows exist) — **record them in the migration's comment.**

### Guards
| Guard | Sabotage | Count |
|---|---|---|
| `tests/db/manpower-gigs-door.db.test.ts` — behavioural where the harness permits role-switching (mirror `song-requests.db.test.ts`), else `has_table_privilege` + `pg_policies` predicates | in a savepoint, `DROP POLICY manpower_gigs_vendor_accept` and assert the accept UPDATE flips 0 rows | policies **4 → 9**; non-admin **write** policies **0 → 4** |
| Source assertion (glob-visible) that `postManpowerGig` still **omits** `vendor_profile_id` | supply a vendor id in the insert | — |
| Post-ship, prod, exercised | — | rows **0 → ≥1** with `handshake_tokens_consumed = 0` (**proves the default moved from 2**), one row walked pending → accepted → completed |

🪤 **THE GUARDS TO SUSPECT: anything asserting `relrowsecurity`, or that a policy *name* exists.**
`relrowsecurity` is **vacuous in the replay** (15 db tests assert it and none can fail), and a name
is not a predicate. 🔑 **THE LOAD-BEARING GUARD HERE IS THE PROD `BEGIN…ROLLBACK` DRY-RUN AND ITS
RECORDED OUTPUT — put the transcript in the PR body.** Given Correction 2, a green db test on this
table is close to meaningless.

### The tempting wrong turn
**Porting all four actions to the admin client, like piece 1.** It looks like the same twin. **It is
not.** Here *both* sides — host reads, vendor open-gig reads, and the concurrent atomic claim —
lean on declarative row scoping; the admin route means hand-writing every scope in four actions
*and* rebuilding read scoping for two whole surfaces, versus **five policies against an empty
table.** Piece 1 gets the admin client because **that module had already decided** vendors get no
policy there; **manpower's surfaces were written assuming these policies exist.**
Second wrong turn: **adding GRANTs.** They already stand. *A granted table with no policy is exactly
how you get refused-and-silent.*

### Owner: **NO**
This implements the access model the shipped surfaces already document, under a BIR posture he has
ruled (Setnayan touches none of the ₱15k; the RR 16-2023 note is a column default). **Zero gigs, 5
events, 2 shops — safe by arithmetic.** Decide and act.

---

## 4 · PIECE 3 — THE SONG REQUEST

### What a person experiences today
**The band's request inbox shipped a month ago and has never once rung.** A guest who wants to hear
a song has nowhere to ask; the event hub has **no music door at all.**

🔑 **THE CORPUS LINE *"Song Desk is DONE (8 PRs, merged 2026-07-30)"* IS TRUE OF THE ANSWERING HALF
ONLY.** *An answer with nothing to answer.*

### RULE 0 — exists · missing · delta
- **Exists: the entire answering half** — the inbox (`requests-inbox.tsx`), decide + pause
  (`fetchActSongRequests` / `decideActSongRequest` / `setSongRequestsOpen`, all admin-client behind
  `requireSongDeskAct`), **both submit RPCs in prod** with rate caps, the guest-block lever, dedupe
  (`ON CONFLICT (event_id, song_id) DO NOTHING`), the open/pause gate (**absent config row =
  flowing**), `resolve_song_id`, and a full db-test suite. Guest identity exists
  (`readGuestSession`, signed cookie). **And the shelf exists:** `app/[slug]/hub/page.tsx` +
  `HubShell` with seven panel keys — *this is one more card, not a new page.*
- **Missing:** any caller of either submit RPC · any guest ask surface.
- **Delta:** one server-action module + one hub panel. **No migration** — the RPCs, their
  service-role-only EXECUTE (**by design**, and pinned by a test), and the policies are already
  exactly right.

### The build
1. **Pure rules in `lib/song-request-door.ts`** — *not* under `app/[slug]/…`. Maps the RPC's
   `songreq:*` codes to guest sentences (paused · you've asked a lot this hour · a quiet refusal),
   **plus the branch that belongs to the rejected-not-thrown family: the RPC returns an empty SETOF
   on a duplicate song with NO error, so zero returned rows must render "that song is already on
   tonight's list" and never "request sent."**
   🔑 Splitting into `lib/` follows the `answers-desk.ts` split, keeps it out of `server-only`'s
   reach, **inside the `test:unit` glob**, and away from the bracketed-path trap where `--test` runs
   zero tests and exits 0.
2. **Server action** `app/[slug]/_actions/song-request-actions.ts`: resolve slug → event ·
   `readGuestSession()` and assert the guest belongs to **this** event (reuse
   `_lib/belongs-to-this-event.ts`) · validate the title · call
   `createAdminClient().rpc('guest_submit_song_request', …)` · run the result through the pure
   module. **The RPC re-checks everything server-side, so the action adds identity and words, not
   trust.**
3. **Hub panel:** add `'music'` to `HubPanelKey` + `MENU`; build it **only for a viewer holding a
   guest session** (anonymous → the panel is absent, matching the `'me'` panel — **no fake door**).
   Shows the ask form, the paused state, and the guest's own previous requests with status
   (admin-read scoped by the session's `guest_id`, because **RLS deliberately gives guests no
   SELECT** — same way their live gallery is served).

### What un-does it — and it is NOT built
**A guest cannot withdraw a request.** *A forward primitive with no inverse* — building one means a
new RPC. **Accepted and stated, not papered over:** the act's *decline* is the working inverse,
dedupe means a regretted ask is one row and not many, and the hourly cap bounds it.

### Guards
| Guard | Sabotage | Count |
|---|---|---|
| Unit tests beside `lib/song-request-door.ts`: every `songreq:*` code maps to a sentence, **and zero-rows maps to the duplicate sentence, never to success** | flip the zero-row branch to success | — |
| Source | — | non-test occurrences of `guest_submit_song_request` under `app` + `lib` **0 → ≥1**; `HubPanelKey` **7 → 8** |
| Post-ship, prod | — | `event_song_requests` rows whose `created_at` ≠ the seed microsecond **0 → ≥1**, `origin='guest'`, **walked through to the inbox on a preview deploy with a real phone** |

🪤 **THE GUARD TO SUSPECT: the `HubPanelKey` count.** It proves a **pill is drawn**, not that the
door opens. 🔑 **Per § 8: membership-of-a-set assertions prove nothing — the row must be SEEN
ARRIVING in the inbox.**

### The tempting wrong turn
**`GRANT EXECUTE` on the RPCs to `anon`/`authenticated` and calling them from the browser.** Looks
strictly smaller. **The revocation is load-bearing and tested** — `song-requests.db.test.ts` asserts
both RPCs are uncallable by both roles **by name**, and `anon-rpc-surface.baseline.txt` would move.
Second wrong turn: **"enabling" the open/bar lane** by having the server look up the event's
`master_qr_token` and mint an anon key — **that dissolves the token's proof-of-presence into a
rubber stamp.** The poster QR carries **no token** today (`lib/qr.ts:99-106`), so the open lane needs
a **QR-artifact decision**, not a wire.

### Recommendation on the desk
🔑 **`song_request` should STAY in `ANSWERS_THAT_DO_NOT_JOIN`, with its `why` REWRITTEN** to:
*"belongs in the room at the event — the act answers it in the live console, not on a
cross-celebration list."* The desk sorts by **who has waited longest across weddings**; a
tonight-only ask fits it badly, and § 9's floor items were left off for exactly this reason.
The alternative — joining only during the live window as *a sentence and a way in*, never with
decide buttons — is legitimate under § 9's clock table. **The rewritten reason is the smaller true
thing.**

---

## 5 · SEQUENCING — and the one hard ordering rule

✅ **THIS GATE IS NOW OPEN — #4923 MERGED 2026-08-27T15:36:36Z, 
after this plan was commissioned. The desk-join steps are UNBLOCKED.**

~~Every removal from `ANSWERS_THAT_DO_NOT_JOIN` must be sequenced after PR #4923 merges.~~

**What still stands, and is the part that matters:** `lib/answers-desk.test.ts:242` asserts
`ANSWERS_THAT_DO_NOT_JOIN.length >= 4` (*"the withheld list shrank"*). **#4923 removed one entry, so
re-read that floor before touching the list — do not assume it is still 4.** Any session removing an
entry must lower the floor in the same commit, and **two sessions doing it concurrently is a
guaranteed conflict**, so claim it out loud.

🔑 **THE LESSON THIS FILE ALMOST SHIPPED: a blocking rule written against an open PR is stale the
moment it merges.** Had this not been re-checked, the executing session would have waited on a gate
that had already opened — the exact failure this corpus records five times over.

Everything else is severable. **Recommended order: piece 2 (one migration, no app code) → piece 1
→ piece 3.** The desk-join steps are phase 2 and each is independently droppable.

---

## 6 · WHAT IS DELIBERATELY NOT BEING DONE

- **`payment_claim` / PR #4923** — **already merged and shipped**, not deferred.
- 🔴 **The notify-everyone email's own danger, REAL and re-verified, flagged for its own session:**
  the manual button (`notifyWaitlistSlot`, `calendar/actions.ts:283-291`) calls
  `notifyWaitlistForDate` **directly**, skipping the genuinely-open check that
  `notifyWaitlistForFreedDate` performs for the automatic paths — and § 9 notes one screen still
  offers that email **for past dates.** A one-line reroute fixes the first. **Out of scope: the
  withheld reason for this slug was the PICK, and the pick-only fix is severable.**
- **The cap-gates-the-join feature** the pick docblock falsely claims — **deleting the lie instead
  of building it.**
- **A guest "withdraw my song request"** — the inverse gap, recorded rather than hidden.
- **The open/bar song lane** — no honest client path without a QR-artifact decision.
- **Prettying the raw Postgres sentence the host sees** — near-unreachable once posting works.
- 🔴 **A FULL PROD-vs-REPO SCHEMA DRIFT AUDIT.** `20271011120000` proves `CREATE TABLE IF NOT
  EXISTS` has no-op'd against a pre-existing prod table before, and **this plan found a second
  instance in the same table.** Only the three tables in scope were diffed. **A one-time
  full-catalog diff deserves its own session** — and note what it would mean: *for any such table,
  the PGlite replay is testing a different schema than production runs.*
- **Clone sweeps to run DURING execution, not now:** (a) the **zero-row-update-reports-success**
  shape — grep vendor-session `.update(` calls that branch only on `error` with **no** `.select(`;
  the pick is the seventh gate-with-no-handle and **its shape will have siblings**; (b) after the
  manpower migration, sweep for other tables where **app code writes** but `pg_policies` shows
  **admin-only write policies**.

---

## 7 · WHAT NEEDS THE OWNER

**Nothing blocks any of the three.** All three are pre-launch, reversible, and empty in prod.

**One optional question, piece 3, does not gate the ship:**

> **At the party, should somebody who never opened their invitation still be able to ask the band
> for a song by scanning the poster at the door — with just a name they type in?**

A **yes** later means redesigning what the poster QR carries. **Nothing in v1 forecloses it** —
v1 is restricted to invited guests with a claimed session because **the artifact forces it** (the
poster QR carries no token today), not because it was chosen.

⛔ **DO NOT RE-ASK the five § 7 questions answered 2026-08-27**, and do not re-ask *"does the room
close at midnight?"* — retired before it reached him.

---

## 8 · HOW MUCH TO TRUST THIS PLAN

**Measured in prod, by the object:** all policies on all three tables · per-column and table grants
on `manpower_gigs` · full bodies and ACLs of all three song RPCs (`proacl` = postgres +
service_role only) · **column nullability and defaults via `information_schema` — this is the
NOT-NULL finding, and it was re-verified by hand after the planning pass reported it** · all
constraints · row counts · the three song rows' shared seed timestamp and origins · both relevant
migrations confirmed **applied**.

**Measured on the `origin/main` worktree** (`/tmp/wt-read-papic3`, never `~`): every code path
cited, with line numbers.

**Re-verified after the planning pass:** PR #4923's state (it changed from OPEN to MERGED mid-write).

**Taken on trust, not re-measured:** the tooling traps (bracketed-path `--test`, `tsc` false greens,
PGlite superuser and `relrowsecurity` vacuousness) — **planned around rather than re-measured.**

**Inferred, NOT measured — the executing session should verify before leaning on it:**
supabase-js returning `{error: null}` on a zero-row UPDATE (consistent with the code's own
conventions and with the notify path's defensive `.select`), and Postgres permissive-policy OR
semantics (documented behaviour, used in the manpower residual note).

🔑 **THE SINGLE HIGHEST-VALUE LINE IN THIS FILE: piece 2 is larger than it looks. Budget the
manpower migration as a SCHEMA-DRIFT REPAIR, not as four missing policies — and do not trust a
green db test on that table.**
