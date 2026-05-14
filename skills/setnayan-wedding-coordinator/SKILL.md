---
name: setnayan-wedding-coordinator
description: Use this skill when working on Setnayan (the all-in-one Wedding & Event OS for the Philippines) or any Philippine wedding coordination app or workflow that needs to sync information between couples, planners, and vendors. Trigger this skill any time the user mentions Setnayan, Filipino weddings, principal sponsors, ninongs/ninangs, vendor coordination, wedding-day run-of-show, vendor briefing packets, wedding budget tracking in PHP, change propagation across vendors, or syncing information across multiple wedding vendors — even if they don't explicitly name the skill. Also use it when designing data models, user flows, copy, or APIs for any multi-stakeholder wedding planning system, or when generating Philippine-wedding artifacts like run-of-show timelines, vendor info packets, Catholic wedding checklists, or coordinator dashboards.
---

# Setnayan Wedding Coordinator

This skill helps you design and build the coordination layer of a Philippine wedding planning system — the part that ties together the couple, the planner, and every vendor so that one source of truth flows in both directions: from the couple's plan out to each vendor, and from each vendor's commitments back into the master plan.

It is opinionated about three things, and these opinions are load-bearing — most of the patterns below only make sense if you accept them:

1. **The Philippines is the home market.** Defaults assume Catholic weddings, principal/secondary sponsor roles (Ninongs/Ninangs), PHP currency, and the realities of planning across Viber/Messenger/Google Sheets that Filipino couples actually live with.
2. **Vendors and the couple share one event, not separate ones.** The data model assumes a single canonical event that everyone reads from. No vendor maintains a private spreadsheet that the planner re-types. Every artifact — a timeline, a packet, a budget view — is a *projection* of the canonical event for a particular audience.
3. **Information flows on a need-to-know basis.** A florist does not need the photographer's shot list. A photographer does not need the florist's stem count. Each party gets a packet curated to what they actually need, but every packet is generated from the same source. The mapping of who-needs-what lives in `references/sync-matrix.md` and is the single most important file in this skill.

## When to reach for this skill

Use this skill when:
- Working on Setnayan App, the Setnayan Wedding & Event OS, or any PH wedding planning product
- Designing vendor onboarding, vendor briefing, or vendor change-propagation flows
- Generating a wedding-day run-of-show timeline that pulls from multiple vendors
- Producing per-vendor info packets, change update messages, or weekly status digests
- Modeling event/vendor/task data for a wedding coordination system (schemas, APIs)
- Writing copy or UX flows that touch PH-specific concepts (entourage, sponsors, Catholic ceremony requirements)
- Reviewing or extending the Setnayan strategy and engineering documents
- Planning the V2 vendor marketplace ("list free, earn when chosen") flows

If the request is for a generic checklist or a non-PH wedding, this skill still helps — just mute the PH-specific defaults the user signals they don't need.

## The shape of a Setnayan wedding

Every Setnayan wedding decomposes into the same primitives. Use this model when designing data, generating artifacts, or reasoning about sync. The rest of this skill assumes you have these in your head:

**Event** — the wedding itself. Has a date, a primary venue, a couple, an estimated guest count, a religion (default: Catholic), and a target budget in PHP.

**Parties** — the people and businesses connected to the event:
- *Couple* (Partner A, Partner B): the principals, both with full co-admin access on the app
- *Helpers* (up to 3): maid of honor, best man, parents — limited admin permissions
- *Wedding coordinator*: professional or family member running day-of operations
- *Vendors*: each is a business with at least one contact person, providing one or more services
- *Guests* with role tags: Principal Sponsor (Ninong/Ninang), Secondary Sponsor (candle, veil, cord), Entourage (Best Man, Maid of Honor, Bridesmaids, Groomsmen, Flower Girl, Bearer), Family, Regular Guest, VIP

**Services** — what a vendor commits to deliver. A single vendor can have multiple services (a videographer who also does same-day-edit). Each service has: type, deliverables, on-site call time, on-site duration, location(s), point-of-contact, payment status, and a list of inputs it needs from other parties.

**Milestones** — dated points on the planning timeline (12-month, 6-month, 3-month, 1-month, 1-week, day-of). PH defaults are pre-loaded and assume a 12-month engagement-to-ceremony arc, which is the modal Filipino case.

**Run-of-show segments** — the actual minute-by-minute on the wedding day. Each segment has a start time, duration, location, lead vendor(s), supporting vendor(s), and notes. The run-of-show is the highest-leverage artifact this skill produces — every vendor reads from it, every change ripples through it.

**Sync edges** — pieces of information that *must* travel between two parties when one of them changes. The canonical list is in `references/sync-matrix.md`. When you propose new fields or new vendor types, propose corresponding sync edges.

If you need the actual JSON shape of these primitives, read `references/data-model.md`. There's also a worked example in `assets/sample_event.json` that's useful to reason against.

## What this skill produces

The skill helps you produce four core coordination artifacts. Their formats live in `assets/` and the deterministic generation logic lives in `scripts/`. The summaries below are orientation; read the templates and scripts when you need the exact shape.

### 1. The master run-of-show timeline (`assets/timeline_template.md`)
A single document organized by time-of-day with columns for time, segment, location, lead vendor, supporting vendors, and notes. Philippine defaults include preparation (bride and groom prep separated by location), pre-ceremony photos with sponsors, the entourage processional, the unity rites (coin/arras, veil, and cord ceremonies for Catholic weddings), the kissing of parents' hands, the reception traditions (money dance, garter and bouquet toss, prosperity dance / Pangalay), and the final sendoff. Generate it via `scripts/generate_timeline.py` when you have event JSON; hand-edit when the user wants something custom.

### 2. Per-vendor info packets (`assets/vendor_packet_template.md`)
A vendor-specific brief generated from the master event. **Each vendor sees only the fields relevant to their service** — see `references/sync-matrix.md` for what a photographer vs. a caterer vs. a florist vs. a hair-and-makeup artist actually needs. Every packet shares a header (event date, venue, couple's contact, coordinator's contact, the sliver of run-of-show that involves this vendor) but the body differs sharply. Generate via `scripts/generate_vendor_packet.py`.

### 3. The unified budget tracker
Always PHP-denominated. Categorized to the Setnayan standard categories from V1 spec section 5.1.4 (Venue, Catering, Photography, Videography, Wedding Coordinator, Stylist, Hair & Makeup, Band/DJ, Host, Attire, Rings, Stationery, Souvenirs, Transportation, Miscellaneous). Tracks payment milestones (Reservation, Down Payment, Balance Due, Paid in Full) per vendor. The budget projection of an event is the simplest derived view — just a roll-up by category — but it's the one couples and planners check most often.

### 4. The Catholic Filipino planning checklist
Pre-loaded with PH-specific tasks: pre-Cana / Discovery Weekend, banns of marriage, parish requirements (Baptismal Certificate, Confirmation Certificate, CENOMAR — Certificate of No Marriage), confirmation of Ninongs/Ninangs, choosing Secondary Sponsors, marriage license application, civil registrar requirements. Couples on shorter or longer arcs collapse or expand the milestones, but the PH-specific tasks are always present for Catholic weddings. Skip the parish requirements for civil weddings; keep the marriage license + civil registrar tasks.

## How the sync model works

The hardest design problem in a wedding coordination app is *change propagation*. The ceremony moves 30 minutes. The guest count jumps from 180 to 240. The venue swaps the day before. Each of these has a different blast radius and has to reach a different subset of vendors with the right framing and the right level of urgency.

This skill bakes in three propagation rules. Internalize them — most of the value of this skill lives here, not in the boilerplate.

### Rule 1 — One canonical event, derived views.
Every artifact (timeline, packet, budget) is *derived* from the canonical event object. Nothing ever lives in a packet that doesn't live in the event. This means a change in the event automatically updates every downstream view; vendors don't get out-of-sync packets.

In practice: when you generate a packet, never let the packet introduce a new fact. If a packet "needs" a field that isn't in the event, add the field to the event first.

### Rule 2 — Need-to-know packets, never the whole event.
A vendor only sees fields tagged for their service type. The photographer's packet includes the entourage size and shot list, but not the catering count. The caterer's packet includes the head count, dietary restrictions, and the meal-service window, but not the playlist.

`references/sync-matrix.md` is the source of truth for which vendor sees which field. When you encounter a vendor type the matrix doesn't cover, **propose new entries to the matrix before generating the packet** — don't guess.

This also means privacy-by-design: a guest's medical/dietary info goes only to vendors who actually serve food, never to the photographer.

### Rule 3 — Explicit change events with diffs.
When a field changes, the system computes which vendors are affected (using the sync matrix) and produces a per-vendor diff message. Rather than re-sending the whole packet, the diff says: *"The ceremony moved from 4:00 PM to 4:30 PM. This affects your call time (now 1:30 PM, was 1:00 PM) and your access window for the reception venue (now starts 6:00 PM)."*

The script `scripts/compute_sync_diffs.py` does this calculation. It takes a *before* and *after* snapshot of the event JSON and outputs a list of `{vendor_id, message}` pairs. The diff message is in Setnayan voice (warm, Filipino-comfortable, practical) and never assumes the vendor has the old packet open in another tab.

These three rules together let you build coordination flows that feel instant and never leave a vendor working from a stale brief.

## Voice and tone (Setnayan brand)

When you generate user-facing copy — packet headers, vendor messages, push notifications, checklist titles — write in Setnayan's voice. The Setnayan brand voice (full guide in `references/setnayan-brand-voice.md`) is:

- **Warm and Filipino-comfortable**, not corporate. "Plan less. Live more." not "Optimize your wedding workflow."
- **Mixed Filipino-English is fine and often preferred.** "Salamat po, here's your packet for the big day." A pure-English version stays readable.
- **Practical, not aspirational.** Filipinos planning weddings are busy and stressed. Tell them what to do, not how to feel.
- **Never twee, never American-wedding-glossy.** No "your magical day," no "the wedding of your dreams." Filipino weddings are family events. The voice respects that.
- **Po and opo, used naturally.** When addressing a vendor or a Ninong/Ninang, "po" is appropriate. Don't sprinkle it for flavor; use it where it would actually be used.

If you find yourself writing something that sounds like a US wedding-planning startup, stop and rewrite.

## How to work through a typical task

When the user asks for something this skill helps with, work through these steps. They are listed in order; later steps assume earlier ones happened.

1. **Locate the canonical event data.** Either the user gives it to you, or `assets/sample_event.json` is the example to reason against. If neither, ask for the date, venue, religion, estimated guest count, and the list of vendors with their service types. Don't proceed without these.

2. **Identify the artifact(s) to produce.** Timeline? Per-vendor packet? Budget view? Change diff message? Often more than one. State this back to the user before generating.

3. **Read the relevant template and reference.** Don't invent a format from scratch — there's almost always an existing template in `assets/`. For per-vendor work, read `references/sync-matrix.md` *first*, because it tells you which fields belong in the packet. For ceremony flow questions, read `references/ph-wedding-glossary.md`.

4. **For per-vendor artifacts, check the sync matrix.** Don't guess what a vendor needs to see. The matrix lists what each vendor type actually consumes. If the user is working with a vendor type the matrix doesn't cover, propose new entries to the matrix in your reply before producing the packet — and offer to add them to the file permanently.

5. **Use the scripts when the work is mechanical.** `generate_timeline.py`, `generate_vendor_packet.py`, and `compute_sync_diffs.py` are deterministic — when the input is event JSON and the output is a known artifact, prefer the script over generating from scratch. If the script doesn't exist or doesn't fit, write one and add it to `scripts/` for next time. We'd rather pay a small one-time cost than re-derive the same logic on every task.

6. **Always check PH context.** If the user said "Catholic," default to PH Catholic norms unless they say otherwise. If they said "civil wedding," skip the parish requirements but keep marriage license tasks. If the venue is an outdoor garden in Tagaytay, note the rain plan — PH weddings have weather risk that California weddings don't.

7. **Check sync implications when something changes.** If the task involves a change — moving the ceremony, adding a vendor, changing the venue — explicitly call out the propagation: which vendors are affected, what each one needs to know. Use `compute_sync_diffs.py` if you have before/after JSON.

## Anti-patterns

Things this skill explicitly avoids. If you catch yourself doing one of these, stop and reconsider.

- **Generic American-wedding-blog content.** This is a PH product. Default to PH norms. Mentions of "the bride's father walking her down the aisle" without acknowledging that Filipino Catholic ceremonies have a different processional structure (both parents often escort each partner) are wrong.
- **Treating vendors as interchangeable.** A florist, a photographer, and a hair-and-makeup artist need wildly different information. The sync matrix exists because you cannot one-size-fits-all the packet.
- **Recreating the same helper script across tasks.** If a task needs to generate a timeline from event JSON, use `scripts/generate_timeline.py`. If it doesn't exist, write it once and use it.
- **Hidden hardcoded times.** PH weddings *do* have a default rhythm (4:00 PM ceremony, 6:00 PM reception is a common pattern), but never bake those into a generated artifact without flagging them as defaults to be confirmed by the couple or planner.
- **Forgetting payment tracking.** A wedding budget that doesn't track Reservation / Down Payment / Balance / Paid is half a budget. PH vendors typically take a reservation fee, then a down payment, then a balance — the tracker has to follow that.
- **Leaking guest PII to vendors who don't need it.** Photographers don't need dietary restrictions. Caterers don't need shot lists. The sync matrix is also a privacy policy.
- **Forgetting Setnayan doesn't process payments in V1.** Setnayan does NOT take couple-vendor payments or booking commissions in V1, per the V1 spec section 5.1.4. The budget tracker is for *tracking*, not for collecting. Don't generate artifacts that imply otherwise.

## Files in this skill

```
SKILL.md                              ← you are here
references/
  ph-wedding-glossary.md              ← terminology, sponsor roles, ceremony flow
  vendor-types.md                     ← PH vendor categories and what each delivers
  sync-matrix.md                      ← who-needs-what-from-whom (canonical)
  data-model.md                       ← suggested JSON schema for event/vendor/task
  setnayan-brand-voice.md                 ← brand voice reference
scripts/
  generate_timeline.py                ← event JSON → run-of-show timeline (markdown)
  generate_vendor_packet.py           ← event JSON + vendor_id → per-vendor packet
  compute_sync_diffs.py               ← diff event JSON before/after → per-vendor messages
assets/
  timeline_template.md                ← master timeline format
  vendor_packet_template.md           ← per-vendor packet format
  sample_event.json                   ← worked example to reason against
```

When you read this skill for the first time, peek at `references/sync-matrix.md` and `assets/sample_event.json` before doing anything else. Together they make the rest of this skill make sense in concrete terms.
