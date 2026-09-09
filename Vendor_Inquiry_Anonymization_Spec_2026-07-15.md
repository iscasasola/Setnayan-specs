# Vendor Inquiry Anonymization — until Accept · 2026-07-15

> # ⛔ SUPERSEDED 2026-09-08 — THIS SPEC IS RETIRED, ITS CODE IS DELETED
>
> **Owner ruling 2026-09-08, verbatim: *"we do not need to hide anything, since
> no more tokens."*** A supplier now sees the customer on any thread their org
> owns, before and after Accept. `lib/inquiry-mask.ts`, `maskVendorThreadEvent`,
> the customer rail's `masked` branch and the placeholder on six surfaces are
> **deleted from the tree**, not disabled. See the 2026-09-08 row in
> `DECISION_LOG.md`.
>
> 🔑 **WHY EVERY ARGUMENT BELOW EXPIRED AT ONCE.** Read the "Why it fits the
> locks" section: each bullet is anchored to the token wallet — *"the token
> gates the doorway"*, *"Flat 1-token burn on Accept … unchanged"*, *"identity
> is what the 1-token unlock buys"*. **The wallet was RETIRED on 2026-05-11,
> two months BEFORE this spec was written.** It shipped reasoning from a
> mechanism that no longer existed, and nothing in the review caught it, because
> every individual sentence was internally consistent.
>
> ⚠ **THE RA-10173 CLAIM INVERTED TOO.** This spec called itself a "positive
> privacy delta". The disclosure it prevented was to a supplier the couple had
> **already chosen to write to** — a `chat_threads` row exists for no other
> reason — so it was withholding a name from the one party the couple had
> deliberately contacted.
>
> 🪤 **AND THE MASK WAS NOT THE BUG THE OWNER HIT.** On accepting the platform's
> first real inquiry he still saw "Couple" / "Not set yet". A vendor holds no
> `events` RLS — measured on the ACCEPTED thread in prod — so every surface's
> *revealed* branch read a null `display_name` and rendered the fallback anyway.
> **Deleting this spec's code changed nothing on screen by itself.** Kept for
> that lesson.

> **Author:** Fable (design lead) · **Owner directive (2026-07-15):** "anonymize-inquiries-until-accept on vendor surfaces" (part of the glass-rollout instruction). Functional change — NOT skin. Implementer: Opus, its own PR (Glass PR-6b), separate from the vendor reskin.

## The model (one sentence)
A vendor sees *what the job is* before spending a token, and *who the couple is* only after accepting — identity is what the 1-token unlock buys.

## Why it fits the locks (no reversals)
- **"Pay for access, not transactions"** (owner 2026-07-10): the token gates the doorway to the couple; anonymization makes the doorway real — today the doorway leaks identity before payment.
- **Flat 1-token burn on Accept** (2026-07-11, live in prod ₱200): unchanged; this spec defines what the burn *reveals*.
- **Fake-inquiry protection** (2026-07-11, hold-and-release design): complementary — anonymization also reduces the value of fake inquiries as vendor-side reconnaissance.
- **RA 10173:** strictly reduces PI exposure (couple identity shared with a vendor only after the vendor commits). Positive privacy delta; note it in the next privacy-notice sweep.

## Pre-accept: the vendor sees (real data, no fabrication)
- Event type + event date (month + year granularity is enough; exact date OK if already shown today)
- Location at CITY/AREA level (never venue name, never address)
- Guest-count band + budget band if the inquiry carries them
- The service/category asked for + the couple's message TEXT
- A neutral identity placeholder: "A couple planning a {event_type} in {city}" — neutral avatar (no initials — initials leak), no display name, no photo, no event title (titles contain names), no links to the couple's public event page, no contact details.

## Post-accept (token settles): full reveal — exactly today's accepted-state behavior.

## Surfaces to mask (sweep ALL of these; the list is from the live app)
1. My Customers hub — inquiry rows/cards + pipeline entries in `pending`/pre-accept states
2. Thread previews + the thread view itself while the thread is pre-accept (message list shows the placeholder identity)
3. Overview "What's new" feed items for new inquiries
4. Notifications (in-app rows + any email templates that include couple names for new-inquiry events — check `new_vendor_message`/inquiry templates; emails switch to the placeholder form)
5. Calendar/day entries derived from pre-accept inquiries, if any
6. The vendor-facing inquiry detail/accept screen — this is THE decision screen: job facts prominent, identity explicitly marked as "revealed when you accept (1 token · ₱200)"

## Enforcement depth (the load-bearing part)
Masking must happen at the DATA layer, not display: the queries/actions serving vendor views of pre-accept inquiries must not ship couple `display_name`/photo/contact/event-title fields to the client at all (RSC props included — a "masked" UI over leaked props is a fake door). Audit the fetches feeding surfaces 1–6; where a shared fetch also serves accepted threads, split or conditionally select. RLS is the backstop if a policy change is cheap, but the server-query layer is the required minimum.

## Edge rules
- Inquiries ALREADY accepted before this ships: unaffected (revealed stays revealed).
- Couple-initiated content inside the message body is not scrubbed (couples may sign their message — that's their choice; we don't rewrite user content).
- Demo-vendor surfaces (admin demo inquiries) follow the same masking so demos look like production.
- Copy must be honest about the trade: "Accept to see who they are and reply — 1 token (₱200). You only spend when you accept." (matches the live Overview banner language).

## Out of scope
No changes to burn amount, settlement timing, refunds (token-settlement design owns those), Merkado couple-side, or the fake-inquiry hold-and-release build.
