# Live site snapshot — www.setnayan.com

**Captured:** 2026-05-18 21:32 PHT
**Tool:** curl + pandoc (HTML → GFM-Markdown, base64 inline-SVG stripped)
**Method:** Public crawl, no auth. Dynamic routes (`/v/<slug>`) not included — vendor list hydrates client-side and SSR HTML is empty.

## Why this exists

The owner pulled the full public site so Cowork can group findings into the right iteration folders **before** code edits begin. Fixing copy/drift inside the app worktree fragments the work; this snapshot lets every page get triaged into its owning iteration in one pass.

## Where this sits in the spec corpus

This folder is one of four daily-driver status anchors. Pair it with:

- [../V1_Gap_Analysis_Status.md](../V1_Gap_Analysis_Status.md) — spec-side audit (what's V1-locked vs polish vs retired)
- [../App_Build_Status.md](../App_Build_Status.md) — code-shipped audit (spec vs `origin/main`)
- [../Installed_Stack_Inventory.md](../Installed_Stack_Inventory.md) — what's wired under the hood (routes, migrations, server actions, env vars)
- **This folder** — what the live public site actually shows

A drift flag in this README usually maps to a row in App_Build_Status (code reality) or V1_Gap_Analysis (spec reality) — use the cross-link to verify before touching code.

Discovery log entry: see [../CLAUDE.md](../CLAUDE.md) decision log, row dated **2026-05-19** ("Live-site snapshot landed in spec corpus") for the full triage backlog with iteration ownership.

---

## Route inventory

13 public routes captured. Each `.md` is the cleaned text content of the page; `raw/*.html` is the as-served HTML.

| URL                  | Snapshot file                                | MD size | Owning iteration(s)                                                                 |
|----------------------|----------------------------------------------|---------|--------------------------------------------------------------------------------------|
| `/`                  | [home.md](home.md)                           | 12 KB   | **0015** main website                                                                |
| `/features`          | [features.md](features.md)                   | 15 KB   | **0015** + every product iteration it lists (see "feature → iteration" map below)    |
| `/for-vendors`       | [for-vendors.md](for-vendors.md)             | 4 KB    | **0015** + **0006** vendors mgmt                                                     |
| `/pricing`           | [pricing.md](pricing.md)                     | 2 KB    | **0003** service_catalog + **0015** display + **0034** payments/cart                 |
| `/vendors`           | [vendors.md](vendors.md)                     | 0.6 KB  | **0015** marketing view + **0006** vendor data (mostly client-rendered, low SSR)     |
| `/waitlist`          | [waitlist.md](waitlist.md)                   | 1 KB    | **0015**                                                                             |
| `/help`              | [help.md](help.md)                           | 8 KB    | **0029** help center                                                                 |
| `/login`             | [login.md](login.md)                         | 0.2 KB  | **0000** shell/nav (auth gate; mostly client-rendered)                               |
| `/signup`            | [signup.md](signup.md)                       | 0.2 KB  | **0000** + **0006** (Couple/Vendor toggle)                                           |
| `/signup?as=vendor`  | [signup-as-vendor.md](signup-as-vendor.md)   | 0.2 KB  | **0000** + **0006** (deep-link variant)                                              |
| `/download`          | [download.md](download.md)                   | 2 KB    | **0000** shell (Mac app distribution)                                                |
| `/privacy`           | [privacy.md](privacy.md)                     | 8 KB    | **0015** legal                                                                       |
| `/terms`             | [terms.md](terms.md)                         | 3 KB    | **0015** legal                                                                       |

### Feature → iteration map (from `/features` page)

`/features` is the master catalog page and self-tags each section with an iteration number. Cross-checked:

| Feature on page          | Iteration tag on page | Spec folder                                |
|--------------------------|-----------------------|--------------------------------------------|
| Guest list               | 0001                  | 0001_creating_guest_list                   |
| Personal QR invitations  | 0002                  | 0002_qr_invitation_system                  |
| QR microsite             | 0002                  | 0002_qr_invitation_system                  |
| Guest microsite          | 0002                  | 0002_qr_invitation_system                  |
| RSVP                     | 0001                  | 0001_creating_guest_list                   |
| Email notifications      | 0028                  | (0028_email_notifs)                        |
| Vendor management        | 0006                  | 0006_vendors_management                    |
| Payment milestones       | 0007                  | (0007_budget_expenses)                     |
| Calendar export          | 0006 / 0008           | 0006 + 0008                                |
| Contract uploads         | 0006                  | 0006_vendors_management                    |
| Seating chart            | 0008                  | (0008_seating)                             |
| Budget                   | 0007                  | 0007_budget_expenses                       |
| Mood board (Pakulay)     | 0010                  | (0010_*)                                   |
| Schedule                 | 0008                  | (0008_seating) — possible mistag, schedule may belong elsewhere |
| Panood (broadcast)       | (untagged)            | 0011_panood                                |
| Papic (paparazzi)        | (untagged)            | 0012_papic                                 |
| Pamahiya (souvenir reel) | (untagged)            | (no folder yet?)                           |
| Pailaw (LED background)  | (untagged)            | 0005_led_background_maker                  |
| Pareto (DSLR bridge)     | (untagged)            | (no folder yet?)                           |
| Custom Monogram Pack     | (untagged)            | (no folder?)                               |
| Photo Delivery           | (untagged)            | (no folder?)                               |
| Supplies Marketplace     | (untagged)            | (no folder? — robots.txt allows `/supplies` but route 404s) |

---

## Drift / inconsistency flags (for Cowork triage)

Surface-level inconsistencies caught across the snapshot. Worth grouping into the relevant iteration folder before code touches:

1. **Broken primary CTA on `/features`** — both header and footer CTAs point to `/apply`, which returns **404**. Live "Start planning · free" button is dead. → **0015** copy or **0000** routing.

2. **PHP-figure policy contradiction between `/pricing` and `/features`**
   - `/features` day-of apparatus section explicitly says *"Quotes per event — no PHP figures shown"* and tags every apparatus card *"Included in your custom quote"*.
   - `/pricing` shows hard PHP figures for the same products (Panood Daily ₱499/day, Annual ₱2,999/yr, Patiktok ₱999/day, Save-the-Date Video ₱99/render, Live Schedule Widget ₱999/event).
   - → **0003 service_catalog** is the source of truth (per CLAUDE.md decision log); both pages need to be reconciled against it.

3. **"Patiktok" naming** — appears on `/pricing` only. `/features` calls the souvenir-reel feature **Pamahiya** and never mentions Patiktok. Possible drift: are Patiktok and Pamahiya the same product? If different, Patiktok has no `/features` entry. → **0012 Papic** owner to clarify.

4. **Pro-tier free duration mismatch on `/for-vendors`**
   - Top promo line: *"Pro tier **free for 10 months** when you pre-register today"*
   - Pricing detail: *"Pro tier and the All Tools Unlock annual bundle are **free until Mar 31, 2027**"*
   - From 2026-05-18 → 2027-03-31 is roughly 10.5 months, so probably consistent but worded incompatibly. → **0015** copy pass.

5. **Concierge "3-day free trial" claim on `/pricing`** — appears on the Concierge card. Concierge is a paid active wizard per the spec (project memory: "Concierge objective"). Does the 3-day free trial fit the spec, or is it new? → **0021 couple dashboard** + decision log check.

6. **HTML-entity escape bug in `/features`** — apostrophes and dashes show as literal `\&rsquo;s` and `\&mdash;` in places (e.g. "wedding\&rsquo;s look", "your photos \&mdash; the data"). Suggests the MDX/markdown source on the server isn't escaping properly through SSR. → **0015** content pipeline bug.

7. **`/vendors` shows "Unnamed vendor — Coming soon" placeholder card** — server-rendered HTML returns a single placeholder, vendor list hydrates client-side. Either no public vendors yet (expected pre-launch), or SSR/client mismatch. Per "No dev text post-launch" memory, "Unnamed vendor" reads engineered — revisit closer to launch. → **0006** + **0015**.

8. **`/download` (Mac app) not in sitemap** — page is live (200), references `/api/download/mac`, Tauri app v0.0.1 released 2026-05-14. Either intentional (gated discovery) or sitemap-out-of-date. → **0000** + sitemap config in **0015**.

9. **Routes allowed by robots.txt but 404 in production:** `/blog`, `/supplies`, `/suppliers`. Either pre-built routes or robots.txt drift. → **0015** robots config.

10. **Wallet/balance UI** — confirmed NOT present on any captured public route (good — matches "No wallet in Setnayan" memory and 0034 order-and-pay policy). The iteration 0000 spec-drift wallet pill stays unimplemented on the live site.

---

## What's NOT in this snapshot

- **Dynamic vendor profiles `/v/<slug>`** — vendor directory hydrates client-side; SSR HTML returns 0 vendor slugs. To capture these we'd need either an authenticated session or to run a headless browser. Templates only — unique content is at the route-level pages above.
- **Authenticated surfaces** — `/dashboard`, `/vendor-dashboard`, `/admin`, `/receipts` are all `Disallow:` in robots and require sign-in. Out of scope for the public crawl.
- **API responses** — `/api/*` is `Disallow:`. Not captured.

---

## Cross-reference docs — for clustering in Cowork

To make the snapshot directly clusterable instead of forcing you to read 13 pages page-by-page, four behavioral inventories sit at the snapshot root:

| Doc | What it gives you |
|-----|--------------------|
| [_BUTTONS.md](_BUTTONS.md) | Every link + button across all 13 pages, with destination URL. Broken targets (`/apply`, `/blog`, `/supplies`, `/suppliers`) called out at the top. Use this to map button connections. |
| [_FORMS.md](_FORMS.md) | Every form input on the public site (vendors search, help contact form, login, signup, waitlist) with label, type, placeholder, DOM `name`, and required flag. Use this for "data input and output" clustering. |
| [_PRICES.md](_PRICES.md) | Every ₱ figure and FREE claim, indexed both by price (each unique price → where it appears) and by page (every price on each page) with surrounding context. Use this to reconcile against `0003_service_catalog`. |
| [_FUNCTIONS.md](_FUNCTIONS.md) | Every heading (H1–H4) across all pages in nested hierarchy. The "what the site says it does" inventory. Use this to map functions to iteration folders. |

Per-page `.md` files (`home.md`, `features.md`, etc.) still hold the prose; the four `_*.md` files are the structured cross-reference layer on top.

Backing data: [rendered/all-inventories.json](rendered/all-inventories.json) holds the combined machine-readable extract for all 13 routes. Regeneration script: [rendered/extract.py](rendered/extract.py).

## Additional drift flags revealed by the inventories

11. **Patiktok has two pricing tiers — only one is on `/pricing`**. `/privacy` (TikTok integration section, iteration **0017**) describes both:
   - **Personal tier ₱1,999/day** — couple's own TikTok account, requires Login Kit + Content Posting API
   - **Setnayan tier ₱999/day** — posts to @SetnayanWeddings, no couple-side TikTok needed
   `/pricing` only lists "Patiktok FREE/₱999 · per day" — the Personal tier is missing. → **0017** (Patiktok) + **0015**.

12. **Patiktok iteration tag found** — `/privacy` explicitly says "TikTok integration (Patiktok · iteration 0017)". This resolves earlier "Patiktok vs Pamahiya" question — they're separate products, Patiktok = TikTok booth = iteration 0017. → **0017**.

13. **Setnayan Pay worked example on homepage uses ₱100,000 / ₱5,000 / ₱105,000** — 5.0% flat fee math is transparent. Matches `/for-vendors` and `/pricing` claims. → **0034 payments/cart** (no drift, but verify the math is the same in code).

14. **Login page exposes both password and magic-link flow** — two separate forms (one with `email` + `password`, second with just `email`). Cowork should confirm both are in the auth spec for **0000** + **0002**.

15. **/help has a working contact form** (sender_email, sender_name, topic, subject, body) with a topic select that includes: "I'm a couple planning an event", "I'm a vendor", "Billing or payments", "Bug report", "Feature request", "Other". → **0029** help center spec should list these exact topic values.

16. **Pamahiya still marketed on `/features` and `/`** — full H3 block with marketing copy and "Included in your custom quote" tag on `/features`, plus H3 mention on `/`. But **Pamahiya was retired entirely from the spec corpus on 2026-05-18** (CLAUDE.md decision-log row twelve, "V1.5+ → V1 promotion · Pamahiya retired entirely"). Per row 423, the iteration 0015 `.md` and `.html` files had Pamahiya removed, but the deployed `apps/web` page still shows it. Either the deployment hasn't refreshed since the spec change, or the live page is sourced from a different file. → **0015 main website** (verify deploy) + check if `apps/web/app/features/page.tsx` still references Pamahiya.

17. **`/waitlist` claims "Built-in dual e-signature on every vendor contract — free"** as a marketing bullet — but vendor contracts were shrunk to upload-only on 2026-05-18 (CLAUDE.md decision-log row ten, "Vendor contracts scope shrink — upload-only · Setnayan hosts PDFs but does NOT facilitate signing"). Setnayan no longer facilitates signing; waitlist copy promises a retired feature. → **0015 main website** (waitlist copy) + cross-ref to row 421.

---

## How to use this with Cowork

1. Open the relevant `_*.md` cross-reference doc (e.g. [_PRICES.md](_PRICES.md) for pricing reconciliation).
2. Compare each row against the matching iteration folder (`00NN_*/`) in the corpus root.
3. If the live site contradicts the spec, the spec wins — update the page (in code) to match.
4. If the live site reveals a spec gap, append a row to the **Decision log** at the bottom of [CLAUDE.md](../CLAUDE.md) and update the relevant iteration `.md`.
5. After spec edits, regenerate the `.docx` mirror per [COWORK.md](../COWORK.md) lines 44–54.

Start with drift flag #1 (broken `/apply` CTA) — that's the only one that breaks a live conversion. After that, work through the `_PRICES.md` doc against `0003_service_catalog` — that's where most fragmentation lives.
