> **Provenance:** 5-agent research workflow — literal URL anatomy of 13 live products (Kuha, PhotoShare.ph, POV, Guestpix, Kululu, Wedibox, WedUploader, The Knot, Zola, WithJoy, Partiful, Google Photos, Spotify Jam), 2026-07-22. ⚠ § 3 RECOMMENDS REVERSING the owner-locked 2026-07-08 URL scheme — sign-off required, nothing applied.

# Setnayan URL Scheme — Synthesis & Verdict (2026-07-22)

Grounded in 4 researcher reports covering 13 live products. Anything not directly observed in the findings is flagged **[unverified]**.

---

## 1 · Competitor link anatomy comparison

| Product | Guest entry shape | ID type / entropy | Guest auth | QR encodes | Vanity slug? | Subdomains? | Live wall / session |
|---|---|---|---|---|---|---|---|
| **Kuha** (PH rival) | `/album/{id}`, `/invite/{id}`, `/slideshow/{id}` — one code, three prefixes | 20-char random Firestore ID, unguessable | **None** (name is sessionStorage-only) | Plain full album URL via external qrserver.com | Only for SEO marketing pages (`/weddings`, `/debut`…) | **Yes — per-PARTNER white-label** `{partner}.kuha.app`, guest pages auto-redirect to it | `/slideshow/{id}`, same code |
| **photoshare.ph** (PH, ₱999/event) | `/guest/{EVENTCODE}` | **Human-readable, guessable** ("WED2025"), immutable | Name only, localStorage 24h; PIN optional | Plain path `origin+/guest/+code` | The event code IS semi-vanity | No — flat apex | `/photowall/{convexId}` — public, no token |
| **POV** | `/qr/{token}` on ROOT domain | UUID → 20-char Firestore-style | None | Plain tokened URL (root domain so iOS App Clip AASA fires) | Paid brand aliases (`/guinness` → 302 → `/qr/{token}`) | `app.pov.camera` for hosts only | Host-dashboard route |
| **Guestpix** | `/guest/access/{eventId}/{token}` magic link | Numeric event ID + unguessable token | **Dual-rail: tokened link = no PIN; bare URL = PIN gate** | Magic link | No | `my.guestpix.com` app subdomain | — |
| **Kululu** | `/album/{shortId}` (+ `/s/`, root short forms) | **6-char lowercase** — typeable, small keyspace | None | Plain URL | No | `app.kululu.com` | `/slideshow/{shortId}` — "just a URL on the TV" |
| **Wedibox** | `/w/{slug}/experience` — one QR for photos+guestbook+RSVP+seating | Couple slug under `/w/` prefix | Optional password | Plain URL; **`/w/claim/` = print QR before account exists** | **Paid upsell**: root `wedibox.com/steve-ashley` ($49 plan) | No — root domain | Inside experience |
| **WedUploader** | `/upload/{16-char}` | 16-char mixed-case, unguessable | None | Same URL + `utm_medium=qrcode` (vs `linkCopy`) | No | No | — (Drive-backed, never expires) |
| **The Knot** | `theknot.com/us/{couple-slug}` | Human-readable names+date | Optional printed password; RSVP = name match | The slug URL | **Core model**, free | No | — |
| **Zola** | `/wedding/{slug}` (+ `/registry/{slug}`) | Human-readable | Name-match RSVP | The slug URL | Core model | No | — |
| **WithJoy** | `withjoy.com/{slug}` bare root | Human-readable, first-come | Optional min-3-char case-insensitive password | The slug URL | Core model | No | — |
| **Partiful** | `/e/{20-char base62}` — **one advertised prefix as anti-phishing** | Random token | View open; RSVP = phone OTP | The tokened URL | Never | No | — |
| **Google Photos** | `photos.app.goo.gl/{17-char}` | Random, **owner-resettable** | None | Short-domain link (QR/SMS ergonomics) | No | **Dedicated short domain for shares** | — |
| **Spotify Jam** | `spotify.link/{token}` | Session-scoped, dies with the Jam | Link + proximity-tap + same-WiFi joins | Short link | No | Short domain | Session IS the link |

---

## 2 · What the category converges on

1. **Two-tier convention, universal and never violated:** human-readable **vanity slug for the DESTINATION** (the page guests must remember/print — couple site) vs **random token for CAPABILITY** (album entry, personal access, session join). Wedding builders never tokenize the site; share-link products never offer vanity album URLs. Setnayan's shipped model (public `/{event-slug}` + per-guest `qr_token`) is already the category-correct split.
2. **Link-as-credential, zero guest accounts:** 10 of 13 products have no guest auth at all; none of 13 require a viewer account. Reads open-by-link; only writes gated (OTP, name-match, printed password). Setnayan's zero-account PH guest posture matches.
3. **QR encodes the plain full URL** in every product observed — no product tokenizes the QR differently from the shareable link. Short domains (Google, Spotify) exist purely for QR density + SMS/Messenger cleanliness, and redirect to canonical.
4. **No per-event or per-couple subdomains anywhere.** The only subdomain-as-identity is Kuha's **per-PARTNER white-label** — its reseller distribution weapon, not a guest-UX feature. The category split is marketing-domain vs one app subdomain, and several (Wedibox, WedUploader, photoshare.ph, POV's QR target) run everything on the root.
5. **No nested owner/event paths.** Nobody ships `{user}/{event}`. Deepest observed is one prefix: `/w/{slug}`, `/wedding/{slug}`, `/e/{token}`, `/us/{slug}`.
6. **Random tokens ≠ privacy:** Partiful's 20-char tokens are fully Google-indexed. Privacy = noindex + no directory listing, not entropy.
7. **Revocability is first-class** on album links (Google Photos resets the URL anytime; Guestpix/photoshare revoke share tokens).
8. **One fixed, advertised prefix is an anti-phishing feature** (Partiful: "links always start with partiful.com/e/") — directly relevant to PH GCash-scam sensitivity in Messenger/Viber, where link previews truncate and spoofing is rampant.

**Messenger/Viber implication:** PH guests forward links, not QR codes, after the invite lands. That favors **short, flat, readable URLs on one recognizable domain** — a flat `setnayan.com/maria-and-jose` survives chat-preview truncation and is visually verifiable as "real Setnayan"; `setnayan.com/u/maria-santos/maria-and-jose-wedding` does not and is not.

---

## 3 · VERDICT: keep the shipped flat `/{event-slug}`. Do NOT apply the locked `/u/{user}/{event}` scheme for event entry.

**Recommendation: retire the event-nesting half of the 2026-07-08 lock; keep the shipped flat event slug as the permanent public event URL. This reverses an owner lock — sign-off required (§ 5).**

**The case:**

- **Zero category precedent for nesting.** Not one of 13 products — including all three wedding-site giants whose entire business is the couple URL — nests event under owner. WithJoy went the *opposite* way (bare-root slug). The locked scheme would make Setnayan's guest URL the longest in the category.
- **The migration cost buys nothing measurable.** The locked plan's stated benefit is vendor SEO on flat `/{slug}` — but the cost side is concrete and enumerated (re-point every live event QR, sitemap, day-of routes, redirects, reserved-word blocklist), while the flat-vendor SEO uplift is **[unverified — no finding in any report supports subfolder-vs-shorter-path ranking gains]**. Category evidence actually cuts against: The Knot/Zola rank fine with `/us/` and `/wedding/` prefixes.
- **QR breakage is the exact failure mode the category avoids.** Every competitor's QR encodes a plain URL that must keep resolving; printed invitation suites have months of lead time (Wedibox built `/w/claim/` specifically because printed QRs can't change). Breaking live event QRs mid-market to relocate URLs is a self-inflicted version of the problem competitors engineer around.
- **`/u/{user-slug}` can still ship** for the creator-program profile surface ("Adventure Chapter") without dragging events under it — user pages and event pages don't need to share a path hierarchy to be linked in-page.
- **Vendors stay at `/v/{slug}`.** Giving vendors the flat root would collide with event slugs on the same namespace and force the reserved-word blocklist the locked plan dreads. One prefix character is the cheapest possible disambiguation, and `/v/` doubles as the advertisable "real Setnayan vendor link" prefix (Partiful pattern). If flat-root vendor SEO is ever proven to matter, a 301 from `/v/{slug}` later is cheap in that direction; the reverse (un-flattening) is not.

**What the QR should encode — given the open-browse two-layer model:**

Encode the **personal token link** (the shipped per-guest unguessable `qr_token` invitation URL), not the bare public slug. This is the Guestpix dual-rail, the only competitor pattern that matches the council's requirement verbatim:

- **QR (printed invite, 1 per guest) → tokened URL** → lands on the event site **personalized** (name, seat, RSVP state, Papic roll). Token = capability tier of the two-layer identity.
- **Bare `/{event-slug}` (typed, forwarded in Messenger, guessed) → public open-browse layer**, fully functional per the redesign requirement. Slug = destination tier.
- Guardrails from the findings: tokens must be **rotatable per-guest without changing the event slug** (Google Photos revocability), tokened pages must be **noindex** (Partiful indexing leak), and the public slug page needs a **directory/search opt-out** if any event search ships (Knot/Zola/Joy all pair slugs with opt-out).

Encoding the bare slug instead would throw away per-guest personalization, seat routing, and entry-channel attribution for zero gain — no competitor with a personalization layer encodes the public URL.

---

## 4 · Moves worth stealing

| Move | Source | What | Effort |
|---|---|---|---|
| **Short QR domain: `setnayan.ph`** | Google Photos, Spotify | Already owned. `setnayan.ph/{code}` → 301 → canonical tokened URL. Lower QR module density (better print-at-small-size on invitation suites), cleaner Messenger pastes. Keep setnayan.com canonical; the short domain only redirects. | Small — one redirect route + code table; the S89 Crockford ID family already exists as the code source |
| **One advertised guest prefix** | Partiful anti-phishing doc | Fix and *document* "guest links always start with `setnayan.com/` or `setnayan.ph/`" in Help Center — a scam-defense feature for the GCash-scam-primed PH audience | Trivial — a help article + never minting other shapes |
| **QR vs link-copy attribution** | WedUploader | Stamp `utm_medium=qrcode` into QR payloads and `linkCopy` into share-sheet copies; per-event entry-channel data for free | Trivial |
| **Claim-before-create QR** | Wedibox `/w/claim/` | Pre-mint a working QR/code before the event is configured — kills the printing-lead-time objection for PH invitation printers; also a top-of-funnel hook | Medium — pre-provisioned event shells |
| **Token rotation** | Google Photos | Per-guest `qr_token` reset (lost phone, leaked link) without touching the event slug | Small — likely partially exists **[unverified against shipped code]** |
| **noindex on tokened pages** | Partiful failure case | All `?token`/personal routes noindex + excluded from sitemap | Trivial; audit needed |
| **Root-domain AASA reservation** | POV | If iOS App Clips ever matter (Papic capture), the QR target must live on the root domain — the shipped flat scheme already satisfies this; the `/u/` nesting would too, but don't create subdomain QR targets | Zero now; a reason to keep QR targets on setnayan.com root |
| **Watch:** per-partner subdomains | Kuha | `{partner}.kuha.app` white-label following the guest through album/invite/slideshow is Kuha's distribution threat (per existing competitor memo) — a URL-layer capability Setnayan has no answer to. Not a V1 build; a strategic gap to log | Large — defer, but decide deliberately |

---

## 5 · Open items for owner sign-off

1. **Reverse the 2026-07-08 lock's event half:** events stay flat `/{event-slug}` permanently; `/u/{user-slug}` ships only as the user-profile surface, with no event nesting. (This memo's core recommendation — it contradicts a standing owner lock and cannot proceed without explicit sign-off.)
2. **Vendor placement:** confirm vendors stay `/v/{slug}` (dropping the locked flat-vendor move), accepting that the flat-root SEO benefit is unproven. If the owner still wants flat vendors, the reserved-word blocklist + event/vendor slug collision policy must be specced first.
3. **QR payload:** confirm QR = personal tokened URL (not bare slug), with per-guest rotation + noindex as hard requirements handed to the open-browse council.
4. **`setnayan.ph` as the short/QR redirect domain** — approve the redirect-only role before anything else claims that domain.
5. **Directory question:** the wedding-site giants all pair vanity slugs with a "Find a Couple" search + per-couple opt-out as the lost-invite recovery path. Does the open-browse redesign want an event search surface, and if so, opt-out defaults ON or OFF? (Privacy posture decision — RA 10173 adjacent.)
6. **Kuha white-label gap:** acknowledge that no URL decision here answers the partner-subdomain distribution threat; log it as a separate strategic item rather than letting it silently ride on this decision.