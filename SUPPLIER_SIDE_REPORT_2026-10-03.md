# Supplier side — what really works today (C3 report, 2026-10-03, read from origin/main 74ff0be)

Read-only report by the Sunday cloud controller's C3 researcher. Prod checked with SELECT-only counts.

| Item | Verdict | Missing (smallest steps) |
|---|---|---|
| (a) Event card ↔ chat, see/edit info | PARTLY — both-way link ships (card `app/vendor-dashboard/clients/[eventId]/page.tsx` RelationshipTabShell Chat·Quote·Payments·Files·Schedule·Details ↔ chat `messages/[threadId]/_components/chat-info-rail.tsx`); edits only via request paths/grants | Script tab unreachable when NEXT_PUBLIC_RELATIONSHIP_WORKSPACE_ENABLED is ON (`scriptNode` only mounts in flag-OFF branch) · no song list / entourage / parish sections (access-map additions) · per-area Edit = C2 |
| (b) Event Hub scan menu (One time · Unlimited) → guests' Hub | MISSING — never built (designed 2026-09-25, 5 modes). Pieces: `lib/qr-scan.ts` makeQrDetector, couple check-in/souvenir desks, coordinator seat-scanner; `vendor_guest_deliveries` (0 rows, control active) but `guest_delivery` tile always padlocked (dayOfModuleHref null); `vendor_papic_captures` has no guest link | everything: per-service scan mode, scan session (one/many guests), shared #0001 number, refusal of non-list guests, upload-to-number, guest "your number + photo", one-guest announcement |
| (c) Supplier schedule own items as requests | PARTLY — add/edit requests ship (`suggestScheduleChange` → `event_schedule_suggestions` kind adjust/new → couple Accept/Decline on Schedule page) | no `remove` kind · accepted `new` item not tagged to supplier (`responsible_vendor_ids` empty) · supplier can request on anyone's block · coordinator never notified (couple only) · parish/reception windows not built |
| (d) Papic shots → supplier's Setnayan page after couple's Allow | MISSING — `vendor_papic_portfolio_photos` is a PRIVATE imported album; public gallery is `vendor_profiles.portfolio_r2_keys` (hand upload, NOT reached by TD-1 takedown); no Allow/Decline anywhere | consent store + couple Allow/Decline + shop gallery by reference (so takedown reaches it) |

## Controller's supplier build list (decided 2026-10-03)
- **S1 (Opus, one build, no prototype — approved designs cover it):** Script tab in the flag-ON card · coordinator (The Day = Edit) notified of schedule requests · accepted supplier item is tagged to that supplier · supplier may request add/edit/DELETE on its OWN items only, suggestion-only on others' (migration: kind 'remove') · remove the always-padlocked "Who's received theirs" tile until the scan build replaces it. Runs after C2 (People with access) — same delegate/coordinator readers.
- **S2 scan (Opus, prototype FIRST):** the 2026-09-25 scan prototype breaks today's rules (tour popups, five-row chooser, ⓘ captions, stale menu place) and was never approved → Fable redraws to today's rules, owner approves, then build: schema (extend vendor_guest_deliveries) → scanner on the On-the-day console + tile on the couple-page desk → upload to a number → guest receives it.
- **S3 Papic → supplier page with Allow (Opus, small prototype first):** 2 frames (supplier "Ask to show on my page" · couple Allow/Decline); shop gallery reads allowed captures by reference.
- Owner questions: see CONTROLLER_QUEUE § 2 (2026-10-03).

## Code vs DECISION_LOG contradictions found
- "the shipped QR Scan feature (One time · Unlimited)" — not shipped; designed only.
- Card tabs "Overview · Quote & Payments · Files · Schedule · Activity · Script" = the flag-OFF card; flag ON (documented prod) has no Script tab.
- "Who's received theirs" has no screen; always padlocked.
- Two supplier "Event Hubs": nav Event Hub = `/vendor-dashboard/on-the-day`; the desk on the couple's `/{slug}` has no link from the supplier app.
- 2026-09-25 "supplier scan writes the SAME guest_souvenir_claims" — impossible as built (guest_id UNIQUE, no supplier column).
- `vendor_papic_portfolio_pack` is a SKU/credit grant, not a consent table.
