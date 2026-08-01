# Role-scoped day-of — one vendor, several roles, one focused run of day

**Date:** 2026-08-01 · **Status:** ✅ **PHASES 1 + 2 BUILT** — PR [#4001](https://github.com/iscasasola/setnayan-platform/pull/4001) (merged) + PR [#4002](https://github.com/iscasasola/setnayan-platform/pull/4002). Phases 3–4 not started; the § 7 questions are all still open and none of them blocked the work so far.
**Origin:** owner, 2026-08-01: *"there is a stylist and an emcee both in 1 service… they have a run
of show for stylist and run of show for emcee"* → *"they can scan the QR code for each task.
Stylist QR · Emcee QR — so an emcee run of day and stylist can focus on their specific tasks."*

---

## 1 · The concept, stated back

**The unit of work on the day is a ROLE, not a company.** One supplier can hold several roles at one
wedding — stylist *and* emcee, band *and* emcee. Today the platform asks *"what is this vendor?"*,
gets one answer, and hands over one toolkit. The true question is **"what is this person doing right
now?"**, because a company sends two people, or one person changes hats at 6pm.

Each role gets its **own run of day** — only its tasks — and a person enters that role by scanning
its QR (or, if they are the account holder, by switching).

**The goal the owner stated is FOCUS, not access control.** That ordering matters: the run of day is
the product; the QR is a door.

---

## 2 · 🔑 THE FINDING THAT CHANGES THE SIZE OF THIS

**The plural already exists and is thrown away on one line.**

```
familiesForServices(services, eventTiles) → Set<DayOfFamily>   ← already a SET, already
                                                                 narrowed to THIS event
resolveDayOfFamily(...)                   → takes the FIRST and discards the rest
```

The same is true one layer up: `specializationSetForServices` walks a priority list and returns on
first match. **Both already know a vendor holds several roles; both deliberately collapse it.**

So this is not a new system. It is **un-collapsing something already computed** — plus a filter that
already exists (`blockRelevance`) and a claim pattern that already ships three times.

---

## 3 · What already ships (do NOT rebuild)

| Piece | Where |
|---|---|
| **All roles a vendor holds on an event** | `familiesForServices()` → `Set<DayOfFamily>` (`coordinate · capture · serve · perform · setup`) |
| Modules already keyed by role | `defaultOnFor: DayOfFamily[]` on every day-of module |
| **Timeline filtered per category** | `blockRelevance(block, categories)` → primary / secondary / background |
| Setup-lead norms per trade | `SETUP_LEAD_MINUTES` — decor 180 min, florist 120, photo 30 … |
| **Per-(vendor, event) account access, revocable** | `vendor_event_access_grants` + `current_vendor_dayof_grant_event_ids()` — the 9th canonical RLS helper |
| **QR-as-capability, atomic claim** | `papic_claim_seat` · `panood_claim_camera` · `vendor_locked_qr_tokens` — token IS the capability, `auth.uid()` is the claimer, one SECURITY DEFINER fn binds them |

---

## 4 · ⚠ A PRIOR OWNER DECISION THIS TOUCHES

**2026-07-16, council verdict §8:** for day-of crew the owner chose **per-event ACCOUNT grants** and
**explicitly rejected the council's DEVICE-PAIRING alternative.**

A role QR is adjacent to device pairing. It is not the same thing — a QR that binds to *an account*
is still an account grant, just with a friendlier door — **but the owner should confirm that reading
rather than have it assumed.** If the QR is meant for someone with no account at all, that *is* the
rejected model returning, and needs a fresh ruling.

---

## 5 · THE RECOMMENDED APPROACH — four phases, value-first

Ordered so the **focus** benefit lands before any new schema. Each phase is independently useful; you
can stop after any of them.

### ✅ Phase 1 · Stop collapsing the set — BUILT (#4001 plural · #4002 picker) *(no migration · no QR · fixes the collision)*

Add the plural alongside the singular — `familiesForEvent()` and `specializationSetsForServices()` —
and let the console offer a **role picker** when a vendor holds more than one. One vendor, several
desks, one active at a time.

- Immediately fixes **band + emcee**, where the script desk is currently unreachable.
- The account holder's door is a **switcher**, not a scan — he is already logged in, and making him
  scan to change hats is friction.
- Pure logic + UI. Fully testable. **Start here.**

### ✅ Phase 2 · The role-scoped run of day — BUILT (#4002)

"My run of day" = the couple's timeline **filtered by `blockRelevance` for that ONE role**, plus its
setup-lead suggestion, framed as **her tasks** rather than the wedding's programme.

- This is where FOCUS actually happens — the owner's stated goal.
- Mostly a filter over shipped data; no new object.
- ⚠ **This is also what makes a stylist QR mean anything** — see § 6.

### ⏭ Phase 3 · The role QR *(for people without a login)* — NOT STARTED · blocked on § 7 Q1

Mint a per-(vendor, event, role) claim token on the shipped `papic_claim_seat` shape: single-use,
race-safe, atomic. Extends `vendor_event_access_grants` with a role column.

🔴 **THE RULE THAT MUST NOT BEND: a QR SELECTS, it never GRANTS.** It may only open a role the vendor
is already entitled to and already booked for. If scanning could *create* entitlement, anyone who
photographs a printed call sheet gets a paid desk. Every shipped claim function already re-gates
ownership inside the function rather than trusting the token — copy that exactly.

Also: **single-use.** A reusable QR on a printout is a permanent public key to the floor.

### Phase 4 · Role-owned tasks the couple never sees *(defer)*

A stylist's real run of day contains work the couple's timeline does not: *"MOB hair 2pm"*,
*"touch-up before the entrance"*. Same shape as `vendor_block_scripts` / `vendor_lines`: **the couple
owns the night; each vendor role annotates it with their own work.**

Biggest new object here — hold it until 1–3 prove out, because Phases 1–2 may already be enough.

---

## 5a · ⚠️ WITHDRAWN — I was wrong, and the owner caught it

**An earlier version of this section claimed the booking model could not express "one supplier, two
roles, one wedding" and asked the owner to choose between three schema changes. That was wrong.
Ignore it; there is no booking decision to make.**

The owner spotted it immediately — *"the vendors can offer multiple services… I thought this was
already plotted"* — and he was right. It **is** already plotted:

- `event_vendors.requested_service_ids` lists the services on a booking.
- Each `vendor_services` row carries **its own category**.
- Alongside them: `event_vendor_line_items`, `event_vendor_packages`, `thread_service_interests`.

So a supplier hired as the band **and** the emcee has always been expressible.

**What I actually found, stated correctly:** the day-of narrowing read only
`event_vendors.category` — the booking row's single summary field — and never looked at the services
underneath. The second role was **recorded and unread**, not impossible.

**Fixed** in PR [#4010](https://github.com/iscasasola/setnayan-platform/pull/4010): `eventTilesForBooking()`
unions the summary category with the categories of the services actually booked. **Union, never
replace** — historic bookings carry only the summary and an empty services list, so replacing would
narrow them to nothing and blank the console for every one of them. No new tables, no migration.

**How the mistake happened, worth keeping:** I checked one column, found a unique index that caps
booking ROWS, and stopped. I never asked what the row *contained*. A structural claim needs the whole
structure, not the first constraint that seems to confirm it — and the owner's memory of his own
product beat my reading of the schema.

**Still true from the wrong version:** the narrowing itself must not be removed. Dropping it would
hand a supplier every desk their `services[]` touch on a wedding where the couple booked them for one
job.

**Remaining reason nothing shows in production:** `vendor_services` has **zero rows**. Ordinary
emptiness — it resolves the first time a real vendor lists their services, with no code change.

## 6 · The asymmetry to know before promising it

**A stylist has no desk today.** `stylist_decorator` is in no specialization set, so a Stylist QR
currently opens the generic kit — not a stylist tool.

So the owner's own example is uneven right now:

- **Emcee QR → a real desk** (Script & cues, shipped).
- **Stylist QR → her slice of the timeline only** — useful (call time, 180-minute decor lead), but a
  filtered view, not a desk.

**Phase 2 is what closes that gap** — it makes the filtered run of day the product for every role,
so a role without a bespoke desk is still worth scanning into.

---

## 7 · What to decide before building

1. **Is a role QR bound to an ACCOUNT** (an invite link, compatible with the 2026-07-16 ruling) **or
   to a person with no account** (which reopens the rejected device-pairing question)?
2. **May one person hold two roles at once** on the same device, or is it strictly one at a time?
   *(Recommendation: one at a time — the whole point is focus.)*
3. **Who mints the QR** — the vendor for their own crew (recommended, mirrors Papic seats), or the
   couple?
4. **Does a role picker replace the priority order, or only override it?** *(Recommendation: replace
   for display, keep the priority as the DEFAULT so a single-role vendor never sees a picker.)*
5. ~~Can a couple book ONE supplier for TWO roles?~~ **WITHDRAWN — not a question. It already
   works** (§ 5a). Nothing here blocks on the owner.
