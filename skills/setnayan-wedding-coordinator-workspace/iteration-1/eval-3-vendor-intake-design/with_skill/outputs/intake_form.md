# Mobile Bar / Bartender — V2 Vendor Onboarding Form

This is the actual form a Mobile Bar vendor sees when they accept a Setnayan invite from a couple or coordinator. It's split into two phases:

- **Phase 1 — Vendor Profile (one-time).** Filled when the vendor first joins Setnayan. Reused across every event they take.
- **Phase 2 — Per-Event Intake.** Filled when the vendor confirms a specific Setnayan wedding. This is the form that produces a `vendor` object in the event JSON.

Copy is in Setnayan voice — warm, Filipino-comfortable, practical, mostly English with natural Filipino tags ("po," "salamat") where they actually fit. No "your magical day" energy.

---

## Phase 1 — Vendor Profile (one-time)

> *Welcome po sa Setnayan. We'll keep this short — fill this once, and every couple who books you skips ahead to the fun part.*

### Business basics
- **Business name** *(required)*
- **DTI / SEC registration number** *(optional but unlocks the verified badge)*
- **Year started**
- **Service area** — multi-select: Metro Manila, Cavite/Tagaytay, Laguna, Batangas, Cebu, Davao, Other (comma-separated)
- **Will you travel for out-of-area events?** Yes / Yes with travel fee / No
- **Out-of-area travel fee structure** *(if applicable)* — short text

### Primary contact
- **Contact person name** *(required)*
- **Mobile number** — E.164 format, e.g. +639171234567 *(required)*
- **Email** *(required)*
- **Viber / Messenger handle** *(optional, surfaced to coordinator only)*

### Service capabilities
- **Service styles you offer** — multi-select:
  - Open bar
  - Limited bar (beer + wine + signature)
  - Cash bar
  - Hybrid (open beer/wine, signature for cocktail hour)
- **Maximum guest count you can serve with one bar station** — number
- **Maximum guest count you can serve with two bar stations** — number
- **Bartender-to-guest ratio you operate at** — short text (e.g., "1:75 for open bar, 1:50 for signature-heavy")
- **Do you provide glassware?** Yes / No / Sometimes (depends on package)
- **Do you provide ice?** Yes / No / Always partial (need venue or partner)
- **Do you handle corkage on outside alcohol?** Yes / No / Case-by-case
- **Sommelier service available?** Yes / No
- **Custom signature cocktail development?** Yes — included / Yes — paid add-on / No

### Drink program defaults
- **Spirits you stock by default** — multi-select: whisky, gin, rum, vodka, tequila, brandy, other
- **Beer brands you stock by default** — comma-separated
- **Wine selection breadth** — short text
- **Mocktail / non-alcoholic standard offerings** — comma-separated

### Pricing snapshot
- **Starting package price (PHP)** — number
- **Starting package guest count** — number
- **Per-additional-head pricing (PHP)** — number
- **Reservation fee policy** — % or flat amount
- **Down payment policy** — % and timing
- **Balance due timing** — e.g., "7 days before event"

### Operations
- **Setup time required (minutes)** — number, default 90
- **Breakdown time required (minutes)** — number, default 45
- **Power requirements** — multi-select: standard 220V outlet, generator-compatible, no power needed
- **Water requirements** — short text (e.g., "Need water within 10m of station for rinsing")

### Insurance & policies
- **Liability insurance on file?** Yes (upload) / No / In progress
- **Cancellation policy** — short text
- **Sick / no-show backup plan** — short text

### Setnayan agreements
- *Salamat po. By submitting, you agree to the Setnayan Vendor Terms (V2) and to receive event packets and change updates from Setnayan on behalf of couples who book you.*
- Checkbox: "I agree to the Setnayan Vendor Terms"
- Checkbox: "I'll respond to coordinator messages within 24 hours during active engagements"

---

## Phase 2 — Per-Event Intake (after couple confirms booking)

> *Salamat for confirming with Mariel & Joaquin po. Here's what we need from you to lock in your packet for **November 14, 2026** at **Antonio's Garden, Tagaytay**.*
>
> *Most fields are pre-filled from the couple's plan — you just confirm or adjust. Anything in **bold** is a write that flows back to the master plan, so the coordinator and other vendors stay in sync.*

### Section A — Confirm the basics (pre-filled, you confirm)

These are pulled from the couple's event. If something looks off, flag it — don't silently change it. The coordinator gets pinged.

| Field | Pre-filled value | Your action |
|---|---|---|
| Event date | 2026-11-14 (Saturday) | Confirm / Flag |
| Reception venue | Antonio's Garden, Tagaytay | Confirm / Flag |
| Reception start time | 18:30 | Confirm / Flag |
| Reception end time | 23:00 | Confirm / Flag |
| Cocktail hour | 18:30–19:30 (60 min) | Confirm / Flag |
| Last call (suggested) | 22:30 | Confirm / Flag |
| Adult guest count | 218 | Read-only (caterer/coordinator owns) |
| Child guest count | 12 | Read-only |
| Vendor allowance | 24 | Read-only |
| Allergens that affect drinks | nut allergy: 1 severe; halal: 3 | Read-only |

### Section B — Your service shape (you write this)

- **Confirmed call time at reception** *(required)*
  - Suggested: 16:30 (2h before reception start, accounts for 45-min travel from Manila)
  - Your value: __________
- **Number of bar stations** *(required)* — 1 / 2 / 3
- **Number of bartenders on-site** *(required)*
- **Setup window** *(required)* — start time → end time
- **Breakdown window** *(required)* — start time → end time
- **Last call time confirmed** *(required)*

### Section C — Drink program (couple has drafted; you refine)

The couple has written a first draft. Your job is to fact-check, recipe-test the signatures, and lock the procurement list.

- **Service style** — pre-filled: Open bar
  - Confirm / Adjust
- **Signature cocktails** — pre-filled list:
  1. "Mariel's Mango Spritz" — gin, mango, calamansi, soda
  2. "Joaquin's Old Fashioned" — Suntory whisky, demerara, orange peel
  - Per-cocktail action: **Confirm recipe** / **Propose adjustment** / **Flag allergen issue**
  - Recipe testing date proposal: __________
- **Beer brands** — pre-filled: San Miguel Pale Pilsen, San Mig Light, Asahi
  - Confirm / Adjust quantities
- **Wine preferences** — pre-filled: Spanish tempranillo (red), Sauvignon Blanc (white)
  - Confirm specific labels you'll source
- **Spirits list** — pre-filled: whisky, gin, rum, vodka
  - Confirm specific labels you'll source
- **Mocktail options** — pre-filled: calamansi cooler, dalandan fizz
  - Confirm / Add
- **Do not serve list** — pre-filled: Jagermeister, no shots after 22:30
  - Confirm / Adjust

### Section D — VIP / Salu-salo treatment

> *The couple has 6 Principal Sponsors and 2 sets of parents. Some couples set up a small whisky/wine welcome pour for them at arrival. Confirm if this is happening — but you'll only get a count, never names.*

- **VIP welcome pour at cocktail hour?** — Yes / No
  - If Yes:
    - Count of VIP servings: __________ (pre-filled: 12)
    - Treatment description: __________ (pre-filled: "welcome whisky pour for Ninongs/Ninangs and parents")
    - Your confirmation: Confirm / Adjust

### Section E — Logistics with the venue

These are from the venue contract. If anything is unclear, the coordinator (Pat Esguerra, +63 917 000 0008) is your point of contact.

| Field | Pre-filled value | Your confirmation |
|---|---|---|
| Power available | Venue + 1 generator | Confirm sufficient / Need more |
| Allowed dB | 95 | Acknowledge |
| Water access | Kitchen tap, ~8m from bar zone | Confirm acceptable |
| Ice supply | Venue provides 50kg, bar brings overflow | **Confirm overflow plan (kg)** |
| Glassware responsibility | TBD — you write this | **Bar provides / Caterer provides / Venue provides / Split** |
| Corkage on outside alcohol | None — venue allows outside | Acknowledge |
| Setup access window | 13:00–18:30 (5h 30min before reception) | Confirm |
| Vendor lot location | Adjacent to kitchen entrance | Acknowledge |

### Section F — Procurement & consumption estimate (you write this)

Based on the adult count (218), vendor allowance (24 non-alcoholic), and the 4-hour service window.

- **Estimated beer bottles** — number
- **Estimated wine bottles** — red / white split
- **Estimated spirits (liters)** — by spirit
- **Mocktail servings projected** — number
- **Headcount lock date for procurement** — date, default 2026-11-04 (10 days out)

### Section G — Coordination contacts (read-only)

- Coordinator: Pat Esguerra (Lakad Wedding Coordination) — +63 917 000 0008 — *your day-of point of contact*
- Caterer: Cely Ramos (Lutong Hapag) — +63 917 000 0003 — *for ice, glassware, and wine pairing coordination*
- Reception venue manager: Mr. Ben Reyes — +63 920 000 0002 — *for power, water, and access*
- Couple: visible only via coordinator. Don't message the couple directly during active engagement. Salamat po.

### Section H — Final confirmation

- Checkbox: "I confirm the above and agree to receive change-update messages from Setnayan when the couple, coordinator, or other vendors update relevant fields. I'll respond within 24 hours."
- Checkbox: "I understand my packet is need-to-know — I won't see the full guest list, the entourage list, or the photographer's shot list, and that's by design."
- Submit button: **Lock in packet**

> *Once you submit, the coordinator gets a notification and you'll start receiving change-update messages whenever something on the master plan affects you. Salamat po — see you in November.*

---

## What the form does NOT ask for

(For reviewers and reviewers' reviewers — these are deliberate omissions, not oversights.)

- **No individual guest names.** Aggregate counts only.
- **No entourage list.** Mobile bar doesn't pour by role.
- **No shot list, no playlist, no processional order.** Wrong vendor.
- **No couple's bio or special acknowledgments.** That's the host's domain.
- **No financial info beyond the bar's own pricing.** Other vendors' payments are not visible.
- **No couple's direct contact** during active engagement. The coordinator is the routing layer.
- **No password or banking info collected.** Reservation fee is paid out-of-band; Setnayan V1/V2 doesn't process payments per V1 spec section 5.1.4.

## Form length notes

Phase 1 is ~30 fields, ~8 minutes. Phase 2 is ~25 fields with most pre-filled, ~5–10 minutes per event. This is intentionally lighter than the caterer intake (which has line-item menu and headcount-lock workflows) and heavier than the photographer intake (which has fewer config knobs). The bar's complexity sits in the drink program section; everything else is template.
