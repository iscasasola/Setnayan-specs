# Phase 2 (People Graph) — Data-Privacy Counsel Review Brief

**Date:** 2026-07-05
**For:** PH data-privacy counsel (RA 10173 · National Privacy Commission)
**From:** Setnayan — operating as **SETNAYAN SOFTWARE DEVELOPMENT SERVICE**, a sole proprietorship of Indalecio S. Casasola II (DTI Business Name No. 8297508, national scope, valid 25 Jun 2026 – 25 Jun 2031)
**Data Protection Officer:** Indalecio Sacdalan Casasola II
**Purpose:** A focused sign-off review before activating the "People / connections" features in production. **All features described here are already BUILT but sit behind OFF feature flags — nothing below is live or storing user data yet.** We are asking counsel to confirm the model is compliant (or flag changes) before we flip the flags.

> This brief is deliberately short. The full design is in `03_Strategy/People_Graph_and_Lifelong_Identity_2026-07-04.md`; ask for it if you want depth. Read time: ~10 minutes.

---

## 1. What Phase 2 does (one paragraph)

Setnayan is a Philippines-first life-events platform (weddings first). Today each **person** already has a durable profile ("person node") — an adult account holder, or a guest a host added. Phase 2 lets people **connect** to each other (family, godparents/ninong-ninang, friends), and uses those connections for two payoffs: (a) **life stories** — a photo/clip you appear in shows up in *your* archive, not only the host's; (b) **trusted-circle vendor recommendations** — "vendors people in your circle actually used and rated." It is **not** a social network — the graph is read privately for each user, never broadcast.

## 2. Exactly what data is stored

| Data | Where | Sensitivity |
|---|---|---|
| Person node — name, email, phone, optional photo, optional birth date | `people` | Personal info |
| **Connection edge** — person A ↔ person B, relationship type (spouse/parent/sibling/child/godparent/friend), pending/confirmed | `person_connections` | **Relationship data** |
| **Life-story item** — a *reference* (pointer) to a photo/clip/editorial the person appears in — **no image bytes stored here** | `person_story_items` | Media association |
| Vendor recommendation signal | computed on the fly, **aggregated** | Commercial + relationship |

**No biometric data is used or stored for any of this.** (See §5.)

## 3. Guardrails already built in (structurally, not just policy)

- **Adults-first.** Nothing involving minors is enabled. Children in a family tree = a *future* phase, explicitly out of scope here.
- **Mutual confirmation.** A connection only becomes real when the *other* person confirms it. No one is added one-sided.
- **Private, never broadcast.** Row-level security limits every edge to the two people in it. There is no "browse other people's connections," no "people you may know."
- **Minimum-count aggregation (min-N ≥ 5).** Vendor recommendations only ever show *aggregate* counts above a threshold — never "person X used this vendor" unless X explicitly opted to vouch.
- **Trust is earned, not bought.** Recommendations read only real reviews/vouches — never bookings, never paid placement.
- **References, not copies.** A life-story item is a pointer to media held once in our object storage — deleting/hiding removes the pointer, not the original, and a person can hide anything from their own story.
- **No cross-event face recognition.** Media is associated to people by manual tags / QR / confirmed identity only — never by scanning faces across events. (Locked internal rule.)

## 4. The specific questions we need answered

1. **Consent** — Is confirmed opt-in (the other person accepting a connection request) sufficient lawful basis for storing a connection edge? Any specific consent language you'd require?
2. **Right to erasure (RA 10173 §16)** — Our design lets a person delete their account, their connections, and hide/remove their life-story items. Is our delete/hide model sufficient? Any retention limits we must set?
3. **Cross-person visibility** — To *show* a confirmed connection, person A must see person B's name (and vice-versa). Is mutual confirmation adequate consent for that name visibility? Any limits (e.g., name only, no contact details)?
4. **Life stories** — A guest's photo (taken at someone else's event, with event photo-consent) appearing in that guest's own archive: is the existing event-level photo consent enough, or do we need a separate consent for cross-event personal archiving?
5. **Minors** — We are keeping all of this adults-only for now. Please confirm the adults-only boundary is the right line, and outline what a compliant *future* minors/guardianship design would need (so we build it right later).

## 5. What is explicitly NOT in this review

- **No biometric / facial-recognition** feature is part of Phase 2. (A separate, dormant, opt-in, on-device face-tagging feature exists behind its own flag; it is **not** in scope here and would get its own DPIA.)
- **No pricing / payment** changes.
- **Minors, guardianship, and the "legacy/inheritance" (memorialization) layer** are a later phase and are **not** being activated now — but §4.5 asks for forward guidance.

## 6. What we're asking for

A written **yes / yes-with-changes** on the model in §1–3, and answers to §4. Once we have it, activation is a configuration flip — the code is done and tested. Turnaround on our side is immediate.

---

*Prepared as a plain-language brief; the underlying schema, RLS policies, and feature flags can be shown to a technical reviewer on request.*
