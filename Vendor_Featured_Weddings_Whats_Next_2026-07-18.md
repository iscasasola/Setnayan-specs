# Vendor "Featured Weddings" + On-the-Day Papic — What's Next (2026-07-18)

> Cold-start handoff. Everything needed to resume the vendor past-events / "feature my
> wedding" work and the vendor on-the-day Papic capture. Companion raw research:
> [`Vendor_Featured_Weddings_Grounding_Appendix_2026-07-18.md`](Vendor_Featured_Weddings_Grounding_Appendix_2026-07-18.md)
> (4-agent grounding: RA 10173 legal, photo sources, toggle UX, codebase map — with file:line cites).
> Code repo: `github.com/iscasasola/setnayan-platform`. Working worktree used this session:
> `/Users/icecasasola/setnayan-wt-papic-onday` (branch `claude/vendor-past-events-gallery`).

## 0. Status at a glance

| Work | PR | State | Flag / gate |
|---|---|---|---|
| Vendor on-the-day Papic **capture controller** | [#3388](https://github.com/iscasasola/setnayan-platform/pull/3388) | **MERGED** | `vendor_papic_capture` Data Privacy control — **OFF** (counsel-gated) |
| **Dropped** the +₱50 vendor Unli upgrade | [#3396](https://github.com/iscasasola/setnayan-platform/pull/3396) | **MERGED** | — |
| Vendor past-events gallery — **SAFE layer** (facts only) | [#3400](https://github.com/iscasasola/setnayan-platform/pull/3400) | **MERGED / LIVE** | none — renders for everyone (facts only) |
| Vendor "feature my wedding" — **RICH layer** (photos) | — | **NOT built — PLANNED here** | new consent table + DPO/counsel sign-off |

Nothing is mid-flight. The rich-layer design workflow was **stopped intentionally** (this pause); its grounding is fully harvested into the appendix + §2 below.

---

## 1. Shipped this session (all merged to `main`)

1. **Vendor on-the-day Papic capture** (#3388) — a vendor working a booked event shoots into their own lane (`vendor_papic_captures`). Tier is **earned by how they accepted the inquiry**: token-spent or founder-comp → **Ltd** (70 capture pts, photos + 5s clips); else **Papic Lite** (20 pts, photos-only). Derived live from `vendor_event_unlocks`; no new migration. All fail-closed behind `isVendorPapicCaptureEnabled()` (admin Data Privacy control, default OFF). Files: `lib/vendor-papic-tier.ts`, `lib/vendor-papic-grants.ts`, `app/api/vendor/papic-capture/route.ts`, `app/vendor-dashboard/on-the-day/live/[eventId]/papic/…`.
2. **Dropped the +₱50 Unli upgrade** (#3396, owner: "not allow upgrade +50 if it is difficult") — removed the whole apply-then-pay path. Vendor tiers are now **Lite / Ltd only**; Unli is a **latent admin-comp** tier (no vendor purchase). Added a stubbed-client derivation test suite.
3. **Safe-layer past-events gallery** (#3400, LIVE) — the vendor public profile (`/v/[slug]`, dispatched from bare `/[slug]`) shows a **venue-matched** list of the vendor's completed events: at the viewing couple's **same venue** first ("Weddings at your venue"), else latest ("Recent weddings"). **Facts only** — venue · month/year · event type — **no couple names or photos**, private events excluded. Files: `lib/vendor-venue-events.ts`, `app/v/[slug]/_components/venue-matched-events.tsx`, wired via `ReviewsSection` in `app/v/[slug]/page.tsx`.

---

## 2. THE RICH LAYER — "let booked vendors feature my wedding" (planned, gated)

The owner's full vision: each past-event card shows the **complete wedding** — the couple, details, and **gallery photos** — on the vendor's public profile. This is the consent-gated follow-up the safe layer explicitly reserved. **It is not buildable as-described without new consent + a DPO ruling.** Below is the buildable plan.

### 2.1 The crux (read this first): guest photos need GUEST consent

A couple **cannot consent on their guests' behalf.** Couple approval alone is **not a lawful basis** to hand a *guest's* likeness to a vendor for **commercial marketing on the vendor's own site**. Two aggravators: (a) the Papic gallery is **face-tagged → biometric-linked sensitive PI** (needs *explicit* consent per the R-01/R-13 findings); (b) once on the vendor's server, Setnayan's geo-strip / NSFW / takedown controls no longer bind the copy, and the vendor becomes an **independent controller**. The vendor-Papic council and the R-13 addendum already flagged this exact gate as unresolved. **"Couple approval is enough" must not ship.**

Resolution options (ranked; owner + DPO choose):
1. **Couple-only / no guest faces (recommended V1).** Vendor may feature couple names + event details + **only couple-featuring or de-identified** frames (e.g. the couple's own `landing_page_hero_image_url`). Sidesteps the guest-consent problem entirely. Ships fastest.
2. **Direct guest opt-in gate.** Only frames where the **guest** explicitly opted into *vendor-marketing republishing* (a NEW flag beyond `consent_to_public`) **AND** the couple approved. This is the only clean §13 basis for guest images — but see §2.5: today no producer even sets couple-approval on guest *photos*, and the existing guest opt-in copy is scoped to the couple's own showcase, not third-party vendors → needs re-consent.
3. **Face-blur non-consenting guests** (reuse `lib/face-blur.ts`). Higher effort + residual re-identification risk.

### 2.2 The new consent primitive (recommended schema)

Per-user `public_summary_consent_at` can't express "couple → *this specific vendor* may feature our wedding." Add a dedicated **per-(event × vendor)** revocable receipt (mirrors `marketing_share_consents` + the `bazi_birthdata_consent_at` receipt pattern):

```sql
-- create via `pnpm migration:new "vendor_feature_consents"` (never hand-type the prefix)
CREATE TABLE IF NOT EXISTS public.event_vendor_feature_consents (
  id                   BIGSERIAL PRIMARY KEY,
  public_id            TEXT UNIQUE NOT NULL DEFAULT public.generate_public_id('F'), -- pick an unused type letter
  event_id             UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  vendor_profile_id    UUID NOT NULL REFERENCES public.vendor_profiles(vendor_profile_id) ON DELETE CASCADE,
  allow_identified     BOOLEAN NOT NULL DEFAULT FALSE,  -- couple names + event detail
  allow_photos         BOOLEAN NOT NULL DEFAULT FALSE,  -- gallery photos on the vendor's commercial page
  consented_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  consented_by_user_id UUID NOT NULL,                   -- audit: which host granted it
  revoked_at           TIMESTAMPTZ,                     -- non-NULL = withdrawn (one-click opt-out)
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, vendor_profile_id)
);
ALTER TABLE public.event_vendor_feature_consents ENABLE ROW LEVEL SECURITY; -- at CREATE time
```
RLS (reuse existing helpers — no invented patterns):
- **Host write/manage:** `USING/WITH CHECK (event_id IN (SELECT public.current_couple_event_ids()) OR public.is_admin())`.
- **Vendor read (own booked event):** `FOR SELECT USING (event_id IN (SELECT public.current_vendor_booked_event_ids()) AND vendor_profile_id IN (SELECT public.current_vendor_profile_ids()))`.
- Public `/v/[slug]` render reads via the service-role client (as the safe layer already does).

Granularity: **per-event opt-in as the default UX** ("let the vendors I booked feature this wedding"), stored per-(event,vendor) so a later **per-vendor** withdrawal is a row insert, not a migration. `event_vendors.marketplace_vendor_id` already gives the exact booked-vendor list if per-vendor UI is wanted.

### 2.3 Couple-facing opt-in (UX + RA 10173 wiring)

- **Placement:** a new block on `dashboard/[eventId]/website/privacy` (next to landing-visibility + Real-Stories consent) and/or the Settings → Privacy & data tab beside the existing "Featured on Setnayan's pages" (`marketing_share_consents`) revoke list.
- **Copy must be INFORMED + SPECIFIC:** name the destination (the vendor's own commercial profile/socials) and that it's **marketing**; **default OFF**; **separate checkboxes** for (i) details/names and (ii) **guest photos** — never bundled; must NOT be a booking precondition.
- **Toggle pattern to mirror:** the optimistic switch in `dashboard/[eventId]/website/editorial/_components/editorial-editor.tsx` (`toggleFeatured` → `setStoryShowcase`, `{ok}|{ok:false,error}`, rollback on failure).
- **Withdrawal / export / deletion (all mandatory):** revoke = set `revoked_at` (never hard-delete) + trigger a **contractual vendor takedown SLA** (Setnayan's own 24-hr SLA can't reach the vendor's server); **add the new table to `app/api/profile/export/route.ts`** (note: `marketing_share_consents` is currently *missing* from the export — don't repeat that gap); `ON DELETE CASCADE` handles account/event hard-delete.

### 2.4 Photo source — the reality (grounded)

| Source | Verdict for vendor page |
|---|---|
| `events.landing_page_hero_image_url` | ✅ **couple-consent path (option 1)** — couple explicitly chose + already published it. Must run through geo-strip (`stripPhotoMetadata`) before vendor reuse; no guest consent, so only where no identifiable guest, or as the "cover" tile. |
| `papic_guest_captures` PHOTOS | ⚠️ correct consent *shape* (guest opt-in + couple approval double-gate, `lib/papic-gallery.ts:238-296`) but **empty for photos today** — no producer sets `couple_approved_for_showcase` on a *photo* (the toggle is clip-only), and the guest opt-in copy is scoped to the couple's showcase, not vendors → needs re-consent. |
| `papic_photos` (seat) PHOTOS | ❌ opt-**out** only (moderation/faceblock), no affirmative guest consent. |
| `vendor_papic_captures` (#3388) | ⛔ counsel-gated / flag OFF; `consent_basis='event_consent'` is a placeholder, no per-guest snapshot. Viable only after the DPO ruling. |

**Always:** serve the **geo-stripped display derivative only** (`display_r2_key ?? thumb_r2_key`, null → drop the frame; never the geo-bearing original), always-on NSFW, copy the `buildChapterTeaserPlan` / `fetchTeaserFrames` pattern verbatim.

### 2.5 How it extends the shipped safe layer (exact insertion points)

Everything already flows through `buildVendorVenueEvents(admin, completedEvents, viewerVenue, {limit})` (`lib/vendor-venue-events.ts`) → `VenueMatchedEvents` (`app/v/[slug]/_components/venue-matched-events.tsx`), threaded via `ReviewsSection` in `app/v/[slug]/page.tsx` (~2134). To go photo-rich:
1. Extend `VendorVenueEvent` with `coupleConsented`, `heroImageUrl`/`galleryPhotos[]`, `coupleNames?`.
2. In `buildVendorVenueEvents`, for each event, read `event_vendor_feature_consents` for `(event_id, this vendor_profile_id)` (unrevoked, scope flags) — AND the event must be in the anti-fraud-clean `completedEvents` (already true) AND `landing_page_visibility <> 'private'` (already dropped). Load the consented photo source per §2.4.
3. `VenueMatchedEvents` renders thumbnails when `galleryPhotos.length > 0`, names when `allow_identified`.
Fail-closed: no consent row → facts-only card (today's behavior). Venue-match sort unchanged.

### 2.6 Build phasing (ordered, flag-gated, fail-closed)

- **PR-A — schema + RLS** (`event_vendor_feature_consents`, `pnpm migration:new`, RLS at create time, erasure sweep). Do NOT push to prod until DPO signs (mirror the `vendor_papic_capture` gate).
- **PR-B — couple opt-in UI + actions** (privacy tab block, optimistic toggle, revoke, export addition). Behind a flag.
- **PR-C — gated read + rich render** (extend `buildVendorVenueEvents` + `VenueMatchedEvents`; option-1 couple-hero source first). Flag OFF until DPO clears.
- **PR-D (only if option 2/3 chosen)** — guest opt-in flag + the missing couple-approval-for-photos writer + re-consent copy; or face-blur.

### 2.7 Open sign-offs

**OWNER decisions:**
1. **Scope of photos** — option 1 (couple-only / no guest faces, recommended V1), option 2 (guest opt-in gate), or option 3 (face-blur)? This gates whether guest faces can appear at all.
2. **Granularity** — per-event ("all booked vendors") default, or per-vendor toggles?
3. **Vendor Agreement amendment** — add a controller-to-controller republishing clause (permitted purpose = its own marketing; geo-stripped inputs only; honor withdrawal within an SLA; delete on revoke/listing-end; indemnity). None exists today.

**DPO / counsel decisions:**
1. **Guest-consent basis** — is explicit guest opt-in required before any guest likeness is republished by a vendor (resolves alongside the R-01 face-vector DPIA + R-13)?
2. **Controller characterization** — confirm the vendor is an **independent controller** for the republished copy and a **controller-to-controller data-sharing clause** (not a DPA) is the right instrument; approve Setnayan's disclosure basis.
3. **Minors** — republishing photos with identifiable minor guests: guardian consent vs mandatory exclusion.
4. **Withdrawal reach + retention** — is the contractual takedown SLA + retention cap adequate for §16(e) once data left Setnayan's control?
5. **NPC filing impact** — this adds a **new HIGH-risk processing activity + DPIA (R-14)** to the mid-flight filing; declare before lodging? New `data_privacy_controls` key (fail-closed) + `/privacy` + RSVP-notice updates.

### 2.8 RA 10173 checklist (must all hold before go-live)
Informed + specific + freely-given + granular consent · explicit consent for any guest/biometric-linked media · new purpose declared (3rd-party vendor marketing) + ROPA R-14 + DPIA · geo/EXIF stripped on hand-off · NSFW always-on · minors handled · withdrawal reaches the vendor copy (contractual SLA) + retention cap · exportable + cascade-deletable · activation via `/admin/data-privacy` fail-closed control, never an env flag.

---

## 3. Other pending follow-ups

### 3.1 Vendor on-the-day Papic capture (#3388) — go-live + polish
- **Go-live** = the DPO/NPC ruling → approve the `vendor_papic_capture` control on `/admin/data-privacy` (fail-closed today). No code needed to activate; the surface then renders.
- **Follow-ups (not built):** (a) **grantee capture** — today only the vendor owner/admin can capture (matches the RLS insert policy); a per-event teammate grantee can view the console but not capture. (b) **durable offline upload queue** — current uploads are non-blocking but not the couple-seat surface's IndexedDB queue. (c) **`consent_basis`** — currently the placeholder `'event_consent'`; the DPO ruling defines the real basis (and whether a per-guest snapshot is needed).

### 3.2 Safe-layer gallery (#3400) — live verification
Logic is unit-tested + the CI production build passed, but it was **not rendered live** locally (needs seeded data: a vendor with public completed events at a venue that matches a signed-in test couple's venue). Verify on staging: sign in as a couple whose event `venue_name` matches a vendor's completed event → confirm "Weddings at your venue" + the "Your venue" chip; sign out → "Recent weddings".

---

## 4. How to resume

- **Auto-draft the polished, red-teamed rich-layer plan** (optional — the design workflow was stopped after its Ground phase; resume to run Design → Red-team → Synthesize, Ground returns cached):
  `Workflow({scriptPath: "…/workflows/scripts/vendor-featured-weddings-consent-plan-wf_8b3e4a76-b49.js", resumeFromRunId: "wf_8b3e4a76-b49"})`
- **Build the consent table:** `pnpm migration:new "vendor_feature_consents"` (never hand-type the prefix — the guard rejects round `YYYYMMDD000000`).
- **Fresh worktree off main:** `git worktree add -b claude/<name> <path> origin/main` then `pnpm install --frozen-lockfile`.
- **Verify:** `npx tsc --noEmit` · `npx next lint --file <files>` · `npx tsx --test "lib/**/*.test.ts"`.

## 4b. Execution metadata (for the orchestrator — conforms to [`WHATS_NEXT_INDEX.md`](WHATS_NEXT_INDEX.md) §3)

> Fan out only `parallel_safe: yes && safety_gate: NONE`. Route every other gate to the human queue. All code = fresh worktree off `origin/main` + PR (§2 of the index).

```
- id: featured-weddings#1  title: Rich-layer consent table + RLS
  type: migration  depends_on: []  parallel_safe: no  (migration mutex; papic/pricing domain)
  safety_gate: DPO_COUNSEL   # may BUILD flag-dark; do NOT db-push until DPO signs; schema in §2.2
  touches: new migration event_vendor_feature_consents; new flag
  verify: tsc + migration guard; RLS unit
  gap: no existing per-(event,vendor) consent primitive exists

- id: featured-weddings#2  title: Couple opt-in UI + actions (+ add table to profile export)
  type: code  depends_on: [featured-weddings#1]  parallel_safe: no
  safety_gate: DPO_COUNSEL   # build flag-dark OK; activation gated
  touches: dashboard/[eventId]/website/privacy/*; api/profile/export/route.ts
  verify: tsc + lint + tests; toggle mirrors setStoryShowcase
  gap: FIXES the marketing_share_consents export omission (index §7.4)

- id: featured-weddings#3  title: Gated read + rich render (option-1 couple-hero first)
  type: code  depends_on: [featured-weddings#1, featured-weddings#2]  parallel_safe: no
  safety_gate: DPO_COUNSEL   touches: lib/vendor-venue-events.ts; app/v/[slug]/page.tsx; venue-matched-events.tsx
  verify: tsc + lint + tests; live-check with a consented seed

- id: featured-weddings#4  title: Guest-photo path (only if owner picks option 2/3)
  type: code  depends_on: [featured-weddings#3, DECISION:photo-scope]  parallel_safe: no
  safety_gate: DPO_COUNSEL + OWNER_DECISION   # guest consent basis; needs new guest flag + missing couple-approve-photo writer

- id: featured-weddings#D1  title: Owner decisions — photo scope / granularity / Vendor Agreement clause
  type: decision  safety_gate: OWNER_DECISION   # §2.7

- id: featured-weddings#D2  title: DPO/counsel — guest basis / controller / minors / withdrawal / NPC filing
  type: decision  safety_gate: DPO_COUNSEL   # §2.7; BATCH into the shared counsel packet (index §6)

- id: vendor-papic#golive  title: Vendor Papic capture go-live
  type: decision+flag  safety_gate: DPO_COUNSEL + FLAG_FLIP_PROD   # approve vendor_papic_capture control after DPO ruling

- id: vendor-papic#grantee   title: Grantee capture   type: code  parallel_safe: yes  safety_gate: NONE  # behind the OFF flag; owner/admin-only today
- id: vendor-papic#offline   title: Durable offline upload queue   type: code  parallel_safe: yes  safety_gate: NONE
- id: vendor-papic#consentbasis  title: Real per-guest consent_basis   type: code  safety_gate: DPO_COUNSEL

- id: gallery#verify  title: Safe-layer live verification (seeded data)
  type: verify  parallel_safe: yes  safety_gate: NONE  touches: none (staging)  # index §7.3
```

## 5. References
- Grounding appendix (raw 4-agent research w/ file:line): [`Vendor_Featured_Weddings_Grounding_Appendix_2026-07-18.md`](Vendor_Featured_Weddings_Grounding_Appendix_2026-07-18.md)
- DECISION_LOG rows: 2026-07-18 (vendor Papic tier · capture built · upgrade dropped · past-events safe layer).
- Memories: `project_setnayan_vendor_past_events_gallery`, `project_setnayan_vendor_on_the_day`, `project_setnayan_papic_gbb_pricing`, `project_setnayan_privacy_reconciliation`.
- Closest legal precedents: `NPC_Creator_Economy_Processing_Addendum_2026-07-17.md` (R-13), `Vendor_On_The_Day_App_Council_Verdict_2026-07-16.md` (vendor-as-3rd-party-controller), `Counsel_Review_Packet_NPC_Privacy_2026-07-13.md` (sign-off format).
