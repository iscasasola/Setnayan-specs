# SYNC → Explore-replan session · from the Booking session · 2026-07-27

> Owner asked for this file so the two waves land cleanly. It is the **handover of everything
> in the booking wave that touches Explore's surfaces**, plus what Booking is building alone so
> you can stay off it. Governing doc is still
> `Integration_Contract_Booking_x_Explore_2026-07-27.md` (read §2 and §4 — both carry
> same-day CORRECTIONS where Booking's original claims were wrong). This file is the delta.

## 0 · TL;DR

- **Booking is now building the vendor-side maker**, which needs NO coordination — new columns
  on package tables + a ★ Customization step inside the service wizard. Explore stays off
  `service-wizard.tsx`, `services-manager.tsx`, `packages/actions.ts`, `package-editor.tsx`,
  `lib/service-text-integrity.ts`, `lib/chat-contact-filter.ts`.
- **Three booking items are card-facing and should ride with your slice D**, not land
  separately: the Service **Details** screen, the **booked count**, and the **adaptive card**.
  Details: §2 below.
- Shipped since the last sync: **#3800 + #3802** (card-text gate, complete; flag still OFF) and
  **#3793** (photo downsizing). **Billing is now ARMED in prod** — see §4, it changes what a
  lock costs.

## 1 · What Booking is building ALONE (stay off these files)

| Slice | Files | Why no sync needed |
|---|---|---|
| **B-1 · option schema** — `parent_option_id`, `pick_min`/`pick_max`, `max_extra_hours` | new migration + `packages/actions.ts` + `lib/package-authoring.ts` | vendor-side package authoring; Explore reads packages but authors none |
| **B-2 · ★ Customization step** | `service-wizard.tsx`, `services-manager.tsx`, new step component | the §7-blocker refactor; contract §1 assigns these to Booking |
| **B-3 · split helper + drag-and-drop + grouping** | inside B-2's step | same surface |
| **B-4 · recursive follow-ups (couple render)** | `lock-modal.tsx` / inquiry sheet content | contract §1: sheet CONTENT is Booking's |
| **B-5 · card health** | inside B-2's step | same surface |
| **B-6 · §6.7 per-line special requests** | inquiry sheet content + a child table | same |

**Ordering note that matters to you:** B-1 → B-2 must land *before* the card-facing work is
worth building, because a Details screen showing "choose 3 of 5" or a follow-up question cannot
exist until the maker can author those and the columns exist to store them.

## 2 · What must ride with SLICE D (card-facing — please carry these)

Booking's three-screen flow is **Card → Details → Inquiry**. You own the card rails; Booking
owns the inquiry sheet's content. The middle screen is unbuilt and lands on your surface.

1. **Service Details screen** — the per-service proof screen the card opens on tap: this
   service's own photos + showcase clip (`primary_photo_r2_key`, `showcase_photo_r2_keys`,
   `showcase_video_r2_key` — all shipped), up to 10 recent completed events for THIS service
   (≤5 photos each), the vendor's other services, and the Inquire action. Not the vendor's
   public profile page — a service-scoped screen.
   ⛔ **Known blocker, unbuilt:** `vendor_completed_events` (`20270321252758:160`) has **no
   `service_id`**, so "events for THIS service" cannot be filtered yet, and the package-booking
   cascade never stamps a service id. Either it lands with D or Details ships showing
   vendor-level events with the limitation stated in the UI — Booking's preference is the
   latter over blocking D.
2. **Booked count on the card** — "booked 12×". Source is the same anti-self-dealing
   completed-events view; same `service_id` caveat.
3. **Adaptive card** — suppress/greyout by the event's pax, date, venue distance; and **hide a
   category the couple has already locked** from add-on suggestions. This overlaps your
   grey-out rule (spec §6) — please make it ONE implementation, not two.

**Unchanged and must not regress** (Booking's standing locks): price freeze at inquiry,
per-head pricing computed to the couple's actual pax, locked-category suppression, and the
stateful Inquire/💬 Check inquiry behaviour keyed off thread existence (contract §2's
correction box — the guard is NOT in `inquiry-composer.tsx`).

## 3 · Waiting on YOU (Booking will adopt, not build)

- **PR-H (vendor agrees)** → Booking then changes `LockPackageModal` + chat-lock copy to
  request-state wording ("Lock this" → "⏳ lock in progress"). Ping when it lands.
- **PR-I (fee + pool at acknowledge)** → contract §4 anchor rule applies; see §4 below, the
  risk is now live rather than theoretical.
- **PR-J (found-you)** → ships per (event × vendor); the owner ruled **NO** on widening to the
  couple's other events (2026-07-27). Booking's `booking_fee_attribution_for` is unchanged.

## 4 · ⚠ CHANGED SINCE THE CONTRACT WAS WRITTEN — billing is ARMED

The owner set **`NEXT_PUBLIC_BOOKING_FEE_ENABLED`** in prod today (confirmed intentional).
Verified at the moment of arming: **nothing had billed** — `booking_fee_charges` 0,
`booking_fee_ledger` 0, vendor-payer `orders` 0.

**What this changes for your slices:** the fee path is no longer dormant. From the next lock of
a Setnayan-**sourced** booking, `collectBookingFeeAtLock` writes a real `orders` row plus a
`payments` row into `/admin/payments`. Contract §4's correction stands and now bites for real:
**that path is gated by ONE flag, not two.** So when PR-I moves the fee call to
`vendorAcknowledgeDeposit`, a mistake there is live money, not a dark-flag rehearsal — resolve
the package **anchor** before any fee call, and assert the positive post-condition (a ledger
row exists, a pool row exists) rather than that the call returned without error.

Vendor protections, all shipped and unchanged: sourced-ONLY (imports free forever, fail-safe on
unknown/error), **free-5 per event**, the 5%→1% taper over ₱100,000 with a ₱50 floor, and
covered package rows refused (`covered_row_no_fee`) so a package bills once on its anchor.

## 5 · Available for you to import (shipped today)

`evaluateMessage(body, profile?: 'chat' | 'card')` in `lib/chat-contact-filter.ts`. Default
`'chat'` is byte-identical to what shipped. Use `'card'` for vendor-authored text a couple
reads. **Do not fork it and do not add a profile member** — if a field of yours needs different
treatment, ask Booking and it lands beside `'card'` in that one module.

Two owner-ruled trades inside `'card'`, both pinned by tests: `@` stays blocked and the message
teaches the fix (*write "at Tagaytay"*); a bare platform name with no number or handle ("Viber
only") is **accepted** — nothing a couple can act on, and the price of allowing "Instagram
teaser reel".

## 6 · Ping protocol (unchanged)

Explore pings before slice D. Booking pings before touching
`vendor-dashboard/services/actions.ts`. Whoever merges second rebases; never resolve a
stale-tree merge by hand-picking. Branch from current `main` — #3793, #3800 and #3802 are all
underneath you now.
