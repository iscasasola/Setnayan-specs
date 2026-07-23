# 3D Plan · Avatar Maker — Design Brief + Prototype

**Date:** 2026-07-19 · **Status:** PROTOTYPE — owner reaction pending, nothing built in the app
**Prototype:** [`avatar_maker_prototype.html`](avatar_maker_prototype.html) — self-contained, open in any browser (Three.js from CDN; drag to orbit, scroll to zoom).

## What this is

The avatar maker for the 3D Plan, designed maker-first per owner direction 2026-07-19: *"before we edit [avatars], we want to edit how the avatar maker looks like for the different users."* The lego model — **Head · Torso · Legs, each an editable Look** — applied to the shipped one-piece figure.

Two accounts, two chromes in one maker:

| | User ("My Avatar") | Vendor ("My Booth") |
|---|---|---|
| Chrome | Light greige glass panel, obsidian save | Obsidian glass panel, gold save |
| Slots | Head · Torso · Legs · Color | Booth · Staff · Sign |
| Subject | Your figure on the atelier turntable | Your booth + your avatar as the staff figure |
| Caption | "This is *you* in the room." | "This is your *booth* on the floor." |

## Decisions the prototype embodies (owner to confirm)

1. **No external avatar asset.** Ready Player Me sunset 2026-01-31 (dead). Quaternius/Kenney CC0 modular packs exist but would break three shipped guarantees: CSP no-fetched-assets (all kit textures are procedural CanvasTextures), instanced-crowd pixel-identity (crowd must share the individual figure's exact buffers), and the phone perf budget (~21 meshes/figure). **The lego bricks are new variants of our own kit geometry**, same module-scope-buffer pattern.
2. **Faceless stays locked.** All head variants are silhouette-only add-ons (Top Knot, Twin Buns, Cap, Pouf) on the owner-locked blob; the selfie photo-disc remains the only "face."
3. **Vendor staff = the vendor's own user avatar wearing the garment.** Head/build carry over from My Avatar; the Staff tab picks garment (the 5 shipped kinds: chef whites / apron / vest / uniform / robe) + brand color. Booth tab picks chassis (6 of the 10 shipped kinds featured: Counter, Station, Buffet, Cart, Backdrop, Riser). Sign tab = 18-char booth sign.
4. **Body tint is account-level identity** (resolves half the open identity/color fork from `project_setnayan_3d_character_look`); rooms can still re-tint crowds to the wedding mood board. Porcelain white stays the default.

## Fidelity notes

The prototype's figure is built from the app's exact rig constants (`lib/figure-sit-bake.ts` + `kit/figure.tsx`: PELVIS_Y 0.8, capsule radii, joint-blend balls, MANNEQUIN_SURFACE satin) and the exact GOWN_GEO lathe profile from `kit/outfits.ts`; the staff garment CanvasTextures are ported near-verbatim. What you react to is what the app would render.

## Photo → counterpart avatar (OWNER-LOCKED 2026-07-19: ₱0 · on-device only)

A guest can derive their avatar from a full-body photo — "Start from a photo" inside the maker — under the owner's no-cost lock:

- **Everything runs on the guest's device.** Canvas dominant-color extraction → body tint (ships first); MediaPipe-class on-device segmentation → silhouette buckets (head/build) later. The photo is **never uploaded, never stored** — analyzed in-browser, then discarded. No cloud vision, no per-call cost, ever (Rule-1-consistent).
- **Output only** persists: discrete part indices + tint into the avatar parts record — ordinary preference data, NOT biometric (no template, no identification purpose; feasibility fleet wf_e3972dd3 verified the corpus's own SPI reading supports this).
- The dormant `FigureSpec` look system (`lib/figure-rig.ts`: skinTone 6-ramp, hairStyle ×6, hairColor ×4, outfit, scale) is the classification target — the parts catalog already exists in shipped code.
- **Rejected:** ~₱0.11/user Haiku vision call (Rule 1 violation in a free feature); paid-SKU-baked classification.
- **Gates before ship:** its own specific consent tap ("Analyze this photo on your device" — derivation ≠ ambient), 18+/guardian Alaga fence, privacy-notice line + ROPA row for the derivation activity, DPO classification riding the open counsel packet. The photo-never-leaves-device design eliminates the upload-endpoint gates entirely (no CSAM-matcher bar, no retention clock, no stored-photo erasure path).
- ⚠ Deriving anything beyond **tint** that renders visibly (hair, build, outfit) reverses the 2026-07-09/10 "guests are matte-white mannequins / outfit ignored" lock — that unlock is a separate owner decision.

## Open for owner sign-off

- The part catalog itself (which head/torso/leg variants ship, how many).
- Whether avatar parts are free, or some are SKU/creator-economy inventory later.
- Tint palette (8 proposed) and whether tint persists cross-event (privacy: it's ordinary preference data, no PI concern).
- Where the maker lives: proposed `/dashboard` → You surface (user) and vendor dashboard → profile (vendor).

## Implementation shape (for the Opus build session, post-sign-off)

1. Schema: `users.avatar_parts` JSONB (`{head, torso, legs, tint}`) + `vendors.booth_avatar` JSONB (`{chassis, garment, brand_color, sign}`) — no new tables.
2. Kit: variant geometry buffers + a `FigureSpec.parts` field threaded through `buildFigure`/instanced-crowd bake (pixel-identity: bake per variant-combo or restrict crowd to classic parts at 'low' quality).
3. Maker route: one component, role-routed chrome, reusing the plan3d kit renderer.
