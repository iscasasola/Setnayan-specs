# WHAT'S NEXT — PAPIC: THE METER, THE LADDER, AND WHAT UPLOADS LEFT OPEN
### Written 2026-08-26 at the owner's instruction: *"save all unfinished to what's next now."*

> ⚠ **A HANDOFF IS NOT EVIDENCE.** Every PR state, price and count below was measured when it was
> written. **Verify before acting** — `gh pr view <n> --json state,mergedAt`, and query prod for
> anything about the catalog. This project's registers have been wrong about a PR's state **six**
> times.

---

## § 0 · ⏳ IN FLIGHT WHEN THIS WAS WRITTEN — CHECK THESE FIRST

| what | branch / PR | state at time of writing |
|---|---|---|
| The meter fix + the capturer trigger | [#4879](https://github.com/iscasasola/setnayan-platform/pull/4879) | ✅ **MERGED, SHIPPED AND VERIFIED IN PRODUCTION BY THE OBJECT** — see below. Nothing left to do. |
| The 16-rung ladder | [#4884](https://github.com/iscasasola/setnayan-platform/pull/4884) | ✅ **OPEN, auto-merge ARMED.** tsc 0 · unit 10,193/0 · db 1,591/0 · 18 lints · prod dry-run clean. **A merge is not a ship** — when it lands, verify the 16 rungs by querying the catalog (§ 6), not by reading this. |
| **Atomicity (§ 1) + the server-side uploads switch (§ 2.1) + the guest capturer column (§ 2.2)** | branch `claude/papic-seat-capture-atomicity` — **NOT PUSHED** | ⏳ **BUILT, TESTED, UNMERGED.** 3 commits, 17 files, migrations `20271170528490` + `20271171474426`. tsc 0/0 · unit 10,242/0 · db 1,618/0 · 12/12 mutations RED · prod dry-run clean in `BEGIN…ROLLBACK` and verified rolled back. ⛔ **NOTHING IS APPLIED TO PRODUCTION** — the push needed a permission the session did not have. Until it merges, § 1 and § 2.1 describe code that exists only on that branch. |

### ✅ #4879 IS VERIFIED IN PRODUCTION — measured on the live objects, not inferred from the merge

`/api/health` reported `7f6abfb`, the merge commit itself, so the deploy is the one carrying it.
Then the database was asked directly:

| | measured |
|---|---|
| columns a browser role can INSERT into `papic_photos` | **0** (was 39) |
| columns `authenticated` may still UPDATE | **39** — the camera can still finish a clip |
| policies admitting INSERT | **0** |
| policies present | the 7 narrow ones, no `FOR ALL` |
| `stamp_capturer_person` trigger | **1** |
| photos · credited | **14 · 14** |
| `anon` may EXECUTE the trigger function | **false** |

So the meter is now the only door, and the column that had **never held a value in production** holds
one on every row that exists.

⛔ **This does NOT make the credit invariant atomic** — see § 1, which is now BUILT on an unmerged
branch. Until that branch lands, reserve and insert are still two steps in production.

🪤 **A NEAR-MISS WORTH THE LINE: the first push of that branch was a commit missing six staged
files, and it would have failed CI.** `git status --porcelain` printed them with a leading `M `/`A `
— **staged** — and I read that as a clean tree and said so out loud. Staged-but-uncommitted is work
that exists on disk and nowhere else. What was left behind was the half that makes the branch pass.
**Before pushing, run `git show --stat HEAD` and check the commit contains what you wrote** — "no
deletions" and "no stray edits" are different questions and neither answers this one.

✅ **Already merged today — do NOT rebuild:** the couple's file picker and the switch for who may
add photos by hand ([#4875](https://github.com/iscasasola/setnayan-platform/pull/4875), carrying
[#4877](https://github.com/iscasasola/setnayan-platform/pull/4877) and
[#4878](https://github.com/iscasasola/setnayan-platform/pull/4878)).

---

## § 1 · ~~🔴 THE ONE THING THAT IS A REAL BUILD — ATOMICITY~~ ✅ BUILT 2026-08-26

⏳ **BUILT AND TESTED, NOT YET MERGED.** Branch `claude/papic-seat-capture-atomicity`, migration
`20271170528490`. **Verify before trusting this line** — `gh pr view` for its state, and query the
live object, not this file.

**`papic_record_seat_capture`** is `SECURITY DEFINER` and does the authorization, the split reserve
and the `papic_photos` insert in ONE transaction. `recordSeatCapture` makes one call, and the
application unwind on that path is **deleted, not kept as a belt** — there is no longer a state
between the spend and the row for anything to clean up. It follows `papic_record_guest_capture`'s
shape without reusing it (different table).

⚖ **THE "EIGHT GATES" PARAGRAPH BELOW WAS THE RIGHT WORRY AND THE WRONG CONCLUSION.** Three moved
in — seat authorization, the split reserve, the row. **Five stayed out and each one refuses BEFORE a
credit is touched**, which is the only property that mattered: the Upstash burst limiter (cannot
move, and fails open by design), the clip-length cap (decided before anything is presigned), the
capture window, the paid-order gate and the put-away gate. The geo control passes its DECISION in as
columns, so `buildPapicGeoFields` stays the one place that rule is written. **"Every check in SQL"
would have been a rewrite that bought nothing.**

⛔ **EXECUTE IS `service_role` ONLY, and that is load-bearing** — a browser role holding it would let
a claimer name their own id and walk past all five gates above, which is the hole `20271169487222`
closed, one door over. Revoked from **PUBLIC** (naming the two roles alone leaves the PUBLIC grant
and every future role arrives holding it), and the migration refuses to apply if the door did not
close.

🪤 **`current_user` INSIDE A `SECURITY DEFINER` FUNCTION IS ITS OWNER — third time this project has
had to say it.** `auth.uid()` is empty too, because the caller is the service role. Identity arrives
as `p_claimer_user_id`, resolved outside under the caller's own session, exactly as
`papic_record_guest_capture` receives `p_guest_id`. A db rule asserts neither symbol appears in the
body.

🛡 **PROVEN, NOT ASSERTED.** A db rule adds a CHECK constraint, forces a real insert failure through
the real function, and reads BOTH meters back unmoved. That is not ceremony: an `EXCEPTION` block
added around the insert is an implicit subtransaction and would commit the reserve while discarding
the row, and every structural rule would still pass. It was mutation-tested and goes red.

⚠ **STILL NOT PROMISED:** the bytes are in R2 before the function runs and R2 is not in the
transaction, so a refusal leaves an orphaned object. Orphaned bytes cost storage; a leaked credit
costs a couple a photograph.

---

## § 2 · 🔴 WHAT THE UPLOAD WORK LEFT OPEN

### 2.1 · ~~The switch must be read on the SERVER when anybody else can upload~~ ✅ BUILT 2026-08-26

**It is read on the server NOW — the condition was not waited for.** Same branch as § 1. A server
action is a public endpoint, so a hidden button was already one `fetch` from not being hidden;
waiting for a guest or supplier upload path meant betting that nothing else would reach the write
first.

🔑 **IT KEYS ON THE SEAT, NOT ON WHICH SCREEN CALLED.** `lib/papic-uploads-open.ts` asks whether the
capture is on the **Uploads camera** (`seat_index`) — a fact about a row in the database rather than
a claim the client makes — so it already covers a surface nobody has written yet. Asked on BOTH
server paths: the presign (`/api/upload`, orphan-byte leak guard) and the write
(`recordSeatCapture`, the door, **above the credit spend** so a refusal never charges anybody).

⛔ **EVERY OTHER SEAT PASSES THROUGH UNTOUCHED.** The switch must never stop a paparazzo
photographing a wedding — which is what the OFF copy promises: *"Only what your cameras capture."*
⚠ **Fails OPEN** on an absent, null or refused read, matching the column's `DEFAULT TRUE`: failing
closed on a pre-migration database takes uploading from every couple with no explanation.

🛡 **THE BASELINE LINE IS DELETED, AND THAT WAS NOT A CHOICE.** `handles-have-gates.db.test.ts`
failed the moment the server started reading the column and demanded it. ⚠ **A first attempt
REWROTE that line to describe the new arrangement and was refused too, correctly** — that file is a
list of screen-local switches, not a place to explain one that stopped being screen-local.

⏭ **WHAT RULE 8 STILL DEFENDS IS THE COPY, NOT THE GATE.** A path recording on a DIFFERENT seat is
outside the gate by design, and at that moment *"Nothing can be added from a phone or laptop"*
becomes a promise the product does not keep. The tripwire still fires on a fourth recorder.

### 2.2 · ~~"Each person's own folder" is solved for seat captures ONLY~~ ✅ BUILT 2026-08-26

~~`papic_photos.captured_by_person_id` now has a writer. **`papic_guest_captures` has no
capturer-person column at all.**~~ **`papic_guest_captures.captured_by_person_id` now exists, with
a trigger deriving it** (migration `20271171474426`). Both halves of Papic answer *which person
took this frame*.

🔑 **AND THE SENTENCE BELOW WAS WRONG — the resolution it says does not exist has shipped since
May.** This said the build *"needs a guest-to-person resolution that does not exist yet."*
Measured against the live database rather than read: **`guests.person_id` exists**, and the
`set_guest_person` BEFORE INSERT OR UPDATE OF email trigger has resolved it from the guest's email
address since `20270514555975`. Nothing new had to be invented — one hop, not a new mechanism.
*RULE 0 paid again, in the register whose job is to stop exactly this.*

⚠ **AND IT IS EMPTY IN PRODUCTION, WHICH IS NOT THE SAME THING.** All 40 guest rows carry
`person_id IS NULL` (none was added with an email matching a `people` row), and prod holds **0**
`papic_guest_captures`. So the column is NULL everywhere today — the resolver having nothing to
resolve, **not a gate with no handle**. The writer runs on every insert and fills in the moment a
guest is added by an address the person spine already knows. ⚠ The migration's backfill matched
nothing on the way in; **a backfill is a point-in-time act and must never be cited as coverage.**

⚠ **The Uploads camera is claimed by ONE host**, so a co-host adding photos through it is credited
to the claimer. The column means *"whose camera shot this frame"*. Per-uploader credit is a
**different fact** and still needs its own column — that part of the note stands.

### 2.3 · The supplier lane — still the DPO's, not engineering's

Built, switched off, route 403s (`isVendorPapicCaptureEnabled`). Until it opens, **a photographer
can only hand over a LINK**, never files into the couple's library. That is the one genuinely new
build the uploads work did not touch, and it is gated on a privacy decision.

### 2.4 · Suppliers buying shots for their own event — ruled, unbuilt

Owner 2026-08-26: *"yes they can buy shots for their event. and it will be collected in an album
they have."* **This reverses his own 2026-07-18 decision** and is recorded, not assumed.
⏭ **It needs a price before it needs code.** Does a supplier buy off the same 16-rung ladder, or
its own? That is his call, not an engineering one.

### 2.5 · The couple's website gallery is still its own pile

`events.our_photos` is a JSONB list of refs the invitation website renders and the save-the-date
film reads. Under the purpose lock (*"papic is the source where they collect media files for that
event"*) it should **pick from** Papic rather than be a second upload lane. ⚠ That is a redesign of
two shipped screens and a product decision, **not** an obvious extension — do not start it on the
strength of the lock alone.

---

## § 3 · ⚖ PRICING — WHAT IS SETTLED AND WHAT IS NOT

**SETTLED 2026-08-26 (do not re-ask):** the ladder is a **scrollable list of 16 rungs** priced
against **₱1 = 1 credit**, discounted 50% → 80%. The regular price is the credit count itself and
**must never become a column**. 50 free per event; cameras free and unlimited.

`100 ₱50 · 200 ₱100 · 300 ₱150 · 400 ₱200 · 500 ₱250 · 1,000 ₱500 · 2,000 ₱1,000 · 3,000 ₱1,200 ·
4,000 ₱1,600 · 5,000 ₱2,000 · 6,000 ₱2,400 · 7,000 ₱2,800 · 10,000 ₱3,200 · 20,000 ₱5,000 ·
30,000 ₱7,500 · 50,000 ₱10,000`

⚖ **40,000 is deliberately ABSENT.** His first table had it at ₱10,000 — the same price as 50,000 —
so nobody could rationally choose it. Surfaced rather than silently corrected; he removed it.
**Do not re-add it without a price of its own**, and a db guard now fails if anybody does.

⚠ **NEVER re-type these numbers.** `platform_retail_catalog_v2` is the price source,
`papic_pass_tiers` holds the shot counts, and `apps/web/tests/db/papic-ladder.expected.ts` is the
**one** pinned expectation both db guards compare against.

🚨 **A RUNG IS THREE PLACES:** the catalog row, the tier row, **and** a line in
`lib/sku-activation.ts`. That dispatcher ends `if (!hook) return; // default no-op`, so a rung on
sale and absent from the map is fully purchasable and **grants zero shots** — no throw, no log, an
empty pool and a paid order.

⏭ **OPEN, and his:** whether suppliers buy off this ladder (§ 2.4).

---

## § 4 · 🪤 TRAPS THIS SESSION PAID FOR — assume a seventh

### 4.1 · 🚨 NEVER POINT AN AUDIT AT A LIVE WORKING TREE YOU ARE ALSO EDITING

An adversarial workflow was given the worktree I was committing from. One of its agents commented
out the two `REVOKE` lines — **the entire security fix** — as `-- SABOTAGE …` to test a guard, in
the window between my pre-commit `git diff` and the `git add -A` two commands later. **It was
committed and pushed.** Two more stray edits were found in the same sweep, one inside an
**already-applied migration**, and one appended `AND ph.photo_type = 'clip'` to the shipped backfill
— which would have left every photograph in production uncredited forever — while the suite reported
**6 pass, 0 fail**.

🔑 **The rule is not "be careful."** Give subagents a detached read-only worktree
(`git worktree add --detach /tmp/wt-read origin/main`). **Diffing before `add` is not sufficient on
its own** — I did diff, and the window was enough.

### 4.2 · `has_table_privilege(…,'INSERT')` ANSWERS **FALSE** WHILE COLUMN GRANTS STAND

`papic_photos` reported no table-level INSERT for `authenticated` and held it on **all 39 grantable
columns**. A table-level audit reads a wide-open table as closed. It hid the hole — **and then the
guard written about the hole used the same function and reported the lock held with the revoke
deleted (1 → 0, still green).** Ask `has_column_privilege` over a **census of the columns that
exist**. Revoke at TABLE level; that is what drops the column grants.

### 4.3 · `SECURITY DEFINER` DISARMS A `current_user` CHECK — second time

`current_user` inside a `SECURITY DEFINER` function is the **owner**, never the caller. A gate
copied from the `SECURITY INVOKER` trigger next door could never be true; the forgery test moved the
photo and the trigger watched.

### 4.4 · A test that carries its own copy of the thing it checks cannot notice it going missing

The rule proving the backfill worked ran the statement **inline**, so deleting it from the migration
changed nothing the test could see. Lift the statement **out of the file** and execute it.

### 4.5 · A guard that names ONE spelling is not a guard

A rule flagged a session-client insert only when the opening line literally said `supabase`;
`const rowWriter = supabase;` walked past. Use an **allow-list** (the chain must be opened by
`writer`), never a deny-list of remembered names.

### 4.6 · Scaffolding can carry the assertion

A moderation guard's setup hand-picked eight columns, so a lane refused because **my list** omitted
one — not because the schema does. Delete the revoke the file exists to guard and every rule still
passed. **Derive the scaffolding from the schema.**

### 4.7 · Two copies of a rule drift — including inside the guards

The Papic ladder was pinned **independently** in two db test files. Repricing updated one and left
the other asserting prices that no longer existed. One `papic-ladder.expected.ts` now.

### 4.8 · A fixture can disagree with ITSELF

`llms-txt.test.ts` held **two rows for one service code**; the price book keeps the **last**, so a
rung silently resolved to a price no rung had — and the failure blamed the prose. A new rule asserts
each code appears once.

### 4.9 · Others, briefly

- **A new column on `events` is not done when it exists** — that table re-grants a per-column
  allowlist, so a column with no `GRANT SELECT (col)` makes PostgREST refuse the **whole query**,
  and `events_host` has an explicit projection that must be rebuilt. Only
  `lint-events-column-grants` catches it; the db coverage tests structurally cannot.
- **A stale docblock is worse than none.** `recordSeatCapture` still described the fence that had
  moved. Nothing but a reader could catch it: it typechecks, tests pass, no guard reads prose.
- **A backfill is a point-in-time act.** Never cite an old one as ongoing coverage.
- **An exported constant that states a rule and gates nothing** (`PAPIC_TOPUP_UNLOCK_POINTS`) is
  believed by the next reader. Deleted.
- **`replay?.close?.()` typechecked as an error and ran as a no-op**, so two suites passed while
  never releasing the database. Print the exit code beside the error count.
- **A crash is not a signal.** A mutation that is invalid SQL fails every rule at once and proves
  nothing about the one you aimed at.

---

## § 5 · 🔴 STILL NAMED, NOT FIXED (inherited, unchanged by this session)

- **`relrowsecurity` is VACUOUS in the PGlite replay** — a brand-new table with no policy reports
  row security ON. **15 db test files assert that flag and none of them can fail.** Pinned with a
  live probe; named, not fixed.
- The **Event Hub as a supplier's room** — plan only, owner said do not build.
  See [`WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md`](WHATS_NEXT_Vendor_Hub_And_Answers_2026-08-26.md);
  its § 3.9 is the list that matters. **The Answers Desk is independent and can start now.**

---

## § 6 · HOW TO VERIFY ANY OF THIS

```bash
gh pr view 4879 -R iscasasola/setnayan-platform --json state,mergedAt
```

For the catalog, query prod — never a document:

```sql
SELECT t.points, c.retail_price_php
  FROM public.papic_pass_tiers t
  JOIN public.platform_retail_catalog_v2 c USING (service_code)
 WHERE t.is_active AND c.is_active ORDER BY t.points;
```

For the meter, ask the schema, per COLUMN:

```sql
SELECT count(*) FROM information_schema.columns c
 WHERE c.table_schema='public' AND c.table_name='papic_photos'
   AND has_column_privilege('authenticated','public.papic_photos',c.column_name,'INSERT');
```

**Zero is the answer once #4879 is in.** Anything else means the door reopened.
