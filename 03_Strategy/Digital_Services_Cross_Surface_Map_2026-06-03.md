# Digital Services — Cross-Surface Map · 2026-06-03

**Status.** Design lock 2026-06-03. The single reference for how the new **`DESIGN › Digital Services`** child tile + the re-mapped Setnayan in-app services surface on **every** Setnayan surface — onboarding, in-app services, vendor taxonomy, customer / vendor / admin dashboards, and the public website. Companion to the 2026-06-03 decision-log row ("🗂️ Setnayan in-app services RE-MAPPED…") + the placement edits in [Vendor_Taxonomy_Shrink_2026-05-30.md](Vendor_Taxonomy_Shrink_2026-05-30.md) and [Service_Specifications_2026-06-02.md](Service_Specifications_2026-06-02.md).

**The lock in one line.** A new **`Digital Services`** tile (Design's 8th child) is the marketplace home for five Setnayan digital/AI productions — **Pakanta · Animated Monogram · Pro Website · Live Venue Photo Wall · Live Background (Pailaw)**. It must read consistently for couples, vendors, and admins. On the **public website only**, these (and every Setnayan service) stay **flat, separate entities** — never grouped under a "Digital Services" bucket.

---

## 1. Naming canon (resolve the cross-surface drift)

Every surface must use the **canonical name**. The prototypes currently use inconsistent labels (right column) — retire them.

| Canonical name | What it is | Marketplace home | Iteration | Labels to RETIRE |
|---|---|---|---|---|
| **Pakanta** | Custom AI wedding song | Design › Digital Services | 0036 | — |
| **Animated Monogram** | Bespoke animated monogram (replaces the retired ₱1,999 Custom Monogram Pack) | Design › Digital Services | 0037 | "Custom Monogram", "Custom Monogram Pack" |
| **Pro Website** | Premium Invitation + Event Page + Editorial | Design › Digital Services | 0004 | "Invitation Bundle" |
| **Live Venue Photo Wall** | Live collage + live guest count at the venue | Design › Digital Services | (v2.1 §5 #10) | — |
| **Pailaw** *(Live Background)* | LED-wall design with monogram loop | Design › Digital Services | 0005 | "LED Background" used alone (keep as descriptor, anchor to **Pailaw**) |
| **Papic** | Designated-paparazzi capture | Documentary › Photo & Video | 0012 | "Paparazzi" as the product name (it's the tagline) |
| **Live Studio** | Multi-cam livestream | Documentary › Livestream | 0011 | "Live Stream" as the product name · formerly "Panood" |
| **Patiktok** | Vertical TikTok-format clip booth | Booths › Photo Booth | 0017 | — |
| **Pabati** | Short 5-sec video greetings | Booths › Photo Booth | (v2.1 §5 #19) | — |
| **Editorial** | Real-wedding editorial feature | Documentary › Editorial | 0046 | — |
| **Guest Stories · SDE · Thank You Video** | Papic **add-ons** (deliverables, not tiles) | under Papic (Photo & Video) | 0012 | listing them as standalone tiles |

---

## 2. Per-surface treatment

| Surface | File(s) | How Digital Services + the 5 members appear |
|---|---|---|
| **Marketplace taxonomy** | `Vendor_Taxonomy_Shrink_2026-05-30.md` · `apps/web/lib/taxonomy.ts` *(code)* | `Digital Services` is Design's 8th **child tile**. The 5 Setnayan services are **options inside** it (no Setnayan-branded tile). 3rd-party digital vendors can also list here — see §3. |
| **Onboarding picker** | `Onboarding_Blueprint_2026-05-30.md` §3.1a (screen 10) · `Onboarding_Wedding_Flow_2026-06-01.html` `PICK_INFO` *(prototype)* | `Digital Services` appears as the **8th Design picker chip** (category-level, like Stylist/Florist). Selecting it seeds the dashboard Services list + flags the 5 Setnayan services as suggestions on the post-account **"Your Plan"** screen. The picker stays category-level — the 5 members are NOT separate picker chips. |
| **Customer · in-app Services tab** | `0021_couple_dashboard_fully_purchased.md` · prototypes | The Services tab surfaces the 5 services under a **"Digital Services"** group, each with the **✦ Setnayan** badge + the **canonical name** (fixes the Paparazzi / LED Background / Invitation Bundle drift). **Choice-driven (owner-locked 2026-06-03):** a Setnayan service is **pre-added IFF its category was chosen in onboarding**; unchosen → hidden (still reachable via "add more"). Extends the "only picked categories show" rule from vendors to first-party services. |
| **Vendor · registration** | `0006_vendors_management.md` (`canonical_services` enum) · `0022_vendor_dashboard.md` (`service_category_primary` / `_secondary[]`) | `digital_services` is a registrable category under Design. A freelance monogram designer / wedding-website builder / LED-content studio can pick it as primary or secondary. |
| **Admin** | `0023_admin_console.md` (`/admin/taxonomy` · `/admin/pricing` · `/admin/addons`) · `0034_payments_and_cart.md` (`service_catalog`) | `/admin/taxonomy` shows the 10-parent tree incl. the Digital Services child. The SKU catalog gets a **`digital_services`** category so admin can price/toggle the 5 services in one bucket. |
| **Public website** | `0015_main_website.md` §7 · `0015_main_website.html` *(prototype)* | **Each service is its OWN visible card — flat, never grouped.** Deliberate divergence from the marketplace (§4). |

---

## 3. The 3rd-party rule (vendor-listable, Setnayan-heavy at launch)

`Digital Services` is a **generic, vendor-listable category** — NOT a Setnayan-only shelf. At launch its members are all first-party (the 5 above), but the tile is architected so a 3rd-party monogram designer, wedding-website builder, or LED-content studio can register under it later. This is why it does **not** reintroduce a "Setnayan-branded" tier — it reads as a normal Design child to couples and vendors alike. (Evidence: `Service_Specifications_2026-06-02.md` Digital Services tile + `Vendor_Taxonomy_Shrink_2026-05-30.md` §2.)

**How Setnayan's first-party services are populated (owner-locked 2026-06-03).** Setnayan's **main internal account operates its own first-party vendor account** — the Setnayan services (Papic · Live Studio · Pakanta · Pailaw · Animated Monogram · Pro Website · Live Venue Photo Wall · Patiktok · Pabati · …) are **vendor listings under that account**, managed via the normal vendor dashboard (0022) and tagged to their canonical category (the `setnayan: true` canonicals in `taxonomy.ts`). They surface like any vendor's listings but **float to the top** of every category they appear in (`is_setnayan_service` on the `vendor_market_stats` view · owner directive 2026-05-22 *"Setnayan will always be on top of all services when there is a service of setnayan"*). **Implication for the customer Services tab:** the choice-driven pre-add list should be **sourced from the Setnayan vendor account's listings for the couple's chosen categories** — converging the in-app `ADD_ONS` launcher (`vendors/_components/in-app-services-section.tsx`) with the same vendor model the marketplace uses, rather than a hardcoded SKU list.

---

## 4. Website ↔ marketplace divergence (owner-locked 2026-06-03)

Owner: *"for the website, they will all be visible on the website but they are all separate entities."*

- **Public website** = a **flat catalog of separate service entities**. Every Setnayan service (the 5 digital + Papic · Live Studio · Pakulay · Pareto/Camera Bridge · AI Highlight · etc.) is its **own card**. No "Digital Services" header, no grouping, no bucket.
- **In-app marketplace** = the 5 digital services **grouped** under the Design › Digital Services child tile.

Both are correct. The website sells each capability on its own merits; the marketplace organizes shopping by category. Do not "fix" the website to mirror the marketplace grouping.

---

## 5. Known gaps + follow-ups (NOT done in this spec lock)

**Code (separate PR · `setnayan-platform`):**
- `apps/web/lib/taxonomy.ts` — add the `Digital Services` Design tile · re-parent `setnayan_pakanta` / `setnayan_custom_monogram` / `setnayan_pailaw` · fold `setnayan_patiktok` + add `pabati` under Photo Booth.
- **SKU catalog — all 5 already exist** in `platform_retail_catalog_v2` (the V2 retail catalog · flat · no category column · prices owner-locked): **Animated Monogram ₱2,499 · Pro Website ₱2,999 · Live Venue Photo Wall (`LIVE_WALL`) ₱3,499 · Pakanta ₱3,499 · Pailaw / Live Background (`LIVE_BACKGROUND`) ₱2,499** ("LED Wall Design Background with Monogram" · split from the combined Live Wall row on the 2026-07-01 pricing pass). **No seed needed.** *(Correction 2026-06-03: an earlier draft of this doc wrongly flagged these as missing — they were added after the original V2 seed, in `20260701…_v2_pricing_screenshot_v3_alignment.sql`.)* The 0005 prototype's per-render pricing (₱249–₱899) is **stale** vs the locked flat ₱2,499.
- **✅ Presentation step SHIPPED 2026-06-04 (PR #880).** In-app services now nest INSIDE their category rails on the couple Services tab (✦ Setnayan cards, float-to-top) — Papic / Panood / Save-the-Date → Photography & Video · Patiktok → Photobooth · LED (Pailaw) → LED Background · Animated Monogram → a synthetic **Design › Digital Services** rail — sourced from the existing `apps/web/lib/add-ons-catalog.ts` (a single `category` field drives placement). The standalone launcher grid was retired; non-category tools (Orders · Playlist · Custom QR · Photo Delivery · Paprint · Indoor Blueprint) moved to a compact "Tools & extras" strip. **Still pending → the §3 end-state:** source the list from the real Setnayan first-party vendor account + choice-driven pre-add on category selection (retiring the hardcoded catalog), and add **Pakanta · Pro Website · Live Venue Photo Wall** to the catalog with setup routes (only the coming-soon Animated Monogram lives in the Digital Services rail today).

**Prototypes (HTML · Cowork/Claude-Code):**
- `Onboarding_Wedding_Flow_2026-06-01.html` `PICK_INFO` — add a `digital_services` chip to the Design group; fix the `led_wall` description (still says "your monogram" — monogram has moved out).
- `0021` dashboard HTML — add the 5 service cards under a Digital Services group + apply the canonical names.
- `0015` website HTML `.services-grid` — add the missing cards (Pakanta · Animated Monogram · Pro Website · Live Venue Photo Wall) as separate entities.

**Spec gap:**
- `0023` `/admin/taxonomy` has **no detailed surface spec** (only a one-line directory entry). Whether admin can CRUD tiles or only view is undocumented.

---

## 6. Cross-references

- [Vendor_Taxonomy_Shrink_2026-05-30.md](Vendor_Taxonomy_Shrink_2026-05-30.md) — the live 10-parent structure + the 2026-06-03 amendment banner.
- [Service_Specifications_2026-06-02.md](Service_Specifications_2026-06-02.md) §4 — the Digital Services tile schema.
- [02_Specifications/Vendor_Taxonomy_V1_Master.md](../02_Specifications/Vendor_Taxonomy_V1_Master.md) §4 — historical SETNAYAN SERVICE inserts (amended pointer).
- `CLAUDE-CODE-BRIEF-v2.1_2026-05-28.md` §5 — the 22-service Setnayan Productions catalog (canonical SKU enumeration).
- `DECISION_LOG.md` 2026-06-03 — the lock rows ("🗂️ Setnayan in-app services RE-MAPPED" + "🧭 cross-surface propagation").
- Surface specs: `Onboarding_Blueprint_2026-05-30.md` · `0021_couple_dashboard_fully_purchased.md` · `0006_vendors_management.md` · `0022_vendor_dashboard.md` · `0023_admin_console.md` · `0015_main_website.md`.
</content>
</invoke>
