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
| The meter fix + the capturer trigger | [#4879](https://github.com/iscasasola/setnayan-platform/pull/4879) `claude/who-took-this-photo` | ✅ **MERGED 2026-08-26** — merge commit `7f6abfb59`. ⏳ Deploy had NOT caught up when this line was written (prod served `2bb67d5`). **A merge is not a ship** — check `/api/health`, then verify the two migrations applied **BY THE OBJECT** (§ 6), never by `schema_migrations`. |
| The 16-rung ladder | `claude/the-papic-ladder-is-repriced` | **COMMITTED, NOT PUSHED.** Waiting on the full db + unit suites; `tsc` 0, 18 lints pass, prod dry-run clean |

### ⏭ THE FIRST THING TO DO: PROVE #4879 ACTUALLY LANDED IN THE DATABASE

Merging is not applying. Run the per-column privilege query in § 6 — **zero is the answer** — and
confirm the trigger exists and the 14 production photos now carry a capturer:

```sql
SELECT count(*) FILTER (WHERE captured_by_person_id IS NOT NULL) AS credited,
       count(*) AS photos,
       (SELECT count(*) FROM pg_trigger
         WHERE tgrelid='public.papic_photos'::regclass AND tgname='stamp_capturer_person') AS trigger_exists
  FROM public.papic_photos;
```

**Expected: 14 credited of 14, trigger 1.** Anything else means the migration did not apply and the
meter is still advisory — say so plainly rather than assuming the merge did it.

⏭ **If the ladder branch is still unpushed:** re-run `pnpm test:db` and `pnpm test:unit` in
`apps/web`, then push and open the PR. Its changelog fragment
(`changelog.d/the-papic-ladder-is-repriced.md`) is written and is the PR body.

✅ **Already merged today — do NOT rebuild:** the couple's file picker and the switch for who may
add photos by hand ([#4875](https://github.com/iscasasola/setnayan-platform/pull/4875), carrying
[#4877](https://github.com/iscasasola/setnayan-platform/pull/4877) and
[#4878](https://github.com/iscasasola/setnayan-platform/pull/4878)).

---

## § 1 · 🔴 THE ONE THING THAT IS A REAL BUILD — ATOMICITY

**Do not claim "a photo cannot exist without a credit" until this exists.**

`recordSeatCapture` reserves the credits and then writes the row. **Two steps.** A process that
dies between them leaks the reserved credits — the couple charged for a photo that does not exist.
It errs against **us**, not against the meter, which is the right direction to fail while it stands,
and the unwind in application code (`abortReleaseDedicated` / `abortReleasePool`) handles the
ordinary failure. But it is debt, and it is written into the migration, the guard and the changelog
on purpose so nobody quotes them as proof of an invariant they do not test.

🔑 **THE REPAIR IS NOT A NEW IDEA — IT ALREADY SHIPS, ON THE OTHER HALF OF THIS FEATURE.**
`papic_record_guest_capture` is `SECURITY DEFINER` and does the whole thing in one function:
resolve the guest, check the event owns the service, check the uploader is not blocked, check terms
were accepted, check the unlock pass, reserve from the pool, insert. **That is why `anon` has never
needed an INSERT grant.** The seat path is the odd one out. **Copy the guest function's shape.**

⚠ **It writes a DIFFERENT table** — `papic_guest_captures`, and nothing copies between them. It is
a model to follow, not a second writer of `papic_photos`. (Measured: all 14 `papic_photos` rows in
prod carry a seat; none exists without one.)

⛔ **The hard part is not the SQL.** Eight app-side gates would have to move into it — a burst
limiter that lives in Upstash, the clip-length cap, the capture window, the paid-order gate, the
put-away gate, the RA 10173 geo control, the unlock pass, and the split reserve. Some of those
cannot move (the rate limiter). Decide which are the transaction's and which stay the action's, and
say so in the function's comment.

---

## § 2 · 🔴 WHAT THE UPLOAD WORK LEFT OPEN

### 2.1 · The switch must be read on the SERVER when anybody else can upload

`events.papic_uploads_open` governs the couple's own picker today, and the couple's picker is the
only manual-upload path in the product — so hiding the control **is** closing the door, because the
only person it could stop is the person who set it.

🚨 **The moment a guest or a supplier gains an upload path, that stops being true.** Hiding a
control is not closing a door: the live photo wall mirrored to every guest's phone while the only
"off" switch closed the venue screens. **Gate the write, not the button.**

🛡 **The tripwire is already armed:** rule 8 of
`app/dashboard/[eventId]/studio/papic/_lib/the-uploads-switch-is-real.test.ts` fails when a
**fourth** thing records a capture. When it fires, two things happen together and neither is
optional — the new path reads the column server-side, and the `events.papic_uploads_open` line comes
out of `tests/db/handles-have-gates.baseline.txt`, which currently says the switch's effect is local.

### 2.2 · "Each person's own folder" is solved for seat captures ONLY

`papic_photos.captured_by_person_id` now has a writer. **`papic_guest_captures` has no
capturer-person column at all.** A guest phone's captures live in that separate table and nothing
copies between them, so the folder idea covers the cameras and not the guests. That is a separate
build and it needs a guest-to-person resolution that does not exist yet.

⚠ **The Uploads camera is claimed by ONE host**, so a co-host adding photos through it is credited
to the claimer. The column means *"whose camera shot this frame"*, which is what the seat answers.
Per-uploader credit is a **different fact** and needs its own column, not a redefinition of this one.

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
