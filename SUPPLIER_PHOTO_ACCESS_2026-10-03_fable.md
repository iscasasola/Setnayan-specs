# Supplier photo access — what a supplier may receive and may show · 2026-10-03 · Fable

**Verdict:** a guest's Challenge "Share" today covers **receiving the photo privately only** — the tap never says "page", so it cannot carry publication. Recommend **(b): the supplier may also show it on their Setnayan page, but only after the guest's tap names that purpose** (one wording change, restoring the spec's own line) **and the couple taps Allow** (the same card the approved prototype already draws). No second ask to the guest.

Owner ruling 2026-10-03 (confirmed): suppliers receive **only** (a) what they shot themselves and (b) Challenge photos a guest explicitly shared — never the couple's gallery (c).

## The three sources

| Source | Supplier may RECEIVE? | May show on their PUBLIC page? | Who must say yes | Ships today? |
|---|---|---|---|---|
| **(a) Photos the supplier took** — live Papic shots + their private imported album | Yes — it is their own work | Yes, by reference, per ask | **Couple** (Allow · Decline). A guest takedown still reaches it (TD-1, 2026-09-14) | Receive: yes (`own-captures-strip.tsx`, `portfolio-album-section.tsx`). Show on page: **not yet** — approved prototype `papic_to_supplier_page_2026-10-03_fable.html`, Opus builds after C2 |
| **(b) Papic Challenge photos** — a guest's shot for a challenge this supplier sponsored, guest tapped Share | Yes — already gated | **Not today** (nothing moves one to the page, and the tap does not say "page"). Recommended: yes, same path as (a) | **Both** — the guest's informed tap + the couple's Allow | Receive: yes (`vendor-dashboard/clients/[eventId]/challenge-photos/page.tsx` → RPC `papic_vendor_challenge_photos`, `consent_to_share = true`, flag `NEXT_PUBLIC_PAPIC_GAMES_V1`). Show on page: **no** |
| **(c) The couple shares from THEIR gallery** | **No** | No | — | Ruled out, owner 2026-10-03: each guest's own consent is required before their photo reaches a business |

(c): no "safe version" is proposed — the owner has ruled it out; the only safe shape is already (b).

## What the guest is told today, word for word

`apps/web/app/papic/guest/_components/papic-challenge-panel.tsx` (anchor `Share this {attachedHere ? shotNoun : 'photo'} with`):

> **Share this photo with Lumina Studio?** · [ Share ] [ Keep private ]
> Private by default. The host gets your photos either way. / Shared — you can change this anytime.

Earlier, before the first photo (`papic-guest-capture.tsx`, anchor `Your photos go straight into`): *"Your photos go straight into {event}'s gallery and may be seen by other guests and the host."*

What the data says: `papic_mission_completions.consent_to_share` — table comment: *"the §4 per-photo tap that lets a photo reach the vendor (RA 10173, explicit opt-in)"*. The RPC `papic_vendor_challenge_photos` returns a row only when the host approved the challenge, the guest's `consent_to_share` is true, the screen passed it `clean` and `hidden_at` is null. Share ⇄ Keep private is the withdrawal path (§16).

**Plainly:** the guest agreed that *this supplier gets this photo*. Nothing names a public page, marketing or other people seeing it. RA 10173 consent is specific to a stated purpose, so posting it publicly is a further use the guest never saw. The supplier page's line *"Yours to use."* (`challenge-photos/page.tsx`) promises more than the guest's tap gave.

The spec intended more: `0012_papic/Papic_Games_and_Vendor_Missions_Spec_2026-07-21.md` §4.1 reads *"Share this photo with Salt & Lime? **They'd love to feature it.**"* — the "feature it" line was dropped when it shipped. Prod today: 0 completions, 0 shares, 0 supplier challenges — nothing to re-ask.

## Recommendation (b), the simplest UI

1. **The guest's tap says where it may go** — one line, same two buttons:
   **Share this photo with Lumina Studio?** *They may show it on their Setnayan page.* [ Share ] [ Keep private ] — footnote unchanged (*"Shared — you can change this anytime."*). One tap, informed; no third option (a "private-to-supplier-only" choice would be a third option → a dropdown, for a case nobody asked for).
2. **The couple's Allow, same card** — the supplier selects Challenge photos on their *Challenge photos* page exactly as in frame A (select → *Ask to show on my page*); the couple sees the same *Allow · Decline* card as frame B; the photo lands in the Portfolio by reference as frame C. A guest's later *Keep private* or takedown pulls it from the page too.
3. **One copy fix on the supplier side:** *"Yours to use."* → *"Yours to keep. To show one on your Setnayan page, select it and ask the couple."*

Why both, not the guest alone: the photo is from the couple's event, and (a) already needs the couple's Allow — one rule for everything on a supplier's page from that event. Why not a second ask to the guest later: there is no channel back to a guest after the day; the moment of the tap is the only honest one, and the spec said so.

## Prototype delta

`prototypes/papic_to_supplier_page_2026-10-03b_fable.html` (+ `.png`) = the approved A–C plus **one frame D**: the guest's completion card with the new line. Frames A–C are unchanged; the Challenge photos page reuses frame A's select bar.

## Owner questions (tap one)

1. **Where may a shared Challenge photo go?** → **Their Setnayan page too, when the tap says so (Recommended)** · Private to the supplier only.
2. **Who must say yes before it shows on the page?** → **Guest's tap + couple's Allow (Recommended)** · Guest's tap only.
3. **Another guest's face in a shared photo (the taker consented, the pictured guest did not)?** → **Same net as the supplier's own shots: couple's Allow + takedown reaches the page (Recommended)** · Hold it back when another tagged guest is in it.
4. **The supplier page line "Yours to use."?** → **Change to "Yours to keep…" (Recommended)** · Leave it.
