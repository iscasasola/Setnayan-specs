# 3D Venue Makers — Open Council Verdict

**Date:** 2026-07-19 · **Status:** COUNCIL VERDICT — owner sign-offs listed §6
**Scope (owner ask):** (1) the 3D place "fills up" — room look, table look, stage, custom booths, custom avatars; (2) better IA/navigation; (3) vendors customize their booth AND its pop-up. Plus Q5: photo→counterpart avatar.
**Method:** 3 grounding readers over the live repo (kit parameterization, route/doorway map, booth-interaction surface) → 5 seats (product/owner-taste, engineering reuse-first, IA/wayfinding, vendor monetization, privacy) → synthesis judge. Run `wf_a94836d4` (9 agents). Photo→avatar grounded separately by feasibility fleet `wf_e3972dd3` (15 agents, adversarially verified).
**Prototype:** [`3D_Avatar_Maker_2026-07-19/venue_makers_prototype.html`](3D_Avatar_Maker_2026-07-19/venue_makers_prototype.html) (v2 — rebuilt to this verdict's select-in-scene grammar; supersedes v1 `avatar_maker_prototype.html`, kept for lineage).

## 0 · TL;DR

**No unified "Venue Studio." One room document, three actor-scoped makers, and the scene is the nav.** Couple gets a Design panel inside the 3D lab's Build mode; vendor gets a "Your booth" tab on the shipped cocktail surface; guest gets a 3-tap sheet on the venue walk. The avatar prototype's role toggle is **rejected** — auth/routing already partitions actors. Most of "fill up the room" is persistence + picker UI over parameter slots that already exist; the stage is the one true gap. The booth pop-up already exists (`BoothVendorCard`) — its first fix is a bug (guests get the thinnest card), not a feature. Photo→avatar: superseded by the owner's same-day **₱0 on-device lock** — tint derivation rides Phase 1 free; anything visible beyond tint waits on the white-mannequin fork.

## 1 · Q1 — Studio model: one document, three projections

**Verdict:** No unified Venue Studio, no fifth standalone editor. One room document (`event_floor_plan` + `reception_design` + `role_palette` + `venue_setting`), three actor-scoped projections:

- **Couple** — room/table/stage look lands as a **Design panel inside `/seating/lab` Build mode**, reading/writing the SAME `reception_design` + `role_palette` fields the Mood Board reception designer already owns, via existing server actions. Never a second document. Mood Board stays the **sole palette source** (lab consumes, never edits). The 2D seat-plan editor stays the untouched authoring truth for **placement**; the makers own only **look**.
- **Vendor** — booth + staff editing extends `/vendor-dashboard/clients/[eventId]/cocktail` (the shipped vendor self-authoring surface). Never inside the couple's editor.
- **Guest** — not a studio at all: a 3-tap sheet on the venue walk.

**Why:** a room-look maker already exists (Mood Board reception designer — 7 parts including stage and tables in `lib/reception-scene.ts`) and the lab reached full authoring parity 2026-07-16 via the same server actions. A standalone studio would be the THIRD editor writing the same room state — the exact anti-dupe failure the Studio replot verdict prohibits.

**Dissent (preserved):** product seat wants the lab Design panel to ABSORB and supersede the mood board's 3D-consumed parts (redirect); engineering/IA seats prefer two doors onto one document (shared picker component + cross-links). All agree "never two documents." Owner taste call — §6.

## 2 · Q2 — IA: doorways named, role toggle killed, the scene is the nav

**Verdict — the IA map:**

- **Couple:** `/dashboard` → event card → Overview → "Seat plan" → `/seating` [2D·3D·List] → `/seating/lab` → **Design panel**. Plus a Studio hub card deep-linking `/seating/lab?panel=design` (Monogram Maker pattern) and a **two-way "Room look" chip** on the Mood Board studio (closing today's missing bidirectional link).
- **Vendor:** `/vendor-dashboard` → Clients → [eventId] → **"Your booth"** tab; plus a "Customize your booth" CTA on the booked-event card (the Pro-magnet doorway — never orphaned).
- **Guest:** `/[slug]` landing → "Visit the venue" tile → venue walk → tap your own figure or persistent "You" chip → **3-tap sheet**. ⚠ **PRECONDITION / PR-0:** `/[slug]/venue` is a live wayfinding violation — it has ZERO inbound links on origin/main (verified). The doorway fix ships before any guest-side maker.
- **In-maker grammar (all three):** **kill the role toggle** (a cross-role toggle implies write paths RLS forbids — a fake door). **The scene is the nav**: tap an object → contextual panel (stage → stage knobs, table → table knobs, booth → booth knobs); persistent **"Room" root chip** for room-wide knobs; tabs only WITHIN a selected subject, max 3–4 (Monogram Maker Letters/Frame/Reveal precedent). Adding a subject adds a tappable object, not a tab — scales to N subjects at zero chrome cost.

**Also surfaced:** `SEATING_3D` ₱2,999 is live in `pricing-data.ts` while the lab ships free/ungated (verified contradiction). Owner must settle the gate BEFORE free Design-panel knobs deepen it (§6, first item).

**Dissent:** IA seat insists the avatar prototype's shell be rebuilt to select-in-scene NOW (done — prototype v2); product/monetization would have tolerated slot tabs at 3–4 per actor.

## 3 · Q3 — Vendor booth + pop-up: free structural base, Pro identity layer, tokens = airtime only

**Booth itself:**
- **FREE (verified vendors):** chassis variant from their taxonomy-mapped, owner-authored template set (1 of 2–3, not free-form) · offerings text · structured cardItems · ONE accent colour constrained to a **harmonized band derived from the couple's palette** — never a free colour wheel. Vendor identity lives in the sign and the pop-up, not in shouting chassis colours.
- **PAID (Pro, behind shipped `boothCanBrand`):** logo BoothSign (already shipped — keep) · staff garment outfit + colour (`staffGarmentTexture` slot exists) · extra `PropPlacement`s from a **curated procedural catalog only** (CSP forbids fetched assets — vendor 3D/texture uploads are architecturally impossible in V1 and must not be promised) · pinned promo · media prominence.
- **TOKENS buy airtime only** (ghost booths, demo rotation — the 3D Booth Ads program). Never placement in a real couple's room without the couple's link.

**Booth pop-up** (the shipped `BoothVendorCard`, all three 3D surfaces):
- **First fix is a BUG:** `public_venue_scene` omits `cardItems` (verified against migration v7) — guests, the highest-intent viewers, see the thinnest card. Ship in the free base.
- **Free baseline** = everything deterministic already in schema: pricing from `vendor_services`, ≤5 showcase photos, inclusions/worth chips, the PR #3400 facts-only past-events block (venue-matched first), "Book this vendor" CTA → `/v/[slug]` — free forever.
- **Paid layer:** pinned promo/discount chips, media loop, CTA choice, and the conversational **front-desk embed — inherits the front-desk chatbot contract wholesale** (deterministic base ₱0/reply, single-tenant isolation, AI label, hand-off to token-gated accept). The pop-up only **reserves the slot**; it waits for the front-desk program's own build. Never a commission, never a paywall between guest and "book."

**Dissent:** engineering framed vendor colour as accent pass-through into the existing template colour system; product's stricter harmonized band wins the tie ("a booth that clashes with the room reads as an ad breaking the fourth wall") — owner confirms §6.

## 4 · Q4 — Room / table / stage knobs: palette proposes, lab disposes

All knobs palette-derived defaults + curated-swatch overrides, edited in the Design panel, persisted on `reception_design`/`room_dressing` (no new schema shapes), gated on the existing quality knob:

1. **STAGE (headline)** — build the missing 3D consumer for the already-persisted ReceptionDesign `stage` part: 3–4 curated backdrop treatments + riser skirting colour. ⚠ The `moon_gate`/`balloon`/`fringe` picker options render NOTHING today (verified) — renderers or REMOVED, decided inside this PR. No fake doors.
2. **LIGHTING** — expose `room_dressing.lighting_warmth` as 3 presets (warm / neutral / candlelit) feeding the existing SceneLighting mix. Half-built, zero renderer risk — rides the panel-shell PR.
3. **FLOOR** — 2–3 rasterize-once procedural material presets (marble/wood/terrazzo albedo+bump swap; tint already parameterized). Cache-keyed, CSP-clean.
4. **TABLE** — uniform per-event cloth colour override (persisted, not session-only) · runner on/off + colour · centerpiece (exists).
5. **WALL/CEILING** — 2–3 procedural treatments keyed off `palette.wall` only.
6. **CHAIR** — colour only.

**Explicitly NOT knobs** (and the panel must not hint at them): chair geometry styles (breaks 2-draws-per-table instancing) · per-table individual cloth colours (unbounded material caches) · uploaded images/fetched textures (CSP) · free-form colour wheels · per-guest geometry · movable/dynamic props (obstacle grid builds once) · venue-shell geometry editing · animated/particle decor beyond shipped cold_spark. Every merged knob states its cache key and quality-'low' behaviour.

**Dissent:** ordering only — product wanted stage first, engineering/IA wanted lighting first. Merged: lighting rides the shell PR; stage is the first feature PR after it.

## 5 · Q5 — Photo→avatar: council position + same-day owner supersession

**Council verdict (as deliberated):** conditional no for V1, phased — free manual tint picker now (Phase 1); one extra instancing attribute behind a pixel-identity bake-test after the owner resolves the white-mannequin fork (Phase 2); photo-derivation last (Phase 3), which the council framed as a **paid ₱99–199 SKU** on the premise that a server-side vision call can never be free under Rule 1. Product-seat hard line preserved: photo-derivation may never be worth building; Phase-1 demand data is a gate, not a nice-to-have.

**⚠ SUPERSEDED same day (owner-locked, DECISION_LOG 2026-07-19 + feasibility fleet wf_e3972dd3):** the owner locked **"no cost" → the pipeline runs entirely ON-DEVICE** (canvas dominant-colour → tint now; MediaPipe-class on-device segmentation for silhouette buckets later). Photo never uploaded, never stored, analyzed in-browser then discarded. This **dissolves the council's Rule-1 premise** — no LLM, no per-call cost — so the merged final position is:

- **Tint-from-photo rides Phase 1, free**: it derives ONLY tint (curated-swatch-snapped), which is instancing-safe and doesn't touch the mannequin lock. Gates that remain even on-device: a specific consent tap before analysis ("Analyze on this device" — derivation ≠ ambient), 18+/Alaga hard-block, one privacy-notice line + ROPA row for the derivation activity, DPO classification riding the open counsel packet.
- **Silhouette buckets (head/build) stay behind the Phase-2/3 gates**: white-mannequin fork resolution + pixel-identity bake-test + DPO/counsel. No scaffolding before the gates open.
- **Correction to the council's sign-off list:** the "/privacy denies biometrics" reconciliation item is ALREADY CLOSED — investigated 2026-07-13, false alarm from a stale checkout; the live notice already carries an accurate opt-in biometric section (verified by the feasibility fleet against `Privacy_Reconciliation_Home_and_Data_Flows_2026-07-13.md` line 73).

## 6 · Owner / DPO / counsel sign-offs

1. **Owner:** `SEATING_3D` ₱2,999 vs free on-by-default lab — pick the gate model before any Design-panel knob ships. Council lean: lab free as demand engine; ₱2,999 becomes the premium look/export layer.
2. **Owner:** Mood Board reception designer disposition — supersede-with-redirect into the lab panel (product) vs two-doors-one-document (engineering/IA).
3. **Owner:** white-mannequin identity fork — reopen or close before any avatar work beyond the free Phase-1 tint picker.
4. **Owner:** dead stage backdrops (`moon_gate`/`balloon`/`fringe`) — renderers or removal, decided inside the stage PR.
5. **Owner:** confirm vendor booth accent stays a palette-harmonized band (identity confined to sign + pop-up).
6. **DPO + counsel:** on-device photo→tint derivation classification (recommended: not biometric — no template, no identification purpose, nothing but a tint enum persists) + notice line + ROPA row, riding the open counsel packet. ~~/privacy reconciliation~~ already closed (false alarm, 2026-07-13).
7. **Owner:** if silhouette-bucket derivation ever ships (Phase 3), it stays ₱0 on-device per the 2026-07-19 lock — the council's ₱99–199 SKU framing is void.

## 7 · Build order

- **P0 — IA surgery + gap fixes** (no schema, one small tranche): (a) render the `/[slug]/venue` doorway from guest landing surfaces; (b) two-way Mood Board ↔ lab link; (c) widen `public_venue_scene` to carry `cardItems` + the free rich pop-up card. Biggest intent-capture win per line of code.
- **OWNER GATE:** sign-off #1 (SEATING_3D) — blocks P1.
- **P1 — Couple track:** Design-panel shell (reads/writes `reception_design` + `role_palette`, lighting presets ride along) → stage consumer PR (+ dead-backdrop decision) → floor presets → table cloth/runner persistence → wall/ceiling treatments.
- **P2 — Vendor track:** vendor-scoped write into reception-zone booths (extend `vendor_upsert_cocktail_booth` RPC pattern) + free customization set → Pro layer behind `boothCanBrand`. Pop-up chatbot embed reserves its slot only.
- **P3 — Guest track:** free avatar sheet on `/[slug]/venue` (tint + accessory tint from curated swatches + on-device photo→tint with consent tap). Days, not weeks; depends only on P0(a).
- **CONDITIONAL:** Phase-2 instancing attribute (pixel-identity bake-test gate) only after sign-off #3 + Phase-1 demand data; silhouette-bucket derivation only after that + sign-off #6.

## 8 · Grounding discoveries worth keeping (verified)

- `BoothVendorCard` pop-up already ships on all three 3D surfaces; `public_venue_scene` starves it of `cardItems` for guests — the bug of the program.
- The Mood Board reception designer IS a room-look maker (7 parts incl. stage/tables); the lab and it don't link either way.
- The one look currency is `Lab3DPalette {ambient, floor, table, accent, wall}` threading into every table, chair, booth, fixture, and the lighting rig; ReceptionDesign is the shipped option-picker precedent; `venue_setting` picks 6 hardcoded shells.
- Stage is a bare `palette.accent` box while ReceptionDesign already persists a `stage` part with no consumer — the highest-leverage gap in the whole ask.
- Two hard perf contracts bound everything: the instancing contract (crowd varies ONLY by tint/ring/scale; pixel-identity proven in `figure-sit-bake` tests) and the cache/CSP contract (module-scope geometry, colour-keyed bounded caches, procedural textures only, quality knob gates all).
- `/[slug]/venue` is orphaned on origin/main; SEATING_3D ₱2,999 is priced but ungated; `FigureSpec.outfitColor` → `mannequinMaterial` tint is the documented re-skin hook the guest picker lands on.
