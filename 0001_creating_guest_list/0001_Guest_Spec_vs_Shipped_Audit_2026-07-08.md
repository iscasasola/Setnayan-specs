# 0001 Guests — Spec vs. Shipped Audit · 2026-07-08

> **This is the current-truth "newer sibling" for the guests feature.** It supersedes stale facts in
> [`0001_creating_guest_list_result.md`](0001_creating_guest_list_result.md) and the archived
> [`0001_creating_guest_list.md`](0001_creating_guest_list.md) stub. Source-of-truth order still holds:
> live site → shipped code (`apps/web` @ `origin/main`) → prod DB → this doc → older specs.
> Grounded against a fresh `origin/main` clone on 2026-07-08.

## Verdict

The core 0001 guest list shipped faithfully. But the *feature* has grown into a **~15-surface guest
lifecycle system** that no single spec describes — and the **0001 result doc is materially inaccurate**
about how it was built (three verifiable factual errors, corrected there 2026-07-08). The spec is the
archive; the code is well ahead of it.

## 1. Core spec — honored ✅

Add/edit/soft-delete/RSVP · side coding · additive filter/sort/search · **plus-one as a first-class row**
(own `qr_token`, full/limited mode, TBA allowed) · CSV import with dedup · smart PH-aware title-casing +
`normalizeGuestName()` hygiene · 3-tier duplicate detection · photo-first importance-ordered tiered layout
(desktop table / mobile grid) · guest photos + `guest_face_enrollments`. All present and matching.

## 2. The four "out of scope / deferred" items — where they landed

| Deferred in 0001 | Status now |
|---|---|
| Sending invitations | **Reframed & shipped** — one shareable **join link + QR** (`invite/`, `event_join_tokens`, regenerate-to-revoke) + per-guest magic-link email (`inviteGuestByEmailAction`) + save-the-date (`std_sent_at`). Not the per-guest blast the spec imagined. |
| Magic-link guest RSVP page | **Shipped elsewhere** — guest side lives in 0002 (`/{slug}?invite=`) on a `guest-session` JWT cookie (60-day), not a Postgres session. |
| Seating chart / table assignments | **Shipped** (0008) — `event_seat_assignments`, `seating_priority`, auto-arrange; guest detail feeds `attire` to the 3D seat plan. |
| Address book / contact import | Still deferred — manual + CSV only. |

## 3. Shipped far beyond 0001 (undocumented on the 0001 spec)

| Area | What shipped | Real owner spec |
|---|---|---|
| Day-of check-in desk | Live jsQR scanner + manual search, headcount, undo; `guest_checkins` (couple+coordinator RLS) | 0031 / 0000 kiosk |
| Souvenir table | Second scan station; `guest_souvenir_claims` | net-new |
| Tea-ceremony order | Chinese 敬茶 printable serving order; `seniority_rank`/`relation`; ceremony-gated | event-type expansion |
| Mind-map view | Interactive guest relationship graph, inline record create | net-new |
| Custom groups | `guest_groups` + memberships CRUD, colored sidebar | beyond `custom_tags` |
| Self-join reconciliation | "Unlisted guests" Keep/Remove/**Link-merge**; `guest_claims`, `entry_source` | 0002 join flow |
| Multi-select bulk ops | Bulk role/side/group/soft-delete SelectionBar | net-new |
| Multi-role per guest | `extra_roles[]` + singleton CHECK | net-new |
| Pax lock / auto-finalize | `guest_count_locked_at` guard trigger + adaptive-pricing meter | Papic / pricing |
| Biometric governance | `faceblock_enabled`, `face_recognition_excluded`, `ugc_terms_accepted_at` | Papic / RA 10173 |
| Person-spine | `person_id` → cross-event identity | 0000 identity |
| Role taxonomy | `guest_role` enum **18 → ~32** (bride/groom, parents/immediate family, generic host/vip/family/helper, Muslim `wali`/`witness`/`imam`/`wakil`) | genericization |
| Read-only guest API | `GET /api/v1/events/:eventId/guests`, bearer + `guests.read`, member-gated | 0033 Phase 2 (tracked) |

## 4. Drift & inaccuracies (corrected 2026-07-08)

The **result doc** (`0001_creating_guest_list_result.md`) asserted three facts that never matched the repo —
corrected in place 2026-07-08:

1. Migration `20260508120000_initial_guest_list_schema.sql` → real baseline is
   **`20260513010000_iteration_0001_guests.sql`**.
2. RLS via an **`is_couple_of(event_id)` helper** → the helper **does not exist anywhere** in the codebase
   (`grep` = 0 hits). Guest RLS has been **Pattern B** from day one:
   read = `event_id IN (SELECT public.current_event_ids())`; write = `event_members WHERE member_type='couple' OR public.is_admin()`.
3. Enum `wedding_role` → real type name is **`public.guest_role`**.

These read like the result doc was written from a pre-implementation draft that changed during the build and
was never reconciled.

**Also a real (defensible) deviation, not just a doc error:** 0001 § Privacy says a guest can read "their own
row" via RLS. Shipped: accountless guests never authenticate to Postgres — self-access runs through
service-role server actions gated by the `lib/guest-session.ts` JWT cookie. Compliance is **enforced in app
code, not RLS.** Worth an explicit owner acknowledgement of the shifted posture.

## 5. Flags for owner (surfaced, not decided)

- **Event-type expansion is already live in the guest model** — Muslim Nikah roles + Chinese tea-ceremony
  ordering ship today. Consistent with genericization, but not blessed against the "V1 surface is weddings"
  framing. Confirm in-scope.
- **Guest API** — `GET /api/v1/events/:eventId/guests` is documented as a 0033 Phase-2 read-only partial
  (`App_Build_Status.md`), member-gated, not public → **reconciled, not a lock violation.** Noted here so a
  cold read of the "No public API endpoints in V1" lock doesn't re-flag it.

## Provenance

Audit run 2026-07-08 against a shallow `origin/main` clone (repo pushed 2026-07-08). Two parallel code sweeps
(UI surfaces + data model) plus direct verification of the `is_couple_of` phantom, baseline migration name,
`guest_role` enum name, and the guest API auth posture.
