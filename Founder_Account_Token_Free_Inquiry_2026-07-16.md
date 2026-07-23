# Founder Accounts — Token-Free Inquiries + Explicit Founder Signal (2026-07-16)

> Owner decision, 2026-07-16. **NOT built.** Design capture for the founder-account model. Related: [[project_setnayan_token_settlement]] · [[project_setnayan_fake_inquiry_protection]] · [[project_setnayan_creator_economy]] · § 10a internal accounts (0023 admin spec / 0034 payments).

## The decision (owner-stated)

1. **Up to 10 founder accounts, owner-granted.** *(Updated 2026-07-16, same day — supersedes the initial "exactly two" framing.)* Ice and Cale hold the first two seats; the owner may grant up to 8 more. Founder seats are a hard cap of 10, granted only by the owner — never self-service, never automatic. The first two are real users with a real event on the platform (the live prod wedding event "Cale & Ice").
2. **When a founder account inquires with a vendor, the unlock is token-free for the vendor.** No burn, no hold-and-release, no settlement event. Vendors never pay to serve the founders.
3. **The vendor is explicitly notified that the inquiry comes from a founder.** The signal must be unmistakable — "we are not just clients, we are the founders of the app." This is both transparency (vendors earn on this platform; they should know when they're serving the people who run it) and protection (a founder inquiry must never be mistaken for a fake/test inquiry or reported into the fake-inquiry cluster machinery).
4. **All features are already paid for.** *(Added 2026-07-16, same day.)* Every event a founder creates is fully unlocked, and every in-app service/SKU a founder orders is free — ₱0, no payment-pending state, no reconciliation. **Scope: Setnayan in-app SKUs only.** Vendor services are external money (0% commission, off-platform settlement) — Setnayan cannot and does not comp a vendor's own fee; founders pay vendors directly like any client.

## Why this exists

- Users **earn** on Setnayan (vendors via 0%-commission bookings, creators via the discount/collab program). When a founder account needs a service, that is real demand from the platform's own operators — vendors should be told, not left to guess.
- The token economy settles when a couple opens/replies to a quote ([[project_setnayan_token_settlement]]). A founder inquiry inside that machinery would either cost the vendor a token to talk to the people who built the app, or look like an anomaly to the fake-inquiry backstop. Comping it and labeling it removes both failure modes.

## Proposed mechanics (design, not locked)

| Piece | Proposal |
|---|---|
| **Designation** | Server-asserted founder flag — an owner-managed allowlist (or `users.is_founder`) with a **hard cap of 10**, **distinct from § 10a `is_internal`**. `is_internal` may later cover team members who are not founders; the vendor-facing claim "founder of the app" must only ever be true for owner-granted founder seats. Never user-editable (impersonation guard: the badge renders from the server flag only, never from profile text). **Grant/revoke = an admin-console surface (owner-decided 2026-07-16 "we will set it on admin later")** — a 0023 surface, built later; seed Ice + Cale by migration in the meantime. The cap of 10 is enforced server-side, not by convention. |
| **All-features comp** | Founder orders on any in-app SKU skip payment entirely — same effect as the § 10a internal skip-payment path, stamped `comp_reason='founder'` on the `service_orders` row (auditable, distinct from admin comp grants). Applies to every event the founder creates. Does NOT touch vendor money (external, 0% commission). |
| **Token bypass** | At `unlock_vendor_event` / lead-unlock time: inquiring customer is a founder → skip burn AND skip hold-and-release; stamp the unlock row `comp_reason = 'founder'` for audit. No settlement, no refund path. **Owner-confirmed 2026-07-16: this is for VERIFIED vendors only** — i.e. verified-and-up tiers (verified/solo/pro/enterprise), the vendors who can accept in-app inquiries at all. The FREE-tier gate stands: unverified vendors cannot accept founder inquiries either; the founder comp does not pierce the verification safety gate. |
| **Vendor signal** | Founder ribbon on the lead card + thread header (e.g. "⭐ Setnayan Founder — this inquiry is from the people who built the app · no token charged"), and the lead/new-message email carries the same line. Copy owner-reviewed before ship. |
| **Fake-inquiry exclusion** | Founder inquiries excluded from fake-inquiry report clustering, refund statistics, and pairwise-block logic. Nothing to refund anyway (no token held), but the report path should short-circuit with the founder explanation. |
| **Notification** | "One of our accounts is in need of service" — the founder inquiry itself IS the notification, delivered through the normal lead channel (in-app + `new_vendor_message` email per 0028) with the founder line attached. No separate broadcast surface needed for V1. |

## Open owner sign-offs

1. **Cale's account/email (and any further seat grants).** The `on_auth_user_created` trigger hardcodes only `iscasasolaii@gmail.com` as internal. Which email is Cale's founder account? ~~Does a founder seat also carry comped SKUs?~~ **RESOLVED 2026-07-16 (owner): yes — all features already paid for on every founder seat; all in-app services free.** Whether that rides the existing `is_internal` path or a founder-specific comp path is implementation's call — the doc recommends keeping the *flag* distinct (`is_founder`) even if the comp *effect* is identical.
1b. **Badge-title dilution guard.** Every seat carries the vendor-facing claim "founder of the app." If later seats go to family/team who aren't literally founders, either accept the stretch or split the copy (e.g. "Setnayan Founders' Circle") — owner's call at grant time.
2. **Analytics treatment.** Do founder inquiries count in Market Intel / Demand Radar? The event is real demand, but comped unlocks could distort token-economy stats. Recommendation: count in demand signals, exclude from token/settlement revenue stats.
3. **Badge copy** — exact founder-signal wording (EN, luxurious-Filipino-modern voice).
