# Booth branding + guest avatar — Build Plan

**Date:** 2026-07-21 · **Status:** ⚠ BUILD BRIEF — implementation not started
**Repo:** `/Users/icecasasola/setnayan-wt-propose-lock` ⚠ (`setnayan-db-push` is stale — PR #649, May-30)
**Companions:** [`Chibi_Rig_Production_Spec_2026-07-19.md`](3D_Avatar_Maker_2026-07-19/Chibi_Rig_Production_Spec_2026-07-19.md) (character system, §11 = the seamless directive) · [`3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md`](3D_Plan_and_Vendor_Revenue_Model_2026-07-20.md) §2.0b (pricing + materialization)

---

## 0 · Verified build state — corrected

| Thing | State |
|---|---|
| `lib/figure-rig.ts` | ✅ **869 lines, ALIVE not dormant** — `FigureSpec`, `SKIN_TONES`, `HAIR_COLORS`, `HAIR_STYLE_COUNT=6`, `FACE_VARIANT_COUNT=3`, `resolveFigureLook`, `JOINTS`, and the full pose vocabulary (stand/walk/run/sit/idleSway/staffIdle/dancePose/damp) |
| `kit/outfits.ts` | ✅ **437 lines** — `latheProfile` geometry (`GOWN_GEO`, `SUIT_GEO`, `NEUTRAL_GEO`), `outfitMaterial`, `trouserMaterial`, staff outfits, `mannequinMaterial` |
| `kit/figure.tsx` | ✅ 657 lines — **the blob**, to be superseded |
| `kit/chibi-figure.tsx` | ❌ **does not exist** |
| `NEXT_PUBLIC_FIGURE_CHIBI` | ❌ **no flag anywhere** |
| `users.avatar_parts` | ❌ **no column anywhere** |
| `BoothSign` logo→texture | ✅ shipped (`plan3d/venue-objects.tsx:379`) |
| Per-event banner | ❌ does not exist |

**🔑 The chibi rollout is smaller than its spec implies.** The pose system, materials, lathe helpers and look resolution all exist and are reusable — the spec's own instruction is *"extend `lib/figure-rig.ts`, re-activate, don't re-invent."* What is genuinely new: chibi geometry, two catalog fields (`bodyType`, `accessory`), persistence, and the picker UI.

---

## 1 · Two independent tracks

**Track A (vendor) does not depend on the chibi.** Ship it first — it is short, self-contained, and it repairs a paid feature that is currently invisible.

---

## TRACK A · Booth branding

### A1 + A2 · ✅ SHIPPED — [PR #3431](https://github.com/iscasasola/setnayan-platform/pull/3431) (auto-merge armed, 2026-07-21)

**`public_venue_scene` v8** — migration `20270828271213_public_venue_scene_v8_booth_tier_slug.sql`. Adds `tier` · `slug` · `bookable` to the booth vendor block, mirroring `lib/seating.ts:1853-1856` and porting `lib/vendor-visibility.ts` semantics into SQL. Byte-identical to v7 apart from that block (verified by diffing function bodies). `BoothVendor` already declared all three optional → **no client change**, older cached payloads keep parsing. **All four CSP-myth comments + the "same-origin" claim corrected in the same PR.**

**⚠ OWNER ACTION AFTER MERGE:** `supabase db push --db-url "$SUPABASE_DB_URL"` — the fix is inert until the migration is pushed.

**Deliberately deferred to its own PR:** booth `cardItems` (below).

<details><summary>Original A1/A2 brief (kept for reference)</summary>

### A1 · 🚨 Fix `public_venue_scene` — the paid feature is dark

`/[slug]/venue` sources from the `public_venue_scene` SECURITY DEFINER RPC, which **does not select `vp.tier_state`** → `boothCanBrand()` fails → **every public booth renders generic today.** Pro logo branding is already built and already sold, and guests never see it.

- Latest RPC: `supabase/migrations/20270718464682_public_venue_scene_v7_entrance_kind.sql` → add `tier_state` (v8).
- Also add `cardItems` — the same RPC omits it, so **guests get the thinnest booth card** (the council verdict flagged this as "the first fix is a bug, not a feature").
- **Do this before anything else.** Adding a banner on top of branding that doesn't render is building a second storey with no ground floor.

### A2 · Correct the CSP myth in code comments

Four comments say *CSP* and mean *offline-first / no asset pipeline*, and they have been driving architectural decisions — including a "must not be promised" line in a locked council verdict:
`kit/booth-props.tsx:16` · `kit/outfits.ts:23` · `scene-lighting.tsx:16` · `venue-decor.tsx:25`
Plus `venue-objects.tsx:374` claims a *"same-origin display URL"* — it is a **cross-origin presigned R2 URL**.

*(Ground truth: the app ships ONLY `frame-ancestors 'self'` — `next.config.ts:113`. No `img-src`, `connect-src`, `default-src`, or nonce. Two shipped paths already load uploaded images as WebGL textures: `BoothSign` and `GuestPhotoAvatar` (`plan3d/guest-avatar.tsx:53`). R2 CORS allows `GET` on all five buckets.)*

</details>

### A2b · Booth `cardItems` on the public walk — NEXT

The same RPC omits `cardItems`, so guests (the highest-intent viewers) still get the thinnest booth card — the council verdict's *"the first fix is a bug, not a feature."* Not bundled with A1 because the resolver is a ~90-line multi-table composition in `lib/vendor-services.ts` `fetchBoothCardItems`: category-match-beats-first-active over `vendor_services` → `vendor_service_inclusions`, `host_inclusions` fallback for manual vendors, fail-soft throughout. Porting that to plpgsql (as `public_venue_scene` v9) is a real piece of work and deserves its own review.

### A3 · Per-event poster — schema + upload

**Two distinct surfaces, no conflict:**
- **Logo** — global, from their account: `vendor_profiles.logo_url`, renders on `BoothSign`. ✅ exists.
- **Poster** — per event, uploaded: **new column on `event_vendors`** (NOT on `vendor_profiles`).

| Constraint | Value |
|---|---|
| Aspect | **2:3 portrait, ENFORCED at upload** |
| Master | **1024 × 1536** |
| Mobile derivative | **512 × 768** (generated server-side) |
| Max file | ~500 KB |
| Formats | JPG · PNG · WebP |

**Why 2:3 portrait:** reads correctly on a narrow booth back wall, matches the pull-up-banner format PH vendors already design for, power-of-two-friendly for mipmaps.

**Enforce the aspect; do not letterbox.** A rejected upload with a clear message beats a silently letterboxed poster the vendor never sees in context — and it keeps the render geometry fixed (one plane mesh, no per-vendor aspect math).

**Ship a downloadable template** with safe margins marked. Costs nothing; it is the difference between composed posters and uploaded screenshots.

**Pipeline (mirrors what already works):**
1. `<FileUpload bucket="media" pathPrefix="vendors/{id}/events/{eventId}/banner" />` — existing widget (`app/_components/file-upload.tsx`), presigned PUT direct to R2
2. Persist the `r2://` ref on `event_vendors`
3. Resolve server-side with `displayUrlForStoredAsset()` (`lib/uploads.ts:99`) during scene assembly
4. Add `bannerUrl` to `BoothVendor` (`lib/seating-3d.ts:1165`) as **optional** so cached payloads still parse
5. Render as a `BoothSign` clone; reuse the refcounted texture cache (`guest-avatar.tsx:44`)

**⚠ Serve logos and posters from the PUBLIC R2 domain — do not presign.** The 24h presigned TTL (`uploads.ts:125`) expires inside cached scene payloads and falls back to unbranded silently. These are public marketing assets with nothing to protect; presigning buys nothing and creates a bug that reads as *"the 3D plan is broken."*

**⚠ Mobile GPU memory is the real constraint.** The guest walk is phone-first. A 1024×1536 texture is ~6 MB uncompressed in GPU; **ten branded booths ≈ 60 MB** on top of the room, crowd and chibi atlases. Serve the 512×768 derivative to mobile. Decide this at build time, not after a crash report.

**Reuse the QR-in-media guard** (`lib/vendor-qr-media-guard.ts:278`) — it already rejects logos containing QR codes; a poster is a more obvious smuggling vector.

**⚠ CORS origins match exactly** (`scripts/r2-cors.sh`) — a new production domain must be added or textures fail with a masked network error.

### A4 · Render + freeze

- **Render placement — open call:** *in-world always* (on the back wall, visible while walking past) vs *activation-only* (on booth tap). **Recommend in-world always** — per-event posters are designed *for that wedding*, which is what justifies the upload effort, and it is what the vendor is paying for.
- **Freeze at T-24h** (vendor surfaces: booth · poster · staff). This doubles as **the couple's review window** — what appears in their wedding cannot change under them. Combined with the QR guard, no approval queue is needed.

---

## TRACK B · Chibi + guest avatar

Sequenced per `Chibi_Rig_Production_Spec` §8, with §11's seamless directive folded into PR-1.

### B1 · `kit/chibi-figure.tsx` + catalogs *(spec PR-1)*

- New chibi geometry per spec §2, behind `NEXT_PUBLIC_FIGURE_CHIBI` (default off); homepage demo renders it flag-on.
- **Extend** `figure-rig.ts` — do not re-invent: `bodyType: 'female'|'male'`, `HAIR_STYLE_COUNT` 6→8, `HAIR_COLORS` 4→6, `accessory`.
- **🔑 §11 SEAMLESS SILHOUETTE lands HERE, not later.** Junctions overlap rather than abut: head↔body overlap ~0.06 (or a neck lathe) · shoulder gains a sleeve bulge covering the arm root · **drop the separate mitten sphere**, flare the arm capsule's distal cap · shoe overlaps the leg stub.
- **Two merge-gate tests:** the existing **closed-lathe law** (watertight profiles + `DoubleSide`) and the new **overlap law** (every child root inside its parent volume, materials matching across the junction — an `instanceColor` mismatch reintroduces the ring even with correct geometry).
- **Why PR-1:** every downstream PR inherits the geometry, and PR-3's pixel-identity bake test would otherwise gate the *wrong* silhouette.

### B2 · Poses on the reduced joint set *(spec PR-2)*

Chibi has no knees/elbows. Re-author waddle/sit/dance/staff clips on head + 2 shoulders + body-lean; `SitController` handoff parity. All clips stay pure functions in `figure-rig` (unit-tested), applied by the renderer.

### B3 · Instanced crowd *(spec PR-3)*

Part-batched instancing — one `InstancedMesh` per part geometry, ~30 batches for the whole room at any guest count. Extended pixel-identity bake test is the merge gate.

**🚨 This is why the seamless look must be OVERLAP, never merging.** A merged single mesh per look = bodyType × outfit × hair × accessory × colour-mode ≈ **thousands** of batches. Overlap gives the clean silhouette at zero perf cost.

### B4 · Guest avatar maker *(spec PR-4)* — the owner ask

> *"allow users to also add an outfit and hairstyle, something that would make it look more them."*

- **The 3-tap sheet** on `/[slug]/venue` (council P3). ⚠ **Depends on the P0 doorway fix** — `/[slug]/venue` currently has **zero inbound links** on `origin/main` (a live wayfinding violation).
- **Persistence:** `users.avatar_parts` JSONB (account-level). Guests without accounts fall back to hash-derived defaults, so crowds stay varied for free.
- Pickers: body · skin · **hair style + colour** · **outfit** (V4 wardrobe: one-piece dresses ⊕ tops×10 + bottoms×5) · accessory · colour mode (`auto` derives from the mood-board palette · `custom` · `paint`).
- **⚠ PRIVACY FENCE:** `bodyType` is an avatar **cosmetic**. It is never read from, written to, or inferred from `users.sex` (SPI, `sex_consent_at` pattern). **No join between the two, ever.**
- **🔒 SEPARATE THE TWO CONSENTS.** Customising your avatar and being **visible to other guests** are different decisions and must be different toggles. Customisation is a preference; visibility is a disclosure. **Default visible-to-others OFF**, tablemates-only as the middle setting. **DPO review** (a published room with named figures at seats discloses the guest list to 200 people — RA 10173).
- Photo→tint rides here behind its consent tap: **₱0 on-device, never uploaded, never stored.**

### B5 · Booth staff *(spec PR-5)*

Staff = the vendor's own chibi wearing a garment. Service-typed from the 28-category taxonomy (caterer→server, photographer→camera, florist→bloom) — zero vendor effort, and it sidesteps any asset question entirely. Retire the blob staff.

### B6 · Default flip *(spec PR-6)*

`NEXT_PUBLIC_FIGURE_CHIBI` on, blob deleted. No "Classic" fallback — one character system (owner confirm, spec §9.3).

---

## 2 · Order

**A1 → A2 → A3 → A4 → B1 → B2 → B3 → B4 → B5 → B6**

Track A ships first: it is independent of the chibi, it is small, and **A1 repairs a paid feature that is dark in production today.**

## 3 · Open decisions

| # | Decision | Where |
|---|---|---|
| 1 | Poster render: **in-world always** vs activation-only | A4 — recommend in-world |
| 2 | Poster **tier gate** — same `boothCanBrand` (pro/enterprise) as the logo, or its own? | A3 |
| 3 | **Guest visibility consent** — DPO review, default OFF | B4 |
| 4 | Chibi **scale vs furniture** (~1.06 m against product-true furniture) | spec §9.1 |
| 5 | Accessories **free vs SKU** — recommend free (lovability is the product) | spec §9.2 |
| 6 | **Blob deletion** at PR-6 vs hidden fallback | spec §9.3 |
| 7 | Fun hair colours (silver/gold) in or out for V1 | spec §9.4 |
