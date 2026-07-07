# Onboarding Map — every birth flow, existing and needed (2026-07-04)

> **Provenance:** Generated 2026-07-04 by a multi-agent audit of `origin/main` (4 audience inventories → code-verified coverage derivation; 53 flows found). Companion docs (same date, in progress): Entity Map & Hardcode Audit · Data Flow Map.
> **Orchestrator correction:** any claim below that face matching is dormant for lack of `NEXT_PUBLIC_FACE_MODEL_URL` is STALE — that env var was restored in Vercel Production and bundle-verified 2026-07-03 (see DECISION_LOG); env values are invisible to a code-only audit.


## 1. The rule

Every entity birth (a new user, event, shop, seat, booking) and every claimable role-edge (guest joins an event, teammate joins a shop, co-host accepts an invite) needs exactly **one** onboarding flow that owns it — no orphan births, no duplicate doors.
Onboarding **content** should live in DB rows — `event_type_vocab`, `event_type_profiles`, `event_type_onboarding`, `onboarding_refinements`, the service taxonomy, the Song Bank — so launching a new event type or tweaking a question is **data an admin edits, not code a developer ships**.
The generic engine already works this way (`/onboarding/[type]` reads everything from DB with TS fallbacks); the gaps below are mostly empty tables, not missing routes.

## 2. Existing onboardings

### Couples / hosts

| Flow | Entry | Creates (rows + edges) | Data-driven? | Status |
|---|---|---|---|---|
| Wedding onboarding wizard (V2) | `/onboarding/wedding` (`app/onboarding/wedding/page.tsx`; routed via `event_type_vocab.onboarding_href`) | `events` + 2 seed `guests` (bride/groom) + `event_song_picks` + `event_vendors` shortlist; edges: `event_members` 'couple' + first `event_moderators` host (actions.ts:525,554) | Heavily: faiths, refinement cards (45/304 DB rows), taxonomy tiles, Song Bank, live catalog pricing, real vendor results; screen sequence/copy hardcoded | live |
| Anonymous-draft + convert-in-place claim | Same route, no login; claim at `/signup` (signup/actions.ts:102-140) | Anon `auth.users` + placeholder `public.users` + full commit rows; claim attaches email/password to the SAME uid — zero-merge, event was always theirs; vendor inquiries deferred via `pending_inquiry_dispatch` | Flag-gated (`lib/anon-onboarding.ts`); inherits parent flow's data-drivenness | live (4 anon users in prod) |
| Generic per-type onboarding (0053) | `/onboarding/[type]` for debut · gender_reveal · birthday · celebration · travel · corporate · tournament · christening | `events` (wedding columns NULL); edge: `event_members` 'couple' (commit-event.ts:100) | **Most data-driven flow**: vocab, profiles, per-type questions from `event_type_onboarding` (admin-editable, zero-deploy), scoped taxonomy tiles | live · **zero usage, 0 content-override rows** |
| Simple Event | `/onboarding/simple` | `events` (name+date only); edge: `event_members` 'couple' | Gate DB-driven (vocab + `marketplace_enabled`); 2-field form hardcoded by design | live · 0 rows yet |
| Create-event picker + inline fallback | `/dashboard/create-event` | Routes to the above; inline form (`createWeddingEvent`) is the degrade path — effectively dead with exp-quiz flag ON | Type roster + routing fully DB-driven (`getCreatableEventTypes`); venue/sub-type consts hardcoded | live |
| Co-host / coordinator invite (0048 multi-host) — *verified in code; was missing from inventory* | Invite from `/dashboard/[eventId]/hosts` (actions.ts:130); accept at `/host/accept/[token]` (actions.ts:70-100) | `event_moderators` invite row (role_subtype, invitation_email/token); accept stamps user_id + upserts `event_members` **'coordinator'** | Role subtypes + permission templates in code | live |
| Vendor-invite claim into couple's plan | `/vendor-invite/[slug]` (shortlist QR) | `event_vendors` shortlist edge; 0-event couples routed through create-event with `?next=` threaded | Vendor from `vendor_profiles.business_slug`; `?et`/`?cat` validated against DB vocab/taxonomy | live |
| Customer signup | `/signup` | `auth.users` + `public.users` (trigger); referral attribution; guest-session linkage | Mostly code; email blacklist DB-driven | live |
| Setnayan AI activation | `/dashboard/setnayan-ai` | `service_orders` → `user_ai_subscription` entitlement on payment confirm | Price from admin catalog; gate `platform_settings` | **partial — DORMANT in prod** (flag NULL, 0 rows) |

### Guests

| Flow | Entry | Creates | Data-driven? | Status |
|---|---|---|---|---|
| Event QR join (signed-in, name-as-answer-key) | `/join/[eventId]?token=` + `/[slug]/invite` | `event_members` 'guest' (guest_id-bound); no-match → new `guests` row + couple claim notification | Role picker from `event_type_profiles.role_set_key`; token vs `event_join_tokens` | live |
| Event QR join (accountless self-join) | Same JoinFlow → `selfJoinAction` | `guests` row or name-match bind + signed guest-session cookie; no `event_members` | Same DB-driven role set; 1000-row ceiling | live |
| Guest → account claim (magic link) | Email in JoinFlow / `/[slug]` → `/join/[eventId]/connect` | Real `auth.users` + `event_members` upsert (guest_id-bound) | DB-keyed binding (guests.email, cookie) | live |
| Guest session → account link on signup/login | Ordinary `/signup` `/login` (`lib/link-guest-account.ts`) | `event_members` upsert only; hijack-proof unique index | Cookie JWT + DB re-validation | live |
| Personal invite redeem | `/[slug]/redeem` | `scan_events` only; signs guest cookie | Fully DB-resolved (slug, qr_token) | live |
| Plus-one name capture | `/[slug]/welcome` | UPDATEs the TBA `guests` row | Pure DB-state gate | live |
| RSVP self-service + selfie enrollment | RSVP widget on `/[slug]` | UPDATEs `guests`; `guest_face_enrollments`; couple notification | Surface gating via `event_type_profiles`; enums code | live |
| Day-of face enrollment (3-shot) | `/[slug]` + `/[slug]/hub` cards | Up to 3 `guest_face_enrollments` (consented) | Write shipped; **matching dormant** (no `NEXT_PUBLIC_FACE_MODEL_URL`) | partial |
| Seat Pass claim hop | `/[slug]/seat/claim?t=` | `scan_events` + cookie | Fully DB-decided guest-vs-table branch | live |
| Day-of hub first-open | `/[slug]/hub` | Nothing — routing surface | Panels gated by profiles + entitlements | live |
| Papic seat claim (crew) | `/papic/claim/[token]` → RPC | `paparazzi_seats.claimer_user_id`; optional anon auth user | Token = DB capability; anon flag-gated | live |
| Papic hybrid QR forwarder | `/papic/join/[token]` | Nothing — resolves + forwards | Two indexed DB lookups | live |
| Papic Limited guest camera | `/papic/me/[token]` | Lazy system-minted `paparazzi_seats` (guest_id-bound) | Snapshot/caps/payment all DB rows | live |
| Papic guest camera (invite-cookie walk-in) | `/papic/guest` | `guests.ugc_terms_accepted_at`; quota RPC | Entitlement + quota + block-list DB reads; **requires guest cookie** | live |
| Kwento columnist assignment | `/dashboard/[eventId]/alaala/assignments` | `kwento_assignments` (guest→moment edge) + email nudge | 10 locked moments in code; fulfillment FK deferred | live (tail unshipped) |

### Vendors

| Flow | Entry | Creates | Data-driven? | Status |
|---|---|---|---|---|
| Vendor signup (trigger-only shop) | `/signup?as=vendor` → trigger `handle_new_vendor_user` | `users` (vendor) + bare `vendor_profiles` + founding `vendor_team_members` admin seat | Hardcoded; trigger-only lock honored | live |
| Open-shop wizard | `/open-shop` | `vendor_profiles` find-or-create + basics; optional draft verification app; founder seat upsert | Category enum hardcoded; labels/leaves from taxonomy DB | live |
| Verification application | `/vendor-dashboard/verify` | `vendor_verification_applications` + doc slots + tier history | **Checklist HARDCODED** (8 DOC_SLOTS in `lib/vendor-verification.ts`); structured redesign uncommitted on a branch | live |
| Admin deep-search dossier | `/admin/verify` | `vendor_web_dossiers` | AI path needs `ANTHROPIC_API_KEY` (not on Vercel) — deterministic fallback runs | partial |
| Vendor claim invite (couple/admin/share-link) | `/vendor/claim/[token]` → finalize | `vendor_profiles` reuse/transfer/create; auto-link `event_vendors` + `vendor_follows` | Invite snapshot from DB row | live |
| Admin pre-staged vendor | `/admin/vendors` | `vendor_invites` + unclaimed `vendor_profiles` | Free-form admin input | live |
| Shortlist QR / Locked QR | `/vendor-dashboard/invite` → `/vendor-invite/[slug]` · `/vendor/lock/[token]` | Shortlist edge · atomic booking-lock via RPC | Deal terms validated vs own services + DB vocab | live |
| First service card | `/vendor-dashboard/services/new/[category]` → atomic RPC | `vendor_services` + schedules/slots/add-ons; claim-context wiring to couple | Wire enum hardcoded; labels/caps from taxonomy DB | live |
| Coverage setup | `/vendor-dashboard/services` coverage-actions | `vendor_coverages` → recomputes profile `event_types`/`services` (drives Explore) | **FULLY DB-driven** (taxonomy + vocab + faith_vocab, zero-deploy) | live |
| Calendar setup | `/vendor-dashboard/calendar` | Blocks, pools, FREE external-client imports, waitlist | Tier caps hardcoded; pool model DB | live |
| Team member join | `/vendor-dashboard/team` | `vendor_team_members` + agent scoping + motions | Roles/caps hardcoded | **partial — existing accounts only, no invite link for non-users** |
| Token pack / Subscription first purchase | `/vendor-dashboard/subscription` → RPCs | `vendor_token_purchases` · `vendor_subscriptions` → tier edge on the ORG | Prices from `vendor_billing_catalog` inside RPC | live |
| Performer repertoire intake | `/vendor-dashboard/repertoire` | `songs` find-or-create + `vendor_songs` edge | Fully DB-driven (taxonomy gate + Song Bank) | live |

### Admin / internal / seeding

| Flow | Entry | Creates | Data-driven? | Status |
|---|---|---|---|---|
| Owner bootstrap (§10a) | DB trigger on signup | `users.is_internal=TRUE` for one hardcoded email | Hardcoded SQL literal | live |
| Two-admin privileged grants (§9.1) | `/admin/approvals` | `admin_approval_requests` → flips is_internal / is_team_member / account_type on EXISTING accounts | Hardcoded enum; four-eyes atomic | live |
| Team-pool toggle (§10b) | `/admin/users` | `users.is_team_member` flip + audit | Hardcoded | live |
| Onboarding-config registries | `/admin/onboarding` · `/admin/event-types` · `/admin/taxonomy` | `event_type_vocab`, `onboarding_refinements(+options)`, bg-music settings | This IS the data layer | live |
| Journal vendor-spotlight | `/admin/journal-spotlights` | `journal_vendor_spotlights` (+two-admin gate when sponsored) | Vendors from live rows | live |
| Guided tours (0030) | Auto-mount on dashboards + `/[slug]` | `users.tour_seen_keys` only | **Hardcoded slides** (`lib/tours.ts`); no vendor tour | partial |
| Sample/demo/test seeding | Operator SQL + `/admin/demo-vendors` + `demo_sessions` overlays | Maria & Jose sample event, ~1,500 demo vendors, 3 test accounts, ephemeral demo sessions | Fixture SQL + taxonomy-generated | live (internal) |

## 3. Coverage matrix

Every entity birth / role edge in the schema, one row each. ✅ = one clear owner-flow. ⚠ = covered with a caveat. ⛔ = no flow.

| Edge | Covered by | Status | Gap? |
|---|---|---|---|
| person → user account (customer) | `/signup` | ✅ live | — |
| person → user account (anonymous, mid-onboarding) | anon-draft mint + convert-in-place | ✅ live | — |
| user → event as host (`event_members` 'couple' + first `event_moderators`) | wedding/generic/simple onboardings | ✅ live | — |
| user → event as **co-host/coordinator** (`event_moderators` accept + `event_members` 'coordinator') | `/dashboard/[eventId]/hosts` invite → `/host/accept/[token]` (verified: hosts/actions.ts:130, accept actions.ts:70-100) | ✅ live | — (flow existed but was absent from the inventory — worth remembering it exists before anyone rebuilds it) |
| user → event as guest (`event_members` 'guest') | QR join, signed-in | ✅ live | — |
| accountless person → guest identity (cookie) | self-join · `/[slug]/redeem` · seat claim | ✅ live | — |
| guest → user account claim | magic-link bridge + signup/login linkage (PR-E) | ✅ live | — |
| TBA +1 → named guest | `/[slug]/welcome` | ✅ live | — |
| guest → RSVP state + face enrollment | `/[slug]` RSVP + day-of enroll | ⚠ partial | enrollment rows pile up but auto-tag matching is env-dormant |
| guest → Papic capture identity (seat) | crew claim · Limited lazy seats · guest camera | ⚠ live | walk-up **no-cookie** face camera is spec-only (memory workstream) |
| guest → Kwento columnist | assignment intake | ⚠ live | `kwento_columns` fulfillment table never shipped |
| couple → **wedding** event | `/onboarding/wedding` | ✅ live | — |
| couple → **debut** | `/onboarding/[type]` (vocab enabled=TRUE) | ⚠ live, zero usage | content = TS defaults; 0 `event_type_onboarding` rows |
| couple → **birthday** | `/onboarding/[type]` | ⚠ live, zero usage | same — data gap |
| couple → **christening** | `/onboarding/[type]` | ⚠ live, zero usage | same |
| couple → **corporate** | `/onboarding/[type]` | ⚠ live, zero usage | same |
| couple → **tournament** | `/onboarding/[type]` | ⚠ live, zero usage | same |
| couple → **gender_reveal** | `/onboarding/[type]` | ⚠ live, zero usage | same |
| couple → **travel** | `/onboarding/[type]` | ⚠ live, zero usage | same |
| couple → **celebration** | `/onboarding/[type]` | ⚠ live, zero usage | same |
| couple → **anniversary** | none reachable — vocab seeded `enabled=FALSE` (mig 20261205000000:110) | ⛔ staged | pure data: flip enabled + fill profile/onboarding rows; generic route already handles it |
| couple → **graduation** | none reachable — `enabled=FALSE` (line 112) | ⛔ staged | same, pure data |
| couple → **reunion** | none reachable — `enabled=FALSE` (line 114) | ⛔ staged | same, pure data |
| couple → **gala_night** | staged `enabled=FALSE` (mig 20261229000000) | ⛔ staged | same, pure data |
| couple → **simple_event** | `/onboarding/simple` | ✅ live, 0 rows | — |
| couple → Setnayan AI entitlement | `/dashboard/setnayan-ai` | ⚠ dormant | flag NULL + 6 sign-offs open |
| couple ↔ vendor shortlist edge | `/vendor-invite/[slug]` + dashboard vendors + claim auto-link | ✅ live | — |
| couple ↔ vendor booking-lock edge | `/vendor/lock/[token]` RPC | ✅ live | — |
| person → vendor account + org (`vendor_profiles` + founder seat) | `/signup?as=vendor` trigger + `/open-shop` | ✅ live | — |
| off-platform vendor → claims pre-staged/couple-invited profile | `/vendor/claim/[token]` | ✅ live | — |
| vendor org → **second member** (`vendor_team_members`) | `/vendor-dashboard/team` | ⚠ partial | existing-accounts-only; "ask them to sign up first" (team/actions.ts:118) — no invite link/email |
| vendor → verified state | `/vendor-dashboard/verify` + `/admin/verify` | ✅ live | checklist hardcoded; structured redesign parked on branch |
| vendor → first service card | services builder atomic RPC | ✅ live | — |
| vendor → coverage (drives Explore) | coverage-actions | ✅ live | fully DB-driven — the model to copy |
| vendor → calendar/pools/external clients | calendar actions | ✅ live | — |
| vendor → tier (Pro/Enterprise) + tokens | subscription hub RPCs | ✅ live | — |
| performer (music vendor) → Song Bank | repertoire intake | ✅ live | non-vendor performer entity doesn't exist — no gap |
| person → admin / internal | owner trigger (hardcoded email) + §9.1 two-admin grants + §10b toggle | ✅ live | existing-account-only by design; no admin signup form anywhere (correct) |
| first-run orientation (tours) | guided tours 0030 | ⚠ partial | **no vendor welcome tour**; content hardcoded, 5/11 mini-tours |

No invented edges: I found no coordinator-specific signup, no venue-claim flow (pre-created venues deleted by mig 20260705000000), and no public performer intake — those non-flows are confirmed absent, not missing rows in this table.

## 4. Missing onboardings — build queue (priority order)

1. **Non-wedding onboarding content (8 enabled types)** — births real debut/birthday/christening/corporate/tournament/gender_reveal/travel/celebration events with type-true questions instead of generic TS defaults. Unblocks the **Event-Type Engine sign-off** (its whole thesis is "new type = data"). **Pure DATA** — admin fills `event_type_onboarding` + profile rows at `/admin/event-types/[type]/onboarding`; zero code. **Checklist-side counterpart (2026-07-08):** the same 8 types now have per-type **checklist** definitions (anchor · date-model · statutory pack · plan-group tree) in [`02_Specifications/Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md`](../02_Specifications/Adaptive_Checklist_Event_Type_Definitions_2026-07-08.md) — onboarding fills the *questions*, that spec fills the *tasks*; both feed `event_type_profiles`.
2. **Stage-flip the 4 dormant types (anniversary · graduation · reunion · gala_night)** — births 4 whole event-type markets that today have literally no door. **Pure DATA** — flip `enabled=TRUE` + fill the same content rows; the generic route already carries them.
3. **Vendor team invite-by-link for non-users** — births the vendor org's second member without the "go sign up first, then come back" dead end; today the org model's multi-admin governance can't actually grow a team smoothly. Unblocks **vendor org governance**. **CODE** (mirror the couple-side `/host/accept/[token]` token pattern onto `vendor_team_members`).
4. **Walk-up no-login face-identity guest camera** — births a capture identity for guests with no invite cookie at all (the plus-one's date, the surprise attendee). Unblocks the **Papic walk-up + face identity** workstream and the day-of guest promise. **CODE** (plus the config prerequisite below).
5. **Face-matching activation** — makes the three shipped enrollment flows actually pay off (auto-tagging). Unblocks **day-of guest** + Papic delivery. **CONFIG/DATA** — host the browser model and set `NEXT_PUBLIC_FACE_MODEL_URL`; no schema work.
6. **Vendor welcome tour** — births nothing but orients the platform's paying side; couples, admins and guests all have tours, vendors don't. **CODE** (small: one more `TourKey` in `lib/tours.ts`) — or fold into item 8.
7. **Kwento column fulfillment (`kwento_columns`)** — births the actual guest-written column entity; assignments currently point at a table that doesn't exist ("Phase 4" comment in mig 20270120760120). Unblocks **editorial guest columns**. **CODE** (migration + write path).
8. **Data-driven verification checklist + tours** — the two remaining hardcoded onboarding-content islands (8 DOC_SLOTS const; tour slides in TS). Converting them to admin-managed rows finishes the "onboarding = data" rule platform-wide; the verification half is already half-built on branch `claude/vendor-verify-structured-fields`. **CODE once, DATA forever.**
9. **Setnayan AI + deep-search switches** — dormant flows waiting on owner actions, not builds: flip `setnayan_ai_per_user_enabled` (after the 6 sign-offs) and add `ANTHROPIC_API_KEY` on Vercel. **CONFIG.**

The pattern worth naming: **coverage setup and the generic event onboarding are the gold standard** (admin edits a row, the flow changes live); the queue above is mostly about pulling the last hardcoded content — and four locked doors — up to that same standard.