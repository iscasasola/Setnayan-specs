# Suppliers, supplier dashboard and Event Hub — owner rulings of 10 October 2026

Every sentence in quotes is the owner's (Ice Casasola). Continues `HANDOFF_2026-10-10_Event_Hub_and_Suppliers.md`.
Prototypes: `prototypes/suppliers_add_your_own_2026-10-10.html` (both phones: Couple | Supplier; cases A–E) ·
`prototypes/suppliers_date_place_help_tour_2026-10-10.html`. Map: `SUPPLIER_CONNECTION_MAP_2026-10-10.md`.

## The order and the shape of the work
- "what we are building is the connection os the supplier and user on their events. we cannot invite vendors if the event
  supplier's page, event hub is not working"
- "the event suppliers page is interlinked to the supplier dashboard" → the two are planned, built and CHECKED IN PAIRS:
  a couple-side step with the supplier-side step that answers it. A Suppliers-page piece is not "working" when only the
  couple's half exists.
- On the "Add your own" supplier flow: "so in line with this is part of the supplier dashboard" · "that also links to the
  vendor's calendar/schedule/ plans." · "this flow goes straight to booking fee."
- Sequence he set: "do the fix, batch the finished work to live" · "Event Hub Left overs" · "then even suppliers page".
- Tours: "remember our tour is a spotlight tour" (the approved look: `prototypes/spotlight_tour_sample_2026-10-02.html`) and
  "let's do the tour last. after all is mapped and built properly". No tour is built or briefed until then.

## His answers (numbered as asked)
1. A supplier the couple brings themselves ("Add your own") — "B": they pay the booking fee ONLY IF Setnayan showed the
   couple that shop first. (Approval 11 = yes. Today's shipped rule: host_manual / a claimed link = import, free forever.)
2. The price match — "10% allowance +-. so if 100,000 that is between 90-110k". (`fee_leak_price_tolerance` = 10 % either
   side. HIS number.)
3. The "Add your own" flow as drawn (approval 10) — "yes". 4. Price and "already booked?" as steps in the first walk — "out".
5. Suppliers approvals 1–8b — "none" are a no. 6. Supplier dashboard cards 1, 9, 3, 8, F4 — "built for all 5".
7. A date saved on the Suppliers page — "waits" (for the Event Hub's Apply). 8. Help me choose — "every price picked"
   (days free for every PRICED pick). 9. A venue typed by hand in the place sheet — "A": only the place's name and pin for
   guests; not added to their suppliers. 10. A pending date change also shows on the Suppliers page — "yes".
11. Photos of you — "animate only". 12. Plain on a bare block — "depends on the background tool" (controller's reading:
    its shape follows that tool's Framed / Full width; not yet confirmed). 13. Font on an RSVP line — "defualt is always
    based on the studio look. then they can customize it as intended" (as built).
14. The new Maker for couples — "we do not have guests yet. so holding this does not matter. make it live now." →
    `NEXT_PUBLIC_MAKER_STAGES_STUDIO_ENABLED=true` in Vercel Production; live 2026-10-10 10:28 UTC (a rebuild was needed:
    `deploy-prod` skips the build when only a setting changed).
- Scrub, what arrives where the names built out on a real invitation — "Together": the RSVP button and the countdown
  arrive as one piece.
- The supplier's half of "Add your own": the couple's link shows the supplier who invited them and the date — "3 yes"
  (**supersedes, for a couple's own link, the 2026-05-19 "identity only" lock on the claim page**; first names and the date).
  "4-6 do as you recommend": a couple's hand-typed record does NOT hold the date on the supplier's calendar before the
  supplier agrees (it reads "asking"); the supplier's price box waits until the photo and what's-included are complete
  (his 2026-10-07 words: "they must agree to complete these information before they set the price"); the couple IS told
  when the supplier declines or never opens the link.
- Still open: which "plans" he meant (payment plan / packages / Setnayan tier); whether a name match still counts after
  "Not them?"; whether couples are told "the supplier skips the booking fee"; approvals 9 and 12.

## Facts read in code the same day (re-measure before acting; a comment is not a measurement)
- The booking fee fires at the LOCK (`finalizeVendor → collectBookingFeeAtLock → booking_fee_open_lock_charge`), not at
  proposal send (that gate was retired 2026-07-24). Import → `waived_import`; sourced → the supplier's first 5
  (`FREE_BOOKING_LIMIT`) → `waived_free5`, then `pending` + an order. The schedule in code (`BOOKING_FEE`) is a default; the
  live rate is in `platform_settings` and was not read.
- The connection map: 37 round trips — 9 whole, 5 only on the old supplier pages, 9 one-sided, 10 broken, 4 unknown.
  Minimum pairs before inviting suppliers: P0 notices + email · P1 ask/answer/quote · P2 book + the supplier's yes ·
  P3 money · P4 Add your own + the claim · P5 calendar truth ("Not set", never "Free").
- The supplier dashboard is 2 of 13 steps rebuilt (S-PR0, S-PR1).

## Added the same day — search and the inquiry (owner, verbatim)

> "so when they search for a supplier's service card. it will be compared to the available schedule of that service on the
> event's date and if there is a location already, if we can cater that service to that location.
> service card will not show if they are not available to that date/s or that location.
> when they inquire, we also show what other categories they offer. so when they inquire, they will inquire for all the
> categories they want to know. it will be counted as 1 inquiry."

- Find hides a service card that cannot be booked on the event's date(s) or delivered to its place. Full row: DECISION_LOG
  2026-10-10 "SEARCH SHOWS ONLY WHAT CAN BE BOOKED FOR THIS EVENT".
- What exists (read in code, re-measure): the per-card hide (`hideUnbookable`, `service_cards_unbookable_on`) — Find does not
  pass it; the reach gate (`radiusOk`) — Find has it; one thread per event and supplier with many categories
  (`thread_service_interests`, `alsoServiceIds`) — the new Suppliers sheet sends one category per press.
- The delta: Find passes the hide · candidate dates are read · the sheet's ask step gets a tick list, one send.
- Not set ≠ not available: a supplier with no calendar or no pin stays shown, labelled "Not set" (P5).
- **"Farther away" stays (owner, verbatim, same day):** "yes offer the farther away option. in case the need to search more".
  ⇒ a supplier out of reach is not in the first list, and Find offers the existing "farther away" option
  (`includeFarther`) to show them. He spoke of distance only: a card that cannot be booked on the date stays hidden.
- Not said by him: whether `/explore` changes (kept demote-only on 2026-09-11).
- The supplier-dashboard comparison page (18 cards) is fully answered: cards 1, 9, 3, 8, F4 "built for all 5"; the other
  thirteen take the recommendation on each card.
