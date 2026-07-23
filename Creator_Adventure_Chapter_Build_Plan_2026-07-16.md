# Creator "Adventure Chapter" — Build Plan / Prep (2026-07-16)

> Owner said "prep this now" (2026-07-16). This turns the [Creator Program Council Verdict (2026-07-15)](Creator_Program_Council_Verdict_2026-07-15.md) and the [creator-program memory](project_setnayan_creator_program.md) into an actionable build plan. **Nothing here is built yet.** It depends on the public-profile substrate from item #7 of the [Social Sharing Follow-Through plan](Social_Sharing_Followthrough_Build_Plan_2026-07-16.md).

---

## The locked model (from the 2026-07-15 verdict — do not re-litigate)

Creators (wedding + travel/food/lifestyle) get a **presence + distribution layer, NOT a video host** (hosting was rejected — it inverts the cost model, reopens the owned-music/DMCA and no-manual-editor locks, and adds solo-op moderation). The unit is an **"Adventure Chapter"** on the creator's public profile `/u/[slug]`:

1. **Embedded finished edit** — the creator's completed video stays hosted on *their* platform (YouTube/IG/TikTok) and is **embedded**. This keeps their license + monetization and keeps Setnayan out of the video-host / non-owned-music trap. **Kill-host decision is CONFIRMED by owner — hard lock.**
2. **Short owned-music teaser Setnayan hosts** — a brief, Setnayan-rendered teaser using **owned music only**, carrying the "made with Setnayan" hook. This is the one piece Setnayan hosts, and it's the shareable file-asset (IG/TikTok-compatible). Owner picked "**Embed + short native teaser**."
3. **Raw substrate = the moat** — the Papic gallery, itinerary, and vendor list behind the chapter. This is what a plain embed can't replicate and what makes the chapter page the share target.

**Positioning:** "no random posts, substantial events only" — the profile is a **timeline of chapters, not a feed**. **Travel kicker:** a Chapter is **shoppable** → vendor leads (0% commission). **Creators are FREE.** Follower-gating is for perks, not entry.

---

## Prerequisites (must land first)

- **Item #7 profile system** (`/u/[slug]` with vanity-slug editor + public/hidden toggle + report path + personalized OG). The Chapter page *is* the creator's `/u` profile made rich. Do not build Chapters before 7a/7b/7c.
- **Owned-music teaser render** — reuses the existing render pipeline (Remotion/FFmpeg + owned-music catalogue). No new music infra; no per-render AI; owned catalogue only.

---

## Build phases

**CP-1 · Creator flag + Chapter data model.**
- `users.is_creator boolean default false` (admin-granted or self-apply → admin approve; creators are free, so this is an access flag, not a SKU).
- New `creator_chapters` table: `chapter_id` (S89-prefixed public id), `user_id`, `event_id?` (a chapter may wrap a real Setnayan event or be standalone), `title`, `kind` (wedding|travel|food|lifestyle), `embed_url` + `embed_provider` (youtube|instagram|tiktok — allowlist, sanitize), `teaser_r2_key?`, `substrate` refs (papic gallery id, itinerary, vendor list), `status` (draft|published), `published_at`. RLS at CREATE (owner-writes, public-read when published + profile public).
- **Security:** embeds are an XSS/clickjacking surface — allowlist providers, use privacy-enhanced/no-cookie embed URLs, sandbox the iframe, never render arbitrary HTML.

**CP-2 · Chapter authoring (creator side).**
- On the creator dashboard: create a chapter → paste the embed URL (validated against the provider allowlist) → attach substrate (pick an existing Papic gallery / itinerary / booked vendors) → optionally generate the owned-music teaser (render job, owned catalogue) → publish. Enforce "substantial events only" as a norm (min substrate, no micro-posts) — soft, not a hard gate.

**CP-3 · Chapter page (public) on `/u/[slug]`.**
- Timeline of published chapters (not a feed). Each chapter: embedded edit + the short owned-music teaser (the shareable asset, via `save-to-device` → native sheet) + the shoppable substrate (vendor cards link to `/v/[slug]`, 0% commission leads; itinerary; gallery).
- Share target: the chapter page is what the creator shares across their existing platforms → traffic **into** setnayan.com. The teaser is the "made with Setnayan" hook.
- OG: personalized (`api/og/u` from #7, extended for chapters).

**CP-4 · Shoppable vendor leads (travel kicker).**
- Substrate vendor cards → connection/inquiry to the vendor (rides the existing lead economy; 0% commission; respects the token/fake-inquiry model). This is the revenue rationale for a free creator tier: creators drive vendor leads.

**CP-5 · Follower perks (not entry).**
- Follower-gated perks (early access, discounts, behind-the-scenes) — a rewards layer, never a gate on viewing chapters. Lower priority; ship after CP-1..4 prove the loop.

---

## Open owner sign-offs (from the 2026-07-15 verdict — still open)

1. **Creator badge** — visual treatment / verification bar for `is_creator`.
2. **Comped SKU** — which in-app SKU(s) creators get free (teaser render? a Papic tier?) as part of "creators are free."
   *(The kill-host sign-off is already CONFIRMED — do not reopen.)*

## Red lines (inherited, hard)

- **Never host the creator's full edit** — embed only. Setnayan hosts only the short owned-music teaser.
- **Owned music only** in the teaser (and any Setnayan-hosted render). No BYO/major-label audio in the server pipeline.
- **Timeline, not a feed** — substantial chapters only; no micro-post stream.
- **Embeds are sandboxed + provider-allowlisted** — no arbitrary iframe/HTML.
- **Creators are free**, follower-gating is perks not entry, vendor leads stay 0% commission.

*Provenance: [[project_setnayan_creator_program]] + [Creator Program Council Verdict 2026-07-15](Creator_Program_Council_Verdict_2026-07-15.md), sequenced onto the #7 profile substrate. Cross-refs: [[project_setnayan_public_url_scheme]], [[project_setnayan_vendor_monetization]], [[project_setnayan_fake_inquiry_protection]].*
