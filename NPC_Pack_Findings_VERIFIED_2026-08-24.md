# NPC-pack findings — VERIFIED · 2026-08-24

> Closes the read-only half of **W2-B**. Supersedes the *state* of
> [`WHATS_NEXT_NPC_Pack_Findings_2026-08-17.md`](WHATS_NEXT_NPC_Pack_Findings_2026-08-17.md),
> whose verification fan-out died on a usage limit and returned `total: 0, confirmed: 0`.
> That empty result meant **nothing was checked**, not that nothing was wrong. Now it is checked.

**Verified against shipped code at `origin/main` (`ccaa05631`), the live production database, and
the regenerated pack PDFs in `apps/web/assets/npc-docs/` — never against another document.**

## Result

| verdict | count | findings |
|---|---|---|
| 🔴 **CONFIRMED** | **9** | 6 · 8 · 9 · 10 · 11 · 12 · 13 · **14 (already known)** · 16 |
| ✅ **REFUTED** | 2 | 19 · 20 |
| ⚖ **RECLASSIFIED — owner decision, not a defect** | 1 | 17 |
| ⏭ **UNRESOLVED** | 1 | 15 |

⚠ **The source doc says "THE 15 STILL UNVERIFIED" and its table lists 13.** All 13 are dispatched
above. The missing two are a counting error in that header, not two lost findings — findings 1–5,
7 and 18 were already closed in its own "do NOT re-investigate" table.

🚨 **The single loudest result: the pack over-declares collection we do not do.** Four of the nine
confirmed findings (8, 9, 11, 12) are the filing describing a company that collects more, shares
more, and shares it with more organisations than the real one does. That is the OPPOSITE direction
from the retention gap and is just as wrong. Nothing has been filed yet, so nothing false has
reached the Commission — **it becomes false the moment it is filed as it stands.**

---

## 🔴 CONFIRMED

### #8 · The pack declares a government ID, a liveness video and AML screening we retired
**Evidence.** `apps/web/lib/vendor-verification.ts:226` —

> PRUNED 2026-07-03 (owner: *"we do not need this … what we have, that is it"*): `government_id`,
> `live_selfie`, `phone_email_otp`, and `amlc_screening` are **RETIRED**. Identity confirmation is
> the 15-min Google Meet.

The live slot list (`DOC_SLOTS`) is **eight** slots: `dti_certificate` · `bir_2303` ·
`mayors_permit` · `bank_account_proof` · `portfolio_samples` · `client_references` ·
`social_media` · `google_meet`. No government ID, no selfie, no liveness, no AMLC.

The pack was **regenerated 2026-08-17, six weeks after the pruning**, and its Privacy Manual §7
still says vendors give consent for *"third-party ID/liveness verification … and AMLC sanctions
screening"*, while ROPA declares *"Raw uploads (government ID, selfie + liveness video …)"*.

🔑 **Our own live `/privacy` page already contradicts the pack**: *"We do **not** require a
government ID and do not independently verify that this information is accurate."* Two of our own
documents disagree, and the public one is the accurate one.

### #9 · Five outside organisations named as receiving supplier data
**Evidence.** Privacy Manual §8 sub-processor table names **Persona / Veriff / Onfido** (US) —
*"Vendor government-ID image + selfie + liveness"* — and **AMLC API / ComplyAdvantage** (PH / UK) —
*"Vendor business + owner name"*. Five organisations, three jurisdictions, for a programme
retired on 2026-07-03. `persona` alone appears **77 times** across the two documents.

⚖ **Partly self-flagged, and it still stands.** The row carries a *"STATUS TO CONFIRM"* note saying
the live notice describes these providers as inactive. That note asks the DPO a question; it does
not withdraw the declaration. The table still lists them as sub-processors with data shared.

### #12 · The sharing list omits the company hosting the entire website
**Evidence.** Occurrences in `02_Privacy_Manual.pdf`: **Vercel 0** · **Sentry 0** ·
**LanguageTool 0** (Supabase 6 · Cloudflare 5 · Resend 2 · PostHog 2 · Anthropic 1 · Suno 1).

Vercel hosts the application — every request and all personal data passes through it — and is
absent from the flagship governance document. Sentry receives server-side error data. Both are in
our own `lib/subprocessors.ts` register.

### #10 · A company in Germany receives text couples write, named nowhere
**Evidence.** `apps/web/lib/editorial-scan.ts:114` POSTs the text to
`https://api.languagetool.org/v2/check` — **LanguageTooler GmbH, Potsdam, Germany**.

The caller is `app/dashboard/[eventId]/website/editorial/actions.ts:391`, i.e. **the couple's own
event story**, scanned on save.

`languagetool` appears **0 times** in `lib/subprocessors.ts`, **0 times** in the Privacy Manual and
**0 times** in the ROPA. An undeclared processor **and** an undeclared cross-border transfer to the
EU. This is the only finding of the thirteen that was invisible from the documents alone — it was
found by enumerating every external host the server actually calls.

### #11 · OpenAI's declared purpose is wrong
**Evidence.** Privacy Manual §8: *"Anthropic / OpenAI — US — **Vendor contract text (AI features
only)** — Contract analysis and AI features."*

Measured: `lib/editorial-scan.ts` sends **the couple's editorial text** to
`https://api.openai.com` (Moderation API) — the same `scanEditorial` call as above. That is not
vendor contract text, and the declared data category and purpose are both wrong for it.

### #6 · Account deletion is described wrongly in both directions
**Both halves confirmed, exactly as the audit predicted.**

**(a) The 30-day grace does not exist.** The pack: *"Account deletion + **30-day grace** then
purge"*, and *"(plus the existing 30-day tail)"*. The live `/privacy` page: *"a short **30–90 day
tail**, then permanent deletion."*

The owner-locked design, `supabase/migrations/20261106000000_account_deletion_requests.sql`, is
**"Request + admin review ≤24h"** — the user files a request, an admin approves, and approval runs
the existing erase immediately. No column anywhere encodes a grace, a scheduled purge or a
delete-after date. A person who deletes and changes their mind has hours, not thirty days.

**(b) It understates what is kept.** `app/admin/users/actions.ts:180` — *"Soft-deletes +
**anonymizes** via `eraseUserAccount` — **no auth.users DELETE is issued**."*

### #16 · Erasure is blank-out-and-keep, not delete-then-remove
**Evidence.** The same function, whose docstring is explicit and deliberate:

> ⚠ THE FOREIGN-KEY REASON FOR NOT DELETING IS GONE AS OF 2026-08-02, AND THIS FUNCTION STILL DOES
> NOT DELETE — on purpose. … erasure's obligation is to destroy the PERSONAL data, not the business
> records, and anonymize-and-retain does exactly that.

The pack describes it as a cascade: *"Account deletion cascades to profile, event memberships, face
vectors, individual photos of the subject … and chat history."*

⚖ **THE CODE IS RIGHT AND THE DESCRIPTION IS WRONG — do not "fix" the code.** Anonymise-and-retain
is the correct reading of RA 10173 here and the docstring says so, with a standing warning not to
convert it to a hard delete on the strength of the FKs now being clear. **The defect is entirely in
the filing.** This was ranked the most load-bearing promise in the pack, and the fix is one
paragraph of accurate description.

### #13 · We advertise an analytics opt-out that does not exist
**Evidence.** The live `/privacy` page says it **twice** — *"via PostHog · no personal identifiers ·
**opt-out available in your profile**"* (§ what we collect) and *"PostHog Cloud (product analytics —
**opt-out available in your profile**)"* (§ sub-processors). `lib/subprocessors.ts` repeats it.

Measured: every form control on the profile page is `display_name` · `phone` · `birth_date` ·
`civil_status` · `locale` · `meal_preference` · `dietary_restrictions` · `profile_photo_url` ·
`marketing_opt_in` · `discoverable_by_name` · `public_profile_enabled` · `public_greeting_opt_in` ·
`planner_mode` · the password fields. **There is no analytics opt-out.** No
`analytics_opt*` / `posthog_opt*` column exists in any migration, and none of the 20 entries in
`DATA_PRIVACY_CONTROLS` is one. `marketing_opt_in` governs marketing email — a different thing.

**This is a right we advertise on a live public page and do not provide.**

### #14 · Withdrawing consent blurs nothing
**Evidence.** Privacy Manual §7: *"…can withdraw at any time via a 'Photo Consent' toggle;
**withdrawal triggers face-blur in captures** and revocation of face data."*

Measured: `withdrawFaceConsent` in `app/[slug]/actions.ts` nulls `face_vector` and `vector_model`,
stamps `revoked_at`, and deletes the R2 selfie. It contains **no reference to `faceblock_enabled`
and no call to any blur path.** The revocation half is true; the blur half does not happen.

🔑 **FaceBlock itself IS built** — `lib/face-blur.ts` (sharp, Gaussian, baked server-side by
`bakeFaceBlurForCapture`). It is simply a **different control**, driven by `guests.faceblock_enabled`.

🛑 **THIS ONE WAS ALREADY VERIFIED ON 2026-08-17 AND THE REGISTER DID NOT KNOW.** The
`project_setnayan_faceblock_rulings` note records the identical finding — *"Withdrawing consent runs
a **veto** (hides the photo) and never a blur — while the pack declared 'withdrawal triggers
face-blur in captures' in **three** places"* — and the owner then made **four rulings** on it the
same day (public = everyone but the couple · blur don't hide · either side toggles freely · the
guest is told). **This pass independently reproduces that result; it does not discover it.**

**And the second half is settled too, not a new finding.** `/privacy` says *"A guest … **can turn
on FaceBlock**"*, while the only writer of `faceblock_enabled` is
`app/dashboard/[eventId]/guests/[guestId]/actions.ts` — the **couple's** per-guest screen. I
re-measured that independently and it holds. But it is already recorded as *"the sixth gate with no
handle"*, and **owner ruling (3) of 2026-08-17 already closes it: either side toggles it, freely.**

⚖ **So #14 needs no new decision — it needs the BUILD that four rulings are already waiting on:**
the guest-side switch · linking consent-withdrawal to the blur · extending blur to the public event
page · the change notification · and correcting the pack and `/privacy`. **Do not re-ask the owner
any of the four.**

---

## ✅ REFUTED

### #19 · The device-data justification does NOT rest on per-enquiry charging
The finding predicted the legitimate-interest basis leaned on suppliers being charged per enquiry —
false, since answering is free on every tier.

**Read, not merely searched for.** The ROPA row states: *"Purpose — Protect marketplace trust
signals from manipulation: cluster likely-same-person/household accounts …; de-duplicate vendor
review/rating/booking stats per cluster …; score per-vendor fraud anomalies"*, and *"Legal basis —
Legitimate interest (§12(f)) — fraud prevention / marketplace integrity."*

The basis is review and rating manipulation, which is real and entirely unaffected by answering
being free. Three searches for the charging premise (`charged`, `fake inquiries`, `per-enquiry`)
returned nothing across both documents — but the refutation rests on the positive read above, not
on those absences.

### #20 · There is no "DO NOT LODGE" banner
The source doc already suspected this one was overstated. Confirmed overstated: `do not lodge` and
`DRAFT — [PENDING COUNSEL]` both return **0 occurrences** across the Privacy Manual and the ROPA.

---

## ⚖ RECLASSIFIED — an owner decision wearing a defect's clothes

### #17 · Un-suspending a supplier returns them to hidden — **on purpose**
The behaviour is real: the auto-suspend path snapshots `prior_public_visibility`, but
`unsuspendVendor` (`app/admin/fraud/actions.ts:154`) writes a hardcoded
`public_visibility: 'hidden'`. A previously public shop does not come back public on its own.

**But the line above it is an owner lock:**

> 🔒 Owner 2026-07-27 — see the un-freeze note above: restore to `hidden`, never to the retired (and
> formerly public) `coming_soon`.

`hidden` is the resting state of every unapproved shop under the same 2026-07-27 ruling. **This is
not a bug and must not be "fixed".** The only residue is that the pack calls auto-suspend simply
*"reversible"*, which understates that reversal returns the shop to hidden and an admin must
re-publish it. A wording precision point, nothing more.

---

## ⏭ UNRESOLVED — say so rather than guess

### #15 · "Two of four people-connection rights have no mechanism"
**I could not locate an enumeration of four named rights in the pack to test against**, so there was
nothing to check the code's mechanisms against. What I did measure: the Person Graph ROPA row says
*"declined/hidden/opted-out suppressed immediately"* (three states), and
`app/dashboard/(account)/people/actions.ts` exports `addPersonConnection` · `setConnectionLabel` ·
`withdrawConnection` · `resendConnectionInvitation` · `confirmConnection` · `declineConnection` ·
`proposeSamahanConnection` · `invitePersonToSamahan`, with `discoverable_by_name` and
`public_profile_enabled` on the profile.

Confirm, decline and withdraw all have mechanisms. Whether the finding's "four rights" maps onto
these cannot be settled without its source enumeration. **Verdict withheld deliberately** — a
guessed refutation here would be worth exactly as much as the empty fan-out this document replaces.

---

## ⏭ QUEUED — none of this is engineering's to decide

Every item below is corpus, DPO or product territory. **Nothing here was edited by the session that
found it.**

| # | what needs doing | whose call |
|---|---|---|
| 8 · 9 | Remove the government ID, liveness video and AMLC screening from the pack, and the five organisations that were to receive them. The programme was retired 2026-07-03. | **Owner as DPO** |
| 12 | Add Vercel, Sentry and LanguageTool to the Privacy Manual §8 sub-processor table. | **Owner as DPO** |
| 10 | Decide whether to keep LanguageTool at all. It is a free public endpoint receiving couples' story text with no DPA and no SCCs. Dropping it is one `fetch` and costs a grammar hint. | **Owner** (product + DPO) |
| 11 | Correct OpenAI's declared purpose and data category — it moderates couples' editorial text, not vendor contracts. | **Owner as DPO** |
| 6 | Either build the 30-day grace or stop declaring it — in the pack **and** on the live `/privacy` page ("30–90 day tail"). | **Owner** (product) |
| 16 | Rewrite the disposal paragraph to describe anonymise-and-retain. **The code is correct; only the description changes.** | **Owner as DPO** |
| 13 | Either build the analytics opt-out or stop advertising it on `/privacy`. Advertising it is the worse of the two. | **Owner** (product) |
| 14 | ⚠ **NO DECISION NEEDED — this is a BUILD the owner already authorised on 2026-08-17.** Four rulings are waiting on it (see `project_setnayan_faceblock_rulings`). Owed: the guest-side switch · link consent-withdrawal to the blur · extend blur to the public event page · the change notification · correct the pack and `/privacy`. **Do not re-ask the four.** | **engineering** (already ruled) |
| 17 | Optional: say "reversible to hidden" rather than "reversible". | **Owner as DPO** |

🚨 **One coupling to watch when the pack is next regenerated.** Face-data and supplier-identity
deletion are now **enforced in code** (PR
[#4735](https://github.com/iscasasola/setnayan-platform/pull/4735)), so the two rows' *"ADOPTED
2026-08-17, ENFORCEMENT NOT YET BUILT"* qualifier becomes stale. But
`apps/web/lib/npc-pack-is-true.test.ts` **asserts that qualifier is present** whenever a row states
one of the adopted periods. **The pack and that guard must change in the same commit**, or CI goes
red on a document that finally became true.

---

## The lesson worth keeping

**A document can be right where you look and wrong where you do not.** A session checked this same
pack on 2026-08-23, found the retention section already corrected, and reported the pack broadly
true — because it checked the section it had been told about. The vendor-verification section was in
nobody's brief, and it took a session working an unrelated territory to trip over it.

And **#10 was invisible from the documents entirely.** No amount of reading the pack would have
surfaced LanguageTool, because the defect is a company the pack has never heard of. It came from
enumerating every external host the server actually calls and diffing that against the declared
list. **For a processor register, the code is the source of truth and the document is the claim —
audit in that direction, never the reverse.**
