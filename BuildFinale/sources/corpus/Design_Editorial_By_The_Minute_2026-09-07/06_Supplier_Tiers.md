# 06 · Supplier tiers

## The rule that never bends

> **Paying never changes WHETHER a supplier is credited — only how richly.**

This is already the shipped Simplicity Canon rule 2 (owner-ratified 2026-07-16): *"Being credited
in a story is always free — editorial or chapter, any tier"*, and `tierCaps(tier).editorialTagged`
is true across the whole matrix.

**A `#1 match` is a credit, not a tier.** `event_vendors.selection_match_rank = 1`. A Featured
supplier may not be a match; a match may be Listed. The prototype demonstrates both so the reader
cannot mistake one for the other.

---

## The two tiers

| | **LISTED · free** | **FEATURED · paid** |
|---|---|---|
| Named at every minute they made | ✓ | ✓ |
| The host's endorsement, if given | ✓ | ✓ |
| Bookable on Setnayan | ✓ | ✓ |
| Story auto-collected on their portfolio, "As featured in …" | ✓ automatic | ✓ |
| **Their chapter of the day**, if the host includes it | ✓ *(see below)* | ✓ |
| A **note to the host** inside the story | | ✓ |
| Their own **day-of clips** in the story | | ✓ |
| A **Follow** button | | ✓ |
| **Outside links** live | | ✓ |
| **Reach numbers** — "how many reached them from this story" | | ✓ |

**Mapping:** LISTED = every credited supplier, any `tier_state`. FEATURED = `tier_state ∈ {pro,
enterprise, custom}`. ⚠ The word "Featured" already means three other things in the product
(`showcase_featured_at`, "Featured in Stories", admin feature rank) — **`07` Q7 asks whether to
rename.**

## Free things the tiers must not swallow

* **A booked supplier may write a chapter about the day for free**, and it appears when the host
  includes it (`creator_chapters.host_included_at IS NOT NULL`). Every supplier card — Listed and
  Featured — should carry *"Their chapter of this day → Read it"* when one exists. Without it the
  page reads as if a supplier must pay to speak.
* **A guest cannot author a chapter.** `loadLinkableEvents` returns only events the account
  **hosts** plus events their **shop was booked on**. A guest has neither tie, and the database
  refuses the attach. So the story's cross-link credits a booked supplier or the host — never the
  best man. Owner ruling: *guests contribute photos and snippets; they do not need chapters.*

## The note to the host — needs three things it does not have

It is the spec's §9.3 supplier column (200 words), unshipped. Before it ships: a **length cap**,
**moderation**, a **host hide**, and a rule that it **must not name guests**.

## Two guards

* **Book stays on Setnayan** even when a Featured supplier's own link is live — the 0% commission
  position is the reason they want to be here. ⚠ Whether a live outside link leaks a
  Setnayan-sourced lead past the booking fee is **`07` Q8**.
* **Prices are never shown here.** They live in `platform_retail_catalog_v2`, which is
  admin-managed and is the only price a customer is charged.

## Fixed 2026-09-07 — PR #5290

`loadVendorFeaturedStories` and `loadVendorRecaps` each carried their own
`.eq('event_type','wedding')` **through** the 2026-08-15 correction, so a debut, reunion,
graduation or wake published to `/realstories` and was **never collected on the credited
supplier's portfolio**. The free tier's headline promise was false for fifteen of the sixteen kinds.

Cause: `withEditorialEventTypes()` was **private to `showcase-db.ts`** — the gate closed on the
shelf and nowhere else. It now lives in `lib/editorial-event-types.ts` and is exported.
The drift guard was green throughout because its source list was hand-written; it now walks
`lib/` and `app/` and admits a surviving filter only through `WEDDING_ONLY_BY_DESIGN`, with a
reason, plus a second test that fails when an exemption goes stale.
