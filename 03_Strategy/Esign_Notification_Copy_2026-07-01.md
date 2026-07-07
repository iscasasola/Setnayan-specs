# Sign-Before-Pay — Notification & Re-engagement Copy (couple-first flow)

> Draft copy for the async signing flow (owner decision 2026-07-01: **couple signs
> first → vendor counter-signs to confirm → couple pays**). Feeds the Phase 3/4
> build — maps to the 0028 email templates + in-app notifications. Tokens like
> `{coupleName}` / `{vendorName}` / `{serviceName}` bind at build. Voice: warm,
> clear, Filipino-modern; the completion beat lands on the brand line *"Set na 'yan."*

The gap this copy closes: because the couple signs before the vendor, there's a
wait. Without these nudges a couple could sign and never come back to pay. Every
message below has one job — keep the booking moving to "locked in."

---

## 1 · Couple just signed — "awaiting vendor confirmation" *(in-app state, right after signing)*

> **Signed. One quick confirm and you're set.**
> You've signed your {serviceName} contract with {vendorName}. They just need to
> confirm it on their end — we'll email you the moment they do, and then you can
> complete your payment to lock in your booking. Nothing to do right now.

## 2 · Couple — signed confirmation *(email)*

- **Subject:** You signed — {vendorName} just needs to confirm
- **Body:** Hi {coupleName}, your {serviceName} contract with {vendorName} is
  signed on your end. We've asked {vendorName} to confirm it. The second they do,
  we'll send you a link to complete your payment and lock everything in. Sit tight.

## 3 · Vendor — a couple signed, counter-sign to confirm *(email + in-app — the trigger)*

- **Subject:** {coupleName} signed — confirm to lock in the booking
- **Body:** Hi {vendorName}, {coupleName} just signed your {serviceName} contract
  and is ready to book. Counter-sign to confirm — then they complete payment and
  it's locked in.
  **[Review & confirm →]**
- **In-app:** {coupleName} signed your {serviceName} contract — counter-sign to confirm.

## 4 · Couple — vendor confirmed, complete payment *(email + in-app — THE re-engagement)*

- **Subject:** {vendorName} confirmed — one step left to lock it in
- **Body:** Good news, {coupleName} — {vendorName} confirmed your {serviceName}
  contract. One last step: complete your payment and your booking is locked in.
  **[Complete payment →]**
- **In-app:** {vendorName} confirmed your contract — complete payment to lock in your booking.

## 5 · Both — fully executed & paid *(email, with the sealed PDF + receipt)*

- **To couple — Subject:** Set na 'yan — your {serviceName} booking is signed and paid
  **Body:** That's all set, {coupleName}. Your {serviceName} contract with
  {vendorName} is fully signed and your payment is confirmed. Your executed
  contract and receipt are attached. **[View contract →]**
- **To vendor — Subject:** Booked — {coupleName}'s {serviceName} contract is signed and paid
  **Body:** {coupleName}'s {serviceName} booking is locked in: the contract is
  fully signed and payment is confirmed. Your executed copy is attached.
  **[View contract →]**

## 6 · Nudges *(optional, cron-free reminders)*

- **Vendor, ~24h no counter-sign:** {coupleName} is waiting — counter-sign to
  confirm their {serviceName} booking before they cool off. **[Confirm →]**
- **Couple, ~24h no payment after confirm:** {vendorName} confirmed your
  {serviceName} contract — it isn't locked in until you pay. **[Complete payment →]**

---

**Build notes.** (a) States 1–2 fire on the couple's signature; 3 on that same
event to the vendor; 4 on the vendor's counter-signature; 5 on admin payment
approval (the "Fully Executed" seal). (b) Reuse the 0028 Resend templates + the
existing in-app notification system; the executed PDF + receipt are served via
short-lived private links (never a public URL). (c) Nudges ride the existing
cron-free `after()`/scheduled pattern — no polling cron.
